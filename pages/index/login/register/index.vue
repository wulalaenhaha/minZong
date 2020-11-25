<template>
	<view class="password">
		<view class="input">
			<view class="name">用户名</view>
			<input type="text" v-model="name" value="" placeholder="请输入用户名" placeholder-style="font-size:30rpx;" />
		</view>
		<view class="input">
			<view class="name">手机号码</view>
			<input type="number" v-model="phone" value="" placeholder="请输入手机号码(该手机号为登录账号)" placeholder-style="font-size:30rpx;" />
		</view>
		<view class="tj">
			<button type="primary" class="submit" @tap="submit">提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone:'',
				name:''
			}
		},
		methods: {
			submit() {
				//发送请求到服务器
				uni.request({
					url:getApp().globalData.api+'/login/UserRegister',
					data: {                        //请求的参数
						account:this.phone,
						UserName:this.name
					},
					success: (res) => {           //请求成功
						console.log(res.data);
						if(res.data.code==0){
							uni.navigateTo({
								url: '../login'
							})
						}else if(res.data.code==-3){
							uni.showModal({
								content: '该手机号已被注册，请直接登录！',
								showCancel:false,
								success: function (res) {
									if (res.confirm) {
										console.log('用户点击确定');
									}
								}
							});
						}							
					},
					fail: (res) => {              //请求失败
						console.log('请求失败');
					}
				});	
			},
		},
	}
</script>

<style scoped lang="scss">
	page {
		padding: 10rpx 30rpx;
		font-size: 30rpx;
		background-color: #f4f4f4;
		box-sizing: border-box;
	}
	.password{
		background-color: #FFFFFF;
	}
	.input {
		width: 100%;
		height: 90rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;

		.name {
			width: 22%;
		}

		input {
			width: 78%;
			padding: 10rpx 0;
			padding-left: 10rpx;
			background-color: #f4f4f4;
		}
	}

	.tj {
		width: 90%;
		margin: 0 auto;
		position: absolute;
		bottom: 0;
		left: 5%;
	}
</style>
