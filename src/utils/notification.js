/**
 * Created by 范 on 2019/11/11.
 */

import {notification  } from 'antd';


export  function success(msg){
    notification.success({
        message: '系统消息',
        description : msg,
    });
}

export  function warning(msg){
    notification.warning({
        message: '系统消息',
        description : msg,
    });
}