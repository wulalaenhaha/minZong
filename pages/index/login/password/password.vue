<template>
	<view class="password">
		<view class="input">
			<view class="name">手机号码</view>
			<input type="number" v-model="phone" value="" placeholder="输入手机号码" placeholder-style="font-size:30rpx;" />
		</view>
		<view class="input">
			<view class="name">验 证 码</view>
			<input type="number" v-model="msm" value="" placeholder="输入手机验证码" placeholder-style="font-size:30rpx;" />
			<view class="txt" @tap="getSMS">{{time}}</view>
		</view>
		<view class="input">
			<view class="name">新 密 码</view>
			<input type="password" v-model="newPassword" value="" placeholder="输入新密码" placeholder-style="font-size:30rpx;" />
		</view>
		<view class="input">
			<view class="name">确认密码</view>
			<input type="password" v-model="newPassword1" value="" placeholder="再次输入新密码" placeholder-style="font-size:30rpx;" />
		</view>
		<view class="tj">
			<button type="primary" class="submit" @tap="submit">完成</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				time: '发送验证码',
				phone:'',
				msm:'',
				newPassword:'',
				newPassword1:''
			}
		},
		methods: {
			submit() {
				if(this.newPassword!==this.newPassword1){
					uni.showModal({
						content: '两次输入的密码不一致，请重新输入！',
						showCancel:false,
						success: function (res) {
						    if (res.confirm) {
						        console.log('用户点击确定');
						    }
						}
					})
				}else if(this.msm==""){
					uni.showModal({
						content: '请输入验证码！',
						showCancel:false,
						success: function (res) {
						    if (res.confirm) {
						        console.log('用户点击确定');
						    }
						}
					})
				}else{
					//发送请求到服务器
					uni.request({
					    url: 'https://www.example.com/request', //仅为示例，并非真实接口地址。
					    data: {                        //请求的参数
					        text: 'uni.request'
					    },
					    header: {
					        'custom-header': 'hello'  //自定义请求头信息
					    },
					    success: (res) => {           //请求成功
					        console.log(res.data);
							//发送请求，如果成功则跳转。							
							uni.navigateTo({
								url: '../login'
							})
					    },
						fail: (res) => {              //请求失败
						    console.log('请求失败');
						    uni.showModal({
						        content: '手机号或者验证码错误！',
						    	showCancel:false,
						        success: function (res) {
						            if (res.confirm) {
						                console.log('用户点击确定');
						            }
						        }
						    });
						}
					});						
				}				
			},
			getSMS() {
				if(this.phone.length!=11 || this.phone==''){
					uni.showModal({
						content: '请填入正确的11位手机号码！',
						showCancel:false,
						success: function (res) {
						    if (res.confirm) {
						        console.log('用户点击确定');
						    }
						}
					})
				}else{
					//发送验证码请求
					
					let times = 60; // 用于倒计时
					this.time = times + 's';
					this.interval = setInterval(() => {
						times--;
						this.time = times + 's';
						if (times < 0) {
							this.time = '重新获取';
							clearInterval(this.interval);
						}
					}, 1000)
				}
			}
		},
	}
</script>

<style scoped lang="scss">
	page {
		font-size: 30rpx;
		background-color: #FFFFFF;
	}

	.input {
		width: 100%;
		height: 90rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		border-bottom: 2rpx solid #F5F5F5;

		.name {
			width: 22%;
		}

		input {
			width: 48%;
		}

		.txt {
			text-align: center;
			width: 30%;
			color: #487DE5;
		}
	}

	.tj {
		width: 100%;
		position: absolute;
		bottom: 0;
		padding: 20rpx 30rpx;
	}
</style>
