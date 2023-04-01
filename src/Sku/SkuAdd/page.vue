<template>
	<view>
		<Card title="新增物料">
			<uni-forms ref="form" :modelValue="formData">

				<uni-forms-item labelWidth="120px" label="物料分类" class="a">
					<view :class="Object.keys(checked).length>0?'grey2':'grey'" @click="showPopup">
						{{title}}
						<uni-icons type="forward" size="15"></uni-icons>
					</view>
					<van-popup :show="show" round position="bottom"  @close="onClose" closeable>
						<van-cascader  :options="cateGoryData" @finish="onFinish" :closeable="false" value='checked'/>
					</van-popup>
				</uni-forms-item>
			<template v-for="item in typeSetting" v-if="item.key!='spuClass'" >
				<uni-forms-item labelWidth="120px" :label="item.filedName" :name="item.key" :key="item.key">
					<Batch v-if="item.key=='batch'" :placeholder="item.filedName"  v-model="formData.batch"></Batch>
					<Brandids v-if="item.key=='brandIds'" :placeholder="item.filedName"></Brandids>
					<Color v-if="item.key=='color'" :placeholder="item.filedName" v-model="formData.color"></Color>
					<Drawing v-if="item.key=='drawing'" :placeholder="item.filedName"></Drawing>
					<FileId v-if="item.key=='fileId'" :placeholder="item.filedName"></FileId>
					<HeatTreatment v-if="item.key=='heatTreatment'" :placeholder="item.filedName" v-model="formData.heatTreatment"></HeatTreatment>
					<UploadImages v-if="item.key=='images'" :placeholder="item.filedName"></UploadImages>
					<Level v-if="item.key=='level'" :placeholder="item.filedName" v-model="formData.level"></Level>
					<MaintenancePeriod v-if="item.key=='maintenancePeriod'" :placeholder="item.filedName" v-model="formData.maintenancePeriod"></MaintenancePeriod>
					<MaterialId v-if="item.key=='materialId'" :placeholder="item.filedName"></MaterialId>
					<Model v-if="item.key=='model'" :placeholder="item.filedName" v-model="formData.model"></Model>
					<NationalStandard v-if="item.key=='nationalStandard'" :placeholder="item.filedName" v-model="formData.nationalStandard"></NationalStandard>
					<Packaging v-if="item.key=='packaging'" :placeholder="item.filedName" v-model="formData.packaging"></Packaging>
					<PartNo v-if="item.key=='partNo'" :placeholder="item.filedName" v-model="formData.partNo"></PartNo>
					<Remarks v-if="item.key=='remarks'" :placeholder="item.filedName" v-model="formData.remarks"></Remarks>
					<Sku v-if="item.key=='sku'" :placeholder="item.filedName" v-model="formData.sku"></Sku>
					<SkuSize v-if="item.key=='skuSize'" :placeholder="item.filedName" v-model="formData.skuSize"></SkuSize>
					<Specifications v-if="item.key=='specifications'" :placeholder="item.filedName" v-model="formData.specifications"></Specifications>
					<Spu v-if="item.key=='spu'" :placeholder="item.filedName" v-model="formData.spu"></Spu>
					<SpuCoding v-if="item.key=='spuCoding'" :placeholder="item.filedName" v-model="formData.spuCoding"></SpuCoding>
					<Standard v-if="item.key=='standard'" :placeholder="item.filedName" v-model="formData.standard"></Standard>
					<UnitId v-if="item.key=='unitId'" :placeholder="item.filedName" v-model="formData.unitId"></UnitId>
					<ViewFrame v-if="item.key=='viewFrame'" :placeholder="item.filedName" v-model="formData.viewFrame"></ViewFrame>
					<Weight v-if="item.key=='weight'" :placeholder="item.filedName" v-model="formData.weight"></Weight>
				</uni-forms-item>
			</template>
			</uni-forms>
			<button @click="formSubmit" type="primary" v-if="typeSetting.length>0">保存</button>
		</Card>
	</view>
</template>

<script>
	import {
		getLocalParmas
	} from "../../util/Tools";
	import Card from '../../components/Card';
	import {
		request
	} from 'MES-Apis/lib/Service/request';
	import Brandids from "../components/field/brand-ids";
	import Batch from "../components/field/batch";
	import Color from "../components/field/color";
	import Drawing from "../components/field/drawing";
	import FileId from "../components/field/fileId";
	import HeatTreatment from "../components/field/heat-treatment";
	import UploadImages from "../components/field/images";
	import Level from "../components/field/level";
	import MaintenancePeriod from "../components/field/maintenance-period";
	import MaterialId from "../components/field/material-id";
	import Model from "../components/field/model";
	import NationalStandard from "../components/field/nationalStandard";
	import Packaging from "../components/field/packaging";
	import PartNo from "../components/field/partNo";
	import Remarks from "../components/field/remarks";
	import Sku from "../components/field/sku";
	import SkuSize from "../components/field/skuSize";
	import Specifications from "../components/field/specifications";
	import Spu from "../components/field/spu";
	import SpuCoding from "../components/field/spuCoding";
	import Standard from "../components/field/standard";
	import UnitId from "../components/field/unitId";
	import ViewFrame from "../components/field/viewFrame";
	import Weight from "../components/field/weight";

	export default {
		components: {
			Card,
			Batch,
			Brandids,
			Color,
			Drawing,
			FileId,
			HeatTreatment,
			UploadImages,
			Level,
			MaintenancePeriod,
			MaterialId,
			Model,
			NationalStandard,
			Packaging,
			PartNo,
			Remarks,
			Sku,
			SkuSize,
			Specifications,
			Spu,
			SpuCoding,
			Standard,
			UnitId,
			ViewFrame,
			Weight
		},
		computed:{
			title(){
				return Object.keys(this.checked).length>0?this.checked.text:"请选择所属分类";
			},
		},
		mounted() {
			// getToken("123.jpg");
      this.getCateGory();
		},
		data() {
			return {
				typeSetting:[],
				fieldNames: {
					text: 'title',
					value: 'key',
					children: 'children'
				},
				cateGoryData:[],
				formData: {
					sku:[]
				},
				testValue: "",
				show: false,
				fileList: [],
				columns: [

				],
				checked:{}
			}
		},
		methods: {
			//spuClassification/treeView
			async getCateGory() {
				const response = await request({
					url: "/spuClassification/treeView",
					method: "POST",
					data: {
						isNotproduct: 1
					}
				});
				const {
					data
				} = response;
				this.cateGoryData = this.format(data);
				console.log(this.cateGoryData);
				// this.cateGoryData = data;
			},
			format(data){
				const list=[];
				for(var i=0;i<data.length;i++){
					const item = data[i];
					const obj = {
						text:item.title,
						value:item.key
					}
					if(item.children.length>0){
						obj.children = this.format(item.children);
					}
					list.push(obj);
				}
				return list;
			},
			formSubmit() {
				this.$refs.form.validate().then((err,formData) => {
					console.log(this.formData)
					console.log('表单数据信息：', err);
					console.log('表单数据信息：', formData);
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			},
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
				uni.navigateTo({
					url: `/pages/login/index?backUrl=${getLocalParmas().route}`,
				});
			},
			logined() {
				this.getCateGory();
			},
			async getDetail(spuClassificationId){
				return request({
					url:"/spuClassification/detail",
					method:"POST",
					data:{
						spuClassificationId
					}
				});
			},
			async onFinish(e) {
				console.log(e);
				this.show = false;
				console.log(e.detail);
			    const { selectedOptions, value } = e.detail;
				console.log(e.detail);
				this.checked = selectedOptions[0];
				const response = await this.getDetail(value);
				const {data} = response;
				this.typeSetting = JSON.parse(data.typeSetting);
			  },
		},
	}
</script>

<style lang="scss">
	.grey {
		color: #ccc;
		line-height: 36px;
	}
	.grey2 {
		color: #434343;
		line-height: 36px;
	}

	.space {
		height: 3px;
	}

	.choice {
		display: flex;
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
