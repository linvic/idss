<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">任务管理</span> /
            <span class="child2">任务列表</span>
        </div>
        <!-- 任务统计数据 -->
        <div class="take-top-wrapper">
            <div class="take-left">
                <div class="take-top" style="font-size: 14px;font-weight:normal">任务列表</div>
            </div>
            <div class="take-right" @click="addTask">发起任务</div>
        </div>
        <div class="untreatTask-wrapper">
            <div class="untreatTask">
                <ul v-for="(item,index) in taskCountLists">
                    
                    <li>{{item.deptName}}：</li>
                    <li>待处理任务数 {{item.pendingTaskCount}}</li>
                    <li>未完成任务数 {{item.incompleteTaskCount}}</li>
                    <li>总任务数 {{item.totalTaskCount}}</li>
                </ul>
            </div>
        </div>

        <!-- 员工任务待处理 -->
        <div class="take-top-wrapper m-t-10">
            <div class="take-top" style="font-size: 14px;font-weight:normal">员工任务待处理</div>
        </div>
        <div class="untreatTask-table">
            <el-table
                :data="result1"
                row-key="id"
                :expand-row-keys="expands"
                @row-click="openDetails"
                @expand="startExpend"
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
                                    <div class="" v-for="item in props.row.taskReplys">
                                        <div class="reback-time">{{ item.replyTimeDistanceDesc }}</div>
                                        <div class="reback" style="max-width: 294px;min-width: 296px;overflow:hidden;">
                                            <div style="float:left;">{{item.userName}}：</div>
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
                        <router-link :to="{path: 'taskDetail', query: { id: props.row.id }}" style="color:#505363;">
                            <div>{{ props.row.title }}</div>
                        </router-link>
                        <div>
                            <div class="title-right">
                                {{ props.row.taskTypeName }}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="最新动态" prop="name">
                    <template slot-scope="props">
                        【开发预留】
                    </template>
                </el-table-column>
                <el-table-column
                    label="任务状态"
                    prop="taskStatusStr"
                    min-width="50">
                    <template slot-scope="props">
                        <div>
                            <img class="icon_type" v-if="props.row.iconType == 'FINISHU'" src="../../images/lateTime2.png" alt=""  />
                            <img class="icon_type" v-if="props.row.iconType == 'FINISHUW'" src="../../images/timeLate.png" alt="" />
                            <img class="icon_type" v-if="props.row.iconType == 'EXCELLENT'" src="../../images/icon_excellent.png" alt="" />
                            <img class="icon_type" v-if="props.row.iconType == 'GOOD'" src="../../images/icon_good.png" alt="" />
                            <img class="icon_type" v-if="props.row.iconType == 'SECONDARY'" src="../../images/icon_well.png" alt="" />
                            <img class="icon_type" v-if="props.row.iconType == 'DIFFERENCE'" src="../../images/icon_bad.png" alt="" />
                            <img class="icon_type" v-if="props.row.iconType == 'POOR'" src="../../images/icon_worse.png" alt=""/>
                            <span style="color:#D93437;">{{props.row.taskStatusName}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="props">
                        
                            <!-- v-if=" props.row.taskStatus == 'TOSUBMIT' || props.row.taskStatus == 'APPROVEPASS' " -->
                        <el-button
                            size="small"
                            class="complete"
                            @click="editTask(props.row.id, $event)">编辑任务</el-button>

                        <el-button
                            size="small"
                            class="complete"
                            @click="cancle(props.row.id, $event)">取消</el-button>

                        <el-button
                            size="small"
                            class="complete"
                            @click="levelComeplete( props.row.id, $event)">完成</el-button>
                                
                        <router-link :to="{path: 'taskDetail',query: { id: props.row.id }}">
                            <el-button size="small" class="complete" >查看</el-button>
                        </router-link>

                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 我的任务 -->
        <div class="take-top-wrapper m-t-10">
            <div class="take-top" style="font-size: 14px;font-weight:normal">我的任务</div>
            <div class="take-bottom">
                <div class="task-item" v-bind:class="{ active: tabsType === 0 }" @click="tabsTypeChange(0)">待处理</div>
                <div class="task-item" v-bind:class="{ active: tabsType === 1 }" @click="tabsTypeChange(1)">全部任务</div>
            </div>
        </div>
        <div class="untreatTask-table mytask">
            
            <el-table
                :data="result"
                row-key="id"
                :expand-row-keys="expands"
                @row-click="openDetails"
                @expand="startExpend"
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
                                    <div class="" v-for="item in props.row.taskReplys">
                                        <div class="reback-time">{{ item.replyTimeDistanceDesc }}</div>
                                        <div class="reback" style="max-width: 294px;min-width: 296px;overflow:hidden;">
                                            <div style="float:left;">{{item.userName}}：</div>
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
                        <router-link :to="{path: 'taskDetail', query: { id: props.row.id }}" style="color:#505363;">
                            <div>{{ props.row.title }}</div>
                        </router-link>
                        <div>
                            <div class="title-right">
                                {{ props.row.taskTypeName }}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="最新动态" prop="name">
                    <template slot-scope="props">
                        【开发预留】
                    </template>
                </el-table-column>
                <el-table-column
                    label="任务状态"
                    prop="taskStatusStr"
                    min-width="50">
                    <template slot-scope="props">
                        <div>
                            <img class="icon_type" v-if="props.row.iconType == 'FINISHU'" src="../../images/lateTime2.png" alt=""  />
                            <img class="icon_type" v-if="props.row.iconType == 'FINISHUW'" src="../../images/timeLate.png" alt="" />
                            <img class="icon_type" v-if="props.row.iconType == 'EXCELLENT'" src="../../images/icon_excellent.png" alt="" />
                            <img class="icon_type" v-if="props.row.iconType == 'GOOD'" src="../../images/icon_good.png" alt="" />
                            <img class="icon_type" v-if="props.row.iconType == 'SECONDARY'" src="../../images/icon_well.png" alt="" />
                            <img class="icon_type" v-if="props.row.iconType == 'DIFFERENCE'" src="../../images/icon_bad.png" alt="" />
                            <img class="icon_type" v-if="props.row.iconType == 'POOR'" src="../../images/icon_worse.png" alt=""/>
                            <span style="color:#D93437;">{{props.row.taskStatusName}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="props">
                        
                        <el-button
                            size="small"
                            class="complete"
                            v-if=" props.row.taskStatus == 'TOSUBMIT' || props.row.taskStatus == 'APPROVEPASS' "
                            @click="editTask(props.row.id, $event)">编辑任务</el-button>

                        <el-button
                            size="small"
                            class="complete"
                            @click="cancle(props.row.id, $event)">取消</el-button>

                        <el-button
                            size="small"
                            class="complete"
                            @click="levelComeplete( props.row.id, $event)">完成</el-button>
                                
                        <router-link :to="{path: 'taskDetail',query: { id: props.row.id }}">
                            <el-button size="small" class="complete" >查看</el-button>
                        </router-link>

                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-depart" v-show="total > 0">
                <el-pagination
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

        <!-- 员工任务 -->
        <div class="take-top-wrapper m-t-10">
            <div class="take-top" style="font-size: 14px;font-weight:normal">员工任务</div>
        </div>
        <div class="staffView" v-for="(item,index) in depet" :key="index">
            <div class="take-top-wrapper" style="margin-top:10px;margin-bottom:5px;">
                <div class="take-left">
                    <div class="take-top" style="float:left;width:auto;min-width:280px;">{{item.deptName}}</div>
                </div>
                <div ref="mybox" class="packUp" @click='deptOpen(item)' style="margin-right:44px;float:right;margin-top:9px;cursor:pointer;text-align:center;font-size: 12px;line-height:28px;color:#D93538;width:65px;height:28px;border: 1px solid #D93538;border-radius: 4px;">
                    {{item.isOpen ? '收起' : '展开'}}
                </div>
            </div>
            <div v-show="item.isOpen">

                <div class="partView" v-for='(item1,index1) in optionType'>
                    <div class="take-top-wrapper" style="margin-top:10px;background:rgba(217, 52, 55, 0.02);">
                        <div class="take-left">
                            <div class="take-top" style="float:left;width:auto;min-width:280px;">{{index1+1}}.{{item1.taskTypeName}}</div>
                        </div>
                        <div @click='mindTask1(item1.taskTypeId,item.deptId)'style="float:right;margin-top:9px;margin-right:44px;margin-left:4px;cursor:pointer;text-align:center;font-size: 12px;line-height:28px;color:#D93538;width:65px;height:28px;border:1px solid #D93538;border-radius: 4px;">
                        添加任务
                        </div>
                        <div ref="mybox2" class="packUp mybox2" @click='deptTaskOpen(item,item1.taskTypeId)' style="margin-left:6px;float:right;margin-top:9px;cursor:pointer;text-align:center;font-size: 12px;line-height:28px;color:#D93538;width:65px;height:28px;border:1px solid #D93538;border-radius: 4px;">
                        {{openTaskTypeId == (item.deptId + '-' + item1.taskTypeId) ?  '收起' : '展开'}}
                        </div>
                    </div>
                    <div class="untreatTask-table" v-show="openTaskTypeId == (item.deptId + '-' + item1.taskTypeId)">
                        
                        <el-table
                            :data="item[item1.taskTypeId] ? item[item1.taskTypeId].data : []"
                            row-key="id"
                            :expand-row-keys="expands"
                            @row-click="openDetails"
                            
                            @expand="startExpend"
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
                                                <div class="" v-for="item in props.row.taskReplys">
                                                    <div class="reback-time">{{ item.replyTimeDistanceDesc }}</div>
                                                    <div class="reback" style="max-width: 294px;min-width: 296px;overflow:hidden;">
                                                        <div style="float:left;">{{item.userName}}：</div>
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
                                    <router-link :to="{path: 'taskDetail', query: { id: props.row.id }}" style="color:#505363;">
                                        <div>{{ props.row.title }}</div>
                                    </router-link>
                                    <div>
                                        <div class="title-right">
                                            {{ props.row.taskTypeName }}
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="最新动态" prop="name">
                                <template slot-scope="props">
                                    【开发预留】
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="任务状态"
                                prop="taskStatusStr"
                                min-width="50">
                                <template slot-scope="props">
                                    <div>
                                        <img class="icon_type" v-if="props.row.iconType == 'FINISHU'" src="../../images/lateTime2.png" alt=""  />
                                        <img class="icon_type" v-if="props.row.iconType == 'FINISHUW'" src="../../images/timeLate.png" alt="" />
                                        <img class="icon_type" v-if="props.row.iconType == 'EXCELLENT'" src="../../images/icon_excellent.png" alt="" />
                                        <img class="icon_type" v-if="props.row.iconType == 'GOOD'" src="../../images/icon_good.png" alt="" />
                                        <img class="icon_type" v-if="props.row.iconType == 'SECONDARY'" src="../../images/icon_well.png" alt="" />
                                        <img class="icon_type" v-if="props.row.iconType == 'DIFFERENCE'" src="../../images/icon_bad.png" alt="" />
                                        <img class="icon_type" v-if="props.row.iconType == 'POOR'" src="../../images/icon_worse.png" alt=""/>
                                        <span style="color:#D93437;">{{props.row.taskStatusName}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="props">
                                    <el-button
                                        size="small"
                                        class='complete'
                                        @click='tipCompleteModal(props.row.id,$event)'>提醒完成</el-button>
                                    <el-button
                                        size="small"
                                        class='complete'
                                        @click='levelComeplete(props.row.id,$event)'>任务评价</el-button>
                                    
                                    <el-button
                                        size="small"
                                        class='complete'
                                        @click='completeModal(props.row.id,$event)'>完成</el-button>
                                    <el-button
                                        size="small"
                                        class="complete"
                                        v-if=" props.row.taskStatus == 'TOSUBMIT' || props.row.taskStatus == 'APPROVEPASS' "
                                        @click="editTask(props.row.id, $event)">编辑任务</el-button>

                                    <el-button
                                        size="small"
                                        class="complete"
                                        @click="cancle(props.row.id, $event)">取消</el-button>
                                            
                                    <router-link :to="{path: 'taskDetail',query: { id: props.row.id }}">
                                        <el-button size="small" class="complete" >查看</el-button>
                                    </router-link>

                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
        
        <!--发布任务模态窗-->
        <el-dialog
            :title="dialogTaskFormTitle"
            :visible.sync="dialogTaskForm"
            size="tiny"
            :before-close="beforeCloseTaskForm"
            top="10%"
            class="noticeManageModel">
            <el-form
                :model="taskForm"
                :rules="taskFormRules"
                ref="taskForm"
                label-width="112px">
                <el-form-item label="任务标题:" prop="title">
                    <el-input v-model="taskForm.title" placeholder="请输入任务标题" style="width:363px;display:inline-block;" ></el-input>
                </el-form-item>
                <el-form-item label="执行人:" prop="executorId">
                    <el-select v-model="taskForm.executorId" filterable placeholder="请选择执行人" style="width:363px;display:inline-block;" @change="goLink">
                        <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务类型:" prop="taskTypeId">
                    <el-select v-model="taskForm.taskTypeId" placeholder="请选择类型" style="width:363px;display:inline-block;" >
                        <el-option
                            v-for="item in optionType"
                            :key="item.taskTypeId"
                            :label="item.taskTypeName"
                            :value="item.taskTypeId" >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务汇报对象:" prop="telObj">
                    <el-select
                        v-model="taskForm.telObj"
                        filterable
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
                
                
                <el-form-item label="任务工作量:" prop="taskWorkload">
                    <el-select
                        v-model="taskForm.taskWorkload"
                        placeholder="请选择任务工作量"
                        style="width:363px;display:inline-block;">
                        <el-option v-for="item in 10" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                    <el-tooltip class="item" effect="dark" placement="bottom-end">
                        <i class="el-icon-information"></i>
                        <div slot="content">
                            <p>任务工作量说明：</p>
                            <p>- 本月基准任务为“完成2篇投后月报”，占本月计划考核权重的13%；</p>
                            <p>- 任务发布后会由上级进行审核，审核通过后本月计划中所有任务的权重都自动修改；</p>
                            <p>- 任务工作量基数为“1”时，不需要上级审核。</p>
                        </div>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="完成时间:" prop="date1">
                    <el-date-picker
                        type="date"
                        placeholder="选择日期"
                        :picker-options="pickerOptions0"
                        v-model="taskForm.date1"
                        style="width:363px;display:inline-block;"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="任务内容:" prop="content">
                    <el-input type="textarea" v-model="taskForm.content" style="width:363px;display:inline-block;"></el-input>
                </el-form-item>
                
                <el-form-item label="修改原因:" required prop="modifyReason" v-if="editTaskId">
                    <el-input type="textarea" v-model="taskForm.modifyReason" style="width:363px;display:inline-block;"></el-input>
                </el-form-item>
                <div v-show="stretch">
                    <el-form-item label="任务性质:">
                        <el-radio-group v-model="taskForm.taskCategory">
                            <el-radio :label="0">单条任务</el-radio>
                            <el-radio :label="1">任务组任务</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="关联任务组:" v-if="taskForm.taskCategory == 0">
                        <el-select v-model="taskForm.taskGroupId" placeholder="请选择关联项目" style="width:363px;display:inline-block;">
                            <el-option
                                v-for="item in groupLists"
                                :key="item.taskGroupId"
                                :label="item.taskGroupName"
                                :value="item.taskGroupId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="任务组成员:" v-if="taskForm.taskCategory == 1">
                        <div class="user-right" @click="adduser">添加任务组成员</div>
                        <div class="user-item ellipsis" v-for="(item, index) in taskGropNames">
                            <span class="ellipsis" style="display: inline-block;width: 100%;">{{ item.username }}</span>
                            <i class="el-icon-circle-close"  @click="removeTodo(index)"></i>
                        </div>
                    </el-form-item>
                    <el-form-item label="关联项目:">
                        <el-select v-model="taskForm.projectId" placeholder="请选择关联项目" style="width:363px;display:inline-block;">
                            <el-option
                                v-for="item in projects"
                                :key="item.projectId"
                                :label="item.projectName"
                                :value="item.projectId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class=""label="任务可见范围:">
                        <el-select
                            multiple
                            v-model="taskForm.value71"
                            placeholder="请选择部门"
                            style="width:363px;display:inline-block;" >
                            <el-option
                                v-for="item in depet"
                                :key="item.deptId"
                                :label="item.deptName"
                                :value="item.deptId" >
                            </el-option>
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
                <button v-if="!editTaskId" @click="submitTaskForm(0)" class="saveDrafts">保存草稿</button>
                <button v-if="!editTaskId" @click="submitTaskForm(1)">发布任务</button>
                <button v-if="editTaskId" @click="submitTaskForm(2)">编辑任务</button>
                
            </span>
        </el-dialog>

        <!--添加任务组成员-->
        <el-dialog
            title="添加任务组成员"
            :visible.sync="dialogAddUserForm"
            size="tiny"
            :before-close="beforeCloseAddUserForm"
            top="25%"
            class="noticeManageModel">
                <!-- :rules="rules" -->
            <el-form
                :model="addUserForm"
                ref="addUserForm"
                label-width="112px">
                <el-form-item
                    label="姓名:"
                    prop="username"
                    style="margin-right: 40px !important;">
                    <el-select
                        v-model="addUserForm.username"
                        filterable
                        placeholder="请选择任务组成员"
                        style="width:100%;">
                        <el-option
                            v-for="item in usersT"
                            :key="item.userId"
                            :label="item.userName"
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
    getTaskGroupList,
    getProjectList,
    listAllUsers,
    saveDraftTask,
    publishTask,
    sureEditorTask,
    editorTaskMain
} from 'service/getData'
import {  ERR_OK } from 'service/config'
import Sortable from 'sortablejs'
export default {
    data () {
        return {
            tabsType: 0,
            taskCountLists: [], //任务统计数据

            result1: [], // 员工待处理任务
            
            result: [], // 我的任务
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
                telObj: [
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
                date1: [
                    {
                        type: "date",
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
            editTaskId: '',
            taskForm: {
                title: "", // 任务标题
                date1: "", // 完成时间
                content: "", // 任务内容
                telObj: "", // 任务汇报对象
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
            
            taskGropNames: [],
            taskGropUsers: [],
            usersT: [], // 所有用户
            addUserForm: {
                username: ""
            },
        }
    },
    created() {
        this.pageInit();
        

    },
    watch: {

    },
    methods: {

        pageInit() {
            this.getUntreatTask1(); //获取任务统计数据
            this.getUntreatTask(); //获取员工待处理
            this.getData(); // 获取我的任务
            this.departmentList1(); //获取部门列表
            this.listAllUsers1(); //获取执行人列表
            this.getTaskGroupLists(); //任务组列表
            this.getProjectList1(); //获取关联项目列表
            this.listAllUsersT(); // 获取所有用户
        },
        // 获取任务统计数据
        getUntreatTask1() {
            getDeptStatistics().then((res) => {
                if (res.code == ERR_OK) {
                    this.taskCountLists = res.data;
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
        getTaskGroupLists() {
            getTaskGroupList().then((res) => {
                if (res.code == ERR_OK) {
                this.groupLists = res.data;
                }
            })
        },
        // 获取关联项目列表
        getProjectList1() {
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
        listAllUsers1() {
            listTaskExecutors().then(res => {
                if (res.code == ERR_OK) {
                    this.users = res.data;
                    for (let i in this.users) {
                        if (this.users[i].checked == true) {
                            this.taskForm.executorId = this.users[i].userId;
                        }
                    }
                    this.getUsersObj1(this.taskForm.executorId);
                    this._listByExecutor(this.taskForm.executorId);
                }
            });
        },
        // 获取汇报对象
        getUsersObj1(userId) {
            this.optionsObj = [];
            this.taskForm.telObj = '';
            listReportingUsers({
                userId: userId
            }).then(res => {
                if (res.code == ERR_OK) {
                    this.optionsObj = res.data;
                    for (let i in this.optionsObj) {
                        if (this.optionsObj[i].checked == true) {
                            this.taskForm.telObj = this.optionsObj[i].userId;
                        }
                    }
                }
            });
        },
        // 获取执行人对应的任务类型
        _listByExecutor(userId) {
            listByExecutor({
                userId: userId
            }).then(res => {
                if (res.code == ERR_OK) {
                    this.taskForm.taskTypeId = "";
                    this.optionType = res.data;
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
                        this.result = res.data.result
                        this.total = res.data.totalCount;
                        this.$nextTick(() => {
                            this.setSort_myTask(this.result)
                        })
                    }
                })
            } else {
                
                listPersonalAllByPage({
                    nowPage: this.nowPage,
                    pageShow: this.pageShow
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        this.result = res.data.result
                        this.$nextTick(() => {
                            this.setSort_myTask(this.result)
                        })
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
        startExpend(row, expanded) {
            console.log(row, expanded)
            if (row.lastReplyStatus == "UNREAD" && expanded == true) {
                seeReplyStatus({taskReplyId: row.lastTaskReplyId}).then(res => {
                    if (res.code == ERR_OK) {
                    }
                });
            }
        },
        openDetails(row, event, column) {
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
        },
        // 员工待处理任务列表
        getUntreatTask() {
            this.result1 = []
            listDeptPendingTasks().then((res) => {
                if (res.code == ERR_OK) {
                    this.result1 = res.data;
                    this.$nextTick(() => {
                        // this.setSort_Tab0(this.result1)
                    })
                }
            })
        },
        
        deptOpen(item) {
            this.depet.map((v)=>{
                if (v.deptId != item.deptId) {
                this.$set(v, 'isOpen', false);
                }
            })
            this.$set(item, 'isOpen', !item.isOpen);
        },
        deptTaskOpen(item,taskTypeId){
            console.log('展开',item,taskTypeId)
            let deptIdAndTaskTypeId = item.deptId + '-' + taskTypeId;
            if (this.openTaskTypeId == deptIdAndTaskTypeId) {
                this.openTaskTypeId = '';
            } else {
                this.openTaskTypeId = deptIdAndTaskTypeId;
            }
            if (item[taskTypeId] && item[taskTypeId].data && item[taskTypeId].data.length > 0) {
                // 缓存，如果有数据则不再重复取
                return;
            }
            this.$set(item, taskTypeId, {
                data: []
            });
            listPendingTaskByTaskTypeId({
                deptId: item.deptId,
                taskTypeId: taskTypeId
            }).then((res) => {
                if (res.code == ERR_OK) {
                this.$set(item, taskTypeId, {
                    data: res.data ? res.data : []
                });
                }else{
                this.$notify.error({
                    title: '错误',
                    message:res.msg
                });
                }
            })
            
        },


        goLink(val) {
            this.getUsersObj1(val);
            this._listByExecutor(val);
        },
        // 弹窗关闭
        beforeCloseTaskForm(done) {
            this.dialogTaskForm = false;
            this.$refs.taskForm.resetFields();
        },
        submitTaskForm(submitType) {
            // submitType 提交类型 1 提交  0 保存草稿 2 编辑
            

            var time;
            var value71 = this.taskForm.value71.join(",");
            if (this.taskForm.date1 == "") {
                time = "";
            } else {
                time = moment(this.taskForm.date1).format('YYYY-MM-DD');
            }
            
            let params = {
                title: this.taskForm.title, // 任务标题
                taskTypeId: this.taskForm.taskTypeId, // 任务类型ID
                executorId: this.taskForm.executorId, // 执行人
                reportId: this.taskForm.telObj, // 任务汇报对象
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
                    usersArr.push(item.assistUserId);
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
                saveDraftTask(params).then(res => {
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
            } else if (submitType === 1) {
                this.$refs.taskForm.validate((valid) => {
                    if (valid) {
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
                        params.id = this.editTaskId;
                        params.modifyReason = this.taskForm.modifyReason;
                        sureEditorTask(params).then(res => {
                            if (res.code == ERR_OK) {
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
            }

            
        },
        // 新增任务 发起任务 添加任务
        addTask() {
            this.editTaskId = ''; //非编辑模式
            this.taskGropNames = [];
            this.taskGropUsers = [];
            this.dialogTaskFormTitle = '发起任务';
            this.dialogTaskForm = true;
        },
        editTask(id) {
            this.taskGropNames = [];
            this.taskGropUsers = [];
            this.dialogTaskFormTitle = '编辑任务';
            this.dialogTaskForm = true;
            this.editTaskId = id; //记录当前编辑id
            editorTaskMain({
                id: id
            }).then(res => {
                if (res.code == ERR_OK) {
                    
                    this.taskForm.title = res.data.title;
                    this.taskForm.executorId = res.data.executorId;
                    this.taskForm.taskTypeId = res.data.taskTypeId;
                    this.taskForm.reportId = res.data.reportId;
                    this.taskForm.taskWorkload = res.data.taskWorkload;
                    this.taskForm.planEndDate = res.data.planEndDate;
                    this.taskForm.content = res.data.content;
                    this.taskForm.taskCategory = res.data.taskCategory;
                    this.taskForm.modifyReason = res.data.modifyReason;
                    this.taskForm.projectId = res.data.projectId;
                    if (!res.data.visibleRange) {
                        this.taskForm.value71 = [];
                    } else if (res.data.visibleRange.indexOf(",") < 0) {
                        this.taskForm.value71 = JSON.parse("[" + parseInt(res.data.visibleRange) + "]");
                    } else {
                        this.taskForm.value71 = JSON.parse("[" + String(res.data.visibleRange.split(",")) + "]");
                    }

                    var _assistUserIds = [],_assistUserNames = [];
                    if (res.data.taskGroupMemberIds && res.data.taskGroupMemberIds.length > 0) {
                        var _taskGroupMemberIds = res.data.taskGroupMemberIds.split(',');
                        for (let item of _taskGroupMemberIds) {
                            if (item) {
                                _assistUserIds.push({ assistUserId: item });
                            }
                            
                        }
                        var _taskGroupMemberName = res.data.taskGroupMemberNames.split(',');
                        for (let item of _taskGroupMemberName) {
                            if (item) {
                                _assistUserNames.push({ username: item });
                            }
                        }
                    }
                    
                    this.taskGropNames = [..._assistUserNames];
                    this.taskGropUsers = [..._assistUserIds];

                }
            });
        },
        adduser() {
            this.dialogAddUserForm = true;
        },
        removeTodo(index) {
            this.taskGropNames.splice(index, 1);
            this.taskGropUsers.splice(index, 1);
        },
        
        beforeCloseAddUserForm(done) {
            this.$refs.addUserForm.resetFields();
            this.dialogAddUserForm = false;
        },
        
        submitAddUserForm() {
            this.$refs.addUserForm.validate(valid => {
                if (valid) {
                    if (this.addUserForm.username === this.taskForm.executorId) {
                        this.$notify.error({
                            title: "错误",
                            message: "执行人和任务组成员不能相同"
                        });
                        return;
                    }
                    if (this.taskGropUsers.length > 0) {
                        for (let item of this.taskGropUsers) {
                            if (item.assistUserId === this.addUserForm.username) {
                                this.$notify.error({
                                    title: "错误",
                                    message: "不能选择相同的任务组成员"
                                });
                                return;
                            }
                        }
                    }
                    this.dialogAddUserForm = false;

                    let obj = {
                        assistUserId: this.addUserForm.username
                    };

                    this.taskGropUsers.push(obj);
                    this.taskGropNames = [];
                    for (var i = 0; i < this.usersT.length; i++) {
                        for (var j = 0; j < this.taskGropUsers.length; j++) {
                            if ( this.usersT[i].userId === this.taskGropUsers[j].assistUserId ) {
                                this.taskGropNames.push({ username: this.usersT[i].userName });
                            }
                        }
                    }

                } else {
                    return false;
                }
            });
        },
        
        
        
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

    background: rgba(217,53,56,0.10);
}
.take-top {
    height: 46px;
    width: 265px;
    font-size: 18px;
    font-weight: bold;
    color: #333333;
    margin-left: 34px;
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
    margin-right: 163px;
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
    background: rgba(0,0,0,0.80);
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
.untreatTask ul {
display: block;
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
    
</style>
