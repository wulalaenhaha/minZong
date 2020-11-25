<template id="my-time">
	<view class="time">
		<picker mode="date" :value="date" fields="day" :start="start" :end="end" @change="bindDateChange">
			<view class="">时间：<text>{{date}}</text></view>
		</picker>
		<view class="time_img">
			<image src="../static/mine/jiantou.png" mode="aspectFit"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-time",
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				date: currentDate,
				start: '',
				end: ''
			}
		},
		methods: {
			bindDateChange: function(e) {
				this.date = e.target.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			}
		},
		// computed: {
		//         start() {
		//             return this.getDate('start');
		//         },
		//         end() {
		//             return this.getDate('end');
		//         }
		//     },
	}
</script>

<style scoped lang="scss">
	.time {
		width: 100%;
		height: 90rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #FFFFFF;

		picker {
			width: 96%;
			display: flex;
			justify-content: space-between;
			text{
				margin-left: 20rpx;
				font-size: 14px;
				color: #868686;
			}
		}

		.time_img {
			width: 25rpx;
			height: 40rpx;
			text-align: center;
			image {
				width: 100%;
				height: 80%;
			}
		}
	}
</style>
