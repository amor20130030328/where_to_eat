/**
 * Created by 范 on 2019/11/13.
 */
import React,{Component} from 'react';
import { Button,Modal,Row, Col,Upload ,Icon ,Input  } from 'antd'
import { downloadFile } from '../../utils/fileUtils';
import {postFormData,foodUrl} from '../../utils/api';
import {warning} from '../../utils/notification'

export default class ImportMenu extends Component{

    constructor(props){
        super();
        this.state = {
            visible : false,
            fileList:[],        //文件列表
            fileName:"",        //文件名称
            isImport:false,
            commit:false,
            importSuccessCount:0,   //上传成功数量
            importFailCount:0,      //上传失败数量
            importResultDataSource:[],  //上传结果table数据源
        }
    }


    /**
     *
     */
    showModal = ()=>{

        this.setState({visible : true});

    }

    onCancel=()=>{
        this.setState({visible : false});
    }

    downloadTemplate=()=>{
        downloadFile(`${foodUrl}/exportTemplate`,'菜单模板.xls');
    }

    handleUpload=()=>{
        const {fileList} = this.state;
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('file', file);
        });

        this.setState({commit:true,isLoading:true},()=>{
                postFormData(`${foodUrl}/importExcel`,formData).then(data =>{


                    if(data.failCount === 0 ){
                        this.setState({ isImport:true, loading:false });

                    }
                    this.props.callback();
                    this.setState({commit:false});
                });

        })
    };

    render(){

        let { visible,fileName,isImport,fileList ,commit ,importSuccessCount,importFailCount, importResultDataSource } = this.state;
        const props = {
            action: '',
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                // 在火狐47下xls文件的file.type是application/json
                if (file.type === 'application/vnd.ms-excel' || file.type === 'application/json') {
                    this.setState({
                        fileList: [file],
                        fileName: file.name,
                    });
                } else {
                    warning('请选择正确的xls文件进行导入');
                }
                return false;
                // if(file.type !== "application/vnd.ms-excel"){
                //     warning("请选择正确的xls文件进行导入");
                //     return false;
                // }
                // this.setState({fileList:[file], fileName:file.name});
                // return false;
            },
            fileList: this.state.fileList,
        };

        return <span>
                <Button type={"ghost"} onClick={this.showModal}>导入</Button>
                <span>
                    <Modal
                        title="导入"
                        visible={visible}
                        keyboard
                        onCancel={this.onCancel}
                        width={window.innerWidth * 0.4 }
                        footer={
                            null
                        }
                    >
                         <Row style={{textAlign:"center", marginTop:"10px"}}>
                            <span>请选择符合模板的Excel(xls)文件导入</span>
                            <br/>
                            <span>数据的时间格式为:yyyy-MM-dd，如果是代码集类型请输入相对应的编目</span>
                        </Row>

                         <Row gutter={24} style={{paddingTop:"10px",textAlign:"right",paddingLeft:"20px"}}>
                            <Col span={4} style={{paddingTop:"10px",paddingRight:"0px",textAlign:"right"}}>
                                <span>导入文件:</span>
                            </Col>
                            <Col span={10}>
                                <Upload {...props}>
                                    <Input id="import-input"  addonAfter={<span style={{cursor:"pointer"}}>浏览</span>} placeholder="Excel文件" value={fileName} readOnly/>
                                </Upload>
                            </Col>
                            <Col span={5} style={{paddingTop:"5px"}}>
                                <a onClick={this.downloadTemplate}>
                                    <Icon type="download"/>下载模板
                                </a>
                            </Col>
                        </Row>

                         <Row style={{textAlign:"center",marginTop:"20px"}}>
                        <Button type="primary" disabled={fileList.length === 0} onClick={this.handleUpload} loading={commit}>开始上传</Button>
                        <Button type="default" style={{marginLeft:"10px"}} onClick={this.handleCancel}>取消</Button>
                    </Row>

                   <div style={{ height:window.innerHeight * 0.32, border:"1px solid #e8e8e8", marginTop:"5px" }}>
                        {
                            !isImport ?
                                <div style={{width:"100%", height:"100%", textAlign:"center", lineHeight:window.innerHeight * 0.32+"px", color:"#9fa5a9"}}>上传结果在此处展示</div> :
                                <div>
                                    <Row style={{ height:window.innerHeight * 0.06, padding:"10px" }}>
                                        导入结果：导入成功 <span style={{ color:"red" }}>{importSuccessCount}</span> 条记录，上传失败 <span style={{ color:"red" }}>{importFailCount}</span> 条记录<br/>详情如下：
                                    </Row>

                                </div>
                        }
                    </div>


                    </Modal>
                </span>

        </span>
    }

}