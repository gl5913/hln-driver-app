import Vue from 'vue'
import App from './App'
import uView from "uview-ui";

// 注册全局组件
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)

Vue.use(uView);

//系统错误捕获  
const errorHandler = (err, vm, info) => {  
	// handle error  
	// `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子  
	// 只在 2.2.0+ 可用   

	console.error('抛出全局异常');  
	console.log("message: " + err.message);  
	console.log("stack: " + err.stack);  
	console.error(err);  

	// let log = {  
	// 	message: err.message,  
	// 	stack: err.stack  
	// }  
	// uni.setStorage({  
	// 	key: 'errlog',  
	// 	data: log,  
	// 	success: function() {  
	// 		console.log('success');  
	// 	}  
	// });   
} 

Vue.config.errorHandler = errorHandler;  
Vue.prototype.$throw = (error) => errorHandler(error, this);

//引入vuex
import store from './store'
//把vuex定义成全局组件
Vue.prototype.$store = store;


//全局默认高度
// Vue.prototype.hearHeight = 20
// let myDate = new Date(),
// 	myYear = myDate.getFullYear(),
// 	myMonth = myDate.getMonth() + 1,
// 	myDay = myDate.getDate(),
// 	myDateNow = myYear + "-" + myMonth + "-" + myDay;
// 	Vue.prototype.$myDateNow = myDateNow

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	//挂载vuex
	store
})
app.$mount()
