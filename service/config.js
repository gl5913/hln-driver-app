let API10 = "/API10/"
let API20 = "/API20/"
let API40 = "/API40/"
let API41 = "/API41/"
let ip = "/ip/"

let mock = "/mock/"
// let mock = "/api/"
//#ifdef APP-PLUS
// mock = "http://savvyray.oicp.net/"
// API10 = "http://yapi.hangliu.com.cn/mock/64/hab-app/"
// API40 = "http://yapi.hangliu.com.cn/mock/118/4.0/boss/v4/"
// API41 = "http://yapi.hangliu.com.cn/mock/141/4.0/boss/v4/"
// API41 = "http://hab.hangliu.com.cn/hln-api/v4/"
// API40 = "http://hab.hangliu.com.cn/hln-api/v4/"
// API20 = "http://hab.hangliu.com.cn/hab-app-2/"
// API10 = "http://hab.hangliu.com.cn/hab-app/"
mock = "http://yapi.hangliu.com.cn/mock/118/4.0/boss/v4/"
// API41 = "http://pretest.hangliu.com.cn/hln-api/v4/"
// API40 = "http://pretest.hangliu.com.cn/hln-api/v4/"
// API20 = "http://pretest.hangliu.com.cn/hln-api/"
// API10 = "http://pretest.hangliu.com.cn/hln-api/"
// API40 = "http://z340423c48.imdo.co/v4/"
// API20 = "http://z340423c48.imdo.co/"
// API10 = "http://z340423c48.imdo.co/"
// API40 = "https://hz-hln-api.hangliu.com.cn/hln-api/v4/"
// API20 = "https://hz-hln-api.hangliu.com.cn/hln-api/"
// API10 = "https://hz-hln-api.hangliu.com.cn/hln-api/"
API41 = "https://api.clicksync.cn/hln-app/v4/"
API40 = "https://api.clicksync.cn/hln-app/v4/"
API20 = "https://api.clicksync.cn/hln-app/"
API10 = "https://api.clicksync.cn/hln-app/"
ip = "http://pv.sohu.com/"
// mock = "https://api.clicksync.cn/hab-app/"
// mock = "http://z340423c48.imdo.co/"
//#endif
const config = {
	
	// 协议文案
	agreement_url: API10 + 'basic-data/protocol',
	
	// 用户登录/注销
	//reg-login
	login_url: API10 + "reg-login", //用户登录
	check_url: API10 + "face-user/check", //用户校验
	driver_url: API10 + "face-user/registered", //用户注册
	code_url: API10 + "authentication/verification-code", //获取验证码
	logout_url: API10 + "face-user/delete-username", //用户注销
	refresh_url: API10 + "token/refresh", //刷新tokon

	// 认证
	uploadOss_url: API10 + "authentication/upload-oss", //oss图片上传
	faceHuman_url: API10 + "authentication/business-license-face", //人脸认证
	realAuth_url: API10 + "authentication/approve", //实名认证
	
	// 配置接口
	carModel_url: API10 + "basic-data/car-model", //车型列表
	carConductor_url: API10 + "basic-data/car-conductor", //车长列表
	transportNature_url: API10 + "basic-data/transport-nature", //运输性质
	region_url: API10 + "basic-data/region", //区域列表
	regionTree_url: API10 + "basic-data/region-tree", //区域树
	bdGoodsType_url: API10 + "basic-data/bd-goods-type", //货源类型列表
	rateType_url: API10 + "basic-data/order-evaluation-type", //评价类型
	gpsPush_url: API10 + "order-management/gps-push", //gps数据推送
	serverTime_url: API10 + "face-user/getTime", //服务器时间
	version_url: API10 + "personal-center/version", //版本更新
  
	// 配货大厅
	freightCargo_url: API10 + "distribution-hall/freight-cargo", //货源列表/货源详情
	cargoSearchRecord_url: API10 + "cargo-browse-records/cargo-search-record", //找货记录列表
	distributionLine_url: API10 + "distribution-hall/distribution-line", //常用路线列表、常用路线删除、常用路线新增、常用路线修改
	allStates_url: API10 + "cargo-browse-records/get-all-states", //根据货源id获取订单和货源的状态信息
	
	//我的订单
	order_url: API10 + "order-management/freight-shipping-order", //抢单支付定金/订单列表/订单详情/订单取消/订单运输完成/订单上传图片/司机确认支付定金/查看退款流程/司机确认待退款
	rate_url: API10 + "order-management", //订单评价
	// driverIntro_url: API10 + "order-management/cargo-owner", //货主简介/简介评论信息
	driverIntro_url: API10 + "order-management/introduction", //货主/司机简介
	driverFaceIntro_url: API10 + "order-management/evaluation-list", //货主/司机查看评价列表
	refuse_url: API10 + "order-management/refuse", //指定货源拒绝承运
	
	// 消息中心
	message_url: API10 + "message/freight-message-notification", //消息列表、消息详情、清除未读消息
	
	// 用户中心
	userMess_url: API10 + "face-user/info", //我的信息
	headPortrai_url: API10 + "personal-center/head-portrait", //头像修改
	contactPhone_url: API10 + "personal-center/freight-contact-phone", //联系号码列表/联系号码删除/联系号码新增
	changePwd_url: API10 + "personal-center/passwd", //修改密码
	// driverCar_url: API10 + "personal-center/face-driver-car", //车辆列表/车辆删除/车辆新增/车辆修改
	driverCar_url: API10 + "personal-center/face-driver-car", //车辆列表/车辆删除/车辆新增/车辆修改
	phoneVerify_url: API10 + "personal-center/phone", //手机号码验证/手机号码修改
	wallet_url: API10 + "personal-center/freight-wallet-account", //钱包详情
	transaction_url: API10 + "personal-center/freight-wallet-transaction", //账单明细/账单详情
	account_url: API10 + "account/recharge", //充值
	phoneList_url: API10 + "contact-phone/list", //联系电话列表
	withdraw_url: API10 + "face-user/transfer-accounts", //提现
	withdrawVerify_url: API10 + "face-user/withdrawal", //提现手机号验证
	
	// 2.0上传接口
	recognition_url: API20 + "oss/recognition", //图像识别
	fileBase64_url: API20 + "oss/upload/file/base64", //base64方式文件上传
	
	// 4.0冷链接口
	coldState_url: API40 + "driver/order",   // 获取订单基本信息以及状态
	coldCustomerSort_url: API40 + "driver/order-out/customer-sort",   // 出库订单-根据运输订单获取门店（装货：倒序，卸货：顺序）
	coldCustomerLoading_url: API40 + "driver/order-out/customer-loading",   // 出库订单-门店货物装卸货完成
	coldPre_url: API40 + "driver/pre",   // 获取预约详情
	coldInterval_url: API40 + "driver/pre/interval",   // 获取预约时间段
	coldAddPre_url: API40 + "driver/pre",   // 添加预约计划
	coldUpPre_url: API40 + "driver/update/pre",   // 修改预约计划
	driverList_url: API40 + "driver/pre-get-driver",   // 有订单预约获取司机列表
	preReport_url: API40 + "temp/my-pre-report",   // 获取我的预约统计
	preList_url: API40 + "temp/my-pre-list",   // 预约大厅
	driverNeed_url: API40 + "temp/get-need-duration",   // 无订单预约获取司机列表
	repertory_url: API40 + "temp/get-repertory",   // 无订单预约根据仓库id查询epCode名称和仓库名称 
	tempDriver_url: API40 + "temp/add-temp-pre-by-driver",   // 无订单预约保存预约
	// 数据字典
	dictionary_url: API40 + 'bd/dict-menu', 
	
	// 获取用户ip
	ip_url: ip + "cityjson?ie=utf-8",
	// 埋点
	buryingPoint_url: API40 + "burying-point",
	
	// 获取收款码
	receivingCode_url: API41 + "receivingCode",
	// 获取收款码状态（查询支付结果）
	paymentStatus_url: API41 + "paymentStatus"
}

module.exports = config

// 
