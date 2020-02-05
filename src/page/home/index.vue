<template>
    <div class="wrapper">
        <el-row :gutter="20">
            <el-col :span="16" v-if="userView != 'STAFF'">
                <div class="take-top-wrapper m-t-10">
                    <div class="take-left">
                        <div class="take-top" style="font-size: 14px;font-weight:normal">快速审核</div>
                    </div>
                </div>
                <div class="index-card">
                    <div class="index-card-item" @click="linkTask">
                        <div class="index-card-item-title">待处理任务</div>
                        <p class="index-card-item-number">{{taskTotal || 0}}</p>
                    </div>
                    <div class="index-card-item" @click="linkPlan">
                        <div class="index-card-item-title">待处理计划</div>
                        <p class="index-card-item-number">{{planTotal || 0}}</p>
                    </div>
                    <div class="index-card-item" @click="linkSummary">
                        <div class="index-card-item-title">待处理总结</div>
                        <p class="index-card-item-number">{{summaryTotal || 0}}</p>
                    </div>
                    
                </div>
            </el-col>
            <el-col
                :span="userView != 'STAFF' ? 8 : 24"
                :class="{'staff-box': userView == 'STAFF'}"
                v-if="(userView == 'STAFF' && !isAddPlanPersonal && !isAddSummaryPersonal) || (userView == 'DEPT') || (userView == 'MANAGER')">
                <div class="take-top-wrapper m-t-10">
                    <div class="take-left">
                        <div class="take-top" style="font-size: 14px;font-weight:normal">快捷操作</div>
                    </div>
                </div>
                
                <div class="index-card">
                    <div class="index-card-btn" @click="addTask" v-if="userView != 'STAFF'">
                        <img class="index-card-btn-icon" src="../../images/icon_index_rw.png" alt="">
                        <p class="index-card-btn-txt">发起任务</p>
                    </div>
                    <div class="index-card-btn" @click="addPlan" v-if="(userView == 'STAFF' && !isAddPlanPersonal) || (userView == 'DEPT')">
                        <img class="index-card-btn-icon" src="../../images/icon_index_jh.png" alt="">
                        <p class="index-card-btn-txt">发起个人计划</p>
                    </div>
                    <div class="index-card-btn" @click="addSummary" v-if="(userView == 'STAFF' && !isAddSummaryPersonal) || (userView == 'DEPT')">
                        <img class="index-card-btn-icon" src="../../images/icon_index_zj.png" alt="">
                        <p class="index-card-btn-txt">发起个人总结</p>
                    </div>
                </div>
            </el-col>
        </el-row>
        <!-- 员工任务待处理 -->
        <div v-if="userView == 'STAFF'">
            <div class="take-top-wrapper m-t-10">
                <div class="take-left">
                    <div class="take-top" style="font-size: 14px;font-weight:normal">正在进行的任务</div>
                </div>
                <div class="take-right" @click="addTask">发起任务</div>
            </div>
            <el-table
                :data="result1"
                row-key="id"
                @row-click="openDetails"
                style="width: 100%"
                empty-text="暂无数据">
                <el-table-column label="任务标题" prop="title ">
                    <template slot-scope="props">
                        <router-link :to="{path: '/taskManage/taskDetail', query: { id: props.row.id }}" @click.stop="" style="color:#505363;">
                            <div>{{ props.row.title }}-{{ props.row.executorName }}</div>
                        </router-link>
                        <div>
                            <div class="title-right">
                                {{ props.row.taskTypeName }}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="最新动态">
                    <template slot-scope="props">
                        <div class="" v-if="props.row.taskReplyList && props.row.taskReplyList.length > 0">
                            <div v-if='props.row.taskReplyList[0].replyStatus=="UNREAD"' style="color:rgb(217, 52, 55)">
                                <span>{{ props.row.taskReplyList[0].replyUser.userName}}：</span><span>{{ props.row.taskReplyList[0].replyContent}}</span>
                            </div>
                            <div v-if='props.row.taskReplyList[0].replyStatus=="READED"'>
                                <span>{{ props.row.taskReplyList[0].replyUser.userName}}：</span><span>{{ props.row.taskReplyList[0].replyContent}}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                
                <el-table-column label="本月目标">
                    <template slot-scope="props">
                        <span>{{ props.row.taskGoal }}</span>
                    </template>
                </el-table-column>
                
                <el-table-column
                    label="任务状态"
                    min-width="50">
                    <template slot-scope="props">
                        <div>
                            <img class="icon_type" v-if="props.row.taskStatus === 'APPROVEPASS'" src="../../images/timeLate.png" alt=""  />
                            <span v-if="props.row.taskStatus === 'CANCELED' || props.row.taskStatus === 'COMPLETION'">{{props.row.taskStatusName}}</span>
                            <span v-else style="color:#D93437;">{{props.row.taskStatusName}}</span>
                        </div>
                    </template>
                </el-table-column>
                
            </el-table>
        </div>

        <!-- 重点关注任务 -->
        <div v-else>
            <div class="take-top-wrapper m-t-10">
                <div class="take-left">
                    <div class="take-top" style="font-size: 14px;font-weight:normal">重点关注任务</div>
                </div>
                <div class="take-right" @click="customized">定制</div>
            </div>
                
            <el-table
                :data="result"
                row-key="id"
                :expand-row-keys="expands"
                @row-click="openDetails"
                style="width: 100%"
                empty-text="暂无数据">
                <el-table-column label="任务标题" prop="title ">
                    <template slot-scope="props">
                        <router-link :to="{path: '/taskManage/taskDetail', query: { id: props.row.id }}" @click.stop="" style="color:#505363;">
                            <div>{{ props.row.title }}-{{ props.row.executorName }}</div>
                        </router-link>
                        <div>
                            <div class="title-right">
                                {{ props.row.taskTypeName }}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="最新动态">
                    <template slot-scope="props">
                        <div class="" v-if="props.row.taskReplyList && props.row.taskReplyList.length > 0">
                            <div v-if='props.row.taskReplyList[0].replyStatus=="UNREAD"' style="color:rgb(217, 52, 55)">
                                <span>{{ props.row.taskReplyList[0].replyUser.userName}}：</span><span>{{ props.row.taskReplyList[0].replyContent}}</span>
                            </div>
                            <div v-if='props.row.taskReplyList[0].replyStatus=="READED"'>
                                <span>{{ props.row.taskReplyList[0].replyUser.userName}}：</span><span>{{ props.row.taskReplyList[0].replyContent}}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="本月目标">
                    <template slot-scope="props">
                        <span>{{ props.row.taskGoal }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="任务状态"
                    min-width="50">
                    <template slot-scope="props">
                        <div>
                            <img class="icon_type" v-if="props.row.taskStatus === 'APPROVEPASS'" src="../../images/timeLate.png" alt=""  />
                            
                            <span v-if="props.row.taskStatus === 'CANCELED' || props.row.taskStatus === 'COMPLETION'">{{props.row.taskStatusName}}</span>
                            <span v-else style="color:#D93437;">{{props.row.taskStatusName}}</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-depart" v-show="total > 0">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="nowPage"
                    :page-sizes="[10, 15, 50]"
                    :page-size="pageShow"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div>
        
        
        <!--发布任务模态窗-->
        <el-dialog
            :title="dialogTaskFormTitle"
            :visible.sync="dialogTaskForm"
            width="560px"
            :before-close="beforeCloseTaskForm"
            top="10%"
            class="noticeManageModel">
            <el-form
                :model="taskForm"
                :rules="taskFormRules"
                ref="taskForm"
                label-width="112px">
                
                <el-form-item label="任务标题:" prop="title" :class="{'is-change': handTaskType === 3 && (auditOldData.title != taskForm.title)}">
                    <el-input v-model="taskForm.title" placeholder="请输入任务标题" style="width:363px;display:inline-block;" ></el-input>
                </el-form-item>
                <el-form-item label="执行人:" prop="executorId" :class="{'is-change': handTaskType === 3 && (auditOldData.executorId != taskForm.executorId)}">
                    <!-- 禁用： 编辑状态 且 不是草稿状态 -->
                    <el-select v-model="taskForm.executorId"
                        :disabled="(handTaskType === 2 && taskForm.taskStatus != 'TOSUBMIT') || handTaskType === 3"
                         filterable clearable placeholder="请选择执行人" style="width:363px;display:inline-block;" @change="goLink">
                        <el-option v-for="item in users" :label="item.userName" :value="item.userId" :key="item.userId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务类型:" prop="taskTypeId" :class="{'is-change': handTaskType === 3 && (auditOldData.taskTypeId != taskForm.taskTypeId)}">
                    <el-select v-model="taskForm.taskTypeId" clearable placeholder="请选择类型" style="width:363px;display:inline-block;" >
                        <el-option
                            v-for="item in optionType"
                            :key="item.taskTypeId"
                            :label="item.taskTypeName"
                            :value="item.taskTypeId" >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务汇报对象:" prop="reportId" :class="{'is-change': handTaskType === 3 && (auditOldData.reportId != taskForm.reportId)}">
                    <el-select
                        v-model="taskForm.reportId"
                        filterable
                        clearable
                        placeholder="请选择任务汇报对象"
                        style="width:363px;display:inline-block;">
                        <el-option
                            v-for="item in optionsObj"
                            :key="item.userId"
                            :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                
                
                <el-form-item label="任务工作量:" prop="taskWorkload" :class="{'is-change': handTaskType === 3 && (auditOldData.taskWorkload != taskForm.taskWorkload)}">
                    <el-select
                        v-model="taskForm.taskWorkload"
                        placeholder="请选择任务工作量"
                        clearable
                        style="width:363px;display:inline-block;">
                        <el-option v-for="item in 10" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                    <el-tooltip class="item" effect="dark" placement="bottom-end">
                        <i class="el-icon-warning"></i>
                        <div slot="content">
                            <p>任务工作量说明：</p>
                            <p>- 本月基准任务为“完成2篇投后月报”，占本月计划考核权重的13%；</p>
                            <p>- 任务发布后会由上级进行审核，审核通过后本月计划中所有任务的权重都自动修改；</p>
                            <p>- 任务工作量基数为“1”时，不需要上级审核。</p>
                        </div>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="完成时间:" prop="planEndDate" :class="{'is-change': handTaskType === 3 && (auditOldData.planEndDate != taskForm.planEndDate)}">
                    <el-date-picker
                        type="date"
                        placeholder="选择日期"
                        :picker-options="pickerOptions0"
                        v-model="taskForm.planEndDate"
                        style="width:363px;display:inline-block;"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="任务内容:" prop="content" :class="{'is-change': handTaskType === 3 && (auditOldData.content != taskForm.content)}">
                    <el-input type="textarea" v-model="taskForm.content" style="width:363px;display:inline-block;"></el-input>
                </el-form-item>
                
                <el-form-item label="修改原因:" required prop="modifyReason" v-if="(handTaskType == 2 && taskForm.taskStatus != 'TOSUBMIT') || (handTaskType == 3 && auditOldData.taskStatus != 'NEWAPPROVE')" :class="{'is-change': handTaskType === 3 && (auditOldData.modifyReason != taskForm.modifyReason)}">
                    <el-input type="textarea" v-model="taskForm.modifyReason" style="width:363px;display:inline-block;"></el-input>
                </el-form-item>
                <div v-show="stretch">
                    <el-form-item label="任务性质:" :class="{'is-change': handTaskType === 3 && (auditOldData.taskCategory != taskForm.taskCategory)}">
                        <el-radio-group v-model="taskForm.taskCategory" :disabled="(handTaskType == 2 && taskForm.taskStatus != 'TOSUBMIT') || handTaskType == 3">
                            <el-radio :label="0">单条任务</el-radio>
                            <el-radio :label="1" v-if="!(handTaskType == 1 && !canAddTaskGroup)">任务组任务</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="关联任务组:" v-if="taskForm.taskCategory == 0" :class="{'is-change': handTaskType === 3 && (auditOldData.taskGroupId != taskForm.taskGroupId)}">
                        <el-select v-model="taskForm.taskGroupId" clearable placeholder="请选择关联任务组" style="width:363px;display:inline-block;">
                            <el-option
                                v-for="item in groupLists"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="任务组成员:" v-if="taskForm.taskCategory == 1" :class="{'is-change': handTaskType === 3 && (auditOldData.taskGropUsers != taskGropUsers)}">
                        <div class="user-right" @click="adduser">添加任务组成员</div>
                        
                        <div class="user-item ellipsis" v-for="(item, index) in taskGropUsers" :key="index">
                            <span class="ellipsis" style="display: inline-block;width: 100%;">{{ item.userName }}</span>
                            <i class="el-icon-circle-close"  @click="removeTodo(index)"></i>
                        </div>
                    </el-form-item>
                    <el-form-item label="关联项目:" :class="{'is-change': handTaskType === 3 && (auditOldData.projectId != taskForm.projectId)}">
                        <el-select v-model="taskForm.projectId" clearable placeholder="请选择关联项目" style="width:363px;display:inline-block;">
                            <el-option
                                v-for="item in projects"
                                :key="item.projectId"
                                :label="item.projectName"
                                :value="item.projectId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="任务可见范围:" :class="{'is-change': handTaskType === 3 && (auditOldData.value71 != taskForm.value71)}">
                        <el-select
                            multiple
                            v-model="taskForm.value71"
                            placeholder="请选择部门"
                            clearable
                            style="width:363px;display:inline-block;" >
                            <el-option label="公司" value="-1"></el-option>
                            <el-option
                                v-for="item in depet"
                                :key="item.deptId"
                                :label="item.deptName"
                                :value="item.deptId + ''" ></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div style="text-align: center">
                    <div style="cursor: pointer" @click="stretch = !stretch">
                        <span>{{ this.stretch ? '收起更多选项' : '展开更多选项' }}</span>
                        <i :class="stretch ? 'el-icon-arrow-up' : 'el-icon-arrow-down' " ></i>
                    </div>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <button @click="beforeCloseTaskForm">取 消</button>

                <button v-if="handTaskType == 1" @click="submitTaskForm(0)" class="saveDrafts">保存草稿</button>
                <button v-if="handTaskType == 1" @click="submitTaskForm(1)">发布任务</button>

                <button v-if="handTaskType == 2 && taskForm.taskStatus == 'APPROVEPASS'" @click="cancle(handTaskId)">删 除</button>
                <button v-if="handTaskType == 2 && taskForm.taskStatus == 'TOSUBMIT'" @click="submitTaskForm(0)">保存草稿</button>
                <button v-if="handTaskType == 2 && taskForm.taskStatus == 'APPROVEPASS'" @click="submitTaskForm(2)">提 交</button>
                <button v-if="handTaskType == 2 && taskForm.taskStatus == 'TOSUBMIT'" @click="submitTaskForm(1)">发布任务</button>

                <button v-if="handTaskType == 3" @click="submitTaskForm(3)">同意</button>
                
            </span>
        </el-dialog>

        <!--添加任务组成员-->
        <el-dialog
            title="添加任务组成员"
            :visible.sync="dialogAddUserForm"
            width="560px"
            :before-close="beforeCloseAddUserForm"
            top="25%"
            class="noticeManageModel">
            <el-form
                :model="addUserForm"
                ref="addUserForm"
                :rules="addUserFormRules"
                label-width="112px">
                <el-form-item
                    label="姓名:"
                    prop="userId"
                    style="margin-right: 40px !important;">
                    <el-select
                        v-model="addUserForm.userId"
                        filterable
                        clearable
                        placeholder="请选择任务组成员"
                        style="width:100%;">
                        <el-option
                            v-for="item in usersT"
                            :key="item.userId"
                            :label="item.userName"
                            :value="item.userId + ''">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <button @click="beforeCloseAddUserForm">取 消</button>
                <button @click="submitAddUserForm">确 定</button>
            </span>
        </el-dialog>

        <!--删除任务模态窗-->
        <el-dialog
            title="申请删除任务"
            :visible.sync="dialogCancle"
            width="560px"
            :before-close="cancleFormClose"
            top="25%"
            class="noticeManageModel">
            <el-form
                :model="cancleForm"
                :rules="cancleFormRules"
                ref="cancleForm"
                label-width="112px"
                class="demo-ruleForm">
                <el-form-item
                    label="删除原因："
                    prop="cause"
                    required
                    style="margin-right: 40px !important;">
                    <el-input  type="textarea" v-model="cancleForm.cause"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <button @click="cancleFormClose">取 消</button>
                <button @click="submitCancleForm">确 定</button>
            </span>
        </el-dialog>

        <!--评价任务模态窗-->
        <el-dialog title='评价任务' :visible.sync="dialogEvaluate" width="560px" :before-close="evaluateFormClose" top='23%'>
            <el-form :model="evaluateForm" :rules="evaluateFormRules" ref="evaluateForm" label-width="112px">
                <el-form-item label="任务打分：" prop="score" required style="margin-right: 40px !important;">
                    <el-input @keyup.native="onkeyupPrice($event)" v-model="evaluateForm.score"></el-input>
                </el-form-item>
                <el-form-item label="任务总结：" prop="comment" style="margin-right: 40px !important;">
                    <el-input type="textarea" v-model="evaluateForm.comment"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <button  @click="evaluateFormClose">取 消</button>
                <button  @click="submitEvaluateForm">确 认</button>
            </span>
        </el-dialog>
        <!--完成任务模态窗-->
        <el-dialog title='完成任务' :visible.sync="dialogComplete" width="560px" :before-close="completeFormClose" top='23%'>
            <el-form :model="completeForm" :rules="completeFormRules" ref="completeForm" label-width="112px">
                <el-form-item label="自评打分：" prop="score" required style="margin-right: 40px !important;">
                    <el-input @keyup.native="onkeyupPrice($event)" v-model="completeForm.score"></el-input>
                </el-form-item>
                <el-form-item label="任务总结：" prop="comment" style="margin-right: 40px !important;">
                    <el-input type="textarea" v-model="completeForm.comment"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <button  @click="completeFormClose">取 消</button>
                <button  @click="submitCompleteForm">确 认</button>
            </span>
        </el-dialog>

        
        <!-- 定制重点关注任务 -->
        <el-dialog title="定制重点关注任务" :visible.sync="dialogCustomized" width="500px" top="10%">
            <el-form :model="customizedForm" ref="customizedForm" :rules="customizedFormRules" label-position="top" label-suffix="：" label-width="100px">
                
                <el-form-item label="任务执行人" prop="users" v-if="userView == 'DEPT'">
                    <el-checkbox-group v-model="customizedForm.users">
                        <el-checkbox v-for="(item,index) in users" :label="item.userId + ''" :key="index">{{item.userName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="部门及任务执行人" prop="deptsAndUsers" v-if="userView == 'MANAGER'">
                    <el-checkbox-group v-model="customizedForm.deptsAndUsers" class="depts-box">
                        <div v-for="(item,index) in deptsAndUsers" :key="index" class="depts-box-item">
                            <div class="depts-box-title">{{item.deptName}}</div>
                            <el-checkbox v-for="j in item.deptUsers" :key="j.userId" :label="j.userId + ''">{{j.userName}}</el-checkbox>
                        </div>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="任务权重" prop="workloadSet">
                    <el-checkbox-group v-model="customizedForm.workloadSet">
                        <el-checkbox v-for="(item,index) in workloadSetList" :key="index" :label="item.value">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                
                
            </el-form>
            <div slot="footer" class="text-right">
                <el-button size="small" @click="dialogCustomized = false">取 消</el-button>
                <el-button type="primary" size="small" @click.stop="customizedFormSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import moment from 'moment'
import {
    getStatisticCount,
    listDeptPendingTasks,
    listHomeFocusTask,
    departmentList,
    listByExecutor,
    listTaskExecutors,
    listReportingUsers,
    listGroupTaskListByUserId,
    getProjectList,
    listAllUsers,
    saveDraftTask,
    publishTask,
    sureEditorTask,
    editorTaskMain,
    cancelTaskCause,
    remindTaskList,
    assessTask,
    completeTask,
    approveTask,
    canPublishPlan,
    canPublishSummary,
    getTaskFocusSet,
    saveTaskFocusSet,
    listDeptsAndUsers,
    canPublishPlanOnTap,
    canPublishSummaryOnTap
} from 'service/getData'
import {  ERR_OK } from 'service/config'
import Sortable from 'sortablejs'
export default {
    data () {
        return {
            
            taskTotal: 0,
            planTotal: 0,
            summaryTotal: 0,
            appealingIdsTask: '',
            appealingIdsPlan: '',
            appealingIdsSummary: '',

            userView: 'STAFF', // MANAGER   DEPT   STAFF
            userId: '',
            canAddTaskGroup: false, // 是否有创建任务组权限

            deptLevel: '',

            result1: [], // 员工待处理任务
            
            result: [], // 重点关注任务
            nowPage: 1,
            pageShow: 10,
            total: 0,
            expands: [],

            
            depet:[], // 部门列表
            optionType: [], //类型列表
            users: [], //执行人列表
            optionsObj: [], // 汇报对象
            groupLists: [], //任务组列表
            projects: [], // 关联项目列表
            
            
            
            openTaskTypeId: '', // 当前打开的id 手风琴效果

            dialogTaskForm: false,
            dialogTaskFormTitle: '发起任务',
            // 表单验证
            taskFormRules: {
                title: [
                    {
                        required: true,
                        message: "请输入任务标题"
                    },
                    { max: 50, message: "任务标题不能超过50个字符" }
                ],
                executorId: [
                    {
                        required: true,
                        message: "请选择任务执行人",
                        type: "number"
                    }
                ],
                taskTypeId: [
                    {
                        required: true,
                        message: "请选择任务类型",
                        type: "number"
                    }
                ],
                reportId: [
                    {
                        required: true,
                        message: "请选择任务汇报对象",
                        type: "number"
                    }
                ],
                taskWorkload: [
                    {
                        required: true,
                        message: "请选择任务工作量"
                    }
                ],
                planEndDate: [
                    {
                        required: true,
                        message: "请选择日期"
                    }
                ],
                content: [
                    {
                        required: true,
                        message: "请输入任务内容"
                    },
                    { max: 200, message: "任务内容不能超过200个字符" }
                ],
                modifyReason: [
                    { required: true, message: "请输入修改原因" },
                    { max: 200, message: "修改原因不能超过200个字符" }
                ],
            },
            stretch: false,
            
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            handTaskId: '',
            handTaskType: 0, // 编辑弹窗状态 1新增 2编辑 3审核
            taskForm: {
                taskStatus: '', //操作时当前对象的状态 用于判断禁用

                title: "", // 任务标题
                planEndDate: "", // 完成时间
                content: "", // 任务内容
                reportId: "", // 任务汇报对象
                taskWorkload: "", // 任务工作量
                taskTypeId: "", // 任务类型
                executorId: "", // 执行人
                modifyReason: '', //修改原因
                taskCategory: 0, // 任务性质
                taskGroupId: '', // 关联任务组
                projectId: "", // 关联项目
                value71: [] // 任务可见范围部门
            },

            dialogAddUserForm: false,
            
            taskGropUsers: [],
            usersT: [], // 所有用户
            addUserForm: {
                userId: ""
            },
            addUserFormRules: {
                userId: [
                    { required: true, message: "请选择"}
                ]
            },

            // 删除任务
            dialogCancle: false,
            cancleForm: {
                cause: ''
            },
            cancleFormRules: {
                cause: [
                    { required: true, message: "请输入"}
                ]
            },

            // 任务评价
            dialogEvaluate: false,
            evaluateForm: {
                score: '', // 打分
                comment: '', // 总结
            },
            evaluateFormRules: {
                score: [
                    { required: true, message: "请输入"}
                ]
            },

            // 完成任务
            dialogComplete: false,
            completeForm: {
                score: '', // 打分
                comment: '', // 总结
            },
            completeFormRules: {
                score: [
                    { required: true, message: "请输入"}
                ]
            },
            
            // 审核旧数据
            auditOldData: {},
            

            isAddPlanPersonal: false, // 是否新增了个人计划
            isAddSummaryPersonal: false, // 是否新增了个人总结


            dialogCustomized: false, // 弹窗
            customizedForm: {
                users: [],
                deptsAndUsers: [],
                workloadSet: [],
            },
            deptsAndUsers: [], //部门和人员列表
            customizedFormRules: {
                users: [
                    { required: true, message: "请选择任务执行人"}
                ],
                deptsAndUsers: [
                    { required: true, message: "请选择任务执行人"}
                ],
                workloadSet: [
                    { required: true, message: "请选择"}
                ]
            },

            workloadSetList: [
                {
                    value: '1',
                    label: '1'
                },
                {
                    value: '2',
                    label: '2'
                },
                {
                    value: '3',
                    label: '3'
                },
                {
                    value: '4',
                    label: '4'
                },
                {
                    value: '5',
                    label: '5'
                },
                {
                    value: '6,7,8,9,10',
                    label: '大于5'
                }
            ],
            
        }
    },
    created() {
        this.userId = localStorage.getItem("userId");
        this.deptLevel = localStorage.getItem("deptLevel");
        this.userView = localStorage.getItem("userView");
        this.canAddTaskGroup = localStorage.getItem("canAddTaskGroup") == 'true' ? true : false;
        // this.userView = 'STAFF'; // MANAGER   DEPT   STAFF
        this.pageInit();
        
        console.log('当前用户id',this.userId);
        

    },
    watch: {

    },
    methods: {

        pageInit() {
            this.getStatisticCounts(); //获取待处理数量
            this.getIsCanAddPersonal(); // 获取是否可勾选权限
            if(this.userView == 'STAFF') {
                // 非员工
                this.getUntreatTask(); //获取员工待处理
            } else {
                this.pageShow = 1;
                this.getData(); // 获取重点关注任务
            }
            

            

        },
        getStatisticCounts() {
            getStatisticCount({}).then((res) => {
                if (res.code == ERR_OK) {
                    let totalList = res.data;
                    for(let item of totalList) {
                        if (item.type == 'TASK') {
                            this.taskTotal = item.count;
                            this.appealingIdsTask = item.appealingIds;
                        } else if (item.type == 'PLAN') {
                            this.planTotal = item.count;
                            this.appealingIdsPlan = item.appealingIds;
                        } else if (item.type == 'SUMMARY') {
                            this.summaryTotal = item.count;
                            this.appealingIdsSummary = item.appealingIds;
                        }
                    }
                } else {
                    this.$notify({
                        type: 'warning',
                        title: "提示",
                        message: res.msg
                    });
                }
            })
        },
        getIsCanAddPersonal(){
            
            // 验证个人可否发布计划
            canPublishPlan({
                planSummaryType: 1
            }).then((res) => {
                if (res.code == ERR_OK) {
                    this.isAddPlanPersonal = !res.data;
                } else {
                    this.$notify({
                        type: 'warning',
                        title: "提示",
                        message: res.msg
                    });
                }
            })
            // 验证个人可否发布总结
            canPublishSummary({
                planSummaryType: 1
            }).then((res) => {
                if (res.code == ERR_OK) {
                    this.isAddSummaryPersonal = res.data;
                } else {
                    this.$notify({
                        type: 'warning',
                        title: "提示",
                        message: res.msg
                    });
                }
            })
        },
        // 获取部门列表
        departmentList1() {
            if (this.depet && this.depet.length > 0) return;
            departmentList().then(res => {
                if (res.code == ERR_OK) {
                    this.depet = res.data.result;
                }
            });
        },
        
        
        listAllUsersT() {
            if (this.usersT && this.usersT.length > 0) return;
            listAllUsers().then(res => {
                if (res.code == ERR_OK) {
                    this.usersT = res.data;
                }
            });
        },
        // 获取任务组列表
        getTaskGroupLists(id) {
            listGroupTaskListByUserId({
                executorId: id
            }).then((res) => {
                if (res.code == ERR_OK) {
                    this.groupLists = res.data;
                }
            })
        },
        // 获取关联项目列表
        getProjectLists() {
            if (this.projects && this.projects.length > 0) return;
            getProjectList().then(res => {
                if (res.code == ERR_OK) {
                    this.projects = res.data.result;
                    this.projects.unshift({
                        projectId: "",
                        projectName: "请选择关联项目"
                    });
                }
            });
        },
        // 获取执行人列表
        async getTaskExecutors() {
            if (this.users && this.users.length > 0) return;
            await listTaskExecutors().then(res => {
                if (res.code == ERR_OK) {
                    this.users = res.data;
                    for (let i in this.users) {
                        if (this.users[i].checked == true) {
                            this.taskForm.executorId = this.users[i].userId;
                        }
                    }
                    this.goLink(this.taskForm.executorId);
                    
                }
            });
        },
        async getDeptsAndUsers() {
            if (this.deptsAndUsers && this.deptsAndUsers.length > 0) return;
            await listDeptsAndUsers().then(res => {
                if (res.code == ERR_OK) {
                    this.deptsAndUsers = res.data;
                }
            });
        },
        // 获取汇报对象
        getReportUsers(id) {
            this.optionsObj = [];
            listReportingUsers({
                userId: id
            }).then(res => {
                if (res.code == ERR_OK) {
                    this.optionsObj = res.data;

                    let isCheckVal = false;
                    if (this.taskForm.reportId) {
                        for (let item of res.data) {
                            if (this.taskForm.reportId === item.userId) {
                                this.taskForm.reportId = item.userId;
                                isCheckVal = true;
                            }
                        }
                        if (!isCheckVal) {this.taskForm.reportId = '';}
                    } else {
                        for (let item of res.data) {
                            if (item.checked == true) {
                                this.taskForm.reportId = item.userId;
                            }
                        }
                    }
                }
            });
        },
        // 获取执行人对应的任务类型
        getTaskTypesByExecutor(id) {
            listByExecutor({
                userId: id
            }).then(res => {
                if (res.code == ERR_OK) {
                    this.optionType = res.data;

                    let isCheckVal = false;
                    if (this.taskForm.taskTypeId) {
                        for (let item of res.data) {
                            if (this.taskForm.taskTypeId === item.taskTypeId) {
                                this.taskForm.taskTypeId = item.taskTypeId;
                                isCheckVal = true;
                            }
                        }
                        if (!isCheckVal) {this.taskForm.taskTypeId = '';}
                    } else {
                        for (let item of res.data) {
                            if (item.checked == true) {
                                this.taskForm.taskTypeId = item.taskTypeId;
                            }
                        }
                    }
                }
            });
        },
        
        // 重点关注任务分页
        handleSizeChange(val) {
            this.pageShow = val;
            this.getData()
        },
        handleCurrentChange(val) {
            this.nowPage = val;
            this.getData()
        },
        // 获取重点关注任务
        getData() {
            this.result = [];
            this.total = 0;
            listHomeFocusTask({
                nowPage: this.nowPage,
                pageShow: this.pageShow
            }).then((res) => {
                if (res.code == ERR_OK) {
                    this.result = res.data.result;
                    this.total = res.data.totalCount;
                }
            })
        },
        openDetails(row) {
            
            this.$router.push({
                path: "/taskManage/taskDetail",
                query: { id: row.id }
            })
            
        },
        // 员工待处理任务列表
        getUntreatTask() {
            this.result1 = []
            listDeptPendingTasks().then((res) => {
                if (res.code == ERR_OK) {
                    this.result1 = res.data;
                }
            })
        },
        


        goLink(id) {
            this.getReportUsers(id);
            this.getTaskTypesByExecutor(id);
            this.getTaskGroupLists(id); //关联任务组列表
        },
        // 弹窗关闭
        beforeCloseTaskForm() {
            this.$refs.taskForm.resetFields();
            this.dialogTaskForm = false;
        },
        submitTaskForm(submitType) {
            // submitType 提交类型 1 提交  0 保存草稿 2 编辑
            
            var time;
            var value71 = this.taskForm.value71.join(",");
            if (this.taskForm.planEndDate == "") {
                time = "";
            } else {
                time = moment(this.taskForm.planEndDate).format('YYYY-MM-DD');
            }
            
            let params = {
                title: this.taskForm.title, // 任务标题
                taskTypeId: this.taskForm.taskTypeId, // 任务类型ID
                executorId: this.taskForm.executorId, // 执行人
                reportId: this.taskForm.reportId, // 任务汇报对象
                projectId: this.taskForm.projectId, // 关联项目
                taskWorkload: this.taskForm.taskWorkload, // 任务工作量
                taskCategory: this.taskForm.taskCategory, // 任务性质
                visibleRange: value71,
                planEndDate: time,
                content: this.taskForm.content
            };
            if (this.taskForm.taskCategory == 0) {
                params.taskGroupId = this.taskForm.taskGroupId;
            } else if (this.taskForm.taskCategory == 1) {
                
                let usersArr = [];
                for(let item of this.taskGropUsers) {
                    usersArr.push(item.userId);
                }
                params.taskGroupMemberIds = usersArr.join(',');
            }
            
            if (submitType === 0) {
                if (this.taskForm.title == "") {
                    this.$notify.error({
                        title: "错误",
                        message: "请输入任务标题"
                    });
                    return false;
                }
                if (this.taskForm.title.trim().length > 50) {
                    this.$notify.error({
                        title: "错误",
                        message: "任务标题不能超过50个字符"
                    });
                    return false;
                }
                if(this.handTaskId) {
                    params.id = this.handTaskId;
                }
                saveDraftTask(params).then(res => {
                    if (res.code == ERR_OK) {
                        this.$refs.taskForm.resetFields();
                        this.dialogTaskForm = false;
                        this.pageInit();
                        this.$notify({
                            title: "成功",
                            message: "保存成功",
                            type: "success"
                        });
                    } else {
                        this.$notify.error({
                            title: "错误",
                            message: res.msg
                        });
                    }
                });
            } else if (submitType === 1) {
                this.$refs.taskForm.validate((valid) => {
                    if (valid) {
                        if(this.handTaskId) {
                            params.id = this.handTaskId;
                        }
                        publishTask(params).then(res => {
                            if (res.code == ERR_OK) {
                                this.$refs.taskForm.resetFields();
                                this.dialogTaskForm = false;
                                this.pageInit();
                                this.$notify({
                                    title: "成功",
                                    message: "发起任务成功",
                                    type: "success"
                                });
                            } else {
                                this.$notify.error({
                                    title: "错误",
                                    message: res.msg
                                });
                            }
                        });
                    }
                })
            } else if (submitType === 2){
                this.$refs.taskForm.validate((valid) => {
                    if (valid) {
                        // 编辑
                        params.id = this.handTaskId;
                        params.modifyReason = this.taskForm.modifyReason;
                        sureEditorTask(params).then(res => {
                            if (res.code == ERR_OK) {
                                this.$refs.taskForm.resetFields();
                                this.dialogTaskForm = false;
                                this.pageInit();
                                this.$notify({
                                    title: "成功",
                                    message: "编辑任务成功",
                                    type: "success"
                                });
                            } else {
                                this.$notify.error({
                                    title: "错误",
                                    message: res.msg
                                });
                            }
                        });
                    }
                })
            } else if (submitType === 3){
                this.$refs.taskForm.validate((valid) => {
                    if (valid) {
                        // 审核
                        params.id = this.handTaskId;
                        params.modifyReason = this.taskForm.modifyReason;
                        approveTask(params).then(res => {
                            if (res.code == ERR_OK) {
                                this.$refs.taskForm.resetFields();
                                this.dialogTaskForm = false;
                                this.pageInit();
                                this.$notify({
                                    title: "成功",
                                    message: "审核任务成功",
                                    type: "success"
                                });
                            } else {
                                this.$notify.error({
                                    title: "错误",
                                    message: res.msg
                                });
                            }
                        });
                    }
                })
            }

            
        },
        // 新增任务 发起任务 添加任务
        addTask() {
            this.handTaskId = ''; //非编辑模式
            this.taskForm.taskStatus = '';
            this.auditOldData = {};// 审核旧数据
            this.handTaskType = 1; // 1.新增  2.编辑 3.审核
            this.dialogTaskFormTitle = '发起任务';

            this.taskGropUsers = [];

            this.departmentList1(); //获取部门列表
            this.getTaskExecutors(); //获取执行人列表
            this.getProjectLists(); //获取关联项目列表
            this.listAllUsersT(); // 获取所有用户
            this.dialogTaskForm = true;

        },
        mindTask1(id) {
            this.taskForm.taskTypeId = id
            this.addTask();
        },
        // 编辑任务
        editTask(id) {
            this.taskGropUsers = [];
            this.handTaskType = 2; // 1.新增  2.编辑 3.审核
            this.dialogTaskFormTitle = '编辑任务';

            this.departmentList1(); //获取部门列表
            this.getTaskExecutors(); //获取执行人列表
            this.getProjectLists(); //获取关联项目列表
            this.listAllUsersT(); // 获取所有用户
            this.dialogTaskForm = true;
            this.handTaskId = id; //记录当前编辑id
            this.auditOldData = {}; //审核旧数据
            editorTaskMain({
                id: id
            }).then(res => {
                if (res.code == ERR_OK) {
                    
                    this.$nextTick(()=> {
                        this.taskForm.title = res.data.title;
                        this.taskForm.executorId = res.data.executorId;
                        this.goLink(this.taskForm.executorId);
                        this.taskForm.taskTypeId = res.data.taskTypeId;
                        this.taskForm.reportId = res.data.reportId;
                        this.taskForm.taskWorkload = res.data.taskWorkload;
                        this.taskForm.planEndDate = res.data.planEndDate;
                        this.taskForm.content = res.data.content;
                        this.taskForm.taskCategory = res.data.taskCategory;
                        this.taskForm.taskGroupId = res.data.taskGroupId;
                        
                        this.taskForm.modifyReason = res.data.modifyReason;
                        this.taskForm.projectId = res.data.projectId;
                        this.taskForm.taskStatus = res.data.taskStatus; // 状态
                        if (!res.data.visibleRange) {
                            this.taskForm.value71 = [];
                        } else {
                            this.taskForm.value71 = res.data.visibleRange.split(",");
                        }

                        
                        var _taskGropUsers = [];
                        if (res.data.taskGroupMemberIds && res.data.taskGroupMemberIds.length > 0) {
                            var _taskGroupMemberIds = res.data.taskGroupMemberIds.split(',');
                            var _taskGroupMemberName = res.data.taskGroupMemberNames.split(',');

                            for (var i = 0, l = _taskGroupMemberIds.length; i < l; i++) {
                                
                                _taskGropUsers.push({
                                    userId: _taskGroupMemberIds[i],
                                    userName: _taskGroupMemberName[i]
                                });
                                
                            }
                        }
                        this.taskGropUsers = [..._taskGropUsers];

                    })
                } else {
                    this.$notify.error({
                        title: "错误",
                        message: res.msg
                    });
                }
            });
        },
        // 审核任务 
        auditTask(id) {
            this.taskGropUsers = [];

            this.handTaskType = 3; // 1.新增  2.编辑 3.审核
            this.dialogTaskFormTitle = '审核任务';
            this.departmentList1(); //获取部门列表
            this.getTaskExecutors(); //获取执行人列表
            this.getProjectLists(); //获取关联项目列表
            this.listAllUsersT(); // 获取所有用户
            this.dialogTaskForm = true;
            this.handTaskId = id; //记录当前编辑id

            editorTaskMain({
                id: id
            }).then(res => {
                if (res.code == ERR_OK) {
                    this.$nextTick(()=> {
                        this.auditOldData = Object.assign({},res.data);
                        
                        this.taskForm.title = res.data.title;
                        this.taskForm.executorId = res.data.executorId;
                        this.goLink(this.taskForm.executorId);
                        this.taskForm.taskTypeId = res.data.taskTypeId;
                        this.taskForm.reportId = res.data.reportId;
                        this.taskForm.taskWorkload = res.data.taskWorkload;
                        this.taskForm.planEndDate = res.data.planEndDate;
                        this.taskForm.content = res.data.content;
                        this.taskForm.taskCategory = res.data.taskCategory;
                        this.taskForm.taskGroupId = res.data.taskGroupId;
                        
                        this.taskForm.modifyReason = res.data.modifyReason;
                        this.taskForm.projectId = res.data.projectId;
                        this.taskForm.taskStatus = res.data.taskStatus; // 状态
                        if (!res.data.visibleRange) {
                            this.taskForm.value71 = [];
                        } else {
                            this.taskForm.value71 = res.data.visibleRange.split(",");
                        }

                        
                        var _taskGropUsers = [];
                        if (res.data.taskGroupMemberIds && res.data.taskGroupMemberIds.length > 0) {
                            var _taskGroupMemberIds = res.data.taskGroupMemberIds.split(',');
                            var _taskGroupMemberName = res.data.taskGroupMemberNames.split(',');

                            for (var i = 0, l = _taskGroupMemberIds.length; i < l; i++) {
                                
                                _taskGropUsers.push({
                                    userId: _taskGroupMemberIds[i],
                                    userName: _taskGroupMemberName[i]
                                });
                                
                            }
                        }
                        this.taskGropUsers = [..._taskGropUsers];

                        this.auditOldData.value71 = this.taskForm.value71;
                    })    

                } else {
                    this.$notify.error({
                        title: "错误",
                        message: res.msg
                    });
                }
            });
        },

        // 新增编辑里的弹窗
        adduser() {
            this.dialogAddUserForm = true;
        },
        removeTodo(index) {
            this.taskGropUsers.splice(index, 1);
        },
        beforeCloseAddUserForm() {
            this.$refs.addUserForm.resetFields();
            this.dialogAddUserForm = false;
        },
        submitAddUserForm() {
            this.$refs.addUserForm.validate(valid => {
                if (valid) {
                    if (this.addUserForm.userId == this.taskForm.executorId) {
                        this.$notify.error({
                            title: "错误",
                            message: "执行人和任务组成员不能相同"
                        });
                        return;
                    }
                    if (this.taskGropUsers.length > 0) {
                        for (let item of this.taskGropUsers) {

                            if (item.userId == this.addUserForm.userId) {
                                console.log('不能选择相同的任务组成员')
                                this.$notify.error({
                                    title: "错误",
                                    message: "不能选择相同的任务组成员"
                                });
                                return;
                            }
                        }
                    }
                    this.dialogAddUserForm = false;

                    for (let item of this.usersT) {
                        if (this.addUserForm.userId == item.userId) {
                            this.taskGropUsers.push({
                                userId: item.userId,
                                userName: item.userName
                            });
                        }
                    }
                    

                } else {
                    return false;
                }
            });
        },
        
        // 删除任务
        cancle(id, event) {
            
            this.handTaskId = id; //非编辑模式
            this.taskForm.taskStatus = '';
            this.dialogCancle = true;
        },
        cancleFormClose() {
            this.$refs.cancleForm.resetFields();
            this.dialogCancle = false;
        },
        submitCancleForm(){
            this.$refs.cancleForm.validate((valid) => {
                if (valid) {
                    cancelTaskCause({
                        id: this.handTaskId,
                        reason: this.cancleForm.cause
                    }).then(res => {
                        if (res.code == ERR_OK) {
                            this.cancleFormClose(); // 关闭弹窗
                            this.beforeCloseTaskForm();
                            
                            this.pageInit();
                            this.$notify({
                                title: "成功",
                                message: "任务已删除",
                                type: "success"
                            });
                        } else {
                            this.$notify.error({
                                title: "错误",
                                message: res.msg
                            });
                        }
                    });
                }
            })
            
        },

        // 提醒完成
        tipCompleteModal(id){
            remindTaskList({
                id: id
            }).then((res) => {
                if(res.code == ERR_OK) {
                    this.pageInit();
                    this.$notify({
                        title: '成功',
                        message: '已提醒该员工该任务已完成',
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

        
        // 任务评价
        levelComeplete(id) {
            this.handTaskId = id;
            this.taskForm.taskStatus = '';
            this.dialogEvaluate = true;
        },
        evaluateFormClose() {
            this.$refs.evaluateForm.resetFields();
            this.dialogEvaluate = false;
        },
        submitEvaluateForm() {
            
            this.$refs.evaluateForm.validate((valid) => {
                if (valid) {
                    assessTask({
                        id: this.handTaskId,
                        score: this.evaluateForm.score,
                        comment: this.evaluateForm.comment
                    }).then(res => {
                        if (res.code == ERR_OK) {
                            this.evaluateFormClose(); // 关闭弹窗
                            this.pageInit();
                            this.$notify({
                                title: "成功",
                                message: "评价完成",
                                type: "success"
                            });
                        } else {
                            this.$notify.error({
                                title: "错误",
                                message: res.msg
                            });
                        }
                    });
                }
            })
        },

        // 完成任务
        
        // 完成任务
        completeModal(id) {
            this.handTaskId = id;
            this.taskForm.taskStatus = '';
            this.dialogComplete = true;
        },
        completeFormClose() {
            this.$refs.completeForm.resetFields();
            this.dialogComplete = false;
        },
        submitCompleteForm() {
            
            this.$refs.completeForm.validate((valid) => {
                if (valid) {
                    completeTask({
                        id: this.handTaskId,
                        score: this.completeForm.score,
                        comment: this.completeForm.comment
                    }).then(res => {
                        if (res.code == ERR_OK) {
                            this.completeFormClose(); // 关闭弹窗
                            this.pageInit();
                            this.$notify({
                                title: "成功",
                                message: "完成任务已发送",
                                type: "success"
                            });
                        } else {
                            this.$notify.error({
                                title: "错误",
                                message: res.msg
                            });
                        }
                    });
                }
            })
        },
        
        validateLevel(level) {
            let isCurHandLevel = false;

            if (level == 0 && this.deptLevel == 'LEVEL_ZERO') {
                isCurHandLevel = true;
            } 
            if (level == 1 && this.deptLevel == 'LEVEL_ONE') {
                isCurHandLevel = true;
            } 
            if (level == 2 && this.deptLevel == 'LEVEL_TWO') {
                isCurHandLevel = true;
            }
            return isCurHandLevel;
        },
        

        // 发起计划
        addPlan() {
            // 点击判断能否发布
            canPublishPlanOnTap({
                planSummaryType: 1
            }).then((res) => {
                if (res.code == ERR_OK) {
                    if(res.data) {
                        this.$router.push({
                            path: "/planSummaryManage/planPersonal"
                        })
                    } else {
                        this.$alert(res.msg, '提示', {
                            confirmButtonText: '确定',
                            callback: action => {}
                        });
                    }
                } else {
                    this.$notify({
                        type: 'warning',
                        title: "提示",
                        message: res.msg
                    });
                }
            })

        },
        // 发起总结
        addSummary() {
            
            // 点击判断是否可以发布
            canPublishSummaryOnTap({
                planSummaryType: 1
            }).then((res) => {
                if (res.code == ERR_OK) {
                    if(res.data) {
                        this.$router.push({
                            path: "/planSummaryManage/summaryPersonal"
                        })
                    } else {
                        this.$alert(res.msg, '提示', {
                            confirmButtonText: '确定',
                            callback: action => {}
                        });
                    }
                } else {
                    this.$notify({
                        type: 'warning',
                        title: "提示",
                        message: res.msg
                    });
                }
            })

        },

        linkTask() {
            
            this.$router.push({
                path: "/taskManage/taskManage"
            })
        },
        linkPlan() {
            
            if (this.appealingIdsPlan && (this.appealingIdsPlan.split(',').length > 0)) {
                id = this.appealingIdsPlan.split(',')[0];
                
                // 审核个人总结
                this.$router.push({
                    path: "/planSummaryManage/planAudit",
                    query: {
                        id: id,
                        type: 1
                    }
                })
            } else {
                
                this.$router.push({
                    path: "/planSummaryManage/planManage"
                })
            }

        },
        linkSummary() {
            
            if (this.appealingIdsSummary && (this.appealingIdsSummary.split(',').length > 0)) {
                id = this.appealingIdsSummary.split(',')[0];
                
                // 审核个人总结
                this.$router.push({
                    path: "/planSummaryManage/summaryAudit",
                    query: {
                        id: id,
                        type: 1
                    }
                })
            } else {
                
                this.$router.push({
                    path: "/planSummaryManage/summaryManage"
                })
            }
            
        },
        // 定制
        async customized() {
            this.dialogCustomized = true;
            if (this.userView == 'DEPT') {
                await this.getTaskExecutors(); //获取执行人列表
            } else if(this.userView == 'MANAGER') {
                await this.getDeptsAndUsers(); //获取执行人列表
            }
            
            await getTaskFocusSet({}).then(res => {
                if (res.code == ERR_OK) {
                    if (!res.data) {
                        // 全选
                        this.customizedForm.workloadSet = ['1','2','3','4','5','6,7,8,9,10'];
                        let checked = [];
                        if (this.userView == 'DEPT') {
                            for(let item of this.users) {
                                checked.push(item.userId + '');
                            }
                            this.customizedForm.users = [...checked];
                        }
                        if (this.userView == 'MANAGER') {
                            for(let item of this.deptsAndUsers) {
                                if (item.deptUsers && item.deptUsers.length > 0) {
                                    for (let j of item.deptUsers) {
                                        checked.push(j.userId + '');
                                    }
                                }
                            }
                            this.customizedForm.deptsAndUsers = [...checked];
                        }

                    } else {
                        this.customizedForm.id = res.data.id;
                        let _workloadSet = [];
                        let sArr = res.data.workloadSet.split(',');
                        for(let item of sArr) {
                            if (item && item < 6) {
                                _workloadSet.push(item);
                            }
                        }
                        if (res.data.workloadSet.indexOf('6,7,8,9,10') > -1) {
                            _workloadSet.push('6,7,8,9,10');
                        }
                        this.customizedForm.workloadSet = [..._workloadSet];

                            console.log('呵呵',res.data.executorIdSet)
                        if (this.userView == 'DEPT') {
                            this.customizedForm.users = res.data.executorIdSet.split(',');
                        } else if (this.userView == 'MANAGER') {
                            this.customizedForm.deptsAndUsers = res.data.executorIdSet.split(',');
                        }
                    }
                } else {
                    this.$notify.error({
                        title: "错误",
                        message: res.msg
                    });
                }
            });
        },
        customizedFormSubmit() {
            this.$refs.customizedForm.validate((valid) => {
                if (valid) {
                    let params = {
                        workloadSet: this.customizedForm.workloadSet.join(','),
                    }
                    if (this.userView == 'DEPT') {
                        params.executorIdSet = this.customizedForm.users.join(',');
                    } else if (this.userView == 'MANAGER') {
                        params.executorIdSet = this.customizedForm.deptsAndUsers.join(',');
                    }
                    if (this.customizedForm.id) {
                        params.id = this.customizedForm.id;
                    }
                    saveTaskFocusSet(params).then(res => {
                        if (res.code == ERR_OK) {
                            this.$notify({
                                title: "成功",
                                message: "设置成功",
                                type: "success"
                            });
                            this.dialogCustomized = false;
                            this.pageInit();
                        } else {
                            this.$notify.error({
                                title: "错误",
                                message: res.msg
                            });
                        }
                    });
                }
            })
        }
                    
                    
                    
            
    }
}
</script>

<style scoped lang="scss">
.index-card {
    display: flex;
    background: #fff;
    height: 134px;
    .index-card-item {
        flex: 1;
        position: relative;
        text-align: center;
        cursor: pointer;
        .index-card-item-title {
            display: inline-block;
            color: #333333;
            line-height: 16px;
            font-size: 12px;
            margin-bottom: 30px;
            padding-top: 34px;
        }
        .index-card-item-number {
            font-weight: bold;
            color: #D93538;
            line-height: 1;
            font-size: 20px;
        }
        & + .index-card-item::before {
            content: '';
            position: absolute;
            height: 40px;
            width: 1px;
            left: 0;
            top: 47px;
            background: #F2F2F6;
        }
    }
    .index-card-btn {
        flex: 1;
        position: relative;
        text-align: center;
        cursor: pointer;
        .index-card-btn-icon {
            display: block;
            padding-top: 29px;
            width: 58px;
            height: 58px;
            margin: 0 auto 11px;
        }
        .index-card-btn-txt {
            line-height: 1;
            font-size: 12px;
            color: #292A32;
        }
        
    }

}
.task-list {
    box-shadow: 0 2px 11px 0 rgba(0,0,0,0.07);
    border-radius: 6px;
}
.take-task {
    height: 91px;
    margin: 0 auto;
    margin: 0 auto;
    border-left: 1px solid #dfe6ec;
    border-right: 1px solid #dfe6ec;
}
.take-left {
    width: auto;
    height: 46px;
    float: left;

}
.take-top-wrapper {
    height: 46px;
    width: 100%;
    opacity: 0.99;

    background: #FBEBEB;
}
.take-top {
    height: 46px;
    width: 265px;
    font-size: 18px;
    font-weight: bold;
    color: #333333;
    margin-left: 20px;
    line-height: 46px;

}
.take-bottom {
    height: 35px;
    // width: 265px;
    line-height: 35px;
    font-size: 14px;
    color: #FFFFFF;
    background: #fff;
    padding-top: 10px;
    clear: both;
}
.take-bottom .task-item:first-child {
    margin-right: 5px;
}
.take-bottom .task-item {
    width: 130px;
    float: left;
    text-align: center;
    background: #D8D8D8;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    cursor: pointer;
}
.take-bottom .task-item.active {
    background: #D93437;

}
.take-right {
    width: 84px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    margin-top: 8px;
    margin-right: 20px;
    float: right;
    cursor: pointer;
    font-size: 14px;
    color: #FFFFFF;
    border-radius: 5px;
    background: #D93538;
    border-radius: 4px;
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
    width: 340px;
    overflow: hidden;
}
.demo-table-expand .el-form-item:nth-child(2) {
    width: 330px;
    overflow: hidden;
}
.demo-table-expand .el-form-item:nth-child(3) {
    width: 155px;
    overflow: hidden;
}
.demo-table-expand .el-form-item:nth-child(4) {
    width: 255px;
    overflow: hidden;
}
.content-tab {
    line-height: 17px;
    display: block;
    font-size: 12px;
    padding: 0 53px 0 0;
    min-width: 297px;
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
.reback1 {
    line-height: 17px;
    padding-left: 0;
    background: transparent;
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
}
.task-filter {
    float: left;
    height: 35px;
    font-size: 12px;
    color: #333333;
    line-height: 35px;
    margin-left: 64px;
}
.dialog-footer button {
    border: 1px solid #838383;
    border-radius: 4px;
    width: 90px;
    height: 30px;
    text-align: center;
    background: #fff;
    color: #838383;
    cursor: pointer;
    margin-right: 20px;
}
.dialog-footer button:last-child {
    color: #D93437;
    border: 1px solid #D83436;
}


.el-form-item.is-change /deep/ .el-form-item__label {
    color: red;
}
.staff-box {
    background: #fff;
    .index-card {
        width: 300px;
    }
}
.depts-box {
    font-size: 14px;
    color: #666666;
    .depts-box-item {
        margin-left: 20px;
    }
}
</style>
