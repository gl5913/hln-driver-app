<template>
	<view class="pay">
		<u-navbar back-text="" title-color="#333333" title="支付定金" :background="topBackground" :border-bottom="false"></u-navbar>
		<view class="kong" :style="{top: `${barheight}px`}">
			<view class="kong-title">
				<Icon :iconType="'icontongzhi'" extClass="tongzhi"></Icon>
				<view class="kong-title-text">定金用来确认您愿意承运当次货源，如支付后未被货主指定为承运人，系统会自动原路退还，运输完成后，系统会根据货源的设定判断是否退还给您。</view>
			</view>
		</view>
		<view class="pay-content">
			<view class="pay-content-top">
				<view class="pay-content-top-title">定金</view>
				<view class="pay-content-top-texts">¥ {{ parseFloat(deposit).toFixed(2) }}<text class="pay-content-top-text">元</text></view>
			</view>
			<view class="pay-content-mid">
				<view class="pay-content-mid-item" @click="payType(1)">
					<view class="pay-content-mid-item-left">
						<Icon :iconType="'iconqianbaozhifu'" extClass="qianbaozhifu"></Icon>
						<view class="pay-content-mid-item-left-text" style="margin-left: 16rpx;">钱包支付</view>
						<view class="pay-content-mid-item-left-money"><text style="margin-right: 10rpx; font-size: 24rpx;">当前余额</text><text>{{ parseFloat(availableBalance).toFixed(2) }}</text></view>
					</view>
					<view class="pay-content-mid-item-right" :class="{payYuan: payTypes == 1}">
						<Icon :iconType="'iconduigouHei'" extClass="duigouHei" v-show="payTypes == 1"></Icon>
					</view>
				</view>
				<!-- <view v-else class="pay-content-mid-item">
					<view class="pay-content-mid-item-left">
						<Icon :iconType="'iconqianbaozhifu'" extClass="qianbaozhifuss"></Icon>
						<view class="pay-content-mid-item-left-text" style="margin-left: 16rpx;">钱包支付</view>
					</view>
					<view class="pay-content-mid-item-rightss"><text style="margin-right: 10rpx; font-size: 24rpx;">当前余额</text><text>{{ parseFloat(availableBalance).toFixed(2) }}</text></view>
				</view> -->
				<!-- <view class="pay-content-mid-item" @click="payType(2)">
					<view class="pay-content-mid-item-left">
						<Icon :iconType="'iconweixinzhifu'" extClass="weixinzhifu"></Icon>
						<view class="pay-content-mid-item-left-text">微信支付</view>
					</view>
					<view class="pay-content-mid-item-right" :class="{payYuan: payTypes == 2}">
						<Icon :iconType="'iconduigouHei'" extClass="duigouHei" v-show=" payTypes == 2"></Icon>
					</view>
				</view> -->
				<view v-if="deposit != 0" class="pay-content-mid-item" style="border: 0;" @click="payType(3)">
					<view class="pay-content-mid-item-left">
						<Icon :iconType="'iconzhifubao'" extClass="zhifubao"></Icon>
						<view class="pay-content-mid-item-left-text">支付宝支付</view>
					</view>
					<view class="pay-content-mid-item-right" :class="{payYuan: payTypes == 3}">
						<Icon :iconType="'iconduigouHei'" extClass="duigouHei" v-show=" payTypes == 3"></Icon>
					</view>
				</view>
			</view>
			<view class="logoutCon4">
				<view class="logoutAgree" :class="{logoutAgreess: logoutAgree}" @click="showAgree">
					<view class="logoutAgreeYuan" v-show="logoutAgree"></view>
				</view>
				<view class="logoutAgreeTit">确认支付即视为您已阅读并同意<text style="color: #F96F2B;" @click="goPact(2)">《货物运输协议》</text><text style="color: #F96F2B;" @click="goPact(1)">《货物运输居间服务协议》</text></view>
			</view>
		</view>
		<view class="payBtn">
			<button :disabled="!logoutAgree" style="background: #FFC24D;" class="submitBtn" :class="{loginButton: !logoutAgree}" @click="payShow = true">确认</button>
		</view>
		
		<!-- 取消订单 -->
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" :closeable="true" v-model="payShow" mode="center">
			<view class="hintTit">支付提示</view>
			<view class="hintCon">确认接单，并支付定金</view>
			<button :disabled="disabled" class="hintBtn" :style="[disabled ? disabledColor : '']" @click="payDeposit">确认支付</button>
		</u-popup>
		
		<!-- 支付失败重新抢单 -->
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" :closeable="true" v-model="failShow" mode="center">
			<view class="hintTit">温馨提示</view>
			<view class="hintCon">支付失败</view>
			<view class="hintBtn" @click="goAllocation">重新抢单</view>
		</u-popup>
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
				
				disabledColor: {
					color: '#999999'
				},
				disabled: false,
				
				// 支付确认提示
				payShow: false,
				// 支付失败提示
				failShow: false,
				
				// 货源id
				goodsId: '',
				
				// 定金
				deposit: '',
				
				// 是否同意
				logoutAgree: false,
				
				// 是否支付
				payAgree: false,
				
				// 支付类别
				payTypes: 1,  // 1表示钱包支付，2表示微信支付，3表示支付宝支付
				
				// 可用余额
				availableBalance: null,
			}
		},
		onLoad(option) {
			this.goodsId = option.goodsId;
			this.deposit = option.deposit;
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "支付定金页面加载",
				// 异常信息
				bugInfo: null,
				// 页面参数
				pageParams: option,
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
				page: "104",
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
				node: "支付定金页面显示",
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
				page: "104",
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
				node: "支付定金页面卸载",
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
				page: "104",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		methods: {
			// 跳转到协议
			goPact(type) {
				if(type == 1) {
					uni.navigateTo({
						url: "/pages/pact/transportTrade/transportTrade",
					});
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "跳转到货物运输交易规则",
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
						page: "104",
						type: 1,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				} else if(type == 2) {
					uni.navigateTo({
						url: "/pages/pact/transportProtocol/transportProtocol",
					});
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "跳转到货物运输协议",
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
						page: "104",
						type: 1,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				}
			},
			
			// 支付失败跳转到配货大厅
			goAllocation() {
				uni.switchTab({
					url: "/pages/allocation/allocation",
				});
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "支付失败跳转到配货大厅",
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
					page: "104",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 点击同意或不同意
			showAgree() {
				this.logoutAgree = !this.logoutAgree;
			},
			
			// 点击支付方式
			payType(e) {
				this.payAgree = !this.payAgree;
				this.payTypes = e;
				console.log(e);
			},
			
			// 支付宝调用支付接口
			alipay(tradeNO,id) {
				uni.requestPayment({
				    provider: 'alipay',
				    orderInfo: tradeNO, //微信、支付宝订单数据
				    success: (res) => {
						this.payShow = false;
						uni.showLoading({
							title: '支付成功跳转中',
							mask: true
						});
						setTimeout(() => {
							uni.redirectTo({
								url: "/pages/orderDetails/orderDetails?id=" + id + "&state=1" + "&orderIndex=-1"
							})
							uni.hideLoading();
						},2000)
				    },
				    fail: err => {
						this.payShow = false;
						this.disabled = false;
						this.failShow = true;
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "支付宝调用支付",
							// 异常信息
							bugInfo: err,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "支付宝调用支付(uni.requestPayment)",
							// 入参
							enterParams: {
								provider: 'alipay',
								orderInfo: tradeNO,
							},
							// 出参
							outParams: null,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "104",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
				    }
				});
			},
			
			// 微信调用支付接口
			wxpay(datas) {
				let data = JSON.parse(datas);
				uni.requestPayment({
				    provider: 'wxpay',
				    timeStamp: String(data.timeStamp),
				    nonceStr: data.nonceStr,
				    package: data.packageStr,
				    signType: 'MD5',
				    paySign: data.paySign,
				    success: res => {
				        this.payShow = false;
				        uni.showLoading({
				        	title: '支付成功跳转中',
				        	mask: true
				        });
				        setTimeout(() => {
				        	uni.redirectTo({
				        		url: "/pages/orderDetails/orderDetails?id=" + id + "&state=1" + "&orderIndex=-1"
				        	})
				        	uni.hideLoading();
				        },2000)
				    },
				    fail: err => {
						this.payShow = false;
				        this.disabled = false;
				        this.failShow = true;
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "微信调用支付",
							// 异常信息
							bugInfo: err,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "微信调用支付(uni.requestPayment)",
							// 入参
							enterParams: {
								provider: 'wxpay',
								timeStamp: String(data.timeStamp),
								nonceStr: data.nonceStr,
								package: data.packageStr,
								signType: 'MD5',
								paySign: data.paySign,
							},
							// 出参
							outParams: null,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "104",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
				    }
				});
			},
			
			// 支付定金
			payDeposit() {
				this.disabled = true;
				let $paymentMethod;
				if(this.payTypes == 1) {
					$paymentMethod = 'PURSE_PAY'
				} else if(this.payTypes == 2) {
					$paymentMethod = 'WEIXIN_PAY'
				} else {
					$paymentMethod = 'ALY_PAY'
				}
				ajax.post(config.order_url,{
					cargoId: this.goodsId,
					paymentMethod: $paymentMethod,
				}).then(res => {
					console.log(res);
					this.disabled = false;
					if(res.code == 0){
						if($paymentMethod == 'ALY_PAY') {
							this.alipay(res.data.tradeNO,res.data.freightShippingOrderDTO.id);
						} else if($paymentMethod == 'WEIXIN_PAY') {
							this.wxpay(res.data);
						} else if($paymentMethod == 'PURSE_PAY') {
							this.payShow = false;
							uni.showLoading({
								title: '支付成功跳转中',
								mask: true
							});
							setTimeout(() => {
								uni.redirectTo({
									url: "/pages/orderDetails/orderDetails?id=" + res.data.freightShippingOrderDTO.id + "&state=1" + "&orderIndex=-1"
								})
								uni.hideLoading();
							},2000)
						}
					} else {
						this.payShow = false;
						if(res.code == -7037 || -7025) {
							uni.showToast({ title: res.msg, icon: "none" ,duration:2000});
						}
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "支付定金",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "支付定金(order-management/freight-shipping-order)",
							// 入参
							enterParams: {
								cargoId: this.goodsId,
								paymentMethod: $paymentMethod,
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "104",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					this.disabled = false;
					console.log("支付定金接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "支付定金",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "支付定金(order-management/freight-shipping-order)",
						// 入参
						enterParams: {
							cargoId: this.goodsId,
							paymentMethod: $paymentMethod,
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "104",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 获取钱包详情
			getWalletMess() {
				ajax.get(config.wallet_url,{
				}).then(res => {
					console.log(res)
					if(res.code == 0){
						this.availableBalance = res.data.availableBalance;
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
							page: "104",
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
						page: "104",
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
	.pay {
		position: relative;
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
			// border-top: 2rpx solid #DDDDDD;
			text-align: center;
			font-size: 32rpx;
			color: #F96F2B;
			border-radius: 0;
			background: #ffffff;
			position: absolute;
			bottom: 0;
		}
		.pay-content {
			margin: 100rpx auto 0 auto;
			.pay-content-mid {
				width: 92%;
				margin: 40rpx auto 20rpx auto;
				// height: 508rpx;
				background: #FFFFFF;
				border-radius: 20rpx;
				padding: 10rpx 16rpx 120rpx 16rpx;
				.pay-content-mid-item {
					width: 100%;
					height: 84rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom: 1rpx solid #f5f5f5;
					.pay-content-mid-item-left {
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.qianbaozhifu {
							font-size: 40rpx;
							color: #f96f2b;
						}
						.qianbaozhifuss {
							font-size: 40rpx;
							color: #ceccca;
						}
						.weixinzhifu {
							font-size: 40rpx;
							color: #40ba49;
						}
						.zhifubao {
							font-size: 40rpx;
							color: #07a0f8;
						}
						.pay-content-mid-item-left-text {
							font-size: 28rpx;
							color: #333333;
							margin-left: 20rpx;
						}
						.pay-content-mid-item-left-money {
							font-size: 28rpx;
							color: #939393;
							margin-left: 50rpx;
						}
					}
					.pay-content-mid-item-right {
						width: 36rpx;
						height: 36rpx;
						border: 2rpx solid #999999;
						border-radius: 50%;
						display: flex;
						justify-content: center;
						align-items: center;
						.duigouHei {
							font-size: 10rpx;
						}
					}
					.pay-content-mid-item-rightss {
						font-size: 28rpx;
						color: #939393;
					}
					.payYuan {
						border: none;
						background: #FEC24D;
					}
				}
			}
			.pay-content-top {
				width: 92%;
				margin: 0 auto;
				height: 92rpx;
				background: #FFFFFF;
				border-radius: 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 14rpx;
				.pay-content-top-title {
					font-size: 28rpx;
					color: #333333;
				}
				.pay-content-top-texts {
					font-size: 32rpx;
					font-weight: 600;
					color: #fb6e2f;
					.pay-content-top-text {
						font-size: 16rpx;
						color: #666666;
						margin-left: 18rpx;
					}
				}
			}
			.logoutCon4 {
				width: 92%;
				margin: 24rpx auto auto auto;
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				.logoutAgree {
					margin: 5rpx 0 0 10rpx;
					width: 36rpx;
					height: 36rpx;
					border: 2rpx solid #999999;
					border-radius: 50%;
					display: flex;
					justify-content: center;
					align-items: center;
					.logoutAgreeYuan {
						width: 20rpx;
						height: 20rpx;
						background: #F96F2B;
						border-radius: 50%;
					}
				}
				.logoutAgreess {
					border: 2rpx solid #F96F2B;
				}
				.logoutAgreeTit {
					width: 600rpx;
					margin-left: 25rpx;
					font-size: 24rpx;
					color: #999999;
					line-height: 45rpx;
				}
			}
		}
		.payBtn {
			width: 100%;
			position: fixed;
			bottom: 5%;
			.payButton {
				margin: 0 auto;
				width: 92%;
				height: 80rpx;
				font-size: 32rpx;
				line-height: 80rpx;
				background: #FEC24D;
				border-radius: 8rpx;
			}
			.submitBtn {
				width: 90%;
				height: 80rpx;
				line-height: 80rpx;
				position: absolute;
				left: 5%;
				bottom: 8%;
				color: #333333;
			}
			.loginButton {
				background: #DDDDDD !important;
				color: #333333;
			}
		}
		.kong {
			width: 100%;
			height: 70rpx;
			background: linear-gradient(89deg, #FFE14C 0%, #FFC24D 100%);
			position: fixed;
			top: 88rpx;
			z-index: 10;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			align-items: center;
			.kong-title {
				width: 100%;
				height: 80rpx;
				background: #F7ECD5;
				border-radius: 40rpx 40rpx 0rpx 0rpx;
				z-index: 2;
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				.tongzhi {
					font-size: 30rpx;
					color: #FB6E2F;
					margin: 0 12rpx 0 20rpx;
				}
				.kong-title-text {
					font-size: 20rpx;
					color: #FB6E2F;
					height: 50rpx;
					line-height: 24rpx;
					margin: 10rpx 24rpx 0 0;
				}
			}
		}
	}
</style>
