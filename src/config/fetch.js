/*
 * @Author: laijianwen
 * @Date: 2017-09-20 14:31:28
 * @Last Modified by: 2017-09-20
 * @Last Modified time: 2017-09-20 14:31:28
 */
import {baseUrl} from './env'
import axios from 'axios'
import Qs from 'qs'
import router from '../router'
import {ERR_LOGIN} from '../service/config'
/**  axios基础配置 */
axios.defaults.baseURL=baseUrl;
axios.defaults.timeout = 5000;
axios.defaults.withCredentials=true;
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';


/** axios封装请求get,post,put,delete方法 */

export function fetchGet(url, params) {
  return new Promise((resolve, reject) => {
    url += (url.indexOf('?') < 0 ? '?' : '&') + param(params)
    axios.get(url)
      .then(response => {
        if(response.data.code==ERR_LOGIN || response.data.code=="noPermission"){
          router.push('/login')
        }else{
          resolve(response.data);
        }
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function fetchPost(url, params) {
  params= Qs.stringify(params);
  return new Promise((resolve, reject) => {
    //axios.defaults.headers['Content-Type'] = 'multipart/form-data'
    axios.post(url, params)
      .then(response => {
        if(response.data.code==ERR_LOGIN || response.data.code=="noPermission"){
        router.push('/login')
      }else{
        resolve(response.data);
      }
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function fetchPut(url, params) {
  params= Qs.stringify(params);
  return new Promise((resolve, reject) => {
    //axios.defaults.headers['Content-Type'] = 'multipart/form-data'
    axios.put(url, params)
      .then(response => {
        if(response.data.code==ERR_LOGIN || response.data.code=="noPermission"){
        router.push('/login')
      }else{
        resolve(response.data);
      }
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function param(data) { // 拼接字符串
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  return url ? url.substring(1) : ''  // 删掉第一个字母&
}
