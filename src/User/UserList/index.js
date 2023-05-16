export const addDeptChildren = (key, dept, depts = []) => {
    return depts.map(item => {
        if ((key + '') === (item.key + '')) {
            return {...item, children: [...item.children, dept]}
        } else {
            return {...item, children: addDeptChildren(key, dept, item.children || [])}
        }
    })
};

export const sortDeptsChildren = (key, children, depts = []) => {
    return depts.map(item => {
        if ((key + '') === (item.key + '')) {
            return {...item, children: children}
        } else {
            return {...item, children: sortDeptsChildren(key, children, item.children || [])}
        }
    })
};


export const delDeptChildren = (key, depts = []) => {
    const newDepts = []
    depts.map(item => {
        if ((key + '') !== (item.key + '')) {
            newDepts.push({...item, children: delDeptChildren(key, item.children || [])})
        }
    })
    return newDepts
};
