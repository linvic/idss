/**
 * 路由配置
 */
import Vue from "vue";
import store from "../store";
import * as types from "../store/mutation-types";
import Router from "vue-router";
import Layout from "../components/common/Layout";
import { routerMode } from "../config/env";
Vue.use(Router);

const routes = [
    {
        path: "/login",
        name: "login",
        component: resolve => require(["../page/login/login"], resolve)
    },
    // //首页路由
    {
        path: "",
        redirect: "index",
        component: Layout,
        meta: {
            title: "首页",
            roles: 'INDEX'
        },
        children: [
            {
                path: "index",
                name: "index",
                meta: {
                    title: "首页",
                    icon: "el-icon-s-home",
                    noCache: true
                },
                component: resolve => require(["../page/home/index"], resolve)
            }
        ]
    },
    // 任务管理
    {
        path: "",
        redirect: "taskManage",
        component: Layout,
        meta: {
            title: "任务管理",
            icon: "el-icon-s-opportunity",
            roles: 'TASK'
        },
        hidden: false,
        children: [
            {
                path: "taskManage/taskManage",
                name: "taskManageList",
                meta: {
                    title: "任务管理",
                    icon: "el-icon-s-opportunity",
                    noCache: true
                },
                hidden: false,
                component: resolve =>
                    require(["../page/taskManage/taskManage"], resolve)
            },
            {
                path: "/taskManage/taskDetail",
                name: "taskManageDetail",
                meta: {
                    title: "任务详情",
                    noCache: true
                },
                hidden: true,
                component: resolve =>
                    require(["../page/taskManage/taskDetail"], resolve)
            }
        ]
    },
    
    //   计划总结管理
    {
        path: "/planSummaryManage/index",
        redirect: "/planSummaryManage",
        component: Layout,
        meta: {
            title: "计划总结管理",
            roles: 'PLAN',
            icon: "el-icon-s-order"
        },
        hidden: false,
        children: [
            {
                path: "/planSummaryManage/planManage",
                name: "planManage",
                meta: {
                    title: "计划管理",
                    noCache: true
                },
                hidden: false,
                component: resolve =>
                    require(["../page/planSummaryManage/planManage"], resolve)
            },
            
            {
                path: "/planSummaryManage/planPersonal",
                name: "planPersonal",
                meta: {
                    title: "个人计划",
                    noCache: true
                },
                hidden: true,
                component: resolve =>
                    require(["../page/planSummaryManage/planPersonal"], resolve)
            },
            {
                path: "/planSummaryManage/planDept",
                name: "planDept",
                meta: {
                    title: "部门计划",
                    noCache: true
                },
                hidden: true,
                component: resolve =>
                    require(["../page/planSummaryManage/planDept"], resolve)
            },
            {
                path: "/planSummaryManage/planDetail",
                name: "planDetail",
                meta: {
                    title: "计划详情",
                    noCache: true
                },
                hidden: true,
                component: resolve =>
                    require(["../page/planSummaryManage/planDetail"], resolve)
            },
            {
                path: "/planSummaryManage/planAudit",
                name: "planAudit",
                meta: {
                    title: "审核计划",
                    noCache: true
                },
                hidden: true,
                component: resolve =>
                    require(["../page/planSummaryManage/planAudit"], resolve)
            },
            {
                path: "/planSummaryManage/summaryManage",
                name: "summaryManage",
                meta: {
                    title: "总结管理",
                    noCache: true
                },
                hidden: false,
                component: resolve =>
                    require(["../page/planSummaryManage/summaryManage"], resolve)
            },
            {
                path: "/planSummaryManage/summaryPersonal",
                name: "summaryPersonal",
                meta: {
                    title: "个人总结",
                    noCache: true
                },
                hidden: true,
                component: resolve =>
                    require(["../page/planSummaryManage/summaryPersonal"], resolve)
            },
            {
                path: "/planSummaryManage/summaryDept",
                name: "summaryDept",
                meta: {
                    title: "部门总结",
                    noCache: true
                },
                hidden: true,
                component: resolve =>
                    require(["../page/planSummaryManage/summaryDept"], resolve)
            },
            {
                path: "/planSummaryManage/summaryDetail",
                name: "summaryDetail",
                meta: {
                    title: "总结详情",
                    noCache: true
                },
                hidden: true,
                component: resolve =>
                    require(["../page/planSummaryManage/summaryDetail"], resolve)
            },
            {
                path: "/planSummaryManage/summaryAudit",
                name: "summaryAudit",
                meta: {
                    title: "审核总结",
                    noCache: true
                },
                hidden: true,
                component: resolve =>
                    require(["../page/planSummaryManage/summaryAudit"], resolve)
            },
            {
                path: "/planSummaryManage/summaryHandle",
                name: "summaryHandle",
                meta: {
                    title: "处理申诉",
                    noCache: true
                },
                hidden: true,
                component: resolve =>
                    require(["../page/planSummaryManage/summaryHandle"], resolve)
            },
            
            {
                path: "/planSummaryManage/allPlanSummary",
                name: "allPlanSummary",
                meta: {
                    title: "全部计划总结",
                    userViews: ['MANAGER','DEPT'],
                    noCache: true
                },
                hidden: true,
                component: resolve =>
                    require(["../page/planSummaryManage/allPlanSummary"], resolve)
            },
            
        ]
    },

    //   绩效管理
    {
        path: "/performanceManage/index",
        redirect: "/performanceManage",
        component: Layout,
        meta: {
            title: "绩效管理",
            roles: 'MERITS',
            icon: "el-icon-s-order"
        },
        hidden: false,
        children: [
            
            {
                path: "/performanceManage/performanceManage",
                name: "performanceManage",
                meta: {
                    title: "绩效管理",
                    noCache: true
                },
                hidden: false,
                component: resolve =>
                    require(["../page/performanceManage/performanceManage"], resolve)
            },
            
            {
                path: "/performanceManage/attendanceManage",
                name: "attendanceManage",
                meta: {
                    title: "考勤管理",
                    noCache: true
                },
                hidden: false,
                component: resolve =>
                    require(["../page/performanceManage/attendanceManage"], resolve)
            },
            {
                path: "/performanceManage/attendanceAdd",
                name: "attendanceAdd",
                meta: {
                    title: "添加考勤",
                    noCache: true
                },
                hidden: true,
                component: resolve =>
                    require(["../page/performanceManage/attendanceAdd"], resolve)
            },
            {
                path: "/performanceManage/attendanceCheck",
                name: "attendanceCheck",
                meta: {
                    title: "核对考勤",
                    noCache: true
                },
                hidden: true,
                component: resolve =>
                    require(["../page/performanceManage/attendanceCheck"], resolve)
            },
            {
                path: "/performanceManage/attendanceAudit",
                name: "attendanceAudit",
                meta: {
                    title: "审核考勤",
                    noCache: true
                },
                hidden: true,
                component: resolve =>
                    require(["../page/performanceManage/attendanceAudit"], resolve)
            },
            {
                path: "/performanceManage/attendanceDetail",
                name: "attendanceDetail",
                meta: {
                    title: "考勤详情",
                    noCache: true
                },
                hidden: true,
                component: resolve =>
                    require(["../page/performanceManage/attendanceDetail"], resolve)
            },
            
            {
                path: "/performanceManage/paySlipManage",
                name: "paySlipManage",
                meta: {
                    title: "工资条管理",
                    noCache: true
                },
                hidden: false,
                component: resolve =>
                    require(["../page/performanceManage/paySlipManage"], resolve)
            },
            {
                path: "/performanceManage/paySlipEditor",
                name: "paySlipEditor",
                meta: {
                    title: "工资条编辑",
                    noCache: true
                },
                hidden: true,
                component: resolve =>
                    require(["../page/performanceManage/paySlipEditor"], resolve)
            },
            {
                path: "/performanceManage/paySlipDetail",
                name: "paySlipDetail",
                meta: {
                    title: "工资条详情",
                    noCache: true
                },
                hidden: true,
                component: resolve =>
                    require(["../page/performanceManage/paySlipDetail"], resolve)
            },
            
            
        ]
    },

    
    {
        path: "/modifyPassword/index",
        redirect: "/modifyPassword",
        component: Layout,
        hidden: true,
        children: [
            {
                path: "/modifyPassword",
                name: "modifyPassword",
                meta: {
                    title: "修改密码",
                    noCache: true
                },
                component: resolve =>
                    require(["../page/modifyPassword/modifyPassword"], resolve)
            }
        ]
    },
    {
        path: "/personalCenter/index",
        redirect: "/personalCenter",
        component: Layout,
        hidden: true,
        children: [
            {
                path: "/personalCenter",
                name: "personalCenter",
                meta: {
                    title: "个人中心",
                    noCache: true
                },
                component: resolve =>
                    require(["../page/personalCenter/personalCenter"], resolve)
            }
        ]
    },
    
    {
        path: "/remindManage/index",
        redirect: "/remindManage",
        component: Layout,
        meta: {
            title: "提醒管理",
            icon: "el-icon-web-icon_fx"
        },
        hidden: true,
        children: [
            {
                path: "/remindManage",
                name: "remindManage",
                meta: {
                    title: "提醒管理",
                    noCache: true
                },
                component: resolve =>
                    require(["../page/remindManage/remindManage"], resolve)
            }
        ]
    },

    // 系统设置
    {
        path: "",
        redirect: "setCenter",
        component: Layout,
        meta: {
            title: "系统设置",
            roles: 'SYS'
        },
        hidden: false,
        children: [
            {
                path: "setCenter",
                name: "setCenter",
                meta: {
                    title: "系统设置",
                    icon: "el-icon-s-tools",
                    noCache: true
                },
                hidden: false,
                component: resolve => require(["../page/setCenter/setCenter"], resolve)
            },
            {
                path: "/setCenter/departmentManage",
                name: "setCenterDepartmentManage",
                meta: {
                    title: "部门管理",
                    noCache: true
                },
                hidden: true,
                component: resolve => require(["../page/setCenter/departmentManage/departmentManage"], resolve)
            },
            {
                path: "/setCenter/departmentDetail",
                name: "setCenterDepartmentDetail",
                meta: {
                    title: "部门详情",
                    noCache: true
                },
                hidden: true,
                component: resolve => require(["../page/setCenter/departmentManage/departmentDetail/departmentDetail"], resolve)
            },
            {
                path: "/setCenter/departmentChild",
                name: "setCenterDepartmentChild",
                meta: {
                    title: "部门管理",
                    noCache: true
                },
                hidden: true,
                component: resolve => require(["../page/setCenter/departmentManage/departmentChild"], resolve)
            },
            // 角色
            {
                path: "/setCenter/role",
                name: "setCenterRole",
                meta: {
                    title: "角色",
                    noCache: true
                },
                hidden: true,
                component: resolve => require(["../page/setCenter/role/role"], resolve)
            },
            {
                path: "/setCenter/addRole",
                name: "setCenterAddRole",
                meta: {
                    title: "角色新增",
                    noCache: true
                },
                hidden: true,
                component: resolve => require(["../page/setCenter/role/addRole/addRole"], resolve)
            },
            {
                path: "/setCenter/editorRole",
                name: "setCenterEditorRole",
                meta: {
                    title: "角色编辑",
                    noCache: true
                },
                hidden: true,
                component: resolve => require(["../page/setCenter/role/editorRole/editorRole"], resolve)
            },
            {
                path: "/setCenter/roleDetail",
                name: "setCenterRoleDetail",
                meta: {
                    title: "角色详情",
                    noCache: true
                },
                hidden: true,
                component: resolve => require(["../page/setCenter/role/roleDetail/roleDetail"], resolve)
            },
            // 员工
            {
                path: "/setCenter/staffDetail",
                name: "setCenterStaffDetail",
                meta: {
                    title: "员工管理",
                    noCache: true
                },
                hidden: true,
                component: resolve => require(["../page/setCenter/staffDetail/staffDetail"], resolve)
            },
            {
                path: "/setCenter/userDetail",
                name: "setCenterUserDetail",
                meta: {
                    title: "员工详情",
                    noCache: true
                },
                hidden: true,
                component: resolve => require(["../page/setCenter/staffDetail/userDetail/userDetail"], resolve)
            },
            // 团队管理
            {
                path: "/setCenter/teamManage",
                name: "setCenterTeamManage",
                meta: {
                    title: "团队管理",
                    noCache: true
                },
                hidden: true,
                component: resolve => require(["../page/setCenter/teamManage/teamManage"], resolve)
            },
            // 项目管理
            {
                path: "/setCenter/projectManage",
                name: "setCenterProjectManage",
                meta: {
                    title: "项目管理",
                    noCache: true
                },
                hidden: true,
                component: resolve => require(["../page/setCenter/projectManage/projectManage"], resolve)
            },
            // 任务类别管理
            {
                path: "/setCenter/taskGrounpManage",
                name: "setCenterTaskGrounpManage",
                meta: {
                    title: "任务类别管理",
                    noCache: true
                },
                hidden: true,
                component: resolve => require(["../page/setCenter/taskGrounpManage/taskGrounpManage"], resolve)
            },
            // 奖惩管理
            {
                path: "/setCenter/rewardManage",
                name: "setCenterRewardManage",
                meta: {
                    title: "奖惩管理",
                    noCache: true
                },
                hidden: true,
                component: resolve => require(["../page/setCenter/rewardManage/rewardManage"], resolve)
            },
            // 公告管理
            {
                path: "/setCenter/noticeManage",
                name: "setCenterNoticeManage",
                meta: {
                    title: "公告管理",
                    noCache: true
                },
                hidden: true,
                component: resolve => require(["../page/setCenter/noticeManage/noticeManage"], resolve)
            },
            {
                path: "/setCenter/noticeDetail",
                name: "setCenterNoticeDetail",
                meta: {
                    title: "公告详情",
                    noCache: true
                },
                hidden: true,
                component: resolve => require(["../page/setCenter/noticeManage/noticeDetail/noticeDetail"], resolve)
            },

            {
                path: "/setCenter/planSummaryManage",
                name: "setCenterPlanSummaryManage",
                meta: {
                    title: "计划总结管理",
                    noCache: true
                },
                hidden: true,
                component: resolve => require(["../page/setCenter/planSummaryManage/planSummaryManage"], resolve)
            },
            {
                path: "/setCenter/examineGroupsManage",
                name: "setCenterExamineGroupsManage",
                meta: {
                    title: "考核组管理",
                    noCache: true
                },
                hidden: true,
                component: resolve => require(["../page/setCenter/examineGroupsManage/examineGroupsManage"], resolve)
            },
            {
                path: "/setCenter/attendancesManage",
                name: "setCenterAttendancesManage",
                meta: {
                    title: "考勤管理",
                    noCache: true
                },
                hidden: true,
                component: resolve => require(["../page/setCenter/attendancesManage/attendancesManage"], resolve)
            },
            
            

            
            
            
        ]
    },
];
const router = new Router({
    routes: routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return new Promise((resolve, reject) => {
                if (to.path == "/taskManageManager") {
                    setTimeout(() => {
                        resolve(savedPosition);
                    }, 2000);
                } else if (to.path == "/taskDepartHeader") {
                    setTimeout(() => {
                        resolve(savedPosition);
                    }, 800);
                } else {
                    setTimeout(() => {
                        resolve(savedPosition);
                    }, 500);
                }
            });
        } else {
            return { x: 0, y: 0 };
        }
    }
});
// 页面刷新时，重新赋值token
if (window.localStorage.getItem("token")) {
    store.commit(types.LOGIN, { token: window.localStorage.getItem("token") });
    //console.log(store.state.token.token);
    //store.dispatch('roles',store.state.token.token)
}
router.beforeEach(({ meta, path }, from, next) => {
    const { auth = true } = meta; // meta代表的是to中的meta对象，path代表的是to中的path对象
    //console.log(store.state.singer.userView);
    var isLogin = Boolean(store.state.token.token); // true用户已登录， false用户未登录
    if (auth && !isLogin && path !== "/login") {
        // auth 代表需要通过用户身份验证，默认为true，代表需要被验证， false为不用检验
        return next({ path: "/login" }); //  跳转到login页面
    } else {
        next(); // 进行下一个钩子函数
    }
});
export default router;
