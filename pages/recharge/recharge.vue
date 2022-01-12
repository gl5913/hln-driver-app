<template>
	<view class="recharge">
		<u-navbar title-width="300" back-text="" :title="type == 1 ? '充值' : '提现'"></u-navbar>
		
		<view class="recharge-tit" @click="selectShow = true">
			<view class="recharge-titss">
				<view class="recharge-tit-left">{{ type == 1 ? '充值方式' : '到账平台' }}</view>
				<view class="recharge-tit-mid" v-if="paymentMethod == 2">
					<Icon :iconType="'iconzhifu1'" extClass="zhifu1"></Icon>
					<view class="recharge-tit-mid-text">微信平台</view>
				</view>
				<view class="recharge-tit-mid" v-if="paymentMethod == 1">
					<Icon :iconType="'iconzhifubao1'" extClass="zhifubao1"></Icon>
					<view class="recharge-tit-mid-text">支付宝平台</view>
				</view>
			</view>
			<u-icon name="arrow-right" color="#999999" size="28"></u-icon>
		</view>
		
		<view class="recharge-cont">
			<view class="recharge-cont-top" v-if="type == 2">真实姓名</view>
			<view class="recharge-cont-botss" v-if="type == 2">
				<input class="inputStyle" placeholder-style="font-size: 24rpx; color: #999999; font-weight: 400;" type="text" v-model="name" placeholder="请输入您的真实姓名" />
			</view>
			
			<view class="recharge-cont-top" style="margin-top: 15rpx;" v-if="type == 2">收款账号</view>
			<view class="recharge-cont-botss" v-if="type == 2">
				<input class="inputStyle" placeholder-style="font-size: 24rpx; color: #999999; font-weight: 400;" type="text" v-model="account" placeholder="请输入您的收款账号" />
			</view>
			
			<view class="recharge-cont-top" style="margin-top: 15rpx;">{{ type == 1 ? '充值金额' : '提现金额' }}</view>
			<view class="recharge-cont-bot" @click="show = true">
				<view class="recharge-cont-bot-left">¥</view>
				<input class="inputStyle" disabled placeholder-style="font-size: 24rpx; color: #999999; font-weight: 400;" type="text" v-model="money" :placeholder="type == 1 ? '请输入您的充值金额' : '请输入您的提现金额'" />
			</view>
			<view class="recharge-cont-replenish" v-if="type == 2">
				<view class="recharge-cont-replenish-left">当前钱包可提余额 {{ parseFloat(usableMoney).toFixed(2) }}元
					<text class="recharge-cont-replenish-rightBtn" @click="refreshMoney">刷新</text>
				</view>
				<view class="recharge-cont-replenish-right" @click="moneyDeposit">全部提现</view>
			</view>
		</view>
		
		<u-keyboard @confirm="moneyConfirm" :tips="money" :mask-close-able="false" @cancel="inputCan" :safe-area-inset-bottom="true" :mask="false" ref="uKeyboard" @change="valChange" @backspace="backspace" mode="number" v-model="show"></u-keyboard>
		
		<button @click="payShow = true" :disabled="money <= 0" style="background: #FFC24D;" class="submitBtn" :class="{loginButton: money <= 0}" v-if="type == 1">充值</button>
		<button @click="payShow = true" :disabled="money <= 0 || name == '' || account == ''" style="background: #FFC24D;" class="submitBtn" :class="{loginButton: money <= 0 || name == '' || account == ''}" v-if="type == 2">提现</button>
		
		<!-- 确认金额 -->
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" :closeable="true" v-model="payShow" mode="center">
			<view v-if="type == 1">
				<view class="hintTit">充值金额</view>
				<view class="hintCon">
					<text class="hintCon-left">¥</text>
					<text class="hintCon-right">{{ parseFloat(money).toFixed(2) }}</text>
				</view>
			</view>
			<view v-else class="popCode">
				<view class="popTop">
					<view class="hintTit2">提现金额</view>
					<view class="hintCon2">
						<text class="hintCon-left2">¥</text>
						<text class="hintCon-right2">{{ parseFloat(money).toFixed(2) }}</text>
					</view>
				</view>
				<view class="autConCon2">
					<text class="autConCon2Tit">验证码</text>
					<input maxlength="6" style="width: 38%;" class="autConCon2Inp" placeholder-class="inpsty" type="number" name="authCode" v-model="authcode">
					<u-verification-code unique-key="page-recharge" change-text="XS 重新获取" ref="uCode" @change="codeChange"></u-verification-code>
					<view class="authcodes" @tap="getCode">{{ tips }}</view>
				</view>
			</view>
			<button :disabled="disabled" class="hintBtn" :style="[disabled ? disabledColor : '']" @click="rechargeDeposit" v-if="type == 1">确认充值</button>
			<button :disabled="disabled || !authcode" class="hintBtn" :style="[disabled || !authcode ? disabledColor : '']" @click="withdraw" v-if="type == 2">确认提现</button>
		</u-popup>
		
		<!-- 选择充值方式 -->
		<u-popup height="300" border-radius="40" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" :closeable="true" v-model="selectShow" mode="bottom">
			<view class="selectTitle">{{ type == 1 ? "选择充值方式" : "选择到账平台" }}</view>
			<view class="selectContent">
				<!-- <view class="selectContent-item" @click="selectPay(2)">
					<Icon :iconType="'iconzhifu1'" extClass="zhifu1"></Icon>
					<view class="selectContent-item-text">微信平台</view>
				</view> -->
				<view class="selectContent-item" style="border: 0;" @click="selectPay(1)">
					<Icon :iconType="'iconzhifubao1'" extClass="zhifubao1"></Icon>
					<view class="selectContent-item-text">支付宝平台</view>
				</view>
			</view>
		</u-popup>
		
		<!-- 充值失败重新充值 -->
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" :closeable="true" v-model="failShow" mode="center">
			<view class="hintTit">温馨提示</view>
			<view class="hintCon">充值失败</view>
			<view class="hintBtn" @click="goMyWallet">重新充值</view>
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
				payShow: false,
				selectShow: false,
				
				disabledColor: {
					color: '#999999'
				},
				disabled: false,
				
				// 充值或提现金额
				money: '',
				// 收款账号
				account: '',
				// 收款名称
				name: '',
				
				// 类型 1充值，2提现
				type: '',
				
				// 支付方式
				paymentMethod: 1,
				
				// 可用余额
				usableMoney: '',
				
				failShow: false,
				
				show: false,
				
				// 验证码
				tips: '',
				// 输入的验证码
				authcode: '',
				// 手机号码
				username: '',
				
				codeTime: true,
			}
		},
		onLoad(option) {
			this.type = option.type;
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: this.type == 1 ? "充值页面加载" : "提现页面加载",
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
				page: "117",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onShow() {
			uni.getStorage({
				key: 'username',
				success: res => {
					this.username = res.data;
				}
			})
			this.getWalletMess();
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: this.type == 1 ? "充值页面显示" : "提现页面显示",
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
				page: "117",
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
				node: this.type == 1 ? "充值页面卸载" : "提现页面卸载",
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
				page: "117",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		methods: {
			
			inputCan() {
				this.money = '';
			},
			
			// 按键被点击(点击退格键不会触发此事件)
			valChange(val) {
				let regs = /^[0-9]$/;
				let reg = /^\d+(\.\d{1,2})?$/;
				// 将每次按键的值拼接到value变量中，注意+=写法
				if(this.money == '') {
					if(regs.test(val)){
						this.money += val
					}
				} else {
					if(this.money.indexOf(".") == -1) {
						if(this.money.length <= 10){
							if(val == '.'){
								if(this.money.indexOf(".") != -1){
									this.money = parseFloat(this.money)
									this.money += ""
									return
								}
							}
							this.money += val
						}
					} else {
						if(reg.test(this.money)){
							if(val == '.'){
								if(this.money.indexOf(".") != -1){
									this.money = parseFloat(this.money)
									this.money += ""
									return
								}
							}
						}
						this.money += val
					}
				}
				console.log(this.money);
			},
			// 退格键被点击
			backspace() {
				// 删除value的最后一个字符
				if(this.money.length) this.money = this.money.substr(0, this.money.length - 1);
				console.log(this.money);
			},
			
			// 刷新余额
			refreshMoney() {
				this.getWalletMess();
			},
			
			moneyConfirm() {
				if(this.type == 2) {
					if(this.money > this.usableMoney) {
						this.money = String(this.usableMoney);
					} else {
						this.money = String((Math.floor(this.money * 100) / 100).toFixed(2));
					}
				} else {
					this.money = String((Math.floor(this.money * 100) / 100).toFixed(2));
				}
			},
			
			// 获取验证码
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if(this.$refs.uCode.canGetCode) {
					if(this.codeTime) {
						this.codeTime = false;
						this.getAuthcode();
					}
					setTimeout(() => {
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						this.$u.toast('验证码将会发送到您的注册手机上');
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					}, 1000);
				}
			},
			getAuthcode() {
				ajax.get(config.code_url,{
				  phone: this.username,
				  type: 7
				}).then(res => {
					console.log(res)
					this.codeTime = true;
					if(res.code == 0){
						console.log("获取验证码成功");
					} else {
						console.log(res);
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取验证码",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取验证码(authentication/verification-code)",
							// 入参
							enterParams: {
								phone: this.username,
								type: 7
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "117",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取验证码接口数据返回失败 error is :" + err);
					this.codeTime = true;
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取验证码",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取验证码(authentication/verification-code)",
						// 入参
						enterParams: {
							phone: this.username,
							type: 7
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "117",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 选择支付方式
			selectPay(type) {
				this.paymentMethod = type;
				this.selectShow = false;
			},
			
			// 跳转到我的钱包
			goMyWallet() {
				uni.redirectTo({
					url: "/pages/myWallet/myWallet"
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到我的钱包",
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
					page: "117",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},
			
			// 充值调用支付接口
			pay(tradeNO) {
				console.log(tradeNO);
				uni.requestPayment({
				    provider: 'alipay',
				    orderInfo: tradeNO, //微信、支付宝订单数据
				    success: res => {
						this.payShow = false;
						uni.showLoading({
							title: '充值成功跳转中',
							mask: true
						});
						setTimeout(() => {
							uni.redirectTo({
								url: "/pages/myWallet/myWallet"
							})
							uni.hideLoading();
						},2000)
				    },
				    fail: err => {
						this.failShow = true;
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "充值调用支付",
							// 异常信息
							bugInfo: err,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "充值调用支付(uni.requestPayment)",
							// 入参
							enterParams: {
								provider: 'alipay',
								orderInfo: tradeNO,
							},
							// 出参
							outParams: null,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "117",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
				    }
				});
			},
			
			// 提现
			withdraw() {
				let codeReg = /^[0-9]{6}$/;
				if(codeReg.test(this.authcode)) {
					this.disabled = true;
					ajax.get(config.withdrawVerify_url, {
						phone: this.username, 
						code: this.authcode
					},).then(res => {
						console.log(res);
						if(res.code == 0){
							let $paymentMethod;
							if(this.paymentMethod == 1) {
								$paymentMethod = 'ALY_PAY';
							} else if(this.paymentMethod == 2) {
								$paymentMethod = 'WEIXIN_PAY';
							}
							ajax.put(config.withdraw_url, {
								payeeAccount: this.account, 
								payeeRealName: this.name, 
								transferAccountsAmount: this.money,
								payType: $paymentMethod
							},).then(res => {
								console.log(res);
								if(res.code == 0){
									uni.showLoading({
										title: '提现发起成功(请注意查看通知)',
										mask: true
									});
									setTimeout(() => {
										uni.redirectTo({
											url: "/pages/myWallet/myWallet"
										})
										uni.hideLoading();
									},2000)
								} else {
									this.disabled = false;
									uni.showToast({ title: "提现失败,请重新提现",icon: "none" ,duration:2000});
									
									let content = {
										// 动作
										action: "click",
										// 节点
										node: "提现",
										// 异常信息
										bugInfo: res.msg,
										// 页面参数
										pageParams: null,
										// 接口名称
										intName: "提现(face-user/transfer-accounts)",
										// 入参
										enterParams: {
											payeeAccount: this.account, 
											payeeRealName: this.name, 
											transferAccountsAmount: this.money,
											payType: $paymentMethod
										},
										// 出参
										outParams: res,
										// 前端编码
										webId: null
									};
									
									let info = {
										operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
										page: "117",
										type: 2,
										content: JSON.stringify(content)
									};
									
									burying.point(info);
								}
							}).catch(err => {
								this.disabled = false;
								console.log("提现接口数据返回失败 error is :" + err);
								
								let content = {
									// 动作
									action: "click",
									// 节点
									node: "提现",
									// 异常信息
									bugInfo: err,
									// 页面参数
									pageParams: null,
									// 接口名称
									intName: "提现(face-user/transfer-accounts)",
									// 入参
									enterParams: {
										payeeAccount: this.account, 
										payeeRealName: this.name, 
										transferAccountsAmount: this.money,
										payType: $paymentMethod
									},
									// 出参
									outParams: null,
									// 前端编码
									webId: null
								};
								
								let info = {
									operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
									page: "117",
									type: 2,
									content: JSON.stringify(content)
								};
								
								burying.point(info);
							})
						} else {
							this.disabled = false;
							uni.showToast({ title: "提现失败,请重新提现",icon: "none" ,duration:2000});
							
							let content = {
								// 动作
								action: "click",
								// 节点
								node: "提现验证",
								// 异常信息
								bugInfo: res.msg,
								// 页面参数
								pageParams: null,
								// 接口名称
								intName: "提现验证(face-user/withdrawal)",
								// 入参
								enterParams: {
									phone: this.username, 
									code: this.authcode
								},
								// 出参
								outParams: res,
								// 前端编码
								webId: null
							};
							
							let info = {
								operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
								page: "117",
								type: 2,
								content: JSON.stringify(content)
							};
							
							burying.point(info);
						}
					}).catch(err => {
						this.disabled = false;
						console.log("提现验证接口数据返回失败 error is :" + err);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "提现验证",
							// 异常信息
							bugInfo: err,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "提现验证(face-user/withdrawal)",
							// 入参
							enterParams: {
								phone: this.username, 
								code: this.authcode
							},
							// 出参
							outParams: null,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "117",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					})
				} else {
					uni.showToast({ title: "验证码格式错误（格式为6位数字），请重新输入", icon: "none" ,duration:2000});
				}
			},
			
			// 充值
			rechargeDeposit() {
				this.disabled = true;
				let $paymentMethod;
				if(this.paymentMethod == 1) {
					$paymentMethod = 'ALY_PAY';
				} else if(this.paymentMethod == 2) {
					$paymentMethod = 'WEIXIN_PAY';
				}
				ajax.post(config.account_url, {
					transactionType: 1, 
					paymentType: this.paymentMethod, 
					balance: this.money,
					paymentMethod: $paymentMethod
				},).then(res => {
					console.log(res);
					this.disabled = false;
					if(res.code == 0){
						this.pay(res.data.tradeNO);
					} else {
						uni.showToast({ title: "充值失败,请重新充值",icon: "none" ,duration:2000});
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "充值",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "充值(account/recharge)",
							// 入参
							enterParams: {
								transactionType: 1, 
								paymentType: this.paymentMethod, 
								balance: this.money,
								paymentMethod: $paymentMethod
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "117",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("充值接口数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "充值",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "充值(account/recharge)",
						// 入参
						enterParams: {
							transactionType: 1, 
							paymentType: this.paymentMethod, 
							balance: this.money,
							paymentMethod: $paymentMethod
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "117",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 全部提现
			moneyDeposit() {
				if(this.usableMoney > 0) {
					this.money = String(this.usableMoney);
				}
			},
			
			// 获取钱包详情
			getWalletMess() {
				ajax.get(config.wallet_url,{
				}).then(res => {
					console.log(res)
					if(res.code == 0){
						this.usableMoney = res.data.availableBalance;
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取钱包详情",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取钱包详情(personal-center/freight-wallet-account)",
							// 入参
							enterParams: null,
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "117",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取钱包详情数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取钱包详情",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取钱包详情(personal-center/freight-wallet-account)",
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "117",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},

		}
	}
</script>

<style scoped lang="scss">
	.recharge {
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
		.popCode {
			position: relative;
			top: 23%;
			width: 90%;
			margin: 0 auto;
			.autConCon2 {
				width: 100%;
				height: 80rpx;
				font-size: 28rpx;
				padding-top: 10rpx;
				color: #666666;
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: #ffffff;
				.authcodes {
					text-align: center;
					width: 30%;
					line-height: 52rpx;
					border-left: 2rpx solid #DDDDDD;
					height: 52rpx;
					font-size: 24rpx;
					color: #FB6E2F;
				}
				.inpsty {
					font-size: 28rpx;
					color: #999999;
				}
				.autConCon2Tit {
					width: 20%;
					height: 38rpx;
					line-height: 38rpx;
					text-align: right;
				}
				.autConCon2Inp {
					width: 70%;
					margin-left: 30rpx;
					height: 38rpx;
					line-height: 38rpx;
					font-size: 28rpx;
					color: #999999;
				}
			}
			.popTop {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 2rpx solid #DDDDDD;
				padding-bottom: 5rpx;
				.hintTit2 {
					font-size: 28rpx;
					color: #666666;
					width: 20%;
					height: 38rpx;
					line-height: 38rpx;
					text-align: right;
				}
				.hintCon2 {
					text-align: center;
					width: 45%;
					height: 80rpx;
					font-size: 60rpx;
					font-weight: 600;
					line-height: 80rpx;
					color: #333333;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					padding-right: 20rpx;
					.hintCon-left2 {
						font-size: 32rpx;
						height: 80rpx;
						line-height: 72rpx;
						margin-right: 18rpx;
					}
				}
			}
		}
		.hintTit {
			width: 100%;
			text-align: center;
			font-size: 36rpx;
			color: #999999;;
			position: relative;
			top: 92rpx;
		}
		.hintCon {
			height: 80rpx;
			font-size: 60rpx;
			font-weight: 600;
			line-height: 80rpx;
			color: #333333;
			position: relative;
			top: 106rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.hintCon-left {
				font-size: 32rpx;
				height: 80rpx;
				line-height: 72rpx;
				margin-right: 18rpx;
			}
		}
		.hintBtn {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			// border-top: 2rpx solid #DDDDDD;
			text-align: center;
			font-size: 32rpx;
			color: #F96F2B;
			border-radius: 0;
			background: #ffffff;
			position: absolute;
			bottom: 0;
		}
		.recharge-cont {
			width: 92%;
			margin: 0 auto;
			background: #FFFFFF;
			border-radius: 20rpx;
			padding: 28rpx 24rpx;
			.recharge-cont-replenish {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 26rpx 0 0 0;
				.recharge-cont-replenish-left {
					font-size: 28rpx;
					color: #666666;
				}
				.recharge-cont-replenish-right {
					font-size: 28rpx;
					color: #F96F2B;
				}
				.recharge-cont-replenish-rightBtn {
					font-size: 24rpx;
					color: #666666;
					margin-left: 15rpx;
				}
			}
			.recharge-cont-top {
				font-size: 28rpx;
				color: #333333;
			}
			.recharge-cont-botss {
				width: 100%;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding: 10rpx 0;
				border-bottom: 2rpx solid #f5f5f5;
				.inputStyle {
					font-size: 40rpx;
					color: #333333;
				}
			}
			.recharge-cont-bot {
				width: 100%;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding: 26rpx 0;
				border-bottom: 2rpx solid #f5f5f5;
				.inputStyle {
					font-size: 70rpx;
					font-weight: 600;
					color: #333333;
				}
				.recharge-cont-bot-left {
					color: #000000;
					height: 53rpx;
					line-height: 53rpx;
					font-size: 44rpx;
					font-weight: 600;
					margin-right: 40rpx;
				}
			}
		}
		.recharge-tit {
			width: 100%;
			height: 172rpx;
			padding: 0 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.recharge-titss {
				width: 100%;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.recharge-tit-left {
					font-size: 28rpx;
					color: #333333;
					margin-right: 86rpx;
				}
				.recharge-tit-mid {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.zhifu1 {
						font-size: 48rpx;
						color: #40ba49;
					}
					.zhifubao1 {
						font-size: 48rpx;
						color: #2ab4ef;
					}
					.recharge-tit-mid-text {
						font-size: 32rpx;
						color: #333333;
						margin-left: 14rpx;
					}
				}
			}
		}
		.submitBtn {
			width: 90%;
			height: 80rpx;
			line-height: 80rpx;
			position: absolute;
			left: 5%;
			bottom: 5%;
			color: #333333;
		}
		.loginButton {
			background: #DDDDDD !important;
			color: #333333;
		}
	}
</style>

