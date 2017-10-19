<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="菜单名称" v-model="listQuery.name"></el-input>

      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="fa-refresh" @click="handleRefresh">刷新</el-button>
    </div>
    <table-tree class="area-code-container"
                :listLoading="listLoading"
                :columns="columns"
                :tree-structure="true"
                :data-source="dataSource"
                @create="handleCreate"
                @update="handleUpdate"
                @delete="handleDelete"
    ></table-tree>

    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" size="tiny">
      <el-form :model="dialogFormTemp" label-position="left" label-width="70px" style='width: 300px; margin-left:50px;'>
        <el-form-item label="地域名称">
          <el-input v-model="dialogFormTemp.name" autofocus></el-input>
        </el-form-item>

        <el-form-item label="地域编码">
          <el-input v-model="dialogFormTemp.code"></el-input>
        </el-form-item>

        <el-form-item label="父编码">
          <el-input v-model="dialogFormTemp.pcode" :readonly="isReadOnly"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="dialogFormTemp.order"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
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
    .area-code-container{
      width: 100%;
      margin-top: 10px;
    }
  }
</style>

<script>
  import { fetchMenuList, createMenuItem, editMenuItem, deleteMenuItem } from '@/api/system/menu'
  import TableTree from '@/components/table/TableTree.vue'

  export default {
    name: 'areaCode',
    data () {
      return {
        listLoading: true,
        listQuery: {
          name: undefined,
          code: undefined
        },
        dialogFormTemp: {
          id: undefined,
          name: undefined,
          code: undefined,
          pcode: undefined,
          order: 0
        },
        isReadOnly: false,
        dialogFormVisible: false,
        dialogStatus: '',
        dialogTitleMap: {
          update: '编辑',
          create: '新增'
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
        dataSource: []
      }
    },
    components: {
      TableTree
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    created () {
      this.getList()
    },
    methods: {
      // 获取列表
      getList () {
        this.listLoading = true
        console.log('fetchMenuList', fetchMenuList)
        fetchMenuList().then(response => {
          const result = response.data
          console.log('dfd', response)
          if (response.status === 200 && result.code === 0) {
            this.dataSource = result.data
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
