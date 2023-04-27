<template>
  <view class="userInfo">
    <view class="info" @click="actionAvatar = true">
      <view class="label">头像</view>
      <view>
        <Avatar size="40" :src="userInfo.avatar" />
      </view>
      <u-icon name="arrow-right" />
    </view>
    <view class="info">
      <view class="label">昵称</view>
      <u--input
          maxlength="8"
          inputAlign="right"
          border="none"
          v-model="userInfo.nickName"
      />
      <u-icon name="arrow-right" />
    </view>
    <view class="info">
      <view class="label">姓名</view>
      <u--input
          maxlength="8"
          inputAlign="right"
          border="none"
          v-model="userInfo.name"
      />
      <u-icon name="arrow-right" />
    </view>
    <view class="info" style="border: none">
      <view class="label">手机号</view>
      <view>
        {{ userInfo.phone }}
      </view>
    </view>

    <button class="getWxUserInfo" @tap="getWxUserInfo">同步微信个人信息</button>


    <view class="button">
      <MyButton type="primary" @click="save">保存</MyButton>
    </view>

    <ImageCropper
        v-if="uploadUrl"
        :img-url="uploadUrl"
        @done="cropperDone"
        @close="uploadUrl = ''"
    />

    <Loading :loading="saveLoading" />

    <Popup @close="actionAvatar = false" round="10" no-title :show="actionAvatar">
      <view :class="{actionAvatar:true,actionAvatarDisable:!userInfo.avatar}" @click="preview">
        预览
      </view>
      <view class="actionAvatar">
        <Uploader @loading="(val)=>uploadLoading = val" ref="upload" @onChange="uploadAvatar">
          <u-loading-icon v-if="uploadLoading" mode="circle" :vertical="true"></u-loading-icon>
          <template v-else>
            修改
          </template>
        </Uploader>
      </view>
      <view
          :class="{actionAvatar:true,actionAvatarDisable:!userInfo.avatar}"
          style="border: none"
          @click="saveAvatar"
      >
        保存
      </view>
    </Popup>
  </view>
</template>

<script>
import Avatar from "../../components/Avatar";
import MyButton from "../../components/MyButton";
import Popup from "../../components/Popup";
import Uploader from "../../components/Uploader";
import ImageCropper from "../../components/ImageCropper";
import {saveImg} from "../../util/Tools";
import {Message} from "../../components/Message";
import {User} from "MES-Apis/lib/User/promise";
import Loading from "../../components/Loading";

export default {
  options: {
    styleIsolation: 'shared'
  },
  components: {Loading, ImageCropper, Uploader, Popup, MyButton, Avatar},
  data() {
    return {
      actionAvatar: false,
      userInfo: {},
      uploadUrl: '',
      uploadLoading: false,
      saveLoading: false,
    }
  },
  mounted() {
    this.userInfo = this.$store.state.userInfo.userInfo || {}
  },
  methods: {
    save() {
      this.saveLoading = true
      User.updateUserInfo({
        data: {
          userId: this.userInfo.id,
          avatar: this.userInfo.avatar,
          name: this.userInfo.name,
          nickName: this.userInfo.nickName
        }
      }).then(() => {
        this.$store.dispatch('userInfo/getUserInfo')
        Message.successToast('保存成功！')
      }).catch(() => {
        Message.errorToast('保存失败！')
      }).finally(() => {
        this.saveLoading = false
      })
    },
    async saveAvatar() {
      if (!this.userInfo.avatar) {
        return
      }
      const res = await saveImg(this.userInfo.avatar)
      if (res) {
        this.actionAvatar = false
      }
    },
    preview() {
      if (!this.userInfo.avatar) {
        return
      }
      this.actionAvatar = false
      uni.previewImage({
        current: this.userInfo.avatar,
        urls: [this.userInfo.avatar]
      })
    },
    cropperDone(url) {
      this.$refs.upload.uploadFile(url, {done: true})
      this.uploadUrl = ''
    },
    uploadAvatar(file) {
      if (file.done) {
        this.userInfo.avatar = file.url
      } else {
        this.actionAvatar = false
        this.uploadUrl = file.url
      }
    },
    getWxUserInfo() {
      const _this = this
      uni.getUserProfile({
        desc: '展示头像和昵称',
        success(res) {
          const userInfo = res.userInfo || {}
          _this.userInfo = {
            ..._this.userInfo,
            avatar: userInfo.avatarUrl,
            nickName: userInfo.nickName
          }
        },
        fail(res) {
          Message.errorToast('获取信息失败!')
          console.log(res)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.userInfo {

  .info {
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 12px;
    gap: 8px;
    border-bottom: solid 1px #f5f5f5;

    .label {
      flex-grow: 1;
    }
  }

  .button {
    margin-top: 30px;

    .myButton {
      width: calc(100% - 24px);
      padding: 0 12px;

      button {
        width: 100% !important;
        border-radius: 50px;
        padding: 8px 0;
      }
    }
  }
}

.actionAvatar {
  padding: 12px;
  text-align: center;
  border-bottom: solid 1px #f5f5f5;

  .u-upload__wrap.data-v-49deb6f2 {
    justify-content: center;
    width: 100%;

    > view {
      width: 100%;
    }
  }
}

.actionAvatarDisable {
  color: #cccccc;
}

.getWxUserInfo {
  padding: 0;
  background-color: transparent;
  font-size: 14px;
  width: fit-content;
  color: $primary-color;

  &::after {
    content: none;
  }
}
</style>
