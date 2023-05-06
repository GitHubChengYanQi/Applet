<template>
  <view class="menus">
    <view
        v-for="(item,rowIndex) in rows"
        :key="rowIndex"
        :class="{row:true,endRow:rowIndex === rows.length - 1}"
    >
      <view
          v-for="(item,colIndex) in cols"
          :key="colIndex"
          :class="{
            col:true,
            endCol:colIndex === cols.length - 1 || (rowIndex * column + colIndex) === menus.length - 1
          }"
          :style="{width:`${100 / column}%`,border}"
      >
        <view
            class="menuItem"
            v-if="menus[rowIndex * column + colIndex]"
            :style="{padding}"
        >
          <view class="icon">
            <Icon
                :icon="menus[rowIndex * column + colIndex].icon || 'icon-danxuanweixuanzhong'"
                :size="iconSize"
                @click="click(menus[rowIndex * column + colIndex])"
            />
            <view
                class="actionIcon"
                v-if="actionIcon && !noActionIconMenus.find(menu=>menu.code === menus[rowIndex * column + colIndex].code)"
                @click="$emit(actionIconType ==='remove' ? 'removeMenu' : 'addMenu',menus[rowIndex * column + colIndex])"
            >
              <u-icon
                  :name="actionIconType === 'remove' ? 'minus-circle-fill' : 'plus-circle-fill'"
                  :color="actionIconType === 'remove' ?'#bdbaba' : '#007aff'"
                  size="20"
              />
            </view>
          </view>

          <view
              class="menuName"
              :style="{fontSize:`${fontSize}px`}"
              @click="click(menus[rowIndex * column + colIndex])"
          >
            {{ menus[rowIndex * column + colIndex].name }}
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import Icon from "../Icon";
import {routes} from "../../route";

export default {
  name: 'MenuCard',
  components: {Icon},
  props: {
    menus: Array,
    noActionIconMenus: Array,
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
    padding: String,
    actionIcon: Boolean,
    actionIconType: String
  },
  data() {
    return {
      rows: [],
      cols: []
    }
  },
  watch: {
    menus(menus) {
      this.layout(menus)
    }
  },
  created() {
    this.layout(this.menus)
  },
  methods: {
    layout(menus) {
      this.rows = new Array(Math.ceil(menus.length / this.column)).fill('')
      this.cols = new Array(this.column).fill('')
    },
    click(menu) {
      this.$emit('click', routes.find(route => route.key === menu.code) || menu)
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


        .icon {
          position: relative;
          width: fit-content;
          display: inline-block;

          .actionIcon {
            position: absolute;
            right: -20px;
            top: -10px;
          }
        }


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
