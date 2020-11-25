<template>
	<view class="place">
		<map style="width: 100%; height: 300px;" 
		:latitude="latitude" :longitude="longitude" show-location="true"
		:markers="covers" @tap="choose()">
		</map>
		<view class="place_info">
			<view class="name">场所名称：{{name}}</view>
			<view>纬度：{{latitude}}</view>
			<view>经度：{{longitude}}</view>
		</view>
		<view class="tj">
			<button type="primary" class="submit" @tap="submit">提 交</button>
			<!-- <button type="primary" class="submit">提 交</button> -->
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				ID:0,        //场所ID
				name:'',
				latitude: 39.909,       //纬度
				longitude: 116.39742,   //经度
				covers: [{
					id:'',
					title:'',
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: '../../../static/index/location_1.png',
				}],
				
			}
		},
		methods:{
			submit(){
				this.ID=getApp().globalData.userylyid
				console.log(this.latitude,this.longitude)
				uni.request({
					url:getApp().globalData.api+ '/Religious/UpdateReligiousPosition',
					data:{
						Account:getApp().globalData.userName,
						Password:getApp().globalData.userPwd,						
						ReligID:this.ID,
						MapX:this.latitude,
						MapY:this.longitude
					},
					success(res) {
						if(res.data.code==0){
							console.log("提交成功")
						}else if(res.data.code==1){
							console.log('失败')
						}else if(res.data.code==-1){
							console.log('用户名或密码错误')
						}
					}
				})
			},
			choose(){
				uni.chooseLocation({
					success:(res)=> {
						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
						this.title=res.name
						this.name=res.address
						// this.name=res.name
						this.latitude=res.latitude
						this.longitude=res.longitude
						
						this.covers[0].longitude=res.longitude;  //改变地图图标位置
						this.covers[0].latitude=res.latitude;
						
					}
				})
			}
		},
		mounted() {
			var _this=this
			uni.getLocation({
			    type: ' wgs84',    // wgs84 gps定位坐标   gcj02 返回国测局坐标，
				geocode:true,
			    success: function (res) {
			        console.log('当前位置的经度：' + res.longitude);
			        console.log('当前位置的纬度：' + res.latitude);
					_this.longitude=res.longitude
					_this.latitude=res.latitude
					var point = new plus.maps.Point(res.longitude, res.latitude);
					plus.maps.Map.reverseGeocode(
						point,
						{},
						function(event) {
							var address = event.address; // 转换后的地理位置
							var point = event.coord; // 转换后的坐标信息
							var coordType = event.coordType; // 转换后的坐标系类型
							_this.name=address				
							_this.covers[0].longitude=event.coord.longitude;  //改变地图图标位置
							_this.covers[0].latitude=event.coord.latitude;
							console.log(address, 'address');
							// var reg = /.+?(省|市|自治区|自治州|县|区)/g;
							
							// console.log(address.match(reg));
							// _this.addressList=address.match(reg).toString().split(",");
							// _this.address= _this.addressList[1];
							// console.log(_this.addressList[0]);
							// console.log(_this.addressList[1]);
							// console.log(_this.addressList[2]);
							
						},
						function(e) {}
					);
			    }
			});
		}
	}
</script>

<style scoped lang="scss">
	.place{
		width: 100%;
		height: 100%;
		background-color: #F5F5F5;
		.place_info{
			width: 100%;
			padding: 15rpx 30rpx;
			background-color: #FFFFFF;
			view{
				line-height: 50rpx;
			}
		}
		.tj{
			width: 100%;
			position: absolute;
			bottom: 0;
			padding: 20rpx 30rpx;
			.submit{
				margin-bottom: 20rpx;
			}
		}
		
	}
</style>
