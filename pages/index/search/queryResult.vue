<template>
	<view class="mine">		
		<view class="model" v-if="isShow">   <!-- 模态框 -->
			<view class="con">
				<view class="tit">{{title}}</view>
				<view class="co">
					<view class="n" @tap="quxiao">取消</view>
					<view class="y" @tap="confirmY">确定</view>
				</view>
			</view>
		</view>
		<!-- 查询结果 -->		
		<view class="my_info_list">
			<view class="my_info_item" @tap="getDetails(item.ID)" v-for="(item,index) in my_info_list" :key="index">
				<view class="img_box">{{item.Name}}</view>
				<view class="my_info">
					<view class="">{{item.ReligName}}</view>
					<view class="box">
						<image src="../../../static/mine/jiantou.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>		
	</view>
</template>

<script>
	export default{
		data() {
			return {
				my_info_list: [],
				title:'',              //模态框组件  显示内容
				isShow:false           //模态框组件  初始化状态
			}
		},
		methods:{	
			confirmY(){                //模态框
				this.isShow=false;
			},
			quxiao(){                   //模态框
				this.isShow=false;
			},
			getDetails(id){
				//发送请求，如果成功则跳转。
				uni.navigateTo({
					url: 'peopleDetails?id='+id
				})				
			}
		},
		onLoad:function(option){
			console.log(option)
			var _this=this;
			uni.request({
				url:getApp().globalData.api+ '/Check/GetReligPersonList',
				data:{
					Account:getApp().globalData.userName,
					Password:getApp().globalData.userPwd,						
					Name:option.realName,
					ReligName:'',
					IDCard:option.carId,
					Certificate:option.zhengshu,						
					Street:option.region,
					ChristName:option.jiaoming
				},
				success(res) {
					console.log(res.data)
					if(res.data.code==0){
						_this.my_info_list=res.data.data;
						console.log('成功')
					}else if(res.data.code==1){
						_this.isShow=true;
						_this.title='您所查询的人员不存在！';
						console.log('失败')
					}else if(res.data.code==-1){
						console.log('用户名或密码错误')
					}
				},
				fail(res) {
					console.log(res)
				}
			});			
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
		navigator{
			display: flex;
			align-items: center;
			.box{
				width: 100rpx;height: 100rpx;
				border-radius: 50%;
				background-color: #D1D1D1;
				margin-right: 20rpx;
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
				width: 160rpx;height: 40rpx;
				margin-right: 16rpx;
			}
			.my_info{
				width: 600rpx;
				display: flex;
				color:#999;
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
		width:100%;height:80rpx;
		line-height: 80rpx;
		text-align: center;
		position: absolute;
		bottom: 80rpx;
		color:#ff5857;
		border-radius: 6rpx;
		background-color: #fff;
	}
	// 模态框  样式
	.model{
		position: fixed;
		top:0;left:0;
		z-index: 10;
		width: 100%;height: 100%;
		background-color: rgba(0,0,0,0.4);
	}
	.model .con{
		height: 280rpx;width: 80%;
		position: absolute;
		top:50%;left:50%;
		margin-left: -40%;
		margin-top: -140rpx;
		border-radius: 8rpx;
		background-color: #fff;
		text-align: center;
		font-size: 36rpx;
	}
	.model .con .tit{
		height:180rpx;
		line-height: 120rpx;		
	}
	.model .con .co{
		display: flex;
		line-height: 100rpx;
		border-top: solid 1rpx #eee;
	}
	.model .con .co view{
		width: 49.9%;
	}
	.model .con .co .n{
		border-right:solid 1rpx #eee;
	}
	.model .con .co .y{
		color:#3385ff;
	}
</style>
