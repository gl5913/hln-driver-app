<template>
	<view class="details">
		<u-navbar back-text="" title-color="#333333" title="货主详情" :background="topBackground" :border-bottom="false"></u-navbar>
		<view class="kong" :style="{top: `${barheight}px`}">
			<view class="kong-title"></view>
		</view>
			
		<view class="content">
			<view class="shipper">
				<view class="site-title">
					<view class="site-title-left">基本信息</view>
				</view>
				<view class="shipper-content">
					<view class="listBots">
						<view class="listBots-left">
							<view class="listBots-left-left">
								<image v-if="driverIntro.headPortrait != null" style="width: 54rpx; height: 54rpx; border-radius: 50%; border: 2rpx solid #fff;" :src="driverIntro.headPortrait"></image>
								<image v-else style="width: 54rpx; height: 54rpx; border-radius: 8rpx;" src="../../static/img47.png"></image>
							</view>
							<view class="listBots-left-right">
								<view class="listBots-con">
									<view class="listBots-con1">{{ driverIntro.idCardName }}</view>
								</view>
								<view class="listBots-con">
									<view class="listBots-con2">注册时间</view>
									<view class="listBots-con2">|</view>
									<view class="listBots-con2">{{ driverIntro.createTime }}</view>
								</view>
							</view>
						</view>
						<view class="listBots-right">
							<view class="listBots-right-both" v-if="driverIntro.userCertificationStatus == 1">
								<Icon :iconType="'iconrenzhengdunpai'" extClass="dunpai"></Icon>
								<view class="listBots-con2">实名认证</view>
							</view>
							<view class="listBots-right-both" v-if="driverIntro.enterpriseCertificationStatus == 1">
								<Icon :iconType="'iconrenzhengdunpai'" extClass="dunpai"></Icon>
								<view class="listBots-con2">公司认证</view>
							</view>
						</view>
					</view>
					<view class="shipper-bot" v-if="driverIntro.enterpriseCertificationStatus == 1">
						<view class="shipper-bot-both">
							<text class="shipper-bot-both-left">公司名称</text>
							<text class="shipper-bot-both-right">{{ driverIntro.businessLicenseName }}</text>
						</view>
						<view class="shipper-bot-both">
							<text class="shipper-bot-both-left">公司地址</text>
							<text class="shipper-bot-both-right">{{ driverIntro.businessLicenseAddress }}</text>
						</view>
					</view>
				</view>
			</view>
			
			<view class="shipper">
				<view class="site-title">
					<view class="site-title-left">信誉情况</view>
				</view>
				<view class="case-content">
					<view class="case-content-top">
						<view class="case-content-top-cont">交易数 {{ driverIntro.tradingVolume }}</view>
						<view class="case-content-top-cont">好评率 {{ driverIntro.highPraiseRate }}%</view>
						<view class="case-content-top-cont">差评率 {{ driverIntro.negativeRate }}%</view>
					</view>
					<view class="case-content-mid" v-if="driverIntro.evaluationTypeList != null">
						<view class="case-content-mid-cont" v-if="item.count != null" v-for="(item,index) of driverIntro.evaluationTypeList" :key="index">{{ item.name }} {{ item.count }}</view>
					</view>
					<view class="case-content-bot" v-if="driverIntro.evaluationTypeList != null" @click="goEval">
						查看更多评价
					</view>
				</view>
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
				
				// 货主详情
				driverIntro: '',
				
				// 货主账号
				phone: '',
			}
		},
		onLoad(option) {
			this.phone = option.phone
			this.getDriverIntro(this.phone);
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "货主详情页面加载",
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
				page: "102",
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
				node: "货主详情页面显示",
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
				page: "102",
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
				node: "货主详情页面卸载",
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
				page: "102",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		mounted() {
			
		},
		methods: {
			
			// 跳转到用户评价
			goEval() {
				uni.navigateTo({
					url: "/pages/userEvaluate/userEvaluate?phone=" + this.phone
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到用户评价",
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
					page: "102",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 获取货主详情信息
			getDriverIntro(phone) {
				ajax.get(config.driverIntro_url,{
					userCode: phone,
					type: 1
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						res.data.createTime = moment(res.data.createTime).format('YYYY-MM-DD');
						this.driverIntro = res.data;
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取货主详情",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取货主详情(order-management/introduction)",
							// 入参
							enterParams: {
								userCode: phone,
								type: 1
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "102",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取货主详情信息数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取货主详情",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取货主详情(order-management/introduction)",
						// 入参
						enterParams: {
							userCode: phone,
							type: 1
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "102",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.details {
		.content {
			width: 94%;
			margin: 0 auto;
			margin-top: 40rpx;
			.shipper {
				margin-bottom: 30rpx;
				.case-content {
					width: 100%;
					// height: 342rpx;
					background: #FFFFFF;
					border-radius: 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: center;
					.case-content-top {
						width: 96%;
						margin: 0 auto;
						height: 76rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						border-bottom: 2rpx solid #f5f5f5;
						.case-content-top-cont {
							font-size: 24rpx;
							color: #666666;
						}
					}
					.case-content-mid {
						width: 96%;
						margin: 0 auto;
						display: flex;
						justify-content: flex-start;
						align-items: center;
						flex-wrap: wrap;
						.case-content-mid-cont {
							width: 160rpx;
							height: 40rpx;
							line-height: 40rpx;
							background: #F1F2F6;
							border-radius: 8rpx;
							font-size: 20rpx;
							color: #666666;
							text-align: center;
							margin-top: 18rpx;
							margin-right: 10rpx;
						}
						.case-content-mid-cont:nth-of-type(4n){
							margin-right: 0;
						}
					}
					.case-content-bot {
						width: 100%;
						height: 60rpx;
						margin-top: 18rpx;
						line-height: 60rpx;
						background: #F0F0F0;
						border-radius: 0rpx 0rpx 20rpx 20rpx;
						text-align: center;
						font-size: 24rpx;
						color: #FB6E2F;
					}
				}
				.site-title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 14rpx;
					.site-title-left {
						font-size: 28rpx;
						color: #333333;
					}
				}
				.shipper-content {
					width: 100%;
					background: #FFFFFF;
					border-radius: 20rpx;
					.shipper-bot {
						width: 95%;
						margin: 0 auto;
						padding: 15rpx 0;
						border-top: 2rpx solid #f5f5f5;
						.shipper-bot-both {
							display: flex;
							justify-content: flex-start;
							align-items: flex-start;
							line-height: 40rpx;
							.shipper-bot-both-left {
								flex: 1;
								font-size: 24rpx;
								color: #666666;
								margin-right: 20rpx;
							}
							.shipper-bot-both-right {
								flex: 5;
								font-size: 24rpx;
								color: #333333;
							}
						}
					}
					.listBots {
						width: 100%;
						padding: 20rpx;
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
							justify-content: flex-start;
							align-items: center;
							.listBots-right-both {
								display: flex;
								justify-content: flex-end;
								align-items: center;
								margin-left: 20rpx;
								.dunpai {
									font-size: 30rpx;
									color: #1BB68A;
								}
								.listBots-con2 {
									height: 28rpx;
									line-height: 28rpx;
									font-size: 20rpx;
									color: #1BB68A;
									margin-right: 7rpx;
								}
							}
						}
					}
				}
			}
		}
		.slot-wrap {
			font-size: 24rpx;
			color: #333333;
			margin-right: 30rpx;
		}
		.kong {
			width: 100%;
			height: 50rpx;
			background: linear-gradient(89deg, #FFE14C 0%, #FFC24D 100%);
			position: fixed;
			top: 88rpx;
			z-index: 10;
			.kong-title {
				position: absolute;
				bottom: 0;
				width: 100%;
				height: 40rpx;
				background: #F5F6F7;
				border-radius: 40rpx 40rpx 0rpx 0rpx;
			}
		}
	}
</style>
