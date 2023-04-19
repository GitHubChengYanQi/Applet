<template>
  <view class="body">
    <MenuCard
        v-for="(item,index) in Menus"
        :key="index"
        :title="item.name"
        v-if="(item.menus || []).length > 0"
    >
      <view class="white" slot="content">
        <u-grid col="3" :border="true">
          <u-grid-item
              v-for="(subItem,subIndex) in (item.menus || [])"
              :key="subIndex"
              @click="()=>click(subItem)"
          >
            <view class="block">
              <view class="img">
                <Icon :icon="subItem.icon || 'icon-danxuanweixuanzhong'" :size="32" />
              </view>
              <view class="text">{{ subItem.name }}</view>
            </view>
          </u-grid-item>
        </u-grid>
      </view>
    </MenuCard>
  </view>

</template>

<script>
import {Menus} from "../../pages/Home/menu";
import Icon from "../../components/Icon";
import MenuCard from "./components/Card";

export default {
  name: "Menus",
  components: {
    MenuCard,
    Icon
  },
  data() {
    return {
      src: '../../static/images/创建采购单.png',
      commonlyMenus: [{name: '11111'}, {name: '222222'}, {name: '333333'}, {name: '444444'}, {name: '555555'}],
      expandStatus: true,
      Menus,
    }
  },
  mounted() {

  },
  methods: {
    expand() {
      this.expandStatus = !this.expandStatus
    },
    click(menu) {
      uni.navigateTo({
        url: menu.url
      })
    }
  }
}
</script>

<style lang="scss">
.body {
  padding: 12px;
}

image {
  width: 100%;
  height: 100%;
}

.blue {
  display: flex;
  color: #2680EB;
}

.white {
  display: flex;
  background-color: #FFFFFF;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 6px 9px -2px rgba(220, 220, 220, 0.3);

  .block {
    justify-content: space-between;
    padding: 14px;

    .img {
      width: 34px;
      height: 34px;
      margin: 4px auto;
    }

    .text {
      font-size: 12px;
    }
  }
}

.white1 {
  display: flex;
  padding: 16px 21px;
  background-color: #FFFFFF;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 6px 9px -2px rgba(220, 220, 220, 0.3);

  .text {
    font-size: 12px;
    color: #808080;
    text-align: left;
    flex-grow: 1;
  }

  .little {
    width: 14px;
    height: 14px;
  }

  .icon {
    margin: auto 4px;
  }
}
</style>
