<template>
<div>
  <!--<tab></tab>-->
  <div class="wrapper">
    <div class="router-wrapper">
      <router-link to="/setCenter"><span class="child1">系统设置</span></router-link><span>/</span>
      <router-link to="/role"> <span class="child1">角色管理</span></router-link>
       <span>/</span><span class="child2">角色详情</span>
    </div>
    <div class="role-title">
      <div class="role-num" style="margin-right:10px !important;">
        部门：
        <el-select v-model="value2" placeholder="一级部门" class="role-button" @change='changeDepart'>
          <el-option v-for="item in options2" :key="item.deptId" :label="item.deptName" :value="item.deptId">
          </el-option>
        </el-select>
      </div>
      <div class="role-num" style="margin-right:35px;margin-left:10px !important;">
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
        团队：
        <el-select v-model="value3" placeholder="请选择团队" class="role-button" @change='changeTeam'>
          <el-option v-for="item in options3" :key="item.teamId" :label="item.teamName" :value="item.teamId">
          </el-option>
        </el-select>
      </div>
      <div class="role-num" style="margin-left:43px;">
        状态：
        <el-select v-model="value4" placeholder="请选择状态" class="role-button" @change='changeStart'>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="table-content">
      <el-table :data="result" style="width: 100%">
        <el-table-column prop="userName" label="姓名">
          <template slot-scope="props">
             <router-link to="/userDetail">
               <span class="department-name">{{props.row.userName}}</span>
             </router-link>
           </template>
        </el-table-column>
        <!--<el-table-column prop="roleName" label="角色">-->
        <!--</el-table-column>-->
        <el-table-column prop="deptName" label="部门">
        </el-table-column>
        <el-table-column prop="teamName" label="团队">
        </el-table-column>
        <el-table-column prop="telephone" label="电话">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="enabled" label="用户状态" width="100">
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

              <!-- <button type="button" name="button" @click='delete'>删除</button> -->
              <!-- <el-button
                size="small" @click='deleteUser(props.row.userId)'>删除</el-button> -->
          </template>

        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-depart" v-show='pagination'>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 15, 50]" :page-size=pageSize layout="total, sizes, prev, pager, next, jumper" :total=total>
      </el-pagination>
    </div>
    <div class="">
      <el-dialog title="选择角色" :visible.sync="dialogVisible2" size="tiny" :before-close="handleClose2" top='10%' class="">
        <div class="permissions-table">
          <div class="check-wrapper">
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="item in options6" :label="item.roleId" :key="item.roleId">{{item.roleName}}</el-checkbox>
            </el-checkbox-group>

          </div>
        </div>
        <span slot="footer" class="dialog-footer" style="margin-top:10px;">
            <button @click="dialogVisible2=false">取 消</button>
            <button @click="sureRole">确 定</button>
          </span>
      </el-dialog>
    </div>
    <div class="">
      <el-dialog title="选择角色" :visible.sync="dialogVisible4" size="tiny" :before-close="handleClose4" top='10%' class="">
        <div class="permissions-table">
          <div class="check-wrapper">
            <el-checkbox-group v-model="checkedCities4" @change="handleCheckedCitiesChange4">
              <el-checkbox v-for="item in options11" :label="item.roleId" :key="item.roleId">{{item.roleName}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <span slot="footer" class="dialog-footer" style="margin-top:10px;">
            <button @click="dialogVisible4=false">取 消</button>
            <button @click="sureRole4">确 定</button>
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
    <div class="">
      <el-dialog title="编辑员工" :visible.sync="dialogVisible" size="tiny" :before-close="handleClose" top='10%' class="">
        <el-form :label-position="labelPosition" :rules="rules" ref="formLabelAlign" label-width="100px" :model="formLabelAlign">
          <el-form-item label="用户名：" style="margin-bottom:2px;margin-right:30px;">
            <span>{{formLabelAlign.role}}</span>
          </el-form-item>
          <el-form-item label="姓名：" required prop="name">
            <el-input v-model.trim="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="角色：" required prop="type" class="role-type">
            <el-input v-model="formLabelAlign.type" :disabled="true" class="roleSelect"></el-input>
            <el-button style="float: left;width: 20%;text-align:center;" class="role-btn" @click='selectRole'>选择角色</el-button>
          </el-form-item>
          <el-form-item label="一级部门：" required prop="value10">
            <el-select v-model="formLabelAlign.value10" style="width:100%;display:inline-block;" @change='changeDepart1' @visible-change='changeVisibleDepart'>
              <el-option v-for="item in options7" :key="item.deptId" :label="item.deptName" :value="item.deptId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级部门：" v-if='deptLevel'>
            <el-select v-model="formLabelAlign.value20" style="width:100%;display:inline-block;">
              <el-option v-for="item in options77" :key="item.deptId" :label="item.deptName" :value="item.deptId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="团队："  prop="value11" class="role-type">
            <el-input v-model="formLabelAlign.value11" :disabled="true"  style="color: #bbb"  class="roleSelect"></el-input>
            <el-button style="float: left;width: 20%;text-align:center;" class="role-btn" @click='selectTime'>选择团队</el-button>
          </el-form-item>
          <el-form-item label="电话：" required prop="tel">
            <el-input v-model.trim="formLabelAlign.tel"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" required prop="email">
            <el-input v-model.trim="formLabelAlign.email"></el-input>
          </el-form-item>
          <el-form-item label="底薪：" required prop="basicPay">
            <el-input v-model.number="formLabelAlign.basicPay"></el-input>
          </el-form-item>
          <el-form-item label="绩效工资："  prop="money">
            <el-input v-model.number.trim="formLabelAlign.money"></el-input>
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
  </div>
</div>
</template>
<script type="text/ecmascript-6">
// 注意标签和引入驼峰，可以有区别
import { getUserList,editorUserDetail,listChildrenDepts,getUserDetail,getRoleList,departmentList,getTeamList } from 'service/getData'
import {  ERR_OK } from 'service/config'
//import Tab from 'components/common/tab'
export default {
  data() {
//    姓名正则
    var checkName=(rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入用户名'));
      }
      setTimeout(() => {
        if (!(/^[\u2E80-\u9FFF]+$/.test(value))) {
          callback(new Error('姓名只能输入汉字'));
        } else {
          callback();
        }
      }, 50);
    };
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
      }, 50);
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
      currentPage4: 1,
      dialogVisible: false,
      labelPosition: 'right',
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      id: "",
      deptMent2:'',
      list2:[],
      deptLevel:false,
      options77:[],
      list2:[],
      pagination: true,
      pageSize: 10,
      roleIdsStr: -1,
      deptId: -1,
      teamId: -1,
      nowPage: 1,
      userId: '',
      total: 100,
      radio: 1,
      radio3: 1,
      resource: '1',
      resource3: '1',
      checkedCities: [],
      checkedCities6:[],
      roleEditor:[],
      teamEditor:[],
      dialogVisible6:false,
      checkedValue: [],
      checkedKey: [],
      checkedCities4: [],
      checkedValue4: [],
      teamIdsStr1:'',
      checkedValue6:[],
      checkedKey4: [],
      rules: {
        name: [ {
          validator:checkName,
        },
              { max: 20, message: '长度不能超过20字符'}
        ],
        type: [{
          required: true,
          message: '请选择角色',
        }, ],
        value11: [],
        value10: [{
          required: true,
          message: '请选择部门',
          type: 'number'
        }],
        email: [{
            required: true,
            message: '请输入邮箱号码',
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
          }
        ],
        money: [
          { validator: checkAges }
        ],
        basicPay:[
          { validator: checkbasicPay }
        ],
        region: [{
          required: true,
          message: '请选择活动区域',
        }],
        team: [{
          required: true,
          message: '请输入取消原因',
        }, ],
        tel: [{
            validator: checkAge,
          }

        ],
        depart: [{
          required: true,
          message: '请输入公告内容',
          trigger: 'blur'
        }, ],

        name3: [{
          required: true,
          message: '请输入姓名',
        },
          {
            validator:checkName,
          },
        ],
        role3: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }, ],
        type3: [{
          required: true,
          message: '请选择角色',
          trigger: 'blur'
        }, ],
        value13: [{
          required: true,
          message: '请选择团队',
          trigger: 'change',
          type: 'number'
        }, ],
        value12: [{
          required: true,
          message: '请选择部门',
          trigger: 'change',
          type: 'number'
        }],
        email3: [{
            required: true,
            message: '请输入邮箱号码',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur,change'
          }
        ],
        money3: [
          { required: true, message: '请输入绩效工资'},
          { type: 'number', message: '绩效工资必须为数字值'},
          ],
        region3: [{
          required: true,
          message: '请选择活动区域',
        }],
        team3: [{
          required: true,
          message: '请输入取消原因',
        }, ],
        pass: [{
          required: true,
          message: '请输入密码',
        }, ],
        tel3: [{
            validator: checkAge,
          }
        ],
        depart3: [{
          required: true,
          message: '请输入公告内容',

        }, ],
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
      formLabelAlign: {
        role: "张三",
        name: '',
        region: '',
        type: '',
        depart: '',
        team: '',
        tel: '',
        email: '',
        pass:'',
        value11: '',
        value10: '',
        value20: '',
        role3: "",
        name3: '',
        region3: '',
        type3: '',
        depart3: '',
        team3: '',
        tel3: '',
        email3: '',
        money: '',
        value12: '',
        value13: '',
      },
      value10: '',
      options1: [],
      options2: [],
      options3: [],
      options4: [],
      options5: [],
      options6: [],
      options7: [],
      options9: [],
      options10: [],
      options11: [],
      options: [{
        value: 'true',
        label: '启用'
      }, {
        value: 'false',
        label: '禁用'
      }],
      value: '',
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      result: [],
    };
  },
  components: {
//    Tab
  },
  created () {
    this.roleIdsStr =this.$route.query.id
  },
  mounted() {
    this.getDate(1, this.pageSize, this.roleIdsStr, -1, -1)
    this.getRoleList1()
    this.getRoleList2()
    this.getRoleList3()
    this.getDepartmentList()
    this.getDepartmentList1()
    this.getDepartmentList2()
    this.getTeamList1()
    this.getTeamList2()
    this.getTeamList3()
  },
  methods: {
    changeVisibleDepart(val){
      if(val==false){
        this._getDepetTwoList2(this.formLabelAlign.value10)
      }
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
    changeRole1(val) {
      this.formLabelAlign.value11 = val
    },
    handleCheckedCitiesChange6(val) {
      this.checkedValue6 = val
    },
    handleClose6(done) {
      this.dialogVisible6 = false
    },
    changeRole3(val) {
      this.formLabelAlign.value13 = val
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
    selectRole() {
      this.checkedCities = this.roleEditor
      this.checkedValue = this.roleEditor
      this.checkedKey = []
      this.dialogVisible2 = true
    },
    selectTime(){
      this.checkedCities6 = this.teamEditor
      this.checkedKey6 = []
      this.checkedValue6 = this.teamEditor
      this.dialogVisible6 = true
    },
    selectRole3() {
      this.checkedCities4 = []
      this.checkedKey4 = []
      this.dialogVisible4 = true
    },
    getDepartmentList1() {
      let self = this
      departmentList().then((res) => {
        if (res.code == ERR_OK) {
          let data = res
          self.options7 = data.data.result
          self.options7.unshift({
            deptId: '',
            deptName: '请选择部门'
          })
        }
      })
    },
    getDepartmentList2() {
      let self = this
      departmentList().then((res) => {
        if (res.code == ERR_OK) {
          let data = res
          self.options9 = data.data.result
          self.options9.unshift({
            deptId: '',
            deptName: '请选择部门'
          })
        }
      })
    },
    getRoleList2() {
      let self = this
      getRoleList().then((res) => {
        if (res.code == ERR_OK) {
          let data = res
          self.options6 = data.data.result

        }
      })
    },
    getRoleList3() {
      let self = this
      getRoleList().then((res) => {
        if (res.code == ERR_OK) {
          let data = res
          self.options11 = data.data.result
        }
      })
    },
    sureRole() {
      if (this.checkedValue.length == 0) {
        this.$notify.info({
          title: '选择角色',
          message: '请勾选角色'
        });
      } else {
        this.dialogVisible2 = false
        var j = 0;
        for (var i = 0; i < this.options6.length; i++) {
          for (var k = 0; k < this.checkedValue.length; k++) {
            if (this.options6[i].roleId == this.checkedValue[k]) {
              this.checkedKey[j] = this.options6[i].roleName;
              ++j;
            }
          }
        }
        this.roleEditor = this.checkedValue
        this.checkedKey = this.checkedKey.join()
        this.checkedValue = this.checkedValue.join()
        this.checkedKey = this.checkedKey.replace(/,/g, "+")
        this.formLabelAlign.type = this.checkedKey
      }
    },
    sureRole4() {
      if (this.checkedValue4.length == 0) {
        this.$notify.info({
          title: '选择角色',
          message: '请勾选角色'
        });
      } else {
        this.dialogVisible4 = false
        var j = 0;
        for (var i = 0; i < this.options11.length; i++) {
          for (var k = 0; k < this.checkedValue4.length; k++) {
            if (this.options11[i].roleId == this.checkedValue4[k]) {
              this.checkedKey4[j] = this.options11[i].roleName;
              ++j;
            }
          }
        }
        this.checkedKey4 = this.checkedKey4.join()
        this.checkedValue4 = this.checkedValue4.join()
        this.checkedKey4 = this.checkedKey4.replace(/,/g, "+")
        this.formLabelAlign.type3 = this.checkedKey4
      }
    },
    editorUser(val) {
      this.dialogVisible = true
      this.radio = '1'
      this.resource = '1'
      let self = this
      this.userId = val
      const params = {
        id: val
      }
      getUserDetail(params).then((res) => {
        if(res.code == ERR_OK) {
          self.formLabelAlign.role = res.data.roleName.split(',')[0]
          self.formLabelAlign.name = res.data.userName
          self.formLabelAlign.tel = res.data.telephone
          self.formLabelAlign.email = res.data.email
          self.formLabelAlign.money = res.data.meritPay
          self.teamIdsStr1 = res.data.teamIdsStr
          self.formLabelAlign.basicPay=res.data.basicPay
          self.roleIdsStr1 = res.data.roleIdsStr
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
    getDate(nowPage, pageShow, roleIdsStr, deptId, teamId, enabled) {
      let self = this
      const params = {
        nowPage: nowPage,
        pageShow: pageShow,
        roleIdsStr: roleIdsStr,
        deptIdStr: deptId,
        teamId: teamId,
        enabled: enabled
      }
      getUserList(params).then((res) => {
        if (res.code == ERR_OK) {
          let data = res
          self.result = data.data.result
          if (data.data.result.length == 0) {
            self.pagination = false
          } else {
            self.pagination = true
          }
          self.total = data.data.totalCount
        }
      })
    },
    getDepartmentList() {
      let self = this
      departmentList().then((res) => {
        if (res.code == ERR_OK) {
          let data = res
          self.options2 = data.data.result
          self.options2.unshift({
            deptId: -1,
            deptName: '请选择部门'
          })
        }
      })
    },
    changeDepart(val) {
      this.deptId = val
      this._getDepetTwoList(val)
      if (this.value4 == '') {
        this.getDate(1, this.pageSize, this.roleIdsStr, this.deptId, this.teamId)
      } else {
        this.getDate(1, this.pageSize, this.roleIdsStr, this.deptId, self.teamId, this.value4)
      }
    },
    teamSelect2(val){
      this.deptMent2 = val
      var deptIdStr = this.value2+','+val
      if(val!=''){
        if (this.value4 == '') {
          this.getDate(1, this.pageSize, this.roleIdsStr, deptIdStr, this.teamId)
        } else {
          this.getDate(1, this.pageSize, this.roleIdsStr, deptIdStr, this.teamId, this.value4)
        }
      }

    },
    changeDepart1(val) {
      this.formLabelAlign.value10 = val
    },
    changeDepart3(val) {
      this.formLabelAlign.value12 = val
    },
    changeTeam(val) {
      this.teamId = val
      var deptIdStr;
      if(this.deptMent2!=''){
        deptIdStr = this.value2+','+this.deptMent2
      }else{
        deptIdStr = this.deptId
      }
      if (this.value4 == '') {
        this.getDate(1, this.pageSize, this.roleIdsStr, deptIdStr, this.teamId)
      } else {
        this.getDate(1, this.pageSize, this.roleIdsStr, deptIdStr, this.teamId, this.value4)
      }
    },
    changeStart(val) {
      var deptIdStr;
      if(this.deptMent2!=''){
        deptIdStr = this.value2+','+this.deptMent2
      }else{
        deptIdStr = this.deptId
      }
      if (this.value4 == '') {
        this.getDate(1, this.pageSize, this.roleIdsStr, deptIdStr, this.teamId)
      } else {
        this.getDate(1, this.pageSize, this.roleIdsStr, deptIdStr, this.teamId, this.value4)
      }
    },
    getRoleList1() {
      let self = this
      getRoleList().then((res) => {
        if (res.code == ERR_OK) {
          let data = res
          self.options1 = data.data.result
          self.options1.unshift({
            roleId: -1,
            roleName: '请选择角色'
          })
        }
      })
    },
    getTeamList1() {
      let self = this
      getTeamList().then((res) => {
        if (res.code == ERR_OK) {
          let data = res
          self.options3 = data.data
          self.options3.unshift({
            teamId: -1,
            teamName: '请选择团队'
          })
        }
      })
    },
    getTeamList2() {
      let self = this
      getTeamList().then((res) => {
        if (res.code == ERR_OK) {
          let data = res
          self.options4 = data.data
        }
      })
    },
    getTeamList3() {
      let self = this
      getTeamList().then((res) => {
        if (res.code == ERR_OK) {
          let data = res
          self.options10 = data.data
          self.options10.unshift({
            teamId: '',
            teamName: '请选择团队'
          })
        }
      })
    },
    submitForm(formName) {
      let self = this
      if (this.checkedValue.length > 0) {
        var roleIdsStr = this.checkedValue
      } else {
        var roleIdsStr = self.roleIdsStr1
      }
       var teamIdsStr = self.checkedValue6
      var enabled
      if (self.resource == 1) {
        enabled = true
      } else {
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
          this.dialogVisible = false
          const params = {
            userName:self.formLabelAlign.name,
            roleIdsStr:roleIdsStr,
            deptId:deptIdStr,
            teamIdsStr:teamIdsStr,
            telephone:self.formLabelAlign.tel,
            email:self.formLabelAlign.email,
            meritPay:self.formLabelAlign.money,
            basicPay:self.formLabelAlign.basicPay,
            enabled:enabled,
            userId:self.userId
          }
          editorUserDetail(params).then((res) => {
            if (res.code == ERR_OK) {
              self.$notify({
                title: '成功',
                message: '成功编辑该员工信息',
                type: 'success'
              });
              var deptIdStr;
              if(self.deptMent2!='') {
                deptIdStr = self.value2+','+self.deptMent2
              }else{
                deptIdStr = self.deptId
              }

              self.getDate(self.nowPage, this.pageSize, this.roleIdsStr, deptIdStr, self.teamId, self.value4)
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

    handleSizeChange(val) {
      this.pageSize = val
      if (this.value4 == '') {
        this.getDate(1, this.pageSize, this.roleIdsStr, this.deptId, this.teamId)
      } else {
        this.getDate(1, this.pageSize, this.roleIdsStr, this.deptId, self.teamId, this.value4)
      }
    },
    handleCurrentChange(val) {
      this.nowPage = val
      if (this.value4 == '') {
        this.getDate(val, this.pageSize, this.roleIdsStr, this.deptId, this.teamId)
      } else {
        this.getDate(val, this.pageSize, this.roleIdsStr, this.deptId, self.teamId, this.value4)
      }
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$refs['formLabelAlign'].resetFields()
    },
    handleCheckedCitiesChange(val) {
      this.checkedValue = val
    },
    handleCheckedCitiesChange4(val) {
      this.checkedValue4 = val
    },
    handleClose2(done) {
      this.dialogVisible2 = false
    },
    handleClose4(done) {
      this.dialogVisible4 = false
    }
  }
};
</script>
<style lang="scss"  scoped>
.role-title {
    margin: 0 auto;
    height: 46px;
    line-height: 46px;
    opacity: 0.99;
    background: rgba(217,52,55,0.10);
}
.role-num {
    float: left;
    font-size: 14px;
    color: #333333;
}
.role-num:nth-child(1) {
    margin-left: 20px;
}
.role-num:nth-child(2) {
    margin: 0 35px;
}
.role-button {
    display: inline-block;
    width: 115px;
    height: 24px;
    line-height: 24px;
    background: #FFFFFF;
    border-radius: 4px;
    font-size: 12px;
    color: #434245;
    margin-top: 8px;
    text-align: center;
    cursor: pointer;
}
.role-button1 {
    float: right;
    width: 86px;
    height: 24px;
    line-height: 24px;
    background: #D93538;
    border-radius: 4px;
    font-size: 14px;
    color: #fff;
    margin-right: 163px;
    margin-top: 12px;
    text-align: center;
    cursor: pointer;
}
.table-content {
    margin-top: 25px;
}
.roleSelect {
    float: left;
    width: 80%;
}
.role-btn {
    background: #D93437;
    border: 1px solid #E0E0E0;
    font-size: 14px;
    color: #FFFFFF;
}
.department-name {
    color: #DA3438;
    cursor: pointer;
}
.dialog-footer button {
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
.dialog-footer button:last-child {
    color: #D93437;
    border: 1px solid #D83436;
}
.check-wrapper {
    float: left;
    overflow: hidden;

}
.permissions-table {
    overflow: hidden;
}

.check-wrapper .el-checkbox {
    float: left;
}
.check-wrapper .el-checkbox:nth-child(2n+1) {
    float: left;
    margin-left: 100px;
    width: 230px;
    margin-bottom: 15px;
}
</style>
