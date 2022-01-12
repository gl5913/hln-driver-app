<template>
	<view class="billingDetails">
		<u-navbar title-width="300" back-text="" title="账单详情"></u-navbar>
		
		<view class="billingDetails-cont">
			<view class="billingDetails-cont-top">
				<view class="billingDetails-cont-top1">
					<view class="billingDetails-cont-top1-text" style="line-height: 90rpx; margin-right: 26rpx;">{{ billingDetails.transactionType == 1 ||  billingDetails.transactionType == 3 || billingDetails.transactionType == 4 || billingDetails.transactionType == 7 ? '+' : '-' }}</view>
					<view class="billingDetails-cont-top1-text">{{ parseFloat(billingDetails.balance).toFixed(2) }}</view>
				</view>
				<view class="billingDetails-cont-top2">{{ billingDetails.state == 1 ? '交易成功' : billingDetails.state == 0 ? '交易失败' : billingDetails.state == 2 ? '提现中' : '' }}</view>
			</view>
			
			<view class="conts">
				<view class="conts-item" style="border: none;">
					<view class="conts-item-left">交易说明</view>
					<view class="conts-item-right">{{ billingDetails.title}}</view>
				</view>
				<view class="conts-item" v-if="billingDetails.transactionType==2 || billingDetails.transactionType==6 || billingDetails.transactionType==8">
					<view class="left">
						支付方式
					</view>
					<view class="right" v-if="billingDetails.paymentType == 1">
						支付宝
					</view>
					<view class="right" v-else-if="billingDetails.paymentType == 2">
						微信
					</view>
					<view class="right" v-else-if="billingDetails.paymentType == 3">
						银联
					</view>
					<view class="right" v-else-if="billingDetails.paymentType == 4">
						钱包
					</view>
					<view class="right" v-else-if="billingDetails.paymentType == 5">
						原路退回
					</view>
				</view>
				<view class="conts-item">
					<view class="conts-item-left">交易时间</view>
					<view class="conts-item-right">{{ billingDetails.createTime }}</view>
				</view>
				<view class="conts-item">
					<view class="conts-item-left">{{ billingDetails.transactionType == 1 || billingDetails.transactionType == 5 || billingDetails.transactionType == 6 ? '订单编号' : '运单编号' }}</view>
					<view class="conts-item-right">{{ billingDetails.shippingOrderNo }}</view>
				</view>
				
				<!-- <view class="conts-item" v-if="billingDetails.shippingOrderNo">
					<view class="conts-item-left">运单编号</view>
					<view class="conts-item-right">{{ billingDetails.shippingOrderNo }}</view>
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
				
				// 账单明细列表
				billingDetails: '',
				
				// 账单Id
				billingId: '',
			}
		},
		onLoad(option) {
			this.billingId = option.id;
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "账单详情页面加载",
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
				page: "116",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onShow() {
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "账单详情页面显示",
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
				page: "116",
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
				node: "账单详情页面卸载",
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
				page: "116",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		mounted() {
			this.getDillingDetails();
		},
		methods: {
			
			// 获取账单详情
			getDillingDetails() {
				ajax.get(config.transaction_url + `/${this.billingId}`,{
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						res.data.createTime = moment(res.data.createTime).format('YYYY-MM-DD HH:mm:ss');
						this.billingDetails = res.data;
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取账单详情",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取账单详情(personal-center/freight-wallet-transaction)",
							// 入参
							enterParams: {
								id: this.billingId
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "116",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取账单详情接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取账单详情",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取账单详情(personal-center/freight-wallet-transaction)",
						// 入参
						enterParams: {
							id: this.billingId
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "116",
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
	.billingDetails {
		.billingDetails-cont {
			.billingDetails-cont-top {
				width: 100%;
				height: 252rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.billingDetails-cont-top1 {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.billingDetails-cont-top1-text {
						height: 100rpx;
						line-height: 100rpx;
						font-size: 60rpx;
						font-weight: 600;
						color: #333333;
					}
				}
				.billingDetails-cont-top2 {
					font-size: 28rpx;
					color: #333333;
				}
			}
			.conts {
				width: 92%;
				margin: 0 auto;
				background: #FFFFFF;
				box-shadow: 0rpx 6rpx 12rpx rgba(0, 0, 0, 0.08);
				border-radius: 20rpx;
				.conts-item {
					width: 100%;
					height: 88rpx;
					padding: 0 22rpx;
					border-top: 2rpx solid #f5f5f5;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.conts-item-left {
						font-size: 28rpx;
						color: #666666;
					}
					.conts-item-right {
						font-size: 28rpx;
						color: #333333;
					}
				}
			}
		}
	}
</style>
