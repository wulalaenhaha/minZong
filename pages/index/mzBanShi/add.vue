
<template>
	<!-- 办事说明 ---->
	<view class="place_select">
		<!-- 巡查项目 -->		
		<form>
			<view class="header">
				<view>
					<view class="tit">标题：</view>
					<view class="con">
						<input v-model="Title" type="text" placeholder="请输入标题">
					</view>
				</view>				
			</view>
			<view class="header">
				<view>
					<view class="tit">地址：</view>
					<view class="con">
						<input v-model="Place" type="text" placeholder="请输入地址">
					</view>
				</view>				
			</view> 
			<view class="textarea">
				<view class="tit">问题说明</view>
				<view>
					<textarea name="" :disabled="code==1" class="con" id="" v-model="Content" cols="30" rows="4" placeholder="请输入问题说明..."></textarea>
				</view>
				<view class="add">
					<block v-for="(item,index) in imgUrl1" :key='index'>
						<image class="img" v-show="item[0]==''?false:true" :src="item" mode="aspectFill" @tap="previewImg(index)"></image>
						<text class="times" @tap="delImg(index)">&times;</text>
					</block>					
					<image @tap="addImg" class="addImg" src="../../../static/index/iconfont-tianjia.png"></image>
				</view>
			</view>
			<view class="tj">
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
				Title:'',
				Place:'',
				Content:'',
				imgUrl1:[],
				dataArray:[],
				id:0,           //检查项目ID
				imgUrl:[],
				showMask:true,
				ID:'',           //场所ID  
				code:''          //登录人员类别
			}
		},
		methods: {
			previewImg(index){
				uni.previewImage({
					current: index,
					urls: this.imgUrl1
				})
			},
			delImg(index){   //删除上传图片
				this.imgUrl.splice(index,1);   //选中图片列表
				this.imgUrl1.splice(index,1);  //展示图片列表
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
						sourceType: ['camera','album '], //从相册选择,还是照相，默认选择照相					
						success: (res) => {
							const tempFilePaths = res.tempFilePaths;						
							for (var i = 0; i < res.tempFilePaths.length; i++) {   //点击选中图片
								_this.imgUrl1.push(tempFilePaths[i]);
								if(_this.imgUrl1.length>=4){
									_this.imgUrl1.length=4;
								}
								uni.uploadFile({            				//上传图片
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
				var _this=this;
				if(this.Title=='' || this.Place=='' ||this.Content==''){
					uni.showModal({
						content:'标题、地址或问题说明不能为空',
					})	
				}else{
					uni.request({
						url:getApp().globalData.api+ '/OnlineWork/AddMessage',
						data:{
							Account:getApp().globalData.userName,
							Password:getApp().globalData.userPwd,
							AddMan:getApp().globalData.userID,
							Title:this.Title,
							Place:this.Place,
							Content:this.Content,
							PhotoUrl:this.imgUrl.toString()
						},
						success(res) {		
							console.log(res.data)
							if(res.data.code==0){
								uni.showToast({
								    title: '上报成功！',
									icon:'success',
								    duration: 1500,
									success() {
										setTimeout(function () {
										   uni.navigateTo({
										   	url:'./index'													
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
				}
			},
		},
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


