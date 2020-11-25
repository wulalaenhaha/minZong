<template>
	<view class="about">		
		<view class="tit">
			<image src="../../static/logo/1024.png"></image>
			<view>掌 上 民 宗</view>
		</view>
		<view class="ma"> 
			<image :src="imgurl + '/apk/qrcode.png'" @tap="prew1"></image>
			
			<view style="text-align: center;line-height: 60rpx;font-size: 30rpx;">扫一扫 下载 APP</view>
		</view>
		<view class="copy">&copy; 河北网新科技集团有限公司版权所有</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				imgurl:'',
				imageList:['https://zhmz.hebei.org.cn/apk/qrcode.png']
			}
		},
		methods:{			
			prew1: function(e) {       //预览图片
				console.log(e)
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			}
		},
		onShow() {
			this.imgurl=getApp().globalData.imgUrl;
		}
	}
</script>

<style>
	page{
		background-color: #F5F5F5;
	}
	.tit{
		width: 100%;height:300rpx;
		text-align: center;
	}
	.tit image{
		width: 144rpx;height:144rpx;
		margin-top: 86rpx;
	}
	.tit view{
		line-height: 100rpx;
		font-size: 40rpx;
		color:#487DE5;
		font-weight: bold;
	}
	.ma{
		width: 100%;
		/* overflow: hidden; */
		margin-top: 120rpx;
		text-align: center;
	}
	.ma image{
		width: 360rpx;height:360rpx;
	}
	.copy{
		width: 100%;
		position: absolute;
		bottom: 30rpx;
		text-align: center;
		font-size: small;
		color:#999;
	}
</style>
