<template>
  <view>
    <page-container
        :show="pageContainerShow"
        :duration="false"
        :overlay="false"
        @afterleave="afterleave"
    />
    <Empty v-if="error" type="error" description="获取信息异常" />
    <Loading
        skeleton-type="page"
        skeleton
        v-else-if="loading"
    />
    <view
        v-else-if="noDept"
        class="allUser"
        :style="{ height: `calc(100vh - ${showFooter ? (47 + safeAreaHeight(this,10)) : 0}px)`}"
    >
      <u-index-list :index-list="groups.length === 0 ? [''] : groups.map(item=>item.title)">
        <view class="list">
          <Search style="padding: 0 12px" v-model="searchValue" placeholder="请输入成员姓名" no-search-button />
          <Empty v-if="groups.length === 0" description="暂无用户" />
          <template v-else v-for="(item, index) in groups">
            <u-index-item :key="index">
              <view v-if="index !== 0" style="height: 32px;" />
              <u-index-anchor bgColor="#fff" :text="groups[index].title"></u-index-anchor>
              <view class="list-cell" v-for="(user, userIndex) in item.items" :key="userIndex">
                <view
                    class="userInfo"
                    @click="admin ? editUser(user) : onCheckUser(user)"
                >
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
        <view class="total">
          共 {{ total }} 人
        </view>
      </u-index-list>
    </view>
    <view v-else class="selectUser">
      <view class="header">
        <view style="padding-top: 8px">
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
            no-search-button
            @onChange="(value)=> searchValue = value"
        />
      </view>
      <Empty
          v-if="deptUsers.length === 0 && searchValue"
          description="暂无人员信息"
      />
      <view
          v-else
          class="users"
          :style="{height: `calc(100vh - ${showFooter ? (47+safeAreaHeight(this,8)) : 0}px - 85px)`}"
      >
        <view
            v-if="deptPage.length > 1"
            class="item"
            @click="deptPageClick(deptPage[deptPage.length - 2])"
        >
          <view class="deptIcon" :style="{marginLeft:show ? 0 : 32,width:'auto'}">
            <Icon icon="icon-fanhui" size="20" />
          </view>
          <view class="backDept">返回上级部门</view>
        </view>
        <Empty
            v-if="deptUsers.length === 0 && depts.length === 0"
            description="暂无数据"
        />
        <view
            v-for="user in deptUsers"
            :key="user.userId"
            class="item"
            @click="admin ? editUser(user) : onCheckUser(user)"
        >
          <view class="userItem">
            <Check v-if="!show" :value="checkUsers.find(checkUser=>checkUser.userId === user.userId) && 'check'" />
            <UserName :user="user" no-dept />
          </view>
          <view v-if="user.isAdmin === 1">
            <u-tag text="管理员" plain />
          </view>
        </view>

        <template v-if="!searchValue">
          <view
              v-for="item in depts"
              :key="item.key"
              class="item"
              @click="onCheckDept(item)"
          >
            <view class="deptIcon" :style="{marginLeft:show ? 0 : 32}">
              <Icon icon="icon-bumen1" size="30" />
            </view>
            {{ item.title }}
          </view>
        </template>

        <view class="total">
          共 {{ total }} 人
        </view>
      </view>
    </view>

    <view v-if="showFooter" class="footer" :style="{paddingBottom:`${safeAreaHeight(this,8)}px`}">
      <template v-if="admin">
        <view class="action">
          <LinkButton @click="addUserShow = true">添加成员</LinkButton>
        </view>
        <view class="action">
          <LinkButton @click="addDept">添加子部门</LinkButton>
          <Modal ref="addDeptModal">
            <u--input
                placeholder="请输入部门名称"
                clearable
                v-model="deptName"
            />
          </Modal>
        </view>
        <view class="action">
          <LinkButton :disabled="noDept || this.deptPage.length <= 1" @click="actionShow = true">更多管理</LinkButton>
          <u-action-sheet
              cancelText="取消"
              :actions="actionList"
              :show="actionShow"
              @close="actionShow = false"
              @select="actionSelect"
          />
        </view>
      </template>
      <template v-else>
        <view class="checkUsers">
          <Avatar
              v-for="(user,index) in checkUsers"
              :key="index"
              size="35"
              :src='user.miniAppAvatar'
              :text="!user.miniAppAvatar ? user.name.substring(0,1) : null"
              @click="onCheckUser(user)"
          />
        </view>
        <MyButton type="primary" @click="click" :disabled="checkUsers.length === 0">
          确定 · {{ checkUsers.length }}
        </MyButton>
      </template>
    </view>

    <AddUser :add-user-show="addUserShow" @close="addUserShow = false" :deptId="deptPage[deptPage.length - 1].key" />

    <u-action-sheet
        cancelText="取消"
        :title="actionUser.name"
        :actions="userActionList"
        :show="userActionShow"
        @close="userActionShow = false"
        @select="userActionSelect"
    />

    <Modal ref="modal" />
  </view>
</template>

<script>
import Search from "../../components/Search";
import Loading from "../../components/Loading";
import UserName from "../../components/UserName";
import Empty from "../../components/Empty";
import Avatar from "../../components/Avatar";
import {getLocalParmas, isArray, queryString, safeAreaHeight} from "../../util/Tools";
import MyButton from "../../components/MyButton";
import Check from "../../components/Check";
import Icon from "../../components/Icon";
import {pinyin} from "pinyin-pro";
import LinkButton from "../../components/LinkButton";
import AddUser from "../../components/AddUser";
import {Dept} from "MES-Apis/lib/Dept/promise";
import Modal from "../../components/Modal";
import {Message} from "../../components/Message";
import {Tenant} from "MES-Apis/lib/Tenant/promise";
import {Init} from "MES-Apis/lib/Init";

export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'SelectUser',
  props: ['checdUsers', 'type', 'show'],
  components: {Modal, AddUser, LinkButton, Icon, Check, MyButton, Avatar, Empty, UserName, Loading, Search},
  data() {
    return {
      deptPage: [],
      loading: true,
      depts: [],
      deptTree: [],
      users: [],
      checkUsers: [],
      searchValue: '',
      addUserShow: false,
      actionShow: false,
      error: false,
      safeAreaHeight,
      groups: [],
      noDept: false,
      showFooter: false,
      tenant: {},
      actionUser: {},
      pageContainerShow: false,
      userActionShow: false,
      deptName: '',
      admin: false
    }
  },
  mounted() {
    this.init()
    this.getList()

    const _this = this
    uni.$on('saveUserSuccess', (userInfo) => {
      _this.users = _this.users.map(item => {
        if (item.userId === userInfo.userId) {
          return {
            ...item,
            deptId: userInfo.deptId,
            name: userInfo.name
          }
        } else {
          return item
        }
      })
    })
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
  computed: {
    actionList() {
      return [
        {
          name: '修改当前部门名称',
          key: 'edit',
        },
        {
          name: '删除当前部门',
          key: 'delete',
          color: 'red',
          disabled: !(this.deptUsers.length === 0 && this.depts.length === 0) || this.searchValue
        },
      ]
    },
    userActionList() {
      return [
        {
          name: '修改成员信息',
          key: 'edit',
          color: '#007aff',
        },
        {
          name: '移出团队',
          key: 'remove',
          color: 'red'
        },
        {
          name: '移交管理员',
          key: 'admin',
          disabled: this.actionUser.isAdmin === 1,
          color: '#f0ad4e',
        },
      ]
    },
    deptUsers() {
      if (this.deptPage.length > 0) {
        if (this.searchValue) {
          return this.users.filter(item => queryString(this.searchValue, item.name))
        }
        return this.users.filter(item => {
          return (item.deptId + '') === (this.deptPage[this.deptPage.length - 1].key + '')
        })
      } else {
        return []
      }
    },
    total() {
      let total = 0;
      if (this.noDept) {
        this.groups.forEach(item => {
          total += item.items.length
        })
      } else {
        const thisDeptPage = this.deptPage[this.deptPage.length - 1]
        if (thisDeptPage) {
          const thisDept = this.findDept(thisDeptPage.key, this.deptTree) || {}
          const ids = [thisDeptPage.key, ...this.getDeptChildrens(thisDept.children)]
          if (this.searchValue) {
            total = this.deptUsers.length
          } else {
            total = this.users.filter(item => {
              return ids.find(id => id === (item.deptId + ''))
            }).length
          }
        }
      }
      return total
    }
  },
  methods: {
    init() {
      const tenant = this.$store.state.userInfo.tenant || {}
      this.tenant = tenant
      this.admin = (this.show && tenant.admin)
      this.showFooter = this.admin || !this.show
      this.checkUsers = [...this.checdUsers]
    },
    userActionSelect({key}) {
      const _this = this
      switch (key) {
        case 'edit':
          uni.navigateTo({
            url: '/User/UserEdit/index?userId=' + this.actionUser.userId
          })
          break;
        case 'remove':
          this.$refs.modal.dialog({
            title: `确认要把【${_this.actionUser.name || '-'}】移出团队吗？`,
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
                  const newUsers = _this.users.filter(user => user.userId !== _this.actionUser.userId)
                  _this.users = newUsers
                  if (_this.noDept) {
                    _this.renderList(newUsers)
                  }
                }).catch(() => {
                  resolve(true)
                  _this.$refs.modal.dialog({
                    title: Init.getNewErrorMessage() || '移出失败！'
                  })
                })
              })
            }
          })
          break;
        case 'admin':
          this.$refs.modal.dialog({
            title: `确认要移交管理员给${_this.actionUser.name || '-'}吗？`,
            only: false,
            onConfirm() {
              return new Promise((resolve) => {
                Tenant.updateTenantAdmin(_this.tenant.tenantId, _this.actionUser.userId).then(async () => {
                  resolve(true)
                  const newUsers = _this.users.map(user => {
                    if (user.userId === _this.actionUser.userId) {
                      return {...user, isAdmin: 1}
                    } else {
                      return {...user, isAdmin: 0}
                    }
                  })
                  _this.users = newUsers
                  if (_this.noDept) {
                    _this.renderList(newUsers)
                  }
                  await _this.$store.dispatch('userInfo/getUserInfo', true)
                  _this.init()
                }).catch(() => {
                  resolve(true)
                  _this.$refs.modal.dialog({
                    title: Init.getNewErrorMessage() || '移交失败！'
                  })
                })
              })
            }
          })
          break;
      }
    },
    actionSelect({key}) {
      const _this = this
      const thisDept = this.deptPage[this.deptPage.length - 1]
      switch (key) {
        case 'edit':
          _this.deptName = thisDept.name
          _this.$refs.addDeptModal.dialog({
            title: '修改当前部门名称',
            only: false,
            confirmText: '修改',
            onConfirm() {
              return new Promise((resolve) => {
                if (!_this.deptName) {
                  Message.toast('请输入部门名称！')
                  resolve(false)
                  return
                }
                Dept.deptEdit({
                  data: {
                    deptId: thisDept.key,
                    simpleName: _this.deptName,
                    fullName: _this.deptName,
                    description: _this.deptName,
                    pid: _this.deptPage[_this.deptPage.length - 2].key,
                  }
                }).then(() => {
                  const newDept = {
                    key: thisDept.key,
                    title: _this.deptName
                  }
                  _this.deptPage = _this.deptPage.map(item => {
                    if (item.key === newDept.key) {
                      return {...item, name: newDept.title}
                    }
                    return item
                  })
                  _this.deptTree = _this.editDeptChildren(newDept, _this.deptTree)
                  resolve(true)
                }).catch(() => {
                  Message.errorToast('修改失败！')
                  resolve(false)
                })
              })
            }
          })
          break;
        case 'delete':
          _this.$refs.modal.dialog({
            title: '删除后不可恢复，是否确认删除？',
            content: '删除部门【' + thisDept.name + '】',
            only: false,
            confirmError: true,
            onConfirm() {
              return new Promise((resolve) => {
                Dept.deptDelete({
                  data: {
                    deptId: thisDept.key
                  }
                }).then(() => {
                  const newDeptTree = _this.delDeptChildren(thisDept.key, _this.deptTree)
                  if (newDeptTree[0]?.children.length === 0) {
                    _this.getList()
                  } else {
                    _this.deptTree = newDeptTree
                    _this.deptPageClick(_this.deptPage[_this.deptPage.length - 2])
                  }

                  resolve(true)
                }).catch(() => {
                  Message.errorToast('删除失败！')
                  resolve(false)
                })
              })
            }
          })
          break
      }
    },
    afterleave() {
      if (this.deptPage.length > 1) {
        this.pageContainerShow = false
        this.deptPageClick(this.deptPage[this.deptPage.length - 2])
        setTimeout(() => {
          this.pageContainerShow = this.deptPage.length > 1
        }, 0)
      }
    },
    async getList() {
      this.loading = true
      const res = await Dept.deptTree().catch(() => {
        this.error = true
      })
      const newDepts = isArray(res?.data)[0]?.children || []
      // const newDepts = []

      const userRes = await Tenant.joinTenantAllList({data: {tenantId: this.tenant.tenantId, status: 99}}).catch(() => {
        this.error = true
      })

      const users = isArray(userRes?.data).map(item => {
        const userResult = item.userResult || {}
        const deptResult = userResult.deptResult || {}
        return {
          ...item,
          ...userResult,
          deptId: deptResult.deptId || '0'
        }
      })
      this.users = users

      this.loading = false
      if (newDepts.length === 0) {
        this.noDept = true
        this.renderList(users)
      } else {
        this.noDept = false
        this.deptTree = res?.data || []
        this.depts = newDepts
        this.deptPage = [{key: '0', name: this.tenant.name || '顶级'}]
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
    async onCheckDept(dept) {
      const thisDept = this.findDept(dept.key, this.deptTree) || {}
      this.depts = thisDept.children || []
      this.deptPage = [...this.deptPage, {key: thisDept.key, name: thisDept.title}]
      this.pageContainerShow = true
    },
    async deptPageClick(route) {
      const thisDept = this.findDept(route.key, this.deptTree) || {}
      this.depts = thisDept.children || []
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
      if (newPage.length === 1) {
        this.pageContainerShow = false
      }
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
      const groups = [];
      if (users.length > 0) {
        const useUser = []
        Array(26).fill('').forEach((_, i) => {
          const CharCode = String.fromCharCode(charCodeOfA + i);
          const newUsers = users.filter(item => {
            const name = item.name || ''
            const pys = pinyin(name, {pattern: 'first', toneType: 'none', type: 'array'});
            const first = pys[0] || '';
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
    addDept() {
      const _this = this
      _this.deptName = ''
      _this.$refs.addDeptModal.dialog({
        title: '添加子部门',
        only: false,
        confirmText: '添加',
        onConfirm() {
          return new Promise((resolve) => {
            if (!_this.deptName) {
              Message.toast('请输入部门名称！')
              resolve(false)
              return
            }
            Dept.deptAdd({
              data: {
                simpleName: _this.deptName,
                fullName: _this.deptName,
                sort: _this.depts.length,
                description: _this.deptName,
                pid: _this.noDept ? '0' : _this.deptPage[_this.deptPage.length - 1].key
              }
            }).then((res) => {
              if (_this.noDept) {
                _this.getList()
              } else {
                const newDept = {
                  key: res.data,
                  children: [],
                  title: _this.deptName
                }
                _this.depts = [..._this.depts, newDept]
                _this.deptTree = _this.addDeptChildren(_this.deptPage[_this.deptPage.length - 1].key, newDept, _this.deptTree)
              }
              resolve(true)
            }).catch(() => {
              Message.errorToast('添加失败！')
              resolve(false)
            })
          })
        }
      })
    },
    findDept(key, depts = []) {
      let dept = null
      depts.forEach(item => {
        if ((key + '') === (item.key + '')) {
          dept = item
        } else {
          const childrenDept = this.findDept(key, item.children)
          if (childrenDept) {
            dept = childrenDept
          }
        }
      })
      return dept
    },
    addDeptChildren(key, dept, depts = []) {
      return depts.map(item => {
        if ((key + '') === (item.key + '')) {
          return {...item, children: [...item.children, dept]}
        } else {
          return {...item, children: this.addDeptChildren(key, dept, item.children || [])}
        }
      })
    },
    editDeptChildren(dept, depts = []) {
      return depts.map(item => {
        if ((dept.key + '') === (item.key + '')) {
          return {...item, ...dept}
        } else {
          return {...item, children: this.editDeptChildren(dept, item.children || [])}
        }
      })
    },
    delDeptChildren(key, depts = []) {
      const newDepts = []
      depts.map(item => {
        if ((key + '') !== (item.key + '')) {
          newDepts.push({...item, children: this.delDeptChildren(key, item.children || [])})
        }
      })
      return newDepts
    },
    editUser(user) {
      this.actionUser = user
      this.userActionShow = true
    },
    getDeptChildrens(data = []) {
      let ids = []
      data.forEach(item => {
        ids = ids.concat([item.key], this.getDeptChildrens(item.children))
      })
      return ids
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

.total {
  padding: 12px;
  text-align: center;
  color: #c7c7c7;
}

.item {
  padding: 6px;
  border-bottom: solid 1px #f5f5f5;
  display: flex;
  align-items: center;
  gap: 8px;

  .userItem {
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 8px;
  }

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
    color: rgba(0, 0, 0, 0.5);
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
