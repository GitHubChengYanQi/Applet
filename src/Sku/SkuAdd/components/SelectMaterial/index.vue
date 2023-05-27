<template>
  <view>
    <u-popup
        :show="!!show"
        @close="close"
        mode="top"
        :safeAreaInsetBottom="false"
        :round="10"
        @open="open"
    >
      <view class="skuInput" v-if="!!show">
        <view class="search-input">
          <u--input
              v-if="focus"
              placeholder="请输入"
              v-model="name"
              border="surround"
              :selectionStart="name ? name.length : -1"
              :focus="true"
              @confirm="confirm"
          />
          <LinkButton @click="confirm">确认</LinkButton>
        </view>
        <view class="searchList">
          <Loading skeleton v-if="loading" />
          <template v-else>
            <view
                v-for="(item,index) in list"
                :key="index"
                class="searchListItem"
                @click="onCheck(item,true)"
            >
              {{ item.label }}
            </view>
          </template>
        </view>
      </view>
    </u-popup>
    <Modal ref="modal" />
    <Loading :loading="addLoading" />
  </view>
</template>

<script>
import {Sku} from "MES-Apis/lib/Sku/promise";
import LinkButton from "../../../../components/LinkButton/index.vue";
import Loading from "../../../../components/Loading/index.vue";
import Modal from "../../../../components/Modal/index.vue";
import {isArray} from "../../../../util/Tools";

export default {
  name: "SkuInput",
  components: {Modal, Loading, LinkButton},
  props: ['show', 'value', 'label'],
  data() {
    return {
      list: [],
      time: null,
      loading: false,
      addLoading: false,
      focus: false,
      name: ''
    }
  },
  mounted() {

  },
  watch: {
    show(value) {
      if (value) {
        this.get();
      } else {
        this.list = []
      }
    }
  },
  methods: {
    open() {
      this.name = this.label
      setTimeout(() => {
        this.focus = true
      }, 0)
    },
    close() {
      setTimeout(() => {
        this.focus = false;
        this.$emit('close')
      }, 0)
    },
    async confirm() {
      const exit = this.list.find(item => item.label === this.name)
      if (exit) {
        this.$emit('select', exit)
        this.close()
      } else {
        this.addLoading = true
        Sku.materialAdd({
          data: {name: this.name}
        }).then((res) => {
          this.$emit('select', {label: this.name, value: res.data})
          this.close()
        }).catch(() => {
          this.$refs.modal.dialog({
            title: '创建失败!'
          })
        }).finally(() => {
          this.addLoading = false
        })
      }
    },
    async get() {
      if (!this.show) {
        return
      }
      this.loading = true
      await Sku.materialListSelect().then((response) => {
        const {data} = response;
        this.list = isArray(data).map(item=>({...item,label:item.label || '未命名'}))
      });
      this.loading = false
    },
    onCheck(item) {
      this.$emit('select', item)
      this.close()
    }
  }
}
</script>

<style lang="scss">
.skuInput {
  padding: 24px 12px;

  .search-input {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .searchList {
    max-height: 200px;
    overflow: hidden auto;

    .searchListItem {
      padding: 8px;
      border-bottom: solid 1px #f5f5f5;
    }
  }
}
</style>
