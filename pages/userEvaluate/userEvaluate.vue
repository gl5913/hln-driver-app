<template>
	<view class="details">
		<u-navbar back-text="" title-color="#333333" title="用户评价" :background="topBackground" :border-bottom="false"></u-navbar>
		<view id="tops" class="top" :style="{top: `${barheight}px`}">
			<view class="kong">
				<view class="kong-title"></view>
			</view>
			<view class="cont-top">
				<view :style="[contIndex == -1 ? bgColor : '']" class="cont-top-item" @click="appraise(-1)">全部 {{ allValue }}</view>
				<view :style="[contIndex == -2 ? bgColor : '']"  class="cont-top-item" @click="appraise(-2)">好评 {{ highPraiseVolume }}</view>
				<view :style="[contIndex == -3 ? bgColor : '']"  class="cont-top-item" @click="appraise(-3)">中评 {{ middleVolume }}</view>
				<view :style="[contIndex == -4 ? bgColor : '']"  class="cont-top-item" @click="appraise(-4)">差评 {{ negativeComment }}</view>
			</view>
			<view class="cont-mid" :style="evaluationType.length == 0 ? padd : ''">
				<view @click="appList(item.id)" class="cont-mid-cont" v-for="(item,index) of evaluationType" :key="index">{{ item.name }} {{ item.count }}</view>
			</view>
		</view>
		
		<view class="cont-bot" :style="{marginTop: `${height}px`}">
			<mescroll-body height="0" ref="mescrollRef" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view class="cont-botss" v-for="(item,index) of driverIntroList" :key="index">
					<view class="cont-bot-top">
						<view class="cont-bot-top-left">
							<view class="cont-bot-top-left-img">
								<image v-if="item.headPortrait != null" style="width: 60rpx; height: 60rpx;  border-radius: 50%; border: 2rpx solid #fff;" :src="itemheadPortrait"></image>
								<image v-else style="width: 60rpx; height: 60rpx; border-radius: 8rpx;" src="../../static/img47.png"></image>
							</view>
							<view class="cont-bot-top-left-rig">
								<view class="cont-bot-top-left-tit">{{ item.idCardName }}</view>
								<view class="cont-bot-top-left-cont">
									<u-rate :disabled="true" inactive-icon="star-fill" min-count="1" gutter="5" style="height: 20rpx;" inactive-color="#E6E6E6" active-color="#FEC24D" size="20" :count="starCount" v-model="item.score"></u-rate>
									<view class="cont-bot-top-left-cont-text">{{ item.score == 1 || item.score == 2 ? '差评' : item.score == 3 ? '中评' : item.score == 4 || item.score == 5 ? '好评' : '' }}</view>
								</view>
							</view>
						</view>
						<view class="cont-bot-top-right">{{ item.createTime }}</view>
					</view>
					<view class="cont-bot-bot">
						<view class="cont-bot-bot-cont" v-for="(item,index) of item.freightOrderEvaluationNamess" :key="index">{{ item }}</view>
					</view>
				</view>
			</mescroll-body>
		</view>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import config from '../../service/config.js';
	import ajax from '../../service/ajax.js';
	import moment from 'moment';
	import burying from '../../common/request.js';
	
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				padd: { padding: 0 },
				barheight: this.statusBar,
				// 顶部导航的背景
				topBackground: {
					// 渐变色
					backgroundImage: 'linear-gradient(89deg, #FFE14C 0%, #FFC24D 100%)',
				},
				starCount: 5,
				
				type: -1,
				
				height: null,
				
				// 货主账号
				phone: '',
				
				bgColor: { background: '#FEC24D' }, 
				
				contIndex: -1,
				typeId: -1,
				
				// 货主评论信息
				driverIntro: '',
				driverIntroList: [],
				
				// 全部评论数
				allValue: '',
				// 好评数
				highPraiseVolume: '',
				// 中评数
				middleVolume: '',
				// 差评数
				negativeComment: '',
				// 评价信息
				evaluationType: [],
				
				pageIndex: 1,
				pageSize: 10,
				total: 0,
				upOption:{
					empty:{
						tip: '~ 暂无评价 ~', // 提示
					},
					textNoMore: '--- 没有更多 ---'
				},
				
				canReset: false,
			}
		},
		onReady(){
			this.getHeight();
		},
		onLoad(option) {
			this.phone = option.phone
			this.getDriverIntro(this.phone);
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "用户评价页面加载",
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
				page: "103",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onShow() {
			this.canReset && this.mescroll.resetUpScroll();
			this.canReset && this.mescroll.scrollTo(0,0);
			this.canReset = true;
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "用户评价页面显示",
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
				page: "103",
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
				node: "用户评价页面卸载",
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
				page: "103",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		mounted() {
			
		},
		methods: {
			// 上拉加载的回调
			upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				ajax.get(config.driverFaceIntro_url,{
					pageIndex: pageNum,
					pageSize: pageSize,
					userCode: this.phone,
					type: 1,
					state: this.contIndex,
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						if(res.data.list.length != 0){
							this.getHeight();
						}
						res.data.list.forEach(item => {
							item.createTime = moment(item.createTime).format('YYYY-MM-DD');
							if(item.freightOrderEvaluationName != null) {
								item.freightOrderEvaluationNamess = item.freightOrderEvaluationName.split(',');
							}
						})
						let curPageData = res.data.list;
						let curPageLen = res.data.list.length;
						let hasNext = res.data.hasNextPage;
						
						if(page.num == 1) this.driverIntroList = []; //如果是第一页需手动置空列表
						this.driverIntroList = this.driverIntroList.concat(curPageData); //追加新数据
						this.mescroll.endSuccess(curPageLen, hasNext);
						
					} else {
						this.mescroll.endErr();
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取货主评论列表",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取货主评论列表(order-management/evaluation-list)",
							// 入参
							enterParams: {
								pageIndex: pageNum,
								pageSize: pageSize,
								userCode: this.phone,
								type: 1,
								state: this.contIndex,
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "103",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					this.mescroll.endErr();
					console.log("获取货主评论列表数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取货主评论列表",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取货主评论列表(order-management/evaluation-list)",
						// 入参
						enterParams: {
							pageIndex: pageNum,
							pageSize: pageSize,
							userCode: this.phone,
							type: 1,
							state: this.contIndex,
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "103",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 动态获取高度
			getHeight() {
				setTimeout(() => {
					const query = uni.createSelectorQuery().in(this);
					query.select('#tops').boundingClientRect(data => {
						console.log("得到布局位置信息" + JSON.stringify(data));
						console.log("节点离页面顶部的距离为" + data.height);
						this.height = data.height;
					}).exec();
				},300)
			},
			
			// 评价筛选
			appraise(type) {
				this.getHeight();
				this.contIndex = type;
				this.typeId = type;
				this.evaluationType = [];
				this.driverIntro = '';
				this.getDriverIntro(this.phone);
				this.driverIntroList = [];
				this.mescroll.resetUpScroll();
			},
			
			// 评价列表筛选
			appList(id) {
				this.typeId = id;
				this.driverIntroList = [];
				this.mescroll.resetUpScroll();
			},
			
			// 获取货主简介评论信息
			getDriverIntro(phone) {
				ajax.get(config.driverIntro_url,{
					userCode: phone,
					type: 1
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						this.driverIntro = res.data;
						res.data.evaluationTypeList.forEach(item => {
							if(item.count != null) {
								this.evaluationType.push(item);
							}
						})
						console.log(this.evaluationType);
						this.allValue = res.data.tradingVolume;
						this.highPraiseVolume = res.data.highPraiseVolume;
						this.middleVolume = res.data.middleVolume;
						this.negativeComment = res.data.negativeComment;
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取货主简介",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取货主简介(order-management/introduction)",
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
							page: "103",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取货主简介数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取货主简介",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取货主简介(order-management/introduction)",
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
						page: "103",
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
	.details {
		width: 100%;
		min-height: 100vh;
		background: #FFFFFF;
		position: relative;
		.cont-bot {
			width: 100%;
			background: #FFFFFF;
			.cont-botss {
				width: 92%;
				margin: 0 auto;
				padding: 22rpx 0;
				border-bottom: 2rpx solid #f5f5f5;
				.cont-bot-top {
					width: 100%;
					height: 70rpx;
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					.cont-bot-top-left {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.cont-bot-top-left-img {
							display: flex;
							justify-content: center;
							align-items: center;
							margin-right: 20rpx;
						}
						.cont-bot-top-left-rig {
							.cont-bot-top-left-tit {
								height: 35rpx;
								line-height: 35rpx;
								font-size: 24rpx;
								color: #333333;
							}
							.cont-bot-top-left-cont {
								height: 25rpx;
								line-height: 25rpx;
								display: flex;
								justify-content: space-between;
								align-items: center;
								.cont-bot-top-left-cont-text {
									margin: 10rpx 0 0 15rpx;
									font-size: 18rpx;
									color: #666666;
								}
							}
						}
					}
					.cont-bot-top-right {
						font-size: 20rpx;
						color: #999999;
					}
				}
				.cont-bot-bot {
					width: 100%;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					flex-wrap: wrap;
					.cont-bot-bot-cont {
						width: 155rpx;
						height: 40rpx;
						background: #F1F2F6;
						border-radius: 8rpx;
						font-size: 20rpx;
						color: #666666;
						line-height: 40rpx;
						text-align: center;
						margin-top: 15rpx;
						margin-right: 24rpx;
					}
					.cont-bot-bot-cont:nth-of-type(4n) {
						margin-right: 0;
					}
				}
			}
		}
		.top {
			width: 100%;
			position: fixed;
			top: 88rpx;
			z-index: 1000;
			.kong {
				width: 100%;
				height: 50rpx;
				background: linear-gradient(89deg, #FFE14C 0%, #FFC24D 100%);
				position: relative;
				.kong-title {
					position: absolute;
					bottom: 0;
					width: 100%;
					height: 40rpx;
					background: #F5F6F7;
					border-radius: 40rpx 40rpx 0rpx 0rpx;
				}
			}
			.cont-top {
				width: 100%;
				padding: 0 30rpx 30rpx 30rpx;
				height: 80rpx;
				border-bottom: 2rpx solid #dddddd;
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: #f5f6f7;
				.cont-top-item {
					width: 140rpx;
					height: 48rpx;
					line-height: 48rpx;
					background: #ffedc9;
					border-radius: 8rpx;
					text-align: center;
					font-size: 24rpx;
					color: #333333;
				}
			}
			.cont-mid {
				width: 100%;
				padding: 10rpx 40rpx 26rpx 40rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				flex-wrap: wrap;
				background: #f5f6f7;
				.cont-mid-cont {
					width: 160rpx;
					height: 40rpx;
					line-height: 40rpx;
					background: #e4e5e6;
					border-radius: 8rpx;
					font-size: 20rpx;
					color: #666666;
					text-align: center;
					margin-top: 18rpx;
					margin-right: 10rpx;
				}
				.cont-mid-cont:nth-of-type(4n){
					margin-right: 0;
				}
			}
		}
		.slot-wrap {
			font-size: 24rpx;
			color: #333333;
			margin-right: 30rpx;
		}
	}
</style>
