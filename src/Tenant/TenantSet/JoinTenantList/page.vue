<template>
  <view>
    <view class="joinTenantList">
      <Search v-model="searchValue" @onSearch="onSearch" />
      <List
          :default-limit="20"
          ref="list"
          :max-height="`calc(100vh - 60px)`"
          @request="Tenant.joinTenantList"
          @listSource="(newList)=>list = newList"
          :list="list"
          :default-params="defaultParams"
          @response="(res)=>total = res.count"
      >
        <view
            v-for="(item,index) in list"
            :key="index"
            class="user"
        >
          <view class="userInfo">
            <UserName :user="item.userResult" />
          </view>
          <view class="action">
            <view class="buttons" v-if="item.status === 0">
              <MyButton
                  type="error"
                  @click="reject(item)"
              >
                拒绝
              </MyButton>
              <MyButton
                  type="primary"
                  @click="submit(item)"
              >
                通过
              </MyButton>
            </view>
            <view v-else-if="item.status === 50">
              已拒绝
            </view>
            <view v-else>
              已同意
            </view>
          </view>
        </view>
      </List>
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
import {Init} from "MES-Apis/lib/Init";
import Modal from "../../../components/Modal";
import UserName from "../../../components/UserName";

export default {
  options: {
    styleIsolation: 'shared'
  },
  components: {UserName, Modal, MyButton, Check, List, Search},
  data() {
    return {
      safeAreaHeight,
      Tenant,
      list: [],
      timeDifference,
      checked: [],
      searchValue: '',
      defaultParams: {},
      total: 0
    }
  },
  created() {
    this.defaultParams = {
      tenantId: this.$store.state.userInfo.tenant.tenantId
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
    allCheck() {
      if (this.list.length === this.checked.length) {
        this.checked = []
      } else {
        this.checked = this.list.map(item => item.tenantBindId)
      }
    },
    submit(user) {
      const _this = this
      this.$refs.modal.dialog({
        title: '确定通过' + (user.userResult?.name || '-') + '的申请吗',
        only: false,
        onConfirm() {
          return new Promise((resolve) => {
            Tenant.agreeJoinTenant({
              data: {
                tenantBindIds: [user.tenantBindId]
              }
            }).then(() => {
              uni.$emit('handleJoinTenant')
              _this.$refs.modal.dialog({
                title: '通过成功！',
                onConfirm() {
                  _this.checked = []
                  _this.list = _this.list.map(item => {
                    if (item.tenantBindId === user.tenantBindId) {
                      return {...item, status: 99}
                    } else {
                      return item
                    }
                  })
                  return true
                }
              })
              resolve(true)
            }).catch(() => {
              _this.$refs.modal.dialog({
                title: Init.getNewErrorMessage() || '通过失败！'
              })
              resolve(false)
            })
          })
        }
      })
    },
    reject(user) {
      const _this = this
      this.$refs.modal.dialog({
        title: '确定拒绝' + (user.userResult?.name || '-') + '的申请吗',
        only: false,
        confirmText: '拒绝',
        confirmError: true,
        onConfirm() {
          return new Promise((resolve) => {
            Tenant.rejectJoinTenant({
              data: {
                tenantBindIds: [user.tenantBindId]
              }
            }).then(() => {
              uni.$emit('handleJoinTenant')
              _this.$refs.modal.dialog({
                title: '拒绝成功！',
                onConfirm() {
                  _this.checked = []
                  _this.list = _this.list.map(item => {
                    if (item.tenantBindId === user.tenantBindId) {
                      return {...item, status: 50}
                    } else {
                      return item
                    }
                  })
                  return true
                }
              })
              resolve(true)
            }).catch(() => {
              _this.$refs.modal.dialog({
                title: Init.getNewErrorMessage() || '拒绝失败！'
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

    .action {
      color: #c7c7c7;
      font-size: 14px;

      .buttons {
        display: flex;
        align-items: center;
        gap: 8px;

        button {
          font-size: 12px;
          padding: 4px 8px;
        }
      }
    }
  }
}

.total {
  padding: 12px;
  text-align: center;
  color: #c7c7c7;
}
</style>
