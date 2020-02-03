<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">计划总结管理</span> /
            <span class="child2">总结管理</span>
        </div>
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">总结管理<span class="tip">{{timeTips}}</span></div>
                <div class="idss-list-top-btn-groups">
                    <el-button size="small" type="primary" @click="linkSummaryStaff" v-if="pageType == 2">个人总结列表</el-button>
                    
                    <el-button size="small" type="primary" :disabled="!isCanAddDept" v-if="userView != 'MANAGER' && pageType == 2" @click="linkSummaryDeptAdd">发起部门总结</el-button>
                    <el-button size="small" type="primary" :disabled="!isCanAddPersonal" v-if="userView != 'MANAGER'" @click="linkSummaryAdd">{{pageType == 2 ? '发起个人总结' : '发起总结'}}</el-button>
                </div>
            </div>
            <div class="idss-list-filter" v-if="pageType == 1">
                <el-input size="small" style="width:200px;margin-right:10px;vertical-align: middle;" v-model="keyword" placeholder="请输入关键字搜索"></el-input>
                <el-button size="small" type="primary" plain style="vertical-align: middle;" @click="pageIndexChange(1)">搜索</el-button>
            </div>

            <!-- @tab-click="handleClick" -->
            <div class="idss-list-tabs" v-if="pageType == 2">
                <el-tabs v-model="isAllDeptList" type="card" @tab-click="pageIndexChange(1)">
                    <el-tab-pane :label="'待处理('+ pendingTotal +')'" name="0"></el-tab-pane>
                    <el-tab-pane label="全部个人总结" name="1" v-if="userView == 'DEPT'"></el-tab-pane>
                    <el-tab-pane label="全部部门总结" name="2"></el-tab-pane>
                </el-tabs>
            </div>
            <el-table :data="tableData" :key="tableKey">
			    <el-table-column type="index" label="序号" width="80"></el-table-column>


                <template v-if="pageType == 1">

                    <el-table-column label="标题" prop="title"></el-table-column>
                    <el-table-column label="提交时间" prop="submitTime"></el-table-column>
                    <el-table-column label="任务数量" prop="taskCount"></el-table-column>
                </template>
                <template v-if="pageType == 2 ">
                    
                    <template v-if="isAllDeptList == 0 && userView == 'DEPT'">
                        <el-table-column label="部门" prop="deptName"></el-table-column>
                        <el-table-column label="姓名" prop="userName"></el-table-column>
                        <el-table-column label="类型" prop="summaryTypeName"></el-table-column>
                        <el-table-column label="提交时间" prop="submitTime"></el-table-column>
                    </template>
                    <template v-if="isAllDeptList == 0 && userView == 'MANAGER'">
                        <el-table-column label="标题" prop="title"></el-table-column>
                        <el-table-column label="负责人" prop="deptHeaderName"></el-table-column>
                        <el-table-column label="提交情况" prop="submitCondition"></el-table-column>
                        <el-table-column label="提交时间" prop="submitTime"></el-table-column>
                    </template>
                    <template v-if="isAllDeptList == 1 && userView == 'DEPT'">
                        <el-table-column label="部门" prop="deptName"></el-table-column>
                        <el-table-column label="姓名" prop="userName"></el-table-column>
                        <el-table-column label="提交时间" prop="submitTime"></el-table-column>
                    </template>
                    <template v-if="isAllDeptList == 2 && userView == 'DEPT'">
                        <el-table-column label="标题">
                            <template slot-scope="scope">
                                <p>{{scope.row.title}}</p>
                                <p v-if="scope.row.submitedUserList && scope.row.submitedUserList.length > 0" class="table-link">
                                    <ul>
                                        <li>员工计划：</li>
                                        <li class="li" v-for="item in scope.row.submitedUserList" :key="item.summaryId" @click="linkDetail(item.summaryId,1)"> {{item.userName}}</li>
                                    </ul>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column label="提交情况" prop="submitCondition"></el-table-column>
                        <el-table-column label="提交时间" prop="submitTime"></el-table-column>
                    </template>
                    <template v-if="isAllDeptList == 2 && userView == 'MANAGER'">
                        <el-table-column label="标题">
                            <template slot-scope="scope">
                                <p>{{scope.row.title}}</p>
                                <p v-if="scope.row.submitedUserList && scope.row.submitedUserList.length > 0" class="table-link">
                                    <ul>
                                        <li>员工计划：</li>
                                        <li class="li" v-for="item in scope.row.submitedUserList" :key="item.summaryId" @click="linkDetail(item.summaryId,1)"> {{item.userName}}</li>
                                    </ul>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column label="负责人" prop="deptHeaderName"></el-table-column>
                        <el-table-column label="提交情况" prop="submitCondition"></el-table-column>
                        <el-table-column label="提交时间" prop="submitTime"></el-table-column>
                    </template>

                </template>



                <el-table-column label="总结状态">
                    <template slot-scope="scope">
                        <span :class="{'el-color-primary': scope.row.summaryStatus !== 'COMPLETION'}">{{scope.row.summaryStatusName || ''}}</span>
                    </template>
                </el-table-column>
                
                <el-table-column label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            type="primary" plain
                            @click="linkDetail(scope.row.id,scope.row.summaryType)">查看</el-button>
                        <el-button
                            size="small"
                            type="primary" plain
                            v-if="userId ==scope.row.userId && (scope.row.summaryStatus === 'TOSUBMIT' || scope.row.summaryStatus === 'TOAPPROVE') "
                            @click="linkEdit(scope.row.id,scope.row.summaryType)">编辑</el-button>
                        <el-button
                            size="small"
                            type="primary" plain
                            v-if="(scope.row.summaryType == 1) && (userId ==scope.row.userId) && (scope.row.summaryStatus === 'CONFIRMSCORE') "
                            @click="linkDetail(scope.row.id,scope.row.summaryType)">核对打分</el-button>

                            
                        <el-button
                            size="small"
                            type="primary" plain
                            v-if="isAllDeptList != 2 && validateLevel(scope.row.approveLevel) && (userView != 'STAFF') && (scope.row.summaryStatus === 'APPEALING') "
                            @click="linkHandle(scope.row)">处理申诉</el-button>
                        <el-button
                            size="small"
                            type="primary" plain
                            v-if="isAllDeptList == 2 && scope.row.appealingSummaryId"
                            @click="linkHandle(scope.row)">处理申诉</el-button>
                            
                        <el-button
                            size="small"
                            type="primary" plain
                            v-if="isAllDeptList != 2 && validateLevel(scope.row.approveLevel) && (userView != 'STAFF') && (scope.row.summaryStatus === 'TOAPPROVE' || scope.row.summaryStatus === 'APPROVING' || scope.row.summaryStatus === 'FIRSTAPPROVED')"
                            @click="linkAudit(scope.row)">审核</el-button>

                        <el-button
                            size="small"
                            type="primary" plain
                            v-if="isAllDeptList == 2 && scope.row.toApproveSummaryId"
                            @click="linkAudit(scope.row)">审核</el-button>
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
import { getRestTime, getSummaryPages, listDeptSummaryByPage,listAllPersonalSummaryPage, listPendingSummaryPage,listManagerPendingSummaryPage,judgeCanSubmit ,hasPublishSummary} from 'service/getData'
import {  ERR_OK } from 'service/config'
export default {
    data () {
        return {
            pageType: 1, // 1 个人模式 2部门模式
            userId: '',
            deptLevel: '',
            userView: 'STAFF', // MANAGER   DEPT   STAFF

            timeTips: '',
            isAllDeptList: '0', // 0 待处理
            pendingTotal: 0, // 待处理总数
            tableKey: 0,
            keyword: '',
            
            pageIndex: 1, // 当前页码
            pageSize: 10, // 页码大小
            dataTotal: 0, // 数据总数
            tableData: [],

            isCanAddDept: true, //是否可点击发起部门
            isCanAddPersonal: true, //是否可点击发起个人

            firstPendingFlag: true, // 仅执行一次，初次进入页面判断待处理数量

        }
    },
    created() {
        
        this.userId = localStorage.getItem("userId");
        this.deptLevel = localStorage.getItem("deptLevel");
        this.userView = localStorage.getItem("userView");
        if (this.userView != 'STAFF') {
            this.pageType = 2;
        }
        if (this.$route.query.type == 1) { // 带参数标明搜索个人总结列表
            this.pageType = 1; // 1 个人 2部门
        }
        // 重置部门待审核id组
        localStorage.setItem('unHandleDeptSummarys','');
        

        this.buttonIsDisabledInit(); // 判断按钮是否禁用
        this.pageInit();
    },
    watch: {

    },
    methods: {
        pageInit() {
            this.getDataList();
            this.getLeftTimeToPublish(); // 获取剩余时间提示
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
        // 获取剩余时间提示
        getLeftTimeToPublish() {
            getRestTime({
                userType: 1, // 1个人 2 部门
                submitType: 2, // 1计划  2总结
            }).then((res) => {
                if (res.code == ERR_OK) {
                    this.timeTips = res.data;
                } else {
                    this.$notify({
                        type: 'warning',
                        title: "提示",
                        message: res.msg
                    });
                }
            })
        },
        getDataList() {
            this.tableKey ++;
            let params = {
                nowPage: this.pageIndex,
                pageShow: this.pageSize
            }
            if (this.pageType == 1) {
                params.keyword = this.keyword
                getSummaryPages(params).then((res) => {
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
            } else if (this.pageType == 2) { // 部门
                if (this.isAllDeptList == '0') {
                    if (this.userView == 'DEPT') {
                        
                        listPendingSummaryPage(params).then((res) => {
                            if (res.code == ERR_OK) {
                                this.tableData = res.data.result;
                                this.dataTotal = res.data.totalCount;
                                this.pendingTotal = res.data.totalCount; // 待处理总数
                                if (this.firstPendingFlag) {
                                    this.firstPendingFlag = false;
                                    // 仅执行一次，初始判断待处理数量
                                    if (this.pendingTotal === 0) {
                                        
                                        if (this.userView == 'MANAGER') {
                                            this.isAllDeptList = '2';
                                        } else {
                                            this.isAllDeptList = '1';
                                        }
                                        this.pageIndexChange(1);
                                    }
                                }
                            } else {
                                this.$notify({
                                    type: 'warning',
                                    title: "提示",
                                    message: res.msg
                                });
                            }
                        })
                    } else if (this.userView == 'MANAGER') {

                        listManagerPendingSummaryPage(params).then((res) => {
                            if (res.code == ERR_OK) {
                                this.tableData = res.data.result;
                                this.dataTotal = res.data.totalCount;
                                this.pendingTotal = res.data.totalCount; // 待处理总数
                                if (this.firstPendingFlag) {
                                    this.firstPendingFlag = false;
                                    // 仅执行一次，初始判断待处理数量
                                    if (this.pendingTotal === 0) {
                                        
                                        if (this.userView == 'MANAGER') {
                                            this.isAllDeptList = '2';
                                        } else {
                                            this.isAllDeptList = '1';
                                        }
                                        this.pageIndexChange(1);
                                    }
                                }
                            } else {
                                this.$notify({
                                    type: 'warning',
                                    title: "提示",
                                    message: res.msg
                                });
                            }
                        })
                    }
                    
                    
                } else if (this.isAllDeptList == '1'){
                    listAllPersonalSummaryPage(params).then((res) => {
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
                } else if (this.isAllDeptList == '2'){
                    listDeptSummaryByPage(params).then((res) => {
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
                
            }
        },
        buttonIsDisabledInit() {
            // 逻辑判断按钮是否禁用
            this.isCanAddDept = true;
            this.isCanAddPersonal = true;
            // 验证个人提交时间范围
            judgeCanSubmit({
                userType: 1, // 1个人 2 部门
                submitType: 2, // 1计划  2总结
            }).then((res) => {
                if (res.code == ERR_OK) {
                    if(!res.data) {
                        this.isCanAddPersonal = false;
                    }
                } else {
                    this.$notify({
                        type: 'warning',
                        title: "提示",
                        message: res.msg
                    });
                }
            })
            // 验证部门提交时间范围
            judgeCanSubmit({
                userType: 2, // 1个人 2 部门
                submitType: 2, // 1计划  2总结
            }).then((res) => {
                if (res.code == ERR_OK) {
                    if(!res.data) {
                        this.isCanAddDept = false;
                    }
                } else {
                    this.$notify({
                        type: 'warning',
                        title: "提示",
                        message: res.msg
                    });
                }
            })
            // 验证个人是否发布过计划
            hasPublishSummary({
                planSummaryType: 1
            }).then((res) => {
                if (res.code == ERR_OK) {
                    if(res.data) {
                        this.isCanAddPersonal = false;
                    } else {
                        this.isCanAddDept = false;
                    }
                } else {
                    this.$notify({
                        type: 'warning',
                        title: "提示",
                        message: res.msg
                    });
                }
            })
            // 验证部门是否发布过计划
            hasPublishSummary({
                planSummaryType: 2
            }).then((res) => {
                if (res.code == ERR_OK) {
                    if(res.data) {
                        this.isCanAddPersonal = false;
                        this.isCanAddDept = false;
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
        linkSummaryDeptAdd() { // 发起部门总结
            this.$router.push({
                path: "/planSummaryManage/summaryDept"
            })
        },
        linkSummaryAdd() { // 发起个人计划
            this.$router.push({
                path: "/planSummaryManage/summaryPersonal"
            })
        },
        // 总结详情页面
        linkDetail(id, type) {
            this.$router.push({
                path: "/planSummaryManage/summaryDetail",
                query: {
                    id: id,
                    type: type
                }
            })
        },
        linkEdit(id, type) {
            if (type == 1) {
                // 编辑个人总结
                this.$router.push({
                    path: "/planSummaryManage/summaryPersonal",
                    query: {
                        id: id,
                        type: type
                    }
                })
            } else {
                this.$router.push({
                    path: "/planSummaryManage/summaryDept",
                    query: {
                        id: id,
                        type: type
                    }
                })
            }
        },
        linkAudit(row) {
            // 审核总结
            this.$router.push({
                path: "/planSummaryManage/summaryAudit",
                query: {
                    id: row.id,
                    type: row.summaryType
                }
            })
        },
        linkHandle(row) {
            let id = row.id;
            if (row.summaryType == 2) {
                if (row.appealingSummaryId && (row.appealingSummaryId.split(',').length > 0)) {
                    localStorage.setItem('unHandleDeptSummarys',row.appealingSummaryId);
                    id = row.appealingSummaryId.split(',')[0];
                } else {
                    this.$notify({
                        type: 'warning',
                        title: "提示",
                        message: '暂无未处理申诉总结'
                    });
                    return;
                }
            } else {
                localStorage.setItem('unHandleDeptSummarys','');
            }
            
            // 处理个人总结
            this.$router.push({
                path: "/planSummaryManage/summaryHandle",
                query: {
                    id: id
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
        },
        // 跳转个人总结列表
        linkSummaryStaff() {
            this.$router.push({
                path: "/planSummaryManage/summaryManage",
                query: {
                    type: 1
                }
            })
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
