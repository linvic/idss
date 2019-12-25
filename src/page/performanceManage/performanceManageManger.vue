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
        <div class="role-title">

          <div class="role-num">
            部门：
            <el-select v-model="deptName" placeholder="全部" class="role-button">
              <el-option v-for="item in options1" :key="item.deptId" :label="item.deptName" :value="item.deptId">
              </el-option>
            </el-select>
          </div>
          <div class="role-num">
            时间：
            <el-date-picker
              v-model="monthValue"
              :editable="false"
              type="month"
              placeholder="选择月"
              value-format="yyyy-MM"
            >
            </el-date-picker>
          </div>
          <!-- <div class="role-num">
            完成质量：
            <el-select v-model="mass" placeholder="全部" class="role-button">
              <el-option v-for="item in finishMass" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div> -->

          <div class="button-perform" @click="search">
            搜索
          </div>
        </div>

        <div class="get-reward overHide" style="margin-top:10px;">
          
          <el-table
            :data="performanceData.result"
            style="width: 100%" empty-text='暂无数据'>
            <!-- <el-table-column
              prop="taskId"
              label="任务ID"
            >

            </el-table-column> -->
            <el-table-column
              prop="deptName"
              label="部门"
            >

            </el-table-column>
            <el-table-column
              prop="deptHeaderName"
              label="部门负责人"
            >
            </el-table-column>
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
              prop="performanceTime"
              label="时间"
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
            <!-- <el-table-column
              prop="taskScore"
              label="该任务的分值"
            >
            </el-table-column> -->
            <el-table-column
              prop="perfmRanking"
              label="排名"
            >
            </el-table-column>
            <el-table-column
              prop="sourceType"
              label="操作" width='160'
            >
            <template slot-scope='props'>
              <router-link :to="{path:'/performanceDetail',query: {id: props.row.userId}}">
                <el-button
                  size="small"
                >查看任务绩效详情</el-button>
              </router-link>
            </template>
            </el-table-column>

          </el-table>
        </div>
        <div class="pagination-depart" v-if="total>0">
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="currentPage4"
                         :page-sizes="[10, 15, 50]"
                         :page-size=pageSize
                         layout="total, sizes, prev, pager, next, jumper"
                         :total=total>
          </el-pagination>
        </div>
      </div>
      <!--绩效管理-->
      <div class=""
           v-show=" 1 == num">
           <div class="" style='padding-left:20px;padding-top:15px;padding-bottom:5px;' v-if='uploadPerfmPermission'>
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
             <div class="role-num" style="margin-left: 396px">
               部门：
               <el-select v-model="deptName2" placeholder="全部" class="role-button">
                 <el-option v-for="item in options1" :key="item.deptId" :label="item.deptName" :value="item.deptId">
                 </el-option>
               </el-select>
             </div>
             <div class="role-num" style="margin-left: 0px">
               时间：
               <el-date-picker
                 v-model="monthValue2"
                 :editable="false"
                 type="month"
                 placeholder="选择月"
                 value-format="yyyy-MM"
               >
               </el-date-picker>
             </div>
             <div class="button-perform attendance_search" @click="searchDepart">
               搜索
             </div>
           </div>
           <div class="performance">
             <el-table
               :data="tableDepartValue"
               style="width: 100%"
               empty-text='暂无数据'>

               <el-table-column
                 prop="deptName"
                 label="部门"
               >
               </el-table-column>

               <el-table-column
                 prop="weeklySize"
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
          <div class="role-num" style="margin-left: 200px">
            部门：
            <el-select v-model="deptName1" placeholder="全部" class="role-button">
              <el-option v-for="item in options1" :key="item.deptId" :label="item.deptName" :value="item.deptId">
              </el-option>
            </el-select>
          </div>
          <!-- <div class="role-num">
            员工：
            <el-select v-model="userName1" placeholder="全部" class="role-button">
              <el-option v-for="item in userOption" :key="item.userId" :label="item.userName" :value="item.userId">
              </el-option>
            </el-select>
          </div> -->
          <div class="role-num" style="margin-left: 35px">
            时间：
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
        <div class="performance staffName">
          <el-table
            :data="tableDataValue"
            style="width: 100%"
            empty-text='暂无数据'>
            <el-table-column
              prop="hrDateStr"
              label="时间"
            >
            </el-table-column>
            <el-table-column
              prop="deptName"
              label="部门"
            >
            </el-table-column>
            <el-table-column
              label="姓名"
              prop="userName"
            >
              <template slot-scope="props">
                <router-link :to="{path:'/userDetail',  query:{id: props.row.userId}}"  >
                  <span class="department-name">{{props.row.userName}}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="lateSize"
              label="迟到(30/次)"
            >
            </el-table-column>
            <el-table-column
              prop="leaveEarlySize"
              label="早退(30/次)"
            >
            </el-table-column>
            <el-table-column
              prop="leaveSize"
              label="事假(当日实际工资)"
            >
            </el-table-column>
            <el-table-column
              prop="absenceSize"
              label="缺卡(当日实际工资)"
            >
            </el-table-column>
            <el-table-column
              prop="absenteeismSize"
              label="旷工(2倍当日实际工资)"
            >
            </el-table-column>
            <el-table-column
              prop="missnoticeSize"
              label="缺公告回复(30元/次)"
            >
            </el-table-column>
            <el-table-column
              prop="dailySize"
              label="日报考勤(50元/次)"
            >
            </el-table-column>
            <el-table-column
              prop="weeklySize"
              label="周报考勤(100元/次)"
            >
            </el-table-column>
            <el-table-column
              prop="clothSize"
              label="着装问题(100元/次)"
            >
            </el-table-column>
            <el-table-column
              prop="total"
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
            :current-page="currentPage1"
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

          <div class="role-num" style="margin-left: 20px">
            部门：
            <el-select v-model="deptName3" placeholder="全部" class="role-button">
              <el-option v-for="item in options1" :key="item.deptId" :label="item.deptName" :value="item.deptId">
              </el-option>
            </el-select>
          </div>
          <div class="role-num">
            类型：
            <el-select v-model="type4" placeholder="全部" class="role-button">
              <el-option v-for="item in optionsReward" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="button-perform attendance_search" @click="searchReward" style="margin-left:20px;">
            搜索
          </div>
          <div class="reward-button" @click="initiate(0)">
            发起惩罚
          </div>
          <div class="reward-button" @click="reward(1)">
            发起奖励
          </div>
          <router-link to='/RedHeiBang'><div class="reward-button">
            红黑榜
          </div></router-link>
        </div>
        <div class="get-reward">
          <el-table
            :data="tableReward"
            style="width: 100%" empty-text='暂无数据'>
            <!-- <el-table-column
              prop="deptId"
              label="序号"
            >
            </el-table-column> -->
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

              prop="rpAmount"
              label="奖惩金额"
            >
            <template slot-scope='props'>
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
        <div class="pagination-depart" v-if='total4>0'>
          <el-pagination @size-change="handleSizeChange4" @current-change="handleCurrentChange4" :current-page="currentPage4" :page-sizes="[10, 15, 50]" :page-size=pageSize4 layout="total, sizes, prev, pager, next, jumper" :total=total4>
          </el-pagination>
        </div>
      </div>
      <!--工资条-->
      <div class=""
           v-show=" 3 == num">
        <div style="margin-top: 10px"></div>
        <div class="role-title" style='border-bottom:none;'>
          <div class="role-num" style="margin-left: 20px">
            部门：
            <el-select v-model="deptName5" placeholder="全部" class="role-button">
              <el-option v-for="item in options1" :key="item.deptId" :label="item.deptName" :value="item.deptId">
              </el-option>
            </el-select>
          </div>
          <div class="role-num" style="margin-left: 35px">
            时间：
            <el-date-picker
              v-model="monthValue5"
              :editable="false"
              type="month"
              placeholder="选择月"
              value-format="yyyy-MM"
            >
            </el-date-picker>
          </div>
          <div class="button-perform attendance_search" @click="searchWages" style="margin-left:20px;">
            搜索
          </div>
          <div class="reward-button" style="width:128px;margin-left:325px;" @click='produceWages' v-if='outputSalaryBillsPermission'>
            生成本月工资条
          </div>
        </div>
        <div class="get-reward">
          <el-table
            :data="tableSalary"
            style="width: 100%" empty-text='暂无数据'>
            <el-table-column
              prop="deptName"
              label="部门"
            >
            </el-table-column>
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
              prop="salaryTimeStr"
              label="时间"
            >
            </el-table-column>
            <el-table-column
              prop="perfmWages"
              label="绩效工资总额"
            >
            </el-table-column>
            <el-table-column
              prop="evalSorceRank"
              label="绩效评估排名"
            >
            </el-table-column>
            <el-table-column
              prop="taskPerfm"
              label="任务绩效奖罚"
            >
            </el-table-column>
            <el-table-column
              prop="hrPerfm"
              label="考勤扣款"
            >
            </el-table-column>
            <el-table-column
              prop="rpTotal"
              label="奖惩合计"
            >
            </el-table-column>
            <el-table-column
              prop="realTotal"
              label="实发绩效工资"
            >
            </el-table-column>

          </el-table>
        </div>
        <div class="pagination-depart" v-if="this.total5>0">
          <el-pagination
            @size-change="handleSizeChange5"
            @current-change="handleCurrentChange5"
            :current-page="currentPage5"
            :page-sizes="[10, 15, 50]"
            :page-size=pageSize5
            layout="total, sizes, prev, pager, next, jumper"
            :total=total5>
          </el-pagination>
        </div>
      </div>
      <div class="" v-show=" 4 == num">
        <div style="margin-top: 10px"></div>
        <div class="role-title" style='border-bottom:none;height:49px;line-height:46px;'>
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

        <div class="pagination-depart" v-if="this.total6>0">
          <el-pagination
            @size-change="handleSizeChange6"
            @current-change="handleCurrentChange6"
            :current-page="currentPage6"
            :page-sizes="[10, 15, 50]"
            :page-size=pageSize6
            layout="total, sizes, prev, pager, next, jumper"
            :total=total6>
          </el-pagination>
        </div>
      </div>
    </div>
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
            <el-select v-model="ruleForm.userName" :placeholder="placeholder" class="userName">
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
    <div class="">
      <!--申请取消原因模态窗-->
      <el-dialog
        title="驳回申诉"
        :visible.sync="dialogVisible2"
        size="tiny"
        :before-close="handleClose2" top='25%' class=" noticeManageModel">
        <el-form :model="ruleForm1" :rules="rules" ref="ruleForm1" label-width="112px" class="demo-ruleForm">
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
  import {listTaskPerformances1,listOperFuns,perfmRpRecordAdd,getRewardList,getRpAmountByType,listUserDynamic,handleAppeal,dealHandle,dealAppeal,getApplealCount,outputSalary,listSalaryList,perfmEmpStaff,perfRecordManage,perfmEmpDepart,staffList,listAllUsers,departmentList} from 'service/getData'
  import {ERR_OK,finishTime,finishMass,formatDateMonth} from 'service/config'
  export default {
    data() {
      return {
        finishTime:finishTime,
        finishMass:finishMass,
        time:"NONE",
        total5:10,
        total6:10,
        mass:"NONE",
        pageSize:10,
        nowPage:1,
        title:"",
        uploadPerfmPermission:'',
        outputSalaryBillsPermission:'',
        placeholder:'选择要惩罚的员工姓名',
        optionsAmount:[],
        optionsName:[],
        optionsType:[],
        perfmRpappealId:'',
        finalStatus:'',
        rules: {
          userName: [
            { type: 'number',required: true, message: '请选择要惩罚的员工姓名' }
          ],
          type: [
            { type: 'number',required: true, message: '请选择惩罚类型' }
          ],
          amount: [
            {type: 'number', required: true, message: '请选择金额' }
          ],
           cause: [
             { required: true, message: '请输入原因' },
             {max: 200, message: '原因不能超过200个字符'}
           ],
         },
        dialogVisible1:false,
        dialogVisible:false,
        dialogVisible2:false,
        monthValue:new Date(),
        monthValue1:new Date(),
        monthValue2:new Date(),
        monthValue5:new Date(),
        pageSize1:10,
        nowPage1:1,
        pageSize6:10,
        nowPage6:1,
        content:"",
        isActive:true,
        isActive1:false,
        deptName:'',
        deptName3:'',
        userName3:'',
        departData:true,
        money4:'',
        userName4:'',
        type4:'',
        rpType:'',
        ruleForm:{
          userName:"",
          type:"",
          amount:"",
          cause:""
        },
        ruleForm1: {
          cause: ''
        },
        rpAmount:'',
        handled:[],
        unhandled:[],
        pageSize4:10,
        pageSize5:10,
        total4:30,
        nowPage4:1,
        nowPage5:1,
        value1:'',
        value2:'',
        pageSize2:10,
        userName1:'',
        value3:'',
        tableReward:[],
        value4:'',
        optionsMoney: [{
            value: '',
            label: '全部'
          }, {
            value: '50',
            label: '50'
          },{
            value: '100',
            label: '100'
          },
          {
            value: '200',
            label: '200'
          },
          {
            value: '500',
            label: '500'
          }
        ],
        optionsReward: [{
          value: '',
          label: '全部'
        }, {
          value: 'REWARD',
          label: '奖励'
        },{
          value: 'PUNISH',
          label: '惩罚'
        }],
        tabs: ["任务绩效", "考勤绩效","奖惩记录","工资条","申诉处理<span style='color:#C2453A;'>  </span>"],
        num: 0,
        currentPage4:1,
        currentPage5:1,
        currentPage6:1,
        currentPage1:1,
        deptName1:'',
        deptName2:'',
        total:0,
        total1:0,
        deptName5:'',
        valType:'',
        tableSalary:[],
        options1:[],
        options2:[],
        options3:[],
        tableDepartValue:[],
        performanceStatistics:"",
        performanceData:"",
        tableData:[],
        tableDataValue:[],
        options:[],
        userOption:[],
      };
    },
    components: {
//      Tab
    },
    mounted(){
      this._listTaskPerformances();
      this._perfmHrDeptList();
      this.getlistAllUsers()
      this.getlistAllUsers1()
      this.perfmHrDepart()
      this._perfRecordManage()
      this._listSalaryList()
      this._getApplealCount()
      this._dealAppeal()
      this._listUserDynamic()
      this._getRewardList()
      this._listOperFuns()
      //this._getRpAmountByType()
      var user=this.$route.query.userView
      if(user=='MANAGER'){
        this.num=4
//        this._dealAppeal()
      }
    },
    methods: {
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
      //发起惩罚接口
      _perfmRpRecordAdd(){
        var param
        // 0代表是惩罚
       if(this.valType==0){
          param={
           userId:this.ruleForm.userName,
           rpAmount:this.ruleForm.amount,
           rpType:"PUNISH",
           rpReason:this.ruleForm.cause
         }
       }
       // 1代表是奖励
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
           this._perfRecordManage()
            this.$refs['ruleForm'].resetFields()
           if(this.valType==0){
             this.$notify({
               title: '发起惩罚',
               message: '发起惩罚成功',
               type: 'success'
             });
           }
           if(this.valType==1){
             this.$notify({
               title: '发起奖励',
               message: '发起奖励成功',
               type: 'success'
             });
            }
          }
        })
      },
    //获取奖惩类型列表
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
      //金额
      _getRpAmountByType(){
        var param={
          rpTypeId:this.ruleForm.type
        };
        console.log(this.ruleForm.type)
        getRpAmountByType(param).then((res) =>{
          if (res.code == ERR_OK) {
            console.log(res.data)
            this.optionsAmount=res.data;
          }
        })
      },
      changeType(){
        this._getRpAmountByType()
      },
      //      获取姓名
      _listUserDynamic(){
        listUserDynamic().then((res) =>{
          if (res.code == ERR_OK) {
              this.optionsName=res.data;

          }
        })
      },
      //      发起惩罚
      initiate(val){
        this.valType=val
        this.title="发起惩罚";
        this.placeholder = '选择要惩罚的员工姓名'
        this.dialogVisible=true
      },
      //      发起奖励
      reward(val){
        this.valType=val
        this.title="发起奖励"
        this.placeholder = '选择要奖励的员工姓名'
        this.dialogVisible=true
      },
      //发起惩罚模态窗
      handleClose(){
        this.dialogVisible=false
        this.$refs['ruleForm'].resetFields()
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
      handleClose2(done) {
        this.dialogVisible1 = false
        this.$refs['ruleForm1'].resetFields();
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
      resetForm2(formName1) {
        this.dialogVisible2 = false
        this.$refs[formName1].resetFields();
      },
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
      handleClose1(done){
        this.dialogVisible1 = false
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
      //申诉处理
      _getApplealCount(){
        getApplealCount().then((res) => {
          if (res.code == ERR_OK) {
            this.tabs = ["任务绩效", "考勤绩效","奖惩记录","工资条","申诉处理<span style='color:#C2453A;'> ("+res.data.appealCount+")</span>"]
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
              message:res.msg
            });
          }
        })
      },
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
      //搜索工资条
      searchWages(){
        this._listSalaryList()
      },
      // 部门搜索
      searchDepart(){
        this.perfmHrDepart()
      },
      //工资条
      _listSalaryList(){
        var self=this;
        if(typeof(this.monthValue5) == "undefined" || this.monthValue5 == ''){
          var time = ''
        }else{
          var time = formatDateMonth(this.monthValue5)
        }
        var param={
          nowPage:this.nowPage5,
          pageShow:this.pageSize5,
          deptId:this.deptName5,
          salaryTimeStr:time
        }
        listSalaryList(param).then(function (res) {
          if (res.code == ERR_OK) {
            self.tableSalary = res.data.result;
            self.total5 = res.data.totalCount
          }else{
            self.$notify.error({
              title: '错误',
              message:res.msg
            });
          }
        })
      },
      getlistAllUsers1 () {
        let self = this
        listAllUsers().then((res) => {
          if(res.code == ERR_OK) {
            self.userOption = res.data
            self.userOption.unshift({
             userId:'',
             userName: '请选择员工'
           })
          }else{
            self.$notify.error({
              title: '错误',
              message: res.msg
            });
          }
       })
      },
      getlistAllUsers () {
        let self = this
        departmentList().then((res) => {
          if(res.code == ERR_OK) {
            let data = res
            self.options1 = res.data.result
            self.options1.unshift({
             deptId:'',
             deptName: '全部'
           })

          }else{
            self.$notify.error({
              title: '错误',
              message: res.msg
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
      searchReward(){
        this._perfRecordManage()
      },
      handleCurrentChange(val) {
        this.nowPage = val
        this._listTaskPerformances()
      },
      handleSizeChange4(val) {
        this.pageSize4 = val
        this._perfRecordManage()
      },
      handleCurrentChange4(val) {
        this.nowPage4 = val
        this._perfRecordManage()
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
      handleSizeChange5(val) {
        this.pageSize5 = val
        this._listSalaryList()
      },
      handleCurrentChange5(val) {
        this.nowPage5 = val
        this._listSalaryList()
      },
      handleSizeChange1(val) {
        this.pageSize1 = val
        this._perfmHrDeptList()
      },
      handleCurrentChange1(val) {
        this.nowPage1 = val
        this._perfmHrDeptList()
      },
//      搜索
      search(){
        this._listTaskPerformances()
      },
//      绩效搜索
      searchPerfmHrEntity(){
        this._perfmHrDeptList()
      },

//      任务绩效列表
      _listTaskPerformances(){
        var self = this
        if(typeof(this.monthValue) == "undefined" || this.monthValue == ''){
          var time = ''
        }else{
          var time = formatDateMonth(this.monthValue)
        }
        var param = {
          nowPage:this.nowPage,
          pageShow:this.pageSize,
          taskDateTime:time,
          deptId:this.deptName
        }
        listTaskPerformances1(param).then(function (res) {
          if (res.code == ERR_OK) {
            self.performanceStatistics=res.data.performanceStatistics
            self.performanceData=res.data
            self.total=res.data.totalCount
          }else{
            self.$notify.error({
              title: '错误',
              message: res.msg
            });
          }
        })
      },
      //奖惩记录
      _perfRecordManage(){
        var self=this
        var param={
          nowPage:this.nowPage4,
          pageShow:this.pageSize4,
          deptId:this.deptName3,
          rpType:this.type4
        }
        perfRecordManage(param).then((res) => {
          if (res.code == ERR_OK) {
             self.tableReward = res.data.result;
             if(res.data.result.length>0){
                this.departData = true
             }else{
               this.departData = false
             }
             self.total4=res.data.totalCount
          }else{
            self.$notify.error({
              title: '错误',
              message: res.msg
            });
          }
        })
      },
      //考勤绩效
      _perfmHrDeptList(){
        var self=this
        if(typeof(this.monthValue1) == "undefined" || this.monthValue1 == ''){
          var time = ''
        }else{
          var time = formatDateMonth(this.monthValue1)
        }
        var param={
          nowPage:this.nowPage1,
          pageShow:this.pageSize1,
          seletDeptId:this.deptName1,
          hrDateStr:time
        }
        perfmEmpStaff(param).then(function (res) {
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
      // 部门列表
      perfmHrDepart(){
        console.log(this.monthValue2)
        var self=this
        if(typeof(this.monthValue2) == "undefined" || this.monthValue2 == ''){
          var time = ''
        }else{
          var time = formatDateMonth(this.monthValue2)
        }
        var param={
          deptId:this.deptName2,
          hrDateStr:time
        }
        perfmEmpDepart(param).then(function (res) {
          if (res.code == ERR_OK) {
             self.tableDepartValue = res.data
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
    border:none;
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
  .reward-button{
    float: left;
    margin-left: 20px;
    border: 1px solid #D83436;
    border-radius: 4px;
    width: 80px;
    margin-top: 11px;
    text-align: center;
    font-size: 14px;
    color: #D93538;
    height: 24px;
    line-height: 24px;
    cursor: pointer;
  }
  .attendance{
    float: left;
    span{
      padding-left: 20px;
    }
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
  .overHide{
    position: relative;
  }
</style>
