<template>
	<view class="refundFlow">
		<u-navbar back-text="" title="退款流程" :border-bottom="false"></u-navbar>
		
		<view class="flowContent">
			<view class="top"></view>
			<view class="cont-top">
				<view class="cont-top-top">{{ flowList.refundStateName }}</view>
				<view class="cont-top-bot">预计最晚{{ accountingTime }}前到账</view>
			</view>
			<view class="cont-mid">
				<view class="cont-mid-both">
					<view class="cont-mid-both-left">退款金额</view>
					<view class="cont-mid-both-right">{{ parseFloat(flowList.refundMoney).toFixed(2) }}</view>
				</view>
				<view class="cont-mid-both">
					<view class="cont-mid-both-left">退款账户</view>
					<view class="cont-mid-both-right">{{ flowList.paymentType == 1 ? '支付宝' : flowList.paymentType == 2 ? '微信' : flowList.paymentType == 3 ? '银联' : flowList.paymentType == 4 ? '钱包' : ''}}</view>
				</view>
			</view>
			<view class="cont-bot">
				<view class="cont-bot-tit">退款流程</view>
				<view class="cont-bot-con">
					<u-time-line>
						<u-time-line-item v-for="(item,index) of flowList.freightWalletTransaction" :key="index">
							<template v-slot:node v-if="index === 0">
								<view class="u-node"></view>
							</template>
							<template v-slot:content>
								<view class="cont-bot-con-item">
									<view class="cont-bot-con-item-con">
										<view class="u-order-title">{{ item.title }}</view>
										<view class="u-order-desc">{{ item.content }}</view>
									</view>
									<view class="u-order-time">{{ item.createTime }}</view>
								</view>
							</template>
						</u-time-line-item>
					</u-time-line>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import config from '../../service/config.js';
	import ajax from '../../service/ajax.js';
	import moment from 'moment';
	export default {
		data() {
			return {
				
				// 订单Id
				orderId: 0,
				
				// 退货流程列表
				flowList: {},
				
				// 最晚到账时间
				accountingTime: '',
			}
		},
		onLoad(option) {
			this.orderId = option.id;
		},
		mounted() {
			this.getFlow();
		},
		methods: {
			
			// 获取退货流程
			getFlow() {
				ajax.get(config.order_url + `/${this.orderId}/refund-process`,{
				}).then(res => {
					// console.log(res)
					if(res.code == 0){
						console.log(res.data);
						this.accountingTime = moment(res.data.freightWalletTransaction[0].createTime).add(8,'d').format('YYYY年MM月DD日');
						res.data.freightWalletTransaction.forEach(item => {
							item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
						});
						this.flowList = res.data;
					} else {
						console.log(res);
					}
				}).catch(err => {
					console.log("获取退货流程数据返回失败 error is :" + err);
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.refundFlow {
		.flowContent {
			width: 92%;
			margin: 40rpx auto 0 auto;
			background: #ffffff;
			border-radius: 20rpx;
			.cont-bot {
				width: 95%;
				margin: 0 auto;
				.cont-bot-tit {
					margin: 20rpx 0;
					font-size: 24rpx;
					color: #333333;
				}
				.cont-bot-con {
					width: 95%;
					margin: 0 auto;
					.u-node {
						width: 25rpx;
						height: 25rpx;
						background: #FFFFFF;
						border: 8rpx solid #FEC24D;
						border-radius: 50%;
					}
					.cont-bot-con-item {
						height: 100rpx;
						display: flex;
						justify-content: space-between;
						align-items: flex-start;
						.cont-bot-con-item-con {
							flex: 4;
							.u-order-title {
								font-size: 20rpx;
								color: #333333;
							}
							.u-order-desc {
								font-size: 16rpx;
								color: #666666;
							}
						}
						.u-order-time {
							flex: 2;
							text-align: right;
							font-size: 16rpx;
							color: #999999;
						}
					}
				}
			}
			.cont-mid {
				width: 95%;
				margin: 0 auto;
				height: 124rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: flex-start;
				border-bottom: 1rpx solid #f5f5f5;
				.cont-mid-both {
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.cont-mid-both-left {
						font-size: 24rpx;
						color: #999999;
					}
					.cont-mid-both-right {
						font-size: 24rpx;
						color: #333333;
					}
				}
			}
			.cont-top {
				width: 95%;
				margin: 0 auto;
				height: 124rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-start;
				border-bottom: 1rpx solid #f5f5f5;
				.cont-top-top {
					height: 38rpx;
					font-size: 28rpx;
					line-height: 38rpx;
					color: #333333;
				}
				.cont-top-bot {
					height: 28rpx;
					font-size: 20rpx;
					line-height: 28rpx;
					color: #999999;
				}
			}
			.top {
				width: 100%;
				height: 10rpx;
				background: #FEC24D;
				border-radius: 20rpx 20rpx 0rpx 0rpx;
				position: relative;
				top: 0;
			}
		}
		
	}
</style>
