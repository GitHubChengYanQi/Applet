import Toast from "../../wxcomponents/toast/toast";
import Dialog from "../../wxcomponents/dialog/dialog";

const toast = (title) => {
    Toast.show(title || '成功！');
};

const successToast = (
    title,
    afterClose = () => {
    },
    wait,
) => {
    if (!wait) {
        afterClose();
    }
    Toast.clear()
    Toast({
        forbidClick: wait,
        message: title || '成功！',
        type: 'success',
        onClose: wait && afterClose,
    });
};

const errorToast = (
    title,
    afterClose = () => {
    },
    wait,
) => {
    if (!wait) {
        afterClose();
    }
    Toast({
        forbidClick: wait,
        message: title || '失败！',
        type: 'fail',
        onClose: wait && afterClose,
    });
};

const MyDialog = (
    {
        title,
        content,
        confirmText = '确认',
        cancelText = '取消',
        onCancel = () => {
            return true
        },
        onConfirm = () => {
            return true
        },
        only = true,
    }) => {
    if (only) {
        Dialog.alert({
            title,
            message: content,
            confirmButtonText: confirmText,
            beforeClose: onConfirm
        })
    } else {
        Dialog.confirm({
            title,
            message: content,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            beforeClose: (action) => {
                if (action === 'confirm') {
                    return onConfirm()
                } else {
                    return onCancel()
                }
            }
        })
    }
};

const successDialog = (
    {
        content,
        confirmText,
        cancelText,
        onCancel = () => {
        },
        onConfirm = () => {
        },
        only,
    }) => {
    //
    // const contentDom = <div className={style.successContent}>
    //     <CheckCircleOutline className={style.successIcon} />
    //     <div className={style.content}>{content}</div>
    // </div>;
    //
    // MyDialog({
    //     confirmText,
    //     cancelText,
    //     onCancel,
    //     onConfirm,
    //     only,
    //     content: contentDom,
    // });

};

const warningDialog = (
    {
        content,
        confirmText,
        cancelText,
        onCancel = () => {
            return true
        },
        onConfirm = () => {
            return true
        },
        only = true,
    }) => {

    MyDialog({
        confirmText,
        cancelText,
        onConfirm,
        onCancel,
        only,
        content,
    });

};

const errorDialog = (
    {
        content,
        confirmText,
        cancelText,
        onCancel = () => {
        },
        onConfirm = () => {
        },
        only = true,
    }) => {

    // const contentDom = <div className={style.errorContent}>
    //     <CloseCircleOutline className={style.errorIcon} />
    //     <div className={style.content}>{content}</div>
    // </div>;
    //
    // MyDialog({
    //     confirmText,
    //     cancelText,
    //     onCancel,
    //     onConfirm,
    //     only,
    //     content: contentDom,
    // });

};

const dialogSuccess = (
    {
        title,
        leftText,
        rightText,
        next = () => {
        },
        only,
    }) => {

    // const actions = [];
    //
    // if (!only) {
    //     actions.push({
    //         key: 'back',
    //         text: <div style={{fontSize: 14}}>{leftText || '返回'}</div>,
    //     });
    // }
    // actions.push({
    //     key: 'next',
    //     text: <div style={{fontSize: 14}}> {rightText || '继续'}</div>,
    // });
    //
    // Dialog.show({
    //     content: title || '成功！',
    //     closeOnAction: true,
    //     onAction: (action) => {
    //         if (action.key === 'back') {
    //             history.goBack();
    //         } else {
    //             next();
    //         }
    //     },
    //     actions: [actions],
    // });
};


export const Message = {
    toast,
    dialog: MyDialog,
    successToast,
    errorToast,
    dialogSuccess,
    successDialog,
    warningDialog,
    errorDialog,
};
