<template>
  <view class="productionCard">
    <u-notify ref="uNotify" />
    <view class="input">
      <uni-easyinput
          :value="cardCoding"
          placeholder="请输入卡片编码"
          @input="input"
      />
    </view>
    <view v-if="cardCoding" class="cardList">
      <Loading :skeleton="true" v-if="loading" />
      <view v-else>
        <view
            v-for="(item,index) in cardList"
            :key="index"
            class="cardItem"
            @click="searchCard(item)"
        >
          <view class="coding">
            <u-icon name="bookmark" size="24"></u-icon>
            <view style="height: 21px">
              {{ item.cardCoding || '' }}
            </view>
          </view>
          <u-icon name="search" size="24" color="#007aff"></u-icon>
        </view>
      </view>
    </view>
    <view v-else>
      <Divider style="margin:16px">
        <view class='divider'>
          或
        </view>
      </Divider>
      <view class='scan'>
        <view class='scanStyle' @click="scan">
          <Icon icon="icon-dibudaohang-saoma-copy" size="30" />
        </view>
      </view>
    </view>

    <Modal ref="modal" />

  </view>
</template>

<script>
import Icon from "../../components/Icon";
import {Production} from "MES-Apis/lib/Production/promise";
import Loading from "../../components/Loading";
import {Message} from "../../components/Message";
import Modal from "../../components/Modal";
import Divider from "../../components/Divider";

export default {
  props: ['cardId'],
  components: {Divider, Modal, Loading, Icon},
  data() {
    return {
      cardList: [],
      cardCoding: '',
      time: '',
      loading: false,
    }
  },
  mounted() {
    if (this.cardId) {
      this.goToDetail(this.cardId)
    }
    this.$refs.uNotify.show({
      type: 'primary ',
      message: '请输入卡片编码或扫描卡片二维码进行操作',
      duration: 0,
      safeAreaInsetTop: false
    })
  },
  methods: {
    scan() {
      const _this = this
      uni.scanCode({
        success: function (res) {
          let error = true
          if (res.result) {
            const card = res.result
            if (card.indexOf('KP') !== -1) {
              error = false
              _this.goToDetail(card.replace('KP'))
            }
          }
          if (res.path) {
            const cardId = res.path.split('scene=')[1]
            if (cardId) {
              error = false
              _this.goToDetail(cardId)
            }
          }

          if (error) {
            _this.$refs.modal.dialog({
              title: '请扫正确的卡片二维码！'
            })
          }

        }
      });
    },
    goToDetail(cardId) {
      uni.navigateTo({
        url: `/Production/ProductionCardDetail/index?cardId=${cardId}`
      })
    },
    searchCard(cardItem) {
      this.goToDetail(cardItem.productionCardId)
    },
    search(value) {
      this.loading = true
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        Production.productionCardList({
          page: 1,
          limit: 10,
          data: {
            cardCoding: value
          }
        }).then((res) => {
          this.cardList = res.data || []
        }).finally(() => {
          this.loading = false
        })
      }, 500);
    },
    input(value) {
      this.cardCoding = value
      this.search(value)
    }
  }
}
</script>

<style lang="scss">
.productionCard {
  background-color: #fff;
  height: 100vh;

  .input {
    padding: 50px 12px 0;
  }

  .cardList {
    max-height: calc(100vh - 150px);
    overflow: auto;

    .cardItem {
      padding: 10px 15px;
      border-bottom: 1px #eee solid;
      display: flex;
      align-items: center;

      .coding {
        flex-grow: 1;
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  }
}

.divider {
  font-size: 20px;
  color: #808080;
  margin: 0;
  border-color: #F5F5F5;
}

.scan {
  margin-top: 31px;

  .scanStyle {
    width: 80px;
    height: 80px;
    background: #D9D9D9;
    border-radius: 50px;
    box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;

    svg {
      font-size: 30px;
      color: #fff;
    }
  }
}
</style>
