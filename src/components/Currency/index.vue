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
  ],
  data() {
    return {
      columns: [],
      show: false,
      value: ''
    }
  },
  mounted() {
    this.get()
  },
  methods: {
    async get() {
      const money = await this.getMoney()
      const data = money.data
      const name = data.map(item => item.name)
      this.columns = [
        name
      ]

    },
    async getMoney() {
      return request({
        url: "/Enum/money",
        method: 'Get',
      })
    },
    onClick() {
      this.show = true
    },
    onCancel() {
      this.show = false
    },
    onConfirm(e) {
      this.value = e.value[0]
      this.show = false
    }
  }
}
</script>

<style scoped>

</style>