export const getInType = (type) => {
    switch (type) {
        case 'PURCHASE_INSTOCK':
            return '采购入库';
        case 'PRODUCTION_INSTOCK':
            return '生产入库';
        case 'PRODUCTION_RETURN':
            return '生产退库';
        case 'CUSTOMER_RETURN':
            return '客户退货';
        default:
            return '';
    }
};
