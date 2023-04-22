<template>
  <view>
    <Loading skeleton-type="page" skeleton v-if="loading" />
    <Empty v-else-if="groups.length === 0" description="暂无用户" />
    <view v-else>
      <u-index-list :index-list="groups.map(item=>item.title)">
        <template v-for="(item, index) in groups">
          <u-index-item>
            <u-index-anchor bgColor="#f5f5f5" :text="groups[index].title"></u-index-anchor>
            <view class="list-cell" v-for="(cell, index) in item.items" :key="index">
              <view class="userInfo">
                {{ cell.userResult ? cell.userResult.name : '-' }}
                <view class="phone">
                  {{ cell.userResult ? cell.userResult.phone : '-' }}
                </view>
              </view>
            </view>
          </u-index-item>
        </template>
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

    <AddUser :add-user-show="addUserShow" @close="addUserShow = false" />
  </view>
</template>

<script>
import {pinyin} from 'pinyin-pro';
import {Tenant} from "MES-Apis/lib/Tenant/promise";
import Loading from "../../../components/Loading";
import Empty from "../../../components/Empty";
import {User} from "MES-Apis/lib/User/promise";
import {safeAreaHeight} from "../../../util/Tools";
import MyButton from "../../../components/MyButton";
import AddUser from "../components/AddUser";

export default {
  components: {AddUser, MyButton, Empty, Loading},
  data() {
    return {
      groups: [],
      loading: false,
      safeAreaHeight,
      total: 0,
      addUserShow: false
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.loading = true
      const tenant = this.$store.state.userInfo.tenant || {}
      Tenant.joinTenantAllList({data: {tenantId: tenant.tenantId, status: 99}}).then((res) => {
        const users = res.data || []
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
      }).finally(() => {
        this.loading = false
      })

    }
  }
}
</script>

<style lang="scss">
.list-cell {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 24px;
  overflow: hidden;
  color: #323233;
  line-height: 24px;
  background-color: #fff;
  border-bottom: solid 1px $body-color;

  .userInfo {
    flex-grow: 1;

    .phone {
      font-size: 12px;
      color: #a4a2a2;
    }
  }
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
