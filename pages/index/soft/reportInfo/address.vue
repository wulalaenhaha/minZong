<template>
	<view class="place_select">		
		<!-- 这个页面应该没用 -->
		<map style="width: 100%; height: 500rpx;" :latitude="nameDetail.MapX" :longitude="nameDetail.MapY" :markers="covers">
			<!-- <cover-view class="search">
				<icon type="search" size="20"></icon>
				<input type="text" @input="changeInput" :value="value1" placeholder="输入地点进行搜索" placeholder-style="font-size:14px;">
			</cover-view> -->
		</map>
		<view class="info">
			<view class="name">
				{{nameDetail.ReligName}}
			</view>
			<view class="address">
				<image src="../../../../static/index/location.png"></image>
				<text>{{nameDetail.Position}}</text>
			</view>
			<view class="phone">
				<image src="../../../../static/index/location.png"></image>
				<text>{{nameDetail.Phone}}</text>
			</view>
		</view>
		<view class="con">
			<view>
				<text>场所负责人</text>
				<text class="right">{{nameDetail.leadName}}</text>
			</view>
			<view>
				<text>场所人数</text>
				<text class="right">{{nameDetail.PeopleNum}}</text>
			</view>
			<view>
				<text>场所派别</text>
				<text class="right">{{nameDetail.Religcategory}}</text>
			</view>
		</view>
	</view>			
</template>

<script>
	export default {
		data() {
			return {
				value1:'',
				latitude: 39.909,
				longitude: 116.39742,
				covers: [{ 
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: '../../../../static/index/location.png'
				}],
				ID:0,        //场所ID
				nameDetail:{}
			}
		},
		methods: {			
			// changeInput(v){
			// 	console.log(v)
			// 	this.value1=v.detail.value;
			// 	uni.chooseLocation({
			// 		keyword:'',
			// 		success:(res)=>{
			// 			console.log(res)
			// 		}
			// 	})
			// }
		},
		// mounted(){
		// 	uni.getLocation({
		// 	    type: 'gcj02',
		// 	    success: function (res) {
		// 			// this.longitude=res.longitude;
		// 			// this.latitude=res.latitude;			//没用？？ 	
		// 			// this.covers[0].longitude=res.longitude;
		// 			// this.covers[0].latitude=res.latitude;	
		// 	        console.log('当前位置的经度：' + res);
		// 	        console.log('当前位置的纬度：' + res.latitude);
		// 	    }
		// 	});
		// },
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
		        // console.log(parseInt(option.ID)); //打印出上个页面传递的参数。		场所： ID     
				this.ID=parseInt(option.ID);
				// console.log('ID:' + this.ID)
		    },
		mounted() {
			var _this=this;
			uni.request({
				url:getApp().globalData.api+ '/Religious/GetReligiousDetatil',
				data:{
					Account:getApp().globalData.userName,
					Password:getApp().globalData.userPwd,						
					ID:this.ID
				},
				success(res) {						
					if(res.data.code==0){
						console.log('成功')
						console.log(res.data.data[0]);
						_this.covers[0].latitude=res.data.data[0].MapX;
						_this.covers[0].longitude=res.data.data[0].MapY;
						_this.nameDetail=res.data.data[0];   //赋值，显示在页面中
					}else if(res.data.code==1){
						console.log('失败')
					}else if(res.data.code==-1){
						console.log('用户名或密码错误')
					}
				},
				fail(res) {
					console.log(res)
				}
			})
		}
	}
	
</script>

<style>	
	.search{
		width: 600rpx;height:70rpx;
		background-color: #fff;
		border-radius: 10rpx;
		margin: 20rpx auto 0;		
		display: flex;
		line-height: 70rpx;
		align-items: center;		
	}
	.search icon{
		width: 70rpx;height:70rpx;
		text-align: center;
		margin-right: 20rpx;
	}
	input{
		width: 530rpx;
	}
	image{
		width: 50rpx;
		height: 50rpx;
	}
	.info{
		width: 100%;height:192rpx;
		padding: 18rpx 30rpx;
		color:#666;
		font-size: 30rpx;
		background-color: #fff;
	}
	.info .name{
		color:#000;
		font-weight: bold;
		font-size: 32rpx;
		padding-left: 10rpx;
	}
	.info>view{
		display: flex;
		align-items: center;
		padding: 4rpx 0;
	}
	.con{
		width: 100%;height:266rpx;
		padding: 10rpx 30rpx;
		background-color: #fff;
		margin-top: 10rpx;
	}
	.con>view{		
		color:#666;
		padding: 10rpx 16rpx;
	}
	.con>view text{
		text-align: left;
	}
	.con .right{
		float: right;
		color:#000;
	}
</style>
