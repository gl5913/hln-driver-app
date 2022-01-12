<template>
	<view class="networkpage">
		<u-navbar :is-back="false" title-color="#333333" title="货灵鸟司机端" :background="topBackground" :border-bottom="false"></u-navbar>
		<image class="bgImage" src="../../static/bg.png" mode="aspectFit"></image>
		<button @click="refresh" class="refreshBtn" :loading="loading" size="mini" :plain="true">点击刷新</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				urls: '',
				methods: '',
				datas: '',
				headers: '',
				loading: false,
				// 顶部导航的背景
				topBackground: {
					// 渐变色
					backgroundImage: 'linear-gradient(89deg, #FFE14C 0%, #FFC24D 100%)',
				},
			}
		},
		onLoad(option) {
			this.urls = option.url;
			this.methods = option.method;
			if(this.datas) {
				this.datas = JSON.parse(option.data);
			}
			if(this.headers) {
				this.headers = JSON.parse(option.header);
			}
			
			
			
			console.log(this.urls);
			console.log(this.methods);
			console.log(this.datas);
			console.log(this.headers);
		},
		methods: {
			refresh() {
				this.loading = true;
				console.log(this.urls);
				if(this.urls) {
					uni.request({
						url: this.urls,
						method: this.methods,
						data: this.datas || {},
						header: this.headers || {},
						success: res => {
							console.log(res.statusCode);
							if(res.statusCode == '200') {
								this.loading = false;
								uni.navigateBack({
									delta: 1,
								});
							} else {
								this.loading = false;
								uni.showToast({ title: "网络异常请重试",icon: "none" ,duration:2000});
							}
						},
						fail: err => {
							this.loading = false;
							console.log(err);
							uni.showToast({ title: "网络异常请重试",icon: "none" ,duration:2000});
						}
					})
				} else {
					this.loading = false;
					uni.showToast({ title: "请检查网络后重试",icon: "none" ,duration:2000});
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.networkpage {
		width: 100%;
		height: 100vh;
		position: relative;
		.bgImage {
			width: 100%;
			height: 80%;
		}
		.refreshBtn {
			width: 240rpx;
			border: 2rpx solid #FFC24D;
			color: #FFC24D;
			position: absolute;
			left: calc(50% - 120rpx);
			bottom: 320rpx;
		}
	}
</style>
