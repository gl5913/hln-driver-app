<template>
	<view class="loginContent">
		<view class="loginHeader">
			<image class="logoImg" src="../../static/img01.png"></image>
			<view class="logoTitle">{{ title }}</view>
		</view>
		<view class="loginForm">
			<view>
				<u-tabs-swiper gutter="150" :item-width="100" bar-height="8" :bold="false" height="100" bar-width="124"
				 active-color="#FB6E2F" font-size="32" ref="uTabs" :list="list" :current="current" @change="tabsChange" bg-color="#F5F6F7"
				 :is-scroll="false" swiperWidth="690"></u-tabs-swiper>
			</view>
			<swiper class="swiper-height" :style="[codeShow && current == 1 &&  username != '' ? Height : '']" :current="swiperCurrent"
			 @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="width: 100%;">
						<view class="por">
							<form @submit="formSubmit1">
								<view style="margin-bottom: 44rpx;" class="inputView">
									<Icon :iconType="'iconshouji'" extClass="shouji"></Icon>
									<input maxlength="11" placeholder-class="inpsty" style="margin-left: 18rpx; width: 80%;" type="number" name="userName"
									 v-model="username" placeholder="请输入手机号码">
								</view>
								<view class="inputView2">
									<view style="width: 67%;" class="inputViewCon">
										<Icon :iconType="'iconyanzhengma'" extClass="yanzhengma"></Icon>
										<input maxlength="6" style="width: 80%; margin-left: 18rpx;" placeholder-class="inpsty" type="number" name="authCode1"
										 v-model="authcode1" placeholder="请输入验证码">
									</view>
									<view style="width: 33%;" class="inputViewCon2">
										<u-verification-code unique-key="page-login1" change-text="XS 重新获取" ref="uCode" @change="codeChange1"></u-verification-code>
										<view class="authcodes" @tap="getCode(1)">{{ tips1 }}</view>
									</view>
								</view>
								<button :disabled="username == '' || authcode1 == '' || btnAstrict1 || !logoutAgree" style="background: #FFC24D; height: 80rpx; line-height: 80rpx; margin-top: 68rpx;"
								 form-type="submit" :class="{loginButton: username == '' || authcode1 == '' || btnAstrict1 || !logoutAgree}">同意协议并注册/登录</button>
							</form>
						</view>
					</scroll-view>
				</swiper-item>

				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="width: 100%;">
						<view class="por">
							<form @submit="formSubmit2">
								<view style="margin-bottom: 44rpx;" class="inputView">
									<Icon :iconType="'iconshouji'" extClass="shouji"></Icon>
									<input @blur="verifyPhone" maxlength="11" placeholder-class="inpsty" style="margin-left: 18rpx; width: 80%;"
									 type="number" name="userName" v-model="username" placeholder="请输入手机号码">
								</view>
								<view style="margin-bottom: 44rpx;" class="inputView2">
									<view style="width: 80%;" class="inputViewCon">
										<Icon :iconType="'iconyanzhengma1'" extClass="shouji"></Icon>
										<input placeholder-class="inpsty" style="margin-left: 20rpx; width: 80%;" :password="passwordShow" type="text"
										 name="passWord" v-model="password" placeholder="请输入密码">
									</view>
									<view style="width: 15%;" class="inputViewCon2" @click="passWordShow">
										<Icon :iconType="'iconyanjing'" extClass="yanjing" v-if="passwordShow"></Icon>
										<Icon :iconType="'iconzhengyan'" extClass="zhengyan" v-else></Icon>
									</view>
								</view>
								<view class="inputView2" v-show="codeShow && current == 1 && username != ''">
									<view style="width: 67%;" class="inputViewCon">
										<Icon :iconType="'iconyanzhengma'" extClass="yanzhengma"></Icon>
										<input maxlength="6" placeholder-class="inpsty" style="width: 80%; margin-left: 18rpx;" type="number" name="authCode2"
										 v-model="authcode2" placeholder="请输入验证码">
									</view>
									<view style="width: 33%;" class="inputViewCon2">
										<u-verification-code unique-key="page-login2" change-text="XS 重新获取" ref="pwdCode" @change="codeChange2"></u-verification-code>
										<view class="authcodes" @tap="getCode(2)">{{ tips2 }}</view>
									</view>
								</view>
								<button v-if="codeShow && current == 1" :disabled="username == '' || password == '' || authcode2 == '' || btnAstrict2 || !logoutAgree"
								 style="background: #FFC24D; height: 80rpx; line-height: 80rpx; margin-top: 68rpx;" form-type="submit" :class="{loginButton: username == '' || password == '' || authcode2 == '' || btnAstrict2 || !logoutAgree}">同意协议并注册/登录</button>
								<button v-else :disabled="username == '' || password == '' || btnAstrict2 || !logoutAgree" style="background: #FFC24D; height: 80rpx; line-height: 80rpx; margin-top: 68rpx;"
								 form-type="submit" :class="{loginButton: username == '' || password == '' || btnAstrict2 || !logoutAgree}">同意协议并注册/登录</button>
							</form>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
			<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}"
			 :closeable="true" v-model="popShow" mode="center">
				<view class="hintTit">温馨提示</view>
				<view class="hintCon">请正确输入手机号码</view>
				<view class="hintBtn" style="justify-content: center;" @click="popShow = false">重新输入</view>
			</u-popup>
			<u-popup width="660" height="542" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}"
			 :closeable="true" v-model="logoutShow" mode="center">
				<view class="hintTit">温馨提示</view>
				<view class="hintCon" style="padding: 0 100rpx;">您已注册货主端，同一手机号码只能注册一个身份</view>
				<button class="hintBts" style="border: none;" @click="goLogout">注销货主端，注册司机端</button>
				<button class="hintBts" style="background: #ffffff; margin-top: 20rpx;" @click="goShipper">登录货主端</button>
			</u-popup>
			<view class="loginFormFooter">
				<view class="logoutAgree" :class="{logoutAgreess: logoutAgree}" @click="showAgree">
					<view class="logoutAgreeYuan" v-show="logoutAgree"></view>
				</view>
				<view class="loginFormText">
					首次登录自动注册货灵鸟账号，且已阅读并同意
					<text @click="goPact(1)">《注册协议》</text>
					<text @click="goPact(2)">《隐私政策》</text>
					<!-- <text @click="goPact(3)">《会员服务协议》</text> -->
				</view>
			</view>
		</view>

		<u-modal confirm-text="立即更新" cancel-text="暂不更新" border-radius="28" :show-cancel-button="mustPull == 0" :show-title="false"
		 v-model="updateShow" @confirm="goUpdate" @cancel="cancelUpdata">
			<view class="slot-content">
				<view class="slot-left">本次更新</view>
				<scroll-view class="slot-right" scroll-y="true">
					<view v-for="(item,index) of updateContent" :key="index">{{ item }}</view>
				</scroll-view>
			</view>
		</u-modal>

		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" v-model="forbiddenShow"
		 mode="center">
			<view class="hintTit">温馨提示</view>
			<view class="hintCon">您的账户已被禁用</view>
			<view class="hintBtn">
				<view style="width: 50%;" @click="callUp">联系客服</view>
				<view class="hintBtnShu"></view>
				<view style="color: #333333; width: 50%;" @click="forbiddenShow = false">关闭</view>
			</view>
		</u-popup>
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" v-model="shipperShow"
		 mode="center">
			<view class="hintTit">温馨提示</view>
			<view class="hintCon">您未安装货灵鸟货主端</view>
			<view class="hintBtn">
				<view style="color: #333333; width: 100%;" @click="shipperShow = false">好的</view>
			</view>
		</u-popup>
		<view class="loginFooter">
			<view class="loginFooterLeft"></view>
			<view class="loginFooterCon">
				<view class="loginFooterCon-text1">货灵鸟</view>
				<view class="loginFooterCon-text2">Ver {{ currentVersion || '1.0.0' }}</view>
			</view>
			<view class="loginFooterRight"></view>
		</view>
	</view>
</template>

<script>
	import config from '../../service/config.js';
	import ajax from '../../service/ajax.js';
	import moment from 'moment';
	import burying from '../../common/request.js';
	var graceChecker = require("../../common/graceChecker.js");
	export default {
		data() {
			return {
				forbiddenShow: false,
				// 提示未安装货主端
				shipperShow: false,
				// 快速登录与密码登录标签
				list: [{
					name: '快速登录'
				}, {
					name: '密码登录'
				}],
				// 密码显示隐藏
				passwordShow: true,
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				// 温馨提示手机号码错误
				popShow: false,
				// 温馨提示注销
				logoutShow: false,

				// 账号(手机号)
				username: '',
				// 密码
				password: '',

				// 快速登录
				// 验证码
				tips1: '',
				// 输入的验证码
				authcode1: '',

				// 密码登录
				// 验证码
				tips2: '',
				// 输入的验证码
				authcode2: '',

				// 标题
				title: '司机端',
				// 密码登录的验证码显示隐藏
				codeShow: false,

				// 注册登录按钮点击限制
				btnAstrict1: false,
				btnAstrict2: false,

				isIos: true,

				updateShow: false,
				updateContent: [],

				mustPull: '',
				pullUrl: '',

				// 是否同意
				logoutAgree: false,
				//最新版本
				newVersion:"",
				currentVersion: '',
				
				codeTime1: true,
				codeTime2: true,
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			this.isIos = (plus.os.name == "iOS")
			// #endif
		},
		onShow() {
			// 检查更新
			//#ifdef APP-PLUS
			let $platform = '';
			if (this.isIos) {
				$platform = 'ios';
			} else {
				$platform = 'android';
			}
			this.currentVersion = plus.runtime.version;
			ajax.get(config.version_url, {
				version: plus.runtime.version,
				appid: plus.runtime.appid,
				platform: $platform
			}).then(res => {
				if (res.code == 0) {
					if (res.data) {
						let contentUrl = res.data.contentUrl;
						this.mustPull = res.data.mustPull;
						this.pullUrl = res.data.pullUrl;
						this.newVersion = res.data.version

						uni.request({
							url: contentUrl,
							success: res => {
								console.log(res);
								let item = res.data.split('；');
								this.updateContent = item;
							}
						})

						if (this.mustPull == 1) {
							this.updateShow = true;
						} else {
							uni.getStorage({
								key: 'updateStatus',
								success: res => {
									console.log(reg);
									//判断版本需不需要更新
									if(reg.data == this.newVersion){
										this.updateShow = false;
									}else{
										this.updateShow = true;
									}
								},
								fail: err => {
									console.log(err);
									this.updateShow = true;
								}
							})
						}
					} else {
						this.updateShow = false;
						uni.removeStorage({
							key: 'updateStatus',
							success: function(res) {
								console.log('移除标记成功');
							}
						});
					}
				} else {
					console.log(res)
				}
			}).catch(err => {
				console.log(err)
			})
			//#endif
		},
		computed: {
			Height() {
				let height;
				height = '560rpx';
				return {
					height
				}
			}
		},
		methods: {

			// 点击同意或不同意
			showAgree() {
				this.logoutAgree = !this.logoutAgree;
			},

			// 立即更新
			goUpdate() {
				if (this.isIos) {
					let appleId = 1552344297 //app的appleId
					plus.runtime.launchApplication({
						action: `itms-apps://itunes.apple.com/cn/app/id${appleId}?mt=8`
					}, function(e) {
						console.log('Open system default browser failed: ' + e.message);
					});
				} else {
					uni.showToast({
						title: "正在后台更新应用,稍后自动安装",
						icon: 'none',
						duration: 2000
					})
					uni.downloadFile({//执行下载
						url: this.pullUrl, //下载地址
						success: downloadResult => {//下载成功
							if (downloadResult.statusCode == 200) {
								// uni.showModal({
								// 	title: '',
								// 	content: '更新成功，确定现在重启吗？',
								// 	confirmText: '重启',
								// 	confirmColor: '#EE8F57',
								// 	success: function(res) {
								// 		if (res.confirm == true) {
								// 			plus.runtime.install(//安装
								// 				downloadResult.tempFilePath, {
								// 					force: true
								// 				},
								// 				function(res) {
								// 					utils.showToast('更新成功，重启中');
								// 					plus.runtime.restart();
								// 				}
								// 			);
								// 		}
								// 	}
								// });
								plus.runtime.install(//安装
									downloadResult.tempFilePath, {
										force: true
									},
									function(res) {
										utils.showToast('更新成功，重启中');
										plus.runtime.restart();
									}
								);
							}
						}
					});
					// plus.runtime.openURL(this.pullUrl);
				}
			},

			// 暂不更新
			cancelUpdata() {
				this.updateShow = false;
				uni.setStorage({
					key: 'updateStatus',
					data: this.newVersion,
				});
			},

			// 跳转到协议
			goPact(type) {
				if (type == 1) {
					uni.navigateTo({
						url: "/pages/pact/userServer/userServer",
					});
				} else if (type == 2) {
					uni.navigateTo({
						url: "/pages/pact/privacyPolicy/privacyPolicy",
					});
				}
			},

			// 失去焦点校验手机号
			verifyPhone(val) {
				if (val.detail.value != '') {
					console.log(val.detail.value)
						this.btnAstrict1 = false
						this.btnAstrict2 = false
					this.verCode(val.detail.value);
				}
			},

			// 校验手机号
			verCode(val) {
				let reg = /^[1][0-9]{10}$/;
				if (reg.test(val)) {
					ajax.post(config.check_url, {
						username: val,
					}).then(res => {
						console.log(res);
						if (res.code == 0) {
							this.codeShow = false;
							console.log("校验成功");
						} else if (res.code == -7019) {
							this.codeShow = true;
						}
					}).catch(err => {
						console.log("校验手机号接口数据返回失败 error is :" + err);
					})
				} else {
					this.popShow = true;
				}
			},

			// 获取验证码
			codeChange1(text) {
				this.tips1 = text;
			},
			// 获取验证码
			codeChange2(text) {
				this.tips2 = text;
			},
			getCode(type) {
				if (this.username.trim() != '') {
					let reg = /^[1][0-9]{10}$/;
					if (reg.test(this.username)) {
						if (type == 1) {
							if (this.$refs.uCode.canGetCode) {
								if(this.codeTime1) {
									this.codeTime1 = false;
									this.getAuthcode(type);
								}
								setTimeout(() => {
									uni.hideLoading();
									// 这里此提示会被this.start()方法中的提示覆盖
									this.$u.toast('验证码已发送');
									// 通知验证码组件内部开始倒计时
									this.$refs.uCode.start();
								}, 1000);
							}
						} else {
							if (this.$refs.pwdCode.canGetCode) {
								if(this.codeTime2) {
									this.codeTime2 = false;
									this.getAuthcode(type);
								}
								setTimeout(() => {
									uni.hideLoading();
									// 这里此提示会被this.start()方法中的提示覆盖
									this.$u.toast('验证码已发送');
									// 通知验证码组件内部开始倒计时
									this.$refs.pwdCode.start();
								}, 1000);
							}
						}
					} else {
						this.popShow = true;
					}
				} else {
					this.popShow = true;
				}
			},
			getAuthcode(type) {
				ajax.get(config.code_url, {
					phone: this.username,
					type: type
				}).then(res => {
					console.log(res);
					if(type == 1) {
						this.codeTime1 = true;
					} else {
						this.codeTime2 = true;
					}
					if (res.code == 0) {
						console.log("获取验证码成功");
					} else {
						console.log(res);
					}
				}).catch(err => {
					if(type == 1) {
						this.codeTime1 = true;
					} else {
						this.codeTime2 = true;
					}
					console.log("获取验证码接口数据返回失败 error is :" + err);
				})
			},

			// 联系客服
			callUp() {
				uni.makePhoneCall({
					phoneNumber: "0571-82814588"
				})
			},

			// 跳转到货主端app
			goShipper() {
				
				let that = this
				if (plus.os.name == 'Android') {
					plus.runtime.launchApplication({
							pname: 'com.hab.consignor'
						},
						function(e) {
							that.shipperShow = true
						}
					);
				} else if (plus.os.name == 'iOS') {
					plus.runtime.launchApplication({
						action: 'huozhu://'
					}, function(e) {
						that.shipperShow = true
					});
				}
			},

			// 跳转注销
			goLogout() {
				uni.navigateTo({
					url: "/pages/logout/logout?phone=" + this.username,
				});
				this.logoutShow = false;
				this.authcode1 = '';
				this.authcode2 = '';
				this.password = '';
				this.username = '';
				this.$refs.uCode.reset();
				this.$refs.pwdCode.reset();
			},

			// 密码显示隐藏
			passWordShow() {
				this.passwordShow = !this.passwordShow;
			},

			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},

			// 用户注册
			register($type) {
				// $type 1表示手机加验证码登录，2表示手机加密码登录
				this.login($type, 2);
				//注销
				// this.forbiddenShow = true;

			},

			// 用户登录
			login($type, index, $grant_type) {
				//1表示手机加验证码登录，2表示手机加密码登录
				uni.showLoading({
					title: "登陆中"
				});

				// #ifdef APP-PLUS
				let pinf = plus.push.getClientInfo()
				let $cid = pinf.clientid;
				// #endif

				let $code;
				if ($type == 1) {
					this.password = '';
					$code = this.authcode1;
				} else {
					$code = this.authcode2;
				}
				let pwd, grant_type;
				if ($type == 1) {
					this.btnAstrict1 = true;
					pwd = this.authcode1;
					ajax.post(config.login_url, {
						username: this.username,
						password: pwd,
						code: $code,
						grant_type: "validate_code",
						appType: "2",
						// #ifdef APP-PLUS
						cid: $cid,
						// #endif
					}).then(res => {
						console.log(res);
						if (res.code == 0) {
							uni.hideLoading();
							this.$store.commit("getAccessToken", res.data.access_token);
							this.$store.commit("getRefreshToken", res.data.refresh_token);
							uni.setStorage({
								key: 'accessToken',
								data: res.data.access_token,
							});
							uni.setStorage({
								key: 'refreshToken',
								data: res.data.refresh_token,
							});
							uni.setStorage({
								key: 'username',
								data: res.data.username,
							});
							uni.setStorageSync( 'userno', res.data.userno );
							if (res.data.userInfo.type == 1) {
								this.btnAstrict1 = false;
								this.logoutShow = true;
							} else {
								if (res.data.userInfo.isFirst == 0) {
									uni.switchTab({
										url: "/pages/allocation/allocation",
									});
								} else if (res.data.userInfo.isFirst == 1) {
									uni.redirectTo({
										url: "/pages/myAuthentication/myAuthentication?authState=2",
									});
								}
							}
						} else {
							this.btnAstrict1 = false;
							uni.showToast({
								title: "用户名或验证码错误，请重新输入",
								icon: "none",
								duration: 2000
							});
							uni.hideLoading();
						}
					}).catch(err => {
						uni.hideLoading();
						this.btnAstrict1 = false;
						console.log("登录接口数据返回失败 error is :" + err);
					})
				} else {
					// this.btnAstrict2 = true;
					pwd = this.password;
					let data = {
						username: this.username,
						password: pwd,
						grant_type: "password",
						appType: "2",
						// #ifdef APP-PLUS
						cid: $cid,
						// #endif
					}
					if(this.authcode2 != ''){
						data = {
							username: this.username,
							password: pwd,
							grant_type: "password",
							appType: "2",
							code:this.authcode2,
							// #ifdef APP-PLUS
							cid: $cid,
							// #endif
						}
					}
					ajax.post(config.login_url, data).then(res => {
						console.log(res);
						if (res.code == 0) {
							uni.hideLoading();
							this.$store.commit("getAccessToken", res.data.access_token);
							this.$store.commit("getRefreshToken", res.data.refresh_token);
							uni.setStorage({
								key: 'accessToken',
								data: res.data.access_token,
							});
							uni.setStorage({
								key: 'refreshToken',
								data: res.data.refresh_token,
							});
							uni.setStorage({
								key: 'username',
								data: res.data.username,
							});
							uni.setStorageSync( 'userno', res.data.userno );
							if (res.data.userInfo.type == 1) {
								this.btnAstrict1 = false;
								this.logoutShow = true;
							} else {
								if (res.data.userInfo.isFirst == 0) {
									uni.switchTab({
										url: "/pages/allocation/allocation",
									});
								} else if (res.data.userInfo.isFirst == 1) {
									uni.redirectTo({
										url: "/pages/myAuthentication/myAuthentication?authState=2",
									});
								}
							}
						} else {
							this.btnAstrict2 = false;
							uni.showToast({
								title: "用户名或密码错误，请重新输入",
								icon: "none",
								duration: 2000
							});
							uni.hideLoading();
						}
					}).catch(err => {
						uni.hideLoading();
						this.btnAstrict2 = false;
						console.log("登录接口数据返回失败 error is :" + err);
					})
				}

			},

			// 快速登录
			formSubmit1(e) {
				let usernameReg = /^[1][0-9]{10}$/;
				let codeReg = /^[0-9]{6}$/;
				if (usernameReg.test(this.username)) {
					if (codeReg.test(this.authcode1)) {
						this.register(1);
					} else {
						uni.showToast({
							title: "验证码格式错误（格式为6位数字），请重新输入",
							icon: "none",
							duration: 2000
						});
					}
				} else {
					this.popShow = true;
				}
			},

			// 密码登录
			formSubmit2(e) {
				let usernameReg = /^[1][0-9]{10}$/;
				let passwdReg = /^[\w]{6,20}$/;
				let codeReg = /^[0-9]{6}$/;
				if (usernameReg.test(this.username)) {
					if (passwdReg.test(this.password)) {
						if (this.codeShow && this.current == 1) {
							if (codeReg.test(this.authcode2)) {
								this.register(2);
							} else {
								uni.showToast({
									title: "验证码格式错误（格式为6位数字），请重新输入",
									icon: "none",
									duration: 2000
								});
							}
						} else {
							this.register(2);
						}
					} else {
						uni.showToast({
							title: "密码格式错误（格式为除空格、中文外，长度6-20位），请重新输入",
							icon: "none",
							duration: 2000
						});
					}
				} else {
					this.popShow = true;
				}
			}
		}
	}
</script>


<style scoped lang="scss">
	.slot-content {
		height: 300rpx;
		padding: 20rpx;

		.slot-left {
			width: 100%;
			text-align: center;
			font-weight: 600;
			margin-bottom: 5rpx;
		}

		.slot-right {
			padding: 0 20rpx;
			height: 230rpx;
		}
	}

	.yanzhengma {
		font-size: 36rpx;
		margin-left: 18rpx;
		color: #333333;
	}

	.shouji {
		font-size: 40rpx;
		margin-left: 14rpx;
		color: #333333;
	}

	.loginContent {
		min-height: 100vh;
		width: 100%;
		overflow: hidden;

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
				height: 90rpx;
				border: 2rpx solid #DDDDDD;
			}
		}

		.loginHeader {
			width: 100%;
			margin-bottom: 30rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
			align-items: center;
			margin-top: 150rpx;

			.logoImg {
				width: 274.65rpx;
				height: 130rpx;
			}

			.logoTitle {
				height: 54rpx;
				line-height: 54rpx;
				font-size: 40rpx;
				font-weight: 500;
				color: #FB6E2F;
			}
		}

		.loginForm {
			width: 90%;
			height: 674rpx;
			margin: 0 auto;

			.swiper-height {
				height: 460rpx;
				background: #ffffff;
				border: 2rpx solid #E2E2E2;
				border-radius: 8rpx;
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

			.hintBts {
				width: 85%;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				font-size: 32rpx;
				background: #FFC24D;
				color: #333333;
				position: relative;
				top: 150rpx;
			}

			.por {
				width: 92%;
				background: #FFFFFF;
				padding: 46rpx 0 50rpx 0;
				margin: 0 auto;

				.loginButton {
					background: #DDDDDD !important;
					color: #333333;
				}

				.inputView {
					width: 100%;
					height: 76rpx;
					background: #F1F2F6;
					border: 2rpx solid #DDDDDD;
					border-radius: 8rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;

					.inpsty {
						font-size: 28rpx;
						color: #999999;
					}

					.inputViewCon {
						display: flex;
						justify-content: flex-start;
						align-items: center;
					}
				}

				.inputView2 {
					width: 100%;
					height: 76rpx;
					background: #F1F2F6;
					border: 2rpx solid #DDDDDD;
					border-radius: 8rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.inputViewCon {
						height: 100%;
						display: flex;
						justify-content: flex-start;
						align-items: center;

						.inpsty {
							font-size: 28rpx;
							color: #999999;
						}
					}

					.inputViewCon2 {
						display: flex;
						justify-content: center;
						align-items: center;

						.zhengyan {
							font-size: 43rpx;
							margin-left: 18rpx;
							color: #626161;
						}

						.yanjing {
							font-size: 23rpx;
							margin-left: 18rpx;
							color: #626161;
						}

						.authcodes {
							text-align: center;
							width: 100%;
							line-height: 32rpx;
							border-left: 2rpx solid #DDDDDD;
							height: 32rpx;
							font-size: 24rpx;
							color: #FB6E2F;
						}

					}
				}
			}

			.loginFormFooter {
				width: 100%;
				margin-top: 30rpx;
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;

				.loginFormText {
					width: 90%;
					font-size: 24rpx;

					text {
						color: #F96F2B;
					}
				}

				.logoutAgree {
					margin: 5rpx 10rpx 0 0;
					width: 36rpx;
					height: 36rpx;
					border: 2rpx solid #999999;
					border-radius: 50%;
					display: flex;
					justify-content: center;
					align-items: center;

					.logoutAgreeYuan {
						width: 20rpx;
						height: 20rpx;
						background: #F96F2B;
						border-radius: 50%;
					}
				}

				.logoutAgreess {
					border: 2rpx solid #F96F2B;
				}
			}
		}

		.loginFooter {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			position: absolute;
			bottom: 30rpx;
			left: 0;

			.loginFooterLeft {
				width: 300rpx;
				height: 0rpx;
				border: 2rpx solid #DDDDDD;
			}

			.loginFooterCon {
				width: 300rpx;
				height: 100%;
				
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.loginFooterCon-text1 {
					height: 35rpx;
					font-size: 28rpx;
					color: #666666;
					line-height: 35rpx;
				}
				.loginFooterCon-text2 {
					height: 35rpx;
					font-size: 20rpx;
					color: #666666;
					line-height: 35rpx;
				}
			}

			.loginFooterRight {
				width: 300rpx;
				height: 0rpx;
				border: 2rpx solid #DDDDDD;
			}
		}
	}
</style>
