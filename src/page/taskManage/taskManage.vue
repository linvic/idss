<template>
    <div class="task-manage">
        <!--<tab></tab>-->
        <div class="wrapper">
            <div class="router-wrapper">
                <span class="child1">任务管理</span> /
                <span class="child2">任务列表</span>
            </div>
            <div class="task-list">
                <div class="take-task">
                    <div class="take-top-wrapper">
                        <div class="take-left"><div class="take-top">任务列表</div></div>
                        <div class="take-right" @click="mindTask">发起任务</div>
                    </div>
                    <div class="take-bottom">
                        <div class="task-item" v-bind:class="{ active: isActive }" @click="uncomplete">待处理</div>
                        <div class="task-item" v-bind:class="{ active: isActive1 }" @click="completed">全部任务</div>
                    </div>
                </div>

                <el-table
                    :data="result"
                    row-key="id"
                    :expand-row-keys="expands"
                    @row-click="openDetails"
                    @expand="startExpend"
                    style="width: 100%"
                    empty-text="暂无数据">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="内容:">
                                    <span class="content-tab">{{props.row.content}}</span>
                                </el-form-item>
                                <el-form-item>
                                    <div v-if="isActive == true || isActive1 == true">
                                        <div class="input-back">
                                            <input type="text" name="" value="" class="inputValue" />
                                            <span @click="replyTask( props.row.index, props.row.id, $event)"
                                                class="replyValue">回复</span>
                                        </div>
                                        <div class="" v-for="item in props.row.taskReplys">
                                            <div class="reback-time">{{ item.replyTimeDistanceDesc }}</div>
                                            <div class="reback" style="max-width: 294px;min-width: 296px;overflow:hidden;">
                                                <div style="float:left;">{{item.userName}}：</div>
                                                <div style="float:left;max-width: 247px;word-break: break-all; word-wrap:break-word;">{{ item.replyContent }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item label="">
                                    <div class="">概要：</div>
                                    <div class="reback reback1">发布人：{{props.row.createByName}}</div>
                                    <div class="reback reback1">执行人：{{props.row.executorName}}</div>
                                    <div v-if=" isActive == true || isActive1 == true ">
                                        <div class="reback reback1">开始日期：{{props.row.submitTime}}</div>
                                        <div class="reback reback1">截止日期：{{props.row.planEndDate}}</div>
                                    </div>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column label="任务标题" prop="title ">
                        <template slot-scope="props">
                            <router-link
                                :to="{path: 'taskDetail', query: { id: props.row.id }}" style="color:#505363;">
                                <div>{{ props.row.title }}</div>
                            </router-link>
                            <div>
                                <div class="title-right" style="border:none;">
                                    {{ props.row.taskTypeName }}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="最新动态" prop="name">
                        <template slot-scope="props">
                            <div v-if="isActive == true || isActive1 == true">
                                <div v-if="props.row.taskReplyIds != null">
                                    <div v-if=" props.row.lastReplyStatus == 'UNREAD'" style="color:rgb(217, 52, 55)">
                                        <span>{{props.row.lastTaskReplyer}}：</span><span>{{props.row.lastTaskReplyContent}}</span>
                                    </div>
                                    <div v-if="props.row.lastReplyStatus == 'READED'">
                                        <span>{{props.row.lastTaskReplyer}}：</span><span>{{props.row.lastTaskReplyContent}}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="任务状态"
                        prop="taskStatusStr"
                        min-width="50">
                        <template slot-scope="props">
                            <span>
                                <div>
                                    <img
                                        class="icon_type"
                                        v-if="props.row.iconType == 'FINISHU'"
                                        src="../../images/lateTime2.png"
                                        alt=""
                                    />
                                    <img
                                        class="icon_type"
                                        v-if="props.row.iconType == 'FINISHUW'"
                                        src="../../images/timeLate.png"
                                        alt=""
                                    />
                                    <img
                                        class="icon_type"
                                        v-if="props.row.iconType == 'EXCELLENT'"
                                        src="../../images/icon_excellent.png"
                                        alt=""
                                    />
                                    <img
                                        class="icon_type"
                                        v-if="props.row.iconType == 'GOOD'"
                                        src="../../images/icon_good.png"
                                        alt=""
                                    />
                                    <img
                                        class="icon_type"
                                        v-if="props.row.iconType == 'SECONDARY'"
                                        src="../../images/icon_well.png"
                                        alt=""
                                    />
                                    <img
                                        class="icon_type"
                                        v-if="
                                            props.row.iconType == 'DIFFERENCE'
                                        "
                                        src="../../images/icon_bad.png"
                                        alt=""
                                    />
                                    <img
                                        class="icon_type"
                                        v-if="props.row.iconType == 'POOR'"
                                        src="../../images/icon_worse.png"
                                        alt=""/>
                                    <span style="color:#D93437;">{{props.row.taskStatusName}}</span>
                                </div>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="props">
                            
                                        <el-button
                                            size="small"
                                            class="complete"
                                            @click="cancle(props.row.id, $event)">取消</el-button>

                                        <el-button
                                            size="small"
                                            class="complete"
                                            @click="delay( props.row.id, props.row.planEndDate, $event)">延期</el-button>
                                        <el-button
                                            size="small"
                                            class="complete"
                                            @click="levelComeplete( props.row.id, $event)">完成</el-button>

                            <span v-if="show1 == true">
                                <span v-if="props.row.justAssistTask == false">
                                    <span v-if="props.row.hadremind == false">
                                        <el-button
                                            size="small"
                                            class="complete"
                                            v-if="props.row.taskStatus == 'UNCOMPLETION'"
                                            @click="cancle(props.row.id, $event)">取消</el-button>

                                        <el-button
                                            size="small"
                                            class="complete"
                                            v-if="props.row.taskStatus == 'UNCOMPLETION'"
                                            @click="delay( props.row.id, props.row.planEndDate, $event)">延期</el-button>
                                        <el-button
                                            size="small"
                                            class="complete"
                                            v-if="props.row.taskStatus == 'UNCOMPLETION'"
                                            @click="levelComeplete( props.row.id, $event)">完成</el-button>
                                    </span>
                                    <span v-else>
                                        <el-button
                                            size="small"
                                            class="complete"
                                            @click="levelComeplete(props.row.id,$event)">确认完成</el-button>
                                        <el-button
                                            size="small"
                                            class="complete"
                                            @click="unCompleteTask(props.row.id,$event)">未完成</el-button>
                                    </span>
                                </span>
                                <span v-if="props.row.justAssistTask == true">
                                    <router-link :to="{path: 'taskDetail', query: { id: props.row.id }}">
                                        <el-button size="small" class="complete">查看</el-button>
                                    </router-link>
                                </span>
                            </span>
                            <router-link
                                :to="{path: 'taskDetail',query: { id: props.row.id }}">
                                <el-button
                                    size="small"
                                    class="complete"
                                    v-if="show2 == true">查看</el-button>
                            </router-link>
                            <el-button
                                size="small"
                                class="complete"
                                v-if=" props.row.taskStatus == 'TOSUBMIT' || props.row.taskStatus == 'APPROVEPASS' "
                                @click="editorTask(props.row.id, $event)">编辑任务</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-depart" v-show="noData">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage4"
                    :page-sizes="[10, 15, 50]"
                    :page-size="pageShow"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
            <div class="">
                <!--发布任务模态窗-->
                <el-dialog
                    title="发起任务"
                    :visible.sync="dialogVisible"
                    size="tiny"
                    :before-close="handleClose"
                    top="10%"
                    class=" noticeManageModel">
                    <el-form
                        :model="ruleForm"
                        :rules="rules"
                        ref="ruleForm"
                        label-width="112px"
                        class="demo-ruleForm">
                        <div style="margin-left:32px;margin-bottom:18px;overflow:hidden;">
                            <span style="float:left;line-height:36px;"><label style="color:#ff4949">* </label>任务标题:</span>
                            <el-input v-model="ruleForm.name" style="width:363px;margin-left:12px;float:left;" ></el-input>
                        </div>
                        <div style="margin-left:46px;margin-bottom:18px;overflow:hidden;" >
                            <span style="float:left;vertical-align:middle;line-height:36px;" >
                                <label style="color:#ff4949">* </label>执行人:</span>
                            <span style="width:363px;margin-left:12px;float:left;">
                                <el-select v-model="ruleForm.executorId" filterable placeholder="请选择执行人" style="width:100%;" @change="goLink">
                                    <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
                                </el-select>
                            </span>
                        </div>
                        
            
                        <div style="margin-left:32px;margin-bottom:18px;overflow:hidden;"  >
                            <span style="float:left;vertical-align:middle;line-height:36px;" >
                                <label style="color:#ff4949">* </label>任务类型:
                            </span>
                            <span style="width:363px;margin-left:12px;float:left;" >
                                <el-select
                                    v-model="ruleForm.taskTypeId"
                                    placeholder="请选择类型"
                                    style="width:100%;"
                                    @click="choseTaskType1" >
                                    <el-option
                                        v-for="item in optionType"
                                        :key="item.taskTypeId"
                                        :label="item.taskTypeName"
                                        :value="item.taskTypeId" >
                                    </el-option>
                                </el-select>
                            </span>
                        </div>
                        <div
                            style="margin-left:4px;margin-bottom:18px;overflow:hidden;"
                        >
                            <span
                                style="float:left;vertical-align:middle;line-height:36px;"
                            >
                                <label style="color:#ff4949">* </label
                                >任务汇报对象:
                            </span>
                            <span
                                style="width:363px;margin-left:12px;float:left;"
                            >
                                <el-select
                                    v-model="ruleForm.telObj"
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
                            </span>
                        </div>
                        <div
                            style="margin-left:18px;margin-bottom:18px;"
                            class="clearfix">
                            <span
                                style="float:left;vertical-align:middle;line-height:36px;"
                            >
                                <label style="color:#ff4949">* </label
                                >任务工作量:
                            </span>
                            <span
                                style="width:363px;margin-left:12px;float:left;"
                                class="special1"
                            >
                                <el-select
                                    v-model="ruleForm.taskWorkload"
                                    placeholder="请选择任务工作量"
                                    style="width:100%;"
                                >
                                    <el-option v-for="item in 10" :key="item" :label="item" :value="item"></el-option>
                                </el-select>
                                <i
                                    class="el-icon-information"
                                    style="float:left;margin-right: 40px !important;"
                                    @mouseenter="iconEnter"
                                    @mouseleave="iconLeave"
                                ></i>
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
                                <el-date-picker
                                    type="date"
                                    placeholder="选择日期"
                                    :picker-options="pickerOptions0"
                                    v-model="ruleForm.date1"
                                    style="width: 100%;"
                                ></el-date-picker>
                            </span>
                        </div>
                        <div style="margin-left:32px;margin-bottom:18px;overflow:hidden;" >
                            <span style="float:left;vertical-align:middle;line-height:36px;" >
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
                                <el-select v-model="ruleForm.taskGroupId" placeholder="请选择关联项目" style="width:100%;">
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
                                <el-select
                                    v-model="ruleForm.projectId"
                                    placeholder="请选择关联项目"
                                    style="width:100%;"
                                    @click="choseRelateProject" >
                                    <el-option
                                        v-for="item in projects"
                                        :key="item.projectId"
                                        :label="item.projectName"
                                        :value="item.projectId"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="任务可见范围:"
                                style="margin-right: 40px !important;"
                            >
                                <el-select
                                    multiple
                                    v-model="ruleForm.value71"
                                    placeholder="请选择部门"
                                    style="width:100%;"
                                >
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
                                <i
                                    :class="
                                        stretch
                                            ? 'el-icon-arrow-up'
                                            : 'el-icon-arrow-down'
                                    "
                                ></i>
                            </div>
                        </div>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <button @click="resetForm('ruleForm')">取 消</button>
                        <button @click="submitForm(0)" class="saveDrafts">保存草稿</button>
                        <button @click="submitForm(1)">发布任务</button>
                    </span>
                </el-dialog>
            </div>

            <div class="">
                <!--取消任务模态窗-->
                <el-dialog
                    title="申请取消任务"
                    :visible.sync="dialogVisible1"
                    size="tiny"
                    :before-close="handleClose1"
                    top="25%"
                    class=" noticeManageModel">
                    <el-form
                        :model="ruleForm1"
                        :rules="rules"
                        ref="ruleForm1"
                        label-width="112px"
                        class="demo-ruleForm">
                        <el-form-item
                            label="取消原因："
                            prop="cause"
                            required
                            style="margin-right: 40px !important;">
                            <el-input
                                type="textarea"
                                v-model="ruleForm1.cause"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <button @click="resetForm1('ruleForm1')">取 消</button>
                        <button @click="submitForm1('ruleForm1')">确定</button>
                    </span>
                </el-dialog>
            </div>
            <div class="">
                <!--延期任务模态窗-->
                <el-dialog
                    title="申请任务延期"
                    :visible.sync="dialogVisible2"
                    size="tiny"
                    :before-close="handleClose2"
                    top="25%"
                    class=" noticeManageModel">
                    <el-form
                        :model="ruleForm2"
                        :rules="rules"
                        ref="ruleForm2"
                        label-width="112px"
                        class="demo-ruleForm">
                        <el-form-item
                            label="延期时间:"
                            required
                            style="margin-right: 40px !important;height:36px;">
                            <el-form-item prop="date1">
                                <el-date-picker
                                    type="date"
                                    :picker-options="pickerOptions1"
                                    placeholder="选择日期"
                                    v-model="ruleForm2.date1"
                                    style="width: 100%;"
                                ></el-date-picker>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item
                            label="延期原因："
                            prop="cause1"
                            required
                            style="margin-right: 40px !important;">
                            <el-input
                                type="textarea"
                                v-model="ruleForm2.cause1"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <button @click="resetForm2('ruleForm2')">取 消</button>
                        <button @click="submitForm2('ruleForm2')">确定</button>
                    </span>
                </el-dialog>
            </div>

            <div class="">
                <!--完成任务-->
                <el-dialog
                    title="完成任务"
                    :visible.sync="dialogVisible4"
                    size="tiny"
                    :before-close="handleClose4"
                    top="25%"
                    class=" noticeManageModel">
                    <el-form
                        :model="ruleForm4"
                        :rules="rules"
                        ref="ruleForm4"
                        label-width="112px"
                        class="demo-ruleForm">
                        
                        <el-form-item label="自评打分：" prop="score4" required style="margin-right: 40px !important;">
                        <el-input v-model="ruleForm4.score4"></el-input>
                        </el-form-item>
                        <el-form-item label="任务总结：" prop="cause4" required style="margin-right: 40px !important;">
                        <el-input type="textarea" v-model="ruleForm4.cause4"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <button @click="resetForm4('ruleForm4')">取 消</button>
                        <button @click="submitForm4('ruleForm4')">确定</button>
                    </span>
                </el-dialog>
            </div>
            <div class="deleteDepartment">
                <el-dialog
                    title="个人重点任务超出提醒"
                    :visible.sync="dialogVisible11"
                    size="tiny"
                    :before-close="handleClose11"
                    top="25%"
                    class="department">
                    <p>您/他当前的个人重点任务数量为：{{ taskNumber }}</p>
                    <p>您可将已有个人重点任务改为个人普通任务</p>
                    <p>已超出数量限制</p>
                    <p style="color: #D93437;">是否确定修改？</p>
                    <span slot="footer" class="dialog-footer">
                        <button @click="dialogVisible11 = false">取 消</button>
                        <button @click="sureDelete">确 定</button>
                    </span>
                </el-dialog>
            </div>
            <div class="">
                <el-dialog
                    title="重设任务工作量"
                    :visible.sync="dialogVisible22"
                    size="tiny"
                    :before-close="handleClose22"
                    top="10%"
                    class=""
                >
                    <div class="permissions-table">
                        <div class="check-wrapper-special">
                            <el-checkbox-group
                                v-model="checkedCities"
                                @change="handleCheckedCitiesChange"
                            >
                                <el-checkbox
                                    v-for="item in Taskoptions"
                                    :label="item.taskId"
                                    :key="item.taskId"
                                    >{{ item.title }}</el-checkbox
                                >
                            </el-checkbox-group>
                        </div>
                    </div>
                    <span
                        slot="footer"
                        class="dialog-footer"
                        style="margin-top:10px;"
                    >
                        <button @click="checkDelete">取 消</button>
                        <button @click="sureRole">确 定</button>
                    </span>
                </el-dialog>
            </div>
            <div class="">
                <!--添加任务组成员-->
                <el-dialog
                    title="添加任务组成员"
                    :visible.sync="dialogVisible25"
                    size="tiny"
                    :before-close="handleClose25"
                    top="25%"
                    class=" noticeManageModel">
                    <el-form
                        :model="ruleForm25"
                        :rules="rules"
                        ref="ruleForm25"
                        label-width="112px"
                        class="demo-ruleForm">
                        <el-form-item
                            label="姓名:"
                            prop="username"
                            style="margin-right: 40px !important;">
                            <el-select
                                v-model="ruleForm25.username"
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
                        <button @click="resetForm25('ruleForm25')">
                            取 消
                        </button>
                        <button @click="submitForm25('ruleForm25')">
                            确定
                        </button>
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
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
import moment from 'moment'
import {
    listMyPendingTask,
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
    saveDraftTask,
    getTaskGroupList,
    listAllUsers,
    getProjectList,
    cancelTaskCause,
    listReportingUsers,
    listPersonalAllByPage,
    listByExecutor,
    delayTaskCause,
    changeTaskLevel,
    seeReplyStatus,
    completeTask,
    dragTask
} from "service/getData";
//import Tab from 'components/common/tab'
import { ERR_OK } from "service/config";
import Sortable from "sortablejs";
export default {
    data() {
        //    占比正则
        var checkPecent = (rule, value, callback) => {
            if (!value) {
                return callback();
            } else {
                var reg = /(^(([1-9][0-9]*)|((([1-9][0-9]*)|0)\.[0-9]{1,2}))$)/;
                if (!reg.test(value) || value >= 100) {
                    callback(new Error("请输入有效的占比"));
                } else {
                    if (value.length > 20) {
                        callback(new Error("数值不能超过20个字符"));
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
            pickerOptions1: {},
            isActive: true,
            isActive1: false,
            show1: true,
            ruleForm25: {
                username: ""
            },
            rules31: {
                becomCuase1: [
                    {
                        required: true,
                        message: "请填写审核原因"
                    },
                    { max: 200, message: "审核原因不能超过200个字符" }
                ],
                becomCuase2: [
                    {
                        required: true,
                        message: "请填写审核原因"
                    },
                    { max: 200, message: "审核原因不能超过200个字符" }
                ],
                becomCuase3: [
                    {
                        required: true,
                        message: "请填写审核原因"
                    },
                    { max: 200, message: "审核原因不能超过200个字符" }
                ],
                becomCuase4: [
                    {
                        required: true,
                        message: "请填写审核原因"
                    },
                    { max: 200, message: "审核原因不能超过200个字符" }
                ],
                mass: [
                    {
                        required: true,
                        message: "请选择完成质量"
                    }
                ],
                rate: [
                    {
                        required: true,
                        message: "请选择快速评价"
                    }
                ],
                rateContent: [
                    {
                        required: true,
                        message: "请填写任务评价"
                    },
                    { max: 200, message: "任务评价不能超过200个字符" }
                ],
                name: [
                    { required: true, message: "请输入任务标题" },
                    { max: 50, message: "任务标题不能超过50个字符" }
                ],
                title: [
                    { required: true, message: "请输入任务标题" },
                    { max: 50, message: "任务标题不能超过50个字符" }
                ],
                username: [
                    { required: true, message: "请填写姓名", type: "number" }
                ],
                cause: [
                    { required: true, message: "请输入取消原因" },
                    { max: 200, message: "取消原因不能超过200个字符" }
                ],
                cause1: [
                    { required: true, message: "请输入延期原因" },
                    { max: 200, message: "延期原因不能超过200个字符" }
                ],
                reply: [{ required: true, message: "请输入回复内容" }],
                cause3: [
                    { required: true, message: "请输入变更原因" },
                    { max: 200, message: "变更原因不能超过200个字符" }
                ],
                reportId: [{ required: true, message: "请选择任务汇报对象" }],
                date1: [
                    { type: "date", required: true, message: "请选择日期" }
                ],
                content: [
                    { required: true, message: "请输入任务内容" },
                    { max: 200, message: "任务内容不能超过200个字符" }
                ],
                content: [
                    { required: true, message: "请输入任务内容" },
                    { max: 200, message: "任务内容不能超过200个字符" }
                ],
                modifyReason: [
                    { required: true, message: "请输入修改原因" },
                    { max: 200, message: "修改原因不能超过200个字符" }
                ],
                
                taskWorkload: [
                    {
                        required: true,
                        message: "请选择任务工作量"
                    }
                ],
                taskWorkload: [
                    {
                        required: true,
                        message: "请选择任务工作量"
                    }
                ],
                taskTypeId: [
                    {
                        required: true,
                        message: "请选择任务类型",
                        type: "number"
                    }
                ],
                taskTypeId: [
                    {
                        required: true,
                        message: "请选择任务类型",
                        type: "number"
                    }
                ],
                executorId: [
                    {
                        required: true,
                        message: "请选择任务执行人",
                        type: "number"
                    }
                ],
                executorId: [
                    {
                        required: true,
                        message: "请选择任务执行人",
                        type: "number"
                    }
                ],
                value16: [
                    {
                        required: true,
                        message: "请选择自动回复时间"
                    }
                ],
                projectId: [
                    {
                        required: true,
                        message: "请输入公告内容"
                    }
                ],
                value17: [
                    {
                        required: true,
                        message: "请输入公告内容"
                    }
                ],
                grades: [
                    {
                        required: true,
                        message: "请选择重要等级"
                    }
                ]
            },
            expands: [],
            stretch: false,
            msg: "展开更多选项",
            show2: false,
            dialogVisible11: false,
            activeName: false,
            currentPage4: 1,
            depet: [],
            title: "",
            taskId: "",
            value1: "",
            justAssistTask: false,
            value2: "",
            restaurants: [],
            checkedKey: [],
            addUsers131: [],
            brr13: [],
            brr: [],
            state1: "",
            state2: "",
            addUsers: [],
            users: [],
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
            dialogVisible10: false,
            dialogVisible25: false,
            projects: [],
            optionsObj: [],
            checkedCities: [],
            checkedValue: [],
            Taskoptions: [],
            dialogVisible: false,
            dialogVisible1: false,
            dialogVisible2: false,
            dialogVisible4: false,
            dialogVisible22: false,
            dialogVisible5: false,
            hello: false,
            taskNumber: "",
            nowPage: 1,
            noData: true,
            pageShow: 10,
            total: 100,
            taskTypeId: "",
            result: [],
            optionType: [],
            groupLists: [], // 任务组
            usersT: [],
            brr: [],
            option2: [
                {
                    value: "NOREPEAT",
                    label: "永不"
                },
                {
                    value: "REPEATDAILY",
                    label: "每天重复"
                },
                {
                    value: "REPEATWEEKLY",
                    label: "每周重复"
                },
                {
                    value: "REPEATMONTHLY",
                    label: "每月重复"
                }
            ],
            options: [
                {
                    value: "NOREPEAT",
                    label: "永不"
                },
                {
                    value: "选项2",
                    label: "部门负责人"
                },
                {
                    value: "选项3",
                    label: "部门负责人"
                },
                {
                    value: "选项4",
                    label: "部门负责人"
                },
                {
                    value: "选项5",
                    label: "部门负责人"
                }
            ],
            value: "",
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
                cause: ""
            },
            ruleForm2: {
                cause1: "",
                date1: ""
            },
            ruleForm4: {
                cause4: ""
            },
            ruleForm5: {
                username: ""
            },
            replyValue: "",
            rules: {
                telObj: [
                    {
                        required: true,
                        message: "请选择任务汇报对象",
                        type: "number"
                    }
                ],
                name: [
                    {
                        required: true,
                        message: "请输入任务标题"
                    },
                    { max: 50, message: "任务标题不能超过50个字符" }
                ],
                username: [
                    {
                        required: true,
                        message: "请填写姓名",
                        type: "number"
                    }
                ],
                cause: [
                    {
                        required: true,
                        message: "请输入取消原因"
                    },
                    { max: 200, message: "取消原因不能超过200个字符" }
                ],
                cause1: [
                    {
                        required: true,
                        message: "请输入延期原因"
                    },
                    { max: 200, message: "延期原因不能超过200个字符" }
                ],
                cause3: [
                    {
                        required: true,
                        message: "请输入变更原因"
                    },
                    { max: 200, message: "变更原因不能超过200个字符" }
                ],
                score4: [
                    {
                        required: true,
                        message: "请输入自评分值"
                    }
                ],
                cause4: [
                    {
                        required: true,
                        message: "请输入任务总结"
                    },
                    { max: 200, message: "不能超过200个字符" }
                ],
                date1: [
                    {
                        type: "date",
                        required: true,
                        message: "请选择日期"
                    }
                ],
                content: [
                    {
                        required: true,
                        message: "请输入任务内容"
                    },
                    { max: 200, message: "任务内容不能超过200个字符" }
                ],
                taskWorkload: [
                    {
                        required: true,
                        message: "请选择任务工作量"
                    }
                ],
                taskTypeId: [
                    {
                        required: true,
                        message: "请选择任务类型",
                        type: "number"
                    }
                ],
                executorId: [
                    {
                        required: true,
                        message: "请选择任务执行人",
                        type: "number"
                    }
                ],
                projectId: [
                    {
                        required: true,
                        message: "请输入公告内容"
                    }
                ]
            },
            arrow: false,
            tableData5: []
        };
    },
    components: {
        //    Tab
    },
    mounted() {
        this.getData(false, 1, 10);
        //this.getTaskType1()
        this.listAllUsers1();
        this.listAllUsersT();
        this.getProjectList1();
        //this.getUsersObj1()
        this.departmentList1(); //获取部门

        this.getTaskGroupLists(); //获取任务组
    },
    methods: {
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
        handleClose10() {
            this.dialogVisible10 = false;
            this.$refs["ruleForm31"].resetFields();
        },
        openDetails(row, event, column) {
            Array.prototype.remove = function(val) {
                let index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
            if (this.expands.indexOf(row.id) < 0) {
                this.expands = [];
                this.expands.push(row.id);
            } else {
                this.expands.remove(row.id);
            }
        },
        //获取部门
        departmentList1() {
            let self = this;
            departmentList().then(res => {
                if (res.code == ERR_OK) {
                    let data = res;
                    self.depet = data.data.result;
                    self.depet.unshift({ deptId: 0, deptName: "公司" });
                }
            });
        },
        listAllUsersT() {
            listAllUsers().then(res => {
                if (res.code == ERR_OK) {
                    this.usersT = res.data;
                }
            });
        },
        //      则面板
        Collapse() {
            this.stretch = !this.stretch;
            if (this.stretch) {
                this.msg = "收起更多选项";
            } else {
                this.msg = "展开更多选项";
            }
        },
        handleClose22(done) {
            this.dialogVisible22 = false;
            this.dialogVisible11 = false;
        },
        startExpend(row, expanded) {
            console.log(row, expanded)
            if (row.lastReplyStatus == "UNREAD" && expanded == true) {
                this.seeReplyContent(row.lastTaskReplyId);
            }
        },
        seeReplyContent(taskReplyId) {
            const params = {
                taskReplyId: taskReplyId
            };
            seeReplyStatus(params).then(res => {
                if (res.code == ERR_OK) {
                }
            });
        },
        sureRole() {
            if (this.checkedValue.length > 0) {
                var str = this.checkedValue.join(",");
                const params = {
                    taskId: str
                };
                impChangeOrdTask(params).then(res => {
                    if (res.code == ERR_OK) {
                        this.dialogVisible22 = false;
                        //this.dialogVisible11 = false
                        this.$notify({
                            title: "成功",
                            message: "任务成功降为个人普通等级",
                            type: "success"
                        });
                    } else {
                        this.$notify({
                            title: "提示",
                            message: "请选择要降为个人普通等级的任务"
                        });
                    }
                });
            }
        },
        checkDelete() {
            this.dialogVisible22 = false;
            //this.dialogVisible11 = false
        },
        handleCheckedCitiesChange(val) {
            this.checkedValue = val;
        },
        sureDelete() {
            this.checkedCities = [];
            this.checkedKey = [];
            this.dialogVisible11 = false;
            if (this.taskNumber <= 0) {
                this.$notify({
                    title: "提示",
                    message: "个人普通任务数量不够，请先去创建个人普通任务吧！"
                });
            } else {
                this.dialogVisible22 = true;
            }
        },
        handleClose11() {
            this.dialogVisible11 = false;
        },
        removeTodo(index) {
            this.brr.splice(index, 1);
            this.addUsers.splice(index, 1);
        },
        adduser() {
            this.dialogVisible5 = true;
        },
        searchContent() {
            this.getData1(this.nowPage, this.pageShow);
        },
        choseLevel(val) {
            this.value2 = val;
            this.getData1(this.nowPage, this.pageShow);
        },
        // 模态框的选择任务类型
        choseTaskType1(val) {
            this.ruleForm.taskTypeId = val;
        },
        choseTaskType(val) {
            this.value1 = val;
            this.getData1(this.nowPage, this.pageShow);
        },
        choseRelateProject(val) {
            this.ruleForm.projectId = val;
        },
        choseUsers(val) {
            this.ruleForm.executorId = val;
        },
        choseUsers2(val) {
            this.ruleForm5.userName = val;
        },
        getUsersObj1(userId) {
            const params = {
                userId: userId
            };
            this.optionsObj = [];
            this.ruleForm.telObj = "";
            listReportingUsers(params).then(res => {
                if (res.code == ERR_OK) {
                    this.optionsObj = res.data;
                    for (let i in this.optionsObj) {
                        if (this.optionsObj[i].checked == true) {
                            this.ruleForm.telObj = this.optionsObj[i].userId;
                        }
                    }
                }
            });
        },

        // 获取任务组列表
        getTaskGroupLists() {
          getTaskGroupList().then((res) => {
            if (res.code == ERR_OK) {
              this.groupLists = res.data;
            }
          })
        },
        
        listAllUsers1() {
            listTaskExecutors().then(res => {
                if (res.code == ERR_OK) {
                    this.users = res.data;
                    // this.users.unshift({
                    //   userId: '',
                    //   userName: '请选择执行人'
                    // })
                    var userId1 = localStorage.getItem("userId");
                    for (let i in this.users) {
                        if (this.users[i].checked == true) {
                            this.ruleForm.executorId = this.users[i].userId;
                        }
                    }
                    this.getUsersObj1(this.ruleForm.executorId);
                    this._listByExecutor(this.ruleForm.executorId);
                }
            });
        },
        _listByExecutor(userId) {
            let self = this;
            const params = {
                userId: userId
            };
            listByExecutor(params).then(res => {
                if (res.code == ERR_OK) {
                    this.ruleForm.taskTypeId = "";
                    this.optionType = res.data;
                }
            });
        },
        goLink(val) {
            this.getUsersObj1(val);
            this._listByExecutor(val);
        },
        getProjectList1() {
            getProjectList().then(res => {
                if (res.code == ERR_OK) {
                    this.projects = res.data.result;
                    this.projects.unshift({
                        projectId: "",
                        projectName: "请选择关联项目"
                    });
                }
            });
        },
        replyTask(index, val, event) {
            let el = event.target.parentNode.childNodes[0].value;
            this.taskId = val;
            let self = this;
            const params = {
                taskId: this.taskId,
                replyDesc: el
            };
            if (el.trim().length > 200) {
                this.$notify({
                    title: "提示",
                    message: "回复内容不能超过200个字符！"
                });
            } else if (el.trim().length <= 0) {
                this.$notify({
                    title: "提示",
                    message: "回复内容不能为空！"
                });
            } else {
                userTaskReply(params).then(res => {
                    if (res.code == ERR_OK) {
                        if (self.isActive == true) {
                            //completed = false
                            self.getData(false, self.nowPage, self.pageShow);
                        } else {
                            self.getData1(this.nowPage, this.pageShow);
                        }

                        self.$notify({
                            title: "成功",
                            message: "恭喜你，回复成功",
                            type: "success"
                        });
                    } else {
                        self.$notify.error({
                            title: "错误",
                            message: res.msg
                        });
                    }
                });
            }
        },
        mindTask() {
            this.ruleForm.name = "";
            this.ruleForm.taskTypeId = "";
            this.ruleForm.taskWorkload = "";
            this.ruleForm.date1 = "";
            this.ruleForm.content = "";
            this.dialogVisible = true;
            this.addUsers = [];
            this.brr = [];
            this.ruleForm.projectId = "";
            this.ruleForm.value71 = [];
            //this.getTaskType1()
            this.listAllUsers1();
            this.getProjectList1();
            //this.getUsersObj1()
        },
        getData(completed, nowPage, pageShow) {
            let self = this;
            const params = {
                completed: completed,
                nowPage: nowPage,
                pageShow: pageShow
            };
            self.result = [];
            listMyPendingTask(params).then(res => {
                if (res.code == ERR_OK) {
                    self.total = res.data.totalCount;
                    self.result = res.data.result;
                    // self.result = res.data.result
                    this.$nextTick(() => {
                        this.setSort_noTask(self.result);
                    });
                    if (res.data.result == "") {
                        self.noData = false;
                    } else {
                        self.noData = true;
                    }
                }
            });
        },
        //  拖动排序接口
        _dragTask(sourceTaskId, targetBeforeTaskId, targetAfterTaskId, num) {
            const param = {
                sourceTaskId: sourceTaskId,
                targetBeforeTaskId: targetBeforeTaskId,
                targetAfterTaskId: targetAfterTaskId
            };
            dragTask(param).then(res => {
                if (num == 1) {
                    var completed;
                    if (this.isActive == true) {
                        completed = false;
                        this.getData(completed, this.nowPage, this.pageShow);
                    } else if (this.isActive1 == true) {
                        completed = true;
                        this.getData1(this.nowPage, this.pageShow);
                    }
                }
                if (res.code == ERR_OK) {
                } else {
                    this.$notify.error({
                        title: "错误",
                        message: res.msg
                    });
                }
            });
        },
        setSort_noTask() {
            const el = document.querySelectorAll(
                ".el-table__body-wrapper > table > tbody"
            )[0];
            this.sortable = Sortable.create(el, {
                onEnd: evt => {
                    var oldIndex = evt.oldIndex;
                    var newIndex = evt.newIndex;
                    if (oldIndex > newIndex) {
                        if (newIndex == 0) {
                            this._dragTask(
                                this.result[oldIndex].taskId,
                                "",
                                this.result[newIndex].taskId,
                                1
                            );
                        } else {
                            this._dragTask(
                                this.result[oldIndex].taskId,
                                this.result[newIndex - 1].taskId,
                                this.result[newIndex].taskId,
                                1
                            );
                        }
                    } else {
                        if (newIndex == 0) {
                            this._dragTask(
                                this.result[oldIndex].taskId,
                                "",
                                this.result[newIndex].taskId,
                                1
                            );
                        } else if (newIndex == this.result.length - 1) {
                            this._dragTask(
                                this.result[oldIndex].taskId,
                                this.result[newIndex].taskId,
                                "",
                                1
                            );
                        } else {
                            if (newIndex >= this.result.length) {
                                this._dragTask(
                                    this.result[oldIndex].taskId,
                                    this.result[newIndex - 1].taskId,
                                    "",
                                    1
                                );
                            } else {
                                this._dragTask(
                                    this.result[oldIndex].taskId,
                                    this.result[newIndex].taskId,
                                    this.result[newIndex + 1].taskId,
                                    1
                                );
                            }
                        }
                    }
                }
            });
        },
        getData1(nowPage, pageShow) {
            let self = this;
            const params = {
                nowPage: nowPage,
                pageShow: pageShow
            };
            self.result = [];
            listPersonalAllByPage(params).then(res => {
                if (res.code == ERR_OK) {
                    self.total = res.data.totalCount;
                    self.result = res.data.result;
                    this.$nextTick(() => {
                        this.setSort_noTask(self.result);
                    });
                    if (res.data.result == "") {
                        self.noData = false;
                    } else {
                        self.noData = true;
                    }
                }
            });
        },
        waitCome() {
            this.show1 = false;
            this.show2 = false;
            this.isActive = false;
            this.isActive1 = false;
        },
        uncomplete() {
            this.show1 = true;
            this.show2 = false;
            this.isActive = true;
            this.isActive1 = false;
            this.getData(false, this.nowPage, this.pageShow);
        },
        completed() {
            this.isActive = false;
            this.isActive1 = true;
            this.show1 = false;
            this.show2 = true;
            this.getData1(this.nowPage, this.pageShow);
            //this.getData(true,this.nowPage,this.pageShow)
        },
        handleSizeChange(val) {
            //      console.log(`每页 ${val} 条`);
            this.pageShow = val;
            var completed;
            if (this.isActive == true) {
                completed = false;
                this.getData(completed, this.nowPage, this.pageShow);
            } else {
                completed = true;
                this.getData1(this.nowPage, this.pageShow);
            }
        },
        handleCurrentChange(val) {
            //      console.log(`当前页: ${val}`);
            this.nowPage = val;
            var completed;
            if (this.isActive == true) {
                completed = false;
                this.getData(completed, this.nowPage, this.pageShow);
            } else {
                completed = true;
                this.getData1(this.nowPage, this.pageShow);
            }
        },
        handleClose(done) {
            this.dialogVisible = false;
            this.$refs["ruleForm"].resetFields();
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
                        self.isActive = true;
                        self.isActive1 = false;
                        self.getData(false, self.nowPage, self.pageShow);
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
                        self.isActive = true;
                        self.isActive1 = false;
                        self.getData(false, self.nowPage, self.pageShow);
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
            this.dialogVisible = false;
            this.$refs[formName].resetFields();
        },
        cancle(val, event) {
            var e = event;
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else if (window.event) {
                window.event.cancelBubble = true;
            }
            this.taskId = val;
            this.dialogVisible1 = true;
        },
        delay(val, key, event) {
            var e = event;
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else if (window.event) {
                window.event.cancelBubble = true;
            }
            this.taskId = val;
            var date = new Date(Date.parse(key.replace(/-/g, "/")));
            date = date.getTime();
            this.dialogVisible2 = true;
            this.pickerOptions1 = {
                disabledDate(time) {
                    return time.getTime() - 8.64e7 < date;
                }
            };
        },
        levelComeplete(val, event) {
            var e = event;
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else if (window.event) {
                window.event.cancelBubble = true;
            }
            this.taskId = val;
            this.dialogVisible4 = true;
        },
        handleClose1(done) {
            this.dialogVisible1 = false;
            this.$refs["ruleForm1"].resetFields();
        },
        submitForm1(formName1) {
            let self = this;
            this.$refs[formName1].validate(valid => {
                if (valid) {
                    const params = {
                        id: self.taskId,
                        reason: self.ruleForm1.cause
                    };
                    cancelTaskCause(params).then(res => {
                        if (res.code == ERR_OK) {
                            self.dialogVisible1 = false;
                            self.$refs[formName1].resetFields();
                            self.getData(false, self.nowPage, self.pageShow);
                            this.$notify({
                                title: "成功",
                                message: "申请取消原因已发送",
                                type: "success"
                            });
                        } else {
                            this.$notify.error({
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
        resetForm1(formName1) {
            this.dialogVisible1 = false;
            this.$refs[formName1].resetFields();
        },
        handleClose2(done) {
            this.dialogVisible2 = false;
            this.$refs["ruleForm2"].resetFields();
        },
        submitForm2(formName1) {
            let self = this;
            //console.log(self.ruleForm2.date1)
            let d = new Date(self.ruleForm2.date1);
            let time =
                d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            this.$refs[formName1].validate(valid => {
                if (valid) {
                    const params = {
                        taskId: self.taskId,
                        reason: self.ruleForm2.cause1,
                        delayDate: time
                    };
                    delayTaskCause(params).then(res => {
                        if (res.code == ERR_OK) {
                            self.dialogVisible2 = false;
                            self.$refs[formName1].resetFields();
                            self.getData(false, self.nowPage, self.pageShow);
                            this.$notify({
                                title: "成功",
                                message: "申请任务延期已发送",
                                type: "success"
                            });
                        } else {
                            this.$notify.error({
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
        resetForm2(formName1) {
            this.dialogVisible2 = false;
            this.$refs[formName1].resetFields();
        },
        handleClose4(done) {
            this.dialogVisible4 = false;
            this.$refs["ruleForm4"].resetFields();
        },
        unCompleteTask(val, event) {
            var e = event;
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else if (window.event) {
                window.event.cancelBubble = true;
            }
            const params = {
                taskId: val
            };
            var self = this;
            resetTaskRemindFlag(params).then(res => {
                if (res.code == ERR_OK) {
                    self.getData(false, self.nowPage, self.pageShow);
                    this.$notify({
                        title: "成功",
                        message: res.msg,
                        type: "success"
                    });
                } else {
                    this.$notify.error({
                        title: "错误",
                        message: res.msg
                    });
                }
            });
        },
        submitForm4(formName1) {
            let self = this;
            this.$refs[formName1].validate(valid => {
                if (valid) {
                    const params = {
                        id: self.taskId,
                        score: self.ruleForm4.score4,
                        comment: self.ruleForm4.cause4
                    };
                    completeTask(params).then(res => {
                        if (res.code == ERR_OK) {
                            self.dialogVisible4 = false;
                            self.$refs[formName1].resetFields();
                            self.getData(false, self.nowPage, self.pageShow);
                            this.$notify({
                                title: "成功",
                                message: "完成任务已发送",
                                type: "success"
                            });
                        } else {
                            this.$notify.error({
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
        resetForm4(formName1) {
            this.dialogVisible4 = false;
            this.$refs[formName1].resetFields();
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
        iconEnter() {
            this.$refs.displayShow.style.display = "block";
        },
        iconLeave() {
            this.$refs.displayShow.style.display = "none";
        }
    }
};
</script>
<style lang="scss"  scoped>
.task-list {
    background: #efefef;
    box-shadow: 0 2px 11px 0 rgba(0, 0, 0, 0.07);
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

    background: rgba(217, 53, 56, 0.1);
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
    color: #ffffff;
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
    background: #d8d8d8;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    cursor: pointer;
}
.take-bottom .task-item.active {
    background: #d93437;
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
    color: #ffffff;
    border-radius: 5px;
    background: #d93538;
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
    background: #d93437;
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
    background: #dfdfdf;
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
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;
}
.search-button {
    float: left;
    text-align: center;
    line-height: 24px;
    color: #d93437;
    border: 1px solid #d83436;
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
    color: #d93437;
    border: 1px solid #d83436;
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
    color: #ffffff;
    margin-right: 15px;
    background: rgba(0, 0, 0, 0.8);
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
    border: 1px solid #d83436;
    border-radius: 4px;
    font-size: 14px;
    color: #d93437;
    margin-right: 15px;
    margin-bottom: 10px;
}
</style>
