<template>
    <div class="wrapper">
        <div class="router-wrapper">
            <router-link to="/setCenter">
                <span class="child1">系统设置</span>
            </router-link> /
            <span class="child2">计划总结设置</span>
        </div>
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">提交时间设置</div>
            </div>
            <div class="idss-set-list">
                <el-row :gutter="20">
                    <el-col :span="11">
                        <div style="max-width: 500px;">
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>个人计划： {{[ submitTimeParams1.submitTimeScope, 1 ] | filterSubmitTimeParams}}</p>
                                    <span>当前：{{[ submitTimeParams1.submitTimeScope, 1 ] | filterSubmitTimeParamsCur}}</span>
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" @click="setSubmitTimeParams(1,1,submitTimeParams1.submitTimeScope,submitTimeParams1.submitRepeatMonth)">设置</el-button>
                                </div>
                            </div>
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>二级部门计划： {{[ submitTimeParams2.submitTimeScope, 1 ] | filterSubmitTimeParams}}</p>
                                    <span>当前：{{[ submitTimeParams2.submitTimeScope, 1 ] | filterSubmitTimeParamsCur}}</span>
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" @click="setSubmitTimeParams(1,2,submitTimeParams2.submitTimeScope,submitTimeParams2.submitRepeatMonth)">设置</el-button>
                                </div>
                            </div>
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>一级部门计划： {{[ submitTimeParams3.submitTimeScope, 1 ] | filterSubmitTimeParams}}</p>
                                    <span>当前：{{[ submitTimeParams3.submitTimeScope, 1 ] | filterSubmitTimeParamsCur}}</span>
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" @click="setSubmitTimeParams(1,3,submitTimeParams3.submitTimeScope,submitTimeParams3.submitRepeatMonth)">设置</el-button>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="1">&nbsp;</el-col>
                    <el-col :span="11">
                        <div style="max-width: 500px;">
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>个人总结： {{[ submitTimeParams4.submitTimeScope, 1 ] | filterSubmitTimeParams}}</p>
                                    <span>当前：{{[ submitTimeParams4.submitTimeScope, 1 ] | filterSubmitTimeParamsCur}}</span>
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" @click="setSubmitTimeParams(2,1,submitTimeParams4.submitTimeScope,submitTimeParams4.submitRepeatMonth)">设置</el-button>
                                </div>
                            </div>
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>二级部门总结： {{[ submitTimeParams5.submitTimeScope, 1 ] | filterSubmitTimeParams}}</p>
                                    <span>当前：{{[ submitTimeParams5.submitTimeScope, 1 ] | filterSubmitTimeParamsCur}}</span>
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" @click="setSubmitTimeParams(2,2,submitTimeParams5.submitTimeScope,submitTimeParams5.submitRepeatMonth)">设置</el-button>
                                </div>
                            </div>
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>一级部门总结： {{[ submitTimeParams6.submitTimeScope, 1 ] | filterSubmitTimeParams}}</p>
                                    <span>当前：{{[ submitTimeParams6.submitTimeScope, 1 ] | filterSubmitTimeParamsCur}}</span>
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" @click="setSubmitTimeParams(2,3,submitTimeParams6.submitTimeScope,submitTimeParams6.submitRepeatMonth)">设置</el-button>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">核对时间设置</div>
            </div>
            <div class="idss-set-list">
                <el-row :gutter="20">
                    <el-col :span="11">
                        <div class="idss-set-item" style="max-width:500px;">
                            <div class="idss-set-item__bd">
                                <p>个人总结核对打分时间： 
                                    <span v-if="checkDuration">0 - {{checkDuration}} 小时</span>
                                    <span v-else>未设置</span>
                                </p>
                                <span>总经理打分完毕的时间即为第0小时</span>
                            </div>
                            <div class="idss-set-item__ft">
                                <el-button size="small" @click="openDialogChangeCheckTimes">设置</el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">总结打分区间设置</div>
            </div>
            <div class="idss-set-list">
                <el-row :gutter="20">
                    <el-col :span="11">
                        <div class="idss-set-item" style="max-width:500px;">
                            <div class="idss-set-item__bd">
                                <p>个人总结打分区间： {{summaryScoreScopeMin}} - {{summaryScoreScopeMax}} 分</p>
                                <span>任务完成时的自评打分参照此区间分值</span>
                            </div>
                            <div class="idss-set-item__ft">
                                <el-button size="small" @click="openDialogChangeScore">设置</el-button>
                                
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">总结打分比例设置</div>
            </div>
            <div class="idss-set-list">
                <el-row :gutter="20">
                    <el-col :span="24" style="max-width:660px;">
                        <div class="idss-set-item">
                            <div class="idss-set-item__bd">
                                <p>一级部门员工比例：{{summaryScoreValue1 | filterSummaryScore}}</p>
                            </div>
                            <div class="idss-set-item__ft">
                                <el-button size="small" @click="setScale(1)">设置</el-button>
                            </div>
                        </div>
                        <div class="idss-set-item">
                            <div class="idss-set-item__bd">
                                <p>二级部门员工比例：{{summaryScoreValue2 | filterSummaryScore}}</p>
                            </div>
                            <div class="idss-set-item__ft">
                                <el-button size="small" @click="setScale(2)">设置</el-button>
                            </div>
                        </div>
                        <div class="idss-set-item">
                            <div class="idss-set-item__bd">
                                <p>一级部门负责人比例：{{summaryScoreValue3 | filterSummaryScore}}</p>
                            </div>
                            <div class="idss-set-item__ft">
                                <el-button size="small" @click="setScale(3)">设置</el-button>
                            </div>
                        </div>
                        <div class="idss-set-item">
                            <div class="idss-set-item__bd">
                                <p>二级部门负责人比例：{{summaryScoreValue4 | filterSummaryScore}}</p>
                            </div>
                            <div class="idss-set-item__ft">
                                <el-button size="small" @click="setScale(4)">设置</el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">计划总结延迟提交时间设置</div>
            </div>
            <div class="idss-set-list">
                <el-row :gutter="20">
                    <el-col :span="11">
                        <div style="max-width:500px;">
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>个人计划：</p>
                                    <span>{{submitTimeLater1.submitTimeLater | filterTimeLater}}</span>
                                    
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" @click="setLaterTime(1, 1, submitTimeLater1.submitTimeLater)">设置</el-button>
                                </div>
                            </div>
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>二级部门计划：</p>
                                    <span>{{submitTimeLater2.submitTimeLater | filterTimeLater}}</span>
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" @click="setLaterTime(1, 2, submitTimeLater2.submitTimeLater)">设置</el-button>
                                </div>
                            </div>
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>一级部门计划：</p>
                                    <span>{{submitTimeLater3.submitTimeLater | filterTimeLater}}</span>
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" @click="setLaterTime(1, 3, submitTimeLater3.submitTimeLater)">设置</el-button>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="1">&nbsp;</el-col>
                    <el-col :span="11">
                        <div style="max-width:500px;">
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>个人总结：</p>
                                    <span>{{submitTimeLater4.submitTimeLater | filterTimeLater}}</span>
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" @click="setLaterTime(2, 1, submitTimeLater4.submitTimeLater)">设置</el-button>
                                </div>
                            </div>
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>二级部门总结：</p>
                                    <span>{{submitTimeLater5.submitTimeLater | filterTimeLater}}</span>
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" @click="setLaterTime(2, 2, submitTimeLater5.submitTimeLater)">设置</el-button>
                                </div>
                            </div>
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>一级部门总结：</p>
                                    <span>{{submitTimeLater6.submitTimeLater | filterTimeLater}}</span>
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" @click="setLaterTime(2, 3, submitTimeLater6.submitTimeLater)">设置</el-button>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">计划总结延迟提交扣款金额设置</div>
            </div>
            <div class="idss-set-list">
                <el-row :gutter="20">
                    <el-col :span="8" v-for="item in 3" :key="item">
                        <div style="max-width:330px;">
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>个人计划-第{{item === 1 ? '一' : ( item === 2 ? '二' : '三')}}档：<span>{{[baseData, 1, 1, item - 1] | filterCutValue}}</span></p>
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" :disabled="filterCutDisable(1,submitTimeLater1.submitTimeLater,item)" @click="setCutValue(1, 1, item - 1)">设置</el-button>
                                </div>
                            </div>
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>个人总结-第{{item === 1 ? '一' : ( item === 2 ? '二' : '三')}}档：<span>{{[baseData, 1, 2, item - 1] | filterCutValue}}</span></p>
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" :disabled="filterCutDisable(2,submitTimeLater4.submitTimeLater,item)" @click="setCutValue(1, 2, item - 1)">设置</el-button>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="idss-set-list">
                <el-row :gutter="20">
                    <el-col :span="8" v-for="item in 3" :key="item">
                        <div style="max-width:330px;">
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>二级部门计划-第{{item === 1 ? '一' : ( item === 2 ? '二' : '三')}}档：<span>{{[baseData, 2, 1, item - 1] | filterCutValue}}</span></p>
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" :disabled="filterCutDisable(3,submitTimeLater2.submitTimeLater,item)" @click="setCutValue(2, 1, item - 1)">设置</el-button>
                                </div>
                            </div>
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>二级部门总结-第{{item === 1 ? '一' : ( item === 2 ? '二' : '三')}}档：<span>{{[baseData, 2, 2, item - 1] | filterCutValue}}</span></p>
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" :disabled="filterCutDisable(4,submitTimeLater5.submitTimeLater,item)" @click="setCutValue(2, 2, item - 1)">设置</el-button>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="idss-set-list">
                <el-row :gutter="20">
                    <el-col :span="8" v-for="item in 3" :key="item">
                        <div style="max-width:330px;">
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>一级部门计划-第{{item === 1 ? '一' : ( item === 2 ? '二' : '三')}}档：<span>{{[baseData, 3, 1, item - 1] | filterCutValue}}</span></p>
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" :disabled="filterCutDisable(5,submitTimeLater3.submitTimeLater,item)" @click="setCutValue(3, 1, item - 1)">设置</el-button>
                                </div>
                            </div>
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>一级部门总结-第{{item === 1 ? '一' : ( item === 2 ? '二' : '三')}}档：<span>{{[baseData, 3, 2, item - 1] | filterCutValue}}</span></p>
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" :disabled="filterCutDisable(6,submitTimeLater6.submitTimeLater,item)" @click="setCutValue(3, 2, item - 1)">设置</el-button>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="idss-list">
            <div class="idss-list-top">
                <div class="idss-list-top-title">快捷设置文案设置</div>
            </div>
            <div class="idss-set-list">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <div style="max-width:660px;">
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>本月目标：{{quickTipContent1}}</p>
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" @click="setQuickTip(1)">设置</el-button>
                                </div>
                            </div>
                            <div class="idss-set-item">
                                <div class="idss-set-item__bd">
                                    <p>本人总结：{{quickTipContent2}}</p>
                                </div>
                                <div class="idss-set-item__ft">
                                    <el-button size="small" @click="setQuickTip(2)">设置</el-button>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        
        <!-- 
            计划：上月-本月 -1/28， 0/28
            总结：本月-下月 0/28， 1/28 -->
        <el-dialog title="提交时间设置" :visible.sync="dialogChangeSubmitTime" v-if="dialogChangeSubmitTime" width="560px">
            <el-form :model="changeSubmitTimeForm" ref="changeSubmitTimeForm" :rules="changeSubmitTimeFormRules" label-position="top" label-suffix="：" label-width="60px">
                <el-form-item label="提交时间范围" prop="date">
                    <dayPickNext v-model="changeSubmitTimeForm.date" :titles="changeSubmitTimeForm.monthsType"></dayPickNext>
                </el-form-item>
                <el-form-item label="重复月份" prop="months">
                    <div class="idss-checkbox-group">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <el-checkbox-group v-model="changeSubmitTimeForm.months" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="month in 12" :label="month" :key="month">{{month}}月</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-form-item>
            </el-form>
                <div slot="footer" class="text-right">
                    <el-button type="primary" @click="changeSubmitTimeSubmit">确 定</el-button>
                    <el-button @click="dialogChangeSubmitTime = false">取 消</el-button>
                </div>
        </el-dialog>
        
        
        <el-dialog title="核对时间设置" :visible.sync="dialogChangeCheckTimes" v-if="dialogChangeCheckTimes" width="560px">
            <el-form :model="checkTimes" ref="checkTimes" :rules="changeCheckTimesRules" label-position="top" label-suffix="：" label-width="60px">
                
                <el-form-item label="" prop="checkDuration">
                    0 小时 -
                    <el-input v-model="checkTimes.checkDuration" @keyup.native="onkeyupPlusInt($event)" style="width:100px;" size="small"></el-input> 小时
                </el-form-item>
            </el-form>
            <div slot="footer" class="text-right">
                <el-button type="primary" @click="changeCheckTimesSubmit">确 定</el-button>
                <el-button @click="dialogChangeCheckTimes = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="总结打分区间设置" :visible.sync="dialogChangeScore" v-if="dialogChangeScore" width="560px">
            <el-form :model="changeScoreForm" ref="changeScoreForm" :rules="changeScoreFormRules" label-position="top" label-suffix="：" label-width="60px">
                
                <el-form-item label="" prop="date">
                    <el-input @keyup.native="onkeyupPlusInt($event)" v-model="changeScoreForm.summaryScoreScopeMin" placeholder="" style="width:100px;" size="small"></el-input> 分
                    -
                    <el-input @keyup.native="onkeyupPlusInt($event)" v-model="changeScoreForm.summaryScoreScopeMax" placeholder="" style="width:100px;" size="small"></el-input> 分
                </el-form-item>
            </el-form>
            <div slot="footer" class="text-right">
                <el-button type="primary" @click="changeScoreSubmit">确 定</el-button>
                <el-button @click="dialogChangeScore = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="打分比例设置" :visible.sync="dialogChangeScale" v-if="dialogChangeScale" width="560px">
            <el-form :model="changeScaleForm" ref="changeScaleForm" :rules="changeScaleFormRules" label-position="left" label-suffix="：" label-width="200px">
                
                <el-form-item prop="">
                    <div slot="label">
                        <el-checkbox disabled v-model="changeScaleForm.checked1">自评打分占比：</el-checkbox>
                    </div>
                    <el-input v-model="changeScaleForm.value1" placeholder="" style="width:100px;" size="small"></el-input> %
                </el-form-item>
                <el-form-item prop="" v-if="summaryScoreType == 2">
                    <div slot="label">
                        <el-checkbox v-model="changeScaleForm.checked2">二级部门负责人打分占比：</el-checkbox>
                    </div>
                    <el-input v-model="changeScaleForm.value2" placeholder="" style="width:100px;" size="small"></el-input> %
                </el-form-item>
                <el-form-item prop="" v-if="summaryScoreType == 1 || summaryScoreType == 2 || summaryScoreType == 4">
                    <div slot="label">
                        <el-checkbox v-model="changeScaleForm.checked3">一级部门负责人打分占比：</el-checkbox>
                    </div>
                    <el-input v-model="changeScaleForm.value3" placeholder="" style="width:100px;" size="small"></el-input> %
                </el-form-item>
                <el-form-item prop="value">
                    <div slot="label">
                        <el-checkbox disabled v-model="changeScaleForm.checked4">总经理打分占比：</el-checkbox>
                    </div>
                    <el-input v-model="changeScaleForm.value4" placeholder="" style="width:100px;" size="small"></el-input> %
                </el-form-item>
            </el-form>
                <div slot="footer" class="text-right">
                    <el-button type="primary" @click="changeScaleSubmit">确 定</el-button>
                    <el-button @click="dialogChangeScale = false">取 消</el-button>
                </div>
        </el-dialog>

        
        <el-dialog title="延迟提交时间设置" :visible.sync="dialogChangeLaterTime" v-if="dialogChangeLaterTime" width="560px">
            <el-form :model="changeLaterTimeForm" ref="changeLaterTimeForm" :rules="changeLaterTimeFormRules" label-position="left" label-suffix="：" label-width="160px">
                
                <el-form-item prop="value1">
                    <div slot="label">
                        <el-checkbox v-model="changeLaterTimeForm.checked1" disabled>第一档：</el-checkbox>
                    </div>
                    <el-input @keyup.native="onkeyupPlusInt($event)" disabled v-model="changeLaterTimeForm.min1" placeholder="" style="width:80px;" size="small"></el-input> 小时
                    -
                    <el-input @keyup.native="onkeyupPlusInt($event)" v-model="changeLaterTimeForm.max1" @change="changeLaterTimeForm.min2 = changeLaterTimeForm.max1" placeholder="" style="width:80px;" size="small"></el-input> 小时
                </el-form-item>
                <el-form-item prop="">
                    <div slot="label">
                        <el-checkbox v-model="changeLaterTimeForm.checked2" @change="changeLaterTimeForm.min2 = changeLaterTimeForm.max1">第二档：</el-checkbox>
                    </div>
                    <el-input @keyup.native="onkeyupPlusInt($event)" v-model="changeLaterTimeForm.min2" disabled placeholder="" style="width:80px;" size="small"></el-input> 小时
                    -
                    <el-input @keyup.native="onkeyupPlusInt($event)" v-model="changeLaterTimeForm.max2" placeholder="" style="width:80px;" size="small"></el-input> 小时
                </el-form-item>
                <el-form-item prop="">
                    <div slot="label">
                        <el-checkbox v-model="changeLaterTimeForm.checked3" disabled>第三档：</el-checkbox>
                    </div>
                    未提交
                </el-form-item>
            </el-form>
                <div slot="footer" class="text-right">
                    <el-button type="primary" @click="changeLaterTimeSubmit">确 定</el-button>
                    <el-button @click="dialogChangeLaterTime = false">取 消</el-button>
                </div>
        </el-dialog>

        
        <el-dialog title="延迟提交扣款金额设置" :visible.sync="dialogChangeCutValue" v-if="dialogChangeCutValue" width="560px">
            <el-form :model="changeCutValueForm" ref="changeCutValueForm" :rules="changeCutValueFormRules" label-position="left" label-suffix="：" label-width="160px">
                
                <el-form-item prop="value1">
                    <div slot="label">
                        <el-radio class="radio" v-model="changeCutValueForm.type" label="1" @change="changeCutType">
                            <el-input  @keyup.native="onkeyupPrice($event)" v-model="changeCutValueForm.value" placeholder="" style="width:80px;" size="small"></el-input> 元
                        </el-radio>
                    </div>
                </el-form-item>
                <el-form-item prop="">
                    <div slot="label">
                        <el-radio class="radio" v-model="changeCutValueForm.type" label="2" @change="changeCutType">1天基本工资</el-radio>
                    </div>
                </el-form-item>
                <el-form-item prop="">
                    <div slot="label">
                        <el-radio class="radio" v-model="changeCutValueForm.type" label="3" @change="changeCutType">2天基本工资</el-radio>
                    </div>
                    
                </el-form-item>
            </el-form>
            
                <div slot="footer" class="text-right">
                    <el-button type="primary" @click="changeCutValueSubmit">确 定</el-button>
                    <el-button @click="dialogChangeCutValue = false">取 消</el-button>
                </div>
        </el-dialog>
        <el-dialog title="快捷设置文案设置" :visible.sync="dialogChangeQuickTip" v-if="dialogChangeQuickTip" width="560px">
            <el-form :model="changeQuickTipForm" ref="changeQuickTipForm" :rules="changeQuickTipFormRules" label-position="left" label-suffix="：" label-width="0">
                <el-form-item prop="value1">
                    <el-input v-model="changeQuickTipForm.quickTipContent" type="textarea" :rows="6" placeholder="多个文案用英文逗号隔开" size="small"></el-input>
                </el-form-item>
            </el-form>
                <div slot="footer" class="text-right">
                    <el-button type="primary" @click="changeQuickTipSubmit">确 定</el-button>
                    <el-button @click="dialogChangeQuickTip = false">取 消</el-button>
                </div>
        </el-dialog>

        
    </div>
</template>

<script>
import moment from 'moment'
import dayPickNext from '../../../components/date/dayPickNext'
import { getSysPlanSummarys,updateSysPlanSummarys,getSysCheckTimes,updateSysCheckTimes } from 'service/getData'
import {  ERR_OK } from 'service/config'
export default {
    name: "setCenterPlanSummaryManage",
    components: {
        dayPickNext
    },
    filters: {
		
        filterSubmitTimeParams: function([val, submitType]) {
            if (!val || val.split(',').length !== 2) {
                return '未设置';
            }
            let minDayStr = val.split(',')[0];
            let minDayObj = minDayStr.split('/').map(Number);
            let minDay = {
                type: minDayObj[0],
                text: minDayObj[0] === 0 ? '本月' : (minDayObj[0] === 1 ? '下月' : '上月'),
                value: minDayObj[1]
            }
            let maxDayStr = val.split(',')[1];
            let maxDayObj = maxDayStr.split('/').map(Number);
            let maxDay = {
                type: maxDayObj[0],
                text: maxDayObj[0] === 0 ? '本月' : (maxDayObj[0] === 1 ? '下月' : '上月'),
                value: maxDayObj[1]
            }

            return minDay.text + minDay.value + '日 00:00 - ' + maxDay.text + maxDay.value + '日 23:59';

        },
        
        filterSubmitTimeParamsCur: function([val, submitType]) {
            if (!val || val.split(',').length !== 2) {
                return '未设置';
            }
            let minDayStr = val.split(',')[0];
            let minDayObj = minDayStr.split('/').map(Number);
            let minDayMonth = minDayObj[0] + new Date().getMonth() + 1;
            let minDay = {
                type: minDayObj[0],
                text: minDayMonth > 12 ? 1 : minDayMonth,
                value: minDayObj[1]
            }
            let maxDayStr = val.split(',')[1];
            let maxDayObj = maxDayStr.split('/').map(Number);
            let maxDayMonth = maxDayObj[0] + new Date().getMonth() + 1;
            let maxDay = {
                type: maxDayObj[0],
                text: maxDayMonth > 12 ? 1 : maxDayMonth,
                value: maxDayObj[1]
            }
            let minDate = moment().subtract(-minDayObj[0], 'months');
            let maxDate = moment().subtract(-maxDayObj[0], 'months');
            let startDateDay = moment(minDate).endOf('month').format('DD'); // 获取开始月最后一天日期
            let endDateDay = moment(maxDate).endOf('month').format('DD'); // 获取结束月最后一天日期
            let minDateDay = minDay.value > startDateDay ? startDateDay : minDay.value;
            let maxDateDay = maxDay.value > endDateDay ? endDateDay : maxDay.value;
            
            return minDate.format('MM') + '月' + minDateDay + '日 00:00 - ' + maxDate.format('MM') + '月'+ maxDateDay + '日 23:59';
            // return minDay.text + '月' + minDay.value + '日 00:00 - ' + maxDay.text + '月' + maxDay.value + '日 23:59';
        },
        filterSummaryScore: function(val) {
            if (!val || val.split(',').length !== 4) {
                return '未设置';
            }
            let scopes = val.split(',').map(Number);
            let str = '';
            if (scopes && scopes.length == 4) {
                if (!!scopes[0]) {
                    str += '自评' + scopes[0] + '%    ';
                }
                if (!!scopes[1]) {
                    str += '二级部门负责人' + scopes[1] + '%    ';
                }
                if (!!scopes[2]) {
                    str += '一级部门负责人' + scopes[2] + '%    ';
                }
                if (!!scopes[3]) {
                    str += '总经理' + scopes[3] + '%    ';
                }
            }
            
            return str;
        },
        filterTimeLater: function(val) {
            let scopes = (val && val.split(',').length) ? val.split(',') : [];
            let str = '';
            if (scopes) {
                if (!!scopes[0]) {
                    str += '第一档：' + scopes[0].split('-')[0] + '-' + scopes[0].split('-')[1] + '小时    ';
                } else {
                    str += '第一档：无    ';
                }
                if (!!scopes[1]) {
                    str += '第二档：' + scopes[1].split('-')[0] + '-' + scopes[1].split('-')[1] + '小时    ';
                } else {
                    str += '第二档：无    ';
                }
            }
            str += '第三档：未提交'
            
            return str;
        },
        // submitLevel,个人
        // submitType,计划
        // level: 档次 0，1，2
        filterCutValue:([baseData, submitLevel, submitType, level])=> {
            let obj = null;
            for (let item of baseData) {
                if (item.categoryCode === 'SUBMIT_LATER_CUT' && item.submitLevel === submitLevel && item.submitType === submitType ) {
                    obj = item;
                    break;
                }
            }
            if (obj && obj.submitLaterCutValue && obj.submitLaterCutValue.split(',').length === 3) {
                let val = obj.submitLaterCutValue.split(',')[level];
                if (val == 2) {
                    return '1天基本工资'
                } else if (val == 3) {
                    return '2天基本工资'
                } else if (val && val.length > 2 && val.split(':').length === 2){
                    return '-' + val.split(':')[1] + '元'
                } else {
                    return '未设置'
                }
            } else {
                return '未设置'
            }
        },
    },
    data () {
        var validateScale = (rule, value, callback) => {

            var sum = 0;
            if (!!this.changeScaleForm.checked1 && !!this.changeScaleForm.value1) {
                sum += parseInt(this.changeScaleForm.value1);
            } else if (!!this.changeScaleForm.checked1 && !this.changeScaleForm.value1) {
                callback(new Error('请填写勾选项'));
            }
            if (!!this.changeScaleForm.checked2 && !!this.changeScaleForm.value2) {
                sum += parseInt(this.changeScaleForm.value2);
            } else if (!!this.changeScaleForm.checked2 && !this.changeScaleForm.value2) {
                callback(new Error('请填写勾选项'));
            }
            if (!!this.changeScaleForm.checked3 && !!this.changeScaleForm.value3) {
                sum += parseInt(this.changeScaleForm.value3);
            } else if (!!this.changeScaleForm.checked3 && !this.changeScaleForm.value3) {
                callback(new Error('请填写勾选项'));
            }
            if (!!this.changeScaleForm.checked4 && !!this.changeScaleForm.value4) {
                sum += parseInt(this.changeScaleForm.value4);
            } else if (!!this.changeScaleForm.checked4 && !this.changeScaleForm.value4) {
                callback(new Error('请填写勾选项'));
            }
            console.log(sum,this.changeScaleForm)
            if (sum !== 100) {
                callback(new Error('所设置比例和应当为100%'));
            } else {
                callback();
            }
        };
        var validateLaterTime = (rule, value, callback) => {

            if (!this.changeLaterTimeForm.max1) {
                callback(new Error('请输入第一档延迟提交时间'));
            } else {
                callback();
            }
        };
        
        return {
            
            baseData: [],

            dialogChangeSubmitTime: false,
            changeSubmitTimeForm: {
                date: '', // 日期区间
                months: [], //重复月份
                monthsType: [-1, 0],
                submitType: 1,
                submitLevel: 1,
            },
            changeSubmitTimeFormRules: {
                date: [
                    { required: true, message: '请选择时间范围', trigger: 'blue' }
                ],
                months: [
                    { type: 'array', required: true, message: '请选择重复月份', trigger: 'blue' }
                ], //重复月份
            },
            checkAll: true,
            isIndeterminate: true,

            
            submitTimeParams1: {},
            submitTimeParams2: {},
            submitTimeParams3: {},
            submitTimeParams4: {},
            submitTimeParams5: {},
            submitTimeParams6: {},

            
            dialogChangeScore: false,
            summaryScoreScopeMin: '',
            summaryScoreScopeMax: '',
            changeScoreForm: {
                summaryScoreScopeMin: '',
                summaryScoreScopeMax: '',
            },
            changeScoreFormRules: {
                summaryScoreScopeMin: [
                    { required: true, message: '请输入', trigger: 'blue' }
                ],
                summaryScoreScopeMax: [
                    { type: 'array', required: true, message: '请输入', trigger: 'blue' }
                ], //重复月份
            },


            dialogChangeScale: false,
            changeScaleForm: {
                summaryScoreType: 1,
                checked1: true,
                value1:'',
                checked2: false,
                value2:'',
                checked3: false,
                value3:'',
                checked4: true,
                value4:'',
            },
            changeScaleFormRules: {
                value: [
                    { validator: validateScale, trigger: 'blue' }
                ],
            },
            summaryScoreValue1: '',
            summaryScoreValue2: '',
            summaryScoreValue3: '',
            summaryScoreValue4: '',

            // 延迟时间提交设置
            dialogChangeLaterTime: false,
            changeLaterTimeForm: {
                submitType: '',
                submitLevel: '',
                checked1: true,
                min1:0,
                max1:'',
                checked2: false,
                min2:'',
                max2:'',
                checked3: true,
                min3:'',
                max3:'',
            },
            changeLaterTimeFormRules: {
                value1: [
                    { validator: validateLaterTime, trigger: 'blue' }
                ],
            },
            submitTimeLater1: {},
            submitTimeLater2: {},
            submitTimeLater3: {},
            submitTimeLater4: {},
            submitTimeLater5: {},
            submitTimeLater6: {},


            
            // 延迟扣款金额设置
            dialogChangeCutValue: false,
            changeCutValueForm: {
                submitType: '',
                submitLevel: '',
                level: 0,
                submitLaterCutValue: '',
                type: '1', // 1:具体金额，2:当日工资，3:2倍日工资
                value: '',
            },
            changeCutValueFormRules: {
                value: [
                ],
            },

            
            // QUICK_TIP:快捷设置
            dialogChangeQuickTip: false,
            changeQuickTipForm: {
                quickTipType: '',
                quickTipContent: '',
            },
            changeQuickTipFormRules: {
                quickTipContent: [
                    { required: true, message: '请输入' }
                ],
            },
            quickTipContent1: '',
            quickTipContent2: '',

            checkTimes: {},
            checkDuration: '',
            changeCheckTimesRules: {
                checkDuration: [
                    { required: true, message: '请输入' }
                ],
            },
            dialogChangeCheckTimes: false
        }
    },
    created() {
        this.getBaseData();
        this.getSysCheckTimesList();
    },
    watch: {

    },
    methods: {
        // 全选
        handleCheckAllChange(val) {
            this.changeSubmitTimeForm.months = val ? [1,2,3,4,5,6,7,8,9,10,11,12] : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === 12;
            this.isIndeterminate = checkedCount > 0 && checkedCount < 12;
        },

        getBaseData() {
            getSysPlanSummarys({}).then((res) => {
                if (res.code == ERR_OK) {
                    this.baseData = res.data;
                    for(let item of res.data) {
                        // 提交时间
                        if (item.categoryCode == 'SUBMIT_TIME' && item.submitType == 1 && item.submitLevel == 1) {
                            this.submitTimeParams1 = item;
                        }
                        if (item.categoryCode == 'SUBMIT_TIME' && item.submitType == 1 && item.submitLevel == 2) {
                            this.submitTimeParams2 = item;
                        }
                        if (item.categoryCode == 'SUBMIT_TIME' && item.submitType == 1 && item.submitLevel == 3) {
                            this.submitTimeParams3 = item;
                        }
                        if (item.categoryCode == 'SUBMIT_TIME' && item.submitType == 2 && item.submitLevel == 1) {
                            this.submitTimeParams4 = item;
                        }
                        if (item.categoryCode == 'SUBMIT_TIME' && item.submitType == 2 && item.submitLevel == 2) {
                            this.submitTimeParams5 = item;
                        }
                        if (item.categoryCode == 'SUBMIT_TIME' && item.submitType == 2 && item.submitLevel == 3) {
                            this.submitTimeParams6 = item;
                        }

                        // 总结打分区间
                        if (item.categoryCode == 'SUMMARY_SCORE') {
                            let scope = item.summaryScoreScope.split(',');
                            if (scope && scope.length == 2) {
                                this.summaryScoreScopeMin = scope[0];
                                this.changeScoreForm.summaryScoreScopeMin = scope[0];
                                this.summaryScoreScopeMax = scope[1];
                                this.changeScoreForm.summaryScoreScopeMax = scope[1];
                            }
                        }
                        if (item.categoryCode == 'SUMMARY_SCALE' && item.summaryScoreType == 1 ){
                            this.summaryScoreValue1 = item.summaryScoreValue;
                        }
                        if (item.categoryCode == 'SUMMARY_SCALE' && item.summaryScoreType == 2 ){
                            this.summaryScoreValue2 = item.summaryScoreValue;
                        }
                        if (item.categoryCode == 'SUMMARY_SCALE' && item.summaryScoreType == 3 ){
                            this.summaryScoreValue3 = item.summaryScoreValue;
                        }
                        if (item.categoryCode == 'SUMMARY_SCALE' && item.summaryScoreType == 4 ){
                            this.summaryScoreValue4 = item.summaryScoreValue;
                        }
                        
                        
                        if (item.categoryCode == 'SUBMIT_TIME_LATER' && item.submitType == 1 && item.submitLevel == 1) {
                            this.submitTimeLater1 = item;
                        }
                        if (item.categoryCode == 'SUBMIT_TIME_LATER' && item.submitType == 1 && item.submitLevel == 2) {
                            this.submitTimeLater2 = item;
                        }
                        if (item.categoryCode == 'SUBMIT_TIME_LATER' && item.submitType == 1 && item.submitLevel == 3) {
                            this.submitTimeLater3 = item;
                        }
                        if (item.categoryCode == 'SUBMIT_TIME_LATER' && item.submitType == 2 && item.submitLevel == 1) {
                            this.submitTimeLater4 = item;
                        }
                        if (item.categoryCode == 'SUBMIT_TIME_LATER' && item.submitType == 2 && item.submitLevel == 2) {
                            this.submitTimeLater5 = item;
                        }
                        if (item.categoryCode == 'SUBMIT_TIME_LATER' && item.submitType == 2 && item.submitLevel == 3) {
                            this.submitTimeLater6 = item;
                        }


                        
                        if (item.categoryCode == 'QUICK_TIP' && item.quickTipType == 1) {
                            this.quickTipContent1 = item.quickTipContent;
                        }
                        if (item.categoryCode == 'QUICK_TIP' && item.quickTipType == 2) {
                            this.quickTipContent2 = item.quickTipContent;
                        }

                    }
                } else {
                    this.$notify({
						type: 'warning',
						title: "提示",
                        message: res.msg
                    });
                }
            })
        },
        getSysCheckTimesList() {
            getSysCheckTimes({
                checkType: 1
            }).then((res) => {
                if (res.code == ERR_OK) {
                    if(res.data.length > 0) {
                        this.checkTimes = res.data[0];
                        this.checkDuration = res.data[0].checkDuration;
                    } else {
                        this.checkTimes = {};
                        this.checkDuration = '';
                    }
                } else {
                    this.$notify({
						type: 'warning',
						title: "提示",
                        message: res.msg
                    });
                }
            })
        },
        // submitType 类型：1:计划，2:总结
        // submitLevel 类型：1:个人，2:二级部门，3：一级部门
        // submitTimeScope 提交时间范围(-1上月,0当月,1下月)(如:上月28号～本月5号表示为-1/28,0/5)
        // submitRepeatMonth 重复月份，以“,”隔开
        setSubmitTimeParams(submitType,submitLevel,submitTimeScope,submitRepeatMonth) {
            this.dialogChangeSubmitTime = true;
            this.isIndeterminate = true;
            this.changeSubmitTimeForm.date = submitTimeScope ? submitTimeScope : '';
            this.changeSubmitTimeForm.months = submitRepeatMonth ? submitRepeatMonth.split(',').map(Number) : [];
            this.changeSubmitTimeForm.submitType = submitType;
            this.changeSubmitTimeForm.submitLevel = submitLevel;
            if (submitType == 1) {
                this.changeSubmitTimeForm.monthsType = [-1, 0];
            } else if (submitType == 2) {
                this.changeSubmitTimeForm.monthsType = [0, 1];
            }
                
        },
        
        titlesTxt(titlesVal) {
            switch(Number(titlesVal)) {
                case -1:
                    return '上月';
                    break;
                case 0:
                    return '本月';
                    break;
                case 1:
                    return '下月';
                    break;
                default:
                    return '本月';
                    break;
            }
        },
        changeSubmitTimeSubmit() {
            if(this.changeSubmitTimeForm.months.length != 12) {

                this.$confirm('重复月份未全部勾选，确认要保存设置吗?', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.changeSubmitTimeSubmitSubmit();
                }).catch(() => {
                });
            } else {
                this.changeSubmitTimeSubmitSubmit();
            }
        },
        changeSubmitTimeSubmitSubmit() {
            this.$refs.changeSubmitTimeForm.validate(valid => {
                if (valid) {

                    let params = {
                        categoryCode: 'SUBMIT_TIME',
                        submitType: this.changeSubmitTimeForm.submitType,
                        submitLevel: this.changeSubmitTimeForm.submitLevel,
                        submitTimeScope: this.changeSubmitTimeForm.date,
                        submitRepeatMonth: this.changeSubmitTimeForm.months.join(','),
                    }
                    updateSysPlanSummarys(params).then((res) => {
                        if (res.code == ERR_OK) {
                            this.$notify({
                                type: 'success',
                                title: "提示",
                                message: '设置成功'
                            });
                            this.getBaseData();
                            this.dialogChangeSubmitTime = false;
                        } else {
                            this.$notify({
                                type: 'warning',
                                title: "提示",
                                message: res.msg
                            });
                        }
                    })
                }
            })
        },

        openDialogChangeScore() {  
            this.dialogChangeScore = true;
            this.changeScoreForm.summaryScoreScopeMin = this.summaryScoreScopeMin;
            this.changeScoreForm.summaryScoreScopeMax = this.summaryScoreScopeMax;
        },
        changeScoreSubmit() {
            this.$refs.changeScoreForm.validate(valid => {
                if (valid) {
                    let scopes = this.changeScoreForm.summaryScoreScopeMin + ',' + this.changeScoreForm.summaryScoreScopeMax;
                    updateSysPlanSummarys({
                        categoryCode: 'SUMMARY_SCORE',
                        summaryScoreScope: scopes
                        
                    }).then((res) => {
                        if (res.code == ERR_OK) {
                            this.$notify({
                                type: 'success',
                                title: "提示",
                                message: '设置成功'
                            });
                            this.getBaseData();
                            this.dialogChangeScore = false;
                        } else {
                            this.$notify({
                                type: 'warning',
                                title: "提示",
                                message: res.msg
                            });
                        }
                    })
                }
            })

        },

        setScale(summaryScoreType) {
            this.changeScaleForm.value1 = '';
            this.changeScaleForm.value2 = '';
            this.changeScaleForm.value3 = '';
            this.changeScaleForm.value4 = '';
            this.changeScaleForm.checked1 = true;
            this.changeScaleForm.checked2 = false;
            this.changeScaleForm.checked3 = false;
            this.changeScaleForm.checked4 = true;

            let _summaryScoreValue = '';
            // summaryScoreType 总结打分人员类型（1:一级部门员工，2:二级部门员工，3:一级部门负责人，4:二级部门负责人）
            if (summaryScoreType == 1) {
                _summaryScoreValue = this.summaryScoreValue1;
            } else if (summaryScoreType == 2) {
                _summaryScoreValue = this.summaryScoreValue2;
            } else if (summaryScoreType == 3) {
                _summaryScoreValue = this.summaryScoreValue3;
            } else if (summaryScoreType == 4) {
                _summaryScoreValue = this.summaryScoreValue4;
            }
            this.summaryScoreType = summaryScoreType;
            // 打分比例设置
            let scopes = _summaryScoreValue.split(',').map(Number);
            if (scopes && scopes.length == 4) {
                for (let j = 0; j < 4; j ++) {
                    if (!!scopes[j]) {
                        this.changeScaleForm['checked' + (j + 1)] = true;
                        this.changeScaleForm['value' + (j + 1)] = scopes[j];
                    }
                }
            }
            this.dialogChangeScale = true;
        },
        changeScaleSubmit() {
            this.$refs.changeScaleForm.validate(valid => {
                if (valid) {
                    let scopes = [];
                    if (!!this.changeScaleForm.checked1 && !!this.changeScaleForm.value1) {
                        scopes.push( parseInt(this.changeScaleForm.value1) );
                    } else {
                        scopes.push(0);
                    }
                    if (!!this.changeScaleForm.checked2 && !!this.changeScaleForm.value2) {
                        scopes.push( parseInt(this.changeScaleForm.value2) );
                    } else {
                        scopes.push(0);
                    }
                    if (!!this.changeScaleForm.checked3 && !!this.changeScaleForm.value3) {
                        scopes.push( parseInt(this.changeScaleForm.value3) );
                    } else {
                        scopes.push(0);
                    }
                    if (!!this.changeScaleForm.checked4 && !!this.changeScaleForm.value4) {
                        scopes.push( parseInt(this.changeScaleForm.value4) );
                    } else {
                        scopes.push(0);
                    }
                    updateSysPlanSummarys({
                        categoryCode: 'SUMMARY_SCALE',
                        summaryScoreType: this.summaryScoreType,
                        summaryScoreValue: scopes.join(',')
                    }).then((res) => {
                        if (res.code == ERR_OK) {
                            this.$notify({
                                type: 'success',
                                title: "提示",
                                message: '设置成功'
                            });
                            this.getBaseData();
                            this.dialogChangeScale = false;
                        } else {
                            this.$notify({
                                type: 'warning',
                                title: "提示",
                                message: res.msg
                            });
                        }
                    })
                }
            })

        },
        
        // submitType 类型：1:计划，2:总结
        // submitLevel 类型：1:个人，2:二级部门，3：一级部门
        setLaterTime(submitType,submitLevel,submitTimeLater) {
            
            this.changeLaterTimeForm.min1 = 0;
            this.changeLaterTimeForm.max1 = '';
            this.changeLaterTimeForm.min2 = '';
            this.changeLaterTimeForm.max2 = '';
            this.changeLaterTimeForm.min3 = '';
            this.changeLaterTimeForm.max3 = '';
            this.changeLaterTimeForm.checked1 = true;
            this.changeLaterTimeForm.checked2 = false;
            this.changeLaterTimeForm.checked3 = true;

            if(!!submitTimeLater) {
                // 打分比例设置
                let scopes = submitTimeLater.split(',');

                if (scopes && scopes.length > 0) {
                    if (!!scopes[0]) {
                        let minOrMax = scopes[0].split('-');
                        this.changeLaterTimeForm['min1'] = minOrMax[0];
                        this.changeLaterTimeForm['max1'] = minOrMax[1];
                    } else {
                        this.changeLaterTimeForm['min1'] = '';
                        this.changeLaterTimeForm['max1'] = '';
                    }
                    if (!!scopes[1]) {
                        let minOrMax = scopes[1].split('-');
                        this.changeLaterTimeForm['checked2'] = true;
                        this.changeLaterTimeForm['min2'] = minOrMax[0];
                        this.changeLaterTimeForm['max2'] = minOrMax[1];
                    } else {
                        this.changeLaterTimeForm['checked2'] = false;
                        this.changeLaterTimeForm['min2'] = '';
                        this.changeLaterTimeForm['max2'] = '';
                    }
                } else {
                    this.changeLaterTimeForm['checked1'] = true;
                    this.changeLaterTimeForm['checked2'] = false;
                    this.changeLaterTimeForm['checked3'] = true;

                    for (let j = 0; j < 2; j ++) {
                        this.changeLaterTimeForm['min' + (j + 1)] = '';
                        this.changeLaterTimeForm['max' + (j + 1)] = '';
                    }
                }
            }
            this.changeLaterTimeForm.submitType = submitType;
            this.changeLaterTimeForm.submitLevel = submitLevel;
            this.dialogChangeLaterTime = true;
        },
        changeLaterTimeSubmit() {
            this.$refs.changeLaterTimeForm.validate(valid => {
                if (valid) {
                    let scopes = [];
                    if (!!this.changeLaterTimeForm.checked1 && !!this.changeLaterTimeForm.min1 && !!this.changeLaterTimeForm.max1) {
                        var minOrMaxStr1 = this.changeLaterTimeForm.min1 + '-' + this.changeLaterTimeForm.max1;
                        scopes.push( minOrMaxStr1 );
                    }
                    if (!!this.changeLaterTimeForm.checked2 && !!this.changeLaterTimeForm.min2 && !!this.changeLaterTimeForm.max2) {
                        var minOrMaxStr2 = this.changeLaterTimeForm.min2 + '-' + this.changeLaterTimeForm.max2;
                        scopes.push( minOrMaxStr2 );
                    }
                    updateSysPlanSummarys({
                        categoryCode: 'SUBMIT_TIME_LATER',
                        submitType: this.changeLaterTimeForm.submitType,
                        submitLevel: this.changeLaterTimeForm.submitLevel,
                        submitTimeLater: scopes.join(',')
                    }).then((res) => {
                        if (res.code == ERR_OK) {
                            this.$notify({
                                type: 'success',
                                title: "提示",
                                message: '设置成功'
                            });
                            this.getBaseData();
                            this.dialogChangeLaterTime = false;
                        } else {
                            this.$notify({
                                type: 'warning',
                                title: "提示",
                                message: res.msg
                            });
                        }
                    })
                }
            })

        },
        
        changeCutType() {
            if (this.changeCutValueForm.type != 1) {
                this.changeCutValueForm.value = '';
            }
        },
        setCutValue(submitLevel, submitType, level) {
            let obj = null;
            let levelCutValue = '';
            for (let item of this.baseData) {
                if (item.categoryCode === 'SUBMIT_LATER_CUT' && item.submitLevel === submitLevel && item.submitType === submitType ) {
                    obj = item;
                    break;
                }
            }
            if (obj && obj.submitLaterCutValue && obj.submitLaterCutValue.split(',').length === 3) {
                levelCutValue = obj.submitLaterCutValue.split(',')[level];
                this.changeCutValueForm.submitLaterCutValue = obj.submitLaterCutValue;
                if (levelCutValue == 2) {
                    this.changeCutValueForm.type = '2';
                    this.changeCutValueForm.value = '';
                } else if (levelCutValue == 3) {
                    this.changeCutValueForm.type = '3';
                    this.changeCutValueForm.value = '';
                } else if (levelCutValue && levelCutValue.length > 2 && levelCutValue.split(':').length === 2){
                    this.changeCutValueForm.type = '1';
                    this.changeCutValueForm.value = levelCutValue.split(':')[1];
                } else {
                    this.changeCutValueForm.type = '1';
                    this.changeCutValueForm.value = '';
                }
            } else {
                this.changeCutValueForm.submitLaterCutValue = '';
                this.changeCutValueForm.type = '1';
                this.changeCutValueForm.value = '';
            }
            this.changeCutValueForm.submitType = submitType;
            this.changeCutValueForm.submitLevel = submitLevel;
            this.changeCutValueForm.level = level;
            this.dialogChangeCutValue = true;
            
            
        },
        changeCutValueSubmit() {
            if (this.changeCutValueForm.type) {
                if (this.changeCutValueForm.type == 1 && !this.changeCutValueForm.value) {
                    alert('请输入')
                    return false;
                }
                let _val = ',,';
                if (this.changeCutValueForm.submitLaterCutValue && this.changeCutValueForm.submitLaterCutValue.split(',').length === 3) {
                    _val = this.changeCutValueForm.submitLaterCutValue;
                }
                let newVals = _val.split(',');
                if (this.changeCutValueForm.type == 1 ) {
                    newVals[this.changeCutValueForm.level] = '1:' + this.changeCutValueForm.value;
                } else if (this.changeCutValueForm.type == 2 ) {
                    newVals[this.changeCutValueForm.level] = '2';
                } else if (this.changeCutValueForm.type == 3 ) {
                    newVals[this.changeCutValueForm.level] = '3';
                }
                newVals.join(',');
                
                updateSysPlanSummarys({
                    categoryCode: 'SUBMIT_LATER_CUT',
                    submitType: this.changeCutValueForm.submitType,
                    submitLevel: this.changeCutValueForm.submitLevel,
                    submitLaterCutValue: newVals.join(',')
                }).then((res) => {
                    if (res.code == ERR_OK) {
                        this.$notify({
                            type: 'success',
                            title: "提示",
                            message: '设置成功'
                        });
                        this.getBaseData();
                        this.dialogChangeCutValue = false;
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: "提示",
                            message: res.msg
                        });
                    }
                })
            }
        },

        // QUICK_TIP:快捷设置
        setQuickTip(quickTipType) {
            this.changeQuickTipForm.quickTipType = quickTipType;
            if (quickTipType == 1) {
                this.changeQuickTipForm.quickTipContent = this.quickTipContent1;
            }
            if (quickTipType == 2) {
                this.changeQuickTipForm.quickTipContent = this.quickTipContent2;
            }
            this.dialogChangeQuickTip = true;
        },
        changeQuickTipSubmit() {
            this.$refs.changeQuickTipForm.validate(valid => {
                if (valid) {
                    updateSysPlanSummarys({
                        categoryCode: 'QUICK_TIP',
                        quickTipType: this.changeQuickTipForm.quickTipType,
                        quickTipContent: this.changeQuickTipForm.quickTipContent,
                    }).then((res) => {
                        if (res.code == ERR_OK) {
                            this.$notify({
                                type: 'success',
                                title: "提示",
                                message: '设置成功'
                            });
                            this.getBaseData();
                            this.dialogChangeQuickTip = false;
                        } else {
                            this.$notify({
                                type: 'warning',
                                title: "提示",
                                message: res.msg
                            });
                        }
                    })
                }
            })

        },

        openDialogChangeCheckTimes() {
            this.dialogChangeCheckTimes = true;
            this.checkTimes.checkDuration = this.checkDuration;
        },
        changeCheckTimesSubmit() {
            this.$refs.checkTimes.validate(valid => {
                if (valid) {
                    updateSysCheckTimes({
                        checkDuration: this.checkTimes.checkDuration,
                        checkType: 1,
                        id: this.checkTimes.id,
                    }).then((res) => {
                        if (res.code == ERR_OK) {
                            this.$notify({
                                type: 'success',
                                title: "提示",
                                message: '设置成功'
                            });
                            this.getSysCheckTimesList();
                            this.dialogChangeCheckTimes = false;
                        } else {
                            this.$notify({
                                type: 'warning',
                                title: "提示",
                                message: res.msg
                            });
                        }
                    })
                }
            })

            
        },
        
        filterCutDisable: function(num,val,level) {
            let scopes = (val && val.split(',').length) ? val.split(',') : [];
            
            if (level == 2 ){
                if ( !scopes || (scopes && !scopes[1]) ){
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        
    }
}
</script>

<style scoped lang="scss">
.idss-list {
    margin-bottom: 20px;
}
.idss-set-list {
    padding: 15px 30px;
    overflow: hidden;
    + .idss-set-list {
        border-top: 1px solid #eee;
    }
    
}
.idss-set-item {
    display: flex;
    padding: 15px 0px;
    .idss-set-item__bd {
        flex: 1;
        p {
            font-size: 14px;
            color: #333;
            line-height: 30px;
            span {
                color: #999999;
            }
        }
        span {
            font-size: 12px;
            color: #999999;
        }
    }
}
.idss-checkbox-group {
    display: inline-block;
    .el-checkbox /deep/ {
        margin-right: 15px;
        & + .el-checkbox {
            margin-left: 0;
        }
        .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: red;
            border-color: red;
        }
        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: red;
            border-color: red;
        }
        .el-checkbox__inner:hover {
            border-color: red;
        }
    }
}
</style>
