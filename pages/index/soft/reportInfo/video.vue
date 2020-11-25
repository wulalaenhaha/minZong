<template>
	<view style="width: 100;">
		<video style="width: 100%;" :src="videoSrc" controls autoplay></video>
		<view class="back">
			<button type="primary" @tap="back">返回</button>
		</view>
	</view>
</template>

<script>
	
	export default {				
		data() {
			return {
				videoSrc:''
			}			
		},
		methods: {
			back(){
				uni.navigateBack({ 
					delta:1
				})
			}
		},
		onShow() {
			
		},
		onLoad:function(option){
			this.videoSrc=option.src;
		}
	}
</script>

<style>
	.back{
		width: 100%;
		box-sizing: border-box;
		padding: 0 30rpx;
		position: absolute;
		bottom: 30rpx;
	}
</style>
