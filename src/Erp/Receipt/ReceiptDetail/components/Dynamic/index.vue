<template>
  <view>
    <view style="background-color: #fff">
      <List
          ref="listRef"
          :defaultParams="{ taskId }"
          :list="list"
          @listSource="listSource"
          max-height="calc(100vh - 130px)"
          @request="Process.dynamicList"
      >
        <DynamicList :remarks="list" />
      </List>
    </view>
  </view>
</template>

<script>
import List from "../../../../../components/List/indx";
import {Process} from "MES-Apis/src/Process/promise";
import DynamicList from "./components/DynamicList";

export default {
  name: 'Dynamic',
  components: {DynamicList, List},
  props: ['taskId'],
  data() {
    return {
      list: [],
      requestList: null,
      Process
    }
  },
  mounted() {
    // console.log(Process)
    // this.requestList =
  },
  methods: {
    listSource(newlist) {
      this.list = newlist
    }
  }
}
</script>
