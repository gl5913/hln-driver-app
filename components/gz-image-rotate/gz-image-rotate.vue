<template>
	<view>
		<canvas :canvas-id="canvaId" class="my-canvas" :style="{width: imgWidth + 'px', height: imgHeight + 'px'}"
		 disable-scroll="false"></canvas>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ctx: null,
				canvaId: 'canvas_id',
				tempFilePath: null,
				imgHeight: 0,
				imgWidth: 0,
				rage: 0,
				w: 0,
				h: 0,
				timerArr: []
			};
		},
		created() {
			this.ctx = uni.createCanvasContext(this.canvaId, this);
		},
		beforeDestroy() {
			this.clearTimer()
		},
		methods: {
			clearTimer() {
				this.timerArr.forEach((item) => {
					clearTimeout(item)
				})
				this.timerArr = []
			},
			// tempFilePath: 临时图片路径
			// rotate: 角度标记 1：顺时针90°，2：顺时针180°， 3：逆时针90°
			start(tempFilePath, rotate) {
				uni.getImageInfo({
					src: tempFilePath,
					success: (r) => {
						console.log('r', r)
						let {
							width,
							height,
							path
						} = r
						this.imgWidth = width
						this.imgHeight = height
						this.tempFilePath = path
						this.drawImage(rotate)
					},
					fail(e) {
						console.error(e)
					}
				})
			},
			drawImage(rotate) {
				let ctx = this.ctx
				ctx.drawImage(this.tempFilePath, 0, 0, this.imgWidth, this.imgHeight)
				ctx.draw()
				this.clearTimer()
				let timer = setTimeout(() => {
					this.rotate(rotate)
				}, 400)
				this.timerArr.push(timer)
			},
			rotate(flag) {
				let ctx = this.ctx
				let rag = 0
				let w = 0
				let h = 0
				console.log('flag', flag)
				ctx.clearRect(0, 0, this.imgWidth, this.imgHeight)
				switch (flag) {
					case 1: //顺时针90度
						this.rage = 90
						this.h = -this.imgHeight
						ctx.rotate(this.rage * Math.PI / 180)
						ctx.translate(this.w, this.h)
						ctx.drawImage(this.tempFilePath, 0, 0, this.imgWidth, this.imgHeight)
						setTimeout(() => {
							ctx.draw()
						}, 400)
						let t = this.imgWidth
						this.imgWidth = this.imgHeight
						this.imgHeight = t
						break;
					case 2: //顺时针180度
						this.rage = 180
						this.h = -this.imgHeight
						this.w = -this.imgWidth
						ctx.rotate(this.rage * Math.PI / 180)
						ctx.translate(this.w, this.h)
						ctx.drawImage(this.tempFilePath, 0, 0, this.imgWidth, this.imgHeight)
						setTimeout(() => {
							ctx.draw()
						}, 400)
						break;
					case 3: //逆时针90度
						this.rage = -90
						this.w = -this.imgWidth
						ctx.rotate(this.rage * Math.PI / 180)
						ctx.translate(this.w, this.h)
						ctx.drawImage(this.tempFilePath, 0, 0, this.imgWidth, this.imgHeight)
						setTimeout(() => {
							ctx.draw()
						}, 400)
						let t3 = this.imgWidth
						this.imgWidth = this.imgHeight
						this.imgHeight = t3
						break;
					default:
						break;

				}
				this.clearTimer()
				let timer = setTimeout(() => {
					this.output()
				}, 400)
				this.timerArr.push(timer)
			},
			output() {
				console.log(11)
				let ctx = this.ctx
				uni.canvasToTempFilePath({
					fileType: 'jpg',
					canvasId: this.canvaId,
					success: (res) => {
						console.log('成功', res)
						this.$emit('success', res)
					},
					fail(e) {
						console.error(e)
						this.$emit('fail', e)
					}
				}, this)
			},
			init() {
				this.clearTimer()
				this.ctx = null
				this.canvaId = 'canvas_id'
				this.tempFilePath = null
				this.imgHeight = 0
				this.imgWidth = 0
				this.rage = 0
				this.w = 0
				this.h = 0
				this.timerArr = []
			}
		}
	}
</script>

<style scoped>
	.my-canvas {
		overflow: hidden !important;
		position: fixed !important;
		z-index: -100000 !important;
		visibility: hidden !important;
		top: 400% !important;
		left: 400% !important;
	}
</style>
