<template>
	<view class="mine">		
		<!-- 人员详细信息展示 -->		
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
					<text>所</text>
					<text>属</text>
					<text>村</text> 
					<text>：</text>
				</view>
				<text>{{info_list.VillageName}}</text>					
			</view>
			<view class="my_info">
				<view class="tit">
					<text>身份证号</text>	
					<text>：</text>
				</view>					
				<text>{{info_list.IdCard}}</text>
			</view>
			<view class="my_info">
				<view class="tit">
					<text>出生年月</text>	
					<text>：</text>
				</view>		
				<!-- <text>{{info_list.IdCard.slice(6,10)}}-{{info_list.IdCard.slice(10,12)}}-{{info_list.IdCard.slice(12,14)}}</text> -->
				<text>{{year}}-{{month}}-{{day}}</text>
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
					<text>教</text>
					<text>别</text>					
					<text>：</text>
				</view>		
				<text>{{info_list.Religcategory}}</text>
			</view>
			<view class="my_info">
				<view class="tit">
					<text>活动场所</text>
					<text>：</text>
				</view>	
				<text>{{info_list.ActivityPlace}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				info_list:{},
				year:'',      //出生   年  月  日
				month:'',
				day:''
				
			}
		},
		methods:{			
			// getDate(e){
			// 	var b=e.slice(6,e.length-2);
			// 	var day=new Date(parseInt(b));
			// 	let month = (day.getMonth()+1)>9?(day.getMonth()+1):'0'+(day.getMonth()+1);
			// 	let day1 = day.getDate()>9?day.getDate():"0" + day.getDate();
			// 	var date=day.getFullYear()+"-"+month+"-"+day1;
			// 	return date
			// }
		},
		onLoad:function(option){
			console.log(option)
			var _this=this;
			uni.request({
				url:getApp().globalData.api+ '/ReligMasses/GetReligMassesDetail',
				data:{
					Account:getApp().globalData.userName,
					Password:getApp().globalData.userPwd,						
					ID:option.id,
				},
				success(res) {
					console.log(res.data)						
					if(res.data.code==0){
						_this.info_list=res.data.data[0];
						_this.year=_this.info_list.IdCard.slice(6,10)
						_this.month=_this.info_list.IdCard.slice(10,12)
						_this.day=_this.info_list.IdCard.slice(12,14)
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
		margin-top: 40rpx;
	}
	.my_info{
		line-height: 68rpx;
		color:#999;
		display: flex;
	}
	.my_info>text:last-child{
		color:#000;
		margin-left: 16rpx;
	}
	.my_info_item .my_info .tit{
		max-width: 190rpx;
		width: 188rpx;
		display: flex;
		justify-content: space-between;
	}
</style>
