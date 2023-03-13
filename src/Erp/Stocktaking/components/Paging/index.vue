<template>
	<view class="box">
		<view class="bread">
		<uni-breadcrumb separator="/">
			<uni-breadcrumb-item>
				1111
			</uni-breadcrumb-item>
			<uni-breadcrumb-item>
				222
			</uni-breadcrumb-item>
		</uni-breadcrumb>
		</view>
		<u-radio-group placement="column" shape='square'>
			<u-cell-group>

				<u-cell title="个人设置">
					<view slot="value">
						<u-radio></u-radio>
					</view>
				</u-cell>
				<u-cell title="个人设置">
					<view slot="value">
						<u-radio></u-radio>
					</view>
				</u-cell>
				<u-cell title="个人设置">
					<view slot="value">
						<u-radio></u-radio>
					</view>
				</u-cell>
				<u-cell title="个人设置">
					<view slot="value">
						<u-radio></u-radio>
					</view>
				</u-cell>
				</u-cell-group>
		</u-radio-group>
		
	</view>
</template>

<script>
	export default{
		name: 'Paging',
	}
</script>

<style lang="scss">
	.box{
		background-color: #fff;
	}
	.bread{
		height: 35px;
		line-height: 35px;
		padding: 0 12px;
	}
</style>
