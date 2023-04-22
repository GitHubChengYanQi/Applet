<template>
  <view class="tenantSet">
    <view class="header">
      <Icon icon="icon-team-fill" size="40" />
      <view class="name">
        {{ tenant.name }}
      </view>
    </view>
    <view class="user">
      <view class="step" @click="addUserShow = true">
        <Icon icon="icon-jiahao" size="24" />
        添加用户
      </view>
      <u-icon name="arrow-right" />
      <view class="step" @click="gotoJoinTenantList">
        <Icon icon="icon-jiahao" size="24" />
        审批加入
      </view>
      <u-icon name="arrow-right" />
      <view class="step" @click="gotoUserList">
        <Icon icon="icon-jiahao" size="24" />
        用户列表
      </view>
    </view>

    <AddUser :addUserShow="addUserShow" @close="addUserShow = false" />
  </view>
</template>

<script>
import Icon from "../../components/Icon";
import Popup from "../../components/Popup";
import Loading from "../../components/Loading";
import AddUser from "./components/AddUser";

export default {
  components: {AddUser, Loading, Popup, Icon},
  data() {
    return {
      tenant: {},
      addUserShow: false
    }
  },
  mounted() {
    this.tenant = this.$store.state.userInfo.tenant || {}
  },
  methods: {
    gotoJoinTenantList() {
      uni.navigateTo({
        url: '/Tenant/TenantSet/JoinTenantList/index'
      })
    },
    gotoUserList() {
      uni.navigateTo({
        url: '/Tenant/TenantSet/UserList/index'
      })
    },
  }
}
</script>

<style lang="scss">
.tenantSet {
  padding: 8px;

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background-color: #fff;
    border-radius: 4px;

    .name {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .user {
    margin-top: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    background-color: #fff;
    border-radius: 4px;

    .step {
      flex-grow: 1;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      gap: 8px;
      font-size: 12px;
    }
  }
}

</style>
