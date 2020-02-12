<template>
  <div>
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">

          <span class="child1">提醒管理</span>

        /
        <router-link to="/remindManage">
          <span class="child2">提醒列表</span>
        </router-link>
      </div>
      <div class="uncomplete-task" v-bind:class="{ 'class-a': isA}" style='border:none'>
        <div class="user-title">
          <div class="title-nameN" @click='unsee'>
            未查看
          </div>
          <div class="title-nameN1" @click='seen' style="margin-left:47px;">
            已查看
          </div>
        </div>
        <div class="get-reward">
          <el-table
            :data="result"
            style="width: 100%" empty-text='暂无数据'>
            <el-table-column
              label="提醒标题"
              class="title"
            >
              <template slot-scope="props">
                <div @click="messageSkip(props.row)" style="cursor: pointer">
                  {{props.row.messageTitle}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="messageTime"
              label="时间"
            >
            </el-table-column>
            <el-table-column prop="sourceTypeName" label="类型" ></el-table-column>

          </el-table>
        </div>
        <div class="pagination-depart" v-show='pagination'>
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 15, 50]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=total>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
  import {totalNews,viewMessage} from 'service/getData'
//  import Tab from 'components/common/tab'
  import { ERR_OK } from 'service/config'
  import { mapGetters} from 'vuex'
  import bus from '../../assets/eventBus'
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
        isActive:true,
        isActive1:false,
        activeName:false,
        hello:false,
        pagination:true,
        currentPage4:1,
        total:100,
        pageSize:10,
        nowPage:1,
        isA:false,
        result:[],
      };
    },
    components: {
//      Tab
    },
    mounted(){
      this.getInitData(false,1,10)
    },
    methods: {
      getInitData(viewed,nowPage,pageShow){
        const params={
          viewed:viewed,
          nowPage:nowPage,
          pageShow:pageShow
        }
        totalNews(params).then((res) => {
          if (res.code == ERR_OK) {
            this.result = res.data.result
            this.total = res.data.totalCount
            if(res.data.result.length == 0){
              this.pagination = false
            }else{
              this.pagination = true
            }
          }
        })
      },
      messageSkip(row){
        viewMessage({
          id: row.messageSiteInfoId
        }).then((res) =>{
          if(res.code==ERR_OK){
            this.reload()
            console.log(this.userView);
            if(row.sourceType=='TASK'){
              
                this.$router.push({
                  path:'/taskManage/taskDetail',
                  query:{id:row.sourceId}
                })
            }
            if(row.sourceType=='NOTICE'){
              this.$router.push({
                path:'/setCenter/noticeDetail',
                query:{id:row.sourceId}
              })
            }
            if(row.sourceType=='SUMMARY'){
              let _message = JSON.parse(row.messageContent);
              this.$router.push({
                  path: "/planSummaryManage/summaryDetail",
                  query: {
                      id: row.sourceId,
                      type: _message.summaryType
                  }
              })
            }
            if(row.sourceType=='PLAN'){
              let _message = JSON.parse(row.messageContent);
              this.$router.push({
                  path: "/planSummaryManage/planDetail",
                  query: {
                      id: row.sourceId,
                      type: _message.planType
                  }
              })
            }
            if(row.sourceType=='MERITS'){
              let _message = JSON.parse(row.messageContent);
              if (_message.msgType == 'confirmAttendance') {
                // 待核对考勤
                this.$router.push({
                    path: "/performanceManage/attendanceDetail",
                    query: {
                        id: row.sourceId
                    }
                })
              } else if (_message.msgType == 'appealAttendance') {
                // 考勤申诉待处理
                this.$router.push({
                    path: "/performanceManage/attendanceDetail",
                    query: {
                        id: row.sourceId
                    }
                })
              } else if (_message.msgType == 'sendSalary') {
                // 工资条发送提醒
                this.$router.push({
                    path: "/performanceManage/paySlipManage"
                })
                
              }
            }
            
            
          }else{
            this.$notify.error({
              title: '提示',
              message:res.msg
            });
          }
        })
      },
      unsee () {
        this.isA = false
        this.getInitData(false,this.nowPage,this.pageSize)
      },
      handleSizeChange(val) {
        this.pageSize = val
        if(this.isA == true){
          this.getInitData(true,this.nowPage,this.pageSize)
        }else{
          this.getInitData(false,this.nowPage,this.pageSize)
        }
      },
      handleCurrentChange(val) {
        this.nowPage = val
        if(this.isA == true){
          this.getInitData(true,this.nowPage,this.pageSize)
        }else{
          this.getInitData(false,this.nowPage,this.pageSize)
        }
      },
      reload(){
        bus.$emit('tabChange','SUCCESS')
      },
      seen () {
        this.isA = true
        this.getInitData(true,this.nowPage,this.pageSize)
      }
    }
  };
</script>
<style type="text/ecmascript-6">
  

  .uncomplete-task{
    /*border: 1px solid rgba(0,0,0,0.12);*/
    overflow: hidden;
    margin: 0px auto;
    margin-bottom: 30px;
    border: none;

  }
  .user-title{
    opacity: 0.99;
    background: rgba(217,52,55,0.10);
    height: 46px;
    line-height: 46px;
    width: 100%;
    font-size: 14px;
    border: 1px solid rgba(0,0,0,0.12);
    border-bottom: none;
  }
  .title-nameN{
    float: left;
    width:84px;
    color: #D93538;
    text-align: center;
    box-sizing: border-box;
    height:46px;
    cursor: pointer;
    border-bottom:2px solid #D93538;
  }
  .title-nameN1{
    float: left;
    width:84px;
    height:46px;
    cursor: pointer;
    box-sizing: border-box;
    color: #333333;
    text-align: center;
    margin-left: 48px;
  }
  .class-a .title-nameN{
    color: #333333;
    border-bottom:none;
    text-align: center;
  }
  .class-a .title-nameN1{
    color: #D93538;
    border-bottom:2px solid #D93538;
  }
.seename{
  background: transparent;
  border: none;
  cursor: pointer;
  color: #D93437;
}
</style>
