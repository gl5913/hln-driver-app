<template>
	<view class="myWallet">
		<u-navbar back-text="" title-color="#333333" title="我的钱包" :background="topBackground" :border-bottom="false"></u-navbar>
		
		<view class="myWallet-cont">
			<view class="cont">
				<view class="cont-top">
					<view class="cont-top-text">钱包账户（元）</view>
					<view class="cont-top-text" style="font-weight: 600; font-size: 70rpx;">¥ {{ parseFloat(WalletMess.availableBalance).toFixed(2) }}</view>
					<!-- <view class="cont-top-text" style="font-size: 28rpx;">冻结金额 ¥ {{ parseFloat(WalletMess.frozenBalance).toFixed(2) }}</view> -->
					<view class="cont-top-yuan1"></view>
					<view class="cont-top-yuan2"></view>
					<view class="cont-top-yuan3"></view>
					<view class="cont-top-yuan4"></view>
				</view>
				<view class="cont-bot">
					<view class="cont-bot-btn" @click="rechargeDeposit(2)">提现</view>
					<view class="cont-bot-cont"></view>
					<view class="cont-bot-btn" style="color: #333333; background: #FEC24D;" @click="rechargeDeposit(1)">充值</view>
				</view>
			</view>
			<view class="conts">
				<view class="conts-item" @click="goBillingDetails">
					<view class="conts-item-left">
						<Icon :iconType="'iconzhangdanmingxi'" extClass="fanhuiYou1"></Icon>
						<view class="conts-item-left-text">账单明细</view>
					</view>
					<view class="conts-item-right">
						<Icon :iconType="'iconfanhuiYou1'" extClass="fanhuiYou1"></Icon>
					</view>
				</view>
				<!-- <view class="conts-item" style="border-top: 2rpx solid #f5f5f5;">
					<view class="conts-item-left">
						<Icon :iconType="'iconshuaqiaqiapianyinhangqia'" extClass="fanhuiYou1"></Icon>
						<view class="conts-item-left-text">银行卡</view>
					</view>
					<view class="conts-item-right">
						<Icon :iconType="'iconfanhuiYou1'" extClass="fanhuiYou1"></Icon>
					</view>
				</view> -->
			</view>
		</view>
		
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
				barheight: this.statusBar,
				
				// 顶部导航的背景
				topBackground: {
					// 渐变色
					backgroundImage: 'linear-gradient(89deg, #FFE14C 0%, #FFC24D 100%)',
				},
				
				// 钱包信息
				WalletMess: '',
				
			}
		},
		onLoad() {
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "我的钱包页面加载",
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
				page: "114",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onShow() {
			this.getWalletMess();
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "我的钱包页面显示",
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
				page: "114",
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
				node: "我的钱包页面卸载",
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
				page: "114",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onBackPress() {
			uni.switchTab({
				url: "/pages/my/my"
			})
			return true;
		},
		methods: {
			
			// 跳转到充值或提现
			rechargeDeposit(type) {
				uni.navigateTo({
					url: "/pages/recharge/recharge?type=" + `${type}`
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: type == 1 ? "跳转到充值" : "跳转到提现",
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
					page: "114",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 跳转到账单
			goBillingDetails() {
				uni.navigateTo({
					url: "/pages/billingList/billingList"
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到账单明细",
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
					page: "114",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 获取钱包详情
			getWalletMess() {
				ajax.get(config.wallet_url,{
				}).then(res => {
					console.log(res)
					if(res.code == 0){
						this.WalletMess = res.data;
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取钱包详情",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取钱包详情(personal-center/freight-wallet-account)",
							// 入参
							enterParams: null,
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "114",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取钱包详情数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取钱包详情",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取钱包详情(personal-center/freight-wallet-account)",
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "114",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.myWallet {
		position: relative;
		.myWallet-cont {
			.conts {
				width: 92%;
				margin: 40rpx auto auto auto;
				background: #FFFFFF;
				box-shadow: 0rpx 6rpx 12rpx rgba(0, 0, 0, 0.08);
				border-radius: 20rpx;
				.conts-item {
					width: 100%;
					height: 88rpx;
					padding: 0 22rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.conts-item-left {
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.conts-item-left-text {
							font-size: 32rpx;
							color: #333333;
							margin-left: 20rpx;
						}
					}
					.conts-item-right {
						.fanhuiYou1 {
							color: #999999;
						}
					}
				}
			}
			.cont {
				width: 92%;
				margin: 40rpx auto auto auto;
				height: 406rpx;
				background: #FD8624;
				box-shadow: 0rpx 6rpx 12rpx rgba(0, 0, 0, 0.08);
				border-radius: 20rpx;
				.cont-top {
					width: 100%;
					height: 75%;
					padding: 40rpx 0;
					position: relative;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					align-items: center;
					.cont-top-text {
						font-size: 36rpx;
						color: #FFFFFF;
					}
					.cont-top-yuan1 {
						width: 66rpx;
						height: 66rpx;
						border: 4rpx solid rgba(255, 255, 255, 0.2);
						border-radius: 50%;
						position: absolute;
						top: 24rpx;
						left: 20rpx;
					}
					.cont-top-yuan2 {
						width: 100rpx;
						height: 100rpx;
						border: 4rpx solid rgba(255, 255, 255, 0.2);
						border-radius: 50%;
						position: absolute;
						top: 24rpx;
						right: 98rpx;
					}
					.cont-top-yuan3 {
						width: 120rpx;
						height: 120rpx;
						border: 4rpx solid rgba(255, 255, 255, 0.2);
						border-radius: 50%;
						position: absolute;
						left: 72rpx;
						bottom: 50rpx;
					}
					.cont-top-yuan4 {
						width: 66rpx;
						height: 66rpx;
						border: 4rpx solid rgba(255, 255, 255, 0.2);
						border-radius: 50%;
						position: absolute;
						right: 24rpx;
						bottom: 74rpx;
					}
				}
				.cont-bot {
					width: 100%;
					height: 25%;
					background: #ffffff;
					padding: 0 40rpx;
					border-radius: 0 0 20rpx 20rpx;
					display: flex;
					justify-content: space-around;
					align-items: center;
					.cont-bot-btn {
						width: 160rpx;
						height: 56rpx;
						text-align: center;
						line-height: 56rpx;
						border: 2rpx solid #FEC24D;
						border-radius: 30rpx;
						font-size: 28rpx;
						color: #FD8624;
					}
					.cont-bot-cont {
						width: 0rpx;
						height: 60rpx;
						border: 2rpx solid #CCCCCC;
					}
				}
			}
		}
	}
</style>
