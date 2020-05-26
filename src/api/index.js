import service from './http'
const baseUrl = "/VMS2Service.cgi?Cmd="

export default {
    /* 登录 */
    UserLogin(data) {
        return service({
            url: baseUrl + 'UserLogin',
            method: 'post',
            data
        })
    }

} 
