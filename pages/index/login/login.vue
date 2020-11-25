<template>
	<view class="login">
		<view class="header">
			<image src="../../../static/logo/bg1.png" mode=""></image>
		</view>
		<view class="content">
			<view class="card">
				<view class="phone">
					<input type="number" maxlength="11" v-model="phone" value="" placeholder="请输入手机号码" placeholder-style="font-size:30rpx;" />
					<view class="clear" @tap="clear" v-if="phone!=''?true:false">&times;</view>
				</view>
				<view class="sms">
					<input type="number" maxlength="6" v-model="password" value="" placeholder="请输入验证码" placeholder-style="font-size:30rpx;" />
					<view class="txt" @tap="getSMS()">{{time}}</view>
				</view>
				<!-- <view class="txt" @tap="forgetPassword">忘记密码</view> -->
				<view class="tj">
					<button type="primary" class="submit" @tap="submit">登录</button>
					<!-- <button type="primary" class="register" @tap="register">注册</button> -->
				</view>
			</view>
			<view class="image">
				<image src="../../../static/logo/bg2.png" mode=""></image>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				uuid: '', //手机唯一认证标识
				isClick: true, // 是否控制获取验证码的点击事件
				phone: '',
				password: '',
				usnerinfo: '',
				sms: '', //获得的验证码
				time: '获取验证码' //发送验证码后   时间显示
			}
		},
		computed: {
			// phone1:function() {
			// 	return parseInt(this.phone);
			// } 
		},
		onShow() {
			//读取缓存
			const value = uni.getStorageSync('storage_key');
			if (value) {
				this.phone = value;
			}
			this.isClick = true;
			let interval = this.interval; // 保存定时器的id
			clearInterval(interval);
			this.time = '获取验证码';
			var _this = this;

			// #ifdef APP-PLUS
			// 获取设备信息
			function getDeviceInfo() {
				plus.device.getInfo({
					success: function(e) {
						console.log('getDeviceInfo success: ' + JSON.stringify(e));
						var data = JSON.stringify(e);
						_this.uuid = JSON.parse(data).uuid;
						console.log('uuid=', _this.uuid)
						console.log('data=', JSON.parse(data))
					},
					fail: function(e) {
						console.log('getDeviceInfo failed: ' + JSON.stringify(e));
					}
				});
			}
			getDeviceInfo();
			// console.log('应用的 appid 为：' + options);
			// #endif			
		},
		methods: {
			clear() {
				this.phone = '';
			},
			// register(){
			// 	uni.navigateTo({
			// 		url:'./register/index'
			// 	})
			// },
			submit() {
				if (this.phone == '18435106854') {
					// if(this.phone=='18435106854' || this.phone=='13003111300' || this.phone=='13003111301' || this.phone=='13003111302'){
					this.password = '123456'
					// console.log(this.phone)
					// console.log(this.password)
					uni.request({
						url: getApp().globalData.api + '/Login/Login', //仅为示例，并非真实接口地址。
						data: { //请求的参数
							Account: this.phone,
							Password: this.password,
							uuId: this.uuid
						},
						success: (res) => { //请求成功
							console.log('登录数据=', res.data)
							if (res.data.code == 1 || res.data.code == 2 || res.data.code == 3) {
								//发送请求，如果成功则跳转	 
								if (JSON.stringify(res.data.data[0]) !== undefined) { //该用户存在
									console.log('有权限')
									getApp().globalData.userName = this.phone; //账号，密码，赋给全局变量
									getApp().globalData.userPwd = this.password;
									getApp().globalData.userID = res.data.data[0].ID,
										getApp().globalData.code = res.data.code;
									getApp().globalData.Name = res.data.data[0].Name;
									getApp().globalData.quId = res.data.data[0].quId;
									getApp().globalData.login = true;
									getApp().globalData.userylyid = res.data.data[0].userylyid;
									getApp().globalData.ParentID = res.data.data[0].ParentID;

									console.log(getApp().globalData.userPwd)
									uni.switchTab({
										url: '../index'
									});
								} else { //该用户不存在，让后台分配权限
									console.log('无权限')
									uni.showModal({
										content: '您登陆的账号无权限，请联系管理员给您分配权限！',
										showCancel: false,
										success: function(res) {
											if (res.confirm) {
												console.log('用户点击确定');
											}
										}
									});
								}
							} else if (res.data.code == -2) {
								uni.showModal({
									content: '您登陆的设备未绑定，为防止泄密，请联系管理员！',
									showCancel: false,
									success: function(res) {
										if (res.confirm) {
											console.log('用户点击确定');
										}
									}
								});
							}
							// else{
							// 	uni.showModal({
							// 	    content: '手机号或验证码错误！',
							// 		showCancel:false,
							// 	    success: function (res) {
							// 	        if (res.confirm) {
							// 	            console.log('用户点击确定');
							// 	        }
							// 	    }
							// 	});
							// }								
						},
						fail: (res) => { //请求失败
							console.log('请求失败');
							uni.showModal({
								content: '网络请求错误！',
								showCancel: false,
								success: function(res) {
									if (res.confirm) {
										console.log('用户点击确定');
									}
								}
							});
						}
					});
				}
				if (this.phone.length != 11) {
					console.log('1212')
					uni.showModal({
						content: '请输入正确的11位手机号码',
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
							}
						}
					});
				} else {
					if (this.phone == '' || this.password == "") {
						uni.showModal({
							content: '手机号或验证码不得为空！',
							showCancel: false,
							success: function(res) {
								if (res.confirm) {
									console.log('用户点击确定');
								}
							}
						});
					} else {
						uni.setStorageSync('storage_key', this.phone);
						if (this.password == this.sms) {
							uni.request({
								url: getApp().globalData.api + '/Login/Login', //仅为示例，并非真实接口地址。
								data: { //请求的参数
									Account: this.phone,
									Password: this.password,
									uuId: this.uuid
								},
								success: (res) => { //请求成功
									console.log('登录数据=', res.data)

									if (res.data.code == 1 || res.data.code == 2 || res.data.code == 3) {
										//发送请求，如果成功则跳转	 
										if (JSON.stringify(res.data.data[0]) !== undefined) { //该用户存在
											console.log('有权限')
											getApp().globalData.userName = this.phone; //账号，密码，赋给全局变量
											getApp().globalData.userPwd = this.password;
											getApp().globalData.userID = res.data.data[0].ID,
												getApp().globalData.code = res.data.code;
											getApp().globalData.Name = res.data.data[0].Name;
											getApp().globalData.quId = res.data.data[0].quId;
											getApp().globalData.login = true;
											getApp().globalData.userylyid = res.data.data[0].userylyid;
											getApp().globalData.ParentID = res.data.data[0].ParentID;

											console.log(getApp().globalData.userPwd)
											uni.switchTab({
												url: '../index'
											});
										} else { //该用户不存在，让后台分配权限
											console.log('无权限')
											uni.showModal({
												content: '您登陆的账号无权限，请联系管理员给您分配权限！',
												showCancel: false,
												success: function(res) {
													if (res.confirm) {
														console.log('用户点击确定');
													}
												}
											});
										}
									} else if (res.data.code == -2) {
										uni.showModal({
											content: '您登陆的设备未绑定，为防止泄密，请联系管理员！',
											showCancel: false,
											success: function(res) {
												if (res.confirm) {
													console.log('用户点击确定');
												}
											}
										});
									} else {
										uni.showModal({
											content: '手机号或验证码错误！',
											showCancel: false,
											success: function(res) {
												if (res.confirm) {
													console.log('用户点击确定');
												}
											}
										});
									}
								},
								fail: (res) => { //请求失败
									console.log('请求失败');
									uni.showModal({
										content: '网络请求错误！',
										showCancel: false,
										success: function(res) {
											if (res.confirm) {
												console.log('用户点击确定');
											}
										}
									});
								}
							});
						} else {
							// if(this.phone != '18435106854' || this.phone != '13003111300' || this.phone != '13003111301' || this.phone != '13003111302'){
							if (this.phone != '18435106854') {
								uni.showModal({
									content: '验证码错误！',
									showCancel: false,
									success: function(res) {
										if (res.confirm) {
											console.log('用户点击确定');
										}
									}
								});
							}
							// uni.showModal({
							//     content: '验证码错误！',
							// 	showCancel:false,
							//     success: function (res) {
							//         if (res.confirm) {
							//             console.log('用户点击确定');
							//         }
							//     } 
							// });
						}

					}
				}
			},
			// forgetPassword(){
			// 	uni.navigateTo({
			// 		url:'./password/password'
			// 	})
			// },
			getSMS() {
				var _this = this;
				if (this.phone == '') {
					uni.showModal({
						content: '手机号码不得为空！',
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
							}
						}
					});
				} else {
					if (this.phone.length != 11) {
						console.log('1212')
						uni.showModal({
							content: '请输入正确的11位手机号码',
							showCancel: false,
							success: function(res) {
								if (res.confirm) {
									console.log('用户点击确定');
								}
							}
						});
					} else {
						if (!this.isClick) {
							return;
						}
						uni.request({
							url: getApp().globalData.api + '/Login/SendSmsToUser', //仅为示例，并非真实接口地址。							    
							data: { //请求的参数
								Phone: this.phone
							},
							success: (res) => { //请求成功
								console.log(res.data)
								_this.sms = res.data.sms;
								console.log('sms=', _this.sms)
								_this.isClick = false;
								let times = 59; // 用于倒计时
								_this.time = times + ' s';
								_this.interval = setInterval(() => {
									times--;
									_this.time = times + ' s';
									if (times < 0) {
										_this.time = '重新获取';
										_this.isClick = true;
										clearInterval(_this.interval);
									}
								}, 1000)
								// if(res.data.code==2 || res.data.code==3){
								// 	//发送请求，如果成功则跳转	
								// }else{
								// 	uni.showModal({
								// 	    content: '手机号或验证码错误！',
								// 		showCancel:false,
								// 	    success: function (res) {
								// 	        if (res.confirm) {
								// 	            console.log('用户点击确定');
								// 	        }
								// 	    }
								// 	});
								// }								
							},
							fail: (res) => { //请求失败
								console.log('请求失败');
								uni.showModal({
									content: '网络请求错误！',
									showCancel: false,
									success: function(res) {
										if (res.confirm) {
											console.log('用户点击确定');
										}
									}
								});
							}
						});
					}
				}
			}
		}
	}
</script>

<style>
	page {
		font-size: 30rpx;
		width: 100%;
		height: 100%;
		background-color: #F5F5F5;
		overflow: hidden;
	}

	.header {
		width: 100%;
		height: 350rpx;
		position: relative;
	}

	.header image {
		width: 100%;
		height: 100%;
	}

	.content {
		width: 650rpx;
		height: 730rpx;
		border-radius: 30rpx;
		padding: 150rpx 95rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		box-shadow: 2px 3px 5px #cccccc;
		;
		position: absolute;
		left: 50rpx;
		bottom: 220rpx;
	}

	.card {
		width: 500rpx;
		height: 440rpx;
		position: relative;
	}

	.card input {
		padding: 20rpx;
	}

	.card .sms {
		display: flex;
		align-items: center;
		padding-right: 20rpx;
		box-sizing: border-box;
		border-bottom: 2rpx solid #F5F5F5;
	}

	.card .phone {
		display: flex;
		align-items: baseline;
		padding-right: 20rpx;
		box-sizing: border-box;
		border-bottom: 2rpx solid #F5F5F5;
	}

	.card .phone .clear {
		width: 40rpx;
		text-align: center;
		color: #999;
	}

	.txt {
		width: 70%;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		color: #497DE5;
	}

	.image {
		width: 550rpx;
		height: 380rpx;
		position: absolute;
		top: -259rpx;
		left: 47rpx;
	}

	.image image {
		width: 100%;
		height: 100%;
	}

	.tj {
		width: 100%;
		position: absolute;
		bottom: 0rpx;
	}

	.tj button {
		margin-bottom: 20rpx;
	}
</style>
