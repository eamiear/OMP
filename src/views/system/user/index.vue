<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form autoComplete="on" :model="listQuery" label-position="left" :inline="true">
        <el-form-item label="手机号">
          <el-input style="width: 200px;" class="filter-item" placeholder="手机号" v-model="listQuery.mobile"></el-input>
        </el-form-item>

        <el-form-item label="注册时间">
          <el-date-picker
            v-model="listQuery.registerTime"
            type="datetimerange"
            placeholder="选择注册时间范围">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="客户端类型">
          <el-select clearable class="filter-item" placeholder="选择客户端类型" v-model="listQuery.sysId" @visible-change="fetchClientTypeList">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in clientTypes" :key="item.sysCode" :label="item.sysName" :value="item.sysCode"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select clearable class="filter-item" v-model="listQuery.state">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(value, key) in userState" :key="key" :label="value" :value="key"></el-option>
          </el-select>
        </el-form-item>

        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">查询</el-button>
      </el-form>
    </div>
    <div class="filter-container text-right">
      <el-button class="filter-item" type="primary" icon="fa-plus" @click="handleCreate">新增</el-button>
      <el-button class="filter-item" type="primary" icon="fa-plus" @click="handleImport">批量导入</el-button>
      <el-button class="filter-item" type="primary" icon="fa-refresh" @click="handleRefresh">刷新</el-button>
    </div>
    <el-table
      id="userlist"
      class="utable-container"
      :key='tableKey'
      :data="list"
      v-loading="listLoading"
      border fit highlight-current-row
      align="center"
      :height="utopaTableHeight"
      style="width: 100%">

      <el-table-column align="center" label="用户名">
        <template scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号">
        <template scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="性别">
        <template scope="scope">
          <span>{{scope.row.sex | sexFormat}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="登录次数">
        <template scope="scope">
          <span>{{scope.row.loginCount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="客户端类型">
        <template scope="scope">
          <span>{{scope.row.regOrigin | clientTypeFormat}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="注册时间">
        <template scope="scope">
          <span>{{scope.row.createTime | dateTimeFormat}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="兴趣爱好">
        <template scope="scope">
          <span>{{scope.row.interestList | interestListFormat}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="我的关注">
        <template scope="scope">
          <span>{{scope.row.favorite}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最后登录IP">
        <template scope="scope">
          <span>{{scope.row.lastLoginIp}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最后登录时间">
        <template scope="scope">
          <span>{{scope.row.lastLoginTime | dateTimeFormat}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="150px">
        <template scope="scope">
          <el-button v-if="scope.row.state===1" size="small" @click="handleUserAvailable(scope.row, 'disable')">禁用</el-button>
          <el-button v-else="scope.row.state===2" size="small" @click="handleUserAvailable(scope.row, 'enable')">启用</el-button>
          <el-button type="danger" size="small" @click="handleResetPassword(scope.row)">重置密码</el-button>
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

    <!-- create new user -->
    <el-dialog title="添加用户" size="tiny" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form class="small-space" autoComplete="on" :model="userModel" :rules="userModelRules" ref="userModelForm" label-position="left" label-width="70px" style='width: 60%; margin-left:50px;'>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userModel.mobile" autoComplete="on"></el-input>
        </el-form-item>
        <el-form-item label="密  码" prop="password">
          <el-input v-model="userModel.password"></el-input>
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
  import * as platService from '@/api/common/platform'
  import { success, error } from '@/utils/dialog'
  import { validateMobilephone } from '@/utils/validate'
  import { EXCEPTION_STATUS_DESC_MAP, CLIENT_TYPES_MAP, PAGINATION_PAGENO, PAGINATION_PAGESIZE, PAGINATION_PAGETOTAL } from '@/common/constants'
  import { Helper } from '@/common/helper'
  import { Utopa } from '@/common/utopa'

  export default {
    name: 'userList',
    data () {
      const validateUserModel = (rule, value, callback) => {
        if (!value) {
          callback(new Error(rule.field + '不能为空'))
        } else {
          callback()
        }
      }
      const validateMobilePhone = (rule, value, callback) => {
        if (!value) {
          callback(new Error(''))
        } else if (validateMobilephone(value)) {
          callback(new Error('手机号不合法'))
        } else {
          callback()
        }
      }
      return {
        listLoading: true,
        total: PAGINATION_PAGETOTAL, // 列表总记录数
        listQuery: {                // 查询条件
          mobile: '',               // 手机号
          beginTime: '',            // 注册范围开始时间
          endTime: '',              // 注册范围结束时间
          registerTime: '',
          sysId: undefined,         // 客户端类型ID
          state: undefined,         // 用户状态
          pageNo: PAGINATION_PAGENO,                // 页码
          pageSize: PAGINATION_PAGESIZE              // 页数
        },
        dialogFormVisible: false,   // 添加用户弹窗状态
        tableKey: 0,
        utopaTableHeight: 0,        // 表格高度
        list: [],             // 表格数据信息
        userModel: {          // 用户模型
          password: '',
          mobile: '',
          sysId: ''
        },
        userModelRules: {   // 用户检验规则
          mobile: [{ required: true, message: '手机号不能为空', validator: validateMobilePhone }],
          password: [{ required: true, message: '密码不能为空', validator: validateUserModel }]
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
      clientTypeFormat (type) {
        return type && CLIENT_TYPES_MAP[type]
      },
      interestListFormat (interest) {
        return interest && interest.map((item, index) => {
          return item.description
        }).join(',')
      },
      sexFormat (sex) {
        return sex && {1: '男', 2: '女'}[sex]
      }
    },
    created () {
      this.getList()
    },
    watch: {
      'listQuery.registerTime' (val) {
        const beginTime = this.listQuery.registerTime[0]
        const endTime = this.listQuery.registerTime[1]
        this.listQuery.beginTime = beginTime && Helper.parseTime(beginTime)
        this.listQuery.endTime = endTime && Helper.parseTime(endTime)
      },
      dialogFormVisible (val) {
        if (val === false) {
          this.$refs.userModelForm.resetFields()
        }
      }
    },
    mounted () {
      this.fixLayout()
      window.onresize = () => {
        return (() => {
          this.fixLayout()
        })()
      }
    },
    methods: {
      fixLayout () {
        const body = document.body
        const mainHeader = document.querySelector('.main-header')
        const crumbNav = document.querySelector('.breadcrumb-nav')
        const filterContainer = document.querySelector('.filter-container')
        let pagination = document.querySelector('.pagination-container')
        this.utopaTableHeight = body.clientHeight - mainHeader.clientHeight * 2 - crumbNav.clientHeight - filterContainer.clientHeight * 2 - pagination.clientHeight - 50
      },
      // 获取列表
      getList () {
        this.listLoading = true
        userService.fetchUserList(this.listQuery).then(response => {
          const result = response.data
          if (Utopa.isValidRequest(response)) {
            this.list = result.data.userList
            this.total = result.data.total || PAGINATION_PAGETOTAL
          } else {
            error(EXCEPTION_STATUS_DESC_MAP[result.code] || '获取失败')
          }
          this.listLoading = false
        }).catch(err => {
          error(EXCEPTION_STATUS_DESC_MAP[err.code] || '获取数据失败')
          this.listLoading = false
        })
      },
      // 获取来源列表
      fetchClientTypeList () {
        if (!this.clientTypes.length) {
          platService.fetchClientTypes().then((response) => {
            const result = response.data
            if (Utopa.isValidRequest(response)) {
              this.clientTypes = result.data.sysList || []
            } else {
              error(EXCEPTION_STATUS_DESC_MAP[result.code] || '获取客户端类型列表失败')
            }
          })
        }
      },
      // 条件查询
      handleFilter () {
        this.listQuery.pageNo = PAGINATION_PAGENO
        this.getList()
      },
      // 新增用户
      handleCreate (row) {
        this.resetUserModel()
        this.dialogFormVisible = true
      },
      // TODO 重置密码
      handleResetPassword () {
        success('接口待提供')
      },
      // TODO import user infos
      handleImport () {
        success('接口待提供')
      },
      // refresh user lilst
      handleRefresh () {
        this.resetListQuery()
        this.getList()
      },
      // 启用/禁用用户
      handleUserAvailable (row, action) {
        const actionMap = {
          'disable': userService.disableUser,
          'enable': userService.enableUser
        }
        actionMap[action].call(null, row.uid).then(response => {
          if (Utopa.isValidRequest(response)) {
            this.getList()
            success(action === 'enable' ? '启用成功' : '禁用成功')
          } else {
            error(EXCEPTION_STATUS_DESC_MAP[response.data.code] || action === 'enable' ? '启用失败!' : '禁用失败!')
          }
        })
      },
      // pagination change current page
      handleCurrentChange (pageNo) {
        this.listQuery.pageNo = pageNo
        this.getList()
      },
      // pagination change page size
      handleSizeChange (pageSize) {
        this.listQuery.pageSize = pageSize
        this.getList()
      },
      // 重置弹窗表单
      resetUserModel () {
        this.userModel = {
          password: '',
          mobile: '',
          sysId: ''
        }
      },
      // 重置查询列表
      resetListQuery () {
        this.listQuery = {
          mobile: '',
          beginTime: '',
          endTime: '',
          registerTime: '',
          sysId: undefined,
          state: undefined,
          pageNo: PAGINATION_PAGENO,
          pageSize: PAGINATION_PAGESIZE
        }
      },
      // 新增业务操作
      create () {
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
        })
      }
    }
  }
</script>
