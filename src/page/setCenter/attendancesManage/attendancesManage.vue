<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <router-link to="/setCenter">
                <span class="child1">系统设置</span>
            </router-link> /
            <span class="child2">考勤管理</span>
        </div>
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">考勤扣款金额设置</div>
            </div>
            <div class="idss-set-list">
                <el-row :gutter="180">
                    <el-col :span="8" :lg="7" v-for="(item,index) in baseData" :key="index">
                        <div class="idss-set-item">
                            <div class="idss-set-item__bd">
                                <p>{{item.attendanceName}}：<span>{{[item.chargeType, item.chargeValue, item.attendanceFailCode] | filterCutValue}}</span></p>
                            </div>
                            <div class="idss-set-item__ft">
                                <el-button size="small" @click="setCutValue(item)">设置</el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>

        
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">核对时间设置</div>
            </div>
            <div class="idss-set-list">
                <el-row :gutter="180">
                    <el-col :span="12" :lg="10">
                        <div class="idss-set-item">
                            <div class="idss-set-item__bd">
                                <p>个人总结核对打分时间： 
                                    <span v-if="checkDuration">0 - {{checkDuration}} 小时</span>
                                    <span v-else>未设置</span>
                                </p>
                                <span>发送考勤完成的时间即为第0小时</span>
                            </div>
                            <div class="idss-set-item__ft">
                                <el-button size="small" @click="openDialogChangeCheckTimes">设置</el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        
        
        <el-dialog title="核对时间设置" :visible.sync="dialogChangeCheckTimes" v-if="dialogChangeCheckTimes" width="560px">
            <el-form :model="checkTimes" ref="checkTimes" :rules="changeCheckTimesRules" label-position="top" label-suffix="：" label-width="60px">
                
                <el-form-item label="" prop="checkDuration">
                    0 小时 -
                    <el-input @keyup.native="onkeyupPlusInt($event)" v-model="checkTimes.checkDuration" placeholder="" style="width:100px;" size="small"></el-input> 小时
                </el-form-item>
            </el-form>
            <div slot="footer" class="text-right">
                    <el-button type="primary" @click="changeCheckTimesSubmit">确 定</el-button>
                    <el-button @click="dialogChangeCheckTimes = false">取 消</el-button>
            </div>
        </el-dialog>

        
        <el-dialog title="金额设置" :visible.sync="dialogChangeCutValue" v-if="dialogChangeCutValue" width="560px">
            <el-form :model="changeCutValueForm" ref="changeCutValueForm" :rules="changeCutValueFormRules" label-position="left" label-suffix="：" label-width="160px">
                
                <el-form-item prop="value1">
                    <div slot="label">
                        <el-radio class="radio" v-model="changeCutValueForm.chargeType" :label="1" @change="changeCutType">
                            <el-input  @keyup.native="onkeyupPrice($event)" v-model="changeCutValueForm.chargeValue" placeholder="" style="width:50px;" size="small"></el-input> 元
                            <span v-if="changeCutValueForm.attendanceFailCode == 'LEAVE_ABSENCE'"> / 小时</span>
                        </el-radio>
                    </div>
                </el-form-item>
                <el-form-item prop="" v-if="changeCutValueForm.attendanceFailCode != 'LEAVE_ABSENCE'">
                    <div slot="label">
                        <el-radio class="radio" v-model="changeCutValueForm.chargeType" :label="2" @change="changeCutType">1天基本工资</el-radio>
                    </div>
                </el-form-item>
                <el-form-item prop="" v-if="changeCutValueForm.attendanceFailCode != 'LEAVE_ABSENCE'">
                    <div slot="label">
                        <el-radio class="radio" v-model="changeCutValueForm.chargeType" :label="3" @change="changeCutType">2天基本工资</el-radio>
                    </div>
                </el-form-item>
                <el-form-item prop="" v-if="changeCutValueForm.attendanceFailCode == 'LEAVE_ABSENCE'">
                    <div slot="label">
                        <el-radio class="radio" v-model="changeCutValueForm.chargeType" :label="4" @change="changeCutType">1天基本工资的8分之1
                            <span v-if="changeCutValueForm.attendanceFailCode == 'LEAVE_ABSENCE'"> / 小时</span>
                        </el-radio>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="text-right">
                    <el-button type="primary" @click="changeCutValueSubmit">确 定</el-button>
                    <el-button @click="dialogChangeCutValue = false">取 消</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>
import dayPickNext from '../../../components/date/dayPickNext'
import { getSysAttendances,updateSysAttendances,getSysCheckTimes,updateSysCheckTimes } from 'service/getData'
import {  ERR_OK } from 'service/config'
export default {
    name: "setCenterAttendancesManage",
    components: {
        dayPickNext
    },
    filters: {
		
        // submitLevel,个人
        // submitType,计划
        // level: 档次 0，1，2
        filterCutValue:([chargeType, chargeValue, attendanceFailCode])=> {
            if (chargeType == 2 ) {
                let text = '1天基本工资';
                if (attendanceFailCode == 'LEAVE_ABSENCE') {
                    text += ' / 小时'
                }
                return text;
            } else if (chargeType == 3 ) {
                return '2天基本工资'
            } else if (chargeType == 4 ) {
                let text = '1天基本工资的8分之1';
                if (attendanceFailCode == 'LEAVE_ABSENCE') {
                    text += ' / 小时'
                }
                return text;
            } else if (chargeType == 1 ){
                let text = '-' + chargeValue + '元';
                
                if (attendanceFailCode == 'LEAVE_ABSENCE') {
                    text += ' / 小时'
                }
                return text;
            } else {
                return '未设置'
            }
        },
    },
    data () {
        var validateScale = (rule, value, callback) => {

            var sum = 0;
            if (!!this.changeScaleForm.checked1 && !!this.changeScaleForm.value1) {
                sum += parseInt(this.changeScaleForm.value1);
            }
            if (!!this.changeScaleForm.checked2 && !!this.changeScaleForm.value2) {
                sum += parseInt(this.changeScaleForm.value2);
            }
            if (!!this.changeScaleForm.checked3 && !!this.changeScaleForm.value3) {
                sum += parseInt(this.changeScaleForm.value3);
            }
            if (!!this.changeScaleForm.checked4 && !!this.changeScaleForm.value4) {
                sum += parseInt(this.changeScaleForm.value4);
            }
            if (sum !== 100) {
                callback(new Error('所设置比例和应当为100%'));
            } else {
                callback();
            }
        };
        var validateLaterTime = (rule, value, callback) => {

            if (!this.changeLaterTimeForm.min1 || !this.changeLaterTimeForm.max1) {
                callback(new Error('请输入第一档延迟提交时间'));
            } else {
                callback();
            }
        };
        
        return {
            
            baseData: [],


            // 延迟扣款金额设置
            dialogChangeCutValue: false,
            changeCutValueForm: {},
            changeCutValueFormRules: {
                value: [
                ],
            },


            checkTimes: {},
            checkDuration: '',
            changeCheckTimesRules: {
                checkDuration: [
                    { required: true, message: '请输入' }
                ],
            },
            dialogChangeCheckTimes: false
        }
    },
    created() {
        this.getBaseData();
        this.getSysCheckTimesList();
    },
    watch: {

    },
    methods: {

        getBaseData() {
            let params = {
                nowPage: this.pageIndex,
                pageShow: this.pageSize
            }
            getSysAttendances(params).then((res) => {
                if (res.code == ERR_OK) {
                    this.baseData = res.data;
                } else {
                    this.$notify({
						type: 'warning',
						title: "提示",
                        message: res.msg
                    });
                }
            })
        },
        getSysCheckTimesList() {
            getSysCheckTimes({
                checkType: 2
            }).then((res) => {
                if (res.code == ERR_OK) {
                    if(res.data.length > 0) {
                        this.checkTimes = res.data[0];
                        this.checkDuration = res.data[0].checkDuration;
                    } else {
                        this.checkTimes = {};
                        this.checkDuration = '';
                    }
                    console.log(this.checkTimes);
                } else {
                    this.$notify({
						type: 'warning',
						title: "提示",
                        message: res.msg
                    });
                }
            })
        },
        
        
        setCutValue(item) {
            this.changeCutValueForm = Object.assign({},item);
            if (!this.changeCutValueForm.chargeType) {
                this.changeCutValueForm.chargeType = 1;
            }
            this.dialogChangeCutValue = true;
            
            
        },
        changeCutType() {
            if (this.changeCutValueForm.chargeType != 1) {
                this.changeCutValueForm.chargeValue = '';
            }
        },
        changeCutValueSubmit() {
            if (this.changeCutValueForm.chargeType) {
                if (this.changeCutValueForm.chargeType == 1 && !this.changeCutValueForm.chargeValue) {
                    alert('请输入')
                    return false;
                }
                let _params = {
                    id: this.changeCutValueForm.id,
                    chargeType: this.changeCutValueForm.chargeType
                }
                if (this.changeCutValueForm.chargeType == 1) {
                    _params.chargeValue = this.changeCutValueForm.chargeValue;
                } else {
                    _params.chargeValue = '';
                }
                
                updateSysAttendances(_params).then((res) => {
                    if (res.code == ERR_OK) {
                        this.$notify({
                            type: 'success',
                            title: "提示",
                            message: '设置成功'
                        });
                        this.getBaseData();
                        this.dialogChangeCutValue = false;
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


        openDialogChangeCheckTimes() {
            this.dialogChangeCheckTimes = true;
            this.checkTimes.checkDuration = this.checkDuration;
        },
        changeCheckTimesSubmit() {
            this.$refs.checkTimes.validate(valid => {
                if (valid) {
                    updateSysCheckTimes({
                        checkDuration: this.checkTimes.checkDuration,
                        checkType: 2,
                        id: this.checkTimes.id,
                    }).then((res) => {
                        if (res.code == ERR_OK) {
                            this.$notify({
                                type: 'success',
                                title: "提示",
                                message: '设置成功'
                            });
                            this.getSysCheckTimesList();
                            this.dialogChangeCheckTimes = false;
                        } else {
                            this.$notify({
                                type: 'warning',
                                title: "提示",
                                message: res.msg
                            });
                        }
                    })
                }
            })

            
        }
        
    }
}
</script>

<style scoped lang="scss">
.idss-list {
    margin-bottom: 20px;
}
.idss-set-list {
    padding: 15px 30px;
    overflow: hidden;
    + .idss-set-list {
        border-top: 1px solid #eee;
    }
    
}
.idss-set-item {
    display: flex;
    padding: 15px 0px;
    .idss-set-item__bd {
        flex: 1;
        p {
            font-size: 14px;
            color: #333;
            line-height: 30px;
            span {
                color: #999999;
            }
        }
        span {
            font-size: 12px;
            color: #999999;
        }
    }
}
.idss-checkbox-group {
    display: inline-block;
    .el-checkbox /deep/ {
        margin-right: 15px;
        & + .el-checkbox {
            margin-left: 0;
        }
        .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: red;
            border-color: red;
        }
        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: red;
            border-color: red;
        }
        .el-checkbox__inner:hover {
            border-color: red;
        }
    }
}
</style>
