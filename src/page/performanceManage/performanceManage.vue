<template>
  <div>
    <!--<tab></tab>-->
    <div class="wrapper performanceManage">
      <div class="router-wrapper" v-show=" 0 == num">
          <span class="child1">绩效管理</span>
        /
          <span style="color: #D93437;cursor:pointer;">任务绩效</span>
      </div>
      <div class="router-wrapper" v-show=" 1 == num">
          <span class="child1">绩效管理</span>
        /
          <span style="color: #D93437;cursor:pointer;">考勤绩效</span>
      </div>
      <div class="router-wrapper" v-show=" 2 == num">
          <span class="child1">绩效管理</span>
        /
          <span style="color: #D93437;cursor:pointer;">奖惩记录</span>
      </div>
      <div class="router-wrapper" v-show=" 3 == num">
          <span class="child1">绩效管理</span>
        /
          <span style="color: #D93437;cursor:pointer;">工资条</span>
      </div>
      <div class="user-title">
        <div class="title-name title-name1 title-name5"
          v-for="(item,index) in tabs"
            :class="{active:index == num}"
             @click="tab(index)" v-html="item">{{item}}
        </div>
      </div>
      <!--任务绩效-->
      <div class=""
            v-show=" 0 == num">
        <div class="role-title">
          <div class="role-num">
            任务时间：
            <el-date-picker
              v-model="monthValue"
              :editable="false"
              type="month"
              placeholder="选择月"
              value-format="yyyy-MM"
            >
            </el-date-picker>
          </div>
          <div class="role-num">
            完成时间：
            <el-select v-model="time" placeholder="全部" class="role-button">
              <el-option v-for="item in finishTime" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="role-num">
            完成质量：
            <el-select v-model="mass" placeholder="全部" class="role-button">
              <el-option v-for="item in finishMass" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="role-num" style="margin-left:43px;">
            <span style="float:left;">任务标题：</span>
            <el-input v-model="content" placeholder="请输入任务标题" class='content-task'></el-input>
          </div>
          <div class="button-perform" @click="search">
            搜索
          </div>
        </div>
        <div class="circle-wrapper">
          <div class="circle-name">
            <div class="circle-content">
              {{performanceStatistics.completedTotalCount}}
            </div>
            <span>完成任务总数</span>
          </div>
          <div class="circle-name">
            <div class="circle-content">
              {{performanceStatistics.evaluatingRank}}
            </div>
            <span>公司排名</span>
          </div>
          <div class="circle-name">
            <div class="circle-content">
              {{performanceStatistics.thisMonthCompletedCount}}
            </div>
            <span>当月完成任务数</span>
          </div>
          <div class="circle-name">
            <div class="circle-content">
              {{performanceStatistics.evaluatingDeptRank}}
            </div>
            <span>部门排名</span>
          </div>
          <div class="circle-name" >
            <el-tooltip placement="top">
              <div slot="content">当周/月的任务绩效评估总分 = <br/>（公司重点任务的任务绩效评估分相加 / 公司重点任务数量 * 公司重点任务权重系数）<br/> + 部门重点... + 个人重点... + 个人普通...</div>
              <div>
                
                <div class="circle-content">
                  {{performanceStatistics.thisMonthEvaluatingScore}}
                </div>
                <span>当月任务绩效</span>
              </div>
            </el-tooltip>
          </div>
        </div>
        <div class="get-reward">
          
          <el-table
            :data="performanceData.result"
            style="width: 100%" empty-text='暂无数据'>
            <!-- <el-table-column
              prop="userName"
              label="任务ID"
            >
            </el-table-column> -->
            <el-table-column
              prop="title"
              label="任务标题"
            >
            </el-table-column>
            <el-table-column
              prop="completeStatusStr"
              label="完成时间"
            >
            </el-table-column>
            <el-table-column
              prop="finishQualityStr"
              label="完成质量"
            >
            </el-table-column>
            <el-table-column
              prop="performanceScore"
              label="任务绩效分"
              :render-header="renderTableHeader"
            >
            </el-table-column>
            <el-table-column
              prop="evaluatingScore"
              label="绩效评估分"
              :render-header="renderTableHeader"
            >
            </el-table-column>
            <el-table-column
              prop="taskScore"
              label="该任务的分值"
            >
            </el-table-column>
            <el-table-column
              prop="sourceType"
              label="操作"
            >
            <template slot-scope='props'>
              <router-link :to="{path:'/taskDetail',query: {id: props.row.taskId}}">
                <el-button
                  size="small"
                >查看任务绩效详情</el-button>
              </router-link>
            </template>
            </el-table-column>

          </el-table>
        </div>
        <div class="pagination-depart" v-if="total>0">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="nowPage"
                         :page-sizes="[10, 15, 50]"
                         :page-size=pageSize layout="total, sizes, prev, pager, next, jumper"
                         :total=total>
          </el-pagination>
        </div>
      </div>
      <!--绩效管理-->
      <div class=""
           v-show=" 1 == num">
           <div class="" style='padding-left:20px;padding-top:15px;padding-bottom:15px;' v-if='uploadPerfmPermission'>
             <router-link to="/addAtendence">
             <el-button
               size="small"
             >添加考勤</el-button>
             </router-link>
           </div>
        <div class="role-title" style="border-bottom:none;">
          <div class="attendance">
            <span>员工考勤</span>
          </div>
          <div class="role-num" style="margin-left: 640px">
            任务时间：
            <el-date-picker
              v-model="monthValue1"
              :editable="false"
              type="month"
              placeholder="选择月"
              value-format="yyyy-MM"
            >
            </el-date-picker>
          </div>
          <div class="button-perform attendance_search" @click="searchPerfmHrEntity">
            搜索
          </div>
        </div>
        <div class="performance">
          <el-table
            :data="tableDataValue"
            style="width: 100%"
            empty-text='暂无数据'>
            <el-table-column
              prop="hrDate"
              label="时间"
            >
            </el-table-column>
            <el-table-column
              prop="lateSize"
              width="80"
              align="center"
              label="迟到　(30/次)"
            >
            </el-table-column>
            <el-table-column
              width="90"
              prop="leaveEarlySize"
              align="center"
              label="　早退　(30/次)"
            >
            </el-table-column>
            <el-table-column
              prop="leaveSize"
              width="120"
              align="center"
              label="　　 事假　　(当日实际工资)"
            >
            </el-table-column>
            <el-table-column
              width="120"
              align="center"
              prop="absenceSize"
              label="　　 缺卡　　(当日实际工资)"
            >
            </el-table-column>
            <el-table-column
              prop="absenteeismSize"
              width="140"
              align="center"
              label="　　 　旷工　　　(2倍当日实际工资)"
            >
            </el-table-column>
            <el-table-column
              prop="missnoticeSize"
              width="110"
              align="center"
              label="　缺公告回复  　(30元/次)"
            >
            </el-table-column>
            <el-table-column
              prop="dailySize"
              width="100"
              align="center"
              label=" 日报考勤　(50元/次)"
            >
            </el-table-column>
            <el-table-column
              prop="weeklySize"
              width="120"
              align="center"
              label="　 周报考勤　 　(100元/次)"
            >
            </el-table-column>
            <el-table-column
              prop="clothSize"
              width="120"
              align="center"
              label="　 着装问题　 　(100元/次)"
            >
            </el-table-column>
            <el-table-column
              prop="total"
              align="center"
              label="合计"
            >
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination-depart"  v-if="total1>0">
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="nowPage1"
            :page-sizes="[10, 15, 50]"
            :page-size=pageSize1
            layout="total, sizes, prev, pager, next, jumper"
            :total=total1>
          </el-pagination>
        </div>
      </div>
      <!--奖惩记录-->
      <div class=""
           v-show=" 2 == num">
        <div class="role-title" style="border-bottom:none;">
          <div class="attendance">
            <span>奖惩记录</span>
          </div>
          <div class="role-num role-list">
            <router-link to="/RedHeiBang">
              <el-button
                size="small"
              >红黑榜</el-button>
            </router-link>
          </div>
        </div>
        <div class="get-reward">
          <el-table
            :data="tableDatastaff"
            style="width: 100%" empty-text='暂无数据'>
            <!-- <el-table-column
              prop="userName"
              label="姓名"
            >
              <template slot-scope="props">
                <router-link :to="{path:'/userDetail',  query:{id: props.row.userId}}"  >
                  <span class="department-name">{{props.row.userName}}</span>
                </router-link>
              </template>
            </el-table-column> -->
            <el-table-column
              prop="rpTime"
              label="奖惩时间"
            >
            </el-table-column>
            <el-table-column
              label="奖惩金额"
            >
              <template slot-scope="props">
                <span style="color: #D93538" v-if="props.row.rpType=='REWARD'">+{{props.row.rpAmount}}</span>
                <span style="color:#018050" v-if="props.row.rpType=='PUNISH'">{{props.row.rpAmount}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="rpReason"
              label="奖惩原因"
            >
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination-depart" v-if="totalstaff>0">
          <el-pagination
            @size-change="handleSizeChange3"
            @current-change="handleCurrentChange3"
            :current-page="nowPage3"
            :page-sizes="[10, 15, 50]"
            :page-size=pageSize3
            layout="total, sizes, prev, pager, next, jumper" :total=totalstaff>
          </el-pagination>
        </div>
      </div>
      <!--工资条-->
      <div class=""
           v-show=" 3 == num">
         <div class="" style='padding-left:20px;padding-top:15px;padding-bottom:15px;' v-if='outputSalaryBillsPermission'>

           <el-button
             size="small"
           @click='produceWages'>生成本月工资条</el-button>

         </div>
        <div class="get-reward" style='margin-top:10px;'>
          <el-table
            :data="tableSalary"
            style="width: 100%" empty-text='暂无数据'>
            <el-table-column
              prop="salaryTime"
              label="月份"
            >
            </el-table-column>
            <el-table-column
              label="绩效工资总额"
            >
              <template slot-scope="props">
                <span>{{props.row.perfmWages}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="任务绩效奖罚"
            >
              <template slot-scope="props">
                <span>{{props.row.taskPerfm}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="日常考勤扣款"
            >
              <template slot-scope="props">
                <span>{{props.row.hrPerfm}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="奖惩合计"
            >
              <template slot-scope="props">
                <span>{{props.row.rpTotal}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="evaluatingScore"
              label="实发绩效工资"
            >
              <template slot-scope="props">
                <span>{{props.row.realTotal}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="sourceType"
              label="操作"
            >
              <template slot-scope='props'>
                <router-link :to="{path:'/wagesDetail',query:{id:props.row.perfmSalaryId}}">
                  <el-button
                    size="small"
                  >查看工资详情</el-button>
                </router-link>
              </template>
            </el-table-column>

          </el-table>
        </div>
        <div class="pagination-depart" v-if="totalSalary>0">
          <el-pagination
            @size-change="handleSizeChange4"
            @current-change="handleCurrentChange4"
            :current-page="nowPage4"
            :page-sizes="[10, 15, 50]"
            :page-size=pageSize4
            layout="total, sizes, prev, pager, next, jumper"
            :total=totalSalary>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
//  import Tab from 'components/common/tab'
  import {listTaskPerformances,perfmEmp,staffList,listSalaryList,outputSalary,listOperFuns} from 'service/getData'
  import {ERR_OK,finishTime,finishMass,formatDateMonth} from 'service/config'
  export default {
    data() {
      return {
        finishTime:finishTime,
        finishMass:finishMass,
        time:"NONE",
        mass:"NONE",
        uploadPerfmPermission:false,
        outputSalaryBillsPermission:false,
        pageSize:10,
        nowPage:1,
        monthValue:new Date(),
        monthValue1:new Date(),
        pageSize1:10,
        nowPage1:1,
        pageSize3:10,
        nowPage3:1,
        pageSize4:10,
        nowPage4:1,
        content:"",
        value1:'',
        value2:'',
        pageSize2:10,
        value3:'',
        value4:'',
        tabs: ["任务绩效", "考勤绩效","奖惩记录","工资条"],
        num: 0,
        total:0,
        total1:0,
        totalstaff:0,
        totalSalary:0,
        performanceStatistics:"",
        performanceData:"",
        tableData:[],
        tableDataValue:[],
        tableSalary:[],
        tableDatastaff:[]
      };
    },
    components: {
//      Tab
    },
    created(){
      this._listTaskPerformances();
      this._perfmHrDeptList();
      this._staffList();
      this._listSalaryList()
      this._listOperFuns()
    },
    methods: {
      //生成工资条
      produceWages(){
        outputSalary().then((res) => {
          if (res.code == ERR_OK) {
            this.$notify({
              title: '成功',
              message: '生成工资条成功',
              type: 'success'
            });
            this._listSalaryList()
          }else{
            this.$notify.error({
              title: '错误',
              message:res.msg
            });
          }
        })
      },
      _listOperFuns(){
        var self=this;
        listOperFuns({resourceNo:'PERFM'}).then(function (res) {
          if(res.code==ERR_OK){
            for(var key in res.data){
              if(res.data[key].resourceNo=="uploadPerfmWithExcel"){
                self.uploadPerfmPermission=true;
              }
              if(res.data[key].resourceNo=="outputSalaryBills"){
                self.outputSalaryBillsPermission=true;
              }
            }
          }else{
            self.$notify.error({
              title: '错误',
              message:res.msg
            });
          }
        })
      },
      tab(index) {
        this.num = index
      },
      handleSizeChange(val) {
        this.pageSize = val
        this._listTaskPerformances()
      },
      handleCurrentChange(val) {
        this.nowPage = val
        this._listTaskPerformances()
      },
      handleSizeChange1(val) {
        this.pageSize1 = val
        this._perfmHrDeptList()
      },
      handleCurrentChange1(val) {
        this.nowPage1 = val
        this._perfmHrDeptList()
      },
      handleSizeChange3(val) {
        this.pageSize3 = val
        this._staffList()
      },
      handleCurrentChange3(val) {
        this.nowPage3= val
        this._staffList()
      },
      handleSizeChange4(val) {
        this.pageSize4 = val
        this._listSalaryList()
      },
      handleCurrentChange4(val) {
        this.nowPage4= val
        this._listSalaryList()
      },
//      考勤搜索
      search(){
        this._listTaskPerformances()
      },
//      绩效搜索
      searchPerfmHrEntity(){
        this._perfmHrDeptList()
      },

//      任务绩效列表
      _listTaskPerformances(){
        var self=this;
        var param={
          nowPage:this.nowPage,
          pageShow:this.pageSize,
          taskDateTime:formatDateMonth(this.monthValue),
          title:this.content,
          completeStatus:this.time,
          finishQuality:this.mass
        }
        listTaskPerformances(param).then(function (res) {
          if (res.code == ERR_OK) {
            self.performanceStatistics=res.data.performanceStatistics
            self.performanceData=res.data.performanceData
            self.total=res.data.performanceData.totalCount
          }else{
            self.$notify.error({
              title: '错误',
              message: res.msg
            });
          }
        })
      },
//      考勤绩效
      _perfmHrDeptList(){
        var self=this;
        var param={
          nowPage:this.nowPage1,
          pageShow:this.pageSize1,
          hrDateStr:formatDateMonth(this.monthValue1)
        }
        perfmEmp(param).then(function (res) {
          if (res.code == ERR_OK) {
            self.tableDataValue=res.data.result;
            self.total1=res.data.totalCount
          }else{
            self.$notify.error({
              title: '错误',
              message: res.msg
            });
          }
        })
      },
//      奖惩记录
     _staffList(){
       var self=this;
       var param={
         nowPage:self.nowPage3,
         pageShow:self.pageSize3,
       }
       staffList(param).then(function (res) {
         if (res.code == ERR_OK) {
           self.tableDatastaff=res.data.result;
           self.totalstaff=res.data.totalCount
         }else{
           self.$notify.error({
             title: '错误',
             message: res.msg
           });
         }
       })
     },
//      工资条
      _listSalaryList(){
        var self=this;
//        console.log(this.pageSize4);
        var param={
          nowPage:this.nowPage4,
          pageShow:this.pageSize4,
        }
        listSalaryList(param).then(function (res) {
          if (res.code == ERR_OK) {
            self.tableSalary=res.data.result;
            self.totalSalary=res.data.totalCount
          }else{
            self.$notify.error({
              title: '错误',
              message: res.msg
            });
          }
        })
      },
      renderTableHeader (h, { column, $index }) {
        return h('div', {}, [
          
            h('span', {}, [
              column.label,
              h('el-tooltip',{
                props: {
                  placement: 'top',
                  content: (function() {
                    let label = column.label;
                    switch (label) {
                      case '任务绩效分':
                        return '任务绩效分 = 任务类型分值 * 重要等级系数 * 任务完成时间系数 * 任务完成质量系数';
                        break;
                      case '绩效评估分':
                        return '绩效评估分 = 任务完成时间系数 * 任务完成质量系数';
                        break;
                      default:
                        return '666';
                        break;
                    }
                  })()
                }
              },[
                h('i', {
                  class:'el-icon-information',
                  style:'margin-left:5px;color:#999999;'
                })
              ])
            ])
        ])
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
  .title-name5:last-child{
    width: 124px !important;
  }
  .title-name.active{
    color: #D93538;
    border-bottom:2px solid #D93538;
  }
  .role-title {
    margin-top: 10px;
    height: 46px;
    line-height: 46px;
    opacity: 0.99;
    border: 1px solid rgba(0,0,0,0.12);
    background: rgba(217,52,55,0.02);
  }
  .role-num {
    float: left;
    font-size: 14px;
    color: #333333;
  }
  .role-time{
    margin-left:674px !important;
  }
  .role-list{
    margin-left:879px !important;
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
  .attendance_search{
    float: left;
    margin-left: 35px;
  }
  .content-task{
    float: left;
    width: 190px;
    font-size: 12px;
    margin-top: 11px;
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
  .attendance{
    float: left;
    span{
      padding-left: 20px;
    }
  }
  .department-name{
    color: #DA3438;
    cursor: pointer;
  }
</style>
