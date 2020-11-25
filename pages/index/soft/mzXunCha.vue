<template>
	<!-- 平安创建 -->
	<view class="soft" @tap="xiaoshi()">
		<view class="model" v-if="isShow">   <!-- 模态框 -->
			<view class="con">
				<view class="tit">{{title}}</view>
				<view class="co">
					<view class="n" @tap="quxiao">取消</view>
					<view class="y" @tap="confirmY">确定</view>
				</view>
			</view>
		</view>
		
		
		<!-- 寺庙展示列表 -->
		<view class="place_list" >
			<view class="chooseCity">
				<xfl-select style=" border-top: none !important;"
					class="xflselect"
					:list="list"
					:clearable="false"
					:showItemNum="5" 
					:listShow="false"				
					:initValue="'选择街道'"
					:selectHideType="'hideAll'"
					@change="change"
				>				
				</xfl-select>
				<input type="text" v-model="ReligName" placeholder="输入宗教名称" placeholder-style="color:#999;" />
				<text class="searchText" @tap="search(ReligName)">搜索</text>
			</view>	
			<view class="time">
				<view class="left">{{time}}</view>
				<view class="right" @click="history">历史记录</view>
				<!-- 历史记录中的日期选择 -->
				<!-- <view class="Cdate" :class="[abc==true?'show':'hide']"> -->
				<view class="Cdate" v-if="abc==true">
					<view @click.stop="one(1)" :class="[chooseNow==1?'co1':'']">{{q1}}</view>
					<view @click.stop="two(2)" :class="[chooseNow==2?'co1':'']">{{q2}}</view>
					<view @click.stop="three(3)" :class="[chooseNow==3?'co1':'']">{{q3}}</view>
				</view>
			</view>
			<view class="place_item" @tap="getDetails(item.ID,item.ReligName,item.Year,item.Month)" v-for="(item,index) in place_list" :key="index">
				<view class="place_item_left">
					<image :src="item.PhotoUrl" mode="aspectFill"></image>
					<view class="txt">
						<view class="txt_name">{{item.ReligName}}</view>
						<view class="dizhi">
							<view>{{item.Region}}</view>
							<!-- <view class="notice" v-if="item.NoCheckNum==0">提醒打卡</view> -->
						</view>
						<view class="project">
							待查项 <text>{{item.NoCheckNum}}</text>
							合格项 <text>{{item.PassNum}}</text>
							问题项 <text>{{item.NoPassNum}}</text>
						</view>
					</view>
				</view>				
			</view>	
			<view class="wu" v-if="place_list.length==0?true:false">
				暂无数据
			</view>
		</view>		
	</view>
</template>

<script>
	import xflSelect from '../../../components/xfl-select.vue';     //导入下拉列表插件
	export default {
		data() {
			const date1 = new Date();
			   let year = date1.getFullYear();
			   let month = date1.getMonth()+1;
			return {
				list:[              //需要改
					{value:'选择街道',disabled:true,DicCode:''},					
					// {value:'全镇',,DicCode:''},
				],
				place_list: [],
				StreetID:'',
				ReligName:'',
				month:month,
				year:year,
				showMask:true,
				title:'',              //模态框组件  显示内容
				isShow:false,          //模态框组件  初始化状态
				abc:false,             //是否显示  历史查询中的数据
				chooseNow:'',           //选中历史查询中的哪一项，则赋值，改变颜色
				time:year+'年'+(month<10?'0'+month:month)+'月'
			}
		},
		components:{
			xflSelect
		},
		// onNavigationBarButtonTap(e) {       //点击右上角  历史查询
		// 	console.log("点击了自定义按钮");			
		// 	this.abc=!this.abc;
		// },
		computed: {
			q1:function() {
				return this.getDate(1);
			},
			q2:function() {
				return this.getDate(2);
			},
			q3:function() {
				return this.getDate(3);
			}
		},
		methods:{
			history(){
				// if(this.abc==false)
				this.abc=!this.abc;
				console.log(this.abc)
			},
			xiaoshi(){
				var _this=this;
				var timer=setTimeout(function (){
					// _this.abc=false;
				},500);	
			},
			getDate(e){                 //得到  这个月往前   3个月的日期。
				let year = new Date().getFullYear();
				let month = new Date().getMonth()+1;
				if(e==1){
					if(month-1==0){
						year=year-1;
						month=12;
					}else{
						month=month-1;
					};
				}else if(e==2){
					if(month-2==0){
						year=year-1;
						month=12;
					}else if(month-2<0){
						year=year-1;
						month=11;
					}else{
						month=month-2;
					};					
				}else if(e==3){
					if(month-3==0){
						year=year-1;
						month=12;
					}else if(month-3==-1){
						year=year-1;
						month=11;
					}else if(month-3==-2){
						year=year-1;
						month=10;
					}else{
						month=month-3;
					};
				}
				month=month<10?'0'+month:month;
				return year+'-'+month;
			},
			one(e){                  //选择这个月  查看这个月的历史
				this.chooseNow=e;
				var temp=this.q1,year,month,m1;
				year=temp.slice(0,4);
				month=temp.slice(6);
				m1=month<10?'0'+month:month;
				//日期显示到  页面上
				this.time=`${year}年${m1}月`;
				this.abc=false;
				this.searchZj(this.StreetID,this.ReligName,year,month);
				
			},
			two(e){                 //选择这个月  查看这个月的历史
				this.chooseNow=e;				
				var temp=this.q2,year,month,m1;
				year=temp.slice(0,4);
				month=temp.slice(6);
				m1=month<10?'0'+month:month;
				//日期显示到  页面上
				this.time=`${year}年${m1}月`;
				this.abc=false;
				this.searchZj(this.StreetID,this.ReligName,year,month);
				
			},
			three(e){              //选择这个月  查看这个月的历史
				this.chooseNow=e;
				var temp=this.q3,year,month,m1;
				year=temp.slice(0,4);
				month=temp.slice(6);
				m1=month<10?'0'+month:month;
				//日期显示到  页面上
				this.time=`${year}年${m1}月`;
				this.abc=false;
				this.searchZj(this.StreetID,this.ReligName,year,month);
				
			},
			confirmY(){               //模态框
				this.isShow=false;
			},
			quxiao(){                 //模态框
				this.isShow=false;
			},
			change({newVal, oldVal, index, orignItem}){  //得到所选的数据
				var date1 = new Date();
				let year = date1.getFullYear();
				let month = date1.getMonth()+1;
				this.time=year+'年'+(month<10?'0'+month:month)+'月';
				this.StreetID=orignItem.StreetID;    //得到街道关键字ID
				this.chooseNow='';
				this.searchZj(orignItem.StreetID,'',this.year,this.month)      //街道改变时，获取宗教数据
			}, 
			search(ReligName){                           //搜索按钮
				var date1 = new Date();
			    let year = date1.getFullYear();
			    let month = date1.getMonth()+1;
				this.time=year+'年'+(month<10?'0'+month:month)+'月';
				this.chooseNow='';
				// this.searchZj(this.StreetID,ReligName,this.year,this.month)
				var _this=this;
				// console.log('Year',year)
				// console.log('Month',month)
				// console.log('StreetID',_this.StreetID)
				// console.log('ReligName',ReligName)
				 _this.place_list=[];        //是不是需要用？
				uni.request({
					url:getApp().globalData.api+ '/Check/GetCheckReligiousList',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
						UserID:0,       //未登陆会显示错误
						Year:year,
						Month:month,       //未录入当月数据
						PageNum:0,
						PageSize:15,
						StreetID:_this.StreetID,
						ReligName:ReligName        //场所名称
					},
					success(res) {
						console.log('sousuo==',res.data)						
						if(res.data.code==0){
							_this.place_list=res.data.data;
							for (var i = 0; i < _this.place_list.length; i++) {
								_this.place_list[i].PhotoUrl=getApp().globalData.imgUrl+_this.place_list[i].PhotoUrl;
							}
							console.log('成功')
							console.log(_this.place_list)
						}else if(res.data.code==1){
							_this.isShow=true;
							_this.title='未查询到相关巡查信息！';	
							_this.place_list=[]; 
							_this.ReligName='';
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
			getDetails(id,name,year,month){              //传递场所ID，进新页面，寺庙详情页
				uni.navigateTo({             
					url:'../jindu/inspect/mzInspect?ID='+ id+ '&ReligName='+name+'&Year='+year+'&Month='+month
				})
			},
			searchZj(StreetId,ReligName,year,month){         //获取数据的方法
				var _this=this;
				// _this.place_list=[];        //是不是需要用？
				uni.request({
					url:getApp().globalData.api+ '/Check/GetCheckReligiousList',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
						UserID:0,       //未登陆会显示错误
						Year:year,
						Month:month,       //未录入当月数据
						PageNum:0,
						PageSize:15,
						StreetID:StreetId,
						ReligName:ReligName        //场所名称
					},
					success(res) {
						console.log(res)						
						if(res.data.code==0){
							_this.place_list=res.data.data;
							for (var i = 0; i < _this.place_list.length; i++) {
								_this.place_list[i].PhotoUrl=getApp().globalData.imgUrl+_this.place_list[i].PhotoUrl;
								
							}
							console.log('成功')
							console.log(_this.place_list)
						}else if(res.data.code==1){
							_this.isShow=true;
							_this.title='未查询到相关巡查信息！';	
							_this.place_list=[]; 
							_this.ReligName='';
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
		mounted() {
			console.log(this.month)
			
			//获取街道数据-以下
			var _this=this;
			if(getApp().globalData.ParentID!=0){
				this.StreetID=getApp().globalData.quId
				this.searchZj(this.StreetID,'',this.year,this.month);
				uni.request({
					url:getApp().globalData.api+ '/Districts/DistrictsList',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
						ParentID:1,   					// ParentID:1      // 丰南区区ID：1
					},
					success(res) { 
						console.log(res.data)
						if(res.data.code==0){
							for (var i = 0; i < res.data.data.length; i++) {
								if(_this.StreetID==res.data.data[i].ID){
									var obj={};
									obj.value=res.data.data[i].DisName;
									obj.StreetID=res.data.data[i].ID;
									obj.DicCode=res.data.data[i].DicCode;
									_this.list.push(obj);
								}
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
			}else{
				this.searchZj('','',this.year,this.month);
				uni.request({
					url:getApp().globalData.api+ '/Districts/DistrictsList',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
						ParentID:1,   					// ParentID:1      // 丰南区区ID：1
					},
					success(res) { 
						console.log(res.data)
						if(res.data.code==0){
							for (var i = 0; i < res.data.data.length; i++) {
								var obj={};
								obj.value=res.data.data[i].DisName;
								obj.StreetID=res.data.data[i].ID;
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
			}
			
			
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
	
		
	
	// 显示
	.show{
		display: block;
	}
	// 隐藏
	.hide{
		display: none;
	}
	// 选中的颜色
	.co1{
		background-color: #3385ff;
		color:#fff;
	}
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
	//无数据时  显示
	.wu{		
		width: 100%;
		line-height: 50rpx;
		padding:30rpx 30rpx;
		box-sizing: border-box;
		color:#999;
		text-align: center;
		font-size: 32rpx;
		border-bottom: solid 1rpx #eee;
		background-color: #fff;
	}
	.place_list {
		width: 100%; 
		color: #848484;
		background-color: #f5f5f5;

		.place_item {
			width: 100%;
			height: 180rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2rpx solid #F5F5F5;
			background-color: #FFFFFF;
			
			.place_item_left {
				width: 100%;
				display: flex;
				image {
					width: 150rpx;
					height: 120rpx;
					background-color: #C0C0C0;
					margin-right: 20rpx;
				}
				.txt{
					width: 100%;
					.txt_name {
						font-size: 30rpx;
						font-weight: 700;
						color: #000000;
					}
					.dizhi{
						width: 100%;
						height: 50rpx;
						line-height: 50rpx;
						font-size: 28rpx;
						display: flex;
						justify-content: space-between;
						
						.notice{
							padding: 10rpx;
							line-height: 30rpx;
							background-color: #6492EB;
							border-radius: 50rpx;
							color: #FFFFFF;
						}
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
				
			}

			.font {
				text {
					font-size: 60rpx;
					color: #487DE5;
				}
			}

		}
	}
	
	.chooseCity{
		background-color: #fff;
		padding: 6rpx 30rpx;
		display: flex;
		justify-content:flex-start;
		align-items: center;
		line-height: 40rpx;
	}
	.xflselect{
		width:200rpx;		
		border:0 !important;
		padding: 0;
		margin-right: 20rpx;
	}
	input{
		border-bottom: solid 1rpx #ccc;
		padding: 10rpx 6rpx;
	}
	.searchText{
		color:#487DE5;
		width: 90rpx;
		padding: 0 16rpx;		
	}
	.more {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
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
					display: flex;
					flex-direction: column;
					justify-content: space-between;
				}
			}
		} 
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
