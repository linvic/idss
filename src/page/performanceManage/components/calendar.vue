<template>
    <div style="padding:20px">
        <div class="calendar_content">
            <table class="calendar_table" cellpadding="0" cellspacing="0" border="0">
                <thead>
                    <tr>
                        <th>周日</th>
                        <th>周一</th>
                        <th>周二</th>
                        <th>周三</th>
                        <th>周四</th>
                        <th>周五</th>
                        <th>周六</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in days" :key="index">
                        <td v-for="(j,jndex) in item" :key="jndex"
                            :class="{'disabled' : !j.isCur}" disabled>
                            <span>{{j.num}}</span>
                            
                            <div v-if="j.isCur">
                                <el-input class="calendar_td_input" type="textarea" v-model="j.situation" v-if="modelType === 2 || modelType === 3"></el-input>
                                <p :class="filterClass(j.situation)" v-else>{{j.situation}}</p>
                                
                                
                                <div class="calendar_td_desc">
                                    <!-- 核对考勤申诉页面 -->
                                    <template v-if="modelType === 0">
                                        
                                        <el-tooltip class="item" effect="dark" content="点击编辑说明" placement="top-start" v-if="j.outGoingDec">
                                            <span @click="editDesc(j)">{{j.outGoingDec}}</span>
                                        </el-tooltip>
                                        <el-button v-if="j.isOutGoing == 1 && !j.outGoingDec" class="calendar_td_btn" type="primary" plain size="mini" @click="editDesc(j)">填写说明</el-button>
                                        
                                    </template>
                                    
                                    <!-- 查看详情页面 -->
                                    <template v-if="modelType === 4">
                                        
                                        <el-tooltip class="item" effect="dark" content="点击查看说明" placement="top-start" v-if="j.outGoingDec">
                                            <!-- 仅查看 -->
                                            <span @click="seeDesc(j)" :class="{'el-color-primary': (j.status == -1 || j.status == 1)}">{{j.outGoingDec}}</span>
                                        </el-tooltip>
                                        
                                        <template v-if="j.outGoingDec">
                                            <i class="el-icon-circle-close" v-if="j.status == 0"></i>
                                            <i class="el-icon-question" style="color:#FFD400" v-if="(j.status == -1 || j.status == 1)"></i>
                                            <i class="el-icon-circle-check" style="color:#2795ff" v-if="(j.status == 2)"></i>
                                        </template>
                                    </template>

                                    <!-- 审核页面 -->
                                    <template v-if="modelType === 2">
                                        <el-tooltip class="item" effect="dark" content="点击查看说明" placement="top-start">
                                            <!-- 仅查看 -->
                                            <span @click="seeDesc(j)" :class="{'el-color-primary': (j.status == -1 || j.status == 1)}">{{j.outGoingDec}}</span>
                                        </el-tooltip>
                                        <template v-if="j.outGoingDec">
                                            <i class="el-icon-circle-close" v-if="j.status == 0"></i>
                                            <i class="el-icon-question" style="color:#FFD400" v-if="(j.status == -1 || j.status == 1)"></i>
                                            <i class="el-icon-circle-check" style="color:#2795ff" v-if="(j.status == 2)"></i>
                                        </template>
                                    </template>
                                    <!-- 审核页面 -->
                                    <!-- / 1.仅部门负责人审核,2.仅考勤管理员审核,3.部门部分人和考勤管理员审核 -->
                                    <template v-if="modelType === 1 || modelType === 3">
                                        <el-tooltip class="item" effect="dark" content="点击查看说明" placement="top-start" v-if="j.status == 0">
                                            <!-- 仅查看 -->
                                            <span @click="seeDesc(j)" :class="{'el-color-primary': (j.status == -1 || j.status == 1)}">{{j.outGoingDec}}</span>
                                        </el-tooltip>
                                        <el-tooltip class="item" effect="dark" content="点击编辑说明" placement="top-start" v-else>
                                            <!-- 能否认 -->
                                            <span @click="auditDesc(j)" :class="{'el-color-primary': (j.status == -1 || j.status == 1)}">{{j.outGoingDec}}</span>
                                        </el-tooltip>
                                        <template v-if="j.outGoingDec">
                                            <i class="el-icon-circle-close" v-if="j.status == 0"></i>
                                            <i class="el-icon-question" style="color:#FFD400" v-if="(j.status == -1 || j.status == 1)"></i>
                                            <i class="el-icon-circle-check" style="color:#2795ff" v-if="(j.status == 2)"></i>
                                        </template>

                                    </template>
                                    
                                    
                                    
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    data () {
        return {
            curMonth: '',
            days: [],
            stateArr: [],
            isEdit: false, //是否编辑
            deptLevel: '',
        }
    },
    filters: {
        filterMonth(val) {
            return moment(val).format('YYYY年MM月')
        }
    },
    props: {
        stateData: {
            type: String
        },
        examineDate: {
            type: String
        },
        modelType: {
            type: Number
        },
    },
    watch: {
        stateData: function(newVal,oldVal){
            this.curMonthHandle();
        }
    },
    mounted(){
        this.deptLevel = localStorage.getItem("deptLevel");
        this.curMonthHandle();
    },
    methods: {
        // 填写说明
        editDesc(j) {
            this.$prompt('说明：', '外出说明', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputType: 'textarea',
                inputValue: j.outGoingDec,
                inputPattern: /^[\s\S]{1,400}$/,
                inputErrorMessage: '请输入（400字符内）'
            }).then(({ value }) => {
                this.$set(j, 'outGoingDec', value);
            }).catch(() => {
            });
        },
        seeDesc(j) {
            let h = this.$createElement;
            let _title = '查看说明-';
            if (j.status == 0) {
                _title += '已否认';
            } else if (j.status == 1){
                _title += '二级部门已确认';
            } else if (j.status == 2){
                _title += '一级部门已确认';
            }

            this.$msgbox({
                title: _title,
                message: h('div', null, [
                    h('p', null, [
                        h('span', { style: 'color: #666' }, '外出说明：'),
                        h('span', { style: 'color: #666' }, j.outGoingDec)
                    ]),
                    h('p', { class: {'is-hide': !j.denyReason} }, [
                        h('span', { style: 'color: #666' }, '否认原因：'),
                        h('span', { style: 'color: #666' }, j.denyReason)
                    ]),
                ]),
                showCancelButton: false,
                confirmButtonText: '确定'
            }).then(action => {
            });
        },
        auditDesc(j) {
            let h = this.$createElement;
            this.$msgbox({
                title: '审核外出说明 ' + (j.day),
                message: h('p', null, [
                    h('span', { style: 'color: #666' }, '外出说明：'),
                    h('span', { style: 'color: #666' }, j.outGoingDec)
                ]),
                showCancelButton: true,
                distinguishCancelAndClose: true,
                confirmButtonText: '确定',
                cancelButtonText: '否认',
            }).then(action => {
                
                if (this.deptLevel == 'LEVEL_ONE') {
                    this.$set(j, 'status', 2);
                } 
                if (this.deptLevel == 'LEVEL_TWO') {
                    this.$set(j, 'status', 1);
                }
                
                this.$set(j, 'denyReason', '');
            }).catch(action => {
                if(action === 'cancel') {
                    
                    this.$prompt('外出说明：' + j.outGoingDec, '审核外出说明 ' + (j.day), {
                        confirmButtonText: '否认',
                        cancelButtonText: '取消',
                        inputType: 'textarea',
                        inputValue: j.denyReason,
                        inputPlaceholder: '请填写否认外出的原因',
                        inputPattern: /^[\s\S]{1,400}$/,
                        inputErrorMessage: '请输入（400字符内）'
                    }).then(({ value }) => {
                        this.$set(j, 'denyReason', value);
                        this.$set(j, 'status', 0);
                    }).catch(() => {
                    });
                }
            });

        },
        filterClass(text) {
            let clatxt = 'calendar_td_p';
            if (text.indexOf('迟到') > -1 || text.indexOf('早退') > -1 || text.indexOf('缺卡') > -1 || text.indexOf('旷工') > -1) {
                clatxt += ' color1'
            } if (text.indexOf('假') > -1 || text.indexOf('调休') > -1 || text.indexOf('加班') > -1) {
                clatxt += ' color2'
            } if (text.indexOf('外出') > -1 || text.indexOf('出差') > -1) {
                clatxt += ' color3'
            }
            return clatxt;
        },
        monthDay(date) {
            let daysArr = [[], [], [], [], [], []]; // 6*7的日历数组
            let currentWeekday = moment(date).date(1).weekday(); // 获取当月1日为星期几
            let lastMonthDays = moment(date).subtract(1, 'month').daysInMonth(); // 获取上月天数
            let currentMonthDays = moment(date).daysInMonth(); // 获取当月天数
            let lastMonth = moment(date).subtract(1, 'month').format('YYYY-MM'); // 获取上月名称
            let currenMonth = moment(date).format('YYYY-MM'); // 获取当月名称
            let nextMonth = moment(date).add(1, 'month').format('YYYY-MM'); // 获取下月名称

            let dayRowCount = Math.ceil((currentWeekday +currentMonthDays )/7);// 多少行
            console.log(dayRowCount + '行')
            const getDay = (day) => {
                let _days = {};
                if (day <= lastMonthDays) { // 小于上月天数的 ? 直接显示
                    
                    _days.num = day;
                    _days.isCur = false; // 是否当月
                    let dd = day < 10 ? '0' + day : day;
                    _days.day = lastMonth + '-' + dd;
                    return _days;

                } else if (day <= (lastMonthDays + currentMonthDays)){ // 当月的区域

                    _days.num = (day - lastMonthDays);
                    _days.isCur = true;
                    let dd = (day - lastMonthDays) < 10 ? '0' + (day - lastMonthDays) : (day - lastMonthDays);
                    _days.day = currenMonth + '-' + dd;
                    return _days;

                } else { // 下月的区域

                    _days.num = (day - (lastMonthDays + currentMonthDays));
                    _days.isCur = false; // 是否当月
                    let dd = (day - (lastMonthDays + currentMonthDays)) < 10 ? '0' + (day - (lastMonthDays + currentMonthDays)) : (day - (lastMonthDays + currentMonthDays));
                    _days.day = nextMonth + '-' + dd;
                    return _days;

                }
            }; // 日期处理
            for (let i = 0; i < 7; i += 1) {
                let virtualDay = (lastMonthDays - currentWeekday) + i + 1;
                for (let j = 0; j < dayRowCount; j += 1) {
                    daysArr[j][i] = getDay(virtualDay + (j * 7));
                    for(let item of this.stateArr) {
                        if (item.day === daysArr[j][i].day) {
                            daysArr[j][i].situation = item.situation;
                            daysArr[j][i].isOutGoing = item.isOutGoing;  // 是否外出
                            daysArr[j][i].outGoingDec = item.outGoingDec;  // 是否外出
                            daysArr[j][i].denyReason = item.denyReason;  // 是否外出
                            
                            daysArr[j][i].status = item.status; // 是否已确认
                        }
                    }
                }
            }
            this.days = daysArr;
            // 状态处理
        },
        curMonthHandle() { // 当月
            if (!this.stateData) {return false;}
            var _stateArr = JSON.parse(this.stateData);
            for(let i = 0, l = _stateArr.length; i < l; i++) {
                let item = _stateArr[i];
                let day = i < 9 ? ('0' + (i + 1)) : (i + 1);
                item.day = this.examineDate + '-' +day;
            }
            this.stateArr = [..._stateArr]
            if (this.examineDate) {
                this.curMonth = moment(this.examineDate).format('YYYY-MM');
            } else {
                this.curMonth = moment().format('YYYY-MM');
            }
            console.log('当前月',this.curMonth)
            this.monthDay(this.curMonth);
        }
    }
}
</script>

<style scoped lang="scss">
.is-hide {
    display: none;
}
.color1 {
    color: #D93538;
}
.color2 {
    color: #FF9900;
}
.color3 {
    color: #3857FF;
}
.calendar_header {
    width: 100%;
    margin: 15px auto;
    text-align: center;
    .calendar_header_date {
        width: 140px;
        text-align: center;
        cursor: pointer;
        /deep/ input {
            border: none;
        }
    }
    button {
        outline: none;
        border: 0;
        background: #fff;
        margin: 0px 10px;
        cursor: pointer;
        line-height: 36px;
    }
    .fl {
        float: left;
    }
    .fr {
        float: right;
    }
}
.calendar_content {

    .calendar_table {
        width: 100%;
        text-align: center;
        border-collapse: collapse;
        table-layout: fixed;
        thead th {
            padding: 16px 8px;
            border-bottom: 1px solid #eee;
            border: 1px solid #D8D8D8;
        }
        tbody td {
            margin: 2px;
            padding: 16px;
            border: 1px solid #D8D8D8;
            font-size: 12px;
            color: #878A9A;
            text-align: left;
            vertical-align: top;
            &.disabled {
                color: #c0c4cc;
            }
            > span {
                display: inline-block;
                border-radius: 24px;
                margin-bottom: 18px;
            }
            .calendar_td_p {
                min-height: 54px;
            }
            .calendar_td_input {

            }
            .calendar_td_btn {
                margin-top: 5px;
            }
            .calendar_td_desc {
                width: 100%;
                display: flex;
                line-height: 12px;
                margin-top: 3px;
                color: #292A32;
                cursor: pointer;
                span {
                    flex: 1;
                    display: inline-block;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    vertical-align: middle;
                }
                i {
                    vertical-align: middle;
                    color: #D93437;
                }
            }
        }
    }
}
</style>
