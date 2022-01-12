<template>
	<view class="commonPath">
		<u-navbar back-text="" title-color="#333333" title="常用路线" :background="topBackground" :border-bottom="false">
			<view slot="right" class="slot-wrap" @click="goFind">
				找货记录
			</view>
		</u-navbar>
		<view class="kong" :style="{top: `${barheight}px`}">
			<view class="kong-title">
				<view class="kong-title-tit">我的路线</view>
				<view class="kong-title-text">最多10条线路</view>
			</view>
		</view>
		<view class="pathContent">
			<view class="path-cont" v-for="(item, index) in pathList" :key="index">
				<view class="path-cont-top" style="border-bottom: 2rpx dashed #d8d8d8;">
					<view class="path-cont-top-top">
						<view class="path-cont-top-top-left">
							<view class="path-cont-top-top-left-yuan"></view>
							<view class="path-cont-top-top-left-text">装货地</view>
						</view>
						<view class="path-cont-top-top-rig">
							<view class="path-cont-top-top-rig-btn" style="margin-right: 25rpx;" @click="updatePath(item)">修改</view>
							<view class="path-cont-top-top-rig-btn" @click="delPath(item.id)">删除</view>
						</view>
					</view>
					<view class="path-cont-top-bot">
						<text class="path-cont-top-bot-text" v-if="item.loadingCityNames.length == 3">
							{{ item.loadingCityNames[0].label }}/{{ item.loadingCityNames[1].label }}/{{ item.loadingCityNames[2].label }}
						</text>
						<text class="path-cont-top-bot-text" v-else-if="item.loadingCityNames.length == 2">
							{{ item.loadingCityNames[0].label }}/{{ item.loadingCityNames[1].label }}
						</text>
						<text class="path-cont-top-bot-text" v-else>
							{{ item.loadingCityNames[0].label }}
						</text>
					</view>
				</view>
				<view class="path-cont-top">
					<view class="path-cont-top-top">
						<view class="path-cont-top-top-left">
							<view class="path-cont-top-top-left-yuan"></view>
							<view class="path-cont-top-top-left-text">卸货地</view>
						</view>
					</view>
					<view class="path-cont-top-bot">
						<text class="path-cont-top-bot-text" v-if="item.unloadingCityNames.length == 3">
							{{ item.unloadingCityNames[0].label }}/{{ item.unloadingCityNames[1].label }}/{{ item.unloadingCityNames[2].label }}
						</text>
						<text class="path-cont-top-bot-text" v-else-if="item.unloadingCityNames.length == 2">
							{{ item.unloadingCityNames[0].label }}/{{ item.unloadingCityNames[1].label }}
						</text>
						<text class="path-cont-top-bot-text" v-else>
							{{ item.unloadingCityNames[0].label }}
						</text>
					</view>
				</view>
				<view class="title-wrap2-bot" v-if="item.cargorCarConductorNames != null || item.cargorCarModeNames != null">
					<view class="pathType-both-yuans"></view>
					<view v-if="item.cargorCarConductorNames != null">
						<view style="margin-right: 30rpx;" class="pathType-both-texts" v-if="item.cargorCarConductorNames.length == 3">车长 {{ `${item.cargorCarConductorNames[0].label}米/${item.cargorCarConductorNames[1].label}米/${item.cargorCarConductorNames[2].label}米` }}</view>
						<view style="margin-right: 30rpx;" class="pathType-both-texts" v-if="item.cargorCarConductorNames.length == 2">车长 {{ `${item.cargorCarConductorNames[0].label}米/${item.cargorCarConductorNames[1].label}米` }}</view>
						<view style="margin-right: 30rpx;" class="pathType-both-texts" v-if="item.cargorCarConductorNames.length == 1">车长 {{ `${item.cargorCarConductorNames[0].label}米` }}</view>
					</view>
					<view v-if="item.cargorCarModeNames != null">
						<view class="pathType-both-texts" v-if="item.cargorCarModeNames.length == 3">车型 {{ `${item.cargorCarModeNames[0].label}/${item.cargorCarModeNames[1].label}/${item.cargorCarModeNames[2].label}` }}</view>
						<view class="pathType-both-texts" v-if="item.cargorCarModeNames.length == 2">车型 {{ `${item.cargorCarModeNames[0].label}/${item.cargorCarModeNames[1].label}` }}</view>
						<view class="pathType-both-texts" v-if="item.cargorCarModeNames.length == 1">车型 {{ `${item.cargorCarModeNames[0].label}` }}</view>
					</view>
				</view>
			</view>
			<u-empty text="未添加常用线路,请选择添加" mode="list" v-if="pathList == null"></u-empty>
		</view>
		
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" :closeable="true" v-model="popShow" mode="center">
			<view class="hintTit">温馨提示</view>
			<view class="hintCon">您确定删除吗？</view>
			<view class="hintBtn">
				<view style="width: 50%;" @click="delPathss">确认删除</view>
				<view class="hintBtnShu"></view>
				<view style="color: #333333; width: 50%;" @click="popShow = false">暂不删除</view>
			</view>
		</u-popup>
		
		<view class="pathBtn">
			<button :disabled="pathList.length == 10"  style="background: #FFC24D;" class="submitBtn" :class="{loginButton: pathList.length == 10}" @click="goAddPath">添加常用路线</button>
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
				
				pathList: [],
				
				popShow: false,
				
				delId: null,
			}
		},
		onBackPress() {
			uni.switchTab({
				url: "/pages/allocation/allocation"
			})
			return true;
		},
		onLoad() {
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "常用路线页面加载",
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
				page: "105",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onShow() {
			this.getPath();
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "常用路线页面显示",
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
				page: "105",
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
				node: "常用路线页面卸载",
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
				page: "105",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		methods: {
			
			// 跳转到添加线路
			goAddPath() {
				uni.navigateTo({
					url: "/pages/commonPath/commonPath",
				});
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到添加常用线路",
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
					page: "105",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 修改路线
			updatePath(item) {
				let items = encodeURIComponent(JSON.stringify(item))
				uni.navigateTo({
					url: '/pages/commonPath/commonPath?item=' + items
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到修改常用线路",
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
					page: "105",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 删除路线
			delPath(id) {
				this.delId = id;
				this.popShow = true;
			},
			
			// 删除路线
			delPathss() {
				console.log(this.delId);
				this.deletePath(this.delId);
				this.popShow = false;
			},
			
			// 跳转到找货记录
			goFind() {
				uni.navigateTo({
					url: "/pages/findRecord/findRecord"
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到找货记录",
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
					page: "105",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 删除常用路线列表
			deletePath(id) {
				ajax.del(config.distributionLine_url + `/${id}`,{
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						this.pathList = [];
						this.getPath();
						uni.showToast({ title: "删除成功",icon: "none" ,duration:2000});
					} else {
						uni.showToast({ title: "删除失败",icon: "none" ,duration:2000});
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "删除常用路线",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "删除常用路线(distribution-hall/distribution-line)",
							// 入参
							enterParams: {
								id: id
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "105",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("删除常用路线接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "删除常用路线",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "删除常用路线(distribution-hall/distribution-line)",
						// 入参
						enterParams: {
							id: id
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "105",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 获取常用路线列表
			getPath() {
				ajax.get(config.distributionLine_url,{
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						this.pathList = res.data;
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取常用路线列表",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取常用路线列表(distribution-hall/distribution-line)",
							// 入参
							enterParams: null,
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "105",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取常用路线接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取常用路线列表",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取常用路线列表(distribution-hall/distribution-line)",
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "105",
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
	.commonPath {
		.hintTit {
			width: 100%;
			text-align: center;
			font-size: 36rpx;
			color: #333333;
			position: relative;
			top: 92rpx;
		}
		.hintCon {
			width: 100%;
			text-align: center;
			font-size: 32rpx;
			color: #999999;
			position: relative;
			top: 110rpx;
		}
		.hintBtn {
			width: 100%;
			height: 90rpx;
			line-height: 90rpx;
			border-top: 2rpx solid #DDDDDD;
			text-align: center;
			font-size: 32rpx;
			color: #F96F2B;
			display: flex;
			justify-content: space-between;
			align-items: center;
			position: absolute;
			bottom: 0;
			.hintBtnShu {
				width: 0rpx;
				height: 90rpx;
				border: 2rpx solid #DDDDDD;
			}
		}
		.pathContent {
			width: 92%;
			height: 860rpx;
			margin: 0 auto;
			margin-top: 100rpx;
			overflow-y: auto;
			.path-cont {
				width: 100%;
				background: #FFFFFF;
				border-radius: 20rpx;
				margin-bottom: 30rpx;
				.title-wrap2-bot {
					width: 100%;
					height: 64rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					background: #F0F0F0;
					border-radius: 0 0 20rpx 20rpx;
					padding: 0 20rpx;
					.pathType-both-texts {
						font-size: 20rpx;
						color: #999999;
					}
					.pathType-both-yuans {
						width: 10rpx;
						height: 10rpx;
						margin-right: 12rpx;
						background: #1896DB;
						border-radius: 50%;
					}
				}
				.path-cont-top {
					width: 100%;
					padding: 10rpx 20rpx;
					.path-cont-top-bot {
						padding: 0 20rpx;
						font-size: 24rpx;
						line-height: 38rpx;
						color: #666666;
					}
					.path-cont-top-top {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.path-cont-top-top-left {
							display: flex;
							justify-content: flex-start;
							align-items: center;
							.path-cont-top-top-left-yuan {
								width: 10rpx;
								height: 10rpx;
								background: #1BB68A;
								border-radius: 50%;
							}
							.path-cont-top-top-left-text {
								height: 32rpx;
								margin-left: 12rpx;
								font-size: 24rpx;
								line-height: 32rpx;
								color: #1BB68A;
							}
						}
						.path-cont-top-top-rig {
							display: flex;
							justify-content: flex-end;
							align-items: center;
							.path-cont-top-top-rig-btn {
								font-size: 24rpx;
								color: #666666;
							}
						}
					}
				}
			}
			.pathContent-item {
				margin-bottom: 20rpx;
				// border-radius: 8rpx;
				.upBtn {
					width: 92rpx;
					height: 92rpx;
					background: #2680EB;
					display: flex;
					justify-content: center;
					align-items: center;
					.xiugai1 {
						color: #ffffff;
					}
				}
				.delBtn {
					width: 92rpx;
					height: 92rpx;
					background: #FA5D2E;
					border-radius: 0rpx 8rpx 8rpx 0rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					.shanchu1 {
						color: #ffffff;
					}
				}
				.upBtn2 {
					width: 130rpx;
					height: 130rpx;
					background: #2680EB;
					display: flex;
					justify-content: center;
					align-items: center;
					.xiugai2 {
						font-size: 40rpx;
						color: #ffffff;
					}
				}
				.delBtn2 {
					width: 130rpx;
					height: 130rpx;
					background: #FA5D2E;
					border-radius: 0rpx 8rpx 8rpx 0rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					.shanchu2 {
						font-size: 40rpx;
						color: #ffffff;
					}
				}
				.title-wrap1 {
					width: 100%;
					height: 92rpx;
					background: #FFFFFF;
					border-radius: 8rpx;
					display: flex;
					justify-content: space-between; 
					padding: 0 30rpx;
					.pathType-both {
						width: 280rpx;
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.pathType-both-text {
							width: 260rpx;
							font-size: 24rpx;
							color: #666666;
							display: flex;
							justify-content: flex-start;
							align-items: center;
							.pathType-both-text-tit {
								display: inline-block;
								width: 33.333%;
								height: 100%;
								word-break: keep-all;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 1;
								-webkit-box-orient: vertical;
							}
						}
						.pathType-both-yuan {
							width: 10rpx;
							height: 10rpx;
							margin-right: 12rpx;
							background: #1BB68A;
							border-radius: 50%;
						}
					}
					.pathType-mid {
						font-size: 38rpx;
						color: #868686;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
				.title-wrap2 {
					width: 100%;
					height: 130rpx;
					background: #FFFFFF;
					border-radius: 8rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between; 
					align-items: center;
					.title-wrap2-top {
						display: flex;
						justify-content: space-between; 
						align-items: center;
						width: 92%;
						height: 52%;
						.pathType-both {
							width: 280rpx;
							display: flex;
							justify-content: flex-start;
							align-items: center;
							.pathType-both-text {
								width: 260rpx;
								font-size: 24rpx;
								color: #666666;
								display: flex;
								justify-content: flex-start;
								align-items: center;
								.pathType-both-text-tit {
									display: inline-block;
									width: 33.333%;
									height: 100%;
									word-break: keep-all;
									white-space: nowrap;
									overflow: hidden;
									text-overflow: ellipsis;
									display: -webkit-box;
									-webkit-line-clamp: 1;
									-webkit-box-orient: vertical;
								}
							}
							.pathType-both-yuan {
								width: 10rpx;
								height: 10rpx;
								margin-right: 12rpx;
								background: #1BB68A;
								border-radius: 50%;
							}
						}
						.pathType-mid {
							font-size: 38rpx;
							color: #868686;
							display: flex;
							justify-content: center;
							align-items: center;
						}
					}
					.title-wrap2-bot {
						width: 92%;
						display: flex;
						justify-content: flex-start;
						align-items: center;
						height: 48%;
						border-top: 2rpx solid #f5f5f5;
						.pathType-both-texts {
							font-size: 20rpx;
							color: #999999;
						}
						.pathType-both-yuans {
							width: 10rpx;
							height: 10rpx;
							margin-right: 12rpx;
							background: #1896DB;
							border-radius: 50%;
						}
					}
				}
			}
		}
		.pathBtn {
			width: 100%;
			position: fixed;
			bottom: 5%;
			.submitBtn {
				width: 90%;
				height: 80rpx;
				line-height: 80rpx;
				position: absolute;
				left: 5%;
				bottom: 8%;
				color: #333333;
			}
			.loginButton {
				background: #DDDDDD !important;
				color: #333333;
			}
		}
		.slot-wrap {
			font-size: 24rpx;
			color: #333333;
			margin-right: 30rpx;
		}
		.kong {
			width: 100%;
			height: 90rpx;
			background: linear-gradient(89deg, #FFE14C 0%, #FFC24D 100%);
			position: fixed;
			top: 85rpx;
			z-index: 10;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			align-items: center;
			.kong-title {
				width: 100%;
				height: 80rpx;
				background: #F5F6F7;
				border-radius: 40rpx 40rpx 0rpx 0rpx;
				z-index: 2;
				padding: 0 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.kong-title-text {
					font-size: 20rpx;
					color: #FB6E2F;
				}
				.kong-title-tit {
					font-size: 28rpx;
					font-weight: 600;
					color: #333333;
				}
			}
		}
	}
</style>
