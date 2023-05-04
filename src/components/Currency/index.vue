<template>
  <view>
    <view class="extra" @click="onClick">
      <template v-if="value">
        {{ value }}
      </template>
      <LinkButton v-else :title="placeholder"/>
    </view>
    <u-picker
        :columns="columns"
        :show="show"
        @cancel="onCancel"
        @confirm="onConfirm"
        @close="onClose"
        closeOnClickOverlay="true"
    />
  </view>
</template>

<script>
import {request} from "MES-Apis/lib/Service/request";
import LinkButton from "@/components/LinkButton/index.vue";

export default {
  name: "Currency",
  components: {LinkButton},
  props: [
    'placeholder',
    'value'
  ],
  data() {
    return {
      columns: [],
      show: false,
    }
  },
  methods: {
    getMoney() {
      return request({
        url: "/Enum/money",
        method: 'Get',
      }).then(res => {
        this.columns = [
          res.data.map(item => {
            return item.name
          })
        ]
      })
    },
    onClick() {
      this.show = true
      this.getMoney()
    },
    onCancel() {
      this.show = false
    },
    onConfirm(e) {
      uni.$emit('currencyChange', e.value[0])
      this.show = false
    },
    onClose() {
      this.show = false
    }
  }
}
</script>

<style scoped>

</style>