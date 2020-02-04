<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">计划总结管理</span> /
            <router-link to="/planSummaryManage/summaryManage">
                <span class="child1">总结管理</span>
            </router-link> /
            <span class="child2">{{id ? '编辑总结' : '发起总结'}}</span>
        </div>
        <div class="idss-list m-b">
            <div class="idss-list-top">
                <div class="idss-list-top-title">{{listTitle}}</div>
                <div class="idss-list-top-btn-groups">
                    <el-button size="small" type="primary" plain @click="submit(0)" v-if="!id || summaryStatus == 'TOSUBMIT'">保存草稿</el-button>
                    <el-button size="small" type="primary" @click="submit(1)" v-if="!id || summaryStatus == 'TOSUBMIT'">提交总结</el-button>
                    <el-button size="small" type="primary" @click="submit(2)" v-else>提交总结</el-button>
                </div>
            </div>
                
            <el-table :data="listData">
                <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column label="类别">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.taskTypeId" clearable placeholder="请选择" size="small" v-if="!scope.row.id">
                            <el-option
                                v-for="item in optionType"
                                :key="item.taskTypeId"
                                :label="item.taskTypeName"
                                :value="item.taskTypeId">
                            </el-option>
                        </el-select>
                        <span v-else>{{scope.row.taskTypeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="事项">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.title" placeholder="请输入事项" size="small" v-if="!scope.row.id"></el-input>
                        <span v-else>{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="本月目标">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.taskGoal" placeholder="请输入本月目标" size="small" v-if="!scope.row.id">
                            <el-button slot="append" @click="openDialogQuick(scope.row,scope.$index)">
                                <span class="el-color-primary">快捷设置</span>
                            </el-button>
                        </el-input>
                        <span v-else>{{scope.row.taskGoal}}</span>
                    </template>
                </el-table-column>
                
                <el-table-column label="最迟完成时间" width="160px">
                    <template slot-scope="scope">
                        
                        <el-date-picker
                            v-model="scope.row.planEndDate"
                            value-format="yyyy-MM-dd"
                            type="date"
                            style="width:140px;"
                            size="small"
                            v-if="!scope.row.id"
                            placeholder="年-月-日"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                        <span v-else>{{scope.row.planEndDate}}</span>
                    </template>
                </el-table-column>
                
                <el-table-column label="工作量基数" width="100">
                    <template slot-scope="scope">
                        <el-select
                            v-model="scope.row.taskWorkload"
                            placeholder="请选择"
                            clearable 
                            :disabled="!!scope.row.id"
                            size="small">
                            <el-option v-for="item in 10" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                
                <el-table-column label="是否已完成"  width="100" align="center">
                    <template slot-scope="scope">
                        
                            <el-switch
                                v-model="scope.row.taskSummaryStatus"
                                :active-value="1"
                                :inactive-value="0"
                                :disabled="!scope.row.canFinishTaskInSummary"
                                active-color="#13ce66">
                            </el-switch>
                            
                    </template>
                </el-table-column>
                <el-table-column label="本人总结">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.taskComment" placeholder="请输入本人总结" size="small">
                            <el-button slot="append" @click="openDialogComment(scope.row,scope.$index)">
                                <span class="el-color-primary">快捷设置</span>
                            </el-button>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="自评打分" width="100">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.taskScore" :disabled="scope.row.taskScoreIsDisabled" placeholder="打分" size="small"></el-input>
                    </template>
                </el-table-column>

            </el-table>


            <div class="summary-table-tfoot">
                <a href="javascript:;" class="color-primary" @click="addListItem">添加任务</a>
            </div>
            
        </div>
        
        <div class="idss-list m-b">
            <div class="idss-list-top">
                <div class="idss-list-top-title">总结附件</div>
                <div class="idss-list-top-btn-groups">
                    <el-button type="primary" size="small" plain @click.stop="importUpdate">
                        添加附件
                        <input ref="excel-upload-input" type="file" accept="*" @change="importFiles" style='display:none'>
                    </el-button>
                </div>
            </div>
            <div class="file-list">
                <ul v-if="fileList && fileList.length > 0">
                    <li class="file-list-item" v-for="(item,index) in fileList" :key="index" @click="downloadFiles(item)">
                        
                        <span>{{item.fileName}}</span>
                        <i class="el-icon-error" @click.stop="deleteFilesItem(index)"></i>
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
import { newSummaryTasklist,personalSummaryDetail,updateSummary,listByExecutor, getSysPlanSummarysNoAuth,publishSummary,saveDraftSummary,uploadFile,downloadFile} from 'service/getData'
import {  ERR_OK } from 'service/config'
import HandleLogs from './components/handleLogs'
import {baseUrl} from './../../config/env'

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
            
            fileList: [], //附件管理

            
            handQuickDialogIndex: 0, // 当前弹窗操作索引


            dialogSetTip: false,

            
            commentTips: [], // 总结快捷语
            dialogSetComment: false,

            baseUrl: baseUrl,
            
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                }
            }
        }
    },
    created() {
        this.getBaseData();
    },
    watch: {

    },
    methods: {
        getBaseData() {
            if(this.id) {
                
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

            } else {
                newSummaryTasklist().then((res) => {
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

            }
            
        },
        setBaseData(result) {
            this.listTitle =
                            (result.deptName ? result.deptName + ' ' : '')
                                +
                            (result.userName ? result.userName + ' ' : '')
                                +
                            (result.title ? result.title : '')
            this.summaryStatus = result.summaryStatus; // 状态

            this.fileList = result.fileInfoList ? result.fileInfoList : []; // 附件
            
            let newList = result.taskInfoList;
            // 处理元数据
            for(let item of newList) {
                this.approveDeptLevel = result.approveDeptLevel;

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
                        item.taskScore = j.taskScore;
                        item.taskScoreIsDisabled = !j.canEdit;
                        item.taskComment = j.taskComment;
                    }
                }
                
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
        
        importUpdate() {
            this.$refs['excel-upload-input'].click();
        },
        importFiles(e) {
            var files = e.target.files;
            let itemFile = files[0];
            let formdata = new FormData();
            formdata.append('token',localStorage.getItem('token'));
            formdata.append('file',itemFile);
            e.target.value = '';
            // 导入设备
            uploadFile(formdata).then((res) => {
                if (res.code == ERR_OK) {
                    console.log('上传成功',res.data)
                    this.fileList.push(res.data);
                } else {
                    this.$notify({
                        type: 'warning',
                        title: "提示",
                        message: res.msg
                    });
                }
            })
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
        deleteFilesItem(index) { // 删除项目
            this.fileList.splice(index, 1);
        },
        submit(submitType) {
            let _taskList = [];
            for(let item of this.listData) {
                
                if( item.taskTypeId || item.title || item.taskGoal || item.planEndDate || item.taskWorkload || item.taskComment || item.taskScore) {
                    // 有填其中一项
                    if ( ( item.id || (item.taskTypeId && item.title && item.taskGoal && item.planEndDate && item.taskWorkload) ) && item.taskComment && item.taskScore) {
                        // 组装数据处理
                        let _taskEvaluatePojoJson = [];
                        if (!this.approveDeptLevel) {this.approveDeptLevel = -1;}

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
                            message: '请将所有项填写完整'
                        });
                        return;
                    }
                }
            }
            if (_taskList.length === 0){
                this.$notify({
                    type: 'warning',
                    title: "提示",
                    message: '请将所有项填写完整'
                });
                return;
            }
            let _attachFileIds = []; // 附件
            if (this.fileList && this.fileList.length > 0) {
                for(let item of this.fileList) {
                    _attachFileIds.push(item.id)
                }
            }
            let params = {
                summaryType: 1, // 1个人 2部门
                taskListJson: JSON.stringify(_taskList),
                attachFileIds: _attachFileIds.join(',')
            }
            if (this.id) {
                params.id = this.id;
            }
            if (submitType === 0) {
                saveDraftSummary(params).then((res) => {
                    if (res.code == ERR_OK) {
                        this.$router.push('/planSummaryManage/summaryManage');
                        this.$notify({
                            type: 'success',
                            title: "成功",
                            message: '保存成功'
                        });
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: "提示",
                            message: res.msg
                        });
                    }
                })
            } else if (submitType === 1){
                publishSummary(params).then((res) => {
                    if (res.code == ERR_OK) {
                        this.$router.push('/planSummaryManage/summaryManage');
                        this.$notify({
                            type: 'success',
                            title: "成功",
                            message: '提交成功'
                        });
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: "提示",
                            message: res.msg
                        });
                    }
                })
            } else if (submitType === 2){
                updateSummary(params).then((res) => {
                    if (res.code == ERR_OK) {
                        this.$router.push('/planSummaryManage/summaryManage');
                        this.$notify({
                            type: 'success',
                            title: "成功",
                            message: '提交成功'
                        });
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: "提示",
                            message: res.msg
                        });
                    }
                })
            }
        }

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
