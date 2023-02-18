<template>
 <span> {{ secondsToMinutes(data) }}</span>
</template>

<script>
import moment from "moment";

export default {
  name: 'Clock',
  props: ['seconds'],
  data() {
    return {
      data: 0
    }
  },
  mounted() {
    this.data = this.seconds
  },
  watch: {
    data(value) {
      const tick = () => this.data = value - 1;
      const timerId = setTimeout(tick, 1000);
      if ((value - 1) < 0) {
        clearTimeout(timerId);
      }
      // 返回一个清除函数， 清除函数会在组件卸载前执行，执行当前effect前对上一个effect进行清除
      return () => clearTimeout(timerId);
    }
  },
  methods: {
    secondsToMinutes(sec) {
      sec = Number(sec);
      let minutes = moment.duration(sec, 'seconds').minutes();
      let seconds = moment.duration(sec, 'seconds').seconds();
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      return minutes + ':' + seconds;
    }
  }
}
</script>
