<template>
	<view class="logoutBox">
		<u-navbar back-text="" title="账户注销"></u-navbar>
		<view class="logoutCon1">
			<view class="logoutTit">
				<Icon :iconType="'iconsanjiao1'" extClass="sanjiao1"></Icon>
				<view style="margin-left: 34rpx;" class="logoutTitCon">
					您即将注销<text class="logoutTitContit">{{ this.userNa }}</text>的货主端账户
				</view>
			</view>
			<view class="logoutCon-content">- 将同步注销该账户所绑定的货灵鸟货主账户。</view>
			<view class="logoutCon-content">- 请确保所有的交易已完结且无纠纷。注销后，您账户内的优惠券
红包 积分 卡券及其他虚拟资产将视为您自动放弃。</view>
		</view>
		<view class="logoutCon1" style="height: 236rpx;">
			<view class="logoutTit">
				<Icon :iconType="'icontanhaoCheng1'" extClass="sanjiao1"></Icon>
				<view style="margin-left: 34rpx;" class="logoutTitCon">
					注销后，以下信息将被清空且无法找回
				</view>
			</view>
			<view class="logoutConCon">
				<view class="logoutConConTit" v-for="(item,index) of msg" :key="index" :class="{logoutConConTits: index == 3 || index == 4}">{{ index + 1 }}、{{ item.name }}</view>
			</view>
		</view>
		<view class="logoutCon2" @click="callUp">
			<view class="logoutTitCon">如有疑问，请拨打客服电话。</view>
			<Icon :iconType="'icontonghua1'" extClass="tonghua1"></Icon>
		</view>
		<view class="logoutCon4" @click="showAgree">
			<view class="logoutAgree" :class="{logoutAgreess: logoutAgree}">
				<view class="logoutAgreeYuan" v-show="logoutAgree"></view>
			</view>
			<view class="logoutAgreeTit">我已阅读并同意<text style="color: #F96F2B;" @click="goPact">《司机平台账户注销须知》</text></view>
		</view>
		<button @click="goPopshow" :disabled="!logoutAgree" style="background: #FFC24D;" class="submitBtn" form-type="submit" :class="{loginButton: !logoutAgree}">下一步</button>
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" :closeable="true" v-model="popShow" mode="center">
			<view class="hintTit">温馨提示</view>
			<view class="hintCon">请确认账户注销，一旦确认无法恢复</view>
			<view class="hintBtn">
				<view style="width: 50%;" @click="goLogoutVerify">确认注销</view>
				<view class="hintBtnShu"></view>
				<view style="color: #333333; width: 50%;" @click="popShow = false">暂不注销</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import moment from 'moment';
	import burying from '../../common/request.js';
	
	export default {
		onLoad(options) {
			console.log(options);
			this.userNa = options.phone.substr(0,3)+'****'+options.phone.substr(7);
			this.username = options.phone;
		},
		data() {
			return {
				barheight: this.statusBar,
				// 登录名
				username: '',
				// 变星登录名
				userNa: '',
				// 是否同意
				logoutAgree: false,
				// 温馨提示
				popShow: false,
				msg: [
					{name:"身份信息"},
					{name:"账户信息"},
					{name:"交易记录"},
					{name:"会员及权益信息"},
					{name:"虚拟资产信息"}
				],
			}
		},
		methods: {
			// 联系客服
			callUp() {
				uni.makePhoneCall({
				    phoneNumber: '0571-82814588'
				});
			},
			
			// 跳转到协议
			goPact() {
				uni.navigateTo({
					url: "/pages/pact/cancellationNotice/cancellationNotice",
				});
			},
			
			// 点击同意或不同意
			showAgree() {
				this.logoutAgree = !this.logoutAgree;
			},
			// 温馨提示
			goPopshow() {
				this.popShow = true;
			},
			// 跳转到确认注销
			goLogoutVerify() {
				this.popShow = false;
				uni.navigateTo({
					url: "/pages/logoutVerify/logoutVerify?phone=" + this.username,
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.logoutBox {
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
		.logoutCon1 {
			width: 100%;
			height: 248rpx;
			margin-top: 24rpx;
			background-color: #ffffff;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			.logoutConCon {
				width: 90%;
				height: 100rpx;
				padding: 0 20rpx;
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-items: center;
				.logoutConConTit {
					text-align: left;
					width: 33%;
					height: 46rpx;
					line-height: 46rpx;
					font-size: 24rpx;
					color: #666666;
				}
				.logoutConConTits {
					width: 40%;
				}
			}
			.logoutTit {
				width: 90%;
				height: 72rpx;
				background: rgba(254, 194, 77, 0.2);
				border-radius: 8rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.sanjiao1 {
					font-size: 40rpx;
					margin-left: 30rpx;
					color: #f96f2b;
				}
				.logoutTitCon {
					font-size: 28rpx;
					color: #333333;
					.logoutTitContit {
						color: #F96F2B;
						margin: 0 10rpx;
						font-weight: 600;
					}
				}
			}
			.logoutCon-content {
				width: 90%;
				font-size: 24rpx;
				color: #666666;
				text-align: left;
				line-height: 30rpx;
			}
		}
		.logoutCon2 {
			width: 100%;
			margin-top: 24rpx;
			background-color: #ffffff;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80rpx;
			padding: 0 30rpx;
			.tonghua1 {
				color: #F96F2B;
				font-size: 48rpx;
			}
		}
		.logoutCon4 {
			width: 100%;
			margin-top: 24rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.logoutAgree {
				margin-left: 30rpx;
				width: 36rpx;
				height: 36rpx;
				border: 2rpx solid #999999;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				.logoutAgreeYuan {
					width: 20rpx;
					height: 20rpx;
					background: #F96F2B;
					border-radius: 50%;
				}
			}
			.logoutAgreess {
				border: 2rpx solid #F96F2B;
			}
			.logoutAgreeTit {
				margin-left: 16rpx;
				font-size: 24rpx;
				color: #999999;
			}
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
	}
</style>
