<template>
<div>
    <!--<tab></tab>-->
    <div class="wrapper performanceManage">
      <div class="router-wrapper">
        <router-link to="/performanceDept" v-if="userView=='DEPT'">
          <span class="child1">绩效管理</span>
        </router-link>
        <router-link to="/performanceManage" v-if="userView=='STAFF'">
          <span class="child1">绩效管理</span>
        </router-link>
        <router-link to="/performanceManageManger" v-if="userView=='MANAGER'">
          <span class="child1">绩效管理</span>
        </router-link>
        /
        <router-link to="/performanceDept" v-if="userView=='DEPT'">
          <span class="child1">奖惩记录</span>
        </router-link>
        <router-link to="/performanceManage" v-if="userView=='STAFF'">
          <span class="child1">奖惩记录</span>
        </router-link>
        <router-link to="/performanceManageManger" v-if="userView=='MANAGER'">
          <span class="child1">奖惩记录</span>
        </router-link>
        /
        <router-link to="/RedHeiBang">
          <span class="child2">红黑榜</span>
        </router-link>
      </div>
        <div class="title-header">
          <div class="yearList">
            <span class="year">年榜：</span>
            <el-date-picker
              v-model="value5"
              type="year"
              :editable="false"
              @change="getBang"
              placeholder="选择年">
            </el-date-picker>
          </div>
          <div class="monthList">
            <span class="month">月榜：</span>
            <el-select v-model="value2" placeholder="请选择" @change="getBang">
              <el-option
                v-for="item in month"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="redBang">
          <div class="redBang_title">
            <span class="red_text">红榜</span>
          </div>
          <div class="get-reward">
            <el-table
              :data="resultRed"
              style="width: 100%" empty-text='暂无数据'>
              <el-table-column
                width="100"
                label="排名"
                type="index"
              >
              </el-table-column>
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
                prop="rewardSize"
                label="奖励次数"
              >
              </el-table-column>
              <el-table-column
                label="奖励合计"
              >
                <template slot-scope="props">
                  <span style="color: #D93538" v-if="props.row.rewardAmount==0">{{props.row.rewardAmount}}</span>
                  <span style="color: #D93538" v-else>+{{props.row.rewardAmount}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="punishSize"
                label="惩罚次数"
              >
              </el-table-column>
              <el-table-column
                label="惩罚合计"
              >
                <template slot-scope="props">
                  <span style="color:#018050">{{props.row.punishAmount}}</span>
                </template>
              </el-table-column>
              </el-table-column>
              <el-table-column
                label="奖惩合计"
              >
                <template slot-scope="props">
                  <span style="color: #D93538">+{{props.row.rpAmount}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      <div class="redBang">
        <div class="redBang_title">
          <span class="red_text">黑榜</span>
        </div>
        <div class="get-reward">
          <el-table
            :data="resultBlack"
            style="width: 100%" empty-text='暂无数据'>
            <el-table-column
              width="100"
              label="排名"
              type="index"
            >
            </el-table-column>
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
              prop="rewardSize"
              label="奖励次数"
            >
            </el-table-column>
            <el-table-column
              label="奖励合计"
            >
              <template slot-scope="props">
                <span style="color: #D93538">{{props.row.rewardAmount}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="punishSize"
              label="惩罚次数"
            >
            </el-table-column>
            <el-table-column
              label="惩罚合计"
            >
              <template slot-scope="props">
                <span style="color:#018050">{{props.row.punishAmount}}</span>
              </template>
            </el-table-column>
            </el-table-column>
            <el-table-column
              label="奖惩合计"
            >
              <template slot-scope="props">
                <span style="color: #018050">{{props.row.rpAmount}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="redBang">
        <div class="redBang_title">
          <span class="red_text">最新奖惩记录</span>
        </div>
        <div class="get-reward">
          <el-table
            :data="rpRecordList"
            style="width: 100%" empty-text='暂无数据'>
            <el-table-column
              width="100"
              label="排名"
              type="index"
            >
            </el-table-column>
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
              prop="rpTime"
              label="奖励时间"
            >
            </el-table-column>
            <el-table-column
              label="奖惩金额"
            >
              <template slot-scope="props">
                <span style="color: #D93538" v-if="props.row.rpType=='REWARD'">+{{props.row.rpAmount}}</span>
                <span style="color:#018050" v-if="props.row.rpType=='PUNISH'">{{props.row.rpAmount}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="惩罚原因"
              width="500"
            >
              <template slot-scope="props">
                <span>{{props.row.rpReason}}</span>
              </template>
            </el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
</div>
</template>
<script type="text/ecmascript-6">
//  import Tab from 'components/common/tab'
  import {ERR_OK,month} from 'service/config'
  import { mapGetters} from 'vuex'
  import {perfmRpRank} from 'service/getData'
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
        value5:new Date(),
        month:month,
        value2: 0,
        resultRed:[],
        resultBlack:[],
        rpRecordList:[]
      }
    },
    components: {
//      Tab
    },
    created(){
        this._perfmRpRank()
    },
    methods:{
      getBang(){
        this._perfmRpRank()
      },
//红黑榜列表
      _perfmRpRank(){
        var param={
          year:this.value5.getFullYear(),
          month:this.value2
        }
        perfmRpRank(param).then((res) => {
          if (res.code == ERR_OK) {
              this.resultRed=res.data.goodRankList;
              this.resultBlack=res.data.badRanklist
              this.rpRecordList=res.data.rpRecordList
          }else{
            this.$notify.error({
              title: '错误',
              message: res.msg
            });
          }
        })
      }
    }
      }
</script>
<style lang="scss"  scoped>
  .title-header{
    height: 46px;
    opacity: 0.99;
    margin-top: 5px;
    background: rgba(217,52,55,0.10);
  }
  .yearList{
    float: left;
  }
  .year{
    display: inline-block;
    font-size: 14px;
    padding-left: 20px;
    height: 46px;
    line-height: 46px;
    color: #333333;
  }
  .month{
    display: inline-block;
    font-size: 14px;
    padding-left: 20px;
    height: 46px;
    line-height: 46px;
    color: #333333;
  }
  .monthList{
    float: left;
  }
  .redBang{
    margin-top: 15px;
  }
  .redBang_title{
    opacity: 0.99;
    background: rgba(217,52,55,0.02);
    height: 46px;
    border-top:1px solid rgba(0,0,0,0.12);
    border-left:1px solid rgba(0,0,0,0.12);
    border-right:1px solid rgba(0,0,0,0.12);
  }
  .red_text{
    display:inline-block;
    height: 46px;
    line-height: 46px;
    padding-left: 20px;
    font-size: 14px;
    color: #434343;
  }
  .department-name{
    color: #DA3438;
    cursor: pointer;
  }
</style>
