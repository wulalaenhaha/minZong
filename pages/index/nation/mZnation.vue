<template>
	<!-- 民宗局查询少数民族 --> 
	<view class="place_select">
		
		<view class="chooseCity">
			
			<view class="select" @click="select()">
				<view class="s-con">{{Select}}</view>
				<view class="box">
					<image src="../../../static/mine/jiantou_down.png" mode="aspectFill"></image>
				</view>
			</view> 
			<xfl-select
				class="xflselect"
				:list="peopleType"
				:clearable="false"
				:showItemNum="5" 
				:listShow="false"				
				:initValue="'人员类型'"
				:selectHideType="'hideAll'"
				@change="change1"
			>				
			</xfl-select>
			<view class="search-input">
				<input type="text" v-model="name" placeholder="请输入姓名" placeholder-style="color:#999;" />
				<view class="searchText" @tap="search()">搜索</view>
			</view>
		</view>	
		<view class="list-model" v-if="isDisplay==true" @tap="hidden()">
			<view class="list-model-content">
				<view  class="list">
					<view class="left">
						<view class="left-con" >
							<view class="item" v-for="(item,index) in zhen" :key="index" @click.stop="select_zhen(item.zhenID)">{{item.value}}</view>
						</view>
					</view>
					<view class="right" v-if="isCun==true">
						<view class="right-con">
							<view class="item" v-for="(item,index) in cun" :key="index" @click.stop="select_cun(item.cunID)">{{item.value}}</view>
						</view>
					</view>
				</view>
			</view>
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
			<!-- <view class="time">
				<view class="left">2020年</view>
				<view class="right" @click="history">历史记录</view>
				<view class="Cdate" v-if="abc==true">
					<view @click.stop="one(1)" :class="[chooseNow==1?'co1':'']">{{q1}}</view>
					<view @click.stop="two(2)" :class="[chooseNow==2?'co1':'']">{{q2}}</view>
					<view @click.stop="three(3)" :class="[chooseNow==3?'co1':'']">{{q3}}</view>
				</view>
			</view> -->
			<view class="my_info_item" @tap="getDetails(item.ID)" v-for="(item,index) in my_info_list" :key="index">
				<view class="img_box">{{item.Name}}</view>
				<view class="my_info">
					<view class="">{{item.Nation}}</view>
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
				Select:'选择乡镇',
				name:'',
				zhenID:'',
				zhen:[],
				cunID:0,           //  村  ID
				cun:[],
				peopleType:[
					{value:'人员类型',code:''},
					{value:'世居人员',code:1},
					{value:'流动人员',code:2},
				],
				status:'',
				display:false,
				// carId:'',           //  填写的 身份证号
				quId:'',            //  乡镇ID
				my_info_list: [],      // 人员列表  内容
				title:'',              // 模态框组件  显示内容
				isShow:false,          // 模态框组件  初始化状态
				PageNum:0,             //页码
				PageSize:14,           //每页的数量
				hasMoreData:true,      //是否有更多数据
				isDisplay:false,		//下拉列表的展示与隐藏
				isCun:false,			//村的展示与隐藏
				abc:false,				//历史记录的显示
				year:''
				// isChecked:false,		//是否选中
			}					
		},
		components:{
			xflSelect
		}, 
		methods:{
			change1({newVal, oldVal, index, orignItem}){  //得到所选的数据     区
				this.status=orignItem.DicCode;       //得到区关键字ID
				if(this.cunID==0){
					console.log(this.cunID)
					this.getPeoples(0,0,this.status)
				}else{
					console.log(this.cunID)
					this.getPeoples(this.cunID,0,this.status)
				}
			},
			getDate(){
				let nowDate = new Date();
				let year=nowDate.getFullYear()
				this.year=year
			},
			// 展示乡镇
			select(){
				console.log(getApp().globalData.ParentID)
				if(this.isDisplay){
					this.isDisplay=false;
				}else{
					this.isDisplay=true;
				}
				var _this=this
				uni.request({                 //获取乡镇数据-以下
					url:getApp().globalData.api+ '/Districts/DistrictsList',
					data:{					
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,	
						ParentID:1
						// quId:_this.quId      //  乡镇 ID：1
					},
					success(res) { 
						console.log('乡镇数据=',res.data)
						if(res.data.code==0){
							_this.zhen=[]
							for (var i = 0; i < res.data.data.length; i++) {
								var obj={value:'',zhenID:0,DicCode:0};
								obj.value=res.data.data[i].DisName;
								obj.zhenID=res.data.data[i].ID;
								obj.DicCode=res.data.data[i].DicCode;
								_this.zhen.push(obj);
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
			},
			
			// 展示某个乡镇对应的村
			select_zhen(zhenID){
				this.isCun=true;
				this.quId=zhenID
				console.log(this.quId)
				// this.zhenID=zhenID
				// console.log(zhenID)
				var _this=this
				uni.request({                 //获取村数据-以下
					url:getApp().globalData.api+ '/ReligMasses/GetVillageList',
					data:{					
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
						// quId:zhenID      	//  乡镇 ID：1
						quId:this.quId      	//  乡镇 ID：1
					},
					success(res) { 
						
						// console.log('村数据=',res.data)
						if(res.data.code==0){
							_this.cun=[]
							for (var i = 0; i < res.data.data.length; i++) {
								var obj={value:'',cunID:0,DicCode:0};
								obj.value=res.data.data[i].DisName;
								obj.cunID=res.data.data[i].ID;
								obj.DicCode=res.data.data[i].DicCode;
								_this.cun.push(obj);
							}
							console.log('成功')
						}else if(res.data.code==1){
							console.log('失败')
						}else if(res.data.code==-1){
							console.log('用户名或密码错误')
						}
						// _this.cun.push()
					},
					fail(res) {
						console.log(res)
					}
				});
				
			},
			
			// 点击某个村，改变相应的值，并查询该村的信教群众
			select_cun(cunID){
				this.cunID=cunID
				this.isDisplay=false;
				this.isCun=false;
				var _this=this;
				console.log(this.quId)
			 
				// 选择某村赋值
				uni.request({
					url:getApp().globalData.api+ '/ReligMasses/GetVillageList',
					data:{					
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,					
						quId:cunID      	
					},
					success(res) {
						for(var i=0;i<_this.cun.length;i++){
							if(cunID == _this.cun[i].cunID){
								_this.Select=_this.cun[i].value  
							}
						}
					},
					fail(res) {
						
					}
				})
				 
											 
				console.log(cunID,this.quId)
				this.getPeoples(cunID,0,this.status)
			},
			
			getPeoples(id,name,status){     
				//id  为村  ID
				console.log(name,this.quId)
				var _this=this;
				uni.request({                 //获取村里信教群众名单-以下
					url:getApp().globalData.api+ '/Nation/GetNationList',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
						QuId:this.quId,           //乡镇  ID
						VillageId:id,      //  村 ID
						Year:this.year,
						Name:name,
						Type:status,
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
				console.log(this.PageNum)
				this.PageNum=0
				console.log(this.cunID)
				if(this.cunID==0){
					this.getPeoples(0,this.name,this.status)
				}else{
					this.getPeoples(this.cunID,this.name,this.status)
				}
			},
			
			confirmY(){                //模态框  确定  按钮
				this.isShow=false;
			},			
			getDetails(id){          //点击进入   --人员明细
				// console.log(id)      //id 为人员ID
				//发送请求，如果成功则跳转。
				uni.navigateTo({
					url: 'nationInfo?id='+id
				})				
			},
			// list模态框
			hidden(){
				this.isDisplay=false
			}
		},		
		mounted(){			
			// this.quId=getApp().globalData.quId;
			// console.log(this.quId)
			// 初始化  获取整个丰南镇的信教群众名单
			this.getPeoples(0,0,this.status);
		},
		// 上拉加载
		onReachBottom: function () {
			// console.log('上拉加载')
			if (this.hasMoreData) {
			  if(this.name=='' || this.name==0){
				  this.getPeoples(this.cunID,0,this.status)
			  }else if(this.name!=''){
				  this.getPeoples(this.cunID,this.name,this.status)
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
	//时间日期显示
	.time{
		margin-top: 16rpx;
		width: 100%;
		line-height: 50rpx;
		padding:10rpx 30rpx;
		box-sizing: border-box;
		color:#000;
		font-size: 32rpx;
		border-bottom: solid 1rpx #eee;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		
			position: relative;
		.Cdate{
			width: 160rpx;
			position: absolute;
			right: 10rpx;
			top:70rpx;
			box-shadow: 0px 0px 1px 1px #999;
			z-index: 10000;
			color: #999;
			background-color: #fff;
			text-align: center;
			border-radius: 6rpx;
		}
		.Cdate view{
			width: 160rpx;
			line-height: 60rpx;
			border-bottom: solid 1rpx #ccc;
		}
	}
	.chooseCity{
		background-color: #fff;
		padding: 6rpx 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		line-height: 40rpx;
		
		.xflselect{
			width: 150rpx;
		}
		.search-input{
			width: 40%;
			margin: 0 20rpx;
			display: flex;
		}
		.search-input input{
			width: 200rpx;
			border-bottom: solid 1rpx #ccc;
			padding: 10rpx 10rpx;
		}
	}
	.tit{
		width: 220rpx;
	}
	.select{
		width: 200rpx;
		max-width: 240rpx;
		border:0;
		padding: 0;
		margin-right: 20rpx;
		display: flex;
		// position: relative;
		.s-con{
			width: 160rpx;
			color:#ccc;
		}
		.box{
			width: 40rpx;height: 20rpx;
			// margin-top: 10rpx;
			image{
				width: 80%;height: 80%;
			}
		}
	}
	.list{
		width: 600rpx;
		height: 600rpx;
		// background-color: #C0C0C0;
		position: absolute;
		left: 0;
		top: 0rpx;
		display: flex;
		.left, .right{
			height: 600rpx;
			overflow-y: auto;
			text-align: center;
			background-color: #FFFFFF;
			opacity: 0.9;
		}
		.left{
			width: 280rpx;
		}
		.right{
			width: 320rpx;
			padding: 0 10rpx;
			border-left: 1rpx solid #CCCCCC;
		}
		.item{
			padding: 0 10rpx;
			height: 60rpx;
			line-height: 60rpx;
		}
		.active{
			background-color: #F1F1F1;
		}
	}
	input{
		border-bottom: solid 1rpx #ccc;
		padding: 10rpx 10rpx;
	}
	// lis模态框
	.list-model{
		position: absolute;
		top:80rpx;left:0;
		z-index: 10;
		width: 100%;height: 94%;
		background-color: rgba(0,0,0,0.4);
		.list-model-content{
			width: 100%;
			height: 100%;
			position: relative;
		}
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

