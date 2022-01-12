<template>
	<view class="findRecord">
		<u-navbar back-text="" title-color="#333333" title="预约大厅" :background="topBackground" :border-bottom="false">
			<view slot="right" class="slot-wrap" @click="scanCode">
				<u-icon class="iconStyle" name="scan" color="#333333" size="28"></u-icon>
				<view class="scanText">扫码预约</view>
			</view>
		</u-navbar>
		<!-- 列表 -->
		<view class="allocationCon">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" :up="upOption" @down="downCallback" @up="upCallback">
				<view class="hallItem" v-for="(item,index) in bookingHallList" :key="index">
					<view class="hallItem-Top">
						<view class="hallItem-Top-left">
							<text class="hallItem-Top-left-title">{{ item.carNumber }}</text>
							<text class="hallItem-Top-left-text" :style="[item.inOutType == 1 ? stateStyle1 : stateStyle2]">{{ item.inOutType == 1 ? "卸货" : "装货" }}</text>
						</view>
						<view class="hallItem-Top-rig">{{ item.preStatus == 1 ? "已预约" : item.preStatus == 2 ? "待靠台" : item.preStatus == 3 ? "正在作业" : item.preStatus == 4 ? "装卸完成" : item.preStatus == 5 ? "已完成" : "" }}</view>
					</view>
					<view class="hallItem-bot">
						<view class="hallItem-bot-both">
							<view class="hallItem-bot-both-text" style="flex: 1">{{ item.driverName }}</view>
							<view class="hallItem-bot-both-text" style="flex: 5; text-align: right;">{{ item.repertoryName }}</view>
						</view>
						<view class="hallItem-bot-both">
							<view class="hallItem-bot-both-text">
								<text>{{ item.preDate }}</text>
								<text style="margin-left: 20rpx;">{{ item.preStartTime }}-{{ item.preEndTime }}</text>
							</view>
							<view class="hallItem-bot-both-text">{{ item.platformName }}</view>
						</view>
					</view>
					<view class="hallItem-bot" style="padding: 15rpx 0 5rpx 0; border-top: 2rpx solid #F5F5F5;" v-if="item.cargoCode">
						<text class="hallItem-bot-text">订单编号：{{ item.cargoCode }}</text>
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
				status: 'nomore',
				// 顶部导航的背景
				topBackground: {
					// 渐变色
					backgroundImage: 'linear-gradient(89deg, #FFE14C 0%, #FFC24D 100%)',
				},
				
				// 预约大厅列表
				bookingHallList: [],
				
				// 当前页数
				pageIndex: 1,
				// 当前页面行数
				pageSize: 10,
				total: 0,
				upOption:{
					empty:{
						tip: '~ 暂无预约记录 ~', // 提示
					},
					textNoMore: '--- 没有更多 ---'
				},
				
				plateNumber: '',
				
				canReset: false,
			}
		},
		computed: {
			// 1表示卸货 2表示装货
			stateStyle1() {
				let background,color;
				background = '#FFEDDE';
				color = '#FD8624';
				return { background, color }
			},
			stateStyle2() {
				let background,color;
				background = '#EAF1FC';
				color = '#1678FF';
				return { background, color }
			},
		},
		onLoad(option) {
			console.log(option);
			this.plateNumber = option.plateNumber;
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "预约大厅加载",
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
				page: "bookingHall.vue",
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
				node: "预约大厅显示",
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
				page: "bookingHall.vue",
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
				node: "预约大厅卸载",
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
				page: "bookingHall.vue",
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
				ajax.get(config.preList_url,{
				  pageIndex: pageNum,
				  pageSize: pageSize,
				  carNumber: this.plateNumber
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						let curPageData = res.data.list;
						let curPageLen = res.data.list.length;
						let hasNext = res.data.hasNextPage;
						
						if(page.num == 1) this.bookingHallList = []; //如果是第一页需手动置空列表
						this.bookingHallList = this.bookingHallList.concat(curPageData); //追加新数据
						this.mescroll.endSuccess(curPageLen, hasNext);
					} else {
						this.mescroll.endErr();
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取预约大厅列表",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取预约大厅列表(temp/my-pre-list)",
							// 入参
							enterParams: {
								pageIndex: pageNum,
								pageSize: pageSize,
								carNumber: this.plateNumber
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "bookingHall.vue",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					this.mescroll.endErr();
					console.log("获取预约历史接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取预约大厅列表",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取预约大厅列表(temp/my-pre-list)",
						// 入参
						enterParams: {
							pageIndex: pageNum,
							pageSize: pageSize,
							carNumber: this.plateNumber
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "bookingHall.vue",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 扫描二维码
			scanCode() {
				// #ifdef H5
				uni.navigateTo({
					url: "/pages/scanSubscribe/scanSubscribe"
				})
				// #endif
				// #ifdef APP-PLUS
				// 只允许通过相机扫码
				uni.scanCode({
				    onlyFromCamera: true,
				    success: res => {
						console.log(res.result);
						let result = res.result;
						let repertoryId = result.substring(result.indexOf('?'), result.length);
						console.log(repertoryId);
				        uni.navigateTo({
				        	url: `/pages/scanSubscribe/scanSubscribe${repertoryId}`
				        })
				    }
				});
				// #endif
			},
		}
	}
</script>

<style lang="scss" scoped>
	.findRecord {
		position: relative;
		.slot-wrap {
			width: 80rpx;
			height: 88rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.iconStyle {
				width: 32rpx; 
				height: 32rpx; 
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 3rpx;
			}
			.scanText {
				width: 80rpx;
				height: 28rpx;
				font-size: 20rpx;
				line-height: 28rpx;
				color: #333333;
			}
		}
		
		.allocationCon {
			width: 100%;
			margin-top: 40rpx;
			
			.hallItem {
				width: 690rpx;
				margin: 0 auto;
				// height: 242rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 2rpx 4rpx rgba(0, 0, 0, 0.16);
				border-radius: 16rpx;
				padding: 20rpx;
				margin-bottom: 30rpx;
				.hallItem-Top {
					width: 100%;
					height: 35%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom: 2rpx solid #f5f5f5;
					padding-bottom: 15rpx;
					.hallItem-Top-left {
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.hallItem-Top-left-title {
							font-size: 32rpx;
							font-family: PingFang SC;
							font-weight: 800;
							color: #333333;
						}
						.hallItem-Top-left-text {
							width: 52rpx;
							height: 30rpx;
							line-height: 30rpx;
							text-align: center;
							margin-left: 20rpx;
							background: #FFEDDE;
							border-radius: 4rpx;
							font-size: 20rpx;
							color: #FD8624;
						}
					}
					.hallItem-Top-rig {
						font-size: 24rpx;
						color: #A6A6A6;
					}
				}
				.hallItem-bot {
					width: 100%;
					height: 65%;
					padding: 20rpx 0 20rpx 0;
					.hallItem-bot-text {
						font-size: 24rpx;
						color: #FD8624;
					}
					.hallItem-bot-both {
						width: 100%;
						height: 50%;
						padding: 5rpx 0;
						display: flex;
						justify-content: space-between;
						align-items: center;
						color: #A6A6A6;
						.hallItem-bot-both-text {
							font-size: 24rpx;
							line-height: 1.5;
							// overflow: hidden;
							// text-overflow: ellipsis;
							// display: -webkit-box;
							// -webkit-line-clamp: 1;
							// -webkit-box-orient: vertical;
						}
					}
				}
			}
		}
	}
</style>

