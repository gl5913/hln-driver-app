const OSS = require('ali-oss');

const client = new OSS({
	bucket: 'recognition',
	// region以杭州为例（oss-cn-hangzhou），其他region按实际情况填写。
	region: 'oss-cn-hangzhou',
	// 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录RAM控制台创建RAM账号。
	accessKeyId: 'LTAI5tBwuJM7nD7M2zktzzR7',
	accessKeySecret: ' jqCAENOVfkJW67PShrnmrne3XLHv1T',
});
// 将指定图片文件缩放为固定宽高100 px后保存在本地。
async function scale (imgName, fileName) {
	try {
		let result = await client.get(imgName, fileName, { process: 'image/resize,m_fixed,w_100,h_100'});
		return result;
	} catch (e) {
		console.log(e);
	}
}

module.exports = {
	scale: scale,
}