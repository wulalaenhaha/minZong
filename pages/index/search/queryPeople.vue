<template>
	<!-- 教职人员查询 --> 
	<view class="place_select">
		<!-- 所属村 -->
		<!-- <view class="chooseRegion"> -->
			<!-- <view class="tit">所属街道</view> -->
			<!-- 所 属 村 -->
			<!-- <view class="chooseCity">
				<xfl-select
					class="xflselect"
					:list="list"
					:clearable="false"
					:showItemNum="5" 
					:listShow="false"				
					:initValue="'选择村'"
					:selectHideType="'hideAll'"
					@change="change"
				>				
				</xfl-select> 
			</view>
			<input type="text" v-model="carId" placeholder="请输入人员身份证号" />
			<button class="ss" type="primary" @tap="searchP">搜 索</button>
		</view>		 -->
		<!-- 所 属 区 -->
		<view class="chooseCity">
			<xfl-select
				class="xflselect"
				refs="xflselect"
				:list="list"
				:clearable="false"
				:showItemNum="5" 
				:listShow="false"				
				:initValue="'选择村'"
				:selectHideType="'hideAll'"
				@change="change"
			>				
			</xfl-select> 
			<input type="text" v-model="carId" placeholder="请输入身份证号" placeholder-style="color:#999;" />
			<text class="searchText" @tap="search()">搜索</text>
		</view>	
		
		<!-- 模态框 -->
		<view class="model" v-if="isShow">   
			<view class="con">
				<view class="tit">{{title}}</view>
				<view class="co">
					<view class="y" @tap="confirmY">确定</view>
				</view>
			</view>
		</view>
		
		<!-- 查询结果 -->
		<view class="my_info_list">
			<view class="my_info_item" @tap="getDetails(item.ID)" v-for="(item,index) in my_info_list" :key="index">
				<view class="img_box">{{item.Name}}</view>
				<view class="my_info">
					<view class="">{{item.Religcategory}}</view>
					<view class="box">
						<image src="../../../static/mine/jiantou.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<!-- 当 村镇内没有信教群众时，显示 -->
			<view class="meiyou" v-if="my_info_list.length==0?true:false">
				当前村镇内无信教群众
			</view>
		</view>
		
	</view>
</template>

<script>
	import xflSelect from '../../../components/xfl-select.vue';     //导入下拉列表插件
	export default {
		data() {
			return {				
				carId:'',           //  填写的 身份证号
				cunID:0,           //  村  ID
				quId:'',            //  乡镇ID
				list:[              //  街道
					{value:'选择村',cunID:0,DicCode:0},
				],
				// chushi:[],
				my_info_list: [],      // 人员列表  内容
				title:'',              // 模态框组件  显示内容
				isShow:false,          // 模态框组件  初始化状态
				PageNum:0,             //页码
				PageSize:14,           //每页的数量
				hasMoreData:true,      //是否有更多数据
			}					
		},
		components:{
			xflSelect
		}, 
		methods:{
			getPeoples(id,CardId){                //id  为村  ID
			console.log(this.PageNum,'page')
			console.log(this.quId,'quId')
			console.log(id,'id')
			console.log(CardId,'CardId')
				var _this=this;
				uni.request({                 //获取村里信教群众名单-以下
					url:getApp().globalData.api+ '/ReligMasses/GetReligMassesList',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
						VillageId:id,      //  村 ID
						IDCard:CardId,
						QuId:this.quId,           //乡镇  ID
						PageNum:this.PageNum,
						PageSize:15
					},
					success(res) { 
						console.log(res)
						_this.my_info_list=[]
						if(res.data.code==0){							
							var num=0;
							res.data.data.forEach(element => {
								_this.my_info_list.push(element);
								num++;
							});
							_this.PageNum++;
							if(num<_this.PageSize){			
								_this.hasMoreData=false;
								console.log('状态=',_this.hasMoreData)
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
			search(){            //搜索按钮
				//如果搜索有数据则显示数据   否则  显示模态框。
				console.log('11111')
				this.PageNum=0
				console.log(this.cunID,this.carId)
				this.getPeoples(this.cunID,this.carId)
			},
			change({newVal, oldVal, index, orignItem}){  //得到所选的数据
				// console.log(orignItem)
				this.cunID=orignItem.cunID;       //得到 村 关键字ID
				this.PageNum=0;
				this.getPeoples(orignItem.cunID,this.carId);				
				this.carId='';
			},
			confirmY(){                //模态框  确定  按钮
				this.isShow=false;
			},			
			getDetails(id){          //点击进入   --人员明细
				// console.log(id)      //id 为人员ID
				//发送请求，如果成功则跳转。
				uni.navigateTo({
					url: 'qunzhong?id='+id
				})				
			}
		},		
		mounted(){			
			this.quId=getApp().globalData.quId;
			// console.log(this.quId)
			var _this=this;
			uni.request({                 //获取街道数据-以下
				url:getApp().globalData.api+ '/ReligMasses/GetVillageList',
				data:{					
					Account:getApp().globalData.userName,
					Password:getApp().globalData.userPwd,					
					quId:this.quId      //  乡镇 ID：1
				},
				success(res) { 
					// console.log('街道数据=',res.data)
					if(res.data.code==0){
						for (var i = 0; i < res.data.data.length; i++) {
							var obj={};
							obj.value=res.data.data[i].DisName;
							obj.cunID=res.data.data[i].ID;
							obj.DicCode=res.data.data[i].DicCode;
							_this.list.push(obj);
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
			});
			// 初始化  获取整个镇的信教群众名单
			this.getPeoples(0,0);
		},
		// 上拉加载
		onReachBottom: function () {
			// console.log('上拉加载')
			if (this.hasMoreData) {
			  if(this.carId=='' || this.cardId==0){
				  this.getPeoples(this.cunID,0)
			  }else if(this.carId!=''){
				  this.getPeoples(this.cunID,this.carId)
			  };
			} else {
			  wx.showToast({
				title: '没有更多数据',
			  })
			}
		}
	}
</script>

<style  lang="scss">
	.chooseCity,
	.chooseRegion{
		background-color: #fff;
		padding: 6rpx 30rpx;
		display: flex;
		justify-content:flex-start;
		align-items: center;
		line-height: 40rpx;
	}
	.tit{
		width: 220rpx;
	}
	.xflselect{
		width: 200rpx;
		max-width: 240rpx;
		border:0;
		padding: 0;
		margin-right: 20rpx;
	}
	input{
		border-bottom: solid 1rpx #ccc;
		padding: 10rpx 10rpx;
	}
	.searchText{
		color:#487DE5;
		width:90rpx;height:70rpx;
		line-height: 70rpx;
		text-align: center;
		/* padding: 0 10rpx; */
	}
	.place_list {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
		color: #848484;
		background-color: #FFFFFF;
	
		.place_item {
			width: 100%;
			height: 180rpx;
			padding: 25rpx 0;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			font-size: 24rpx;
			border-bottom: 2rpx solid #F5F5F5;
	
			.place_item_left {
				width: 23%;
				height: 100%;
				display: flex;
				align-items: center;
	
				image {
					width: 120rpx;
					height: 120rpx;
					background-color: #C0C0C0;
				}
			}
	
			.place_item_right {
				width: 87%;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
	
				.txt_name {
					font-size: 30rpx;
					font-weight: 700;
					color: #000000;
				}
	
				.time {
					display: flex;
					justify-content: space-between;
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
	/* 查询结果   人员列表样式 */
	.my_info_list{
		width: 100%;
		margin-top: 20rpx;
		background-color: #FFFFFF;
		padding: 0 30rpx;
		font-size: 30rpx;
		color: #262626;
		box-sizing: border-box;
		.my_info_item{
			width: 100%;height: 120rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 2rpx solid #F5F5F5;
			.img_box{
				width: 160rpx;height: 40rpx;
				margin-right: 16rpx;
			}
			.my_info{
				width: 600rpx;
				display: flex;
				color:#999;
				justify-content: space-between;
				align-items: center;
				.box{
					width: 18rpx;height: 30rpx;
					image{
						width: 80%;height: 80%;
					}
				}
			}
		}
	}
	.logout{
		width:100%;height:80rpx;
		line-height: 80rpx;
		text-align: center;
		position: absolute;
		bottom: 80rpx;
		color:#ff5857;
		border-radius: 6rpx;
		background-color: #fff;
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
	// 当村内或者镇内没有信教群众时，显示
	.meiyou{
		text-align: center;
		line-height: 200rpx;
		font-size: 28rpx;
		color:#999999;
	}

</style>

