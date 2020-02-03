<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">计划总结管理</span> /
            <router-link to="/planSummaryManage/planManage">
                <span class="child1">计划管理</span>
            </router-link> /
            <span class="child2">{{id ? '编辑计划' : '发起计划'}}</span>
        </div>
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">{{listTitle}}</div>
                <div class="idss-list-top-btn-groups">
                    <el-button size="small" type="primary" plain @click="submit(0)" v-if="!id || planStatus == 'TOSUBMIT'">保存草稿</el-button>
                    <el-button size="small" type="primary" @click="submit(1)" v-if="!id || planStatus == 'TOSUBMIT'">提交计划</el-button>
                    <el-button size="small" type="primary" @click="submit(2)" v-else>提交计划</el-button>
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
                            placeholder="年-月-日"
                            :picker-options="pickerOptions">
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
import { newPlanTasklist,personalPlanDetail,updatePlan,listByExecutor, getSysPlanSummarysNoAuth,getSysExamineGroupsNoAuth,publishPlan,saveDraftPlan} from 'service/getData'
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
                
                personalPlanDetail({
                    id: this.id, // 1个人计划 2部门计划
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
                newPlanTasklist().then((res) => {
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
                    this.dialogSetGroup = false;
                }
            })
        },
        submit(submitType) {
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
</style>
