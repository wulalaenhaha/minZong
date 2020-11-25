<template>
	<view class="Mine">
		
		<!-- 登录 --> 
		<view class="login">
			<view class="login_item" @tap="login()">
				<view class="box">
					<image src="../../static/wode.png" class="mine"></image>
				</view>
				<view class="">{{userName}}</view>
			</view>
		</view>
		<view class="my_info_list">
			
			<!-- <view class="my_info_item" v-if="code==3?'true':''" @tap="getInfo4()">
				<view class="my_info">
					<view class="">腾讯云实时直播</view>
					<view class="box">
						<image src="../../static/mine/jiantou.png" mode="aspectFill"></image>
					</view>
				</view>
			</view> -->
			
			<view class="my_info_item" v-if="code==3?'true':''" @tap="getInfo3()">
				<view class="my_info">
					<view class="">实时直播</view>
					<view class="box">
						<image src="../../static/mine/jiantou.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			
			<!-- <view class="my_info_item" v-if="code==3?'true':''" @tap="getInfo13()">
				<view class="my_info">
					<view class="">跳转微信</view>
					<view class="box">
						<image src="../../static/mine/jiantou.png" mode="aspectFill"></image>
					</view>
				</view>
			</view> -->
			
			<view class="my_info_item" @tap="getInfo">
				<!-- <view class="img_box"></view> -->
				<view class="my_info">
					<view class="">关于我们</view>
					<view class="box">
						<image src="../../static/mine/jiantou.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<view class="my_info_item" @tap="getInfo1()">
				<view class="my_info">
					<view class="">APP隐私政策</view>
					<view class="box">
						<image src="../../static/mine/jiantou.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>
		
		<view class="logout" @tap="logout">退出登录</view>
	</view>
</template>
 
<script>
	export default{
		data() {
			return {
				my_info_list: [
					{name:'我的信息'}					
				],
				te:'',
				userName: '点击登录',
				code:'',      //人员登录类型 2为：巡查专员，3为场所人员
			} 
		},
		methods:{
			login(){
				if(!getApp().globalData.login){
					uni.navigateTo({
						url:'../index/login/login'
					})
					console.log("登录")
				}
			},
			logout(){            //退出登录，清楚登录状态
				if(!getApp().globalData.login){
					uni.showModal({
						content:'请您先登录！',
						success: function (res) {
						    if (res.confirm) {
						        console.log('用户点击确定');
								uni.navigateTo({
									url: '../index/login/login',
									success: res => {},
									fail: () => {},
									complete: () => {}
								});
						    }
						}
					})
				}else{
					uni.showModal({
						title:'退出登录',
						content:'您确定退出当前登录状态吗？',					
						success: function (res) {
						    if (res.confirm) {
								getApp().globalData.userName='';
								getApp().globalData.userPwd='';
								getApp().globalData.userID='';
								getApp().globalData.code='';
								getApp().globalData.Name='';
								getApp().globalData.login=false;
								getApp().globalData.userylyid=-1;
						        console.log('用户点击确定');
								uni.navigateTo({
									url: '../index/login/login',
									success: res => {},
									fail: () => {},
									complete: () => {}
								});
						    }
						}
					})	
				}		
			},
			getInfo(){
				uni.navigateTo({
					url:'./userInfo'
				})
			},
			getInfo1(){
				uni.navigateTo({
					url:'./yinsi'
				})
			},				
			getInfo3(){
				uni.navigateTo({
					url:'./zhiwen-livepush'
				})
			}
		},
		onShow() {		
			console.log('userName=',getApp().globalData.Name)
			let userID=getApp().globalData.userID;
			if(userID==''){
				this.userName='点击登录';
			}else{
				this.userName=getApp().globalData.Name;
			}
			// this.code=getApp().globalData.code;
			// if(this.code==1 || this.code==2 || this.code==3){
			// 	if(getApp().globalData.Name==''){
			// 		this.userName='点击登录';
			// 	}else{
			// 		this.userName=getApp().globalData.Name;
			// 	}
			// }else{
			// 	this.userName='点击登录';					
			// }			
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #F5F5F5;
	}
	.login{
		width: 100%;height: 140rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		.login_item{
			display: flex;
			align-items: center;
			.box{
				width: 100rpx;height: 100rpx;
				border-radius: 50%;
				margin:0 30rpx 0 10rpx;
				text-align: center;
				
			}
		}
	}
	.my_info_list{
		width: 100%;
		margin-top: 20rpx;
		background-color: #FFFFFF;
		padding: 0 30rpx;
		font-size: 30rpx;
		color: #262626;
		box-sizing: border-box;
		.my_info_item{
			width: 100%;height: 80rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 2rpx solid #F5F5F5;
			.img_box{
				width: 40rpx;height: 40rpx;
				background-color: #999999;
			}
			.my_info{
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.box{
					width: 18rpx;height: 30rpx;
					image{
						width: 80%;height: 80%;
					}
				}
			}
		}
	}
	.logout{
		width:100%;
		height:100rpx;
		line-height: 100rpx;
		text-align: center;
		position: absolute;
		bottom: 80rpx;
		color:#ff5857;
		border-radius: 6rpx;
		background-color: #fff;
	}
	.Mine{
		width: 100%;height: 100%;
	}
	.mine{
		width: 100%;height: 100%;
		// padding: 0 30rpx;
	}
</style>
