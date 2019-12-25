<template>
  <div>
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <router-link to="/setCenter">
          <span class="child1">系统设置</span>
        </router-link>
        /
        <router-link to="/teamManage">
          <span class="child1">团队管理</span>
        </router-link>
        /
        <router-link to="/teamDetail">
          <span class="child2">团队详情</span>
        </router-link>
      </div>
      <div class="role-title">
        <div class="role-num">
          角色：<el-select v-model="roleId" placeholder="请选择角色" class="role-button" @change="roleSelect">
           <el-option
             v-for="item in roleArr"
             :key="item.roleId"
             :label="item.roleName"
             :value="item.roleId">
           </el-option>
         </el-select>
        </div>
        <div class="role-num" style="margin-right:10px !important;">
          部门：<el-select v-model="deptMent" placeholder="一级部门" class="role-button" @change="teamSelect">
           <el-option
             v-for="item in list"
             :key="item.deptId"
             :label="item.deptName"
             :value="item.deptId">
           </el-option>
         </el-select>
        </div>
        <div class="role-num" style="margin-right:35px;">
          <el-select v-model="deptMent2" placeholder="二级部门" class="role-button" @change="teamSelect2">
           <el-option
             v-for="item in list2"
             :key="item.deptId"
             :label="item.deptName"
             :value="item.deptId">
           </el-option>
         </el-select>
        </div>
        <div class="role-num">
          状态：<el-select v-model="state" placeholder="请选择状态" class="role-button" @change="stateSelect">
           <el-option
             v-for="item in enable"
             :key="item.value"
             :label="item.label"
             :value="item.value"
           >
           </el-option>
         </el-select>
        </div>
        <div class="role-button1" @click="showModel">
          添加团队成员
        </div>
      </div>
      <div class="table-content">
        <el-table
         :data="tableData"
         style="width: 100%">
         <el-table-column
           prop="userName"
           label="姓名">
           <template slot-scope="props">
             <router-link :to="{path:'/userDetail',  query:{id: props.row.userId}}"  >
               <span class="department-name">{{props.row.userName}}</span>
             </router-link>
           </template>
         </el-table-column>
         <el-table-column
           prop="roleName"
           label="角色">
         </el-table-column>
         <el-table-column
           prop="deptName"
           label="部门">
         </el-table-column>
         <el-table-column
           prop="telephone"
           label="电话">
         </el-table-column>
         <el-table-column
           prop="email"
           label="邮箱">
         </el-table-column>
         <el-table-column
           prop="enabled"
           label="用户状态">
           <template slot-scope="props">
               <span class="">{{props.row.enabled?"启用":"禁用"}}</span>
           </template>
         </el-table-column>
         <el-table-column label="操作">
          <template slot-slot-scope="props">
            <el-button
              size="small"
               @click="removeTeam(props.row.userId,props.row.teamId)" v-if='props.row.userId==0' :disabled="true" class='disable-button'>移除团队</el-button>
               <el-button
                 size="small"
                  @click="removeTeam(props.row.userId,props.row.teamId)" v-else >移除团队</el-button>
          </template>
        </el-table-column>
       </el-table>
       <div class="pagination-depart" v-if="tableData.length>0">
         <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="nowPage" :page-sizes="[10, 15, 50]" :page-size="pageShow"
       layout="total, sizes, prev, pager, next, jumper" :total="total">
         </el-pagination>
       </div>
      </div>
    </div>
    <el-dialog
      title="添加团队成员"
      :visible.sync="dialogVisible"
      size="tiny"
      :before-close="handleClose1" top='25%' class="teamDetail">
      <div>
        <h2>选择人员：</h2>
        <div class="content">
          <div class="check_content" v-for="(item,j) in data">
            <h3 class="title">
               <label class="ant-checkbox-wrapper">
                  <input type='checkbox' class='item-check-btn' v-model="item.checked" @click="selectAll(item,j)">
                  <span class="dept">{{item.deptName}}</span>
              </label>
            </h3>
            <ul class="menu">
              <li v-for="(s,index) in item.deptUsers" class="menu_children">
                <label class="ant-checkbox-wrapper">
                    <input type='checkbox' :value="index" v-model="s.checked" class='item-check-btn' @click="selectItem(item,s,index,j)">
                    <span class="dept">{{s.userName}}</span>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
      </el-form>
          <span slot="footer" class="dialog-footer">
              <button  @click="resetForm('ruleForm1')">取 消</button>
              <button  @click="_addTeamUsers()">确定</button>
          </span>
    </el-dialog>
    <el-dialog
      title="移除团队"
      :visible.sync="dialogVisible1"
      size="tiny"
      :before-close="handleClose" top='25%' class="teamDetail">
      <span class="delete_team">确定移除该团队吗？移除后不可恢复！</span>
      </el-form>
          <span slot="footer" class="dialog-footer">
             <button  @click="cancelTeam">取 消</button>
            <button  @click="confirmTeam">确定</button>
          </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
//  import Tab from 'components/common/tab'
  import {departmentList,getTeamUserInfo,listChildrenDepts,deleteTeamUsers,getDptUserInfo,addTeamUsers,getTeamList,getRoleList} from '../../../../service/getData'
  import {ERR_OK} from 'service/config'
  export default {
    data() {
      return {
        nowPage: 1,
        checkAll: false,
        total:0,
        pageShow:10,
        data:[],
        state:"",
        checkedCities:[],
        isIndeterminate:false,
        ischeckdate:[],//获取选项框数据
        dialogVisible:false,
        dialogVisible1:false,
        userTeamId:"",
        enable:[{
          value: 'true',
          label: '启用'
        },
          {
            value: 'false',
            label: '禁用'
          }
        ],
        list:[],
        roleArr:[],
        roleId:"",
        value: '',
        deptMent:'',
        deptMent2:'',
        list2:[],
        team:parseInt(this.$route.query.teamId),
        tableData: []
      };
    },
    created(){
        this._getTeamUserInfo()
        this._getTeamList()
      this._getRoleList();
    },
    components: {
//      Tab
    },
    methods: {
      removeTeam(userId,teamId){
        this.dialogVisible1= true;
        this.userIds=userId;
        this.teamId=teamId
      },
      stateSelect(val){

        this._getTeamUserInfo()
      },
      roleSelect(){
        this._getTeamUserInfo()
      },
      teamSelect(val){
        this.deptMent = val
        this._getDepetTwoList(val)
        this._getTeamUserInfo()
      },
      teamSelect2(val){
        this.deptMent2 = val
        this._getTeamUserInfo()
      },
      handleSizeChange(val) {
        this.pageShow=val;
        this._getTeamUserInfo()
      },
      handleCurrentChange(val) {
        this.nowPage=val;
        this._getTeamUserInfo()
      },
      handleClose1(done) {
        this.dialogVisible = false
      },
      handleClose(){
        this.dialogVisible1= false
      },
      showModel(){
        this.dialogVisible=true;
        this._getDptUserInfo()
      },
      resetForm(){
        this.dialogVisible=false;
      },
      selectAll: function(item,index) {
        var self=this;
        item.checked=!item.checked
        //如果父级被选中，那么子集循环，全被给checked=true
        if(item.checked){
          self.data[index].check=true;
          item.deptUsers.forEach(function(item,i){
            item.checked=true;
            self.data[index].deptUsers[i].check=true;
          });
        }else{
          //相反，如果没有被选中，子集应该全部checked=false
          self.data[index].check=false;
          item.deptUsers.forEach(function(item,i){
            item.checked=false;
            self.data[index].deptUsers[i].check=true;
          });
        }
      },
      selectItem: function(item,s,index,i) {
        //父级选中条件
        //子集有选中的，那么父级checked=true
        //some检测的就是有一个满足的就为true
        s.checked=!s.checked
        item.checked=s.checked ? true : item.deptUsers.some(a => a.checked);
        if(s.checked){
          this.data[i].check=true
          this.data[i].deptUsers[index].check=true;
        }else{
          this.data[i].deptUsers[index].check=false;
        }
      },
      confirmTeam(){
        this._deleteTeamUsers();
        this.dialogVisible1= false
      },
      cancelTeam(){
        this.dialogVisible1= false;
      },
//      成员信息
      _getTeamUserInfo(val){
          var self=this;
        let param={}
        var departIdstr;
        if(this.deptMent!=''&& this.deptMent2!=""){
          departIdstr = this.deptMent+','+this.deptMent2
        }else if(this.deptMent!=''&& this.deptMent2==""){
          departIdstr = this.deptMent
        }else{
          departIdstr = ''
        }
        if(this.state!="" && this.roleId!=""){
           param={
            nowPage:this.nowPage,
            pageShow:this.pageShow,
            teamId:this.team,
            roleIds:this.roleId,
            enabled:this.state,
            deptIdStr:departIdstr
          }
        }else if(this.state!=""){
          param={
            nowPage:this.nowPage,
            pageShow:this.pageShow,
            teamId:this.team,
            enabled:this.state,
              deptIdStr:departIdstr
          }
        }else if(this.roleId!=""){
          param={
            nowPage:this.nowPage,
            pageShow:this.pageShow,
            teamId:this.team,
            roleIds:this.roleId,
            deptIdStr:departIdstr
          }
        }else{
          param={
            nowPage:this.nowPage,
            pageShow:this.pageShow,
            teamId:this.team,
            deptIdStr:departIdstr
          }
        }
        getTeamUserInfo(param).then(function (res) {
          if(res.code==ERR_OK){
            self.tableData=res.data.result;
            self.total=res.data.totalCount;
          }else{
            self.$notify.error({
              title: '错误',
              message:res.msg
            });
          }
        })
      },
//      移除团队成员
      _deleteTeamUsers(){
        var self=this;
        deleteTeamUsers({userIds:this.userIds,teamId:this.$route.query.teamId}).then(function (res) {
          if(res.code==ERR_OK){
            self._getTeamUserInfo();
            self.$notify({
              title: '成功',
              message: '已从该团队移除',
              type: 'success'
            });
          }else{
            self.$notify.error({
              title: '失败',
              message:res.msg,
            });
          }
        })
      },
//
      _getDptUserInfo(){
        var self=this;
        getDptUserInfo({teamId:this.$route.query.teamId}).then(function (res) {
          if(res.code==ERR_OK){
            self.data=res.data;
          }else{
            self.$notify.error({
              title: '错误',
              message:res.msg,
            });
          }
        })
      },
//      获取筛选条件团队列表
      _getTeamList(){
        var self=this;
        departmentList().then(function (res) {
          if(res.code==ERR_OK){
            self.list=res.data.result;
            self.list.unshift({
              deptId: -1,
              deptName: '请选择部门'
            })
          }else{
            self.$notify.error({
              title: '错误',
              message:res.msg,
            });
          }
        })
      },

      //      获取筛选条件团队列表
      _getDepetTwoList(val){
        var self=this;
        const params = {
          deptId:val
        }
        listChildrenDepts(params).then(function (res) {
          self.deptMent2=''
          if(res.code==ERR_OK){
            self.list2=res.data;
          }else{
            self.$notify.error({
              title: '错误',
              message:res.msg,
            });
          }
        })
      },
//      获取角色列表信息
      _getRoleList(){
        var self=this;
        getRoleList().then(function (res) {
          if(res.code==ERR_OK){
            self.roleArr=res.data.result;
          }else{
            self.$notify.error({
              title: '错误',
              message:res.msg,
            });
          }
        })
      },
//      添加团队成员
      _addTeamUsers(){
        var self=this;
        let str="";
        var data=this.data;
        for(var key in data){
            if(data[key].check){
              for(var i in data[key].deptUsers){
                if(data[key].deptUsers[i].check){
                  str+=data[key].deptUsers[i].userId+","
                }
              }
            }
        }
        if(str!=""){
        addTeamUsers({teamId:this.$route.query.teamId,userIds:str}).then(function (res) {
          if(res.code==ERR_OK){
            self._getTeamUserInfo();
            self.dialogVisible = false
            self.$notify({
              title: '成功',
              message:"添加团队成员成功",
              type: 'success'
            });

          }else{
            self.$notify.error({
              title: '错误',
              message:res.msg,
            });
          }
        })
      }else{
          this.$notify.info({
            title: '提示',
            message: '请勾选团队成员'
          });
      }
      }
    }
  };
</script>
<style lang="scss"  scoped>
.role-title{
  margin: 0 auto;
  height: 46px;
  line-height: 46px;
  opacity: 0.99;
  background: rgba(217,52,55,0.10);
  box-shadow: 0 2px 11px 0 rgba(0,0,0,0.14);
}
.role-num{
  float: left;
  font-size: 14px;
  color: #333;
}
.role-num:nth-child(1){
  margin-left:20px;
}
.role-num:nth-child(2){
  margin: 0 35px;
}
.role-button{
  display: inline-block;
  width: 115px;
  height: 24px;
  line-height:24px;
  /*background: #D93538;*/
  /*border-radius: 4px;*/
  font-size: 12px;
  color: #FFFFFF;
  margin-top: 8px;
  text-align: center;
  cursor: pointer;
}
.role-button1{
  float: right;
  width: 114px;
  height: 24px;
  line-height:24px;
  background: #D93538;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
  margin-right: 163px;
  margin-top: 12px;
  text-align: center;
  cursor: pointer;
}
.table-content{
  margin-top: 25px;
}
.department-name{
  color: #DA3438;
  cursor: pointer;
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
.content{
 width: 505px;
  height: 267px;
  margin: 10px auto;
  background: #F9F8F8;
  overflow-y: auto;
  border: 1px solid rgba(0,0,0,0.12);
  .check_content{
    padding: 20px 34px 20px 33px;
    content: '';
    display: block;
    clear: both;
    zoom:1;
  }
  }
.menu_children{
  float: left;
  margin-top: 10px;
  /*width: 25%;*/
  margin-left: 10px;
  padding-right: 5px;
}
.menu{
  margin-left: 20px;

}
.citys{
  margin-left: 40px;
  margin-top: 10px;
}
  .delete_team{
    height: 50px;
    line-height: 60px;
    width: 100%;
    display: block;
    text-align: center;
  }
input[type=checkbox],input[type=radio]{
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  cursor: pointer;
  margin: 0;
  vertical-align: bottom;
  background: #fff;
  display: inline-block;
  border: 1px solid #bfcbd9;
  border-radius: 4px;
  -webkit-border-radius: 1px;
  -moz-border-radius: 1px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  top: -3px;
  right: 5px;
  left: -5px
}

input[type=checkbox]:active{
  background: #fff;
}

input[type=checkbox]:hover {
  border-color: #c6c6c6;
  -webkit-box-shadow: inset 0 2px 2px rgba(0,0,0,0.1);
  -moz-box-shadow: inset 0 2px 2px rgba(0,0,0,0.1);
  box-shadow: inset 0 2px 2px rgba(0,0,0,0.1);
}

input[type=checkbox]:checked,input[type=radio]:checked {
  background: #fff;
}

input[type=checkbox]:checked::after {
  content: url('../../../../images/check.png');
  display: block;
  position: absolute;
  top: -3px;
  right: 0px;
  left: -1px
}

input[type=checkbox]:focus {
  outline: none;
  border-color: #cccccc;
}
  .ant-checkbox-wrapper{
    font-size: 14px;
    color: #333333;
  }
</style>
