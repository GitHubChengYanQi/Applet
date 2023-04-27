<template>
  <view class="body">
    <scroll-view :style="{maxHeight:'calc(100vh - 12px)'}" :scroll-y="scroll">
      <view class="box">
        <view class="header">
          <view class="title">首页功能</view>
          <view class="setting" @click="setting ? save() : (setting = !setting)">
            <template v-if="setting">
              保存
            </template>
            <template v-else>
              管理
              <u-icon name="setting" color="#007aff" size="14" />
            </template>
          </view>
        </view>

        <view class="homeMenusSetting">
          <Drag
              :disabled="!setting"
              v-if="homeMenus.length > 0"
              :controlsArray="homeMenus"
              :controlsSize="{width: dropInfo.itemWidth, height: dropInfo.itemHeight}"
              :height="`${Math.ceil(homeMenus.length / 4) * 99}px`"
              :maxWidthCount="4"
              @handleTouchstart="()=>scroll=false"
              @handleTouchend="()=>scroll=true"
              @dragEnd="dragEnd"
              :params="{setting}"
          >
            <template #content="{end,item,params,colEnd}">
              <view :class="{
                menuItem:true,
                endMenuItem:end || colEnd
              }"
              >
                <view class="icon">
                  <Icon
                      :icon="item.icon || 'icon-danxuanweixuanzhong'"
                      size="40"
                      @click="click(item)"
                  />
                  <view
                      v-show="params.setting"
                      class="actionIcon"
                      @click="removeMenu(item)"
                  >
                    <u-icon
                        name="minus-circle-fill"
                        color="#bdbaba"
                        size="20"
                    />
                  </view>
                </view>

                <view
                    class="menuName"
                    style="font-size:14px"
                    @click="click(item)"
                >
                  {{ item.name }}
                </view>
              </view>
            </template>
          </Drag>
        </view>


        <view v-if="false" class="homeMenus" @click="open=true">
          <view class="label">
            已收起{{ homeMenus.length }}个首页应用
          </view>
          <view class="menus">
            <Icon
                v-for="(item,index) in homeMenus"
                :key="index"
                :icon="item.icon"
                size="16"
            />
            <u-icon name="arrow-down" color="#D8D8D8" size="14" />
          </view>
        </view>

      </view>
      <view
          class="box"
          v-for="(item,index) in routes"
          :key="index"
          v-if="(item.menus || []).length > 0"
      >
        <view class="header">
          <view class="title">{{ item.name }}</view>
        </view>
        <MenuCard
            :noActionIconMenus="homeMenus"
            :action-icon="setting"
            :menus="item.menus"
            :column="4"
            :iconSize="40"
            :font-size="14"
            padding="18px 0"
            @click="click"
            @addMenu="addMenu"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script>
import {routes} from "../../route";
import Icon from "../../components/Icon";
import MenuCard from "../../components/MenuCard";
import {Message} from "../../components/Message";
import {User} from "MES-Apis/lib/User/promise";
import Drag from "../../components/Drag";

export default {
  name: "Menus",
  components: {
    Drag,
    MenuCard,
    Icon
  },
  data() {
    return {
      routes,
      setting: false,
      open: false,
      scroll: true,
      saveLoading: false,
      homeMenus: [],
      dropInfo: {}
    }
  },
  mounted() {
    const windowWidth = this.$store.state.systemInfo.systemInfo.windowWidth

    const homeMenus = this.$store.state.userInfo.homeMenus || []

    this.dropInfo = {
      itemHeight: 99,
      itemWidth: (windowWidth - 24) / 4,
    }
    this.homeMenus = homeMenus

  },
  methods: {
    click(menu) {
      uni.navigateTo({
        url: menu.url
      })
    },
    addMenu(menu) {
      if (this.homeMenus.length >= 5) {
        Message.toast('最多增加5个首页功能！')
        return
      }
      this.homeMenus = [...this.homeMenus, menu]
    },
    removeMenu(menu) {
      if (this.homeMenus.length <= 1) {
        Message.toast('最少保留1个首页功能！')
        return
      }
      this.homeMenus = this.homeMenus.filter(item => item.key !== menu.key)
    },
    dragEnd(menus) {
      this.homeMenus = menus
    },
    save() {
      this.saveLoading = true
      User.homeMenusAdd({
        data: {
          details: this.homeMenus.map((item, index) => ({
            name: item.name,
            code: item.key,
            icon: item.icon,
            url: item.url,
            sort: index
          })),
          type: 2
        }
      }).then(() => {
        this.setting = false
        this.open = false
        this.$store.dispatch('userInfo/getHomeMenus', true)
        Message.successToast('保存成功！')
      }).catch(() => {
        Message.errorToast('保存失败！')
      }).finally(() => {
        this.saveLoading = false
      })
    }
  }
}
</script>

<style lang="scss">
.body {
  padding: 12px 12px 0;
}

.box {
  margin-bottom: 22px;
}

.header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;

  .title {
    font-weight: bold;
  }

  .setting {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #007aff;
  }
}

.homeMenusSetting {
  background-color: #fff;
  border-radius: 8px;
  margin-top: 10px;
}

.homeMenus {
  padding: 18px 15px;
  background-color: #fff;
  border-radius: 8px;
  margin-top: 10px;
  display: flex;
  align-items: center;

  .label {
    flex-grow: 1;
    font-size: 12px;
    color: #808080;
  }

  .menus {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

.menuItem {
  text-align: center;
  padding: 18px 0;
  border-bottom: dashed 1px rgba(57, 116, 199, 0.1);
  border-right: dashed 1px rgba(57, 116, 199, 0.1);


  .icon {
    position: relative;
    width: fit-content;
    display: inline-block;

    .actionIcon {
      position: absolute;
      right: -20px;
      top: -10px;
    }
  }


  .menuName {
    //padding-top: 12px;
  }
}

.endMenuItem {
  border-right: none;
}
</style>
