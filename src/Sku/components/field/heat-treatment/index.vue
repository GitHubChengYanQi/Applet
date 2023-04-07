<template>
  <uni-combox :candidates="candidates" @input="onInput" :placeholder="'请输入'+placeholder"
              placeholder-style="color:#ccc" />
</template>

<script>
import {
  request
} from 'MES-Apis/lib/Service/request';
import {Sku} from "MES-Apis/lib/Sku/promise";

export default {
  behaviors: ['uni://form-field'],
  data() {
    return {
      candidates: []
    }
  },
  props: {
    placeholder: String,
  },
  mounted() {
    this.get();
  },
  methods: {
    async get() {
      const response = await Sku.generalFormDataList({
        data: {
          fieldName: "heatTreatment"
        }
      });
      const {data} = response;
      this.candidates = data.map(item => {
        return item.value;
      });
      console.log(this.candidates);
    },
    onInput(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style>
</style>
