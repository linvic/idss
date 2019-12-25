<template>
  <div class="wagesDetail">
    <!--<tab></tab>-->
    <div class="wrapper performanceManage">
      <div class="router-wrapper">
        <router-link to="/performanceManage">
          <span class="child1">绩效管理</span>
        </router-link>
        /
        <router-link to="/performanceDept" v-if="userView=='DEPT'">
          <span class="child1">工资条</span>
        </router-link>
        <router-link to="/performanceManage" v-if="userView=='STAFF'">
          <span class="child1">工资条</span>
        </router-link>
        /
          <span class="child2">工资详情</span>
      </div>
      <div class="redBang" >
        <div class="redBang_title">
          <span class="red_text">工资详情　　{{salaryBill.salaryTimeStr}}　　合计：{{salaryBill.rpTotal }}</span>
        </div>
        <div class="get-reward">
          <el-table
            :data="resultRed"
            style="width: 100%" empty-text='暂无数据'>
            <!--<el-table-column-->
              <!--width="140"-->
              <!--type="index"-->
              <!--label="序号"-->
            <!--&gt;-->
            <!--</el-table-column>-->
            <el-table-column
              prop="rpTimeStr"
              label="时间"
            >
            </el-table-column>
            <el-table-column
              label="次数"
            >
              <template slot-scope="props">
                 <span v-if="props.row.rpSize">{{props.row.rpSize}}次</span>
                 <span v-else>{{props.row.rpSize}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="rpReason"
              label="原因"
              width="180"
            >
            </el-table-column>
            <el-table-column
              label="金额"
            >
              <template slot-scope="props">
                <span v-if="props.row.rpType=='REWARD'" style="font-size: 12px;color: #C2453A;">+{{props.row.rpAmount }}</span>
                <span v-if="props.row.rpType=='PUNISH'" style="font-size: 12px;color: #008000;">{{props.row.rpAmount }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="申述状态"
            >
              <template slot-scope="props">
                <span v-if="props.row.rpAppealStatus=='PASS'">已同意</span>
                <span v-if="props.row.rpAppealStatus=='REJECT'">已驳回</span>
                <span v-if="props.row.rpAppealStatus=='ING'">已申述待处理</span>
                <span v-if="props.row.rpAppealStatus=='NONE'">未申述</span>
              </template>
            </el-table-column>
            <el-table-column
              label="申述原因"
              prop="appealReason"
            >
            </el-table-column>
            <el-table-column
              label="驳回原因"
              prop="rejectReason"
            >
            </el-table-column>
            <el-table-column
              label="操作"
            >
              <template  slot-scope='props'>
                <el-button
                  size="small"
                  :class="props.row.rpAppealStatus!='NONE' ? 'disable-button':''"
                  :disabled="props.row.rpAppealStatus!='NONE'"
                  @click="complaint(props.row.perfmRpId)"
                >申诉</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination-depart" v-if="totalSalary>0">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="nowPage"
            :page-sizes="[10, 15, 50]"
            :page-size=pageSize
            layout="total, sizes, prev, pager, next, jumper"
            :total=totalSalary>
          </el-pagination>
        </div>
      </div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        size="tiny"
        top="30%"
        :before-close="handleClose">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="申诉原因" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc"></el-input>
          </el-form-item>
        </el-form>
          <span slot="footer" class="dialog-footer">
              <button  @click="resetForm('ruleForm')">取 消</button>
              <button  @click="submitForm('ruleForm')">确定</button>
            </span>
      </el-dialog>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
//  import Tab from 'components/common/tab'
  import {ERR_OK} from 'service/config'
  import { mapGetters} from 'vuex'
  import {getSalaryDetail,launchAppleal} from 'service/getData'
  export default {
    computed:{
      userView() {
        return this.singer.userView
      },
      ...mapGetters([
        'singer'
      ]),
    },
    data() {
      return {
        nowPage:1,
        pageSize:10,
        totalSalary:0,
        resultRed:[],
        dialogVisible:false,
        salaryBill:{},
        perfmRpId:"",
        ruleForm:{
          desc: ''
        },
        rules:{
          desc: [
            { required: true, message: '请填写申诉原因', trigger: 'blur' },
            { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
//      Tab
    },
    created(){
      this._getSalaryDetail()

    },
    methods:{
      handleSizeChange(val){
        this.pageSize = val
        this._getSalaryDetail()
      },
      handleCurrentChange(val){
        this.nowPage = val
        this._getSalaryDetail()
      },

//      取消
      resetForm(formName){
        this.dialogVisible=false;
        this.$refs[formName].resetFields();
      },
//      确定
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
             this._launchAppleal(this.perfmRpId)
             this.dialogVisible=false;
          } else {
            return false;
          }
        });
      },
      handleClose(){
        this.dialogVisible= false
        this.$refs['ruleForm'].resetFields();
      },
//      申诉
      complaint(perfmRpId){
        this.dialogVisible=true;
        this.perfmRpId=perfmRpId
        this.ruleForm.desc=""
      },
//红黑榜列表
      _getSalaryDetail(){
        var self=this;
        var param={
          nowPage:this.nowPage,
          pageShow:this.pageSize,
          id:this.$route.query.id
        }
        getSalaryDetail(param).then(function (res) {
          if (res.code == ERR_OK) {
            self.resultRed=res.data.page.result
            self.totalSalary=res.data.page.totalCount
            self.salaryBill=res.data.salaryBill
          }
        })
      },
//      发起申诉
      _launchAppleal(id){
        var param={
          rpReason:this.ruleForm.desc,
          perfmRpId:id
        }
        launchAppleal(param).then((res) =>{
          if (res.code == ERR_OK) {
            this.$notify({
              title: '成功',
              message: '申诉成功',
              type: 'success'
            });
            this._getSalaryDetail()
          }else{
            this.$notify.error({
              title: '错误',
              message: res.msg
            });
          }

        })
      }
    }
  }
</script>
<style lang="scss"  scoped>
  .title-header{
    height: 46px;
    opacity: 0.99;
    margin-top: 5px;
    background: rgba(217,52,55,0.10);
  }
  .yearList{
    float: left;
  }
  .year{
    display: inline-block;
    font-size: 14px;
    padding-left: 20px;
    height: 46px;
    line-height: 46px;
    color: #333333;
  }
  .month{
    display: inline-block;
    font-size: 14px;
    padding-left: 20px;
    height: 46px;
    line-height: 46px;
    color: #333333;
  }
  .monthList{
    float: left;
  }
  .redBang{
    margin-top: 15px;
  }
  .redBang_title{
    opacity: 0.99;
    background: rgba(217,52,55,0.02);
    height: 46px;
    border-top:1px solid rgba(0,0,0,0.12);
    border-left:1px solid rgba(0,0,0,0.12);
    border-right:1px solid rgba(0,0,0,0.12);
  }
  .red_text{
    display:inline-block;
    height: 46px;
    line-height: 46px;
    padding-left: 20px;
    font-size: 14px;
    color: #434343;
  }
</style>
