<template>
	<!-- 合格项详情 -->
	<view class="place_select">
		<view class="header">
			<view> 
				<view class="tit">巡查项目：</view>
				<!-- 是不是应该是个view？ -->
				<!-- <input type="text" disabled placeholder="场所值班电话、值班人员是否上墙公布" placeholder-style="font-size:14px;"> -->
				<view class="itemName">{{dataArray[0].ItemName}}</view>
			</view>				
		</view>
		<view class="header">
			<view>
				<view class="tit">操作指引：</view>
				<!-- 是不是应该是个view？ -->
				<!-- <input type="text" disabled placeholder="场所值班电话、值班人员是否上墙公布" placeholder-style="font-size:14px;"> -->
				<view class="sonName">{{dataArray[0].SonName}}</view>
			</view>				
		</view>
		<!-- 现场情况 -->
		<view class="textarea">
			<view class="tit">现场情况</view>
			<view>
				<textarea name="" id="" v-model="detail" disabled cols="30" rows="4"></textarea>
			</view>
			<view class="add">
				<block v-for="(item,index) in imgUrl1" :key='index'>
					<image class="img" @tap="previewImg(index)" v-show="item[0]==''?false:true" :src="item"></image>
				</block>
			</view>
		</view>
		<!-- 巡查人员与时间 -->
		<view class="header">
			<view>
				<view class="tit">检查人员：</view>
				<view class="checkPeople">{{dataArray[0].CheckManName}}</view>
			</view>				
		</view>
		<view class="header">
			<view>
				<view class="tit">检查时间：</view>
				<view class="checkDate">{{dataArray[0].CheckTime}}</view>
			</view>				
		</view>
		<view class="header" style="margin-top: 10rpx;">
			<view>
				<view class="tit">审核结果：</view>
				<view class="checkDate">{{dataArray[0].AuditStatus}}</view>
			</view>				
		</view>
		<view class="header">
			<view>
				<view class="tit">审核评分：</view>
				<view class="checkDate"> 
					<view v-for="(i,index) in list" :key="index">
					    <image :src="xing>index?src2:src1"/>
					</view>
				</view>
			</view>				
		</view>
		<view v-show="status!=1" class="del" style="margin-top: 200rpx;text-align: center;">
			<button style="width: 90%;" v-if="code==2" @tap="toDel" type="primary">再次处理</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src1:'../../../../static/index/star.png',
				src2:'../../../../static/index/star_active.png',
				list:[0,1,2,3,4],
				xing:0,
				detail:'合格',
				dataArray:[],
				id:'',         //检查项目ID
				status:'',			//合格项1、问题项
				imgUrl1:[],
				showMask:true,
				// videoSrc:[],     //获得的视频地址
				ID:'',             //场所ID
				code:''            //登录人员类别
			}
		},
		methods: {
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
			},
			toDel(){
				uni.navigateTo({
					url:'../inspectInfo/inspectInfo?id='+this.id+'&ID='+this.ID
				})
			}
		},
		onLoad: function (option) {
			this.id=option.id;    //检查项目ID
			this.ID=option.ID;    //场所ID
			this.status=option.status;
			//动态设置标题			
			if(option.status==1){
				uni.setNavigationBarTitle({
				    title: '合格详情'
				});				
			}else{
				uni.setNavigationBarTitle({
				    title: '问题详情'
				});
			}			
			var _this=this;
			uni.request({
				url:getApp().globalData.api+ '/Check/GetCheckProjectDetatil',
				data:{
					Account:getApp().globalData.userName,
					Password:getApp().globalData.userPwd,
					ID:option.id
				},
				success(res) {
					console.log(res.data.data)
					if(res.data.code==0){
						_this.dataArray=res.data.data;	
						_this.dataArray[0].CheckTime=_this.getDate(_this.dataArray[0].CheckTime);						 
						_this.detail=_this.dataArray[0].Remark;	
						_this.xing=res.data.data[0].Score/20
						
						if(res.data.data[0].AuditStatus==2){
							_this.dataArray[0].AuditStatus='不合格'
						}else{
							_this.dataArray[0].AuditStatus='合格'
						}
						if(res.data.data[0].PhotoUrl!=null){
							var PhotoUrl=res.data.data[0].PhotoUrl.split(',')
							for (var i = 0; i < PhotoUrl.length; i++) {
								PhotoUrl[i]=getApp().globalData.imgUrl+PhotoUrl[i];
							}
							_this.imgUrl1=PhotoUrl;
						}
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
			})
		},
		onShow() {
			this.code=getApp().globalData.code;
			// console.log(this.code)
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url:'../inspect/inspect?ID='+this.ID
			})
		},
		// onBackPress() {         //左上角的返回按钮，直接返回首页
		// 	if (this.showMask) {				
		// 		uni.navigateTo({
		// 			url:'../inspect/inspect?ID='+this.ID
		// 		})
		// 		return true;
		// 	} else {
		// 		return true;
		// 	}
		// }
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
		font-size: 16px;	
	}
	view{
		box-sizing: border-box;
	}
	.checkDate{
		display: flex;
	}
	.checkDate view{
		width: 30rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}
	.checkDate view image{
		width: 100%;height: 100%;
	}
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
	}
	.header view.tit{
		width: 22%;
		font-weight: 500;
	}	
	input{
		min-width: 500rpx;
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
	.img{
		width: 120rpx;height:120rpx;
		margin:10rpx;
	}
	.textarea textarea{
		color:#868686;
		height:90rpx;
		line-height: 90rpx;
	}
	.textarea .tit{
		line-height: 60rpx;
	}
	.itemName,
	.sonName,
	.checkDate,
	.checkPeople{
		color:#868686;
	}
</style>
