<template>
  <div>
      <div class="shortcuts_left left">
        <h2 class="title_tip"><span>快捷浏览</span></h2>
        <div class="shortcuts_content">
          <div class="left handling">
            <router-link :to="pendingTask">
              <div class="handle_center">
                <div class="circle">{{data.pendingTaskSize}}</div>
                <div class="plan">待处理任务</div>
              </div>
            </router-link>
          </div>
          <div class="left handling">
            <router-link :to="weekManage">
              <div class="handle_center">
                <div class="circle">{{data.pendingTaskplanSize}}</div>
                <div class="plan">待处理计划</div>
              </div>
            </router-link>
          </div>
          <div class="left handling">
            <router-link :to="deal">
              <div class="handle_center">
                <div class="circle">{{data.pendingAppealSize}}</div>
                <div class="plan">待处理申述</div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import bus from '../assets/eventBus'
  import {myPending} from '../service/getData'
  import {ERR_OK} from 'service/config'
  import { mapGetters} from 'vuex'
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
      return {
       data:[],
       pendingTask:"/taskManage/taskManage",
       weekManage:"",
        deal:""
      }
    },
    components:{

    },
    created(){
      
         if(this.userView=='DEPT'){
           this.weekManage="/weekManageDepartLeader"
           this.deal='/performanceDept?userView=DEPT'
           this._myPending()
         }
        if(this.userView=='MANAGER'){
          this.weekManage="/palyManage"
          this.deal='/performanceManageManger?userView=MANAGER'
          this._myPending()
        }
    },
    mounted(){
      var self=this;
      bus.$on('task', function (msg) {
        if(msg=='SUCCESS'){
          if(self.userView=='MANAGER'){
            self.weekManage="/palyManage"
            self.deal='/performanceManageManger?userView=MANAGER'
            self._myPending()
          }
            if(self.userView=='DEPT'){
              self.weekManage="/weekManageDepartLeader"
              self.deal='/performanceDept?userView=DEPT'
              self._myPending()
            }
        }
      })
    },
    methods:{
     _myPending(){
       myPending().then( (res) =>{
         if(res.code==ERR_OK){
            this.data=res.data;
         }else{
           this.$notify.info({
             title: '消息',
             message: res.msg,
           });
         }
       })
     }
    }
  }
</script>
<style lang="scss"  scoped>
  @import '../style/mixin';
  .shortcuts_left{
     @include wh(100%,200px);
    background: #FFFFFF;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 6px;
  }
  .title_tip{
    display: block;
  @include wh(100%,51px);
    line-height: 51px;
    font-size: 16px;
    color: #505363;
    background: #f3f3f3;
  span{
    padding-left: 20px;
  }
  }
  .shortcuts_content{
  @include wh(100%,149px);
    background: #FFFFFF;
    box-shadow: 0 2px 11px 0 rgba(0,0,0,0.07);
    border-radius: 6px;
    position: relative;
  .handling{
  @include wh(33.3%,149px);
  .handle_center{
    width: 72px;
    margin: 0 auto;
  .circle{
  @include wh(66px,66px);
    line-height: 66px;
    border-radius:50%;
    border: 3px solid #E0E0E0;
    text-align: center;
    font-size: 18px;
    color: #32BBE2;
    margin-top: 25px;
  }
  .plan{
    font-size: 12px;
    color: #757575;
    width: 72px;
    text-align: center;
    height: 12px ;
    margin-top:11px;
  }
  }
  }
  }
</style>
