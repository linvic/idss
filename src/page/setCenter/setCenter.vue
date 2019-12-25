<template>
  <div>
    <div class="setCenter-wrapper">
      <div class="title">
        系统设置
      </div>
      <div class="setCenter-list">
        <ul>
          <li v-if='rolePermission'>
            <router-link to="/role">
              <div class="icon-left">
                <img src="../../images/icon_role.png" alt="角色管理">
              </div>
              <div class="content-right">
                <h3>角色管理</h3>
                <p>设置公司内部角色</p>
              </div>
            </router-link>
          </li>
          <li v-if='departmentPermission'>
            <router-link :to="{ path: 'departmentManage' }">
              <div class="icon-left">
                <img src="../../images/icon_department.png" alt="部门管理">
              </div>
              <div class="content-right">
                <h3>部门管理</h3>
                <p>设置公司部门</p>
              </div>
            </router-link>
          </li>
          <li v-if='teamPermission'>
            <router-link :to="{ path: 'teamManage' }">
              <div class="icon-left">
                <img src="../../images/icon_team.png" alt="团队管理">
              </div>
              <div class="content-right">
                <h3>团队管理</h3>
                <p>设置公司团队</p>
              </div>
            </router-link>
          </li>
          <li v-if='userPermission'>
            <router-link :to="{ path: 'staffDetail' }">
              <div class="icon-left">
                <img src="../../images/icon_user.png" alt="用户管理">
              </div>
              <div class="content-right">
                <h3>员工管理</h3>
                <p>管理公司员工信息</p>
              </div>
            </router-link>
          </li>
          <li v-if='projectPermission'>
            <router-link :to="{ path: 'projectManage' }">
              <div class="icon-left">
                <img src="../../images/icon_project.png" alt="项目管理">
              </div>
              <div class="content-right">
                <h3>项目管理</h3>
                <p>简单管理项目，方便下一版本数据同步</p>
              </div>
            </router-link>
          </li>
          <li v-if='missionPermission'>
            <router-link :to="{ path: 'taskGrounpManage' }">
              <div class="icon-left">
                <img src="../../images/icon_task.png" alt="任务组管理">
              </div>
              <div class="content-right">
                <h3>任务组管理</h3>
                <p>管理任务种类，用于任务管理查看</p>
              </div>
            </router-link>
          </li>
          <li v-if='rewardsPermission'>
            <router-link :to="{ path: 'rewardManage' }">
              <div class="icon-left">
                <img src="../../images/icon_reward.png" alt="奖惩管理">
              </div>
              <div class="content-right">
                <h3>奖惩管理</h3>
                <p>奖惩信息设置</p>
              </div>
            </router-link>
          </li>
          <li v-if='noticePermission'>
            <router-link to="/noticeManage">
              <div class="icon-left">
                <img src="../../images/icon_notice.png" alt="公告管理">
              </div>
              <div class="content-right">
                <h3>公告管理</h3>
                <p>设置公司公告信息</p>
              </div>
            </router-link>
          </li>
          <li v-if='reportPermission'>
            <router-link to="/weeklyTime">
                <div class="icon-left">
                  <img src="../../images/icon_weekly.png" alt="周报时间">
                </div>
                <div class="content-right">
                  <h3>周报时间</h3>
                  <p>设置公司提交周报的截止时间</p>
                </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
//  import Tab from 'components/common/tab'
  import {listOperFuns} from '../../service/getData'
  import {ERR_OK,SYS} from '../../service/config'
  import  store from '../../store'
  export default {
    data() {
      return {
        rolePermission:false,
        departmentPermission:false,
        teamPermission:false,
        userPermission:false,
        projectPermission:false,
        missionPermission:false,
        rewardsPermission:false,
        noticePermission:false,
        reportPermission:false
      };
    },
    created(){
     this._listOperFuns();
    },
    components: {
//      Tab
    },
    methods: {
       _listOperFuns(){
         var self=this;
         listOperFuns({resourceNo:'SYS'}).then(function (res) {
           if(res.code==ERR_OK){
             for(var key in res.data){
               if(res.data[key].resourceNo=="role"){
                 self.rolePermission=true;
               }
               if(res.data[key].resourceNo=="dept"){
                 self.departmentPermission=true;
               }
               if(res.data[key].resourceNo=="team"){
                 self.teamPermission=true;
               }
               if(res.data[key].resourceNo=="user"){
                 self.userPermission=true;
               }
               if(res.data[key].resourceNo=="project"){
                 self.projectPermission=true;
               }
               if(res.data[key].resourceNo=="taskGroup"){
                 self.missionPermission=true;
               }
               if(res.data[key].resourceNo=="rp"){
                 self.rewardsPermission=true;
               }
               if(res.data[key].resourceNo=="notice"){
                 self.noticePermission=true;
               }
               if(res.data[key].resourceNo=="weeklyCycle"){
                 self.reportPermission=true;
               }
             }
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
  .setCenter-wrapper{
    width: 1170px;
    margin: 0 auto;
  }
  .title{
    height: 42px;
    line-height: 42px;
    font-size: 12px;
    color: #505363;
  }
  .setCenter-list{
    width: 1170px;
  }

  .setCenter-list ul li{
    float: left;
    background: #FFFFFF;
  // box-shadow: 0 2px 11px 0 rgba(0,0,0,0.07);
    border-radius: 6px;
    height: 150px;
    width: 361px;
    margin-bottom: 10px;
    cursor: pointer;
    border: 1px solid #E6EAF2;
    transition: all .2s linear;
  }
  .setCenter-list ul li:hover{
    box-shadow: 0 15px 15px 0 rgba(0,0,0,0.1);
    transform: translate3d(0,-3px,0);
  }
  .setCenter-list ul li:nth-child(3n+2){
    margin-left:29px;
    margin-right: 29px;
  }
  .icon-left{
    float: left;
    width: 144px;
    height: 100%;
  }
  .icon-left img{
    display: inline-block;
    margin-left: 48.9px;
    margin-top: 52px;
  }
  .setCenter-list ul li:nth-child(1) .icon-left img{
    margin-left: 42.3px;
    margin-top: 50px;
  }
  .setCenter-list ul li:nth-child(2) .icon-left img,.setCenter-list ul li:nth-child(4) .icon-left img{
    margin-left: 49.8px;
    margin-top: 52px;
  }
  .setCenter-list ul li:nth-child(3) .icon-left img{
    margin-left: 44.5px;
    margin-top: 53px;
  }
  .setCenter-list ul li:nth-child(5) .icon-left img,.setCenter-list ul li:nth-child(7) .icon-left img{
    margin-left: 49.8px;
    margin-top: 53px;
  }
  .setCenter-list ul li:nth-child(6) .icon-left img{
    margin-left: 48.7px;
    margin-top: 53px;
  }
  .setCenter-list ul li:nth-child(8) .icon-left img{
    margin-left: 51.9px;
    margin-top: 53px;
  }
  .setCenter-list ul li:nth-child(9) .icon-left img{
    margin-left: 49.8px;
    margin-top: 55px;
  }
  .content-right{
    float: left;
    width: 133.4px;
    height: 100%;
  }
  .content-right  h3{
    font-size: 16px;
    color: #505363;
    line-height: 16px;
    margin-top: 50px;
  }
  .content-right p{
    font-size: 14px;
    color: #505363;
    line-height: 22px;
    margin-top: 16px;
  }
</style>
