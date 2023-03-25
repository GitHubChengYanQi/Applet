<template>
  <view>
    <scroll-view class="boms" scroll-y>
      <view class="header">
        <Card title="生产BOM数量">
          <template slot="extra">
            <ShopNumber action-show :value="number" @click="visible = true" />
          </template>
        </Card>
      </view>

      <Loading :skeleton="true" v-if="loading" />
      <view v-else>
        <Card
            :no-body="open !== item.bomId"
            no-left-border
            style="box-shadow: 0 5px 5px 0 #e1ebf6;margin-bottom: 16px;"
            body-style="padding-top:0;margin-top:8px"
            v-for="item in boms"
            :key="item.bomId"
            class="bomItem"
        >
          <view slot="title">
            <SkuItem
                extra-width="100px"
                :sku-result="isObject(item.skuResult)"
            >
              <template slot="otherData" class="user">
                负责人：
                <LinkButton @click="selectUser(item.bomId,item.user)">
                  {{ item.user ? item.user.name : '请选择负责人' }}
                </LinkButton>
              </template>
            </SkuItem>
          </view>
          <view slot="extra" class="extra">
            x {{ item.number }}
            <u-icon
                :name="open !== item.bomId ? 'arrow-down' : 'arrow-up'"
                color="#007aff"
                @click="open = open === item.bomId ? null : item.bomId"
            >

            </u-icon>
          </view>
          <view class="details">
            <view class="line"></view>
            <view
                v-for="(detailItem,index) in isArray(item.detailList)"
                :key="detailItem.skuId"
                class="detail"
            >
              <view :class="{detailItem:true,first:index === 0,end:index === isArray(item.detailList).length - 1}">
                <view class="skuItem">
                  <SkuItem img-size="60" extra-width="150px" :sku-result="isObject(detailItem.skuResult)" />
                </view>
                <ShopNumber show :value="detailItem.number" />
              </view>
            </view>
          </view>

        </Card>
        <BottomButton
            only
            text="创建生产任务"
        />
      </view>

      <keybord
          :visible='visible'
          @visiblChange="(value)=>visible = value"
          :value='number'
          :min='1'
          @onChange="onChange"
      />
    </scroll-view>
    <view style="height: 100px" />
  </view>

</template>

<script>
import {Bom} from "MES-Apis/lib/Bom/promise";
import {getLocalParmas, isArray, isObject} from "../../util/Tools";
import SkuItem from "../../components/SkuItem";
import ShopNumber from "../../components/ShopNumber";
import Loading from "../../components/Loading";
import Card from "../../components/Card";
import BottomButton from "../../components/BottomButton";
import LinkButton from "../../components/LinkButton";
import Keybord from "../../components/Keybord";

export default {
  name: 'BomDetailList',
  components: {Keybord, LinkButton, BottomButton, Card, Loading, ShopNumber, SkuItem},
  props: ['bomId'],
  data() {
    return {
      boms: [],
      isArray,
      isObject,
      loading: true,
      open: null,
      number: 1,
      visible: false,
    }
  },
  mounted() {
    const current = this
    uni.$on('selectUser', (res) => {
      const checkUser = res.checkUsers[0]
      current.boms = current.boms.map(item => {
        if (item.bomId === res.id) {
          return {...item, user: checkUser}
        }
        return item
      })
    })
    this.getBoms(1)
  },
  methods: {
    getBoms(number) {
      this.loading = true
      Bom.getByBomId({
        data: {
          partsId: this.bomId,
          number
        }
      }).then((res) => {
        this.boms = isArray(res.data).map(item => ({
          ...item,
          user: this.boms.find(bomItem => bomItem.bomId === item.bomId)?.user
        }))
      }).finally(() => {
        this.loading = false
      })
    },
    onChange(number) {
      this.number = number
      this.getBoms(number)
    },
    selectUser(bomId, user) {
      uni.navigateTo({
        url: `/User/SelectUser/index?id=${bomId}&type=radio`,
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('clickDept', {
            checkUsers: user ? [user] : [],
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">

.boms {
  background-color: #fff;
  padding-top: 51px;

  .header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1;
    background-color: #fff;
    box-shadow: 0 5px 5px 0 #e1ebf6;
  }
}

.bomItem {
  background-color: #fff;
  padding-bottom: 4px;
}

.user {
  padding-top: 4px;
  display: flex;
  align-items: center;
}

.extra {
  display: flex;
  align-items: center;
  gap: 8px;
}

.details {
  padding-left: 12px;

  .line {
    padding: 8px;
    border: solid 1px #cacaca;
    border-top: none;
    margin: -12px -14px 0 -26px;
  }

  .detail {
    position: relative;


    .detailItem {
      display: flex;
      align-items: center;
      padding: 6px 0;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -12px;
        width: 1px;
        height: 100%;
        background-color: #cacaca;
        margin: auto;
      }

      &::after {
        content: "";
        position: absolute;
        left: -12px;
        width: 12px;
        height: 1px;
        background-color: #cacaca;
        margin: auto;
      }

      .skuItem {
        flex-grow: 1;
      }
    }


    .first {
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -12px;
        width: 1px;
        height: 100%;
        background-color: #cacaca;
        margin: auto;
      }
    }

    .end {
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -12px;
        width: 1px;
        height: 50%;
        background-color: #cacaca;
        margin: auto;
      }
    }
  }
}


</style>
