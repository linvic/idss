<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">绩效管理</span> /
            <span class="child2">工资条管理</span>
        </div>
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">工资条列表</div>
            </div>
            <el-table :data="tableData">
                <el-table-column label="月份" prop="salaryMonth"></el-table-column>
                <template v-if="isSalaryAdmin">
                    <el-table-column label="发放员工数">
                        <template slot-scope="scope">
                            {{scope.row.sendCount || 0}}人
                        </template>
                    </el-table-column>
                    <el-table-column label="查看员工数">
                        <template slot-scope="scope">
                            {{scope.row.lookCount || 0}}人
                        </template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.sendStatus === 0" class="el-color-primary">待发送</span>
                            <span v-else-if="scope.row.sendStatus === 1">已发送</span>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                size="small"
                                type="primary" plain
                                v-if="scope.row.sendStatus === 0"
                                @click="linkEditor(scope.row)">编辑</el-button>
                            <el-button
                                size="small"
                                type="primary" plain
                                v-if="scope.row.sendStatus === 1"
                                @click="linkDetail(scope.row)">查看</el-button>
                            <el-button
                                size="small"
                                type="primary" plain
                                v-if="scope.row.sendStatus === 1"
                                @click="linkExport(scope.row)">导出</el-button>
                         
                        </template>
                    </el-table-column>
                </template>
                <template v-else>
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
                </template>
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
import {  listSalaryCountPage,listSalaryPage,exportSalary} from 'service/getData'
import {  ERR_OK } from 'service/config'
export default {
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
                nowPage: this.pageIndex,
                pageShow: this.pageSize
            }
            if (this.isSalaryAdmin) {
                
                listSalaryCountPage(params).then((res) => {
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

            } else {
                listSalaryPage(params).then((res) => {
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

            }
        },
        linkEditor(row) {
            // 编辑页面
            this.$router.push({
                path: "/performanceManage/paySlipEditor",
                query: {
                    salaryMonth: row.salaryMonth
                }
            })
        },
        linkDetail(row) {
            // 详情页面
            this.$router.push({
                path: "/performanceManage/paySlipDetail",
                query: {
                    salaryMonth: row.salaryMonth
                }
            })
        },
               
        linkExport(row) {
            
            exportSalary({
                salaryMonth: row.salaryMonth,
                token: localStorage.getItem('token')
            }).then((res) => {
                
                let blob = new Blob([res]);
                const fileName = row.salaryMonth + '工资条.xlsx';
                const elink = document.createElement("a");
                elink.download = fileName;
                elink.style.display = "none";
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink);

            })
        },

    }
}
</script>

<style scoped lang="scss">
</style>
