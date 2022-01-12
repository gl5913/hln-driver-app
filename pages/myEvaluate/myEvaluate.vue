<template>
	<view class="myEvaluate">
		<u-navbar title-width="300" back-text="" title="我的评价"></u-navbar>
		<view class="myEvaluate-top" :style="{top: `${barheight}px`}">
			<view class="myEvaluate-top-top">
				<view class="myEvaluate-top-top-left">
					<image v-if="headPortrait != null" style="width: 120rpx; height: 120rpx; border-radius: 50%;" :src="headPortrait"></image>
					<image v-else style="width: 120rpx; height: 120rpx; border-radius: 50%;" src="../../static/img47.png"></image>
				</view>
				<view class="myEvaluate-top-top-right">
					<view class="myEvaluate-top-top-right-tit">{{ idCardName ? idCardName : phoness }}</view>
					<view class="myEvaluate-top-top-right-text">经平台测算，好评率低于<text style="color: #FB773C;">90%</text>将影响接单</view>
				</view>
			</view>
			<view class="myEvaluate-top-bot">
				<view class="myEvaluate-top-bot-left">
					<view class="myEvaluate-top-bot-left-both">
						<view class="myEvaluate-top-bot-left-both-top">{{ highPraiseRate }}<text style="font-size: 24rpx;">%</text></view>
						<view class="myEvaluate-top-bot-left-both-bot">好评率</view>
					</view>
					<view class="myEvaluate-top-bot-left-both">
						<view class="myEvaluate-top-bot-left-both-top">{{ allValue }}</view>
						<view class="myEvaluate-top-bot-left-both-bot">评价数</view>
					</view>
				</view>
				<view class="myEvaluate-top-bot-right">
					<view class="myEvaluate-top-bot-right-both">
						<view class="myEvaluate-top-bot-right-both-left">好评</view>
						<u-line-progress :show-percent="false" height="16" class="myEvaluate-top-bot-right-both-mid" active-color="#FB773C" :percent="parseInt(driverIntro.highPraiseVolume/allValue*100)"></u-line-progress>
						<view class="myEvaluate-top-bot-right-both-right">{{ driverIntro.highPraiseVolume }}</view>
					</view>
					<view class="myEvaluate-top-bot-right-both">
						<view class="myEvaluate-top-bot-right-both-left">中评</view>
						<u-line-progress :show-percent="false" height="16" class="myEvaluate-top-bot-right-both-mid" active-color="#FB773C" :percent="parseInt(driverIntro.middleVolume/allValue*100)"></u-line-progress>
						<view class="myEvaluate-top-bot-right-both-right">{{ driverIntro.middleVolume }}</view>
					</view>
					<view class="myEvaluate-top-bot-right-both" style="margin-bottom: 0;">
						<view class="myEvaluate-top-bot-right-both-left">差评</view>
						<u-line-progress :show-percent="false" height="16" class="myEvaluate-top-bot-right-both-mid" active-color="#FB773C" :percent="parseInt(driverIntro.negativeComment/allValue*100)"></u-line-progress>
						<view class="myEvaluate-top-bot-right-both-right">{{ driverIntro.negativeComment }}</view>
					</view>
				</view>
			</view>
			<view class="myEvaluate-mid">
				<view :style="[type == -1 ? bgColor : '']" class="cont-top-item" @click="appraise(-1)">全部 {{ allValue }}</view>
				<view :style="[type == -2 ? bgColor : '']"  class="cont-top-item" @click="appraise(-2)">好评 {{ driverIntro.highPraiseVolume }}</view>
				<view :style="[type == -3 ? bgColor : '']"  class="cont-top-item" @click="appraise(-3)">中评 {{ driverIntro.middleVolume }}</view>
				<view :style="[type == -4 ? bgColor : '']"  class="cont-top-item" @click="appraise(-4)">差评 {{ driverIntro.negativeComment }}</view>
			</view>
		</view>
		<view class="cont-bot" :style="{marginTop: `${height}px`}">
			<mescroll-body height="0" ref="mescrollRef" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view class="cont-botss" v-for="(item,index) of driverIntroList" :key="index">
					<view class="cont-bot-top">
						<view class="cont-bot-top-left">
							<view class="cont-bot-top-left-img">
								<image v-if="item.headPortrait != null" style="width: 60rpx; height: 60rpx; border-radius: 50%; border: 2rpx solid #fff;" :src="item.headPortrait"></image>
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
						<view class="cont-bot-bot-cont" v-for="(item,index) of item.evaluationTypeNames.split(',')" :key="index">{{ item }}</view>
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
				barheight: this.statusBar,
				starCount: 5,
				type: -1,
				
				height: null,
				
				// 司机账号
				phone: '',
				phoness: '',
				
				bgColor: { background: '#FEC24D' },
				
				// 司机昵称
				idCardName: null,
				// 司机头像
				headPortrait: null,
				
				// 司机评论信息
				driverIntro: '',
				driverIntroList: [],
				
				// 好评率
				highPraiseRate: '',
				// 全部评论数
				allValue: '',
				
				pageIndex: 1,
				pageSize: 10,
				total: 0,
				upOption:{
					empty:{
						tip: '~ 暂无评价 ~', // 提示
					},
					textNoMore: '--- 没有更多 ---'
				},
				
				// 用户识别码
				userNo: '',
				
				canReset: false,
			}
		},
		onReady(){
			let that = this;
			uni.getSystemInfo({
　　				success: function(res) { // res - 各种参数
	// 　　				console.log(res.windowHeight); // 屏幕的宽度
	　　    			let info = uni.createSelectorQuery().select(".myEvaluate-top");// 获取某个元素
	　　　  			info.boundingClientRect(function(data) { //data - 各种参数
	// 　　　  　			console.log(data.height)  // 获取元素高度
	　　　  　			that.height = data.height;
	　　    			}).exec()
				}
			});
		},
		onLoad(option) {
			this.phone = option.phone;
			this.phoness = option.phone.substr(0,3) + '****' + option.phone.substr(7);

			ajax.get(config.userMess_url,{
				type: 2,
			}).then(res => {
				console.log(res);
				if(res.code == 0){
					this.userNo = res.data.userNo
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
						page: "113",
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
					page: "113",
					type: 2,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			})
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "我的评价页面加载",
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
				page: "113",
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
				node: "我的评价页面显示",
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
				page: "113",
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
				node: "我的评价页面卸载",
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
				page: "113",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		mounted() {
			this.getDriver();
			// this.getDriverIntro(-1,this.phone);
		},
		methods: {
			// 上拉加载的回调
			upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				ajax.get(config.driverFaceIntro_url,{
					pageIndex: pageNum,
					pageSize: pageSize,
					userCode: this.userNo,
					type: 2,
					state: this.type,
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						res.data.list.forEach(item => {
							item.createTime = moment(item.createTime).format('YYYY-MM-DD');
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
							node: "获取司机评论列表",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取司机评论列表(order-management/evaluation-list)",
							// 入参
							enterParams: {
								pageIndex: pageNum,
								pageSize: pageSize,
								userCode: this.userNo,
								type: 2,
								state: this.type,
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "113",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					this.mescroll.endErr();
					console.log("获取司机评论列表数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取司机评论列表",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取司机评论列表(order-management/evaluation-list)",
						// 入参
						enterParams: {
							pageIndex: pageNum,
							pageSize: pageSize,
							userCode: this.userNo,
							type: 2,
							state: this.type,
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "113",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 评价筛选
			appraise(type) {
				this.type = type;
				console.log(this.type);
				this.driverIntroList = [];
				this.mescroll.resetUpScroll();
			},
			
			// 获取司机详情信息
			getDriver() {
				ajax.get(config.driverIntro_url,{
					userCode: this.userNo,
					type: 2
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						this.driverIntro = res.data;
						this.allValue = res.data.highPraiseVolume + res.data.middleVolume + res.data.negativeComment;
						this.idCardName = res.data.idCardName;
						this.highPraiseRate = res.data.highPraiseRate;
						this.headPortrait = res.data.headPortrait;
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取司机详情",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取司机详情(order-management/introduction)",
							// 入参
							enterParams: {
								userCode: this.userNo,
								type: 2
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "113",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取司机详情信息数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取司机详情",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取司机详情(order-management/introduction)",
						// 入参
						enterParams: {
							userCode: this.userNo,
							type: 2
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "113",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.myEvaluate {
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
				border-top: 2rpx solid #f5f5f5;
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
		
		.myEvaluate-top {
			width: 100%;
			height: 436rpx;
			background: #ffffff;
			position: fixed;
			top: 88rpx;
			z-index: 1000;
			padding: 24rpx 0;
			.myEvaluate-mid {
				width: 100%;
				padding: 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: #ffffff;
				border-top: 20rpx solid #f5f6f7;
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
			.myEvaluate-top-top {
				width: 100%;
				padding: 0 30rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.myEvaluate-top-top-left {
					margin-right: 30rpx;
				}
				.myEvaluate-top-top-right {
					width: 100%;
					.myEvaluate-top-top-right-tit {
						font-size: 36rpx;
						color: #333333;
					}
					.myEvaluate-top-top-right-text {
						font-size: 24rpx;
						color: #999999;
					}
				}
			}
			.myEvaluate-top-bot {
				width: 100%;
				padding: 0 30rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.myEvaluate-top-bot-left {
					width: 40%;
					border-right: 2rpx solid #f5f5f5;
					display: flex;
					justify-content: space-around;
					align-items: center;
					.myEvaluate-top-bot-left-both {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						.myEvaluate-top-bot-left-both-top {
							height: 54rpx;
							line-height: 54rpx;
							font-size: 40rpx;
							font-weight: 600;
							color: #FB773C;
						}
						.myEvaluate-top-bot-left-both-bot {
							height: 32rpx;
							font-size: 24rpx;
							line-height: 32rpx;
							color: #999999;
						}
					}
				}
				.myEvaluate-top-bot-right {
					width: 60%;
					padding: 20rpx 38rpx;
					.myEvaluate-top-bot-right-both {
						display: flex;
						justify-content: center;
						align-items: center;
						margin-bottom: 15rpx;
						.myEvaluate-top-bot-right-both-left {
							flex: 1;
							height: 28rpx;
							text-align: center;
							font-size: 20rpx;
							line-height: 28rpx;
							color: #666666;
						}
						.myEvaluate-top-bot-right-both-mid {
							flex: 4;
							margin: 0 16rpx;
						}
						.myEvaluate-top-bot-right-both-right {
							flex: 1;
							height: 28rpx;
							font-size: 20rpx;
							line-height: 28rpx;
							color: #999999;
						}
					}
				}
			}
		}
	}
</style>
