<template>
	<view class="addCarBox">
		<u-navbar back-text="" :title="carAuthState == 1 ? '运输认证' : carAuthState == 0 ? '添加我的车辆' : carAuthState == 2 ? plateNumber : ''"></u-navbar>
		
		<view class="addCarCont">
			<view class="addCarCont-tit">行驶证照片</view>
			<view class="autConCon1" v-if="carAuthState != 2">
				<view class="autConConItem4" @click="addImg" data-img="5" v-if="vehiclefaceUrl == ''">点击上传行驶证主本</view>
				<view class="autConConItem3" @click="addImg" data-img="5" v-else>
					<image class="image" :src="vehiclefaceUrl" mode="aspectFit"></image>
				</view>
				<view class="autConConItem5" @click="addImg" data-img="6" v-if="vehiclebaceUrl == ''">点击上传行驶证副本</view>
				<view class="autConConItem3" @click="addImg" data-img="6" v-else>
					<image class="image" :src="vehiclebaceUrl" mode="aspectFit"></image>
				</view>
			</view>
			<view class="autConCon1" v-else>
				<view class="autConConItem3" @click="imgMagnify(0)">
					<image class="image" :src="vehiclefaceUrl" mode="aspectFit"></image>
				</view>
				<view class="autConConItem3" @click="imgMagnify(1)">
					<image class="image" :src="vehiclebaceUrl" mode="aspectFit"></image>
				</view>
			</view>
			<view class="autConCon2" v-if="carAuthState != 2">
				<view class="autConCon2Tit">所有人</view>
				<input style="width: 62%;" class="autConCon2Inp" disabled placeholder-class="inpsty" placeholder="自动获取所有人" type="text" v-model="carName" />
				<view style="width: 10rpx; height: 18rpx;"></view>
			</view>
			<view class="autConCon2" v-if="carAuthState != 2">
				<view class="autConCon2Tit">车牌号码</view>
				<input style="width: 62%;" class="autConCon2Inp" disabled placeholder-class="inpsty" placeholder="自动获取车牌号码" type="text" v-model="carNo" />
				<view style="width: 10rpx; height: 18rpx;"></view>
			</view>
			<view class="autConCon2" v-if="carAuthState != 2">
				<view class="autConCon2Tit">车牌类型</view>
				<input style="width: 62%;" class="autConCon2Inp" disabled placeholder-class="inpsty" placeholder="自动获取车辆类型" type="text" v-model="carTypess" />
				<view style="width: 10rpx; height: 18rpx;"></view>
			</view>
			<view class="autConCon2" @click="carConductorShow = true">
				<text class="autConCon2Tit">车长车型</text>
				<input style="width: 61%;" class="autConCon2Inp" disabled placeholder-class="inpsty" type="text" v-model="vehicletype" placeholder="请选择车长车型">
				<Icon :iconType="'iconfanhuiYou1'" extClass="fanhuiYou1"></Icon>
			</view>
			<view class="autConCon2">
				<text class="autConCon2Tit" style="width: 25%;">运输类型</text>
				<view class="conContent" style="margin-left: 100rpx;">
					<view 
						@click="transportTypeChange(item)" 
						v-for="(item, index) in transportTypeList" :key="index" 
						class="transportType"
						:class="{ checkTransportType: transportTypeCode == item.code }"
					>
						{{item.value}}
					</view>
				</view>
			</view>
			<view v-show="transportTypeCode == 2">
				<view class="autConCon2" @click="temperatureTypeShow = true">
					<text class="autConCon2Tit">温控类型</text>
					<input style="width: 61%;" class="autConCon2Inp" disabled placeholder-class="inpsty" type="text" v-model="temperatureTypeName" placeholder="请选择温控类型">
					<Icon :iconType="'iconfanhuiYou1'" extClass="fanhuiYou1"></Icon>
				</view>
				<view class="autConCon2">
					<text class="autConCon2Tit" style="width: 35%;">是否有侧门</text>
					<view class="conContent" style="margin-left: 50rpx;">
						<view 
							@click="haveSideChange(item)" 
							v-for="(item, index) in haveSideList" :key="index" 
							class="transportType"
							:class="{ checkTransportType: haveSide == item.code }"
						>
							{{item.value}}
						</view>
					</view>
				</view>
				<view class="autConCon2">
					<text class="autConCon2Tit" style="width: 35%;">制冷方式</text>
					<view class="conContent" style="margin-left: 50rpx;">
						<view 
							@click="refrigerationModeChange(item)" 
							v-for="(item, index) in refrigerationModeList" :key="index" 
							class="transportType"
							:class="{ checkTransportType: refrigerationMode == item.code }"
						>
							{{item.value}}
						</view>
					</view>
				</view>
				<view class="autConCon2">
					<view class="autConCon2Tit">制冷机个数</view>
					<input style="width: 62%;" class="autConCon2Inp" disabled placeholder-class="inpsty" placeholder="自动获取制冷机个数" type="text" v-model="machineCount" />
					<view style="width: 10rpx; height: 18rpx;"></view>
				</view>
				<view class="autConCon2">
					<view class="autConCon2Tit">制冷机品牌</view>
					<input style="width: 62%;" class="autConCon2Inp" placeholder-class="inpsty" placeholder="请输入制冷机品牌" type="text" v-model="machineMake" />
					<view style="width: 10rpx; height: 18rpx;"></view>
				</view>
				<view class="autConCon2">
					<view class="autConCon2Tit">制冷机型号</view>
					<input style="width: 62%;" class="autConCon2Inp" placeholder-class="inpsty" placeholder="请输入制冷机型号" type="text" v-model="machineMode" />
					<view style="width: 10rpx; height: 18rpx;"></view>
				</view>
				<view class="orderCont-voucher-cont">
					<view class="addCarCont-tit">从业资格证照片</view>
					<view class="orderCont-voucher-cont-item">
						<view v-if="!qualificationPhoto" style="width: 240rpx; height: 140rpx; border-radius: 20rpx;">
							<view class="orderCont-voucher-cont-item-left" @click="addImg" data-img="7"></view>
						</view>
						<view v-if="qualificationPhoto && carAuthState != 2" @click="addImg" data-img="7" class="orderCont-voucher-cont-item-lefts">
							<image class="image" :src="qualificationPhoto" mode="aspectFit"></image>
						</view>
						<view v-if="qualificationPhoto && carAuthState == 2" class="orderCont-voucher-cont-item-lefts" @click="imgMagnify(2)">
							<image class="image" :src="qualificationPhoto" mode="aspectFit"></image>
						</view>
						<view class="orderCont-voucher-cont-item-rig" @click="addImg" data-img="7" v-if="!qualificationPhoto">
							<view class="orderCont-voucher-cont-item-rig-text" style="font-size: 28rpx; color: #2E95FA;">点击上传 从业资格证照片</view>
							<view class="orderCont-voucher-cont-item-rig-text">证件清晰可见</view>
							<view class="orderCont-voucher-cont-item-rig-text">保证跟驾驶员为同一人</view>
						</view>
						<view class="orderCont-voucher-cont-item-rig" @click="addImg" data-img="7" v-if="qualificationPhoto">
							<view class="orderCont-voucher-cont-item-rig-text" style="font-size: 28rpx; color: #2E95FA;">重新上传 从业资格证照片</view>
							<view class="orderCont-voucher-cont-item-rig-text">证件清晰可见</view>
							<view class="orderCont-voucher-cont-item-rig-text">保证跟驾驶员为同一人</view>
						</view>
					</view>
				</view>
				<view class="orderCont-voucher-cont">
					<view class="addCarCont-tit">交强险保单照片</view>
					<view class="orderCont-voucher-cont-item">
						<view v-if="!insuranceCompulsoryUrl" style="width: 240rpx; height: 140rpx; border-radius: 20rpx;">
							<view class="orderCont-voucher-cont-item-left" @click="addImg" data-img="8"></view>
						</view>
						<view v-if="insuranceCompulsoryUrl && carAuthState != 2" @click="addImg" data-img="8" class="orderCont-voucher-cont-item-lefts">
							<image class="image" :src="insuranceCompulsoryUrl" mode="aspectFit"></image>
						</view>
						<view v-if="insuranceCompulsoryUrl && carAuthState == 2" class="orderCont-voucher-cont-item-lefts" @click="imgMagnify(3)">
							<image class="image" :src="insuranceCompulsoryUrl" mode="aspectFit"></image>
						</view>
						<view class="orderCont-voucher-cont-item-rig" @click="addImg" data-img="8" v-if="!insuranceCompulsoryUrl">
							<view class="orderCont-voucher-cont-item-rig-text" style="font-size: 28rpx; color: #2E95FA;">点击上传 交强险保单照片</view>
							<view class="orderCont-voucher-cont-item-rig-text">保单清晰可见</view>
							<view class="orderCont-voucher-cont-item-rig-text">保证与注册车牌号一致</view>
						</view>
						<view class="orderCont-voucher-cont-item-rig" @click="addImg" data-img="8" v-if="insuranceCompulsoryUrl">
							<view class="orderCont-voucher-cont-item-rig-text" style="font-size: 28rpx; color: #2E95FA;">重新上传 交强险保单照片</view>
							<view class="orderCont-voucher-cont-item-rig-text">保单清晰可见</view>
							<view class="orderCont-voucher-cont-item-rig-text">保证与注册车牌号一致</view>
						</view>
					</view>
				</view>
				<view class="autConCon2">
					<view class="autConCon2Tit">投保日期</view>
					<uni-datetime-picker style="width: 63%;" placeholder="请选择交强险投保日期" type="date" v-model="insuranceDate" :border="false" return-type="string"></uni-datetime-picker>
					<view style="width: 10rpx; height: 18rpx;"></view>
				</view>
				<view class="autConCon2">
					<view class="autConCon2Tit">到期日期</view>
					<uni-datetime-picker style="width: 63%;" placeholder="请选择交强险到期日期" type="date" v-model="insuranceExpireDate" :border="false" return-type="string"></uni-datetime-picker>
					<view style="width: 10rpx; height: 18rpx;"></view>
				</view>
				<view class="autConCon2">
					<view class="autConCon2Tit">年审日期</view>
					<uni-datetime-picker style="width: 63%;" placeholder="请选择年审日期" type="date" v-model="annualReviewDate" :border="false" return-type="string"></uni-datetime-picker>
					<view style="width: 10rpx; height: 18rpx;"></view>
				</view>
			</view>
		</view>
		
		<u-popup border-radius="40" v-model="temperatureTypeShow" mode="bottom" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}">
			<view class="carConTit">
				<view class="carConTitBtn" @click="temperatureCancel">取消</view>
				<view class="carConTitCon">温控类型</view>
				<view class="carConTitBtn" style="background: #FEC24D;" @click="temperatureAffirm">确认</view>
			</view>
			<view class="content">
				<view class="conContent" style="margin-bottom: 50rpx;">
					<view 
						@click="temperatureTypeChange(item)"
						v-for="(item, index) in temperatureTypeList" :key="index" 
						class="carType" 
						:class="{ checkCarType: temperatureTypeCk.indexOf(item) != -1 }">
						{{item.value}}
						<view class="fangkuai" v-if="temperatureTypeCk.indexOf(item) != -1">
							<Icon :iconType="'iconduigouCheng'" extClass="duigouChengss"></Icon>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		
		<u-popup border-radius="40" v-model="carConductorShow" mode="bottom" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}">
			<view class="carConTit">
				<view class="carConTitBtn" @click="cancel">取消</view>
				<view class="carConTitCon">车型车长</view>
				<view class="carConTitBtn" style="background: #FEC24D;" @click="carAffirm">确认</view>
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
						<view class="fangkuai" v-if="carTypeId == item.id">
							<Icon :iconType="'iconduigouCheng'" extClass="duigouChengss"></Icon>
						</view>
					</view>
				</view>
			</view>
			<view class="content">
				<view class="contentCon">
					<view class="title">载货长度</view>
					<view class="titRight">(米/车辆可载部分长度)</view>
				</view>
				<view class="conContent" style="margin-bottom: 20rpx;">
					<view 
						@click="carConductorChange(item)"
						v-for="(item, index) in carConductorList" :key="index"
						class="carType"
						:class="{ checkCarType: carConductorName == item.name }"
					>
						{{item.name}}
						<view class="fangkuai" v-if="carConductorName == item.name">
							<Icon :iconType="'iconduigouCheng'" extClass="duigouChengss"></Icon>
						</view>
					</view>
				</view>
				<view class="length" style="margin-bottom: 44rpx;" @click="show = true" v-show="transportTypeCode == 1">
					<input disabled class="lengthInp" placeholder-class="inpsty" type="text" v-model="carConductorVal" placeholder="手动输入载货长度">
					<text class="unit">米</text>
				</view>
			</view>
		</u-popup>
		
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}"
		 :closeable="false" v-model="lengthShow" mode="center">
			<view class="hintTit">温馨提示</view>
			<view class="hintCon">冷链运输车辆标准不支持自定义车辆长度，请重新选择</view>
			<view class="hintBtn" style="justify-content: center;" @click="lengthShow = false">重新选择</view>
		</u-popup>
		
		<u-keyboard :tips="carConductorVal" :mask-close-able="false" @confirm="inputConfirm" @cancel="inputCan" :safe-area-inset-bottom="true" :mask="false" ref="uKeyboard" @change="valChange" @backspace="backspace" mode="number" v-model="show"></u-keyboard>
		
		<u-modal confirm-text="马上抢单" width="640" v-model="passShow" :show-title="false" :confirm-style="{'background': '#ffffff', 'font-size': '36rpx', 'color': '#F96F2B',}" @confirm="goHall">
			<view class="slot-content">
				<view class="titImg">
					<Icon :iconType="'icontongguo1'" extClass="tongguo1"></Icon>
				</view>
				<view class="title">认证成功</view>
			</view>
		</u-modal>
		
		<u-modal confirm-text="返回" width="640" v-model="failssShow" :show-title="false" :confirm-style="{'border-buttom': '2rpx solid #dddddd', 'font-size': '32rpx', 'color': '#F96F2B',}" @confirm="goBack">
			<view class="slot-content">
				<view class="titImg">
					<Icon :iconType="'iconshibai1'" extClass="shibai1"></Icon>
				</view>
				<view class="title">认证失败，请重新上传相关证件</view>
			</view>
		</u-modal>
		
		<u-modal confirm-text="返回我的车辆" width="640" v-model="succeedShow" :show-title="false" :confirm-style="{'border-buttom': '2rpx solid #dddddd', 'font-size': '32rpx', 'color': '#F96F2B',}" @confirm="goMyCar">
			<view class="slot-content">
				<view class="titImg">
					<Icon :iconType="'icontongguo1'" extClass="tongguo1"></Icon>
				</view>
				<view class="title">车辆添加成功</view>
			</view>
		</u-modal>
		
		<u-modal confirm-text="返回我的车辆" width="640" v-model="failShow" :show-title="false" :confirm-style="{'border-buttom': '2rpx solid #dddddd', 'font-size': '32rpx', 'color': '#F96F2B',}" @confirm="goMyCar">
			<view class="slot-content">
				<view class="titImg">
					<Icon :iconType="'iconshibai1'" extClass="shibai1"></Icon>
				</view>
				<view class="title">车辆添加失败</view>
			</view>
		</u-modal>
		
		<u-modal confirm-text="返回我的车辆" width="640" v-model="alterSucceedShow" :show-title="false" :confirm-style="{'border-buttom': '2rpx solid #dddddd', 'font-size': '32rpx', 'color': '#F96F2B',}" @confirm="goMyCar">
			<view class="slot-content">
				<view class="titImg">
					<Icon :iconType="'icontongguo1'" extClass="tongguo1"></Icon>
				</view>
				<view class="title">车辆修改成功</view>
			</view>
		</u-modal>
		
		<u-modal confirm-text="返回我的车辆" width="640" v-model="alterFailShow" :show-title="false" :confirm-style="{'border-buttom': '2rpx solid #dddddd', 'font-size': '32rpx', 'color': '#F96F2B',}" @confirm="goMyCar">
			<view class="slot-content">
				<view class="titImg">
					<Icon :iconType="'iconshibai1'" extClass="shibai1"></Icon>
				</view>
				<view class="title">车辆修改失败</view>
			</view>
		</u-modal>
		
		<view class="Buttonss">
			<button 
			v-if="transportTypeCode == 1"
			:disabled="
			!vehiclefaceUrl
			|| !vehiclebaceUrl
			|| !vehicletype
			|| btnAstrict" 
			style="background: #FFC24D;" 
			class="submitBtn" 
			:class="{
			loginButton: 
			!vehiclefaceUrl
			|| !vehiclebaceUrl
			|| !vehicletype
			|| btnAstrict
			}" 
			@click="addMyCar">{{ carAuthState == 1 ? '提交审核' : carAuthState == 0 ? '添加' : carAuthState == 2 ? '确认修改' : ''}}</button>
			
			<button
			v-if="transportTypeCode == 2"
			:disabled="
			!vehiclefaceUrl
			|| !vehiclebaceUrl
			|| !vehicletype
			|| !temperatureTypeName
			|| !haveSide
			|| !refrigerationMode
			|| !machineCount
			|| !machineMake
			|| !machineMode
			|| !qualificationPhoto
			|| !insuranceCompulsoryUrl
			|| !insuranceDate
			|| !insuranceExpireDate
			|| !annualReviewDate
			|| btnAstrict" 
			style="background: #FFC24D;" 
			class="submitBtn" 
			:class="{
			loginButton:
			!vehiclefaceUrl
			|| !vehiclebaceUrl
			|| !vehicletype
			|| !temperatureTypeName
			|| !haveSide
			|| !refrigerationMode
			|| !machineCount
			|| !machineMake
			|| !machineMode
			|| !qualificationPhoto
			|| !insuranceCompulsoryUrl
			|| !insuranceDate
			|| !insuranceExpireDate
			|| !annualReviewDate
			|| btnAstrict
			}" 
			@click="addMyCar">{{ carAuthState == 1 ? '提交审核' : carAuthState == 0 ? '添加' : carAuthState == 2 ? '确认修改' : ''}}</button>
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
	
	const txOCR = uni.requireNativePlugin('liyahong-TXOCR')
	export default {
		data() {
			return {
				// 运输类型列表
				transportTypeList: [
					{
						code: 1,
						value: '普货运输'
					},
					{
						code: 2,
						value: '冷链运输'
					}
				],
				// 是否有侧门
				haveSideList: [
					{
						code: '1',
						value: '是'
					},
					{
						code: '0',
						value: '否'
					}
				],
				// 制冷方式
				refrigerationModeList: [
					{
						code: '1',
						value: '单制冷'
					},
					{
						code: '2',
						value: '双制冷'
					}
				],
				// 温控类型列表
				temperatureTypeList: [],
				// 选中温控类型
				temperatureTypeCk: [],
				// 温控类型名字
				temperatureTypeName: '',
				// 温控类型
				temperatureTypeCodes: [],
				// 运输类型
				transportTypeCode: 1,
				// 是否有侧门
				haveSide: '',
				// 制冷方式
				refrigerationMode: '',
				// 制冷机个数
				machineCount: '',
				// 制冷机品牌
				machineMake: '',
				// 制冷机型号
				machineMode: '',
				// 从业资格证照片
				qualificationPhoto: '',
				// 交强险保单照
				insuranceCompulsoryUrl: '',
				// 交强险投保日期
				insuranceDate: '',
				// 交强险到期日期
				insuranceExpireDate: '',
				// 年审日期
				annualReviewDate: '',
				
				
				// 显示温控类型
				temperatureTypeShow: false,
				
				// 图片放大
				imgShow: false,
				currentIndex: 0,
				swiperImages: [],
				
				// 车辆所有人
				carName: '',
				// 车牌号码
				carNo: '',
				// 车辆类型
				carTypess: '',
				
				// 行驶证主页url
				vehiclefaceUrl: '',
				// 行驶证副页Url
				vehiclebaceUrl: '',
				// 车型车长显示
				carConductorShow: false,
				// 车长车型
				vehicletype: '',
				
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
				
				// 认证状态
				carAuthState: null,
				
				// 车牌
				plateNumber: '',
				// 车辆Id
				carId: '',
				
				succeedShow: false,
				failShow: false,
				passShow: false,
				failssShow: false,
				alterSucceedShow: false,
				alterFailShow: false,
				
				// 按钮点击限制
				btnAstrict: false,
				// 数字键盘显示隐藏
				show: false,
				
				// 自定义长度提示
				lengthShow: false,
			}
		},
		onLoad(option) {
			this.carAuthState = option.carAuthState;
			this.carId = option.id;
			this.plateNumber = option.plateNumber;
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "添加我的车辆或运输认证或修改车辆页面加载",
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
				page: "125",
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
				node: "添加我的车辆或运输认证或修改车辆页面显示",
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
				page: "125",
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
				node: "添加我的车辆或运输认证或修改车辆页面卸载",
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
				page: "125",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		created() {
			this.getCarConductor();
			this.getCarType();
		},
		mounted() {
			this.getTransport();
		},
		methods: {
			
			// 选择制冷方式
			refrigerationModeChange(e) {
				console.log(e);
				this.refrigerationMode = e.code;
				this.machineCount = e.code + '个';
			},
			
			// 选择是否有侧门
			haveSideChange(e) {
				console.log(e);
				this.haveSide = e.code;
			},
			
			// 选择运输类型
			transportTypeChange(e) {
				console.log(e);
				this.transportTypeCode = e.code;
				if(this.transportTypeCode == 2 && this.carConductorVal != '') {
					this.lengthShow = true;
					this.vehicletype = '';
					// 选中的车辆类型ID
					this.carTypeId = '';
					this.carTypeName = '';
					// 选中的车长
					this.carConductorName = '';
					// 输入的车长
					this.carConductorVal = '';
				}
			},
			
			// 获取温控类型列表
			getTransport() {
				ajax.get(config.dictionary_url + `/TEMPERATURE_TYPE`,{}).then(res => {
					console.log(res);
					if(res.code == 0){
						this.temperatureTypeList = [];
						res.data.forEach(item => {
							this.temperatureTypeList.push(
								{
									code: Number(item.code),
									value: item.value
								}
							)
						});
						if(this.carAuthState == 2) {
							this.getMyCar(this.carId);
						}
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: null,
							// 节点
							node: "获取温控类型列表",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取温控类型列表(bd/dict-menu)",
							// 入参
							enterParams: null,
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "125",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取温控类型列表接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: null,
						// 节点
						node: "获取温控类型列表",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取温控类型列表(bd/dict-menu)",
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "125",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 选中温控类型
			temperatureTypeChange(e) {
				// 保存items
				if (this.temperatureTypeCk.indexOf(e) === -1) {
					// 不存在,则添加
					this.temperatureTypeCk.push(e);
				} else {
					// 存在,则删除
					this.temperatureTypeCk.splice(this.temperatureTypeCk.indexOf(e), 1);
				}
				console.log(this.temperatureTypeCk);
			},
			
			// 温控类型取消
			temperatureCancel() {
				this.temperatureTypeShow = false;
				this.temperatureTypeCk = [];
				this.temperatureTypeName = '';
				this.temperatureTypeCodes = [];
			},
			
			// 温控类型确认
			temperatureAffirm() {
				let temperatureType = [];
				this.temperatureTypeCodes = [];
				this.temperatureTypeCk.forEach(item => {
					this.temperatureTypeCodes.push(item.code);
					temperatureType.push(item.value);
				})
				this.temperatureTypeName = temperatureType.join('/');
				
				this.temperatureTypeShow = false;
			},
			
			// 图片放大
			imgMagnify(index) {
				this.imgShow = true;
				this.currentIndex = index;
			},
			
			imghide(e) {
				this.imgShow = e;
			},
			
			inputCan() {
				this.carConductorVal = '';
			},
			
			inputConfirm() {
				// 选中的车长
				this.carConductorName = '';
			},
			
			
			// 按键被点击(点击退格键不会触发此事件)
			valChange(val) {
				// 将每次按键的值拼接到value变量中，注意+=写法
				if(this.carConductorVal.length <= 4) {
					this.carConductorVal += val;
				}
				console.log(this.carConductorVal);
			},
			// 退格键被点击
			backspace() {
				// 删除value的最后一个字符
				if(this.carConductorVal.length) this.carConductorVal = this.carConductorVal.substr(0, this.carConductorVal.length - 1);
				console.log(this.carConductorVal);
			},
			
			// 获取修改车辆信息
			getMyCar(id) {
				if(this.carAuthState == 2) {
					ajax.get(config.driverCar_url + `/${id}`,{
					}).then(res => {
						console.log(res);
						if(res.code == 0){
							this.vehiclefaceUrl = res.data.facePath;
							this.vehiclebaceUrl = res.data.backPath;
							this.transportTypeCode = res.data.transportTypeCode;
							this.temperatureTypeCodes = res.data.temperatureTypeCodes ? res.data.temperatureTypeCodes.split(',') : [];
							// this.temperatureTypeValues = res.data.temperatureTypeValues ? res.data.temperatureTypeValues.replace(/,/, '/') : '';
							
							this.temperatureTypeCk = [];
							let temperatureType = [];
							this.temperatureTypeList.forEach(item => {
								this.temperatureTypeCodes.forEach(i => {
									if(item.code == i) {
										temperatureType.push(item.value);
										this.temperatureTypeCk.push(item);
									}
								})
							})
							this.temperatureTypeName = temperatureType.join('/');
							
							this.haveSide = res.data.haveSide;
							this.refrigerationMode = res.data.refrigerationMode;
							this.machineCount = res.data.machineCount ? res.data.machineCount + "个" : '';
							this.machineMake = res.data.machineMake;
							this.machineMode = res.data.machineMode;
							this.qualificationPhoto = res.data.qualificationPhoto;
							this.insuranceCompulsoryUrl = res.data.insuranceCompulsoryUrl;
							this.insuranceDate = res.data.insuranceDate;
							this.insuranceExpireDate = res.data.insuranceExpireDate;
							this.annualReviewDate = res.data.annualReviewDate;
							
							// 图片集合
							if(this.vehiclefaceUrl) {
								this.swiperImages.push(this.vehiclefaceUrl)
							}
							if(this.vehiclebaceUrl) {
								this.swiperImages.push(this.vehiclebaceUrl)
							}
							if(this.qualificationPhoto) {
								this.swiperImages.push(this.qualificationPhoto)
							}
							if(this.insuranceCompulsoryUrl) {
								this.swiperImages.push(this.insuranceCompulsoryUrl)
							}
							
							this.carTypeId = res.data.carModelId;
							this.carTypeName = res.data.carModelName;
							let result = this.carConductorList.find(item =>{
								return item.name == res.data.carConductor;
							});
							console.log(result);
							if(result === undefined) {
								this.carConductorVal = res.data.carConductor;
								this.vehicletype = `${this.carConductorVal}米-${this.carTypeName}`;
							} else {
								this.carConductorName = res.data.carConductor;
								this.vehicletype = `${this.carConductorName}米-${this.carTypeName}`;
							}
						} else {
							console.log(res);
							
							let content = {
								// 动作
								action: null,
								// 节点
								node: "获取修改车辆信息",
								// 异常信息
								bugInfo: res.msg,
								// 页面参数
								pageParams: null,
								// 接口名称
								intName: "获取修改车辆信息(personal-center/face-driver-car)",
								// 入参
								enterParams: {
									id: id
								},
								// 出参
								outParams: res,
								// 前端编码
								webId: "页面内容显示有误"
							};
							
							let info = {
								operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
								page: "125",
								type: 2,
								content: JSON.stringify(content)
							};
							
							burying.point(info);
						}
					}).catch(err => {
						console.log("获取修改车辆信息接口数据返回失败 error is :" + err);
						
						let content = {
							// 动作
							action: null,
							// 节点
							node: "获取修改车辆信息",
							// 异常信息
							bugInfo: err,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取修改车辆信息(personal-center/face-driver-car)",
							// 入参
							enterParams: {
								id: id
							},
							// 出参
							outParams: null,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "125",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					})
				}
			},
			
			// 返回当前页
			goBack() {
				this.failShow = false;
			},
			
			// 车长车型取消
			cancel() {
				this.carConductorShow = false;
				this.vehicletype = '';
				// 选中的车辆类型ID
				this.carTypeId = '';
				this.carTypeName = '';
				// 选中的车长
				this.carConductorName = '';
				// 输入的车长
				this.carConductorVal = '';
			},
			
			// 车型车长确认
			carAffirm() {
				if(this.carConductorVal == '' && this.carConductorName == '') {
					uni.showToast({title:"请选择车长",icon: "none",duration:2000})
				} else {
					if(this.carTypeId == '') {
						uni.showToast({title:"请选择车型",icon: "none",duration:2000})
					} else {
						if(this.carConductorVal != '') {
							this.carConductorName = '';
							this.carConductorShow = false;
							this.vehicletype = `${this.carConductorVal}米-${this.carTypeName}`;
						} else {
							this.carConductorShow = false;
							this.vehicletype = `${this.carConductorName}米-${this.carTypeName}`;
						}
					}
				}
			},
			
			// 返回我的车辆
			goMyCar() {
				uni.navigateBack({
				    delta: 1
				});
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "返回我的车辆",
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
					page: "125",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
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
					node: "确认去配货大厅找货",
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
					page: "125",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 车辆新增和修改车辆
			addMyCar() {
				let carlength;
				if(this.carConductorVal == '') {
					carlength = this.carConductorName;
				} else {
					carlength = this.carConductorVal;
				}
				this.btnAstrict = true;
				if(this.carAuthState == 2) {
					let pamars = {};
					if(this.transportTypeCode == 1) {
						pamars = {
							carConductor: carlength,
							carModelId: this.carTypeId,
							transportTypeCode: this.transportTypeCode
						}
					} else {
						pamars = {
							carConductor: carlength,
							carModelId: this.carTypeId,
							transportTypeCode: this.transportTypeCode,
							temperatureTypeCodes: JSON.stringify(this.temperatureTypeCodes),
							haveSide: this.haveSide,
							refrigerationMode: this.refrigerationMode,
							machineCount: this.machineCount ? this.machineCount.slice(0,this.machineCount.length-1) : '',
							machineMake: this.machineMake,
							machineMode: this.machineMode,
							qualificationPhoto: this.qualificationPhoto,
							insuranceCompulsoryUrl: this.insuranceCompulsoryUrl,
							insuranceDate: this.insuranceDate,
							insuranceExpireDate: this.insuranceExpireDate,
							annualReviewDate: this.annualReviewDate
						}
					}
					console.log(pamars);
					ajax.put(config.driverCar_url + `/${this.carId}`, pamars).then(res => {
						console.log(res);
						if(res.code == 0){
							this.alterSucceedShow = true;
						} else {
							this.alterFailShow = true;
							
							let content = {
								// 动作
								action: null,
								// 节点
								node: "修改车辆",
								// 异常信息
								bugInfo: res.msg,
								// 页面参数
								pageParams: null,
								// 接口名称
								intName: "车辆修改(personal-center/face-driver-car)",
								// 入参
								enterParams: pamars,
								// 出参
								outParams: res,
								// 前端编码
								webId: "无法修改"
							};
							
							let info = {
								operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
								page: "125",
								type: 2,
								content: JSON.stringify(content)
							};
							
							burying.point(info);
						}
					}).catch(err => {
						console.log("车辆修改接口数据返回失败 error is :" + err);
						
						let content = {
							// 动作
							action: null,
							// 节点
							node: "修改车辆",
							// 异常信息
							bugInfo: err,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "车辆修改(personal-center/face-driver-car)",
							// 入参
							enterParams: pamars,
							// 出参
							outParams: null,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "125",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					})
				} else {
					let _pamars = {};
					if(this.transportTypeCode == 1) {
						_pamars = {
							facePath: this.vehiclefaceUrl,
							backPath: this.vehiclebaceUrl,
							carConductor: carlength,
							carModelId: this.carTypeId,
							transportTypeCode: this.transportTypeCode
						}
					} else {
						_pamars = {
							facePath: this.vehiclefaceUrl,
							backPath: this.vehiclebaceUrl,
							carConductor: carlength,
							carModelId: this.carTypeId,
							transportTypeCode: this.transportTypeCode,
							temperatureTypeCodes: JSON.stringify(this.temperatureTypeCodes),
							haveSide: this.haveSide,
							refrigerationMode: this.refrigerationMode,
							machineCount: this.machineCount ? this.machineCount.slice(0,this.machineCount.length-1) : '',
							machineMake: this.machineMake,
							machineMode: this.machineMode,
							qualificationPhoto: this.qualificationPhoto,
							insuranceCompulsoryUrl: this.insuranceCompulsoryUrl,
							insuranceDate: this.insuranceDate,
							insuranceExpireDate: this.insuranceExpireDate,
							annualReviewDate: this.annualReviewDate
						}
					}
					console.log(_pamars);
					ajax.post(config.driverCar_url, _pamars).then(res => {
						console.log(res);
						if(res.code == 0){
							if(this.carAuthState == 1) {
								this.passShow = true;
							} else if(this.carAuthState == 0) {
								this.succeedShow = true;
							}
						} else {
							if(this.carAuthState == 1) {
								this.btnAstrict = false;
								this.failssShow = true;
							} else if(this.carAuthState == 0) {
								this.failShow = true;
							}
							
							let content = {
								// 动作
								action: null,
								// 节点
								node: "新增车辆",
								// 异常信息
								bugInfo: res.msg,
								// 页面参数
								pageParams: null,
								// 接口名称
								intName: "车辆新增(personal-center/face-driver-car)",
								// 入参
								enterParams: _pamars,
								// 出参
								outParams: res,
								// 前端编码
								webId: "无法新增"
							};
							
							let info = {
								operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
								page: "125",
								type: 2,
								content: JSON.stringify(content)
							};
							
							burying.point(info);
						}
					}).catch(err => {
						console.log("车辆新增接口数据返回失败 error is :" + err);
						
						let content = {
							// 动作
							action: null,
							// 节点
							node: "新增车辆",
							// 异常信息
							bugInfo: err,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "车辆新增(personal-center/face-driver-car)",
							// 入参
							enterParams: _pamars,
							// 出参
							outParams: null,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "125",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					})
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
			
			// 获取车长列表
			getCarConductor() {
				ajax.get(config.carConductor_url,{
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						this.carConductorList = res.data;
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: null,
							// 节点
							node: "获取车长",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取车长(basic-data/car-conductor)",
							// 入参
							enterParams: null,
							// 出参
							outParams: res,
							// 前端编码
							webId: "数据无法正常显示"
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "125",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取车长数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: null,
						// 节点
						node: "获取车长",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取车长(basic-data/car-conductor)",
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "125",
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
					console.log(res);
					if(res.code == 0){
						this.carTypeList = res.data;
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: null,
							// 节点
							node: "获取车俩类型",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取车俩类型(basic-data/car-model)",
							// 入参
							enterParams: null,
							// 出参
							outParams: res,
							// 前端编码
							webId: "数据无法正常显示"
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "125",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取车俩类型数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: null,
						// 节点
						node: "获取车俩类型",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取车俩类型(basic-data/car-model)",
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "125",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
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
					uni.hideLoading();
					if(res.code == 0){
						if(type == 5) {
							this.vehiclefaceUrl = res.data.url;
							this.carName = res.data.drivingLicenseDTO.owner;
							this.carNo = res.data.drivingLicenseDTO.plateNumber;
							this.carTypess = res.data.drivingLicenseDTO.vehicleType;
						} else if(type == 6) {
							this.vehiclebaceUrl = res.data.url;
						}
					} else {
						console.log(res);
						if(res.code == -7035 || res.code == -7116) {
							uni.showToast({title: res.msg, icon: "none",duration:2000})
						} else {
							uni.showToast({title:"上传失败,请重新上传", icon: "none",duration:2000})
						}
						
						let content = {
							// 动作
							action: null,
							// 节点
							node: type == 5 ? "上传行驶证正面" : "上传行驶证反面",
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
							page: "125",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					uni.hideLoading();
				    console.log("OSS图片上传接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: null,
						// 节点
						node: type == 5 ? "上传行驶证正面" : "上传行驶证反面",
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
						page: "125",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 订单图片上传
			upload(type, url) {
				uni.showLoading({
					title: '上传中',
					mask: true
				});
				ajax.post(config.fileBase64_url,{
					base64: url,
					bucketName: 'course',
				}).then(res => {
					console.log(res);
					uni.hideLoading();
					if(res.code == 0) {
						if(type == 7) {
							this.qualificationPhoto = res.data;
							if(this.carAuthState == 2) {
								this.swiperImages[2] = this.qualificationPhoto;
							}
						} else {
							this.insuranceCompulsoryUrl = res.data;
							if(this.carAuthState == 2) {
								this.swiperImages[3] = this.insuranceCompulsoryUrl;
							}
						}
					} else {
						uni.showToast({
							title: "图片上传失败，请重新上传",
							icon: "none",
							duration: 2000
						});
					}
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: "图片上传失败，请重新上传",
						icon: "none",
						duration: 2000
					});
				})
			},
			
			ocr(name) {
				let ocrType = "vehicleCardFront"
				if(name == "5"){
					ocrType = 'vehicleCardFront'
				} else if(name == "6"){
					ocrType = 'vehicleCardBack'
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
							let base64Result = result.base64Image;
							this.uploadOss(base64Result, name);
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
				// 行驶证识别走别的路
				if(name == 5 || name == 6){
					console.log("走起")
					this.ocr(name);
				} else {
					uni.chooseImage({
						count: 1, // 默认最多一次选择9张图
						// sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有(如果不设置设置二者都有)
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
										this.upload(name,base64);
									}).catch((err) => {
										console.log(err);
										uni.showToast({title:"上传失败,请重新上传", icon: "none",duration:2000})
									})
								}, (err) => {
									uni.showToast({title:"上传失败,请重新上传", icon: "none",duration:2000})
								});
							} else {//else小于500kb跳过压缩，直接返回现有的url
								pathToBase64(url).then(base64 => {
									this.upload(name,base64);
								}).catch((err) => {
									console.log(err);
									uni.showToast({title:"上传失败,请重新上传", icon: "none",duration:2000})
								})
							}
						}
					})
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.addCarBox {
		width: 100%;
		height: 100%;
		padding-bottom: 180rpx;
		position: relative;
		.hintTit {
			width: 100%;
			text-align: center;
			font-size: 36rpx;
			color: #333333;
			position: relative;
			top: 50rpx;
		}
		
		.hintCon {
			width: 80%;
			margin: 0 auto;
			text-align: center;
			font-size: 32rpx;
			color: #999999;
			position: relative;
			top: 80rpx;
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
				height: 90rpx;
				border: 2rpx solid #DDDDDD;
			}
		}
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
				justify-content: flex-start;
				align-items: center;
				.title {
					font-size: 24rpx;
					color: #333333;
					margin-right: 12rpx;
				}
				.titRight {
					font-size: 20rpx;
					color: #999999;
				}
			}
			.title {
				font-size: 24rpx;
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
			.orderCont-voucher-cont {
				width: 100%;
				background: #ffffff;
				border-radius: 20rpx;
				.orderCont-voucher-cont-item {
					width: 100%;
					border-bottom: 1rpx solid #f5f5f5;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					padding: 40rpx 0;
					.orderCont-voucher-cont-item-rig {
						margin-left: 64rpx;
						.orderCont-voucher-cont-item-rig-text {
							font-size: 24rpx;
							height: 35rpx;
							line-height: 35rpx;
							color: #999999;
						}
					}
					.orderCont-voucher-cont-item-left {
						width: 240rpx;
						height: 140rpx;
						border-radius: 20rpx;
						background: url(../../static/img51.png);
						background-position: center center;
						background-repeat: no-repeat;
						background-size: 100% 100%;
					}
					.orderCont-voucher-cont-item-lefts {
						width: 240rpx;
						height: 140rpx;
						border-radius: 20rpx;
						.image {
							max-width: 240rpx;
							max-height: 140rpx;
						}
					}
				}
			}
			.autConCon2 {
				border-bottom: 2rpx solid #f5f5f5;
				width: 100%;
				height: 82rpx;
				font-size: 28rpx;
				color: #666666;
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				.conContent {
					width: 100%;
					height: 100%;
					margin-left: 110rpx;
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;
					align-items: center;
					.transportType {
						width: 140rpx !important;
						height: 50rpx;
						line-height: 48rpx;
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
					.transportType:nth-of-type(4n){
						margin-right: 0;
					}
					.checkTransportType {
						color: #FB6E2F;
						border: 2rpx solid #FEC24D;
						background: #FFF3DB;
						line-height: 44rpx;
						position: relative;
					}
				}
				.fanhuiYou1 {
					font-size: 20rpx;
					color: #999999;
				}
				.inpsty {
					font-size: 28rpx;
					color: #999999;
				}
				.autConCon2Tit {
					width: 23%;
					height: 38rpx;
					line-height: 38rpx;
				}
				.autConCon2Inp {
					width: 70%;
					font-size: 28rpx;
					margin-left: 30rpx;
					height: 38rpx;
					line-height: 38rpx;
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
				height: 74rpx;
				font-size: 28rpx;
				line-height: 74rpx;
				color: #666666;
			}
			.autConCon1 {
				width: 100%;
				border-bottom: 2rpx solid #f5f5f5;
				height: 244rpx;
				display: flex;
				justify-content: space-around;
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
						max-width: 310rpx;
						max-height: 168rpx;
					}
				}
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
				width: 96%;
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
