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
          <span class="child2">团队管理</span>
        </router-link>
      </div>
      <div class="role-title">
        <div class="role-num">
          团队数：{{list.length}}
        </div>
          <div class="role-button" @click="team">
            添加团队
          </div>
      </div>
      <div class="setCenter-list-wrapper">
        <div class="setCenter-list">
        <ul>
          <li v-for="(item,index) in list">
            <div class="role-name">
              <div class="role-left ellipsis">
                {{item.teamName}}
              </div>
              <div class="role-right">
                <i class="el-icon-edit" @click="editor(item.teamId)"></i>
                <i class="el-icon-delete" @click="_deletes(item.teamId)"></i>
              </div>
            </div>
            <router-link :to="{ path: 'teamDetail',query:{teamId:item.teamId}}">
              <div class="role-content">
                <div class="populations-status">
                  <div class="populations-left">
                    团队人数：{{item.userCount}}
                  </div>
                  <div class="role-mid">
                    负责人：{{item.userName}}
                  </div>
                </div>
                <h3 style="padding-bottom: 20px">{{item.teamDesc}}</h3>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
      </div>
    </div>
    <el-dialog
      title="删除团队"
      :visible.sync="dialogVisible"
      size="tiny"
      :before-close="handleClose" top='25%' class="teamDetail">
      <span class="delete_team">确定删除该团队吗？删除后不可恢复！</span>
      </el-form>
          <span slot="footer" class="dialog-footer">
             <button  @click="cancelTeam">取 消</button>
            <button  @click="confirmTeam">确定</button>
          </span>
    </el-dialog>
    <el-dialog
      title="编辑团队"
      :visible.sync="dialogVisible1"
      size="tiny"
      :before-close="handleClose1" top='25%' class="teamDetail">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="团队名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="团队负责人" prop="region">
          <el-select v-model="ruleForm.region" placeholder="选择一级部门" @visible-change="allStaff">
            <el-option
              v-for="item in options"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="  " v-if='twoDept1'>
          <el-select v-model="ruleForm.region44" placeholder="选择二级部门" @visible-change="allStaff4">
            <el-option
              v-for="item in options44"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="　　　　" prop="staff" class="staff">
          <el-select v-model="ruleForm.staff" placeholder="请选择">
            <el-option
              v-for="item in optionStaff"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="团队描述" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
      </el-form>
      </el-form>
          <span slot="footer" class="dialog-footer">
            <button  @click="cancelEditor('ruleForm')">取 消</button>
            <button  @click="confirmEditor('ruleForm')">确定</button>
          </span>
    </el-dialog>
    <el-dialog
      title="添加团队"
      :visible.sync="dialogVisible2"
      size="tiny"
      :before-close="handleClose2" top='25%' class="teamDetail ">
      <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="100px" class="demo-ruleForm">
        <el-form-item label="团队名称" prop="name">
          <el-input v-model="ruleForm1.name"></el-input>
        </el-form-item>
        <el-form-item label="团队负责人" prop="region">
          <el-select v-model="ruleForm1.region" placeholder="请选择一级部门" @change="allStaff1()">
            <el-option
              v-for="item in options1"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="  " v-if='twoDept'>
          <el-select v-model="ruleForm1.region11" placeholder="请选择二级部门" @visible-change="allStaff2">
            <el-option
              v-for="item in options11"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="　　　　" prop="staff" class="staff">
          <el-select v-model="ruleForm1.staff" placeholder="选择员工">
            <el-option
              v-for="item in optionStaff1"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="团队描述" prop="desc">
          <el-input type="textarea" v-model="ruleForm1.desc"></el-input>
        </el-form-item>
      </el-form>
      </el-form>
          <span slot="footer" class="dialog-footer">
            <button  @click="cancelAdd('ruleForm1')">取 消</button>
            <button  @click="confirmAdd('ruleForm1')">确定</button>
          </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
//  import Tab from 'components/common/tab'
  import {addTeam,getTeamList,listChildrenDepts,getTeamDetail,deleteTeam,update,getUserList,departmentList} from '../../../service/getData'
  import {ERR_OK} from 'service/config'
  export default {
    data() {
      return {
        hello:true,
        list:[],
        teamHeaderId:"",
        teamId:"",
        options11:[],
        dialogVisible:false,
        dialogVisible1:false,
        dialogVisible2:false,
        optionStaff:[],
        optionStaff1:[],
        options44:[],
        twoDept:false,
        twoDept1:false,
        ruleForm1: {
          name: '',
          region: '',
          region11:'',
          staff:"",
          desc:"",
        },
        rules1: {
          name: [
            {required: true, message: '团队名称不能为空'},
            { max: 20, message: '长度不能超过20字符'}
          ],
          region: [
            {type: 'number',required: true, message: '选择部门'}
          ],
          staff:[
            {type: 'number',required: true, message: '选择员工'}
          ],
          desc:[
            { max: 50, message: '长度不能超过50字符'}
          ],
        },
        ruleForm: {
          name: '',
          region: '',
          region11:'',
          region44:'',
          staff:"",
          desc:"",
        },
        rules: {
          name: [
            {required: true, message: '团队名称不能为空'},
            { max: 20, message: '长度不能超过20字符'}
          ],
          region: [
            {type: 'number',required: true, message: '选择部门'}
          ],
          staff:[
            {type: 'number',required: true, message: '选择员工'}
          ],
          desc:[
            { max: 50, message: '长度不能超过50字符'}
          ],
        },
        options: [],
        options1: [],
      };
    },
    components: {
//      Tab
    },
    created(){
        this._getTeamList()
    },
    methods: {
      //      获取筛选条件团队列表
      _getDepetTwoList(val){
        var self=this;
        const params = {
          deptId:val
        }
        listChildrenDepts(params).then(function (res) {
          self.ruleForm1.region11=''
          if(res.code==ERR_OK){
            self.options11=res.data;
            if(res.data.length>0){
              self.twoDept = true
            }else{
              self.twoDept = false
            }
          }else{
            self.$notify.error({
              title: '错误',
              message:res.msg,
            });
          }
        })
      },
      //      编辑二级联动
      _getDepetTwoList1(val){
        var self=this;
        const params = {
          deptId:val
        }
        listChildrenDepts(params).then(function (res) {
          self.ruleForm.region44=''
          if(res.code==ERR_OK){
            self.options44=res.data;
            if(res.data.length>0){
              self.twoDept1 = true
            }else{
              self.twoDept1 = false
            }
          }else{
            self.$notify.error({
              title: '错误',
              message:res.msg,
            });
          }
        })
      },
      //      编辑二级联动
      _getDepetTwoList3(val,key,name){
        var self=this;
        const params = {
          deptId:val
        }
        var depetName = val+','+key
        this._getUserList3(depetName,name)
        listChildrenDepts(params).then(function (res) {
          //self.ruleForm.region44=''
          if(res.code==ERR_OK){
            self.options44=res.data;
            if(res.data.length>0){
              self.twoDept1 = true
              self.ruleForm.region44=key
            }else{
              self.twoDept1 = false
              self.ruleForm.region44=key
            }
          }else{
            self.$notify.error({
              title: '错误',
              message:res.msg,
            });
          }
        })
      },
      team(){
        this.dialogVisible2 = true
        this.optionStaff1=[]
        this. ruleForm1.region=""
        this. ruleForm1.name=""
        this. ruleForm1.desc=""
        this.ruleForm1.staff=""
        this._departmentList();
      },
      _deletes(teamId){
        this.dialogVisible=true;
        this.teamId=teamId
      },
      editor(val){
        this._departmentList();
        this.dialogVisible1=true;
        this.teamId = val
        const params = {
          teamId:val
        }
        var self = this
        getTeamDetail(params).then(function (res) {
          if(res.code==ERR_OK){
            self.ruleForm.name = res.data.teamName
            self.ruleForm.desc = res.data.teamDesc
            var arr = res.data.teamLeaderUser.deptTreeIds.split(',');
            var deptLevel = res.data.teamLeaderUser.deptLevel
            //self.ruleForm.staff=res.data.teamHeaderId
            if(res.data.teamLeaderUser.deptLevel=='LEVEL_TWO'){
                self.ruleForm.region = parseInt(arr[1]);
                self.twoDept1 = true
                console.log('22')
                self._getDepetTwoList3(parseInt(arr[1]),parseInt(arr[2]),res.data.teamHeaderId)
            }else{
                self._getUserList3(parseInt(arr[1]),res.data.teamHeaderId)
                self.ruleForm.region = parseInt(arr[1]);
                 self.twoDept1 = false
            }
          }else{
            self.$notify.error({
              title: '错误',
              message:res.msg,
            });
          }
        })
        // this.teamId=item.teamId
        // this. ruleForm.name=item.teamName
        // this. ruleForm.desc=item.teamDesc
        // this.ruleForm.region=item.deptId
        // this.ruleForm.staff=item.teamHeaderId
        // this. _getUserList(item.deptId)
      },
      confirmTeam(){
        this._deleteTeam(this.teamId);
        this.dialogVisible= false
      },
      confirmEditor(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.editorTeam(this.teamId,this.ruleForm.staff,this.ruleForm.name,this.ruleForm.desc);
            this.dialogVisible1= false
          } else {
            return false;
          }
        });
      },
      cancelTeam(){
        this.dialogVisible= false;
      },
      cancelEditor(formName){
        this.$refs[formName].resetFields();
        this.dialogVisible1= false;
      },
      confirmAdd(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogVisible2 = false
             this._submitaddTeam()
          } else {
            return false;
          }
        });
      },
      cancelAdd(formName){
        this.$refs[formName].resetFields();
        this.dialogVisible2 = false
      },
      handleClose(done) {
        this.dialogVisible = false
      },
      handleClose1(done) {
        this.dialogVisible1 = false
        this.$refs['ruleForm'].resetFields();
      },
      handleClose2(done) {
        this.dialogVisible2 = false
        this.$refs['ruleForm1'].resetFields();
      },
//      添加团队
      _submitaddTeam(){
        var self=this;

        addTeam({teamHeaderId:this.ruleForm1.staff,teamName:this.ruleForm1.name,teamDesc:this.ruleForm1.desc}).then(function (res) {
          if(res.code==ERR_OK){
            self._getTeamList();
            self.$refs['ruleForm1'].resetFields();
            self.$notify({
              title: '成功',
              message: '添加团队成功',
              type: 'success'
            });
          }else{
            self.$notify.error({
              title: '失败',
              message: res.msg
            });
          }
        })

      },
//      编辑团队
      editorTeam(teamId,teamHeaderId,teamName,teamDesc){
        var self=this;
        update({teamId:teamId,teamHeaderId:teamHeaderId,teamName:teamName,teamDesc:teamDesc}).then(function (res) {
          if(res.code==ERR_OK){
            self._getTeamList();
            self.$notify({
              title: '成功',
              message: '编辑团队成功',
              type: 'success'
            });
          }else{
            self.$notify.error({
              title: '失败',
              message: '编辑团队失败'
            });
          }
        })
      },
//      删除团队
      _deleteTeam(teamId){
        var self=this;
        deleteTeam({id:teamId}).then(function (res) {
          if(res.code==ERR_OK){
            self._getTeamList();
            self.$notify({
              title: '删除团队',
              message: '删除团队成功',
              type: 'success'
            });
          }else{
            self.$notify.error({
              title: '删除团队',
              message:res.msg
            });
          }
        })
      },
      //      部门
      _departmentList(){
        departmentList().then((res) =>{
          if(res.code==ERR_OK){
            this.options=res.data.result
            this.options1=res.data.result
          }
        })
      },
      allStaff(val){
        if(!val){
          this.optionStaff=[]
          this.ruleForm.staff=""
          this.options44=[]
          this.ruleForm.region44=""
          this._getUserList(this.ruleForm.region)
          this._getDepetTwoList1(this.ruleForm.region)
        }
      },
      allStaff4(val){
        if(!val){
          this.optionStaff=[]
          this.ruleForm.staff=""
          var deptId = this.ruleForm.region+','+this.ruleForm.region44
          this._getUserList(deptId)
        }
      },
      allStaff1(){
        this.options11=[]
        this.ruleForm1.staff=""
        this.optionStaff1=[]
        this.ruleForm1.region11 = ''
        this._getUserList1(this.ruleForm1.region)
        this._getDepetTwoList(this.ruleForm1.region)
      },
      allStaff2(val){
        if(!val){
          this.optionStaff1=[]
          this.ruleForm1.staff=""
          console.log(this.twoDept)
          var deptId = this.ruleForm1.region+','+this.ruleForm1.region11
          this._getUserList1(deptId)
        }


      },
      //      员工
      _getUserList3(deptId,val){
        var self=this;
        var param={
          deptIdStr:deptId
        }
        getUserList(param).then(function (res) {
          if(res.code==ERR_OK){
            self.optionStaff=res.data.result;
            self.ruleForm.staff = val
          }else{
            self.$notify.error({
              title: '错误',
              message: res.msg,
            });
          }
        })
      },
      //      员工
      _getUserList1(deptId){
        var self=this;
        var param={
          deptIdStr:deptId
        }
        getUserList(param).then(function (res) {
          if(res.code==ERR_OK){
            self.optionStaff1=res.data.result;
          }else{
            self.$notify.error({
              title: '错误',
              message: res.msg,
            });
          }
        })
      },
//      员工
      _getUserList(deptId){
        var self=this;
        var param={
          deptIdStr:deptId
        }
        getUserList(param).then(function (res) {
          if(res.code==ERR_OK){
           self.optionStaff=res.data.result;
          }else{
            self.$notify.error({
              title: '错误',
              message: res.msg,
            });
          }
        })
      },
//      获取团队列表
      _getTeamList(){
        var self=this;
        getTeamList().then(function (res) {
          if(res.code==ERR_OK){
             self.list=res.data;
          }else{
            self.$notify.error({
              title: '错误',
              message:res.msg
            });
          }
        })
      }
    }
  };
</script>
<style lang="scss"  scoped>
  .setCenter-list-wrapper{
    
    margin: 0 auto;
    overflow: hidden;
    background: #fff;
    padding-top: 25px;
  }
  .setCenter-list{
    
    margin: 0 auto;
    overflow: hidden;
  }

  .setCenter-list ul li{
    float: left;
    /*height: 159px;*/
    width: 370px;
    margin-bottom: 20px;
    cursor: pointer;
    background: #FFFFFF;
    box-sizing: border-box;
    border: 1px solid #E6EAF2;
    margin-left: 40px;
  }
  .setCenter-list ul li:hover{
    border: 1px solid rgba(217,52,55,0.50);
  }
  .role-title{
    margin: 0 auto;
    height: 46px;
    line-height: 46px;
    opacity: 0.99;
    background: rgba(217,52,55,0.10);
  }
  .role-num{
    float: left;
    font-size: 14px;
    color: #333;
  }
  .role-num:nth-child(1){
    margin-left:34px;
  }
  .role-num:nth-child(2){
    margin: 0 60px;
  }
  .role-button{
    float: right;
    width: 84px;
    height: 25px;
    line-height:25px;
    border: 1px solid #D83436;
    border-radius: 4px;
    font-size: 14px;
    color: #D93538;
    margin-right: 163px;
    margin-top: 10px;
    text-align: center;
    cursor: pointer;
  }
  .role-name{
    height: 42px;
    line-height:42px;
    background: rgba(217,52,55,0.02);
    border-bottom:1px solid rgba(0,0,0,0.12);
  }
  .role-left{
    float: left;
    font-size: 16px;
    width: 260px;
    color: #333333;
    padding-left: 15px;
  }
  .role-mid{
    float: left;
    font-size: 14px;
    color: #7F7F7F;
    margin-left: 20px;
    width: 220px;
  }
  .role-right{
    float: right;
    font-size: 15px;
    color: #7F7F7F;
    width: 85px;
  }
  .role-right .el-icon-delete{
    margin-left: 25px;
  }
  .role-right i:hover{
    color: #0095FF;
  }
  .role-content h3{
    font-weight: normal;
    font-size: 12px;
    color: #A3A3A3;
    padding-left: 19px;
    padding-right: 25px;
    padding-bottom: 20px;
  }
  .role-content{
    height: 126px;
  }
  .populations-status{
    height:50px;
    /*line-height: 50px;*/
    font-size: 14px;
    color: #7F7F7F;
    padding-top: 40px;
  }
  .populations-left{
    float: left;
    margin-left: 20px;
  }
  .status-right{
    float: right;
    margin-right: 88px;
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
  .delete_team{
    height: 50px;
    line-height: 60px;
    width: 100%;
    display: block;
    text-align: center;
  }
</style>
