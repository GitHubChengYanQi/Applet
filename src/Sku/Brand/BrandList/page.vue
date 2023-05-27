<template>
  <view class="brandList">
    <view style="padding: 0 12px">
      <Search v-model="searchValue" @onSearch="onSearch" />
    </view>
    <view class="manage">
      <List
          ref="list"
          :max-height=" `calc(100vh - 58px - ${47+safeAreaHeight(this,8)}px)`"
          :default-limit="20"
          @request="Sku.brandList"
          @listSource="(newList)=>brandList = newList"
          :list="brandList"
      >
        <view
            v-for="(brand,index) in brandList"
            :key="index"
            class="item"
            @click="type ? onCheck(brand) : editbrand(brand)"
        >
          <Check v-if="type" :value="checkBrands.find(item=>item.brandId === brand.brandId)" />
          <view class="itemIon">
            <Icon icon="icon-a-pinpai1" size="35" />
          </view>
          {{ brand.brandName }}
        </view>
      </List>
    </view>

    <view class="footer" :style="{paddingBottom:`${safeAreaHeight(this,8)}px`}">
      <view class="action" v-if="!type">
        <LinkButton @click="addSkuClass">添加品牌</LinkButton>
      </view>
      <template v-else>
        <view class="checkBrands">
          <Avatar
              v-for="(brand,index) in checkBrands"
              :key="index"
              size="35"
              :text="brand.brandName.substring(0,1)"
              @click="onCheck(brand)"
          />
        </view>
        <view class="actionButton">
          <MyButton @click="addSkuClass">
            新增
          </MyButton>
          <MyButton type="primary" @click="saveCheck" :disabled="checkBrands.length === 0">
            确定 · {{ checkBrands.length }}
          </MyButton>
        </view>
      </template>
    </view>

    <Modal ref="addBrandModal">
      <u--input
          placeholder="请输入品牌名称"
          clearable
          v-model="brandName"
      />
    </Modal>

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
import {getLocalParmas, safeAreaHeight} from "../../../util/Tools";
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
  props: ['defaultChecdBrands', 'type'],
  name: 'SelectUser',
  components: {List, Modal, AddUser, LinkButton, Icon, Check, MyButton, Avatar, Empty, UserName, Loading, Search},
  watch: {
    defaultChecdBrands(checkBrands) {
      this.checkBrands = [...checkBrands]
    }
  },
  data() {
    return {
      Sku,
      checkBrands: [],
      brandList: [],
      actionBrand: {},
      safeAreaHeight,
      brandName: '',
      brandActionShow: false,
      searchValue: '',
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
    this.checkBrands = [...this.defaultChecdBrands]
  },
  methods: {
    onSearch(value) {
      this.$refs.list.submit({brandName: value})
    },
    brandActionSelect({key}) {
      const _this = this
      const thisbrand = this.actionBrand
      switch (key) {
        case 'edit':
          _this.brandName = thisbrand.brandName
          _this.$refs.addBrandModal.dialog({
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
      _this.$refs.addBrandModal.dialog({
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
      this.actionBrand = brand
      this.brandActionShow = true
    },
    onCheck(brand) {
      const radio = this.type === 'radio'
      if (this.checkBrands.find(item => item.brandId === brand.brandId)) {
        if (radio) {
          this.$emit('checkBrands', [])
          this.checkBrands = []
          return
        }
        const newCheckBrands = this.checkBrands.filter(item => item.brandId !== brand.brandId)
        this.checkBrands = newCheckBrands
        this.$emit('checkBrands', newCheckBrands)
      } else {
        if (radio) {
          this.$emit('checkBrands', [brand])
          this.checkBrands = [brand]
          return
        }
        const newCheckBrands = [...this.checkBrands, brand]
        this.checkBrands = newCheckBrands
        this.$emit('checkBrands', newCheckBrands)
      }
    },
    saveCheck() {
      uni.$emit('checkBrands', {
        id: getLocalParmas().search.id,
        checkBrands: this.checkBrands
      })
      uni.navigateBack();
    }
  }
}
</script>

<style lang="scss">
.brandList {
  background-color: #fff;
  height: 100vh;
}

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

  .checkBrands {
    height: 35px;
    max-width: 50%;
    display: flex;
    align-items: center;
    gap: 4px;
    overflow: auto;
  }

  .actionButton {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
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
