<template>
  <view class="initTenant">

    <view class="userInfo">
      <image src="../../static/images/tenant/logo.png" />
      道昕云
    </view>

    <view class="menus">
      <view class="menu">客户管理</view>
      <view class="space" />
      <view class="menu">仓储管理</view>
      <view class="space" />
      <view class="menu">采购管理</view>
      <view class="space" />
      <view class="menu">生产管理</view>
      <view class="space" />
      <view class="menu">销售管理</view>
    </view>

    <view class="tip">
      您还没有团队，无法使用私有数据，请先：
    </view>

    <LoginByPhone @click="create">
      使用手机号创建团队
    </LoginByPhone>

    <LoginByPhone v-if="false" disabled @click="join">
      加入团队
    </LoginByPhone>

    <view class="des">
      说明：请使用手机号登录创建您的私有数据仓库
    </view>

  </view>
</template>
<script>
import {getLocalParmas} from "../../util/Tools";
import LoginByPhone from "../../components/LoginByPhone";
import Avatar from "../../components/Avatar";

export default {
  options: {
    styleIsolation: 'shared'
  },
  components: {Avatar, LoginByPhone},
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {
    create() {
      uni.navigateTo({
        url: `/Tenant/CreateTenant/index?backUrl=${getLocalParmas().search.backUrl}`
      })
    },
    join() {
      uni.navigateTo({
        url: `/Tenant/CodeJoinTenant/index?backUrl=${getLocalParmas().search.backUrl}`
      })
    },
  }
}
</script>

<style lang="scss">
.initTenant {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 34px 0;

  .userInfo {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 5px;
    font-weight: bold;
    font-size: 18px;
    color: #3D3D3D;


    image {
      width: 82px;
      height: 82px;
    }
  }

  .menus {
    padding-top: 8px;
    display: flex;
    align-items: center;

    .menu {
      padding: 0 8px;
      font-size: 12px;
    }


    .space {
      height: 10px;
      width: 1px;
      background-color: #C7C7C7;
    }

  }

  .tip {
    padding-top: 58px;
    font-weight: bold;
  }

  .des {
    font-size: 12px;
    color: #808080;
  }

  .loginByPhone {
    margin: 15px 0 18px;
    width: calc(100vw - 68px) !important;
    border-radius: 50px;
    background-color: #007aff;
    color: #fff;
    font-size: 16px;
    height: 40px;
    line-height: 40px;

    &::after {
      content: none;
    }
  }
}
</style>
