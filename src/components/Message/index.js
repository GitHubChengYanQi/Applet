import Dialog from "../../wxcomponents/dialog/dialog";

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

const dialog = (
    {
        title = '',
        content = '',
        confirmText = '确认',
        cancelText = '取消',
        onCancel,
        onConfirm,
        only = true,
    }) => {

    if (only) {
        Dialog.alert({
            zIndex: 100,
            className: 'dialog',
            title,
            message: content,
            confirmButtonText: confirmText,
            beforeClose: () => {
                return typeof onConfirm === 'function' ? onConfirm() : () => true
            }
        })
    } else {
        Dialog.confirm({
            zIndex: 100,
            title,
            message: content,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            beforeClose: (action) => {
                if (action === 'confirm') {
                    return typeof onConfirm === 'function' ? onConfirm() : () => true
                } else {
                    return typeof onCancel === 'function' ? onCancel() : () => true
                }
            }
        });
    }
};


export const Message = {
    toast,
    dialog,
    successToast,
    errorToast
};
