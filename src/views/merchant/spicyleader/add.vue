<template>
  <div class="spicy-created-wrapper">
    <el-form class="form-container" autoComplete="on" :model="spicyForm" :rules="rules" ref="spicyForm" label-width="80px">
      <el-row>
        <el-col :span="14">
          <el-form-item style="margin-bottom: 30px;" label="标题" prop="title">
            <el-input type="input" placeholder="标题" v-model="spicyForm.title"></el-input>
            <span v-show="spicyForm.title.length>=26" class='title-prompt'>标题过长，app可能会显示不全</span>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item style="margin-bottom: 30px;" label="子标题">
            <el-input type="input" placeholder="子标题" v-model="spicyForm.childTitle"></el-input>
            <span v-show="spicyForm.childTitle.length>=26" class='title-prompt'>子标题过长，app可能会显示不全</span>
          </el-form-item>
        </el-col>

        <el-col :span="14">
          <el-row style="margin-bottom: 10px;">
            <el-col :span="8">
              <el-form-item label="主题" class="postInfo-container-item" prop="tagId">
                <el-select clearable class="filter-item" placeholder="选择主题" v-model="spicyForm.tagId" @visible-change="fetchThemeList">
                  <el-option v-for="item in themes" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="期数" class="postInfo-container-item" prop="periods">
                <el-input type="input" placeholder="一" v-model="spicyForm.periods"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-form-item style="margin-bottom: 30px;" label="封面" prop="coverImage">
            <Upload v-model="spicyForm.coverImage"></Upload>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item style="margin-bottom: 10px;" label="摘要">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入摘要信息" v-model="spicyForm.abstracts"></el-input>
            <span class="word-counter" v-show="abstractCount">{{abstractCount}}/120字</span>
          </el-form-item>
        </el-col>

        <el-col :span="18">
          <el-form-item label="详情内容" style="margin-bottom: 40px">
            <tinymce :height=400 ref="editor" v-model="spicyForm.content"></tinymce>
          </el-form-item>
        </el-col>
        <el-col :span="14" style="text-align: left; margin-left: 80px; margin-bottom: 20px;">
          <el-button type="primary" @click.native.prevent="handleSubmit">发布</el-button>
          <el-button type="default" style="margin-right: 10px;" @click.native.prevent="handleSubmit">取消</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import Upload from '@/components/Upload/singleImage3'
  import { EXCEPTION_STATUS_DESC_MAP } from '@/common/constants'
  import * as SpicyLeader from '@/api/spicyleader'
  import * as themeService from '@/api/theme'

  export default {
    name: 'articleDetail',
    components: { Tinymce, Upload },
    data () {
      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          callback(rule.field + '为必传项')
        } else {
          callback()
        }
      }
      return {
        spicyForm: {
          title: '', // 文章题目
          childTitle: '',
          tagId: undefined,  // 主题
          periods: '',  // 期数
          content: '', // 文章内容
          abstracts: '',
          coverImage: '', // 文章图片
          id: undefined
        },
        themes: [],
        abstractTotal: 120,
        fetchSuccess: true,
        loading: false,
        rules: {
          title: [{ require: true, validator: validateRequire, message: '请输入标题' }],
//          tagId: [{ require: true, validator: validateRequire, message: '请选择主题' }],
          periods: [{ require: true, validator: validateRequire, message: '请填写期数' }],
          coverImage: [{ require: true, validator: validateRequire, message: '请上传封面', tigger: 'change' }]
        }
      }
    },
    computed: {
      abstractCount () { // 摘要字数
        return this.spicyForm.abstracts.length
      },
      isEdit () { // 编辑状态
        return this.$route.meta.isEdit // 根据meta判断
        // return this.$route.path.indexOf('edit') !== -1 // 根据路由判断
      }
    },
    created () {
      if (this.isEdit) {
        this.fetchData()
      }
    },
    watch: {
      'spicyForm.abstracts': function (val) {
        if (this.abstractCount >= this.abstractTotal) {
          this.$nextTick(() => { this.spicyForm.abstracts = val.slice(0, this.abstractTotal) })
        }
      }
    },
    methods: {
      fetchData () {
        SpicyLeader.fetchSpicyLeaderById().then(response => {
          this.spicyForm = response.data
        }).catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
      },
      fetchThemeList () {
        if (!this.themes.length) {
          themeService.fetchThemeList().then((response) => {
            const result = response.data
            if (response.status === 200 && result.code === 0) {
              this.themes = result.data.infos || []
            }
          })
        }
      },
      handleSubmit () {
        const _this = this
        _this.$refs.spicyForm.validate(valid => {
          if (valid) {
            SpicyLeader.createSpicyLeader(_this.spicyForm).then((response) => {
              const result = response.data
              if (response.status === 200 && result.code === 0) {
                _this.$router.push({path: '/merchant/spicyleader'})
              } else {
                _this.$message({
                  type: 'error',
                  message: EXCEPTION_STATUS_DESC_MAP[result.code] || '新增失败'
                })
              }
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .spicy-created-wrapper{
    padding:15px 10px;

    .word-counter{
      font-size: 12px;
      color: #999;
      position: absolute;
      right: 0;
      bottom: -33px;
    }
    .editor-container{
      margin: 0 80px 10px;
    }
  }
</style>

