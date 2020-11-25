<template>
  <view class="news">
    <navigator
      url
      open-type="navigate"
      hover-class="none"
      v-for="(item,key,index) in visit"
      :key="index"
      @click="opennews(item.ID)"
    >
      <view class="content">
        <view class="left">
          <view class="title">{{item.Title}}</view>
          <view class="time">{{item.AddTime}}</view>
        </view>
        <view class="right" v-show="!item.ImageUrl?false:true">
          <img :src="item.ImageUrl" alt />
        </view>
      </view>
    </navigator>
	
	<!--  <view class="derlog" v-show="isShow">暂无数据</view> -->
  </view>
</template>
<script>
export default {
  data() {
    return {
        visit:[],
		title:"",
		type:"",
		PageNum:0,
		pageSize:10,
		// hasMoreData: true,
		isShow:true,       //暂无数据显示
    };
  },

  onLoad: function(options) {
		this.loaddata();
  },
  
  methods: {
   
	opennews(id){
		console.log(id)      //id是信息ID
		uni.navigateTo({
			url:'./zhengce-info?id='+id 
		})
	},
	
	loaddata(){
		var _this=this
		uni.request({
			url:getApp().globalData.api+ '/Regulations/RegulationsList',
			data:{
				Account:getApp().globalData.userName,
				Password:getApp().globalData.userPwd,
				PageNum:this.PageNum,
				PageSize:this.pageSize,
			},
			success(res) {
				if(res.data.code=="0"){
					var num=0;
					this.isShow=false;
					res.data.data.forEach(element => {
					  var x=element.AddTime;
					  var b=x.slice(6,x.length-2);
					  var day=new Date(parseInt(b));
					  var date=day.getFullYear()+"-"+(day.getMonth()+1)+"-"+day.getDate();
					  element.AddTime=date;
					  _this.visit.push(element);
					  num++;
					});
					this.PageNum++;
					
					if(num<_this.pageSize){
						_this.hasMoreData=false;
					}	
				}
				else{
					this.isShow=true;
					this.hasMoreData=false;
				}
			},
			fail(res) {
				console.log(res)
			}
		})
	},	
	// getDate(e){
	// 	var b=e.slice(6,e.length-2);
	// 	var day=new Date(parseInt(b));
	// 	var date=day.getFullYear()+"-"+day.getMonth()+"-"+day.getDate();
	// 	return date
	// }
  },
  onReachBottom: function () {
  		if (this.hasMoreData) {
  		  this.getData();
  		} else {
  		 uni.showToast({
  		    title: '没有更多数据',
  		  })
  		}

  }
};
</script>
<style>

.derlog{
	text-align: center;
}
/* 新闻 */
.news {
  width: 100%;
  /* margin-top: 20rpx; */
  background-color: #fff;
  padding: 0rpx 30rpx;
  box-sizing: border-box;
  color: #686868;
  font-size: 36rpx;
}
.news .content {
  width: 100%;
  padding: 10rpx 0;
  box-sizing: border-box;
  font-size: 36rpx;
  display: flex;
  justify-content: space-between;
  border-bottom: 2rpx solid #f5f5f5;
}
.time {
  font-size: 20rpx;
  color: #aaaaaa;
  display: flex;
  flex-direction: row-reverse;
}
.content .left {
  width: 100%;
  height: 100%;
  padding: 0 15rpx 0 0;
  box-sizing: border-box;
}
.content .left .title {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.content .right {
  width: 210rpx;
  height: 140rpx;
  background-color: #484848;
}
.content .right img {
  width: 100%;
  /* height: 100%; */
  /* display: block; */
}
</style>