import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		list: [
			{
				iconPath: "../../static/allocation_disabled.png",
				selectedIconPath: "../../static/allocation.png",
				text: '配货大厅',
				customIcon: false,
				pagePath: '/pages/allocation/allocation',
			},
			{
				iconPath: "../../static/message_disabled.png",
				selectedIconPath: "../../static/message.png",
				text: '消息中心',
				customIcon: false,
				pagePath: '/pages/message/message',
			},
			{
				iconPath: "../../static/order_disabled.png",
				selectedIconPath: "../../static/order.png",
				text: '我的订单',
				customIcon: false,
				pagePath: '/pages/order/order',
			},
			{
				iconPath: "../../static/my_disabled.png",
				selectedIconPath: "../../static/my.png",
				text: '我的',
				customIcon: false,
				pagePath: '/pages/my/my',
			}
		],
		access_token:"",
		refresh_token:"",
		// 状态栏高度
		statusBar: "",
		// 状态栏高度 + 导航栏高度
		customBar: "",
		// 装卸货地区
		area: [],
		// 经度
		lon: null,
		// 纬度
		lat: null,
	},
    mutations: {
		getAccessToken(state,info){
			state.access_token = info
		},
		getRefreshToken(state,info){
			state.refresh_token = info
		},
		// 经度
		getLon(state,info) {
			state.lon = info
		},
		// 纬度
		getLat(state,info) {
			state.lat = info
		},
		// 装卸货地区
		getArea(state,info) {
			state.area = info
		}
	},
    actions: {}
})
export default store