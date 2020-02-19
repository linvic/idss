<template>
    <div class="wrapper" ref="taskManagerPage" v-loading.fullscreen.lock="loading">
        <div class="router-wrapper">
            <span class="child1">任务管理</span> /
            <span class="child2">任务列表</span>
        </div>
        <!-- 任务统计数据 -->
        <div v-if="userView != 'STAFF'" class="m-b">
            <div class="take-top-wrapper">
                <div class="take-left">
                    <div class="take-top" style="font-size: 14px;font-weight:normal">{{userView == 'MANAGER' ? '任务列表' : taskCountInfo.deptName}}</div>
                </div>
                <div class="take-right" @click="addTask">发起任务</div>
                <div class="take-right-txt" @click="changeViewType" v-if="userView != 'STAFF'">切换视图</div>
                
            </div>
            <div class="take-total">
                <ul>
                    <li>待处理任务数： {{taskCountInfo.pendingTaskCount}}</li>
                    <li>未完成任务数： {{taskCountInfo.incompleteTaskCount}}</li>
                    <li>总任务数： {{taskCountInfo.totalTaskCount}}</li>
                </ul>
            </div>
        </div>

        <!-- 员工任务待处理 -->
        <div v-if="userView == 'DEPT'">
            <div class="take-top-wrapper m-t-10">
                <div class="take-top" style="font-size: 14px;font-weight:normal">员工任务待处理({{pendingTotal || '0'}})</div>
            </div>
            <div class="untreatTask-table">
                <el-table
                    :data="result1"
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
                                <img class="icon_type" v-if="props.row.taskStatus === 'APPROVEPASS'" src="../../images/timeLate.png" alt=""  />
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
                                v-if="props.row.canApprove"
                                @click.stop='auditTask(props.row.id)'>审核</el-button>
                            <el-button
                                size="small"
                                type="primary"
                                plain
                                :disabled="props.row.hadremind == 1"
                                v-if="props.row.canRemind"
                                @click.stop='tipCompleteModal(props.row.id)'>提醒完成</el-button>
                            <el-button
                                size="small"
                                type="primary"
                                plain
                                v-if="props.row.canEvaluate"
                                @click.stop='levelComeplete(props.row.id)'>任务评价</el-button>
                            
                            <el-button
                                size="small"
                                type="primary"
                                plain
                                v-if="props.row.canEdit"
                                @click.stop="editTask(props.row.id)">编辑任务</el-button>

                                    
                            <router-link class="link-btn" :to="{path: '/taskManage/taskDetail',query: { id: props.row.id }}">
                                <el-button size="small" 
                                type="primary"
                                @click.stop=""
                                plain>查看</el-button>
                            </router-link>

                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div v-if="userView == 'MANAGER'">
            <!-- 待审核 待评价 -->
            
            <div class="idss-list m-b">
                <div class="idss-list-top">
                    <div class="idss-list-top-title">
                        <div class="idss-list-top-tabs">
                            <div class="idss-list-top-tabs-item" v-bind:class="{ active: pageTabsType === 0 }" @click="pageTabsTypeChange(0)">待审核({{pageTotalToApprove || '0'}})</div>
                            <div class="idss-list-top-tabs-item" v-bind:class="{ active: pageTabsType === 1 }" @click="pageTabsTypeChange(1)">待评价({{pageTotalWaitEvaluate || '0'}})</div>
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
                    <el-table-column label="操作">
                        <template slot-scope="props">
                            
                            <el-button
                                size="small"
                                type="primary"
                                plain
                                v-if="props.row.canApprove"
                                @click.stop='auditTask(props.row.id)'>审核</el-button>
                            <el-button
                                size="small"
                                type="primary"
                                plain
                                v-if="props.row.canEvaluate"
                                @click.stop='levelComeplete(props.row.id)'>任务评价</el-button>
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
        <!-- 我的任务 -->
        <div class="take-top-wrapper m-t-10">
            <div class="take-left">
                <div class="take-top" style="font-size: 14px;font-weight:normal">我的任务</div>
            </div>
            <div class="take-right" @click="addTask" v-if="userView == 'STAFF'">发起任务</div>
            <div class="take-bottom">
                <div class="task-item" v-bind:class="{ active: tabsType === 0 }" @click="tabsTypeChange(0)">待处理({{myPendingTotal || '0'}})</div>
                <div class="task-item" v-bind:class="{ active: tabsType === 1 }" @click="tabsTypeChange(1)">全部任务</div>
            </div>
        </div>
        <div class="untreatTask-table mytask m-b">
            
            <el-table
                :data="result"
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
                            <img class="icon_type" v-if="props.row.taskStatus === 'APPROVEPASS'" src="../../images/timeLate.png" alt=""  />
                            
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

                                
                        <router-link class="link-btn" :to="{path: '/taskManage/taskDetail',query: { id: props.row.id }}">
                            <el-button size="small" 
                                type="primary"
                                @click.stop=""
                                plain >查看</el-button>
                        </router-link>

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
        
        <!-- 部门视图 -->
        <DeptView
            v-if="viewType === 1"
            @addTaskByExecutorId="addTaskByExecutorId"
            @auditTask="auditTask"
            @tipCompleteModal="tipCompleteModal"
            @completeModal="completeModal"
            @levelComeplete="levelComeplete"
            @editTask="editTask"
            @replyTask="replyTask"
            @pageLoadAxiosCountReduce="pageLoadAxiosCountReduce"
            @pageLoadUpdate="pageLoadUpdate"
            ></DeptView>
            
        <!-- 部门视图 -->
        <TaskTypeView
            v-if="viewType === 2"
            @addTaskByExecutorId="addTaskByExecutorId"
            @auditTask="auditTask"
            @tipCompleteModal="tipCompleteModal"
            @completeModal="completeModal"
            @levelComeplete="levelComeplete"
            @editTask="editTask"
            @replyTask="replyTask"
            @pageLoadAxiosCountReduce="pageLoadAxiosCountReduce"
            @pageLoadUpdate="pageLoadUpdate"
            ></TaskTypeView>
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
                        <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务类型:" v-if="taskForm.taskTypeName">
                    <el-input v-model="taskForm.taskTypeName" disabled style="width:363px;display:inline-block;"></el-input>
                </el-form-item>
                <el-form-item label="任务类型:" v-if="!taskForm.taskTypeName" required prop="taskTypeId" :class="{'is-change': handTaskType === 3 && (auditOldData.taskTypeId != taskForm.taskTypeId)}">
                    <el-select v-model="taskForm.taskTypeId" clearable placeholder="请选择类型" style="width:363px;display:inline-block;">
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
                    <div v-show="taskForm.taskCategory == 0">
                        <el-form-item label="关联任务组:" :class="{'is-change': handTaskType === 3 && (auditOldData.taskGroupId != taskForm.taskGroupId)}" prop="taskGroupId">
                            <el-select v-model="taskForm.taskGroupId" clearable placeholder="请选择关联任务组" style="width:363px;display:inline-block;">
                                <el-option
                                    v-for="item in groupLists"
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div v-show="taskForm.taskCategory == 1">
                        <el-form-item label="任务组成员:" :class="{'is-change': handTaskType === 3 && (JSON.stringify(auditOldData.taskGropUsers) != JSON.stringify(taskGropUsers))}">
                            <div class="user-right" @click="adduser">添加任务组成员</div>
                            <div class="user-item ellipsis" v-for="(item, index) in taskGropUsers" :key="index">
                                <span class="ellipsis" style="display: inline-block;width: 100%;">{{ item.userName }}</span>
                                <i class="el-icon-circle-close"  @click="removeTodo(index)"></i>
                            </div>
                        </el-form-item>
                    </div>
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
    </div>
</template>

<script>
import moment from 'moment'
import {
    getDeptStatistics,
    listDeptPendingTasks,
    listMyPendingTask,
    listPersonalAllByPage,
    dragTask,
    seeReplyStatus,
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
    getChildDepts,
    getTaskTypeByDeptId,
    userTaskReply,
    listToApproveTaskByPage,
    listWaitEvaluateTaskByPage
} from 'service/getData'
import {  ERR_OK } from 'service/config'
import Sortable from 'sortablejs'
import DeptView from './components/DeptView'
import TaskTypeView from './components/TaskTypeView'
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters([
            'pageScrollTopByTaskManage'
        ])
    },
    components: {
        DeptView,
        TaskTypeView
    },
    data () {
        var checkTaskTypeId = (rule, value, callback) => {
            if (!value && !this.taskForm.taskTypeName) {
                return callback(new Error('请选择任务类型'));
            } else {
                callback();
            }
        };
        return {
            loading: false,
            scrollTop: 0,
            userView: 'STAFF', // MANAGER   DEPT   STAFF
            userId: '',
            canAddTaskGroup: false, // 是否有创建任务组权限

            tabsType: 0,
            deptLevel: '',
            taskCountInfo: {}, //任务统计数据

            result1: [], // 员工待处理任务
            pendingTotal: 0, // 数量
            
            result: [], // 我的任务
            myPendingTotal: 0, // 数量
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

            viewType: 0, // 0不显示 1部门视图 2类别视图

            
            pageTabsType: 0, // 待审核 1待评价
            pageData: [],
            pageIndex: 1,
            pageSize: 10,
            pageTotal: 0,
            pageTotalToApprove: 0,
            pageTotalWaitEvaluate: 0,
            preScrollTop: 0,
            pageLoadAxiosCount: -1, //页面数据加载接口数量
                
            
        }
    },
    created() {
        this.userId = localStorage.getItem("userId");
        this.deptLevel = localStorage.getItem("deptLevel");
        this.userView = localStorage.getItem("userView");
        this.canAddTaskGroup = localStorage.getItem("canAddTaskGroup") == 'true' ? true : false;
        
    },
    mounted() {
        let pageScrollTopByTaskManage = this.pageScrollTopByTaskManage;
        if (pageScrollTopByTaskManage && pageScrollTopByTaskManage > 0){
            this.preScrollTop = parseFloat(pageScrollTopByTaskManage);
            
            if (this.userView == 'MANAGER') {
                this.pageLoadAxiosCount = 4; // 总经理 我的任务1 + 待审核2 + 视图1
            } else if (this.userView == 'DEPT') {
                this.pageLoadAxiosCount = 3; // 部门 我的任务1 + 待处理1 + 视图1
            } else {
                this.pageLoadAxiosCount = 1; // 员工
            }
        
            this.pageInit();
        } else {
            this.pageInit();
        }
        
        // this.$refs.taskManagerPage.scrollTop = 380;
    },
    updated() {
        
        this.pageLoadUpdate();
        
    },
    beforeRouteLeave(to, from, next) {
        console.log('路由')
        if(to.name == 'taskManageDetail') {
            //跳转为详情页，就保存当前滚动的距离
            // localStorage.setItem("pageScrollTopByTaskManage", window.getScrollTop());
            this.$store.dispatch('setPageScrollTopByTaskManage',window.getScrollTop());

        } else {
            // localStorage.setItem("pageScrollTopByTaskManage", 0);
            this.$store.dispatch('setPageScrollTopByTaskManage', 0);
        }
        next();
    },
    watch: {

    },
    methods: {
        pageLoadUpdate() {
            // 更新
            if(this.preScrollTop && this.pageLoadAxiosCount === 0){
                
                this.pageLoadAxiosCount--; // 只滚动一次
                window.setScrollTop(this.preScrollTop);
                this.$nextTick(()=> {
                    this.loading = false;
                })
            }
        },
        pageLoadAfterScroll() {
            // 页面加载滚动，加载后需滚动到原位置
            this.preScrollTop = window.getScrollTop();
            if(this.preScrollTop > 0) {
                this.loading = true;
            }
            setTimeout(()=>{
                this.loading = false;
                // 防止异常未关闭
            },1500)
            if (this.userView == 'MANAGER') {
                this.pageLoadAxiosCount = 4; // 总经理 我的任务1 + 待审核2 + 视图1
            } else if (this.userView == 'DEPT') {
                this.pageLoadAxiosCount = 3; // 部门 我的任务1 + 待处理1 + 视图1
            } else {
                this.pageLoadAxiosCount = 1; // 员工
            }
            this.pageInit();
        },
        pageLoadAxiosCountReduce() {
            this.$nextTick(() => {
                this.pageLoadAxiosCount--;
            })
        },
        pageInit() {
            this.viewType = 0;
            if(this.userView != 'STAFF') {
                // 非员工
                this.getUntreatTask1(); //获取任务统计数据

                if (this.userView == 'MANAGER') {
                    this.getPageData(1);
                    this.getPageData();

                } else if (this.userView == 'DEPT') {
                    this.getUntreatTask(); //获取员工待处理
                }
                this.$nextTick(() => {
                    if (localStorage.getItem('viewType') == 2) {
                        this.viewType = 2;
                    } else {
                        this.viewType = 1;
                    }
                });
                
            }
            this.getData(); // 获取我的任务
            
            this.departmentList1(); //获取部门列表
            this.getTaskExecutors(); //获取执行人列表
            this.getProjectLists(); //获取关联项目列表
            this.listAllUsersT(); // 获取所有用户
            
        },
        // 获取任务统计数据
        getUntreatTask1() {
            getDeptStatistics().then((res) => {
                if (res.code == ERR_OK) {
                    this.taskCountInfo = res.data;
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
        
        // 切换我的任务
        tabsTypeChange(type) {
            this.tabsType = type;
            this.nowPage = 1;
            this.getData();
        },
        
            
        // 我的任务分页
        handleSizeChange(val) {
            this.pageShow = val;
            this.getData()
        },
        handleCurrentChange(val) {
            this.nowPage = val;
            this.getData()
        },
        // 获取我的任务
        getData() {
            this.result = [];
            if (this.tabsType === 0) {
                listMyPendingTask({
                    nowPage: this.nowPage,
                    pageShow: this.pageShow
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        this.result = res.data.result;
                        this.total = res.data.totalCount;
                        this.myPendingTotal = res.data.totalCount;
                        console.log('我的任务加载完成')
                        this.pageLoadAxiosCountReduce();
                    }
                })
            } else {
                
                listPersonalAllByPage({
                    nowPage: this.nowPage,
                    pageShow: this.pageShow
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        this.result = res.data.result;
                        this.total = res.data.totalCount;
                        console.log('我的任务加载完成')
                        this.pageLoadAxiosCountReduce();
                    }
                })
            }
        },

        // 我的任务排序
        setSort_myTask(){
            const el = document.querySelectorAll('.mytask .el-table__body-wrapper > table > tbody')[0]
            this.sortable = Sortable.create(el, {
                onEnd: evt => {
                    var oldIndex=evt.oldIndex;
                    var newIndex=evt.newIndex;
                    if(oldIndex > newIndex){
                        if(newIndex==0){
                            this._dragTask(this.result[oldIndex].taskId,'',this.result[newIndex].taskId,6)
                        } else{
                            this._dragTask(this.result[oldIndex].taskId,this.result[newIndex-1].taskId,this.result[newIndex].taskId,6)
                        }
                    }else{
                        if(newIndex==0){
                            this._dragTask(this.result[oldIndex].taskId,'',this.result[newIndex].taskId,6)
                        } else if(newIndex==this.result.length-1){
                            this._dragTask(this.result[oldIndex].taskId,this.result[newIndex].taskId,'',6)
                        } else{
                            if(newIndex>=this.result.length){
                                this._dragTask(this.result[oldIndex].taskId,this.result[newIndex-1].taskId,'',6)
                            }else{
                                this._dragTask(this.result[oldIndex].taskId,this.result[newIndex].taskId,this.result[newIndex+1].taskId,6)
                            }
                        }
                    }
                }
            })
        },
        //  拖动排序接口
        _dragTask(sourceTaskId,targetBeforeTaskId,targetAfterTaskId,num){
            const param={
                sourceTaskId:sourceTaskId,
                targetBeforeTaskId:targetBeforeTaskId,
                targetAfterTaskId:targetAfterTaskId
            }
            dragTask(param).then((res)=>{
                if(num==1){
                this.getUntreatTask()
                }
                if(num==2){
                this.getChangeTask()
                }
                if(num==3){
                this.getCommentTask()
                }
                if(num==4){
                this.getAssignedTask()
                }
                if(num==5){
                this.departCommentTaskUnCompleted()
                }
                if(num==6){
                this.getData()
                }
                if(num==8){
                let scrolled = document.documentElement.scrollTop || document.body.scrollTop
                }
                if(num==9){
                this._listDraftTask()
                }
                if(res.code == ERR_OK){

                }else{
                this.$notify.error({
                    title: '错误',
                    message:res.msg
                });
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
        // 员工待处理任务列表
        getUntreatTask() {
            this.result1 = []
            listDeptPendingTasks().then((res) => {
                if (res.code == ERR_OK) {
                    this.result1 = res.data;
                    this.pendingTotal = res.data.length ? res.data.length : 0;
                    console.log('员工待处理任务列表加载完成')
                    this.pageLoadAxiosCountReduce();
                    
                }
            })
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
                listToApproveTaskByPage({
                    nowPage: this.pageIndex,
                    pageShow: this.pageSize
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        if(!type) {
                            this.pageData = res.data.result;
                            this.pageTotal = res.data.totalCount;
                        }
                        this.pageTotalToApprove = res.data.totalCount;
                        console.log('总经理待审核列表加载完成')
                        this.pageLoadAxiosCountReduce();
                        
                    }
                })
            } else {
                
                listWaitEvaluateTaskByPage({
                    nowPage: this.pageIndex,
                    pageShow: this.pageSize
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        if(!type) {
                            this.pageData = res.data.result;
                            this.pageTotal = res.data.totalCount;
                        }
                        this.pageTotalWaitEvaluate = res.data.totalCount;
                        console.log('总经理待审核列表加载完成');
                        this.pageLoadAxiosCountReduce();
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
                saveDraftTask(params).then(res => {
                    if (res.code == ERR_OK) {
                        this.beforeCloseTaskForm();
                        this.pageLoadAfterScroll();
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
                                this.beforeCloseTaskForm();
                                this.pageLoadAfterScroll();
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
                                this.beforeCloseTaskForm();
                                this.pageLoadAfterScroll();
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
                                this.beforeCloseTaskForm();
                                this.pageLoadAfterScroll();
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
            this.dialogTaskForm = true;

            this.goLink(this.taskForm.executorId);
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
                        this.auditOldData.taskGropUsers = [..._taskGropUsers];
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
                            
                            this.pageLoadAfterScroll();
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
                    this.pageLoadAfterScroll();
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
                            this.pageLoadAfterScroll();
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
                            this.pageLoadAfterScroll();
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
        addTaskByExecutorId(id) {
            this.taskForm.executorId = id;
            this.goLink(this.taskForm.executorId)
            this.addTask();
        },
        changeViewType() {
            if (this.viewType === 1) {
                localStorage.setItem("viewType", 2);
                this.viewType = 2;
            } else if (this.viewType === 2) {
                localStorage.setItem("viewType", 1);
                this.viewType = 1;
            }
        }
        
    }
}
</script>

<style scoped lang="scss">
.task-manage {
    margin-bottom: 40px;
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
.role-num {
    float: left;
}
.role-num1 {
    margin-left: 20px;
}
.content-num {
    width: 171px;
    height: 24px;
    padding: 0 10px;
    background: #FFFFFF;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 4px;
}
.search-button {
    float: left;
    text-align: center;
    line-height: 24px;
    color: #D93437;
    border: 1px solid #D83436;
    border-radius: 4px;
    width: 90px;
    height: 24px;
    margin-top: 4px;
    margin-left: 25px;
    cursor: pointer;
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
.special1 {
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
    background: rgba(0,0,0,0.80);
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
.untreatTask-wrapper {
    background: #fff;
    height: 46px;
    padding-top: 4px;
}
.untreatTask {

    height: 46px;
    line-height: 46px;
    opacity: 0.99;
    border: 1px solid rgba(0,0,0,0.12);
    // border-bottom: 1px solid rgba(0,0,0,0.12);
    font-size: 14px;
    color: #333333;
    background: #fff;
}
.untreatTask > ul {
    display: block;
    clear: both;
}
.untreatTask ul li {
    float: left;
    height: 46px;
    margin-left: 69px;
}
.untreatTask ul li:first-child {
    margin-left: 32px;
}
.untreatTask-button {
    background: #fff;
    margin-top: 10px;
}
.important-task {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    color: #333333;
}
.important-task ul li {
    float: left;
}
.important-task ul li:first-child {
    font-weight: bold;
    padding: 0 30px;
    text-align: center;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid rgba(0,0,0,0.12);
    border-bottom: none;
}
.important-task ul li:nth-child(2) {
    margin-left: 30px;
    margin-right: 70px;
}
.nav-wrapper {
    position: fixed;
    right: 0;
    top: 92px;
    z-index: 100;
}
.nav-title {
    width: 25px;
    height: 94px;
    cursor: pointer;
    padding-top: 15px;
    padding-left: 2px;
    text-align: center;
    font-size: 16px;
    color: #FFFFFF;
    background: rgba(217,52,55,0.80);
    border-radius: 4px 0 0 4px;
    float: right;
}
.nav-position:hover .nav {
    display: block;
}
.nav-position {
    position: relative;
}
.depart-nav,
.key-quick {
    height: 35px;
    background: #FBEBEC;
    font-size: 12px;
    color: #333333;
    line-height: 35px;
    font-weight: bold;
    border-bottom: 1px solid rgba(0,0,0,0.12);
}
.key-quick {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}
.key-wrapper {
    height: 54px;
    background: #fff;
    border-bottom: 1px solid rgba(0,0,0,0.12);
}
.key-left,
.key-right {
    float: left;
    border: 1px solid #D93538;
    height: 24px;
    width: 70px;
    line-height: 24px;
    font-size: 12px;
    color: #D93538;
    margin-top: 14px;
    cursor: pointer;
}
.key-left:hover,
.key-right:hover {
    background: #D93538;
    color: #FFFFFF;
}
.key-left {
    margin-left: 17px;
}
.key-right {
    margin-left: 10px;
}
.nav {
    width: 184px;
    right: 27px;
    position: absolute;
    display: none;
    // height: 264px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid rgba(0,0,0,0.12);
    border-bottom: none;

}

.nav ul li {
    height: 35px;
    background: #fff;
    display: block;
    cursor: pointer;
    font-size: 12px;
    color: #333333;
    line-height: 35px;
    border-bottom: 1px solid rgba(0,0,0,0.12);
}
.nav ul li:last-child {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
}
.nav ul li:hover {
    background: #F1F1F1;
}
.goTop {
    position: fixed;
    z-index: 200;
    right: 20px;
    bottom: 50px;
    cursor: pointer;
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
.addPercent {
    position: relative;
}
.addPercent span {
    position: absolute;
    right: -25px;
}
.week-rapper{
overflow: hidden;
margin-left: 99px;
}
.week-rapper ul li{
border: 1px solid rgba(0,0,0,0.12);
width: 28px;
margin-left: 14px;
float: left;
line-height: 28px;
font-size: 12px;
height: 28px;
cursor: pointer;
text-align: center;
}
.week-rapper ul li.active{
background: #D93437;
border: 1px solid #D93437;
color: #FFFFFF;
}

.user-title{
opacity: 0.99;
background: rgba(217,52,55,0.10);
height: 47px;
line-height: 44px;
width: 100%;
font-size: 14px;
box-sizing: border-box;
border: 1px solid rgba(0,0,0,0.12);
}

.title-name{
float: left;
// padding: 0 14px;
color: #333333;
text-align: center;
box-sizing: border-box;
height:46px;
cursor: pointer;
border-bottom: none;

}
.title-name1{
margin-left: 30px;
width: 160px !important;

}
.title-name6{
width: 160px !important;
}
.title-name6:nth-child(1){
width: 160px !important;
}
.title-name6:nth-child(2){
width: 172px !important;
}
.title-name6:nth-child(3){
width: 172px !important;
}
.title-name6:nth-child(4){
width: 120px !important;
}
.title-name6:nth-child(5){
width: 179px !important;
}
.title-name6:nth-child(6){
width: 120px !important;
}
.title-name span{
color: #C2453A !important;
}
.title-name:first-child{
margin-left: 20px;
}
.title-name.active{
color: #D93538;
border-bottom:2px solid #D93538;
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
</style>
