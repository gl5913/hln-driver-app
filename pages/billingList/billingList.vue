<template>
	<view class="billingLists">
		<u-navbar title-width="300" back-text="" title="账单明细"></u-navbar>
		<view class="tabs-nav" :style="{top: `${barheight}px`}">
			<u-tabs bg-color="#f5f6f7" active-color="#FB6E2F" bar-width="60" inactive-color="#666666" font-size="28" :list="billingList" :is-scroll="false" :current="current" @change="billingChange"></u-tabs>
		</view>
		
		<view class="billingList" :style="{marginTop: `${height}px`}">
			<mescroll-body ref="mescrollRef" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view class="billingListItem" v-for="(item,index) of billingLists" :key="index" @click="goBillingDetails(item.id)">
					<view class="billingListItem-top">
						<view class="billingListItem-top-left">
							<view class="billingListItem-top-left-yuan" :class="[ item.transactionType == 1 ||  item.transactionType == 3 || item.transactionType == 4 || item.transactionType == 7 ? '' : 'billingListItem-top-left-yuan2' ]"></view>
							<view class="billingListItem-top-left-text" :class="[ item.transactionType == 1 ||  item.transactionType == 3 || item.transactionType == 4 || item.transactionType == 7 ? '' : 'billingListItem-top-left-text2' ]">{{ item.transactionType == 1 ||  item.transactionType == 3 || item.transactionType == 4 ||  item.transactionType == 7 ? '收入' : '支出' }}</view>
						</view>
						<view class="billingListItem-top-right">
							<view class="billingListItem-top-right-text">{{ item.transactionType == 1 ||  item.transactionType == 3 || item.transactionType == 4 || item.transactionType == 7 ? '+' : '-' }}</view>
							<view class="billingListItem-top-right-tit">¥ {{ parseFloat(item.balance).toFixed(2) }}</view>
						</view>
					</view>
					<view class="billingListItem-bot">
						<view class="billingListItem-bot-left">{{ item.createTime }}</view>
						<view class="billingListItem-bot-right">{{ item.title }}</view>
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
				height: null,
				
				// 账单顶部列表
				billingList: [
					{
						name: '全部'
					}, 
					{
						name: '收入'
					}, 
					{
						name: '支出',
					},
				],
				
				current: 0,
				
				// 账单明细列表
				billingLists: [],
				
				// 当前页数
				pageIndex: 1,
				// 当前页面行数
				pageSize: 10,
				// 总数据量
				total: 0,
				upOption:{
					empty:{
						tip: '~ 暂无账单 ~', // 提示
					},
					textNoMore: '--- 没有更多 ---'
				},
				
				canReset: false,
			}
		},
		onLoad(option) {
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "账单明细页面加载",
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
				page: "115",
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
				node: "账单明细页面显示",
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
				page: "115",
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
				node: "账单明细页面卸载",
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
				page: "115",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onReady() {
			this.getHeight();
		},
		methods: {
			// 上拉加载的回调
			upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				let type;
				if(this.current == 0) {
					type = -1
				} else {
					type = this.current
				}
				ajax.get(config.transaction_url,{
					revenueType: type,
					pageIndex: pageNum,
					pageSize: pageSize,
					type: 2
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						res.data.list.forEach(item => {
							item.createTime = moment(item.createTime).format('YYYY.MM.DD HH:mm:ss');
						})
						let curPageData = res.data.list;
						let curPageLen = res.data.list.length;
						let hasNext = res.data.hasNextPage;
						
						if(page.num == 1) this.billingLists = []; //如果是第一页需手动置空列表
						this.billingLists = this.billingLists.concat(curPageData); //追加新数据
						this.mescroll.endSuccess(curPageLen, hasNext);
					} else {
						this.mescroll.endErr();
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取账单列表",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取账单列表(personal-center/freight-wallet-transaction)",
							// 入参
							enterParams: {
								revenueType: type,
								pageIndex: pageNum,
								pageSize: pageSize,
								type: 2
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "115",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					this.mescroll.endErr();
					console.log("获取账单列表接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取账单列表",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取账单列表(personal-center/freight-wallet-transaction)",
						// 入参
						enterParams: {
							revenueType: type,
							pageIndex: pageNum,
							pageSize: pageSize,
							type: 2
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "115",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 动态获取高度
			getHeight() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.tabs-nav').boundingClientRect(data => {
					this.height = data.height;
					console.log(data.height);
				}).exec();
			},
			
			billingChange(index) {
				this.current = index;
				this.billingLists = [];
				this.mescroll.resetUpScroll();
			},
			
			// 跳转到账单详情页
			goBillingDetails(id) {
				uni.navigateTo({
					url: "/pages/billingDetails/billingDetails?id=" + id
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到账单详情",
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
					page: "115",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
		}
	}
</script>

<style scoped lang="scss">
	.billingLists {
		width: 100%;
		min-height: 100vh;
		position: relative;
		.tabs-nav {
			position: fixed;
			top: 88rpx;
			z-index: 10;
			width: 100%;
		}
		.billingList {
			width: 100%;
			padding-top: 30rpx;
			.billingListItem {
				width: 92%;
				margin: 0 auto;
				margin-bottom: 20rpx;
				height: 136rpx;
				background: #FFFFFF;
				border-radius: 20rpx;
				padding: 30rpx 24rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				.billingListItem-top {
					width: 100%;
					height: 38rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.billingListItem-top-left {
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.billingListItem-top-left-yuan {
							width: 12rpx;
							height: 12rpx;
							background: #FD0D1B;
							border-radius: 50%;
							margin-right: 26rpx;
						}
						.billingListItem-top-left-yuan2 {
							background: #2680EB !important;
						}
						.billingListItem-top-left-text {
							font-size: 28rpx;
							color: #FF0000;
						}
						.billingListItem-top-left-text2 {
							color: #2680EB !important;
						}
					}
					.billingListItem-top-right {
						display: flex;
						justify-content: flex-end;
						align-items: center;
						.billingListItem-top-right-text {
							font-size: 24rpx;
							height: 30rpx;
							line-height: 25rpx;
							text-align: center;
							margin-right: 12rpx;
							color: #333333;
						}
						.billingListItem-top-right-tit {
							font-size: 24rpx;
							color: #333333;
						}
					}
				}
				.billingListItem-bot {
					width: 100%;
					height: 32rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.billingListItem-bot-left {
						font-size: 20rpx;
						color: #999999;
					}
					.billingListItem-bot-right {
						font-size: 24rpx;
						color: #333333;
					}
				}
			}
		}
	}
</style>
