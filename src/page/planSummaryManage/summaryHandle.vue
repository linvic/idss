<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">计划总结管理</span> /
            <router-link to="/planSummaryManage/summaryManage">
                <span class="child1">总结管理</span>
            </router-link> /
            <span class="child2">处理申诉</span>
        </div>
        <div class="idss-list m-b">
            <div class="idss-list-top">
                <div class="idss-list-top-title">{{listTitle}}</div>
                <div class="idss-list-top-btn-groups">
                    <el-button size="small" plain type="primary" @click="submit(0)">驳回申诉</el-button>
                    <el-button size="small" type="primary" @click="submit(1)">提交打分</el-button>
                </div>
            </div>
            <div class="appeal-txt">申诉原因：{{appealReason}}</div>
            <el-table :data="listData">
                <el-table-column label="类别" width="180">
                    <template slot-scope="scope">
                        <span>{{scope.row.taskTypeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="事项">
                    <template slot-scope="scope">
                        <span>{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="本月目标">
                    <template slot-scope="scope">
                        <span>{{scope.row.taskGoal}}</span>
                    </template>
                </el-table-column>
                
                <el-table-column label="最迟完成时间" width="160px">
                    <template slot-scope="scope">
                        
                        <span>{{scope.row.planEndDate}}</span>
                    </template>
                </el-table-column>
                
                <el-table-column label="工作量基数" width="90">
                    <!-- <template slot-scope="scope">
                        <span>{{scope.row.taskWorkload}}</span>
                    </template> -->
                            <!-- :disabled="!!scope.row.id" -->

                    <template slot-scope="scope">
                        <el-select
                            v-model="scope.row.taskWorkload"
                            placeholder="请选择"
                            size="small">
                            <el-option v-for="item in 10" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                
                <el-table-column label="是否已完成" width="100" align="center">
                    <template slot-scope="scope">
                        
                        
                            <el-switch
                                v-model="scope.row.taskSummaryStatus"
                                :active-value="1"
                                :inactive-value="0"
                                :disabled="true"
                                active-color="#13ce66">
                            </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="本人总结">
                    <template slot-scope="scope">
                        <span>{{scope.row.taskComment}}</span>
                    </template>
                </el-table-column>

                
                <el-table-column v-for="(item,index) in showScoreLabels" :key="index" width="110">
                    <template slot="header" slot-scope="scope">
                        {{showScoreLabels[index]}}
                    </template>

                    <template slot-scope="scope">
                        <el-input v-if="index === scoreIndex" v-model="scope.row.taskScore" placeholder="打分" size="small"></el-input>
                        <span v-else>{{scope.row.showScoreValues[index] || '-'}}</span>
                    </template>
                </el-table-column>
                
                

            </el-table>

            <!-- 
            <div class="summary-table-tfoot">
                <a href="javascript:;" class="color-primary" @click="addListItem">添加任务</a>
            </div> -->
            
        </div>
        <div class="idss-list m-b">
            <div class="idss-list-top">
                <div class="idss-list-top-title">总结附件</div>
            </div>
            <div class="file-list">
                <ul v-if="fileList && fileList.length > 0">
                    <li class="file-list-item" v-for="(item,index) in fileList" :key="index" @click="downloadFiles(item)">
                        
                        <span>{{item.fileName}}</span>
                    </li>
                </ul>
                <div v-else class="file-list-nodata">暂无数据</div>
                
            </div>
        </div>
        
        <!-- 操作记录 -->
        <HandleLogs :logType="3" :id="id"></HandleLogs>
        
        <el-dialog title="设置本月目标" :visible.sync="dialogSetTip" v-if="dialogSetTip" width="350px">
            
            <div class="quicktips">
                <span class="el-color-primary" v-for="(item,index) in quickTips" :key="index" @click="checkQuickTip(item)">{{item}}</span>
            </div>
            <div slot="footer" class="text-right">
                <el-button size="small" @click="dialogSetTip = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="设置本人总结" :visible.sync="dialogSetComment" v-if="dialogSetComment" width="350px">
            
            <div class="quicktips">
                <span class="el-color-primary" v-for="(item,index) in commentTips" :key="index" @click="checkCommentTip(item)">{{item}}</span>
            </div>
            <div slot="footer" class="text-right">
                <el-button size="small" @click="dialogSetComment = false">取 消</el-button>
            </div>
        </el-dialog>

        
        
    </div>
</template>

<script>
import { updateToApprovingSummary,personalSummaryDetail,listByExecutor, getSysPlanSummarysNoAuth,rejectAppeal,handleAppeal,downloadFile} from 'service/getData'
import {  ERR_OK } from 'service/config'
import HandleLogs from './components/handleLogs'
export default {
    components: {
        HandleLogs
    },
    computed: {
        id() {
            return this.$route.query.id
        }
    },
    data () {
        return {
            userName: '',
            listTitle: '发起总结',
            summaryStatus: '',
            
            listData: [
                {
                    taskTypeId: '', // 类别
                    title: '', // 事项
                    taskGoal: '', //目标
                    planEndDate: '', //完成时间
                    taskWorkload: '', //工作量基数
                    taskSummaryStatus: 2, // 是否已完成
                    taskComment: '', // 本人总结
                    taskScore: '', // 打分
                    taskScoreIsDisabled: false, // 打分是否禁用
                }
            ],
            quickTips: [], //快捷提示语

            optionType: [],
            
            appealReason: '', //申诉原因
            fileList: [], //附件管理

            
            handQuickDialogIndex: 0, // 当前弹窗操作索引


            dialogSetTip: false,
            commentTips: [], // 总结快捷语
            dialogSetComment: false,

            
            showScoreLabels: [],
            scoreIndex: 0,
            approveDeptLevel: -1,
        }
    },
    created() {
        // 变更总结为审核中状态
        // updateToApprovingSummary({
        //     id: this.id,
        // }).then((res) => {})

        this.getBaseData();
    },
    watch: {

    },
    methods: {
        getBaseData() {
            personalSummaryDetail({
                id: this.id,
            }).then((res) => {
                if (res.code == ERR_OK) {
                    this.setBaseData(res.data);
                } else {
                    this.$notify({
                        type: 'warning',
                        title: "提示",
                        message: res.msg
                    });
                }
            })
        },
        setBaseData(result) {
            this.userName = result.userName;
            this.listTitle =
                            (result.deptName ? result.deptName + ' ' : '')
                                +
                            (result.userName ? result.userName + ' ' : '')
                                +
                            (result.title ? result.title : '');
            this.appealReason = result.appealReason; // 申诉原因
            this.summaryStatus = result.summaryStatus;
            this.fileList = result.fileInfoList ? result.fileInfoList : []; // 附件
            this.approveDeptLevel = result.approveDeptLevel;
            let newList = result.taskInfoList;
            // 处理元数据
            for(let item of newList) {

                let _taskEvaluatePojoJson = [];
                if (item.taskEvaluatePojoJson) {
                    _taskEvaluatePojoJson = JSON.parse(item.taskEvaluatePojoJson);
                } else {
                    _taskEvaluatePojoJson = [
                        {
                            canEdit: true,
                            taskScore: '',
                            taskComment: '',
                            deptLevel: this.approveDeptLevel
                        }
                    ]
                }
                let showScoreLabels = [];
                let showScoreValues = [];

                for(let j of _taskEvaluatePojoJson) {
                    if (j.deptLevel == -1) { // 本人总结
                        item.taskComment = j.taskComment;
                    }

                    if (j.deptLevel == this.approveDeptLevel) {
                        let _label = this.getLevelLable(j.deptLevel);
                        this.scoreIndex = showScoreLabels.length;
                        showScoreLabels.push(_label);
                        showScoreValues.push(j.taskScore);
                        item.taskScore = j.taskScore;
                        item.taskScoreIsDisabled = !j.canEdit;
                    } else {
                        let _label = this.getLevelLable(j.deptLevel);
                        showScoreLabels.push(_label);
                        showScoreValues.push(j.taskScore);
                    }
                    
                }
                this.showScoreLabels = showScoreLabels;
                item.showScoreValues = showScoreValues;

            }
            this.listData = [...newList];
            // 获取任务类别
            listByExecutor({
                userId: result.userId
            }).then(res => {
                if (res.code == ERR_OK) {
                    this.optionType = res.data;
                }
            });
        },
        getLevelLable(v) {
            if (v == -1) {
                return '自评打分';
            } else if (v == 2) {
                return '二级部门打分';
            } else if (v == 1) {
                return '一级部门打分';
            } else if (v == 0) {
                return '总经理打分';
            }
        },
        getQuickTips() {
            getSysPlanSummarysNoAuth({
                categoryCode: 'QUICK_TIP',
                quickTipType: 1, //1计划目标2总计
            }).then((res) => {
                if (res.code == ERR_OK) {
                    if(res.data && res.data[0] && res.data[0].quickTipContent) {
                        this.quickTips = res.data[0].quickTipContent.split(',');
                    } else {
                        this.quickTips = [];
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
        getCommentTips() {
            getSysPlanSummarysNoAuth({
                categoryCode: 'QUICK_TIP',
                quickTipType: 2, //1计划目标2总计
            }).then((res) => {
                if (res.code == ERR_OK) {
                    if(res.data && res.data[0] && res.data[0].quickTipContent) {
                        this.commentTips = res.data[0].quickTipContent.split(',');
                    } else {
                        this.commentTips = [];
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
        
        addListItem() { // 增加项目
            this.listData.push({
                taskTypeId: '', // 类别
                title: '', // 事项
                taskGoal: '', //目标
                planEndDate: '', //完成时间
                taskWorkload: '', //工作量基数
                taskSummaryStatus: 2, // 是否已完成
                taskComment: '', // 本人总结
                taskScore: '', // 打分
                taskScoreIsDisabled: false, // 打分是否禁用
            })
        },
        deleteListItem(index) { // 删除项目
            this.listData.splice(index, 1);
        },
        
        
        checkQuickTip(item) {
            this.$set(this.listData[this.handQuickDialogIndex], 'taskGoal', item);
            this.dialogSetTip = false;
        },
        openDialogQuick(row,index) {
            this.handQuickDialogIndex = index;
            
            this.dialogSetTip = true;
            if(!this.quickTips || this.quickTips.length == 0) {
                this.getQuickTips();
            }
        },
        
        checkCommentTip(item) {
            this.$set(this.listData[this.handQuickDialogIndex], 'taskComment', item);
            this.dialogSetComment = false;
        },
        openDialogComment(row,index) {
            this.handQuickDialogIndex = index;
            
            this.dialogSetComment = true;
            if(!this.commentTips || this.commentTips.length == 0) {
                this.getCommentTips();
            }
        },

        submit(submitType) {

            if (submitType == 0) {

                this.$prompt('驳回申诉原因：', '驳回申诉', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputType: 'textarea',
                    inputPattern: /^[\s\S]{1,400}$/,
                    inputErrorMessage: '请输入内容（400字符内）'
                }).then(({ value }) => {
                    
                    rejectAppeal({
                        id: this.id,
                        reason: value
                    }).then((res) => {
                        if (res.code == ERR_OK) {
                            
                            this.onSuccessFun();

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
            } else if (submitType == 1) {
                
                let _taskList = [];
                
                for(let item of this.listData) {
                    
                    if( item.taskTypeId || item.title || item.taskGoal || item.planEndDate || item.taskWorkload || item.taskComment || item.taskScore) {
                        // 有填其中一项
                        if ( ( item.id || (item.taskTypeId && item.title && item.taskGoal && item.planEndDate && item.taskWorkload) ) && item.taskComment && item.taskScore) {
                            // 组装数据处理
                            let _taskEvaluatePojoJson = [];

                            if (item.taskEvaluatePojoJson) {
                                _taskEvaluatePojoJson = JSON.parse(item.taskEvaluatePojoJson);
                            } else {
                                _taskEvaluatePojoJson = [
                                    {
                                        canEdit: true,
                                        taskScore: '',
                                        taskComment: '',
                                        deptLevel: this.approveDeptLevel
                                    }
                                ]
                            }
                            for(let j of _taskEvaluatePojoJson) {
                                if (j.deptLevel == this.approveDeptLevel) {
                                    j.taskScore = item.taskScore;
                                    j.taskComment = item.taskComment;
                                }
                            }
                            item.taskEvaluatePojoJson = JSON.stringify(_taskEvaluatePojoJson);
                            _taskList.push(item);
                        } else {
                            this.$notify({
                                type: 'warning',
                                title: "提示",
                                message: '请将所有打分填写完整！'
                            });
                            return;
                        }
                    }
                }
                if (_taskList.length === 0){
                    this.$notify({
                        type: 'warning',
                        title: "提示",
                        message: '请将所有打分填写完整！'
                    });
                    return;
                }

                let params = {
                    id: this.id,
                    summaryType: 1, // 1个人 2部门
                    taskListJson: JSON.stringify(_taskList)
                }
                
                handleAppeal(params).then((res) => {
                    if (res.code == ERR_OK) {
                        this.onSuccessFun();
                        
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: "提示",
                            message: res.msg
                        });
                    }
                })
                
            }
            
        },
        
        onSuccessFun(){
            
            let unHandleDeptSummarys = localStorage.getItem('unHandleDeptSummarys');
            let _unHandleDeptSummarys = []; // 原 id组 （包含当前）
            let _newUnHandleDeptSummarys = []; // 新 id组
            if (unHandleDeptSummarys && unHandleDeptSummarys.length > 0 && unHandleDeptSummarys.split(',').length > 0) {
                _unHandleDeptSummarys = unHandleDeptSummarys.split(',');
                
                for(let item of _unHandleDeptSummarys) {
                    if (item != this.id) {
                        _newUnHandleDeptSummarys.push(item);
                    }
                }
                localStorage.setItem('unHandleDeptSummarys',_newUnHandleDeptSummarys.join(','));
            } else {
                _unHandleDeptSummarys = [];
            }
            if (_newUnHandleDeptSummarys.length > 0) {
                this.$message({
                    offset: 50,
                    message: this.userName + ' 本月总结处理通过',
                    type: 'success'
                });
                
                this.$router.push({
                    path: "/planSummaryManage/summaryHandle",
                    query: {
                        id: _newUnHandleDeptSummarys[0]
                    }
                })
            } else {
                this.$message({
                    offset: 50,
                    message: '总结处理完成',
                    type: 'success'
                });
                this.$router.replace('/planSummaryManage/summaryManage');
            }
            
        },
        
        downloadFiles(item) {
            // 导入设备
            downloadFile({
                filePath: item.filePath,
                token: localStorage.getItem('token')
            }).then((res) => {
                
                let blob = new Blob([res]);
                const fileName = item.fileName;
                const elink = document.createElement("a");
                elink.download = fileName;
                elink.style.display = "none";
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink);

            })
        },

    }
}
</script>

<style scoped lang="scss">
.summary-table-tfoot {
    line-height: 30px;
    padding-left: 30px;
    padding-bottom: 30px;
}
.quicktips span {
    cursor: pointer;
    margin-right: 30px;
    margin-bottom: 10px;
    display: inline-block;
}
.appeal-txt {
    background: #f7f7f5;
    padding: 15px 35px;
    color: #D93437;
    font-size: 12px;
}
.file-list {
    background: #fff;
    padding: 8px 0;
    .file-list-item {
        display: inline-block;
        margin: 8px 0px 8px 20px;
        line-height: 40px;
        border: 1px solid #E0E0E0;
        color: #D93538;
        font-size: 12px;
        text-align: center;
        min-width: 214px;
        padding: 0 20px;
        cursor: pointer;
        position: relative;
        .el-icon-error {
            position: absolute;
            font-size: 14px;
            right: -7px;
            top: -7px;
            cursor: pointer;
            color: #878A9A;
            &:hover {
                color: #D93538;
            }
        }
    }
    .file-list-nodata {
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        color: #909399;
    }
}
</style>
