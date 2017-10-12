<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="期数/主题/标题" v-model="listQuery.name"></el-input>

      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <router-link :to="'/merchant/spicyleader/create'">
        <el-button class="filter-item" type="primary" icon="fa-plus" @click="handleFilter">
          新增
        </el-button>
      </router-link>

      <el-button class="filter-item" type="primary" icon="fa-refresh" @click="handleRefresh">刷新</el-button>
    </div>
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
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="子标题" min-width="120px">
        <template scope="scope">
          <span>{{scope.row.childTitle}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="主题">
        <template scope="scope">
          <span>{{scope.row.theme}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建者">
        <template scope="scope">
          <span>{{scope.row.creator}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新时间">
        <template scope="scope">
          <span>{{scope.row.updateTime}}</span>
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

      <el-table-column align="left" label="操作" min-width="180px">
        <template scope="scope">
          <el-button size="small" @click="handlePreview(scope.row)">预览</el-button>
          <el-button v-if="scope.row.status===0" size="small" type="success" @click="handlePublish(scope.row)">发布</el-button>
          <el-button type="success" size="small" >编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelRecord(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]"
                     :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"></el-pagination>
    </div>

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
  }
</style>

<script>
  import { fetchMenuList, createMenuItem, editMenuItem, deleteMenuItem } from '@/api/system_menu'
  import { fetchSpicyLeaderList } from '@/api/spicyleader'
  import TableTree from '@/components/table/TableTree.vue'

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
        list: []
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
      // 获取列表
      getList () {
        this.listLoading = true
        console.log('fetchMenuList', fetchMenuList)
        fetchSpicyLeaderList().then(response => {
          const result = response.data
          console.log('dfd', response)
          if (response.status === 200 && result.code === 0) {
            this.list = result.data.infos
            this.total = result.data.total
          }
          this.listLoading = false
        }).catch(err => {
          console.log(err)
          this.$notify({
            title: '失败',
            message: '获取数据失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      // 查询
      handleFilter () {
        this.getList()
      },
      handleModifyStatus (row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      handlePreview (row) {
        // TODO preview record
      },
      handlePublish (row, action) {
        // TODO publish record
      },
      handleDelRecord (row) {
        // TODO delete record
      },
      handleCurrentChange (pageIndex) {
        // TODO pagination change current page
        console.log('click page: ' + pageIndex)
      },
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
      // 重置弹窗表单
      resetDialogFormTemp () {
        this.dialogFormTemp = {
          id: undefined,
          name: undefined,
          code: undefined,
          pcode: undefined,
          order: 0
        }
      },
      // 重置查询列表
      resetListQuery () {
        this.listQuery = {
          name: undefined,
          code: undefined
        }
      },
      // 点击刷新
      handleRefresh () {
        this.resetListQuery()
        this.getList()
      },
      // 点击新增按钮
      handleCreate (row) {
        this.resetDialogFormTemp()
        this.dialogFormTemp.pcode = row.code
        this.dialogStatus = 'create'
        this.isReadOnly = true
        this.dialogFormVisible = true
      },
      // 点击修改按钮
      handleUpdate (row) {
        this.dialogFormTemp = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.isReadOnly = true
        this.dialogFormVisible = true
      },
      // 点击删除按钮
      handleDelete (row) {
        const _this = this
        this.$confirm('即将删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.remove(row.id).then((response) => {
            const result = response.data
            if (response.status === 200 && result.code === 0) {
              _this.delNodeById(_this.dataSource, row.id)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          }).catch((err) => {
            this.$message({
              type: 'error',
              message: '服务出错'
            })
            console.log(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 新增业务操作
      create () {
        const _this = this
        createMenuItem(this.dialogFormTemp).then((response) => {
          const result = response.data
          if (response.status === 200 && result.code === 0) {
            _this.getList()
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '新增失败'
          })
        })
        this.dialogFormVisible = false
      },
      // 编辑业务操作
      update () {
        const _this = this
        editMenuItem(this.dialogFormTemp).then((response) => {
          const result = response.data
          if (response.status === 200 && result.code === 0) {
            _this.getList()
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '编辑失败'
          })
        })
        this.dialogFormVisible = false
      },
      // 删除业务操作
      remove (id) {
        return deleteMenuItem(id)
      }
    }
  }
</script>
