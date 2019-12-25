<template>
  <div class="noticeManage">
    <!--<tab></tab>-->
    <div class="wrapper">
      <div class="router-wrapper">
        <router-link to="/setCenter">
          <span class="child1">系统设置</span>
        </router-link>  /
        <router-link to="/noticeManage">
          <span class="child2">公告管理</span>
        </router-link>
      </div>
      <div class="role-title">
        <div class="role-num">
          公告列表
        </div>
          <div class="role-button" @click="publishAd('ruleForm')">
            发布公告
          </div>
      </div>
      <div class="table-content departmentDetail">
        <el-table
          :data="result">
          <el-table-column
            prop="replyPeriodDate"
            label="发布时间" class='departmentDetail-name'
            width="218"
          >
          </el-table-column>
          <el-table-column
            prop="title"
            width="650"
            label="公告标题"
          >
          </el-table-column>
          <el-table-column
            prop="mustread"
            width="156"
            label="是否必读">
            <template slot-scope="props">
               <span class="" v-if='props.row.mustread==true'>是</span>
               <span class="department-name" v-if='props.row.mustread==false'>否</span>
             </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="props">
              <router-link :to="{ path: 'noticeDetail',query: {id:props.row.noticeId}}">
              <el-button
                size="small"
                 >查看</el-button>
               </router-link>
              <el-button
                size="small" @click="deletes(props.row.noticeId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-depart" v-if='total>0'>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4"
                       :page-sizes="[10, 15, 50]" :page-size="pageShow"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <!--发布任务模态窗-->
    <el-dialog
      title="发布公告"
      :visible.sync="dialogVisible"
      size="tiny"
      :before-close="handleClose" top='17%' class="departmentDetail noticeManageModel">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="公告标题:" prop="name" style="margin-right: 40px !important;">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="是否必读:" style="margin-top:0px;" required>
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="1" v-model="radio">是</el-radio>
            <el-radio label="2" v-model="radio">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="回帖期限:" required style="margin-top:0px;">
            <el-form-item prop="date1">
              <!-- <el-date-picker type="date" :picker-options="pickerOptions0" placeholder="选择日期" v-model="ruleForm11.date1" style="width: 100%;"></el-date-picker> -->
              <el-date-picker type="date" :picker-options="pickerOptions0" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-form-item>
        <el-form-item label="公告内容:" required style="margin-top:0px;">
          <el-form-item prop="content">
            <quill-editor ref="myTextEditor" v-model="ruleForm.content" :options="editorOption"></quill-editor>
          </el-form-item>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <button  @click="resetForm('ruleForm')">取 消</button>
        <button  @click="submitForm('ruleForm')">保存</button>
      </span>
    </el-dialog>
    <!--删除模态窗-->
    <el-dialog
      title="删除公告"
      :visible.sync="dialogDelete"
      size="tiny"
      :before-close="handleClose1" top='25%' class="department">
      <span>确定要删除该公告吗？删除后不可恢复</span>
      <span slot="footer" class="dialog-footer">
        <button @click="dialogDelete = false">取 消</button>
        <button @click="sureDelete">确 定</button>
      </span>
    </el-dialog>

  </div>
</template>
<script type="text/ecmascript-6">
  // 注意标签和引入驼峰，可以有区别
  import { quillEditor } from 'vue-quill-editor';
  import { noticeList, deleteNoticeList, addNoticeList } from 'service/getData'
  import {  ERR_OK } from 'service/config'
//  import Tab from 'components/common/tab'
  export default {
    data() {
      return {
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        dialogVisible: false,
        dialogDelete:false,
        labelPosition: 'right',
        value10:"投研部",
        currentPage4: 1,
        nowPage:1,
        pageShow:10,
        content: '',
        total:10,
        noticeId:'',
        value: '',
        radio:'1',
        editorOption: {
          theme: 'snow',
          placeholder: "请填写公告内容",
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
        },
        ruleForm: {
          name: '',
          date1: new Date(new Date().setDate(new Date().getDate()+3)),
          content:'',
          resource:'1'
        },
        result:[],
        rules: {
          name: [
            { required: true, message: '请输入公告标题'},
            {  max: 50, message: '公告标题不得超过50个字符' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期'}
          ],
          content: [
            { required: true, message: '请输入公告内容' },
            {  max: 1000, message: '公告内容不得超过1000个字符' }
          ],
        },

      };
    },
    components: {
      quillEditor,
//      Tab
    },
    mounted(){
      this.getData(1,10)
    },
    methods: {
      //  发布公告
      publishAd(formName){
        this.dialogVisible=true;
        if(this.$refs[formName]){
          this.$refs[formName].resetFields();
        }
      },
      getData (nowPage,pageShow) {
        const params = {
          nowPage:nowPage,
          pageShow:pageShow
        }
        noticeList(params).then((res) => {
          if (res.code == ERR_OK) {
            this.result = res.data.result
            this.total = res.data.totalCount
          }
        })
      },
      // 删除公告
      deletes(val){
        this.noticeId = val
        this.dialogDelete=true;
      },
      sureDelete () {
        const params = {
          id:this.noticeId
        }
        deleteNoticeList(params).then((res) => {
          if (res.code == ERR_OK) {
            this.dialogDelete=false;
            this.getData(this.nowPage,this.pageShow)
            this.$notify({
              title: '成功',
              message: '成功删除此公告',
              type: 'success'
            });
          }else{
            this.$notify.error({
              title: '提示',
              message:res.msg
            });
          }
        })
      },
      handleClose1(done) {
        this.dialogDelete = false
      },
      handleClose(done) {
        this.dialogVisible = false
        this.$refs['ruleForm'].resetFields();
      },
      handleSizeChange(val) {
        this.pageShow = val
        this.getData(this.nowPage,this.pageShow)
      },
      handleCurrentChange(val) {
        this.nowPage = val
        this.getData(this.nowPage,this.pageShow)
      },
      submitForm(formName) {
        let self = this
        let mustread
        if(self.ruleForm.resource == 1){
          mustread  = true
        }else{
          mustread = false
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = {
              title:self.ruleForm.name,
              replyPeriodDate:self.ruleForm.date1.toLocaleDateString().replace(/\//g, "-"),
              descContent:self.ruleForm.content,
              mustread:mustread,
            }
            addNoticeList(params).then((res) => {
              if (res.code == ERR_OK) {
                this.dialogVisible = false
                this.getData(this.nowPage,this.pageShow)
                this.$notify({
                  title: '成功',
                  message: '成功发布公告',
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
      resetForm(formName) {
        this.dialogVisible = false
        this.$refs[formName].resetFields();
      }
    }
  };
</script>
<style lang="scss"  scoped>
  .role-title{
    margin: 0 auto;
    height: 46px;
    line-height: 46px;
    background: rgba(217,52,55,0.20);
  }
  .role-num{
    float: left;
    font-size: 14px;
    color: #333333;
  }
  .role-num:nth-child(1){
    margin-left:20px;
  }
  .role-num:nth-child(2){
    margin: 0 35px;
  }
  .role-button{
    float: right;
    width: 84px;
    height: 30px;
    line-height: 30px;
    background: #D93538;
    border-radius: 4px;
    font-size: 14px;
    color: #FFFFFF;
    margin-right: 163px;
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
</style>
