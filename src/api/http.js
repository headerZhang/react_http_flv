import axios from "axios";
import base64 from '../common/base64'
import { message } from 'antd'
import { getToken } from  '../common/auth'
 
/****** 创建axios实例 ******/
const service = axios.create({
  //baseURL: process.env.BASE_URL,  // api的base_url
  baseURL: '',
  //timeout: 10000  // 请求超时时间
})

/****** request拦截器==>对请求参数做处理 ******/
service.interceptors.request.use(config => {
  // 对登录接口的headers 进行特殊配置
  if (config.url === '/VMS2Service.cgi?Cmd=UserLogin') {
    config.headers['Authorization'] = "Basic " + base64.base64Encode(config.data.username + ':' + config.data.password)
  }else {
    // 其他接口发送时必须要带token,否则返回认证失败
    config.headers['Auth-Token'] = getToken('login').authToken
  }
  config.headers['Content-Type'] = 'application/json';

  return config;
}, error => {  //请求错误处理
  
  Promise.reject(error)
});

/****** respone拦截器==>对响应做处理 ******/
service.interceptors.response.use(
  response => {  //成功请求到数据
    let returnState = response.data.returnState
    if(response.status === 200 && returnState.stateCode === 0) {
      return response
    }else {
      message.error(returnState.errorMsg)
    }
    
    //这里根据后端提供的数据进行对应的处理
    
  },
  error => {  //响应错误处理
    console.log('error:',error);

    return Promise.reject(error)
  }
);
export default service;