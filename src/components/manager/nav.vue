<template>
  <div>
    <div class="shortcuts_right right">
      <h2 class="title_tip"><span>快捷导航</span></h2>
      <div class="shortcuts_contents">
        <div class="left handling"  @click="mindTask">
            <div class="handle_center">
              <div class="el-icon-title">发起任务</div>
              <i class="icon-edit"></i>
            </div>
        </div>
        <div class="left handling" @click="assignTask">
          <div class="handle_center handle_center_noborder">
            <div class="el-icon-title">分配任务</div>
            <i class="icon_assignment"></i>
          </div>
        </div>
      </div>
    </div>
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
            <el-select v-model="ruleForm.value3" placeholder="请选择任务等级"  style="width:100%;">
             <el-option
               v-for="item in options1"
               :key="item.value"
               :label="item.label"
               :value="item.value">
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
             <el-date-picker type="date" :picker-options="pickerOptions0" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
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
          </div>
        </el-form-item> -->
        <!-- <el-form-item label="完成时间:" required style="margin-right: 40px !important;height:36px;">
          <el-form-item prop="date1">
            <el-date-picker type="date" :picker-options="pickerOptions0" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
          </el-form-item>
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
                :value="item.deptId + ''">
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
    <!--分配任务模态窗-->
    <el-dialog
        title="分配任务"
        :visible.sync="dialogVisible3"
        width="560px"
        :before-close="handleClose3" top='20%' class="assignTaskModel" >
        <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="112px" class="demo-ruleForm">
          <el-form-item label="任务标题:" prop="titlen" style="margin-right: 104px !important;">
            <el-input v-model="ruleForm1.titlen"></el-input>
          </el-form-item>
          <el-form-item label="执行人:" prop="goUser" required style="margin-right: 104px !important;">
            <el-select v-model="ruleForm1.goUser" placeholder="请选择执行人" style="width:100%;" @change='selectGoUser'>
              <el-option
                v-for="item in usersGo"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务类型:" prop="taskTypeF" class="special1" required style="margin-right: 104px !important;">
            <el-select v-model="ruleForm1.taskTypeF" placeholder="请选择任务类型" style="width:100%;" @change='selectType'>
              <el-option
                v-for="item in optionType1"
                :key="item.taskTypeId"
                :label="item.taskTypeName"
                :value="item.taskTypeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务重要等级:" prop="imporLeveln" required class="special1" style="margin-right: 104px !important;">
            <el-select v-model="ruleForm1.imporLeveln" placeholder="请选择任务类型" style="width:100%;" @change='selectLevel'>
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <i class="el-icon-warning" style="float:left;margin-right: 40px !important;" @mouseenter="iconEnter1" @mouseleave="iconLeave1"></i>
            <div class="tip-information" ref="displayShow1">
              <p>任务重要程度：</p>
              <p>公司重点任务，重要系数：4</p>
              <p>部门重点任务，重要系数：2</p>
              <p>个人重点任务，重要系数：1</p>
              <p>个人普通任务，重要系数：0.5</p>
              <!-- <p>个人重点任务有数量限制，所有重要任务中，只有20%为个人重点，超出部门要提示用户移除一个现有的个人重点任务</p> -->
            </div>
          </el-form-item>
          <el-form-item label="完成时间:" required style="margin-right: 104px !important;height:36px;">
            <el-form-item prop="choseTimen">
              <el-date-picker type="date" :picker-options="pickerOptions01" placeholder="选择日期" v-model="ruleForm1.choseTimen" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-form-item>
        </el-form>
          <span slot="footer" class="dialog-footer">
            <button  @click="resetForm3('ruleForm1')">取 消</button>
            <button  @click="submitForm3('ruleForm1')">分配任务</button>
          </span>
      </el-dialog>
    <!--发布任务模态窗-->
    <el-dialog
      title='添加任务类型'
      :visible.sync="dialogVisible5"
      width="560px"
      :before-close="handleClose5" top='23%' >
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="112px" class="demo-ruleForm">
        <el-form-item label="任务类型:" prop="taskname" style="margin-right: 40px !important;">
          <el-input v-model="ruleForm2.taskname"></el-input>
        </el-form-item>
        <el-form-item label="任务分值:" prop="score" required style="margin-right: 40px !important;">
          <el-select v-model="ruleForm2.score" placeholder="请选择任务分值" style="width:100%;">
            <el-option
              v-for="item in score"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
          <span slot="footer" class="dialog-footer">
            <button  @click="resetForm5('ruleForm2')">取 消</button>
            <button  @click="submitForm5('ruleForm2')">确 认</button>
          </span>
    </el-dialog>
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
      <el-dialog title="重设任务等级" :visible.sync="dialogVisible22" width="560px"
                 :before-close="handleClose22" top='10%' class="">
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
  </div>
</template>
<script type="text/ecmascript-6">
  import bus from '../../assets/eventBus'
  import {ERR_OK,ImportantLevel,score} from 'service/config'
  import {taskWeekly,listPending1,listByExecutor,departmentList,listReportingUsers,impChangeOrdTask,addEnabled,listJustDeptLeaders,getTaskType,listAllUsers, assignTaskManage,getUsersObj,getProjectList,publishTask,addTaskType,listTaskExecutors} from '../../service/getData'
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
        dialogVisible3:false,
        dialogVisible5:false,
        dialogVisible11:false,
        dialogVisible22:false,
        taskNumber:'',
        Taskoptions:[],
        checkedCities:[],
        checkedKey:[],
        optionsObj: [],
        checkedValue:[],
        depet:[],
        options1:ImportantLevel,
        addUsers:[],
        usersGo:[],
        score:score,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        pickerOptions01: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        optionType: [],
        optionType1:[],
        users: [],
        usersT:[],
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
        ruleForm1:{
          titlen:'',
          taskTypeF:'',
          imporLeveln:'',
          goUser:'',
          choseTimen:''
        },
        ruleForm2:{
          taskname:"",
          score:""
        },
        rules2:{
          taskname: [
            { required: true, message: '请填写任务类型名称', trigger: 'change' },
          ],
          score:
            [
              { required: true,type:'number', message: '请选择任务分值', trigger: 'change' },
            ],
        },
        rules1:{
          titlen:
            [
              { required: true, message: '请填写任务标题'
              },
              {  max: 50, message: '任务标题长度不能超过50个字符' }
            ],
          taskTypeF: [
            { required: true, message: '请选择任务类型', trigger: 'blur,change',type:'number' },
          ],
          goUser: [
            { required: true, message: '请选择任务执行人', trigger: 'blur,change',type:'number' },
          ],
          imporLeveln: [
            { required: true, message: '请选择任务重要等级', trigger: 'blur,change' },
          ],
          choseTimen: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
        },
        ruleForm: {
          name: '',
          name13: '',
          date1: '',
          date2: '',
          date13: '',
          dateM: '',
          region1: '',
          region: '',
          desc: '',
          telObj: '',
          telObj13: '',
          content: '',
          content13: '',
          value3: '',
          value13: '',
          value4: '',
          value14: '',
          value15: '',
          value5: '',
          value6: '',
          value16: '',
          value7: '',
          value17: '',
          value71:[],
          mass: '',
          rate: '',
          rateContent: '',
          becomCuase2: '',
          becomCuase3: '',
          becomCuase4: '',
          becomCuase1: '',
          cancleCause: '',
          grades: '',
          delayCause: '',
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
    }
    ,
    created(){

    },
    mounted(){
      this.listAllUsers2()
      this.listAllUsersT()
      this.departmentList1()
    },
    methods:{
      //获取任务组
      getTaskTypesByExecutor(userId,key){
        let self = this
        const params = {
          userId:userId
        }
        listByExecutor(params).then((res) => {
          if(res.code == ERR_OK) {
            if(key==1){
              this.ruleForm.value4 = ''
              this.optionType = res.data
              this.optionType.unshift({
                taskTypeId:'',
                taskTypeName: '请选择任务类型'
              })
            }else{
              this.ruleForm1.taskTypeF = ''
              this.optionType1 = res.data
              this.optionType1.unshift({
                taskTypeId:'',
                taskTypeName: '请选择任务类型'
              })
            }

          }
       })
      },
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
      handleClose22(done) {
        this.dialogVisible22 = false
        this.dialogVisible11 = false
      },
      checkDelete(){
        this.dialogVisible22 = false
      },
//      发起任务
      mindTask() {
        this.ruleForm.name = ''
        this.ruleForm.value4 = ''
        this.ruleForm.value3 = ''
        this.ruleForm.date1 = ''
        this.ruleForm.content = ''
        if(this.userView=='MANAGER'){
          //this.getTaskType1()
          this.getTaskExecutors()
          //this.getReportUsers()
          this.getProjectLists()
          this.listAllUsersT()
        }
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
      handleCheckedCitiesChange(val) {
        this.checkedValue = val
      },
      handleClose3 (){
        this.dialogVisible3 = false
        this.$refs['ruleForm1'].resetFields();
      },
      selectType(val){
        this.ruleForm1.taskTypeF = val
      },
      handleClose11(){
        this.dialogVisible11 = false
      },
      resetForm15(formName1) {
        this.dialogVisible15 = false
        this.$refs[formName1].resetFields();
      },
//      分配任务
      assignTask () {
        this.dialogVisible3 = true
        if(this.userView=='MANAGER'){
          //this.getTaskType1()
          this.getTaskExecutors()
          //this.getReportUsers()
          this.getProjectLists()
        }
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
      checkDelete(){
        this.dialogVisible22 = false
      },
      listAllUsers2() {
        listJustDeptLeaders().then((res) => {
          if(res.code == ERR_OK) {
            this.usersGo = res.data
            // for(let i in this.users){
            //   if(this.users[i].checked==true){
            //     //this.ruleForm.value5 = this.users[i].userId
            //     this.ruleForm33.goUser = this.users[i].userId
            //   }
            // }
          }
       })
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
      _addTaskType(){
        var self=this;
        let param={
          taskTypeName:this.ruleForm2.taskname,
          taskTypeScore:this.ruleForm2.score,
        }
        addEnabled(param).then(function (res) {
          if(res.code==ERR_OK){
            //self.getTaskType1()
            self.$notify({
              title: '成功',
              message: '添加任务组类型成功',
              type: 'success'
            });
          }else{
            self.$notify.error({
              title: '错误',
              message:res.msg
            });
          }
        })
      },
      addTaskType () {
        this.dialogVisible5 = true
      },
      selectGoUser(val){
        this.ruleForm1.goUser = val
        this.getTaskTypesByExecutor(val,2)
      },
      selectLevel(val){
        this.ruleForm1.imporLeveln = val
      },
      resetForm3(formName) {
        this.dialogVisible3 = false
        this.$refs[formName].resetFields();
      },
      submitForm3(formName) {
        let self = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let d = new Date(self.ruleForm1.choseTimen)
            let time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
            this.dialogVisible3 = false
            const params = {
              title:self.ruleForm1.titlen,
              taskTypeId:self.ruleForm1.taskTypeF,
              executorId:self.ruleForm1.goUser,
              grade:self.ruleForm1.imporLeveln,
              planEndDate:time
            }
            assignTaskManage(params).then((res) => {
              if(res.code == ERR_OK) {
                this.getUntreatTask()
                this.$notify({
                  title: '成功',
                  message: '分配任务成功',
                  type: 'success'
                });
              }else{
                this.$notify.error({
                  title: '失败',
                  message:res.msg
                });
              }
            })
          } else {
            return false;
          }
        });
      },
//      添加任务类型
      handleClose5 (){
        this.dialogVisible5 = false
        this.$refs['ruleForm2'].resetFields();
      },
      resetForm5(formName) {
        this.dialogVisible5 = false
        this.$refs[formName].resetFields();
      },
      submitForm5(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this._addTaskType()
            this.dialogVisible5 = false
          } else {
            return false;
          }
        });
      },
      // 待处理任务列表
      getUntreatTask(){
        listPending1().then((res) => {
          if(res.code == ERR_OK) {
            this.result1 = res.data.pendingTask
            this.cimpTaskSizeU =res.data.cimpTaskSize
            this.dimpTaskSizeU =res.data.dimpTaskSize
          }
        })
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
        this.getTaskTypesByExecutor(val,1)
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
      iconEnter1() {
        this.$refs.displayShow1.style.display = 'block'
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
      iconLeave1() {
        this.$refs.displayShow1.style.display = 'none'
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
            this.getTaskTypesByExecutor(this.ruleForm.value5,1)
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
        //this.dialogVisible = false
        const params = {
          title: self.ruleForm.name,
          taskTypeId: self.ruleForm.value4,
          executorId: self.ruleForm.value5,
          reportId: self.ruleForm.telObj,
          projectId: self.ruleForm.value7,
          grade: self.ruleForm.value3,
          visibleRange:value71,
          ptaskAssists: JSON.stringify(self.addUsers),
          planEndDate: time,
          draftTask:true,
          //repeatMode: self.ruleForm.value6,
          content: self.ruleForm.content
        }
        publishTask(params).then((res) => {
          if (res.code == ERR_OK) {
            this.$notify({
              title: '成功',
              message: '保存草稿成功',
              type: 'success'
            });
            bus.$emit('task','SUCCESS')
            self.dialogVisible = false
            this.$refs['ruleForm'].resetFields();
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
        //this.dialogVisible = false
        const params = {
          title: self.ruleForm.name,
          taskTypeId: self.ruleForm.value4,
          executorId: self.ruleForm.value5,
          reportId: self.ruleForm.telObj,
          projectId: self.ruleForm.value7,
          grade: self.ruleForm.value3,
          visibleRange:value71,
          ptaskAssists: JSON.stringify(self.addUsers),
          planEndDate: time,
          //repeatMode: self.ruleForm.value6,
          content: self.ruleForm.content
        }
        publishTask(params).then((res) => {
          if (res.code == ERR_OK) {
            this.$notify({
              title: '成功',
              message: '发起任务成功',
              type: 'success'
            });
            bus.$emit('task','SUCCESS')
            self.dialogVisible = false
            this.$refs['ruleForm'].resetFields();
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
  @import '../../style/mixin';
  .shortcuts_right{
  @include wh(100%,200px);
    background: #FFFFFF;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 6px;
  }
  .shortcuts_contents{
  @include wh(100%,149px);
    background: #FFFFFF;
    box-shadow: 0 2px 11px 0 rgba(0,0,0,0.07);
    border-radius: 6px;
    position: relative;
  .handling{
    cursor: pointer;
  @include wh(50%,149px);
  .handle_center{
    width:100%;
    height: 90px;
    text-align:center;
    border-right: 1px solid #979797;
    margin-top: 30px;
    font-size: 16px;
    color: #505363;
  .el-icon-title{
    padding-top: 30px;
  }
  .el-icon-edit{
    display: block;
    padding-top: 10px;
  }
  }
  .handle_center_noborder{
    border: none;
  }
  }
  }
  .btn{
    width: 100%;
    background: #D93437;
    border-radius: 0 0 6px 6px;
    height: 45px;
    cursor: pointer;
    font-size: 16px;
    color: #FFFFFF;;
    position: absolute;
    left: 0;
    bottom: 0;

  }

  .title_tip{
    display: block;
  @include wh(100%,51px);
    line-height: 51px;
    font-size: 16px;
    color: #505363;
    background: #f3f3f3;
  span{
    padding-left: 20px;
  }
  }
  .icon-edit{
    display: block;
    width: 18px;
    height: 18px;
    margin: 10px auto;
    background: url('../../images/icon_edit.png') no-repeat center center;
  }
  .icon_newtack{
    /*icon_newtack.png*/
    display: inline-block;
    width: 16px;
    float: left;
    height: 16px;
    margin-left: 245px;
    margin-top: 17px;
    background: url('../../images/icon_newtack.png') no-repeat center center;
  }
  .start{
    display: inline-block;
    float: left;
    margin-left: 10px;
    margin-top: 15px;
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
  .special1{
    position: relative;
  }
  .addPercent span {
    position: absolute;
    right: -25px;
  }
  .icon_assignment{
    display: block;
    width: 21px;
    height: 18px;
    margin: 10px auto;
    background: url('../../images/icon_assignment.png') no-repeat center center;
  }
  .special1 .addTaskType{
    position: absolute;
    right: -91px;
    top:2px;
    width:80px;
    height:30px;
    line-height: 30px;
    text-align: center;
    font-size: 12px;
    color: #D93437;
    border: 1px solid #D83436;
    border-radius: 4px;
    cursor: pointer;
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
</style>
