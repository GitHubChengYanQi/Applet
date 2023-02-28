<template>
	<view class="">
		<Uploader name="images" :file-list="fileList" :deletable="true" max-count="5" use-before-read
			@before-read="uploader" @delete="doDelete" v-model="formData.images" file />
	</view>
</template>

<script>
	import Uploader from '../../../../../../components/Uploader/index.vue';
	export default {
		name:"fileId",
		components:{
			Uploader
		}
	}
</script>

<style>
</style>