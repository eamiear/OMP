<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称" v-model="listQuery.name"></el-input>

      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="fa-plus" @click="handleCreate">新增</el-button>

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

      <el-table-column align="center" label="序号" sortable>
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="名称">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.createTime | dateTimeFormat}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建者">
        <template scope="scope">
          <span>{{scope.row.creator}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新时间">
        <template scope="scope">
          <span>{{scope.row.updateTime | dateTimeFormat}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新者">
        <template scope="scope">
          <span>{{scope.row.updator}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="150px">
        <template scope="scope">
          <el-button type="success" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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

    <el-dialog :title="textMap[dialogStatus]" size="tiny" :visible.sync="dialogFormVisible">
      <el-form class="small-space" autoComplete="on" :model="themeBean" :rules="themeRules" ref="themeForm" label-position="left" label-width="70px" style='width: 60%; margin-left:50px;'>

        <el-form-item label="名称" prop="name">
          <el-input v-model="themeBean.name" autoComplete="on"></el-input>
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
  import * as themeService from '@/api/merchants/theme'
  import { EXCEPTION_STATUS_DESC_MAP, PAGINATION_PAGENO, PAGINATION_PAGESIZE, PAGINATION_PAGETOTAL } from '@/common/constants'
  import { Helper } from '@/common/helper'
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
        total: PAGINATION_PAGETOTAL,
        listQuery: {
          name: undefined,
          pageNo: PAGINATION_PAGENO,
          pageSize: PAGINATION_PAGESIZE
        },
        themeBean: {
          name: ''
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        tableKey: 0,
        utopaTableHeight: 0,
        list: [],
        themeRules: {
          name: [{ required: true, validator: validateThemeName }]
        }
      }
    },
    filters: {
      dateTimeFormat (datetime) {
        return Helper.parseTime(datetime)
      }
    },
    created () {
      this.getList()
    },
    watch: {
      dialogFormVisible (val) {
        if (val === false) {
          this.$refs.themeForm.resetFields()
        }
      }
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
        themeService.fetchThemeList(this.listQuery).then(response => {
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
      handleFilter () {
        this.getList()
      },
      handleCurrentChange (pageNo) {
        this.listQuery.pageNo = pageNo
        this.getList()
      },
      handleSizeChange (pageSize) {
        this.listQuery.pageSize = pageSize
        this.getList()
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
          pageNo: PAGINATION_PAGENO,
          pageSize: PAGINATION_PAGESIZE
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
