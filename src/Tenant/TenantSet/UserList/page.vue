<template>
  <view>
    <Loading skeleton-type="page" skeleton v-if="loading" />
    <view v-else>
      <u-index-list :index-list="groups.length === 0 ? [''] : groups.map(item=>item.title)">
        <view class="list">
          <Search style="padding: 0 12px" v-model="searchValue" />
          <Empty v-if="groups.length === 0" description="暂无用户" />
          <template v-else v-for="(item, index) in groups">
            <u-index-item>
              <view v-if="index !== 0" style="height: 32px;" />
              <u-index-anchor bgColor="#fff" :text="groups[index].title"></u-index-anchor>
              <view class="list-cell" v-for="(cell, cellIndex) in item.items" :key="cellIndex">
                <view class="userInfo" @click="openUserAction(cell)">
                  <UserName :user="cell.userResult" />
                </view>
                <view v-if="cell.isAdmin === 1">
                  <u-tag text="管理员" plain />
                </view>
              </view>
            </u-index-item>
          </template>
        </view>
        <view :style="{height:`${45+safeAreaHeight(this,8)}px`}"></view>
      </u-index-list>
      <view class="action" :style="{paddingBottom:`${safeAreaHeight(this,8)}px`}">
        <view class="allCheck">
          <view>
            <view class="total">
              <view class="num">{{ total }}</view>
              位用户
            </view>
          </view>
        </view>
        <view>
          <MyButton
              type="primary"
              @click="addUserShow=true"
          >
            添加用户
          </MyButton>
        </view>
      </view>
    </view>

    <u-action-sheet
        @close="showActions = false"
        :actions="actionList"
        :show="showActions"
        @select="actionSelect"
    />

    <AddUser :add-user-show="addUserShow" @close="addUserShow = false" />

    <Modal ref="modal" />

  </view>
</template>

<script>
import {pinyin} from 'pinyin-pro';
import {Tenant} from "MES-Apis/lib/Tenant/promise";
import Loading from "../../../components/Loading";
import Empty from "../../../components/Empty";
import {queryString, safeAreaHeight} from "../../../util/Tools";
import MyButton from "../../../components/MyButton";
import AddUser from "../components/AddUser";
import Modal from "../../../components/Modal";
import {Message} from "../../../components/Message";
import {Init} from "MES-Apis/lib/Init";
import UserName from "../../../components/UserName";
import Search from "../../../components/Search";

export default {
  options: {
    styleIsolation: 'shared'
  },
  components: {Search, UserName, Modal, AddUser, MyButton, Empty, Loading},
  data() {
    return {
      groups: [],
      loading: false,
      safeAreaHeight,
      total: 0,
      actionUser: {},
      addUserShow: false,
      showActions: false,
      tenant: {},
      users: {},
      searchValue: '',
      actionList: [
        {
          name: '移出团队',
          key: 'del',
          color: '#dd524d',
        },
      ]
    }
  },
  mounted() {
    this.tenant = this.$store.state.userInfo.tenant || {}
    this.getUserList()
  },
  watch: {
    searchValue(searchValue) {
      this.renderList(this.users.filter((item) => {
        const userResult = item.userResult || {}
        return queryString(searchValue, userResult.name)
      }))
    }
  },
  methods: {
    getUserList() {
      this.loading = true
      Tenant.joinTenantAllList({data: {tenantId: this.tenant.tenantId, status: 99}}).then((res) => {
        const users = res.data || []
        this.users = users
        this.renderList(users)
      }).finally(() => {
        this.loading = false
      })
    },
    renderList(users) {
      const charCodeOfA = 'A'.charCodeAt(0);
      const groups = [];
      this.total = users.length
      if (users.length > 0) {
        const useUser = []
        Array(26).fill('').forEach((_, i) => {
          const CharCode = String.fromCharCode(charCodeOfA + i);
          const newUsers = users.filter((item, index) => {
            const name = item.userResult.name || ''
            const pys = pinyin(name, {pattern: 'first', toneType: 'none', type: 'array'});
            const first = pys[0];
            return first.toUpperCase() === CharCode
          });
          if (newUsers.length === 0) {
            return;
          }
          newUsers.forEach(item => {
            useUser.push(item)
          })
          groups.push({
            title: CharCode,
            items: newUsers,
          });
        });

        const otherUsers = users.filter((item, index) => {
          return !useUser.find(useItem => useItem.tenantBindId === item.tenantBindId)
        })
        if (otherUsers.length > 0) {
          groups.push({
            title: '#',
            items: otherUsers,
          });
        }
      }
      this.groups = groups
    },
    openUserAction(user) {
      if (!this.tenant.admin) {
        return
      }
      this.showActions = true
      this.actionUser = user
    },
    actionSelect({key}) {
      const _this = this
      switch (key) {
        case 'del':
          this.$refs.modal.dialog({
            title: `确认要把【${_this.actionUser?.userResult?.name || '-'}】移出团队吗？`,
            only: false,
            confirmText: '移除团队',
            confirmError: true,
            onConfirm() {
              return new Promise((resolve) => {
                Tenant.removeTenantUser({
                  data: {
                    tenantBindId: _this.actionUser.tenantBindId
                  }
                }).then(() => {
                  resolve(true)
                  _this.getUserList()
                  Message.successToast('移出成功！')
                }).catch(() => {
                  resolve(true)
                  _this.$refs.modal.dialog({
                    title: Init.getNewErrorMessage() || '移出失败！'
                  })
                })
              })
            }
          })
          return
      }
    }
  }
}
</script>

<style lang="scss">

.list {
  background-color: #fff;
}

.list-cell {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: calc(100% - 15px);
  padding: 10px 15px 10px 0;
  margin-left: 15px;
  overflow: hidden;
  color: #323233;
  line-height: 24px;
  background-color: #fff;
  border-bottom: solid 1px #F5F5F5;

  .userInfo {
    flex-grow: 1;

    .phone {
      font-size: 12px;
      color: #a4a2a2;
    }
  }
}

.u-index-anchor {
  border: none;
}

.action {
  z-index: 1;
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
