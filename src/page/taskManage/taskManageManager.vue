<template>
  <!-- <transition name="slide"> -->
  <div class='task-manage'>
    <!--<tab></tab>-->
    <div class="goTop" v-show='show' @click='goTop'>
      <img src="../../images/goTop.png" alt="">
    </div>
    <div class="nav-wrapper">
      <div class="nav-position">
        <div class="nav-title">
          快捷导航
        </div>
        <div class="nav">
          <div class="key-quick">
            快捷操作
          </div>
          <div class="key-wrapper">
            <div class="key-left" @click='mindTask'>
              发起任务
            </div>
            <div class="key-right" @click='assignTask'>
              分配任务
            </div>
          </div>
          <div class="depart-nav">
            {{departNaV}}
          </div>
          <ul>
            <li v-for='(item,index) in step' @click='jump(index)'>{{item}}</li>
          </ul>
          <!-- <ul v-if='!goTop'>
            <li v-for='(item,index) in step' @click='jump(index)'>{{item}}</li>
          </ul> -->
        </div>
      </div>
    </div>
    <div class="wrapper">
      <div class="router-wrapper">
        <span class="child1">任务管理</span> / <span class="child2">任务列表</span>
      </div>
      <div class="take-top-wrapper">
        <div class="take-left" style="width:160px;">
          <div class="take-top" style="font-size: 15px;font-weight:normal">
            任务管理
          </div>
        </div>
        <div class="task-mid permissions-table" style="float:left;line-height:46px;">
          <span style="float:left;font-size: 14px;">可见范围：</span>
          <span style="float:left;">
            <el-checkbox-group v-model="checkedCities1" @change="handleCheckedCitiesChange1" :min="1">
            <el-checkbox v-for="item in options6" :label="item.roleId" :key="item.roleId">{{item.roleName}}</el-checkbox>
          </el-checkbox-group>
        </span>
        </div>
        <div class="take-right">
          {{taskName}}
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
        <div class="title-name title-name1 title-name8"
          v-for="(item,index) in tabs"
            :class="{active:index == num}"
             @click="tab(index)" v-html="item">{{item}}
        </div>
      </div>
      <div class="untreatTask-table taskNum0" v-show=" 0 == num">
        <el-table
          :data="result1"
          row-key="taskId"
          :expand-row-keys="expands2"
          @row-click="openDetails2"
          style="width: 100%" @expand="startExpend" empty-text='暂无数据'>
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
              <router-link :to="{ path: 'taskDetailManage',query: {id:props.row.taskId}}" style="color:#505363;">
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
                  class='complete' v-if='props.row.taskStatusType=="APPROVEMANAGEING"' @click='lateCheck(props.row.changeType,props.row.taskId,props.row.planEndDate,1,$event)'>任务审核</el-button>
                  <el-button
                    size="small"
                    class='complete' v-if='props.row.taskStatusType=="WAITMANAGEEVALUATE"' @click='completeModal(props.row.taskId,$event)'>任务评价</el-button>
                    <el-button
                      size="small"
                      class='complete' v-if='props.row.taskStatusType=="COMPLETION"' @click='completeModal(props.row.taskId,$event)'>任务评价</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-depart" v-if='total>0'>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage7" :page-sizes="[10, 15, 50]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=total>
          </el-pagination>
        </div>
      </div>
      <div class="untreatTask-table taskNum1" v-show=" 1 == num">
        <el-table
          :data="resultTask1"
          row-key="taskId"
          :expand-row-keys="expands2"
          @row-click="openDetails2"
          style="width: 100%" @expand="startExpend" empty-text='暂无数据'>
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
              <router-link :to="{ path: 'taskDetailManage',query: {id:props.row.taskId}}" style="color:#505363;">
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
                  class='complete' v-if='props.row.taskStatusType=="APPROVEMANAGEING"' @click='lateCheck(props.row.changeType,props.row.taskId,props.row.planEndDate,2,$event)'>任务审核</el-button>
                  <el-button
                    size="small"
                    class='complete' v-if='props.row.taskStatusType=="WAITMANAGEEVALUATE"' @click='completeModal(props.row.taskId,$event)'>任务评价</el-button>
                    <el-button
                      size="small"
                      class='complete' v-if='props.row.taskStatusType=="COMPLETION"' @click='completeModal(props.row.taskId,$event)'>任务评价</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-depart" v-if='total1>0'>
          <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="currentPage1" :page-sizes="[10, 15, 50]" :page-size=pageSize1 layout="total, sizes, prev, pager, next, jumper" :total=total1>
          </el-pagination>
        </div>
      </div>

      <div class="untreatTask-table taskNum2" v-show=" 3 == num">
        <el-table
          :data="resultTask3"
          row-key="taskId"
          :expand-row-keys="expands2"
          @row-click="openDetails2"
          style="width: 100%" @expand="startExpend" empty-text='暂无数据'>
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
              <router-link :to="{ path: 'taskDetailManage',query: {id:props.row.taskId}}" style="color:#505363;">
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
                    class='complete'  @click='completeModal(props.row.taskId,$event)'>任务评价</el-button>

            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-depart" v-if='total3>0'>
          <el-pagination @size-change="handleSizeChange3" @current-change="handleCurrentChange3" :current-page="currentPage3" :page-sizes="[10, 15, 50]" :page-size=pageSize3 layout="total, sizes, prev, pager, next, jumper" :total=total3>
          </el-pagination>
        </div>
      </div>


      <div class="untreatTask-table taskNum3" v-show=" 2 == num">
        <el-table
          :data="resultTask2"
          row-key="taskId"
          :expand-row-keys="expands2"
          @row-click="openDetails2"
          style="width: 100%" @expand="startExpend" empty-text='暂无数据'>
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
              <router-link :to="{ path: 'taskDetailManage',query: {id:props.row.taskId}}" style="color:#505363;">
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
                  class='complete' v-if='props.row.taskStatusType=="APPROVEMANAGEING"' @click='lateCheck(props.row.changeType,props.row.taskId,props.row.planEndDate,$event)'>任务审核</el-button>
                  <el-button
                    size="small"
                    class='complete' v-if='props.row.taskStatusType=="WAITMANAGEEVALUATE"' @click='completeModal(props.row.taskId,$event)'>任务评价</el-button>
                    <el-button
                      size="small"
                      class='complete' v-if='props.row.taskStatusType=="COMPLETION"' @click='completeModal(props.row.taskId,$event)'>任务评价</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-depart" v-if='total2>0'>
          <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="currentPage2" :page-sizes="[10, 15, 50]" :page-size=pageSize2 layout="total, sizes, prev, pager, next, jumper" :total=total2>
          </el-pagination>
        </div>
      </div>

      <div class="untreatTask-table taskNum4" v-show=" 4 == num">
        <el-table
          :data="resultTask4"
          row-key="taskId"
          :expand-row-keys="expands2"
          @row-click="openDetails2"
          style="width: 100%" @expand="startExpend" empty-text='暂无数据'>
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
              <!-- <router-link :to="{ path: 'taskDetailManage',query: {id:props.row.taskId}}" style="color:#505363;"> -->
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
              <!-- <div class="" v-if='props.row.lastTaskReplyer!=null'>
                <div v-if='props.row.lastReplyStatus=="UNREAD"' style="color:rgb(217, 52, 55)">
                  <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                </div>
                <div v-if='props.row.lastReplyStatus=="READED"'>
                  <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                </div>
              </div> -->
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="props">
                  <el-button
                    size="small"
                    class='complete'  @click='editorTask(props.row.taskId,$event)'>编辑任务</el-button>

            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-depart" v-if='total4>0'>
          <el-pagination @size-change="handleSizeChange4" @current-change="handleCurrentChange4" :current-page="currentPage3" :page-sizes="[10, 15, 50]" :page-size=pageSize4 layout="total, sizes, prev, pager, next, jumper" :total=total4>
          </el-pagination>
        </div>
      </div>
      <div class="">
        <!--添加协助人-->
        <el-dialog title="添加协助人" :visible.sync="dialogVisible25" size="tiny" :before-close="handleClose25" top='25%' class=" noticeManageModel">
          <el-form :model="ruleForm25" :rules="rules" ref="ruleForm25" label-width="112px" class="demo-ruleForm">
            <el-form-item label="姓名:" prop="username" style="margin-right: 40px !important;">

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
            <el-select v-model="ruleForm31.value14" placeholder="请选择类型" style="width:100%;">
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
            <i class="el-icon-information" style="float:left;margin-right: 40px !important;" @mouseenter="iconEnter2" @mouseleave="iconLeave2"></i>
            <div class="tip-information" ref="displayShow2">
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
                <div class='user-right' @click='adduser13'>添加协助人</div>
                <div class="user-item ellipsis" v-for='(item,index) in brr13'>
                  <span class="ellipsis" style="display: inline-block;width: 100%">{{item.assistUserName}}（{{item.proportion}}%）</span>
                  <i class="el-icon-circle-close" @click="removeTodo13(index)"></i>
                </div>

              </div>
            </div>
            <el-form-item label="关联项目:" style="margin-right: 40px !important;">
              <el-select v-model="ruleForm31.value7" placeholder="请选择关联项目" style="width:100%;">
                <el-option v-for="item in projects" :key="item.projectId" :label="item.projectName" :value="item.projectId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务可见范围:" style="margin-right: 40px !important;">
              <el-select  multiple  v-model="ruleForm31.value71" placeholder="请选择部门"  style="width:100%;">
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
            <button  @click="submitForm31('ruleForm31')">编辑任务</button>
          </span>
      </el-dialog>

      <!-- 公司重点任务 -->
      <!-- <div class="untreatTask-button" >
        <div class="important-task">
          <ul>
            <li style="background: #FBEBEC;border-color:#FBEBEC;padding:0;">公司重点任务</li>
            <li>公司重点任务：{{cimpTaskSizeMy}}</li>
            <li>部门重点任务：{{dimpTaskSizeMy}}</li>
          </ul>
        </div>
      </div>
      <div class="untreatTask-table companyImp">
        <el-table
          :data="result"
          row-key="taskId"
          :expand-row-keys="expands1"
          @row-click="openDetails1"
          style="width: 100%" @expand="startExpend" empty-text='暂无数据'>
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
                    截止日期：{{ props.row.planEndDate}}
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
              <router-link :to="{ path: 'taskDetailManage',query: {id:props.row.taskId}}" style="color:#505363;">
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
            label="任务状态"
            prop="desc" min-width='50'>
            <template slot-scope="props">
                <div class="">
                  <img class="icon_type" v-if="props.row.iconType=='FINISHU'"  src="../../images/lateTime2.png" alt="" >
                  <img class="icon_type" v-if="props.row.iconType=='FINISHUW'" src="../../images/timeLate.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='EXCELLENT'" src="../../images/icon_excellent.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='GOOD'" src="../../images/icon_good.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='SECONDARY'" src="../../images/icon_well.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='DIFFERENCE'" src="../../images/icon_bad.png" alt="">
                  <img class="icon_type" v-if="props.row.iconType=='POOR'" src="../../images/icon_worse.png" alt="">
                  <span style="color:#D93437;">{{props.row.taskStatusStr}}</span>
                </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="props">
              <span>
              <span>
                 <el-button
                   size="small"
                  class='complete' v-if='props.row.canCancel==true'  @click='cancle(props.row.taskId,$event)'>取消</el-button>
              </span>
              <span>
                  <el-button
                    size="small"
                     class='complete' v-if='props.row.taskStatus!="COMPLETION"' @click='delay(props.row.taskId,props.row.planEndDate,$event)'>延期</el-button>
                </span>
                <span>
                    <el-button
                      size="small"
                      class='complete' v-if='props.row.taskStatus!="COMPLETION"' @click='levelChange(props.row.taskId,$event)'>等级变更</el-button>
                  </span>
                  <span v-if='props.row.myselfTaskJudge==false&&props.row.taskStatus=="UNCOMPLETION"'>

                      <el-button
                        size="small"
                        class='complete'  @click='tipCompleteModal(props.row.taskId,$event)'>提醒完成</el-button>

                  </span>
                  <span v-else>

                      <el-button
                        size="small"
                        class='complete' v-if='props.row.taskStatus!="COMPLETION"'  @click='completeModal1(props.row.taskId,$event)'>完成</el-button>

                  </span>
                  </span>
            </template>
          </el-table-column>
        </el-table>
      </div> -->
      <!-- 部门视图 -->
      <div  v-show='taskGroup'>
        <div v-for='(item,index) in totalDepart'>
          <div class="take-top-wrapper d_jump" index='1' style="margin-top:10px;">
            <div class="take-left">
              <div class="take-top" style="float:left;">
                {{item.deptName}}
              </div>
            </div>
            <div ref="mybox" class="packUp" @click='packUp(index)' style="float:right;margin-right:44px;margin-top:9px;cursor:pointer;text-align:center;font-size: 12px;line-height:28px;color:#D93538;width:65px;height:28px;border:1px solid #D93538;border-radius: 4px;">
              收起
            </div>

          </div>
          <div>
          <div class="untreatTask-wrapper">
            <div class="untreatTask">
              <ul>
                <li>总任务数：{{item.taskStatistics.totalTaskSize}}</li>
                <li>公司重点任务：{{item.taskStatistics.cimpTaskSize}}</li>
                <li>部门重点任务：{{item.taskStatistics.dimpTaskSize}}</li>
                <li>个人重点任务：{{item.taskStatistics.pimpTaskSize}}</li>
                <li>个人普通任务：{{item.taskStatistics.pcommonTaskSize}}</li>
              </ul>
            </div>
          </div>
          <div class="partView" v-for='(item1,index1) in item.taskInfos'>
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
          <div>
            <div class="untreatTask-table">
              <el-table
                :data="item1.tasks"
                row-key="taskId"
                :expand-row-keys="expands"
                @row-click="openDetails"
                style="width: 100%" @expand="startExpend" empty-text='暂无数据'>
                <el-table-column
                  label="序号"
                  width="64"
                >
                  <template slot-scope="props">
                    <span>{{index1+1}}.{{props.$index+1}}</span>
                  </template>
                </el-table-column>
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
                        <div>
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
                          截止日期：{{ props.row.planEndDate}}
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
                <el-table-column
                  label="任务标题"
                  prop="id">
                  <template slot-scope="props">
                    <router-link :to="{ path: 'taskDetailManage',query: {id:props.row.taskId}}" style="color:#505363;">
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
                  label="任务状态"
                  prop="desc">
                  <template slot-scope="props">
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
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作" width='320'>
                  <template slot-scope="props">
                    <span>
                      <!-- <el-button
                        size="small"
                       :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='cancle(props.row.taskId)'>取消</el-button> -->
                       <el-button
                         size="small"
                        class='complete' v-if='props.row.taskStatus!="COMPLETION"' @click='cancle(props.row.taskId,$event)'>取消</el-button>
                    </span>
                    <span>
                      <!-- <el-button
                        size="small"
                        :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='delay(props.row.taskId,props.row.planEndDate)'>延期</el-button> -->
                        <el-button
                          size="small"
                           class='complete' v-if='props.row.taskStatus!="COMPLETION"'   @click='delay(props.row.taskId,props.row.planEndDate,$event)'>延期</el-button>
                      </span>
                      <span >
                        <!-- <el-button
                          size="small"
                          :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='levelChange(props.row.taskId)'>等级变更</el-button> -->
                          <el-button
                            size="small"
                            class='complete' v-if='props.row.taskStatus!="COMPLETION"' @click='levelChange(props.row.taskId,$event)'>等级变更</el-button>
                        </span>
                        <span>
                          <!-- <el-button
                            size="small"
                            :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='completeModal(props.row.taskId)'>完成</el-button> -->
                            <el-button
                              size="small"
                              class='complete' v-if='props.row.taskStatus!="COMPLETION"&&props.row.hadremind==false' @click='tipCompleteModal(props.row.taskId,$event)'>提醒完成</el-button>

                              <el-button
                                size="small" :disabled="true" :plain="true"
                                class='disable-button' v-if='props.row.taskStatus!="COMPLETION"&&props.row.hadremind==true' @click='tipCompleteModal(props.row.taskId,$event)'>已提醒完成</el-button>

                        </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>

        <div class="childrenView" v-for='(item2,index2) in item.branchTaskInfoDeptmentalVos'>
          <div class="take-top-wrapper" style="margin-top:10px;">
            <div class="take-left">
              <div class="take-top" style="float:left;">
                {{item2.deptName}}
              </div>
            </div>
            <div ref="mybox3" class="packUp" @click='packUp3(item2.index)' style="float:right;margin-top:9px;margin-right:44px;cursor:pointer;text-align:center;font-size: 12px;line-height:28px;color:#D93538;width:65px;height:28px;border:1px solid #D93538;border-radius: 4px;">
              收起
            </div>

          </div>
          <div>
            <div class="untreatTask-wrapper">
              <div class="untreatTask">
                <ul>
                  <li>总任务数：{{item2.taskStatistics.totalTaskSize}}</li>
                  <li>公司重点任务：{{item2.taskStatistics.cimpTaskSize}}</li>
                  <li>部门重点任务：{{item2.taskStatistics.dimpTaskSize}}</li>
                  <li>个人重点任务：{{item2.taskStatistics.pimpTaskSize}}</li>
                  <li>个人普通任务：{{item2.taskStatistics.pcommonTaskSize}}</li>
                </ul>
              </div>
            </div>
            <div class="" v-for='(item3,index3) in item2.taskInfos'>
              <div class="take-top-wrapper" style="margin-top:10px;background:rgba(217, 52, 55, 0.02);">
                <div class="take-left">
                  <div class="take-top" style="float:left;width:auto;min-width:280px;">
                    {{index3+1}}.{{item3.taskTypeName}}
                  </div>
                </div>
                <div @click='mindTask1(item3.taskTypeId)'style="float:right;margin-top:9px;margin-left:4px;margin-right:44px;cursor:pointer;text-align:center;font-size: 12px;line-height:28px;color:#D93538;width:65px;height:28px;border:1px solid #D93538;border-radius: 4px;">
                  添加任务
                </div>
                <div ref="mybox2" class="packUp mybox2" @click='packUp2(item3.index)' style="margin-left:6px;float:right;margin-top:9px;cursor:pointer;text-align:center;font-size: 12px;line-height:28px;color:#D93538;width:65px;height:28px;border:1px solid #D93538;border-radius: 4px;">
                  收起
                </div>

              </div>
            <div>
              <div class="untreatTask-table">
                <el-table
                  :data="item3.tasks"
                  row-key="taskId"
                  :expand-row-keys="expands"
                  @row-click="openDetails"
                  style="width: 100%" @expand="startExpend" empty-text='暂无数据'>
                  <el-table-column
                    label="序号"
                    width="64"
                  >
                    <template slot-scope="props">
                      <span>{{index3+1}}.{{props.$index+1}}</span>
                    </template>
                  </el-table-column>
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
                          <div>
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
                            截止日期：{{ props.row.planEndDate}}
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
                  <el-table-column
                    label="任务标题"
                    prop="id">
                    <template slot-scope="props">
                      <router-link :to="{ path: 'taskDetailManage',query: {id:props.row.taskId}}" style="color:#505363;">
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
                    label="任务状态"
                    prop="desc">
                    <template slot-scope="props">
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
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作" width='320'>
                    <template slot-scope="props">
                      <span>
                        <!-- <el-button
                          size="small"
                         :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='cancle(props.row.taskId)'>取消</el-button> -->
                         <el-button
                           size="small"
                          class='complete' v-if='props.row.taskStatus!="COMPLETION"' @click='cancle(props.row.taskId,$event)'>取消</el-button>
                      </span>
                      <span>
                        <!-- <el-button
                          size="small"
                          :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='delay(props.row.taskId,props.row.planEndDate)'>延期</el-button> -->
                          <el-button
                            size="small"
                             class='complete' v-if='props.row.taskStatus!="COMPLETION"'   @click='delay(props.row.taskId,props.row.planEndDate,$event)'>延期</el-button>
                        </span>
                        <span >
                          <!-- <el-button
                            size="small"
                            :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='levelChange(props.row.taskId)'>等级变更</el-button> -->
                            <el-button
                              size="small"
                              class='complete' v-if='props.row.taskStatus!="COMPLETION"' @click='levelChange(props.row.taskId,$event)'>等级变更</el-button>
                          </span>
                          <span>
                            <!-- <el-button
                              size="small"
                              :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='completeModal(props.row.taskId)'>完成</el-button> -->
                              <el-button
                                size="small"
                                class='complete' v-if='props.row.taskStatus!="COMPLETION"&&props.row.hadremind==false' @click='tipCompleteModal(props.row.taskId,$event)'>提醒完成</el-button>

                                <el-button
                                  size="small" :disabled="true" :plain="true"
                                  class='disable-button' v-if='props.row.taskStatus!="COMPLETION"&&props.row.hadremind==true' @click='tipCompleteModal(props.row.taskId,$event)'>已提醒完成</el-button>

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
      </div>
      <!-- 客户任务组 --><!--任务组视图-->
      <div class="taskView" v-show='!taskGroup'>
        <div class="" v-for='(item,index) in totalGrounp'>
          <div class="take-top-wrapper d_jump1" index='1' style="margin-top:10px;">
            <div class="take-left" style="float:left;">
              <div class="take-top">
                {{item.taskGroupName}}
              </div>
            </div>
            <!-- <div @click='mindTask'style="float:right;margin-top:9px;margin-left:4px;margin-right:4px;cursor:pointer;text-align:center;font-size: 12px;line-height:28px;color:#D93538;width:65px;height:28px;border:1px solid #D93538;border-radius: 4px;">
              添加任务
            </div> -->
            <div ref="mybox1" class="packUp" @click='packUp(index)' style="float:right;margin-right:44px;margin-top:9px;cursor:pointer;text-align:center;font-size: 12px;line-height:28px;color:#D93538;width:65px;height:28px;border:1px solid #D93538;border-radius: 4px;">
              收起
            </div>

          </div>
          <div class="">
            <div class="untreatTask-wrapper">
              <div class="untreatTask">
                <ul>
                  <li>总任务数：{{item.taskStatistics.totalTaskSize}}</li>
                  <li>公司重点任务：{{item.taskStatistics.cimpTaskSize}}</li>
                  <li>部门重点任务：{{item.taskStatistics.dimpTaskSize}}</li>
                  <li>个人重点任务：{{item.taskStatistics.pimpTaskSize}}</li>
                  <li>个人普通任务：{{item.taskStatistics.pcommonTaskSize}}</li>
                </ul>
              </div>
            </div>
            <div class="" v-for='m in item.taskInfoGroupClassifiedList'>
              <div class="untreatTask-button">
                <div class="important-task">
                  <ul>
                    <li style="width:auto;padding:0 30px;">{{m.taskTypeName}}</li>
                  </ul>
                </div>
              </div>
              <div class="untreatTask-table">
                <el-table
                  :data="m.tasks"
                  row-key="taskId"
                  :expand-row-keys="expands"
                  @row-click="openDetails"
                  style="width: 100%" @expand="startExpend" empty-text='暂无数据'>
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
                  <el-table-column
                    label="任务标题"
                    prop="id">
                    <template slot-scope="props">
                      <router-link :to="{ path: 'taskDetailManage',query: {id:props.row.taskId}}" style="color:#505363;">
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
                    label="任务状态"
                    prop="desc" min-width='50'>
                    <template slot-scope="props">
                        <div >
                          <img class="icon_type" v-if="props.row.iconType=='FINISHU'"  src="../../images/lateTime2.png" alt="" >
                          <img class="icon_type" v-if="props.row.iconType=='FINISHUW'" src="../../images/timeLate.png" alt="">
                          <img class="icon_type" v-if="props.row.iconType=='EXCELLENT'" src="../../images/icon_excellent.png" alt="">
                          <img class="icon_type" v-if="props.row.iconType=='GOOD'" src="../../images/icon_good.png" alt="">
                          <img class="icon_type" v-if="props.row.iconType=='SECONDARY'" src="../../images/icon_well.png" alt="">
                          <img class="icon_type" v-if="props.row.iconType=='DIFFERENCE'" src="../../images/icon_bad.png" alt="">
                          <img class="icon_type" v-if="props.row.iconType=='POOR'" src="../../images/icon_worse.png" alt="">
                          <span>{{props.row.taskStatusStr}}</span>
                        </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作">
                    <template slot-scope="props">
                      <span>
                        <!-- <el-button
                          size="small"
                         :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='cancle(props.row.taskId)'>取消</el-button> -->
                         <el-button
                           size="small"
                          class='complete' v-if='props.row.taskStatus!="COMPLETION"' @click='cancle(props.row.taskId,$event)'>取消</el-button>
                      </span>
                      <span>
                        <!-- <el-button
                          size="small"
                          :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='delay(props.row.taskId,props.row.planEndDate)'>延期</el-button> -->
                          <el-button
                            size="small"
                             class='complete' v-if='props.row.taskStatus!="COMPLETION"'   @click='delay(props.row.taskId,props.row.planEndDate,$event)'>延期</el-button>
                        </span>
                        <span >
                          <!-- <el-button
                            size="small"
                            :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='levelChange(props.row.taskId)'>等级变更</el-button> -->
                            <el-button
                              size="small"
                              class='complete' v-if='props.row.taskStatus!="COMPLETION"' @click='levelChange(props.row.taskId,$event)'>等级变更</el-button>
                          </span>
                          <span>
                            <!-- <el-button
                              size="small"
                              :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='completeModal(props.row.taskId)'>完成</el-button> -->
                              <el-button
                                size="small"
                                class='complete' v-if='props.row.taskStatus!="COMPLETION"&&props.row.hadremind==false' @click='tipCompleteModal(props.row.taskId,$event)'>提醒完成</el-button>
                                <el-button
                                  size="small"
                                :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="COMPLETION"&&props.row.hadremind==true' @click='tipCompleteModal(props.row.taskId,$event)'>已提醒完成</el-button>
                          </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="">
        <!--发布任务模态窗-->
        <el-dialog
          title='取消任务审核'
          :visible.sync="dialogVisible6"
          size="tiny"
          :before-close="handleClose6" top='23%' >
          <el-form :model="ruleForm16" :rules="rules" ref="ruleForm16" label-width="112px" class="demo-ruleForm">
            <el-form-item label="取消原因：" prop="cancleCause" required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm16.cancleCause"></el-input>
            </el-form-item>
            <!-- <el-form-item label="审核原因：" prop="becomCuase3" required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm16.becomCuase3"></el-input>
            </el-form-item> -->
          </el-form>
          <span slot="footer" class="dialog-footer">
            <button  @click="resetForm6('ruleForm16')">不同意</button>
            <button  @click="submitForm6('ruleForm16')">同 意</button>
          </span>
        </el-dialog>
      </div>
      <div class="">
        <!--申请变更任务重要等级-->
        <el-dialog
          title="申请变更任务重要等级"
          :visible.sync="dialogVisible13"
          size="tiny"
          :before-close="handleClose13" top='25%' class=" noticeManageModel">
          <el-form :model="ruleForm3" :rules="rules" ref="ruleForm3" label-width="112px" class="demo-ruleForm">
            <el-form-item label="任务重要等级:" prop="value3" required  style="margin-right: 40px !important;">
              <el-select v-model="ruleForm3.value3" placeholder="请选择任务等级"  style="width:100%;" @change='choseLevel3'>
               <el-option
                 v-for="item in options1"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
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
        <!--发布任务模态窗-->
        <el-dialog
          title='完成任务'
          :visible.sync="dialogVisible8"
          size="tiny"
          :before-close="handleClose8" top='23%' >
          <el-form :model="ruleForm8" :rules="rules" ref="ruleForm8" label-width="112px" class="demo-ruleForm">
            <el-form-item label="完成质量:" prop="mass" required style="margin-right: 40px !important;">
              <el-select v-model="ruleForm8.mass" placeholder="请选择完成质量" style="width:100%;" @change='completeMass'>
                <el-option
                  v-for="item in options3"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="快速点评:"  style="margin-right: 40px !important;">
              <el-select v-model="ruleForm8.rate" placeholder="请选择快速点评" style="width:100%;" @change='completeRate'>
                <el-option
                  v-for="item in options4"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务评价：" prop="rateContent" required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm8.rateContent"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <button  @click="resetForm8('ruleForm8')">取 消</button>
            <button  @click="submitForm8('ruleForm8')">确 认</button>
          </span>
        </el-dialog>
      </div>
      <div class="">
        <!--延期审核-->
        <el-dialog
          title="延期任务审核"
          :visible.sync="dialogVisible4"
          size="tiny"
          :before-close="handleClose4" top='20%' class=" noticeManageModel">
          <el-form :model="ruleForm14" :rules="rules" ref="ruleForm14" label-width="112px" class="demo-ruleForm">
            <el-form-item label="延期时间:" required style="margin-right: 40px !important;height:36px;">
              <el-form-item prop="date2">
                <el-date-picker type="date" :picker-options="pickerOptions1" placeholder="选择日期" v-model="ruleForm14.date2" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-form-item>
            <el-form-item label="延期原因：" prop="delayCause" required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm14.delayCause"></el-input>
            </el-form-item>
            <!-- <el-form-item label="审核原因：" prop="becomCuase4" required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm14.becomCuase4"></el-input>
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
        <el-dialog
          title='添加任务类型'
          :visible.sync="dialogVisible5"
          size="tiny"
          :before-close="handleClose5" top='23%' >
          <el-form :model="ruleForm55" :rules="rules" ref="ruleForm55" label-width="112px" class="demo-ruleForm">
            <el-form-item label="任务类型:" prop="taskname" style="margin-right: 40px !important;">
              <el-input v-model="ruleForm55.taskname"></el-input>
            </el-form-item>
            <el-form-item label="任务分值:" prop="score" required style="margin-right: 40px !important;">
              <el-select v-model="ruleForm55.score" placeholder="请选择任务分值" style="width:100%;">
                <el-option
                  v-for="item in score"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <button  @click="resetForm5('ruleForm55')">取 消</button>
            <button  @click="submitForm5('ruleForm55')">确 认</button>
          </span>
        </el-dialog>
      </div>
      <div class="">
        <!--发布任务模态窗-->
        <el-dialog
          title="分配任务"
          :visible.sync="dialogVisible3"
          size="tiny"
          :before-close="handleClose3" top='20%' class="assignTaskModel" >
          <el-form :model="ruleForm33" :rules="rules" ref="ruleForm33" label-width="112px" class="demo-ruleForm">
            <el-form-item label="任务标题:" prop="titlen" style="margin-right: 104px !important;">
              <el-input v-model="ruleForm33.titlen"></el-input>
            </el-form-item>

            <el-form-item label="执行人:" prop="goUser" required style="margin-right: 104px !important;">
              <el-select v-model="ruleForm33.goUser" placeholder="请选择执行人" style="width:100%;" @change='selectGoUser'>
                <el-option
                  v-for="item in usersGo"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务类型:" prop="taskTypeF" class="special1" required style="margin-right: 104px !important;">
              <el-select v-model="ruleForm33.taskTypeF" placeholder="请选择任务类型" style="width:100%;" @change='selectType'>
                <el-option
                  v-for="item in optionType1"
                  :key="item.taskTypeId"
                  :label="item.taskTypeName"
                  :value="item.taskTypeId">
                </el-option>
              </el-select>
              <!-- <div class="addTaskType" @click='addTaskType'>
                添加任务类型
              </div> -->
            </el-form-item>
            <el-form-item label="任务重要等级:" prop="imporLeveln" required class="special1" style="margin-right: 104px !important;">
              <el-select v-model="ruleForm33.imporLeveln" placeholder="请选择任务类型" style="width:100%;" @change='selectLevel'>
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
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
            <el-form-item label="完成时间:" required style="margin-right: 104px !important;height:36px;">
              <el-form-item prop="choseTimen">
                <el-date-picker type="date" :picker-options="pickerOptions0" placeholder="选择日期" v-model="ruleForm33.choseTimen" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <button  @click="resetForm3('ruleForm33')">取 消</button>
            <button  @click="submitForm3('ruleForm33')">分配任务</button>
          </span>
        </el-dialog>
      </div>
      <div class="">
        <!--发布任务模态窗-->
        <el-dialog
          title="发起任务"
          :visible.sync="dialogVisible"
          size="tiny"
          :before-close="handleClose" top='10%' class=" noticeManageModel">
          <el-form :model="ruleForm" :rules='rules'  ref="ruleForm" label-width="112px" class="demo-ruleForm">
            <div style="margin-left:32px;margin-bottom:18px;overflow:hidden;">
              <span style="float:left;line-height:36px;"><label style="color:#ff4949">* </label>任务标题:</span>
              <el-input v-model="ruleForm.name" style="width:363px;margin-left:12px;float:left;"></el-input>
            </div>
            <div style="margin-left:46px;margin-bottom:18px;overflow:hidden;">
              <span style="float:left;vertical-align:middle;line-height:36px;">
                <label style="color:#ff4949">* </label>执行人:</span>
                <span style="width:363px;margin-left:12px;float:left;">
                  <el-select  v-model="ruleForm.value5" filterable placeholder="请选择执行人" style="width:100%;" @change='goLink'>
                <el-option
                  v-for="item in users"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId">
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
                 <el-option
                   v-for="item in optionType"
                   :key="item.taskTypeId"
                   :label="item.taskTypeName"
                   :value="item.taskTypeId">
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
                  <el-option
                    v-for="item in optionsObj"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId">
                  </el-option>
                </el-select>
              </span>
            </div>
            <div style="margin-left:4px;margin-bottom:18px;" class="clearfix">
              <span style="float:left;vertical-align:middle;line-height:36px;">
                <label style="color:#ff4949">* </label>任务重要等级:
              </span>
              <span style="width:363px;margin-left:12px;float:left;" class="special1">
                <el-select v-model="ruleForm.value3" placeholder="请选择任务等级"  style="width:100%;">
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
                  <div class='user-right'  @click='adduser'>添加协助人</div>
                  <div class="user-item ellipsis" v-for='(item,index) in brr'>
                    <span class="ellipsis" style="display: inline-block;width: 100%;">{{item.username}}（{{item.proportion}}%）</span>
                    <i class="el-icon-circle-close"  @click="removeTodo(index)"></i>
                  </div>

                </div>
              </div>
              <el-form-item label="关联项目:" style="margin-right: 40px !important;">
                <el-select v-model="ruleForm.value7" placeholder="请选择关联项目"  style="width:100%;" @click='choseRelateProject'>
                  <el-option
                    v-for="item in projects"
                    :key="item.projectId"
                    :label="item.projectName"
                    :value="item.projectId">
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
          </el-form>
          <span slot="footer" class="dialog-footer">
              <button  @click="resetForm7('ruleForm7')">不同意</button>
              <button  @click="submitForm7('ruleForm7')">同 意</button>
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

    </div>
  </div>
  <!-- </transition> -->
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
  import { listPending1,departmentList,listDraftTask,sureEditorTask,
    impChangeOrdTask,addEnabled,completeTask,
    listJustDeptLeaders,listNewTaskPending,
    listChangeTaskPending,listCommentTaskPending,listCommentTaskPendingUnCompleted,
    seeReplyStatus,listTaskExecutors,
    seeReplyContent,assignTaskManage,remindTaskList,
    addTaskType,listDepartmental,listReportingUsers,
    listGrouped,delayTaskCause,changeTaskLevel,listByExecutor,
    cancelTaskCause,assignmentTask,assessTask,assessTaskDetail,
    getChangeType,approvalTask,taskHeader,companyImportTask,publishTask,
    getUsersObj,getAllStatistics,userTaskReply,getProjectList,editorTaskMain,
    getTaskType,listAllUsers,dragTask} from 'service/getData'
//  import Tab from 'components/common/tab'
  import {ERR_OK,score} from 'service/config'
  import Sortable from 'sortablejs'
  import  store from '../../store'
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
        pickerOptions1:{},
        step:[],
        expands:[],
        expands1:[],
        expands2:[],
        taskDept:[],
        taskSecond:[],
        executor31:1,
        isActive:true,
        isActive1:false,
        time1:'2017-12-20',
        sortable: null,
        olderList: [],
        newList: [],
        show:false,
        result1:[],
        stretch:false,
        msg:"展开更多选项",
        result:[],
        showDataM:[],
        showDataS:[],
        total4:0,
        num: 0,
        checkedCities1: ['COMPANY','DEPARTMENT','PERSONALIMP','PERSONALORD'],
        checkedCities: [],
        checkedValue: [],
        checkedKey:[],
        checkedValue1: ['COMPANY','DEPARTMENT','PERSONALIMP','PERSONALORD'],
        options6:[
          {roleId:'COMPANY',roleName:'公司重点'},
          {roleId:'DEPARTMENT',roleName:'部门重点'},
          {roleId:'PERSONALIMP',roleName:'个人重点'},
          {roleId:'PERSONALORD',roleName:'个人普通'}
        ],
        score:score,
        taskNumber:'',
        dialogVisible44:false,
        departNaV:'部门导航',
        cimpTaskSizeMy:'',
        dimpTaskSizeMy:'',
        becomeTitle:'申请变更任务重要等级',
        taskName:'部门视图',
        dialogVisibleS:false,
        dialogVisible4:false,
        dialogVisible3:false,
        dialogVisible12:false,
        dialogVisible5:false,
        dialogVisible6:false,
        dialogVisible7:false,
        dialogVisible8:false,
        dialogVisible11:false,
        dialogVisible13:false,
        dialogVisible15:false,
        dimpTaskSize:'',
        cimpTaskSize:'',
        dimpTaskSize:'',
        pimpTaskSize:'',
        pcommonTaskSize:'',
        totalTaskSize:'',
        pendingTaskSize:'',
        show1:true,
        addUsers13:[],
        Taskoptions:[],
        depet:[],
        addUsers:[],
        optionType:[],
        optionType1:[],
        totalDepart:[],
        totalDepartData:[],
        ruleFormS: {
          becomCuase2:''
        },
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
        users:[],
        addUsers131:[],
        showData:[],
        showTask:[],
        totalGrounp:[],
        brr13:[],
        brr:[],
        taskStepName:[],
        grounpStepName:[],
        projects:[],
        optionsObj:[],
        resultTask1:[],
        resultTask2:[],
        taskInfoGroupClassifiedList:[],
        show2:false,
        total:0,
        pageSize:10,
        nowPage:1,
        nowPageS:1,
        total1:0,
        pageSize1:10,
        nowPage1:1,
        total2:0,
        pageSize2:10,
        nowPage2:1,
        total3:0,
        pageSize3:10,
        nowPage3:1,
        pageSize4:10,
        nowPage4:1,
        resultTask4:[],
        taskGroup:true,
        usersGo:[],
        resultTask3:[],
        usersT:[],
        currentPage7:1,
        activeName:false,
        currentPage1:1,
        currentPage2:1,
        currentPage3:1,
        currentPage4:1,
        dialogVisible: false,
        dialogVisible1:false,
        dialogVisible22:false,
        hello:false,
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
          percent:'',
        },
        ruleForm7: {
          grades: '',
          becomCuase2:'',
          becomCuase1:'',
        },
        ruleForm8: {
          mass: '',
          rate:'',
          rateContent:'',
        },
        ruleForm14: {
          date2: '',
          delayCause:'',
          becomCuase4:'',
        },
        ruleForm16: {
          cancleCause: '',
          becomCuase3:'',
        },
        ruleForm25: {
          username: '',
          percent1:'',
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
       options4: [

       ],
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
      }
      ],
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
      dialogVisible10:false,
       value: '',
       ruleForm: {
         name: '',
         name13:'',
         date1: '',
         date2: '',
         date13:'',
         dateM:'',
         region1:'',
         region:'',
         content:'',
         region: '',
         desc: '',
         score:'',
         telObj:'',
         telObj13:'',
         content:'',
         content13:'',
         value3:'',
         value13:'',
         value4:'',
         value14:'',
         value15:'',
         value5:'',
         value6:'',
         value16:'',
         value7:'',
         value17:'',
         value71:[],
         taskname:'',
         mass:'',
         rate:'',
         titlen:'',
         taskTypeF:'',
         goUser:'',
         choseTimen:'',
         imporLeveln:'',
         rateContent:'',
         becomCuase2:'',
         becomCuase3:'',
         becomCuase4:'',
         becomCuase1:'',
         cancleCause:'',
         grades:'',
         delayCause:'',
       },
       tabs: ["新任务/待审核", "变更任务/待审核","任务已完成待评价","任务未完成待评价",'待完善'],
       isActive:false,
       hasError:false,
       cimpTaskSizeU:'',
       dimpTaskSizeU:'',
       ruleForm1: {
         cause: ''
       },
       ruleForm33: {
         choseTimen: '',
         imporLeveln: '',
         goUser: '',
         taskTypeF: '',
         titlen: ''
       },
       ruleForm44: {
         cause4: '',
       },
       ruleForm55: {
         taskname: '',
         score: ''
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
       dialogVisible25:false,
       taskIds:'',
       ruleForm25: {
         username: '',
         percent1: '',
       },
       rules: {
         telObj:
         [
           { required: true, message: '请选择任务汇报对象', type:'number'  },
         ],
         telObj13:
         [
           { required: true, message: '请选择任务汇报对象',type:'number'  },
         ],
         score:
         [
           { required: true,type:'number', message: '请选择任务分值' },
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
           {max: 200, message: '任务评价不能超过200个字符'}
         ],
         titlen:
         [
           { required: true, message: '请填写任务标题'},
           {max: 50, message: '任务标题不能超过50个字符'}
         ],
         name: [
           { required: true, message: '请输入任务标题' },
           {max: 50, message: '任务标题不能超过20个字符'}
         ],
         name13: [
           { required: true, message: '请输入任务标题' },
           {max: 50, message: '任务标题不能超过50个字符'}
         ],
         grades: [
           { required: true, message: '请选择重要等级'},
         ],
         becomCuase1: [
           { required: true, message: '请填写审核原因' },
           {max: 200, message: '审核原因不能超过200个字符'}
         ],
         taskname: [
           { required: true, message: '请填写任务类型名称' },
           {max: 20, message: '任务类型不能超过20个字符'}
         ],
         becomCuase2: [
           { required: true, message: '请填写审核原因' },
           {max: 200, message: '审核原因不能超过200个字符'}
         ],
         becomCuase3: [
           { required: true, message: '请填写审核原因'},
           {max: 200, message: '审核原因不能超过200个字符'}
         ],
         becomCuase4: [
           { required: true, message: '请填写审核原因' },
           {max: 200, message: '审核原因不能超过200个字符'}
         ],
         delayCause: [
           { required: true, message: '请填写延期原因'},
           {max: 200, message: '延期原因不能超过200个字符'}
         ],
         cancleCause: [
           { required: true, message: '请填写取消原因' },
           {max: 200, message: '取消原因不能超过200个字符'}
         ],
         username: [
           { required: true, message: '请填写姓名',type:'number' },
         ],
         percent: [
           { required: true, message: '请填写占比'},
           { validator: checkPecent },
           { type: 'number', message: '占比必须为数字值'}
         ],
         percent1: [
           { required: true, message: '请填写占比'},
           { validator: checkPecent },
           { type: 'number', message: '占比必须为数字值'}
         ],
         cause: [
           { required: true, message: '请输入取消原因' },
           {max: 200, message: '取消原因不能超过200个字符'}
         ],
         cause1: [
           { required: true, message: '请输入延期原因' },
           {max: 200, message: '延期原因不能超过200个字符'}
         ],
         cause3: [
           { required: true, message: '请输入变更原因' },
           {max: 200, message: '变更原因不能超过200个字符'}
         ],
         cause4: [
           { required: true, message: '请输入自我评价'},
           {max: 200, message: '变更原因不能超过200个字符'}
         ],
         region1: [
           { required: true, message: '请选择关联项目' },
         ],
         date1: [
           { type: 'date', required: true, message: '请选择日期' }
         ],
         date2: [
           { type: 'date', required: true, message: '请选择日期' }
         ],
         date13: [
           { type: 'date', required: true, message: '请选择日期' }
         ],
         dateM: [
           { type: 'date', required: true, message: '请选择日期' }
         ],
         choseTimen: [
           { type: 'date', required: true, message: '请选择日期' }
         ],
         region: [
           { required: true, message: '请选择活动区域' }
         ],
         content: [
           { required: true, message: '请输入任务内容'},
           {max: 200, message: '任务内容不能超过200个字符'}

         ],
         value3: [
           { required: true, message: '请选择任务重要等级' },
         ],
         value13: [
           { required: true, message: '请选择任务重要等级' },
         ],
         imporLeveln: [
           { required: true, message: '请选择任务重要等级'},
         ],
         value4: [
           { required: true, message: '请选择任务类型', type:'number' },
         ],
         value14: [
           { required: true, message: '请选择任务类型',type:'number' },
         ],
         taskTypeF: [
           { required: true, message: '请选择任务类型',type:'number' },
         ],
         value5: [
           { required: true, message: '请选择任务执行人', type:'number' },
         ],
         value15: [
           { required: true, message: '请选择任务执行人', type:'number' },
         ],
         goUser: [
           { required: true, message: '请选择任务执行人', type:'number' },
         ],
         value6: [
           { required: true, message: '请选择自动回复时间'},
         ],
         value16: [
           { required: true, message: '请选择自动回复时间' },
         ],
         value7: [
           { required: true, message: '请输入公告内容' },
         ],
         value17: [
           { required: true, message: '请输入公告内容' },
         ],
       },
      };
    },
    components: {
//      Tab
    },
    created(){

    },
    mounted(){
      this.$nextTick(function () {
        window.addEventListener('scroll', this.onScroll)
      })
      if(localStorage.getItem("hideOrshow")){
        this.checkedCities1=JSON.parse(localStorage.getItem("hideOrshow"))
        this.checkedValue1=JSON.parse(localStorage.getItem("hideOrshow"))
      }
      this.listDepartmentalNumber()
      this.getUntreatTask1()
      this.getUntreatTask()
      //this.getData()
      this.getChangeTask()
      this.getCommentTask()
      this.getCommentTasked()
      this._listDraftTask()
      this.listAllUsers1()
      this.getProjectList1()
      this.listAllUsersT()
      //this.listGroupNumber()

      this.listAllUsers2()
      this.departmentList1()//获取部门
      this.tabs = ["新任务/待审核<span style='color:#C2453A;'> ("+this.total+")</span>", "变更任务/待审核<span style='color:#C2453A;'> ("+this.total1+")</span>","任务已完成待评价<span style='color:#C2453A;'> ("+this.total2+")</span>","任务未完成待评价<span style='color:#C2453A;'> ("+this.total3+")</span>","待完善<span style='color:#C2453A;'> ("+this.total4+")</span>"]
    },
    methods: {
      // 点击添加协助人
      adduser13() {
        this.dialogVisible25 = true
      },
      // 添加协助人模态框
      handleClose25(done) {
        this.dialogVisible25 = false
        this.$refs['ruleForm25'].resetFields();
      },
      // 添加协助人模态框
      submitForm25(formName1) {
        let self = this
        this.$refs[formName1].validate((valid) => {
          if (valid) {
            if (self.ruleForm25.username === self.executor31) {
              self.$notify.error({
                title: '错误',
                message: '执行人和协助人不能相同',
              });
              return
            }
            if (self.addUsers13.length > 0) {
              for (let item of self.addUsers13) {
                if (item.assistUserId === self.ruleForm25.username) {
                  self.$notify.error({
                    title: '错误',
                    message: '不能选择相同的协助人',
                  });
                  return
                }
              }
            }
            self.dialogVisible25 = false
            self.addUsers131 = []
            let obj = {
              assistUserId: self.ruleForm25.username,
              proportion: self.ruleForm25.percent1
            }
            self.addUsers131.push(obj)
            for (var i = 0; i < self.usersT.length; i++) {
              for (var j = 0; j < self.addUsers131.length; j++) {
                if (self.usersT[i].userId === self.addUsers131[j].assistUserId) {
                  self.brr13.push({
                    assistUserName: self.usersT[i].userName,
                    assistUserId: self.addUsers131[j].assistUserId,
                    proportion: self.addUsers131[j].proportion
                  })
                }
              }
            }
            console.log(self.brr13)
          } else {
            return false;
          }
        });
      },
      //    编辑任务
      editorTask(val,event){
        var e = event;
        if(e&&e.stopPropagation){
          e.stopPropagation()
        }else if(window.event){
          window.event.cancelBubble=true;
        }
        this.addUsers13=[]
        this.ruleForm31.name13 = "";
        this.ruleForm31.value15 = "";
        this.ruleForm31.value14="";
        this.ruleForm31.telObj13="";
        this.ruleForm31.value13="";
        this.ruleForm31.date13= "";
        this.ruleForm31.content13 = "";
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
            this.brr13 = crr
            this.ruleForm31.value7=res.data.projectId
            this.executor31 = res.data.executor.userId
            if(res.data.visibleRange===''){
              this.ruleForm31.value71 = []
            }else if(res.data.visibleRange.indexOf(',')<0){
              this.ruleForm31.value71 = JSON.parse('['+parseInt(res.data.visibleRange)+']')
            }else{
              this.ruleForm31.value71 = JSON.parse('[' + String(res.data.visibleRange.split(',')) + ']')
            }
          }
        })
      },
      resetForm31(formName) {
        this.$refs['ruleForm31'].resetFields();
        this.dialogVisible10 = false
      },
          //    确定编辑任务
      submitForm31(formName) {
        let self = this
        var value71 = this.ruleForm31.value71.join(',')
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
              projectId:this.ruleForm31.value7,
              planEndDate:time,
              grade: this.ruleForm31.value13,
              ptaskAssists: JSON.stringify(this.brr13),
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
              }else {
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
      handleClose10() {
        this.dialogVisible10 = false
        this.$refs['ruleForm31'].resetFields();
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
      //获取任务组
      _listByExecutor(userId,key,id){
        let self = this
        const params = {
          userId:userId
        }
        listByExecutor(params).then((res) => {
          if(res.code == ERR_OK) {
            if(key==1){
              this.ruleForm.value4 = ''
              if(id){
                this.ruleForm.value4 = id
              }
              this.optionType = res.data
              this.optionType.unshift({
                taskTypeId:'',
                taskTypeName: '请选择任务类型'
              })
            }else{
              this.ruleForm33.taskTypeF = ''
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
              this.ruleForm33.taskTypeF = ''
              this.optionType1 = res.data
              this.optionType1.unshift({
                taskTypeId:'',
                taskTypeName: '请选择任务类型'
              })
            }

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
      // 展开和收起
      packUp(index){
//        部门视图
        if(this.taskGroup){
          if(JSON.parse(localStorage.getItem("showData_dept"))){
            if(JSON.parse(localStorage.getItem("showData_dept")).length==this.totalDepart.length){
              console.log('333')
              this.showData=JSON.parse(localStorage.getItem("showData_dept"))
              this.showData[index].show=!this.showData[index].show
              localStorage.setItem("showData_dept", JSON.stringify(this.showData));
            }else{
              console.log(JSON.parse(localStorage.getItem("showData_dept")).length)
              console.log(this.totalDepart.length)
              console.log('333')
              this.showData=[]
              for(var i=0;i<this.totalDepart.length;i++){
                this.showData.push({
                  show:true
                })
              }
              console.log(this.showData)
              this.showData[index].show=!this.showData[index].show
              localStorage.setItem("showData_dept", JSON.stringify(this.showData));
            }
          }else{
            console.log('33322')
            this.showData=[]
            for(var i=0;i<this.totalDepart.length;i++){
                this.showData.push({
                  show:true
                })
            }
            console.log(this.showData)
            this.showData[index].show=!this.showData[index].show
            localStorage.setItem("showData_dept", JSON.stringify(this.showData));
          }
          const temp=JSON.parse(localStorage.getItem("showData_dept"))
          if(temp[index].show){
            this.$refs.mybox[index].innerText = '收起'
            this.$refs.mybox[index].parentNode.parentNode.childNodes[2].style.display = 'block'
          }
          if(!temp[index].show){
            this.$refs.mybox[index].innerText = '展开'
            this.$refs.mybox[index].parentNode.parentNode.childNodes[2].style.display = 'none'
          }

        }
        if(!this.taskGroup){
          if(JSON.parse(localStorage.getItem("showData_task"))){
            if(JSON.parse(localStorage.getItem("showData_task")).length==this.totalGrounp.length){
              this.showTask=JSON.parse(localStorage.getItem("showData_task"))
              this.showTask[index].show=!this.showTask[index].show
              localStorage.setItem("showData_task", JSON.stringify(this.showTask));
            }else{
              this.showTask=[]
              for(var i=0;i<this.totalGrounp.length;i++){
                this.showTask.push({
                  show:true
                })
              }
              this.showTask[index].show=!this.showTask[index].show
              localStorage.setItem("showData_task", JSON.stringify(this.showTask));
            }
          }else{
            this.showTask=[]
            for(var i=0;i<this.totalGrounp.length;i++){
              this.showTask.push({
                show:true
              })
            }
            this.showTask[index].show=!this.showTask[index].show
            localStorage.setItem("showData_task", JSON.stringify(this.showTask));
          }
          const temp=JSON.parse(localStorage.getItem("showData_task"))
          if(temp[index].show){
            this.$refs.mybox1[index].innerText = '收起'
            this.$refs.mybox1[index].parentNode.parentNode.childNodes[2].style.display = 'block'
          }
          if(!temp[index].show){
            this.$refs.mybox1[index].innerText = '展开'
            this.$refs.mybox1[index].parentNode.parentNode.childNodes[2].style.display = 'none'
          }
        }
      },
      packUp2(index){
        if(this.taskGroup) {
          if(JSON.parse(localStorage.getItem("showData_deptTask"))){
            if(JSON.parse(localStorage.getItem("showData_deptTask")).length==this.taskDept.length){
              this.showDataM=JSON.parse(localStorage.getItem("showData_deptTask"))
              this.showDataM[index].show=!this.showDataM[index].show
              localStorage.setItem("showData_deptTask", JSON.stringify(this.showDataM));
            }else{
              this.showDataM=[]
              for(var i=0;i<this.taskDept.length;i++){
                this.showDataM.push({
                  show:true
                })
              }
              this.showDataM[index].show=!this.showDataM[index].show
              localStorage.setItem("showData_deptTask", JSON.stringify(this.showDataM));
            }
          }else{
            this.showDataM=[]
            for(var i=0;i<this.taskDept.length;i++){
                this.showDataM.push({
                  show:true
                })
            }

            this.showDataM[index].show=!this.showDataM[index].show
            localStorage.setItem("showData_deptTask", JSON.stringify(this.showDataM));
          }
          const tempd=JSON.parse(localStorage.getItem("showData_deptTask"))
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
        if(this.taskGroup) {
          if(JSON.parse(localStorage.getItem("showData_deptSecond"))){
            if(JSON.parse(localStorage.getItem("showData_deptSecond")).length==this.taskSecond.length){
              this.showDataS=JSON.parse(localStorage.getItem("showData_deptSecond"))
              this.showDataS[index].show=!this.showDataS[index].show
              localStorage.setItem("showData_deptSecond", JSON.stringify(this.showDataS));
            }else{
              this.showDataS=[]
              for(var i=0;i<this.taskSecond.length;i++){
                this.showDataS.push({
                  show:true
                })
              }
              this.showDataS[index].show=!this.showDataS[index].show
              localStorage.setItem("showData_deptSecond", JSON.stringify(this.showDataS));
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
            localStorage.setItem("showData_deptSecond", JSON.stringify(this.showDataS));
          }
          const tempd=JSON.parse(localStorage.getItem("showData_deptSecond"))
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
      handleCurrentChange(val) {
        this.nowPageS = val
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
        this.getCommentTasked()
      },
      handleSizeChange3(val) {
        this.pageSize3 = val
        this.getCommentTasked()
      },
      handleCurrentChange4(val) {
        this.nowPage4 = val
        this._listDraftTask()
      },
      handleSizeChange4(val) {
        this.pageSize4 = val
        this._listDraftTask()
      },
      // tab切换
      tab(index) {
        this.num = index
      },
      //列表展开下拉
      startExpend(row, expanded){
        console.log('222')
        if(row.lastReplyStatus=='UNREAD'&&expanded==true){
          this.seeReplyContent(row.lastTaskReplyId)
        }
      },
      // 判断是否查看过该任务
      seeReplyContent(taskReplyId){
        const params={
          taskReplyId:taskReplyId
        }
        seeReplyStatus(params).then((res) => {
          if (res.code == ERR_OK) {

          }
        })
      },
      // 我的任务完成
      handleCloseS(done) {
        this.dialogVisibleS= false
        this.$refs['ruleFormS'].resetFields();
      },
      // 我的任务完成
      handleClose44(done) {
        this.dialogVisible44 = false
        this.$refs['ruleForm44'].resetFields();
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
      handleCheckedCitiesChange1(val) {
        this.checkedValue1 = val
        localStorage.setItem("hideOrshow",JSON.stringify(this.checkedValue1))
        this.listDepartmentalNumber()
        //this.listGroupNumber()
        //this.getUntreatTask1()
        this.getUntreatTask()
        //this.getData()
        this.getChangeTask()
        this.getCommentTask()
        this.getCommentTasked()
        this._listDraftTask()
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
                //self.getData()
                self.$refs[formName1].resetFields()
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
      selectType(val){
        this.ruleForm.taskTypeF = val
      },
      selectGoUser(val){
        this.ruleForm.goUser = val
        this._listByExecutor(val,2)
      },
      selectLevel(val){
        this.ruleForm.imporLeveln = val
      },
      _addTaskType(){
        var self = this
        let param={
          taskTypeName:this.ruleForm55.taskname,
          taskTypeScore:this.ruleForm55.score,
        }
        addEnabled(param).then(function (res) {
          if(res.code==ERR_OK){
            //self.getTaskType1()
            self.$notify({
              title: '成功',
              message: '添加任务组类型成功',
              type: 'success'
            });
          }else{
            self.$notify.error({
              title: '错误',
              message:res.msg,
            });
          }
        })
      },
      removeTodo(index){
         this.brr.splice(index, 1);
         this.addUsers.splice(index, 1);
      },
      choseRelateProject(val){
        this.ruleForm.value7 = val
      },
      choseTime(val){
        //this.ruleForm.value6 = val
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
              assistUserId:self.ruleForm5.username,
              proportion:self.ruleForm5.percent
            }
            self.addUsers.push(obj)
            this.brr = []
            for(var i=0;i<self.usersT.length;i++){
              for(var j=0;j<self.addUsers.length;j++){
                if(self.usersT[i].userId === self.addUsers[j].assistUserId){
                  self.brr.push(
                    {
                      username:self.usersT[i].userName,
                      proportion:self.addUsers[j].proportion
                    }
                  )
                }
              }
            }
          } else {
            return false;
          }
        });
      },
      resetForm15(formName1) {
        this.dialogVisible15 = false
        this.$refs[formName1].resetFields();
      },
      resetFormS(formName1) {
        this.dialogVisibleS = false
        this.$refs[formName1].resetFields();
      },
      // 点击添加协助人
      adduser(){
        this.dialogVisible15 = true
        // this.addusers = []
        // this.brr = []
      },
      // 点击等级变更
      levelChange(val,event){
        var e = event;
        if(e&&e.stopPropagation){
            e.stopPropagation()
        }else if(window.event){
            window.event.cancelBubble=true;
        }
        this.taskId = val
        this.dialogVisible13 = true
      },
      choseLevel3(val){
        this.ruleForm3.value3 = val
      },
      handleClose13(done) {
        this.dialogVisible13 = false
        this.$refs['ruleForm3'].resetFields();
      },
      submitForm13(formName1) {
        let self = this
        this.$refs[formName1].validate((valid) => {
          if (valid) {
            const params = {
              taskId:self.taskId,
              grade:self.ruleForm3.value3,
              reason:self.ruleForm3.cause3
            }
            changeTaskLevel(params).then((res) => {
              if(res.code == ERR_OK) {
                self.dialogVisible13 = false
                //self.listGroupNumber()
                let scrolled = document.documentElement.scrollTop || document.body.scrollTop
                self.listDepartmentalNumber(scrolled)
                //self.getData()
                self.$refs[formName1].resetFields()
                self.$notify({
                  title: '成功',
                  message: '申请变更任务重要等级已发送',
                  type: 'success'
                });
              }else if(res.code == 'exceedPersonal'){
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
      handleClose22(done) {
        this.dialogVisible22 = false
        this.dialogVisible11 = false
      },
      resetForm13(formName1) {
        this.dialogVisible13 = false
        this.$refs[formName1].resetFields();
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
              taskId:self.taskId,
              reason:self.ruleForm2.cause1,
              delayDate:time
            }
            delayTaskCause(params).then((res) => {
              if(res.code == ERR_OK) {
                self.dialogVisible12 = false
                self.$refs[formName1].resetFields();
                //self.listGroupNumber()
                let scrolled = document.documentElement.scrollTop || document.body.scrollTop
                self.listDepartmentalNumber(scrolled)
                //self.getData()
                self.$notify({
                  title: '成功',
                  message: '申请任务延期已发送',
                  type: 'success'
                });
              }else{
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
      delay (val,key,event) {
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
      choseRelateProject13(val){
        this.ruleForm.value17 = val
      },
      choseTime13(val){
        this.ruleForm.value16 = val
      },
      // 获取任务组视图数据
      listGroupNumber () {
        var checkedValue1 = this.checkedValue1.join(',')
        this.totalGrounp=[]
        this.taskInfoGroupClassifiedList=[]
        const params = {
          checkGrades:checkedValue1
        }
        listGrouped(params).then((res) => {
          if(res.code == ERR_OK) {
            this.totalGrounp = res.data
            this.taskStepName = []
            for(let item of res.data){
              this.taskStepName.push(item.taskGroupName)
            }
            for(let i=0;i<this.totalGrounp.length;i++){
              for(let j=0;j<this.totalGrounp[i].taskInfoGroupClassifiedList.length;j++){
                 this.taskInfoGroupClassifiedList.push(this.totalGrounp[i].taskInfoGroupClassifiedList[j])
               }
            }
            this.$nextTick(() => {
              //     读取存储 判断展开还是收起
              if(localStorage.getItem("taskView")=="true" || localStorage.getItem("taskView")=="false"){
                if(localStorage.getItem("taskView")=="true"){
                  this.taskGroup=true

                }
                if(localStorage.getItem("taskView")=="false"){
                  this.taskGroup=false
                }
                if(localStorage.getItem("taskView") == "true"){
                  this.taskName = '部门视图'
                  this.departNaV = '部门导航'
                  this.step = this.grounpStepName
                }else if(localStorage.getItem("taskView") == "false"){
                  this.taskName = '任务组视图'
                  this.departNaV = '任务组导航'
                  this.step = this.taskStepName
                }
              }
              if(JSON.parse(localStorage.getItem("showData_task"))){
                const data=JSON.parse(localStorage.getItem("showData_task"))
                for(let i=0;i<data.length;i++){
                  if(data[i].show){
                    this.$refs.mybox1[i].innerText = '收起'
                    this.$refs.mybox1[i].parentNode.parentNode.childNodes[2].style.display = 'block'
                  }
                  if(!data[i].show){
                    this.$refs.mybox1[i].innerText = '展开'
                    this.$refs.mybox1[i].parentNode.parentNode.childNodes[2].style.display = 'none'
                  }
                }
              }
                this.setSort_taskView(this.taskInfoGroupClassifiedList)
              })
          }
       })
      },
      // 获取部门视图数据
      listDepartmentalNumber (val) {
        var checkedValue1 = this.checkedValue1.join(',')
        console.log(checkedValue1)
        this.totalDepart=[];
        const params = {
          checkGrades:checkedValue1
        }
        listDepartmental(params).then((res) => {
          if(res.code == ERR_OK) {
            this.totalDepart = res.data
            this.grounpStepName = []
            for(let item of res.data){
              this.grounpStepName.push(item.deptName)
            }
            this.taskDept = []
            this.taskSecond = []
            if(this.totalDepart) {
              for(var i=0;i<this.totalDepart.length;i++) {
                for(var j=0;j<this.totalDepart[i].taskInfos.length;j++) {
                  for(var k=0;k<this.totalDepart[i].taskInfos[j].tasks.length;k++) {
                    this.taskDept.push(this.totalDepart[i].taskInfos[j].tasks[k])
                  }
                }
                for(var m=0;m<this.totalDepart[i].branchTaskInfoDeptmentalVos.length;m++) {
                  for(var n=0;n<this.totalDepart[i].branchTaskInfoDeptmentalVos[m].taskInfos.length;n++) {
                    for(var t=0;t<this.totalDepart[i].branchTaskInfoDeptmentalVos[m].taskInfos[n].tasks.length;t++) {
                      this.taskDept.push(this.totalDepart[i].branchTaskInfoDeptmentalVos[m].taskInfos[n].tasks[t])
                    }
                  }
                }
              }

              for(var i=0;i<this.totalDepart.length;i++) {
                for(var m=0;m<this.totalDepart[i].branchTaskInfoDeptmentalVos.length;m++) {
                  this.taskSecond.push(this.totalDepart[i].branchTaskInfoDeptmentalVos[m])
                }
              }
            }
            this.step = this.grounpStepName

            this.$nextTick(() => {
              if(JSON.parse(localStorage.getItem("showData_dept"))){
                const data=JSON.parse(localStorage.getItem("showData_dept"))
                for(let i=0;i<data.length;i++){
                  if(data[i].show){
                    this.$refs.mybox[i].innerText = '收起'
                    this.$refs.mybox[i].parentNode.parentNode.childNodes[2].style.display = 'block'
                  }
                  if(!data[i].show){
                    this.$refs.mybox[i].innerText = '展开'
                    this.$refs.mybox[i].parentNode.parentNode.childNodes[2].style.display = 'none'
                  }
                }
              }
            })
            this.$nextTick(() => {
              if(JSON.parse(localStorage.getItem("showData_deptTask"))){
                const data=JSON.parse(localStorage.getItem("showData_deptTask"))
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
            })
            this.$nextTick(() => {
              //     读取存储 判断展开还是收起
              if(localStorage.getItem("taskView")=="true" || localStorage.getItem("taskView")=="false"){
                if(localStorage.getItem("taskView")=="true"){
                  this.taskGroup=true
                }
                if(localStorage.getItem("taskView")=="false"){
                  this.taskGroup=false
                }
                if(localStorage.getItem("taskView") == "true"){
                  this.taskName = '部门视图'
                  this.departNaV = '部门导航'
                  this.step = this.grounpStepName
                }else if(localStorage.getItem("taskView") == "false"){
                  this.taskName = '任务组视图'
                  this.departNaV = '任务组导航'
                  this.step = this.taskStepName
                }
              }
              if(JSON.parse(localStorage.getItem("showData_deptSecond"))){
                const data=JSON.parse(localStorage.getItem("showData_deptSecond"))
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
              if(val){
                document.body.scrollTop = val
                document.documentElement.scrollTop = val
              }

              this.setSort_task2(this.totalDepart)
            })
          }
       })
      },
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
     //任务汇报对象
      getUsersObj1 (userId){
        const params = {
          userId:userId
        }
        this.optionsObj = []
        this.ruleForm.telObj = ''
        listReportingUsers(params).then((res) => {
          if(res.code == ERR_OK) {
            this.optionsObj = res.data
            for(let i in this.optionsObj){
              if(this.optionsObj[i].checked==true){
                this.ruleForm.telObj = this.optionsObj[i].userId
              }
            }
          }
       })
     },
      listAllUsers1() {
        listTaskExecutors().then((res) => {
          if(res.code == ERR_OK) {
            this.users = res.data
            for(let i in this.users){
             if(this.users[i].checked==true){
               this.ruleForm.value5 = this.users[i].userId
             }
           }
           this.getUsersObj1(this.ruleForm.value5)
           this._listByExecutor(this.ruleForm.value5,1)
          }
       })
      },
      // 添加任务回显示
      listAllUsers4(id) {
        listTaskExecutors().then((res) => {
          if(res.code == ERR_OK) {
            this.users = res.data
            for(let i in this.users){
             if(this.users[i].checked==true){
               this.ruleForm.value5 = this.users[i].userId
             }
           }
           this.getUsersObj1(this.ruleForm.value5)
           this._listByExecutor4(this.ruleForm.value5,1,id)
          }
       })
      },
      goLink(val){
        this.getUsersObj1(val)
        this._listByExecutor(val,1)
      },
      listAllUsersT() {
        listAllUsers().then((res) => {
          if(res.code == ERR_OK) {
            this.usersT = res.data
          }
       })
      },
      listAllUsers2() {
        listJustDeptLeaders().then((res) => {
          if(res.code == ERR_OK) {
            this.usersGo = res.data
          }
       })
      },
      // 获取任务类型
      // getTaskType1 () {
      //   getTaskType().then((res) => {
      //     if(res.code == ERR_OK) {
      //       this.optionType = res.data
      //       this.optionType.unshift({
      //        taskTypeId:'',
      //        taskTypeName: '请选择任务类型'
      //      })
      //     }
      //  })
      // },
      // 模态框的选择任务类型
      choseTaskType1(val) {
        this.ruleForm.value4 = val
      },
      // 模态框的选择任务类型
      choseTaskType13(val) {
        this.ruleForm.value14 = val
      },
      // 获取公司重点任务列表
      getData () {
        let self = this
        var checkedValue1 = this.checkedValue1.join(',')
        const params = {
          completed:false,
          checkGrades:checkedValue1
        }
        self.result=[];
        companyImportTask(params).then((res) => {
          if(res.code == ERR_OK) {
            self.result = res.data.companyTask
            self.cimpTaskSizeMy = res.data.cimpTaskSize
            self.dimpTaskSizeMy = res.data.dimpTaskSize
            this.$nextTick(() => {
              this.setSort_task1(self.result)
            })
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
            //this.getData()
          }
          if(num==3){
            let scrolled = document.documentElement.scrollTop || document.body.scrollTop
            this.listDepartmentalNumber(scrolled)
          }
          if(num==4){
             this.getChangeTask()
          }
          if(num==5){
            this.getCommentTasked()
          }
          if(num==6){
            this.getCommentTask()
          }
          if(num==7){
            //this.listGroupNumber()
          }
          if(num==10){
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
      setSort_task(result){
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
      setSort_taskTab1(result){
        const el = document.querySelectorAll('.taskNum1 .el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          onEnd: evt => {
            var oldIndex=evt.oldIndex;
            var newIndex=evt.newIndex;
            if(oldIndex>newIndex){
              if(newIndex==0){
                this._dragTask(this.resultTask1[oldIndex].taskId,'',this.resultTask1[newIndex].taskId,4)
              }else{
                this._dragTask(this.resultTask1[oldIndex].taskId,this.resultTask1[newIndex-1].taskId,this.resultTask1[newIndex].taskId,4)
              }
            }else{
              if(newIndex==0){
                this._dragTask(this.resultTask1[oldIndex].taskId,'',this.resultTask1[newIndex].taskId,4)
              }else if(newIndex==this.resultTask1.length-1){
                this._dragTask(this.resultTask1[oldIndex].taskId,this.resultTask1[newIndex].taskId,'',4)
              }else{
                if(newIndex>=this.resultTask1.length){
                  this._dragTask(this.resultTask1[oldIndex].taskId,this.resultTask1[newIndex-1].taskId,'',4)
                }else{
                  this._dragTask(this.resultTask1[oldIndex].taskId,this.resultTask1[newIndex].taskId,this.resultTask1[newIndex+1].taskId,4)
                }
              }
            }
          }
        })

      },
      setSort_taskTab2(result){
        const el = document.querySelectorAll('.taskNum2 .el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          onEnd: evt => {
            var oldIndex=evt.oldIndex;
            var newIndex=evt.newIndex;
            if(oldIndex>newIndex){
              if(newIndex==0){
                this._dragTask(this.resultTask3[oldIndex].taskId,'',this.resultTask3[newIndex].taskId,5)
              }else{
                this._dragTask(this.resultTask3[oldIndex].taskId,this.resultTask3[newIndex-1].taskId,this.resultTask3[newIndex].taskId,5)
              }
            }else{
              if(newIndex==0){
                this._dragTask(this.resultTask3[oldIndex].taskId,'',this.resultTask3[newIndex].taskId,5)
              }else if(newIndex==this.resultTask3.length-1){
                this._dragTask(this.resultTask3[oldIndex].taskId,this.resultTask3[newIndex].taskId,'',5)
              }else{
                if(newIndex>=this.resultTask3.length){
                  this._dragTask(this.resultTask3[oldIndex].taskId,this.resultTask3[newIndex-1].taskId,'',5)
                }else{
                  this._dragTask(this.resultTask3[oldIndex].taskId,this.resultTask3[newIndex].taskId,this.resultTask3[newIndex+1].taskId,5)
                }
              }
            }
          }
        })

      },
      setSort_taskTab3(result){
        const el = document.querySelectorAll('.taskNum3 .el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          onEnd: evt => {
            var oldIndex=evt.oldIndex;
            var newIndex=evt.newIndex;
            if(oldIndex>newIndex){
              if(newIndex==0){
                this._dragTask(this.resultTask2[oldIndex].taskId,'',this.resultTask2[newIndex].taskId,6)
              }else{
                this._dragTask(this.resultTask2[oldIndex].taskId,this.resultTask2[newIndex-1].taskId,this.resultTask2[newIndex].taskId,6)
              }
            }else{
              if(newIndex==0){
                this._dragTask(this.resultTask2[oldIndex].taskId,'',this.resultTask2[newIndex].taskId,6)
              }else if(newIndex==this.resultTask2.length-1){
                this._dragTask(this.resultTask2[oldIndex].taskId,this.resultTask2[newIndex].taskId,'',6)
              }else{
                if(newIndex>=this.resultTask2.length){
                  this._dragTask(this.resultTask2[oldIndex].taskId,this.resultTask2[newIndex-1].taskId,'',6)
                }else{
                  this._dragTask(this.resultTask2[oldIndex].taskId,this.resultTask2[newIndex].taskId,this.resultTask2[newIndex+1].taskId,6)
                }
              }
            }
          }
        })

      },
      //拖动排序公司重点任务
      setSort_task1(){
        const el = document.querySelectorAll('.companyImp .el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          onEnd: evt => {
            console.log(evt.oldIndex);
            var oldIndex=evt.oldIndex;
            var newIndex=evt.newIndex;
            if(oldIndex>newIndex){
              if(newIndex==0){
                this._dragTask(this.result[oldIndex].taskId,'',this.result[newIndex].taskId,2)
              }else{
                this._dragTask(this.result[oldIndex].taskId,this.result[newIndex-1].taskId,this.result[newIndex].taskId,2)
              }
            }else{
              if(newIndex==0){
                this._dragTask(this.result[oldIndex].taskId,'',this.result[newIndex].taskId,2)
              }else if(newIndex==this.result.length-1){
                this._dragTask(this.result[oldIndex].taskId,this.result[newIndex].taskId,'',2)
              }else{
                if(newIndex>=this.result.length){
                  this._dragTask(this.result[oldIndex].taskId,this.result[newIndex-1].taskId,'',2)
                }else{
                  this._dragTask(this.result[oldIndex].taskId,this.result[newIndex].taskId,this.result[newIndex+1].taskId,2)
                }
              }
            }
          }
        })

      },
     // 部门视图
      setSort_task2(){
        const el = document.querySelectorAll('.partView .el-table__body-wrapper > table > tbody')
        const childrenView = document.querySelectorAll('.childrenView .el-table__body-wrapper > table > tbody')
        console.log(el.length,childrenView.length)
        var arr = [];
        var brr = [];
        for(let m=0;m<this.totalDepart.length;m++) {
          for(let n=0;n<this.totalDepart[m].taskInfos.length;n++) {
            arr.push(this.totalDepart[m].taskInfos[n])
          }
        }

        for(let m=0;m<this.totalDepart.length;m++) {
          for(let n=0;n<this.totalDepart[m].branchTaskInfoDeptmentalVos.length;n++) {
            for(let j=0;j<this.totalDepart[m].branchTaskInfoDeptmentalVos[n].taskInfos.length;j++) {
              brr.push(this.totalDepart[m].branchTaskInfoDeptmentalVos[n].taskInfos[j])
            }
          }
        }

        for(let i=0;i<el.length;i++){
          this.sortable = Sortable.create(el[i], {
          onEnd: evt => {
            var oldIndex=evt.oldIndex;
            var newIndex=evt.newIndex;
            if(oldIndex>newIndex){
              if(newIndex==0){
                this._dragTask(arr[i].tasks[oldIndex].taskId,'',arr[i].tasks[newIndex].taskId,3)
              }
              else{
                this._dragTask(arr[i].tasks[oldIndex].taskId,arr[i].tasks[newIndex-1].taskId,arr[i].tasks[newIndex].taskId,3)
              }
            }else{
              if(newIndex==0){
                this._dragTask(arr[i].tasks[oldIndex].taskId,'',arr[i].tasks[newIndex].taskId,3)
              }else if(newIndex==arr[i].tasks.length-1){
                this._dragTask(arr[i].tasks[oldIndex].taskId,arr[i].tasks[newIndex].taskId,'',3)
              }
              else{
                if(newIndex>=arr[i].tasks.length){
                  this._dragTask(arr[i].tasks[oldIndex].taskId,arr[i].tasks[newIndex-1].taskId,'',3)
                }else{
                  this._dragTask(arr[i].tasks[oldIndex].taskId,arr[i].tasks[newIndex].taskId,arr[i].tasks[newIndex+1].taskId,3)
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
                this._dragTask(brr[i].tasks[oldIndex].taskId,'',brr[i].tasks[newIndex].taskId,3)
              }
              else{
                this._dragTask(brr[i].tasks[oldIndex].taskId,brr[i].tasks[newIndex-1].taskId,brr[i].tasks[newIndex].taskId,3)
              }
            }else{
              if(newIndex==0) {
                this._dragTask(brr[i].tasks[oldIndex].taskId,'',brr[i].tasks[newIndex].taskId,3)
              }else if(newIndex==brr[i].tasks.length-1){
                this._dragTask(brr[i].tasks[oldIndex].taskId,brr[i].tasks[newIndex].taskId,'',3)
              }
              else{
                if(newIndex>=brr[i].tasks.length) {
                  this._dragTask(brr[i].tasks[oldIndex].taskId,brr[i].tasks[newIndex-1].taskId,'',3)
                }else{
                  this._dragTask(brr[i].tasks[oldIndex].taskId,brr[i].tasks[newIndex].taskId,brr[i].tasks[newIndex+1].taskId,3)
                }
              }
            }

          }
        })
        }
      },
//      任务组视图
      setSort_taskView(){
        const el = document.querySelectorAll('.taskView .el-table__body-wrapper > table > tbody')
        for(let i=0;i<el.length;i++){
          this.sortable = Sortable.create(el[i], {
            onEnd: evt => {
              var oldIndex=evt.oldIndex;
              var newIndex=evt.newIndex;
              if(oldIndex>newIndex){
                if(newIndex==0){
                  this._dragTask(this.taskInfoGroupClassifiedList[i].tasks[oldIndex].taskId,'',this.taskInfoGroupClassifiedList[i].tasks[newIndex].taskId,7)
                }else{
                  this._dragTask(this.taskInfoGroupClassifiedList[i].tasks[oldIndex].taskId,this.taskInfoGroupClassifiedList[i].tasks[newIndex-1].taskId,this.taskInfoGroupClassifiedList[i].tasks[newIndex].taskId,7)
                }
              }else{
                if(newIndex==0){
                  this._dragTask(this.taskInfoGroupClassifiedList[i].tasks[oldIndex].taskId,'',this.taskInfoGroupClassifiedList[i].tasks[newIndex].taskId,7)
                }else if(newIndex==this.taskInfoGroupClassifiedList[i].tasks.length-1){
                  this._dragTask(this.taskInfoGroupClassifiedList[i].tasks[oldIndex].taskId,this.taskInfoGroupClassifiedList[i].tasks[newIndex].taskId,'',7)
                }else{
                  if(newIndex>=taskInfoGroupClassifiedList[i].tasks.length){
                    this._dragTask(this.taskInfoGroupClassifiedList[i].tasks[oldIndex].taskId,this.taskInfoGroupClassifiedList[i].tasks[newIndex-1].taskId,'',7)
                  }else{
                    this._dragTask(this.taskInfoGroupClassifiedList[i].tasks[oldIndex].taskId,this.taskInfoGroupClassifiedList[i].tasks[newIndex].taskId,this.taskInfoGroupClassifiedList[i].tasks[newIndex+1].taskId,7)
                  }
                }
              }
            }
          })
        }
      },
      completeMass(val){
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
      completeRate(val){
        this.ruleForm8.rate = val
        this.ruleForm8.rateContent = val
      },
      //回复消息
      replyTask(index,val,event,keys){
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
              //self.getData()
              //self.listGroupNumber()
              if(keys){
                let scrolled = document.documentElement.scrollTop || document.body.scrollTop
                self.listDepartmentalNumber(scrolled)
              }else{
                self.getUntreatTask()
                self.getChangeTask()
                self.getCommentTask()
                self.getCommentTasked()
                self._listDraftTask()
              }
              self.$notify({
                title: '成功',
                message: '恭喜你，回复成功',
                type: 'success'
              });
            }else{
              this.$notify.error({
                title: '错误',
                message: res.msg
              });
            }
         })
        }
      },
      // 获取（新任务/待审核 ）数据
      getUntreatTask(){
        this.result1=[]
        //this.total=0;
        var checkedValue1 = this.checkedValue1.join(',')
        const params = {
          nowPage:this.nowPageS,
          pageShow:this.pageSize,
          checkGrades:checkedValue1
        }
        listNewTaskPending(params).then((res) => {
          if(res.code == ERR_OK) {
            if(res.data.result){
              this.result1 = res.data.result
            }
            this.total = res.data.totalCount
            this.tabs = ["新任务/待审核<span style='color:#C2453A;'> ("+this.total+")</span>", "变更任务/待审核<span style='color:#C2453A;'> ("+this.total1+")</span>","任务已完成待评价<span style='color:#C2453A;'> ("+this.total2+")</span>","任务未完成待评价<span style='color:#C2453A;'> ("+this.total3+")</span>","待完善<span style='color:#C2453A;'> ("+this.total4+")</span>"]
            this.$nextTick(() => {
              this.setSort_task(this.result1)
            })
          }
       })
      },
      // 获取（变更任务/待审核）数据
      getChangeTask(){
        this.resultTask1=[]
        var checkedValue1 = this.checkedValue1.join(',')
        const params = {
          nowPage:this.nowPage1,
          pageShow:this.pageSize1,
          checkGrades:checkedValue1
        }
        listChangeTaskPending(params).then((res) => {
          if(res.code == ERR_OK) {
            this.resultTask1 = res.data.result
            this.total1 = res.data.totalCount
            this.tabs = ["新任务/待审核<span style='color:#C2453A;'> ("+this.total+")</span>", "变更任务/待审核<span style='color:#C2453A;'> ("+this.total1+")</span>","任务已完成待评价<span style='color:#C2453A;'> ("+this.total2+")</span>","任务未完成待评价<span style='color:#C2453A;'> ("+this.total3+")</span>","待完善<span style='color:#C2453A;'> ("+this.total4+")</span>"]
            this.$nextTick(() => {
              this.setSort_taskTab1(this.resultTask1)
            })
          }
       })
      },
      // 获取（任务已完成待评价）
      getCommentTask(){
        this.resultTask2=[]
        var checkedValue1 = this.checkedValue1.join(',')
        const params = {
          nowPage:this.nowPage2,
          pageShow:this.pageSize2,
          checkGrades:checkedValue1
        }
        listCommentTaskPending(params).then((res) => {
          if(res.code == ERR_OK) {
            this.resultTask2 = res.data.result
            this.total2 = res.data.totalCount
            this.$nextTick(() => {
              this.setSort_taskTab3(this.resultTask2)
            })
            this.tabs = ["新任务/待审核<span style='color:#C2453A;'> ("+this.total+")</span>", "变更任务/待审核<span style='color:#C2453A;'> ("+this.total1+")</span>","任务已完成待评价<span style='color:#C2453A;'> ("+this.total2+")</span>","任务未完成待评价<span style='color:#C2453A;'> ("+this.total3+")</span>","待完善<span style='color:#C2453A;'> ("+this.total4+")</span>"]
          }
       })
      },
      // 任务未完成待评价(评价已完成)
      getCommentTasked(){
        this.resultTask3=[]
        var checkedValue1 = this.checkedValue1.join(',')
        const params = {
          nowPage:this.nowPage3,
          pageShow:this.pageSize3,
          checkGrades:checkedValue1
        }
        listCommentTaskPendingUnCompleted(params).then((res) => {
          if(res.code == ERR_OK) {
            if(res.data){
              this.resultTask3 = res.data.result
              this.total3 = res.data.totalCount
              this.$nextTick(() => {
                this.setSort_taskTab2(this.resultTask3)
              })
            }
            this.tabs = ["新任务/待审核<span style='color:#C2453A;'> ("+this.total+")</span>", "变更任务/待审核<span style='color:#C2453A;'> ("+this.total1+")</span>","任务已完成待评价<span style='color:#C2453A;'> ("+this.total2+")</span>","任务未完成待评价<span style='color:#C2453A;'> ("+this.total3+")</span>","待完善<span style='color:#C2453A;'> ("+this.total4+")</span>"]
          }
       })
      },
      // 任务未完成待评价(评价已完成)
      _listDraftTask(){
        this.resultTask4=[]
        var checkedValue1 = this.checkedValue1.join(',')
        const params = {
          nowPage:this.nowPage4,
          pageShow:this.pageSize4,
          checkGrades:checkedValue1
        }
        listDraftTask(params).then((res) => {
          if(res.code == ERR_OK) {
            if(res.data){
              this.resultTask4 = res.data.result
              this.total4 = res.data.totalCount
              this.$nextTick(() => {
                this.setSort_Tab5()
              })
            }
            this.tabs = ["新任务/待审核<span style='color:#C2453A;'> ("+this.total+")</span>", "变更任务/待审核<span style='color:#C2453A;'> ("+this.total1+")</span>","任务已完成待评价<span style='color:#C2453A;'> ("+this.total2+")</span>","任务未完成待评价<span style='color:#C2453A;'> ("+this.total3+")</span>","待完善<span style='color:#C2453A;'> ("+this.total4+")</span>"]
          }
       })
      },
    //    待完善
     setSort_Tab5(){
      const el = document.querySelectorAll('.taskNum4 .el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        onEnd: evt => {
          var oldIndex=evt.oldIndex;
          var newIndex=evt.newIndex;
          if(oldIndex>newIndex){
            if(newIndex==0){
              this._dragTask(this.resultTask4[oldIndex].taskId,'',this.resultTask4[newIndex].taskId,10)
            }else{
              this._dragTask(this.resultTask4[oldIndex].taskId,this.resultTask4[newIndex-1].taskId,this.resultTask4[newIndex].taskId,10)
            }
          }else{
            if(newIndex==0){
              this._dragTask(this.resultTask4[oldIndex].taskId,'',this.resultTask4[newIndex].taskId,10)
            }else if(newIndex==this.resultTask4.length-1){
              this._dragTask(this.resultTask4[oldIndex].taskId,this.resultTask4[newIndex].taskId,'',10)
            }else{
              if(newIndex>=this.resultTask4.length){
                this._dragTask(this.resultTask4[oldIndex].taskId,this.resultTask4[newIndex-1].taskId,'',10)
              }else{
                this._dragTask(this.resultTask4[oldIndex].taskId,this.resultTask4[newIndex].taskId,this.resultTask4[newIndex+1].taskId,10)
              }
            }
          }
        }
      })
    },
      // 待处理任务数和总任务数等（获取头部统计的数据）
      getUntreatTask1(){
        getAllStatistics().then((res) => {
          if(res.code == ERR_OK) {
            this.dimpTaskSize = res.data.dimpTaskSize
            this.cimpTaskSize = res.data.cimpTaskSize
            this.pimpTaskSize = res.data.pimpTaskSize
            this.pcommonTaskSize = res.data.pcommonTaskSize
            this.totalTaskSize = res.data.totalTaskSize
            this.pendingTaskSize = res.data.pendingTaskSize
          }
       })
      },
      addTaskType () {
        this.dialogVisible5 = true
      },
      handleClose5 (){
        this.dialogVisible5 = false
        this.$refs['ruleForm55'].resetFields();
      },
      submitForm5(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          this._addTaskType()
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
      // 部门视图和任务组视图切换
      tabTask () {
        this.taskGroup = !this.taskGroup
        localStorage.setItem("taskView",this.taskGroup)
        if(localStorage.getItem("taskView") == "true"){
          this.taskName = '部门视图'
          this.departNaV = '部门导航'
          this.step = this.grounpStepName
        }else if(localStorage.getItem("taskView") == "false"){
          this.taskName = '任务组视图'
          this.departNaV = '任务组导航'
          this.step = this.taskStepName
        }
      },
      assignTask () {
        this.dialogVisible3 = true
        //this.getTaskType1()
        this.listAllUsers1()
      },
      // 滚动隐藏返回顶部按钮
      onScroll () {
        let scrolled = document.documentElement.scrollTop || document.body.scrollTop
        if(scrolled>=200){
          this.show = true
        }else{
          this.show = false
        }
      },
      //返回顶部
      goTop(){
        let distance = document.documentElement.scrollTop || document.body.scrollTop
        let total = 0
        let step = total / 50
        let newTotal = distance - total
        step = newTotal / 50
        smoothUp()
        function smoothUp () {
          if (distance > total) {
            distance -= step
  　　　　　　　document.body.scrollTop = distance
            document.documentElement.scrollTop = distance
            setTimeout(smoothUp, 10)
          } else {
            document.body.scrollTop = total
            document.documentElement.scrollTop = total
          }
        }
      },
      // 锚点导航
      jump (index) {
        if(this.departNaV=='部门导航'){
          var jump = document.querySelectorAll('.d_jump')
          var total = jump[index].offsetTop
        }else{
          var jump = document.querySelectorAll('.d_jump1')
          var total = jump[index].offsetTop
        }
        let distance = document.documentElement.scrollTop || document.body.scrollTop
        // 平滑滚动，时长500ms，每10ms一跳，共50跳
        let step = total / 50
        if (total > distance) {
          smoothDown()
        } else {
          let newTotal = distance - total
          step = newTotal / 50
          smoothUp()
        }
        function smoothDown () {
          if (distance < total) {
            distance += step
  　　　　　　　document.body.scrollTop = distance
            document.documentElement.scrollTop = distance
            setTimeout(smoothDown, 10)
          } else {
            document.body.scrollTop = total
            document.documentElement.scrollTop = total
          }
        }
        function smoothUp () {
          if (distance > total) {
            distance -= step
  　　　　　　　document.body.scrollTop = distance
            document.documentElement.scrollTop = distance
            setTimeout(smoothUp, 10)
          } else {
            document.body.scrollTop = total
            document.documentElement.scrollTop = total
          }
        }
      },
      mindTask () {
        this.ruleForm.name = ''
        this.ruleForm.value4 = ''
        this.ruleForm.value3 = ''
        this.ruleForm.date1 = ''
        this.ruleForm.content = ''
        this.dialogVisible =true
        this.addUsers = []
        this.brr = []
        this.ruleForm.value7=""
        this.ruleForm.value71=[]
        //this.getTaskType1()
        this.getProjectList1()
        //this.getUsersObj1()
        this.listAllUsers1()
      },
      mindTask1 (id) {
        this.ruleForm.name = ''
        //this.ruleForm.value4 = ''
        this.ruleForm.value3 = ''
        this.ruleForm.date1 = ''
        this.ruleForm.content = ''
        this.dialogVisible =true
        this.addUsers = []
        this.brr = []
        this.ruleForm.value7=""
        this.ruleForm.value71=[]
        //this.getTaskType1()
        this.getProjectList1()
        //this.getUsersObj1()
        this.listAllUsers4(id)
      },
      uncomplete () {
        this.show1=true
        this.show2=false
        this.isActive = true
        this.isActive1 = false
      },
      completed() {
        this.isActive = false
        this.isActive1 = true
        this.show1=false
        this.show2=true
      },
      handleClose3 (){
        this.dialogVisible3 = false
        this.$refs['ruleForm33'].resetFields();
      },
      submitForm3(formName) {
        let self = this
        //console.log(this.ruleForm.value5 )
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let d = new Date(self.ruleForm33.choseTimen)
            let time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
            const params = {
              title:self.ruleForm33.titlen,
              taskTypeId:self.ruleForm33.taskTypeF,
              executorId:self.ruleForm33.goUser,
              grade:self.ruleForm33.imporLeveln,
              planEndDate:time
            }
            assignTaskManage(params).then((res) => {
              if(res.code == ERR_OK) {
                self.dialogVisible3 = false
                self.getUntreatTask()
                self.getUntreatTask1()
                let scrolled = document.documentElement.scrollTop || document.body.scrollTop
                self.listDepartmentalNumber(scrolled)
                //self.listGroupNumber()
                self.$refs[formName].resetFields()
                self.$refs['ruleForm33'].resetFields();
                self.$notify({
                  title: '成功',
                  message: '分配任务成功',
                  type: 'success'
                });
              }else{
                this.$refs['ruleForm33'].resetFields();
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
      resetForm3(formName) {
        this.dialogVisible3 = false
        this.$refs[formName].resetFields();
      },
      completeModal1(val,event){
        var e = event;
        if(e&&e.stopPropagation){
            e.stopPropagation()
        }else if(window.event){
            window.event.cancelBubble=true;
        }
        this.taskId = val
        this.dialogVisible8 = true
      },
      // 完成任务
      completeModal(val,event){
        var e = event;
        if(e&&e.stopPropagation){
            e.stopPropagation()
        }else if(window.event){
            window.event.cancelBubble=true;
        }
        this.taskId = val
        this.dialogVisible8 = true
         this.ruleForm8.rate=""
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
            //self.getData()
            self.getUntreatTask()
            self.getUntreatTask1()
            let scrolled = document.documentElement.scrollTop || document.body.scrollTop
            self.listDepartmentalNumber(scrolled)
            //self.listGroupNumber()
            self.getChangeTask()
            self.getCommentTask()
            self.getCommentTasked()
            self._listDraftTask()
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
      handleClose8 (){
        this.dialogVisible8 = false
        this.$refs['ruleForm8'].resetFields();
      },
      submitForm8(formName) {
        let self =this
        this.$refs[formName].validate((valid) => {
          if (valid) {
          const params =　{
            taskId:self.taskId,
            finishQuality:self.ruleForm8.mass,
            changeContent:self.ruleForm8.rateContent
          }
          assessTask(params).then((res) => {
            if(res.code == ERR_OK) {
              self.dialogVisible8 = false
              //self.getData()
              self.getUntreatTask()
              self.getUntreatTask1()
              let scrolled = document.documentElement.scrollTop || document.body.scrollTop
              self.listDepartmentalNumber(scrolled)
              //self.listGroupNumber()
              self.getChangeTask()
              self.getCommentTask()
              self.getCommentTasked()
              self._listDraftTask()
              self.$refs[formName].resetFields()
              this.$notify({
                title: '成功',
                message: '评价完成',
                type: 'success'
              });
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
      resetForm8(formName) {
        this.dialogVisible8 = false
        this.$refs[formName].resetFields();
      },
      // 等级变更
      levelBecome () {
        this.dialogVisible7 = true
      },
      handleClose7 (){
        this.dialogVisible7 = false
        this.$refs['ruleForm7'].resetFields();
      },
      submitForm7(formName) {
        let self = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
          const params =　{
            taskId:self.taskId,
            changeStatus:'PASS',
            changeReason:self.ruleForm7.becomCuase1,
            changeContent:self.ruleForm7.grades,
            taskChangeId:self.taskChangeId
            //rejectReason:self.ruleForm7.becomCuase2
          }
          approvalTask(params).then((res) => {
            if(res.code == ERR_OK) {
              self.dialogVisible7 = false
              self.getUntreatTask()
              self.getUntreatTask1()
              let scrolled = document.documentElement.scrollTop || document.body.scrollTop
              self.listDepartmentalNumber(scrolled)
              //self.listGroupNumber()
              self.$refs[formName].resetFields()
              this.$notify.info({
                title: '提示',
                message: '审核完成'
              });
            }else if(res.code == 'exceedPersonal'){
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
      resetForm7(formName) {
        let self = this
        this.dialogVisibleS = true
      },
      checkTaskSure1(){
        var self = this
        const params =　{
          taskId:self.taskId,
          changeStatus:'REJECT',
          changeReason:self.ruleForm7.becomCuase1,
          changeContent:self.ruleForm7.grades,
          taskChangeId:self.taskChangeId,
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
            self.listDepartmentalNumber(scrolled)
            //self.listGroupNumber()
            self.$refs['ruleFormS'].resetFields()
            this.$notify.info({
              title: '提示',
              message: '审核不通过'
            });
          }else if(res.code == 'exceedPersonal'){
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
      },
      checkTaskSure2(){
        var self = this
          const params =　{
            taskId:self.taskId,
            changeStatus:'REJECT',
            changeReason:self.ruleForm16.cancleCause,
            taskChangeId:self.taskChangeId,
            rejectReason:self.ruleFormS.becomCuase2
          }
          approvalTask(params).then((res) => {
            if(res.code == ERR_OK) {
              self.dialogVisible6 = false
              self.dialogVisibleS = false
              self.getUntreatTask()
              self.getUntreatTask1()
              self.getChangeTask()
              let scrolled = document.documentElement.scrollTop || document.body.scrollTop
              self.listDepartmentalNumber(scrolled)
              //self.listGroupNumber()
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
          var self = this
          let d = new Date(self.ruleForm14.date2)
          let time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
          const params =　{
            taskId:self.taskId,
            changeStatus:'REJECT',
            changeReason:self.ruleForm14.delayCause,
            taskChangeId:self.taskChangeId,
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
              let scrolled = document.documentElement.scrollTop || document.body.scrollTop
              self.listDepartmentalNumber(scrolled)
              //self.listGroupNumber()
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
      //取消审核
      cancleCheck () {
        this.dialogVisible6 = true
      },
      handleClose6 (){
        this.dialogVisible6 = false
        this.$refs['ruleForm16'].resetFields();
      },
      submitForm6(formName) {
        let self = this
        this.$refs[formName].validate((valid) => {
          if (valid) {

          const params =　{
            taskId:self.taskId,
            changeStatus:'PASS',
            changeReason:self.ruleForm16.cancleCause,
            taskChangeId:self.taskChangeId,
            //rejectReason:self.ruleForm16.becomCuase3
          }
          approvalTask(params).then((res) => {
            if(res.code == ERR_OK) {
              self.dialogVisible6 = false
              self.getUntreatTask()
              self.getUntreatTask1()
              let scrolled = document.documentElement.scrollTop || document.body.scrollTop
              self.listDepartmentalNumber(scrolled)
              //self.listGroupNumber()
              self.$refs[formName].resetFields()
              self.$notify.info({
                title: '提示',
                message: '审核通过'
              });
            }else{
              self.$notify.error({
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
      resetForm6(formName) {
        let self = this
        this.dialogVisibleS = true
      },
      lateCheck (val,keys,dates,become,event) {
        //this.dialogVisible4 = true
        this.taskId = keys
        var e = event;
        if(e&&e.stopPropagation){
            e.stopPropagation()
        }else if(window.event){
            window.event.cancelBubble=true;
        }
        const params = {
          id:keys
        }
        if(become==1){
          this.becomeTitle='申请新任务重要等级'
        }else if(become==2){
          this.becomeTitle='申请变更任务重要等级'
        }
        if(val=='GRADE'){
          this.dialogVisible7 = true
          getChangeType(params).then((res) => {
            if(res.code == ERR_OK) {
              this.ruleForm7.grades = res.data.changeContent
              this.ruleForm7.becomCuase1 = res.data.changeReason
              this.taskChangeId = res.data.taskChangeId
            }else{
              this.$notify.error({
                title: '错误',
                message: res.msg
              });
            }
          })
        }else if(val=='DELAY'){
          this.dialogVisible4 = true
          var date = new Date(Date.parse(dates.replace(/-/g, "/")))
          date = date.getTime()
          this.pickerOptions1 = {
            disabledDate(time) {
              return time.getTime() - 8.64e7 < date;
            }
          }
          getChangeType(params).then((res) => {
            if(res.code == ERR_OK) {
              this.ruleForm14.date2 = new Date(res.data.changeContent)
              this.ruleForm14.delayCause = res.data.changeReason
              this.taskChangeId = res.data.taskChangeId
            }else{
              this.$notify.error({
                title: '错误',
                message:res.msg
              });
            }
          })
        }else if(val=='CANCLE'){
          this.dialogVisible6 = true
          getChangeType(params).then((res) => {
            if(res.code == ERR_OK) {
              this.ruleForm16.cancleCause = res.data.changeReason
              this.taskChangeId = res.data.taskChangeId
            }else{
              this.$notify.error({
                title: '错误',
                message:res.msg
              });
            }
          })
        }
      },
      //分配任务
      handleClose4 (){
        this.dialogVisible4 = false
        this.$refs['ruleForm14'].resetFields();
      },
      submitForm4(formName) {
        let self = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
          let d = new Date(self.ruleForm14.date2)
          let time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
          const params =　{
            taskId:self.taskId,
            changeStatus:'PASS',
            changeReason:self.ruleForm14.delayCause,
            taskChangeId:self.taskChangeId,
            //rejectReason:self.ruleForm14.becomCuase4,
            changeContent:time
          }
          approvalTask(params).then((res) => {
            if(res.code == ERR_OK) {
              self.dialogVisible4 = false
              self.getUntreatTask()
              self.getUntreatTask1()
              let scrolled = document.documentElement.scrollTop || document.body.scrollTop
              self.listDepartmentalNumber(scrolled)
              //self.listGroupNumber()
              self.getChangeTask()
              self.getCommentTask()
              self.getCommentTasked()
              self._listDraftTask()
              self.$refs[formName].resetFields()
              self.$notify.info({
                title: '提示',
                message: '审核通过'
              });
            }else{
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
      resetForm4(formName) {
        let self = this
        self.dialogVisibleS = true
      },
      handleClose(done) {
        this.dialogVisible = false
        this.$refs['ruleForm'].resetFields();
      },
      // 保存草稿
      saveDrafts(formName) {
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
        var value71 = this.ruleForm.value71.join(',');
        var time;
        if(self.ruleForm.date1=='') {
          time = ''
        }else{
          let d = new Date(self.ruleForm.date1)
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
          if(res.code == ERR_OK) {
            self.dialogVisible = false
            self._listDraftTask()
            self.$refs[formName].resetFields()
            this.$notify({
              title: '成功',
              message: '保存草稿成功',
              type: 'success'
            });
             this.$refs['ruleForm'].resetFields();
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
        if(this.ruleForm.value4==''){
          this.$notify.error({
            title: '错误',
            message:'请选择任务类型'
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
        if(this.ruleForm.content.trim().length>200){
          this.$notify.error({
            title: '错误',
            message:'任务内容不能超过200个字符'
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
          //repeatMode:self.ruleForm.value6,
          content:self.ruleForm.content
        }
        publishTask(params).then((res) => {
          if(res.code == ERR_OK) {
            self.dialogVisible = false
            self.getUntreatTask()
            self.getUntreatTask1()
            self.getChangeTask()
            let scrolled = document.documentElement.scrollTop || document.body.scrollTop
            self.listDepartmentalNumber(scrolled)
            //self.listGroupNumber()
            //self.getData()
            self.$refs[formName].resetFields()
            this.$notify({
              title: '成功',
              message: '发起任务成功',
              type: 'success'
            });
             this.$refs['ruleForm'].resetFields();
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
                //self.getData()
                self.getUntreatTask()
                self.getUntreatTask1()
                let scrolled = document.documentElement.scrollTop || document.body.scrollTop
                self.listDepartmentalNumber(scrolled)
                //self.listGroupNumber()
                self.$refs[formName1].resetFields()
                this.$notify({
                  title: '成功',
                  message: '申请取消原因已发送',
                  type: 'success'
                });
                this.$refs[formName1].resetFields()
              }else{
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
      iconEnter2(){
        this.$refs.displayShow2.style.display = 'block'
      },
      iconLeave2(){
        this.$refs.displayShow2.style.display = 'none'
      },
      iconEnter(){
        this.$refs.displayShow.style.display = 'block'
      },
      iconLeave(){
        this.$refs.displayShow.style.display = 'none'
      },
      iconEnter1(){
        this.$refs.displayShow1.style.display = 'block'
      },
      iconLeave1(){
        this.$refs.displayShow1.style.display = 'none'
      }

    },
  };
</script>
<style lang="scss"  scoped>
  // .slide-enter-active, .slide-leave-active{
  //   transition: all 0.3s ease
  // }
  // .slide-enter, .slide-leave-to{
  //   transform: translate3d(100%, 0, 0)
  // }
  .task-manage{
    margin-bottom: 40px;
  }
  .task-list{
    //background: #EFEFEF;
    box-shadow: 0 2px 11px 0 rgba(0,0,0,0.07);
    border-radius: 6px;
  }
  .take-task{
    height: 91px;
    margin: 0 auto;
    // background-color: #fff;
    margin: 0 auto;
  }
  .take-left{
    width: auto;
    height: 46px;
    float: left;

  }
  .take-top-wrapper{
    height: 46px;
    width: 100%;
    opacity: 0.99;

    background: rgba(217,53,56,0.10);
  }
  .take-top{
    height: 46px;
    width: 265px;
    font-size: 18px;
    font-weight: bold;
    color: #333333;
    margin-left: 34px;
    line-height: 46px;

  }
  .take-bottom{
    height: 35px;
    // width: 265px;
    line-height: 35px;
    font-size: 14px;
    color: #FFFFFF;
    background: #fff;
    padding-top: 10px;
  }
  .take-bottom .task-item:first-child{
    margin-right: 5px;
  }
  .take-bottom .task-item{
      width: 130px;
      float: left;
      text-align: center;
      background: #D8D8D8;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      cursor: pointer;
  }
  .take-bottom .task-item.active{
    background: #D93437;

  }
  .take-right{
    width: 84px;
    height:30px;
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
  }
  .title-right{
  float: left;
  margin-left: 35px;
  }
  .task-filter{
    float: left;
    height:35px;
    font-size: 12px;
    color: #333333;
    line-height: 35px;
    margin-left: 64px;
  }
  .role-num{
    float: left;
  }
  .role-num1{
    margin-left: 20px;
  }
  .content-num{
    width: 171px;
    height:24px;
    padding: 0 10px;
    background: #FFFFFF;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 4px;
  }
  .search-button{
    float: left;
    text-align: center;
    line-height:24px;
    color: #D93437;
    border: 1px solid #D83436;
    border-radius: 4px;
    width: 90px;
    height:24px;
    margin-top: 4px;
    margin-left: 25px;
    cursor: pointer;
  }
  .dialog-footer button{
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
  .dialog-footer button:last-child{
    color: #D93437;
    border: 1px solid #D83436;
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
  .untreatTask-wrapper{
    background: #fff;
    height: 46px;
    padding-top: 4px;
  }
  .untreatTask{

    height: 46px;
    line-height: 46px;
    opacity: 0.99;
    border: 1px solid rgba(0,0,0,0.12);
    // border-bottom: 1px solid rgba(0,0,0,0.12);
    font-size: 14px;
    color: #333333;
    background: #fff;
  }
.untreatTask ul li{
  float: left;
  height:46px;
  margin-left: 69px;
  }
  .untreatTask ul li:first-child{
    margin-left: 32px;
  }
  .untreatTask-button{
    background: #fff;
    margin-top: 10px;
  }
  .important-task{
    height:35px;
    line-height: 35px;
    font-size: 14px;
    color: #333333;
  }
  .important-task ul li{
    float: left;
  }
  .important-task ul li:first-child{
    font-weight: bold;
    width: 130px;
    text-align: center;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid rgba(0,0,0,0.12);
    border-bottom: none;
  }
  .important-task ul li:nth-child(2){
    margin-left: 30px;
    margin-right: 70px;
  }
  .nav-wrapper{
    position: fixed;
    right: 0;
    top:92px;
    z-index: 100;
  }
  .nav-title{
    width: 25px;
    height:94px;
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
  .nav-position{
    position: relative;
  }
  .key-quick,.depart-nav{
    height: 35px;
    background: #FBEBEC;
    font-size: 12px;
    color: #333333;
    line-height: 35px;
    font-weight: bold;
    border-bottom: 1px solid rgba(0,0,0,0.12);
  }
  .key-quick{
    border-top-left-radius:4px;
    border-top-right-radius:4px;
  }
  .key-wrapper{
    height:54px;
    background: #fff;
    border-bottom: 1px solid rgba(0,0,0,0.12);
  }
  .key-left,.key-right{
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
  .key-left:hover,.key-right:hover{
    background: #D93538;
    color: #FFFFFF;
  }
  .key-left{
    margin-left: 17px;
  }
  .key-right{
    margin-left: 10px;
  }
  .nav{
    width: 184px;
    right:27px;
    position: absolute;
    display: none;
    // height: 264px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid rgba(0,0,0,0.12);
    border-bottom: none;

  }

  .nav ul li{
    height:35px;
    background: #fff;
    display:block;
    cursor: pointer;
    font-size: 12px;
    color: #333333;
    line-height: 35px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    border-bottom: 1px solid rgba(0,0,0,0.12);
  }
  .nav ul li:last-child{
    border-bottom-right-radius:4px;
    border-bottom-left-radius:4px;
  }
  .nav ul li:hover{
    background: #F1F1F1;
  }
  .goTop{
    position: fixed;
    z-index: 200;
    right:20px;
    bottom: 50px;
    cursor: pointer;
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
    margin-left: 20px;
    width: 132px !important;
  }
  // .title-name8{
  //   width: 132px !important;
  // }
  .title-name8{
    width: 160px !important;
  }
  .title-name8:nth-child(1){
    width: 160px !important;
  }
  .title-name8:nth-child(2){
    width: 172px !important;
  }
  .title-name8:nth-child(3){
    width: 179px !important;
  }
  .title-name8:nth-child(4){
    width: 179px !important;
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
