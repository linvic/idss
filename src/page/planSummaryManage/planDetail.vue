<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">计划总结管理</span> /
            <router-link to="/planSummaryManage/planManage">
                <span class="child1">计划管理</span>
            </router-link> /
            <span class="child2">计划详情</span>
        </div>
        <div class="idss-list m-b" v-if="type == 1">
            <div class="idss-list-top">
                <div class="idss-list-top-title">{{listTitle}}</div>
            </div>
                
            <el-table :data="listData">
                <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column label="类别">
                    <template slot-scope="scope">
                        <span>{{scope.row.taskTypeName || ''}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="事项">
                    <template slot-scope="scope">
                        <span>{{scope.row.title || ''}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="本月目标">
                    <template slot-scope="scope">
                        <span>{{scope.row.taskGoal || ''}}</span>
                    </template>
                </el-table-column>
                
                <el-table-column label="最迟完成时间" width="160px">
                    <template slot-scope="scope">
                        <span>{{scope.row.planEndDate || ''}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="权重" width="110">
                    <template slot-scope="scope">
                        <span>{{scope.row.weight || ''}}</span>
                    </template>
                </el-table-column>
            </el-table>
            
        </div>
        
        <div class="idss-list m-b" v-for="(item,index) in detailList" :key="index" v-if="type == 2">
            <div class="idss-list-top">
                <div class="idss-list-top-title">{{item.deptName || ''}} {{item.title || ''}}</div>
            </div>
            <div v-for="(j,k) in item.planInfoList" :key="k" class="dept-list">
                <div class="dept-list-top">
                    {{j.userName || '无名'}}
                    <span v-if="!j.taskInfoList || j.taskInfoList.length === 0">该员工因特殊原因无法提交本月计划</span>
                    <div v-if="!j.taskInfoList || j.taskInfoList.length === 0" class="dept-list-top-input">
                        <span>{{j.notSubmitReason}}</span>
                    </div>
                </div>
                
                <el-table :data="j.taskInfoList" v-if="j.taskInfoList && j.taskInfoList.length > 0">
                    <el-table-column type="index" label="序号" width="120"></el-table-column>
                    <el-table-column label="类别">
                        <template slot-scope="scope">
                            <span>{{scope.row.taskTypeName || ''}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="事项">
                        <template slot-scope="scope">
                            <span>{{scope.row.title || ''}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="本月目标">
                        <template slot-scope="scope">
                            <span>{{scope.row.taskGoal || ''}}</span>
                        </template>
                    </el-table-column>
                    
                    <el-table-column label="最迟完成时间" width="160px">
                        <template slot-scope="scope">
                            <span>{{scope.row.planEndDate || ''}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="权重" width="110">
                        <template slot-scope="scope">
                            <span>{{scope.row.weight || ''}}</span>
                        </template>
                    </el-table-column>
                </el-table>

            </div>

        </div>
        
        <!-- 操作记录 -->
        <HandleLogs :logType="2" :id="id"></HandleLogs>
        
    </div>
</template>

<script>
import { personalPlanDetail,deptPlanDetail } from 'service/getData'
import {  ERR_OK } from 'service/config'
import HandleLogs from './components/handleLogs'
export default {
    name: 'planDetail',
    components: {
        HandleLogs
    },
    computed: {
        id() {
            return this.$route.query.id
        },
        type() {
            return this.$route.query.type
        }
    },
    data () {
        return {
            listTitle: '计划详情',
            listData: [],
            detailList: [],

        }
    },
    created() {
        this.getBaseData();
    },
    watch: {

    },
    methods: {
        getBaseData() {
            if(this.type == 2) {
                // 部门计划
                deptPlanDetail({
                    id: this.id
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        this.setBaseData(res.data.deptPlanPojoList);
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: "提示",
                            message: res.msg
                        });
                    }
                })
            } else {
                // 个人计划
                personalPlanDetail({
                    id: this.id, // 1个人计划 2部门计划
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        
                        this.listTitle =
                                        (res.data.deptName ? res.data.deptName + ' ' : '')
                                        +
                                        (res.data.userName ? res.data.userName + ' ' : '')
                                        +
                                        (res.data.title ? res.data.title : '')

                        this.listData = res.data.taskInfoList
                        this.computeWeight(); // 计算权重

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
        
        setBaseData(result) {
            this.detailList = result;
            
            this.computeDeptWeight(); // 计算权重信息
        },
        // 计算权重-个人计划
        computeWeight() {
            let sum = 0;
            for (let item of this.listData) {
                if(item.taskWorkload) {
                    sum += parseInt(item.taskWorkload);
                }
            }
            for (let item of this.listData) {
                if(item.taskWorkload) {
                    item.weight = parseFloat(parseInt(item.taskWorkload) * 100 / sum).toFixed(2) + '%';
                }
            }
        },
        // 计算权重 -部门计划
        computeDeptWeight() {
            
            for(let i of this.detailList) {
                
                for(let j of i.planInfoList) {
                    
                    if( j.taskInfoList && j.taskInfoList.length > 0) {
                        
                        // 计算权重
                        let sum = 0;
                        for (let item of j.taskInfoList) {
                            if(item.taskWorkload) {
                                sum += parseInt(item.taskWorkload);
                            }
                        }
                        for (let item of j.taskInfoList) {
                            if(item.taskWorkload) {
                                let _weight = parseFloat(parseInt(item.taskWorkload) * 100 / sum).toFixed(2) + '%';
                                this.$set(item, 'weight',_weight);
                            }
                        }
                    }

                }
                
            }
        }
    }
}
</script>

<style scoped lang="scss">
.dept-list {
    margin-bottom: 20px;
    .dept-list-top {
        line-height: 40px;
        padding: 10px 20px;
        > span {
            font-size: 12px;
            color: #999;
        }
        .dept-list-top-input {
            line-height: 30px;
            color: #666666;
        }
    }
    .el-table {
        border-top: 1px solid #DADFEA;
    }
}
</style>
