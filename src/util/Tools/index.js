// 获取当前地址信息
import moment from "moment";

export const getLocalParmas = () => {
    const pages = getCurrentPages();
    return {
        route: '/' + pages[pages.length - 1].route,
        search: pages[pages.length - 1]?.options || {}
    }
}


export const MyDate = {
    Show: (date) => {
        if (!date) {
            return '-';
        }

        return moment(date).format(moment(date).year() !== moment().year() ? 'YYYY年MM月DD日 HH:mm' : 'MM月DD日 HH:mm');
    },
    formatDate: (date) => {
        const newDate = moment(date).format('YYYY/MM/DD HH:mm:ss');
        return new Date(newDate);
    },
};

// 返回空集合
export const isArray = (array) => {
    return Array.isArray(array) ? array : [];
};

