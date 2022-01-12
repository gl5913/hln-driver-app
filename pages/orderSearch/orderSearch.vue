<template>
	<view class="myOrder">
		<u-navbar z-index="90" is-back="false" title="" :border-bottom="false">
			<view class="slot-wrap">
				<u-search :show-action="false" placeholder="搜索货主/货主手机号" @search="search" v-model="goodsSearch"></u-search>
			</view>
		</u-navbar>
		
		<view class="orderTop" :style="{top: `${barheight}px`}">
			<u-cell-group>
				<u-cell-item :value-style="{fontSize: '24rpx'}" style="height: 80rpx;" title="装货地" :value="loadingTit" @click="popupShow(1)"></u-cell-item>
				<u-cell-item :value-style="{fontSize: '24rpx'}" style="height: 80rpx;" title="卸货地" :value="unloadingTit" @click="popupShow(2)"></u-cell-item>
				<u-cell-item :value-style="{fontSize: '24rpx'}" style="height: 80rpx;" title="创建时间" :value="dataRange" @click="popupShow(3)"></u-cell-item>
			</u-cell-group>
			<view class="timeLabel">
				<button class="timeLabel-item" :class="[btnChange == 1 ? 'timeLabel-itemss' : '' ]" @click="btnChangess(1)">1个月内</button>
				<button class="timeLabel-item" :class="[btnChange == 2 ? 'timeLabel-itemss' : '' ]" @click="btnChangess(2)">3个月内</button>
				<button class="timeLabel-item" :class="[btnChange == 3 ? 'timeLabel-itemss' : '' ]" @click="btnChangess(3)">6个月内</button>
			</view>
		</view>
		
		<!-- 日期范围 -->
		<uni-calendar :range="true" ref="calendar" :insert="false" @confirm="timeChange"></uni-calendar>
		
		<!-- <u-calendar :closeable="false" btn-type="warning" range-bg-color="#fcefe7" active-bg-color="#eca81f" border-radius="40" v-model="timeShow" mode="range" @change="timeChange">
			<view slot="tooltip" class="carConTit">
				<view class="carConTitBtn" @click="timeShow = false">取消</view>
				<view class="carConTitCon">请选择日期范围</view>
				<view class="carConTitBtn" style="background: #FEC24D;" @click="loadClear">重置</view>
			</view>
		</u-calendar> -->
		
		<!-- 装货地 -->
		<u-popup @close="loadClose" border-radius="40" v-model="loadShow" mode="bottom" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}">
			<view class="carConTit">
				<view class="carConTitBtn" @click="loadClear">重置</view>
				<view class="carConTitCon">装货地选择</view>
				<view class="carConTitBtn" style="background: #FEC24D;" @click="loadClose">确认</view>
			</view>
			<view class="ranking-slot-title" v-if="showPlace != 1">
				<view class="indexes">
					<view class="indexesTit">选择：{{ loadingItem }}</view>
					<view class="indexesBtn" @click="back(1)">返回上一级</view>
				</view>
			</view>
			<view class="ranking-slot-content">
				<view class="conContent" :class="{conContents: showPlace == 1}">
					<view 
						@click="siteChange(1,1,item)" 
						v-for="(item, index) in nationwideList" :key="item.name" 
						class="carType"
						:class="{ checkCarType: nationwideObj.id == item.id }"
						v-if="showPlace == 1"
					>
						{{item.name}}
					</view>
					<view
						@click="siteChange(1,2,item)" 
						v-for="(item, index) in provinceList" :key="item.name" 
						class="carType"
						:class="{ checkCarType: provinceObj.id == item.id }"
						v-if="showPlace == 2"
					>
						{{item.name}}
					</view>
					<view
						@click="siteChange(1,3,item)" 
						v-for="(item, index) in cityList" :key="item.name" 
						class="carType"
						:class="{ checkCarType: cityObj.id == item.id }"
						v-if="showPlace == 3"
					>
						{{item.name}}
					</view>
				</view>
			</view>
		</u-popup>
		
		<!-- 卸货地 -->
		<u-popup @close="unloadClose" border-radius="40" v-model="unloadShow" mode="bottom" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}">
			<view class="carConTit">
				<view class="carConTitBtn" @click="unloadClear">重置</view>
				<view class="carConTitCon">卸货地选择</view>
				<view class="carConTitBtn" style="background: #FEC24D;" @click="unloadClose">确认</view>
			</view>
			<view class="ranking-slot-title" v-if="unshowPlace != 1">
				<view class="indexes">
					<view class="indexesTit">选择：{{ unloadingItem }}</view>
					<view class="indexesBtn" @click="back(2)">返回上一级</view>
				</view>
			</view>
			<view class="ranking-slot-content">
				<view class="conContent" :class="{conContents: unshowPlace == 1}">
					<view 
						@click="siteChange(2,1,item)" 
						v-for="(item, index) in nationwideList" :key="item.name" 
						class="carType"
						:class="{ checkCarType: unnationwideObj.id == item.id }"
						v-if="unshowPlace == 1"
					>
						{{item.name}}
					</view>
					<view
						@click="siteChange(2,2,item)" 
						v-for="(item, index) in provinceList" :key="item.name" 
						class="carType"
						:class="{ checkCarType: unprovinceObj.id == item.id }"
						v-if="unshowPlace == 2"
					>
						{{item.name}}
					</view>
					<view
						@click="siteChange(2,3,item)" 
						v-for="(item, index) in cityList" :key="item.name" 
						class="carType"
						:class="{ checkCarType: uncityObj.id == item.id }"
						v-if="unshowPlace == 3"
					>
						{{item.name}}
					</view>
				</view>
			</view>
		</u-popup>
		
		<view class="order-cont" :style="{marginTop: `${height}px`}">
			<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<orderList @relation="telShow" :item="item" :faceState="faceState" v-for="(item,index) of allOrderList" :key="index"></orderList>
			</mescroll-body>
		</view>
		
		<phoneList :phoneLists="phoneLists" @change='phonehide' v-if="phoneShow" :phoneShow="phoneShow"></phoneList>
		
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import config from '../../service/config.js';
	import ajax from '../../service/ajax.js';
	import moment from 'moment';
	import burying from '../../common/request.js';
	
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				barheight: this.statusBar,
				height: null,
				
				displayNone: {
					display: 'none'
				},
				
				// 禁用按钮
				btnChange: 0,
				
				// 搜索内容
				goodsSearch: null,
				
				// 订单列表
				allOrderList: [],
				
				// 联系电话列表
				phoneLists: [],
				
				// 联系电话列表显示
				phoneShow: false,
				
				// 当前页数
				pageIndex: 1,
				// 当前页面行数
				pageSize: 10,
				// 总数据量
				total: 0,
				upOption:{
					empty:{
						tip: '~ 搜索无结果 ~', // 提示
					},
					textNoMore: '--- 没有更多 ---',
					auto: false,
					isLock: true
				},
				downOption: {
					auto: false,
					isLock: true
				},
				
				faceState: '-1',
				
				searchObj: {
					startTime: '',
					endTime: '',
					timeType: '',
					startProId: '',
					startCityId: '',
					startAreaId: '',
					endProId: '',
					endCityId: '',
					endAreaId: ''
				},
				
				// 全省列表
				nationwideList: [
					{
						name: '全国',
						id: -1,
					}
				],
				
				// 全市列表
				provinceList: [
					{
						name: '全省',
						id: -1,
					}
				],
				
				// 全区列表
				cityList: [
					{
						name: '全市',
						id: -1,
					}
				],
				
				// 标题
				loadingTit: '请选择装货地',
				unloadingTit: '请选择卸货地',
				dataRange: '请选择日期范围',
				
				// 选中的全国装货地
				nationwideObj: {
					id: '',
					name: ''
				},
				// 选中的全省装货地
				provinceObj: {
					id: -1,
					name: '全省'
				},
				// 选中的全市装货地
				cityObj: {
					id: -1,
					name: '全市'
				},
				
				// 选中的全国卸货地
				unnationwideObj: {
					id: '',
					name: ''
				},
				// 选中的全省卸货地
				unprovinceObj: {
					id: -1,
					name: '全省'
				},
				// 选中的全市卸货地
				uncityObj: {
					id: -1,
					name: '全市'
				},
				
				// 装货地显示
				loadShow: false,
				// 卸货地显示
				unloadShow: false,
				// 日历显示
				timeShow: false,
				
				// 装货地显示全国/全省/全市
				showPlace: 1,
				// 卸货地显示全国/全省/全市
				unshowPlace: 1,
				
				// 装货地选择的索引
				loadingItem: '',
				// 卸货地选择的索引
				unloadingItem: '',
				
				scroll: '',
				// 滚动方向
				scrollDir: 2,
				
				canReset: false,
			}
		},
		onLoad() {
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "搜索我的订单页面加载",
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
				page: "108",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onShow() {
			this.canReset && this.mescroll.resetUpScroll();
			this.canReset && this.mescroll.scrollTo(0,0);
			this.canReset = true;
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "搜索我的订单页面显示",
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
				page: "108",
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
				node: "搜索我的订单页面卸载",
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
				page: "108",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onPageScroll(e) {  
		    let that = this;  
		    if(that.scroll > e.scrollTop){  
				this.scrollDir = 2;
		    } else {
				if(that.scroll == 0) {
					this.scrollDir = 2;
				} else {
					this.scrollDir = 1;
				}
		    }  
		    that.scroll = e.scrollTop;  
		},
		mounted() {
			this.getProvince(-1,1);
			this.getHeight();
		},
		methods: {
			// 上拉加载的回调
			upCallback(page) {
				if(this.goodsSearch || this.searchObj.startTime || this.searchObj.endTime || this.searchObj.timeType || this.searchObj.startProId || 
					this.searchObj.startCityId || this.searchObj.startAreaId || this.searchObj.endProId || this.searchObj.endCityId || this.searchObj.endAreaId
				) {
					this.mescroll.lockDownScroll(false);
					this.mescroll.lockUpScroll(false);
					let pageNum = page.num; // 页码, 默认从1开始
					let pageSize = page.size; // 页长, 默认每页10条
					ajax.get(config.order_url,{
						pageIndex: pageNum,
						pageSize: pageSize,
						faceState: this.faceState,
						selectType: 1,
						
						param: this.goodsSearch,
						startTime: this.searchObj.startTime,
						endTime: this.searchObj.endTime,
						timeType: this.searchObj.timeType,
						startProId: this.searchObj.startProId,
						startCityId: this.searchObj.startCityId,
						startAreaId: this.searchObj.startAreaId,
						endProId: this.searchObj.endProId,
						endCityId: this.searchObj.endCityId,
						endAreaId: this.searchObj.endAreaId,
					}).then(res => {
						// console.log(res);
						if(res.code == 0){
							let curPageData = res.data.list;
							let curPageLen = res.data.list.length;
							let hasNext = res.data.hasNextPage;
							
							if(page.num == 1) this.allOrderList = []; //如果是第一页需手动置空列表
							this.allOrderList = this.allOrderList.concat(curPageData); //追加新数据
							this.mescroll.endSuccess(curPageLen, hasNext);
						} else {
							this.mescroll.endErr();
							console.log(res);
							
							let content = {
								// 动作
								action: "click",
								// 节点
								node: "获取搜索订单列表",
								// 异常信息
								bugInfo: res.msg,
								// 页面参数
								pageParams: null,
								// 接口名称
								intName: "获取搜索订单列表(order-management/freight-shipping-order)",
								// 入参
								enterParams: {
									pageIndex: pageNum,
									pageSize: pageSize,
									faceState: this.faceState,
									selectType: 1,
									
									param: this.goodsSearch,
									startTime: this.searchObj.startTime,
									endTime: this.searchObj.endTime,
									timeType: this.searchObj.timeType,
									startProId: this.searchObj.startProId,
									startCityId: this.searchObj.startCityId,
									startAreaId: this.searchObj.startAreaId,
									endProId: this.searchObj.endProId,
									endCityId: this.searchObj.endCityId,
									endAreaId: this.searchObj.endAreaId,
								},
								// 出参
								outParams: res,
								// 前端编码
								webId: null
							};
							
							let info = {
								operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
								page: "108",
								type: 2,
								content: JSON.stringify(content)
							};
							
							burying.point(info);
						}
					}).catch(err => {
						this.mescroll.endErr();
						console.log("获取搜索订单列表数据返回失败 error is :" + err);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取搜索订单列表",
							// 异常信息
							bugInfo: err,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取搜索订单列表(order-management/freight-shipping-order)",
							// 入参
							enterParams: {
								pageIndex: pageNum,
								pageSize: pageSize,
								faceState: this.faceState,
								selectType: 1,
								
								param: this.goodsSearch,
								startTime: this.searchObj.startTime,
								endTime: this.searchObj.endTime,
								timeType: this.searchObj.timeType,
								startProId: this.searchObj.startProId,
								startCityId: this.searchObj.startCityId,
								startAreaId: this.searchObj.startAreaId,
								endProId: this.searchObj.endProId,
								endCityId: this.searchObj.endCityId,
								endAreaId: this.searchObj.endAreaId,
							},
							// 出参
							outParams: null,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "108",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					})
				}
			},
			
			btnChangess(index) {
				this.btnChange = index;
				this.searchObj.timeType = index;
				this.searchObj.startTime = '';
				this.searchObj.endTime = '';
				this.dataRange = '请选择日期范围';
				this.allOrderList = [];
				this.mescroll.resetUpScroll();
			},
			
			// 关闭遮罩和下拉菜单
			loadClose() {
				if(this.loadingTit != '请选择装货地') {
					this.loadShow = false;
					this.allOrderList = [];
					this.mescroll.resetUpScroll();
				}
			},
			
			// 关闭遮罩和下拉菜单
			unloadClose() {
				if(this.unloadingTit != '请选择卸货地') {
					this.unloadShow = false;
					this.allOrderList = [];
					this.mescroll.resetUpScroll();
				}
			},
			
			// 装货地重置
			loadClear() {
				this.loadingTit = '请选择装货地';
				// 选中的全国装货地
				this.nationwideObj = {
					id: '',
					name: ''
				};
				// 选中的全省装货地
				this.provinceObj = {
					id: -1,
					name: '全省'
				};
				// 选中的全市装货地
				this.cityObj = {
					id: -1,
					name: '全市'
				};
				// 装货地显示全国/全省/全市
				this.showPlace = 1;
				// 装货地选择的索引
				this.loadingItem = '';
				this.searchObj.startProId = '';
				this.searchObj.startCityId = '';
				this.searchObj.startAreaId = '';
				this.allOrderList = [];
				this.mescroll.resetUpScroll();
			},
			
			// 卸货地重置
			unloadClear() {
				this.unloadingTit = '请选择装货地';
				// 选中的全国装货地
				this.unnationwideObj = {
					id: '',
					name: ''
				};
				// 选中的全省装货地
				this.unprovinceObj = {
					id: -1,
					name: '全省'
				};
				// 选中的全市装货地
				this.uncityObj = {
					id: -1,
					name: '全市'
				};
				// 装货地显示全国/全省/全市
				this.unshowPlace = 1;
				// 装货地选择的索引
				this.unloadingItem = '';
				this.searchObj.endProId = '';
				this.searchObj.endCityId = '';
				this.searchObj.endAreaId = '';
				this.allOrderList = [];
				this.mescroll.resetUpScroll();
			},
			
			// 动态获取高度
			getHeight() {
				setTimeout(() => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.orderTop').boundingClientRect(data => {
						this.height = data.height;
						console.log(this.height);
					}).exec();
				},300)
			},
			
			// 联系货主
			telShow(e) {
				this.getPhoneList(e);
				this.phoneShow = true;
			},
			
			// 关闭联系号码列表
			phonehide(e) {
				this.phoneShow = e;
			},
			
			timeChange(e) {
				this.searchObj.timeType = '';
				this.btnChange = 0;
				this.searchObj.startTime = e.range.before;
				this.searchObj.endTime = e.range.after;
				this.dataRange = e.range.before + ' 至 ' + e.range.after;
				this.allOrderList = [];
				this.mescroll.resetUpScroll();
			},
			
			// 返回上一级
			back(type) {
				if(type == 1) {
					if (this.showPlace == 2) {
						this.showPlace = 1;
						this.loadingTit = this.nationwideObj.name;
						this.provinceObj = {
							id: -1,
							name: '全省'
						};
					} else if(this.showPlace == 3) {
						this.cityObj = {
							id: -1,
							name: '全市'
						};
						this.showPlace = 2;
						this.loadingTit = this.provinceObj.name;
						this.loadingItem = this.nationwideObj.name + '-' + this.provinceObj.name;
					}
				} else {
					if (this.unshowPlace == 2) {
						this.unshowPlace = 1;
						this.unloadingTit = this.unnationwideObj.name;
						this.unprovinceObj = {
							id: -1,
							name: '全省'
						};
					} else if(this.unshowPlace == 3) {
						this.uncityObj = {
							id: -1,
							name: '全市'
						};
						this.unshowPlace = 2;
						this.unloadingTit = this.unprovinceObj.name;
						this.unloadingItem = this.unnationwideObj.name + '-' + this.unprovinceObj.name;
					}
				}
			},
			
			// 获取省/市/区
			getProvince($parentId,$type) {
				ajax.get(config.region_url,{
				  parentId: $parentId,
				  type: $type
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						if($type == 1) {
							this.nationwideList = [
								{
									name: '全国',
									id: -1,
								}
							];
							res.data.forEach(item => {
								this.nationwideList.push(item);
							});
						} else if($type == 2) {
							this.provinceList = [
								{
									name: '全省',
									id: -1,
								}
							];
							res.data.forEach(item => {
								this.provinceList.push(item);
							});
						} else if($type == 3) {
							this.cityList = [
								{
									name: '全市',
									id: -1,
								}
							];
							res.data.forEach(item => {
								this.cityList.push(item);
							});
						}
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取省/市/区",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取省/市/区(basic-data/region)",
							// 入参
							enterParams: {
								parentId: $parentId,
								type: $type
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "108",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取获取省/市/区接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取省/市/区",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取省/市/区(basic-data/region)",
						// 入参
						enterParams: {
							parentId: $parentId,
							type: $type
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "108",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 选中装卸地
			siteChange(type,index,val) {
				console.log(val);
				if(type == 1) {
					if(index == 1) {
						this.loadingTit = val.name;
						this.nationwideObj = val;
						if(val.id == -1) {
							this.searchObj.startProId = -1;
							this.searchObj.startCityId = '';
							this.searchObj.startAreaId = '';
							this.loadShow = false;
							this.allOrderList = [];
							this.mescroll.resetUpScroll();
						} else {
							this.searchObj.startProId = val.id;
							this.searchObj.startCityId = '';
							this.searchObj.startAreaId = '';
							this.loadingItem = val.name;
							this.showPlace = 2;
							this.getProvince(val.uid,index+1);
						}
					} else if(index == 2) {
						this.provinceObj = val;
						if(val.id == -1) {
							this.loadShow = false;
							this.allOrderList = [];
							this.searchObj.startProId = this.nationwideObj.id;
							this.searchObj.startCityId = '';
							this.searchObj.startAreaId = '';
							this.loadingItem = this.nationwideObj.name;
							this.loadingTit = this.nationwideObj.name;
							this.mescroll.resetUpScroll();
						} else {
							this.searchObj.startProId = '';
							this.searchObj.startCityId = val.id;
							this.searchObj.startAreaId = '';
							this.loadingTit = val.name;
							this.loadingItem = this.nationwideObj.name + '-' + val.name;
							this.showPlace = 3;
							this.getProvince(val.uid,index+1);
						}
					} else if(index == 3) {
						this.allOrderList = [];
						this.cityObj = val;
						if(val.id == -1) {
							this.searchObj.startProId = '';
							this.searchObj.startCityId = this.provinceObj.id;
							this.searchObj.startAreaId = '';
							this.loadingItem = this.nationwideObj.name + '-' + this.provinceObj.name;
							this.loadingTit = this.provinceObj.name;
						} else {
							this.searchObj.startProId = '';
							this.searchObj.startCityId = '';
							this.searchObj.startAreaId = val.id;
							this.loadingTit = val.name;
							this.loadingItem = this.nationwideObj.name + '-' + this.provinceObj.name + '-' + val.name;
							this.showPlace = 3;
						}
						this.loadShow = false;
						this.mescroll.resetUpScroll();
					}
				} else {
					if(index == 1) {
						this.unloadingTit = val.name;
						this.unnationwideObj = val;
						if(val.id == -1) {
							this.searchObj.endProId = -1;
							this.searchObj.endCityId = '';
							this.searchObj.endAreaId = '';
							this.unloadShow = false;
							this.allOrderList = [];
							this.mescroll.resetUpScroll();
						} else {
							this.searchObj.endProId = val.id;
							this.searchObj.endCityId = '';
							this.searchObj.endAreaId = '';
							this.unloadingItem = val.name;
							this.unshowPlace = 2;
							this.getProvince(val.uid,index+1);
						}
					} else if(index == 2) {
						this.unprovinceObj = val;
						if(val.id == -1) {
							this.searchObj.endProId = this.unnationwideObj.id;
							this.searchObj.endCityId = '';
							this.searchObj.endAreaId = '';
							this.unloadingItem = this.unnationwideObj.name;
							this.allOrderList = [];
							this.unloadingTit = this.unnationwideObj.name;
							this.unloadShow = false;
							this.mescroll.resetUpScroll();
						} else {
							this.searchObj.endProId = '';
							this.searchObj.endCityId = val.id;
							this.searchObj.endAreaId = '';
							this.unloadingTit = val.name;
							this.unloadingItem = this.unnationwideObj.name + '-' + val.name;
							this.unshowPlace = 3;
							this.getProvince(val.uid,index+1);
						}
					} else if(index == 3) {
						this.allOrderList = [];
						this.uncityObj = val;
						if(val.id == -1) {
							this.searchObj.endProId = '';
							this.searchObj.endCityId = this.unprovinceObj.id;
							this.searchObj.endAreaId = '';
							this.unloadingItem = this.unnationwideObj.name + '-' + this.unprovinceObj.name;
							this.unloadingTit = this.unprovinceObj.name;
						} else {
							this.searchObj.endProId = '';
							this.searchObj.endCityId = '';
							this.searchObj.endAreaId = val.id;
							this.unloadingTit = val.name;
							this.unloadingItem = this.unnationwideObj.name + '-' + this.unprovinceObj.name + '-' + val.name;
							this.unshowPlace = 3;
						}
						this.unloadShow = false;
						this.mescroll.resetUpScroll();
					}
				}
			},
			
			// 弹框
			popupShow(index) {
				if(index == 1) {
					this.loadShow = true;
				} else if(index == 2) {
					this.unloadShow = true;
				} else if(index == 3) {
					// this.timeShow = true;
					this.$refs.calendar.open();
				}
			},
			
			// 获取电话列表
			getPhoneList(phone) {
				ajax.get(config.phoneList_url,{
					username: phone
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						this.phoneLists = res.data;
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
							page: "108",
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
						page: "108",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 打电话
			ringUp(phone) {
				uni.makePhoneCall({
				    phoneNumber: phone
				});
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "联系货主",
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
					page: "108",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 搜索订单
			search() {
				this.allOrderList = [];
				this.mescroll.resetUpScroll();
			},
		}
	}
</script>

<style scoped lang="scss">
	.myOrder {
		.order-cont {
			width: 100%;
			margin-top: 460rpx;
		}
		.orderTop {
			width: 100%;
			position: fixed;
			top: 88rpx;
			z-index: 10;
			.timeLabel {
				width: 100%;
				height: 80rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 38rpx;
				background: #ffffff;
				.timeLabel-item {
					width: 200rpx;
					height: 55rpx;
					background: #f3f3f3;
					font-size: 23rpx;
					line-height: 55rpx;
					text-align: center;
					border-radius: 55rpx;
				}
				.timeLabel-item::after { border: none }
				.timeLabel-itemss {
					background: #FFC24D !important;
				}
			}
		}
		.ranking-slot-content {
			background: #ffffff;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-bottom: 15rpx;
			border-radius: 0 0 40rpx 40rpx;
			.conContents {
				border-top: 1rpx solid #f5f5f5;
			}
			.conContent {
				width: 92%;
				background: #ffffff;
				display: flex;
				margin-bottom: 30rpx;
				padding-top: 10rpx;
				align-items: center;
				flex-wrap: wrap;
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
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					&:not(:nth-child(4n)) {
					  margin-right: 16rpx; 
					}
				}
				.checkCarType {
					color: #FB6E2F;
					background: url(../../static/img19.png);
					background-position: center center;
					background-repeat: no-repeat;
					background-size: 100% 100%;
				}
			}
			.rankingItem {
				width: 92%;
				height: 66rpx;
				border-top: 1rpx solid #f5f5f5;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 28rpx;
				padding: 0 10rpx;
				.duigouCheng {
					font-size: 22rpx;
					color: #fd8624;
				}
				.rankingColor {
					color: #FB6E2F;
				}
			}
		}
		.ranking-slot-title {
			background: #ffffff;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			.indexes {
				width: 92%;
				background: #ffffff;
				padding: 10rpx 0 0 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-top: 1rpx solid #f5f5f5;
				.indexesTit {
					font-size: 20rpx;
					color: #333333;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
				}
				.indexesBtn {
					font-size: 20rpx;
					color: #FD8624;
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
		.slot-wrap {
			display: flex;
			align-items: center;
			/* 如果您想让slot内容占满整个导航栏的宽度 */
			flex: 1;
		}
		.site-content {
			margin: 32rpx auto auto auto;
			width: 94%;
			height: 364rpx;
			background: #ffffff;
			border-radius: 20rpx;
			box-shadow: 0 0 10rpx #bfbfbf;
			.site-content-top {
				width: 100%;
				height: 284rpx;
				padding: 24rpx 20rpx;
				position: relative;
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				.site-content-top-right {
					.site-content-top-right-both {
						font-size: 24rpx;
						color: #333333;
						height: 130rpx;
						.site-content-top-right-both-text {
							font-size: 20rpx;
							color: #999999;
						}
						view {
							height: 32rpx;
							line-height: 32rpx;
						}
					}
				}
				.site-content-top-left {
					width: 5%;
					height: 100%;
					margin-right: 12rpx;
					padding-bottom: 70rpx;
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					align-items: center;
					.site-content-top-left-both {
						width: 32rpx;
						height: 32rpx;
						background: #1bb68a;
						border-radius: 50%;
						line-height: 32rpx;
						text-align: center;
						font-size: 16rpx;
						color: #ffffff;
					}
				}
				.listTop-right {
					width: 160rpx;
					height: 44rpx;
					text-align: center;
					line-height: 44rpx;
					background: #FFF3DB;
					border-radius: 0rpx 20rpx 0rpx 20rpx;
					font-size: 20rpx;
					font-weight: 600;
					color: #FB6E2F;
					position: absolute;
					top: 0;
					right: 0;
				}
			}
			.site-content-bot {
				width: 100%;
				height: 80rpx;
				background: #f0f0f0;
				border-radius: 0 0 20rpx 20rpx;
				.listBots {
					width: 100%;
					height: 100%;
					margin: 0 auto;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.listBots-left {
						margin-left: 20rpx;
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
						width: 100rpx;
						height: 80rpx;
						background: #E8E8E8;
						border-radius: 0rpx 0rpx 20rpx 0rpx;
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
	}
</style>

