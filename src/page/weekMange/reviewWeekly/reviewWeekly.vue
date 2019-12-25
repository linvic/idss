<template>
  <div>
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <router-link to="/weekManageDepartLeader">
          <span class="child1">周报管理</span>
        </router-link>
        /
        <router-link to="/weekManageDepartLeader">
          <span class="child1">周报列表</span>
        </router-link>
        /

        <span class="child2">审阅个人周报</span>

      </div>
      <div class="title-header">
        <div class="week-title">
          部门员工周报
        </div>
        <div class="week-date">
          日期：{{startDay}} 至 {{endDay}}
        </div>
      </div>
      <div class="circle-wrapper">
        <div class="circle-name">
          <div class="circle-content">
            {{taskTotal}}
          </div>
          <span>本周任务总数</span>
        </div>
        <div class="circle-name">
          <div class="circle-content">
            {{completionRate}}%
          </div>
          <span>任务完成率</span>
        </div>
        <div class="circle-name">
          <div class="circle-content">
            {{averagePerformance}}
          </div>
          <span>部门平均绩效评估</span>
        </div>
        <div class="circle-name">
          <div class="circle-content">
            {{nextTaskTotal}}
          </div>
          <span>下周任务数</span>
        </div>
        <div class="circle-name">
          <div class="circle-content">
            {{nextImptaskTotal}}
          </div>
          <span>下周重点任务数</span>
        </div>
      </div>
      <div class="week-bar">
        <div  class="week-next">
          系统自动提交个人周报：{{autoSubUsers}}
        </div>
      </div>
      <div class="get-reward" style="margin-top:21px;">
        <el-table
          :data="result"
          style="width: 100%" empty-text='暂无数据'>
          <el-table-column
            prop="userName"
            label="姓名"
          >
          </el-table-column>
          <el-table-column
            prop="taskTotal"
            label="本周任务数"
          >
          </el-table-column>
          <el-table-column
            prop="completionRate"
            label="任务完成率"
          >
          <template slot-scope='props'>
            <span>{{props.row.completionRate}}%</span>
          </template>
          </el-table-column>
          <el-table-column
            prop="performanceScore"
            label="任务绩效分"
          >
          </el-table-column>

          <el-table-column
            prop="evaluatingScore"
            label="绩效评估分"
          >
          </el-table-column>
          <el-table-column
            prop="nextTaskTotal"
            label="下周任务数"
          >
          </el-table-column>
          <el-table-column
            prop="subStatus"
            label="周报提交状态"
          >
          <template slot-scope='props'>
            <span v-if='props.row.subStatus == "AUTO"' style='color:#D93437;'> 自动提交</span>
            <span v-else> 手动提交</span>
          </template>
          </el-table-column>
          <el-table-column
            prop="commentStatus"
            label="负责人点评"
          >
          <template slot-scope='props'>
            <span v-if='props.row.commentStatus'>已点评</span>
            <span v-else>未点评</span>
          </template>
          </el-table-column>
          <el-table-column
            prop="sourceType"
            label="操作"
          >
          <template slot-scope='props'>
            <router-link :to="{ path: 'staffWeekDetail',query: {id:props.row.weeklyId}}">
              <span style='color:#D93437;cursor:pointer;'>查看</span>
            </router-link>
          </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <router-link to="/postDepartWeekly"> -->
      <div class="button-close" @click='replyWeek'>
        发起部门周报
      </div>
      <!-- </router-link> -->
      <el-dialog
        title="确定下周计划"
        :visible.sync="dialogVisible"
        size="tiny"
        :before-close="handleClose" top='25%' class="department deleteDepartment">
        <span>还有 {{roleName}}个员工没有点评，你还要继续吗？</span>
        <span slot="footer" class="dialog-footer">
          <button @click="dialogVisible = false">取 消</button>
           <button @click="sureDelete">确 定</button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
  import { departReviewWeekly } from 'service/getData'
  import {ERR_OK,formatDateTime} from 'service/config'
//  import Tab from 'components/common/tab'
  export default {
    data() {
      return {
        result:[],
        taskTotal:'',
        completionRate:'',
        averagePerformance:'',
        nextTaskTotal:'',
        roleName:'',
        nextImptaskTotal:'',
        dialogVisible:false,
        autoSubUsers:'',
        autoSubUsers1:[],
        startDay:'',
        endDay:'',
        canPublish:''
      }
    },
    components: {
//      Tab
    },
    mounted(){
      this.getData()
    },
    methods: {
      sureDelete(){
        this.$router.push('/postDepartWeekly')
      },
      handleClose(done){
        this.dialogVisible = false
      },
      getData() {
        let self = this
        departReviewWeekly().then((res) => {
          if(res.code == ERR_OK) {
            this.startDay = res.data.startDay
            this.endDay = res.data.endDay
            this.result = res.data.taskDeptStaffWeeklyListVos
            this.taskTotal = res.data.taskTotal
            this.completionRate = res.data.completionRate
            this.averagePerformance = res.data.averagePerformance
            this.nextTaskTotal = res.data.nextTaskTotal
            this.nextImptaskTotal = res.data.nextImptaskTotal
            this.canPublish = res.data.canPublish
            this.roleName =res.data.noneCommentUserNum
            if(res.data.autoSubUsers != null){
              for(let item of res.data.autoSubUsers){
                this.autoSubUsers1.push(item.userName)
              }
              this.autoSubUsers = this.autoSubUsers1.join('、')
            }else{
              this.autoSubUsers = ''
            }

          }
       })
      },
      replyWeek(){
        if(this.canPublish == false){
          this.dialogVisible = true
        }else{
          this.$router.push('/postDepartWeekly')
        }
      }
    }
  };
</script>
<style lang="scss"  scoped>
  .title-header{
    opacity: 0.99;
    background: rgba(217,52,55,0.10);
    height: 46px;
    line-height: 46px;
  }
  .week-title{
    font-size: 14px;
    color: #333333;
    margin-left: 20px;
    float: left;
  }
  .week-date{
    float: left;
    font-size: 12px;
    color: #333333;
    margin-left: 78px;
  }
  .week-button1{
    float: right;
    height: 25px;
    width: 114px;
    text-align: center;
    border: 1px solid #D93538;
    border-radius: 4px;
    font-size: 14px;
    color: #D93538;
    margin-top: 11px;
    line-height: 25px;
    margin-right: 120px;
    cursor: pointer;
  }
  .week-button2{
    float: right;
    height: 25px;
    line-height: 25px;
    width: 114px;
    text-align: center;
    border: 1px solid #D93538;
    border-radius: 4px;
    font-size: 14px;
    color: #D93538;
    margin-top: 11px;
    margin-right: 20px;
    cursor: pointer;
  }
  .circle-wrapper{
    font-size: 12px;
    color: #757575;
    height: 128px;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.12);
    border-top:none;
    border-bottom:none;
  }
  .circle-name{
    text-align: center;
    float: left;
    padding: 0 57.5px;
    padding-top: 15px;
  }
  .circle-name span{
    margin-top: 10px;
    display: block;
  }
  .circle-content{
    border: 3px solid #E0E0E0;
    border-radius: 50%;
    width: 72px;
    height: 72px;
    font-size: 18px;
    color: #32BBE2;
    line-height: 69px;
    box-sizing: border-box;
  }
  .week-bar{
    height: 52px;
    line-height: 50px;
    background-color: #fff;
    border: 1px solid rgba(0,0,0,0.12);
    font-size: 12px;
    color: #434343;
  }
  .week-next{
    float: left;
    margin-left: 20px;
  }
  .week-next1{
    margin-left: 150px;
  }
  .perform-title{
    opacity: 0.99;
    height: 46px;
    line-height: 46px;
    font-size: 14px;
    color: #434343;
    margin-top: 20px;
    border: 1px solid rgba(0,0,0,0.12);
    background: rgba(217,52,55,0.02);
  }
  .perform-title h4{
    margin-left: 20px;
  }
  .content-tab {
      line-height: 17px;
      display: block;
      font-size: 12px;
      padding: 0 20px 0 0;
      min-width: 220px;
  }
  .input-back input {
      height: 24px;
      width: 225px;
      padding-left: 6px;
      border: 1px solid #979797;
  }
  .input-back span {
      height: 24px;
      width: 48px;
      display: inline-block;
      background: #D93437;
      line-height: 24px;
      color: #fff;
      font-size: 12px;
      cursor: pointer;
      text-align: center;
  }
  .reback {
      font-size: 12px;
      color: #505363;
      line-height: 28px;
      background: #DFDFDF;
      padding-left: 10px;
  }
  .reback-time {
      text-align: left;
      font-size: 12px;
      color: #505363;
      line-height: 12px;
      margin-bottom: 5px;
      margin-top: 5px;
  }
  .special {
      color: transparent;
  }
  .title-left {
      float: left;
  }
  .title-left span:first-child {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 9px;
      background: #FFBF00;
  }
  .title-right {
      float: left;
      margin-left: 35px;
  }
  .demo-table-expand {
      font-size: 0;
  }
  .demo-table-expand label {
      width: 90px;
      color: #505363;
  }
  .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 25%;
  }
  .demo-table-expand .el-form-item:first-child {
      width: 254px;
      overflow: hidden;
  }
  .demo-table-expand .el-form-item:nth-child(2) {
      width: 330px;
      overflow: hidden;
  }
  .demo-table-expand .el-form-item:nth-child(3) {
      width: 258px;
      overflow: hidden;
  }
  .demo-table-expand .el-form-item:nth-child(4) {
      width: 242px;
      overflow: hidden;
  }
  .my-comment{
    border: 1px solid rgba(0,0,0,0.12);
    margin-top: 21px;
  }
  .my-comment h3{
    font-size: 16px;
    color: #333333;
    opacity: 0.99;
    height: 46px;
    line-height: 46px;
    padding-left: 20px;
    background: rgba(217,52,55,0.10);
  }
  .my-comment .comment-content{
    padding: 20px 15px;
    line-height: 22px;
    font-size: 12px;
    color: #333333;
  }
  .special-title{
    height: 46px;
    line-height: 46px;
    opacity: 0.99;
    background: rgba(217,52,55,0.10);
    font-size: 16px;
    color: #333333;
    margin-top: 21px;
  }
  .special-title h4{
    margin-left: 20px;
  }
  .button-close{
    border: 1px solid #D83436;
    border-radius: 4px;
    width: 110px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 14px;
    color: #D93437;
    margin: 30px auto;
    cursor: pointer;
  }
</style>
