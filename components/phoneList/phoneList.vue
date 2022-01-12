<template>
	<view>
		<!-- 选择联系号码 -->
		<u-popup  @close="change" border-radius="40" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" v-model="show" mode="bottom">
			<view class="selectContent">
				<view class="selectContent-item" v-for="(item,index) of phoneLists" :key="index" @click="goRingUp(item.phone)">
					<Icon :iconType="'icontonghua'" extClass="tonghua"></Icon>
					<view class="selectContent-item-text">{{ item.phone }}</view>
				</view>
			</view>
			<view class="selectTitle" @click="show = false">取消</view>
		</u-popup>
	</view>
</template>

<script>
	import moment from 'moment';
	import burying from '../../common/request.js';
	
	export default {
		props: {
			phoneShow: {
				type: Boolean,
				required: true
			},
			// 电话列表
			phoneLists: {
				type: Array,
				required: true
			},
		},
		data() {
			return {
				show: this.phoneShow
			}
		},
		methods: {
			change() {
				this.$emit('change',this.show);
			},
			
			// 打电话联系货主
			goRingUp(phone) {
				uni.makePhoneCall({
				    phoneNumber: phone
				});
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "打电话联系货主",
					// 异常信息
					bugInfo: null,
					// 页面参数
					pageParams: null,
					// 接口名称
					intName: null,
					// 入参
					enterParams: phone,
					// 出参
					outParams: null,
					// 前端编码
					webId: null
				};
				
				let info = {
					operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
					page: "phoneList.vue",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
		}
	}
</script>

<style scoped lang="scss">
	.selectTitle {
		width: 100%;
		height: 102rpx;
		text-align: center;
		line-height: 102rpx;
		border-bottom: 2rpx solid #f5f5f5;
		font-size: 36rpx;
		color: #FB6E2F;
		z-index: 1000;
	}
	.selectContent {
		width: 100%;
		padding-top: 10rpx;
		z-index: 1000;
		.selectContent-item {
			width: 93%;
			height: 102rpx;
			margin: 0 auto;
			padding: 26rpx 20rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			border-bottom: 2rpx solid #f5f5f5;
			.tonghua {
				font-size: 48rpx;
				color: #333333;
			}
			.selectContent-item-text {
				font-size: 36rpx;
				color: #333333;
				margin-left: 20rpx;
			}
		}
	}
</style>
