<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <router-link to="/setCenter">
                <span class="child1">系统设置</span>
            </router-link> /
            <span class="child2">考核组管理</span>
        </div>

        <div class="idss-list" v-for="(item,index) in baseData" :key="index">
            <div class="idss-list-top">
                <div class="idss-list-top-title" v-if="item.categary == 1">行研管理</div>
                <div class="idss-list-top-title" v-if="item.categary == 2">投后管理</div>
            </div>
            <div class="idss-set-list">
                
                <ul class="card-list">
                    <li v-for="jtem in item.pojoList">
                        <div class="card-list-top">
                            <div class="card-list-top-left ellipsis" style='width:220px;'>{{jtem.name}}</div>
                            <div class="card-list-top-right text-right">
                                <i class="el-icon-edit" style="margin-right: 20px"  @click="listEdit(jtem)"></i>
                            </div>
                        </div>
                        <!-- <router-link :to="{ path: 'departmentDetail',query: {id:item.deptId}}"> -->
                        <div class="card-list-content">
                            <div class="card-list-content-item">
                                <div class="card-list-content-item-label">考核时间：</div>
                                <p class="card-list-content-item-value">{{jtem.examineTime || '-'}}</p>
                            </div>
                            <div class="card-list-content-item">
                                <div class="card-list-content-item-label">重复月份：</div>
                                <p class="card-list-content-item-value">{{jtem.examineRepeatMonth ? jtem.examineRepeatMonth + '月' : '-'}}</p>
                            </div>
                            <div class="card-list-content-item">
                                <div class="card-list-content-item-label">考核成员：</div>
                                <p class="card-list-content-item-value">{{jtem.userNames || '-'}}</p>
                            </div>
                        </div>
                        <!-- </router-link> -->
                    </li>
                </ul>
            </div>
        </div>
        
        <el-dialog title="提交时间设置" :visible.sync="dialogEdit" v-if="dialogEdit" size="tiny">
            <el-form :model="handleForm" ref="handleForm" :rules="handleFormRules" label-position="top" label-suffix="：" label-width="60px">
                <el-form-item label="绩效组名称" prop="name">
                    <el-input v-model="handleForm.name" placeholder="请输入绩效组名称" size="small"></el-input>
                </el-form-item>
                <el-form-item label="绩效单位" prop="unit">
                    <el-input v-model="handleForm.unit" placeholder="请输入绩效单位" size="small"></el-input>
                </el-form-item>
                
                <el-form-item label="考核时间" prop="examineTime">
                    当月
                    <el-input v-model="handleForm.examineDay" style="width: 50px" placeholder="" size="small"></el-input>
                    日
                    <el-time-picker
                        size="small"
                        v-model="handleForm.examineMinutes"
                        format= 'HH:mm'
                        value-format="HH:mm"
                        style="width:100px"
                        placeholder="">
                    </el-time-picker>
                    

                </el-form-item>
                <el-form-item label="重复月份" prop="months">
                    <div class="idss-checkbox-group">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <el-checkbox-group v-model="months" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="month in 12" :label="month" :key="month">{{month}}月</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-form-item>
                <el-form-item label="考核成员" prop="checkUserIds">
                    <el-select v-model="checkUserIds" style="width: 100%" multiple placeholder="请选择">
                        <el-option
                            v-for="item in users"
                            :key="item.userId"
                            :label="item.userName"
                            :value="item.userId + ''">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="text-right">
                    <el-button type="primary" @click="changeSubmit">确 定</el-button>
                    <el-button @click="dialogEdit = false">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        
        
    </div>
</template>

<script>
import dayPickNext from '../../../components/date/dayPickNext'
import { getSysExamineGroups,updateSysExamineGroups,getSysAllUsers } from 'service/getData'
import {  ERR_OK } from 'service/config'
export default {
    name: "setCenterExamineGroupsManage",
    components: {
        dayPickNext
    },
    filters: {
    },
    data () {
        var validateExamineTime = (rule, value, callback) => {
            if (!this.handleForm.examineDay || !this.handleForm.examineMinutes) {
                callback(new Error('请填写完整考核时间'));
            } else {
                callback();
            }
        };
        var validateMonths = (rule, value, callback) => {
            if (!this.months  || this.months.length === 0) {
                callback(new Error('请选择'));
            } else {
                callback();
            }
        };
        
        var validateCheckUserIds = (rule, value, callback) => {
            if (!this.checkUserIds  || this.checkUserIds.length === 0) {
                callback(new Error('请选择'));
            } else {
                callback();
            }
        };
        return {
            
            baseData: [],
            
            handleForm: {},
            dialogEdit: false,
            checkAll: true,
            isIndeterminate: true,
            months:[],
            handleFormRules: {
                
                name: [
                    { required: true, message: '请输入', trigger: 'blue' }
                ],
                unit: [
                    { required: true, message: '请输入', trigger: 'blue' }
                ],
                examineTime: [
                    { required: true,validator: validateExamineTime, trigger: 'blue' }
                ],
                months: [
                    { required: true, validator: validateMonths, trigger: 'blue' }
                ],
                checkUserIds: [
                    { required: true, validator: validateCheckUserIds, trigger: 'blue' }
                ],
            },
            checkUserIds: [],
            users: []
            
        }
    },
    created() {
        this.getBaseData();
    },
    watch: {

    },
    methods: {
        // 全选
        handleCheckAllChange(event) {
            this.months = event.target.checked ? [1,2,3,4,5,6,7,8,9,10,11,12] : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === 12;
            this.isIndeterminate = checkedCount > 0 && checkedCount < 12;
        },

        getBaseData() {
            let params = {
                nowPage: this.pageIndex,
                pageShow: this.pageSize
            }
            getSysExamineGroups(params).then((res) => {
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
        getSysAllUsersList() {
            getSysAllUsers({}).then((res) => {
                if (res.code == ERR_OK) {
                    this.users = res.data;
                } else {
                    this.$notify({
						type: 'warning',
						title: "提示",
                        message: res.msg
                    });
                }
            })
        },
        
        listEdit(obj) {
            let item = Object.assign({},obj);
            if (!this.users || this.users.length === 0) {
                this.getSysAllUsersList();
            }


            if(item.examineTime && item.examineTime.length > 2 && item.examineTime.split('-').length === 2) {
                item.examineDay = item.examineTime.split('-')[0];
                
                let _examineMinutes = item.examineTime.split('-')[1];
                var myDate = new Date();
                var year = myDate.getFullYear();
                var month = myDate.getMonth() + 1;
                var date = myDate.getDate();
                item.examineMinutes = new Date(year, month, date, _examineMinutes.split(':')[0],  _examineMinutes.split(':')[1])
                
            } else {
                item.examineDay = '';
                item.examineMinutes = '';
            }
            if (item.examineRepeatMonth) {
                this.months = item.examineRepeatMonth.split(',').map(Number);
            } else {
                this.months = [];
            }
            this.checkUserIds = item.userIds ? item.userIds.split(',') : [];


            this.checkAll = true;
            this.isIndeterminate = true;
            this.handleForm = item;
            this.dialogEdit = true;
                
        },
        
        changeSubmit() {
            this.$refs.handleForm.validate(valid => {
                if (valid) {

                    let _examineMinutes = this.handleForm.examineMinutes.toString().split(' ')[4];
                    let examineTime = this.handleForm.examineDay + '-' +_examineMinutes.split(':')[0] + ':' + _examineMinutes.split(':')[1];
                    let params = {
                        id: this.handleForm.id,
                        categary: this.handleForm.categary,
                        name: this.handleForm.name,
                        unit: this.handleForm.unit,

                        examineTime: examineTime,
                        examineRepeatMonth: this.months.join(','),
                        userIdList: this.checkUserIds,
                        
                    }
                    updateSysExamineGroups(params).then((res) => {
                        if (res.code == ERR_OK) {
                            this.$notify({
                                type: 'success',
                                title: "提示",
                                message: '设置成功'
                            });
                            this.getBaseData();
                            this.dialogEdit = false;
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
        },
        
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

.card-list li{
    float: left;
    width: 370px;
    margin-bottom: 20px;
    cursor: pointer;
    background: #FFFFFF;
    box-sizing: border-box;
    border: 1px solid #E6EAF2;
    margin-left: 40px;
    &:hover{
        border: 1px solid rgba(217,52,55,0.50);
    }
    
    .card-list-top {
        height: 42px;
        line-height:42px;
        background: rgba(217,52,55,0.02);
        border-bottom:1px solid rgba(0,0,0,0.12);
        .card-list-top-left{
            float: left;
            font-size: 16px;
            width: 260px;
            color: #333333;
            padding-left: 15px;
        }
        .card-list-top-right{
            float: right;
            font-size: 15px;
            color: #7F7F7F;
            width: 85px;
            padding-right: 20px;
            i:hover{
                color: #0095FF;
            }
        }

    }
    .card-list-content {
        .card-list-content-item {
            font-size: 14px;
            clear: both;
            margin: 15px auto;
            .card-list-content-item-label {
                text-align: right;
                color: #333;
                float: left;
                width: 80px;
            }
            .card-list-content-item-value {
                margin-left: 90px;
                margin-right: 10px;
                color: #666;
            }
        }
    }
    
}

</style>
