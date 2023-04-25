<template>
  <uni-combox
      :candidates="candidates"
      @input="onInput"
      :placeholder="'请输入'+placeholder"
      placeholder-style="color:#ccc"
  />
</template>

<script>
import {Sku} from "MES-Apis/lib/Sku/promise";

export default {
  name: 'Spu',
  behaviors: ['uni://form-field'],
  data() {
    return {
      candidates: [],
      time: null,
      searchValue: ''
    }
  },
  props: {
    placeholder: String,
    spuClassId: String,
  },
  mounted() {
    this.get();
  },
  methods: {
    async get(value) {
      const response = await Sku.spuList({
        data: {
          name: value,
          spuClassificationId: this.spuClassId
        }
      });
      const {data} = response;
      this.candidates = data.map(item => {
        return item.name;
      });
      if (data.length === 1 && this.searchValue === data[0].name) {
        this.$emit('onSpuDetail', data[0])
      }
    },
    search(value) {
      this.searchValue = value
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        this.get(value);
      }, 500);
    },
    onInput(value) {
      this.search(value)
      this.$emit('input', value)
    }
  }
}
</script>

<style>
</style>
