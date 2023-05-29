<template>
  <view>
    <view class="header">
      <view class="title" @click="() => show = 'spuClass'">
        <view v-if="formData.spuClassName">
          {{ formData.spuClassName }}
        </view>
        <view v-else>
          商品分类
        </view>
      </view>
      <view class="flexGrow">
        <u-button
            type='primary'
            color="#f5f5f5"
            icon="search"
            iconColor="#000000"
            @click="() => show = 'search'"
        >
          <view style="color: #000000">搜索</view>
        </u-button>
      </view>
    </view>

    <view class="content">
      <List
          ref="skuList"
          :list="skuList"
          max-height="calc(100vh - 103px)"
          @request="Sku.listV1_1"
          @listSource="listSource"
      >
        <view v-for="(item,index) in skuList" :key="index" class="skuItem"
              @click="() => click(index,show = 'skuDetail')">
          <view class="spuName"> {{ item.spuName }}</view>
          <view class="specifications" v-if="item.specifications">
            规格:{{ item.specifications }}
          </view>
          <view class="stock" v-if="item.specifications" style="padding: 0">
            库存:{{ item.stockNum || 0 }}{{ item.unitName }}
          </view>
          <view v-else class="stock">
            库存:{{ item.stockNum || 0 }}{{ item.unitName }}
          </view>
          <view class="price">
            <view class="flexGrow"> 单价:{{ item.price }}</view>
            <view>
              <u-number-box
                  @focus="() =>show = ''"
                  :value="number(item.skuId)"
                  min="0"
                  @change="(val) =>valChange(index,val)"></u-number-box>
            </view>
          </view>
        </view>
      </List>
    </view>

    <view class="float" @click="fabClick">
      <u-button
          type="primary"
          icon="plus"
          iconColor="#FFFFFF"
          size="large"
          customStyle="border-radius: 50%;height: 55px;box-shadow: 0 1px 5px 2px rgba(0,0,0,0.3)"
      ></u-button>
    </view>


    <view class="bottomButton">
      <view class="cart" @click="()=> show = 'cart'">
        <view style="display: inline-block">
          <u-icon size="30" name="shopping-cart"/>
          <view class="fixed">
            1
          </view>
          已选
        </view>
      </view>
      <view class='button' @click="goBack">
        <u-button
            type="primary"
        >
          确定
        </u-button>
      </view>
      <view style="width: 100%">
        <u-safe-bottom></u-safe-bottom>
      </view>
    </view>


    <u-popup
        :show="['search'].includes(show)"
        mode="top"
        closeOnClickOverlay
        round="10"
        @close="() => show = ''"
    >
      <view class="header">
        <view class="title" @click="() => show = 'spuClass'">
          <view v-if="formData.spuClassName">
            {{ formData.spuClassName }}
          </view>
          <view v-else>
            商品分类
          </view>
        </view>
        <view class="flexGrow">
          <u-button
              type='primary'
              color="#f5f5f5"
              icon="search"
              iconColor="#000000"
          >
            <view style="color: #000000">搜索</view>
          </u-button>
        </view>
      </view>
      <view class="souSuo">搜索</view>
      <view class="search">
        <u--input
            placeholder="请输入关键字"
            border="none"
            v-model="value"
        ></u--input>
      </view>
      <view class="searchButton">
        <u-button
            type='primary'
            customStyle="border-radius: 50px"
        >
          搜索
        </u-button>
      </view>
    </u-popup>

    <u-popup
        :show="['spuClass'].includes(show)"
        mode="top"
        closeOnClickOverlay
        round="10"
        @close="() => show = ''"
    >
      <view class="header">
        <view class="title" @click="() => show = 'spuClass'">
          <view v-if="formData.spuClassName">
            {{ formData.spuClassName }}
          </view>
          <view v-else>
            商品分类
          </view>
        </view>
        <view class="flexGrow">
          <u-button
              type='primary'
              color="#f5f5f5"
              icon="search"
              iconColor="#000000"
              @click="() => show = 'search'"
          >
            <view style="color: #000000">搜索</view>
          </u-button>
        </view>
      </view>
      <view class="souSuo">商品分类</view>
      <view class="list" style="border: none">
        <view v-for="(value, index) in cateGoryData" :class="{'onClickStyle':clickFlag === index ? 'style' : '' }"
              :key="index"
              class="list"
              @click="() => onClick('spuClassName', value.title , index)">
          {{ value.title }}
        </view>
      </view>
    </u-popup>

    <u-popup
        :show="['skuDetail'].includes(show)"
        mode="top"
        closeOnClickOverlay
        @close="() => show = ''"
        customStyle="margin: 10px 10px 0 10px;border-radius:10px"
        v-for="(item,index) in chick.skuList"
        :key="index"
    >
      <view class="popupTitle">
        <view class="flexGrow">{{ item.spuName }}</view>
        <view @click="() =>show = ''">
          <u-icon name="close"/>
        </view>
      </view>
      <view class="standard">编号:{{ item.standard }} 规格:{{ item.specifications }}</view>
      <view class="popupContent">
        <view class="unit">
          <view class="flexGrow">单位</view>
          {{ item.unitName }}
        </view>
        <view class="number">
          <view class="flexGrow">数量</view>
          <u-number-box
              min="0"
              :value="check(item.skuId)"
              @change="change"
          >
          </u-number-box>
        </view>
        <view class="number">
          <view class="flexGrow">单价</view>
          {{ item.stockNum || 0 }}
        </view>
        <view class="number">
          <view class="flexGrow">金额</view>
          {{ MathCalc(item.stockNum, formData.number, 'cheng') }}
        </view>
        <view class="number">
          <view class="flexGrow">备注</view>
          <view>
            <u-input
                border="none"
                placeholder="请输入"
                inputAlign="right"
                fontSize="12px"
            >
            </u-input>
          </view>
        </view>
      </view>
      <view class="popupBottom">
        <view class="delete" @click="onDelete">
          <u-button>删除</u-button>
        </view>
        <view class="determine" @click="()=> show = ''">
          <u-button
              type="primary"
          >确定
          </u-button>
        </view>
      </view>
    </u-popup>

    <u-popup
        round="10"
        :show="['cart'].includes(show)"
        closeOnClickOverlay
        @close="()=> show = ''"
        mode="bottom">
      <view class="name">
        <view class="flexGrow">
          已选商品
        </view>
        <view @click="() => show = ''">
          <u-icon name="close"/>
        </view>
      </view>
      <view style="margin-bottom: 50%"></view>
    </u-popup>


  </view>
</template>

<script>

import SkuItem from "@/components/SkuItem/index.vue";
import List from "@/components/List/index.vue";
import {Sku as SkuApis, Sku} from "MES-Apis/lib/Sku/promise";
import {isArray, MathCalc} from "@/util/Tools";
import Popup from "@/components/Popup/index.vue";
import Keybord from "@/components/Keybord/index.vue";
import loadingPage from "uview-ui/libs/config/props/loadingPage";

export default {
  name: "page",
  components: {Keybord, Popup, List, SkuItem},
  data() {
    return {
      clickFlag: Number,
      index: "",
      value: '',
      show: '',
      showContent: false,
      formData: {},
      Sku,
      chick: {},
      newSku: {},
      skuList: [],
      skuImages: [],
      cateGoryData: [],
    }
  },
  mounted() {
    const _this = this
    _this.getCateGory();
  },
  methods: {
    MathCalc,
    async listSource(skuList, newSkuList) {
      this.skuList = skuList
      if (newSkuList.length > 0) {
        await Sku.getMediaUrls({
          mediaIds: newSkuList.map(item => item.images?.split(',')[0]),
          option: 'image/resize,m_fill,h_74,w_74',
        }).then((res) => {
          isArray(res?.data).map(item => {
            this.skuImages.push(item)
          })
        }).catch(() => {
        })
      }
    },
    skuResultFormat(item) {
      const media = this.skuImages.find(mediaItem => mediaItem.mediaId === item.images?.split(',')[0]) || {}
      return {
        ...item,
        thumbUrl: media.thumbUrl
      }
    },
    async getCateGory() {
      const response = await SkuApis.spuClassTreeView({data: {}});
      const {data} = response;
      this.cateGoryData = data

    },
    addClass() {
      uni.navigateTo({
        url: '/Sku/SkuClass/SkuClassAdd/index'
      })
    },
    onClick(key, value, index) {
      this.formData = {
        ...this.formData,
        [key]: value
      }
      this.clickFlag = index;
      this.show = ''
    },
    fabClick() {
      uni.navigateTo({
        url: '/Sku/SkuAdd/index'
      })
    },
    valChange(key, e) {
      let list = []
      let info = []
      this.skuList.map((item, index) => {
        if (index === key) {
          list = {
            skuId: item.skuId,
            number: e.value,
            skuResult: item
          }
        } else {

        }
        this.newSku = {
          ...list,
        }
      })
    },
    change(e) {
      let list = []
      this.chick.skuList.map(item => {
        list = {
          skuId: item.skuId,
          number: e.value,
          skuResult: item
        }
      })
      this.newSku = {
        ...this.newSku,
        ...list
      }
    },
    click(key) {
      this.skuList.map((item, index) => {
        if (index === key) {
          let skuList = []
          skuList.push(item)
          this.chick = {
            skuList
          }
        }
      })
    }
    ,
    onDelete() {
      this.skuList = this.skuList.filter(item => item.skuId !== this.chick.skuList[0].skuId)
      this.show = ''
    }
    ,
    goBack() {
      uni.navigateBack();
    },
    check(skuId) {
      if (skuId === this.newSku.skuId) {
        return this.newSku.number
      } else {
        return 0
      }
    },
    number(skuId) {
      if (skuId === this.newSku.skuId) {
        return this.newSku.number
      } else {
        return 0
      }
    }
  },
}
</script>

<style lang="scss">

.header {
  display: flex;
  height: 35px;
  padding: 12px 10px 0 10px;
  align-items: center;

  .title {
    background: #F5F5F5;
    border-radius: 10px;
    text-align: center;
    width: 60px;
    padding: 7px;
    margin: 0 35px 0 0;
    font-size: 14px;
  }

  .flexGrow {
    flex-grow: 1;

    button {
      border-radius: 10px;
      height: 33px;
    }
  }
}

.content {
  margin: 15px 10px 0 10px;
  background: #FFFFFF;
  border-radius: 10px;

  .skuItem {
    padding: 8px 12px;
    border-bottom: solid 1px #eee;
  }
}


.bottomButton {
  padding: 0 20px 0 5px;
  //height: 60px;
  z-index: 5;
  width: calc(100% - 24px);
  max-width: 640px;
  position: fixed;
  display: flex;
  bottom: 0;
  left: auto;
  right: auto;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 -4px 10px 0 rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;


  .button {
    flex-grow: 1;

    button {
      border-radius: 50px;
      width: 100%;
      height: 40px;
    }
  }
}

.cart {
  width: 40%;
  text-align: center;
  font-size: 14px;
}

.souSuo {
  padding: 10px;
  font-weight: bold;
  font-size: 18px;
}

.search {
  margin: 5px 10px;
  background: #F5F5F5;
  padding: 5px 10px;
}

.searchButton {
  margin: 10px;

}

.list {
  padding: 10px;
  border-bottom: 1px solid #F5F5F5;
}

.list:nth-of-type(1) {
  padding: 10px;
  border-top: 1px solid #F5F5F5;
}

.onClickStyle {
  color: #257BDE;
}

.spuName {
  font-weight: bold;
  font-size: 16px;
}

.specifications {
  padding: 7px 0 0 0;
  font-size: 12px;
  height: 30px;
  display: flex;
  align-items: center;
}

.stock {
  padding: 7px 0 0 0;
  font-size: 12px;
  display: flex;
  height: 30px;
  align-items: center;
}

.price {
  display: flex;
  align-items: center;
  font-size: 12px;

  .flexGrow {
    flex-grow: 1;
  }
}

.float {
  width: 55px;
  height: 55px;
  position: absolute;
  bottom: 15%;
  left: 80%;
}

.fixed {
  color: #FFFFFF;
  text-align: center;
  width: 15px;
  height: 15px;
  vertical-align: middle;
  box-sizing: content-box;
  border-radius: 100px;
  background-color: #FA8F2B;
  right: 75%;
  top: 0;
  position: absolute;
  font-size: 12px;
}

.popupTitle {
  font-size: 12px;
  font-weight: bold;
  padding: 10px 10px 0 10px;
  display: flex;

  .flexGrow {
    flex-grow: 1;
  }
}

.standard {
  padding: 10px;
  font-size: 12px;
  border-bottom: 1px solid #f5f5f5;
}

.popupContent {
  padding: 10px;
  font-size: 12px;
}

.unit {
  display: flex;
  padding: 0 0 10px 0;
  border-bottom: 1px solid #F5F5F5;

  .flexGrow {
    flex-grow: 1;
  }
}

.number {
  display: flex;
  padding: 10px 0 10px 0;
  border-bottom: 1px solid #F5F5F5;
  align-items: center;

  .flexGrow {
    flex-grow: 1;
  }
}

.popupBottom {
  display: flex;
  padding: 10px;

  .delete {
    min-width: 20%;

    button {
      border-radius: 50px;
      background: #f5f5f5;
    }
  }

  .determine {
    margin-left: 35px;
    flex-grow: 1;


    button {
      border-radius: 50px;
    }
  }
}

.name {
  display: flex;
  padding: 10px;
  font-weight: bold;
  font-size: 14px;
  border-bottom: 1px solid #F5F5F5;

  .flexGrow {
    flex-grow: 1;
  }
}


</style>