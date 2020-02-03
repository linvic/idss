<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">绩效管理</span> /
            <router-link to="/performanceManage/attendanceManage">
                <span class="child1">考勤管理</span>
            </router-link> /
            <span class="child2">添加考勤</span>
        </div>
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">添加考勤 <span class="tip" v-if="!!currMonth">{{currMonth}}</span></div>
                <div class="idss-list-top-btn-groups">
                    <el-button size="small" type="primary" plain @click="listUpdate">{{tableData.length > 0 ? '重新上传' : '上传考勤'}}</el-button>
                    <el-button size="small" type="primary" @click="submit" v-if="tableData.length > 0">发送考勤</el-button>
                </div>
            </div>
            <el-table :data="tableData">
			    <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column label="部门" prop="deptName"></el-table-column>
                <el-table-column label="姓名" prop="userName"></el-table-column>
                <el-table-column label="迟到">
                    <template slot-scope="scope">
                        {{scope.row.laterTimes || 0}}次
                    </template>
                </el-table-column>
                <el-table-column label="早退">
                    <template slot-scope="scope">
                        {{scope.row.leaveEarlyTimes || 0}}次
                    </template>
                </el-table-column>
                <el-table-column label="缺卡">
                    <template slot-scope="scope">
                        {{scope.row.missCardTimes || 0}}次
                    </template>
                </el-table-column>
                <el-table-column label="旷工">
                    <template slot-scope="scope">
                        {{scope.row.absenteeismDays || 0}}天
                    </template>
                </el-table-column>
                <el-table-column label="事假">
                    <template slot-scope="scope">
                        {{scope.row.thingLeave || 0}}小时
                    </template>
                </el-table-column>
                <el-table-column label="异常外出">
                    <template slot-scope="scope">
                        {{scope.row.outgoingExceptionTimes || 0}}次
                    </template>
                </el-table-column>
                <el-table-column label="其它扣款">
                    <template slot-scope="scope">
                        <span v-if="scope.row.otherCut">
                            扣{{scope.row.otherCut || 0}}元：{{scope.row.otherCutReason}}
                        </span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        
                        <el-button
                            size="small"
                            type="primary" plain
                            @click="linkEdit(scope.row)">{{scope.row.otherCut ? '编辑扣款' : '添加扣款'}}</el-button>
                    </template>

                </el-table-column>
            </el-table>
            <div class="idss-list-pagination" v-show="dataTotal > 0">
                <el-pagination
                    v-if="dataTotal > 0"
                    background
                    @size-change="pageSizeChange"
                    @current-change="pageIndexChange"
                    :current-page="pageIndex"
                    :page-sizes="[10, 15, 50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="dataTotal">
                </el-pagination>
            </div>
            
        </div>

        <el-dialog title="上传考勤" :visible.sync="dialogUpdateForm" width="400px" top="10%">
            <el-form :model="updateForm" ref="updateForm" :rules="updateFormRules" label-position="left" label-suffix="：">
                <el-form-item label="考勤月份" prop="examineDate">
                    <el-date-picker
                        v-model="updateForm.examineDate"
                        value-format="yyyy-MM"
                        type="month"
                        size="small"
                        placeholder="年-月">
                    </el-date-picker>
                </el-form-item>
                
            </el-form>
            <div slot="footer" class="text-right">
                <el-button size="small" @click="dialogUpdateForm = false">取 消</el-button>
                <el-button type="primary" size="small" @click.stop="importUpdate">
                    上传考勤
                    <input ref="excel-upload-input" type="file" accept=".xlsx, .xls, .csv" @change="importFiles" style='display:none'>
                </el-button>
            </div>
        </el-dialog>

        <el-dialog :title="cutFormTitle" :visible.sync="dialogCutForm" width="500px" top="10%">
            <el-form :model="cutForm" ref="cutForm" :rules="cutFormRules" label-position="left" label-suffix="：" label-width="100px">
                <el-form-item label="扣款金额" prop="otherCut">
                    <el-input  @keyup.native="onkeyupPrice($event)" v-model="cutForm.otherCut" placeholder="请输入扣款金额" size="small">
                        <span slot="append">元</span>
                    </el-input>
                </el-form-item>
                <el-form-item label="扣款原因" prop="otherCutReason">
                    <el-input  type="textarea" v-model="cutForm.otherCutReason" placeholder="请输入扣款原因" size="small">
                        <span slot="append">元</span>
                    </el-input>
                </el-form-item>
                
            </el-form>
            <div slot="footer" class="text-right">
                <el-button type="primary" size="small" plain @click="cutFormDel">删 除</el-button>
                <el-button size="small" @click="dialogCutForm = false">取 消</el-button>
                <el-button type="primary" size="small" @click.stop="cutFormSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {  attendanceRecordsPage,getParentDepts,getUserList,uploadAttendance,sendAttendance,updateAttendance,deleteAttendanceCut} from 'service/getData'
import {  ERR_OK } from 'service/config'
import moment from 'moment'
export default {
    data () {
        return {
            userId: '',
            deptLevel: '',
            userView: 'STAFF', // MANAGER   DEPT   STAFF

            
            pageIndex: 1, // 当前页码
            pageSize: 10, // 页码大小
            dataTotal: 0, // 数据总数
            tableData: [],

            
            dialogUpdateForm: false,
            updateForm: {
                examineDate: moment().subtract(1, 'month').format('YYYY-MM'),
                file: ''
            },
            updateFormRules: {
                examineDate: [
                    { required: true, message: '请先选择考勤月份' }
                ],
            },
            currMonth: '', // 显示月份

            
            dialogCutForm: false,
            cutFormTitle: '添加扣款',
            cutForm: {
                id: '',
                otherCut: '',
                otherCutReason: '',
            },
            cutFormRules: {
                otherCut: [
                    { required: true, message: '请先输入扣款金额' }
                ],
                otherCutReason: [
                    { required: true, message: '请先输入扣款原因' }
                ],
            },
            
        }
    },
    created() {
        this.userId = localStorage.getItem("userId");
        this.deptLevel = localStorage.getItem("deptLevel");
        this.userView = localStorage.getItem("userView");

        this.pageInit();
    },
    watch: {

    },
    methods: {
        
        pageInit() {
            
            this.getDataList();
        },
        pageSizeChange(val) {
            // 分页：pageSize改变时
            this.pageSize = val;
            this.getDataList();
        },
        pageIndexChange(val) {
            // 分页：当前页码改变时
            this.pageIndex = val;
            this.getDataList();
        },
        getDataList() {
            let params = {
                nowPage: this.pageIndex,
                pageShow: this.pageSize,
                sendStatus: 0
            }
            // params.keyword = this.keyword
            attendanceRecordsPage(params).then((res) => {
                if (res.code == ERR_OK) {
                    this.tableData = res.data.result;
                    this.dataTotal = res.data.totalCount;
                    if (this.tableData.length > 0) {
                        this.currMonth = this.tableData[0].examineDate
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

        listUpdate() { // 上传考勤
            this.dialogUpdateForm = true;
        },
        importUpdate() {
            this.$refs['excel-upload-input'].click();
        },
        importFiles(e) {
            this.$refs.updateForm.validate(valid => {
                if (valid) {
                    var files = e.target.files;
                    const itemFile = files[0];
                    const formdata = new FormData();
                    formdata.append('token',localStorage.getItem('token'));
                    formdata.append('file',itemFile);
                    formdata.append('examineDate',this.updateForm.examineDate);
                    e.target.value = '';
                    // 导入设备
                    uploadAttendance(formdata).then((result) => {
                        if (result.code == ERR_OK) {
                            this.dialogUpdateForm = false;
                            this.pageIndexChange(1);
                        } else {
                            this.$notify({
                                type: 'warning',
                                title: "提示",
                                message: result.msg
                            });
                        }
                    })
                } else {
                    e.target.value = '';
                }
            })
        },
        submit() {
            
            this.$confirm('每个月的考勤记录只能发送一次，是否继续发送？', '发送考勤确认', {
                confirmButtonText: '继续发送',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                sendAttendance({
                    examineDate: this.currMonth
                }).then((result) => {
                    if (result.code == ERR_OK) {
                        this.$notify({
                            type: 'success',
                            title: "成功",
                            message: '考勤发送成功'
                        });
                        this.$router.push({ path: "/performanceManage/attendanceManage" })
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: "提示",
                            message: result.msg
                        });
                    }
                })
            }).catch(() => {       
            });
            
        },
        
        linkEdit(row) {
            this.cutForm.id = row.id;
            this.cutForm.otherCut = row.otherCut;
            this.cutForm.otherCutReason = row.otherCutReason;
            if (!!row.otherCut) {
                this.cutFormTitle = '添加扣款';
            } else {
                this.cutFormTitle = '编辑扣款';
            }
            this.dialogCutForm = true;
        },
        cutFormSubmit() {
            this.$refs.cutForm.validate(valid => {
                if (valid) {
                    updateAttendance({
                        id: this.cutForm.id,
                        otherCut: this.cutForm.otherCut,
                        otherCutReason: this.cutForm.otherCutReason,
                    }).then((result) => {
                        if (result.code == ERR_OK) {
                            this.$refs.cutForm.resetFields();
                            this.dialogCutForm = false;
                            this.getDataList();
                        } else {
                            this.$notify({
                                type: 'warning',
                                title: "提示",
                                message: result.msg
                            });
                        }
                    })
                }
            })
        },
        cutFormDel() {
            
            this.$confirm('其它扣款删除后将不在保留数据，是否继续删除？', '删除其它扣款确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteAttendanceCut({
                    id: this.cutForm.id,
                }).then((result) => {
                    if (result.code == ERR_OK) {
                        this.$notify({
                            type: 'success',
                            title: "成功",
                            message: '删除成功'
                        });
                        this.$refs.cutForm.resetFields();
                        this.dialogCutForm = false;
                        this.getDataList();
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: "提示",
                            message: result.msg
                        });
                    }
                })
            }).catch(() => {       
            });
        }

    }
}
</script>

<style scoped lang="scss">
</style>
