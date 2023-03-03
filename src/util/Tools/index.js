import moment from "moment";

// 获取当前地址信息
export const getLocalParmas = () => {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1]
    const search = pages[pages.length - 1]?.options || {}
    const urlSearch = '?' + Object.keys(search).map(item => item + '=' + search[item]).join('&')
    return {
        route: '/' + currentPage.route + urlSearch,
        search: search
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

// 返回空对象
export const isObject = (object) => {
    return (object && typeof object === 'object') ? object : {};
};

// 查找字符串返回 true / false
export const queryString = (value = '', string) => {
    if (value.includes('\\')) {
        value = value.replaceAll('\\', '|');
    }
    const patt = new RegExp(value, 'i');
    return patt.test(string);
};

// 计算时间差
export const timeDifference = (tmpTime) => {
    const mm = 1000;//1000毫秒 代表1秒
    const minute = mm * 60;
    const hour = minute * 60;
    let ansTimeDifference = 0;//记录时间差
    const tmpTimeStamp = tmpTime ? Date.parse(tmpTime.replace(/-/gi, '/')) : new Date().getTime();//将 yyyy-mm-dd H:m:s 进行正则匹配
    const nowTime = new Date().getTime();//获取当前时间戳
    const tmpTimeDifference = nowTime - tmpTimeStamp;//计算当前与需要计算的时间的时间戳的差值
    if (tmpTimeDifference < 0) {//时间超出，不能计算
        return '刚刚';
    }

    const twoDayTime = new Date().setDate(moment().date() - 2);
    const DifferebceDay = moment().date() - moment(tmpTime).date();
    const DifferebceHour = tmpTimeDifference / hour;//进行小时取整
    const DifferebceMinute = tmpTimeDifference / minute;//进行分钟取整

    if (moment(tmpTime).isBefore(moment(twoDayTime), 'day')) {
        ansTimeDifference = MyDate.Show(tmpTime);
    } else if (DifferebceDay === 2) {
        ansTimeDifference = '前天 ' + moment(tmpTime).format('HH:mm');
    } else if (DifferebceDay === 1) {
        ansTimeDifference = '昨天 ' + moment(tmpTime).format('HH:mm');
    } else if (DifferebceHour >= 3) {
        ansTimeDifference = moment(tmpTime).format('HH:mm');
    } else if (DifferebceHour >= 1) {
        ansTimeDifference = parseInt(DifferebceHour) + '小时前';
    } else if (DifferebceMinute >= 1) {
        ansTimeDifference = parseInt(DifferebceMinute) + '分钟前';
    } else {
        ansTimeDifference = '刚刚';
    }
    return ansTimeDifference;
};
