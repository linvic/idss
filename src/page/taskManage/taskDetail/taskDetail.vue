<template>
  <div class="">
    <!--<tab></tab>-->
    <div class="wrapper">
    <div class="router-wrapper">
      <router-link to="/taskManage">
        <span class="child1">任务管理</span>
      </router-link>
      /
      <router-link to="/taskManage">
        <span class="child1">任务列表</span>
      </router-link>
      /
      <router-link to="/taskDetail">
        <span class="child2">任务详情</span>
      </router-link>
    </div>
    <div class="uncomplete-task" >
      <div class="user-title" style="border:none;">
        <div class="title-name1">
          任务详情
        </div>
        <div class="" style="float:right;margin-right:47px;">
          <span v-if='justAssistTask==false'>

            <span>
               <el-button
                 size="small"
                 class='complete' @click='editorComment()' v-if='canUpdate==true'>编辑</el-button>
            </span>
            <span v-if='hadremind==false'>
              <span>
                 <el-button
                   size="small"
                  class='complete' v-if='canCancel==true' @click='cancle()'>取消</el-button>
              </span>
              <span>
                  <el-button
                    size="small"
                     class='complete' v-if='canUpdate==true&&taskStatus=="UNCOMPLETION"'   @click='delay(planEndDate)'>延期</el-button>
                </span>
                <span>
                    <el-button
                      size="small"
                      class='complete' v-if='canUpdate==true&&taskStatus=="UNCOMPLETION"' @click='levelChange()'>等级变更</el-button>
                  </span>
                  <span>
                      <el-button
                        size="small"
                        class='complete' v-if='canUpdate==true&&taskStatus=="UNCOMPLETION"' @click='levelComeplete()'>完成</el-button>
                  </span>
              </span>
              <span v-else>
                <el-button
                  size="small"
                  class='complete' @click='levelComeplete()'>确认完成</el-button>
                  <el-button
                    size="small"
                    class='complete' @click='unCompleteTask()'>未完成</el-button>
              </span>
          </span>
        </div>
      </div>
      <div class="notice-wrapper" style="border-left:none;border-right:none;">
        <div class="notice-left">
          任务重要等级：<span style='color:#D93437;'>{{gradeStr}}</span>

        </div>
        <div class="notice-mid">
          发布人：{{publisher}}

        </div>
        <div class="notice-mid1">
          到期时间：{{planEndDate}}

        </div>
        <div class="notice-right">
          任务状态：{{taskStatusStr}}

        </div>
        <div class="notice-left">
          任务类型：{{taskTypeStr}}
        </div>
        <div class="notice-mid">
          执行人：{{executor}}
        </div>
        <div class="notice-mid1">
          任务用时：{{taskUseTime}}
        </div>
        <div class="notice-right">
          完成状态：<span v-if='completed==true'>已完成</span><span v-else>未完成</span>

        </div>
        <div class="notice-left">
          关联项目：{{projectName}}

        </div>
        <div class="notice-mid">
          协助人：{{taskAssistNames}}

        </div>
        <div class="notice-mid1">
          更新时间：{{updateTimeStr}}

        </div>
        <div class="notice-right">

        </div>
        <div class="notice-left">
          任务标题：{{title}}

        </div>
        <div class="notice-mid">
          任务汇报对象：{{reporter}}
        </div>
        <div class="notice-mid1">

        </div>
        <div class="notice-right">

        </div>
        <div class="notice-left" style="width:100%;">
          任务内容：{{content}}
        </div>
      </div>
    </div>

    <div class="uncomplete-task" style="margin-top:20px;">
      <div class="user-title" style="border:none;">
        <div class="title-name1">
          任务回复
        </div>
      </div>
      <div class="notice-wrapper" style="border:none;">
        <div style="overflow:hidden;">
          <div class="" style="width:280px;margin-bottom:15px;margin-right:50px;float:left;">
            <el-input v-model="quicklyContent" placeholder="输入内容快捷回复"></el-input>
          </div>
          <div style="float:left;margin-top:3px;" v-if='quicklyContent'>
            <el-button size="small" @click='replyTask'>回复</el-button>
          </div>

        </div>
        <div class="notice-reback" v-for = 'item in taskReplys'>
          <div class="" style="overflow:hidden;">
            <div class="notice-reback-left">
              <span style="color:#d83436;cursor:pointer;">{{item.createUser.userName}}</span> 回复 <span style="color:#d83436;cursor:pointer;">{{item.replyUser.userName}}</span>： {{item.replyContent}}
            </div>
            <div class="notice-reback-right" @click='reply'>
              回复
            </div>
            <div class="notice-reback-mid">
              {{item.replyTimeDistanceDesc}}
            </div>
          </div>
          <div class="back-content-wrapper">
            <div class="back-content">
              <div class="content-left">
                对【{{item.createUser.userName}}】发表回复：
              </div>
              <div class="content-right">
                <textarea name="name" rows="8" cols="80"></textarea>
              </div>
            </div>
            <div class="" style="margin-top:10px;">
              <button type="button" name="button" class='back-button' @click='repleyTo(item.taskReplyId,$event)'>回复</button>
              <button type="button" name="button" class='back-button back-button1' @click='cancleTo'>取消</button>
            </div>
          </div>
        </div>
        <div v-if="taskReplys.length<=0" style="text-align: center;color:#5e7382;font-size: 14px">
          暂无任务回复
        </div>
      </div>
    </div>
    <div class="" v-if='lengthNull5'>
      <div class="seeMany" v-show='seeData5' @click='seeMany5'>
        查看更多
      </div>
      <div class="seeMany" v-show='!seeData5' @click='seeMuch5'>
        点击收起<img src="../../../images/ssemany.png" alt="" style='display:inline-block;margin-bottom:1px;'>
      </div>
    </div>

    <div class="uncomplete-task" style="margin-top:20px;border:none;">
      <div class="user-title" style="border: 1px solid rgba(0,0,0,0.12);border-bottom: none;box-sizing: border-box;">
        <div class="title-name1" style="">
          任务执行计划
        </div>
      </div>
      <div class="" v-for='item in takePlans'>
        <div class="notice-wrapper" style="border-bottom: 1px solid rgba(0,0,0,0.12);overflow: inherit;border-right: 1px solid rgba(0,0,0,0.12);border-left: 1px solid rgba(0,0,0,0.12);">
          <div class="week-title">
            {{item.witchWeeksStr}}（{{item.startDay}} 至 {{item.endDay}}）
          </div>
          <div class="" v-for='i in item.weeklyComments'>
            <div class="week-content week-content1" v-if="i.commentType=='PERSON'">
              <span>执行人：</span><span>{{i.comment}}</span><span>{{i.createDateDistanceDesc}}</span>
            </div>
            <div class="week-content week-content2" v-if="i.commentType=='DEPTHEADER'">
              <span>部门负责人：</span><span>{{i.comment}}</span><span>{{i.createDateDistanceDesc}}</span>
            </div>
            <div class="week-content week-content2" v-if="i.commentType=='SECOND_DEPTHEADER'">
              <span>上级部门负责人点评：</span><span>{{i.comment}}</span><span>{{i.createDateDistanceDesc}}</span>
            </div>
            <div class="week-content week-content3" v-if="i.commentType=='MANAGER'">
              <span>总经理：</span><span>{{i.comment}}</span><span>{{i.createDateDistanceDesc}}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if='takePlans.length<=0' style="text-align: center;height: 70px;font-size:14px;color:#5e7382;line-height: 70px;border: 1px solid rgba(0,0,0,0.12);">
        暂无任务执行计划
      </div>
    </div>
    <div class="" v-if='lengthNull'>
      <div class="seeMany" v-show='seeData' @click='seeMany'>
        查看更多
      </div>
      <div class="seeMany" v-show='!seeData' @click='seeMuch'>
        点击收起<img src="../../../images/ssemany.png" alt="" style='display:inline-block;margin-bottom:1px;'>
      </div>
    </div>

    <div class="uncomplete-task" style="margin-top:20px;border:none;">
      <div class="user-title" style="border: 1px solid rgba(0,0,0,0.12);border-bottom: none;box-sizing: border-box;">
        <div class="title-name1">
          任务评价
        </div>
      </div>
      <div class="" v-for='item in takeComment'>
        <div class="notice-wrapper" style="border-bottom: 1px solid rgba(0,0,0,0.12);overflow: inherit;border-right: 1px solid rgba(0,0,0,0.12);border-left: 1px solid rgba(0,0,0,0.12);">
          <div class="week-title">
            {{item.witchWeeksStr}}（{{item.startDay}} 至 {{item.endDay}}）
          </div>
          <div class="" v-for='i in item.weeklyComments'>
            <div class="week-content week-content1" v-if="i.commentType=='PERSON'">
              <span>执行人：</span><span>{{i.comment}}</span><span>{{i.createDateDistanceDesc}}</span>
            </div>
            <div class="week-content week-content2" v-if="i.commentType=='DEPTHEADER'">
              <span>部门负责人：</span><span>{{i.comment}}</span><span>{{i.createDateDistanceDesc}}</span>
            </div>
            <div class="week-content week-content2" v-if="i.commentType=='SECOND_DEPTHEADER'">
              <span>上级部门负责人点评：</span><span>{{i.comment}}</span><span>{{i.createDateDistanceDesc}}</span>
            </div>
            <div class="week-content week-content3" v-if="i.commentType=='MANAGER'">
              <span>总经理：</span><span>{{i.comment}}</span><span>{{i.createDateDistanceDesc}}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if='takeComment.length<=0' style="text-align: center;height: 70px;font-size:14px;color:#5e7382;line-height: 70px;border: 1px solid rgba(0,0,0,0.12);">
        暂无任务评价
      </div>
    </div>
    <div class="" v-if='lengthNull1'>
      <div class="seeMany" v-show='seeData1' @click='seeMany1'>
        查看更多
      </div>
      <div class="seeMany" v-show='!seeData1' @click='seeMuch1'>
        点击收起<img src="../../../images/ssemany.png" alt="" style='display:inline-block;margin-bottom:1px;'>
      </div>
    </div>
    <div class="record-wrapper">
      <div class="record-title">
        <div class="" style="margin-left:20px;">
          任务操作记录
        </div>
      </div>
      <div class="get-reward">
        <el-table
          :data="tableReward"
          style="width: 100%" empty-text='暂无数据'>
          <el-table-column
            prop="userName"
            label="姓名"
          >
            <template slot-scope="props">
              <!-- <router-link :to="{path:'/userDetail',  query:{id: props.row.userId}}"  > -->
                <span class="department-name" style="color:#D93538;">{{props.row.userName}}</span>
              <!-- </router-link> -->
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="时间"
          >
          </el-table-column>
          <el-table-column
            prop="changeName"
            label="操作名称"
          >
          </el-table-column>
          <el-table-column
            prop="changeContent"
            label="操作描述"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="">
      <!--取消任务模态窗-->
      <el-dialog
        title="申请取消任务"
        :visible.sync="dialogVisible1"
        size="tiny"
        :before-close="handleClose1" top='25%' class=" noticeManageModel">
        <el-form :model="ruleForm1" :rules="rules" ref="ruleForm1" label-width="112px" class="demo-ruleForm">
          <el-form-item label="取消原因：" prop="cause" required style="margin-right: 40px !important;">
            <el-input type="textarea" v-model="ruleForm1.cause"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <button  @click="resetForm1('ruleForm1')">取 消</button>
          <button  @click="submitForm1('ruleForm1')">确定</button>
        </span>
      </el-dialog>
    </div>
    <div class="">
      <!--延期任务模态窗-->
      <el-dialog
        title="申请任务延期"
        :visible.sync="dialogVisible2"
        size="tiny"
        :before-close="handleClose2" top='25%' class=" noticeManageModel">
        <el-form :model="ruleForm2" :rules="rules" ref="ruleForm2" label-width="112px" class="demo-ruleForm">
          <el-form-item label="延期时间:" required style="margin-right: 40px !important;height:36px;">
            <el-form-item prop="date1">
              <el-date-picker type="date" :picker-options="pickerOptions1" placeholder="选择日期" v-model="ruleForm2.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item label="延期原因：" prop="cause1" required style="margin-right: 40px !important;">
            <el-input type="textarea" v-model="ruleForm2.cause1"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <button  @click="resetForm2('ruleForm2')">取 消</button>
          <button  @click="submitForm2('ruleForm2')">确定</button>
        </span>
      </el-dialog>
    </div>
    <div class="">
      <el-dialog title="重设任务等级" :visible.sync="dialogVisible22" size="tiny" :before-close="handleClose22" top='10%' class="">
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
    <div class="">
      <!--发布任务模态窗-->
      <el-dialog title="编辑任务" :visible.sync="dialogVisible13" size="tiny" :before-close="handleClose13" top='10%' class="noticeManageModel">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="112px" class="demo-ruleForm">
          <el-form-item label="任务标题:" required prop="name13" style="margin-right: 40px !important;">
            <el-input v-model="ruleForm.name13"></el-input>
          </el-form-item>

          <el-form-item label="执行人:" required style="margin-right: 40px !important;" class="role-type">
            <el-input v-model="ruleForm.value15" :disabled="true"></el-input>
            <!-- <el-select v-model="ruleForm.value15" filterable placeholder="请选择执行人" style="width:100%;">
                <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId">
                </el-option>
              </el-select> -->
          </el-form-item>
          <el-form-item label="任务类型:" prop="value14" required style="margin-right: 40px !important;">
            <el-select v-model="ruleForm.value14" placeholder="请选择类型" style="width:100%;">
              <el-option v-for="item in optionType" :key="item.taskTypeId" :label="item.taskTypeName" :value="item.taskTypeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务汇报对象:" prop="telObj13" required style="margin-right: 40px !important;">
            <!-- <el-input v-model="ruleForm.telObj13" :disabled="true"></el-input> -->
            <el-select v-model="ruleForm.telObj13" filterable placeholder="请选择任务汇报对象" style="width:100%;">
              <el-option v-for="item in optionsObj" :key="item.userId" :label="item.userName" :value="item.userId">
              </el-option>
            </el-select>
            <!-- <el-input v-model="ruleForm.telObj"></el-input> -->
          </el-form-item>
          <el-form-item label="任务重要等级:"   required class="special1" style="margin-right: 40px !important;">
            <el-select v-model="ruleForm.value13" :disabled="true" placeholder="请选择任务等级" style="width:100%;">
              <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <i class="el-icon-information" style="float:left;margin-right: 40px !important;" @mouseenter="iconEnter" @mouseleave="iconLeave"></i>
            <div class="tip-information" ref="displayShow">
              <p>任务重要程度：</p>
              <p>公司重点任务，重要系数：4</p>
              <p>部门重点任务，重要系数：2</p>
              <p>个人重点任务，重要系数：1</p>
              <p>个人普通任务，重要系数：0.5</p>
              <!-- <p>个人重点任务有数量限制，所有重要任务中，只有20%为个人重点，超出部分要提示用户移除一个现有的个人重点任务</p> -->
            </div>
          </el-form-item>
          <el-form-item label="完成时间:"  required style="margin-right: 40px !important;height:36px;">
            <el-form-item prop="date13">
              <el-date-picker type="date" :disabled="true" :picker-options="pickerOptions0" placeholder="选择日期" v-model="ruleForm.date13" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-form-item>
          <!-- <el-form-item label="自动重复时间:" style="margin-right: 40px !important;">
              <el-select v-model="ruleForm.value16" placeholder="请选择自动回复时间" style="width:100%;" @change='choseTime13'>
                <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item> -->
          <el-form-item label="任务内容：" required prop="content13" style="margin-right: 40px !important;">
            <el-input type="textarea" v-model="ruleForm.content13"></el-input>
          </el-form-item>
          <div v-show="stretch">
            <div class="user-wrapper" style="line-height:32px;margin-bottom:13px;margin-left:21px;">
              <div class='user-left'>任务协助人：</div>
              <div style="float:left;" class='user-right-wrapper'>
                <div class='user-right' @click='adduser13'>添加协助人</div>
                <div class="user-item" v-for='(item,index) in brr13'>
                  <span>{{item.assistUserName}}（{{item.proportion}}%）</span>
                  <i class="el-icon-circle-close" @click="removeTodo13(index)"></i>
                </div>

              </div>
            </div>
            <el-form-item label="关联项目:" style="margin-right: 40px !important;">
              <el-select v-model="ruleForm.value17" placeholder="请选择关联项目" style="width:100%;">
                <el-option v-for="item in projects" :key="item.projectId" :label="item.projectName" :value="item.projectId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务可见范围:" style="margin-right: 40px !important;">
              <el-select  multiple v-model="ruleForm.value71" placeholder="请选择部门"  style="width:100%;">
                <el-option
                  v-for="item in depet"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId">
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
            <button  @click="resetForm13('ruleForm')">取 消</button>
            <button  @click="submitForm13('ruleForm')">编辑任务</button>
          </span>
      </el-dialog>
    </div>
    <div class="deleteDepartment">
      <el-dialog
        title="个人重点任务超出提醒"
        :visible.sync="dialogVisible11"
        size="tiny"
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
      <!--申请变更任务重要等级-->
      <el-dialog
        title="申请变更任务重要等级"
        :visible.sync="dialogVisible3"
        size="tiny"
        :before-close="handleClose3" top='25%' class=" noticeManageModel">
        <el-form :model="ruleForm3" :rules="rules" ref="ruleForm3" label-width="112px" class="demo-ruleForm">
          <el-form-item label="任务重要等级:" prop="value3" required  style="margin-right: 40px !important;">
            <el-select v-model="ruleForm3.value3" placeholder="请选择任务等级"  style="width:100%;" @change='choseLevel3'>
             <el-option
               v-for="item in options1"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
           </el-select>
          </el-form-item>
          <el-form-item label="变更原因：" prop="cause3" required style="margin-right: 40px !important;">
            <el-input type="textarea" v-model="ruleForm3.cause3"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <button  @click="resetForm3('ruleForm3')">取 消</button>
          <button  @click="submitForm3('ruleForm3')">确定</button>
        </span>
      </el-dialog>
    </div>
    <div class="">
      <!--添加协助人-->
      <el-dialog title="添加协助人" :visible.sync="dialogVisible25" size="tiny" :before-close="handleClose25" top='25%' class=" noticeManageModel">
        <el-form :model="ruleForm25" :rules="rules" ref="ruleForm25" label-width="112px" class="demo-ruleForm">
          <el-form-item label="姓名:" prop="username" style="margin-right: 40px !important;">
            <!-- <el-select v-model="ruleForm5.username" placeholder="请选择协助人" style="width:100%;" @click='choseUsers2'>
                 <el-option
                   v-for="item in users"
                   :key="item.userId"
                   :label="item.userName"
                   :value="item.userId">
                 </el-option>
               </el-select> -->
            <el-select v-model="ruleForm25.username" filterable placeholder="请选择协助人" style="width:100%;">
              <el-option v-for="item in usersT" :key="item.userId" :label="item.userName" :value="item.userId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="占比:" prop="percent1" style="margin-right: 80px !important;" class='addPercent'>
            <el-input v-model.number="ruleForm25.percent1"></el-input><span>%</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <button  @click="resetForm25('ruleForm25')">取 消</button>
            <button  @click="submitForm25('ruleForm25')">确定</button>
          </span>
      </el-dialog>
    </div>
    <div class="">
      <!--完成任务-->
      <el-dialog
        title="完成任务"
        :visible.sync="dialogVisible4"
        size="tiny"
        :before-close="handleClose4" top='25%' class=" noticeManageModel">
        <el-form :model="ruleForm4" :rules="rules" ref="ruleForm4" label-width="112px" class="demo-ruleForm">
          <el-form-item label="自我评价：" prop="cause4" required style="margin-right: 40px !important;">
            <el-input type="textarea" v-model="ruleForm4.cause4"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <button  @click="resetForm4('ruleForm4')">取 消</button>
          <button  @click="submitForm4('ruleForm4')">确定</button>
        </span>
      </el-dialog>
    </div>
  </div>
  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
  import bus from '../../../assets/eventBus'
  import { quillEditor } from 'vue-quill-editor';
  import {  getTaskGroupDetail,resetTaskRemindFlag,listByExecutor,getTaskType,listReportingUsers,listAllUsers,userTaskReply,sureEditorTask,departmentList,getProjectList,editorTaskMain,getUsersObj,replyTaskReply,impChangeOrdTask,cancelTaskCause,delayTaskCause,changeTaskLevel,completeTask } from 'service/getData'
//  import Tab from 'components/common/tab'
  import {ERR_OK} from 'service/config'
  export default {
    data() {
      //    占比正则
      var checkPecent = (rule, value, callback) => {
        if (!value) {
          return callback();
        }else{
          var reg = /(^(([1-9][0-9]*)|((([1-9][0-9]*)|0)\.[0-9]{1,2}))$)/;
          if (!reg.test(value)||value>=100) {
            callback(new Error('请输入有效的占比'));
          } else {
            if (value.length > 20) {
              callback(new Error('数值不能超过20个字符'));
            } else {
              callback();
            }
          }
        }
      };
      return {
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        pickerOptions1: {
        },
        isActive:true,
        isActive1:false,
        activeName:false,
        stretch: false,
        quicklyContent:'',
        msg: "展开更多选项",
        hello:false,
        updateTimeStr:'',
        taskAssistNames:'',
        reporter:'',
        projectName:'',
        taskStatusStr:'',
        takePlans:[],
        takePlans1:[],
        usersT:[],
        brr13:[],
        addUsers13:[],
        addUsers131:[],
        tableReward:[],
        optionType:[],
        optionsObj:[],
        dialogVisible13:false,
        content:'',
        lengthNull:true,
        lengthNull1:true,
        taskStatus:'UNCOMPLETION',
        taskUseTime:'',
        title:'',
        seeData:true,
        seeData1:true,
        planEndDate:'',
        taskTypeStr:'',
        gradeStr:'',
        publisher:'',
        executor:'',
        id:'',
        replyDesc:'',
        takeComment:[],
        takeComment1:[],
        Taskoptions:[],
        checkedCities:[],
        checkedKey:[],
        checkedValue: [],
        projects:[],
        depet:[],
        taskNumber:'',
        lengthNull5:false,
        taskReplys1:[],
        seeData5:true,
        executor31:1,
        canUpdate:false,
        hadremind:false,
        canCancel:false,
        dialogVisible1:false,
        dialogVisible2:false,
        dialogVisible3:false,
        dialogVisible4:false,
        dialogVisible11:false,
        dialogVisible22:false,
        dialogVisible25:false,
        justAssistTask:false,
        completed:true,
        taskReplys:[],
        ruleForm25: {
          username: '',
          percent1: '',
        },
        isA:false,
        ruleForm: {
          name: '',
          name13: '',
          rateMine: '',
          date1: '',
          date2: '',
          date13: '',
          dateM: '',
          region1: '',
          region: '',
          content: '',
          region: '',
          taskChangeId: '',
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
          value71: [],
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
        ruleForm1: {
          cause: ''
        },
        ruleForm2: {
          cause: '',
          date1: '',
        },
        ruleForm3: {
          value3: '',
          cause3: '',
        },
        ruleForm4: {
          cause4: '',
        },
        ruleForm5: {
          username: '',
          percent:'',
        },
        rules: {
          name: [
            { required: true, message: '请输入任务标题'},
            {max: 50, message: '任务标题不能超过50个字符'}
          ],
          name13: [
            { required: true, message: '请输入任务标题'},
            {max: 50, message: '任务标题不能超过50个字符'}
          ],
          username: [
            { required: true, message: '请填写姓名', type:'number' }
          ],
          percent: [
            { required: true, message: '请填写占比' },
            { validator: checkPecent }
          ],
          percent1: [
            { required: true, message: '请填写占比' },
            { validator: checkPecent }
          ],
          cause: [
            { required: true, message: '请输入取消原因' },
            {max: 200, message: '取消原因不能超过200个字符'}
          ],
          cause1: [
            { required: true, message: '请输入延期原因' },
            {max: 200, message: '延期原因不能超过200个字符'}
          ],
          cause3: [
            { required: true, message: '请输入变更原因' },
            {max: 200, message: '变更原因不能超过200个字符'}
          ],
          cause4: [
            { required: true, message: '请输入自我评价' },
            {max: 200, message: '自我评价不能超过200个字符'}
          ],
          region1: [
            { required: true, message: '请选择关联项目' },
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期' }
          ],
          region: [
            { required: true, message: '请选择活动区域' }
          ],
          value14: [{
            required: true,
            message: '请选择任务类型',
            type: 'number'
          }, ],
          value15: [{
            required: true,
            message: '请选择任务执行人',
            type: 'number'
          }, ],
          telObj13: [{
            required: true,
            message: '请选择任务汇报对象',
          }, ],
          value13: [{
            required: true,
            message: '请选择任务重要等级',
          }, ],
          // date13: [{
          //   type: 'date',
          //   required: true,
          //   message: '请选择日期'
          // }],
          content: [
            { required: true, message: '请输入任务内容' },
            {max: 200, message: '任务内容不能超过200个字符'}
          ],
          content13: [
            { required: true, message: '请输入任务内容' },
            {max: 200, message: '任务内容不能超过200个字符'}
          ],
          value3: [
            { required: true, message: '请选择任务重要等级' },
          ],
          value4: [
            { required: true, message: '请选择任务类型', type:'number' },
          ],
          value5: [
            { required: true, message: '请选择任务执行人', type:'number' },
          ],
          value6: [
            { required: true, message: '请',  },
          ],
          value7: [
            { required: true, message: '请输入公告内容' },
          ],
        },
        options1: [
          {
           value: '',
           label: '请选择重要等级'
         }, {
         value: 'COMPANY',
         label: '公司重点'
       }, {
         value: 'DEPARTMENT',
         label: '部门重点'
       }, {
        value: 'PERSONALIMP',
         label: '个人重点'
       }, {
         value: 'PERSONALORD',
         label: '个人普通'
       }
       ],
        editorOption: {
          theme: 'snow',
          placeholder: "请填写评论",
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['link'],
            ]
          }
        },
        tableData: [{
           date: '2017年08月14日例会纪要：3天内跟贴',
           name: '2016-05-04 08:36',
           money:'公告提醒',
         }, {
           date: '2017年08月14日例会纪要：3天内跟贴',
           name: '2016-05-04 08:36',
           money:'公告提醒',
         }, {
           date: '2017年08月14日例会纪要：3天内跟贴',
           name: '2016-05-04 08:36',
           money:'公告提醒',
         }, {
           date: '2017年08月14日例会纪要：3天内跟贴',
           name: '2016-05-04 08:36',
           money:'公告提醒',
         }],
      };
    },
    components: {
      quillEditor,
//      Tab
    },
    mounted(){
      this.getData()
      //this.getTaskType1()
      //this.getUsersObj1()
      this.getProjectList1()
      this.departmentList1()
      this.listAllUsersT()
      window.scrollTo(0, 0);
    },
    created () {
      this.id = this.$route.query.id
    },
    methods: {
      unCompleteTask(){
          const params = {
            taskId:this.id
          }
          var self = this
          resetTaskRemindFlag(params).then((res) => {
            if (res.code == ERR_OK) {
              self.getData()
              this.$notify({
                title: '成功',
                message: res.msg,
                type: 'success'
              });
            } else {
              this.$notify.error({
                title: '错误',
                message: res.msg
              });
            }
          })

      },
      replyTask(){
        let self = this
        const params = {
          taskId: this.id,
          replyDesc: this.quicklyContent
        }
        if(this.quicklyContent.trim().length > 200) {
          self.$notify({
          title: '提示',
          message:'回复内容不能超过200个字符！'
          });
        }else{
          userTaskReply(params).then((res) => {
            if (res.code == ERR_OK) {
              self.getData()
              self.quicklyContent = ''
              self.$notify({
                title: '成功',
                message: '恭喜你，回复成功',
                type: 'success'
              });
            }else{
              self.$notify.error({
                title: '错误',
                message: res.msg
              });
            }
          })
        }
      },
      removeTodo13(index) {
        this.brr13.splice(index, 1);
        //this.addUsers13.splice(index, 1);
      },
      handleClose13() {
        this.dialogVisible13 = false
        this.$refs['ruleForm'].resetFields();
      },
      submitForm13(formName) {
        let self = this
        var value71 = this.ruleForm.value71.join(',')
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // let d = new Date(self.ruleForm.date13)
            // let time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
            const params = {
              taskId: self.id,
              title: self.ruleForm.name13,
              taskTypeId: self.ruleForm.value14,
              //planEndDate: time,
              reportId:self.ruleForm.telObj13,
              projectId: self.ruleForm.value17,
              //grade: self.ruleForm.value13,
              ptaskAssists: JSON.stringify(self.brr13),
              visibleRange:value71,
              content: self.ruleForm.content13
            }
            sureEditorTask(params).then((res) => {
              if (res.code == ERR_OK) {
                self.dialogVisible13 = false
                self.$refs[formName].resetFields()
                self.getData()
                self.$notify({
                  title: '成功',
                  message: '编辑任务成功',
                  type: 'success'
                });
              } else if (res.code == 'exceedPersonal') {
                self.dialogVisible11 = true
                self.taskNumber = res.data.length
                self.Taskoptions = res.data
              } else {
                self.$notify.error({
                  title: '错误',
                  message: res.msg
                });
              }
            })
          } else {
            return false;
          }
        })
      },
      resetForm13(formName) {
        this.dialogVisible13 = false
        this.$refs[formName].resetFields();
      },
      // 协助人
      listAllUsersT() {
        listAllUsers().then((res) => {
          if (res.code == ERR_OK) {
            this.usersT = res.data
          }
        })
      },
      // 添加协助人模态框
      handleClose25(done) {
        this.dialogVisible25 = false
        this.$refs['ruleForm25'].resetFields();
      },
      // 添加协助人模态框
      submitForm25(formName1) {
        let self = this
        this.$refs[formName1].validate((valid) => {
          if (valid) {
            if (self.ruleForm25.username === self.executor31) {
              self.$notify.error({
                title: '错误',
                message: '执行人和协助人不能相同',
              });
              return
            }
            if (self.addUsers13.length > 0) {
              for (let item of self.addUsers13) {
                if (item.assistUserId === self.ruleForm25.username) {
                  self.$notify.error({
                    title: '错误',
                    message: '不能选择相同的协助人',
                  });
                  return
                }
              }
            }
            self.dialogVisible25 = false
            self.addUsers131 = []
            let obj = {
              assistUserId: self.ruleForm25.username,
              proportion: self.ruleForm25.percent1
            }
            self.addUsers131.push(obj)
            for (var i = 0; i < self.usersT.length; i++) {
              for (var j = 0; j < self.addUsers131.length; j++) {
                if (self.usersT[i].userId === self.addUsers131[j].assistUserId) {
                  self.brr13.push({
                    assistUserName: self.usersT[i].userName,
                    assistUserId: self.addUsers131[j].assistUserId,
                    proportion: self.addUsers131[j].proportion
                  })
                }
              }
            }
            //console.log(self.brr13.username)
          } else {
            return false;
          }
        });
      },
      // 添加协助人模态框
      resetForm25(formName1) {
        this.dialogVisible25 = false
        this.$refs[formName1].resetFields();
      },
      // 点击添加协助人
      adduser13() {
        this.dialogVisible25 = true
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
      // 回选编辑任务
      editorComment() {
        this.dialogVisible13 = true
        // this.getUsersObj1()
        // this.getTaskType1()
        // this.getProjectList1()
        // this.listAllUsers1()
        const params = {
          taskId: this.id
        }
        //this.addUsers13 = []
        this.addUsers131 = []
        editorTaskMain(params).then((res) => {
          if (res.code == ERR_OK) {
            this.ruleForm.name13 = res.data.title
            this.ruleForm.value15 = res.data.executor.userName
            this.executor31 = res.data.executor.userId
            this.getUsersObj1(res.data.executor.userId)
            this._listByExecutor(res.data.executor.userId,res.data.taskTypeId)
            var crr = []
            for (var i = 0; i < res.data.taskAssists.length; i++) {
              crr.push({
                assistUserName: '',
                proportion: '',
                assistUserId: ''
              })
            }
            for (var i = 0; i < res.data.taskAssists.length; i++) {
              crr[i].assistUserName = res.data.taskAssists[i].assistUserName
              crr[i].proportion = res.data.taskAssists[i].proportion
              crr[i].assistUserId = res.data.taskAssists[i].assistUserId
            }
              //console.log(crr)
            if(res.data.visibleRange===''){
              this.ruleForm.value71 = []
            }else if(res.data.visibleRange.indexOf(',')<0){
              this.ruleForm.value71 = JSON.parse('['+parseInt(res.data.visibleRange)+']')
            }else{
              this.ruleForm.value71 = JSON.parse('[' + String(res.data.visibleRange.split(',')) + ']')
              //console.log(this.ruleForm.value71)
            }
            this.brr13 = crr
            this.addUsers13 = crr
            //console.log(this.addUsers13)
            //this.brr13 = res.data.taskAssists
            this.ruleForm.telObj13 = res.data.reporter.userId
            this.ruleForm.value17 = res.data.projectId
            this.ruleForm.value13 = res.data.grade
            this.ruleForm.date13 = res.data.planEndDate
            this.ruleForm.content13 = res.data.content
          }
        })
      },
      // 获取关联项目
      getProjectList1() {
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
      //      则面板
      Collapse() {
        this.stretch = !this.stretch
        if (this.stretch) {
          this.msg = "收起更多选项"
        } else {
          this.msg = "展开更多选项"
        }
      },
      iconEnter() {
        this.$refs.displayShow.style.display = 'block'
      },
      iconLeave() {
        this.$refs.displayShow.style.display = 'none'
      },
      //获取汇报对象
      getUsersObj1(userId) {
        const params = {
          userId:userId
        }
        listReportingUsers(params).then((res) => {
          if (res.code == ERR_OK) {
            this.optionsObj = res.data
          }
        })
      },
      _listByExecutor(userId,val){
        let self = this
        const params = {
          userId:userId
        }
        listByExecutor(params).then((res) => {
          if(res.code == ERR_OK) {
            this.ruleForm.value14 = ''
            this.optionType = res.data
            this.optionType.unshift({
              taskTypeId:'',
              taskTypeName: '请选择任务类型'
            })
            this.ruleForm.value14 = val
          }else{
            this.ruleForm.value14 = ''
            this.ruleForm.value14 = val
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
      handleCheckedCitiesChange(val) {
        this.checkedValue = val
      },
      handleClose22(done) {
        this.dialogVisible22 = false
        this.dialogVisible11 = false
      },
      checkDelete(){
        this.dialogVisible22 = false
        //this.dialogVisible11 = false
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
              this.$notify.error({
                title: '错误',
                message: res.msg
              });
            }
          })
        }else{
          this.$notify({
           title: '提示',
           message: '请选择要降为个人普通等级的任务',
         });
        }

      },
      handleClose11(){
        this.dialogVisible11 = false
      },
      seeMany(){
        this.seeData=!this.seeData
        this.takePlans = this.takePlans1
        //console.log(this.takePlans1)
      },
      seeMuch(){
        this.seeData=!this.seeData
        this.takePlans = []
        this.takePlans.push(this.takePlans1[0])
      },
      seeMany1(){
        this.seeData1=!this.seeData1
        this.takeComment = this.takeComment1
        //console.log(this.takePlans1)
      },
      seeMuch1(){
        this.seeData1=!this.seeData1
        this.takeComment = []
        this.takeComment.push(this.takeComment1[0])
      },
      seeMany5(){
        this.seeData5=!this.seeData5
        this.taskReplys = this.taskReplys1
      },
      seeMuch5(){
        this.seeData5=!this.seeData5
        this.taskReplys = []
        this.taskReplys = this.taskReplys1.slice(0,5)
      },
      cancleTo (event){
        let el = event.target
        el.parentNode.parentNode.style.display = 'none'
        el.parentNode.parentNode.parentNode.childNodes[0].childNodes[2].style.display = 'block'
      },
      repleyTo(val,event){
        let el = event.target
        let replyDesc = el.parentNode.parentNode.childNodes[0].childNodes[2].childNodes[0].value
        let self = this
        const params ={
          taskId:self.id,
          taskReplyId:val,
          replyDesc:replyDesc
        }
        if(replyDesc.trim().length>200){
          this.$notify({
          title: '提示',
          message:'回复内容不能超过200个字符'
          });
        }else if (replyDesc.trim().length<=0) {
          this.$notify({
          title: '提示',
          message:'回复内容不能为空！'
          });
        }else{
          replyTaskReply(params).then((res) => {
            if(res.code == ERR_OK) {
              el.parentNode.parentNode.style.display = 'none'
              el.parentNode.parentNode.parentNode.childNodes[0].childNodes[2].style.display = 'block'
              self.getData()
              self.$notify({
                title: '成功',
                message: '回复成功',
                type: 'success'
              });
            }else{
              self.$notify.error({
                title: '错误',
                message: res.msg
              });
            }
         })
        }
      },
      reply (event) {
        let el = event.target.parentNode.parentNode.childNodes[2]
        let el1 = event.target
        el.childNodes[0].childNodes[2].childNodes[0].value = ''
        el1.style.display = 'none'
        el.style.display = 'block'
      },
      levelComeplete () {
        this.dialogVisible4 = true
      },
      handleClose4(done) {
        this.dialogVisible4 = false
        this.$refs['ruleForm4'].resetFields();
      },
      submitForm4(formName1) {
        let self = this
        this.$refs[formName1].validate((valid) => {
          if (valid) {
            const params = {
              taskId:self.id,
              comment:self.ruleForm4.cause4
            }
            completeTask(params).then((res) => {
              if(res.code == ERR_OK) {
                self.dialogVisible4 = false
                self.$refs[formName1].resetFields()
                self.getData()
                self.$notify({
                  title: '成功',
                  message: '完成任务已发送',
                  type: 'success'
                });
              }else{
                self.$notify.error({
                  title: '错误',
                  message: res.msg
                });
              }
           })
          } else {
            return false;
          }
        });
      },
      resetForm4(formName1) {
        this.dialogVisible4= false
        this.$refs[formName1].resetFields();
      },
      levelChange () {
        this.dialogVisible3 = true
      },
      choseLevel3(val){
        this.ruleForm3.value3 = val
      },
      handleClose3(done) {
        this.dialogVisible3 = false
        this.$refs['ruleForm3'].resetFields();
      },
      submitForm3(formName1) {
        let self = this
        this.$refs[formName1].validate((valid) => {
          if (valid) {
            const params = {
              taskId:self.id,
              grade:self.ruleForm3.value3,
              reason:self.ruleForm3.cause3
            }
            changeTaskLevel(params).then((res) => {
              if(res.code == ERR_OK) {
                self.dialogVisible3 = false
                self.$refs[formName1].resetFields()
                self.getData()
                self.$notify({
                  title: '成功',
                  message: '申请变更任务重要等级已发送',
                  type: 'success'
                });
              }else if(res.code == 'exceedPersonal'){
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
          } else {
            return false;
          }
        });
      },
      resetForm3(formName1) {
        this.dialogVisible3 = false
        this.$refs[formName1].resetFields();
      },
      delay (key) {
        this.dialogVisible2 = true
        var date = new Date(Date.parse(key.replace(/-/g, "/")))
        date = date.getTime()
        this.pickerOptions1 = {
          disabledDate(time) {
            return time.getTime() - 8.64e7 < date;
          }
        }
      },
      handleClose2(done) {
        this.dialogVisible2 = false
        this.$refs['ruleForm2'].resetFields();
      },
      submitForm2(formName1) {
        let self = this
        //console.log(self.ruleForm2.date1)
        let d = new Date(self.ruleForm2.date1)
        let time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
        this.$refs[formName1].validate((valid) => {
          if (valid) {
            const params = {
              taskId:self.id,
              reason:self.ruleForm2.cause1,
              delayDate:time
            }
            delayTaskCause(params).then((res) => {
              if(res.code == ERR_OK) {
                self.dialogVisible2 = false
                self.$refs[formName1].resetFields()
                self.getData()
                self.$notify({
                  title: '成功',
                  message: '申请任务延期已发送',
                  type: 'success'
                });
              }else{
                self.$notify.error({
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
      cancle () {
        this.dialogVisible1 = true
      },
      handleClose1(done) {
        this.dialogVisible1 = false
        this.$refs['ruleForm1'].resetFields();
      },
      submitForm1(formName1) {
        let self = this
        this.$refs[formName1].validate((valid) => {
          if (valid) {
            const params = {
              taskId:self.id,
              reason:self.ruleForm1.cause
            }
            cancelTaskCause(params).then((res) => {
              if(res.code == ERR_OK) {
                self.dialogVisible1 = false
                self.$refs[formName1].resetFields()
                self.getData()
                self.$notify({
                  title: '成功',
                  message: '申请取消原因已发送',
                  type: 'success'
                });
              }else{
                self.$notify.error({
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
      resetForm1(formName1) {
        this.dialogVisible1 = false
        this.$refs[formName1].resetFields();
      },
      getData(){
        let params = {
          taskId:this.id
        }
        getTaskGroupDetail(params).then((res) => {
          if(res.code == ERR_OK) {
            this.content = res.data.content
            this.taskAssistNames = res.data.taskAssistNames
            this.planEndDate = res.data.planEndDate
            this.title = res.data.title
            this.taskUseTime = res.data.taskUseTime
            this.gradeStr = res.data.gradeStr
            this.updateTimeStr = res.data.updateTimeStr
            this.taskTypeStr = res.data.taskTypeStr
            this.publisher= res.data.publisher.userName
            this.canUpdate = res.data.canUpdate
            this.hadremind = res.data.hadremind
            this.canCancel = res.data.canCancel
            this.executor = res.data.executor.userName
            this.completed = res.data.completed
            this.taskStatus = res.data.taskStatus
            this.projectName = res.data.projectName
            this.justAssistTask = res.data.justAssistTask
            this.tableReward = res.data.taskChangeLogVos
            //console.log(this.justAssistTask)
            this.taskStatusStr = res.data.taskStatusStr
            if(!(!res.data.reporter && typeof(res.data.reporter)!="undefined" && res.data.reporter!=0)){
              this.reporter = res.data.reporter.userName
            }else{
              this.reporter = ''
            }
            if(!(!res.data.taskReplys && typeof(res.data.taskReplys)!="undefined" && res.data.taskReplys!=0)){
              this.taskReplys1 = []
              this.taskReplys = []
              this.taskReplys1 = res.data.taskReplys
              if(res.data.taskReplys.length>5){
                this.taskReplys = this.taskReplys1.slice(0,5)
                this.lengthNull5 = true
              }else{
                this.taskReplys = this.taskReplys1
                this.lengthNull5 = false
              }
            }else{
              this.taskReplys = []
              this.lengthNull5 = false
            }
            if(!(!res.data.taskWeeklyPlans && typeof(res.data.taskWeeklyPlans)!="undefined" && res.data.taskWeeklyPlans!=0)){
              this.takePlans1 = []
              this.takePlans = []
              this.takePlans1 = res.data.taskWeeklyPlans
              this.takePlans.push(this.takePlans1[0])
              this.lengthNull = true
            }else{
              this.takePlans = []
              this.lengthNull = false
            }
            if(!(!res.data.taskWeeklyComments && typeof(res.data.taskWeeklyComments)!="undefined" && res.data.taskWeeklyComments!=0)){
              this.takeComment1 = []
              this.takeComment = []
              this.takeComment1 = res.data.taskWeeklyComments
              this.takeComment.push(this.takeComment1[0])
              this.lengthNull1 = true
            }else{
              this.takeComment = []
              this.lengthNull1 = false
            }
          }
       })
      }
    },
    watch: {
      '$route' (to, from) {
        // 获取最新的id 调用获取数据方法
        if(to.query.id && to.path=="/taskDetail"){
          this.id = this.$route.query.id
          this.getData()
          bus.$emit('tabChange','SUCCESS')
        }
      }
    }
  };
</script>
<style type="text/ecmascript-6">
  .uncomplete-task{
    border: 1px solid rgba(0,0,0,0.12);
    overflow: hidden;
    
    margin: 0px auto;
    background: #fff;

  }
  .user-title{
    opacity: 0.99;
    background: rgba(217,52,55,0.10);
    height: 46px;
    line-height: 46px;
    width: 100%;
    font-size: 14px;
  }
  .title-name1{
    float: left;
    width:84px;
    height:46px;
    cursor: pointer;
    box-sizing: border-box;
    color: #333333;
    text-align: left;
    margin-left: 20px;
  }
  .notice-wrapper{
    font-size: 12px;
    color: #434343;
    padding: 17.5px 20px;
    /*overflow: hidden;*/
  }
  .notice-left,.notice-mid,.notice-mid1,.notice-right{
    float: left;
    line-height: 27px;
    height: 27px;
  }
  .notice-left{
    width: 315px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .notice-mid{
      width: 300px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
  }
  .notice-mid1{
      width: 284px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
  }
  .notice-mid span{
    color: #D93437;
  }
  .notice-reback-left,.notice-reback-mid,.notice-reback-right{
    line-height: 24px;


  }
  .notice-reback-left{
  }
  .notice-reback-mid{
    width: 86px;
    color: #999999;
    margin-left: 40px;
    float: right;
  }
  .notice-reback-right{
    color: #D93538;
    cursor: pointer;
    float: right;
  }
  .notice-reback{
    width: 100%;
    /*padding: 7.5px 0;*/
    overflow: hidden;
    border-bottom: 1px solid #F5F3F1;
    margin-bottom: 5px;
    padding-bottom: 2px;
  }
  .notice-reback:last-child{
    border-bottom: none;
  }
  .seeMany{
    height: 30px;
    line-height: 30px;
    margin-top: 4px;
    font-size: 12px;
    color: #434343;
    text-align: center;
    cursor: pointer;
    background: #FFFFFF;
    border: 1px solid rgba(0,0,0,0.12);
  }
  .week-content{
    font-size: 12px;
    color: #000000;
  }
  .week-content1{
    line-height: 17px;
    margin: 15px 0;
  }
  .week-content2{
    line-height: 17px;
  }
  .week-content3{
    line-height: 17px;
    margin: 12.5px 0;
  }
  .week-content span:first-child{
    font-weight: bold;

  }
  .week-content span:last-child{
    font-size: 12px;
    color: #999999;
    margin-left: 40px;
  }
  .back-content-wrapper{
    overflow: hidden;
    display: none;
    margin-bottom: 10px;
  }
  .back-content{
    width: 1123px;
    height: 80px;
    background: #F4F4FE;
    margin-top: 7.5px;
    padding-top:12px;
    padding-left: 20px;
    /*padding-right: 24px;*/
    padding-bottom: 12px;
    border: 1px solid rgba(0,0,0,0.12);
  }
  .content-left{
    float: left;
  }
    .content-right{
      float: left;
      width: 844px;
    }
    .content-right textarea{
      width: 100%;
      height: 75px;
      font-size: 12px;
      /*background-color: transparent;*/
      color: #434343;
    }
  .back-button{
    background: #fff;
    height: 30px;
    width: 65px;
    text-align: center;
    line-height: 30px;
    border: 1px solid #D93538;
    border-radius: 4px;
    font-size: 12px;
    color: #D93538;
    cursor: pointer;
  }
    .back-button1{
      border: 1px solid #838383;
      color: #838383;
      margin-left: 20px;
    }
    .record-title{
      margin-top: 20px;
      font-size: 14px;
      color: #434343;
      width: 100%;
      height: 46px;
      opacity: 0.99;
      background: #FBEBEB;
      line-height: 46px;
      border: 1px solid rgba(0,0,0,0.12);
      border-bottom: none;
    }
    special1 {
      position: relative;
    }

    .special1 .el-icon-information {
      position: absolute;
      right: -61px;
      top: 11px;
    }

    .special1 .addTaskType {
      position: absolute;
      right: -91px;
      top: 55px;
      width: 80px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 12px;
      color: #D93437;
      border: 1px solid #D83436;
      border-radius: 4px;
      cursor: pointer;
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
      background: rgba(0, 0, 0, 0.80);
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

    .user-item span {
      width: 95px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
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

    .addPercent {
      position: relative;
    }

    .addPercent span {
      position: absolute;
      right: -25px;
    }

    .record-title {
      margin-top: 20px;
      font-size: 14px;
      color: #434343;
      width: 100%;
      height: 46px;
      opacity: 0.99;
      background: #FBEBEB;
      line-height: 46px;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-bottom: none;
    }
</style>
