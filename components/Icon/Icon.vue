<template>
	<i class="iconfont" :class="[iconCls, extClass]"></i>
</template>

<script>
var iconMap = {
	iconshenfenzhengzhengmian1: "iconshenfenzhengzhengmian1",
	// 验证码
	iconyanzhengma: "iconyanzhengma",
    // 手机
	iconshouji: "iconshouji",
	// 密码
	iconyanzhengma1: "iconyanzhengma1",
	// 闭眼
	iconyanjing: "iconyanjing",
	// 睁眼
	iconzhengyan: "iconzhengyan",
	// 三角
	iconsanjiao1: "iconsanjiao1",
	// 叹号
	icontanhaoCheng1: "icongantanhao",
	// 通过
	icontongguo1: "icontongguo1",
	// 对勾
	iconduigouCheng: "iconduigou-cheng",
	// 抢单
	iconqiangdan: "iconqiangdan",
	// 箭头
	iconarrowRight: "iconarrow-right",
	// 时间
	iconshijian: "iconshijian",
	// 装卸量
	iconzhuangxie: "iconzhuangxielianghejiqizhongzhuanghuoliang",
	// 导航
	icondaohang2: "icondaohang2",
	// 里程碑
	iconlichengbei: "iconlichengbei",
	// 路线
	iconchakanluxian1: "iconchakanluxian1",
	// 头像
	icontouxiang1: "icontouxiang1",
	// 电话机
	icontonghua: "icontonghua",
	// 导航2
	icondaohang: "icondaohang",
	// 通知
	icontongzhi: "icontongzhi",
	// 钱包
	iconqianbaozhifu: "iconcaiyouduo_zhifu-qianbaozhifu",
	// 微信
	iconweixinzhifu: "iconweixinzhifu",
	// 支付宝
	iconzhifubao: "iconzhifubao",
	// 对勾2
	iconduigouHei: "iconduigou-hei",
	// 设置装货
	iconshezhizhuanghuo1: "iconjiantou_fahuo_arrow_delivery_bg",
	// 设置卸货
	iconshezhixiehuo1: "iconshezhixiehuo1",
	// 选择车型车长
	iconxuanzechechangchexing1: "iconcheliang-",
	// 修改
	iconxiugai1: "iconxiugai1",
	// 删除
	iconshanchu1: "iconshanchu1",
	// 电话
	icondianhua: "icondianhua",
	// 沙漏
	iconshalou: "iconshalou",
	// 运输
	iconzongheHuoyunwuliu: "iconzonghe-huoyunwuliu",
	// 支付
	iconzhifu: "iconzhifu",
	// 评价
	iconpingjia1: "iconpingjia1",
	// 退款
	icontuikuan1: "icontuikuan1",
	// 完成
	iconwancheng1: "iconwancheng1",
	// 叹号
	icontanhaoHong1: "icongantanhao",
	// 系统消息
	iconxitongxiaoxi1: "iconxitongxiaoxi1",
	// 钱包消息
	iconqianbaoxiaoxi1: "iconqianqianqian",
	// 运单消息
	iconwuliuxiaoxi1: "iconxiaoxiwuliufill",
	// 设置
	iconshezhi: "iconshezhi",
	// 待确认
	icondaiquerenWode1: "icondaiqueren-wode1",
	// 运输中
	iconyunshuzhongWode1: "iconyunshuzhong-wode1",
	// 待支付
	icondaizhifuWode1: "icondaizhifu-wode1",
	// 待评价
	icondaipingjiaWode1: "icondaipingjia-wode1",
	// 退款中
	icontuikuanzhongWode1: "icontuikuanzhong-wode1",
	// 失败
	iconshibai1: "iconshibai1",
	// 返回右
	iconfanhuiYou1: "iconfanhui-you1",
	// 关闭
	iconguanbi: "iconguanbi",
	// 删除
	iconshanchu: "iconshanchu",
	// 评价
	iconpingjia: "iconpingjia",
	// 客服
	iconkefu: "iconkefu",
	// 问题
	iconchangjianwenti1: "iconchangjianwenti1",
	// 反馈
	iconfankui1: "iconfankui1",
	// 车牌
	iconchepai1: "iconchepai1",
	// 取消中
	iconquxiaozhong: "iconquxiaozhong",
	// 认证盾牌
	iconrenzhengdunpai: "iconrenzhengdunpaianquanbaozhangzhibao",
	// 账单明细
	iconzhangdanmingxi: "iconzhangdan-dingdan",
	// 银行卡
	iconshuaqiaqiapianyinhangqia: "iconshuaqiaqiapianyinhangqia",
	// 微信
	iconzhifu1: "iconzhifu1",
	// 支付宝
	iconzhifubao1: "iconzhifubao1",
	// 人脸识别
	iconrenlianshibie: "iconrenlianshibie",
	// 未认证
	iconwebWeirenzheng: "iconweb__weirenzheng",
	// 取消
	iconquxiao1: "iconquxiao1",
	// 运单消息
	iconwuliuyunshuzhuangxiangsvg: "iconwuliuyunshuzhuangxiangsvg",
	// 钱包消息
	iconcaiyouduoZhifuQianbaozhifu: "iconcaiyouduo_zhifu-qianbaozhifu",
	// 系统消息
	iconmymessage: "iconmymessage",
	// 退款中
	icontuikuanzhong: "icontuikuanzhong",
	// 通话
	icontonghua1: "icontonghua1",
	// 手掌
	iconhand: "iconhand",
	// 眼睛
	iconyanjing1: "iconyanjing1",
	// 大厅
	iconguanlidating: "iconguanlidating",
	// 门店签到
	iconaQiandao1: "icona-qiandao1",
	// 到仓签到
	iconqiandao: "iconqiandao",
}
export default {
    props:{
        iconType:{//自定义图标
            type: String,
            required: true
        },
        extClass:{//自定义图标样式
            type: String,
            default: ""
        }
    },
    computed: {
        iconCls() {
            return iconMap[this.iconType];
        }
    }
}
</script>

<style scoped>
	/* @import '../../common/iconfont.css'; */
	@import 'https://at.alicdn.com/t/font_2537283_l76r6mvk26f.css';
</style>
