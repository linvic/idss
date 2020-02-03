// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import './style/element-variables.scss'
import App from './App'

import './style/cloak.css' //解决v-if和v-show的闪烁问题
Vue.use(ElementUI, {size: 'medium', zIndex: '3000'}) // size: 组件的默认尺寸 zIndex 弹框的初始2000
Vue.config.productionTip = false
Vue.use(ElementUI);
/*eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

Vue.mixin({
	methods: {
		// 输入框的一些验证方法
		// 价格输入
		// 输入框价格输入限制 两位小数
		onkeyupPrice(e) {
			var val = e.target.value
			//得到第一个字符是否为负号
			var t = val.charAt(0);
			//先把非数字的都替换掉，除了数字和.     
			val = val.replace(/[^\d\.]/g, '');
			//必须保证第一个为数字而不是.       
			val = val.replace(/^\./g, '');
			//保证只有出现一个.而没有多个.       
			val = val.replace(/\.{2,}/g, '.');
			//保证.只出现一次，而不能出现两次以上       
			val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
			val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
			//如果第一位是负号，则允许添加    
			// if (t == '-') {
			//     return;
			// }
			e.target.value = val;
		},
		// 正整数
		onkeyupPlusInt(e){
			var val = e.target.value
			if (val.length == 1) {
				val = val.replace(/[^1-9]/g,'')
			} else {
				val = val.replace(/\D/g,'')
			}
			if(val == 0) { val = '' };
			e.target.value = val;
    },
		// 汉字
		onkeyupChinese(e){
			var val = e.target.value
      val = val.replace(/([^\u4e00-\u9fa5])/g,'');
			e.target.value = val;
    },
	}
})