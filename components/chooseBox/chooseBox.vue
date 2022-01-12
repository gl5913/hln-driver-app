<template>
	<view class="content">
		<view class="contentCon">
			<view class="title">
				<text :style="titleStyle">{{ title }}</text>
				<text style="margin-left: 10rpx;" :style="subheadStyle">({{ subhead }})</text>
			</view>
			<view class="titRight" v-if="delBtnShow" @click="clear">
				<text style="font-size: 20rpx;">重新选择</text>
				<Icon :iconType="'iconshanchu'" extClass="shanchu"></Icon>
			</view>
		</view>
		<view class="inp">
			<input disabled class="inpStyle" cursor="500" @click="clearCheckedList(1)" :adjust-position="true" type="text" placeholder="请输入车长" v-model="value" v-if="longInpShow" />
			<input disabled class="inpStyless" cursor="500" @click="clearCheckedList(2)" :adjust-position="true" type="text" placeholder="请输入最小吨位" v-model="minValue" v-if="shortInpShow" />
			<view class="inpheng" v-if="shortInpShow"></view>
			<input disabled class="inpStyless" cursor="500" @click="clearCheckedList(3)" :adjust-position="true" type="text" placeholder="请输入最大吨位" v-model="maxValue" v-if="shortInpShow" />
		</view>
		<view  class="conContent">
			<view 
				@click="change(item)" 
				v-for="(item, index) in lists" :key="index" 
				class="type"
				:class="{ checkType: JSON.stringify(checkedList).indexOf(JSON.stringify(item)) != -1 }"
				:style="contentFontSize"
			>
				{{item.name}}
				<view class="fangkuai" v-if="JSON.stringify(checkedList).indexOf(JSON.stringify(item)) != -1">
					<Icon :iconType="'iconduigouCheng'" extClass="duigouChengss"></Icon>
				</view>
			</view>
		</view>
		
		<u-keyboard :tips="value" :mask-close-able="false" @cancel="inputContCan" :safe-area-inset-bottom="true" :mask="false" ref="uKeyboard" @confirm="inputCont" @change="valChange" @backspace="backspace" mode="number" v-model="show"></u-keyboard>
		<u-keyboard :tips="minValue" :mask-close-able="false" @cancel="minInputContCan" :safe-area-inset-bottom="true" :mask="false" ref="uKeyboard" @confirm="minInputCont" @change="minvalChange" @backspace="minbackspace" mode="number" v-model="minshow"></u-keyboard>
		<u-keyboard :tips="maxValue" :mask-close-able="false" @cancel="maxInputContCan" :safe-area-inset-bottom="true" :mask="false" ref="uKeyboard" @confirm="maxInputCont" @change="maxvalChange" @backspace="maxbackspace" mode="number" v-model="maxshow"></u-keyboard>
	</view>
</template>

<script>
	export default {
		props: {
			// 数据列表
			list: Array,
			// 重选按钮的显示
			deleteBtn: Boolean,
			// 长输入框的显示隐藏
			longInp: Boolean,
			// 短输入框的显示隐藏
			shortInp: Boolean,
			// 选中的值
			checkData: {
				type: Array,
				required: false
			},
			// 长输入框的值
			inputVal: {
				type: String,
				required: false
			},
			
			// 输入的最小值
			inputMin: {
				type: String,
				required: false
			},
			
			// 输入的最大值
			inputMax: {
				type: String,
				required: false
			},
			
			// 标题
			title: {
				type: String,
				required: true
			},
			// 副标题
			subhead: {
				type: String,
				required: true
			},
			// 不限名称
			noName: {
				type: String,
				required: true
			},
			// 内容字体大小
			conFontSize: {
				type: String,
				required: true
			},
			// 标题的样式
			titleStyles: {
				type: Object,
				required: true
			},
			// 副标题的样式
			subheadStyles: {
				type: Object,
				required: true
			},
		},
		data() {
			return {
				// 车辆类型列表
				lists: [
					{
						id: -1,
						name: this.noName
					}
				],
				
				show: false,
				minshow: false,
				maxshow: false,
				
				// 输入框的副标题
				placeholder: '请输入车长',
				
				// 选中的数据
				checkedList: this.checkData,
				
				// 长输入框输入的值
				value: this.inputVal,
				
				// 短输入框输入的值
				minValue: this.inputMin,
				maxValue: this.inputMax,
				
				// 重选按钮的显示隐藏
				delBtnShow: this.deleteBtn,
				
				// 长输入框的显示隐藏
				longInpShow: this.longInp,
				
				// 短输入框的显示隐藏
				shortInpShow: this.shortInp,
			}
		},
		computed: {
			// 内容字体大小
			contentFontSize() {
				let fontSize;
				fontSize = this.conFontSize + 'rpx';
				return { fontSize }
			},
			
			// 标题的样式
			titleStyle() {
				return this.titleStyles;
			},
			
			// 副标题的样式
			subheadStyle() {
				return this.subheadStyles;
			},
		},
		mounted() {
			console.log(this.checkData);
			this.addList();
		},
		methods: {
			inputContCan() {
				this.value = ''
			},
			
			minInputContCan() {
				this.minValue = ''
			},
			
			maxInputContCan() {
				this.maxValue = ''
			},
			
			// 按键被点击(点击退格键不会触发此事件)
			maxvalChange(val) {
				// 将每次按键的值拼接到value变量中，注意+=写法
				if(this.maxValue.length <= 4) {
					this.maxValue += val;
				}
				console.log(this.maxValue);
			},
			// 退格键被点击
			maxbackspace() {
				// 删除value的最后一个字符
				if(this.maxValue.length) this.maxValue = this.maxValue.substr(0, this.maxValue.length - 1);
				console.log(this.maxValue);
			},
			
			// 按键被点击(点击退格键不会触发此事件)
			minvalChange(val) {
				// 将每次按键的值拼接到value变量中，注意+=写法
				if(this.minValue.length <= 4) {
					this.minValue += val;
				}
				console.log(this.minValue);
			},
			// 退格键被点击
			minbackspace() {
				// 删除value的最后一个字符
				if(this.minValue.length) this.minValue = this.minValue.substr(0, this.minValue.length - 1);
				console.log(this.minValue);
			},
			
			// 按键被点击(点击退格键不会触发此事件)
			valChange(val) {
				// 将每次按键的值拼接到value变量中，注意+=写法
				if(this.value.length <= 4) {
					this.value += val;
				}
				console.log(this.value);
			},
			// 退格键被点击
			backspace() {
				// 删除value的最后一个字符
				if(this.value.length) this.value = this.value.substr(0, this.value.length - 1);
				console.log(this.value);
			},
			
			// 输入框获取焦点清除选中的值
			clearCheckedList(index) {
				this.checkedList = [];
				if(index == 1) {
					this.show = true;
				} else if(index == 2) {
					this.minshow = true;
				} else if(index == 3) {
					this.maxshow = true;
				}
			},
			
			// 输入框输入并确定了值
			inputCont() {
				// if(this.value) {
					let i = this.value
					let num = i.charAt(i.length-1)
					var reg = new RegExp("^[0-9]*$")
					if(!reg.test(num)) {
						this.value = i.slice(0,-1)
						console.log(i);
					} else {
						this.value = i
						console.log(i);
					}
					this.$emit('change',this.value);
				// }
			},
			
			minInputCont() {
				// if(this.minValue) {
					let val,values;
					val = this.minValue + '-' + this.minValue;
					values = this.minValue + '-' + this.maxValue;
					if(this.maxValue == '') {
						this.$emit('change',val);
					} else {
						this.$emit('change',values);
					}
				// } else {
				// 	this.$emit('change','空');
				// }
			},
			
			maxInputCont() {
				// if(this.maxValue) {
					let val,values;
					val = this.maxValue + '-' + this.maxValue;
					values = this.minValue + '-' + this.maxValue;
					if(this.minValue == '') {
						this.$emit('change',val);
					} else {
						this.$emit('change',values);
					}
				// } else {
				// 	this.$emit('change','空');
				// }
			},
			
			// 选中的数组
			change(obj) {
				// 保存items
				console.log(JSON.stringify(this.checkedList).indexOf(JSON.stringify(obj)));
				if (JSON.stringify(this.checkedList).indexOf(JSON.stringify(obj)) == -1) {
					// 不存在,则添加
					if(obj.id == -1) {
						this.checkedList = [obj];
					} else {
						let index = this.checkedList.findIndex(function(item) {
						    return item.id == -1;
						});
						if(index == -1) {
							this.checkedList.push(obj);
							if (this.checkedList.length > 3) {
								this.checkedList.splice(0, 1);
							}
						} else {
							this.checkedList.push(obj);
							this.checkedList.splice(index, 1);
							if (this.checkedList.length > 3) {
								this.checkedList.splice(0, 1);
							}
						}
					}
				} else {
					// 存在,则删除
					let index = this.checkedList.findIndex(item => item.id == obj.id);
					this.checkedList.splice(index, 1);
				}
				this.$emit('change',this.checkedList);
				this.value = '';
				this.minValue = '';
				this.maxValue = '';
			},
			
			// 重新选择
			clear() {
				this.$emit('clear','clearData');
				this.checkedList = [
					{
						id: -1,
						name: this.noName
					}
				];
				this.value = '';
				this.minValue = '';
				this.maxValue = '';
			},
			
			// 列表添加不限
			addList() {
				this.list.forEach(item => {
					this.lists.push(item);
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.u-drawer-bottom[data-v-17becaea] {
		border-bottom: 110rpx !important;
	}
	.content {
		margin: 34rpx 0;
		width: 100%;
		padding: 0 30rpx;
		.inp {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.inpStyle {
				font-size: 20rpx;
				width: 100%;
				height: 60rpx;
				background: #F1F2F6;
				border: 2rpx solid #EBEBEB;
				border-radius: 8rpx;
				padding: 0 20rpx;
			}
			.inpStyless {
				font-size: 20rpx;
				width: 45%;
				height: 60rpx;
				background: #F1F2F6;
				border: 2rpx solid #EBEBEB;
				border-radius: 8rpx;
				text-align: center;
			}
			.inpheng {
				width: 28rpx;
				height: 0rpx;
				border: 2rpx solid #EBEBEB;
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
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.shanchu {
					margin-left: 5rpx;
					font-size: 35rpx;
					color: #999999;
				}
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
			.type {
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
			.type:nth-of-type(4n){
				margin-right: 0;
			}
			.checkType {
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
</style>
