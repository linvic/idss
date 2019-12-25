<template>
  <div class=''>
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <div v-if="userView=='STAFF'">
          <router-link to="/weekMange">
            <span class="child1">周报管理</span>
          </router-link>
          /
          <router-link to="/staff">
            <span class="child1">周报列表</span>
          </router-link>/
          <span class="child2">发起周报</span>
        </div>
        <div v-else>
          <router-link to="/weekManageDepartLeader">
            <span class="child1">周报管理</span>
          </router-link>
          /
          <router-link to="/weekManageDepartLeader">
            <span class="child1">周报列表</span>
          </router-link>/
          <span class="child2">发起周报</span>
        </div>
      </div>
      <div class="nav-wrapper" @click="jump(0)">
        <div class="nav-position">
          <div class="nav-title">
            添加任务
          </div>
        </div>
      </div>
      <div class="start_new">发起个人周报</div>
      <div class="special-title">
        <h4>一、任务列表</h4>
      </div>
      <div class="perform-title" style='margin-top:0px;'>
        <h4>1、公司重点</h4>
      </div>
      <div class="overHide task-manage">
        <div class="icon-name" @mouseenter="enter($event)" @mouseleave="leave($event)">
          <i class="el-icon-information"></i>
          <span>{{nextStartDay}} - {{nextEndDay}}</span>
        </div>
        <div class="icon-name" style="right:338px;" @mouseenter="enter($event)" @mouseleave="leave($event)">
          <i class="el-icon-information"></i>
          <span>{{startDay}} - {{endDay}}</span>
        </div>
        <el-table
          :data="tableDataCompany"
          @expand="startExpend"
          class="company"
          row-key="taskId"
          :expand-row-keys="expands"
          @row-click="openDetails"
          style="width: 100%"
          empty-text='暂无数据'
        >
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
                <el-form-item style="width: 500px" v-show="props.row.show">
                  <template>
                    <div style="width: 100%" class="replaySum">
                      <el-form  ref="ruleForm">
                        <el-form-item label="快捷总结:" prop="name" style="display: block;width: 100%">
                          <el-select  v-model="props.row.fastSummary" placeholder="选择快捷总结" @change="summary3(props.row.fastSummary,props.$index)">
                            <el-option label="选择快捷总结" value="选择快捷总结">选择快捷总结</el-option>
                            <el-option label="暂缓" value="暂缓">暂缓</el-option>
                            <el-option label="推进中" value="推进中">推进中</el-option>
                            <el-option label="完成" value="完成">完成</el-option>
                          </el-select>
                        </el-form-item>
                        <div class="" style="margin-top:10px;width: 100%">
                          <el-form-item label="本周总结:" prop="desc" style="width: 500px !important;">
                            <el-input type="textarea" v-model="props.row.summary" style="width: 350px !important;" @change="inputChange(props.$index)"></el-input>
                            <div v-show="props.row.summary==''|| props.row.summary=='选择快捷总结'" class="err">请填写本周总结</div>
                          </el-form-item>
                        </div>
                        <div class="buton-sure" @click='next3(props.row.summary,props.$index)'>
                          下一步
                        </div>
                      </el-form>
                    </div>
                  </template>
                </el-form-item>
                <el-form-item  style="width: 500px" v-show="!props.row.show">
                  <template>
                    <div class="" style="margin-top:10px;">
                      <el-form ref="planForm">
                        <div class="" style="margin-top:10px;width: 100%">
                          <el-form-item label="下周计划:" prop="plan" style="width: 500px !important;">
                            <el-input type="textarea" v-model="props.row.weeklyPlan" style="width: 350px !important;"></el-input>
                            <div v-show="props.row.weeklyPlan==''" class="err">请填写下周计划</div>
                          </el-form-item>
                        </div>
                        <div class="buton-prev" @click='prev3(props.row.weeklyPlan,props.$index)'>
                          上一步
                        </div>
                        <div class="buton-sure" @click='sure3(props.row.taskId,props.$index)'>
                          确定
                        </div>
                      </el-form>
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
              <router-link :to="{ path: 'taskDetail',query: {id:props.row.taskId}}" style="color:#505363;" v-if="userView=='STAFF'">
                <div>{{ props.row.title}}</div>
              </router-link>
              <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;" v-else>
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
                {{props.row.lastTaskReplyContent}}
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
      <div class="overHide task-manage">
        <div class="icon-name" @mouseenter="enter($event)" @mouseleave="leave($event)">
          <i class="el-icon-information"></i>
          <span>{{nextStartDay}} - {{nextEndDay}}</span>
        </div>
        <div class="icon-name" style="right:338px;" @mouseenter="enter($event)" @mouseleave="leave($event)">
          <i class="el-icon-information"></i>
          <span>{{startDay}} - {{endDay}}</span>
        </div>
        <el-table
          :data="tableDataDept"
                  @expand="startExpend"
                  style="width: 100%"
                  class="dept"
                  row-key="taskId"
                  :expand-row-keys="expands"
                  @row-click="openDetails"
                  empty-text='暂无数据'
        >
          <el-table-column
            label="序号"
            width="70"
          >
            <template slot-scope="props">
              <span>2.{{props.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column type="expand" >
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="内容:">
                  <span class='content-tab'>{{ props.row.content}}</span>
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
                <el-form-item style="width: 500px" v-show="props.row.show">
                  <template>
                    <div style="width: 100%" class="replaySum">
                      <el-form  ref="ruleForm">
                        <el-form-item label="快捷总结:" prop="name" style="display: block;width: 100%">
                          <el-select  v-model="props.row.fastSummary" placeholder="选择快捷总结" @change="summary2(props.row.fastSummary,props.$index)">
                            <el-option label="选择快捷总结" value="选择快捷总结">选择快捷总结</el-option>
                            <el-option label="暂缓" value="暂缓">暂缓</el-option>
                            <el-option label="推进中" value="推进中">推进中</el-option>
                            <el-option label="完成" value="完成">完成</el-option>
                          </el-select>
                        </el-form-item>
                        <div class="" style="margin-top:10px;width: 100%">
                          <el-form-item label="本周总结:" prop="desc" style="width: 500px !important;">
                            <el-input type="textarea" v-model="props.row.summary" style="width: 350px !important;" @change="inputChangeDept(props.$index)"></el-input>
                            <div v-show="props.row.summary==''|| props.row.summary=='选择快捷总结'" class="err">请填写本周总结</div>
                          </el-form-item>
                        </div>
                        <div class="buton-sure" @click='next2(props.row.summary,props.$index)'>
                          下一步
                        </div>
                      </el-form>
                    </div>
                  </template>
                </el-form-item>
                <el-form-item  style="width: 500px" v-show="!props.row.show">
                  <template>
                    <div class="" style="margin-top:10px;">
                      <el-form ref="planForm">
                        <div class="" style="margin-top:10px;width: 100%">
                          <el-form-item label="下周计划:" prop="plan" style="width: 500px !important;">
                            <el-input type="textarea" v-model="props.row.weeklyPlan" style="width: 350px !important;"></el-input>
                            <div v-show="props.row.weeklyPlan==''" class="err">请填写下周计划</div>
                          </el-form-item>
                        </div>
                        <div class="buton-prev" @click='prev2(props.row.weeklyPlan,props.$index)'>
                          上一步
                        </div>
                        <div class="buton-sure" @click='sure2(props.row.taskId,props.$index)'>
                          确定
                        </div>
                      </el-form>
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
              <router-link :to="{ path: 'taskDetail',query: {id:props.row.taskId}}" style="color:#505363;" v-if="userView=='STAFF'">
                <div>{{ props.row.title}}</div>
              </router-link>
              <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;" v-else>
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
              <div v-if="props.row.taskWeeklyRelaSummary" >
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
                <span v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='DEPTHEADER'">{{props.row.taskWeeklyRelaWeeklyPlan.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}}</span>
                <span v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='SECOND_DEPTHEADER'">{{props.row.taskWeeklyRelaWeeklyPlan.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}} </span>
                <span  v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='MANAGER'">{{props.row.taskWeeklyRelaWeeklyPlan.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}} </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--个人重点-->
      <div class="perform-title">
        <h4>3、个人重点</h4>
      </div>
      <div class="overHide task-manage">
        <div class="icon-name" @mouseenter="enter($event)" @mouseleave="leave($event)">
          <i class="el-icon-information"></i>
          <span>{{nextStartDay}} - {{nextEndDay}}</span>
        </div>
        <div class="icon-name" style="right:338px;" @mouseenter="enter($event)" @mouseleave="leave($event)">
          <i class="el-icon-information"></i>
          <span>{{startDay}} - {{endDay}}</span>
        </div>
        <el-table
          :data="tableDataPerson"
          @expand="startExpend"
          row-key="taskId"
          class="person"
          :expand-row-keys="expands"
          @row-click="openDetails"
          style="width: 100%"
          empty-text='本周暂无个人重点任务'>
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
                <el-form-item style="width: 500px" v-show="props.row.show">
                  <template>
                    <div style="width: 100%" class="replaySum">
                      <el-form  ref="ruleForm">
                        <el-form-item label="快捷总结:" prop="name" style="display: block;width: 100%">
                          <el-select  v-model="props.row.fastSummary" placeholder="选择快捷总结" @change="summary1(props.row.fastSummary,props.$index)">
                            <el-option label="选择快捷总结" value="选择快捷总结">选择快捷总结</el-option>
                            <el-option label="暂缓" value="暂缓">暂缓</el-option>
                            <el-option label="推进中" value="推进中">推进中</el-option>
                            <el-option label="完成" value="完成">完成</el-option>
                          </el-select>
                        </el-form-item>
                        <div class="" style="margin-top:10px;width: 100%">
                          <el-form-item label="本周总结:" prop="desc" style="width: 500px !important;">
                            <el-input type="textarea" v-model="props.row.summary" style="width: 350px !important;"  @change="inputChange3(props.$index)"></el-input>
                            <div v-show="props.row.summary==''|| props.row.summary=='选择快捷总结'" class="err">请填写本周总结</div>
                          </el-form-item>
                        </div>
                        <div class="buton-sure" @click='next1(props.row.summary,props.$index)'>
                          下一步
                        </div>
                      </el-form>
                    </div>
                  </template>
                </el-form-item>
                <el-form-item  style="width: 500px" v-show="!props.row.show">
                  <template>
                    <div class="" style="margin-top:10px;">
                      <el-form ref="planForm">
                        <div class="" style="margin-top:10px;width: 100%">
                          <el-form-item label="下周计划:" prop="plan" style="width: 500px !important;">
                            <el-input type="textarea" v-model="props.row.weeklyPlan" style="width: 350px !important;"></el-input>
                            <div v-show="props.row.weeklyPlan==''" class="err">请填写下周计划</div>
                          </el-form-item>
                        </div>
                        <div class="buton-prev" @click='prev1(props.row.weeklyPlan,props.$index)'>
                          上一步
                        </div>
                        <div class="buton-sure" @click='sure1(props.row.taskId,props.$index)'>
                          确定
                        </div>
                      </el-form>
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
              <router-link :to="{ path: 'taskDetail',query: {id:props.row.taskId}}" style="color:#505363;" v-if="userView=='STAFF'">
                <div>{{ props.row.title}}</div>
              </router-link>
              <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;" v-else>
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
      <!--个人普通-->
      <div class="perform-title">
        <h4>4、个人普通</h4>
      </div>
      <div class="overHide task-manage">
        <div class="icon-name" @mouseenter="enter($event)" @mouseleave="leave($event)">
          <i class="el-icon-information"></i>
          <span>{{nextStartDay}} - {{nextEndDay}}</span>
        </div>
        <div class="icon-name" style="right:338px;" @mouseenter="enter($event)" @mouseleave="leave($event)">
          <i class="el-icon-information"></i>
          <span>{{startDay}} - {{endDay}}</span>
        </div>
        <el-table
          :data="tableDataCommon"
          @expand="startExpend"
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
                  <span class='content-tab'>{{ props.row.content}}</span>
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
                <el-form-item style="width: 500px" v-show="props.row.show">
                  <template>
                    <div style="width: 100%" class="replaySum">
                      <el-form  ref="ruleForm">
                        <el-form-item label="快捷总结:" prop="name" style="display: block;width: 100%">
                          <el-select  v-model="props.row.fastSummary" placeholder="选择快捷总结" @change="summary(props.row.fastSummary,props.$index)">
                            <el-option label="选择快捷总结" value="选择快捷总结">选择快捷总结</el-option>
                            <el-option label="暂缓" value="暂缓">暂缓</el-option>
                            <el-option label="推进中" value="推进中">推进中</el-option>
                            <el-option label="完成" value="完成">完成</el-option>
                          </el-select>
                        </el-form-item>
                        <div class="" style="margin-top:10px;width: 100%">
                          <el-form-item label="本周总结:" prop="desc" style="width: 500px !important;">
                            <el-input type="textarea" v-model="props.row.summary" style="width: 350px !important;" @change="inputChange4(props.$index)"></el-input>
                            <div v-show="props.row.summary==''|| props.row.summary=='选择快捷总结'" class="err">请填写本周总结</div>
                          </el-form-item>
                        </div>
                        <div class="buton-sure" @click='next(props.row.summary,props.$index)'>
                          下一步
                        </div>
                      </el-form>
                    </div>
                  </template>
                </el-form-item>
                <el-form-item  style="width: 500px" v-show="!props.row.show">
                  <template>
                    <div class="" style="margin-top:10px;">
                      <el-form ref="planForm">
                        <div class="" style="margin-top:10px;width: 100%">
                          <el-form-item label="下周计划:" prop="plan" style="width: 500px !important;">
                            <el-input type="textarea" v-model="props.row.weeklyPlan" style="width: 350px !important;"></el-input>
                            <div v-show="props.row.weeklyPlan==''" class="err">请填写下周计划</div>
                          </el-form-item>
                        </div>
                        <div class="buton-prev" @click='prev(props.row.weeklyPlan,props.$index)'>
                          上一步
                        </div>
                        <div class="buton-sure" @click='sure(props.row.taskId,props.$index)'>
                          确定
                        </div>
                      </el-form>
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
              <router-link :to="{ path: 'taskDetail',query: {id:props.row.taskId}}" style="color:#505363;" v-if="userView=='STAFF'">
                <div>{{ props.row.title}}</div>
              </router-link>
              <router-link :to="{ path: 'taskDetailHeader',query: {id:props.row.taskId}}" style="color:#505363;" v-else>
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
                <span v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='PERSON'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}}</span>
                <span v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='DEPTHEADER'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}} </span>
                <span v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='SECOND_DEPTHEADER'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}} </span>
                <span  v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='MANAGER'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}} </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="special-title d_jump" index='1'>
        <h4>新增任务</h4>
        <div class='addTask' @click='addTask'>添加任务</div>
      </div>
      <div class="get-reward">
        <el-table
          :data="tableData"

          style="width: 100%">
          <el-table-column
            prop="date"
            label="任务标题"
          >
            <template slot-scope='props'>
              <div class="">
                <el-input v-model='props.row.title' placeholder="请输入任务标题"></el-input>
                <!-- <input type="text" name="" value="" > -->
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="执行人">
            <template slot-scope='props'>
              <div class="">
                <el-select v-model="props.row.executorId" filterable placeholder="请输入执行人" style="width:100%;" @change='goLink1(props.row.executorId,props.$index)'>
                  <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId">
                  </el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="任务类型"
          >
            <template slot-scope='props'>
              <div class="">
                <el-select v-model="props.row.taskTypeId" filterable placeholder="请选择类型" style="width:100%;" >
                  <el-option v-for="item in optionType[props.$index]" :key="item.taskTypeId" :label="item.taskTypeName" :value="item.taskTypeId">
                  </el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="重要等级">
            <template slot-scope='props'>
              <div class="">
                <el-select v-model="props.row.grade" filterable placeholder="请选择重要等级" style="width:100%;" @change='importLevelChange(props.row.grade,props.$index)'>
                  <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="完成时间">
            <template slot-scope='props'>
              <el-date-picker type="date" :picker-options="pickerOptions0" placeholder="选择日期" v-model="props.row.planEndDate" style="width: 100%;"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="任务计划">
            <template slot-scope='props'>
              <div class="">
                <el-input v-model='props.row.plan' placeholder="请输入计划"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="操作">
            <template slot-scope='props'>
              <el-button
                size="small"
                class='complete' @click='completePerfect(props.$index)'>完善任务</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="my-comment" style="background:#fff;">
        <h3 comment-title>三、自我点评</h3>
        <div class="" style='margin-left:20px;font-size: 14px;line-height:24px;color: #333333;margin-top:15px;'>
          任务总分：{{performanceScore}}
        </div>
        <div class="" style='margin-left:20px;font-size: 14px;line-height:24px;color: #333333;'>
          任务绩效：<span style="color: #D93538;">{{evaluatingScore}}</span>
        </div>
        <textarea name="name" rows="8" cols="80" v-model='personComment' style='width:1115px;border: 1px solid rgba(0,0,0,0.12);height:98px;padding:15px;margin:20px;'></textarea>
      </div>
      <div class="button-router" @click='startWeek'>
       发布周报
      </div>
    </div>
    <!--发布任务模态窗-->
    <!--发布任务模态窗-->
    <el-dialog
      title="完善任务"
      :visible.sync="dialogVisible"
      size="tiny"
      :before-close="handleClose"
      top='10%'
      class=" noticeManageModel">
      <el-form :model="ruleFormTask" :rules="rulesTask" ref="ruleFormTask" label-width="112px" class="demo-ruleForm">
        <el-form-item label="任务标题:" prop="name" style="margin-right: 40px !important;">
          <el-input v-model="ruleFormTask.name"></el-input>
        </el-form-item>
        <el-form-item label="执行人:" prop="value5" required style="margin-right: 40px !important;">
          <el-select v-model="ruleFormTask.value5" filterable placeholder="请选择执行人" style="width:100%;" @visible-change='goLink'>
            <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务类型:" prop="value4" required style="margin-right: 40px !important;">
          <el-select v-model="ruleFormTask.value4" placeholder="请选择类型" style="width:100%;" @click="choseTaskType1">
            <el-option v-for="item in optionType1" :key="item.taskTypeId" :label="item.taskTypeName" :value="item.taskTypeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务汇报对象:" required prop="telObj" style="margin-right: 40px !important;">
          <el-select v-model="ruleFormTask.telObj" filterable placeholder="请选择任务汇报对象" style="width:100%;">
            <el-option v-for="item in optionsObj" :key="item.userId" :label="item.userName" :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务重要等级:" prop="value3" required class="special1" style="margin-right: 40px !important;">
          <el-select v-model="ruleFormTask.value3" placeholder="请选择任务等级" style="width:100%;" @change='choseTaskLevel'>
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
          <el-form-item prop="date1">
            <el-date-picker type="date" :picker-options="pickerOptions0" placeholder="选择日期" v-model="ruleFormTask.date1" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="任务内容：" prop="content" style="margin-right: 40px !important;">
          <el-input type="textarea" v-model="ruleFormTask.content"></el-input>
        </el-form-item>
        <div v-show="stretch">
          <div class="user-wrapper" style="line-height:32px;margin-bottom:13px;margin-left:21px;">
            <div class='user-left'>任务协助人：</div>
            <div style="float:left;" class='user-right-wrapper'>
              <div class='user-right' @click='adduser'>添加协助人</div>
              <div class="" v-if='helper.length>0'>
                <div class="user-item" v-for='(item,index) in helper[index].brr'>
                  <span>{{item.username}}（{{item.proportion}}%）</span>
                  <i class="el-icon-circle-close" @click="removeTodo(index)"></i>
                </div>
              </div>
            </div>
          </div>
          <el-form-item label="关联项目:" style="margin-right: 40px !important;">
            <el-select v-model="ruleFormTask.value7" placeholder="请选择关联项目" style="width:100%;" @click='choseRelateProject'>
              <el-option v-for="item in projects" :key="item.projectId" :label="item.projectName" :value="item.projectId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务可见范围:" style="margin-right: 40px !important;">
            <el-select  multiple v-model="ruleFormTask.value71" placeholder="请选择部门"  style="width:100%;">
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
              <button  @click="resetForm('ruleFormTask')">取 消</button>
              <button  @click="submitForm('ruleFormTask')">保存</button>
            </span>
    </el-dialog>
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
    <!--添加协助人-->
    <el-dialog
      title="添加协助人"
      :visible.sync="dialogVisible5"
      size="tiny"
      :before-close="handleClose5" top='25%' class=" noticeManageModel">
      <el-form :model="ruleForm5" :rules="rulesTask" ref="ruleForm5" label-width="112px" class="demo-ruleForm">
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
              <button  @click="resetForm5('ruleForm5')">取 消</button>
              <button  @click="submitForm5('ruleForm5')">确定</button>
            </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
  import Vue from 'vue'
  import { getByStaffWeekly,listByExecutor,morePersonalResults,toPublishStaffComment,departmentList,
    listTaskExecutors,userTaskReply,impChangeOrdTask,publishWeekly,listReportingUsers,
    publishWeeklyRela,getTaskType,listAllUsers,getUsersObj,getProjectList,toPublishStaffWeekly,dragTask} from 'service/getData'
  import {ERR_OK,formatDateTime,ImportantLevel,isRepetition} from 'service/config'
  import { mapGetters} from 'vuex'
  import Sortable from 'sortablejs'
  import  store from '../../../store'
  export default {
    computed:{
      userView() {
        return this.singer.userView
      },
      ...mapGetters([
        'singer'
      ]),
    },
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
        value1:'',
        helper:[

        ],
        id:'',
        taskNumber:'',
        index:0,
        taskId:'',
        startDay:'',
        endDay:'',
        nextStartDay:'',
        nextEndDay:'',
        projects:[],
        Taskoptions:[],
        result:"",
        taskTotal:'',
        dialogVisible11:false,
        nextTaskTotal:'',
        taskTotalScore:'',
        performanceScore:'',
        evaluatingScore:'',
        dialogVisible:false,
        optionsObj: [],
        usersT:[],
        option2:isRepetition,
        users:[],
        overdueRate:'',
        delayRate:'',
        commentRate:'',
        stretch:false,
        depet:[],
        msg:"展开更多选项",
        dialogVisible5:false,
        options1:ImportantLevel,
        userName:'',
        expands:[],
        textarea:"",
        personComment:'',
        optionType:[],
        optionType1:[],
        tableData: [],
        ruleForm5: {
          username: '',
          percent: '',
        },
        tableDataCompany:[],
        tableDataDept:[],
        tableDataPerson:[],
        tableDataCommon:[],
        tableData5: [],
        nextPlan:false,
        dialogVisible22:false,
        checkedCities:[],
        checkedKey:[],
        checkedValue:[],
        ruleFormTask: {
          name: '',
          date1: '',
          region1: '',
          region: '',
          desc: '',
          telObj: '',
          content: '',
          value3: '',
          value4: '',
          value5: '',
          value6: '',
          value7: '',
          value71: [],
        },
        rulesTask: {
          telObj: [{
            required: true,
            message: '请选择任务汇报对象',
            trigger: 'change',
            type: 'number'
          }],
          name: [{
            required: true,
            message: '请输入任务标题',
          },{max: 50, message: '任务标题不能超过50个字符'}],
          username: [{
            required: true,
            message: '请填写姓名',
            type: 'number'
          }],
          percent: [{
            required: true,
            message: '请填写占比',
          },{ validator: checkPecent },
          { type: 'number', message: '占比必须为数字值'}],
          cause: [{
            required: true,
            message: '请输入取消原因',
          },{max: 200, message: '取消原因不能超过200个字符'}],
          cause1: [{
            required: true,
            message: '请输入延期原因',
            trigger: 'blur'
          },{max: 200, message: '延期原因不能超过200个字符'}],
          cause3: [{
            required: true,
            message: '请输入变更原因',
          },{max: 200, message: '变更原因不能超过200个字符'}],
          cause4: [{
            required: true,
            message: '请输入自我评价',
          },{max: 200, message: '自我评价不能超过200个字符'}],
          region1: [{
            required: true,
            message: '请选择关联项目',
          }],
          date1: [{
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
          },{max: 200, message: '自我评价不能超过200个字符'}],
          value3: [{
            required: true,
            message: '请选择任务重要等级',
          }],
          value4: [{
            required: true,
            message: '请选择任务类型',
            type: 'number'
          }],
          value5: [{
            required: true,
            message: '请选择任务执行人',
            type: 'number'
          }],
          value6: [{
            required: true,
            message: '请',
          }],
          value7: [{
            required: true,
            message: '请输入公告内容',
          }]
        },
        ruleForm: {
          name: '',
          desc:'',
        },
        planForm:{
          plan:'',
        },
        planRules:{
          plan:[{ required: true, message: '请填写本周总结', trigger: 'blur' }],
        },
        rules: {
          name: [],
          desc: [
            { required: true, message: '请填写本周总结', trigger: 'blur' },
          ]
        }
      }
    },
    components: {
//      Tab
    },
    created() {
      this.id =this.$route.query.id;
      if(this.id){
        this.getData()
      }else{
        this._toPublishStaffWeekly()
      }
    },
    mounted(){
      // this._getTaskType()
      // this._getTaskType()
      //this._listAllUsers()
      //this._getUsersObj();
      this.getProjectList1()
      this.listAllUsersT()
      this.departmentList1()
    },
    methods: {
      jump (index) {
        var jump = document.querySelectorAll('.d_jump')
        var total = jump[index].offsetTop
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
      importLevelChange(val,key){
        if(val=='PERSONALIMP'){
          if(this.tableData[key].executorId===''){
            this.$notify({
             title: '提示',
             message:'请完善任务'
           });
          }else{
            //this.taskMoreImport(key)
          }

        }
      },
      startWeek(){
      let user=store.state.singer.userView
        if(user=="STAFF"){
          this.sureNextPlan()
        }else{
          this.sureNextPlanDept()
        }
      },
      startExpend(row, expandedRows){

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
      handleCheckedCitiesChange(val) {
        this.checkedValue = val
      },
      handleClose22(done) {
        this.dialogVisible22 = false
        this.dialogVisible11 = false
      },
      handleClose11(){
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
//      个人普通数据双向绑定
      summary(fastSummary,index){
       if(this.tableDataCommon[index].fastSummary==""){
         this.tableDataCommon[index].summary=""
       }else if(this.tableDataCommon[index].fastSummary=="选择快捷总结"){
//         this.tableDataCommon[index].summary=""
       }else{
         this.tableDataCommon[index].summary=this.tableDataCommon[index].fastSummary
       }
      },
//      个人重点数据双向绑定
      summary1(fastSummary,index){
        if(this.tableDataPerson[index].fastSummary==""){
          this.tableDataPerson[index].summary=""
        }else if(this.tableDataPerson[index].fastSummary=="选择快捷总结"){
//          this.tableDataPerson[index].summary=""
        }else{
          this.tableDataPerson[index].summary=this.tableDataPerson[index].fastSummary
        }
      },
      summary2(fastSummary,index){
        if(this.tableDataDept[index].fastSummary==""){
          this.tableDataDept[index].summary=""
        }else if(this.tableDataDept[index].fastSummary=="选择快捷总结"){
//          this.tableDataDept[index].summary=""
        }else{
          this.tableDataDept[index].summary=this.tableDataDept[index].fastSummary
        }
      },
//      tableDataCompany
      summary3(fastSummary,index){
        if(this.tableDataCompany[index].fastSummary==""){
          this.tableDataCompany[index].summary=""
        }else if(this.tableDataCompany[index].fastSummary=="选择快捷总结"){
//          this.tableDataCompany[index].summary=""
        }else{
          this.tableDataCompany[index].summary=this.tableDataCompany[index].fastSummary
        }
      },
      inputChange(index){
        if(this.tableDataCompany[index].summary==""){
                this.tableDataCompany[index].fastSummary="选择快捷总结"
              }else if(this.tableDataCompany[index].summary=="暂缓"){
                this.tableDataCompany[index].fastSummary="暂缓"
              }else if(this.tableDataCompany[index].summary=="推进中"){
                this.tableDataCompany[index].fastSummary="推进中"
              }else if(this.tableDataCompany[index].summary=="完成"){
                this.tableDataCompany[index].fastSummary="完成"
              }
              else{
                this.tableDataCompany[index].fastSummary="选择快捷总结"
              }
      },
      inputChangeDept(index){
        if(this.tableDataDept[index].summary==""){
          this.tableDataDept[index].fastSummary="选择快捷总结"
        }else if(this.tableDataDept[index].summary=="暂缓"){
          this.tableDataDept[index].fastSummary="暂缓"
        }else if(this.tableDataDept[index].summary=="推进中"){
          this.tableDataDept[index].fastSummary="推进中"
        }else if(this.tableDataDept[index].summary=="完成"){
          this.tableDataDept[index].fastSummary="完成"
        }
        else{
          this.tableDataDept[index].fastSummary="选择快捷总结"
        }
      },
      inputChange3(index){
        if(this.tableDataPerson[index].summary==""){
          this.tableDataPerson[index].fastSummary="选择快捷总结"
        }else if(this.tableDataPerson[index].summary=="暂缓"){
          this.tableDataPerson[index].fastSummary="暂缓"
        }else if(this.tableDataPerson[index].summary=="推进中"){
          this.tableDataPerson[index].fastSummary="推进中"
        }else if(this.tableDataPerson[index].summary=="完成"){
          this.tableDataPerson[index].fastSummary="完成"
        }
        else{
          this.tableDataPerson[index].fastSummary="选择快捷总结"
        }
      },
      inputChange4(index){
        if(this.tableDataCommon[index].summary==""){
          this.tableDataCommon[index].fastSummary="选择快捷总结"
        }else if(this.tableDataCommon[index].summary=="暂缓"){
          this.tableDataCommon[index].fastSummary="暂缓"
        }else if(this.tableDataCommon[index].summary=="推进中"){
          this.tableDataCommon[index].fastSummary="推进中"
        }else if(this.tableDataCommon[index].summary=="完成"){
          this.tableDataCommon[index].fastSummary="完成"
        }
        else{
          this.tableDataCommon[index].fastSummary="选择快捷总结"
        }
      },
      //      个人重点数据双向绑定
      next1(summary,index){
        var self=this;
        if(this.tableDataPerson[index].summary==""){
          this.tableDataPerson[index].show=true;
        }else if(this.tableDataPerson[index].summary=="选择快捷总结"){
          this.tableDataPerson[index].show=true;
        }else{
          this.tableDataPerson[index].show=false;
        }
      },
      next2(summary,index){
        var self=this;
        if(this.tableDataDept[index].summary==""){
          this.tableDataDept[index].show=true;
        }else if(this.tableDataDept[index].summary=="选择快捷总结"){
          this.tableDataDept[index].show=true;
        }else{
          this.tableDataDept[index].show=false;
        }
      },
      next3(summary,index){
        var self=this;
        if(this.tableDataCompany[index].summary==""){
          this.tableDataCompany[index].show=true;
          this.tableDataCompany[index].fastSummary="选择快捷总结"
//          props.row.fastSummary
        }else if(this.tableDataCompany[index].summary=="选择快捷总结"){
          this.tableDataCompany[index].show=true;

        }else{
          this.tableDataCompany[index].show=false;
        }
      },
      //      个人普通数据双向绑定
      next(summary,index){
        var self=this;
        if(this.tableDataCommon[index].summary==""){
          this.tableDataCommon[index].show=true;
        }else if(this.tableDataCommon[index].summary=="选择快捷总结"){
          this.tableDataCommon[index].show=true;
        }else{
          this.tableDataCommon[index].show=false;
        }
      },
      handleClose5(done) {
        this.dialogVisible5 = false
        this.$refs['ruleForm5'].resetFields();
      },
      prev(value,index){
        this.tableDataCommon[index].show=true;
      },
      prev1(value,index){
        this.tableDataPerson[index].show=true;
      },
      prev2(value,index){
        this.tableDataDept[index].show=true;
      },
      prev3(value,index){
        this.tableDataCompany[index].show=true;
      },
      sure(taskId,index){
       if( this.tableDataCommon[index].weeklyPlan!=""){
         this._publishWeeklyRela(taskId,this.tableDataCommon[index].summary,this.tableDataCommon[index].weeklyPlan)
       }else{

       }
      },
      sure1(taskId,index){
        if( this.tableDataPerson[index].weeklyPlan!=""){
          this._publishWeeklyRela(taskId,this.tableDataPerson[index].summary,this.tableDataPerson[index].weeklyPlan)
        }else{

        }
      },
      sure2(taskId,index){
        if( this.tableDataDept[index].weeklyPlan!=""){
          this._publishWeeklyRela(taskId,this.tableDataDept[index].summary,this.tableDataDept[index].weeklyPlan)
        }else{

        }
      },
      sure3(taskId,index){
        if( this.tableDataCompany[index].weeklyPlan!=""){
          this._publishWeeklyRela(taskId,this.tableDataCompany[index].summary,this.tableDataCompany[index].weeklyPlan)
        }else{

        }
      },
      submitForm5(formName1) {
        let self = this
        this.$refs[formName1].validate((valid) => {
          if (valid) {
            console.log(self.ruleFormTask.value5,self.ruleForm5.username)
            if(self.ruleForm5.username === self.ruleFormTask.value5){
              self.$notify.error({
                title: '错误',
                message:'执行人和协助人不能相同',
              });
              return
            }
            if(self.helper[self.index].addUsers.length>0){
              for(let item of self.helper[self.index].addUsers){
                if(item.assistUserId === self.ruleForm5.username){
                  self.$notify.error({
                    title: '错误',
                    message:'不能选择相同的协助人',
                  });
                  return
                }
              }
            }
            self.dialogVisible5 = false
            let obj = {
              assistUserId: self.ruleForm5.username,
              proportion: self.ruleForm5.percent
            }
            this.helper[this.index].brr = []
            self.helper[self.index].addUsers.push(obj)
            for (var i = 0; i < self.usersT.length; i++) {
              for (var j = 0; j < self.helper[self.index].addUsers.length; j++) {
                if (self.usersT[i].userId === self.helper[self.index].addUsers[j].assistUserId) {
                  self.helper[self.index].brr.push({
                    username: self.usersT[i].userName,
                    proportion: self.helper[self.index].addUsers[j].proportion
                  })
                }
              }
            }
          } else {
            return false;
          }
        });
      },
      resetForm5(formName1) {
        this.dialogVisible5 = false
        this.$refs[formName1].resetFields();
      },
      removeTodo(index) {
        this.helper[this.index].brr.splice(index, 1);
        this.helper[this.index].addUsers.splice(index, 1);
      },
      resetForm(formName) {
        this.dialogVisible = false
        this.$refs[formName].resetFields();
      },
      submitForm(formName) {
        let self = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var value71 = self.ruleFormTask.value71.join(',')
            self.ruleFormTask.date1 = new Date(self.ruleFormTask.date1)
            if(self.ruleFormTask.date1==''){
              self.ruleFormTask.date1 = ""
            }else if(self.ruleFormTask.date1.toString().indexOf('GMT') != '-1'){
              self.ruleFormTask.date1  = new Date(formatDateTime(self.ruleFormTask.date1))
            }else if(this.tableData[self.index].planEndDate!=''&& this.tableData[self.index].planEndDate.toString().indexOf('GMT') == '-1'){
              this.tableData[self.index].planEndDate  = new Date(this.tableData[self.index].planEndDate)
            }

            self.tableData[self.index].title = self.ruleFormTask.name
            self.tableData[self.index].taskTypeId = self.ruleFormTask.value4
            self.tableData[self.index].grade = self.ruleFormTask.value3
            self.tableData[self.index].executorId = self.ruleFormTask.value5
            self.tableData[self.index].planEndDate = self.ruleFormTask.date1
            self.tableData[self.index].ptaskAssists = self.helper[self.index].addUsers
            self.tableData[self.index].reportId = self.ruleFormTask.telObj
            self.tableData[self.index].projectId = self.ruleFormTask.value7
            self.tableData[self.index].visibleRange = value71
            // self.tableData[self.index].repeatMode = self.ruleFormTask.value6
            self.tableData[self.index].content = self.ruleFormTask.content
            this.dialogVisible = false
            setTimeout(()=>{
              self._listByExecutor(self.ruleFormTask.value5,self.index,1,self.ruleFormTask.value4)
            },1000)

          } else {
            return false;
          }
        });
      },
      //任务超重
      // taskMoreImport(index){
      //   let self = this
      //   const params = {
      //     executorId:self.tableData[index].executorId,
      //     taskInfos:JSON.stringify(self.tableData)
      //   }
      //   morePersonalResults(params).then(function (res) {
      //     if (res.code == ERR_OK) {
      //       self.dialogVisible = false
      //     }else{
      //       if(self.dialogVisible == true){
      //         self.dialogVisible = true
      //       }
      //       //self.dialogVisible11 = true
      //       self.taskNumber = res.data.length
      //       self.Taskoptions = res.data
      //     }
      //
      //   })
      // },
//      发布周报
      sureNextPlan(){
        for(let item of this.tableData){
          if(item.planEndDate==''){
            item.planEndDate  = ""
          }else{
            item.planEndDate  = formatDateTime(item.planEndDate)
          }
        }
        for(let item of this.tableData){
          if(item.title == ''){
            this.$notify.info({
              title: '提示',
              message: '请填写任务标题'
            });
            return
          }else if(item.taskTypeId == ''){
            this.$notify.info({
              title: '提示',
              message: '请填写任务类型'
            });
            return
          }else if(item.grade == ''){
            this.$notify.info({
              title: '提示',
              message: '请填写任务重要等级'
            });
            return
          }else if(item.executorId == ''){
            this.$notify.info({
              title: '提示',
              message: '请填写执行人'
            });
            return
          }else if(item.planEndDate == ''){
            this.$notify.info({
              title: '提示',
              message: '请填写完成时间'
            });
            return
          }else if(item.plan == ''){
            this.$notify.info({
              title: '提示',
              message: '请填写任务计划'
            });
            return
          }else if(item.content == ''){
            this.$notify.info({
              title: '提示',
              message: '请完善任务'
            });
            return
          }
        }
        var weeklyId=this.$route.query.id
        var self=this;
        var params;
          if(weeklyId){
             params =　{
              comment:this.personComment,
              weeklyId:weeklyId,
              taskInfos:JSON.stringify(this.tableData)
            }
          }else{
            params =　{
              comment:this.personComment,
              taskInfos:JSON.stringify(this.tableData)
            }
          }
        publishWeekly(params).then(function (res) {
          if (res.code == ERR_OK) {
            self.$router.push({
             path:"/staffPersonWeekDetail",
             query:{id: res.data}
            });
            self.$notify({
              title: '提示',
              message: '发布周报成功',
              type: 'success'
            });
          }else{
            self.$notify.error({
              title: '提示',
              message:res.msg,
            });
          }

        })

      },
      sureNextPlanDept(){
        for(let item of this.tableData){
          if(item.planEndDate==''){
            item.planEndDate  = ""
          }else{
            item.planEndDate  = formatDateTime(item.planEndDate)
          }
        }
        for(let item of this.tableData){
          if(item.title == ''){
            this.$notify({
              title: '提示',
              message: '请填写任务标题',
            });
            return
          }else if(item.taskTypeId == ''){
            this.$notify({
              title: '提示',
              message: '请填写任务类型',
            });

            return
          }else if(item.grade == ''){
            this.$notify({
              title: '提示',
              message: '请填写任务重要等级',
            });
            return
          }else if(item.executorId === ''){
            this.$notify({
              title: '提示',
              message: '请填写执行人',
            });
            return
          }else if(item.planEndDate == ''){
            this.$notify({
              title: '提示',
              message: '请填写完成时间',
            });
            return
          }else if(item.plan == ''){
            this.$notify({
              title: '提示',
              message: '请填写任务计划',
            });
            return
          }else if(item.content === ''){
            this.$notify({
              title: '提示',
              message: '请完善任务',
            });
            return
          }
        }
        var weeklyId=this.$route.query.id
        var self=this;
        var params;
        if(weeklyId){
          params =　{
            comment:this.personComment,
            weeklyId:weeklyId,
            taskInfos:JSON.stringify(this.tableData)
          }
        }else{
          params =　{
            comment:this.personComment,
            taskInfos:JSON.stringify(this.tableData)
          }
        }
        toPublishStaffComment(params).then(function (res) {
          if (res.code == ERR_OK) {
            self. _toPublishStaffWeekly()
            self.$notify({
              title: '成功',
              message: '发布周报成功',
              type: 'success'
            });
            self.$router.push({ path:"/staffPersonWeekDetail",query:{id: res.data}})
          }else{
            self.$notify.error({
              title: '提示',
              message: res.msg
            });
          }

        })

      },
      handleClose(done) {
        this.dialogVisible = false
        this.$refs['ruleFormTask'].resetFields();
      },
      choseTime(val) {
        //this.ruleFormTask.value6 = val
      },
      iconEnter() {
        this.$refs.displayShow.style.display = 'block'
      },
      iconLeave() {
        this.$refs.displayShow.style.display = 'none'
      },
      // 模态框的选择任务类型
      choseTaskType1(val) {
        this.ruleFormTask.value4 = val
      },
      choseRelateProject(val) {
        this.ruleFormTask.value7 = val
      },
      choseTaskLevel(val){
        this.ruleFormTask.value3 = val
      },
//      完善任务
      completePerfect(val){
        this.dialogVisible=true
        let index = val
        this.index = val
        if(this.tableData[index].planEndDate==''){
          this.tableData[index].planEndDate=""
        }else if(this.tableData[index].planEndDate.toString().indexOf('GMT') != '-1'){
          this.tableData[index].planEndDate  = new Date(formatDateTime(this.tableData[index].planEndDate))
        }else if(this.tableData[index].planEndDate!=''&& this.tableData[index].planEndDate.toString().indexOf('GMT') == '-1'){
          this.tableData[index].planEndDate  = new Date(this.tableData[index].planEndDate)
        }
        this.ruleFormTask.name = this.tableData[index].title
        //this.ruleFormTask.value4 = this.tableData[index].taskTypeId
        this.ruleFormTask.value3 = this.tableData[index].grade
        this.ruleFormTask.value5 = this.tableData[index].executorId
        this.getUsersObj11(this.tableData[index].executorId,this.tableData[index].reportId,index)
        this._listByExecutor1(this.tableData[index].executorId,this.tableData[index].taskTypeId)
        this.ruleFormTask.date1 = this.tableData[index].planEndDate
        //this.ruleFormTask.telObj = this.tableData[index].reportId
        this.ruleFormTask.value7 = this.tableData[index].projectId
        if(this.tableData[index].visibleRange===''){
          this.ruleFormTask.value71 = []
        }else if(this.tableData[index].visibleRange.indexOf(',')<0){
          this.ruleFormTask.value71 = JSON.parse('['+parseInt(this.tableData[index].visibleRange)+']')
        }else{
          this.ruleFormTask.value71 = JSON.parse('[' + String(this.tableData[index].visibleRange.split(',')) + ']')
          //console.log(this.ruleForm.value71)
        }
        //this.ruleFormTask.value6 = this.tableData[index].repeatMode
        this.ruleFormTask.content = this.tableData[index].content
        //console.log(this.ruleFormTask.value5)
      },
      adduser() {
        this.dialogVisible5 = true
      },
      // // 汇报对象
      // _getUsersObj(userId) {
      //   const params = {
      //     userId:userId
      //   }
      //   this.optionsObj = []
      //   listReportingUsers(params).then((res) => {
      //     if (res.code == ERR_OK) {
      //       this.optionsObj = res.data
      //       var username;
      //       for (let i in this.optionsObj) {
      //         if (this.optionsObj[i].checked == true) {
      //           username = this.optionsObj[i].userId
      //         }
      //       }
      //       for (let i in this.tableData) {
      //         this.tableData[i].reportId = username
      //       }
      //     }
      //   })
      // },
      getUsersObj1(userId) {
        const params = {
          userId:userId
        }
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
      // 汇报对象
      getUsersObj11(userId,key,index) {
        const params = {
          userId:userId
        }
        listReportingUsers(params).then((res) => {
          if (res.code == ERR_OK) {
            this.optionsObj = res.data
            this.ruleFormTask.telObj = ''
            var username;
            var length = this.optionsObj.length;
            var i = 0;
            // 判断是否有该任务汇报对象
            if(key&&key!=0) {
              for (let i in this.optionsObj) {
                if(key!=this.optionsObj[i].userId){
                  i++;
                }
                if(i==length) {
                  for (let i in this.optionsObj) {
                    if (this.optionsObj[i].checked == true) {
                      this.ruleFormTask.telObj = this.optionsObj[i].userId
                    }
                  }
                }else{
                  this.ruleFormTask.telObj = key
                }
              }

            }else if(key===0){
              for (let i in this.optionsObj) {
                if(key!=this.optionsObj[i].userId){
                  i++;
                }
                if(i==length){
                  for (let i in this.optionsObj) {
                    if (this.optionsObj[i].checked == true) {
                      this.ruleFormTask.telObj = this.optionsObj[i].userId
                    }
                  }
                }else{
                  this.ruleFormTask.telObj = key
                }
              }
            }else{
              for (let i in this.optionsObj) {
                if (this.optionsObj[i].checked == true) {
                  this.ruleFormTask.telObj = this.optionsObj[i].userId
                }
              }
            }
          }
        })
      },
      goLink(val){
          if(val==false){
            this.getUsersObj1(this.ruleFormTask.telObj)
            console.log(this.ruleFormTask.value5)
            this._listByExecutor2(this.ruleFormTask.value5)
          }

      },
      goLink1(val,key){
        this._listByExecutor(val,key,0,'')
      },
      _listByExecutor(userId,key,value,taskType){
        let self = this
        const params = {
          userId:userId
        }
        listByExecutor(params).then((res) => {
          if(res.code == ERR_OK) {
            this.tableData[key].taskTypeId = ''
            this.optionType[key] = res.data
            this.optionType[key].unshift({
              taskTypeId:'',
              taskTypeName: '请选择任务类型'
            })
            Vue.set(this.optionType,key,this.optionType[key])
            if(value==1){
              this.tableData[key].taskTypeId = taskType
               console.log('11')
              // Vue.set(this.tableData[key],taskTypeId,value)

            }
          }
       })
      },
      _listByExecutor1(userId,key){
        let self = this
        const params = {
          userId:userId
        }
        listByExecutor(params).then((res) => {
          if(res.code == ERR_OK) {
            this.ruleFormTask.value4 = ''
            this.optionType1 = []
            this.optionType1 = res.data
            this.optionType1.unshift({
              taskTypeId:'',
              taskTypeName: '请选择任务类型'
            })
            this.ruleFormTask.value4 = key
            //Vue.set(this.optionType,key,this.optionType[key])
          }
       })
      },
      _listByExecutor2(userId){
        let self = this
        const params = {
          userId:userId
        }
        listByExecutor(params).then((res) => {
          if(res.code == ERR_OK) {
            this.ruleFormTask.value4 = ''
            this.optionType1 = []
            this.optionType1 = res.data
            this.optionType1.unshift({
              taskTypeId:'',
              taskTypeName: '请选择任务类型'
            })
          }
       })
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
      //      添加任务
      addTask(){
        this.tableData.push({
          title:'',
          planEndDate:'',
          taskTypeId:'',
          grade:'',
          executorId:'',
          plan:'',
          ptaskAssists:'',
          reportId:'',
          projectId:'',
          //repeatMode:'',
          content:'',
          visibleRange:''
        })
        this.helper.push(
          {
            addUsers:[],
            brr:[]
          }
        )
        this._listAllUsers()
        //this._getUsersObj()
      },
      _listAllUsers(){
        listTaskExecutors().then((res) => {
          if (res.code == ERR_OK) {
            this.users = res.data
            var username;
            for (let i in this.users) {
              if (this.users[i].checked==true) {
                username = this.users[i].userId
              }
            }
            var index = this.tableData.length-1
            this.tableData[index].executorId = username
          }
        })
      },
      // 获取任务类型
      // _getTaskType() {
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
//      确定总结和计划
      _publishWeeklyRela(taskId,summary,weeklyPlan){
        var self=this;
        var param={
          taskId:taskId,
          comment:summary,
          plan:weeklyPlan
        }
        publishWeeklyRela(param).then(function (res) {
          if(res.code == ERR_OK) {
            self.$notify({
              title: '提示',
              message:res.msg,
              type: 'success'
            });
            self.$refs['ruleForm'].resetFields();
            self.$refs['planForm'].resetFields();
            self.nextPlan=false;
            self.id =self.$route.query.id;
            if(self.id){
              self.getData()
            }else{
              self. _toPublishStaffWeekly()
            }
          }else{
            self.$notify.error({
              title: '提示',
              message:res.msg,
            });
          }
        })
      },
      //回复
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
              self.id =self.$route.query.id;
              if(self.id){
                self.getData()
              }else{
                self. _toPublishStaffWeekly()
              }
              self.$notify({
                title: '提示',
                message: '恭喜你，回复成功',
                type: 'success'
              });
            }else{
              self.$notify.error({
                title: '提示',
                message:res.msg,
              });
            }
          })
        }
      },
      // 初始化数据
      getData() {
        let self = this
        var weeklyId=this.$route.query.id
        var params;
        if(weeklyId){
           params = {
            weeklyId:this.id
          }
        }else{
          params = {

          }
        }
        getByStaffWeekly(params).then((res) => {
          if(res.code == ERR_OK) {
           if(res.data){
             self.result=res.data;
             self.startDay = res.data.startDay
             self.endDay = res.data.endDay
             self.nextStartDay = res.data.nextStartDay
             self.nextEndDay = res.data.nextEndDay
             self.taskTotal = res.data.taskTotal
             self.nextTaskTotal = res.data.nextTaskTotal
             self.taskTotalScore = res.data.taskTotalScore
             self.performanceScore = res.data.performanceScore
             self.evaluatingScore = res.data.evaluatingScore
             self.overdueRate = res.data.overdueRate
             self.delayRate = res.data.delayRate
             self.personComment = res.data.personComment
             self.commentRate = res.data.deptHeaderComment
             self.userName = res.data.userName
             if(res.data.taskWeeklyTaskVos){
               self.tableDataCompany = res.data.taskWeeklyTaskVos[0].taskWeeklyTaskListVos
               self.tableDataDept = res.data.taskWeeklyTaskVos[1].taskWeeklyTaskListVos
               self.tableDataPerson = res.data.taskWeeklyTaskVos[2].taskWeeklyTaskListVos
               self.tableDataCommon = res.data.taskWeeklyTaskVos[3].taskWeeklyTaskListVos
             }
             this.$nextTick(() => {
               this.setSort_company()
               this.setSort_dept()
               this.setSort_person()
               this.setSort_commonPerson()
             })
           }
          }
        })
      },
      _toPublishStaffWeekly(){
        let self = this
        toPublishStaffWeekly().then((res) => {
          if(res.code == ERR_OK) {
            if(res.data){
              self.result=res.data;
              self.startDay = res.data.startDay
              self.endDay = res.data.endDay
              self.nextStartDay = res.data.nextStartDay
              self.nextEndDay = res.data.nextEndDay
              self.taskTotal = res.data.taskTotal
              self.nextTaskTotal = res.data.nextTaskTotal
              self.taskTotalScore = res.data.taskTotalScore
              self.performanceScore = res.data.performanceScore
              self.evaluatingScore = res.data.evaluatingScore
              self.overdueRate = res.data.overdueRate
              self.delayRate = res.data.delayRate
              self.personComment = res.data.personComment
              self.commentRate = res.data.deptHeaderComment
              self.userName = res.data.userName
              if(res.data.taskWeeklyTaskVos){
                self.tableDataCompany = res.data.taskWeeklyTaskVos[0].taskWeeklyTaskListVos
                self.tableDataDept = res.data.taskWeeklyTaskVos[1].taskWeeklyTaskListVos
                self.tableDataPerson = res.data.taskWeeklyTaskVos[2].taskWeeklyTaskListVos
                self.tableDataCommon = res.data.taskWeeklyTaskVos[3].taskWeeklyTaskListVos
              }
              this.$nextTick(() => {
                this.setSort_company()
                this.setSort_dept()
                this.setSort_person()
                this.setSort_commonPerson()
              })
            }
          }
        })
      },
      enter(event){
        let el = event.target.childNodes[2]
        el.style.display = 'block'
      },
      leave(event){
        let el = event.target.childNodes[2]
        el.style.display = 'none'
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
        this.id =this.$route.query.id;
        if(this.id){
          let self = this
          var weeklyId=this.$route.query.id
          var params;
          if(weeklyId){
            params = {
              weeklyId:this.id
            }
          }else{
            params = {

            }
          }
          getByStaffWeekly(params).then((res) => {
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
        }else{
          toPublishStaffWeekly().then((res) => {
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

      }
    }
  };
</script>
<style lang="scss"  scoped>
  .special1 {
    position: relative;
  }
  .special1 i {
    position: absolute;
    right: -61px;
    top: 11px;
  }

  .circle-name span{
    margin-top: 10px;
    display: block;
  }
  .buton-prev{
    border: 1px solid #D83436;
    border-radius: 4px;
    width: 110px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 14px;
    color: #D93437;
    margin: 0px auto;
    margin-left: 83px;
    float: left;
    cursor: pointer;
  }
  .buton-sure{
    border: 1px solid #D83436;
    border-radius: 4px;
    width: 110px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 14px;
    color: #D93437;
    margin: 0px auto;
    margin-left: 83px;
    float: left;
    cursor: pointer;
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
    background: #ffffff;
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
    float: left;
  }
  .addTask{
    float: right;
    margin-right: 183px;
    border: 1px solid #D83436;
    border-radius: 4px;
    width: 83px;
    height:30px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    margin-top: 8px;
    cursor: pointer;
    color: #D93437;
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
  .icon_type{
    display:inline-block;
    margin-top:2px;
  }
  .start_new{
    font-size: 16px;
    color: #333333;
    margin-top: 15px;
  }
  .button-router{
    border: 1px solid #D83436;
    border-radius: 4px;
    font-size: 14px;
    color: #D93437;
    height: 30px;
    line-height: 30px;
    width: 130px;
    text-align: center;
    margin: 25px auto;
    cursor: pointer;
  }
  .user-wrapper::after {
    content: "";
    display: block;
    clear: both;
  }
  .user-item,
  .user-left,
  .user-right{
    float: left;
  }
  .user-right-wrapper {
    width: 392px;
    margin-left: 10px;
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
  .err{
    color: #ff4949;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
  }
  .addPercent {
    position: relative;
  }
  .addPercent span {
    position: absolute;
    right: -25px;
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
  .user-item span{
    width: 95px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    display: inline-block;
  }
  .user-item i {
    position: absolute;
    z-index: 100;
    color: #999;
    top: -7px;
    right: -7px;
  }
  .evaluate{
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    min-height: 140px;
  .evaluate_content{
    padding-left: 20px;
    padding-top: 16px;
    padding-bottom: 16px;
    padding-right: 20px;
    font-size: 14px;
    color: #434343;
  }
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

  .nav-position{
    position: relative;
  }
</style>
