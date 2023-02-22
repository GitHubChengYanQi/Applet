<template>
	<van-uploader :file-list="fileList" :deletable="true" max-count="5" use-before-read @before-read="uploader"
		@delete="doDelete" />
</template>

<script>
	import { request } from 'MES-Apis/uitl/Service/request';
	import {getLocalParmas} from "../../util/Tools";
	export default {
		name: 'Uploader',
		props: {
			value: Array
		},
		data() {
			return {
				fileList: [],
			}
		},
		methods: {
			getToken(fielname){
				return request({
					url: '/media/getToken',
					params: {
						type: fielname
					}

				});
			},
			doDelete(event) {
				const {
					index
				} = event.detail;
				console.log(index);
				this.fileList.splice(index, 1)
			},
			async uploader(event) {
				// console.log(event);
				const {
					file,
					callback
				} = event.detail;
				console.log(file);
				this.fileList.push({
					url: file.thumb,
					status: 'uploading'

				})
				const response = await this.getToken(file.url);
				console.log(oss);
				const oss = response.data;
				uni.uploadFile({
					url: oss.host, //仅为示例，非真实的接口地址
					filePath: file.url,
					name: 'file',
					formData: {
						...oss
					},
					success: (uploadFileRes) => {
						// console.log(uploadFileRes.data);
						const index = this.fileList.findIndex(function(item) {
							return item.url == file.url
						});
						console.log(index);
						this.fileList[index].status = 'done';
					},
					complete:()=>{
						this.$emit("change",this.fileList);
					}
				});
				callback(true);
			}
		}
	}
</script>

<style>
</style>
