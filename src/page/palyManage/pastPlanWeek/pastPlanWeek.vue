<template>
  <div class='task-manage'>
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <router-link to="/palyManage">
          <span class="child1">周报管理</span>
        </router-link>
        /
        <router-link to="/palyManage">
          <span class="child1">周报列表</span>
        </router-link>
        /

          <span class="child2">过往周报列表</span>

      </div>

      <div class="special-title">
        <h4>过往周报列表</h4>
      </div>
      <div class="" v-for='item in result'>
        <div class="perform-title" style='margin-top:21px;'>
          <h4>{{item.weeklyYear}}年{{item.weeklyMonth}}月</h4>
        </div>
        <div class="week-wrapper">
          <div class="week-item" v-for='m in item.taskAllDeptWeeklyWeekVos'>
            <router-link :to="{ path: 'pastDepartWeekly',query: {id:m.weeklyStamp}}" style="color:#D93538;">
            <span>{{m.witchWeeksStr}}</span> <span>{{m.startDay}} - {{m.endDay}}</span>
           </router-link>
          </div>
        </div>
      </div>
      <div v-if='total<=0' class='noData' v-cloak>
        暂无过往周报
      </div>
      <div class="pagination-depart" v-if='total>0' v-cloak>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 15, 50]" :page-size="pageShow" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
  import { allHistoryWeekly } from 'service/getData'
  import {ERR_OK,formatDateTime} from 'service/config'
//  import Tab from 'components/common/tab'
  export default {
    data() {
      return {
        currentPage4:1,
        total:100,
        pageShow:10,
        nowPage:1,
        result:[],
        tableData5: []
      }
    },
    components: {
//      Tab
    },
    mounted(){
      this.getData(1,10)
    },
    methods: {
      getData(nowPage,pageShow){
        let self = this
        const params = {
          nowPage:nowPage,
          pageShow:pageShow
        }
        allHistoryWeekly(params).then((res) => {
          if(res.code == ERR_OK) {
            // this.startDay = res.data.startDay
            // this.canPublish = res.data.canPublish
            // this.endDay = res.data.endDay
            // this.noneCommentUserNum = res.data.noneCommentUserNum
            this.result = res.data.result
            this.total = res.data.totalPage
            // this.roleName = res.data.noneCommentUserNum
          }
       })
     },
      handleSizeChange(val) {
        this.pageShow = val
        this.getData(this.nowPage,this.pageShow)

      },
      handleCurrentChange(val) {
        this.nowPage = val
        this.getData(this.nowPage,this.pageShow)
      },
      enter(){
        let el = event.target.childNodes[2]
        el.style.display = 'block'
      },
      leave(){
        let el = event.target.childNodes[2]
        el.style.display = 'none'
        //console.log(el)
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
    height: 25px;
    width: 114px;
    text-align: center;
    border: 1px solid #D93538;
    border-radius: 4px;
    font-size: 14px;
    color: #D93538;
    margin-top: 11px;
    line-height: 25px;
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
    height: 46px;
    line-height: 46px;
    font-size: 14px;
    color: #434343;
    margin-top: 20px;
    border: 1px solid rgba(0,0,0,0.12);
    opacity: 0.99;
    background: rgba(217,52,55,0.02);
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
  }
  .special-title h4{
    margin-left: 20px;
  }
  .week-wrapper{
    height: 42px;
    line-height: 42px;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.12);
    border-top: none;
    box-sizing: border-box;
    font-size: 12px;
    color: #D93538;
  }
  .noData{
    text-align: center;
    font-size: 12px;
    height:40px;
    line-height: 40px;
    border: 1px solid rgba(0,0,0,0.12);
    border-top: none;
  }
  .week-item{
    width: 20%;
    float: left;
    text-align: center;
  }
</style>
