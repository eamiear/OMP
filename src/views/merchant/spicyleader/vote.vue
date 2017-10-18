<template>
  <!-- Vote operation start-->
  <el-dialog :title="textMap[dialogStatus]" size="40" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
    <el-form class="small-space" autoComplete="on"
             :model="voteModel"
             ref="voteForm"
             label-position="left" label-width="80px" style='margin-left:50px;'>

      <el-form-item label="投票名称" prop="title" style="width: 60%;"
                    :rules="{required: true, message: '投票名称不能为空', trigger: 'blur'}">
        <el-input v-model="voteModel.title" autoComplete="on"></el-input>
        <span class="counter inner">8/35</span>
      </el-form-item>

      <el-form-item label="截止时间" prop="overdue"
                    :rules="{type: 'date', required: true, message: '请选择截止日期时间', trigger: 'change'}">
        <el-date-picker v-model="voteModel.overdue" type="datetime" placeholder="选择截止日期时间"></el-date-picker>
      </el-form-item>

      <el-form-item v-for="(vote, index) in voteModel.voteItemList"
                    :label="'选项' + numberToChineseFilter(index+1)"
                    :key="vote.key"
                    :prop="'voteItemList.' + index + '.title'"
                    :rules="{required: true, message: '选项不能为空', trigger: 'blur'}">

        <el-input style="width: 50%;" v-model="vote.title"></el-input>
        <!--<el-button @click.prevent="">上传图片</el-button>-->
        <el-upload class="vote-avatar-uploader"
                   :data="voteData"
                   :multiple="false"
                   :show-file-list="false"
                   :action="voteAction"
                   accept="image/*"
                   :on-success="handleVoteAvatarScucess"
                   :before-upload="beforeVoteAvatarUpload">
          <el-button size="small">点击上传</el-button>
        </el-upload>
        <div class="vote-avatar-preview">
          <div class="avatar-preview-wrapper" v-show="voteImageUrl.length>1">
            <img :src="voteImageUrl">
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
</template>

<style rel="stylesheet/scss" lang="scss">

</style>

<script>
  import * as SpicyLeader from '@/api/spicyleader'
  import { success, error, info } from '@/utils/dialog'
  import { EXCEPTION_STATUS_DESC_MAP } from '@/common/constants'
  import { Utopa } from '@/common/utopa'

  export default {
    name: 'vote',
    data () {
      return {
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
            sort: 0
          }, {
            title: '',
            image: '',
            sort: 0
          }, {
            title: '',
            image: '',
            sort: 0
          }]
        },
        voteRules: {
          title: [{required: true}]
        },
        voteAction: 'http://upload-z2.qiniu.com',
        voteData: { token: '' },
        voteImageUrl: ''
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
    // 重置投票model
    resetVoteModel () {
      this.voteModel = {
        title: '',
        overdue: '',
        magazineId: undefined,
        voteItemList: [{
          title: '',
          image: '',
          sort: 0
        }, {
          title: '',
          image: '',
          sort: 0
        }, {
          title: '',
          image: '',
          sort: 0
        }]
      }
    },
    // 发起投票
    handleVote (row) {
      row.voteId ? this.updateVoteHandle(row) : this.createVoteHandle(row)
    },
    createVoteHandle (row) {
      this.resetVoteModel()
      this.voteModel.magazineId = row.id
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    updateVoteHandle (row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      SpicyLeader.fetchVotesByMagazineId(row.id).then(response => {
        console.log(response)
        // TODO init VoteModel
        this.voteModel = {}
      })
    },
    // 启用/禁用投票
    enableVote (voteStatus) {
      // TODO
      const statusMap = {
        0: '禁用',
        1: '启用'
      }
      SpicyLeader.enableVote(voteStatus).then((response) => {
        const result = response.data
        Utopa.isValidRequest(response) ? success((statusMap[voteStatus] || '操作') + '成功') : error(EXCEPTION_STATUS_DESC_MAP[result.code] || ((statusMap[voteStatus] || '操作') + '失败'))
      }).catch(err => {
        console.log(err)
        error('服务出错')
      })
    },
    handleVoteAvatarScucess () {
      // TODO
    },
    beforeVoteAvatarUpload () {
      // TODO
    },
    // add a new vote item option
    addVoteItem () {
      if (!(this.voteModel && this.voteModel.list)) {
        console.log('voteModel is empty!')
        return false
      }
      if (this.voteModel.length >= 5) {
        info('最多添加五项')
        return
      }
      this.voteModel.list.push({
        title: '',
        image: '',
        sort: 0
      })
    },
    // remove vote item option
    removeVoteItem (vote) {
      const index = this.voteModel.list.indexOf(vote)
      index !== -1 && this.voteModel.list.splice(index, 1)
    },
    // create vote item
    createVote () {
      const _this = this
      _this.$refs.voteForm.validate(valid => {
        if (valid) {
          SpicyLeader.createVote(_this.voteModel).then(response => {
            Utopa.isValidRequest(response) && _this.getList()
            _this.dialogFormVisible = false
          })
        }
      })
    },
    // update vote item
    updateVote () {
      const _this = this
      _this.$refs.voteForm.validate(valid => {
        if (valid) {
          SpicyLeader.updateVote(_this.voteModel).then(response => {
            Utopa.isValidRequest(response) && _this.getList()
            _this.dialogFormVisible = false
          })
        }
      })
    }
  }
</script>
