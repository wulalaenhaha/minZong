
<template>
	<!-- 办事说明 ---->
	<view class="place_select">
		<!-- 巡查项目 -->		
		<form>
			<view class="header">
				<view>
					<view class="tit">标题：</view>
					<view class="con">{{dataArray[0].sTitle}}</view>
				</view>				
			</view>
			<view class="header">
				<view>
					<view class="tit">地址：</view>
					<view class="con">{{dataArray[0].sPlace}}</view>
				</view>				
			</view> 
			<view class="textarea">
				<view class="tit">问题说明</view>
				<view>
					<textarea name="" :disabled="code==1" class="con" id="" v-model="dataArray[0].sContent" cols="30" rows="4"></textarea>
				</view>
				<view class="add">
					<block v-for="(item,index) in imgUrl1" :key='index'>
						<image class="img" mode="scaleToFill" v-show="item[0]==''?false:true" :src="item" @tap="previewImg(index)"></image>
					</block>
				</view>
			</view>
			<view class="header">
				<view>
					<view class="tit">上报时间：</view>
					<view class="con">{{dataArray[0].AddTime}}</view>
				</view>				
			</view>
			<view class="header">
				<view>
					<view class="tit">上报人：</view>
					<view class="con">{{dataArray[0].AddManName}}</view>
				</view>				
			</view>
			<view v-if="isShow==true" style="margin-top: 10rpx;">
				 <view class="header">
					<view>
						<view class="tit">处理结果：</view>
						<view class="con">{{dataArray[0].DealContent}}</view>
					</view>				
				 </view>
				 <view class="header">
					<view>
						<view class="tit">处置人：</view>
						<view class="con">{{dataArray[0].DealManName}}</view>
					</view>				
				 </view>
				  <view class="header">
					<view>
						<view class="tit">处置时间：</view>
						<view class="con">{{dataArray[0].DealTime}}</view>
					</view>				
				  </view> 
			</view>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current:1,
				DealContent:'',
				imgUrl1:[],
				dataArray:[],
				id:1,           
				imgUrl:[],
				showMask:true,  
				code:'',          //登录人员类别
				isShow:false,     //根据tag，显示处理人
				
			}
		},
		onLoad:function(option){
			console.log(option)
			if(option.status==0){
				this.isShow=false
			}else{
				this.isShow=true
			}
			this.id=option.ID
			var _this=this;
			uni.request({
				url:getApp().globalData.api+ '/OnlineWork/GetMessageDetatil',
				data:{
					Account:getApp().globalData.userName,
					Password:getApp().globalData.userPwd,
					ID:this.id
				},
				success(res) {
					console.log(res.data)
					if(res.data.code==0){
						_this.dataArray=res.data.data;	
						 _this.dataArray[0].DealTime=_this.getDate(_this.dataArray[0].DealTime)
						 _this.dataArray[0].AddTime=_this.getDate(_this.dataArray[0].AddTime)
						 
						if(res.data.data[0].PhotoUrl!=null){
							var PhotoUrl=res.data.data[0].PhotoUrl.split(',')
							for (var i = 0; i < PhotoUrl.length; i++) {
								PhotoUrl[i]=getApp().globalData.imgUrl+PhotoUrl[i];
							}
							_this.imgUrl1=PhotoUrl;
						}
						console.log('成功')
						console.log(_this.dataArray)
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
		},
		methods:{
			previewImg(index){
				uni.previewImage({
					current: index,
					urls: this.imgUrl1
				})
			},
			getDate(e){
				var b=e.slice(6,e.length-2);
				var day=new Date(parseInt(b));
				var date=day.getFullYear()+"-"+day.getMonth()+"-"+day.getDate();
				var time=day.getHours()+":"+day.getMinutes()+":00";
				return date+" "+time
			}
		},
	}
</script>

<style>	
	.header,
	.textarea,
	.check{ 
		width: 100%;
		padding: 20rpx 30rpx;
		background-color: #fff;		
	}
	.header>view,
	.check{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.header view.tit{
		width: 22%;
		font-weight: 500;
	}
	.tit text{
		width: 10rpx;
		height: 10rpx;
		background-color: #487DE5;
	}
	.header view.con{
		font-size: 28rpx;	
		width: 78%;
	}
	input{
		min-width:500rpx;
	}
	.textarea{
		margin: 10rpx 0;
	}
	.textarea>view{
		margin-bottom: 20rpx;
	}
	.textarea .add{
		margin-bottom: 0;
	}
	.textarea textarea{
		height:150rpx;
	}
	.textarea .tit{
		line-height: 60rpx;
	}
	.img{
		width: 120rpx;height:120rpx;
		margin:10rpx;
	}
	.addImg{
		width: 100rpx;height:100rpx;
		margin-left: 14rpx;
		cursor:pointer;
	}
	.check .radios,
	.con{
		color:#868686;
	}
	.check radio{
		transform:scale(0.6);
		margin-left: 50rpx;		
	}
	.tj{
		width: 100%;
		position: absolute;
		bottom: 0;
		padding: 20rpx 30rpx;
	}	
	/* 删除按钮 */
	.times{
		display: inline-block;
		width: 32rpx;height:32rpx;
		text-align: center;
		line-height: 30rpx;
		position: relative;
		font-size: 18rpx;
		top:-120rpx;left:-20rpx;
		background-color: #f00;
		border-radius: 50%;
		color:#fff;
	}
</style>


