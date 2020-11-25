<template>
 <!-- 信息详情 -->
 <view class="place_select">
  <view class="header">
   <view>
    <view class="tit">事件分类：</view>
    <view class="nr">{{dataObj.EventCategory}}</view>
   </view>     
  </view>
  <view class="header">
   <view>
    <view class="tit">发生时间：</view>
    <view class="nr">
     {{dataObj.InformTime}}
    </view>
   </view>    
  </view>
  <view class="header" style="margin-bottom: 20rpx;">
   <view>
    <view class="tit">发生地点：</view>
    <view class="nr">{{dataObj.InformPlace}}</view>
   </view>    
  </view>
  <!-- 事件说明 -->
  <view class="header">
   <view>
    <view class="tit">事件说明：</view>
    <view class="nr">{{dataObj.Remark}}</view> 
   </view>     
  </view>
  <!-- 具体的图片 -->
  <view class="header">
   <image class="addImg" :src="dataObj.PhotoUrl" @tap="previewImage"></image>
  </view>
  <!-- 上报时间与上报人 -->
  <view class="header">
   <view>
    <view class="tit">上报时间：</view>
    <view class="nr">{{dataObj.AddTime}}</view>
   </view>    
  </view>
  <view class="header">
   <view>
    <view class="tit">上 报 人：</view>
    <view class="nr">{{dataObj.ADDManName}}</view>
   </view>    
  </view>
  <view class="header mt">
   <view>
    <view class="tit">处理结果：</view>
    <view class="nr">{{dataObj.DealResult}}</view>
   </view>    
  </view>
  <view class="header">
   <view>
    <view class="tit">处 置 人：</view>
    <view class="nr">{{dataObj.DealManName}}</view>
   </view>    
  </view>
  <view class="header">
   <view>
    <view class="tit">处置时间：</view>
    <view class="nr">{{dataObj.DealTime}}</view>
   </view>    
  </view>
 </view>
</template>

<script>
 export default {
		data() {
		   return {
				src:'',
				infoID:0,
				dataObj:{}
		   }
		},
		methods: {
			getDate(e){					
				var b=e.slice(6,e.length-2);
				var day=new Date(parseInt(b));
				var date=day.getFullYear()+"-"+day.getMonth()+"-"+day.getDate();
				var time=day.getHours()+":"+day.getMinutes()+":00";
				return date+" "+time
			}
		},
		onLoad: function (option) {
			this.infoID=parseInt(option.ID);
		},
		mounted() {
			var _this=this;
			uni.request({
				url:getApp().globalData.api+ '/Report/GetReportDetatil',
				data:{
					Account:getApp().globalData.userName,
					Password:getApp().globalData.userPwd,						
					ID:this.infoID
				},
				success(res) {	
					// console.log(res.data)
					if(res.data.code==0){
						console.log('成功11')
						var obj={};
						obj=res.data.data[0];						
						var InformTime=_this.getDate(obj.InformTime);
						var AddTime=_this.getDate(obj.AddTime);
						var DealTime=_this.getDate(obj.DealTime);
						var PhotoUrl=obj.PhotoUrl.split(',')
						for (var i = 0; i < PhotoUrl.length; i++) {
							PhotoUrl[i]=getApp().globalData.imgUrl+PhotoUrl[i];
						}
						_this.dataObj=res.data.data[0];
						_this.dataObj.InformTime=InformTime;
						_this.dataObj.AddTime=AddTime;
						_this.dataObj.DealTime=DealTime;
						_this.dataObj.PhotoUrl=PhotoUrl;
						console.log(_this.dataObj)
						// console.log(PhotoUrl.length)
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
 .header{ 
  width: 100%;
  padding: 20rpx 30rpx;
  background-color: #fff;  
 }
 .header>view{
  display: flex;
  justify-content: flex-start;
  align-items: center;
 }
 view.tit{
  font-weight: 500;
 }  
 .nr{
  color:#868686;
  font-size: 14px;
 }
 .addImg{
  width:120rpx;
  height:120rpx;
  margin:0 10rpx; 
 }
 .mt{
  margin-top: 20rpx;
 }
</style>