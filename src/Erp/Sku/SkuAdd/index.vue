<template>
	<view>
		<form @submit="formSubmit" @reset="formReset">
		<Card title="物料分类">
			<template v-slot:extra>
				<view class="">
					<view class="grey" @click="showPopup">
						请选择所属分类
						<uni-icons type="forward" size="15"></uni-icons>
					</view>
					<van-popup :show="show" round position="bottom" custom-style="height: 30%;" @close="onClose">
						<van-picker :columns="columns" @cancel="onCancel" @change="onChange" value-key="text"
							show-toolbar />
					</van-popup>
				</view>
			</template>
		</Card>

		<view class="space"></view>

		<Card title="物料编码">
			<template v-slot:extra>
				<view class="choice">
					<view @click="showPopup">
						自定义
						<uni-icons type="forward" size="15"></uni-icons>
					</view>
				</view>
			</template>
		</Card>

		<view class="space"></view>

		<Card title="产品名称">
			<template v-slot:extra>
				<input class="uni-input" placeholder="请输入产品名称" placeholder-style="color:#ccc" />
			</template>
		</Card>

		<view class="space"></view>

		<Card title="产品码">
			<template v-slot:extra>
				<input class="uni-input" placeholder="请输入产品码" placeholder-style="color:#ccc" />
			</template>
		</Card>

		<view class="space"></view>

		<Card title="单位">
			<template v-slot:extra>
				<view class="choice">
					<view class="grey" @click="showPopup">
						请选择单位
						<uni-icons type="forward" size="15"></uni-icons>
					</view>
				</view>
			</template>
		</Card>

		<view class="space"></view>

		<Card title="二维码生成方式">
			<template v-slot:extra>
				<view class="choice">
					<view class="grey" @click="showPopup">
						请选择二维码生成方式
						<uni-icons type="forward" size="15"></uni-icons>
					</view>
				</view>
			</template>
		</Card>

		<view class="space"></view>

		<Card title="规格">
			<template v-slot:extra>
				<input class="uni-input" placeholder="请输入产品码" placeholder-style="color:#ccc" />
			</template>
		</Card>

		<view class="space"></view>

		<Card title="养护周期">
			<template v-slot:extra>
				<view class="choice">
					<input class="uni-input" placeholder="请输入养护周期" placeholder-style="color:#ccc" />
					<span class='company'>天</span>
				</view>
			</template>
		</Card>

		<view class="space"></view>

		<Card title="物料描述">
			<template v-slot:extra>
				<view class="choice">
					<view class="grey" @click="showPopup">
						添加
						<uni-icons type="forward" size="15"></uni-icons>
					</view>
				</view>
			</template>
		</Card>

		<view class="space"></view>

		<Card title="品牌">
			<template v-slot:extra>
				<view class="choice">
					<view class="grey" @click="showPopup">
						请输入品牌
						<uni-icons type="forward" size="15"></uni-icons>
					</view>
				</view>
			</template>
		</Card>

		<view class="space"></view>

		<Card title="图片">
			<Uploader :file-list="fileList" :deletable="true" max-count="5" use-before-read
				@before-read="uploader" @delete="doDelete"/>
		</Card>

		<view class="space"></view>

		<Card title="附件">
			<template v-slot:extra>
				<view class="choice">
					<van-uploader>
						<uni-icons type="paperclip" size="20"></uni-icons>
					</van-uploader>
				</view>
			</template>
		</Card>

		<view class="space"></view>

		<Card title="型号">
			<template v-slot:extra>
				<input class="uni-input" placeholder="请输入型号" placeholder-style="color:#ccc" />
			</template>
		</Card>

		<view class="space"></view>

		<Card title="材质">
			<template v-slot:extra>
				<view class="choice">
					<view class="grey" @click="showPopup">
						请输入材质
						<uni-icons type="forward" size="15"></uni-icons>
					</view>
				</view>
			</template>
		</Card>

		<view class="space"></view>

		<Card title="重量">
			<template v-slot:extra>
				<view class="choice">
					<input class="uni-input" placeholder="请输入重量" placeholder-style="color:#ccc" />
					<span class='company'>kg</span>
				</view>
			</template>
		</Card>

		<view class="space"></view>

		<Card title="尺寸">
			<template v-slot:extra>
				<view class="choice">
					<view class="size">
						<input class="uni-input2" placeholder="长" placeholder-style="color:#ccc" />
						<span class='company2'>mm</span>
					</view>
					<span class='symbol'>×</span>
					<view class="size">
						<input class="uni-input2" placeholder="宽" placeholder-style="color:#ccc" />
						<span class='company2'>mm</span>
					</view>
					<span class='symbol'>×</span>
					<view class="size">
						<input class="uni-input2" placeholder="高" placeholder-style="color:#ccc" />
						<span class='company2'>mm</span>
					</view>
				</view>
			</template>
		</Card>

		<view class="space"></view>

		<Card title="表色">
			<template v-slot:extra>
				<input class="uni-input" placeholder="请输入表色" placeholder-style="color:#ccc" />
			</template>
		</Card>

		<view class="space"></view>

		<Card title="级别">
			<template v-slot:extra>
				<input class="uni-input" placeholder="请输入级别" placeholder-style="color:#ccc" />
			</template>
		</Card>

		<view class="space"></view>

		<Card title="热处理">
			<template v-slot:extra>
				<input class="uni-input" placeholder="请输入热处理" placeholder-style="color:#ccc" />
			</template>
		</Card>

		<view class="space"></view>

		<Card title="包装方式">
			<template v-slot:extra>
				<input class="uni-input" placeholder="请输入包装方式" placeholder-style="color:#ccc" />
			</template>
		</Card>

		<view class="space"></view>

		<Card title="图幅">
			<template v-slot:extra>
				<input class="uni-input" placeholder="请输入图幅" placeholder-style="color:#ccc" />
			</template>
		</Card>

		<view class="space"></view>

		<Card title="备注">
			<uni-easyinput type="textarea" autoHeight placeholder="请输入备注"></uni-easyinput>
		</Card>

		<view class="space"></view>

		</form>
	</view>
</template>

<script>
	import {
		getLocalParmas
	} from "../../../util/Tools";
	import Card from '../../../components/Card';
	import {
		request
	} from 'MES-Apis/uitl/Service/request';
	import Uploader from '../../../components/Uploader'
	var citys = [{
			id: 111,
			'text': '杭州'
		},
		{
			id: 222,
			'text': '宁波'
		},
		{
			id: 333,
			'text': '温州'
		},
		{
			id: 444,
			'text': '嘉兴'
		},
		{
			id: 555,
			'text': '湖州'
		},
	];
	var country = {
		'杭州': [{
				id: 111,
				'text': '国杭州'
			},
			{
				id: 222,
				'text': '国宁波'
			},
			{
				id: 333,
				'text': '国温州'
			},
			{
				id: 444,
				'text': '国嘉兴'
			},
			{
				id: 555,
				'text': '国湖州'
			},
		],
		'宁波': [{
				id: 111,
				'text': '中杭州'
			},
			{
				id: 222,
				'text': '中宁波'
			},
			{
				id: 333,
				'text': '中温州'
			},
			{
				id: 444,
				'text': '中嘉兴'
			},
			{
				id: 555,
				'text': '中湖州'
			},
		]
	}

	export default {
		components: {
			Card,
			Uploader
		},
		mounted() {
			// getToken("123.jpg");
		},
		data() {
			return {
				show: false,
				fileList: [],
				columns: [{
						values: citys, //可以是数组，或者对象数组
						className: 'column1' //选择器的第一列
					},
					{
						values: country['杭州'], //默认选中country对象中的第一项
						className: 'column2', //选择器的第二列
					}
				]
			}
		},
		methods: {

			showPopup() {
				this.show = true;
			},
			onClose() {
				this.show = false
			},
			onChange(picker, values) {
				//在change 第一列的时候，动态更改第二列的数据
				//setColumnValues是vant自带的实例方法
				//第一个参数是列数，从0开始；第二个参数是第二列应该显示的数据
				picker.setColumnValues(1, country[values[0]]);
			},
			onCancel() {
				this.show = false
			},
			notLogin() {
				uni.redirectTo({
					url: `/pages/login/index?backUrl=${getLocalParmas().route}`,
				});
			}
		},
	}
</script>

<style lang="scss">
	.grey {
		color: #ccc;
	}

	.space {
		height: 3px;
	}

	.choice {
		display: flex;
	}

	.uni-input {
		text-align: right;
	}

	.uni-input2 {
		width: 30px;
		padding-top: 2px;
	}

	.size {
		border: 1px solid #ccc;
		display: flex;
		padding: 0 10px;
		margin: 0 5px;
	}

	.symbol {
		line-height: 30px;
	}

	.company {
		font-size: 14px;
		padding-top: 2px;
		line-height: 18px;
		padding-left: 5px;
		color: #ccc;
	}

	.company2 {
		font-size: 14px;
		padding-top: 2px;
		line-height: 22px;
		padding-left: 5px;
		color: #ccc;
	}
</style>
