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
          <template v-if="!textarea">
            <u--input
                v-if="focus"
                placeholder="请输入"
                :value="value"
                @change="onInput"
                border="surround"
                :selectionStart="value ? value.length : -1"
                :focus="true"
                @confirm="close"
            />
            <LinkButton @click="close">确认</LinkButton>
          </template>
          <template v-else>
            <u--textarea
                v-if="focus"
                :value="value || ''"
                placeholder="请输入"
                count
                border="surround"
                :focus="true"
                @input="onInput"
                @confirm="close"
                :selectionStart="value ? value.length : -1"
            />
          </template>
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
  </view>
</template>

<script>
import {Sku} from "MES-Apis/lib/Sku/promise";
import LinkButton from "../../../../components/LinkButton/index.vue";
import Loading from "../../../../components/Loading/index.vue";

export default {
  name: "SkuInput",
  components: {Loading, LinkButton},
  props: ['show', 'value', 'params', 'textarea','inputFiled'],
  data() {
    return {
      list: [],
      time: null,
      loading: false,
      focus: false
    }
  },
  mounted() {

  },
  watch: {
    show(value) {
      if (value) {
        this.get(this.value);
      } else {
        this.list = []
      }
    }
  },
  methods: {
    open() {
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
    async get(value) {
      if (!this.show || this.textarea) {
        return
      }
      this.loading = true
      switch (this.inputFiled) {
        case 'spu':
          await Sku.spuList({
            data: {
              name: value,
              spuClassificationId: this.params.spuClassId
            }
          }).then((response) => {
            const {data} = response;
            this.list = data.map(item => {
              return {
                label: item.name,
                value: item.spuId
              };
            });
          });
          break;
        default:
          await Sku.generalFormDataList({
            data: {
              value,
              fieldName: this.inputFiled
            }
          }).then((response) => {
            const {data} = response;
            this.list = data.map(item => {
              return {
                label: item.value,
                value: item.value
              };
            });
          });
          break
      }
      this.loading = false
    },
    search(value) {
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        this.get(value);
      }, 500);
    },
    onInput(value) {
      this.$emit('input', value)
      if (!this.textarea){
        this.$emit('change', value)
        this.search(value)
      }
    },
    onCheck(item) {
      this.$emit('input', item.label)
      this.$emit('change', item.label)
      this.$emit('checked', {...item, filed: this.show})
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
