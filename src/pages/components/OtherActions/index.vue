<template>
  <view class="otherActions">
    <button open-type="contact" class="actionItem">
      <Icon
          icon="icon-customer-service-2-fill"
          :size="24"
      />
      <view class="actionInfo">
        <view class="actionName">在线客服</view>
        <view class="actionDes">在线解答各种疑难问题</view>
      </view>
    </button>

    <view class="actionItem">
      <Icon
          icon="icon-question-answer-fill"
          :size="24"
      />
      <view class="actionInfo">
        <view class="actionName">消息推送</view>
        <view class="actionDes">关注公众号，在线接收推送消息</view>
      </view>
    </view>

    <view class="actionItem">
      <Icon
          icon="icon-booklet-fill1"
          :size="24"
      />
      <view class="actionInfo">
        <view class="actionName">帮助文档</view>
        <view class="actionDes">各个功能模块的使用详细介绍</view>
      </view>
    </view>

    <view class="actionItem">
      <Icon
          icon="icon-compass-3-fill"
          :size="24"
      />
      <view class="actionInfo">
        <view class="actionName">新手指南</view>
        <view class="actionDes">快速上手，清晰明了</view>
      </view>
    </view>

    <view class="actionItem">
      <Icon
          icon="icon-feedback-fill"
          :size="24"
      />
      <view class="actionInfo">
        <view class="actionName">反馈需求</view>
        <view class="actionDes">您的建议是我们持续的动力~</view>
      </view>
    </view>

    <view class="actionItem">
      <Icon
          icon="icon-computer-fill"
          :size="24"
      />
      <view class="actionInfo">
        <view class="actionName">电脑端网址</view>
        <view class="actionDes">关注我们，了解我们</view>
      </view>
    </view>

    <button open-type="share" class="actionItem">
      <Icon
          icon="icon-share-fill"
          :size="24"
      />
      <view class="actionInfo">
        <view class="actionName">分享好友</view>
        <view class="actionDes">感谢分享~</view>
      </view>
    </button>
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
  margin-top: 15px;
  background-color: #fff;
  border-radius: 8px;
  padding: 0 16px;

  .actionItem {
    background-color: #fff;
    border: none;
    border-radius: 0;
    box-shadow: none;
    color: unset;
    font-size: unset;
    line-height: unset;
    display: flex;
    align-items: center;
    //gap: 14px;
    padding: 0;

    .actionInfo {
      flex-grow: 1;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px;
      border-bottom: 1px dashed rgba(57, 116, 199, 0.1);

      .actionDes {
        font-size: 14px;
        color: #808080;
      }
    }

    &::after {
      border: none;
    }

    .actionName {
      min-width: 70px;
      //padding-top: 12px;
    }
  }
}
</style>
