<template>
  <view>
    <view v-if="user && user.name">
      <view class='userName'>
        <Avatar size="35" :src='user.avatar' />
        <view>
          <view>{{ user.name }}</view>
          <view class="info">
            <template v-if="!noDept">{{ user.dept || user.deptResult && user.deptResult.fullName || '-' }} - </template>
            {{ user.role || isArray(user.roleResults)[0] && isArray(user.roleResults)[0].name || '-' }}
          </view>
        </view>
      </view>
    </view>
    <view v-else>无</view>
  </view>
</template>

<script>
import {isArray} from "../../util/Tools";
import Avatar from "../Avatar";

export default {
  name: 'userName',
  components: {Avatar},
  props: ['user', 'size','noDept'],
  data() {
    return {
      isArray
    }
  }
}
</script>

<style lang="scss">
.userName {
  display: flex;
  align-items: center;
  gap: 8px;

  .info {
    font-size: 12px;
    color: rgb(148 148 148)
  }
}
</style>
