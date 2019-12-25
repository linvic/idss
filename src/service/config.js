// 写一些固定参数

export const ERR_OK = "SUCCESS" //请求成功
export const ERR_LOGIN = "needLogin" //需要重新登陆
//权限值
export const SYS ="SYS " //系统设置
export const DAILY="DAILY" //日报
export const WEEKLY="WEEKLY" //周报
export const INDEX="INDEX" //首页欢迎页
export const TASK  ="TASK  " // 任务管理
export const PERFM ="PERFM " // 绩效管理
export const PALN ="PALN " // 计划管理
export const SUMMAR ="点击填写今日总结 " // 计划管理
//日期格式化2017-10-26的格式
export function formatDateTime(date) {
  var   reg   = /^(\d{4})-(\d{2})-(\d{2})/;
  if(reg.test(date)){
    return date
  }else{
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d
  }
};
//日期格式化2017-10的格式
export function formatDateMonth(date) {
  var   reg   = /^(\d{4})-(\d{2})-(\d{2})/;
  if(reg.test(date)){
    return date
  }else{
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    return y + '-' + m
  }
};
export const score=[
  {
  value:0,
  label: '0'
  },
  {
  value:1,
  label: '1'
},
  {
    value:2,
    label: '2'
  },
  {
    value:3,
    label: '3'
  },
  {
    value:4,
    label: '4'
  },
  {
    value:5,
    label: '5'
  },
  {
    value:6,
    label: '6'
  },{
    value:7,
    label: '7'
  },
  {
    value:8,
    label: '8'
  },
  {
    value:9,
    label: '9'
  },{
    value:10,
    label: '10'
  },{
    value:11,
    label: '11'
  },{
    value:12,
    label: '12'
  },{
    value:13,
    label: '13'
  },{
    value:14,
    label: '14'
  },{
    value:15,
    label: '15'
  },{
    value:16,
    label: '16'
  },{
    value:17,
    label: '17'
  },{
    value:18,
    label: '18'
  },{
    value:19,
    label: '19'
  },
  {
    value:20,
    label: '20'
  }
];

export const ImportantLevel= [{
  value: '',
  label: '请选择重要等级'
}, {
  value: 'COMPANY',
  label: '公司重点'
}, {
  value: 'DEPARTMENT',
  label: '部门重点'
}, {
  value: 'PERSONALIMP',
  label: '个人重点'
}, {
  value: 'PERSONALORD',
  label: '个人普通'
}];
//是否重复
export const isRepetition=[{
  value: 'NOREPEAT',
  label: '永不'
}, {
  value: 'REPEATDAILY',
  label: '每天重复'
}, {
  value: 'REPEATWEEKLY',
  label: '每周重复'
}, {
  value: 'REPEATMONTHLY',
  label: '每月重复'
}]
//完成质量
export  const finishMass=[
  {
    value: 'NONE',
    label: '全部'
  }
  ,
  {
  value: 'EXCELLENT',
  label: '优'
}, {
  value: 'GOOD',
  label: '良'
}, {
  value: 'SECONDARY',
  label: '中'
}, {
  value: 'DIFFERENCE',
  label: '差'
},
  {
    value: 'POOR',
    label: '很差'
  }
]
//完成时间
export const finishTime=[
  {
    value: 'NONE',
    label: '全部'
  },
  {
  value: 'AHEAD',
  label: '提前'
},
{
  value: 'ONTIME',
  label: '正常'
},
  {
    value: 'OVERDUE',
    label: '逾期'
  }
]
//月份
export const month=[
  {
    value: 0,
    label: '全部'
  },
  {
    value:1,
    label: '一月'
  },
  {
    value: 2,
    label: '二月'
  },
  {
    value:3,
    label: '三月'
  },
  {
    value:4,
    label: '四月'
  },
  {
    value: 5,
    label: '五月'
  },
  {
    value: 6,
    label: '六月'
  },
  {
    value:7,
    label: '七月'
  },
  {
    value:8,
    label: '八月'
  },
  {
    value: 9,
    label: '九月'
  },
  {
    value: 10,
    label: '十月'
  },
  {
    value:11,
    label: '十一月'
  },
  {
    value:12,
    label: '十二月'
  }
]
//金额
export const amount=[
  {
    value: -9999,
    label: '全部'
  },
  {
    value:50,
    label: '50'
  },
  {
    value: 100,
    label: '100'
  },
  {
    value:200,
    label: '200'
  },
  {
    value:500,
    label: '500'
  }
]
