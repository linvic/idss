<template>
  <div>
    <!--<tab></tab>-->
    <div class="wrapper1">
    <div class="router-wrapper">
      <router-link to="/remindManage">
        <span class="child1">提醒管理</span>
      </router-link>
      /
      <router-link to="/remindManage">
        <span class="child2">公告详情</span>
      </router-link>
    </div>
    <div class="uncomplete-task" >
      <div class="user-title" style='border-top:none'>
        <div class="title-name1">
          公告详情
        </div>
      </div>
      <div class="notice-wrapper" style='border-left:none;border-right:none'>
        <h3>{{title}}</h3>
        <div class="notice-content" v-html="content">
          {{content}}
        </div>
      </div>
    </div>
    <div class="uncomplete-task" style="margin-top:20px;">
      <div class="user-title" style='border-top:none'>
        <div class="title-name1">
          评论列表
        </div>
      </div>
      <div class="my-comment">
        <div class="my-title">
          <div class="title-left">
            我的评论：
          </div>
          <div class="title-right" @click='reportComment'>
            发表评论
          </div>

        </div>
        <div class="quill-wrapper">
          <quill-editor ref="myTextEditor" v-model="ruleForm.content" :options="editorOption"></quill-editor>
        </div>
        <div class="news-wrapper">
          <div class="news" v-for='item in result'>
            <div class="" style="min-width:960px;max-width:960px;float:left;">
              <div class="news-left">
                <!-- <router-link :to="{ path: '/setCenter/userDetail',query: {id:item.snsUser.userId}}" style="color:#333333"> -->
                  <span>{{item.snsUser.userName}}：</span>
                <!-- </router-link> -->

              </div>
              <div class="" style="float:left;max-width:660px;">
                <span v-html='item.snsContent'>{{item.snsContent}}</span>
              </div>
            </div>
            <div class="news-right" style="vertical-align:text-bottom;">
              {{item.snsTimeDistanceDesc}}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
  import { quillEditor } from 'vue-quill-editor';
  import bus from '../../../../assets/eventBus'
  import { getNoticeDetail,getNoticeComment,reportNoticeComment } from 'service/getData'
  import {  ERR_OK } from 'service/config'
//  import Tab from 'components/common/tab'
  export default {
    data() {
      return {
        isActive:true,
        isActive1:false,
        activeName:false,
        hello:false,
        isA:false,
        title:'',
        content:'',
        result:[],
        id:'',
        ruleForm:{
          content:''
        },
        editorOption: {
          theme: 'snow',
          placeholder: "请填写评论",
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['link', 'image'],
            ]
          }
        }
      };
    },
    components: {
      quillEditor,
//      Tab
    },
    created () {
      this.id =this.$route.query.id
      this.getData()
      this.getComment()
    },
    methods: {
      getData () {
        let self = this
        const params = {
          id:this.id
        }
        getNoticeDetail(params).then((res) => {
          if (res.code == ERR_OK) {
            if(res.data){
              self.title = res.data.title
              self.content = res.data.descContent
            }else{
              self.title = ""
              self.content = ""
            }
          }
        })
      },
      reportComment () {
        let self = this
        const params = {
          noticeId:this.id,
          snsContent:self.ruleForm.content
        }
        if(self.ruleForm.content===''){
          this.$notify({
            title: '提示',
            message:'请填写评论'
          });
        }else if(self.ruleForm.content.trim().length>200){
          this.$notify({
            title: '提示',
            message:'评论的字符长度不能大于200个字符'
          });
        }else{
          reportNoticeComment(params).then((res) => {
            if (res.code == ERR_OK) {
              this.getComment()
              this.ruleForm.content = ''
              this.$notify({
                title: '成功',
                message: '发表评论成功',
                type: 'success'
              });
            }else{
              this.$notify.error({
                title: '提示',
                message:res.msg
              });
            }
          })
        }
      },
      getComment () {
        const params = {
          id:this.id
        }
        let self = this
        getNoticeComment(params).then((res) => {
          if (res.code == ERR_OK) {
            self.result = res.data
          }
        })
      },
    },
    watch: {
      '$route' (to, from) {
        this.id=this.$route.query.id
        bus.$emit('tabChange','SUCCESS')
        this.getData() //再次调起我要执行的函数
      }
    }
  };
</script>
<style  scoped lang="scss">
  .wrapper1{
    height: 100%;
    margin: 0 auto;
    padding-bottom: 40px;
  }

  .uncomplete-task{
    border: 1px solid rgba(0,0,0,0.12);
    overflow: hidden;
    margin: 0px auto;
    background: #fff;

  }
  .user-title{
    opacity: 0.99;
    background: rgba(217,52,55,0.10);
    height: 46px;
    line-height: 46px;
    width: 100%;
    font-size: 14px;
  }
  .title-name1{
    float: left;
    width:84px;
    height:46px;
    cursor: pointer;
    box-sizing: border-box;
    color: #333333;
    text-align: left;
    margin-left: 20px;
  }
  .notice-wrapper{
    padding-left: 38px;
    padding-bottom: 16px;
    font-size: 14px;
    color: #333333;
  }
  .notice-wrapper h3{
    font-size: 14px;
    font-weight: bold;
    line-height: 49px;
  }
  .notice-content{
    font-size: 14px;
    line-height: 24px;
    margin-top: -5px;
  }
  .my-comment{
    padding: 19px 20px 15px;
  }
  .my-title{
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #333333;
  }
  .title-left{
    float: left;
  }
  .title-right{
    float: right;
    width: 90px;
    height: 30px;
    text-align: center;
    cursor: pointer;
    border: 1px solid #D83436;
    border-radius: 4px;
    color: #D93437;
  }
  .news-wrapper{
    margin-top: 10px;
  }
  .news{
    width: 100%;
    overflow: hidden;
    font-size: 14px;
    color: #333333;
    line-height: 24px;
  }
  .news-left{
    float: left;
  }
  .news-left span{
    float: left;
  }
  .news-right{
  margin-left: 70px;
  float: left;
  font-size: 12px;
  color: #999999;
  }
  
.quill-wrapper .ql-formats{
  line-height: 37px !important;
}
</style>
