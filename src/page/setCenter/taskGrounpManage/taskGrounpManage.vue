<template>
  <div>
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <router-link to="/setCenter">
          <span class="child1">系统设置</span>
        </router-link> /
         <span class="child2">任务类别管理</span>
      </div>
      <div class="role-title">
        <div class="role-num">
          <div class="project-name">
            任务类别管理
          </div>

        </div>
        <div class="role-button" @click='addTeam'>
          添加任务类别
        </div>
      </div>
      <div class="setCenter-list-wrapper">
        <div class="setCenter-list">
        <ul class="clear drag">
          <li v-for="(item,index) in taskData" class="clear myLi">
            <div class="role-name">
                <div class="role-left ellipsis">
                  {{item.taskGroupName}}
                </div>
                <div class="role-right">
                  <i class="el-icon-edit"    @click="editorGroup(item.taskGroupId)"></i>
                  <i class="el-icon-delete"  @click="deleteGroup(item,index)"></i>
                </div>
              </div>
              <div class="role-content">
                <div class="populations-status clear dragChildren" ref="myLi">
                  <div class="populations-left" v-for="(temp,i) in item.typeEntitys">
                    {{temp.taskTypeName}}
                  </div>
                </div>
              </div>
          </li>
        </ul>
      </div>
      </div>
    </div>
    <el-dialog
      title="添加子任务类别"
      :visible.sync="dialogVisible3"
      width="560px"
      :before-close="handleClose3" top='25%' class="department department1">
      <el-form :label-position="labelPosition" ref="formLabelAlign3" :rules="rules" label-width="120px" :model="formLabelAlign3">
        <el-form-item label="子类别名称：" required prop="name3">
          <el-input v-model.trim="formLabelAlign3.name3"></el-input>
        </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
          <button @click="resetForm3('formLabelAlign3')">取 消</button>
          <button @click="submitForm3('formLabelAlign3')">保 存</button>
        </span>
    </el-dialog>
    <el-dialog
      title="添加任务类别"
      :visible.sync="dialogVisible2"
      width="560px"
      :before-close="handleClose2" top='25%' class="department department1">
      <el-form :label-position="labelPosition" ref="ruleForm" :rules="rules" label-width="130px" :model="ruleForm">
        <el-form-item label="任务类别名称：" required  prop="name">
          <el-input v-model.trim="ruleForm.name"></el-input>
        </el-form-item>
        
        <div class="money-wrapper">
          <div class="reward-left"><span style="color: red"> * </span>子任务类别：
          </div>
          <div class="reward-right">
            <div class="reward-item" v-for='(m,index) in addMoneyData'  @click="checkType(m,index)">
              {{m.taskTypeName}}
            </div>
            <div class="add-money"  @click="addMoneyType()">
              <img src="../../../images/add.png" alt="" >
              添加
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <button @click="cancelAdd('ruleForm')">取 消</button>
        <button @click="sureAdd('ruleForm')">确 定</button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑任务类别"
      :visible.sync="dialogVisible"
      width="560px"
      :before-close="handleClose" top='25%' class="department department1">
      <el-form :label-position="labelPosition" ref="ruleForm" :rules="rules" label-width="130px" :model="ruleForm">
        <el-form-item label="任务类别名称：" required  prop="name">
          <el-input v-model.trim="ruleForm.name"></el-input>
        </el-form-item>
        <div class="money-wrapper">
          <div class="reward-left"><span style="color: red"> * </span>子任务类别：
          </div>
          <div class="reward-right">
            <div class="reward-item" v-for='(item,index) in editorData' @click="checkType(item,index)">
              {{item.taskTypeName}}
            </div>
            <div class="add-money" @click="addTypes()">
              <img src="../../../images/add.png" alt="" >
              添加
            </div>
          </div>
        </div>
      </el-form>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <button @click="cancelEditor('ruleForm')">取 消</button>
        <button @click="sureEditor('ruleForm')">确 定</button>
      </span>
    </el-dialog>
    <!--编辑添加任务类别-->
    <el-dialog
      :title="editor? '编辑子任务类别' :'添加子任务类别'"
      :visible.sync="dialogVisible4"
      width="560px"
      :before-close="handleClose4" top='25%' class="department department1">
      <el-form :label-position="labelPosition" ref="formLabelAlign4" :rules="rules" label-width="120px" :model="formLabelAlign4">
        <el-form-item label="子类别名称：" required prop="name4">
          <el-input v-model.trim="formLabelAlign4.name4"></el-input>
        </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
          <button @click="resetForm4('formLabelAlign4')">取 消</button>
          <button @click="submitForm4('formLabelAlign4')">保 存</button>
        </span>
    </el-dialog>
    <el-dialog
      title="删除任务类别"
      :visible.sync="dialogVisible1"
      width="560px"
      :before-close="handleClose1" top='25%' class="department">
      <span class="delete_team">确定删除该任务类别吗？删除后不可恢复</span>
      <span slot="footer" class="dialog-footer">
        <button @click="dialogVisible1 = false">取 消</button>
        <button @click="sureDelete">确 定</button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
//  import Tab from 'components/common/tab'
  import Vue from 'vue'
  import {ERR_OK,score} from 'service/config'
  import {addTaskGroup,taskTypeupdate,deleteTaskGroup,getTaskGroupList,updateTaskGroup,addTaskType,taskGroupgetById,dragTaskGroup,dragTaskType} from '../../../service/getData'
  import Sortable from 'sortablejs'
  export default {
    data() {
      return {
        hello:true,
        dialogVisible: false,
        dialogVisible1: false,
        dialogVisible2: false,
        dialogVisible3:false,
        dialogVisible4:false,
        roleName:'总经理',
        taskGroupId:"",
        taskGroupId1:"",
        temp:{},
        addId:"",
        labelPosition: 'right',
        taskTypeId:"",
        index:"",
        ruleForm: {
          name: '',
          type: ''
        },
        formLabelAlign:{
          name: '',
          type: ''
        },
        formLabelAlign3:{
          name3: '',
      },
        formLabelAlign4:{
          name4: '',
        },
        rules: {
          name: [
            {required: true, message: '请填写任务类别名称'},
            { max: 20, message: '长度不能超过20字符'}
          ],
          name3:[
            {required: true, message: '请填写任务类别名称'},
            { max: 20, message: '长度不能超过20字符'}
          ],
          name4:[
            {required: true, message: '请填写任务类别名称'},
            { max: 20, message: '长度不能超过20字符'}
          ]
        },
        taskData:[],
        addMoneyData:[],
        editorData:[],
        addIdEditor:"",
        editor:false
      };
    },
    created(){
      this._getTaskGroupList()
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
      handleClose1(done) {
        this.dialogVisible1 = false
      },
      handleClose2(done) {
        this.dialogVisible2 = false
        this.$refs['ruleForm'].resetFields()
      },
      handleClose3(done) {
        this.dialogVisible3 = false
        this.$refs['formLabelAlign3'].resetFields()
      },
      handleClose4(done) {
        this.dialogVisible4 = false
        this.$refs['formLabelAlign4'].resetFields()
      },
      addTeam() {
        this.dialogVisible2 = true;
        this.addMoneyData = [];
        this.ruleForm.name=""
        this.editor=false;
      },
//      取消编辑
      cancelEditor(formName){
        this.dialogVisible = false
        this.$refs[formName].resetFields();
      },
//      确定编辑
      sureEditor(formName){
        var str = "";
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.editorData.length<=0){
              this.$notify({
                title: '提示',
                duration:3000,
                message: "请添加子任务类别"
              });
            }else{
              this.dialogVisible = false;
              let taskGroupName=this.ruleForm.name;
              let str="";
              for(var i=0;i<this.editorData.length;i++){
                str+= this.editorData[i].taskTypeId+','
                }
              var basic = str.substring(0, str.lastIndexOf(','));
              console.log(this.addId);
              this._updateTaskGroup(this.addId,taskGroupName,basic)
            }
          } else {
            return false;
          }
        });
      },
//      确定编辑
      _updateTaskGroup(taskGroupId,taskGroupName,taskTypeIds){
        var param={
          taskGroupId:taskGroupId,
          taskGroupName:taskGroupName,
          taskTypeIds:taskTypeIds
        }
        updateTaskGroup(param).then((res) =>{
          if(res.code==ERR_OK){
            this. _getTaskGroupList()
            this.$notify({
              title: '编辑任务类别',
              duration:3000,
              message: '编辑任务类别成功',
              type: 'success'
            });
          }else{
            this.$notify.error({
              title: '失败',
              duration:3000,
              message:res.msg,
            });
          }
        })
      },
//      取消添加任务类别
      cancelAdd(formName){
        this.dialogVisible2 = false
        this.$refs[formName].resetFields();
      },
//      添加分组类别
      addTypes(){
        this.dialogVisible4= true;
        this.editor=false;
      },
      addMoneyType(){
        this.dialogVisible3=true
      },
      checkType(item,index){
        this.dialogVisible4= true;
        this.formLabelAlign4.name4=item.taskTypeName;
        this.addIdEditor=item.taskTypeId
        this.editor=true;
        this.index=index;
      },
//      任务类别编辑
      editorGroup(id){
        this.dialogVisible = true;
        this._taskGroupgetById(id)
        this.addId=id;
      },
      _taskGroupgetById(id){
        var param={
          id:id
        }
        taskGroupgetById(param).then((res)=>{
          if(res.code==ERR_OK){
            this.editorData=res.data.typeEntitys
            this.ruleForm.name=res.data.taskGroupName
          }
        })
      },
//      确定添加任务类别
      sureAdd(formName){
        var str = "";
        var self=this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.addMoneyData.length<=0){
              this.$notify({
                title: '提示',
                duration:3000,
                message: "请添加子任务类别"
              });
              return
            }
            this.dialogVisible2 = false;
            let taskGroupName=this.ruleForm.name
            if(self.addMoneyData.length>0){
              for(var i=0;i<self.addMoneyData.length;i++){
                str += self.addMoneyData[i].taskTypeId+','
              }
            }
            let taskTypeIds=str;
            this._addTaskGroup(taskGroupName,taskTypeIds)
          } else {
            return false;
          }
        });
      },
      resetForm3(formName){
        this.dialogVisible3 = false
        this.$refs[formName].resetFields();
      },
      resetForm4(formName){
        this.dialogVisible4 = false
        this.$refs[formName].resetFields();
      },
      submitForm3(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogVisible3 = false
            var self=this;
            let param={
              taskTypeName:this.formLabelAlign3.name3,
              taskTypeScore:0
            }
            addTaskType(param).then(function (res) {
              if(res.code==ERR_OK){
                self.$notify({
                  title: '添加子任务类别',
                  message: '添加子任务类别成功',
                  duration:3000,
                  type: 'success'
                });
                self.addMoneyData.push(res.data)
                self.$refs[formName].resetFields();
              }else{
                self.$notify.error({
                  title: '失败',
                  duration:3000,
                  message:res.msg,
                });
              }
            })
          } else {
            return false;
          }
        });
      },
      submitForm4(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogVisible4 = false
            if(this.editor){
              var param={
                taskTypeId:this.addIdEditor,
                taskTypeName:this.formLabelAlign4.name4,
                taskTypeScore:0
              }
              taskTypeupdate(param).then((res) =>{
                if(res.code==ERR_OK){
                  if(this.editorData.length>0){
                    this.editorData[this.index].taskTypeName=this.formLabelAlign4.name4
                    Vue.set(this.editorData, this.index,this.editorData[this.index]);
                  }
                  if(this.addMoneyData.length>0){
                    this.addMoneyData[this.index].taskTypeName=this.formLabelAlign4.name4
                    Vue.set(this.addMoneyData, this.index,this.addMoneyData[this.index]);
                  }
                }else{
                  this.$notify.error({
                    title: '失败',
                    duration:3000,
                    message:res.msg
                  });
                }
              })
            }else{
              this._addTaskType(this.addId)
            }
          } else {
            return false;
          }
        });
      },
      _addTaskType(item){
        let param={
          taskTypeId:item,
          taskTypeName:this.formLabelAlign4.name4,
          taskTypeScore:0
        }
        addTaskType(param).then((res)=> {
          if(res.code==ERR_OK){
            this.$notify({
              title: '添加子任务类别',
              duration:3000,
              message: '添加子任务类别成功',
              type: 'success'
            });
            this.editorData.push(res.data)
            this.$refs['formLabelAlign4'].resetFields();
          }else{
            this.$notify.error({
              title: '失败',
              duration:3000,
              message:res.msg
            });
          }
        })
      },
//
//      添加任务类别
      _addTaskGroup(taskGroupName,taskTypeIds){
          var self=this;
        addTaskGroup({taskGroupName:taskGroupName,taskTypeIds:taskTypeIds}).then(function(res) {
          if(res.code == ERR_OK) {
            self._getTaskGroupList()
            self.$notify({
              title: '添加任务',
              duration:3000,
              message: '添加任务类别成功',
              type: 'success'
            });
          }else{
            self.$notify.error({
              title: '失败',
              duration:3000,
              message:res.msg,
            });
          }

        })
      },

//      删除任务类别
      deleteGroup(item,index){
        this.dialogVisible1 = true
        this.taskGroupId=item.taskGroupId
      },
//      确定删除任务类别
      sureDelete(){
        this.dialogVisible1 = false
        this._deleteTaskGroup()
      },
//      获取任务类别列表接口
      _getTaskGroupList(){
        var self=this;
        this.taskData=[]
        getTaskGroupList().then((res) => {
          if(res.code==ERR_OK){
            self.taskData=res.data;
            this.$nextTick(() => {
              this._dragTaskGroup()
              this.dragChildren()
            })
          }else{
            self.$notify.error({
              title: '失败',
              duration:3000,
              message:res.msg,
            });
          }
        })
      },
//      拖动
      _dragTaskGroup(){
        const el = document.querySelectorAll('.drag')[0]
        this.sortable = Sortable.create(el, {
          onEnd: evt => {
            var oldIndex=evt.oldIndex;
            var newIndex=evt.newIndex;
            if(oldIndex>newIndex){
              if(newIndex==0){
                this._dragTask(this.taskData[oldIndex].taskGroupId,'',this.taskData[newIndex].taskGroupId)
              }else{
                this._dragTask(this.taskData[oldIndex].taskGroupId,this.taskData[newIndex-1].taskGroupId,this.taskData[newIndex].taskGroupId)
              }
            }else{
              if(newIndex==0){
                this._dragTask(this.taskData[oldIndex].taskGroupId,'',this.taskData[newIndex].taskGroupId,4)
              }else if(newIndex==this.taskData.length-1){
                this._dragTask(this.taskData[oldIndex].taskGroupId,this.taskData[newIndex].taskGroupId,'',4)
              }else{
                if(newIndex>=this.taskData.length){
                  this._dragTask(this.taskData[oldIndex].taskGroupId,this.taskData[newIndex-1].taskGroupId,'',4)
                }else{
                  this._dragTask(this.taskData[oldIndex].taskGroupId,this.taskData[newIndex].taskGroupId,this.taskData[newIndex+1].taskGroupId,4)
                }
              }
            }
          }
        })
      },
//拖拽接口
      _dragTask(sourceTaskGroupId,targetBeforeTaskGroupId,targetAfterTaskGroupId){
          let param={
            sourceTaskGroupId:sourceTaskGroupId,
            targetBeforeTaskGroupId:targetBeforeTaskGroupId,
            targetAfterTaskGroupId:targetAfterTaskGroupId,
          }
        dragTaskGroup(param).then((res)=>{
          this._getTaskGroupList()
          if(res.code == ERR_OK){

          }else{
            this.$notify.error({
              title: '错误',
              message:res.msg
            });
          }
        })
      },
//      里面的容器拖动
      dragChildren(){
        const el = document.querySelectorAll('.dragChildren')
       for(let i=0;i<el.length;i++){
         this.sortable = Sortable.create(el[i], {
           onEnd: evt => {
             var oldIndex=evt.oldIndex;
             var newIndex=evt.newIndex;
             if(oldIndex>newIndex){
               if(newIndex==0){
                 this._dragTaskType(this.taskData[i].typeEntitys[oldIndex].taskTypeId,'',this.taskData[i].typeEntitys[newIndex].taskTypeId)
               }else{
                 this._dragTaskType(this.taskData[i].typeEntitys[oldIndex].taskTypeId,this.taskData[i].typeEntitys[newIndex-1].taskTypeId,this.taskData[i].typeEntitys[newIndex].taskTypeId)
               }
             }else{
               if(newIndex==0){
                 this._dragTaskType(this.taskData[i].typeEntitys[oldIndex].taskTypeId,'',this.taskData[i].typeEntitys[newIndex].taskTypeId)
               }else if(newIndex==this.taskData[i].typeEntitys.length-1){
                 this._dragTaskType(this.taskData[i].typeEntitys[oldIndex].taskTypeId,this.taskData[i].typeEntitys[newIndex].taskTypeId,'')
               }else{
                 if(newIndex>=this.taskData[i].typeEntitys.length){
                   this._dragTaskType(this.taskData[i].typeEntitys[oldIndex].taskTypeId,this.taskData[i].typeEntitys[newIndex-1].taskTypeId,'')
                 }else{
                   this._dragTaskType(this.taskData[i].typeEntitys[oldIndex].taskTypeId,this.taskData[i].typeEntitys[newIndex].taskTypeId,this.taskData[i].typeEntitys[newIndex+1].taskTypeId)
                 }
               }
             }
           }
         })
       }
      },
      _dragTaskType(sourceTaskTypeId,targetBeforeTaskTypeId,targetAfterTaskTypeId){
        let param={
          sourceTaskTypeId:sourceTaskTypeId,
          targetBeforeTaskTypeId:targetBeforeTaskTypeId,
          targetAfterTaskTypeId:targetAfterTaskTypeId,
        }
        dragTaskType(param).then((res)=>{
          this._getTaskGroupList()
          if(res.code == ERR_OK){

          }else{
            this.$notify.error({
              title: '错误',
              message:res.msg
            });
          }
        })
      },
//      删除任务类别接口
      _deleteTaskGroup(){
        var self=this;
        deleteTaskGroup({id:this.taskGroupId}).then(function(res){
          if(res.code==ERR_OK){
             self._getTaskGroupList()
            self.dialogVisible1 = false
          }else{
            self.$notify({
              title: '删除任务',
              duration:3000,
              message:res.msg,
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
    padding:0;
    list-style-type:none;
    font-size:0;
  }
  .setCenter-list ul li{
    float: left;
    min-height: 136px;
    width: 370px;
    margin-bottom: 20px;
    cursor: pointer;
    vertical-align:top;
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


  .role-button{
    float: right;
    width: 100px;
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
    height: 24px;
    line-height: 24px;
    margin-left: 19px;
    margin-right: 25px;
  }
  .populations-status{
    font-size: 14px;
    color: #7F7F7F;
    padding-top: 10px;
    padding-bottom: 10px;
    height: 150px;
    overflow: auto;
  }
  .populations-left{
    float: left;
    padding-top: 10px;
    padding-left: 20px;
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
  .delete_team{
    height: 50px;
    line-height: 60px;
    width: 100%;
    display: block;
    text-align: center;
  }
  .money-wrapper{
    overflow: hidden;
    padding-left: 15px;
    margin-top: 20px;
  }
  .reward-left,.reward-right,.reward-item,.add-money{
    float: left;
  }
  .reward-left{
   width: 100px;
    height:22px;
    line-height: 22px;
  }
  .reward-right{
    margin-left: 14px;
    width: 355px;
  }
  .reward-right .reward-item{
    height:22px;
    line-height: 22px;
    font-size: 14px;
    text-align: center;
    overflow: hidden;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    box-sizing: border-box;
    margin-bottom: 10px;
    margin-right: 20px;
  }
  .reward-item:hover{
    box-sizing: border-box;
    border: 1px solid rgba(0,0,0,0.12);
  }
  .add-money{
    height:22px;
    line-height: 22px;
    font-size: 12px;
    color: #D93437;
    padding-left: 6px;
    cursor: pointer;
    margin-bottom: 10px;
  }
  .add-money img{
    vertical-align: middle;
    display: inline-block;
    margin-bottom: 2px;
  }
  .typeNumber{
    margin-top: 20px;
  }
</style>
