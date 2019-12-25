<template>
  <div class='task-manage'>
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <span class="child1">任务管理</span> / <span class="child2">任务列表</span>
      </div>
      <div class="task-list">
        <div class="take-task">
          <div class="take-top-wrapper">
            <div class="take-left">
              <div class="take-top">
                任务列表
              </div>
            </div>
            <div class="take-right" @click='mindTask'>
              发起任务
            </div>
          </div>
          <div class="take-bottom">
            <div class="task-item" v-bind:class="{ active: isActive}" @click='uncomplete'>
              未完成
            </div>
            <div class="task-item" v-bind:class="{ active: isActive1}" @click='completed'>
              其他任务
            </div>
            <div class="task-item" v-bind:class="{ active: isActive2}" @click='waitCome'>
              待完善
            </div>
          </div>
        </div>
        <el-table
          :data="result"
          row-key="taskId"
          :expand-row-keys="expands"
          @row-click="openDetails"
          @expand="startExpend"
          style="width: 100%" empty-text='暂无数据'>
          <el-table-column type="expand" v-show='hello'>
            <template slot-scope="props">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="内容:">
                      <span class='content-tab'>{{ props.row.content }}</span>
                    </el-form-item>
                    <el-form-item>
                      <div v-if='isActive==true||isActive1==true'>
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
                      <div v-if='isActive==true||isActive1==true'>
                        <div class="reback reback1">
                          开始日期：{{ props.row.planStartDate }}
                        </div>
                        <div class="reback reback1">
                          截止日期：{{ props.row.planEndDate  }}
                        </div>
                      </div>
                      <!-- <div class="reback reback1">
                        自动回复：{{props.row.repeatRule }}
                      </div> -->
                    </el-form-item>
                    <el-form-item>
                      <!-- <div class="special">
                           特别
                      </div> -->
                    </el-form-item>
                  </el-form>
                </template>
          </el-table-column>
          <el-table-column label="任务标题" prop="title ">
            <template slot-scope="props">
                  <router-link :to="{ path: 'taskDetail',query: {id:props.row.taskId}}" style="color:#505363;">
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
                <div v-if='isActive==true||isActive1==true'>
                  <div v-if='props.row.lastTaskReplyer!=null'>
                    <div v-if='props.row.lastReplyStatus=="UNREAD"' style="color:rgb(217, 52, 55)">

                      <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                    </div>
                    <div v-if='props.row.lastReplyStatus=="READED"'>

                      <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
                    </div>
                  </div>
                </div>
                </template>
          </el-table-column>
          <el-table-column label="任务状态" prop="taskStatusStr" min-width='50'>
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
                  <span v-if='show1==true'>
                      <span v-if='props.row.justAssistTask==false'>
                        <span v-if='props.row.hadremind==false'>
                        <!-- <el-button
                          size="small"
                         :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='cancle(props.row.taskId)'>取消</el-button> -->
                         <el-button
                           size="small"
                          class='complete' v-if='props.row.taskStatus=="UNCOMPLETION"' @click='cancle(props.row.taskId,$event)'>取消</el-button>

                        <!-- <el-button
                          size="small"
                          :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='delay(props.row.taskId,props.row.planEndDate)'>延期</el-button> -->
                          <el-button
                            size="small"
                             class='complete' v-if='props.row.taskStatus=="UNCOMPLETION"'   @click='delay(props.row.taskId,props.row.planEndDate,$event)'>延期</el-button>

                          <!-- <el-button
                            size="small"
                            :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='levelChange(props.row.taskId)'>等级变更</el-button> -->
                            <el-button
                              size="small"
                              class='complete' v-if='props.row.taskStatus=="UNCOMPLETION"' @click='levelChange(props.row.taskId,$event)'>等级变更</el-button>


                            <!-- <el-button
                              size="small"
                              :plain="true" :disabled="true" class='disable-button' v-if='props.row.taskStatus!="UNCOMPLETION"' @click='levelComeplete(props.row.taskId)'>完成</el-button> -->
                              <el-button
                                size="small"
                                class='complete' v-if='props.row.taskStatus=="UNCOMPLETION"' @click='levelComeplete(props.row.taskId,$event)'>完成</el-button>
                          </span>
                          <span v-else>
                            <el-button
                              size="small"
                              class='complete' @click='levelComeplete(props.row.taskId,$event)'>确认完成</el-button>
                              <el-button
                                size="small"
                                class='complete' @click='unCompleteTask(props.row.taskId,$event)'>未完成</el-button>
                          </span>
                      </span>
                      <span v-if='props.row.justAssistTask==true'>
                        <router-link :to="{ path: 'taskDetail',query: {id:props.row.taskId}}">
                      <el-button
                        size="small"
                        class='complete'>查看</el-button>
                      </router-link>
                      </span>
                      </span>
                          <router-link :to="{ path: 'taskDetail',query: {id:props.row.taskId}}">
                        <el-button
                          size="small"
                          class='complete' v-if='show2==true'>查看</el-button>
                        </router-link>
                        <el-button
                          size="small"
                          class='complete' v-if='show3==true' @click='editorTask(props.row.taskId,$event)'>编辑任务</el-button>
                </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-depart" v-show='noData'>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 15, 50]" :page-size="pageShow" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
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
            <div style="margin-left:4px;margin-bottom:18px;" class="clearfix">
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
                <el-date-picker type="date" placeholder="选择日期" :picker-options="pickerOptions0" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
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
            <!-- <el-form-item label="任务标题:" prop="name" style="margin-right: 40px !important;">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item> -->
            <!-- <el-form-item label="执行人:" prop="value5" required style="margin-right: 40px !important;">
              <el-select v-model="ruleForm.value5" filterable placeholder="请选择执行人" style="width:100%;" @change='goLink'>
                <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="任务类型:" prop="value4" required style="margin-right: 40px !important;">
              <el-select v-model="ruleForm.value4" placeholder="请选择类型" style="width:100%;" @click="choseTaskType1">
                <el-option v-for="item in optionType" :key="item.taskTypeId" :label="item.taskTypeName" :value="item.taskTypeId">
                </el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="任务汇报对象:" required prop="telObj" style="margin-right: 40px !important;">
              <el-select v-model="ruleForm.telObj" filterable placeholder="请选择任务汇报对象" style="width:100%;">
                <el-option v-for="item in optionsObj" :key="item.userId" :label="item.userName" :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="任务重要等级:" prop="value3" required class="special1" style="margin-right: 40px !important;">
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
            </el-form-item> -->
            <!-- <el-form-item label="完成时间:" required style="margin-right: 40px !important;height:36px;">
              <el-form-item prop="date1">
                <el-date-picker type="date" placeholder="选择日期" :picker-options="pickerOptions0" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-form-item> -->
            <!-- <el-form-item label="任务内容：" prop="content" style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm.content"></el-input>
            </el-form-item> -->
            <div v-show="stretch">
              <div class="user-wrapper" style="line-height:32px;margin-bottom:13px;margin-left:21px;">
                <div class='user-left'>任务协助人：</div>
                <div style="float:left;" class='user-right-wrapper'>
                  <div class='user-right' @click='adduser'>添加协助人</div>
                  <div class="user-item ellipsis" v-for='(item,index) in brr'>
                    <span class="ellipsis" style="display: inline-block;width: 100%;">{{item.username}}（{{item.proportion}}%）</span>
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
                <el-select multiple v-model="ruleForm.value71" placeholder="请选择部门"  style="width:100%;">
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
        <!--取消任务模态窗-->
        <el-dialog title="申请取消任务" :visible.sync="dialogVisible1" size="tiny" :before-close="handleClose1" top='25%' class=" noticeManageModel">
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
        <el-dialog title="申请任务延期" :visible.sync="dialogVisible2" size="tiny" :before-close="handleClose2" top='25%' class=" noticeManageModel">
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
              <button  @click="resetForm2('ruleForm2')">取 消</button>
              <button  @click="submitForm2('ruleForm2')">确定</button>
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
        <!--完成任务-->
        <el-dialog title="完成任务" :visible.sync="dialogVisible4" size="tiny" :before-close="handleClose4" top='25%' class=" noticeManageModel">
          <el-form :model="ruleForm4" :rules="rules" ref="ruleForm4" label-width="112px" class="demo-ruleForm">
            <el-form-item label="自我评价：" prop="cause4" required style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm4.cause4"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <button  @click="resetForm4('ruleForm4')">取 消</button>
              <button  @click="submitForm4('ruleForm4')">确定</button>
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
      <div class="">
        <!--添加协助人-->
        <el-dialog title="添加协助人" :visible.sync="dialogVisible5" size="tiny" :before-close="handleClose5" top='25%' class=" noticeManageModel">
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
              <el-input v-model="ruleForm5.percent"></el-input><span>%</span>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <button  @click="resetForm5('ruleForm5')">取 消</button>
              <button  @click="submitForm5('ruleForm5')">确定</button>
            </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
// 注意标签和引入驼峰，可以有区别
import {
  userTaskList,
  resetTaskRemindFlag,
  userTaskReply,
  sureEditorTask,
  editorTaskMain,
  departmentList,
  impChangeOrdTask,
  getUsersObj,
  listTaskExecutors,
  getTaskType,
  publishTask,
  listAllUsers,
  getProjectList,
  cancelTaskCause,
  listReportingUsers,
  getStaffAssisTask1,
  listByExecutor,
  delayTaskCause,
  changeTaskLevel,
  seeReplyStatus,
  listDraftTask,
  completeTask,
  dragTask
} from 'service/getData'
//import Tab from 'components/common/tab'
import {  ERR_OK } from 'service/config'
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
      isActive: true,
      isActive1: false,
      isActive2: false,
      show1: true,
      ruleForm25: {
        username: '',
        percent1:'',
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
      show3: false,
      expands:[],
      stretch:false,
      msg:"展开更多选项",
      show2: false,
      dialogVisible11:false,
      activeName: false,
      currentPage4: 1,
      depet:[],
      title: '',
      taskId: '',
      value1: '',
      justAssistTask:false,
      value2: '',
      restaurants: [],
      checkedKey:[],
      addUsers131:[],
      brr13:[],
      brr:[],
      state1: '',
      state2: '',
      addUsers: [],
      users: [],
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
      dialogVisible25:false,
      projects: [],
      optionsObj: [],
      checkedCities: [],
      checkedValue: [],
      Taskoptions:[],
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible22:false,
      dialogVisible5: false,
      hello: false,
      taskNumber:'',
      nowPage: 1,
      noData: true,
      pageShow: 10,
      total: 100,
      taskTypeId: '',
      result: [],
      optionType: [],
      usersT:[],
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
      options: [{
        value: 'NOREPEAT',
        label: '永不'
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
      ruleForm: {
        name: '',
        date1: '',
        region1: '',
        region: '',
        content: '',
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
      replyValue: '',
      rules: {
        telObj: [{
          required: true,
          message: '请选择任务汇报对象',
          type: 'number'
        }, ],
        name: [{
          required: true,
          message: '请输入任务标题',

        },
         {max: 50, message: '任务标题不能超过50个字符'}
      ],
        username: [{
          required: true,
          message: '请填写姓名',
          type: 'number'
        } ],
        percent: [{
          required: true,
          message: '请填写占比',
        }, { validator: checkPecent }],
        cause: [{
          required: true,
          message: '请输入取消原因',
        }, {max: 200, message: '取消原因不能超过200个字符'}],
        cause1: [{
          required: true,
          message: '请输入延期原因',
        }, {max: 200, message: '延期原因不能超过200个字符'}],
        cause3: [{
          required: true,
          message: '请输入变更原因'
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
        region: [{
          required: true,
          message: '请选择活动区域',
        }],
        content: [{
          required: true,
          message: '请输入任务内容',
        },{max: 200, message: '任务内容不能超过200个字符'} ],
        value3: [{
          required: true,
          message: '请选择任务重要等级',
        }, ],
        value4: [{
          required: true,
          message: '请选择任务类型',
          type: 'number'
        }, ],
        value5: [{
          required: true,
          message: '请选择任务执行人',
          type: 'number'
        }, ],
        value6: [{
          required: true,
          message: '请自动重复时间'
        }, ],
        value7: [{
          required: true,
          message: '请输入公告内容'
        }, ],
      },
      arrow:false,
      tableData5: []
    };
  },
  components: {
//    Tab
  },
  mounted() {
    this.getData(false, 1, 10)
    //this.getTaskType1()
    this.listAllUsers1()
    this.listAllUsersT()
    this.getProjectList1()
    //this.getUsersObj1()
    this.departmentList1()//获取部门
  },
  methods: {
    iconEnter2(){
      this.$refs.displayShow2.style.display = 'block'
    },
    iconLeave2(){
      this.$refs.displayShow2.style.display = 'none'
    },
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
              self.getData2(self.nowPage, self.pageShow)
              self.$notify({
                title: '成功',
                message: '编辑任务成功',
                type: 'success'
              });
            }else {
              self.$notify.error({
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
    handleClose22(done) {
      this.dialogVisible22 = false
      this.dialogVisible11 = false
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
            this.$notify({
              title: '提示',
              message: '请选择要降为个人普通等级的任务',
            });
          }
        })
      }
    },
    checkDelete(){
      this.dialogVisible22 = false
      //this.dialogVisible11 = false
    },
    handleCheckedCitiesChange(val) {
      this.checkedValue = val
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
    handleClose11(){
      this.dialogVisible11 = false
    },
    choseTime(val) {
      //this.ruleForm.value6 = val
    },
    removeTodo(index) {
      this.brr.splice(index, 1);
      this.addUsers.splice(index, 1);
    },
    adduser() {
      this.dialogVisible5 = true

    },
    searchContent() {
      this.getData1(this.nowPage, this.pageShow)
    },
    choseLevel(val) {
      this.value2 = val
      this.getData1(this.nowPage, this.pageShow)
    },
    choseLevel3(val) {
      this.ruleForm3.value3 = val
    },
    // 模态框的选择任务类型
    choseTaskType1(val) {
      this.ruleForm.value4 = val
    },
    choseTaskType(val) {
      this.value1 = val
      this.getData1(this.nowPage, this.pageShow)
    },
    choseRelateProject(val) {
      this.ruleForm.value7 = val
    },
    choseUsers(val) {
      this.ruleForm.value5 = val
    },
    choseUsers2(val) {
      this.ruleForm5.userName = val
    },
    getUsersObj1(userId) {
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
    listAllUsers1() {
      listTaskExecutors().then((res) => {
        if (res.code == ERR_OK) {
          this.users = res.data
          // this.users.unshift({
          //   userId: '',
          //   userName: '请选择执行人'
          // })
          var userId1 = localStorage.getItem('userId')
          for (let i in this.users) {
            if (this.users[i].checked == true) {
              this.ruleForm.value5 = this.users[i].userId
            }
          }
          this.getUsersObj1(this.ruleForm.value5)
          this._listByExecutor(this.ruleForm.value5)
        }
      })
    },
    _listByExecutor(userId){
      let self = this
      const params = {
        userId:userId
      }
      listByExecutor(params).then((res) => {
        if(res.code == ERR_OK) {
          this.ruleForm.value4 = ''
          this.optionType = res.data
          this.optionType.unshift({
            taskTypeId:'',
            taskTypeName: '请选择任务类型'
          })
        }
     })
    },
    goLink(val){
      this.getUsersObj1(val)
      this._listByExecutor(val)
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
    replyTask(index,val,event) {
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
        message:'回复内容不能超过200个字符！'
        });
      }else if (el.trim().length<=0) {
        this.$notify({
        title: '提示',
        message:'回复内容不能为空！'
        });
      }else{
        userTaskReply(params).then((res) => {
          if (res.code == ERR_OK) {
            if (self.isActive == true) {
              //completed = false
              self.getData(false, self.nowPage, self.pageShow)
            } else {
              self.getData1(this.nowPage, this.pageShow)
            }

            self.$notify({
              title: '成功',
              message: '恭喜你，回复成功',
              type: 'success'
            });
          }else{
            self.$notify.error({
              title: '错误',
              message: res.msg
            });
          }
        })
      }

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
      this.ruleForm.value71=[]
      //this.getTaskType1()
      this.listAllUsers1()
      this.getProjectList1()
      //this.getUsersObj1()
    },
    getData(completed, nowPage, pageShow) {
      let self = this
      const params = {
        completed: completed,
        nowPage: nowPage,
        pageShow: pageShow
      }
      self.result=[]
      userTaskList(params).then((res) => {
        if (res.code == ERR_OK) {
          self.total = res.data.totalCount
          self.result = res.data.result
          // self.result = res.data.result
          this.$nextTick(() => {
            this.setSort_noTask(self.result)
          })
          if (res.data.result == '') {
            self.noData = false
          } else {
            self.noData = true
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
          var completed;
          if (this.isActive == true) {
            completed = false
            this.getData(completed, this.nowPage, this.pageShow)
          } else if(this.isActive1 == true) {
            completed = true
            this.getData1(this.nowPage, this.pageShow)
          }else if(this.isActive2 == true) {
            completed = true
            this.getData2(this.nowPage, this.pageShow)
          }
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
    setSort_noTask(){
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        onEnd: evt => {
          var oldIndex=evt.oldIndex;
          var newIndex=evt.newIndex;
          if(oldIndex>newIndex){
            if(newIndex==0){
              this._dragTask(this.result[oldIndex].taskId,'',this.result[newIndex].taskId,1)
            }else{
              this._dragTask(this.result[oldIndex].taskId,this.result[newIndex-1].taskId,this.result[newIndex].taskId,1)
            }
          }else{
            if(newIndex==0){
              this._dragTask(this.result[oldIndex].taskId,'',this.result[newIndex].taskId,1)
            }else if(newIndex==this.result.length-1){
              this._dragTask(this.result[oldIndex].taskId,this.result[newIndex].taskId,'',1)
            }else{
              if(newIndex>=this.result.length){
                this._dragTask(this.result[oldIndex].taskId,this.result[newIndex-1].taskId,'',1)
              }else{
                this._dragTask(this.result[oldIndex].taskId,this.result[newIndex].taskId,this.result[newIndex+1].taskId,1)
              }
            }
          }
        }
      })
    },
    getData1(nowPage, pageShow) {
      let self = this
      const params = {
        nowPage: nowPage,
        pageShow: pageShow
      }
      self.result=[]
      getStaffAssisTask1(params).then((res) => {
        if (res.code == ERR_OK) {
          self.total = res.data.totalCount
          self.result = res.data.result
          this.$nextTick(() => {
            this.setSort_noTask(self.result)
          })
          if (res.data.result == '') {
            self.noData = false
          } else {
            self.noData = true
          }
        }
      })
    },
    getData2(nowPage, pageShow) {
      let self = this
      const params = {
        nowPage: nowPage,
        pageShow: pageShow
      }
      self.result=[]
      listDraftTask(params).then((res) => {
        if (res.code == ERR_OK) {
          self.total = res.data.totalCount
          self.result = res.data.result
          this.$nextTick(() => {
            this.setSort_noTask(self.result)
          })
          if (res.data.result == '') {
            self.noData = false
          } else {
            self.noData = true
          }
        }
      })
    },
    waitCome () {
      this.show1 = false
      this.show2 = false
      this.show3 = true
      this.isActive = false
      this.isActive1 = false
      this.isActive2 = true
      this.getData2(this.nowPage, this.pageShow)
    },
    uncomplete() {
      this.show1 = true
      this.show2 = false
      this.show3 = false
      this.isActive = true
      this.isActive1 = false
      this.isActive2 = false
      this.getData(false, this.nowPage, this.pageShow)
    },
    completed() {
      this.isActive = false
      this.isActive1 = true
      this.isActive2 = false
      this.show1 = false
      this.show2 = true
      this.show3 = false
      this.getData1(this.nowPage, this.pageShow)
      //this.getData(true,this.nowPage,this.pageShow)
    },
    handleSizeChange(val) {
//      console.log(`每页 ${val} 条`);
      this.pageShow = val
      var completed
      if (this.isActive == true) {
        completed = false
        this.getData(completed, this.nowPage, this.pageShow)
      } else if (this.isActive2 == true) {
        this.getData2(this.nowPage, this.pageShow)
      }else{
        completed = true
        this.getData1(this.nowPage, this.pageShow)
      }
    },
    handleCurrentChange(val) {
//      console.log(`当前页: ${val}`);
      this.nowPage = val
      var completed
      if (this.isActive == true) {
        completed = false
        this.getData(completed, this.nowPage, this.pageShow)
      } else if (this.isActive2 == true) {
        this.getData2(this.nowPage, this.pageShow)
      }else {
        completed = true
        this.getData1(this.nowPage, this.pageShow)
      }
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
      if(this.ruleForm.name.trim().length>50){
        this.$notify.error({
          title: '错误',
          message:'任务标题不能超过50个字符'
        });
        return false;
      }
      var time;
      var value71 = this.ruleForm.value71.join(',')
      if(self.ruleForm.date1 == '') {
        time = ''
      }else{
        let d = new Date(self.ruleForm.date1)
        time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      }

      const params = {
        title: self.ruleForm.name,
        taskTypeId: self.ruleForm.value4,
        executorId: self.ruleForm.value5,
        reportId: self.ruleForm.telObj,
        projectId: self.ruleForm.value7,
        grade: self.ruleForm.value3,
        visibleRange:value71,
        ptaskAssists: JSON.stringify(self.addUsers),
        planEndDate: time,
        draftTask:true,
        content: self.ruleForm.content
      }
      publishTask(params).then((res) => {
        if (res.code == ERR_OK) {
          self.dialogVisible = false
          self.isActive = true
          self.isActive1 = false
          self.isActive2 = false
          self.getData(false, self.nowPage, self.pageShow)
          this.$refs[formName].resetFields();
          this.$notify({
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
        title: self.ruleForm.name,
        taskTypeId: self.ruleForm.value4,
        executorId: self.ruleForm.value5,
        reportId: self.ruleForm.telObj,
        projectId: self.ruleForm.value7,
        grade: self.ruleForm.value3,
        visibleRange:value71,
        ptaskAssists: JSON.stringify(self.addUsers),
        planEndDate: time,
        content: self.ruleForm.content
      }
      publishTask(params).then((res) => {
        if (res.code == ERR_OK) {
          self.dialogVisible = false
          self.isActive = true
          self.isActive1 = false
          self.isActive2 = false
          self.getData(false, self.nowPage, self.pageShow)
          this.$refs[formName].resetFields();
          this.$notify({
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
      this.dialogVisible2 = true
      this.pickerOptions1 = {
        disabledDate(time) {
          return time.getTime() - 8.64e7 < date;
        }
      }
    },
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
    levelComeplete(val,event) {
      var e = event;
      if(e&&e.stopPropagation){
          e.stopPropagation()
      }else if(window.event){
          window.event.cancelBubble=true;
      }
      this.taskId = val
      this.dialogVisible4 = true
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
              self.$refs[formName1].resetFields()
              self.getData(false, self.nowPage, self.pageShow)
              this.$notify({
                title: '成功',
                message: '申请取消原因已发送',
                type: 'success'
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
    resetForm1(formName1) {
      this.dialogVisible1 = false
      this.$refs[formName1].resetFields();
    },
    handleClose2(done) {
      this.dialogVisible2 = false
      this.$refs['ruleForm2'].resetFields();
    },
    submitForm2(formName1) {
      let self = this
      //console.log(self.ruleForm2.date1)
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
              self.dialogVisible2 = false
              self.$refs[formName1].resetFields()
              self.getData(false, self.nowPage, self.pageShow)
              this.$notify({
                title: '成功',
                message: '申请任务延期已发送',
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
    resetForm2(formName1) {
      this.dialogVisible2 = false
      this.$refs[formName1].resetFields();
    },
    handleClose3(done) {
      this.dialogVisible3 = false
      this.$refs['ruleForm3'].resetFields();
    },
    submitForm3(formName1) {
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
              self.dialogVisible3 = false
              self.$refs[formName1].resetFields()
              self.getData(false, self.nowPage, self.pageShow)
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
    resetForm3(formName1) {
      this.dialogVisible3 = false
      this.$refs[formName1].resetFields();
    },
    handleClose4(done) {
      this.dialogVisible4 = false
      this.$refs['ruleForm4'].resetFields();
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
            self.getData(false, self.nowPage, self.pageShow)
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
    submitForm4(formName1) {
      let self = this
      this.$refs[formName1].validate((valid) => {
        if (valid) {
          const params = {
            taskId: self.taskId,
            comment: self.ruleForm4.cause4
          }
          completeTask(params).then((res) => {
            if (res.code == ERR_OK) {
              self.dialogVisible4 = false
              self.$refs[formName1].resetFields()
              self.getData(false, self.nowPage, self.pageShow)
              this.$notify({
                title: '成功',
                message: '完成任务已发送',
                type: 'success'
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
    resetForm4(formName1) {
      this.dialogVisible4 = false
      this.$refs[formName1].resetFields();
    },
    handleClose5(done) {
      this.dialogVisible5 = false
      this.$refs['ruleForm5'].resetFields();
    },
    submitForm5(formName1) {
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
          self.dialogVisible5 = false

          let obj = {
            assistUserId: self.ruleForm5.username,
            proportion: self.ruleForm5.percent
          }

          self.addUsers.push(obj)
          this.brr = []
          for (var i = 0; i < self.usersT.length; i++) {
            for (var j = 0; j < self.addUsers.length; j++) {
              if (self.usersT[i].userId === self.addUsers[j].assistUserId) {
                self.brr.push({
                  username: self.usersT[i].userName,
                  proportion: self.addUsers[j].proportion
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
    resetForm5(formName1) {
      this.dialogVisible5 = false
      this.$refs[formName1].resetFields();
    },
    iconEnter() {
      this.$refs.displayShow.style.display = 'block'
    },
    iconLeave() {
      this.$refs.displayShow.style.display = 'none'
    }
  }
};
</script>
<style lang="scss"  scoped>
.task-list {
    background: #EFEFEF;
    box-shadow: 0 2px 11px 0 rgba(0,0,0,0.07);
    border-radius: 6px;
}
.take-task {
    height: 91px;
    margin: 0 auto;
    background-color: #fff;
    border-left: 1px solid #dfe6ec;
    border-right: 1px solid #dfe6ec;
}
.take-left {
    width: 265px;
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
    font-size: 14px;
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
    margin-top: 10px;
}
.take-bottom .task-item:first-child {
    margin-right: 5px;
}
.take-bottom .task-item:last-child {
    margin-left: 5px;
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
    background: #FFBF00;
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
    width: 78px;
    height: 24px;
    margin-top: 4px;
    margin-left: 25px;
    cursor: pointer;
}
.addPercent {
    position: relative;
}
.addPercent span {
    position: absolute;
    right: -25px;
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
</style>
