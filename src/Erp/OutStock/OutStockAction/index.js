import * as ToolUtil from "../../../util/Tools";

export const outPickListFormat = (list = []) => {
    let countNumber = 0;
    const array = list.map(item => {
        let perpareNumber = 0;
        ToolUtil.isArray(item.cartResults).map(item => perpareNumber += item.number);

        const received = Number(item.receivedNumber) || 0;
        const collectable = Number(perpareNumber - received) || 0;
        const notPrepared = Number(item.number - collectable - received) || 0;

        countNumber += (item.number || 0);
        return {
            ...item,
            perpareNumber,
            received,
            collectable,
            notPrepared,
            action: !(item.number === received || item.number === (received + collectable) || !item.stockNumber),
        };
    });
    return {
        countNumber,
        array,
    };
};

export const outPickListFormatSort = (list = [], showAll) => {
    let countNumber = 0;
    const actions = [];
    const noAction = [];
    const other = [];
    const receivedSkus = []

    let collectableTotal = 0
    let receivedTotal = 0

    list.map(item => {
        let perpareNumber = 0;
        ToolUtil.isArray(item.cartResults).map(item => perpareNumber += item.number);

        const received = Number(item.receivedNumber) || 0;
        perpareNumber = perpareNumber - received
        const collectable = Number(perpareNumber) || 0;
        const notPrepared = Number(item.number - collectable - received) || 0;

        collectableTotal += collectable
        receivedTotal += received

        if (item.number > received) {
            if (item.number === (received + collectable) || !item.stockNumber) {
                if (notPrepared > 0) {
                    other.push({...item, perpareNumber, received, collectable, notPrepared});
                } else {
                    noAction.push({...item, perpareNumber, received, collectable, notPrepared});
                }
            } else {
                actions.push({...item, perpareNumber, received, collectable, notPrepared, action: true});
            }
        } else if (showAll) {
            receivedSkus.push({...item, perpareNumber, received, collectable, notPrepared})
        }
        return countNumber += (item.number || 0);
    });
    return {
        countNumber,
        collectableTotal,
        receivedTotal,
        array: [
            ...actions,
            ...other.sort((a, b) => {
                return a.notPrepared - b.notPrepared;
            }),
            ...noAction,
            ...receivedSkus
        ],
    };
};

