<template>
  <div class="role">
    <!--<tab></tab>-->
    <div class="setCenter-wrapper">
      <div class="router-wrapper">
        <router-link to="/setCenter">
          <span class="child1">系统设置</span>
        </router-link>
        /
        <router-link to="/role">
          <span class="child2">角色管理</span>
        </router-link>
      </div>
      <div class="role-title">
        <div class="role-num">
          角色数：{{totalCount}}
        </div>
        <div class="role-num">
          启用数：{{nowPage}}
        </div>
        <div class="role-num">
          禁用数：{{pageShow}}
        </div>
        <router-link :to="{ path: '/addRole' }">
          <div class="role-button">
            添加角色
          </div>
        </router-link>
      </div>
      <div class="setCenter-list-wrapper">
        <div class="setCenter-list">
        <ul>
          <li v-for='item in result'>
            <div class="role-name">
              <div class="role-left ellipsis">
                {{item.roleName}}
              </div>
              <div class="role-right">
                  <router-link :to="{ path: 'editorRole',query: {id:item.roleId}}" style='color:#7F7F7F'><i class="el-icon-edit"></i></router-link>
                  <i v-if="!item.enabled" class="el-icon-delete" @click="delet(item.roleId,item.roleName)"></i>
              </div>
            </div>
            <router-link :to="{ path: 'roleDetail',query: {id:item.roleId}}">
            <div class="role-content">
              <div class="populations-status">
                <div class="populations-left">
                  人数：{{item.roleUserNum}}
                </div>
                <div class="status-right">
                  状态：{{item.enabled?'启用':'禁用'}}
                </div>
              </div>
              <h3 style="padding-bottom: 20px">{{item.roleDesc}}</h3>
            </div>
          </router-link>
          </li>
        </ul>
      </div>
      </div>
    </div>
    <el-dialog
      title="删除角色"
      :visible.sync="dialogVisible"
      size="tiny"
      :before-close="handleClose" top='25%' class="department deleteDepartment">
      <span>确定删除{{roleName}}角色吗？</span>
      <span slot="footer" class="dialog-footer">
        <button @click="dialogVisible = false">取 消</button>
         <button @click="sureDelete">确 定</button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别getRoleList
  import { getRoleList, deletRoleList,getRoleDetail } from 'service/getData'
  import {ERR_OK} from 'service/config'
//  import Tab from 'components/common/tab'
  export default {
    data() {
      return {
        hello:true,
        dialogVisible:false,
        roleName:"",
        result:'',
        totalCount:'',
        pageShow:'',
        nowPage:'',
        roleUserNum:'',
        roleId:''
      };
    },
    components: {
//      Tab
    },
    mounted () {
        this.getData();
    },
    methods: {
      delete1 (val) {
        this.dialogVisible = true
        this.roleName = val
      },
      getData () {
        let self = this
        getRoleDetail().then((res) => {
          if(res.code == ERR_OK) {
            let data = res
            this.result = data.data.roleList
            this.totalCount = data.data.roleNum
            this.pageShow = data.data.disableCount
            this.roleUserNum = data.data.roleNum
            this.nowPage = data.data.enableCount
          }
       })
      },
      delet(val,roleName){
        this.dialogVisible = true;
        this.roleName=roleName;
        this.roleId = val;
      },
      sureDelete () {
        let self = this
        const params= {
          id:self.roleId
        }
        deletRoleList(params).then((res) => {
          if(res.code == ERR_OK) {
            this.dialogVisible = false
            let data = res
            self.getData()
            self.$notify({
              title: '删除角色',
              duration:3000,
              message: '成功删除该角色',
              type: 'success'
            });
          }else{
            this.dialogVisible = false
            this.$notify.error({
              title: '删除角色',
              duration:3000,
              message: res.msg
            });
          }
       })
      },
      handleClose(done) {
        this.dialogVisible = false
      }
    }
  };
</script>
<style lang="scss"  scoped>
  .setCenter-wrapper{
    
    margin: 0 auto;
  }
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
  }
  .setCenter-list ul li:hover{
    border: 1px solid rgba(217,52,55,0.50);
  }
  .setCenter-list ul li:nth-child(3n+2){
    margin-left:40px;
  }
  .setCenter-list ul li:nth-child(3n+3){
    margin-left:40px;
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
    border: 1px solid #D93538;
    /*background: #D93538;*/
    border-radius: 4px;
    font-size: 14px;
    color: #D93538;
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
    padding-left: 15px;
    width: 260px;
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
    height:50px;
    line-height: 50px;
    font-size: 14px;
    color: #7F7F7F;
    padding-top: 10px;
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
</style>
