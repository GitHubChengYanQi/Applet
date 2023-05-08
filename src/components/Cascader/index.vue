<template>
  <view>
    <Empty description="暂无数据" v-if="data.length === 0" />
    <view class="aui-picker-main" v-else>
      <view class="aui-picker-nav" v-if="!noChildren">
        <view class="aui-picker-navitem"
              v-if="nav.length>0"
              v-for="(item, index) in nav"
              :key="index"
              :data-index="index"
              :class="[index==navCurrentIndex ? 'active' : '', 'aui-picker-navitem-'+index]"
              :style="{margin: nav.length>2 ? '0 10px 0 0' : '0 30px 0 0'}"
              @click.stop="_changeNav($event)"
        >{{ item.name }}
        </view>
        <view class="aui-picker-navitem"
              :key="nav.length"
              :data-index="nav.length"
              :class="[nav.length==navCurrentIndex ? 'active' : '', 'aui-picker-navitem-'+nav.length]"
              :style="{margin: nav.length>2 ? '0 10px 0 0' : '0 30px 0 0'}"
              @click.stop="_changeNav($event)"
        >
          请选择
        </view>
        <view class="aui-picker-navborder" :style="{left: navBorderLeft+'px'}"></view>
      </view>
      <view class="aui-picker-content" :style="{height:noChildren ? '100%' : 'calc(100% - 50px)'}">
        <view class="aui-picker-lists">
          <view class="aui-picker-list"
                v-for="(list, index) in queryItems.length + 1"
                :key="index"
                :data-index="index"
                :class="[index==navCurrentIndex ? 'active' : '']"
          >
            <view class="aui-picker-list-warp" v-if="index == 0">
              <view class="aui-picker-item"
                    v-for="(item, key) in items"
                    v-if="item.pid===0"
                    :key="key"
                    :data-pindex="index"
                    :data-index="key"
                    :data-id="item.id"
                    :data-pid="item.pid"
                    :data-name="item.name"
                    :class="{'active': result.length>index && result[index].id==item.id}"
                    :style="{'background': touchConfig.index==key && touchConfig.pindex==index ? touchConfig.style.background : ''}"
                    @click.stop="_chooseItem($event)"
                    @touchstart="_btnTouchStart($event)"
                    @touchmove="_btnTouchEnd($event)"
                    @touchend="_btnTouchEnd($event)"
              >{{ item.name }}
              </view>
            </view>
            <view class="aui-picker-list-warp" v-else>
              <view class="aui-picker-item"
                    v-for="(item, key) in queryItems[index-1]"
                    :key="key"
                    :data-pindex="index"
                    :data-index="key"
                    :data-id="item.id"
                    :data-pid="item.pid"
                    :data-name="item.name"
                    :class="{'active': result.length>index && result[index].id==item.id}"
                    :style="{'background': touchConfig.index==key && touchConfig.pindex==index ? touchConfig.style.background : ''}"
                    @click.stop="_chooseItem($event)"
                    @touchstart="_btnTouchStart($event)"
                    @touchmove="_btnTouchEnd($event)"
                    @touchend="_btnTouchEnd($event)"
              >{{ item.name }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {isArray} from "../../util/Tools";
import Empty from "../Empty";

export default {
  name: 'Cascader',
  components: {Empty},
  props: {
    changeOnSelect: {
      type: Boolean,
      default: true
    },
    value: {
      type: String,
      default: ''
    },
    layer: { //控制几级联动,默认无限级(跟随数据有无下级)
      type: Number,
      default: null
    },
    data: { //数据 如：[{id: '', name: '', children: [{id: '', name: ''}]}]
      type: Array,
      default() {
        return [
          // [{id: '', name: '', children: [{id: '', name: ''}]}]
        ]
      }
    }
  },
  data() {
    return {
      SHOW: false,
      FADE: -1,
      nav: [],
      items: [],
      queryItems: [],
      navCurrentIndex: 0,
      navBorderLeft: 40,
      noChildren: false,
      result: [],
      touchConfig: {
        index: -1,
        pindex: -1,
        style: {
          color: '#197DE0',
          background: '#EFEFEF'
        }
      }
    }
  },
  created() {

  },
  mounted() {
    this.noChildren = !this.data.find(item => isArray(item.children).length > 0)
    this.open()
  },
  methods: {
    // 打开
    open() {
      const _this = this;
      const data = _this.data;
      const items = _this._flatten(data, 0)
      _this.items = items
      const parents = this.getParents(items, this.value)
      const nav = parents.filter(item => {
        return items.filter(all => all.pid === item.id).length > 0
      })
      this.nav = nav
      this.queryItems = nav.map(item => {
        return items.filter(all => all.pid === item.id)
      })
      this.navCurrentIndex = nav.length
      this.result = parents
      if (!this.noChildren) {
        const _el = uni.createSelectorQuery().in(this).select(".aui-picker-navitem-" + nav.length);
        setTimeout(() => {
          _el.boundingClientRect(data => {
            _this.navBorderLeft = data.left + 20;
          }).exec();
        }, 100)
      }
    },
    getParents(arr, key) {
      let ids = []
      arr.forEach(item => {
        if (item.id === key) {
          ids = [...this.getParents(arr, item.pid), item]
        }
      })
      return ids
    },
    //重置
    reset() {
      const _this = this;
      _this.queryItems = [];
      _this.nav = [];
      _this.navBorderLeft = 40;
      _this.navCurrentIndex = 0;
      _this.result = [];
    },
    //导航栏切换
    _changeNav(e) {
      const _this = this;
      const index = Number(e.currentTarget.dataset.index);
      _this.navCurrentIndex = index;
      const _el = uni.createSelectorQuery().in(this).select(".aui-picker-navitem-" + index);
      _el.boundingClientRect(data => {
        _this.navBorderLeft = data.left + 20;
      }).exec();
    },
    //数据选择
    _chooseItem(e) {
      const _this = this;
      const id = e.currentTarget.dataset.id;
      const name = e.currentTarget.dataset.name;
      const pid = e.currentTarget.dataset.pid;
      const _arr = [];
      _this.result[_this.navCurrentIndex] = {id: id, name: name, pid: pid};
      _this.result = _this.result.filter((item, index) => index <= _this.navCurrentIndex)
      if (
          (!_this._isDefine(_this.layer) && _this._isDefine(_this._deepQuery(_this.data, id).children))
          ||
          (_this.navCurrentIndex < (Number(_this.layer) - 1) && _this._isDefine(_this._deepQuery(_this.data, id).children))
      ) { //有下级数据
        _this._deepQuery(_this.data, id).children.forEach(function (item, index) {
          _arr.push({id: item.id, name: item.name, pid: id});
        });
        if (_this.navCurrentIndex == _this.queryItems.length) { //选择数据
          _this.queryItems.push(_arr);
          _this.nav.push({name: name});
        } else { //重新选择数据
          _this.queryItems.splice(_this.navCurrentIndex + 1, 1);
          _this.nav.splice(_this.navCurrentIndex + 1, 1);
          _this.queryItems.splice(_this.navCurrentIndex, 1, _arr);
          _this.nav.splice(_this.navCurrentIndex, 1, {name: name});
        }
        _this.navCurrentIndex = _this.navCurrentIndex + 1;
        const _el = uni.createSelectorQuery().in(this).select(".aui-picker-navitem-" + _this.navCurrentIndex);
        setTimeout(() => {
          _el.boundingClientRect(data => {
            _this.navBorderLeft = data.left + 20;
            if (_this.changeOnSelect){
              _this.$emit("change", {id: id, name: name, pid: pid});
            }
          }).exec();
        }, 100)
      } else { //无下级数据
        _this.$emit("change", {id: id, name: name, pid: pid});
        _this.$emit("close");
      }
    },
    //递归遍历——将树形结构数据转化为数组格式
    _flatten(tree, pid) {
      return tree.reduce((arr, {id, name, children = []}) =>
          arr.concat([{id, name, pid}], this._flatten(children, id)), [])
    },
    //根据id查询对应的数据(如查询id=10100对应的对象)
    _deepQuery(tree, id) {
      let isGet = false;
      let retNode = null;

      function deepSearch(tree, id) {
        for (let i = 0; i < tree.length; i++) {
          if (tree[i].children && tree[i].children.length > 0) {
            deepSearch(tree[i].children, id);
          }
          if (id === tree[i].id || isGet) {
            isGet || (retNode = tree[i]);
            isGet = true;
            break;
          }
        }
      }

      deepSearch(tree, id);
      return retNode;
    },
    /***判断字符串是否为空
     @param {string} str 变量
     @example: aui.isDefine("变量");
     */
    _isDefine(str) {
      if (str == null || str == "" || str == "undefined" || str == undefined || str == "null" || str == "(null)" || str == 'NULL' || typeof (str) == 'undefined') {
        return false;
      } else {
        str = str + "";
        str = str.replace(/\s/g, "");
        if (str == "") {
          return false;
        }
        return true;
      }
    },
    _btnTouchStart(e) {
      const _this = this,
          index = Number(e.currentTarget.dataset.index),
          pindex = Number(e.currentTarget.dataset.pindex);
      _this.touchConfig.index = index;
      _this.touchConfig.pindex = pindex;
    },
    _btnTouchEnd(e) {
      const _this = this,
          index = Number(e.currentTarget.dataset.index),
          pindex = Number(e.currentTarget.dataset.pindex);
      _this.touchConfig.index = -1;
      _this.touchConfig.pindex = -1;
    },
  }
}
</script>

<style scoped>
/* ====================
  多级联动弹窗
 =====================*/
.aui-picker {
  width: 100vw;
  height: 100vh;
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  /* display: none; */
}

.aui-picker.aui-picker-in {
  -moz-animation: aui-fade-in .1s ease-out forwards;
  -ms-animation: aui-fade-in .1s ease-out forwards;
  -webkit-animation: aui-fade-in .1s ease-out forwards;
  animation: aui-fade-in .1s ease-out forwards;
}

.aui-picker.aui-picker-out {
  -moz-animation: aui-fade-out .1s ease-out forwards;
  -ms-animation: aui-fade-out .1s ease-out forwards;
  -webkit-animation: aui-fade-out .1s ease-out forwards;
  animation: aui-fade-out .1s ease-out forwards;
}

.aui-picker-main {
  width: 100vw;
  height: 50vh;
  background: #FFF;
}

.aui-picker.aui-picker-in .aui-picker-main {
  -moz-animation: aui-slide-up-screen .2s ease-out forwards;
  -ms-animation: aui-slide-up-screen .2s ease-out forwards;
  -webkit-animation: aui-slide-up-screen .2s ease-out forwards;
  animation: aui-slide-up-screen .2s ease-out forwards;
}

.aui-picker.aui-picker-out .aui-picker-main {
  -moz-animation: aui-slide-down-screen .2s ease-out forwards;
  -ms-animation: aui-slide-down-screen .2s ease-out forwards;
  -webkit-animation: aui-slide-down-screen .2s ease-out forwards;
  animation: aui-slide-down-screen .2s ease-out forwards;
}

.aui-picker-header {
  width: 100%;
  min-height: 50px;
  position: relative;
  z-index: 999;
  background: #F2F2F2;
  border-radius: 15px 15px 0 0;
}

.aui-picker-header::after {
  content: '';
  width: 100%;
  height: 1px;
  background: rgba(100, 100, 100, .3);
  -moz-transform: scaleY(.3);
  -ms-transform: scaleY(.3);
  -webkit-transform: scaleY(.3);
  transform: scaleY(.3);
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 999;
}

.aui-picker-title {
  line-height: 20px;
  text-align: center;
  font-size: 17px;
  color: #333;
  padding: 15px;
  box-sizing: border-box;
  position: absolute;
  left: 50px;
  right: 50px;
  top: 0;
}

.aui-picker-close.iconfont {
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #aaa;
  border-radius: 0 10px 0 0;
  position: absolute;
  right: 0;
  top: 0;
}

.aui-picker-content {
  width: 100%;
}

.aui-picker-nav {
  width: 100%;
  height: 50px;
  text-align: left;
  padding: 0 20px;
  margin: 0 0 1px 0;
  justify-content: flex-start;
  white-space: nowrap;
  box-sizing: border-box;
  position: relative;
  overflow: auto;
}

.aui-picker-nav::after {
  content: '';
  width: 100%;
  height: 1px;
  background: rgba(100, 100, 100, .3);
  -moz-transform: scaleY(.3);
  -ms-transform: scaleY(.3);
  -webkit-transform: scaleY(.3);
  transform: scaleY(.3);
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 999;
}

.aui-picker-navitem {
  width: 80px;
  line-height: 50px;
  font-size: 16px;
  margin: 0 30px 0 0;
  text-align: center;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.aui-picker-navitem.active {
  color: #197DE0;
}

.aui-picker-navborder {
  width: 40px;
  height: 3px;
  background: #197DE0;
  border-radius: 5px;
  transition: left .15s;
  position: absolute;
  left: 40px;
  bottom: 0;
}

.aui-picker-lists {
  width: 100%;
  height: 100%;
  justify-content: space-around;
  white-space: nowrap;
}

.aui-picker-list {
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
  display: none;
  vertical-align: top;
}

.aui-picker-list.active {
  display: inline-block;
}

.aui-picker-list-warp {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 15px 0;
  display: inline-block;
}

.aui-picker-item {
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding: 0 15px;
  box-sizing: border-box;
  font-size: 15px;
  color: #333;
  position: relative;
}

.aui-picker-item.active {
  color: #197DE0;
}

.aui-picker-item.active::after {
  content: '✔';
  font-size: 15px;
  color: #197DE0;
  position: absolute;
  top: 0px;
  right: 10px;
}

</style>
