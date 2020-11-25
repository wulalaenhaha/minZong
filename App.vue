<script>
	export default {
		globalData:{
			'api':'https://zhmz.hebei.org.cn/api',  
			// 'api':'http://njmz.hebei.org.cn/api',
			// 'api':'http://192.168.2.156:8081/api',
			userName:'',        //登录名
			userPwd:'',         //登录密码
			userID:'',          //登录人员ID
			imgUrl:'https://zhmz.hebei.org.cn',
			Name:'',            //登录人员名称
			code:1,            //人员类别，1为宗教人员 (分为丰南区民宗人员、乡镇民宗人员)  2为：宗教委员，3为场所人员
			quId:'',            //乡镇ID
			login:false,        //登录状态     改成false
			userylyid:-1,		//人员为场所登录人员时，获得的场所ID  改成-1
			ParentID:'',		//
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App  Show')
			
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	page{
		background-color: #f5f5f5;
		font-size: 16px;	
	}view{
		box-sizing: border-box;
	}	
	image.gt{
		width: 16rpx;height:16rpx;
		margin-left: 14rpx;
	}
</style>
