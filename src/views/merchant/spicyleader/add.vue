<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm" label-width="80px">

      <div class="spicy-created-wrapper">
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

          <el-col :span="24">
            <el-row>
              <el-col :span="8">
                <el-form-item label="主题" class="postInfo-container-item" prop="value">
                  <el-select clearable class="filter-item" placeholder="主题" v-model="postForm.tagName">
                    <el-option v-for="item in themes" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="发布时间:" class="postInfo-container-item">
                  <el-date-picker v-model="postForm.displayTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label="摘要">
          <el-input type="textarea" :rows="4" autosize placeholder="请输入摘要信息" v-model="postForm.abstracts"></el-input>
          <span class="word-counter" v-show="abstractCount">{{abstractCount}}字</span>
        </el-form-item>

        <div class="editor-container">
          <!--<tinymce :height=400 ref="editor" v-model="postForm.content"></tinymce>-->
        </div>

        <div style="margin-bottom: 20px;">
          <!--<Upload v-model="postForm.image_uri"></Upload>-->
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
//  import Tinymce from '@/components/Tinymce'
//  import Upload from '@/components/Upload/singleImage3'
//  import MDinput from '@/components/MDinput'
//  import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
//  import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
//  import Sticky from '@/components/Sticky' // 粘性header组件
  import { validateURL } from '@/utils/validate'
  import { fetchArticle } from '@/api/article'
  import { userSearch } from '@/api/remoteSearch'

  export default {
    name: 'articleDetail',
//    components: { Tinymce, MDinput, Upload },
    data () {
      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: rule.field + '为必传项',
            type: 'error'
          })
          callback(null)
        } else {
          callback()
        }
      }
      const validateSourceUri = (rule, value, callback) => {
        if (value) {
          if (validateURL(value)) {
            callback()
          } else {
            this.$message({
              message: '外链url填写不正确',
              type: 'error'
            })
            callback(null)
          }
        } else {
          callback()
        }
      }
      return {
        postForm: {
          title: '', // 文章题目
          childTitle: '',
          tagName: '',
          content: '', // 文章内容
          displayTime: undefined,
          abstracts: '',
          content_short: '', // 文章摘要
          source_uri: '', // 文章外链
          image_uri: '', // 文章图片
          source_name: '', // 文章外部作者
          display_time: undefined, // 前台展示时间
          id: undefined,
          platforms: ['a-platform']
        },
        themes: ['时尚', '美食', '其他'],
        fetchSuccess: true,
        loading: false,
        userLIstOptions: [],
        platformsOptions: [
          { key: 'a-platform', name: 'a-platform' },
          { key: 'b-platform', name: 'b-platform' },
          { key: 'c-platform', name: 'c-platform' }
        ],
        rules: {
          image_uri: [{ validator: validateRequire }],
          title: [{ validator: validateRequire }],
          content: [{ validator: validateRequire }],
          source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
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
    methods: {
      fetchData () {
        fetchArticle().then(response => {
          this.postForm = response.data
        }).catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
      },
      submitForm () {
        this.postForm.display_time = parseInt(this.display_time / 1000)
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
      },
      getRemoteUserList (query) {
        userSearch(query).then(response => {
          if (!response.data.items) return
          console.log(response)
          this.userLIstOptions = response.data.items.map(v => ({
            key: v.name
          }))
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .spicy-created-wrapper{
    padding:15px 10px;
  }
  /*@import "src/styles/mixin.scss";*/
  /*.title-prompt{
    position: absolute;
    right: 0;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
          text-align: right;
          margin-right: 10px;
          .editor-upload-btn {
            display: inline-block;
          }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }*/
</style>

