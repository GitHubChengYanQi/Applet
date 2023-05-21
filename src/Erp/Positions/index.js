export const addChildren = (key, newItem, list = []) => {
    return list.map(item => {
        if ((key + '') === (item.key + '')) {
            return {...item, children: [...(item.children || []), newItem]}
        } else {
            return {...item, children: addChildren(key, newItem, item.children || [])}
        }
    })
}

export const sortChildren = (key, children, list = []) => {
    return list.map(item => {
        if ((key + '') === (item.key + '')) {
            return {...item, children: children}
        } else {
            return {...item, children: sortChildren(key, children, item.children || [])}
        }
    })
};


export const delChildren = (key, list = []) => {
    const newStoreHouseList = []
    list.map(item => {
        if ((key + '') !== (item.key + '')) {
            newStoreHouseList.push({...item, children: delChildren(key, item.children || [])})
        }
    })
    return newStoreHouseList
};
