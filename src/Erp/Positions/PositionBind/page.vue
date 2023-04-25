<template>
  <view>
    <view class="header">
      <Icon icon="icon-cangkuguanli1" size="26" />
      {{ store }}
      <Icon icon="icon-pandiankuwei1" size="22" />
      {{ position }}
    </view>
    <Loading :skeleton="true" v-if="loading" />
    <Empty description="暂无绑定物料，请添加" v-else-if="list.length === 0" />
    <view v-else :style="{maxHeight:`calc(100vh - 43px - 60px - ${safeAreaHeight(this)}px)`}">
      <view class="bindSkus">
        <view
            v-for="(item,index) in list"
            :key="index"
            class="bindSku"
        >
          <view class="skuItem">
            <SkuItem :sku-result="item.skuResult" extra-width="100px" />
          </view>
          <view>
            <Remove @click="remove(item)" />
          </view>
        </view>
      </view>
    </view>

    <BottomButton
        only
        text="新增物料"
        @onClick="openAddSku"
    />

    <Popup
        title="物料列表"
        :show="show"
        @close="show = false"
        @showBefore="skuListShow = true"
        @closeAfter="skuListShow=false"
    >
      <view class="skuList">
        <Search v-model="skuListSearchValue" @onSearch="skuListSearch" />
        <view style="height: 60vh" v-if="skuListShow">
          <List
              ref="skuList"
              :list="skuList"
              max-height="60vh"
              @request="Sku.listV1_1"
              @listSource="listSource"
          >
            <view
                v-for="(item,index) in skuList"
                :key="index"
                class="skuItem"
            >
              <view class="sku">
                <SkuItem :sku-result="skuResultFormat(item)" extra-width="100px" />
              </view>
              <view @click="addSku(item.skuId)" v-if="!list.find(bindItem=>bindItem.skuId === item.skuId)">
                <u-icon name="plus-circle" color="#007aff" size="24" />
              </view>
            </view>
          </List>
        </view>
      </view>
    </Popup>

    <Modal ref="modal" />

  </view>
</template>

<script>
import Search from "../../../components/Search";
import List from "../../../components/List/index";
import {Storehouse} from "MES-Apis/lib/Storehouse/promise";
import SkuItem from "../../../components/SkuItem";
import Icon from "../../../components/Icon";
import BottomButton from "../../../components/BottomButton";
import {isArray, safeAreaHeight} from "../../../util/Tools";
import Remove from "../../../components/Remove";
import {Message} from "../../../components/Message";
import Popup from "../../../components/Popup";
import {Sku} from "MES-Apis/lib/Sku/promise";
import Loading from "../../../components/Loading";
import Empty from "../../../components/Empty";
import Modal from "../../../components/Modal";

export default {
  components: {Modal, Empty, Loading, Popup, Remove, BottomButton, Icon, SkuItem, List, Search},
  props: ['storehousePositionsId', 'position', 'store'],
  data() {
    return {
      show: false,
      safeAreaHeight,
      Sku,
      Storehouse,
      list: [],
      skuList: [],
      skuImages: [],
      skuListSearchValue: '',
      skuListShow: false,
      loading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      Storehouse.positionsBindList({
        data: {positionId: this.storehousePositionsId}
      }).then((res) => {
        this.list = res.data || []
      }).finally(() => {
        this.loading = false
      })
    },
    openAddSku() {
      this.show = true
      this.skuListSearchValue = ''
    },
    skuListSearch(value) {
      this.$refs.skuList.submit({keyWord: value})
    },
    skuResultFormat(item) {
      const media = this.skuImages.find(mediaItem => mediaItem.mediaId === item.images?.split(',')[0]) || {}
      return {
        ...item,
        thumbUrl: media.thumbUrl
      }
    },
    remove(item) {
      const _this = this
      this.$refs.modal.dialog({
        title: '删除后不可恢复，确定删除吗？',
        only: false,
        onConfirm() {
          return new Promise((resolve) => {
            Storehouse.positionsBindDelete({
              data: {bindId: item.bindId}
            }).then(() => {
              _this.list = _this.list.filter(listItem => listItem.bindId !== item.bindId)
              resolve(true)
            }).catch(() => {
              Message.errorToast('删除失败！')
              resolve(false)
            })

          })
        }
      })
    },
    async listSource(skuList, newSkuList) {
      this.skuList = skuList
      await Sku.getMediaUrls({
        mediaIds: newSkuList.map(item => item.images?.split(',')[0]),
        option: 'image/resize,m_fill,h_74,w_74',
      }).then((res) => {
        isArray(res?.data).map(item => {
          this.skuImages.push(item)
        })
      }).catch(() => {
      })
    },
    addSku(skuId) {
      const _this = this
      this.addLoading = true
      Storehouse.positionsBindAdd({
        data: {
          positionId: this.storehousePositionsId,
          skuId: skuId,
          spuId: skuId
        }
      }).then(() => {
        this.$refs.modal.dialog({
          title: '添加成功！',
          onConfirm() {
            _this.show = false
            _this.getList()
            return true
          }
        })
      }).catch(() => {
        this.$refs.modal.dialog({
          title: '添加失败！'
        })
      }).finally(() => {
        this.addLoading = false
      })
    }
  }
}
</script>

<style lang="scss">
.header {
  padding: 12px;
  border-bottom: 1px solid $body-color;
  display: flex;
  gap: 8px;
  background-color: #fff;
}

.bindSkus {
  padding: 8px;

  .bindSku {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background-color: #fff;
    margin-bottom: 4px;
    border-radius: 4px;

    .skuItem {
      flex-grow: 1;
    }
  }
}

.skuList {
  padding: 0 12px;

  .skuItem {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-bottom: solid 1px #eee;

    .sku {
      flex-grow: 1;
    }
  }
}


</style>
