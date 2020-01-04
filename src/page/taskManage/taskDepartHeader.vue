<template>
  <div class='task-manage'>
    
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <span class="child1">任务管理</span> / <span class="child2">任务列表</span>
      </div>
      <div class="take-top-wrapper">
        <div class="take-left">
          <div class="take-top" style="font-size: 14px;font-weight:normal">任务列表</div>
        </div>
        <div class="take-right" @click='mindTask'>
          发起任务
        </div>
      </div>
      <div class="untreatTask-wrapper">
        <div class="untreatTask">
          <ul v-for="(item,index) in taskCountLists">
            
            <li>{{item.deptName}}：</li>
            <li>待处理任务数 {{item.pendingTaskCount}}</li>
            <li>未完成任务数 {{item.incompleteTaskCount}}</li>
            <li>总任务数 {{item.totalTaskCount}}</li>
          </ul>
        </div>
      </div>

      <div class="take-top-wrapper m-t-10">
        <div class="take-top" style="font-size: 14px;font-weight:normal">员工任务待处理</div>
      </div>
      <div class="untreatTask-table taskNum0">
        <el-table
          :data="result1"
          style="width: 100%" @expand="startExpend" row-key="id"
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
                    <span @click='replyTask(props.row.index,props.row.id,$event)' class='replyValue'>回复</span>
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
              <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.id}}" style="color:#505363;">
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
                    class='complete' @click='lateCheck(props.row.changeType,props.row.id,props.row.planEndDate,1,$event)'>任务审核</el-button>
                  <el-button
                    size="small"
                    class='complete' v-if='props.row.taskStatusType=="APPROVING"' @click='lateCheck(props.row.changeType,props.row.id,props.row.planEndDate,1,$event)'>任务审核</el-button>
                    
              </template>
          </el-table-column>
        </el-table>
        <div class="pagination-depart" v-if='total>0'>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 15, 50]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=total>
          </el-pagination>
        </div>
      </div>

      <!-- 我的任务 -->
      <div class="take-top-wrapper m-t-10">
        <div class="take-top" style="font-size: 14px;font-weight:normal">我的任务</div>
        
        <div class="take-bottom">
            <div class="task-item" v-bind:class="{ active: tabsType === 0 }" @click="tabsTypeChange(0)">待处理</div>
            <div class="task-item" v-bind:class="{ active: tabsType === 1 }" @click="tabsTypeChange(1)">全部任务</div>
        </div>
      </div>
      <div class="untreatTask-table mytask">
        <el-table :data="result" @expand="startExpend" row-key="id"
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
                      <span @click='replyTask(props.row.index,props.row.id,$event)' class='replyValue'>回复</span>
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
                <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.id}}" style="color:#505363;">
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
                   :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='cancle(props.row.id)'>取消</el-button> -->
                   <el-button
                     size="small"
                    class='complete' v-if='props.row.canUpdate==true&&props.row.taskStatus=="UNCOMPLETION"' @click='cancle(props.row.id,$event)'>取消</el-button>
                </span>
                <span>
                  <!-- <el-button
                    size="small"
                    :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='delay(props.row.id,props.row.planEndDate)'>延期</el-button> -->
                    <el-button
                      size="small"
                       class='complete' v-if='props.row.canUpdate&&props.row.taskStatus=="UNCOMPLETION"'   @click='delay(props.row.id,props.row.planEndDate,$event)'>延期</el-button>
                  </span>
                  <span>
                    <!-- <el-button
                      size="small"
                      :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='levelChange(props.row.id)'>等级变更</el-button> -->
                      <el-button
                        size="small"
                        class='complete' v-if='props.row.canUpdate&&props.row.taskStatus=="UNCOMPLETION"' @click='levelChange(props.row.id,$event)'>等级变更</el-button>
                    </span>
                    <span>
                      <!-- <el-button
                        size="small"
                        :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='completeModal(props.row.id)'>完成</el-button> -->
                        <el-button
                          size="small"
                          class='complete' v-if='props.row.canUpdate&&props.row.taskStatus=="UNCOMPLETION"' @click='completeModal(props.row.id,$event)'>完成</el-button>
                    </span>
                    </span>
                    <span v-else>
                      <el-button
                        size="small"
                        class='complete' @click='completeModal(props.row.id,$event)'>确认完成</el-button>
                        <el-button
                          size="small"
                          class='complete' @click='unCompleteTask(props.row.id,$event)'>未完成</el-button>
                    </span>

              </template>
          </el-table-column>
        </el-table>
      </div>


      <!-- 部门视图 -->
      <div class="">
        <!-- 投研中心 -->
        <div class="take-top-wrapper d_jump" index='01' style="margin-top:10px;">
          <div class="take-left">
            <div class="take-top">员工任务</div>
          </div>
        </div>
        
        <div class="staffView" v-for="(item,index) in depet" :key="index">
          <div class="take-top-wrapper" style="margin-top:10px;margin-bottom:5px;">
            <div class="take-left">
              <div class="take-top" style="float:left;width:auto;min-width:280px;">{{item.deptName}}</div>
            </div>
            <div ref="mybox" class="packUp" @click='deptOpen(item)' style="margin-right:44px;float:right;margin-top:9px;cursor:pointer;text-align:center;font-size: 12px;line-height:28px;color:#D93538;width:65px;height:28px;border: 1px solid #D93538;border-radius: 4px;">
              {{item.isOpen ? '收起' : '展开'}}
            </div>
          </div>
          <div class="" v-show="item.isOpen">

            <div class="partView" v-for='(item1,index1) in optionType'>
              <div class="take-top-wrapper" style="margin-top:10px;background:rgba(217, 52, 55, 0.02);">
                <div class="take-left">
                  <div class="take-top" style="float:left;width:auto;min-width:280px;">
                    {{index1+1}}.{{item1.taskTypeName}}
                  </div>
                </div>
                <div @click='mindTask1(item1.taskTypeId,item.deptId)'style="float:right;margin-top:9px;margin-right:44px;margin-left:4px;cursor:pointer;text-align:center;font-size: 12px;line-height:28px;color:#D93538;width:65px;height:28px;border:1px solid #D93538;border-radius: 4px;">
                  添加任务
                </div>
                <div ref="mybox2" class="packUp mybox2" @click='deptTaskOpen(item,item1.taskTypeId)' style="margin-left:6px;float:right;margin-top:9px;cursor:pointer;text-align:center;font-size: 12px;line-height:28px;color:#D93538;width:65px;height:28px;border:1px solid #D93538;border-radius: 4px;">
                  {{openTaskTypeId == (item.deptId + '-' + item1.taskTypeId) ?  '收起' : '展开'}}
                </div>
              </div>
              <div class="untreatTask-table" v-show="openTaskTypeId == (item.deptId + '-' + item1.taskTypeId)">
                <el-table :data="item[item1.taskTypeId] ? item[item1.taskTypeId].data : []" @expand="startExpend" row-key="id"
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
                              <span @click='replyTask(props.row.index,props.row.id,$event,1)' class='replyValue'>回复</span>
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
                        <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.id}}" style="color:#505363;">
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
                      <el-button size="small" class='complete' @click='tipCompleteModal(props.row.id,$event)'>提醒完成</el-button>
                      <el-button size="small" class='complete' @click='levelComeplete(props.row.id,$event)'>任务评价</el-button>
                      
                        <span>
                          <el-button
                            size="small"
                            class='complete' v-if='props.row.taskStatus=="UNCOMPLETION"' @click='cancle(props.row.id,$event)'>取消</el-button>
                        </span>
                        <span>
                            <el-button
                              size="small"
                              class='complete' v-if='props.row.taskStatus=="UNCOMPLETION"'   @click='delay(props.row.id,props.row.planEndDate,$event)'>延期</el-button>
                          </span>
                          <span >
                              <el-button
                                size="small"
                                class='complete' v-if='props.row.taskStatus=="UNCOMPLETION"' @click='levelChange(props.row.id,$event)'>等级变更</el-button>
                            </span>
                            <span>

                              <span v-if='props.row.myselfTaskJudge==false&&props.row.taskStatus=="UNCOMPLETION"'>
                                <el-button
                                  size="small"
                                  class='complete' v-if='props.row.hadremind==false' @click='tipCompleteModal(props.row.id,$event)'>提醒完成</el-button>
                                  <el-button
                                    size="small"
                                    :plain="true" :disabled="true" class='disable-button' v-if='props.row.hadremind==true' @click='tipCompleteModal(props.row.id,$event)'>已提醒完成</el-button>
                              </span>
                              <span v-else>
                                <el-button
                                  size="small"
                                  class='complete' v-if='props.row.taskStatus!="COMPLETION"'  @click='completeModal(props.row.id,$event)'>完成</el-button>
                                  
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
        <el-dialog title='评价任务' :visible.sync="dialogVisible8" size="tiny" :before-close="handleClose8" top='23%'>
          <el-form :model="ruleForm8" :rules="rules" ref="ruleForm8" label-width="112px" class="demo-ruleForm">
            <el-form-item label="任务打分：" prop="score8" required style="margin-right: 40px !important;">
              <el-input v-model="ruleForm8.score8"></el-input>
            </el-form-item>
            <el-form-item label="任务总结：" prop="comment8" required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm8.comment8"></el-input>
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
            
            <el-form-item label="自评打分：" prop="score4" required style="margin-right: 40px !important;">
              <el-input v-model="ruleForm44.score4"></el-input>
            </el-form-item>
            <el-form-item label="任务总结：" prop="cause4" required style="margin-right: 40px !important;">
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
        <el-dialog title="发起任务" :visible.sync="dialogVisible" size="tiny" :before-close="handleClose" top='10%' class="noticeManageModel">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="112px" class="demo-ruleForm">
            <div style="margin-left:32px;margin-bottom:18px;overflow:hidden;">
              <span style="float:left;line-height:36px;"><label style="color:#ff4949">* </label>任务标题:</span>
              <el-input v-model="ruleForm.name" style="width:363px;margin-left:12px;float:left;"></el-input>
            </div>
            <div style="margin-left:46px;margin-bottom:18px;overflow:hidden;">
              <span style="float:left;vertical-align:middle;line-height:36px;">
                <label style="color:#ff4949">* </label>执行人:</span>
                <span style="width:363px;margin-left:12px;float:left;">
                  <el-select v-model="ruleForm.executorId" filterable placeholder="请选择执行人" style="width:100%;" @change='goLink'>
                    <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
                  </el-select>
                </span>
            </div>
            <div style="margin-left:32px;margin-bottom:18px;overflow:hidden;">
              <span style="float:left;vertical-align:middle;line-height:36px;">
                <label style="color:#ff4949">* </label>任务类型:
              </span>
              <span style="width:363px;margin-left:12px;float:left;">
                <el-select v-model="ruleForm.taskTypeId" placeholder="请选择类型" style="width:100%;" @click="choseTaskType1">
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
           
            <div
                style="margin-left:18px;margin-bottom:18px;"
                class="clearfix">
                <span style="float:left;vertical-align:middle;line-height:36px;">
                    <label style="color:#ff4949">* </label>任务工作量:
                </span>
                <span style="width:363px;margin-left:12px;float:left;" class="special1">
                    <el-select v-model="ruleForm.taskWorkload" placeholder="请选择任务工作量" style="width:100%;">
                        <el-option v-for="item in 10" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                    <i
                        class="el-icon-information"
                        style="float:left;margin-right: 40px !important;"
                        @mouseenter="iconEnter"
                        @mouseleave="iconLeave"></i>
                    <div class="tip-information" ref="displayShow">
                        <p>任务工作量说明：</p>
                        <p>- 本月基准任务为“完成2篇投后月报”，占本月计划考核权重的13%；</p>
                        <p>- 任务发布后会由上级进行审核，审核通过后本月计划中所有任务的权重都自动修改；</p>
                        <p>- 任务工作量基数为“1”时，不需要上级审核。</p>
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
              
              <el-form-item label="任务性质:">
                  <el-radio-group v-model="ruleForm.taskCategory">
                      <el-radio :label="0">单条任务</el-radio>
                      <el-radio :label="1">任务组任务</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="关联任务组:" v-if="ruleForm.taskCategory == 0">
                  <el-select v-model="ruleForm.taskGroupId" placeholder="请选择关联项目" style="width: 363px;">
                      <el-option
                          v-for="item in groupLists"
                          :key="item.taskGroupId"
                          :label="item.taskGroupName"
                          :value="item.taskGroupId">
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="任务组成员:" v-if="ruleForm.taskCategory == 1">
                  <div class="user-right" @click="adduser">添加任务组成员</div>
                  <div class="user-item ellipsis" v-for="(item, index) in brr">
                      <span class="ellipsis" style="display: inline-block;width: 100%;">{{ item.username }}</span>
                      <i class="el-icon-circle-close"  @click="removeTodo(index)"></i>
                  </div>
              </el-form-item>
              <el-form-item label="关联项目:" style="margin-right: 40px !important;">
                <el-select v-model="ruleForm.projectId" placeholder="请选择关联项目" style="width:100%;" @click='choseRelateProject'>
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
              <button  @click="submitForm(0)" class="saveDrafts">保存草稿</button>
              <button  @click="submitForm(1)">发布任务</button>
            </span>
        </el-dialog>
      </div>
      <div class="">
        <!--添加任务组成员-->
        <el-dialog
            title="添加任务组成员"
            :visible.sync="dialogVisible5"
            size="tiny"
            :before-close="handleClose5"
            top="25%"
            class=" noticeManageModel">
            <el-form
                :model="ruleForm5"
                :rules="rules"
                ref="ruleForm5"
                label-width="112px"
                class="demo-ruleForm">
                <el-form-item
                    label="姓名:"
                    prop="username"
                    style="margin-right: 40px !important;">
                    <el-select
                        v-model="ruleForm5.username"
                        filterable
                        placeholder="请选择任务组成员"
                        style="width:100%;">
                        <el-option
                            v-for="item in usersT"
                            :key="item.userId"
                            :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <button @click="resetForm5('ruleForm5')">取 消</button>
                <button @click="submitForm5('ruleForm5')">确定</button>
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
            <el-form-item label="任务重要等级:" prop="taskWorkload" required style="margin-right: 40px !important;">
              <el-select v-model="ruleForm3.taskWorkload" placeholder="请选择任务等级" style="width:100%;" @change='choseLevel3'>
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
      <el-dialog
          title="编辑任务"
          :visible.sync="dialogVisible10"
          size="tiny"
          :before-close="handleClose10"
          top="10%"
          class=" noticeManageModel">
          <el-form
              :model="ruleForm31"
              :rules="rules31"
              ref="ruleForm31"
              label-width="112px"
              class="demo-ruleForm">
              <el-form-item
                  label="任务标题:"
                  required
                  prop="title"
                  style="margin-right: 40px !important;">
                  <el-input v-model="ruleForm31.title"></el-input>
              </el-form-item>
              
              <el-form-item
                  label="执行人:"
                  required
                  style="margin-right: 40px !important;">
                  <el-select
                      v-model="ruleForm31.executorId"
                      filterable
                      placeholder="请选择执行人"
                      style="width:100%;"
                      @change="goLink">
                      <el-option
                          v-for="item in users"
                          :key="item.userId"
                          :label="item.userName"
                          :value="item.userId"
                      >
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item
                  label="任务类型:"
                  prop="taskTypeId"
                  required
                  style="margin-right: 40px !important;">
                  <el-select
                      v-model="ruleForm31.taskTypeId"
                      placeholder="请选择类型"
                      style="width:100%;"
                  >
                      <el-option
                          v-for="item in optionType"
                          :key="item.taskTypeId"
                          :label="item.taskTypeName"
                          :value="item.taskTypeId"
                      >
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item
                  label="任务汇报对象:"
                  prop="reportId"
                  required
                  style="margin-right: 40px !important;">
                  <el-select
                      v-model="ruleForm31.reportId"
                      filterable
                      placeholder="请选择任务汇报对象"
                      style="width:100%;"
                  >
                      <el-option
                          v-for="item in optionsObj"
                          :key="item.userId"
                          :label="item.userName"
                          :value="item.userId"
                      >
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item
                  label="任务工作量:"
                  required
                  class="special1"
                  style="margin-right: 40px !important;">
                  <el-select
                      v-model="ruleForm31.taskWorkload"
                      placeholder="请选择任务工作量"
                      style="width:100%;">
                      <el-option v-for="item in 10" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                  <i
                      class="el-icon-information"
                      style="float:left;margin-right: 40px !important;"
                      @mouseenter="iconEnter2"
                      @mouseleave="iconLeave2"></i>
                  <div class="tip-information" ref="displayShow2">
                      <p>任务工作量说明：</p>
                      <p>- 本月基准任务为“完成2篇投后月报”，占本月计划考核权重的13%；</p>
                      <p>- 任务发布后会由上级进行审核，审核通过后本月计划中所有任务的权重都自动修改；</p>
                      <p>- 任务工作量基数为“1”时，不需要上级审核。</p>
                  </div>
              </el-form-item>
              <el-form-item
                  label="完成时间:"
                  required
                  style="margin-right: 40px !important;height:36px;">
                  <el-form-item>
                      <el-date-picker
                          type="date"
                          :picker-options="pickerOptions0"
                          placeholder="选择日期"
                          v-model="ruleForm31.planEndDate"
                          style="width: 100%;"
                      ></el-date-picker>
                  </el-form-item>
              </el-form-item>
              <el-form-item label="任务内容：" required prop="content" style="margin-right: 40px !important;">
                  <el-input type="textarea" v-model="ruleForm31.content"></el-input>
              </el-form-item>
              <el-form-item label="修改原因：" required prop="modifyReason" style="margin-right: 40px !important;">
                  <el-input type="textarea" v-model="ruleForm31.modifyReason"></el-input>
              </el-form-item>
          
              <div v-show="stretch">
                  
                  <el-form-item label="任务性质:">
                      <el-radio-group v-model="ruleForm31.taskCategory">
                          <el-radio :label="0">单条任务</el-radio>
                          <el-radio :label="1">任务组任务</el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item label="关联任务组:" v-if="ruleForm31.taskCategory == 0">
                      <el-select v-model="ruleForm31.taskGroupId" placeholder="请选择关联项目" style="width:100%;">
                          <el-option
                              v-for="item in groupLists"
                              :key="item.taskGroupId"
                              :label="item.taskGroupName"
                              :value="item.taskGroupId">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="任务组成员:" v-if="ruleForm31.taskCategory == 1">
                      <div class="user-right" @click="adduser13">添加任务组成员</div>
                      <div class="user-item ellipsis" v-for="(item, index) in brr13">
                          <span class="ellipsis" style="display: inline-block;width: 100%;">{{ item.username }}</span>
                          <i class="el-icon-circle-close"  @click="removeTodo13(index)"></i>
                      </div>
                  </el-form-item>
                  <el-form-item
                      label="关联项目:"
                      style="margin-right: 40px !important;">
                      <el-select
                          v-model="ruleForm31.projectId"
                          placeholder="请选择关联项目"
                          style="width:100%;">
                          <el-option
                              v-for="item in projects"
                              :key="item.projectId"
                              :label="item.projectName"
                              :value="item.projectId">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item
                      label="任务可见范围:"
                      style="margin-right: 40px !important;">
                      <el-select
                          multiple
                          v-model="ruleForm31.value71"
                          placeholder="请选择部门"
                          style="width:100%;">
                          <el-option
                              v-for="item in depet"
                              :key="item.deptId"
                              :label="item.deptName"
                              :value="item.deptId"
                          >
                          </el-option>
                      </el-select>
                  </el-form-item>
              </div>
              <div style="text-align: center">
                  <div style="cursor: pointer" @click="Collapse">
                      <span>{{ msg }}</span>
                      <i :class=" stretch ? 'el-icon-arrow-up' : 'el-icon-arrow-down' " ></i>
                  </div>
              </div>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <button @click="resetForm31('ruleForm31')">取 消</button>
              <button @click="submitForm31('ruleForm31')">编辑任务</button>
          </span>
      </el-dialog>
    </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import moment from 'moment'
import {
  listPending,
  delayTaskCause,
  remindTaskList,
  changeTaskLevel,
  cancelTaskCause,
  assignmentTask,
  listReportingUsers,
  assessTask,
  getChangeType,
  completeTask,
  approvalTask,
  taskHeader,
  getCurrentUserDept,
  listDeptPendingTasks,
  departChangeTaskPending,
  departCommentTaskPending,
  departAssignedTaskPending,
  impChangeOrdTask,
  getTaskComment,
  listMyPendingTask,
  listPersonalAllByPage,
  departCommentTaskPendingUnCompleted,
  listTaskExecutors,
  publishTask,
  getUsersObj,
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
  listDraftTask,
  listPendingTaskByTaskTypeId,
  saveDraftTask,
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
      activeColl: '1',
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
      tabsType: 0,
      taskCountLists: [], // 任务数统计

      show1: true,
      show2: false,
      result3: [],
      brr13: [],
      taskId: '',
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
        score4: '',
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
        score8: '',
        comment8:''
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
      ruleForm31: {
          title: "", // 任务标题
          taskTypeId: "",// 任务类型
          executorId: "", // 执行人
          reportId: "", // 任务汇报对象
          projectId: "", // 关联项目
          taskWorkload: "",// 任务工作量
          planEndDate: "",// 完成时间
          content: "", // 任务内容
          modifyReason: '', //修改原因
          taskCategory: 0, // 任务性质
          taskGroupId: '', // 关联任务组
          value71: [] // 任务可见范围部门
          
      },
      
      ruleForm: {
          name: "", // 任务标题
          date1: "", // 完成时间
          content: "", // 任务内容
          telObj: "", // 任务汇报对象
          taskWorkload: "", // 任务工作量
          taskTypeId: "", // 任务类型
          executorId: "", // 执行人
          taskCategory: 0, // 任务性质
          taskGroupId: '', // 关联任务组
          projectId: "", // 关联项目
          value71: [] // 任务可见范围部门
          
      },
      ruleForm1: {
        cause: ''
      },
      ruleForm2: {
        cause1: '',
        date1: '',
      },
      ruleForm3: {
        taskWorkload: '',
        cause3: '',
      },
      ruleForm5: {
          username: ""
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
      groupLists: [], // 任务组
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
          title: "", // 任务标题
          taskTypeId: "",// 任务类型
          executorId: "", // 执行人
          reportId: "", // 任务汇报对象
          projectId: "", // 关联项目
          taskWorkload: "",// 任务工作量
          planEndDate: "",// 完成时间
          content: "", // 任务内容
          modifyReason: '', //修改原因
          taskCategory: 0, // 任务性质
          taskGroupId: '', // 关联任务组
          value71: [] // 任务可见范围部门
          
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
        taskWorkload: [{
          required: true,
          message: '请选择任务重要等级',
        }, ],
        value13: [{
          required: true,
          message: '请选择任务重要等级',
        }, ],
        taskTypeId: [{
          required: true,
          message: '请选择任务类型',
          type: 'number'
        }, ],
        value14: [{
          required: true,
          message: '请选择任务类型',
          type: 'number'
        }, ],
        executorId: [{
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
        
        score4: [
          { required: true, message: '请输入自评分值'},
        ],
        cause4: [
          { required: true, message: '请输入任务总结' },
          {max: 200, message: '不能超过200个字符'}
        ],
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
        taskWorkload: [{
          required: true,
          message: '请选择任务重要等级',
        }, ],
        value13: [{
          required: true,
          message: '请选择任务重要等级',
        }, ],
        taskTypeId: [{
          required: true,
          message: '请选择任务类型',
          type: 'number'
        }, ],
        value14: [{
          required: true,
          message: '请选择任务类型',
          type: 'number'
        }, ],
        executorId: [{
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
        score8: [{ required: true, message: '请输入' }],
        comment8: [{ required: true, message: '请输入' }],
      },


      openTaskTypeId: '', // 当前打开的id
    };
  },
  components: {
  //    Tab
  },
  mounted() {
    this.getUntreatTask()
    this.getUntreatTask1()
    this.getProjectList1()
    //this.getTaskType1()
    this.listAllUsers1()
    this.getUsersObj1()
    this.listAllUsersT()
    this.getData()
    this.getUserDetailName()
    this.departmentList1()//获取部门
    
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
    //获取部门
    departmentList1(){
      departmentList().then((res) => {
        if(res.code == ERR_OK) {
          this.depet = res.data.result;
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
            id: self.taskId,
            score: self.ruleForm44.score4,
            comment: self.ruleForm44.cause4
          }
          completeTask(params).then((res) => {
            if (res.code == ERR_OK) {
              self.dialogVisible44 = false
              self.$refs[formName1].resetFields()
              self.getData()
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
    choseLevel3(val) {
      this.ruleForm3.taskWorkload = val
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
        id:val
      }
      remindTaskList(params).then((res) => {
        if(res.code == ERR_OK) {
          self.dialogVisible8 = false
          let scrolled = document.documentElement.scrollTop || document.body.scrollTop
          console.log(scrolled)
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
        editorTask(id, event) {
            
            var e = event;
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else if (window.event) {
                window.event.cancelBubble = true;
            }
            this.addUsers13 = [];
            this.ruleForm31.title = "";
            this.ruleForm31.executorId = "";
            this.ruleForm31.taskTypeId = "";
            this.ruleForm31.reportId = "";
            this.ruleForm31.taskWorkload = "";
            this.ruleForm31.planEndDate = "";
            this.ruleForm31.content = "";
            this.ruleForm31.modifyReason = "";
            
            this.dialogVisible10 = true;
            let params = {
                id: id
            };
            this.taskIds = id;
            editorTaskMain(params).then(res => {
                if (res.code == ERR_OK) {
                    

                    this.ruleForm31.title = res.data.title;
                    this.ruleForm31.executorId = res.data.executorId;
                    this.ruleForm31.taskTypeId = res.data.taskTypeId;
                    this.ruleForm31.reportId = res.data.reportId;
                    this.ruleForm31.taskWorkload = res.data.taskWorkload;
                    this.ruleForm31.planEndDate = res.data.planEndDate;
                    this.ruleForm31.content = res.data.content;
                    this.ruleForm31.taskCategory = res.data.taskCategory;
                    this.ruleForm31.modifyReason = res.data.modifyReason;
                    
                    this.ruleForm31.projectId = res.data.projectId;

                    var _assistUserIds = [],_assistUserNames = [];
                    if (res.data.taskGroupMemberIds && res.data.taskGroupMemberIds.length > 0) {
                        var _taskGroupMemberIds = res.data.taskGroupMemberIds.split(',');
                        for (let item of _taskGroupMemberIds) {
                            if (item) {
                                _assistUserIds.push({
                                    assistUserId: item
                                });
                            }
                            
                        }
                        var _taskGroupMemberName = res.data.taskGroupMemberNames.split(',');
                        for (let item of _taskGroupMemberName) {
                            if (item) {
                                _assistUserNames.push({
                                    username: item
                                });
                            }
                        }
                    }
                    this.brr13 = [..._assistUserNames];
                    this.addUsers131 = [..._assistUserIds];

                    console.log(this.brr13,this.addUsers131 )
                    
                    if (res.data.visibleRange === "") {
                        this.ruleForm31.value71 = [];
                    } else if (res.data.visibleRange.indexOf(",") < 0) {
                        this.ruleForm31.value71 = JSON.parse("[" + parseInt(res.data.visibleRange) + "]");
                    } else {
                        this.ruleForm31.value71 = JSON.parse("[" + String(res.data.visibleRange.split(",")) + "]");
                    }
                }
            });
        },
        resetForm31(formName) {
            this.$refs["ruleForm31"].resetFields();
            this.dialogVisible10 = false;
        },
        //    确定编辑任务
        submitForm31(formName) {
            let self = this;
            var value71 = this.ruleForm31.value71.join(",");
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let time = moment(this.ruleForm31.planEndDate).format('YYYY-MM-DD');
                    let params = {
                        id: this.taskIds,
                        title: this.ruleForm31.title, // 任务标题
                        taskTypeId: this.ruleForm31.taskTypeId, // 任务类型ID
                        executorId: this.ruleForm31.executorId, // 执行人
                        reportId: this.ruleForm31.reportId, // 任务汇报对象
                        projectId: this.ruleForm31.projectId, // 关联项目
                        taskWorkload: this.ruleForm31.taskWorkload, // 任务工作量
                        taskCategory: this.ruleForm31.taskCategory, // 任务性质
                        visibleRange: value71,
                        planEndDate: time,
                        content: this.ruleForm31.content,
                        modifyReason: this.ruleForm31.modifyReason,
                    };
                    if (this.ruleForm.taskCategory == 0) {
                        params.taskGroupId = this.ruleForm.taskGroupId;
                    } else if (this.ruleForm.taskCategory == 1) {
                        let usersArr = [];
                        for(let item of this.addUsers) {
                            usersArr.push(item.assistUserId);
                        }
                        params.taskGroupMemberIds = usersArr.join(',');
                    }


                    sureEditorTask(params).then(res => {
                        if (res.code == ERR_OK) {
                            self.dialogVisible10 = false;
                            self.$refs[formName].resetFields();
                            
                            if (self.isActive == true) {
                                self.getData(completed, self.nowPage, self.pageShow);
                            } else {
                                self.getData1(self.nowPage, self.pageShow);
                            }

                            self.$notify({
                                title: "成功",
                                message: "编辑任务成功",
                                type: "success"
                            });
                        } else {
                            self.$notify.error({
                                title: "错误",
                                message: res.msg
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
    submitForm13(formName1) {
      let self = this
      this.$refs[formName1].validate((valid) => {
        if (valid) {
          const params = {
            taskId: self.taskId,
            grade: self.ruleForm3.taskWorkload,
            reason: self.ruleForm3.cause3
          }
          changeTaskLevel(params).then((res) => {
            if (res.code == ERR_OK) {
              self.dialogVisible13 = false
              let scrolled = document.documentElement.scrollTop || document.body.scrollTop
              self.getUntreatTask1()
              self.getData()
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
    tabsTypeChange(type) {
      this.tabsType = type;
      this.getData();
    },
    getData() {
      let self = this
      self.result=[];
      if (this.tabsType === 0) {
        listMyPendingTask({}).then((res) => {
          if (res.code == ERR_OK) {
            self.result = res.data.result
            this.$nextTick(() => {
              this.setSort_myTask(self.result)
            })
          }
        })
      } else {
        
        listPersonalAllByPage({}).then((res) => {
          if (res.code == ERR_OK) {
            self.result = res.data.result
            this.$nextTick(() => {
              this.setSort_myTask(self.result)
            })
          }
        })
      }
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
    goLink(val){
      this.getUsersObj1(val)
      this._listByExecutor(val,1)
    },
    
    // 获取任务组列表
    getTaskGroupLists() {
      getTaskGroupList().then((res) => {
        if (res.code == ERR_OK) {
          this.groupLists = res.data;
        }
      })
    },
    //获取任务组
    _listByExecutor(userId,key){
      let self = this
      const params = {
        userId:userId
      }
      listByExecutor(params).then((res) => {
        if(res.code == ERR_OK) {
          if(key==1){
            this.ruleForm.taskTypeId = ''
            this.optionType = res.data;
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
              this.ruleForm.taskTypeId = id
          }

        }
     })
    },
    listAllUsers1() {
      listTaskExecutors().then((res) => {
        if (res.code == ERR_OK) {
          this.users = res.data
          for (let i in this.users) {
            if (this.users[i].checked==true) {
              this.ruleForm.executorId = this.users[i].userId
            }
          }
          this.getUsersObj1(this.ruleForm.executorId)
          this._listByExecutor(this.ruleForm.executorId,1)
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
              this.ruleForm.executorId = this.users[i].userId
            }
          }
          this.getUsersObj1(this.ruleForm.executorId)
          this._listByExecutor4(this.ruleForm.executorId,1,id)
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
    
        adduser() {
            this.dialogVisible5 = true;
        },
        // 添加任务组成员模态框
        handleClose25(done) {
            this.dialogVisible25 = false;
            this.$refs["ruleForm25"].resetFields();
        },
        // 添加任务组成员模态框
        submitForm25(formName1) {
            let self = this;
            this.$refs[formName1].validate(valid => {
                if (valid) {
                    if (self.ruleForm25.username === 
                    self.ruleForm31.executorId) {
                        self.$notify.error({
                            title: "错误",
                            message: "执行人和任务组成员不能相同"
                        });
                        return;
                    }
                    if (self.addUsers13.length > 0) {
                        for (let item of self.addUsers13) {
                            if (
                                item.assistUserId === self.ruleForm25.username
                            ) {
                                self.$notify.error({
                                    title: "错误",
                                    message: "不能选择相同的任务组成员"
                                });
                                return;
                            }
                        }
                    }
                    self.dialogVisible25 = false;
                    self.addUsers131 = [];
                    let obj = {
                        assistUserId: self.ruleForm25.username
                    };
                    self.addUsers131.push(obj);
                    for (var i = 0; i < self.usersT.length; i++) {
                        for (var j = 0; j < self.addUsers131.length; j++) {
                            if ( self.usersT[i].userId === self.addUsers131[j].assistUserId ) {
                                self.brr13.push({
                                    username: self.usersT[i].userName
                                });
                            }
                        }
                    }
                } else {
                    return false;
                }
            });
        },
    // 模态框的选择任务类型
    choseTaskType1(val) {
      this.ruleForm.taskTypeId = val
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
            }else{
              self.getAssignedTask()
              self.departCommentTaskUnCompleted()
              self._listDraftTask()
              self.getUntreatTask()
              self.getChangeTask()
              self.getCommentTask()
              self.getData()
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
      listDeptPendingTasks().then((res) => {
        if (res.code == ERR_OK) {
          this.result1 = res.data
          this.$nextTick(() => {
            this.setSort_Tab0(this.result1)
          })
        }
      })
    },
    // 待处理任务列表
    getUntreatTask1() {
      getDeptStatistics().then((res) => {
        if (res.code == ERR_OK) {
          this.taskCountLists = res.data;
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
        if(num==8){
          let scrolled = document.documentElement.scrollTop || document.body.scrollTop
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
      this.ruleForm.taskTypeId = ''
      this.ruleForm.taskWorkload = ''
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
      this.ruleForm.taskTypeId = ''
      this.ruleForm.taskWorkload = ''
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
    // 完成任务
    completeModal(val,event) {
      var e = event;
      if(e&&e.stopPropagation){
          e.stopPropagation()
      }else if(window.event){
          window.event.cancelBubble=true;
      }
      this.taskId = val
      this.dialogVisible44 = true
      this.mineRate = true
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
            id: self.taskId,
            score:self.ruleForm8.score8,
            comment:self.ruleForm8.comment8
          }
          assessTask(params).then((res) => {
            if (res.code == ERR_OK) {
              self.dialogVisible8 = false
              self.getCommentTask()
              let scrolled = document.documentElement.scrollTop || document.body.scrollTop
              self.getUntreatTask1()
              self.$refs[formName].resetFields()
              self.getData()
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
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$refs['ruleForm'].resetFields();
    },
    
    submitForm(submitType) {
        // submitType 提交类型 1 提交  0 保存草稿
        let self = this;
        if (this.ruleForm.name == "") {
            this.$notify.error({
                title: "错误",
                message: "请输入任务标题"
            });
            return false;
        }
        if (this.ruleForm.name.trim().length > 50) {
            this.$notify.error({
                title: "错误",
                message: "任务标题不能超过50个字符"
            });
            return false;
        }
        if (submitType === 1) {
            if (this.ruleForm.executorId == "" && this.ruleForm.executorId != 0) {
                this.$notify.error({
                    title: "错误",
                    message: "请选择执行人"
                });
                return false;
            }
            if (this.ruleForm.taskTypeId == "") {
                this.$notify.error({
                    title: "错误",
                    message: "请选择任务类型"
                });
                return false;
            }
            if (this.ruleForm.telObj == "" && this.ruleForm.telObj != 0) {
                this.$notify.error({
                    title: "错误",
                    message: "请选择任务汇报对象"
                });
                return false;
            }
            if (this.ruleForm.taskWorkload == "") {
                this.$notify.error({
                    title: "错误",
                    message: "请选择任务工作量"
                });
                return false;
            }
            if (this.ruleForm.date1 == "") {
                this.$notify.error({
                    title: "错误",
                    message: "请输入完成时间"
                });
                return false;
            }
            if (this.ruleForm.content == "") {
                this.$notify.error({
                    title: "错误",
                    message: "请输入任务内容"
                });
                return false;
            }
            if (this.ruleForm.content.trim().length > 200) {
                this.$notify.error({
                    title: "错误",
                    message: "任务内容不能超过200个字符"
                });
                return false;
            }
        }

        var time;
        var value71 = this.ruleForm.value71.join(",");
        if (self.ruleForm.date1 == "") {
            time = "";
        } else {
            time = moment(self.ruleForm.date1).format('YYYY-MM-DD');
        }
        
        let params = {
            title: self.ruleForm.name, // 任务标题
            taskTypeId: self.ruleForm.taskTypeId, // 任务类型ID
            executorId: self.ruleForm.executorId, // 执行人
            reportId: self.ruleForm.telObj, // 任务汇报对象
            projectId: self.ruleForm.projectId, // 关联项目
            taskWorkload: self.ruleForm.taskWorkload, // 任务工作量
            taskCategory: self.ruleForm.taskCategory, // 任务性质
            visibleRange: value71,
            planEndDate: time,
            content: self.ruleForm.content
        };
        if (self.ruleForm.taskCategory == 0) {
            params.taskGroupId = self.ruleForm.taskGroupId;
        } else if (self.ruleForm.taskCategory == 1) {
            let usersArr = [];
            for(let item of self.addUsers) {
                usersArr.push(item.assistUserId);
            }
            params.taskGroupMemberIds = usersArr.join(',');
        }
        
        if (submitType === 0) {
            saveDraftTask(params).then(res => {
                if (res.code == ERR_OK) {
                    self.dialogVisible = false;
                    
                    this.$refs.ruleForm.resetFields();
                    this.$notify({
                        title: "成功",
                        message: "发起任务成功",
                        type: "success"
                    });
                } else {
                    this.$notify.error({
                        title: "错误",
                        message: res.msg
                    });
                }
            });
        } else if (submitType === 1) {
            publishTask(params).then(res => {
                if (res.code == ERR_OK) {
                    self.dialogVisible = false;
                    
                    this.$refs.ruleForm.resetFields();
                    this.$notify({
                        title: "成功",
                        message: "发起任务成功",
                        type: "success"
                    });
                } else {
                    this.$notify.error({
                        title: "错误",
                        message: res.msg
                    });
                }
            });
        }
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
            id: self.taskId,
            reason: self.ruleForm1.cause
          }
          cancelTaskCause(params).then((res) => {
            if (res.code == ERR_OK) {
              self.dialogVisible1 = false
              let scrolled = document.documentElement.scrollTop || document.body.scrollTop
              self.getUntreatTask1()
              self.getData()
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
    },

    
    deptOpen(item) {
      this.depet.map((v)=>{
        if (v.deptId != item.deptId) {
          this.$set(v, 'isOpen', false);
        }
      })
      this.$set(item, 'isOpen', !item.isOpen);
    },
    
    
        iconEnter2() {
            this.$refs.displayShow2.style.display = "block";
        },
        iconLeave2() {
            this.$refs.displayShow2.style.display = "none";
        },
        // 点击添加任务组成员
        adduser13() {
            this.dialogVisible25 = true;
        },
        handleClose5(done) {
            this.dialogVisible5 = false;
            this.$refs["ruleForm5"].resetFields();
        },
        submitForm5(formName1) {
            let self = this;
            this.$refs[formName1].validate(valid => {
                if (valid) {
                    if (self.ruleForm5.username === self.ruleForm.executorId) {
                        self.$notify.error({
                            title: "错误",
                            message: "执行人和任务组成员不能相同"
                        });
                        return;
                    }
                    if (self.addUsers.length > 0) {
                        for (let item of self.addUsers) {
                            if (item.assistUserId === self.ruleForm5.username) {
                                self.$notify.error({
                                    title: "错误",
                                    message: "不能选择相同的任务组成员"
                                });
                                return;
                            }
                        }
                    }
                    self.dialogVisible5 = false;

                    let obj = {
                        assistUserId: self.ruleForm5.username
                    };

                    self.addUsers.push(obj);
                    this.brr = [];
                    for (var i = 0; i < self.usersT.length; i++) {
                        for (var j = 0; j < self.addUsers.length; j++) {
                            if ( self.usersT[i].userId === self.addUsers[j].assistUserId ) {
                                self.brr.push({ username: self.usersT[i].userName });
                            }
                        }
                    }

                } else {
                    return false;
                }
            });
        },
        resetForm5(formName1) {
            this.dialogVisible5 = false;
            this.$refs[formName1].resetFields();
        },
    deptTaskOpen(item,taskTypeId){
      console.log('展开',item,taskTypeId)
      let deptIdAndTaskTypeId = item.deptId + '-' + taskTypeId;
      if (this.openTaskTypeId == deptIdAndTaskTypeId) {
        this.openTaskTypeId = '';
      } else {
        this.openTaskTypeId = deptIdAndTaskTypeId;
      }
      if (item[taskTypeId] && item[taskTypeId].data && item[taskTypeId].data.length > 0) {
        // 缓存，如果有数据则不再重复取
        return;
      }
      this.$set(item, taskTypeId, {
        data: []
      });
      listPendingTaskByTaskTypeId({
        deptId: item.deptId,
        taskTypeId: taskTypeId
      }).then((res) => {
        if (res.code == ERR_OK) {
          this.$set(item, taskTypeId, {
            data: res.data ? res.data : []
          });
        }else{
          this.$notify.error({
            title: '错误',
            message:res.msg
          });
        }
      })
      
    },
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
.untreatTask ul {
  display: block;
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
