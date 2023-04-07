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
  name: 'Combox',
  behaviors: ['uni://form-field'],
  data() {
    return {
      candidates: [],
      time: null,
    }
  },
  props: {
    placeholder: String,
    fieldName: String,
  },
  mounted() {
    this.get();
  },
  methods: {
    async get(value) {
      const response = await Sku.generalFormDataList({
        data: {
          value,
          fieldName: this.fieldName
        }
      });
      const {data} = response;
      this.candidates = data.map(item => {
        return item.value;
      });
    },
    search(value) {
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
