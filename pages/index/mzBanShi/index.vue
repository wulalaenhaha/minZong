<template>
	<!-- 消息列表 -->
	<view class="info">
		<!-- 滑动门 -->
		<view class="door">
			<view class="doorTitle">
				<view class="processed" :class="{borderColor:tag===0}" @tap="processed">未处理</view>
				<view class="untreated" :class="{borderColor:tag===1}" @tap="untreated">已处理</view>
			</view>
		</view>
		<view class="doorList">
			<block>
				<view class="doorList_item"  v-for="(item,index) in untreatedData" :key="index" v-if="tag===0" @tap="open(tag,item.ID)">
					<view class="left">
						<view class="type">{{item.sTitle}}</view>	
						<view>{{item.AddTime}}</view>
					</view>
					<view class="right" style="color: #FF4D4D;">未处理</view>
				</view>
				<view class="doorList_item" v-for="(item,index) in processedData" :key="index" v-if="tag===1" @tap="open(tag,item.ID)">
					<view class="left">
						<view class="type">{{item.sTitle}}</view>	
						<view>{{item.DealTime}}</view>
					</view>
					<view class="right" style="color: #03C179;">已处理</view>
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
				code:'',					//用户类型
				userID:'',					//用户ID
				isShow:true, 
				pageNum:0,           //未处理的页码
				pageNum1:0,           //已处理的页码
				status:0,            //0-未处理       1-已处理
				pageSize:11,          //每页的数量
				hasMoreData:true,    //是否有更多数据 
				hasMoreData1:true
			}
		},
		methods:{			
			processed(){                  //点击已处理-
				this.tag=0;
				this.getData();
			},
			untreated(){                  //点击未处理
				this.tag=1;
				this.getData();
			},
			open(tag,id){					
				if(tag===0){                //点击未处理--详情
					if(this.code!=1){
						uni.navigateTo({
							url:'./NoInfo?ID='+id+'&status='+tag    //不是民总局的人时，只查看处理详情
						})
					}else{
						uni.navigateTo({
							url:'./deal?ID='+id+'&status='+tag     //民宗局，去处理
						})
					}
				}else if(tag===1){         //点击已处理--详情
					uni.navigateTo({        
						url:'./NoInfo?ID='+id+'&status='+tag
					})
				}
			},
			// this.userID=getApp().globalData.userID
			getData(){  
				// this.userID=getApp().globalData.userID
				console.log('userid',this.userID)
				var _this=this;
				if(this.tag==0){
					this.pageNum=0
					uni.request({
						url:getApp().globalData.api+ '/OnlineWork/MessageList',
						data:{
							Account:getApp().globalData.userName,
							Password:getApp().globalData.userPwd,
							UserId:this.userID,
							Status:this.tag,
							PageNum:this.pageNum,
							PageSize:this.pageSize
						},
						success(res) {
							console.log(_this.tag)
							console.log(res.data)
							_this.untreatedData=[]
							if(res.data.code==0){
								var num=0;
									console.log(_this.tag)
									console.log('tag=0,未处理')
									res.data.data.forEach(element => {
										var x=element.AddTime;
										var b=x.slice(6,x.length-2);
										var day=new Date(parseInt(b));
										var date=day.getFullYear()+"-"+(day.getMonth()+1)+"-"+day.getDate();
										element.AddTime=date;
										
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
				}else{
					console.log(this.userID)
					this.pageNum=0
					uni.request({
						url:getApp().globalData.api+ '/OnlineWork/MessageList',
						data:{
							Account:getApp().globalData.userName,
							Password:getApp().globalData.userPwd,
							UserId:this.userID,
							Status:this.tag,
							PageNum:this.pageNum,
							PageSize:this.pageSize
						},
						success(res) {
							console.log(_this.tag)
							console.log(res.data)	
							_this.processedData=[]
							if(res.data.code==0){
									var num=0;
									console.log(_this.tag)
									console.log('tag=1,已处理')
									res.data.data.forEach(element => {
										var x=element.DealTime;
										var b=x.slice(6,x.length-2);
										var day=new Date(parseInt(b));
										var date=day.getFullYear()+"-"+(day.getMonth()+1)+"-"+day.getDate();
										element.DealTime=date;
										
										_this.processedData.push(element);
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
				}
			},
		},
		onShow() {
			this.code=getApp().globalData.code
			if(this.code!=1){
				this.userID=getApp().globalData.userID
				console.log('userid',this.userID)
				this.getData();
			}else{
				this.userID=0
				console.log(this.userID)
				this.getData();	
			}
		},
		onNavigationBarButtonTap(e) {
			if(e==0){
				uni.navigateTo({
					url:'../index'
				})
				
			}else{
				if(this.code!=1){
					uni.navigateTo({
						url:'./add'
					})
				}
			}
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
			height: 125rpx;
			display: flex;
			justify-content: space-between;
			padding: 20rpx 30rpx;
			box-sizing: border-box;
			border-top: 2rpx solid #f5f5f5;
			.left{
				width: 80%;
			}
			.right {
				line-height: 100rpx;
				align-items: center;
				font-size: 30rpx;
			}
		}
	}
</style>
