<template>
  <div class="wrapper indexHome">
    <!--<tab></tab>-->
    <div v-cloak v-if="userView=='MANAGER'">
      <el-row class="shortcuts" :gutter="20">
        <el-col :span="12">
          <manage></manage>
        </el-col>
        <el-col :span="12">
          <managenav></managenav>
        </el-col>
      </el-row>
      <div>
        <recapitulate></recapitulate>
      </div>
    </div>
    <div v-cloak v-if="userView=='DEPT'">
      <div class="shortcuts">
        <div class="left">
          <manage></manage>
        </div>
        <div class="right">
          <departmentenav></departmentenav>
        </div>
      </div>
      <div>
        <dept></dept>
      </div>
    </div>
    <div v-cloak v-if="userView=='STAFF'">
      <staff></staff>
      <!--<gantt></gantt>-->
    </div>
    <el-dialog
      title="必读公告"
      :visible.sync="dialogVisible"
      size="small"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      top='17%' class="index">
      <div><h2 class="title">{{data.title}}</h2></div>
      <div>
        <p class="ad_content" v-html="data.descContent"></p>
      </div>
      <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item  prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入回复内容" class="revert-input"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
          <el-button type="danger" @click="submitForm('ruleForm')">
            <div style="float: left"><i class="revert-icon"></i></div>
            <div style="float: left"><span style="color: #ffffff;padding-left: 8px">回复</span></div>
          </el-button>
      </span>
    </el-dialog>


  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
//  import Tab from 'components/common/tab'
  import Staff from 'components/staff/nav'
  import Manage from 'components/manager/manage'
  import Department from 'components/department/nav'
  import Managenav from 'components/manager/nav'
  import Departmentenav from 'components/department/nav'
  import Dept from 'components/department/recapitulateDept'
  import Recapitulate from 'components/manager/recapitulate'
//  import Gantt from 'components/staff/Gantt'
  import {noticeInfo,noticeSns,taskExpirationReminder} from '../../service/getData'
  import {ERR_OK} from 'service/config'
  import { mapGetters} from 'vuex'
  export default {
    computed:{
      userView() {
        return this.singer.userView
      },
      ...mapGetters([
        'singer'
      ]),
    },
    data() {
      return {
        loading: false,
        dialogVisible:false,
        data:[],
        Reminder:[],
        noticeId:null,
        staff:false,
        ruleForm: {
          name: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入回复内容'},
            {  max: 200, message: '回复内容长度不能超过200个字符' }
          ],
        }
      }
    },
    mounted(){
        this._noticeInfo();
        this._taskExpirationReminder();
      var self=this;
        setInterval(function () {
          self._taskExpirationReminder();
        },1000*60*60)
    },
    components: {
//      Tab,
      Staff,
      Manage,
      Managenav,
      Departmentenav,
      Department,
//      Gantt,
      Dept,
      Recapitulate
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this._noticeSns()
          } else {
            return false;
          }
        });
      },
//      必读公告
      _noticeInfo(){
        var self=this;
        noticeInfo().then(function (res) {
          if(res.code==ERR_OK){
            self.dialogVisible=true;
            if(res.data){
              self.dialogVisible=true;
              self.data=res.data[0];
              self.noticeId=res.data[0].noticeId
            }else{
              self.dialogVisible=false;
            }
          }else{
            self.$notify.error({
              title: '错误',
              message:res.msg,
            });
          }
        })
        },
//      回复必读公告
      _noticeSns(){
        var self=this;
        noticeSns({snsContent:this.ruleForm.name,noticeId:this.noticeId}).then(function (res) {
          if(res.code==ERR_OK){
            self. _noticeInfo();
            self.ruleForm.name=""
          }else{
            self.$notify.error({
              title: '错误',
              message: res.msg,
            });
          }
        })
      },
//      关闭提醒
      close(){
        this.fadeIn=false
      },
//      首页到期提醒
      _taskExpirationReminder(){
        taskExpirationReminder().then((res) =>{
          if(res.code==ERR_OK){
            const h = this.$createElement;
            var self=this;
            if(res.data.length>0){
              for(let i=0;i<res.data.length;i++){
               setTimeout(function () {
                 self.$notify({
                   title: '任务到期提醒',
                   type: 'warning',
                   duration: 0,
                   message: h('p', null, [
                     h('a', { style: 'display:block;',href:'/taskDetail' },res.data[i].title+" 即将逾期；"),
                     h('i', { style: 'color: red' }, res.data[i].taskSurplusDaysStr),
                   ]),
                   onClick: function () {
                      this.close();
                     self.$router.push({
                       path:'/taskDetail',
                       query:{
                         id:res.data[i].taskId
                       }
                     })
                   },

                 },1);
               })
              }
            }
          }
        })
      }
    }
  };
</script>
<style lang="scss"  scoped>
  @import '../../style/mixin';
  .index .title{
    font-size: 16px;
    color: #757575;
    text-align: center;
    padding-bottom: 16px;
  }
  .index .ad_content{
    font-size: 14px;
    color: #757575;
    padding: 2px 0;
  }
  .shortcuts{
    min-height:200px;
    margin:10px auto;
    border-radius: 6px;
  }
  .revert-input{
    margin-top: 20px;
    color: #C5C5C5;
    width: 1050px;
  }
  .revert-icon{
    display: inline-block;
    width: 15px;
    height: 15px;
    background: url('../../images/revers.png') no-repeat center center;
  }
  
  .index .el-dialog--small{
    width: 1190px !important;
  }
  .index .el-dialog__title{
    font-size: 16px !important;
    color: #505363 !important;
    font-size: 16px !important;
  }
  .index .el-dialog__body{
    padding: 25px 43px 0 68px !important;
  }
  .index .el-input__inner{
    padding: 3px 15px !important;
    border: 1px solid #C5C5C5 !important;
  }
  .index .el-button--danger {
    color: #fff !important;
    background-color: #D93437 !important;
    border-color: #D93437 !important;
    font-size: 14px !important;
  }
  
  .indexHome .el-notification{
    z-index: 1 !important;
  }
</style>
