<template>
  <view>
    <view class="joinTenantList">
      <u-tabs :list="tabs" @click="tabChange" :scrollable="false"></u-tabs>
      <Empty description="获取待审批用户列表失败！" type="error" v-if="error" />
      <Loading skeleton v-else-if="loading" />
      <template v-else>
        <Search v-model="searchValue" no-search-button />
        <view
            :style="{height:tabKey !== 'wait' ? 'calc(100vh - 58px)' : `calc(100vh - 58px - 45px + 8px - ${safeAreaHeight(this,8)}px)`}"
        >
          <Empty description="暂无数据" v-if="showList.length === 0" />
          <view
              v-for="(item,index) in showList"
              :key="index"
              class="user"
              @click="checkUser(item.tenantBindId)"
          >
            <Check v-if="tabKey === 'wait'" :value="checked.includes(item.tenantBindId)" />
            <view class="userInfo">
              <UserName :user="item.userResult" />
            </view>
            <view class="time">
              {{ timeDifference(item.createTime) }}
            </view>
          </view>
        </view>
        <view
            v-if="tabKey === 'wait'"
            class="action"
            :style="{paddingBottom:`${safeAreaHeight(this,8)}px`}"
        >
          <view class="allCheck">
            <Check
                v-if="list.length > 0"
                :value="list.length === checked.length"
                @change="allCheck"
            >
              {{ list.length === checked.length ? '取消全选' : '全选' }}
            </Check>
            <view>
              <view class="total">
                已选
                <view class="num">{{ checked.length }}</view>
                个
              </view>
            </view>
          </view>
          <view class="buttons">
            <MyButton
                :loading="submitLoading"
                :disabled="this.checked.length === 0"
                type="error"
                @click="reject"
            >
              拒绝
            </MyButton>
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
      </template>
    </view>


    <Modal ref="modal" />

  </view>
</template>

<script>
import Search from "../../../components/Search";
import List from "../../../components/List/indx";
import {Tenant} from "MES-Apis/lib/Tenant/promise";
import Check from "../../../components/Check";
import {queryString, safeAreaHeight, timeDifference} from "../../../util/Tools";
import MyButton from "../../../components/MyButton";
import {Init} from "MES-Apis/lib/Init";
import Modal from "../../../components/Modal";
import UserName from "../../../components/UserName";
import Empty from "../../../components/Empty";
import Loading from "../../../components/Loading";

export default {
  components: {Loading, Empty, UserName, Modal, MyButton, Check, List, Search},
  data() {
    return {
      safeAreaHeight,
      Tenant,
      list: [],
      timeDifference,
      checked: [],
      searchValue: '',
      defaultParams: {},
      error: false,
      tabKey: 'wait',
      loading: true,
      tabs: [
        {name: '待审批', key: 'wait'},
        {name: '已通过', key: 'pass'},
        {name: '已拒绝', key: 'reject'},
      ]
    }
  },
  computed: {
    showList() {
      return this.list.filter(item => {
        const user = item.userResult || {}
        return queryString(this.searchValue, user.name)
      })
    }
  },
  mounted() {
    this.getList(0)
  },
  methods: {
    tabChange({key}) {
      this.searchValue = ''
      this.tabKey = key
      switch (key) {
        case 'wait':
          this.getList(0)
          break;
        case 'pass':
          this.getList(99)
          break;
        case 'reject':
          this.getList(50)
          break
      }
    },
    getList(status) {
      this.loading = true
      Tenant.joinTenantAllList({
        data: {
          tenantId: this.$store.state.userInfo.tenant.tenantId,
          status
        }
      }).then((res) => {
        this.list = res.data
      }).catch(() => {
        this.error = true
      }).finally(() => {
        this.loading = false
      })
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
              uni.$emit('handleJoinTenant')
              _this.$refs.modal.dialog({
                title: '通过成功！',
                onConfirm() {
                  _this.checked = []
                  _this.getList(0)
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
    reject() {
      const _this = this
      this.$refs.modal.dialog({
        title: '确定拒绝' + this.checked.length + '个用户的申请吗',
        only: false,
        confirmText: '拒绝',
        confirmError: true,
        onConfirm() {
          return new Promise((resolve) => {
            Tenant.rejectJoinTenant({
              data: {
                tenantBindIds: _this.checked
              }
            }).then(() => {
              uni.$emit('handleJoinTenant')
              _this.$refs.modal.dialog({
                title: '拒绝成功！',
                onConfirm() {
                  _this.checked = []
                  _this.getList(0)
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
  margin: 0 -8px;

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

  .buttons {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>
