<template>
	<view class="myOrder">
		<u-navbar :is-back="false" title="" :border-bottom="false">
			<view class="slot-wrap">
				<u-search @click="goSearch" :disabled="true" :show-action="false" placeholder="搜索我的订单"></u-search>
			</view>
		</u-navbar>
		<view class="tabs-nav" :style="{top: `${barheight}px`}">
			<u-tabs font-size="28" ref="uTabs" :bold="false" active-color="#FB6E2F" inactive-color="#666666" bg-color="#f5f6f7" gutter="28" bar-width="60" :list="lists" :is-scroll="false" :current="current" @change="tabsChange"></u-tabs>
		</view>
		
		<view class="myOrder-cont">
			<mescroll-body ref="mescrollRef" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<orderList @relation="telShow" :item="item" :faceState="faceState" v-for="(item,index) of allOrderList" :key="index"></orderList>
			</mescroll-body>
		</view>
		
		<phoneList :phoneLists="phoneLists" @change='phonehide' v-if="phoneShow" :phoneShow="phoneShow"></phoneList>
		
		<!-- 与包裹页面所有内容的元素u-page同级，且在它的下方 -->
		<!-- <u-tabbar :before-switch="beforeSwitch" active-color="#FB6E2F" inactive-color="#666666" height="110" :list="list" :mid-button="true"></u-tabbar> -->
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
				upOption:{
					empty:{
						tip: '~ 暂无订单 ~', // 提示
					},
					textNoMore: '--- 没有更多 ---'
				},
				barheight: this.statusBar,
				list: this.$store.state.list,

				lists: [
					{
						name: '全部'
					},
					{
						name: '待确认'
					},
					{
						name: '运输中'
					},
					{
						name: '待支付'
					},
					{
						name: '待评价'
					},
					{
						name: '已完成'
					},
					{
						name: '已取消'
					},
				],
				current: 0, // tabs组件的current值，表示当前活动的tab选项

				// 订单列表
				allOrderList: [],

				// 当前页数
				pageIndex: 1,
				// 当前页面行数
				pageSize: 10,
				// 总数据量
				total: 0,
				
				// 联系电话列表显示
				phoneShow: false,
				
				// 联系电话列表
				phoneLists: [],

				// 当前搜索的订单索引
				faceState: '-1',
				
				canReset: false,
			}
		},
		onLoad(option) {
			uni.$on('orderIndex',(index) => {
				console.log(index);
				this.faceState = index;
				if(index == '-1') {
					this.current = 0;
				} else if(index == '1') {
					this.current = 1;
				} else if(index == '2') {
					this.current = 2;
				} else if(index == '3') {
					this.current = 3;
				} else if(index == '4') {
					this.current = 4;
				} else if(index == '6') {
					this.current = 5;
				} else if(index == '7') {
					this.current = 6;
				}
				this.tabsChange(this.current);
			});
			

			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "我的订单页面加载",
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
				page: "107",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onShow() {
			uni.showTabBar();
			this.canReset && this.mescroll.resetUpScroll();
			this.canReset && this.mescroll.scrollTo(0,0);
			this.canReset = true;
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "我的订单页面显示",
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
				page: "107",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onUnload() {
			uni.$off('orderIndex'); 
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "我的订单页面卸载",
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
				page: "107",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		watch: {
		    phoneShow: {
		        handler(val) {
		            if(val) {
						uni.hideTabBar();
					} else {
						uni.showTabBar();
					}
		        }
		    }
		},
		methods: {
			// 上拉加载的回调
			upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				ajax.get(config.order_url, {
					param: this.goodsSearch,
					faceState: this.faceState,
					pageIndex: pageNum,
					pageSize: pageSize
				}).then(res => {
					// console.log(res);
					if (res.code == 0) {
						let curPageData = res.data.list;
						let curPageLen = res.data.list.length;
						let hasNext = res.data.hasNextPage;
						
						if(page.num == 1) this.allOrderList = []; //如果是第一页需手动置空列表
						this.allOrderList = this.allOrderList.concat(curPageData); //追加新数据
						this.mescroll.endSuccess(curPageLen, hasNext);
					} else {
						this.mescroll.endErr();
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取订单列表",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取订单列表(order-management/freight-shipping-order)",
							// 入参
							enterParams: {
								param: this.goodsSearch,
								faceState: this.faceState,
								pageIndex: pageNum,
								pageSize: pageSize
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "107",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					this.mescroll.endErr();
					console.log("获取订单列表数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取订单列表",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取订单列表(order-management/freight-shipping-order)",
						// 入参
						enterParams: {
							param: this.goodsSearch,
							faceState: this.faceState,
							pageIndex: pageNum,
							pageSize: pageSize
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "107",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			beforeSwitch(index) {
				let routes = getCurrentPages();
				let curRoute = routes[routes.length - 1].route;
				if(index == 0 && curRoute != 'pages/allocation/allocation') {
					uni.reLaunch({
						url: "/pages/allocation/allocation"
					})
				} else if(index == 1 && curRoute != 'pages/message/message') {
					uni.reLaunch({
						url: "/pages/message/message"
					})
				} else if(index == 2 && curRoute != 'pages/order/order') {
					uni.reLaunch({
						url: "/pages/order/order"
					})
				} else if(index == 3 && curRoute != 'pages/my/my') {
					uni.reLaunch({
						url: "/pages/my/my"
					})
				}
			},
			
			// 联系货主
			telShow(e) {
				this.getPhoneList(e);
				this.phoneShow = true;
			},
			
			// 关闭联系号码列表
			phonehide(e) {
				this.phoneShow = e;
			},
			
			// 获取电话列表
			getPhoneList(phone) {
				ajax.get(config.phoneList_url,{
					username: phone
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						this.phoneLists = res.data;
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取电话列表",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取电话列表(contact-phone/list)",
							// 入参
							enterParams: {
								username: phone
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "107",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取电话列表接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取电话列表",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取电话列表(contact-phone/list)",
						// 入参
						enterParams: {
							username: phone
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "107",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},

			// 跳转到搜索页
			goSearch() {
				uni.navigateTo({
					url: "/pages/orderSearch/orderSearch"
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到搜索页",
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
					page: "107",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},

			// 跳转到订单详情
			goOrderDetail(id, state) {
				uni.navigateTo({
					url: "/pages/orderDetails/orderDetails?id=" + id + "&orderIndex=" + this.faceState
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到订单详情",
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
					page: "107",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},

			// tabs通知swiper切换
			tabsChange(index) {
				console.log(index);
				this.current = index;
				if (this.current == 0) {
					this.faceState = '-1';
				} else if (this.current == 5) {
					this.faceState = '6';
				} else if (this.current == 6) {
					this.faceState = '7';
				} else {
					this.faceState = String(this.current);
				}
				console.log(this.faceState);
				this.mescroll.resetUpScroll();
			},

			// 打电话
			ringUp(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				});
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "联系货主",
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
					page: "107",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
		}
	}
</script>

<style scoped lang="scss">
	.myOrder {
		width: 100%;
		min-height: 100vh;
		position: relative;
		.myOrder-cont {
			width: 100%;
			margin-top: 60rpx;
		}
		.tabs-nav {
			width: 100%;
			position: fixed;
			top: 88rpx;
			z-index: 10;
		}

		.slot-wrap {
			display: flex;
			align-items: center;
			/* 如果您想让slot内容占满整个导航栏的宽度 */
			flex: 1;
			margin: 0 20rpx;
		}

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

				.site-content-top-right {
					.site-content-top-right-both {
						font-size: 24rpx;
						color: #333333;
						height: 130rpx;

						.site-content-top-right-both-text {
							font-size: 20rpx;
							color: #999999;
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
						width: 36rpx;
						height: 36rpx;
						background: #1bb68a;
						border-radius: 50%;
						line-height: 36rpx;
						text-align: center;
						font-size: 20rpx;
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

						.listBots-con2 {
							height: 28rpx;
							line-height: 28rpx;
							font-size: 20rpx;
							color: #FB6E2F;
							;
							margin-right: 7rpx;
						}
					}
				}
			}
		}
	}
</style>
