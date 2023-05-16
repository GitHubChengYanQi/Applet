export const addStoreHouseChildren = (key, storeHouse, storeHouseList = []) => {
    return storeHouseList.map(item => {
        if ((key + '') === (item.key + '')) {
            return {...item, children: [...(item.children || []), storeHouse]}
        } else {
            return {...item, children: addStoreHouseChildren(key, storeHouse, item.children || [])}
        }
    })
}

export const sortStoreHouseChildren = (key, children, storeHouseList = []) => {
    return storeHouseList.map(item => {
        if ((key + '') === (item.key + '')) {
            return {...item, children: children}
        } else {
            return {...item, children: sortStoreHouseChildren(key, children, item.children || [])}
        }
    })
};


export const delStoreHouseChildren = (key, storeHouseList = []) => {
    const newStoreHouseList = []
    storeHouseList.map(item => {
        if ((key + '') !== (item.key + '')) {
            newStoreHouseList.push({...item, children: delStoreHouseChildren(key, item.children || [])})
        }
    })
    return newStoreHouseList
};
