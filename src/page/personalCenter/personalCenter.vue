<template>
<div>
  <!--<tab></tab>-->
  <div class="wrapper">
    <div class="router-wrapper">
      <router-link to="/personalCenter">
        <span class="child2">个人中心</span>
      </router-link>
    </div>
    <div class="setTime">
      <div class="setTime_name">
        <div class="setTime_title setTime_title1" style="margin-left:20px;">个人中心</div>
      </div>
      <div class="setTime_content">
        <div class="form" v-if='show1'>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名：" prop="username">
              <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="姓名：" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="电话：" prop="telephone">
              <el-input v-model.number="ruleForm.telephone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="角色：">
              <span>{{roleName}}</span>
            </el-form-item>
            <!-- <button >保存</button> -->
          </el-form>
          <button @click="submitForm('ruleForm')" class="keep">保存</button>
        </div>

      </div>
    </div>
  </div>
</div>
</template>
<script type="text/ecmascript-6">
// 注意标签和引入驼峰，可以有区别
import {  getUserInfo,checkUsername,editorUserInfo } from 'service/getData'
import {  ERR_OK } from 'service/config'
//import Tab from 'components/common/tab'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
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
      }, 50);
    };
    return {
      show1: true,
      isA: false,
      message: false,
      userId:'',
      checkUsername:'',
      roleName:'',
      ruleForm: {
        username: "",
        name: '',
        telephone: "",
        email: "",

      },
      ruleForm1: {
        checkPass: '',
        pass: '',
        oldpass: ''
      },
      rules1: {
        checkPass: [{
          validator: validatePass2,
          trigger: 'blur'
        }],
        oldpass: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur,change'
        }, ],
        pass: [{
          validator: validatePass,
          trigger: 'blur'
        }, ],
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur,change'
        }, ],

        name: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur,change'
        }, ],
        telephone: [{
            validator: checkAge,
            trigger: 'blur'
          }
        ],
        email: [{
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur,change'
          }
        ]
      }
    };
  },
  components: {
//    Tab
  },
  mounted(){
    this.getData()
  },
  methods: {
    getData () {
      getUserInfo().then((res) => {
        if (res.code == ERR_OK) {
          this.ruleForm.username = res.data.userLoginName
          this.ruleForm.name = res.data.userName
          this.ruleForm.telephone = Number(res.data.telephone)
          this.ruleForm.email = res.data.email
          this.userId = res.data.userId
          this.roleName = res.data.roleName
          // this.$message({
          //   message: '修改密码成功',
          //   type: 'success'
          // });
        }
      })
    },
    editorUserInfo1 () {
      let self = this
      const params = {
        userId:this.userId,
        userLoginName:this.ruleForm.username,
        userName:this.ruleForm.name,
        telephone:this.ruleForm.telephone,
        email:this.ruleForm.email
      }
      editorUserInfo(params).then((res) => {
        if (res.code == ERR_OK) {
          this.$message({
            message: '修改个人中心成功',
            type: 'success'
          });
        }
      })
    },
    submitForm(formName) {
      let self = this
      const params = {userLoginName:self.ruleForm.username}
      this.$refs[formName].validate((valid) => {
        if (valid) {
          checkUsername(params).then((res) => {
            if (res.code == 'userNameRepeated') {
               this.$message.error(res.msg);
            }else{
              self.editorUserInfo1()
            }
          })
        } else {
          return false;
        }
      });
    },
    submitForm2(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //this.dialogVisible = false
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    mineCenter(formName) {
      this.show1 = true
      this.isA = false
      this.resetForm()
    },
    editorPass() {
      this.show1 = false
      this.isA = true
      this.ruleForm1.oldpass = '22'
    }
  }
};
</script>
<style lang="scss"  scoped>
.setTime {
    
    .setTime_name {
        height: 46px;
        line-height: 46px;
        width: 100%;
        font-size: 14px;
        color: #333333;
        background: rgba(217,52,55,0.10);
        box-sizing: border-box;
    }
}
.setTime_title {
    float: left;
    box-sizing: border-box;
    cursor: pointer;
}

.class-a .setTime_title2 {
    border-bottom: 2px solid #D93538;
    color: #D93538;
}
.class-a .setTime_title1 {
    border-bottom: none;
    color: #333333;
}
.setTime_content {
    
    height: 420px;
    background: #ffffff;
    border: 1px solid rgba(0,0,0,0.12);
    li {
        height: 30px;
        line-height: 30px;
        margin-top: 15px;
    }
}
.form {
    margin-top: 15px;
    width: 500px;
}
.keep {
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
