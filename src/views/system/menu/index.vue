<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="菜单名称" v-model="listQuery.name"></el-input>

      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="plus" @click="handleCreate(null, 'root')">新增</el-button>
      <el-button class="filter-item" type="primary" icon="fa-refresh" @click="handleRefresh">刷新</el-button>
      <!--<el-checkbox-group v-model="tableHeader">-->
        <!--<el-checkbox label="menuCode">菜单编码</el-checkbox>-->
        <!--<el-checkbox label="permissionCode">权限编码</el-checkbox>-->
        <!--<el-checkbox label="meta">附加属性</el-checkbox>-->
      <!--</el-checkbox-group>-->
    </div>
    <table-tree class="area-code-container"
                :listLoading="listLoading"
                :columns="columns"
                :tree-structure="true"
                :data-source="dataSource"
                @create="handleCreate"
                @update="handleUpdate"
                @delete="handleDelete"
                @switchChange="handleSwitch"
    ></table-tree>

    <el-dialog top="10%" :title="dialogTitleMap[dialogStatus]" drag :visible.sync="dialogFormVisible" :close-on-click-modal="false" size="small">
      <el-form class="system-menu-wrapper"  ref="menuForm" :model="menuModel" label-width="90px" style='margin-left:50px;'>
        <el-form-item label="菜单名称" prop="name" :rules="{required: true, message: '名称不能为空', trigger: 'blur'}">
          <el-input v-model="menuModel.name" autofocus></el-input>
        </el-form-item>
        <el-form-item label="访问路径" prop="path" :rules="{required: true, message: '访问路径不能为空', trigger: 'blur'}">
          <el-input v-model="menuModel.path"></el-input>
          <span class="menu-tips">path 页面访问路径</span>
        </el-form-item>
        <el-form-item label="组件路径" prop="component" :rules="{required: true, message: '组件路径不能为空', trigger: 'blur'}">
          <el-input v-model="menuModel.component"></el-input>
          <span class="menu-tips">component 组件加载路径</span>
        </el-form-item>
        <el-form-item label="重定向路径">
          <el-input v-model="menuModel.redirect"></el-input>
          <span class="menu-tips">redirect 重定向路径</span>
        </el-form-item>
        <el-form-item label="图标">
          <el-input :style="{width: menuModel.icon ? '48%' : '52%'}" v-model="menuModel.icon"></el-input>
          <icon style="margin-left: 10px" v-if="menuModel.icon" :name="menuModel.icon"></icon>
          <span class="menu-tips">font-awesome 字体图标名称，如circle-o</span>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="menuModel.labels" placeholder="[{'classes': 'bg-red','text': '5'}]"></el-input>
          <span class="menu-tips">显示在菜单右侧的标签信息（json字符串）</span>
        </el-form-item>
        <el-form-item label="附加属性">
          <el-input v-model="menuModel.meta" placeholder="{ role: ['user', 'admin']}"></el-input>
          <span class="menu-tips">附加权限信息（json字符串）</span>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-input v-model="menuModel.parentName" :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="menuModel.sortOrder"></el-input>
        </el-form-item>
        <el-form-item label="显示">
          <el-switch v-model="menuModel.isShow" :on-value="1" on-text="" :off-value="0" off-text=""> </el-switch>
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
  .system-menu-wrapper {
    .el-input{
      width:52%;
    }
    .menu-tips {
      margin-left: 20px;
      color: #999;
      position: absolute
    }
  }
</style>

<script>
  /* eslint-disable no-debugger */
  import assign from 'lodash.assign'
  import { fetchMenuList, createMenuItem, editMenuItem, deleteMenuItem, showMenuItem } from '@/api/system/menu'
  import { getUID } from '@/common/auth'
  import { success, error, info } from '@/utils/dialog'
  import TableTree from '@/components/table/TableTree'
  import { EXCEPTION_STATUS_DESC_MAP } from '@/common/constants'
//  import { Helper } from '@/common/helper'
  import { Utopa } from '@/common/utopa'

  export default {
    name: 'areaCode',
    data () {
      return {
        listLoading: true,
        listQuery: {
          name: undefined,
          code: undefined
        },
        menuModel: {
          id: undefined,
          path: '',
          parentId: '',
          parentName: '',
          name: '',
          redirect: '',
          component: '',
          isShow: 1,
          meta: '',
          icon: '',
          image: '',
          labels: '',
          sortOrder: 0,
          level: 0,
          isSingle: true
        },
        isDisabled: false,
        dialogFormVisible: false,
        dialogStatus: '',
        dialogTitleMap: {
          update: '编辑',
          create: '新增'
        },
        columns: [
          {
            text: '菜单名称',
            width: '230px',
            align: 'left',
            dataIndex: 'name'
          },
          {
            text: '层级',
            width: '70px',
            dataIndex: 'level'
          },
          {
            text: '菜单编码',
            display: 'hide',
            dataIndex: 'menuCode'
          },
          {
            text: '访问路径',
            width: '200px',
            align: 'left',
            style: 'link-type',
            dataIndex: 'path'
          },
          {
            text: '组件路径',
            width: '200px',
            align: 'left',
            style: 'link-type',
            dataIndex: 'component'
          },
          {
            text: '重定向路径',
            width: '200px',
            style: 'link-type',
            align: 'left',
            dataIndex: 'redirect'
          },
          {
            text: '小图标',
            mode: 'icon',
            dataIndex: 'icon'
          },
          {
            text: '标签',
            align: 'left',
            dataIndex: 'labels'
          },
          {
            text: '附加属性',
            display: 'hide',
            dataIndex: 'meta'
          },
          {
            text: '父级名称',
            dataIndex: 'parentName'
          },
          {
            text: '权限编码',
            display: 'hide',
            dataIndex: 'permissionCode'
          },
          {
            text: '排序',
            width: '70px',
            dataIndex: 'sortOrder'
          },
          {
            text: '显示',
            width: '70px',
            mode: 'switcher',
            dataIndex: 'isShow'
          }
        ],
//        tableHeaderOptions: [
//          {
//            text: '菜单编码',
//            dataIndex: 'menuCode'
//          },
//          {
//            text: '附加属性',
//            dataIndex: 'meta'
//          },
//          {
//            text: '权限编码',
//            dataIndex: 'permissionCode'
//          }
//        ],
        tableHeader: [],  // 'menuCode', 'meta', 'permissionCode'
        tableHeaderOptions: ['menuCode', 'meta', 'permissionCode'],
        dataSource: []
      }
    },
    components: {
      TableTree
    },
    watch: {
      tableHeader (valArr) {
        console.log(valArr)
//        Array.from(valArr).forEach((val) => {
//          debugger
//          this.columns.some(i => {
//            if (val.indexOf(i.dataIndex) >= 0) {
//              i.display = i.display === 'hide' ? 'show' : 'hide'
//              return true
//            }
//          })
//        })
        const showColumn = this.columns.forEach(i => {
          if (valArr.indexOf(i.dataIndex) >= 0) {
            i.display = i.display === 'hide' ? 'show' : 'hide'
            return true
          }
        })
        console.log(showColumn)
//        this.columns.push(showColumn)
        this.key = this.key + 1
      }
    },
    created () {
      this.getList()
    },
    methods: {
      // 获取列表
      getList () {
        const _this = this
        _this.listLoading = true
        fetchMenuList(getUID()).then(response => {
          const result = response.data
          if (Utopa.isValidRequest(response)) {
            _this.dataSource = result.data.menus
          } else {
            error(EXCEPTION_STATUS_DESC_MAP[result.code] || '获取失败')
          }
          _this.listLoading = false
        }).catch(err => {
          error('程序出错')
          console.log(err)
          _this.listLoading = false
        })
      },
      // 查询
      handleFilter () {
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
      resetMenuModel () {
        this.menuModel = {
          id: undefined,
          path: '',
          parentId: '',
          parentName: '',
          name: '',
          redirect: '',
          component: '',
          isShow: 1,
          meta: '',
          icon: '',
          image: '',
          labels: '',
          level: 1,
          sortOrder: 0,
          isSingle: true
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
      handleCreate (row, type) {
        this.resetMenuModel()
        if (type !== 'root') {
          this.menuModel.parentId = row.id
          this.menuModel.parentName = row.name
          this.menuModel.level = row.level + 1
          this.menuModel.sortOrder = row.children && row.children.length ? row.children.length + 1 : 1
        }
        console.log('parentId: ' + this.menuModel.parentId, 'level: ' + this.menuModel.level, this.menuModel.sortOrder)
        this.isDisabled = true
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      // 点击修改按钮
      handleUpdate (row) {
        this.menuModel = assign({}, row)
        this.dialogStatus = 'update'
        this.isDisabled = true
        this.dialogFormVisible = true
      },
      handleSwitch (val) {
        alert(val)
        showMenuItem()
      },
      // 点击删除按钮
      handleDelete (row) {
        console.log(row)
        const _this = this
        this.$confirm('即将删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.remove(row.id).then((response) => {
            if (Utopa.isValidRequest(response)) {
              _this.delNodeById(_this.dataSource, row.id)
              success('删除成功!')
              _this.updateMenu()
            } else {
              error(response.data.msg || EXCEPTION_STATUS_DESC_MAP[response.data.code] || '删除失败')
            }
          }).catch(() => {
            error('删除失败!')
          })
        }).catch(() => {
          info('已取消删除')
        })
      },
      // 新增业务操作
      create () {
        const _this = this
        createMenuItem(_this.menuModel).then((response) => {
          if (Utopa.isValidRequest(response)) {
            success('创建成功!')
            _this.getList()
            _this.updateMenu()
          } else {
            error(EXCEPTION_STATUS_DESC_MAP[response.data.code] || '创建失败')
          }
          _this.dialogFormVisible = false
        }).catch(() => {
          error('新增失败')
        })
      },
      // 编辑业务操作
      update () {
        const _this = this
        _this.menuModel.children = null
        _this.menuModel.parent = null
        editMenuItem(_this.menuModel).then((response) => {
          if (Utopa.isValidRequest(response)) {
            success('编辑成功!')
            _this.getList()
            _this.updateMenu()
          } else {
            error(EXCEPTION_STATUS_DESC_MAP[response.data.code] || '编辑失败')
          }
          _this.dialogFormVisible = false
        }).catch((err) => {
          error('编辑失败')
          console.log(err)
        })
      },
      // 删除业务操作
      remove (id) {
        return deleteMenuItem(id)
      },
      updateMenu () {
        const _this = this
        const roles = []
        _this.$store.dispatch('GenerateRoutes', { roles }).then(() => {
          _this.$router.addRoutes(_this.$store.getters.addRouters)
        })
      }
    }
  }
</script>
