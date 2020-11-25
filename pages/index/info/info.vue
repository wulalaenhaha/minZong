<template>
	<!-- 消息列表 -->
	<view class="info">
		<!-- 滑动门 -->
		<view class="door">
			<view class="doorTitle">
				<view class="processed" :class="{borderColor:tag===1}" @tap="processed">已处理</view>
				<view class="untreated" :class="{borderColor:tag===0}" @tap="untreated">未处理</view>
			</view>
		</view>
		<view class="doorList">
			<block v-for="(item,index) in untreatedData" :key="index" >
				<view class="doorList_item" v-if="tag===item.Status" @tap="open(item.Status,item.ID)">
					<view class="type">未处理事件</view>					
					<view class="right">
						<view class="type_active">{{item.EventCategory}}</view>
						<view>{{item.InformTime}}</view>
					</view>
				</view>
			</block>
			<block v-for="(item,index) in processedData" :key="index" >
				<view class="doorList_item" v-if="tag===item.Status" @tap="open(item.Status,item.ID)">	
							<!-- v-show="tag===item.Status" -->
					<view class="type">已处理事件</view>
					<view class="right">
						<view class="type_active">{{item.EventCategory}}</view>
						<view>{{item.InformTime}}</view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tag: 0,      //初始化，显示未处理信息列表
				processedData:[],            //已处理
				untreatedData:[],            //未处理
				pageSize:11,          //每页的数量
				isShow:true, 
				pageNum:0,           //未处理的页码
				pageNum1:0,           //已处理的页码
				status:0,            //0-未处理       1-已处理
				hasMoreData:true,    //是否有更多数据 
				hasMoreData1:true
			}
		},
		methods:{			
			processed(){                  //点击已处理-
				this.tag=1;
				this.getData1();
			},
			untreated(){                  //点击未处理
				this.tag=0;
				this.getData();
			},
			open(e,id){					
				if(e===0){                //点击未处理--详情
					uni.navigateTo({
						url:'disposeInfo?ID='+id
					})
				}else if(e===1){         //点击已处理--详情
					uni.navigateTo({        
						url:'./hege?ID='+id 
					})
				}
			},
			getData(){                 // 0-未处理
				var _this=this;
				uni.request({
					url:getApp().globalData.api+ '/Report/ReportList',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
						PageNum:_this.pageNum,
						Status:_this.tag,
						PageSize:_this.pageSize
					},
					success(res) {
						if(res.data.code==0){
							// console.log(res.data)							 
							var num=0;
							res.data.data.forEach(element => {
								var x=element.InformTime;
								var b=x.slice(6,x.length-2);
								var day=new Date(parseInt(b));
								var date=day.getFullYear()+"-"+(day.getMonth()+1)+"-"+day.getDate();
								element.InformTime=date;
								_this.untreatedData.push(element);
								num++;
							});
							_this.pageNum++;
							if(num<_this.pageSize){					
								_this.hasMoreData=false;
							}							
							console.log('成功')
						}else if(res.data.code==1){
							this.hasMoreData=false;
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
			getData1(){                // 1-已处理
				var _this=this;
				uni.request({
					url:getApp().globalData.api+ '/Report/ReportList',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
						PageNum:_this.pageNum1,
						Status:_this.tag,
						PageSize:_this.pageSize
					},
					success(res) {
						if(res.data.code==0){
							// console.log(res.data)								
							var num=0;
							res.data.data.forEach(element => {
								var x=element.InformTime;
								var b=x.slice(6,x.length-2);
								var day=new Date(parseInt(b));
								var date=day.getFullYear()+"-"+(day.getMonth()+1)+"-"+day.getDate();
								element.InformTime=date;
								_this.processedData.push(element);
								num++;
							});
							_this.pageNum1++;
							if(num<_this.pageSize){					
								_this.hasMoreData1=false;
							}							
							console.log('成功')
						}else if(res.data.code==1){
							this.hasMoreData=false;
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
		onLoad: function (options) {
			setTimeout(function () {
				console.log('start pulldown');
			}, 1000);
			uni.startPullDownRefresh();
		},
		onPullDownRefresh() {        //下拉刷新
			console.log('refresh');
			this.getData();
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		// 上拉加载 
		onReachBottom: function () {
			if(this.tag==0){
				if (this.hasMoreData) {
				  this.getData();
				} else {
				  wx.showToast({
				    title: '没有更多数据',
				  })
				}
			};
			if(this.tag==1){
				if (this.hasMoreData1) {
				  this.getData1();
				} else {
				  wx.showToast({
				    title: '没有更多数据',
				  })
				}
			}		  
		}
	}
</script>

<style scoped lang="scss">
	page {
		background-color: #f5f5f5;
	}
	.derlog{
		text-align: center;
		color:#868686;
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
			height: 125rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 20rpx 30rpx;
			box-sizing: border-box;
			border-top: 2rpx solid #f5f5f5;

			.right {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 24rpx;

				.type_active {
					color: #868686;
				}
			}
		}
	}
	.num{
		width: 100%;height:60rpx;
		line-height: 60rpx;
		text-align: center;
		position: absolute;
		bottom:20rpx;
	}
	.num text{
		display: inline-block;
		width: 100rpx;
		background-color: #6398FF;
		border-radius: 12rpx;
		font-size: 25rpx;
		margin: 0 20rpx;
		color:#fff;
	}
	.style1{
		color:#f00 !important;
	}
</style>
