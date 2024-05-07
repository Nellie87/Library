import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
import ReactResumableJs from '../ReactResumableJs';
const funcObj = new Functions();

export default class BulkUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            csv:'',
            zip:'',
            mrc:'',
            upload_type:'csv_file',
            is_file_uploaded:false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeClassValue = this.onChangeClassValue.bind(this);
        this.fileUploaded = this.fileUploaded.bind(this);
    }

    handleChange(event){
        const files_to_upload = ['csv','zip','mrc'];
        const selected_file_name = event.target.name;
        if(files_to_upload.includes(selected_file_name)){
            // console.log(event.target.files[0])
            if(event.target.files[0]){
                const imageFile = event.target.files[0];
                console.log(imageFile)
                    if (!imageFile.name.includes(selected_file_name)) {
                        funcObj.custom_alert_message('Please select '+selected_file_name+' file.');
                        this.setState({
                            [event.target.name]: null
                        })
                        event.target.value = null;
                        return false;
                    }
                this.setState({
                    [event.target.name]: event.target.files[0]
                })
                console.log(event.target.files[0])
            }else{
                this.setState({
                    [event.target.name]: null
                })
            }
        }       
    }

    handleSubmit(event) {
        // break;
        event.preventDefault();
        

        let chunk_file="";
        if(document.getElementById('chunk_file')){
            chunk_file = document.getElementById('chunk_file').value;
         }
        

        if(this.state.upload_type == 'csv_file' && this.state.csv==''){
            funcObj.custom_alert_message("please select csv file!");
            return false;
        }else if(this.state.upload_type == 'marc_file' && this.state.mrc==''){
            funcObj.custom_alert_message("please select mrc file!");
            return false;
        }else if(this.state.upload_type == 'csv_file' && chunk_file==''){
            funcObj.custom_alert_message("please select zip file!");
            return false;
        }else if(this.state.upload_type == 'csv_file' && this.state.is_file_uploaded == false){
            funcObj.custom_alert_message('zip file is not uploaded!');    
        } else {
            
        let endPoint = 'content-bulk-upload';
        let postBodyData = {
            "csv_file":this.state.csv,
            "zip_file":chunk_file 
        }
        if(this.state.upload_type == 'marc_file'){
            endPoint = 'content-mrc-upload';
            postBodyData = {
                "mrc_file":this.state.mrc  
            }
        }
       
            console.log(endPoint);
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            // funcObj.custom_alert_message('data response',data)

            if (data.code == 200) {
                funcObj.custom_alert_message(data.message,'success','my-publications');
            } else if (data.code == 201) {
                funcObj.custom_alert_message(data.message,'error','bulk-upload');
            }
        });

    }
    }
    onChangeClassValue(event) {
        
        this.setState({ csv:'',
            zip:'',
            mrc:'', upload_type: event.target.value });
    }
    fileUploaded(){
        this.setState(
            {is_file_uploaded:true}
        );
    }
    render() {
        const filetypes = funcObj.getFileTypesExtensionsArray("zip");
        return (
            <React.Fragment>
                <form id="geniusform" className='bulk_upload_frm' onSubmit={this.handleSubmit}>
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="col-lg-12">
                                <div className="form-head mb-3  clearfix">
                                    <span className="bg-white d-inline-block px-3">Bulk Upload</span>
                                    
                                </div>
                                <div className='row'>
                                <div className="custom-radio pl-3 text-center" onChange={this.onChangeClassValue}>
                                <input defaultChecked={this.state.upload_type=='csv_file'?true:false} type="radio" onChange={this.onChangeClassValue} name="radio1" id='upload_csv' value="csv_file" />
                                 <label htmlFor='upload_csv'>Upload CSV+Zip</label>

                                 <input defaultChecked={this.state.upload_type=='mrc_file'?true:false} type="radio" onChange={this.onChangeClassValue} name="radio1" id='upload_marc' value="marc_file" />
                                 <label htmlFor='upload_marc'>Upload Marc</label>
                                </div>

                                </div>
                                <br />
                                {
                                    this.state.upload_type=='csv_file' ?
                                
                                <div className="row"  id="csv">
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="drop-zone-wrap p-2">
                                            <div className="drop-zone">
                                             
                                                <input type="file"  onChange={this.handleChange} name="csv" className="" />
                                            </div>
                                        </div>
                                        <div className="form-group clearfix">
                                            <small className="d-block float-left">Accepted Type : .csv</small>
                                            <small className="d-block float-right"><Link to={{ pathname:funcObj.files_path('files/sample_files/contents_sample.csv')}} target="_blank">Download Sample file</Link></small>
                                        </div>
                                    </div>
                                    
                                
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        {/* <div className="drop-zone-wrap p-2">
                                            <div className="drop-zone">
                                              
                                                <input type="file" onChange={this.handleChange} name="zip" className="" />
                                            </div>
                                        </div> */}

                                        <fieldset>
                                                <div className="drop-zone-wrap p-2">
                                                    <div className="drop-zone chunk_upload_input b">
                                                    <ReactResumableJs
                                                        fileUploaded={this.fileUploaded}
                                                        uploaderID="image-upload"
                                                        dropTargetID="myDropTarget"
                                                        filetypes={filetypes}
                                                        fileAccept="image/*"
                                                        fileAddedMessage="Started!"
                                                        completedMessage="Complete!"
                                                        service={funcObj.chunk_upload_url()+"bulk-upload"}
                                                        textLabel="Choose zip File"
                                                        previousText=""
                                                        disableDragAndDrop={true}
                                                        onFileSuccess={(file, message) => {
                                                           console.log('onFileSuccess file',file)
                                                         
                                                        }}
                                                        onFileAdded={(file, resumable) => {
                                                            resumable.upload();
                                                        }}
                                                        
                                                        maxFiles={10}
                                                        query_data={{
                                                             class_name:'zip'
                                                         }}
                                                        myFile ={this.state.myFile}
                                                        maxFileSize={1024}
                                                        startButton={true}
                                                        pauseButton={false}
                                                        cancelButton={false}
                                                        onStartUpload={() => {
                                                            console.log("Start upload");
                                                        }}
                                                        onCancelUpload={() => {
                                                            this.inputDisable = false;
                                                        }}
                                                        onPauseUpload={() => {
                                                            this.inputDisable = false;
                                                        }}
                                                        onResumeUpload={() => {
                                                            this.inputDisable = true;
                                                        }}
                                                    />
                                                    </div>
                                                    </div>
                                                </fieldset>


                                        <div className="form-group clearfix">
                                            <small className="d-block float-left">Accepted Type : .zip</small>
                                           
                                        </div>
                                    </div>
                                </div>
                                
                                :
                            
                                <div className="row "  id="marc">
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="drop-zone-wrap p-2">
                                            <div className="drop-zone">
                                             
                                                <input type="file"  onChange={this.handleChange} name="mrc" className="" />
                                            </div>
                                        </div>
                                        <div className="form-group clearfix">
                                            <small className="d-block float-left">Accepted Type : .mrc</small>
                                            <small className="d-block float-right"><Link to={{ pathname:funcObj.files_path('files/sample_files/content.csv')}} target="_blank">Download Sample file</Link></small>
                                        </div>
                                    </div>
                                    </div>

                                }

                                <div className="">
                                    <Link to="/my-publications" type="button" className="btn lightBtn roundedBtn py-1 px-3 mr-1 mr-3 w120">Go Back</Link>
                                    <button type="submit" className="btn addCart py-1 px-3 mr-1">Upload</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </form>

            </React.Fragment>
        );
    }
}
