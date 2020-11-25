<template>
    <view class="news">
        <view class="header">
            <view class="title">{{title}}</view>
            <view class="time">{{createtime}}</view>
        </view>
        <!-- <view class="content" v-html="content">
		</view> -->
		<rich-text :nodes="content"></rich-text>
    </view>
</template>
<script>
export default {
	data() {
	  return {
			id:"",
			content:'',
			title:"",
			createtime:"",
		};
	},

	onLoad: function(options) {
		var _this=this;
		uni.request({
			url:getApp().globalData.api+ '/Regulations/RegulationsDetail',
			data:{
				Account:getApp().globalData.userName,
				Password:getApp().globalData.userPwd,
				id:options.id,
			},
			success(res) {
				
				if(res.data.code=="0"){ 
					_this.title=res.data.data[0].Title;
					_this.createtime=_this.getDate(res.data.data[0].AddTime);
					_this.content=res.data.data[0].RuleContent.replace(/\<img/g,'<img class="img-wrap" style="text-indent:none;"');
				}
			},
			fail(res) {
				console.log(res)
			}
		})
		
	},
	methods:{
		getDate(e){
			var b=e.slice(6,e.length-2);
			var day=new Date(parseInt(b));
			var date=day.getFullYear()+"-"+day.getMonth()+"-"+day.getDate();
			var time=day.getHours()+":"+day.getMinutes()+":00";
			return date+" "+time
		}
	}

}
</script>
<style>
    .news{
        width: 100%;
        padding: 0 30rpx;
        box-sizing: border-box;
        font-size: 32rpx;
        color: #484848;
    }
    .title{
        font-size: 40rpx;
        font-weight: 700;
    }
    .time{
        padding: 35rpx 0 0;
        font-size: 22rpx;
        color: #AAAAAA;
    }
    .content{
        margin-top: 30rpx;
    }
	rich-text{
		text-indent: 2em;
	}
	 .img-wrap{
		display: block;
		width: 680rpx;
	}
</style>
