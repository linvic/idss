import {fetchGet,fetchPost,fetchPut,fetchFilePost,fetchDownloadFileGet} from 'config/fetch'
function param(params){
  const commonParams = {
    token:localStorage.getItem('token')
  }
  return Object.assign({}, commonParams,params )
}
/**  项目所有的请求写在这里并导出 */
//  获取图片验证码接口
export function captcha(){
  const url='LoginController/captcha?data='+new Date().getTime();
  return url
}
//登录接口
export function login(params){
  return fetchPost('/LoginController/login', params)
}
//获取用户菜单权限
export function loadMenuResources(params){
  return fetchPost('/sysResource/loadMenuResources',param(params))
}
//获取ResourceNo下用户所有操作权限
export function listOperFuns(params){
  return fetchPost('/sysResource/listOperFuns',param(params))
}
//部门列表
export function departmentList(params){
  return fetchGet('/sysDept/list',param(params))
}
// 获取所有一级部门
export function getParentDepts(params){
  return fetchGet('/sysDept/getParentDepts',param(params))
}
//二级部门
export function listChildrenDepts(params){
  return fetchGet('/sysDept/listChildrenDepts',param(params))
}
// 获取自身及下级部门
export function getChildDepts(params){
  return fetchGet('/sysDept/getChildDepts',param(params))
}
//部门负责人列表
export function listAllUsers(params){
  return fetchPost('/sysUser/listAllUsers',param(params))
}

//执行人人列表
export function listTaskExecutors(params){
  return fetchPost('/sysUser/listTaskExecutors',param(params))
}

//部门详情
export function getTeamDetail(params){
  return fetchGet('/sysTeam/getById',param(params))
}

//部门详情
export function departmentDetail(params){
  return fetchGet('/sysDept/getById',param(params))
}
//添加部门
export function addDepartment(params){
  return fetchPost('/sysDept/add',param(params))
}
//删除部门
export function deleteDepartment(params){
  return fetchPost('/sysDept/delete',param(params))
}
//获取部门详细信息
export function getDepartment(params){
  return fetchGet('/sysDept/getById',param(params))
}
//编辑部门
export function editorDepartment(params){
  return fetchPost('/sysDept/updateV2',param(params))
}
//获取首页必读公告
export function noticeInfo(params){
  return fetchGet('/noticeInfo/listMyMustreadNotice',param(params))
}
//首页公告回复
export function noticeSns(params){
  return fetchPost('/noticeSns/publishPersonNoticeSns',param(params))
}
//消息管理
export function MessageSiteInfo(params){
  return fetchGet('/MessageSiteInfo/listIndex',param(params))
}
//发送消息到服务端
export function viewMessage(params){
  return fetchGet('/MessageSiteInfo/viewMessage',param(params))
}
//消息管理（已读消息和未读消息）
export function totalNews(params){
  return fetchGet('/MessageSiteInfo/listPersonMessage',param(params))
}

// 获取奖惩类型列表
export function getRewardList(params){
  return fetchGet('/sysRpAmount/rpType/list',param(params))
}
//获取金额
export function getRpAmountByType(params){
  return fetchGet('/sysRpAmount/getRpAmountByType',param(params))
}
//添加奖惩
export function perfmRpRecordAdd(params){
  return fetchPost('/perfmRpRecord/add',param(params))
}
// 获取奖惩类型列表
export function deleteRewardList(params){
  return fetchPost('/sysRpAmount/rpType/delete',param(params))
}
// 创建奖惩类型
export function addRewardType(params){
  return fetchPost('/sysRpAmount/rpType/add',param(params))
}
//获取奖惩金额详细信息
export function getRewardMoney(params){
  return fetchGet('/sysRpAmount/rpType/getById',param(params))
}
// 编辑奖惩类型详细信息
export function editorRewardType(params){
  return fetchPost('/sysRpAmount/rpType/update',param(params))
}
// 点击编辑奖惩金额类型
export function clickEditorMoney(params){
  return fetchGet('/sysRpAmount/rpAmount/getById',param(params))
}
// 点击保存编辑奖惩金额类型
export function sureEditorMoney(params){
  return fetchPost('/sysRpAmount/rpAmount/update',param(params))
}
// 创建奖惩类型详细信息
export function createRewardType(params){
  return fetchPost('/sysRpAmount/rpAmount/add',param(params))
}

// 周报时间list
export function weeklyTimeList(params){
  return fetchGet('/sysWeeklyCycle/list',param(params))
}
// 保存周报时间list
export function preserveWeeklyTime(params){
  return fetchPost('/sysWeeklyCycle/update',param(params))
}

// 保存周报设置时间list
export function updateWeeklySetUp(params){
  return fetchPost('sysWeeklyCycle/updateWeeklySetUp',param(params))
}

// 保存周报设置时间list(部门周报)
export function updateDeptWeeklySetUp(params){
  return fetchPost('sysWeeklyCycle/updateDeptWeeklySetUp',param(params))
}
// 保存周报设置时间list(公司计划)
export function updateCompanyWeeklySetUp(params){
  return fetchPost('sysWeeklyCycle/updateCompanyWeeklySetUp',param(params))
}

// 保存日报时间list
export function updateDailySetUp(params){
  return fetchPost('/sysWeeklyCycle/updateDailySetUp',param(params))
}

/*角色管理模块 */
// 获取角色权限
export function getRoleResource(params){
  return fetchGet('/sysResource/getAllRes',param(params))
}
//新增角色
export function addRole(params){
  return fetchPost('/sysRole/add',param(params))
}
// 点击编辑角色
export function editorRoleList(params){
  return fetchGet('/sysRole/getById',param(params))
}
// 获取角色list
export function getRoleList(params){
  return fetchGet('/sysRole/list',param(params))
}
// 删除角色list
export function deletRoleList(params){
  return fetchPost('/sysRole/delete',param(params))
}
//更新角色
export function updateRole(params){
  return fetchPost('/sysRole/update',param(params))
}
//更新角色
export function getRoleDetail(params){
  return fetchGet('/sysRole/getAllRole',param(params))
}
//获取当前人姓名
export function getUserName(params){
  return fetchGet('/LoginController/getLoginUser',param(params))
}
// 获取员工list
export function getUserList(params){
  return fetchPost('/sysUser/list',param(params))
}
// 新增员工
export function addUserDetail(params){
  return fetchPost('/sysUser/add',param(params))
}
// 获取员工详情
export function getUserDetail(params){
  return fetchGet('/sysUser/getById',param(params))
}
// 获取员工详情(其他任务)
export function getStaffAssisTask1(params){
  return fetchGet('/taskInfo/getOtherTask',param(params))
}
// 获取员工详情(我协助的)
export function getStaffAssisTask(params){
  return fetchGet('/taskInfo/getStaffAssisTask',param(params))
}
// 获取个人信息
export function getUserInfo(params){
  return fetchGet('/sysUser/getOwnMessage',param(params))
}
// 修改个人信息
export function editorUserInfo(params){
  return fetchPost('/sysUser/updateBasicMessage',param(params))
}
// 校验用户名
export function checkUsername(params){
  return fetchPost('/sysUser/checkUsername',param(params))
}
// 编辑员工详情
export function editorUserDetail(params){
  return fetchPost('/sysUser/update',param(params))
}
// 删除该员工
export function deleteUserList(params){
  return fetchPost('/sysUser/delete',param(params))
}
//修改密码
/**修改密码**/
export function modifyPassword(params){
  return fetchPost('/LoginController/updatePassword',param(params))
}
//公告管理
/**公告管理list**/
export function noticeList(params){
  return fetchGet('/noticeInfo/list',param(params))
}
/**删除公告管理list**/
export function deleteNoticeList(params){
  return fetchPost('/noticeInfo/delete',param(params))
}
/**公告管理list**/
export function getNoticeDetail(params){
  return fetchGet('/noticeInfo/getById',param(params))
}
/**获取公告评论列表**/
export function getNoticeComment(params){
  return fetchGet('/noticeSns/listNoticeSnses',param(params))
}
/**发表公告评论**/
export function reportNoticeComment(params){
  return fetchPost('/noticeSns/publishPersonNoticeSns',param(params))
}
/**创建公告管理**/
export function addNoticeList(params){
  return fetchPost('/noticeInfo/publishNotice',param(params))
}
//团队管理
/**添加团队**/
export function addTeam(params){
  return fetchPost('/sysTeam/add',param(params))
}
/**获取团队列表**/
export function getTeamList(params){
  return fetchGet('/sysTeam/list',param(params))
}
/**删除团队**/
export function  deleteTeam(params){
  return fetchPost('/sysTeam/delete',param(params))
}
/**编辑团队**/
export function update(params){
  return fetchPost('/sysTeam/update',param(params))
}
/**获取部门下面所有的成员过滤已经在团队的成员**/
export function getDptUserInfo(params){
  return fetchGet('/sysTeam/getDptUserInfoByTeamId',param(params))
}
/**获取团队下面所有的成员**/
export function getTeamUserInfo(params){
  return fetchPost('/sysUser/list',param(params))
}
/**删除团队成员/sysTeam/deleteTeamUsers**/
export function deleteTeamUsers(params){
  return fetchPost('/sysTeam/deleteTeamUsers',param(params))
}
/**添加团队成员**/
export function addTeamUsers(params){
  return fetchPost('/sysTeam/addTeamUsers',param(params))
}
//项目管理
/**获取项目列表**/
export function getProjectList(params){
  return fetchGet('/projectInfo/list',param(params))
}
/**添加项目**/
export function addProject(params){
  return fetchPost('/projectInfo/add',param(params))
}
/**编辑项目**/
export function updateProject(params){
  return fetchPost('/projectInfo/update',param(params))
}
/**删除项目**/
export function deleteProject(params){
  return fetchPost('/projectInfo/delete',param(params))
}
//任务组管理模块
/**添加任务组**/
export function addTaskGroup(params){
  return fetchPost('/taskGroup/add',param(params))
}
export function taskGroupgetById(params){
  return fetchGet('/taskGroup/getById/',param(params))
}
export function taskTypeupdate(params){
  return fetchPost('taskType/update',param(params))
}
/**删除任务组**/
export function deleteTaskGroup(params){
  return fetchPost('/taskGroup/delete',param(params))
}
/**获取任务组列表**/
export function getTaskGroupList(params){
  return fetchGet('/taskGroup/getAllTaskGroup',param(params))
}
/**编辑任务组信息**/
export function updateTaskGroup(params){
  return fetchPost('/taskGroup/update',param(params))
}
/**添加任务分类**/
export function addTaskType(params){
  return fetchPost('/taskType/add',param(params))
}

/**添加任务分类(总经理分配任务)**/
export function addEnabled(params){
  return fetchPost('/taskType/addEnabled',param(params))
}

/**延期任务原因**/
export function delayTaskCause(params){
  return fetchPost('/taskChange/delayTask',param(params))
}
/**变更任务等级**/
export function changeTaskLevel(params){
  return fetchPost('/taskChange/gradeChangeTask',param(params))
}

/**获取汇报对象**/
export function getUsersObj(params){
  return fetchPost('/sysUser/listDeptLeaders',param(params))
}


// 员工详情的任务管理列表
export function getStaffTask(params){
  return fetchGet('taskInfo/getStaffTask',param(params))
}

// 员工详情的任务管理列表
export function getStaffNewRecordList(params){
  return fetchGet('perfmRpRecord/getStaffNewRecordList',param(params))
}

// 员工任务管理列表
export function userTaskList(params){
  return fetchGet('/taskInfo/getMyTask',param(params))
}

// 获取员工任务类型列表
export function getTaskType(params){
  return fetchGet('/taskType/listAll',param(params))
}
// 根据部门获取任务类型列表
export function getTaskTypeByDeptId(params){
  return fetchGet('/taskType/listByDeptId',param(params))
}

//总经理 待处理任务
export function listPending1(params){
  return fetchPost('/taskManager/listPending',param(params))
}

//部门负责人 待处理任务
export function listPending(params){
  return fetchPost('/taskDepartmentHead/listPending',param(params))
}


//部门负责人 待处理任务统计
export function getAllStatisticsDepet(params){
  return fetchGet('taskStatistics/getDeptStatistics',param(params))
}
//总经理 待处理任务统计
export function getAllStatistics(params){
  return fetchGet('/taskStatistics/getAllStatistics',param(params))
}
//部门负责人 待处理任务统计
export function taskHeader(params){
  return fetchPost('/taskDepartmentHead/list',param(params))
}

//部门负责人 任务审核（等级变更）
export function getChangeType(params){
  return fetchPost('/taskManager/getChangeType',param(params))
}

//部门负责人 任务评价（）
export function getTaskComment(params){
  return fetchGet('taskManager/getTaskComment',param(params))
}
//部门负责人 任务审核（三种状态）
export function approvalTask(params){
  return fetchPost('/taskManager/approvalTask',param(params))
}
//部门负责人 分配任务
export function assessTaskDetail(params){
  return fetchGet('/taskInfo/taskDetail',param(params))
}
//部门负责人 分配任务
export function assignmentTask(params){
  return fetchPost('/taskInfo/assignmentTask',param(params))
}
//日报管理
/**获取日报列表**/
export function getDailyList(params){
  return fetchGet('/daily/getDailyList',param(params))
}
/**查看日报详情**/
export function getDailyDetail(params){
  return fetchGet('/daily/getDailyDetail',param(params))
}
/**GET /daily/showTaskList 日报管理-发起日报-日报列表(查看已完成/未完成列表)**/
export function showTaskList(params){
  return fetchGet('/daily/showTaskList',param(params))
}
/**获取姓名**/
export function listUserDynamic(params){
  return fetchGet('/sysUser/listUserDynamic',param(params))
}
// 获取员工
export function listUserAttendance(params){
  return fetchGet('/sysUser/listUserAttendance',param(params))
}

/**新增或者更新今日总结**/
export function addTodayCommont(params){
  return fetchPost('/daily/addTodayCommont',param(params))
}
/**提交日报**/
export function commitDaily(params){
  return fetchPost('/daily/commitDaily',param(params))
}
//周报管理-员工周报 : 周报管理-员工周报
/**员工获取上周周报**/
export function getStaffLastWeekly(params){
  return fetchGet('/taskWeekly/getStaffLastWeekly',param(params))
}
/**员工往期周报列表**/
export function listHistoryWeekly(params){
  return fetchGet('/taskWeekly/listHistoryWeekly',param(params))
}
/**发布周报-总结自评**/
export function publishWeekly(params){
  return fetchPost('/taskWeekly/publishWeekly',param(params))
}

/**发布周报-提交自评和计划**/
export function publishWeeklyRela(params){
  return fetchPost('/taskWeekly/publishWeeklyRela',param(params))
}
/**发起周报**/
export function toPublishStaffWeekly(params){
  return fetchGet('/taskWeekly/toPublishStaffWeekly',param(params))
}

//总经理(总经理-变更任务待审核)任务管理列表
export function listChangeTaskPending(params){
  return fetchGet('/taskManager/listChangeTaskPending',param(params))
}
//总经理(新任务待审核)任务管理列表
export function listNewTaskPending(params){
  return fetchGet('/taskManager/listNewTaskPending',param(params))
}

//总经理(新任务待审核)任务管理列表
export function listCommentTaskPending(params){
  return fetchGet('/taskManager/listCommentTaskPending',param(params))
}
//总经理(新任务待审核)任务管理列表
export function listCommentTaskPendingUnCompleted(params){
  return fetchGet('/taskManager/listCommentTaskPendingUnCompleted',param(params))
}
//总经理(我的任务)任务管理列表
export function userTaskList1(params){
  return fetchPost('/taskManager/listPersonal',param(params))
}
//总经理(公司重点任务)任务管理列表
export function companyImportTask(params){
  return fetchPost('/taskManager/listCompanyTasks',param(params))
}
//总经理(任务组视图)任务管理列表
export function listGrouped(params){
  return fetchPost('/taskManager/listGrouped',param(params))
}

//总经理(部门视图)任务管理列表
export function listDepartmental(params){
  return fetchPost('/taskManager/listDepartmental',param(params))
}

//总经理(部门视图)分配任务列表
export function assignTaskManage(params){
  return fetchPost('/taskManager/assignTask',param(params))
}
//部门负责人(变更任务待审核)任务管理列表
export function departChangeTaskPending(params){
  return fetchGet('/taskDepartmentHead/listChangeTaskPending',param(params))
}
//部门负责人(任务已完成待评价)任务管理列表
export function departCommentTaskPending(params){
  return fetchGet('/taskDepartmentHead/listCommentTaskPending',param(params))
}

//部门负责人(任务未完成待评价)任务管理列表
export function departCommentTaskPendingUnCompleted(params){
  return fetchGet('/taskDepartmentHead/listCommentTaskPendingUnCompleted',param(params))
}

//部门负责人(新任务待分配)任务管理列表
export function departAssignedTaskPending(params){
  return fetchGet('/taskDepartmentHead/listAssignedTaskPending',param(params))
}
//部门负责人过往周报列表
export function departHistoryWeekly(params){
  return fetchGet('/taskDeptWeekly/listHistoryDeptWeekly',param(params))
}

//部门负责人审阅个人周报
export function departReviewWeekly(params){
  return fetchGet('/taskDeptWeekly/listStaffWeekly',param(params))
}
//部门负责人查看员工周报详情周报
export function getByStaffWeekly(params){
  return fetchGet('/taskWeekly/getByWeeklyId',param(params))
}
//部门负责人审阅员工周报-部门负责人点评
export function departComment(params){
  return fetchPost('/taskDeptWeekly/publishWeekly',param(params))
}

//部门负责人(获取部门周报详细信息)
export function getByDepartWeekly(params){
  return fetchGet('/taskDeptWeekly/getByDeptWeeklyId',param(params))
}
//部门负责人(发起部门周报)
export function toPublishDeptWeekly(params){
  return fetchGet('/taskDeptWeekly/toPublishDeptWeekly',param(params))
}
//部门负责人(发起个人周报)
export function toPublishStaffComment(params){
  return fetchPost('/taskDeptWeekly/publishWeekly',param(params))
}
//部门负责人(发起部门周报总结)
export function PublishDeptComment(params){
  return fetchPost('/taskDeptWeekly/publishDeptWeekly',param(params))
}
//部门负责人(周报管理)
export function lastDepartWeekly(params){
  return fetchGet('/taskDeptWeekly/getLastDeptWeekly',param(params))
}

//部门负责人(确认计划)
export function publishWeeklyPlan(params){
  return fetchPost('/taskDeptWeekly/publishWeeklyRelaPlan',param(params))
}

//部门负责人(确认点评)
export function manageWeeklyComment(params){
  return fetchPost('/taskManagerWeekly/publishWeeklyRelaComment',param(params))
}

//总经理(确认计划)
export function manageWeeklyPlan(params){
  return fetchPost('/taskManagerWeekly/publishWeeklyRelaPlan',param(params))
}

//总经理(确认点评)
export function publishWeeklyComment(params){
  return fetchPost('/taskDeptWeekly/publishWeeklyRelaComment',param(params))
}
//总经理计划管理（各部门周报列表）
export function allDeptWeekly(params){
  return fetchGet('/taskManagerWeekly/listDeptWeekly',param(params))
}

//总经理计划管理（总经理往期部门周报列表）
export function allHistoryWeekly(params){
  return fetchGet('/taskManagerWeekly/listHistoryAllWeeklyWeek',param(params))
}

//总经理计划管理（总经理确认下周计划）
export function allNextWeeklyPlan(params){
  return fetchPost('/taskManagerWeekly/publishAllWeekly',param(params))
}



//总经理计划管理（）
export function LastManageWeekly(params){
  return fetchGet('/taskManagerWeekly/getLastDeptWeekly',param(params))
}

//总经理计划管理（确认下周计划）
export function toPublishManagerPlan(params){
  return fetchGet('/taskManagerWeekly/toPublishManagerPlan',param(params))
}

//总经理计划管理（总经理计划管理-总经理点评部门周报）
export function manageCommentDepart(params){
  return fetchPost('/taskManagerWeekly/publishDeptWeekly',param(params))
}
//总经理计划管理（总经理计划管理-总经理点评员工周报）
export function manageCommentStaff(params){
  return fetchPost('/taskManagerWeekly/publishWeekly',param(params))
}



//绩效管理
/**任务绩效列表**/
export function listTaskPerformances(params){
  return fetchPost('/performance/listTaskPerformances',param(params))
}
/**考勤绩效**/
export function perfmEmp(params){
  return fetchPost('/perfmEmp/list',param(params))
}
/**奖惩记录/perfmRpRecord/staffList**/
export function staffList(params){
  return fetchGet('/perfmRpRecord/staffList',param(params))
}
/**工资条列表**/
export function listSalaryList(params){
  return fetchPost('/perfmSalary/listSalaryList',param(params))
}
/**获取红黑榜统计-按月列表**/
export function perfmRpRank(params){
  return fetchPost('/perfmRpRank/listRpRank',param(params))
}

/*总经理查看员工考勤绩效**/
export function perfmEmpStaff(params){
  return fetchPost('/perfmEmp/PerfmAllList',param(params))
}
/*总经理查看部门考勤绩效**/
export function perfmEmpDepart(params){
  return fetchGet('/perfmHrDept/allDeptList',param(params))
}
//总经理工资条（生成工资条）
export function outputSalary(params){
  return fetchGet('/perfmSalary/outputSalaryBills',param(params))
}

/*总经理查看奖惩记录**/
export function perfRecordManage(params){
  return fetchGet('/perfmRpRecord/allDeptList',param(params))
}
/*总经理查看处理申诉**/
export function getApplealCount(params){
  return fetchPost('perfmAppeal/getAppealCount',param(params))
}
/**查看工资条详情**/
export function getSalaryDetail(params){
  return fetchGet('/perfmSalary/getSalaryDetail',param(params))
}
/**发起申诉**/
export function launchAppleal(params){
  return fetchPost('/perfmAppeal/launchAppleal',param(params))
}
/**处理申诉(待处理)**/
export function dealAppeal(params){
  return fetchGet('perfmAppeal/listUnHandledAppeal',param(params))
}
/**处理申诉(已处理)**/
export function dealHandle(params){
  return fetchGet('perfmAppeal/listHandledAppeal',param(params))
}
//部门负责人绩效管理接口
/**考勤绩效员工**/
export function PerfmDeptList(params){
  return fetchGet('/perfmEmp/PerfmDeptList',param(params))
}
/**考勤绩效部门**/
export function perfmHrDeptList(params){
  return fetchGet('/perfmHrDept/list',param(params))
}
/**部门奖惩记录列表**/
export function RecordDeptList(params){
  return fetchGet('/perfmRpRecord/deptList',param(params))
}

/**上传excle**/
export function uploadExcle(params){
  return fetchPost('/perfmEmp/uploadPerfmWithExcel',param(params))
}

/**总经理任务绩效列表**/
export function listTaskPerformances1(params){
  return fetchPost('/performance/manager/listStatisticsPerfm',param(params))
}
/**任务绩效详情**/
export function listStaffPerformances(params){
  return fetchPost('/performance/listStaffPerformances',param(params))
}


/**员工详情**/
export function getUserTaskDetail(params){
  return fetchGet('/sysUser/getUserTaskDetail',param(params))
}

/**个人重点超限任务降为个人普通等级**/
export function impChangeOrdTask(params){
  return fetchPost('/taskChange/impChangeOrdTask',param(params))
}


/**获取部门负责人**/
export function listDeptRoleUsers(params){
  return fetchGet('/sysUser/listDeptRoleUsers',param(params))
}

/**员工详情获取周报列表**/
export function manageStaffWeekly(params){
  return fetchGet('taskWeekly/listStaffWeekly',param(params))
}

//首页快捷统计相关接口 : 首页快捷统计相关接口
export function myPending(params){
  return fetchGet('/index/myPending',param(params))
}
//GET /index/overview 部門概况/公司概况
export function overview(params){
  return fetchGet('index/overview',param(params))
}
export function taskWeekly(params){
  return fetchPost('/taskWeekly/isNotYetSubmitTime',param(params))
}
export function taskDeptWeekly(params){
	return fetchPost('/taskDeptWeekly/isNotYetSubmitTime',param(params))
}
//部門概况/公司概况 ECHART
export function overviewEchart(params){
  return fetchGet('/index/overviewEchart',param(params))
}
//首页获取个人本周任务
export function listThisWeekTask(params){
  return fetchGet('/taskInfo/listThisWeekTask',param(params))
}



//个人重点任务超出
export function morePersonalResults(params){
  return fetchPost('/taskInfo/isExceedPersonalResults',param(params))
}
//修改密码
export function updatePassword(params){
  return fetchPost('/sysUser/updatePassword',param(params))
}
//daily/getDailyComment
export function getDailyComment(params){
  return fetchGet('/daily/getDailyComment',param(params))
}
//首页到期提醒
export function  taskExpirationReminder(params){
  return fetchGet('/taskInfo/taskExpirationReminder',param(params))
}

//总经理分配任务（执行人）
export function  listJustDeptLeaders(params){
  return fetchPost('/sysUser/listJustDeptLeaders',param(params))
}

//添加快捷菜单-拖拽菜单/taskInfo/dragTask
export function  dragTask(params){
  return fetchPost('/taskInfo/dragTask',param(params))
}


//任务汇报对象联动
export function listReportingUsers(params){
  return fetchPost('/sysUser/listReportingUsers',param(params))
}


//获取部门信息的
export function getCurrentUserDept(params){
  return fetchGet('/sysDept/getCurrentUserDept',param(params))
}



//获取部门信息的(设置任务组)
export function getDeptTaskGroup(params){
  return fetchGet('/taskGroup/getDeptTaskGroup',param(params))
}
//取部门信息的(设置任务组)
export function updateDeptTaskType(params){
  return fetchPost('/taskGroup/updateDeptTaskType',param(params))
}


//执行人和任务组二级联动
export function listByExecutor(params){
  return fetchGet('/taskType/listByExecutor',param(params))
}

//近期部门周报列表
export function listRecentDeptWeekly(params){
  return fetchGet('/taskManagerWeekly/listRecentDeptWeekly',param(params))
}


//待完善接口
export function listDraftTask(params){
  return fetchGet('/taskInfo/listDraftTask',param(params))
}
//添加任务
export function publishDraftTasks(params){
  return fetchPost('/taskManager/publishDraftTasks',param(params))
}
//拖拽任务组POST /taskGroup/dragTaskGroup
export function dragTaskGroup(params){
  return fetchPost('/taskGroup/dragTaskGroup',param(params))
}
// 拖拽任务分类POST /taskType/dragTaskType
export function dragTaskType(params){
  return fetchPost('/taskType/dragTaskType',param(params))
}


// 拖拽任务分类POST /taskType/dragTaskType
export function resetTaskRemindFlag(params){
  return fetchGet('/taskChange/resetTaskRemindFlag',param(params))
}


// 计划总结管理设置表管理
// PUT /sysPlanSummarys 更新计划总结管理设置表
export function updateSysPlanSummarys(params){
  return fetchPut('/sysPlanSummarys',param(params))
}
// POST /sysPlanSummarys/list 条件查询计划总结管理设置表集合
export function getSysPlanSummarys(params){
  return fetchPost('/sysPlanSummarys/list',param(params))
}
// POST /sysPlanSummarys/list 条件查询计划总结管理设置表集合  === 不需要权限
export function getSysPlanSummarysNoAuth(params){
  return fetchPost('/sysPlanSummarys/listNoAuth',param(params))
}

// 考核组管理
// PUT /sysExamineGroups 更新考核组设置表
export function updateSysExamineGroups(params){
  return fetchPut('/sysExamineGroups',param(params))
}
// POST /sysExamineGroups/list 条件查询考核组设置表集合  === 不需要权限
export function getSysExamineGroups(params){
  return fetchPost('/sysExamineGroups/list',param(params))
}
// POST /sysExamineGroups/list 条件查询考核组设置表集合
export function getSysExamineGroupsNoAuth(params){
  return fetchPost('/sysExamineGroups/listNoAuth',param(params))
}
// POST /sysUser/listAllUsers 获取考核成员
export function getSysAllUsers(params){
  return fetchPost('/sysUser/listAllUsers',param(params))
}


// 核对时间
// PUT /sysCheckTimes 更新核对时间表
export function updateSysCheckTimes(params){
  return fetchPut('/sysCheckTimes',param(params))
}
// POST /sysCheckTimes/list 条件查询核对时间表集合
export function getSysCheckTimes(params){
  return fetchPost('/sysCheckTimes/list',param(params))
}
// 考勤管理
// PUT /sysAttendances 更新
export function updateSysAttendances(params){
  return fetchPut('/sysAttendances',param(params))
}
// POST /sysAttendances/list 条件查询
export function getSysAttendances(params){
  return fetchPost('/sysAttendances/list',param(params))
}

// 获取任务部门列表 - 任务类型视图
export function getDeptTaskGroupByDeptId(params){
  return fetchGet('/taskGroup/getDeptTaskGroupByDeptId',param(params))
}
// 获取任务部门列表 - 部门视图
export function getTaskDeptList(params){
  return fetchGet('/sysDept/getTaskDeptList',param(params))
}
// ============任务模块接口
/**取消任务原因**/
export function cancelTaskCause(params){
  return fetchPost('/taskInfos/cancelTask',param(params))
}
// 审核任务
export function approveTask(params){
  return fetchPost('/taskInfos/approveTask',param(params))
}
/**完成任务**/
export function completeTask(params){
  return fetchPost('/taskInfos/finishTask',param(params))
}
/**发布任务**/
export function publishTask(params){
  return fetchPost('/taskInfos/publishTask',param(params))
}
/**草稿任务**/
export function saveDraftTask(params){
  return fetchPost('/taskInfos/saveDraftTask',param(params))
}
// 关联任务组
export function listGroupTaskListByUserId(params){
  return fetchGet('/taskInfos/listGroupTaskListByUserId',param(params))
}
/**获取任务详情**/
export function getTaskGroupDetail(params){
  return fetchGet('/taskInfos/detail',param(params))
}
// 任务评价
export function getTaskEvaluate(params){
  return fetchGet('/taskInfos/getTaskEvaluate',param(params))
}
// 任务管理列表下拉查看
export function seeReplyStatus(params){
  return fetchPost('/taskInfos/changeTaskReplyStatus',param(params))
}
// 获取待处理任务列表
export function listMyPendingTask(params){
  return fetchGet('/taskInfos/listMyPendingTask',param(params))
}
// 获取我的所有任务列表
export function listPersonalAllByPage(params){
  return fetchGet('/taskInfos/listPersonalAllByPage',param(params))
}
// 部门负责人-员工任务列表
export function listPendingTaskByTaskTypeId(params){
  return fetchGet('/taskInfos/listPendingTaskByTaskTypeId',param(params))
}
// 首页-重点关注任务
export function listHomeFocusTask(params){
  return fetchGet('/taskInfos/listHomeFocusTask',param(params))
}
// 员工任务管理列表
export function userTaskReply(params){
  return fetchPost('/taskInfos/replyTask',param(params))
}
// 任务详情回复
export function replyTaskReply(params){
  return fetchPost('/taskInfos/replyTaskReply',param(params))
}
// 获取回复动态
export function listTaskReply(params){
  return fetchGet('/taskInfos/listTaskReply',param(params))
}
//部门负责人 任务评价
export function assessTask(params){
  return fetchPost('/taskInfos/evaluateTask',param(params))
}
//总经理(编辑任务)任务详情列表
export function editorTaskMain(params){
  return fetchGet('/taskInfos/detail',param(params))
}
//总经理(确认编辑任务)任务详情列表
export function sureEditorTask(params){
  return fetchPut('/taskInfos/updateTask',param(params))
}

// 部门负责人-待处理任务
export function listDeptPendingTasks(params){
  return fetchGet('/taskInfos/listDeptPendingTasks',param(params))
}
//统计部门负责人数据
export function getDeptStatistics(params){
  return fetchGet('/taskInfos/deptTaskCountList',param(params))
}
//任务提醒
export function remindTaskList(params){
  return fetchGet('/taskInfos/remindTask',param(params))
}
// 部门视图任务列表
export function deptPendingTaskByEntity(params){
  return fetchPost('/taskInfos/deptPendingTaskByEntity',param(params))
}
// 任务类型视图
export function taskTypePendingTaskByEntity(params){
  return fetchPost('/taskInfos/taskTypePendingTaskByEntity',param(params))
}
// 总经理-待审核任务
export function listToApproveTaskByPage(params){
  return fetchGet('/taskInfos/listToApproveTaskByPage',param(params))
}
// 总经理-待评价任务
export function listWaitEvaluateTaskByPage(params){
  return fetchGet('/taskInfos/listWaitEvaluateTaskByPage',param(params))
}
// 根据用户id获取 未完成任务
export function listPendingTaskByUserId(params){
  return fetchPost('/taskInfos/listPendingTaskByUserId',param(params))
}
// 根据用户id获取 已完成任务
export function listFinishTaskByUserId(params){
  return fetchPost('/taskInfos/listFinishTaskByUserId',param(params))
}




// ============计划表 add 20200107 by vic
// 操作日志
export function changeLogLists(params){
  return fetchPost('/operationLogs/list',param(params))
}
// 个人计划列表
export function getPlanPages(params){
  return fetchPost('/planInfos/page',param(params))
}
// 全部部门计划列表
export function listAllDeptPlanPage(params){
  return fetchPost('/planInfos/listAllDeptPlanPage',param(params))
}
// 全部个人计划列表
export function listAllPersonalPlanPage(params){
  return fetchPost('/planInfos/listAllPersonalPlanPage',param(params))
}

// 待处理计划列表
export function listPendingPlanPage(params){
  return fetchGet('/planInfos/listPendingPlanPage',param(params))
}
// 待处理计划列表-总经理
export function listManagerPendingPlanPage(params){
  return fetchPost('/planInfos/listManagerPendingPlanPage',param(params))
}

// 个人 发起计划 基础信息
export function newPlanTasklist(params){
  return fetchGet('/planInfos/newPlanTasklist',param(params))
}
// // 编辑 个人计划 基础信息详情
// export function getPlanEditDetail(params){
//   return fetchGet('/planInfos/editDetail',param(params))
// }
// 个人计划详情
export function personalPlanDetail(params){
  return fetchGet('/planInfos/personalPlanDetail',param(params))
}
// 更新计划 
export function updatePlan(params){
  return fetchPost('/planInfos/updatePlan',param(params))
}
// 部门计划详情
export function deptPlanDetail(params){
  return fetchGet('/planInfos/deptPlanDetail',param(params))
}
// 发布计划
export function publishPlan(params){
  return fetchPost('/planInfos/publishPlan',param(params))
}
// 保存草稿计划
export function saveDraftPlan(params){
  return fetchPost('/planInfos/saveDraftPlan',param(params))
}
// 审核计划
export function approvePlan(params){
  return fetchPost('/planInfos/approvePlan',param(params))
}
// 变更计划审核中
export function updateToApproving(params){
  return fetchPost('/planInfos/updateToApproving',param(params))
}
// 是否已发起总结
export function canPublishPlan(params){
  return fetchGet('/planInfos/canPublishPlan',param(params))
}
//点击判断
export function canPublishPlanOnTap(params){
  return fetchGet('/planInfos/canPublishPlanOnTap',param(params))
}



// 计算离计划/总结开始提交还剩多少时间
export function getRestTime(params){
  return fetchGet('/sysPlanSummarys/getRestTime',param(params))
}


// 个人总结列表
export function getSummaryPages(params){
  return fetchPost('/summaryInfos/page',param(params))
}
// 全部部门总结列表
export function listDeptSummaryByPage(params){
  return fetchGet('/summaryInfos/listDeptSummaryByPage',param(params))
}
// 全部个人总结列表
export function listAllPersonalSummaryPage(params){
  return fetchGet('/summaryInfos/listAllPersonalSummaryPage',param(params))
}
// 待处理总结列表
export function listPendingSummaryPage(params){
  return fetchGet('/summaryInfos/listPendingSummaryPage',param(params))
}
// 待处理总结列表 - 总经理
export function listManagerPendingSummaryPage(params){
  return fetchGet('/summaryInfos/listManagerPendingSummaryPage',param(params))
}
// 个人 发起总结 基础信息
export function newSummaryTasklist(params){
  return fetchGet('/summaryInfos/newSummaryTasklist',param(params))
}
// // 编辑 个人总结 基础信息详情
// export function getSummaryEditDetail(params){
//   return fetchGet('/summaryInfos/draftDetail',param(params))
// }
// 个人总结详情
export function personalSummaryDetail(params){
  return fetchGet('/summaryInfos/personalSummaryDetail',param(params))
}
// 更新总结 
export function updateSummary(params){
  return fetchPost('/summaryInfos/updateSummary',param(params))
}
// 部门总结详情
export function deptSummaryDetail(params){
  return fetchGet('/summaryInfos/deptSummaryDetail',param(params))
}
// 发布总结
export function publishSummary(params){
  return fetchPost('/summaryInfos/publishSummary',param(params))
}
// 保存草稿总结
export function saveDraftSummary(params){
  return fetchPost('/summaryInfos/saveDraftSummary',param(params))
}
// 审核总结
export function approveSummary(params){
  return fetchPost('/summaryInfos/approveSummary',param(params))
}
// 变更总结审核中
export function updateToApprovingSummary(params){
  return fetchPost('/summaryInfos/updateToApproving',param(params))
}
// 能否发起总结
export function canPublishSummary(params){
  return fetchGet('/summaryInfos/canPublishSummary',param(params))
}
//点击判断
export function canPublishSummaryOnTap(params){
  return fetchGet('/summaryInfos/canPublishSummaryOnTap',param(params))
}
// 提出申诉
export function appealSummary(params){
  return fetchPost('/summaryInfos/appealSummary',param(params))
}
// 确认打分
export function conformScore(params){
  return fetchPost('/summaryInfos/conformScore',param(params))
}
// 驳回申诉
export function rejectAppeal(params){
  return fetchPost('/summaryInfos/rejectAppeal',param(params))
}
// 驳回申诉
export function handleAppeal(params){
  return fetchPost('/summaryInfos/handleAppeal',param(params))
}
// 导出
export function exportSummary(params){
  return fetchDownloadFileGet('/summaryInfos/exportSummary',params)
}


// ========================= 绩效管理模块

// 分页获取绩效
export function meritssPage(params){
  return fetchGet('/meritss/page',param(params))
}
// 分页获取考勤
export function attendanceRecordsPage(params){
  return fetchPost('/attendanceRecords/page',param(params))
}
// 上传考勤
export function uploadAttendance(params){
  return fetchFilePost('/attendanceRecords/uploadAttendance',params)
}
// 发送考勤
export function sendAttendance(params){
  return fetchGet('/attendanceRecords/sendAttendance',param(params))
}
// 更新考勤信息
export function updateAttendance(params){
  return fetchPut('/attendanceRecords',param(params))
}
// 删除扣款
export function deleteAttendanceCut(params){
  return fetchGet('/attendanceRecords/deleteCut',param(params))
}
// 获取详情
export function getAttendance(params){
  return fetchGet('/attendanceRecords',param(params))
}
// 确认考勤
export function confirmAttendanceRecord(params){
  return fetchPost('/attendanceRecords/confirmAttendanceRecord',param(params))
}
// 审核考勤
export function examineAttendanceRecord(params){
  return fetchPost('/attendanceRecords/examineAttendanceRecord',param(params))
}
// 考勤操作记录
export function getAttendanceLogs(params){
  return fetchPost('/attendanceLogs/list',param(params))
}
// 分页获取工资条 - 员工
export function listSalaryPage(params){
  return fetchPost('/salarys/listPage',param(params))
}
// 分页获取工资条 - 管理员
export function listSalaryCountPage(params){
  return fetchPost('/salarys/listSalaryCountPage',param(params))
}
// 导出工资条
export function exportSalary(params){
  return fetchDownloadFileGet('/salarys/exportSalary',param(params))
}
// 工资条详情
export function listSalaryDetailPage(params){
  return fetchPost('/salarys/listSalaryDetailPage',param(params))
}
// 发送工资条
export function sendSalary(params){
  return fetchGet('/salarys/sendSalary',param(params))
}
// 是否可发送工资条
export function canSendSalary(params){
  return fetchGet('/salarys/canSendSalary',param(params))
}







// 首页 - 待处理数量
export function getStatisticCount(params){
  return fetchGet('/home/getStatisticCount',param(params))
}
// 全部计划总结
export function getAllPlanSummaryInfo(params){
  return fetchPost('/home/getAllPlanSummaryInfo',param(params))
}


// 获取重点关注定制信息
export function getTaskFocusSet(params){
  return fetchGet('/taskFocusSets/getTaskFocusSet',param(params))
}
// 设置重点关注定制信息
export function saveTaskFocusSet(params){
  return fetchPost('/taskFocusSets/saveTaskFocusSet',param(params))
}
// 获取部门+员工列表
export function listDeptsAndUsers(params){
  return fetchGet('/sysUser/listDeptsAndUsers',param(params))
}


// 附件上传下载
export function uploadFile(params){
  return fetchFilePost('/fileInfos/uploadFile',params)
}
// 下载
export function downloadFile(params){
  return fetchDownloadFileGet('/fileInfos/downloadFile',params)
}
