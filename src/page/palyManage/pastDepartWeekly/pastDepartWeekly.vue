<template>
  <div>
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <router-link to="/palyManage">
          <span class="child1">周报管理</span>
        </router-link>
        /
        <span class="child2">周报列表</span>
      </div>
      <div class="" >
        <div class="role-title" style='border-bottom:none;'>
          <div class="role-num import-num">
            各部门周报
          </div>
          <span>{{startDay}}-{{endDay}}</span>
        </div>
        <div class="get-reward">
          <el-table
            :data="result"
            style="width: 100%" empty-text='暂无数据'>
            <el-table-column
              prop="deptName"
              label="部门"
            >
            </el-table-column>
            <el-table-column
              prop="imptaskTotal"
              label="重点任务数"
            >
            </el-table-column>
            <el-table-column
              prop="impCompletionRate"
              label="重点任务完成率"
            >
            <template slot-scope='props'>
              <span >{{props.row.impCompletionRate}}</span>
            </template>
            </el-table-column>
            <el-table-column
              prop="nextImptaskTotal"
              label="下周重点任务数"
            >
            </el-table-column>
            <el-table-column
              prop="commentStatus"
              label="总经理点评"
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
              <router-link :to="{ path: 'weekDetailDepart',query: {id:props.row.deptWeeklyId}}">
              <span style="color: #D93437;cursor:pointer;">查看</span>
              </router-link>
            </template>
            </el-table-column>

          </el-table>
        </div>
        <div class="button-close" @click='replyWeek'v-if='tipNav'>
          确定下周计划
        </div>
        <el-dialog
          title="确定下周计划"
          :visible.sync="dialogVisible"
          size="tiny"
          :before-close="handleClose" top='25%' class="department deleteDepartment">
          <span>还有 {{roleName}}个部门没有点评，你还要继续吗？</span>
          <span slot="footer" class="dialog-footer">
            <button @click="dialogVisible = false">取 消</button>
             <button @click="sureDelete">确 定</button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { allDeptWeekly } from 'service/getData'
  import {ERR_OK,formatDateTime} from 'service/config'
//  import Tab from 'components/common/tab'
  export default {
    data() {
      return {
        value1:'',
        value2:'',
        value3:'',
        value4:'',
        dialogVisible:false,
        startDay:'',
        endDay:'',
        id:'',
        tipNav:true,
        canPublish:'',
        roleName:'',
        noneCommentUserNum:'',
        options1:[],
        options2:[],
        options3:[],
        result:[],
        tableData: [],
        options:[]
      };
    },
    components: {
//      Tab
    },
    created () {
      this.id = this.$route.query.id
      if(typeof(this.id)==="undefined"){
        this.tipNav = true
      }else{
        this.tipNav = false
      }
    },
    mounted(){
      this.getData()
    },
    methods: {
      sureDelete(){
        this.$router.push('/sureNextPlan')
      },
      handleClose(done){
        this.dialogVisible = false
      },
      getData(){
        let self = this
        const params = {
          weeklyStamp:this.id
        }
        allDeptWeekly(params).then((res) => {
          if(res.code == ERR_OK) {
            this.startDay = res.data.startDay
            this.canPublish = res.data.canPublish
            this.endDay = res.data.endDay
            this.noneCommentUserNum = res.data.noneCommentUserNum
            this.result = res.data.taskAllWeeklyListVos
            this.roleName = res.data.noneCommentUserNum
          }
       })
     },
     replyWeek(){
       if(this.canPublish == true){
         this.dialogVisible = true
       }else{
         this.$router.push('/sureNextPlan')
       }
     }
    }
  };
</script>
<style lang="scss"  scoped>
  .user-title{
    opacity: 0.99;
    background: rgba(217,52,55,0.10);
    height: 46px;
    line-height: 46px;
    width: 100%;
    font-size: 14px;
    border: 1px solid rgba(0,0,0,0.12);
  }

  .title-name{
    float: left;
    padding: 0 14px;
    color: #333333;
    text-align: center;
    box-sizing: border-box;
    height:46px;
    cursor: pointer;
  }
  .title-name1{
    margin-left: 54px;
  }
  .title-name span{
    color: #C2453A !important;
  }
  .title-name:first-child{
    margin-left: 0px;
  }
  .title-name.active{
    color: #D93538;
    border-bottom:2px solid #D93538;
  }
  .role-title {
    margin-top: 10px;
    height: 46px;
    line-height: 46px;
    border: 1px solid rgba(0,0,0,0.12);
    opacity: 0.99;
    background: rgba(217,52,55,0.02);
  }
  .role-num {
    float: left;
    font-size: 14px;
    color: #333333;
  }
  .role-num:nth-child(1) {
    margin-left: 20px;
  }
  .role-num:nth-child(2) {
    margin: 0 35px;
  }
  .button-perform{
    float: left;
    height: 24px;
    line-height: 24px;
    width: 75px;
    margin-top: 11px;
    margin-left: 70px;
    background: #FFFFFF;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 4px;
    text-align: center;
    font-size: 12px;
    color: #434245;
    cursor: pointer;
  }
  .content-task{
    float: left;
    width: 190px;
    font-size: 12px;
    margin-top: 11px;
  }

  .import-num{
    font-size: 14px;
    color: #333333;
    margin-left: 20px !important;
    margin-right: 40px;
  }
  .role-title span{
    font-size: 12px;
    color: #999999;
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
