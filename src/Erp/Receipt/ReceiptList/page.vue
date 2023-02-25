<template>
  <view class='process'>
    <view class='content'>
      <Create v-if="active === 'create'" />
      <MyAudit v-if="active === 'audit'" :taskSkuId='taskSkuId' />
      <MyAudit v-if="active === 'start'" :createUser='userId' />
    </view>
    <van-tabbar v-if="false" :active="active" @change="({detail})=>active = detail">
      <van-tabbar-item
          name="create"
      >
        <uni-icons slot="icon" custom-prefix="iconfont" type="icon-xinshenqing"></uni-icons>
        <uni-icons color='#1989fa' slot="icon-active" custom-prefix="iconfont" type="icon-xinshenqing"></uni-icons>
        新申请
      </van-tabbar-item>
      <van-tabbar-item name="audit">
        <uni-icons slot="icon" custom-prefix="iconfont" type="icon-shenpiguanli"></uni-icons>
        <uni-icons color='#1989fa' slot="icon-active" custom-prefix="iconfont" type="icon-shenpiguanli"></uni-icons>
        我审批的
      </van-tabbar-item>
      <van-tabbar-item name="start" icon="friends-o">
        <uni-icons slot="icon" custom-prefix="iconfont" type="icon-wofaqide1"></uni-icons>
        <uni-icons color='#1989fa' slot="icon-active" custom-prefix="iconfont" type="icon-wofaqide1"></uni-icons>
        我发起的
      </van-tabbar-item>
    </van-tabbar>
    <BottomButton
        text="出库确认"
        only
        @onClick="onClick"
    />
  </view>
</template>

<script>
import MyAudit from "./components/MyAudit";
import {getLocalParmas} from "../../../util/Tools";
import Loading from "../../../components/Loading";
import Avatar from "../../../components/Avatar";
import BottomButton from "../../../components/BottomButton";

export default {
  props: ['auth'],
  name: 'ReceiptList',
  components: {BottomButton, Avatar, Loading, MyAudit},
  data() {
    return {
      active: 'audit',
      taskSkuId: '',
      userId: '',
      loading: true,
    }
  },
  mounted() {

  },
  methods: {
    onClick(){
      uni.navigateTo({
        url:'/OutStock/OutStockConfirm/index'
      })
    }
  }
}
</script>

<style lang="scss">
.process {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  height: 100vh;

  .content {
    flex-grow: 1;
    overflow: auto;
  }

}

</style>
