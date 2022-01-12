<template>
	<view class="myCarBox">
		<u-navbar title-width="300" back-text="" title="我的车辆"></u-navbar>
		
		<view class="myCar-content">
			<uni-swipe-action>
				<uni-swipe-action-item @change="swipeChange($event, index)" class="myCar-content-item" :class="{items: index == 0}" v-for="(item,index) of carList" :key="index">
					<view class="myCar-content-itemss" @click="checkCar(item)">
						<view class="myCar-content-left" :class="item.isDefault == 1 ? 'leftss' : ''">
							<Icon :iconType="'iconchepai1'" :extClass="item.isDefault == 1 ? 'chepai2' : 'chepai1'"></Icon>
						</view>
						<view class="myCar-content-right">
							车牌：{{ item.plateNumber }}
						</view>
						<view style="margin-left: 280rpx; color: #FB6E2F;" v-if="item.isDefault == 1">默认</view>
					</view>
					<template v-slot:right>
						<view class="upBtn" @click="changeCar(item.id, item.plateNumber)">
							<Icon :iconType="'iconxiugai1'" extClass="xiugai1"></Icon>
						</view>
						<!-- <view class="delBtn" @click="delCar(item.id, item.isDefault)">
							<Icon :iconType="'iconshanchu1'" extClass="shanchu1"></Icon>
						</view> -->
					</template>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
		
		<!-- <view class="personalBot">
			<view class="personalBot-yuan"></view>
			<view class="personalBot-text">最多添加5个我的车辆</view>
		</view> -->
		
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" :closeable="true" v-model="popShowss" mode="center">
			<view class="hintTit">温馨提示</view>
			<view class="hintCon">默认车辆不能删除</view>
			<view class="hintBtn" style="justify-content: center;" @click="popShowss = false">返回</view>
		</u-popup>
		
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" :closeable="true" v-model="popShow" mode="center">
			<view class="hintTit">温馨提示</view>
			<view class="hintCon">您确定删除吗？</view>
			<view class="hintBtn">
				<view style="width: 50%;" @click="delCarss">确认删除</view>
				<view class="hintBtnShu"></view>
				<view style="color: #333333; width: 50%;" @click="popShow = false">暂不删除</view>
			</view>
		</u-popup>
		
		<!-- <button @click="addCar" :disabled="carList.length == 5" style="background: #FFC24D;" class="submitBtn" :class="{loginButton: carList.length == 5}">添加车辆</button> -->
		<button v-if="carList.length < 1" @click="addCar" style="background: #FFC24D;" class="submitBtn">添加车辆</button>
		
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
				// 我的车辆列表
				carList: [],
				
				popShow: false,
				popShowss: false,
				
				// 删除车辆的ID
				carId: null,
			}
		},
		onLoad() {
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "我的车辆页面加载",
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
				page: "124",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onShow() {
			this.getMyCar();
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "我的车辆页面显示",
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
				page: "124",
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
				node: "我的车辆页面卸载",
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
				page: "124",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		methods: {
			
			swipeChange(e,index) {
				console.log(e);
				console.log(index);
			},
			
			// 设置默认车辆
			checkCar(item) {
				if(item.isDefault != 1) {
					ajax.put(config.driverCar_url + `/${item.id}/isDefault`,{
					}).then(res => {
						if(res.code == 0){
							this.carList = [];
							this.getMyCar();
						} else {
							console.log(res);
							
							let content = {
								// 动作
								action: "click",
								// 节点
								node: "设置默认车辆",
								// 异常信息
								bugInfo: res.msg,
								// 页面参数
								pageParams: null,
								// 接口名称
								intName: "设置默认车辆(personal-center/face-driver-car)",
								// 入参
								enterParams: {
									id: id
								},
								// 出参
								outParams: res,
								// 前端编码
								webId: null
							};
							
							let info = {
								operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
								page: "124",
								type: 2,
								content: JSON.stringify(content)
							};
							
							burying.point(info);
						}
					}).catch(err => {
						console.log("设置默认车辆接口数据返回失败 error is :" + err);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "设置默认车辆",
							// 异常信息
							bugInfo: err,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "设置默认车辆(personal-center/face-driver-car)",
							// 入参
							enterParams: {
								id: id
							},
							// 出参
							outParams: null,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "124",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					})
				}
			},
			
			// 修改车辆
			changeCar(id,plateNumber) {
				uni.navigateTo({
					// url: "/pages/changeCar/changeCar?id=" + `${id}&plateNumber=${plateNumber}`
					url: "/pages/addCar/addCar?id=" + `${id}&plateNumber=${plateNumber}&carAuthState=2`
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到修改车辆",
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
					page: "124",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 添加车辆
			addCar() {
				uni.navigateTo({
					url: "/pages/addCar/addCar?carAuthState=0"
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到添加车辆",
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
					page: "124",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 删除车辆列表
			delCar(id, type) {
				if(type == 1) {
					this.popShowss = true;
				} else {
					this.popShow = true;
					this.carId = id;
				}
			},
			
			// 删除车辆
			delCarss() {
				ajax.del(config.driverCar_url + `/${this.carId}`,{
				}).then(res => {
					if(res.code == 0){
						this.popShow = false;
						this.carList = [];
						this.getMyCar();
					} else {
						console.log(res);
						this.popShow = false;
						uni.showToast({ title: "删除失败",icon: "none" ,duration:2000});
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "删除车辆",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "删除车辆(personal-center/face-driver-car)",
							// 入参
							enterParams: {
								id: this.carId
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "124",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("删除车辆列表接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "删除车辆",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "删除车辆(personal-center/face-driver-car)",
						// 入参
						enterParams: {
							id: this.carId
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "124",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 获取我的车辆列表
			getMyCar() {
				ajax.get(config.driverCar_url,{
				}).then(res => {
					if(res.code == 0){
						console.log(res.data);
						this.carList = res.data;
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取我的车辆列表",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取我的车辆列表(personal-center/face-driver-car)",
							// 入参
							enterParams: null,
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "124",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取我的车辆列表接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取我的车辆列表",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取我的车辆列表(personal-center/face-driver-car)",
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "124",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.myCarBox {
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
			height: 90rpx;
			line-height: 90rpx;
			border-top: 2rpx solid #DDDDDD;
			text-align: center;
			font-size: 32rpx;
			color: #F96F2B;
			display: flex;
			justify-content: space-between;
			align-items: center;
			position: absolute;
			bottom: 0;
			.hintBtnShu {
				width: 0rpx;
				height: 90rpx;
				border: 2rpx solid #DDDDDD;
			}
		}
		.personalBot {
			width: 92%;
			margin: 15rpx auto auto auto;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.personalBot-yuan {
				width: 8rpx;
				height: 8rpx;
				background: #999999;
				border-radius: 50%;
				margin-right: 10rpx;
			}
			.personalBot-text {
				font-size: 20rpx;
				color: #999999;
			}
		}
		.myCar-content {
			width: 100%;
			.items {
				margin-top: 40rpx !important;
			}
			.myCar-content-item {
				width: 92%;
				height: 92rpx;
				margin: 12rpx auto auto auto;
				.myCar-content-itemss {
					width: 100%;
					height: 92rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					background: #ffffff;
					border-radius: 8rpx;
					.leftss {
						border: 2rpx solid #FB6E2F !important;
					}
					.myCar-content-left {
						width: 40rpx; 
						height: 40rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						margin: 0 20rpx;
						border: 2rpx solid #666666;
						border-radius: 50%;
						.chepai1 {
							font-size: 30rpx;
							color: #666666;
						}
						.chepai2 {
							font-size: 30rpx;
							color: #FB6E2F;
						}
					}
					.myCar-content-right {
						font-size: 32rpx;
						color: #333333;
					}
				}
				.upBtn {
					width: 92rpx;
					height: 92rpx;
					background: #2680EB;
					display: flex;
					justify-content: center;
					align-items: center;
					.xiugai1 {
						color: #ffffff;
					}
				}
				.delBtn {
					width: 92rpx;
					height: 92rpx;
					background: #FA5D2E;
					border-radius: 0rpx 8rpx 8rpx 0rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					.shanchu1 {
						color: #ffffff;
					}
				}
			}
		}
		.submitBtn {
			width: 90%;
			height: 80rpx;
			line-height: 80rpx;
			position: absolute;
			left: 5%;
			bottom: 5%;
			color: #333333;
		}
		.loginButton {
			background: #DDDDDD !important;
			color: #333333;
		}
	}
</style>
