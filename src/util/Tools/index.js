import moment from "util/Common/moment";

// 获取当前地址信息
export const getLocalParmas = (page) => {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1]
    const search = pages[pages.length - 1]?.options || {}
    const urlSearch = Object.keys(search).length > 0 ? ('?' + Object.keys(search).map(item => item + '=' + search[item]).join('&')) : ''
    const route = page || ('/' + currentPage.route + urlSearch)
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
    const safeAreaHeight = _this.$store.state.systemInfo.systemInfo?.safeAreaInsets?.bottom || 0
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

export const routeReplace = (route) => {
    return route.replaceAll("%3A", ":").replaceAll("%2F", "/").replaceAll("%3F", "?").replaceAll("%3D", "=").replaceAll("%26", "&")
}

export const saveImg = (url) => {
    return new Promise((resolve) => {
        uni.getSetting({

            //获取用户的当前设置

            success: res => {

                if (res.authSetting['scope.writePhotosAlbum']) {
                    //验证用户是否授权可以访问相册
                    uni.getImageInfo({
                        src: url,
                        success: function (image) {
                            uni.saveImageToPhotosAlbum({
                                filePath: image.path,
                                success: function () {
                                    uni.showToast({
                                        title: '保存成功，请在相册中查看',
                                        icon: 'none',
                                        duration: 2000
                                    });
                                    resolve(true)
                                },
                                fail: function (err) {
                                    uni.hideLoading();
                                    uni.showToast({
                                        title: '保存失败',
                                        icon: 'none',
                                        duration: 2000
                                    });
                                    resolve(false)
                                }
                            });
                        }
                    });
                } else {
                    uni.authorize({
                        //如果没有授权，向用户发起请求
                        scope: 'scope.writePhotosAlbum',
                        success: () => {
                            uni.getImageInfo({
                                src: url,
                                success: function (image) {
                                    uni.saveImageToPhotosAlbum({
                                        filePath: image.path,
                                        success: function () {
                                            uni.showToast({
                                                title: '保存成功，请在相册中查看',
                                                icon: 'none',
                                                duration: 2000
                                            });
                                            resolve(true)
                                        },
                                        fail: function (err) {
                                            uni.hideLoading();
                                            uni.showToast({
                                                title: '保存失败',
                                                icon: 'none',
                                                duration: 2000
                                            });
                                            resolve(false)
                                        }
                                    });
                                }
                            });
                        },
                        fail: () => {
                            uni.showToast({
                                title: '请打开保存相册权限!',
                                icon: 'none',
                                duration: 2000
                            });
                            resolve(false)
                            setTimeout(() => {

                                uni.openSetting({

                                    //调起客户端小程序设置界面,让用户开启访问相册

                                    success: res2 => {

                                        // console.log(res2.authSetting)

                                    }

                                });

                            }, 2000);

                        }

                    });

                }

            }

        });
    })
}

const fsm = uni.getFileSystemManager();
const FILE_BASE_NAME = 'tmp_base64src'; //自定义文件名

export const base64src = async (base64data) => {
    return new Promise((resolve, reject) => {
        const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
        if (!format) {
            return (new Error('ERROR_BASE64SRC_PARSE'));
        }
        const filePath = `${wx.env.USER_DATA_PATH}/logo.${format}`;
        const buffer = uni.base64ToArrayBuffer(bodyData);
        fsm.writeFile({
            filePath,
            data: buffer,
            encoding: 'binary',
            success() {
                resolve(filePath);
            },
            fail(res) {
                console.log(res)
                reject()
            },
        });
        // fsm.readdir({
        //     dirPath: wx.env.USER_DATA_PATH,
        //     success(res) {
        //         console.log(res.files)
        //         resolve();
        //         return
        //         res.files.forEach((val) => {
        //             uni.removeSavedFile({
        //                 filePath: `${wx.env.USER_DATA_PATH}/${val}`,
        //                 complete(res) {
        //
        //                 }
        //             });
        //         })
        //         setTimeout(function () {
        //
        //         }, 1500)
        //     }
        // })
    })
};



