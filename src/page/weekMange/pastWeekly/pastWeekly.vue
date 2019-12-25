<template>
  <div>
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <router-link to="/weekManageDepartLeader">
          <span class="child1">周报管理</span>
        </router-link>
        /
        <router-link to="/weekManageDepartLeader">
          <span class="child1">周报列表</span>
        </router-link>
        /
        <span class="child2">过往周报列表</span>
      </div>
      <div class="" >
        <div class="role-title" style='margin-bottom:25px;'>
          <div class="role-num import-num">
            过往周报列表
          </div>
          <div class="role-num">
            月份：
            <!-- <el-select v-model="value3" placeholder="请选择团队" class="role-button">
              <el-option v-for="item in options3" :key="item.teamId" :label="item.teamName" :value="item.teamId">
              </el-option>
            </el-select> -->
            <span class='dailyManage' >
              <el-date-picker v-model="value3" type="month" placeholder="选择月份" >
              </el-date-picker>
            </span>
          </div>

          <div class="button-perform" @click='searchTime'>
            搜索
          </div>
        </div>

        <div class="get-reward">
          <el-table
            :data="result"
            style="width: 100%" empty-text='暂无数据'>
            <el-table-column
              prop="person"
              label="日期"
            >
            <template slot-scope='props'>
              <span>{{props.row.startDay}} - {{props.row.endDay}}</span>
            </template>
            </el-table-column>
            <el-table-column
              prop="taskTotalScore"
              label="平均任务总分"
            >
            </el-table-column>
            <el-table-column
              prop="evaluatingScore"
              label="平均绩效"
            >
            </el-table-column>
            <el-table-column
              prop="sourceType"
              label="操作"
            >
            <template slot-scope='props'>
              <router-link :to="{ path: 'departWeeklyDetail',query: {id:props.row.deptWeeklyId}}">
                <span style="color: #D93437;cursor:pointer;">查看</span>
              </router-link>
            </template>
            </el-table-column>

          </el-table>
        </div>
        <div class="pagination-depart" v-show='total>0'>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 15, 50]" :page-size=pageShow layout="total, sizes, prev, pager, next, jumper" :total=total>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { departHistoryWeekly } from 'service/getData'
  import {ERR_OK,formatDateTime} from 'service/config'
//  import Tab from 'components/common/tab'
  export default {
    data() {
      return {
        value1:'',
        value2:'',
        value3:'',
        value4:'',
        result:[],
        tabs: ["任务绩效", "考勤绩效","奖惩记录","工资条","处理申诉<span style='color:#C2453A;'> (4) </span>"],
        num: 0,
        pagination:true,
        currentPage4:1,
        total:100,
        options1:[],
        options2:[],
        options3:[],
        pageShow:10,
        nowPage:1,
        tableData: [{
          person:'张三',
          time:'提前',
          weight:'提前',
          score:'23',
          date: '2017年08月14日例会纪要：3天内跟贴',
          name: '2016-05-04 08:36',
          money:'公告提醒',
         }, {
          person:'张三',
          time:'提前',
          weight:'提前',
          score:'23',
          date: '2017年08月14日例会纪要：3天内跟贴',
          name: '2016-05-04 08:36',
          money:'公告提醒',
         }, {
          person:'张三',
          time:'提前',
          weight:'提前',
          score:'23',
          date: '2017年08月14日例会纪要：3天内跟贴',
          name: '2016-05-04 08:36',
          money:'公告提醒',
         }, {
          person:'张三',
          time:'提前',
          weight:'提前',
          score:'23',
          date: '2017年08月14日例会纪要：3天内跟贴',
          name: '2016-05-04 08:36',
          money:'公告提醒',
         }],
        options:[]
      };
    },
    components: {
//      Tab
    },

    mounted(){
      this.getData(1,10)
    },
    methods: {
      tab(index) {
        this.num = index
      },
      searchTime(){
        if(this.value3==''){
          var time = this.value3
        }else{
          var time = formatDateTime(this.value3)
        }
        this.getData(this.nowPage,this.pageShow,time)
      },
      getData(nowPage,pageShow,m) {
        let self = this
        const params = {
          nowPage:nowPage,
          pageShow:pageShow,
          date:m
        }
        departHistoryWeekly(params).then((res) => {
          if(res.code == ERR_OK) {
            this.result = res.data.result
            this.total = res.data.totalPage
          }
       })
      },
      handleSizeChange(val) {
        this.pageShow = val
        if(this.value3==''){
          var time = this.value3
        }else{
          var time = formatDateTime(this.value3)
        }
        this.getData(this.nowPage,this.pageShow,time)
      },
      handleCurrentChange(val) {
        this.nowPage = val
        if(this.value3==''){
          var time = this.value3
        }else{
          var time = formatDateTime(this.value3)
        }
        this.getData(this.nowPage,this.pageShow,time)
      },
    }
  };
</script>
<style lang="scss"  scoped>
  .user-title{
    opacity: 0.99;
    background: rgba(217,52,55,0.10);
    height: 46px;
    line-height: 46px;
    width: 100%;
    font-size: 14px;
    border: 1px solid rgba(0,0,0,0.12);
  }

  .title-name{
    float: left;
    padding: 0 14px;
    color: #333333;
    text-align: center;
    box-sizing: border-box;
    height:46px;
    cursor: pointer;
  }
  .title-name1{
    margin-left: 54px;
  }
  .title-name span{
    color: #C2453A !important;
  }
  .title-name:first-child{
    margin-left: 0px;
  }
  .title-name.active{
    color: #D93538;
    border-bottom:2px solid #D93538;
  }
  .role-title {
    margin-top: 10px;
    height: 46px;
    line-height: 46px;
    border: 1px solid rgba(0,0,0,0.12);
    opacity: 0.99;
    background: rgba(217,52,55,0.10);
  }
  .role-num {
    float: left;
    font-size: 14px;
    color: #333333;
  }
  .role-num:nth-child(1) {
    margin-left: 20px;
  }
  .role-num:nth-child(2) {
    margin: 0 35px;
  }
  .button-perform{
    float: left;
    height: 24px;
    line-height: 24px;
    width: 75px;
    margin-top: 11px;
    margin-left: 70px;
    background: #FFFFFF;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 4px;
    text-align: center;
    font-size: 12px;
    color: #434245;
    cursor: pointer;
  }
  .content-task{
    float: left;
    width: 190px;
    font-size: 12px;
    margin-top: 11px;
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
  .import-num{
    font-size: 14px;
    color: #333333;
    margin-left: 34px !important;
    margin-right: 636px;
  }
</style>
