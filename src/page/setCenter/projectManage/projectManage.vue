<template>
  <div>
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <router-link to="/setCenter">
          <span class="child1">系统设置</span>
        </router-link> /
        <router-link to="/setCenter/departmentManage">
         <span class="child2">项目管理</span>
        </router-link>
      </div>
      <div class="role-title">
        <div class="role-num">
          <div class="project-name">
            项目名称
          </div>
          <input type="text" name="" value="" v-model="projectName">
          <button type="button" name="button" @click="search">搜索</button>
        </div>
        <div class="role-button" @click='addTeam()'>
          添加项目
        </div>
      </div>
      <div class="setCenter-list-wrapper">
        <div class="setCenter-list">
        <ul>
          <li v-for="(item,index) in projectList" :key="index">
            <div class="role-name">
                <div class="role-left ellipsis">
                  {{item.projectName}}
                </div>
                <div class="role-right">
                  <i class="el-icon-edit"  @click="editor(item.projectId,index)"></i>
                  <i class="el-icon-delete"  @click="deleteProject(item.projectId,index)"></i>
                </div>
              </div>
              <div class="role-content">

                <!-- 暂时隐藏 v-if="false" -->
                <div class="populations-status" v-if="false">
                  <div class="populations-left">
                    项目任务总数： {{item.taskTotal}}
                  </div>
                  <div class="status-right">
                    未完成任务总数： {{item.unfinishedTaskSize}}
                  </div>
                  <div class="populations-left">
                    重要任务总数： {{item.impTaskSize}}
                  </div>
                  <div class="status-right">
                    未完成重点任务： {{item.unfinishedImpTaskSize}}
                  </div>
                </div>
              </div>
          </li>

        </ul>
      </div>
      </div>
    </div>
    <el-dialog
      title="项目编辑"
      :visible.sync="dialogVisible"
      width="560px"
      :before-close="handleClose" top='25%' class="department department1 projectManage">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <button @click="cancelEditor('ruleForm')">取 消</button>
        <button @click="sureEditor('ruleForm')">确 定</button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加项目"
      :visible.sync="dialogVisible2"
      width="560px"
      :before-close="handleClose2" top='25%' class="department department1 projectManage">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <button @click="cancelProject('ruleForm')">取 消</button>
        <button @click="sureProject('ruleForm')">确 定</button>
      </span>
    </el-dialog>
    <el-dialog
      title="删除项目"
      :visible.sync="dialogVisible1"
      width="560px"
      :before-close="handleClose1" top='25%' class="department projectManage">
      <span>确定删除该项目吗？删除后不可恢复</span>
      <span slot="footer" class="dialog-footer">
        <button @click="cancelDelete">取 消</button>
        <button @click="sureDelete">确 定</button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
//  import Tab from 'components/common/tab'
  import {getProjectList,addProject,updateProject,deleteProject} from '../../../service/getData'
  import {ERR_OK} from 'service/config'
  export default {
    data() {
      return {
        hello:true,
        dialogVisible: false,
        dialogVisible1: false,
        dialogVisible2: false,
        roleName:'总经理',
        labelPosition: 'right',
        projectId:"",
        projectName:"",
        ruleForm: {
          name: '',
        },
        rules: {
          name: [
            {required: true, message: '请输入项目名称', trigger: 'blur'},
          ]
        },
        formLabelAlign: {
          name: '',
          region: '',
          type: ''
        },
        projectList:[]
      };
    },
    created(){
      this._getProjectList()
    },
    components: {
//      Tab
    },
    methods: {
      delete1 (val) {
        this.dialogVisible1 = true
        this.roleName = val
      },
      handleClose(done) {
        this.dialogVisible = false
        this.$refs['ruleForm'].resetFields()
      },
      editor(id,index){
        this.dialogVisible= true;
        this.projectId=id;
        this.ruleForm.name=this.projectList[index].projectName
      },
      handleClose1(done) {
        this.dialogVisible1 = false
      },
      handleClose2(done) {
        this.dialogVisible2 = false
        this.$refs['ruleForm'].resetFields()
      },
      addTeam(formName) {
        this.dialogVisible2 = true;
        this.ruleForm.name=""
      },
      cancelProject(formName){
        this.$refs[formName].resetFields();
        this.dialogVisible2 = false
      },
      cancelEditor(formName){
        this.dialogVisible=false
      },
      sureProject(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogVisible2 = false;
            this._addProject()
          } else {
            return false;
          }
        });
      },
      sureEditor(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogVisible= false;
            this._updateProject();
          } else {
            return false;
          }
        });
      },
//      删除项目
      deleteProject(projectId,index){
           this.dialogVisible1=true;
           this.projectId=projectId;
      },
//      取消删除
      cancelDelete(){
        this.dialogVisible1 = false
      },
//      确定删除
      sureDelete(){
        this.dialogVisible1 = false;
        this._deleteProject()
      },
//      搜索
      search(){
        this._getProjectList()
      },
//      获取项目列表
      _getProjectList(){
        var self=this;
        var param;
        if(this.projectName!=""){
          param={
            projectName:this.projectName
          }
        }else{
          param={
          }
        }
        getProjectList(param).then(function (res) {
          if(res.code==ERR_OK){
            self.projectList=res.data.result;
          }else{
            self.$notify.error({
              title: '错误',
              message:res.msg
            });
          }
        })
      },
//      添加项目
      _addProject(){
        var self=this;
        addProject({projectName:this.ruleForm.name}).then(function (res) {
          if(res.code==ERR_OK){
            self._getProjectList();
            self.$notify({
              title: '成功',
              message: '添加项目成功',
              type: 'success'
            });
          }else{
            self.$notify.error({
              title: '失败',
              message: '添加项目失败'
            });
          }
        })
      },
//      编辑项目
      _updateProject(){
        var self=this;
        updateProject({projectId:this.projectId,projectName:this.ruleForm.name}).then(function (res) {
          if(res.code==ERR_OK){
            self._getProjectList();
            self.$notify({
              title: '成功',
              message: '编辑项目成功',
              type: 'success'
            });
          }else{
            self.$notify.error({
              title: '失败',
              message: '编辑项目失败'
            });
          }
        })
      },
//      删除项目
      _deleteProject(){
        var self=this;
        deleteProject({id:this.projectId}).then(function (res) {
          if(res.code==ERR_OK){
            self._getProjectList();
            self.$notify({
              title: '成功',
              message: '删除项目成功',
              type: 'success'
            });
          }else{
            self.$notify.error({
              title: '失败',
              message: '删除项目失败'
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
    height: 136px;
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
    color: #FFFFFF;
  }
  .role-num .project-name,.role-num input,.role-num button{
    float: left;
  }
  .project-name{
    color: #333333;
    margin-left: 34px;
  }
  .role-num button{
    width: 56px;
    height:22px;
    margin-top: 11px;
    margin-left: 15px;
    background: #D93538;
    border-radius: 4px;
    font-size: 12px;
    color: #FFFFFF;
    line-height: 22px;
    cursor: pointer;
  }
  .role-num input{
    background: #FFFFFF;
    border-radius: 4px;
    width: 230px;
    height:24px;
    padding: 0 10px;
    margin-top: 11px;
    margin-left: 11px;
  }

  .role-button{
    float: right;
    width: 84px;
    height: 30px;
    line-height:30px;
    background: #D93538;
    border-radius: 4px;
    font-size: 14px;
    color: #FFFFFF;
    margin-right: 163px;
    margin-top: 8px;
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
    color: #333333;
    width: 260px;
    padding-left: 15px;
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
    height: 24px;
    line-height: 24px;
    margin-left: 19px;
    margin-right: 25px;
  }
  .populations-status{
    // height:50px;
    line-height: 34px;
    font-size: 14px;
    color: #7F7F7F;
    margin-top: 6px;
  }
  .populations-left{
    float: left;
    margin-left: 19px;
    width: 163px;
  }
  .status-right{
    float: left;

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
.department1 .el-form-item{
  margin-bottom: 0 !important
}
</style>
