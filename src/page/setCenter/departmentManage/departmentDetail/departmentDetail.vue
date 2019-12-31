<template>
  <div>
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <router-link to="/setCenter">
          <span class="child1">系统设置</span>
        </router-link>  /
        <router-link to="/departmentManage">
          <span class="child1">部门管理</span>
        </router-link> /
        <router-link to="/departmentDetail">
          <span class="child2">部门详情</span>
        </router-link>
      </div>
      <div class="role-title">
        <div class="role-num">
          角色：
          <el-select v-model="value1" placeholder="请选择角色" class="role-button" @change='changeRole'>
            <el-option
              v-for="item in options1"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
         </el-select>
        </div>
        <div class="role-num">
          团队：
          <el-select v-model="value2" placeholder="请选择团队" class="role-button" @change='changeTeam'>
           <el-option
             v-for="item in options2"
             :key="item.teamId"
             :label="item.teamName"
             :value="item.teamId">
           </el-option>
         </el-select>
        </div>
        <div class="role-num" style="">
          状态：<el-select v-model="value4" placeholder="请选择状态" class="role-button role-special" @change='changeStart'>
           <el-option
             v-for="item in options"
             :key="item.value"
             :label="item.label"
             :value="item.value">
           </el-option>
         </el-select>
        </div>
        <div class="role-button1" @click="showModel">
          设置任务组
        </div>
      </div>
      <div class="table-content">
        <el-table
         :data="result"
         style="width: 100%">
         <el-table-column
           prop="userName"
           label="姓名" width='120'>
           <template slot-scope="props">
             <router-link :to="{path:'/userDetail',  query:{id: props.row.userId}}"  >
                <span class="department-name">{{props.row.userName}}</span>
             </router-link>
           </template>
         </el-table-column>
         <el-table-column
           prop="roleName"
           label="角色" width='260'>
         </el-table-column>
         <el-table-column
           prop="teamName"
           label="团队">
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
           label="用户状态" width='120'>
           <template slot-scope="props">
              <span class="" v-if='props.row.enabled==true'>启用</span>
              <span class="department-name" v-if='props.row.enabled==false'>禁用</span>
           </template>
         </el-table-column>
         <el-table-column label="操作">
          <template slot-scope="props">
            <el-button
              size="small"
              @click="editorUser(props.row.userId)" v-if='props.row.userId==0' :disabled="true" class='disable-button'>编辑员工信息</el-button>
              <el-button
                size="small"
                @click="editorUser(props.row.userId)" v-else>编辑员工信息</el-button>
          </template>
        </el-table-column>
       </el-table>
      </div>
      <div class="pagination-depart" v-show='pagination'>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 15, 50]" :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <div class="">
      <el-dialog
        title="选择角色"
        :visible.sync="dialogVisible1"
        size="tiny"
        :before-close="handleClose1" top='10%' class="">
        <div class="permissions-table" >
          <div class="check-wrapper">
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="item in options6" :label="item.roleId" :key="item.roleId">{{item.roleName}}</el-checkbox>
            </el-checkbox-group>

          </div>
        </div>
        <span slot="footer" class="dialog-footer" style="margin-top:10px;">
          <button @click="dialogVisible1=false">取 消</button>
          <button @click="sureRole">确 定</button>
        </span>
      </el-dialog>
    </div>
    <div class="">
      <el-dialog title="选择团队" :visible.sync="dialogVisible6" size="tiny" :before-close="handleClose6" top='10%' class="">
        <div class="permissions-table">
          <div class="check-wrapper">
            <el-checkbox-group v-model="checkedCities6" @change="handleCheckedCitiesChange6">
              <el-checkbox v-for="item in options4" :label="item.teamId" :key="item.teamId">{{item.teamName}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <span slot="footer" class="dialog-footer" style="margin-top:10px;">
            <button @click="dialogVisible6=false">取 消</button>
            <button @click="sureTeam6">确 定</button>
          </span>
      </el-dialog>
    </div>
    <el-dialog
      title="部门包含任务组"
      :visible.sync="dialogVisibleS"
      size="tiny"
      :before-close="handleCloseS" top='25%' class="teamDetail">
      <div>
        <div class="dialog-content">
          <div class="check_content" v-for="(item,j) in data">
            <h3 class="title">
               <label class="ant-checkbox-wrapper">
                  <input type='checkbox' class='item-check-btn' v-model="item.checked" @click="selectAll(item,j)">
                  <span class="dept">{{item.taskGroupName}}</span>
              </label>
            </h3>
            <ul class="menu">
              <li v-for="(s,index) in item.typeEntitys" class="menu_children">
                <label class="ant-checkbox-wrapper">
                    <input type='checkbox' :value="index" v-model="s.checked" class='item-check-btn' @click="selectItem(item,s,index,j)">
                    <span class="dept">{{s.taskTypeName}}</span>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
      </el-form>
          <span slot="footer" class="dialog-footer">
              <button  @click="resetFormS('ruleFormS')">取 消</button>
              <button  @click="_addTeamUsers()">确定</button>
          </span>
    </el-dialog>
    <el-dialog
      title="编辑员工"
      :visible.sync="dialogVisible"
      size="tiny"
      :before-close="handleClose" top='10%' class="">
      <el-form :label-position="labelPosition" :rules="rules" ref="formLabelAlign" label-width="100px" :model="formLabelAlign">
        <el-form-item label="角色名：" style="margin-bottom:2px;margin-right:30px;">
         <span>{{formLabelAlign.role}}</span>
        </el-form-item>
        <el-form-item label="姓名：" required prop="name">
          <el-input v-model="formLabelAlign.name"></el-input>
        </el-form-item>
        <el-form-item label="角色：" required prop="type">
          <el-input  v-model="formLabelAlign.type" :disabled="true"  class="roleSelect"></el-input>
          <el-button style="float: left;width: 20%;text-align:center;" class="role-btn" @click='selectRole'>选择角色</el-button>
        </el-form-item>
        <el-form-item label="一级部门：" required prop="value10" >
          <el-select v-model="formLabelAlign.value10" style="width:100%;display:inline-block;" @change='changeDepart' @visible-change='changeVisibleDepart'>
            <el-option
              v-for="item in options3"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级部门：" v-if='deptLevel'>
          <el-select v-model="formLabelAlign.value20" style="width:100%;display:inline-block;">
            <el-option v-for="item in options77" :key="item.deptId" :label="item.deptName" :value="item.deptId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="团队："  prop="value11">
          <el-input v-model="formLabelAlign.value11" :disabled="true" class="roleSelect"></el-input>
          <el-button style="float: left;width: 20%;text-align:center;" class="role-btn" @click='selectTime'>选择团队</el-button>
        </el-form-item>
        <el-form-item label="电话：" required prop="tel">
          <el-input  v-model="formLabelAlign.tel"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" required prop="email">
          <el-input  v-model="formLabelAlign.email"></el-input>
        </el-form-item>
        <el-form-item label="底薪：" required prop="basicPay">
          <el-input v-model.number="formLabelAlign.basicPay"></el-input>
        </el-form-item>
        <el-form-item label="绩效工资：" prop="money">
          <el-input  v-model="formLabelAlign.money"></el-input>
        </el-form-item>
        <el-form-item label="状态：" required>
          <el-radio-group v-model="resource">
            <el-radio label="1" v-model="radio">启用</el-radio>
            <el-radio label="2" v-model="radio">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <button @click="resetForm('formLabelAlign')">取 消</button>
        <button @click="submitForm('formLabelAlign')">确 定</button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
//  import Tab from 'components/common/tab'
  import { departmentDetail, getUserList,updateDeptTaskType,listChildrenDepts,getDeptTaskGroup, editorUserDetail, departmentList, getRoleList, getTeamList, getUserDetail } from 'service/getData'
  import {ERR_OK} from 'service/config'
  export default {
    data() {
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入电话号码'));
        }
        setTimeout(() => {
          if (!(/^1[34578]\d{9}$/.test(value))) {
            callback(new Error('电话号码输入有误'));
          } else {
            callback();
          }
        }, 500);
      };
      //    绩效正则
      var checkAges = (rule, value, callback) => {
        if (!value) {
          return callback();
        }else{
          var reg = /(^(([1-9][0-9]*)|((([1-9][0-9]*)|0)\.[0-9]{1,2}))$)/;
          if (!reg.test(value)) {
            callback(new Error('请输入有效的绩效工资'));
          } else {
            if (value.length > 20) {
              callback(new Error('数值不能超过20个字符'));
            } else {
              callback();
            }
          }
        }
      };
//    底薪正则
      var checkbasicPay=(rule, value, callback) => {
        if (!value) {
          return callback(new Error('底薪不能为空'));
        }
        var reg = /(^(([1-9][0-9]*)|((([1-9][0-9]*)|0)\.[0-9]{1,2}))$)/;
        if (!reg.test(value)) {
          callback(new Error('请输入有效的底薪'));
        } else {
          if (value.length > 20) {
            callback(new Error('数值不能超过20个字符'));
          } else {
            callback();
          }
        }
      };
      return {
        dialogVisible: false,
        dialogVisible1: false,
        dialogVisible6: false,
        labelPosition: 'right',
        value1:'',
        value2:'',
        value4:'',
        result:[],
        pageSize:10,
        nowPage:1,
        total:100,
        radio:'1',
        resource:'1',
        data:[],
        deptLevel:false,
        dialogVisibleS:false,
        value20:'',
        options77:[],
        checkedCities6:[],
        checkedKey6:[],
        teamEditor:[],
        teamIdsStr1:'',
        checkedValue6:[],
        roleIdsStr:-1,
        roleIdsStr1:'',
        teamId:-1,
        userId:'',
        checked:false,
        pagination:true,
        checkedCities:[],
        checkedValue:[],
        checkedKey:[],
        formLabelAlign: {
          role:"张三",
          name: '',
          region: '',
          type: '',
          depart:'',
          basicPay:"",
          team:'',
          tel:'',
          email:'',
          money:'',
          value11:'',
          value10:'',
          value20:'',
        },
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: true,
          desc: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入姓名' },
          ],
          type: [
            { required: true, message: '请选择角色'},
          ],
          value11: [],
          value10: [
            { required: true, message: '请选择部门', type:'number' }
          ],
          email: [
            { required: true, message: '请输入邮箱号码', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],
          basicPay:[
            { validator: checkbasicPay }
          ],
          money: [
            { validator: checkAges }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          team: [
            { required: true, message: '请输入取消原因', trigger: 'blur' },
          ],
          tel: [
             { validator: checkAge, trigger: 'blur' }

          ],
          depart: [
            { required: true, message: '请输入公告内容'},
          ],
        },
        options1:[],
        options2:[],
        options3:[],
        options4:[],
        roleEditor:[],
        options6:[],
        options5: [{
          value: 'HTML',
          label: 'HTML'
        }, {
          value: 'CSS',
          label: 'CSS'
        }, {
          value: 'JavaScript',
          label: 'JavaScript'
        }],
        value10:"投研部",
        currentPage4: 1,
        options: [{
         value: 'true',
         label: '启用'
       }, {
         value: 'false',
         label: '禁用'
       }],
       id:'',
       value: '',
      };
    },
    created () {
      this.id =this.$route.query.id
    },
    components: {
//      Tab
    },
    mounted(){
      this.getRoleList1()
      this.getRoleList2()
      this.getTeamList1()
      this.getTeamList2()
      this.getDepartmentList()
      this.getDate(1,10,-1,-1)
    },
    methods: {
      //添加团队成员
      _addTeamUsers(){
        var self=this;
        let str="";
        var data=this.data;
        for(var key=0;key<data.length;key++){
            if(data[key].checked){
              for(var i in data[key].typeEntitys){
                if(data[key].typeEntitys[i].checked){
                  str+=data[key].typeEntitys[i].taskTypeId+","
                }
              }
            }
        }
        if(str!=""){
          updateDeptTaskType({deptId:this.id,taskTypeIds:str}).then(function (res) {
            if(res.code==ERR_OK){
              //self._getTeamUserInfo();
              self.dialogVisibleS = false
              self.getDate(1,10,-1,-1)
              self.$notify({
                title: '成功',
                message:"设置任务组成功",
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
              message: '请勾选任务组'
            });
        }
      },
      selectAll: function(item,index) {
        var self=this;
        item.checked=!item.checked
        //如果父级被选中，那么子集循环，全被给checked=true
        if(item.checked){
          self.data[index].check=true;
          item.typeEntitys.forEach(function(item,i){
            item.checked=true;
            self.data[index].typeEntitys[i].check=true;
          });
        }else{
          //相反，如果没有被选中，子集应该全部checked=false
          self.data[index].check=false;
          item.typeEntitys.forEach(function(item,i){
            item.checked=false;
            self.data[index].typeEntitys[i].check=true;
          });
        }
      },
      selectItem: function(item,s,index,i) {
        //父级选中条件
        //子集有选中的，那么父级checked=true
        //some检测的就是有一个满足的就为true
        s.checked=!s.checked
        item.checked=s.checked ? true : item.typeEntitys.some(a => a.checked);
        if(s.checked){
          this.data[i].check=true
          this.data[i].typeEntitys[index].check=true;
        }else{
          this.data[i].typeEntitys[index].check=false;
        }
      },
      resetFormS(){
        this.dialogVisibleS=false;
      },
      _getDptUserInfo(){
        var self=this;
        getDeptTaskGroup({deptId:this.id}).then(function (res) {
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
      showModel(){
        this.dialogVisibleS=true;
        this._getDptUserInfo()
      },
      //      编辑二级联动
        _getDepetTwoList2(val){
          var self=this;
          const params = {
            deptId:val
          }
          listChildrenDepts(params).then(function (res) {
            self.formLabelAlign.value20=''
            if(res.code==ERR_OK){
              if(res.data.length>0){
                self.deptLevel = true
              }else{
                self.deptLevel = false
              }
              self.options77=res.data;
            }else{
              self.$notify.error({
                title: '错误',
                message:res.msg,
              });
            }
          })
        },
      handleClose6(done) {
        this.dialogVisible6 = false
      },
      handleCloseS(done) {
        this.dialogVisibleS = false
      },
      handleCheckedCitiesChange6(val) {
        this.checkedValue6 = val
        console.log(this.checkedValue6)
      },
      sureTeam6() {
        this.dialogVisible6 = false
        var j = 0;
        for (var i = 0; i < this.options4.length; i++) {
          for (var k = 0; k < this.checkedValue6.length; k++) {
            if (this.options4[i].teamId == this.checkedValue6[k]) {
              this.checkedKey6[j] = this.options4[i].teamName;
              ++j;
            }
          }
        }
        this.teamEditor = this.checkedValue6
        if(this.checkedValue6.length>0){
          this.checkedKey6 = this.checkedKey6.join()
          this.checkedValue6 = this.checkedValue6.join()
          this.checkedKey6 = this.checkedKey6.replace(/,/g, "+")
          this.formLabelAlign.value11 = this.checkedKey6
        }else{
          this.formLabelAlign.value11 = ""
        }
      },
      selectTime(){
        this.checkedCities6 = this.teamEditor
        this.checkedKey6 = []
        this.checkedValue6 = this.teamEditor
        this.dialogVisible6 = true
      },
      handleClose(done) {
        this.dialogVisible = false
        this.$refs['formLabelAlign'].resetFields()
      },
      handleClose1(done) {
        this.dialogVisible1 = false
      },
      selectRole () {
        this.checkedCities = this.roleEditor
        this.checkedValue = this.roleEditor
        this.checkedKey = []
        this.dialogVisible1 = true
      },
      handleCheckedCitiesChange(val){
        this.checkedValue = val
      },
      sureRole () {
        if(this.checkedValue.length==0){
          this.$notify.info({
            title: '提示',
            message: '请勾选角色'
          });
        }else{
          this.dialogVisible1 = false
          var j = 0;
          for(var i=0;i<this.options6.length;i++){
            for(var k=0;k<this.checkedValue.length;k++){
             if(this.options6[i].roleId==this.checkedValue[k]){
              this.checkedKey[j]=this.options6[i].roleName;
              ++j;
             }
            }
          }
          this.roleEditor = this.checkedValue
          this.checkedKey=this.checkedKey.join()
          this.checkedValue = this.checkedValue.join()
          this.checkedKey = this.checkedKey.replace(/,/g, "+")
          this.formLabelAlign.type = this.checkedKey
        }
      },
      changeVisibleDepart(val){
        if(val==false){
          this._getDepetTwoList2(this.formLabelAlign.value10)
        }
      },
      editorUser (val) {
        this.dialogVisible = true
        this.radio = '1'
        this.resource = '1'
        let self = this
        this.userId =  val
        const params = {
          id:val
        }
        getUserDetail(params).then((res) => {
          if(res.code == ERR_OK) {
            self.formLabelAlign.role = res.data.roleName.split(',')[0]
            self.formLabelAlign.name = res.data.userName
            self.formLabelAlign.tel = res.data.telephone
            self.formLabelAlign.email = res.data.email
            self.formLabelAlign.money = res.data.meritPay
            self.roleIdsStr1 = res.data.roleIdsStr
            self.teamIdsStr1 = res.data.teamIdsStr
            self.formLabelAlign.basicPay=res.data.basicPay
            var arr = res.data.deptTreeIds.split(',');
            var deptLevel = res.data.deptLevel
            if(res.data.deptLevel=='LEVEL_TWO'){
                self.formLabelAlign.value10 = parseInt(arr[1]);
                self.formLabelAlign.value20 = parseInt(arr[2]);
                self.deptLevel = true

            }else{
                self.formLabelAlign.value10 = parseInt(arr[1]);
                self.deptLevel = false
            }
            const params={
              deptId:self.formLabelAlign.value10
            }
            listChildrenDepts(params).then(function (res) {
              self.formLabelAlign.value20=''
              if(res.code==ERR_OK){
                if(res.data.length>0){
                  self.options77=res.data;
                  self.deptLevel = true
                  if(deptLevel=='LEVEL_TWO'){
                    self.formLabelAlign.value20 = parseInt(arr[2]);
                  }
                }else{
                  self.deptLevel = false
                }

              }
            })
            if(res.data.teamName){
              self.checkedValue6=res.data.teamIdsStr
              self.formLabelAlign.value11 = res.data.teamName.replace(/,/g, "+")
              self.teamEditor = []
              self.teamEditor = res.data.teamIdsStr.split(',')
              self.teamEditor  = JSON.parse('[' + String(self.teamEditor ) + ']')
            }else{
              self.formLabelAlign.value11=""
              self.checkedValue6=[]
              self.teamEditor = []
              self.teamEditor.push(res.data.teamIdsStr)
              self.teamEditor  = JSON.parse('[' + String(self.teamEditor ) + ']')
            }
            if(res.data.roleName.indexOf(',') != -1){
              self.formLabelAlign.type = res.data.roleName.replace(/,/g, "+")
              self.roleEditor = []
              self.roleEditor = res.data.roleIdsStr.split(',')
              self.roleEditor  = JSON.parse('[' + String(self.roleEditor ) + ']')
              self.formLabelAlign.type = self.formLabelAlign.type.substring(0,self.formLabelAlign.type.length-1)
            }else{
              self.formLabelAlign.type = res.data.roleName
              self.roleEditor = []
              self.roleEditor.push(res.data.roleIdsStr)
              self.roleEditor  = JSON.parse('[' + String(self.roleEditor ) + ']')
            }
            if(res.data.enabled == true){
              self.radio = '1'
              self.resource = '1'
            }else{
              self.radio = '2'
              self.resource = '2'
            }
          }
       })
      },
      getDate(nowPage,pageShow,roleIdsStr,teamId,enabled){
        let self = this
        const params = {
          deptId:this.id,
          nowPage:nowPage,
          pageShow:pageShow,
          roleIdsStr:roleIdsStr,
          teamId:teamId,
          enabled:enabled
        }
        getUserList (params).then((res) => {
          if(res.code == ERR_OK) {
            self.result = res.data.result
            self.total = res.data.totalCount
            if(res.data.result.length==0){
              self.pagination = false
            }else{
              self.pagination = true
            }
          }
       })
     },
     getRoleList1(){
       let self = this
       getRoleList().then((res) => {
         if(res.code == ERR_OK) {
           let data = res
           self.options1 = data.data.result
           self.options1.unshift({
            roleId:-1,
            roleName: '请选择角色'
          })
         }
      })
    },
    getRoleList2(){
      let self = this
      getRoleList().then((res) => {
        if(res.code == ERR_OK) {
          let data = res
          self.options6 = data.data.result

        }
     })
   },
    getDepartmentList (){
      let self = this
      departmentList().then((res) => {
        if(res.code == ERR_OK) {
          let data = res
          self.options3 = data.data.result
          self.options3.unshift({
           deptId:'',
           deptName: '请选择部门'
         })
        }
     })
    },
    getTeamList1(){
      let self = this
      getTeamList().then((res) => {
        if(res.code == ERR_OK) {
          let data = res
          self.options2 = data.data
          self.options2.unshift({
           teamId:-1,
           teamName: '请选择团队'
         })

        }
     })
    },
    getTeamList2(){
      let self = this
      getTeamList().then((res) => {
        if(res.code == ERR_OK) {
          let data = res
          self.options4 = data.data
        }
     })
    },
    submitForm(formName) {
      let self = this
      if (this.checkedValue.length>0){
        var roleIdsStr = this.checkedValue
      }else{
        var roleIdsStr = self.roleIdsStr1
      }
      var teamIdsStr = self.checkedValue6
      var enabled
      if(self.resource==1){
        enabled = true
      }else{
        enabled = false
      }
      var deptIdStr;
      if(self.formLabelAlign.value20 == ''){
        deptIdStr = self.formLabelAlign.value10
      }else if(self.formLabelAlign.value20 != ''&&this.deptLevel==true){
        deptIdStr = self.formLabelAlign.value20
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            userName:self.formLabelAlign.name,
            roleIdsStr:roleIdsStr,
            deptId:deptIdStr,
            teamIdsStr:teamIdsStr,
            basicPay:self.formLabelAlign.basicPay,
            telephone:self.formLabelAlign.tel,
            email:self.formLabelAlign.email,
            meritPay:self.formLabelAlign.money,
            enabled:enabled,
            userId:self.userId
          }
          editorUserDetail(params).then((res) => {
            if(res.code == ERR_OK) {
              this.dialogVisible = false
              this.$notify({
                title: '成功',
                message: '成功编辑该员工信息',
                type: 'success'
              });
              self.formLabelAlign.value11=""
              this.getDate(self.nowPage,self.pageSize,self.roleIdsStr,self.teamId,self.value4)
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
    resetForm(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields();
    },
    changeRole (val) {
      this.roleIdsStr = val
      if(this.value4==''){
        this.getDate(1,this.pageSize,this.roleIdsStr,this.teamId)
      }else{
        this.getDate(1,this.pageSize,this.roleIdsStr,this.teamId,this.value4)
      }
    },
    changeRole1 (val) {
      this.formLabelAlign.value11 = val
    },
    changeTeam (val){
       this.teamId = val
       if(this.value4==''){
         this.getDate(1,this.pageSize,this.roleIdsStr,this.teamId)
       }else{
         this.getDate(1,this.pageSize,this.roleIdsStr,this.teamId,this.value4)
       }
    },
    changeDepart (val) {
      this.formLabelAlign.value10 = val
    },
    changeStart (val) {
      if(this.value4==''){
        this.getDate(1,this.pageSize,this.roleIdsStr,this.teamId)
      }else{
        this.getDate(1,this.pageSize,this.roleIdsStr,this.teamId,this.value4)
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      if(this.value4==''){
        this.getDate(1,this.pageSize,this.roleIdsStr,this.teamId)
      }else{
        this.getDate(1,this.pageSize,this.roleIdsStr,this.teamId,this.value4)
      }
    },
    handleCurrentChange(val) {
      this.nowPage = val
      //this.getDate(val,this.pageSize)
      if(this.value4==''){
        this.getDate(val,this.pageSize,this.roleIdsStr,this.teamId)
      }else{
        this.getDate(val,this.pageSize,this.roleIdsStr,this.teamId,this.value4)
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
  background: #FFFFFF;
  border-radius: 4px;
  font-size: 12px;
  color: #333333;
  margin-top: 8px;
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
  .roleSelect{
    float: left;
    width: 80%
  }
.role-btn{
  background: #D93437;
  border: 1px solid #E0E0E0;
  font-size: 14px;
  color: #FFFFFF;
}
.department-name{
  color: #DA3438;
  cursor: pointer;
}
.check-wrapper{
  float: left;
  overflow: hidden;

}
.permissions-table{
  overflow: hidden;
}

.check-wrapper .el-checkbox{
  float: left;
}
.check-wrapper .el-checkbox:nth-child(2n+1){
  float: left;
  margin-left: 100px;
  width: 230px;
    margin-bottom: 15px;
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


.dialog-content{
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
