import * as types from './mutation-types'
const mutations = {   // 修改到对象里面
  [types.LOGIN](state, data) {
    state.token = data;
  },
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.LOGOUT](state) {
    state.token = null
  },
  [types.TITLE](state, data) {
    state.title = data;
  },
  [types.SET_PAGESCROLLTOP_BY_TASKMANAGE](state, pageScrollTopByTaskManage) {
    state.pageScrollTopByTaskManage = pageScrollTopByTaskManage
  },
  
}
export default mutations
