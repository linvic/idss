<template>
  <div>
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <router-link to="/weekManageDepartLeader">
          <span class="child1">周报管理</span>
        </router-link>
        /
        <router-link to="/weekManageDepartLeader">
          <span class="child1">周报列表</span>
        </router-link>
        /

        <span class="child2">周报详情</span>

      </div>
      <div class="title-header">
        <div class="week-title">
          {{deptName}}周报
        </div>
        <div class="week-date">
          日期：{{startDay}} 至 {{endDay}}
        </div>
      </div>
      <div class="circle-wrapper">
        <div class="circle-name">
          <div class="circle-content">
            {{taskTotal}}
          </div>
          <span>本周任务总数</span>
        </div>
        <div class="circle-name">
          <div class="circle-content">
            {{completionRate}}%
          </div>
          <span>任务完成率</span>
        </div>
        <div class="circle-name">
          <div class="circle-content">
            {{averagePerformance}}
          </div>
          <span>部门平均绩效评估</span>
        </div>
        <div class="circle-name">
          <div class="circle-content">
            {{nextTaskTotal}}
          </div>
          <span>下周任务数</span>
        </div>
        <div class="circle-name">
          <div class="circle-content">
            {{nextImptaskTotal}}
          </div>
          <span>下周重点任务数</span>
        </div>
      </div>
      <div class="week-bar">
        <div  class="week-next">
          暂未提交周报：{{autoSubUsers}}
        </div>
      </div>
      <div class="special-title">
        <h4>一、任务列表</h4>
      </div>
      <div class="perform-title" style='margin-top:0px;'>
        <h4>1、公司重点</h4>
      </div>
      <div class='task-manage'>
        <el-table
          :data="tableDataCompany"
          row-key="taskId"
          class="company"
          :expand-row-keys="expands"
          @row-click="openDetails"
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
                    <img class="icon_type" v-if="props.row.iconType=='FINISHU'"  src="../../../images/lateTime2.png" alt="" >
                    <img class="icon_type" v-if="props.row.iconType=='FINISHUW'" src="../../../images/timeLate.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='EXCELLENT'" src="../../../images/icon_excellent.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='GOOD'" src="../../../images/icon_good.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='SECONDARY'" src="../../../images/icon_well.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='DIFFERENCE'" src="../../../images/icon_bad.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='POOR'" src="../../../images/icon_worse.png" alt="">
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
      <div class='task-manage'>
        <el-table
          :data="tableDataDept"
          row-key="taskId"
          class="dept"
          :expand-row-keys="expands"
          @row-click="openDetails"
          style="width: 100%" empty-text='本周暂无部门重点任务'>
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
                    <img class="icon_type" v-if="props.row.iconType=='FINISHU'"  src="../../../images/lateTime2.png" alt="" >
                    <img class="icon_type" v-if="props.row.iconType=='FINISHUW'" src="../../../images/timeLate.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='EXCELLENT'" src="../../../images/icon_excellent.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='GOOD'" src="../../../images/icon_good.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='SECONDARY'" src="../../../images/icon_well.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='DIFFERENCE'" src="../../../images/icon_bad.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='POOR'" src="../../../images/icon_worse.png" alt="">
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
      <!--个人重点 -->
      <div class="perform-title">
        <h4>3、个人重点</h4>
      </div>
      <div class='task-manage'>
        <el-table
          :data="tableDataPerson"
          row-key="taskId"
          class="person"
          :expand-row-keys="expands"
          @row-click="openDetails"
          style="width: 100%" empty-text='本周暂无个人重点任务'>
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
                    <img class="icon_type" v-if="props.row.iconType=='FINISHU'"  src="../../../images/lateTime2.png" alt="" >
                    <img class="icon_type" v-if="props.row.iconType=='FINISHUW'" src="../../../images/timeLate.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='EXCELLENT'" src="../../../images/icon_excellent.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='GOOD'" src="../../../images/icon_good.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='SECONDARY'" src="../../../images/icon_well.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='DIFFERENCE'" src="../../../images/icon_bad.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='POOR'" src="../../../images/icon_worse.png" alt="">
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
      <!-- 个人普通 -->
      <div class="perform-title">
        <h4>4、个人普通</h4>
      </div>
      <div class='task-manage'>
        <el-table
          :data="tableDataCommon"
          row-key="taskId"
          class="commonPerson"
          :expand-row-keys="expands"
          @row-click="openDetails"
          style="width: 100%" empty-text='本周暂无个人普通任务'>
          <el-table-column
            label="序号"
            width="70"
          >
            <template slot-scope="props">
              <span>4.{{props.$index+1}}</span>
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
                  <div><span style="background: #108EE9;"></span><span>个人普通</span></div>
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
                    <img class="icon_type" v-if="props.row.iconType=='FINISHU'"  src="../../../images/lateTime2.png" alt="" >
                    <img class="icon_type" v-if="props.row.iconType=='FINISHUW'" src="../../../images/timeLate.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='EXCELLENT'" src="../../../images/icon_excellent.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='GOOD'" src="../../../images/icon_good.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='SECONDARY'" src="../../../images/icon_well.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='DIFFERENCE'" src="../../../images/icon_bad.png" alt="">
                    <img class="icon_type" v-if="props.row.iconType=='POOR'" src="../../../images/icon_worse.png" alt="">
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
      <div class="my-comment" style="border-bottom:none;">
        <h3 comment-title>四、部门周报列表</h3>
      </div>
      <div class="get-reward">
        <el-table
          :data="result"

          style="width: 100%" empty-text='暂无数据'>
          <el-table-column
            prop="userName"
            label="姓名"
          >
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
          <template slot-scope='props'>
            <span>{{props.row.delayRate}}%</span>
          </template>
          </el-table-column>
          <el-table-column
            prop="performanceScore"
            label="任务总分"
          >
          </el-table-column>
          <el-table-column
            prop="evaluatingScore"
            label="绩效评估分"
          >
          </el-table-column>
          <el-table-column
            prop="nextTaskTotal"
            label="下周任务数"
          >
          </el-table-column>
          <el-table-column
            prop="nextImptaskTotal"
            label="下周重点"
          >
          </el-table-column>
          <el-table-column
            prop="sourceType"
            label="操作"
          >
          <template slot-scope='props'>
            <router-link :to="{ path: 'staffWeekDetail',query: {id:props.row.weeklyId}}">
              <span style="color: #D93437;cursor:pointer;">查看</span>
            </router-link>
          </template>
          </el-table-column>
        </el-table>
      </div>
      <router-link to="/pastWeekly">
        <div class="button-close">
          关闭
        </div>
      </router-link>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
  import bus from '../../../assets/eventBus'
  import { getByDepartWeekly,userTaskReply,departReviewWeekly,dragTask} from 'service/getData'
  import {ERR_OK,formatDateTime} from 'service/config'
  import Sortable from 'sortablejs'
//  import Tab from 'components/common/tab'
  export default {
    data() {
      return {
        id:'',
        expands:[],
        startDay:'',
        endDay:'',
        taskTotal:'',
        nextImptaskTotal:'',
        nextTaskTotal:'',
        averagePerformance:'',
        completionRate:'',
        result:[],
        tableDataCompany:[],
        tableDataDept:[],
        tableDataPerson:[],
        tableDataCommon:[],
        deptHeaderComment:'',
        secondDeptHeaderComment:"",
        managerComment:'',
        autoSubUsers1:[],
        autoSubUsers:'',
        deptName:'',
      }
    },
    components: {
//      Tab
    },
    created () {
      this.id =this.$route.query.id
    },
    mounted(){
      this.getData()
      this.getData1()
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
              self.getData()
              self.$message({
                message: '恭喜你，回复成功',
                type: 'success'
              });
            }else{
              self.$message({
                message:res.msg,
                type: 'error'
              })
            }
          })
        }
      },
      getData1() {
        let self = this
        const params = {
          deptWeeklyId:this.id
        }
        departReviewWeekly(params).then((res) => {
          if(res.code == ERR_OK) {
            this.result = res.data.taskDeptStaffWeeklyListVos
          }
       })
      },
      getData() {
        let self = this
        const params = {
          deptWeeklyId:this.id
        }
        getByDepartWeekly(params).then((res) => {
          if(res.code == ERR_OK) {
            this.startDay = res.data.startDay
            this.endDay = res.data.endDay
            this.taskTotal = res.data.taskTotal
            this.nextTaskTotal = res.data.nextTaskTotal
            this.nextImptaskTotal = res.data.nextImptaskTotal
            this.completionRate = res.data.completionRate
            this.deptName = res.data.deptName
            this.managerComment = res.data.superComment
            this.deptHeaderComment = res.data.comment
            this.secondDeptHeaderComment=res.data.secondDeptHeaderComment
            this.averagePerformance = res.data.averagePerformance
            this.tableDataCompany = res.data.taskWeeklyTaskVos[0].taskWeeklyTaskListVos
            this.tableDataDept = res.data.taskWeeklyTaskVos[1].taskWeeklyTaskListVos
            this.tableDataPerson = res.data.taskWeeklyTaskVos[2].taskWeeklyTaskListVos
            this.tableDataCommon = res.data.taskWeeklyTaskVos[3].taskWeeklyTaskListVos
            if(!res.data.autoSubUsers && typeof res.data.autoSubUsers != "undefined" && res.data.autoSubUsers != 0){
              this.autoSubUsers = ''
            }else{
              for(let item of res.data.autoSubUsers){
                this.autoSubUsers1.push(item.userName)
              }
              this.autoSubUsers = this.autoSubUsers1.join('、')
            }
            this.$nextTick(() => {
              this.setSort_company()
              this.setSort_dept()
              this.setSort_person()
              this.setSort_commonPerson()
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
                if(newIndex>=this.tableDataCompany.length){
                  this._dragTask(this.tableDataCompany[oldIndex].taskId,this.tableDataCompany[newIndex-1].taskId,'',1)
                }else{
                  this._dragTask(this.tableDataCompany[oldIndex].taskId,this.tableDataCompany[newIndex].taskId,this.tableDataCompany[newIndex+1].taskId,1)
                }
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
                if(newIndex>=this.tableDataPerson.length){
                  this._dragTask(this.tableDataPerson[oldIndex].taskId,this.tableDataPerson[newIndex-1].taskId,'',3)
                }else{
                  this._dragTask(this.tableDataPerson[oldIndex].taskId,this.tableDataPerson[newIndex].taskId,this.tableDataPerson[newIndex+1].taskId,3)
                }
              }
            }
          }
        })
      },
//      个人普通
      setSort_commonPerson(){
        const el = document.querySelectorAll('.commonPerson .el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          onEnd: evt => {
            var oldIndex=evt.oldIndex;
            var newIndex=evt.newIndex;
            if(oldIndex>newIndex){
              if(newIndex==0){
                this._dragTask(this.tableDataCommon[oldIndex].taskId,'',this.tableDataCommon[newIndex].taskId,4)
              }
              else{
                this._dragTask(this.tableDataCommon[oldIndex].taskId,this.tableDataCommon[newIndex-1].taskId,this.tableDataCommon[newIndex].taskId,4)
              }
            }else{
              if(newIndex==0){
                this._dragTask(this.tableDataCommon[oldIndex].taskId,'',this.tableDataCommon[newIndex].taskId,4)
              }else if(newIndex==this.tableDataCommon.length-1){
                this._dragTask(this.tableDataCommon[oldIndex].taskId,this.tableDataCommon[newIndex].taskId,'',4)
              }
              else{
                if(newIndex>=this.tableDataCommon.length){
                  this._dragTask(this.tableDataCommon[oldIndex].taskId,this.tableDataCommon[newIndex-1].taskId,'',4)
                }else{
                  this._dragTask(this.tableDataCommon[oldIndex].taskId,this.tableDataCommon[newIndex].taskId,this.tableDataCommon[newIndex+1].taskId,4)
                }
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
        const params = {
          deptWeeklyId:this.id
        }
        getByDepartWeekly(params).then((res) => {
          if(res.code == ERR_OK) {
            if(num==1){
              this.tableDataCompany = res.data.taskWeeklyTaskVos[0].taskWeeklyTaskListVos
            }
            if(num==2){
              this.tableDataDept = res.data.taskWeeklyTaskVos[1].taskWeeklyTaskListVos
            }
            if(num==3){
              this.tableDataPerson = res.data.taskWeeklyTaskVos[2].taskWeeklyTaskListVos
            }
            if(num==4){
              this.tableDataCommon = res.data.taskWeeklyTaskVos[3].taskWeeklyTaskListVos
            }
          }else{
            this.$notify.error({
              title: '错误',
              message:res.msg
            });
          }
        })
      }
    },
    watch: {
      '$route' (to, from) {
        // 获取最新的id 调用获取数据方法
        if(to.query.id && to.path=="/departWeeklyDetail"){
          this.id = this.$route.query.id
          this.getData()
          this.getData1()
          bus.$emit('tabChange','SUCCESS')
        }
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
  .button-close{
    border: 1px solid #D83436;
    border-radius: 4px;
    width: 110px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 14px;
    color: #D93437;
    margin: 30px auto;
    cursor: pointer;
  }
  .icon_type{
    display:inline-block;
    margin-top:2px;
  }
</style>
