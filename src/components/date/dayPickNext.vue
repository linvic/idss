<template>
    <div class="day-picks" @click.stop="" ref="dayPicks">
        <div class="day-picks-input" @click="isShowPlan = true">{{titlesTxt(minDay.type)}}{{minDay.value}}日 - {{titlesTxt(maxDay.type)}}{{maxDay.value}}日 <i class="el-input__icon el-icon-date"></i></div>
        <div class="day-picks-panel el-picker-panel el-date-range-picker" v-show="isShowPlan">
            <div class="el-picker-panel__body-wrapper">
                <!---->
                <div class="el-picker-panel__body">
                    <!---->
                    <div class="el-picker-panel__content el-date-range-picker__content is-left">
                        <div class="el-date-range-picker__header">
                            <span>{{titlesTxt(titles[0])}}</span>
                        </div>
                        <table cellspacing="0" cellpadding="0" class="el-date-table">
                            <tbody>
                                <template v-for="weekIndex in 5">
                                    <tr class="el-date-table__row">
                                        <td @click="changeValue((weekIndex * 7 -7 + dayIndex))"
                                            :class="{
                                                'available': true,
                                                'in-range':
                                                    endTime
                                                    &&
                                                    ((weekIndex * 7 -7 + dayIndex) > startTime)
                                                    &&
                                                    ((weekIndex * 7 -7 + dayIndex) < endTime),
                                                'current': 
                                                    ((weekIndex * 7 -7 + dayIndex) === startTime && startTime < 100)
                                                    ||
                                                    ((weekIndex * 7 -7 + dayIndex) === endTime && endTime < 100)
                                                

                                            }"
                                            v-for="dayIndex in 7" v-show="(weekIndex * 7 -7 + dayIndex) <= 31">{{weekIndex * 7 -7 + dayIndex}}</td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                    <div class="el-picker-panel__content el-date-range-picker__content is-right">
                        <div class="el-date-range-picker__header">
                            <span>{{titlesTxt(titles[1])}}</span>
                        </div>
                        <table cellspacing="0" cellpadding="0" class="el-date-table">
                            <tbody>
                                <template v-for="weekIndex in 5">
                                    <tr class="el-date-table__row">
                                        <td @click="changeValue((weekIndex * 7 -7 + dayIndex + 100))"
                                            :class="{
                                                'available': true,
                                                'in-range':
                                                    endTime
                                                    &&
                                                    ((weekIndex * 7 -7 + dayIndex + 100) > startTime)
                                                    &&
                                                    ((weekIndex * 7 -7 + dayIndex + 100) < endTime),
                                                'current': 
                                                    ((weekIndex * 7 -7 + dayIndex + 100) === startTime && startTime > 100)
                                                    ||
                                                    ((weekIndex * 7 -7 + dayIndex + 100) === endTime && endTime > 100)}"
                                            v-for="dayIndex in 7" v-show="(weekIndex * 7 -7 + dayIndex) <= 31">{{weekIndex * 7 -7 + dayIndex}}</td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <i class="el-icon-close" @click="close"></i>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: [String],
            default: '0/1,0/2'
        },
        titles: {
            type: [Array],
            default: function(i) {
                return ['当月', '次月']
            }
        }
    },
    data () {
        return {
            isShowPlan: false,

            clickCount: 0, // 点击次数

            startTime: '',
            endTime: '',
        }
    },
    computed: {
        minDay: function() {
            if (!this.value) {
                return {
                    type: '-',
                    value: '-'
                }
            }
            let minDayStr = this.value.split(',')[0];
            let minDayObj = minDayStr.split('/').map(Number);
            return {
                type: minDayObj[0],
                value: minDayObj[1]
            }
        },
        maxDay: function() {
            if (!this.value) {
                return {
                    type: '-',
                    value: '-'
                }
            }
            let minDayStr = this.value.split(',')[1];
            let minDayObj = minDayStr.split('/').map(Number);
            return {
                type: minDayObj[0],
                value: minDayObj[1]
            }
        }
    },
    created() {

    },
    watch: {
        filterForm: {
            handler(newVal, oldVal) {
                

                if (this.minDay.type == this.titles[0]) {
                    this.startTime = this.minDay.value;
                } else if (this.minDay.type == this.titles[1]) {
                    this.startTime = this.minDay.value + 100;
                }
                
                if (this.maxDay.type == this.titles[0]) {
                    this.endTime = this.maxDay.value;
                } else if (this.maxDay.type == this.titles[1]) {
                    this.endTime = this.maxDay.value + 100;
                }

                // if (this.minDay.type !== this.maxDay.type) {
                //     this.endTime = this.maxDay.value + 100;
                // } else {
                //     this.endTime = this.maxDay.value;
                // }
            },
            immediate: true,
            deep: true
        }
    },
    mounted() {
        document.addEventListener('click',(e)=>{
            if(this.$refs.dayPicks && !this.$refs.dayPicks.contains(e.target)){
                this.close();
            }
        })
    },
    methods: {
        changeValue(Value) {
            this.clickCount++;
            if (this.clickCount % 2 == 1) {
                this.startTime = Value;
                this.endTime = '';
            } else {
                this.endTime = Value;
                if (this.startTime > this.endTime) {
                    this.endTime = this.startTime;
                    this.startTime = Value;
                }
            }
            let newVal = '';
            if (this.startTime < 100) {
                newVal += this.titles[0];
                newVal += '/' + this.startTime;
            } else {
                newVal += this.titles[1];
                newVal += '/' + (this.startTime - 100);
            }
            if (this.endTime) {
                newVal += ','
                if (this.endTime < 100) {
                    newVal += this.titles[0];
                    newVal += '/' + this.endTime;
                } else {
                    newVal += this.titles[1];
                    newVal += '/' + (this.endTime - 100);
                }
            }
            if (this.startTime && this.endTime && newVal.split(',').length > 1) {
                this.close();
                this.$emit('input', newVal);
            }
        },
        titlesTxt(titlesVal) {
            switch(Number(titlesVal)) {
                case -1:
                    return '上月';
                    break;
                case 0:
                    return '本月';
                    break;
                case 1:
                    return '下月';
                    break;
                default:
                    return '-月';
                    break;
            }
        },
        close() {
            if (!this.startTime || !this.endTime) {
                this.startTime = this.minDay.value;
                if (this.minDay.type !== this.maxDay.value) {
                    this.endTime = this.maxDay.value + 100;
                } else {
                    this.endTime = this.maxDay.value;
                }
            }
            this.clickCount = 0;
            this.isShowPlan = false;
        }
    }
}
</script>

<style scoped lang="scss">

    
.day-picks {
    position: relative;
    display: inline-block;
    .day-picks-input {
        position: relative;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #bfcbd9;
        box-sizing: border-box;
        color: #1f2d3d;
        display: inline-block;
        font-size: inherit;
        height: 36px;
        line-height: 36px;
        outline: none;
        padding: 0 10px;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        width: 190px;
        .el-input__icon {
            line-height: 0;
        }
    }
    .day-picks-panel {
        position: absolute;
        top: 36px;
        left: 0;
        z-index: 99999;
        td {
            &.in-range {
                background-color: #f2f6fc;
            }
            &.current {
                background-color: #409eff;
                color: #fff;
            }
        }
        .el-icon-close {
            position: absolute;
            right: 0;
            top: 0;
            padding: 10px;
            cursor: pointer;
            &:hover {
                color: #20a0ff;
            }
        }
    }
}
</style>
