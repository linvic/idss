<template>
<div>
  <div class="nav">
    <h2 class="title">
      <span class="title_style">快捷导航</span>
    </h2>
    <div class="nav_content">
      <router-link to="/initiateNew">
        <div class="nav_content_left">
          <div class="padding_left">
            <div class="nav_content_center">
              <p class="nav_content_title">发起日报</p>
              <p>
                <i class="icon-edit"></i>
              </p>
            </div>
          </div>
        </div>
      </router-link>
      <router-link to="/staffPersonEditor">
        <div class="nav_content_right">
          <div class="nav_content_center">
            <p class="nav_content_title">发起周报</p>
            <p>
              <i class="icon-edit"></i>
            </p>
          </div>
        </div>
      </router-link>
    </div>
    <div class="nav_bottom" @click="mindTask">
      <i class="icon_newtack"></i>
      <span class="start">发起任务</span>
    </div>
  </div>
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
                <router-link :to="{ path: '/taskManage/taskDetail',query: {id:item.taskId}}" style="color:#505363;">
                 <span class="span-content">{{item.title}}</span>
               </router-link>
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
          <div v-cloak class="el-table__empty-block" style="width: 1189px;" v-if="tableData.length<=0">
            <span class="el-table__empty-text" style="font-size: 14px">暂无数据</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="">
    <!--发布任务模态窗-->
    <el-dialog title="发起任务" :visible.sync="dialogVisible" width="560px" :before-close="handleClose" top='10%' class=" noticeManageModel">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="112px" class="demo-ruleForm">
        <div style="margin-left:32px;margin-bottom:18px;overflow:hidden;">
          <span style="float:left;line-height:36px;"><label style="color:#ff4949">* </label>任务标题:</span>
          <el-input v-model="ruleForm.name" style="width:363px;margin-left:12px;float:left;"></el-input>
        </div>
        <div style="margin-left:46px;margin-bottom:18px;overflow:hidden;">
          <span style="float:left;vertical-align:middle;line-height:36px;">
            <label style="color:#ff4949">* </label>执行人:</span>
            <span style="width:363px;margin-left:12px;float:left;">
              <el-select v-model="ruleForm.value5" filterable placeholder="请选择执行人" style="width:100%;" @change='goLink'>
                <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId">
                </el-option>
              </el-select>
            </span>
        </div>
        <div style="margin-left:32px;margin-bottom:18px;overflow:hidden;">
          <span style="float:left;vertical-align:middle;line-height:36px;">
            <label style="color:#ff4949">* </label>任务类型:
          </span>
          <span style="width:363px;margin-left:12px;float:left;">
            <el-select v-model="ruleForm.value4" placeholder="请选择类型" style="width:100%;" @click="choseTaskType1">
              <el-option v-for="item in optionType" :key="item.taskTypeId" :label="item.taskTypeName" :value="item.taskTypeId">
              </el-option>
            </el-select>
          </span>
        </div>
        <div style="margin-left:4px;margin-bottom:18px;overflow:hidden;">
          <span style="float:left;vertical-align:middle;line-height:36px;">
            <label style="color:#ff4949">* </label>任务汇报对象:
          </span>
          <span style="width:363px;margin-left:12px;float:left;">
            <el-select v-model="ruleForm.telObj" filterable placeholder="请选择任务汇报对象" style="width:100%;">
              <el-option v-for="item in optionsObj" :key="item.userId" :label="item.userName" :value="item.userId">
              </el-option>
            </el-select>
          </span>
        </div>
        <div style="margin-left:4px;margin-bottom:18px;" class="clearfix">
          <span style="float:left;vertical-align:middle;line-height:36px;">
            <label style="color:#ff4949">* </label>任务重要等级:
          </span>
          <span style="width:363px;margin-left:12px;float:left;" class="special1">
            <el-select v-model="ruleForm.value3" placeholder="请选择任务等级" style="width:100%;">
              <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <i class="el-icon-warning" style="float:left;margin-right: 40px !important;" @mouseenter="iconEnter" @mouseleave="iconLeave"></i>
            <div class="tip-information" ref="displayShow">
              <p>任务重要程度：</p>
              <p>公司重点任务，重要系数：4</p>
              <p>部门重点任务，重要系数：2</p>
              <p>个人重点任务，重要系数：1</p>
              <p>个人普通任务，重要系数：0.5</p>
            </div>
           </span>
         </div>
         <div style="margin-left:32px;margin-bottom:18px;overflow:hidden;">
           <span style="float:left;vertical-align:middle;line-height:36px;">
             <label style="color:#ff4949">* </label>完成时间:
           </span>
           <span style="width:363px;margin-left:12px;float:left;">
             <el-date-picker type="date" placeholder="选择日期" :picker-options="pickerOptions0" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
           </span>
         </div>
         <div style="margin-left:32px;margin-bottom:18px;overflow:hidden;">
           <span style="float:left;vertical-align:middle;line-height:36px;">
             <label style="color:#ff4949">* </label>任务内容:
           </span>
           <span style="width:363px;margin-left:12px;float:left;">
             <el-input type="textarea" v-model="ruleForm.content"></el-input>
           </span>
         </div>
        <!-- <el-form-item label="任务标题:" prop="name" style="margin-right: 40px !important;">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="执行人:" prop="value5" required style="margin-right: 40px !important;">
          <el-select v-model="ruleForm.value5" filterable placeholder="请选择执行人" style="width:100%;" @change='goLink'>
            <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="任务类型:" prop="value4" required style="margin-right: 40px !important;">
          <el-select v-model="ruleForm.value4" placeholder="请选择类型" style="width:100%;" @click="choseTaskType1">
            <el-option v-for="item in optionType" :key="item.taskTypeId" :label="item.taskTypeName" :value="item.taskTypeId">
            </el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="任务汇报对象:" required prop="telObj" style="margin-right: 40px !important;">
          <el-select v-model="ruleForm.telObj" filterable placeholder="请选择任务汇报对象" style="width:100%;">
            <el-option v-for="item in optionsObj" :key="item.userId" :label="item.userName" :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="任务重要等级:" prop="value3" required class="special1" style="margin-right: 40px !important;">
          <el-select v-model="ruleForm.value3" placeholder="请选择任务等级" style="width:100%;">
            <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <i class="el-icon-warning" style="float:left;margin-right: 40px !important;" @mouseenter="iconEnter" @mouseleave="iconLeave"></i>
          <div class="tip-information" ref="displayShow">
            <p>任务重要程度：</p>
            <p>公司重点任务，重要系数：4</p>
            <p>部门重点任务，重要系数：2</p>
            <p>个人重点任务，重要系数：1</p>
            <p>个人普通任务，重要系数：0.5</p>
            <p>个人重点任务有数量限制，所有重要任务中，只有20%为个人重点，超出部分要提示用户移除一个现有的个人重点任务</p>
          </div>
        </el-form-item>
        <el-form-item label="完成时间:" required style="margin-right: 40px !important;height:36px;">
          <el-form-item prop="date1">
            <el-date-picker type="date" placeholder="选择日期" :picker-options="pickerOptions0" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-form-item> -->
        <!-- <el-form-item label="自动重复时间:" style="margin-right: 40px !important;">
          <el-select v-model="ruleForm.value6" placeholder="请选择自动回复时间" style="width:100%;" @change='choseTime'>
            <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="任务内容：" prop="content" style="margin-right: 40px !important;">
          <el-input type="textarea" v-model="ruleForm.content"></el-input>
        </el-form-item> -->
        <div v-show="stretch">
          <div class="user-wrapper" style="line-height:32px;margin-bottom:13px;margin-left:21px;">
            <div class='user-left'>任务协助人：</div>
            <div style="float:left;" class='user-right-wrapper'>
              <div class='user-right' @click='adduser'>添加协助人</div>
              <div class="user-item ellipsis" v-for='(item,index) in brr'>
                <span class="ellipsis" style="display: inline-block;width: 100%;">{{item.username}}（{{item.proportion}}%）</span>
                <i class="el-icon-circle-close" @click="removeTodo(index)"></i>
              </div>
            </div>
          </div>
          <el-form-item label="关联项目:" style="margin-right: 40px !important;">
            <el-select v-model="ruleForm.value7" placeholder="请选择关联项目" style="width:100%;" @click='choseRelateProject'>
              <el-option v-for="item in projects" :key="item.projectId" :label="item.projectName" :value="item.projectId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务可见范围:" style="margin-right: 40px !important;">
            <el-select  multiple v-model="ruleForm.value71" placeholder="请选择部门"  style="width:100%;">
              
              <el-option label="公司" value="-1"></el-option>
              <el-option
                  v-for="item in depet"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId + ''" >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div style="text-align: center">
          <div style="cursor: pointer" @click="Collapse">
            <span>{{msg}}</span>
            <i :class="stretch ? 'el-icon-arrow-up':'el-icon-arrow-down'"></i>
          </div>
        </div>
      </el-form>
          <span slot="footer" class="dialog-footer">
              <button  @click="resetForm('ruleForm')">取 消</button>
              <button  @click="saveDrafts('ruleForm')" class='saveDrafts'>保存草稿</button>
              <button  @click="submitForm('ruleForm')">发布任务</button>
            </span>
    </el-dialog>
  </div>
  <div class="deleteDepartment">
    <el-dialog
      title="个人重点任务超出提醒"
      :visible.sync="dialogVisible11"
      width="560px"
      :before-close="handleClose11" top='25%' class="department">
      <p>您/他当前的个人重点任务数量为：{{taskNumber}}</p>
      <p>您可将已有个人重点任务改为个人普通任务</p>
      <p>已超出数量限制</p>
      <p style='color: #D93437;'>是否确定修改？</p>
          <span slot="footer" class="dialog-footer">
            <button @click="dialogVisible11 = false">取 消</button>
            <button  @click='sureDelete'>确 定</button>
          </span>
    </el-dialog>
  </div>
  <div class="">
    <el-dialog title="重设任务等级" :visible.sync="dialogVisible22" width="560px" :before-close="handleClose22" top='10%' class="">
      <div class="permissions-table">
        <div class="check-wrapper-special">
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in Taskoptions" :label="item.taskId" :key="item.taskId">{{item.title}}</el-checkbox>
          </el-checkbox-group>

        </div>
      </div>
          <span slot="footer" class="dialog-footer" style="margin-top:10px;">
              <button @click="checkDelete">取 消</button>
              <button @click="sureRole">确 定</button>
            </span>
    </el-dialog>
  </div>
  <!--添加协助人-->
  <el-dialog title="添加协助人"
             :visible.sync="dialogVisible15"
             width="560px"
             :before-close="handleClose15"
             top='25%'
             class=" noticeManageModel">
    <el-form :model="ruleForm5" :rules="rules" ref="ruleForm5" label-width="112px" class="demo-ruleForm">
      <el-form-item label="姓名:" prop="username" style="margin-right: 40px !important;">
        <el-select v-model="ruleForm5.username" filterable placeholder="请选择协助人" style="width:100%;">
          <el-option v-for="item in usersT" :key="item.userId" :label="item.userName" :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="占比:" prop="percent" style="margin-right: 80px !important;" class='addPercent'>
        <el-input v-model.number="ruleForm5.percent"></el-input><span>%</span>
      </el-form-item>
    </el-form>
          <span slot="footer" class="dialog-footer">
              <button  @click="resetForm15('ruleForm5')">取 消</button>
              <button  @click="submitForm15('ruleForm5')">确定</button>
            </span>
  </el-dialog>
</div>
</template>
<script type="text/ecmascript-6">
  import {ERR_OK,ImportantLevel} from 'service/config'
  import {taskWeekly,getTaskType,listByExecutor,departmentList,listAllUsers,listReportingUsers,getUsersObj,getProjectList,publishTask,listTaskExecutors,listThisWeekTask,impChangeOrdTask} from '../../service/getData'
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
        stretch:false,
        msg:"展开更多选项",
        submitPerson:false,
        submitDept:false,
        dialogVisible: false,
        dialogVisible15:false,
        dialogVisible11:false,
        dialogVisible22:false,
        taskNumber:0,
        checkedCities:[],
        checkedKey:[],
        Taskoptions:[],
        optionsObj: [],
        depet:[],
        checkedValue: [],
        options1:ImportantLevel,
        tableData:[],
        thisWeekEndDate:"",
        thisWeekStartDate:"",
        mondayFridayDates:"",
        addUsers:[],
        usersT:[],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        optionType: [],
        users: [],
        brr: [],
        option2: [{
          value: 'NOREPEAT',
          label: '永不'
        }, {
          value: 'REPEATDAILY',
          label: '每天重复'
        }, {
          value: 'REPEATWEEKLY',
          label: '每周重复'
        }, {
          value: 'REPEATMONTHLY',
          label: '每月重复'
        }],
        projects: [],
        ruleForm5: {
          username: '',
          percent: '',
        },
        ruleForm: {
          name: '',
          name13:'',
          date1: '',
          date2: '',
          date13:'',
          dateM:'',
          region1:'',
          region:'',
          content:'',
          region: '',
          desc: '',
          score:'',
          telObj:'',
          telObj13:'',
          content:'',
          content13:'',
          value3:'',
          value13:'',
          value4:'',
          value14:'',
          value15:'',
          value5:'',
          value6:'',
          value16:'',
          value7:'',
          value17:'',
          value71:[],
          taskname:'',
          mass:'',
          rate:'',
          titlen:'',
          taskTypeF:'',
          goUser:'',
          choseTimen:'',
          imporLeveln:'',
          rateContent:'',
          becomCuase2:'',
          becomCuase3:'',
          becomCuase4:'',
          becomCuase1:'',
          cancleCause:'',
          grades:'',
          delayCause:'',
        },
        rules: {
          telObj: [{
            required: true,
            message: '请选择任务汇报对象',
            trigger: 'change',
            type: 'number'
          }, ],
          telObj13: [{
            required: true,
            message: '请选择任务汇报对象',
            trigger: 'change',
            type: 'number'
          }],
          mass: [{
            required: true,
            message: '请选择完成质量',
            trigger: 'change'
          }, ],
          rate: [{
            required: true,
            message: '请选择快速评价',
            trigger: 'change'
          }, ],
          rateContent: [{
            required: true,
            message: '请填写任务评价',
            trigger: 'change'
          }, ],
          name: [{
            required: true,
            message: '请输入任务标题',
          },
            {  max: 50, message: '任务标题长度不能超过50个字符' }
          ],
          name13: [{
            required: true,
            message: '请输入任务标题',
          },
            {  max: 50, message: '任务标题长度不能超过50个字符' }
          ],
          grades: [{
            required: true,
            message: '请选择重要等级',
            trigger: 'change'
          }, ],
          becomCuase1: [{
            required: true,
            message: '请填写审核原因',
            trigger: 'change'
          }, ],
          becomCuase2: [{
            required: true,
            message: '请填写审核原因',
            trigger: 'change'
          }, ],
          becomCuase3: [{
            required: true,
            message: '请填写审核原因',
            trigger: 'change'
          }, ],
          becomCuase4: [{
            required: true,
            message: '请填写审核原因',
            trigger: 'change'
          }, ],
          delayCause: [{
            required: true,
            message: '请填写延期原因',
            trigger: 'change'
          }, ],
          cancleCause: [{
            required: true,
            message: '请填写取消原因',
            trigger: 'change'
          }, ],
          username: [{
            required: true,
            message: '请填写姓名',
            trigger: 'blur',
            type: 'number'
          }, ],
          num: [{
            required: true,
            message: '请填写重复间隔'
          },
            {
              type: 'number',
              message: '重复间隔必须为数字值'
            }
          ],
          num2: [{
            required: true,
            message: '请填写重复间隔'
          },
            {
              type: 'number',
              message: '重复间隔必须为数字值'
            }
          ],
          num3: [{
            required: true,
            message: '请填写重复间隔'
          },
            {
              type: 'number',
              message: '重复间隔必须为数字值'
            }
          ],
          percent: [{
            required: true,
            message: '请填写占比'
          },
            {
              type: 'number',
              message: '占比必须为数字值'
            }
          ],
          percent1: [{
            required: true,
            message: '请填写占比'
          },
            {
              type: 'number',
              message: '占比必须为数字值'
            }
          ],
          cause: [{
            required: true,
            message: '请输入取消原因',
            trigger: 'blur'
          }, ],
          cause1: [{
            required: true,
            message: '请输入延期原因',
            trigger: 'blur'
          }, ],
          cause3: [{
            required: true,
            message: '请输入变更原因',
            trigger: 'blur'
          }, ],
          cause4: [{
            required: true,
            message: '请输入自我评价',
            trigger: 'blur'
          }, ],
          region1: [{
            required: true,
            message: '请选择关联项目',
            trigger: 'change'
          }, ],
          date1: [{
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }],
          date2: [{
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }],
          date13: [{
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }],
          dateM: [{
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }],
          region: [{
            required: true,
            message: '请选择活动区域',
            trigger: 'change'
          }],
          content: [{
            required: true,
            message: '请输入任务内容',
          },
            {  max: 200, message: '任务内容长度不能超过200个字符' }
          ],
          value3: [{
            required: true,
            message: '请选择任务重要等级',
            trigger: 'blur,change'
          }, ],
          value13: [{
            required: true,
            message: '请选择任务重要等级',
            trigger: 'blur,change'
          }, ],
          value4: [{
            required: true,
            message: '请选择任务类型',
            trigger: 'blur,change',
            type: 'number'
          }, ],
          value14: [{
            required: true,
            message: '请选择任务类型',
            trigger: 'blur,change',
            type: 'number'
          }, ],
          value5: [{
            required: true,
            message: '请选择任务执行人',
            trigger: 'blur,change',
            type: 'number'
          }, ],
          value15: [{
            required: true,
            message: '请选择任务执行人',
            trigger: 'blur,change',
            type: 'number'
          }, ],
          value6: [{
            required: true,
            message: '请选择自动回复时间',
            trigger: 'blur'
          }, ],
          value16: [{
            required: true,
            message: '请选择自动回复时间',
            trigger: 'blur'
          }, ],
          value7: [{
            required: true,
            message: '请输入公告内容',
            trigger: 'blur'
          }, ],
          value17: [{
            required: true,
            message: '请输入公告内容',
            trigger: 'blur'
          }, ],
        },
      }
    },
    mounted(){
      this.departmentList1()
    },
    created(){
     if(this.userView=='STAFF'){
       this._listThisWeekTask()
     }
    },
    methods:{
      //获取部门
      departmentList1(){
        let self = this
        departmentList().then((res) => {
          if(res.code == ERR_OK) {
            let data = res
            self.depet = data.data.result
            self.depet.unshift(
              {deptId:0,
              deptName:'公司'}
            )
          }
       })
      },
      listAllUsersT() {
        listAllUsers().then((res) => {
          if(res.code == ERR_OK) {
            this.usersT = res.data
          }
       })
      },
      //      则面板
      Collapse(){
        this.stretch=!this.stretch
        if(this.stretch){
          this.msg="收起更多选项"
        }else{
          this.msg="展开更多选项"
        }
      },
      handleClose11(){
        this.dialogVisible11 = false
      },
      handleCheckedCitiesChange(val) {
        this.checkedValue = val
      },
      checkDelete(){
        this.dialogVisible22 = false
      },
      sureDelete(){
        this.checkedCities = []
        this.checkedKey = []
        this.dialogVisible11 = false
        if(this.taskNumber<=0){
          this.$notify({
            title: '提示',
            message: '个人普通任务数量不够，请先去创建个人普通任务吧！',
          });
        }else{
          this.dialogVisible22 = true
        }
      },
      sureRole(){
        if(this.checkedValue.length>0){
          var str = this.checkedValue.join(',')
          const params = {
            taskId:str
          }
          impChangeOrdTask(params).then((res) => {
            if (res.code == ERR_OK) {
              this.dialogVisible22 = false
              //this.dialogVisible11 = false
              this.$notify({
                title: '成功',
                message: '任务成功降为个人普通等级',
                type: 'success'
              });
            }else{
              this.$notify({
                title: '提示',
                message: '请选择要降为个人普通等级的任务',
              });
            }
          })
        }
      },
      handleClose22(done) {
        this.dialogVisible22 = false
        this.dialogVisible11 = false
      },
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
      },
//      发起任务
      mindTask() {
        this.ruleForm.name = ''
        this.ruleForm.value4 = ''
        this.ruleForm.value3 = ''
        this.ruleForm.date1 = ''
        this.ruleForm.content = ''
        //this.getTaskType1()
        this.getTaskExecutors()
        //this.getReportUsers()
        this.getProjectLists()
        this.listAllUsersT()
        this.dialogVisible = true
        this.addUsers = []
        this.brr = []
        this.ruleForm.value7=""
        this.ruleForm.value71=[]
      },
      handleClose(done) {
        this.dialogVisible = false
        this.$refs['ruleForm'].resetFields();
      },
      resetForm15(formName1) {
        this.dialogVisible15 = false
        this.$refs[formName1].resetFields();
      },
      getReportUsers(userId) {
        const params = {
          userId:userId
        }
        this.optionsObj = []
        listReportingUsers(params).then((res) => {
          if (res.code == ERR_OK) {
            this.optionsObj = res.data
            for (let i in this.optionsObj) {
              if (this.optionsObj[i].checked == true) {
                this.ruleForm.telObj = this.optionsObj[i].userId
              }
            }
          }
        })
      },
      goLink(val){
        this.getReportUsers(val)
        this.getTaskTypesByExecutor(val)
      },
      submitForm15(formName1) {
        let self = this
        this.$refs[formName1].validate((valid) => {
          if (valid) {
            if(self.ruleForm5.username === self.ruleForm.value5){
              self.$notify.error({
                title: '错误',
                message:'执行人和协助人不能相同',
              });
              return
            }
            if(self.addUsers.length>0){
              for(let item of self.addUsers){
                if(item.assistUserId === self.ruleForm5.username){
                  self.$notify.error({
                    title: '错误',
                    message:'不能选择相同的协助人',
                  });
                  return
                }
              }
            }
            self.dialogVisible15 = false
            let obj = {
              assistUserId: self.ruleForm5.username,
              proportion: self.ruleForm5.percent
            }
            self.addUsers.push(obj)
            this.brr = []
            for (var i = 0; i < self.usersT.length; i++) {
              for (var j = 0; j < self.addUsers.length; j++) {
                if (self.usersT[i].userId === self.addUsers[j].assistUserId) {
                  self.brr.push({
                    username: self.usersT[i].userName,
                    proportion: self.addUsers[j].proportion
                  })
                }
              }
            }
          } else {
            return false;
          }
        });
      },
      iconEnter() {
        this.$refs.displayShow.style.display = 'block'
      },
      // 模态框的选择任务类型
      choseTaskType1(val) {
        this.ruleForm.value4 = val
      },
      handleClose15(done) {
        this.dialogVisible15 = false
        this.$refs['ruleForm5'].resetFields();
      },
      iconLeave() {
        this.$refs.displayShow.style.display = 'none'
      },
      choseRelateProject(val) {
        this.ruleForm.value7 = val
      },
      // 点击添加协助人
      adduser() {
        this.dialogVisible15 = true
        // this.addusers = []
        // this.brr = []
      },
      resetForm(formName) {
        this.dialogVisible = false
        this.$refs[formName].resetFields();
      },
//      关联项目
      getProjectLists() {
        getProjectList().then((res) => {
          if (res.code == ERR_OK) {
            this.projects = res.data.result
            this.projects.unshift({
              projectId: '',
              projectName: '请选择关联项目'
            })
          }
        })
      },
      // 获取任务类型
      // getTaskType1() {
      //   getTaskType().then((res) => {
      //     if (res.code == ERR_OK) {
      //       this.optionType = res.data
      //       this.optionType.unshift({
      //         taskTypeId: '',
      //         taskTypeName: '请选择任务类型'
      //       })
      //     }
      //   })
      // },
//      任务执行人
      getTaskExecutors() {
        listTaskExecutors().then((res) => {
          if (res.code == ERR_OK) {
            this.users = res.data
            for (let i in this.users) {
              if (this.users[i].checked==true) {
                this.ruleForm.value5 = this.users[i].userId
              }
            }
            this.getReportUsers(this.ruleForm.value5)
            this.getTaskTypesByExecutor(this.ruleForm.value5)
          }
        })
      },
      //获取任务组
      getTaskTypesByExecutor(userId){
        let self = this
        const params = {
          userId:userId
        }
        listByExecutor(params).then((res) => {
          if(res.code == ERR_OK) {
            this.ruleForm.value4 = ''
            this.optionType = res.data
            this.optionType.unshift({
              taskTypeId:'',
              taskTypeName: '请选择任务类型'
            })
          }
       })
      },
      removeTodo(index) {
        this.brr.splice(index, 1);
        this.addUsers.splice(index, 1);
      },
      choseTime(val) {
        this.ruleForm.value6 = val
        if(val=='REPEATDAILY'){
          this.dialogVisible21 = true
        }else if(val=='REPEATWEEKLY'){
          this.dialogVisible23 = true
        }else if(val=='REPEATMONTHLY'){
          this.dialogVisible22 = true
        }
      },
      //      保存草稿
      saveDrafts(formName) {
        let self = this
        if(this.ruleForm.name==''){
          this.$notify.error({
            title: '错误',
            message:'请输入任务标题'
          });
          return false;
        }
        if(this.ruleForm.name.trim().length>50){
          this.$notify.error({
            title: '错误',
            message:'任务标题不能超过50个字符'
          });
          return false;
        }

        var value71 = this.ruleForm.value71.join(',');
        var time;
        if(self.ruleForm.date1=='') {
          time = ''
        }else{
          let d = new Date(self.ruleForm.date1)
          time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
        }
        const params = {
          title: self.ruleForm.name,
          taskTypeId: self.ruleForm.value4,
          executorId: self.ruleForm.value5,
          reportId: self.ruleForm.telObj,
          projectId: self.ruleForm.value7,
          visibleRange:value71,
          grade: self.ruleForm.value3,
          ptaskAssists: JSON.stringify(self.addUsers),
          planEndDate: time,
          draftTask:true,
          //repeatMode: self.ruleForm.value6,
          content: self.ruleForm.content
        }
        publishTask(params).then((res) => {
          if (res.code == ERR_OK) {
            self.dialogVisible = false
            this._listThisWeekTask()
            this.$refs[formName].resetFields();
            this.$notify({
              title: '成功',
              message: '保存草稿成功',
              type: 'success'
            });
          }else{
            this.$notify.error({
              title: '错误',
              message:res.msg
            });
          }
        })
      },
//      发布任务
      submitForm(formName) {
        let self = this
        if(this.ruleForm.name==''){
          this.$notify.error({
            title: '错误',
            message:'请输入任务标题'
          });
          return false;
        }
        if(this.ruleForm.name.trim().length>50){
          this.$notify.error({
            title: '错误',
            message:'任务标题不能超过50个字符'
          });
          return false;
        }
        if(this.ruleForm.value5==''&&this.ruleForm.value5!=0){
          this.$notify.error({
            title: '错误',
            message:'请选择执行人'
          });
          return false;
        }
        if(this.ruleForm.value4==''){
          this.$notify.error({
            title: '错误',
            message:'请选择任务类型'
          });
          return false;
        }
        if(this.ruleForm.telObj==''&&this.ruleForm.telObj!=0){
          this.$notify.error({
            title: '错误',
            message:'请选择任务汇报对象'
          });
          return false;
        }
        if(this.ruleForm.value3==''){
          this.$notify.error({
            title: '错误',
            message:'请选择任务重要等级'
          });
          return false;
        }
        if(this.ruleForm.date1==''){
          this.$notify.error({
            title: '错误',
            message:'请输入完成时间'
          });
          return false;
        }
        if(this.ruleForm.content==''){
          this.$notify.error({
            title: '错误',
            message:'请输入任务内容'
          });
          return false;
        }
        if(this.ruleForm.content.trim().length>200){
          this.$notify.error({
            title: '错误',
            message:'任务内容不能超过200个字符'
          });
          return false;
        }
        var value71 = this.ruleForm.value71.join(',')
        let d = new Date(self.ruleForm.date1)
        let time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
        const params = {
          title: self.ruleForm.name,
          taskTypeId: self.ruleForm.value4,
          executorId: self.ruleForm.value5,
          reportId: self.ruleForm.telObj,
          projectId: self.ruleForm.value7,
          visibleRange:value71,
          grade: self.ruleForm.value3,
          ptaskAssists: JSON.stringify(self.addUsers),
          planEndDate: time,
          //repeatMode: self.ruleForm.value6,
          content: self.ruleForm.content
        }
        publishTask(params).then((res) => {
          if (res.code == ERR_OK) {
            self.dialogVisible = false
            this._listThisWeekTask()
            this.$refs[formName].resetFields();
            this.$notify({
              title: '成功',
              message: '发起任务成功',
              type: 'success'
            });
          } else if(res.code == 'exceedPersonal'){
            self.dialogVisible11 = true
            self.taskNumber = res.data.length
            self.Taskoptions = res.data
          }else{
            this.$notify.error({
              title: '错误',
              message:res.msg
            });
          }
        })
      },
      getpublishTask(params){
        publishTask(params).then((res) => {
          if (res.code == ERR_OK) {
            this.dialogVisible = false
            this.$notify({
              title: '成功',
              message: '发起任务成功',
              type: 'success'
            });
          } else {
            this.$notify.error({
              title: '失败',
              message:res.msg
            });
          }
        })
      },
      skipPersonWeekly(){
        this._taskWeekly()
      },
      skipDepartWeekly(){
        this._taskWeeklyDept()
      },
      _taskWeekly(){
        taskWeekly().then((res)=>{
          if(res.code==ERR_OK){
            this.$router.push({
              path:"/postStaffWeekly"
            })
          }else{
            this.$notify.info({
              title: '提示',
              message: res.msg,
            });
          }
        })
      },
      _taskWeeklyDept(){
        taskWeekly().then((res)=>{
          if(res.code==ERR_OK){
            this.$router.push({
              path:"/postDepartWeekly"
            })
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
.nav{
  margin: 10px auto;
  height: 200px;
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 6px;
}
.title{
  width: 100%;
  height: 51px;
  background: #EFEFEF;
  border-radius: 6px 6px 0 0;
}
.title_style{
  font-size: 16px;
  color: #505363;
  line-height: 51px;
  padding-left: 15px;
}
  .nav_content{
    height: 104px;
    width: 100%;
  }
  .nav_bottom{
    width: 100%;
    height: 45px;
    line-height: 45px;
    background: #D93437;
    cursor: pointer;
    border-radius: 0 0 6px 6px;
    text-align: center;
    .icon_newtack{
      /*icon_newtack.png*/
      display: inline-block;
      width: 16px;
      height: 16px;
      vertical-align: middle;
      background: url('../../images/icon_newtack.png') no-repeat center center;
    }
    .start{
      display: inline-block;
      vertical-align: middle;
      font-size: 16px;
      color: #FFFFFF;
      margin-left: 5px;
    }
  }
  .nav_content_left,.nav_content_right{
    float: left;
    width: 50%;
    cursor: pointer;
    height: 104px;
  }
  .nav_content_center{
    width: 65px;
    height: 52px;
    margin: 20px auto;
  }
  .nav_content_title{
    font-size: 16px;
    color: #505363;
    padding-top: 10px;
    line-height: 16px;
  }
  .icon-edit{
    display: block;
    margin-left: 20px;
    margin-top: 10px;
  }
  .padding_left{
    height: 60px;
    margin-top: 25px;
    border-right: 1px solid #979797;
  }
.icon-edit{
  display: block;
  width: 18px;
  height: 18px;
  margin: 10px auto;
  background: url('../../images/icon_edit.png') no-repeat center center;
}
.user-wrapper::after {
  content: "";
  display: block;
  clear: both;
}
.user-item,
.user-left,
.user-right {
  float: left;
}
.user-right-wrapper {
  width: 392px;
  margin-left: 10px;
}
.user-item {
  position: relative;
  width: 95px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #999999;
  border-radius: 4px;
  font-size: 12px;
  color: #333333;
  overflow: inherit;
  text-align: center;
  margin-right: 15px;
  margin-bottom: 10px;
}
.user-item i {
  position: absolute;
  z-index: 100;
  color: #999;
  top: -7px;
  right: -7px;
}
.user-right {
  width: 110px;
  height: 30px;
  cursor: pointer;
  line-height: 30px;
  text-align: center;
  border: 1px solid #D83436;
  border-radius: 4px;
  font-size: 14px;
  color: #D93437;
  margin-right: 15px;
  margin-bottom: 10px;
}
.el-icon-warning {
  position: absolute;
  right: -61px;
  top: 11px;
}
.tip-information {
  position: absolute;
  right: -61px;
  top: 40px;
  display: none;
  z-index: 10;
  padding-left: 15px;
  line-height: 16px;
  padding-top: 18px;
  padding-bottom: 20px;
  padding-right: 6px;
  font-size: 12px;
  color: #FFFFFF;
  margin-right: 15px;
  background: rgba(0,0,0,0.80);
}
.addPercent {
  position: relative;
}
.addPercent span {
  position: absolute;
  right: -25px;
}
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
  font-size: 12px;
  background: #ffffff;
  color: #505363;
.taskName{
  padding: 0;
  margin: 0;
  width: 372px;
  height: 49px;
  font-size: 13px;
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
  font-size: 11px;
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
  height: 11px;
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
  height: 11px;
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
  height: 11px;
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
  height: 11px;
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
.span-content{
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

.check-wrapper-special .el-checkbox-group{
  text-align: center !important;
}
.check-wrapper-special .el-checkbox+.el-checkbox{
  margin-left: 0px !important;
}
.check-wrapper-special .el-checkbox{
  margin-bottom: 8px !important;
  display: block !important;
}

.initiateNew .el-input__inner{
  height: 35px !important;
}
.initiateNew .el-textarea__inner{
  font-size: 12px !important;
}
.initiateNew .el-textarea{
  width: 365px !important;
  height: 90px !important;
}
.initiateNew .el-textarea__inner{
  height: 90px !important;
}
</style>
