<template>
  <div class="login">
    <div class="header">
        <div class="header_login">
          <img src="../../images/login_logo.png" alt="" class="login_img">
        </div>
    </div>
     <div class="login_bg">
         <div class="login_img">
              <div class="left_content">
                   <p class="company_name">投资决策辅助系统</p>
                   <span class="shareholders">价值股东</span>
                   <span class="interact interact_left">产融互动</span>
              </div>
              <div class="login_form">
                <p class="user_login">
                  <span class="user_title">用户登录</span>
                </p>
                <div class="form">
                  <div class="userName">
                     <i class="icon_login_user"></i>
                     <input class="user" v-model="username" type="text" placeholder="用户名/手机号" @focus="inputFocus" @keyup.enter='_login'/>
                  </div>
                  <div class="password">
                    <i class="icon_login_password"></i>
                    <input class="user_password" v-model="password" type="password" @focus="inputFocus" placeholder="密码" @keyup.enter='_login'/>
                  </div>
                  <div class="captcha" @keyup.enter='_login'>
                    <el-input class="user_captcha" v-model="captcha"  @focus="inputFocus" placeholder="验证码"></el-input>
                    <img :src="url" alt="" class="captcha_img" @click="getPic()">
                  </div>
                  <div class="login_button" @click="_login" @keyup.13="_login">
                       <span class="btn_login">登录</span>
                  </div>
                  <div class="forget">
                    <p @click="forget">忘记密码？</p>
                  </div>
                  <div class="messageInfo" v-show="message">
                    <div>
                      <div style="float: left">
                        <img src="../../images/icon_ban.png" alt="" class="icon_ban">
                      </div>
                       <div style="float: left">
                         <span class="psw_text">{{msg}}</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="forgetPassword" v-show="remind">
                 <div class="close">
                   <i class="close_icon" @click="close"></i>
                 </div>
                <div class="temp_tip">
                  <p class="forget_tip">忘记密码请联系系统管理员
                    电话：15723953245</p>
                </div>
              </div>
         </div>
     </div>
    <footer class="footer">

    </footer>
  </div>
</template>

<script>
  import {captcha,login} from 'service/getData'
  import {ERR_OK} from 'service/config'
  import {baseUrl} from '../../config/env'
  import {setStore,removeStore} from '../../config/mUtils'
  import  store from '../../store'
  import * as types from '../../store/mutation-types'
  export default {
    data() {
      return {
        username: '',
        password: '',
        captcha:"",
        url:"",
        msg:"",
        remind:false,
        showLogin: false,
        message:false,
      }
    },
    mounted(){
      this.showLogin = true;
      this.getPic()
      removeStore('token')
    },
    methods:{
//      获取图片验证码
       getPic() {
         this.url=baseUrl+captcha()
       },
//      刷新图片验证码
      fresh(){
        this.getPic()
      },
      close(){
        this.remind=false
      },
      forget(){
        this.remind=true
      },
      inputFocus(){
        this.message=false;
      },
//      登陆
      _login() {
        const param={
        loginName:this.username,
        password:this.password,
        captcha:this.captcha
        };
        const self=this
        login(param).then((res) => {
          if(res.code==ERR_OK) {
          store.commit(types.LOGIN,{token:res.data})
          store.dispatch('roles',res.data)
          this.message=false;
          self.$router.push('/index')
          setStore('token',res.data)
        }else if(res.code=='validateCodeError'){
          this.getPic()
          this.captcha=""
          this.message=true
          this.msg=res.msg
        }else{
            this.message=true
            this.msg=res.msg
          }
      })
      },
    }
  };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"  scoped>
  @import '../../style/mixin';
  .header{
    margin: 0 auto;
    width: 1200px;
    height: 86px;
    background: #ffffff;
    .header_login{
      height: 86px;
      margin: 0 auto;
      .login_img{
        display: inline-block;
        margin-top: 20px;
      }
    }
  }
  .login_bg{
    width: 100%;
    background: #D93538 ;
    min-height: 600px;
  .login_img{
      width: 1200px;
     position: relative;
     min-height: 600px;
     background: url('../../images/login_bg.png') no-repeat;
     margin: 0 auto;
  }
  }
  .footer{
    width: 100%;
  }
 .left_content{
    width: 279px;
    height: 100px;
   position: absolute;
   left: 74px;
   top:315px;
   .company_name{
     font-size: 26px;
     color: #F9EB00;
   }
   .shareholders,.interact{
     display: inline-block;
     width: 117px;
     height: 33px;
     line-height: 33px;
     margin-top: 24px;
     border: 1px solid #F9EB00;
     border-radius: 4px;
     text-align: center;
     font-size: 18px;
     color: #F9EB00;
   }
 }
.interact_left{
  margin-left: 35px;
}
  .login_form{
    width: 350px;
    height: 370px;
    background: rgba(255,255,255,0.90);
    position: absolute;
    top:121px;
    left: 784px;
    .user_login{
      height: 64px;
      line-height: 64px;
      width: 100%;
      .user_title{
        font-size: 16px;
        color: #3C3C3C;
        font-weight: bold;
        letter-spacing: -0.03px;
        padding-left: 25px;
      }
    }
     .form{
       width: 300px;
       height:306px;
       margin: 0 auto;
       .userName{
         width: 300px;
         height: 42px;
         border: 1px solid rgba(0,0,0,0.12);
         .icon_login_user{
           display: inline-block;
           width: 42px;
           height:42px;
           float: left;
           background: url('../../images/icon_login_user.png') no-repeat center #DDDDDD;;
         }
         .user{
           display: inline-block;
           width: 248px;
           height: 42px;
           padding-left: 10px;
           float: left;
           font-size: 14px;
           color: #999999;
         }
       }
     }
  .password{
    width: 300px;
    height: 42px;
    margin-top: 20px;
    border: 1px solid rgba(0,0,0,0.12);
        .icon_login_password{
          display: inline-block;
          width: 42px;
          height:42px;
          float: left;
          background: url('../../images/icon_login_password.png') no-repeat center #DDDDDD;;
        }
        .user_password{
          display: inline-block;
          width: 248px;
          height: 42px;
          padding-left: 10px;
          float: left;
          font-size: 14px;
          color: #999999;
        }
  }
  .captcha{
    width: 300px;
    height: 42px;
    margin-top: 20px;
    position: relative;
    border: 1px solid rgba(0,0,0,0.12);
    .user_captcha{
      display: block;
      float: left;
      /deep/ .el-input__inner{
        border:0 !important;
        height:42px !important;
        width: 202px !important;
        padding-left: 50px !important;
      }
    }
    .captcha_img{
      display: inline-block;
      float: right;
      width: 97px;
      position: absolute;
      right: 0;
      top: 0;
      height: 42px;
      border-left: 1px solid rgba(0,0,0,0.12);
    }
  }
  .login_button{
    width: 300px;
    height: 42px;
    line-height: 42px;
    margin-top: 20px;
    cursor: pointer;
    text-align: center;
    background: #D93538;
    border-radius: 4px;
    .btn_login{
      font-size: 16px;
      color: #FFFFFF;
      font-weight: bold;
    }
  }
    .forget{
      width: 300px;
      margin-top: 25px;
      cursor: pointer;
      text-align: center;
      font-size: 12px;
      color: #6C6C6C;
    }
  }
  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    font-size: 14px;
    color: #999999;
  }
  input:-moz-placeholder, textarea:-moz-placeholder {
    font-size: 14px;
    color: #999999;
  }
  input::-moz-placeholder, textarea::-moz-placeholder {
    font-size: 14px;
    color: #999999;
  }
  input:-ms-input-placeholder, textarea:-ms-input-placeholder {
    font-size: 14px;
    color: #999999;
  }
  .forgetPassword{
    position: absolute;
    width: 300px;
    height: 46px;
    background: #FDF2F2;
    border: 1px solid rgba(217,53,56,0.45);
    left: 808px;
    top:430px;
    .close{
      width: 36px;
      height: 46px;
      float: left;
      .close_icon{
        display: block;
        width: 16px;
        height: 16px;
        background: url('../../images/icon_login_close.png') no-repeat;
        margin-left: 10px;
        margin-top: 7px;
        cursor: pointer;
      }
    }
    .temp_tip{
      width: 264px;
      height: 36px;
      float: right;
      .forget_tip{
        font-size: 12px;
        color: #999999;
        width: 155px;
        height: 32px;
        margin-top: 7px;
      }
    }
  }
  .messageInfo{
    position: absolute;
    width: 300px;
    height: 46px;
    background: #FDF2F2;
    border: 1px solid rgba(217,53,56,0.45);
    top: 17px;
    left: 25px;
    .psw_text{
      display: inline-block;
      font-size: 12px;
      color: red;
      padding-left: 10px;
      padding-top: 17px;
    }
    .icon_ban{
      display: inline-block;
      width: 15px;
      height: 15px;
      margin-left: 11px;
      margin-top: 17px;
    }
  }


</style>
