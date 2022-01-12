<template>
	<view>
		<view class="allocationList" :class="[item.driverUsername ? control?'appointList':'' : '']" @click="goGoodsDetails(item.id)">
			<view class="appointTopbar" v-if="item.driverUsername && control">请尽快操作您的指定货源</view>
			<view class="listTop">
				<view class="listTop-left">
					<view class="listTop-left-both u-line-1" style="margin-right: 10rpx">
						<view class="listTop-left-both-img">起</view>
						<view class="listTop-left-both-tit">{{ item.addressList[0].cityName.replace(/省|市|自治区|自治州|县|区/g,'') }}</view>
						<view class="listTop-left-both-tit">{{ item.addressList[0].regionName.replace(/省|市|自治区|自治州|县|区/g,'') }}</view>
					</view>
					→
					<view class="listTop-left-both u-line-1" style="margin-left: 10rpx">
						<view class="listTop-left-both-img" style="background: #F84F1D;">终</view>
						<view class="listTop-left-both-tit">{{ item.addressList[item.addressList.length - 1].cityName.replace(/省|市|自治区|自治州|县|区/g,'') }}</view>
						<view class="listTop-left-both-tit">{{ item.addressList[item.addressList.length - 1].regionName.replace(/省|市|自治区|自治州|县|区/g,'') }}</view>
					</view>
				</view>
				<view class="listTop-right">
					<view class="listTop-right-yuan"></view>
					<view class="listTop-right-tit">{{ item.handlingTypeName }}</view>
				</view>
			</view>
			<view class="listMid">
				<view class="listMid-left">
					<view class="listMid-left-top">
						<view class="listMidCon1">{{ item.vehicleTypeName }}</view>
						<view class="listMidCon1">|</view>
						<view class="listMidCon1">{{ item.cargorCarConductorName ? item.cargorCarConductorName.replace(/,/g, "/") : item.occupyConductor }}米</view>
						<view class="listMidCon1" v-if="item.occupyCarLength">/占{{ item.occupyCarLength }}米</view>
						<view class="listMidCon1">|</view>
						<view class="listMidCon1">{{ `${item.cargorCarModeName.replace(/,/g, "/")}` }}</view>
						<view class="listMidCon1">|</view>
						<view class="listMidCon1">{{ item.weight }}吨</view>
						<view class="listMidCon1">|</view>
						<view class="listMidCon1">{{ item.volume }}方</view>
					</view>
					<view class="listMid-left-mid">
						<view class="listMidCon2">{{ item.goodsTypeName }}</view>
						<view class="listMidCon2">{{ item.packagingTypeName }}</view>
						<view class="listMidCon2">{{ item.appointedTime }}装货</view>
						<!-- <view class="listMidCon2" style="margin: 0;">{{ item.paymentMethodName }}</view> -->
					</view>
					<view class="listMid-left-bot">
						<view class="listMidCon3">货运费用</view>
						<view class="listMidCon4">{{ parseFloat(item.freight).toFixed(2) }}元/趟</view>
					</view>
				</view>
				<view class="listMid-right">
					<Icon :iconType="'iconqiangdan'" extClass="qiangdan"></Icon>
					<view class="listMid-right-btn" v-if="item.driverUsername && control">指定货源</view>
					<view class="listMid-right-btn" v-else>立即抢单</view>
				</view>
			</view>
			<view class="listBot">
				<view class="listBots">
					<view class="listBots-left">
						<view class="listBots-left-left">
							<image v-if="item.cargoOwnerDTO.headPortrait != null" style="width: 54rpx; height: 54rpx; border-radius: 50%; border: 2rpx solid #fff;" :src="item.cargoOwnerDTO.headPortrait"></image>
							<image v-else style="width: 54rpx; height: 54rpx; border-radius: 8rpx;" src="../../static/img47.png"></image>
						</view>
						<view class="listBots-left-right">
							<view class="listBots-con">
								<view class="listBots-con1">货主</view>
								<view class="listBots-con1">|</view>
								<view class="listBots-con1">{{ item.cargoOwnerDTO.nickname }}</view>
							</view>
							<view class="listBots-con">
								<view class="listBots-con2">交易{{ item.cargoOwnerDTO.tradingVolume }}</view>
								<view class="listBots-con2">{{ item.cargoOwnerDTO.turnoverRate < 50 ? '成交率低' : '成交率高' }}</view>
								<view class="listBots-con2">好评率{{ item.cargoOwnerDTO.highPraiseRate }}%</view>
							</view>
						</view>
					</view>
					<view class="listBots-right">
						<view class="listBots-con2">{{ item.createTime }}</view>
						<view class="listBots-con2">距{{ item.distance || item.distance == 0 ? item.distance : '--' }}km装货</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import config from '../../service/config.js';
	import ajax from '../../service/ajax.js';
	export default {
		props: {
			// 数据列表
			item: {
				type: Object,
				required: true
			},
			// 点击类型
			clickType: {
				type: Boolean,
				required: false
			},
			control:{
				type:Boolean,
				required:true,
				default:true
			}
		},
		data() {
			return {
				src: '../../static/img47.png',
			}
		},
		methods: {
			// 跳转到货源列表
			goGoodsDetails(id) {
				if(this.clickType) {
					ajax.get(config.allStates_url,{
						id: id
					}).then(res => {
						console.log(res)
						if(res.code == 0){
							if(res.data.faceCargoState == 1) {
								uni.navigateTo({
									url: "/pages/goodsDetails/goodsDetails?id=" + `${id}&state=1`
								})
							} else {
								if(res.data.isMyself) {
									uni.navigateTo({
										url: "/pages/orderDetails/orderDetails?id=" + res.data.orderId + "&orderIndex=-1"
									})
								} else {
									uni.navigateTo({
										url: "/pages/goodsDetails/goodsDetails?id=" + `${id}&state=0`
									})
								}
							}
						} else {
							console.log(res);
						}
					}).catch(err => {
						console.log("获取货源的状态信息数据返回失败 error is :" + err);
					})
				} else {
					uni.navigateTo({
						url: "/pages/goodsDetails/goodsDetails?id=" + `${id}&state=1`
					})
				}
			},
		}
	}
</script>
	
<style scoped lang="scss">
	.allocationList {
		width: 94%;
		margin: 0 auto;
		margin-top: 5%;
		background: #FFFFFF;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0 0 5px #dadada;
		position: relative;
		border: 1px solid #e6e6e6;
		&.appointList{
			border: 3px solid #fb7d44;
			.appointTopbar{
				color: #fb7d44;
				background-color: #fbf5e0;
				padding: 5rpx 38rpx;
				font-size: 22rpx;
				position: absolute;
				top: -6rpx;
				border-radius: 0 0 50% 50%;
				box-shadow: 0 2rpx 4rpx #d2c8a5;
			}
			.listMid{
				border-top: 1px solid #FFFFFF;
			}
			.listBot{
				background: #fb7d44 !important;
				.listBots-con1{
					color:#FFFFFF !important;
				}
				.listBots-con2{
					color:#FFFFFF !important;
				}
			}
		}
		.listTop {
			width: 100%;
			padding:6% 0 1% 0;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.listTop-left {
				width: 100%;
				margin-left: 16rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				overflow: hidden;
				.listTop-left-both {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.listTop-left-both-img {
						width: 36rpx;
						height: 36rpx;
						text-align: center;
						background: #1BB68A;
						font-size: 20rpx;
						line-height: 36rpx;
						border-radius: 50%;
						color: #FFFFFF;
					}
					.listTop-left-both-tit {
						font-size: 36rpx;
						color: #333333;
						margin-left: 8rpx;
						overflow:hidden;
						white-space:nowrap;
						text-overflow:ellipsis;
					}
				}
			}
			.listTop-right {
				width: 140rpx;
				height: 44rpx;
				background: #F0F0F0;
				border-radius: 0rpx 16rpx 0rpx 16rpx;
				position: absolute;
				top: 0;
				right: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				.listTop-right-yuan {
					width: 10rpx;
					height: 10rpx;
					background: #FB6E2F;
					border-radius: 50%;
				}
				.listTop-right-tit {
					font-size: 20rpx;
					font-weight: 600;
					color: #FB6E2F;
					margin-left: 8rpx;
				}
			}
		}
		.listMid {
			width: 95%;
			padding:2% 0;
			margin: 0 auto;
			border-top: 2rpx solid #e6e6e6;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.listMid-left {
				width: 550rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;
				align-items: flex-start;
				overflow: hidden;
				.listMid-left-top {
					height: 50rpx;
					overflow:hidden;
					white-space:nowrap;
					text-overflow:ellipsis;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.listMidCon1 {
						font-size: 24rpx;
						color: #333333;
						margin-right: 7rpx;
					}
				}
				.listMid-left-mid {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.listMidCon2 {
						font-size: 24rpx;
						color: #333;
						margin-right: 7rpx;
					}
				}
				.listMid-left-bot {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.listMidCon3 {
						font-size: 24rpx;
						color: #333;
						margin-right: 20rpx;
					}
					.listMidCon4 {
						font-size: 32rpx;
						color: #FB6E2F;
						font-weight: 600;
					}
				}
			}
			.listMid-right {
				width: 110rpx;
				height: 110rpx;
				background: linear-gradient(180deg, #FFE14C 0%, #FEC24D 100%);
				border-radius: 20rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.qiangdan {
					height: 12rpx;
					font-size: 60rpx;
					margin: 28rpx 0 15rpx 0;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.listMid-right-btn {
					font-size: 24rpx;
					color: #000;
				}
			}
		}
		.listBot {
			width: 100%;
			height: 22%;
			background: #F0F0F0;
			border-radius: 0px 0px 12rpx 12rpx;
			.listBots {
				width: 95%;
				height: 100%;
				margin: 0 auto;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.listBots-left {
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
								font-size: 20rpx;
								color: #666666;
								margin-right: 7rpx;
								
							}
							.listBots-con2 {
								font-size: 16rpx;
								color: #999999;
								margin-right: 7rpx;
							}
						}
					}
				}
				.listBots-right {
					display: flex;
					flex-direction: column;
					justify-content: space-evenly;
					align-items: flex-end;
					.listBots-con2 {
						font-size: 16rpx;
						color: #999999;
						margin-right: 7rpx;
					}
				}
			}
		}
	}
</style>
