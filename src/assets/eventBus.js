//一 .我们先来创建中央事件总线，在src/assets/下创建一个eventBus.js,内容如下
//（eventBus中我们只创建了一个新的Vue实例，以后它就承担起了组件之间通信的桥梁了，也就是中央事件总线。）

import Vue from 'vue'

export default new Vue;
