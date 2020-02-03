/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 *
 */
let baseUrl = '';
let routerMode = 'history';
if (process.env.NODE_ENV == 'development') {
     // baseUrl = 'https://lbsts.zhichecn.com/idss/';
     baseUrl = 'http://192.168.1.103:8081/idss/';
     // baseUrl = 'http://192.168.1.151:8080/idss/';
}else if(process.env.NODE_ENV == 'production'){
     baseUrl ='/idss/';
}
export {
  baseUrl,
  routerMode
}
