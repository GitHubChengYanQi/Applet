<template>
  <view>
    <view v-if="searchValue">
      {{ label || '-' }}
    </view>
    <view v-else>
      {{ valueRender.startValue }}
      <span
          :style={color}
          class='searchValue'
      >
        {{ valueRender.value }}
      </span>
      {{ valueRender.endValue }}
    </view>
  </view>
</template>

<script>
export default {
  name: 'SearchValueFormat',
  props: ['label', 'searchValue', 'maxWidth', 'style', 'color'],
  data() {
    return {
      valueRender: {}
    }
  },
  watch: {
    searchValue(searchValue) {
      if (!searchValue) {
        this.valueRender = {}
        return
      }
      const stringLabel = `${this.label}`;
      const lowerCaseLabel = stringLabel.toLowerCase();
      const lowerCaseValue = searchValue.toLowerCase();
      if (lowerCaseLabel.indexOf(lowerCaseValue) !== -1) {
        const startValue = stringLabel.substring(0, lowerCaseLabel.indexOf(lowerCaseValue));
        const value = stringLabel.substring(lowerCaseLabel.indexOf(lowerCaseValue), lowerCaseLabel.indexOf(lowerCaseValue) + lowerCaseValue.length);
        const endValue = stringLabel.substring(lowerCaseLabel.indexOf(lowerCaseValue) + lowerCaseValue.length, lowerCaseLabel.length);

        this.valueRender = {
          startValue,
          value,
          endValue
        }
      }
    }
  },
  methods: {}
}
</script>

<style lang="scss">
.searchValue {
  color: $primary-color;
  font-weight: bold;
}
</style>
