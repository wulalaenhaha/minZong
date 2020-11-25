
<template>
	<!-- 信息上报 ---->
	<view class="place_select"> 
		<view class="model" v-if="isShow">   <!-- 模态框 -->
			<view class="con">
				<view class="tit">{{title1}}</view>
				<view class="co">
					<view class="n" @tap="quxiao">取消</view>
					<view class="y" @tap="confirmY">确定</view>
				</view>
			</view>
		</view>
		<!-- 上报项目 -->		
		<form >
			<view class="header">
				<view>
					<view class="tit">事件分类：</view>
					<!-- picker选择器 -->
					<view class="picker">
						<picker @change="bindPickerChange" :value="index" :range="arr">
							<view class="uni-input">{{arr[index]}}</view>
						</picker>
					</view>
					<image class="gt" src="../../../../static/mine/jiantou.png" ></image>
				</view>				
			</view>
			<view class="header">
				<view>
					<view class="tit">发生时间：</view>
					<!-- picker选择器 -->
					<view class="picker">						
						<picker mode="time" @change="timePickerChange" :value="time">
							<view class="uni-input">{{today}} {{time}}</view>
						</picker>
					</view>
					<image class="gt" src="../../../../static/mine/jiantou.png" ></image>
				</view>				
			</view> 
			<view class="header">
				<view>
					<view class="tit">发生场所：</view>
					<!-- picker选择器 -->
					<view class="picker">
						<picker @change="bindPickerChange1" :value="index1" :range="brr">
							<view class="uni-input">{{brr[index1]}}</view>
						</picker>
					</view>
					<image class="gt" src="../../../../static/mine/jiantou.png" ></image>
				</view>				
			</view>
			<view class="header">
				<view @tap="search">
					<view class="tit">发生地点：</view>
					<view class="address">{{address}}</view>
					<image class="gt" src="../../../../static/mine/jiantou.png" ></image>
				</view>				
			</view> 
			<view class="textarea">
				<view class="tit">现场情况</view>
				<view style="margin-bottom: 20rpx;">
					<textarea v-model="Remark" cols="30" rows="3" placeholder="请输入现场情况..."></textarea>
				</view>
				<view class="add">		<!-- 刚添加的-开始 -->
					<view class="imgShow"> 
						<block v-for="(image,index) in imageList" :key="index">
							<image class="uni-uploader__img addImg" style="margin:4rpx 10rpx" :src="image" :data-src="image" @tap="previewImage"></image>						
							<text class="times" @tap="delImg(index)">&times;</text>
						</block>
						<block v-for="(video,index1) in videoSrc" :key="index1">
							<view class="prew" @tap="prew(video)">
								<view class="play"></view>
							</view>							
							<text v-show="video!=''?true:false"  class="times" @tap="delVideo(index1)">&times;</text>
						</block>						
					</view>
					<view class="uni-uploader__input-box">
						<image @tap="choose" class="addImg" src="../../../../static/index/iconfont-tianjia.png" ></image>						
					</view>
					<!-- 刚添加的-结束 -->
				</view>
			</view>
			<view class="tj">
				<button type="primary" class="submit" @tap="cun">暂 存</button>
				<button type="primary" class="submit" @tap="submit">提 交</button>
			</view>
		</form>		
		<view class="pro" v-if="progressShow">{{progress}}</view>
	</view>
</template>

<script>
	import permision from "@/common/permission.js"	
	export default {
		data() {
			const date = new Date();
			   let year = date.getFullYear();
			   let month = (date.getMonth()+1)>9?(date.getMonth()+1):'0'+(date.getMonth()+1);
			   let day = date.getDate()>9?date.getDate():'0'+date.getDate();   
			   let hours=date.getHours()>9?date.getHours():'0'+date.getHours(),mins=date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes();
			return {				 
				index:1,        //事件索引值
				arr:[],
				today:year + '-' + month + '-' + day + ' ',
				time:hours + ":" + mins ,
				address:'请选择事件发生地点',
				Remark:'',
				title: 'choose/previewImage',
				imageList: [],
				imgUrl:[],
				ID:0,
				drr:[],
				videoSrc:[],            //视频地址
				upVideoSrc:[],          //视频上传返回地址
				brr:['未发生在场所内'],                 //发生场所默认不选
				index1:0,                //场所索引值
				crr:[-1],                //发生场所,对应的场所ID，
				status:'',               //提交Status状态
				title1:'',              //模态框组件  显示内容
				isShow:false,           //模态框组件  初始化状态
				progress:'上传中...请勿进行其他操作！',             //上传进度  
				progressShow:false       //上传进度条
 			}
		},		
		methods: {
			confirmY(){               //模态框
				this.isShow=false;
			},
			quxiao(){                //模态框
				this.isShow=false;
			},
			delImg(index){   //删除上传图片
				this.imgUrl.splice(index,1);
				this.imageList.splice(index,1);
			},
			delVideo(index){   //删除上传视频
				this.videoSrc.splice(index,1);				
				var videoIndex=this.imgUrl.indexOf(this.upVideoSrc[index]); //返回video在imgUrl数组中的索引值
				this.imgUrl.splice(videoIndex,1);
			},
			getDate(e){
				var b=e.slice(6,e.length-2);
				var day=new Date(parseInt(b));
				var date=day.getFullYear()+"-"+(day.getMonth()+1)+"-"+day.getDate();
				return date
			},
			getTime(e){
				var b=e.slice(6,e.length-2);
				var day=new Date(parseInt(b));
				var time=day.getHours()+":"+day.getMinutes();
				return time
			},
			bindPickerChange(v){		 //选择事件			
				this.index=v.detail.value;
			},
			bindPickerChange1(v){         //选择发生场所
				this.index1=v.detail.value;
				this.ID=this.crr[this.index1];		
				console.log('ID'+this.ID)
			}, 
			timePickerChange(v){
				// console.log(v)
				this.time=v.detail.value;
			},
			search(){
				var _this=this;
				uni.chooseLocation({
					keyword:'',
					success:(res)=>{
						console.log(res)
						_this.address=res.address;						
					}
				})
			},  
			report(status){				
				uni.request({
					url:getApp().globalData.api+ '/Report/AddReport',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
						ReligiousInfoID:this.crr[this.index1],  //场所ID
						EventCategory:this.arr[this.index],
						InformPlace:this.address,
						InformTime:this.today + " " + this.time+ ":00",
						Remark:this.Remark,
						AddMan:getApp().globalData.userID,
						PhotoUrl:this.imgUrl.toString(),
						Status:status
					},
					success(res) {
						if(res.data.code==0){
							console.log('成功')
							if(status==2){    //暂存
								uni.showToast({
								    title: '暂存成功！',
									icon:'success',
								    duration: 1500,
									success() {
										setTimeout(function () {
										    uni.navigateTo({
										    	url:'../soft'
										    })
										}, 1600);										
									}
								});
							}else if(status==0){    //上报
								uni.showToast({
								    title: '上报成功！',
									icon:'success',
								    duration: 1500,
									success() {
										setTimeout(function () {
										    uni.navigateTo({
										    	url:'../soft'
										    })
										}, 1600);										
									}
								});
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
			update(status){
				console.log('调用更新接口')		
				uni.request({
					url:getApp().globalData.api+ '/Report/UpdateReport',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,
						ID:this.ID,           //信息ID
						ReligiousInfoID:this.crr[this.index1],    //场所ID  未获知
						EventCategory:this.arr[this.index],
						InformPlace:this.address,
						InformTime:this.today + " " + this.time + ":00",
						Remark:this.Remark,						
						PhotoUrl:this.imgUrl.toString(),
						Status:status
					},
					success(res) {
						if(res.data.code==0){
							console.log('成功更新')
							if(status==2){    //暂存
								uni.showToast({
								    title: '暂存成功！',
									icon:'success',
								    duration: 1500,
									success() {
										setTimeout(function () {
										    uni.navigateTo({
										    	url:'../soft'
										    })
										}, 1600);										
									}
								});
							}else if(status==0){     //上报
								uni.showToast({     
								    title: '上报成功！',
									icon:'success',
								    duration: 1500,
									success() {
										setTimeout(function () {
										    uni.navigateTo({
										    	url:'../soft'
										    })
										}, 1600);										
									}
								});
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
			submit(){
				var _this=this;
				if(_this.imgUrl.length>=1){
					if(_this.status==2){
						console.log(_this.imgUrl.toString())
						_this.update(0);
					}else{
						_this.report(0);
					}
				}else{
					_this.isShow=true;
					_this.title1='至少选择一个照片或视频上传！';	
				}						
			},
			cun(){            //暂存的接口			
				if(this.status==2){
					this.update(2);
				}else{					
					this.report(2);
				}
			},
			chooseVideo(){
				var _this = this;
				var srcVideo='';
				uni.chooseVideo({
					count: 1,
					sourceType:['album', 'camera'],
					maxDuration:15,
					success: function (res) {
						_this.videoSrc.push(res.tempFilePath);
						console.log('得到视频地址，开始传输')
						var src=res.tempFilePath;
						const uploadTask=uni.uploadFile({
							url:getApp().globalData.api+ '/Check/UploadFile',  //上传图片接口
							filePath: src,
							name: 'file',						
							success: (uploadFileRes) => {
								var x=JSON.parse(uploadFileRes.data);
								_this.upVideoSrc.push(x.data);
								console.log('上传成功320')
								srcVideo=x.data;
								_this.imgUrl.push(x.data);
								if(_this.imgUrl.length>=4){
									_this.imgUrl.length=4;
								}
							},
							fail:(err)=>{
								console.log('传输shibai')
								_this.isShow=true;
								_this.title1='传输失败，请重新上传！';															
								console.log(err)
							}
						});
						//显示进度
						uploadTask.onProgressUpdate((res) => {
							_this.progressShow=true;
							// console.log('上传进度' + res.progress);
							if(res.progress>=100 && srcVideo!=''){
								_this.progress='上传成功！';
								setTimeout(function(){
									_this.progressShow=false;						
								},1000)
							}							
						});
					}
				});
				        
			},
			chooseImage: async function() {			
				var current;
				current=4-this.imgUrl.length;
				uni.chooseImage({
					sourceType: ['album','camera'], 
					sizeType: ['original', 'compressed'],
					count: current,
					success: (res) => {
						this.imageList = this.imageList.concat(res.tempFilePaths);						
						if(this.imageList.length>=4){
							this.imageList.length=4;
						}
						var _this=this;
						// 上传图片   开始
						const tempFilePaths = res.tempFilePaths;
						tempFilePaths.forEach(function(item, index){
							uni.uploadFile({
								url:getApp().globalData.api+ '/Check/UploadFile',    //上传图片接口
								filePath: item,
								name: 'img',
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
						});
						// 上传图片 结束
					},
					fail: (err) => {			//未编写代码			
						if (err['code'] && err.code !== 0 ) {
							// this.checkPermission(err.code);
						}						
					}
				})
			},
			previewImage: function(e) {       //预览图片
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},			
			prew(src){
				// console.log(src) 
				uni.navigateTo({
					url:'./video?src='+src
				})
			},
			choose(){
				var _this=this;
				if(_this.imgUrl.length==4){
					uni.showToast({
					    title: '最多可以上传4张图片或视频！',
						icon:'none',
					    duration: 1500
					});			
				}else{
					uni.showActionSheet({
					    itemList: ['拍摄视频', '相册或拍照'],					
					    success: function (res) {						
							if(res.tapIndex==0){
								console.log('拍摄视频')
								_this.chooseVideo()
							}else if(res.tapIndex==1){
								_this.chooseImage()							
							}
					    },
					    fail: function (res) {
					        console.log(res.errMsg);
					    }
					});
				}				
			}
		},
		onLoad:function(option){
			// console.log(option)
			this.ID=option.ID;           //ID 是信息ID
			this.status=option.Status;
			this.arr=[];
			this.drr=[];
			var _this=this;
			uni.request({          //获取场所名称 信息列表
				url:getApp().globalData.api+ '/Religious/ReligiousList',
				data:{
					Account:getApp().globalData.userName,
					Password:getApp().globalData.userPwd,
					StreetID:-1,
					ReligName:'',
					PageNum:0,
					PageSize:100
				},
				success(res) {
					if(res.data.code==0){
						console.log('成功获得场所信息')
						for (var i = 0; i < res.data.data.length; i++){
							_this.crr.push(res.data.data[i].ID);
							_this.brr.push(res.data.data[i].ReligName);
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
			uni.request({          //获取事件分类 信息列表
				url:getApp().globalData.api+ '/Report/GetReportEventList',
				data:{
					Account:getApp().globalData.userName,
					Password:getApp().globalData.userPwd
				},
				success(res) {					
					if(res.data.code==0){
						console.log('成功收到事件分类')
						for (var i = 0; i < res.data.data.length; i++){
							_this.drr.push(res.data.data[i].ID);
							_this.arr.push(res.data.data[i].ItemName);
						}
					}else if(res.data.code==1){
						console.log('失败收到事件分类')
					}else if(res.data.code==-1){
						console.log('用户名或密码错误')
					}
				},
				fail(res) {
					console.log(res)
				}
			});
		},
		mounted() {
			var _this=this;
			uni.request({      //根据信息ID返回上报信息的详细信息。第九接口
				url:getApp().globalData.api+ '/Report/GetReportDetatil',
				data:{
					Account:getApp().globalData.userName,
					Password:getApp().globalData.userPwd,
					ID:this.ID             //信息ID
				},
				success(res) {					
					if(res.data.code==0){
						console.log('成功11')
						_this.index=_this.arr.indexOf(res.data.data[0].EventCategory);
						_this.index1=_this.crr.indexOf(res.data.data[0].ReligiousInfoID);
						_this.address=res.data.data[0].InformPlace;
						_this.Remark=res.data.data[0].Remark;						
						_this.today=_this.getDate(res.data.data[0].AddTime);
						_this.time=_this.getTime(res.data.data[0].AddTime).slice(0,5);
						if(res.data.data[0].PhotoUrl!=null){
							var array=res.data.data[0].PhotoUrl.split(',');
							for (var i = 0; i < array.length; i++) {
								_this.imgUrl[i]=array[i];
								var videoIndex=array[i].indexOf('mp4');
								array[i]=getApp().globalData.imgUrl+array[i];
								if(videoIndex==-1){
									_this.imageList.push(array[i])
								}else{
									_this.videoSrc.push(array[i])
								}
							}	
							console.log(_this.imgUrl)
						}
					}else if(res.data.code==1){
						console.log('失败1')
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
</script>

<style>	
.header,
	.textarea{ 
		width: 100%;
		padding: 20rpx 30rpx;
		background-color: #fff;		
	}
	.header>view{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	picker,
	.address{
		width: 480rpx;
		color:#868686;
		font-size: 14px;
	}
	.header view.tit{
		/* min-width: 160rpx; */
		font-weight: 500;
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
		width: 100%;
		height:150rpx;
		color:#333;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 14px;
	}
	.textarea .tit{
		line-height: 60rpx;
	}
	.addImg{
		width: 120rpx;height:120rpx;
		cursor:pointer;
		margin-left: 10rpx;
		margin-top: 16rpx;
	}	
	.imgShow{
		display: flex;
		/* flex-wrap: wrap; */
	}
	.tj{
		width: 100%;
		position: absolute;
		bottom: 0;
		padding: 20rpx 30rpx;
	}
	.submit{
		margin-bottom: 20rpx;
	}
	/* 删除按钮 */
	.times{
		display: inline-block;
		width: 32rpx;height:32rpx;
		text-align: center;
		line-height: 30rpx;
		position: relative;
		font-size: 18rpx;
		top:-16rpx;left:-14rpx;
		background-color: #f00;
		border-radius: 50%;
		color:#fff;
		z-index: 11;
	}
	.prew{
		width: 120rpx;height:120rpx;		/* position:relative; */
		border-radius:10rpx;
		background-color: #000000;
		z-index: 10;
		margin: 0 10rpx;
	}
	.play{
		width: 0;height: 0;
		border:solid 20rpx #fff;
		border-top: solid 20rpx transparent;
		border-bottom: solid 20rpx transparent;
		border-right: none;
		margin: 0 auto;
		line-height: 120rpx;
		position: relative;
		top:40rpx;
	}
	/* // 模态框  样式 */
	.model{
		position: fixed;
		top:0;left:0;
		z-index: 12;
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
	/* 上传进度 */
	.pro{
		position: fixed;
		z-index: 15;
		width: 80%;height:60rpx;
		opacity:0.8;
		top:50%;left:50%;
		margin-top: -30rpx;
		margin-left: -40%;
		text-align: center;
		font-size: 36rpx;
		color:#f00;
	}
</style>


