<template>
  <section>
    <el-table
      class="table-tree"
      :data="data"
      border
      v-loading="listLoading"
      border highlight-current-row
      style="width: 100%"
      :row-style="showRow">
      <el-table-column v-for="(column, index) in columns"
                       :key="column.dataIndex"
                       :label="column.text"
                       align="center"
                       header-align="center">
        <template scope="scope">
          <!-- add space -->
          <span v-if="spaceIconShow(index)" class="space" ref="space" :style="{width: 20*scope.row.level}"></span>
          <!-- toggle icon -->
          <button class="button icon-toggle" v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)">
            <i v-if="!scope.row.open" class="el-icon-arrow-right" aria-hidden="true"></i>
            <i v-if="scope.row.open" class="el-icon-arrow-down" aria-hidden="true"></i>
          </button>
          <span v-else-if="index===0" class="space"></span>
          {{scope.row[column.dataIndex]}}
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="treeType === 'normal'" width="260">
        <template scope="scope">
          <!--<button type="button" class="el-button el-button&#45;&#45;default el-button&#45;&#45;small" @click="handleCreate(scope.row)">
            &lt;!&ndash;<router-link&ndash;&gt;
              &lt;!&ndash;:to="{ path: requestUrl + 'edit', query: {id: scope.row.Oid} }"&ndash;&gt;
              &lt;!&ndash;tag="span">&ndash;&gt;
              &lt;!&ndash;编辑&ndash;&gt;
            &lt;!&ndash;</router-link>&ndash;&gt;
            新增
          </button>-->
          <!--<button type="button" class="el-button el-button&#45;&#45;success el-button&#45;&#45;small" >
            &lt;!&ndash;<router-link&ndash;&gt;
            &lt;!&ndash;:to="{ path: requestUrl + 'edit', query: {id: scope.row.Oid} }"&ndash;&gt;
            &lt;!&ndash;tag="span">&ndash;&gt;
            &lt;!&ndash;编辑&ndash;&gt;
            &lt;!&ndash;</router-link>&ndash;&gt;
            编辑
          </button>-->
          <!--<button type="button" class="el-button el-button&#45;&#45;success el-button&#45;&#45;small">-->
          <!--<router-link :to="{ path: requestUrl, query: {pId: scope.row.parentOId} }" tag="span">-->
          <!--添加下级树结构-->
          <!--</router-link>-->
          <!--</button>-->
          <el-button type="default" size="small" @click="handleCreate(scope.row)">新增</el-button>
          <el-button type="success" size="samll" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="small"  @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
  </section>
</template>

<script>
  import { transferToTreeArray } from '@/utils'
  export default {
    name: 'table-tree',
    props: {
      treeStructure: {// 确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
        type: Boolean,
        default: function () {
          return false
        }
      },
      columns: {// 字段展示
        type: Array,
        default: function () {
          return []
        }
      },
      dataSource: {// 数据源
        type: Array,
        default: function () {
          return []
        }
      },
      requestUrl: {// 根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
        type: String,
        default: function () {
          return ''
        }
      },
      treeType: {// 是否展示操作列
        type: String,
        default: function () {
          return 'normal'
        }
      },
      listLoading: {
        type: Boolean,
        default: false
      },
      defaultExpandAll: {// 是否默认展开所有树
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    data () {
      return {
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
        }
      }
    },
    computed: {
      data: function () { // 格式化数据源
        if (this.treeStructure) {
          let data = transferToTreeArray(this.dataSource, null, null, this.defaultExpandAll)
          console.log(data)
          return data
        }
        return this.dataSource
      }
    },
    methods: {
      transferToTreeArray (data, parent, level, isOpen) {
        let tmp = []
        Array.from(data).forEach(function (node) {
          if (!node.open) {
            this.$set(node, 'open', isOpen)
          }
          if (parent) {
            this.$set(node, 'parent', parent)
            this.$set(node, 'pId', parent.id)
          }
          let _level = 0
          if (level !== undefined && level !== null) {
            _level = level + 1
          }
          this.$set(node, 'level', _level)
          this.$set(node, 'isParent', node.children && node.children.length > 0)
          tmp.push(node)
          if (node.children && node.children.length > 0) {
            let children = transferToTreeArray(node.children, node, _level, isOpen)
            tmp = tmp.concat(children)
          }
        })
        return tmp
      },
      // 显示行
      showRow: function (row, index) {
        let show = (row.parent ? (row.parent.open && row.parent.show) : true)
        row.show = show
        return show ? '' : 'display:none;'
      },
      // 展开下级
      toggle: function (trIndex) {
        let record = this.data[trIndex]
        record.open = !record.open
      },
      // 显示层级关系的空格和图标
      spaceIconShow (index) {
        return !!(this.treeStructure && index === 0)
      },
      // 点击展开和关闭的时候，图标的切换
      toggleIconShow (index, record) {
        return !!(this.treeStructure && index === 0 && record.children && record.children.length > 0)
      },
      resetDialogFormTemp () {
        this.dialogFormTemp = {
          id: undefined,
          name: undefined,
          code: undefined,
          pcode: undefined,
          order: 0
        }
      },
      handleCreate (row) {
        this.resetDialogFormTemp()
        console.log(row)
        this.dialogFormTemp.pcode = row.code
        this.dialogStatus = 'create'
        this.isReadOnly = true
        this.dialogFormVisible = true
      },
      handleUpdate (row) {
        this.dialogFormTemp = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.isReadOnly = true
        this.dialogFormVisible = true
      },
      handleDelete () {
        this.$confirm('即将删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
//      handleDelete (row) {
//        this.$notify({
//          title: '成功',
//          message: '删除成功',
//          type: 'success',
//          duration: 2000
//        })
//        const index = this.list.indexOf(row)
//        this.list.splice(index, 1)
//      },
      create () {
        this.dialogFormTemp.id = parseInt(Math.random() * 100) + 1024
        this.dialogFormTemp.timestamp = +new Date()
        this.dialogFormTemp.author = '原创作者'
        this.list.unshift(this.dialogFormTemp)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      },
      update () {
        this.dialogFormTemp.timestamp = +this.dialogFormTemp.timestamp
        for (const v of this.list) {
          if (v.id === this.dialogFormTemp.id) {
            const index = this.list.indexOf(v)
            this.list.splice(index, 1, this.dialogFormTemp)
            break
          }
        }
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      }
    }
  }
</script>
<style lang="scss">
  .table-tree{
    .space{
      position: relative;
      top: 1px;
      display: inline-block;
      font-style: normal;
      font-weight: 400;
      line-height: 1;
      width: 18px;
      height: 14px;

      ::before{
        content: ""
      }
    }

    .icon-toggle{
      border: none;
      background-color: transparent;

      &:focus,
      &:hover{
        outline: none;
        border-color: transparent;
      }
    }
  }
</style>
