<template>
		<van-uploader :file-list="fileList" :deletable="true" max-count="5" use-before-read @before-read="uploader"
			@delete="doDelete">
				<uni-icons type="paperclip" size="20" v-if="file" :color="color"></uni-icons>
		</van-uploader>
</template>

<script>
	import { request } from 'MES-Apis/uitl/Service/request';
	import {getLocalParmas} from "../../util/Tools";
	export default {
		name: 'Uploader',
		behaviors: ['uni://form-field'],
		props: {
			value: Array
		},
		data() {
			return {
				fileList: [],
				mediaId:[]
			}
		},
		props:{
			file:{
				type:Boolean,
				default:false
			},
			color:String
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
				const _this = this;
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
						const index = _this.fileList.findIndex(function(item) {
							return item.url == file.url
						});
						_this.fileList[index].status = 'done';
						_this.mediaId.push(oss.mediaId);
						_this.$emit("input",_this.mediaId);
					}
				});
				callback(true);
			}
		}
	}
</script>

<style>
</style>
