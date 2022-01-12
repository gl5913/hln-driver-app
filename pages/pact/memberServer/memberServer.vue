<template>
	<view>
		<u-parse :html="content" :tag-style="style"></u-parse>
	</view>
</template>

<script>
	import config from '../../../service/config.js';
	import ajax from '../../../service/ajax.js';
	
    export default {
        data() {
            return {
                content: '',
				style: {
					// 字符串的形式
					p: 'font-weight: 600; font-size: 26rpx; margin-bottom: 30rpx;',
					i: 'font-weight: 600; font-style: normal;',
					span: 'margin-bottom: 20rpx; display: block;',
					div: 'border-top: 2rpx solid #EFEFEF; padding: 18rpx 26rpx 34rpx;'
				}
            }
        },
		mounted() {
			this.getPact();
		},
		methods:{
			getPact() {
				ajax.get(config.agreement_url,{
					protocolCode: 'HYFWXY',
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						uni.request({
							url: res.data.protocolUrl,
							success: reg => {
								console.log(reg);
								this.content = reg.data;
							}
						})
					} else {
						console.log(res);
					}
				}).catch(err => {
					console.log("获取货灵鸟会员服务协议接口数据返回失败 error is :" + err);
				})
			}
		}
    }
</script>

<style scoped lang="scss">
	
</style>
