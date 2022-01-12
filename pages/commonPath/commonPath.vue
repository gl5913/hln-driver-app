<template>
	<view class="commonPath">
		<u-navbar back-text="" title-color="#333333" title="常用路线" :background="topBackground" :border-bottom="false">
			<view slot="right" class="slot-wrap" @click="goFind">
				找货记录
			</view>
		</u-navbar>
		<view class="kong" :style="{top: `${barheight}px`}">
			<view class="kong-title">
				<view class="kong-title-tit" v-if="pathObj != ''">修改线路</view>
				<view class="kong-title-tit" v-else>添加常用路线</view>
				<view class="kong-title-text">系统会第一时间通知您相关路线货源</view>
			</view>
		</view>
		<view class="pathContent">
			<view class="pathContent-top">
				<view class="pathContent-tit">
					<view class="pathContent-tit-left">
						<Icon :iconType="'iconshezhizhuanghuo1'" extClass="shezhizhuanghuo1"></Icon>
						<view class="pathContent-tit-left-text">请设置装货地</view>
					</view>
					<view class="pathContent-tit-right">
						最多设置3个装货地
					</view>
				</view>
				<view class="pathContent-con">
					<u-select v-model="loadShow1" title="装货地设置" :safe-area-inset-bottom="true" mode="mutil-column-auto" :list="areaList" @confirm="load1"></u-select>
					<view v-if="loadSite1 == ''" class="pathContent-con-btn" @click="loadShow1 = true"> ＋ 请选择 </view>
					<view v-else class="pathContent-con-btns">
						{{ loadSite1.label }}
						<image @click="delLoadSite(1,loadSite1.value)" class="pathContent-close" src="../../static/img30.png"></image>
					</view>
					<u-select v-model="loadShow2" title="装货地设置" :safe-area-inset-bottom="true" mode="mutil-column-auto" :list="areaList" @confirm="load2"></u-select>
					<view v-if="loadSite2 == ''" class="pathContent-con-btn" @click="loadShow2 = true"> ＋ 请选择 </view>
					<view v-else class="pathContent-con-btns">
						{{ loadSite2.label }}
						<image @click="delLoadSite(2,loadSite2.value)" class="pathContent-close" src="../../static/img30.png"></image>
					</view>
					<u-select v-model="loadShow3" title="装货地设置" :safe-area-inset-bottom="true" mode="mutil-column-auto" :list="areaList" @confirm="load3"></u-select>
					<view v-if="loadSite3 == ''" class="pathContent-con-btn" @click="loadShow3 = true"> ＋ 请选择 </view>
					<view v-else class="pathContent-con-btns">
						{{ loadSite3.label }}
						<image @click="delLoadSite(3,loadSite3.value)" class="pathContent-close" src="../../static/img30.png"></image>
					</view>
				</view>
			</view>
			<view class="pathContent-top" style="border-radius: 0rpx 0rpx 20rpx 20rpx; margin: 20rpx 0;">
				<view class="pathContent-tit">
					<view class="pathContent-tit-left">
						<Icon :iconType="'iconshezhixiehuo1'" extClass="shezhixiehuo1"></Icon>
						<view class="pathContent-tit-left-text">请设置卸货地</view>
					</view>
					<view class="pathContent-tit-right">
						最多设置3个卸货地
					</view>
				</view>
				<view class="pathContent-con">
					<u-select v-model="unloadShow1" title="卸货地设置" :safe-area-inset-bottom="true" mode="mutil-column-auto" :list="areaList" @confirm="unload1"></u-select>
					<view v-if="unloadSite1 == ''" class="pathContent-con-btn" @click="unloadShow1 = true"> ＋ 请选择 </view>
					<view v-else class="pathContent-con-btns">
						{{ unloadSite1.label }}
						<image @click="delUnloadSite(1,unloadSite1.value)" class="pathContent-close" src="../../static/img30.png"></image>
					</view>
					<u-select v-model="unloadShow2" title="卸货地设置" :safe-area-inset-bottom="true" mode="mutil-column-auto" :list="areaList" @confirm="unload2"></u-select>
					<view v-if="unloadSite2 == ''" class="pathContent-con-btn" @click="unloadShow2 = true"> ＋ 请选择 </view>
					<view v-else class="pathContent-con-btns">
						{{ unloadSite2.label }}
						<image @click="delUnloadSite(2,unloadSite2.value)" class="pathContent-close" src="../../static/img30.png"></image>
					</view>
					<u-select v-model="unloadShow3" title="卸货地设置" :safe-area-inset-bottom="true" mode="mutil-column-auto" :list="areaList" @confirm="unload3"></u-select>
					<view v-if="unloadSite3 == ''" class="pathContent-con-btn" @click="unloadShow3 = true"> ＋ 请选择 </view>
					<view v-else class="pathContent-con-btns">
						{{ unloadSite3.label }}
						<image @click="delUnloadSite(3,unloadSite3.value)" class="pathContent-close" src="../../static/img30.png"></image>
					</view>
				</view>
			</view>
			<view class="pathContent-bot" @click="carConductorShow = true">
				<view class="pathContent-bot-left">
					<Icon :iconType="'iconxuanzechechangchexing1'" extClass="xuanzechechangchexing1"></Icon>
					<view class="pathContent-bot-left-text" style="font-size: 22rpx;">{{ carContent }}</view>
				</view>
				<view class="pathContent-bot-right">
					选填
				</view>
			</view>
			<u-popup :mask-close-able="false" border-radius="40" v-model="carConductorShow" mode="bottom" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}">
				<view class="carConTit">
					<view class="carConTitBtn" @click="cancel">取消</view>
					<view class="carConTitCon">车型车长</view>
					<view class="carConTitBtn" style="background: #FEC24D;" @click="carAffirm">确认</view>
				</view>
				<chooseBox @clear="clearCarConductorData" :checkData="carConductorCheck" @change='carConductor' :subheadStyles="{fontSize: '24rpx', fontWeight: '400', color: '#999999'}" :titleStyles="{fontSize: '32rpx',fontWeight: '600'}" conFontSize="24" :list="carConductorList" noName="不限车长" subhead="米/最多选3个" title="载货长度" :deleteBtn="true"></chooseBox>
				<chooseBox @clear="clearCarTypeData" :checkData="carTypeCheck" @change='carType' :subheadStyles="{fontSize: '24rpx', fontWeight: '400', color: '#999999'}" :titleStyles="{fontSize: '32rpx',fontWeight: '600'}" conFontSize="24" :list="carTypeList" noName="不限车型" subhead="最多选3个" title="车辆类型" :deleteBtn="true"></chooseBox>
			</u-popup>
		</view>
		<view class="pathBtn">
			<button :disabled="btnAstrict" :class="{loginButton: btnAstrict}" class="pathButton" @click="addDelPath">确认</button>
		</view>

	</view>
</template>

<script>
	import config from '../../service/config.js';
	import ajax from '../../service/ajax.js';
	import moment from 'moment';
	import burying from '../../common/request.js';
	
	export default {
		onLoad(option) {
			// console.log(option);
			// decodeURIComponent 解密传过来的对象字符串
			if(option.item != undefined) {
				let items = JSON.parse(decodeURIComponent(option.item));
				this.pathObj = items;
				// console.log(this.pathObj);
				if(this.pathObj.cargorCarModeNames != null) {
					this.carTypeChecked.carTypeCheckedName = this.pathObj.cargorCarModeNames.map(a => a.label).join('/');
					this.carTypeChecked.carTypeCheckedId = this.pathObj.cargorCarModeNames.map(a => a.value).join(',');
				}
				if(this.pathObj.cargorCarConductorNames != null) {
					this.carConductorChecked.carConductorCheckedName = this.pathObj.cargorCarConductorNames.map(a => a.label).join('/');
					this.carConductorChecked.carConductorCheckedId = this.pathObj.cargorCarConductorNames.map(a => a.value).join(',');
				}
				if(this.pathObj.cargorCarConductorNames == null && this.pathObj.cargorCarModeNames == null) {
					this.carContent = '请选择需要的车长车型';
				} else if(this.pathObj.cargorCarConductorNames == null) {
					let data1 = [];
					this.pathObj.cargorCarModeNames.forEach(item => {
						data1.push(
							{
								name: item.label,
								id: item.value
							}
						)
					})
					this.carType(data1);
					this.carContent = `车型 ${this.carTypeChecked.carTypeCheckedName}`;
				} else if(this.pathObj.cargorCarModeNames == null) {
					let data2 = [];
					this.pathObj.cargorCarConductorNames.forEach(item => {
						data2.push(
							{
								name: item.label,
								id: item.value
							}
						)
					})
					this.carConductor(data2);
					this.carContent = `车长 ${this.carConductorChecked.carConductorCheckedName}米`;
				} else {
					let data3 = [];
					this.pathObj.cargorCarModeNames.forEach(item => {
						data3.push(
							{
								name: item.label,
								id: item.value
							}
						)
					})
					this.carType(data3);
					
					let data4 = [];
					this.pathObj.cargorCarConductorNames.forEach(item => {
						data4.push(
							{
								name: item.label,
								id: item.value
							}
						)
					})
					this.carConductor(data4);
					this.carContent = `车长 ${this.carConductorChecked.carConductorCheckedName}米 车型 ${this.carTypeChecked.carTypeCheckedName}`;
				}
				if(this.pathObj.loadingCityNames[0]) {
					this.loadSite1 = this.pathObj.loadingCityNames[0];
					this.loadingCity.push(this.loadSite1.value);
				}
				if(this.pathObj.loadingCityNames[1]) {
					this.loadSite2 = this.pathObj.loadingCityNames[1];
					this.loadingCity.push(this.loadSite2.value);
				}
				if(this.pathObj.loadingCityNames[2]) {
					this.loadSite3 = this.pathObj.loadingCityNames[2];
					this.loadingCity.push(this.loadSite3.value);
				}
				if(this.pathObj.unloadingCityNames[0]) {
					this.unloadSite1 = this.pathObj.unloadingCityNames[0];
					this.unloadingCity.push(this.unloadSite1.value);
				}
				if(this.pathObj.unloadingCityNames[1]) {
					this.unloadSite2 = this.pathObj.unloadingCityNames[1];
					this.unloadingCity.push(this.unloadSite2.value);
				}
				if(this.pathObj.unloadingCityNames[2]) {
					this.unloadSite3 = this.pathObj.unloadingCityNames[2];
					this.unloadingCity.push(this.unloadSite3.value);
				}
			} else {
				this.pathObj = '';
			}
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "添加或修改常用路线页面加载",
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
				page: "126",
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
				node: "添加或修改常用路线页面显示",
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
				page: "126",
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
				node: "添加或修改常用路线页面卸载",
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
				page: "126",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		data() {
			return {
				barheight: this.statusBar,
				// 修改传递过来的对象
				pathObj: '',
				areaList: this.$store.state.area,
				
				carContent: '请选择需要的车长车型',
				
				// 选中的车长
				carConductorCheck: [
					{
						id: -1,
						name: '不限车长'
					}
				],
				// 选中的车型
				carTypeCheck: [
					{
						id: -1,
						name: '不限车型'
					}
				],
				
				// 车型车长显示
				carConductorShow: false,
				// 车型列表
				carTypeList: [],
				// 车长列表
				carConductorList: [],
				
				// 选中的车长
				carConductorChecked: {
					carConductorCheckedId: '',
					carConductorCheckedName: '',
				},
				// 选中的车型
				carTypeChecked: {
					carTypeCheckedId: '',
					carTypeCheckedName: '',
				},
				
				// 装货地选择
				loadShow1: false,
				loadShow2: false,
				loadShow3: false,
				// 装货地址
				loadSite1: '',
				loadSite2: '',
				loadSite3: '',
				
				// 卸货地选择
				unloadShow1: false,
				unloadShow2: false,
				unloadShow3: false,
				// 卸货地址
				unloadSite1: '',
				unloadSite2: '',
				unloadSite3: '',
				
				// 新增常用线路数据
				loadingCity: [],
				unloadingCity: [],
				
				// 顶部导航的背景
				topBackground: {
					// 渐变色
					backgroundImage: 'linear-gradient(89deg, #FFE14C 0%, #FFC24D 100%)',
				},
				
				// 按钮点击限制
				btnAstrict: false,
			}
		},
		mounted() {
			this.getCarConductor();
			this.getCarType();
		},
		methods: {
			
			// 选中的车辆类型
			carType(e) {
				console.log(e);
				this.carTypeCheck = e;
				this.carTypeChecked.carTypeCheckedName = e.map(a => a.name).join('/');
				this.carTypeChecked.carTypeCheckedId = e.map(a => a.id).join(',');
			},
			
			// 选中的车长
			carConductor(e) {
				console.log(e);
				this.carConductorCheck = e;
				this.carConductorChecked.carConductorCheckedName = e.map(a => a.name).join('/');
				this.carConductorChecked.carConductorCheckedId = e.map(a => a.id).join(',');
			},
			
			// 清除车长
			clearCarConductorData(e) {
				this.carConductorCheck = [
					{
						id: -1,
						name: '不限车长'
					}
				];
				this.carConductorChecked.carConductorCheckedName = '';
				this.carConductorChecked.carConductorCheckedId = '';
			},
			
			// 清除车型
			clearCarTypeData(e) {
				this.carTypeCheck = [
					{
						id: -1,
						name: '不限车型'
					}
				];
				this.carTypeChecked.carTypeCheckedId = '';
				this.carTypeChecked.carTypeCheckedName = '';
			},
			
			// 获取车长列表
			getCarConductor() {
				ajax.get(config.carConductor_url,{
				}).then(res => {
					if(res.code == 0){
						this.carConductorList = res.data;
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取车长列表",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取车长列表(basic-data/car-conductor)",
							// 入参
							enterParams: null,
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "126",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取车长数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取车长列表",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取车长列表(basic-data/car-conductor)",
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "126",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 获取车俩类型列表
			getCarType() {
				ajax.get(config.carModel_url,{
				}).then(res => {
					if(res.code == 0){
						this.carTypeList = res.data;
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取车俩类型列表",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取车俩类型列表(basic-data/car-model)",
							// 入参
							enterParams: null,
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "126",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取车俩类型数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取车俩类型列表",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取车俩类型列表(basic-data/car-model)",
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "126",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			cancel() {
				this.carConductorShow = false;
				this.carContent = '请选择需要的车长车型';
				
				this.carConductorCheck = [
					{
						id: -1,
						name: '不限车长'
					}
				];
				this.carTypeCheck = [
					{
						id: -1,
						name: '不限车型'
					}
				];
				this.carConductorChecked.carConductorCheckedName = '';
				this.carConductorChecked.carConductorCheckedId = '';
				this.carTypeChecked.carTypeCheckedId = '';
				this.carTypeChecked.carTypeCheckedName = '';
			},
			
			// 车型车长及运输性质确认
			carAffirm() {
				if(this.carConductorChecked.carConductorCheckedName && this.carTypeChecked.carTypeCheckedName) {
					this.carConductorShow = false;
					if(this.carConductorChecked.carConductorCheckedName == '不限车长') {
						this.carContent = `车长 ${this.carConductorChecked.carConductorCheckedName} 车型 ${this.carTypeChecked.carTypeCheckedName}`;
					} else {
						this.carContent = `车长 ${this.carConductorChecked.carConductorCheckedName}米 车型 ${this.carTypeChecked.carTypeCheckedName}`;
					}
				} else if(this.carConductorChecked.carConductorCheckedName) {
					this.carConductorShow = false;
					if(this.carConductorChecked.carConductorCheckedName == '不限车长') {
						this.carContent = `车长 ${this.carConductorChecked.carConductorCheckedName}`;
					} else {
						this.carContent = `车长 ${this.carConductorChecked.carConductorCheckedName}米`;
					}
				} else if(this.carTypeChecked.carTypeCheckedName) {
					this.carConductorShow = false;
					this.carContent = `车型 ${this.carTypeChecked.carTypeCheckedName}`;
				} else {
					uni.showToast({ title: "请选择需要的车长车型",icon: "none" ,duration:2000});
				}
			},
			
			// 新增或修改常用线路
			addDelPath() {
				if(this.pathObj == '') {
					if((this.loadSite1 != '' || this.loadSite2 != '' || this.loadSite3 != '') && (this.unloadSite1 != '' || this.unloadSite2 != '' || this.unloadSite3 != '')) {
						this.btnAstrict = true;
						ajax.post(config.distributionLine_url,{
							loadingCity: this.loadingCity.join(','),
							unloadingCity: this.unloadingCity.join(','),
							cargorCarMode: this.carTypeChecked.carTypeCheckedId,
							cargorCarConductor: this.carConductorChecked.carConductorCheckedId,
						}).then(res => {
							if(res.code == 0){
								uni.redirectTo({
									url: "/pages/myPath/myPath"
								})
							} else {
								this.btnAstrict = false;
								uni.showToast({ title: "添加失败",icon: "none" ,duration:2000});
								
								let content = {
									// 动作
									action: "click",
									// 节点
									node: "添加常用路线",
									// 异常信息
									bugInfo: res.msg,
									// 页面参数
									pageParams: null,
									// 接口名称
									intName: "添加常用路线(distribution-hall/distribution-line)",
									// 入参
									enterParams: {
										loadingCity: this.loadingCity.join(','),
										unloadingCity: this.unloadingCity.join(','),
										cargorCarMode: this.carTypeChecked.carTypeCheckedId,
										cargorCarConductor: this.carConductorChecked.carConductorCheckedId,
									},
									// 出参
									outParams: res,
									// 前端编码
									webId: null
								};
								
								let info = {
									operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
									page: "126",
									type: 2,
									content: JSON.stringify(content)
								};
								
								burying.point(info);
							}
						}).catch(err => {
							this.btnAstrict = false;
							console.log("添加常用路线接口数据返回失败 error is :" + err);
							
							let content = {
								// 动作
								action: "click",
								// 节点
								node: "添加常用路线",
								// 异常信息
								bugInfo: err,
								// 页面参数
								pageParams: null,
								// 接口名称
								intName: "添加常用路线(distribution-hall/distribution-line)",
								// 入参
								enterParams: {
									loadingCity: this.loadingCity.join(','),
									unloadingCity: this.unloadingCity.join(','),
									cargorCarMode: this.carTypeChecked.carTypeCheckedId,
									cargorCarConductor: this.carConductorChecked.carConductorCheckedId,
								},
								// 出参
								outParams: null,
								// 前端编码
								webId: null
							};
							
							let info = {
								operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
								page: "126",
								type: 2,
								content: JSON.stringify(content)
							};
							
							burying.point(info);
						})
					} else {
						uni.showToast({ title: "装货地和卸货地为必选",icon: "none" ,duration:2000});
					}
				} else {
					if((this.loadSite1 != '' || this.loadSite2 != '' || this.loadSite3 != '') && (this.unloadSite1 != '' || this.unloadSite2 != '' || this.unloadSite3 != '')) {
						this.btnAstrict = true;
						ajax.put(config.distributionLine_url + `/${this.pathObj.id}`,{
							id: this.pathObj.id,
							loadingCity: this.loadingCity.join(','),
							unloadingCity: this.unloadingCity.join(','),
							cargorCarMode: this.carTypeChecked.carTypeCheckedId,
							cargorCarConductor: this.carConductorChecked.carConductorCheckedId,
						}).then(res => {
							console.log(res);
							if(res.code == 0){
								uni.redirectTo({
									url: "/pages/myPath/myPath"
								})
							} else {
								this.btnAstrict = false;
								uni.showToast({ title: "修改失败",icon: "none" ,duration:2000});
								
								let content = {
									// 动作
									action: "click",
									// 节点
									node: "修改常用路线",
									// 异常信息
									bugInfo: res.msg,
									// 页面参数
									pageParams: null,
									// 接口名称
									intName: "修改常用路线(distribution-hall/distribution-line)",
									// 入参
									enterParams: {
										id: this.pathObj.id,
										loadingCity: this.loadingCity.join(','),
										unloadingCity: this.unloadingCity.join(','),
										cargorCarMode: this.carTypeChecked.carTypeCheckedId,
										cargorCarConductor: this.carConductorChecked.carConductorCheckedId,
									},
									// 出参
									outParams: res,
									// 前端编码
									webId: null
								};
								
								let info = {
									operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
									page: "126",
									type: 2,
									content: JSON.stringify(content)
								};
								
								burying.point(info);
							}
						}).catch(err => {
							this.btnAstrict = false;
							console.log("修改常用路线接口数据返回失败 error is :" + err);
							
							let content = {
								// 动作
								action: "click",
								// 节点
								node: "修改常用路线",
								// 异常信息
								bugInfo: err,
								// 页面参数
								pageParams: null,
								// 接口名称
								intName: "修改常用路线(distribution-hall/distribution-line)",
								// 入参
								enterParams: {
									id: this.pathObj.id,
									loadingCity: this.loadingCity.join(','),
									unloadingCity: this.unloadingCity.join(','),
									cargorCarMode: this.carTypeChecked.carTypeCheckedId,
									cargorCarConductor: this.carConductorChecked.carConductorCheckedId,
								},
								// 出参
								outParams: null,
								// 前端编码
								webId: null
							};
							
							let info = {
								operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
								page: "126",
								type: 2,
								content: JSON.stringify(content)
							};
							
							burying.point(info);
						})
					} else {
						uni.showToast({ title: "装货地和卸货地为必选",icon: "none" ,duration:2000});
					}
				}
			},
			
			// 装货地1选择返回
			load1(obj) {
				console.log(obj);
				if(obj) {
					this.loadSite1 = obj[2];
					this.loadingCity.push(obj[2].value);
				}
			},
			// 装货地2选择返回
			load2(obj) {
				console.log(obj);
				if(obj) {
					this.loadSite2 = obj[2];
					this.loadingCity.push(obj[2].value);
				}
			},
			// 装货地3选择返回
			load3(obj) {
				console.log(obj);
				if(obj) {
					this.loadSite3 = obj[2];
					this.loadingCity.push(obj[2].value);
				}
			},
			// 删除装货地
			delLoadSite(e,id) {
				this.loadingCity.splice(this.loadingCity.indexOf(id), 1);
				if(e == 1) {
					this.loadSite1 = '';
				} else if(e == 2) {
					this.loadSite2 = '';
				} else {
					this.loadSite3 = '';
				}
			},
			
			// 卸货地1选择返回
			unload1(obj) {
				console.log(obj);
				if(obj) {
					this.unloadSite1 = obj[2];
					this.unloadingCity.push(obj[2].value);
				}
			},
			// 卸货地2选择返回
			unload2(obj) {
				console.log(obj);
				if(obj) {
					this.unloadSite2 = obj[2];
					this.unloadingCity.push(obj[2].value);
				}
			},
			// 卸货地3选择返回
			unload3(obj) {
				console.log(obj);
				if(obj) {
					this.unloadSite3 = obj[2];
					this.unloadingCity.push(obj[2].value);
				}
			},
			// 删除卸货地
			delUnloadSite(e,id) {
				this.unloadingCity.splice(this.unloadingCity.indexOf(id), 1);
				if(e == 1) {
					this.unloadSite1 = '';
				} else if(e == 2) {
					this.unloadSite2 = '';
				} else {
					this.unloadSite3 = '';
				}
			},
			
			// 跳转到找货记录
			goFind() {
				uni.navigateTo({
					url: "/pages/findRecord/findRecord"
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到找货记录",
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
					page: "126",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.commonPath {
		.pathContent {
			width: 92%;
			height: 700rpx;
			margin: 0 auto;
			margin-top: 100rpx;
			.content {
				margin: 34rpx 0;
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
						font-size: 32rpx;
						display: flex;
						color: #333333;
						justify-content: center;
						align-items: center;
						margin-right: 16rpx;
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
			.pathContent-top {
				width: 100%;
				height: 178rpx;
				background: #FFFFFF;
				border-radius: 20rpx 20rpx 0rpx 0rpx;
				.pathContent-tit {
					width: 100%;
					height: 40%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.pathContent-tit-left{
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.shezhizhuanghuo1 {
							color: #1bb68a;
							margin: 0rpx 14rpx;
						}
						.shezhixiehuo1 {
							color: #f84f1d;
							margin: 0rpx 14rpx;
						}
						.pathContent-tit-left-text {
							font-size: 28rpx;
							color: #333333;
						}
					}
					.pathContent-tit-right {
						font-size: 20rpx;
						color: #999999;
						margin-right: 16rpx;
					}
				}
				.pathContent-con {
					width: 92%;
					height: 60%;
					border-top: 1rpx solid #f5f5f5;
					margin: 0 auto;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.pathContent-con-btn {
						font-size: 24rpx;
						line-height: 50rpx;
						color: #999999;
						text-align: center;
						width: 200rpx;
						height: 52rpx;
						background: #ffffff;
						border: 1rpx solid #CCCCCC;
						border-radius: 8rpx;
					}
					.pathContent-con-btns {
						width: 200rpx;
						height: 52rpx;
						line-height: 50rpx;
						text-align: center;
						background: #FFF3DB;
						border: 1px solid #CCCCCC;
						border-radius: 8rpx;
						font-size: 24rpx;
						color: #FB6E2F;
						position: relative;
						padding: 0 50rpx 0 10rpx;
						word-break: keep-all;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
						.pathContent-close {
							width: 16rpx;
							height: 16rpx;
							position: absolute;
							top: 50%;
							transform: translateY(-8rpx);
							right: 25rpx;
						}
					}
				}
			}
			.pathContent-bot {
				width: 100%;
				height: 80rpx;
				background: #FFFFFF;
				border-radius: 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.pathContent-bot-left {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.xuanzechechangchexing1 {
						color: #1896db;
						margin: 0rpx 14rpx;
					}
					.pathContent-bot-left-text {
						font-size: 28rpx;
						color: #999999;
					}
				}
				.pathContent-bot-right {
					font-size: 20rpx;
					color: #999999;
					margin-right: 14rpx;
				}
			}
		}
		.pathBtn {
			width: 100%;
			position: fixed;
			bottom: 5%;
			.loginButton {
				background: #DDDDDD !important;
				color: #333333;
			}
			.pathButton {
				margin: 0 auto;
				width: 92%;
				height: 80rpx;
				font-size: 32rpx;
				line-height: 80rpx;
				background: #FEC24D;
				border-radius: 8rpx;
			}
		}
		.slot-wrap {
			font-size: 24rpx;
			color: #333333;
			margin-right: 30rpx;
		}
		.kong {
			width: 100%;
			height: 90rpx;
			background: linear-gradient(89deg, #FFE14C 0%, #FFC24D 100%);
			position: fixed;
			top: 85rpx;
			z-index: 10;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			align-items: center;
			.kong-title {
				width: 100%;
				height: 80rpx;
				background: #F5F6F7;
				border-radius: 40rpx 40rpx 0rpx 0rpx;
				z-index: 2;
				padding: 0 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.kong-title-text {
					font-size: 20rpx;
					color: #FB6E2F;
				}
				.kong-title-tit {
					font-size: 28rpx;
					font-weight: 600;
					color: #333333;
				}
			}
		}
	}
</style>
