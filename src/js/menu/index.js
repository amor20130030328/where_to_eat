/**
 * Created by 范 on 2019/11/11.
 */
import React,{Component} from 'react';
import {query,post,foodUrl} from '../../utils/api'
import { downloadFile } from '../../utils/fileUtils'
import {success} from '../../utils/notification';
import {Table,Divider,Button,Row,Popconfirm,Modal,Pagination,ConfigProvider } from 'antd';
import AddMenu from './addMenu'
import EditMenu from './editMenu'
import ImportMenu from './importMenu'
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
const info = Modal.info;



export default class Menu extends Component{


    constructor(props){
        super();
        this.state = {
            locale: zhCN,
            name:"",
            listLoading:false,
            total:0,
            current:1,
            pageSize:10,
            pageNum:1,
            dataSource : []
        }
    }

    componentDidMount(){
        this.fetchData();
    }


    fetchData=()=>{
        this.setState({listLoading:true},()=>{
            let {pageNum,pageSize,name} = this.state;
            query(`${foodUrl}/pages`,{pageNum,pageSize,name}).then((data)=>{
                if(data != null ){

                    const {current,pages,records,size,total} = data;

                    console.log(current , pages , records , size , total );


                    this.setState({
                        dataSource : records,
                        pageNum:current,
                        pageSize:size,
                        total,
                        current,
                        listLoading:false
                    });
                }
            });
        });
    }

    /**
     * 翻页控制器
     * @param currentPage
     * @param pageSize
     */
    pageChange = (currentPage, pageSize) => {
        this.setState({
            pageNum:currentPage,
        }, () =>{
            this.fetchData();
        })
    };

    deleteFood=(id)=>{
        post(`${foodUrl}/deleteFood/${id}`).then((data)=>{
                if(data){
                    this.fetchData();
                    success("删除成功");
                }
        });
    }


    /**
     * 导出数据
     */
    exportExcel=()=>{
        downloadFile(`${foodUrl}/export`,'菜单.xls');
    }


    /**
     * 选菜
     */
    selectFood=()=>{
        let {pageNum,pageSize,name} = this.state;
        query(`${foodUrl}/select`,{pageNum,pageSize,name}).then((data)=>{
            info({
                title: '系统提示',
                content: `${data}`,
                okText:"确定",
                onOk:()=>{
                },

            });
        })
    }

    render(){
        const columns = [
            {
                title: '菜名',
                dataIndex: 'name',
                align:"center",
                key: 'name',
            },
            {
                title: '优先级',
                dataIndex: 'priority',
                align:"center",
                key: 'priority',
            },
            {
                title: '操作',
                dataIndex: 'action',
                align:"center",
                key: 'action',
                render:(text, record, index)=>{
                    return <span>
                        <EditMenu id={ record.id } callback={this.fetchData}/>
                        <Divider type="vertical"/>
                         <Popconfirm
                             title="确定删除吗?"
                             onConfirm={()=>this.deleteFood(record.id)}
                             okText="确定"
                             cancelText="取消"
                         >
                        <span style={{color:"blue",cursor:"pointer"}}>删除</span>
                         </Popconfirm>
                    </span>
                }
            }
            ,
        ]

        let {dataSource,current,total,pageSize,locale } = this.state;


        return <div>
            <h1 style={{textAlign:"center",padding:"5px"}}>菜单栏目</h1>
            <Row style={{padding:"20px"}}>
                <AddMenu callback={this.fetchData}/> <Divider type="vertical"/>
                <ImportMenu callback={this.fetchData}/> <Divider type="vertical"/>
                <Button type={"ghost"} onClick={this.exportExcel}>导出</Button><Divider type="vertical"/>
                <Button type={"ghost"} onClick={this.selectFood}>今天吃点啥</Button>
            </Row>


            <Table
                rowKey="id"
                align="center"
                size="middle"
                bordered
                dataSource={dataSource}
                pagination={false}
                columns={columns}/>
            <ConfigProvider locale={locale}>
                <Pagination
                    style={{ float:"right", marginRight:"20px", marginTop: "5px" }}
                    showQuickJumper  //显示快速跳转页面输入框
                    key={locale ? locale.locale : 'en'}
                    current = {current}  //当前页
                    total = {total}      //数据总数
                    pageSize = {pageSize}    //每页条数
                    onChange = {this.pageChange}
                    showTotal = {total => `共 ${total} 条记录`}/>
            </ConfigProvider>
        </div>
    }
}