import axios from 'axios'
/*axios.defaults.withCredentials = true;
axios.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';//Ajax get请求标识
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';//Ajax post请求标识
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';//POST请求参数获取不到的问题
axios.defaults.headers.put['X-Requested-With'] = 'XMLHttpRequest';//Ajax put请求标识
axios.defaults.headers.delete['X-Requested-With'] = 'XMLHttpRequest';//Ajax delete请求标识*/




export function  query(url,param) {

   return new Promise((resolve,rejected)=>{
       axios.get(url,{params:param}).then((response)=>{
            let {data} = response;
            resolve(data);
        }).catch((error)=>{
            rejected(error);
        });
    });
}


export function  post(url,param) {
    return new Promise((resolve,rejected)=>{
        axios.post(url, param).then((response)=>{
            let {data} = response;
            resolve(data);
        }).catch((error)=>{
            rejected(error);
        });
    })
}

export function exportExcel(url, params, headers) {

    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params,
            headers: headers == undefined ? {} : headers,
            responseType: 'blob', // 表明返回服务器返回的数据类型
        })
            .then(res => {
                resolve(res.data)
            }).catch(err => {
            reject(err)
        })
    })
}


export function postFormData(url, formData) {
    return new Promise((resolve, reject) => {
        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        axios.post(url, formData, config).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

export const foodUrl = '/web/food/';
