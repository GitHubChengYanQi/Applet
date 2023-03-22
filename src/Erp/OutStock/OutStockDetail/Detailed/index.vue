<template>
  <Auth>
    <van-notify id="van-notify" />

    <van-dialog id="van-dialog" />
    <Page />
  </Auth>
</template>

<script>
import Auth from '../../../../../components/Auth';
import Page from './page';

export default {
  components: {Auth, Page}
}
</script>
