<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="编号" v-model="listQuery.code"></el-input>
      <el-input style="width: 200px;" class="filter-item" placeholder="名称" v-model="listQuery.name"></el-input>

      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" type="primary" icon="fa-plus" @click="handleCreate">新增</el-button>
      <el-button class="filter-item" type="primary" icon="fa-refresh" @click="handleRefresh">刷新</el-button>
    </div>
    <table-tree class="area-code-container"
                :listLoading="listLoading"
                :columns="columns"
                :tree-structure="true"
                :data-source="list"
                @create="handleCreate"
                @update="handleUpdate"
                @delete="handleDelete"></table-tree>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" size="tiny">
      <el-form :model="catalogModel" ref="catalogForm" :rules="catalogRules" label-position="left" label-width="70px" style='width: 300px; margin-left:50px;'>
        <el-form-item label="编号">
          <el-input v-model="catalogModel.categoryNo" autofocus></el-input>
        </el-form-item>

        <el-form-item label="名称">
          <el-input v-model="catalogModel.categoryName"></el-input>
        </el-form-item>

        <el-form-item label="父名称">
          <el-input v-model="catalogModel.parentColumnNo" :readonly="isReadOnly"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="catalogModel.order"></el-input>
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
  import * as themeService from '@/api/theme'
  import { EXCEPTION_STATUS_DESC_MAP } from '@/common/constants'
  import { Helper } from '@/common/helper'
  import TableTree from '@/components/table/TableTree.vue'

  export default {
    name: 'themeList',
    data () {
      const validateThemeName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('名称不能为空'))
        } else {
          callback()
        }
      }
      return {
        listLoading: true,
        total: 1000,
        listQuery: {
          categoryNo: '',
          categoryName: '',
          pageNo: '',
          pageSize: ''
        },
        catalogModel: {
          categoryNo: '',
          categoryName: '',
          parentColumnNo: '',
          sort: 0
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        tableKey: 0,
        isReadOnly: false,
        utopaTableHeight: 0,
        list: [],
        catalogRules: {
          name: [{ required: true, validator: validateThemeName }]
        },
        columns: [
          {
            text: '编号',
            dataIndex: 'categoryNo'
          },
          {
            text: '名称',
            dataIndex: 'name'
          },
          {
            text: '父编码',
            dataIndex: 'parentColumnNo'
          },
          {
            text: '排序',
            dataIndex: 'order'
          },
          {
            text: '更新时间',
            dataIndex: 'updateTime'
          },
          {
            text: '更新者',
            dataIndex: 'operator'
          }
        ]
      }
    },
    components: {
      TableTree
    },
    filters: {
      dateTimeFormat (datetime) {
        return Helper.parseTime(datetime)
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
        this.utopaTableHeight = body.clientHeight - mainHeader.clientHeight * 2 - crumbNav.clientHeight - 70
      },
      // 获取列表
      getList () {
        this.listLoading = true
        themeService.fetchThemeList().then(response => {
          const result = response.data
          if (response.status === 200 && result.code === 0) {
            this.list = result.data.infos
          } else {
            this.$message({
              message: EXCEPTION_STATUS_DESC_MAP[result.code] || '登录失败',
              type: 'error'
            })
          }
          this.listLoading = false
        }).catch(err => {
          this.$message({
            title: '失败',
            message: EXCEPTION_STATUS_DESC_MAP[err.code] || '获取数据失败',
            type: 'error',
            duration: 2000
          })
          this.listLoading = false
        })
      },
      // TODO 查询
      handleFilter () {
        this.getList()
      },
      handleCurrentChange (pageIndex) {
        // TODO pagination change current page
        console.log('click page: ' + pageIndex)
      },
      handleSizeChange (pageIndex) {
        // TODO pagination change page size
        console.log('click page size: ' + pageIndex)
      },
      // 重置弹窗表单
      resetDialogFormBean () {
        this.themeBean = {
          name: undefined
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
        this.resetDialogFormBean()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      // 点击修改按钮
      handleUpdate (row) {
        this.themeBean = Object.assign({}, row)
        this.dialogStatus = 'update'
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
              _this.getList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: EXCEPTION_STATUS_DESC_MAP[result.code] || '删除失败!'
              })
            }
          }).catch((err) => {
            this.$message({
              type: 'error',
              message: EXCEPTION_STATUS_DESC_MAP[err.code] || '服务出错'
            })
            console.log(err)
          })
        }).catch(() => {

        })
      },
      // 新增业务操作
      create () {
        const _this = this
        _this.$refs.themeForm.validate(valid => {
          if (valid) {
            themeService.createThemeItem(_this.themeBean).then((response) => {
              const result = response.data
              if (response.status === 200 && result.code === 0) {
                _this.getList()
              } else {
                _this.$message({
                  type: 'error',
                  message: EXCEPTION_STATUS_DESC_MAP[result.code] || '添加失败!'
                })
              }
            }).catch(() => {
              _this.$message({
                type: 'error',
                message: '新增失败'
              })
            })
            _this.dialogFormVisible = false
          }
        })
      },
      // 编辑业务操作
      update () {
        const _this = this
        _this.$refs.themeForm.validate(valid => {
          if (valid) {
            themeService.updateThemeItem(_this.themeBean).then((response) => {
              const result = response.data
              if (response.status === 200 && result.code === 0) {
                _this.getList()
              }
            }).catch((err) => {
              console.log('updateTheme', err)
              _this.$message({
                type: 'error',
                message: '编辑失败'
              })
            })
            _this.dialogFormVisible = false
          }
        })
      },
      // 删除业务操作
      remove (id) {
        return themeService.deleteThemeItem(id)
      }
    }
  }
</script>
