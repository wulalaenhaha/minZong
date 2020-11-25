<template>
	<!-- 场所查询 --> 
	<view class="place_select">
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
		<view class="place_list">
			<view class="place_item" @tap="getDetails(item.ID)" v-for="(item,index) in place_list" :key="index">
				<view class="place_item_left">
					<image :src="item.PhotoUrl" mode="aspectFill"></image>
				</view>
				<view class="place_item_right">
					<view class="txt_name">{{item.ReligName}}</view>
					<view class="">{{item.Position}}</view>
					<view class="time">
						<text>{{item.Religcategory}}</text>						
					</view>
				</view>
			</view> 
		</view>		
	</view>
</template> 

<script>
	import xflSelect from '../../../components/xfl-select.vue';     //导入下拉列表插件
	export default {
		data() {
			return {
				list:[              //需要改
					{value:'选择街道',disabled:true,StreetID:-1,DicCode:0}
				],					
				place_list: [],
				ReligName:'',
				StreetID:-1,
				pageNum:0,
				c1:'style1',
				hasMoreData:true,
				pageSize:8
			}					
		},
		components:{
			xflSelect
		}, 
		methods:{
			change({newVal, oldVal, index, orignItem}){  //得到所选的数据	
				// console.log(orignItem)
				this.StreetID=orignItem.StreetID;    //得到街道关键字ID
				// this.searchZj(orignItem.StreetID,'')      //街道改变时，获取宗教数据
				var _this=this;
				uni.request({
					url:getApp().globalData.api+ '/Religious/ReligiousList',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
						PageNum:0,
						PageSize:this.pageSize,
						ReligName:0,
						StreetID:this.StreetID
					},
					success(res) { 
						console.log('res.data=',res.data)						
						if(res.data.code==0){							
							var obj=[];
							// obj=res.data.data;														
							// obj[0].PhotoUrl=getApp().globalData.imgUrl+obj[0].PhotoUrl;
							//  _this.place_list=obj;
							obj=res.data.data;
							for(var i=0;i<obj.length;i++){
								obj[i].PhotoUrl=getApp().globalData.imgUrl+obj[i].PhotoUrl;
							}	
							console.log(obj)
							_this.place_list=obj;
							console.log('成功')
							if(_this.place_list==''){
								uni.showModal({
									showCancel:false,
									title:'未查询到符合搜索条件的场所！'
								});
								_this.ReligName='';
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
				})
			},
			search(ReligName){                           //搜索按钮		
				console.log(ReligName);
				if(ReligName==""){
					wx.showToast({
						icon:'none',
						title: '请输入场所名称',
					})
				}else{
					var _this=this;
					uni.request({
						url:getApp().globalData.api+ '/Religious/ReligiousList',
						data:{
							Account:getApp().globalData.userName,
							Password:getApp().globalData.userPwd,
							PageNum:0,
							PageSize:this.pageSize,
							ReligName:ReligName,
							StreetID:this.StreetID
						},
						success(res) { 
							console.log(res.data)
							
							if(res.data.code==0){	
								if(res.data.data==''){
									console.log('00000000111')
									wx.showToast({
										icon:'none',
										title:'未查询到符合搜索条件的场所！'
									})
									_this.ReligName='';
								}else{
									var num=0,obj=[];
									obj=res.data.data;														
									obj[0].PhotoUrl=getApp().globalData.imgUrl+obj[0].PhotoUrl;
									 _this.place_list=obj;
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
				}
			},
			getDetails(id){
				if(getApp().globalData.code==3){   
					uni.navigateTo({             //传递ID到下一个页面
						url:'../soft/reportInfo/address?ID='+ id
					})
				}else{
					uni.navigateTo({             //传递ID到下一个页面
						url:'../place/PlaceInfo1?ID='+ id
					})
				}
			},
			searchZj(StreetId,ReligName){         //获取数据的方法
				var _this=this;
				uni.request({
					url:getApp().globalData.api+ '/Religious/ReligiousList',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
						PageNum:_this.pageNum,
						PageSize:_this.pageSize,
						ReligName:ReligName,
						StreetID:StreetId
					},
					success(res) { 
						console.log(res.data)						
						if(res.data.code==0){							
							var num=0,obj=[];
							obj=res.data.data;
							for(var i=0;i<res.data.data.length;i++){
								num++;								
								obj[i].PhotoUrl=getApp().globalData.imgUrl+obj[i].PhotoUrl;
								 _this.place_list.push(obj[i]);
							}							
							_this.pageNum++;
							if(num<_this.pageSize){					
								_this.hasMoreData=false;
							}	
							console.log('成功')
							if(_this.place_list==''){
								uni.showModal({
									showCancel:false,
									title:'未查询到符合搜索条件的场所！'
								});
								_this.ReligName='';
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
				})
			}			
		},
		mounted(){
			
			var _this=this;
			if(getApp().globalData.ParentID!=0){
				this.StreetID=getApp().globalData.quId
				this.searchZj(this.StreetID,'')          //初始时，获取宗教数据
				console.log(this.StreetID)
				uni.request({                 //获取街道数据-以下
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
				})
			}else{
				this.searchZj(-1,'')          //初始时，获取宗教数据
				uni.request({                 //获取街道数据-以下
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
				})
				
			}
			
		},
		// 下拉加载
		onReachBottom: function () {			
			if (this.hasMoreData) {
			  this.searchZj(this.StreetID,this.ReligName)
			} else {
			  wx.showToast({
				title: '没有更多数据',
			  })
			}						
		}
	}
</script>

<style  lang="scss">	
	page {
		font-size: 30rpx;
		background-color: #F5F5F5;
	}
	.place_select{
		color: #848484;
		background-color: #f5f5f5;
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
		max-width: 240rpx;
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
</style>

