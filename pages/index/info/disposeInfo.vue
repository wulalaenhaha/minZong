<template>
	<!-- 信息详情 ---->
	<view class="place_select">
		<!-- 提交成功弹窗 -->
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
		<view class="header" style="display: flex;">
			<block v-for="(item,index) in dataObj.PhotoUrl" :key="index">
				<image class="addImg" :src="item" @tap="previewImage(index)"></image>
			</block> 
			<view>
				<block v-for="(item1,index1) in videoSrc" :key="index1">
					<!-- <video class="addImg" v-show="item1!=''?true:false" :src="item1"></video> -->
					<view class="prew" @tap="prew(item1)">
						<view class="play"></view>
					</view>	
				</block>
			</view>
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
				<view class="nr">{{dataObj.AddManName}}</view>
			</view>				
		</view>
		
		<view class="tj">
			<button type="primary" @tap="tijiao">返 回</button>
		</view>		
	</view>
</template>

<script>
	export default {
		data() {
			return {				
				isShow:false,
				src:'',
				index:'',
				dataObj:{},
				videoSrc:[]
				// arr:['已派相关人员前去处理1','已派相关人员前去处理2','已派相关人员前去处理3','已派相关人员前去处理4']
			}
		},
		methods: {
			previewImage: function(e) {       //预览图片
				uni.previewImage({
					current: e,
					urls: this.dataObj.PhotoUrl,
					// longPressActions:{
					// 	itemList:['保存到相册','识别图中二维码'],
					// 	success: function(data) {
					// 		console.log(data); 
					// 	},
					// 	fail: function(err) {
					// 		console.log(err.errMsg);
					// 	}
					// }
				})
			},		
			prew(src){       //预览视频
				// console.log(src)
				uni.navigateTo({
					url:'../soft/reportInfo/video?src='+src
				})
			},
			bindPickerChange(v){
				this.index=v.detail.value;				
			},
			chuzhi(){
				this.isShow=!this.isShow;						
			},
			tijiao(){      //返回上一页
				uni.navigateBack({
					url: './info'
				})
			},
			getDate(e){
				var b=e.slice(6,e.length-2);
				var day=new Date(parseInt(b));
				let month = (day.getMonth()+1)>9?(day.getMonth()+1):'0'+(day.getMonth()+1);
				let day1 = day.getDate()>9?day.getDate():"0" + day.getDate();
				var date=day.getFullYear()+"-"+month+"-"+day1;
				var hours=day.getHours()>9?day.getHours():'0'+day.getHours();
				var mins=day.getMinutes()>9?day.getMinutes():'0'+day.getMinutes();
				var time=hours+":"+mins+":00";
				return date+" "+time
			}
		},
		onLoad:function(option){
			// console.log(option)
			var _this=this;
			uni.request({
				url:getApp().globalData.api+ '/Report/GetReportDetatil',
				data:{
					Account:getApp().globalData.userName,
					Password:getApp().globalData.userPwd,						
					ID:option.ID
				},
				success(res) {	
					console.log(res.data)
					if(res.data.code==0){
						console.log('成功')
						var obj={};
						obj=res.data.data[0];						
						var InformTime=_this.getDate(obj.InformTime);
						var AddTime=_this.getDate(obj.AddTime);
						var DealTime=_this.getDate(obj.DealTime);
						var PhotoUrl=obj.PhotoUrl.split(','),imgArr=[];
						for (var i = 0; i < PhotoUrl.length; i++) {
							var videoIndex=PhotoUrl[i].indexOf('mp4');
							PhotoUrl[i]=getApp().globalData.imgUrl+PhotoUrl[i];
							if(videoIndex==-1){
								imgArr.push(PhotoUrl[i])
							}else{
								_this.videoSrc.push(PhotoUrl[i])
							}
						}
						_this.dataObj=res.data.data[0];
						_this.dataObj.InformTime=InformTime;
						_this.dataObj.AddTime=AddTime;
						_this.dataObj.DealTime=DealTime;
						_this.dataObj.PhotoUrl=imgArr;	
						// console.log(obj)
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
		},
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
	}
	view.tit{
		min-width: 160rpx;
		max-width: 200rpx;
		font-weight: 500;
	}		
	.nr{
		color:#868686;
		max-width: 500rpx;
		font-size: 14px;
		line-height: 46rpx; 
	}
	.addImg{
		width:120rpx;height:120rpx;
		margin: 0 10rpx;
	}
	.tj{
		width: 100%;
		position: absolute;
		bottom: 0;
		padding: 20rpx 30rpx;
	}	
	.fire{
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;	
		padding: 0 30rpx;
		background-color: #fff;	
		margin-top: 60rpx;
	}
	.fire>view{
		display: flex;
		align-items: center;		
	}
	.picker{
		width: 136rpx;height:60rpx;
		display: flex;
		align-items: center;
		line-height: 60rpx;
		color:#868686;
		font-size: 14px;
	}
	.content{
		display: flex;
		justify-content: flex-start;
		color: #868686;
	}
	.lineLeft{
		background-color: #487DE5;		
		width: 4px;height:36rpx;
		margin-right: 12rpx;
	}
	/* 视频显示 */
	.prew{
		width: 120rpx;height:120rpx;
		/* position:relative; */
		background-color: #000000;
		z-index: 10;
		margin:0 10rpx;
	}
	.play{
		width: 0;height: 0;
		border:solid 20rpx #fff;
		border-top: solid 20rpx transparent;
		border-bottom: solid 20rpx transparent;
		border-right: none;
		margin: 0 auto;
		line-height: 120rpx;
		position: relative;
		top:40rpx;
	}
</style>


