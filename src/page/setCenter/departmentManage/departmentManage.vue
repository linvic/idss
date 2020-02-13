<template>
  <div>
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <router-link to="/setCenter">
          <span class="child1">系统设置</span>
        </router-link> /
        <router-link to="/setCenter/departmentManage">
         <span class="child2">部门管理</span>
        </router-link>
      </div>

      <div class="role-title">
        <div class="role-num">
          <span>部门管理</span>
          <span>一级部门：{{totalCount}}</span>
          <span>二级部门：{{secondCount}}</span>
        </div>
        <div class="role-button"  @click="addButton('ruleForm')">
          添加部门
        </div>
      </div>
      <div class="">
        <!--新增弹窗-->
        <el-dialog
          :title="addTitle"
          :visible.sync="dialogVisible"
          width="560px"
          :before-close="handleClose" top='25%' class=" noticeManageModel">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="112px" class="demo-ruleForm">
            <el-form-item label="部门名称:" prop="name" required style="margin-right: 40px !important;">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="部门负责人:"  style="margin-right: 40px !important;">
              <el-select v-model="userId" placeholder="请选择部门负责人" style="width:100%;" @change='changeRole'>
                <el-option
                  v-for="item in options"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上级部门:"  style="margin-right: 40px !important;">
              <el-select v-model="deptPid" placeholder="请选择上级部门" style="width:100%;">
                <el-option label="无" :value="-1"></el-option>
                <el-option v-for="item in parentDepts" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门描述：" prop="desc" style="margin-right: 40px !important;">
              <el-input type="textarea" v-model="ruleForm.desc"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <button  @click="resetForm('ruleForm')">取 消</button>
            <button  @click="submitForm('ruleForm')">确认</button>
          </span>
        </el-dialog>
      </div>
      <div class="setCenter-list-wrapper">
        <div class="setCenter-list">
        <ul>
          <li v-for="item in result">
            <div class="role-name">
                <div class="role-left ellipsis" style='width:220px;'>
                  {{item.deptName}}
                </div>
                <div class="role-right" style="width:125px;">
                  <i class="el-icon-plus"  @click="iconChildAdd(item.deptId)"></i>
                  <i class="el-icon-edit" style='margin-left:25px;'  @click="iconEdit(item.deptId)"></i>
                  <i class="el-icon-delete"  @click="iconDelete(item.deptName,item.deptId)"></i>
                </div>
              </div>
              <div class="role-content" @click='routerDepart($event,item.deptId)'>
                <div class="populations-status">
                  <div class="populations-left">
                    部门人数： {{item.staffCount}}
                  </div>
                  <div class="status-right">
                    <span style="float:left;">负责人：</span> <span style="float:left;width:130px;height:19px;line-height:19px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.deptHeaderName}}</span>
                  </div>
                </div>
                <div class="childDepart" @click='listDepart($event,item.deptId,item.branchCount)' :class="item.branchCount==0 ? 'class-a' : 'class-b' ">
                  下辖部门： {{item.branchCount}}
                </div>
                <h3 class="deptDesc">{{item.deptDesc}}</h3>
              </div>
            <!-- </router-link> -->
          </li>
        </ul>
      </div>
      </div>
    </div>
    <el-dialog
      title="部门编辑"
      :visible.sync="dialogVisible2"
      width="560px"
      :before-close="handleClose2" top='25%' class="">
      <el-form :model="ruleForm1" :rules="rules" ref="ruleForm1" label-width="112px" class="demo-ruleForm">
        <el-form-item label="部门名称:" prop="name1" required style="margin-right: 40px !important;">
          <el-input v-model="ruleForm1.name1"></el-input>
        </el-form-item>
        <el-form-item label="部门负责人:"  style="margin-right: 40px !important;">
          <el-select v-model="userId1" placeholder="请选择部门负责人" style="width:100%;" @change='changeRole1'>
            <el-option
              v-for="item in options"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级部门:"  style="margin-right: 40px !important;">
          <el-select v-model="deptPid1" placeholder="请选择上级部门" style="width:100%;">
            <el-option label="无" :value="-1"></el-option>
            <el-option v-for="item in parentDepts" :key="item.deptId" :label="item.deptName" :value="item.deptId" v-if="item.deptId != deptId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门描述："  prop="desc1" style="margin-right: 40px !important;">
          <el-input type="textarea" v-model="ruleForm1.desc1"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <button  @click="resetForm2('ruleForm1')">取 消</button>
        <button  @click="submitForm2('ruleForm1')">确认</button>
      </span>
    </el-dialog>
    <div class="deleteDepartment">
      <el-dialog
        title="删除部门"
        :visible.sync="dialogVisible1"
        width="560px"
        :before-close="handleClose1" top='25%' class="department">
        <span>确定删除次部门吗？</span>
        <span slot="footer" class="dialog-footer">
          <button @click="dialogVisible1 = false">取 消</button>
          <button  @click='sureDelete'>确 定</button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { departmentList, addDepartment,listDeptRoleUsers, listAllUsers, deleteDepartment, getDepartment, editorDepartment, getParentDepts } from 'service/getData'
//  import Tab from 'components/common/tab'
  import {ERR_OK} from 'service/config'
  export default {
    data() {
      return {
        hello:true,
        dialogVisible: false,
        dialogVisible1: false,
        dialogVisible2:false,
        roleName:'总经理',
        parentDepts:[],
        options:[],
        addTitle:'添加部门',
        deptId:'',
        totalCount:'',
        secondCount:'',
        keys:'',
        userId:'',
        userId1:'',
        deptPid: -1,
        deptPid1: -1,
        labelPosition: 'right',
        ruleForm: {
          name: '',
          region:'',
          desc: '',
          name1: '',
          region1:'',
          desc1: ''
        },
        ruleForm1: {
          // name: '',
          // region:'',
          // desc: '',
          name1: '',
          region1:'',
          desc1: ''
        },
        rules: {
          name: [
             { required: true, message: '请填写部门名称' },
             {  max: 20, message: '部门名称不得超过20个字符' }
          ],
          desc: [
            {  max: 200, message: '部门描述不得超过200个字符' }
          ],
          region: [
            { required: true, message: '请选择活动区域' }
          ],
          name1: [
            { required: true, message: '请填写部门名称'},
            {  max: 20, message: '部门名称不得超过20个字符' }
          ],
          desc1: [
            {  max: 200, message: '部门描述不得超过50个字符' }
          ],
          region1: [
            { required: true, message: '请选择活动区域' }
          ],
        },

        formLabelAlign: {
          name: '',
          region: '',
          type: ''
        },
        result:[
        ]
      };
    },
    components: {
//      Tab
    },
    mounted () {
      this.ruleForm.name=''
      this.ruleForm.region=''
      this.ruleForm.desc=''
      this.getDate()
      this.getlistAllUsers('');
      this.getParentDeptList(); //获取所有一级部门
    },
    methods: {
      addDepart () {

      },
      routerDepart(event,val){
        event.stopImmediatePropagation();
        this.$router.push({path: '/setCenter/departmentDetail', query: {id: val}})
      },
      listDepart(event,val){
        var e = event;
        if(e&&e.stopPropagation){
            e.stopPropagation()
        }else if(window.event){
            window.event.cancelBubble=true;
        }
        if(val>0){
          this.$router.push({ path:'/setCenter/departmentChild',query: { id: val}});
              console.log(val)
        }

      },
      getlistAllUsers (deptId) {
        let self = this
        const params = {
          deptId:deptId
        }
        listDeptRoleUsers(params).then((res) => {
          if(res.code == ERR_OK) {
            self.options = res.data
          }
       })
      },
      getParentDeptList() {
        getParentDepts().then((res) => {
          if(res.code == ERR_OK) {
            this.parentDepts = res.data
          } else {
            this.$notify.error({
              title: '失败',
              message:res.msg
            });
          }
       })
      },
      
      changeRole (val) {
        this.userId = val
      },
      changeRole1 (val) {
        this.userId1 = val
      },
      sureDelete () {
        let self = this
        const params = {
          id:this.keys
        }
        deleteDepartment(params).then((res) => {
          if(res.code == ERR_OK) {
            this.dialogVisible1 = false
            let data = res
            this.$notify({
              title: '成功',
              message: '删除部门成功',
              type: 'success'
            });
            self.getDate()
          }else {
            this.$notify.error({
              title: '失败',
              message:res.msg
            });
          }
       })
      },
      getDate(){
        let self = this
        departmentList().then((res) => {
          if(res.code == ERR_OK) {
            let data = res
            self.totalCount = data.data.totalCount
            self.secondCount = data.data.secondCount
            self.result = data.data.result
          }
       })
     },
     iconChildAdd(val) {
       this.deptPid = val
       this.dialogVisible = true
       this.addTitle = '添加下辖部门'
     },
     iconDelete (val,keys){
       this.roleName =val
       this.keys = keys
       this.dialogVisible1 = true
     },
     iconEdit (keys) {
       let self = this
       this.dialogVisible2 = true
       this.getlistAllUsers(keys)
       const params = {
         id:keys
       }
       getDepartment(params).then((res) => {
         if(res.code == ERR_OK) {
           let data = res
           self.ruleForm1.name1 = data.data.deptName
           self.ruleForm1.region1 = ''
           self.ruleForm1.desc1 = data.data.deptDesc
           self.deptId = data.data.deptId
           if(!data.data.deptHeaderId && typeof(data.data.deptHeaderId)!="undefined" && data.data.deptHeaderId!=0){
             self.userId1 = ""
           }else{
             self.userId1 = data.data.deptHeaderId
           }
           self.deptPid1 = data.data.deptPid
           
         }else{
           this.$notify.error({
             title: '提示',
             message:res.msg
           });
         }
      })
     },
      handleClose1(done) {
        this.dialogVisible1 = false

      },
      handleClose() {
          this.dialogVisible = false
          this.$refs['ruleForm'].resetFields()
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addDepartment({
                deptName:this.ruleForm.name,
                deptHeaderId:this.userId,
                deptDesc:this.ruleForm.desc,
                deptPid:this.deptPid
              }).then((res) => {
              if(res.code == ERR_OK) {
                this.$notify({
                  title: '成功',
                  message: '新增部门成功',
                  type: 'success'
                });
                this.getDate();
                this.getParentDeptList(); //获取所有一级部门
                this.$refs[formName].resetFields()
                this.dialogVisible = false
              }else{
                this.$notify.error({
                  title: '提示',
                  message:res.msg
                });
              }
           })
          }
        });
      },
      resetForm(formName) {
        this.dialogVisible = false
        this.$refs[formName].resetFields();
      },
      handleClose2(done) {
        this.dialogVisible2 = false
        this.$refs['ruleForm1'].resetFields();
      },
      submitForm2(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            editorDepartment({
              deptId:this.deptId,
              deptName:this.ruleForm1.name1,
              deptHeaderId:this.userId1,
              deptDesc:this.ruleForm1.desc1,
              deptPid: this.deptPid1
            }).then((res) => {
              if(res.code == ERR_OK) {
                this.$notify({
                  title: '成功',
                  message: '编辑部门成功',
                  type: 'success'
                });
                this.getDate()
                this.dialogVisible2 = false
              }else{
                this.$notify.error({
                  title: '提示',
                  message:res.msg
                });
              }
           })

          } else {
            return false;
          }
        });
      },
      addButton(formName){
        
        this.deptPid = -1;
        this.dialogVisible = true
        this.addTitle = '添加部门'
        this.getlistAllUsers('')
        if(this.$refs[formName]){
          this.$refs[formName].resetFields()
        }
      },
      resetForm2(formName) {
        this.dialogVisible2 = false
        this.$refs[formName].resetFields();
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
    color: #333333;
  }
  .role-num span {
    margin-right: 30px;
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
    width: 260px;
    color: #333333;
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
  }
  .class-a{
    visibility: hidden;
  }
  .class-b{
    visibility: visible;
  }
  .populations-status{
    height:30px;
    /*line-height: 50px;*/
    font-size: 14px;
    color: #7F7F7F;
    padding-top: 20px;
  }
  .childDepart{
    font-size: 14px;
    color: #D93538;
    margin-left: 20px;
    margin-bottom: 21px;
    width: 130px;
  }
  .childDepart:hover{
    text-decoration: underline;
  }
  .populations-left{
    float: left;
    margin-left: 20px;
  }
  .status-right{
    float: right;
    margin-right: 20px;
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
  .deptDesc{
    width: 330px;
    padding-left: 20px;
    height: 50px !important;
    padding-right: 20px;
    margin-bottom: 10px;
    overflow: hidden;
    text-overflow: ellipsis;;
  }

</style>
