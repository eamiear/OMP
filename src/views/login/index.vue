<template>
  <div class="login-container" :style="backdrop">
    <section class="form-container">
      <h3 class="title">优托邦运营管理平台</h3>
      <el-form class="card-box login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <el-form-item prop="username">
          <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
                    placeholder="密码" />
        </el-form-item>

        <el-form-item prop="verification" class="verify">
          <el-input name="verification"  @keyup.enter.native="handleLogin" v-model="loginForm.verification" autoComplete="on"
                    placeholder="验证码" />
          <span class='verify-code'><v-image :source="verifyCodeImage" /></span>
        </el-form-item>

        <el-button type="primary" style="width: 320px;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
      </el-form>
    </section>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import { EXCEPTION_STATUS_DESC_MAP } from '@/common/constants'

export default {
  name: 'login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
//    const validateVerification = (rule, value, callback) => {
//      // TODO
//      callback()
//    }
    /* eslint-disable no-unused-vars*/
    // TODO validate verify code
    const validateVerifyCode = (rule, value, callback) => {
      callback()
    }
    return {
      backdrop: {
        backgroundImage: 'url(' + require('@/assets/image/login/background.jpg') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        marginTop: '0'
      },
      loginForm: {
        username: '',
        password: '',
        verification: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }] // ,
//        verification: [{required: true, validator: validateVerification}]
      },
      pwdType: 'password',
      loading: false,
      verifyCodeImage: 'http://placehold.it/50x50'
    }
  },
  methods: {
    showPwd () {
      this.pwdType = this.pwdType === 'password' ? '' : 'password'
    },
    fetchVerifyCode () {
      // TODO
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then((response) => {
            this.loading = false
            if (response.code !== 0) {
              this.$notify({
                message: EXCEPTION_STATUS_DESC_MAP[response.code] || '登录失败',
                type: 'error'
              })
              this.$router.push({path: '/login'})
            } else {
              this.$router.push({ path: '/' })
            }
          }).catch((err) => {
            this.loading = false
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "~compass-mixins";
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;
  $white: #fff;

  .login-container {
    position: relative;
    width: 100%;
    height: 100vh;
    background-color: $bg;
    overflow: hidden;

    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
      /*-webkit-text-fill-color: #fff !important;*/
    }
    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      color: $light-gray;
      height: 40px;
    }

    .form-container{
      position: absolute;
      left: 0;
      right: 0;
      margin: 14% auto;
      width: 400px;

      .title {
        font-size: 44px;
        color: $white;
        margin: 0 auto 60px auto;
        text-align: center;
        font-weight: bold;
        text-shadow: 0 1px 18px rgba(0,51,153,0.4);
      }
    }

    .login-form {
      background-color: #fff;
      padding: 60px 48px 46px;
      border-radius: 3px;
      @include box-shadow(0 16px 59px 0 rgba(14,102,164,0.46));

      .el-form-item {
        width: 320px;
        margin-bottom: 30px;
        background-color: transparent;
      }
      .el-form-item__content{
        line-height: 40px;
        background-color: transparent;
      }

      .el-input {
        display: inline-block;
        height: 40px;
      }
      .el-input .el-input__inner{
        border: 1px solid #EBEBEB;
        border-radius: 4px;
        color: #999;
        font-weight: bold;
        box-shadow: inset 0 0 3px 0 rgba(0,0,0,0.2);
      }
      .el-input .el-input__inner:focus{
        border-color: #20a0ff;
      }
      .verify .el-input{
        width: 82%;
      }
      .verify .verify-code{
        width: 18%;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
      }
      .verify .verify-code .image{
        display: block;
        width: 100%;
        height: 100%;
      }
      .el-button{
        padding: 12px 15px;
      }
      .el-button span{
        font-family: 'microsoft yahei';
        font-size: 14px;
        font-weight: bold;
      }
      .el-button--primary{
        background-color: #006AE2;
        border-color: #006AE2;
      }
      .el-button--primary:focus,
      .el-button--primary:hover{

      }
      .el-button--primary.is-active,
      .el-button--primary:active{

      }
    }
  }
</style>
