<template>
	<view class="personal">
		<u-navbar back-text="" title="联系电话" :background="{background: '#ffffff'}" :border-bottom="false"></u-navbar>

		<view class="personalCont">
			<u-cell-group>
				<u-cell-item :arrow="false" class="cellItem" :title="item.phone" v-for="(item,index) of phoneList" :key="index">
					<u-icon style="margin-right: 16rpx;" slot="icon" size="36" name="phone"></u-icon>
					<u-icon v-if="phoneList.length > 1" slot="right-icon" size="36" name="trash" @click="delPhoneList(item.id)"></u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="personalBot">
			<view class="personalBot-yuan"></view>
			<view class="personalBot-text">最多添加5个联系电话</view>
		</view>
		
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" :closeable="true" v-model="popShow" mode="center">
			<view class="hintTit">温馨提示</view>
			<view class="hintCon">您确定删除吗？</view>
			<view class="hintBtn">
				<view style="width: 50%;" @click="delPhoneListss">确认删除</view>
				<view class="hintBtnShu"></view>
				<view style="color: #333333; width: 50%;" @click="popShow = false">暂不删除</view>
			</view>
		</u-popup>

		<button :disabled="phoneList.length == 5" style="background: #FFC24D;" class="submitBtn" :class="{loginButton: phoneList.length == 5}" @click="addPhone">添加联系电话</button>

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

				// 联系电话
				phoneList: [],
				
				popShow: false,
				
				phoneId: null
			}
		},
		onLoad() {
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "联系电话页面加载",
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
				page: "120",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onShow() {
			this.getPhoneList();
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "联系电话页面显示",
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
				page: "120",
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
				node: "联系电话页面卸载",
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
				page: "120",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		methods: {
			
			// 添加手机号
			addPhone() {
				uni.navigateTo({
					url: "/pages/addPhone/addPhone"
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到添加联系电话",
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
					page: "120",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 删除联系电话
			delPhoneList(id) {
				this.popShow = true;
				this.phoneId = id;
			},
			
			// 删除联系电话
			delPhoneListss() {
				ajax.del(config.contactPhone_url + `/${this.phoneId}`, {}).then(res => {
					console.log(res);
					if (res.code == 0) {
						this.popShow = false;
						this.phoneList = [];
						this.getPhoneList();
						uni.showToast({ title: "删除成功",icon: "none" ,duration:2000});
					} else {
						this.popShow = false;
						uni.showToast({ title: "删除失败",icon: "none" ,duration:2000});
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "删除联系电话",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "删除联系电话(personal-center/freight-contact-phone)",
							// 入参
							enterParams: {
								id: this.phoneId
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "120",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("删除联系电话接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "删除联系电话",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "删除联系电话(personal-center/freight-contact-phone)",
						// 入参
						enterParams: {
							id: this.phoneId
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "120",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},

			// 获取联系电话列表
			getPhoneList() {
				ajax.get(config.contactPhone_url, {}).then(res => {
					console.log(res);
					if (res.code == 0) {
						this.phoneList = res.data;
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取联系电话列表",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取联系电话列表(personal-center/freight-contact-phone)",
							// 入参
							enterParams: null,
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "120",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取联系电话列表接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取联系电话列表",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取联系电话列表(personal-center/freight-contact-phone)",
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "120",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.personal {
		width: 100%;
		height: 100vh;
		position: relative;
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
		.submitBtn {
			width: 90%;
			height: 80rpx;
			line-height: 80rpx;
			position: absolute;
			left: 5%;
			bottom: 5%;
			color: #333333;
		}

		.loginButton {
			background: #DDDDDD !important;
			color: #333333;
		}
		
		.personalCont {
			width: 92%;
			margin: 40rpx auto auto auto;
			background: #FFFFFF;
			border-radius: 20rpx;

			.cellItem {
				padding: 18rpx 24rpx;
			}
		}
		
		.personalBot {
			width: 92%;
			margin: 15rpx auto auto auto;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.personalBot-yuan {
				width: 8rpx;
				height: 8rpx;
				background: #999999;
				border-radius: 50%;
				margin-right: 10rpx;
			}
			.personalBot-text {
				font-size: 20rpx;
				color: #999999;
			}
		}
	}
</style>
