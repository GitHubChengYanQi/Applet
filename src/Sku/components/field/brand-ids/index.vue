<template>
  <view class="">

    <view class="button">
      <LinkButton @click="showDrawer">
        <Elliptsis width="200px" style="text-align: left">
          {{ title || '请选择品牌' }}
        </Elliptsis>
      </LinkButton>
    </view>

    <uni-drawer ref="showRight" mode="right" :width="320">
      <uni-search-bar
          bgColor="#EEEEEE"
          @input="search"
          v-model="searchValue"
          @cancel='closeDrawer'
      />
      <Loading :skeleton="true" v-if="loading" />
      <view class="brands" v-else>
        <u-tag
            v-for="(item, index) in localdata" :key="index"
            :text="item.text"
            :plain="!checked.map(checkItem=>checkItem.value).includes(item.value)"
            type="primary"
            :name="index"
            @click="checkClick(item)"
        />
      </view>
    </uni-drawer>
  </view>

</template>

<script>
import Loading from "../../../../components/Loading";
import Elliptsis from "../../../../components/Ellipsis";
import LinkButton from "../../../../components/LinkButton";
import {Sku} from "MES-Apis/lib/Sku/promise";

export default {
  name: "brand-ids",
  components: {LinkButton, Elliptsis, Loading},
  data() {
    return {
      loading: false,
      searchValue: "",
      localdata: [],
      time: null,
      checked: [],
      title:''
    }
  },
  methods: {
    checkClick(brand) {
      let newChecked = []
      if (this.checked.map(checkItem=>checkItem.value).includes(brand.value)) {
        newChecked = this.checked.filter(item => item.value !== brand.value)
      } else {
        newChecked = [...this.checked, brand]
      }
      this.$emit('input',newChecked.map(item=>item.value))
      this.checked = newChecked
      this.title = newChecked.map(item => item.text).join(',')
    },
    search(value) {
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        this.get(value);
      }, 500);
    },
    async get(brandName) {
      this.loading = true
      const _this = this;

      const response = await Sku.brandList({
        data: {
          brandName
        }
      });
      const {
        data
      } = response;
      _this.localdata = data.map(item => {
        return {
          value: item.brandId,
          text: item.brandName
        };
      });
      this.loading = false
    },
    showDrawer() {
      this.get();
      this.$refs.showRight.open();
    },
    closeDrawer() {
      this.$refs.showRight.close();
    }
  }
}
</script>

<style lang="scss">
.button {
  padding-top: 8px;
}

.seek {
  display: flex;
}

.brands {
  padding: 8px 14px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
