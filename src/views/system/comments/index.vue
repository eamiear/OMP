<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="评论内容" v-model="listQuery.title"></el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">查询</el-button>
    </div>
    <el-table
      id="comments"
      class="utable-container"
      :key='tableKey'
      :data="list"
      v-loading="listLoading"
      border fit highlight-current-row
      align="center"
      :height="utopaTableHeight"
      style="width: 100%">

      <el-table-column align="center" label="编号">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户名">
        <template scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="类型">
        <template scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="评论对象">
        <template scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="IP地址">
        <template scope="scope">
          <span>{{scope.row.ip}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="评论时间">
        <template scope="scope">
          <span>{{scope.row.commentsTime | dateTimeFormat}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template scope="scope">
          <span>{{scope.row.status | statusFormat}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="150px">
        <template scope="scope">
          <el-button v-if="scope.row.status===1" size="small" @click="handleAvailable(scope.row, 'hide')">隐藏</el-button>
          <el-button v-else="scope.row.status===2" size="small" @click="handleAvailable(scope.row, 'show')">显示</el-button>
          <el-button type="warn" size="small" @click="handleHotTopic(scope.row)">热评</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">移除</el-button>
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

    <!-- create new user -->
    <el-dialog title="添加用户" size="tiny" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form class="small-space" autoComplete="on" :model="replyModel" :rules="replyModelRules" ref="replyModelForm" label-position="left" label-width="70px" style='width: 60%; margin-left:50px;'>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="replyModel.userName" autoComplete="on"></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="replyModel.email"></el-input>
        </el-form-item>
        <el-form-item label="回复内容" prop="content">
          <el-input type="textarea" v-model="replyModel.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="create">确 定</el-button>
      </div>
    </el-dialog>
    <!-- end create user -->
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
  import * as userService from '@/api/system/user'
  import { success, error } from '@/utils/dialog'
  import { EXCEPTION_STATUS_DESC_MAP, CLIENT_TYPES_MAP } from '@/common/constants'
  import { Helper } from '@/common/helper'
  import { Utopa } from '@/common/utopa'

  export default {
    name: 'userList',
    data () {
      const validateModel = (rule, value, callback) => {
        if (!value) {
          callback(new Error(rule.field + '不能为空'))
        } else {
          callback()
        }
      }
      return {
        listLoading: true,
        total: 1000,
        listQuery: {
          title: '',
          page: 1,
          limit: 10
        },
        dialogFormVisible: false,
        tableKey: 0,
        utopaTableHeight: 0,
        list: [],             // 表格数据信息
        replyModel: {          // 回复模型
          userName: '',
          email: '',
          content: ''
        },
        replyModelRules: {   // 检验规则
          content: [{ required: true, message: '不能为空', validator: validateModel }]
        },
        userState: { // 用户状态
          1: '启用',
          2: '禁用'
        },
        clientTypes: []         // 平台类型
      }
    },
    filters: {
      dateTimeFormat (datetime) {
        return datetime && Helper.parseTime(datetime)
      },
      statusFormat (type) {
        return type && CLIENT_TYPES_MAP[type]
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
        //  TODO
        const mainHeader = document.querySelector('.main-header')
        const crumbNav = document.querySelector('.breadcrumb-nav')
        const filterContainer = document.querySelector('.filter-container')
        let pagination = document.querySelector('.pagination-container')
        this.utopaTableHeight = body.clientHeight - mainHeader.clientHeight * 2 - crumbNav.clientHeight - filterContainer.clientHeight - pagination.clientHeight - 70
      },
      // 获取列表
      getList () {
        this.listLoading = true
        userService.fetchUserList().then(response => {
          const result = response.data
          if (Utopa.isValidRequest(response)) {
//            this.list = result.data.userList
          } else {
            error(EXCEPTION_STATUS_DESC_MAP[result.code] || '登录失败')
          }
          this.listLoading = false
        }).catch(err => {
          error(EXCEPTION_STATUS_DESC_MAP[err.code] || '获取数据失败')
          this.listLoading = false
        })
      },
      // TODO 查询
      handleFilter () {
        this.getList()
      },
      // 新增用户
      handleCreate (row) {
        this.resetUserModel()
        this.dialogFormVisible = true
      },
      // 热评
      handleHotTopic () {
        // TODO reset password
      },
      // refresh user lilst
      handleRefresh () {
        this.resetListQuery()
        this.getList()
      },
      // 显示/ 隐藏
      handleAvailable (row, action) {
        const actionMap = {
          'show': userService.disableUser,
          'hide': userService.enableUser
        }
        console.log(row)
        actionMap[action].call(null, row.uid).then(response => {
          if (Utopa.isValidRequest(response)) {
            this.getList()
            success(action === 'enable' ? '启用成功' : '禁用成功')
          } else {
            error(EXCEPTION_STATUS_DESC_MAP[response.data.code] || action === 'enable' ? '启用失败!' : '禁用失败!')
          }
        })
      },
      // TODO 删除
      handleDelete () {
        // TODO delete
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
      resetUserModel () {
        this.replyModel = {
          userName: '',
          email: '',
          content: ''
        }
      },
      // 重置查询列表
      resetListQuery () {
        this.listQuery = {
          title: '',
          page: 1,
          limit: 10
        }
      },
      // 创建回复内容
      create () {
        /*
        const _this = this
        _this.$refs.userModelForm.validate(valid => {
          if (valid) {
            userService.createUser(_this.userModel).then((response) => {
              const result = response.data
              Utopa.isValidRequest(response) ? _this.getList() : error(EXCEPTION_STATUS_DESC_MAP[result.code] || '添加失败!')
              _this.dialogFormVisible = !Utopa.isValidRequest(response)
            }).catch((err) => {
              error('新增失败')
              console.log('createUser fail: ', err)
              _this.dialogFormVisible = false
            })
          }
        })*/
      }
    }
  }
</script>
