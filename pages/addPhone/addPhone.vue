<template>
	<view class="logoutVerifyBox">
		<u-navbar title-width="300" back-text="" title="添加联系电话"></u-navbar>
		<view style="margin-top: 24rpx;" class="autConCon2">
			<text class="autConCon2Tit">手机号码</text>
			<input class="autConCon2Inp" placeholder="请输入手机号码" maxlength="11" placeholder-class="inpsty" type="text" name="userName" v-model="username">
		</view>
		<view style="margin-top: 2rpx;" class="autConCon2">
			<text class="autConCon2Tit">验证码</text>
			<input maxlength="6" style="width: 38%;" class="autConCon2Inp" placeholder-class="inpsty" type="number" name="authCode" v-model="authcode">
			<u-verification-code unique-key="page-addPhone" change-text="XS 重新获取" ref="uCode" @change="codeChange"></u-verification-code>
			<view class="authcodes" @tap="getCode">{{ tips }}</view>
		</view>
		<button @click="goNext" :disabled="authcode == '' || username == '' || btnAstrict" style="background: #FFC24D;" class="submitBtn" :class="{loginButton: authcode == '' || username == '' || btnAstrict}">确认提交</button>
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
				// 验证码
				tips: '',
				// 手机号码
				username: '',
				// 输入的验证码
				authcode: '',
				
				// 按钮点击限制
				btnAstrict: false,
				
				codeTime: true,
			}
		},
		onLoad(option) {
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "添加联系电话页面加载",
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
				page: "121",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onShow() {
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "添加联系电话页面显示",
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
				page: "121",
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
				node: "添加联系电话页面卸载",
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
				page: "121",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		methods: {
			// 确认提交
			goNext() {
				let usernameReg = /^[1][0-9]{10}$/;
				let codeReg = /^[0-9]{6}$/;
				if(usernameReg.test(this.username)) {
					if(codeReg.test(this.authcode)) {
						this.addPhone();
					} else {
						uni.showToast({ title: "验证码格式错误（格式为6位数字），请重新输入",icon: "none" ,duration:2000});
					}
				} else {
					uni.showToast({ title: "手机号格式错误（格式为1开头的11位数字），请重新输入",icon: "none" ,duration:2000});
				}
			},
			
			// 添加联系电话
			addPhone() {
				this.btnAstrict = true;
				ajax.post(config.contactPhone_url, {phone: this.username, code: this.authcode}).then(res => {
					console.log(res);
					if (res.code == 0) {
						uni.navigateBack({
						    delta: 2
						});
					} else {
						this.btnAstrict = false;
						if(res.code == -7118) {
							uni.showToast({ title: res.msg, icon: "none" ,duration:2000});
						} else {
							uni.showToast({ title: '添加失败，请重新添加',icon: "none" ,duration:2000});
						}
						
						let content = {
							// 动作
							action: null,
							// 节点
							node: "添加联系电话",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "添加联系电话(personal-center/freight-contact-phone)",
							// 入参
							enterParams: {
								phone: this.username,
								code: this.authcode
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: "无法新增"
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "121",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					this.btnAstrict = false;
					console.log("添加联系电话接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: null,
						// 节点
						node: "添加联系电话",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "添加联系电话(personal-center/freight-contact-phone)",
						// 入参
						enterParams: {
							phone: this.username,
							code: this.authcode
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "121",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 获取验证码
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				let usernameReg = /^[1][0-9]{10}$/;
				if(usernameReg.test(this.username)) {
					if(this.$refs.uCode.canGetCode) {
						if(this.codeTime) {
							this.codeTime = false;
							this.getAuthcode();
						}
						setTimeout(() => {
							uni.hideLoading();
							// 这里此提示会被this.start()方法中的提示覆盖
							this.$u.toast('验证码已发送');
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
						}, 1000);
					}
				} else {
					uni.showToast({ title: "手机号格式错误（格式为1开头的11位数字），请重新输入",icon: "none" ,duration:2000});
				}
			},
			getAuthcode() {
				ajax.get(config.code_url,{
				  phone: this.username,
				  type: 5
				}).then(res => {
					console.log(res)
					this.codeTime = true;
					if(res.code == 0){
						console.log("获取验证码成功");
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: null,
							// 节点
							node: "获取验证码",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取验证码(authentication/verification-code)",
							// 入参
							enterParams: {
								phone: this.username,
								type: 5
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: "无法新增"
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "121",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取验证码接口数据返回失败 error is :" + err);
					this.codeTime = true;
					let content = {
						// 动作
						action: null,
						// 节点
						node: "获取验证码",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取验证码(authentication/verification-code)",
						// 入参
						enterParams: {
							phone: this.username,
							type: 5
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "121",
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
	.logoutVerifyBox {
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
		.autConCon2 {
			width: 100%;
			height: 80rpx;
			font-size: 28rpx;
			color: #666666;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: #ffffff;
			.authcodes {
				text-align: center;
				width: 30%;
				line-height: 52rpx;
				border-left: 2rpx solid #DDDDDD;
				height: 52rpx;
				font-size: 24rpx;
				color: #FB6E2F;
			}
			.inpsty {
				font-size: 28rpx;
				color: #999999;
			}
			.autConCon2Tit {
				width: 20%;
				margin-left: 30rpx;
				height: 38rpx;
				line-height: 38rpx;
				text-align: right;
			}
			.autConCon2Inp {
				width: 70%;
				margin-left: 30rpx;
				height: 38rpx;
				line-height: 38rpx;
				font-size: 28rpx;
				color: #999999;
			}
		}
	}
</style>
