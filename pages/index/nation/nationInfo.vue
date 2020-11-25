<template>
	<view class="mine">		
		<!-- 少数民族人员详细信息展示 
		// 详情页 api/Nation/GetNationDetail?Account=test&Password=123456&ID=1645-->		
		<!-- <view class="showImg">
			<image class="img" :src="info_list.Photo"></image>
		</view> -->
		<view class="my_info_item" >
			<view class="my_info">
				<view class="tit">
					<text>姓</text>
					<text>名</text>
					<text>：</text>
				</view> 
				<text>{{info_list.Name}}</text>
			</view>
			<view class="my_info">
				<view class="tit">					 
					<text>性</text>
					<text>别</text>
					<text>：</text>
				</view> 
				<text>{{info_list.Sex}}</text>					
			</view>
			<view class="my_info">
				<view class="tit">					 
					<text>民</text>
					<text>族</text>
					<text>：</text>
				</view> 
				<text>{{info_list.Nation}}</text>					
			</view>
			<view class="my_info">
				<view class="tit">
					<text>所</text>
					<text style="margin-left: 0rpx;">属</text>
					<text style="ba">村</text> 
					<text>：</text>
				</view>
				<text>{{info_list.VillageName}}</text>					
			</view>
			<view class="my_info">
				<view class="tit">					
					<text>住</text>
					<text>址</text>
					<text>：</text>					
				</view>				
				<text>{{info_list.Address}}</text>
			</view>
			<view class="my_info">
				<view class="tit">
					<text>出生年月</text>	
					<text>：</text>
				</view>		
				<!-- <text>{{info_list.IdCard.slice(6,10)}}-{{info_list.IdCard.slice(10,12)}}-{{info_list.IdCard.slice(12,14)}}</text> -->
				<text>{{info_list.Birthday}}</text>
			</view>
			
			<view class="my_info">				
				<view class="tit">
					<text>联系电话</text>	
					<text>：</text>
				</view>
				<text>{{info_list.Phone}}</text>
			</view>
			<view class="my_info">
				<view class="tit">
					<text>文化程度</text>
					<text>：</text>
				</view>				
				<text>{{info_list.EducationDegree}}</text>				
			</view>
			<view class="my_info">
				<view class="tit">
					<text>录入时间</text>
					<text>：</text>
				</view>				
				<text>{{info_list.Year}}</text>				
			</view>
			<view class="my_info">
				<view class="tit">
					<text>人员类别</text>
					<text>：</text>
				</view>				
				<text>{{info_list.typename}}</text>				
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				info_list:{}
			}
		},
		onLoad:function(option){
			console.log(option)
			var _this=this;
			uni.request({
				url:getApp().globalData.api+ '/Nation/GetNationDetail',
				data:{
					Account:getApp().globalData.userName,
					Password:getApp().globalData.userPwd,						
					ID:option.id,
				},
				success(res) {
					console.log(res.data)						
					if(res.data.code==0){
						_this.info_list=res.data.data[0];
						// _this.year=_this.info_list.IdCard.slice(6,10)
						// _this.month=_this.info_list.IdCard.slice(10,12)
						// _this.day=_this.info_list.IdCard.slice(12,14)
						console.log('成功')
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
</script>

<style>
	page{
		background-color: #F5F5F5;
	}
	.showImg{
		width: 100%;height:300rpx;
		text-align: center;
		line-height: 300rpx;
		padding: 25rpx 0;
	}
	.showImg image{
		width: 260rpx;height:250rpx;
	}
	.my_info_item{
		width: 100%;
		background-color: #fff;
		padding: 20rpx;
		margin-top: 20rpx;
	}
	.my_info{
		line-height: 68rpx;
		color:#999;
		display: flex;
	}
	.my_info>text:last-child{
		color:#000;
		/* margin-left: 16rpx; */
	}
	.my_info_item .my_info .tit{
		/* max-width: 190rpx;
		width: 188rpx; */
		width: 23%;
		display: flex;
		justify-content: space-between;
	}
</style>
