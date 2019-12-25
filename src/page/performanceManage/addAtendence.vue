<template>
  <div class="">
    <!--<tab> </tab>-->
    <div class="wrapper performanceManage">
      <div class="router-wrapper" v-if="userView=='MANAGER'">
        <router-link to="/performanceManageManger">
          <span class="child1">绩效管理</span>
        </router-link>
        /
        <router-link to="/performanceManageManger">
          <span class="child1">考勤绩效</span>
        </router-link>
        /
        <router-link to="/addAtendence">
          <span class="child2">列表</span>
        </router-link>
      </div>
      <div class="router-wrapper" v-if="userView=='DEPT'">
        <router-link to="/performanceDept">
          <span class="child1">绩效管理</span>
        </router-link>
        /
        <router-link to="/performanceDept">
          <span class="child1">考勤绩效</span>
        </router-link>
        /
        <router-link to="/addAtendence">
          <span class="child2">列表</span>
        </router-link>
      </div>
      <div class="router-wrapper" v-if="userView=='STAFF'">
        <router-link to="/performanceManage">
          <span class="child1">绩效管理</span>
        </router-link>
        /
        <router-link to="/performanceManage">
          <span class="child1">考勤绩效</span>
        </router-link>
        /
        <router-link to="/addAtendence">
          <span class="child2">列表</span>
        </router-link>
      </div>
      <div class="role-title" style='border:1px solid rgba(0,0,0,0.12);margin-top:0;border-bottom:none;'>
        <div class="role-num">
          添加考勤
        </div>
        <div class="role-num" style="margin-left: 65px">
          考勤月份：
          <el-date-picker
            v-model="monthValue5"
            :editable="false"
            type="month"
            placeholder="选择月"
            value-format="yyyy-MM" @change='changetime'
          >
          </el-date-picker>
        </div>
        <div class="" style="float:right;margin-right:101px;margin-left:31px;">
          <el-button
            size="small"
            class='complete' @click='downAttendence()'>下载考勤模板</el-button>
        </div>
        <div class="" style="float:right">
          <el-button
            size="small"
            class='complete' @click='updownAttendence()'>上传考勤记录</el-button>
            <input id="excel-upload-input" type="file" accept=".xlsx, .xls" class="c-hide" @change="handkeFileChange" style='display:none'>
        </div>
      </div>

      <div class="get-reward" style="margin-top:0px;">
        <el-table
          :data="tableDataValue"
          style="width: 100%" empty-text='暂无数据'>
          <el-table-column
            prop="deptName"
            label="部门"
          >
          </el-table-column>
          <el-table-column
            prop="userName"
            label="姓名"
          >
            <template slot-scope="props">
              <router-link :to="{path:'/userDetail',  query:{id: props.row.userId}}"  >
                <span class="department-name">{{props.row.userName}}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="lateSize"
            label="迟到"
          >
          </el-table-column>
          <el-table-column
            prop="leaveEarlySize"
            label="早退"
          >
          </el-table-column>
          <el-table-column
            prop="leaveSize"
            label="事假"
          >
          </el-table-column>
          <el-table-column
            prop="absenceSize"
            label="缺卡"
          >
          </el-table-column>
          <el-table-column
            prop="absenteeismSize"
            label="旷工"
          >
          </el-table-column>
          <el-table-column
            prop="total"
            label="合计（元）"
          >
          <template slot-scope='props'>
            <span v-if='props.row.total>0'>
              -{{props.row.total}}
            </span>
            <span v-else>{{props.row.total}}</span>
          </template>
          </el-table-column>
          <!-- <el-table-column
            prop="rpTotal"
            label="奖惩合计"
          >
          </el-table-column>
          <el-table-column
            prop="realTotal"
            label="绩效评估分"
          >
          </el-table-column> -->

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
import {baseUrl} from '../../config/env'
import axios from 'axios'
import { mapGetters} from 'vuex'
import {listTaskPerformances,uploadExcle,dealAppeal,getApplealCount,outputSalary,listSalaryList,perfmEmpStaff,perfRecordManage,perfmEmpDepart,staffList,listAllUsers,departmentList} from 'service/getData'
import {ERR_OK,finishTime,finishMass,formatDateMonth} from 'service/config'
export default{
  data(){
    return {
      options1:[],
      deptName5:'',
      total1:10,
      tableDataValue:[],
      monthValue5:new Date(),
      value1:'',
      content:'',
      value2:'',
      nowPage1:1,
      pageSize1:10,
      value3:'',
      userName:'',
      userOption:[],
      tableSalary:[],
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
  mounted(){
    this.getlistAllUsers()
    this.getlistAllUsers1()
    this._perfmHrDeptList()
  },
  computed:{
    userView() {
      return this.singer.userView
    },
    ...mapGetters([
      'singer'
    ]),
  },
  methods: {
    //考勤绩效
    _perfmHrDeptList(){
      var self=this
      if(typeof(this.monthValue5) == "undefined"){
        var time = ''
      }else{
        var time = formatDateMonth(this.monthValue5)
      }
      var param={
        nowPage:this.nowPage1,
        pageShow:this.pageSize1,
        hrDateStr:time
      }
      perfmEmpStaff(param).then(function (res) {
        if (res.code == ERR_OK) {
          self.tableDataValue=res.data.result;
          self.total1=res.data.totalCount
        }
      })
    },
    downAttendence(){
      window.location.href = baseUrl+'perfmEmp/downloadPerfmHr?token='+localStorage.getItem('token')
    },
    updownAttendence(){
     document.getElementById('excel-upload-input').click()
    },
    // 上传excle
    handkeFileChange(e){
      var files = e.target.files
      console.log(files)
      const itemFile = files[0]
      if(typeof(this.monthValue5) == "undefined"){
        var time = ''
      }else{
        var time = formatDateMonth(this.monthValue5)
      }
      const formdata = new FormData()
      formdata.append('file',itemFile)
      formdata.append('uploadMonth',time)
      axios({
        url:baseUrl+'perfmEmp/uploadPerfmWithExcel?token='+localStorage.getItem('token'),
        method:'post',
        data:formdata,
        headers: {'Content-Type': 'multipart/form-data'}
      }).then((res)=>{
        document.getElementById('excel-upload-input').value = ''
        if(res.data.code == ERR_OK){
          this.$notify({
            title: '成功',
            message: '上传考勤记录成功',
            type: 'success'
          });
          this._perfmHrDeptList()
        }else{
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          });
        }

      })

    },
    changetime(val){
      this._perfmHrDeptList()
    },
    handleSizeChange1(val) {
      this.pageSize1 = val
      this._perfmHrDeptList()
    },
    handleCurrentChange1(val) {
      this.nowPage1 = val
      this._perfmHrDeptList()
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

        }
     })

    },
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
  .department-name{
    color: #DA3438;
    cursor: pointer;
  }
</style>
