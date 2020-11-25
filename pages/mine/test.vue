<template>
	<view @tap="a">123</view>
</template>

<script>
	export default {
		data(){
			return{
				id:''
			}
		},
		onLoad:function(option){
			console.log(option)
			this.id=option.userID
		},
		methods:{
			a(){
				console.log(this.id)
			}
		}
	}
</script>

<style>
</style>
