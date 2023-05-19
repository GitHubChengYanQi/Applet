import {ReceiptsEnums} from "./Erp/Receipt/ReceiptsEnums";


export const routes = [
    {
        name: '物料添加',
        key: 'miniapp-skuAdd',
        url: '/Sku/Manage/index'
    },
    {
        name: '仓储管理',
        key: 'miniapp-storeHouse',
        url: '/Erp/StoreHouse/index'
    },
    {
        name: '出库管理',
        key: 'miniapp-outStock',
        url: `/Erp/Receipt/ReceiptList/index?type=${ReceiptsEnums.outstockOrder}`
    },
    {
        name: '出库确认',
        key: 'miniapp-outStockConfirm',
        url: '/Erp/OutStock/OutStockConfirm/index'
    },
    {
        name: '入库管理',
        key: 'miniapp-inStock',
        url: `/Erp/Receipt/ReceiptList/index?type=${ReceiptsEnums.instockOrder}`
    },
    {
        name: '办理入库',
        key: 'miniapp-inStockAsk',
        url: '/Erp/InStock/InStockAsk/index'
    },
    {
        name: '即时盘点',
        key: 'miniapp-stocktaking',
        url: '/Erp/Stocktaking/immediately/index',
    },
    {
        name: '库存预警',
        key: 'miniapp-StockForewarn',
        url: '/Erp/StockForewarn/index'
    },
    {
        name: '采购单',
        key: 'miniapp-procurementOrder',
        url: '/Purchase/Order/OrderList/index'
    },
    {
        name: '创建生产计划',
        key: 'miniapp-createProduction',
        url: '/Production/CreatePlan/index'
    }, {
        name: '生产计划',
        key: 'miniapp-productionList',
        url: '/Production/ProductionList/index'
    }, {
        name: '生产卡片',
        key: 'miniapp-productionCard',
        url: '/Production/ProductionCard/index'
    }
]
