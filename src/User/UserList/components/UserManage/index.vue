<template>
  <view class="selectUser">
    <uni-swipe-action ref="uni-swipe-action">
      <view class="header" v-if="userIsMove === null">
        <view style="padding-top: 8px">
          <uni-breadcrumb separator="/">
            <uni-breadcrumb-item v-for="(route,index) in deptPage" :key="index">
              <view @click="$emit('deptPageClick',route)">
                {{ route.name }}
              </view>
            </uni-breadcrumb-item>
          </uni-breadcrumb>
        </view>
        <Search
            placeholder="请输入成员姓名"
            :value="searchValue"
            no-search-button
            @onChange="(value)=>$emit('searchOnChange',value)"
        />
      </view>
      <view
          v-if="userIsMove !== null"
          class="moveUserBox"
      >
        <view class="make"></view>
        <u-transition mode="fade" :show="userIsMove !== null" :duration="500">
          <view :class="{removeUser:true,startRemoveUser:removeUser}">
            <u-icon name="trash" :color="removeUser ? 'red' : '#fff'" size="28" />
          </view>
          <view class="moveUserBoxUserClass">
            <view
                v-if="deptPage.length > 1"
                :class="{item:true,userMove:userMoveIndex === 0}"
                :style="{border:deptPage.length ===0 && 'none'}"
            >
              <view class="deptIcon">
                <Icon icon="icon-bumen1" size="30" />
              </view>
              <view class="itemTitle">
                {{
                  deptPage[deptPage.length - 2].name
                }}
              </view>
            </view>
            <view
                v-for="(item,index) in depts"
                :key="index"
            >
              <view
                  :class="{item:true,userMove:userMoveIndex === (deptPage.length > 1 ? index + 1 : index)}"
                  :style="{border:index === depts.length - 1 && 'none'}"
              >
                <view class="deptIcon">
                  <Icon icon="icon-bumen1" size="30" />
                </view>
                <view class="itemTitle">
                  {{ item.title }}
                </view>
              </view>
            </view>
          </view>
        </u-transition>
      </view>

    <Empty
        v-if="deptUsers.length === 0 && searchValue"
        description="暂无人员信息"
    />

    <view
        v-else
        class="users"
        :style="{
      height: `calc(100vh - ${showFooter ? (47+safeAreaHeight(this,8)) : 0}px - ${userIsMove === null ?85:0}px)`
    }"
    >

      <view class="header" v-if="userIsMove !== null">
        <view style="padding-top: 8px">
          <uni-breadcrumb separator="/">
            <uni-breadcrumb-item v-for="(route,index) in deptPage" :key="index">
              <view @click="$emit('deptPageClick',route)">
                {{ route.name }}
              </view>
            </uni-breadcrumb-item>
          </uni-breadcrumb>
        </view>
        <Search
            placeholder="请输入成员姓名"
            :value="searchValue"
            no-search-button
            @onChange="(value)=>$emit('searchOnChange',value)"
        />
      </view>

      <movable-area
          v-if="!searchValue"
          class="movableArea"
          :style="{
      height:`${depts.length * itemHeight + (deptPage.length > 1 ? 68 : 20)}px`,
      width: `${itemWidth * 3}px`,
      marginLeft:`-${itemWidth}px`,
    }"
      >
        <movable-view
            v-if="deptPage.length > 1"
            direction="all"
            :x="movableViewX"
            :style="{ width: `${itemWidth}px`,height:`${itemHeight}px`}"
            :class="{movableView:true,inItem:inIndex === -1}"
            :disabled="true"
            @click="$emit('deptPageClick',deptPage[deptPage.length - 2])"
        >
          <view class="item">
            <view class="deptIcon" style="margin-left:0">
              <Icon icon="icon-fanhui" size="20" />
            </view>
            <view class="backDept">返回上级部门</view>
          </view>
        </movable-view>
        <Empty
            style="padding-top: 48px"
            v-if="deptUsers.length === 0 && depts.length === 0"
            description="暂无数据"
        />

        <movable-view
            v-for="(item,index) in depts"
            :key="index"
            :damping="0"
            :out-of-bounds="true"
            :animation="false"
            :disabled="isMove !== index"
            :style="{
                top:`${itemHeight * index+(deptPage.length > 1 ? 0 : 10)}px`,
                width: `${itemWidth}px`,
                height:`${itemHeight}px`
                }"
            :y="movableViewY"
            :x="movableViewX"
            direction="all"
            @change="(e)=>move(e,index)"
            @touchend="(e)=>moveEnd(e,index)"
            :class="{movableView:true,inItem:inIndex === index,moveItem:isMove === index}"
        >
          <Swipe
              :disabled="!admin || isMove !== null"
              @click="(key)=>swipeClick(key,item)"
          >
            <view class="moveLine" v-if="inIndex === null && moveIndex === index" />
            <view class="item" @click="$emit('onCheckDept',item)">
              <view class="deptIcon" :style="{marginLeft:show ? 0 : 32}">
                <Icon icon="icon-bumen1" size="35" />
              </view>
              <view class="itemTitle">
                {{ item.title }}
              </view>
              <view v-if="admin" class="drag" @longpress="moveStart(e,index)">
                <u-icon name="list" />
              </view>
            </view>
            <view
                class="moveLine"
                v-if="inIndex === null  && moveIndex === depts.length && index === depts.length-1"
            />
          </Swipe>

        </movable-view>
        <view
            class="item moveFixItem" v-if="isMove !== null"
            :style="{
                top:`${itemHeight * isMove + (deptPage.length > 1 ? itemHeight : 10)}px`,
                left:`${itemWidth}px`,
                height:`${itemHeight}px`
              }"
        >
          <view class="deptIcon" style="margin-left:0">
            <Icon icon="icon-bumen1" size="30" />
          </view>
          {{ depts[isMove].title }}
        </view>
      </movable-area>


      <movable-area
          v-if="!loading"
          :style="{
      height:`${(depts.length * itemHeight) + (deptPage.length > 1 ? itemHeight : 0) + 20 + (deptUsers.length * userItemHeight) + 85}px`,
      width: `${itemWidth * 3}px`,
      marginLeft:`-${itemWidth}px`,
      marginTop:`-${((depts.length * itemHeight) + (deptPage.length > 1 ? itemHeight : 0) + 20 + 85)}px`,
      minHeight:`calc(100vh - ${showFooter ? (47+safeAreaHeight(this,8)) : 0}px - 85px)`
    }"
      >
        <movable-view
            v-for="(user,index) in deptUsers"
            :key="index"
            :disabled="userIsMove !== index"
            :style="{
            top:`${userItemHeight * index + (depts.length * itemHeight + (deptPage.length > 1 ? itemHeight : 0) + (deptPage.length > 1 ? 0 : 10) + 85)}px`,
            width: `${itemWidth}px`,
            height:`${userItemHeight}px`
          }"
            :y="userMovableViewY"
            :x="userMovableViewX"
            direction="all"
            @change="(e)=>userMove(e,index)"
            @touchend="(e)=>userMoveEnd(e,index)"
            :class="{userMoveIng:userIsMove === index}"
        >
          <Swipe
              :disabled="!admin || isMove !== null"
              @click="(key)=>userSwipeClick(key,user)"
          >
            <view class="item" @click="admin ? $emit('userClick',user) : $emit('onCheckUser',user)">
              <view class="userItem">
                <Check v-if="!show" :value="checkUsers.find(checkUser=>checkUser.userId === user.userId)" />
                <UserName :user="user" showRole />
              </view>
              <view v-if="user.isAdmin === 1">
                <u-tag text="管理员" plain />
              </view>
              <view
                  v-if="admin"
                  class="drag"
                  @longpress="userMoveStart(e,index)"
                  :id="`userMoveItem${index}`"
              >
                <u-icon name="list" />
              </view>
            </view>
          </Swipe>
        </movable-view>
      </movable-area>

      <view class="total">
        共 {{ total }} 人
        <template v-if="waitJoinUserTotal > 0">
          ，
          <span style="color: #007aff" @click="$emit('joinUserList')">{{ waitJoinUserTotal }}人待加入</span>
        </template>
      </view>
    </view>
    </uni-swipe-action>
    <Modal ref="modal" />

  </view>
</template>

<script>
import Empty from "../../../../components/Empty";
import Search from "../../../../components/Search";
import {isArray, safeAreaHeight} from "../../../../util/Tools";
import Icon from "../../../../components/Icon";
import Check from "../../../../components/Check";
import UserName from "../../../../components/UserName";
import {addDeptChildren, delDeptChildren, sortDeptsChildren} from "../../index";
import Modal from "../../../../components/Modal";
import {Init} from "MES-Apis/lib/Init";
import {Tenant} from "MES-Apis/lib/Tenant/promise";
import {User} from "MES-Apis/lib/User/promise";
import {Dept} from "MES-Apis/lib/Dept/promise";
import Swipe from "../../../../components/Swipe/index.vue";

export default {
  name: 'UserManage',
  components: {Swipe, Modal, UserName, Check, Icon, Search, Empty},
  props: [
    'deptPage',
    'searchValue',
    'deptUsers',
    'show',
    'showFooter',
    'depts',
    'admin',
    'total',
    'waitJoinUserTotal',
    'checkUsers',
    'itemWidth',
    'movableViewY',
    'movableViewX',
    'deptTree',
    'users'
  ],
  data() {
    return {
      safeAreaHeight,
      isMove: null,
      itemHeight: 48,
      moveIndex: null,
      inIndex: null,
      userIsMove: null,
      userMovableViewY: 0,
      userMovableViewX: 0,
      userItemHeight: 48,
      removeUser: null,
      userMoveIndex: null,
      loading: false
    }
  },
  watch: {
    deptPage: {
      deep: true,
      handler() {
        this.resetUserMove(true)
      }
    }
  },
  created() {
    this.resetUserMove()
  },
  methods: {
    showStatus() {
      return this.$refs.modal.showStatus();
    },
    close() {
      return this.$refs.modal.close();
    },
    move(e, index) {
      if (!e.detail.source) {
        return
      }
      const y = this.deptPage.length > 1 ? e.detail.y - this.itemHeight : e.detail.y
      let newY = 0
      if (y < this.itemHeight && y > -this.itemHeight) {
        newY = y
      } else {
        newY = y + newY
      }

      const moveIndex = parseInt(newY / this.itemHeight)
      let endIndex = (moveIndex + index)
      if (endIndex > this.depts.length - 1) {
        endIndex = this.depts.length - 1
      } else if (endIndex < 0) {
        endIndex = 0
      }
      this.moveEndIndex = endIndex
      if (moveIndex === 0) {
        this.moveIndex = null
      } else {
        this.moveIndex = (moveIndex > 0 ? endIndex + 1 : endIndex)
      }

      const box = y % this.itemHeight
      const yu = newY % this.itemHeight
      const other = yu > 0 ? (yu > (this.itemHeight - 10) && yu < (this.itemHeight + 10)) : (yu < -(this.itemHeight - 10) && yu > -(this.itemHeight + 10))
      const inMoveIndex = parseInt(newY / this.itemHeight) + (other ? (yu > 0 ? 1 : -1) : 0)
      const inIndex = (inMoveIndex + index)
      if (inMoveIndex > 0) {
        if (box < 10) {
          if (e.detail.source === 'touch-out-of-bounds') {
            this.inIndex = null
          } else {
            this.inIndex = inIndex
          }
        } else if (box > this.itemHeight - 10) {
          this.inIndex = inIndex
        } else {
          this.inIndex = null
        }
      } else if (inMoveIndex < 0) {
        if (box > -10) {
          this.inIndex = inIndex
        } else if (box < -this.itemHeight + 10) {
          this.inIndex = inIndex
        } else {
          this.inIndex = null
        }
      } else {
        this.inIndex = null
      }
      this.movableView = e.detail.y
    },
    moveStart(e, index) {
      this.$refs["uni-swipe-action"].closeAll()
      this.isMove = index
    },
    moveEnd(e) {
      if (typeof this.isMove !== 'number') {
        return
      }
      const thisIndex = this.isMove
      this.isMove = null
      const y = this.movableView
      let newY = 0
      if (y < this.itemHeight && y > -this.itemHeight) {
        newY = 0
      } else {
        newY = y
      }
      let moveIndex = parseInt(newY / this.itemHeight)
      const moveDept = this.depts[thisIndex]
      this.$nextTick(function () {
        if (this.inIndex !== null) {
          const inDept = this.depts[this.inIndex]
          this.deptsChange(this.depts)
          const _this = this
          const top = _this.deptPage[_this.deptPage.length - 2]
          this.$refs.modal.dialog({
            title: '确认要把' + moveDept.title + '移动到' + (inDept ? inDept.title + '下级' : top.name) + '吗？',
            only: false,
            onConfirm() {
              return new Promise(async (resolve) => {
                Dept.deptEdit({
                  data: {
                    deptId: moveDept.key,
                    simpleName: moveDept.title,
                    fullName: moveDept.title,
                    description: moveDept.title,
                    pid: inDept ? inDept.key : top.key
                  }
                }).then(() => {
                  let newTree
                  const tree = delDeptChildren(moveDept.key, _this.deptTree)
                  if (_this.inIndex === -1) {
                    const deptKey = _this.deptPage[_this.deptPage.length - 2].key
                    newTree = addDeptChildren(deptKey, moveDept, tree)
                  } else {
                    newTree = addDeptChildren(inDept ? inDept.key : top.key, moveDept, tree)
                  }
                  _this.deptsChange(_this.depts.filter((item, index) => index !== thisIndex))
                  _this.$emit('treeChange', newTree)
                  resolve(true)
                }).catch(() => {
                  resolve(true)
                  _this.$refs.modal.dialog({
                    title: Init.getNewErrorMessage() || '移动失败！'
                  })
                })
              })
            }
          })
          this.moveActionData = {...this.depts[thisIndex], thisIndex, inIndex: this.inIndex}
        } else if (this.moveEndIndex !== null) {

          const depts = this.depts.map((item, index) => {
            if (moveIndex > 0) {
              if (index < this.moveEndIndex && index >= thisIndex) {
                return {...this.depts[index + 1]}
              } else if (index === this.moveEndIndex) {
                return {...this.depts[thisIndex]}
              }
            } else {
              if (index > this.moveEndIndex && index <= thisIndex) {
                return {...this.depts[index - 1]}
              } else if (index === this.moveEndIndex) {
                return {...this.depts[thisIndex]}
              }
            }
            return item
          })
          this.deptsChange(depts)
          const thisKey = this.deptPage[this.deptPage.length - 1].key

          this.$emit('treeChange', sortDeptsChildren(thisKey, depts, this.deptTree))

          Dept.deptSort({
            data: {
              sortList: depts.map((item, index) => ({
                deptId: item.key,
                sort: depts.length - 1 - index
              }))
            }
          }).catch(() => {
            this.$refs.modal.dialog({
              title: Init.getNewErrorMessage() || '排序失败!'
            })
          })
        }

        this.$nextTick(function () {
          this.moveEndIndex = null
          this.moveIndex = null
          this.inIndex = null
        })


      })
    },
    userMoveStart(e, index) {
      this.userIsMove = index
      this.removeUser = null
      this.userMoveIndex = null
    },
    userMove(e, index) {
      if (typeof this.userIsMove !== 'number') {
        return
      }

      const query = uni.createSelectorQuery().in(this);
      query.select(`#userMoveItem${index}`).boundingClientRect(data => {
        const top = data.top - 64
        this.removeUser = data.top <= 50
        if (data.top > 64 && data.left > 24 && data.right > 24 && top < this.itemHeight * (this.deptPage.length > 1 ? this.depts.length + 1 : this.depts.length)) {
          this.userMoveIndex = parseInt(top / this.itemHeight)
        } else {
          this.userMoveIndex = null
        }
      }).exec();

    },
    userMoveEnd(e, thisIndex) {

      if (typeof this.userIsMove !== 'number') {
        return
      }

      const thisUser = this.deptUsers[thisIndex]
      const _this = this
      if (this.removeUser) {
        this.$refs.modal.dialog({
          title: '确认将' + thisUser.name + '移出团队吗？',
          only: false,
          confirmError: true,
          onConfirm: () => {
            return new Promise((resolve) => {
              Tenant.removeTenantUser({
                data: {
                  tenantBindId: thisUser.tenantBindId
                }
              }).then(() => {
                resolve(true)
                const newUsers = _this.users.filter(user => user.userId !== thisUser.userId)
                this.$emit('usersChange', newUsers)
              }).catch(() => {
                resolve(true)
                _this.$refs.modal.dialog({
                  title: Init.getNewErrorMessage() || '移出失败！'
                })
              })
            })
          }
        })
      }
      if (this.userMoveIndex !== null) {
        let title = ''
        let deptId = '0'
        if (this.deptPage.length > 1) {
          if (_this.userMoveIndex === 0) {
            const dept = _this.deptPage[_this.deptPage.length - 2]
            title = '确认将' + thisUser.name + '移动到' + dept.name + '吗？'
            deptId = dept.key
          } else {
            title = '确认将' + thisUser.name + '移动到' + _this.depts[_this.userMoveIndex - 1].title + '吗？'
            deptId = _this.depts[_this.userMoveIndex - 1].key
          }
        } else {
          title = '确认将' + thisUser.name + '移动到' + _this.depts[_this.userMoveIndex].title + '吗？'
          deptId = _this.depts[_this.userMoveIndex].key
        }
        const dept = _this.deptPage[_this.deptPage.length - 1]
        this.$refs.modal.dialog({
          title,
          only: false,
          onConfirm: () => {
            let newDeptList = []
            const newUsers = _this.users.map(item => {
              if (item.userId === thisUser.userId) {
                let exit = false
                let admin = false
                const deptList = isArray(item.deptList).map(item => {
                  if (!item) {
                    return item
                  }
                  if (item && item.mainDept === 1 && !admin && (item.deptId + '') !== (dept.key + '')) {
                    admin = true
                  }
                  if ((item.deptId + '') === (deptId + '')) {
                    exit = true
                    return {...item, deptId}
                  }
                  return item
                })

                newDeptList = (exit ? (admin ? deptList : deptList.map(item => {
                  if ((item.deptId + '') === (deptId + '')) {
                    return {...item, mainDept: 1}
                  } else {
                    return item
                  }
                })) : [...deptList, {
                  deptId,
                  mainDept: admin ? 0 : 1
                }]).filter(item => item && (item.deptId + '') !== (dept.key + ''))
                return {
                  ...item,
                  deptList: newDeptList
                }
              }
              return item
            })
            console.log(newDeptList)
            return new Promise((resolve) => {
              // User.userEdit({
              User.userChangeDept({
                data: {
                  userId: thisUser.userId,
                  deptList: newDeptList.filter(item => item)
                }
              }).then(() => {
                this.$emit('usersChange', newUsers)
                resolve(true)
              }).catch(() => {
                resolve(true)
                this.$refs.modal.dialog({
                  title: Init.getNewErrorMessage() || '移动失败！'
                })
              })
            })
          }
        })
      }

      this.resetUserMove()

    },
    deptsChange(depts) {
      this.$emit('deptsChange', depts)
      // this.resetSkuMove()
    },
    resetUserMove(reset) {
      this.userMovableViewX = this.itemWidth - 0.1
      this.userMovableViewY = 0.1

      this.$nextTick(function () {
        this.loading = false
        this.userIsMove = null
        this.skuMoveIndex = null
        this.userMovableViewX = this.itemWidth
        this.userMovableViewY = 0
      })

      if (reset) {
        this.loading = true
        this.$nextTick(function () {
          this.loading = false

        })
      }
    },
    swipeClick(key, item) {
      switch (key) {
        case 'delete':
          this.$emit('onDelete', {name: item.title, key: item.key})
          break;
        case 'edit':
          this.$emit('onEdit', {name: item.title, key: item.key})
          break
      }
    },
    userSwipeClick(key, item) {
      switch (key) {
        case 'delete':
          this.$emit('userDelete', item)
          break;
        case 'edit':
          this.$emit('userEdit', item)
          break
      }
    },
  }
}
</script>

<style lang="scss">
.drag {
  height: 47px;
  display: flex;
  align-items: center;
  padding: 0 24px 0;
}

.moveLine {
  height: 1px;
  background-color: rgba(0, 122, 255, 0.50);
  position: fixed;
  width: 100%;
}

.moveItem {
  opacity: 0.5;
  background-color: #fff;
  box-shadow: 0 1px 10px rgba(34, 33, 81, 0.15);
  z-index: 1;
}

.inItem {
  background-color: rgba(0, 122, 255, 0.50);
}

.moveFixItem {
  opacity: 0.3;
  position: absolute;
  width: 100%;
}

.userMoveIng {
  z-index: 99;
  background-color: rgba(255, 255, 255, 0.6);

  .item {
    border: none;
  }
}

.movableArea {
  width: 100%;
  height: 100vh;
  z-index: 1;
}

.moveUserBox {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100%;
  z-index: 2;

  .make {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .removeUser {
    z-index: 1;
    margin: 0 -24px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.5);
    margin-bottom: 24px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  .startRemoveUser {
    background-color: rgba(255, 0, 0, 0.5);
  }

  .moveUserBoxUserClass {
    z-index: 1;
    background-color: #fff;
    border-radius: 8px;
    margin: 0 24px;

    .userMove {
      background-color: rgba(0, 122, 255, 0.50);
    }
  }
}

</style>
