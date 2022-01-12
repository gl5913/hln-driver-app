<template>
	<view class="addCarBox">
		<u-navbar title-width="300" back-text="" :title="plateNumber"></u-navbar>
		
		<view class="addCarCont">
			<view class="addCarCont-tit">行驶证照片</view>
			<view class="autConCon1">
				<view class="autConConItem3">
					<image class="image" :src="vehiclefaceUrl" mode="aspectFit"></image>
				</view>
				<view class="autConConItem3">
					<image class="image" :src="vehiclebaceUrl" mode="aspectFit"></image>
				</view>
			</view>
			<u-collapse>
				<u-collapse-item style="border-bottom: 2rpx solid #f5f5f5;">
					<view slot="title" class="titStyle">
						<view class="titStyle-text">车辆类型</view>
						<view>{{ carTypeName }}</view>
					</view>
					<view class="conContent" style="padding: 0 0 40rpx 0;">
						<view 
							@click="carTypeChange(item)" 
							v-for="(item, index) in carTypeList" :key="index" 
							class="carType"
							:class="{ checkCarType: carTypeId == item.id }"
						>
							{{item.name}}
						</view>
					</view>
				</u-collapse-item>
				<u-collapse-item>
					<view slot="title" class="titStyle">
						<view class="titStyle-text">载货长度</view>
						<view>{{ carConductorVal == '' ? carConductorName : carConductorVal}}米</view>
					</view>
					<view class="conContent">
						<view 
							@click="carConductorChange(item)"
							v-for="(item, index) in carConductorList" :key="index"
							class="carType"
							:class="{ checkCarType: carConductorName == item.name }"
							:style="[ carConductorVal != '' ? bgColor : '']"
						>
							{{item.name}}
						</view>
					</view>
					<view class="length" style="margin-bottom: 44rpx;">
						<input class="lengthInp" placeholder-class="inpsty" type="text" v-model="carConductorVal" placeholder="手动输入载货长度">
						<text class="unit">米</text>
					</view>
				</u-collapse-item>
			</u-collapse>
		</view>
		
		<u-modal confirm-text="返回我的车辆" width="640" v-model="succeedShow" :show-title="false" :confirm-style="{'border-buttom': '2rpx solid #dddddd', 'font-size': '32rpx', 'color': '#F96F2B',}" @confirm="goMyCar">
			<view class="slot-content">
				<view class="titImg">
					<Icon :iconType="'icontongguo1'" extClass="tongguo1"></Icon>
				</view>
				<view class="title">车辆修改成功</view>
			</view>
		</u-modal>
		
		<u-modal confirm-text="返回我的车辆" width="640" v-model="failShow" :show-title="false" :confirm-style="{'border-buttom': '2rpx solid #dddddd', 'font-size': '32rpx', 'color': '#F96F2B',}" @confirm="goMyCar">
			<view class="slot-content">
				<view class="titImg">
					<Icon :iconType="'iconshibai1'" extClass="shibai1"></Icon>
				</view>
				<view class="title">车辆修改失败</view>
			</view>
		</u-modal>
		
		<button :disabled="carTypeName == '' || (carConductorVal == '' && carConductorName == '')" style="background: #FFC24D;" class="submitBtn" :class="{loginButton: carTypeName == '' || (carConductorVal == '' && carConductorName == '')}" @click="changeMyCar">确认修改</button>
		
		<!-- 与包裹页面所有内容的元素u-page同级，且在它的下方 -->
		<u-tabbar :before-switch="beforeSwitch" active-color="#FB6E2F" inactive-color="#666666" height="110" :list="list" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import config from '../../service/config.js';
	import ajax from '../../service/ajax.js';
	import {pathToBase64} from '@/js_sdk/gsq-image-tools/image-tools/index.js';
	export default {
		data() {
			return {
				list: this.$store.state.list,
				
				// 行驶证主页url
				vehiclefaceUrl: '',
				// 行驶证副页Url
				vehiclebaceUrl: '',
				
				// 车辆类型列表
				carTypeList: [],
				// 车长列表
				carConductorList: [],
				// 选中的车辆类型ID
				carTypeId: '',
				carTypeName: '',
				// 选中的车长
				carConductorName: '',
				// 输入的车长
				carConductorVal: '',
				
				// 车牌
				plateNumber: '',
				// 车辆Id
				carId: '',
				
				succeedShow: false,
				failShow: false
			}
		},
		onLoad(option) {
			this.carId = option.id;
			this.plateNumber = option.plateNumber;
			
		},
		computed: {
			bgColor() {
				let backgroundImage,color,background;
				backgroundImage = 'none !important';
				background = '#F1F2F6';
				color = '#333333';
				return {
					backgroundImage,
					color,
					background
				}
			}
		},
		mounted() {
			this.getMyCar(this.carId);
			this.getCarConductor();
			this.getCarType();
		},
		methods: {
			beforeSwitch(index) {
				if(index == 0) {
					uni.navigateTo({
						url: "/pages/allocation/allocation"
					})
				} else if(index == 1) {
					uni.navigateTo({
						url: "/pages/message/message"
					})
				} else if(index == 2) {
					uni.navigateTo({
						url: "/pages/order/order"
					})
				} else {
					uni.navigateTo({
						url: "/pages/my/my"
					})
				}
			},
			
			// 车辆修改
			changeMyCar() {
				let carlength;
				if(this.carConductorVal == '') {
					carlength = this.carConductorName;
				} else {
					carlength = this.carConductorVal;
				}
				console.log(this.carId);
				console.log(carlength);
				console.log(this.carTypeId);
				ajax.put(config.driverCar_url + `/${this.carId}`,{
					carConductor: carlength,
					carModelId: this.carTypeId,
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						console.log(res.data);
						this.succeedShow = true;
					} else {
						this.failShow = true;
						console.log("车辆修改接口数据返回失败 error is :" + err);
					}
				}).catch(err => {
					console.log("车辆修改接口数据返回失败 error is :" + err);
				})
			},
			
			// 返回我的车辆
			goMyCar() {
				uni.navigateTo({
					url: "/pages/myCar/myCar"
				})
			},
			
			// 获取修改车辆信息
			getMyCar(id) {
				ajax.get(config.driverCar_url + `/${id}`,{
				}).then(res => {
					if(res.code == 0){
						console.log(res.data);
						this.vehiclefaceUrl = res.data.facePath;
						this.vehiclebaceUrl = res.data.backPath;
						this.carTypeId = res.data.carModelId;
						this.carTypeName = res.data.carModelName;
						let result = this.carConductorList.find(item =>{
							return item.name == res.data.carConductor;
						});
						if(result === undefined) {
							this.carConductorVal = res.data.carConductor;
						} else {
							this.carConductorName = res.data.carConductor;
						}
					} else {
						console.log("获取修改车辆信息接口数据返回失败 error is :" + err);
					}
				}).catch(err => {
					console.log("获取修改车辆信息接口数据返回失败 error is :" + err);
				})
			},
			
			// 选中的车辆类型
			carTypeChange(e) {
				this.carTypeId = e.id;
				this.carTypeName = e.name;
			},
			
			// 选中的车长
			carConductorChange(e) {
				this.carConductorName = e.name;
				this.carConductorVal = '';
			},
			
			// 获取车长列表
			getCarConductor() {
				ajax.get(config.carConductor_url,{
				}).then(res => {
					console.log(res)
					if(res.code == 0){
						console.log(res.data);
						this.carConductorList = res.data;
					} else {
						console.log("获取车长数据返回失败 error is :" + err);
					}
				}).catch(err => {
				  console.log("获取车长数据返回失败 error is :" + err);
				})
			},
			
			// 获取车俩类型列表
			getCarType() {
				ajax.get(config.carModel_url,{
				}).then(res => {
					console.log(res)
					if(res.code == 0){
						console.log(res.data);
						this.carTypeList = res.data;
					} else {
						console.log("获取车俩类型数据返回失败 error is :" + err);
					}
				}).catch(err => {
				  console.log("获取车俩类型数据返回失败 error is :" + err);
				})
			},
			
		}
	}
</script>

<style scoped lang="scss">
	.addCarBox {
		width: 100%;
		height: 100vh;
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
		.addCarCont {
			width: 100%;
			padding: 0 30rpx;
			margin-top: 40rpx;
			background: #ffffff;
			.length {
				margin-top: 24rpx;
				position: relative;
				.inpsty {
					font-size: 28rpx;
					color: #999999;
				}
				.lengthInp {
					height: 64rpx;
					background: #F1F2F6;
					border: 1rpx solid #EBEBEB;
					border-radius: 8rpx;
					padding: 0 20rpx;
				}
				.unit {
					position: absolute;
					top: 7rpx;
					right: 20rpx;
					font-size: 28rpx;
				}
			}
			.conContent {
				width: 100%;
				min-height: 380rpx;
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				align-items: center;
				border-top: 2rpx solid #f5f5f5;
				.carType {
					width: 160rpx !important;
					margin-top: 16rpx;
					height: 60rpx;
					line-height: 60rpx;
					background: #F1F2F6;
					border-radius: 8rpx;
					font-size: 28rpx;
					text-align: center;
					color: #333333;
					margin-right: 16rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
				}
				.carType:nth-of-type(4n){
					margin-right: 0;
				}
				.checkCarType {
					color: #FB6E2F;
					background: url(../../static/img19.png);
					background-position: center center;
					background-repeat: no-repeat;
					background-size: 100% 100%;
				}
			}
			.titStyle {
				width: 90%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.titStyle-text {
					font-size: 28rpx;
					color: #666666;
				}
			}
			.addCarCont-tit {
				width: 100%;
				border-bottom: 2rpx solid #f5f5f5;
				height: 97rpx;
				font-size: 28rpx;
				line-height: 97rpx;
				color: #666666;
			}
			.autConCon1 {
				width: 100%;
				border-bottom: 2rpx solid #f5f5f5;
				height: 244rpx;
				display: flex;
				justify-content: space-evenly;
				align-items: center;
				.autConConItem4 {
					width: 310rpx;
					height: 168rpx;
					border-radius: 8rpx;
					background-image: url(../../static/img13.png);
					background-repeat: no-repeat;
					background-size: 100% 100%;
					background-position: center center;
					text-align: center;
					padding-top: 110rpx;
				}
				.autConConItem5 {
					width: 310rpx;
					height: 168rpx;
					border-radius: 8rpx;
					background-image: url(../../static/img14.png);
					background-repeat: no-repeat;
					background-size: 100% 100%;
					background-position: center center;
					text-align: center;
					padding-top: 110rpx;
				}
				.autConConItem3 {
					width: 310rpx;
					height: 168rpx;
					border-radius: 8rpx;
					text-align: center;
					.image {
						max-width: 330rpx;
						max-height: 180rpx;
					}
				}
			}
		}
		.submitBtn {
			width: 92%;
			height: 80rpx;
			line-height: 80rpx;
			margin-top: 150rpx;
			color: #333333;
		}
		.loginButton {
			background: #DDDDDD !important;
			color: #333333;
		}
	}
</style>

