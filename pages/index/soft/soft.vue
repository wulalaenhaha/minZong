<template>
	<!-- 平安创建 -->
	<view class="soft">	
		<view class="model" v-if="isShow">       <!-- 模态框 -->
			<view class="con">
				<view class="tit">{{title}}</view>
				<view class="co">
					<view class="n" @tap="quxiao">取消</view>
					<view class="y" @tap="confirmY">确定</view>
				</view>
			</view>
		</view>
		<!-- 信息上报工作 -->
		<view class="information">
			<view class="title">
				<view class="left">
					<view class="line"></view>
					<view class="">信息上报工作</view>
				</view>
				<view class="img_box">					
					<view class="img_box_add" @tap="reportInfo">
						<image src="../../../static/index/add.png" mode=""></image>
					</view>
				</view>
			</view>
			<!-- 非法宗教活动列表 -->
			<view class="illegal_active">
				<view class="illegal_active_item" v-for="(item,index) in dataObj" :key="index" >
					<view class="item_left" @tap="open(item.ID)">
						<view>{{item.AddTime}}</view>
						<view style="color: #FD6363;">未上报</view>
					</view>
					<view class="item_right" @tap="open(item.ID)">
						<view class="txt_name">事件类型：{{item.EventCategory}}</view>
						<view>{{item.InformPlace}}</view>
					</view>
					<view @tap="delItem(item.ID)" class="del" >
						删除
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {				
				moreInfo:[
					{
						set:'未上报',
						type:'非法宗教活动',
						location:'邯郸市'
					},
					{
						set:'未上报',
						type:'非法宗教职教人员',
						location:'衡水市'
					}
				],
				dataObj:[],
				showMask:true,
				id:'',             //点击删除  返回的ID
				isShow:false,
				title:''
			}
		},
		methods:{
			quxiao(){
				this.isShow=false;
			},
			confirmY(){
				this.isShow=false;
				if(this.id!=''){
					uni.request({
						url:getApp().globalData.api+ '/Report/DelReport',
						data:{
							Account:getApp().globalData.userName,
							Password:getApp().globalData.userPwd,
							ID:this.id
						},
						success(res) {
							// console.log(res.data)
							if(res.data.code==0){
								console.log('成功')
								uni.redirectTo({
									url: '../soft/soft'
								});										
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
			getDate(e){
				var b=e.slice(6,e.length-2);
				var date=new Date(parseInt(b));				
				let year = date.getFullYear();
				let month = (date.getMonth()+1)>9?(date.getMonth()+1):'0'+(date.getMonth()+1);
				let day = date.getDate()>9?date.getDate():'0'+date.getDate();   
				let hours=date.getHours()>9?date.getHours():'0'+date.getHours(),mins=date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes();
				return year+'-'+month+'-'+day+' '+hours+':'+mins
			},
			reportInfo(e){
				uni.navigateTo({
					url: './reportInfo/reportInfo?ID=-1',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},			
			open(id){	
				console.log(id)      //id是信息ID
				uni.navigateTo({
					url:'./reportInfo/reportInfo?ID='+id+'&Status=2'
				})
			},
			delItem(id){             //根据id删除项目   调用模态框
				this.isShow=true;
				this.title='确认删除这个上报工作吗？';
				this.id=id;
			},
			getData(status){   //方法  拉去数据，显示在页面中
				var _this=this;
				uni.request({
					url:getApp().globalData.api+ '/Report/ReportList',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
						PageNum:0,
						PageSize:100,
						Status:status
					},
					success(res) {						
						if(res.data.code==0){
							console.log('成功')
							_this.dataObj=res.data.data;
							for (var i = 0; i < res.data.data.length; i++) {
								_this.dataObj[i].AddTime=_this.getDate(res.data.data[i].AddTime)
							}
						}else if(res.data.code==1){									
							_this.isShow=true;
							_this.title='您没有未上报的数据！';
							console.log('失败1')
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
		created(){     //初始化，拉去数据，显示在页面中
			this.getData(2);
		},
		onLoad:function(option){      //更新内容接口
		},
		onBackPress() {         //左上角的返回按钮，直接返回首页
			if (this.showMask) {				
				uni.switchTab({
					url:'../index'
				})
				return true;
			} else {
				return true;
			}
		}
	}
</script>

<style scoped lang="scss">
	page {
		font-size: 30rpx;
		background-color: #F5F5F5;
	}

	.title {
		width: 100%;
		height: 90rpx;
		display: flex;
		align-items: center;
		color: #000000;
		font-weight: 700;
		padding: 0 30rpx;
		box-sizing: border-box;
		border-bottom: 2rpx solid #F5F5F5;

		.line {
			width: 8rpx;
			height: 30rpx;
			background-color: #487DE5;
			margin-right: 10rpx;
		}
	}

	.place_list {
		width: 100%;
		color: #848484;
		background-color: #FFFFFF;

		.place_item {
			width: 100%;
			height: 180rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2rpx solid #F5F5F5;

			.place_item_left {
				width: 80%;
				display: flex;

				image {
					width: 120rpx;
					height: 120rpx;
					background-color: #C0C0C0;
					margin-right: 20rpx;
				}

				.project {
					font-size: 24rpx;

					text {
						margin: 0 10rpx;
					}

					text:first-child {
						color: #6492EB;
					}

					text:nth-child(2) {
						color: #67CB8B;
					}

					text:nth-child(3) {
						color: #E57474;
					}
				}
			}

			.font {
				text {
					font-size: 60rpx;
					color: #487DE5;
				}
			}

		}
	}

	.more {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
	}
	.txt_name {
		font-size: 30rpx;
		font-weight: 700;
		color: #000000;
	}
	.information {
		width: 100%;
		margin-top: 20rpx;
		background-color: #FFFFFF;

		.title {
			justify-content: space-between;

			.left {
				width: 50%;
				height: 100%;
				display: flex;
				align-items: center;
			}

			.img_box {
				width: 50%;
				height: 100%;
				float: right;
				display: flex;
				align-items: center;
				flex-direction: row-reverse;
				.img_box_add,
				.img_box_site {
					width: 40rpx;
					height: 40rpx;
					margin-left: 20rpx;
					image {
						width: 100%;
						height: 100%;
					}
				} 
			}
		}
		.illegal_active{
			width: 100%;
			font-size: 24rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;
			.illegal_active_item{
				width: 100%;height: 160rpx;
				padding: 20rpx 0;
				box-sizing: border-box;
				border-bottom: 2rpx solid #F5F5F5;
				color: #AAAAAA;
				display: flex;
				justify-content: space-between;
				.item_left{
					width: 170rpx;
					text-align: center;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					border-right: 2rpx solid #F5F5F5;
				}
				.item_right{
					margin-left: 20rpx;
					width: 400rpx;
					text-align: left;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
				}
			}
		}
	}
	.del{
		cursor:pointer;
		color:#2352ff;width: 60rpx;
		height:auto;
		text-align: right;
		position: relative;
		z-index: 10;
	}
	// 模态框  样式
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
		height:180rpx;
		line-height: 120rpx;		
	}
	.model .con .co{
		display: flex;
		line-height: 100rpx;
		border-top: solid 1rpx #eee;
	}
	.model .con .co view{
		width: 49.9%;
	}
	.model .con .co .n{
		border-right:solid 1rpx #eee;
	}
	.model .con .co .y{
		color:#3385ff;
	}
</style>
