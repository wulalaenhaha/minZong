<template>
	<!-- 教职人员查询 --> 
	<view class="place_select">
		<view class="header">
			<view class="tit">真实姓名</view>
			<view class="con">
				<input type="text" v-model="realName" placeholder="请输入要查询的人员姓名" placeholder-class="nr" />
			</view>
		</view>
		<view class="header">
			<view class="tit">教 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</view>
			<view class="con">
				<input v-model="jiaoName" type="text" placeholder="请输入要查询的宗教教名" placeholder-class="nr" />
			</view>
		</view>
		<view class="header">
			<view class="tit">资格证书</view>
			<view class="con"><input v-model="zhengshu" placeholder="请输入要查询的资格证书编号" type="text" placeholder-class="nr" /></view>
		</view>
		<view class="header">
			<view class="tit">身份证号</view>
			<view class="con"><input confirm-type="number" maxlength="18" v-model="carId" placeholder="请输入要查询的人员身份证号" type="idcard" placeholder-class="nr" /></view>
		</view>
		<view class="chooseCity">
			<view class="tit">所 &nbsp;属 &nbsp;区</view>
			<!-- 所 属 街 道 -->
			<view class="chooseCity">
				<xfl-select
					class="xflselect"
					:list="citys"
					:clearable="false"
					:showItemNum="5" 
					:listShow="false"				
					:initValue="'丰南区'"
					:selectHideType="'hideAll'"
					@change="change1"
				>				
				</xfl-select> 
			</view>
		</view>
		<!-- 下拉菜单 -->
		<!-- <view class="citys offset" v-show="isShow">
			<block v-for="(item,index) in citys" :key="index">
				<view @tap="getCity(item)">{{item}}</view>
			</block>
		</view> -->
		<!-- 所属街道 -->
		<view class="chooseRegion">
			<view class="tit">所属街道</view>
			<!-- 所 属 街 道 -->
			<view class="chooseCity">
				<xfl-select
					class="xflselect x2"
					:list="list"
					:clearable="false"
					:showItemNum="5" 
					:listShow="false"				
					:initValue="'选择街道'"
					:selectHideType="'hideAll'"
					@change="change"
				>				
				</xfl-select> 
			</view>
		</view>
		<!-- 搜索按钮 -->		
		<view class="search" >
			<button type="primary" @tap="searchP">搜 索</button>
		</view>
	</view>
</template>

<script>
	import xflSelect from '../../../components/xfl-select.vue';     //导入下拉列表插件
	export default {
		data() {
			return {	
				scale:'',
				scale1:'',
				isShow1:false,
				isShow:false,
				realName:'',
				jiaoName:'',
				zhengshu:'',
				carId:'',
				city:'',
				region:'',
				StreetID:'',
				citys:[
					// {value:'选择区',disabled:true,DicCode:0},
					{value:'丰南区',DicCode:1}     //区  没有数据和接口   只有1是丰南区
				],           
				list:[              //街道
					{value:'选择街道',disabled:true,StreetID:-1,DicCode:0}
				]
			}					
		},
		components:{
			xflSelect
		}, 
		methods:{
			searchP(){            //搜索按钮
				//直接跳转，如果成功则跳转。
				uni.navigateTo({
					url: 'queryResult?carId='+this.carId+'&jiaoming='+this.jiaoName +'&realName='+this.realName+'&zhengshu='+this.zhengshu+'&region='+this.region
				})				
			},
			change({newVal, oldVal, index, orignItem}){  //得到所选的数据      街道
				// console.log(orignItem)
				this.region=orignItem.StreetID;       //得到街道关键字ID			
			},
			change1({newVal, oldVal, index, orignItem}){  //得到所选的数据     区
				this.city=orignItem.DicCode;       //得到区关键字ID
			}
		},		
		mounted(){			
			var _this=this;
			if(getApp().globalData.ParentID!=0){
				this.StreetID=getApp().globalData.quId
				uni.request({                 //获取街道数据-以下
					url:getApp().globalData.api+ '/Districts/DistrictsList',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
						ParentID:1,   					// ParentID:1      // 丰南区区ID：1
					},
					success(res) { 
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
							console.log('res',res)
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
			}else{
				uni.request({                 //获取街道数据-以下
					url:getApp().globalData.api+ '/Districts/DistrictsList',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
						ParentID:1,   					// ParentID:1      // 丰南区区ID：1
					},
					success(res) { 
						if(res.data.code==0){
							for (var i = 0; i < res.data.data.length; i++) {
								var obj={};
								obj.value=res.data.data[i].DisName;
								obj.StreetID=res.data.data[i].ID;
								obj.DicCode=res.data.data[i].DicCode;
								_this.list.push(obj);
							}
							console.log('成功')
							console.log('res',res)
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
		}
	}
</script>

<style>
	.header,
	.chooseCity,
	.chooseRegion{
		background-color: #fff;
		padding: 15rpx 30rpx;
		display: flex;
		/* justify-content:space-between; */
		align-items: center;
		line-height: 60rpx;
	}
	.xflselect{
		width: 100%;height: inherit;
		border:0;
		padding: 0;
		margin-right: 20rpx;
	}
	.x2{
		position: relative;
		top:-6rpx;
	}
	.tit{
		/* width: 176rpx; */
		max-width: 30%;
		min-width: 24%;
	}
	.con{
		/* width: 524rpx; */
		max-width: 70%;
	}
	input{
		width: 500rpx;height:66rpx;
		background-color: #F5F5F5;
		padding-left: 10rpx;
	}
	/* input占位符样式 */
	.nr{
		background-color: #f5f5f5;
		width: 500rpx;height:66rpx;
		line-height: 66rpx;
	}
	.chooseCity,.chooseRegion{
		width: 100%;height:90rpx;		
	}
	.chooseCity .con,
	.chooseRegion .con{
		width: 530rpx;height:70rpx;		
		display: flex;
		align-items: center;	
		position: relative;
	}
	.city{
		width: 500rpx;height:70rpx;
		background-color: #f5f5f5; 
		color:#868686;		
	}
	/* 通用代码  开始 */
	.offset{
		width: 500rpx;
		position: absolute;		
		background-color: #f9f9f9;
		border-radius: 10rpx;
		left:190rpx;
		z-index: 10;
	}	
	.offset view{
		line-height: 54rpx;
		background-color: #f5f5f5;
	}	
	/* 通用代码  结束 */
	.citys{
		top:460rpx;    
	}
	.region{
		top:540rpx;
	}
	/* 三角样式及旋转 */
	.box{
		width: 0;height:0;
		border:solid 7px #5b5b5b;
		border-bottom:none;
		border-left:solid 7px transparent;
		border-right:solid 7px transparent;		
		position: absolute;
		right: 22px;
	}
	.scale{
		transform:rotate(180deg);
		transition:0.5s;
	}
	.scale1{		
		transition:0.5s;
	}
	/* 搜索按钮样式 */
	.search{
		width: 100%;		
		padding: 0 30rpx;
		text-align: center;
		position: absolute;
		bottom: 40rpx;
	}
</style>

