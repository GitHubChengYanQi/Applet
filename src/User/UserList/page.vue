<template>
  <view>

    <Empty v-if="error" type="error" description="获取信息异常" />
    <Loading
        skeleton-type="page"
        skeleton
        v-if="loading && this.deptPage.length === 0 && this.users.length === 0 && this.depts.length === 0"
    />
    <view
        v-else-if="noDept"
        class="allUser"
        :style="{ height: `calc(100vh - ${showFooter ? (47 + safeAreaHeight(this,10)) : 0}px)`}"
    >
      <u-index-list :index-list="groups.length === 0 ? [''] : groups.map(item=>item.title)">
        <view class="list">
          <Search style="padding: 0 12px" v-model="searchValue" placeholder="请输入成员姓名" />
          <Empty v-if="groups.length === 0" description="暂无用户" />
          <template v-else v-for="(item, index) in groups">
            <u-index-item>
              <view v-if="index !== 0" style="height: 32px;" />
              <u-index-anchor bgColor="#fff" :text="groups[index].title"></u-index-anchor>
              <view class="list-cell" v-for="(user, userIndex) in item.items" :key="userIndex">
                <view class="userInfo" @click="onCheckUser(user)">
                  <Check
                      v-if="!show"
                      :value="checkUsers.find(checkUser=>checkUser.userId === user.userId) && 'check'"
                  />
                  <UserName :user="user" no-dept />
                </view>
                <view v-if="user.isAdmin === 1">
                  <u-tag text="管理员" plain />
                </view>
              </view>
            </u-index-item>
          </template>
        </view>
        <view class="total" :style="{paddingBottom:showFooter ? '10px' : `${safeAreaHeight(this,10)}px`}">
          {{ total }} 个成员
        </view>
      </u-index-list>
    </view>
    <view v-else class="selectUser">
      <view class="header">
        <view style="padding-top: 8px" v-if="deptPage.length > 1">
          <uni-breadcrumb separator="/">
            <uni-breadcrumb-item v-for="(route,index) in deptPage" :key="index">
              <view @click="deptPageClick(route)">
                {{ route.name }}
              </view>
            </uni-breadcrumb-item>
          </uni-breadcrumb>
        </view>
        <Search
            placeholder="请输入成员姓名"
            :value="searchValue"
            @onChange="(value)=> searchValue = value"
            @onSearch="onSearch"
        />
      </view>
      <Empty v-if="users.length === 0 && depts.length === 0" description="暂无人员信息" />
      <view
          v-else
          class="users"
          :style="{height: `calc(100vh - ${showFooter ? (47+safeAreaHeight(this,8)) : 0}px - ${deptPage.length > 1 ? '85px': '58px'})`}"
      >
        <view
            v-if="deptPage.length > 1"
            class="item"
            @click="deptPageClick(deptPage[deptPage.length - 2])"
        >
          <view class="deptIcon" :style="{marginLeft:show ? 0 : 32}">
            <Icon icon="icon-bumen" size="35" />
          </view>
          <view class="backDept">返回上级部门</view>
        </view>
        <view
            v-for="item in users"
            :key="item.userId"
            class="item"
            @click="onCheckUser(item)"
        >
          <Check v-if="!show" :value="checkUsers.find(checkUser=>checkUser.userId === item.userId) && 'check'" />
          <UserName :user="item" no-dept />
        </view>

        <template v-if="!showAllUser">
          <view
              v-for="item in depts"
              :key="item.key"
              class="item"
              @click="onCheckDept(item,item.children)"
          >
            <view class="deptIcon" :style="{marginLeft:show ? 0 : 32}">
              <Icon icon="icon-bumen" size="35" />
            </view>
            {{ item.title }}
          </view>
        </template>

      </view>
      <Loading :loading="loading" />
    </view>

    <view v-if="showFooter" class="footer" :style="{paddingBottom:`${safeAreaHeight(this,8)}px`}">
      <template v-if="!tenant.admin">
        <view class="action">
          <LinkButton>添加成员</LinkButton>
        </view>
        <view class="action">
          <LinkButton>添加子部门</LinkButton>
        </view>
        <view class="action">
          <LinkButton>更多管理</LinkButton>
        </view>
      </template>
      <template v-else>
        <view class="checkUsers">
          <Avatar
              v-for="(user,index) in checkUsers"
              :key="index"
              size="35"
              :src='user.avatar'
              :text="!user.avatar ? user.name.substring(0,1) : null"
              @click="onCheckUser(user)"
          />
        </view>
        <MyButton type="primary" @click="click" :disabled="checkUsers.length === 0">
          确定 · {{ checkUsers.length }}
        </MyButton>
      </template>
    </view>
  </view>
</template>

<script>
import Search from "../../components/Search";
import {User} from "MES-Apis/lib/User/promise";
import Loading from "../../components/Loading";
import UserName from "../../components/UserName";
import Empty from "../../components/Empty";
import Avatar from "../../components/Avatar";
import {getLocalParmas, queryString, safeAreaHeight} from "../../util/Tools";
import MyButton from "../../components/MyButton";
import Check from "../../components/Check";
import Icon from "../../components/Icon";
import {pinyin} from "pinyin-pro";
import LinkButton from "../../components/LinkButton";

export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'SelectUser',
  props: ['checdUsers', 'type', 'show'],
  components: {LinkButton, Icon, Check, MyButton, Avatar, Empty, UserName, Loading, Search},
  data() {
    return {
      deptPage: [],
      loading: true,
      depts: [],
      users: [],
      checkUsers: [],
      searchValue: '',
      showAllUser: false,
      error: false,
      safeAreaHeight,
      groups: [],
      noDept: false,
      showFooter: false,
      total: 0,
      tenant: {}
    }
  },
  mounted() {
    const tenant = this.$store.state.userInfo.tenant || {}
    this.tenant = tenant
    this.showFooter = !this.show || !tenant.admin
    this.checkUsers = [...this.checdUsers]
    this.getList()
  },
  watch: {
    searchValue(searchValue) {
      if (!this.noDept) {
        return
      }
      this.renderList(this.users.filter((item) => {
        return queryString(searchValue, item.name)
      }))
    }
  },
  methods: {
    onSearch(value) {
      this.showAllUser = value
      this.loading = true
      User.userList({
        data: {
          userName: value,
          deptId: value ? null : this.deptPage[this.deptPage.length - 1].key
        }
      }).then((res) => {
        this.users = res.data || []
      }).catch(() => {

      })
      this.loading = false
    },
    async getList() {
      this.loading = true
      const res = await User.deptTree().catch(() => {
        this.error = true
      })
      const newDepts = res?.data[0]?.children || []
      // const newDepts = []

      const users = await User.userList({
        data: {
          deptId: newDepts.length === 0 ? null : 0
        }
      }).catch(() => {
        this.error = true
      })
      this.users = users.data || []


      this.loading = false
      if (newDepts.length === 0) {
        this.noDept = true
        this.renderList(users.data || [])
      } else {
        this.depts = newDepts
        this.deptPage = [{key: 0, name: '顶级', depts: newDepts}]
      }
    },
    onCheckUser(user) {
      const radio = this.type === 'radio'
      if (this.checkUsers.find(item => item.userId === user.userId)) {
        if (radio) {
          this.$emit('checkUsers', [])
          this.checkUsers = []
          return
        }
        const newCheckUsers = this.checkUsers.filter(item => item.userId !== user.userId)
        this.checkUsers = newCheckUsers
        this.$emit('checkUsers', newCheckUsers)
      } else {
        if (radio) {
          this.$emit('checkUsers', [user])
          this.checkUsers = [user]
          return
        }
        const newCheckUsers = [...this.checkUsers, user]
        this.checkUsers = newCheckUsers
        this.$emit('checkUsers', newCheckUsers)
      }
    },
    async onCheckDept(dept, depts) {
      this.loading = true
      await User.userList({
        data: {
          deptId: dept.key
        }
      }).then((res) => {
        this.users = res.data || []
      })
      this.depts = dept.children || []
      this.deptPage = [...this.deptPage, {key: dept.key, name: dept.title, depts: depts || []}]
      this.loading = false
    },
    async deptPageClick(route) {
      this.depts = route.depts || []
      this.loading = true
      await User.userList({
        data: {
          deptId: route.key
        }
      }).then((res) => {
        this.users = res.data || []
      })
      this.loading = false
      const newPage = []
      let stop = false
      this.deptPage.forEach(item => {
        if (!stop) {
          newPage.push(item)
        }
        if (item.key === route.key) {
          stop = true
        }
      })
      this.deptPage = newPage
    },
    click() {
      uni.$emit('selectUser', {
        id: getLocalParmas().search.id,
        checkUsers: this.checkUsers
      })
      uni.navigateBack();
    },
    renderList(users) {
      const charCodeOfA = 'A'.charCodeAt(0);
      this.total = users.length
      const groups = [];
      if (users.length > 0) {
        const useUser = []
        Array(26).fill('').forEach((_, i) => {
          const CharCode = String.fromCharCode(charCodeOfA + i);
          const newUsers = users.filter(item => {
            const name = item.name || ''
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

        const otherUsers = users.filter(item => {
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
    back() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss">

.navBar {
  .uni-navbar__header {

    > view {
      align-items: flex-end;
    }
  }

  .uni-navbar__content {
    border: none;
  }
}

.title {
  padding: 8px;
  font-size: 14px;
  text-align: center;
  width: 100%;

  .tenantName {
    font-size: 12px;
    color: #ccc;
  }
}

.back {
  height: 51px;
  display: flex;
  align-items: center;
}

.selectUser {

  .header {
    padding: 0 12px;
    background-color: #fff;
  }

  .users {
    overflow: auto;
    background-color: #fff;
    padding: 0 12px;
  }

}

.item {
  padding: 6px;
  border-bottom: solid 1px #f5f5f5;
  display: flex;
  align-items: center;
  gap: 8px;

  .deptIcon {
    //background-color: $body-color;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    margin-left: 32px;
  }

  .backDept {
    color: rgba(0,0,0,0.5);
  }
}


.allUser {
  background-color: #fff;

  .u-index-list {
    height: 100%;

    > scroll-view {
      max-height: 100% !important
    }
  }

  .list {
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
        display: flex;
        align-items: center;
        gap: 8px;

        .phone {
          font-size: 12px;
          color: #a4a2a2;
        }
      }
    }
  }

  .total {
    justify-content: center;
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
  }
}


.u-index-anchor {
  border: none;
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
