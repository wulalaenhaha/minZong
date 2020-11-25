<template>
	<!-- 场所筛选 -5-->
	<view class="place_select">
		<!-- 寺庙信息 -->
		<!-- <view class="header" @tap="toAddress()"> -->
		<view class="header">
			<view class="tpImg">
				<image class="tp" :src="photoUrl"></image>
			</view>
			<view class="tpInfo" v-for="(item,index) in zjInfo" :key="index">
				<view class="tpName">{{item.name}}</view>
				<view class="tpAddress">{{item.address}}</view>
				<view class="phone">{{item.leader}}&nbsp;&nbsp;{{item.phone}}</view>
			</view>
		</view>
		<!-- 滑动门 -->
		<view class="door">
			<view class="doorTitle">
				<view class="check" :class="{borderColor:tag===0}" @tap="checkClick">
					待查项({{num1}})
				</view>
				<view class="qualified" :class="{borderColor:tag===1}" @tap="qualifiedClick">
					合格项({{num2}})
				</view>
				<view class="problem" :class="{borderColor:tag===2}" @tap="problemClick">
					问题项({{num3}})
				</view>
			</view>		
		</view>
		<!-- 消防安全           一下两项没有写跳转地址-->
		<block v-for="(item,index) in brr" :key="index">
			<view class="fire">
				<view class="title">
					<view class="lineLeft"></view>
					<text class="h3">{{item}}</text>		
				</view>
				<view class="doorCon">
					<block v-for="(item1,index1) in detail" :key="index1">					
						<view class="detail" v-show="tag===item1.Status && item1.ParentName==item">
							<!-- <view class="detail" style="width: 100%;" @tap='getDetail(item1.ID,item1.Status,item1.ReligiousInfoID)'> -->
							<view class="detail" style="width: 100%;">
								<view style="line-height: 48rpx;padding:6px  0;">{{item1.ItemName}}</view>
								<view class="con">
									<image v-if="iconValue==='success'" class="correct" src="../../../static/index/correct.png"></image>
									<image v-if="iconValue==='warn'" class="correct" src="../../../static/index/wrong.png"></image>
									<!-- <image class="gt" src="../../../../static/mine/jiantou.png"></image> -->
								</view>
							</view>						
						</view>
					</block>
				</view>
			</view>
		</block>	
	</view>
</template>

<script>
	export default {
		data() {
			const date = new Date();
			   let year = date.getFullYear();
			   let month = date.getMonth()+1;
			return {
				iconValue: '',
				tag: 0,
				zjInfo:[
					{name:'宗教名称',address:'地址',leader:'负责人',phone:'联系电话'}
				],
				detail:[],
				num1:0,
				num2:0,
				num3:0,
				brr:[],
				month:month,
				year:year,
				id:'',             //场所ID
				photoUrl:'',
				showMask:true
			}
		},
		methods: { 
			checkClick() {
				this.tag = 0;
				this.iconValue = " ";
			},
			qualifiedClick() {
				this.tag = 1;
				this.iconValue = "success";
			},
			problemClick() {
				this.tag = 2;
				this.iconValue = "warn";
			},
			getNum(arr){       //遍历获得的数据，得出所在项目的数量
				for (var i = 0; i < arr.length; i++) {	
					this.brr[i]=arr[i].ParentName;
					if(arr[i].Status==0){
						this.num1++;
					}else if(arr[i].Status==1){
						this.num2++;
					}else{
						this.num3++;
					}
				}
				this.brr=this.getBrr(this.brr);
			},
			getBrr(array){
				var temp = []; //一个新的临时数组
				for(var i = 0; i < array.length; i++){
					if(temp.indexOf(array[i]) == -1){
						temp.push(array[i]);
					}
				}
				return temp;				
			},
		},
		mounted() {
			var _this=this
			_this.id=getApp().globalData.userylyid;
			uni.request({                //获得民宗的基本信息
				url:getApp().globalData.api+ '/Religious/GetReligiousDetatil',
				data:{
					Account:getApp().globalData.userName,
					Password:getApp().globalData.userPwd,					
					ID:_this.id
				},
				success(res) {
					console.log(res.data)
					if(res.data.code==0){
						_this.photoUrl=getApp().globalData.imgUrl+res.data.data[0].PhotoUrl
						_this.zjInfo[0].name=res.data.data[0].ReligName
						_this.zjInfo[0].address=res.data.data[0].Position
						_this.zjInfo[0].leader=res.data.data[0].leadName
						_this.zjInfo[0].phone=res.data.data[0].Phone
						console.log('成功获得场所信息详情')
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
			uni.request({          //获取民宗的待查项信息基本信息
				url:getApp().globalData.api+ '/Check/GetCheckProjectList',
				data:{
					Account:getApp().globalData.userName,
					Password:getApp().globalData.userPwd,
					ReligiousInfoID:_this.id,
					Year:_this.year,
					Month:_this.month,
					PageNum:0,
					PageSize:100,
					StreetID:''
				},
				success(res) {
					console.log(res.data)						
					if(res.data.code==0){
						_this.detail=res.data.data;	
						// _this.num1=res.
						_this.getNum(_this.detail);						
						console.log('成功111')
						console.log(_this.detail)
						//动态设置标题
						uni.setNavigationBarTitle({
						    title: res.data.data[0].ReligName
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
			});
		},
		
	}
</script>

<style>
	page {
		background-color: #f5f5f5;
		font-size: 16px;
	}

	view {
		box-sizing: border-box;
	}

	.header {
		width: 100%;
		height: 180rpx;
		padding: 20rpx 30rpx;
		background-color: #fff;
		display: flex;
		align-items: flex-start;
		margin-bottom: 20rpx;
	}

	.header .tpImg,
	.header .tp {
		width: 120rpx;
		height: 120rpx;
		background-color: #666;
		margin-right: 20rpx;
	}

	.header .tpImg image.gt {
		width: 120rpx;
		height: 120rpx;
	}

	.tpName {
		color: #000;
		font-weight: bold;
	}

	.tpInfo {
		color: #848484;
		margin-top: -4rpx;
	}
	.tpInfo>view{
		height:48rpx;
		line-height: 48rpx;
	}
	.phone {
		/* line-height: 60rpx; */
	}

	.door {
		background-color: #fff;
		padding: 20rpx 30rpx;
		color: #868686;
		margin-bottom: 20rpx;
	}

	.doorTitle {
		display: flex;
		justify-content: space-around;
	}

	.doorTitle view {
		padding: 16rpx 0;
	}

	.borderColor {
		color: #6398FF;
		border-bottom: solid 2px #6398FF;
	}

	.detail,
	.fire .content,
	.build .content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		line-height: 90rpx;
	}
	.con {
		display: flex;
		justify-content: space-between;
		align-items: center;
		/* line-height: 90rpx; */
	}
	.con .correct{
		width: 35rpx;height: 35rpx;
	}
	.detail navigator {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.fire,
	.build {
		background-color: #fff;
		padding: 20rpx 30rpx;
		color: #868686;
		margin-bottom: 20rpx;
	}

	.fire .title,
	.build .title {
		display: flex;
		align-items: center;
	}

	.fire .title .lineLeft,
	.build .title .lineLeft {
		background-color: #487DE5;
		width: 4px;
		height: 36rpx;
		margin-right: 12rpx;
	}

	.fire .title .h3,
	.build .title .h3 {
		color: #000;
		font-weight: bold;
	}
</style>
