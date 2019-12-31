<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">计划总结管理</span> /
            <span class="child2">计划管理</span>
        </div>
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">计划管理<span class="tip">距提交下月计划还剩：12天</span></div>
                <div class="idss-list-top-btn-groups">
                    <el-button size="small" type="primary">个人计划列表</el-button>
                    <el-button size="small" type="primary">发起部门计划</el-button>
                    <el-button size="small" type="primary" @click="linkPlanAdd">发起个人计划</el-button>
                </div>
            </div>
            <div class="idss-list-filter">
                <el-input size="small" style="width:200px;margin-right:10px;vertical-align: middle;" v-model="searchKey" placeholder="请输入关键字搜索"></el-input>
                <el-button size="small" style="vertical-align: middle;" @click="">搜索</el-button>
            </div>

            <!-- @tab-click="handleClick" -->
            <div class="idss-list-tabs" v-if="false">
                <el-tabs v-model="activeName2" type="card">
                    <el-tab-pane label="用户管理" name="1">用户管理</el-tab-pane>
                    <el-tab-pane label="配置管理" name="2">配置管理</el-tab-pane>
                    <el-tab-pane label="角色管理" name="3">角色管理</el-tab-pane>
                    <el-tab-pane label="定时任务补偿" name="4">定时任务补偿</el-tab-pane>
                </el-tabs>
            </div>
            <el-table :data="tableData">
			    <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column label="用户名" prop="userName"></el-table-column>
                <el-table-column label="角色" prop="roleName"></el-table-column>
                <el-table-column label="手机号" prop="telephone"></el-table-column>
                
                <el-table-column label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button size="small" @click="changePws(scope.row.userId)">重置密码</el-button>
                        <!-- <el-button size="small" @click="editorUser(scope.row.userId)" :disabled="true" class="disable-button">编辑</el-button> -->
                        <el-button size="small" @click="editorUser(scope.row.userId)">编辑</el-button>
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
import { getUserList } from 'service/getData'
import {  ERR_OK } from 'service/config'
export default {
    data () {
        return {
            activeName2: '1',
            searchKey: '',
            
            pageIndex: 1, // 当前页码
            pageSize: 15, // 页码大小
            dataTotal: 0, // 数据总数
            tableData: []
        }
    },
    created() {
        this.getDataList();
    },
    watch: {

    },
    methods: {
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
            getUserList(params).then((res) => {
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
        linkPlanAdd() {
            this.$router.push({
                path: "/planSummaryManage/planAdd"
            })
        }

    }
}
</script>

<style scoped lang="scss">
</style>
