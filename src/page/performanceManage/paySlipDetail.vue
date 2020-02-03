<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">绩效管理</span> /
            <span class="child2">工资条管理</span>
        </div>
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">工资条详情
                    <span class="tip">{{salaryMonth}}</span>
                </div>
            </div>
            <el-table :data="tableData">
                <el-table-column label="部门" prop="deptName"></el-table-column>
                <el-table-column label="姓名" prop="userName"></el-table-column>
                
                <el-table-column label="基本工资">
                    <template slot-scope="scope">
                        {{scope.row.basicSalary || 0}}
                    </template>
                </el-table-column>
                <el-table-column label="基本工资扣款">
                    <template slot-scope="scope">
                        {{scope.row.basicSalaryCut || 0}}
                    </template>
                </el-table-column>
                <el-table-column label="绩效工资">
                    <template slot-scope="scope">
                        {{scope.row.meritsSalary || 0}}
                    </template>
                </el-table-column>
                <el-table-column label="绩效浮动">
                    <template slot-scope="scope">
                        {{scope.row.meritsFloat || 0}}
                    </template>
                </el-table-column>
                <el-table-column label="原始工资">
                    <template slot-scope="scope">
                        {{scope.row.originalSalary || 0}}
                    </template>
                </el-table-column>
                <el-table-column label="实发工资">
                    <template slot-scope="scope">
                        {{scope.row.realSalary || 0}}
                    </template>
                </el-table-column>
                <el-table-column label="考勤确认状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.attendanceStatus === 0" class="el-color-primary">待确认</span>
                        <span v-else-if="scope.row.attendanceStatus === 1" class="el-color-primary">待审核</span>
                        <span v-else-if="scope.row.attendanceStatus === 2">已确认</span>
                        <span v-else>-</span>
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
import {  listSalaryDetailPage} from 'service/getData'
import {  ERR_OK } from 'service/config'
export default {
    
    computed: {
        salaryMonth() {
            return this.$route.query.salaryMonth
        }
    },
    data () {
        return {
            userId: '',
            deptLevel: '',
            userView: 'STAFF', // MANAGER   DEPT   STAFF
            isSalaryAdmin: false, // 是否工资条管理员

            
            pageIndex: 1, // 当前页码
            pageSize: 10, // 页码大小
            dataTotal: 0, // 数据总数
            tableData: [],

            
        }
    },
    created() {
        this.userId = localStorage.getItem("userId");
        this.deptLevel = localStorage.getItem("deptLevel");
        this.userView = localStorage.getItem("userView");
        this.isSalaryAdmin = localStorage.getItem("isSalaryAdmin") == 'true' ? true : false;

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
                salaryMonth: this.salaryMonth,
                nowPage: this.pageIndex,
                pageShow: this.pageSize
            }
            listSalaryDetailPage(params).then((res) => {
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

    }
}
</script>

<style scoped lang="scss">
</style>
