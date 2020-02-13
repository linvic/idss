<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">任务管理</span> /
            <router-link to="/taskManage/taskManage">
                <span class="child1">任务列表</span>
            </router-link> /
            <span class="child2">任务详情</span>
        </div>
        <!-- 基本信息 -->
        <div class="uncomplete-task" >
            <div class="user-title">
                <div class="title-name1">
                {{detailInfo.title || '-'}}{{detailInfo.completionDesc ? ('('+detailInfo.completionDesc+')') : ''}}
                </div>
                <div class="" style="float:right;margin-right:47px;">
                    <el-button
                        size="small"
                        type="primary"
                        plain
                        v-if="detailInfo.canAdd"
                        @click.stop='addTask'>添加任务</el-button>

                    <el-button
                        size="small"
                        type="primary"
                        plain
                        v-if="detailInfo.canApprove"
                        @click.stop='auditTask(detailInfo.id)'>审核</el-button>
                    <el-button
                        size="small"
                        type="primary"
                        plain
                        :disabled="detailInfo.hadremind == 1"
                        v-if="detailInfo.canRemind"
                        @click.stop='tipCompleteModal(detailInfo.id)'>提醒完成</el-button>
                    <el-button
                        size="small"
                        type="primary"
                        plain
                        v-if="detailInfo.canEvaluate"
                        @click.stop='levelComeplete(detailInfo.id)'>任务评价</el-button>
                    
                    <el-button
                        size="small"
                        type="primary"
                        plain
                        v-if="detailInfo.canFinish"
                        @click.stop='completeModal(detailInfo.id)'>完成</el-button>

                    <el-button
                        size="small"
                        type="primary"
                        plain
                        v-if="detailInfo.canEdit"
                        @click.stop="editTask(detailInfo.id)">编辑任务</el-button>

                </div>
            </div>
            <div class="notice-wrapper" style="border-left:none;border-right:none;">
                <el-row :gutter="20">
                    <el-col :span="6">
                    任务类别：{{detailInfo.taskTypeName || '-'}}
                    </el-col>
                    <el-col :span="6">
                    发布人：{{detailInfo.createByName || '-'}}
                    </el-col>
                    <el-col :span="6">
                    更新时间：{{detailInfo.updateTimeDesc || '-'}}
                    </el-col>
                    <el-col :span="6">
                    任务状态：
                    <img class="icon_type" v-if="detailInfo.taskStatus === 'APPROVEPASS'" src="../../images/timeLate.png" alt=""  />
                    {{detailInfo.taskStatusName}}
                    </el-col>
                    <el-col :span="6">
                    关联项目：{{detailInfo.projectName || '-'}}
                    </el-col>
                    <el-col :span="6">
                    执行人：{{detailInfo.executorName || '-'}}
                    </el-col>
                    <el-col :span="6">
                    任务用时：{{detailInfo.taskConsumeTimeDesc || '-'}}
                    </el-col>
                    <el-col :span="6">
                    任务工作量：{{detailInfo.taskWorkload || '-'}}
                    </el-col>
                    <el-col :span="6">
                        <span v-if="detailInfo.taskCategory == 0">
                            关联任务组：
                            <a href="javascript:;" @click="linkTaskGroupDetail(detailInfo.taskGroupId)" v-if="detailInfo.isTaskGroupAccess">
                                {{detailInfo.taskGroupName || '-'}}
                            </a>
                            <span v-else>{{detailInfo.taskGroupName || '-'}}</span>
                        </span>
                        <span v-if="detailInfo.taskCategory == 1">
                            任务组成员：{{detailInfo.taskGroupMemberNames || '-'}}
                        </span>
                    
                    </el-col>
                    <el-col :span="6">
                    汇报人：{{detailInfo.reportName || '-'}}
                    </el-col>
                    <el-col :span="6">
                    到期时间：{{detailInfo.planEndDate || '-'}}
                    </el-col>
                    <el-col :span="24">
                    任务内容：{{detailInfo.content || '-'}}
                    </el-col>
                </el-row>
                
            </div>
        </div>

        <!-- 任务评价列表 -->
        <div class="uncomplete-task" style="margin-top:20px;border:none;" v-if="takeComment && takeComment.length > 0">
            <div class="user-title" style="border: 1px solid rgba(0,0,0,0.12);border-bottom: none;box-sizing: border-box;">
                <div class="title-name1">任务完成评价</div>
            </div>
                <div class="notice-wrapper">
                    <div class="take-comment-list" v-if="detailInfo.completionDate"><span>任务完成时间：{{detailInfo.completionDate}}</span></div>
                    <div class="take-comment-list" v-for="(item,index) in takeComment" :key="index">
                        <span>{{item.label}}：</span>
                        <span>{{item.taskScore}}分</span>
                        <span>{{item.taskComment}}</span>
                        <span>{{item.taskCommentTime}}</span>
                    </div>
                </div>
        </div>
        <!-- 任务动态 -->
        <div class="uncomplete-task" style="margin-top:20px;">
            <div class="user-title" style="border:none;">
                <div class="title-name1">任务动态</div>
            </div>
            <div class="notice-wrapper" style="border:none;">
                <div style="overflow:hidden;">
                <div class="" style="width:280px;margin-bottom:15px;margin-right:50px;float:left;">
                    <el-input v-model="quicklyContent" placeholder="输入内容快捷回复"></el-input>
                </div>
                <div style="float:left;margin-top:3px;" v-if='quicklyContent'>
                    <el-button size="small" type="primary" plain @click.stop='replyTask'>回复</el-button>
                </div>

                </div>
                <div :class="{'notice-reback' : true, 'isSeeMoreTaskReplys': isSeeMoreTaskReplys}" v-for="(item,index) in taskReplys" :key="index" v-if="isSeeMoreTaskReplys || index < 2">
                    <div class="" style="overflow:hidden;">
                        <div class="notice-reback-left" v-if="item.replySource == 0">
                            <span style="color:#d83436;cursor:pointer;">{{item.createUser.userName}}</span> 回复 <span style="color:#d83436;cursor:pointer;">{{item.replyUser.userName}}</span>： {{item.replyContent}}
                        </div>
                        <div class="notice-reback-left" v-else>
                            <span style="color:#d83436;cursor:pointer;">{{item.createUser.userName}}</span> {{item.replyContent}}
                        </div>
                        <div class="notice-reback-right" @click='reply'>
                        回复
                        </div>
                        <div class="notice-reback-mid">{{item.replyTimeDistanceDesc}}</div>
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
                <div v-if="!taskReplys || taskReplys.length==0" style="text-align: center;color:#5e7382;font-size: 14px">暂无任务动态</div>
            </div>
        </div>
        <div v-if="taskReplys && taskReplys.length > 3">
            <div class="seeMany" v-show='!isSeeMoreTaskReplys' @click="isSeeMoreTaskReplys = !isSeeMoreTaskReplys">
                查看更多
            </div>
            <div class="seeMany" v-show='isSeeMoreTaskReplys' @click="isSeeMoreTaskReplys = !isSeeMoreTaskReplys">
                点击收起<img src="../../images/ssemany.png" alt="" style='display:inline-block;margin-bottom:1px;'>
            </div>
        </div>
        <!-- 子任务列表 -->
        <div v-if="detailInfo && detailInfo.groupTaskList && detailInfo.groupTaskList.length > 0">
            <div class="take-top-wrapper m-t-10">
                <div class="take-left">
                    <div class="take-top" style="font-size: 14px;font-weight:normal">子任务列表</div>
                </div>
                <!-- <div class="take-bottom">
                    <div class="task-item" v-bind:class="{ active: tabsType === 0 }" @click="tabsTypeChange(0)">待处理</div>
                    <div class="task-item" v-bind:class="{ active: tabsType === 1 }" @click="tabsTypeChange(1)">全部任务</div>
                </div> -->
            </div>
            <div class="untreatTask-table mytask">
                
                <el-table
                    :data="detailInfo.groupTaskList"
                    row-key="id"
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
                                            <span @click="replyTask( props.row.index, props.row.id, $event)"
                                                class="replyValue">回复</span>
                                        </div>
                                        <div v-for="(item,index) in props.row.taskReplyList" :key="index">
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
                                <img class="icon_type" v-if="props.row.taskStatus === 'APPROVEPASS'" src="../../images/timeLate.png" alt=""  />
                                <span v-if="props.row.taskStatus === 'CANCELED' || props.row.taskStatus === 'COMPLETION'">{{props.row.taskStatusName}}</span>
                                <span v-else style="color:#D93437;">{{props.row.taskStatusName}}</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                
            </div>
        </div>
        <!-- 任务操作记录 -->
        <div class="record-wrapper">
            <div class="record-title">
                <div class="" style="margin-left:20px;">任务操作记录</div>
            </div>
            <div class="get-reward">
                <el-table
                :data="tableReward"
                style="width: 100%" empty-text='暂无数据'>
                    <el-table-column
                        prop="userName"
                        label="姓名">
                        <template slot-scope="props">
                        <!-- <router-link :to="{path:'/setCenter/userDetail',  query:{id: props.row.userId}}"  > -->
                            <span class="department-name" style="color:#D93538;">{{props.row.userName}}</span>
                        <!-- </router-link> -->
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="时间"></el-table-column>
                    <el-table-column prop="changeName" label="操作名称"></el-table-column>
                    <el-table-column label="操作描述">
                        <template slot-scope="scope">
                            <span v-html="scope.row.changeContent.replace(/\\n/gm, '<br>')"></span>
                        </template>
                    </el-table-column>
                </el-table>
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
                        :disabled="(handTaskType === 2 && taskForm.taskStatus != 'TOSUBMIT') || handTaskType === 3 "
                         filterable clearable placeholder="请选择执行人" style="width:363px;display:inline-block;" @change="goLink">
                        <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
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
                    <el-form-item label="任务性质:" :class="{'is-change': handTaskType === 3 && (auditOldData.taskCategory != taskForm.taskCategory)}" prop="taskCategory">
                        <el-radio-group v-model="taskForm.taskCategory" :disabled="(handTaskType === 2 && taskForm.taskStatus != 'TOSUBMIT') || handTaskType === 1  || handTaskType === 3" @change="changeTaskCategory">
                            <el-radio :label="0">单条任务</el-radio>
                            <el-radio :label="1" v-if="!(handTaskType == 1 && !canAddTaskGroup)">任务组任务</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    
                    <el-form-item label="关联任务组:" v-show=" handTaskType == 1 && taskForm.taskCategory == 0">
                        <el-input disabled v-model="detailInfo.title" style="width:363px;display:inline-block;"></el-input>
                    </el-form-item>
                    <el-form-item label="关联任务组:" v-show=" handTaskType != 1 && taskForm.taskCategory == 0" :class="{'is-change': handTaskType === 3 && (auditOldData.taskGroupId != taskForm.taskGroupId)}" prop="taskGroupId">
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
                            v-for="(item,index) in usersT"
                            :key="index"
                            :label="item.userName"
                             clearable
                            :value="item.userId">
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
    </div>
</template>

<script>
import moment from 'moment'
import {
    getTaskGroupDetail,
    departmentList,
    listByExecutor,
    listTaskExecutors,
    listReportingUsers,
    listPendingTaskByTaskTypeId,
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
    replyTask,
    getTaskEvaluate,
    changeLogLists,
    userTaskReply,
    listTaskReply,
    replyTaskReply,
    seeReplyStatus
} from 'service/getData'
import {  ERR_OK } from 'service/config'
import Sortable from 'sortablejs'
export default {
    name: 'taskManageDetail',
    computed: {
        id() {
            return this.$route.query.id
        }
    },
    data () {
        return {
            deptLevel: '',
            userView: 'STAFF', // MANAGER   DEPT   STAFF
            userId: '',
            canAddTaskGroup: false, // 是否有创建任务组权限
            
            detailInfo: {},
            isCurHandLevel: false, // 是否具有当前操作层级

            
            depet:[], // 部门列表
            optionType: [], //类型列表
            users: [], //执行人列表
            usersBack: [], //执行人列表
            optionsObj: [], // 汇报对象
            groupLists: [], //任务组列表
            projects: [], // 关联项目列表
            
            
            openTaskTypeId: '', // 当前打开的id 手风琴效果

            dialogTaskForm: false,
            dialogTaskFormTitle: '添加任务',
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
            
            

            
            taskReplys: [], //任务动态
            quicklyContent: '', //快捷回复内容
            isSeeMoreTaskReplys: false,

            
            takeComment: [], // 任务评价列表
            isSeeMoreTaskComment: false,

            tableReward: [], //任务操作记录
            
            tabsType: 0,
            expands: [],
        }
    },
    created() {
        this.userId = localStorage.getItem("userId");
        this.userView = localStorage.getItem("userView");
        this.deptLevel = localStorage.getItem("deptLevel");
        this.canAddTaskGroup = localStorage.getItem("canAddTaskGroup") == 'true' ? true : false;
        
        this.pageInit();
        
        console.log('当前用户id',this.userId);
        

    },
    watch: {

    },
    methods: {

        pageInit() {
            
            this.getBaseData(); // 获取我的任务
            this.getTaskEvaluates(); // 获取任务评价列表
            this.getTaskChangeLog(); //获取任务操作记录
            this.getListTaskReply(); //获取回复动态

            this.departmentList1(); //获取部门列表
            this.getTaskExecutors(); //获取执行人列表
            this.getProjectLists(); //获取关联项目列表
            this.listAllUsersT(); // 获取所有用户
        },
        //获取任务基础数据
        getBaseData() {
            getTaskGroupDetail({
                id: this.id
            }).then((res) => {
                if(res.code == ERR_OK) {
                    this.detailInfo = res.data;
                    this.isCurHandLevel = false;
                    // 当前层级 与 操作层级是否匹配
                    if (res.data.approveLevel == 0 && this.deptLevel == 'LEVEL_ZERO') {
                        this.isCurHandLevel = true;
                    } 
                    if (res.data.approveLevel == 1 && this.deptLevel == 'LEVEL_ONE') {
                        this.isCurHandLevel = true;
                    } 
                    if (res.data.approveLevel == 2 && this.deptLevel == 'LEVEL_TWO') {
                        this.isCurHandLevel = true;
                    }
                    console.log('最新状态',this.isCurHandLevel, res.data.approveLevel , this.deptLevel)
                }
            })
        },
        
        getListTaskReply() {
            
            listTaskReply({
                taskId: this.id
            }).then((res) => {
                if(res.code == ERR_OK) {
                    this.taskReplys = res.data;
                }else{
                    this.$notify.error({
                        title: '错误',
                        message:res.msg
                    });
                }
            })
        },
        // 获取任务评价列表
        getTaskEvaluates(){
            getTaskEvaluate({
                taskId: this.id
            }).then((res) => {
                if(res.code == ERR_OK) {
                    this.takeComment = res.data;
                }else{
                    this.$notify.error({
                        title: '错误',
                        message:res.msg
                    });
                }
            })
        },
        // 获取任务操作记录
        getTaskChangeLog() {
            changeLogLists({
                logType: 1,
                moduleId: this.id
            }).then((res) => {
                if(res.code == ERR_OK) {
                    this.tableReward = res.data;
                }else {
                    this.$notify.error({
                        title: '错误',
                        message:res.msg
                    });
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
                    this.usersBack = res.data;
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
        getReportUsers(userId) {
            this.optionsObj = [];
            this.taskForm.reportId = '';
            listReportingUsers({
                userId: userId
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
        getTaskTypesByExecutor(userId) {
            listByExecutor({
                userId: userId
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
                                    message: "添加任务成功",
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
        // 新增任务 添加任务 添加任务
        addTask() {
            this.handTaskId = ''; //非编辑模式
            this.auditOldData = {};// 审核旧数据
            this.handTaskType = 1; // 1.新增  2.编辑 3.审核
            this.dialogTaskFormTitle = '添加任务';

            this.dialogTaskForm = true;
            this.$nextTick(()=> {
                this.taskForm.taskStatus = '';

                let ids = this.detailInfo.taskGroupMemberIds ? this.detailInfo.taskGroupMemberIds.split(',') : [];
                let names = this.detailInfo.taskGroupMemberNames ? this.detailInfo.taskGroupMemberNames.split(',') : [];
                let _users = [];
                if (ids && ids.length > 0) {
                    for(var i = 0, l = ids.length; i < l;i++) {
                        if (i == 0) {
                            this.taskForm.executorId = parseInt(ids[i]);
                            this.goLink(parseInt(ids[i]))
                        }
                        _users.push({
                            userId: parseInt(ids[i]),
                            userName: names[i]
                        })
                    }
                }
                this.users = [..._users];
                this.taskForm.taskCategory = 0;
                this.taskForm.taskGroupId = this.detailInfo.id;


                this.taskGropUsers = [];
                

            })
            
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
            this.users = this.usersBack;
            this.dialogTaskForm = true;
            this.handTaskId = id; //记录当前编辑id
            this.auditOldData = {}; //审核旧数据
            
            this.$nextTick(()=> {

                    this.taskForm.title = this.detailInfo.title;
                    this.taskForm.executorId = this.detailInfo.executorId;
                    
                    this.goLink(this.taskForm.executorId);
                    this.taskForm.taskTypeId = this.detailInfo.taskTypeId;
                    this.taskForm.reportId = this.detailInfo.reportId;
                    this.taskForm.taskWorkload = this.detailInfo.taskWorkload;
                    this.taskForm.planEndDate = this.detailInfo.planEndDate;
                    this.taskForm.content = this.detailInfo.content;
                    this.taskForm.taskCategory = this.detailInfo.taskCategory;
                    this.taskForm.taskGroupId = this.detailInfo.taskGroupId ? this.detailInfo.taskGroupId : '';
                    
                    this.taskForm.modifyReason = this.detailInfo.modifyReason;
                    this.taskForm.projectId = this.detailInfo.projectId;
                    this.taskForm.taskStatus = this.detailInfo.taskStatus; // 状态
                    
                    if (!this.detailInfo.visibleRange) {
                        this.taskForm.value71 = [];
                    } else {
                        this.taskForm.value71 = this.detailInfo.visibleRange.split(",");
                    }

                    var _taskGropUsers = [];
                    if (this.detailInfo.taskGroupMemberIds && this.detailInfo.taskGroupMemberIds.length > 0) {
                        var _taskGroupMemberIds = this.detailInfo.taskGroupMemberIds.split(',');
                        var _taskGroupMemberName = this.detailInfo.taskGroupMemberNames.split(',');

                        for (var i = 0, l = _taskGroupMemberIds.length; i < l; i++) {
                            
                            _taskGropUsers.push({
                                userId: _taskGroupMemberIds[i],
                                userName: _taskGroupMemberName[i]
                            });
                            
                        }
                    }
                    this.taskGropUsers = [..._taskGropUsers];
            

            })
        
        },
        // 审核任务 
        auditTask(id) {
            this.taskGropUsers = [];

            this.handTaskType = 3; // 1.新增  2.编辑 3.审核
            this.dialogTaskFormTitle = '审核任务';
            this.users = this.usersBack;
            this.dialogTaskForm = true;
            this.handTaskId = id; //记录当前编辑id
                this.$nextTick(()=> {
                    this.auditOldData = Object.assign({},this.detailInfo);
                    if(!this.auditOldData.taskGroupId) {
                        this.auditOldData.taskGroupId = '';
                    }
                    
                    this.taskForm.title = this.detailInfo.title;
                    this.taskForm.executorId = this.detailInfo.executorId;
                    this.goLink(this.taskForm.executorId);
                    this.taskForm.taskTypeId = this.detailInfo.taskTypeId;
                    this.taskForm.reportId = this.detailInfo.reportId;
                    this.taskForm.taskWorkload = this.detailInfo.taskWorkload;
                    this.taskForm.planEndDate = this.detailInfo.planEndDate;
                    this.taskForm.content = this.detailInfo.content;
                    this.taskForm.taskCategory = this.detailInfo.taskCategory;
                    this.taskForm.taskGroupId = this.detailInfo.taskGroupId ? this.detailInfo.taskGroupId : '';
                    
                    this.taskForm.modifyReason = this.detailInfo.modifyReason;
                    this.taskForm.projectId = this.detailInfo.projectId;
                    this.taskForm.taskStatus = this.detailInfo.taskStatus; // 状态
                    
                    if (!this.detailInfo.visibleRange) {
                        this.taskForm.value71 = [];
                    } else {
                        this.taskForm.value71 = this.detailInfo.visibleRange.split(",");
                    }

                    
                    var _taskGropUsers = [];
                    if (this.detailInfo.taskGroupMemberIds && this.detailInfo.taskGroupMemberIds.length > 0) {
                        var _taskGroupMemberIds = this.detailInfo.taskGroupMemberIds.split(',');
                        var _taskGroupMemberName = this.detailInfo.taskGroupMemberNames.split(',');

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
        
        cancleTo (event){
            let el = event.target
            el.parentNode.parentNode.style.display = 'none'
            el.parentNode.parentNode.parentNode.childNodes[0].childNodes[2].style.display = 'block'
        },
        repleyTo(val,event){
            let el = event.target
            let replyDesc = el.parentNode.parentNode.childNodes[0].childNodes[2].childNodes[0].value
            
            const params ={
                taskId:this.id,
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
                    this.getListTaskReply();
                    this.$notify({
                        title: '成功',
                        message: '回复成功',
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
        reply (event) {
            let el = event.target.parentNode.parentNode.childNodes[2]
            let el1 = event.target
            el.childNodes[0].childNodes[2].childNodes[0].value = ''
            el1.style.display = 'none'
            el.style.display = 'block'
        },
        // 快捷回复
        replyTask(){
            if(this.quicklyContent.trim().length > 200) {
                this.$notify({
                    title: '提示',
                    message:'回复内容不能超过200个字符！'
                });
            }else{
                userTaskReply({
                    taskId: this.id,
                    replyDesc: this.quicklyContent
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        this.getListTaskReply();
                        this.quicklyContent = ''
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

        
        linkTaskGroupDetail(id) {
            this.$router.push({
                path: '/taskManage/taskDetail',
                query: {
                    id: id
                }
            })
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
        
    }
}
</script>

<style scoped lang="scss">
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
.notice-wrapper  .el-col {
    font-size: 13px;
    line-height: 27px;
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
    height: 80px;
    background: #F4F4FE;
    margin-top: 7.5px;
    padding-top: 12px;
    padding-left: 20px;
    padding-right: 24px;
    display: flex;
    padding-bottom: 12px;
    border: 1px solid rgba(0, 0, 0, 0.12);
}
.content-right{
    flex: 1;
}
.content-right textarea{
    width: 100%;
    height: 75px;
    font-size: 12px;
    color: #434343;
    padding: 0 5px;
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

    .special1 .el-icon-warning {
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
.el-form-item.is-change /deep/ .el-form-item__label {
    color: red;
}
.take-comment-list span{
    line-height: 30px;
    font-size: 14px;
    margin-right: 40px;
    display: inline-block;
    min-width: 150px;
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
</style>
