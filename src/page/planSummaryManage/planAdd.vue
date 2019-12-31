<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">计划总结管理</span> /
            <span class="child2">计划管理</span> /
            <span class="child2">发起计划</span>
        </div>
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">计划管理<span class="tip">距提交下月计划还剩：12天</span></div>
                <div class="idss-list-top-btn-groups">
                    <el-button size="small" type="primary">个人计划列表</el-button>
                    <el-button size="small" type="primary">发起部门计划</el-button>
                    <el-button size="small" type="primary">发起个人计划</el-button>
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
            <el-table :data="listData">
			    <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column label="类别">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.type" placeholder="请选择">
                            <el-option v-for="(item,index) in planTypes" :key="index" :value="item.id" :label="item.name"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="事项">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.dist" placeholder="请输入事项"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="本月目标">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.value" placeholder="请输入本月目标">
                            <el-button slot="append">
                                <span class="color-primary">快捷设置</span>
                            </el-button>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="最迟完成时间">
                    <template slot-scope="scope">
                        <el-date-picker
                            v-model="scope.row.date"
                            type="date"
                            style="width:auto;"
                            placeholder="年-月-日">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column label="权重" width="100">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.dist" disabled placeholder=""></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="工作量基数">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.dist" type="number" placeholder="">
                            <el-button slot="append" :disabled="scope.row.isBase">
                                <span class="color-primary">{{scope.row.isBase ? '取消' : '设为基数'}}</span>
                            </el-button>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" slot="append" @click="deleteListItem(scope.$index)" v-if="scope.$index > 0">删除该项</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="plan-table-tfoot">
                <a href="javascript:;" class="color-primary" @click="addListItem">添加一条</a>
            </div>
            
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
            listData: [
                {
                    type: '', // 类别
                    dist: '', // 事项
                    value: '', // 本月目标
                    date: '', // 最迟完成时间
                    power: '', // 权重
                    base: '', // 工作量基数
                }
            ],

            planTypes: [{
                name: '行研管理',
                id: 1
            },{
                name: '投后管理',
                id: 2
            }]
        }
    },
    created() {
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
        
        addListItem() { // 增加项目
            this.listData.push({
                type: '', // 类别
                dist: '', // 事项
                value: '', // 本月目标
                date: '', // 最迟完成时间
                power: '', // 权重
                base: '', // 工作量基数
            })
        },
        deleteListItem(index) { // 删除项目
            this.listData.splice(index, 1);
        },

    }
}
</script>

<style scoped lang="scss">
.plan-table-tfoot {
    line-height: 30px;
    padding-left: 30px;
    padding-bottom: 30px;
}
</style>
