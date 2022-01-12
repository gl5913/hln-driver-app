import config from './config.js'
import state from '../store/index.js'

const request = (url, options) => {
	let token = {
		access_token: state.state.access_token,
		refresh_token: state.state.refresh_token
	}
	let headers = {
		'Content-Type': 'application/x-www-form-urlencoded'
	}
	if(token.access_token != ""){
		headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization':'Bearer ' + token.access_token
		}
	}
  
	//以下接口不需要传token
	if(url == config.login_url || url == config.driver_url || url == config.check_url || url == config.code_url || url == config.version_url || url == config.refresh_url || url == config.buryingPoint_url){
   		headers = {
			'Content-Type': 'application/x-www-form-urlencoded'
   		}
	}
   
	return new Promise((resolve, reject) => {
		uni.onNetworkStatusChange(res => {
			if(!res.isConnected) {
				uni.showToast({
				    title: '网络不给力，请稍后',
						icon: 'none',
				    duration: 3000
				});
			}
		});
		
		uni.request({
			url: url,
			method: options.method,
			data: options.data,
			header: headers,
			success(request) {
				resolve(request.data)
			},
			complete(code) {
				if(code.statusCode == '401') {
					if(url == config.login_url){
					   // uni.showToast({ title: "用户名或密码错误", icon: "none",duration: 2000 ,mask:true});
					}else if(url == config.version_url){
						//啥事不干
					}else{
						uni.showToast({ title: "账号信息过期 ，正在跳往登录页",icon: "none" ,duration:2000, mask:true});
						setTimeout(() => {
							uni.reLaunch({
							   url: "/pages/login/login",
							});
						},1000)
					}
					
				} else if(code.statusCode == '403') {
					console.log('没权限');
					uni.navigateTo({
						url: "/pages/networkAnomaly/networkAnomaly?url=" + url + "&method=" + options.method + "&data=" + JSON.stringify(options.data) + "&header=" + JSON.stringify(headers)
					})
				} else if(code.statusCode == '404') {
					console.log('请求地址不存在');
					uni.navigateTo({
						url: "/pages/networkAnomaly/networkAnomaly?url=" + url + "&method=" + options.method + "&data=" + JSON.stringify(options.data) + "&header=" + JSON.stringify(headers)
					})
				} else if(code.statusCode == '502') {
					console.log('网关错误');
					uni.navigateTo({
						url: "/pages/networkAnomaly/networkAnomaly?url=" + url + "&method=" + options.method + "&data=" + JSON.stringify(options.data) + "&header=" + JSON.stringify(headers)
					})
				} else if(code.statusCode == '500') {
					console.log('服务器错误');
					uni.navigateTo({
						url: "/pages/networkAnomaly/networkAnomaly?url=" + url + "&method=" + options.method + "&data=" + JSON.stringify(options.data) + "&header=" + JSON.stringify(headers)
					})
				} else if(code.statusCode > '500') {
					console.log(code);
					uni.navigateTo({
						url: "/pages/networkAnomaly/networkAnomaly?url=" + url + "&method=" + options.method + "&data=" + JSON.stringify(options.data) + "&header=" + JSON.stringify(headers)
					})
				}
			},
			fail(error) {
				reject(error)
			}
		})
   })
}


const get = (url, options = {}) => {
	return request(url, { method: 'GET', data: options })
}

const post = (url, options) => {
	return request(url, { method: 'POST', data: options })
}

const put = (url, options) => {
	return request(url, { method: 'PUT', data: options })
}

const del = (url, options) => {
	return request(url, { method: 'DELETE', data: options })
}

module.exports = {
   get,
   post,
   put,
   del
}