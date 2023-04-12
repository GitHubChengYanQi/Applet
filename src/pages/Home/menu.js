import {ReceiptsEnums} from "../../Erp/Receipt/ReceiptsEnums";


export const Menus = [
    {
        name: '产研管理',
        key: 'research',
        icon: 'icon-caigoudanguanli',
        menus: [
            {
                name: '物料添加',
                key: 'skuAdd',
                url: '/Sku/SkuAdd/index'
            }
        ]
    },
    {
        name: '仓储管理',
        key: 'erp',
        icon: 'icon-cangchuguanli',
        menus: [
            {
                name: '仓储中心',
                key: 'stock',
                icon: 'icon-cangchuguanli',
                url: '/Erp/Stock/index'
            },
            {
                name: '出库管理',
                key: 'outStock',
                icon: 'icon-chukuguanli2',
                url: `/Erp/Receipt/ReceiptList/index?type=${ReceiptsEnums.outstockOrder}`
            },
            {
                name: '出库确认',
                key: 'outStockConfirm',
                icon: 'icon-chukuqueren1',
                url: '/Erp/OutStock/OutStockConfirm/index'
            },
            {
                name: '入库管理',
                key: 'inStock',
                icon: 'icon-rukuguanli2',
                url: `/Erp/Receipt/ReceiptList/index?type=${ReceiptsEnums.instockOrder}`
            },
            {
                name: '办理入库',
                key: 'inStockAsk',
                url: '/Erp/InStock/InStockAsk/index'
            },
            {
                name: '即时盘点',
                key: 'stocktaking',
                icon: 'icon-pandian1',
                url: '/Erp/Stocktaking/immediately/index'
            },
            {
                name: '库存预警',
                key: 'StockForewarn',
                icon: 'icon-pandian1',
                url: '/Erp/StockForewarn/index'
            }
        ]
    },
    {
        name: '采购管理',
        key: 'purchase',
        icon: 'icon-caigoudanguanli',
        menus: [
            {
                name: '采购单列表',
                key: 'procurementOrder',
                icon: 'icon-caigoudanguanli',
                url: '/Purchase/Order/OrderList/index'
            }
        ]
    },
    {
        name: '生产',
        key: 'production',
        icon: 'icon-shengchanjihua',
        menus: [
            {
                name: '创建生产计划',
                key: 'createProduction',
                url: '/Production/CreatePlan/index'
            }, {
                name: '生产计划列表',
                key: 'productionList',
                icon: 'icon-shengchanjihua',
                url: '/Production/ProductionList/index'
            }, {
                name: '生产卡片',
                key: 'productionCard',
                url: '/Production/ProductionCard/index'
            }
        ]
    },
]
