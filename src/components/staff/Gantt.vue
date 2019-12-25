<template>
  <div>
    <div class="weekTask" >
        <div class="head_title">
            <span class="left head_title_left">本周任务</span>
            <span class="right head_title_right">{{thisWeekStartDate}} 至 {{thisWeekEndDate}}</span>
        </div>
    <div>
    <div class="el-table__header-wrapper">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header">
          <thead class="table__header">
              <tr>
                  <th class="taskName">任务名称</th>
                  <th class="date_time">上周</th>
                  <th class="date_time" v-for="(item,index) in mondayFridayDates" :class="item.today? 'active_bd':''">
                    <span v-if="item.today"  class="today">今天（{{item.mondayFridayDate}}）</span>
                    <span v-if="!item.today&&index==0">周一（{{item.mondayFridayDate}}）</span>
                    <span v-if="!item.today&&index==1">周二（{{item.mondayFridayDate}}）</span>
                    <span v-if="!item.today&&index==2">周三（{{item.mondayFridayDate}}）</span>
                    <span v-if="!item.today&&index==3">周四（{{item.mondayFridayDate}}）</span>
                    <span v-if="!item.today&&index==4">周五（{{item.mondayFridayDate}}）</span>
                  </th>
                  <th class="date_time table_last">下周</th>
              </tr>
          </thead>
        </table>
    </div>
    <div class="el-table__body-wrapper">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
        <tbody>
            <tr class="el-table__row" v-for="item in tableData">
                <td class="table__body_taskName">
                  <span class="content ellipsis">{{item.title}}</span>
                  <!--部门重点-->
                   <p class="grant grade1" v-if="item.grade=='DEPARTMENT'" v-bind:style="{width: (item.planEndDatePoint-item.planStartDatePoint+1)*117+'px',left:371+item.planStartDatePoint*117+'px'}">
                     <span class="gradeStr">{{item.gradeStr}}</span>
                     <span class="hours" v-if="!item.onlyShowGrade">
                        <i class="hours_icon"></i>
                        <span class="time">{{item.taskSurplusDays}}h</span>
                     </span>
                   </p>
                  <!--个人普通-->
                  <p class="grant grade2" v-if="item.grade=='PERSONALORD'"  v-bind:style="{width: (item.planEndDatePoint-item.planStartDatePoint+1)*117+'px',left:371+item.planStartDatePoint*117+'px'}">
                    <span class="gradeStr">{{item.gradeStr}}</span>
                     <span class="hours" v-if="!item.onlyShowGrade">
                        <i class="hours_icon"></i>
                        <span class="time">{{item.taskSurplusDays}}h</span>
                     </span>
                  </p>
                  <!--个人重点-->
                  <p class="grant grade3" v-if="item.grade=='PERSONALIMP'"  v-bind:style="{width: (item.planEndDatePoint-item.planStartDatePoint+1)*117+'px',left:371+item.planStartDatePoint*117+'px'}">
                    <span class="gradeStr">{{item.gradeStr}}</span>
                     <span class="hours" v-if="!item.onlyShowGrade">
                        <i class="hours_icon"></i>
                        <span class="time">{{item.taskSurplusDays}}h</span>
                     </span>
                  </p>
                  <!--公司重点-->
                  <p class="grant grade4" v-if="item.grade=='COMPANY'"  v-bind:style="{width: (item.planEndDatePoint-item.planStartDatePoint+1)*117+'px',left:371+item.planStartDatePoint*117+'px'}">
                    <span class="gradeStr">{{item.gradeStr}}</span>
                    <span class="hours" v-if="!item.onlyShowGrade">
                        <i class="hours_icon"></i>
                        <span class="time">{{item.taskSurplusDays}}h</span>
                    </span>
                  </p>
                </td>
                <td class="table__body_date_time"></td>
                <td class="table__body_date_time"></td>
                <td class="table__body_date_time"></td>
                <td class="table__body_date_time"></td>
                <td class="table__body_date_time"></td>
                <td class="table__body_date_time"></td>
                <td class="table__body_date_time" style="border-right: 0"></td>
            </tr>
        </tbody>
    </table>
    </div>
    </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {listThisWeekTask} from '../../service/getData'
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
        tableData:[],
        thisWeekEndDate:"",
        thisWeekStartDate:"",
        mondayFridayDates:"",
      }
    },
    components:{

    },
    created(){
     if(this.userView=='STAFF'){
       this._listThisWeekTask()
     }
    },
    methods:{
     _listThisWeekTask(){
       listThisWeekTask().then((res) =>{
         if(res.code==ERR_OK){
           this.tableData=res.data.taskIndexInfoVos;
           this.thisWeekEndDate=res.data.thisWeekEndDate;
           this.thisWeekStartDate=res.data.thisWeekStartDate;
           this.mondayFridayDates=res.data.mondayFridayDates;
         }else{
           this.$notify.info({
             title: '提示',
             message: res.msg,
           });
         }
       })
     }
    }

  }
</script>
<style lang="scss"  scoped>
  .weekTask{
    min-height: 90px;
    border: 1px solid rgba(0,0,0,0.12);
    margin:10px auto;
  .head_title{
    width: 100%;
    height: 50px;
    border-bottom: 1px solid rgba(0,0,0,0.12);
    background: #EFEFEF;
  .head_title_left{
    display: block;
    width: 470px;
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    font-size: 16px;
    color: #505363;
  }
  .head_title_right{
    display: block;
    width: 700px;
    height: 50px;
    font-size: 16px;
    color: #8C97B2;
    line-height: 50px;
  }
  }
  }


  .table__header{
    display: block;
    height: 50px;
  tr{
    display: block;
    height: 50px;
    font-size: 13px;
    background: #ffffff;
    color: #505363;
  .taskName{
    padding: 0;
    margin: 0;
    width: 372px;
    height: 49px;
    font-size: 13px !important;
    color: #505363;
    line-height: 49px;
    text-align: center;
    border-right: 1px solid #DADFEA;
    border-bottom: 1px solid #DADFEA;
  }
  .date_time{
    width: 116px;
    height: 49px;
    line-height: 49px;
    text-align: center;
    font-size: 13px;
    color: #505363;
    border-right: 1px solid #DADFEA;
    border-bottom: 1px solid #DADFEA;
  }
  .table_last{
    border-right: none;
  }
  }
  }
  .el-table__body{
    background: #ffffff;
    color: #505363;
    font-size: 14px;
  }
  .el-table__row{
    margin: 0;
    padding: 0;
    height: 90px;
  }
  .grant{
    height: 22px;
    font-size: 13px;
    /*width: 400px;*/
    position: absolute;
    /*left: 371px;*/
    top:36px;
  }
  /*部门重点样式*/
  .grade1{
    font-size: 13px;
    color: #FFBF00;
    background: rgba(255,191,0,0.20);
    border: 1px solid rgba(255,191,0,0.20);
   .gradeStr{
     padding-left: 12px;
     display: block;
     height: 22px;
     line-height: 22px;
     float: left;
     border-left: 3px solid #FFBF00;;
   }
   .hours{
     float: right;
     width: 50px;
     display: block;
     .hours_icon{
       display: block;
       float: left;
       width: 10px;
       margin-top: 5px;
       height: 10px;
       background: url('../../images/icon_newtackyellow.png') no-repeat center center;
     }
     .time{
       display: inline-block;
       float: left;
       margin-left: 5px;
       margin-top: 2px;
     }
   }
  }
  /*个人普通样式*/
  .grade2{
    font-size: 13px;
    color: #108EE9;
    background: rgba(207,222,253,0.62);
    border: 1px solid rgba(16,142,233,0.20);
    .gradeStr{
      padding-left: 12px;
      display: block;
      height: 22px;
      line-height: 22px;
      float: left;
      border-left: 3px solid  #108EE9;
    }
    .hours{
      float: right;
      width: 50px;
      display: block;
    .hours_icon{
      display: block;
      float: left;
      margin-top: 5px;
      width: 10px;
      height: 10px;
      background: url('../../images/icon_newtackbule.png') no-repeat center center;
    }
    .time{
      display: inline-block;
      float: left;
      margin-left: 5px;
      margin-top: 2px;
    }
    }
  }
  /*个人重点样式*/
  .grade3{
    font-size: 13px;
    color: #00A854;
    background: rgba(0,168,84,0.20);
    border: 1px solid rgba(0,168,84,0.20);
  .gradeStr{
    padding-left: 12px;
    display: block;
    height: 22px;
    line-height: 22px;
    float: left;
    border-left: 3px solid #00A854;
  }
  .hours{
    float: right;
    width: 50px;
    display: block;
  .hours_icon{
    display: block;
    float: left;
    margin-top: 5px;
    width: 10px;
    height: 10px;
    background: url('../../images/icon_newtackgreen.png') no-repeat center center;
  }
  .time{
    display: inline-block;
    float: left;
    margin-left: 5px;
    margin-top: 2px;
  }
  }
  }
  /*公司重点样式*/
  .grade4{
    font-size: 13px;
    color: #F04134;
    background: rgba(240,65,52,0.15);
    border: 1px solid rgba(240,65,52,0.20);
    .gradeStr{
      padding-left: 12px;
      display: block;
      height: 22px;
      line-height: 22px;
      float: left;
      border-left: 3px solid #F04134;
    }
      .hours{
        float: right;
        width: 50px;
        display: block;
      .hours_icon{
        display: block;
        float: left;
        width: 10px;
        margin-top: 5px;
        height: 10px;
        background: url('../../images/icon_clock.png') no-repeat center center;
      }
      .time{
        display: inline-block;
        float: left;
        margin-left: 5px;
        margin-top: 2px;
      }
      }
  }
  .table__body_taskName{
    width: 372px;
    position: relative;
    padding: 0;
    margin: 0;
    border-right: 1px solid #DADFEA;
    border-bottom: 1px solid #DADFEA;
  .content{
    display: block;
    width: 340px;
    margin: 0 auto;
  }
  }
  .table__body_date_time{
    width: 116px;
    border-right: 1px solid #DADFEA;
    border-bottom: 1px solid #DADFEA;
  }
  .el-table__body-wrapper{
    overflow: hidden;
  }
  .el-table__row:last-child td{
    border-bottom: 0 !important;
  }
  .active_bd{
    border-bottom: 0 !important;
  }
  .today{
    display: block;
    height: 46px;
    background: rgba(217,52,55,0.07);
    border-bottom: 3px solid #D93437;
  }
</style>
