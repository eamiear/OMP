<template>
  <div class="app-container">
    <!-- toolbar start -->
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="期数/主题/标题" v-model="listQuery.name"></el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <router-link :to="{path: '/merchant/spicyleader/create'}">
        <el-button class="filter-item" type="primary" icon="fa-plus" @click="handleFilter">
          新增
        </el-button>
      </router-link>
      <el-button class="filter-item" type="primary" icon="fa-refresh" @click="handleRefresh">刷新</el-button>
    </div>
    <!-- toolbar end -->

    <el-table
      id="spicyleader"
      class="utable-container"
      :key='tableKey'
      :data="list"
      v-loading="listLoading"
      border fit highlight-current-row
      align="center"
      :height="utopaTableHeight"
      style="width: 100%">

      <el-table-column align="center" label="期数" width="90px" sortable>
        <template scope="scope">
          <span>第{{scope.row.periods}}期</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标题" min-width="120px">
        <template scope="scope">
          <span class="link-type" @click="handlePreview(scope.row)">{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="子标题" min-width="120px">
        <template scope="scope">
          <span>{{scope.row.childTitle}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="主题">
        <template scope="scope">
          <span>{{scope.row.tagName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.createTime | dateFormat}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建者">
        <template scope="scope">
          <span>{{scope.row.creator}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新时间">
        <template scope="scope">
          <span>{{scope.row.updateTime | dateFormat}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新者">
        <template scope="scope">
          <span>{{scope.row.updator}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template scope="scope">
          <el-tag :type="scope.row.status | statusStyleFilter">{{scope.row.status | statusLabelFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="投票状态" min-width="110px">
        <template scope="scope">
          <el-button size="small" :type="scope.row.voteStatus | voteStatusStyleFilter" @click="enableVote(scope.row.voteStatus)">{{scope.row.voteStatus | voteStatusLabelFilter}}</el-button>
          <el-button size="small" @click="handleVote(scope.row)">{{scope.row.voteId | voteLabelFilter}}</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="100px">
        <template scope="scope">
          <el-button v-if="scope.row.status===0" size="small" type="success" @click="handlePublish(scope.row, 'publish')">发布</el-button>
          <el-button v-if="scope.row.status===1" size="small" @click="handlePublish(scope.row, 'offshelf')">下架</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- pagination start -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]"
                     :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"></el-pagination>
    </div>
    <!-- pagination end -->

    <!-- Vote operation start-->
    <el-dialog :title="textMap[dialogStatus]" size="40" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form class="small-space" autoComplete="on"
               :model="voteModel"
               ref="voteForm"
               label-position="left" label-width="80px" style='margin-left:50px;'>

        <el-form-item label="投票名称" prop="title" style="width: 60%;"
                      :rules="{required: true, message: '投票名称不能为空', trigger: 'blur'}">
          <el-input v-model="voteModel.title" autoComplete="on"></el-input>
          <span class="counter inner">8/35</span>
        </el-form-item>

        <el-form-item label="截止时间" prop="overdue"
                      :rules="{required: true, message: '请选择截止日期时间', trigger: 'blur'}">
          <el-date-picker v-model="voteModel.overdue" type="datetime" placeholder="选择截止日期时间"></el-date-picker>
        </el-form-item>

        <el-form-item v-for="(vote, index) in voteModel.list"
                      :label="'选项' + numberToChineseFilter(index+1)"
                      :key="vote.key"
                      :prop="'list.' + index + '.title'"
                      :rules="{required: true, message: '选项不能为空', trigger: 'blur'}">

          <el-input style="width: 50%;" v-model="vote.title"></el-input>
          <el-button @click.prevent="">上传图片</el-button>
          <span class="link-type clean" @click.prevent="removeVoteItem(vote)">删除选项</span>
        </el-form-item>
        <hr class="margin-8"/>
        <span class="link-type clean" @click.prevent="addVoteItem">添加新选项</span>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createVote">确 定</el-button>
        <el-button v-else type="primary" @click="updateVote">确 定</el-button>
      </div>
    </el-dialog>
    <!-- Vote operation end-->

    <!-- preview paragraph  start -->
    <el-dialog title="文章预览" size="full" :visible.sync="previewDialogVisible">
      <el-form class="small-space" autoComplete="on" :model="previewModel" ref="previewForm" label-position="left" label-width="70px" style='width: 60%; margin-left:50px;'>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="previewDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- preview paragraph end -->

  </div>
</template>

<style lang="scss">
  .app-container{
    padding: 10px;

    .filter-container{
      .el-button{
        margin-left: 10px;
      }
    }
    .utable-container{
      width: 100%;
      margin-top: 10px;
    }
    .pagination-container{
      margin-top: 5px;
    }

    .link-type, .link-type:focus {
      color: #337ab7;
      cursor: pointer;
      text-decoration: underline;
    }
    .link-type.clean, .link-type.clean:focus{
      text-decoration: none;
    }
    .counter{
      color: #999;
      font-size: 13px;
      padding:0 5px;
    }
    .counter.inner{
      position: absolute;
      right: 0;
      top: 0;
    }
  }
</style>

<script>
//  import { fetchMenuList, createMenuItem, editMenuItem, deleteMenuItem } from '@/api/system_menu'
  import * as SpicyLeader from '@/api/spicyleader'
  import { success, error, info } from '@/utils/dialog'
  import { EXCEPTION_STATUS_DESC_MAP } from '@/common/constants'
  import { Helper } from '@/common/helper'
  import { Utopa } from '@/common/utopa'
  import TableTree from '@/components/table/TableTree'
  import { dateFormat } from '@/filters'

  export default {
    name: 'areaCode',
    data () {
      return {
        listLoading: true,
        total: 1000,
        listQuery: {
          page: 1,
          limit: 20,
          title: undefined,
          periods: undefined
        },
        columns: [
          {
            text: '菜单名称',
            dataIndex: 'name'
          },
          {
            text: '地域编码',
            dataIndex: 'code'
          },
          {
            text: '父编码',
            dataIndex: 'pcode'
          },
          {
            text: '排序',
            dataIndex: 'order'
          },
          {
            text: '创建时间',
            dataIndex: 'createTime'
          },
          {
            text: '更新时间',
            dataIndex: 'updateTime'
          },
          {
            text: '更新者',
            dataIndex: 'operator'
          }
        ],
        tableKey: 0,
        utopaTableHeight: 0,
        dataSource: [],
        list: [],

        // vote dialog
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          'create': '发起投票',
          'update': '修改投票'
        },
        voteTextCount: 0,
        voteTextCountTotal: 35,
        voteModel: {
          title: '',
          overdue: '',
          list: [{
            title: '',
            image: '',
            sort: 0
          }, {
            title: '',
            image: '',
            sort: 0
          }, {
            title: '',
            image: '',
            sort: 0
          }]
        },
        voteRules: {
          title: [{required: true}]
        },

        // preview dialog
        previewDialogVisible: false,
        previewModel: {}
      }
    },
    components: {
      TableTree
    },
    filters: {
      statusStyleFilter (status) {
        const statusMap = {
          0: 'gray',
          1: 'success',
          '-1': 'danger'
        }
        return statusMap[status]
      },
      statusLabelFilter (status) {
        const statusLabelMap = {
          0: '未发布',
          1: '已发布',
          '-1': '删除'
        }
        return statusLabelMap[status]
      },
      publishStatusFilter (status) {
        // TODO
      },
      dateFormat,
      voteLabelFilter (vote) {
        return vote ? '修改投票' : '发起投票'
      },
      voteStatusLabelFilter (status) {
        return status ? '禁用' : '启用'
      },
      voteStatusStyleFilter (status) {
        return status ? 'success' : 'warning'
      }
    },
    created () {
      this.getList()
    },
    mounted () {
      this.fixLayout()
      window.onresize = () => {
        return (() => {
          console.log(this.fixLayout)
          this.fixLayout()
        })()
      }
    },
    methods: {
      fixLayout () {
        const body = document.body
        const mainHeader = document.querySelector('.main-header')
        const crumbNav = document.querySelector('.breadcrumb-nav')
        let pagination = document.querySelector('.pagination-container')
        this.utopaTableHeight = body.clientHeight - mainHeader.clientHeight * 2 - crumbNav.clientHeight - pagination.clientHeight - 70
      },
      numberToChineseFilter (number) {
        return Helper.parseNumberToChinese(number)
      },
      // 获取列表
      getList () {
        this.listLoading = true
        SpicyLeader.fetchSpicyLeaderList().then(response => {
          const result = response.data
          if (response.status === 200 && result.code === 0) {
            this.list = result.data.infos
            this.total = result.data.total
          }
          this.listLoading = false
        })
      },
      // 查询
      handleFilter () {
        this.getList()
      },
      // 分页 -- 点击当前页
      handleCurrentChange (pageIndex) {
        // TODO pagination change current page
        console.log('click page: ' + pageIndex)
      },
      // 分页 -- 选择页数
      handleSizeChange (pageIndex) {
        // TODO pagination change page size
        console.log('click page size: ' + pageIndex)
      },
      // 根据节点ID删除节点
      delNodeById (dataSource, nId) {
        dataSource.forEach((node, index) => {
          if (node.id === nId) {
            dataSource.splice(index, 1)
            return
          } else if (node.children && node.children.length > 0) {
            this.delNodeById(node.children, nId)
          }
        })
      },
      // 重置投票model
      resetVoteModel () {
        this.voteModel = {
          title: '',
          overdue: '',
          list: [{
            title: '',
            image: '',
            sort: 0
          }, {
            title: '',
            image: '',
            sort: 0
          }, {
            title: '',
            image: '',
            sort: 0
          }]
        }
      },
      // 重置预览model
      resetPreviewModel () {
        this.previewModel = {}
      },
      // 重置查询列表
      resetListQuery () {
        this.listQuery = {
          name: undefined,
          code: undefined
        }
      },
      // 文章预览
      handlePreview (row) {
        // TODO preview record
        this.resetPreviewModel()
        this.previewDialogVisible = true
      },
      // 发布/下架文章
      handlePublish (row, action) {
        const _this = this
        const actionMap = {
          'publish': 1,
          'offshlef': 0
        }
        const actionMsg = {
          'publish': '发布',
          'offshelf': '下架'
        }
        SpicyLeader.publishSpicyLeader(row.id, actionMap[action]).then((response) => {
          if (Utopa.isValidRequest(response)) {
            _this.getList()
            success(actionMsg[action] + '成功')
          } else {
            error(actionMsg[action] + '失败')
          }
        })
      },
      // 刷新列表
      handleRefresh () {
        this.resetListQuery()
        this.getList()
      },
      // TODO 修改期数
      handleUpdate (row) {
        this.dialogFormTemp = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      // 删除期数
      handleDelete (row) {
        const _this = this
        this.$confirm('即将删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.remove(row.id).then((response) => {
            if (Utopa.isValidRequest(response)) {
              _this.remove(row.id).then(() => {
                success('删除成功!')
                _this.handleRefresh()
              })
            } else {
              error('删除失败')
            }
          })
        }).catch(() => {
          info('已取消删除')
        })
      },
      // 新增业务操作
      create () {
//        const _this = this
//        createMenuItem(this.dialogFormTemp).then((response) => {
//          const result = response.data
//          if (response.status === 200 && result.code === 0) {
//            _this.getList()
//          }
//        }).catch(() => {
//          this.$message({
//            type: 'error',
//            message: '新增失败'
//          })
//        })
        this.dialogFormVisible = false
      },
      // 编辑业务操作
      update () {
//        const _this = this
//        editMenuItem(this.dialogFormTemp).then((response) => {
//          const result = response.data
//          if (response.status === 200 && result.code === 0) {
//            _this.getList()
//          }
//        }).catch(() => {
//          this.$message({
//            type: 'error',
//            message: '编辑失败'
//          })
//        })
        this.dialogFormVisible = false
      },
      // 删除业务操作
      remove (id) {
        return SpicyLeader.deleteSpicyLeader(id)
      },
// ====================================================
// =================  投票     =========================
      // 发起投票
      handleVote (row) {
        row.tagStatus ? this.updateVoteHandle(row) : this.createVoteHandle()
      },
      createVoteHandle () {
        this.resetVoteModel()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      updateVoteHandle (row) {
        this.voteModel = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      // 启用/禁用投票
      enableVote (voteStatus) {
        const statusMap = {
          0: '启用',
          1: '禁用'
        }
        SpicyLeader.enableVote(voteStatus).then((response) => {
          const result = response.data
          Utopa.isValidRequest(response) ? success((statusMap[voteStatus] || '操作') + '成功') : error(EXCEPTION_STATUS_DESC_MAP[result.code] || ((statusMap[voteStatus] || '操作') + '失败'))
        }).catch(err => {
          console.log(err)
          error('服务出错')
        })
      },
      // add a new vote item option
      addVoteItem () {
        if (this.voteModel.list.length >= 5) {
          info('最多添加五项')
          return
        }
        this.voteModel.list.push({
          title: '',
          image: '',
          sort: 0
        })
      },
      // remove vote item option
      removeVoteItem (vote) {
        const index = this.voteModel.list.indexOf(vote)
        index !== -1 && this.voteModel.list.splice(index, 1)
      },
      // create vote item
      createVote () {
        const _this = this
        _this.$refs.voteForm.validate(valid => {
          if (valid) {
            SpicyLeader.createVote(_this.voteModel).then(response => {
              Utopa.isValidRequest(response) && _this.getList()
              _this.dialogFormVisible = false
            })
          }
        })
      },
      // update vote item
      updateVote () {
        const _this = this
        _this.$refs.voteForm.validate(valid => {
          if (valid) {
            SpicyLeader.updateVote(_this.voteModel).then(response => {
              Utopa.isValidRequest(response) && _this.getList()
              _this.dialogFormVisible = false
            })
          }
        })
      }
    }
  }
</script>
