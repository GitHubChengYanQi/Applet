<template>
  <view class="menus">
    <view
        v-for="(item,rowIndex) in rows"
        :key="index"
        :class="{row:true,endRow:rowIndex === rows.length - 1}"
    >
      <view
          v-for="(item,colIndex) in cols"
          :key="index"
          :class="{
            col:true,
            endCol:colIndex === cols.length - 1 || (rowIndex * column + colIndex) === menus.length - 1
          }"
          :style="{width:`${100 / column}%`,border}"
      >
        <view
            class="menuItem" v-if="menus[rowIndex * column + colIndex]"
            @click="click(menus[rowIndex * column + colIndex])"
            :style="{padding}"
        >
          <Icon
              :icon="menus[rowIndex * column + colIndex].icon || 'icon-danxuanweixuanzhong'"
              :size="iconSize"
          />
          <view class="menuName" :style="{fontSize:`${fontSize}px`}">{{
              menus[rowIndex * column + colIndex].name
            }}
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import Icon from "../Icon";

export default {
  name: 'MenuCard',
  components: {Icon},
  props: {
    menus: Array,
    column: {
      type: Number,
      default: () => 3
    },
    iconSize: {
      type: Number,
      default: () => 42
    },
    fontSize: {
      type: Number,
      default: () => 16
    },
    border: String,
    padding: String
  },
  data() {
    return {
      rows: [],
      cols: []
    }
  },
  watch: {
    menus(menus) {
      this.rows = new Array(Math.ceil(menus.length / this.column)).fill('')
      this.cols = new Array(this.column).fill('')
    }
  },
  mounted() {

  },
  methods: {
    click(menu) {
      if (!menu) {
        return
      }
      uni.navigateTo({
        url: menu.url
      })
    }
  }
}
</script>

<style lang="scss">
.menus {
  margin-top: 10px;
  background-color: #fff;
  border-radius: 8px;

  .row {
    display: flex;
    align-items: center;

    .col {
      flex-grow: 1;
      border-bottom: dashed 1px rgba(57, 116, 199, 0.1);
      border-right: dashed 1px rgba(57, 116, 199, 0.1);

      .menuItem {
        text-align: center;
        padding: 31px 0 25px;

        .menuName {
          //padding-top: 12px;
        }
      }
    }

    .endCol {
      border-right: none;
    }
  }

  .endRow {

    .col {
      border-bottom: none;
    }
  }


}
</style>
