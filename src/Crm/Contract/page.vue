<template>
  <view class="back">
    <view class="popupContent">
      <Search placeholder="请输入合同模板信息"></Search>
      <view class="content" v-for="(item,index) in list" @click="click(item)" :key="index">
        <view class="information">{{ item.name }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import Search from "@/components/Search/index.vue";
import {request} from "MES-Apis/lib/Service/request";

export default {
  name: "page",
  components: {Search},
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.get();
  },
  methods: {
    get() {
      const _this = this;
      request({
        url: "/template/list",
        method: "POST",
        data: {}
      }).then(res => {
        _this.list = res.data;
      });
    },
    click(item) {
      uni.$emit("contractChange", item);
      uni.navigateBack();
    }
  }
}
</script>

<style lang="scss">

.back {
  background-color: #FFFFFF;
}

.select {
  display: flex;
  justify-content: space-between;
  padding: 0 12px;

  .selectText {
    color: #257bde;
    line-height: 45px;
  }

  .selectTitle {
    font-size: 18px;
    line-height: 45px;
  }
}

.popupContent {
  padding: 12px;

  .content {
    display: flex;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    padding: 6px 0;

    .information {
      flex: 1;
      padding-left: 12px;
    }
  }
}

</style>