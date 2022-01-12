<template>
	<view class="logoutVerifyBox">
		<u-navbar title-width="300" back-text="" title="更换手机号"></u-navbar>
		<view class="pop">原手机号验证成功</view>
		<view class="autConCon2">
			<text class="autConCon2Tit">新手机号</text>
			<input class="autConCon2Inp" placeholder="请输入原手机号码" maxlength="11" placeholder-class="inpsty" type="text" name="userName" v-model="username">
		</view>
		<view style="margin-top: 2rpx;" class="autConCon2">
			<text class="autConCon2Tit">验证码</text>
			<input maxlength="6" style="width: 38%;" class="autConCon2Inp" placeholder-class="inpsty" type="number" name="authCode" v-model="authcode">
			<u-verification-code unique-key="page-newPhone" change-text="XS 重新获取" ref="uCode" @change="codeChange"></u-verification-code>
			<view class="authcodes" @tap="getCode">{{ tips }}</view>
		</view>
		<button @click="affirm" :disabled="authcode == '' || username == ''" style="background: #FFC24D;" class="submitBtn" :class="{loginButton: authcode == '' || username == ''}">确认更换</button>
		
		<u-modal confirm-text="返回" width="640" v-model="succeedShow" :show-title="false" :confirm-style="{'border-buttom': '2rpx solid #dddddd', 'font-size': '32rpx', 'color': '#F96F2B',}" @confirm="goLogin">
			<view class="slot-content">
				<view class="titImg">
					<Icon :iconType="'icontongguo1'" extClass="tongguo1"></Icon>
				</view>
				<view class="title">您的手机号更换成功</view>
			</view>
		</u-modal>
		
		<u-modal confirm-text="返回" width="640" v-model="failShow" :show-title="false" :confirm-style="{'border-buttom': '2rpx solid #dddddd', 'font-size': '32rpx', 'color': '#F96F2B',}" @confirm="goPresent">
			<view class="slot-content">
				<view class="titImg">
					<Icon :iconType="'iconshibai1'" extClass="shibai1"></Icon>
				</view>
				<view class="title">您的手机号更换失败</view>
			</view>
		</u-modal>
		
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
				
				succeedShow: false,
				failShow: false,
				
				codeTime: true,
			}
		},
		methods: {
			
			// 回到登录
			goLogin() {
				uni.reLaunch({
					url: "/pages/login/login"
				})
			},
			
			// 回到当前页面
			goPresent() {
				this.failShow = false
			},
			
			// 确认更换
			affirm() {
				let usernameReg = /^[1][0-9]{10}$/;
				let codeReg = /^[0-9]{6}$/;
				if(usernameReg.test(this.username)) {
					if(codeReg.test(this.authcode)) {
						this.affirmPhone();
					} else {
						uni.showToast({ title: "验证码格式错误（格式为6位数字），请重新输入",icon: "none" ,duration:2000});
					}
				} else {
					uni.showToast({ title: "手机号格式错误（格式为11位数字），请重新输入",icon: "none" ,duration:2000});
				}
			},
			
			// 手机号码修改
			affirmPhone() {
				ajax.put(config.phoneVerify_url, {phone: this.username, code: this.authcode, type:2}).then(res => {
					console.log(res);
					if (res.code == 0) {
						this.succeedShow = true;
					} else {
						this.failShow = true;
					}
				}).catch(err => {
					console.log("手机号码修改接口数据返回失败 error is :" + err);
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
					uni.showToast({ title: "手机号格式错误（格式为11位数字），请重新输入",icon: "none" ,duration:2000});
				}
			},
			getAuthcode() {
				ajax.get(config.code_url,{
				  phone: this.username,
				  type: 4
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
		.slot-content {
			height: 300rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
			align-items: center;
			.titImg {
				width: 120rpx;
				height: 111rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				.tongguo1 {
					font-size: 110rpx;
					color: #1bb68a;
				}
				.shibai1 {
					font-size: 110rpx;
					color: #f96f2b;
				}
			}
			.title {
				font-size: 36rpx;
				color: #333333;
			}
		}
		.pop {
			width: 100%;
			height: 124rpx;
			font-size: 32rpx;
			line-height: 124rpx;
			color: #666666;
			text-align: center;
		}
		.submitBtn {
			width: 90%;
			height: 80rpx;
			line-height: 80rpx;
			position: absolute;
			left: 5%;
			bottom: 12%;
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
