<template>
  <div class="app-container">
    <!-- toolbar start -->
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="标题" v-model="listQuery.title"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="主题" v-model="listQuery.tagName"></el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <router-link :to="{path: '/merchant/spicyleader/create'}">
        <el-button class="filter-item" type="primary" icon="fa-plus">
          新增
        </el-button>
      </router-link>
      <el-button class="filter-item" type="primary" icon="fa-refresh" @click="handleRefresh">刷新</el-button>
    </div>
    <!-- toolbar end -->

    <!-- table list start -->
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

      <el-table-column align="center" label="期数" sortable>
        <template scope="scope">
          <span>第{{scope.row.periods}}期</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标题">
        <template scope="scope">
          <span class="link-type" @click="handlePreview(scope.row)">{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="子标题">
        <template scope="scope">
          <span>{{scope.row.childTitle}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="主题">
        <template scope="scope">
          <span>{{scope.row.tagName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="商场">
        <template scope="scope">
          <span>{{scope.row.mallName}}</span>
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
          <el-button size="small" :type="scope.row.voteStatus | voteStatusStyleFilter" @click="enableVote(scope.row)">{{scope.row.voteStatus | voteStatusLabelFilter}}</el-button>
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
    <!-- table list end -->

    <!-- pagination start -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.pageNo"
                     :page-sizes="[10,20,30, 50]"
                     :page-size="listQuery.pageSize"
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
          <span class="counter inner">{{voteCount}}/{{voteTitleCount}}</span>
        </el-form-item>

        <el-form-item label="截止时间" prop="overdue"
                      :rules="{type: 'date', required: true, message: '请选择截止日期时间', trigger: 'change'}">
          <el-date-picker v-model="voteModel.overdue" format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择截止日期时间"></el-date-picker>
        </el-form-item>

        <el-form-item v-for="(vote, index) in voteModel.voteItemList"
                      :label="'选项' + numberToChineseFilter(index+1)"
                      :key="vote.key"
                      :prop="'voteItemList.' + index + '.title'"
                      :rules="{required: true, message: '选项不能为空', trigger: 'blur'}">

          <el-input style="width: 50%;" v-model="vote.title"></el-input>
          <span class="counter inner" style="font-size: 12px;">最多输入{{voteTitleCount}}个字符</span>
          <MultiUpload
            :extra="vote"
            :postData="voteData"
            :requestUrl="voteAction"
            :onSuccess="handleVoteAvatarScucess"
            :onBeforeUpload="beforeVoteAvatarUpload"
            uploadText="头像上传"></MultiUpload>
          <div class="vote-avatar-preview">
            <div class="avatar-preview-wrapper" v-show="vote.image">
              <img :src="vote.image">
            </div>
          </div>
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
      <!--<el-form class="small-space" autoComplete="on" :model="previewModel" ref="previewForm" label-position="left" label-width="70px" style='width: 60%; margin-left:50px;'>-->

      <!--</el-form>-->
      <spicy-preview :magazineId="previewMagazineId" :key="previewKey"></spicy-preview>
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
  .vote-avatar-uploader{
    display: inline-block;
  }
  .vote-avatar-preview{
    display: inline-block;
    float: left;
    width: 36px;
    height: 36px;
    border: 1px double #999;
    margin: 0 4px;
    border-radius: 50%;
    overflow: hidden;
  }
  .avatar-preview-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      vertical-align: top;
    }
  }
</style>

<script>
  import * as SpicyLeader from '@/api/merchants/spicyleader'
  import { getQiNiuToken } from '@/api/common/qiniu'
  import { success, error, info } from '@/utils/dialog'
  import { EXCEPTION_STATUS_DESC_MAP, QINIU_IMAGE_REQUEST_BASEURL, QINIU_UPLOAD_URL, PAGINATION_PAGENO, PAGINATION_PAGESIZE, PAGINATION_PAGETOTAL } from '@/common/constants'
  import { Helper } from '@/common/helper'
  import { Utopa } from '@/common/utopa'
  import TableTree from '@/components/table/TableTree'
  import MultiUpload from '@/components/Upload/multiUpload'
  import SpicyPreview from './preview'
  import { dateFormat } from '@/filters'
  import Vote from './vote'

  export default {
    name: 'spicylist',
    data () {
      return {
        listLoading: true,
        total: PAGINATION_PAGETOTAL,
        listQuery: {
          pageNo: PAGINATION_PAGENO,
          pageSize: PAGINATION_PAGESIZE,
          title: undefined,
          tagName: undefined,
          periods: undefined,
          mallName: undefined
        },
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
          magazineId: undefined,
          overdue: '',
          voteItemList: [{
            title: '',
            image: '',
            imageKey: '',
            sort: 0
          }, {
            title: '',
            image: '',
            imageKey: '',
            sort: 0
          }, {
            title: '',
            image: '',
            imageKey: '',
            sort: 0
          }]
        },
        voteRules: {
          title: [{required: true}]
        },
        voteAction: QINIU_UPLOAD_URL,
        voteImageReqBaseUrl: QINIU_IMAGE_REQUEST_BASEURL,
        voteData: { token: '' },
        voteTitleCount: 35,

        // preview dialog
        previewDialogVisible: false,
        previewModel: {},
        previewKey: undefined,
        previewMagazineId: undefined,
        previewVoteId: undefined
      }
    },
    components: {
      TableTree,
      Vote,
      MultiUpload,
      SpicyPreview
    },
    computed: {
      voteCount () { // 摘要字数
        return this.voteModel.title.length
      }
    },
    watch: {
      'voteModel.title': function (val) {
        if (this.voteCount >= this.voteTitleCount) {
          this.$nextTick(() => { this.voteModel.title = val.slice(0, this.voteTitleCount) })
        }
      },
      'voteModel.voteItemList': {
        handler: function (itemList) {
          Array.from(itemList).forEach((item) => {
            if (item.title.length >= this.voteTitleCount) {
              this.$nextTick(() => { item.title = item.title.slice(0, this.voteTitleCount) })
            }
          })
        },
        deep: true
      },
      'dialogFormVisible': function (val) {
        if (val === false) {
          this.$refs.voteForm.resetFields()
        }
      },
      'previewDialogVisible': function (val) {
        if (val === true) {
          this.previewKey = this.previewMagazineId + Math.random() * 10
        }
      }
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
        return !status ? 'success' : 'warning'
      }
    },
    created () {
      this.getList()
    },
    mounted () {
      this.fixLayout()
      window.onresize = () => {
        return (() => {
          this.$nextTick(() => { this.fixLayout() })
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
        SpicyLeader.fetchSpicyLeaderList(this.listQuery).then(response => {
          const result = response.data
          if (Utopa.isValidRequest(response)) {
            this.list = result.data.infos
            this.total = result.data.total
          }
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      // 查询
      handleFilter () {
        this.getList()
      },
      // 分页 -- 点击当前页
      handleCurrentChange (pageNo) {
        this.listQuery.pageNo = pageNo
        this.getList()
      },
      // 分页 -- 选择页数
      handleSizeChange (pageSize) {
        this.listQuery.pageSize = pageSize
        this.getList()
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
          magazineId: undefined,
          voteItemList: [{
            title: '',
            image: '',
            imageKey: '',
            sort: 0
          }, {
            title: '',
            image: '',
            imageKey: '',
            sort: 0
          }, {
            title: '',
            image: '',
            imageKey: '',
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
          pageNo: PAGINATION_PAGENO,
          pageSize: PAGINATION_PAGESIZE,
          title: undefined,
          periods: undefined
        }
      },
      // 文章预览
      handlePreview (row) {
        // TODO preview record
        this.resetPreviewModel()
        this.previewMagazineId = row.id
        this.previewVoteId = row.voteId
        this.previewDialogVisible = true
      },
      // 发布/下架文章
      handlePublish (row, action) {
        const actionMap = {
          'publish': 1,
          'offshelf': 0
        }
        const actionMsg = {
          'publish': '发布',
          'offshelf': '下架'
        }
        SpicyLeader.publishSpicyLeader(row.id, actionMap[action]).then((response) => {
          if (Utopa.isValidRequest(response)) {
            row.status = actionMap[action]
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
      // 删除期数业务操作
      remove (id) {
        return SpicyLeader.deleteSpicyLeader(id)
      },
// ====================================================
// =================  投票     =========================
      // 发起投票
      handleVote (row) {
        row.voteId ? this.updateVoteHandle(row) : this.createVoteHandle(row)
      },
      // 发起投票弹窗处理
      createVoteHandle (row) {
        this.resetVoteModel()
        this.voteModel.magazineId = row.id
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      // 更新投票弹窗处理
      updateVoteHandle (row) {
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        SpicyLeader.fetchVotesByMagazineId(row.id).then(response => {
          const result = response.data.data
          if (Utopa.isValidRequest(response)) {
            this.voteModel = result
            this.voteModel.id = row.voteId
            this.voteModel.magazineId = row.id
            this.voteModel.overdue = new Date(this.voteModel.overdue)
          }
        }).catch(err => {
          Helper.log(err)
        })
      },
      // 启用/禁用投票
      enableVote (vote) {
        const statusMap = {
          0: '启用',
          1: '禁用'
        }
        SpicyLeader.enableVote(vote.voteId, vote.id, vote.voteStatus === 0 ? 1 : 0).then((response) => {
          if (Utopa.isValidRequest(response)) {
            success((statusMap[vote.voteStatus] || '操作') + '成功')
            vote.voteStatus = vote.voteStatus === 0 ? 1 : 0
          } else {
            error(Utopa.failTips(response, (statusMap[vote.voteStatus] || '操作') + '失败'))
          }
        }).catch(err => {
          Helper.log(err)
          error('服务出错')
        })
      },
      // 头像上传成功
      handleVoteAvatarScucess (response, file, fileList, vote) {
        const qiniuServer = QINIU_IMAGE_REQUEST_BASEURL
        vote.image = qiniuServer + response.key
        vote.imageKey = response.key
      },
      // 头像上传前的处理
      beforeVoteAvatarUpload () {
        const _this = this
        return new Promise((resolve, reject) => {
          getQiNiuToken().then(response => {
            const token = response.data.data.upToken
            _this.voteData.token = token
            resolve(true)
          }).catch(err => {
            Helper.log(err)
            reject(false)
          })
        })
      },
      // add a new vote item option
      addVoteItem () {
        if (!(this.voteModel && this.voteModel.voteItemList)) {
          Helper.log('voteModel is empty!')
          return false
        }
        if (this.voteModel.length >= 5) {
          info('最多添加五项')
          return
        }
        this.voteModel.voteItemList.push({
          title: '',
          image: '',
          imageKey: '',
          sort: 0
        })
      },
      // remove vote item option
      removeVoteItem (vote) {
        const _this = this
        if (!vote.id) {
          const index = _this.voteModel.voteItemList.indexOf(vote)
          index !== -1 && _this.voteModel.voteItemList.splice(index, 1)
        } else {
          SpicyLeader.deleteVoteItem(vote.id).then(response => {
            if (Utopa.isValidRequest(response)) {
              const index = _this.voteModel.voteItemList.indexOf(vote)
              index !== -1 && _this.voteModel.voteItemList.splice(index, 1)
            } else {
              error(response.data.msg)
            }
          }).catch(err => {
            error('服务出错!')
            Helper.log('deleteVoteItem -> ', err)
          })
        }
      },
      // create vote item
      createVote () {
        const _this = this
        _this.$refs.voteForm.validate(valid => {
          if (valid) {
            _this.voteModel.overdue = Helper.parseTime(_this.voteModel.overdue)
            SpicyLeader.createVote(_this.voteModel).then(response => {
              if (Utopa.isValidRequest(response)) {
                success('创建成功')
                _this.getList()
              } else {
                error(EXCEPTION_STATUS_DESC_MAP[response.data.code] || '创建失败')
              }
              _this.dialogFormVisible = false
            }).catch(err => {
              Helper.log(err)
              error('服务出错')
            })
          }
        })
      },
      // update vote item
      updateVote () {
        const _this = this
        _this.$refs.voteForm.validate(valid => {
          if (valid) {
            _this.voteModel.overdue = Helper.parseTime(_this.voteModel.overdue)
            SpicyLeader.updateVote(_this.voteModel).then(response => {
              if (Utopa.isValidRequest(response)) {
                success('更新成功')
                _this.getList()
              } else {
                error(EXCEPTION_STATUS_DESC_MAP[response.data.code] || '更新失败')
              }
              _this.dialogFormVisible = false
            }).catch(err => {
              Helper.log(err)
              error('服务出错')
            })
          }
        })
      }
    }
  }
</script>
