import * as types from './mutation-types'
import {getUserName} from '../service/getData'


export const  roles= function ({ commit },state) {
  return new Promise((resolve, reject) => {
    getUserName({token:state}).then((res)=>{
      if (res.code!="SUCCESS") { // 由于mockjs 不支持自定义状态码只能这样hack
        reject('error')
      }
      const data = res.data
      commit(types.SET_SINGER , res.data)
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

export const  LogOut= function ({ commit, state }) {
      commit(types.SET_SINGER , "")
}
export const setPageScrollTopByTaskManage = function ({ commit }, val) {
  commit(types.SET_PAGESCROLLTOP_BY_TASKMANAGE , val)
}
