<template>
  <view class="sku">
    <SkuList v-for="(item,index) in list" :index="index" :key="index" :value="item" @delete="del" @input="input" />
    <view class="button">
      <u-button
          text="添加"
          type="primary"
          :plain="true"
          @click="add"
          size="small"
      />
    </view>
  </view>

</template>

<script>
import SkuList from "./components/skuList"
import LinkButton from "../../../../components/LinkButton";

export default {
  name: 'SkuDescribe',
  components: {
    LinkButton,
    SkuList
  },
  data() {
    return {
      list: []
    }
  },
  watch: {},
  methods: {
    add() {
      const newList = [...this.list, {
        label: "",
        value: "",
        index: this.list.length
      }];
      this.list = newList;
      this.$emit("input", newList);
    },
    del(delIndex) {
      const newList = this.list.filter((item, index) => index !== delIndex)
      this.list = newList
      this.$emit("input", newList);
    },
    input(value) {
      const newList = this.list.map((item, index) => {
        if (index === value.index) {
          return value
        } else {
          return item
        }
      })
      this.list = newList
      this.$emit("input", newList)
    }
  }
}
</script>

<style lang="scss">
.sku {
  text-align: left;

  .button {
    height: 36px;
    display: flex;
    align-items: center;
  }
}


</style>
