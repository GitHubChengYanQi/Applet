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
                  <UserName :user="user" showRole />
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
          <template v-if="waitJoinUserTotal > 0">
            ，
            <span style="color: #007aff" @click="joinUserList">{{ waitJoinUserTotal }}人待加入</span>
          </template>
        </view>
      </u-index-list>
    </view>
    <UserManage
        v-else
        ref="userManage"
        :deptPage="deptPage"
        :searchValue="searchValue"
        @deptPageClick="deptPageClick"
        @searchOnChange="(value)=>searchValue = value"
        :deptUsers="deptUsers"
        :showFooter="showFooter"
        :depts="depts"
        :admin="admin"
        @editUser="editUser"
        @onCheckUser="onCheckUser"
        :total="total"
        :waitJoinUserTotal="waitJoinUserTotal"
        @joinUserList="joinUserList"
        :show="show"
        :checkUsers="checkUsers"
        :itemWidth="itemWidth"
        :movableViewY="movableViewY"
        :movableViewX="movableViewX"
        @deptsChange="deptsChange"
        :deptTree="deptTree"
        @treeChange="(newTree)=>deptTree = newTree"
        @onCheckDept="onCheckDept"
        :users="users"
        @usersChange="(newUser)=>users = newUser"
    />

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
import UserManage from "./components/UserManage";
import {addDeptChildren, delDeptChildren} from "./index";

export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'SelectUser',
  props: ['checdUsers', 'type', 'show'],
  components: {UserManage, Modal, AddUser, LinkButton, Icon, Check, MyButton, Avatar, Empty, UserName, Loading, Search},
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
      admin: false,
      waitJoinUserTotal: 0,
      itemWidth: 0,
      movableViewY: 0,
      movableViewX: 0,
    }
  },
  mounted() {
    this.init()
    this.getList()

    const _this = this

    uni.$on('handleJoinTenant', () => {
      _this.getList(true)
    })

    uni.$on('saveUserSuccess', (userInfo) => {
      _this.users = _this.users.map(item => {
        if (item.userId === userInfo.userId) {
          return {
            ...item,
            deptList: userInfo.depts.map(item => ({
              deptId: item.key,
              mainDept: item.admin ? 1 : 0
            })),
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
        if (this.deptPage.length === 1) {
          return this.users.filter(item => {
            const deptIds = isArray(item.deptList).filter(item => item).map(item => item?.deptId)
            return deptIds.length === 0 || deptIds.findIndex(id => (id + '') === '0') > -1
          })
        }
        return this.users.filter(item => {
          const deptIds = isArray(item.deptList).map(item => item?.deptId)
          return deptIds.findIndex(id => (id + '') === (this.deptPage[this.deptPage.length - 1].key + '')) > -1
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
          if (this.searchValue) {
            total = this.deptUsers.length
          } else if (this.deptPage.length === 1) {
            total = this.users.length
          } else {
            const thisDept = this.findDept(thisDeptPage.key, this.deptTree) || {}
            const ids = [...this.getDeptChildrens(thisDept.children)]
            total = this.users.filter(item => {
              const deptIds = isArray(item.deptList).map(item => item?.deptId)
              return [...ids, thisDeptPage.key].find(id => deptIds.find(deptId => (id + '') === (deptId + '')))
            }).length
          }
        }
      }
      return total
    }
  },
  methods: {
    joinUserList() {
      uni.navigateTo({
        url: '/Tenant/TenantSet/JoinTenantList/index'
      })
    },
    init() {
      this.itemWidth = this.$store.state.systemInfo.systemInfo.windowWidth
      const tenant = this.$store.state.userInfo.tenant || {}
      this.tenant = tenant
      this.admin = (this.show && tenant.admin)
      this.showFooter = this.admin || !this.show
      this.checkUsers = [...this.checdUsers]
    },
    deptsChange(depts) {
      this.depts = depts
      this.$nextTick(function () {
        this.movableViewY = this.deptPage.length > 1 ? 49 : 1
        this.movableViewX = this.itemWidth - 0.1
        setTimeout(() => {
          this.movableViewY = this.deptPage.length > 1 ? 48 : 0
          this.movableViewX = this.itemWidth
        }, 0)
      })
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
                  const newDeptTree = delDeptChildren(thisDept.key, _this.deptTree)
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
      if (this.addUserShow || this.actionShow || this.userActionShow || this.$refs.addDeptModal.showStatus() || this.$refs.modal.showStatus() || this.$refs.userManage.showStatus()) {
        this.pageContainerShow = false
        this.addUserShow = false
        this.actionShow = false
        this.userActionShow = false
        this.$refs.addDeptModal.close()
        this.$refs.modal.close()
        this.$refs.userManage.close()
        setTimeout(() => {
          this.pageContainerShow = this.deptPage.length > 1
        }, 0)
        return
      }
      if (this.deptPage.length > 1) {
        this.pageContainerShow = false
        this.deptPageClick(this.deptPage[this.deptPage.length - 2])
        setTimeout(() => {
          this.pageContainerShow = this.deptPage.length > 1
        }, 0)
      }
    },
    async getList(refresh) {
      this.loading = true

      if (this.$store.state.userInfo.tenant.admin) {
        await Tenant.waitJoinCount({
          data: {
            tenantId: this.$store.state.userInfo.tenant.tenantId,
          }
        }).then((res) => {
          this.waitJoinUserTotal = res.data || 0
        }).catch(() => {
          this.error = true
        })
      }

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

      if (refresh) {
        return
      }

      if (newDepts.length === 0) {
        this.noDept = true
        this.renderList(users)
      } else {
        this.noDept = false
        this.deptTree = res?.data || []
        this.deptsChange(newDepts)
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
      this.deptsChange(thisDept.children || [])
      this.deptPage = [...this.deptPage, {key: thisDept.key, name: thisDept.title}]
      this.pageContainerShow = true
    },
    async deptPageClick(route) {
      const thisDept = this.findDept(route.key, this.deptTree) || {}
      this.deptsChange(thisDept.children || [])
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
                _this.deptsChange([..._this.depts, newDept])
                _this.deptTree = addDeptChildren(_this.deptPage[_this.deptPage.length - 1].key, newDept, _this.deptTree)
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
    editDeptChildren(dept, depts = []) {
      return depts.map(item => {
        if ((dept.key + '') === (item.key + '')) {
          return {...item, ...dept}
        } else {
          return {...item, children: this.editDeptChildren(dept, item.children || [])}
        }
      })
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
    overflow: hidden auto;
    background-color: #fff;
  }

}

.total {
  padding: 12px;
  text-align: center;
  color: #c7c7c7;
  font-size: 12px;
}

.item {
  padding-left: 12px;
  border-bottom: solid 1px #f5f5f5;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 47px;

  .itemTitle {
    flex-grow: 1;
  }

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
