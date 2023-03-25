<template>
	<Auth>
		<Page v-if="auth" />
	</Auth>
</template>
<script>

import Page from "./page";
import Auth from "@/components/Auth";

	export default {
    components:{Auth,Page},
    computed: {
      auth() {
        return this.$store.state.userInfo.auth
      }
    }
	}
</script>

<style lang="scss">

</style>
