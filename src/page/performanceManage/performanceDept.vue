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
      <div class="router-wrapper" v-show=" 4 == num">
          <span class="child1">绩效管理</span>
        /
          <span style="color: #D93437;cursor:pointer;">申诉处理</span>
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
        <div class="role-title" >
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
          <div class="role-num performanceDept">
            完成时间：
            <el-select v-model="time" placeholder="全部" class="role-button">
              <el-option v-for="item in finishTime" :key="item.value" :label="item.label" :value="item.value">
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
          <!-- <div class="circle-name">
            <div class="circle-content">
              {{performanceStatistics.totalScoreSum}}
            </div>
            <span>任务总分数</span>
          </div> -->
          <!-- <div class="circle-name">
            <div class="circle-content">
              {{performanceStatistics.evaluatingRank}}
            </div>
            <span>公司排名</span>
          </div> -->
          <div class="circle-name">
            <div class="circle-content">
              {{performanceStatistics.thisMonthCompletedCount}}
            </div>
            <span>当月完成任务数</span>
          </div>
          <!-- <div class="circle-name">
            <div class="circle-content">
              {{performanceStatistics.evaluatingDeptRank}}
            </div>
            <span>部门排名</span>
          </div> -->
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
          <!-- <div class="circle-name">
            <div class="circle-content">
              {{performanceStatistics.thisMonthEvaluatingScore}}
            </div>
            <span>当月任务绩效</span>
          </div> -->
        </div>
        <div class="get-reward">
          <el-table
            :data="performanceData.result"
            style="width: 100%" empty-text='暂无数据'>
            <el-table-column
              prop="userName"
              label="员工姓名"
            >
            <template slot-scope="props">
              <router-link :to="{path:'/userDetail',  query:{id: props.row.userId}}"  >
                <span class="department-name">{{props.row.userName}}</span>
              </router-link>
            </template>
            </el-table-column>
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
              width='180px'
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
            <span>部门考勤</span>
          </div>
          <div class="role-num" style="margin-left: 640px">
            任务时间：
            <el-date-picker
              v-model="monthValue2"
              :editable="false"
              type="month"
              placeholder="选择月"
              value-format="yyyy-MM"
            >
            </el-date-picker>
          </div>
          <div class="button-perform attendance_search" @click="searchPerfmHr">
            搜索
          </div>
        </div>
        <div class="performance">
          <el-table
            :data="tableDataValueDept"
            style="width: 100%"
            empty-text='暂无数据'>
            <el-table-column
              prop="hrDate"
              width="450"
              label="时间"
            >
            </el-table-column>
            <el-table-column
              prop="weeklySize"
              width="450"
              align="center"
              label="部门周报（300元/次）"
            >
            </el-table-column>
            <el-table-column
              prop="total"
              align="center"
              label="合计"
            >
            <template slot-scope='props'>
              <span v-if='props.row.total>0'>
                -{{props.row.total}}
              </span>
              <span v-else>
                {{props.row.total}}
              </span>
            </template>
            </el-table-column>

          </el-table>
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
        <div class="performance dataTime">
          <el-table
            :data="tableDataValue"
            style="width: 100%"
            empty-text='暂无数据'>
            <el-table-column
              prop="hrDate"
              label="时间"
            >
            </el-table-column>
            </el-table-column>
            <el-table-column
              prop="userName"
              align="center"
              label="姓名"
            >
              <template slot-scope="props">
                <router-link :to="{path:'/userDetail',  query:{id: props.row.userId}}"  >
                  <span class="department-name">{{props.row.userName}}</span>
                </router-link>
              </template>
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
              width="100"
              align="center"
              label="缺公告回复  　(30元/次)"
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
              width="100"
              align="center"
              label="周报考勤　 (100元/次)"
            >
            </el-table-column>
            <el-table-column
              prop="clothSize"
              width="100"
              align="center"
              label="着装问题　 (100元/次)"
            >
            </el-table-column>
            <el-table-column
              prop="total"
              align="center"
              label="合计"
            >
            <template slot-scope='props'>
              <span v-if='props.row.total>0'>
                -{{props.row.total}}
              </span>
              <span v-else>
                {{props.row.total}}
              </span>
            </template>
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
          <div class="role-num">
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
          <div class="role-num performanceDept">
            类型：
            <el-select v-model="typeValue">
              <el-option
                label="全部"
                value="NONE">
              </el-option>
              <el-option
                label="奖励"
                value="REWARD">
              </el-option>
              <el-option
                label="惩罚"
                value="PUNISH">
              </el-option>
            </el-select>
          </div>
          <!--<div class="role-num">-->
            <!--金额：-->
            <!--<el-select v-model="amounts" placeholder="请选择">-->
              <!--<el-option-->
                <!--v-for="item in dataAmount"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</div>-->
          <div class="button-perform attendance_search" @click="searchEntity">
            搜索
          </div>
          <div class="week-button2" @click="initiate(0)">
            发起惩罚
          </div>
          <div class="week-buttons" @click="reward(1)">
            发起奖励
          </div>
          <router-link to="/RedHeiBang">
            <div class="week-buttons">
              红黑榜
            </div>
          </router-link>
        </div>
        <div class="get-reward">
          <el-table
            :data="tableDatastaff"
            style="width: 100%" empty-text='暂无数据'>
            <el-table-column
              prop="userName"

              label="姓名"
            >
              <template slot-scope="props">
                <router-link :to="{path:'/userDetail',  query:{id: props.row.userId}}"  >
                  <span class="department-name">{{props.row.userName}}</span>
                </router-link>
              </template>
            </el-table-column>
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
        <div class="get-reward" style="margin-top:10px;">
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
                <span v-if="props.row.taskPerfm>0" style="color: #D93538">+{{props.row.taskPerfm}}</span>
                <span v-else style="color: #008000">{{props.row.taskPerfm}}</span>
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
                <span v-if="props.row.rpTotal>0" style="color: #D93538">+{{props.row.rpTotal}}</span>
                <span v-else style="color: #008000">{{props.row.rpTotal}}</span>
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
      <!--申诉处理-->
      <div class="" v-show=" 4 == num">
        <div style="margin-top: 10px"></div>
        <div class="role-title" style='border-bottom:none;'>
          <div class="role-num" @click='undeteal' style="margin-left: 20px;cursor:pointer;font-size: 14px;color: #434343;"  v-bind:class="{ active: isActive}">
            待处理
          </div>
          <div class="role-num" @click='deteal' style="margin-left: 70px;cursor:pointer;font-size: 14px;color: #434343;" v-bind:class="{active1: isActive1 }">
            已处理
          </div>
        </div>
        <div class="get-reward">
          <el-table
            :data="unhandled"
            style="width: 100%" empty-text='暂无数据'>

            <el-table-column
              prop="userName"
              label="姓名"
            >
              <template slot-scope="props">
                <router-link :to="{path:'/userDetail',  query:{id: props.row.userId}}"  >
                  <span class="department-name">{{props.row.userName}}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="rpReason"
              label="申诉原因"
            >
            </el-table-column>
            <el-table-column
              prop="appealTime"
              label="时间"
            >
            </el-table-column>

            <el-table-column
              prop="appealAmount"
              label="涉及金额"
            >
            </el-table-column>
            <el-table-column
              prop="finalStatus"
              label="申诉状态"
            >
              <template slot-scope='props'>
                <span v-if='props.row.finalStatus=="PASS"'>通过</span>
                <span v-if='props.row.finalStatus=="REJECT"'>驳回</span>
                <span v-if='props.row.finalStatus=="ING"'>待处理</span>
                <span v-if='props.row.finalStatus=="NONE"'>未申诉</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="realTotal"
              label="操作"
            >
              <template slot-scope="props">
                <span v-if='isActive'>
                  <el-button
                    size="small"
                    class='complete' @click='unagreee(props.row.perfmRpappealId,props.row.finalStatus)'>不同意</el-button>
                   <el-button
                     size="small"
                     class='complete' @click='agreee(props.row.perfmRpappealId,props.row.finalStatus)'>同意</el-button>
                </span>
                <span v-else style="color: #D93437;">--</span>
              </template>
            </el-table-column>

          </el-table>
        </div>

        <div class="pagination-depart" v-if="total6>0">
          <el-pagination
            @size-change="handleSizeChange6" @current-change="handleCurrentChange6"
            :current-page="currentPage4" :page-sizes="[10, 15, 50]" :page-size=pageSize6 layout="total, sizes, prev, pager, next, jumper" :total=total6>
          </el-pagination>
        </div>
      </div>
    </div>
    <!--发起惩罚模态窗-->
    <div class="rewards">
      <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        size="tiny"
        :before-close="handleClose"
        top='20%'
        class="noticeManageModel">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="姓名：" prop="userName">
            <el-select v-model="ruleForm.userName" placeholder="选择要惩罚的员工姓名" class="userName">
              <el-option
                v-for="item in optionsName"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型："  class="clearType" required>
            <el-col :span="10">
              <el-form-item prop="type">
                <el-select v-model="ruleForm.type" placeholder="请选择" class="type"  @change="changeType">
                  <el-option
                    v-for="item in optionsType"
                    :key="item.rpTypeId"
                    :label="item.rpName"
                    :value="item.rpTypeId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="4">　金额：</el-col>
            <el-col :span="10">
              <el-form-item  class="clear" prop="amount" >
                <el-select v-model="ruleForm.amount" placeholder="请选择" class="type">
                  <el-option
                    v-for="item in optionsAmount"
                    :key="item.rpTypeId"
                    :label="item.amount"
                    :value="item.amount"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="原因：" prop="cause" class="cause">
            <el-input type="textarea" v-model="ruleForm.cause" class="cause"></el-input>
          </el-form-item>
        </el-form>
          <span slot="footer" class="dialog-footer">
              <button  @click="cancelStart('ruleForm')">取 消</button>
              <button  @click="sureStart('ruleForm')">确定</button>
            </span>
      </el-dialog>
    </div>
    <!--同意申诉-->
    <div class="deleteDepartment">
      <el-dialog
        title="同意申诉"
        :visible.sync="dialogVisible1"
        size="tiny"
        :before-close="handleClose1" top='25%' class="department">
        <span>是否确认同意此申诉？</span>
        <span slot="footer" class="dialog-footer">
          <button @click="dialogVisible1 = false">取 消</button>
          <button  @click='sureDelete'>确 定</button>
        </span>
      </el-dialog>
    </div>
    <!--申请取消原因模态窗-->
    <div>
      <el-dialog
        title="驳回申诉"
        :visible.sync="dialogVisible2"
        size="tiny"
        :before-close="handleClose2" top='25%' class=" noticeManageModel">
        <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="112px" class="demo-ruleForm">
          <el-form-item label="驳回原因：" prop="cause" required style="margin-right: 40px !important;">
            <el-input type="textarea" v-model="ruleForm1.cause"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <button  @click="resetForm2('ruleForm1')">取 消</button>
          <button  @click="submitForm2('ruleForm1')">确定</button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
//  import Tab from 'components/common/tab'
  import {listTaskPerformances,listOperFuns,PerfmDeptList,outputSalary,dealHandle,getRewardList,dealAppeal,getApplealCount,RecordDeptList,perfmHrDeptList,listSalaryList,listUserDynamic,getRpAmountByType,perfmRpRecordAdd,handleAppeal} from 'service/getData'
  import {ERR_OK,finishTime,finishMass,formatDateMonth,amount} from 'service/config'
  export default {
    data() {
      return {
        finishTime:finishTime,
        finishMass:finishMass,
        uploadPerfmPermission:false,
        outputSalaryBillsPermission:false,
        time:"NONE",
        mass:"NONE",
        pageSize:10,
        nowPage:1,
        dataAmount:amount,
        monthValue:new Date(),
        monthValue1:new Date(),
        monthValue2:new Date(),
        pageSize1:10,
        nowPage1:1,
        pageSize6:10,
        nowPage6:1,
        title:"",
        pageSize3:10,
        nowPage3:1,
        pageSize4:10,
        nowPage4:1,
        content:"",
        isActive:true,
        isActive1:false,
        value1:'',
        value2:'',
        perfmRpappealId:'',
        currentPage4:1,
        pageSize2:10,
        value3:'',
        typeValue:"NONE",
        amounts:-9999,
        value4:'',
        tabs: ["任务绩效", "考勤绩效","奖惩记录","工资条","申诉处理<span style='color:#C2453A;'>  </span>"],
        num: 0,
        total:0,
        total1:0,
        total6:10,
        totalstaff:0,
        totalSalary:0,
        performanceStatistics:"",
        performanceData:"",
        tableData:[],
        tableDataValue:[],
        tableDataValueDept:[],
        tableSalary:[],
        tableDatastaff:[],
        unhandled:[],
        dialogVisible:false,
        dialogVisible1:false,
        dialogVisible2:false,
        optionsName:[],
        optionsType:[],
        optionsAmount:[],
        valType:"",
        ruleForm:{
          userName:"",
          type:"",
          amount:"",
          cause:""
        },
        rules:{
          userName: [
            { type: 'number',required: true, message: '请选择要惩罚的员工姓名'}
          ],
          type: [
            { type: 'number',required: true, message: '请选择惩罚类型'}
          ],
          amount: [
            {type: 'number', required: true, message: '请选择金额'}
          ],
          cause:[
            { required: true, message: '请填写原因' },
            {max: 200, message: '原因不能超过200个字符'}
          ]
        },
        ruleForm1: {
          cause: ''
        },
        rules1: {
          cause: [
            { required: true, message: '请输入驳回原因', trigger: 'blur' },
          ],
        },
      };
    },
    components: {
//      Tab
    },
    created(){
      this._getApplealCount()
      this._listTaskPerformances();
      this._perfmHrDeptList()
      this._PerfmDeptList()
      this._staffList();
      this._listSalaryList();
      this._listUserDynamic();
      this._getRewardList();
      this._listOperFuns();
      var user=this.$route.query.userView
      if(user=='DEPT'){
        this.num=4
        this.undeteal()
      }

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
        if(index==4){
          this.undeteal()
        }
      },
      handleSizeChange6(val) {
        this.pageSize6 = val
        if(this.isActive){
          this._dealAppeal()
        }else{
          this._dealHandle()
        }

      },
      handleCurrentChange6(val) {
        this.nowPage6 = val
        if(this.isActive){
          this._dealAppeal()
        }else{
          this._dealHandle()
        }
      },
      undeteal(){
        this.isActive = true
        this.isActive1 = false
        this._dealAppeal()
      },
      deteal(){
        this.isActive1 = true
        this.isActive = false
        this._dealHandle()
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this._listTaskPerformances()
      },
      handleCurrentChange(val) {
        this.nowPage = val
        this._listTaskPerformances()
      },
      handleSizeChange1(val) {
        this.pageSize1 = val
        this._PerfmDeptList()
      },
      handleCurrentChange1(val) {
        this.nowPage1 = val
        this._PerfmDeptList()
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
      resetForm2(formName1) {
        this.dialogVisible2 = false
        this.$refs[formName1].resetFields();
      },
      _dealHandle(){
        const params = {
          nowPage:this.nowPage6,
          pageShow:this.pageSize6
        }
        dealHandle(params).then((res) => {
          if (res.code == ERR_OK) {
            this.unhandled = res.data.result
            this.total6 = res.data.totalCount
          }else{
            this.$notify.error({
              title: '错误',
              message: res.msg
            });
          }
        })
      },
      sureDelete(){
        const params = {
          perfmRpappealId:this.perfmRpappealId,
          rpAppealStatus:'PASS'
        }
        handleAppeal(params).then((res) => {
          if (res.code == ERR_OK) {
            this.dialogVisible1 = false
            this.$notify({
              title: '成功',
              message: '成功同意申诉',
              type: 'success'
            });
            this._dealAppeal()
            this._getApplealCount()
          }else{
            this.$notify.error({
              title: '错误',
              message:res.msg
            });
          }
        })
      },
      submitForm2(formName1) {
        let self = this
        this.$refs[formName1].validate((valid) => {
          if (valid) {
            const params = {
              perfmRpappealId:this.perfmRpappealId,
              rpAppealStatus:'REJECT',
              rpReason:this.ruleForm1.cause
            }
            handleAppeal(params).then((res) => {
              if (res.code == ERR_OK) {
                this.dialogVisible2 = false
                this.$notify({
                  title: '成功',
                  message: '驳回成功',
                  type: 'success'
                });
                this._dealAppeal()
                this._getApplealCount()
              }else{
                this.$notify.error({
                  title: '错误',
                  message:res.msg
                });
              }
            })
          } else {
            return false;
          }
        });
      },
//      同意不同意
      agreee(val,key){
        this.dialogVisible1 = true
        this.finalStatus = key
        this.perfmRpappealId = val
      },
      unagreee(val,key){
        this.dialogVisible2 = true
        this.finalStatus = key
        this.perfmRpappealId = val
      },
      //申诉处理
      _getApplealCount(){
        getApplealCount().then((res) => {
          if (res.code == ERR_OK) {
            console.log(res.data.appealCount)
            this.tabs = ["任务绩效", "考勤绩效","奖惩记录","工资条","申诉处理<span style='color:#C2453A;'> ( "+res.data.appealCount+" ) </span>"]
          }else{
            this.$notify.error({
              title: '错误',
              message: res.msg
            });
          }
        })
      },
      _dealAppeal(){
        const params = {
          nowPage:this.nowPage6,
          pageShow:this.pageSize6
        }
        dealAppeal(params).then((res) => {
          if (res.code == ERR_OK) {
            this.unhandled = res.data.result
            this.total6 = res.data.totalCount
          }else{
            this.$notify.error({
              title: '错误',
              message: res.msg
            });
          }
        })
      },
//      发起惩罚
      initiate(val){
        this.valType=val
        this.title="发起惩罚";
        this.dialogVisible=true
      },
//      发起奖励
      reward(val){
        this.valType=val
        this.title="发起奖励";
        this.dialogVisible=true
      },
//      发起惩罚模态窗
      handleClose(){
        this.dialogVisible=false
      },
      handleClose1(done){
        this.dialogVisible1 = false
      },
      handleClose2(done) {
        this.dialogVisible2 = false
        this.$refs['ruleForm1'].resetFields();
      },
      cancelStart(formName){
        this.$refs[formName].resetFields();
        this.dialogVisible=false
      },
      sureStart(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this._perfmRpRecordAdd()
            this.dialogVisible=false
          } else {
            return false;
          }
        });
      },
//      获取姓名
      _listUserDynamic(){
        listUserDynamic().then((res) =>{
          if (res.code == ERR_OK) {
              this.optionsName=res.data;

          }
        })
      },
      //      获取奖惩类型列表
      _getRewardList(){
        getRewardList().then((res) =>{
          if (res.code == ERR_OK) {
             this.optionsType=res.data.result;
            if(res.data.result.length>0){
              this.ruleForm.type=res.data.result[0].rpTypeId;
              this._getRpAmountByType()
            }
          }
        })
      },
//      发起惩罚接口
        _perfmRpRecordAdd(){
          var param
//          0代表是惩罚
         if(this.valType==0){
            param={
             userId:this.ruleForm.userName,
             rpAmount:this.ruleForm.amount,
             rpType:"PUNISH",
             rpReason:this.ruleForm.cause
           }
         }
//          1代表是奖励
          if(this.valType==1){
            param={
              userId:this.ruleForm.userName,
              rpAmount:this.ruleForm.amount,
              rpType:"REWARD",
              rpReason:this.ruleForm.cause
            }
          }
          perfmRpRecordAdd(param).then((res) =>{
            if (res.code == ERR_OK) {
             this._staffList();
              this.$refs['ruleForm'].resetFields();
             if(this.valType==0){
               this.$notify({
                 title: '成功',
                 message: '发起惩罚成功',
                 type: 'success'
               });
             }
             if(this.valType==1){
               this.$notify({
                 title: '成功',
                 message: '发起奖励成功',
                 type: 'success'
               });
              }
            }
          })
        },
//      金额
      _getRpAmountByType(){
        var param={
          rpTypeId:this.ruleForm.type
        };
        getRpAmountByType(param).then((res) =>{
          if (res.code == ERR_OK) {
            this.optionsAmount=res.data;
          }
        })
      },
      changeType(){
        this._getRpAmountByType()
      },
//      考勤搜索
      search(){
        this._listTaskPerformances()
      },
//      部门绩效搜索
      searchPerfmHr(){
        this._perfmHrDeptList()
      },
//      绩效搜索
      searchPerfmHrEntity(){
        this._PerfmDeptList()
      },
//奖励记录搜索
      searchEntity(){
        this._staffList()
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
//      考勤绩效部门
      _perfmHrDeptList(){
        var param={
          hrDateStr:formatDateMonth(this.monthValue2)
        }
        perfmHrDeptList(param).then((res) =>{
          if (res.code == ERR_OK) {
            this.tableDataValueDept=res.data;
          }
        })
      },
//      考勤绩效员工
      _PerfmDeptList(){
        var self=this;
        var param={
          nowPage:this.nowPage1,
          pageShow:this.pageSize1,
          hrDateStr:formatDateMonth(this.monthValue1)
        }
        PerfmDeptList(param).then(function (res) {
          if (res.code == ERR_OK) {
            self.tableDataValue=res.data.result;
            self.total1=res.data.totalCount
          }
        })
      },
//      奖惩记录
      _staffList(){
        var self=this;
        var param={
          nowPage:self.nowPage3,
          pageShow:self.pageSize3,
//          rpAmount:this.amounts,
          rpType:this.typeValue,
          rpTimeStr:formatDateMonth(this.monthValue1)
        }
        RecordDeptList(param).then(function (res) {
          if (res.code == ERR_OK) {
            self.tableDatastaff=res.data.result;
            self.totalstaff=res.data.totalCount
          }
        })
      },
//      工资条
      _listSalaryList(){
        var self=this;
        var param={
          nowPage:this.nowPage4,
          pageShow:this.pageSize4,
        }
        listSalaryList(param).then(function (res) {
          if (res.code == ERR_OK) {
            self.tableSalary=res.data.result;
            self.totalSalary=res.data.totalCount
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
    border-bottom: none;
  }
  .title-name1{
    margin-left: 54px;
  }
  .title-name5:last-child{
    width: 124px !important;
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
  .role-list1{
    margin-left:20px;
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
  .week-button2{
    float: left;
    height: 25px;
    line-height: 25px;
    width: 86px;
    text-align: center;
    border: 1px solid #D93538;
    border-radius: 4px;
    font-size: 14px;
    color: #D93538;
    margin-top: 11px;
    margin-left: 320px;
    cursor: pointer;
  }
  .week-buttons{
    float: left;
    height: 25px;
    line-height: 25px;
    width: 86px;
    text-align: center;
    border: 1px solid #D93538;
    border-radius: 4px;
    font-size: 14px;
    color: #D93538;
    margin-top: 11px;
    margin-left: 20px;
    cursor: pointer;
  }
  .active,.active1{
    color: #D93538 !important;
    border-bottom: 3px solid #D93538;
    box-sizing: border-box;
  }
  .department-name{
    color: #DA3438;
    cursor: pointer;
  }
</style>
