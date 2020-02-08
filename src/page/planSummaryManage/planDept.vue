<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">计划总结管理</span> /
            <router-link to="/planSummaryManage/planManage">
                <span class="child1">计划管理</span>
            </router-link> /
            <span class="child2">{{id ? '编辑计划' : '发起计划'}}</span>
        </div>
        
            
        <div class="idss-list m-b" v-for="(item,index) in detailList" :key="index">
            <div class="idss-list-top">
                <div class="idss-list-top-title">{{item.deptName || ''}} {{item.title || ''}}</div>
                <div class="idss-list-top-btn-groups" v-if="index === 0">
                    <el-button size="small" type="primary" plain @click="submit(0)" v-if="!id || planStatus == 'TOSUBMIT'">保存草稿</el-button>
                    <el-button size="small" type="primary" @click="submit(1)" v-if="!id || planStatus == 'TOSUBMIT'">提交计划</el-button>
                    <el-button size="small" type="primary" @click="submit(2)" v-else>提交计划</el-button>
                </div>
            </div>
            <div v-if="item.planInfoList && item.planInfoList.length > 0">
                <div v-for="(j,k) in item.planInfoList" :key="k" class="dept-list">
                    <div class="dept-list-top">
                        {{j.userName || '无名'}}
                        <el-button class="m-l-10" type="primary" size="small" plain v-if="validateLevel(j.approveLevel) && (j.planStatus == 'TOAPPROVE' || j.planStatus == 'APPROVING' || j.planStatus == 'FIRSTAPPROVED')" @click="linkPlanAudit(j.id)">审核</el-button>
                        <span v-if="!j.taskInfoList || j.taskInfoList.length === 0">该员工因特殊原因无法提交本月计划</span>
                        <div v-if="!j.taskInfoList || j.taskInfoList.length === 0" class="dept-list-top-input">
                            <span v-if="!j.canEditNoSubmitReason">{{j.notSubmitReason}}</span>
                            <el-input v-if="j.canEditNoSubmitReason" size="small" v-model="j.notSubmitReason" placeholder="请填写原因" style="width: 300px"></el-input>
                        </div>
                    </div>
                    
                    <el-table :data="j.taskInfoList" v-if="j.taskInfoList && j.taskInfoList.length > 0">
                        <el-table-column type="index" label="序号" width="120"></el-table-column>
                        <el-table-column label="类别">
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
                        <el-table-column label="权重" width="110">
                            <template slot-scope="scope">
                                <span>{{scope.row.weight || ''}}</span>
                            </template>
                        </el-table-column>
                    </el-table>

                </div>
            </div>
            <div class="dept-list" v-else>
                <div class="dept-list-top">
                    <span>该部门因特殊原因无法提交本月计划</span>
                    <div class="dept-list-top-input m-b">
                        <el-input size="small" v-model="item.notSubmitReason" placeholder="请填写原因" style="width: 300px"></el-input>
                    </div>
                </div>
            </div>

        </div>

        <!-- 操作记录 -->
        <HandleLogs :logType="2" :id="id"></HandleLogs>
        
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            v-if="dialogVisible"
            width="330px">
            <div>
                <h3>以下员工计划未被审核：</h3>
                <ul>
                    <li v-for="(item,index) in notAuditUser" :key="index" style="line-height:30px;margin-top: 10px;">
                        {{item.userName}} 
                        <span>
                            （<a href="javascript:;" @click="linkPlanAudit(item.id)">去审核</a>）
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
import { deptPlanDetail,updatePlan,publishPlan,saveDraftPlan} from 'service/getData'
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
            planStatus: '',
            
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
                
                deptPlanDetail({
                    id: this.id
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        this.setBaseData(res.data.deptPlanPojoList);
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: "提示",
                            message: res.msg
                        });
                    }
                })
            } else {

                deptPlanDetail().then((res) => {
                    if (res.code == ERR_OK) {
                        this.setBaseData(res.data.deptPlanPojoList);
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
            this.detailList = result;
            this.planStatus = result && result[0] && result[0].planStatus;
            
            this.computeWeight(); // 计算权重信息
        },
        
        computeWeight() {
            for(let i of this.detailList) {
                
                for(let j of i.planInfoList) {
                    
                    if( j.taskInfoList && j.taskInfoList.length > 0) {
                        
                        // 计算权重
                        let sum = 0;
                        for (let item of j.taskInfoList) {
                            if(item.taskWorkload) {
                                sum += parseInt(item.taskWorkload);
                            }
                        }
                        for (let item of j.taskInfoList) {
                            if(item.taskWorkload) {
                                let _weight = parseFloat(parseInt(item.taskWorkload) * 100 / sum).toFixed(2) + '%';
                                this.$set(item, 'weight',_weight);
                            }
                        }
                    }

                }
                
            }
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
        linkPlanAudit(id) {
            // 审核个人计划
            this.$router.push({
                path: "/planSummaryManage/planAudit",
                query: {
                    id: id,
                    type: 1
                }
            })
        },
        submit(submitType) {

            let _notAuditUser = [];
            for(let item of this.detailList) {
                
                for(let j of item.planInfoList) {
                    if(this.validateLevel(j.approveLevel) && (j.planStatus == 'TOAPPROVE' || j.planStatus == 'APPROVING' || j.planStatus == 'FIRSTAPPROVED')) {
                        _notAuditUser.push(j);
                    }
                }

            }
            if (submitType !== 0 && (_notAuditUser.length > 0) ) {
                this.notAuditUser = [..._notAuditUser];
                this.dialogVisible = true;
                return;
            }
            let isValidate = true;
            let _PlanInfoPojo = [];
            for(let item of this.detailList) {
                if (submitType !== 0 && !isValidate) return;
                if (!item.planInfoList || item.planInfoList.length === 0) {
                    _PlanInfoPojo.push({
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
                                message: '有部门未提交计划，请为其填写原因'
                            });
                        }
                        break;
                    }
                    return;
                }
                for(let j of item.planInfoList) {
                    if( !j.taskInfoList || j.taskInfoList.length == 0) {
                        if (j.canEditNoSubmitReason) {
                            _PlanInfoPojo.push({
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
                                        message: '有员工未提交计划，请为其填写原因'
                                    });
                                }
                                break;
                            }
                    }
                }

            }
            if (submitType !== 0 && !isValidate) return;

            let params = {
                planType: 2, // 1个人 2部门
                deptPlanDetail: JSON.stringify(_PlanInfoPojo)
            }
            if (this.id) {
                params.id = this.id;
            }
            if (submitType === 0) {
                
                saveDraftPlan(params).then((res) => {
                    if (res.code == ERR_OK) {
                        this.$router.push('/planSummaryManage/planManage');
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
                publishPlan(params).then((res) => {
                    if (res.code == ERR_OK) {
                        this.$router.push('/planSummaryManage/planManage');
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
                updatePlan(params).then((res) => {
                    if (res.code == ERR_OK) {
                        this.$router.push('/planSummaryManage/planManage');
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
            line-height: 0;
            color: #666666;
        }
    }
    .el-table {
        border-top: 1px solid #DADFEA;
    }
}
</style>
