<template>
  <div>
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <router-link to="/personalCenter">
          <span class="child2">修改密码</span>
        </router-link>
      </div>
      <div class="setTime">
        <div class="setTime_name">
          <div class="setTime_title setTime_title2" style="margin-left:76px;">修改密码</div>
        </div>
        <div class="setTime_content">
          <div  class="form">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="旧密码" prop="oldpass">
                <el-input type="password" v-model="ruleForm.oldpass" auto-complete="new-password"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="pass" required>
                <el-input type="password" v-model="ruleForm.pass" auto-complete="new-password"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass" required>
                <el-input type="password" v-model="ruleForm.checkPass" auto-complete="new-password"></el-input>
              </el-form-item>
              <!-- <el-form-item label="年龄" prop="age">
                <el-input v-model.number="ruleForm.age"></el-input>
              </el-form-item> -->
            </el-form>
            <button @click="submitForm2('ruleForm')" class="keep">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
//  import Tab from 'components/common/tab'
  import { modifyPassword } from 'service/getData'
  import {  ERR_OK } from 'service/config'
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
       if (value === '') {
         callback(new Error('请输入新密码'));
       } else {
         if (this.ruleForm.checkPass !== '') {
           this.$refs.ruleForm.validateField('checkPass');
         }
         callback();
       }
     };
     var validatePass2 = (rule, value, callback) => {
       if (value === '') {
         callback(new Error('请确认密码'));
       } else if (value !== this.ruleForm.pass) {
         callback(new Error('两次输入密码不一致!'));
       } else {
         callback();
       }
     };
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入电话号码'));
      }
      setTimeout(() => {
        if (!(/^1[34578]\d{9}$/.test(value))) {
          callback(new Error('电话号码输入有误'));
        } else {
          callback();
        }
      }, 500);
    };
      return {
        show1:true,
        isA:false,
        message:false,
        ruleForm: {
          username:"",
          name: '',
          telephone:"",
          email:"",
          checkPass:'',
          pass:'',
          oldpass:''

        },
        ruleForm1:{
          checkPass:'',
          pass:'',
          oldpass:''
        },

        rules: {
          checkPass: [
              { validator: validatePass2, trigger: 'blur,change' }
          ],
          oldpass: [
            { required: true, message: '请输入旧密码', trigger: 'blur,change' },
          ],
          pass: [
             { validator: validatePass, trigger: 'blur,change' }
          ],
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur,change' },
          ],

          name: [
            { required: true, message: '请输入姓名', trigger: 'blur,change' },
          ],
          telephone:[
            { required: true, message: '电话不能为空'},
            { type: 'number', message: '电话必须为数字值'}
          ],
          email:[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ]
        }
      };
    },
    components: {
//      Tab
    },
    methods: {
      submitForm2(formName) {
        let self = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params ={
              oldPassword:self.ruleForm.oldpass,
              newPassword:self.ruleForm.checkPass
            }
            modifyPassword(params).then((res) => {
              if (res.code == ERR_OK) {
                this.$message({
                  message: '修改密码成功',
                  type: 'success'
                });
              }else{
                this.$message.error(res.errorInfoList[0].errorMsg);
              }
            })

          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
       this.$refs[formName].resetFields();
      },

    }
  };
</script>
<style lang="scss"  scoped>
  .setTime{
    .setTime_name{
      height: 46px;
      line-height: 46px;
      width: 100%;
      font-size: 14px;
      color: #333333;
      background: rgba(217,52,55,0.10);
      box-sizing: border-box;
    }
  }
  .setTime_title{
    float: left;
    box-sizing: border-box;
    cursor: pointer;
  }
  .setTime_title1{
    border-bottom: 2px solid #D93538;
    color: #D93538;
  }
  .class-a .setTime_title2{
    border-bottom: 2px solid #D93538;
    color: #D93538;
  }
  .class-a .setTime_title1{
    border-bottom: none;
    color: #333333;
  }
  .setTime_content{
    height: 420px;
    background: #ffffff;
    border: 1px solid rgba(0,0,0,0.12);
  li{
    height: 30px;
    line-height: 30px;
    margin-top: 15px;
  }
  }
  .form{
    margin-top: 15px;
    width: 500px;
  }
  .keep{
    width: 90px;
    height: 30px;
    border: 1px solid #D83436;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 214px;
    font-size: 14px;
    color: #D93437;
    background: #ffffff;
  }
</style>
