export const getOutType = (type) => {
    switch (type) {
        case 'PRODUCTION_TASK':
            return '生产任务';
        case 'PRODUCTION_LOSS':
            return '生产损耗';
        case 'THREE_GUARANTEES':
            return '三包服务';
        case 'RESERVE_PICK':
            return '备品备料';
        case 'LOSS_REPORTING':
            return '报损出库';
        default:
            return '';
    }
};

export const receivedColor = '#257BDE';
export const collectableColor = '#D3E7FD';
export const notPreparedColor = '#E8E8E8';
