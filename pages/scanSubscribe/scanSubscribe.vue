<template>
	<view class="pay">
		<u-navbar :is-back="false" back-text="" title-color="#333333" title="仓库预约" :background="topBackground" :border-bottom="false">
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
		<view class="kong" :style="{top: `${barheight}px`}">
			<view class="kong-title">
				<Icon :iconType="'icontongzhi'" extClass="tongzhi"></Icon>
				<view class="kong-title-text">为了提高运输的高效性，同时方便仓库提前安排装卸货时间
排班。需要你在支付定金后进行冷库站点装卸货时间预约。</view>
			</view>
		</view>
		<view class="pay-content">
			<view class="content-title">
				<u-icon name="map" color="#333333" size="32"></u-icon>
				<view class="content-text">{{ prePlan.repertoryName }}</view>
			</view>
			<view class="content-conts">
				<u-collapse ref="collapseView" :head-style="{'padding': '16rpx 0','borderBottom': '2rpx solid #F5F5F5'}">
					<u-collapse-item title="车辆" style="position: relative;" disabled>
						<view class="contsValue" v-show="prePlan.carNumber">{{ prePlan.carNumber }}</view>
						<view class="conContent">
							<view
								@click="carChange(item)"
								v-for="(item, index) in carList" :key="index" 
								class="carType"
								:class="{ checkCarType: prePlan.carNumber == item.plateNumber }"
							>
								{{ item.plateNumber }}
								<view class="fangkuai" v-if="prePlan.carNumber == item.plateNumber">
									<Icon :iconType="'iconduigouCheng'" extClass="duigouChengss"></Icon>
								</view>
							</view>
						</view>
					</u-collapse-item>
					<u-collapse-item title="司机" style="position: relative;" :disabled="driverList.length == 0">
						<view class="contsValue" v-show="prePlan.driverName">{{ prePlan.driverName }}</view>
						<view class="contsValue" v-show="driverList.length == 0 && prePlan.driverPhone">{{ prePlan.driverPhone }}</view>
						<view class="conContent">
							<view
								@click="driverChange(item)"
								v-for="(item, index) in driverList" :key="index" 
								class="carType2"
								:class="{ checkCarType2: prePlan.driverId == item.id }"
							>
								{{ item.driverName }}
								<view class="fangkuai" v-if="prePlan.driverId == item.id">
									<Icon :iconType="'iconduigouCheng'" extClass="duigouChengss"></Icon>
								</view>
							</view>
						</view>
					</u-collapse-item>
					<u-collapse-item title="预约类型" style="position: relative;">
						<view class="contsValue" v-show="prePlan.inOutType">{{ prePlan.inOutType == 1 ? '卸货' : '装货' }}</view>
						<view class="conContent">
							<view
								@click="inOutTypeChange(item)"
								v-for="(item, index) in inOutTypeList" :key="index" 
								class="carType2"
								:class="{ checkCarType2: prePlan.inOutType == item.inOutTypeId }"
							>
								{{ item.inOutTypeName }}
								<view class="fangkuai" v-if="prePlan.inOutType == item.inOutTypeId">
									<Icon :iconType="'iconduigouCheng'" extClass="duigouChengss"></Icon>
								</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
				<u-cell-group :border="false">
					<u-cell-item :title-style="{color: '#303133'}" :arrow-direction="!dateShow ? 'down' : 'up'" :value-style="{color: '#303133'}" style="padding: 16rpx 20rpx 16rpx 0;" title="预约日期" v-model="prePlan.preDate" @click="dateShow = true"></u-cell-item>
				</u-cell-group>
				<u-cell-group :border="false">
					<u-cell-item :title-style="{color: '#303133'}" :arrow-direction="!platformTimeShow ? 'down' : 'up'" :value-style="{color: '#303133'}" style="padding: 16rpx 20rpx 16rpx 0; position: relative;" title="预约站台及时间" @click="platformTimeOpen">
						<view class="cellItemText" v-if="prePlan.platformName && prePlan.preStartTime && prePlan.preEndTime">
							<view class="cellItemTextTit">{{ prePlan.platformName }}</view>
							<view style="width: 50%; font-size: 26rpx; color: rgb(48, 49, 51);">{{ prePlan.preStartTime }}-{{ prePlan.preEndTime }}</view>
						</view>
					</u-cell-item>
				</u-cell-group>
			</view>
		</view>
		<view class="payBtn">
			<button 
				:disabled="!prePlan.inOutType || !prePlan.carNumber || !prePlan.driverPhone || !prePlan.preTimeName || !prePlan.preDate" 
				style="background: #FFC24D;" 
				class="submitBtn" :class="{loginButton: !prePlan.inOutType || !prePlan.carNumber || !prePlan.driverPhone || !prePlan.preTimeName || !prePlan.preDate}"
				@click="popShow = true"
			>确认</button>
		</view>
		
		<u-popup width="640" height="600" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}"
		:closeable="false" v-model="popShow" mode="center">
			<view class="hintTit" style="top: 0; padding: 13rpx 0; border-bottom: 2rpx solid #DDDDDD;">预约信息</view>
			<u-cell-group :border="false">
				<u-cell-item hover-class="none" :title-style="{color: '#303133'}" :value-style="{color: '#303133'}" :arrow="false" style="padding: 16rpx 30rpx;" title="车辆" v-model="prePlan.carNumber"></u-cell-item>
				<u-cell-item hover-class="none" :title-style="{color: '#303133'}" :value-style="{color: '#303133'}" :arrow="false" style="padding: 16rpx 30rpx;" title="司机" v-model="prePlan.driverName ? prePlan.driverName : prePlan.driverPhone"></u-cell-item>
				<u-cell-item hover-class="none" :title-style="{color: '#303133'}" :value-style="{color: '#303133'}" :arrow="false" style="padding: 16rpx 30rpx;" title="预约类型" v-model="prePlan.inOutType == 1 ? '装货' : '卸货'"></u-cell-item>
				<u-cell-item hover-class="none" :title-style="{color: '#303133'}" :value-style="{color: '#303133'}" :arrow="false" style="padding: 16rpx 30rpx;" title="预约日期" v-model="prePlan.preDate"></u-cell-item>
				<u-cell-item :border-bottom="false" hover-class="none" :title-style="{color: '#303133'}" :value-style="{color: '#303133'}" :arrow="false" style="padding: 16rpx 30rpx; position: relative;" title="预约站台及时间">
					<view class="cellItemText" style="right: 30rpx;" v-if="prePlan.platformName && prePlan.preStartTime && prePlan.preEndTime">
						<view class="cellItemTextTit">{{ prePlan.platformName }}</view>
						<view style="width: 50%; font-size: 26rpx; color: rgb(48, 49, 51);">{{ prePlan.preStartTime }}-{{ prePlan.preEndTime }}</view>
					</view>
				</u-cell-item>
			</u-cell-group>
			<view class="hintBtn">
				<view style="width: 50%;" @click="prePlanHandle">确认预约</view>
				<view class="hintBtnShu"></view>
				<view style="color: #333333; width: 50%;" @click="popShow = false">暂不预约</view>
			</view>
		</u-popup>
		
		<u-calendar v-model="dateShow" mode="date" @change="dateChange" :min-date="minDate" :max-date="maxDate"></u-calendar>
		
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}"
		 :closeable="false" v-model="platShow" mode="center" :mask-close-able="false">
			<view class="hintTit">温馨提示</view>
			<view class="hintCon">当前没有可预约的站台，请联系管理员</view>
			<view class="hintBtn" style="justify-content: center;" @click="navigateBack">返回</view>
		</u-popup>
		
		<u-popup mode="right" length="720" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}"
		 :closeable="false" v-model="platformTimeShow">
			<u-navbar :custom-back="customBack" back-text="" title="预约站台及时间">
				<view slot="right" class="slot-wrap2">
					<view class="carConTitBtn" style="background: #FEC24D;" @click="changePlatformTime">确认</view>
				</view>
			</u-navbar>
			<view class="platformTime-content">
				<view class="platformTime-content-top">
					<view class="platformTime-content-top-left">站台</view>
					<view class="platformTime-content-top-right">
						<text>预约日期</text>
						<text style="margin: 0 30rpx;">{{  prePlan.preDate }}</text>
						<u-icon name="calendar" color="#FEC24D" size="32"></u-icon>
					</view>
				</view>
				<view class="platformTime-content-bot">
					<view class="platformTime-content-left">
						<view 
							@click="platformChange(item)"
							v-for="(item,index) in platformList" :key="index"
							class="carType"
							:class="{ checkCarType: prePlan.platformId == item.platformId }"
						>
							<text class="carTypeText">{{ item.platformName }}
								<view class="optional">{{ item.optional }}</view>
							</text>
						</view>
					</view>
					<view class="platformTime-content-right">
						<view class="conContent">
							<view
								@click="timeChange(item,index)"
								v-for="(item, index) in timeList" :key="index" 
								class="carType2"
								:class="{ checkCarType2: JSON.stringify(prePlan.preTimeScope).indexOf(JSON.stringify(item)) != -1 }"
								:style="[item.state == 2 ? stateStyle : '']"
							>
								{{ item.preTimeName }}
								<view class="fangkuai" v-if="JSON.stringify(prePlan.preTimeScope).indexOf(JSON.stringify(item)) != -1">
									<Icon :iconType="'iconduigouCheng'" extClass="duigouChengss"></Icon>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}"
		 :closeable="false" v-model="limitShow" mode="center" :mask-close-able="false">
			<view class="hintTit" style="top: 50rpx;">温馨提示</view>
			<view class="hintCon" style="top: 75rpx; padding: 0 20rpx;">当前选择的预约日期已预约2次，请重新选择预约日期（每天最多只能预约2次）</view>
			<view class="hintBtn" style="justify-content: center;" @click="reselect">重新选择</view>
		</u-popup>
	</view>
</template>

<script>
	import config from '../../service/config.js';
	import ajax from '../../service/ajax.js';
	import moment from 'moment';
	import burying from '../../common/request.js';
	
	export default {
		data() {
			return {
				dateShow: false,
				
				popShow: false,
				
				barheight: this.statusBar,
				// 顶部导航的背景
				topBackground: {
					// 渐变色
					backgroundImage: 'linear-gradient(89deg, #FFE14C 0%, #FFC24D 100%)',
				},
				
				prePlan: {
					repertoryId: '',
					repertoryName: '',
					carNumber: '',
					preDate: '',
					inOutType: '',
					platformId: '',
					platformName: '',
					preStartTime: '',
					preEndTime: '',
					preTimeName: '',
					preTimeScope: [],
					driverName: '',
					driverPhone: '',
					driverId: '',
				},
				
				// 预约类型列表
				inOutTypeList: [
					{
						inOutTypeId: '2',
						inOutTypeName: '装货'
					},
					{
						inOutTypeId: '1',
						inOutTypeName: '卸货'
					}
				],
				
				// 司机列表
				driverList: [],
				
				// 车辆列表
				carList: [],
				
				// 站台列表
				platformList: [], 
				
				// 时间列表
				timeList: [], 
				
				// 预约站台及时间的显示隐藏
				platformTimeShow: false,
				
				// 提示框显示
				platShow: false,
				
				limitShow: false,
				
				// 站台的时间间隔
				minUnit: 0,
				
				// 车辆所需装卸时间
				needDuration: 0,
				
				// 需要选择的时间段长度
				contNum: 0,
				
				// 最小可预约日期
				minDate: '',
				
				// 最大预约日期
				maxDate: '',
			}
		},
		computed: {
			stateStyle() {
				let color;
				color = '#999999';
				return { color }
			},
		},
		onLoad(option) {
			this.prePlan.repertoryId = option.id;
			this.getMyCar();
			
			this.minDate = moment().format("YYYY-MM-DD");
			let after = moment().add(18250, 'day');
			this.maxDate = moment(after).format("YYYY-MM-DD");
			
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "扫码仓库预约加载",
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
				page: "scanSubscribe.vue",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onShow() {
			this.getRepertory();
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "扫码仓库预约显示",
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
				page: "scanSubscribe.vue",
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
				node: "扫码仓库预约卸载",
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
				page: "scanSubscribe.vue",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		methods: {
			// 重新选择
			reselect() {
				this.prePlan.platformId = '';
				this.prePlan.platformName = '';
				this.prePlan.preTimeScope = [];
				this.prePlan.preTimeName = '';
				
				this.prePlan.preDate = '';
				this.limitShow = false;
			},
			
			// 预约站台及时间返回
			customBack() {
				this.platformTimeShow = false;
				this.prePlan.platformId = '';
				this.prePlan.platformName = '';
				this.prePlan.preTimeScope = [];
				this.prePlan.preTimeName = '';
			},
			
			// 预约站台及时间确认
			changePlatformTime() {
				if(this.prePlan.preTimeScope && this.prePlan.preTimeScope.length > 0) {
					if(this.prePlan.preTimeScope.length == this.contNum) {
						this.prePlan.preStartTime = moment.utc(Math.min.apply(Math,this.prePlan.preTimeScope.map(item => { return moment.duration(item.preStartTime).as('seconds')*1000 }))).format('HH:mm');
						this.prePlan.preEndTime = moment.utc(Math.max.apply(Math,this.prePlan.preTimeScope.map(item => { return moment.duration(item.preEndTime).as('seconds')*1000 }))).format('HH:mm');
						this.prePlan.preTimeName = `${this.prePlan.platformName}  ${this.prePlan.preStartTime}-${this.prePlan.preEndTime}`;
						this.platformTimeShow = false;
						console.log(this.prePlan);
					} else {
						uni.showToast({ title: `您的车辆至少选择${this.contNum}个连续时间段`, icon: "none" ,duration:2000, mask:true});
					}
				} else {
					uni.showToast({ title: "请选择预约站台及时间",icon: "none" ,duration:2000, mask:true});
				}
			},
			
			// 打开预约站台及时间
			platformTimeOpen() {
				console.log(this.timeList);
				if(this.prePlan.inOutType && this.prePlan.preDate) {
					this.platformTimeShow = true;
					this.getInterval();
				} else {
					uni.showToast({ title: "请先选择预约类型及日期",icon: "none" ,duration:2000, mask:true});
				}
			},
			
			// 添加无订单预约计划
			prePlanHandle() {
				console.log(this.prePlan);
				let parmas = Object.assign({},this.prePlan);
				if(parmas.preTimeScope && parmas.preTimeScope.length > 0) {
					let _preTimeScope = [];
					parmas.preTimeScope.forEach(item => {
						_preTimeScope.push(item.preTimeName);
					})
					parmas.preTimeScope = JSON.stringify(_preTimeScope);
				} else {
					delete parmas.preTimeScope;
				}
				delete parmas.driverId;
				delete parmas.driverName;
				delete parmas.preTimeName;
				delete parmas.repertoryName;
				delete parmas.platformName;
				console.log(parmas);
				ajax.post(config.tempDriver_url, {...parmas}).then(res => {
					console.log(res);
					if (res.code == 0) {
						uni.showToast({
							title: "预约成功",
							icon: "none",
							duration: 1000
						});
						setTimeout(() => {
							uni.redirectTo({
								url: "/pages/bookingHall/bookingHall" + `?plateNumber=${this.prePlan.carNumber}`
							})
						},1000)
					} else {
						this.popShow = false;
						if(res.code == -8061) {
							this.limitShow = true;
						} else if(res.code == -8023) {
							uni.showToast({
								title: "预约时间段已被占用，请选择其他时间段",
								icon: "none",
								duration: 2000
							});
						} else if(res.code == -8052) {
							uni.showToast({
								title: "对不起！您的车辆不符合冷链运输标准，无法承接冷链货物运输，请前往“我的”--“车辆管理”进行冷链运输认证！",
								icon: "none",
								duration: 2000
							});
						}
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "添加无订单预约计划",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "添加无订单预约计划(temp/add-temp-pre-by-driver)",
							// 入参
							enterParams: parmas,
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "scanSubscribe.vue",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("添加预约计划数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "添加无订单预约计划",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "添加无订单预约计划(temp/add-temp-pre-by-driver)",
						// 入参
						enterParams: parmas,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "scanSubscribe.vue",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 选中的站台
			platformChange(e) {
				console.log(e);
				this.prePlan.platformId = e.platformId;
				this.prePlan.platformName = e.platformName;
				this.prePlan.preTimeScope = [];
				this.minUnit = e.minUnit;
				this.contNum = Number(this.needDuration)/Number(this.minUnit);
				this.platformList.forEach(item => {
					if(item.platformId == e.platformId) {
						this.timeList = e.timeList;
					}
				});
			},
			
			// 选中的时间
			timeChange(e,index) {
				console.log(e);
				if(e.state == 1) {
					if (JSON.stringify(this.prePlan.preTimeScope).indexOf(JSON.stringify(e)) === -1) {
						// 不存在,则添加
						if(this.prePlan.preTimeScope.length === 0) {
							this.prePlan.preTimeScope.push(e);
						} else if(this.prePlan.preTimeScope.length > 0 && this.prePlan.preTimeScope.length !== this.contNum) {
							console.log(this.prePlan.preTimeScope);
							console.log(this.timeList.length - 1);
							let timeIndex = this.prePlan.preTimeScope.findIndex((item) => {
								if(index === item.index + 1 || index === item.index - 1) {
									if(index === 0) {
										return e.preEndTime === this.prePlan.preTimeScope[this.prePlan.preTimeScope.length - 1].preStartTime;
									} else if(index === this.timeList.length - 1) {
										return e.preStartTime === this.prePlan.preTimeScope[this.prePlan.preTimeScope.length - 1].preEndTime;
									} else {
										return e.preEndTime === this.prePlan.preTimeScope[this.prePlan.preTimeScope.length - 1].preStartTime || e.preStartTime === this.prePlan.preTimeScope[this.prePlan.preTimeScope.length - 1].preEndTime;
									}
								}
							});
							if(timeIndex === -1) {
								uni.showToast({ title: "请选择连续时间段",icon: "none" ,duration:2000, mask:true});
							} else {
								this.prePlan.preTimeScope.push(e);
								if (this.prePlan.preTimeScope.length > this.contNum) {
									this.prePlan.preTimeScope.splice(0, 1);
								}
							}
						} else if(this.prePlan.preTimeScope.length === this.contNum) {
							uni.showToast({ title: `您的车辆只能选择${this.contNum}个连续时间段`, icon: "none" ,duration:2000, mask:true});
						}
					} else {
						// 存在,则删除
						if(this.prePlan.preTimeScope.length < 3) {
							this.prePlan.preTimeScope.splice(this.prePlan.preTimeScope.indexOf(e), 1);
						} else {
							let timeIndex1 = Math.min.apply(Math, this.prePlan.preTimeScope.map(function(o) {return o.index}));
							let timeItem = {};
							this.prePlan.preTimeScope.forEach(item => {
								if(item.index == timeIndex1) {
									timeItem = item;
								}
							})
							console.log(timeIndex1);
							this.prePlan.preTimeScope.splice(this.prePlan.preTimeScope.indexOf(timeItem), 1);
						}
					}
					console.log(this.prePlan.preTimeScope);
				}
			},
			
			// 获取预约时间段
			getInterval() {
				ajax.get(config.coldInterval_url + `/${this.prePlan.repertoryId}`, {
					preDate: this.prePlan.preDate,
					type: this.prePlan.inOutType
				}).then(res => {
					console.log(res);
					if (res.code == 0) {
						res.data.forEach(item => {
							item.optional = 0;
							item.timeList.forEach((i,index) => {
								i.preTimeName = `${i.preStartTime}-${i.preEndTime}`;
								i.index = index;
								if(i.state == 1) {
									item.optional ++;
								}
							})
						});
						
						this.platformList = res.data;
						
						if(!this.prePlan.platformId) {
							this.platformChange(this.platformList[0]);
						}
						
						this.$nextTick(() => {
							this.$refs.collapseView.init();
						});
					} else {
						if(res.code == -8032 || res.code == -8025) {
							uni.showToast({
								title: "该仓库暂无可预约站台及时间",
								icon: "none",
								duration: 2000
							});
						}
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取预约时间段",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取预约时间段(driver/pre/interval)",
							// 入参
							enterParams: {
								preDate: this.prePlan.preDate,
								type: this.prePlan.inOutType
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "scanSubscribe.vue",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取预约时间段数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取预约时间段",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取预约时间段(driver/pre/interval)",
						// 入参
						enterParams: {
							preDate: this.prePlan.preDate,
							type: this.prePlan.inOutType
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "scanSubscribe.vue",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 选中的预约类型
			inOutTypeChange(e) {
				this.prePlan.inOutType = e.inOutTypeId;
				
				this.prePlan.platformId = '';
				this.prePlan.platformName = '';
				this.prePlan.preTimeScope = [];
				this.prePlan.preTimeName = '';
			},
			
			// 选中预约日期
			dateChange(e) {
				console.log(e);
				this.prePlan.preDate = e.result;
				
				this.prePlan.platformId = '';
				this.prePlan.platformName = '';
				this.prePlan.preTimeScope = [];
				this.prePlan.preTimeName = '';
			},
			
			// 选中司机
			driverChange(e) {
				console.log(e);
				this.prePlan.driverId = e.id;
				this.prePlan.driverName = e.driverName;
				this.prePlan.driverPhone = e.driverPhone;
			},
			
			// 选中车辆
			carChange(e) {
				console.log(e);
				this.prePlan.carNumber = e.plateNumber;
			},
			
			// 返回上级页面
			navigateBack() {
				uni.navigateBack();
			},
			
			// 获取我的信息
			getMyInfo() {
				ajax.get(config.userMess_url,{
					type: 2,
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						this.prePlan.driverPhone = res.data.phone;
					} else {
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
							page: "scanSubscribe.vue",
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
						page: "scanSubscribe.vue",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 获取司机列表
			getDriver() {
				ajax.get(config.driverNeed_url, {
					carNumber: this.carList[0].plateNumber,
					repertoryId: this.prePlan.repertoryId,
					carLength: this.carList[0].carConductor
				}).then(res => {
					console.log(res);
					if (res.code == 0) {
						this.needDuration = res.data.needDuration;
						if(res.data.list && res.data.list.length > 0) {
							this.driverList = res.data.list;
						} else {
							this.getMyInfo();
						}
						this.$nextTick(() => {
							this.$refs.collapseView.init();
						});
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取司机列表",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取司机列表(temp/get-need-duration)",
							// 入参
							enterParams: {
								carNumber: this.carList[0].plateNumber,
								repertoryId: 1,
								carLength: this.carList[0].carConductor
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "scanSubscribe.vue",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取司机列表数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取司机列表",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取司机列表(temp/get-need-duration)",
						// 入参
						enterParams: {
							carNumber: this.carList[0].plateNumber,
							repertoryId: 1,
							carLength: this.carList[0].carConductor
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "scanSubscribe.vue",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 获取我的车辆列表
			getMyCar() {
				ajax.get(config.driverCar_url,{}).then(res => {
					console.log(res);
					if(res.code == 0){
						this.carList = res.data;
						this.prePlan.carNumber = res.data[0].plateNumber;
						this.getDriver();
						this.$nextTick(() => {
							this.$refs.collapseView.init();
						});
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取我的车辆列表",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取我的车辆列表(personal-center/face-driver-car)",
							// 入参
							enterParams: null,
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "scanSubscribe.vue",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取我的车辆列表接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取我的车辆列表",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取我的车辆列表(personal-center/face-driver-car)",
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "scanSubscribe.vue",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 获取仓库
			getRepertory() {
				ajax.get(config.repertory_url + `/${this.prePlan.repertoryId}`,{}).then(res => {
					console.log(res);
					if(res.code == 0){
						this.prePlan.repertoryName = res.data.repertoryName;
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取仓库",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取仓库(temp/get-repertory)",
							// 入参
							enterParams: {
								id: this.prePlan.repertoryId
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "scanSubscribe.vue",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取仓库接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取仓库",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取仓库(temp/get-repertory)",
						// 入参
						enterParams: {
							id: this.prePlan.repertoryId
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "scanSubscribe.vue",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.pay {
		position: relative;
		.cellItemText {
			width: 380rpx;
			height: 100%;
			display: flex;
			align-items: center;
			position: absolute;
			top: 0;
			right: 60rpx;
			.cellItemTextTit {
				width: 50%;
				font-size: 26rpx; 
				color: rgb(48, 49, 51);
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
			}
		}
		.slot-wrap2 {
			margin-right: 30rpx;
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
		}
		.platformTime-content {
			width: 100%;
			height: calc(100% - 80rpx);
			.platformTime-content-top {
				width: 100%;
				height: 5%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.platformTime-content-top-left {
					width: 30%;
					height: 100%;
					line-height: 2.5;
					font-size: 26rpx;
					background: #F5F6F7;
					text-align: center;
				}
				.platformTime-content-top-right {
					width: 70%;
					height: 100%;
					line-height: 2.5;
					font-size: 26rpx;
					background: #ffffff;
					text-align: left;
					padding: 0 36rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
				}
			}
			.platformTime-content-bot {
				width: 100%;
				height: 95%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.platformTime-content-left {
					width: 30%;
					height: 100%;
					background: #F5F6F7;
					.carType {
						width: 100%;
						padding: 0 5rpx;
						height: 60rpx;
						line-height: 60rpx;
						background: #F5F6F7;
						border-radius: 8rpx;
						font-size: 26rpx;
						text-align: center;
						color: #333333;
						margin-right: 16rpx;
						position: relative;
						.carTypeText {
							position: relative;
							padding: 0 15rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 1;
							-webkit-box-orient: vertical;
							width: 95%;
							.optional {
								width: 40rpx;
								height: 20rpx;
								line-height: 20rpx;
								font-size: 20rpx;
								text-align: left;
								color: #E2934A;
								position: absolute;
								font-weight: 600;
								top: 0;
								right: -12rpx;
							}
						}
					}
					.carType:nth-of-type(2n){
						margin-right: 0;
					}
					.checkCarType {
						// color: #FB6E2F;
						background: #FFFFFF;
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
				.platformTime-content-right {
					width: 70%;
					height: 100%;
					overflow-y: auto;
					padding: 20rpx 36rpx;
					.conContent{
						display: flex;
						justify-content: flex-start;
						flex-wrap: wrap;
						align-items: center;
						.carType2 {
							width: 203rpx !important;
							margin-top: 16rpx;
							padding: 0 5rpx;
							height: 60rpx;
							line-height: 60rpx;
							background: #F1F2F6;
							border-radius: 8rpx;
							font-size: 24rpx;
							text-align: center;
							color: #333333;
							margin-right: 28rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 1;
							-webkit-box-orient: vertical;
						}
						.carType2:nth-of-type(2n){
							margin-right: 0;
						}
						.checkCarType2 {
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
		.hintBtn {
			width: 100%;
			height: 90rpx;
			line-height: 90rpx;
			// border-top: 2rpx solid #DDDDDD;
			text-align: center;
			font-size: 32rpx;
			color: #F96F2B;
			border-radius: 0;
			background: #ffffff;
			position: absolute;
			bottom: 0;
		}
		.pay-content {
			margin: 100rpx auto 0 auto;
			.content-title {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding: 0 30rpx;
				height: 40rpx;
			}
			.content-text {
				font-size: 28rpx;
				font-family: PingFang SC;
				color: #333333;
				margin-left: 4rpx;
				line-height: 1.2;
			}
			.content-conts {
				background: #fff;
				margin: 18rpx 30rpx;
				box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.16);
				border-radius: 8rpx;
				padding: 0 10rpx 0 20rpx;
				.cellItemText {
					width: 380rpx;
					height: 100%;
					display: flex;
					align-items: center;
					position: absolute;
					top: 0;
					right: 60rpx;
					.cellItemTextTit {
						width: 50%;
						font-size: 26rpx; 
						color: rgb(48, 49, 51);
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
					}
				}
				.contsValue {
					position: absolute;
					top: 18rpx;
					right: 57rpx;
					width: 250rpx;
					text-align: right;
					font-size: 26rpx;
					color: #333333;
					pointer-events: none;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
				}
				.conContent {
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;
					align-items: center;
					.carType {
						width: 315rpx !important;
						margin-top: 16rpx;
						padding: 0 5rpx;
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
					.carType:nth-of-type(2n){
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
					.carType2 {
						width: 207rpx !important;
						margin-top: 16rpx;
						padding: 0 5rpx;
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
					.carType2:nth-of-type(3n){
						margin-right: 0;
					}
					.checkCarType2 {
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
		}
		.payBtn {
			width: 100%;
			position: fixed;
			bottom: 5%;
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
				position: absolute;
				left: 5%;
				bottom: 8%;
				color: #333333;
			}
			.loginButton {
				background: #DDDDDD !important;
				color: #333333;
			}
		}
		.kong {
			width: 100%;
			height: 70rpx;
			background: linear-gradient(89deg, #FFE14C 0%, #FFC24D 100%);
			position: fixed;
			top: 88rpx;
			z-index: 10;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			align-items: center;
			.kong-title {
				width: 100%;
				height: 80rpx;
				background: #F7ECD5;
				border-radius: 40rpx 40rpx 0rpx 0rpx;
				z-index: 2;
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				.tongzhi {
					font-size: 30rpx;
					color: #FB6E2F;
					margin: 0 12rpx 0 20rpx;
				}
				.kong-title-text {
					font-size: 20rpx;
					color: #FB6E2F;
					height: 50rpx;
					line-height: 24rpx;
					margin: 10rpx 24rpx 0 0;
				}
			}
		}
	}
</style>
