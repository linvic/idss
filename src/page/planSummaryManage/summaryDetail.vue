<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <span class="child1">计划总结管理</span> /
            <router-link to="/planSummaryManage/summaryManage">
                <span class="child1">总结管理</span>
            </router-link> /
            <span class="child2">总结详情</span>
        </div>
        <div v-if="type == 1">
            <div class="idss-list m-b">
                <div class="idss-list-top">
                    <div class="idss-list-top-title">{{listTitle}}<span class="summaryTotalScore" v-if="summaryStatus == 'COMPLETION'">绩效得分{{summaryTotalScore}}分</span></div>
                    <div class="idss-list-top-btn-groups">
                        <el-button size="small" type="primary" plain @click="submit(0)" v-if="userId == detailUserId && summaryStatus == 'CONFIRMSCORE'">打分申诉</el-button>
                        <el-button size="small" type="primary" @click="submit(1)" v-if="userId == detailUserId && summaryStatus == 'CONFIRMSCORE'">确认打分</el-button>
                        
                        <el-button size="small" type="primary" @click="summaryExport" v-if="summaryStatus == 'COMPLETION'">导出总结</el-button>
                    </div>
                </div>
                
                <el-table :data="listData">
                    <el-table-column type="index" label="序号" width="80"></el-table-column>
                    <el-table-column label="类别">
                        <template slot-scope="scope">
                            <span>{{scope.row.taskTypeName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="事项">
                        <template slot-scope="scope">
                            <span>{{scope.row.title}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="本月目标">
                        <template slot-scope="scope">
                            <span>{{scope.row.taskGoal}}</span>
                        </template>
                    </el-table-column>
                    
                    <el-table-column label="最迟完成时间" width="160px">
                        <template slot-scope="scope">
                            
                            <span>{{scope.row.planEndDate}}</span>
                        </template>
                    </el-table-column>
                    
                    <el-table-column label="工作量基数" width="100">
                        <template slot-scope="scope">
                            <span>{{scope.row.taskWorkload}}</span>
                        </template>
                    </el-table-column>
                    
                    <el-table-column label="是否已完成" width="110" align="center">
                        <template slot-scope="scope">
                            
                            <el-switch
                                v-model="scope.row.taskSummaryStatus"
                                :active-value="1"
                                :inactive-value="0"
                                :disabled="true"
                                active-color="#13ce66">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="本人总结">
                        <template slot-scope="scope">
                            <span>{{scope.row.taskComment}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column v-for="(item,index) in showScoreLabels" :key="index" width="110">
                        <template slot="header" slot-scope="scope">
                            {{showScoreLabels[index]}}
                        </template>

                        <template slot-scope="scope">
                            <span>{{scope.row.showScoreValues[index] || '-'}}</span>
                        </template>
                    </el-table-column>
                    
                    

                </el-table>
                
            </div>
            
            <div class="idss-list m-b">
                <div class="idss-list-top">
                    <div class="idss-list-top-title">总结附件</div>
                </div>
                <div class="file-list">
                    <ul v-if="fileList && fileList.length > 0">
                        <li class="file-list-item" v-for="(item,index) in fileList" :key="index" @click="downloadFiles(item)">
                            
                            <span>{{item.fileName}}</span>
                        </li>
                    </ul>
                    <div v-else class="file-list-nodata">暂无数据</div>
                    
                </div>
            </div>
        </div>
        
        <div class="idss-list m-b" v-for="(item,index) in detailList" :key="index" v-if="type == 2">
            <div class="idss-list-top">
                <div class="idss-list-top-title">{{item.deptName || ''}} {{item.title || ''}} <span class="summaryTotalScore" v-if="summaryStatus == 'COMPLETION'">绩效得分{{item.summaryTotalScore}}分</span></div>
                <div class="idss-list-top-btn-groups" v-if="index === 0">
                    <el-button size="small" type="primary" @click="summaryExport" v-if="summaryStatus == 'COMPLETION'">导出总结</el-button>
                </div>
            </div>
            <div v-if="item.summaryInfoList && item.summaryInfoList.length > 0">
                <div v-for="(j,k) in item.summaryInfoList" :key="k" class="dept-list">
                    <div class="dept-list-top">
                        {{j.userName || '无名'}}

                        <span v-if="!j.taskInfoList || j.taskInfoList.length === 0">该员工因特殊原因无法提交本月总结</span>
                        <span  class="summaryTotalScore" v-else-if="summaryStatus == 'COMPLETION'">绩效得分{{j.summaryTotalScore}}分</span>
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
                        
                        <el-table-column label="是否已完成" width="110" align="center">
                            <template slot-scope="scope">
                                
                                <el-switch
                                    v-model="scope.row.taskSummaryStatus"
                                    :active-value="1"
                                    :inactive-value="0"
                                    :disabled="true"
                                    active-color="#13ce66">
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="本人总结">
                            <template slot-scope="scope">
                                <span>{{scope.row.taskComment}}</span>
                            </template>
                        </el-table-column>
                        
                        <el-table-column v-for="(item,index) in j.showScoreLabels" :key="index" width="110">
                            <template slot="header" slot-scope="scope">
                                {{j.showScoreLabels[index]}}
                            </template>

                            <template slot-scope="scope">
                                <span>{{scope.row.showScoreValues[index] || '-'}}</span>
                            </template>
                        </el-table-column>
                    </el-table>

                </div>
            </div>

            <div class="dept-list" v-else>
                <div class="dept-list-top">
                    <span>该部门因特殊原因无法提交本月总结</span>
                    <div class="dept-list-top-input m-b">
                        <span>{{item.notSubmitReason}}</span>
                    </div>
                </div>
            </div>

        </div>
        
        <!-- 操作记录 -->
        <HandleLogs :logType="3" :id="id"></HandleLogs>
        
    </div>
</template>

<script>
import { personalSummaryDetail,deptSummaryDetail,appealSummary,conformScore,exportSummary,downloadFile} from 'service/getData'
import {  ERR_OK } from 'service/config'
import HandleLogs from './components/handleLogs'
export default {
    name: 'summaryDetail',
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
            userId: '',

            detailUserId: 0,
            summaryStatus: '',
            listTitle: '总结详情',
            downloadFileName: '个人总结.xlsx',
            summaryTotalScore: 0,
            listData: [],
            detailList: [],

            fileList: [], //个人附件管理

            
            showScoreLabels: [],
            showScoreValues: [],
            scoreIndex: 0,
            approveDeptLevel: -1,

        }
    },
    created() {
        this.userId = localStorage.getItem("userId");
        this.getBaseData();
    },
    watch: {

    },
    methods: {
        getBaseData() {
            if(this.type == 2) {
                // 部门总结
                deptSummaryDetail({
                    id: this.id
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        this.setBaseData(res.data.deptSummaryPojoList);
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: "提示",
                            message: res.msg
                        });
                    }
                })
            } else {
                // 个人总结
                personalSummaryDetail({
                    id: this.id, // 1个人总结 2部门总结
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        
                        this.listTitle =
                                        (res.data.deptName ? res.data.deptName + ' ' : '')
                                        +
                                        (res.data.userName ? res.data.userName + ' ' : '')
                                        +
                                        (res.data.title ? res.data.title : '');

                        this.downloadFileName = res.data.title + '-' + res.data.userName + '.xlsx';
                        
                        this.approveDeptLevel = res.data.approveDeptLevel;
                        this.detailUserId = res.data.userId;
                        this.summaryStatus = res.data.summaryStatus;
                        this.fileList = res.data.fileInfoList ? res.data.fileInfoList : []; // 附件
                        this.summaryTotalScore = res.data.summaryTotalScore; // 绩效得分

                        let newList = res.data.taskInfoList;
                        // 处理元数据
                        for(let item of newList) {

                            let _taskEvaluatePojoJson = [];
                            if (item.taskEvaluatePojoJson) {
                                _taskEvaluatePojoJson = JSON.parse(item.taskEvaluatePojoJson);
                            } else {
                                _taskEvaluatePojoJson = [
                                    {
                                        canEdit: true,
                                        taskScore: '',
                                        taskComment: '',
                                        deptLevel: this.approveDeptLevel
                                    }
                                ]
                            }
                            let showScoreLabels = [];
                            let showScoreValues = [];

                            for(let j of _taskEvaluatePojoJson) {
                                if (j.deptLevel == -1) { // 本人总结
                                    item.taskComment = j.taskComment;
                                }

                                if (j.deptLevel == this.approveDeptLevel) {
                                    let _label = this.getLevelLable(j.deptLevel);
                                    this.scoreIndex = showScoreLabels.length;
                                    showScoreLabels.push(_label);
                                    showScoreValues.push(j.taskScore);
                                    item.taskScore = j.taskScore;
                                    item.taskScoreIsDisabled = !j.canEdit;
                                } else {
                                    let _label = this.getLevelLable(j.deptLevel);
                                    showScoreLabels.push(_label);
                                    showScoreValues.push(j.taskScore);
                                }
                                
                            }
                            this.showScoreLabels = showScoreLabels;
                            item.showScoreValues = showScoreValues;

                        }
                        this.listData = [...newList];

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
        
        getLevelLable(v) {
            if (v == -1) {
                return '自评打分';
            } else if (v == 2) {
                return '二级部门打分';
            } else if (v == 1) {
                return '一级部门打分';
            } else if (v == 0) {
                return '总经理打分';
            }
        },
        setBaseData(result) {
            let _newList = result;
            // 处理元数据
            for(let l of _newList) {
                if(!l.summaryInfoList) continue;
                for(let v of l.summaryInfoList) {
                    for(let item of v.taskInfoList) {
                        
                        let _taskEvaluatePojoJson = [];
                        if (item.taskEvaluatePojoJson) {
                            _taskEvaluatePojoJson = JSON.parse(item.taskEvaluatePojoJson);
                        } else {
                            _taskEvaluatePojoJson = [
                                {
                                    canEdit: true,
                                    taskScore: '',
                                    taskComment: '',
                                    deptLevel: v.approveDeptLevel
                                }
                            ]
                        }
                        let showScoreLabels = [];
                        let showScoreValues = [];

                        for(let j of _taskEvaluatePojoJson) {
                            if (j.deptLevel == -1) { // 本人总结
                                item.taskComment = j.taskComment;
                            }

                            if (j.deptLevel == v.approveDeptLevel) {
                                let _label = this.getLevelLable(j.deptLevel);
                                this.scoreIndex = showScoreLabels.length;
                                showScoreLabels.push(_label);
                                showScoreValues.push(j.taskScore);
                                item.taskScore = j.taskScore;
                                item.taskScoreIsDisabled = !j.canEdit;
                            } else {
                                let _label = this.getLevelLable(j.deptLevel);
                                showScoreLabels.push(_label);
                                showScoreValues.push(j.taskScore);
                            }
                            
                        }
                        v.showScoreLabels = showScoreLabels;
                        item.showScoreValues = showScoreValues;

                    }

                }
            }
            this.detailList = [..._newList];
            this.summaryStatus = result && result[0] && result[0].summaryStatus;
            
            this.downloadFileName = result[0].title + '.zip';
            
        },
        submit(submitType) {
            if (submitType == 0) {

                this.$prompt('申诉内容：', '打分申诉', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputType: 'textarea',
                    inputPattern: /^.{1,400}$/,
                    inputErrorMessage: '请输入申诉内容（400字符内）'
                }).then(({ value }) => {
                    
                    appealSummary({
                        id: this.id,
                        reason: value
                    }).then((res) => {
                        if (res.code == ERR_OK) {
                            
                            this.$router.replace('/planSummaryManage/summaryManage');

                        } else {
                            this.$notify({
                                type: 'warning',
                                title: "提示",
                                message: res.msg
                            });
                        }
                    })
                }).catch(() => {
                });
            } else if (submitType == 1) {
                this.$confirm('确认打分后，绩效将按照上述打分进行计算。是否确认？', '确认打分', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    
                    conformScore({
                        id: this.id,
                    }).then((res) => {
                        if (res.code == ERR_OK) {
                            
                            this.$router.replace('/planSummaryManage/summaryManage');

                        } else {
                            this.$notify({
                                type: 'warning',
                                title: "提示",
                                message: res.msg
                            });
                        }
                    })
                }).catch(() => {      
                });
                
            }
        },
        // 导出总结
        summaryExport() {
            
            exportSummary({
                summaryId: this.id,
                summaryType: this.type,
                token: localStorage.getItem('token')
            }).then((res) => {
                
                let blob = new Blob([res]);
                const fileName = this.downloadFileName;
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
        
        downloadFiles(item) {
            // 导入设备
            downloadFile({
                filePath: item.filePath,
                token: localStorage.getItem('token')
            }).then((res) => {
                
                let blob = new Blob([res]);
                const fileName = item.fileName;
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
.summaryTotalScore {
    margin-left: 10px;
    font-size: 14px;
    color: #666666;
}
.file-list {
    background: #fff;
    padding: 8px 0;
    .file-list-item {
        display: inline-block;
        margin: 8px 0px 8px 20px;
        line-height: 40px;
        border: 1px solid #E0E0E0;
        color: #D93538;
        font-size: 12px;
        text-align: center;
        min-width: 214px;
        padding: 0 20px;
        cursor: pointer;
        position: relative;
        .el-icon-error {
            position: absolute;
            font-size: 14px;
            right: -7px;
            top: -7px;
            cursor: pointer;
            color: #878A9A;
            &:hover {
                color: #D93538;
            }
        }
    }
    .file-list-nodata {
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        color: #909399;
    }
}
</style>
