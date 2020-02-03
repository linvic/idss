<template>
  <div>
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <router-link to="/setCenter">
          <span class="child1">系统设置</span>
        </router-link> /
        <router-link to="/setCenter/rewardManage">
         <span class="child2">奖惩管理</span>
        </router-link>
      </div>
      <div class="role-title">
        <div class="role-num">
          <div class="project-name">
            奖惩管理
          </div>

        </div>
        <div class="role-button" @click='addTeam'>
          添加奖赏组
        </div>
      </div>
      <div class="setCenter-list-wrapper">
        <div class="setCenter-list">
        <ul>
          <li v-for="item in result">
            <div class="role-name">
                <div class="role-left ellipsis">
                  {{item.rpName}}
                </div>
                <div class="role-right">
                  <i class="el-icon-edit"  @click="iconEditor(item.rpTypeId)"></i>
                  <i class="el-icon-delete"  @click="iconDelete(item.rpTypeId)"></i>
                </div>
              </div>

              <div class="role-content">
                <div class="populations-status">
                  <div class="populations-left" v-for='i in item.rpAmounts'>
                    {{i.rpAmountName}}：{{i.amount}}
                  </div>
                </div>
              </div>
          </li>

        </ul>
      </div>
      </div>
    </div>
    <el-dialog
      title="奖惩组编辑"
      :visible.sync="dialogVisible"
      width="560px"
      :before-close="handleClose" top='25%' class="department department1">
      <el-form :label-position="labelPosition" ref="formLabelAlign" :rules="rules" label-width="120px" :model="formLabelAlign">
        <el-form-item label="奖惩名称：" required prop="name">
          <el-input v-model="formLabelAlign.name"></el-input>
        </el-form-item>
        <div class="money-wrapper">
          <div class="reward-left">
            奖惩金额：
          </div>
          <div class="reward-right">
            <div class="reward-item" v-for='(m,index) in editorMoneyData' @click="editorMoney(m,index)">
              {{m.rpAmountName}}
            </div>
            <div class="add-money" @click="addPlus4">
              <img src="../../../images/add.png" alt="">
              添加
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <button @click="resetForm('formLabelAlign')">取 消</button>
        <button @click="editorType('formLabelAlign')">确 定</button>
      </span>
    </el-dialog>
    <div class="">
      <el-dialog
        title="添加金额"
        :visible.sync="dialogVisible3"
        width="560px"
        :before-close="handleClose3" top='25%' class="department department1">
        <el-form :label-position="labelPosition" ref="formLabelAlign3" :rules="rules" label-width="120px" :model="formLabelAlign3">
          <el-form-item label="名称：" required prop="name3">
            <el-input v-model="formLabelAlign3.name3"></el-input>
          </el-form-item>
          <el-form-item label="金额：" required prop="region3">
            <el-input v-model.number="formLabelAlign3.region3"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <button @click="resetForm3('formLabelAlign3')">取 消</button>
          <button @click="submitForm3('formLabelAlign3')">保 存</button>
        </span>
      </el-dialog>
    </div>
    <div class="">
      <el-dialog
        title="添加金额"
        :visible.sync="dialogVisible4"
        width="560px"
        :before-close="handleClose4" top='25%' class="department department1">
        <el-form :label-position="labelPosition" ref="formLabelAlign4" :rules="rules" label-width="120px" :model="formLabelAlign4">
          <el-form-item label="名称：" required prop="name4">
            <el-input v-model="formLabelAlign4.name4"></el-input>
          </el-form-item>
          <el-form-item label="金额：" required prop="region4">
            <el-input v-model.number="formLabelAlign4.region4"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <button @click="resetForm4('formLabelAlign4')">取 消</button>
          <button @click="submitForm4('formLabelAlign4')">保 存</button>
        </span>
      </el-dialog>
    </div>
    <!-- 编辑金额的点击编辑 -->
    <div class="">
      <el-dialog
        title="编辑金额"
        :visible.sync="dialogVisible5"
        width="560px"
        :before-close="handleClose5" top='25%' class="department department1">
        <el-form :label-position="labelPosition" ref="formLabelAlign5" :rules="rules" label-width="120px" :model="formLabelAlign5">
          <el-form-item label="名称：" required prop="name5">
            <el-input v-model="formLabelAlign5.name5"></el-input>
          </el-form-item>
          <el-form-item label="金额：" required prop="region5">
            <el-input v-model.number="formLabelAlign5.region5"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <button @click="resetForm5('formLabelAlign5')">取 消</button>
          <button @click="submitForm5('formLabelAlign5')">保 存</button>
        </span>
      </el-dialog>
    </div>
    <!-- 新增金额的点击编辑 -->
    <div class="">
      <el-dialog
        title="编辑金额"
        :visible.sync="dialogVisible6"
        width="560px"
        :before-close="handleClose6" top='25%' class="department department1">
        <el-form :label-position="labelPosition" ref="formLabelAlign6" :rules="rules" label-width="120px" :model="formLabelAlign6">
          <el-form-item label="名称：" required prop="name6">
            <el-input v-model="formLabelAlign6.name6"></el-input>
          </el-form-item>
          <el-form-item label="金额：" required prop="region6">
            <el-input v-model.number="formLabelAlign6.region6"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <button @click="resetForm6('formLabelAlign6')">取 消</button>
          <button @click="submitForm6('formLabelAlign6')">保 存</button>
        </span>
      </el-dialog>
    </div>
    <el-dialog
      title="添加奖惩组"
      :visible.sync="dialogVisible2"
      width="560px"
      :before-close="handleClose2" top='25%' class="department department1">
      <el-form :label-position="labelPosition" ref="formLabelAlign2" :rules="rules" label-width="120px" :model="formLabelAlign2">
        <el-form-item label="奖惩名称：" required prop="name2">
          <el-input v-model="formLabelAlign2.name2"></el-input>
        </el-form-item>
        <div class="money-wrapper">
          <div class="reward-left">
            奖惩金额：
          </div>
          <div class="reward-right">
            <div class="reward-item" v-for='(m,index) in addMoneyData' @click="checkType(m,index)">
              {{m.rpAmountName}}
            </div>
            <div class="add-money" @click="addPlus3">
              <img src="../../../images/add.png" alt="">
              添加
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <button @click="resetForm2('formLabelAlign2')">取 消</button>
        <button @click="addType('formLabelAlign2')">确 定</button>
      </span>
    </el-dialog>
    <el-dialog
      title="删除奖赏类型"
      :visible.sync="dialogVisible1"
      width="560px"
      :before-close="handleClose1" top='25%' class="department deleteDepartment">
      <span>确定删除该奖赏类型吗？删除后不可恢复</span>
      <span slot="footer" class="dialog-footer">
        <button @click="dialogVisible1 = false">取 消</button>
        <button @click="deleteReward">确 定</button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
//  import Tab from 'components/common/tab'
  import { getRewardList, deleteRewardList, createRewardType, addRewardType, getRewardMoney, editorRewardType, clickEditorMoney,sureEditorMoney } from 'service/getData'
  import {ERR_OK} from 'service/config'
  export default {
    data() {
      return {
        hello:true,
        dialogVisible: false,
        dialogVisible1: false,
        dialogVisible2: false,
        dialogVisible3: false,
        dialogVisible4:false,
        dialogVisible5:false,
        dialogVisible6:false,
        editor:false,
        roleName:'总经理',
        rpTypeId:'',
        rpAmountId:'',
        result:'',
        value:'',
        addId:'',
        taskTypeId:"",
        index:"",
        valueName:'',
        labelPosition: 'right',
        formLabelAlign3: {
          name3: '',
          region3: '',
          type: ''
        },
        formLabelAlign4: {
          name4: '',
          region4: '',
          type: ''
        },
        formLabelAlign5: {
          name5: '',
          region5: '',
          type: ''
        },
        formLabelAlign6: {
          name6: '',
          region6: '',
          type: ''
        },
        formLabelAlign2: {
          name2: '',
        },
        formLabelAlign: {
          name: '',
          region: '',
          type: ''
        },
        addMoneyData:[],
        editorMoneyData:[],
        rules: {
          name2: [
            { required: true, message: '请填写奖惩名称' },
            {  max: 20, message: '奖惩名称不得超过20个字符' }
          ],
          name3: [
            { required: true, message: '请填写金额名称'},
            {  max: 20, message: '金额名称不得超过20个字符' }
          ],
          region3: [
            { required: true, message: '金额不能为空'},
            { type: 'number', message: '金额必须为数字值'}
          ],
          name4: [
            { required: true, message: '请填写金额名称' },
            {  max: 20, message: '金额名称不得超过20个字符' }
          ],
          region4: [
            { required: true, message: '金额不能为空'},
            { type: 'number', message: '金额必须为数字值'}
          ],
          name5: [
            { required: true, message: '请填写金额名称'},
            {  max: 20, message: '金额名称不得超过20个字符' }
          ],
          region5: [
            { required: true, message: '金额不能为空'},
            { type: 'number', message: '金额必须为数字值'}
          ],
          name6: [
            { required: true, message: '请填写金额名称'},
            {  max: 20, message: '金额名称不得超过20个字符' }
          ],
          region6: [
            { required: true, message: '金额不能为空'},
            { type: 'number', message: '金额必须为数字值'}
          ],
          name: [
            { required: true, message: '请填写金额名称'},
            {  max: 20, message: '金额名称不得超过20个字符' }
          ],
          region: [
            { required: true, message: '金额不能为空'},
            { type: 'number', message: '金额必须为数字值'}
          ],
          name1: [
            { required: true, message: '请填写金额名称'},
            {  max: 20, message: '金额名称不得超过20个字符' }
          ],
          desc1: [
            { required: true, message: '请填写金额描述' },
          ],
          region1: [
            { required: true, message: '请选择活动区域' }
          ],
        },
      };
    },
    components: {
//      Tab
    },
    mounted () {
      this.getData();
      this.formLabelAlign3.name3 = ''
      this.formLabelAlign2.name2 = ''
      this.formLabelAlign3.region3 = ''
      this.formLabelAlign4.name4 = ''
      this.formLabelAlign4.region4 = ''
    },
    methods: {
      addPlus3(){
        this.dialogVisible3= true
        this.formLabelAlign3.name3 = ''
        this.formLabelAlign3.region3 = ''
      },
      addPlus4(){
        this.dialogVisible4= true
        this.formLabelAlign4.name4 = ''
        this.formLabelAlign4.region4 = ''

      },
      checkType(item,index){
        this.dialogVisible6= true;
        this.formLabelAlign6.name6=item.rpAmountName;
        this.formLabelAlign6.region6=item.amount;
        this.addId=item.rpAmountId
        this.editor=true;
        this.index=index;
      },
      //初始化数据
      getData () {
        let self = this
        getRewardList().then((res) => {
          if(res.code == ERR_OK) {
            let data = res
            this.result = data.data.result
          }
       })
      },
      addType (formName) {
        let self = this
        var str = "";
        if(self.addMoneyData.length<=0&&this.formLabelAlign2.name2!=''){
          str = ""
        }else if(self.addMoneyData.length>0){
          for(var i=0;i<self.addMoneyData.length;i++){
            str += self.addMoneyData[i].rpAmountId+','
          }
        }
        const params = {
          rpName:this.formLabelAlign2.name2,
          reAmountIds:str
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addRewardType (params).then((res) => {
              if(res.code == ERR_OK) {
                this.dialogVisible2 = false
                self.getData()
                this.$notify({
                  title: '成功',
                  message: '添加奖惩组成功',
                  type: 'success'
                });
              }else{
                this.$notify.error({
                  title: '提示',
                  message: res.msg
                });
              }
           })
          } else {
            return false;
          }
        });
      },
      editorType (formName) {
        let self = this
        var str = "";
        if(self.editorMoneyData.length>0){
          for(var i=0;i<self.editorMoneyData.length;i++){
            str += self.editorMoneyData[i].rpAmountId+','
          }
        }
        const params = {
          rpName:this.formLabelAlign.name,
          reAmountIds:str,
          rpTypeId:this.value
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            editorRewardType (params).then((res) => {
              if(res.code == ERR_OK) {
                this.dialogVisible = false
                self.getData()
                this.$notify({
                  title: '成功',
                  message: '编辑奖惩类型成功',
                  type: 'success'
                });
              }else{
                this.$notify.error({
                  title: '提示',
                  message: res.msg
                });
              }
           })
          } else {
            return false;
          }
        });
      },
      resetForm2(formName) {
        this.dialogVisible2 = false
        this.$refs[formName].resetFields();
      },
      resetForm(formName) {
        this.dialogVisible = false
        this.$refs[formName].resetFields();
      },
      delete1 (val) {
        this.dialogVisible1 = true
        this.roleName = val
      },
      iconDelete (val) {
        this.dialogVisible1 = true
        this.rpTypeId = val
      },
      iconEditor (val) {
        this.dialogVisible = true
        this.value = val
        let self = this
        const params = {
          id:val
        }
        getRewardMoney (params).then((res) => {
          if(res.code == ERR_OK) {
            self.formLabelAlign.name = res.data.rpName
            self.editorMoneyData = res.data.rpAmounts
          }
       })
      },
      handleClose(done) {
        this.dialogVisible = false
        this.$refs['formLabelAlign'].resetFields();
      },
      handleClose1(done) {
        this.dialogVisible1 = false
      },
      handleClose2(done) {
        this.dialogVisible2 = false
        this.$refs['formLabelAlign2'].resetFields();
      },
      handleClose3(done) {
        this.dialogVisible3 = false
        this.$refs['formLabelAlign3'].resetFields();
      },
      handleClose4(done) {
        this.dialogVisible4 = false
        this.$refs['formLabelAlign4'].resetFields();
      },
      handleClose5(done) {
        this.dialogVisible5 = false
        this.$refs['formLabelAlign5'].resetFields();
      },
      handleClose6(done) {
        this.dialogVisible6 = false
        this.$refs['formLabelAlign6'].resetFields();
      },
      deleteReward () {
        let self = this
        const params = {
          id:self.rpTypeId
        }
        deleteRewardList(params).then((res) => {
          if(res.code == ERR_OK) {
            self.dialogVisible1 = false
            self.getData()
          }else{
            self.$notify.error({
              title: '提示',
              message:res.msg
            });
          }
       })
      },
      submitForm3(formName) {
        let self = this
        const params = {
          rpAmountName:self.formLabelAlign3.name3,
          amount: self.formLabelAlign3.region3
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            createRewardType (params).then((res) => {
              if(res.code == ERR_OK) {
                this.dialogVisible3 = false
                this.$refs['formLabelAlign3'].resetFields()
                self.addMoneyData.push(res.data)
                this.$notify({
                  title: '成功',
                  message: '添加金额成功',
                  type: 'success'
                });
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

      resetForm3(formName) {
        this.dialogVisible3 = false
        this.$refs[formName].resetFields();
      },
      // 编辑的模态框
      submitForm4(formName) {
        let self = this
        const params = {
          rpAmountName:self.formLabelAlign4.name4,
          amount: self.formLabelAlign4.region4
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            createRewardType (params).then((res) => {
              if(res.code == ERR_OK) {
                this.dialogVisible4 = false
                this.$refs['formLabelAlign4'].resetFields()
                self.editorMoneyData.push(res.data)
                this.$notify({
                  title: '成功',
                  message: '添加金额成功',
                  type: 'success'
                });
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
      resetForm4(formName) {
        this.dialogVisible4 = false
        this.$refs[formName].resetFields();
      },
      submitForm5(formName) {
        let self = this
        const params = {
          rpAmountName:self.formLabelAlign5.name5,
          amount: self.formLabelAlign5.region5,
          rpAmountId: self.addId
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            sureEditorMoney (params).then((res) => {
              if(res.code == ERR_OK) {
                self.dialogVisible5 = false
                self.editorMoneyData[this.index].rpAmountName=self.formLabelAlign5.name5
                self.editorMoneyData[this.index].amount=self.formLabelAlign5.region5
                self.editorMoneyData[this.index].rpAmountId=self.addId
                self.$notify({
                  title: '成功',
                  message: '编辑金额成功',
                  type: 'success'
                });
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
      resetForm5(formName) {
        this.dialogVisible5 = false
        this.$refs[formName].resetFields();
      },
      submitForm6(formName) {
        let self = this
        const params = {
          rpAmountName:self.formLabelAlign6.name6,
          amount: self.formLabelAlign6.region6,
          rpAmountId: self.addId
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            sureEditorMoney (params).then((res) => {
              if(res.code == ERR_OK) {
                this.dialogVisible6 = false
                this.addMoneyData[this.index].rpAmountName = self.formLabelAlign6.name6
                this.addMoneyData[this.index].amount = self.formLabelAlign6.region6
                this.addMoneyData[this.index].rpAmountId = self.addId
                this.$notify({
                  title: '成功',
                  message: '编辑金额成功',
                  type: 'success'
                });
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
      resetForm6(formName) {
        this.dialogVisible6 = false
        this.$refs[formName].resetFields();
      },
      editorMoney (item,index) {
        this.dialogVisible5= true
        this.formLabelAlign5.name5=item.rpAmountName
        this.formLabelAlign5.region5=item.amount
        this.addId=item.rpAmountId
        this.editor=true
        this.index=index
       //  const params = {
       //    id:val
       //  }
       //  let self = this
       //  this.dialogVisible5 = true
       //  clickEditorMoney (params).then((res) => {
       //    if(res.code == ERR_OK) {
       //      self.formLabelAlign5.name5 = res.data.rpAmountName
       //      self.formLabelAlign5.region5 = res.data.amount
       //      self.rpAmountId = res.data.rpAmountId
       //    }
       // })
      },
      addTeam() {
        this.formLabelAlign2.name2 = ''
        this.dialogVisible2 = true
        this.addMoneyData = []
        this.editor=false
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
  .role-button{
    float: right;
    width: 114px;
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
    // height:50px;
    line-height: 34px;
    font-size: 14px;
    color: #7F7F7F;
    margin-top: 6px;
  }
  .populations-status .populations-left:nth-child(3n+1){
    float: left;
    margin-left: 15px;
    width: 124px;
  }
  .populations-status .populations-left:nth-child(3n+2){
    width: 117px;
  }
  .populations-status .populations-left{
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
  .money-wrapper{
    overflow: hidden;
  }
  .dialog-footer button:last-child{
    color: #D93437;
    border: 1px solid #D83436;
  }
  .reward-left,.reward-right,.reward-item,.add-money{
    float: left;
  }
  .money-wrapper{
    padding-left: 37px;
  }
  .reward-right{
    margin-left: 14px;
    width: 392px;
  }
  .reward-right .reward-item{
    width: 48px;
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
  .reward-item:nth-child(3n+2){
    margin: 0 111px;
  }
  .add-money img{
    vertical-align: middle;
    display: inline-block;
    margin-bottom: 2px;
  }
</style>
