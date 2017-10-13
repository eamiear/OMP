<template>
  <div class="spicy-created-wrapper">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm" label-width="80px">
      <el-row>
        <el-col :span="14">
          <el-form-item style="margin-bottom: 10px;" label="标题" prop="value">
            <el-input type="input" placeholder="标题" v-model="postForm.title"></el-input>
            <span v-show="postForm.title.length>=26" class='title-prompt'>标题过长，app可能会显示不全</span>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item style="margin-bottom: 10px;" label="子标题">
            <el-input type="input" placeholder="子标题" v-model="postForm.childTitle"></el-input>
            <span v-show="postForm.childTitle.length>=26" class='title-prompt'>子标题过长，app可能会显示不全</span>
          </el-form-item>
        </el-col>

        <el-col :span="14">
          <el-row>
            <el-col :span="8">
              <el-form-item label="主题" class="postInfo-container-item">
                <el-select clearable class="filter-item" placeholder="主题" v-model="postForm.tagName" @visible-change="fetchThemeList">
                  <el-option v-for="item in themes" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="期数" class="postInfo-container-item">
                <el-input type="input" placeholder="第一期" v-model="postForm.periods"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-form-item style="margin-bottom: 10px;" label="封面">
            <Upload v-model="postForm.coverImage"></Upload>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item style="margin-bottom: 10px;" label="摘要">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入摘要信息" v-model="postForm.abstracts"></el-input>
            <span class="word-counter" v-show="abstractCount">{{abstractCount}}/120字</span>
          </el-form-item>
        </el-col>

        <el-col :span="18">
          <el-form-item label="详情内容" style="margin-bottom: 50px">
            <tinymce :height=400 ref="editor" v-model="postForm.content"></tinymce>
          </el-form-item>
        </el-col>
        <el-col :span="14" style="text-align: right;">
          <el-button type="default" style="margin-right: 10px;" @click.native.prevent="handleSubmit">取消</el-button>
          <el-button type="primary" @click.native.prevent="handleSubmit">发布</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import Upload from '@/components/Upload/singleImage3'
//  import MDinput from '@/components/MDinput'
//  import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
//  import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
//  import Sticky from '@/components/Sticky' // 粘性header组件
//  import { validateURL } from '@/utils/validate'
  import { fetchArticle } from '@/api/article'

  export default {
    name: 'articleDetail',
    components: { Tinymce, Upload },
    data () {
      const validateRequire = (rule, value, callback) => {
        callback(!value && new Error(rule.field + '为必传项'))
      }
      return {
        postForm: {
          title: '', // 文章题目
          childTitle: '',
          tagName: '',  // 主题
          periods: '',  // 期数
          content: '', // 文章内容
          abstracts: '',
          coverImage: '', // 文章图片
          id: undefined
        },
        themes: ['时尚', '美食', '其他'],
        abstractTotal: 120,
        fetchSuccess: true,
        loading: false,
        rules: {
          title: [{ require: true, validator: validateRequire }],
          tagName: [{ require: true, validator: validateRequire }],
          periods: [{ require: true, validator: validateRequire }],
          coverImage: [{ validator: validateRequire }],
          content: [{ validator: validateRequire }]
        }
      }
    },
    computed: {
      abstractCount () {
        return this.postForm.abstracts.length
      },
      isEdit () {
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
      'postForm.abstracts': function (val) {
        if (this.abstractCount >= this.abstractTotal) {
          this.$nextTick(() => { this.postForm.abstracts = val.slice(0, this.abstractTotal) })
        }
      }
    },
    methods: {
      fetchData () {
        fetchArticle().then(response => {
          this.postForm = response.data
        }).catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
      },
      fetchThemeList () {
        // TODO
      },
      handleSubmit () {
        console.log(this.postForm)
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$notify({
              title: '成功',
              message: '发布文章成功',
              type: 'success',
              duration: 2000
            })
            this.postForm.status = 'published'
            this.loading = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      draftForm () {
        if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
          this.$message({
            message: '请填写必要的标题和内容',
            type: 'warning'
          })
          return
        }
        this.$message({
          message: '保存成功',
          type: 'success',
          showClose: true,
          duration: 1000
        })
        this.postForm.status = 'draft'
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

