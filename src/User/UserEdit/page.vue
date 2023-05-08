<template>
  <view>
    <Empty type="error" description="获取成员信息失败！" v-if="error" />
    <Loading skeleton-type="page" skeleton v-else-if="loading" />
    <template v-else>
      <view class="avatar">
        <Avatar :src="userInfo.miniAppAvatar" size="84" circular @click="preview" />
      </view>

      <view class="box">
        <view class="item">
          <view class="label">姓名</view>
          <view class="value">
            <u--input
                placeholder="请输入姓名"
                maxlength="8"
                border="none"
                v-model="userInfo.name"
            />
          </view>
        </view>
        <view class="endItem">
          <view class="label">性别</view>
          <view class="value">
            <u-radio-group
                placement="row"
                v-model="userInfo.sex"
            >
              <u-radio
                  :customStyle="{marginRight: '8px'}"
                  v-for="(item, index) in sex"
                  :key="index"
                  :label="item.name"
                  :name="item.key"
              >
              </u-radio>
            </u-radio-group>
          </view>
        </view>
      </view>

      <view class="box">
        <view class="item">
          <view class="label">邮箱</view>
          <view class="value">
            <u--input
                placeholder="请输入邮箱"
                border="none"
                v-model="userInfo.email"
            />
          </view>
        </view>
        <view class="endItem">
          <view class="label">手机号</view>
          <view class="value" style="color: #a9a9a9">
            {{ userInfo.phone || '-' }}
          </view>
        </view>
      </view>

      <view class="box">
        <view class="endItem">
          <view class="label">职位</view>
          <view class="value">
            <LinkButton @click="openPosition">
              {{ userInfo.positionIds[0] ? userInfo.positionNames : '设置职位' }}
            </LinkButton>
          </view>
        </view>
      </view>

      <view class="box">
        <view class="endItem" style="align-items: flex-start">

          <view class="label">部门</view>
          <view class="value">
<!--            <LinkButton @click="openDept">{{ userInfo.deptId ? (userInfo.deptName || '设置部门') : '设置部门' }}</LinkButton>-->
            <view
                v-for="(dept,index) in isArray(userInfo.depts)"
                :key="index"
                :class="{deptItem:true,firstDeptItem:index === 0}"
            >
              <view class="deptInfo">
                <Icon class="icon" icon="icon-bumen1" size="30" />
                <view>
                  {{ dept.title }}
                </view>
              </view>
              <view class="deptAction">
                <u-icon
                    v-if="!dept.admin"
                    name="more-dot-fill"
                    color="#2979ff"
                    size="12"
                    @click="deptAction(dept)"
                />
                <template v-else>
                  主部门
                </template>
              </view>
            </view>
            <view :class="{openDept:isArray(userInfo.depts).length > 0}">
              <LinkButton @click="openDept">设置部门</LinkButton>
            </view>
          </view>
        </view>
      </view>

      <BottomButton
          only
          text="保存"
          @onClick="save"
      />

      <Loading :loading="saveLoading" />

      <Modal ref="modal" />

      <Popup
          :show="deptShow"
          title="设置部门"
          @close="deptShow = false"
          left-text="取消"
          right-text="保存"
          @onLeft="deptShow = false"
          @onRight="saveDept"
      >
        <Loading skeleton v-if="deptTreeLoading" />
        <view v-else class="deptTree">
<!--          <Tree radio :data="deptTree" v-model="dept" />-->
          <Tree multiple :data="deptTree" v-model="depts" />
        </view>
      </Popup>

      <u-picker
          v-if="positionPickerShow"
          :defaultIndex="[positionIndex]"
          :loading="positionLoading"
          immediateChange
          :show="positionShow"
          :columns="positionColumns"
          @close="positionClose"
          cancelText="新增职位"
          cancelColor="#3c9cff"
          @cancel="positionCancel"
          @confirm="positionConfirm"
          closeOnClickOverlay
      />

      <u-action-sheet
          description="设为主部门后，该部门将显示在成员部门的首位"
          cancelText="取消"
          :actions="deptActionList"
          :show="deptActionShow"
          @select="deptActionSelect"
          @close="deptActionShow=false"
      />
    </template>
  </view>
</template>

<script>
import Popup from "../../components/Popup";
import Loading from "../../components/Loading";
import {Dept} from "MES-Apis/lib/Dept/promise";
import Tree from "../../components/Tree";
import LinkButton from "../../components/LinkButton";
import {User} from "MES-Apis/lib/User/promise";
import Empty from "../../components/Empty";
import BottomButton from "../../components/BottomButton";
import Modal from "../../components/Modal";
import {Init} from "MES-Apis/lib/Init";
import {Position} from "MES-Apis/lib/Position/promise";
import {isArray} from "../../util/Tools";
import Icon from "../../components/Icon";
import Avatar from "../../components/Avatar";

export default {
  options: {
    styleIsolation: 'shared'
  },
  components: {Avatar, Icon, Modal, BottomButton, Empty, LinkButton, Tree, Loading, Popup},
  props: ['userId'],
  data() {
    return {
      isArray,
      deptShow: false,
      showPhone: false,
      deptTreeLoading: false,
      deptActionShow: false,
      userInfo: {},
      actionDept: {},
      deptTree: [],
      positionColumns: [],
      depts: [],
      dept: {},
      loading: true,
      error: false,
      positionIndex: 0,
      positionPickerShow: false,
      positionLoading: false,
      saveLoading: false,
      positionShow: false,
      deptActionList: [{
        name: '设为主部门',
        key: 'admin',
      }],
      sex: [
        {
          name: '男',
          key: 'M'
        },
        {
          name: '女',
          key: 'F'
        }
      ],
    }
  },
  mounted() {
    this.getDeptTree()
    this.userDetail()
    this.positionList()
    const _this = this
    uni.$on('positionAddSuccess', (id) => {
      _this.positionClose()
      _this.positionList(id);
    })
  },
  methods: {
    preview() {
      if (!this.userInfo.miniAppAvatar) {
        return
      }
      this.actionAvatar = false
      uni.previewImage({
        current: this.userInfo.miniAppAvatar,
        urls: [this.userInfo.miniAppAvatar]
      })
    },
    deptAction(dept) {
      this.deptActionShow = true
      this.actionDept = dept
    },
    async positionList(id) {
      this.positionLoading = true
      await Position.allList().then((res) => {
        const {data} = res;
        const columns = data.map(item => {
          return {
            key: item.value, text: item.label || '未命名'
          }
        })
        this.positionColumns = [columns];
        if (id) {
          const checked = columns.find(item => {
            return item.key === id
          })
          this.userInfo = {
            ...this.userInfo,
            positionIds: checked ? [checked.key] : [],
            positionNames: checked ? checked.text : ''
          }
        }
      }).finally(() => {
        this.positionLoading = false
      });
    },
    positionConfirm({value}) {
      this.positionShow = false
      this.userInfo = {
        ...this.userInfo,
        positionIds: value[0] ? [value[0].key] : [],
        positionNames: value[0] ? value[0].text : ''
      }
    },
    positionClose() {
      this.positionShow = false
      setTimeout(() => {
        this.positionPickerShow = false
      }, 500)
    },
    positionCancel() {
      uni.navigateTo({
        url: '/User/Position/PositionAdd/index'
      })
    },
    userDetail() {
      this.loading = true
      User.userDetail({
        params: {
          userId: this.userId
        }
      }).then((res) => {
        const userInfo = res.data || {}
        this.showPhone = userInfo.phone
        this.userInfo = userInfo
      }).catch(() => {
        this.error = true
      }).finally(() => {
        this.loading = false
      })
    },
    openPosition() {
      this.positionIndex = this.positionColumns[0]?.findIndex(item => item.key === this.userInfo.positionIds[0]) || 0
      this.positionPickerShow = true
      this.positionShow = true
    },
    openDept() {
      this.deptShow = true
      // this.dept = {
      //   key: this.userInfo.deptId + '',
      //   title: this.userInfo.deptName
      // }
      this.depts = this.userInfo.depts
    },
    deptActionSelect({key}) {
      switch (key) {
        case 'admin':
          this.userInfo = {
            ...this.userInfo,
            depts: this.userInfo.depts.map((item, index) => {
              if (index === 0) {
                return {...this.actionDept, admin: true}
              } else if (this.actionDept.key === item.key) {
                return {...this.userInfo.depts[0], admin: false}
              } else {
                return {...item, admin: false}
              }
            })
          }
          break;
      }
    },
    saveDept() {
      this.deptShow = false
      const userInfo = this.userInfo || {}
      const deptAdmin = isArray(userInfo.depts).find(dept => dept.admin)
      const admin = deptAdmin ? this.depts.find(dept => dept.key === deptAdmin.key) : false
      this.userInfo = {
        ...this.userInfo,
        // deptId: this.dept.key,
        // deptName: this.dept.title,
        depts: this.depts.map((item, index) => {
          if (admin) {
            if (index === 0) {
              return {...admin, admin: true}
            } else if (admin.key === item.key) {
              return {...this.depts[0], admin: false}
            } else {
              return {...item, admin: false}
            }
          } else if (index === 0) {
            return {...item, admin: true}
          } else {
            return {...item, admin: false}
          }
        })
      }
    },
    getDeptTree() {
      this.deptTreeLoading = true
      Dept.deptTree().then((res) => {
        this.deptTree = isArray(res.data)[0]?.children
      }).catch(() => {
      }).finally(() => {
        this.deptTreeLoading = false
      })
    },
    save() {
      this.saveLoading = true
      const userInfo = this.userInfo
      User.userEdit({
        data: {
          userId: userInfo.userId,
          name: userInfo.name,
          sex: userInfo.sex,
          phone: userInfo.phone,
          email: userInfo.email,
          // deptId: userInfo.deptId,
          deptList: userInfo.depts.map(item => ({
            deptId: item.key,
            mainDept: item.admin ? 1 : 0
          })),
          position: isArray(userInfo.positionIds).join(',')
        }
      }).then(() => {
        this.$refs.modal.dialog({
          title: '保存成功！',
          only: false,
          confirmText: '返回',
          cancelText: '继续操作',
          onConfirm() {
            uni.navigateBack()
            return true
          }
        })
        uni.$emit('saveUserSuccess', userInfo)
      }).catch(() => {
        this.$refs.modal.dialog({
          title: Init.getNewErrorMessage() || '保存失败！'
        })
      }).finally(() => {
        this.saveLoading = false
      })
    }
  }
}
</script>

<style lang="scss">

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.box {
  background-color: #fff;
  padding: 0 12px;
  margin-top: 12px;

  .item, .endItem {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: solid 1px #F5F5F5;

    .label {
      width: 60px;
    }

    .value {
      flex-grow: 1;
      min-height: 21px;
      line-height: 21px;

      input {
        height: fit-content;
        font-size: 16px !important;
        line-height: normal;
      }

      .deptItem {
        padding: 8px 0;
        border-bottom: solid 1px #F5F5F5;
        display: flex;
        align-items: center;

        .deptInfo {
          flex-grow: 1;
          display: flex;
          align-items: center;
          gap: 8px;

          .icon {
            width: 30px;
            height: 30px;
          }
        }

        .deptAction {
          color: rgba(0, 0, 0, 0.3);
          font-size: 12px;
        }
      }

      .firstDeptItem {
        padding-top: 0;
      }

      .openDept {
        padding-top: 8px;
      }
    }
  }

  .endItem {
    border: none;
  }
}

.deptTree {
  height: 50vh;
  overflow: auto;
}
</style>

