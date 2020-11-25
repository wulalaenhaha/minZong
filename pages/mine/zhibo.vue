<template>
	<view class="zhibo">
		<!-- 推流 -->
		<view id="vo"></view>
		
		<!-- 拉流播放 -->
		<view id="videoplayer">
			
		</view>
		
		<view class="cl">
			<button type="primary" size="mini" @click="chushi()">初始化开始直播</button>
			<!-- <button type="primary" size="mini" @click="start()">得到pusher</button>
			<button type="primary" size="mini" @click="stop()">停止直播</button> -->
		</view>
		<!-- <view class="cl">
			<button type="primary" size="mini" @click="pause()">暂停直播</button>
			<button type="warn" size="mini" @click="qiehuan()">切换摄像头</button>
			<button type="primary" size="mini" @click="resume()">恢复直播</button>
		</view> -->
		<view class="cl">
			<button type="primary" size="mini" @click="close()">关闭直播</button>
			
		</view>
	</view>
</template>

<script>
	export default {
		data(){                  //数据区
			return {
				timeout:'',   //定时器  
				userName: '点击登录', 
				pusher:null,
				player:null,
				userid:'',              //用户userID，登录时获得
				religid:'',              //场所  ID，登录时获得
				vid:'',                 // 视频 任务id
				url:'',                  //推流地址     onshow 里面 得到
				url1:'http://zhmzrtc.hebei.org.cn/ZhiBoService.aspx',
				getplayUrl:'http://zhmzrtc.hebei.org.cn/ZhiBoService.aspx',  // 播放地址
				playUrl:'',            //播放地址
 			}
		},
		onShow() {
			//获取后台传回的  推流地址	
			console.log('onshow=')
			this.userid=getApp().globalData.userID;
			this.religid=getApp().globalData.userylyid;
			this.timeout='';
			uni.request({
			    url: this.url1,
			    data: {                        //请求的参数
			       userid:this.userid,
				   action:'getpushurl',
				   religid:this.religid
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
		mounted() {              //钩子函数    挂载完成后   // 创建推流
			// #ifdef APP-PLUS   			 
			const currentWebview = this.$mp.page.$getAppWebview()
			this.pusher = plus.video.createLivePusher("vo", {    
			url:this.url,
			top:'0px',    
			left:'0px',    
			width: '100%',    
			height: '400px',    
			position: 'static'    
			});
			currentWebview.append(this.pusher);
			setTimeout(()=>{
				this.pusher.start(()=>{
					console.log('Start pusher success!');
				}, function(e){
					console.log('Start pusher failed: '+JSON.stringify(e));
				});
			},200)
			
			// #endif	
			
		},		
		methods:{                //方法区
			
			chushi(){             //初始化  开始直播
				console.log('开始直播')
				// #ifdef APP-PLUS
				console.log('this.pusher=',this.pusher)
				// this.pusher.start(()=>{
				// 	console.log('Start pusher success!');
					
					// this.timeout=setTimeout(()=>{
						this.play(this.userid,'recordstart',this.religid);
					// },300);
					
					console.log('得到ID');
				// }, function(e){
				// 	console.log('Start pusher failed: '+JSON.stringify(e));
				// });
				
				// var _this=this;
							
				console.log('开始1')
				// #endif	
				
			},
			qiehuan(){        //切换摄像头
				// #ifdef APP-PLUS
				this.pusher.switchCamera();
				console.log('切换摄像头')
				// #endif
			},
			close(){         //关闭直播推流
				// #ifdef APP-PLUS
				this.pusher.close();
				this.playstop(this.userid,'recordend',this.religid,this.vid);
				// this.player.close();
				console.log('关闭直播推流')
				// #endif
				this.url='';
				this.pusher='';
				this.vid='';
				this.playUrl='';
			},
			play(userid,action,religid){      // 开始 直播
				uni.request({
				    url: this.url1,
				    data: {                        //请求的参数
				       userid:userid,
					   action:action,
					   religid:religid
				    },
				    success: (res) => {           //请求成功
						console.log('直播任务id=',res.data)
						this.vid=res.data;
				    },
					fail: (res) => {              //请求失败
					    console.log('请求失败');
					}
				});
			},
			playstop(userid,action,religid,vid){                     // 停止 直播
				uni.request({
				    url: this.url1,
				    data: {                        //请求的参数
				       userid:userid,
					   action:action,
					   religid:religid,
					   taskid:vid
				    },
				    success: (res) => {           //请求成功						
						console.log('直播停止成功与否=》',res.data)
				    },
					fail: (res) => {              //请求失败
					    console.log('请求失败');
					}
				});
			}
			
		}
		
	}
</script>

<style>
	.zhibo{
		width: 100%;height:100%;
		margin: 30rpx auto;
	}
	#vo{
		width: 100%;height:800rpx;
		background-color: #000000;
		opacity: 0.1;
	}
	.cl{
		text-align: center;
		display: flex;
		justify-content: space-around;
		margin-top: 30rpx;
	}
	#videoplayer{
	}
</style>
