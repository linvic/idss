<template>
  <div class='task-manage'>
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
          <span class="child1">周报管理</span>
        /
        <router-link to="/palyManage">
          <span class="child2">周报列表</span>
        </router-link>
      </div>

      <!-- <div class="nav-wrapper">
        <div class="nav-position">
          <div class="nav-title">
            快捷导航
          </div>
        </div>
      </div> -->
      <div class="title-header">
        <div class="week-title">
          公司计划
        </div>
        <div class="week-date">
          {{startDay}}至{{endDay}}
        </div>
        <router-link to="/pastPlanWeek">
          <!-- <div class="week-button1">
            查看往期周报

          </div> -->
          <el-button
            size="small"
            style='background:transparent;line-height:14px' class='setPlan complete week-button1'>查看往期周报</el-button>
        </router-link>
        <router-link to="/pastDepartWeekly" style='float:right;' v-if='canManagerPlan'>
          <el-button
            size="small"
            style='background:transparent;margin-right:30px;' class='setPlan complete'>制定公司计划</el-button>
        </router-link>
        <el-button
          size="small"
          style='background:transparent;margin-right:30px;float:right;margin-top:9px;' v-if='!canManagerPlan' :disabled="true" class='setPlan complete'>制定公司计划</el-button>
      </div>
      <div class="perform-title" style='margin-top:10px;'>
        <h4>一、公司重点</h4>
      </div>
      <div class="overHide">
        <div class="icon-name" @mouseenter="enter($event)" @mouseleave="leave($event)">
          <i class="el-icon-information"></i>
          <span>{{nextStartDay}}-{{nextEndDay}}</span>
        </div>
        <div class="icon-name" style="right:349px;" @mouseenter="enter($event)" @mouseleave="leave($event)">
          <i class="el-icon-information"></i>
          <span>{{startDay}}-{{endDay}}</span>
        </div>
        <el-table :data="result"
                  row-key="taskId"
                  class="companyImp"
                  :expand-row-keys="expands"
                  @row-click="openDetails"
                  style="width: 100%" empty-text='本周暂无公司重点任务'>
          <el-table-column
            label="序号"
            width="70"
            type="index"
          >
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
                <el-form-item label="总结:">
                  <template>
                      <div v-for="item in props.row.taskWeeklyRelaSummaryEntitys">
                        <span class='content-tab' v-if="item.commentType=='PERSON'"> {{item.userName}}:{{item.summary}} </span>
                        <span class='content-tab' v-if="item.commentType=='DEPTHEADER'">{{item.userName}}:{{item.summary}} </span>
                        <span class='content-tab' v-if="item.commentType=='MANAGER'">{{item.userName}}:{{item.summary}} </span>
                      </div>
                  </template>
                </el-form-item>
                <el-form-item label="计划:">
                  <template>
                    <div v-for="item in props.row.taskWeeklyRelaWeeklyPlanEntitys">
                      <span class='content-tab' v-if="item.commentType=='PERSON'"> {{item.userName}}:{{item.weeklyPlan}} </span>
                      <span class='content-tab' v-if="item.commentType=='DEPTHEADER'">{{item.userName}}:{{item.weeklyPlan}} </span>
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
              <router-link :to="{ path: 'taskDetailManage',query: {id:props.row.taskId}}" style="color:#505363;">
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
          <el-table-column
            label="本周总结"
            prop="desc">
            <template slot-scope="props">
                <div v-if="props.row.taskWeeklyRelaSummary">
                  <span v-if="props.row.taskWeeklyRelaSummary.commentType=='PERSON'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaSummary.summary}}</span>
                  <span v-if="props.row.taskWeeklyRelaSummary.commentType=='DEPTHEADER'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaSummary.summary}} </span>
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
                <span  v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='MANAGER'">{{props.row.taskWeeklyRelaWeeklyPlan.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}} </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 部门总点 -->
      <div class="special-title">
        <h4>二、部门重点任务</h4>
      </div>
      <div class="companyDept" v-for='(item,i) in departResult'>
        <div class="perform-title">
          <h4>{{i+1}}、{{item.deptName}}</h4>
        </div>
        <div class="overHide">
          <div class="icon-name" @mouseenter="enter($event)" @mouseleave="leave($event)">
            <i class="el-icon-information"></i>
            <span>{{nextStartDay}}-{{nextEndDay}}</span>
          </div>
          <div class="icon-name" style="right:349px;" @mouseenter="enter($event)" @mouseleave="leave($event)">
            <i class="el-icon-information"></i>
            <span>{{startDay}}-{{endDay}}</span>
          </div>
          <el-table :data="item.taskWeeklyTaskListVos"
                     row-key="taskId"
                    :expand-row-keys="expands"
                    @row-click="openDetails"
                    style="width: 100%" empty-text='暂无数据'>
            <el-table-column
              label="序号"
              width="70"
            >
              <template slot-scope="props">
                <span>{{i+1}}.{{props.$index+1}}</span>
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
                  <el-form-item label="总结:">
                    <template>
                      <div v-for="item in props.row.taskWeeklyRelaSummaryEntitys">
                        <span class='content-tab' v-if="item.commentType=='PERSON'"> {{item.userName}}:{{item.summary}} </span>
                        <span class='content-tab' v-if="item.commentType=='DEPTHEADER'">{{item.userName}}:{{item.summary}} </span>
                        <span class='content-tab' v-if="item.commentType=='MANAGER'">{{item.userName}}:{{item.summary}} </span>
                      </div>
                    </template>
                  </el-form-item>
                  <el-form-item label="计划:">
                    <template>
                      <div v-for="item in props.row.taskWeeklyRelaWeeklyPlanEntitys">
                        <span class='content-tab' v-if="item.commentType=='PERSON'"> {{item.userName}}:{{item.weeklyPlan}} </span>
                        <span class='content-tab' v-if="item.commentType=='DEPTHEADER'">{{item.userName}}:{{item.weeklyPlan}} </span>
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
                <router-link :to="{ path: 'taskDetailManage',query: {id:props.row.taskId}}" style="color:#505363;">
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
            <el-table-column
              label="本周总结"
              prop="desc">
              <template slot-scope="props">
                  <div v-if="props.row.taskWeeklyRelaSummary">
                    <span v-if="props.row.taskWeeklyRelaSummary.commentType=='PERSON'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaSummary.summary}}</span>
                    <span v-if="props.row.taskWeeklyRelaSummary.commentType=='DEPTHEADER'">{{props.row.taskWeeklyRelaSummary.userName}}：{{props.row.taskWeeklyRelaSummary.summary}} </span>
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
                  <span  v-if="props.row.taskWeeklyRelaWeeklyPlan.commentType=='MANAGER'">{{props.row.taskWeeklyRelaWeeklyPlan.userName}}：{{props.row.taskWeeklyRelaWeeklyPlan.weeklyPlan}} </span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
  import { LastManageWeekly,userTaskReply,dragTask} from 'service/getData'
  import {ERR_OK} from 'service/config'
  import Sortable from 'sortablejs'
//  import Tab from 'components/common/tab'
  export default {
    data() {
      return {
        endDay:'',
        startDay:'',
        nextStartDay:'',
        nextEndDay:'',
        result:[],
        expands:[],
        canManagerPlan:false,
        departResult:[],
        sortable: null,
        olderList: [],
        newList: [],
      }
    },
    components: {
//      Tab
    },
    mounted(){
      this.getData()
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
      getData() {
        let self = this
        LastManageWeekly().then((res) => {
          if(res.code == ERR_OK) {
            this.result = res.data.companyTaskWeeklyTaskListVos
            this.departResult = res.data.deptTaskWeeklyTaskListVos
            this.endDay = res.data.endDay
            this.startDay = res.data.startDay
            this.nextEndDay = res.data.nextEndDay
            this.nextStartDay = res.data.nextStartDay
            this.canManagerPlan = res.data.canManagerPlan
            this.$nextTick(() => {
              this.setSort()
              this.setSort_part()
            })
          }
       })
      },
      handleSizeChange(val) {

        this.pageShow = val

      },
      handleCurrentChange(val) {
        this.nowPage = val
      },
      enter(event){
        let el = event.target.childNodes[2]
        el.style.display = 'block'
      },
      leave(event){
        let el = event.target.childNodes[2]
        el.style.display = 'none'
      },
//      公司重点拖动排序
      setSort(){
        const el = document.querySelectorAll('.companyImp .el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
            onEnd: evt => {
              var oldIndex=evt.oldIndex;
              var newIndex=evt.newIndex;
              if(oldIndex>newIndex){
                if(newIndex==0){
                  this._dragTask(this.result[oldIndex].taskId,'',this.result[newIndex].taskId,1)
                }
                else{
                  this._dragTask(this.result[oldIndex].taskId,this.result[newIndex-1].taskId,this.result[newIndex].taskId,1)
                }
              }else{
                if(newIndex==0){
                  this._dragTask(this.result[oldIndex].taskId,'',this.result[newIndex].taskId,1)
                }else if(newIndex==this.result.length-1){
                  this._dragTask(this.result[oldIndex].taskId,this.result[newIndex].taskId,'',1)
                }
                else{
                  if(newIndex>=this.result.length){
                    this._dragTask(this.result[oldIndex].taskId,this.result[-1].taskId,'',1)
                  }else{
                    this._dragTask(this.result[oldIndex].taskId,this.result[newIndex].taskId,this.result[newIndex+1].taskId,1)
                  }
                }
              }
            }
          })
      },
     //部门重点任务拖动排序
      setSort_part(){
        const el = document.querySelectorAll('.companyDept .el-table__body-wrapper > table > tbody')
        for(let i=0;i<el.length;i++){
          this.sortable = Sortable.create(el[i], {
            onEnd: evt => {
              var oldIndex=evt.oldIndex;
              var newIndex=evt.newIndex;
              if(oldIndex>newIndex){
                if(newIndex==0){
                  this._dragTask(this.departResult[i].taskWeeklyTaskListVos[oldIndex].taskId,'',this.departResult[i].taskWeeklyTaskListVos[newIndex].taskId,2)
                }
                else{
                  this._dragTask(this.departResult[i].taskWeeklyTaskListVos[oldIndex].taskId,this.departResult[i].taskWeeklyTaskListVos[newIndex-1].taskId,this.departResult[i].taskWeeklyTaskListVos[newIndex].taskId,2)
                }
              }else{
                if(newIndex==0){
                  this._dragTask(this.departResult[i].taskWeeklyTaskListVos[oldIndex].taskId,'',this.departResult[i].taskWeeklyTaskListVos[newIndex].taskId,2)
                }else if(newIndex==this.departResult[i].taskWeeklyTaskListVos.length-1){
                  this._dragTask(this.departResult[i].taskWeeklyTaskListVos[oldIndex].taskId,this.departResult[i].taskWeeklyTaskListVos[newIndex].taskId,'',2)
                }
                else{
                  if(newIndex>=this.departResult[i].taskWeeklyTaskListVos.length){
                    this._dragTask(this.departResult[i].taskWeeklyTaskListVos[oldIndex].taskId,this.departResult[i].taskWeeklyTaskListVos[newIndex-1].taskId,'',2)
                  }else{
                  this._dragTask(this.departResult[i].taskWeeklyTaskListVos[oldIndex].taskId,this.departResult[i].taskWeeklyTaskListVos[newIndex].taskId,this.departResult[i].taskWeeklyTaskListVos[newIndex+1].taskId,2)
                   }
                  }
              }

            }
          })
        }
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
            this.refresh1()
          }
          if(num==2){
            this.refresh2()
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
      refresh1(){
        LastManageWeekly().then((res) => {
          if(res.code == ERR_OK) {
            this.result = res.data.companyTaskWeeklyTaskListVos
          }
        })
      },
      refresh2(){
        LastManageWeekly().then((res) => {
          if(res.code == ERR_OK) {
            this.departResult = res.data.deptTaskWeeklyTaskListVos
          }
        })
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
    height: 30px;
    width: 104px;
    text-align: center;
    border: 1px solid #D93538;
    border-radius: 4px;
    font-size: 14px;
    color: #D93538;
    margin-top: 8px;
    line-height: 30px;
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
    margin-top: 10px;
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
    margin-top: 10px;
  }
  .special-title h4{
    margin-left: 20px;
  }
  .overHide{
    position: relative;
  }
  .icon-name{
    position: absolute;
    top:16px;
    z-index: 300;
    right:128px;
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
.setPlan:hover{
  color:#fff !important;
}
.setPlan.is-disabled{
  background-color: #fff !important;
  border-color: #d1dbe5 !important;
  color: #bfcbd9 !important;
}
</style>
