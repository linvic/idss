<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">绩效管理</span> /
            <router-link to="/performanceManage/attendanceManage">
                <span class="child1">考勤管理</span>
            </router-link> /
            <span class="child2">核对考勤</span>
        </div>
        <div class="idss-list m-b">
            <div class="idss-list-top">
                <div class="idss-list-top-title">{{detailInfo.deptName}} {{detailInfo.userName}} {{detailInfo.examineDate}}考勤
                    <span class="tip">合计：{{detailInfo.total || '0'}}元</span>
                </div>
                <div class="idss-list-top-btn-groups">
                    <el-button size="small" plain type="primary" @click="submit(0)">考勤申诉</el-button>
                    <el-button size="small" type="primary" @click="submit(1)">确认考勤</el-button>
                </div>
            </div>
            <div class="info">
                <div class="info-title">
                    考勤概要
                    <span>共{{ countWaringDays || '0'}}次异常</span>
                </div>
                <div class="info-flex">
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">出勤天数</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.attendanceDays" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.attendanceDays || '0'}}</span>
                            天
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">休息天数</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.restDays" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.restDays || '0'}}</span>
                            天
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">平均工作时长</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.averageWorkHours" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.averageWorkHours || '0'}}</span>
                            小时
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">迟到次数</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.laterTimes" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.laterTimes || '0'}}</span>
                            次
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">早退次数</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.leaveEarlyTimes" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.leaveEarlyTimes || '0'}}</span>
                            次
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">缺卡次数</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.missCardTimes" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.missCardTimes || '0'}}</span>
                            次
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">旷工天数</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.absenteeismDays" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.absenteeismDays || '0'}}</span>
                            天
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">出差时长</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.bussinessTravelHours" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.bussinessTravelHours || '0'}}</span>
                            小时
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">外出时长</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.goOutHours" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.goOutHours || '0'}}</span>
                            小时
                        </div>
                    </div>
                    <div class="info-flex-item">
                    </div>
                </div>
            </div>
            
            <div class="info">
                <div class="info-title">
                    请假详情
                    <span>共请假{{ countWaringLeave || '0'}}小时</span>
                    
                </div>
                <div class="info-flex">
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">年假</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.yearLeave" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.yearLeave || '0'}}</span>
                            小时
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">事假</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.thingLeave" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.thingLeave || '0'}}</span>
                            小时
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">病假</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.sickLeave" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.sickLeave || '0'}}</span>
                            小时
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">调休</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.breakOff" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.breakOff || '0'}}</span>
                            小时
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">产假</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.maternityLeave" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.maternityLeave || '0'}}</span>
                            小时
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">陪产假</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.paternityLeave" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.paternityLeave || '0'}}</span>
                            小时
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">婚假</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.marriageLeave" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.marriageLeave || '0'}}</span>
                            小时
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">例假</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.exampleLeave" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.exampleLeave || '0'}}</span>
                            小时
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">丧假</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.deathLeave" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.deathLeave || '0'}}</span>
                            小时
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">哺乳假</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.lactationLeave" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.lactationLeave || '0'}}</span>
                            小时
                        </div>
                    </div>
                </div>
            </div>
            <div class="info">
                <div class="info-title">
                    加班详情
                    <span>共加班{{detailInfo.examineCount || '0'}}小时</span>
                    
                </div>
                <div class="info-flex">
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">审批单统计</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.examineCount" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.examineCount || '0'}}</span>
                            小时
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">工作日加班</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.workingOvertime" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.workingOvertime || '0'}}</span>
                            小时
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">休息日加班</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.restOvertime" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.restOvertime || '0'}}</span>
                            小时
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">节假日加班</div>
                        <div class="info-flex-item-center">
                            <el-input v-if="editStatus == 1" v-model="detailInfo.holidayOvertime" @keyup.native="onkeyupPrice($event)" size="mini" style="width:60px"></el-input>
                            <span v-else>{{detailInfo.holidayOvertime || '0'}}</span>
                            小时
                        </div>
                    </div>
                    <div class="info-flex-item"></div>
                    <div class="info-flex-item"></div>
                    <div class="info-flex-item"></div>
                    <div class="info-flex-item"></div>
                    <div class="info-flex-item"></div>
                    <div class="info-flex-item"></div>
                </div>
            </div>
            <div class="info">
                <div class="info-title">
                    计划提交情况
                    <span>共{{detailInfo.planExceptionTimes}}次异常</span>
                </div>
                <div class="info-flex">
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">个人计划提交时间</div>
                        <div class="info-flex-item-center">
                            <span>{{detailInfo.personalPlanTime || '-'}}</span>
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">个人计划提交情况</div>
                        <div class="info-flex-item-center">
                            <span>{{detailInfo.personalPlanSituation || '-'}}</span>
                        </div>
                    </div>
                    <div class="info-flex-item" v-if="userView != 'STAFF'">
                        <div class="info-flex-item-title">部门计划提交时间</div>
                        <div class="info-flex-item-center">
                            <span>{{detailInfo.deptPlanTime || '-'}}</span>
                        </div>
                    </div>
                    <div class="info-flex-item" v-else></div>
                    <div class="info-flex-item" v-if="userView != 'STAFF'">
                        <div class="info-flex-item-title">部门计划提交情况</div>
                        <div class="info-flex-item-center">
                            <span>{{detailInfo.deptPlanSituation || '-'}}</span>
                        </div>
                    </div>
                    <div class="info-flex-item" v-else></div>
                    <div class="info-flex-item"></div>
                    <div class="info-flex-item"></div>
                    <div class="info-flex-item"></div>
                    <div class="info-flex-item"></div>
                    <div class="info-flex-item"></div>
                    <div class="info-flex-item"></div>
                </div>
            </div>
            <div class="info">
                <div class="info-title">
                    总结提交情况
                    <span>共{{detailInfo.summaryExceptionTimes}}次异常</span>
                </div>
                <div class="info-flex">
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">个人总结提交时间</div>
                        <div class="info-flex-item-center">
                            <span>{{detailInfo.personalSummaryTime || '-'}}</span>
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">个人总结提交情况</div>
                        <div class="info-flex-item-center">
                            <span>{{detailInfo.personalSummarySituation || '-'}}</span>
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">部门总结提交时间</div>
                        <div class="info-flex-item-center">
                            <span>{{detailInfo.deptSummaryTime || '-'}}</span>
                        </div>
                    </div>
                    <div class="info-flex-item">
                        <div class="info-flex-item-title">部门总结提交情况</div>
                        <div class="info-flex-item-center">
                            <span>{{detailInfo.deptSummarySituation || '-'}}</span>
                        </div>
                    </div>
                    <div class="info-flex-item"></div>
                    <div class="info-flex-item"></div>
                    <div class="info-flex-item"></div>
                    <div class="info-flex-item"></div>
                    <div class="info-flex-item"></div>
                    <div class="info-flex-item"></div>
                </div>
            </div>
        </div>
        <div class="idss-list m-b">
            <div class="idss-list-top">
                <div class="idss-list-top-title">考勤日历</div>
            </div>
            <calendar ref="calendar" :stateData="detailInfo.calendar" :examineDate="detailInfo.examineDate" :modelType="0"></calendar>
        </div>
        <!-- 操作记录 -->
        <HandleLogs :id="id" :examineDate="detailInfo.examineDate"></HandleLogs>
        
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
import { getAttendance,confirmAttendanceRecord} from 'service/getData'
import {  ERR_OK } from 'service/config'
import HandleLogs from './components/handleLogs'
import calendar from './components/calendar'

export default {
    components: {
        HandleLogs,
        calendar
    },
    computed: {
        id() {
            return this.$route.query.id
        }
    },
    data () {
        return {
            userView: 'STAFF', // MANAGER   DEPT   STAFF
            editStatus: 0, // 编辑状态
            handleStatus: 4, // 1.仅部门负责人审核,2.仅考勤管理员审核,3.部门部分人和考勤管理员审核            4查看
            detailInfo: {},
            
            countWaringDays: 0, // 异常次数
            countWaringLeave: 0, // 异常次数
            
            
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
            stateArr: [
                {
                    day: '2020-01-13',
                    state: 0
                },
                {
                    day: '2020-01-14',
                    state: 1
                },
                {
                    day: '2020-01-15',
                    state: 2
                },
                {
                    day: '2020-01-16',
                    state: 3
                }
            ]
        }
    },
    created() {
        this.userView = localStorage.getItem("userView");

        this.getBaseData();
    },
    watch: {

    },
    methods: {
        getBaseData() {
            getAttendance({
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
        },
        setBaseData(result) {
            this.detailInfo = result;
            this.handleStatus = result.handleStatus;
            this.countWaringDays = parseFloat(this.detailInfo.laterTimes) 
                                    + parseFloat(this.detailInfo.leaveEarlyTimes)
                                    + parseFloat(this.detailInfo.missCardTimes)
                                    + parseFloat(this.detailInfo.absenteeismDays);
            this.countWaringLeave = parseFloat(this.detailInfo.yearLeave) 
                                    + parseFloat(this.detailInfo.thingLeave)
                                    + parseFloat(this.detailInfo.sickLeave)
                                    + parseFloat(this.detailInfo.breakOff)
                                    + parseFloat(this.detailInfo.maternityLeave)
                                    + parseFloat(this.detailInfo.paternityLeave)
                                    + parseFloat(this.detailInfo.marriageLeave)
                                    + parseFloat(this.detailInfo.exampleLeave)
                                    + parseFloat(this.detailInfo.deathLeave)
                                    + parseFloat(this.detailInfo.lactationLeave);
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
        // 考勤申诉
        submit(submitType) {
            let days = this.$refs.calendar.days;
            let _days = []
            for(let i of days) {
                if (i && i.length > 0) {
                    for (let item of i) {
                        if (item && item.isCur) {
                            // 整理数据
                            _days.push({
                                situation: item.situation,
                                isCur: item.isCur,
                                isOutGoing: item.isOutGoing,
                                outGoingDec: item.outGoingDec,
                                denyReason: item.denyReason,
                                status: item.status,
                            });
                            if (item.outGoingDec) {
                                console.log(item.outGoingDec)
                            }
                        }
                    }
                }
            }
            console.log(_days);
            for(let item of _days) {
                if (item.isOutGoing && !item.outGoingDec) {
                    this.$notify({
                        type: 'warning',
                        title: "提示",
                        message: '考勤日历中有外出未填写说明，请填写后再进行提交。'
                    });
                    return;
                }
            }

            if (submitType == 0) {
                this.$prompt('请输入申诉内容：', '考勤申诉', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputType: 'textarea',
                    inputPattern: /^.{1,400}$/,
                    inputErrorMessage: '请输入（400字符内）'
                }).then(({ value }) => {
                    confirmAttendanceRecord({
                        id: this.id,
                        handleType: 2,
                        handleDec: value,
                        examineDate: this.detailInfo.examineDate,
                        calendar: JSON.stringify(_days)
                    }).then((res) => {
                        if (res.code == ERR_OK) {
                            this.$message({
                                offset: 50,
                                message: '已提交考勤申诉',
                                type: 'success'
                            });
                            this.$router.replace('/performanceManage/attendanceManage');
                            
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
                
            } else {
                this.$confirm('确认考勤后，基本工资将按照上述数据进行计算。是否确认？', '确认考勤', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    confirmAttendanceRecord({
                        id: this.id,
                        handleType: 1,
                        examineDate: this.detailInfo.examineDate,
                        calendar: JSON.stringify(_days)
                    }).then((res) => {
                        if (res.code == ERR_OK) {
                            this.$message({
                                offset: 50,
                                message: '已确认考勤',
                                type: 'success'
                            });
                            this.$router.replace('/performanceManage/attendanceManage');
                            
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
            }
        }

    }
}
</script>

<style scoped lang="scss">
.info {
    font-size: 12px;
    padding: 20px;
    .info-title {
        color: #434343;
        font-weight: bold;
        line-height: 36px;
        span {
            margin-left: 24px;
            color: #878A9A;
        }
    }
    .info-flex {
        border: 1px solid #E0E0E0;
        display: flex;
        .info-flex-item {
            flex: 1;
            padding: 24px;
            .info-flex-item-title {
                text-align: center;
                color: #434343;
                font-weight: bold;
                padding-bottom: 24px;
            }
            .info-flex-item-center {
                color: #434343;
                text-align: center;
            }
        }
    }
}
</style>
