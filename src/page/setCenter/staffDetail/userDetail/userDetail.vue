<template>
  <div class="">
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper"  v-if="userView=='STAFF'">
          <span class="child1">员工详情</span>

      </div>
      <div class="router-wrapper"  v-if="userView=='DEPT'">
          <span class="child1">员工详情</span>
      </div>
      <div class="router-wrapper"  v-if="userView=='MANAGER'">
        <router-link to="/setCenter">
          <span class="child1">系统设置</span>
        </router-link>
        /
        <router-link to="/staffDetail">
          <span class="child1">员工管理</span>
        </router-link>
        /
        <router-link to="/userDetail">
          <span class="child2">员工详情</span>
        </router-link>
      </div>
      <div class="user-information">
        <div class="user-title" style="border:none;">
          <div class="title-name">
            用户信息
          </div>
          <div class="take-reward" @click="reward(1)" v-if="userView!='STAFF'">
            发起奖励
          </div>
          <div class="take-reward"  @click="initiate(0)" v-if="userView!='STAFF'">
            发起惩罚
          </div>
          <div class="take-reward" @click='mindTask' v-if="userView!='STAFF'">
            分发任务
          </div>
          <div class="take-reward" @click='edtorInformation'>
            编辑
          </div>
        </div>
        <div class="user-content">
          <ul>
            <li>姓名：{{user.userName}}</li>
            <li>电话：{{user.telephone}}</li>
            <li>邮箱：{{user.email}}</li>
            <li>角色：{{user.roleName}}</li>
            <li>部门：{{user.deptName}}</li>
            <li>团队：{{user.teamName}}</li>
            <li>绩效评估分：{{user.performanceScore }}</li>
            <li>当月绩效评估分：{{user.thisMonthEvalScore}}</li>
            <li>任务绩效分：{{user.evaluatingScore}}</li>
            <li>奖励次数：{{user.rewardSize}}</li>
            <li>奖励金额共计：{{user.rewardAmount}}</li>
            <li></li>
            <li>惩罚次数：{{user.punishSize}}</li>
            <li>惩罚金额总计：{{user.punishAmount}}</li>
            <li>奖惩合计：{{user.rpTotal}}</li>
          </ul>
        </div>
      </div>

      <div class="user-title" style='margin-top:10px;'>
        <div class="title-name title-name1 title-name2"
          v-for="(item,index) in tabs"
            :class="{active:index == num}"
             @click="tab(index)" v-html="item">{{item}}
        </div>
        </div>
      <div class="uncomplete-task task-manage" v-show=" 0 == num" style="margin-top:0px;border:none !important;">
        <el-table
          :data="result"
          row-key="taskId"
          :expand-row-keys="expands"
          @row-click="openDetails"
          style="width: 100%;margin-top:0px;" empty-text='暂无数据'>
          <el-table-column type="expand" v-show='hello'>
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="内容：">
                  <span class='content-tab'>{{ props.row.content }}</span>
                </el-form-item>
                <el-form-item>
                  <div class="input-back">
                    <input type="text" name="" value="" class='inputValue'>
                    <span @click='replyTask(props.row.index,props.row.taskId)' class='replyValue'>回复</span>
                  </div>
                  <div class="" v-for='item in props.row.taskReplys'>
                    <div class="reback-time">
                      {{item.replyTimeDistanceDesc}}
                    </div>
                    <div class="reback" style="max-width: 294px;min-width: 296px;overflow:hidden;">
                      <div style="float:left;">{{item.replyUser.userName}}：</div><div style="float:left;max-width: 247px;word-break: break-all; word-wrap:break-word;">{{item.replyContent}}</div>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="">
                  <div class="">
                    概要：
                  </div>
                  <div class="reback reback1">
                    发布人：{{ props.row.publisher.userName}}
                  </div>
                  <div class="reback reback1">
                    执行人：{{ props.row.executor.userName }}
                  </div>
                  <div class="reback reback1">
                    协助人：{{ props.row.taskAssistUsers }}
                  </div>
                  <div class="reback reback1">
                    开始日期：{{ props.row.planStartDate }}
                  </div>
                  <div class="reback reback1">
                    截止日期：{{ props.row.planEndDate  }}
                  </div>
                  <div class="reback reback1">
                    自动回复：{{props.row.repeatRule }}
                  </div>
                </el-form-item>
                <el-form-item>
                  <div class="special">
                       特别
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="任务标题"
            prop="id">
            <template slot-scope="props">
                  <router-link :to="{ path: 'taskDetail',query: {id:props.row.taskId}}" style="color:#505363;" v-if="userView=='STAFF'">  <div>{{ props.row.title}}</div>
                  </router-link>
                  <router-link :to="{ path: 'taskDetailManage',query: {id:props.row.taskId}}" style="color:#505363;" v-if="userView=='MANAGER'">  <div>{{ props.row.title}}</div>
                  </router-link>
                  <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;" v-if="userView=='DEPT'">
                  <div>{{ props.row.title}}</div>
                </router-link>
                  <div>
                    <div class="title-left">
                      <div v-show='props.row.grade=="PERSONALORD"'><span style="background: #108EE9;"></span><span>个人普通</span></div>
                      <div v-show='props.row.grade=="COMPANY"'><span style="background: #F04134;"></span><span>公司重点</span></div>
                      <div v-show='props.row.grade=="PERSONALIMP"'><span style="background: #00A854;"></span><span>个人重点</span></div>
                      <div v-show='props.row.grade=="DEPARTMENT"'><span style="background: #FFBF00;"></span><span>部门重点</span></div>
                    </div>
                    <div class="title-right" style="border:none;">
                      {{props.row.taskTypeStr}}
                    </div>
                  </div>
                </template>
          </el-table-column>
          <el-table-column
            label="最新回复"
            prop="name">
            <template slot-scope="props">
              <div class="" v-if='props.row.lastTaskReplyer!=null'>
                <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="任务状态"
            prop="desc" min-width='38'>
            <template slot-scope="props">
              <span>
                <div >
                  <img class="icon_type" v-if="props.row.iconType=='FINISHU'"  src="../../../../images/lateTime2.png" alt="" >
                  <img class="icon_type" v-if="props.row.iconType=='FINISHUW'" src="../../../../images/timeLate.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='EXCELLENT'" src="../../../../images/icon_excellent.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='GOOD'" src="../../../../images/icon_good.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='SECONDARY'" src="../../../../images/icon_well.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='DIFFERENCE'" src="../../../../images/icon_bad.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='POOR'" src="../../../../images/icon_worse.png" alt="">
                  <span style="color:#D93437">{{props.row.taskStatusStr}}</span>
                </div>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="props">
              <span>
                <el-button
                  size="small"
                 :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='cancle(props.row.taskId,$event)'>取消</el-button>
                 <el-button
                   size="small"
                  class='complete' v-else @click='cancle(props.row.taskId,$event)'>取消</el-button>
              </span>
              <span>
                <el-button
                  size="small"
                  :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='delay(props.row.taskId,$event)'>延期</el-button>
                  <el-button
                    size="small"
                     class='complete' v-else   @click='delay(props.row.taskId,$event)'>延期</el-button>
                </span>
                <span>
                  <el-button
                    size="small"
                    :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='levelChange(props.row.taskId,$event)'>等级变更</el-button>
                    <el-button
                      size="small"
                      class='complete' v-else @click='levelChange(props.row.taskId,$event)'>等级变更</el-button>
                  </span>
                  <span>
                    <el-button
                      size="small"
                      :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='levelComeplete(props.row.taskId,props.row.myselfTaskJudge,$event)'>完成</el-button>
                      <el-button
                        size="small"
                        class='complete' v-else @click='levelComeplete(props.row.taskId,props.row.myselfTaskJudge,$event)'>完成</el-button>
                  </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-depart"  v-if="total>0">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 15, 50]"
            :page-size=pageShow
            layout="total, sizes, prev, pager, next, jumper"
            :total=total>
          </el-pagination>
        </div>
      </div>

      <div class="uncomplete-task task-manage" v-show=" 1 == num" style="margin-top:0px;border:none !important;">
        <div class="role-title">
          <div class="role-num performanceDept searchLevelSpecial">
            任务类型：
            <el-select v-model="searchType" placeholder="请选择类型" style="width:100%;" class="role-button">
             <el-option
               v-for="item in optionType"
               :key="item.taskTypeId"
               :label="item.taskTypeName"
               :value="item.taskTypeId">
             </el-option>
           </el-select>

          </div>
          <div class="role-num performanceDept searchLevelSpecial" style="margin-left:86px;">
            重要等级：
            <el-select v-model="searchLevel" placeholder="请选择任务等级" style="width:100%;" class="role-button">
              <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <!-- <el-select v-model="time" placeholder="全部" class="role-button">
              <el-option v-for="item in finishTime" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select> -->
          </div>
          <div class="role-num" style="margin-left:43px;">
            <span style="float:left;">任务标题：</span>
            <el-input v-model="serchContent" placeholder="请输入任务标题" class='content-task'></el-input>
          </div>
          <div class="button-perform" @click="search">
            搜索
          </div>
        </div>
        <el-table
          :data="result2"
          row-key="taskId"
          :expand-row-keys="expands"
          @row-click="openDetails"
          style="width: 100%;margin-top:0px;" empty-text='暂无数据'>
          <el-table-column type="expand" v-show='hello'>
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="内容：">
                  <span class='content-tab'>{{ props.row.content }}</span>
                </el-form-item>
                <el-form-item>
                  <div class="input-back">
                    <input type="text" name="" value="" class='inputValue'>
                    <span @click='replyTask(props.row.index,props.row.taskId)' class='replyValue'>回复</span>
                  </div>
                  <div class="" v-for='item in props.row.taskReplys'>
                    <div class="reback-time">
                      {{item.replyTimeDistanceDesc}}
                    </div>
                    <div class="reback" style="max-width: 294px;min-width: 296px;overflow:hidden;">
                      <div style="float:left;">{{item.replyUser.userName}}：</div><div style="float:left;max-width: 247px;word-break: break-all; word-wrap:break-word;">{{item.replyContent}}</div>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="">
                  <div class="">
                    概要：
                  </div>
                  <div class="reback reback1">
                    发布人：{{ props.row.publisher.userName}}
                  </div>
                  <div class="reback reback1">
                    执行人：{{ props.row.executor.userName }}
                  </div>
                  <div class="reback reback1">
                    协助人：{{ props.row.taskAssistUsers }}
                  </div>
                  <div class="reback reback1">
                    开始日期：{{ props.row.planStartDate }}
                  </div>
                  <div class="reback reback1">
                    截止日期：{{ props.row.planEndDate  }}
                  </div>
                  <div class="reback reback1">
                    自动回复：{{props.row.repeatRule }}
                  </div>
                </el-form-item>
                <el-form-item>
                  <div class="special">
                       特别
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="任务标题"
            prop="id">
            <template slot-scope="props">
              <router-link :to="{ path: 'taskDetail',query: {id:props.row.taskId}}" style="color:#505363;" v-if="userView=='STAFF'">  <div>{{ props.row.title}}</div>
              </router-link>
              <router-link :to="{ path: 'taskDetailManage',query: {id:props.row.taskId}}" style="color:#505363;" v-if="userView=='MANAGER'">  <div>{{ props.row.title}}</div>
              </router-link>
              <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;" v-if="userView=='DEPT'">
              <div>{{ props.row.title}}</div>
            </router-link>
                  <div>
                    <div class="title-left">
                      <div v-show='props.row.grade=="PERSONALORD"'><span style="background: #108EE9;"></span><span>个人普通</span></div>
                      <div v-show='props.row.grade=="COMPANY"'><span style="background: #F04134;"></span><span>公司重点</span></div>
                      <div v-show='props.row.grade=="PERSONALIMP"'><span style="background: #00A854;"></span><span>个人重点</span></div>
                      <div v-show='props.row.grade=="DEPARTMENT"'><span style="background: #FFBF00;"></span><span>部门重点</span></div>
                    </div>
                    <div class="title-right" style="border:none;">
                      {{props.row.taskTypeStr}}
                    </div>
                  </div>
                </template>
          </el-table-column>
          <el-table-column
            label="最新回复"
            prop="name">
            <template slot-scope="props">
              <div class="" v-if='props.row.lastTaskReplyer!=null'>
                <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="任务状态"
            prop="desc" width='180'>
            <template slot-scope="props">
              <span>
                <div >
                  <img class="icon_type" v-if="props.row.iconType=='FINISHU'"  src="../../../../images/lateTime2.png" alt="" >
                  <img class="icon_type" v-if="props.row.iconType=='FINISHUW'" src="../../../../images/timeLate.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='EXCELLENT'" src="../../../../images/icon_excellent.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='GOOD'" src="../../../../images/icon_good.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='SECONDARY'" src="../../../../images/icon_well.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='DIFFERENCE'" src="../../../../images/icon_bad.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='POOR'" src="../../../../images/icon_worse.png" alt="">
                  <span style="color:#D93437">{{props.row.taskStatusStr}}</span>
                </div>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="props">
              <el-button
                size="small"
               class='complete' @click='cancle(props.row.taskId,$event)'>取消</el-button>
              <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" v-if="userView=='DEPT'">
            <el-button
              size="small"
              class='complete'>查看</el-button>
            </router-link>
            <router-link :to="{ path: 'taskDetail',query: {id:props.row.taskId}}" v-if="userView=='STAFF'">
          <el-button
            size="small"
            class='complete'>查看</el-button>
          </router-link>
          <router-link :to="{ path: 'taskDetailManage',query: {id:props.row.taskId}}" v-if="userView=='MANAGER'">
        <el-button
          size="small"
          class='complete'>查看</el-button>
        </router-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-depart"  v-if="total2>0">
          <el-pagination
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page="currentPage"
            :page-sizes="[10, 15, 50]"
            :page-size=pageShow
            layout="total, sizes, prev, pager, next, jumper"
            :total=total2>
          </el-pagination>
        </div>
      </div>
      <div class="uncomplete-task task-manage" v-show=" 2 == num" style="margin-top:0px;border:none !important;">
        <el-table
          :data="result6"
          row-key="taskId"
          :expand-row-keys="expands"
          @row-click="openDetails"
          style="width: 100%;margin-top:0px;" empty-text='暂无数据'>
          <el-table-column type="expand" v-show='hello'>
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="内容：">
                  <span class='content-tab'>{{ props.row.content }}</span>
                </el-form-item>
                <el-form-item>
                  <div class="input-back">
                    <input type="text" name="" value="" class='inputValue'>
                    <span @click='replyTask(props.row.index,props.row.taskId)' class='replyValue'>回复</span>
                  </div>
                  <div class="" v-for='item in props.row.taskReplys'>
                    <div class="reback-time">
                      {{item.replyTimeDistanceDesc}}
                    </div>
                    <div class="reback" style="max-width: 294px;min-width: 296px;overflow:hidden;">
                      <div style="float:left;">{{item.replyUser.userName}}：</div><div style="float:left;max-width: 247px;word-break: break-all; word-wrap:break-word;">{{item.replyContent}}</div>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="">
                  <div class="">
                    概要：
                  </div>
                  <div class="reback reback1">
                    发布人：{{ props.row.publisher.userName}}
                  </div>
                  <div class="reback reback1">
                    执行人：{{ props.row.executor.userName }}
                  </div>
                  <div class="reback reback1">
                    协助人：{{ props.row.taskAssistUsers }}
                  </div>
                  <div class="reback reback1">
                    开始日期：{{ props.row.planStartDate }}
                  </div>
                  <div class="reback reback1">
                    截止日期：{{ props.row.planEndDate  }}
                  </div>
                  <div class="reback reback1">
                    自动回复：{{props.row.repeatRule }}
                  </div>
                </el-form-item>
                <el-form-item>
                  <div class="special">
                       特别
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="任务标题"
            prop="id">
            <template slot-scope="props">
              <router-link :to="{ path: 'taskDetail',query: {id:props.row.taskId}}" style="color:#505363;" v-if="userView=='STAFF'">  <div>{{ props.row.title}}</div>
              </router-link>
              <router-link :to="{ path: 'taskDetailManage',query: {id:props.row.taskId}}" style="color:#505363;" v-if="userView=='MANAGER'">  <div>{{ props.row.title}}</div>
              </router-link>
              <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;" v-if="userView=='DEPT'">
              <div>{{ props.row.title}}</div>
            </router-link>
                  <div>
                    <div class="title-left">
                      <div v-show='props.row.grade=="PERSONALORD"'><span style="background: #108EE9;"></span><span>个人普通</span></div>
                      <div v-show='props.row.grade=="COMPANY"'><span style="background: #F04134;"></span><span>公司重点</span></div>
                      <div v-show='props.row.grade=="PERSONALIMP"'><span style="background: #00A854;"></span><span>个人重点</span></div>
                      <div v-show='props.row.grade=="DEPARTMENT"'><span style="background: #FFBF00;"></span><span>部门重点</span></div>
                    </div>
                    <div class="title-right" style="border:none;">
                      {{props.row.taskTypeStr}}
                    </div>
                  </div>
                </template>
          </el-table-column>
          <el-table-column
            label="最新回复"
            prop="name">
            <template slot-scope="props">
              <div class="" v-if='props.row.lastTaskReplyer!=null'>
                <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="任务状态"
            prop="desc" min-width='38'>
            <template slot-scope="props">
              <span>
                <div >
                  <img class="icon_type" v-if="props.row.iconType=='FINISHU'"  src="../../../../images/lateTime2.png" alt="" >
                  <img class="icon_type" v-if="props.row.iconType=='FINISHUW'" src="../../../../images/timeLate.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='EXCELLENT'" src="../../../../images/icon_excellent.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='GOOD'" src="../../../../images/icon_good.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='SECONDARY'" src="../../../../images/icon_well.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='DIFFERENCE'" src="../../../../images/icon_bad.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='POOR'" src="../../../../images/icon_worse.png" alt="">
                  <span style="color:#D93437">{{props.row.taskStatusStr}}</span>
                </div>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-depart"  v-if="total6>0">
          <el-pagination
            @size-change="handleSizeChange6"
            @current-change="handleCurrentChange6"
            :current-page="currentPage"
            :page-sizes="[10, 15, 50]"
            :page-size=pageShow6
            layout="total, sizes, prev, pager, next, jumper"
            :total=total6>
          </el-pagination>
        </div>
      </div>
      <div class="uncomplete-task" v-show=" 3 == num" style="margin-top:0px;border:none !important;">
        <div class="get-reward">
          <el-table
          :data="result1"
          style="width: 100%" empty-text='暂无数据'>
          <el-table-column
            prop="rpTime"
            label="奖惩时间"
            >
          </el-table-column>
          <el-table-column
            prop="rpType"
            label="奖惩类型"
            >
            <template slot-scope="props">
              <div v-show='props.row.rpType=="REWARD"'>奖励</div>
              <div v-show='props.row.rpType=="PUNISH"'>惩罚</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="rpAmount"
            label="奖惩金额"
            >
            <template slot-scope="props">
              <div v-show='props.row.rpAmount>=0' class="red">{{ props.row.rpAmount }}</div>
              <div v-show='props.row.rpAmount<0' class="green">{{ props.row.rpAmount }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="rpReason"
            label="奖惩原因">
          </el-table-column>
        </el-table>
        </div>
        <div class="pagination-depart"  v-if="total1>0">
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="currentPage"
            :page-sizes="[10, 15, 50]"
            :page-size=pageShow1
            layout="total, sizes, prev, pager, next, jumper"
            :total=total1>
          </el-pagination>
        </div>
      </div>

      <div class="uncomplete-task" v-show=" 4 == num" style="margin-top:0px;border:none !important;">
        <div class="get-reward">
          <el-table
          :data="result3"
          style="width: 100%" empty-text='暂无数据'>
          <el-table-column
            prop="endDay"
            label="时间"
            >
            <template slot-scope="props">
              <span>{{props.row.startDay}}-{{props.row.endDay}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="taskTotal"
            label="本周任务数"
            >
          </el-table-column>
          <el-table-column
            prop="completionRate"
            label="任务完成率"
            >
          </el-table-column>
          <el-table-column
            prop="delayRate"
            label="任务延期率"
            >
          </el-table-column>
          <el-table-column
            prop="taskTotalScore"
            label="任务总分">
          </el-table-column>
          <el-table-column
            prop="evaluatingScore"
            label="绩效评估分">
          </el-table-column>
          <el-table-column
            prop="nextTaskTotal"
            label="下周任务数">
          </el-table-column>
          <el-table-column
            prop="nextImptaskTotal"
            label="下周重点数">
          </el-table-column>
          <el-table-column
            label="操作" width='70px'>
            <template slot-scope="props">
                <router-link :to="{ path: 'weekDetailStaff',query: {id:props.row.weeklyId}}">
              <button type="button" name="button" class='seename'>查看</button>
            </router-link>
            </template>
          </el-table-column>
        </el-table>
        </div>
        <div class="pagination-depart"  v-if="total3>0">
          <el-pagination
            @size-change="handleSizeChange3"
            @current-change="handleCurrentChange3"
            :current-page="currentPage"
            :page-sizes="[10, 15, 50]"
            :page-size=pageShow3
            layout="total, sizes, prev, pager, next, jumper"
            :total=total3>
          </el-pagination>
        </div>
      </div>
      <!--发起惩罚模态窗-->
      <div class="rewards">
        <el-dialog
          :title="title"
          :visible.sync="dialogVisible"
          size="tiny"
          :before-close="handleClose"
          top='20%'
          class="noticeManageModel">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="姓名：" required>
            <el-input v-model="user.userName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="类型："  class="clearType" required>
              <el-col :span="10">
                <el-form-item prop="type">
                  <el-select v-model="ruleForm.type" placeholder="请选择" class="type"  @change="changeType">
                    <el-option
                      v-for="item in optionsType"
                      :key="item.rpTypeId"
                      :label="item.rpName"
                      :value="item.rpTypeId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="4">　金额：</el-col>
              <el-col :span="10">
                <el-form-item  class="clear" prop="amount" >
                  <el-select v-model="ruleForm.amount" placeholder="请选择" class="type">
                    <el-option
                      v-for="item in optionsAmount"
                      :key="item.rpTypeId"
                      :label="item.amount"
                      :value="item.amount"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="原因：" prop="cause" class="cause">
              <el-input type="textarea" v-model="ruleForm.cause" class="cause"></el-input>
            </el-form-item>
          </el-form>
            <span slot="footer" class="dialog-footer">
                <button  @click="cancelStart('ruleForm')">取 消</button>
                <button  @click="sureStart('ruleForm')">确定</button>
              </span>
        </el-dialog>
      </div>
      <div class="">
        <!--申请取消原因模态窗-->
        <el-dialog
          title="申请取消原因"
          :visible.sync="dialogVisible1"
          size="tiny"
          :before-close="handleClose1" top='25%' class=" noticeManageModel">
          <el-form :model="ruleForm1" :rules="rules" ref="ruleForm1" label-width="112px" class="demo-ruleForm">
            <el-form-item label="取消原因：" prop="cause" required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm1.cause"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <button  @click="resetForm1('ruleForm1')">取 消</button>
            <button  @click="submitForm1('ruleForm1')">确定</button>
          </span>
        </el-dialog>
      </div>
      <div class="">
        <!--延期任务模态窗-->
        <el-dialog
          title="申请任务延期"
          :visible.sync="dialogVisible12"
          size="tiny"
          :before-close="handleClose12" top='25%' class=" noticeManageModel">
          <el-form :model="ruleForm2" :rules="rules" ref="ruleForm2" label-width="112px" class="demo-ruleForm">
            <el-form-item label="延期时间:" required style="margin-right: 40px !important;height:36px;">
              <el-form-item prop="date1">
                <el-date-picker type="date" :picker-options="pickerOptions0" placeholder="选择日期" v-model="ruleForm2.date1" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-form-item>
            <el-form-item label="延期原因：" prop="cause1" required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm2.cause1"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <button  @click="resetForm12('ruleForm2')">取 消</button>
            <button  @click="submitForm12('ruleForm2')">确定</button>
          </span>
        </el-dialog>
      </div>
      <!--个人信息-->
      <div class="tabs">
        <el-dialog title="个人信息"
                   :visible.sync="dialogVisible13"
                   size="tiny"
                   :before-close="handleClose13"
                   top='10%'>
          <el-form :label-position="labelPosition" :rules="rules" ref="formLabelAlign" label-width="100px" :model="formLabelAlign">
            <el-form-item label="角色名：" class="roleName">
             <span>{{role[0]}}</span>
            </el-form-item>
            <el-form-item label="姓名：" required prop="username1" class="names">
              <el-input v-model="formLabelAlign.username1"></el-input>
            </el-form-item>
            <el-form-item label="角色：" class="role">
              <span>{{rolename}}</span>
            </el-form-item>
            <el-form-item label="部门：" class="dept">
              <span>{{UserInfo.deptName}}</span>
            </el-form-item>
            <el-form-item label="团队：" class="team">
             <span>{{UserInfo.teamName}}</span>
            </el-form-item>
            <el-form-item label="手机：" required prop="tel3">
              <el-input v-model="formLabelAlign.tel3"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" required prop="email3">
              <el-input v-model="formLabelAlign.email3"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <button @click="resetForm13('formLabelAlign')">取 消</button>
              <button @click="submitForm13('formLabelAlign')">保存</button>
            </span>
        </el-dialog>
      </div>
      <div class="">
        <!--申请变更任务重要等级-->
        <el-dialog title="申请变更任务重要等级" :visible.sync="dialogVisible3" size="tiny" :before-close="handleClose3" top='25%' class=" noticeManageModel">
          <el-form :model="ruleForm3" :rules="rules" ref="ruleForm3" label-width="112px" class="demo-ruleForm">
            <el-form-item label="任务重要等级:" prop="value3" required style="margin-right: 40px !important;">
              <el-select v-model="ruleForm3.value3" placeholder="请选择任务等级" style="width:100%;" @change='choseLevel3'>
                <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="变更原因：" prop="cause3" required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm3.cause3"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <button  @click="resetForm3('ruleForm3')">取 消</button>
              <button  @click="submitForm3('ruleForm3')">确定</button>
            </span>
        </el-dialog>
      </div>
      <div class="">
        <!--发布任务模态窗-->
        <el-dialog
          title="分发任务"
          :visible.sync="dialogVisible11"
          size="tiny"
          :before-close="handleClose11" top='10%' class=" noticeManageModel">
          <el-form :model="ruleForm11" :rules="rules" ref="ruleForm11" label-width="112px" class="demo-ruleForm">
            <el-form-item label="任务标题:" prop="name" style="margin-right: 40px !important;">
              <el-input v-model="ruleForm11.name"></el-input>
            </el-form-item>
            <el-form-item label="任务类型:" prop="value4" required style="margin-right: 40px !important;">
              <el-select v-model="ruleForm11.value4" placeholder="请选择类型" style="width:100%;" @click="choseTaskType1">
               <el-option
                 v-for="item in optionType"
                 :key="item.taskTypeId"
                 :label="item.taskTypeName"
                 :value="item.taskTypeId">
               </el-option>
             </el-select>
            </el-form-item>
            <el-form-item label="执行人:" prop="value5" required style="margin-right: 40px !important;">
             <el-select v-model="ruleForm11.value5" :disabled="true" filterable placeholder="请选择执行人" style="width:100%;">
               <el-option
                 v-for="item in users"
                 :key="item.userId"
                 :label="item.userName"
                 :value="item.userId">
               </el-option>
             </el-select>
            </el-form-item>
            <el-form-item label="任务汇报对象:" required prop="telObj" style="margin-right: 40px !important;">
              <el-select v-model="ruleForm11.telObj" filterable placeholder="请选择任务汇报对象" style="width:100%;">
                <el-option
                  v-for="item in optionsObj"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId">
                </el-option>
              </el-select>
              <!-- <el-input v-model="ruleForm.telObj"></el-input> -->
            </el-form-item>
            <el-form-item label="任务重要等级:" prop="value3" required class="special1" style="margin-right: 40px !important;">
              <el-select v-model="ruleForm11.value3" placeholder="请选择任务等级"  style="width:100%;">
               <el-option
                 v-for="item in options1"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
               </el-option>
             </el-select>
              <i class="el-icon-information" style="float:left;margin-right: 40px !important;" @mouseenter="iconEnter" @mouseleave="iconLeave"></i>
              <div class="tip-information" ref="displayShow">
                <p>任务重要程度：</p>
                <p>公司重点任务，重要系数：4</p>
                <p>部门重点任务，重要系数：2</p>
                <p>个人重点任务，重要系数：1</p>
                <p>个人普通任务，重要系数：0.5</p>
                <!-- <p>个人重点任务有数量限制，所有重要任务中，只有20%为个人重点，超出部门要提示用户移除一个现有的个人重点任务</p> -->
              </div>
            </el-form-item>
            <el-form-item label="完成时间:" required style="margin-right: 40px !important;height:36px;">
              <el-form-item prop="date1">
                <el-date-picker type="date" :picker-options="pickerOptions0" placeholder="选择日期" v-model="ruleForm11.date1" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-form-item>
            <!-- <el-form-item label="自动重复时间:"   style="margin-right: 40px !important;">
              <el-select v-model="ruleForm.value6" placeholder="请选择自动回复时间" style="width:100%;" @change='choseTime'>
               <el-option
                 v-for="item in option2"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
               </el-option>
             </el-select>
            </el-form-item> -->
            <el-form-item label="任务内容：" prop="content" style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm11.content"></el-input>
            </el-form-item>
            <div v-show="stretch">
              <div class="user-wrapper" style="line-height:32px;margin-bottom:13px;margin-left:21px;">
                <div class='user-left'>任务协助人：</div>
                <div style="float:left;" class='user-right-wrapper'>
                  <div class='user-right'  @click='adduser'>添加协助人</div>
                  <div class="user-item" v-for='(item,index) in brr'>
                    <span>{{item.username}}（{{item.proportion}}%）</span>
                    <i class="el-icon-circle-close"  @click="removeTodo(index)"></i>
                  </div>

                </div>
              </div>
              <el-form-item label="关联项目:" style="margin-right: 40px !important;">
                <el-select v-model="ruleForm11.value7" placeholder="请选择关联项目"  style="width:100%;" @click='choseRelateProject'>
                  <el-option
                    v-for="item in projects"
                    :key="item.projectId"
                    :label="item.projectName"
                    :value="item.projectId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="任务可见范围:" style="margin-right: 40px !important;">
                <el-select  multiple v-model="ruleForm11.value71" placeholder="请选择部门"  style="width:100%;">
                  <el-option
                    v-for="item in depet"
                    :key="item.deptId"
                    :label="item.deptName"
                    :value="item.deptId">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div style="text-align: center">
              <div style="cursor: pointer" @click="Collapse">
                <span>{{msg}}</span>
                <i :class="stretch ? 'el-icon-arrow-up':'el-icon-arrow-down'"></i>
              </div>
            </div>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <button  @click="resetForm11('ruleForm11')">取 消</button>
            <button  @click="submitForm11('ruleForm11')">确认</button>
          </span>
        </el-dialog>
      </div>
      <div class="">
        <!--发布任务模态窗-->
        <el-dialog
          title='完成任务'
          :visible.sync="dialogVisible8"
          size="tiny"
          :before-close="handleClose8" top='23%' >
          <el-form :model="ruleForm4" :rules="rules" ref="ruleForm4" label-width="112px" class="demo-ruleForm">
            <el-form-item label="完成质量:" prop="mass" required style="margin-right: 40px !important;">
              <el-select v-model="ruleForm4.mass" placeholder="请选择完成质量" style="width:100%;" @change='completeMass'>
                <el-option
                  v-for="item in options3"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="快速点评:" prop="rate" required style="margin-right: 40px !important;">
              <el-select v-model="ruleForm4.rate" placeholder="请选择快速点评" style="width:100%;" @change='completeRate'>
                <el-option
                  v-for="item in options4"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务评价：" prop="rateContent" required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm4.rateContent"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <button  @click="resetForm8('ruleForm4')">取 消</button>
            <button  @click="submitForm8('ruleForm4')">确 认</button>
          </span>
        </el-dialog>
      </div>
      <div class="">
        <!--完成任务-->
        <el-dialog title="完成任务" :visible.sync="dialogVisible44" size="tiny" :before-close="handleClose44" top='25%' class=" noticeManageModel">
          <el-form :model="ruleForm44" :rules="rules" ref="ruleForm44" label-width="112px" class="demo-ruleForm">
            <el-form-item label="自我评价：" prop="cause4" required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm44.cause4"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <button  @click="resetForm44('ruleForm44')">取 消</button>
              <button  @click="submitForm44('ruleForm44')">确定</button>
            </span>
        </el-dialog>
      </div>
      <div class="">
        <!--添加协助人-->
        <el-dialog
          title="添加协助人"
          :visible.sync="dialogVisible15"
          size="tiny"
          :before-close="handleClose15" top='25%' class=" noticeManageModel">
          <el-form :model="ruleForm5" :rules="rules" ref="ruleForm5" label-width="112px" class="demo-ruleForm">
            <el-form-item label="姓名:" prop="username" style="margin-right: 40px !important;">
             <el-select v-model="ruleForm5.username" filterable placeholder="请选择协助人" style="width:100%;">
               <el-option
               v-for="item in usersT"
               :key="item.userId"
               :label="item.userName"
               :value="item.userId">
               </el-option>
             </el-select>
            </el-form-item>
            <el-form-item label="占比:" prop="percent" style="margin-right: 80px !important;" class='addPercent'>
              <el-input v-model.number="ruleForm5.percent"></el-input><span>%</span>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <button  @click="resetForm15('ruleForm5')">取 消</button>
            <button  @click="submitForm15('ruleForm5')">确定</button>
          </span>
        </el-dialog>
      </div>
      <div class="deleteDepartment">
        <el-dialog
          title="个人重点任务超出提醒"
          :visible.sync="dialogVisible21"
          size="tiny"
          :before-close="handleClose21" top='25%' class="department">
          <p>您/他当前的个人重点任务数量为：{{taskNumber}}</p>
          <p>您可将已有个人重点任务改为个人普通任务</p>
          <p>已超出数量限制</p>
          <p style='color: #D93437;'>是否确定修改？</p>
          <span slot="footer" class="dialog-footer">
            <button @click="dialogVisible21 = false">取 消</button>
            <button  @click='sureDelete'>确 定</button>
          </span>
        </el-dialog>
      </div>
      <div class="">
        <el-dialog title="重设任务等级" :visible.sync="dialogVisible22" size="tiny" :before-close="handleClose22" top='10%' class="">
          <div class="permissions-table">
            <div class="check-wrapper-special">
              <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="item in Taskoptions" :label="item.taskId" :key="item.taskId">{{item.title}}</el-checkbox>
              </el-checkbox-group>

            </div>
          </div>
          <span slot="footer" class="dialog-footer" style="margin-top:10px;">
              <button @click="checkDelete">取 消</button>
              <button @click="sureRole">确 定</button>
            </span>
        </el-dialog>
      </div>
    </div>
  </div>

</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
  import { getUserTaskDetail,getUserInfo,departmentList,listAllUsers,getStaffAssisTask,completeTask,editorUserInfo,getTaskType,impChangeOrdTask,getProjectList,publishTask,listTaskExecutors,getUsersObj,changeTaskLevel,assessTask,getStaffTask,delayTaskCause,cancelTaskCause,perfmRpRecordAdd,getRewardList,userTaskReply,getRpAmountByType,getStaffNewRecordList,manageStaffWeekly } from 'service/getData'
  import {  ERR_OK } from 'service/config'
//  import Tab from 'components/common/tab'
  import { mapGetters} from 'vuex'
  export default {
    data() {
      var checkName=(rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入用户名'));
        }
        setTimeout(() => {
          if (!(/^[\u2E80-\u9FFF]+$/.test(value))) {
            callback(new Error('姓名只能输入汉字'));
          } else {
            callback();
          }
        }, 50);
      };
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入电话号码'));
        }
        setTimeout(() => {
          if (!(/^1[34578]\d{9}$/.test(value))) {
            callback(new Error('电话号码输入有误'));
          } else {
            callback();
          }
        }, 50);
      };
      return {
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        isActive:true,
        isActive1:false,
        activeName:false,
        dialogVisible:false,
        dialogVisible1:false,
        dialogVisible3:false,
        dialogVisible8:false,
        dialogVisible12:false,
        dialogVisible15:false,
        dialogVisible11:false,
        dialogVisible21:false,
        dialogVisible22:false,
        dialogVisible44:false,
        searchType:'',
        searchLevel:'',
        serchContent:'',
        taskNumber:'',
        role:'',
        rolename:'',
        UserInfo:'',
        stretch:false,
        msg:"展开更多选项",
        taskId:'',
        hello:false,
        user:{},
        labelPosition: 'right',
        valType:'',
        title:'',
        placeholder:'',
        result:[],
        result1:[],
        expands: [],
        result2:[],
        result3:[],
        result6:[],
        checkedCities:[],
        checkedKey:[],
        projects:[],
        users:[],
        users15:[],
        usersT:[],
        optionsObj:[],
        optionsType:[],
        addUsers:[],
        brr:[],
        depet:[],
        ruleForm1: {
          cause: ''
        },
        ruleForm5: {
          username: '',
          percent:'',
        },
        ruleForm11: {
          name: '',
          value3:'',
          value4:'',
          value5:'',
          telObj:'',
          value7:'',
          value71:[],
          date1:'',
          content:'',
        },
        optionType: [],
        ruleForm3: {
          value3: '',
          cause3: '',
        },
        ruleForm4: {
          mass: '',
          rate: '',
          rateContent:''
        },
        options3: [{
         value: 'EXCELLENT',
         label: '优'
       }, {
       value: 'GOOD',
         label: '良'
       }, {
         value: 'SECONDARY',
         label: '中'
       }, {
         value: 'DIFFERENCE',
         label: '差'
       },
       {
         value: 'POOR',
         label: '很差'
       }
       ],
       options4: [{
         value: '继续努力',
          label: '继续努力'
        }, {
        value: '超出预期',
          label: '超出预期'
        }, {
          value: '任务完成非常出色',
          label: '任务完成非常出色'
        }
        ],
        options1: [{
          value: '',
          label: '请选择重要等级'
        }, {
          value: 'COMPANY',
          label: '公司重点'
        }, {
          value: 'DEPARTMENT',
          label: '部门重点'
        }, {
          value: 'PERSONALIMP',
          label: '个人重点'
        }, {
          value: 'PERSONALORD',
          label: '个人普通'
        }],
        optionsAmount:[],
        Taskoptions:[],
        total:100,
        total1:100,
        total2:100,
        total6:100,
        currentPage:1,
        total3:0,
        nowPage: 1,
        pageShow: 10,
        nowPage1: 1,
        pageShow1: 10,
        nowPage2: 1,
        pageShow2: 10,
        nowPage3: 1,
        pageShow3: 10,
        nowPage6: 1,
        pageShow6:10,
        num:0,
        formLabelAlign: {
          tel:"",
          username1:"",
          tel3:""
        },
        dialogVisible13:false,
        ruleForm2: {
          cause: '',
          date1: '',
        },
        ruleForm44: {
          cause4: '',
        },
        ruleForm:{
          username:"",
          type:"",
          amount:"",
          cause:""
        },
        rules: {
          tel: [{
            validator: checkAge,
          }
          ],
          username1: [{
            validator:checkName
          }, ],
          email3: [{
            required: true,
            message: '请输入邮箱号码',
          },
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
            }
          ],
          tel3: [{
            validator: checkAge,
          }
          ],
          userName: [
            { type: 'number',required: true, message: '请选择要惩罚的员工姓名'}
          ],
          type: [
            { type: 'number',required: true, message: '请选择惩罚类型' }
          ],
          amount: [
            {type: 'number', required: true, message: '请选择金额' }
          ],
           cause: [
             { required: true, message: '请输入原因'},
           ],
           telObj:
           [
             { required: true, message: '请选择任务汇报对象',type:'number'  },
           ],
           telObj13:
           [
             { required: true, message: '请选择任务汇报对象',type:'number'  },
           ],
           score:
           [
             { required: true, message: '请选择任务分值'},
           ],
           mass:
           [
             { required: true, message: '请选择完成质量'},
           ],
           rate:
           [
             { required: true, message: '请选择快速评价'},
           ],
           rateContent:
           [
             { required: true, message: '请填写任务评价'},
           ],
           titlen:
           [
             { required: true, message: '请填写任务标题'},
           ],
           name: [
             { required: true, message: '请输入任务标题'},
           ],
           name13: [
             { required: true, message: '请输入任务标题'},
           ],
           grades: [
             { required: true, message: '请选择重要等级'},
           ],
           becomCuase1: [
             { required: true, message: '请填写审核原因'},
           ],
           taskname: [
             { required: true, message: '请填写任务类型名称'},
           ],
           becomCuase2: [
             { required: true, message: '请填写审核原因'},
           ],
           becomCuase3: [
             { required: true, message: '请填写审核原因'},
           ],
           becomCuase4: [
             { required: true, message: '请填写审核原因'},
           ],
           delayCause: [
             { required: true, message: '请填写延期原因'},
           ],
           cancleCause: [
             { required: true, message: '请填写取消原因'},
           ],
           username: [
             { required: true, message: '请填写姓名', type:'number' },
           ],
           percent: [
             { required: true, message: '请填写占比'},
             { type: 'number', message: '占比必须为数字值'}
           ],
           percent1: [
             { required: true, message: '请填写占比'},
             { type: 'number', message: '占比必须为数字值'}
           ],
           // cause: [
           //   { required: true, message: '请输入取消原因', trigger: 'blur' },
           // ],
           cause1: [
             { required: true, message: '请输入延期原因' },
           ],
           cause3: [
             { required: true, message: '请输入变更原因'},
           ],
           cause4: [
             { required: true, message: '请输入自我评价'},
           ],
           region1: [
             { required: true, message: '请选择关联项目'},
           ],
           date1: [
             { type: 'date', required: true, message: '请选择日期'}
           ],
           date2: [
             { type: 'date', required: true, message: '请选择日期'}
           ],
           date13: [
             { type: 'date', required: true, message: '请选择日期'}
           ],
           dateM: [
             { type: 'date', required: true, message: '请选择日期' }
           ],
           choseTimen: [
             { type: 'date', required: true, message: '请选择日期'}
           ],
           region: [
             { required: true, message: '请选择活动区域'}
           ],
           content: [
             { required: true, message: '请输入任务内容'},
           ],
           value3: [
             { required: true, message: '请选择任务重要等级'},
           ],
           value13: [
             { required: true, message: '请选择任务重要等级'},
           ],
           imporLeveln: [
             { required: true, message: '请选择任务重要等级'},
           ],
           value4: [
             { required: true, message: '请选择任务类型',type:'number' },
           ],
           value14: [
             { required: true, message: '请选择任务类型',type:'number' },
           ],
           taskTypeF: [
             { required: true, message: '请选择任务类型',type:'number' },
           ],
           value5: [
             { required: true, message: '请选择任务执行人'},
           ],
           value15: [
             { required: true, message: '请选择任务执行人',type:'number' },
           ],
           goUser: [
             { required: true, message: '请选择任务执行人',type:'number' },
           ],
           value6: [
             { required: true, message: '请选择自动回复时间' },
           ],
           value16: [
             { required: true, message: '请选择自动回复时间' },
           ],
           value7: [
             { required: true, message: '请输入公告内容'},
           ],
           value17: [
             { required: true, message: '请输入公告内容'},
           ],
         },
        tabs: ["未完成任务", "已完成任务","我协助的任务","奖惩信息","周报信息"],
      };
    },
    components: {
//      Tab
    },
    mounted(){
      this.getData()
      this.getStaffTask1()
      this.getStaffTask2()
      this.getStaffNewRecordList1()
      this.manageStaffWeekly1()
      this._getRewardList()
      //this._getRpAmountByType()
      this.getTaskType1()
      this.getUsersObj1()
      this.listAllUsers1()
      this.listAllUsers2()
      this.getProjectList1()
      this.myAssisTask()
      this.listAllUsersT()
      this.departmentList1()
    },
    computed:{
      userView() {
        return this.singer.userView
      },
      ...mapGetters([
        'singer'
      ]),
    },
    created () {
      this.id =this.$route.query.id
    },
    methods: {
      openDetails(row, event, column) {
        Array.prototype.remove = function (val) {
          let index = this.indexOf(val);
          if (index > -1) {
            this.splice(index, 1);
          }
        };

        if (this.expands.indexOf(row.taskId) < 0) {
          this.expands=[]
          this.expands.push(row.taskId);
        } else {
          this.expands.remove(row.taskId);
        }

      },
      //获取部门
      departmentList1(){
        let self = this
        departmentList().then((res) => {
          if(res.code == ERR_OK) {
            let data = res
            self.depet = data.data.result
            self.depet.unshift(
              {deptId:0,
              deptName:'公司'}
            )
          }
       })
      },
      listAllUsersT() {
        listAllUsers().then((res) => {
          if(res.code == ERR_OK) {
            this.usersT = res.data
          }
       })
      },
      //      则面板
      Collapse(){
        this.stretch=!this.stretch
        if(this.stretch){
          this.msg="收起更多选项"
        }else{
          this.msg="展开更多选项"
        }
      },
      search(){
        this.getStaffTask2()
      },
      // 我的任务完成
      handleClose44(done) {
        this.dialogVisible44 = false
        this.$refs['ruleForm44'].resetFields();
      },
      submitForm44(formName1) {
        let self = this
        this.$refs[formName1].validate((valid) => {
          if (valid) {
            const params = {
              taskId: self.taskId,
              comment: self.ruleForm44.cause4
            }
            completeTask(params).then((res) => {
              if (res.code == ERR_OK) {
                self.dialogVisible44 = false
                self.getData()
                this.$notify({
                  title: '成功',
                  message: '完成任务已发送',
                  type: 'success'
                });
              } else {
                this.$notify.error({
                  title: '错误',
                  message: res.msg
                });
              }
            })
          } else {
            return false;
          }
        });
      },
      resetForm44(formName1) {
        this.dialogVisible44 = false
        this.$refs[formName1].resetFields();
      },
      edtorInformation(){
        this._getUserInfo()
        this.dialogVisible13 = true
      },
      resetForm13(formName) {
        this.dialogVisible13 = false
        this.$refs[formName].resetFields();
      },
      submitForm13(formName) {
        let self = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogVisible13 = false
             this._editorUserInfo()
          } else {
            return false;
          }
        });
      },
      //      更好用户名
      _editorUserInfo(){
        const params = {
          userId:this.userId,
          userName:this.formLabelAlign.username1,
          telephone:this.formLabelAlign.tel3,
          email:this.formLabelAlign.email3
        }
        editorUserInfo(params).then((res) => {
          if (res.code == ERR_OK) {
            this.$notify({
              title: '成功',
              message: '修改个人信息成功',
              type: 'success'
            });
          }
        })
      },
      _getUserInfo(){
        getUserInfo().then((res) =>{
          if(res.code==ERR_OK){
            this.UserInfo=res.data;
            this.formLabelAlign.username1=res.data.userName
            this.formLabelAlign.tel3=res.data.telephone
            this.formLabelAlign.email3=res.data.email
            this.userId=res.data.userId
            this.role=res.data.roleName.split(',')
            this.rolename=res.data.roleName.split(',').join("+")
          }

        })
      },
      handleClose13(done) {
        this.dialogVisible13 = false
        this.$refs['formLabelAlign'].resetFields()
      },
      handleClose22(done) {
        this.dialogVisible22 = false
        this.dialogVisible21 = false
      },
      //降为个人普通等级的任务
      sureRole(){
        if(this.checkedValue.length>0){
          var str = this.checkedValue.join(',')
          const params = {
            taskId:str
          }
          impChangeOrdTask(params).then((res) => {
            if (res.code == ERR_OK) {
              this.dialogVisible22 = false
              //this.dialogVisible11 = false
              this.$notify({
                title: '成功',
                message: '任务成功降为个人普通等级',
                type: 'success'
              });
            }else{
              this.$notify.error({
                title: '错误',
                message: res.msg
              });
            }
          })
        }else{
          this.$notify({
           title: '提示',
           message: '请选择要降为个人普通等级的任务',
         });
        }

      },
      // 勾选任务
      handleCheckedCitiesChange(val) {
        this.checkedValue = val
//        console.log(this.checkedValue)
      },
      checkDelete(){
        this.dialogVisible22 = false
        //this.dialogVisible11 = false
      },
      // 任务超出确认
      sureDelete(){
        this.checkedCities = []
        this.checkedKey = []
        this.dialogVisible21 = false
        this.dialogVisible22 = true
      },
      handleClose21(){
        this.dialogVisible21 = false
      },
      handleClose11(done) {
        this.dialogVisible11 = false
        this.$refs['ruleForm11'].resetFields();
      },
      submitForm11(formName) {
        let self = this
        //console.log(this.ruleForm.value5 )
        var value71 = this.ruleForm11.value71.join(',')
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let d = new Date(self.ruleForm11.date1)
            let time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
            this.dialogVisible = false
            const params = {
              title:self.ruleForm11.name,
              taskTypeId:self.ruleForm11.value4,
              executorId:self.ruleForm11.value5,
              reportId:self.ruleForm11.telObj,
              projectId:self.ruleForm11.value7,
              grade:self.ruleForm11.value3,
              ptaskAssists:JSON.stringify(self.addUsers),
              planEndDate:time,
              visibleRange:value71,
              //repeatMode:self.ruleForm.value6,
              content:self.ruleForm11.content
            }
            publishTask(params).then((res) => {
              if(res.code == ERR_OK) {
                self.dialogVisible11 = false
                self.getData()
                self.getStaffTask1()
                self.getStaffTask2()
                self.getStaffNewRecordList1()
                self.manageStaffWeekly1()
                self.$notify({
                  title: '成功',
                  message: '发起任务成功',
                  type: 'success'
                });
                 this.$refs['ruleForm11'].resetFields();
              }else{
                 //self.$message.error(res.msg);
                 self.dialogVisible21 = true
                 self.taskNumber = res.data.length
                 self.Taskoptions = res.data
              }
           })
          } else {
            return false;
          }
        });
      },
      resetForm11(formName) {
        this.dialogVisible11 = false
        this.$refs[formName].resetFields();
      },
      removeTodo(index){
         this.brr.splice(index, 1);
         this.addUsers.splice(index, 1);
      },
      handleClose15(done) {
        this.dialogVisible15 = false
        this.$refs['ruleForm5'].resetFields();
      },
      submitForm15(formName1) {
        let self = this
        this.$refs[formName1].validate((valid) => {
          if (valid) {
            if(self.ruleForm5.username === self.ruleForm11.value5){
              self.$notify.error({
                title: '错误',
                message:'执行人和协助人不能相同',
              });
              return
            }
            if(self.addUsers.length>0){
              for(let item of self.addUsers){
                if(item.assistUserId === self.ruleForm5.username){
                  self.$notify.error({
                    title: '错误',
                    message:'不能选择相同的协助人',
                  });
                  return
                }
              }
            }
            self.dialogVisible15 = false
            let obj = {
              assistUserId:self.ruleForm5.username,
              proportion:self.ruleForm5.percent
            }
            self.addUsers.push(obj)
            this.brr = []
            for(var i=0;i<self.usersT.length;i++){
              for(var j=0;j<self.addUsers.length;j++){
                if(self.usersT[i].userId===self.addUsers[j].assistUserId){
                  self.brr.push(
                    {
                      username:self.usersT[i].userName,
                      proportion:self.addUsers[j].proportion
                    }
                  )
                }
              }
            }
//            console.log(self.brr)
          } else {
            return false;
          }
        });
      },
      resetForm15(formName1) {
        this.dialogVisible15 = false
        this.$refs[formName1].resetFields();
      },
      handleClose15(done) {
        this.dialogVisible15 = false
        this.$refs['ruleForm5'].resetFields();
      },
      //鼠标移入效果
      iconEnter(){
        this.$refs.displayShow.style.display = 'block'
      },
      iconLeave(){
        this.$refs.displayShow.style.display = 'none'
      },
      choseRelateProject(val){
        this.ruleForm11.value7 = val
      },
      // 模态框的选择任务类型
      choseTaskType1(val) {
        this.ruleForm11.value4 = val
      },
      //我协助的
      myAssisTask () {
        const params = {
          id:this.id,
          nowPage:this.nowPage6,
          pageShow:this.pageShow6
        }
        getStaffAssisTask(params).then((res) => {
          if(res.code == ERR_OK) {
            this.result6 = res.data.result
            this.total6 = res.data.totalCount
          }
       })
     },
      //关联项目
      getProjectList1 () {
        getProjectList().then((res) => {
          if(res.code == ERR_OK) {
            this.projects = res.data.result
            this.projects.unshift({
             projectId:'',
             projectName: '请选择关联项目'
           })
          }
       })
     },
      // 任务执行人
      listAllUsers1() {
        listTaskExecutors().then((res) => {
          if(res.code == ERR_OK) {
            this.users = res.data
           for(let i in this.users){
             if(this.users[i].userId==this.id){
               this.ruleForm11.value5 = this.users[i].userId
             }
           }

          }
       })
      },
      // 任务执行人
      listAllUsers2() {
        listTaskExecutors().then((res) => {
          if(res.code == ERR_OK) {
            this.users15 = res.data
            this.users15.unshift({
             userId:'',
             userName: '请选择协助人'
           })
          }
       })
      },
      //任务汇报对象
       getUsersObj1 (){
         getUsersObj().then((res) => {
           if(res.code == ERR_OK) {
             this.optionsObj = res.data
             for(let i in this.optionsObj){
               if(this.optionsObj[i].checked==true){
                 this.ruleForm11.telObj = this.optionsObj[i].userId
               }
             }
           }
        })
      },
      mindTask () {
        this.dialogVisible11 =true
        this.addusers = []
        this.brr = []
        this.ruleForm.value7=""
        this.ruleForm.value71=[]
      },
      // 点击添加协助人
      adduser(){
        this.dialogVisible15 = true
      },
      //点击完成
      levelComeplete(val,key,event) {
        var e = event;
        if(e&&e.stopPropagation){
            e.stopPropagation()
        }else if(window.event){
            window.event.cancelBubble=true;
        }
        this.taskId = val
        if(key==true){
          this.dialogVisible44 = true
        }else{
          this.dialogVisible8 = true
        }

      },
      completeMass(val){
        this.ruleForm4.mass = val
      },
      completeRate(val){
        this.ruleForm4.rate = val
        this.ruleForm4.rateContent = val
      },
      handleClose8 (){
        this.dialogVisible8 = false
        this.$refs['ruleForm4'].resetFields();
      },
      submitForm8(formName) {
        let self =this
        this.$refs[formName].validate((valid) => {
          if (valid) {
          const params =　{
            taskId:self.taskId,
            finishQuality:self.ruleForm4.mass,
            changeContent:self.ruleForm4.rateContent
          }
          assessTask(params).then((res) => {
            if(res.code == ERR_OK) {
              this.dialogVisible8 = false
              self.getStaffTask1()
              this.$notify({
                title: '成功',
                message: '评价完成',
                type: 'success'
              });
            }else{
              this.$notify.error({
                title: '失败',
                message: res.msg
              });
            }
          })
          } else {
            return false;
          }
        });
      },
      resetForm8(formName) {
        this.dialogVisible8 = false
        this.$refs[formName].resetFields();
      },
      //等级变更
      levelChange(val,event) {
        var e = event;
        if(e&&e.stopPropagation){
            e.stopPropagation()
        }else if(window.event){
            window.event.cancelBubble=true;
        }
        this.taskId = val
        this.dialogVisible3 = true
      },
      handleClose3(done) {
        this.dialogVisible3 = false
        this.$refs['ruleForm3'].resetFields();
      },
      submitForm3(formName1) {
        let self = this
        this.$refs[formName1].validate((valid) => {
          if (valid) {
            self.dialogVisible3 = false
            const params = {
              taskId: self.taskId,
              grade: self.ruleForm3.value3,
              reason: self.ruleForm3.cause3
            }
            changeTaskLevel(params).then((res) => {
              if (res.code == ERR_OK) {
                self.dialogVisible3 = false
                self.getStaffTask1()
                self.$notify({
                  title: '成功',
                  message: '申请变更任务重要等级已发送',
                  type: 'success'
                });
              } else {
                //self.$message.error(res.msg);
                self.dialogVisible21 = true
                self.taskNumber = res.data.length
                self.Taskoptions = res.data
              }
            })
          } else {
            return false;
          }
        });
      },
      resetForm3(formName1) {
        this.dialogVisible3 = false
        this.$refs[formName1].resetFields();
      },
      choseLevel3(val) {
        this.ruleForm3.value3 = val
      },
      // 获取任务类型
      getTaskType1() {
        getTaskType().then((res) => {
          if (res.code == ERR_OK) {
            this.optionType = res.data
            this.optionType.unshift({
              taskTypeId: '',
              taskTypeName: '请选择任务类型'
            })
          }
        })
      },
      handleClose12(done) {
        this.dialogVisible12 = false
        this.$refs['ruleForm2'].resetFields();
      },

      submitForm12(formName1) {
        let self = this
        //console.log(self.ruleForm2.date1)
        let d = new Date(self.ruleForm2.date1)
        let time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
        this.$refs[formName1].validate((valid) => {
          if (valid) {
            const params = {
              taskId:self.taskId,
              reason:self.ruleForm2.cause1,
              delayDate:time
            }
            delayTaskCause(params).then((res) => {
              if(res.code == ERR_OK) {
                self.dialogVisible12 = false
                self.getStaffTask1()
                self.$notify({
                  title: '成功',
                  message: '申请任务延期已发送',
                  type: 'success'
                });
              }else{
                self.$notify.error({
                  title: '失败',
                  message:res.msg
                });
              }
           })
          } else {
            return false;
          }
        });
      },
      resetForm12(formName1) {
        this.dialogVisible12 = false
        this.$refs[formName1].resetFields();
      },
      //延迟
      delay (val,event) {
        var e = event;
        if(e&&e.stopPropagation){
            e.stopPropagation()
        }else if(window.event){
            window.event.cancelBubble=true;
        }
        this.taskId = val
        this.dialogVisible12 = true
      },
      //取消
      cancle (val,event) {
        var e = event;
        if(e&&e.stopPropagation){
            e.stopPropagation()
        }else if(window.event){
            window.event.cancelBubble=true;
        }
        this.taskId = val
        this.dialogVisible1 = true
      },
      handleClose1(done) {
        this.dialogVisible1 = false
        this.$refs['ruleForm1'].resetFields();
      },
      submitForm1(formName1) {
        let self = this
        this.$refs[formName1].validate((valid) => {
          if (valid) {
            const params = {
              taskId:self.taskId,
              reason:self.ruleForm1.cause
            }
            cancelTaskCause(params).then((res) => {
              if(res.code == ERR_OK) {
                self.dialogVisible1 = false
                this.getStaffTask1()
                this.$notify({
                  title: '成功',
                  message: '申请取消原因已发送',
                  type: 'success'
                });
              }else{
                this.$notify.error({
                  title: '失败',
                  message: res.msg
                });
              }
           })
          } else {
            return false;
          }
        });
      },
      resetForm1(formName1) {
        this.dialogVisible1 = false
        this.$refs[formName1].resetFields();
      },
      changeType(){
        this._getRpAmountByType()
      },
      cancelStart(formName){
        this.$refs[formName].resetFields();
        this.dialogVisible=false
      },
      sureStart(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this._perfmRpRecordAdd()
            this.dialogVisible=false
          } else {
            return false;
          }
        });
      },
      //发起惩罚接口
      _perfmRpRecordAdd(){
        var param
        // 0代表是惩罚
       if(this.valType==0){
          param={
           userId:this.id,
           rpAmount:this.ruleForm.amount,
           rpType:"PUNISH",
           rpReason:this.ruleForm.cause
         }
       }
       // 1代表是奖励
        if(this.valType==1){
          param={
            userId:this.id,
            rpAmount:this.ruleForm.amount,
            rpType:"REWARD",
            rpReason:this.ruleForm.cause
          }
        }
        perfmRpRecordAdd(param).then((res) =>{
          if (res.code == ERR_OK) {
           this.getData()
            this.$refs['ruleForm'].resetFields()
           if(this.valType==0){
             this.$notify({
               title: '成功',
               message: '发起惩罚成功',
               type: 'success'
             });
           }
           if(this.valType==1){
             this.$notify({
               title: '成功',
               message: '发起奖励成功',
               type: 'success'
             });
            }
          }
        })
      },
      //发起惩罚模态窗
      handleClose(){
        this.dialogVisible=false
        this.$refs['ruleForm'].resetFields()
      },
      //获取奖惩类型列表
        _getRewardList(){
          getRewardList().then((res) =>{
            if (res.code == ERR_OK) {
               this.optionsType=res.data.result;
              if(res.data.result.length>0){
                this.ruleForm.type=res.data.result[0].rpTypeId;
                this._getRpAmountByType()
              }
            }
          })
        },
        //金额
        _getRpAmountByType(){
          var param={
            rpTypeId:this.ruleForm.type
          };
          getRpAmountByType(param).then((res) =>{
            if (res.code == ERR_OK) {
              this.optionsAmount=res.data;
            }
          })
        },
      //   发起惩罚
      initiate(val){
        this.valType=val
        this.title="发起惩罚";
        this.placeholder = '选择要惩罚的员工姓名'
        this.dialogVisible=true
      },
      //      发起奖励
      reward(val){
        this.valType=val
        this.title="发起奖励"
        this.placeholder = '选择要奖励的员工姓名'
        this.dialogVisible=true
      },
      tab(index) {
        this.num = index
      },
      handleSizeChange(val) {
//        console.log(`每页 ${val} 条`);
        this.pageShow = val
        this.getStaffTask1()
      },
      handleSizeChange1(val) {
//        console.log(`每页 ${val} 条`);
        this.pageShow1 = val
        this.getStaffNewRecordList1()
      },
      handleSizeChange2(val) {
//        console.log(`每页 ${val} 条`);
        this.pageShow2 = val
        this.getStaffTask2()
      },
      handleCurrentChange2(val) {
//        console.log(`当前页: ${val}`);
        this.nowPage2 = val
        this.getStaffTask2()
      },
      handleSizeChange3(val) {
//        console.log(`每页 ${val} 条`);
        this.pageShow3 = val
        this.manageStaffWeekly1()
      },
      handleSizeChange6(val) {
//        console.log(`每页 ${val} 条`);
        this.pageShow6 = val
        this.myAssisTask()
      },
      handleCurrentChange3(val) {
//        console.log(`当前页: ${val}`);
        this.nowPage3 = val
        this.manageStaffWeekly1()
      },
      handleCurrentChange6(val) {
//        console.log(`当前页: ${val}`);
        this.nowPage6 = val
        this.myAssisTask()
      },
      handleCurrentChange1(val) {
//        console.log(`当前页: ${val}`);
        this.nowPage1 = val
        this.getStaffNewRecordList1()
      },
      replyTask(index, val) {
        let el = event.target.parentNode.childNodes[0].value
        this.taskId = val
        let self = this
        const params = {
          taskId: this.taskId,
          replyDesc: el
        }
        if(el.length>200){
          this.$notify({
          title: '提示',
          message:'回复内容不能超过200个字符'
          });
        }else{
          userTaskReply(params).then((res) => {
            if (res.code == ERR_OK) {
              self.getStaffTask1()
              self.getStaffTask2()
              self.myAssisTask()
              self.$notify({
                title: '回复成功',
                message: '恭喜你，回复成功',
                type: 'success'
              })
            }else{
              self.$notify.error({
                title: '错误',
                message: res.msg
              })
            }
          })
        }
      },
      getStaffNewRecordList1(){
        const params = {
          userId: this.id,
          nowPage:this.nowPage1,
          pageShow:this.pageShow1
        }
        getStaffNewRecordList(params).then((res) => {
          if (res.code == ERR_OK) {
             this.total1 = res.data.totalCount
             this.result1 = res.data.result
          }
        })
      },
      manageStaffWeekly1(){
        const params = {
          userId: this.id,
          nowPage:this.nowPage3,
          pageShow:this.pageShow3
        }
        manageStaffWeekly(params).then((res) => {
          if (res.code == ERR_OK) {
             this.total3 = res.data.totalCount
             this.result3 = res.data.result
          }
        })
      },
      handleCurrentChange(val) {
//        console.log(`当前页: ${val}`);
        this.nowPage = val
        this.getStaffTask1()
      },
      getData(){
          let self = this
          const params = {
            id:this.id
          }
          getUserTaskDetail(params).then((res) => {
            if (res.code == ERR_OK) {
              this.user = res.data
            }
          })
      },
      getStaffTask1(){
        let self = this
        const params = {
          id:this.id,
          completed:false,
          nowPage:this.nowPage,
          pageShow:this.pageShow
        }
        getStaffTask(params).then((res) => {
          if (res.code == ERR_OK) {
            self.total = res.data.totalCount
            self.result = res.data.result
          }
        })
      },
      getStaffTask2(){
        let self = this
        const params = {
          id:this.id,
          completed:true,
          nowPage:this.nowPage2,
          pageShow:this.pageShow2,
          taskTypeId: this.searchType,
          grade: this.searchLevel,
          title: this.serchContent
        }
        getStaffTask(params).then((res) => {
          if (res.code == ERR_OK) {
            self.total2 = res.data.totalCount
            self.result2 = res.data.result
          }
        })
      }
    }
  };
</script>
<style type="text/ecmascript-6">
  .user-information{
    border: 1px solid rgba(0,0,0,0.12);
    height:216px;
    
    margin: 0 auto;
  }
  .uncomplete-task{
    /*border-left: 1px solid rgba(0,0,0,0.12);*/
    overflow: hidden;
    
    margin: 20px auto;

  }
  .user-title{
    opacity: 0.99;
    border: 1px solid rgba(0,0,0,0.12);
    border-bottom: none;
    background: rgba(217,52,55,0.10);
    height: 47px;
    line-height: 46px;
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;
  }
  .title-name{
    float: left;
    color: #333333;
    margin-left: 20px;
  }
  .take-reward{
    height:30px;
    width: 86px;
    text-align: center;
    background: #D93538;
    border-radius: 4px;
    color: #FFFFFF;
    margin-top: 8px;
    float: right;
    line-height: 30px;
    margin-right: 29px;
    cursor: pointer;
  }
  .user-content{
    width: 100%;
    padding: 0 20px;
    /*height: 170px;*/
    padding-top:17.5px;
  }
  .user-content ul li{
    width: 32.8%;
    float: left;
    height:27px;
    font-size: 12px;
    color: #434343;
    line-height: 27px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;

  }

  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #505363;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 25%;
  }
  .demo-table-expand .el-form-item:first-child {
    width: 340px;
    overflow: hidden;
  }
  .demo-table-expand .el-form-item:nth-child(2) {
    width: 330px;
    overflow: hidden;
  }
  .demo-table-expand .el-form-item:nth-child(3) {
    width: 155px;
    overflow: hidden;
  }
  .demo-table-expand .el-form-item:nth-child(4) {
    width: 255px;
    overflow: hidden;
  }
.content-tab{
  line-height: 17px;
  display: block;
  font-size: 12px;
  padding: 0 53px 0 0;
  min-width: 297px;
}
.input-back input{
  height:24px;
  width: 225px;
  padding-left: 6px;
  border: 1px solid #979797;
}
.input-back span{
  height:24px;
  width: 48px;
  display: inline-block;
  background: #D93437;
  line-height: 24px;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  text-align: center;
}
.reback{
  font-size: 12px;
  color: #505363;
  line-height: 28px;
  background: #DFDFDF;
  padding-left: 10px;
}
.reback-time{
  text-align: left;
  font-size: 12px;
  color: #505363;
  line-height: 12px;
  margin-bottom: 5px;
  margin-top: 5px;
}
.reback1{
  line-height: 17px;
  padding-left: 0px;
  background: transparent;
}
.special{
  color: transparent;
}
.title-left{
  float: left;
}
.title-left span:first-child{
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 9px;
  background: #F04134;
}
.title-right{
  float: left;
  margin-left: 35px;
}
.red{
  color: #D93437 !important;
}
.green{
  color: #478000 !important;
}
.seename{
  background: transparent;
  border: none;
  cursor: pointer;
  color: #D93437;
}


.title-name{
  float: left;
  padding: 0 14px;
  color: #333333;
  text-align: center;
  box-sizing: border-box;
  height:46px;
  cursor: pointer;
}
.special1{
  position: relative;
}
.special1 .el-icon-information{
  position: absolute;
  right: -61px;
  top:11px;
}
.special1 .addTaskType{
  position: absolute;
  right: -91px;
  top:2px;
  width:80px;
  height:30px;
  line-height: 30px;
  text-align: center;
  font-size: 12px;
  color: #D93437;
  border: 1px solid #D83436;
  border-radius: 4px;
  cursor: pointer;
}
.tip-information{
  position: absolute;
  right: -61px;
  top:40px;
  display: none;
  z-index: 10;
  padding-left: 15px;
  line-height: 16px;
  padding-top: 18px;
  padding-bottom: 20px;
  padding-right: 6px;
  font-size: 12px;
  color: #FFFFFF;
  margin-right: 15px;
  background: rgba(0,0,0,0.80);
}
.title-name1{
  margin-left: 54px;
  width: 112px !important;
}
.title-name2{
  width: 112px !important;
}
.title-name.active{
  color: #D93538;
  border-bottom:2px solid #D93538;
}
.user-wrapper::after{
  content: "";
  display: block;
  clear: both;
}
.user-left,.user-right,.user-item{
  float: left;
}
.user-right-wrapper{
  width: 392px;
  margin-left: 10px;
}
.user-item span{
  width: 95px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  display: inline-block;
}
.user-item{
  position: relative;
  width: 95px;
  height:30px;
  line-height: 30px;
  border: 1px solid #999999;
  border-radius: 4px;
  font-size: 12px;
  color: #333333;
  overflow:inherit;
  text-align: center;
  margin-right: 15px;
  margin-bottom: 10px;

}
.user-item i{
  position: absolute;
  z-index: 100;
  color:#999;
  top: -7px;
  right: -7px;
}
.user-right{
  width: 110px;
  height:30px;
  cursor: pointer;
  line-height: 30px;
  text-align: center;
  border: 1px solid #D83436;
  border-radius: 4px;
  font-size: 14px;
  color: #D93437;
  margin-right: 15px;
  margin-bottom: 10px;
}
.addPercent{
  position: relative;
}
.addPercent span{
  position: absolute;
  right:-25px;
}
.role-title {

  height: 46px;
  line-height: 46px;
  opacity: 0.99;
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(217,52,55,0.02);
  border-bottom: none;
}
.role-num {
  float: left;
  font-size: 14px;
  color: #333333;
}
.role-time{
  margin-left:674px !important;
}
.role-list{
  margin-left:879px !important;
}
.role-list1{
  margin-left:20px;
}
.role-num:nth-child(1) {
  margin-left: 20px;
}
.role-num:nth-child(2) {
  margin: 0 35px;
}
.button-perform{
  float: left;
  height: 24px;
  line-height: 24px;
  width: 75px;
  margin-top: 11px;
  margin-left: 70px;
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 4px;
  text-align: center;
  font-size: 12px;
  color: #434245;
  cursor: pointer;
}
.attendance_search{
  float: left;
  margin-left: 35px;
}
.content-task{
  float: left;
  width: 190px;
  font-size: 12px;
  margin-top: 11px;
}
</style>
