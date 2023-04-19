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
                type: ['my'],
                icon: 'icon-wuliaotianjia',
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
                type: ['common'],
                url: '/Erp/Stock/index'
            },
            {
                name: '仓库管理',
                key: 'storeHouse',
                icon: 'icon-cangkuguanli1',
                type: ['my'],
                url: '/Erp/StoreHouse/index'
            },
            {
                name: '出库管理',
                key: 'outStock',
                type: ['common'],
                icon: 'icon-chukuguanli2',
                url: `/Erp/Receipt/ReceiptList/index?type=${ReceiptsEnums.outstockOrder}`
            },
            {
                name: '出库确认',
                key: 'outStockConfirm',
                icon: 'icon-chukuqueren1',
                type: ['my'],
                url: '/Erp/OutStock/OutStockConfirm/index'
            },
            {
                name: '入库管理',
                key: 'inStock',
                type: ['common'],
                icon: 'icon-rukuguanli2',
                url: `/Erp/Receipt/ReceiptList/index?type=${ReceiptsEnums.instockOrder}`
            },
            {
                name: '办理入库',
                key: 'inStockAsk',
                type: ['common'],
                icon: "icon-banliruku",
                url: '/Erp/InStock/InStockAsk/index'
            },
            {
                name: '即时盘点',
                key: 'stocktaking',
                type: ['common'],
                icon: 'icon-pandian1',
                url: '/Erp/Stocktaking/immediately/index'
            },
            {
                name: '库存预警',
                key: 'StockForewarn',
                type: ['common','my'],
                icon: 'icon-kucunyujing1',
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
                // type: ['common'],
                icon: 'icon-chuangjianshengchanjihuasvg',
                url: '/Production/CreatePlan/index'
            }, {
                name: '生产计划列表',
                key: 'productionList',
                type: ['common'],
                icon: 'icon-shengchanjihua',
                url: '/Production/ProductionList/index'
            }, {
                name: '生产卡片',
                key: 'productionCard',
                icon: 'icon-kapian',
                url: '/Production/ProductionCard/index'
            }
        ]
    },
]
