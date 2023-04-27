<template>
  <view class="codeJoinTenant">
    <view class="title">
      请输入团队id加入
    </view>
    <u-code-input v-model="code" :maxlength="6"></u-code-input>
  </view>
</template>

<script>
export default {
  data() {
    return {
      code: ''
    }
  }
}
</script>

<style lang="scss">
.codeJoinTenant {
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  text-align: center;

  .title {
    font-weight: bold;
    padding-bottom: 8px;
  }
}
</style>
