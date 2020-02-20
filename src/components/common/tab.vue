<template>
    <div class="header">
        <div class="tab">
            <!-- tag=""默认渲染成什么标签 -->
            <div class="tab_left">
                <router-link to="/index">
                    <div class="company_logo">
                        <img src="../../images/company_logo.png" alt="" />
                    </div>
                </router-link>
            </div>
            <div class="tab_right">
                <div class="noti">
                    <el-dropdown trigger="click" @visible-change="handle">
                        <el-badge :value="totalCount" class="item">
                            <img src="../../images/noti.png" alt="" />
                        </el-badge>
                        <el-dropdown-menu
                            slot="dropdown"
                            id="dropdown"
                            class="notice_list">
                            <el-dropdown-item class="notices">
                                消息通知</el-dropdown-item>
                            <el-dropdown-item
                                v-if="noTi"
                                class="notice_not"
                                disabled
                                >没有新消息</el-dropdown-item>
                            <el-dropdown-item
                                v-for="item in list"
                                :key="item.messageSiteInfoId">
                                <div
                                    @click="
                                        skip(item)">
                                    <span class="ellipsis notice_title">{{
                                        item.messageTitle
                                    }}</span>
                                    <span class="ellipsis notice_time">{{
                                        item.createDateDistanceDesc
                                    }}</span>
                                </div>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <div>
                                    <router-link to="/remindManage">
                                        <p class="look_all">查看全部</p>
                                    </router-link>
                                </div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="icon_personal">
                    <el-dropdown
                        trigger="click"
                        @visible-change="handLeft"
                        @command="handleCommand">
                        <span class="el-dropdown-link">
                            <img src="../../images/personal.png" alt="" />
                        </span>
                        <el-dropdown-menu
                            slot="dropdown"
                            style="top:50px"
                            id="dowm">
                            <el-dropdown-item command="setCenter" v-if="setCenterPermission">系统设置</el-dropdown-item>
                            <el-dropdown-item command="personalCenter">个人信息</el-dropdown-item>
                            <el-dropdown-item command="modifyPassword">修改密码</el-dropdown-item>
                            <el-dropdown-item command="loginOut">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="personal ellipsis" @click="openPersonInfo">
                    <span>{{ name }}</span>
                </div>
            </div>
        </div>
        <el-dialog
            title="退出登录"
            :visible.sync="dialogVisible"
            width="560px"
            :before-close="handleClose"
            top="25%"
            class="department"
        >
            <span class="delete_team">确定要退出登录吗？</span>
            <span slot="footer" class="dialog-footer">
                
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureLoginOut">确 定</el-button>
            </span>
        </el-dialog>
        <!--个人信息-->
        <div class="tabs">
            <el-dialog
                title="个人信息"
                :visible.sync="dialogVisible3"
                width="560px"
                :before-close="handleClose3"
                top="10%"
            >
                <el-form
                    :label-position="labelPosition"
                    :rules="rules"
                    ref="formLabelAlign"
                    label-width="100px"
                    :model="formLabelAlign"
                >
                    <el-form-item label="角色名：" class="roleName">
                        <span>{{ role[0] }}</span>
                    </el-form-item>
                    <el-form-item
                        label="姓名："
                        required
                        prop="userName"
                        class="names"
                    >
                        <el-input v-model="formLabelAlign.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色：" class="role">
                        <span>{{ rolename }}</span>
                    </el-form-item>
                    <el-form-item label="部门：" class="dept">
                        <span>{{ UserInfo.deptName }}</span>
                    </el-form-item>
                    <el-form-item label="团队：" class="team">
                        <span>{{ UserInfo.teamName }}</span>
                    </el-form-item>
                    <el-form-item label="手机：" required prop="tel3">
                        <el-input v-model="formLabelAlign.tel3"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱：" required prop="email3">
                        <el-input v-model="formLabelAlign.email3"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <button @click="resetForm3('formLabelAlign')">取 消</button>
                    <button @click="submitForm3('formLabelAlign')">保存</button>
                </span>
            </el-dialog>
        </div>
        <div class="tabs">
            <el-dialog
                title="修改密码"
                :visible.sync="dialogVisible4"
                width="560px"
                :before-close="handleClose4"
                top="10%"
            >
                <el-form
                    :model="ruleForm"
                    ref="ruleForm"
                    :rules="rulesPass"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <el-form-item label="旧密码" prop="oldPass">
                        <el-input
                            type="password"
                            v-model="ruleForm.oldPass"
                            auto-complete="new-password"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" required prop="pass">
                        <el-input
                            type="password"
                            v-model="ruleForm.pass"
                            auto-complete="new-password"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" required prop="checkPass">
                        <el-input
                            type="password"
                            v-model="ruleForm.checkPass"
                            auto-complete="new-password"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <button @click="resetForm4('ruleForm')">取 消</button>
                    <button @click="submitForm4('ruleForm')">保存</button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
import { getStyle, removeStore } from "../../config/mUtils";
import bus from "../../assets/eventBus";
import { setStore, getStore } from "../../config/mUtils";
import {
    MessageSiteInfo,
    getUserInfo,
    editorUserInfo,
    modifyPassword,
    viewMessage,
    getUserName
} from "../../service/getData";
import { ERR_OK } from "service/config";
import store from "../../store";
import * as types from "../../store/mutation-types";
import { mapGetters,mapMutations} from 'vuex'
export default {
    computed:{
        name() {
            return this.singer.userName
        },
        userId() {
            return this.singer.userId
        },
        userView() {
            return this.singer.userView
        },
        deptLevel() {
            return this.singer.deptLevel
        },
        ...mapGetters([
            'singer'
        ]),
    },
    data() {
        var checkAge = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("请输入电话号码"));
            }
            setTimeout(() => {
                if (!/^1[34578]\d{9}$/.test(value)) {
                    callback(new Error("电话号码输入有误"));
                } else {
                    callback();
                }
            }, 50);
        };
        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                if (this.ruleForm.checkPass !== "") {
                    this.$refs.ruleForm.validateField("checkPass");
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.ruleForm.pass) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            list: [],
            noTi: false,
            totalCount: 0,
            dialogVisible4: false,
            setCenterPermission: false,
            personalPermission: false,
            labelPosition: "right",
            dialogVisible: false,
            dialogVisible3: false,
            UserInfo: "",
            role: [],
            rolename: "",
            rules: {
                tel: [
                    {
                        validator: checkAge,
                        trigger: "blur"
                    }
                ],
                userName: [
                    {
                        required: true,
                        message: "请输入姓名",
                        trigger: "blur"
                    }
                ],
                email3: [
                    {
                        required: true,
                        message: "请输入邮箱号码",
                        trigger: "blur"
                    },
                    {
                        type: "email",
                        message: "请输入正确的邮箱地址",
                        trigger: "blur,change"
                    }
                ],
                tel3: [
                    {
                        validator: checkAge,
                        trigger: "blur"
                    }
                ]
            },
            formLabelAlign: {
                tel: "",
                userName: "",
                tel3: ""
            },
            ruleForm: {
                oldPass: "",
                pass: "",
                checkPass: ""
            },
            rulesPass: {
                oldPass: [
                    {
                        required: true,
                        message: "请输入旧密码",
                        trigger: "blur,change"
                    }
                ],
                pass: [{ validator: validatePass, trigger: "blur" }],
                checkPass: [{ validator: validatePass2, trigger: "blur" }]
            }
        };
    },
    created() {
        if (getStore("token")) {
            this._MessageSiteInfo();
            this._getUserName();
        }
    },
    mounted() {
        bus.$on("tabChange", (msg)=> {
            if (msg == "SUCCESS") {
                this._MessageSiteInfo();
            }
        });
    },
    methods: {

        ...mapMutations({
            // 语法糖映射带setSinger，常量对应类似函数
            setSinger: "SET_SINGER"
        }),
        //      获取姓名
        _getUserName() {
            getUserName().then((res)=> {
                if (res.code == ERR_OK) {
                    this.setSinger(res.data);
                    
                    setStore("userId", res.data.userId);
                    setStore("userName", res.data.userName);
                    setStore("deptId", res.data.deptId);
                    setStore("userView", res.data.userView);
                    setStore("deptLevel", res.data.deptLevel);
                    setStore("isAttendanceAdmin", res.data.isAttendanceAdmin);
                    setStore("isSalaryAdmin", res.data.isSalaryAdmin);
                    setStore("canAddTaskGroup", res.data.canAddTaskGroup);
                }
            });
        },
        skip(row) {
            viewMessage({
                id: row.messageSiteInfoId
            }).then(res => {
                if (res.code == ERR_OK) {
                    this._MessageSiteInfo();
                    
                    if(row.sourceType=='TASK'){
                    
                        this.$router.push({
                        path:'/taskManage/taskDetail',
                        query:{id:row.sourceId}
                        })
                    }
                    if(row.sourceType=='NOTICE'){
                        this.$router.push({
                            path:'/setCenter/noticeDetail',
                            query:{id:row.sourceId}
                        })
                    }
                    if(row.sourceType=='SUMMARY'){
                        let _message = JSON.parse(row.messageContent);
                        console.log(row,_message)
                        this.$router.push({
                            path: "/planSummaryManage/summaryDetail",
                            query: {
                                id: row.sourceId,
                                type: _message.summaryType
                            }
                        })
                    }
                    if(row.sourceType=='PLAN'){
                        let _message = JSON.parse(row.messageContent);
                        console.log(row,_message)
                        this.$router.push({
                            path: "/planSummaryManage/planDetail",
                            query: {
                                id: row.sourceId,
                                type: _message.planType
                            }
                        })
                    }
                    if(row.sourceType=='MERITS'){
                        let _message = JSON.parse(row.messageContent);
                        if (_message.msgType == 'confirmAttendance') {
                            // 待核对考勤
                            this.$router.push({
                                path: "/performanceManage/attendanceDetail",
                                query: {
                                    id: row.sourceId
                                }
                            })
                        } else if (_message.msgType == 'appealAttendance') {
                            // 考勤申诉待处理
                            this.$router.push({
                                path: "/performanceManage/attendanceDetail",
                                query: {
                                    id: row.sourceId
                                }
                            })
                        } else if (_message.msgType == 'sendSalary') {
                            // 工资条发送提醒
                            this.$router.push({
                                path: "/performanceManage/paySlipManage"
                            })
                            
                        }
                    }
                } else {
                    this.$notify.error({
                        title: "提示",
                        message: res.msg
                    });
                }
            });
        },
        question() {
            this.$notify({
                title: "提示",
                message: "绩效管理模块暂未启用！"
            });
        },
        handleClose(done) {
            this.dialogVisible = false;
        },
        _MessageSiteInfo() {
            MessageSiteInfo().then((res)=> {
                if (res.code == ERR_OK) {
                    this.list = res.data.result;
                    this.totalCount = res.data.totalCount;
                    if (res.data.result.length == 0) {
                        this.noTi = true;
                    }
                } else {
                    this.$notify.error({
                        title: "错误",
                        message: res.msg
                    });
                }
            });
        },
        resetForm4(formName) {
            this.dialogVisible4 = false;
            this.$refs[formName].resetFields();
        },
        resetForm3(formName) {
            this.dialogVisible3 = false;
            this.$refs[formName].resetFields();
        },
        submitForm3(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.dialogVisible3 = false;
                    this._editorUserInfo();
                } else {
                    return false;
                }
            });
        },
        _getUserInfo() {
            getUserInfo().then(res => {
                if (res.code == ERR_OK) {
                    this.UserInfo = res.data;
                    this.formLabelAlign.userName = res.data.userName;
                    this.formLabelAlign.tel3 = res.data.telephone;
                    this.formLabelAlign.email3 = res.data.email;
                    this.userId = res.data.userId;
                    this.role = res.data.roleName.split(",");
                    this.rolename = res.data.roleName.split(",").join("+");
                }
            });
        },
        //      更好用户名
        _editorUserInfo() {
            const params = {
                userId: this.userId,
                userName: this.formLabelAlign.userName,
                telephone: this.formLabelAlign.tel3,
                email: this.formLabelAlign.email3
            };
            editorUserInfo(params).then(res => {
                if (res.code == ERR_OK) {
                    this.$notify({
                        title: "成功",
                        message: "修改个人信息成功",
                        type: "success"
                    });
                }
            });
        },
        //      个人信息
        openPersonInfo() {
            this.$router.push({
                path: "/setCenter/userDetail",
                query: { id: this.userId }
            });
        },
        handleClose3(done) {
            this.dialogVisible3 = false;
            this.$refs["formLabelAlign"].resetFields();
        },
        handleClose4() {
            this.dialogVisible4 = false;
            this.$refs["ruleForm"].resetFields();
        },
        //      修改密码
        submitForm4(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const params = {
                        oldPassword: this.ruleForm.oldPass,
                        newPassword: this.ruleForm.checkPass
                    };
                    modifyPassword(params).then(res => {
                        if (res.code == ERR_OK) {
                            this.dialogVisible4 = false;
                            this.$notify({
                                title: "成功",
                                message: "修改密码成功",
                                type: "success"
                            });
                        } else {
                            this.$notify.error({
                                title: "失败",
                                message: res.errorInfoList[0].errorMsg
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        //      确定退出登录
        sureLoginOut() {
            removeStore("token");
            removeStore("userId");
            removeStore("userName");
            removeStore("userView");
            removeStore("deptLevel");
            removeStore("isAttendanceAdmin");
            removeStore("isSalaryAdmin");
            removeStore("canAddTaskGroup");
            this.$router.replace("/login");
            this.dialogVisible = false;
            store.commit(types.LOGIN, { token: null });
            location.reload();
        },
        handleCommand(command) {
            if (command == "setCenter") {
                this.$router.push("/setCenter");
            } else if (command == "personalCenter") {
                this.$router.push({
                    path: "/setCenter/userDetail",
                    query: { id: this.userId }
                });
                //this.openPersonInfo()
            }
            if (command == "modifyPassword") {
                this.dialogVisible4 = true;
            }
            if (command == "loginOut") {
                this.dialogVisible = true;
            }
        },
        handLeft(command) {
            if (command) {
                //          var element=document.getElementById('dowm')
                //          setTimeout(function () {
                //            var left=getStyle(element, 'left');
                //            element.style.left=left+50+"px"
                //          },1)
            }
        },
        handle(command) {
            if (command) {
            }
        },
        
    }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.header {
    background: #d93538;
    @include wh(100%, 50px);
    box-shadow:4px 4px 6px 0px rgba(34,0,1,0.04);
    .tab {
        @include wh(100%, 50px);
        @include cl();
        overflow: hidden;
        background: #d93538;
        
        .tab_left {
            @include wh(360px, 50px);
            float: left;
            .company_logo {
                padding-top: 6px;
                padding-left: 50px;
            }
        }
        .tab_center {
            font-size: 16px;
            @include wh(550px, 50px);
            .tab-item {
                padding: 0 30px;
                .tab-link {
                    padding: 13px 0;
                    cursor: pointer;
                    font-size: 16px;
                    color: #ffffff;
                    display: block;
                }
                &.router-link-active .tab-link {
                    color: #ffd400;
                    font-size: 16px;
                    border-bottom: 4px solid #ffd400;
                }
            }
        }

        .tab_right {
            float: right;
            position: relative;
            @include wh(50%, 50px);
            text-align: right;
            
            .noti {
                display: inline-block;
                padding-left: 120px;
                cursor: pointer;
                vertical-align: middle;
                .el-dropdown {
                    display: block;
                    img {
                        display: block;
                    }
                }
            }
            .icon_personal {
                display: inline-block;
                padding-left: 30px;
                cursor: pointer;
                vertical-align: middle;
                .el-dropdown {
                    display: block;
                    img {
                        display: block;
                    }
                }
            }
            .personal {
                display: inline-block;
                left: 200px;
                cursor: pointer;
                height: 50px;
                line-height: 50px;
                text-align: center;
                font-size: 16px;
                color: #ffffff;
                padding-left: 20px;
                padding-right: 40px;
                vertical-align: middle;
            }
        }
    }
}
.roleName {
    margin-bottom: 10px !important;
}
.role {
    margin-bottom: 0px !important;
}
.dept {
    margin-bottom: 0px !important;
}
.team {
    margin-bottom: 0px !important;
}
.names {
    margin-bottom: 10px !important;
}
#dropdown {
    width: 308px;
    padding: 0;
}
.notices {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    color: #434343;
}
.notice_list li:first-child {
    background: #f1f1f1;
}
.notice_list li {
    height: 35px;
    line-height: 35px;
    cursor: pointer;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    font-size: 10px;
    color: #434343;
    .notice_title {
        display: inline-block;
        width: 200px;
        height: 35px;
        line-height: 35px;
        float: left;
    }
    .notice_time {
        display: inline-block;
        height: 35px;
        font-size: 8px;
        line-height: 35px;
        width: 84px;
        float: right;
        text-align: center;
    }
}
.look_all {
    height: 35px;
    line-height: 35px;
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: #d93538;
    cursor: pointer;
}
#dowm {
    width: 94px !important;
    padding: 0;
    li {
        font-size: 12px;
        color: #434343;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }
}
.notice_not {
    height: 35px;
    line-height: 35px;
    text-align: center;
    font-size: 10px;
    color: #434343;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
