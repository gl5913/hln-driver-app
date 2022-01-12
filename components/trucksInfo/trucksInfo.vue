<template>
	<view>
		<u-popup @close="change" class="trucksInfo" width="640" height="886" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.6)'}"
		 :closeable="true" v-model="infoShow" mode="center">
			<view class="infoTitle">货车导航</view>
			<view class="infoContent">
				<u-form :error-type="errorType" :model="form" ref="uForm">
					<u-form-item prop="carNo" :label-style="{'font-size': '24rpx', 'font-weight': '600', 'width': '120rpx'}" style="height: 80rpx; padding: 0;" label="车牌号码">
						<u-input @click="carNoShow = true" disabled placeholder="请输入车牌" placeholder-style="font-size: 24rpx;" :custom-style="{'font-size': '24rpx', 'margin-left': '40rpx', height: '80rpx'}" v-model="form.carNo" />
					</u-form-item>
					<u-form-item prop="carType" :label-style="{'font-size': '24rpx', 'font-weight': '600', 'width': '120rpx'}" style="height: 80rpx; padding: 0;" label="货车类型" right-icon="arrow-down">
						<u-input @click="carTypeShow = true" disabled placeholder="请选择货车类型" placeholder-style="font-size: 22rpx;" :custom-style="{'font-size': '24rpx', 'margin-left': '40rpx', height: '80rpx'}" v-model="form.carType" />
					</u-form-item>
					<u-form-item prop="carAllWeight" :label-style="{'font-size': '24rpx', 'font-weight': '600', 'width': '120rpx'}" style="height: 80rpx; padding: 0;" label="总重量">
						<u-input @click="carAllWeightShow = true" disabled placeholder="0~100 吨" placeholder-style="font-size: 22rpx;" :custom-style="{'font-size': '24rpx', 'margin-left': '40rpx', height: '80rpx'}" v-model="form.carAllWeight" />
					</u-form-item>
					<u-form-item prop="carLoad" :label-style="{'font-size': '24rpx', 'font-weight': '600', 'width': '120rpx'}" style="height: 80rpx; padding: 0;" label="核定载重">
						<u-input @click="carLoadShow = true" disabled placeholder="0~100 吨" placeholder-style="font-size: 22rpx;" :custom-style="{'font-size': '24rpx', 'margin-left': '40rpx', height: '80rpx'}" v-model="form.carLoad" />
					</u-form-item>
					<u-form-item prop="carLength" :label-style="{'font-size': '24rpx', 'font-weight': '600', 'width': '120rpx'}" style="height: 80rpx; padding: 0;" label="车长" right-icon="arrow-down">
						<u-input @click="carLengthShow = true" disabled placeholder="0~25 米" placeholder-style="font-size: 22rpx;" :custom-style="{'font-size': '24rpx', 'margin-left': '40rpx', height: '80rpx'}" v-model="form.carLength" />
					</u-form-item>
					<u-form-item prop="carWide" :label-style="{'font-size': '24rpx', 'font-weight': '600', 'width': '120rpx'}" style="height: 80rpx; padding: 0;" label="车宽" right-icon="arrow-down">
						<u-input @click="carWideShow = true" disabled placeholder="0~5 米" placeholder-style="font-size: 22rpx;" :custom-style="{'font-size': '24rpx', 'margin-left': '40rpx', height: '80rpx'}" v-model="form.carWide" />
					</u-form-item>
					<u-form-item prop="carHigh" :label-style="{'font-size': '24rpx', 'font-weight': '600', 'width': '120rpx'}" style="height: 80rpx; padding: 0;" label="车高" right-icon="arrow-down">
						<u-input @click="carHighShow = true" disabled placeholder="0~10 米" placeholder-style="font-size: 22rpx;" :custom-style="{'font-size': '24rpx', 'margin-left': '40rpx', height: '80rpx'}" v-model="form.carHigh" />
					</u-form-item>
					<u-form-item prop="carAxle" :label-style="{'font-size': '24rpx', 'font-weight': '600', 'width': '120rpx'}" style="height: 80rpx; padding: 0;" label="轴数" right-icon="arrow-down">
						<u-input @click="carAxleShow = true" disabled placeholder="请选择货车轴数(用于计算过路费及限重)" placeholder-style="font-size: 22rpx;" :custom-style="{'font-size': '24rpx', 'margin-left': '40rpx', height: '80rpx'}" v-model="form.carAxle" />
					</u-form-item>
				</u-form>
			</view>
			<view class="infoBtn">
				<view class="infoBtns" @click="navigationOpenMap">跳过配置</view>
				<view class="infoBtnshu"></view>
				<view class="infoBtns" style="color: #F96F2B;" @click="submit">开始导航</view>
			</view>
		</u-popup>
		
		<u-keyboard @confirm="carNoConfirm" :tips="form.carNo" :mask-close-able="false" :mask="false" ref="carNoKeyboard" mode="car" v-model="carNoShow" @change="carNoChange" @backspace="carNoBackspace"></u-keyboard>
		<u-select @confirm="carTypeConfirm" :mask-close-able="false" title="货车类型" v-model="carTypeShow" :list="carTypeList"></u-select>
		<u-keyboard @confirm="carAllWeightConfirm" :tips="form.carAllWeight" :mask-close-able="false" :mask="false" ref="carAllWeightKeyboard" mode="number" v-model="carAllWeightShow" @change="carAllWeightChange" @backspace="carAllWeightBackspace"></u-keyboard>
		<u-keyboard @confirm="carLoadConfirm" :tips="form.carLoad" :mask-close-able="false" :mask="false" ref="carLoadKeyboard" mode="number" v-model="carLoadShow" @change="carLoadChange" @backspace="carLoadBackspace"></u-keyboard>
		<u-select @confirm="carLengthConfirm" :mask-close-able="false" title="车辆长度" :default-value="[3,0]" mode="mutil-column-auto" v-model="carLengthShow" :list="carLengthList"></u-select>
		<u-select @confirm="carWideConfirm" :mask-close-able="false" title="车辆宽度" :default-value="[1,5]" mode="mutil-column-auto" v-model="carWideShow" :list="carWideList"></u-select>
		<u-select @confirm="carHighConfirm" :mask-close-able="false" title="车辆高度" :default-value="[3,5]" mode="mutil-column-auto" v-model="carHighShow" :list="carHighList"></u-select>
		<u-select @confirm="carAxleConfirm" :mask-close-able="false" title="车辆轴数" mode="mutil-column-auto" v-model="carAxleShow" :list="carAxleList"></u-select>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	var sdkwx = uni.requireNativePlugin('AMap-NavSdkWX');
	// #endif
	export default {
		props: {
			trucksShow: {
				type: Boolean,
				required: true
			},
			// 数据列表
			itemLists: {
				type: Array,
				required: true
			},
			// 导航类型
			itemType: {
				type: Number,
				required: true
			},
		},
		data() {
			return {
				
				infoShow: this.trucksShow,
				// 车牌键盘显示
				carNoShow: false,
				// 总重量键盘显示
				carAllWeightShow: false,
				// 载荷重量键盘显示
				carLoadShow: false,
				// 车辆轴数显示
				carAxleShow: false,
				// 车辆轴数列表
				carAxleList: [
					{
						value: '1',
						label: '1轴'
					},
					{
						value: '2',
						label: '2轴'
					},
					{
						value: '3',
						label: '3轴'
					},
					{
						value: '4',
						label: '4轴'
					},
					{
						value: '5',
						label: '5轴'
					},
					{
						value: '6',
						label: '6轴'
					},
					{
						value: '7',
						label: '6轴以上'
					}
				],
				// 车辆高度显示
				carHighShow: false,
				// 车辆高度列表
				carHighList: [
					{
						value: '1',
						label: '0',
						children: [
							{
								value: '1',
								label: '.1',
							},
							{
								value: '2',
								label: '.2',
							},
							{
								value: '3',
								label: '.3',
							},
							{
								value: '4',
								label: '.4',
							},
							{
								value: '5',
								label: '.5',
							},
							{
								value: '6',
								label: '.6',
							},
							{
								value: '7',
								label: '.7',
							},
							{
								value: '8',
								label: '.8',
							},
							{
								value: '9',
								label: '.9',
							}
						]
					},
					{
						value: '2',
						label: '1',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '3',
						label: '2',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '4',
						label: '3',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '5',
						label: '4',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '6',
						label: '5',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '7',
						label: '6',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '8',
						label: '7',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '9',
						label: '8',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '10',
						label: '9',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '11',
						label: '10',
						children: [
							{
								value: '1',
								label: '.0',
							},
						]
					},
				],
				// 车辆宽度显示
				carWideShow: false,
				// 车辆宽度列表
				carWideList: [
					{
						value: '1',
						label: '0',
						children: [
							{
								value: '1',
								label: '.1',
							},
							{
								value: '2',
								label: '.2',
							},
							{
								value: '3',
								label: '.3',
							},
							{
								value: '4',
								label: '.4',
							},
							{
								value: '5',
								label: '.5',
							},
							{
								value: '6',
								label: '.6',
							},
							{
								value: '7',
								label: '.7',
							},
							{
								value: '8',
								label: '.8',
							},
							{
								value: '9',
								label: '.9',
							}
						]
					},
					{
						value: '2',
						label: '1',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '3',
						label: '2',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '4',
						label: '3',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '5',
						label: '4',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '6',
						label: '5',
						children: [
							{
								value: '1',
								label: '.0',
							},
						]
					},
				],
				// 车辆长度显示
				carLengthShow: false,
				// 车辆长度列表
				carLengthList: [
					{
						value: '1',
						label: '0',
						children: [
							{
								value: '1',
								label: '.1',
							},
							{
								value: '2',
								label: '.2',
							},
							{
								value: '3',
								label: '.3',
							},
							{
								value: '4',
								label: '.4',
							},
							{
								value: '5',
								label: '.5',
							},
							{
								value: '6',
								label: '.6',
							},
							{
								value: '7',
								label: '.7',
							},
							{
								value: '8',
								label: '.8',
							},
							{
								value: '9',
								label: '.9',
							}
						]
					},
					{
						value: '2',
						label: '1',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '3',
						label: '2',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '4',
						label: '3',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '5',
						label: '4',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '6',
						label: '5',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '7',
						label: '6',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '8',
						label: '7',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '9',
						label: '8',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '10',
						label: '9',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '11',
						label: '10',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '12',
						label: '11',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '13',
						label: '12',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '14',
						label: '13',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '15',
						label: '14',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '16',
						label: '15',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '17',
						label: '16',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '18',
						label: '17',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '19',
						label: '18',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '20',
						label: '19',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '21',
						label: '20',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '22',
						label: '21',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '23',
						label: '22',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '24',
						label: '23',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '25',
						label: '24',
						children: [
							{
								value: '1',
								label: '.0',
							},
							{
								value: '2',
								label: '.1',
							},
							{
								value: '3',
								label: '.2',
							},
							{
								value: '4',
								label: '.3',
							},
							{
								value: '5',
								label: '.4',
							},
							{
								value: '6',
								label: '.5',
							},
							{
								value: '7',
								label: '.6',
							},
							{
								value: '8',
								label: '.7',
							},
							{
								value: '9',
								label: '.8',
							},
							{
								value: '10',
								label: '.9',
							}
						]
					},
					{
						value: '26',
						label: '25',
						children: [
							{
								value: '1',
								label: '.0',
							}
						]
					}
				],
				// 货车类型显示
				carTypeShow: false,
				// 货车类型列表
				carTypeList: [
					{
						value: '1',
						label: '微型货车'
					},
					{
						value: '2',
						label: '轻型货车'
					},
					{
						value: '3',
						label: '中型货车'
					},
					{
						value: '4',
						label: '重型货车'
					}
				],
				form: {
					carNo: '',
					carType: '',
					carAllWeight: '',
					carLoad: '',
					carLength: '',
					carWide: '',
					carHigh: '',
					carAxle: ''
				},
				// 文字提示
				errorType: ['message'],
				rules: {
					carNo: [
						{ 
							required: true, 
							message: '请输入车牌', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['blur', 'change'],
						},
						// 正则判断车牌
						{
							pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/g,
							// 正则检验前先将值转为字符串
							transform(value) {
								return String(value);
							},
							message: '车牌格式有误，请输入正确的车牌'
						},
					],
					carType: [
						{ 
							required: true, 
							message: '请选择货车类型', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['blur', 'change'],
						}
					],
					carAllWeight: [
						{ 
							required: true, 
							message: '请输入货车总重量', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change'],
						},
						// 正则判断总重
						{
							pattern: /^(([1-9][0-9]|[1-9])(\.\d{1,3})?|0\.\d{1,3}|100)$/g,
							// 正则检验前先将值转为字符串
							transform(value) {
								return String(value);
							},
							message: '请输入0~100，不包含0，最多保留三位小数的数字'
						},
						// 校验值比载荷重量大
						{
							asyncValidator: (rule, value, callback) => {
								if(Number(value) > Number(this.form.carLoad)) {
									// 如果校验通过，也要执行callback()回调
									callback();
								} else {
									// 如果验证不通过，需要在callback()抛出new Error('错误提示信息')
									callback(new Error('总重应大于核定载重，请调整'));
								}
							},
						}
					],
					carLoad: [
						{ 
							required: true, 
							message: '请输入载荷重量', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change'],
						},
						// 正则判断载荷重
						{
							pattern: /^(([1-9][0-9]|[1-9])(\.\d{1,3})?|0\.\d{1,3}|100)$/g,
							// 正则检验前先将值转为字符串
							transform(value) {
								return String(value);
							},
							message: '请输入0~100，不包含0，最多保留三位小数的数字'
						},
						// 校验值比载荷重量大
						{
							asyncValidator: (rule, value, callback) => {
								if(Number(value) < Number(this.form.carAllWeight)) {
									// 如果校验通过，也要执行callback()回调
									callback();
								} else {
									// 如果验证不通过，需要在callback()抛出new Error('错误提示信息')
									callback(new Error('核定载重应小于总重，请调整'));
								}
							},
						}
					],
					carLength: [
						{ 
							required: true, 
							message: '请选择车辆长度', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['blur', 'change'],
						}
					],
					carWide: [
						{ 
							required: true, 
							message: '请选择车辆宽度', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['blur'],
						}
					],
					carHigh: [
						{ 
							required: true, 
							message: '请选择车辆高度', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['blur', 'change'],
						}
					],
					carAxle: [
						{ 
							required: true, 
							message: '请选择轴数', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['blur', 'change'],
						}
					],
				},
			}
		},
		mounted() {
			// #ifdef APP-PLUS
			//ios平台高德地图sdk初始化，Android无需
			var key = "59a672d452aa5614d983240a01553557";
			sdkwx.initWithKey(key);
			// #endif
			if(uni.getStorageSync('carNo')) {
				this.form.carNo = uni.getStorageSync('carNo')
			}
			if(uni.getStorageSync('carType')) {
				this.form.carType = uni.getStorageSync('carType')
			}
			if(uni.getStorageSync('carAllWeight')) {
				this.form.carAllWeight = uni.getStorageSync('carAllWeight')
			}
			if(uni.getStorageSync('carLoad')) {
				this.form.carLoad = uni.getStorageSync('carLoad')
			}
			if(uni.getStorageSync('carLength')) {
				this.form.carLength = uni.getStorageSync('carLength')
			}
			if(uni.getStorageSync('carWide')) {
				this.form.carWide = uni.getStorageSync('carWide')
			}
			if(uni.getStorageSync('carHigh')) {
				this.form.carHigh = uni.getStorageSync('carHigh')
			}
			if(uni.getStorageSync('carAxle')) {
				this.form.carAxle = uni.getStorageSync('carAxle')
			}
			setTimeout(() => {
				this.$refs.uForm.setRules(this.rules);
			},500)
		},
		methods: {
			change() {
				this.$emit('change',this.infoShow);
			},
			
			// 开始导航
			submit() {
				console.log(this.form);
				this.$refs.uForm.validate(valid => {
					console.log(valid);
					if (valid) {
						console.log(valid);
						// #ifdef APP-PLUS
						if(this.itemType == 1) {
							let item = this.itemLists[0];
							sdkwx.showRoute(
							{
								theme: 2,
								end: {
									coordinate: {
										latitude: parseFloat(item.lat),
										longitude: parseFloat(item.lnt)
									},
									name: item.provinceName + item.cityName + item.regionName + item.address,
									poiId: null
								},
								carInfo: { //使用货车导航组件
									carNumber: this.form.carNo, //车牌号 
									carType: 1, //车辆类型, 0:小车; 1:货车. 默认0(小车). 
									vehicleSize: this.form.carType == '微型货车' ? 1 : this.form.carType == '轻型货车' ? 2 : this.form.carType == '中型货车' ? 3 : this.form.carType == '重型货车' ? 4 : 3, //货车的类型(大小),1:微型货车; 2:轻型/小型货车; 3:中型货车; 4:重型货车
									vehicleWidth: parseFloat(this.form.carWide), //货车的宽度,范围:(0,5],单位：米 
									vehicleHeight: parseFloat(this.form.carHigh), //货车的高度,范围:(0,10],单位：米 
									vehicleLength: parseFloat(this.form.carLength), //货车的长度,范围:(0,25],单位：米 
									vehicleWeight: parseFloat(this.form.carLoad), //货车的核定载重,范围:(0,100],单位：吨. 注意:核定载重应小于总重量 
									vehicleLoad: parseFloat(this.form.carAllWeight), //货车的总重量,范围:(0,100],单位：吨. 注意:核定载重应小于总重量 
									vehicleAxis: this.form.carAxle == '1轴' ? 1 : this.form.carAxle == '2轴' ? 2 : this.form.carAxle == '3轴' ? 3 : this.form.carAxle == '4轴' ? 4 : this.form.carAxle == '5轴' ? 5 : this.form.carAxle == '6轴' ? 6 : 7 //货车的轴数（用来计算过路费及限重）
								}, 
								multipleRouteNaviMode: true, //YES:多路线导航模式, NO:单路线导 航模式. 
								needCalculateRouteWhenPresent: true, //设置启动导航组件是否重新算路 
								needDestroyDriveManagerInstanceWhenNaviExit: true, //设置退出组件的时候是否销毁导航//
								trafficEnabled: true //交通路况
							}, function(res) {
								console.log(res.type);
								console.log(res.data);
							});
						} else {
							let itemOrigin = this.itemLists[0];
							let itemDestination = this.itemLists[this.itemLists.length - 1];
							let $wayPoints = [];
							let via = this.itemLists.slice(1,-1); 
							if(this.itemLists.length <= 2) {
								sdkwx.showRoute({
									theme: 2,
									start:{//起点
										coordinate:{ 
											latitude: parseFloat(itemOrigin.lat),
											longitude: parseFloat(itemOrigin.lnt) 
										}, 
										name: itemOrigin.provinceName + itemOrigin.cityName + itemOrigin.regionName + itemOrigin.address,
										poiId: null
									},
									end: {//终点
										coordinate: {
											latitude: parseFloat(itemDestination.lat),
											longitude: parseFloat(itemDestination.lnt)
										},
										name: itemDestination.provinceName + itemDestination.cityName + itemDestination.regionName + itemDestination.address,
										poiId: null
									},
									carInfo: { //使用货车导航组件
										carNumber: this.form.carNo, //车牌号 
										carType: 1, //车辆类型, 0:小车; 1:货车. 默认0(小车). 
										vehicleSize: this.form.carType == '微型货车' ? 1 : this.form.carType == '轻型货车' ? 2 : this.form.carType == '中型货车' ? 3 : this.form.carType == '重型货车' ? 4 : 3, //货车的类型(大小),1:微型货车; 2:轻型/小型货车; 3:中型货车; 4:重型货车
										vehicleWidth: parseFloat(this.form.carWide), //货车的宽度,范围:(0,5],单位：米 
										vehicleHeight: parseFloat(this.form.carHigh), //货车的高度,范围:(0,10],单位：米 
										vehicleLength: parseFloat(this.form.carLength), //货车的长度,范围:(0,25],单位：米 
										vehicleWeight: parseFloat(this.form.carLoad), //货车的核定载重,范围:(0,100],单位：吨. 注意:核定载重应小于总重量 
										vehicleLoad: parseFloat(this.form.carAllWeight), //货车的总重量,范围:(0,100],单位：吨. 注意:核定载重应小于总重量 
										vehicleAxis: this.form.carAxle == '1轴' ? 1 : this.form.carAxle == '2轴' ? 2 : this.form.carAxle == '3轴' ? 3 : this.form.carAxle == '4轴' ? 4 : this.form.carAxle == '5轴' ? 5 : this.form.carAxle == '6轴' ? 6 : 7 //货车的轴数（用来计算过路费及限重）
									}, 
									multipleRouteNaviMode: true, //YES:多路线导航模式, NO:单路线导 航模式. 
									needCalculateRouteWhenPresent: true, //设置启动导航组件是否重新算路 
									needDestroyDriveManagerInstanceWhenNaviExit: true, //设置退出组件的时候是否销毁导航//
									trafficEnabled: true //交通路况
								}, function(res) {
									console.log(res.type);
									console.log(res.data);
								});
							} else {
								via.forEach(item => {
									$wayPoints.push(
										{
											coordinate:{
												 latitude: parseFloat(item.lat),
												 longitude: parseFloat(item.lnt)
											},
											name: item.provinceName + item.cityName + item.regionName + item.address,
											poiId: null
										}
									)
								})
								console.log($wayPoints);
								sdkwx.showRoute({
									theme: 2,
									start:{//起点
										coordinate:{ 
											latitude: parseFloat(itemOrigin.lat),
											longitude: parseFloat(itemOrigin.lnt) 
										}, 
										name: itemOrigin.provinceName + itemOrigin.cityName + itemOrigin.regionName + itemOrigin.address,
										poiId: null
									},
									end: {//终点
										coordinate: {
											latitude: parseFloat(itemDestination.lat),
											longitude: parseFloat(itemDestination.lnt)
										},
										name: itemDestination.provinceName + itemDestination.cityName + itemDestination.regionName + itemDestination.address,
										poiId: null
									},
									wayPoints: $wayPoints,
									carInfo: { //使用货车导航组件
										carNumber: this.form.carNo, //车牌号 
										carType: 1, //车辆类型, 0:小车; 1:货车. 默认0(小车). 
										vehicleSize: this.form.carType == '微型货车' ? 1 : this.form.carType == '轻型货车' ? 2 : this.form.carType == '中型货车' ? 3 : this.form.carType == '重型货车' ? 4 : 3, //货车的类型(大小),1:微型货车; 2:轻型/小型货车; 3:中型货车; 4:重型货车
										vehicleWidth: parseFloat(this.form.carWide), //货车的宽度,范围:(0,5],单位：米 
										vehicleHeight: parseFloat(this.form.carHigh), //货车的高度,范围:(0,10],单位：米 
										vehicleLength: parseFloat(this.form.carLength), //货车的长度,范围:(0,25],单位：米 
										vehicleWeight: parseFloat(this.form.carLoad), //货车的核定载重,范围:(0,100],单位：吨. 注意:核定载重应小于总重量 
										vehicleLoad: parseFloat(this.form.carAllWeight), //货车的总重量,范围:(0,100],单位：吨. 注意:核定载重应小于总重量 
										vehicleAxis: this.form.carAxle == '1轴' ? 1 : this.form.carAxle == '2轴' ? 2 : this.form.carAxle == '3轴' ? 3 : this.form.carAxle == '4轴' ? 4 : this.form.carAxle == '5轴' ? 5 : this.form.carAxle == '6轴' ? 6 : 7 //货车的轴数（用来计算过路费及限重）
									}, 
									multipleRouteNaviMode: true, //YES:多路线导航模式, NO:单路线导 航模式. 
									needCalculateRouteWhenPresent: true, //设置启动导航组件是否重新算路 
									needDestroyDriveManagerInstanceWhenNaviExit: true, //设置退出组件的时候是否销毁导航//
									trafficEnabled: true //交通路况
								}, function(res) {
									console.log(res.type);
									console.log(res.data);
								});
							}
						}
						// #endif
						this.infoShow = false;
					} else {
						console.log('验证失败');
					}
				});
			},
			
			// 跳过配置
			navigationOpenMap() {
				console.log(this.itemLists);
				// #ifdef APP-PLUS
				if(this.itemType == 1) {
					let item = this.itemLists[0];
					sdkwx.showRoute(
					{
						theme: 2,
						end: {
							coordinate: {
								latitude: parseFloat(item.lat),
								longitude: parseFloat(item.lnt)
							},
							name: item.provinceName + item.cityName + item.regionName + item.address,
							poiId: null
						},
					}, function(res) {
						console.log(res.type);
						console.log(res.data);
					});
				} else {
					let itemOrigin = this.itemLists[0];
					let itemDestination = this.itemLists[this.itemLists.length - 1];
					let $wayPoints = [];
					let via = this.itemLists.slice(1,-1); 
					if(this.itemLists.length <= 2) {
						sdkwx.showRoute({
							theme: 2,
							start:{//起点
								coordinate:{ 
									latitude: parseFloat(itemOrigin.lat),
									longitude: parseFloat(itemOrigin.lnt) 
								}, 
								name: itemOrigin.provinceName + itemOrigin.cityName + itemOrigin.regionName + itemOrigin.address,
								poiId: null
							},
							end: {//终点
								coordinate: {
									latitude: parseFloat(itemDestination.lat),
									longitude: parseFloat(itemDestination.lnt)
								},
								name: itemDestination.provinceName + itemDestination.cityName + itemDestination.regionName + itemDestination.address,
								poiId: null
							},
						}, function(res) {
							console.log(res.type);
							console.log(res.data);
						});
					} else {
						via.forEach(item => {
							$wayPoints.push(
								{
									coordinate:{
										 latitude: parseFloat(item.lat),
										 longitude: parseFloat(item.lnt)
									},
									name: item.provinceName + item.cityName + item.regionName + item.address,
									poiId: null
								}
							)
						})
						console.log($wayPoints);
						sdkwx.showRoute({
							theme: 2,
							start:{//起点
								coordinate:{ 
									latitude: parseFloat(itemOrigin.lat),
									longitude: parseFloat(itemOrigin.lnt) 
								}, 
								name: itemOrigin.provinceName + itemOrigin.cityName + itemOrigin.regionName + itemOrigin.address,
								poiId: null
							},
							end: {//终点
								coordinate: {
									latitude: parseFloat(itemDestination.lat),
									longitude: parseFloat(itemDestination.lnt)
								},
								name: itemDestination.provinceName + itemDestination.cityName + itemDestination.regionName + itemDestination.address,
								poiId: null
							},
							wayPoints: $wayPoints
						}, function(res) {
							console.log(res.type);
							console.log(res.data);
						});
					}
				}
				// #endif
				this.infoShow = false;
			},
			
			// 车牌号码确认
			carNoConfirm() {
				uni.setStorageSync('carNo', this.form.carNo);
			},
			
			// 货车类型确认
			carTypeConfirm(item) {
				console.log(item);
				this.form.carType = item[0].label;
				uni.setStorageSync('carType', this.form.carType);
			},
			
			// 总重量确认
			carAllWeightConfirm() {
				uni.setStorageSync('carAllWeight', this.form.carAllWeight);
			},
			
			// 载荷重量确认
			carLoadConfirm() {
				uni.setStorageSync('carLoad', this.form.carLoad);
			},
			
			// 车辆长度确认
			carLengthConfirm(item) {
				console.log(item);
				this.form.carLength = item[0].label + item[1].label;
				uni.setStorageSync('carLength', this.form.carLength);
			},
			
			// 车辆宽度确认
			carWideConfirm(item) {
				console.log(item);
				this.form.carWide = item[0].label + item[1].label;
				uni.setStorageSync('carWide', this.form.carWide);
			},
			
			// 车辆高度确认
			carHighConfirm(item) {
				console.log(item);
				this.form.carHigh = item[0].label + item[1].label;
				uni.setStorageSync('carHigh', this.form.carHigh);
			},
			
			// 车辆轴数确认
			carAxleConfirm(item) {
				console.log(item);
				this.form.carAxle = item[0].label;
				uni.setStorageSync('carAxle', this.form.carAxle);
			},
			
			// 车牌按键被点击(点击退格键不会触发此事件)
			carNoChange(val) {
				// 将每次按键的值拼接到value变量中，注意+=写法
				if(this.form.carNo.length <= 9) {
					this.form.carNo += val;
				}
				console.log(this.form.carNo);
			},
			// 车牌退格键被点击
			carNoBackspace() {
				// 删除value的最后一个字符
				if(this.form.carNo.length) this.form.carNo = this.form.carNo.substr(0, this.form.carNo.length - 1);
				console.log(this.form.carNo);
			},
			
			// 总重量按键被点击(点击退格键不会触发此事件)
			carAllWeightChange(val) {
				let regs = /^[0-9]$/;
				let reg = /^\d+(\.\d{1,2})?$/;
				// 将每次按键的值拼接到value变量中，注意+=写法
				if(this.form.carAllWeight.length <= 4) {
					if(this.form.carAllWeight == '') {
						if(regs.test(val)){
							this.form.carAllWeight += val
						}
					} else {
						if(this.form.carAllWeight.indexOf(".") == -1) {
							if(this.form.carAllWeight.length <= 10){
								if(val == '.'){
									if(this.form.carAllWeight.indexOf(".") != -1){
										this.form.carAllWeight = parseFloat(this.form.carAllWeight)
										this.form.carAllWeight += ""
										return
									}
								}
								this.form.carAllWeight += val
							}
						} else {
							if(reg.test(this.form.carAllWeight)){
								if(val == '.'){
									if(this.form.carAllWeight.indexOf(".") != -1){
										this.form.carAllWeight = parseFloat(this.form.carAllWeight)
										this.form.carAllWeight += ""
										return
									}
								}
							}
							this.form.carAllWeight += val
						}
					}
				}
				console.log(this.form.carAllWeight);
			},
			// 总重量退格键被点击
			carAllWeightBackspace() {
				// 删除value的最后一个字符
				if(this.form.carAllWeight.length) this.form.carAllWeight = this.form.carAllWeight.substr(0, this.form.carAllWeight.length - 1);
				console.log(this.form.carAllWeight);
			},
			
			// 载荷重量按键被点击(点击退格键不会触发此事件)
			carLoadChange(val) {
				let regs = /^[0-9]$/;
				let reg = /^\d+(\.\d{1,2})?$/;
				// 将每次按键的值拼接到value变量中，注意+=写法
				if(this.form.carLoad.length <= 4) {
					if(this.form.carLoad == '') {
						if(regs.test(val)){
							this.form.carLoad += val
						}
					} else {
						if(this.form.carLoad.indexOf(".") == -1) {
							if(this.form.carLoad.length <= 10){
								if(val == '.'){
									if(this.form.carLoad.indexOf(".") != -1){
										this.form.carLoad = parseFloat(this.form.carLoad)
										this.form.carLoad += ""
										return
									}
								}
								this.form.carLoad += val
							}
						} else {
							if(reg.test(this.form.carLoad)){
								if(val == '.'){
									if(this.form.carLoad.indexOf(".") != -1){
										this.form.carLoad = parseFloat(this.form.carLoad)
										this.form.carLoad += ""
										return
									}
								}
							}
							this.form.carLoad += val
						}
					}
				}
				console.log(this.form.carLoad);
			},
			// 载荷重量退格键被点击
			carLoadBackspace() {
				// 删除value的最后一个字符
				if(this.form.carLoad.length) this.form.carLoad = this.form.carLoad.substr(0, this.form.carLoad.length - 1);
				console.log(this.form.carLoad);
			}
		}
	}
</script>

<style scoped lang="scss">
	.trucksInfo {
		// position: relative;
		.infoTitle {
			width: 100%;
			text-align: center;
			font-size: 30rpx;
			font-weight: 600;
			height: 90rpx;
			line-height: 90rpx;
			border-bottom: 2rpx solid #dcdcdc;
		}
		.infoContent {
			width: 100%;
			padding: 0 30rpx;
		}
		.infoBtn {
			width: 100%;
			height: 90rpx;
			position: absolute;
			bottom: 0;
			border-top: 2rpx solid #dcdcdc;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.infoBtns {
				flex: 3;
				height: 90rpx;
				line-height: 90rpx;
				text-align: center;
			}
			.infoBtnshu {
				width: 2rpx;
				height: 60rpx;
				background: #dcdcdc;
			}
		}
	}
</style>
