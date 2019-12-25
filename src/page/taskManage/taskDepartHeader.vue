<template>
  <div class='task-manage'>
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <span class="child1">任务管理</span> / <span class="child2">任务列表</span>
      </div>
      <div class="take-top-wrapper">
        <div class="take-left">
          <div class="take-top" style="font-size: 14px;font-weight:normal">
            {{departName}}
          </div>
        </div>
        <div class="take-right" @click='mindTask'>
          发起任务
        </div>
      </div>
      <div class="untreatTask-wrapper">
        <div class="untreatTask">
          <ul>
            <li>待处理任务：{{pendingTaskSize}}</li>
            <li>总任务数：{{totalTaskSize}}</li>
            <li>公司重点任务：{{cimpTaskSize}}</li>
            <li>部门重点任务：{{dimpTaskSize}}</li>
            <li>个人重点任务：{{pimpTaskSize}}</li>
            <li>个人普通任务：{{pcommonTaskSize}}</li>
          </ul>
        </div>
      </div>
      <div class="user-title" style="margin-top:10px;border-bottom:none;">
        <div class="title-name title-name1 title-name6"
          v-for="(item,index) in tabs"
            :class="{active:index == num}"
             @click="tab(index)" v-html="item">{{item}}
        </div>
      </div>
      <div class="untreatTask-table taskNum0" v-show=" 0 == num">
        <el-table
          :data="result1"
          style="width: 100%" @expand="startExpend" row-key="taskId"
              :expand-row-keys="expands" @row-click="openDetails"  empty-text='暂无数据'>
          <el-table-column type="expand" v-show='hello'>
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="内容：">
                  <span class='content-tab'>{{ props.row.content }}</span>
                </el-form-item>
                <el-form-item>
                  <div class="input-back">
                    <input type="text" name="" value="" class='inputValue'>
                    <span @click='replyTask(props.row.index,props.row.taskId,$event)' class='replyValue'>回复</span>
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
              <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;">
              <div>{{ props.row.title }}</div>
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
                <div v-if='props.row.lastReplyStatus=="UNREAD"' style="color:rgb(217, 52, 55)">
                  <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                </div>
                <div v-if='props.row.lastReplyStatus=="READED"'>
                  <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="props">
                <!-- <el-button
                  size="small"
                  class='complete' v-if='props.row.taskStatusType=="ASSIGNED"' @click='assignTask(props.row.taskId)'>分配任务</el-button> -->
                  <el-button
                    size="small"
                    class='complete' v-if='props.row.taskStatusType=="APPROVING"' @click='lateCheck(props.row.changeType,props.row.taskId,props.row.planEndDate,1,$event)'>任务审核</el-button>
                    <!-- <el-button
                      size="small"
                      class='complete' v-if='props.row.taskStatusType=="WAITEVALUATE"' @click='completeModal(props.row.taskId)'>任务评价</el-button> -->
              </template>
          </el-table-column>
        </el-table>
        <div class="pagination-depart" v-if='total>0'>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 15, 50]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=total>
          </el-pagination>
        </div>
      </div>
      <div class="untreatTask-table taskNum1" v-show=" 1 == num">
        <el-table
          :data="resultTask1"
          style="width: 100%" @expand="startExpend" row-key="taskId"
              :expand-row-keys="expands" @row-click="openDetails" empty-text='暂无数据'>
          <el-table-column type="expand" v-show='hello'>
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="内容：">
                  <span class='content-tab'>{{ props.row.content }}</span>
                </el-form-item>
                <el-form-item>
                  <div class="input-back">
                    <input type="text" name="" value="" class='inputValue'>
                    <span @click='replyTask(props.row.index,props.row.taskId,$event)' class='replyValue'>回复</span>
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
              <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;">
              <div>{{ props.row.title }}</div>
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
                <div v-if='props.row.lastReplyStatus=="UNREAD"' style="color:rgb(217, 52, 55)">
                  <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                </div>
                <div v-if='props.row.lastReplyStatus=="READED"'>
                  <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="props">
                <el-button
                  size="small"
                  class='complete' v-if='props.row.taskStatusType=="ASSIGNED"' @click='assignTask(props.row.taskId,$event)'>分配任务</el-button>
                  <el-button
                    size="small"
                    class='complete' v-if='props.row.taskStatusType=="APPROVING"' @click='lateCheck(props.row.changeType,props.row.taskId,props.row.planEndDate,2,$event)'>任务审核</el-button>
                    <el-button
                      size="small"
                      class='complete' v-if='props.row.taskStatusType=="WAITEVALUATE"' @click='completeModal(props.row.taskId,$event)'>任务评价</el-button>
              </template>
          </el-table-column>
        </el-table>
        <div class="pagination-depart" v-if='total1>0'>
          <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="currentPage1" :page-sizes="[10, 15, 50]" :page-size=pageSize1 layout="total, sizes, prev, pager, next, jumper" :total=total1>
          </el-pagination>
        </div>
      </div>

      <div class="untreatTask-table taskNum2" v-show=" 2 == num">
        <el-table
          :data="resultTask2"
          style="width: 100%" @expand="startExpend" row-key="taskId"
              :expand-row-keys="expands" @row-click="openDetails" empty-text='暂无数据'>
          <el-table-column type="expand" v-show='hello'>
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="内容：">
                  <span class='content-tab'>{{ props.row.content }}</span>
                </el-form-item>
                <el-form-item>
                  <div class="input-back">
                    <input type="text" name="" value="" class='inputValue'>
                    <span @click='replyTask(props.row.index,props.row.taskId,$event)' class='replyValue'>回复</span>
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
              <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;">
              <div>{{ props.row.title }}</div>
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
                <div v-if='props.row.lastReplyStatus=="UNREAD"' style="color:rgb(217, 52, 55)">
                  <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                </div>
                <div v-if='props.row.lastReplyStatus=="READED"'>
                  <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="props">
                <el-button
                  size="small"
                  class='complete' v-if='props.row.taskStatusType=="ASSIGNED"' @click='assignTask(props.row.taskId,$event)'>分配任务</el-button>
                  <el-button
                    size="small"
                    class='complete' v-if='props.row.taskStatusType=="APPROVING"' @click='lateCheck(props.row.changeType,props.row.taskId,props.row.planEndDate,$event)'>任务审核</el-button>
                    <el-button
                      size="small"
                      class='complete' v-if='props.row.taskStatusType=="WAITEVALUATE"' @click='completeModal(props.row.taskId,$event)'>任务评价</el-button>
              </template>
          </el-table-column>
        </el-table>
        <div class="pagination-depart" v-if='total2>0'>
          <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="currentPage2" :page-sizes="[10, 15, 50]" :page-size=pageSize2 layout="total, sizes, prev, pager, next, jumper" :total=total2>
          </el-pagination>
        </div>
      </div>

      <div class="untreatTask-table taskNum3" v-show=" 3 == num">
        <el-table
          :data="resultTask3"
          style="width: 100%" @expand="startExpend" row-key="taskId"
              :expand-row-keys="expands" @row-click="openDetails" empty-text='暂无数据'>
          <el-table-column type="expand" v-show='hello'>
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="内容：">
                  <span class='content-tab'>{{ props.row.content }}</span>
                </el-form-item>
                <el-form-item>
                  <div class="input-back">
                    <input type="text" name="" value="" class='inputValue'>
                    <span @click='replyTask(props.row.index,props.row.taskId,$event)' class='replyValue'>回复</span>
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
              <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;">
              <div>{{ props.row.title }}</div>
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
                <div v-if='props.row.lastReplyStatus=="UNREAD"' style="color:rgb(217, 52, 55)">
                  <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                </div>
                <div v-if='props.row.lastReplyStatus=="READED"'>
                  <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="props">
                <el-button
                  size="small"
                  class='complete' v-if='props.row.taskStatusType=="ASSIGNED"' @click='assignTask(props.row.taskId,$event)'>分配任务</el-button>
                  <el-button
                    size="small"
                    class='complete' v-if='props.row.taskStatusType=="APPROVING"' @click='lateCheck(props.row.changeType,props.row.taskId,props.row.planEndDate,$event)'>任务审核</el-button>
                    <el-button
                      size="small"
                      class='complete' v-if='props.row.taskStatusType=="WAITEVALUATE"' @click='completeModal(props.row.taskId,$event)'>任务评价</el-button>
              </template>
          </el-table-column>
        </el-table>
        <div class="pagination-depart" v-if='total3>0'>
          <el-pagination @size-change="handleSizeChange3" @current-change="handleCurrentChange3" :current-page="currentPage3" :page-sizes="[10, 15, 50]" :page-size=pageSize3 layout="total, sizes, prev, pager, next, jumper" :total=total3>
          </el-pagination>
        </div>
      </div>

      <div class="untreatTask-table taskNum4" v-show=" 4 == num">
        <el-table
          :data="resultTask4"
          style="width: 100%" @expand="startExpend" row-key="taskId"
              :expand-row-keys="expands" @row-click="openDetails" empty-text='暂无数据'>
          <el-table-column type="expand" v-show='hello'>
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="内容：">
                  <span class='content-tab'>{{ props.row.content }}</span>
                </el-form-item>
                <el-form-item>
                  <div class="input-back">
                    <input type="text" name="" value="" class='inputValue'>
                    <span @click='replyTask(props.row.index,props.row.taskId,$event)' class='replyValue'>回复</span>
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
              <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;">
              <div>{{ props.row.title }}</div>
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
                <div v-if='props.row.lastReplyStatus=="UNREAD"' style="color:rgb(217, 52, 55)">
                  <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                </div>
                <div v-if='props.row.lastReplyStatus=="READED"'>
                  <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="props">
                <!-- <el-button
                  size="small"
                  class='complete' v-if='props.row.taskStatusType=="ASSIGNED"' @click='assignTask(props.row.taskId,$event)'>分配任务</el-button>
                  <el-button
                    size="small"
                    class='complete' v-if='props.row.taskStatusType=="APPROVING"' @click='lateCheck(props.row.changeType,props.row.taskId,props.row.planEndDate,$event)'>任务审核</el-button>-->
                    <el-button
                      size="small"
                      class='complete' @click='completeModal(props.row.taskId,$event)'>任务评价</el-button>
              </template>
          </el-table-column>
        </el-table>
        <div class="pagination-depart" v-if='total4>0'>
          <el-pagination @size-change="handleSizeChange4" @current-change="handleCurrentChange4" :current-page="currentPage4" :page-sizes="[10, 15, 50]" :page-size=pageSize4 layout="total, sizes, prev, pager, next, jumper" :total=total4>
          </el-pagination>
        </div>
      </div>
      <!--待完善-->
      <div class="untreatTask-table taskNum5" v-show=" 5 == num">
        <el-table
          :data="resultTask5"
          style="width: 100%" @expand="startExpend" row-key="taskId"
          :expand-row-keys="expands" @row-click="openDetails" empty-text='暂无数据'>
          <el-table-column type="expand" v-show='hello'>
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="内容：">
                  <span class='content-tab'>{{ props.row.content }}</span>
                </el-form-item>
                <el-form-item>
                  <!-- <div class="input-back">
                    <input type="text" name="" value="" class='inputValue'>
                    <span @click='replyTask(props.row.index,props.row.taskId,$event)' class='replyValue'>回复</span>
                  </div>
                  <div class="" v-for='item in props.row.taskReplys'>
                    <div class="reback-time">
                      {{item.replyTimeDistanceDesc}}
                    </div>
                    <div class="reback" style="max-width: 294px;min-width: 296px;overflow:hidden;">
                      <div style="float:left;">{{item.replyUser.userName}}：</div><div style="float:left;max-width: 247px;word-break: break-all; word-wrap:break-word;">{{item.replyContent}}</div>
                    </div>
                  </div> -->

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
                  <!-- <div class="reback reback1">
                    开始日期：{{ props.row.planStartDate }}
                  </div>
                  <div class="reback reback1">
                    截止日期：{{ props.row.planEndDate  }}
                  </div> -->
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
              <!-- <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;"> -->
                <div>{{ props.row.title }}</div>
              <!-- </router-link> -->
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
                <div v-if='props.row.lastReplyStatus=="UNREAD"' style="color:rgb(217, 52, 55)">
                  <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                </div>
                <div v-if='props.row.lastReplyStatus=="READED"'>
                  <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="props">
              <el-button
                size="small"
                class='complete' @click='editorTask(props.row.taskId,$event)'>编辑任务</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-depart" v-if='total5>0'>
          <el-pagination @size-change="handleSizeChange5" @current-change="handleCurrentChange5"
                         :current-page="currentPage5" :page-sizes="[10, 15, 50]"
                         :page-size=pageSize5 layout="total, sizes, prev, pager, next, jumper" :total=total5>
          </el-pagination>
        </div>
      </div>

      <!-- 我的任务 -->
      <div class="untreatTask-button" >
        <div class="important-task">
          <ul>
            <li style="background: #FBEBEC;border-color:#FBEBEC;width:130px;padding:0;">我的任务</li>
          </ul>
        </div>
      </div>
      <div class="untreatTask-table mytask">
        <el-table :data="result" @expand="startExpend" row-key="taskId"
            :expand-row-keys="expands1" @row-click="openDetails1" style="width: 100%" empty-text='暂无数据'>
          <el-table-column type="expand" v-show='hello'>
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="内容：">
                    <span class='content-tab'>{{ props.row.content }}</span>
                  </el-form-item>
                  <el-form-item>
                    <div class="input-back">
                      <input type="text" name="" value="" class='inputValue'>
                      <span @click='replyTask(props.row.index,props.row.taskId,$event)' class='replyValue'>回复</span>
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
                    <!-- <div class="reback reback1">
                      自动回复：{{props.row.repeatRule }}
                    </div> -->
                  </el-form-item>
                  <el-form-item>
                    <div class="special">
                         特别
                    </div>
                  </el-form-item>
                </el-form>
              </template>
          </el-table-column>
          <el-table-column label="任务标题" prop="id">
            <template slot-scope="props">
                <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;">
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
          <el-table-column label="最新回复" prop="name">
            <template slot-scope="props">
              <div class="" v-if='props.row.lastTaskReplyer!=null'>
                <div v-if='props.row.lastReplyStatus=="UNREAD"' style="color:rgb(217, 52, 55)">
                  <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                </div>
                <div v-if='props.row.lastReplyStatus=="READED"'>
                  <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                </div>
              </div>
              </template>
          </el-table-column>
          <el-table-column label="任务状态" prop="desc" width='180'>
            <template slot-scope="props">
                  <span>
                    <div >
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
          <el-table-column label="操作">
            <template slot-scope="props">
              <span v-if='props.row.hadremind==false'>
                <span>
                  <!-- <el-button
                    size="small"
                   :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='cancle(props.row.taskId)'>取消</el-button> -->
                   <el-button
                     size="small"
                    class='complete' v-if='props.row.canUpdate==true&&props.row.taskStatus=="UNCOMPLETION"' @click='cancle(props.row.taskId,$event)'>取消</el-button>
                </span>
                <span>
                  <!-- <el-button
                    size="small"
                    :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='delay(props.row.taskId,props.row.planEndDate)'>延期</el-button> -->
                    <el-button
                      size="small"
                       class='complete' v-if='props.row.canUpdate&&props.row.taskStatus=="UNCOMPLETION"'   @click='delay(props.row.taskId,props.row.planEndDate,$event)'>延期</el-button>
                  </span>
                  <span>
                    <!-- <el-button
                      size="small"
                      :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='levelChange(props.row.taskId)'>等级变更</el-button> -->
                      <el-button
                        size="small"
                        class='complete' v-if='props.row.canUpdate&&props.row.taskStatus=="UNCOMPLETION"' @click='levelChange(props.row.taskId,$event)'>等级变更</el-button>
                    </span>
                    <span>
                      <!-- <el-button
                        size="small"
                        :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='levelComeplete1(props.row.taskId)'>完成</el-button> -->
                        <el-button
                          size="small"
                          class='complete' v-if='props.row.canUpdate&&props.row.taskStatus=="UNCOMPLETION"' @click='levelComeplete1(props.row.taskId,$event)'>完成</el-button>
                    </span>
                    </span>
                    <span v-else>
                      <el-button
                        size="small"
                        class='complete' @click='levelComeplete1(props.row.taskId,$event)'>确认完成</el-button>
                        <el-button
                          size="small"
                          class='complete' @click='unCompleteTask(props.row.taskId,$event)'>未完成</el-button>
                    </span>

              </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="untreatTask-button" >
        <div class="important-task">
          <ul>
            <li style="background: #FBEBEC;border-color:#FBEBEC;width:130px;padding:0;">其它任务</li>
          </ul>
        </div>
      </div>
      <div class="untreatTask-table otherTask">
        <el-table :data="result11" @expand="startExpend" row-key="taskId"
            :expand-row-keys="expands2" @row-click="openDetails2"  style="width: 100%" empty-text='暂无数据'>
          <el-table-column type="expand" v-show='hello'>
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="内容：">
                    <span class='content-tab'>{{ props.row.content }}</span>
                  </el-form-item>
                  <el-form-item>
                    <div class="input-back">
                      <input type="text" name="" value="" class='inputValue'>
                      <span @click='replyTask(props.row.index,props.row.taskId,$event)' class='replyValue'>回复</span>
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
                    <!-- <div class="reback reback1">
                      自动回复：{{props.row.repeatRule }}
                    </div> -->
                  </el-form-item>
                  <el-form-item>
                    <div class="special">
                         特别
                    </div>
                  </el-form-item>
                </el-form>
              </template>
          </el-table-column>
          <el-table-column label="任务标题" prop="id">
            <template slot-scope="props">
                <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;">
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
          <el-table-column label="最新回复" prop="name">
            <template slot-scope="props">
              <div class="" v-if='props.row.lastTaskReplyer!=null'>
                <div v-if='props.row.lastReplyStatus=="UNREAD"' style="color:rgb(217, 52, 55)">
                  <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                </div>
                <div v-if='props.row.lastReplyStatus=="READED"'>
                  <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                </div>
              </div>
              </template>
          </el-table-column>
          <el-table-column label="任务状态" prop="desc" width='180'>
            <template slot-scope="props">
                  <span>
                    <div >
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
          <el-table-column label="操作">
            <template slot-scope="props">
              <span>
                <span>
                  <!-- <el-button
                    size="small"
                   :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='cancle(props.row.taskId)'>取消</el-button> -->
                   <el-button
                     size="small"
                    class='complete' v-if='props.row.canUpdate==true' @click='cancle(props.row.taskId,$event)'>取消</el-button>
                </span>
                <span>
                  <!-- <el-button
                    size="small"
                    :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='delay(props.row.taskId,props.row.planEndDate)'>延期</el-button>-->
                    <el-button
                      size="small"
                       class='complete' v-if='props.row.canUpdate==true&&props.row.taskStatus=="UNCOMPLETION"'   @click='delay(props.row.taskId,props.row.planEndDate,$event)'>延期</el-button>
                  </span>
                  <span>
                    <!-- <el-button
                      size="small"
                      :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='levelChange(props.row.taskId)'>等级变更</el-button> -->
                      <el-button
                        size="small"
                        class='complete' v-if='props.row.canUpdate==true&&props.row.taskStatus=="UNCOMPLETION"' @click='levelChange(props.row.taskId,$event)'>等级变更</el-button>
                    </span>
                    <span v-if='props.row.myselfTaskJudge==false&&props.row.taskStatus=="UNCOMPLETION"'>
                      <el-button
                        size="small"
                        class='complete' v-if='props.row.hadremind==false' @click='tipCompleteModal(props.row.taskId,$event)'>提醒完成</el-button>
                        <el-button
                          size="small"
                          :plain="true" :disabled="true" class='disable-button' v-if='props.row.hadremind==true' @click='tipCompleteModal(props.row.taskId,$event)'>已提醒完成</el-button>
                    </span>
                    <span v-else>
                      <el-button
                        size="small"
                        class='complete' v-if='props.row.taskStatus!="COMPLETION"'  @click='completeModal(props.row.taskId,$event)'>完成</el-button>
                    </span>
                    </span>
              </template>
          </el-table-column>
        </el-table>
        <div class="pagination-depart" v-if='total11>0'>
          <el-pagination @size-change="handleSizeChange11" @current-change="handleCurrentChange11" :current-page="currentPage11" :page-sizes="[10, 15, 50]" :page-size=pageSize11 layout="total, sizes, prev, pager, next, jumper" :total=total11>
          </el-pagination>
        </div>

      </div>




      <!-- 部门视图 -->
      <div class="">
        <!-- 投研中心 -->
        <div class="take-top-wrapper d_jump" index='01' style="margin-top:10px;">
          <div class="take-left">
            <div class="take-top">
              员工任务
            </div>
          </div>
        </div>
        <div class="staffView">
          <div class="take-top-wrapper" style="margin-top:10px;margin-bottom:5px;">
            <div class="take-left">
              <div class="take-top" style="float:left;width:auto;min-width:280px;">
                {{result3.deptName}}
              </div>
            </div>
            <div ref="mybox" class="packUp" @click='packUp()' style="margin-right:44px;float:right;margin-top:9px;cursor:pointer;text-align:center;font-size: 12px;line-height:28px;color:#D93538;width:65px;height:28px;border: 1px solid #D93538;border-radius: 4px;">
              收起
            </div>
          </div>
          <div class="">

          <div class="partView" v-for='(item1,index1) in result3.taskInfos'>
            <div class="take-top-wrapper" style="margin-top:10px;background:rgba(217, 52, 55, 0.02);">
              <div class="take-left">
                <div class="take-top" style="float:left;width:auto;min-width:280px;">
                  {{index1+1}}.{{item1.taskTypeName}}
                </div>
              </div>
              <div @click='mindTask1(item1.taskTypeId)'style="float:right;margin-top:9px;margin-right:44px;margin-left:4px;cursor:pointer;text-align:center;font-size: 12px;line-height:28px;color:#D93538;width:65px;height:28px;border:1px solid #D93538;border-radius: 4px;">
                添加任务
              </div>
              <div ref="mybox2" class="packUp mybox2" @click='packUp2(item1.index)' style="margin-left:6px;float:right;margin-top:9px;cursor:pointer;text-align:center;font-size: 12px;line-height:28px;color:#D93538;width:65px;height:28px;border:1px solid #D93538;border-radius: 4px;">
                收起
              </div>
            </div>
            <div class="untreatTask-table">
              <el-table :data="item1.tasks" @expand="startExpend" row-key="taskId"
                  :expand-row-keys="expands" @row-click="openDetails" style="width: 100%" empty-text='暂无数据'>
                <el-table-column type="expand" v-show='hello'>
                  <template slot-scope="props">
                      <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="内容：">
                          <span class='content-tab'>{{ props.row.content }}</span>
                        </el-form-item>
                        <el-form-item>
                          <div class="input-back">
                            <input type="text" name="" value="" class='inputValue'>
                            <span @click='replyTask(props.row.index,props.row.taskId,$event,1)' class='replyValue'>回复</span>
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
                          <!-- <div class="reback reback1">
                            自动回复：{{props.row.repeatRule }}
                          </div> -->
                        </el-form-item>
                        <el-form-item>
                          <div class="special">
                               特别
                          </div>
                        </el-form-item>
                      </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="任务标题" prop="id">
                  <template slot-scope="props">
                      <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;">
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
                <el-table-column label="最新回复" prop="name">
                  <template slot-scope="props">
                    <div class="" v-if='props.row.lastTaskReplyer!=null'>
                      <div v-if='props.row.lastReplyStatus=="UNREAD"' style="color:rgb(217, 52, 55)">

                        <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                      </div>
                      <div v-if='props.row.lastReplyStatus=="READED"'>

                        <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                      </div>
                    </div>
                    </template>
                </el-table-column>
                <el-table-column label="任务状态" prop="desc" width='180'>
                  <template slot-scope="props">
                        <span>
                          <div >
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
                <el-table-column label="操作">
                  <template slot-scope="props">
                      <span>
                        <!-- <el-button
                          size="small"
                         :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='cancle(props.row.taskId)'>取消</el-button> -->
                         <el-button
                           size="small"
                          class='complete' v-if='props.row.taskStatus=="UNCOMPLETION"' @click='cancle(props.row.taskId,$event)'>取消</el-button>
                      </span>
                      <span>
                        <!-- <el-button
                          size="small"
                          :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='delay(props.row.taskId,props.row.planEndDate)'>延期</el-button> -->
                          <el-button
                            size="small"
                             class='complete' v-if='props.row.taskStatus=="UNCOMPLETION"'   @click='delay(props.row.taskId,props.row.planEndDate,$event)'>延期</el-button>
                        </span>
                        <span >
                          <!-- <el-button
                            size="small"
                            :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='levelChange(props.row.taskId)'>等级变更</el-button> -->
                            <el-button
                              size="small"
                              class='complete' v-if='props.row.taskStatus=="UNCOMPLETION"' @click='levelChange(props.row.taskId,$event)'>等级变更</el-button>
                          </span>
                          <span>
                            <!-- <el-button
                              size="small"
                              :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='levelComeplete(props.row.taskId)'>完成</el-button> -->

                            <span v-if='props.row.myselfTaskJudge==false&&props.row.taskStatus=="UNCOMPLETION"'>
                              <el-button
                                size="small"
                                class='complete' v-if='props.row.hadremind==false' @click='tipCompleteModal(props.row.taskId,$event)'>提醒完成</el-button>
                                <el-button
                                  size="small"
                                  :plain="true" :disabled="true" class='disable-button' v-if='props.row.hadremind==true' @click='tipCompleteModal(props.row.taskId,$event)'>已提醒完成</el-button>
                            </span>
                            <span v-else>
                              <el-button
                                size="small"
                                class='complete' v-if='props.row.taskStatus!="COMPLETION"'  @click='completeModal(props.row.taskId,$event)'>完成</el-button>
                            </span>
                          </span>
                    </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="childrenView" v-for='(item2,index2) in result3.branchTaskInfoDeptmentalVos'>
            <div class="take-top-wrapper" style="margin-top:10px;background:rgba(217, 53, 56, 0.1);">
              <div class="take-left">
                <div class="take-top" style="float:left;width:auto;min-width:280px;">
                  {{item2.deptName}}
                </div>
              </div>
              <div ref="mybox3" class="packUp mybox2" @click='packUp3(item2.index)' style="margin-right:44px;float:right;margin-top:9px;cursor:pointer;text-align:center;font-size: 12px;line-height:28px;color:#D93538;width:65px;height:28px;border:1px solid #D93538;border-radius: 4px;">
                收起
              </div>
            </div>
            <div class="">


            <div class="" v-for='(item3,index3) in item2.taskInfos'>
              <div class="take-top-wrapper" style="margin-top:10px;background:rgba(217, 52, 55, 0.02);">
                <div class="take-left">
                  <div class="take-top" style="float:left;width:auto;min-width:280px;">
                    {{index3+1}}、{{item3.taskTypeName}}
                  </div>
                </div>
                <div @click='mindTask1(item3.taskTypeId)'style="float:right;margin-top:9px;margin-right:44px;margin-left:4px;cursor:pointer;text-align:center;font-size: 12px;line-height:28px;color:#D93538;width:65px;height:28px;border:1px solid #D93538;border-radius: 4px;">
                  添加任务
                </div>
                <div ref="mybox2" class="packUp mybox2" @click='packUp2(item3.index)' style="margin-right:44px;float:right;margin-top:9px;cursor:pointer;text-align:center;font-size: 12px;line-height:28px;color:#D93538;width:65px;height:28px;border:1px solid #D93538;border-radius: 4px;">
                  收起
                </div>
              </div>
              <div class="untreatTask-table">
                <el-table :data="item3.tasks" @expand="startExpend" row-key="taskId"
                    :expand-row-keys="expands" @row-click="openDetails" style="width: 100%" empty-text='暂无数据'>
                  <el-table-column type="expand" v-show='hello'>
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                          <el-form-item label="内容：">
                            <span class='content-tab'>{{ props.row.content }}</span>
                          </el-form-item>
                          <el-form-item>
                            <div class="input-back">
                              <input type="text" name="" value="" class='inputValue'>
                              <span @click='replyTask(props.row.index,props.row.taskId,$event,1)' class='replyValue'>回复</span>
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
                            <!-- <div class="reback reback1">
                              自动回复：{{props.row.repeatRule }}
                            </div> -->
                          </el-form-item>
                          <el-form-item>
                            <div class="special">
                                 特别
                            </div>
                          </el-form-item>
                        </el-form>
                      </template>
                  </el-table-column>
                  <el-table-column label="任务标题" prop="id">
                    <template slot-scope="props">
                        <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;">
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
                  <el-table-column label="最新回复" prop="name">
                    <template slot-scope="props">
                      <div class="" v-if='props.row.lastTaskReplyer!=null'>
                        <div v-if='props.row.lastReplyStatus=="UNREAD"' style="color:rgb(217, 52, 55)">

                          <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                        </div>
                        <div v-if='props.row.lastReplyStatus=="READED"'>

                          <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                        </div>
                      </div>
                      </template>
                  </el-table-column>
                  <el-table-column label="任务状态" prop="desc" width='180'>
                    <template slot-scope="props">
                          <span>
                            <div >
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
                  <el-table-column label="操作">
                    <template slot-scope="props">
                        <span>
                          <!-- <el-button
                            size="small"
                           :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='cancle(props.row.taskId)'>取消</el-button> -->
                           <el-button
                             size="small"
                            class='complete' v-if='props.row.taskStatus=="UNCOMPLETION"' @click='cancle(props.row.taskId,$event)'>取消</el-button>
                        </span>
                        <span>
                          <!-- <el-button
                            size="small"
                            :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='delay(props.row.taskId,props.row.planEndDate)'>延期</el-button> -->
                            <el-button
                              size="small"
                               class='complete' v-if='props.row.taskStatus=="UNCOMPLETION"'   @click='delay(props.row.taskId,props.row.planEndDate,$event)'>延期</el-button>
                          </span>
                          <span >
                            <!-- <el-button
                              size="small"
                              :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='levelChange(props.row.taskId)'>等级变更</el-button> -->
                              <el-button
                                size="small"
                                class='complete' v-if='props.row.taskStatus=="UNCOMPLETION"' @click='levelChange(props.row.taskId,$event)'>等级变更</el-button>
                            </span>
                            <span>
                              <!-- <el-button
                                size="small"
                                :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='levelComeplete(props.row.taskId)'>完成</el-button> -->

                              <span v-if='props.row.myselfTaskJudge==false&&props.row.taskStatus=="UNCOMPLETION"'>
                                <el-button
                                  size="small"
                                  class='complete' v-if='props.row.hadremind==false' @click='tipCompleteModal(props.row.taskId,$event)'>提醒完成</el-button>
                                  <el-button
                                    size="small"
                                    :plain="true" :disabled="true" class='disable-button' v-if='props.row.hadremind==true' @click='tipCompleteModal(props.row.taskId,$event)'>已提醒完成</el-button>
                              </span>
                              <span v-else>
                                <el-button
                                  size="small"
                                  class='complete' v-if='props.row.taskStatus!="COMPLETION"'  @click='completeModal(props.row.taskId,$event)'>完成</el-button>
                              </span>
                            </span>
                      </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      </div>

      <div class="">
        <!--发布任务模态窗-->
        <el-dialog title='取消任务审核' :visible.sync="dialogVisible6" size="tiny" :before-close="handleClose6" top='23%'>
          <el-form :model="ruleForm6" :rules="rules" ref="ruleForm6" label-width="112px" class="demo-ruleForm">
            <el-form-item label="取消原因：" prop="cancleCause"  required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm6.cancleCause" :disabled="true"></el-input>
            </el-form-item>
            <!-- <el-form-item label="审核原因：" prop="becomCuase3" required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm6.becomCuase3"></el-input>
            </el-form-item> -->
          </el-form>
          <span slot="footer" class="dialog-footer">
              <button  @click="resetForm6('ruleForm6')">不同意</button>
              <button  @click="submitForm6('ruleForm6')">同 意</button>
            </span>
        </el-dialog>
      </div>
      <div class="">
        <!--申请取消原因模态窗-->
        <el-dialog
          title="审核原因"
          :visible.sync="dialogVisibleS"
          size="tiny"
          :before-close="handleCloseS" top='25%' class=" noticeManageModel">
          <el-form :model="ruleFormS" :rules="rules" ref="ruleFormS" label-width="112px" class="demo-ruleForm">
            <el-form-item label="审核原因：" prop="becomCuase2" required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleFormS.becomCuase2"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <button  @click="resetFormS('ruleFormS')">取 消</button>
            <button  @click="submitFormS('ruleFormS')">确定</button>
          </span>
        </el-dialog>
      </div>
      <div class="">
        <!--发布任务模态窗-->
        <el-dialog :title='becomeTitle' :visible.sync="dialogVisible7" size="tiny" :before-close="handleClose7" top='23%'>
          <el-form :model="ruleForm7" :rules="rules" ref="ruleForm7" label-width="112px" class="demo-ruleForm">
            <el-form-item label="重要等级:" prop="grades" required style="margin-right: 40px !important;">
              <el-select v-model="ruleForm7.grades" placeholder="请选择任务等级" style="width:100%;">
                <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="变更原因："  required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm7.becomCuase1" :disabled="true"></el-input>
            </el-form-item>
            <!-- <el-form-item label="审核原因：" prop="becomCuase2" required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm7.becomCuase2"></el-input>
            </el-form-item> -->
          </el-form>
          <span slot="footer" class="dialog-footer">
              <button  @click="resetForm7('ruleForm7')">不同意</button>
              <button  @click="submitForm7('ruleForm7')">同 意</button>
            </span>
        </el-dialog>
      </div>
      <div class="">
        <!--发布任务模态窗-->
        <el-dialog title='完成任务' :visible.sync="dialogVisible8" size="tiny" :before-close="handleClose8" top='23%'>
          <el-form :model="ruleForm8" :rules="rules" ref="ruleForm8" label-width="112px" class="demo-ruleForm">
            <el-form-item label="完成质量:" prop="mass" required style="margin-right: 40px !important;">
              <el-select v-model="ruleForm8.mass" placeholder="请选择完成质量" style="width:100%;" @change='completeMass'>
                <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="快速点评:"  style="margin-right: 40px !important;">
              <el-select v-model="ruleForm8.rate" placeholder="请选择快速点评" style="width:100%;" @change='completeRate'>
                <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务评价：" prop="rateContent" required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm8.rateContent"></el-input>
            </el-form-item>
            <el-form-item label="自我评价："  required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm8.rateMine" :disabled="true"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <button  @click="resetForm8('ruleForm8')">取 消</button>
              <button  @click="submitForm8('ruleForm8')">确 认</button>
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
        <!--延期审核-->
        <el-dialog title="延期任务审核" :visible.sync="dialogVisible4" size="tiny" :before-close="handleClose4" top='20%' class=" noticeManageModel">
          <el-form :model="ruleForm14" :rules="rules" ref="ruleForm14" label-width="112px" class="demo-ruleForm">
            <el-form-item label="延期时间:" required style="margin-right: 40px !important;height:36px;">
              <el-form-item prop="date2">
                <el-date-picker type="date" :picker-options="pickerOptions1" placeholder="选择日期" v-model="ruleForm14.date2" :disabled="true" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-form-item>
            <el-form-item label="延期原因：" prop="delayCause" required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm14.delayCause" :disabled="true"></el-input>
            </el-form-item>
            <!-- <el-form-item label="审核原因：" prop="becomCuase4" required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm14.becomCuase4" ></el-input>
            </el-form-item> -->
          </el-form>

          <span slot="footer" class="dialog-footer">
              <button  @click="resetForm4('ruleForm14')">不同意</button>
              <button  @click="submitForm4('ruleForm14')">同 意</button>
            </span>
        </el-dialog>
      </div>
      <div class="">
        <!--发布任务模态窗-->
        <el-dialog title='添加任务类型' :visible.sync="dialogVisible5" size="tiny" :before-close="handleClose5" top='23%'>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="112px" class="demo-ruleForm">
            <!-- <el-form-item label="任务类型:" prop="name" style="margin-right: 40px !important;">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="任务峰值:" prop="region" required style="margin-right: 40px !important;">
              <el-select v-model="ruleForm.region" placeholder="请选择执行人" style="width:100%;">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item> -->
          </el-form>
          <span slot="footer" class="dialog-footer">
              <button  @click="resetForm5('ruleForm')">取 消</button>
              <button  @click="submitForm5('ruleForm')">确 认</button>
            </span>
        </el-dialog>
      </div>
      <div class="">
        <!--发布任务模态窗-->
        <el-dialog title="分配任务" :visible.sync="dialogVisible3" size="tiny" :before-close="handleClose3" top='10%' class=" noticeManageModel">
          <el-form :model="ruleForm13" :rules="rules" ref="ruleForm13" label-width="112px" class="demo-ruleForm">
            <el-form-item label="任务标题:" prop="name13" style="margin-right: 40px !important;">
              <el-input v-model="ruleForm13.name13" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="执行人:" prop="value15" required style="margin-right: 40px !important;">
              <el-select v-model="ruleForm13.value15" filterable placeholder="请选择执行人" style="width:100%;" @change='goLink1'>
                <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务类型:" prop="value14" required style="margin-right: 40px !important;">
              <el-select v-model="ruleForm13.value14" :disabled="true" placeholder="请选择类型" style="width:100%;" @click="choseTaskType13">
                <el-option v-for="item in optionType1" :key="item.taskTypeId" :label="item.taskTypeName" :value="item.taskTypeId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务汇报对象:" required prop="telObj13" style="margin-right: 40px !important;">
              <el-select v-model="ruleForm13.telObj13" filterable placeholder="请选择任务汇报对象" style="width:100%;">
                <el-option v-for="item in optionsObj1" :key="item.userId" :label="item.userName" :value="item.userId">
                </el-option>
              </el-select>
              <!-- <el-input v-model="ruleForm.telObj"></el-input> -->
            </el-form-item>
            <el-form-item label="任务重要等级:" prop="value13" :disabled="true" required class="special1" style="margin-right: 40px !important;">
              <el-select v-model="ruleForm13.value13" placeholder="请选择任务等级" style="width:100%;" :disabled="true">
                <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <i class="el-icon-information" style="float:left;margin-right: 40px !important;" @mouseenter="iconEnter1" @mouseleave="iconLeave1"></i>
              <div class="tip-information" ref="displayShow1">
                <p>任务重要程度：</p>
                <p>公司重点任务，重要系数：4</p>
                <p>部门重点任务，重要系数：2</p>
                <p>个人重点任务，重要系数：1</p>
                <p>个人普通任务，重要系数：0.5</p>
                <!-- <p>个人重点任务有数量限制，所有重要任务中，只有20%为个人重点，超出部分要提示用户移除一个现有的个人重点任务</p> -->
              </div>
            </el-form-item>
            <el-form-item label="完成时间:" style="margin-right: 40px !important;height:36px;">
              <el-form-item prop="date13">
                <el-date-picker type="date" :disabled="true" :picker-options="pickerOptions0" placeholder="选择日期" v-model="ruleForm13.date13" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-form-item>
            <el-form-item label="任务内容：" prop="content13" required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm13.content13"></el-input>
            </el-form-item>
            <div v-show="stretch1">
              <div class="user-wrapper" style="line-height:32px;margin-bottom:13px;margin-left:21px;">
                <div class='user-left'>任务协助人：</div>
                <div style="float:left;" class='user-right-wrapper'>
                  <div class='user-right' @click='adduser13'>添加协助人</div>
                  <div class="user-item ellipsis" v-for='(item,index) in brr13'>
                    <span class="ellipsis" style="display: inline-block;width: 100%">{{item.username}}（{{item.proportion}}%）</span>
                    <i class="el-icon-circle-close" @click="removeTodo13(index)"></i>
                  </div>

                </div>
              </div>
              <el-form-item label="关联项目:" style="margin-right: 40px !important;">
                <el-select v-model="ruleForm13.value17" placeholder="请选择关联项目" style="width:100%;" @click='choseRelateProject13'>
                  <el-option v-for="item in projects" :key="item.projectId" :label="item.projectName" :value="item.projectId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="任务可见范围:" style="margin-right: 40px !important;">
                <el-select  multiple  v-model="ruleForm13.value71" placeholder="请选择部门"  style="width:100%;">
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
              <div style="cursor: pointer" @click="Collapse1">
                <span>{{msg1}}</span>
                <i :class="stretch1 ? 'el-icon-arrow-up':'el-icon-arrow-down'"></i>
              </div>
            </div>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <button  @click="resetForm3('ruleForm13')">取 消</button>
              <button  @click="submitForm3('ruleForm13')">分配任务</button>
            </span>
        </el-dialog>
      </div>
      <div class="">
        <!--发布任务模态窗-->
        <el-dialog title="发起任务" :visible.sync="dialogVisible" size="tiny" :before-close="handleClose" top='10%' class=" noticeManageModel">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="112px" class="demo-ruleForm">
            <div style="margin-left:32px;margin-bottom:18px;overflow:hidden;">
              <span style="float:left;line-height:36px;"><label style="color:#ff4949">* </label>任务标题:</span>
              <el-input v-model="ruleForm.name" style="width:363px;margin-left:12px;float:left;"></el-input>
            </div>
            <div style="margin-left:46px;margin-bottom:18px;overflow:hidden;">
              <span style="float:left;vertical-align:middle;line-height:36px;">
                <label style="color:#ff4949">* </label>执行人:</span>
                <span style="width:363px;margin-left:12px;float:left;">
                  <el-select v-model="ruleForm.value5" filterable placeholder="请选择执行人" style="width:100%;" @change='goLink'>
                    <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId">
                    </el-option>
                  </el-select>
                </span>
            </div>
            <div style="margin-left:32px;margin-bottom:18px;overflow:hidden;">
              <span style="float:left;vertical-align:middle;line-height:36px;">
                <label style="color:#ff4949">* </label>任务类型:
              </span>
              <span style="width:363px;margin-left:12px;float:left;">
                <el-select v-model="ruleForm.value4" placeholder="请选择类型" style="width:100%;" @click="choseTaskType1">
                  <el-option v-for="item in optionType" :key="item.taskTypeId" :label="item.taskTypeName" :value="item.taskTypeId">
                  </el-option>
                </el-select>
              </span>
            </div>
            <div style="margin-left:4px;margin-bottom:18px;overflow:hidden;">
              <span style="float:left;vertical-align:middle;line-height:36px;">
                <label style="color:#ff4949">* </label>任务汇报对象:
              </span>
              <span style="width:363px;margin-left:12px;float:left;">
                <el-select v-model="ruleForm.telObj" filterable placeholder="请选择任务汇报对象" style="width:100%;">
                  <el-option v-for="item in optionsObj" :key="item.userId" :label="item.userName" :value="item.userId">
                  </el-option>
                </el-select>
              </span>
            </div>
            <div style="margin-left:4px;margin-bottom:18px;overflow:hidden;" class="clearfix">
              <span style="float:left;vertical-align:middle;line-height:36px;">
                <label style="color:#ff4949">* </label>任务重要等级:
              </span>
              <span style="width:363px;margin-left:12px;float:left;" class="special1">
                <el-select v-model="ruleForm.value3" placeholder="请选择任务等级" style="width:100%;">
                  <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <i class="el-icon-information" style="float:left;margin-right: 40px !important;" @mouseenter="iconEnter" @mouseleave="iconLeave"></i>
                <div class="tip-information" ref="displayShow">
                  <p>任务重要程度：</p>
                  <p>公司重点任务，重要系数：4</p>
                  <p>部门重点任务，重要系数：2</p>
                  <p>个人重点任务，重要系数：1</p>
                  <p>个人普通任务，重要系数：0.5</p>
                </div>
             </span>
           </div>
           <div style="margin-left:32px;margin-bottom:18px;overflow:hidden;">
              <span style="float:left;vertical-align:middle;line-height:36px;">
                <label style="color:#ff4949">* </label>完成时间:
              </span>
              <span style="width:363px;margin-left:12px;float:left;">
                <el-date-picker type="date" :picker-options="pickerOptions0" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
              </span>
           </div>
           <div style="margin-left:32px;margin-bottom:18px;overflow:hidden;">
             <span style="float:left;vertical-align:middle;line-height:36px;">
               <label style="color:#ff4949">* </label>任务内容:
             </span>
             <span style="width:363px;margin-left:12px;float:left;">
              <el-input type="textarea" v-model="ruleForm.content"></el-input>
             </span>
           </div>
            <div v-show="stretch">
              <div class="user-wrapper" style="line-height:32px;margin-bottom:13px;margin-left:21px;">
                <div class='user-left'>任务协助人：</div>
                <div style="float:left;" class='user-right-wrapper'>
                  <div class='user-right' @click='adduser'>添加协助人</div>
                  <div class="user-item ellipsis" v-for='(item,index) in brr'>
                    <span class="ellipsis" style="display: inline-block;width: 100%">{{item.username}}（{{item.proportion}}%）</span>
                    <i class="el-icon-circle-close" @click="removeTodo(index)"></i>
                  </div>

                </div>
              </div>
              <el-form-item label="关联项目:" style="margin-right: 40px !important;">
                <el-select v-model="ruleForm.value7" placeholder="请选择关联项目" style="width:100%;" @click='choseRelateProject'>
                  <el-option v-for="item in projects" :key="item.projectId" :label="item.projectName" :value="item.projectId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="任务可见范围:" style="margin-right: 40px !important;">
                <el-select  multiple  v-model="ruleForm.value71" placeholder="请选择部门"  style="width:100%;">
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
              <button  @click="resetForm('ruleForm')">取 消</button>
              <button  @click="saveDrafts('ruleForm')" class='saveDrafts'>保存草稿</button>
              <button  @click="submitForm('ruleForm')">发布任务</button>
            </span>
        </el-dialog>
      </div>
      <div class="">
        <!--添加协助人-->
        <el-dialog title="添加协助人" :visible.sync="dialogVisible15" size="tiny" :before-close="handleClose15" top='25%' class=" noticeManageModel">
          <el-form :model="ruleForm5" :rules="rules" ref="ruleForm5" label-width="112px" class="demo-ruleForm">
            <el-form-item label="姓名:" prop="username" style="margin-right: 40px !important;">
              <!-- <el-select v-model="ruleForm5.username" placeholder="请选择协助人" style="width:100%;" @click='choseUsers2'>
                 <el-option
                   v-for="item in users"
                   :key="item.userId"
                   :label="item.userName"
                   :value="item.userId">
                 </el-option>
               </el-select> -->
              <el-select v-model="ruleForm5.username" filterable placeholder="请选择协助人" style="width:100%;">
                <el-option v-for="item in usersT" :key="item.userId" :label="item.userName" :value="item.userId">
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
      <div class="">
        <!--延期任务模态窗-->
        <el-dialog title="申请任务延期" :visible.sync="dialogVisible12" size="tiny" :before-close="handleClose12" top='25%' class=" noticeManageModel">
          <el-form :model="ruleForm2" :rules="rules" ref="ruleForm2" label-width="112px" class="demo-ruleForm">
            <el-form-item label="延期时间:" required style="margin-right: 40px !important;height:36px;">
              <el-form-item prop="date1">
                <el-date-picker type="date" :picker-options="pickerOptions1" placeholder="选择日期" v-model="ruleForm2.date1" style="width: 100%;"></el-date-picker>
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
      <div class="">
        <!--添加协助人-->
        <el-dialog title="添加协助人" :visible.sync="dialogVisible25" size="tiny" :before-close="handleClose25" top='25%' class=" noticeManageModel">
          <el-form :model="ruleForm25" :rules="rules" ref="ruleForm25" label-width="112px" class="demo-ruleForm">
            <el-form-item label="姓名:" prop="username" style="margin-right: 40px !important;">
              <!-- <el-select v-model="ruleForm5.username" placeholder="请选择协助人" style="width:100%;" @click='choseUsers2'>
                 <el-option
                   v-for="item in users"
                   :key="item.userId"
                   :label="item.userName"
                   :value="item.userId">
                 </el-option>
               </el-select> -->
              <el-select v-model="ruleForm25.username" filterable placeholder="请选择协助人" style="width:100%;">
                <el-option v-for="item in usersT" :key="item.userId" :label="item.userName" :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="占比:" prop="percent1" style="margin-right: 80px !important;" class='addPercent'>
              <el-input v-model.number="ruleForm25.percent1"></el-input><span>%</span>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <button  @click="resetForm25('ruleForm25')">取 消</button>
              <button  @click="submitForm25('ruleForm25')">确定</button>
            </span>
        </el-dialog>
      </div>
      <div class="">
        <!--申请变更任务重要等级-->
        <el-dialog title="申请变更任务重要等级" :visible.sync="dialogVisible13" size="tiny" :before-close="handleClose13" top='25%' class=" noticeManageModel">
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
              <button  @click="resetForm13('ruleForm3')">取 消</button>
              <button  @click="submitForm13('ruleForm3')">确定</button>
            </span>
        </el-dialog>
      </div>
      <div class="">
        <!--申请取消原因模态窗-->
        <el-dialog title="申请取消原因" :visible.sync="dialogVisible1" size="tiny" :before-close="handleClose1" top='25%' class=" noticeManageModel">
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
        <!--自动重复功能-->
        <el-dialog title="自动重复功能" :visible.sync="dialogVisible21" size="tiny" :before-close="handleClose21" top='25%' class=" noticeManageModel">
          <el-form :model="ruleForm21" :rules="rules" ref="ruleForm21" label-width="112px" class="demo-ruleForm">
            <el-form-item label="间隔:" prop="num" style="margin-right: 80px !important;" class='addPercent'>
              <el-input v-model.number="ruleForm21.num"></el-input><span>天</span>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <button  @click="resetForm21('ruleForm21')">取 消</button>
              <button  @click="submitForm21('ruleForm21')">确定</button>
            </span>
        </el-dialog>
      </div>
      <div class="">
        <el-dialog title="重设任务等级"
                   :visible.sync="dialogVisible22" size="tiny" :before-close="handleClose22" top='10%' class="">
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
      <div class="deleteDepartment">
        <el-dialog
          title="个人重点任务超出提醒"
          :visible.sync="dialogVisible11"
          size="tiny"
          :before-close="handleClose11" top='25%' class="department">
          <p>您/他当前的个人重点任务数量为：{{taskNumber}}</p>
          <p>您可将已有个人重点任务改为个人普通任务</p>
          <p>已超出数量限制</p>
          <p style='color: #D93437;'>是否确定修改？</p>
          <span slot="footer" class="dialog-footer">
            <button @click="dialogVisible11 = false">取 消</button>
            <button  @click='sureDelete'>确 定</button>
          </span>
        </el-dialog>
      </div>
      <div class="">
        <!--自动重复功能-->
        <el-dialog title="自动重复功能" :visible.sync="dialogVisible23" size="tiny" :before-close="handleClose23" top='25%' class=" noticeManageModel">
          <el-form :model="ruleForm21" :rules="rules" ref="ruleForm21" label-width="112px" class="demo-ruleForm">
            <el-form-item label="间隔:" prop="num3" style="margin-right: 80px !important;" class='addPercent'>
              <el-input v-model.number="ruleForm21.num3"></el-input><span>月</span>
            </el-form-item>
            <div class="week-rapper">
              <ul>
                <li @click='one' v-bind:class="{ active: isActiObj.one }">一</li>
                <li @click='two' v-bind:class="{ active: isActiObj.two }">二</li>
                <li @click='three' v-bind:class="{ active: isActiObj.three }">三</li>
                <li @click='fore' v-bind:class="{ active: isActiObj.fore }">四</li>
                <li @click='five' v-bind:class="{ active: isActiObj.five}">五</li>
                <li @click='six' v-bind:class="{ active: isActiObj.six }">六</li>
                <li @click='seveen' v-bind:class="{ active: isActiObj.seveen }">日</li>
              </ul>
            </div>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <button  @click="resetForm23('ruleForm21')">取 消</button>
              <button  @click="submitForm23('ruleForm21')">确定</button>
            </span>
        </el-dialog>
      </div>
      <!--编辑任务模态窗-->
      <el-dialog title="编辑任务"
                 :visible.sync="dialogVisible10"
                 size="tiny"
                 :before-close="handleClose10"
                 top='10%'
                 class=" noticeManageModel">
        <el-form :model="ruleForm31" :rules="rules31" ref="ruleForm31" label-width="112px" class="demo-ruleForm">
          <el-form-item label="任务标题:" required prop="name13" style="margin-right: 40px !important;">
            <el-input v-model="ruleForm31.name13"></el-input>
          </el-form-item>
          <el-form-item label="执行人:"  required style="margin-right: 40px !important;">
            <el-select v-model="ruleForm31.value15" filterable placeholder="请选择执行人" style="width:100%;" @change='goLink'>
              <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务类型:" prop="value14" required style="margin-right: 40px !important;">
            <el-select v-model="ruleForm31.value14" placeholder="请选择类型" style="width:100%;" @click="choseTaskType1">
              <el-option v-for="item in optionType" :key="item.taskTypeId" :label="item.taskTypeName" :value="item.taskTypeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务汇报对象:" prop='telObj13' required  style="margin-right: 40px !important;">
            <el-select v-model="ruleForm31.telObj13" filterable placeholder="请选择任务汇报对象" style="width:100%;">
              <el-option v-for="item in optionsObj" :key="item.userId" :label="item.userName" :value="item.userId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务重要等级:" required class="special1" style="margin-right: 40px !important;">
            <el-select v-model="ruleForm31.value13" placeholder="请选择任务等级" style="width:100%;">
              <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <i class="el-icon-information" style="float:left;margin-right: 40px !important;" @mouseenter="iconEnter" @mouseleave="iconLeave"></i>
            <div class="tip-information" ref="displayShow">
              <p>任务重要程度：</p>
              <p>公司重点任务，重要系数：4</p>
              <p>部门重点任务，重要系数：2</p>
              <p>个人重点任务，重要系数：1</p>
              <p>个人普通任务，重要系数：0.5</p>
              <!-- <p>个人重点任务有数量限制，所有重要任务中，只有20%为个人重点，超出部分要提示用户移除一个现有的个人重点任务</p> -->
            </div>
          </el-form-item>
          <el-form-item label="完成时间:" required style="margin-right: 40px !important;height:36px;">
            <el-form-item>
              <el-date-picker type="date" :picker-options="pickerOptions0" placeholder="选择日期" v-model="ruleForm31.date13" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item label="任务内容：" required prop="content13" style="margin-right: 40px !important;">
            <el-input type="textarea" v-model="ruleForm31.content13"></el-input>
          </el-form-item>
          <div v-show="stretch">
            <div class="user-wrapper" style="line-height:32px;margin-bottom:13px;margin-left:21px;">
              <div class='user-left'>任务协助人：</div>
              <div style="float:left;" class='user-right-wrapper'>
                <div class='user-right' @click='adduser'>添加协助人</div>
                <div class="user-item ellipsis" v-for='(item,index) in brr'>
                  <span class="ellipsis" style="display: inline-block;width: 100%">{{item.username}}（{{item.proportion}}%）</span>
                  <i class="el-icon-circle-close" @click="removeTodo(index)"></i>
                </div>

              </div>
            </div>
            <el-form-item label="关联项目:" style="margin-right: 40px !important;">
              <el-select v-model="ruleForm.value7" placeholder="请选择关联项目" style="width:100%;" @click='choseRelateProject'>
                <el-option v-for="item in projects" :key="item.projectId" :label="item.projectName" :value="item.projectId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务可见范围:" style="margin-right: 40px !important;">
              <el-select  multiple  v-model="ruleForm.value71" placeholder="请选择部门"  style="width:100%;">
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
            <button  @click="resetForm31('ruleForm31')">取 消</button>
            <button  @click="submitForm31('ruleForm31')">保存</button>
          </span>
      </el-dialog>
    </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
// 注意标签和引入驼峰，可以有区别
import {
  listPending,
  delayTaskCause,
  remindTaskList,
  changeTaskLevel,
  cancelTaskCause,
  assignmentTask,
  listReportingUsers,
  assessTask,
  assessTaskDetail,
  getChangeType,
  completeTask,
  approvalTask,
  taskHeader,
  getCurrentUserDept,
  departNewTaskPending,
  departChangeTaskPending,
  departCommentTaskPending,
  departAssignedTaskPending,
  impChangeOrdTask,
  getTaskComment,
  userTaskList,
  departCommentTaskPendingUnCompleted,
  listTaskExecutors,
  publishTask,
  getUsersObj,
  getStaffAssisTask1,
  getAllStatisticsDepet,
  getDeptStatistics,
  userTaskReply,
  getProjectList,
  getTaskType,
  listByExecutor,
  seeReplyStatus,
  listAllUsers,
  departmentList,
  resetTaskRemindFlag,
  editorTaskMain,
  dragTask,
  sureEditorTask,
  listDraftTask
} from 'service/getData'
//import Tab from 'components/common/tab'
import {
  ERR_OK
} from 'service/config'
import Sortable from 'sortablejs'
export default {
  data() {
    //    占比正则
    var checkPecent = (rule, value, callback) => {
      if (!value) {
        return callback();
      }else{
        var reg = /(^(([1-9][0-9]*)|((([1-9][0-9]*)|0)\.[0-9]{1,2}))$)/;
        if (!reg.test(value)||value>=100) {
          callback(new Error('请输入有效的占比'));
        } else {
          if (value.length > 20) {
            callback(new Error('数值不能超过20个字符'));
          } else {
            callback();
          }
        }
      }
    };
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      pickerOptions1: {

      },
      expands: [],
      brr31:[],
      expands1: [],
      expands2: [],
      optionsObj1:[],
      resultTask4:[],
      resultTask5:[],
      ruleFormS: {
        becomCuase2:''
      },
      step: ['客户任务组', '投资任务组'],
      depet:[],
      isActive: true,
      isActiWeweek:[false,false,false,false,false,false,false],
      isActiObj:{
        one:false,
        two:false,
        three:false,
        fore:false,
        five:false,
        six:false,
        seveen:false,
      },
      isActive1: false,
      stretch:false,
      stretch1:false,
      becomeTitle:'申请变更任务重要等级',
      msg:"展开更多选项",
      msg1:"展开更多选项",
      show: false,
      result1: [],
      Taskoptions:[],
      checkedCities:[],
      checkedKey:[],
      checkedValue: [],
      usersT:[],
      taskNumber:'',
      resultTask1:[],
      resultTask2:[],
      resultTask3:[],
      result11:[],
      total:0,
      departName:'',
      pageSize:10,
      nowPage:1,
      total1:0,
      pageSize1:10,
      nowPage1:1,
      total11:0,
      pageSize11:10,
      nowPage11:1,
      total2:0,
      pageSize2:10,
      nowPage2:1,
      total3:0,
      pageSize3:10,
      nowPage3:1,
      total4:0,
      pageSize4:10,
      pageSize5:10,
      nowPage4:1,
      nowPage5:1,
      total5:0,
      taskGroup:true,
      currentPage:1,
      currentPage1:1,
      currentPage2:1,
      currentPage3:1,
      currentPage4:1,
      currentPage5:1,
      currentPage11:1,
      mineRate:false,
      isActiWeweek1:false,
      taskName: '任务组视图',
      dialogVisible4: false,
      dialogVisibleS:false,
      dialogVisible3: false,
      dialogVisible5: false,
      dialogVisible6: false,
      dialogVisible7: false,
      dialogVisible8: false,
      dialogVisible12: false,
      dialogVisible11:false,
      dialogVisible13: false,
      dialogVisible15: false,
      dialogVisible22:false,
      dialogVisible44:false,
      dialogVisible10:false,
      taskChangeId: '',
      result: [],
      pendingTaskSize: '',
      cimpTaskSize: '',
      dimpTaskSize: '',
      pimpTaskSize: '',
      pcommonTaskSize: '',
      totalTaskSize: '',
      show1: true,
      show2: false,
      result3: [],
      brr13: [],
      taskId: '',
      num:0,
      tabs: ["新任务/待审核", "变更任务/待审核","任务已完成待评价","待分配","任务未完成待评价","待完善"],
      activeName: false,
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible25: false,
      dialogVisible23:false,
      dialogVisible21: false,

      hello: false,
      options1: [{
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
      options4: [],
      options: [{
        value: '选项1',
        label: '部门负责人'
      }, {
        value: '选项2',
        label: '部门负责人'
      }, {
        value: '选项3',
        label: '部门负责人'
      }, {
        value: '选项4',
        label: '部门负责人'
      }, {
        value: '选项5',
        label: '部门负责人'
      }],
      value: '',
      ruleForm44: {
        cause4: '',
      },
      ruleForm6: {
        cancleCause: '',
        becomCuase3: '',
      },
      ruleForm7: {
        grades: '',
        becomCuase2: '',
        becomCuase1: ''
      },
      ruleForm8: {
        mass: '',
        rate: '',
        rateContent: '',
        rateMine: '',
      },
      ruleForm14: {
        date2: '',
        delayCause: '',
        becomCuase4: '',
      },
      repeatTime:'',
      ruleForm21: {
        num: '',
        num2: '',
        num3: '',
      },
      ruleForm13: {
        name13: '',
        value14: '',
        value15: '',
        telObj13: '',
        value17: '',
        value13: '',
        date13: '',
        content13: '',
        value71:[],
      },
      ruleForm: {
        name: '',
        name13: '',
        date1: '',
        date2: '',
        date13: '',
        dateM: '',
        region1: '',
        region: '',
        content: '',
        desc: '',
        telObj: '',
        telObj13: '',
        content13: '',
        value3: '',
        value13: '',
        value4: '',
        value14: '',
        value15: '',
        value5: '',
        value6: '',
        value16: '',
        value7: '',
        value17: '',
        value71: [],
        mass: '',
        rate: '',
        rateContent: '',
        becomCuase2: '',
        becomCuase3: '',
        becomCuase4: '',
        becomCuase1: '',
        cancleCause: '',
        grades: '',
        delayCause: '',
      },
      ruleForm1: {
        cause: ''
      },
      ruleForm2: {
        cause1: '',
        date1: '',
      },
      ruleForm3: {
        value3: '',
        cause3: '',
      },
      ruleForm4: {
        cause4: '',
      },
      ruleForm5: {
        username: '',
        percent: '',
      },
      ruleForm25: {
        username: '',
        percent1: '',
      },
      replyValue: '',
      isActive: false,
      hasError: false,
      users: [],
      users13: [],
      optionType: [],
      optionType1: [],
      addUsers: [],
      addUsers13: [],
      optionsObj: [],
      projects: [],
      brr: [],
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
      option2: [{
        value: 'NOREPEAT',
        label: '永不'
      }, {
        value: 'REPEATDAILY',
        label: '每天重复'
      }, {
        value: 'REPEATWEEKLY',
        label: '每周重复'
      }, {
        value: 'REPEATMONTHLY',
        label: '每月重复'
      }],
      ruleForm31: {
        name13: '',
        value14: '',
        value15: '',
        telObj13:'',
        value17:'',
        value13:'',
        date13:'',
        content13:'',
        value71:[],
      },
      rules31: {
        becomCuase1: [{
          required: true,
          message: '请填写审核原因',

        },{max: 200, message: '审核原因不能超过200个字符'} ],
        becomCuase2: [{
          required: true,
          message: '请填写审核原因',

        }, {max: 200, message: '审核原因不能超过200个字符'}],
        becomCuase3: [{
          required: true,
          message: '请填写审核原因',

        }, {max: 200, message: '审核原因不能超过200个字符'}],
        becomCuase4: [{
          required: true,
          message: '请填写审核原因',

        },{max: 200, message: '审核原因不能超过200个字符'} ],
        mass: [{
          required: true,
          message: '请选择完成质量',

        }, ],
        percent1: [
          { required: true, message: '请填写占比' },
          { validator: checkPecent }
        ],
        rate: [{
          required: true,
          message: '请选择快速评价',

        }, ],
        rateContent: [{
          required: true,
          message: '请填写任务评价',

        }, {max: 200, message: '任务评价不能超过200个字符'} ],
        name: [
          { required: true, message: '请输入任务标题'},
          {max: 50, message: '任务标题不能超过50个字符'}
        ],
        name13: [
          { required: true, message: '请输入任务标题'},
          {max: 50, message: '任务标题不能超过50个字符'}
        ],
        username: [
          { required: true, message: '请填写姓名', type:'number' }
        ],
        percent: [
          { required: true, message: '请填写占比' },
          { validator: checkPecent }
        ],
        cause: [
          { required: true, message: '请输入取消原因' },
          {max: 200, message: '取消原因不能超过200个字符'}
        ],
        cause1: [
          { required: true, message: '请输入延期原因' },
          {max: 200, message: '延期原因不能超过200个字符'}
        ],
        reply: [
          { required: true, message: '请输入回复内容' },
        ],
        cause3: [
          { required: true, message: '请输入变更原因' },
          {max: 200, message: '变更原因不能超过200个字符'}
        ],
        cause4: [
          { required: true, message: '请输入自我评价' },
          {max: 200, message: '自我评价不能超过200个字符'}
        ],
        region1: [
          { required: true, message: '请选择关联项目'},
        ],
        telObj13: [
          { required: true, message: '请选择任务汇报对象'},
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期',}
        ],
        region: [
          { required: true, message: '请选择活动区域', }
        ],
        content: [
          { required: true, message: '请输入任务内容',},
          {max: 200, message: '任务内容不能超过200个字符'}
        ],
        content13: [
          { required: true, message: '请输入任务内容',},
          {max: 200, message: '任务内容不能超过200个字符'}
        ],
        value3: [{
          required: true,
          message: '请选择任务重要等级',
        }, ],
        value13: [{
          required: true,
          message: '请选择任务重要等级',
        }, ],
        value4: [{
          required: true,
          message: '请选择任务类型',
          type: 'number'
        }, ],
        value14: [{
          required: true,
          message: '请选择任务类型',
          type: 'number'
        }, ],
        value5: [{
          required: true,
          message: '请选择任务执行人',
          type: 'number'
        }, ],
        value15: [{
          required: true,
          message: '请选择任务执行人',
          type: 'number'
        }, ],
        value6: [{
          required: true,
          message: '请选择自动回复时间',
        }, ],
        value16: [{
          required: true,
          message: '请选择自动回复时间',
        }, ],
        value7: [{
          required: true,
          message: '请输入公告内容',
        }, ],
        value17: [{
          required: true,
          message: '请输入公告内容',
        }, ],
        grades: [{
          required: true,
          message: '请选择重要等级',
        }, ],
      },
      showData:[],
      showDataS:[],
      showDataM:[],
      taskDept:[],
      taskSecond:[],
      taskIds:"",
      rules: {
        // cause4: [{
        //   required: true,
        //   message: '请输入自我评价',
        //   trigger: 'blur'
        // }, ],
        telObj: [{
          required: true,
          message: '请选择任务汇报对象',
          type: 'number'
        }, ],
        telObj13: [{
          required: true,
          message: '请选择任务汇报对象',
          type: 'number'
        }],
        mass: [{
          required: true,
          message: '请选择完成质量'
        }, ],
        rate: [{
          required: true,
          message: '请选择快速评价',
        }, ],
        rateContent: [{
          required: true,
          message: '请填写任务评价',
        },{max: 200, message: '任务评价不能超过200个字符'} ],
        name: [{
          required: true,
          message: '请输入任务标题',
        },{max: 50, message: '任务标题不能超过50个字符'} ],
        name13: [{
          required: true,
          message: '请输入任务标题',
        }, {max: 50, message: '任务标题不能超过50个字符'}],
        grades: [{
          required: true,
          message: '请选择重要等级',
        }, ],
        becomCuase1: [{
          required: true,
          message: '请填写审核原因',
        },{max: 200, message: '审核原因不能超过200个字符'} ],
        becomCuase2: [{
          required: true,
          message: '请填写审核原因',
        },{max: 200, message: '审核原因不能超过200个字符'} ],
        becomCuase3: [{
          required: true,
          message: '请填写审核原因',
        }, {max: 200, message: '审核原因不能超过200个字符'}],
        becomCuase4: [{
          required: true,
          message: '请填写审核原因',
        }, {max: 200, message: '审核原因不能超过200个字符'}],
        delayCause: [{
          required: true,
          message: '请填写延期原因',
        }, {max: 200, message: '延期原因不能超过200个字符'}],
        cancleCause: [{
          required: true,
          message: '请填写取消原因'
        },{max: 200, message: '取消原因不能超过200个字符'} ],
        username: [{
          required: true,
          message: '请填写姓名',
          type: 'number'
        }],
        num: [{
            required: true,
            message: '请填写重复间隔'
          },
          {
            type: 'number',
            message: '重复间隔必须为数字值'
          }
        ],
        num2: [{
            required: true,
            message: '请填写重复间隔'
          },
          {
            type: 'number',
            message: '重复间隔必须为数字值'
          }
        ],
        num3: [{
            required: true,
            message: '请填写重复间隔'
          },
          {
            type: 'number',
            message: '重复间隔必须为数字值'
          }
        ],
        percent: [{
            required: true,
            message: '请填写占比'
          },
          { validator: checkPecent },
          {
            type: 'number',
            message: '占比必须为数字值'
          }
        ],
        percent1: [{
            required: true,
            message: '请填写占比'
          },
          { validator: checkPecent },
          {
            type: 'number',
            message: '占比必须为数字值'
          }
        ],
        cause: [{
          required: true,
          message: '请输入取消原因'
        }, {max: 200, message: '取消原因不能超过200个字符'}],
        cause1: [{
          required: true,
          message: '请输入延期原因',
        }, {max: 200, message: '延期原因不能超过200个字符'}],
        cause3: [{
          required: true,
          message: '请输入变更原因',
        }, {max: 200, message: '变更原因不能超过200个字符'}],
        cause4: [{
          required: true,
          message: '请输入自我评价',
        }, {max: 200, message: '自我评价不能超过200个字符'}],
        region1: [{
          required: true,
          message: '请选择关联项目',
        }, ],
        date1: [{
          type: 'date',
          required: true,
          message: '请选择日期',
        }],
        date2: [{
          type: 'date',
          required: true,
          message: '请选择日期',
        }],
        date13: [{
          type: 'date',
          required: true,
          message: '请选择日期',
        }],
        dateM: [{
          type: 'date',
          required: true,
          message: '请选择日期',
        }],
        region: [{
          required: true,
          message: '请选择活动区域',
        }],
        content: [{
          required: true,
          message: '请输入任务内容',
        },   {max: 200, message: '任务内容不能超过200个字符'}],
        content13: [{
          required: true,
          message: '请输入任务内容',
        },   {max: 200, message: '任务内容不能超过200个字符'}],
        value3: [{
          required: true,
          message: '请选择任务重要等级',
        }, ],
        value13: [{
          required: true,
          message: '请选择任务重要等级',
        }, ],
        value4: [{
          required: true,
          message: '请选择任务类型',
          type: 'number'
        }, ],
        value14: [{
          required: true,
          message: '请选择任务类型',
          type: 'number'
        }, ],
        value5: [{
          required: true,
          message: '请选择任务执行人',
          type: 'number'
        }, ],
        value15: [{
          required: true,
          message: '请选择任务执行人',
          type: 'number'
        }, ],
        value6: [{
          required: true,
          message: '请选择自动回复时间',
        }, ],
        value16: [{
          required: true,
          message: '请选择自动回复时间',
        }, ],
        value7: [{
          required: true,
          message: '请输入公告内容',
        }, ],
        value17: [{
          required: true,
          message: '请输入公告内容',
        }, ],
      },
    };
  },
  components: {
//    Tab
  },
  mounted() {
    this.getUntreatTask()
    this.getChangeTask()
    this.getAssignedTask()
    this.departCommentTaskUnCompleted()
    this._listDraftTask()
    this.getCommentTask()
    this.getUntreatTask1()
    this.getProjectList1()
    //this.getTaskType1()
    this.listAllUsers1()
    this.getUsersObj1()
    this.gettaskHeader()
    this.listAllUsersT()
    this.getData()
    this.getData1()
    this.getUserDetailName()
    this.departmentList1()//获取部门
    this.tabs = ["新任务/待审核<span style='color:#C2453A;'> ("+this.total+")</span>", "变更任务/待审核<span style='color:#C2453A;'> ("+this.total1+")</span>","任务已完成待评价<span style='color:#C2453A;'> ("+this.total2+")</span>","待分配<span style='color:#C2453A;'> ("+this.total3+")","任务未完成待评价<span style='color:#C2453A;'> ("+this.total4+")","待完善<span style='color:#C2453A;'> ("+this.total5+")"]
  },
  methods: {
    packUp2(index){
      if(this.result3) {
        if(JSON.parse(localStorage.getItem("showData_deptTask1"))){
          if(JSON.parse(localStorage.getItem("showData_deptTask1")).length==this.taskDept.length){
            this.showDataM=JSON.parse(localStorage.getItem("showData_deptTask1"))
            this.showDataM[index].show=!this.showDataM[index].show
            localStorage.setItem("showData_deptTask1", JSON.stringify(this.showDataM));
          }else{
            this.showDataM=[]
            for(var i=0;i<this.taskDept.length;i++){
              this.showDataM.push({
                show:true
              })
            }
              console.log('66')
            this.showDataM[index].show=!this.showDataM[index].show
            localStorage.setItem("showData_deptTask1", JSON.stringify(this.showDataM));
          }
        }else{
          this.showDataM=[]
          for(var i=0;i<this.taskDept.length;i++){
              this.showDataM.push({
                show:true
              })
          }

          this.showDataM[index].show=!this.showDataM[index].show
          localStorage.setItem("showData_deptTask1", JSON.stringify(this.showDataM));
        }
        const tempd=JSON.parse(localStorage.getItem("showData_deptTask1"))
        if(tempd[index].show==true){
          this.$refs.mybox2[index].innerText = '收起'
          this.$refs.mybox2[index].parentNode.parentNode.childNodes[2].style.display = 'block'
        }
        if(tempd[index].show==false){
          this.$refs.mybox2[index].innerText = '展开'
          this.$refs.mybox2[index].parentNode.parentNode.childNodes[2].style.display = 'none'
        }
      }

    },
    packUp3(index){
      if(this.result3) {
        if(JSON.parse(localStorage.getItem("showData_deptSecond1"))){
          if(JSON.parse(localStorage.getItem("showData_deptSecond1")).length==this.taskSecond.length){
            this.showDataS=JSON.parse(localStorage.getItem("showData_deptSecond1"))
            this.showDataS[index].show=!this.showDataS[index].show
            localStorage.setItem("showData_deptSecond1", JSON.stringify(this.showDataS));
          }else{
            this.showDataS=[]
            for(var i=0;i<this.taskSecond.length;i++){
              this.showDataS.push({
                show:true
              })
            }
            this.showDataS[index].show=!this.showDataS[index].show
            localStorage.setItem("showData_deptSecond1", JSON.stringify(this.showDataS));
          }
        }else{
          this.showDataS=[]
          for(var i=0;i<this.taskSecond.length;i++){
              this.showDataS.push({
                show:true
              })
          }
          console.log(this.showDataS)
          this.showDataS[index].show=!this.showDataS[index].show
          localStorage.setItem("showData_deptSecond1", JSON.stringify(this.showDataS));
        }
        const tempd=JSON.parse(localStorage.getItem("showData_deptSecond1"))
        if(tempd[index].show){
          this.$refs.mybox3[index].innerText = '收起'
          this.$refs.mybox3[index].parentNode.parentNode.childNodes[2].style.display = 'block'
        }
        if(!tempd[index].show){
          this.$refs.mybox3[index].innerText = '展开'
          this.$refs.mybox3[index].parentNode.parentNode.childNodes[2].style.display = 'none'
        }
      }
    },
    // 展开和收起
    packUp(index){
      console.log(this.$refs.mybox.parentNode.parentNode.childNodes[2])
//        部门视图
      if(this.result3){
        var aa = localStorage.key(1)
        console.log(aa)
        if(JSON.parse(localStorage.getItem("showData_dept1"))){
          this.showData=JSON.parse(localStorage.getItem("showData_dept1"))
          this.showData[0].show=!this.showData[0].show
          localStorage.setItem("showData_dept1", JSON.stringify(this.showData));
        }else{
          this.showData=[]
          this.showData.push({
            show:true
          })
          this.showData[0].show=!this.showData[0].show
          localStorage.setItem("showData_dept1", JSON.stringify(this.showData));
        }
        const temp=JSON.parse(localStorage.getItem("showData_dept1"))
        if(temp[0].show){
          console.log('22')
          this.$refs.mybox.innerText = '收起'
          this.$refs.mybox.parentNode.parentNode.childNodes[2].style.display = 'block'
        }
        else{
            console.log('22')
          this.$refs.mybox.innerText = '展开'
          this.$refs.mybox.parentNode.parentNode.childNodes[2].style.display = 'none'
        }
      }
    },
    resetFormS(formName1) {
      this.dialogVisibleS = false
      this.$refs[formName1].resetFields();
    },
    // 我的任务完成
    handleCloseS(done) {
      this.dialogVisibleS= false
      this.$refs['ruleFormS'].resetFields();
    },
    resetForm31(formName) {
      this.dialogVisible10 = false
    },
    //获取部门
    getUserDetailName(){
      let self = this
      getCurrentUserDept().then((res) => {
        if(res.code == ERR_OK) {
          self.departName = res.data.deptName
        }
     })
    },
    getData1() {
      let self = this
      const params = {
        nowPage: this.nowPage11,
        pageShow: this.pageSize11
      }
      this.result11=[]
      getStaffAssisTask1(params).then((res) => {
        if (res.code == ERR_OK) {
          self.total11 = res.data.totalCount
          self.result11 = res.data.result
          this.$nextTick(() => {
            this.setSort_otherTask(this.result11)
          })
        }
      })
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
    //      则面板
    Collapse1(){
      this.stretch1=!this.stretch1
      if(this.stretch1){
        this.msg1="收起更多选项"
      }else{
        this.msg1="展开更多选项"
      }
    },
    handleCurrentChange(val) {
      this.nowPage = val
      this.getUntreatTask()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getUntreatTask()
    },
    handleCurrentChange1(val) {
      this.nowPage1 = val
      this.getChangeTask()
    },
    handleSizeChange1(val) {
      this.pageSize1 = val
      this.getChangeTask()
    },
    handleCurrentChange11(val) {
      this.nowPage11 = val
      this.getData1()
    },
    handleSizeChange11(val) {
      this.pageSize11 = val
      this.getData1()
    },
    handleCurrentChange2(val) {
      this.nowPage2 = val
      this.getCommentTask()
    },
    handleSizeChange2(val) {
      this.pageSize2 = val
      this.getCommentTask()
    },
    handleCurrentChange3(val) {
      this.nowPage3 = val
      this.getAssignedTask()
    },
    handleSizeChange3(val) {
      this.pageSize3 = val
      this.getAssignedTask()
    },
    handleCurrentChange4(val) {
      this.nowPage4 = val
      this.departCommentTaskUnCompleted()
    },
    handleSizeChange4(val) {
      this.pageSize4 = val
      this.departCommentTaskUnCompleted()
    },
    handleSizeChange5(val) {
      this.pageSize5= val
      this._listDraftTask()
    },
    handleCurrentChange5(val) {
      this.nowPage5 = val
      this._listDraftTask()
    },
    // tab切换
    tab(index) {
      this.num = index
    },
    openDetails1(row, event, column) {
        Array.prototype.remove = function (val) {
            let index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };

        if (this.expands1.indexOf(row.taskId) < 0) {
           this.expands1=[]
            this.expands1.push(row.taskId);
        } else {
            this.expands1.remove(row.taskId);
        }

    },
    openDetails2(row, event, column) {
        Array.prototype.remove = function (val) {
            let index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };

        if (this.expands2.indexOf(row.taskId) < 0) {
            this.expands2=[]
            this.expands2.push(row.taskId);
        } else {
            this.expands2.remove(row.taskId);
        }

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
    startExpend(row, expanded){
      if(row.lastReplyStatus=='UNREAD'&&expanded==true){
        this.seeReplyContent(row.lastTaskReplyId)
      }
    },
    seeReplyContent(taskReplyId){
      const params={
        taskReplyId:taskReplyId
      }
      seeReplyStatus(params).then((res) => {
        if (res.code == ERR_OK) {

        }
      })
    },
    handleClose22(done) {
      this.dialogVisible22 = false
      this.dialogVisible11 = false
    },
    sureDelete(){
      this.checkedCities = []
      this.checkedKey = []
      this.dialogVisible11 = false
      if(this.taskNumber<=0){
        this.$notify({
         title: '提示',
         message: '个人普通任务数量不够，请先去创建个人普通任务吧！',
       });
      }else{
        this.dialogVisible22 = true
      }
    },
    handleCheckedCitiesChange(val) {
      this.checkedValue = val
    },
    checkDelete(){
      this.dialogVisible22 = false
      //this.dialogVisible11 = false
    },
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
            this.getUntreatTask()
            this.getCommentTask()
            this.getChangeTask()
            let scrolled = document.documentElement.scrollTop || document.body.scrollTop
            this.getAssignedTask()
            this.departCommentTaskUnCompleted()
            this._listDraftTask()
            self.gettaskHeader(scrolled)
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
    handleClose11(){
      this.dialogVisible11 = false
    },
    one(val){
      this.isActiObj.one = !this.isActiObj.one
    },
    two(val){
      this.isActiObj.two = !this.isActiObj.two
    },
    three(val){
      this.isActiObj.three = !this.isActiObj.three
    },
    fore(val){
      this.isActiObj.fore = !this.isActiObj.fore
    },
    five(val){
      this.isActiObj.five = !this.isActiObj.five
    },
    six(val){
      this.isActiObj.six = !this.isActiObj.six
    },
    seveen(val){
      this.isActiObj.seveen = !this.isActiObj.seveen
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
              self.$refs[formName1].resetFields()
              self.getData()
              self.getData1()
              self.getUntreatTask1()
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
    unCompleteTask(val,event){
        var e = event;
        if(e&&e.stopPropagation){
            e.stopPropagation()
        }else if(window.event){
            window.event.cancelBubble=true;
        }
        const params = {
          taskId:val
        }
        var self = this
        resetTaskRemindFlag(params).then((res) => {
          if (res.code == ERR_OK) {
            self.getData()
            self.getData1()
            self.getUntreatTask1()
            this.$notify({
              title: '成功',
              message: res.msg,
              type: 'success'
            });
          } else {
            this.$notify.error({
              title: '错误',
              message: res.msg
            });
          }
        })

    },
    resetForm44(formName1) {
      this.dialogVisible44 = false
      this.$refs[formName1].resetFields();
    },
    levelComeplete(val,event) {
      var e = event;
      if(e&&e.stopPropagation){
          e.stopPropagation()
      }else if(window.event){
          window.event.cancelBubble=true;
      }
      this.taskId = val
      this.dialogVisible8 = true
      this.mineRate = false
    },
    levelComeplete1(val,event) {
      var e = event;
      if(e&&e.stopPropagation){
          e.stopPropagation()
      }else if(window.event){
          window.event.cancelBubble=true;
      }
      this.taskId = val
      this.dialogVisible44 = true
    },
    choseLevel3(val) {
      this.ruleForm3.value3 = val
    },
    handleClose13(done) {
      this.dialogVisible13 = false
      this.$refs['ruleForm3'].resetFields();
    },
    tipCompleteModal(val,event){
      var e = event;
      if(e&&e.stopPropagation){
          e.stopPropagation()
      }else if(window.event){
          window.event.cancelBubble=true;
      }
      let self =this
      const params =　{
        taskId:val
      }
      remindTaskList(params).then((res) => {
        if(res.code == ERR_OK) {
          self.dialogVisible8 = false
          let scrolled = document.documentElement.scrollTop || document.body.scrollTop
          self.getData1()
          console.log(scrolled)
          self.gettaskHeader(scrolled)
          this.$notify({
            title: '成功',
            message: '已提醒该员工该任务已完成',
            type: 'success'
          });
        }else{
          this.$notify.error({
            title: '错误',
            message:res.msg
          });
        }
      })
    },
//    编辑任务
    editorTask(val,event){
      var e = event;
      if(e&&e.stopPropagation){
        e.stopPropagation()
      }else if(window.event){
        window.event.cancelBubble=true;
      }
      this.addUsers=[]
      this.ruleForm31.name13 = "";
      this.ruleForm31.value15 = "";
      this.ruleForm31.value14="";
      this.ruleForm31.telObj13="";
      this.ruleForm31.value13="";
      this.ruleForm31.date13= "";
      this.ruleForm31.content13 = "";
      this.ruleForm.value71 = [];
      this.ruleForm.value7="";
      this.brr=[]
      this.addUsers=[]
      this.dialogVisible10=true;
      let params={
        taskId:val
      }
      this.taskIds=val
      editorTaskMain(params).then((res) => {
        if (res.code == ERR_OK) {
          this.ruleForm31.name13 = res.data.title
          this.ruleForm31.value15 = res.data.executor.userId
          this.ruleForm31.value14=res.data.taskTypeId
          this.ruleForm31.telObj13=res.data.reporter.userId
          this.ruleForm31.value13=res.data.grade
          this.ruleForm31.date13= res.data.planEndDate
          this.ruleForm31.content13 = res.data.content
          var crr = []
          if(res.data.taskAssists.length>0){
            for(let i=0;i<res.data.taskAssists.length;i++){
              crr.push({
                assistUserName:'',
                proportion:'',
                assistUserId:''
              })
            }
            for(let j=0;j<res.data.taskAssists.length;j++){
              crr[j].assistUserName= res.data.taskAssists[j].assistUserName
              crr[j].proportion= res.data.taskAssists[j].proportion
              crr[j].assistUserId= res.data.taskAssists[j].assistUserId
            }
          }
          this.brr= crr
          this.ruleForm.value7=res.data.projectId
          if(res.data.visibleRange===''){
            this.ruleForm.value71 = []
          }else if(res.data.visibleRange.indexOf(',')<0){
            this.ruleForm.value71 = JSON.parse('['+parseInt(res.data.visibleRange)+']')
          }else{
            this.ruleForm.value71 = JSON.parse('[' + String(res.data.visibleRange.split(',')) + ']')
          }
        }
      })
    },
//    确定编辑任务
    submitForm31(formName) {
      let self = this
      console.log(this.addUsers);
      var value71 = this.ruleForm.value71.join(',')
      this.$refs[formName].validate((valid) => {
        if (valid) {
           let d = new Date(this.ruleForm31.date13)
           let time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
          const params = {
            taskId: this.taskIds,
            title: this.ruleForm31.name13,
            taskTypeId: this.ruleForm31.value14,
            reportId:this.ruleForm31.telObj13,
            executorId: this.ruleForm31.value15,
            projectId:this.ruleForm.value7,
            planEndDate:time,
            grade: this.ruleForm31.value13,
            ptaskAssists: JSON.stringify(this.addUsers),
            visibleRange:value71,
            content: this.ruleForm31.content13
          }
          sureEditorTask(params).then((res) => {
            if (res.code == ERR_OK) {
              self.dialogVisible10 = false
              self.$refs[formName].resetFields()
              this._listDraftTask()
              this.$notify({
                title: '成功',
                message: '编辑任务成功',
                type: 'success'
              });
            }else if(res.code == 'exceedPersonal'){
              self.dialogVisible11 = true
              self.taskNumber = res.data.length
              self.Taskoptions = res.data
            } else {
              this.$notify.error({
                title: '错误',
                message:res.msg
              });
            }
          })
        } else {
          return false;
        }
      })
    },
    adduser31(){
      this.dialogVisible251 = true
    },
    submitForm13(formName1) {
      let self = this
      this.$refs[formName1].validate((valid) => {
        if (valid) {
          const params = {
            taskId: self.taskId,
            grade: self.ruleForm3.value3,
            reason: self.ruleForm3.cause3
          }
          changeTaskLevel(params).then((res) => {
            if (res.code == ERR_OK) {
              self.dialogVisible13 = false
              let scrolled = document.documentElement.scrollTop || document.body.scrollTop
              self.getUntreatTask1()
              self.getData()
              self.getData1()
              self.gettaskHeader(scrolled)
              self.$refs[formName1].resetFields()
              this.$notify({
                title: '成功',
                message: '申请变更任务重要等级已发送',
                type: 'success'
              });
            } else if(res.code == 'exceedPersonal'){
              self.dialogVisible11 = true
              self.taskNumber = res.data.length
              self.Taskoptions = res.data
            }else{
              this.$notify.error({
                title: '错误',
                message:res.msg
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm13(formName1) {
      this.dialogVisible13 = false
      this.$refs[formName1].resetFields();
    },
    levelChange(val,event) {
      var e = event;
      if(e&&e.stopPropagation){
          e.stopPropagation()
      }else if(window.event){
          window.event.cancelBubble=true;
      }
      this.taskId = val
      this.dialogVisible13 = true
    },
    handleClose12(done) {
      this.dialogVisible12 = false
      this.$refs['ruleForm2'].resetFields();
    },
    submitForm12(formName1) {
      let self = this
      let d = new Date(self.ruleForm2.date1)
      let time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      this.$refs[formName1].validate((valid) => {
        if (valid) {
          const params = {
            taskId: self.taskId,
            reason: self.ruleForm2.cause1,
            delayDate: time
          }
          delayTaskCause(params).then((res) => {
            if (res.code == ERR_OK) {
              self.dialogVisible12 = false
              self.$refs[formName1].resetFields()
              let scrolled = document.documentElement.scrollTop || document.body.scrollTop
              self.getUntreatTask1()
              self.getData()
              self.getData1()
              self.gettaskHeader(scrolled)
              self.$notify({
                title: '成功',
                message: '申请任务延期已发送',
                type: 'success'
              });
            } else {
              self.$notify.error({
                title: '错误',
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
    delay(val,key,event) {
      var e = event;
      if(e&&e.stopPropagation){
          e.stopPropagation()
      }else if(window.event){
          window.event.cancelBubble=true;
      }
      this.taskId = val
      var date = new Date(Date.parse(key.replace(/-/g, "/")))
      date = date.getTime()
      this.dialogVisible12 = true
      this.pickerOptions1 = {
        disabledDate(time) {
          return time.getTime() - 8.64e7 < date;
        }
      }
    },
    removeTodo(index) {
      this.brr.splice(index, 1);
      this.addUsers.splice(index, 1);
    },
    removeTodo13(index) {
      this.brr13.splice(index, 1);
      this.addUsers13.splice(index, 1);
    },
    completeMass(val) {
      this.ruleForm8.mass = val
      this.options4 = []
      this.ruleForm8.rate = ''
      this.ruleForm8.rateContent = ''
      if(val == 'EXCELLENT'){
        this.options4 =  [{
          value: '任务完成超出预期',
           label: '任务完成超出预期'
         },{
           value: '任务完成非常出色',
            label: '任务完成非常出色'
           }]
      }else if(val == 'GOOD'){
        this.options4 =  [{
          value: '任务完成出色',
          label: '任务完成出色'
        },{
          value: '干的不错',
          label: '干的不错'
        }]
      }else if(val == 'SECONDARY'){
        this.options4 =  [{
          value: '再接再厉',
          label: '再接再厉'
        },{
          value: '继续努力',
          label: '继续努力'
        }]
      }else if(val == 'DIFFERENCE'){
        this.options4 =  [{
          value: '需要注意',
          label: '需要注意'
        },{
          value: '多思考',
          label: '多思考'
        }]
      }else if(val == 'POOR'){
        this.options4 =  [{
          value: '需要反思一下',
          label: '需要反思一下'
        },{
          value: '多跟同事们请教',
          label: '多跟同事们请教'
        }]
      }
    },
    completeRate(val) {
      this.ruleForm8.rate = val
      this.ruleForm8.rateContent = val
    },
    gettaskHeader(val) {
      this.result3=[]
      console.log(val)
      taskHeader().then((res) => {
        if (res.code == ERR_OK) {
          this.result3 = res.data

          this.taskDept = []
          this.taskSecond = []
          if(this.result3) {
            for(var j=0;j<this.result3.taskInfos.length;j++) {
              for(var k=0;k<this.result3.taskInfos[j].tasks.length;k++) {
                this.taskDept.push(this.result3.taskInfos[j].tasks[k])
              }
            }

            for(var m=0;m<this.result3.branchTaskInfoDeptmentalVos.length;m++) {
              for(var n=0;n<this.result3.branchTaskInfoDeptmentalVos[m].taskInfos.length;n++) {
                for(var t=0;t<this.result3.branchTaskInfoDeptmentalVos[m].taskInfos[n].tasks.length;t++) {
                  this.taskDept.push(this.result3.branchTaskInfoDeptmentalVos[m].taskInfos[n].tasks[t])
                }
              }
            }

            for(var m=0;m<this.result3.branchTaskInfoDeptmentalVos.length;m++) {
              this.taskSecond.push(this.result3.branchTaskInfoDeptmentalVos[m])
            }
          }

          this.$nextTick(() => {
            if(JSON.parse(localStorage.getItem("showData_dept1"))){
              const data=JSON.parse(localStorage.getItem("showData_dept1"))
              if(data[0].show){
                this.$refs.mybox.innerText = '收起'
                this.$refs.mybox.parentNode.parentNode.childNodes[2].style.display = 'block'
              }
              if(!data[0].show){
                this.$refs.mybox.innerText = '展开'
                this.$refs.mybox.parentNode.parentNode.childNodes[2].style.display = 'none'
              }
            }
            this.setSort_staffView(this.result3)
          })

          this.$nextTick(() => {
            if(JSON.parse(localStorage.getItem("showData_deptTask1"))){
              const data=JSON.parse(localStorage.getItem("showData_deptTask1"))
              for(let i=0;i<data.length;i++){
                if(data[i].show){
                  this.$refs.mybox2[i].innerText = '收起'
                  this.$refs.mybox2[i].parentNode.parentNode.childNodes[2].style.display = 'block'
                }
                if(!data[i].show){
                  this.$refs.mybox2[i].innerText = '展开'
                  this.$refs.mybox2[i].parentNode.parentNode.childNodes[2].style.display = 'none'
                }
              }
            }

            if(JSON.parse(localStorage.getItem("showData_deptSecond1"))){
              const data=JSON.parse(localStorage.getItem("showData_deptSecond1"))
              for(let i=0;i<data.length;i++){
                if(data[i].show){
                  this.$refs.mybox3[i].innerText = '收起'
                  this.$refs.mybox3[i].parentNode.parentNode.childNodes[2].style.display = 'block'
                }
                else{
                  this.$refs.mybox3[i].innerText = '展开'
                  this.$refs.mybox3[i].parentNode.parentNode.childNodes[2].style.display = 'none'
                }
              }
            }

          })
          this.$nextTick(() => {
            if(val){
              document.body.scrollTop = val
              document.documentElement.scrollTop = val
            }
          })
          //console.log(this.result3)
        }
      })
    },
    getData() {
      let self = this
      const params = {
        completed: false,
      }
      self.result=[]
      userTaskList(params).then((res) => {
        if (res.code == ERR_OK) {
          self.result = res.data.result
          this.$nextTick(() => {
            this.setSort_myTask(self.result)
          })
        }
      })
    },
    getUsersObj1(userId) {
      const params = {
        userId:userId
      }
      this.optionsObj = []
      this.ruleForm.telObj = ''
      listReportingUsers(params).then((res) => {
        if (res.code == ERR_OK) {
          this.optionsObj = res.data
          for (let i in this.optionsObj) {
            if (this.optionsObj[i].checked == true) {
              this.ruleForm.telObj = this.optionsObj[i].userId
            }
          }
        }
      })
    },
    getUsersObj2(userId) {
      const params = {
        userId:userId
      }
      this.optionsObj1 = []
      this.ruleForm13.telObj13 = ''
      listReportingUsers(params).then((res) => {
        if (res.code == ERR_OK) {
          this.optionsObj1 = res.data
          for (let i in this.optionsObj1) {
            if (this.optionsObj1[i].checked == true) {
              this.ruleForm13.telObj13 = this.optionsObj1[i].userId
            }
          }
        }
      })
    },
    goLink(val){
      this.getUsersObj1(val)
      this._listByExecutor(val,1)
    },
    goLink1(val){
      this.getUsersObj2(val)
      //this._listByExecutor(val,2)
    },
    // 获取任务类型
    // getTaskType1() {
    //   getTaskType().then((res) => {
    //     if (res.code == ERR_OK) {
    //       this.optionType = res.data
    //       this.optionType.unshift({
    //         taskTypeId: '',
    //         taskTypeName: '请选择任务类型'
    //       })
    //     }
    //   })
    // },
    //获取任务组
    _listByExecutor(userId,key){
      let self = this
      const params = {
        userId:userId
      }
      listByExecutor(params).then((res) => {
        if(res.code == ERR_OK) {
          if(key==1){
            this.ruleForm.value4 = ''
            this.optionType = res.data
            this.optionType.unshift({
              taskTypeId:'',
              taskTypeName: '请选择任务类型'
            })
          }else{
            console.log('33')
            this.ruleForm13.value14 = ''
            this.optionType1 = res.data
            this.optionType1.unshift({
              taskTypeId:'',
              taskTypeName: '请选择任务类型'
            })
          }

        }
     })
    },
    //获取任务组
    _listByExecutor4(userId,key,id){
      let self = this
      const params = {
        userId:userId
      }
      listByExecutor(params).then((res) => {
        if(res.code == ERR_OK) {
          if(key==1){
            this.optionType = res.data
            this.optionType.unshift({
              taskTypeId:'',
              taskTypeName: '请选择任务类型'
            })
              this.ruleForm.value4 = id
          }else{
            console.log('33')
            this.ruleForm13.value14 = ''
            this.optionType1 = res.data
            this.optionType1.unshift({
              taskTypeId:'',
              taskTypeName: '请选择任务类型'
            })
          }

        }
     })
    },
    //获取任务组
    _listByExecutor1(userId,key){
      let self = this
      const params = {
        userId:userId
      }
      listByExecutor(params).then((res) => {
        if(res.code == ERR_OK) {
            self.optionType1 = res.data
            self.optionType1.unshift({
              taskTypeId:'',
              taskTypeName: '请选择任务类型'
            })
            self.ruleForm13.value14 = key
        }
     })
    },
    listAllUsers1() {
      listTaskExecutors().then((res) => {
        if (res.code == ERR_OK) {
          this.users = res.data
          for (let i in this.users) {
            if (this.users[i].checked==true) {
              this.ruleForm.value5 = this.users[i].userId
            }
          }
          this.getUsersObj1(this.ruleForm.value5)
          this._listByExecutor(this.ruleForm.value5,1)
        }
      })
    },
    // 回显示添加任务
    listAllUsers4(id) {
      listTaskExecutors().then((res) => {
        if (res.code == ERR_OK) {
          this.users = res.data
          for (let i in this.users) {
            if (this.users[i].checked==true) {
              this.ruleForm.value5 = this.users[i].userId
            }
          }
          this.getUsersObj1(this.ruleForm.value5)
          this._listByExecutor4(this.ruleForm.value5,1,id)
        }
      })
    },
    choseUsers2(val) {
      this.ruleForm5.userName = val
    },
    choseTime(val) {

    },
    choseTime13(val) {
      //this.ruleForm.value16 = val

    },
    getProjectList1() {
      getProjectList().then((res) => {
        if (res.code == ERR_OK) {
          this.projects = res.data.result
          this.projects.unshift({
            projectId: '',
            projectName: '请选择关联项目'
          })
        }
      })
    },
    choseRelateProject(val) {
      this.ruleForm.value7 = val
    },
    choseRelateProject13(val) {
      this.ruleForm.value17 = val
    },
    // 点击添加协助人
    adduser() {
      this.dialogVisible15 = true
      this.ruleForm5.username=""
      this.ruleForm5.percent=""
    },
    // 点击添加协助人
    adduser13() {
      this.dialogVisible25 = true
      this.ruleForm25.username=""
      this.ruleForm25.percent1=""
    },
    handleClose25(done) {
      this.dialogVisible25 = false
      this.$refs['ruleForm25'].resetFields();
    },
    submitForm25(formName1) {
      let self = this
      this.$refs[formName1].validate((valid) => {
        if (valid) {
          if(self.ruleForm25.username === self.ruleForm13.value15){
            self.$notify.error({
              title: '错误',
              message:'执行人和协助人不能相同',
            });
            return
          }
          if(self.addUsers13.length>0){
            for(let item of self.addUsers13){
              if(item.assistUserId === self.ruleForm25.username){
                self.$notify.error({
                  title: '错误',
                  message:'不能选择相同的协助人',
                });
                return
              }
            }
          }
          self.dialogVisible25 = false
          let obj = {
            assistUserId: self.ruleForm25.username,
            proportion: self.ruleForm25.percent1
          }
          self.addUsers13.push(obj)
//          console.log(self.addUsers13)
          this.brr13 = []
          for (var i = 0; i < self.usersT.length; i++) {
            for (var j = 0; j < self.addUsers13.length; j++) {
              if (self.usersT[i].userId == self.addUsers13[j].assistUserId) {
                self.brr13.push({
                  username: self.usersT[i].userName,
                  proportion: self.addUsers13[j].proportion,
                  assistUserId:self.addUsers13[j].assistUserId
                })
              }
            }
          }
//          console.log(self.brr13.username)
        } else {
          return false;
        }
      });
    },
    resetForm25(formName1) {
      this.dialogVisible25 = false
      this.$refs[formName1].resetFields();
    },
    handleClose15(done) {
      this.dialogVisible15 = false
      this.$refs['ruleForm5'].resetFields();
    },
    submitForm15(formName1) {
      let self = this
      this.$refs[formName1].validate((valid) => {
        if (valid) {
          if(self.ruleForm5.username === self.ruleForm.value5){
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
            assistUserId: self.ruleForm5.username,
            proportion: self.ruleForm5.percent
          }
          self.addUsers.push(obj)
          this.brr = []
          for (var i = 0; i < self.usersT.length; i++) {
            for (var j = 0; j < self.addUsers.length; j++) {
              if (self.usersT[i].userId == self.addUsers[j].assistUserId) {
                self.brr.push({
                  username: self.usersT[i].userName,
                  proportion: self.addUsers[j].proportion,
                  assistUserId:self.addUsers[j].assistUserId
                })
              }
            }
          }
//          console.log(self.brr)
        } else {
          return false;
        }
      });
    },
    resetForm15(formName1) {
      this.dialogVisible15 = false
      this.$refs[formName1].resetFields();
    },
    // 模态框的选择任务类型
    choseTaskType1(val) {
      this.ruleForm.value4 = val
    },
    // 模态框的选择任务类型
    choseTaskType13(val) {
      this.ruleForm.value14 = val
    },
    //回复消息
    replyTask(index, val,event,keys) {
      let el = event.target.parentNode.childNodes[0].value
      this.taskId = val
      let self = this
      const params = {
        taskId: this.taskId,
        replyDesc: el
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
          if (res.code == ERR_OK) {
            if(keys){
              let scrolled = document.documentElement.scrollTop || document.body.scrollTop
              self.gettaskHeader(scrolled)
            }else{
              self.getAssignedTask()
              self.departCommentTaskUnCompleted()
              self._listDraftTask()
              self.getUntreatTask()
              self.getChangeTask()
              self.getCommentTask()
              self.getData()
              self.getData1()
            }
            self.$notify({
              title: '成功',
              message: '恭喜你，回复成功',
              type: 'success'
            })
          }else{
            self.$notify.error({
              title: '错误',
              message: res.msg
            });
          }
        })
      }
    },
    // 待处理任务列表
    getUntreatTask() {
      this.result1=[]
      departNewTaskPending().then((res) => {
        if (res.code == ERR_OK) {
          this.result1 = res.data.result
          this.total = res.data.totalCount
          this.$nextTick(() => {
            this.setSort_Tab0(this.result1)
          })
          this.tabs = ["新任务/待审核<span style='color:#C2453A;'> ("+this.total+")</span>", "变更任务/待审核<span style='color:#C2453A;'> ("+this.total1+")</span>","任务已完成待评价<span style='color:#C2453A;'> ("+this.total2+")</span>","待分配<span style='color:#C2453A;'> ("+this.total3+")","任务未完成待评价<span style='color:#C2453A;'> ("+this.total4+")","待完善<span style='color:#C2453A;'> ("+this.total5+")"]
        }
      })
    },
    // 变更任务/待审核
    getChangeTask(){
      const params = {
        nowPage:this.nowPage1,
        pageShow:this.pageSize1
      }
      this.resultTask1=[]
      departChangeTaskPending(params).then((res) => {
        if(res.code == ERR_OK) {
          this.resultTask1 = res.data.result
          this.total1 = res.data.totalCount
          this.$nextTick(() => {
            this.setSort_Tab1(this.resultTask1)
          })
          this.tabs = ["新任务/待审核<span style='color:#C2453A;'> ("+this.total+")</span>", "变更任务/待审核<span style='color:#C2453A;'> ("+this.total1+")</span>","任务已完成待评价<span style='color:#C2453A;'> ("+this.total2+")</span>","待分配<span style='color:#C2453A;'> ("+this.total3+")","任务未完成待评价<span style='color:#C2453A;'> ("+this.total4+")","待完善<span style='color:#C2453A;'> ("+this.total5+")"]
        }
     })
    },
    // 待评级
    getCommentTask(){
      const params = {
        nowPage:this.nowPage2,
        pageShow:this.pageSize2
      }
      this.resultTask2=[]
      departCommentTaskPending(params).then((res) => {
        if(res.code == ERR_OK) {
          this.resultTask2 = res.data.result
          this.total2 = res.data.totalCount
          this.$nextTick(() => {
            this.setSort_Tab2(this.resultTask2)
          })
          this.tabs = ["新任务/待审核<span style='color:#C2453A;'> ("+this.total+")</span>", "变更任务/待审核<span style='color:#C2453A;'> ("+this.total1+")</span>","任务已完成待评价<span style='color:#C2453A;'> ("+this.total2+")</span>","待分配<span style='color:#C2453A;'> ("+this.total3+")","任务未完成待评价<span style='color:#C2453A;'> ("+this.total4+")","待完善<span style='color:#C2453A;'> ("+this.total5+")"]
        }
     })
    },
    // 待分配
    getAssignedTask(){
      const params = {
        nowPage:this.nowPage3,
        pageShow:this.pageSize3
      }
      this.resultTask3=[]
      departAssignedTaskPending(params).then((res) => {
        if(res.code == ERR_OK) {
          this.resultTask3 = res.data.result
          //console.log(res.data.totalCount)
          this.total3 = res.data.totalCount
          this.$nextTick(() => {
            this.setSort_Tab3(this.resultTask3)
          })
          this.tabs = ["新任务/待审核<span style='color:#C2453A;'> ("+this.total+")</span>", "变更任务/待审核<span style='color:#C2453A;'> ("+this.total1+")</span>","任务已完成待评价<span style='color:#C2453A;'> ("+this.total2+")</span>","待分配<span style='color:#C2453A;'> ("+this.total3+")","任务未完成待评价<span style='color:#C2453A;'> ("+this.total4+")","待完善<span style='color:#C2453A;'> ("+this.total5+")"]
        }
     })
    },
    // 任务未完成待评价
    departCommentTaskUnCompleted(){
      const params = {
        nowPage:this.nowPage4,
        pageShow:this.pageSize4
      }
      this.resultTask4=[]
      departCommentTaskPendingUnCompleted(params).then((res) => {
        if(res.code == ERR_OK) {
          if(res.data){
            this.resultTask4 = res.data.result
            this.total4 = res.data.totalCount
            this.$nextTick(() => {
              this.setSort_Tab4()
            })
          }
          this.tabs = ["新任务/待审核<span style='color:#C2453A;'> ("+this.total+")</span>", "变更任务/待审核<span style='color:#C2453A;'> ("+this.total1+")</span>","任务已完成待评价<span style='color:#C2453A;'> ("+this.total2+")</span>","待分配<span style='color:#C2453A;'> ("+this.total3+")","任务未完成待评价<span style='color:#C2453A;'> ("+this.total4+")","待完善<span style='color:#C2453A;'> ("+this.total5+")"]
        }
     })
    },
    //    待完善
    _listDraftTask(){
      const params = {
        nowPage:this.nowPage5,
        pageShow:this.pageSize5
      }
      this.resultTask5=[]
      listDraftTask(params).then((res) => {
        if(res.code == ERR_OK) {
          this.resultTask5 = res.data.result
          this.total5 = res.data.totalCount
          this.$nextTick(() => {
             this.setSort_Tab5(this.resultTask5)
          })
          this.tabs = ["新任务/待审核<span style='color:#C2453A;'> ("+this.total+")</span>", "变更任务/待审核<span style='color:#C2453A;'> ("+this.total1+")</span>","任务已完成待评价<span style='color:#C2453A;'> ("+this.total2+")</span>","待分配<span style='color:#C2453A;'> ("+this.total3+")","任务未完成待评价<span style='color:#C2453A;'> ("+this.total4+")","待完善<span style='color:#C2453A;'> ("+this.total5+")"]
        }
      })
    },
    // 待处理任务列表
    getUntreatTask1() {
      getDeptStatistics().then((res) => {
        if (res.code == ERR_OK) {
          this.cimpTaskSize = res.data.cimpTaskSize
          this.dimpTaskSize = res.data.dimpTaskSize
          this.pimpTaskSize = res.data.pimpTaskSize
          this.totalTaskSize = res.data.totalTaskSize
          this.pcommonTaskSize = res.data.pcommonTaskSize
          this.pendingTaskSize = res.data.pendingTaskSize
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
          this.getUntreatTask()
        }
        if(num==2){
         this.getChangeTask()
        }
        if(num==3){
         this.getCommentTask()
        }
        if(num==4){
          this.getAssignedTask()
        }
        if(num==5){
         this.departCommentTaskUnCompleted()
        }
        if(num==6){
         this.getData()
        }
        if(num==7){
         this.getData1()
        }
        if(num==8){
          let scrolled = document.documentElement.scrollTop || document.body.scrollTop
          this.gettaskHeader(scrolled)
        }
        if(num==9){
          this._listDraftTask()
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
    //拖动排序新任务/待审核
    setSort_Tab0(){
      const el = document.querySelectorAll('.taskNum0 .el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        onEnd: evt => {
          var oldIndex=evt.oldIndex;
          var newIndex=evt.newIndex;
          if(oldIndex>newIndex){
            if(newIndex==0){
              this._dragTask(this.result1[oldIndex].taskId,'',this.result1[newIndex].taskId,1)
            }else{
              this._dragTask(this.result1[oldIndex].taskId,this.result1[newIndex-1].taskId,this.result1[newIndex].taskId,1)
            }
          }else{
            if(newIndex==0){
              this._dragTask(this.result1[oldIndex].taskId,'',this.result1[newIndex].taskId,1)
            }else if(newIndex==this.result1.length-1){
              this._dragTask(this.result1[oldIndex].taskId,this.result1[newIndex].taskId,'',1)
            }else{
              if(newIndex>=this.result1.length){
                this._dragTask(this.result1[oldIndex].taskId,this.result1[newIndex-1].taskId,'',1)
              }else{
                this._dragTask(this.result1[oldIndex].taskId,this.result1[newIndex].taskId,this.result1[newIndex+1].taskId,1)
              }
            }
          }
        }
      })
    },
//    变更任务/待审核
    setSort_Tab1(){
      const el = document.querySelectorAll('.taskNum1 .el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        onEnd: evt => {
          var oldIndex=evt.oldIndex;
          var newIndex=evt.newIndex;
          if(oldIndex>newIndex){
            if(newIndex==0){
              this._dragTask(this.resultTask1[oldIndex].taskId,'',this.resultTask1[newIndex].taskId,2)
            }else{
              this._dragTask(this.resultTask1[oldIndex].taskId,this.resultTask1[newIndex-1].taskId,this.resultTask1[newIndex].taskId,2)
            }
          }else{
            if(newIndex==0){
              this._dragTask(this.resultTask1[oldIndex].taskId,'',this.resultTask1[newIndex].taskId,2)
            }else if(newIndex==this.resultTask1.length-1){
              this._dragTask(this.resultTask1[oldIndex].taskId,this.resultTask1[newIndex].taskId,'',2)
            }else{
              if(newIndex>=this.resultTask1.length){
                this._dragTask(this.resultTask1[oldIndex].taskId,this.resultTask1[newIndex-1].taskId,'',2)
              }else{
                this._dragTask(this.resultTask1[oldIndex].taskId,this.resultTask1[newIndex].taskId,this.resultTask1[newIndex+1].taskId,2)
              }
            }
          }
        }
      })
    },
//    任务已完成待评价
    setSort_Tab2(){
      const el = document.querySelectorAll('.taskNum2 .el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        onEnd: evt => {
          var oldIndex=evt.oldIndex;
          var newIndex=evt.newIndex;
          if(oldIndex>newIndex){
            if(newIndex==0){
              this._dragTask(this.resultTask2[oldIndex].taskId,'',this.resultTask2[newIndex].taskId,3)
            }else{
              this._dragTask(this.resultTask2[oldIndex].taskId,this.resultTask2[newIndex-1].taskId,this.resultTask2[newIndex].taskId,3)
            }
          }else{
            if(newIndex==0){
              this._dragTask(this.resultTask2[oldIndex].taskId,'',this.resultTask2[newIndex].taskId,3)
            }else if(newIndex==this.resultTask2.length-1){
              this._dragTask(this.resultTask2[oldIndex].taskId,this.resultTask2[newIndex].taskId,'',3)
            }else{
              if(newIndex>=this.resultTask2.length){
                this._dragTask(this.resultTask2[oldIndex].taskId,this.resultTask2[newIndex-1].taskId,'',3)
              }else{
                this._dragTask(this.resultTask2[oldIndex].taskId,this.resultTask2[newIndex].taskId,this.resultTask2[newIndex+1].taskId,3)
              }
            }
          }
        }
      })
    },
//待分配
    setSort_Tab3(){
      const el = document.querySelectorAll('.taskNum3 .el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        onEnd: evt => {
          var oldIndex=evt.oldIndex;
          var newIndex=evt.newIndex;
          if(oldIndex>newIndex){
            if(newIndex==0){
              this._dragTask(this.resultTask3[oldIndex].taskId,'',this.resultTask3[newIndex].taskId,4)
            }else{
              this._dragTask(this.resultTask3[oldIndex].taskId,this.resultTask3[newIndex-1].taskId,this.resultTask3[newIndex].taskId,4)
            }
          }else{
            if(newIndex==0){
              this._dragTask(this.resultTask3[oldIndex].taskId,'',this.resultTask3[newIndex].taskId,4)
            }else if(newIndex==this.resultTask3.length-1){
              this._dragTask(this.resultTask3[oldIndex].taskId,this.resultTask3[newIndex].taskId,'',4)
            }else{
              if(newIndex>=this.resultTask3.length){
                this._dragTask(this.resultTask3[oldIndex].taskId,this.resultTask3[newIndex-1].taskId,'',4)
              }else{
                this._dragTask(this.resultTask3[oldIndex].taskId,this.resultTask3[newIndex].taskId,this.resultTask3[newIndex+1].taskId,4)
              }
            }
          }
        }
      })
    },
//    任务未完成待评价
    setSort_Tab4(){
      const el = document.querySelectorAll('.taskNum4 .el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        onEnd: evt => {
          var oldIndex=evt.oldIndex;
          var newIndex=evt.newIndex;
          if(oldIndex>newIndex){
            if(newIndex==0){
              this._dragTask(this.resultTask4[oldIndex].taskId,'',this.resultTask4[newIndex].taskId,5)
            }else{
              this._dragTask(this.resultTask4[oldIndex].taskId,this.resultTask4[newIndex-1].taskId,this.resultTask4[newIndex].taskId,5)
            }
          }else{
            if(newIndex==0){
              this._dragTask(this.resultTask4[oldIndex].taskId,'',this.resultTask4[newIndex].taskId,5)
            }else if(newIndex==this.resultTask4.length-1){
              this._dragTask(this.resultTask4[oldIndex].taskId,this.resultTask4[newIndex].taskId,'',5)
            }else{
              if(newIndex>=this.resultTask4.length){
                this._dragTask(this.resultTask4[oldIndex].taskId,this.resultTask4[newIndex-1].taskId,'',5)
              }else{
                this._dragTask(this.resultTask4[oldIndex].taskId,this.resultTask4[newIndex].taskId,this.resultTask4[newIndex+1].taskId,5)
              }
            }
          }
        }
      })
    },
//    待完善
    setSort_Tab5(){
      const el = document.querySelectorAll('.taskNum5 .el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        onEnd: evt => {
          var oldIndex=evt.oldIndex;
          var newIndex=evt.newIndex;
          if(oldIndex>newIndex){
            if(newIndex==0){
              this._dragTask(this.resultTask5[oldIndex].taskId,'',this.resultTask5[newIndex].taskId,9)
            }else{
              this._dragTask(this.resultTask5[oldIndex].taskId,this.resultTask5[newIndex-1].taskId,this.resultTask5[newIndex].taskId,9)
            }
          }else{
            if(newIndex==0){
              this._dragTask(this.resultTask5[oldIndex].taskId,'',this.resultTask5[newIndex].taskId,9)
            }else if(newIndex==this.resultTask5.length-1){
              this._dragTask(this.resultTask5[oldIndex].taskId,this.resultTask5[newIndex].taskId,'',9)
            }else{
              if(newIndex>=this.resultTask5.length){
                this._dragTask(this.resultTask5[oldIndex].taskId,this.resultTask5[newIndex-1].taskId,'',9)
              }else{
                this._dragTask(this.resultTask5[oldIndex].taskId,this.resultTask5[newIndex].taskId,this.resultTask5[newIndex+1].taskId,5)
              }
            }
          }
        }
      })
    },
//我的任务
    setSort_myTask(){
      const el = document.querySelectorAll('.mytask .el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        onEnd: evt => {
          var oldIndex=evt.oldIndex;
          var newIndex=evt.newIndex;
          if(oldIndex>newIndex){
            if(newIndex==0){
              this._dragTask(this.result[oldIndex].taskId,'',this.result[newIndex].taskId,6)
            }else{
              this._dragTask(this.result[oldIndex].taskId,this.result[newIndex-1].taskId,this.result[newIndex].taskId,6)
            }
          }else{
            if(newIndex==0){
              this._dragTask(this.result[oldIndex].taskId,'',this.result[newIndex].taskId,6)
            }else if(newIndex==this.result.length-1){
              this._dragTask(this.result[oldIndex].taskId,this.result[newIndex].taskId,'',6)
            }else{
              if(newIndex>=this.result.length){
                this._dragTask(this.result[oldIndex].taskId,this.result[newIndex-1].taskId,'',6)
              }else{
                this._dragTask(this.result[oldIndex].taskId,this.result[newIndex].taskId,this.result[newIndex+1].taskId,6)
              }
            }
          }
        }
      })
    },
//    其他任务
    setSort_otherTask(){
      const el = document.querySelectorAll('.otherTask .el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        onEnd: evt => {
          var oldIndex=evt.oldIndex;
          var newIndex=evt.newIndex;
          if(oldIndex>newIndex){
            if(newIndex==0){
              this._dragTask(this.result11[oldIndex].taskId,'',this.result11[newIndex].taskId,7)
            }else{
              this._dragTask(this.result11[oldIndex].taskId,this.result11[newIndex-1].taskId,this.result11[newIndex].taskId,7)
            }
          }else{
            if(newIndex==0){
              this._dragTask(this.result11[oldIndex].taskId,'',this.result11[newIndex].taskId,7)
            }else if(newIndex==this.result11.length-1){
              this._dragTask(this.result11[oldIndex].taskId,this.result11[newIndex].taskId,'',7)
            }else{
              if(newIndex>=this.result11.length){
                this._dragTask(this.result11[oldIndex].taskId,this.result11[newIndex-1].taskId,'',7)
              }else{
                this._dragTask(this.result11[oldIndex].taskId,this.result11[newIndex].taskId,this.result11[newIndex+1].taskId,7)
              }
            }
          }
        }
      })
    },
//    员工任务staffView
    setSort_staffView(){
      const el = document.querySelectorAll('.partView .el-table__body-wrapper > table > tbody')
      const childrenView = document.querySelectorAll('.childrenView .el-table__body-wrapper > table > tbody')
      console.log(el.length,childrenView.length)
      var arr = [];
      var brr = [];

      for(let n=0;n<this.result3.taskInfos.length;n++) {
        arr.push(this.result3.taskInfos[n])
      }

      for(let n=0;n<this.result3.branchTaskInfoDeptmentalVos.length;n++) {
        for(let j=0;j<this.result3.branchTaskInfoDeptmentalVos[n].taskInfos.length;j++) {
          brr.push(this.result3.branchTaskInfoDeptmentalVos[n].taskInfos[j])
        }
      }
      for(let i=0;i<el.length;i++){
        this.sortable = Sortable.create(el[i], {
          onEnd: evt => {
            var oldIndex=evt.oldIndex;
            var newIndex=evt.newIndex;
            if(oldIndex>newIndex){
              if(newIndex==0){
                this._dragTask(arr[i].tasks[oldIndex].taskId,'',arr[i].tasks[newIndex].taskId,8)
              }else{
                this._dragTask(arr[i].tasks[oldIndex].taskId,arr[i].tasks[newIndex-1].taskId,arr[i].tasks[newIndex].taskId,8)
              }
            }else{
              if(newIndex==0){
                this._dragTask(arr[i].tasks[oldIndex].taskId,'',arr[i].tasks[newIndex].taskId,8)
              }else if(newIndex==arr[i].tasks.length-1){
                this._dragTask(arr[i].tasks[oldIndex].taskId,arr[i].tasks[newIndex].taskId,'',8)
              }else{
                if(newIndex>=arr[i].tasks.length){
                  this._dragTask(arr[i].tasks[oldIndex].taskId,arr[i].tasks[newIndex-1].taskId,'',8)
                }else{
                  this._dragTask(arr[i].tasks[oldIndex].taskId,arr[i].tasks[newIndex].taskId,arr[i].tasks[newIndex+1].taskId,8)
                }
              }
            }
          }
        })
      }

      for(let i=0;i<childrenView.length;i++){
        this.sortable = Sortable.create(childrenView[i], {
          onEnd: evt => {
            var oldIndex=evt.oldIndex;
            var newIndex=evt.newIndex;
            if(oldIndex>newIndex){
              if(newIndex==0){
                this._dragTask(brr[i].tasks[oldIndex].taskId,'',brr[i].tasks[newIndex].taskId,8)
              }else{
                this._dragTask(brr[i].tasks[oldIndex].taskId,brr[i].tasks[newIndex-1].taskId,brr[i].tasks[newIndex].taskId,8)
              }
            }else{
              if(newIndex==0){
                this._dragTask(brr[i].tasks[oldIndex].taskId,'',brr[i].tasks[newIndex].taskId,8)
              }else if(newIndex==brr[i].tasks.length-1){
                this._dragTask(brr[i].tasks[oldIndex].taskId,brr[i].tasks[newIndex].taskId,'',8)
              }else{
                if(newIndex>=brr[i].tasks.length){
                  this._dragTask(brr[i].tasks[oldIndex].taskId,brr[i].tasks[newIndex-1].taskId,'',8)
                }else{
                  this._dragTask(brr[i].tasks[oldIndex].taskId,brr[i].tasks[newIndex].taskId,brr[i].tasks[newIndex+1].taskId,8)
                }
              }
            }
          }
        })
      }

    },
    addTaskType() {
      this.dialogVisible5 = true
    },
    handleClose5() {
      this.dialogVisible5 = false
      this.$refs['ruleForm'].resetFields();
    },
    submitForm5(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible5 = false
        } else {
          return false;
        }
      });
    },
    resetForm5(formName) {
      this.dialogVisible5 = false
      this.$refs[formName].resetFields();
    },

    assignTask(val,event) {
      var e = event;
      if(e&&e.stopPropagation){
          e.stopPropagation()
      }else if(window.event){
          window.event.cancelBubble=true;
      }
      this.taskId = val
      this.dialogVisible3 = true
      this.addUsers13 = []
      this.brr13 = []
      this.ruleForm13.value71 = []
      const params = {
        taskId: val
      }
      assessTaskDetail(params).then((res) => {
        if (res.code == ERR_OK) {
          this.ruleForm13.name13 = res.data.title
          this.ruleForm13.value15 = res.data.executorId
          this._listByExecutor1(res.data.executorId,res.data.taskTypeId)
          this.ruleForm13.telObj13 = res.data.reportId
          //this.ruleForm13.value14 = res.data.taskTypeId
          //this.ruleForm13.value17 = res.data.projectId
          this.getUsersObjAssign(res.data.executorId,res.data.reportId)
          this.ruleForm13.value13 = res.data.grade
          this.ruleForm13.date13 = new Date(res.data.planEndDate)
          //this.ruleForm.value16 = res.data.repeatMode
          this.ruleForm13.content13 = res.data.content
        }
      })
    },
    //获取汇报对象
    getUsersObjAssign(userId,reportId) {
      const params = {
        userId:userId
      }
      this.optionsObj1 = []
      listReportingUsers(params).then((res) => {
        if (res.code == ERR_OK) {
          this.optionsObj1 = res.data
          this.ruleForm13.telObj13 = reportId
        }
      })
    },
    mindTask() {
      this.ruleForm.name = ''
      this.ruleForm.value4 = ''
      this.ruleForm.value3 = ''
      this.ruleForm.date1 = ''
      this.ruleForm.content = ''
      this.dialogVisible = true
      this.addUsers = []
      this.brr = []
      this.ruleForm.value7=""
      this.ruleForm.value71 = [];
      this.addUsers=[]
      this.brr=[]
      this.addUsers=[]
      this.getProjectList1()
      this.listAllUsers1()
    },
    mindTask1(id) {
      this.ruleForm.name = ''
      this.ruleForm.value4 = ''
      this.ruleForm.value3 = ''
      this.ruleForm.date1 = ''
      this.ruleForm.content = ''
      this.dialogVisible = true
      this.addUsers = []
      this.brr = []
      this.ruleForm.value7=""
      this.ruleForm.value71 = [];
      this.addUsers=[]
      this.brr=[]
      this.addUsers=[]
      this.getProjectList1()
      this.listAllUsers4(id)
    },
    uncomplete() {
      this.show1 = true
      this.show2 = false
      this.isActive = true
      this.isActive1 = false
    },
    completed() {
      this.isActive = false
      this.isActive1 = true
      this.show1 = false
      this.show2 = true
    },
    handleSizeChange(val) {
//      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
//      console.log(val)
      //console.log(`当前页: ${val}`);
    },

    handleClose3() {
      this.dialogVisible3 = false
      this.$refs['ruleForm13'].resetFields();
    },
    submitForm3(formName) {
      let self = this
//      console.log(self.ruleForm.value15)
      //console.log(this.ruleForm.value5 )
      var value71 = this.ruleForm13.value71.join(',')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let d = new Date(self.ruleForm.date13)
          let time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()

          const params = {
            taskId: self.taskId,
            title: self.ruleForm13.name13,
            taskTypeId: self.ruleForm13.value14,
            executorId: self.ruleForm13.value15,
            reportId: self.ruleForm13.telObj13,
            projectId: self.ruleForm13.value17,
            grade: self.ruleForm13.value13,
            visibleRange:value71,
            ptaskAssists: JSON.stringify(self.addUsers13),
            //repeatMode: self.ruleForm.value16,
            content: self.ruleForm13.content13
          }
          assignmentTask(params).then((res) => {
            if (res.code == ERR_OK) {
              self.getAssignedTask()
              self.departCommentTaskUnCompleted()
              self._listDraftTask()
              let scrolled = document.documentElement.scrollTop || document.body.scrollTop
              self.getUntreatTask1()
              self.getData()
              self.gettaskHeader(scrolled)
              self.dialogVisible3 = false
              self.$refs[formName].resetFields()
              this.$notify({
                title: '成功',
                message: '分配任务成功',
                type: 'success'
              });
            } else if(res.code == 'exceedPersonal'){
              self.dialogVisible11 = true
              self.taskNumber = res.data.length
              self.Taskoptions = res.data
            }else{
              this.$notify.error({
                title: '错误',
                message:res.msg
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm3(formName) {
      this.dialogVisible3 = false
      this.$refs[formName].resetFields();
    },
    // 完成任务
    completeModal(val,event) {
      var e = event;
      if(e&&e.stopPropagation){
          e.stopPropagation()
      }else if(window.event){
          window.event.cancelBubble=true;
      }
      this.taskId = val
      this.dialogVisible8 = true
      this.mineRate = true
      const params={
         id:this.taskId
      }
      getTaskComment(params).then((res) => {
        if (res.code == ERR_OK) {
          this.ruleForm8.rateMine = res.data.comment
        } else {
          this.$notify.error({
            title: '错误',
            message: res.msg
          });
        }
      })

    },
    handleClose8() {
      this.dialogVisible8 = false
      this.$refs['ruleForm8'].resetFields();
    },
    submitForm8(formName) {
      let self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = 　 {
            taskId: self.taskId,
            finishQuality: self.ruleForm8.mass,
            changeContent: self.ruleForm8.rateContent
          }
          assessTask(params).then((res) => {
            if (res.code == ERR_OK) {
              self.dialogVisible8 = false
              self.getCommentTask()
              let scrolled = document.documentElement.scrollTop || document.body.scrollTop
              self.getUntreatTask1()
              self.$refs[formName].resetFields()
              self.getData()
              self.getData1()
              self.gettaskHeader(scrolled)
              this.$notify({
                title: '成功',
                message: '评价完成',
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
    resetForm8(formName) {
      this.dialogVisible8 = false
      this.$refs[formName].resetFields();
    },
    handleClose7() {
      this.dialogVisible7 = false
      this.$refs['ruleForm7'].resetFields();
    },
    submitForm7(formName) {
      let self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = 　 {
            taskId: self.taskId,
            changeStatus: 'PASS',
            changeReason: self.ruleForm7.becomCuase1,
            changeContent: self.ruleForm7.grades,
            taskChangeId: self.taskChangeId,
            //rejectReason: self.ruleForm7.becomCuase2
          }
          approvalTask(params).then((res) => {
            if (res.code == ERR_OK) {
              self.dialogVisible7 = false
              self.getChangeTask()
              self.getUntreatTask()
              self.getUntreatTask1()
              let scrolled = document.documentElement.scrollTop || document.body.scrollTop
              self.$refs[formName].resetFields()
              self.getData()
              self.getData1()
              self.gettaskHeader(scrolled)
              this.$notify.info({
                title: '提示',
                message: '审核完成'
              });
            } else if(res.code == 'exceedPersonal'){
              self.dialogVisible11 = true
              self.taskNumber = res.data.length
              self.Taskoptions = res.data
            }else{
              this.$notify.error({
                title: '错误',
                message:res.msg
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    checkTaskSure1(){
      var self = this
      const params =　{
        taskId: self.taskId,
        changeStatus: 'REJECT',
        changeReason: self.ruleForm7.becomCuase1,
        changeContent: self.ruleForm7.grades,
        taskChangeId: self.taskChangeId,
        rejectReason:self.ruleFormS.becomCuase2
      }
      approvalTask(params).then((res) => {
        if(res.code == ERR_OK) {
          self.dialogVisibleS = false
          self.dialogVisible7 = false
          self.getUntreatTask()
          self.getUntreatTask1()
          self.getChangeTask()
          let scrolled = document.documentElement.scrollTop || document.body.scrollTop
          self.getData()
          self.getData1()
          self.gettaskHeader(scrolled)
          self.$refs['ruleFormS'].resetFields()
          this.$notify.info({
            title: '提示',
            message: '审核不通过'
          });
        }else{
          this.$notify.error({
            title: '错误',
            message:res.msg
          });
        }
      })
    },
    checkTaskSure2(){
      var self = this
        const params =　{
          taskId: self.taskId,
          changeStatus: 'REJECT',
          changeReason: self.ruleForm6.cancleCause,
          taskChangeId: self.taskChangeId,
          rejectReason:self.ruleFormS.becomCuase2
        }
        approvalTask(params).then((res) => {
          if(res.code == ERR_OK) {
            self.dialogVisible6 = false
            self.dialogVisibleS = false
            self.getUntreatTask()
            self.getUntreatTask1()
            self.getChangeTask()
            self.getCommentTask()
            let scrolled = document.documentElement.scrollTop || document.body.scrollTop
            self.getData()
            self.getData1()
            self.gettaskHeader(scrolled)
            self.$refs['ruleFormS'].resetFields()
            this.$notify.info({
              title: '提示',
              message: '审核不通过'
            });
          }else{
            this.$notify.error({
              title: '错误',
              message:res.msg
            });
          }
        })
    },
    checkTaskSure3() {
        let self = this
        let d = new Date(self.ruleForm14.date2)
        let time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
        const params =　{
          taskId: self.taskId,
          changeStatus: 'REJECT',
          changeReason: self.ruleForm14.delayCause,
          taskChangeId: self.taskChangeId,
          rejectReason:self.ruleFormS.becomCuase2,
          changeContent:time
        }
        approvalTask(params).then((res) => {
          if(res.code == ERR_OK) {
            self.dialogVisible4 = false
            self.dialogVisibleS = false
            self.getUntreatTask()
            self.getUntreatTask1()
            self.getChangeTask()
            self.getCommentTask()
            let scrolled = document.documentElement.scrollTop || document.body.scrollTop
            self.getData()
            self.getData1()
            self.gettaskHeader(scrolled)
            self.$refs['ruleForm14'].resetFields()
            self.$refs['ruleFormS'].resetFields()
            self.$notify.info({
              title: '提示',
              message: '审核不通过'
            });
          }else{
            self.$notify.error({
              title: '错误',
              message: res.msg
            });

          }
        })
    },
    submitFormS(formName) {
      let self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(self.dialogVisible7==true) {
            this.checkTaskSure1()
          }else if(self.dialogVisible6==true) {
            this.checkTaskSure2()
          }else if(self.dialogVisible4==true) {
            this.checkTaskSure3()
          }
        } else {
          return false;
        }
      });
    },
    resetForm7(formName) {
      let self = this
      this.dialogVisibleS = true
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     const params = 　 {
      //       taskId: self.taskId,
      //       changeStatus: 'REJECT',
      //       changeReason: self.ruleForm7.becomCuase1,
      //       changeContent: self.ruleForm7.grades,
      //       taskChangeId: self.taskChangeId,
      //       rejectReason: self.ruleForm7.becomCuase2
      //     }
      //     approvalTask(params).then((res) => {
      //       if (res.code == ERR_OK) {
      //         self.dialogVisible7 = false
      //         self.getUntreatTask()
      //         self.getUntreatTask1()
      //         self.getChangeTask()
      //         self.gettaskHeader()
      //         self.getData()
      //         self.getData1()
      //         self.$refs[formName].resetFields()
      //         this.$notify.info({
      //           title: '提示',
      //           message: '审核不通过'
      //         });
      //       } else if(res.code == 'exceedPersonal'){
      //         self.dialogVisible11 = true
      //         self.taskNumber = res.data.length
      //         self.Taskoptions = res.data
      //       }else{
      //         this.$notify.error({
      //           title: '错误',
      //           message:res.msg
      //         });
      //       }
      //     })
      //   } else {
      //     return false;
      //   }
      // });
    },
    handleClose6() {
      this.dialogVisible6 = false
      this.$refs['ruleForm6'].resetFields();
    },
    handleClose10() {
      this.dialogVisible10 = false
      this.$refs['ruleForm31'].resetFields();
    },
    submitForm6(formName) {
      let self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = 　 {
            taskId: self.taskId,
            changeStatus: 'PASS',
            changeReason: self.ruleForm6.cancleCause,
            taskChangeId: self.taskChangeId,
            //rejectReason: self.ruleForm6.becomCuase3
          }
          approvalTask(params).then((res) => {
            if (res.code == ERR_OK) {
              self.dialogVisible6 = false
              self.getUntreatTask()
              self.getUntreatTask1()
              self.getChangeTask()
              self.getCommentTask()
              let scrolled = document.documentElement.scrollTop || document.body.scrollTop
              self.$refs[formName].resetFields()
              self.getData()
              self.getData1()
              self.gettaskHeader(scrolled)
              this.$notify.info({
                title: '提示',
                message: '审核通过'
              });
            } else {
              this.$notify.error({
                title: '错误',
                message:res.msg
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm6(formName) {
      let self = this
      this.dialogVisibleS = true
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     const params = 　 {
      //       taskId: self.taskId,
      //       changeStatus: 'REJECT',
      //       changeReason: self.ruleForm6.cancleCause,
      //       taskChangeId: self.taskChangeId,
      //       rejectReason: self.ruleForm6.becomCuase3
      //     }
      //     approvalTask(params).then((res) => {
      //       if (res.code == ERR_OK) {
      //         self.dialogVisible6 = false
      //         self.getUntreatTask()
      //         self.getUntreatTask1()
      //         self.getChangeTask()
      //         self.getCommentTask()
      //         self.gettaskHeader()
      //         self.getData()
      //         self.getData1()
      //         self.$refs[formName].resetFields()
      //         self.$notify.info({
      //           title: '消息',
      //           message: '审核不通过'
      //         });
      //       } else {
      //         self.$notify.error({
      //           title: '错误',
      //           message:res.msg
      //         });
      //       }
      //     })
      //   } else {
      //     return false;
      //   }
      // });
    },
    lateCheck(val,keys,dates,become,event) {
      var e = event;
      if(e&&e.stopPropagation){
          e.stopPropagation()
      }else if(window.event){
          window.event.cancelBubble=true;
      }
      this.taskId = keys
      const params = {
        id: keys
      }
      if(become==1){
        this.becomeTitle='申请新任务重要等级'
      }else if(become==2){
          this.becomeTitle='申请变更任务重要等级'
      }
      if (val == 'GRADE') {
        this.dialogVisible7 = true
        getChangeType(params).then((res) => {
          if (res.code == ERR_OK) {
            this.ruleForm7.grades = res.data.changeContent
            this.ruleForm7.becomCuase1 = res.data.changeReason
            this.taskChangeId = res.data.taskChangeId
          } else {
            this.$notify.error({
              title: '错误',
              message:res.msg
            });
          }
        })
      } else if (val == 'DELAY') {
        this.dialogVisible4 = true
        var date = new Date(Date.parse(dates.replace(/-/g, "/")))
        date = date.getTime()
        this.pickerOptions1 = {
          disabledDate(time) {
            return time.getTime() - 8.64e7 < date;
          }
        }
        getChangeType(params).then((res) => {
          if (res.code == ERR_OK) {
            this.ruleForm14.date2 = new Date(res.data.changeContent)
            this.ruleForm14.delayCause = res.data.changeReason
            this.taskChangeId = res.data.taskChangeId
          } else {
            this.$notify.error({
              title: '错误',
              message:res.msg
            });
          }
        })
      } else if (val == 'CANCLE') {
        this.dialogVisible6 = true
        getChangeType(params).then((res) => {
          if (res.code == ERR_OK) {
            this.ruleForm6.cancleCause = res.data.changeReason
            this.taskChangeId = res.data.taskChangeId
          } else {
            this.$notify.error({
              title: '错误',
              message:res.msg
            });
          }
        })
      }
    },
    //分配任务
    handleClose4() {
      this.dialogVisible4 = false
      this.$refs['ruleForm14'].resetFields();
    },
    submitForm4(formName) {
      let self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let d = new Date(self.ruleForm14.date2)
          let time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
          const params = 　 {
            taskId: self.taskId,
            changeStatus: 'PASS',
            changeReason: self.ruleForm14.delayCause,
            taskChangeId: self.taskChangeId,
            //rejectReason: self.ruleForm14.becomCuase4,
            changeContent: time
          }
          approvalTask(params).then((res) => {
            if (res.code == ERR_OK) {
              self.dialogVisible4 = false
              self.getUntreatTask()
              self.getUntreatTask1()
              self.getChangeTask()
              self.getCommentTask()
              let scrolled = document.documentElement.scrollTop || document.body.scrollTop
              self.$refs[formName].resetFields()
              self.getData()
              self.getData1()
              self.gettaskHeader(scrolled)
              this.$notify.info({
                title: '提示',
                message: '审核通过'
              });
            } else {
              this.$notify.error({
                title: '错误',
                message:res.msg
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm4(formName) {
      let self = this
      this.dialogVisibleS = true
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //
      //     let d = new Date(self.ruleForm14.date2)
      //     let time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      //     const params = 　 {
      //       taskId: self.taskId,
      //       changeStatus: 'REJECT',
      //       changeReason: self.ruleForm14.delayCause,
      //       taskChangeId: self.taskChangeId,
      //       rejectReason: self.ruleForm14.becomCuase4,
      //       changeContent: time
      //     }
      //     approvalTask(params).then((res) => {
      //       if (res.code == ERR_OK) {
      //         self.dialogVisible4 = false
      //         self.getUntreatTask()
      //         self.getUntreatTask1()
      //         self.getChangeTask()
      //         self.getCommentTask()
      //         self.gettaskHeader()
      //         self.getData()
      //         self.getData1()
      //         self.$refs[formName].resetFields()
      //         self.$notify.info({
      //           title: '提示',
      //           message: '审核不通过'
      //         });
      //       } else {
      //         self.$notify.error({
      //           title: '错误',
      //           message: res.msg
      //         });
      //       }
      //     })
      //   } else {
      //     return false;
      //   }
      // });
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$refs['ruleForm'].resetFields();
    },
    saveDrafts(formName) {
      let self = this
      if(this.ruleForm.name==''){
        this.$notify.error({
          title: '错误',
          message:'请输入任务标题'
        });
        return false;
      }
      var time;
      var value71 = this.ruleForm.value71.join(',')
      if(self.ruleForm.date1=='') {
        time = ''
      }else{
        var d = new Date(self.ruleForm.date1)
        time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      }
      const params = {
        title:self.ruleForm.name,
        taskTypeId:self.ruleForm.value4,
        executorId:self.ruleForm.value5,
        reportId:self.ruleForm.telObj,
        projectId:self.ruleForm.value7,
        grade:self.ruleForm.value3,
        ptaskAssists:JSON.stringify(self.addUsers),
        planEndDate:time,
        visibleRange:value71,
        draftTask:true,
        content:self.ruleForm.content
      }
      publishTask(params).then((res) => {
        if (res.code == ERR_OK) {
          self.dialogVisible = false
          self.$refs[formName].resetFields();
          self.getAssignedTask()
          self.departCommentTaskUnCompleted()
          self._listDraftTask()
          self.getUntreatTask()
          self.getUntreatTask1()
          self.getChangeTask()
          self.getCommentTask()
          let scrolled = document.documentElement.scrollTop || document.body.scrollTop
          self.getData()
          self.getData1()
          self.gettaskHeader(scrolled)
          self.$refs[formName].resetFields()
          self.$notify({
            title: '成功',
            message: '发起任务成功',
            type: 'success'
          });
        }else{
          this.$notify.error({
            title: '错误',
            message:res.msg
          });
        }
      })
    },
    submitForm(formName) {
      let self = this
      if(this.ruleForm.name==''){
        this.$notify.error({
          title: '错误',
          message:'请输入任务标题'
        });
        return false;
      }
      if(this.ruleForm.name.trim().length>50){
        this.$notify.error({
          title: '错误',
          message:'任务标题不能超过50个字符'
        });
        return false;
      }
      if(this.ruleForm.value5==''&&this.ruleForm.value5!=0){
        this.$notify.error({
          title: '错误',
          message:'请选择执行人'
        });
        return false;
      }
      if(this.ruleForm.telObj==''&&this.ruleForm.telObj!=0){
        this.$notify.error({
          title: '错误',
          message:'请选择任务汇报对象'
        });
        return false;
      }
      if(this.ruleForm.value4==''){
        this.$notify.error({
          title: '错误',
          message:'请选择任务类型'
        });
        return false;
      }
      if(this.ruleForm.value3==''){
        this.$notify.error({
          title: '错误',
          message:'请选择任务重要等级'
        });
        return false;
      }
      if(this.ruleForm.date1==''){
        this.$notify.error({
          title: '错误',
          message:'请输入完成时间'
        });
        return false;
      }
      if(this.ruleForm.content==''){
        this.$notify.error({
          title: '错误',
          message:'请输入任务内容'
        });
        return false;
      }
      var value71 = this.ruleForm.value71.join(',')
      let d = new Date(self.ruleForm.date1)
      let time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      const params = {
        title:self.ruleForm.name,
        taskTypeId:self.ruleForm.value4,
        executorId:self.ruleForm.value5,
        reportId:self.ruleForm.telObj,
        projectId:self.ruleForm.value7,
        grade:self.ruleForm.value3,
        ptaskAssists:JSON.stringify(self.addUsers),
        planEndDate:time,
        visibleRange:value71,
        content:self.ruleForm.content
      }
      publishTask(params).then((res) => {
        if (res.code == ERR_OK) {
          self.dialogVisible = false
          self.$refs[formName].resetFields();
          self.getAssignedTask()
          self.departCommentTaskUnCompleted()
          self._listDraftTask()
          self.getUntreatTask()
          self.getUntreatTask1()
          self.getChangeTask()
          self.getCommentTask()
          let scrolled = document.documentElement.scrollTop || document.body.scrollTop
          self.getData()
          self.getData1()
          self.gettaskHeader(scrolled)
          self.$refs[formName].resetFields()
          self.$notify({
            title: '成功',
            message: '发起任务成功',
            type: 'success'
          });
        }else{
          this.$notify.error({
            title: '错误',
            message:res.msg
          });
        }
      })
    },
    resetForm(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields();
    },
    resetForm10(formName){
      this.dialogVisible10= false
      this.$refs[formName].resetFields();
    },
    cancle(val,event) {
      var e = event;
      if(e&&e.stopPropagation){
          e.stopPropagation()
      }else if(window.event){
          window.event.cancelBubble=true;
      }
      this.taskId = val
      this.dialogVisible1 = true
    },
    handleClose23(done) {
      this.dialogVisible23 = false
      this.$refs['ruleForm21'].resetFields();
    },
    submitForm23(formName1) {
      let self = this
      this.$refs[formName1].validate((valid) => {
        if (valid) {
          this.dialogVisible23 = false
          this.repeatTime = this.ruleForm21.num3
        } else {
          return false;
        }
      });
    },
    resetForm23(formName1) {
      this.dialogVisible23 = false
      this.$refs[formName1].resetFields();
    },
    // handleClose22(done) {
    //   this.dialogVisible22 = false
    //   this.$refs['ruleForm21'].resetFields();
    // },
    // submitForm22(formName1) {
    //   let self = this
    //   this.$refs[formName1].validate((valid) => {
    //     if (valid) {
    //       this.dialogVisible22 = false
    //       this.repeatTime = this.ruleForm21.num2
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    // resetForm22(formName1) {
    //   this.dialogVisible22 = false
    //   this.$refs[formName1].resetFields();
    // },
    handleClose21(done) {
      this.dialogVisible21 = false
      this.$refs['ruleForm21'].resetFields();
    },
    submitForm21(formName1) {
      let self = this
      this.$refs[formName1].validate((valid) => {
        if (valid) {
          this.dialogVisible21 = false
          this.repeatTime = this.ruleForm21.num
        } else {
          return false;
        }
      });
    },
    resetForm21(formName1) {
      this.dialogVisible21 = false
      this.$refs[formName1].resetFields();
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
            taskId: self.taskId,
            reason: self.ruleForm1.cause
          }
          cancelTaskCause(params).then((res) => {
            if (res.code == ERR_OK) {
              self.dialogVisible1 = false
              let scrolled = document.documentElement.scrollTop || document.body.scrollTop
              self.getUntreatTask1()
              self.getData()
              self.getData1()
              self.gettaskHeader(scrolled)
              self.$refs[formName1].resetFields()
              this.$notify({
                title: '成功',
                message: '申请取消原因已发送',
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
    resetForm1(formName1) {
      this.dialogVisible1 = false
      this.$refs[formName1].resetFields();
    },
    iconEnter() {
      this.$refs.displayShow.style.display = 'block'
    },
    iconLeave() {
      this.$refs.displayShow.style.display = 'none'
    },
    iconEnter1() {
      this.$refs.displayShow1.style.display = 'block'
    },
    iconLeave1() {
      this.$refs.displayShow1.style.display = 'none'
    }
  }
};
</script>
<style lang="scss"  scoped>
.task-manage {
    margin-bottom: 40px;
}
.task-list {
    //background: #EFEFEF;
    box-shadow: 0 2px 11px 0 rgba(0,0,0,0.07);
    border-radius: 6px;
}
.take-task {
    height: 91px;
    margin: 0 auto;
    // background-color: #fff;
    margin: 0 auto;
    border-left: 1px solid #dfe6ec;
    border-right: 1px solid #dfe6ec;
}
.take-left {
    width: auto;
    height: 46px;
    float: left;

}
.take-top-wrapper {
    height: 46px;
    width: 100%;
    opacity: 0.99;

    background: rgba(217,53,56,0.10);
}
.take-top {
    height: 46px;
    width: 265px;
    font-size: 18px;
    font-weight: bold;
    color: #333333;
    margin-left: 34px;
    line-height: 46px;

}
.take-bottom {
    height: 35px;
    // width: 265px;
    line-height: 35px;
    font-size: 14px;
    color: #FFFFFF;
    background: #fff;
    padding-top: 10px;
}
.take-bottom .task-item:first-child {
    margin-right: 5px;
}
.take-bottom .task-item {
    width: 130px;
    float: left;
    text-align: center;
    background: #D8D8D8;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    cursor: pointer;
}
.take-bottom .task-item.active {
    background: #D93437;

}
.take-right {
    width: 84px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    margin-top: 8px;
    margin-right: 163px;
    float: right;
    cursor: pointer;
    font-size: 14px;
    color: #FFFFFF;
    border-radius: 5px;
    background: #D93538;
    border-radius: 4px;
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
.content-tab {
    line-height: 17px;
    display: block;
    font-size: 12px;
    padding: 0 53px 0 0;
    min-width: 297px;
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
.reback1 {
    line-height: 17px;
    padding-left: 0;
    background: transparent;
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
}
.title-right {
    float: left;
    margin-left: 35px;
}
.task-filter {
    float: left;
    height: 35px;
    font-size: 12px;
    color: #333333;
    line-height: 35px;
    margin-left: 64px;
}
.role-num {
    float: left;
}
.role-num1 {
    margin-left: 20px;
}
.content-num {
    width: 171px;
    height: 24px;
    padding: 0 10px;
    background: #FFFFFF;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 4px;
}
.search-button {
    float: left;
    text-align: center;
    line-height: 24px;
    color: #D93437;
    border: 1px solid #D83436;
    border-radius: 4px;
    width: 90px;
    height: 24px;
    margin-top: 4px;
    margin-left: 25px;
    cursor: pointer;
}
.dialog-footer button {
    border: 1px solid #838383;
    border-radius: 4px;
    width: 90px;
    height: 30px;
    text-align: center;
    background: #fff;
    color: #838383;
    cursor: pointer;
    margin-right: 20px;
}
.dialog-footer button:last-child {
    color: #D93437;
    border: 1px solid #D83436;
}
.special1 {
    position: relative;
}
.special1 .el-icon-information {
    position: absolute;
    right: -61px;
    top: 11px;
}
.special1 .addTaskType {
    position: absolute;
    right: -91px;
    top: 55px;
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 12px;
    color: #D93437;
    border: 1px solid #D83436;
    border-radius: 4px;
    cursor: pointer;
}
.tip-information {
    position: absolute;
    right: -61px;
    top: 40px;
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
.untreatTask-wrapper {
    background: #fff;
    height: 46px;
    padding-top: 4px;
}
.untreatTask {

    height: 46px;
    line-height: 46px;
    opacity: 0.99;
    border: 1px solid rgba(0,0,0,0.12);
    // border-bottom: 1px solid rgba(0,0,0,0.12);
    font-size: 14px;
    color: #333333;
    background: #fff;
}
.untreatTask ul li {
    float: left;
    height: 46px;
    margin-left: 69px;
}
.untreatTask ul li:first-child {
    margin-left: 32px;
}
.untreatTask-button {
    background: #fff;
    margin-top: 10px;
}
.important-task {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    color: #333333;
}
.important-task ul li {
    float: left;
}
.important-task ul li:first-child {
    font-weight: bold;
    padding: 0 30px;
    text-align: center;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid rgba(0,0,0,0.12);
    border-bottom: none;
}
.important-task ul li:nth-child(2) {
    margin-left: 30px;
    margin-right: 70px;
}
.nav-wrapper {
    position: fixed;
    right: 0;
    top: 92px;
    z-index: 100;
}
.nav-title {
    width: 25px;
    height: 94px;
    cursor: pointer;
    padding-top: 15px;
    padding-left: 2px;
    text-align: center;
    font-size: 16px;
    color: #FFFFFF;
    background: rgba(217,52,55,0.80);
    border-radius: 4px 0 0 4px;
    float: right;
}
.nav-position:hover .nav {
    display: block;
}
.nav-position {
    position: relative;
}
.depart-nav,
.key-quick {
    height: 35px;
    background: #FBEBEC;
    font-size: 12px;
    color: #333333;
    line-height: 35px;
    font-weight: bold;
    border-bottom: 1px solid rgba(0,0,0,0.12);
}
.key-quick {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}
.key-wrapper {
    height: 54px;
    background: #fff;
    border-bottom: 1px solid rgba(0,0,0,0.12);
}
.key-left,
.key-right {
    float: left;
    border: 1px solid #D93538;
    height: 24px;
    width: 70px;
    line-height: 24px;
    font-size: 12px;
    color: #D93538;
    margin-top: 14px;
    cursor: pointer;
}
.key-left:hover,
.key-right:hover {
    background: #D93538;
    color: #FFFFFF;
}
.key-left {
    margin-left: 17px;
}
.key-right {
    margin-left: 10px;
}
.nav {
    width: 184px;
    right: 27px;
    position: absolute;
    display: none;
    // height: 264px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid rgba(0,0,0,0.12);
    border-bottom: none;

}

.nav ul li {
    height: 35px;
    background: #fff;
    display: block;
    cursor: pointer;
    font-size: 12px;
    color: #333333;
    line-height: 35px;
    border-bottom: 1px solid rgba(0,0,0,0.12);
}
.nav ul li:last-child {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
}
.nav ul li:hover {
    background: #F1F1F1;
}
.goTop {
    position: fixed;
    z-index: 200;
    right: 20px;
    bottom: 50px;
    cursor: pointer;
}
.user-wrapper::after {
    content: "";
    display: block;
    clear: both;
}
.user-item,
.user-left,
.user-right {
    float: left;
}
.user-right-wrapper {
    width: 392px;
    margin-left: 10px;
}
.user-item {
    position: relative;
    width: 95px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #999999;
    border-radius: 4px;
    font-size: 12px;
    color: #333333;
    overflow: inherit;
    text-align: center;
    margin-right: 15px;
    margin-bottom: 10px;
}
.user-item i {
    position: absolute;
    z-index: 100;
    color: #999;
    top: -7px;
    right: -7px;
}
.user-right {
    width: 110px;
    height: 30px;
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
.addPercent {
    position: relative;
}
.addPercent span {
    position: absolute;
    right: -25px;
}
.week-rapper{
  overflow: hidden;
  margin-left: 99px;
}
.week-rapper ul li{
  border: 1px solid rgba(0,0,0,0.12);
  width: 28px;
  margin-left: 14px;
  float: left;
  line-height: 28px;
  font-size: 12px;
  height: 28px;
  cursor: pointer;
  text-align: center;
}
.week-rapper ul li.active{
  background: #D93437;
  border: 1px solid #D93437;
  color: #FFFFFF;
}

.user-title{
  opacity: 0.99;
  background: rgba(217,52,55,0.10);
  height: 47px;
  line-height: 44px;
  width: 100%;
  font-size: 14px;
  box-sizing: border-box;
  border: 1px solid rgba(0,0,0,0.12);
}

.title-name{
  float: left;
  // padding: 0 14px;
  color: #333333;
  text-align: center;
  box-sizing: border-box;
  height:46px;
  cursor: pointer;
  border-bottom: none;

}
.title-name1{
  margin-left: 30px;
  width: 160px !important;

}
.title-name6{
  width: 160px !important;
}
.title-name6:nth-child(1){
  width: 160px !important;
}
.title-name6:nth-child(2){
  width: 172px !important;
}
.title-name6:nth-child(3){
  width: 172px !important;
}
.title-name6:nth-child(4){
  width: 120px !important;
}
.title-name6:nth-child(5){
  width: 179px !important;
}
.title-name6:nth-child(6){
  width: 120px !important;
}
.title-name span{
  color: #C2453A !important;
}
.title-name:first-child{
  margin-left: 20px;
}
.title-name.active{
  color: #D93538;
  border-bottom:2px solid #D93538;
}
</style>
