<template>
	<view class="autContent">
		<u-navbar back-text="" title="司机证件信息">
			<view slot="right" class="slot-wrap" @click="goHall">
				跳过
			</view>
		</u-navbar>
		<form @submit="formSubmit">
			<view class="autCon">
				<view class="autConTit" style="margin-top: 15rpx;">
					上传驾驶证
				</view>
				<view class="autConCon">
					<view class="autConCon1">
						<view class="autConConItem1" @click="addImg" data-img="drivingface" v-if="drivingfaceUrl == ''">点击上传驾驶证主本</view>
						<view class="autConConItem3" @click="addImg" data-img="drivingface" v-else>
							<image class="image" :src="drivingfaceUrl" mode="aspectFit"></image>
						</view>
						<view class="autConConItem2" @click="addImg" data-img="drivingbace" v-if="drivingbaceUrl == ''">点击上传驾驶证副本</view>
						<view class="autConConItem3" @click="addImg" data-img="drivingbace" v-else>
							<image class="image" :src="drivingbaceUrl" mode="aspectFit"></image>
						</view>
					</view>
					<view class="autConCon2" style="border-top: 20rpx solid #F5F6F7; height: 100rpx;">
						<text class="autConCon2Tit">姓名</text>
						<input class="autConCon2Inp" disabled placeholder-class="inpsty" type="text" name="drivingName" v-model="drivingname" placeholder="自动获取姓名">
					</view>
					<view class="autConCon2">
						<text class="autConCon2Tit">驾驶证号</text>
						<input class="autConCon2Inp" disabled placeholder-class="inpsty" type="text" name="drivingId" v-model="drivingid" placeholder="自动获取行驶证号">
					</view>
				</view>
			</view>
			<view class="autCon">
				<view class="autConTit" style="margin-top: 15rpx;">
					上传行驶证
				</view>
				<view class="autConCon">
					<view class="autConCon1">
						<view class="autConConItem4" @click="addImg" data-img="vehicleface" v-if="vehiclefaceUrl == ''">点击上传行驶证主本</view>
						<view class="autConConItem3" @click="addImg" data-img="vehicleface" v-else>
							<image class="image" :src="vehiclefaceUrl" mode="aspectFit"></image>
						</view>
						<view class="autConConItem5" @click="addImg" data-img="vehiclebace" v-if="vehiclebaceUrl == ''">点击上传行驶证副本</view>
						<view class="autConConItem3" @click="addImg" data-img="vehiclebace" v-else>
							<image class="image" :src="vehiclebaceUrl" mode="aspectFit"></image>
						</view>
					</view>
					<view class="autConCon2" style="border-top: 20rpx solid #F5F6F7; height: 100rpx;">
						<text class="autConCon2Tit">所有人</text>
						<input class="autConCon2Inp" disabled placeholder-class="inpsty" type="text" name="vehicleName" v-model="vehiclename" placeholder="自动获取所有人">
					</view>
					<view class="autConCon2">
						<text class="autConCon2Tit">车牌号码</text>
						<input class="autConCon2Inp" disabled placeholder-class="inpsty" type="text" name="vehicleId" v-model="vehicleid" placeholder="自动获取车牌号码">
					</view>
					<view class="autConCon2">
						<text class="autConCon2Tit">车辆类型</text>
						<input class="autConCon2Inp" disabled placeholder-class="inpsty" type="text" name="carType" v-model="cartype" placeholder="自动获取车辆类型">
					</view>
				</view>
			</view>
			<button :disabled="drivingname == '' || drivingid == '' || drivingfaceUrl == '' || drivingbaceUrl == '' || vehiclename == '' || vehicleid == '' || cartype == '' || vehiclefaceUrl == '' || vehiclebaceUrl == ''" style="background: #FFC24D;" class="submitBtn" form-type="submit" :class="{loginButton: drivingname == '' || drivingid == '' || drivingfaceUrl == '' || drivingbaceUrl == '' || vehiclename == '' || vehicleid == '' || cartype == '' || vehiclefaceUrl == '' || vehiclebaceUrl == ''}">提交</button>
		</form>
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" :closeable="true" v-model="popShow" mode="center">
			<view class="hintTit">温馨提示</view>
			<view class="hintCon">错误提示</view>
			<view class="hintBtn" @click="popShow = false">重新输入</view>
		</u-popup>
		<u-modal confirm-text="马上抢单" width="640" v-model="passShow" :show-title="false" :confirm-style="{'background': '#ffffff', 'font-size': '36rpx', 'color': '#F96F2B',}" @confirm="goHall">
			<view class="slot-content">
				<view class="titImg">
					<Icon :iconType="'icontongguo1'" extClass="tongguo1"></Icon>
				</view>
				<view class="title">认证成功</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import config from '../../service/config.js'
	import ajax from '../../service/ajax.js'
	import {pathToBase64} from '@/js_sdk/gsq-image-tools/image-tools/index.js';
	export default {
		data() {
			return {
				// 驾驶证姓名
				drivingname: '',
				// 驾驶证号码
				drivingid: '',
				// 驾驶证主页url
				drivingfaceUrl: '',
				// 驾驶证副页Url
				drivingbaceUrl: '',
				// 行驶证所有人
				vehiclename: '',
				// 车牌号码
				vehicleid: '',
				// 车辆类型
				cartype: '',
				// 行驶证主页url
				vehiclefaceUrl: '',
				// 行驶证副页Url
				vehiclebaceUrl: '',
				// 温馨提示错误
				popShow: false,
				// 认证通过提示
				passShow: false,
			}
		},
		methods: {
			
			// 确认去配货大厅找货
			goHall() {
				uni.navigateTo({
					url: "/pages/allocation/allocation",
				});
			},
			
			// 提交审核
			formSubmit(e){
				ajax.put(config.authentication_url + `/${1}/` + 'authentication',{
					
				}).then(res => {
					console.log(res)
					if(res.code == 0){
						this.passShow = true;
					} else {
						this.popShow = true;
					}
				}).catch(err => {
				  console.log("获取证件认证提交审核接口数据返回失败 error is :" + err);
				})
			},
			
			
			// 行驶证提取
			getVehicle($url,$type) {
				ajax.get(config.drivingLicense_url,{
				  url: $url,
				  type: $type,
				}).then(res => {
					console.log(res)
					if(res.code == 0){
						this.vehiclename = res.data.owner;
						this.vehicleid = res.data.plateNumber;
						this.cartype = res.data.licenseNumber;
						console.log(res.data);
					} else {
						uni.showToast({title:"行驶证信息提取失败,请重新上传",icon: "none",duration:2000})
					}
				}).catch(err => {
					console.log("获取行驶证提取数据返回失败 error is :" + err);
				})
			},
			
			// 驾驶证提取
			getDriving($url,$type) {
				ajax.get(config.driverLicense_url,{
				  url: $url,
				  type: $type,
				}).then(res => {
					console.log(res)
					if(res.code == 0){
						this.drivingname = res.data.name;
						this.drivingid = res.data.licenseNumber;
						console.log(res.data);
					} else {
						uni.showToast({title:"驾驶证信息提取失败,请重新上传",icon: "none",duration:2000})
					}
				}).catch(err => {
				  console.log("获取驾驶证提取数据返回失败 error is :" + err);
				})
			},
			
			// 上传图片
			addImg(e){
				let name = e.currentTarget.dataset.img
				uni.chooseImage({
				    count: 1, // 默认最多一次选择9张图
				    // sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有(如果不设置设置二者都有)
				    success: res=> {
				        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
				        console.log(res.tempFilePaths[0]);
						let url = res.tempFilePaths[0];
						pathToBase64(url).then(base64 => {
							console.log(base64);
							console.log(name);
							if(name == 'drivingface') {
								this.drivingfaceUrl = url;
								this.getDriving(base64,name);
							} else if(name == 'drivingbace') {
								this.drivingbaceUrl = url;
								this.getDriving(base64,name);
							} else if(name == 'vehicleface') {
								this.vehiclefaceUrl = url;
								this.getVehicle(base64,name);
							} else if(name == 'vehiclebace') {
								this.vehiclebaceUrl = url;
								this.getVehicle(base64,name);
							}
						})
						.catch(error => {
							uni.showToast({title:"上传失败,请重新上传",icon: "none",duration:2000})
						})
				    }
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.autContent{
		width: 100%;
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
			}
			.title {
				font-size: 36rpx;
				color: #333333;
			}
		}
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
		.slot-wrap {
			font-size: 24rpx;
			color: #F96F2B;
			margin-right: 30rpx;
		}
		.submitBtn {
			margin-top: 66rpx;
			margin-bottom: 108rpx;
			width: 90%;
			height: 80rpx;
			line-height: 80rpx;
			color: #333333;
		}
		.loginButton {
			background: #DDDDDD !important;
			color: #333333;
		}
		.autCon {
			.autConTit {
				width: 100%;
				height: 90rpx;
				line-height: 90rpx;
				padding-left: 32rpx;
				font-size: 28rpx;
				color: #333333;
				font-weight: 600;
			}
			.autConCon {
				background: #ffffff;
				.autConCon2 {
					border-top: 1rpx solid #eeeeee;
					width: 100%;
					height: 80rpx;
					font-size: 28rpx;
					color: #666666;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.inpsty {
						font-size: 28rpx;
						color: #999999;
					}
					.autConCon2Tit {
						width: 20%;
						margin-left: 30rpx;
						height: 38rpx;
						line-height: 38rpx;
					}
					.autConCon2Inp {
						width: 70%;
						margin-left: 30rpx;
						height: 38rpx;
						line-height: 38rpx;
					}
				}
				.autConCon1 {
					width: 100%;
					height: 244rpx;
					display: flex;
					justify-content: space-evenly;
					align-items: center;
					.autConConItem1 {
						width: 330rpx;
						height: 180rpx;
						border-radius: 8rpx;
						background-image: url(../../static/img11.png);
						background-repeat: no-repeat;
						background-size: 100% 100%;
						background-position: center center;
						text-align: center;
						padding-top: 110rpx;
					}
					.autConConItem2 {
						width: 330rpx;
						height: 180rpx;
						border-radius: 8rpx;
						background-image: url(../../static/img12.png);
						background-repeat: no-repeat;
						background-size: 100% 100%;
						background-position: center center;
						text-align: center;
						padding-top: 110rpx;
					}
					.autConConItem4 {
						width: 330rpx;
						height: 180rpx;
						border-radius: 8rpx;
						background-image: url(../../static/img13.png);
						background-repeat: no-repeat;
						background-size: 100% 100%;
						background-position: center center;
						text-align: center;
						padding-top: 110rpx;
					}
					.autConConItem5 {
						width: 330rpx;
						height: 180rpx;
						border-radius: 8rpx;
						background-image: url(../../static/img14.png);
						background-repeat: no-repeat;
						background-size: 100% 100%;
						background-position: center center;
						text-align: center;
						padding-top: 110rpx;
					}
					.autConConItem3 {
						width: 330rpx;
						height: 180rpx;
						border-radius: 8rpx;
						text-align: center;
						.image {
							max-width: 330rpx;
							max-height: 180rpx;
						}
					}
				}
			}
		}
	}
	
</style>
