<template>
	<view class="autContent">
		<u-navbar back-text="" title="认证信息">
			<view slot="right" class="slot-wrap" @click="goHall">
				跳过
			</view>
		</u-navbar>
		<view class="topHint">
			只有通过身份认证及车辆信息绑定，才能进行货运下单
		</view>
		<form @submit="formSubmit">
			<view class="autCon">
				<view class="autConTit">
					本人信息
				</view>
				<view class="autConCon">
					<view class="autConCon1">
						<view class="autConConItem1" @click="addImg" data-img="face" v-if="faceUrl == ''">点击上传身份证正面</view>
						<view class="autConConItem3" @click="addImg" data-img="face" v-else>
							<image class="image" :src="faceUrl" mode="aspectFit"></image>
						</view>
						<view class="autConConItem2" @click="addImg" data-img="back" v-if="baceUrl == ''">点击上传身份证反面</view>
						<view class="autConConItem3" @click="addImg" data-img="back" v-else>
							<image class="image" :src="baceUrl" mode="aspectFit"></image>
						</view>
					</view>
					<view class="autConCon2">
						<text class="autConCon2Tit">姓名</text>
						<input class="autConCon2Inp" disabled placeholder-class="inpsty" type="text" name="userName" v-model="username" placeholder="自动获取身份证上姓名">
					</view>
					<view class="autConCon2">
						<text class="autConCon2Tit">身份证</text>
						<input class="autConCon2Inp" disabled placeholder-class="inpsty" type="text" name="userId" v-model="userid" placeholder="自动获取身份证号码">
					</view>
					<view class="autConCon2" @click="addFace" data-img="faceRecognition">
						<text class="autConCon2Tit">人脸识别</text>
						<input style="width: 62%;" class="autConCon2Inp" disabled placeholder-class="inpsty" type="text" name="faceSuccess" v-model="facesuccess" placeholder="请进行人脸识别认证">
						<Icon :iconType="'iconfanhuiYou1'" extClass="fanhuiYou1"></Icon>
					</view>
				</view>
			</view>
			<view class="autCon" style="margin-top: 30rpx;">
				<view class="autConTit">
					车辆信息
				</view>
				<view class="autConCon">
					<view style="border-top: 0;" class="autConCon2" @click="carConductorShow = true">
						<text class="autConCon2Tit">车长车型</text>
						<input style="width: 62%;" class="autConCon2Inp" disabled placeholder-class="inpsty" type="text" name="vehicleType" v-model="vehicletype" placeholder="请选择车长车型">
						<Icon :iconType="'iconfanhuiYou1'" extClass="fanhuiYou1"></Icon>
					</view>
					<view class="autConCon2" @click="transportProShow = true">
						<text class="autConCon2Tit">运输性质</text>
						<input style="width: 62%;" class="autConCon2Inp" disabled placeholder-class="inpsty" type="text" name="transportPro" v-model="transportpro" placeholder="请选择您的运输性质">
						<Icon :iconType="'iconfanhuiYou1'" extClass="fanhuiYou1"></Icon>
					</view>
				</view>
			</view>
			<button :disabled="username == '' || userid == '' || facesuccess == '' || vehicletype == '' || transportpro == '' || faceUrl == '' || baceUrl == ''" style="background: #FFC24D;" class="submitBtn" form-type="submit" :class="{loginButton: username == '' || userid == '' || facesuccess == '' || vehicletype == '' || transportpro == '' || faceUrl == '' || baceUrl == ''}">提交审核</button>
		</form>
		<u-popup border-radius="40" v-model="carConductorShow" mode="bottom" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}">
			<view class="carConTit">
				<view class="carConTitBtn" @click="carConductorShow = false">取消</view>
				<view class="carConTitCon">车型车长</view>
				<view class="carConTitBtn" style="background: #FEC24D;" @click="carAffirm(1)">确认</view>
			</view>
			<view class="content">
				<view class="title">车辆类型</view>
				<view  class="conContent">
					<view 
						@click="carTypeChange(item)" 
						v-for="(item, index) in carTypeList" :key="index" 
						class="carType"
						:class="{ checkCarType: carTypeId == item.id }"
					>
						{{item.name}}
					</view>
				</view>
			</view>
			<view class="content">
				<view class="contentCon">
					<view class="title">载货长度（米）</view>
					<view class="titRight">车辆可载部分长度</view>
				</view>
				<view class="conContent">
					<view 
						@click="carConductorChange(item)"
						v-for="(item, index) in carConductorList" :key="index"
						class="carType"
						:class="{ checkCarType: carConductorName == item.name , }"
						:style="[ carConductorVal != '' ? bgColor : '']"
					>
						{{item.name}}
					</view>
				</view>
				<view class="length" style="margin-bottom: 44rpx;">
					<input class="lengthInp" maxlength="11" placeholder-class="inpsty" type="number" v-model="carConductorVal" placeholder="手动输入载货长度">
					<text class="unit">米</text>
				</view>
			</view>
		</u-popup>
		<u-popup border-radius="40" v-model="transportProShow" mode="bottom" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}">
			<view class="carConTit">
				<view class="carConTitBtn" @click="transportProShow = false">取消</view>
				<view class="carConTitCon">运输性质</view>
				<view class="carConTitBtn" style="background: #FEC24D;" @click="carAffirm(2)">确认</view>
			</view>
			<view class="content" style="margin-bottom: 44rpx;">
				<view  class="conContent">
					<view 
						@click="transportProChange(item)" 
						v-for="(item, index) in transportNatureList" :key="index" 
						class="carType"
						:class="{ checkCarType: transportProName == item.name }"
					>
						{{item.name}}
					</view>
				</view>
			</view>
		</u-popup>
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" :closeable="true" v-model="popShow" mode="center">
			<view class="hintTit">温馨提示</view>
			<view class="hintCon">错误提示</view>
			<view class="hintBtn" @click="popShow = false">重新输入</view>
		</u-popup>
		<u-modal cancel-text="补全详细信息" confirm-text="去找货" width="640" :show-cancel-button="true" v-model="passShow" :show-title="false" :confirm-style="{'background': '#FEC24D', 'font-size': '36rpx', 'color': '#333333',}" :cancel-style="{'color': '#F96F2B', 'font-size': '32rpx',}" @confirm="goHall" @cancel="goAttDriving">
			<view class="slot-content">
				<view class="titImg">
					<Icon :iconType="'icontongguo1'" extClass="tongguo1"></Icon>
				</view>
				<view class="title">您的身份认证已通过</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import config from '../../service/config.js';
	import ajax from '../../service/ajax.js';
	import {pathToBase64} from '@/js_sdk/gsq-image-tools/image-tools/index.js';
	export default {
		data() {
			return {
				// 身份证姓名
				username: '',
				// 身份证号码
				userid: '',
				// 人脸识别是否成功
				facesuccess: '',
				// 车长车型
				vehicletype: '',
				// 运输性质
				transportpro: '',
				// 身份证正面url
				faceUrl: '',
				// 身份证反面Url
				baceUrl: '',
				// 人脸url
				faceReUrl: '',
				// 温馨提示错误
				popShow: false,
				// 认证通过提示
				passShow: false,
				// 车型车长显示
				carConductorShow: false,
				// 运输性质显示
				transportProShow: false,
				// 车辆类型列表
				carTypeList: [],
				// 车长列表
				carConductorList: [],
				// 运输性质列表
				transportNatureList: [],
				// 选中的车辆类型
				carTypeName: '',
				// 选中的车辆类型ID
				carTypeId: '',
				// 选中的车长
				carConductorName: '',
				// 选中的运输性质
				transportProName: '',
				// 输入的车长
				carConductorVal: '',
			}
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
			this.getCarType();
			this.getCarConductor();
			this.getTransportNature();
		},
		methods: {
			// 获取运输性质
			getTransportNature() {
				ajax.get(config.transportNature_url,{
				}).then(res => {
					console.log(res)
					if(res.code == 0){
						this.transportNatureList = res.data;
					} else {
						console.log("获取运输性质数据返回失败 error is :" + err);
					}
				}).catch(err => {
				  console.log("获取运输性质数据返回失败 error is :" + err);
				})
			},
			
			// 获取车长列表
			getCarConductor() {
				ajax.get(config.carConductor_url,{
				}).then(res => {
					console.log(res)
					if(res.code == 0){
						// console.log(res.data);
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
						// console.log(res.data);
						this.carTypeList = res.data;
					} else {
						console.log("获取车俩类型数据返回失败 error is :" + err);
					}
				}).catch(err => {
				  console.log("获取车俩类型数据返回失败 error is :" + err);
				})
			},
			
			// 车型车长及运输性质确认
			carAffirm(e) {
				if(e == 1) {
					if(this.carConductorVal != '') {
						this.carConductorName = '';
						this.carConductorShow = false;
						this.vehicletype = `${this.carConductorVal}米-${this.carTypeName}`;
					} else {
						this.carConductorShow = false;
						this.vehicletype = `${this.carConductorName}米-${this.carTypeName}`;
					}
				} else if(e == 2) {
					this.transportProShow = false;
					this.transportpro = this.transportProName;
				}
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
			
			// 选中的运输性质
			transportProChange(e) {
				this.transportProName = e.name;
			},
			
			// 确认去配货大厅找货
			goHall() {
				console.log(1);
				uni.navigateTo({
					url: "/pages/allocation/allocation",
				});
			},
			
			
			// 取消去补全认证信息
			goAttDriving() {
				uni.navigateTo({
					url: "/pages/attDriving/attDriving",
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
				  console.log("获取用户提交审核接口数据返回失败 error is :" + err);
				})
			},
			
			
			// 身份证提取
			getIdentity($url,$type) {
				ajax.post(config.cardAuthentication_url,{
				  url: $url,
				  type: $type,
				}).then(res => {
					console.log(res)
					if(res.code == 0){
						this.username = res.data.name;
						this.userid = res.data.idNumber;
						console.log(res.data);
					} else {
						uni.showToast({title:"信息提取失败,请重新上传",icon: "none",duration:2000})
					}
				}).catch(err => {
				  console.log("获取身份证提取数据返回失败 error is :" + err);
				})
			},
			
			// 用户活体检测
			getBiop($url1,$url2) {
				ajax.get(config.biopsyAuthentication_url,{
				  url: $url1,
				}).then(res => {
					console.log(res)
					if(res.code == 0){
						console.log(res.data);
						if(res.data.confidence > 60) {
							this.getFace($url1,$url2);
						} else {
							uni.showToast({title:"人脸认证失败,请重新认证",icon: "none",duration:2000});
						}
					} else {
						uni.showToast({title:"人脸认证失败,请重新认证",icon: "none",duration:2000});
					}
				}).catch(err => {
				  console.log("获取用户活体检测数据返回失败 error is :" + err);
				})
			},
			
			// 人证对比
			getFace($url1,$url2) {
				ajax.get(config.faceAuthentication_url,{
				  url1: $url1,
				  url2: $url2,
				}).then(res => {
					console.log(res)
					if(res.code == 0){
						console.log(res.data);
						if(res.data.confidence > 60) {
							uni.showToast({title:"人脸认证成功",icon: "none",duration:2000});
							this.facesuccess = '人脸认证成功';
						} else {
							uni.showToast({title:"人脸认证失败,请重新认证",icon: "none",duration:2000});
						}
					} else {
						uni.showToast({title:"人脸认证失败,请重新认证",icon: "none",duration:2000});
					}
				}).catch(err => {
				  console.log("获取人证对比数据返回失败 error is :" + err);
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
							if(name == 'face') {
								this.faceUrl = url;
								this.getIdentity(base64,name);
							} else {
								this.baceUrl = url;
								this.getIdentity(base64,name);
							}
						})
						.catch(error => {
							uni.showToast({title:"上传失败,请重新上传",icon: "none",duration:2000})
						})
				    }
				})
			},
			
			// 上传人脸
			addFace(e){
				let name = e.currentTarget.dataset.img
				// console.log("上传")
				console.log(name);
				uni.chooseImage({
				    count: 1, // 默认最多一次选择9张图
				    sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有(如果不设置设置二者都有)
				    success: res=> {
				        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
				        var tempFilePaths = res.tempFilePaths;
				        //支持多图上传
				        for (var i = 0; i < res.tempFilePaths.length; i++) {
							//显示消息提示框
							uni.showLoading({
							  mask: true
							})
				            //上传图片
				            //图片路径可自行修改
							uploadImage(
								res.tempFilePaths[i],
								'images/',
								res => {
									// console.log(result)
									if(res.code == 0){
										this.faceReUrl = res.data;
										this.getBiop(this.faceReUrl,this.faceUrl);
									}else if(res.code == -1){
										uni.showToast({title:"人脸认证失败,请重新认证",icon: "none",duration:2000});
									}
									uni.hideLoading();
								}
				            )
				        }
				    }
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.autContent{
		width: 100%;
		.content {
			margin-top: 34rpx;
			width: 100%;
			padding: 0 30rpx;
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
			.contentCon {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.title {
					font-size: 32rpx;
					font-weight: 600;
					color: #333333;
				}
				.titRight {
					font-size: 24rpx;
					color: #999999;
				}
			}
			.title {
				font-size: 32rpx;
				font-weight: 600;
				color: #333333;
			}
			.conContent {
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				align-items: center;
				.carType {
					width: 160rpx !important;
					margin-top: 16rpx;
					height: 60rpx;
					line-height: 60rpx;
					background: #F1F2F6;
					border-radius: 8rpx;
					font-size: 32rpx;
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
		}
		.carConTit {
			width: 100%;
			height: 90rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 30rpx;
			border-bottom: 1px solid #DDDDDD;
			.carConTitBtn {
				width: 100rpx;
				height: 44rpx;
				background: #CCCCCC;
				border-radius: 40rpx;
				font-size: 24rpx;
				line-height: 44rpx;
				color: #333333;
				text-align: center;
			}
			.carConTitCon {
				font-size: 32rpx;
				font-weight: 600;
				color: #F96F2B;
			}
		}
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
			width: 90%;
			position: absolute;
			left: 5%;
			bottom: 4%;
			color: #333333;
		}
		.loginButton {
			background: #DDDDDD !important;
			color: #333333;
		}
		.topHint {
			margin-top: 8rpx;
			width: 100%;
			height: 60rpx;
			line-height: 60rpx;
			background: rgba(249, 111, 43, 0.2);
			text-align: center;
			font-size: 24rpx;
			color: #F96F2B;
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
					.fanhuiYou1 {
						margin-right: 20rpx;
						font-size: 25rpx;
						color: #999999;
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
						background-image: url(../../static/img07.png);
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
						background-image: url(../../static/img08.png);
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
