<template>
  <view class="uni-steps">
    <view class='uni-steps__column'>
      <view class='uni-steps__column-text-container'>
        <Step
            :old="!version"
            :step="auditData || []"
            :create-user="createUser"
            :next="true"
            :index="0"
            :hidden="hiddenSteps.includes(0)"
            :hiddenSteps="hiddenSteps"
            @hiddenStepChange="hiddenStepChange"
        />
      </view>
      <view v-if="false" class='uni-steps__column-container'>
        <view
            class='uni-steps__column-line-item'
            v-for="(item,index) in options" :key="index"
        >
          <view
              class='uni-steps__column-line'
              :style="{backgroundColor:index<=active&&index!==0?activeColor:index===0?'transparent':deactiveColor}">
          </view>
          <view
              class='uni-steps__column-check'
              v-if="index === active">
            <uni-icons type="checkmarkempty" size="14"></uni-icons>
          </view>
          <view
              v-else
              class='uni-steps__column-circle'
              :style="{backgroundColor:index<active?activeColor:deactiveColor}"
          >

          </view>
          <view
              class='uni-steps__column-line uni-steps__column-line--after'
              :style="{backgroundColor:index<active&&index!==options.length-1?activeColor:index===options.length-1?'transparent':deactiveColor}"
          >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Step from './components/Step/index'

export default {
  components: {Step},
  props: ['auditData', 'version', 'createUser'],
  data() {
    return {
      hiddenSteps: []
    }
  },
  methods: {
    hiddenStepChange(hiddenSteps) {
      this.hiddenSteps = hiddenSteps
    }
  }
}
</script>

<style lang="scss">

$uni-primary: #2979ff !default;
$uni-border-color: #EDEDED;
.uni-steps {
  background-color: #fff;
  /* #ifndef APP-NVUE */
  display: flex;
  width: 100%;
  /* #endif */
  /* #ifdef APP-NVUE */
  flex: 1;
  /* #endif */
  flex-direction: column;
}

.uni-steps__column {
  padding: 0 12px 12px;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row-reverse;
}

.uni-steps__column-text-container {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  flex: 1;
}


.uni-steps__column-desc2 {
  font-size: 12px;
  line-height: 25px;
  padding-right: 20px;
}

.uni-steps__column-container {
  /* #ifndef APP-NVUE */
  display: inline-flex;
  /* #endif */
  width: 30px;
  flex-direction: column;
}


.uni-steps__column-line-item {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.uni-steps__column-line {
  width: 1px;
  background-color: #B7BDC6;
}

.uni-steps__column-line--after {
  flex: 1;
  transform: translate(0px, 1px);
}

.uni-steps__column-line--before {
  height: 6px;
  transform: translate(0px, -13px);
}

.uni-steps__column-circle {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #B7BDC6;
  margin: 4px 0px 5px 0px;
}

.uni-steps__column-check {
  height: 14px;
  line-height: 14px;
  margin: 2px 0px;
}

.substep {
  display: flex;
  padding: 10px 0;
  line-height: 20px;
}

.headPortrait3 {
  width: 26px;
  height: 26px;
  border-radius: 5px;
  overflow: hidden;
}

.as {
  position: relative;
}

.ball {
  width: 14px;
  height: 14px;
  line-height: 14px;
  text-align: center;
  border-radius: 50%;
  background-color: #2680eb;
  position: absolute;
  top: -6px;
  right: -6px;
  z-index: 1;
}
</style>
