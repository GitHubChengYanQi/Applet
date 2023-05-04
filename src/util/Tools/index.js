import moment from "util/Common/moment";

// 获取当前地址信息
export const getLocalParmas = () => {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1]
    const search = pages[pages.length - 1]?.options || {}
    const urlSearch = Object.keys(search).length > 0 ? ('?' + Object.keys(search).map(item => item + '=' + search[item]).join('&')) : ''
    const route = '/' + currentPage.route + urlSearch
    return {
        route: route,
        stringRoute: route.replaceAll(":", "%3A").replaceAll("/", "%2F").replaceAll("?", "%3F").replaceAll("=", "%3D").replaceAll("&", "%26"),
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

// 集合去重
export const ArrayDuplicate = (array, key) => {
    const res = new Map();
    return (Array.isArray(array) ? array : []).filter((a) => !res.has(a[key]) && res.set(a[key], 1));
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

export const safeAreaHeight = (_this, num) => {
    const safeAreaHeight = _this.$store.state.systemInfo.systemInfo.safeAreaInsets.bottom
    return safeAreaHeight < (num || 0) ? (num || 0) : safeAreaHeight
}

export const rateTool = (value, total, num) => {
    if (typeof total !== "number") {
        return value > 0 ? `${value}%` : 0;
    }
    if (total === 0) {
        return 0
    }
    const val = (value / total) * 100
    let rate
    if (val > 0 && val < 1) {
        rate = 1
    } else if (val > 99 && val < 100) {
        rate = 99
    } else {
        rate = Math.round(val)
    }
    if (num) {
        return rate
    }
    return rate > 0 ? `${rate}%` : 0;
};

const decNum = (a) => {/*获取小数位数*/
    var r = 0;
    if (a !== null && a !== undefined) {
        a = a.toString();
        if (a.indexOf('.') !== -1) r = a.split('.')[1].length;
    }
    return r;
};

const int = (a) => {/*去除小数点并转成数值*/
    if (a !== null && a !== undefined) {
        if (Number(a) === 0) {
            return parseInt('0');
        } else {
            return parseInt(a.toString().replace('.', ''));
        }
    } else {
        return parseInt('0');
    }
};

// 数学四则运算
export const MathCalc = (a, b, type, decimal = 2) => {//加减乘除
    let r;
    let da = decNum(a);
    let db = decNum(b);
    let dsum = da + db;
    let dmin = Math.min(da, db);
    let dmax = Math.max(da, db);
    dsum += dmax - dmin;
    dsum = Math.pow(10, dsum);
    dmax = Math.pow(10, dmax);
    a = int(a);
    b = int(b);
    if (da > db) {
        b *= Math.pow(10, da - db);
    } else {
        a *= Math.pow(10, db - da);
    }

    switch (type) {
        case 'jia':
            r = (a + b) / dmax;
            break;
        case 'jian':
            r = (a - b) / dmax;
            break;
        case 'cheng':
            r = (a * b) / dsum;
            break;
        case 'chu':
            if (b === 0) {
                break;
            }
            r = a / b;
            break;
    }
    return Number(r.toFixed(decimal));
};

export const routeReplace = (route) => {
    return route.replaceAll("%3A", ":").replaceAll("%2F", "/").replaceAll("%3F", "?").replaceAll("%3D", "=").replaceAll("%26", "&")
}
