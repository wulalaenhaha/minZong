<template>
	<view class="index">
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
			<view class="header_banner">
				<image src="../../static/index/banner@2x.png" mode="aspectFill"></image>
			</view>
			<view class="header_login">
				<!-- <view class="login" @tap="login"> -->
				<view class="login">
					<view class="header_box" style="text-align: center;">
						<image style="width: 80%;height:80%;margin-top: 3rpx;" src="../../static/in.png"></image>
					</view>
					<view class="name">{{usnerinfo.userName}}</view>
				</view>
				<view class="">丰南掌上民宗</view>
				<view class="header_info" >
					<image @tap="info" v-if="usnerinfo.code==2" src="../../static/index/info.png" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<!-- 常用菜单导航 -->
		<view class="navs">
			<!-- 民宗局查询首页 页面功能列表 -->
			<view class="menu" v-if="usnerinfo.code==1">
				<!-- <view  class="menu"  v-if="isMzJ==true"> -->
					<!-- 丰南区民宗局列表  根据ParentID-->
					<view class="menu_list" v-for="(item,index) in mzJu_list" :key="index">
						<navigator class="menu_li" :url="item.path">						
							<image :src="item.icon" mode="aspectFill"></image>						
							<view class="txt">{{item.txt}}</view>
						</navigator>
					</view>
				<!-- </view> -->
				<!-- <view  class="menu"  v-if="isMzJ==false"> -->
					<!-- 乡镇民宗局  -->
					<!--  乡镇没数据-->
					<!-- <view class="menu_list" v-for="(item,index) in xiangZhen_list" :key="index" v-if="isDisplay==true">
						<navigator class="menu_li" :url="item.path">						
							<image :src="item.icon" mode="aspectFill"></image>						
							<view class="txt">{{item.txt}}</view>
						</navigator>
					</view> -->
					<!-- 乡镇有数据 -->
					<!-- <view class="menu_list" v-for="(item,index) in xiangZhen_list1" :key="index" v-if="isDisplay==false">
						<navigator class="menu_li" :url="item.path">						
							<image :src="item.icon" mode="aspectFill"></image>						
							<view class="txt">{{item.txt}}</view>
						</navigator>
					</view>
				</view> -->
			</view>
			<!-- 宗教委员 首页功能列表 -->
			<view v-if="usnerinfo.code==2">
				<view  class="menu"  v-if="isMzJ==true">
					<view class="menu_list" v-for="(item,index) in menu_list" :key="index">
						<navigator class="menu_li" :url="item.path">						
							<image :src="item.icon" mode="aspectFill"></image>						
							<view class="txt">{{item.txt}}</view>
						</navigator>
					</view>
				</view>
				<view  class="menu"  v-if="isMzJ==false">
					<!-- 乡镇民宗局  -->
					<!--  乡镇没数据-->
					<view class="menu_list" v-for="(item,index) in xiangZhen_list" :key="index" v-if="isDisplay==true">
						<navigator class="menu_li" :url="item.path">						
							<image :src="item.icon" mode="aspectFill"></image>						
							<view class="txt">{{item.txt}}</view>
						</navigator>
					</view> 
					<!-- 乡镇有数据 -->
					<view class="menu_list" v-for="(item,index) in xiangZhen_list1" :key="index" v-if="isDisplay==false">
						<navigator class="menu_li" :url="item.path">						
							<image :src="item.icon" mode="aspectFill"></image>						
							<view class="txt">{{item.txt}}</view>
						</navigator>
					</view>
				</view>
			</view>
			<!-- 场所人员  首页功能列表-->
			<view class="menu" v-if="usnerinfo.code==3">
				<view class="menu_list" v-for="(item,index) in item_list" :key="index">
					<navigator class="menu_li" :url="item.path">						
						<image :src="item.icon" mode="aspectFill"></image>						
						<view class="txt">{{item.txt}}</view>
					</navigator>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				xiangZhen_list:[
					{
						icon: '../../static/index/qunzhong.png',
						txt: '信教群众查询',
						path: './search/queryPeople'
					},
					{
						icon: '../../static/index/zhengce.png',
						txt: '政策法规',
						path: './zhengce/zhengceList'
					},
					{
						icon: '../../static/index/minzu.png',
						txt: '少数民族查询',
						path: './nation/zongJiaoNation'
					},
					{
						icon: '../../static/index/shipin.png',
						txt: '视频直播',
						path: './video/video'
					},
					{
						icon: '../../static/index/banshi.png',
						txt: '互动信息',
						path: './mzBanShi/index'
					}
				],
				xiangZhen_list1:[
					{
						icon: '../../static/index/zongjiao.png',
						txt: '场所查询',
						path: './search/searchOrg'
					},
					// { 
					// 	icon: '../../static/index/xuncha.png',
					// 	txt: '平安巡查',
					// 	path: './soft/mzXunCha'
					// },
					{
						icon: '../../static/index/xuncha.png',
						txt: '平安巡查',
						path: './soft/xuncha'
					},
					{
						icon: '../../static/index/renyuansousuo.png',
						txt: '教职人员',
						path: './search/searchStaff'
					},
					{
						icon: '../../static/index/qunzhong.png',
						txt: '信教群众查询',
						path: './search/queryPeople'
					},
					{
						icon: '../../static/index/zhengce.png',
						txt: '政策法规',
						path: './zhengce/zhengceList'
					},
					{
						icon: '../../static/index/minzu.png',
						txt: '少数民族查询',
						path: './nation/zongJiaoNation'
					},
					{
						icon: '../../static/index/shipin.png',
						txt: '视频直播',
						path: './video/video'
					},
					{
						icon: '../../static/index/banshi.png',
						txt: '互动信息',
						path: './mzBanShi/index'
					}
				],
				mzJu_list: [
					{
						icon: '../../static/index/zongjiao.png',
						txt: '场所查询',
						path: './search/searchOrg'
					},
					{ 
						icon: '../../static/index/xuncha.png',
						txt: '平安巡查',
						path: './soft/mzXunCha'
					},
					{
						icon: '../../static/index/renyuansousuo.png',
						txt: '教职人员',
						path: './search/searchStaff'
					},
					{
						icon: '../../static/index/qunzhong.png',
						txt: '信教群众查询',
						path: './search/MzjuPeople'
					},
					{
						icon: '../../static/index/zhengce.png',
						txt: '政策法规',
						path: './zhengce/zhengceList'
					},
					{
						icon: '../../static/index/minzu.png', 
						txt: '少数民族查询',
						path: './nation/mZnation'
					},
					{
						icon: '../../static/index/shipin.png',
						txt: '视频直播',
						path: './video/index'
					},
					{
						icon: '../../static/index/banshi.png',
						txt: '互动信息',
						path: './mzBanShi/index'
					}
				],
				menu_list: [
					// {
					// 	icon: '../../static/index/shijian.png',
					// 	txt: '宗教事件',
					// 	path: './soft/soft'
					// },
					{
						icon: '../../static/index/zhengce.png',
						txt: '政策法规',
						path: './zhengce/zhengceList'
					},
					{
						icon: '../../static/index/zongjiao.png',
						txt: '场所查询',
						path: './search/searchOrg'
					},
					{ 
						icon: '../../static/index/xuncha.png',
						txt: '平安巡查',
						path: './soft/xuncha'
					},
					{
						icon: '../../static/index/renyuansousuo.png',
						txt: '教职人员',
						path: './search/searchStaff'
					},
					{
						icon: '../../static/index/qunzhong.png',
						txt: '信教群众查询',
						path: './search/queryPeople'
					},
					// {
					// 	icon: '../../static/index/zhibo.png',
					// 	txt: '实时直播',
					// 	path: '../mine/zhiwen-livepush'
					// },
					{
						icon: '../../static/index/minzu.png',
						txt: '少数民族查询',
						path: './nation/zongJiaoNation'
					},
					{
						icon: '../../static/index/shipin.png',
						txt: '视频直播',
						path: './video/video'
					},
					// {
					// 	icon: '../../static/index/shipin.png',
					// 	txt: '视频直播',
					// 	path: './video/index'
					// },
					{
						icon: '../../static/index/banshi.png',
						txt: '互动信息',
						path: './mzBanShi/index'
					}
				],				 
				usnerinfo: {
					// avatarUrl: '',    是否需要有登录人员头像显示
					token: '',
					userName: '用户名',
					login: false,       //登录状态
					code:'',			//人员类型：行政专员2 或者 教会人员3
				},
				item_list: [
					{
						icon: '../../static/index/zongjiao.png',
						txt: '场所查询',
						path: './search/searchOrg'
					},
					{
						icon: '../../static/index/position.png',
						txt: '采集场所位置',
						path: './place/placeInfo'
					},
					// { 
					// 	icon: '../../static/index/xuncha.png',
					// 	txt: '平安巡查',
					// 	path: './soft/xuncha'
					// },
					// {
					// 	icon: '../../static/index/xuncha.png',
					// 	txt: '平安巡查',
					// 	path: './soft/xunchaPlace'
					// },
					{
						icon: '../../static/index/shijian.png',
						txt: '消息通知',
						path: './info/info'
					},
					// {
					// 	icon: '../../static/index/zhibo.png',
					// 	txt: '实时直播',
					// 	path: '../mine/zhibo'
					// },
					{
						icon: '../../static/index/zhibo.png',
						txt: '实时直播',
						path: '../mine/zhiwen-livepush'
					},
					{
						icon: '../../static/index/banshi.png',
						txt: '互动信息',
						path: './mzBanShi/index'
					}
				],	
				userylyid:-1,
				isShow:false,			//模态框
				isMzJ:false,			//民宗局列表是否显示
				isDisplay:true,		//根据判断展示哪个乡镇列表
				
			}
		},
		onShow(){      // 监听事件      字段ParentID   => =0  民宗局的人  =1乡镇的人
			if(!getApp().globalData.login){
				//弹出框   提示登录
				this.isShow=true;
			}else{
				this.isShow=false;  
			}
		// 1民宗局 为丰南民宗局时，可查看所有乡镇的民宗  为乡镇乡镇时，只能查看自己乡镇民宗的信息  2.宗教委员  3.场所
			console.log(getApp().globalData.code)
			if(getApp().globalData.code==1 || getApp().globalData.code==2 || getApp().globalData.code==3){
				console.log(getApp().globalData.login)
				this.usnerinfo.login=getApp().globalData.login;
				if(getApp().globalData.Name==''){
					this.usnerinfo.userName='用户名';
				}else{
					this.usnerinfo.userName=getApp().globalData.Name;
				}
				this.usnerinfo.code=getApp().globalData.code;
				if(getApp().globalData.code==2){ 				//code为3时
					console.log("ParentID",getApp().globalData.ParentID)
					this.userylyid=-1
					var _this=this
					if(getApp().globalData.ParentID != 0){    //乡镇
						this.isMzJ=false
						uni.request({
							url:getApp().globalData.api+ '/Religious/IsHaveReligous',   //判断乡镇是否有场所
							data:{
								Account:getApp().globalData.userName,
								Password:getApp().globalData.userPwd,
								quId:getApp().globalData.quId
								// quId:7
							},
							success(res) {
								console.log(res)
								if(res.data.code==0){
									_this.isDisplay=false;   //乡镇有数据
									console.log('乡镇有数据')
									// console.log(_this.xiangZhen_list1)
								}else{
									_this.isDisplay=true;   //乡镇没数据
									console.log('乡镇没数据')
								}
							}
						})
					}else{				//民宗局
						this.isMzJ=true
						console.log('宗教委员')
					}
				}else{
					if(getApp().globalData.code==3){
						this.userylyid=getApp().globalData.userylyid;    //code为3时，返回的场所ID
						console.log(this.userylyid)
					}
					// else{												//code 为2
					// 	this.userylyid=-1
					// }
				}
			}else{
				// this.usnerinfo.userName='点击登录';
				// this.usnerinfo.login=false;	
				// this.usnerinfo.code='';
			};
			uni.request({                     //有无未读公告，如果有显示在tarbar  上！
				url:getApp().globalData.api+ '/Message/GetMessageList',
				data:{
					Account:getApp().globalData.userName,
					Password:getApp().globalData.userPwd,
					ReceiveUserID:getApp().globalData.userID,
					Type:1,             //公告列表
					IsRead:0,          //1已读或0未读  应该调两次接口
					PageNum:0,           //当前显示页码数
					PageSize:10           //当前页消息个数
				},
				success(res) {
					// console.log(res.data)
					if(res.data.code==0){
						console.log('成功获得未读公告')
						if(res.data.data.length>0){     //有未读公告
							console.log('有未读公告')
							getApp().globalData.infoNum=res.data.data.length;
							uni.setTabBarBadge({
							  index: 1, 
							  text: res.data.data.length.toString()
							})
						}
					}else if(res.data.code==1){
						console.log('失败333 =>没有未读公告！')
					}else if(res.data.code==-1){
						console.log('用户名或密码错误')
					}
				},
				fail(res) {
					console.log(res)
				}
			});	
		},
		methods: {
			confirmY(){                //模态框  确定  按钮
				this.isShow=false;
				uni.navigateTo({
					url:'../index/login/login'
				}); 
			},
		},
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #f5f5f5;
	}
	.index {
		width: 100%;
		height: 100%;
		// background-color: #fff;
	}

	.header {
		width: 100%;
		height: 332rpx;
		color: #FFFFFF;
		font-size: 36rpx;

		.header_banner {
			height: 244rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.header_login {
			height: 88rpx;
			display: flex;
			justify-content: space-between;
			padding: 22rpx 30rpx;
			box-sizing: border-box;
			background-color: #487DE5;

			.login {
				display: flex;
				font-size: 24rpx;
				align-items: center;

				.header_box {
					width: 44rpx;
					height: 44rpx;
					border-radius: 50%;
					margin-right: 10rpx;
					background-color: #FFFFFF;
				}
			}

			.header_info {
				width: 35rpx;
				height: 44rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	.navs {
		width: 100%;
		height: 800rpx;
		// background-color: #FFFFFF;
	}

	.navs {
		padding-top: 60rpx;
	}

	.menu {
		width: 100%;
		height: 220rpx;
		padding: 0 40rpx;
		display: flex;
		flex-wrap: wrap;
		color: #686868;
		text-align: center;
		
		.menu_list {
			width: 46%;
			height: 100%;
			font-size: 30rpx;
			margin: 20rpx 2%;
			padding: 20rpx;	
			display: inline-block;
			box-sizing: border-box; 
			background-color: #fff;
			border-radius: 8px;
			box-shadow: 0px 0px 8px 2px #eee;
			.menu_li {
				width: 100%; 				
				height: 100%;		
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-around;
				user-select: none;
			}

		}
	}
	.menu_li image{
		width: 70rpx;
		height:70rpx;
	}
	.new_active {
		height: 237rpx;
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