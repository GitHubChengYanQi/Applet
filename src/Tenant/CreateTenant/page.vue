<template>
  <view class="createTenant">
    <view class="title">
      快速创建我的团队
    </view>
    <view class="input">
      <uni-easyinput focus v-model="name" placeholder="团队名称" />
    </view>
    <MyButton type="primary" @click="create">创建团队</MyButton>
    <Modal ref="modal" />
  </view>
</template>

<script>
import MyButton from "../../components/MyButton";
import {Tenant} from "MES-Apis/lib/Tenant/promise";
import {Message} from "../../components/Message";
import {Init} from "MES-Apis/lib/Init";
import {getLocalParmas, routeReplace} from "../../util/Tools";
import Modal from "../../components/Modal";

export default {
  options: {
    styleIsolation: 'shared'
  },
  components: {Modal, MyButton},
  data() {
    return {
      name: '',
      loading: false
    }
  },
  methods: {
    create() {
      this.loading = true
      Tenant.createTenant({
        data: {name: this.name}
      }, {
        onSuccess: (res) => {
          this.loading = false
          Message.successToast('创建成功!', () => {
            getApp().globalData.token = res
            this.$store.commit('userInfo/clear')
            this.goBack()
          })
        },
        onError: () => {
          this.loading = false
          this.$refs.modal.dialog({
            title: Init.getNewErrorMessage() || '创建失败！',
          })
        }
      })
    },
    goBack() {
      const backUrl = getLocalParmas().search.backUrl
      uni.reLaunch({
        url: backUrl ? routeReplace(backUrl) : '/pages/Home/index'
      })
    }
  }
}
</script>

<style lang="scss">
.createTenant {
  padding: 12px 0;

  .title {
    padding: 0 8px;
    font-weight: bold;
  }

  .input {
    padding: 12px 0;
  }

  .myButton {
    width: 100%;

    button {
      width: 100% !important;
      border-radius: 50px;
      padding: 8px 0;
    }
  }
}
</style>
