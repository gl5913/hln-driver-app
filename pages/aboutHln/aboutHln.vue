<template>
	<view class="aboutHln">
		<u-navbar title-width="300" back-text="" title="关于我们"></u-navbar>
		<view class="aboutHln-version">
			<image class="aboutHln-version-img" src="../../static/logo.png" mode="aspectFit"></image>
			<view class="aboutHln-version-text">
				<text class="aboutHln-version-text1">货灵鸟</text>
				<text class="aboutHln-version-text2">Ver {{ currentVersion || '1.0.0' }}</text>
			</view>
		</view>
		<view class="aboutHln-content">
			<u-cell-group class="aboutHln-content-group">
				<u-cell-item :border-top="false" class="aboutHln-content-group-item" title="隐私政策" @click="goAgreement(0)"></u-cell-item>
				<u-cell-item :border-bottom="false" class="aboutHln-content-group-item" title="注册协议" @click="goAgreement(1)"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentVersion: '',
			}
		},
		onLoad() {

		},
		onShow() {
			// #ifdef APP-PLUS
			this.currentVersion = plus.runtime.version;
			// #endif
		},
		onUnload() {
			
		},
		methods: {
			/**
			* 跳转协议
			* @Description 跳转协议
			* @Param 
			* index 下标
			* @Return
			**/
			goAgreement(index) {
				if(index == 0) {
					uni.navigateTo({
						url: "/pages/pact/privacyPolicy/privacyPolicy",
					})
				} else if(index == 1) {
					uni.navigateTo({
						url: "/pages/pact/userServer/userServer",
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
.aboutHln {
	.aboutHln-version {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 50rpx 0;
		.aboutHln-version-img {
			width: 150rpx;
			height: 150rpx;
		}
		.aboutHln-version-text {
			margin-top: 15rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.aboutHln-version-text1 {
				height: 35rpx;
				line-height: 35rpx;
				color: #333333;
				font-size: 28rpx;
				font-weight: bold;
			}
			.aboutHln-version-text2 {
				height: 35rpx;
				line-height: 35rpx;
				color: #666666;
				font-size: 20rpx;
			}
		}
	}
	.aboutHln-content {
		width: 92%;
		margin: auto auto 40rpx auto;
		background: #FFFFFF;
		border-radius: 20rpx;
		.aboutHln-content-group {
			border-radius: 20rpx; 
			position: relative;
			.aboutHln-content-group-item {
				padding: 18rpx 24rpx;
			}
		}
	}
}
</style>
