<template>
  <view class="createTenant">
    <ImageCropper
        v-if="uploadUrl"
        :img-url="uploadUrl"
        @done="cropperDone"
        @close="uploadUrl = ''"
    />
    <view class="logo">
      <view class="logoTitle">
        头像/企业logo
      </view>
      <view class="uploadLogo">
        <Uploader @loading="(val)=>uploadLoading = val" ref="upload" @onChange="uploadLogo">
          <u-loading-icon v-if="uploadLoading" mode="circle" :vertical="true"></u-loading-icon>
          <template v-else>
            <Avatar :src="logo.url" size="26" v-if="logo.url" circular />
            <Icon icon="icon-tuanduitouxiang" size="26" v-else />
          </template>
        </Uploader>
        <u-icon name="arrow-right" size="12" color="#929293" />
      </view>
    </view>
    <view class="name">
      <u--input
          placeholder="团队名称"
          focus
          border="none"
          v-model="name"
      />
    </view>

    <view style="padding: 12px">
      <LoginByPhone @click="edit ? editTenant() : create()">{{ edit ? '保存' : '创建团队' }}</LoginByPhone>
    </view>


    <Loading :loading="loading" :loading-text="edit ? '保存数据中...' : '创建数据中...'" />

    <Modal ref="modal" />
  </view>
</template>

<script>
import {Tenant} from "MES-Apis/lib/Tenant/promise";
import {Message} from "../../components/Message";
import {Init} from "MES-Apis/lib/Init";
import {getLocalParmas, routeReplace} from "../../util/Tools";
import Modal from "../../components/Modal";
import Icon from "../../components/Icon";
import Uploader from "../../components/Uploader";
import Avatar from "../../components/Avatar";
import Loading from "../../components/Loading";
import ImageCropper from "../../components/ImageCropper";
import LoginByPhone from "../../components/LoginByPhone";

export default {
  options: {
    styleIsolation: 'shared'
  },
  components: {LoginByPhone, ImageCropper, Loading, Avatar, Uploader, Icon, Modal},
  data() {
    return {
      name: '',
      loading: false,
      uploadUrl: '',
      logo: {},
      edit: false,
      uploadLoading: false,
      tenantId: '',
    }
  },
  mounted() {
    if (getLocalParmas().search.type === 'update') {
      uni.setNavigationBarTitle({
        title: '更改团队信息'
      });
      this.edit = true
      const tenant = this.$store.state.userInfo.tenant || {}
      this.name = tenant.name
      this.tenantId = tenant.tenantId
      this.logo = {
        id: tenant.logo.mediaId,
        url: tenant.logo.url
      }
    }
  },
  methods: {
    cropperDone(url) {
      this.$refs.upload.uploadFile(url, {done: true})
      this.uploadUrl = ''
    },
    create() {
      if (!this.name) {
        Message.toast('请输入团队名称！')
        return
      }
      this.loading = true
      Tenant.createTenant({
        data: {name: this.name, logo: this.logo.id}
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
    editTenant() {
      if (!this.name) {
        Message.toast('请输入团队名称！')
        return
      }
      this.loading = true
      Tenant.editTenant({
        data: {tenantId: this.tenantId, name: this.name, logo: this.logo.id}
      }, {
        onSuccess: (res) => {
          this.loading = false
          Message.successToast('保存成功!', () => {
            getApp().globalData.token = res
            this.$store.commit('userInfo/clear')
            this.goBack()
          })
        },
        onError: () => {
          this.loading = false
          this.$refs.modal.dialog({
            title: Init.getNewErrorMessage() || '保存失败！',
          })
        }
      })
    },
    goBack() {
      const backUrl = getLocalParmas().search.backUrl
      uni.reLaunch({
        url: backUrl ? routeReplace(backUrl) : '/pages/Home/index'
      })
    },
    uploadLogo(file) {
      if (file.done) {
        this.logo = file
      } else {
        this.uploadUrl = file.url
      }
    }
  }
}
</script>

<style lang="scss">
.createTenant {


  .title {
    padding: 0 8px;
    font-weight: bold;
  }

  .logo {
    margin: 19px 12px 0;
    padding: 13px 14px;
    border-radius: 8px;
    background-color: #fff;
    display: flex;
    align-items: center;

    .logoTitle {
      flex-grow: 1;
      font-size: 14px;
      color: #3D3D3D;
      height: 24px;
      line-height: 24px;
    }

    .uploadLogo {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .name {
    margin: 15px 12px;
    padding: 13px 14px;
    border-radius: 8px;
    background-color: #fff;
  }

  .loginByPhone {
    color: #fff;
    background-color: #3c9cff;
    border-radius: 50px;
    height: fit-content !important;
    width: calc(100vw - 24px);
    padding: 8px;
  }

}
</style>
