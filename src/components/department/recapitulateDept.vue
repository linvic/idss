<template>
  <div>
    <div class="Department">
      <div class="head_title">
        <span class="left head_title_left">部门概览</span>
      </div>
      <ul class="module">
        <li class="module_children">
          <h2 class="top_title">
            <span class="title">部门任务总数</span>
          </h2>
          <div class="bm">
            <i class="icon_branch icon_spec"></i>
            <span class="number ellipsis">{{data.totalTaskAsize}}</span>
          </div>
        </li>
        <li class="module_children">
          <h2 class="top_title">
            <span class="title">部门重点任务数</span>
          </h2>
          <div class="bm">
            <i class="icon">重</i>
            <span class="number ellipsis">{{data.impTaskAsize}}</span>
          </div>
        </li>
        <li class="module_children">
          <h2 class="top_title">
            <span class="title">重点任务占比</span>
          </h2>
          <div class="bm">
            <i class="icon_proportion icon_spec"></i>
            <span class="number ellipsis">{{data.impRate}}%</span>
          </div>
        </li>
        <li class="module_children">
          <h2 class="top_title">
            <span class="title">今日新增任务</span>
          </h2>
          <div class="bm">
            <i class="icon">今</i>
            <span class="number ellipsis">{{data.todayAddTaskSize}}</span>
          </div>
        </li>
        <li class="module_children">
          <h2 class="top_title">
            <span class="title">任务延期率</span>
          </h2>
          <div class="bm">
            <i class="icon">延</i>
            <span class="number ellipsis">{{data.delayRate}}%</span>
          </div>
        </li>
        <li class="module_children">
          <h2 class="top_title">
            <span class="title">平均任务完成时长</span>
          </h2>
          <div class="bm">
            <i class="icon_longtime icon_spec"></i>
            <span class="number ellipsis">{{data.averageTaskUseHour}}</span>
          </div>
        </li>
      </ul>
      <div class="echarts">
        <div class="echarts_day">
          <div class="days" :class="select1? 'active':''" style="margin-left: 469px" @click="selectDay1()">7天</div>
          <div class="days" :class="select2? 'active':''" style="margin-left: 5px" @click="selectDay2()">15天</div>
          <div class="days" :class="select3? 'active':''" style="margin-left: 5px" @click="selectDay3()">30天</div>
        </div>
        <div class="my_echarts">
          <IEcharts :option="line" :loading="loading" @ready="onReady" @click="onClick"></IEcharts>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import bus from '../../assets/eventBus'
  import IEcharts from 'vue-echarts-v3/src/full.js';
  import {overview,overviewEchart} from '../../service/getData'
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
        loading: false,
        dataX:[],
        select1:false,
        select2:true,
        select3:false,
        dataY1:[],
        dataY2:[],
        dataY3:[],
        line: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            },
            formatter: function(params, ticket, callback) {
              var res = params[0].name;
              for (var i = 0, l = params.length; i < l; i++) {
                if (params[i].seriesType === 'line') {
                  res += '<br/>' + params[i].seriesName + ' : ' + (params[i].value ? params[i].value : '-');
                }
              }
              return res;
            }
          },
          grid: {
            bottom:40,
            top:40,
            containLabel: false,
          },
          legend: {
            data: ['任务数量', '平均任务完成时长', '重点任务数']
          },
          xAxis: [{
            type: 'category',
            axisLine:{
              lineStyle:{
                color:'#505363',
                shadowColor:'rgba(255,136,74,0.05);'
              }
            },
            axisTick: {
              alignWithLabel: true,
              lineStyle:{
                color:'#505363',
                shadowColor:'rgba(255,136,74,0.05);'
              }
            },
            data: []
          }],
          yAxis: [{
            type: 'value',
            name: '任务数/重点任务数',
            minInterval : 1,
            min: 0,
            position: 'left',
            axisLabel: {
              formatter: '{value}'
            }
          }, {
            type: 'value',
            name: '时长',
            min: 0,
            position: 'right',
            axisLabel: {
              formatter: '{value}h'
            }
          }],
          series: [{
            name: '任务数量',
            type: 'line',
            yAxisIndex: 0,
            label: {
              normal: {
                show: false,
                position: 'top',
              }
            },
            lineStyle: {
              normal: {
                width: 3,
                shadowColor: 'rgba(0,0,0,0.4)',
                shadowBlur: 10,
                shadowOffsetY: 10
              }
            },
            data: []
          }, {
            name: '平均任务完成时长',
            type: 'line',
            yAxisIndex: 1,
            label: {
              normal: {
                show: false,
                position: 'top'
              }
            },
            data: []
          }, {
            name: '重点任务数',
            type: 'line',
            yAxisIndex: 0,
            label: {
              normal: {
                show: false,
                position: 'top'
              }
            },
            data: []
          }]
        },
        data:[]
      }
    },
    components:{
      IEcharts,
    },
    created(){
      if(this.userView=='DEPT'){
        this._overview()
        this._overviewEchart(15)
      }
    },
    mounted(){
      var self=this;
      bus.$on('task', function (msg) {
        if(msg=='SUCCESS'){
          if(self.userView=='DEPT'){
            self._overview()
            self._overviewEchart()
          }
        }
      })
    },
    methods:{
      onReady(instance) {

      },
      onClick(event, instance, echarts) {

      },
      selectDay1(){
         this.select1=true;
         this.select2=false;
         this.select3=false;
         this._overviewEchart(7)
      },
      selectDay2(){
        this.select1=false;
        this.select2=true;
        this.select3=false;
        this._overviewEchart(15)
      },
      selectDay3(){
        this.select1=false;
        this.select2=false;
        this.select3=true;
        this._overviewEchart(30)
      },
      _overview(){
        overview().then((res) =>{
          if(res.code==ERR_OK){
            this.data=res.data;
          }else{
            this.$notify.info({
              title: '消息',
              message: res.msg,
            });
          }
        })
      },
      _overviewEchart(days){
        var param={
          days:days
        }
        this.dataX=[];
        this.dataY1=[];
        this.dataY2=[];
        this.dataY3=[];
        this.line.xAxis[0].data=[]
        this.line.series[0].data=[]
        this.line.series[1].data=[]
        this.line.series[2].data=[]
        overviewEchart(param).then((res) =>{
          if (res.code == ERR_OK) {
            for(var i=0;i<res.data.length;i++){
              // X轴数据
              this.dataX.push(res.data[i].statStamp)
              //Y轴数据任务数量
              this.dataY1.push(res.data[i].totalTaskSize)
              //Y轴平均任务完成时长
              this.dataY2.push(res.data[i].averageTaskUseHour)
              //Y轴重点任务占比
              this.dataY3.push(res.data[i].impTaskSize)
            }
            this.line.xAxis[0].data=this.dataX;
            this.line.series[0].data=this.dataY1
            this.line.series[1].data=this.dataY2
            this.line.series[2].data=this.dataY3
          }else{
            this.$notify.error({
              title: '提示',
              message: res.msg
            });

          }
        })
      }
    }

  }
</script>
<style lang="scss"  scoped>
  @import '../../style/mixin';
  .echarts_day{
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
    height: 25px;
    .days{
      float: left;
      width: 60px;
      height: 25px;
      cursor: pointer;
      line-height: 25px;
      text-align: center;
      border: 1px solid #D93538;
      border-radius: 2px;
      font-size: 12px;
      color: #D93538;
    }
    .days.active{
      background: #D93538;
      font-size: 12px;
      color: #FFFFFF;
    }
  }
  .my_echarts{
    width: 1128px;
    height: 256px;
  }
  .Department{
    height: 505px;
    background: #FFFFFF;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 6px;
    margin: 0 auto;
  .head_title{
    width: 100%;
    height: 51px;
    line-height: 51px;
    background: #EFEFEF;
    border-radius: 6px 6px 0 0;
  .head_title_left{
    font-size: 16px;
    color: #505363;
    padding-left: 15px;
  }
  }
  .module{
    height: 90px;
    width: 1128px;
    margin: 25px auto 15px auto;
  .module_children:first-child{
    margin-left: 0 !important;
  }
  .module_children{
    height: 91px;
    width: 159px;
    border: 1px solid rgba(0,0,0,0.12);
    float: left;
    margin-left: 32px;
  .top_title{
    height: 29px;
    border-bottom: 1px solid rgba(0,0,0,0.12);
    line-height: 28px;
  .title{
    font-size: 12px;
    padding-left: 9px;
    color: #505363;
  }
  }
  }
  .bm{
    width: 100%;
    height: 62px;
  .icon{
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    background: #51AEFE;
    color: #ffffff;
    font-size: 24px;
    text-align: center;
    border-radius: 20px;
    margin-left: 17px;
    float: left;
    margin-top: 11px;
  }
  .number{
    display: inline-block;
    font-size: 24px;
    width: 80px;
    color: #091F2B;
    padding-left: 10px;
    padding-top: 16px;
    float: left;
  }
  }
  }
  }
  .echarts{
    width: 1128px;
    height: 301px;
    margin: 0 auto;
    border: 1px solid rgba(0,0,0,0.12);
  }
  .icon_spec{
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    color: #ffffff;
    font-size: 24px;
    text-align: center;
    border-radius: 20px;
    margin-left: 17px;
    float: left;
    margin-top: 11px;
  }
  .icon_branch{
    background: url('../../images/icon_branch.png') center center;
  }
  .icon_proportion{
    background: url('../../images/icon_proportion.png') center center;
  }
  .icon_longtime{
    background: url('../../images/icon_longtime.png') center center;
  }
</style>