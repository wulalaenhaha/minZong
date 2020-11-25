<template>
	<view class="detail">
		<view style="line-height: 60rpx;text-align: center;font-weight: bold;">{{dataDetail[0].Title}}</view>
		<view style="min-height:600rpx;text-indent: 2em;font-size: 28rpx;line-height: 80rpx;">{{dataDetail[0].Content}}</view>
		<view style="line-height: 60rpx;font-size: 26rpx;color:#868686;text-align: right;">上报时间：{{dataDetail[0].AddTime}}</view>		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userID:1,
				dataDetail:[]
			}
		},
		methods: {
			getDate(e){
				var b=e.slice(6,e.length-2);
				var day=new Date(parseInt(b));
				let month = (day.getMonth()+1)>9?(day.getMonth()+1):'0'+(day.getMonth()+1);
				let day1 = day.getDate()>9?day.getDate():"0" + day.getDate();
				var date=day.getFullYear()+"-"+month+"-"+day1;
				return date
			},
			updateNew(isRead,id){           //更新阅读状态数据
				if(isRead==0){
					uni.request({
						url:getApp().globalData.api+ '/Message/UpdateMessage',
						data:{
							Account:getApp().globalData.userName,
							Password:getApp().globalData.userPwd,
							ID:id
						},
						success(res) {
							console.log(res.data)
							if(res.data.code==0){
								console.log('成功，消息状态变为：已读')
								getApp().globalData.infoNum--;
								if(getApp().globalData.infoNum==0){
									uni.removeTabBarBadge({
										index: 1
									})
								}else{
									uni.setTabBarBadge({
									  index: 1,
									  text: getApp().globalData.infoNum.toString()
									})
								}								
							}else if(res.data.code==1){
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
		},
		onLoad:function(option){
			console.log('option=',option)
			var _this=this; 
			uni.request({                //获取数据
				url:getApp().globalData.api+ '/Message/GetMessageDetatil',
				data:{
					Account:getApp().globalData.userName,
					Password:getApp().globalData.userPwd,
					ID:option.ID
				},
				success(res) {
					console.log(res.data)
					if(res.data.code==0){
						console.log('成功获得消息详情')
						 _this.dataDetail=res.data.data;
						 _this.updateNew(res.data.data[0].IsRead,option.ID)     //更新阅读状态数据
						 for (var i = 0; i < _this.dataDetail.length; i++) {
						 	_this.dataDetail[i].AddTime=_this.getDate(_this.dataDetail[i].AddTime)
						 }		
						// console.log(_this.dataDetail)
					}else if(res.data.code==1){
						console.log('失败')
					}else if(res.data.code==-1){
						console.log('用户名或密码错误')
					}
				},
				fail(res) {
					console.log(res)
				}
			});
		// console.log(this.dataDetail.length)
		}
	}
	
</script>

<style>
	.detail{
		box-sizing: border-box;
		padding: 10rpx 30rpx 0;
		background-color: #fff;
		border-radius: 26rpx;
	}
</style>
