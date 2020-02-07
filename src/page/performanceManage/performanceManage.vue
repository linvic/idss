<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">绩效管理</span> /
            <span class="child2">绩效管理</span>
        </div>
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">绩效列表</div>
            </div>
            <div class="idss-list-filter" v-if="userView != 'STAFF'">
                
                <el-select v-model="filterForm.deptId" filterable clearable placeholder="请选择" size="small" @change="deptChange" v-if="userView == 'MANAGER'">
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
                <el-table-column label="月份" prop="examineDate"></el-table-column>
                <el-table-column label="部门" prop="deptName"></el-table-column>
                <el-table-column label="姓名" prop="userName"></el-table-column>
                
                <el-table-column label="绩效得分">
                    <template slot-scope="scope">
                        
                        <div v-if="scope.row.deptScore">
                            <p>个人：{{scope.row.personalScore || 0}}</p>
                            <p>部门：{{scope.row.deptScore || 0}}</p>
                        </div>
                        <span v-else>{{scope.row.personalScore || 0}}</span>
                    </template>
                    
                </el-table-column>
                <el-table-column label="浮动绩效（元）">
                    <template slot-scope="scope">
                        {{scope.row.meritsFloat || 0}}
                    </template>
                </el-table-column>
                <el-table-column label="实发绩效工资（元）">
                    <template slot-scope="scope">
                        {{scope.row.meritsSalary || 0}}
                    </template>
                </el-table-column>
                
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            type="primary" plain
                            v-if="scope.row.summaryId"
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
import {  meritssPage,getParentDepts,listUserDynamic} from 'service/getData'
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
                examineDate: this.filterForm.examineDate
            }
            // params.keyword = this.keyword
            meritssPage(params).then((res) => {
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

        linkDetail(row) {
            // 总结详情页面
            this.$router.push({
                path: "/planSummaryManage/summaryDetail",
                query: {
                    id: row.summaryId,
                    type: 1
                }
            })
        }

    }
}
</script>

<style scoped lang="scss">
</style>
