<template>
  <view class="home">

    <view class="content">
      <view class="header" @click="clickAvatar">
        <Avatar size="79" :src="userInfo.avatar" circular />
        <view v-if="auth">
          <view class="name">
            {{ userInfo.name }}
          </view>
          <view class="phone">
            {{ userInfo.phone }}
          </view>
          <view class="dept">
            {{ isArray(userInfo.dept)[0] || '-' }}-{{ isArray(userInfo.role)[0] || '-' }}
          </view>
        </view>
        <view v-else class="notLogin">
          未登录
        </view>
        <view>

        </view>
      </view>

      <view class="menuCard">
        <view class="title">管理工具</view>
        <MenuCard
            border="none"
            :menus="menus"
            :column="4"
            font-size="12"
            icon-size="24"
            padding="24px 0"
            @click="click"
        />
      </view>

      <view style="padding-top: 29px" />

      <view class="title">其他</view>

      <OtherActions />
    </view>

  </view>
</template>

<script>

import Icon from "../../components/Icon";
import {Menus} from "../Home/menu";
import Avatar from "../../components/Avatar";
import MenuCard from "../../components/MenuCard";
import {getLocalParmas, isArray} from "../../util/Tools";
import OtherActions from "../components/OtherActions";
import {Message} from "../../components/Message";

export default {
  props: ['auth'],
  components: {OtherActions, MenuCard, Avatar, Icon},
  data() {
    return {
      isArray,
      menus: [],
      userInfo: {}
    }
  },
  watch: {
    auth(auth) {
      if (auth){
        const userInfo = this.$store.state.userInfo.userInfo
        let phone = userInfo.phone || '';
        phone = "" + phone;
        const newPhone = phone ? phone.substr(0, 3) + "****" + phone.substr(7) : '-'
        this.userInfo = {
          ...userInfo,
          phone: newPhone
        }
      }
    }
  },
  mounted() {
    const menus = []
    Menus.forEach(item => {
      item.menus.forEach(item => {
        if (item.type && item.type.includes('my')) {
          menus.push(item)
        }
      })
    })
    this.menus = menus
  },
  methods: {
    authority() {
      if (!this.auth) {
        Message.toast('请登录!')
        return false
      } else {
        return true
      }
    },
    click(menu) {
      if (!this.authority()) {
        return
      }
      uni.navigateTo({
        url: menu.url
      })
    },
    clickAvatar() {
      if (!this.auth) {
        uni.navigateTo({
          url: `/pages/login/index?backUrl=${getLocalParmas().route}`,
        })
      }
    }
  }
}
</script>

<style lang="scss">
.home {
  background-image: url("/static/images/home/home-bg.png");
  height: 100vh;

  .content {
    max-height: calc(100% - 64px);
    overflow: auto;
    padding: 32px 12px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 16px;

    .notLogin {
      font-weight: bold;
      font-size: 22px;
    }

    .name {
      font-size: 16px;
      font-weight: normal;
    }

    .phone {
      font-size: 14px;
      color: #666666;
    }

    .dept {
      padding-top: 6px;
      font-size: 16px;
      color: #666666;
    }
  }

  .menuCard {
    margin-top: 32px;
  }

  .title {
    font-weight: bold;
  }

}
</style>
