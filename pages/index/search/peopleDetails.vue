<template>
	<view class="mine">		
		<!-- 人员详细信息展示 -->		
		<view class="showImg" v-if="isPhoto==true">
			<image class="img" :src="info_list.Photo"></image>
		</view>
		<view class="my_info_item">
			<view class="my_info">
				<view class="tit">
					<text>真实姓名</text> 
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
					<text>所在宗教</text> 
					<text>：</text>
				</view>
				<text>{{info_list.ReligName}}</text>					
			</view>
			<view class="my_info">
				<view class="tit">
					<text>资格证书</text> 
					<text>：</text>
				</view>
				
				<text>{{info_list.Certificate}}</text>
			</view>
			<view class="my_info">
				<view class="tit">
					<text>教</text>
					<text>名</text>
					<text>：</text>
				</view>
				<text>{{info_list.ChristName}}</text>
			</view>
			<view class="my_info">
				<view class="tit">
					<text>身份证号</text> 
					<text>：</text>
				</view>
				<text>{{info_list.IDCard}}</text>
			</view>
			<view class="my_info">
				<view class="tit">
					<text>出生日期</text>	
					<text>：</text>
				</view>
				<text>{{info_list.Birthday}}</text>
			</view>
			<view class="my_info">
				<view class="tit">
					<text>联系方式</text>
					<text>：</text>
				</view>
				<text>{{info_list.Phone}}</text>				
			</view>
			<view class="my_info">
				<view class="tit">
					<text>所属街道</text>
					<text>：</text>
				</view>
				<text>{{info_list.Street}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				info_list:{},
				isPhoto:false
			}
		},
		methods:{			
			getDate(e){
				var b=e.slice(6,e.length-2);
				var day=new Date(parseInt(b));
				let month = (day.getMonth()+1)>9?(day.getMonth()+1):'0'+(day.getMonth()+1);
				let day1 = day.getDate()>9?day.getDate():"0" + day.getDate();
				var date=day.getFullYear()+"-"+month+"-"+day1;
				return date
			}
		},
		onLoad:function(option){
			// console.log(option)
			var _this=this;
			uni.request({
				url:getApp().globalData.api+ '/Check/GetReligPersonDetatil',
				data:{
					Account:getApp().globalData.userName,
					Password:getApp().globalData.userPwd,						
					ID:option.id						
				},
				success(res) {
					console.log(res.data)						
					if(res.data.code==0){
						_this.info_list=res.data.data[0];
						_this.info_list.Birthday=_this.getDate(_this.info_list.Birthday)
						if(_this.info_list.Photo!=''){
							_this.info_list.Photo=getApp().globalData.imgUrl+_this.info_list.Photo;
							_this.isPhoto=true
						}else{
							_this.isPhoto=false
						}
						console.log(_this.info_list)
						console.log(_this.info_list.Photo)
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
		background-color: #007AFF;
	}
	.showImg image{
		width: 260rpx;height:250rpx;
	}
	.my_info_item{
		height: rpx;width: 100%;
		background-color: #fff;
		padding: 20rpx;
	}
	.my_info{
		line-height: 68rpx;
		color:#999;
		display: flex;
	}
	.my_info>text:last-child{
		color:#000;
	}
	.my_info_item .my_info .tit{
		max-width: 190rpx;
		width: 188rpx;
		display: flex;
		justify-content: space-between;
	}
</style>
