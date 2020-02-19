<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">计划总结管理</span> /
            <router-link to="/planSummaryManage/summaryManage">
                <span class="child1">总结管理</span>
            </router-link> /
            <span class="child2">{{id ? '编辑总结' : '发起总结'}}</span>
        </div>
        
            
        <div class="idss-list m-b" v-for="(item,index) in detailList" :key="index">
            <div class="idss-list-top">
                <div class="idss-list-top-title">{{item.deptName || ''}} {{item.title || ''}}</div>
                <div class="idss-list-top-btn-groups" v-if="index === 0">
                    <el-button size="small" type="primary" plain @click="submit(0)" v-if="!id || summaryStatus == 'TOSUBMIT'">保存草稿</el-button>
                    <el-button size="small" type="primary" @click="submit(1)" v-if="!id || summaryStatus == 'TOSUBMIT'">提交总结</el-button>
                    <el-button size="small" type="primary" @click="submit(2)" v-else>提交总结</el-button>
                </div>
            </div>
            <div v-if="item.summaryInfoList && item.summaryInfoList.length > 0">
                <div v-for="(j,k) in item.summaryInfoList" :key="k" class="dept-list">
                    <div class="dept-list-top">
                        {{j.userName || '无名'}}
                        <el-button class="m-l-10" type="primary" size="small" plain @click="linkSummaryAudit(j.id)" v-if="validateLevel(j.approveLevel) && (j.summaryStatus == 'TOAPPROVE' || j.summaryStatus == 'APPROVING' || j.summaryStatus == 'FIRSTAPPROVED')">审核</el-button>
                        <span v-if="!j.taskInfoList || j.taskInfoList.length === 0">该员工因特殊原因无法提交本月总结</span>
                        <div v-if="!j.taskInfoList || j.taskInfoList.length === 0" class="dept-list-top-input">
                            <span v-if="!j.canEditNoSubmitReason">{{j.notSubmitReason}}</span>
                            <el-input v-if="j.canEditNoSubmitReason" size="small" v-model="j.notSubmitReason" placeholder="请填写原因" style="width: 300px"></el-input>
                        </div>
                    </div>
                    
                    <el-table :data="j.taskInfoList" v-if="j.taskInfoList && j.taskInfoList.length > 0">
                        <el-table-column label="类别" width="180">
                            <template slot-scope="scope">
                                <span>{{scope.row.taskTypeName || ''}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="事项">
                            <template slot-scope="scope">
                                <span>{{scope.row.title || ''}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="本月目标">
                            <template slot-scope="scope">
                                <span>{{scope.row.taskGoal || ''}}</span>
                            </template>
                        </el-table-column>
                        
                        <el-table-column label="最迟完成时间" width="160px">
                            <template slot-scope="scope">
                                <span>{{scope.row.planEndDate || ''}}</span>
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

                        <el-table-column v-for="(item,index) in j.showScoreLabels" :key="index" :label="j.showScoreLabels[index]" width="110">
                            <template>
                                <span>{{j.showScoreValues[index] || '-'}}</span>
                            </template>
                        </el-table-column>
                    </el-table>

                </div>
            </div>
            <div class="dept-list" v-else>
                <div class="dept-list-top">
                    <span>该部门因特殊原因无法提交本月总结</span>
                    <div class="dept-list-top-input m-b">
                        <el-input size="small" v-model="item.notSubmitReason" placeholder="请填写原因" style="width: 300px"></el-input>
                    </div>
                </div>
            </div>

        </div>

        <!-- 操作记录 -->
        <HandleLogs :logType="3" :id="id"></HandleLogs>
        
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            v-if="dialogVisible"
            width="330px">
            <div>
                <h3>以下员工总结未被审核：</h3>
                <ul>
                    <li v-for="(item,index) in notAuditUser" :key="index" style="line-height:30px;margin-top: 10px;">
                        {{item.userName}} 
                        <span>
                            （<a href="javascript:;" @click="linkSummaryAudit(item.id)">去审核</a>）
                        </span>
                    </li>
                </ul>
            </div>
            <div slot="footer" class="dialog-footer text-right">
                <el-button size="small" type="primary" @click="dialogVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        
    </div>
</template>

<script>
import { deptSummaryDetail,updateSummary,publishSummary,saveDraftSummary} from 'service/getData'
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
            deptLevel: '',
            summaryStatus: '',
            
            detailList: [],
            
            notAuditUser: [],
            dialogVisible: false,

        }
    },
    created() {
        this.deptLevel = localStorage.getItem("deptLevel");
        this.getBaseData();
    },
    watch: {

    },
    methods: {
        getBaseData() {
            if(this.id) {
                
                deptSummaryDetail({
                    id: this.id
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        this.setBaseData(res.data.deptSummaryPojoList);
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: "提示",
                            message: res.msg
                        });
                    }
                })
            } else {

                deptSummaryDetail().then((res) => {
                    if (res.code == ERR_OK) {
                        this.setBaseData(res.data.deptSummaryPojoList);
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
            let _newList = result;
            // 处理元数据
            for(let l of _newList) {
                if(!l.summaryInfoList) continue;
                for(let v of l.summaryInfoList) {
                    for(let item of v.taskInfoList) {
                        let _taskEvaluatePojoJson = [];
                        if (item.taskEvaluatePojoJson) {
                            _taskEvaluatePojoJson = JSON.parse(item.taskEvaluatePojoJson);
                        } else {
                            _taskEvaluatePojoJson = [
                                {
                                    canEdit: true,
                                    taskScore: '',
                                    taskComment: '',
                                    deptLevel: v.approveDeptLevel
                                }
                            ]
                        }
                        let showScoreLabels = [];
                        let showScoreValues = [];

                        for(let j of _taskEvaluatePojoJson) {
                            if (j.deptLevel == -1) { // 本人总结
                                item.taskComment = j.taskComment;
                            }

                            if (j.deptLevel == v.approveDeptLevel) {
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
                        v.showScoreLabels = showScoreLabels;
                        v.showScoreValues = showScoreValues;

                    }

                }
            }
            this.detailList = [..._newList];
            this.summaryStatus = result && result[0] && result[0].summaryStatus;
            
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
        linkSummaryAudit(id) {
            // 审核个人总结
            this.$router.push({
                path: "/planSummaryManage/summaryAudit",
                query: {
                    id: id,
                    type: 1
                }
            })
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
        submit(submitType) {

            let _notAuditUser = [];
            for(let item of this.detailList) {
                if(!item.summaryInfoList) continue;
                for(let j of item.summaryInfoList) {
                    if(this.validateLevel(j.approveLevel) && (j.summaryStatus == 'TOAPPROVE' || j.summaryStatus == 'APPROVING' || j.summaryStatus == 'FIRSTAPPROVED')) {
                        _notAuditUser.push(j);
                    }
                }

            }
            if (submitType !== 0 && _notAuditUser.length > 0) {
                this.notAuditUser = [..._notAuditUser];
                this.dialogVisible = true;
                return;
            }
            let isValidate = true;
            let _SummaryInfoPojo = [];
            for(let item of this.detailList) {
                if (submitType !== 0 && !isValidate) return;

                if (!item.summaryInfoList || item.summaryInfoList.length === 0) {
                    _SummaryInfoPojo.push({
                        userId: item.userId,
                        notSubmitReason: item.notSubmitReason
                    })
                    // 填原因
                    if (!item.notSubmitReason) {
                        isValidate = false;
                        if(submitType !== 0) {
                            this.$notify({
                                type: 'warning',
                                title: "提示",
                                message: '有部门未提交总结，请为其填写原因'
                            });
                        }
                        break;
                    }
                    continue;
                }
                for(let j of item.summaryInfoList) {

                    if( !j.taskInfoList || j.taskInfoList.length == 0) {
                        if (j.canEditNoSubmitReason) {
                            _SummaryInfoPojo.push({
                                userId: j.userId,
                                notSubmitReason: j.notSubmitReason
                            })
                        }
                            // 填原因
                            if (!j.notSubmitReason) {
                                isValidate = false;
                                if(submitType !== 0) {
                                    this.$notify({
                                        type: 'warning',
                                        title: "提示",
                                        message: '有员工未提交总结，请为其填写原因'
                                    });
                                }
                                break;
                            }
                    }
                }

            }
            if (submitType !== 0 && !isValidate) return;
            let params = {
                summaryType: 2, // 1个人 2部门
                deptSummaryDetail: JSON.stringify(_SummaryInfoPojo)
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

.dept-list {
    margin-bottom: 20px;
    .dept-list-top {
        line-height: 40px;
        padding: 10px 20px;
        > span {
            font-size: 12px;
            color: #999;
        }
        .dept-list-top-input {
            line-height: 1;
            color: #666666;
        }
    }
    .el-table {
        border-top: 1px solid #DADFEA;
    }
}
</style>
