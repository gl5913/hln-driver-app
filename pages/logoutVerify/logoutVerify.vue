<template>
	<view class="logoutVerifyBox">
		<u-navbar title-width="300" back-text="" title="账户注销-身份验证"></u-navbar>
		<view style="margin-top: 24rpx;" class="autConCon2">
			<text class="autConCon2Tit">手机号码</text>
			<input class="autConCon2Inp" disabled maxlength="11" placeholder-class="inpsty" type="text" name="userName" v-model="userNa">
		</view>
		<view style="margin-top: 2rpx;" class="autConCon2">
			<text class="autConCon2Tit">验证码</text>
			<input maxlength="6" style="width: 38%;" class="autConCon2Inp" placeholder-class="inpsty" type="number" name="authCode" v-model="authcode">
			<u-verification-code unique-key="page-logoutVerify" change-text="XS 重新获取" ref="uCode" @change="codeChange"></u-verification-code>
			<view class="authcodes" @tap="getCode">{{ tips }}</view>
		</view>
		<button @click="goVerify" :disabled="authcode == '' || btnAstrict" style="background: #FFC24D;" class="submitBtn" :class="{loginButton: authcode == '' || btnAstrict}">验证并注销</button>
		<u-popup width="640" height="386" :mask-close-able="false" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" :closeable="false" v-model="popShow" mode="center">
			<view class="hintTit">温馨提示</view>
			<view class="hintCon">您的货主端账户已注销成功</view>
			<view class="hintBtn" @click="goLogin">注册司机端账户</view>
		</u-popup>
	</view>
</template>

<script>
	import config from '../../service/config.js';
	import ajax from '../../service/ajax.js';
	import moment from 'moment';
	import burying from '../../common/request.js';
	
	var  graceChecker = require("../../common/graceChecker.js");
	export default {
		onLoad(op) {
			console.log(op);
			this.userNa = op.phone.substr(0,3)+'****'+op.phone.substr(7);
			this.username = op.phone;
		},
		data() {
			return {
				// 验证码
				tips: '',
				// 手机号码
				username: '',
				// 变星登录名
				userNa: '',
				// 输入的验证码
				authcode: '',
				// 温馨提示
				popShow: false,
				// 按钮点击限制
				btnAstrict: false,
				
				codeTime: true,
			}
		},
		methods: {
			// 跳转到登录
			goLogin() {
				uni.reLaunch({
					url: "/pages/login/login",
				});
			},
			
			// 注销
			goVerify() {
				this.btnAstrict = true;
				ajax.del(config.logout_url,{
					code: this.authcode,
					phone:this.username
				}).then(res => {
					console.log(res)
					if(res.code == 0){
						this.popShow = true;
					} else {
						this.btnAstrict = false;
						uni.showToast({ title: res.msg,icon: "none" ,duration:2000});
					}
				}).catch(err => {
					this.btnAstrict = false;
					console.log("获取验证码接口数据返回失败 error is :" + err);
				})
			},
			
			// 获取验证码
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
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
			},
			getAuthcode() {
				ajax.get(config.code_url,{
				  phone: this.username,
				  type: 3
				}).then(res => {
					console.log(res)
					this.codeTime = true;
					if(res.code == 0){
						console.log("获取验证码成功");
					} else {
						console.log(res);
					}
				}).catch(err => {
					this.codeTime = true;
					console.log("获取验证码接口数据返回失败 error is :" + err);
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.logoutVerifyBox {
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
			height: 100rpx;
			line-height: 100rpx;
			border-top: 2rpx solid #DDDDDD;
			text-align: center;
			font-size: 32rpx;
			color: #F96F2B;
			position: absolute;
			bottom: 0;
		}
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
				font-weight: 600;
				color: #333333;
			}
		}
	}
</style>
