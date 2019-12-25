/**
 * 路由配置
 */
import Vue from 'vue'
import  store from '../store'
import * as types from '../store/mutation-types'
import Router from 'vue-router'
import Layout from "../components/common/Layout";
import {routerMode} from '../config/env'
Vue.use(Router)

const routes=[
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
		children: [
			{
				path: "index",
				name: "index",
				meta: {
					title: "首页",
					icon: "el-icon-web-icon_sy",
					noCache: true
				},
				component: resolve => require(["../page/home/index"], resolve)
			}
		]
  },
  {
		path: "/dailyManage/index",
		redirect: "/dailyManage",
		component: Layout,
		meta: {
			title: "日报管理",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/dailyManage",
				name: "dailyManage",
				meta: {
					title: "日报管理",
					noCache: true
				},
				component: resolve => require(["../page/dailyManage/dailyManage"], resolve)
			}
		]
	},
  {
		path: "/taskManage/index",
		redirect: "/taskManage",
		component: Layout,
		meta: {
			title: "任务管理",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/taskManage",
				name: "taskManage",
				meta: {
					title: "任务管理",
					noCache: true
				},
				component: resolve => require(["../page/taskManage/taskManage"], resolve)
			}
		]
  },
  {
		path: "/postDepartWeekly/index",
		redirect: "/postDepartWeekly",
		component: Layout,
		meta: {
			title: "发起周报",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/postDepartWeekly",
				name: "postDepartWeekly",
				meta: {
					title: "发起周报",
					noCache: true
				},
				component: resolve => require(["../page/weekMange/postDepartWeekly/postDepartWeekly"], resolve)
			}
		]
	},
  {
		path: "/postStaffWeekly/index",
		redirect: "/postStaffWeekly",
		component: Layout,
		meta: {
			title: "发起周报",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/postStaffWeekly",
				name: "postStaffWeekly",
				meta: {
					title: "发起周报",
					noCache: true
				},
				component: resolve => require(["../page/weekMange/postStaffWeekly/postStaffWeekly"], resolve)
			}
		]
  },
  {
		path: "/departmentChild/index",
		redirect: "/departmentChild",
		component: Layout,
		meta: {
			title: "部门管理",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/departmentChild",
				name: "departmentChild",
				meta: {
					title: "部门管理",
					noCache: true
				},
				component: resolve => require(["../page/setCenter/departmentManage/departmentChild"], resolve)
			}
		]
  },
  {
		path: "/addAtendence/index",
		redirect: "/addAtendence",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/addAtendence",
				name: "addAtendence",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/performanceManage/addAtendence"], resolve)
			}
		]
  },
  {
		path: "/weekDetailStaff/index",
		redirect: "/weekDetailStaff",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/weekDetailStaff",
				name: "weekDetailStaff",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/palyManage/weekDetailStaff/weekDetailStaff"], resolve)
			}
		]
  },
  {
		path: "/sureNextPlan/index",
		redirect: "/sureNextPlan",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/sureNextPlan",
				name: "sureNextPlan",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/palyManage/sureNextPlan/sureNextPlan"], resolve)
			}
		]
  },
  {
		path: "/performanceDetail/index",
		redirect: "/performanceDetail",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/performanceDetail",
				name: "performanceDetail",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/performanceManage/performanceDetail"], resolve)
			}
		]
  },
  {
		path: "/weekDetailDepart/index",
		redirect: "/weekDetailDepart",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/weekDetailDepart",
				name: "weekDetailDepart",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/palyManage/weekDetailDepart/weekDetailDepart"], resolve)
			}
		]
  },
  {
    
		path: "/staffWeekDetail/index",
		redirect: "/staffWeekDetail",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/staffWeekDetail",
				name: "staffWeekDetail",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/weekMange/staffWeekDetail/staffWeekDetail"], resolve)
			}
		]
  },
  {
		path: "/staffPersonWeekDetail/index",
		redirect: "/staffPersonWeekDetail",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/staffPersonWeekDetail",
				name: "staffPersonWeekDetail",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/weekMange/staffWeekDetail/staffPersonWeekDetail"], resolve)
			}
		]
  },
  {
		path: "/performanceDept/index",
		redirect: "/performanceDept",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/performanceDept",
				name: "performanceDept",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/performanceManage/performanceDept"], resolve)
			}
		]
  },
  {
		path: "/staffPersonEditor/index",
		redirect: "/staffPersonEditor",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/staffPersonEditor",
				name: "staffPersonEditor",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/weekMange/staffWeekDetail/staffPersonEditor"], resolve)
			}
		]
  },
  {
		path: "/weekManageDepartLeader/index",
		redirect: "/weekManageDepartLeader",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/weekManageDepartLeader",
				name: "weekManageDepartLeader",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/weekMange/weekManageDepartLeader"], resolve)
			}
		]
  },
  {
		path: "/pastPlanWeek/index",
		redirect: "/pastPlanWeek",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/pastPlanWeek",
				name: "pastPlanWeek",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/palyManage/pastPlanWeek/pastPlanWeek"], resolve)
			}
		]
  },
  {
		path: "/pastDepartWeekly/index",
		redirect: "/pastDepartWeekly",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/pastDepartWeekly",
				name: "pastDepartWeekly",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/palyManage/pastDepartWeekly/pastDepartWeekly"], resolve)
			}
		]
  },
  {
		path: "/departWeeklyDetail/index",
		redirect: "/departWeeklyDetail",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/departWeeklyDetail",
				name: "departWeeklyDetail",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/weekMange/departWeeklyDetail/departWeeklyDetail"], resolve)
			}
		]
  },
  {
		path: "/initiateNew/index",
		redirect: "/initiateNew",
		component: Layout,
		meta: {
			title: "发起日报",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/initiateNew",
				name: "initiateNew",
				meta: {
					title: "发起日报",
					noCache: true
				},
				component: resolve => require(["../page/dailyManage/initiateNew"], resolve)
			}
		]
  },
  {
		path: "/dailyDetail/index",
		redirect: "/dailyDetail",
		component: Layout,
		meta: {
			title: "日报详情",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/dailyDetail",
				name: "dailyDetail",
				meta: {
					title: "日报详情",
					noCache: true
				},
				component: resolve => require(["../page/dailyManage/dailyDetail"], resolve)
			}
		]
  },
  {
		path: "/RedHeiBang/index",
		redirect: "/RedHeiBang",
		component: Layout,
		meta: {
			title: "红黑榜",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/RedHeiBang",
				name: "RedHeiBang",
				meta: {
					title: "红黑榜",
					noCache: true
				},
				component: resolve => require(["../page/performanceManage/RedHeiBang"], resolve)
			}
		]
  },
  {
		path: "/weekMange/index",
		redirect: "/weekMange",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/weekMange",
				name: "weekMange",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/weekMange/weekMange"], resolve)
			}
		]
  },
  {
		path: "/reviewWeekly/index",
		redirect: "/reviewWeekly",
		component: Layout,
		meta: {
			title: "审阅个人周报",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/reviewWeekly",
				name: "reviewWeekly",
				meta: {
					title: "审阅个人周报",
					noCache: true
				},
				component: resolve => require(["../page/weekMange/reviewWeekly/reviewWeekly"], resolve)
			}
		]
  },
  {
		path: "/staff/index",
		redirect: "/staff",
		component: Layout,
		meta: {
			title: "审阅个人周报",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/staff",
				name: "staff",
				meta: {
					title: "审阅个人周报",
					noCache: true
				},
				component: resolve => require(["../page/weekMange/pastWeekly/staff"], resolve)
			}
		]
  },
  {
		path: "/pastWeekly/index",
		redirect: "/pastWeekly",
		component: Layout,
		meta: {
			title: "过往周报",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/pastWeekly",
				name: "pastWeekly",
				meta: {
					title: "过往周报",
					noCache: true
				},
				component: resolve => require(["../page/weekMange/pastWeekly/pastWeekly"], resolve)
			}
		]
  },
  {
		path: "/palyManage/index",
		redirect: "/palyManage",
		component: Layout,
		meta: {
			title: "总经理过往周报",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"],
      keepAlive: true
		},
		hidden: true,
		children: [
			{
				path: "/palyManage",
				name: "palyManage",
				meta: {
					title: "总经理过往周报",
					noCache: true
				},
				component: resolve => require(["../page/palyManage/palyManage"], resolve)
			}
		]
  },
  {
		path: "/performanceManage/index",
		redirect: "/performanceManage",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/performanceManage",
				name: "performanceManage",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/performanceManage/performanceManage"], resolve)
			}
		]
  },
  {
		path: "/performanceManageManger/index",
		redirect: "/performanceManageManger",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/performanceManageManger",
				name: "performanceManageManger",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/performanceManage/performanceManageManger"], resolve)
			}
		]
  },
  {
		path: "/modifyPassword/index",
		redirect: "/modifyPassword",
		component: Layout,
		meta: {
			title: "修改密码",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/modifyPassword",
				name: "modifyPassword",
				meta: {
					title: "修改密码",
					noCache: true
				},
				component: resolve => require(["../page/modifyPassword/modifyPassword"], resolve)
			}
		]
  },
  {
		path: "/setCenter/index",
		redirect: "/setCenter",
		component: Layout,
		meta: {
			title: "设置",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/setCenter",
				name: "setCenter",
				meta: {
					title: "设置",
					noCache: true
				},
				component: resolve => require(["../page/setCenter/setCenter"], resolve)
			}
		]
  },
  {
		path: "/personalCenter/index",
		redirect: "/personalCenter",
		component: Layout,
		meta: {
			title: "个人中心",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/personalCenter",
				name: "personalCenter",
				meta: {
					title: "个人中心",
					noCache: true
				},
				component: resolve => require(["../page/personalCenter/personalCenter"], resolve)
			}
		]
  },
  {
		path: "/role/index",
		redirect: "/role",
		component: Layout,
		meta: {
			title: "角色",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/role",
				name: "role",
				meta: {
					title: "角色",
					noCache: true
				},
				component: resolve => require(["../page/setCenter/role/role"], resolve)
			}
		]
  },
  {
		path: "/addRole/index",
		redirect: "/addRole",
		component: Layout,
		meta: {
			title: "新增角色",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/addRole",
				name: "addRole",
				meta: {
					title: "新增角色",
					noCache: true
				},
				component: resolve => require(["../page/setCenter/role/addRole/addRole"], resolve)
			}
		]
  },
  {
		path: "/editorRole/index",
		redirect: "/editorRole",
		component: Layout,
		meta: {
			title: "编辑角色",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/editorRole",
				name: "editorRole",
				meta: {
					title: "编辑角色",
					noCache: true
				},
				component: resolve => require(["../page/setCenter/role/editorRole/editorRole"], resolve)
			}
		]
  },
  {
		path: "/roleDetail/index",
		redirect: "/roleDetail",
		component: Layout,
		meta: {
			title: "角色详情",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/roleDetail",
				name: "roleDetail",
				meta: {
					title: "角色详情",
					noCache: true
				},
				component: resolve => require(["../page/setCenter/role/roleDetail/roleDetail"], resolve)
			}
		]
  },
  {
		path: "/remindManage/index",
		redirect: "/remindManage",
		component: Layout,
		meta: {
			title: "提醒管理",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
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
				component: resolve => require(["../page/remindManage/remindManage"], resolve)
			}
		]
  },
  {
		path: "/departmentManage/index",
		redirect: "/departmentManage",
		component: Layout,
		meta: {
			title: "部门管理",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/departmentManage",
				name: "departmentManage",
				meta: {
					title: "部门管理",
					noCache: true
				},
				component: resolve => require(["../page/setCenter/departmentManage/departmentManage"], resolve)
			}
		]
  },
  {
		path: "/noticeManage/index",
		redirect: "/noticeManage",
		component: Layout,
		meta: {
			title: "公告管理",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/noticeManage",
				name: "noticeManage",
				meta: {
					title: "公告管理",
					noCache: true
				},
				component: resolve => require(["../page/setCenter/noticeManage/noticeManage"], resolve)
			}
		]
  },
  {
		path: "/taskDetail/index",
		redirect: "/taskDetail",
		component: Layout,
		meta: {
			title: "任务详情",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/taskDetail",
				name: "taskDetail",
				meta: {
					title: "任务详情",
					noCache: true
				},
				component: resolve => require(["../page/taskManage/taskDetail/taskDetail"], resolve)
			}
		]
  },
  {
		path: "/taskDetailHeader/index",
		redirect: "/taskDetailHeader",
		component: Layout,
		meta: {
			title: "任务详情",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/taskDetailHeader",
				name: "taskDetailHeader",
				meta: {
					title: "任务详情",
					noCache: true
				},
				component: resolve => require(["../page/taskManage/taskDetail/taskDetailHeader"], resolve)
			}
		]
  },
  {
		path: "/taskDetailManage/index",
		redirect: "/taskDetailManage",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/taskDetailManage",
				name: "taskDetailManage",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/taskManage/taskDetail/taskDetailManage"], resolve)
			}
		]
  },
  {
		path: "/noticeDetail/index",
		redirect: "/noticeDetail",
		component: Layout,
		meta: {
			title: "公告管理",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/noticeDetail",
				name: "noticeDetail",
				meta: {
					title: "公告管理",
					noCache: true
				},
				component: resolve => require(["../page/setCenter/noticeManage/noticeDetail/noticeDetail"], resolve)
			}
		]
  },
  {
		path: "/wagesDetail/index",
		redirect: "/wagesDetail",
		component: Layout,
		meta: {
			title: "工资条详情",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/wagesDetail",
				name: "wagesDetail",
				meta: {
					title: "工资条详情",
					noCache: true
				},
				component: resolve => require(["../page/performanceManage/wagesDetail"], resolve)
			}
		]
  },
  {
		path: "/rewardManage/index",
		redirect: "/rewardManage",
		component: Layout,
		meta: {
			title: "奖惩管理",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/rewardManage",
				name: "rewardManage",
				meta: {
					title: "奖惩管理",
					noCache: true
				},
				component: resolve => require(["../page/setCenter/rewardManage/rewardManage"], resolve)
			}
		]
  },
  {
		path: "/taskGrounpManage/index",
		redirect: "/taskGrounpManage",
		component: Layout,
		meta: {
			title: "任务组管理",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/taskGrounpManage",
				name: "taskGrounpManage",
				meta: {
					title: "任务组管理",
					noCache: true
				},
				component: resolve => require(["../page/setCenter/taskGrounpManage/taskGrounpManage"], resolve)
			}
		]
  },
  {
		path: "/projectManage/index",
		redirect: "/projectManage",
		component: Layout,
		meta: {
			title: "项目管理",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/projectManage",
				name: "projectManage",
				meta: {
					title: "项目管理",
					noCache: true
				},
				component: resolve => require(["../page/setCenter/projectManage/projectManage"], resolve)
			}
		]
  },
  {
		path: "/departmentDetail/index",
		redirect: "/departmentDetail",
		component: Layout,
		meta: {
			title: "部门详情",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/departmentDetail",
				name: "departmentDetail",
				meta: {
					title: "部门详情",
					noCache: true
				},
				component: resolve => require(["../page/setCenter/departmentManage/departmentDetail/departmentDetail"], resolve)
			}
		]
  },
  {
		path: "/teamDetail/index",
		redirect: "/teamDetail",
		component: Layout,
		meta: {
			title: "团队详情",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/teamDetail",
				name: "teamDetail",
				meta: {
					title: "团队详情",
					noCache: true
				},
				component: resolve => require(["../page/setCenter/teamManage/teamDetail/teamDetail"], resolve)
			}
		]
  },
  {
		path: "/staffDetail/index",
		redirect: "/staffDetail",
		component: Layout,
		meta: {
			title: "员工详情",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/staffDetail",
				name: "staffDetail",
				meta: {
					title: "员工详情",
					noCache: true
				},
				component: resolve => require(["../page/setCenter/staffDetail/staffDetail"], resolve)
			}
		]
  },
  {
		path: "/userDetail/index",
		redirect: "/userDetail",
		component: Layout,
		meta: {
			title: "员工详情",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/userDetail",
				name: "userDetail",
				meta: {
					title: "员工详情",
					noCache: true
				},
				component: resolve => require(["../page/setCenter/staffDetail/userDetail/userDetail"], resolve)
			}
		]
  },
  {
		path: "/myDetail/index",
		redirect: "/myDetail",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/myDetail",
				name: "myDetail",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/setCenter/staffDetail/userDetail/myDetail"], resolve)
			}
		]
  },
  {
		path: "/weeklyTime/index",
		redirect: "/weeklyTime",
		component: Layout,
		meta: {
			title: "周报时间",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/weeklyTime",
				name: "weeklyTime",
				meta: {
					title: "周报时间",
					noCache: true
				},
				component: resolve => require(["../page/setCenter/weeklyTime/weeklyTime"], resolve)
			}
		]
  },
  {
		path: "/teamManage/index",
		redirect: "/teamManage",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/teamManage",
				name: "teamManage",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/setCenter/teamManage/teamManage"], resolve)
			}
		]
  },
  {
		path: "/taskManageManager/index",
		redirect: "/taskManageManager",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"],
      keepAlive: true
		},
		hidden: true,
		children: [
			{
				path: "/taskManageManager",
				name: "taskManageManager",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/taskManage/taskManageManager"], resolve)
			}
		]
  },
  {
		path: "/taskDepartHeader/index",
		redirect: "/taskDepartHeader",
		component: Layout,
		meta: {
			title: "XXXX",
			icon: "el-icon-web-icon_fx",
			roles: ["fxkz1"]
		},
		hidden: true,
		children: [
			{
				path: "/taskDepartHeader",
				name: "taskDepartHeader",
				meta: {
					title: "XXXX",
					noCache: true
				},
				component: resolve => require(["../page/taskManage/taskDepartHeader"], resolve)
			}
		]
  }
  
]
const router = new Router({
  routes:routes,
  scrollBehavior (to, from, savedPosition) {
    //console.log(to,savedPosition)
    if (savedPosition) {
      return new Promise((resolve, reject) => {
        if(to.path=='/taskManageManager') {
          setTimeout(() => {
            resolve(savedPosition)
          }, 2000)
        }else if(to.path=='/taskDepartHeader') {
          setTimeout(() => {
            resolve(savedPosition)
          }, 800)
        }
        else {
          setTimeout(() => {
            resolve(savedPosition)
          }, 500)
        }
      })
    } else {
      return { x: 0, y: 0 }
    }
  }
});
// 页面刷新时，重新赋值token
 if (window.localStorage.getItem('token')) {
   store.commit(types.LOGIN,{token: window.localStorage.getItem('token')})
   //console.log(store.state.token.token);
   //store.dispatch('roles',store.state.token.token)
 }
router.beforeEach(({meta, path}, from, next) => {
  const {auth = true} = meta      // meta代表的是to中的meta对象，path代表的是to中的path对象
  //console.log(store.state.singer.userView);
  var isLogin = Boolean(store.state.token.token)    // true用户已登录， false用户未登录　
  if (auth  &&  !isLogin  &&  path !== '/login') {   // auth 代表需要通过用户身份验证，默认为true，代表需要被验证， false为不用检验
    return next({ path: '/login' })   //  跳转到login页面
  }else{
    next()   // 进行下一个钩子函数
  }

})
export default router;
