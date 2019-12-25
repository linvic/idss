<template>
  <div class="dailyManage">
     <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <router-link to="/dailyManage">
          <span class="child1">日报管理</span>
        </router-link>  /
        <span class="child2">日报列表</span>
      </div>
      <div class="role-title">
        <div class="role-num">
          日报列表
        </div>
        <div v-cloak class="daily_depart" v-if="userView=='MANAGER'|| userView=='DEPT'">
          姓名：
          <el-select v-model="userId" placeholder="请选择姓名" class="">
            <el-option v-for="item in options" :key="item.userId" :label="item.userName" :value="item.userId">
            </el-option>
          </el-select>
        </div>
        <div v-cloak class="daily_user" v-if="userView=='MANAGER'">
          部门：
          <el-select v-model="value2" placeholder="请选择" class="firstDept" @change='changeDepart'>
            <el-option v-for="item in options2" :key="item.deptId" :label="item.deptName" :value="item.deptId">
            </el-option>
          </el-select>
          <el-select v-model="value3" placeholder="请选择" class="firstDept" @change='changeDepart2'>
            <el-option v-for="item in options3" :key="item.deptId" :label="item.deptName" :value="item.deptId">
            </el-option>
          </el-select>
        </div>
        <div v-cloak class="daily_user" v-if="userView=='DEPT'">
          部门：
          <el-select v-model="value4" placeholder="请选择" class="firstDept" @change='changeDepart3'>
            <el-option v-for="item in options4" :key="item.deptId" :label="item.deptName" :value="item.deptId">
            </el-option>
          </el-select>
        </div>
        <div class="dataTime">
          <span class="date">日期：</span>
               <span>
                 <el-date-picker
                   v-model="value1"
                   type="date"
                   placeholder="选择日期"
                 >
                 </el-date-picker>
               </span>
        </div>
        <div class="search" @click="searchList()">
          <span>搜索</span>
        </div>
        <router-link to="/initiateNew" v-cloak v-if="userView!='MANAGER'">
          <div class="role-button">
            发起日报
          </div>
        </router-link>
      </div>
      <div class="table-content">
        <el-table
          :data="result">
          <el-table-column
            prop="dailyDay"
            label="日期"
          >
          </el-table-column>
          <el-table-column
            prop="deptName"
            label="部门"
            v-if="userView=='MANAGER'|| userView=='DEPT'"
          >
          </el-table-column>
          <el-table-column
            prop="userName"
            label="姓名"
            v-if="userView=='MANAGER'|| userView=='DEPT'"
          >
          </el-table-column>
          <el-table-column
            prop="completedCount"
            label="完成任务数">
          </el-table-column>
          <el-table-column
            prop="uncompletedCount"
            width="350"
            label="未完成任务数">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="props">
              <router-link :to="{ path: 'dailyDetail',query: {id:props.row.dailyId}}">
                <el-button
                  size="small"
                >查看</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-depart" v-cloak v-if="result.length">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="nowPage"
                       :page-sizes="[10, 15, 50]" :page-size="pageShow"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
//  import Tab from 'components/common/tab'
  import {getDailyList,departmentList,listUserDynamic,listChildrenDepts} from 'service/getData'
  import {ERR_OK,formatDateTime } from 'service/config'
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
        value1:"",
        nowPage:1,
        pageShow:10,
        total:"",
        userId:"",
        value2: '',
        value3:"",
        value4:"",
        result:[],
        options:[],
        options2:[],
        options3:[],
        options4:[],

      };
    },
    mounted(){
      this._getDailyList()
      if(localStorage.getItem("userView")=="DEPT"){
        this._listChildrenDepts2(localStorage.getItem("deptId"))
        this.changeDepart3()
      }
      if(localStorage.getItem("userView")=="MANAGER"){
        this.getDepartmentList()
        this._listUserDynamic()
      }
    },
    components: {
//      Tab
    },
    methods: {
//      改变一页显示得条数
      handleSizeChange(val){
        this.pageShow=val;
        this._getDailyList()
//        console.log(this.userView);
      },
//      改变页码
      handleCurrentChange(val){
        this.nowPage=val
        this._getDailyList()
      },
//      搜索
      searchList(){
          this._getDailyList()
      },
      //      部门
      changeDepart(val) {
        this.deptId = val;
        this.userId=""
        this._listChildrenDepts(val)
        this._listUserDynamic()
      },
//      二级部门
      changeDepart2(val){
        this.deptId = val;
        this.userId=""
        this._listUserDynamic()
      },
//      获取部门接口
      getDepartmentList() {
        let self = this
        departmentList().then((res) => {
          if (res.code == ERR_OK) {
            let data = res.data
            self.options2 =data.result
            self.options2.unshift({
              deptId:"",
              deptName: '请选择'
            })
          }
        })
      },
//      二级部门
      _listChildrenDepts(deptId){
        this.value3=""
        this.options3=[]
        this.options3.unshift({
          deptId:"",
          deptName: '请选择'
        })
         let param={
           deptId:deptId
         }
         listChildrenDepts(param).then((res)=>{
           if (res.code == ERR_OK) {
             this.options3 =res.data
             this.options3.unshift({
               deptId:"",
               deptName: '请选择'
             })
           }else{
             self.$notify.error({
               title: '错误',
               message: res.msg,
             });
           }
         })
      },
      changeDepart3(){
        let param;
        let self=this;
        self.options=[]
        self.options.unshift({
          userId:"",
          userName: '请选择姓名'
        });
        if(this.value4!=""){
           param={
            deptId:localStorage.getItem("deptId")+","+this.value4
          }
        }
        listUserDynamic(param).then(function (res) {
          if (res.code == ERR_OK) {
            self.options=res.data;
            self.options.unshift({
              userId:"",
              userName: '请选择姓名'
            })
          }
        })
      },
//      部门负责人请求的接口
      _listChildrenDepts2(deptId){
        this.value4=""
        this.options4=[]
        this.options4.unshift({
          deptId:"",
          deptName: '请选择'
        })
        let param={
          deptId:deptId
        }
        listChildrenDepts(param).then((res)=>{
          if (res.code == ERR_OK) {
            this.options4 =res.data
            this.options4.unshift({
              deptId:"",
              deptName: '请选择'
            })
          }else{
            self.$notify.error({
              title: '错误',
              message: res.msg,
            });
          }
        })
      },
//      获取姓名
      _listUserDynamic(){
        let self=this;
        let param;
        if(this.value2!="" && this.value3==""){
          param={
            deptId:this.value2
          }
        }
        if(this.value2!="" && this.value3!=""){
          param={
            deptId:this.value2+","+this.value3
          }
        }
        listUserDynamic(param).then(function (res) {
          if (res.code == ERR_OK) {
            self.options=res.data;
            self.options.unshift({
              userId:"",
              userName: '请选择姓名'
            })
          }
        })
      },
      _getDailyList(){
        let self=this;
        let param;
        let commonParams={
          nowPage:this.nowPage,
          pageShow:this.pageShow,
        }
        if(this.value1!=""){
          param= {dailyDay:formatDateTime(this.value1)};
        }
        if(this.userId!=""){
          param= {dailyUserId:this.userId};
        }
        if(this.value2!=""){
          param= {deptId:this.value2};
        }
        if(this.value3!=""){
          param= {deptId:this.value3};
        }
        if(this.value1!="" && this.userId!=""){
          param= {
            dailyDay:formatDateTime(this.value1),
            dailyUserId:this.userId
          };
        }
        if(this.userView=="MANAGER"){
          if(this.value1!="" && this.value2!="" && this.value3==""){
            param= {
              dailyDay:formatDateTime(this.value1),
              deptId:this.value2
            };
          }
          if(this.userId!="" && this.value2!="" && this.value3==""){
            param= {
              dailyUserId:this.userId,
              deptId:this.value2
            };
          }
          if(this.userId!="" && this.value2!="" && this.value1!="" && this.value3==""){
            param= {
              dailyDay:formatDateTime(this.value1),
              dailyUserId:this.userId,
              deptId:this.value2
            };
          }
          if(this.userId!="" && this.value2!="" && this.value3!=""){
            param= {
              dailyUserId:this.userId,
              deptId:this.value3
            };
          }
          if(this.userId!="" && this.value2!="" && this.value1!="" && this.value3!=""){
            param= {
              dailyDay:formatDateTime(this.value1),
              dailyUserId:this.userId,
              deptId:this.value3
            };
          }
        }
        if(this.userView=="DEPT"){
            if(this.value4!=""){
              param= {
                deptId:this.value4
              };
            }
          if(this.value1!=""&&this.value4!=""){
            param= {
              deptId:this.value4,
              dailyDay:formatDateTime(this.value1),
            };
          }
          if(this.userId!="" && this.value4!=""){
            param= {
              deptId:this.value4,
              dailyUserId:this.userId,
            };
          }
          if(this.value1!="" && this.userId!="" && this.value4!=""){
            param= {
              deptId:this.value4,
              dailyDay:formatDateTime(this.value1),
              dailyUserId:this.userId,
            };
          }
        }
        const obj=Object.assign({}, commonParams,param)
        getDailyList(obj).then(function (res) {
          if (res.code == ERR_OK) {
            self.result = res.data.result;
            self.total=res.data.totalCount
          }else{
            self.$notify.error({
              title: '错误',
              message: res.msg,
            });
          }
        })
      }

    }
  };
</script>
<style lang="scss"  scoped>
  .role-title{
    margin: 0 auto;
    height: 46px;
    line-height: 46px;
    background: rgba(217,52,55,0.20);
    position: relative;
  }
  .role-num{
    float: left;
    font-size: 14px;
    color: #333333;
  }

  .role-num:nth-child(1){
    margin-left:20px;
  }
  .role-num:nth-child(2){
    margin: 0 35px;
  }
  .role-button{
    position: absolute;
    right: 50px;
    top:8px;
    width: 84px;
    height: 30px;
    line-height: 30px;
    background: #D93538;
    border-radius: 4px;
    font-size: 14px;
    color: #FFFFFF;
    text-align: center;
    cursor: pointer;
  }
  .table-content{
    margin-top: 25px;
  }
  .dialog-footer button{
    border: 1px solid #838383;
    border-radius: 4px;
    width: 90px;
    height: 30px;
    text-align: center;
    background: #fff;
    color: #838383;
    cursor: pointer;
    margin-right: 20px;
  }
  .dialog-footer button:last-child{
    color: #D93437;
    border: 1px solid #D83436;
  }
  .daily_depart{
   position: absolute;
    right: 450px;
    font-size: 14px;
    color: #333333;
  }
  .daily_user{
    position: absolute;
    right: 700px;
    font-size: 14px;
    color: #333333;
  }
  .dataTime{
   position: absolute;
    right: 270px;
  }
  .search{
    width: 75px;
    height: 24px;
    line-height: 24px;
    position: absolute;
    top: 11px;
    right: 157px;
    font-size: 12px;
    color: #434245;
    background: #FFFFFF;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
  }
  .date{
    font-size: 14px;
    color: #333333;
  }
  .firstDept{
    width: 150px;
  }
</style>
