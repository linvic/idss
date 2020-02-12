<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">计划总结管理</span> /
            <span class="child2">全部计划总结</span>
        </div>
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">计划总结列表</div>
            </div>
            <div class="idss-list-filter" v-if="userView != 'STAFF'">
                
                <el-select v-model="filterForm.deptId" filterable clearable placeholder="请选择" size="small">
                    <el-option value="" label="全部部门"></el-option>
                    <el-option
                        v-for="item in deptList"
                        :key="item.deptId"
                        :label="item.deptName"
                        :value="item.deptId">
                    </el-option>
                </el-select>
                <el-date-picker
                    v-model="filterForm.month"
                    value-format="yyyy-MM"
                    type="month"
                    size="small"
                    placeholder="年-月">
                </el-date-picker>
                <el-button size="small" type="primary" plain style="vertical-align: middle;" @click="pageIndexChange(1)">搜索</el-button>
            </div>
            <el-table :data="tableData">
			    <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column label="部门">
                    
                    <template slot-scope="scope">
                        <p>{{scope.row.deptName}}</p>
                        <p v-if="scope.row.planInfoPojo && scope.row.planInfoPojo.submitedUserList && scope.row.planInfoPojo.submitedUserList.length > 0" class="table-link">
                            <ul>
                                <li>员工计划：</li>
                                <li class="li" v-for="item in scope.row.planInfoPojo.submitedUserList" :key="item.planId" @click="linkPlanDetail(item.planId,1)"> {{item.userName}}</li>
                            </ul>
                        </p>
                        <p v-if="scope.row.summaryInfoPojo && scope.row.summaryInfoPojo.submitedUserList && scope.row.summaryInfoPojo.submitedUserList.length > 0" class="table-link">
                            <ul>
                                <li>员工总结：</li>
                                <li class="li" v-for="item in scope.row.summaryInfoPojo.submitedUserList" :key="item.summaryId" @click="linkSummaryDetail(item.summaryId,1)"> {{item.userName}}</li>
                            </ul>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="负责人" prop="deptHeaderName"></el-table-column>
                <el-table-column label="月份" prop="month"></el-table-column>
                <el-table-column label="计划提交情况">
                    <template slot-scope="scope">
                        <span v-if="scope.row.planInfoPojo && scope.row.planInfoPojo.submitCondition">{{scope.row.planInfoPojo.submitCondition}}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column label="总结提交情况">
                    <template slot-scope="scope">
                        <span v-if="scope.row.summaryInfoPojo && scope.row.summaryInfoPojo.submitCondition">{{scope.row.summaryInfoPojo.submitCondition}}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                
                <el-table-column label="部门绩效">
                    <template slot-scope="scope">
                        {{scope.row.deptPerformance || 0}}
                    </template>
                    
                </el-table-column>
                
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            type="primary" plain
                            v-if="scope.row.planInfoPojo && scope.row.planInfoPojo.id"
                            @click="linkPlanDetail(scope.row.planInfoPojo.id,2)">查看计划</el-button>
                        <el-button
                            size="small"
                            type="primary" plain
                            v-if="scope.row.summaryInfoPojo && scope.row.summaryInfoPojo.id"
                            @click="linkSummaryDetail(scope.row.summaryInfoPojo.id,2)">查看总结</el-button>
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
import {  getAllPlanSummaryInfo,getParentDepts} from 'service/getData'
import {  ERR_OK } from 'service/config'
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

            deptList: [],
            userList: [],
            filterForm: {
                deptId: '', //所属部门
                month: '', //时间
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
            this.getDeptLists(); //获取部门列表
            
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
                deptId: this.filterForm.deptId,
                month: this.filterForm.month ? this.filterForm.month : ''
            }
            getAllPlanSummaryInfo(params).then((res) => {
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

        
        linkPlanDetail(id, type) {
            this.$router.push({
                path: "/planSummaryManage/planDetail",
                query: {
                    id: id,
                    type: type
                }
            })
        },
        // 总结详情页面
        linkSummaryDetail(id, type) {
            this.$router.push({
                path: "/planSummaryManage/summaryDetail",
                query: {
                    id: id,
                    type: type
                }
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

.table-link {
    ul {
        display: inline-block;
        vertical-align: middle;
        li {
            float: left;
        }
        .li {
            margin-right: 5px;
            color: #409EFF;
            cursor: pointer;
        }
    }
}
</style>
