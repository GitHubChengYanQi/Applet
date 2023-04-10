<template>
  <view>
    <view class="extra" @click="onClick">
      <template v-if="value">
        {{ value }}
      </template>
      <LinkButton v-else>
        <view>
          <u-icon name="calendar"/>
        </view>
      </LinkButton>
    </view>
    <u-datetime-picker
        mode="date"
        :show="show"
        ref="datetimePicker"
        v-model="dateValue"
        :formatter="formatter"
        :title="title || '时间选择'"
        @confirm="onConfirm"
        @cancel="onCancel"
    />
  </view>
</template>

<script>
import LinkButton from "@/components/LinkButton/index.vue";
import moment from "moment/moment";

export default {
  name: "MyDatePicker",
  components: {LinkButton},
  props: [
    'placeholder',
    'title'
  ],
  onReady() {
    this.$refs.datetimePicker.setFormatter(this.formatter)
  },
  data() {
    return {
      value: '',
      show: false,
      dateValue: Number(new Date())
    }
  },
  methods: {
    onClick() {
      this.show = true
    },
    onCancel() {
      this.show = false
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      }
      if (type === 'month') {
        return `${value}月`
      }
      if (type === 'day') {
        return `${value}日`
      }
    },
    onConfirm(e) {
      this.value = moment(e.value).format('YYYY/MM/DD')
      this.show = false
    }
  },
}
</script>

<style scoped>

</style>