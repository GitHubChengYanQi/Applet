<template>
  <view>
    <view
        v-for="(item,index) in data"
        :key="index"
    >
      <view class="item">
        <view @click="openClick(item)" v-if="isArray(item.children).length > 0">
          <u-icon :name="open(item) ? 'arrow-down-fill' : 'play-right-fill'" />
        </view>
        <view v-else class="space" />
        <view class="title" @click="onCheck(item)">
          <Check :value="radio ? value.key === item.key : value.find(id=>id === item.key)" />
          {{ item.title }}
        </view>
      </view>
      <view class="children" v-show="open(item)">
        <Tree
            :radio="radio"
            :data="isArray(item.children)"
            :tree="isChildren ? tree : data"
            @input="input"
            :value="value"
            :isChildren="true"
            @done="(checkValue)=>done(checkValue,item)"
        />
      </view>
    </view>
  </view>
</template>

<script>
import Check from "../Check";
import {isArray} from "../../util/Tools";
import Tree from './index'

export default {
  name: 'Tree',
  components: {Check, Tree},
  props: ['data', 'value', 'tree', 'isChildren', 'radio'],
  data() {
    return {
      isArray,
      openKeys: []
    }
  },
  mounted() {
    this.openKeys = this.data.map(item => item.key)
  },
  methods: {
    openClick(item) {
      if (this.open(item)) {
        this.openKeys = this.openKeys.filter(id => id !== item.key)
      } else {
        this.openKeys = [...this.openKeys, item.key]
      }
    },
    open(item) {
      return this.openKeys.find(id => id === item.key)
    },
    done(checkValue, value) {
      if (!this.isChildren) {
        this.input([...checkValue, value.key])
        return
      }
      const done = this.data.filter(item => {
        if (item.key === value.key) {
          return true
        } else {
          return checkValue.find(id => id === item.key)
        }
      }).length === this.data.length
      if (done) {
        this.$emit('done', [...checkValue, value.key])
      } else {
        this.input([...checkValue, value.key])
      }
    },
    onCheck(value) {
      if (this.radio) {
        if (this.value.key === value.key) {
          this.input({})
        } else {
          this.input(value)
        }
      } else {
        if (this.value.find(item => item === value.key)) {
          const childrenIds = []
          this.getChildrens(value.children, childrenIds)
          const parentIds = []
          this.getParentIds(isArray(this.tree), value.key, [], parentIds)
          this.input(this.value.filter(item => ![...childrenIds, ...parentIds, value.key].includes(item)))
        } else {
          const childrenIds = []
          this.getChildrens(value.children, childrenIds)
          const checkValue = [...this.value, ...childrenIds.filter(id => !this.value.find(value => value === id))]
          this.done(checkValue, value)
        }
      }


    },
    input(value) {
      this.$emit('input', value)
    },
    getParentIds(data, key, ids, parentIds) {
      if (parentIds.length > 0) {
        return
      }
      isArray(data).forEach(item => {
        if (item.key === key) {
          ids.forEach(item => parentIds.push(item))
          return
        }
        this.getParentIds(item.children, key, [...ids, item.key], parentIds)
      })
    },
    getChildrens(data, ids) {
      isArray(data).forEach(item => {
        ids.push(item.key)
        this.getChildrens(item.children, ids)
      })
    }
  }
}
</script>


<style lang="scss">
.item {
  padding: 8px;
  //background-color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;

  .title {
    display: flex;
    align-items: center;
  }

  .space {
    width: 16px;
  }

}

.children {
  padding-left: 30px;
}

</style>
