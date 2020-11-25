<template>
	<!-- 视频    民宗局和场所-->
    <view class="content">		
		<view class="butlist">
			<view @click="back" class="buticon martp10">
				<image src="../../../static/img/back2.png"></image>	
				<view class="mar10">返回</view>				
			</view>
			
			<view class=" buticon" @click="startPusher">
				<view class="x_f"></view>
				<view :class="begin==true?'givebegin':'give'" >{{contTime}}</view>
				<view class="pulse" v-if="begin"></view>
			</view>
			
			<view @click="switchCamera" class="buticon martp10">
				<image src="../../../static/img/reversal.png"></image>	
				<view class="mar10">翻转</view>				
			</view>
			
		</view>
		<!-- 播放组件 -->
		<video class="playvideo" show-play-btn="false" show-fullscreen-btn="false" autoplay :src="playurl" v-show="isshow"></video>
    </view>
	
</template>

<script>
	var wv;//计划创建的webview
    export default {
		data() {
			return {
				
				userid:'',
				religid:'',
				url1:'http://zhmzrtc.hebei.org.cn/ZhiBoService.aspx',
				url:'',			 //推流地址     onshow 里面 得到
				vid:'',     //直播任务id    
				timeout:null,
				t:false,     //判断状态
				player:null,        //拉流
				playurl:'',        //播放流地址
				isshow:false,      //视频播放组件  显示  隐藏
				
			    begin:false,//开始录制
				complete:false,//录制完毕
				currentWebview:null,
				pusher:null,
				livepushurl:'',
				logininfokey:'',//登录验证加密串，
				homeworkcont:'',//作业信息
				jiexititle:'',//作业解析标题
				index: 0,//定时
				indextu:0,//是否开启定时
				contTime:'',
				setTime:false,
				livetype:''
			}
		},
		onLoad:function(option){
			console.log(option)
			var that=this;
			that.userid=getApp().globalData.userID;
			that.religid=option.StreetID; 
			
			uni.getStorage({
				key: 'logininfokey',
				success:(res) =>{
					console.log(res.data);
					this.logininfokey=res.data
					console.log(this.logininfokey)
				}
			});
			uni.getStorage({
				key: 'clickworkcont',
				success:(res) =>{
					console.log(res.data);
					this.homeworkcont=res.data;
				}
			});
			that.getwebview()//获取webview
		},
		onShow() {
			// 提示网络
			uni.getNetworkType({
				success: function (res) {
					console.log(res.networkType);
					if(res.networkType != 'wifi'){
						uni.showModal({ //提醒用户更新
							title: '温馨提示',
							content: '当前非Wifi网络，请注意您的流量是否够用',
							success: (res) => {}
						})
					}
				}
			});
			// 提示信号差，切换网络
			uni.onNetworkStatusChange(function (res) {
				console.log(res.isConnected);
				console.log(res.networkType);
				if(res.networkType != '4g' && res.networkType != 'wifi'){
					uni.showModal({ //提醒用户更新
						title: '温馨提示',
						content: '当前网络质量差，请切换为4G网络或Wifi网络',
						success: (res) => {}
					})
				}
			});
			// this.userid=getApp().globalData.userID;
			// this.religid=getApp().globalData.userylyid;
			console.log(this.userid,this.religid)
			uni.request({           //获取推流地址
			    url: this.url1,
			    data: {                        //请求的参数
			        userid:this.userid,
				   	action:'getpushurl',
				    religid:this.religid,
					stramtype:'pc'
			    },
			    success: (res) => {           //请求成功
					console.log('数据=',res.data)
					this.url=res.data;
					console.log('this.url=',this.url)
			    },
				fail: (res) => {              //请求失败
				    console.log('请求失败');
				}
			});
		},
		onBackPress(){
			this.upload();
			console.log("BackButton Key pressed!" );
			return true;
		},
		methods: {
			//结束推流,此处需要调用后台接口向云服务商提交结束状态
			endlivepush(){
				uni.request({
				    url: this.url1,
				    data: {                     //请求的参数
				       // userid:this.userid,
					   action:'recordend',
					   religid:this.religid, 
					   taskid:this.vid,
					   stramtype:'pc'
				    },
				    success: (res) => {           //请求成功						
						console.log('直播停止成功与否=》',res.data)
						console.log('religid=',this.religid)
						console.log('userid=',this.userid)
						
						this.pusher.close();    //  停止  推流
						
						uni.removeStorage({
							key:'logininfokey'
						})
						uni.removeStorage({
							key:'clickworkcont'
						})
						// uni.navigateTo({
						// 	url:'../video/index'
						// })
						uni.reLaunch({
						    url: '../video/index'
						});
				    },
					fail: (res) => {              //请求失败
					    console.log('请求失败');
					}
				});
			}, 
			
			// 开始推流
			startPusher(){
				// 
				this.beginlivepush();
				// 开始直播任务
				this.beginZhiBo();
			}, 
			
			beginlivepush() {
				this.indextu=0;//关闭计时
		
				if(this.begin==false){//未开启推流					
					// 设置推流服务器  ***此处需要通过ajax向后端获取
						if(this.begin==false){
							// 动态更新直播推流控件的配置选项
							console.log('推流开始');
							this.pusher.setOptions({
								url:this.url ,//推流地址************* 此处设置推流地址
							});
							console.log('推流开始1111');
							this.pusher.start(()=>{
								console.log(1101111111111)
								}, function(e){
								console.log('Start pusher failed: '+JSON.stringify(e));
								console.log('t=',this.begin)
								 
							});
							uni.showToast({
								title: '正在连接',
								icon:'none',
								duration: 2000,					 
							});
							uni.request({     
								//获取播放地址
							 
							    url: this.url1,
							    data: {                        //请求的参数
							       action:'getplayurl',
								   religid:this.religid,
								   type:'rtmp',
								   // stramtype:'pc'
							    },
							    success: (res) => {           //请求成功
									console.log('获取播放流地址=',res.data)
								 
									if(res.data=="" || res.data==null){
										this.isshow=false;
										this.setTime=true;
										// setTimeou();
									 
										console.log('无返回地址')
										this.begin=false;
									}else{ 
										this.isshow=true;
										this.playurl=res.data;
										this.setTime=false;
										this.begin=true;
										console.log('有返回地址')
									}
									
									if(this.setTime){
										setTimeout(()=>{
											if(this.setTime){
												this.setTime=false
												console.log(122)
												this.beginlivepush();
											}
										},2000)
									}
							    },
								fail: (res) => {              //请求失败
								    console.log('获取播放流地址请求失败');
								}
							});
							console.log('110101010')
						}else{							
							console.log('000007777')
						}
					// //推流开启
					// uni.showToast({
					// 	title: '开始链接。。。',
					// 	icon:'none',
					// 	duration: 2000,					 
					// });
				}else{
					//提示是否上传
					this.upload()
				}
			},
			
			beginZhiBo(){
				uni.request({         // 获取vid、
				    url: this.url1,
				    data: {                        //请求的参数
				       userid:this.userid,
					   action:'recordstart',
					   religid:this.religid,
					   stramtype:'pc'
				    },
				    success: (res) => {           //请求成功
						console.log('直播任务id=',res.data)
						this.vid=res.data;
				    },
					fail: (res) => {              //请求失败
					    console.log('直播请求失败');
					}
				});
			},
			/**
			 * 获取当前显示的webview
			 */
			getwebview(){
				// #ifdef APP-PLUS				
				this.currentWebview=this.$mp.page.$getAppWebview()
				console.log('this.currentWebview=',this.currentWebview)
				this.plusReady(this.url)//创建LivePusher对象
				console.log('getwebview',this.url)
				// #endif
			},
			/**
			 * 创建LivePusher对象 即推流对象
			 */ 
			plusReady(){				
				// 创建直播推流控件
				this.pusher =new plus.video.LivePusher('pusher',{
					url:'',
					top:'0px',
					left:'0px',
					width: '100%',
					height:  uni.getSystemInfoSync().windowHeight-90 + 'px',				
					position: 'static',//static静态布局模式，如果页面存在滚动条则随窗口内容滚动,absolute绝对布局模式，如果页面存在滚动条不随窗口内容滚动； 默认值为"static"
					beauty:'0',//美颜 0-off  1-on  
					whiteness:'0',//0、1、2、3、4、5，0不使用美白，值越大美白程度越大。
					aspect:'9:16',					
				});
				//将创建的对象 追加到webview中
				this.currentWebview.append(this.pusher);
			},
			
			/**
			 * 返回
			 */
			back(){
				this.setTime=false
				this.upload();
			},
			/**
			 * 切换摄像头
			 */ 
			switchCamera() {
				this.pusher.switchCamera();
			},
			/**
			 * 是否结束推流
			 */
			upload(){
				uni.showModal({
				 	title: '温馨提示',
				 	content: '您确定关闭视频并返回主页吗？',
				 	success:(res)=> {
				 		if (res.confirm) {
				 			 console.log('用户点击完成');
							 // this.pusher.close();    //  停止  推流
							 this.endlivepush();
							 // uni.navigateBack({
							 // 	url:'./index'
							 // })
				 		} else if (res.cancel) {
				 			console.log('用户点击取消');
				 		}
				 	}
				});
			}, 
		}
	}
</script>

<style>
	#pusher,.pusher{
		z-index: -1;
	}
	.playvideo{
		position: absolute;
		top:0; 
		right:0; 
		/* bottom: 0; */
		z-index: 10000;
		width: 150px;height: 120px;
	}
	.uni-video-cover{
		z-index: 10000;
	}
	.content{
		background: #000;
		overflow: hidden;
	}
	.butlist{
		height: 140upx;
		position: absolute;
		bottom: 0;
		display: flex;
		width: 100%;
		justify-content: space-around;
	    padding-top: 20upx;
		border-top: 1px solid #fff;
	}
	.buticon{
		height: 120upx;
		width: 120upx;
		color: #fff;
		position: relative;
		text-align: center;
		margin-bottom: 20upx;
	}
	.buticon image{
		height: 64upx;
		width: 64upx;
	}
	.buticon .mar10{
		margin-top: -20upx;
	}
	.martp10{
		margin-top: 10upx;

	}
	.give {
		width: 90upx;
		height: 90upx;
		background: #F44336;	
		border-radius: 50%;
		box-shadow: 0 0 22upx 0 rgb(252, 94, 20);
	 	 position: absolute; 
		left:15upx;
		top:15upx; 
		    font-size: 44upx;
    line-height: 90upx;
	}
	.givebegin {
		width: 60upx;
		height: 60upx;
		background: #F44336;	
		border-radius: 20%;
		box-shadow: 0 0 22upx 0 rgb(252, 94, 20);
	 	 position: absolute; 
		left:30upx;
		top:30upx; 
	}
	.x_f{
		/* border: 6upx solid #F44336; */
		width: 120upx;
		height: 120upx;
		background: #fff;
		border-radius: 50%;
		position: absolute;
		text-align: center;
		top:0;
		left: 0;
	  box-shadow: 0 0 28upx 0 rgb(251, 99, 24);
	}
	
	/* 产生动画（向外扩散变大）的圆圈  */
	.pulse {
		width: 160upx;
		height: 160upx;
		position: absolute;
	    border: 12upx solid #F44336;
	    border-radius: 100%;
	    z-index: 1;
	    opacity: 0;
	    -webkit-animation: warn 2s ease-out;
	    animation: warn 2s ease-out;
	    -webkit-animation-iteration-count: infinite;
	    animation-iteration-count: infinite;
	    left: -28upx;
	    top: -28upx;
	}
		
	
	/**
	 * 动画
	 */
	@keyframes warn {
	0% {
		transform: scale(0);
		opacity: 0.0;
	}
	25% {
		transform: scale(0);
		opacity: 0.1;
	}
	50% {
		transform: scale(0.1);
		opacity: 0.3;
	}
	75% {
		transform: scale(0.5);
		opacity: 0.5;
	}
	100% {
		transform: scale(1);
		opacity: 0.0;
	}
} 
</style>
