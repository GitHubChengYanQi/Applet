// 获取当前地址信息
import moment from "moment";

export const getLocalParmas = () => {
    const pages = getCurrentPages();
    return {
        route: '/' + pages[pages.length - 1].route,
        search: pages[pages.length - 1]?.options || {}
    }
}

const Show = (date) => {
    if (!date) {
        return '-';
    }
    const oneYear = moment(date).diff(new Date(), 'year') >= 1;
    return moment(date).format(oneYear ? 'YYYY年MM月DD日 HH:mm' : 'MM月DD日 HH:mm');
};

const formatDate = (date) => {
    const newDate = moment(date).format('YYYY/MM/DD HH:mm:ss');
    return new Date(newDate);
};


export const MyDate = {
    Show,
    formatDate,
};

// 返回空集合
export const isArray = (array) => {
    return Array.isArray(array) ? array : [];
};

