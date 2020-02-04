<template>
    <div>
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">操作记录</div>
            </div>
            <el-table
                :data="tableData"
                style="width: 100%" empty-text='暂无数据'>
                <el-table-column prop="userName" label="姓名"></el-table-column>
                <el-table-column prop="createTime" label="时间"></el-table-column>
                <el-table-column prop="typeName" label="操作名称"></el-table-column>
                <el-table-column label="操作描述" >
                    <template slot-scope="scope">
                        <span v-html="scope.row.handleDec.replace(/\\n/gm, '<br>')"></span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>

</template>

<script>
import { getAttendanceLogs } from 'service/getData'
import {  ERR_OK } from 'service/config'
export default {
    props: {
        id: {
            type: [String,Number]
        },
        examineDate: {
            type: String
        },
    },
    data () {
        return {
            tableData: [], //任务操作记录
        }
    },
    created() {
        this.getTaskChangeLog();
    },
    watch: {
        examineDate(to, from) {
            this.getTaskChangeLog();
        }
    },
    methods: {
        // 获取任务操作记录
        getTaskChangeLog() {
            if (!this.examineDate) {
                return;
            }
            getAttendanceLogs({
                recordId: this.id,
                examineDate: this.examineDate
            }).then((res) => {
                if(res.code == ERR_OK) {
                    this.tableData = res.data;
                }else {
                    this.$notify.error({
                        title: '错误',
                        message:res.msg
                    });
                }
            })
        },
    }
}
</script>

<style scoped lang="scss">

    
</style>
