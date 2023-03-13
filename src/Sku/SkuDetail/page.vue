<template>
  <view id="root">
    <view class="safeArea">
      <view class="skuDetail">
        <view class="imgS">
          <view class="uni-margin-wrap">
            <swiper @change="change">
              <swiper-item v-for="src in srcs" :key="srcs">
                <image :src="src" @click="img" mode="aspectFill"></image>
              </swiper-item>
            </swiper>
          </view>
          <view class="edit">
            <uni-icons type="compose" color="#ffffff"></uni-icons>
          </view>
          <view class="customIndicator">{{ customIndicator }}/{{ total }}</view>
        </view>   <!-- 轮播图 -->
        <view class="header">
          <view class="flexCenter sku">
            <view class="flexGrow">
              <view class="spuName">{{ spuName }}</view>
              <view class="skuName">{{ skuName }}</view>
              <view class="bindPosition">{{ bindPosition }}</view>
            </view>
            <view class="otherData">
              <view class="erWeiMaClick" @click="auto">
                <uni-icons custom-prefix="icon-font" type="icon-erweima" color="#2680EB"></uni-icons>
              </view>
              <van-dialog
                  use-slot
                  title="是否打印物料码"
                  :show="showErWeiMa"
                  show-cancel-button
                  cancel-button-text="取消"
                  cancel-button-color="#2680EB"
                  confirm-button-text="打印"
                  confirm-button-color="#2680EB"
                  @close="auto"
                  width="280px"
              >
                <view class="center">
                  <image :src=erweima style="width: 187px; height: 187px"></image>
                </view>
              </van-dialog>
              <view class="number">
                <view class="span">×234</view>
                <view class="unit">件</view>
              </view>
            </view>
          </view>
          <view class="actions flexCenter">
            <view class="action flexGrow">
              <view class="list" @click="showList">
                <uni-icons type="list" color="#2680EB" size="14"></uni-icons>
                库存明细
              </view>
            </view>
            <view class="action flexGrow">
              <view class="list">
                <uni-icons type="flag" color="#2680EB" size="14"></uni-icons>
                关联任务
              </view>
            </view>
            <view class="action flexGrow">
              <view class="list" @click="showRecord">
                <uni-icons type="info" color="#2680EB" size="14"></uni-icons>
                操作记录
              </view>
            </view>
          </view>
        </view>
        <view class="skuData">
          <view class="adm-space adm-space-vertical" style="width: 100%">
            <view class="adm-space-item">
              <view class="flexCenter">
                <view class="lable lables">物料分类</view>
                <view class="value">产成品</view>
              </view>
            </view>
            <view class="adm-space-item">
              <view class="flexCenter">
                <view class="lable lables">物料编码</view>
                <view class="value">00001</view>
              </view>
            </view>
            <view class="adm-space-item">
              <view class="flexCenter">
                <view class="lable lables">产品名称</view>
                <view class="value">数控车床</view>
              </view>
            </view>
            <view class="adm-space-item">
              <view class="flexCenter">
                <view class="lable lables">产品码</view>
                <view class="value">2</view>
              </view>
            </view>
            <view class="show" style="overflow: hidden" :hidden="hidden">
              <view class="adm-space-item">
                <view class="flexCenter">
                  <view class="lable lables">单位</view>
                  <view class="value">件</view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">二维码生成方式</view>
                    <view class="value">一批一码</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">规格</view>
                    <view class="value">0213</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">养护周期</view>
                    <view class="value">0 天</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">物料描述</view>
                    <view class="value">无</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">品牌</view>
                    <view class="value">浑河库存、超同步</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">型号</view>
                    <view class="value">-</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">材质</view>
                    <view class="value">-</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">重量</view>
                    <view class="value">0 kg</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">尺寸</view>
                    <view class="value">-</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">表色</view>
                    <view class="value">-</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">级别</view>
                    <view class="value">-</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">热处理</view>
                    <view class="value">-</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">包装方式</view>
                    <view class="value">-</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">图幅</view>
                    <view class="value">-</view>
                  </view>
                </view>
                <view class="adm-space-item">
                  <view class="flexCenter">
                    <view class="lable lables">备注</view>
                    <view class="value">-</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <van-divider dashed contentPosition="center">
            <view class="adm-divider-content" @click="many">
              <uni-icons :type=" hidden===true ? 'bottom' : 'top' "></uni-icons>
            </view>
          </van-divider>
        </view>
        <view class="supply">
          <view class="title">
            供应商(2)
            <view class="extra">
              <view class="submit" @click="more">
                查看更多
                <uni-icons type="right" color="#2680eb"></uni-icons>
              </view>
            </view>
          </view>
          <view class="flexCenter supplyItem">
            <view class="flexGrow">沧州力久机械执照有限公司</view>
          </view>
          <view class="flexCenter supplyItem">
            <view class="flexGrow">成都信华光电技术有限公司</view>
          </view>
        </view>  <!--供应商内容 -->
      </view> <!-- 物料详情内容 -->
      <Popup :show="show" position="bottom" @close="custom" close-on-click-overlay="true" title="供应商">
        <view style="padding: 12px">
          <view class="supplyCard card">
            <view class="supplyHeader">
              <view class="titles">沧州力久机械制造有限公司</view>
            </view>
            <view class="supplyContent content">
              <view class="adm-space adm-space-wrap amd-space-horizontal">
                <view class="adm-space-item">
                  <view class="brands">无品牌</view>
                </view>
              </view>
            </view>
          </view>
          <view class="supplyCard card">
            <view class="supplyHeader">
              <view class="titles">成都信华光电技术有限公司</view>
            </view>
            <view class="supplyContent content">
              <view class="adm-space adm-space-wrap amd-space-horizontal">
                <view class="adm-space-item">
                  <view class="brands">浑河库存</view>
                </view>
                <view class="adm-space-item">
                  <view class="brands">丹东汉克</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </Popup>
      <van-popup :show="showSkuDetail" @close="overlay" position="bottom" close-on-click-overlay="true">
        <view class="headers">
          库存明细
          <view class="right" @click="cancelList">
            <uni-icons type="closeempty"></uni-icons>
          </view>
        </view>
        <view class="contents">
          <view class="search" style="box-shadow: rgba(0,0,0,0.1) 0 4px 5px 0">
            <Search
                :value="value"
                placeholder='请输入实物码'
                width="8vw"
            />
          </view>
          <view class="storeList">
            <view class="storeLists">
              <view class="positionItem">
                <view class="positionName">
                  <view class="name">
                    东1 / 车间现场库(1)
                  </view>
                  <view class="storeIcon" @click="showStoreList">
                    <uni-icons :type=" inkindItemHidden===true ? 'bottom' : 'top' " color="#2680EB"></uni-icons>
                  </view>
                </view>
                <view class="inkindItem" :hidden="inkindItemHidden">
                  <view class="inkindData">
                    <view class="inkindId">
                      实物码：
                      <view class="erWeiMaClick" @click="auto">
                        <uni-icons custom-prefix="icon-font" type="icon-erweima" color="#2680EB"></uni-icons>
                      </view>
                      <view>× 1</view>
                    </view>
                    <view class="storeBrand">无品牌</view>
                  </view>
                  <view class="storeOtherData">
                    <view class="flex">
                      <view class="storeFlexGrow">
                        入库时间：01月31日 11:18
                      </view>
                      <view>宋正飞</view>
                    </view>
                  </view>
                  <view class="storeOtherData" style="padding-bottom: 8px">
                    <view class="flex">
                      <view class="storeFlexGrow">
                        上次养护：暂无
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="storeLists">
              <view class="positionItem">
                <view class="positionName">
                  <view class="name">
                    东1 / 车间现场库(1)
                  </view>
                  <view class="storeIcon" @click="showStoreList">
                    <uni-icons :type=" inkindItemHidden===true ? 'bottom' : 'top' " color="#2680EB"></uni-icons>
                  </view>
                </view>
                <view class="inkindItem" :hidden="inkindItemHidden">
                  <view class="inkindData">
                    <view class="inkindId">
                      实物码：
                      <view class="erWeiMaClick" @click="auto">
                        <uni-icons custom-prefix="icon-font" type="icon-erweima" color="#2680EB"></uni-icons>
                      </view>
                      <view>× 1</view>
                    </view>
                    <view class="storeBrand">无品牌</view>
                  </view>
                  <view class="storeOtherData">
                    <view class="flex">
                      <view class="storeFlexGrow">
                        入库时间：01月31日 11:18
                      </view>
                      <view>宋正飞</view>
                    </view>
                  </view>
                  <view class="storeOtherData" style="padding-bottom: 8px">
                    <view class="flex">
                      <view class="storeFlexGrow">
                        上次养护：暂无
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="storeLists">
              <view class="positionItem">
                <view class="positionName">
                  <view class="name">
                    东1 / 车间现场库(1)
                  </view>
                  <view class="storeIcon" @click="showStoreList">
                    <uni-icons :type=" inkindItemHidden===true ? 'bottom' : 'top' " color="#2680EB"></uni-icons>
                  </view>
                </view>
                <view class="inkindItem" :hidden="inkindItemHidden">
                  <view class="inkindData">
                    <view class="inkindId">
                      实物码：
                      <view class="erWeiMaClick" @click="auto">
                        <uni-icons custom-prefix="icon-font" type="icon-erweima" color="#2680EB"></uni-icons>
                      </view>
                      <view>× 1</view>
                    </view>
                    <view class="storeBrand">无品牌</view>
                  </view>
                  <view class="storeOtherData">
                    <view class="flex">
                      <view class="storeFlexGrow">
                        入库时间：01月31日 11:18
                      </view>
                      <view>宋正飞</view>
                    </view>
                  </view>
                  <view class="storeOtherData" style="padding-bottom: 8px">
                    <view class="flex">
                      <view class="storeFlexGrow">
                        上次养护：暂无
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="storeLists">
              <view class="positionItem">
                <view class="positionName">
                  <view class="name">
                    东1 / 车间现场库(1)
                  </view>
                  <view class="storeIcon" @click="showStoreList">
                    <uni-icons :type=" inkindItemHidden===true ? 'bottom' : 'top' " color="#2680EB"></uni-icons>
                  </view>
                </view>
                <view class="inkindItem" :hidden="inkindItemHidden">
                  <view class="inkindData">
                    <view class="inkindId">
                      实物码：
                      <view class="erWeiMaClick" @click="auto">
                        <uni-icons custom-prefix="icon-font" type="icon-erweima" color="#2680EB"></uni-icons>
                      </view>
                      <view>× 1</view>
                    </view>
                    <view class="storeBrand">无品牌</view>
                  </view>
                  <view class="storeOtherData">
                    <view class="flex">
                      <view class="storeFlexGrow">
                        入库时间：01月31日 11:18
                      </view>
                      <view>宋正飞</view>
                    </view>
                  </view>
                  <view class="storeOtherData" style="padding-bottom: 8px">
                    <view class="flex">
                      <view class="storeFlexGrow">
                        上次养护：暂无
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="storeLists">
              <view class="positionItem">
                <view class="positionName">
                  <view class="name">
                    东1 / 车间现场库(1)
                  </view>
                  <view class="storeIcon" @click="showStoreList">
                    <uni-icons :type=" inkindItemHidden===true ? 'bottom' : 'top' " color="#2680EB"></uni-icons>
                  </view>
                </view>
                <view class="inkindItem" :hidden="inkindItemHidden">
                  <view class="inkindData">
                    <view class="inkindId">
                      实物码：
                      <view class="erWeiMaClick" @click="auto">
                        <uni-icons custom-prefix="icon-font" type="icon-erweima" color="#2680EB"></uni-icons>
                      </view>
                      <view>× 1</view>
                    </view>
                    <view class="storeBrand">无品牌</view>
                  </view>
                  <view class="storeOtherData">
                    <view class="flex">
                      <view class="storeFlexGrow">
                        入库时间：01月31日 11:18
                      </view>
                      <view>宋正飞</view>
                    </view>
                  </view>
                  <view class="storeOtherData" style="padding-bottom: 8px">
                    <view class="flex">
                      <view class="storeFlexGrow">
                        上次养护：暂无
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="storeLists">
              <view class="positionItem">
                <view class="positionName">
                  <view class="name">
                    东1 / 车间现场库(1)
                  </view>
                  <view class="storeIcon" @click="showStoreList">
                    <uni-icons :type=" inkindItemHidden===true ? 'bottom' : 'top' " color="#2680EB"></uni-icons>
                  </view>
                </view>
                <view class="inkindItem" :hidden="inkindItemHidden">
                  <view class="inkindData">
                    <view class="inkindId">
                      实物码：
                      <view class="erWeiMaClick" @click="auto">
                        <uni-icons custom-prefix="icon-font" type="icon-erweima" color="#2680EB"></uni-icons>
                      </view>

                      <view>× 1</view>
                    </view>
                    <view class="storeBrand">无品牌</view>
                  </view>
                  <view class="storeOtherData">
                    <view class="flex">
                      <view class="storeFlexGrow">
                        入库时间：01月31日 11:18
                      </view>
                      <view>宋正飞</view>
                    </view>
                  </view>
                  <view class="storeOtherData" style="padding-bottom: 8px">
                    <view class="flex">
                      <view class="storeFlexGrow">
                        上次养护：暂无
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="storeLists">
              <view class="positionItem">
                <view class="positionName">
                  <view class="name">
                    东1 / 车间现场库(1)
                  </view>
                  <view class="storeIcon" @click="showStoreList">
                    <uni-icons :type=" inkindItemHidden===true ? 'bottom' : 'top' " color="#2680EB"></uni-icons>
                  </view>
                </view>
                <view class="inkindItem" :hidden="inkindItemHidden">
                  <view class="inkindData">
                    <view class="inkindId">
                      实物码：
                      <view class="erWeiMaClick" @click="auto">
                        <uni-icons custom-prefix="icon-font" type="icon-erweima" color="#2680EB"></uni-icons>
                      </view>
                      <view>× 1</view>
                    </view>
                    <view class="storeBrand">无品牌</view>
                  </view>
                  <view class="storeOtherData">
                    <view class="flex">
                      <view class="storeFlexGrow">
                        入库时间：01月31日 11:18
                      </view>
                      <view>宋正飞</view>
                    </view>
                  </view>
                  <view class="storeOtherData" style="padding-bottom: 8px">
                    <view class="flex">
                      <view class="storeFlexGrow">
                        上次养护：暂无
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="storeLists">
              <view class="positionItem">
                <view class="positionName">
                  <view class="name">
                    东1 / 车间现场库(1)
                  </view>
                  <view class="storeIcon" @click="showStoreList">
                    <uni-icons :type=" inkindItemHidden===true ? 'bottom' : 'top' " color="#2680EB"></uni-icons>
                  </view>
                </view>
                <view class="inkindItem" :hidden="inkindItemHidden">
                  <view class="inkindData">
                    <view class="inkindId">
                      实物码：
                      <view class="erWeiMaClick" @click="auto">
                        <uni-icons custom-prefix="icon-font" type="icon-erweima" color="#2680EB"></uni-icons>
                      </view>
                      <view>× 1</view>
                    </view>
                    <view class="storeBrand">无品牌</view>
                  </view>
                  <view class="storeOtherData">
                    <view class="flex">
                      <view class="storeFlexGrow">
                        入库时间：01月31日 11:18
                      </view>
                      <view>宋正飞</view>
                    </view>
                  </view>
                  <view class="storeOtherData" style="padding-bottom: 8px">
                    <view class="flex">
                      <view class="storeFlexGrow">
                        上次养护：暂无
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="storeLists">
              <view class="positionItem">
                <view class="positionName">
                  <view class="name">
                    东1 / 车间现场库(1)
                  </view>
                  <view class="storeIcon" @click="showStoreList">
                    <uni-icons :type=" inkindItemHidden===true ? 'bottom' : 'top' " color="#2680EB"></uni-icons>
                  </view>
                </view>
                <view class="inkindItem" :hidden="inkindItemHidden">
                  <view class="inkindData">
                    <view class="inkindId">
                      实物码：
                      <view class="erWeiMaClick" @click="auto">
                        <uni-icons custom-prefix="icon-font" type="icon-erweima" color="#2680EB"></uni-icons>
                      </view>
                      <view>× 1</view>
                    </view>
                    <view class="storeBrand">无品牌</view>
                  </view>
                  <view class="storeOtherData">
                    <view class="flex">
                      <view class="storeFlexGrow">
                        入库时间：01月31日 11:18
                      </view>
                      <view>宋正飞</view>
                    </view>
                  </view>
                  <view class="storeOtherData" style="padding-bottom: 8px">
                    <view class="flex">
                      <view class="storeFlexGrow">
                        上次养护：暂无
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="scroll">
              --- 我是有底线的 ---
            </view>
            <view class="top" style="opacity: 1;transform: translate(0px,0px)">

            </view>
          </view>
        </view>
      </van-popup>  <!-- 点击物料详情 弹出层 -->
      <van-popup :show="showOperationRecord" @close="operation" position="bottom" close-on-click-overlay="true">
        <view class="headers">
          操作记录
          <view class="right" @click="cancelRecordList">
            <uni-icons type="closeempty"></uni-icons>
          </view>
        </view>
        <view id="skuLog" style="height: 80vh; top: 0">
          <view class="search">
            <Search
                :value="value"
                placeholder='请输入搜索内容'
                width="8vw"
            />
            <view class="space" style="height: 1px"></view>
            <view style="overflow: auto; max-height: calc(80vh - 60px)">
              <view class="logItem">
                <view class="logItems">
                  <view class="flexCenter" style="padding-bottom: 8px">
                    <view class="flexGrow" style="display: flex">
                      <view class="type"> · 入库</view>
                      <view>×50</view>
                      <view style="margin-left: 8px">结余：1752</view>
                    </view>
                    <view> 无品牌</view>
                  </view>
                  <view class="flexCenter flexCenters">
                    <view class="flexGrow" style="display: flex">
                      Z1-3-2/南坡大库
                    </view>
                    <view class="user">孙嘉龙/03月02日 10:32</view>
                  </view>
                  <view style="padding: 8px 0">
                    来源：采购订单1111
                    <uni-icons type="right"></uni-icons>
                  </view>
                  <view class="space"></view>
                </view>
                <view class="logItems">
                  <view class="flexCenter" style="padding-bottom: 8px">
                    <view class="flexGrow" style="display: flex">
                      <view class="type"> · 入库</view>
                      <view>×50</view>
                      <view style="margin-left: 8px">结余：1752</view>
                    </view>
                    <view> 无品牌</view>
                  </view>
                  <view class="flexCenter flexCenters">
                    <view class="flexGrow" style="display: flex">
                      Z1-3-2/南坡大库
                    </view>
                    <view class="user">孙嘉龙/03月02日 10:32</view>
                  </view>
                  <view style="padding: 8px 0">
                    来源：采购订单1111
                    <uni-icons type="right"></uni-icons>
                  </view>
                  <view class="space"></view>
                </view>
                <view class="logItems">
                  <view class="flexCenter" style="padding-bottom: 8px">
                    <view class="flexGrow" style="display: flex">
                      <view class="type"> · 入库</view>
                      <view>×50</view>
                      <view style="margin-left: 8px">结余：1752</view>
                    </view>
                    <view> 无品牌</view>
                  </view>
                  <view class="flexCenter flexCenters">
                    <view class="flexGrow" style="display: flex">
                      Z1-3-2/南坡大库
                    </view>
                    <view class="user">孙嘉龙/03月02日 10:32</view>
                  </view>
                  <view style="padding: 8px 0">
                    来源：采购订单1111
                    <uni-icons type="right"></uni-icons>
                  </view>
                  <view class="space"></view>
                </view>
                <view class="logItems">
                  <view class="flexCenter" style="padding-bottom: 8px">
                    <view class="flexGrow" style="display: flex">
                      <view class="type"> · 入库</view>
                      <view>×50</view>
                      <view style="margin-left: 8px">结余：1752</view>
                    </view>
                    <view> 无品牌</view>
                  </view>
                  <view class="flexCenter flexCenters">
                    <view class="flexGrow" style="display: flex">
                      Z1-3-2/南坡大库
                    </view>
                    <view class="user">孙嘉龙/03月02日 10:32</view>
                  </view>
                  <view style="padding: 8px 0">
                    来源：采购订单1111
                    <uni-icons type="right"></uni-icons>
                  </view>
                  <view class="space"></view>
                </view>
                <view class="logItems">
                  <view class="flexCenter" style="padding-bottom: 8px">
                    <view class="flexGrow" style="display: flex">
                      <view class="type"> · 入库</view>
                      <view>×50</view>
                      <view style="margin-left: 8px">结余：1752</view>
                    </view>
                    <view> 无品牌</view>
                  </view>
                  <view class="flexCenter flexCenters">
                    <view class="flexGrow" style="display: flex">
                      Z1-3-2/南坡大库
                    </view>
                    <view class="user">孙嘉龙/03月02日 10:32</view>
                  </view>
                  <view style="padding: 8px 0">
                    来源：采购订单1111
                    <uni-icons type="right"></uni-icons>
                  </view>
                  <view class="space"></view>
                </view>
                <view class="logItems">
                  <view class="flexCenter" style="padding-bottom: 8px">
                    <view class="flexGrow" style="display: flex">
                      <view class="type"> · 入库</view>
                      <view>×50</view>
                      <view style="margin-left: 8px">结余：1752</view>
                    </view>
                    <view> 无品牌</view>
                  </view>
                  <view class="flexCenter flexCenters">
                    <view class="flexGrow" style="display: flex">
                      Z1-3-2/南坡大库
                    </view>
                    <view class="user">孙嘉龙/03月02日 10:32</view>
                  </view>
                  <view style="padding: 8px 0">
                    来源：采购订单1111
                    <uni-icons type="right"></uni-icons>
                  </view>
                  <view class="space"></view>
                </view>
                <view class="logItems">
                  <view class="flexCenter" style="padding-bottom: 8px">
                    <view class="flexGrow" style="display: flex">
                      <view class="type"> · 入库</view>
                      <view>×50</view>
                      <view style="margin-left: 8px">结余：1752</view>
                    </view>
                    <view> 无品牌</view>
                  </view>
                  <view class="flexCenter flexCenters">
                    <view class="flexGrow" style="display: flex">
                      Z1-3-2/南坡大库
                    </view>
                    <view class="user">孙嘉龙/03月02日 10:32</view>
                  </view>
                  <view style="padding: 8px 0">
                    来源：采购订单1111
                    <uni-icons type="right"></uni-icons>
                  </view>
                  <view class="space"></view>
                </view>
                <view class="logItems">
                  <view class="flexCenter" style="padding-bottom: 8px">
                    <view class="flexGrow" style="display: flex">
                      <view class="type"> · 入库</view>
                      <view>×50</view>
                      <view style="margin-left: 8px">结余：1752</view>
                    </view>
                    <view> 无品牌</view>
                  </view>
                  <view class="flexCenter flexCenters">
                    <view class="flexGrow" style="display: flex">
                      Z1-3-2/南坡大库
                    </view>
                    <view class="user">孙嘉龙/03月02日 10:32</view>
                  </view>
                  <view style="padding: 8px 0">
                    来源：采购订单1111
                    <uni-icons type="right"></uni-icons>
                  </view>
                  <view class="space"></view>
                </view>
                <view class="logItems">
                  <view class="flexCenter" style="padding-bottom: 8px">
                    <view class="flexGrow" style="display: flex">
                      <view class="type"> · 入库</view>
                      <view>×50</view>
                      <view style="margin-left: 8px">结余：1752</view>
                    </view>
                    <view> 无品牌</view>
                  </view>
                  <view class="flexCenter flexCenters">
                    <view class="flexGrow" style="display: flex">
                      Z1-3-2/南坡大库
                    </view>
                    <view class="user">孙嘉龙/03月02日 10:32</view>
                  </view>
                  <view style="padding: 8px 0">
                    来源：采购订单1111
                    <uni-icons type="right"></uni-icons>
                  </view>
                  <view class="space"></view>
                </view>
                <view class="scroll">
                  --- 我是有底线的 ---
                </view>
              </view>
            </view>
          </view>
        </view>
      </van-popup>  <!-- 点击操作记录弹出层 弹出层 -->
    </view>
  </view>
</template>

<script>

import Search from "@/components/Search";
import Popup from "@/components/Popup";

export default {
  name: "index.vue",
  components: {Popup, Search},
  data() {
    return {
      srcs: [
        'https://gpkx.oss-cn-beijing.aliyuncs.com/upload/jpeg/20230217/20230217278175.jpeg?Expires=1678345061&OSSAccessKeyId=LTAIypr5IqQ1tvpM&Signature=%2BSm42IYUEASV5Vm%2F7N5oj2FLk4s%3D',
        'https://gpkx.oss-cn-beijing.aliyuncs.com/upload/jpeg/20230217/20230217754752.jpeg?Expires=1678510284&OSSAccessKeyId=LTAIypr5IqQ1tvpM&Signature=SLMhj9DKJkpPtrhHkIXtc%2FllqL4%3D',
        'https://gpkx.oss-cn-beijing.aliyuncs.com/upload/png/20230217/20230217261905.png?Expires=1678505096&OSSAccessKeyId=LTAIypr5IqQ1tvpM&Signature=BAOzIRKgVkPAl2K3Q5uZZy8kywY%3D'
      ],
      erweima: "data:image/png;base64,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",
      customIndicator: 1,
      spuName: '数控车床',
      skuName: 't5 /0213',
      bindPosition: '铸件一区 / 南坡大坝',
      hidden: true,
      value: '',
      inkindItemHidden: false,
      show: false,
      showErWeiMa: false, //展示二维码
      showSkuDetail: false, //展示物料清单
      showOperationRecord: false //展示操作记录
    }
  },
  computed: {
    total() {
      return this.srcs.length;
    }
  }
  ,
  methods: {
    many() {
      this.hidden = !this.hidden
    },
    more() {
      this.show = true
    },
    showList() {
      this.showSkuDetail = true
    },
    cancelList() {
      this.showSkuDetail = false
    },
    showRecord() {
      this.showOperationRecord = true
    },
    cancelRecordList() {
      this.showOperationRecord = false
    },
    cancel() {
      this.show = false
    },
    img() {
      uni.previewImage({
        urls: [
          'https://gpkx.oss-cn-beijing.aliyuncs.com/upload/jpeg/20230217/20230217278175.jpeg?Expires=1678345061&OSSAccessKeyId=LTAIypr5IqQ1tvpM&Signature=%2BSm42IYUEASV5Vm%2F7N5oj2FLk4s%3D',
          'https://gpkx.oss-cn-beijing.aliyuncs.com/upload/jpeg/20230217/20230217754752.jpeg?Expires=1678510284&OSSAccessKeyId=LTAIypr5IqQ1tvpM&Signature=SLMhj9DKJkpPtrhHkIXtc%2FllqL4%3D',
          'https://gpkx.oss-cn-beijing.aliyuncs.com/upload/png/20230217/20230217261905.png?Expires=1678505096&OSSAccessKeyId=LTAIypr5IqQ1tvpM&Signature=BAOzIRKgVkPAl2K3Q5uZZy8kywY%3D'
        ]
      })
    },
    change(event) {
      const {current} = event.detail;
      this.customIndicator = current + 1;
    },
    auto() {
      this.showErWeiMa = !this.showErWeiMa;
    },
    showStoreList() {
      this.inkindItemHidden = !this.inkindItemHidden
    },
    overlay() {
      this.showSkuDetail = !this.showSkuDetail
    },
    custom() {
      this.show = !this.show
    },
    operation() {
      this.showOperationRecord = !this.showOperationRecord
    }
  }

}
</script>

<style lang="scss">

.list uni-icons {
  margin-right: 4px;
}

.center {
  border-top: 1px solid #EEEEEE;
  text-align: center;
  padding: 12px 12px 20px;
}

.center img {
  width: 100vw;
  height: 100vh;
}

.safeArea .skuDetail {
  height: 100%;
  overflow: auto;
}

.imgS {
  position: relative;
  width: 100vw;
  height: 100vw;
}

.uni-margin-wrap, swiper, image {
  width: 100%;
  height: 100%;
}

.edit {
  position: absolute;
  top: 12px;
  right: 12px;
  border-radius: 50px;
  background: rgba(0, 0, 0, 0.5);
  height: 24px;
  text-align: center;
  line-height: 24px;
  width: 24px;
  color: #FFFFFF;
}

.customIndicator {
  position: absolute;
  bottom: 12px;
  right: 12px;
  border-radius: 50px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  color: #FFFFFF;
  user-select: none;
}

.header {
  margin: 8px;
  padding: 0 12px;
  background-color: #FFFFFF;
  border-radius: 6px;
}

.sku {
  padding-top: 12px;
  align-items: stretch;
}

.flexCenter {
  display: flex;
  align-items: center;
}

.spuName {
  font-weight: bold;
  font-size: 20px;
}

.skuName, .bindPosition {
  font-size: 14px;
  padding-top: 8px;
}

.actions {
  font-size: 12px;
  padding: 8px 0 12px 0;
  border-top: 1px solid #F5F5F5;
  margin-top: 12px;
}

.action {
  font-size: 12px;
  color: #3D3D3D;
  text-align: center;
}

.flexGrow {
  flex-grow: 1;
}

.otherData {
  width: 82px;
  height: 71px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.number {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
}

.skuData {
  margin: 0 8px;
  padding: 12px;
  background-color: #FFFFFF;
  border-radius: 6px;
}

.adm-space-vertical {
  flex-direction: column;
}

.adm-space {
  display: inline-flex;
  --gap: 8px;
  --gap-vertical: var(--gap);
  --gap-horizontai: var(--gap);
}

.adm-space-vertical > .adm-space-item {
  margin-bottom: var(--gap-vertical);
}

.adm-space-item {
  flex: none;
}

.value {
  flex-grow: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 14px;
}

.lable {
  min-width: 80px;
  width: 80px;
  color: #9A9A9A;
  margin-right: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 14px;
}

.lables {
  text-align: justify;
  text-align-last: justify;
  display: inline-block;
  color: #9d9d9d;
}

.content {
  flex: none;
  padding: 0 16px;
}

.supply {
  margin: 8px;
  padding: 12px;
  background-color: #FFFFFF;
  border-radius: 6px;
}

.title {
  font-weight: bold;
  padding-bottom: 8px;
  font-size: 13px;
}

.extra {
  float: right;
}

.submit {
  padding-bottom: 8px;
  color: #2680eb;
}

.supplyItem {
  margin: 8px 0;
  font-size: 14px;
}

.headers {
  height: 45px;
  line-height: 45px;
  text-align: center;
  font-size: 18px;
  border-bottom: 1px solid #EEEEEE;
  position: relative;
}

.right {
  top: 0;
  position: absolute;
  right: 0;
  padding: 0 12px;
}

.supplyCard {
  padding: 0;
  margin-bottom: 8px;
  border: 1px solid #E1EBF6;
}

.supplyHeader {
  background-color: #E1EBF6;
  padding: 8px 12px;
}

.titles {
  flex-grow: 1;
}

.supplyContent {
  background-color: #FFFFFF;
  padding: 8px;
}

.amd-space-horizontal.adm-space-wrap {
  flex-wrap: wrap;
  margin-bottom: calc(var(--gap-vertical) * -1);
}

.amd-space-horizontal {
  flex-direction: row;
}

.amd-space-horizontal.adm-space-wrap > .adm-space-item {
  padding-bottom: var(--gap-vertical);
}

.amd-space-horizontal > .adm-space-item:last-child {
  margin-right: 0;
}

.amd-space-horizontal > .adm-space-item {
  margin-right: var(--gap-horizontai);
}

.brands {
  padding: 4px 8px;
  background-color: #EEEEEE;
}


.adm-image-viewer-image-wrapper image {
  display: block;
  max-width: 100%;
  max-height: 100%;
}

image {
  vertical-align: middle;
  border-style: none;
}

.span {
  font-size: 24px;
  color: #FA8F2B;
  text-align: left;
  margin-right: 8px;
  position: absolute;
  left: 0;
  bottom: 0;
}

.unit {
  color: #333333;
  font-size: 14px;
  position: absolute;
  right: 0;
  bottom: 2px;
}

.search {
  position: sticky;
  top: 0;
  z-index: 1;
}

.storeList {
  padding: 0 12px 12px;
}

.positionItem {
  border-radius: 2px;
  margin: 16px 0;
}

.positionName {
  display: flex;
  align-items: center;
}

.name {
  flex-grow: 1;
  display: flex;
  align-items: center;
  font-weight: bold;
  grid-gap: 8px;
  gap: 8px;
}

.storeIcon {
  padding: 0;
  height: fit-content;
}

.inkindItem {
  margin: 8px 0;
  border-radius: 2px;
  border: 1px solid #E1EBF6;
}

.inkindData {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  background-color: #E1EBF6;
}

.inkindId {
  display: flex;
  flex-grow: 1;
  align-items: center;
  grid-gap: 8px;
  gap: 8px;
}

.storeBrand {
  max-width: 130px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.storeOtherData {
  padding: 8px 12px 0;
  color: #666666;
}

.flex {
  display: flex;
  align-items: center;
}

.storeFlexGrow {
  flex-grow: 1;
}

.contents {
  max-height: 50vh;
  overflow: auto;
}

.scroll {
  color: #999999;
  padding: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}

.space {
  margin: 0 -12px;
  padding: 0;
  background-color: #F5F5F5;
  height: 3px;
}

.type {
  color: #2680eb;
}

.logItems {
  padding: 8px 12px 0 12px;
}

.user {
  min-width: 170px;
  text-align: right;
}

.flexCenters {
  padding-bottom: 8px;
  border-bottom: 1px solid #d8d8d8;
}

</style>
