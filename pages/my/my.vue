<template>
	<view class="my" :style="bgColor">
		<u-navbar z-index="1000" :is-back="false" title="我的" :background="topBackground" :border-bottom="false">
			<view slot="right" class="slot-wrap" @click="personal">
				<Icon :iconType="'iconshezhi'" extClass="shezhi"></Icon>
			</view>
		</u-navbar>
		
		<view class="myCon">
			<view class="myCon-message">
				<view class="myCon-conts">
					<view class="myCon-message-left" @click="personal">
						<image v-if="myMessage.headPortrait != null" style="width: 120rpx; height: 120rpx; border-radius: 50%;" :src="myMessage.headPortrait"></image>
						<image v-else style="width: 120rpx; height: 120rpx; border-radius: 50%;" src="../../static/head-portrait.png"></image>
					</view>
					<view class="myCon-message-right">
						<view class="myCon-message-right-top">{{ myMessage.idCardName == null ? phone : myMessage.idCardName }}</view>
						<view class="myCon-message-right-bot">
							<view class="myCon-message-right-bot-left" :style="(myMessage.carCertificationStatus == 1 && myMessage.userCertificationStatus == 0) ? flexDir : ''">
								<view class="myCon-message-right-bot-both" :style="myMessage.userCertificationStatus == 0 ? minbgColor : ''">
									<view class="both-img" :style="myMessage.userCertificationStatus == 0 ? textbgColor : ''">
										<Icon :iconType="'iconduigouCheng'" extClass="duigou" v-if="myMessage.userCertificationStatus == 1"></Icon>
										<Icon :iconType="'iconwebWeirenzheng'" extClass="weirenzheng" v-else></Icon>
									</view>
									<view class="both-text">实名认证</view>
								</view>
								<view class="myCon-message-right-bot-both" :style="myMessage.carCertificationStatus == 0 ? minbgColor : ''">
									<view class="both-img" :style="myMessage.carCertificationStatus == 0 ? textbgColor : ''">
										<Icon :iconType="'iconduigouCheng'" extClass="duigou" v-if="myMessage.carCertificationStatus == 1"></Icon>
										<Icon :iconType="'iconwebWeirenzheng'" extClass="weirenzheng" v-else></Icon>
									</view>
									<view class="both-text">运输认证</view>
								</view>
							</view>
							<view class="myCon-message-right-bot-right">
								<view class="myCon-message-right-bot-right-text" @click="goAuth" v-if="myMessage.carCertificationStatus == 0 && myMessage.userCertificationStatus == 0">立即认证</view>
								<view class="myCon-message-right-bot-right-text" @click="goAuth" v-if="myMessage.userCertificationStatus == 0 && myMessage.carCertificationStatus != 0">立即实名认证</view>
								<view class="myCon-message-right-bot-right-text" @click="goCarAuth" v-if="myMessage.carCertificationStatus == 0 && myMessage.userCertificationStatus != 0">立即运输认证</view>
								<u-icon name="arrow-right-double" color="red" size="20" v-if="myMessage.carCertificationStatus == 0 || myMessage.userCertificationStatus == 0"></u-icon>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="myCon-bots">
				<!-- 我的钱包 -->
				<view class="myPurse" style="height: 100rpx;" @click="goMyWallet">
					<view class="myPurse-top" style="flex: 1;">
						<view class="myPurse-top-left">
							我的钱包
						</view>
						<view class="myPurse-top-rightss">
							<view class="myPurse-bot-both-text">余额</view>
							<view class="myPurse-bot-both-tit">{{ parseFloat(myMessage.availableBalance).toFixed(2) }}</view>
						</view>
					</view>
				</view>
				
				<!-- 我的订单 -->
				<view class="myPurse" style="height: 200rpx;">
					<view class="myPurse-top">
						<view class="myPurse-top-left">
							我的订单
						</view>
						<view class="myPurse-top-right" @click="goOrderList(-1)">
							全部订单
						</view>
					</view>
					<view class="myPurse-botss">
						<view @click="goOrderList(index + 1)" class="myPurse-botss-item" v-for="(item,index) of orderList" :key="index">
							<Icon :iconType="item.img" extClass="dindan"></Icon>
							<view class="myPurse-botss-item-tit">{{ item.name }}</view>
						</view>
					</view>
				</view>
				
				<!-- 常用服务 -->
				<view class="myPurse" style="height: 200rpx;">
					<view class="myPurse-top">
						<view class="myPurse-top-left">
							常用服务
						</view>
					</view>
					<view class="myPurse-botss">
						<view @click="goServe(index)" class="myPurse-botss-item" v-for="(item,index) of serveList" :key="index">
							<Icon :iconType="item.img" extClass="fuwu"></Icon>
							<view class="myPurse-botss-item-tit">{{ item.name }}</view>
						</view>
					</view>
				</view>
				
				<!-- 我的预约 -->
				<view class="myPurse" style="height: 200rpx;">
					<view class="myPurse-top">
						<view class="myPurse-top-left">
							我的预约
						</view>
					</view>
					<view class="myPurse-botss">
						<view class="myPurse-botss-item">
							<view class="myPurse-botss-item-num">{{ mySubscribe.tempPreCount }}</view>
							<view class="myPurse-botss-item-tit">总预约</view>
						</view>
						<view class="myPurse-botss-item">
							<view class="myPurse-botss-item-num">{{ mySubscribe.tempPreOutCount }}</view>
							<view class="myPurse-botss-item-tit">装货预约</view>
						</view>
						<view class="myPurse-botss-item">
							<view class="myPurse-botss-item-num">{{ mySubscribe.tempPreInCount }}</view>
							<view class="myPurse-botss-item-tit">卸货预约</view>
						</view>
						<view @click="goBookingHall" class="myPurse-botss-item">
							<view class="myPurse-botss-item-num" style="background: #FD8624;">
								<Icon iconType="iconguanlidating" extClass="fuwu"></Icon>
							</view>
							<view class="myPurse-botss-item-tit">预约大厅</view>
						</view>
					</view>
				</view>
				
				<!-- 收款码 -->
				<!-- <view class="myPurse" style="height: auto;">
					<view class="myPurse-top" style="margin: 15rpx 0;">
						<view class="myPurse-top-left">
							收款码
						</view>
					</view>
					<view class="myPurse-botsss">
						<view class="myPurse-botsss-top">支付宝扫一扫，向我付款</view>
						<view class="myPurse-botsss-mid">
							<image style="height: 100%; width: 100%;" src="../../static/collection.png" mode="aspectFit"></image>
						</view>
						<view class="myPurse-botsss-bot">打开支付宝[扫一扫]</view>
						<view class="myPurse-botsss-bots">客户付款后，请致电<text @click="telPhone" style="color: #FD8624;">0571-83189533</text>确认</view>
					</view>
				</view> -->
			</view>
		</view>
		
		<!-- 去认证 -->
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}"
		 :closeable="true" v-model="authShow" mode="center">
			<view class="hintTit">温馨提示</view>
			<view class="hintCon">{{ authText }}</view>
			<view class="hintBtn" @click="goAuth2">立即认证</view>
		</u-popup>
		
		<!-- 与包裹页面所有内容的元素u-page同级，且在它的下方 -->
		<!-- <u-tabbar :before-switch="beforeSwitch" active-color="#FB6E2F" inactive-color="#666666" height="110" :list="list" :mid-button="true"></u-tabbar> -->
	</view>
</template>

<script>
	import config from '../../service/config.js';
	import ajax from '../../service/ajax.js';
	import moment from 'moment';
	import burying from '../../common/request.js';
	
	export default {
		data() {
			return {
				list: this.$store.state.list,
				// 顶部导航的背景
				topBackground: {
					// 渐变色
					// background: 'rgba(255, 194, 77, 0)',
					// backgroundImage: 'linear-gradient(#FEE35F 0%, #FEE45E 100%)',
				},
				bgColor: {
					backgroundImage: 'linear-gradient(180deg, #FFE14C 0%, rgba(255, 194, 77, 0) 68%, rgba(255, 194, 77, 0) 100%)',
				},
				minbgColor: {background: '#f1f2f6'},
				textbgColor: {background: '#666666'},
				flexDir: {flexDirection: 'row-reverse'},
				phone: '',
				
				// 订单列表
				orderList: [
					{
						img: 'icondaiquerenWode1',
						name: "待确认"
					},
					{
						img: 'iconyunshuzhongWode1',
						name: "运输中"
					},
					{
						img: 'icondaizhifuWode1',
						name: "待支付"
					},
					{
						img: 'icondaipingjiaWode1',
						name: "待评价"
					},
					{
						img: 'iconquxiao1',
						name: "已取消"
					}
				],
				
				// 服务列表
				serveList: [
					{
						img: 'iconpingjia',
						name: "我的评价"
					},
					{
						img: 'iconzongheHuoyunwuliu',
						name: "车辆管理"
					},
					{
						img: 'iconkefu',
						name: "联系客服"
					},
					{
						img: 'iconfankui1',
						name: "注册协议"
					},
					{
						img: 'iconfankui1',
						name: "隐私政策"
					}
				],
				
				// 我的信息
				myMessage: '',
				
				// 我的预约统计
				mySubscribe: {
					tempPreCount: '0',
					tempPreInCount: '0',
					tempPreOutCount: '0'
				},
				
				authText: '',
				authType: 0,
				authShow: false,
				
				plateNumber: '',
			}
		},
		onLoad() {
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "我的页面加载",
				// 异常信息
				bugInfo: null,
				// 页面参数
				pageParams: null,
				// 接口名称
				intName: null,
				// 入参
				enterParams: null,
				// 出参
				outParams: null,
				// 前端编码
				webId: null
			};
			
			let info = {
				operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
				page: "112",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onShow() {
			uni.showTabBar();
			this.getMyMessage();
			this.getMySubscribe();
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "我的页面显示",
				// 异常信息
				bugInfo: null,
				// 页面参数
				pageParams: null,
				// 接口名称
				intName: null,
				// 入参
				enterParams: null,
				// 出参
				outParams: null,
				// 前端编码
				webId: null
			};
			
			let info = {
				operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
				page: "112",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onUnload() {
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "我的页面卸载",
				// 异常信息
				bugInfo: null,
				// 页面参数
				pageParams: null,
				// 接口名称
				intName: null,
				// 入参
				enterParams: null,
				// 出参
				outParams: null,
				// 前端编码
				webId: null
			};
			
			let info = {
				operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
				page: "112",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		watch: {
		    authShow: {
		        handler(val) {
		            if(val) {
						uni.hideTabBar();
					} else {
						uni.showTabBar();
					}
		        }
		    }
		},
		methods: {
			beforeSwitch(index) {
				let routes = getCurrentPages();
				let curRoute = routes[routes.length - 1].route;
				if(index == 0 && curRoute != 'pages/allocation/allocation') {
					uni.reLaunch({
						url: "/pages/allocation/allocation"
					})
				} else if(index == 1 && curRoute != 'pages/message/message') {
					uni.reLaunch({
						url: "/pages/message/message"
					})
				} else if(index == 2 && curRoute != 'pages/order/order') {
					uni.reLaunch({
						url: "/pages/order/order"
					})
				} else if(index == 3 && curRoute != 'pages/my/my') {
					uni.reLaunch({
						url: "/pages/my/my"
					})
				}
			},
			
			telPhone() {
				uni.makePhoneCall({
				    phoneNumber: "0571-83189533"
				});
			},
			
			// 跳转到预约大厅
			goBookingHall() {
				if(this.myMessage.userCertificationStatus == 0 && this.myMessage.carCertificationStatus == 0) {
					this.authText = '无法进行预约，请先进行认证';
					this.authType = 1;
					this.authShow = true;
				} else if(this.myMessage.userCertificationStatus == 1 && this.myMessage.carCertificationStatus == 0) {
					this.authText = '无法进行预约，请先进行运输认证';
					this.authType = 2;
					this.authShow = true;
				} else if(this.myMessage.userCertificationStatus == 0 && this.myMessage.carCertificationStatus == 1) {
					this.authText = '无法进行预约，请先进行实名认证';
					this.authType = 3;
					this.authShow = true;
				}  else if(this.myMessage.userCertificationStatus == 1 && this.myMessage.carCertificationStatus == 1) {
					this.authShow = false;
					uni.navigateTo({
						url: "/pages/bookingHall/bookingHall" + `?plateNumber=${this.plateNumber}`
					})
				}
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到预约大厅",
					// 异常信息
					bugInfo: null,
					// 页面参数
					pageParams: null,
					// 接口名称
					intName: null,
					// 入参
					enterParams: null,
					// 出参
					outParams: null,
					// 前端编码
					webId: null
				};
				
				let info = {
					operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
					page: "112",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 跳转到个人中心
			personal() {
				uni.navigateTo({
					url: "/pages/personalCentre/personalCentre"
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到个人中心",
					// 异常信息
					bugInfo: null,
					// 页面参数
					pageParams: null,
					// 接口名称
					intName: null,
					// 入参
					enterParams: null,
					// 出参
					outParams: null,
					// 前端编码
					webId: null
				};
				
				let info = {
					operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
					page: "112",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 跳转到运输认证
			goCarAuth() {
				uni.navigateTo({
					url: "/pages/addCar/addCar?carAuthState=1"
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到运输认证",
					// 异常信息
					bugInfo: null,
					// 页面参数
					pageParams: null,
					// 接口名称
					intName: null,
					// 入参
					enterParams: null,
					// 出参
					outParams: null,
					// 前端编码
					webId: null
				};
				
				let info = {
					operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
					page: "112",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 跳转到实名认证
			goAuth() {
				uni.navigateTo({
					url: "/pages/myAuthentication/myAuthentication?authState=0"
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到实名认证",
					// 异常信息
					bugInfo: null,
					// 页面参数
					pageParams: null,
					// 接口名称
					intName: null,
					// 入参
					enterParams: null,
					// 出参
					outParams: null,
					// 前端编码
					webId: null
				};
				
				let info = {
					operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
					page: "112",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 跳转到服务
			goServe(index) {
				// console.log(index);
				if(index == 0) {
					uni.navigateTo({
						url: "/pages/myEvaluate/myEvaluate?phone=" + this.myMessage.phone + "&userNo=" + this.myMessage.userNo
					})
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "跳转到我的评价",
						// 异常信息
						bugInfo: null,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: null,
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "112",
						type: 1,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				} else if(index == 1) {
					uni.navigateTo({
						url: "/pages/myCar/myCar"
					})
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "跳转到我的车辆",
						// 异常信息
						bugInfo: null,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: null,
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "112",
						type: 1,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				} else if(index == 2) {
					uni.makePhoneCall({
					    phoneNumber: "0571-82814588"
					});
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "联系客服",
						// 异常信息
						bugInfo: null,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: null,
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "112",
						type: 1,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				} else if(index == 3) {
					uni.navigateTo({
						url: "/pages/pact/userServer/userServer",
					})
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "点击了注册协议",
						// 异常信息
						bugInfo: null,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: null,
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "112",
						type: 1,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				} else if(index == 4) {
					uni.navigateTo({
						url: "/pages/pact/privacyPolicy/privacyPolicy",
					})
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "点击了隐私协议",
						// 异常信息
						bugInfo: null,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: null,
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "112",
						type: 1,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				}
			},
			
			// 跳转到订单
			goOrderList(index) {
				console.log(index);
				
				if(index == -1) {
					uni.$emit('orderIndex', '-1');
				} else if(index == 1) {
					uni.$emit('orderIndex', '1');
				} else if(index == 2) {
					uni.$emit('orderIndex', '2');
				} else if(index == 3) {
					uni.$emit('orderIndex', '3');
				} else if(index == 4) {
					uni.$emit('orderIndex', '4');
				} else if(index == 5) {
					uni.$emit('orderIndex', '7');
				}
				
				uni.switchTab({
					url: "/pages/order/order"
				})
				
				// if(index == -1) {
				// 	uni.reLaunch({
				// 		url: "/pages/order/order"
				// 	})
				// } else if(index == 1) {
				// 	uni.reLaunch({
				// 		url: "/pages/order/order?index=1"
				// 	})
				// } else if(index == 2) {
				// 	uni.reLaunch({
				// 		url: "/pages/order/order?index=2"
				// 	})
				// } else if(index == 3) {
				// 	uni.reLaunch({
				// 		url: "/pages/order/order?index=3"
				// 	})
				// } else if(index == 4) {
				// 	uni.reLaunch({
				// 		url: "/pages/order/order?index=4"
				// 	})
				// } else if(index == 5) {
				// 	uni.reLaunch({
				// 		url: "/pages/order/order?index=6"
				// 	})
				// }
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到我的订单",
					// 异常信息
					bugInfo: null,
					// 页面参数
					pageParams: null,
					// 接口名称
					intName: null,
					// 入参
					enterParams: null,
					// 出参
					outParams: null,
					// 前端编码
					webId: null
				};
				
				let info = {
					operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
					page: "112",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 跳转到我的钱包
			goMyWallet() {
				uni.navigateTo({
					url: "/pages/myWallet/myWallet"
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到我的钱包",
					// 异常信息
					bugInfo: null,
					// 页面参数
					pageParams: null,
					// 接口名称
					intName: null,
					// 入参
					enterParams: null,
					// 出参
					outParams: null,
					// 前端编码
					webId: null
				};
				
				let info = {
					operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
					page: "112",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 获取我的预约统计
			getMySubscribe() {
				ajax.get(config.driverCar_url,{}).then(res => {
					console.log(res);
					if(res.code == 0){
						if(res.data && res.data.length > 0) {
							this.plateNumber = res.data[0].plateNumber;
							
							ajax.get(config.preReport_url,{
								carNumber: res.data[0].plateNumber
							}).then(reg => {
								console.log(reg);
								if(reg.code == 0){
									this.mySubscribe = reg.data;
								} else {
									console.log(reg);
									
									let content = {
										// 动作
										action: "click",
										// 节点
										node: "获取我的预约统计",
										// 异常信息
										bugInfo: reg.msg,
										// 页面参数
										pageParams: null,
										// 接口名称
										intName: "获取我的预约统计(temp/my-pre-report)",
										// 入参
										enterParams: {
											carNumber: res.data[0].plateNumber
										},
										// 出参
										outParams: reg,
										// 前端编码
										webId: null
									};
									
									let info = {
										operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
										page: "112",
										type: 2,
										content: JSON.stringify(content)
									};
									
									burying.point(info);
								}
							}).catch(err => {
								console.log("获取我的预约统计接口数据返回失败 error is :" + err);
								
								let content = {
									// 动作
									action: "click",
									// 节点
									node: "获取我的预约统计",
									// 异常信息
									bugInfo: err,
									// 页面参数
									pageParams: null,
									// 接口名称
									intName: "获取我的预约统计(temp/my-pre-report)",
									// 入参
									enterParams: {
										carNumber: res.data[0].plateNumber
									},
									// 出参
									outParams: null,
									// 前端编码
									webId: null
								};
								
								let info = {
									operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
									page: "112",
									type: 2,
									content: JSON.stringify(content)
								};
								
								burying.point(info);
							})
						}
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取我的车辆",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取我的车辆(personal-center/face-driver-car)",
							// 入参
							enterParams: null,
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "112",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取我的车辆接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取我的车辆",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取我的车辆(personal-center/face-driver-car)",
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "112",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 跳转到实名认证
			goAuth2() {
				this.authShow = false;
				if(this.authType == 1) {
					uni.navigateTo({
						url: "/pages/myAuthentication/myAuthentication?authState=2"
					})
				} else if(this.authType == 2) {
					uni.navigateTo({
						url: "/pages/addCar/addCar?carAuthState=1"
					})
				} else if(this.authType == 3) {
					uni.navigateTo({
						url: "/pages/myAuthentication/myAuthentication?authState=0"
					})
				}
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到实名认证",
					// 异常信息
					bugInfo: null,
					// 页面参数
					pageParams: null,
					// 接口名称
					intName: null,
					// 入参
					enterParams: null,
					// 出参
					outParams: null,
					// 前端编码
					webId: null
				};
				
				let info = {
					operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
					page: "112",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 获取我的信息
			getMyMessage() {
				uni.getStorage({
					key: 'username',
					success: reg => {
						ajax.get(config.userMess_url,{
							type: 2,
						}).then(res => {
							if(res.code == 0){
								this.myMessage = res.data;
								this.phone = this.myMessage.phone.substr(0,3) + '****' + this.myMessage.phone.substr(7);
							} else {
								console.log(res);
								
								let content = {
									// 动作
									action: "click",
									// 节点
									node: "获取我的信息",
									// 异常信息
									bugInfo: res.msg,
									// 页面参数
									pageParams: null,
									// 接口名称
									intName: "获取我的信息(face-user/info)",
									// 入参
									enterParams: {
										type: 2,
									},
									// 出参
									outParams: res,
									// 前端编码
									webId: null
								};
								
								let info = {
									operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
									page: "112",
									type: 2,
									content: JSON.stringify(content)
								};
								
								burying.point(info);
							}
						}).catch(err => {
							console.log("获取我的信息接口数据返回失败 error is :" + err);
							
							let content = {
								// 动作
								action: "click",
								// 节点
								node: "获取我的信息",
								// 异常信息
								bugInfo: err,
								// 页面参数
								pageParams: null,
								// 接口名称
								intName: "获取我的信息(face-user/info)",
								// 入参
								enterParams: {
									type: 2,
								},
								// 出参
								outParams: null,
								// 前端编码
								webId: null
							};
							
							let info = {
								operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
								page: "112",
								type: 2,
								content: JSON.stringify(content)
							};
							
							burying.point(info);
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.my {
		// background-image: linear-gradient(#ffe14c, rgb(145 152 229 / 0));
		// background: red;
		height: calc(100vh - (var(--status-bar-height) + 100rpx));
		.hintTit {
			width: 100%;
			text-align: center;
			font-size: 36rpx;
			color: #333333;
			position: relative;
			top: 92rpx;
		}
		
		.hintCon {
			width: 100%;
			text-align: center;
			font-size: 32rpx;
			color: #999999;
			position: relative;
			top: 110rpx;
		}
		
		.hintBtn {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			border-top: 2rpx solid #DDDDDD;
			text-align: center;
			font-size: 32rpx;
			color: #F96F2B;
			position: absolute;
			bottom: 0;
		}
		.slot-wrap {
			width: 40rpx;
			height: 100%;
			font-size: 24rpx;
			color: #333333;
			margin-right: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.shezhi {
				color: #000000;
				font-size: 38rpx;
			}
		}
		.myCon {
			width: 100%;
			height: 100%;
			.myCon-bots {
				width: 100%;
				height: calc(100% - 250rpx);
				overflow-y: auto;
				padding: 20rpx 0 85rpx 0;
				.myPurse {
					width: 92% !important;
					margin: 0 auto 40rpx auto;
					height: 164rpx;
					background: #FFFFFF;
					box-shadow: 0rpx 6rpx 12rpx rgba(0, 0, 0, 0.08);
					border-radius: 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: center;
					padding: 10rpx 20rpx 20rpx 20rpx;
					.myPurse-botsss {
						.myPurse-botsss-top {
							font-size: 24rpx;
							font-weight: bold;
							color: #333333;
							text-align: center;
						}
						.myPurse-botsss-mid {
							width: 208rpx;
							height: 208rpx;
							margin: 18rpx auto;
						}
						.myPurse-botsss-bot {
							font-size: 20rpx;
							font-weight: bold;
							color: #FD8624;
							text-align: center;
						}
						.myPurse-botsss-bots {
							margin-top: 35rpx;
							font-size: 24rpx;
							color: #999999;
						}
					}
					.myPurse-top {
						flex: 0.8;
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.myPurse-top-left {
							height: 42rpx;
							line-height: 42rpx;
							font-size: 32rpx;
							color: #333333;
						}
						.myPurse-top-right {
							height: 58rpx;
							line-height: 58rpx;
							font-size: 20rpx;
							color: #999999;
						}
						.myPurse-top-rightss {
							height: 58rpx;
							line-height: 58rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							.myPurse-bot-both-text {
								height: 32rpx;
								font-size: 24rpx;
								line-height: 40rpx;
								color: #666666;
								margin: 0 15rpx 0 24rpx;
							}
							.myPurse-bot-both-tit {
								font-size: 40rpx;
								font-weight: 600;
								color: #FD8624;
							}
						}
					}
					.myPurse-botss {
						flex: 1.5;
						width: 100%;
						display: flex;
						justify-content: space-around;
						align-items: center;
						.fuwu {
							height: 54rpx;
							font-size: 38rpx;
							color: #fd8624;
						}
						.dindan {
							height: 54rpx;
							font-size: 38rpx;
							color: #3F9DFC;
						}
						.myPurse-botss-item {
							width: 120rpx;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							.myPurse-botss-item-img {
								width: 40rpx;
								height: 40rpx;
							}
							.myPurse-botss-item-tit {
								margin-top: 8rpx;
								height: 32rpx;
								font-size: 24rpx;
								line-height: 32rpx;
								color: #666666;
							}
							.myPurse-botss-item-num {
								width: 56rpx;
								height: 56rpx;
								line-height: 56rpx;
								background: #EFEFEF;
								border-radius: 8rpx;
								text-align: center;
								color: #787C82;
								font-size: 24rpx;
								.fuwu {
									height: 54rpx;
									font-size: 38rpx;
									color: #ffffff;
								}
							}
						}
					}
					.myPurse-bot {
						flex: 1.2;
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.myPurse-bot-both {
							flex: 1;
							height: 38rpx;
							display: flex;
							justify-content: flex-start;
							align-items: center;
							.myPurse-bot-both-text {
								height: 32rpx;
								font-size: 24rpx;
								line-height: 32rpx;
								color: #666666;
								margin: 0 44rpx 0 24rpx;
							}
							.myPurse-bot-both-tit {
								font-size: 40rpx;
								font-weight: 600;
								color: #FD8624;
							}
						}
					}
				}
			}
			.myCon-message {
				width: 100%;
				.myCon-conts {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					height: 250rpx;
					.myCon-message-left {
						width: 120rpx;
						height: 120rpx;
						margin: 0 40rpx 0 68rpx;
					}
					.myCon-message-right {
						width: 100%;
						.myCon-message-right-top {
							font-size: 36rpx;
							color: #333333;
						}
						.myCon-message-right-bot {
							display: flex;
							justify-content: space-between;
							align-items: center;
							.myCon-message-right-bot-left {
								display: flex;
								justify-content: flex-start;
								align-items: center;
								.myCon-message-right-bot-both {
									display: flex;
									justify-content: space-between;
									align-items: center;
									width: 136rpx;
									height: 32rpx;
									background: rgba(190, 100, 23, 0.2);
									border-radius: 20rpx;
									padding: 0 12rpx;
									margin-right: 20rpx;
									.both-img {
										width: 24rpx;
										height: 24rpx;
										background: #FD8624;
										border-radius: 12rpx;
										display: flex;
										justify-content: center;
										align-items: center;
										.duigou {
											color: #ffffff;
											font-size: 10rpx;
										}
										.weirenzheng {
											color: #ffffff;
											font-size: 18rpx;
										}
									}
									.both-text {
										width: 80rpx;
										height: 28rpx;
										font-size: 20rpx;
										line-height: 28rpx;
										color: #333333;
									}
								}
							}
							.myCon-message-right-bot-right {
								display: flex;
								justify-content: flex-end;
								align-items: center;
								margin-right: 30rpx;
								.myCon-message-right-bot-right-text {
									font-size: 20rpx;
									color: red;
									margin-right: 5rpx;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
