<template>
	<view class="authBox">
		<u-navbar :is-back="authState != 2" back-text="" title="实名认证">
			<view v-if="authState == 2" slot="right" class="slot-wrap" @click="goHall">
				跳过
			</view>
		</u-navbar>
		<view class="topHint" v-if="authState != 1" :style="{top: `${barheight}px`}">
			只有通过实名认证，才能进行货运下单
		</view>
		<view class="authContss">
			<view class="authCont" style="border-radius: 20rpx 20rpx 0 0;">
				<view class="authCont-tit">身份证照片</view>
				<view class="autConCon1" v-if="authState != 1">
					<view class="autConConItem1" @click="addImg" data-img="1" v-if="faceUrl == ''">点击上传身份证正面</view>
					<view class="autConConItem3" @click="addImg" data-img="1" v-else>
						<image class="image" :src="faceUrl" mode="aspectFit"></image>
					</view>
					<view class="autConConItem2" @click="addImg" data-img="2" v-if="baceUrl == ''">点击上传身份证反面</view>
					<view class="autConConItem3" @click="addImg" data-img="2" v-else>
						<image class="image" :src="baceUrl" mode="aspectFit"></image>
					</view>
				</view>
				<view class="autConCon1" v-else>
					<view class="autConConItem3" @click="imgMagnify(0)">
						<image class="image" :src="idCardFacePath" mode="aspectFit"></image>
					</view>
					<view class="autConConItem3" @click="imgMagnify(1)">
						<image class="image" :src="idCardFaceBack" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			<view class="autConCon2" v-if="authState != 1" style="border-bottom: 2rpx solid #f5f5f5;">
				<view class="autConCon2Tit">身份证姓名</view>
				<input style="width: 62%;" class="autConCon2Inp" disabled placeholder-class="inpsty" disabled placeholder="自动获取身份证姓名" type="text" v-model="idName" />
				<view style="width: 10rpx; height: 18rpx;"></view>
			</view>
			<view class="autConCon2" v-if="authState != 1" style="border-bottom: 2rpx solid #f5f5f5;">
				<view class="autConCon2Tit">身份证号</view>
				<input style="width: 62%;" class="autConCon2Inp" disabled placeholder-class="inpsty" disabled placeholder="自动获取身份证号码" type="text" v-model="idNumber" />
				<view style="width: 10rpx; height: 18rpx;"></view>
			</view>
			<view v-if="authState != 1" class="authCont-mid" @click="humanFaceAdd" data-img="humanFace">
				<view class="authCont-tit">人脸识别</view>
				<view class="authCont-mid-right">
					<Icon :iconType="'iconrenlianshibie'" extClass="renlianshibie" v-if="faceState == -1"></Icon>
					<view class="faceStates" v-if="faceState == 1">人脸识别成功</view>
					<view class="faceStates" v-if="faceState == 0">人脸识别失败，请重新识别</view>
					<Icon :iconType="'iconfanhuiYou1'" extClass="fanhuiYou1"></Icon>
				</view>
			</view>
			<view v-else class="authCont-mid" data-img="humanFace">
				<view class="authCont-tit">人脸识别</view>
				<view class="authCont-mid-right">
					<view class="faceStates">人脸识别成功</view>
				</view>
			</view>
			<view class="authCont" :style="[authState == 1 ? brad : '']">
				<view class="authCont-tit">驾驶证照片</view>
				<view class="autConCon1" v-if="authState != 1">
					<view class="autConConItem4" @click="addImg" data-img="3" v-if="vehiclefaceUrl == ''">点击上传驾驶证正本</view>
					<view class="autConConItem3" @click="addImg" data-img="3" v-else>
						<image class="image" :src="vehiclefaceUrl" mode="aspectFit"></image>
					</view>
					<view class="autConConItem5" @click="addImg" data-img="4" v-if="vehiclebaceUrl == ''">点击上传驾驶证副本</view>
					<view class="autConConItem3" @click="addImg" data-img="4" v-else>
						<image class="image" :src="vehiclebaceUrl" mode="aspectFit"></image>
					</view>
				</view>
				<view class="autConCon1" v-else>
					<view class="autConConItem3" @click="imgMagnify(2)">
						<image class="image" :src="driverLicenseFacePath" mode="aspectFit"></image>
					</view>
					<view class="autConConItem3" @click="imgMagnify(3)">
						<image class="image" :src="driverLicenseBackPath" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			<view class="autConCon2" v-if="authState != 1" style="border-bottom: 2rpx solid #f5f5f5;">
				<view class="autConCon2Tit">驾驶证姓名</view>
				<input style="width: 62%;" class="autConCon2Inp" disabled placeholder-class="inpsty" disabled placeholder="自动获取驾驶证姓名" type="text" v-model="drivingName" />
				<view style="width: 10rpx; height: 18rpx;"></view>
			</view>
			<view class="autConCon2" v-if="authState != 1" style="border-bottom: 2rpx solid #f5f5f5;">
				<view class="autConCon2Tit">驾驶证号</view>
				<input style="width: 62%;" class="autConCon2Inp" disabled placeholder-class="inpsty" disabled placeholder="自动获取驾驶证号码" type="text" v-model="drivingNumber" />
				<view style="width: 10rpx; height: 18rpx;"></view>
			</view>
			<view v-if="authState != 1" style="border-radius: 0 0 20rpx 20rpx;" class="autConCon2" @click="transportProShow = true">
				<text class="autConCon2Tit">运输性质</text>
				<input style="width: 62%;" class="autConCon2Inp" disabled placeholder-class="inpsty" type="text" name="transportProName" v-model="transportProName" placeholder="请选择您的运输性质">
				<Icon :iconType="'iconfanhuiYou1'" extClass="fanhuiYou1"></Icon>
			</view>
		</view>
		<view class="personalBot">
			<view class="personalBot-yuan"></view>
			<view class="personalBot-text">一旦认证成功，将无法修改认证信息，请仔细核对再提交审核</view>
		</view>
		
		<u-popup border-radius="40" v-model="transportProShow" mode="bottom" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}">
			<view class="carConTit">
				<view class="carConTitBtn" @click="transportProShow = false">取消</view>
				<view class="carConTitCon">运输性质</view>
				<view class="carConTitBtn" style="background: #FEC24D;" @click="carAffirm">确认</view>
			</view>
			<view class="content" style="margin-bottom: 44rpx;">
				<view  class="conContent">
					<view 
						@click="transportProChange(item)" 
						v-for="(item, index) in transportNatureList" :key="index" 
						class="carType"
						:class="{ checkCarType: transportproObj.name == item.name }"
					>
						{{item.name}}
						<view class="fangkuai" v-if="transportproObj.name == item.name">
							<Icon :iconType="'iconduigouCheng'" extClass="duigouChengss"></Icon>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" :closeable="true" v-model="popShow" mode="center">
			<view class="hintTit">温馨提示</view>
			<view class="hintCon">人脸识别前，请先上传身份证</view>
			<view class="hintBtn" @click="popShow = false">返回</view>
		</u-popup>
		
		<u-modal confirm-text="返回" :mask-close-able="false" width="640" v-model="succeedShow" :show-title="false" :confirm-style="{'border-buttom': '2rpx solid #dddddd', 'font-size': '32rpx', 'color': '#F96F2B',}" @confirm="goMyMessage">
			<view class="slot-content">
				<view class="titImg">
					<Icon :iconType="'icontongguo1'" extClass="tongguo1"></Icon>
				</view>
				<view class="title">实名认证成功</view>
			</view>
		</u-modal>
		
		<u-modal confirm-text="返回" width="640" v-model="failShow" :show-title="false" :confirm-style="{'border-buttom': '2rpx solid #dddddd', 'font-size': '32rpx', 'color': '#F96F2B',}" @confirm="goBack">
			<view class="slot-content">
				<view class="titImg">
					<Icon :iconType="'iconshibai1'" extClass="shibai1"></Icon>
				</view>
				<view class="title">{{ failText }}</view>
			</view>
		</u-modal>
		
		<view class="Buttonss">
			<button v-if="authState != 1" :disabled="faceUrl == '' || baceUrl == '' || vehiclefaceUrl == '' || vehiclebaceUrl == '' || transportproId == '' || faceState != 1 || btnAstrict" style="background: #FFC24D;" class="submitBtn" :class="{loginButton: faceUrl == '' || baceUrl == '' || vehiclefaceUrl == '' || vehiclebaceUrl == '' || transportproId == '' || faceState != 1 || btnAstrict}" @click="realAuth">{{ authState == 2 ? '下一步' : '提交审核' }}</button>
		</view>
		<helang-compress ref="helangCompress"></helang-compress>
		<swiperImage :maskShow="imgShow" v-if="imgShow" @change="imghide" :swiperImages="swiperImages" :currentIndex="currentIndex"></swiperImage>
	</view>
</template>

<script>
	import config from '../../service/config.js';
	import ajax from '../../service/ajax.js';
	import {pathToBase64} from '@/js_sdk/gsq-image-tools/image-tools/index.js';
	import helangCompress from '../../components/helang-compress/helang-compress';
	import moment from 'moment';
	import burying from '../../common/request.js';
	
	const permissionUtils = require('../../utils/permissionUtils.js')
	const txOCR = uni.requireNativePlugin('liyahong-TXOCR')
	export default {
		data() {
			return {
				barheight: this.statusBar,
				// 图片放大
				imgShow: false,
				currentIndex: 0,
				swiperImages: [],
				
				brad: {borderRadius: '0 0 20rpx 20rpx'},
				
				// 身份证姓名
				idName: '',
				// 身份证号
				idNumber: '',
				// 驾驶证姓名
				drivingName: '',
				// 驾驶证号
				drivingNumber: '',
				
				// 认证状态
				faceState: -1,
				
				// 身份证主页url
				faceUrl: '',
				// 身份证副页Url
				baceUrl: '',
				
				// 驾驶证主页url
				vehiclefaceUrl: '',
				// 驾驶证副页Url
				vehiclebaceUrl: '',
				
				// 运输性质
				transportproObj: '',
				// 选中的运输性质
				transportProName: '',
				// 运输性质ID
				transportproId: '',
				// 运输性质列表
				transportNatureList: [],
				// 运输性质显示
				transportProShow: false,
				
				// 身份证正面照
				idCardFacePath: '',
				// 身份证反面照
				idCardFaceBack: '',
				// 驾驶证正面照
				driverLicenseFacePath: '',
				// 驾驶证反面照
				driverLicenseBackPath: '',
				
				authState: null,
				
				succeedShow: false,
				failShow: false,
				failText: '认证失败，请重新上传相关证件',
				popShow: false,
				// 按钮点击限制
				btnAstrict: false
			}
		},
		onLoad(option) {
			this.authState = option.authState;
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "实名认证页面加载",
				// 异常信息
				bugInfo: null,
				// 页面参数
				pageParams: option,
				// 接口名称
				intName: null,
				// 入参
				enterParams: null,
				// 出参
				outParams: null,
				// 前端编码
				webId: null
			};
			
			let info = {
				operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
				page: "123",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onShow() {
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "实名认证页面显示",
				// 异常信息
				bugInfo: null,
				// 页面参数
				pageParams: null,
				// 接口名称
				intName: null,
				// 入参
				enterParams: null,
				// 出参
				outParams: null,
				// 前端编码
				webId: null
			};
			
			let info = {
				operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
				page: "123",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onUnload() {
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "实名认证页面卸载",
				// 异常信息
				bugInfo: null,
				// 页面参数
				pageParams: null,
				// 接口名称
				intName: null,
				// 入参
				enterParams: null,
				// 出参
				outParams: null,
				// 前端编码
				webId: null
			};
			
			let info = {
				operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
				page: "123",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		mounted() {
			this.getTransportNature();
			this.getMyMessage();
		},
		methods: {
			
			// 图片放大
			imgMagnify(index) {
				this.imgShow = true;
				this.currentIndex = index;
			},
			
			imghide(e) {
				this.imgShow = e;
			},
			
			// 获取我的信息
			getMyMessage() {
				if(this.authState == 1) {
					
					uni.getStorage({
						key: 'username',
						success: reg => {
							ajax.get(config.userMess_url,{
								type: 2,
							}).then(res => {
								console.log(res);
								if(res.code == 0){
									// 身份证正面照
									this.idCardFacePath = res.data.idCardFacePath;
									// 身份证反面照
									this.idCardFaceBack = res.data.idCardFaceBack;
									// 驾驶证正面照
									this.driverLicenseFacePath = res.data.driverLicenseFacePath;
									// 驾驶证反面照
									this.driverLicenseBackPath = res.data.driverLicenseBackPath;
									
									// 图片集合
									if(this.idCardFacePath) {
										this.swiperImages.push(this.idCardFacePath)
									}
									if(this.idCardFaceBack) {
										this.swiperImages.push(this.idCardFaceBack)
									}
									if(this.driverLicenseFacePath) {
										this.swiperImages.push(this.driverLicenseFacePath)
									}
									if(this.driverLicenseBackPath) {
										this.swiperImages.push(this.driverLicenseBackPath)
									}
								} else {
									console.log(res);
									
									let content = {
										// 动作
										action: "click",
										// 节点
										node: "获取我的信息",
										// 异常信息
										bugInfo: res.msg,
										// 页面参数
										pageParams: null,
										// 接口名称
										intName: "获取我的信息(face-user/info)",
										// 入参
										enterParams: {
											type: 2,
										},
										// 出参
										outParams: res,
										// 前端编码
										webId: null
									};
									
									let info = {
										operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
										page: "123",
										type: 2,
										content: JSON.stringify(content)
									};
									
									burying.point(info);
								}
							}).catch(err => {
								console.log("获取我的信息接口数据返回失败 error is :" + err);
								
								let content = {
									// 动作
									action: "click",
									// 节点
									node: "获取我的信息",
									// 异常信息
									bugInfo: err,
									// 页面参数
									pageParams: null,
									// 接口名称
									intName: "获取我的信息(face-user/info)",
									// 入参
									enterParams: {
										type: 2,
									},
									// 出参
									outParams: null,
									// 前端编码
									webId: null
								};
								
								let info = {
									operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
									page: "123",
									type: 2,
									content: JSON.stringify(content)
								};
								
								burying.point(info);
							})
						}
					})
				}
			},
			
			// 确认去配货大厅找货
			goHall() {
				uni.switchTab({
					url: "/pages/allocation/allocation",
				});
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "确认跳转到配货大厅找货",
					// 异常信息
					bugInfo: null,
					// 页面参数
					pageParams: null,
					// 接口名称
					intName: null,
					// 入参
					enterParams: null,
					// 出参
					outParams: null,
					// 前端编码
					webId: null
				};
				
				let info = {
					operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
					page: "123",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 获取运输性质
			getTransportNature() {
				if(this.authState != 1) {
					ajax.get(config.transportNature_url,{
					}).then(res => {
						console.log(res);
						if(res.code == 0){
							this.transportNatureList = res.data;
						} else {
							console.log(res);
							
							let content = {
								// 动作
								action: "click",
								// 节点
								node: "获取运输性质",
								// 异常信息
								bugInfo: res.msg,
								// 页面参数
								pageParams: null,
								// 接口名称
								intName: "获取运输性质(basic-data/transport-nature)",
								// 入参
								enterParams: null,
								// 出参
								outParams: res,
								// 前端编码
								webId: null
							};
							
							let info = {
								operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
								page: "123",
								type: 2,
								content: JSON.stringify(content)
							};
							
							burying.point(info);
						}
					}).catch(err => {
						console.log("获取运输性质数据返回失败 error is :" + err);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取运输性质",
							// 异常信息
							bugInfo: err,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取运输性质(basic-data/transport-nature)",
							// 入参
							enterParams: null,
							// 出参
							outParams: null,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "123",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					})
				}
			},
			
			// 车型车长及运输性质确认
			carAffirm() {
				this.transportProShow = false;
				this.transportProName = this.transportproObj.name;
				this.transportproId = this.transportproObj.id;
			},
			
			// 认证成功跳转到个人信息
			goMyMessage() {
				uni.redirectTo({
					url: "/pages/personalCentre/personalCentre"
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "认证成功跳转到个人信息",
					// 异常信息
					bugInfo: null,
					// 页面参数
					pageParams: null,
					// 接口名称
					intName: null,
					// 入参
					enterParams: null,
					// 出参
					outParams: null,
					// 前端编码
					webId: null
				};
				
				let info = {
					operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
					page: "123",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 选中的运输性质
			transportProChange(e) {
				this.transportproObj = e;
			},
			
			// 返回当前页
			goBack() {
				this.failShow = false;
				this.failText = '认证失败，请重新上传相关证件';
			},
			
			// 实名认证
			realAuth() {
				this.btnAstrict = true;
				ajax.post(config.realAuth_url,{
					type: 2,
					transportNature: this.transportproId
				}).then(res => {
					console.log(res)
					if(res.code == 0){
						if(this.authState == 2) {
							uni.redirectTo({
								url: "/pages/addCar/addCar?carAuthState=1"
							})
						} else if(this.authState == 0) {
							this.succeedShow = true;
						}
					} else {
						this.btnAstrict = false;
						if(res.code == -7050) {
							this.failText = '驾驶证与身份证姓名不符合，请重新上传相关证件';
						} else {
							this.failText = '认证失败，请重新上传相关证件';
						}
						this.failShow = true;
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "提交实名认证",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "提交实名认证(authentication/approve)",
							// 入参
							enterParams: {
								type: 2,
								transportNature: this.transportproId
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "123",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					this.btnAstrict = false;
				    console.log("实名认证接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "提交实名认证",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "提交实名认证(authentication/approve)",
						// 入参
						enterParams: {
							type: 2,
							transportNature: this.transportproId
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "123",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 人脸比对
			faceThan(base64){
				uni.showLoading({
					title: '人脸认证中',
					mask: true
				});
				console.log(this.faceUrl);
				
				ajax.post(config.faceHuman_url,{
					base64: base64,
					type: 2,
					url: this.faceUrl
				}).then(res => {
					console.log(res)
					uni.hideLoading();
					if(res.code == 0){
						this.faceState = 1;
					} else {
						this.faceState = 0;
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "人脸比对",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "人脸比对(oss/upload/file/base64)",
							// 入参
							enterParams: null,
							// 出参
							outParams: res,
							// 前端编码
							webId: "人脸比对失败"
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "123",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					uni.hideLoading();
				    console.log("人脸比对接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "人脸比对",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "人脸比对(oss/upload/file/base64)",
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "123",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 上传人脸照片
			humanFaceAdd(e){
				let name = e.currentTarget.dataset.img;
				if(this.faceUrl == '' || this.baceUrl == '') {
					this.popShow = true;
				} else {
					uni.chooseImage({
						count: 1, // 默认最多一次选择9张图
						sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有(如果不设置设置二者都有)
						success: res=> {
							// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
							let url = res.tempFilePaths[0];
							console.log('压缩前图片信息:' + JSON.stringify(res.tempFiles)); //压缩前图片信息
							let imgSize = res.tempFiles[0].size;
							if(imgSize > 512000) {   //   如果大于500Kb进行压缩
								let _quality = 80;
								if(imgSize > 2097152) {
									_quality = 10;
								} else {
									_quality = 80;
								}
								console.log(_quality);
								plus.zip.compressImage({    // 5+ plus.zip.compressImage 了解一下，有详细的示例
									src: url,          //src: 压缩原始图片的路径    
									// dst: img.replace('.png', '2222.png').replace('.PNG', '2222.PNG').replace('.jpg','2222.jpg').replace('.JPG','2222.JPG'),
									width: '40%',      //dst: (String 类型 )压缩转换目标图片的路径，这里先在后面原始名后面加一个2222区分一下
									height: '40%',     //width,height: (String 类型 )缩放图片的宽度,高度
									quality: _quality,      //quality: (Number 类型 )压缩图片的质量
									overwrite: true,  //overwrite: (Boolean 类型 )覆盖生成新文件
									// format:'jpg'   //format: (String 类型 )压缩转换后的图片格式
								}, (event) => {
									console.log('压缩后图片信息:' + JSON.stringify(event));// 压缩后图片信息
									let newImg = event.target;
									pathToBase64(newImg).then(base64 => {
										this.faceThan(base64);
									}).catch((err) => {
										console.log(err);
										uni.showToast({title:"上传失败,请重新上传", icon: "none",duration:2000})
									})
								}, (err) => {
									uni.showToast({title:"上传失败,请重新上传", icon: "none",duration:2000})
								});
							} else {//else小于500kb跳过压缩，直接返回现有的url
								pathToBase64(url).then(base64 => {
									this.faceThan(base64);
								}).catch((err) => {
									console.log(err);
									uni.showToast({title:"上传失败,请重新上传", icon: "none",duration:2000})
								})
							}
							
							// uni.compressImage({
							// 	src: url,
							// 	quality: 80,
							// 	width: 'auto',
							// 	height: 'auto',
							// 	success: reg => {
							// 		pathToBase64(reg.tempFilePath).then(base64 => {
							// 			this.faceThan(base64);
							// 		}).catch((err) => {
							// 			console.log(err);
							// 			uni.showToast({title:"上传失败,请重新上传", icon: "none",duration:2000})
							// 		})
							// 	}
							// });
							
							// let resPath = url;
							// let path = plus.io.convertLocalFileSystemURL(resPath);
							// let compressImgTool = uni.requireNativePlugin("CL-CompressImg");
							// compressImgTool.imageCompressToByteOptions({path:path, toByte:1000}, res => {
							// 	const {code} = res;
							// 	if(code == 1) {
							// 		//路径转换;将绝对路径转为平台的相对路径
							// 		let compressPath = plus.io.convertAbsoluteFileSystem(res.filePath);	
							// 		console.log(compressPath);
							// 		if(uni.getSystemInfoSync().platform == 'android') {
							// 			if(compressPath.startsWith("_doc/")) {
							// 				pathToBase64(compressPath).then(base64 => {
							// 					this.faceThan(base64);
							// 				}).catch((err) => {
							// 					console.log(err);
							// 					uni.showToast({title:"上传失败,请重新上传", icon: "none",duration:2000})
							// 				})
							// 			} else {
							// 				let compressImgPath = "file://"+compressPath;
							// 				pathToBase64(compressImgPath).then(base64 => {
							// 					this.faceThan(base64);
							// 				}).catch((err) => {
							// 					console.log(err);
							// 					uni.showToast({title:"上传失败,请重新上传", icon: "none",duration:2000})
							// 				})
							// 			}
							// 		} else {
							// 			pathToBase64(compressPath).then(base64 => {
							// 				this.faceThan(base64);
							// 			}).catch((err) => {
							// 				console.log(err);
							// 				uni.showToast({title:"上传失败,请重新上传", icon: "none",duration:2000})
							// 			})
							// 		}
							// 	} else {
							// 		uni.showToast({title:"上传失败,请重新上传", icon: "none",duration:2000})
							// 	}
							// })
							// 单张压缩
							// this.$refs.helangCompress.compress({
							//     src: url,
							//     maxSize: 1920,
							//     fileType:'jpg',
							//     quality: 1,
							//     minSize: -1 //最小压缩尺寸，图片尺寸小于该时值不压缩，非H5平台有效。若需要忽略该设置，可设置为一个极小的值，比如负数。
							// }).then((res)=>{
							//     // 压缩成功回调
							// 	console.log(res);
								
							// }).catch((err)=>{
							//     uni.showToast({title:"上传失败,请重新上传", icon: "none",duration:2000})
							// })
						}
					})
				}
			},
			
			// OSS图片上传
			uploadOss(base64,type){
				uni.showLoading({
					title: '上传中',
					mask: true
				});
				
				ajax.post(config.uploadOss_url,{
					base64: base64,
					type: type,
					roleType: 2
				}).then(res => {
					console.log(res)
					uni.hideLoading();
					if(res.code == 0){
						if(type == 1) {
							this.faceUrl = res.data.url;
							this.idName = res.data.idCardDTO.name;
							this.idNumber = res.data.idCardDTO.iDNumber;
						} else if(type == 2) {
							this.baceUrl = res.data.url;
						} else if(type == 3) {
							this.vehiclefaceUrl = res.data.url;
							this.drivingName = res.data.driverLicenseDTO.name;
							this.drivingNumber = res.data.driverLicenseDTO.licenseNumber;
						} else if(type == 4) {
							this.vehiclebaceUrl = res.data.url;
						}
					} else {
						if(res.code == -7032 || res.code == -7033) {
							uni.showToast({title: res.msg, icon: "none",duration:2000})
						} else {
							uni.showToast({title:"上传失败,请重新上传", icon: "none",duration:2000});
						}
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "OSS图片上传",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "OSS图片上传(authentication/upload-oss)",
							// 入参
							enterParams: null,
							// 出参
							outParams: res,
							// 前端编码
							webId: "无法上传"
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "123",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					uni.showToast({title:"上传失败,请重新上传", icon: "none",duration:2000})
					uni.hideLoading();
				    console.log("OSS图片上传接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "OSS图片上传",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "OSS图片上传(authentication/upload-oss)",
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: "无法上传"
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "123",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// getPermission(name) {
			// 	let that = this
			// 	permissionUtils.requestPhonePermission(
			// 		'camera',
			// 		[
			// 			'android.permission.CAMERA'
			// 		],
			// 		function success() {
			// 			that.ocr(name)
			// 		},
			// 		function fail(permission) {
				
			// 		}
			// 	)
			// },
			
			ocr(name) {
				let ocrType = "idCardFront"
				if(name == "1"){
					ocrType = 'idCardFront'
				} else if(name == "2"){
					ocrType = 'idCardBack'
				} else if(name == "3"){
					ocrType = 'driverCardFront'
				} else if(name == "4"){
					ocrType = 'driverCardBack'
				}
				// 2.使用自定义样式
				txOCR.ocr({
					secretId: 'AKIDpW2MUUKyNXTChx0rUs2y3vZy85oJZbPy', //【必填】腾讯云控制台生成的secretId
					secretKey: 'PaYJp5JMAk6LM9kANL6dw0qTs4ze3EAu', //【必填】腾讯云控制台生成的secretKey
					ocrType: ocrType, // 选填【识别类型】默认值：idCardFront，身份证正面识别，idCardBack为身份证反面识别
					modeType: 0, // 选填【识别模式】默认值：0，0：自动识别，1：手动拍照识别
					themeColor: '#006FFF', // 选填【导航栏背景颜色】默认值：无
					dialogConfirmColor: '#006FFF', // 选填【提示框确认按钮颜色】默认值：无
					cardSuccessColor: '#006FFF', // 选填【识别框颜色】默认值：无，识别成功时识别框四角的颜色
					hintTextSuccessColor: '#006FFF', // 选填【顶部提示文字颜色】默认值：无，识别成功时识别框顶部提示文字颜色
					navTitle: ocrType == 'idCardFront' || ocrType == 'idCardBack' ? '身份证识别' : '驾驶证识别', // 选填【导航文字内容，IOS不支持】默认值：身份证识别
					albumEnable: false, // 选填【是否开启相册选择】默认值：false
					autoTimeOut: 20, // 选填【自动识别超时时间，IOS不支持】，单位(秒)，默认值：10（取值区间：5s < autoTimeOut < 180s），当自动识别超时会弹出是否改为拍照识别提示框
					autoTimeOutHintText: '识别超时，是否切换识别模式！', // 选填【当自动识别超时，dialog中显示的文字内容】，默认值：识别超时，是否切换为手动拍照识别模式
					cropIdCard: true, // 选填【是否开启身份证照片裁剪】默认值：false，去掉证件外多余的边缘、自动矫正拍摄角度
					cropPortrait: false, // 选填【是否开启人像照片裁剪】默认值：false，自动抠取身份证头像区域
					copyWarn: true, // 选填【是否开启复印件告警】默认值：false
					borderCheckWarn: true, // 选填【是否开启边框和框内遮挡告警】默认值：false
					reshootWarn: false, // 选填【是否开启翻拍告警】默认值：false
					detectPsWarn: false, // 选填【是否开启 PS 检测告警】默认值：false
					tempIdWarn: false, // 选填【是否开启临时身份证告警】默认值：false
					invalidDateWarn: false, // 选填【是否开启身份证有效日期不合法告警】默认值：false
					quality: true, // 选填【是否开启图片质量分数】默认值：false，评价图片的模糊程度
					reflectWarn: true, // 选填【是否开启反光检测】默认值：false，照片反光程度检测
					multiCardDetect: true, // 选填【是否开启多卡证检测】默认值：false，多卡证检测
					isHorizontal: true // 选填【是否开启横屏识别】默认值：false
				}, result => {
					switch (result.code) {
						case 1: // ocr文字提取成功
							if(ocrType == 'idCardFront') {
								const idCardReuslt = JSON.parse(result.data);
								let otherBase64Image = idCardReuslt.AdvancedInfo;
								// 确保有修正过的base64数据
								if (otherBase64Image) {
									otherBase64Image = JSON.parse(idCardReuslt.AdvancedInfo)
									// 确保有裁剪过的图片
									const idCardPhoto = otherBase64Image.IdCard
									if (idCardPhoto) {
										let base64Result = `data:image/jpg;base64,${idCardPhoto}`
										this.uploadOss(base64Result, name);
									}
									// 避免view渲染卡顿，删除base64数据
									delete idCardReuslt.AdvancedInfo
								}
							}else {
								let base64Result = result.base64Image;
								this.uploadOss(base64Result, name);
							}
							break
						case -2: // 权限申请被拒绝，仅Android端支持
							if (result.never) { // 是否被永远拒绝，如果被永远拒绝需要跳转设置页让用户手动开启
								uni.showModal({
									title: '权限受限',
									content: '您拒绝了一些权限，可能导致该服务无法正常使用，请前往设置！',
									confirmText: '前往设置',
									success: (res) => {
										if (res.confirm) {
											permissionUtils.gotoAppPermissionSetting()
										}
									}
								})
							} else { // 没有永远拒绝就弹窗给予提示然后再次调用插件
								uni.showToast({
									title: "您拒绝了一些权限，可能导致该服务无法正常使用，请授予后再使用！",
									icon: "none",
									duration: 2000
								});
							}
							break
						case -1: // 其他错误，如配置属性不合法等
						default:
							/**
							 * 注意：
							 *  default返回的是ocr识别失败的错误码，此错误码与腾讯SDK保持一致
							 *  详情参考：https://cloud.tencent.com/document/product/866/33528
							 */
							let error = result;
							console.log(error);
							if(error.code == 'FailedOperation.IdCardInfoIllegal') {
								uni.showToast({
									title: "上传证件信息不符，请重新上传",
									icon: "none",
									duration: 2000
								});
							} else if(error.code == 'FailedOperation.EmptyImageError') {
								uni.showToast({
									title: "证件内容为空，请重新上传",
									icon: "none",
									duration: 2000
								});
							} else if(error.code == 'FailedOperation.EngineRecognizeTimeout') {
								uni.showToast({
									title: "证件上传超时，请重新上传",
									icon: "none",
									duration: 2000
								});
							} else if(error.code == 'FailedOperation.ImageBlur') {
								uni.showToast({
									title: "证件图片模糊，请重新上传",
									icon: "none",
									duration: 2000
								});
							} else if(error.code == 'FailedOperation.ImageSizeTooLarge') {
								uni.showToast({
									title: "证件图片过大，请重新上传",
									icon: "none",
									duration: 2000
								});
							}  else if(error.code == 'OcrSdk.UserCancelOcr') {
								console.log('主动停止');
							} else {
								uni.showToast({
									title: "证件上传失败，请重新上传",
									icon: "none",
									duration: 2000
								});
							}
							break
						}
					}
				)
			},
			
			// 上传图片
			addImg(e){
				let name = e.currentTarget.dataset.img;
				this.ocr(name);
				//身份证识别走别的路
				// if(name == 1 || name == 2){
				// 	console.log("走起")
				// 	this.getPermission(name)
				// } else {
				// 	uni.chooseImage({
				// 		count: 1, // 默认最多一次选择9张图
				// 		// sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有(如果不设置设置二者都有)
				// 		success: res=> {
				// 			// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
				// 			let url = res.tempFilePaths[0];
				// 			console.log('压缩前图片信息:' + JSON.stringify(res.tempFiles)); //压缩前图片信息
				// 			let imgSize = res.tempFiles[0].size;
				// 			if(imgSize > 512000) {   //   如果大于500Kb进行压缩
				// 				let _quality = 80;
				// 				if(imgSize > 2097152) {
				// 					_quality = 10;
				// 				} else {
				// 					_quality = 80;
				// 				}
				// 				console.log(_quality);
				// 				plus.zip.compressImage({    // 5+ plus.zip.compressImage 了解一下，有详细的示例
				// 					src: url,          //src: 压缩原始图片的路径    
				// 					// dst: img.replace('.png', '2222.png').replace('.PNG', '2222.PNG').replace('.jpg','2222.jpg').replace('.JPG','2222.JPG'),
				// 					width: '40%',      //dst: (String 类型 )压缩转换目标图片的路径，这里先在后面原始名后面加一个2222区分一下
				// 					height: '40%',     //width,height: (String 类型 )缩放图片的宽度,高度
				// 					quality: _quality,      //quality: (Number 类型 )压缩图片的质量
				// 					overwrite: true,  //overwrite: (Boolean 类型 )覆盖生成新文件
				// 					// format:'jpg'   //format: (String 类型 )压缩转换后的图片格式
				// 				}, (event) => {
				// 					console.log('压缩后图片信息:' + JSON.stringify(event));// 压缩后图片信息
				// 					let newImg = event.target;
				// 					pathToBase64(newImg).then(base64 => {
				// 						this.uploadOss(base64,name);
				// 					}).catch((err) => {
				// 						console.log(err);
				// 						uni.showToast({title:"上传失败,请重新上传", icon: "none",duration:2000})
				// 					})
				// 				}, (err) => {
				// 					uni.showToast({title:"上传失败,请重新上传", icon: "none",duration:2000})
				// 				});
				// 			} else {//else小于500kb跳过压缩，直接返回现有的url
				// 				pathToBase64(url).then(base64 => {
				// 					this.uploadOss(base64,name);
				// 				}).catch((err) => {
				// 					console.log(err);
				// 					uni.showToast({title:"上传失败,请重新上传", icon: "none",duration:2000})
				// 				})
				// 			}
				// 		}
				// 	})
				// }
			},
		}
	}
</script>

<style scoped lang="scss">
	.authBox {
		width: 100%;
		height: 100%;
		padding-bottom: 160rpx;
		position: relative;
		.warp {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		}
		
		.rect {
			width: 700rpx;
			height: 408rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.slot-wrap {
			font-size: 24rpx;
			color: #F96F2B;
			margin-right: 30rpx;
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
		.content {
			margin-top: 34rpx;
			width: 100%;
			padding: 0 30rpx;
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
					font-size: 24rpx;
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
					border: 2rpx solid #FEC24D;
					background: #FFF3DB;
					position: relative;
					.fangkuai {
						width: 24rpx;
						height: 24rpx;
						background: #FD8624;
						border-radius: 8rpx 0rpx 8rpx 0rpx;
						position: absolute;
						bottom: -2rpx;
						right: -2rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						.duigouChengss {
							font-size: 10rpx;
							color: #fff;
						}
					}
				}
			}
		}
		.personalBot {
			width: 92%;
			margin: 15rpx auto auto auto;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.personalBot-yuan {
				width: 8rpx;
				height: 8rpx;
				background: #999999;
				border-radius: 50%;
				margin-right: 10rpx;
			}
			.personalBot-text {
				font-size: 20rpx;
				color: #999999;
			}
		}
		.topHint {
			width: 100%;
			height: 60rpx;
			line-height: 60rpx;
			background: #f6dbce;
			text-align: center;
			font-size: 24rpx;
			color: #F96F2B;
			position: fixed;
			top: 88rpx;
			z-index: 10;
		}
		.authContss {
			width: 100%;
			padding: 0 30rpx;
			margin-top: 90rpx;
			border-radius: 20rpx;
			.autConCon2 {
				width: 100%;
				height: 82rpx;
				font-size: 28rpx;
				color: #666666;
				background: #ffffff;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 20rpx;
				.fanhuiYou1 {
					font-size: 20rpx;
					color: #999999;
				}
				.inpsty {
					font-size: 28rpx;
					color: #999999;
				}
				.autConCon2Tit {
					width: 25%;
					height: 38rpx;
					line-height: 38rpx;
				}
				.autConCon2Inp {
					width: 70%;
					margin-left: 30rpx;
					height: 38rpx;
					font-size: 28rpx;
					line-height: 38rpx;
				}
			}
			.authCont-mid {
				width: 100%;
				border-bottom: 2rpx solid #f5f5f5;
				height: 74rpx;
				padding: 0 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: #ffffff;
				.authCont-tit {
					font-size: 28rpx;
					color: #666666;
				}
				.authCont-mid-right {
					display: flex;
					justify-content: flex-end;
					align-items: center;
					.faceStates {
						font-size: 28rpx;
						color: #F96F2B;
					}
					.renlianshibie {
						color: #999999;
						font-size: 30rpx;
					}
					.fanhuiYou1 {
						color: #999999;
						font-size: 20rpx;
						margin-left: 12rpx;
					}
				}
			}
			.authCont {
				width: 100%;
				background: #ffffff;
				.authCont-tit {
					width: 100%;
					border-bottom: 2rpx solid #f5f5f5;
					height: 74rpx;
					font-size: 28rpx;
					padding: 0 20rpx;
					line-height: 74rpx;
					color: #666666;
				}
				.autConCon1 {
					width: 100%;
					border-bottom: 2rpx solid #f5f5f5;
					height: 244rpx;
					padding: 0 15rpx;
					display: flex;
					justify-content: space-around;
					align-items: center;
					.autConConItem1 {
						width: 310rpx;
						height: 168rpx;
						border-radius: 8rpx;
						background-image: url(../../static/img07.png);
						background-repeat: no-repeat;
						background-size: 100% 100%;
						background-position: center center;
						text-align: center;
						padding-top: 110rpx;
					}
					.autConConItem2 {
						width: 310rpx;
						height: 168rpx;
						border-radius: 8rpx;
						background-image: url(../../static/img08.png);
						background-repeat: no-repeat;
						background-size: 100% 100%;
						background-position: center center;
						text-align: center;
						padding-top: 110rpx;
					}
					.autConConItem4 {
						width: 310rpx;
						height: 168rpx;
						border-radius: 8rpx;
						background-image: url(../../static/img11.png);
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
						background-image: url(../../static/img12.png);
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
							max-width: 310rpx;
							max-height: 168rpx;
						}
					}
				}
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
		.Buttonss {
			width: 100%;
			height: 140rpx;
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			padding: 0 25rpx;
			position: fixed;
			bottom: 0;
			background: #F5F6F7;
			.submitBtn {
				width: 92%;
				height: 80rpx;
				line-height: 80rpx;
				color: #333333;
			}
			.loginButton {
				background: #DDDDDD !important;
				color: #333333;
			}
		}
	}
</style>
