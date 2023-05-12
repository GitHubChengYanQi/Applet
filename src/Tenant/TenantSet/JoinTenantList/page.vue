<template>
  <view>
    <view class="joinTenantList">
      <Search v-model="searchValue" @onSearch="onSearch" />
      <List
          :default-limit="20"
          ref="list"
          :max-height="`calc(100vh - 60px)`"
          @request="Tenant.joinList"
          @listSource="listSource"
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
            <UserName size="45" :user="item.userResult">
              <view class="des">
                {{ item.inviterUserResult && item.inviterUserResult.name || '-' }}邀请加入{{
                  item.dept && item.dept.fullName
                }}{{ (item.dept && item.dept.fullName) ? '' : '团队' }}
              </view>
              <view class="des">
                {{ timeDifference(item.createTime) }}
              </view>
            </UserName>
          </view>
          <view class="action">
            <view class="buttons" v-if="item.status === 1">
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
            <view v-else-if="item.status === 99 || item.status === -1">
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
      type: '申请',
      tenantId: this.$store.state.userInfo.tenant.tenantId
    }
  },
  methods: {
    listSource(newList) {
      this.list = newList.map(item => {
        const newItem = this.list.find(listItem => listItem.tenantBindLogId === item.tenantBindLogId)
        return newItem || item
      })
    },
    refresh() {
      this.searchValue = ''
      this.onSearch()
    },
    onSearch() {
      this.$refs.list.submit({...this.defaultParams, keywords: this.searchValue})
      uni.stopPullDownRefresh();
    },
    checkUser(tenantBindLogId) {
      if (this.checked.includes(tenantBindLogId)) {
        this.checked = this.checked.filter(id => id !== tenantBindLogId)
      } else {
        this.checked = [...this.checked, tenantBindLogId]
      }
    },
    allCheck() {
      if (this.list.length === this.checked.length) {
        this.checked = []
      } else {
        this.checked = this.list.map(item => item.tenantBindLogId)
      }
    },
    submit(user) {
      const _this = this
      this.$refs.modal.dialog({
        title: '确定通过' + (user.userResult?.name || '-') + '的申请吗',
        only: false,
        onConfirm() {
          return new Promise((resolve) => {
            Tenant.updateJoinStatus({
              data: {
                tenantBindLogId: user.tenantBindLogId,
                status: 99
              }
            }).then(() => {
              uni.$emit('handleJoinTenant')
              _this.checked = []
              _this.list = _this.list.map(item => {
                if (item.tenantBindLogId === user.tenantBindLogId) {
                  return {...item, status: 99}
                } else {
                  return item
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
            Tenant.updateJoinStatus({
              data: {
                tenantBindLogId: user.tenantBindLogId,
                status: 50
              }
            }).then(() => {
              uni.$emit('handleJoinTenant')
              _this.checked = []
              _this.list = _this.list.map(item => {
                if (item.tenantBindLogId === user.tenantBindLogId) {
                  return {...item, status: 50}
                } else {
                  return item
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

      .des {
        font-size: 12px;
        color: #a4a2a2;
      }

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
