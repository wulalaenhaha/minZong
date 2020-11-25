
<template>
	<!-- 问题详情 ---->
	<view class="place_select">
		<!-- 巡查项目 -->		
		<form>
			<view class="header">
				<view>
					<view class="tit">巡查项目：</view>
					<view class="con">{{dataArray[0].ItemName}}</view>
				</view>				
			</view>
			<view class="header">
				<view>
					<view class="tit">操作指引：</view>
					<view class="con">{{dataArray[0].SonName}}</view>
				</view>				
			</view> 
			<view class="textarea">
				<view class="tit">现场情况</view>
				<view>
					<textarea name="" :disabled="code==3" class="con" id="" v-model="Remark" cols="30" rows="4" placeholder="请输入现场情况..."></textarea>
				</view>
				<view class="add">
					<block v-for="(item,index) in imgUrl1" :key='index'>
						<image class="img" v-show="item[0]==''?false:true" :src="item"></image>
						<text class="times" @tap="delImg(index)">&times;</text>
					</block>					
					<image @tap="addImg" class="addImg" src="../../../../static/index/iconfont-tianjia.png"></image>
				</view>
			</view>
			<view class="check">
				<view class="tit">
					检查结果
				</view>
				<radio-group class="radios" @change="radioChange">
					<label class="radio"><radio value="1" :disabled="code==3" :checked="current==1"/>合格</label>
					<label class="radio"><radio value="2" :disabled="code==3" :checked="current==2" />不合格</label>
				</radio-group>				
			</view>
			<view class="tj" v-if="code==2">
				<button type="primary" class="submit" @tap="tijiao">提交</button>
			</view>
		</form>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current:1,
				imgUrl1:[],
				Remark:'合格',
				dataArray:[],
				id:0,           //检查项目ID
				imgUrl:[],
				showMask:true,
				ID:'',           //场所ID  
				code:'',          //登录人员类别
				longitude:'',		//经度
				latitude:'',		  //纬度
				position:'',			//定位地址
			}
		},
		methods: {
			delImg(index){   //删除上传图片
				this.imgUrl.splice(index,1);
				this.imgUrl1.splice(index,1);
			},
			radioChange: function(evt) {
				this.current =parseInt(evt.detail.value);	
			},
			addImg(){
				var _this=this;
				if(_this.imgUrl.length==4){
					uni.showToast({
					    title: '最多可以上传4张图片！',
						icon:'none',
					    duration: 1500
					});			
				}else{
					uni.chooseImage({
						count: 4, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['camera'], //从相册选择,还是照相，默认选择照相					
						success: (res) => {
							const tempFilePaths = res.tempFilePaths;						
							for (var i = 0; i < res.tempFilePaths.length; i++) {
								_this.imgUrl1.push(tempFilePaths[i]);
								if(_this.imgUrl1.length>=4){
									_this.imgUrl1.length=4;
								}
								uni.uploadFile({            //上传图片
									url:getApp().globalData.api+ '/Check/UploadFile', //仅为示例，非真实的接口地址
									filePath: tempFilePaths[i],
									name: 'file',
									formData: {
										'user': 'test'
									},
									success: (uploadFileRes) => {																	
										_this.imgUrl.push(JSON.parse(uploadFileRes.data).data);									
										if(_this.imgUrl.length>=4){
											_this.imgUrl.length=4;
										}									
									}
								});
							}					        
						}
					})
				}
			},
			tijiao(){         //提交表格数据 ,跳转页面
				if(this.Remark=='' && this.current==1){
					this.Remark='合格'
				};
				if(this.Remark=='' && this.current==2){
					this.Remark='不合格'
				};
				
				var _this=this;
				uni.getLocation({
				    type: ' wgs84',    // wgs84 gps定位坐标   gcj02 返回国测局坐标，
					geocode:true,
				    success: function (res) {
				        console.log('当前位置的经度：' + res.longitude);     
				        console.log('当前位置的纬度：' + res.latitude);
						var point = new plus.maps.Point(res.longitude, res.latitude);
						plus.maps.Map.reverseGeocode(
							point,
							{},
							function(event) {
								var address = event.address; // 转换后的地理位置
								console.log(address, 'address');
								_this.position=address;
								console.log(_this.position)
							},
						);
				    }
				});
				uni.request({
					url:getApp().globalData.api+ '/Check/UpdateCheckProject',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
						ID:this.id,
						Remark:this.Remark,
						Status:this.current,
						Position:this.position,
						UserID:this.dataArray[0].CheckMan,
						PhotoUrl:this.imgUrl.toString()
					},
					success(res) {		
						// console.log(res.data)
						if(res.data.code==0){
							uni.showToast({
							    title: '上报成功！',
								icon:'success',
							    duration: 1500,
								success() {
									setTimeout(function () {
									   uni.navigateTo({
									   	url:'../../soft/xuncha'													
									   })
									}, 1600);										
								}
							});							
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
			getDate(e){
				var b=e.slice(6,e.length-2);
				var day=new Date(parseInt(b));
				var date=day.getFullYear()+"-"+day.getMonth()+"-"+day.getDate();
				var time=day.getHours()+":"+day.getMinutes()+":00";
				return date+" "+time
			}
		},
		onLoad:function(option){
			console.log(option)			
			this.id=option.id;    //检查项目ID
			this.ID=option.ID;    //场所ID
			var _this=this;
			uni.request({
				url:getApp().globalData.api+ '/Check/GetCheckProjectDetatil',
				data:{
					Account:getApp().globalData.userName,
					Password:getApp().globalData.userPwd,
					ID:option.id
				},
				success(res) {
					// console.log(res.data)
					if(res.data.code==0){
						_this.dataArray=res.data.data;	
						 _this.dataArray[0].CheckTime=_this.getDate(_this.dataArray[0].CheckTime)
						_this.Remark='';
						console.log('成功')
						// console.log(_this.dataArray)
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
		onShow() {
			this.code=getApp().globalData.code;
			console.log(this.code)
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url:'../inspect/inspect?ID='+this.ID
			})
		}
	}
</script>

<style>	
	.header,
	.textarea,
	.check{ 
		width: 100%;
		padding: 20rpx 30rpx;
		background-color: #fff;		
	}
	.header>view,
	.check{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.header view.tit{
		width: 22%;
		font-weight: 500;
	}
	.header view.con{
		font-size: 28rpx;	
		width: 78%;
	}
	input{
		min-width:500rpx;
	}
	.textarea{
		margin: 20rpx 0;
	}
	.textarea>view{
		margin-bottom: 20rpx;
	}
	.textarea .add{
		margin-bottom: 0;
	}
	.textarea textarea{
		height:150rpx;
	}
	.textarea .tit{
		line-height: 60rpx;
	}
	.img{
		width: 120rpx;height:120rpx;
		margin:10rpx;
	}
	.addImg{
		width: 100rpx;height:100rpx;
		margin-left: 14rpx;
		cursor:pointer;
	}
	.check .radios,
	.con{
		color:#868686;
	}
	.check radio{
		transform:scale(0.6);
		margin-left: 50rpx;		
	}
	.tj{
		width: 100%;
		position: absolute;
		bottom: 0;
		padding: 20rpx 30rpx;
	}	
	/* 删除按钮 */
	.times{
		display: inline-block;
		width: 32rpx;height:32rpx;
		text-align: center;
		line-height: 30rpx;
		position: relative;
		font-size: 18rpx;
		top:-120rpx;left:-20rpx;
		background-color: #f00;
		border-radius: 50%;
		color:#fff;
	}
</style>


