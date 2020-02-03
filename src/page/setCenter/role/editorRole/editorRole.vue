<template>
  <div>
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <router-link to="/setCenter">
          <span class="child1">
            系统设置
          </span>
        </router-link>/
        <router-link to="/setCenter/role">
          <span class="child1">角色管理</span>
        </router-link>/
        <router-link to="/setCenter/addRole">
          <span class="child2">添加角色</span>
        </router-link>
      </div>
      <div class="add-Role">
        <div class="role-title">
          <h3>添加角色</h3>
        </div>
        <div class="role-content">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  label-width="110px">
            <el-form-item label="角色名称：" class="form-role"  prop="name">
              <el-input v-model.trim="ruleForm.name" class='role-name'></el-input>
            </el-form-item>
            <el-form-item label="角色描述：" class="form-role form-role1"  prop="desc">
              <el-input v-model.trim="ruleForm.desc" class='role-name'></el-input>
            </el-form-item>
            <el-form-item  label="状态：" class='special-width' prop="resource">
              <el-radio-group v-model="ruleForm.resource" class="enabled">
                <el-radio  v-model="radio" label="true">启用</el-radio>
                <el-radio  v-model="radio" label="false">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div class="permissions-title">
            权限列表：
          </div>
          <div class="permissions-table table-c">
            <div class="role-wrapper">
              <div class="role-header">
                <div class="header-title1">
                  一级
                </div>
                <div class="header-title2">
                  二级
                </div>
                <div class="header-title3">
                  操作
                </div>
              </div>
              <ul class="first_children clear">
                <li v-for='(item,index) in result' class="first_role">
                  <label class="ant-checkbox-wrapper first_able" :class="item.resourceChilds.length>0 ? 'bord ':''">
                    <input type='checkbox' class='item-check-btn' :value="item.resourceId" v-model="item.hasAuth" @click="selectAll(item,index)">
                    <span class="dept">{{item.resourceName}}</span>
                  </label>
                  <ul class="second_children clear">
                    <li v-for="(itemChild,i) in item.resourceChilds">
                      <label class="ant-checkbox-wrapper second_able"  :class="itemChild.resourceChilds.length>0 ? 'bord ':''">
                        <input type='checkbox' class='item-check-btn' :value="itemChild.resourceId" v-model="itemChild.hasAuth" @click="selectSecond(item,itemChild,i,index)">
                        <span class="dept">{{itemChild.resourceName}}</span>
                      </label>
                      <ul class="clear"  :class="item.resourceChilds.length>0 ? 'bord ':''">
                        <li v-for="(itemChildLast,j) in itemChild.resourceChilds" class="lastLi" >
                          <label class="last_lab">
                            <input type='checkbox' class='item-check-btn' :value="itemChildLast.resourceId" v-model="itemChildLast.hasAuth"  @click="selectAllThree(item,itemChild,itemChildLast,j,i,index)">
                            <span class="dept">{{itemChildLast.resourceName}}</span>
                          </label>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="submit-text">
          <button type="button" name="button" class='button-submit' @click="_addRole('ruleForm')">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
//  import Tab from 'components/common/tab'
  import { getRoleResource, editorRoleList,updateRole} from 'service/getData'
  import {ERR_OK} from 'service/config'
  export default {
    data() {
      return {
        checked:true,
        multipleSelection: [],
        radio:'1',
        id:'',
        result:[],
        special:['1'],
        ruleForm: {
          name: '',
          resource: '',
          desc: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入角色名称'},
            { max: 20, message: '长度不能超过20字符'}
          ],
          desc: [
            { required: true, message: '请输入角色描述'},
            { max: 20, message: '长度不能超过20字符'}
          ],
          resource: [
            { required: true, message: '请选择状态'}
          ],
        },
        roleList:[],
      }
    },
    components: {
//      Tab
    },
    mounted () {
      this.getEditor()
    },
    created () {
      this.id =this.$route.query.id
    },
    methods: {
      getEditor() {
        let self = this
        const params = { id: self.id }
        editorRoleList(params).then((res) => {
          if(res.code == ERR_OK) {
            self.ruleForm.name = res.data.roleName
            self.ruleForm.desc = res.data.roleDesc
            self.ruleForm.resource=res.data.enabled
            if(res.data.enabled == true) {
              self.ruleForm.resource = 'true'
            }else{
              self.ruleForm.resource = 'false'
            }
            self.result = res.data.resourceList
            self.roleList=res.data.resourceList;
          }
       })
      },
//      保存角色
      //      添加角色
      _addRole(formName){
        var param=''
        var data=this.roleList;
        for(var key in data){
          if(data[key].hasAuth){
            param+=data[key].resourceId+","
            for(var i in data[key].resourceChilds){
              if(data[key].resourceChilds[i].hasAuth){
                param+=data[key].resourceChilds[i].resourceId+","
                for(var j in data[key].resourceChilds[i].resourceChilds){
                  if(data[key].resourceChilds[i].resourceChilds[j].hasAuth){
                    param+=data[key].resourceChilds[i].resourceChilds[j].resourceId+","
                  }
                }
              }
            }
          }
        }
        var str=param.substring(0, param.lastIndexOf(','));
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(str!=''){
           this._updateRole(str)
            }else{
              this.$notify.info({
                title: '提示',
                message: '请勾选权限列表中的权限值',
                duration:3000
              });
            }
          } else {
            return false;
          }
        });
      },
//      编辑角色接口
      _updateRole(param){
        var self=this;
        updateRole({roleId:this.$route.query.id,roleName:this.ruleForm.name,roleDesc:this.ruleForm.desc,enabled:this.ruleForm.resource,resourceIds:param}).then(function (res) {
          if(res.code == ERR_OK) {
            self.$notify({
              title: '成功',
              message: '保存成功',
              duration:3000,
              type: 'success'
            });
            self.$router.push('/setCenter/role')
          }else{
            self.$notify.error({
              duration:3000,
              title: '失败',
              message:res.msg,
            });
          }
        })
      },
//      勾选函数
      selectAll(item,index){
        var self=this;
        item.hasAuth=!item.hasAuth
        //如果父级被选中，那么子集循环，全被给checked=true;
        if(item.hasAuth){
          self.roleList[index].hasAuth=true;
          item.resourceChilds.forEach(function(item,k){
            item.hasAuth=true;
            if(item.hasAuth){
              self.roleList[index].resourceChilds[k].hasAuth=true;
              item.resourceChilds.forEach(function(item,g){
                item.hasAuth=true;
                self.roleList[index].resourceChilds[k].resourceChilds[g].hasAuth=true;
              })
            }else{
              self.roleList[index].resourceChilds[k].hasAuth=false;
              item.resourceChilds.forEach(function(item,f){
                item.hasAuth=false;
                self.roleList[index].resourceChilds[k].resourceChilds[f].hasAuth=false;
              })
            }
          });
        }else{
          //相反，如果没有被选中，子集应该全部checked=false
          self.roleList[index].hasAuth=false;
          item.resourceChilds.forEach(function(item,a){
            item.hasAuth=false;
            self.roleList[index].resourceChilds[a].hasAuth=false;
            item.resourceChilds.forEach(function(item,b){
              self.roleList[index].resourceChilds[a].resourceChilds[b].hasAuth=false;
              item.hasAuth=false;
            })
          });
        }

      },
      selectSecond(item,itemChild,i,index){
        //如果父级被选中，那么子集循环，全被给checked=true
        var self=this;
        itemChild.hasAuth=!itemChild.hasAuth
        //item.hasAuth=itemChild.hasAuth ? true : item.resourceChilds.some(a => a.hasAuth);
        if(itemChild.hasAuth){
          self.roleList[index].hasAuth=true;
          self.roleList[index].resourceChilds[i].hasAuth=true;
          itemChild.resourceChilds.forEach(function(temp,k){
            temp.hasAuth=true;
            self.roleList[index].resourceChilds[i].resourceChilds[k].hasAuth=true;
          });
        }else{
          //相反，如果没有被选中，子集应该全部checked=false
          self.roleList[index].resourceChilds[i].hasAuth=false;
          itemChild.resourceChilds.forEach(function(temp,k){
            temp.hasAuth=false;
            self.roleList[index].resourceChilds[i].resourceChilds[k].hasAuth=false;
          });
        }

      },
      selectAllThree(item,itemChild,itemChildLast,j,i,index){
//        var arr=[];
        var self=this;
        itemChild.hasAuth=!itemChild.hasAuth
        itemChildLast.hasAuth=!itemChildLast.hasAuth
        //itemChild.hasAuth=itemChildLast.hasAuth ? true : itemChild.resourceChilds.some(a => a.hasAuth);
        //item.hasAuth=itemChild.hasAuth ? true : item.resourceChilds.some(a => a.hasAuth);
        if(itemChild.hasAuth){
          self.roleList[index].resourceChilds[i].hasAuth=true;
          if(itemChildLast.hasAuth){
            self.roleList[index].hasAuth=true;
            self.roleList[index].resourceChilds[i].hasAuth=true;
            self.roleList[index].resourceChilds[i].resourceChilds[j].hasAuth=true;
          }else{
            self.roleList[index].resourceChilds[i].resourceChilds[j].hasAuth=false;
          }
        }else{
          self.roleList[index].resourceChilds[i].hasAuth=false;
        }
      }
    }
  };
</script>
<style lang="scss"  scoped>
  .add-Role{
    background: #fff;
    overflow: hidden;
  }
  .role-title{
    width: 100%;
    height: 45px;
    line-height: 45px;
    font-size: 16px;
    color: #333333;
    background: #FBEBEB;
  }
  .role-title h3{
    margin-left: 20px;
    font-weight: normal;
  }
  .role-name{
    width: 510px !important;
  }
  .form-role{
    margin-top: 21px;
    margin-bottom: 0px !important;
  }
  .form-role1{
    margin-top: 18px;
  }
  .special-width{
    margin-top: 9px;
  }
  .role-wrapper{
    font-size: 14px;
    color: #5C5F66;
    border-radius: 5px;
    border: 1px solid #E0E0E0;
    //border-bottom: none;
    background: #FFFFFF;
  }
  .role-header{
    background: rgba(217,52,55,0.04);
    height: 50px;
    width: 100%;
    line-height: 50px;
  }
  .header-title1{
    float: left;
    width: 130px;
    text-align: center;
  }
  .header-title2{
    float: left;
    width: 130px;
    text-align: center;
  }
  .header-title3{
    float: left;
    width: 130px;
    text-align: center;
  }
  .button-submit{
    border: 1px solid #D83436;
    border-radius: 4px;
    font-size: 14px;
    color: #D93437;
    margin: 30px auto;
    display: block;
    width: 90px;
    line-height: 30px;
    background: #fff;
    height:30px;
    cursor: pointer;
  }
  .ant-checkbox-wrapper{
    display: inline-block;
    height: 49px;
    line-height: 49px;
    /*border-bottom: 1px solid  #F0F2F7;*/
  }
  .first_able{
    padding-left: 40px;
    width: 100%;
  }
  .second_able{
    width: 880px;
    padding-left: 180px;
  }
  .three_able{
    padding-left: 300px;
  }
  .lastLi{
    float: left;
    height: 49px;
    line-height: 49px;

  }
  .three_children{
    border-bottom: 1px solid  #F0F2F7;
  }
  .lastLi:first-child{
    padding-left: 290px;
  }
  .bord{
    border-bottom: 1px solid  #F0F2F7;
  }
  .first_role{
    border-bottom: 1px solid  #F0F2F7;
  }

  .first_role:last-child{
    border-bottom: 0 !important;
  }
  .last_lab{
    margin-left: 20px;
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
    top: -18px;
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
  .second_children li:last-child .clear {
    border-bottom: none !important
  }
</style>
