<template>
    <div>
        <div class="wrapper">
            <div class="title">
                系统设置
            </div>
            <div class="setCenter-list">
                <el-row :gutter="30">
                    <el-col :span="8" v-if="departmentPermission">
                        <router-link class="list-item" :to="{ path: 'departmentManage' }">
                            <div class="icon-left">
                                <img
                                    src="../../images/icon_department.png"
                                    alt="部门管理"
                                />
                            </div>
                            <div class="content-right">
                                <h3>部门管理</h3>
                                <p>设置公司部门</p>
                            </div>
                        </router-link>
                    </el-col>
                    <el-col :span="8" v-if="rolePermission">
                        <router-link class="list-item" to="/role">
                            <div class="icon-left">
                                <img
                                    src="../../images/icon_role.png"
                                    alt="角色管理"
                                />
                            </div>
                            <div class="content-right">
                                <h3>角色管理</h3>
                                <p>设置公司内部角色</p>
                            </div>
                        </router-link>
                    </el-col>
                    <el-col :span="8" v-if="userPermission">
                        <router-link class="list-item" :to="{ path: 'staffDetail' }">
                            <div class="icon-left">
                                <img
                                    src="../../images/icon_user.png"
                                    alt="员工管理"
                                />
                            </div>
                            <div class="content-right">
                                <h3>员工管理</h3>
                                <p>管理公司员工信息</p>
                            </div>
                        </router-link>
                    </el-col>
                    
                    <el-col :span="8">
                        <router-link class="list-item" to="/setCenter/planSummaryManage">
                            <div class="icon-left">
                                <img
                                    src="../../images/icon_task.png"
                                    alt=""
                                />
                            </div>
                            <div class="content-right">
                                <h3>计划总结管理</h3>
                                <p>设置计划总结</p>
                            </div>
                        </router-link>
                    </el-col>
                    <el-col :span="8">
                        <router-link class="list-item" to="/setCenter/examineGroupsManage">
                            <div class="icon-left">
                                <img
                                    src="../../images/icon_task.png"
                                    alt=""
                                />
                            </div>
                            <div class="content-right">
                                <h3>考核组管理</h3>
                                <p>设置绩效考核种类</p>
                            </div>
                        </router-link>
                    </el-col>
                    <el-col :span="8">
                        <router-link class="list-item" to="/setCenter/attendancesManage">
                            <div class="icon-left">
                                <img
                                    src="../../images/icon_task.png"
                                    alt=""
                                />
                            </div>
                            <div class="content-right">
                                <h3>考勤管理</h3>
                                <p>设置考勤异常情况的扣款金额及核对考勤的时间</p>
                            </div>
                        </router-link>
                    </el-col>
                    <el-col :span="8" v-if="teamPermission">
                        <router-link class="list-item" :to="{ path: 'teamManage' }">
                            <div class="icon-left">
                                <img
                                    src="../../images/icon_team.png"
                                    alt="团队管理"
                                />
                            </div>
                            <div class="content-right">
                                <h3>团队管理</h3>
                                <p>设置公司团队</p>
                            </div>
                        </router-link>
                    </el-col>
                    <el-col :span="8" v-if="projectPermission">
                        <router-link class="list-item" :to="{ path: 'projectManage' }">
                            <div class="icon-left">
                                <img
                                    src="../../images/icon_project.png"
                                    alt="项目管理"
                                />
                            </div>
                            <div class="content-right">
                                <h3>项目管理</h3>
                                <p>简单管理项目，方便下一版本数据同步</p>
                            </div>
                        </router-link>
                    </el-col>
                    <el-col :span="8" v-if="missionPermission">
                        <router-link class="list-item" :to="{ path: 'taskGrounpManage' }">
                            <div class="icon-left">
                                <img
                                    src="../../images/icon_task.png"
                                    alt="任务类别管理"
                                />
                            </div>
                            <div class="content-right">
                                <h3>任务类别管理</h3>
                                <p>管理任务种类，用于任务管理查看</p>
                            </div>
                        </router-link>
                    </el-col>
                    <el-col :span="8" v-if="rewardsPermission">
                        <router-link class="list-item" :to="{ path: 'rewardManage' }">
                            <div class="icon-left">
                                <img
                                    src="../../images/icon_reward.png"
                                    alt="奖惩管理"
                                />
                            </div>
                            <div class="content-right">
                                <h3>奖惩管理</h3>
                                <p>奖惩信息设置</p>
                            </div>
                        </router-link>
                    </el-col>
                    <el-col :span="8" v-if="noticePermission">
                        <router-link class="list-item" to="/noticeManage">
                            <div class="icon-left">
                                <img
                                    src="../../images/icon_notice.png"
                                    alt="公告管理"
                                />
                            </div>
                            <div class="content-right">
                                <h3>公告管理</h3>
                                <p>设置公司公告信息</p>
                            </div>
                        </router-link>
                    </el-col>
                    <el-col :span="8" v-if="reportPermission">
                        <router-link class="list-item" to="/weeklyTime">
                            <div class="icon-left">
                                <img
                                    src="../../images/icon_weekly.png"
                                    alt="周报时间"
                                />
                            </div>
                            <div class="content-right">
                                <h3>周报时间</h3>
                                <p>设置公司提交周报的截止时间</p>
                            </div>
                        </router-link>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
import { listOperFuns } from "../../service/getData";
import { ERR_OK, SYS } from "../../service/config";
import store from "../../store";
export default {
    data() {
        return {
            rolePermission: false,
            departmentPermission: false,
            teamPermission: false,
            userPermission: false,
            projectPermission: false,
            missionPermission: false,
            rewardsPermission: false,
            noticePermission: false,
            reportPermission: false
        };
    },
    created() {
        this._listOperFuns();
    },
    components: {
        //      Tab
    },
    methods: {
        _listOperFuns() {
            var self = this;
            listOperFuns({ resourceNo: "SYS" }).then(function(res) {
                if (res.code == ERR_OK) {
                    for (var key in res.data) {
                        if (res.data[key].resourceNo == "dept") {
                            self.departmentPermission = true;
                        }
                        if (res.data[key].resourceNo == "role") {
                            self.rolePermission = true;
                        }
                        if (res.data[key].resourceNo == "user") {
                            self.userPermission = true;
                        }
                        if (res.data[key].resourceNo == "team") {
                            self.teamPermission = true;
                        }
                        if (res.data[key].resourceNo == "project") {
                            self.projectPermission = true;
                        }
                        if (res.data[key].resourceNo == "taskGroup") {
                            self.missionPermission = true;
                        }
                        if (res.data[key].resourceNo == "rp") {
                            self.rewardsPermission = true;
                        }
                        if (res.data[key].resourceNo == "notice") {
                            self.noticePermission = true;
                        }
                        if (res.data[key].resourceNo == "weeklyCycle") {
                            self.reportPermission = true;
                        }
                    }
                } else {
                    self.$notify.error({
                        title: "错误",
                        message: res.msg
                    });
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.wrapper {
    margin: 0 auto;
}
.title {
    height: 42px;
    line-height: 42px;
    font-size: 12px;
    color: #505363;
}
.setCenter-list {
}

.setCenter-list .list-item {
    display: block;
    background: #ffffff;
    // box-shadow: 0 2px 11px 0 rgba(0,0,0,0.07);
    border-radius: 6px;
    height: 150px;
    margin-bottom: 10px;
    cursor: pointer;
    border: 1px solid #e6eaf2;
    transition: all 0.2s linear;
}
.setCenter-list .list-item:hover {
    box-shadow: 0 15px 15px 0 rgba(0, 0, 0, 0.1);
    transform: translate3d(0, -3px, 0);
}
.icon-left {
    float: left;
    width: 144px;
    height: 100%;
}
.icon-left img {
    display: inline-block;
    margin-left: 48.9px;
    margin-top: 52px;
}
.content-right {
    width: 100%;
    padding-left: 100px;
    padding-right: 40px;
    box-sizing: border-box;
}
.content-right h3 {
    font-size: 16px;
    color: #505363;
    line-height: 16px;
    margin-top: 50px;
}
.content-right p {
    font-size: 14px;
    color: #505363;
    line-height: 22px;
    margin-top: 16px;
}
</style>
