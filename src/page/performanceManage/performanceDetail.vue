<template>
  <div class="">
    <!--<tab> </tab>-->
    <div class="wrapper performanceManage">
      <div class="router-wrapper">
        <router-link to="/performanceManageManger">
          <span class="child1">绩效管理</span>
        </router-link>
        /
        <!-- <router-link to="/performanceDetail"> -->
          <span class="child2">列表</span>
        <!-- </router-link> -->
      </div>
      <div class="role-title" style='border-bottom:none;margin-top:0;'>
        <div class="role-num" style="margin-left: 25px">
          发布人部门：
          <el-select v-model="deptName5" placeholder="全部" class="role-button">
            <el-option v-for="item in options1" :key="item.deptId" :label="item.deptName" :value="item.deptId">
            </el-option>
          </el-select>
        </div>
        <div class="role-num" style="margin-left: 30px">
          时间：
          <el-date-picker
            v-model="monthValue5"
            :editable="false"
            type="month"
            placeholder="选择月"
            value-format="yyyy-MM"
          >
          </el-date-picker>
        </div>
        <div class="role-num" style="margin-left: -5px">
          完成效率：
          <el-select v-model="value1" placeholder="全部" class="role-button">
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="role-num" style="margin-left: 30px">
          完成质量：
          <el-select v-model="value2" placeholder="全部" class="role-button">
            <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!-- <div class="button-perform attendance_search"  style="margin-left:20px;">
          搜索
        </div> -->
      </div>
      <div class="role-title" style='border-bottom:none;margin-top:0;border-top:1px solid rgba(0,0,0,0.12);'>
        <div class="role-num" style="margin-left: 53px">
          发布人：
          <el-select v-model="userName" placeholder="全部" class="role-button">
            <el-option v-for="item in userOption" :key="item.userId" :label="item.userName" :value="item.userId">
            </el-option>
          </el-select>
        </div>
        <div class="role-num" style="margin-left: 30px">
          <span style="float:left;">任务标题：</span>
          <el-input v-model="content" placeholder="请输入任务标题" class='content-task'></el-input>
        </div>
        <div class="button-perform attendance_search"  style="margin-left:20px;" @click='searchName'>
          搜索
        </div>
      </div>
      <div class="get-reward" style="margin-top:14px;">
        <el-table
          :data="result"
          style="width: 100%" empty-text='暂无数据'>
          <el-table-column
            prop="publisherName"
            label="发布人"
          >
          </el-table-column>
          <el-table-column
            prop="deptName"
            label="发布人部门"
          >
          </el-table-column>
          <el-table-column
            prop="performanceTime"
            label="任务完成时间"
          >
          </el-table-column>
          <el-table-column
            prop="title"
            label="任务标题"
          >
          </el-table-column>
          <el-table-column
            prop="completeStatusStr"
              width='100px'
            label="完成效率"
          >
          </el-table-column>
          <el-table-column
            prop="finishQualityStr"
            width='100px'
            label="完成质量"
          >
          </el-table-column>
          <el-table-column
            prop="performanceScore"
            label="任务绩效分"
            :render-header="renderTableHeader"
          >
          </el-table-column>

          <el-table-column
            prop="evaluatingScore"
            label="绩效评估分"
            :render-header="renderTableHeader"
          >
          </el-table-column>
          <el-table-column
            prop="taskScore"
            label="该任务的分值"
          >
          </el-table-column>
          <el-table-column
            prop="evaluatingScore"
            width='140'
            label="操作"
          >
          <template slot-scope='props'>
            <router-link :to="{path:'/taskDetailManage',query: {id: props.row.taskId}}">
              <el-button
                size="small"
              >查看任务详情</el-button>
            </router-link>
          </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-depart"  v-if="total1>0">
        <el-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="nowPage1"
          :page-sizes="[10, 15, 50]"
          :page-size=pageSize1
          layout="total, sizes, prev, pager, next, jumper"
          :total=total1>
        </el-pagination>
      </div>
    </div>

  </div>

</template>
<script type="text/ecmascript-6">
//import Tab from 'components/common/tab'
import {listTaskPerformances,listStaffPerformances,dealAppeal,getApplealCount,outputSalary,listSalaryList,perfmEmpStaff,perfRecordManage,perfmEmpDepart,staffList,listAllUsers,departmentList} from 'service/getData'
import {ERR_OK,finishTime,finishMass,formatDateMonth} from 'service/config'
export default{
  data(){
    return {
      options1:[],
      deptName5:'',
      total1:10,
      monthValue5:new Date(),
      value1:'',
      content:'',
      value2:'',
      nowPage1:1,
      pageSize1:10,
      value3:'',
      id:'',
      userName:'',
      userOption:[],
      tableSalary:[],
      result:[],
      options2:[
        {
          value: '',
          label: '全部'
        },
        {
          value: 'AHEAD',
          label: '提前'
        },
        {
          value: 'ONTIME',
          label: '按时'
        },
        {
          value: 'OVERDUE',
          label: '逾期'
        }
      ],
      options3:[
        {
          value: '',
          label: '全部'
        },
        {
          value: 'EXCELLENT',
          label: '优'
        },
        {
          value: 'GOOD',
          label: '良'
        },
        {
          value: 'SECONDARY',
          label: '中'
        },
        {
          value: 'DIFFERENCE',
          label: '差'
        },
        {
          value: 'POOR',
          label: '很差'
        }
      ]

    }
  },
  components: {
//    Tab
  },
  created () {
    this.id =this.$route.query.id
  },
  mounted(){
    this.getlistAllUsers()
    this.getlistAllUsers1()
    this.getData()
  },
  methods: {
    searchName(){
      this.getData()
    },
    // 初始化数据
    getData(){
      if(typeof(this.monthValue5) == "undefined" || this.monthValue5 == ""){
        var time = ''
      }else{
        var time = formatDateMonth(this.monthValue5)
      }
      const params = {
        userId:this.id,
        deptId:this.deptName5,
        taskDateTime:time,
        completeStatus:this.value1,
        finishQuality:this.value2,
        createBy:this.userName,
        title:this.content
      }
      listStaffPerformances(params).then((res) => {
        if(res.code == ERR_OK) {
          this.result = res.data.result
          this.total1 = res.data.totalCount
        }else{
          this.$notify.error({
            title: '错误',
            message:res.msg
          });
        }
     })
    },
    handleSizeChange1(val) {
      this.pageSize1 = val
      this.getData()
    },
    handleCurrentChange1(val) {
      this.nowPage1 = val
      this.getData()
    },
    getlistAllUsers1 () {
      let self = this
      listAllUsers().then((res) => {
        if(res.code == ERR_OK) {
          self.userOption = res.data
          self.userOption.unshift({
           userId:'',
           userName: '全部'
         })
        }
     })
    },
    getlistAllUsers () {
      let self = this
      departmentList().then((res) => {
        if(res.code == ERR_OK) {
          let data = res
          self.options1 = res.data.result
          self.options1.unshift({
           deptId:'',
           deptName: '全部'
         })

        }else{
          this.$notify.error({
            title: '错误',
            message: res.msg
          });
        }
     })

    },
    renderTableHeader (h, { column, $index }) {
      return h('div', {}, [
        
          h('span', {}, [
            column.label,
            h('el-tooltip',{
              props: {
                placement: 'top',
                content: (function() {
                  let label = column.label;
                  switch (label) {
                    case '任务绩效分':
                      return '任务绩效分 = 任务类型分值 * 重要等级系数 * 任务完成时间系数 * 任务完成质量系数';
                      break;
                    case '绩效评估分':
                      return '绩效评估分 = 任务完成时间系数 * 任务完成质量系数';
                      break;
                    default:
                      return '666';
                      break;
                  }
                })()
              }
            },[
              h('i', {
                class:'el-icon-information',
                style:'margin-left:5px;color:#999999;'
              })
            ])
          ])
      ])
    }
  },
}
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
    border-bottom: none;
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
    opacity: 0.99;
    // border: 1px solid rgba(0,0,0,0.12);
    background: rgba(217,52,55,0.10);
  }
  .role-num {
    float: left;
    font-size: 14px;
    color: #333333;
  }
  .role-time{
    margin-left:674px !important;
  }
  .role-list{
    margin-left:879px !important;
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
  .attendance_search{
    float: left;
    margin-left: 35px;
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
  .reward-button{
    float: left;
    margin-left: 20px;
    border: 1px solid #D83436;
    border-radius: 4px;
    width: 80px;
    margin-top: 11px;
    text-align: center;
    font-size: 14px;
    color: #D93538;
    height: 24px;
    line-height: 24px;
    cursor: pointer;
  }
  .attendance{
    float: left;
    span{
      padding-left: 20px;
    }
  }
</style>
