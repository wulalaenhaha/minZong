<template>
	<!-- 消息列表 -->
	<view class="info">
		<!-- 滑动门 -->
		<view class="door">
			<view class="doorTitle">
				<view class="processed" :class="{borderColor:tag===1}" @tap="processed">宗教委员</view>
				<view class="untreated" :class="{borderColor:tag===0}" @tap="untreated">场所列表</view>
			</view>
		</view>
		<view class="doorList">
			<!-- 宗教委员 -->
			<block>   
				<view class="doorList_item" v-for="(item,index) in processedData" :key="index" v-if="tag==1">
					<view class="left">
						<view class="type">{{item.DisName}}</view>
						<view class="type">{{item.Name}}</view>					
					</view>
					<view class="type_active" @tap="video1(item.quId)">视频</view>
				</view>
			</block>
			<!-- 场所负责人 -->
			<block>
				<view class="doorList_item" v-for="(item,index) in untreatedData" :key="index" v-if="tag==0">
					<view class="left">
						<view class="type">{{item.ReligName}}</view>
						<view class="type">{{item.Street}}</view>					
					</view>
					<view class="type_active" @tap="video2(item.ID)">视频</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tag: 0,      //初始化，显示场所负责人信息列表
				processedData:[],            //宗教委员
				untreatedData:[],            //场所负责人
				pageSize:11,          //每页的数量
				isShow:true, 
				status:0,            //0-场所负责人       1-宗教委员
			}
		},
		methods:{			
			processed(){                  //点击宗教委员-
				this.tag=1;
				this.getData1();
			},
			untreated(){                  //点击场所负责人
				this.tag=0;
				this.getData();
			},
			// 宗教委员
			video1(quId){
				uni.navigateTo({
					url:'./video1?quId='+quId
				})
			},
			// 场所
			video2(StreetID){
				uni.navigateTo({
					url:'./video2?StreetID='+StreetID
				})
			},
			getData(){                 // 0-场所负责人
				var _this=this;
				uni.request({
					url:getApp().globalData.api+ '/Login/GetReligiousList',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
					},
					success(res) {
						console.log(res.data)	
						if(res.data.code==0){
							res.data.data.forEach(element => {
								_this.untreatedData.push(element);
							});			
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
			getData1(){                // 1-宗教委员
				var _this=this;
				uni.request({
					url:getApp().globalData.api+ '/Login/GetUserList',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
					},
					success(res) {
						console.log(res.data)	
						if(res.data.code==0){
							res.data.data.forEach(element => {
								_this.processedData.push(element);
							});							
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
			}
		},
		mounted(){     //初始化，拉去数据，显示在页面中
			this.getData();
		},
		onBackPress() {
			uni.switchTab({
				url:'../index'
			})
			return true;
		}
		// onPullDownRefresh() {        //下拉刷新
		// 	console.log('refresh');
		// 	this.getData();
		// 	setTimeout(function () {
		// 		uni.stopPullDownRefresh();
		// 	}, 1000);
		// },
		// 上拉加载 
		// onReachBottom: function () {
		// 	if(this.tag==0){
		// 		if (this.hasMoreData) {
		// 		  this.getData();
		// 		} else {
		// 		  wx.showToast({
		// 		    title: '没有更多数据',
		// 		  })
		// 		}
		// 	};
		// 	if(this.tag==1){
		// 		if (this.hasMoreData1) {
		// 		  this.getData1();
		// 		} else {
		// 		  wx.showToast({
		// 		    title: '没有更多数据',
		// 		  })
		// 		}
		// 	}		  
		// }
	}
</script>

<style scoped lang="scss">
	page {
		background-color: #f5f5f5;
	}
	.borderColor{
		padding: 19rpx 0;
		color: #487DE5;
		border-bottom: 2rpx solid #487DE5;
	}
	.door {
		width: 100%;
		height: 90rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;

		.doorTitle {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: space-around;
			color: #868686;
			font-size: 36rpx;
		}
	}

	.doorList {
		width: 100%;
		font-size: 30rpx;
		background-color: #FFFFFF;

		.doorList_item {
			width: 100%;
			// height: 125rpx;
			display: flex;
			justify-content: space-between;
			padding: 20rpx 30rpx;
			box-sizing: border-box;
			border-top: 2rpx solid #f5f5f5;
			.left .type:nth-child(2){
				color: #868686;
			}
			.type_active{
				// width: ;
				height: 60rpx;
				line-height: 40rpx;
				padding: 10rpx 20rpx;
				border-radius: 30rpx;
				background-color: #3385FF;
				color: #FFFFFF;
			}
		}
	}
</style>
