const toast = (
    title,
    afterClose = () => {
    },
    icon,
) => {
    uni.showToast({
        title,
        mask: true,
        icon: icon || 'none',
        duration: 3000,
        position: icon ? 'center' : 'bottom'
    });

    setTimeout(() => {
        afterClose()
    }, 3000)
};

const successToast = (
    title,
    afterClose = () => {
    }
) => {

    toast(title || '成功!', afterClose, 'success')

};

const errorToast = (
    title,
    afterClose = () => {
    }
) => {

    toast(title || '失败!', afterClose, 'error')

};

const loadingToast = (
    title,
    afterClose = () => {
    }
) => {

    toast(title || '加载中...', afterClose, 'loading')

};


export const Message = {
    toast,
    successToast,
    errorToast,
    loadingToast
};
