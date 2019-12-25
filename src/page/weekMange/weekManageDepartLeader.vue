<template>
  <div class='task-manage'>
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <router-link to="/weekManageDepartLeader">
          <span class="child1">周报管理</span>
        </router-link>
        /
        <router-link to="/weekManageDepartLeader">
          <span class="child2">周报列表</span>
        </router-link>
      </div>
      <div class="title-header">
        <div class="week-title">
          周报概要
        </div>
        <div class="week-date" >
          {{startDay}} 至 {{endDay}}
        </div>
        <router-link to="/reviewWeekly">
          <el-button
            size="small"
            :plain="true"  style="float:right;margin-top:9px;margin-right:120px;background:transparent;" >审阅个人周报({{deptWeeklySize}})</el-button>
          <!-- <div class="week-button1">
            审阅个人周报{{deptWeeklySize}}
          </div> -->
        </router-link>
          <el-button
            size="small"
            :plain="true" :disabled="true" v-if='canPublish==false' class='disable-button' v-cloak style="float:right;margin-top:9px;margin-right:20px;background:transparent;" >发起个人周报</el-button>
        <router-link to="/staffPersonEditor" v-if='canPublish==true' v-cloak>
          <el-button
            size="small"
            :plain="true"  v-if='canPublish==true' v-cloak style="float:right;margin-top:9px;margin-right:20px;background:transparent;" >发起个人周报</el-button>
        </router-link>
        <span v-if='canPublishDept'>
        <router-link to="/postDepartWeekly" v-if='commentCompleted!=false' v-cloak>
        <el-button
          size="small"
          :plain="true"  style="float:right;margin-top:9px;margin-right:20px;background:transparent;" >发起部门周报</el-button>
            </router-link>
        <router-link to="/reviewWeekly" v-if='commentCompleted==false' v-cloak>
          <el-button
            size="small"
            :plain="true"  style="float:right;margin-top:9px;margin-right:20px;background:transparent;" >发起部门周报</el-button>
          <!-- <div class="week-button2">
            发起部门周报
          </div> -->
        </router-link>
        </span>
        <span v-else>
          <el-button
            size="small"
            :plain="true" :disabled="true" class='disable-button'  style="float:right;margin-top:9px;margin-right:20px;background:transparent;" >发起部门周报</el-button>
        </span>
        <router-link to="/pastWeekly">
          <el-button
            size="small"
            :plain="true"  style="float:right;margin-top:9px;margin-right:20px;background:transparent;" >查看过往周报</el-button>
          <!-- <div class="week-button2">
            查看过往周报
          </div> -->
        </router-link>
      </div>
      <div class="circle-wrapper">
        <div class="circle-name">
          <div class="circle-content">
            {{taskTotal}}
          </div>
          <span>任务总数</span>
        </div>
        <div class="circle-name">
          <div class="circle-content">
            {{cimpTaskSize}}
          </div>
          <span>公司重点任务数</span>
        </div>
        <div class="circle-name">
          <div class="circle-content">
            {{dimpTaskSize}}
          </div>
          <span>部门重点任务数</span>
        </div>
        <div class="circle-name">
          <div class="circle-content">
            {{pimpTaskSize}}
          </div>
          <span>个人重点任务数</span>
        </div>
      </div>
      <div class="week-bar">
        <div  class="week-next">
          下次提交周报时间：{{nextSubmitDate}}
        </div>
        <div class="week-next week-next1">
          距下次提交周报还剩：{{nextSubmitDayLeft}}天
        </div>
      </div>
      <div class="special-title">
        <h4>一、任务列表</h4>
      </div>
      <div class="perform-title" style='margin-top:0px;'>
        <h4>1、公司重点</h4>
      </div>
      <div class="overHide">
        <div class="icon-name" @mouseenter="enter($event)" @mouseleave="leave($event)">
          <i class="el-icon-information"></i>
          <span>{{nextStartDay}} - {{nextEndDay}}</span>
        </div>
        <div class="icon-name" style="right:338px;" @mouseenter="enter($event)" @mouseleave="leave($event)">
          <i class="el-icon-information"></i>
          <span>{{startDay}} - {{endDay}}</span>
        </div>
        <el-table :data="tableDataCompany"  class="company" row-key="taskId" :expand-row-keys="expands" @row-click="openDetails"
                  style="width: 100%" empty-text='本周暂无公司重点任务'>
          <el-table-column
            label="序号"
            width="70"
          >
            <template slot-scope="props">
              <span>1.{{props.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="内容:">
                  <span class='content-tab'>{{ props.row.content }}</span>
                </el-form-item>
                <el-form-item>
                  <div class="input-back">
                    <input type="text" name="" value="" class='inputValue'>
                    <span class='replyValue' @click='replyTask(props.row.index,props.row.taskId,$event)'>回复</span>
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
                <el-form-item>
                  <template>
                      <div>总结:</div>
                      <div v-for="item in props.row.taskWeeklyRelaSummaryEntitys">
                        <span class='content-tab' v-if="item.commentType=='PERSON'"> {{item.userName}}:{{item.summary}} </span>
                        <span class='content-tab' v-if="item.commentType=='DEPTHEADER'">{{item.userName}}:{{item.summary}} </span>
                        <span class='content-tab' v-if="item.commentType=='SECOND_DEPTHEADER'">{{item.userName}}:{{item.summary}} </span>
                        <span class='content-tab' v-if="item.commentType=='MANAGER'">{{item.userName}}:{{item.summary}} </span>
                      </div>
                  </template>
                </el-form-item>
                <el-form-item>
                  <template>
                    <div>计划:</div>
                    <div v-for="item in props.row.taskWeeklyRelaWeeklyPlanEntitys">
                      <span class='content-tab' v-if="item.commentType=='PERSON'"> {{item.userName}}:{{item.weeklyPlan}} </span>
                      <span class='content-tab' v-if="item.commentType=='DEPTHEADER'">{{item.userName}}:{{item.weeklyPlan}} </span>
                      <span class='content-tab' v-if="item.commentType=='SECOND_DEPTHEADER'">{{item.userName}}:{{item.weeklyPlan}} </span>
                      <span class='content-tab' v-if="item.commentType=='MANAGER'">{{item.userName}}:{{item.weeklyPlan}} </span>
                    </div>
                  </template>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="任务标题"
            prop="id">
            <template slot-scope="props">
              <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;">
                <div>{{ props.row.title}}</div>
              </router-link>
              <div>
                <div class="title-left">
                  <div><span style="background: #F04134;"></span><span>公司重点</span></div>
                </div>
                <div class="title-right" style="border:none;">
                   {{props.row.taskTypeName}}
                </div>
              </div>
          </template>
          </el-table-column>
          <el-table-column
            label="最新回复"
            prop="name">
            <template slot-scope="props">
                  <div class="">
                   {{props.row.lastTaskReplyContent }}
                  </div>
                </template>
          </el-table-column>
          <el-table-column
            label="任务状态"
            prop="desc" width='180'>
            <template slot-scope="props">
                <span>
                  <div>
                    <img class="icon_type" v-if="props.row.iconType=='FINISHU'"  src="../../images/lateTime2.png" alt="" >
                    <img class="icon_type" v-if="props.row.iconType=='FINISHUW'" src="../../images/timeLate.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='EXCELLENT'" src="../../images/icon_excellent.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='GOOD'" src="../../images/icon_good.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='SECONDARY'" src="../../images/icon_well.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='DIFFERENCE'" src="../../images/icon_bad.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='POOR'" src="../../images/icon_worse.png" alt="">
                    <span style="color:#D93437;">{{props.row.taskStatusStr}}</span>
                  </div>
                </span>
            </template>
          </el-table-column>
          <el-table-column
            label="本周总结"
            prop="desc" class="llll">
            <template slot-scope="props">
                <div v-if="props.row.taskWeeklyRelaSummary">
                  <span v-if="props.row.taskWeeklyRelaSummary.commentType=='PERSON'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaSummary.summary}}</span>
                  <span v-if="props.row.taskWeeklyRelaSummary.commentType=='DEPTHEADER'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaSummary.summary}} </span>
                  <span v-if="props.row.taskWeeklyRelaSummary.commentType=='SECOND_DEPTHEADER'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaSummary.summary}} </span>
                  <span  v-if="props.row.taskWeeklyRelaSummary.commentType=='MANAGER'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaSummary.summary}} </span>
                </div>
            </template>
          </el-table-column>
          <el-table-column
            label="下周计划"
            prop="desc">
            <template slot-scope="props">
              <div v-if="props.row.taskWeeklyRelaWeeklyPlan">
                <span v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='PERSON'">{{props.row.taskWeeklyRelaWeeklyPlan.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}}</span>
                <span v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='DEPTHEADER'">{{props.row.taskWeeklyRelaWeeklyPlan.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}} </span>
                <span v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='SECOND_DEPTHEADER'">{{props.row.taskWeeklyRelaWeeklyPlan.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}} </span>
                <span  v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='MANAGER'">{{props.row.taskWeeklyRelaWeeklyPlan.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}} </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 部门总点 -->
      <div class="perform-title">
        <h4>2、部门重点</h4>
      </div>
      <div class="overHide">
        <div class="icon-name" @mouseenter="enter($event)" @mouseleave="leave($event)">
          <i class="el-icon-information"></i>
          <span>{{nextStartDay}} - {{nextEndDay}}</span>
        </div>
        <div class="icon-name" style="right:338px;" @mouseenter="enter($event)" @mouseleave="leave($event)">
          <i class="el-icon-information"></i>
          <span>{{startDay}} - {{endDay}}</span>
        </div>
        <el-table :data="tableDataDept"   class="dept" row-key="taskId" :expand-row-keys="expands" @row-click="openDetails" style="width: 100%" empty-text='本周暂无部门重点任务'>
          <el-table-column
            label="序号"
            width="70"
          >
            <template slot-scope="props">
              <span>2.{{props.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="内容:">
                  <span class='content-tab'>{{ props.row.content }}</span>
                </el-form-item>
                <el-form-item>
                  <div class="input-back">
                    <input type="text" name="" value="" class='inputValue'>
                    <span class='replyValue' @click='replyTask(props.row.index,props.row.taskId,$event)'>回复</span>
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
                <el-form-item>
                  <template>
                    <div>总结:</div>
                    <div v-for="item in props.row.taskWeeklyRelaSummaryEntitys">
                      <span class='content-tab' v-if="item.commentType=='PERSON'"> {{item.userName}}:{{item.summary}} </span>
                      <span class='content-tab' v-if="item.commentType=='DEPTHEADER'">{{item.userName}}:{{item.summary}} </span>
                      <span class='content-tab' v-if="item.commentType=='SECOND_DEPTHEADER'">{{item.userName}}:{{item.summary}} </span>
                      <span class='content-tab' v-if="item.commentType=='MANAGER'">{{item.userName}}:{{item.summary}} </span>
                    </div>
                  </template>
                </el-form-item>
                <el-form-item>
                  <template>
                    <div>计划:</div>
                    <div v-for="item in props.row.taskWeeklyRelaWeeklyPlanEntitys">
                      <span class='content-tab' v-if="item.commentType=='PERSON'"> {{item.userName}}:{{item.weeklyPlan}} </span>
                      <span class='content-tab' v-if="item.commentType=='DEPTHEADER'">{{item.userName}}:{{item.weeklyPlan}} </span>
                      <span class='content-tab' v-if="item.commentType=='SECOND_DEPTHEADER'">{{item.userName}}:{{item.weeklyPlan}} </span>
                      <span class='content-tab' v-if="item.commentType=='MANAGER'">{{item.userName}}:{{item.weeklyPlan}} </span>
                    </div>
                  </template>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="任务标题"
            prop="id">
            <template slot-scope="props">
              <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;">
                <div>{{ props.row.title}}</div>
              </router-link>
              <div>
                <div class="title-left">
                  <div><span style="background: #FFBF00;"></span><span>部门重点</span></div>
                </div>
                <div class="title-right" style="border:none;">
                   {{props.row.taskTypeName}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="最新回复"
            prop="name">
            <template slot-scope="props">
              <div class="">
                {{props.row.lastTaskReplyContent }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="任务状态"
            prop="desc" width='180'>
            <template slot-scope="props">
                <span>
                  <div>
                    <img class="icon_type" v-if="props.row.iconType=='FINISHU'"  src="../../images/lateTime2.png" alt="" >
                    <img class="icon_type" v-if="props.row.iconType=='FINISHUW'" src="../../images/timeLate.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='EXCELLENT'" src="../../images/icon_excellent.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='GOOD'" src="../../images/icon_good.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='SECONDARY'" src="../../images/icon_well.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='DIFFERENCE'" src="../../images/icon_bad.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='POOR'" src="../../images/icon_worse.png" alt="">
                    <span style="color:#D93437;">{{props.row.taskStatusStr}}</span>
                  </div>
                </span>
            </template>
          </el-table-column>
          <el-table-column
            label="本周总结"
            prop="desc" class="llll">
            <template slot-scope="props">
                <div v-if="props.row.taskWeeklyRelaSummary">
                  <span v-if="props.row.taskWeeklyRelaSummary.commentType=='PERSON'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaSummary.summary}}</span>
                  <span v-if="props.row.taskWeeklyRelaSummary.commentType=='DEPTHEADER'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaSummary.summary}} </span>
                  <span v-if="props.row.taskWeeklyRelaSummary.commentType=='SECOND_DEPTHEADER'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaSummary.summary}} </span>
                  <span  v-if="props.row.taskWeeklyRelaSummary.commentType=='MANAGER'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaSummary.summary}} </span>
                </div>
            </template>
          </el-table-column>
          <el-table-column
            label="下周计划"
            prop="desc">
            <template slot-scope="props">
              <div v-if="props.row.taskWeeklyRelaWeeklyPlan">
                <span v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='PERSON'">{{props.row.taskWeeklyRelaWeeklyPlan.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}}</span>
                <span v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='DEPTHEADER'">{{props.row.taskWeeklyRelaWeeklyPlan.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}} </span>
                <span v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='SECOND_DEPTHEADER'">{{props.row.taskWeeklyRelaWeeklyPlan.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}} </span>
                <span  v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='MANAGER'">{{props.row.taskWeeklyRelaWeeklyPlan.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}} </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 个人重点 -->
      <div class="perform-title">
        <h4>3、个人重点</h4>
      </div>
      <div class="overHide">
        <div class="icon-name" @mouseenter="enter($event)" @mouseleave="leave($event)">
          <i class="el-icon-information"></i>
            <span>{{nextStartDay}} - {{nextEndDay}}</span>
        </div>
        <div class="icon-name" style="right:338px;" @mouseenter="enter($event)" @mouseleave="leave($event)">
          <i class="el-icon-information"></i>
          <span>{{startDay}} - {{endDay}}</span>
        </div>
        <el-table :data="tableDataPerson"   class="person" row-key="taskId" :expand-row-keys="expands" @row-click="openDetails" style="width: 100%" empty-text='本周暂无个人重点任务'>
          <el-table-column
            label="序号"
            width="70"
          >
            <template slot-scope="props">
              <span>3.{{props.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="内容:">
                  <span class='content-tab'>{{ props.row.content }}</span>
                </el-form-item>
                <el-form-item>
                  <div class="input-back">
                    <input type="text" name="" value="" class='inputValue'>
                    <span class='replyValue' @click='replyTask(props.row.index,props.row.taskId,$event)'>回复</span>
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
                <el-form-item>
                  <template>
                    <div>总结:</div>
                    <div v-for="item in props.row.taskWeeklyRelaSummaryEntitys">
                      <span class='content-tab' v-if="item.commentType=='PERSON'"> {{item.userName}}:{{item.summary}} </span>
                      <span class='content-tab' v-if="item.commentType=='DEPTHEADER'">{{item.userName}}:{{item.summary}} </span>
                      <span class='content-tab' v-if="item.commentType=='SECOND_DEPTHEADER'">{{item.userName}}:{{item.summary}} </span>
                      <span class='content-tab' v-if="item.commentType=='MANAGER'">{{item.userName}}:{{item.summary}} </span>
                    </div>
                  </template>
                </el-form-item>
                <el-form-item>
                  <template>
                    <div>计划:</div>
                    <div v-for="item in props.row.taskWeeklyRelaWeeklyPlanEntitys">
                      <span class='content-tab' v-if="item.commentType=='PERSON'"> {{item.userName}}:{{item.weeklyPlan}} </span>
                      <span class='content-tab' v-if="item.commentType=='DEPTHEADER'">{{item.userName}}:{{item.weeklyPlan}} </span>
                      <span class='content-tab' v-if="item.commentType=='SECOND_DEPTHEADER'">{{item.userName}}:{{item.weeklyPlan}} </span>
                      <span class='content-tab' v-if="item.commentType=='MANAGER'">{{item.userName}}:{{item.weeklyPlan}} </span>
                    </div>
                  </template>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="任务标题"
            prop="id">
            <template slot-scope="props">
              <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;">
                <div>{{ props.row.title}}</div>
              </router-link>
              <div>
                <div class="title-left">
                  <div><span style="background: #00A854;"></span><span>个人重点</span></div>
                </div>
                <div class="title-right" style="border:none;">
                   {{props.row.taskTypeName}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="最新回复"
            prop="name">
            <template slot-scope="props">
              <div class="">
                {{props.row.lastTaskReplyContent }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="任务状态"
            prop="desc" width='180'>
            <template slot-scope="props">
                <span>
                  <div>
                    <img class="icon_type" v-if="props.row.iconType=='FINISHU'"  src="../../images/lateTime2.png" alt="" >
                    <img class="icon_type" v-if="props.row.iconType=='FINISHUW'" src="../../images/timeLate.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='EXCELLENT'" src="../../images/icon_excellent.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='GOOD'" src="../../images/icon_good.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='SECONDARY'" src="../../images/icon_well.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='DIFFERENCE'" src="../../images/icon_bad.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='POOR'" src="../../images/icon_worse.png" alt="">
                    <span style="color:#D93437;">{{props.row.taskStatusStr}}</span>
                  </div>
                </span>
            </template>
          </el-table-column>
          <el-table-column
            label="本周总结"
            prop="desc" class="llll">
            <template slot-scope="props">
                <div v-if="props.row.taskWeeklyRelaSummary">
                  <span v-if="props.row.taskWeeklyRelaSummary.commentType=='PERSON'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaSummary.summary}}</span>
                  <span v-if="props.row.taskWeeklyRelaSummary.commentType=='DEPTHEADER'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaSummary.summary}} </span>
                  <span v-if="props.row.taskWeeklyRelaSummary.commentType=='SECOND_DEPTHEADER'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaSummary.summary}} </span>
                  <span  v-if="props.row.taskWeeklyRelaSummary.commentType=='MANAGER'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaSummary.summary}} </span>
                </div>
            </template>
          </el-table-column>
          <el-table-column
            label="下周总结"
            prop="desc">
            <template slot-scope="props">
              <div v-if="props.row.taskWeeklyRelaWeeklyPlan">
                <span v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='PERSON'">{{props.row.taskWeeklyRelaWeeklyPlan.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}}</span>
                <span v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='DEPTHEADER'">{{props.row.taskWeeklyRelaWeeklyPlan.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}} </span>
                <span v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='SECOND_DEPTHEADER'">{{props.row.taskWeeklyRelaWeeklyPlan.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}} </span>
                <span  v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='MANAGER'">{{props.row.taskWeeklyRelaWeeklyPlan.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}} </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- <div class="my-comment">
        <h3 comment-title>二、自我评价</h3>
        <div class="comment-content">
          为什么要这样来哈拉斯的哈达和骄傲大djflsjfksjf放空间按时付款
        </div>
      </div> -->
      <div class="my-comment">
        <h3 comment-title>二、部门总结</h3>
        <div class="comment-content">
          {{deptHeaderComment}}
        </div>
      </div>
      <!--<div class="my-comment">-->
        <!--<h3 comment-title>三、上级部门总结</h3>-->
        <!--<div class="comment-content">-->
          <!--{{secondDeptHeaderComment}}-->
        <!--</div>-->
      <!--</div>-->
      <div class="my-comment">
        <h3 comment-title>三、总经理点评</h3>
        <div class="comment-content">
          {{managerComment}}
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
  import { lastDepartWeekly,userTaskReply,dragTask} from 'service/getData'
  import {ERR_OK} from 'service/config'
  import Sortable from 'sortablejs'
  export default {
    data() {
      return {
        startDay:'',
        endDay:'',
        taskTotal:'',
        nextEndDay:'',
        nextStartDay:'',
        cimpTaskSize:'',
        dimpTaskSize:'',
        deptWeeklySize:'',
        nextSubmitDate:'',
        nextSubmitDayLeft:'',
        pimpTaskSize:'',
        managerComment:'',
        deptHeaderComment:'',
        secondDeptHeaderComment:"",
        expands: [],
        tableDataCompany:[],
        tableDataDept:[],
        tableDataPerson:[],
        commentCompleted:'',
        canPublishDept:'',
        canPublish:'',
        tableData5: []
      }
    },
    components: {
//      Tab
    },
    created(){
      this.getData()
    },
    methods: {
      //      回复
      replyTask(index,val,event){
        let el = event.target.parentNode.childNodes[0].value
        this.taskId = val
        let self = this
        const params = {
          taskId:this.taskId,
          replyDesc:el
        }
        if(el.trim().length>200){
          this.$notify({
          title: '提示',
          message:'回复内容不能超过200个字符'
          });
        }else if (el.trim().length<=0) {
          this.$notify({
          title: '提示',
          message:'回复内容不能为空！'
          });
        }else{
          userTaskReply(params).then((res) => {
            if(res.code == ERR_OK) {
              self.getData();
              self.$notify({
                title: '成功',
                message: '恭喜你，回复成功',
                type: 'success'
              });
            }else{
              self.$notify.error({
                title: '失败',
                message:res.msg,
              });
            }
          })
        }
      },
      enter(event){
        let el = event.target.childNodes[2]
        el.style.display = 'block'
      },
      leave(event){
        let el = event.target.childNodes[2]
        el.style.display = 'none'
        //console.log(el)
      },
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
      getData() {
        let self = this
        lastDepartWeekly().then((res) => {
          if(res.code == ERR_OK) {
            this.startDay = res.data.startDay
            this.endDay = res.data.endDay
            this.nextStartDay = res.data.nextStartDay
            this.nextEndDay = res.data.nextEndDay
            this.taskTotal = res.data.taskTotal
            this.nextTaskTotal = res.data.nextTaskTotal
            this.deptWeeklySize = res.data.deptWeeklySize
            this.cimpTaskSize = res.data.cimpTaskSize
            this.dimpTaskSize = res.data.dimpTaskSize
            this.pimpTaskSize = res.data.pimpTaskSize
            this.nextSubmitDayLeft = res.data.nextSubmitDayLeft
            this.nextSubmitDate = res.data.nextSubmitDate
            this.managerComment = res.data.managerComment
            this.deptHeaderComment = res.data.deptHeaderComment
            this.secondDeptHeaderComment=res.data.secondDeptHeaderComment
            this.commentCompleted = res.data.commentCompleted
            this.canPublishDept = res.data.canPublishDept
            this.canPublish = res.data.canPublish
            if(res.data.taskWeeklyTaskVos){
              this.tableDataCompany = res.data.taskWeeklyTaskVos[0].taskWeeklyTaskListVos
              this.tableDataDept = res.data.taskWeeklyTaskVos[1].taskWeeklyTaskListVos
              this.tableDataPerson = res.data.taskWeeklyTaskVos[2].taskWeeklyTaskListVos
            }
            this.$nextTick(() => {
              this.setSort_company()
              this.setSort_dept()
              this.setSort_person()
            })
          }
       })
      },
      //公司重点
      setSort_company(){
        const el = document.querySelectorAll('.company .el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          onEnd: evt => {
            var oldIndex=evt.oldIndex;
            var newIndex=evt.newIndex;
            if(oldIndex>newIndex){
              if(newIndex==0){
                this._dragTask(this.tableDataCompany[oldIndex].taskId,'',this.tableDataCompany[newIndex].taskId,1)
              }
              else{
                this._dragTask(this.tableDataCompany[oldIndex].taskId,this.tableDataCompany[newIndex-1].taskId,this.tableDataCompany[newIndex].taskId,1)
              }
            }else{
              if(newIndex==0){
                this._dragTask(this.tableDataCompany[oldIndex].taskId,'',this.tableDataCompany[newIndex].taskId,1)
              }else if(newIndex==this.tableDataCompany.length-1){
                this._dragTask(this.tableDataCompany[oldIndex].taskId,this.tableDataCompany[newIndex].taskId,'',1)
              }
              else{

                this._dragTask(this.tableDataCompany[oldIndex].taskId,this.tableDataCompany[newIndex].taskId,this.tableDataCompany[newIndex+1].taskId,1)
              }
            }
          }
        })
      },
      // 部门重点
      setSort_dept(){
        const el = document.querySelectorAll('.dept .el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          onEnd: evt => {
            var oldIndex=evt.oldIndex;
            var newIndex=evt.newIndex;
            if(oldIndex>newIndex){
              if(newIndex==0){
                this._dragTask(this.tableDataDept[oldIndex].taskId,'',this.tableDataDept[newIndex].taskId,2)
              }
              else{
                this._dragTask(this.tableDataDept[oldIndex].taskId,this.tableDataDept[newIndex-1].taskId,this.tableDataDept[newIndex].taskId,2)
              }
            }else{
              if(newIndex==0){
                this._dragTask(this.tableDataDept[oldIndex].taskId,'',this.tableDataDept[newIndex].taskId,2)
              }else if(newIndex==this.tableDataDept.length-1){
                this._dragTask(this.tableDataDept[oldIndex].taskId,this.tableDataDept[newIndex].taskId,'',2)
              }
              else{
                if(newIndex>=this.tableDataDept.length){
                  this._dragTask(this.tableDataDept[oldIndex].taskId,this.tableDataDept[newIndex-1].taskId,'',2)
                }else{
                  this._dragTask(this.tableDataDept[oldIndex].taskId,this.tableDataDept[newIndex].taskId,this.tableDataDept[newIndex+1].taskId,2)
                }

              }
            }
          }
        })
      },
//     个人重点
      setSort_person(){
        const el = document.querySelectorAll('.person .el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          onEnd: evt => {
            var oldIndex=evt.oldIndex;
            var newIndex=evt.newIndex;
            if(oldIndex>newIndex){
              if(newIndex==0){
                this._dragTask(this.tableDataPerson[oldIndex].taskId,'',this.tableDataPerson[newIndex].taskId,3)
              }
              else{
                this._dragTask(this.tableDataPerson[oldIndex].taskId,this.tableDataPerson[newIndex-1].taskId,this.tableDataPerson[newIndex].taskId,3)
              }
            }else{
              if(newIndex==0){
                this._dragTask(this.tableDataPerson[oldIndex].taskId,'',this.tableDataPerson[newIndex].taskId,3)
              }else if(newIndex==this.tableDataPerson.length-1){
                this._dragTask(this.tableDataPerson[oldIndex].taskId,this.tableDataPerson[newIndex].taskId,'',3)
              }
              else{
                this._dragTask(this.tableDataPerson[oldIndex].taskId,this.tableDataPerson[newIndex].taskId,this.tableDataPerson[newIndex+1].taskId,3)
              }
            }
          }
        })
      },
      //  拖动排序接口
      _dragTask(sourceTaskId,targetBeforeTaskId,targetAfterTaskId,num){
        const param={
          sourceTaskId:sourceTaskId,
          targetBeforeTaskId:targetBeforeTaskId,
          targetAfterTaskId:targetAfterTaskId
        }
        dragTask(param).then((res)=>{
          if(num==1){
            this.refresh(1)
          }
          if(num==2){
            this.refresh(2)
          }
          if(num==3){
            this.refresh(3)
          }
          if(num==4){
            this.refresh(4)
          }
          if(res.code == ERR_OK){

          }else{
            this.$notify.error({
              title: '错误',
              message:res.msg
            });
          }
        })
      },
      refresh(num){
        lastDepartWeekly().then((res) => {
          if(res.code == ERR_OK) {
            if(num==1){
              if(res.data.taskWeeklyTaskVos){
                this.tableDataCompany = res.data.taskWeeklyTaskVos[0].taskWeeklyTaskListVos
              }
            }
            if(num==2){
              if(res.data.taskWeeklyTaskVos){
                this.tableDataDept = res.data.taskWeeklyTaskVos[1].taskWeeklyTaskListVos
              }
            }
            if(num==3){
              if(res.data.taskWeeklyTaskVos){
                this.tableDataPerson = res.data.taskWeeklyTaskVos[2].taskWeeklyTaskListVos
              }
            }
          }else{
            this.$notify.error({
              title: '错误',
              message:res.msg
            });
          }
        })
      }
    }
  };
</script>
<style lang="scss"  scoped>
  .title-header{
    opacity: 0.99;
    background: rgba(217,52,55,0.10);
    height: 46px;
    line-height: 46px;
  }
  .week-title{
    font-size: 14px;
    color: #333333;
    margin-left: 20px;
    float: left;
  }
  .week-date{
    float: left;
    font-size: 12px;
    color: #333333;
    margin-left: 78px;
  }
  .week-button1{
    float: right;
    height: 25px;
    width: 114px;
    text-align: center;
    border: 1px solid #D93538;
    border-radius: 4px;
    font-size: 14px;
    color: #D93538;
    margin-top: 11px;
    line-height: 25px;
    margin-right: 120px;
    cursor: pointer;
  }
  .week-button2{
    float: right;
    height: 25px;
    line-height: 25px;
    width: 114px;
    text-align: center;
    border: 1px solid #D93538;
    border-radius: 4px;
    font-size: 14px;
    color: #D93538;
    margin-top: 11px;
    margin-right: 20px;
    cursor: pointer;
  }
  .circle-wrapper{
    font-size: 12px;
    color: #757575;
    height: 128px;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.12);
    border-top:none;
    border-bottom:none;
  }
  .circle-name{
    text-align: center;
    float: left;
    padding: 0 57.5px;
    padding-top: 15px;
  }
  .circle-name span{
    margin-top: 10px;
    display: block;
  }
  .circle-content{
    border: 3px solid #E0E0E0;
    border-radius: 50%;
    width: 72px;
    height: 72px;
    font-size: 18px;
    color: #32BBE2;
    line-height: 69px;
    box-sizing: border-box;
  }
  .week-bar{
    height: 52px;
    line-height: 50px;
    background-color: #fff;
    border: 1px solid rgba(0,0,0,0.12);
    font-size: 12px;
    color: #434343;
  }
  .week-next{
    float: left;
    margin-left: 20px;
  }
  .week-next1{
    margin-left: 150px;
  }
  .perform-title{
    opacity: 0.99;
    height: 46px;
    line-height: 46px;
    font-size: 14px;
    color: #434343;
    margin-top: 20px;
    border: 1px solid rgba(0,0,0,0.12);
    background: rgba(217,52,55,0.02);
    border-bottom: none;
  }
  .perform-title h4{
    margin-left: 20px;
  }
  .content-tab {
      line-height: 17px;
      display: block;
      font-size: 12px;
      padding: 0 20px 0 0;
      min-width: 220px;
  }
  .input-back input {
      height: 24px;
      width: 225px;
      padding-left: 6px;
      border: 1px solid #979797;
  }
  .input-back span {
      height: 24px;
      width: 48px;
      display: inline-block;
      background: #D93437;
      line-height: 24px;
      color: #fff;
      font-size: 12px;
      cursor: pointer;
      text-align: center;
  }
  .reback {
      font-size: 12px;
      color: #505363;
      line-height: 28px;
      background: #DFDFDF;
      padding-left: 10px;
  }
  .reback-time {
      text-align: left;
      font-size: 12px;
      color: #505363;
      line-height: 12px;
      margin-bottom: 5px;
      margin-top: 5px;
  }
  .special {
      color: transparent;
  }
  .title-left {
      float: left;
  }
  .title-left span:first-child {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 9px;
      background: #FFBF00;
  }
  .title-right {
      float: left;
      margin-left: 35px;
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
      width: 254px;
      overflow: hidden;
  }
  .demo-table-expand .el-form-item:nth-child(2) {
      width: 330px;
      overflow: hidden;
  }
  .demo-table-expand .el-form-item:nth-child(3) {
      width: 258px;
      overflow: hidden;
  }
  .demo-table-expand .el-form-item:nth-child(4) {
      width: 242px;
      overflow: hidden;
  }
  .my-comment{
    border: 1px solid rgba(0,0,0,0.12);
    margin-top: 21px;
  }
  .my-comment h3{
    font-size: 16px;
    color: #333333;
    opacity: 0.99;
    height: 46px;
    line-height: 46px;
    padding-left: 20px;
    background: rgba(217,52,55,0.10);
  }
  .my-comment .comment-content{
    padding: 20px 15px;
    line-height: 22px;
    font-size: 12px;
    color: #333333;
  }
  .special-title{
    height: 46px;
    line-height: 46px;
    opacity: 0.99;
    background: rgba(217,52,55,0.10);
    font-size: 16px;
    color: #333333;
    margin-top: 21px;
  }
  .special-title h4{
    margin-left: 20px;
  }
  .icon_type{
    display:inline-block;
    margin-top:2px;
  }
  .overHide{
    position: relative;
  }
  .icon-name{
    position: absolute;
    top:16px;
    z-index: 300;
    right:124px;
  }

.icon-name i{
  color: #999999;
}
.icon-name span {
  display: none;
  position: absolute;
  z-index: 301;
  background: rgba(0,0,0,0.80);
  border-radius: 4px;
  font-size: 12px;
  color: #FFFFFF;
  width: 170px;
  height: 30px;
  top: -34px;
  right:-38px;
  text-align: center;
  line-height: 30px;
}
</style>
