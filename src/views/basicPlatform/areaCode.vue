<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="地域名称" v-model="listQuery.name"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="地域编码" v-model="listQuery.code"></el-input>

      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="fa-refresh" @click="handleRefresh">刷新</el-button>
    </div>
    <table-tree class="area-code-container" :listLoading="listLoading" :columns="columns" :tree-structure="true" :data-source="dataSource"></table-tree>

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
  import { fetchAreaCodeList } from '@/api/basic_areacode'
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
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        columns: [
          {
            text: '地域名称',
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
      getList () {
        this.listLoading = true
        fetchAreaCodeList().then(response => {
          const result = response.data
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
      handleUpdate (row) {
        this.temp = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      handleDelete (row) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.dataSource.splice(index, 1)
      },
      update () {
        this.temp.timestamp = +this.temp.timestamp
        for (const v of this.dataSource) {
          if (v.id === this.temp.id) {
            const index = this.list.indexOf(v)
            this.list.splice(index, 1, this.temp)
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
      },
      resetListQuery () {
        this.listQuery = {
          name: undefined,
          code: undefined
        }
      },
      handleRefresh () {
        this.resetListQuery()
        this.getList()
      }
    }
  }
</script>
