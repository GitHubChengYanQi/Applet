<template>
  <view class="otherActions">
    <view class="actionItem">
      <button class="share" open-type="share">
        <Icon
            icon="icon-share-fill"
            :size="42"
        />
        <view class="actionName">分享好友</view>
      </button>
    </view>
    <view class="actionItem">
      <button class="share" open-type="contact">
        <Icon
            icon="icon-customer-service-2-fill"
            :size="42"
        />
        <view class="actionName">在线客服</view>
      </button>
    </view>
    <view class="actionItem" style="border: none">
      <Icon
          icon="icon-booklet-fill"
          :size="42"
      />
      <view class="actionName">操作指南</view>
    </view>
  </view>
</template>

<script>
import Icon from "../../../components/Icon";

export default {
  name: 'OtherActions',
  components: {Icon}
}
</script>

<style lang="scss">
.otherActions {
  margin-top: 29px;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;

  .actionItem {
    flex-grow: 1;
    text-align: center;
    padding: 25px 0 20px;
    border-right: dashed 1px rgba(57, 116, 199, 0.1);

    .actionName {
      //padding-top: 12px;
    }

    .share {
      background-color: #fff;
      border: none;
      border-radius: 0;
      box-shadow: none;
      color: unset;
      font-size: unset;
      line-height: unset;

      &::after {
        border: none;
      }
    }
  }
}
</style>
