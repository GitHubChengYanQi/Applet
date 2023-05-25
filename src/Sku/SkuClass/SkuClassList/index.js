export const addSkuClassChildren = (key, skuClass, skuClassList = []) => {
    return skuClassList.map(item => {
        if ((key + '') === (item.key + '')) {
            return {...item, children: [...item.children, skuClass]}
        } else {
            return {...item, children: addSkuClassChildren(key, skuClass, item.children || [])}
        }
    })
};

export const sortSkuClassChildren = (key, children, skuClassList = []) => {
    return skuClassList.map(item => {
        if ((key + '') === (item.key + '')) {
            return {...item, children: children}
        } else {
            return {...item, children: sortSkuClassChildren(key, children, item.children || [])}
        }
    })
};


export const delSkuClassChildren = (key, skuClassList = []) => {
    const newSkuClassList = []
    skuClassList.map(item => {
        if ((key + '') !== (item.key + '')) {
            newSkuClassList.push({...item, children: delSkuClassChildren(key, item.children || [])})
        }
    })
    return newSkuClassList
};

export const delSkuClassIdsChildren = (keys = [], skuClassList = []) => {
    const newSkuClassList = []
    skuClassList.map(item => {
        if (keys.findIndex(id => (id + '') === (item.key + '')) === -1) {
            newSkuClassList.push({...item, children: delSkuClassChildren(key, item.children || [])})
        }
    })
    return newSkuClassList
};
