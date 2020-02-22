<template>
    <div class="wrapper">
        <div class="router-wrapper" v-if="userView=='STAFF'">
            <span class="child1">员工详情</span>
        </div>
        <div class="router-wrapper" v-if="userView=='DEPT'">
            <span class="child1">员工详情</span>
        </div>
        <div class="router-wrapper" v-if="userView=='MANAGER'">
            <router-link to="/setCenter">
                <span class="child1">系统设置</span>
            </router-link> /
            <router-link to="/setCenter/staffDetail">
                <span class="child1">员工管理</span>
            </router-link> /
            <span class="child2">员工详情</span>
        </div>
        
        <!-- 任务统计数据 -->
        <div class="m-b">
            <div class="take-top-wrapper">
                <div class="take-left">
                    <div class="take-top" style="font-size: 14px;font-weight:normal">用户信息</div>
                </div>
                <!-- <div class="take-right" @click="addPunish(1)" v-if="userView!='STAFF'">发起奖励</div>
                <div class="take-right" @click="addPunish(0)" v-if="userView!='STAFF'">发起惩罚</div> -->
                <div class="take-right" @click="addTaskByExecutorId" v-if="userView!='STAFF'">分发任务</div>
                <div class="take-right" @click="editUserInfo">编辑</div>
                
            </div>
            
            <div class="user-content">
                <ul>
                    <li>姓名：{{userInfo.userName}}</li>
                    <li>电话：{{userInfo.telephone}}</li>
                    <li>邮箱：{{userInfo.email}}</li>
                    <li>角色：{{userInfo.roleName}}</li>
                    <li>部门：{{userInfo.deptName}}</li>
                    <li>团队：{{userInfo.teamName}}</li>
                    <!-- <li>绩效评估分：{{userInfo.performanceScore }}</li> -->
                    <li>当月绩效评估分：{{userInfo.thisMonthEvalScore || '-'}}</li>
                    <!-- <li>任务绩效分：{{userInfo.evaluatingScore}}</li>
                    <li>奖励次数：{{userInfo.rewardSize}}</li>
                    <li>奖励金额共计：{{userInfo.rewardAmount}}</li>
                    <li></li>
                    <li>惩罚次数：{{userInfo.punishSize}}</li>
                    <li>惩罚金额总计：{{userInfo.punishAmount}}</li>
                    <li>奖惩合计：{{userInfo.rpTotal}}</li> -->
                </ul>
            </div>
        </div>

        <div>
            <!-- 待审核 待评价 -->
            
            <div class="idss-list m-b-10">
                <div class="idss-list-top">
                    <div class="idss-list-top-title">
                        <div class="idss-list-top-tabs">
                            <div class="idss-list-top-tabs-item" v-bind:class="{ active: pageTabsType === 0 }" @click="pageTabsTypeChange(0)">未完成({{pageTotalToApprove || '0'}})</div>
                            <div class="idss-list-top-tabs-item" v-bind:class="{ active: pageTabsType === 1 }" @click="pageTabsTypeChange(1)">已完成({{pageTotalWaitEvaluate || '0'}})</div>
                        </div>
                    </div>
                </div>
                
                <el-table
                    :data="pageData"
                    row-key="id"
                    :expand-row-keys="expands"
                    @row-click="openDetails"
                    @expand-change="startExpend"
                    style="width: 100%"
                    empty-text="暂无数据">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="内容:">
                                    <span class="content-tab">{{props.row.content}}</span>
                                </el-form-item>
                                <el-form-item>
                                    <div>
                                        <div class="input-back">
                                            <input type="text" name="" value="" class="inputValue" />
                                            <span @click="replyTask(props.row, $event)"
                                                class="replyValue">回复</span>
                                        </div>
                                        <div class="" v-for="(item,index) in props.row.taskReplyList" :key="index">
                                            <div class="reback-time">{{ item.replyTimeDistanceDesc }}</div>
                                            <div class="reback" style="max-width: 294px;min-width: 296px;overflow:hidden;">
                                                <div style="float:left;">{{item.replyUser.userName}}：</div>
                                                <div style="float:left;max-width: 247px;word-break: break-all; word-wrap:break-word;">{{ item.replyContent }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item label="">
                                    <div class="">概要：</div>
                                    <div class="reback reback1">发布人：{{props.row.createByName}}</div>
                                    <div class="reback reback1">执行人：{{props.row.executorName}}</div>
                                    <div>
                                        <div class="reback reback1">开始日期：{{props.row.submitTime}}</div>
                                        <div class="reback reback1">截止日期：{{props.row.planEndDate}}</div>
                                    </div>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
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
                    <el-table-column
                        label="任务状态"
                        min-width="50">
                        <template slot-scope="props">
                            <div>
                                <img class="icon_type" v-if="props.row.taskStatus === 'APPROVEPASS'" src="../../../../images/timeLate.png" alt=""  />
                                
                                <span v-if="props.row.taskStatus === 'CANCELED' || props.row.taskStatus === 'COMPLETION'">{{props.row.taskStatusName}}</span>
                                <span v-else style="color:#D93437;">{{props.row.taskStatusName}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="props">
                            
                            <el-button
                                size="small"
                                type="primary"
                                plain
                                v-if="props.row.canFinish"
                                @click.stop='completeModal(props.row.id)'>完成</el-button>
                            <el-button
                                size="small"
                                type="primary"
                                plain
                                v-if="props.row.canEdit"
                                @click.stop="editTask(props.row.id)">编辑任务</el-button>
                            <el-button
                                size="small"
                                type="primary"
                                plain
                                v-if="props.row.canCallBack"
                                @click.stop='callBackTask(props.row.id)'>撤回任务</el-button>

                                    
                            <router-link class="link-btn" :to="{path: '/taskManage/taskDetail',query: { id: props.row.id }}">
                                <el-button size="small" 
                                    type="primary"
                                    @click.stop=""
                                    plain >查看</el-button>
                            </router-link>

                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-depart" v-show="pageTotal > 0">
                    <el-pagination
                        background
                        @size-change="pageSizeChange"
                        @current-change="pageCurrentChange"
                        :current-page="pageIndex"
                        :page-sizes="[10, 15, 50]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pageTotal">
                    </el-pagination>
                </div>
            </div>
                
        </div>
        <!-- 编辑用户 -->
        <el-dialog
            title="个人信息"
            :visible.sync="dialogUserInfoForm"
            width="560px"
            :before-close="beforeCloseUserInfoForm"
            top='10%'>
            <el-form
                ref="userInfoForm"
                :model="userInfoForm"
                :rules="userInfoFormRules"
                label-width="80px" >
                <el-form-item label="姓名：" prop="userName">
                    <el-input v-model="userInfoForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="角色：" prop="role">
                    <span>{{userInfo.roleName || '-'}}</span>
                </el-form-item>
                <el-form-item label="部门：" prop="dept">
                    <span>{{userInfo.deptName || '-'}}</span>
                </el-form-item>
                <el-form-item label="团队：" prop="team">
                    <span>{{userInfo.teamName || '-'}}</span>
                </el-form-item>
                <el-form-item label="手机：" prop="telephone">
                    <el-input v-model="userInfoForm.telephone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：" prop="email">
                    <el-input v-model="userInfoForm.email"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button plain @click="beforeCloseUserInfoForm">取 消</el-button>
                <el-button plain @click="submitUserInfoForm">保存</el-button>
            </div>
        </el-dialog>
        <!-- 惩罚用户 -->
        <el-dialog
            :title="(punishFormType == 0 ? '发起惩罚' : '发起奖励')"
            :visible.sync="dialogPunishForm"
            width="560px"
            :before-close="beforeClosePunishForm"
            top='10%'>
            <el-form
                ref="punishForm"
                :model="punishForm"
                :rules="punishFormRules"
                label-width="80px" >
                <el-form-item label="姓名：" required>
                    <el-input v-model="userInfo.userName" disabled></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="类型：" prop="rpTypeId">
                            <el-select v-model="punishForm.rpTypeId" placeholder="请选择"  @change="_getRpAmountByType">
                                <el-option
                                    v-for="item in optionsType"
                                    :key="item.rpTypeId"
                                    :label="item.rpName"
                                    :value="item.rpTypeId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        
                        <el-form-item label="金额：" class="clear" prop="rpAmount">
                            <el-select v-model="punishForm.rpAmount" placeholder="请选择">
                                <el-option
                                    v-for="item in optionsAmount"
                                    :key="item.rpTypeId"
                                    :label="item.rpAmount"
                                    :value="item.rpAmount">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="原因：" prop="rpReason">
                    <el-input type="textarea" v-model="punishForm.rpReason"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button plain @click="beforeClosePunishForm">取 消</el-button>
                <el-button plain @click="submitPunishForm">保存</el-button>
            </div>
        </el-dialog>
        
        <!--发布任务模态窗-->
        <el-dialog
            :title="dialogTaskFormTitle"
            :visible.sync="dialogTaskForm"
            width="560px"
            :before-close="beforeCloseTaskForm"
            top="10%"
            :close-on-click-modal="false"
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
                        :disabled=" handTaskType === 1 ||(handTaskType === 2 && taskForm.taskStatus != 'TOSUBMIT') || handTaskType === 3"
                         filterable clearable placeholder="请选择执行人" style="width:363px;display:inline-block;" @change="goLink">
                        <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务类型:" v-if="taskForm.taskTypeName">
                    <el-input v-model="taskForm.taskTypeName" disabled style="width:363px;display:inline-block;"></el-input>
                </el-form-item>
                <el-form-item label="任务类型:" v-if="!taskForm.taskTypeName" required prop="taskTypeId" :class="{'is-change': handTaskType === 3 && (auditOldData.taskTypeId != taskForm.taskTypeId)}">
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
                    <el-form-item label="任务性质:" :class="{'is-change': handTaskType === 3 && (auditOldData.taskCategory != taskForm.taskCategory)}" prop="taskCategory">
                        <el-radio-group v-model="taskForm.taskCategory" :disabled="(handTaskType == 2 && taskForm.taskStatus != 'TOSUBMIT') || handTaskType == 3" @change="changeTaskCategory">
                            <el-radio :label="0">单条任务</el-radio>
                            <el-radio :label="1" v-if="!(handTaskType == 1 && !canAddTaskGroup)">任务组任务</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="关联任务组:" v-show="taskForm.taskCategory == 0" :class="{'is-change': handTaskType === 3 && (auditOldData.taskGroupId != taskForm.taskGroupId)}" prop="taskGroupId">
                        <el-select v-model="taskForm.taskGroupId" clearable placeholder="请选择关联任务组" style="width:363px;display:inline-block;">
                            <el-option
                                v-for="item in groupLists"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="任务组成员:" v-show="taskForm.taskCategory == 1" :class="{'is-change': handTaskType === 3 && (auditOldData.taskGropUsers != taskGropUsers)}">
                        <div class="user-right" @click="adduser">添加任务组成员</div>
                        
                        <div class="user-item ellipsis" v-for="(item, index) in taskGropUsers" :key="index">
                            <span class="ellipsis" style="display: inline-block;width: 100%;">{{ item.userName }}</span>
                            <i class="el-icon-circle-close"  @click="removeTodo(index)"></i>
                        </div>
                    </el-form-item>
                    <el-form-item label="关联项目:" :class="{'is-change': handTaskType === 3 && (auditOldData.projectId != taskForm.projectId)}" prop="projectId">
                        <el-select v-model="taskForm.projectId" clearable placeholder="请选择关联项目" style="width:363px;display:inline-block;">
                            <el-option
                                v-for="item in projects"
                                :key="item.projectId"
                                :label="item.projectName"
                                :value="item.projectId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="任务可见范围:" :class="{'is-change': handTaskType === 3 && (auditOldData.value71 != taskForm.value71)}" prop="value71">
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
                <el-button plain @click="beforeCloseTaskForm">取 消</el-button>

                <el-button plain v-if="handTaskType == 1" @click="submitTaskForm(0,$event)" class="saveDrafts">保存草稿</el-button>
                <el-button plain v-if="handTaskType == 1" @click="submitTaskForm(1,$event)">发布任务</el-button>

                <el-button plain v-if="taskForm.canDelete" @click="cancle(handTaskId)">删 除</el-button>
                <el-button plain v-if="handTaskType == 2 && taskForm.taskStatus == 'TOSUBMIT'" @click="submitTaskForm(0,$event)">保存草稿</el-button>
                <el-button plain v-if="handTaskType == 2 && taskForm.taskStatus == 'APPROVEPASS'" @click="submitTaskForm(2,$event)">提 交</el-button>
                <el-button plain v-if="handTaskType == 2 && taskForm.taskStatus == 'TOSUBMIT'" @click="submitTaskForm(1,$event)">发布任务</el-button>

                <el-button plain v-if="handTaskType == 3" @click="submitTaskForm(3,$event)">同意</el-button>
                
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
                <el-button plain @click="beforeCloseAddUserForm">取 消</el-button>
                <el-button plain @click="submitAddUserForm">确 定</el-button>
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
                <el-button plain @click="evaluateFormClose">取 消</el-button>
                <el-button plain @click="submitEvaluateForm">确 认</el-button>
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
                <el-button plain @click="completeFormClose">取 消</el-button>
                <el-button plain @click="submitCompleteForm">确 认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import moment from 'moment'
import {
    getUserTaskDetail,
    seeReplyStatus,
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
    deleteTask,
    remindTaskList,
    assessTask,
    completeTask,
    approveTask,
    userTaskReply,
    listPendingTaskByUserId,
    listFinishTaskByUserId,
    editorUserInfo,
    perfmRpRecordAdd,
    
    getRewardList,
    getRpAmountByType,
    callBackToDraft
} from 'service/getData'
import {  ERR_OK } from 'service/config'
import Sortable from 'sortablejs'


export default {
    data () {
        
        var checkName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入用户名'));
            }
            setTimeout(() => {
                if (!(/^[\u2E80-\u9FFF]+$/.test(value))) {
                    callback(new Error('姓名只能输入汉字'));
                } else {
                    callback();
                }
            }, 50);
        };
        var checkPhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入电话号码'));
            }
            setTimeout(() => {
                if (!(/^1[23456789]\d{9}$/.test(value))) {
                    callback(new Error('电话号码输入有误'));
                } else {
                    callback();
                }
            }, 50);
        };
        var checkTaskTypeId = (rule, value, callback) => {
            if (!value && !this.taskForm.taskTypeName) {
                return callback(new Error('请选择任务类型'));
            } else {
                callback();
            }
        };
        return {
            userView: 'STAFF', // MANAGER   DEPT   STAFF
            userId: '',
            canAddTaskGroup: false, // 是否有创建任务组权限

            tabsType: 0,
            deptLevel: '',

            userInfo: {},

            expands: [],

            
            depet:[], // 部门列表
            optionType: [], //类型列表
            users: [], //执行人列表
            optionsObj: [], // 汇报对象
            groupLists: [], //任务组列表
            projects: [], // 关联项目列表
            

            dialogTaskForm: false,
            dialogTaskFormTitle: '分发任务',
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
                    { validator: checkTaskTypeId }
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
                taskTypeIdBack: "", // 任务类型id备份，用于判断考核任务
                taskTypeName: '', // 任务类型名称，用于判断考核任务
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


            
            pageTabsType: 0, // 待审核 1待评价
            pageData: [],
            pageIndex: 1,
            pageSize: 10,
            pageTotal: 0,
            pageTotalToApprove: 0,
            pageTotalWaitEvaluate: 0,


            
            dialogUserInfoForm: false,
            userInfoForm: {
                userName: '',
                telephone: '',
                email: '',
            },
            userInfoFormRules: {
                userName: [
                    { validator: checkName }
                ],
                email: [
                    { required: true, message: "请输入"},
                    { type: 'email', message: '请输入正确的邮箱地址' }
                ],
                telephone: [
                    { validator: checkPhone }
                ]
            },

            dialogPunishForm: false,
            punishFormType: 0,
            punishForm: {
                rpAmount: '',
                rpReason: '',
                rpTypeId: '',
            },
            punishFormRules: {
                rpAmount: [
                    { required: true, message: "请选择"}
                ],
                rpReason: [
                    { required: true, message: "请输入"}
                ],
                rpTypeId: [
                    { required: true, message: "请选择"}
                ]
            },
            
            optionsType: [],
            optionsAmount: [],
            
        }
    },
    
    computed: {
        id() {
            return this.$route.query.id
        }
    },
    created() {
        this.userId = localStorage.getItem("userId");
        this.deptLevel = localStorage.getItem("deptLevel");
        this.userView = localStorage.getItem("userView");
        this.canAddTaskGroup = localStorage.getItem("canAddTaskGroup") == 'true' ? true : false;

        this.getUserInfo();
        this.pageInit();
        
        console.log('当前用户id',this.userId);
        

    },
    watch: {

    },
    methods: {

        pageInit() {
            this.getPageData(1);
            this.getPageData();

            this.departmentList1(); //获取部门列表
            this.getTaskExecutors(); //获取执行人列表
            this.getProjectLists(); //获取关联项目列表
            this.listAllUsersT(); // 获取所有用户
            
        },
        getUserInfo(){
            getUserTaskDetail({id: this.id}).then((res) => {
                if (res.code == ERR_OK) {
                    this.userInfo = res.data
                }
            })
        },
        // 获取部门列表
        departmentList1() {
            departmentList().then(res => {
                if (res.code == ERR_OK) {
                    this.depet = res.data.result;
                }
            });
        },
        
        
        listAllUsersT() {
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
        getTaskExecutors() {
            listTaskExecutors().then(res => {
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
        
        // 展开某一行
        startExpend(row) {
            
            Array.prototype.remove = function(val) {
                let index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
            if (this.expands.indexOf(row.id) < 0) {
                this.expands = [];
                this.expands.push(row.id);
            } else {
                this.expands.remove(row.id);
            }
            var expanded = this.expands.indexOf(row.id) > -1;

            if (row.taskReplyList && row.taskReplyList[0] && row.taskReplyList[0].replyStatus && row.taskReplyList[0].replyStatus == "UNREAD" && expanded == true) {
                seeReplyStatus({taskReplyId: row.taskReplyList[0].replyId}).then(res => {
                    if (res.code == ERR_OK) {
                    }
                });
            }
        },
        openDetails(row) {
            this.startExpend(row);
        },
        
        // 总经理待审核分页
        pageSizeChange(val) {
            this.pageSize = val;
            this.getPageData()
        },
        pageCurrentChange(val) {
            this.pageIndex = val;
            this.getPageData()
        },
        
        // 总经理待审核
        getPageData(type) {
            this.pageData = [];
            let _tabsType = 0;
            if (type) {
                _tabsType = type;
            } else {
                _tabsType = this.pageTabsType;
            }
            if (_tabsType === 0) {
                listPendingTaskByUserId({
                    userId: this.id,
                    nowPage: this.pageIndex,
                    pageShow: this.pageSize
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        if(!type) {
                            this.pageData = res.data.result;
                            this.pageTotal = res.data.totalCount;
                        }
                        this.pageTotalToApprove = res.data.totalCount;
                    }
                })
            } else {
                
                listFinishTaskByUserId({
                    userId: this.id,
                    nowPage: this.pageIndex,
                    pageShow: this.pageSize
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        if(!type) {
                            this.pageData = res.data.result;
                            this.pageTotal = res.data.totalCount;
                        }
                        this.pageTotalWaitEvaluate = res.data.totalCount;
                    }
                })
            }
        },
        
        pageTabsTypeChange(type) {
            this.pageTabsType = type;
            this.pageIndex = 1;
            this.getPageData();
        },


        goLink(id) {
            this.getReportUsers(id);
            this.getTaskTypesByExecutor(id);
            this.getTaskGroupLists(id); //关联任务组列表
        },
        changeTaskCategory() {
            this.$nextTick(()=> {
                this.$refs.taskForm.clearValidate();
            })
        },
        // 弹窗关闭
        beforeCloseTaskForm() {
            this.taskForm.taskTypeName = '';
            this.taskForm.taskTypeIdBack = ''; // 备份值
            this.$nextTick(()=> {
                this.$refs.taskForm.resetFields();
            })
            this.dialogTaskForm = false;
        },
        submitTaskForm(submitType,event) {
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
                visibleRange: value71,
                planEndDate: time,
                content: this.taskForm.content
            };
            if(!this.taskForm.taskTypeName) {
                params.taskCategory = this.taskForm.taskCategory; // 任务性质
                params.taskTypeId = this.taskForm.taskTypeId;
            } else {
                params.taskCategory = 2;
                params.taskTypeId = this.taskForm.taskTypeIdBack;
            }
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
                this.showButtonLoading(event);
                saveDraftTask(params).then(res => {
                    this.removeButtonLoading(event);
                    if (res.code == ERR_OK) {
                        this.beforeCloseTaskForm();
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
                        this.showButtonLoading(event);
                        publishTask(params).then(res => {
                            this.removeButtonLoading(event);
                            if (res.code == ERR_OK) {
                                this.beforeCloseTaskForm();
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
                        this.showButtonLoading(event);
                        sureEditorTask(params).then(res => {
                            this.removeButtonLoading(event);
                            if (res.code == ERR_OK) {
                                this.beforeCloseTaskForm();
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
                        this.showButtonLoading(event);
                        approveTask(params).then(res => {
                            this.removeButtonLoading(event);
                            if (res.code == ERR_OK) {
                                this.beforeCloseTaskForm();
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
            this.taskForm.canDelete = false; // 是否可删除状态
            this.taskForm.taskStatus = '';
            this.auditOldData = {};// 审核旧数据
            this.handTaskType = 1; // 1.新增  2.编辑 3.审核
            this.dialogTaskFormTitle = '分发任务';

            this.taskGropUsers = [];
            this.dialogTaskForm = true;
            this.goLink(this.taskForm.executorId);
        },
        // 编辑任务
        editTask(id) {
            this.taskGropUsers = [];
            this.handTaskType = 2; // 1.新增  2.编辑 3.审核
            this.dialogTaskFormTitle = '编辑任务';
            this.dialogTaskForm = true;
            this.handTaskId = id; //记录当前编辑id
            this.taskForm.canDelete = false; // 是否可删除状态
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

                        // 考核任务判断
                        if (this.taskForm.taskCategory == 2) {
                            this.taskForm.taskCategory = 0;
                            this.taskForm.taskTypeName = res.data.taskTypeName;
                            this.taskForm.taskTypeIdBack = res.data.taskTypeId; // 备份值
                        }

                        this.taskForm.taskGroupId = res.data.taskGroupId ? res.data.taskGroupId : '';
                        
                        this.taskForm.modifyReason = res.data.modifyReason;
                        this.taskForm.projectId = res.data.projectId ? res.data.projectId : '';
                        this.taskForm.taskStatus = res.data.taskStatus; // 状态
                        this.taskForm.canDelete = res.data.canDelete; // 可否删除
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
            this.dialogTaskForm = true;
            this.handTaskId = id; //记录当前编辑id
            this.taskForm.canDelete = false; // 是否可删除状态

            editorTaskMain({
                id: id
            }).then(res => {
                if (res.code == ERR_OK) {
                    this.$nextTick(()=> {
                        this.auditOldData = Object.assign({},res.data);
                        if(!this.auditOldData.taskGroupId) {
                            this.auditOldData.taskGroupId = '';
                        }
                        if(!this.auditOldData.projectId) {
                            this.auditOldData.projectId = '';
                        }
                        
                        this.taskForm.title = res.data.title;
                        this.taskForm.executorId = res.data.executorId;
                        this.goLink(this.taskForm.executorId);
                        this.taskForm.taskTypeId = res.data.taskTypeId;
                        this.taskForm.reportId = res.data.reportId;
                        this.taskForm.taskWorkload = res.data.taskWorkload;
                        this.taskForm.planEndDate = res.data.planEndDate;
                        this.taskForm.content = res.data.content;
                        this.taskForm.taskCategory = res.data.taskCategory;
                        // 考核任务判断
                        if (this.taskForm.taskCategory == 2) {
                            this.taskForm.taskCategory = 0;
                            this.auditOldData.taskCategory = 0;
                            this.taskForm.taskTypeName = res.data.taskTypeName;
                            this.taskForm.taskTypeIdBack = res.data.taskTypeId; // 备份值
                        }
                        this.taskForm.taskGroupId = res.data.taskGroupId ? res.data.taskGroupId : '';
                        
                        this.taskForm.modifyReason = res.data.modifyReason;
                        this.taskForm.projectId = res.data.projectId ? res.data.projectId : '';
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
        cancle(id) {
            
            this.$prompt('请输入删除原因：', '申请删除任务', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputType: 'textarea',
                inputPattern: /^[\s\S]{1,400}$/,
                inputErrorMessage: '请输入（400字符内）'
            }).then(({ value }) => {
                deleteTask({
                    id: id,
                    reason: value
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        this.beforeCloseTaskForm();
                        this.pageInit();
                        this.$notify({
                            title: "成功",
                            message: "任务已删除",
                            type: "success"
                        });
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: "提示",
                            message: res.msg
                        });
                    }
                })
            }).catch(() => {
            });
        },

        // 提醒完成
        tipCompleteModal(id){
            remindTaskList({
                id: id
            }).then((res) => {
                if(res.code == ERR_OK) {
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
            this.taskForm.canDelete = false; // 是否可删除状态
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
            this.taskForm.canDelete = false; // 是否可删除状态
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
        // 快捷回复
        replyTask(row, event){
            let val = event.target.parentNode.childNodes[0].value;
            
            if(val.trim().length > 200) {
                this.$notify({
                    title: '提示',
                    message:'回复内容不能超过200个字符！'
                });
            }else{
                userTaskReply({
                    taskId: row.id,
                    replyDesc: val
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        event.target.parentNode.childNodes[0].value = '';
                        this.$set(row, 'taskReplyList', res.data);
                        
                        this.$notify({
                            title: '成功',
                            message: '恭喜你，回复成功',
                            type: 'success'
                        });
                    }else{
                        this.$notify.error({
                            title: '错误',
                            message: res.msg
                        });
                    }
                })
            }
        },

        // 指定执行人新增
        addTaskByExecutorId() {
            this.taskForm.executorId = parseInt(this.id);
            this.goLink(this.taskForm.executorId)
            this.addTask();
        },

        
        editUserInfo() {
            this.userInfoForm.userName = this.userInfo.userName;
            this.userInfoForm.telephone = this.userInfo.telephone;
            this.userInfoForm.email = this.userInfo.email;
            this.dialogUserInfoForm = true;
        },
        beforeCloseUserInfoForm() {
            this.$refs.userInfoForm.resetFields();
            this.dialogUserInfoForm = false;
        },
        submitUserInfoForm() {
            
            this.$refs.userInfoForm.validate((valid) => {
                if (valid) {
                    editorUserInfo({
                        userId: this.id,
                        userName: this.userInfoForm.userName,
                        telephone: this.userInfoForm.telephone,
                        email: this.userInfoForm.email
                    }).then(res => {
                        if (res.code == ERR_OK) {
                            this.beforeCloseUserInfoForm(); // 关闭弹窗
                            this.$notify({
                                title: "成功",
                                message: "修改个人信息成功",
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

        //获取奖惩类型列表
        _getRewardList(){
            getRewardList().then((res) =>{
                if (res.code == ERR_OK) {
                    this.optionsType = res.data.result;
                    if(res.data.result.length>0){
                        this.punishForm.rpTypeId = res.data.result[0].rpTypeId;
                        this._getRpAmountByType()
                    }
                }
            })
        },
        //金额
        _getRpAmountByType(){
            getRpAmountByType({
                rpTypeId: this.punishForm.rpTypeId
            }).then((res) =>{
                if (res.code == ERR_OK) {
                    this.optionsAmount=res.data;
                }
            })
        },
        
        addPunish(type) {
            this.punishFormType = type;
            
            this.punishForm.rpAmount = '';
            this.punishForm.rpReason = '';
            this.dialogPunishForm = true;
            this._getRewardList();
        },
        beforeClosePunishForm() {
            this.$refs.punishForm.resetFields();
            this.dialogPunishForm = false;
        },
        submitPunishForm() {
            this.$refs.punishForm.validate((valid) => {
                if (valid) {
                    
                    let params = {
                        userId: this.id,
                        rpAmount: this.punishForm.rpAmount,
                        rpReason: this.punishForm.rpReason
                    }
                    if (this.punishFormType == 0) {
                        // 惩罚
                        params.rpType = 'PUNISH';
                    } else {
                        // 奖励
                        params.rpType = 'REWARD';
                    }
                    perfmRpRecordAdd().then(res => {
                        if (res.code == ERR_OK) {
                            this.beforeClosePunishForm(); // 关闭弹窗
                            this.$notify({
                                title: "成功",
                                message: type == 0 ? '惩罚发起成功' : '奖励发起成功',
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
        // 撤回任务
        callBackTask(id) {
            this.$prompt('请输入撤回原因：', '撤回任务', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputType: 'textarea',
                inputPattern: /^[\s\S]{1,400}$/,
                inputErrorMessage: '请输入（400字符内）'
            }).then(({ value }) => {
                callBackToDraft({
                    id: id,
                    reason: value
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        this.pageInit();
                        this.$notify({
                            title: "成功",
                            message: "任务已撤回",
                            type: "success"
                        });
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: "提示",
                            message: res.msg
                        });
                    }
                })
            }).catch(() => {
            });
        }
    }
}
</script>

<style scoped lang="scss">
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
    background: #D93538;
    border-radius: 4px;
}
.take-right-txt {
    width: 84px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    margin-top: 8px;
    margin-right: 20px;
    float: right;
    cursor: pointer;
    font-size: 14px;
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
.dialog-footer button:last-child {
    color: #D93437;
    border: 1px solid #D83436;
}
.take-total {
    background: #fff;
    line-height: 30px;
    padding: 8px 0;
    & > ul {
        display: inline-block;
        width: 100%;
        clear: both;
        li {
            float: left;
            line-height: 30px;
            margin-left: 69px;
            font-size: 14px;
            &:first-child {
                margin-left: 32px;
                min-width: 120px;
            }
        }
    }
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

.el-form-item.is-change /deep/ .el-form-item__label {
    color: red;
}
.el-button + .link-btn {
    margin-left: 10px;
}
.idss-list-top-tabs {
    .idss-list-top-tabs-item {
        float: left;
        min-width: 140px;
        text-align: center;
        padding: 0 10px;
        line-height: 44px;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        &.active {
            border-color: #C2453A;
            color: #C2453A;
        }
    }
}

.user-content{
    display: inline-block;
    width: 100%;
    padding: 10px 20px;
    background: #fff;
    overflow: hidden;
}
.user-content ul li{
    width: 33%;
    float: left;
    height:27px;
    font-size: 12px;
    color: #434343;
    line-height: 27px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;

}
</style>
