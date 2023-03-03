<template>
	<view class="">
		<Uploader name="images" :file-list="fileList" :deletable="true" max-count="5" use-before-read
			@before-read="uploader" @delete="doDelete" v-model="formData.images" />
	</view>
</template>

<script>
	import Uploader from '../../../../../../components/Uploader/index.vue';
	export default {
		name:"drawing",
		components:{
			Uploader
		}
	}
</script>

<style>
</style>