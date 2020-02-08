<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">计划总结管理</span> /
            <router-link to="/planSummaryManage/planManage">
                <span class="child1">计划管理</span>
            </router-link> /
            <span class="child2">审核计划</span>
        </div>
        <div class="idss-list" v-if="type == 1">
            <div class="idss-list-top">
                <div class="idss-list-top-title">{{listTitle}}</div>
                <div class="idss-list-top-btn-groups">
                    <el-button size="small" type="primary" @click="submit()">通过审核</el-button>
                </div>
            </div>
                
            <el-table :data="listData">
                <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column label="类别">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.taskTypeId" clearable placeholder="请选择" size="small" v-if="scope.row.taskCategory != 2">
                            <el-option
                                v-for="item in optionType"
                                :key="item.taskTypeId"
                                :label="item.taskTypeName"
                                :value="item.taskTypeId">
                            </el-option>
                        </el-select>
                        <el-input v-model="scope.row.taskTypeName" disabled size="small" v-else></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="事项">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.title" placeholder="请输入事项" size="small" v-if="scope.row.taskCategory != 2"></el-input>
                        <el-input v-model="scope.row.title" disabled size="small" v-else></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="本月目标">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.taskGoal" placeholder="请输入本月目标" size="small">
                            <el-button slot="append" @click="openDialogQuick(scope.row,scope.$index)">
                                <span class="el-color-primary">快捷设置</span>
                            </el-button>
                        </el-input>
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
                            v-if="scope.row.taskCategory != 2"
                            :picker-options="pickerOptions"
                            placeholder="年-月-日">
                        </el-date-picker>
                        <el-input v-model="scope.row.planEndDate" disabled size="small" v-else></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="权重" width="110">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.weight" disabled placeholder="" size="small"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="工作量基数">
                    <template slot-scope="scope">
                        <el-select
                            v-model="scope.row.taskWorkload"
                            placeholder="请选择"
                            clearable 
                            @change="computeWeight"
                            size="small">
                            <el-option v-for="item in 10" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" slot="append" @click="deleteListItem(scope.$index)" v-if="scope.$index > 0">删除该项</el-button>
                    </template>
                </el-table-column> -->
            </el-table>


            <div class="plan-table-tfoot">
                <a href="javascript:;" class="color-primary" @click="addListItem">添加一条</a>
            </div>
            
        </div>
        
        <div class="idss-list m-b" v-for="(item,index) in detailList" :key="index" v-if="type == 2">
            <div class="idss-list-top">
                <div class="idss-list-top-title">{{item.deptName || ''}} {{item.title || ''}}</div>
                <div class="idss-list-top-btn-groups">
                    <el-button size="small" type="primary" @click="startAudit" v-if="index === 0">开始审核</el-button>
                </div>
            </div>
            <div class="submitCondition" v-if="index === 0">{{submitCondition}}</div>
            <div v-if="item.planInfoList && item.planInfoList.length > 0">
                <div v-for="(j,k) in item.planInfoList" :key="k" class="dept-list">
                    <div class="dept-list-top">
                        {{j.userName || '无名'}}
                        <el-button class="m-l-10" type="primary" size="small" plain v-if="validateLevel(j.approveLevel) && (j.planStatus == 'TOAPPROVE' || j.planStatus == 'APPROVING' || j.planStatus == 'FIRSTAPPROVED')" @click="linkPlanAudit(j.id)">审核</el-button>
                        <span v-if="!j.taskInfoList || j.taskInfoList.length === 0">该员工因特殊原因无法提交本月计划</span>
                        <div v-if="!j.taskInfoList || j.taskInfoList.length === 0" class="dept-list-top-input">
                            <span>{{j.notSubmitReason}}</span>
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
                        <span>{{item.notSubmitReason}}</span>
                    </div>
                </div>
            </div>

        </div>
        <!-- 操作记录 -->
        <HandleLogs :logType="2" :id="id"></HandleLogs>
        
        <el-dialog title="设置考核组" :visible.sync="dialogSetGroup" v-if="dialogSetGroup" width="350px">
            <el-form :model="setGroupForm" ref="setGroupForm" :rules="setGroupFormRules" label-position="left" label-suffix="：">
                <el-form-item :label="handQuickDialogInfo.name" prop="num">
                    <el-input type="text" v-model="setGroupForm.num" placeholder="" size="small" style="width:120px"></el-input> {{handQuickDialogInfo.unit}}
                </el-form-item>
            </el-form>
            <div slot="footer" class="text-right">
                <el-button size="small" @click="dialogSetGroup = false">取 消</el-button>
                <el-button size="small" type="primary" @click="setGroupSubmit">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="设置本月目标" :visible.sync="dialogSetTip" v-if="dialogSetTip" width="350px">
            
            <div class="quicktips">
                <span class="el-color-primary" v-for="(item,index) in quickTips" :key="index" @click="checkQuickTip(item)">{{item}}</span>
            </div>
            <div slot="footer" class="text-right">
                <el-button size="small" @click="dialogSetTip = false">取 消</el-button>
            </div>
        </el-dialog>

        
        
    </div>
</template>

<script>
import { updateToApproving,deptPlanDetail,personalPlanDetail,listByExecutor, getSysPlanSummarysNoAuth,getSysExamineGroupsNoAuth,approvePlan} from 'service/getData'
import {  ERR_OK } from 'service/config'
import HandleLogs from './components/handleLogs'
export default {
    components: {
        HandleLogs
    },
    computed: {
        id() {
            return this.$route.query.id
        },
        type() {
            return this.$route.query.type
        }
    },
    data () {
        return {
            userName: '',
            deptLevel: '',
            listTitle: '发起计划',
            planStatus: '',
            
            listData: [
                {
                    taskTypeId: '', // 类别
                    title: '', // 事项
                    taskGoal: '', //目标
                    planEndDate: '', //完成时间
                    weight: '', //权重
                    taskWorkload: '', //工作量基数
                }
            ],
            detailList: [],
            quickTips: [], //快捷提示语

            optionType: [],
            
            dialogSetGroup: false,
            setGroupForm: {
                num: ''
            },
            setGroupFormRules: {
                num: [
                    { required: true, message: '请输入' }
                ]
            },

            
            handQuickDialogIndex: 0, // 当前弹窗操作索引
            handQuickDialogInfo: {}, // 弹窗信息


            dialogSetTip: false,

            submitCondition: '', // 提交情况
            firstApproveId: '', // 待审核人员

            
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                }
            }
        }
    },
    created() {
        this.deptLevel = localStorage.getItem("deptLevel");
        // 变更计划为审核中状态
        updateToApproving({
            id: this.id,
        }).then((res) => {})

        this.getBaseData();
    },
    watch: {

    },
    methods: {
        getBaseData() {
            if(this.type == 2) {
                // 部门计划
                deptPlanDetail({
                    id: this.id
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        this.submitCondition = res.data.submitCondition;
                        this.firstApproveId = res.data.firstApprovePlanId;
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
                personalPlanDetail({
                    id: this.id, // 1个人计划 2部门计划
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        this.setBaseDataPersonal(res.data);
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
            
            this.computeDeptWeight(); // 计算权重信息
        },
        setBaseDataPersonal(result) {
            this.userName = result.userName;
            this.listTitle =
                            (result.deptName ? result.deptName + ' ' : '')
                                +
                            (result.userName ? result.userName + ' ' : '')
                                +
                            (result.title ? result.title : '')
            this.planStatus = result.planStatus;
            let newList = result.taskInfoList;
            if (newList && newList.length > 0) {
                if (newList.length < 6) {
                    for(let i = newList.length; i < 6; i++) {
                        let item = { taskTypeId: '',  title: '', taskGoal: '',  planEndDate: '',  weight: '',  taskWorkload: ''  };
                        newList.push(item);
                    }
                }
            } else {
                newList = [
                    { taskTypeId: '',  title: '', taskGoal: '',  planEndDate: '',  weight: '',  taskWorkload: ''  },
                    { taskTypeId: '',  title: '', taskGoal: '',  planEndDate: '',  weight: '',  taskWorkload: ''  },
                    { taskTypeId: '',  title: '', taskGoal: '',  planEndDate: '',  weight: '',  taskWorkload: ''  },
                    { taskTypeId: '',  title: '', taskGoal: '',  planEndDate: '',  weight: '',  taskWorkload: ''  },
                    { taskTypeId: '',  title: '', taskGoal: '',  planEndDate: '',  weight: '',  taskWorkload: ''  },
                    { taskTypeId: '',  title: '', taskGoal: '',  planEndDate: '',  weight: '',  taskWorkload: ''  }
                ]
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
            this.computeWeight(); // 计算权重信息
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
        
        addListItem() { // 增加项目
            this.listData.push({
                taskTypeId: '', // 类别
                title: '', // 事项
                taskGoal: '', //目标
                planEndDate: '', //完成时间
                weight: '', //权重
                taskWorkload: '', //工作量基数
            })
        },
        deleteListItem(index) { // 删除项目
            this.listData.splice(index, 1);
        },
        computeWeight() {
            // 计算权重
            let sum = 0;
            for (let item of this.listData) {
                if(item.taskWorkload) {
                    sum += parseInt(item.taskWorkload);
                }
            }
            for (let item of this.listData) {
                if(item.taskWorkload) {
                    item.weight = parseFloat(parseInt(item.taskWorkload) * 100 / sum).toFixed(2) + '%';
                }
            }
        },
        // 计算权重 -部门计划
        computeDeptWeight() {
            
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
        
        
        checkQuickTip(item) {
            this.$set(this.listData[this.handQuickDialogIndex], 'taskGoal', item);
            this.dialogSetTip = false;
        },
        openDialogQuick(row,index) {
            this.handQuickDialogIndex = index;
            if (row.taskCategory == 2) {
                this.dialogSetGroup = true;
                getSysExamineGroupsNoAuth({
                    code: row.examineGroupCode
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        if(res.data && res.data[0] && res.data[0].pojoList && res.data[0].pojoList[0]) {
                            this.handQuickDialogInfo =  res.data[0].pojoList[0];
                        } else {
                            this.handQuickDialogInfo = {};
                        }
                        
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: "提示",
                            message: res.msg
                        });
                    }
                })
            } else {
                this.dialogSetTip = true;
                if(!this.quickTips || this.quickTips.length == 0) {
                    this.getQuickTips();
                }
            }
        },
        setGroupSubmit() {
            this.$refs.setGroupForm.validate(valid => {
                if (valid) {
                    let txt = this.handQuickDialogInfo.name + '：' + this.setGroupForm.num + this.handQuickDialogInfo.unit
                    this.listData[this.handQuickDialogIndex].taskGoal = txt;
                    this.setGroupForm.num = '';
                    this.dialogSetGroup = false;
                }
            })
        },
        submit() {
            let _taskList = [];
            for(let item of this.listData) {
                
                if( item.taskTypeId || item.title || item.taskGoal || item.planEndDate || item.taskWorkload) {
                    // 有填其中一项
                    if (item.taskTypeId && item.title && item.taskGoal && item.planEndDate && item.taskWorkload) {
                        _taskList.push(item);
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: "提示",
                            message: '请将任务填写完整'
                        });
                        return;
                    }
                }
            }
            if (_taskList.length === 0){
                this.$notify({
                    type: 'warning',
                    title: "提示",
                    message: '请将任务填写完整'
                });
                return;
            }
            let params = {
                planType: 1, // 1个人 2部门
                taskListJson: JSON.stringify(_taskList)
            }
            if (this.id) {
                params.id = this.id;
            }



            approvePlan(params).then((res) => {
                if (res.code == ERR_OK) {

                    if (res.data && res.data.id) {
                        
                        if (res.data.type == 2) {
                            this.$confirm('部门计划审核完成，是否继续审核下一个部门？', '提示', {
                                confirmButtonText: '继续审核',
                                cancelButtonText: '取消',
                                type: 'success'
                            }).then(() => {
                                this.$router.push({
                                    path: "/planSummaryManage/planAudit",
                                    query: {
                                        id: res.data.id,
                                        type: 2
                                    }
                                })
                                
                            }).catch(() => {
                                this.$router.replace('/planSummaryManage/planManage');     
                            });
                        } else {
                            this.$message({
                                offset: 50,
                                message: this.userName + ' 本月计划审核通过',
                                type: 'success'
                            });
                            this.$router.push({
                                path: "/planSummaryManage/planAudit",
                                query: {
                                    id: res.data.id,
                                    type: 1
                                }
                            })
                        }
                    } else {
                        this.$message({
                            offset: 50,
                            message: '计划审核完成',
                            type: 'success'
                        });
                        this.$router.replace('/planSummaryManage/planManage');
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
        startAudit() {
            if (this.firstApproveId) {
                this.$router.push({
                    path: "/planSummaryManage/planAudit",
                    query: {
                        id: this.firstApproveId,
                        type: 1
                    }
                })

            }
            console.log('开始审核')
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
            line-height: 30px;
            color: #666666;
        }
    }
    .el-table {
        border-top: 1px solid #DADFEA;
    }
}
.plan-table-tfoot {
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

.submitCondition {
    padding: 20px;
    font-size: 16px;
    color: #D93538;
}
</style>
