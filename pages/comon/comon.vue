<template>
	<view class="comon">
		<!-- 模态框 -->
		<view class="model" v-if="isShow">   
			<view class="con">
				<view class="tit">您还没有登录，请先登录！</view>
				<view class="co">
					<view class="y" @tap="confirmY">确定</view>
				</view>
			</view>
		</view>
		
		<!-- 头部 -->
		<view class="header">
			{{today}}
		</view>
		<view class="content">
			<block v-for="(item,index) in comonData" :key="index">
				<view class="con" @tap="getDetails(item.ID)">
					<view style="line-height: 60rpx;font-weight: bold;padding-left: 6rpx;">{{item.Title}}</view>
					<view class="con1" style="text-indent: 2em;font-size: 28rpx;line-height: 80rpx;">{{item.Content}}</view>
					<view style="text-align: right;color:#868686;font-size: 26rpx;">{{item.AddTime}}</view>
				</view>
			</block>			
		</view>
		<view style="text-align: center;color: #868686;font-size: 26rpx;line-height: 80rpx;" v-if="comonData.length==0">暂时没有公告消息哟</view>
	</view>
</template>

<script>
	
	export default {				
		data() {
			const date = new Date();
			   let year = date.getFullYear();
			   let month = (date.getMonth()+1)>9?(date.getMonth()+1):'0'+(date.getMonth()+1);
			   let day = date.getDate()>9?date.getDate():"0" + date.getDate();   
			   let hours=date.getHours()>9?date.getHours():'0'+date.getHours(),mins=date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes();
			   let second=date.getSeconds()>9?date.getSeconds():"0" + date.getSeconds();
			return {
				userID:1,
				isShow:false,      //模态框  显示与否
				comonData:[],
				today:year+'-'+month + '-' +day+' '+hours+":"+mins+":"+second 
			}
		},
		methods: {
			getDate(e){
				var b=e.slice(6,e.length-2);
				var day=new Date(parseInt(b));
				let month = (day.getMonth()+1)>9?(day.getMonth()+1):'0'+(day.getMonth()+1);
				let day1 = day.getDate()>9?day.getDate():"0" + day.getDate();
				var date=day.getFullYear()+"-"+month+"-"+day1;
				return date
			},
			getDetails(id){
				uni.navigateTo({
					url:'detail/index?ID='+id
				})
			},
			confirmY(){                //模态框  确定  按钮
				this.isShow=false;
				uni.navigateTo({
					url:'../index/login/login'
				}); 
			},	
		},
		onShow() {
			// if(!getApp().globalData.login){
			// 	//弹出框   提示登录
			// 	this.isShow=true;
			// 	this.usnerinfo.userName='用户名';
			// 	// this.usnerinfo.login=false;	
			// 	// this.usnerinfo.code=''; 
			// }else{
			// 	this.isShow=false;  
			// 	this.usnerinfo.userName=getApp().globalData.Name;
			// }
			if(!getApp().globalData.login){
				//弹出框   提示登录
				this.isShow=true;
			}else{
				this.isShow=false;
				var _this=this;
				var num=0;    //未读消息数量
				uni.request({
					url:getApp().globalData.api+ '/Message/GetMessageList',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
						ReceiveUserID:getApp().globalData.userID,
						// ReceiveUserID:1,
						Type:1,
						IsRead:'',          // 1已读 和 0未读  
						PageNum:0,           //当前显示页码数
						PageSize:10           //当前页消息个数
					},
					success(res) {
						console.log('公告栏')
						console.log(res.data)
						if(res.data.code==0){
							console.log('成功')
							_this.comonData=res.data.data;						
							for (var i = 0; i < _this.comonData.length; i++) {
								_this.comonData[i].AddTime=_this.getDate(_this.comonData[i].AddTime)
								if(_this.comonData[i].IsRead==0){
									num++;
								}
							}
							if(num==0){
								uni.removeTabBarBadge({
									index: 1
								})
							}
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
	}
</script>

<style>
	.header{
		width: 100%;heigt:60rpx;
		line-height: 60rpx;
		text-align: center;
		color:#868686;
		font-size: 14px;
	}
	.content{
		width: 100%;
		padding: 30rpx;
		font-size: 16px;
	}
	.con{
		width:100%;min-height:60rpx;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 10rpx;
		box-sizing: border-box;
		margin:16rpx 0;
	}
	.con1{
		white-space: nowrap;     
		overflow:hidden;     
		text-overflow: ellipsis;    
	}
	/*   模态框  样式 */
	.model{
		position: fixed;
		top:0;left:0;
		z-index: 10;
		width: 100%;height: 100%;
		background-color: rgba(0,0,0,0.4);
	}
	.model .con{
		height: 280rpx;width: 80%;
		position: absolute;
		top:50%;left:50%;
		margin-left: -40%;
		margin-top: -140rpx;
		border-radius: 8rpx;
		background-color: #fff;
		text-align: center;
		font-size: 36rpx;
	}
	.model .con .tit{
		height:180rpx;width: 100%;
		line-height:180rpx;		
	}
	.model .con .co{
		display: flex;
		line-height: 100rpx;
		border-top: solid 1rpx #eee;
	}
	.model .con .co view{
		width:100%;
	}
	.model .con .co .n{
		border-right:solid 1rpx #eee;
	}
	.model .con .co .y{
		color:#3385ff;
	}
</style> 