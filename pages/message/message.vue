<template>
	<view class="message">
		<u-navbar :is-back="false" title-color="#333333" title="消息中心" :background="topBackground" :border-bottom="false">
			<view slot="right" class="slot-wrap" @click="removeUnread">
				全部已读
			</view>
		</u-navbar>
		<view class="kong" :style="{top: `${barheight}px`}">
			<view class="kong-title"></view>
		</view>
		
		<view class="messageCont">
			<mescroll-body ref="mescrollRef" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view class="messageCont-item" v-for="(item,index) of messageList" :key="index" @click="goMessContent(item.id)">
					<view class="messageCont-item-left">
						<view class="messageCont-item-left-img">
							<Icon v-if="item.type == 1" :iconType="'iconwuliuyunshuzhuangxiangsvg'" extClass="wuliuxiaoxi1"></Icon>
							<Icon v-else-if="item.type == 2" :iconType="'iconcaiyouduoZhifuQianbaozhifu'" extClass="qianbaoxiaoxi1"></Icon>
							<view v-else-if="item.type == 5" class="iconStyless">
								<Icon :iconType="'iconqiandao'" extClass="iconqiandao"></Icon>
							</view>
							<view v-else-if="item.type == 6" class="iconStyless">
								<Icon :iconType="'iconaQiandao1'" extClass="iconqiandao1"></Icon>
							</view>
							<Icon v-else :iconType="'iconmymessage'" extClass="xitongxiaoxi1"></Icon>
						</view>
						<view class="messageCont-item-left-yuan" v-if="item.readStatus == 0"></view>
					</view>
					<view class="messageCont-item-right">
						<view class="messageCont-item-right-top">
							<view class="messageCont-item-right-top-left">{{ item.title }}</view>
							<view class="messageCont-item-right-top-rig">{{ item.createTime }}</view>
						</view>
						<view class="messageCont-item-right-bot">{{ item.content }}</view>
					</view>
				</view>
			</mescroll-body>
		</view>
		
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
				barheight: this.statusBar,
				// 顶部导航的背景
				topBackground: {
					// 渐变色
					backgroundImage: 'linear-gradient(89deg, #FFE14C 0%, #FFC24D 100%)',
				},
				status: 'nomore',
				padd: {paddingTop: '0'},
				
				list: this.$store.state.list,
				
				pageIndex: 1,
				pageSize: 10,
				
				
				// 消息列表
				messageList: [],
				
				upOption:{
					empty:{
						tip: '~ 暂无消息 ~', // 提示
					},
					textNoMore: '--- 没有更多 ---'
				},
				
				canReset: false,
			}
		},
		computed: {
			bgColor1() {
				let background = '#1296db';
				return { background }
			},
			bgColor2() {
				let background = '#fec24d';
				return { background }
			},
			bgColor3() {
				let background = '#69b452';
				return { background }
			},
		},
		onLoad() {
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "消息中心页面加载",
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
				page: "111",
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
				node: "消息中心页面显示",
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
				page: "111",
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
				node: "消息中心页面卸载",
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
				page: "111",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		methods: {
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
			
			// 上拉加载的回调
			upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				ajax.get(config.message_url,{
					pageIndex: pageNum,
					pageSize: pageSize
				}).then(res => {
					if(res.code == 0){
						// console.log(res);
						res.data.list.forEach(item => {
							item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
						});
						let curPageData = res.data.list;
						let curPageLen = res.data.list.length;
						let hasNext = res.data.hasNextPage;
						
						if(page.num == 1) this.messageList = []; //如果是第一页需手动置空列表
						this.messageList = this.messageList.concat(curPageData); //追加新数据
						this.mescroll.endSuccess(curPageLen, hasNext);
					} else {
						this.mescroll.endErr();
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取消息列表",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取消息列表(message/freight-message-notification)",
							// 入参
							enterParams: {
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
							page: "111",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					this.mescroll.endErr();
					console.log("获取消息列表接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取消息列表",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取消息列表(message/freight-message-notification)",
						// 入参
						enterParams: {
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
						page: "111",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 跳转到消息详情
			goMessContent(id) {
				uni.navigateTo({
					url: "/pages/messageContent/messageContent?id=" + id
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到消息详情",
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
					page: "111",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 全部已读
			removeUnread() {
				ajax.put(config.message_url,{
				}).then(res => {
					if(res.code == 0){
						console.log(res);
						this.messageList = [];
						this.mescroll.resetUpScroll();
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "全部已读",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "全部已读(message/freight-message-notification)",
							// 入参
							enterParams: null,
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "111",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("全部已读接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "全部已读",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "全部已读(message/freight-message-notification)",
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "111",
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
	.message {
		width: 100%;
		min-height: 100vh;
		background: #ffffff;
		.messageCont {
			width: 100%;
			margin-top: 50rpx;
			background: #ffffff;
			.messageCont-item {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				// background: #ffffff;
				.messageCont-item-left {
					width: 15%;
					height: 100%;
					position: relative;
					.messageCont-item-left-img {
						position:absolute;
						left:0;
						top: 0;
						bottom: 0;
						right: 0;
						margin: auto;
						width: 64rpx;
						border-radius: 50%;
						display: flex;
						justify-content: center;
						align-items: center;
						.xitongxiaoxi1 {
							font-size: 60rpx;
							color: #69b452;
						}
						.qianbaoxiaoxi1 {
							font-size: 60rpx;
							color: #fec24d;
						}
						.iconqiandao {
							font-size: 50rpx;
							color: #fff;
						}
						.iconqiandao1 {
							font-size: 50rpx;
							color: #fff;
						}
						.wuliuxiaoxi1 {
							font-size: 60rpx;
							color: #1296db;
						}
						.iconStyless {
							width: 60rpx; 
							height: 60rpx; 
							display: flex; 
							justify-content: center; 
							align-items: center;
							background-color: #FD8624;
							border-radius: 8rpx;
						}
					}
					.messageCont-item-left-yuan {
						width: 20rpx;
						height: 20rpx;
						background: #FF0000;
						border-radius: 50%;
						position: absolute;
						top: -38rpx;
						right: 18rpx;
					}
				}
				.messageCont-item-right {
					width: 80%;
					height: 100%;
					padding: 40rpx 0;
					border-bottom: 2rpx solid #f5f5f5;
					.messageCont-item-right-top {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.messageCont-item-right-top-left {
							font-size: 28rpx;
							color: #333333;
						}
						.messageCont-item-right-top-rig {
							font-size: 20rpx;
							color: #999999;
						}
					}
					.messageCont-item-right-bot {
						font-size: 20rpx;
						color: #999999;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
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
				// background: #F5F6F7;
				background: #ffffff;
				border-radius: 40rpx 40rpx 0rpx 0rpx;
			}
		}
	}
</style>
