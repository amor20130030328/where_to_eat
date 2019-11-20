/**
 * Created by 范 on 2019/11/11.
 */
import { Modal,Button,Divider ,Form,Input,Icon,InputNumber  } from 'antd';
import React , {Component} from 'react';
import {post,foodUrl} from '../../utils/api'
import {success} from '../../utils/notification';

const FormItem = Form.Item;
@Form.create()
export default class AddMenu extends Component{


    constructor(props){
        super();
        this.state={
            visible:false,
        }
    }


    componentWillMount(){

    }

    /**
     * 弹出模态框
     */
    showAdd = ()=>{
        this.setState({visible:true});
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

                post(`${foodUrl}/addFood`,values).then((data)=>{
                    success("新增成功");
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
        let {visible} = this.state;


        return <span>
                    <Button type={"primary"} onClick={this.showAdd}>新增</Button>
                    <Modal
                        title="新增"
                        visible={visible}
                        okText={"确定"}
                        cancelText={"取消"}
                        onCancel={this.handleCancel}
                        onOk={this.handleSubmit}
                    >
                         <Form.Item label="菜名" {...formItemLayout}>
                          {getFieldDecorator('name', {
                              rules: [{required: true, message: '菜名必填'}],
                          })(<Input />)}
                        </Form.Item>
                        <Form.Item label="优先级" {...formItemLayout}>
                          {getFieldDecorator('priority', {
                              initialValue:1,
                              rules: [{required: true, message: '优先级必填'}],
                          })(<InputNumber style={{width:"100%"}}  min={1} />)}
                        </Form.Item>
                    </Modal>
                </span>

    }
}