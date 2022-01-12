<template>
	<view class="orderDetails">
		<u-navbar :custom-back="goBack" back-text="" title="订单详情" :border-bottom="false"></u-navbar>
		<view class="orderCont" :style="orderDetails.orderState == 1 || orderDetails.orderState == 2 || orderDetails.orderState == 5 ? magBot : ''">
			<!-- 订单标题 -->
			<view class="orderCont-tit">
				<view class="orderCont-tit-left" v-if="orderDetails.orderState == 1 || orderDetails.orderState == 2">
					<view class="orderCont-tit-left-top">待确认</view>
					<view class="orderCont-tit-left-bot">等待货主选择确认...</view>
				</view>
				<view class="orderCont-tit-left" v-if="orderDetails.orderState == 5 || orderDetails.orderState == 6">
					<view class="orderCont-tit-left-top">
						运输中
						<text v-if="orderDetails.orderFreightCargoDTO.extendedField && subscribeInfo.isPre == 1 && subscribeInfo.preInfo.temperature" class="orderCont-tit-left-top-text">司机体温</text>
						<text v-if="orderDetails.orderFreightCargoDTO.extendedField && subscribeInfo.isPre == 1 && subscribeInfo.preInfo.temperature" class="orderCont-tit-left-top-val">{{ subscribeInfo.preInfo.temperature }}℃</text>
					</view>
					<view class="orderCont-tit-left-bot">货主已确认等待运输完成...</view>
				</view>
				<view class="orderCont-tit-left" v-if="orderDetails.orderState == 8">
					<view class="orderCont-tit-left-top">待支付</view>
					<view class="orderCont-tit-left-bot">待货主支付运输费用...</view>
				</view>
				<view class="orderCont-tit-left" v-if="orderDetails.orderState == 9">
					<view class="orderCont-tit-left-top">待评价</view>
					<view class="orderCont-tit-left-bot">运费支付完成等待您的评价...</view>
				</view>
				<view class="orderCont-tit-left" v-if="orderDetails.orderState == 11">
					<view class="orderCont-tit-left-top">已取消</view>
					<!-- <view class="orderCont-tit-left-bot">运费支付完成等待您的评价...</view> -->
				</view>
				<view class="orderCont-tit-left" v-if="orderDetails.orderState == 10">
					<view class="orderCont-tit-left-top">已完成</view>
					<view class="orderCont-tit-left-bot">共耗时{{ orderDetails.totalCompletionTime }}...</view>
				</view>
				<view class="orderCont-tit-left" v-if="orderDetails.orderState == 3 || orderDetails.orderState == 4 || orderDetails.orderState == 7">
					<view class="orderCont-tit-left-top">订单已取消退款中</view>
					<view class="orderCont-tit-left-bot">此订单已进入退款流程...</view>
				</view>
				<view class="orderCont-tit-rig" v-if="orderDetails.orderState == 1 || orderDetails.orderState == 2">
					<Icon :iconType="'iconshalou'" extClass="shalou"></Icon>
				</view>
				<view class="orderCont-tit-rig" v-if="orderDetails.orderState == 5 || orderDetails.orderState == 6">
					<Icon :iconType="'iconzongheHuoyunwuliu'" extClass="shalou"></Icon>
				</view>
				<view class="orderCont-tit-rig" v-if="orderDetails.orderState == 8">
					<Icon :iconType="'iconzhifu'" extClass="shalou"></Icon>
				</view>
				<view class="orderCont-tit-rigs" v-if="orderDetails.orderState == 9" @click="evaluateing(orderDetails.orderState)">
					<Icon :iconType="'iconpingjia1'" extClass="pingjia1"></Icon>
					<view style="font-size: 24rpx; color: #333333; height: 32rpx; line-height: 32rpx;">立即评价</view>
				</view>
				<!-- <view @click="lookFlow(orderDetails.freightOrderId)" class="orderCont-tit-rigs" v-if="orderDetails.orderState == 3 || orderDetails.orderState == 4 || orderDetails.orderState == 7 || orderDetails.orderState == 11">
					<Icon :iconType="'icontuikuan1'" extClass="pingjia1"></Icon>
					<view style="font-size: 24rpx; color: #333333; height: 32rpx; line-height: 32rpx;">查看流程</view>
				</view> -->
				<view class="orderCont-tit-rig" v-if="orderDetails.orderState == 3 || orderDetails.orderState == 4 || orderDetails.orderState == 7 || orderDetails.orderState == 11">
					<Icon :iconType="'iconquxiao1'" extClass="shalou"></Icon>
				</view>
				<view class="orderCont-tit-rig" v-if="orderDetails.orderState == 10">
					<Icon :iconType="'iconwancheng1'" extClass="shalou"></Icon>
				</view>
			</view>

			<!-- 评价信息 -->
			<view class="orderCont-rate" v-if="(orderDetails.orderState == 10 || orderDetails.orderState == 9) && orderDetails.orderEvaluationList">
				<view class="orderCont-rates" v-for="(item,index) of orderDetails.orderEvaluationList" :key="index">
					<view class="orderCont-rate-both" :style="[index != orderDetails.orderEvaluationList.length - 1 ? borderStyle : '']">
						<view class="orderCont-rate-both-top">
							<view v-if="item.type == 1">货主评价</view>
							<view v-else>司机评价</view>
							<u-rate :disabled="true" inactive-icon="star-fill" min-count="1" inactive-color="#E6E6E6" active-color="#FEC24D"
							 size="30" :count="starCount" v-model="item.score"></u-rate>
						</view>
						<view class="orderCont-rate-both-bot" v-if="item.typeList">
							<view class="orderCont-rate-both-bot-con" v-for="(item,index) of item.typeList" :key="item.name">{{ item.name }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 装卸信息 -->
			<view class="orderCont-load">
				<view class="orderCont-load-top">
					<view class="orderCont-load-top-rig" v-for="(item,index) of loadSite" :key="'load' + item.cityName">
						<view class="orderCont-load-top-rig-left">
							<view class="orderCont-load-top-left-con">起</view>
							<view class="orderCont-load-top-left-con-tit">
								<view style="height: 25rpx; line-height: 25rpx;">
									<text class="orderCont-load-top-rig-left-tit-item" style="margin-right: 10rpx;">{{ item.cityName }}</text>
									<text class="orderCont-load-top-rig-left-tit-item">{{ item.regionName }}</text>
								</view>
								<view class="orderCont-load-top-rig-left-text">{{ item.provinceName }}{{ item.cityName }}{{ item.regionName }}{{ item.address }}</view>
							</view>
						</view>
						<view class="orderCont-load-top-rig-rig" @click="navigationOpenMap(item)">
							<view class="orderCont-load-top-rig-rig-left"></view>
							<view class="orderCont-load-top-rig-rig-rig">
								<view class="site-content-bot-both-right-rig-img">
									<Icon :iconType="'icondaohang2'" extClass="daohang2"></Icon>
								</view>
								<view class="orderCont-load-top-rig-rig-text">装货导航</view>
							</view>
						</view>
					</view>
					<view class="orderCont-load-top-rigss" v-for="(item,index) of unloadSite" :key="'unload' + item.cityName">
						<view class="orderCont-load-top-rig-left">
							<view class="orderCont-load-top-left-con" style="background-color: #F84F1D;">终</view>
							<view class="orderCont-load-top-left-con-tit">
								<view style="height: 25rpx; line-height: 25rpx;">
									<text class="orderCont-load-top-rig-left-tit-item" style="margin-right: 10rpx;">{{ item.cityName }}</text>
									<text class="orderCont-load-top-rig-left-tit-item">{{ item.regionName }}</text>
								</view>
								<view class="orderCont-load-top-rig-left-text">{{ item.provinceName }}{{ item.cityName }}{{ item.regionName }}{{ item.address }}</view>
							</view>
						</view>
						<view class="orderCont-load-top-rig-rig" v-if="index == 0" @click="pathOpenMap(orderDetails.orderFreightCargoDTO.freightCargorLoadingAddress)">
							<view class="orderCont-load-top-rig-rig-left"></view>
							<view class="orderCont-load-top-rig-rig-rig">
								<view class="site-content-bot-both-right-rig-img" style="border: 2rpx solid #db791e;">
									<Icon :iconType="'iconchakanluxian1'" extClass="chakanluxian1"></Icon>
								</view>
								<view class="orderCont-load-top-rig-rig-text" style="color: #DB791E;">查看路线</view>
							</view>
						</view>
					</view>
				</view>
				<view class="orderCont-load-bot" v-if="(orderDetails.orderState == 5 || orderDetails.orderState == 6) && orderDetails.orderFreightCargoDTO.extendedField && subscribeInfo.isPre == 1">
					<view class="orderCont-load-bottop" style="border-bottom: none;">
						<view class="orderCont-load-bot-left">{{ orderDetails.orderFreightCargoDTO.goodsTypeName }}，{{ orderDetails.orderFreightCargoDTO.weight }}吨，{{ orderDetails.orderFreightCargoDTO.volume }}方，{{ orderDetails.orderFreightCargoDTO.packagingTypeName }}</view>
						<!-- <view class="orderCont-load-bot-rig">{{ orderDetails.orderFreightCargoDTO.handlingTypeName }}</view> -->
					</view>
					<view class="orderCont-load-bottop">
						<view class="orderCont-load-bot-left">{{ subscribeInfo.transportType == 1 ? "卸货" : "装货" }}仓库：{{ subscribeInfo.repertoryName }}</view>
						<view class="orderCont-load-bot-rig" style="color: #DB791E;">{{ subscribeInfo.status == 1 || subscribeInfo.status == 6 ? "未预约站台" : subscribeInfo.preInfo.platformName }}</view>
					</view>
					<view class="orderCont-load-bots">
						<view>
							<view class="orderCont-load-botbot">
								<view class="orderCont-load-botbot-both">装货时间：{{ subscribeInfo.onTime }}
									<text class="left" v-show="subscribeInfo.transportType == 2">{{ subscribeInfo.status == 1 || subscribeInfo.status == 6 ? "" : subscribeInfo.preInfo.preSlot }}</text>
									<text class="right" v-show="subscribeInfo.transportType == 2">{{ subscribeInfo.status == 1 || subscribeInfo.status == 6 ? "(未预约)" : subscribeInfo.status == 2 ? "(已预约)" : "" }}</text>
								</view>
							</view>
							<view class="orderCont-load-botbot">
								<view class="orderCont-load-botbot-both">卸货时间：{{ subscribeInfo.offTime }}
									<text class="left" v-show="subscribeInfo.transportType == 1">{{ subscribeInfo.status == 1 || subscribeInfo.status == 6 ? "" : subscribeInfo.preInfo.preSlot }}</text>
									<text class="right" v-show="subscribeInfo.transportType == 1">{{ subscribeInfo.status == 1 || subscribeInfo.status == 6 ? "(未预约)" : subscribeInfo.status == 2 ? "(已预约)" : "" }}</text>
								</view>
							</view>
						</view>
						<view class="listMid-right" :class="{loginButton: subscribeInfo.status == 6}" v-show="subscribeInfo.status == 1 || subscribeInfo.status == 6" @click="stateGo(subscribeInfo.status)">
							<Icon :iconType="'iconqiangdan'" extClass="qiangdan"></Icon>
							<view class="listMid-right-btn">立即预约</view>
						</view>
						<view class="listMid-right" v-show="subscribeInfo.status == 2" @click="stateGo(subscribeInfo.status)">
							<u-icon name="eye" size="45"></u-icon>
							<view class="listMid-right-btn">查看预约</view>
						</view>
						<view class="listMid-right" v-show="subscribeInfo.status == 3" @click="stateGo(subscribeInfo.status)">
							<Icon :iconType="'iconhand'" extClass="qiangdan" style="font-size: 40rpx;"></Icon>
							<view class="listMid-right-btn">去装货</view>
						</view>
						<view class="listMid-right" v-show="subscribeInfo.status == 4" @click="stateGo(subscribeInfo.status)">
							<Icon :iconType="'iconhand'" extClass="qiangdan" style="font-size: 40rpx;"></Icon>
							<view class="listMid-right-btn">去卸货</view>
						</view>
					</view>
				</view>
				<view class="orderCont-load-bot" v-else>
					<view class="orderCont-load-bottop">
						<view class="orderCont-load-bot-left">{{ orderDetails.orderFreightCargoDTO.goodsTypeName }}，{{ orderDetails.orderFreightCargoDTO.weight }}吨，{{ orderDetails.orderFreightCargoDTO.volume }}方，{{ orderDetails.orderFreightCargoDTO.packagingTypeName }}</view>
						<view class="orderCont-load-bot-rig">{{ orderDetails.orderFreightCargoDTO.handlingTypeName }}</view>
					</view>
					<view class="orderCont-load-botbot">
						<view class="orderCont-load-botbot-both">装货时间：{{ orderDetails.orderFreightCargoDTO.appointedTime }}</view>
					</view>
					<view class="orderCont-load-botbot" v-if="orderDetails.orderFreightCargoDTO.unloadingTime">
						<view class="orderCont-load-botbot-both">卸货时间：{{ orderDetails.orderFreightCargoDTO.unloadingTime }}</view>
					</view>
				</view>
			</view>

			<!-- 运费信息 -->
			<view class="orderCont-freight">
				<view class="orderCont-freight-tit">运费信息</view>
				<view class="orderCont-freight-cont">
					<view class="orderCont-freight-cont-item" style="border-top: none;">
						<view class="orderCont-freight-cont-item-left">货物运费</view>
						<view class="orderCont-freight-cont-item-rig">{{ parseFloat(orderDetails.freightReceivable).toFixed(2) }}元</view>
					</view>
					<view class="orderCont-freight-cont-item">
						
						<view class="orderCont-freight-cont-item-left">定金</view>
						<view class="orderCont-freight-cont-item-rig">
							<text v-if="orderDetails.orderFreightCargoDTO.refundMethod == 1 && (orderDetails.orderState == 9 || orderDetails.orderState == 10 || orderDetails.orderState == 11)" style="margin-right: 10rpx; color: #FB6E2F;">已退还</text>
							<text v-if="orderDetails.orderFreightCargoDTO.refundMethod == 2 && (orderDetails.orderState == 9 || orderDetails.orderState == 10 || orderDetails.orderState == 11)" style="margin-right: 10rpx; color: #FB6E2F;">不退还</text>
							{{ parseFloat(orderDetails.deposit).toFixed(2) }}元
						</view>
					</view>
					<!-- <view v-if="orderDetails.orderState != 11" class="orderCont-freight-cont-items">已支付定金(退还)<text class="orderCont-freight-cont-itemss">{{ parseFloat(orderDetails.deposit).toFixed(2) }}元</text></view> -->
				</view>
			</view>

			<!-- 运输凭证 -->
			<view class="orderCont-freight" v-if="orderDetails.loadingImagePath != null || orderDetails.unLoadingImagePath != null || orderDetails.receiptImagePath != null || orderDetails.orderState == 5">
				<view class="orderCont-freight-tit">运输凭证</view>
				<view class="orderCont-voucher-cont">
					<view class="orderCont-voucher-cont-item">
						<view v-if="orderDetails.loadingImagePath == null && orderDetails.orderState == 5">
							<view class="orderCont-voucher-cont-item-left" @click="addImg" data-img="1"></view>
						</view>
						<view v-else class="orderCont-voucher-cont-item-lefts" @click="imgMagnify(0)">
							<image class="image" :src="orderDetails.loadingImagePath" mode="aspectFit"></image>
						</view>
						<view class="orderCont-voucher-cont-item-rig" @click="addImg" data-img="1" v-if="orderDetails.loadingImagePath == null">
							<view class="orderCont-voucher-cont-item-rig-text" style="font-size: 28rpx; color: #2E95FA;">点击上传 装货照片</view>
							<view class="orderCont-voucher-cont-item-rig-text">货物装车清晰可见</view>
							<view class="orderCont-voucher-cont-item-rig-text">同时照片需要运输驾驶员同框</view>
						</view>
						<view class="orderCont-voucher-cont-item-rig" @click="addImg" data-img="1" v-if="orderDetails.loadingImagePath != null && orderDetails.orderState == 5">
							<view class="orderCont-voucher-cont-item-rig-text" style="font-size: 28rpx; color: #2E95FA;">重新上传 装货照片</view>
							<view class="orderCont-voucher-cont-item-rig-text">货物装车清晰可见</view>
							<view class="orderCont-voucher-cont-item-rig-text">同时照片需要运输驾驶员同框</view>
						</view>
						<view class="orderCont-voucher-cont-item-rig" @click="imgMagnify(0)" v-if="orderDetails.loadingImagePath != null && orderDetails.orderState != 5">
							<view class="orderCont-voucher-cont-item-rig-text" style="font-size: 28rpx; color: #2E95FA;">点击查看 装货照片</view>
							<view class="orderCont-voucher-cont-item-rig-text">货物装车清晰可见</view>
							<view class="orderCont-voucher-cont-item-rig-text">同时照片需要运输驾驶员同框</view>
						</view>
					</view>
					
					<view class="orderCont-voucher-cont-item">
						<view v-if="orderDetails.unLoadingImagePath == null && orderDetails.orderState == 5">
							<view class="orderCont-voucher-cont-item-left" @click="addImg" data-img="2"></view>
						</view>
						<view v-else class="orderCont-voucher-cont-item-lefts" @click="imgMagnify((!orderDetails.loadingImagePath && !orderDetails.receiptImagePath) || (!orderDetails.loadingImagePath && orderDetails.receiptImagePath) ? 0 : 1)">
							<image class="image" :src="orderDetails.unLoadingImagePath" mode="aspectFit"></image>
						</view>
						<view class="orderCont-voucher-cont-item-rig" @click="addImg" data-img="2" v-if="orderDetails.unLoadingImagePath == null">
							<view class="orderCont-voucher-cont-item-rig-text" style="font-size: 28rpx; color: #2E95FA;">点击上传 卸货照片</view>
							<view class="orderCont-voucher-cont-item-rig-text">货物卸车清晰可见</view>
							<view class="orderCont-voucher-cont-item-rig-text">同时照片需要运输驾驶员同框</view>
						</view>
						<view class="orderCont-voucher-cont-item-rig" @click="addImg" data-img="2" v-if="orderDetails.unLoadingImagePath != null && orderDetails.orderState == 5">
							<view class="orderCont-voucher-cont-item-rig-text" style="font-size: 28rpx; color: #2E95FA;">重新上传 卸货照片</view>
							<view class="orderCont-voucher-cont-item-rig-text">货物卸车清晰可见</view>
							<view class="orderCont-voucher-cont-item-rig-text">同时照片需要运输驾驶员同框</view>
						</view>
						<view class="orderCont-voucher-cont-item-rig" @click="imgMagnify(!orderDetails.loadingImagePath && !orderDetails.receiptImagePath ? 0 : 1)" v-if="orderDetails.unLoadingImagePath != null && orderDetails.orderState != 5">
							<view class="orderCont-voucher-cont-item-rig-text" style="font-size: 28rpx; color: #2E95FA;">点击查看 卸货照片</view>
							<view class="orderCont-voucher-cont-item-rig-text">货物卸车清晰可见</view>
							<view class="orderCont-voucher-cont-item-rig-text">同时照片需要运输驾驶员同框</view>
						</view>
					</view>
					
					<view class="orderCont-voucher-cont-item" v-if="orderDetails.orderFreightCargoDTO.paymentMethod == 2 && !orderDetails.orderFreightCargoDTO.extendedField">
						<view v-if="orderDetails.receiptImagePath == null && orderDetails.orderState == 5">
							<view class="orderCont-voucher-cont-item-left" @click="addImg" data-img="3"></view>
						</view>
						<view v-else class="orderCont-voucher-cont-item-lefts" @click="imgMagnify(!orderDetails.loadingImagePath && !orderDetails.unLoadingImagePath ? 0 : (orderDetails.loadingImagePath && !orderDetails.unLoadingImagePath) || (!orderDetails.loadingImagePath && orderDetails.unLoadingImagePath) ? 1 : orderDetails.loadingImagePath && orderDetails.unLoadingImagePath ? 2 : '')">
							<image class="image" :src="orderDetails.receiptImagePath" mode="aspectFit"></image>
						</view>
						<view class="orderCont-voucher-cont-item-rig" @click="addImg" data-img="3" v-if="orderDetails.receiptImagePath == null">
							<view class="orderCont-voucher-cont-item-rig-text" style="font-size: 28rpx; color: #2E95FA;">点击上传 回单照片</view>
							<view class="orderCont-voucher-cont-item-rig-text">回执单内容清晰可见</view>
							<view class="orderCont-voucher-cont-item-rig-text">回执单边框完整</view>
						</view>
						<view class="orderCont-voucher-cont-item-rig" @click="addImg" data-img="3" v-if="orderDetails.receiptImagePath != null && orderDetails.orderState == 5">
							<view class="orderCont-voucher-cont-item-rig-text" style="font-size: 28rpx; color: #2E95FA;">重新上传 回单照片</view>
							<view class="orderCont-voucher-cont-item-rig-text">回执单内容清晰可见</view>
							<view class="orderCont-voucher-cont-item-rig-text">回执单边框完整</view>
						</view>
						<view class="orderCont-voucher-cont-item-rig" @click="imgMagnify(!orderDetails.loadingImagePath && !orderDetails.unLoadingImagePath ? 0 : (orderDetails.loadingImagePath && !orderDetails.unLoadingImagePath) || (!orderDetails.loadingImagePath && orderDetails.unLoadingImagePath) ? 1 : orderDetails.loadingImagePath && orderDetails.unLoadingImagePath ? 2 : '')" v-if="orderDetails.receiptImagePath != null && orderDetails.orderState != 5">
							<view class="orderCont-voucher-cont-item-rig-text" style="font-size: 28rpx; color: #2E95FA;">点击查看 回单照片</view>
							<view class="orderCont-voucher-cont-item-rig-text">回执单内容清晰可见</view>
							<view class="orderCont-voucher-cont-item-rig-text">回执单边框完整</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 货主信息 -->
			<view class="orderCont-shipper" @click="goBrief">
				<view class="orderCont-freight-tit">货主信息</view>
				<view class="listBots">
					<view class="listBots-left">
						<view class="listBots-left-left">
							<image v-if="orderDetails.orderFreightCargoDTO.cargoOwner.headPortrait != null" style="width: 54rpx; height: 54rpx; border-radius: 50%; border: 2rpx solid #fff;" :src="orderDetails.orderFreightCargoDTO.cargoOwner.headPortrait"></image>
							<image v-else style="width: 54rpx; height: 54rpx; border-radius: 8rpx;" src="../../static/img47.png"></image>
						</view>
						<view class="listBots-left-right">
							<view class="listBots-con">
								<view class="listBots-con1">货主</view>
								<view class="listBots-con1">|</view>
								<view class="listBots-con1">{{ orderDetails.orderFreightCargoDTO.cargoOwner.nickname }}</view>
							</view>
							<view class="listBots-con">
								<view class="listBots-con2">交易{{ orderDetails.orderFreightCargoDTO.cargoOwner.tradingVolume }}</view>
								<view class="listBots-con2">{{ orderDetails.orderFreightCargoDTO.cargoOwner.turnoverRate < 50 ? '成交率低' : '成交率高'}}</view>
								<view class="listBots-con2">好评率{{ orderDetails.orderFreightCargoDTO.cargoOwner.highPraiseRate }}%</view>
							</view>
						</view>
					</view>
					<view class="listBots-right" @click.stop="ringUp(orderDetails.orderFreightCargoDTO.creator)">
						<Icon :iconType="'icondianhua'" extClass="dianhua"></Icon>
					</view>
				</view>
			</view>

			<!-- 其他信息 -->
			<view class="orderCont-freight">
				<view class="orderCont-freight-tit">其他信息</view>
				<view class="orderCont-freight-cont" style="padding: 10rpx 20rpx;">
					<view class="orderCont-freight-cont-item" style="border-top: none;">
						<view class="orderCont-freight-cont-item-left">订单编号</view>
						<view class="orderCont-freight-cont-item-rig">{{ orderDetails.orderNo }}</view>
					</view>
					<view class="orderCont-freight-cont-item">
						<view class="orderCont-freight-cont-item-left">创建时间</view>
						<view class="orderCont-freight-cont-item-rig">{{ orderDetails.createTime }}</view>
					</view>
					<view class="orderCont-freight-cont-item" v-if="orderDetails.orderState == 9 || orderDetails.orderState == 10">
						<view class="orderCont-freight-cont-item-left">支付方式</view>
						<view class="orderCont-freight-cont-item-rig">{{ orderDetails.remake == 'PURSE_PAY' ? '钱包' : orderDetails.remake == 'ALY_PAY' ? '支付宝' : orderDetails.remake == 'WEIXIN_PAY' ? '微信支付' : orderDetails.remake == 'UNION_PAY' ? '银联' : '' }}</view>
					</view>
					<view class="orderCont-freight-cont-item" v-if="orderDetails.orderState == 11 && orderDetails.canceReasonsName != null">
						<view class="orderCont-freight-cont-item-left">取消原因</view>
						<view class="orderCont-freight-cont-item-rig">{{ orderDetails.canceReasonsName }}</view>
					</view>
					<view class="orderCont-freight-cont-item" v-if="orderDetails.orderState == 11">
						<view class="orderCont-freight-cont-item-left">取消时间</view>
						<view class="orderCont-freight-cont-item-rig">{{ orderDetails.updateTime }}</view>
					</view>
				</view>
			</view>
			<!-- <button v-if="orderDetails.orderState == 8" class="Button" @click="affirmPay">支付完成</button> -->
		</view>
		
		<!-- 操作按钮 -->
		<view class="btnStyle" v-if="orderDetails.orderState == 1 || orderDetails.orderState == 2 || orderDetails.orderState == 5">
			<button v-if="orderDetails.orderState == 1 || orderDetails.orderState == 2" class="Button" @click="callShow = true">取消订单</button>
			
			<view style="width: 100%;" v-if="orderDetails.orderState == 5 && orderDetails.orderFreightCargoDTO.extendedField && subscribeInfo.isPre == 1">
				<button
					:disabled="orderDetails.loadingImagePath == null || orderDetails.unLoadingImagePath == null || subscribeInfo.process == 0" 
					style="background: #FFC24D;"
					class="submitBtn"
					:class="{loginButton: orderDetails.loadingImagePath == null || orderDetails.unLoadingImagePath == null || subscribeInfo.process == 0}" 
					@click="goUnpaid"
				>运输完成</button>
			</view>
			
			<view style="width: 100%;" v-if="orderDetails.orderState == 5 && !orderDetails.orderFreightCargoDTO.extendedField">
				<button
					v-if="orderDetails.orderState == 5 && orderDetails.orderFreightCargoDTO.paymentMethod == 2"
					:disabled="orderDetails.loadingImagePath == null || orderDetails.unLoadingImagePath == null || orderDetails.receiptImagePath == null || btnDisabled" 
					style="background: #FFC24D;" 
					class="submitBtn"
					:class="{loginButton: orderDetails.loadingImagePath == null || orderDetails.unLoadingImagePath == null || orderDetails.receiptImagePath == null || btnDisabled}" 
					@click="goUnpaid"
				>运输完成</button>
				
				<button 
					v-if="orderDetails.orderState == 5 && orderDetails.orderFreightCargoDTO.paymentMethod == 1"
					:disabled="orderDetails.loadingImagePath == null || orderDetails.unLoadingImagePath == null || btnDisabled" 
					style="background: #FFC24D;" 
					class="submitBtn" 
					:class="{loginButton: orderDetails.loadingImagePath == null || orderDetails.unLoadingImagePath == null || btnDisabled}"
					@click="goUnpaid"
				>运输完成</button>
			</view>
		</view>
		
		<phoneList :phoneLists="phoneLists" @change='phonehide' v-if="phoneShow" :phoneShow="phoneShow"></phoneList>

		<!-- 取消订单 -->
		<u-popup width="640" height="386" border-radius="20" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}"
		 :closeable="true" v-model="callShow" mode="center">
			<view class="hintTit">温馨提示</view>
			<view class="hintCon">您确认需要取消此订单</view>
			<button :disabled="disabledaa" :style="[disabledaa ? disabledColor : '']" class="hintBtn" @click="cancelOrder(1)" v-if="orderDetails.orderState == 2">确认取消并申请退还定金</button>
			<button :disabled="disabledaa" :style="[disabledaa ? disabledColor : '']" class="hintBtn" @click="cancelOrder(2)" v-if="orderDetails.orderState == 1">确认取消</button>
		</u-popup>

		<!-- 货主取消订单 -->
		<u-popup @touchmove.stop.prevent :mask-close-able="false" width="640" height="386" border-radius="20"
		 :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}" :closeable="true" v-model="orderDetails.orderState == 6"
		 mode="center">
			<view class="hintContent">
				<view class="hintTits">申请取消订单</view>
				<view class="hintCons">
					<Icon :iconType="'icontanhaoHong1'" extClass="tanhaoHong1"></Icon>
					<view class="hintCons-text">{{ orderDetails.canceReasonsName }}</view>
				</view>
				<view class="hintConss" v-if="orderDetails.refundLiability == 1 || orderDetails.refundLiability == 2">
					<view class="hintConss-both">
						<view class="hintConss-left">责任方</view>
						<view class="hintConss-right">{{ orderDetails.refundLiability == 1 ? '货主' : orderDetails.refundLiability == 2 ? '司机' : '' }}</view>
					</view>
					<view class="hintConss-both" style="margin-top: 10rpx;">
						<view class="hintConss-left">补偿金额</view>
						<view class="hintConss-right">¥ {{ parseFloat(orderDetails.refundAmount).toFixed(2) }}</view>
					</view>
				</view>
			</view>
			<button :disabled="disabledbb" :style="[disabledbb ? disabledColor : '']" class="hintBtn" @click="cargoCancelOrder">同意取消</button>
		</u-popup>

		<!-- 评价内容 -->
		<u-popup border-radius="40" v-model="scoreShow" mode="bottom" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.3)'}">
			<view class="carConTit">
				<view class="carConTitBtn" @click="scoreShow = false">取消</view>
				<view class="carConTitCon">评价此订单</view>
				<view class="carConTitBtn" style="background: #FEC24D;" @click="orderRate(starValue)">确认</view>
			</view>
			<view class="scoreContent">
				<view class="scoreContent-top">
					<view class="scoreContent-top-tit">请你评分</view>
					<u-rate inactive-icon="star-fill" min-count="1" inactive-color="#E6E6E6" active-color="#FEC24D" size="60" :count="starCount"
					 @change="rateContChange" v-model="starValue"></u-rate>
					<view class="scoreContent-top-text">{{ starValue == 1 || starValue == 2 ? '差评' : starValue == 3 ? '中评' : starValue == 4 || starValue == 5 ? '好评' : '' }}</view>
				</view>
				<view class="scoreContent-bot" style="min-height: 200rpx;">
					<view class="scoreContent-bot-tit">评价内容</view>
					<view class="scoreContent-bot-con">
						<view 
							@click="rateChange(item)"
							v-for="(item, index) in rateList" :key="index" 
							class="type" 
							:class="{ checkType: checkedList.indexOf(item) != -1 }">
							{{item.name}}
							<view class="fangkuai" v-if="checkedList.indexOf(item) != -1">
								<Icon :iconType="'iconduigouCheng'" extClass="duigouChengss"></Icon>
							</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		
		<!-- 导航组件 -->
		<trucksInfo :itemType="itemType" :itemLists="itemLists" @change="truckshide" v-if="trucksShow" :trucksShow="trucksShow"></trucksInfo>
		
		<helang-compress ref="helangCompress"></helang-compress>
		<swiperImage :maskShow="imgShow" v-if="imgShow" @change="imghide" :swiperImages="swiperImages" :currentIndex="currentIndex"></swiperImage>
	</view>
</template>

<script>
	import config from '../../service/config.js';
	import ajax from '../../service/ajax.js';
	import {pathToBase64} from '@/js_sdk/gsq-image-tools/image-tools/index.js';
	import moment from 'moment';
	import burying from '../../common/request.js';
	import helangCompress from '../../components/helang-compress/helang-compress';
	
	// #ifdef APP-PLUS
	var sdkwx = uni.requireNativePlugin('AMap-NavSdkWX');
	// #endif
	export default {
		data() {
			return {
				// 货车信息显示
				trucksShow: false,
				itemLists: [],
				itemType: 1,
				
				magBot: {marginBottom: '100rpx'},
				
				// 图片放大
				imgShow: false,
				currentIndex: 0,
				swiperImages: [],
				
				disabledColor: {
					color: '#999999'
				},
				disabledaa: false,
				disabledbb: false,
				btnDisabled: false,

				// 星级数量
				starCount: 5,
				// 默认选中星级
				starValue: 5,

				// 取消订单温馨提示
				callShow: false,

				// 订单Id
				orderId: 0,

				// 订单详情
				orderDetails: {
					orderFreightCargoDTO: {
						cargoOwner: {}
					},
					freightWalletTransaction: {}
				},

				// 评分显示
				scoreShow: false,

				// 选中的评价
				checkedList: [],

				// 获取的评价列表
				rateList: [],

				// 装货地点
				loadSite: [],

				// 卸货地点
				unloadSite: [],

				// 货主评价
				cargoEval: null,
				// 司机评价
				driverEval: null,
				
				// 联系电话列表显示
				phoneShow: false,
				
				// 联系电话列表
				phoneLists: [],
				
				// 预约详情信息
				subscribeInfo: {},

				isIos: true,
				
				orderIndex: '-1',
			}
		},
		onLoad(option) {
			this.orderIndex = option.orderIndex;
			
			// #ifdef APP-PLUS
			this.isIos = (plus.os.name == "iOS");
			let pages = getCurrentPages();
			let page = pages[pages.length - 1];
			let currentWebview = page.$getAppWebview();
			let pg = currentWebview.getStyle().popGesture;
			console.log(pg);
			
			if(this.isIos) {
				if(option.state) {
					pg = "none";
				} else {
					pg = "close";
				}
			} else {
				pg = "close";
			}
			
			currentWebview.setStyle({
				popGesture: pg
			});
			// #endif
			
			
			this.orderId = option.id;
			// #ifdef APP-PLUS
			//ios平台高德地图sdk初始化，Android无需
			var key = "59a672d452aa5614d983240a01553557";
			sdkwx.initWithKey(key);
			// #endif
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "订单详情页面加载",
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
				page: "109",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onShow() {
			this.getorderDetails();
			
			let content = {
				// 动作
				action: "click",
				// 节点
				node: "订单详情页面显示",
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
				page: "109",
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
				node: "订单详情页面卸载",
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
				page: "109",
				type: 1,
				content: JSON.stringify(content)
			};
			
			burying.point(info);
		},
		onBackPress(options) { 
			if (options.from === 'navigateBack') {  
				return false;
			}
			this.goBack();
			return true;
		},
		computed: {
			borderStyle() {
				let borderBottom = '2rpx dashed #e3e3e3';
				return {
					borderBottom
				}
			}
		},
		methods: {
			// 关闭货车导航
			truckshide(e) {
				this.trucksShow = e;
			},
			
			// 立即评价
			evaluateing(type) {
				this.scoreShow = true;
				this.starValue = 5;
				if(type == 9) {
					this.getRateList(5);
				}
			},
			
			// 自定义返回
			goBack() {
				console.log(this.orderDetails.faceState);
				console.log(this.orderIndex);
				if(this.orderIndex == '-1') {
					uni.$emit('orderIndex', this.orderIndex);
				} else {
					uni.$emit('orderIndex', this.orderDetails.faceState);
				}

				uni.switchTab({
					url: "/pages/order/order"
				})
			},

			// 跳转到货主简介
			goBrief() {
				uni.navigateTo({
					url: "/pages/shipperDetails/shipperDetails?phone=" + this.orderDetails.orderFreightCargoDTO.creator
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到货主简介",
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
					page: "109",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},

			// 立即支付
			goPay() {
				uni.navigateTo({
					url: "/pages/pay/pay?goodsId=" + `${this.orderDetails.cargoId}&deposit=${this.orderDetails.deposit}`
				})
				
				let content = {
					// 动作
					action: "click",
					// 节点
					node: "跳转到立即支付",
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
					page: "109",
					type: 1,
					content: JSON.stringify(content)
				};
				
				burying.point(info);
			},

			// 确认支付完成
			affirmPay() {
				ajax.put(config.order_url + `/${this.orderDetails.freightOrderId}/driver-confirms-freight`, {}).then(res => {
					console.log(res)
					if (res.code == 0) {
						uni.$emit('orderIndex', 4);
						
						uni.switchTab({
							url: "/pages/order/order"
						})
					} else {
						uni.showToast({
							title: "确认支付失败",
							icon: "none",
							duration: 2000
						})
					}
				}).catch(err => {
					console.log("确认支付完成数据返回失败 error is :" + err);
				})
			},

			// 图片放大
			imgMagnify(index) {
				this.imgShow = true;
				this.currentIndex = index;
			},
			
			imghide(e) {
				this.imgShow = e;
			},

			// 联系货主
			ringUp(phone) {
				this.getPhoneList(phone);
				this.phoneShow = true;
			},
			
			// 关闭联系号码列表
			phonehide(e) {
				this.phoneShow = e;
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
							page: "109",
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
						page: "109",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},

			// 查看退货流程
			lookFlow(id) {
				uni.navigateTo({
					url: "/pages/refundFlow/refundFlow?id=" + id
				})
			},

			// 获取评价列表
			getRateList($score) {
				ajax.get(config.rateType_url, {
					type: 2,
					score: $score,
				}).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.rateList = res.data;
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取评价列表",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取评价列表(contact-phone/list)",
							// 入参
							enterParams: {
								type: 2,
								score: $score,
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "109",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取评价列表数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取评价列表",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取评价列表(contact-phone/list)",
						// 入参
						enterParams: {
							type: 2,
							score: $score,
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "109",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},

			// 确认评价
			orderRate(score) {
				let rateId = [];
				let rateIds = '';
				this.checkedList.forEach(item => {
					rateId.push(item.id);
				});
				rateIds = rateId.join(',');
				this.evaluate(score, rateIds);
				// if(rateIds) {
				// 	this.evaluate(score, rateIds);
				// } else {
				// 	uni.showToast({
				// 		title: "请选择评价内容",
				// 		icon: "none",
				// 		duration: 2000
				// 	})
				// }
			},

			// 订单评价
			evaluate(score, ids) {
				console.log(score);
				console.log(ids);
				ajax.put(config.rate_url + `/${this.orderId}/evaluate`, {
					score: score,
					evaluate: ids,
					evaluationType: 2
				}).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.scoreShow = false;
						this.getorderDetails();
					} else {
						uni.showToast({
							title: "评价失败，请重新评价",
							icon: "none",
							duration: 2000
						})
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "订单评价",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "订单评价(order-management)",
							// 入参
							enterParams: {
								score: score,
								evaluate: ids,
								evaluationType: 2
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "109",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					uni.showToast({
						title: "评价失败，请重新评价",
						icon: "none",
						duration: 2000
					})
					console.log("订单评价数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "订单评价",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "订单评价(order-management)",
						// 入参
						enterParams: {
							score: score,
							evaluate: ids,
							evaluationType: 2
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "109",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},

			// 评价内容
			rateChange(obj) {
				// 保存items
				if (this.checkedList.indexOf(obj) === -1) {
					// 不存在,则添加
					this.checkedList.push(obj);
				} else {
					// 存在,则删除
					this.checkedList.splice(this.checkedList.indexOf(obj), 1);
				}
			},

			// 评价内容根据星级变动
			rateContChange(val) {
				this.rateList = [];
				this.checkedList = [];
				this.getRateList(val);
			},

			// 筛选装卸货地点
			filtrateSite() {
				console.log(this.orderDetails.orderFreightCargoDTO.freightCargorLoadingAddress);
				this.loadSite = this.orderDetails.orderFreightCargoDTO.freightCargorLoadingAddress.filter(function(item) {
					return item.type == '1';
				})

				this.unloadSite = this.orderDetails.orderFreightCargoDTO.freightCargorLoadingAddress.filter(function(item) {
					return item.type == '2';
				})
			},
			
			// 起点导航
			navigationOpenMap(items) {
				this.itemType = 1;
				this.itemLists.push(items);
				this.trucksShow = true;
			},
			
			// 路线导航
			pathOpenMap(items) {
				this.itemType = 2;
				this.itemLists = items;
				this.trucksShow = true;
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
				}).then(reg => {
					console.log(reg.data);
					if(reg.code == 0) {
						ajax.put(config.order_url + `/${this.orderId}/upload-pictures`, {
							imageType: type,
							base64: reg.data
						}).then(res => {
							// console.log(res)
							if (res.code == 0) {
								if(type == 1 && this.orderDetails.loadingImagePath != null) {
									this.swiperImages[0] = res.data;
								} else if(type == 2 && this.orderDetails.unLoadingImagePath != null) {
									this.swiperImages[1] = res.data;
								} else if(type == 3 && this.orderDetails.receiptImagePath != null) {
									this.swiperImages[2] = res.data;
								}
								uni.showToast({
									title: "图片上传成功",
									icon: "none",
									duration: 2000
								});
								uni.hideLoading();
								this.getorderDetails();
							} else {
								uni.hideLoading();
								uni.showToast({
									title: "图片上传失败，请重新上传",
									icon: "none",
									duration: 2000
								});
								
								let content = {
									// 动作
									action: "click",
									// 节点
									node: "订单图片上传",
									// 异常信息
									bugInfo: res.msg,
									// 页面参数
									pageParams: null,
									// 接口名称
									intName: "订单图片上传(order-management/freight-shipping-order)",
									// 入参
									enterParams: null,
									// 出参
									outParams: res,
									// 前端编码
									webId: null
								};
								
								let info = {
									operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
									page: "109",
									type: 2,
									content: JSON.stringify(content)
								};
								
								burying.point(info);
							}
						}).catch(err => {
							uni.hideLoading();
							uni.showToast({
								title: "图片上传失败，请重新上传",
								icon: "none",
								duration: 2000
							});
							
							let content = {
								// 动作
								action: "click",
								// 节点
								node: "订单图片上传",
								// 异常信息
								bugInfo: err,
								// 页面参数
								pageParams: null,
								// 接口名称
								intName: "订单图片上传(order-management/freight-shipping-order)",
								// 入参
								enterParams: null,
								// 出参
								outParams: null,
								// 前端编码
								webId: null
							};
							
							let info = {
								operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
								page: "109",
								type: 2,
								content: JSON.stringify(content)
							};
							
							burying.point(info);
						})
					} else {
						uni.hideLoading();
						uni.showToast({
							title: "图片上传失败，请重新上传",
							icon: "none",
							duration: 2000
						});
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "base64图片上传",
							// 异常信息
							bugInfo: reg.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "base64图片上传(oss/upload/file/base64)",
							// 入参
							enterParams: null,
							// 出参
							outParams: reg,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "109",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: "图片上传失败，请重新上传",
						icon: "none",
						duration: 2000
					});
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "base64图片上传",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "base64图片上传(oss/upload/file/base64)",
						// 入参
						enterParams: null,
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "109",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
				
			},

			// 上传图片
			addImg(e) {
				let name = e.currentTarget.dataset.img;
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
			},

			// 获取订单详情
			getorderDetails() {
				ajax.get(config.order_url + `/${this.orderId}`, {}).then(res => {
					console.log(res)
					if (res.code == 0) {
						console.log(res.data);
						this.orderDetails = res.data;
						this.orderDetails.createTime = moment(res.data.createTime).format('YYYY年MM月DD日 HH:mm:ss');
						this.orderDetails.updateTime = moment(res.data.updateTime).format('YYYY年MM月DD日 HH:mm:ss');
						moment.locale();
						
						// 图片集合
						if(this.orderDetails.loadingImagePath) {
							this.swiperImages[0] = this.orderDetails.loadingImagePath;
						}
						if(this.orderDetails.unLoadingImagePath) {
							if((!this.orderDetails.loadingImagePath && !this.orderDetails.receiptImagePath) || (!this.orderDetails.loadingImagePath && this.orderDetails.receiptImagePath)) {
								this.swiperImages[0] = this.orderDetails.unLoadingImagePath
							} else {
								this.swiperImages[1] = this.orderDetails.unLoadingImagePath
							}
						}
						if(this.orderDetails.receiptImagePath) {
							if(!this.orderDetails.loadingImagePath && !this.orderDetails.unLoadingImagePath) {
								this.swiperImages[0] = this.orderDetails.receiptImagePath
							} else {
								if((this.orderDetails.loadingImagePath && !this.orderDetails.unLoadingImagePath) || (!this.orderDetails.loadingImagePath && this.orderDetails.unLoadingImagePath)) {
									this.swiperImages[1] = this.orderDetails.receiptImagePath
								} else {
									if(this.orderDetails.loadingImagePath && this.orderDetails.unLoadingImagePath) {
										this.swiperImages[2] = this.orderDetails.receiptImagePath
									}
								}
							}
						}
						
						// 服务费计算
						// if(this.orderDetails.freightReceivable <= 200) {
						// 	this.orderDetails.freightReceivable = this.orderDetails.freightReceivable - 2
						// } else {
						// 	this.orderDetails.freightReceivable = this.orderDetails.freightReceivable - this.orderDetails.freightReceivable*0.01
						// }
						if(this.orderDetails.remake) {
							let str1 = this.orderDetails.remake.split('，');
							let str2 = str1[1].indexOf('：');
							let str3 = str1[1].substring( str2 + 1 );
							this.orderDetails.remake = str3;
						}
						
						this.filtrateSite();
						
						if(this.orderDetails.orderFreightCargoDTO.extendedField) {
							// 获取订单基本信息以及状态
							this.getColdState(this.orderDetails.orderFreightCargoDTO.extendedField);
						}
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取订单详情",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取订单详情(order-management/freight-shipping-order)",
							// 入参
							enterParams: {
								id: this.orderId
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "109",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取订单详情数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取订单详情",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取订单详情(order-management/freight-shipping-order)",
						// 入参
						enterParams: {
							id: this.orderId
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "109",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 获取订单基本信息以及状态
			getColdState(extended) {
				ajax.post(config.coldState_url, {
					extendedField: extended,
					isReceived: 1
				}).then(res => {
					console.log(res);
					if (res.code == 0) {
						// res.data.onTime = res.data.onTime ? res.data.onTime.replace(/-/g,'/') : '';
						// res.data.offTime = res.data.offTime ? res.data.offTime.replace(/-/g,'/') : '';
						this.subscribeInfo = res.data;
					} else {
						console.log(res);
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "获取冷链订单基本信息",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "获取冷链订单基本信息(driver/order)",
							// 入参
							enterParams: {
								extendedField: extended,
								isReceived: 1
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "109",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					console.log("获取冷链订单基本信息以及状态数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "获取冷链订单基本信息",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "获取冷链订单基本信息(driver/order)",
						// 入参
						enterParams: {
							extendedField: extended,
							isReceived: 1
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "109",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},
			
			// 根据预约的节点状态跳转
			stateGo(state) {
				if(state == 3) {
					uni.navigateTo({
						url: "/pages/cargoProgress/cargoProgress?transportId=" + this.subscribeInfo.transportId + "&type=1"
					})
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "跳转到添加预约",
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
						page: "109",
						type: 1,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				} else if(state == 4) {
					uni.navigateTo({
						url: "/pages/cargoProgress/cargoProgress?transportId=" + this.subscribeInfo.transportId + "&type=2"
					})
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "跳转到修改预约",
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
						page: "109",
						type: 1,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				} else if(state == 1) {
					uni.navigateTo({
						url: "/pages/warehouseBooking/warehouseBooking?parInfo=" + JSON.stringify(this.subscribeInfo) + "&stateType=1" + "&orderId=" + this.orderId
					})
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "跳转到装货进程",
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
						page: "109",
						type: 1,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				} else if(state == 2) {
					uni.navigateTo({
						url: "/pages/warehouseBooking/warehouseBooking?parInfo=" + JSON.stringify(this.subscribeInfo) + "&stateType=2" + "&orderId=" + this.orderId
					})
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "跳转到卸货进程",
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
						page: "109",
						type: 1,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				}
			},

			// 运输完成
			goUnpaid() {
				this.btnDisabled = true;
				ajax.put(config.order_url + `/${this.orderId}/transportation-complete`, {}).then(res => {
					console.log(res)
					if (res.code == 0) {
						uni.$emit('orderIndex', 3);
						
						uni.switchTab({
							url: "/pages/order/order"
						})
					} else {
						this.btnDisabled = false;
						uni.showToast({
							title: "运输完成确认失败",
							icon: "none",
							duration: 2000
						})
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "运输完成",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "运输完成(order-management/freight-shipping-order)",
							// 入参
							enterParams: {
								id: this.orderId
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "109",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					this.btnDisabled = false;
					console.log("运输完成数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "运输完成",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "运输完成(order-management/freight-shipping-order)",
						// 入参
						enterParams: {
							id: this.orderId
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "109",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
			},

			// // 运输中取消返回
			// goOrder() {
			// 	uni.reLaunch({
			// 		url: "/pages/order/order?index=2"
			// 	})
			// },

			// 货主运输中取消订单司机确认取消
			cargoCancelOrder() {
				this.disabledbb = true;
				ajax.put(config.order_url + `/${this.orderId}/confirm-to-refunded`, {}).then(res => {
					console.log(res)
					this.disabledbb = false;
					if (res.code == 0) {
						uni.$emit('orderIndex', 7);
						
						uni.switchTab({
							url: "/pages/order/order"
						})
					} else {
						uni.showToast({
							title: "取消失败",
							icon: "none",
							duration: 2000
						})
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "货主运输中取消订单司机确认取消",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "货主运输中取消订单司机确认取消(order-management/freight-shipping-order)",
							// 入参
							enterParams: {
								id: this.orderId
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "109",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					this.disabledbb = false;
					console.log(res);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "货主运输中取消订单司机确认取消",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "货主运输中取消订单司机确认取消(order-management/freight-shipping-order)",
						// 入参
						enterParams: {
							id: this.orderId
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "109",
						type: 2,
						content: JSON.stringify(content)
					};
					
					burying.point(info);
				})
				// if(this.orderDetails.refundLiability == 1 || this.orderDetails.refundLiability == 3) {
				// 	ajax.put(config.order_url + `/${this.orderId}/confirm-to-refunded`, {}).then(res => {
				// 		console.log(res)
				// 		if (res.code == 0) {
				// 			uni.reLaunch({
				// 				url: "/pages/order/order?index=6"
				// 			})
				// 		} else {
				// 			this.disabledbb = false;
				// 			uni.showToast({
				// 				title: "取消失败",
				// 				icon: "none",
				// 				duration: 2000
				// 			})
				// 		}
				// 	}).catch(err => {
				// 		this.disabledbb = false;
				// 		console.log(res);
				// 	})
				// } else {
				// 	uni.navigateTo({
				// 		url: "/pages/pay/pay?status=1"
				// 	})
				// }
			},

			// 取消订单
			cancelOrder(type) {
				this.disabledaa = true;
				ajax.put(config.order_url + `/${this.orderId}/cancel`, {}).then(res => {
					console.log(res)
					this.disabledaa = false;
					if (res.code == 0) {
						uni.$emit('orderIndex', 7);
						
						uni.switchTab({
							url: "/pages/order/order"
						})
						// if (type == 1) {
						// 	uni.reLaunch({
						// 		url: "/pages/order/order?index=6"
						// 	})
						// } else {
						// 	uni.reLaunch({
						// 		url: "/pages/order/order?index=6"
						// 	})
						// }
					} else {
						uni.showToast({
							title: "取消失败",
							icon: "none",
							duration: 2000
						})
						
						let content = {
							// 动作
							action: "click",
							// 节点
							node: "取消订单",
							// 异常信息
							bugInfo: res.msg,
							// 页面参数
							pageParams: null,
							// 接口名称
							intName: "取消订单(order-management/freight-shipping-order)",
							// 入参
							enterParams: {
								id: this.orderId
							},
							// 出参
							outParams: res,
							// 前端编码
							webId: null
						};
						
						let info = {
							operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
							page: "109",
							type: 2,
							content: JSON.stringify(content)
						};
						
						burying.point(info);
					}
				}).catch(err => {
					this.disabledaa = false;
					console.log("取消订单数据返回失败 error is :" + err);
					
					let content = {
						// 动作
						action: "click",
						// 节点
						node: "取消订单",
						// 异常信息
						bugInfo: err,
						// 页面参数
						pageParams: null,
						// 接口名称
						intName: "取消订单(order-management/freight-shipping-order)",
						// 入参
						enterParams: {
							id: this.orderId
						},
						// 出参
						outParams: null,
						// 前端编码
						webId: null
					};
					
					let info = {
						operateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
						page: "109",
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
	.orderDetails {
		width: 100%;
		padding-bottom: 58rpx;
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

		.hintContent {
			height: 286rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.hintTits {
				margin-top: 20rpx;
				font-size: 36rpx;
				color: #333333;
			}

			.hintCons {
				display: flex;
				justify-content: flex-start;
				align-items: center;

				.tanhaoHong1 {
					font-size: 50rpx;
					color: #e1201e;
				}

				.hintCons-text {
					margin-left: 20rpx;
					font-size: 28rpx;
					color: #999999;
				}
			}

			.hintConss {
				width: 90%;
				margin: 0 auto;
				display: flex;
				flex-direction: column;
				padding-top: 10rpx;
				justify-content: space-between;
				border-top: 1rpx solid #f5f5f5;
				.hintConss-both {
					height: 40rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.hintConss-left {
						font-size: 28rpx;
						color: #666666;
					}
					.hintConss-right {
						font-size: 28rpx;
						color: #333333;
					}
				}
				
			}
		}

		.scoreContent {
			padding: 50rpx 38rpx;

			.scoreContent-top {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.scoreContent-top-tit {
					font-size: 28rpx;
					color: #333333;
				}

				.scoreContent-top-text {
					font-size: 28rpx;
					color: #999999;
				}
			}

			.scoreContent-bot {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				margin-top: 40rpx;

				.scoreContent-bot-tit {
					font-size: 28rpx;
					color: #333333;
				}

				.scoreContent-bot-con {
					width: 76%;
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;
					align-items: center;

					.type {
						width: 150rpx !important;
						margin-top: 16rpx;
						height: 40rpx;
						line-height: 40rpx;
						background: #F1F2F6;
						border-radius: 8rpx;
						font-size: 20rpx;
						text-align: center;
						color: #333333;
						margin-right: 28rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
					}

					.type:nth-of-type(3n) {
						margin-right: 0;
					}

					.checkType {
						color: #FB6E2F;
						border: 2rpx solid #FEC24D;
						background: #FFF3DB;
						position: relative;
						.fangkuai {
							width: 18rpx;
							height: 18rpx;
							background: #FD8624;
							border-radius: 8rpx 0rpx 8rpx 0rpx;
							position: absolute;
							bottom: -2rpx;
							right: -2rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							.duigouChengss {
								font-size: 8rpx;
								color: #fff;
							}
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
			// border-top: 2rpx solid #DDDDDD;
			text-align: center;
			font-size: 32rpx;
			color: #F96F2B;
			border-radius: 0;
			background: #ffffff;
			position: absolute;
			bottom: 0;
		}
		
		.btnStyle {
			width: 100%;
			height: 120rpx;
			padding: 0 25rpx;
			display: flex;
			justify-content: center;
			align-items: flex-start;
			position: fixed;
			bottom: 0;
			background: #F5F6F7;
			
			.Button {
				width: 100%;
				height: 80rpx;
				font-size: 32rpx;
				line-height: 80rpx;
				background: #FEC24D;
				border-radius: 8rpx;
			}
			
			.submitBtn {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				color: #333333;
			}
			
			.loginButton {
				background: #DDDDDD !important;
				color: #333333;
			}
		}

		.orderCont {
			width: 92%;
			margin: 0 auto;

			.orderCont-rate {
				background-color: #ffffff;
				width: 100%;
				border-radius: 20rpx;
				margin-bottom: 40rpx;

				.orderCont-rates {
					width: 100%;
					height: 100%;

					.orderCont-rate-both {
						width: 100%;
						padding: 4rpx 14rpx 6rpx 14rpx;

						.orderCont-rate-both-top {
							display: flex;
							justify-content: space-between;
							align-items: center;
							margin: 12rpx 0;
						}

						.orderCont-rate-both-bot {
							border-top: 2rpx solid #f5f5f5;
							padding: 8rpx 8rpx 20rpx 8rpx;
							display: flex;
							justify-content: flex-start;
							flex-wrap: wrap;
							align-items: center;

							.orderCont-rate-both-bot-con {
								width: 160rpx;
								margin-top: 16rpx;
								height: 40rpx;
								line-height: 40rpx;
								background: #F1F2F6;
								border-radius: 8rpx;
								font-size: 20rpx;
								color: #666666;
								text-align: center;
								margin-right: 18rpx;
							}

							.orderCont-rate-both-bot-con:nth-of-type(4n) {
								margin-right: 0;
							}
						}
					}
				}
			}

			.orderCont-load {
				width: 100%;
				background: #ffffff;
				border-radius: 20rpx;

				.orderCont-load-top {
					background: #ffffff;
					padding: 26rpx 26rpx 0 26rpx;
					border-radius: 20rpx 20rpx 0 0;

					.orderCont-load-top-rigss:last-child {
						background: none;
					}

					.orderCont-load-top-rigss {
						padding-bottom: 20rpx;
						display: flex;
						justify-content: space-between;
						align-items: flex-start;
						background: url(../../static/img36.png);
						background-repeat: no-repeat;
						background-position: 14rpx 4rpx;
						background-size: 4rpx cover;

						.orderCont-load-top-rig-rig {
							display: flex;
							justify-content: space-between;
							align-items: flex-start;

							.orderCont-load-top-rig-rig-left {
								width: 18rpx;
								height: 66rpx;
								background: linear-gradient(90deg, #F0F0F0 0%, rgba(255, 255, 255, 0) 100%);
								margin-right: 12rpx;
							}

							.orderCont-load-top-rig-rig-rig {
								display: flex;
								flex-direction: column;
								justify-content: center;
								align-items: center;

								.site-content-bot-both-right-rig-img {
									width: 35rpx;
									height: 35rpx;
									margin-top: 8rpx;
									border-radius: 50%;
									border: 2rpx solid #1896db;
									display: flex;
									justify-content: center;
									align-items: center;

									.daohang2 {
										font-size: 30rpx;
										color: #1896db;
									}

									.chakanluxian1 {
										font-size: 30rpx;
										color: #db791e;
									}
								}

								.orderCont-load-top-rig-rig-text {
									font-size: 20rpx;
									color: #1896DB;
								}
							}
						}

						.orderCont-load-top-rig-left {
							display: flex;
							justify-content: flex-start;
							align-items: flex-start;

							.orderCont-load-top-left-con-tit {
								width: 450rpx;
								margin-left: 18rpx;
								display: flex;
								flex-direction: column;
								justify-content: flex-start;
								align-items: flex-start;

								.orderCont-load-top-rig-left-tit-item {
									font-size: 28rpx;
									color: #333333;
									font-weight: bold;
								}

								.orderCont-load-top-rig-left-text {
									margin-top: 10rpx;
									line-height: 1.5;
									font-size: 24rpx;
									color: #999999;
								}
							}

							.orderCont-load-top-left-con {
								width: 32rpx;
								height: 32rpx;
								background: #1BB68A;
								font-size: 16rpx;
								line-height: 32rpx;
								color: #FFFFFF;
								border-radius: 50%;
								text-align: center;
							}
						}
					}

					.orderCont-load-top-rig {
						padding-bottom: 20rpx;
						display: flex;
						justify-content: space-between;
						align-items: flex-start;
						background: url(../../static/img36.png);
						background-repeat: repeat-y;
						background-position: 14rpx 4rpx;
						background-size: 4rpx cover;

						.orderCont-load-top-rig-rig {
							display: flex;
							justify-content: space-between;
							align-items: flex-start;

							.orderCont-load-top-rig-rig-left {
								width: 18rpx;
								height: 66rpx;
								background: linear-gradient(90deg, #F0F0F0 0%, rgba(255, 255, 255, 0) 100%);
								margin-right: 12rpx;
							}

							.orderCont-load-top-rig-rig-rig {
								display: flex;
								flex-direction: column;
								justify-content: center;
								align-items: center;

								.site-content-bot-both-right-rig-img {
									width: 35rpx;
									height: 35rpx;
									margin-top: 8rpx;
									border-radius: 50%;
									border: 2rpx solid #1896db;
									display: flex;
									justify-content: center;
									align-items: center;

									.daohang2 {
										font-size: 30rpx;
										color: #1896db;
									}

									.chakanluxian1 {
										font-size: 30rpx;
										color: #db791e;
									}
								}

								.orderCont-load-top-rig-rig-text {
									font-size: 20rpx;
									color: #1896DB;
								}
							}
						}

						.orderCont-load-top-rig-left {
							display: flex;
							justify-content: flex-start;
							align-items: flex-start;

							.orderCont-load-top-left-con-tit {
								width: 450rpx;
								margin-left: 18rpx;
								display: flex;
								flex-direction: column;
								justify-content: flex-start;
								align-items: flex-start;

								.orderCont-load-top-rig-left-tit-item {
									font-size: 28rpx;
									color: #333333;
									font-weight: bold;
								}

								.orderCont-load-top-rig-left-text {
									margin-top: 10rpx;
									line-height: 1.5;
									font-size: 24rpx;
									color: #999999;
								}
							}

							.orderCont-load-top-left-con {
								width: 32rpx;
								height: 32rpx;
								background: #1BB68A;
								font-size: 16rpx;
								line-height: 32rpx;
								color: #FFFFFF;
								border-radius: 50%;
								text-align: center;
							}
						}
					}
				}

				.orderCont-load-bot {
					width: 100%;
					background: #F0F0F0;
					border-radius: 0rpx 0rpx 20rpx 20rpx;
					padding: 5rpx 0;

					.orderCont-load-bottop {
						height: 50%;
						width: 93%;
						margin: 0 auto;
						display: flex;
						justify-content: space-between;
						align-items: center;
						border-bottom: 2rpx solid #e5e5e5;

						.orderCont-load-bot-left {
							text-align: left;
							height: 52rpx;
							line-height: 52rpx;
							font-size: 24rpx;
							color: #333333;
							width: 80%;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 1;
							-webkit-box-orient: vertical;
						}

						.orderCont-load-bot-rig {
							text-align: right;
							width: 20%;
							height: 40rpx;
							line-height: 40rpx;
							font-size: 24rpx;
							color: #666666;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 1;
							-webkit-box-orient: vertical;
						}
					}
					.orderCont-load-botbot {
						width: 560rpx;
						margin: 0 auto;
						display: flex;
						justify-content: flex-start;
						align-items: center;
						margin-left: 25rpx;
						.orderCont-load-botbot-both {
							text-align: left;
							height: 52rpx;
							line-height: 52rpx;
							font-size: 24rpx;
							color: #333333;
						}
					}
					.orderCont-load-bots {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.loginButton {
							background: #DDDDDD !important;
							color: #333333;
						}
						.listMid-right {
							width: 100rpx;
							height: 108rpx;
							background: linear-gradient(180deg, #FFE14C 0%, #FEC24D 100%);
							border-radius: 0rpx 0rpx 20rpx 0rpx;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							.qiangdan {
								height: 12rpx;
								font-size: 50rpx;
								margin: 28rpx 0 15rpx 0;
								display: flex;
								justify-content: center;
								align-items: center;
							}
							.listMid-right-btn {
								font-size: 20rpx;
								color: #333333;
							}
						}
						.orderCont-load-botbot {
							width: 560rpx;
							margin: 0 auto;
							display: flex;
							justify-content: flex-start;
							align-items: center;
							margin-left: 25rpx;
							.orderCont-load-botbot-both {
								text-align: left;
								height: 52rpx;
								line-height: 52rpx;
								font-size: 24rpx;
								color: #333333;
								.left {
									margin-left: 10rpx;
								}
								.right {
									margin-left: 10rpx;
									color: #DB791E;
								}
							}
						}
					}
					
				}
			}

			.orderCont-shipper {
				width: 100%;

				.orderCont-freight-tit {
					height: 38rpx;
					font-size: 28rpx;
					line-height: 38rpx;
					color: #333333;
					margin: 40rpx 0 14rpx 0;
					text-align: left;
				}

				.listBots {
					width: 100%;
					height: 100rpx;
					background: #ffffff;
					border-radius: 20rpx;
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
						width: 102rpx;
						height: 100rpx;
						background: #E8E8E8;
						border-radius: 0rpx 20rpx 20rpx 0rpx;
						display: flex;
						justify-content: center;
						align-items: center;

						.dianhua {
							font-size: 40rpx;
							color: #fb6e2f;
						}
					}
				}
			}

			.orderCont-freight {
				width: 100%;

				.orderCont-freight-tit {
					height: 38rpx;
					font-size: 28rpx;
					line-height: 38rpx;
					color: #333333;
					margin: 40rpx 0 14rpx 0;
					text-align: left;
				}

				.orderCont-voucher-cont {
					width: 100%;
					background: #ffffff;
					border-radius: 20rpx;
					padding: 0 20rpx;

					.orderCont-voucher-cont-item {
						width: 100%;
						height: 184rpx;
						border-bottom: 1rpx solid #f5f5f5;
						display: flex;
						justify-content: flex-start;
						align-items: center;

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

				.orderCont-freight-cont {
					background: #ffffff;
					border-radius: 20rpx;
					padding: 14rpx;

					.orderCont-freight-cont-items {
						padding: 0 6rpx;
						height: 78rpx;
						line-height: 88rpx;
						font-size: 20rpx;
						color: #333333;
						text-align: right;
						border-top: 1rpx solid #f5f5f5;

						.orderCont-freight-cont-itemss {
							font-size: 28rpx;
							color: #FB6E2F;
							font-weight: 600;
						}
					}

					.orderCont-freight-cont-item {
						width: 100%;
						height: 64rpx;
						border-top: 2rpx solid #f5f5f5;
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 0 6rpx;

						.orderCont-freight-cont-item-left {
							font-size: 24rpx;
							color: #666666;
						}

						.orderCont-freight-cont-item-rig {
							font-size: 28rpx;
							color: #333333;
						}
					}
				}
			}

			.orderCont-tit {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 24rpx 0;

				.orderCont-tit-left {
					margin-left: 58rpx;

					.orderCont-tit-left-top {
						font-size: 44rpx;
						color: #333333;
						height: 60rpx;
						line-height: 60rpx;
						.orderCont-tit-left-top-text {
							font-size: 24rpx;
							color: #333333;
							margin-left: 20rpx;
						}
						.orderCont-tit-left-top-val {
							font-size: 28rpx;
							font-weight: bold;
							color: #1BB68A;
							margin-left: 10rpx;
						}
					}

					.orderCont-tit-left-bot {
						font-size: 24rpx;
						color: #666666;
					}
				}

				.orderCont-tit-rigs {
					width: 140rpx;
					height: 100rpx;
					background: linear-gradient(180deg, #FFE14C 0%, #FEC24D 100%);
					border-radius: 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.pingjia1 {
						height: 54rpx;
						font-size: 38rpx;
					}
				}

				.orderCont-tit-rig {
					width: 140rpx;
					height: 100rpx;
					background: #f5f6f7;
					border-radius: 20rpx;
					display: flex;
					justify-content: center;
					align-items: center;

					.shalou {
						font-size: 70rpx;
					}
				}
			}
		}
	}
</style>
