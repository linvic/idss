<template>
    <div>
        <div class="idss-list m-b-10" v-if="userView == 'MANAGER'">
            <div class="idss-list-top">
                <div class="idss-list-top-title">
                    <span class="title-txt">员工任务</span>
                    <div class="title-checkboxs">
                        任务显示范围：
                        <el-checkbox-group v-model="taskWorkloads" @change="activeDeptChange">
                            <el-checkbox v-for="(item,index) in workloadSetList" :key="index" :label="item.value">{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
                
            </div>
        </div>
        <div class="zc-collapse">

            <el-collapse v-model="taskDeptViewActiveId" accordion @change="activeDeptChange">
                <el-collapse-item v-for="item in deptList" :name="item.deptId" :key="item.deptId">
                    <div slot="title" class="zc-collapse-title">
                        <span>{{item.deptName}}</span>
                        <div class="zc-collapse-title-btns">
                            <el-button size="small" type="primary" plain>{{item.deptId == taskDeptViewActiveId ? '收起' : '展开'}}</el-button>
                        </div>
                    </div>
                    <div class="zc-collapse-content" v-if="item.taskInfos">
                        <div class="zc-collapse-content-total">
                            <ul>
                                <li>待处理任务数：{{item.taskInfos.pendingTaskCount}}</li>
                                <li>未完成任务数：{{item.taskInfos.incompleteTaskCount}}</li>
                                <li>总任务数：{{item.taskInfos.totalTaskCount}}</li>
                            </ul>
                        </div>
                        <!-- 部门-用户 -->
                        <el-collapse v-model="item.taskInfos.activeExecutorId" @change="changeUserLevelOneActive">
                            <el-collapse-item v-for="j in item.taskInfos.userTaskPojoList" :name="j.executorId" :key="j.executorId">
                                <div slot="title" class="zc-collapse-title">
                                    <span>{{j.executorName}}</span>
                                    <div class="zc-collapse-title-btns">
                                        <el-button size="small" type="primary" plain>{{item.taskInfos.activeExecutorId.indexOf(j.executorId) > -1  ? '收起' : '展开'}}</el-button>
                                        <el-button size="small" type="primary" plain @click.stop="addTaskByExecutorId(j.executorId)">添加任务</el-button>
                                    </div>
                                </div>
                                
                                <el-table
                                    :data="j.taskPojoList"
                                    row-key="id"
                                    :expand-row-keys="expands"
                                    @row-click="openDetails"
                                    @expand-change="startExpend"
                                    style="width: 100%"
                                    empty-text="暂无数据">
                                    <el-table-column type="index" label="序号" width="80"></el-table-column>
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
                                                            <span @click.stop="replyTask(props.row, $event)" class="replyValue">回复</span>
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
                                                <img class="icon_type" v-if="props.row.taskStatus === 'APPROVEPASS'" src="../../../images/timeLate.png" alt=""  />
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
                                                plain>查看</el-button>
                                            </router-link>

                                        </template>
                                    </el-table-column>
                                </el-table>
                                
                            </el-collapse-item>
                        </el-collapse>
                        <!-- 部门-子部门 -->
                        <el-collapse v-model="item.taskInfos.activeChildDeptId" accordion @change="changeLevelTwoActive">
                            <el-collapse-item v-for="j in item.taskInfos.childDeptTaskPojoList" :name="j.deptId" :key="j.deptId">
                                <div slot="title" class="zc-collapse-title">
                                    <span>{{item.deptName}} - {{j.deptName}}</span>
                                    <div class="zc-collapse-title-btns">
                                        <el-button size="small" type="primary" plain>{{j.deptId == item.taskInfos.activeChildDeptId ? '收起' : '展开'}}</el-button>
                                    </div>
                                </div>
                                <div v-if="j">
                                    <div class="zc-collapse-content-total">
                                        <ul>
                                            <li>待处理任务数：{{j.pendingTaskCount}}</li>
                                            <li>未完成任务数：{{j.incompleteTaskCount}}</li>
                                            <li>总任务数：{{j.totalTaskCount}}</li>
                                        </ul>
                                    </div>
                                    <!-- 部门-子部门-用户 -->
                                    <el-collapse v-model="j.activeExecutorId" @change="changeUserLevelTwoActive">
                                        <el-collapse-item v-for="k in j.userTaskPojoList" :name="k.executorId" :key="k.executorId">
                                            <div slot="title" class="zc-collapse-title">
                                                <span style="margin-left:10px;font-size:12px;">{{k.executorName}}</span>
                                                <div class="zc-collapse-title-btns">
                                                    <el-button size="small" type="primary" plain>{{j.activeExecutorId.indexOf(k.executorId) > -1  ? '收起' : '展开'}}</el-button>
                                                    <el-button size="small" type="primary" plain @click.stop="addTaskByExecutorId(k.executorId)">添加任务</el-button>
                                                </div>
                                            </div>
                                            
                                            <el-table
                                                :data="k.taskPojoList"
                                                row-key="id"
                                                :expand-row-keys="expands"
                                                @row-click="openDetails"
                                                @expand-change="startExpend"
                                                style="width: 100%"
                                                empty-text="暂无数据">
                                                <el-table-column type="index" label="序号" width="80"></el-table-column>
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
                                                                        <span @click.stop="replyTask(props.row, $event)" class="replyValue">回复</span>
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
                                                            <img class="icon_type" v-if="props.row.taskStatus === 'APPROVEPASS'" src="../../../images/timeLate.png" alt=""  />
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
                                                            plain>查看</el-button>
                                                        </router-link>

                                                    </template>
                                                </el-table-column>
                                            </el-table>

                                        </el-collapse-item>
                                    </el-collapse>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                        
                        
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import { getTaskDeptList,deptPendingTaskByEntity,seeReplyStatus } from 'service/getData'
import {  ERR_OK } from 'service/config'
export default {
    data () {
        return {
            deptLevel: '',
            userId: '',
            userView: '',

            taskDeptViewActiveId: '',
            
            deptList: [], // 部门列表

            expands: [],

            taskWorkloads: ['1'],

            workloadSetList: [
                {
                    value: '1',
                    label: '工作量1'
                },
                {
                    value: '2',
                    label: '工作量2'
                },
                {
                    value: '3',
                    label: '工作量3'
                },
                {
                    value: '4',
                    label: '工作量4'
                },
                {
                    value: '5',
                    label: '工作量5'
                },
                {
                    value: '-1',
                    label: '工作量大于5'
                }
            ],
        }
    },
    created() {
        this.userId = localStorage.getItem("userId");
        this.deptLevel = localStorage.getItem("deptLevel");
        this.userView = localStorage.getItem("userView");

        if(this.userView == 'MANAGER') {
            var deptViewWorkloadSetIds = localStorage.getItem("deptViewWorkloadSetIds");
            if (deptViewWorkloadSetIds && deptViewWorkloadSetIds.length > 0) {
                this.taskWorkloads = deptViewWorkloadSetIds.split(',')
            }
        }


        this.getTaskDeptLists(); // 获取部门列表
    },
    updated() {
        this.$emit("pageLoadUpdate");
    },
    watch: {

    },
    methods: {
        getTaskDeptLists() {
            
            getTaskDeptList({}).then((res) => {
                if (res.code == ERR_OK) {
                    this.deptList = res.data;
                    if (res.data && res.data.length > 0) {
                        let _taskDeptViewActiveId = localStorage.getItem("taskDeptViewActiveId");
                        if (_taskDeptViewActiveId && parseInt(_taskDeptViewActiveId) ) {
                            this.taskDeptViewActiveId = parseInt(_taskDeptViewActiveId);
                        } else {
                            this.taskDeptViewActiveId = res.data[0].deptId;
                        }
                        
                        this.activeDeptChange();
                    }
                }else{
                    this.$notify.error({
                        title: '错误',
                        message:res.msg
                    });
                }
            })
        },
        activeDeptChange() {
            
            if(this.userView == 'MANAGER') {
                localStorage.setItem("deptViewWorkloadSetIds", this.taskWorkloads.join(','));
            }
            if (this.taskDeptViewActiveId) {
                localStorage.setItem("taskDeptViewActiveId", this.taskDeptViewActiveId);
                // 遍历查找当前项
                for (let item of this.deptList) {
                    if (this.taskDeptViewActiveId == item.deptId) {
                        let _params = {
                            deptId: this.taskDeptViewActiveId
                        }
                        if(this.userView == 'MANAGER') {
                            _params.taskWorkloads = this.taskWorkloads.join(',')
                        }
                        deptPendingTaskByEntity(_params).then((res) => {
                            console.log('任务视图加载完成')
                            this.$emit('pageLoadAxiosCountReduce');
                            if (res.code == ERR_OK) {

                                // 详情内容
                                this.$set(item, 'taskInfos', res.data);

                                // 读取二级展开记录
                                let _activeChildDeptId = localStorage.getItem("activeChildDeptId");
                                if (_activeChildDeptId) {
                                    this.$set(item.taskInfos, 'activeChildDeptId', parseInt(_activeChildDeptId));
                                }

        
                                if (item.taskInfos) {
                                    // 一级用户默认展开
                                    if (item.taskInfos.userTaskPojoList && item.taskInfos.userTaskPojoList.length > 0) {
                                        
                                        let _activeExecutorIds = localStorage.getItem("activeExecutorId");
                                        let _ids = [];
                                        if (_activeExecutorIds && _activeExecutorIds.length > 0) {
                                            _ids = _activeExecutorIds.split(',').map(Number);
                                        }
                                        let users = [];

                                        let localStorageUsers = [];
                                        for (let j of item.taskInfos.userTaskPojoList) {
                                            users.push(j.executorId);
                                            if (_ids.indexOf(j.executorId) > -1) {
                                                localStorageUsers.push(j.executorId);
                                            }
                                        }
                                        this.$set(item.taskInfos, 'activeExecutorId', localStorageUsers.length > 0 ? localStorageUsers : users);
                                        localStorage.setItem("activeExecutorId", localStorageUsers.join(','));

                                    }

                                    if (item.taskInfos.childDeptTaskPojoList && item.taskInfos.childDeptTaskPojoList.length > 0) {
                                        // 二级用户默认展开
                                        for (let j of item.taskInfos.childDeptTaskPojoList) {
                                            let _activeTwoExecutorIds = localStorage.getItem("activeTwoExecutorId");
                                            let _ids = [];
                                            if (_activeTwoExecutorIds && _activeTwoExecutorIds.length > 0) {
                                                _ids = _activeTwoExecutorIds.split(',').map(Number);
                                            }
                                            let users = [];
                                            let localStorageUsers = [];
                                            if (j.userTaskPojoList && j.userTaskPojoList.length > 0) {
                                                for (let k of j.userTaskPojoList) {
                                                    users.push(k.executorId);
                                                    if (_ids.indexOf(k.executorId) > -1) {
                                                        localStorageUsers.push(k.executorId);
                                                    }
                                                }
                                                this.$set(j, 'activeExecutorId', localStorageUsers.length > 0 ? localStorageUsers : users);
                                                localStorage.setItem("activeTwoExecutorId", localStorageUsers.join(','));
                                            }
                                        }
                                    }

                                }
                            }else{
                                this.$notify.error({
                                    title: '错误',
                                    message:res.msg
                                });
                            }
                        })
                        break;
                    }
                }

                
            }
        },
        
        changeLevelTwoActive(id) {
            console.log('改变',id)
            localStorage.setItem("activeChildDeptId", id);
        },
        changeUserLevelOneActive(ids){
            console.log('改变',ids)
            localStorage.setItem("activeExecutorId", ids.join(','));
        },
        changeUserLevelTwoActive(ids){
            console.log('改变',ids)
            localStorage.setItem("activeTwoExecutorId", ids.join(','));
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

        addTaskByExecutorId(id) {
            // 根据执行人增加任务
            this.$emit('addTaskByExecutorId', id)
        },
        auditTask(id) {
            // 审核
            this.$emit('auditTask', id)
        },
        tipCompleteModal(id) {
            // 提醒完成
            this.$emit('tipCompleteModal', id)
        },
        completeModal(id) {
            // 完成
            this.$emit('completeModal', id)
        },
        levelComeplete(id) {
            // 任务评价
            this.$emit('levelComeplete', id)
        },
        editTask(id) {
            // 编辑任务
            this.$emit('editTask', id)
        },
        replyTask(row,event) {
            // 任务回复
            this.$emit('replyTask', row, event);
        },
        callBackTask(id) {
            // 撤回任务
            this.$emit('callBackTask', id);
        },
    }
}
</script>

<style scoped lang="scss">
.zc-collapse {
    /deep/ {
        .el-collapse {
            border: 0;
        }
        .el-collapse-item__wrap {
            border: 0;
        }
        .el-collapse-item {
            .el-collapse-item__arrow {
                display: none;
            }
            .el-collapse-item__header {
                padding: 0 20px;
                height: 46px;
                line-height: 46px;
                background: #FBEBEB;
                margin-bottom: 5px;
                border-bottom: 0;
                .zc-collapse-title {
                    width: 100%;
                    > span {
                        font-size: 16px;
                        font-weight: bold;
                        color: #000000;
                    }
                    .zc-collapse-title-btns {
                        float: right;
                    }
                }

            }
            .el-collapse-item__content {
                padding-bottom: 0;
                margin-bottom: 5px;
                .zc-collapse-content {
                    .zc-collapse-content-total {
                        height: 46px;
                        line-height: 46px;
                        border: 1px solid rgba(0,0,0,.12);
                        font-size: 14px;
                        color: #333;
                        background: #fff;
                        margin-bottom: 5px;
                        li {
                            margin-left: 30px;
                            margin-right: 30px;
                            display: inline-block;
                        }
                    }
                    .zc-collapse-title {
                        > span {
                            padding-left: 10px;
                            font-size: 14px;
                        }
                    }
                }
            }
        }
    }

}
.title-txt {
    font-weight: bold;
    font-size: 16px;
}
.title-checkboxs {
    display: inline-block;
    margin-left: 30px;
    /deep/ .el-checkbox-group {
        display: inline-block;
    }
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

.el-button + .link-btn {
    margin-left: 10px;
}
</style>
