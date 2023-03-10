<template>
  <view class="boms">
    <Card style="position: sticky;top:0" title="生产BOM数量">
      <template slot="extra">
        <ShopNumber action-show :value="number" @click="visible = true" />
      </template>
    </Card>
    <Loading :skeleton="true" v-if="loading" />
    <view v-else>
      <Card
          :no-body="open !== item.bomId"
          no-left-border
          body-style="border-top:solid 1px #f5f5f5;padding-top:0;margin-top:8px"
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
        <view>
          <view
              v-for="item in isArray(item.detailList)"
              :key="item.skuId"
              class="detailItem"
          >
            <view class="skuItem">
              <SkuItem img-size="60" extra-width="120px" :sku-result="isObject(item.skuResult)" />
            </view>
            <ShopNumber show :value="item.number" />
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
  </view>
</template>

<script>
import {Bom} from "MES-Apis/src/Bom/promise";
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
  padding-bottom: 100px;
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

.detailItem {
  display: flex;
  align-items: center;
  padding: 6px 0;

  .skuItem {
    flex-grow: 1;
  }
}
</style>
