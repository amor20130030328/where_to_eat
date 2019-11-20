/**
 * Created by 范 on 2019/11/11.
 */
import { Modal,Button,Divider ,Form,Input,Icon,InputNumber  } from 'antd';
import React , {Component} from 'react';
import {post,query,foodUrl } from '../../utils/api'
import {success} from '../../utils/notification';

const FormItem = Form.Item;
@Form.create()
export default class EditMenu extends Component{


    constructor(props){
        super();
        this.state={
            visible:false,
            record:{},
        }
    }


    componentWillMount(){

    }

    /**
     * 弹出模态框
     */
    showEdit = ()=>{
        this.setState({visible:true},()=>{
            const {id} = this.props;
            query(`${foodUrl}/${id}`).then((data)=>{
                if(data){
                    this.setState({record:data});
                }
            });

        });
    }

    /**
     * 取消处理器
     */
    handleCancel=()=>{
        this.props.form.resetFields()
        this.setState({visible:false});
    }


    /**
     * 提交表单
     */
    handleSubmit=(e)=>{

        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,values)=>{
            if(!err){

                post(`${foodUrl}/editFood`,values).then((data)=>{
                    success("修改成功");
                    this.props.callback();
                    this.setState({visible:false});
                    this.props.form.resetFields()
                });
            }
        })

    }

    render(){

        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {labelCol: { span: 6 }, wrapperCol: { span: 15 },}
        let {visible,record} = this.state;


        return <span>
                    <span style={{color:"blue",cursor:"pointer"}} onClick={this.showEdit}>修改</span>
                    <Modal
                        title="修改"
                        visible={visible}
                        okText={"确定"}
                        cancelText={"取消"}
                        onCancel={this.handleCancel}
                        onOk={this.handleSubmit}
                    >
                        {getFieldDecorator('id', {
                            initialValue: (record == null) ? 0 :  record.id ,
                        })(<Input hidden/>)}
                         <Form.Item label="菜名" {...formItemLayout}>
                          {getFieldDecorator('name', {
                              initialValue: (record == null) ? 0 :  record.name ,
                              rules: [{required: true, message: '菜名必填'}],
                          })(<Input />)}
                        </Form.Item>
                        <Form.Item label="优先级" {...formItemLayout}>
                          {getFieldDecorator('priority', {
                              initialValue: (record == null) ? 0 :  record.priority ,
                              rules: [{required: true, message: '优先级必填'}],
                          })(<InputNumber style={{width:"100%"}}  min={1} />)}
                        </Form.Item>
                    </Modal>
                </span>

    }
}
