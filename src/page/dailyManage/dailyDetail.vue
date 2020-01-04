<template>
  <div class="dailyManage task-manage">
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <router-link to="/dailyManage">
          <span class="child1">日报管理</span>
        </router-link>  /
        <router-link to="/dailyManage">
        <span class="child1">日报列表</span>
        </router-link> /
          <span class="child2">日报详情</span>
      </div>
      <div class="headLine">
        <span class="userName">{{dailyDetail.userName}} </span>
        <span class="time">{{dailyDetail.dailyDay}}</span>
        <span class="title">日报</span>
      </div>
      <div class="already_task">
         <p class="task_header">
           <span class="task_header_title">一、未完成任务</span>
         </p>
        <el-table
          :data="result"
          row-key="taskId"
          :expand-row-keys="expands"
          @row-click="openDetails"
          style="width: 100%" empty-text='暂无数据'>
          <el-table-column type="expand" v-show='hello'>
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="内容：">
                  <span class='content-tab'>{{ props.row.content }}</span>
                </el-form-item>
                <el-form-item>
                  <div class="input-back">
                    <input type="text" name="" value="" class='inputValue'>
                    <span @click='replyTask(props.row.index,props.row.taskId)' class='replyValue'>回复</span>
                  </div>
                  <div class="" v-for='item in props.row.taskReplys'>
                    <div class="reback-time">
                      {{item.replyTimeDistanceDesc}}
                    </div>
                    <div class="reback" style="max-width: 294px;min-width: 296px;overflow:hidden;">
                      <div style="float:left;">{{item.replyUser.userName}}：</div><div style="float:left;max-width: 247px;word-break: break-all; word-wrap:break-word;">{{item.replyContent}}</div>
                    </div>
                  </div>
                  <!-- <div class="reback-time">
                    2小时前
                  </div>
                  <div class="reback">
                    赵四：这样就挺好的，关注他们的财好几报啊的
                  </div> -->
                </el-form-item>
                <el-form-item label="">
                  <div class="">
                    概要：
                  </div>
                  <div class="reback reback1">
                    任务发布人：{{ props.row.publisher.userName}}
                  </div>
                  <div class="reback reback1">
                    任务执行人：{{ props.row.executor.userName }}
                  </div>
                  <div class="reback reback1">
                    任务协助人：{{ props.row.taskAssistUsers }}
                  </div>
                  <div class="reback reback1">
                    开始日期：{{ props.row.planStartDate }}
                  </div>
                  <div class="reback reback1">
                    截止日期：{{props.row.planEndDate}}
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="任务标题"
            prop="title ">
            <template slot-scope="props">
              <router-link :to="{ path: 'taskDetail',query: {id:props.row.taskId}}" style="color:#505363;">
                <div>{{ props.row.title}}</div>
              </router-link>
              <div>
                <div class="title-left">
                  <div v-cloak v-show='props.row.grade=="PERSONALORD"'><span style="background: #108EE9;"></span><span>个人普通</span></div>
                  <div v-cloak v-show='props.row.grade=="COMPANY"'><span style="background: #F04134;"></span><span>公司重点</span></div>
                  <div v-cloak v-show='props.row.grade=="PERSONALIMP"'><span style="background: #00A854;"></span><span>个人重点</span></div>
                  <div v-cloak v-show='props.row.grade=="DEPARTMENT"'><span style="background: #FFBF00;"></span><span>部门重点</span></div>
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
              <div v-cloak class="" v-if='props.row.lastTaskReplyer!=null'>
                <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="任务状态"
            prop="taskStatusStr" min-width='50'>
            <template slot-scope="props">
                <span>
                  <div >
                    <img v-cloak class="icon_type" v-if="props.row.iconType=='FINISHU'"  src="../../images/lateTime2.png" alt="" >
                    <img v-cloak class="icon_type" v-if="props.row.iconType=='FINISHUW'" src="../../images/timeLate.png" alt="">
                    <img v-cloak class="icon_type" v-if="props.row.iconType=='EXCELLENT'" src="../../images/icon_excellent.png" alt="">
                    <img v-cloak class="icon_type" v-if="props.row.iconType=='GOOD'" src="../../images/icon_good.png" alt="">
                    <img v-cloak class="icon_type" v-if="props.row.iconType=='SECONDARY'" src="../../images/icon_well.png" alt="">
                    <img v-cloak class="icon_type" v-if="props.row.iconType=='DIFFERENCE'" src="../../images/icon_bad.png" alt="">
                    <img v-cloak class="icon_type" v-if="props.row.iconType=='POOR'" src="../../images/icon_worse.png" alt="">
                    <span>{{props.row.taskStatusStr}}</span>
                  </div>
                </span>
            </template>
          </el-table-column>
          <el-table-column
            label="任务总结">
            <template slot-scope="props">
              <span>{{props.row.todaySummary}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="already_task already">
        <p class="task_header">
          <span class="task_header_title">二、已完成任务</span>
        </p>
        <el-table
          :data="list"
          row-key="taskId"
          :expand-row-keys="expands"
          @row-click="openDetails"
          style="width: 100%" empty-text='暂无数据'>
          <el-table-column type="expand" v-cloak v-show='hello'>
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="内容：">
                  <span class='content-tab'>{{ props.row.content }}</span>
                </el-form-item>
                <el-form-item>
                  <div class="input-back">
                    <input type="text" name="" value="" class='inputValue'>
                    <span @click='replyTask(props.row.index,props.row.taskId)' class='replyValue'>回复</span>
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
                  <div class="reback reback1">
                    任务得分：{{ props.row.performanceScore}}
                  </div>
                  <div class="reback reback1">
                    绩效评估分：{{ props.row.evaluatingScore}}
                  </div>
                  <div class="reback reback1">
                    员工自评：{{props.row.comment	}}
                  </div>
                  <div class="reback reback1">
                    部门点评：{{ props.row.taskEvaluation	}}
                  </div>
                  <div class="reback reback1" v-if="props.row.hasSuperiorTaskEvaluat">
                    上级部门点评：{{ props.row.superiorTaskEvaluation}}
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="任务标题"
            prop="title ">
            <template slot-scope="props">
              <router-link :to="{ path: 'taskDetail',query: {id:props.row.taskId}}" style="color:#505363;">
                <div>{{ props.row.title}}</div>
              </router-link>
              <div>
                <div class="title-left">
                  <div v-cloak v-show='props.row.grade=="PERSONALORD"'><span style="background: #108EE9;"></span><span>个人普通</span></div>
                  <div v-cloak v-show='props.row.grade=="COMPANY"'><span style="background: #F04134;"></span><span>公司重点</span></div>
                  <div v-cloak v-show='props.row.grade=="PERSONALIMP"'><span style="background: #00A854;"></span><span>个人重点</span></div>
                  <div v-cloak v-show='props.row.grade=="DEPARTMENT"'><span style="background: #FFBF00;"></span><span>部门重点</span></div>
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
              <div v-cloak class="" v-if='props.row.lastTaskReplyer!=null'>
                <span>{{ props.row.lastTaskReplyer}}：</span><span>{{ props.row.lastTaskReplyContent}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="任务状态"
            prop="taskStatusStr" min-width='50'>
            <template slot-scope="props">
                <span>
                  <div class="">
                    <img v-cloak class="icon_type" v-if="props.row.iconType=='FINISHU'"  src="../../images/lateTime2.png" alt="" >
                    <img v-cloak class="icon_type" v-if="props.row.iconType=='FINISHUW'" src="../../images/timeLate.png" alt="">
                    <img v-cloak class="icon_type" v-if="props.row.iconType=='EXCELLENT'" src="../../images/icon_excellent.png" alt="">
                    <img v-cloak class="icon_type" v-if="props.row.iconType=='GOOD'" src="../../images/icon_good.png" alt="">
                    <img v-cloak class="icon_type" v-if="props.row.iconType=='SECONDARY'" src="../../images/icon_well.png" alt="">
                    <img v-cloak class="icon_type" v-if="props.row.iconType=='DIFFERENCE'" src="../../images/icon_bad.png" alt="">
                    <img v-cloak class="icon_type" v-if="props.row.iconType=='POOR'" src="../../images/icon_worse.png" alt="">
                    <span>{{props.row.taskStatusStr}}</span>
                  </div>
                </span>
            </template>
          </el-table-column>
          <el-table-column
            label="结案评价">
            <template slot-scope="props">
              <span>{{props.row.finalEvaluation}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="already_task already">
        <p class="task_header">
          <span class="task_header_title">自我点评</span>
        </p>
         <div class="evaluate">
           <p class="evaluate_content">{{dailyDetail.dailyComment}}</p>
         </div>
      </div>
      <div class="bottom_btn">
        <router-link to="/dailyManage">
            <p>返回日报管理</p>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
//  import Tab from 'components/common/tab'
  import bus from '../../assets/eventBus'
  import {getDailyDetail,userTaskReply, departmentList} from 'service/getData'
  import {ERR_OK} from 'service/config'
  export default {
    data() {
      return {
        hello:false,
        dailyDetail:"",
        taskId:"",
        show1:true,
        result:[],
        expands:[],
        list:[]
      };
    },
    mounted(){
      this. _getDailyDetail()
    },
    components: {
//      Tab
    },
    methods: {

//    查看日报详情接口
      _getDailyDetail(){
        let param={
          id:this.$route.query.id
        }
        let self=this;
        getDailyDetail(param).then(function (res) {
          if(res.code==ERR_OK){
            self.dailyDetail=res.data.dailyDetail;
            self.result=res.data.uncompletedList;
            self.list=res.data.completedList;
          }else{
            self.$notify.error({
              title: '错误',
              message: res.msg,
            });
          }
        })
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
//      回复
      replyTask(index,val){
        let el = event.target.parentNode.childNodes[0].value
        this.taskId = val
        let self = this
        const params = {
          taskId:this.taskId,
          replyDesc:el
        }
        if(el.length>200){
          this.$notify({
          title: '提示',
          message:'回复内容不能超过200个字符'
          });
        }else{
          userTaskReply(params).then((res) => {
            if(res.code == ERR_OK) {
              self._getDailyDetail();
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
    },
    watch: {
      '$route' (to, from) {
        if(to.query.id && to.path=="/dailyDetail"){
          bus.$emit('tabChange','SUCCESS')
          this._getDailyDetail() //再次调起我要执行的函数
        }
      }
    }
  };
</script>
<style lang="scss"  scoped>
 .headLine{
   width: 100%;
   height: 50px;
   font-size: 16px;
   color: #333333;
   font-weight: bold;
   line-height: 50px;
   .userName{
     padding-left: 20px;
   }
   .time{
     padding-left: 80px;

   }
   .title{
     padding-left: 80px;
   }
 }
  .task_header{
    width: 100%;
    height: 46px;
    line-height: 46px;
    opacity: 0.99;
    background: rgba(217,53,56,0.10);
    .task_header_title{
      font-size: 14px;
      color: #434343;
      padding-left: 20px;
    }
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
  .already{
    margin-top: 20px;
  }
  .status_icon{
    float: left;
    margin-top:12px;
    padding-right: 10px
  }
  .status{
    float: left;
    font-size: 12px;
    color: #434343;
  }
  .evaluate{
    width: 100%;
    background: #FFFFFF;
    border: 1px solid rgba(0,0,0,0.12);
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
  .bottom_btn{
    width: 100%;
    margin-top: 25px;
    p{
      width: 114px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid #D83436;
      border-radius: 4px;
      font-size: 14px;
      color: #D93437;
      margin: 0 auto;
      cursor: pointer;
    }
  }
</style>
