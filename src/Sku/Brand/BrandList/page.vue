<template>
  <view>
    <view class="manage" :style="{height: `calc(100vh - ${47+safeAreaHeight(this,8)}px)`}">
      <List
          @request="Sku.brandList"
          @listSource="(newList)=>brandList = newList"
          :list="brandList"
      >
        <view
            v-for="(brand,index) in brandList"
            :key="index"
            class="item"
            @click="editbrand(brand)"
        >
          <view class="itemIon">
            <Icon icon="icon-bumen1" size="30" />
          </view>
          {{ brand.brandName }}
        </view>
      </List>
    </view>

    <view class="footer" :style="{paddingBottom:`${safeAreaHeight(this,8)}px`}">
      <view class="action">
        <LinkButton @click="addSkuClass">添加品牌</LinkButton>
        <Modal ref="addbrandModal">
          <u--input
              placeholder="请输入品牌名称"
              clearable
              v-model="brandName"
          />
        </Modal>
      </view>
    </view>

    <u-action-sheet
        cancelText="取消"
        :actions="brandActionList"
        :show="brandActionShow"
        @close="brandActionShow = false"
        @select="brandActionSelect"
    />

    <Modal ref="modal" />
  </view>
</template>

<script>
import Search from "../../../components/Search";
import Loading from "../../../components/Loading";
import UserName from "../../../components/UserName";
import Empty from "../../../components/Empty";
import Avatar from "../../../components/Avatar";
import {safeAreaHeight} from "../../../util/Tools";
import MyButton from "../../../components/MyButton";
import Check from "../../../components/Check";
import Icon from "../../../components/Icon";
import LinkButton from "../../../components/LinkButton";
import AddUser from "../../../components/AddUser";
import Modal from "../../../components/Modal";
import {Message} from "../../../components/Message";
import {Init} from "MES-Apis/lib/Init";
import {Sku} from "MES-Apis/lib/Sku/promise";
import List from "../../../components/List/indx";

export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'SelectUser',
  components: {List, Modal, AddUser, LinkButton, Icon, Check, MyButton, Avatar, Empty, UserName, Loading, Search},
  data() {
    return {
      Sku,
      brandList: [],
      actionbrand: {},
      safeAreaHeight,
      brandName: '',
      brandActionShow: false,
      brandActionList: [
        {
          name: '修改品牌名',
          key: 'edit',
        },
        {
          name: '删除品牌',
          key: 'delete',
          color: 'red'
        }
      ]
    }
  },
  mounted() {

  },
  methods: {
    brandActionSelect({key}) {
      const _this = this
      const thisbrand = this.actionbrand
      switch (key) {
        case 'edit':
          _this.brandName = thisbrand.brandName
          _this.$refs.addbrandModal.dialog({
            title: '修改品牌名',
            only: false,
            confirmText: '修改',
            onConfirm() {
              return new Promise((resolve) => {
                if (!_this.brandName) {
                  Message.toast('请输入品牌名称！')
                  resolve(false)
                  return
                }
                Sku.brandEdit({
                  data: {
                    brandId: thisbrand.brandId,
                    brandName: _this.brandName
                  }
                }).then(() => {
                  _this.brandList = _this.brandList.map(item => {
                    if (item.brandId === thisbrand.brandId) {
                      return {...item, brandName: _this.brandName}
                    }
                    return item
                  })
                  resolve(true)
                }).catch(() => {
                  _this.$refs.modal.dialog({
                    title: Init.getNewErrorMessage() || '修改失败!'
                  })
                  resolve(true)
                })
              })
            }
          })
          break;
        case 'delete':
          _this.$refs.modal.dialog({
            title: '删除后不可恢复，是否确认删除？',
            content: '删除品牌【' + thisbrand.brandName + '】',
            only: false,
            confirmError: true,
            onConfirm() {
              return new Promise((resolve) => {
                Sku.brandDelete({
                  data: {
                    brandId: thisbrand.brandId
                  }
                }).then(() => {
                  _this.brandList = _this.brandList.filter(item => item.brandId !== thisbrand.brandId)
                  resolve(true)
                }).catch(() => {
                  _this.$refs.modal.dialog({
                    title: Init.getNewErrorMessage() || '删除失败!'
                  })
                  resolve(true)
                })
              })
            }
          })
          break
      }
    },
    addSkuClass() {
      const _this = this
      _this.brandName = ''
      _this.$refs.addbrandModal.dialog({
        title: '添加品牌',
        only: false,
        confirmText: '添加',
        onConfirm() {
          return new Promise((resolve) => {
            if (!_this.brandName) {
              Message.toast('请输入品牌名称！')
              resolve(false)
              return
            }
            Sku.brandAdd({
              data: {
                brandName: _this.brandName,
              }
            }).then((res) => {
              _this.brandList = [{brandName: _this.brandName, brandId: res.data}, ..._this.brandList]
              resolve(true)
            }).catch(() => {
              _this.$refs.modal.dialog({
                title: Init.getNewErrorMessage() || '添加失败!'
              })
              resolve(true)
            })
          })
        }
      })
    },
    editbrand(brand) {
      this.actionbrand = brand
      this.brandActionShow = true
    }
  }
}
</script>

<style lang="scss">

.manage {
  overflow: auto;
  background-color: #fff;
  padding: 0 12px;
}

.item {
  padding: 6px;
  border-bottom: solid 1px #f5f5f5;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #fff;

  .itemIon {
    //background-color: $body-color;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
  }

}

.footer {
  display: flex;
  align-items: center;
  padding: 12px;
  z-index: 1;
  position: fixed;
  bottom: 0;
  background-color: #eee;
  width: calc(100% - 24px);

  .checkUsers {
    height: 35px;
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .action {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35px;
  }
}


</style>
