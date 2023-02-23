<template>
  <view>
    <view class='log'>
      <view
          v-for="(item,index) in remarks"
          :key="index"
          class='dynamic'
          :style="{ borderTop: index === 0 && 'none' }"
      >

        <view class='avatar'>
          <image :src='user(item).avatar' />
        </view>

        <view>
          <view class='name' v-if="user(item).name">
            {{ user(item).name }}
          </view>
          <view class='description'>
            <view class='content'>
              <view v-if="item.type === 'audit' && item.status === 1">
                同意了审批
                <view style="padding: 4px 0">
                  {{ item.content }}
                </view>
              </view>
              <view v-else-if="item.type === 'audit' && item.status === 0">
                拒绝了审批
                <view>
                  {{ item.content }}
                </view>
              </view>
              <view v-else>
                {{ item.content }}
              </view>
            </view>
            <view class='photos' v-if="isArray(item.mediaResults).length !== 0">
              <!--          <UploadFile-->
              <!--              show-->
              <!--              files={imgs.map(item => ({ ...item, showUrl: item.url,url:item.thumbUrl || item.url }))}-->
              <!--          />-->
            </view>
            <view class='time'>
              {{ timeDifference(item.createTime) }}
            </view>
          </view>
        </view>

      </view>
    </view>
  </view>
</template>

<script>
import {isArray, isObject, timeDifference} from "../../../../../../../util/Tools";

export default {
  name: 'DynamicList',
  props: [
    'remarks'
  ],
  data() {
    return {
      timeDifference,
      isArray,
      isObject,
    }
  },
  mounted() {

  },
  methods: {
    user(item) {
      return item.user || item.userResult || {}
    }
  }
}
</script>

<style lang="scss">
.log {
  background-color: #fff;
  //padding: 24px;
}

.dynamic {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  border-top: solid 1px #f5f5f5;
  border-bottom: solid 1px #f5f5f5;

  .avatar {
    margin-right: 12px;
    width: 24px;
    height: 24px;
  }
}

.name {
  font-size: 14px;
  font-weight: bold;
  display: flex;
  gap: 14px;
  align-items: center;
  color: $primary-color;

  span {
    font-size: 12px;
    font-weight: bold;
  }
}

.description {
  font-size: 14px;

  .content {
    margin: 8px 0;
  }

  .reply {
    border-radius: 5px;
    background: #F5F5F5;
    padding: 8px 12px;

    .replyItem {
      padding: 8px;
    }
  }

  .actions {
    margin-top: 8px;
    display: flex;
    gap: 20px;
  }
}

.photos {
  padding-bottom: 8px;
}

.time {
  font-size: 12px;
  color: #a5a3a3;
}

</style>
