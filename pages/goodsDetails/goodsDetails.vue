<template>
	<view class="goods">
		<u-navbar back-text="" title-color="#333333" title="货源详情" :background="topBackground" :border-bottom="false"></u-navbar>
		<view class="kong" :style="{top: `${barheight}px`}">
			<view class="kong-title"></view>
		</view>
		<view class="content">
			<view class="site">
				<view class="site-title">
					<view class="site-title-left">装卸地点</view>
					<view class="site-title-right" style="font-size: 18rpx;">
						<Icon :iconType="'iconshijian'" extClass="shijian"></Icon>
						<text>{{ goodsDetails.appointedTime }}可装</text>
						<text v-if="goodsDetails.unloadingTime"> - {{ goodsDetails.unloadingTime }}卸货</text>
					</view>
				</view>
				<view class="site-content">
					<view class="orderCont-load-top">
						<view class="listTop-right">
							<view class="listTop-right-yuan"></view>
							<view class="listTop-right-tit">{{ goodsDetails.handlingTypeName }}</view>
						</view>
						<view class="orderCont-load-top-rig" v-for="(item,index) of loadSite" :key="'load' + item.cityName">
							<view class="orderCont-load-top-rig-left">
								<view class="orderCont-load-top-left-con">起</view>
								<view class="orderCont-load-top-left-con-tit">
									<view style="height: 25rpx; line-height: 25rpx;">
										<text style="margin-right: 10rpx;" class="orderCont-load-top-rig-left-tit-item">{{ item.cityName }}</text>
										<text class="orderCont-load-top-rig-left-tit-item">{{ item.regionName }}</text>
									</view>
									<view class="orderCont-load-top-rig-left-text">{{ item.provinceName }}{{ item.cityName }}{{ item.regionName }}{{ item.address }}</view>
								</view>
							</view>
						</view>
						<view class="orderCont-load-top-rigss" v-for="(item,index) of unloadSite" :key="'unload' + item.cityName">
							<view class="orderCont-load-top-rig-left">
								<view class="orderCont-load-top-left-con" style="background-color: #F84F1D;">终</view>
								<view class="orderCont-load-top-left-con-tit">
									<view style="height: 25rpx; line-height: 25rpx;">
										<text style="margin-right: 10rpx;" class="orderCont-load-top-rig-left-tit-item">{{ item.cityName }}</text>
										<text class="orderCont-load-top-rig-left-tit-item">{{ item.regionName }}</text>
									</view>
									<view class="orderCont-load-top-rig-left-text">{{ item.provinceName }}{{ item.cityName }}{{ item.regionName }}{{ item.address }}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="site-content-bot">
						<view class="site-content-bot-both">
							<view class="site-content-bot-both-left">
								<Icon :iconType="'iconzhuangxie'" extClass="zhuangxie"></Icon>
							</view>
							<view class="site-content-bot-both-right" @click="navigationOpenMap(goodsDetails.addressList)">
								<view class="site-content-bot-both-right-left">
									<view class="site-content-bot-both-right-left-top">约{{ goodsDetails.distance || goodsDetails.distance == 0 ? goodsDetails.distance : '--' }}km</view>
									<view class="site-content-bot-both-right-left-bot">您距装货地</view>
								</view>
								<view class="site-content-bot-both-right-rig">
									<view class="site-content-bot-both-right-rig-img">
										<Icon :iconType="'icondaohang2'" extClass="daohang2"></Icon>
									</view>
									<view class="site-content-bot-both-right-rig-text">导航</view>
								</view>
							</view>
						</view>
						<view class="site-content-bot-both">
							<view class="site-content-bot-both-left" style="border-radius: 0;">
								<Icon :iconType="'iconlichengbei'" extClass="zhuangxie"></Icon>
							</view>
							<view class="site-content-bot-both-right" style="border-bottom-right-radius: 20rpx;" @click="pathOpenMap(goodsDetails.addressList)">
								<view class="site-content-bot-both-right-left">
									<view class="site-content-bot-both-right-left-top">约{{ goodsDetails.kilometers }}km</view>
									<view class="site-content-bot-both-right-left-bot">预估运输总里程</view>
								</view>
								<view class="site-content-bot-both-right-rig">
									<view class="site-content-bot-both-right-rig-img" style="border: 2rpx solid #db791e;">
										<Icon :iconType="'iconchakanluxian1'" extClass="chakanluxian1"></Icon>
									</view>
									<view class="site-content-bot-both-right-rig-text" style="color: #db791e;">路线</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="carGoods">
				<view class="site-title">
					<view class="site-title-left">车货信息</view>
					<view class="site-title-right">请根据车辆运输能力合理选择货源 避免超载超限</view>
				</view>
				<view class="carGoods-content">
					<view class="carGoods-content-top">
						<view class="content-item">
							<view class="content-item-left">用车类型</view>
							<view class="content-item-right">
								<text style="margin-right: 10rpx;">{{ goodsDetails.vehicleTypeName }}</text>
							</view>
						</view>
						<view class="content-item">
							<view class="content-item-left">装货车长</view>
							<view class="content-item-right">
								<text>{{ goodsDetails.cargorCarConductorName ? goodsDetails.cargorCarConductorName.replace(/,/g,'米/') : goodsDetails.occupyConductor }}米</text>
								<text v-if="goodsDetails.occupyCarLength">/货物占用{{ goodsDetails.occupyCarLength }}米</text>
							</view>
						</view>
						<view class="content-item">
							<view class="content-item-left">装货车型</view>
							<view class="content-item-right">
								<text style="margin-left: 10rpx;" v-if="goodsDetails.cargorCarModeName">{{ goodsDetails.cargorCarModeName.replace(/,/g,'/') }}</text>
							</view>
						</view>
						<!-- <view class="content-item">
							<view class="content-item-left">货物名称</view>
							<view class="content-item-right">{{ goodsDetails.name }}</view>
						</view> -->
						<view class="content-item">
							<view class="content-item-left">货物信息</view>
							<view class="content-item-right">{{ goodsDetails.goodsTypeName }}，{{ goodsDetails.weight }}吨，{{ goodsDetails.volume }}方，{{ goodsDetails.packagingTypeName }}</view>
						</view>
						<view class="content-item" :style="goodsDetails.remark == null ? borderbot : ''">
							<view class="content-item-left">服务要求</view>
							<view class="content-item-right">{{ goodsDetails.serviceName }}</view>
						</view>
						<view class="content-item" style="border-bottom: 0;" v-if="goodsDetails.remark != null">
							<view class="content-item-left">备注信息</view>
							<view class="content-item-right">{{ goodsDetails.remark }}</view>
						</view>
					</view>
					
				</view>
			</view>
			<view class="pay">
				<view class="site-title">
					<view class="site-title-left">支付信息</view>
				</view>
				<view class="pay-content">
					<view class="carGoods-content-top">
						<view class="content-item">
							<view class="content-item-left">总运费</view>
							<view class="content-item-right">{{ parseFloat(goodsDetails.freight).toFixed(2) }}元/趟</view>
						</view>
						<view class="content-item">
							<view class="content-item-left">定金</view>
							<view class="content-item-right">{{ parseFloat(goodsDetails.deposit).toFixed(2) }}元 {{ goodsDetails.refundMethod == 1 ? '(退还)' : '' }}</view>
						</view>
						<view class="content-item" v-if="goodsDetails.refundMethod == 1">
							<view class="content-item-left">担保说明</view>
							<view class="content-item-right" style="color: #333333; font-size: 20rpx;">定金支付至平台监管账户，货主确认收货后由平台退还给您</view>
						</view>
						<view class="content-item" style="border: 0;">
							<view class="content-item-left">支付方式</view>
							<view class="content-item-right" style="color: #333333;">{{ goodsDetails.paymentMethodName }}</view>
						</view>
					</view>
					<!-- <view class="carGoods-content-bot">
						定金请优先通过平台支付，如何支付定金?
					</view> -->
				</view>
			</view>
			
			<view class="shipper">
				<view class="site-title">
					<view class="site-title-left">货主信息</view>
					<view class="site-title-right" @click="ringUp" style="background-color: #F44336; border-color: #F44336;" v-if="goodsDetails.driverUsername">
						<Icon :iconType="'icontonghua'" extClass="tonghua" style="color: #fff;"></Icon>
						<view class="site-title-text" style="color: #fff;">联系货主</view>
					</view>
				</view>
				<view class="shipper-content" @click="goShipperDetails(goodsDetails.cargoOwnerDTO.creator)">
					<view class="listBots">
						<view class="listBots-left">
							<view class="listBots-left-left">
								<image v-if="goodsDetails.cargoOwnerDTO.headPortrait != null" style="width: 54rpx; height: 54rpx; border-radius: 50%; border: 2rpx solid #fff;" :src="goodsDetails.cargoOwnerDTO.headPortrait"></image>
								<image v-else style="width: 54rpx; height: 54rpx; border-radius: 8rpx;" src="../../static/img47.png"></image>
							</view>
							<view class="listBots-left-right">
								<view class="listBots-con">
									<view class="listBots-con1">货主</view>
									<view class="listBots-con1">|</view>
									<view class="listBots-con1">{{ goodsDetails.cargoOwnerDTO.nickname }}</view>
								</view>
								<view class="listBots-con">
									<view class="listBots-con2">交易{{ goodsDetails.cargoOwnerDTO.tradingVolume}}</view>
									<view class="listBots-con2">{{ goodsDetails.cargoOwnerDTO.turnoverRate < 50 ? '成交率低' : '成交率高' }}</view>
									<view class="listBots-con2">好评率{{ goodsDetails.cargoOwnerDTO.highPraiseRate }}%</view>
								</view>
							</view>
						</view>
						<view class="listBots-right">
							<Icon :iconType="'icondaohang'" extClass="daohang"></Icon>
							<view class="listBots-con2">查看资料</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!--  v-if="goodsDetails.driverUsername && goodsDetails.driverUsername == userNo" -->
		<view class="goodsBtn" v-if="goodsDetails.driverUsername && goodsDetails.driverUsername == userNo">
			
			<view class="goodsButton" style="background: #e4e4e4;" @click="refuseOrder">
				<Icon :iconType="'iconquxiao1'" extClass="quxiao1"></Icon>
				<view class="goodsButton-tit">拒绝指派</view>
			</view>
			<view class="goodsButton" @click="goPay">
				<Icon :iconType="'iconyunshuzhongWode1'" extClass="yunshuzhongWode1"></Icon>
				<view class="goodsButton-tit">接收指派</view>
			</view>
		</view>
		 <!-- v-else -->
		<view class="goodsBtn" v-else>
			<view class="goodsButton" style="background: #9CCC65;" @click="ringUp">
				<Icon :iconType="'icontonghua'" extClass="tonghua"></Icon>
				<view class="goodsButton-tit">联系货主</view>
			</view>
			<view class="goodsButton" :style="goodsState == 0 ? btnBg : ''" @click="goPay">
				<Icon :iconType="'iconqiangdan'" :extClass="goodsState == 0 ? 'qiangdanss' : 'qiangdan'"></Icon>
				<view class="goodsButton-tit" :style="goodsState == 0 ? btnColor : ''">立即抢单</view>
			</view>
		</view>
		
		<phoneList :phoneLists="phoneLists" @change='phonehide' v-if="phoneShow" :phoneShow="phoneShow"></phoneList>
		
		<!-- 导航组件 -->
		<trucksInfo :itemType="itemType" :itemLists="itemLists" @change="truckshide" v-if="trucksShow" :trucksShow="trucksShow"></trucksInfo>
		
		<!-- 去认证 -->
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}"
		 :closeable="true" v-model="authShow" mode="center">
			<view class="hintTit">温馨提示</view>
			<view class="hintCon">无法抢单，请先进行实名认证</view>
			<view class="hintBtn" @click="goAuth">立即认证</view>
		</u-popup>
	</view>
</template>

<script>
	import config from '../../service/config.js';
	import ajax from '../../service/ajax.js';
	import moment from 'moment';
	import burying from '../../common/request.js';
	import state from '../../store/index.js';
	
	// #ifdef APP-PLUS
	var sdkwx = uni.requireNativePlugin('AMap-NavSdkWX');
	// #endif
	export default {
		data() {
			return {
				// 货车信息显示
				trucksShow: false,
				itemLists: [],
				itemType: 1,
				
				borderbot: { borderBottom: 0 },
				
				btnBg: {
					background: '#dbdbdb'
				},
				
				btnColor: {
					color: '#a7a5a5'
				},
				
				barheight: this.statusBar,
				// 顶部导航的背景
				topBackground: {
					// 渐变色
					backgroundImage: 'linear-gradient(89deg, #FFE14C 0%, #FFC24D 100%)',
				},
				
				// 装货地点
				loadSite: [],
				
				// 卸货地点
				unloadSite: [],
				
				// 货源详情
				goodsDetails: {
					addressList: [],
					cargoOwnerDTO: {}
				},
				
				// 货源Id
				goodsId: '',
				
				// 货源状态
				goodsState: '',
				
				// 用户唯一码
				userNo: '',
				
				// 认证跳转
				authShow: false,
				
				// 联系电话列表显示
				phoneShow: false,
				
				// 联系电话列表
				phoneLists: [],
			}
		},
		onLoad(option) {
			this.goodsId = option.id;
			this.goodsState = option.state;
			console.log(this.goodsId);
			// #ifdef APP-PLUS
			//ios平台高德地图sdk初始化，Android无需
			var key = "59a672d452aa5614d983240a01553557";
			sdkwx.initWithKey(key);
			// #endif

			uni.getStorage({
				key: 'username',
				success: reg => {
					ajax.get(config.userMess_url,{
						type: 2,
					}).then(res => {
						console.log(res);
						if(res.code == 0){
							this.userNo = res.data.userNo;
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
								page: "101",
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
							page: "101",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					})
				}
			})
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "货源详情页面加载",
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
				page: "101",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onShow() {
			this.getGoodsDetails();
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "货源详情页面显示",
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
				page: "101",
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
				node: "货源详情页面卸载",
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
				page: "101",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		methods: {
			// 关闭货车导航
			truckshide(e) {
				this.trucksShow = e;
			},
			
			
			// 联系货主
			ringUp() {
				this.getPhoneList(this.goodsDetails.cargoOwnerDTO.creator);
				
			},
			
			// 关闭联系号码列表
			phonehide(e) {
				this.phoneShow = e;
			},
			
			// 获取电话列表
			getPhoneList(phone) {
				ajax.get(config.phoneList_url,{
					username: phone
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						this.phoneLists = res.data;
						this.phoneShow = true;
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取电话列表",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取电话列表(contact-phone/list)",
							// 入参
							enterParams: {
								username: phone
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "101",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取电话列表接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取电话列表",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取电话列表(contact-phone/list)",
						// 入参
						enterParams: {
							username: phone
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "101",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 跳转到实名认证
			goAuth() {
				uni.navigateTo({
					url: "/pages/myAuthentication/myAuthentication?authState=2"
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到实名认证",
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
					page: "101",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 跳转到货主详情
			goShipperDetails(phone) {
				uni.navigateTo({
					url: "/pages/shipperDetails/shipperDetails?phone=" + phone
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到货主详情",
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
					page: "101",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 筛选装卸货地点
			filtrateSite(list) {
				console.log(list)
				this.loadSite = list.addressList.filter(function(item){
					return item.type == '1';
				})
				
				this.unloadSite = list.addressList.filter(function(item){
					return item.type == '2';
				})
			},
			
			// 起点导航
			navigationOpenMap(items) {
				this.itemType = 1;
				this.itemLists = items;
				this.trucksShow = true;
			},
			
			// 路线导航
			pathOpenMap(items) {
				this.itemType = 2;
				this.itemLists = items;
				this.trucksShow = true;
			},
			
			// 获取货源详情
			getGoodsDetails() {
				ajax.get(config.freightCargo_url + `/${this.goodsId}`,{
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						
						this.goodsDetails = res.data;
						moment.locale();
						
						// 服务费计算
						// if(this.goodsDetails.freight <= 200) {
						// 	this.goodsDetails.freight = this.goodsDetails.freight - 2
						// } else {
						// 	this.goodsDetails.freight = this.goodsDetails.freight - this.goodsDetails.freight*0.01
						// }
						
						uni.getStorage({
						    key: 'loc',
						    success: res => {
								if(this.$store.state.lat && this.$store.state.lon) {
									// 计算距离
									let La1 = parseFloat(this.$store.state.lat) * Math.PI / 180.0;  
									let La2 = parseFloat(this.goodsDetails.addressList[0].lat) * Math.PI / 180.0;
									let La3 = La1 - La2;
									let Lb3 = parseFloat(this.$store.state.lon) * Math.PI / 180.0 - parseFloat(this.goodsDetails.addressList[0].lnt) * Math.PI / 180.0;
									let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));  
									s = s * 6378.137;//地球半径
									this.goodsDetails.distance = Math.round((Math.round(s * 10000) / 10000));
								} else {
									// 计算距离
									let La1 = parseFloat(res.data.latitude) * Math.PI / 180.0;  
									let La2 = parseFloat(this.goodsDetails.addressList[0].lat) * Math.PI / 180.0;
									let La3 = La1 - La2;
									let Lb3 = parseFloat(res.data.longitude) * Math.PI / 180.0 - parseFloat(this.goodsDetails.addressList[0].lnt) * Math.PI / 180.0;
									let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));  
									s = s * 6378.137;//地球半径
									this.goodsDetails.distance = Math.round((Math.round(s * 10000) / 10000));
								}
						    },
							fail: err => {
								uni.getLocation({
								    type: 'gcj02',
								    success: res => {
										this.$store.commit("getLon", res.longitude);
										this.$store.commit("getLat", res.latitude);
										let La1 = parseFloat(res.latitude) * Math.PI / 180.0;
										let La2 = parseFloat(item.addressList[0].lat) * Math.PI / 180.0;
										let La3 = La1 - La2;
										let Lb3 = parseFloat(res.longitude) * Math.PI / 180.0 - parseFloat(item.addressList[0].lnt) * Math.PI / 180.0;
										let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));  
										s = s * 6378.137;//地球半径
										item.distance = Math.round((Math.round(s * 10000) / 10000));
										uni.setStorage({
											key: 'loc',
											data: res,
										});
								    },
									fail: err => {
										console.log('不支持地图');
									}
								});
							}
						});
						
						this.filtrateSite(this.goodsDetails);
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						})
						setTimeout(function(){
							uni.navigateBack()
						},2000)
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取货源详情",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取货源详情(distribution-hall/freight-cargo)",
							// 入参
							enterParams: {
								id: this.goodsId
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "101",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取货源详情接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取货源详情",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取货源详情(distribution-hall/freight-cargo)",
						// 入参
						enterParams: {
							id: this.goodsId
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "101",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 立即支付
			goPay() {
				if(this.goodsState == 1) {

					uni.getStorage({
						key: 'username',
						success: reg => {
							ajax.get(config.userMess_url,{
								type: 2,
							}).then(res => {
								console.log(res);
								if(res.code == 0){
									if(res.data.userCertificationStatus == 1) {
										uni.navigateTo({
											url: "/pages/pay/pay?goodsId=" + `${this.goodsId}&deposit=${this.goodsDetails.deposit}`
										})
									} else {
										this.authShow = true;
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
										page: "101",
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
									page: "101",
									type: 2,
									content: JSON.stringify(content)
								};
								
								burying.point(info);
							})
						}
					})
				}
			},
			
			
			//拒绝承运
			refuseOrder(){
				ajax.post(config.refuse_url, {
					cargoId: this.goodsId
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						uni.switchTab({
							url:"/pages/allocation/allocation"
						})
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取拒绝承运",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取拒绝承运(order-management/refuse)",
							// 入参
							enterParams: {
								cargoId: this.goodsId
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "101",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取拒绝承运数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取拒绝承运",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取拒绝承运(order-management/refuse)",
						// 入参
						enterParams: {
							cargoId: this.goodsId
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "101",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods {
		width: 100%;
		padding-bottom: 46rpx;
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
		.content {
			width: 94%;
			margin: 0 auto;
			margin-top: 44rpx;
			padding-bottom: 60rpx;
			.shipper {
				margin-bottom: 60rpx;
				.site-title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 14rpx;
					.site-title-left {
						font-size: 28rpx;
						color: #333333;
					}
					.site-title-right {
						height: 40rpx;
						display: flex;
						justify-content: flex-end;
						align-items: center;
						border: 1rpx solid #999999;
						border-radius: 20rpx;
						padding: 0 20rpx;
						.tonghua {
							font-size: 20rpx;
							color: #333333;
						}
						.site-title-text {
							margin-left: 10rpx;
							font-size: 20rpx;
							color: #333333;
						}
					}
				}
				.shipper-content {
					width: 100%;
					height: 100rpx;
					background: #FFFFFF;
					border-radius: 20rpx;
					.listBots {
						width: 95%;
						height: 100%;
						margin: 0 auto;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.listBots-left {
							display: flex;
							justify-content: flex-start;
							align-items: center;
							.listBots-left-left {
								display: flex;
								justify-content: center;
								align-items: center;
								margin-right: 12rpx;
							}
							.listBots-left-right {
								height: 100%;
								display: flex;
								flex-direction: column;
								justify-content: center;
								align-items: flex-start;
								.listBots-con {
									display: flex;
									justify-content: flex-start;
									align-items: center;
									.listBots-con1 {
										height: 32rpx;
										line-height: 32rpx;
										font-size: 24rpx;
										color: #666666;
										margin-right: 7rpx;
									}
									.listBots-con2 {
										height: 28rpx;
										line-height: 28rpx;
										font-size: 20rpx;
										color: #999999;
										margin-right: 7rpx;
									}
								}
							}
						}
						.listBots-right {
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							.daohang {
								font-size: 30rpx;
								color: #FB6E2F;
							}
							.listBots-con2 {
								height: 28rpx;
								line-height: 28rpx;
								font-size: 20rpx;
								color: #FB6E2F;;
								margin-right: 7rpx;
							}
						}
					}
				}
			}
			.pay {
				margin-bottom: 40rpx;
				.site-title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 14rpx;
					.site-title-left {
						font-size: 28rpx;
						color: #333333;
					}
				}
				.pay-content {
					width: 100%;
					background: #FFFFFF;
					border-radius: 20rpx;
					position: relative;
					.carGoods-content-top {
						width: 100%;
						padding: 10rpx 20rpx 10rpx 20rpx;
						.content-item {
							width: 100%;
							padding: 16rpx 0;
							border-bottom: 2rpx solid #f5f5f5;
							display: flex;
							justify-content: space-between;
							align-items: center;
							.content-item-left {
								flex: 1.5;
								font-size: 24rpx;
								color: #666666;
								margin-right: 20rpx;
								text-align: left;
							}
							.content-item-right {
								flex: 8;
								text-align: right;
								line-height: 1.3;
								font-size: 28rpx;
								color: #FB6E2F;
								word-wrap: anywhere;
							}
						}
					}
					.carGoods-content-bot {
						position: absolute;
						left: 0;
						bottom: 0;
						width: 100%;
						height: 40rpx;
						line-height: 40rpx;
						background: #f0f0f0;
						border-radius: 0 0 20rpx 20rpx;
						text-align: right;
						font-size: 20rpx;
						color: #FB6E2F;
						padding: 0 16rpx;
					}
				}
			}
			.carGoods {
				margin-bottom: 40rpx;
				.site-title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 14rpx;
					.site-title-left {
						font-size: 28rpx;
						color: #333333;
					}
					.site-title-right {
						font-size: 20rpx;
						color: #666666;
					}
				}
				.carGoods-content {
					width: 100%;
					background: #FFFFFF;
					border-radius: 20rpx;
					position: relative;
					.carGoods-content-top {
						width: 100%;
						padding: 16rpx 20rpx;
						.content-item {
							width: 100%;
							padding: 16rpx 0;
							border-bottom: 2rpx solid #f5f5f5;
							display: flex;
							justify-content: space-between;
							align-items: center;
							.content-item-left {
								flex: 2;
								font-size: 24rpx;
								color: #666666;
								text-align: left;
							}
							.content-item-right {
								flex: 8;
								text-align: right;
								line-height: 1.3;
								font-size: 28rpx;
								color: #333333;
								word-wrap: anywhere;
							}
						}
					}
				}
			}
			.site {
				margin-bottom: 40rpx;
				.site-title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 14rpx;
					.site-title-left {
						font-size: 28rpx;
						color: #333333;
					}
					.site-title-right {
						font-size: 20rpx;
						color: #666666;
						display: flex;
						align-items: center;
						.shijian {
							margin-right: 8rpx;
							font-size: 20rpx;
							color: #666666;
						}
					}
				}
				.site-content {
					width: 100%;
					background: #ffffff;
					border-radius: 20rpx;
					padding-bottom: 64rpx;
					position: relative;
					.orderCont-load-top {
						background: #ffffff;
						padding: 36rpx 26rpx 0 26rpx;
						position: relative;
						border-radius: 10px;
						.listTop-right {
							width: 140rpx;
							height: 44rpx;
							background: #F0F0F0;
							border-radius: 0rpx 20rpx 0rpx 20rpx;
							position: absolute;
							top: 0;
							right: 0;
							display: flex;
							justify-content: center;
							align-items: center;
							.listTop-right-yuan {
								width: 10rpx;
								height: 10rpx;
								background: #FB6E2F;
								border-radius: 50%;
							}
							.listTop-right-tit {
								font-size: 20rpx;
								font-weight: 600;
								color: #FB6E2F;
								margin-left: 8rpx;
							}
						}
						.orderCont-load-top-rigss:last-child {
							background: none;
						}
						.orderCont-load-top-rigss {
							height: 120rpx;
							display: flex;
							justify-content: space-between;
							align-items: flex-start;
							background: url(../../static/img36.png);
							background-repeat: repeat-y;
							background-position: 14rpx 4rpx;
							background-size: 4rpx cover;
							.orderCont-load-top-rig-rig {
								display: flex;
								justify-content: space-between;
								align-items: flex-start;
								.orderCont-load-top-rig-rig-left {
									width: 18rpx;
									height: 66rpx;
									background: linear-gradient(90deg, #F0F0F0 0%, rgba(255, 255, 255, 0) 100%);
									margin-right: 12rpx;
								}
								.orderCont-load-top-rig-rig-rig {
									display: flex;
									flex-direction: column;
									justify-content: center;
									align-items: center;
									.orderCont-load-top-rig-rig-text {
										font-size: 20rpx;
										color: #1896DB;
									}
								}
							}
							.orderCont-load-top-rig-left {
								width: 100%;
								display: flex;
								justify-content: flex-start;
								align-items: flex-start;
								.orderCont-load-top-left-con-tit {
									margin-left: 18rpx;
									width: 100%;
									display: flex;
									flex-direction: column;
									justify-content: flex-start;
									align-items: flex-start;
									.orderCont-load-top-rig-left-tit-item {
										font-size: 28rpx;
										color: #333333;
										font-weight: bold;
									}
									.orderCont-load-top-rig-left-text {
										margin-top: 10rpx;
										height: 55rpx;
										line-height: 28rpx;
										font-size: 24rpx;
										color: #666;
										overflow: hidden;
									}
								}
								.orderCont-load-top-left-con {
									width: 32rpx;
									height: 32rpx;
									background: #1BB68A;
									font-size: 16rpx;
									line-height: 32rpx;
									color: #FFFFFF;
									border-radius: 50%;
									text-align: center;
								}
							}
						}
						.orderCont-load-top-rig {
							height: 120rpx;
							display: flex;
							justify-content: space-between;
							align-items: flex-start;
							background: url(../../static/img36.png);
							background-repeat: repeat-y;
							background-position: 14rpx 4rpx;
							background-size: 4rpx cover;
							.orderCont-load-top-rig-rig {
								display: flex;
								justify-content: space-between;
								align-items: flex-start;
								.orderCont-load-top-rig-rig-left {
									width: 18rpx;
									height: 66rpx;
									background: linear-gradient(90deg, #F0F0F0 0%, rgba(255, 255, 255, 0) 100%);
									margin-right: 12rpx;
								}
								.orderCont-load-top-rig-rig-rig {
									display: flex;
									flex-direction: column;
									justify-content: center;
									align-items: center;
									.orderCont-load-top-rig-rig-text {
										font-size: 20rpx;
										color: #1896DB;
									}
								}
							}
							.orderCont-load-top-rig-left {
								width: 100%;
								display: flex;
								justify-content: flex-start;
								align-items: flex-start;
								.orderCont-load-top-left-con-tit {
									margin-left: 18rpx;
									width: 100%;
									display: flex;
									flex-direction: column;
									justify-content: flex-start;
									align-items: flex-start;
									.orderCont-load-top-rig-left-tit-item {
										font-size: 28rpx;
										color: #333333;
										font-weight: bold;
									}
									.orderCont-load-top-rig-left-text {
										margin-top: 10rpx;
										height: 55rpx;
										line-height: 28rpx;
										font-size: 24rpx;
										color: #666;
										overflow: hidden;
									}
								}
								.orderCont-load-top-left-con {
									width: 32rpx;
									height: 32rpx;
									background: #1BB68A;
									font-size: 16rpx;
									line-height: 32rpx;
									color: #FFFFFF;
									border-radius: 50%;
									text-align: center;
								}
							}
						}
					}
					.site-content-bot {
						width: 100%;
						height: 64rpx;
						background: #f0f0f0;
						border-radius: 0 0 20rpx 20rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						position: absolute;
						bottom: 0;
						.site-content-bot-both {
							width: 50%;
							display: flex;
							justify-content: space-between;
							align-items: center;
							.site-content-bot-both-left {
								width: 56rpx;
								height: 64rpx;
								background: #e5e5e5;
								border-radius: 0 0 0 20rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								.zhuangxie {
									font-size: 32rpx;
								}
							}
							.site-content-bot-both-right {
								width: 288rpx;
								height: 64rpx;
								display: flex;
								justify-content: space-between;
								align-items: center;
								padding: 14rpx;
								.site-content-bot-both-right-left {
									display: flex;
									flex-direction: column;
									justify-content: center;
									align-items: flex-start;
									.site-content-bot-both-right-left-top {
										font-size: 20rpx;
										font-weight: 600;
										color: #333333;
									}
									.site-content-bot-both-right-left-bot {
										font-size: 16rpx;
										font-weight: 400;
										color: #666666;
									}
								}
								.site-content-bot-both-right-rig {
									display: flex;
									flex-direction: column;
									justify-content: center;
									align-items: center;
									.site-content-bot-both-right-rig-img {
										width: 25rpx;
										height: 25rpx;
										margin-top: 8rpx;
										border-radius: 50%;
										border: 2rpx solid #1896db;
										display: flex;
										justify-content: center;
										align-items: center;
										.daohang2 {
											font-size: 20rpx;
											color: #1896db;
										}
										.chakanluxian1 {
											font-size: 20rpx;
											color: #db791e;
										}
									}
									
									.site-content-bot-both-right-rig-text {
										font-size: 16rpx;
										font-weight: 400;
										color: #1896db;
									}
								}
							}
						}
					}
				}
			}
		}
		.goodsBtn {
			width: 100%;
			height: 120rpx;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			padding: 0 25rpx;
			position: fixed;
			bottom: 0;
			background: #F5F6F7;
			.goodsButtonss {
				width: 220rpx !important;
				height: 70rpx !important;
			}
			.goodsButton {
				width: 336rpx;
				height: 80rpx;
				background: #FEC24D;
				border-radius: 8rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				.quxiao1 {
					font-size: 45rpx;
					margin-right: 15rpx;
				}
				.yunshuzhongWode1 {
					font-size: 45rpx;
					margin-right: 15rpx;
				}
				.tonghua {
					font-size: 45rpx;
					margin-right: 15rpx;
				}
				.qiangdan {
					font-size: 50rpx;
					margin-right: 15rpx;
				}
				.qiangdanss {
					font-size: 50rpx;
					margin-right: 15rpx;
					color: #a7a5a5;
				}
				.goodsButton-tit {
					font-size: 32rpx;
					color: #333333;
				}
			}
		}
		.slot-wrap {
			font-size: 24rpx;
			color: #333333;
			margin-right: 30rpx;
		}
		.kong {
			width: 100%;
			height: 50rpx;
			background: linear-gradient(89deg, #FFE14C 0%, #FFC24D 100%);
			position: fixed;
			top: 88rpx;
			z-index: 10;
			.kong-title {
				position: absolute;
				bottom: 0;
				width: 100%;
				height: 40rpx;
				background: #F5F6F7;
				border-radius: 40rpx 40rpx 0rpx 0rpx;
			}
		}
	}
</style>
