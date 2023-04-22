<template>
  <view>
    <view class="joinTenantList">
      <Search v-model="searchValue" @onSearch="onSearch" />
      <List
          ref="list"
          :max-height="`calc(100vh - 103px - ${safeAreaHeight(this,8)}px)`"
          @request="Tenant.joinTenantList"
          @listSource="(newList)=>list = newList"
          :list="list"
          :default-params="defaultParams"
      >
        <view
            v-for="(item,index) in list"
            :key="index"
            class="user"
            @click="checkUser(item.tenantBindId)"
        >
          <Check :value="checked.includes(item.tenantBindId)" />
          <view class="userInfo">
            {{ item.userResult ? item.userResult.name : '-' }}
            <view class="phone">
              {{ item.userResult ? item.userResult.phone : '-' }}
            </view>
          </view>
          <view class="time">
            {{ timeDifference(item.createTime) }}
          </view>
        </view>
      </List>
    </view>

    <view class="action" :style="{paddingBottom:`${safeAreaHeight(this,8)}px`}">
      <view class="allCheck">
        <view>
          <view class="total">
            已选
            <view class="num">{{ this.checked.length }}</view>
            个
          </view>
        </view>
      </view>
      <view>
        <MyButton
            :loading="submitLoading"
            :disabled="this.checked.length === 0"
            type="primary"
            @click="submit"
        >
          通过
        </MyButton>
      </view>
    </view>

    <Modal ref="modal" />

  </view>
</template>

<script>
import Search from "../../../components/Search";
import List from "../../../components/List/indx";
import {Tenant} from "MES-Apis/lib/Tenant/promise";
import Check from "../../../components/Check";
import {safeAreaHeight, timeDifference} from "../../../util/Tools";
import MyButton from "../../../components/MyButton";
import {Message} from "../../../components/Message";
import {Init} from "MES-Apis/lib/Init";
import Modal from "../../../components/Modal";

export default {
  components: {Modal, MyButton, Check, List, Search},
  data() {
    return {
      safeAreaHeight,
      Tenant,
      list: [],
      timeDifference,
      checked: [],
      searchValue: '',
      defaultParams: {}
    }
  },
  created() {
    this.defaultParams = {
      tenantId: this.$store.state.userInfo.tenant.tenantId,
      status: 0
    }
  },
  methods: {
    onSearch() {
      this.$refs.list.submit({...this.defaultParams, keywords: this.searchValue})
    },
    checkUser(tenantBindId) {
      if (this.checked.includes(tenantBindId)) {
        this.checked = this.checked.filter(id => id !== tenantBindId)
      } else {
        this.checked = [...this.checked, tenantBindId]
      }
    },
    submit() {
      const _this = this
      this.$refs.modal.dialog({
        title: '确定同意' + this.checked.length + '个用户的申请吗',
        only: false,
        onConfirm() {
          return new Promise((resolve) => {
            Tenant.agreeJoinTenant({
              data: {
                tenantBindIds: _this.checked
              }
            }).then(() => {
              _this.onSearch()
              _this.$refs.modal.dialog({
                title: '通过成功！'
              })
              resolve(true)
            }).catch(() => {
              _this.$refs.modal.dialog({
                title: Init.getNewErrorMessage() || '通过失败！'
              })
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.joinTenantList {
  background-color: #fff;
  height: 100vh;
  padding: 0 8px;

  .user {
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: solid 1px $body-color;

    .userInfo {
      flex-grow: 1;

      .phone {
        font-size: 12px;
        color: #a4a2a2;
      }
    }

    .time {
      font-size: 12px;
      color: #cccccc;
    }
  }
}

.action {
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 0;
  background-color: #fff;
  width: calc(100% - 24px);
  padding: 8px 12px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);

  .allCheck {
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 8px;

    .total {
      margin-top: -4px;

      .num {
        display: inline-block;
        color: $primary-color;
        padding: 0 4px;
        font-size: 20px;
      }
    }
  }
}
</style>
