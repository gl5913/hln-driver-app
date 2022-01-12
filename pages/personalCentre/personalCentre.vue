<template>
	<view class="personal">
		<u-navbar back-text="" title="个人信息" :background="{background: '#ffffff'}" :border-bottom="false"></u-navbar>
		<view class="personalCont">
			<u-cell-group style="border-radius: 20rpx; position: relative;">
				<view class="touxiang">
					<avatar
						selWidth="120upx" selHeight="120upx"  ref='avatar' fileType='png'
						:avatarSrc="myMessage.headPortrait != null ? myMessage.headPortrait : url" @upload="myUpload" quality="1" inner=true
						avatarStyle="width: 60upx; height: 60upx; border-radius: 50%;">
					</avatar>
				</view>
				<u-cell-item :border-top="false" class="cellItem" title="头像" @click="clk"></u-cell-item>
				<u-cell-item class="cellItem" title="用户编码" :value="myMessage.userNo" :arrow="false">
					<u-button style="margin-left: 20rpx;" size="mini" plain slot="right-icon" @click="copyUserNo">复制</u-button>
				</u-cell-item>
				<u-cell-item class="cellItem" title="联系电话" :value="contactPhone" @click="goPhone"></u-cell-item>
				<u-cell-item class="cellItem" title="重置密码" @click="changePwd"></u-cell-item>
				<u-cell-item v-if="myMessage.userCertificationStatus == 1" class="cellItem" title="实名认证" value="已认证" @click="goAuthentication(1)"></u-cell-item>
				<u-cell-item v-else class="cellItem" title="实名认证" :value-style="{color: '#FF0000'}" value="未认证" @click="goAuthentication(0)"></u-cell-item>
				<u-cell-item class="cellItem" title="车辆管理" @click="myCar"></u-cell-item>
				<u-cell-item :border-bottom="false" class="cellItem" title="关于我们" @click="goAboutHln"></u-cell-item>
			</u-cell-group>
		</view>
		<u-popup border-radius="40" v-model="portraitShow" mode="bottom" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}">
			<view class="conTit">
				<view class="conTitBtn" @click="portraitShow = false">取消</view>
				<view class="conTitCon">更换头像</view>
				<view class="conTitBtn" style="background: #ffffff"></view>
			</view>
			<view class="content" style="margin-bottom: 44rpx;">
				<view class="content-btn" @click="changeImg" data-img="phone">从手机相册选择</view>
				<view class="content-btn" @click="changeImg" data-img="photograph">重新拍照</view>
			</view>
		</u-popup>
		
		<button class="Btn" @click="goLogin">切换账户</button>
		
	</view>
</template>

<script>
	import avatar from "../../components/yq-avatar/yq-avatar.vue";
	import config from '../../service/config.js';
	import ajax from '../../service/ajax.js';
	import moment from 'moment';
	import burying from '../../common/request.js';
	import {pathToBase64} from '@/js_sdk/gsq-image-tools/image-tools/index.js';
	
	export default {
		data() {
			return {
				barheight: this.statusBar,
				url:"../../static/img47.png",
				// 个人信息
				myMessage: {},
				
				// 联系手机
				contactPhone: '',
				
				// 更换头像
				portraitShow:false
			}
		},
		onLoad() {
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "个人信息页面加载",
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
				page: "119",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onShow() {
			this.getMyMessage();
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "个人信息页面显示",
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
				page: "119",
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
				node: "个人信息页面卸载",
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
				page: "119",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		methods: {
			// 跳转到关于货灵鸟
			goAboutHln() {
				uni.navigateTo({
					url: '/pages/aboutHln/aboutHln'
				})
			},
			
			// 复制用户id
			copyUserNo() {
				// #ifdef APP-PLUS
				uni.setClipboardData({
				    data: this.myMessage.userNo,
				    success: () => {
				        uni.showToast({
				        	title: "复制成功",
				        	icon: "none",
				        	duration: 2000
				        });
				    }
				});
				// #endif
			},
			
			clk() {
				let avatar = this.$refs.avatar;
				avatar.fChooseImg(1, {selWidth: "480upx", selHeight: "480upx", expWidth: "480px", expHeight: "480upx"});
			},
			myUpload(rsp) {
				console.log(rsp);
				pathToBase64(rsp.path).then(base64 => {
					this.upload(base64);
				})
			},
			
			// 切换账户
			goLogin() {
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "切换账户",
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
					page: "119",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
				
				uni.reLaunch({
					url: "/pages/login/login"
				})

				uni.removeStorage({
				    key: 'accessToken',
				    success: res => {
				        console.log(res);
				    }
				});
				uni.removeStorage({
				    key: 'refreshToken',
				    success: res => {
				        console.log(res);
				    }
				});
				uni.removeStorage({
				    key: 'username',
				    success: res => {
				        console.log(res);
				    }
				});
				uni.removeStorageSync('userno');
			},
			
			// 实名认证
			goAuthentication(type) {
				uni.navigateTo({
					url: "/pages/myAuthentication/myAuthentication?authState=" + type
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到实名认证",
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
					page: "119",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 车辆管理
			myCar() {
				uni.navigateTo({
					url: "/pages/myCar/myCar"
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到车辆管理",
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
					page: "119",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 重置密码
			changePwd() {
				uni.navigateTo({
					url: "/pages/changePassword/changePassword"
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到重置密码",
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
					page: "119",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 修改手机号
			goOriginalPhone() {
				uni.navigateTo({
					url: "/pages/originalPhone/originalPhone?phone=" + this.myMessage.phone
				})
			},
			
			// 添加联系电话
			goPhone() {
				uni.navigateTo({
					url: "/pages/contactNumber/contactNumber"
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到联系电话",
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
					page: "119",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 图片上传
			upload(url) {
				uni.showLoading({
					title: '头像上传中',
					mask: true
				});
				ajax.post(config.fileBase64_url,{
					base64: url,
					bucketName: 'course',
				}).then(reg => {
					console.log(reg.data);
					if(reg.code == 0) {
						ajax.put(config.headPortrai_url,{
							headPortrait: reg.data,
							type: 2,
						}).then(res => {
							uni.hideLoading();
							if(res.code == 0){
								this.getMyMessage();
								this.portraitShow = false;
								uni.showToast({title:"头像更改成功",icon: "none",duration:2000});
							} else {
								this.portraitShow = false;
								uni.showToast({title:"头像更改失败，请重新上传",icon: "none",duration:2000});
								
								let content = {
									// 动作
									action: "click",
									// 节点
									node: "头像上传",
									// 异常信息
									bugInfo: res.msg,
									// 页面参数
									pageParams: null,
									// 接口名称
									intName: "头像上传(personal-center/head-portrait)",
									// 入参
									enterParams: null,
									// 出参
									outParams: res,
									// 前端编码
									webId: null
								};
								
								let info = {
									operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
									page: "119",
									type: 2,
									content: JSON.stringify(content)
								};
								
								burying.point(info);
							}
						}).catch(err => {
							uni.hideLoading();
							uni.showToast({title:"头像更改失败，请重新上传",icon: "none",duration:2000});
							
							let content = {
								// 动作
								action: "click",
								// 节点
								node: "头像上传",
								// 异常信息
								bugInfo: err,
								// 页面参数
								pageParams: null,
								// 接口名称
								intName: "头像上传(personal-center/head-portrait)",
								// 入参
								enterParams: null,
								// 出参
								outParams: null,
								// 前端编码
								webId: null
							};
							
							let info = {
								operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
								page: "119",
								type: 2,
								content: JSON.stringify(content)
							};
							
							burying.point(info);
						})
					} else {
						uni.hideLoading();
						uni.showToast({title:"头像更改失败，请重新上传",icon: "none",duration:2000});
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "base64图片上传",
							// 异常信息
							bugInfo: reg.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "base64图片上传(oss/upload/file/base64)",
							// 入参
							enterParams: null,
							// 出参
							outParams: reg,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "119",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({title:"头像更改失败，请重新上传",icon: "none",duration:2000});
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "base64图片上传",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "base64图片上传(oss/upload/file/base64)",
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "119",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 修改头像
			changeImg(e){
				let name = e.currentTarget.dataset.img
				console.log("修改头像");
				if(name == 'phone') {
					uni.chooseImage({
					    count: 1, // 默认最多一次选择9张图
						sourceType: ['album'], // 可以指定来源是相册
					    success: res=> {
							// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
							let url = res.tempFilePaths[0];
							console.log(url);
							pathToBase64(url).then(base64 => {
								this.upload(base64);
							})
							.catch(error => {
								uni.showToast({title:"头像上传失败,请重新上传",icon: "none",duration:2000})
							})
					    }
					})
				} else {
					uni.chooseImage({
					    count: 1, // 默认最多一次选择9张图
						sourceType: ['camera'], // 可以指定来源是相机
					    success: res=> {
					        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
					        let url = res.tempFilePaths[0];
							console.log(url);
					        pathToBase64(url).then(base64 => {
					        	this.upload(base64);
					        })
					        .catch(error => {
					        	uni.showToast({title:"头像上传失败,请重新上传",icon: "none",duration:2000})
					        })
					    }
					})
				}
			},
			
			// 获取我的信息
			getMyMessage() {

				uni.getStorage({
					key: 'username',
					success: reg => {
						ajax.get(config.userMess_url,{
							type: 2,
						}).then(res => {
							console.log(res);
							if(res.code == 0){
								this.myMessage = res.data;
								this.contactPhone = res.data.phone.substr(0,3) + '****' + res.data.phone.substr(7);
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
									page: "119",
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
								page: "119",
								type: 2,
								content: JSON.stringify(content)
							};
							
							burying.point(info);
						})
					}
				})
			},
		},
		components: {
			avatar
		},
	}
</script>

<style scoped lang="scss">
	.personal {
		width: 100%;
		height: 100vh;
		position: relative;
		
		.content {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;
			.content-btn {
				height: 120rpx;
				line-height: 120rpx;
				width: 93%;
				border-bottom: 2rpx solid #f5f5f5;
				font-size: 36rpx;
				color: #333333;
			}
		}
		.conTit {
			width: 100%;
			height: 90rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 30rpx;
			border-bottom: 1px solid #DDDDDD;
			.conTitBtn {
				width: 100rpx;
				height: 44rpx;
				background: #CCCCCC;
				border-radius: 40rpx;
				font-size: 24rpx;
				line-height: 44rpx;
				color: #333333;
				text-align: center;
			}
			.conTitCon {
				font-size: 32rpx;
				font-weight: 600;
				color: #F96F2B;
			}
		}
		.Btn {
			background: #FFC24D;
			width: 92%;
			height: 80rpx;
			line-height: 80rpx;
			position: absolute;
			left: 4%;
			bottom: 5%;
			color: #333333;
		}
		.personalCont {
			width: 92%;
			margin: 40rpx auto auto auto;
			background: #FFFFFF;
			border-radius: 20rpx;
			.touxiang {
				width: 60rpx;
				height: 60rpx;
				position: absolute;
				top: 12rpx;
				right: 64rpx;
			}
			.cellItem {
				padding: 18rpx 24rpx;
			}
		}
	}
</style>
