<template>
	<view>
		<view class="site-content" @click="goOrderDetail(item.orderId,item.orderState)">
			<view class="site-content-top">
				<view style="position: absolute; top: 30rpx; right: 32rpx;" v-if="item.orderState == 6">
					<Icon :iconType="'iconquxiaozhong'" extClass="quxiaozhong"></Icon>
				</view>
				<view style="position: absolute; top: 30rpx; right: 32rpx;" v-if="item.orderState == 3 || item.orderState == 4 || item.orderState == 7">
					<Icon :iconType="'icontuikuanzhong'" extClass="tuikuanzhong"></Icon>
				</view>
				<view class="site-content-top-left">
					<view class="site-content-top-left-both">起</view>
					<image style="width: 4rpx; height: 118rpx;" src="../../static/img36.png"></image>
					<view class="site-content-top-left-both" style="background: #f84f1d;">终</view>
				</view>
				<view class="site-content-top-right">
					<view class="site-content-top-right-both">
						<view>
							<text style="font-size: 32rpx;">{{ item.orderFreightCargoDTO.freightCargorLoadingAddress[0].cityName }}</text>
							<text style="margin-left: 10rpx; font-size: 32rpx;">{{ item.orderFreightCargoDTO.freightCargorLoadingAddress[0].regionName }}</text>
						</view>
						<view class="site-content-top-right-both-text">
							<text>{{ item.orderFreightCargoDTO.freightCargorLoadingAddress[0].provinceName }}</text>
							<text>{{ item.orderFreightCargoDTO.freightCargorLoadingAddress[0].cityName }}</text>
							<text>{{ item.orderFreightCargoDTO.freightCargorLoadingAddress[0].regionName }}</text>
							<text>{{ item.orderFreightCargoDTO.freightCargorLoadingAddress[0].address }}</text>
						</view>
					</view>
					<view class="site-content-top-right-both">
						<view>
							<text style="font-size: 32rpx;">{{ item.orderFreightCargoDTO.freightCargorLoadingAddress[item.orderFreightCargoDTO.freightCargorLoadingAddress.length-1].cityName }}</text>
							<text style="margin-left: 10rpx; font-size: 32rpx;">{{ item.orderFreightCargoDTO.freightCargorLoadingAddress[item.orderFreightCargoDTO.freightCargorLoadingAddress.length-1].regionName }}</text>
						</view>
						<view class="site-content-top-right-both-text">
							<text>{{ item.orderFreightCargoDTO.freightCargorLoadingAddress[item.orderFreightCargoDTO.freightCargorLoadingAddress.length-1].provinceName }}</text>
							<text>{{ item.orderFreightCargoDTO.freightCargorLoadingAddress[item.orderFreightCargoDTO.freightCargorLoadingAddress.length-1].cityName }}</text>
							<text>{{ item.orderFreightCargoDTO.freightCargorLoadingAddress[item.orderFreightCargoDTO.freightCargorLoadingAddress.length-1].regionName }}</text>
							<text>{{ item.orderFreightCargoDTO.freightCargorLoadingAddress[item.orderFreightCargoDTO.freightCargorLoadingAddress.length-1].address }}</text>
						</view>
					</view>
				</view>
				<view class="listTop-right" v-if="faceState == '-1'" :style="[item.orderState == 1 || item.orderState == 2 ? stateStyle1 : item.orderState == 5 || item.orderState == 6 ? stateStyle2 : item.orderState == 8 ? stateStyle3 : item.orderState == 9 ? stateStyle4 : item.orderState == 10 ? stateStyle5 : item.orderState == 11 || item.orderState == 3 || item.orderState == 4 || item.orderState == 7 ? stateStyle6 : '']">
					{{ item.orderState == 1 || item.orderState == 2 ? '待确认' : item.orderState == 5 || item.orderState == 6 ? '运输中' : item.orderState == 8 ? '待支付' : item.orderState == 9 ? '待评价' : item.orderState == 10 ? '已完成' : item.orderState == 11 || item.orderState == 3 || item.orderState == 4 || item.orderState == 7 ? '已取消' : ''}}
				</view>
			</view>
			<view class="site-content-bot">
				<view class="listBots">
					<view class="listBots-left">
						<view class="listBots-left-left">
							<image v-if="item.orderFreightCargoDTO.cargoOwnerDTO.headPortrait != null" style="width: 54rpx; height: 54rpx; border-radius: 50%; border: 2rpx solid #fff;" :src="item.orderFreightCargoDTO.cargoOwnerDTO.headPortrait"></image>
							<image v-else style="width: 54rpx; height: 54rpx; border-radius: 8rpx;" src="../../static/img47.png"></image>
						</view>
						<view class="listBots-left-right">
							<view class="listBots-con">
								<view class="listBots-con1">货主</view>
								<view class="listBots-con1">|</view>
								<view class="listBots-con1">{{ item.orderFreightCargoDTO.cargoOwnerDTO.nickname == null ? '' : item.orderFreightCargoDTO.cargoOwnerDTO.nickname }}</view>
							</view>
							<view class="listBots-con">
								<view class="listBots-con2">{{ item.orderFreightCargoDTO.goodsTypeName }}</view>
								<view class="listBots-con2">{{ item.orderFreightCargoDTO.weight }}吨</view>
								<view class="listBots-con2">{{ item.orderFreightCargoDTO.volume }}方</view>
								<view class="listBots-con2">{{ item.orderFreightCargoDTO.packagingTypeName }}</view>
							</view>
						</view>
					</view>
					<view class="listBots-right" @click.stop="ringUp(item.orderFreightCargoDTO.cargoOwnerDTO.creator)">
						<Icon :iconType="'icondianhua'" extClass="dianhua"></Icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 数据列表
			item: {
				type: Object,
				required: true
			},
			// 数据状态
			faceState: {
				type: String,
				required: false
			},
		},
		data() {
			return {
				
			};
		},
		computed: {
			// 1表示待确认 2表示运输中 3表示待支付 4表示待评价 5表示已取消 6表示已完成 7表示退款中
			stateStyle1() {
				let background,color;
				background = '#fff3db';
				color = '#fc834a';
				return { background, color }
			},
			stateStyle2() {
				let background,color;
				background = '#e7f4fc';
				color = '#71b9e0';
				return { background, color }
			},
			stateStyle3() {
				let background,color;
				background = '#f5f6d8';
				color = '#a1a14e';
				return { background, color }
			},
			stateStyle4() {
				let background,color;
				background = '#fdeaf5';
				color = '#f06bb7';
				return { background, color }
			},
			stateStyle5() {
				let background,color;
				background = '#F0F0F0';
				color = '#fd2020';
				return { background, color }
			},
			stateStyle6() {
				let background,color;
				background = '#F0F0F0';
				color = '#8f8f8f';
				return { background, color }
			},
			stateStyle7() {
				let background,color;
				background = '#F0F0F0';
				color = '#f87171';
				return { background, color }
			},
		},
		methods: {
			// 跳转到订单详情
			goOrderDetail(id,state) {
				console.log(id);
				uni.navigateTo({
					url: "/pages/orderDetails/orderDetails?id=" + id + "&orderIndex=" + this.faceState
				})
			},
			
			// 联系货主
			ringUp(phone) {
				this.$emit('relation',phone);
			},
		}
	}
</script>

<style scoped lang="scss">
	.site-content {
		margin: 32rpx auto auto auto;
		width: 94%;
		height: 364rpx;
		background: #ffffff;
		border-radius: 20rpx;
		box-shadow: 0 0 10rpx #bfbfbf;
		.site-content-top {
			width: 100%;
			height: 284rpx;
			padding: 24rpx 20rpx;
			position: relative;
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			.quxiaozhong {
				font-size: 150rpx;
				color: red;
			}
			.tuikuanzhong {
				font-size: 150rpx;
				color: #ea9518;
			}
			.site-content-top-right {
				.site-content-top-right-both {
					font-size: 24rpx;
					color: #333333;
					height: 130rpx;
					.site-content-top-right-both-text {
						height: 65rpx;
						font-size: 24rpx;
						color: #999999;
						overflow: hidden;
						margin-top: 8rpx;
					}
					view {
						height: 32rpx;
						line-height: 32rpx;
					}
				}
			}
			.site-content-top-left {
				width: 5%;
				height: 100%;
				margin-right: 12rpx;
				padding-bottom: 70rpx;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: center;
				.site-content-top-left-both {
					width: 32rpx;
					height: 32rpx;
					background: #1bb68a;
					border-radius: 50%;
					line-height: 32rpx;
					text-align: center;
					font-size: 16rpx;
					color: #ffffff;
				}
			}
			.listTop-right {
				width: 160rpx;
				height: 44rpx;
				text-align: center;
				line-height: 44rpx;
				background: #FFF3DB;
				border-radius: 0rpx 20rpx 0rpx 20rpx;
				font-size: 20rpx;
				font-weight: 600;
				color: #FB6E2F;
				position: absolute;
				top: 0;
				right: 0;
			}
		}
		.site-content-bot {
			width: 100%;
			height: 80rpx;
			background: #f0f0f0;
			border-radius: 0 0 20rpx 20rpx;
			.listBots {
				width: 100%;
				height: 100%;
				margin: 0 auto;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.listBots-left {
					margin-left: 20rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.listBots-left-left {
						display: flex;
						justify-content: center;
						align-items: center;
						margin-right: 12rpx;
					}
					.listBots-left-right {
						height: 100%;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: flex-start;
						.listBots-con {
							display: flex;
							justify-content: flex-start;
							align-items: center;
							.listBots-con1 {
								height: 32rpx;
								line-height: 32rpx;
								font-size: 24rpx;
								color: #666666;
								margin-right: 7rpx;
							}
							.listBots-con2 {
								height: 28rpx;
								line-height: 28rpx;
								font-size: 20rpx;
								color: #999999;
								margin-right: 7rpx;
							}
						}
					}
				}
				.listBots-right {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 100rpx;
					height: 80rpx;
					background: #E8E8E8;
					border-radius: 0rpx 0rpx 20rpx 0rpx;
					.dianhua {
						font-size: 40rpx;
						color: #fb6e2f;
					}
					.listBots-con2 {
						height: 28rpx;
						line-height: 28rpx;
						font-size: 20rpx;
						color: #FB6E2F;;
						margin-right: 7rpx;
					}
				}
			}
		}
	}
</style>
