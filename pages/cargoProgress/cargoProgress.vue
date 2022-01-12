<template>
	<view class="pay">
		<u-navbar :is-back="false" back-text="" title-color="#333333" :title="option.type == 1 ? '装货进程' : '卸货进程'" :background="topBackground" :border-bottom="false">
			<view slot="right" class="slot-wrap">
				<view class="left">
					<view class="small"></view>
					<view class="big"></view>
					<view class="small"></view>
				</view>
				<view class="middle"></view>
				<view class="right" @click="navigateBack">
					<view class="big">
						<view class="small"></view>
					</view>
				</view>
			</view>
		</u-navbar>
		<view class="pay-content">
			<view class="content-conts">
				<mescroll-body ref="mescrollRef" @init="mescrollInit" :up="upOption" @down="downCallback">
					<view class="content-list" v-for="(item,index) in loadList" :key="index">
						<view class="content-list-top">
							<view class="content-list-text">{{ item.customerName }}</view>
							<view class="content-list-btn" :class="{'content-list-btns': option.type == 1}" v-if="item.isOk == 0">
								<text v-if="option.type == 1">未装货</text>
								<text v-else>
									<text v-if="item.salesTotalAmount <= 0" @click="confirmOpen(item)">确认卸货</text>
									<text v-else @click="collection(item)">收款</text>
								</text>
							</view>
							<view class="content-list-btn" style="background: #DDDDDD; color: #333333;" v-if="item.isOk == 1">{{ option.type == 1 ? '已装货' : '已卸货' }}</view>
						</view>
						<view class="content-list-bot">
							<view class="content-list-both">
								装货时间：{{ item.outTimeActure ? item.outTimeActure : "未装货" }}
							</view>
							<view class="content-list-both" style="text-align: right;">
								卸货时间：{{ item.loadingTimeActure ? item.loadingTimeActure : "未卸货" }}
							</view>
						</view>
					</view>
				</mescroll-body>				
			</view>
		</view>
		<view class="payBtn">
			<button style="background: #FFC24D;" class="submitBtn" @click="navigateBack">返回</button>
		</view>
		
		<!-- 装卸货确认 -->
		<u-popup width="640" height="490" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}"
		:closeable="false" v-model="popShow" mode="center">
			<view class="hintTit" style="top: 0; padding: 13rpx 0; border-bottom: 2rpx solid #DDDDDD;">{{ option.type == 1 ? '装货信息' : '卸货信息' }}</view>
			<u-cell-group :border="false">
				<u-cell-item hover-class="none" :title-style="{color: '#303133'}" :value-style="{'height': '46rpx', 'line-height': '46rpx', 'color': '#303133', 'padding': '0 0 0 40rpx', 'overflow': 'hidden', 'white-space': 'nowrap', 'text-overflow': 'ellipsis','-webkit-line-clamp': '1',' -webkit-box-orient': 'vertical'}" :arrow="false" style="padding: 16rpx 30rpx;" title="门店名称" v-model="processInfo.customerName"></u-cell-item>
				<u-cell-item hover-class="none" :title-style="{color: '#303133'}" :value-style="{'height': '46rpx', 'line-height': '46rpx', 'color': '#303133', 'padding': '0 0 0 40rpx', 'overflow': 'hidden', 'white-space': 'nowrap', 'text-overflow': 'ellipsis','-webkit-line-clamp': '1',' -webkit-box-orient': 'vertical'}" :arrow="false" style="padding: 16rpx 30rpx;" title="门店地址" v-model="processInfo.address"></u-cell-item>
				<u-cell-item hover-class="none" :title-style="{color: '#303133'}" :value-style="{color: '#303133'}" :arrow="false" style="padding: 16rpx 30rpx;" title="装货时间" v-model="processInfo.outTimeActure"></u-cell-item>
				<u-cell-item :border-bottom="false" hover-class="none" :title-style="{color: '#303133'}" :value-style="{color: '#303133'}" :arrow="false" style="padding: 16rpx 30rpx;" title="卸货时间" v-model="processInfo.loadingTimeActure"></u-cell-item>
			</u-cell-group>
			<view class="hintBtn">
				<view style="width: 50%;" @click="confirm(0)">{{ option.type == 1 ? '确认装货' : '确认卸货' }}</view>
				<view class="hintBtnShu"></view>
				<view style="color: #333333; width: 50%;" @click="popShow = false">返回</view>
			</view>
		</u-popup>
		
		<!-- 是否强制卸货 -->
		<u-popup width="640" height="490" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}"
		:closeable="false" v-model="forceShow" mode="center">
			<view class="hintTit" style="top: 0; padding: 13rpx 0; border-bottom: 2rpx solid #DDDDDD;">温馨提示</view>
			<view class="hintCon">车辆不在门店范围内，是否强制卸货！</view>
			<view class="hintBtn">
				<view style="width: 50%;" @click="confirm(1)">是</view>
				<view class="hintBtnShu"></view>
				<view style="color: #333333; width: 50%;" @click="forceShow = false">否</view>
			</view>
		</u-popup>
		
		<!-- 是否切换二维码 -->
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}"
		:closeable="true" v-model="qrcodeSwitchShow" mode="center">
			<view class="hintTit" style="top: 0; padding: 13rpx 0;">温馨提示</view>
			<view class="hintCon hintCons">是否确认切换支付方式？切换后原先的二维码将失效，不能再使用原二维码进行支付。</view>
			<view class="hintBtn hintBtns" @click="switchQrcode">
				<view style="font-size: 34rpx;">确认切换</view>
			</view>
		</u-popup>
		
		<!-- 选择收款方式 -->
		<u-popup height="400" border-radius="40" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" :closeable="true" v-model="paymentMethodShow" mode="bottom">
			<view class="selectTitle">待收款金额<text style="margin-left: 20rpx; font-weight: bold;">¥{{ collectionInfo.salesTotalAmount.toFixed(2) }}</text></view>
			<view class="selectContent">
				<view class="selectContent-item" @click="selectPay(2)">
					<Icon :iconType="'iconzhifu1'" extClass="zhifu1"></Icon>
					<view class="selectContent-item-text">微信平台</view>
				</view>
				<view class="selectContent-item" @click="selectPay(1)">
					<Icon :iconType="'iconzhifubao1'" extClass="zhifubao1"></Icon>
					<view class="selectContent-item-text">支付宝平台</view>
				</view>
			</view>
		</u-popup>
		
		<!-- 收款码 -->
		<u-popup width="640" @close="collectionCodeClose" height="738" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" :closeable="true" v-model="collectionCodeShow" mode="center">
			<view class="myPurse">
				<view class="myPurse-top" style="margin: 15rpx 0;">
					<view class="myPurse-top-left">收款码</view>
				</view>
				<view class="myPurse-botsss">
					<view class="myPurse-botsss-top">{{ paymentMethod == 1 ? '支付宝' : '微信' }}扫一扫，向我付款</view>
					<view class="myPurse-botsss-top" style="margin-top: 10rpx;">
						<text class="myPurse-botsss-top-left">¥{{ collectionInfo.salesTotalAmount.toFixed(2) }}</text>
						<text class="myPurse-botsss-top-right" v-show="collectionInfo.paymentStatus == payment.loading" @click="getReceivingCode(1)">刷新</text>
					</view>
					<view v-if="!overtimePopShow">
						<view class="myPurse-botsss-mid">
							<tki-qrcode
							    ref="qrcode"
							    :val="collectionInfo.codeUrl"
									background="#fff"
									foreground="#000"
									pdground="#000"
									:icon="paymentMethod == 1 ? '../../static/zhifubao.png' : '../../static/weixin.png'"
									:iconSize="20"
									:loadMake="true"
							    :size="264"
									:showLoading="true"
							    unit="upx"
							    :onval="true" />
						</view>
						<view class="myPurse-botsss-bot">打开{{ paymentMethod == 1 ? '支付宝' : '微信' }}[扫一扫]</view>
					</view>
					<view class="myPurse-botsss-mids" v-else @click="getReceivingCode(1)">
						<image style="width: 180rpx; height: 180rpx;" src="../../static/erweima.png" mode="aspectFit"></image>
						<view>二维码已失效</view>
						<view>请点击刷新二维码</view>
					</view>
					<view v-if="!overtimePopShow">
						<view class="myPurse-botsss-bots" v-show="collectionInfo.paymentStatus == payment.wait">待收款</view>
						<view class="myPurse-botsss-bots" v-show="collectionInfo.paymentStatus == payment.loading">正在收款...</view>
					</view>
					<view v-else>
						<view class="myPurse-botsss-bots" @click="getReceivingCode(1)">刷新</view>
					</view>
				</view>
			</view>
		</u-popup>
		
		<!-- 提示 -->
		<u-popup width="640" height="738" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" :closeable="true" v-model="popupShow" mode="center">
			<view class="myPurse" style="padding: 80rpx 80rpx 30rpx 80rpx;">
				<view class="myPurse-botsss">
					<view class="myPurse-botsss-tops"></view>
					<view class="myPurse-botsss-mid" style="width: 150rpx; height: 150rpx;">
						<Icon v-show="collectionInfo.paymentStatus == payment.success" :iconType="'icontongguo1'" extClass="tongguo1"></Icon>
						<Icon v-show="collectionInfo.paymentStatus == payment.unknownException" :iconType="'iconshibai1'" extClass="shibai1"></Icon>
					</view>
					<view class="myPurse-botsss-botss" v-show="collectionInfo.paymentStatus == payment.success">收款成功</view>
					<view class="myPurse-botsss-botss" v-show="collectionInfo.paymentStatus == payment.unknownException">收款失败</view>
					<view class="myPurse-botsss-bots" v-show="collectionInfo.paymentStatus == payment.success" @click="popupShow = false">完成</view>
					<view class="myPurse-botsss-bots" v-show="collectionInfo.paymentStatus == payment.unknownException" @click="getReceivingCode(1)">重新收款</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import config from '../../service/config.js';
	import ajax from '../../service/ajax.js';
	import moment from 'moment';
	import burying from '../../common/request.js';
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue";
	export default {
		components: {tkiQrcode},
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				barheight: this.statusBar,
				// 顶部导航的背景
				topBackground: {
					// 渐变色
					backgroundImage: 'linear-gradient(89deg, #FFE14C 0%, #FFC24D 100%)',
				},
				logoutAgree: false,
				
				upOption:{
					use: false,
					empty:{
						tip: '~ 暂无数据 ~', // 提示
					},
					textNoMore: '--- 没有更多 ---',
				},
				
				// 装卸货列表
				loadList: [], 
				
				option: {},
				
				popShow: false,
				
				processInfo: {},
				
				// 支付方式显示
				paymentMethodShow: false,
				// 支付类型
				paymentMethod: 0,
				paymentMethods: 0,
				// 收款码显示
				collectionCodeShow: false,
				// 提示显示
				popupShow: false,
				// 装卸货表id
				transportBelongId: 0,
				// 收款信息
				collectionInfo: {
					salesTotalAmount: 0,
					paymentStatus: '0',
					codeUrl: ''
				},
				// 支付状态
				payment: {
					wait: 0,
					loading: 1,
					success: 2,
					noScanOvertime: 3,
					noPayOvertime: 4,
					unknownException: 5
				},
				// 支付状态轮询
				paymentStatusTimer: null,
				// 强制卸货提示框
				forceShow: false,
				// 超时遮罩
				overtimePopShow: false,
				// 切换二维码
				qrcodeSwitchShow: false
			}
		},
		onLoad(option) {
			console.log(option);
			this.option = option;
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "装卸货进程页面加载",
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
				page: "128",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onShow() {
			// this.getStoreList(this.option);

			let content = {
				// 动作
				action: "click",
				// 节点
				node: "装卸货进程页面显示",
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
				page: "128",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onUnload() {
			clearInterval(this.paymentStatusTimer);
			uni.removeStorageSync('transportBelongId');
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "装卸货进程页面卸载",
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
				page: "128",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		methods: {
			// 收款码关闭
			collectionCodeClose() {
				clearInterval(this.paymentStatusTimer);
			},
			
			// 点击收款
			collection(item) {
				this.transportBelongId = item.transportBelongId;
				this.collectionInfo.salesTotalAmount = Number(item.salesTotalAmount);
				this.paymentMethodShow = true;
			},
			
			// 切换二维码
			switchQrcode() {
				this.paymentMethod = this.paymentMethods;
				this.qrcodeSwitchShow = false;
				this.getReceivingCode(0);
			},
			
			// 选择支付方式
			selectPay(type) {
				const TRANSPORTBELONGID = uni.getStorageSync('transportBelongId');
				if(TRANSPORTBELONGID == this.transportBelongId) {
					if(this.paymentMethod == 0) {
						this.paymentMethod = type;
						this.paymentMethodShow = false;
						this.getReceivingCode(0);
					} else {
						if(type == this.paymentMethod) {
							this.paymentMethod = type;
							this.paymentMethodShow = false;
							this.getReceivingCode(0);
						} else {
							this.paymentMethods = type;
							this.paymentMethodShow = false;
							this.qrcodeSwitchShow = true;
						}
					}
				} else {
					this.paymentMethod = type;
					this.paymentMethodShow = false;
					this.getReceivingCode(0);
				}
				uni.setStorageSync('transportBelongId', this.transportBelongId);
			},
			
			// 获取收款码
			getReceivingCode(refresh) {
				this.popupShow = false;
				this.overtimePopShow = false;
				ajax.get(config.receivingCode_url, {
					transportBelongId: this.transportBelongId,
					paymentMethod: this.paymentMethod,
					clientIp: this.paymentMethod == 1 ? '' : uni.getStorageSync('operateIp'),
					refresh: refresh
				}).then(res => {
					if (res.code == 0) {
						this.collectionInfo.salesTotalAmount = res.data.salesTotalAmount ? Number(res.data.salesTotalAmount) : 0;
						this.collectionInfo.paymentStatus = res.data.paymentStatus;
						this.collectionInfo.codeUrl = res.data.codeUrl || '';
						this.collectionCodeShow = true;
						clearInterval(this.paymentStatusTimer);
						this.paymentStatusTimer = setInterval(() => {
							this.getPaymentStatus();
						},3000);
						
						let _time = res.data.expires_in * 1000
						setTimeout(() => {
							this.overtimePopShow = true;
							clearInterval(this.paymentStatusTimer);
						},_time)
					} else {
						console.log(res);
					}
				}).catch(err => {
					console.log("获取收款码返回失败 error is :" + err);
				})
			},
			
			// 获取支付状态
			getPaymentStatus() {
				ajax.get(config.paymentStatus_url, {
					transportBelongId: this.transportBelongId
				}).then(res => {
					if (res.code == 0) {
						let _paymentStatus = res.data;
						this.collectionInfo.paymentStatus = _paymentStatus;
						if(this.collectionInfo.paymentStatus == this.payment.success) {
							this.popupShow = true;
							this.collectionCodeShow = false;
							this.overtimePopShow = false;
							this.getStoreList(this.option);
							clearInterval(this.paymentStatusTimer);
						} else if (this.collectionInfo.paymentStatus == this.payment.noScanOvertime) {
							this.overtimePopShow = true;
							clearInterval(this.paymentStatusTimer);
						} else if (this.collectionInfo.paymentStatus == this.payment.noPayOvertime) {
							this.overtimePopShow = true;
							clearInterval(this.paymentStatusTimer);
						} else if (this.collectionInfo.paymentStatus == this.payment.unknownException) {
							this.popupShow = true;
							this.collectionCodeShow = false;
							this.overtimePopShow = false;
							clearInterval(this.paymentStatusTimer);
						}
					} else {
						console.log(res);
					}
				}).catch(err => {
					console.log("获取支付状态失败 error is :" + err);
				})
			},
			
			// 打开确认装货/卸货
			confirmOpen(item) {
				this.processInfo = Object.assign({},item);
				this.popShow = true;
				if(this.option.type == 1) {
					this.processInfo.outTimeActure = moment().format('HH:mm');
					this.processInfo.loadingTimeActure = '未卸货';
				} else {
					this.processInfo.loadingTimeActure = moment().format('HH:mm');
				}
			},
			
			downCallback(){
				this.getStoreList(this.option);
			},
			
			// 获取门店
			getStoreList(option) {
				ajax.get(config.coldCustomerSort_url, {...option}).then(res => {
					if (res.code == 0) {
						this.loadList = [];
						res.data.forEach(item => {
							item.outTimeActure = item.outTimeActure ? moment(item.outTimeActure).format('HH:mm') : '';
							item.loadingTimeActure = item.loadingTimeActure ? moment(item.loadingTimeActure).format('HH:mm') : '';
							this.loadList.push(item);
						})
						this.mescroll.endSuccess();
					} else {
						console.log(res);
						this.mescroll.endErr();
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取门店",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取门店(driver/order-out/customer-sort)",
							// 入参
							enterParams: option,
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "128",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("根据运输订单获取门店数据返回失败 error is :" + err);
					this.mescroll.endErr();
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取门店",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取门店(driver/order-out/customer-sort)",
						// 入参
						enterParams: option,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "128",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 装卸货完成
			confirm(force) {
				let _param = {
					transportBelongId: this.processInfo.transportBelongId, 
					type: this.option.type,
					force: this.option.type == 1 ? 0 : force
				}
				this.popShow = false;
				this.forceShow = false;
				ajax.post(config.coldCustomerLoading_url, {..._param}).then(res => {
					console.log(res);
					if (res.code == 0) {
						this.getStoreList(this.option);
					} else {
						console.log(res);
						if(res.code == -8127) {
							this.forceShow = true;
						} else if(res.code == -8019) {
							uni.showToast({
								title: "订单已取消，无法操作！",
								icon: "none",
								duration: 2000
							});
						} else {
							uni.showToast({
								title: this.option.type == 1 ? "确认装货失败" : "确认卸货失败",
								icon: "none",
								duration: 2000
							});
						}
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "装卸货完成",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "装卸货完成(driver/order-out/customer-loading)",
							// 入参
							enterParams: {
								transportBelongId: this.processInfo.transportBelongId, 
								type: this.option.type,
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "128",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("装卸货完成数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "装卸货完成",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "装卸货完成(driver/order-out/customer-loading)",
						// 入参
						enterParams: {
							transportBelongId: this.processInfo.transportBelongId, 
							type: this.option.type,
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "128",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 返回上级页面
			navigateBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pay {
		position: relative;
		.myPurse {
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			padding: 10rpx 30rpx 30rpx 30rpx;
			.myPurse-botsss {
				.myPurse-botsss-tops {
					margin-top: 80rpx;
					font-size: 32rpx;
					color: #333333;
					text-align: center;
				}
				.myPurse-botsss-top {
					font-size: 28rpx;
					font-weight: bold;
					color: #333333;
					text-align: center;
					display: flex;
					justify-content: center;
					align-items: center;
					.myPurse-botsss-top-left {
						font-size: 48rpx;
						font-weight: bold;
						color: #333333;
						margin-right: 16rpx;
					}
					.myPurse-botsss-top-right {
						font-size: 24rpx;
						font-weight: bold;
						color: #FD8624;
					}
				}
				.myPurse-botsss-mid {
					width: 264rpx;
					height: 264rpx;
					margin: 18rpx auto;
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
				.myPurse-botsss-mids {
					width: 300rpx;
					height: 300rpx;
					margin: 18rpx auto;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}
				.myPurse-botsss-bot {
					font-size: 24rpx;
					font-weight: bold;
					color: #FD8624;
					text-align: center;
				}
				.myPurse-botsss-botss {
					font-size: 48rpx;
					font-weight: bold;
					color: #333333;
					text-align: center;
					margin-bottom: 100rpx;
				}
				.myPurse-botsss-bots {
					width: 416rpx;
					height: 80rpx;
					text-align: center;
					line-height: 80rpx;
					background: #FEC24D;
					box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.16);
					border-radius: 40rpx;
					margin: 38rpx 0;
					font-size: 32rpx;
					color: #333333;
				}
			}
			.myPurse-top {
				flex: 0.8;
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.myPurse-top-left {
					height: 42rpx;
					line-height: 42rpx;
					font-size: 32rpx;
					color: #333333;
				}
			}
		}
		.selectTitle {
			width: 100%;
			height: 102rpx;
			text-align: center;
			line-height: 102rpx;
			border-bottom: 2rpx solid #f5f5f5;
			font-size: 36rpx;
			color: #FB6E2F;
		}
		.selectContent {
			width: 100%;
			.selectContent-item {
				width: 93%;
				height: 102rpx;
				margin: 0 auto;
				padding: 26rpx 20rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				border-bottom: 2rpx solid #f5f5f5;
				.zhifu1 {
					font-size: 48rpx;
					color: #40ba49;
				}
				.zhifubao1 {
					font-size: 48rpx;
					color: #2ab4ef;
				}
				.selectContent-item-text {
					font-size: 36rpx;
					color: #333333;
					margin-left: 20rpx;
				}
			}
		}
		.slot-wrap {
			width: 174rpx;
			height: 60rpx;
			background: rgba(255, 255, 255, 0.6);
			border-radius: 60rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			.left {
				width: 70rpx;
				height: 50rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				.big {
					width: 14rpx;
					height: 14rpx;
					border-radius: 50%;
					background: #000;
					margin: 0 5rpx;
				}
				.small {
					width: 10rpx;
					height: 10rpx;
					border-radius: 50%;
					background: #000;
				}
			}
			.right {
				width: 70rpx;
				height: 50rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				.big {
					width: 34rpx;
					height: 34rpx;
					border-radius: 50%;
					background: rgba(255, 255, 255, 0.6);
					border: 4rpx solid #000;
					display: flex;
					justify-content: center;
					align-items: center;
					.small {
						width: 14rpx;
						height: 14rpx;
						border-radius: 50%;
						background: #000;
					}
				}
			}
			.middle {
				width: 1rpx;
				height: 35rpx;
				background: rgba(0, 0, 0, 0.2);
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
		.hintCons {
			top: 10rpx !important;
			text-indent: 2em;
			text-align: left;
			padding: 0 40rpx;
		}
		.hintBtns {
			justify-content: center !important;
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
				height: 80rpx;
				border: 2rpx solid #DDDDDD;
			}
		}
		.pay-content {
			width: 100%;
			padding-bottom: 150rpx;
			.content-conts {
				width: 92%;
				// height: 1040rpx;
				margin: 0 auto;
				margin-top: 30rpx;
				// overflow-y: auto;
				.content-list {
					width: 100%;
					height: 142rpx;
					background: #FFFFFF;
					box-shadow: 0rpx 2rpx 4rpx rgba(0, 0, 0, 0.16);
					border-radius: 8rpx;
					padding: 20rpx 24rpx 8rpx 20rpx;
					margin-bottom: 20rpx;
					.content-list-bot {
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: flex-end;
						height: 42%;
						border-top: 2rpx solid #f5f5f5;
						.content-list-both {
							width: 50%;
							height: 40rpx;
							font-size: 24rpx;
							color: #999999;
						}
					}
					.content-list-top {
						width: 100%;
						height: 58%;
						display: flex;
						justify-content: space-between;
						align-items: flex-start;
						.content-list-text {
							width: 500rpx;
							font-size: 28rpx;
							font-weight: bold;
							line-height: 40rpx;
							color: #333333;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 1;
							-webkit-box-orient: vertical;
						}
						.content-list-btn {
							background: #FFC24D;
							width: 112rpx;
							line-height: 46rpx;
							box-shadow: 0rpx 2rpx 4rpx rgba(0, 0, 0, 0.16);
							border-radius: 8rpx;
							font-size: 24rpx;
							color: #333333;
							text-align: center;
						}
						.content-list-btns {
							background: #DDDDDD; 
							color: #333333;
						}
					}
					
				}
			}
		}
		.payBtn {
			width: 100%;
			position: fixed;
			bottom: 0;
			z-index: 100;
			background-color: #F5F6F7;
			height: 130rpx;
			display: flex;
			justify-content: center;
			align-items: flex-start;
			.payButton {
				margin: 0 auto;
				width: 92%;
				height: 80rpx;
				font-size: 32rpx;
				line-height: 80rpx;
				background: #FEC24D;
				border-radius: 8rpx;
			}
			.submitBtn {
				width: 90%;
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
