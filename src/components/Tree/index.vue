<template>
  <view>
    <view
        v-for="(item,index) in data"
        :key="index"
    >
      <view class="tree-item">
        <view @click="openClick(item)" v-if="expandIcon && isArray(item.children).length > 0">
          <u-icon :name="open(item) ? 'arrow-down-fill' : 'play-right-fill'" />
        </view>
        <view v-else-if="expandIcon" class="tree-space" />
        <view class="tree-title" @click="onCheck(item)">
          <Check
              :value="radio ? (value.key+'') === (item.key+'') : value.find(valueItem=>(valueItem.key+'') === (item.key+''))"
          />
          <Icon v-if="icon" :icon="icon" size="24" />
          {{ item.title }}
        </view>
      </view>
      <view class="tree-children" v-show="open(item)">
        <Tree
            :collapse="collapse"
            :radio="radio"
            :icon="icon"
            :multiple="multiple"
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
import Icon from "../Icon";

export default {
  name: 'Tree',
  components: {Icon, Check, Tree},
  props: ['data', 'value', 'tree', 'isChildren', 'radio', 'multiple', 'collapse', 'icon', 'expandIcon'],
  data() {
    return {
      isArray,
      openKeys: []
    }
  },
  mounted() {
    this.openKeys = this.collapse ? [] : this.data.map(item => item.key)
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
        this.input([...checkValue, value])
        return
      }
      const done = this.data.filter(item => {
        if (item.key === value.key) {
          return true
        } else {
          return checkValue.find(valueItem => valueItem.key === item.key)
        }
      }).length === this.data.length
      if (done) {
        this.$emit('done', [...checkValue, value])
      } else {
        this.input([...checkValue, value])
      }
    },
    onCheck(value) {
      if (this.radio) {
        if (this.value.key === value.key) {
          this.input({})
        } else {
          this.input(value)
        }
      } else if (this.multiple) {
        if (this.value.find(item => item.key === value.key)) {
          this.input(this.value.filter(item => value.key !== item.key))
        } else {
          this.input([...this.value, value])
        }
      } else {
        if (this.value.find(item => item.key === value.key)) {
          const childrens = []
          this.getChildrens(value.children, childrens)
          const parents = []
          this.getParents(isArray(this.tree), value.key, [], parents)
          const ids = [...childrens, ...parents, value].map(item => item.key)
          this.input(this.value.filter(item => !ids.includes(item.key)))
        } else {
          const childrens = []
          this.getChildrens(value.children, childrens)
          const checkValue = [...this.value, ...childrens.filter(item => !this.value.find(value => value.key === item.key))]
          this.done(checkValue, value)
        }
      }


    },
    input(value) {
      this.$emit('input', value)
    },
    getParents(data, key, items, parents) {
      if (parents.length > 0) {
        return
      }
      isArray(data).forEach(item => {
        if (item.key === key) {
          items.forEach(item => parents.push(item))
          return
        }
        this.getParents(item.children, key, [...items, item], parents)
      })
    },
    getChildrens(data, childrens) {
      isArray(data).forEach(item => {
        childrens.push(item)
        this.getChildrens(item.children, childrens)
      })
    }
  }
}
</script>


<style lang="scss">
.tree-item {
  //background-color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;

  .tree-title {
    display: flex;
    align-items: center;
    gap: 4px;
    width: 100%;
    padding: 8px;
    border-bottom: 1px solid #EDEDED;
  }

  .tree-space {
    width: 16px;
  }

}

.tree-children {
  padding-left: 12px;
}

</style>
