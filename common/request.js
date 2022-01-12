import Vue from 'vue'
import ajax from '../service/ajax.js'
import config from '../service/config.js'

function point(info) {
	let _info = JSON.parse(info.content);
	let pcontent = {};
	for(let p in _info) {
		let _content = JSON.stringify(_info[p] || "");
		// console.log(_content);
		if (_content.length > 300) {
			pcontent[p] = _content.substring(0, 300);
		} else {
			pcontent[p] = _content
		}
	}
	let $info = {
		model: uni.getStorageSync('model'),
		sequence: uni.getStorageSync('sequence'),
		operator: uni.getStorageSync('userno'),
		operateTime: info.operateTime,
		page: info.page,
		terminalType: uni.getStorageSync('terminalType'),
		version: uni.getStorageSync('version'),
		type: info.type,
		content: JSON.stringify(pcontent),
		appType: uni.getStorageSync('appType'),
		operateIp: uni.getStorageSync('operateIp'),
	};
	// console.log($info);
	if($info.operator) {
		try{
			ajax.post(config.buryingPoint_url,{...$info}).then(res => {
				// console.log(res);
			}).catch(err => {
				console.log(err)
			})
		}catch(err) {
			console.log(err);
		}
	}
}

module.exports = {
	point: point,
}
