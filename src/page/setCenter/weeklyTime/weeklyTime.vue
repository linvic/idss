<template>
  <div>

    <!--<tab></tab>-->
    <div class="setCenter-wrapper">
      <div class="router-wrapper">
        <router-link to="/setCenter">
          <span class="child1">系统设置</span>
        </router-link>
        /
        <router-link to="/weeklyTime">
          <span class="child2">周报时间</span>
        </router-link>
      </div>
      <div class="setTime">
        <p class="setTime_name">
          <span class="setTime_title">周报自动提交时间设置</span>
        </p>
        <ul class="setTime_content">
          <li class="first">
            <span class="people_name">个人周报：</span>
            <span class="week_time">{{staffDefaultStartDeliveryweek}} {{staffDefaultStartDeliveryhourStr}}:{{staffDefaultStartDeliveryminuteStr}} - {{staffDefaultDeliveryweek}} {{staffDefaultDeliveryhour}}:{{staffDefaultDeliveryminute}}</span>
            <button class="reset" @click="reset(1,staffDefaultDeliveryweek,staffDefaultStartDeliveryweek)">设置</button>
          </li>
          <li>
            <span class="people_name">部门周报：</span>
            <span class="week_time">{{headerDefaultStartDeliveryweek}} {{headerDefaultStartDeliveryhourStr}}:{{headerDefaultStartDeliveryminuteStr}} - {{headerDefaultDeliveryweek}} {{headerDefaultDeliveryhour}}:{{headerDefaultDeliveryminute}}</span>
            <button class="reset" @click="reset(2,headerDefaultDeliveryweek,headerDefaultStartDeliveryweek)">设置</button>
          </li>
          <li>
            <span class="people_name">公司计划：</span>
            <span class="week_time">{{mangerDefaultStartDeliveryweek}} {{mangerDefaultStartDeliveryhourStr}}:{{mangerDefaultStartDeliveryminuteStr}} - {{mangerDefaultDeliveryweek}} {{mangerDefaultDeliveryhour}}:{{mangerDefaultDeliveryminute}}</span>
            <button class="reset" @click="reset(3,mangerDefaultDeliveryweek,mangerDefaultStartDeliveryweek)">设置</button>
          </li>
        </ul>
      </div>
      <div class="setTime set_auto">
        <p class="setTime_name">
          <span class="setTime_title">变更周报自动提交时间</span>
          <span class="tip">（注：默认提交周报时间为每周五，下午六点，可选择变更生效时间，超过时间且未设定，则恢复默认提交时间;）</span>
        </p>
        <ul class="auto_setTime">
           <li>
             <span class="cycle">
                <span class="cycle_header">周期</span>
             </span>
             <span class="start_time start_header">开始时间</span>
             <span class="end_time end_header">结束时间</span>
           </li>
           <li>
             <span class="cycle">
               <span class="cycle_time">第一周</span>
             </span>
             <span class="start_time ">
                <template>
                  <div class="block">
                    <el-date-picker
                      v-model="startTime1"
                      type="date"

                      placeholder="选择日期时间">
                    </el-date-picker>
                  </div>
                </template>
             </span>
             <span class="end_time">
                 <template>
                   <div class="block">
                     <el-date-picker
                       v-model="endTime1"
                       type="date"

                       placeholder="选择日期时间">
                     </el-date-picker>
                   </div>
                 </template>
             </span>
           </li>
           <li>
             <span class="cycle">
                <span class="cycle_time">第二周</span>
             </span>
             <span class="start_time">
                 <template>
                   <div class="block">
                     <el-date-picker
                       v-model="startTime2"
                       type="date"

                       placeholder="选择日期时间"
                     >
                     </el-date-picker>
                   </div>
                 </template>
             </span>
             <span class="end_time">
                  <template>
                    <div class="block">
                      <el-date-picker
                        v-model="endTime2"
                        type="date"

                        placeholder="选择日期时间">
                      </el-date-picker>
                    </div>
                  </template>
             </span>
           </li>
           <li class="set-li">
             <button class="reset" @click='sureTime'>保存</button>
           </li>
        </ul>
      </div>
      <div class="setTime" style="margin-top:20px;">
        <p class="setTime_name">
          <span class="setTime_title">日报提交时间设置</span>
        </p>
        <ul class="setTime_content" style="height:80px">
          <li class="first">
            <span class="people_name">公司计划：</span>
            <span class="week_time">{{dailyStartTime}}-{{dailyEndTime}}</span>
            <button class="reset" @click="reset1(1)">设置</button>
          </li>

        </ul>
      </div>

    </div>
    <el-dialog
      :title="titleContent"
      :visible.sync="dialogVisible"
      size="tiny"
      :before-close="handleClose" top='10%'>
      <ul style="margin-left:30px;">
        <li>开始时间：</li>
        <li class="select_weekDay">
          <div class="select_day">星期:</div>
          <div class="weekDay">
            <el-radio-group v-model="radio6">
              <el-radio-button label="星期一"></el-radio-button>
              <el-radio-button label="星期二" style="margin-left: 40px;"></el-radio-button>
              <el-radio-button label="星期三" style="margin-left: 40px;"></el-radio-button>
              <el-radio-button label="星期四" ></el-radio-button>
              <el-radio-button label="星期五" style="margin-left: 40px;"></el-radio-button>
              <el-radio-button label="星期六" style="margin-left: 40px;" ></el-radio-button>
              <el-radio-button label="星期日" ></el-radio-button>
            </el-radio-group>
          </div>
        </li>
        <li class="select_time">
          <div class="select_times">时间:</div>
         <div class="time_template">
           <template>
             <el-time-picker
               v-model="value4"
               format="HH:mm"
             >
             </el-time-picker>
           </template>
         </div>
        </li>
        <li>结束时间：</li>
        <li class="select_weekDay">
          <div class="select_day">星期:</div>
          <div class="weekDay">
            <el-radio-group v-model="radio3">
              <el-radio-button label="星期一"></el-radio-button>
              <el-radio-button label="星期二" style="margin-left: 40px;"></el-radio-button>
              <el-radio-button label="星期三" style="margin-left: 40px;"></el-radio-button>
              <el-radio-button label="星期四" ></el-radio-button>
              <el-radio-button label="星期五" style="margin-left: 40px;"></el-radio-button>
              <el-radio-button label="星期六" style="margin-left: 40px;" ></el-radio-button>
              <el-radio-button label="星期日" ></el-radio-button>
            </el-radio-group>
          </div>
        </li>
        <li class="select_time">
          <div class="select_times">时间:</div>
         <div class="time_template">
           <template>
             <el-time-picker
               v-model="value2"
               format="HH:mm"
             >
             </el-time-picker>
           </template>
         </div>
        </li>
        <!-- <li class="select_time">
            <div class="select_times">部门周报:</div>
            <div class="time_content" style="margin-left:20px;">
              个人周报的后　
            </div>
            <div class="time_template1">
              <el-input v-model="weekData"></el-input>
            </div>
            <div class="time_content">
              　天
            </div>
        </li>
        <li class="select_time">
            <div class="select_times">公司计划:</div>
            <div class="time_content" style="margin-left:20px;">
              个人周报的后　
            </div>
            <div class="time_template1">
              <el-input v-model="planData"></el-input>
            </div>
            <div class="time_content">
              　天
            </div>
        </li> -->
      </ul>
      <span slot="footer" class="dialog-footer">
         <button @click="dialogVisible = false">取消</button>
        <button @click="preserve">保存</button>
      </span>
    </el-dialog>

    <el-dialog
      title="日报提交时间"
      :visible.sync="dialogVisible1"
      size="tiny"
      :before-close="handleClose1" top='20%'>
      <ul>
        <!-- <li class="select_weekDay">
          <div class="select_day">选择星期:</div>
          <div class="weekDay">
            <el-radio-group v-model="radio4">
              <el-radio-button label="星期一"></el-radio-button>
              <el-radio-button label="星期二" style="margin-left: 40px;"></el-radio-button>
              <el-radio-button label="星期三" style="margin-left: 40px;"></el-radio-button>
              <el-radio-button label="星期四" ></el-radio-button>
              <el-radio-button label="星期五" style="margin-left: 40px;"></el-radio-button>
              <el-radio-button label="星期六" style="margin-left: 40px;" ></el-radio-button>
              <el-radio-button label="星期日" ></el-radio-button>
            </el-radio-group>
          </div>
        </li> -->
        <li class="select_time">
          <div class="select_times">开始时间:</div>
         <div class="time_template" style="margin-top:0px;">
           <template>
             <el-time-picker
               v-model="dailyStartTime1"
               format="HH:mm"
             >
             </el-time-picker>
           </template>
         </div>
        </li>
        <li class="select_time">
          <div class="select_times">结束时间:</div>
         <div class="time_template" style="margin-top:0px;">
           <template>
             <el-time-picker
               v-model="dailyEndTime1"
               format="HH:mm"
             >
             </el-time-picker>
           </template>
         </div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
         <button @click="dialogVisible1 = false">取消</button>
        <button @click="preserve1">保存</button>
      </span>
    </el-dialog>

  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
  import { weeklyTimeList,preserveWeeklyTime,updateCompanyWeeklySetUp,updateDeptWeeklySetUp, updateDailySetUp,updateWeeklySetUp } from 'service/getData'
  import {ERR_OK} from 'service/config'
//  import Tab from 'components/common/tab'
  export default {
    data() {
      return {
        dialogVisible:false,
        dialogVisible1:false,
        startTime1:"",
        endTime1:"",
        startTime2:"",
        titleContent:"个人周报自动提交时间设置",
        endTime2:"",
        radio3: '星期五',
        radio4: '星期五',
        radio6:'星期五',
        idFace:'',
        weekData:1,
        planData:2,
        staffDefaultDeliveryweek:'',
        staffDefaultStartDeliveryweek:'',
        staffDefaultStartDeliveryhourStr:'',
        staffDefaultStartDeliveryminuteStr:'',
        mangerDefaultStartDeliveryweek:'',
        mangerDefaultStartDeliveryhourStr:'',
        mangerDefaultStartDeliveryminuteStr:'',
        headerDefaultStartDeliveryweek:'',
        headerDefaultStartDeliveryhourStr:'',
        headerDefaultStartDeliveryminuteStr:'',
        headerDefaultDeliveryweek:'',
        mangerDefaultDeliveryweek:'',
        staffDefaultDeliveryhour:'',
        dailyStartTime:'',
        dailyEndTime:'',
        dailyStartTime1:'',
        dailyEndTime1:'',
        staffDefaultDeliveryminute:'',
        headerDefaultDeliveryhour:'',
        headerDefaultDeliveryminute:'',
        mangerDefaultDeliveryhour:'',
        mangerDefaultDeliveryminute:'',
        value2: '',
        value4:'',
        weeklyCycleId:''
      };
    },
    components: {
//      Tab
    },
    mounted () {
      this.getData()
    },
    methods: {
      getData () {
        weeklyTimeList ().then((res) => {
          if(res.code == ERR_OK) {
            this.startTime1 = res.data.deliveryStartTime
            this.startTime2 = res.data.deliveryNstartTime
            this.endTime1 = res.data.deliveryEndTime
            this.endTime2 = res.data.deliveryNendTime
            this.staffDefaultDeliveryweek = res.data.staffDefaultDeliveryweek
            this.staffDefaultStartDeliveryweek = res.data.staffDefaultStartDeliveryweek
            this.staffDefaultStartDeliveryhourStr = res.data.staffDefaultStartDeliveryhourStr
            this.staffDefaultStartDeliveryminuteStr = res.data.staffDefaultStartDeliveryminuteStr

            this.mangerDefaultStartDeliveryweek = res.data.mangerDefaultStartDeliveryweek
            this.mangerDefaultStartDeliveryhourStr = res.data.mangerDefaultStartDeliveryhourStr
            this.mangerDefaultStartDeliveryminuteStr = res.data.mangerDefaultStartDeliveryminuteStr

            this.headerDefaultStartDeliveryweek = res.data.headerDefaultStartDeliveryweek
            this.headerDefaultStartDeliveryhourStr = res.data.headerDefaultStartDeliveryhourStr
            this.headerDefaultStartDeliveryminuteStr = res.data.headerDefaultStartDeliveryminuteStr

            this.headerDefaultDeliveryweek = res.data.headerDefaultDeliveryweek
            this.mangerDefaultDeliveryweek = res.data.mangerDefaultDeliveryweek
            this.staffDefaultDeliveryhour = res.data.staffDefaultDeliveryhourStr
            this.dailyStartTime = res.data.dailyStartTime
            this.dailyEndTime = res.data.dailyEndTime
            this.staffDefaultDeliveryminute = res.data.staffDefaultDeliveryminuteStr
            this.headerDefaultDeliveryhour = res.data.headerDefaultDeliveryhourStr
            this.headerDefaultDeliveryminute = res.data.headerDefaultDeliveryminuteStr
            this.mangerDefaultDeliveryhour = res.data.mangerDefaultDeliveryhourStr
            this.mangerDefaultDeliveryminute = res.data.mangerDefaultDeliveryminuteStr
            this.weekData = res.data.deptWeeklyDefaultDiffDay
            this.planData = res.data.companyPlanDefaultDiffDay
            this.weeklyCycleId =res.data.weeklyCycleId
          }
       })
      },
      sureTime () {
        if(typeof(this.startTime1) == 'undefined' || typeof(this.startTime2) == 'undefined' || this.startTime1==''|| this.startTime2==''){
          this.$notify.info({
            title: '提示',
            message: '请选择开始时间'
          });
        }else if(typeof(this.endTime1) == 'undefined' || typeof(this.endTime2) == 'undefined' || this.endTime1==''|| this.endTime2==''){
          this.$notify.info({
            title: '提示',
            message: '请选择结束时间'
          });
        }else{
          let self = this
          if(this.weeklyCycleId==null){
            this.weeklyCycleId = ''
          }
          const params = {
            // staffDefaultDeliveryweek:this.staffDefaultDeliveryweek,
            // staffDefaultDeliveryhour:this.staffDefaultDeliveryhour,
            // staffDefaultDeliveryminute:this.staffDefaultDeliveryminute,
            // deptWeeklyDefaultDiffDay:this.weekData,
            // companyPlanDefaultDiffDay:this.planData,
            // dailyStartTime:this.dailyStartTime,
            // dailyEndTime:this.dailyEndTime,
            deliveryStartTimeStr:this.formatDateTime(this.startTime1),
            deliveryEndTimeStr:this.formatDateTime(this.endTime1),
            deliveryNstartTimeStr:this.formatDateTime(this.startTime2),
            deliveryNendTimeStr:this.formatDateTime(this.endTime2),
            weeklyCycleId:this.weeklyCycleId
          }
          preserveWeeklyTime (params).then((res) => {
            if(res.code == ERR_OK) {
              self.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success'
              });
              self.getData()
            }else{
              this.$notify.error({
                title: '提示',
                message: res.msg
              });
            }
         })
        }
      },
      reset1(val,key){
        this.dialogVisible1 = true
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month =myDate.getMonth()+1;
        var date =myDate.getDate();
        this.dailyStartTime1 = new Date(year, month, date, this.dailyStartTime.split(':')[0],  this.dailyStartTime.split(':')[1])
        this.dailyEndTime1 = new Date(year, month, date, this.dailyEndTime.split(':')[0],  this.dailyEndTime.split(':')[1])
      },
      reset(val,key,weekDay){
//        console.log(key)
        this.idFace = val
        this.dialogVisible = true
        this.radio3 = key
        this.radio6 = weekDay
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month =myDate.getMonth()+1;
        var date =myDate.getDate();
        if(val==1){
          this.titleContent = '个人周报自动提交时间设置'
          this.value2 = new Date(year, month, date, this.staffDefaultDeliveryhour, this.staffDefaultDeliveryminute)
          this.value4 = new Date(year, month, date, this.staffDefaultStartDeliveryhourStr, this.staffDefaultStartDeliveryminuteStr)
          console.log(this.value2)
        } else if(val==2){
          this.titleContent = '部门周报自动提交时间设置'
          this.value2 = new Date(year, month, date, this.headerDefaultDeliveryhour, this.headerDefaultDeliveryminute)
          this.value4 = new Date(year, month, date, this.headerDefaultStartDeliveryhourStr, this.headerDefaultStartDeliveryminuteStr)
        }else if(val==3){
          this.titleContent = '公司计划自动提交时间设置'
          this.value2 = new Date(year, month, date, this.mangerDefaultDeliveryhour, this.mangerDefaultDeliveryminute)
          this.value4 = new Date(year, month, date, this.mangerDefaultStartDeliveryhourStr, this.mangerDefaultStartDeliveryminuteStr)
        }

      },
      handleClose(done) {
        this.dialogVisible = false
      },
      handleClose1(done) {
        this.dialogVisible1 = false
      },
//      日期格式化
       formatDateTime(date) {
         var   reg   =   /^(\d{4})-(\d{2})-(\d{2})/;
//         console.log(reg.test(date));
         if(reg.test(date)){
           return date
         }else{
           var y = date.getFullYear();
           var m = date.getMonth() + 1;
           m = m < 10 ? ('0' + m) : m;
           var d = date.getDate();
           d = d < 10 ? ('0' + d) : d;
           var h = date.getHours();
           h=h < 10 ? ('0' + h) : h;
           var minute = date.getMinutes();
           minute = minute < 10 ? ('0' + minute) : minute;
           return y + '-' + m + '-' + d+' '+h+':'+minute;
         }
       },
       dailyTimeServer (dailyStartTime,dailyEndTime) {
         const params = {
           dailyStartTime:dailyStartTime,
           dailyEndTime:dailyEndTime,
           weeklyCycleId:this.weeklyCycleId
         }
         updateDailySetUp (params).then((res) => {
           if(res.code == ERR_OK) {
             this.$notify({
               title: '成功',
               message: '保存成功',
               type: 'success'
             });
             this.getData()
           }else{
             this.getData()
             this.$notify.error({
               title: '提示',
               message: res.msg
             });
           }
        })
       },
       weeklyTimeServer (staffDefaultDeliveryweek,staffDefaultDeliveryhour,staffDefaultDeliveryminute,staffDefaultStartDeliveryweek,staffDefaultStartDeliveryhourStr,staffDefaultStartDeliveryminuteStr) {
         const params = {
           staffDefaultDeliveryweek:staffDefaultDeliveryweek,
           staffDefaultDeliveryhour:staffDefaultDeliveryhour,
           staffDefaultDeliveryminute:staffDefaultDeliveryminute,
           staffDefaultStartDeliveryweek:staffDefaultStartDeliveryweek,
           staffDefaultStartDeliveryhour:staffDefaultStartDeliveryhourStr,
           staffDefaultStartDeliveryminute:staffDefaultStartDeliveryminuteStr,
           weeklyCycleId:this.weeklyCycleId
         }
         updateWeeklySetUp (params).then((res) => {
           if(res.code == ERR_OK) {
             this.$notify({
               title: '成功',
               message: '保存成功',
               type: 'success'
             });
             this.getData()
           }else{
             this.getData()
             this.$notify.error({
               title: '提示',
               message: res.msg
             });
           }
        })
       },

       weeklyTimeServer2 (staffDefaultDeliveryweek,staffDefaultDeliveryhour,staffDefaultDeliveryminute,staffDefaultStartDeliveryweek,staffDefaultStartDeliveryhourStr,staffDefaultStartDeliveryminuteStr) {
         const params = {
           headerDefaultDeliveryweek:staffDefaultDeliveryweek,
           headerDefaultDeliveryhour:staffDefaultDeliveryhour,
           headerDefaultDeliveryminute:staffDefaultDeliveryminute,
           headerDefaultStartDeliveryweek:staffDefaultStartDeliveryweek,
           headerDefaultStartDeliveryhour:staffDefaultStartDeliveryhourStr,
           headerDefaultStartDeliveryminute:staffDefaultStartDeliveryminuteStr,
           weeklyCycleId:this.weeklyCycleId
         }
         updateDeptWeeklySetUp (params).then((res) => {
           if(res.code == ERR_OK) {
             this.$notify({
               title: '成功',
               message: '保存成功',
               type: 'success'
             });
             this.getData()
           }else{
             this.getData()
             this.$notify.error({
               title: '提示',
               message: res.msg
             });
           }
        })
       },
       weeklyTimeServer3 (staffDefaultDeliveryweek,staffDefaultDeliveryhour,staffDefaultDeliveryminute,staffDefaultStartDeliveryweek,staffDefaultStartDeliveryhourStr,staffDefaultStartDeliveryminuteStr) {
         const params = {
           mangerDefaultDeliveryweek:staffDefaultDeliveryweek,
           mangerDefaultDeliveryhour:staffDefaultDeliveryhour,
           mangerDefaultDeliveryminute:staffDefaultDeliveryminute,
           mangerDefaultStartDeliveryweek:staffDefaultStartDeliveryweek,
           mangerDefaultStartDeliveryhour:staffDefaultStartDeliveryhourStr,
           mangerDefaultStartDeliveryminute:staffDefaultStartDeliveryminuteStr,
           weeklyCycleId:this.weeklyCycleId
         }
         updateCompanyWeeklySetUp (params).then((res) => {
           if(res.code == ERR_OK) {
             this.$notify({
               title: '成功',
               message: '保存成功',
               type: 'success'
             });
             this.getData()
           }else{
             this.getData()
             this.$notify.error({
               title: '提示',
               message: res.msg
             });
           }
        })
       },
       preserve1 () {
         var reg = /^\d+$/;
        if(typeof(this.dailyStartTime1) == 'undefined'||this.dailyStartTime1==''){
          this.$notify.info({
            title: '提示',
            message: '请选择开始时间'
          });
        }else if(typeof(this.dailyEndTime1) == 'undefined'||this.dailyEndTime1==''){
          this.$notify.info({
            title: '提示',
            message: '请选择结束时间'
          });
        }
        else{
            this.dialogVisible1 = false
            this.dailyStartTime1 = this.dailyStartTime1.toString()
            this.dailyEndTime1 = this.dailyEndTime1.toString()
            //console.log(this.dailyStartTime1)
            this.dailyStartTime = this.dailyStartTime1.split(' ')[4].split(':')[0]+':'+this.dailyStartTime1.split(' ')[4].split(':')[1]
            this.dailyEndTime = this.dailyEndTime1.split(' ')[4].split(':')[0]+':'+this.dailyEndTime1.split(' ')[4].split(':')[1]
            this.dailyTimeServer(this.dailyStartTime,this.dailyEndTime)
        }
      },
       preserve () {
         var reg = /^\d+$/;
        if(typeof(this.value2) == 'undefined'||this.value2==''||typeof(this.value4) == 'undefined'||this.value4==''){
          this.$notify.info({
            title: '提示',
            message: '请选择时间'
          });
        }
        else{
          this.dialogVisible = false
          if(this.idFace == 1){
            this.value2 = this.value2.toString()
            this.value4 = this.value4.toString()
            this.staffDefaultDeliveryweek = this.radio3
            this.staffDefaultStartDeliveryweek = this.radio6
            this.staffDefaultDeliveryhour = this.value2.split(' ')[4].split(':')[0]
            this.staffDefaultDeliveryminute = this.value2.split(' ')[4].split(':')[1]
            this.staffDefaultStartDeliveryhourStr = this.value4.split(' ')[4].split(':')[0]
            this.staffDefaultStartDeliveryminuteStr = this.value4.split(' ')[4].split(':')[1]
            this.weeklyTimeServer(this.staffDefaultDeliveryweek,this.staffDefaultDeliveryhour,this.staffDefaultDeliveryminute,this.staffDefaultStartDeliveryweek,this.staffDefaultStartDeliveryhourStr,this.staffDefaultStartDeliveryminuteStr)
          }else if(this.idFace == 2){//部门周报
            this.value2 = this.value2.toString()
            this.value4 = this.value4.toString()
            this.headerDefaultDeliveryweek = this.radio3
            this.headerDefaultStartDeliveryweek = this.radio6
            this.headerDefaultDeliveryhourStr = this.value2.split(' ')[4].split(':')[0]
            this.headerDefaultDeliveryminuteStr = this.value2.split(' ')[4].split(':')[1]
            this.headerDefaultStartDeliveryhourStr = this.value4.split(' ')[4].split(':')[0]
            this.headerDefaultStartDeliveryminuteStr = this.value4.split(' ')[4].split(':')[1]
            this.weeklyTimeServer2(this.headerDefaultDeliveryweek,this.headerDefaultDeliveryhourStr,this.headerDefaultDeliveryminuteStr,this.headerDefaultStartDeliveryweek,this.headerDefaultStartDeliveryhourStr,this.headerDefaultStartDeliveryminuteStr)
          }else if(this.idFace == 3){
            this.value2 = this.value2.toString()
            this.value4 = this.value4.toString()
            this.mangerDefaultDeliveryweek = this.radio3
            this.mangerDefaultStartDeliveryweek = this.radio6
            this.mangerDefaultDeliveryhourStr = this.value2.split(' ')[4].split(':')[0]
            this.mangerDefaultDeliveryminuteStr = this.value2.split(' ')[4].split(':')[1]
            this.mangerDefaultStartDeliveryhourStr = this.value4.split(' ')[4].split(':')[0]
            this.mangerDefaultStartDeliveryminuteStr = this.value4.split(' ')[4].split(':')[1]
            this.weeklyTimeServer3(this.mangerDefaultDeliveryweek,this.mangerDefaultDeliveryhourStr,this.mangerDefaultDeliveryminuteStr,this.mangerDefaultStartDeliveryweek,this.mangerDefaultStartDeliveryhourStr,this.mangerDefaultStartDeliveryminuteStr)
          }
        }
      }
    }
  };
</script>
<style lang="scss"  scoped>
  .setCenter-wrapper{
    
    margin: 0 auto;
  }
  .setTime{
    
    .setTime_name{
     height: 46px;
      line-height: 46px;
      width: 100%;
      font-size: 14px;
      color: #333333;
      background: rgba(217,52,55,0.10);
      .setTime_title{
        padding-left: 20px;
      }
    }
  }
  .setTime_content{
    height: 180px;
    background: #ffffff;
    border: 1px solid rgba(0,0,0,0.12);
    li{
      height: 30px;
      line-height: 30px;
      margin-top: 15px;
      .people_name{
        display: inline-block;
        width: 114px;
        text-align: right;
        font-size: 14px;
        color: #333333;
      }
      .week_time{
        font-size: 14px;
        color: #333333;
      }
    }
    li.first{
      margin-top: 20px;
    }
  }
  .set_auto{
    margin-top: 20px;
    .tip{
      font-size: 11px;
      color: #999999;
    }
  }
  .auto_setTime{
    height: 209px;
    background: #ffffff;
    border: 1px solid rgba(0,0,0,0.12);
    li{
      height: 42px;
      line-height: 42px;
      border-bottom: 1px solid rgba(0,0,0,0.12);
    }
  }
  .cycle{
    display: inline-block;
    width: 318px;
  }
  .start_time{
    display: inline-block;
    width: 428px;
  }
  .cycle_header{
    padding-left: 35px;
    font-size: 12px;
    color: #434343;
    font-weight: bold;
  }
  .cycle_time{
    padding-left: 35px;
    font-size: 12px;
    color: #434343;
  }
  .start_header,.end_header{
    font-size: 12px;
    color: #434343;
    font-weight: bold;
  }
  .end_time{
    display: inline-block;
    width: 400px;
  }
  .reset{
    width: 90px;
    height: 30px;
    border: 1px solid #D83436;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 60px;
    font-size: 14px;
    color: #D93437;
    background: #ffffff;
  }
  .set-li{
    height: 80px !important;
    border-bottom: 0 !important;
    .reset{
      margin-left: 550px;
      margin-top: 25px;
    }
  }
  .dialog-footer{

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
  .select_weekDay{
    height: 140px;
  }
  .select_day{
    float: left;
    margin-left: 50px;
    padding-top: 20px;
  }
  .select_times{
    float: left;
    margin-left: 50px;
    padding-top: 10px;
  }
  .weekDay{
    float: left;
    width: 320px;
    height: 140px;
    margin-left: 20px;
  }
  .select_time{
    height: 50px;
  }
  .time_template{
    margin-top: 20px;
  }
  .time_template1{
    float: left;
    //margin-left: 20px;
    width: 66px;
  }
  .time_content{
    float: left;
    //margin-left: 20px;
    line-height: 40px;
  }
</style>
