<template>
  <view>
    <Loading skeleton skeleton-type="page" v-if="loading" />
    <view v-else>
      <Empty description="暂无库位" v-if="positionTree.length === 0" />
      <view v-else class="allPositions" :style="{paddingBottom: `${60+safeAreaHeight(this,8)}px`}">
        <PositionItem
            v-for="(item,index) in positionTree"
            :key="index"
            top
            :position="item"
            :opens="opens"
            @openPosition="openPosition"
            @setting="setting"
        />
      </view>

      <BottomButton
          only
          text="添加库位"
          @onClick="create"
      />

    </view>


    <u-action-sheet
        round="10"
        :safeAreaInsetBottom="true"
        cancelText="取消"
        :actions="settingActions"
        :title="settingTitle"
        :show="settingShow"
        @close="settingShow = false"
        @select="settingSelect"
    />
  </view>
</template>

<script>
import {Storehouse} from "MES-Apis/lib/Storehouse/promise";
import Loading from "../../components/Loading";
import PositionItem from "./components/PositionItem";
import {isArray, safeAreaHeight} from "../../util/Tools";
import BottomButton from "../../components/BottomButton";
import {Message} from "../../components/Message";
import {Init} from "MES-Apis/lib/Init";
import Tree from "../../components/Tree";
import Empty from "../../components/Empty";

export default {
  options: {
    styleIsolation: 'shared'
  },
  components: {Empty, Tree, BottomButton, PositionItem, Loading},
  props: ['storehouseId'],
  data() {
    return {
      safeAreaHeight,
      positionTree: [],
      loading: true,
      opens: [],
      settingActions: [],
      settingTitle: '',
      settingShow: false,
    }
  },
  mounted() {
    const _this = this
    uni.$on('positionsAddSuccess', () => {
      _this.getPositionTree()
    })
    this.getPositionTree()
  },
  methods: {
    create() {
      uni.navigateTo({
        url: `/Erp/Positions/PositionsAdd/index?storehouseId=${this.storehouseId}`
      })
    },
    openPosition(position) {
      if (this.opens.find(id => id === position.key)) {
        const opens = []
        this.getAllPositions(isArray(position.children), opens)
        this.opens = this.opens.filter(id => ![...opens, position.key].includes(id))
      } else {
        this.opens = [...this.opens, position.key]
      }
    },
    setting(position) {
      this.settingTitle = position.title
      this.settingShow = true

      let settingActions = [
        // {
        //   name: '设置权限',
        //   color: '#007aff',
        //   key: 'auth',
        // },
        {
          name: '编辑',
          color: '#f0ad4e',
          key: 'edit'
        },
        {
          name: '删除',
          color: '#dd524d',
          key: 'del'
        }
      ]
      if (isArray(position.children).length === 0) {
        // settingActions = [
        //   {
        //     name: '绑定物料',
        //     color: '#007aff',
        //     key: 'bind'
        //   },
        //   ...settingActions
        // ]
      }
      this.settingActions = settingActions.map(item => ({
        ...item,
        position
      }))
    },
    settingSelect(event) {
      const _this = this
      switch (event.key) {
        case 'bind':
          break;
        case 'auth':
          break;
        case 'edit':
          uni.navigateTo({
            url: `/Erp/Positions/PositionsAdd/index?storehouseId=${this.storehouseId}&storehousePositionsId=${event.position.key}`
          })
          break;
        case 'del':
          Message.dialog({
            title: `确定要删除库位【` + event.position.title + '】吗？',
            only: false,
            onConfirm() {
              return new Promise((resolve) => {
                Storehouse.positionsDelete({
                  data: {storehousePositionsId: event.position.key}
                }).then(() => {
                  _this.getPositionTree()
                  Message.successToast('删除成功！')
                  resolve(true)
                }).catch(() => {
                  Message.dialog({
                    title: Init.getNewErrorMessage()
                  })
                  resolve(true)
                })
              })
            }
          })
          break;
        default:
          break
      }
    },
    getPositionTree() {
      this.loading = true
      Storehouse.positionsTreeView({
        params: {
          ids: this.storehouseId
        }
      }).then((res) => {
        const opens = []
        const tree = res.data || []
        this.positionTree = tree
        // this.getAllPositions(tree, opens)
        // this.opens = opens
      }).catch(() => {

      }).finally(() => {
        this.loading = false
      })
    },
    getAllPositions(tree, positions) {
      tree.forEach(item => {
        if (isArray(item.children).length > 0) {
          positions.push(item.key)
          this.getAllPositions(isArray(item.children), positions)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.allPositions {
  padding: 12px 8px;
}

.u-action-sheet__header {
  border-bottom: solid 1px #d6d7d9;
}
</style>
