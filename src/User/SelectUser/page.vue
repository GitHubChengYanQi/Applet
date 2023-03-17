<template>
  <view class="selectUser">
    <view class="box">
      <view class="header">
        <view style="padding-top: 8px">
          <uni-breadcrumb v-if="deptPage.length > 1" separator="/">
            <uni-breadcrumb-item v-for="(route,index) in deptPage" :key="index">
              <view @click="deptPageClick(route)">
                {{ route.name }}
              </view>
            </uni-breadcrumb-item>
          </uni-breadcrumb>
        </view>
        <Search
            :value="searchValue"
            @onChange="(value)=> searchValue = value"
            @onSearch="onSearch"
        />
      </view>
      <Loading :loading="loading" />
      <view class="content">
        <Empty v-if="users.length === 0 && depts.length === 0" description="暂无人员信息" />
        <view v-else class="users" :style="{  height: `calc(100vh - 130px - ${safeAreaHeight}px)`}">
          <view
              v-for="item in users"
              :key="item.userId"
              class="item"
              @click="onCheckUser(item)"
          >
            <view>
              <u-radio-group
                  @change="onCheckUser(item)"
                  :value="checkUsers.find(checkUser=>checkUser.userId === item.userId) && 'check'"
              >
                <u-radio name="check" />
              </u-radio-group>
            </view>
            <UserName :user="item" no-dept />
          </view>

          <view v-if="!showAllUser">
            <view
                v-for="item in depts"
                :key="item.key"
                class="item"
                @click="onCheckDept(item,item.children)"
            >
              <view class="icon">

              </view>
              {{ item.title }}
            </view>
          </view>

        </view>
      </view>
      <view class="footer" :style="{paddingBottom:`${safeAreaHeight}px`}">
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
        <VantButton @click="click" :disabled="checkUsers.length === 0">确定 · {{ checkUsers.length }}</VantButton>
      </view>
    </view>

  </view>
</template>

<script>
import Search from "../../components/Search";
import {User} from "MES-Apis/src/User/promise";
import Loading from "../../components/Loading";
import UserName from "../../components/UserName";
import VantButton from "../../components/VantButton";
import Empty from "../../components/Empty";
import Avatar from "../../components/Avatar";
import {getLocalParmas} from "../../util/Tools";

export default {
  name: 'SelectUser',
  props: ['checdUsers'],
  components: {Avatar, Empty, VantButton, UserName, Loading, Search},
  data() {
    return {
      deptPage: [],
      loading: true,
      depts: [],
      users: [],
      checkUsers: [],
      searchValue: '',
      showAllUser: false,
      safeAreaHeight: 0,
    }
  },
  mounted() {
    const safeAreaHeight = this.$store.state.systemInfo.systemInfo.safeAreaInsets.bottom
    this.safeAreaHeight = safeAreaHeight < 12 ? 12 : safeAreaHeight
    this.checkUsers = [...this.checdUsers]
    this.getList()
  },
  methods: {
    onSearch(value) {
      this.showAllUser = value
      this.loading = true
      User.userList({
        data: {
          userName: value,
          deptId: value ? null : this.deptPage[this.deptPage.length - 1]
        }
      }).then((res) => {
        this.users = res.data || []
      })
      this.loading = false
    },
    async getList() {
      this.loading = true
      await User.userList({
        data: {
          deptId: 0
        }
      }).then((res) => {
        this.users = res.data || []
      })
      const res = await User.deptTree()
      const newDepts = res?.data[0]?.children || []
      this.depts = newDepts
      this.deptPage = [{key: 0, name: '顶级', depts: newDepts}]
      this.loading = false
    },
    onCheckUser(user) {
      const radio = getLocalParmas().search.type === 'radio'
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
      this.depts = dept.children || []
      this.loading = true
      await User.userList({
        data: {
          deptId: dept.key
        }
      }).then((res) => {
        this.users = res.data || []
      })
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
    }
  }
}
</script>

<style lang="scss">

.selectUser {
  height: 100vh;
  background-color: #eee;

  .users {
    overflow: auto;
  }
}

.item {
  padding: 6px;
  border-bottom: solid 1px #f5f5f5;
  display: flex;
  align-items: center;
  gap: 8px;

  .icon {
    background-color: $body-color;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    margin-left: 32px;
  }
}

.box {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .header {
    padding: 0 12px;
    background-color: #fff;
  }

  .content {
    flex-grow: 1;
    padding: 0 12px;
    background-color: #fff;
  }

  .footer {
    display: flex;
    align-items: center;
    padding: 12px;

    .checkUsers {
      height: 35px;
      flex-grow: 1;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
}


</style>
