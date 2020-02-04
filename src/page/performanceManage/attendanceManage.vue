<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">绩效管理</span> /
            <span class="child2">考勤管理</span>
        </div>
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">考勤列表</div>
                <div class="idss-list-top-btn-groups">
                    <el-button size="small" type="primary" @click="linkAdd" v-if="isAttendanceAdmin">添加考勤</el-button>
                </div>
            </div>
            <div class="idss-list-filter" v-if="userView != 'STAFF'">
                
                <el-select v-model="filterForm.deptId" filterable clearable placeholder="请选择" size="small" @change="deptChange" v-if="isAttendanceAdmin || userView == 'MANAGER'">
                    <el-option value="" label="全部部门"></el-option>
                    <el-option
                        v-for="item in deptList"
                        :key="item.deptId"
                        :label="item.deptName"
                        :value="item.deptTreeIds">
                    </el-option>
                </el-select>
                <el-select v-model="filterForm.userId" filterable clearable placeholder="请选择" size="small">
                    <el-option value="" label="全部员工"></el-option>
                    <el-option
                        v-for="item in userList"
                        :key="item.userId"
                        :label="item.userName"
                        :value="item.userId">
                    </el-option>
                </el-select>
                <el-date-picker
                    v-model="filterForm.examineDate"
                    value-format="yyyy-MM"
                    type="month"
                    size="small"
                    placeholder="年-月">
                </el-date-picker>
                <el-button size="small" type="primary" plain style="vertical-align: middle;" @click="pageIndexChange(1)">搜索</el-button>
            </div>
            <el-table :data="tableData">
			    <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column label="考核时间" prop="examineDate"></el-table-column>
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
                <el-table-column label="其它异常扣款">
                    <template slot-scope="scope">
                        {{scope.row.otherCut || 0}}元
                    </template>
                    
                </el-table-column>
                <el-table-column label="合计">
                    <template slot-scope="scope">
                        {{scope.row.total || 0}}元
                    </template>
                    
                </el-table-column>
                <el-table-column label="实发基本工资">
                    <template slot-scope="scope">
                        {{scope.row.basicSalary || 0}}元
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.examineStatus === 0" class="el-color-primary">待确认</span>
                        <span v-else-if="scope.row.examineStatus === 1" class="el-color-primary">待审核</span>
                        <span v-else-if="scope.row.examineStatus === 2">已确认</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                        
                            size="small"
                            type="primary" plain
                            v-if="scope.row.handleStatus === 0"
                            @click="linkCheck(scope.row)">核对考勤</el-button>
                        <el-button
                            size="small"
                            type="primary" plain
                            v-else-if="scope.row.handleStatus === 1 || scope.row.handleStatus === 2 || scope.row.handleStatus === 3"
                            @click="linkAudit(scope.row)">审核</el-button>
                        <el-button
                            size="small"
                            type="primary" plain
                            v-else
                            @click="linkDetail(scope.row)">查看</el-button>
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
    </div>
</template>

<script>
import {  attendanceRecordsPage,getParentDepts,listUserDynamic} from 'service/getData'
import {  ERR_OK } from 'service/config'
export default {
    data () {
        return {
            userId: '',
            deptLevel: '',
            userView: 'STAFF', // MANAGER   DEPT   STAFF
            isAttendanceAdmin: false, // MANAGER   DEPT   STAFF

            
            pageIndex: 1, // 当前页码
            pageSize: 10, // 页码大小
            dataTotal: 0, // 数据总数
            tableData: [],

            deptList: [],
            userList: [],
            filterForm: {
                deptId: '', //所属部门
                userId: '', //员工
                examineDate: '', //时间
            },
            
        }
    },
    created() {
        this.userId = localStorage.getItem("userId");
        this.deptLevel = localStorage.getItem("deptLevel");
        this.userView = localStorage.getItem("userView");
        this.isAttendanceAdmin = localStorage.getItem("isAttendanceAdmin") == 'true' ? true : false;
        

        this.pageInit();
    },
    watch: {

    },
    methods: {
        
        pageInit() {
            this.getDeptLists(); //获取部门列表 
            this.getUserLists(); //获取用户列表 
            
            this.getDataList();
        },
        getDeptLists() {
            
            getParentDepts().then((res) => {
                if(res.code == ERR_OK) {
                    this.deptList = res.data
                } else {
                    this.$notify.error({
                        title: '失败',
                        message:res.msg
                    });
                }
            })
        },
        deptChange() {
            this.filterForm.userId = '';
            this.userList = [];
            this.getUserLists();
        },
        getUserLists() {
            listUserDynamic({deptId: this.filterForm.deptId}).then((res) => {
                if(res.code == ERR_OK) {
                    this.userList = res.data
                } else {
                    this.$notify.error({
                        title: '失败',
                        message:res.msg
                    });
                }
            })
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
                deptTreeIds: this.filterForm.deptId,
                userId: this.filterForm.userId,
                examineDate: this.filterForm.examineDate,
                sendStatus: 1
            }
            // params.keyword = this.keyword
            attendanceRecordsPage(params).then((res) => {
                if (res.code == ERR_OK) {
                    this.tableData = res.data.result;
                    this.dataTotal = res.data.totalCount;
                } else {
                    this.$notify({
                        type: 'warning',
                        title: "提示",
                        message: res.msg
                    });
                }
            })
        },

        linkAdd() { // 添加
            this.$router.push({
                path: "/performanceManage/attendanceAdd"
            })
        },
        // 计划详情页面
        linkDetail(row) {
            this.$router.push({
                path: "/performanceManage/attendanceDetail",
                query: { id: row.id }
            })
        },
        linkAudit(row) {
            // 审核个人计划
            this.$router.push({
                path: "/performanceManage/attendanceAudit",
                query: { id: row.id}
            })
        },
        linkCheck(row) {
            // 审核个人计划
            this.$router.push({
                path: "/performanceManage/attendanceCheck",
                query: { id: row.id }
            })
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
        }

    }
}
</script>

<style scoped lang="scss">
</style>
