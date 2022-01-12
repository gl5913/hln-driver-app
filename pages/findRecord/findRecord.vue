<template>
	<view class="findRecord">
		<u-navbar back-text="" title-color="#333333" title="找货记录" :background="topBackground" :border-bottom="false"></u-navbar>
		<view class="kong" :style="{top: `${barheight}px`}">
			<view class="kong-title">
				<Icon :iconType="'icontongzhi'" extClass="tongzhi"></Icon>
				<view class="kong-title-text">我们会为您保留 24小时 内的货源浏览记录</view>
			</view>
		</view>
		<!-- 列表 -->
		<view class="allocationCon">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" :up="upOption" @down="downCallback" @up="upCallback">
				<goodsList :clickType="true" :item="item" :control="false" v-for="(item,index) of distributionList" :key="index"></goodsList>
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
				status: 'nomore',
				// 顶部导航的背景
				topBackground: {
					// 渐变色
					backgroundImage: 'linear-gradient(89deg, #FFE14C 0%, #FFC24D 100%)',
				},
				
				// 服务器时间
				serverTime: null,
				
				// 配货大厅列表
				distributionList: [],
				
				// 当前页数
				pageIndex: 1,
				// 当前页面行数
				pageSize: 10,
				total: 0,
				upOption:{
					empty:{
						tip: '~ 暂无记录 ~', // 提示
					},
					textNoMore: '--- 没有更多 ---'
				},
				
				canReset: false,
			}
		},
		onLoad() {
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "找货记录页面加载",
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
				page: "106",
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
				node: "找货记录页面显示",
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
				page: "106",
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
				node: "找货记录页面卸载",
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
				page: "106",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		methods: {
			// 上拉加载的回调
			upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				this.getTime();
				ajax.get(config.cargoSearchRecord_url,{
				  pageIndex: pageNum,
				  pageSize: pageSize,
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						res.data.list.forEach(item => {
							// moment.locale('zh-cn', {
							// 	relativeTime: {
							// 		future: '%s',
							// 		past: '%s',
							// 		s: '刚刚',
							// 		m: '1 分钟前',
							// 		mm: '%d 分钟前',
							// 		h: '1 小时前',
							// 		hh: '%d 小时前',
							// 		d: '1 天前',
							// 		dd: '%d 天前',
							// 		M: '1 个月前',
							// 		MM: '%d 个月前',
							// 		y: '1 年前',
							// 		yy: '%d 年前'
							// 	},
							// });
							// item.createTime =  moment(item.createTime);
							// this.serverTime = moment(this.serverTime);
							// item.createTime = item.createTime.from(this.serverTime);
							
							//releaseTime为要计算的时间戳
							// NowTime当前时间的时间戳作对比距离是几分钟前.几小时前
							var dateTime = new Date(moment(item.createTime).valueOf());
							var year = dateTime.getFullYear();
							var month = dateTime.getMonth() + 1;
							var day = dateTime.getDate();
							var hour = dateTime.getHours();
							var minute = dateTime.getMinutes();
							var second = dateTime.getSeconds();
							var now = new Date();
							var milliseconds = 0;
							var timeSpanStr;
							//计算出相差时间
							milliseconds = moment(this.serverTime).valueOf() - moment(item.createTime).valueOf();
							if (milliseconds <= 1000 * 60 * 1) {
							timeSpanStr = '刚刚';
							} else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
							timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
							} else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
							timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
							} else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
							timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
							//大于15天即显示年月日
							} else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
							timeSpanStr = year + '/' + month + '/' + day;
							// + ' ' + hour + ':' + minute
							} else {
							timeSpanStr = year + '/' + month + '/' + day;
							// + ' ' + hour + ':' + minute
							}
							item.createTime = timeSpanStr
							
							// 服务费计算
							// if(item.freight <= 200) {
							// 	item.freight = item.freight - 2
							// } else {
							// 	item.freight = item.freight - item.freight*0.01
							// }
							
							uni.getStorage({
							    key: 'loc',
							    success: res => {
									if(this.$store.state.lat && this.$store.state.lon) {
										let La1 = parseFloat(this.$store.state.lat) * Math.PI / 180.0;
										let La2 = parseFloat(item.addressList[0].lat) * Math.PI / 180.0;
										let La3 = La1 - La2;
										let Lb3 = parseFloat(this.$store.state.lon) * Math.PI / 180.0 - parseFloat(item.addressList[0].lnt) * Math.PI / 180.0;
										let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));  
										s = s * 6378.137;//地球半径
										item.distance = Math.round((Math.round(s * 10000) / 10000));
									} else {
										let La1 = parseFloat(res.data.latitude) * Math.PI / 180.0;
										let La2 = parseFloat(item.addressList[0].lat) * Math.PI / 180.0;
										let La3 = La1 - La2;
										let Lb3 = parseFloat(res.data.longitude) * Math.PI / 180.0 - parseFloat(item.addressList[0].lnt) * Math.PI / 180.0;
										let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));  
										s = s * 6378.137;//地球半径
										item.distance = Math.round((Math.round(s * 10000) / 10000));
									}
							    },
								fail: err => {
									uni.getLocation({
									    type: 'gcj02',
									    success: res => {
											this.$store.commit("getLon", res.longitude);
											this.$store.commit("getLat", res.latitude);
											let La1 = parseFloat(res.latitude) * Math.PI / 180.0;
											let La2 = parseFloat(item.addressList[0].lat) * Math.PI / 180.0;
											let La3 = La1 - La2;
											let Lb3 = parseFloat(res.longitude) * Math.PI / 180.0 - parseFloat(item.addressList[0].lnt) * Math.PI / 180.0;
											let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));  
											s = s * 6378.137;//地球半径
											item.distance = Math.round((Math.round(s * 10000) / 10000));
											uni.setStorage({
												key: 'loc',
												data: res,
											});
									    },
										fail: err => {
											console.log('不支持地图');
										}
									});
								}
							});

						});
						let curPageData = res.data.list;
						let curPageLen = res.data.list.length;
						let hasNext = res.data.hasNextPage;
						
						if(page.num == 1) this.distributionList = []; //如果是第一页需手动置空列表
						this.distributionList = this.distributionList.concat(curPageData); //追加新数据
						this.mescroll.endSuccess(curPageLen, hasNext);
					} else {
						this.mescroll.endErr();
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取找货记录列表",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取找货记录列表(cargo-browse-records/cargo-search-record)",
							// 入参
							enterParams: {
								pageIndex: pageNum,
								pageSize: pageSize,
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "106",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					this.mescroll.endErr();
					console.log("获取找货记录接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取找货记录列表",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取找货记录列表(cargo-browse-records/cargo-search-record)",
						// 入参
						enterParams: {
							pageIndex: pageNum,
							pageSize: pageSize,
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "106",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 获取服务器时间
			getTime() {
				ajax.get(config.serverTime_url,{
				}).then(res => {
					if(res.code == 0){
						// console.log(res.data);
						this.serverTime = res.data;
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取服务器时间",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取服务器时间(face-user/getTime)",
							// 入参
							enterParams: null,
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "106",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取服务器时间数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取服务器时间",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取服务器时间(face-user/getTime)",
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "106",
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
	.findRecord {
		position: relative;
		.allocationCon {
			width: 100%;
			margin-top: 70rpx;
			.allocationList {
				width: 90%;
				height: 300rpx;
				margin: 0 auto;
				margin-bottom: 20rpx;
				background: #FFFFFF;
				border-radius: 20rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;
				align-items: center;
				box-shadow: 0 0 10rpx #dddddd;
				.listTop {
					width: 100%;
					height: 26%;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					position: relative;
					.listTop-left {
						margin-left: 16rpx;
						display: flex;
						justify-content: space-evenly;
						align-items: center;
						.listTop-left-both {
							display: flex;
							justify-content: space-evenly;
							align-items: center;
							.listTop-left-both-img {
								width: 25rpx;
								height: 25rpx;
								text-align: center;
								background: #1BB68A;
								font-size: 14rpx;
								line-height: 25rpx;
								border-radius: 50%;
								color: #FFFFFF;
							}
							.listTop-left-both-tit {
								font-size: 28rpx;
								color: #333333;
								margin-left: 8rpx;
							}
						}
					}
					.listTop-right {
						background: #F0F0F0;
						border-radius: 0rpx 20rpx 0rpx 20rpx;
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
					height: 48%;
					margin: 0 auto;
					border-top: 1rpx solid #f5f5f5;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.listMid-left {
						display: flex;
						flex-direction: column;
						justify-content: space-evenly;
						align-items: flex-start;
						.listMid-left-top {
							display: flex;
							justify-content: flex-start;
							align-items: center;
							.listMidCon1 {
								font-size: 20rpx;
								color: #333333;
								margin-right: 7rpx;
							}
						}
						.listMid-left-mid {
							display: flex;
							justify-content: flex-start;
							align-items: center;
							.listMidCon2 {
								font-size: 20rpx;
								color: #666666;
								margin-right: 7rpx;
							}
						}
						.listMid-left-bot {
							display: flex;
							justify-content: flex-start;
							align-items: center;
							.listMidCon3 {
								font-size: 20rpx;
								color: #666666;
								margin-right: 7rpx;
							}
							.listMidCon4 {
								font-size: 24rpx;
								color: #FB6E2F;
								font-weight: 600;
							}
						}
					}
					.listMid-right {
						width: 100rpx;
						height: 100rpx;
						background: linear-gradient(180deg, #FFE14C 0%, #FEC24D 100%);
						border-radius: 20rpx;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						.listMid-right-btn {
							font-size: 20rpx;
							color: #333333;
						}
					}
				}
				.listBot {
					width: 100%;
					height: 26%;
					background: #F0F0F0;
					border-radius: 0rpx 0rpx 20rpx 20rpx;
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
				height: 60rpx;
				background: #F7ECD5;
				border-radius: 40rpx 40rpx 0rpx 0rpx;
				z-index: 2;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.tongzhi {
					font-size: 30rpx;
					color: #FB6E2F;
					margin: 0 12rpx 0 30rpx;
				}
				.kong-title-text {
					font-size: 20rpx;
					color: #FB6E2F;
				}
			}
		}
	}
</style>
