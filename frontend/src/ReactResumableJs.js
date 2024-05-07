/**
 * Resumable JS for React JS
 * @author Gonzalo Rubino gonzalo_rubino@artear.com || gonzalorubino@gmail.com
 * @version 1.1.0
 *
 * Creates an uploader component in React, to use with Resumable JS
 * On file added, the upload will begin.
 */

import React from "react";
import Resumablejs from "resumablejs";
import Swal from "sweetalert2";
import Functions from './helpers/functions';
const funcObj = new Functions();
export default class ReactResumableJs extends React.Component {
    constructor(props) {
      
        super(props);
        this.state = {
            progressBar: 0,
            messageStatus: '',
            fileList: {files: []},
            isPaused: false,
            isUploading: false,
            file_uploaded:false,
            upload_size_in_mb:5120
         
        };

        this.resumable = null;
        this.getMaxUploadSize= this.getMaxUploadSize.bind(this);
    
    }


    componentDidMount = () => {
        let maxSizePromise = this.getMaxUploadSize();
        maxSizePromise.then(data => {
            if (data.code == 200) {
                this.setState({
                    upload_size_in_mb: data.data.upload_size_in_mb
                });
                this.initialiseResumableJs()      
            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    showCloseButton: true,
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    
    };

    handleChange(event){
        console.log('file',event.target.files[0]);
    }

    
   async getMaxUploadSize(){
        let endPoint = 'get-max-upload-size';
        let postBodyData = {}
        let result = await funcObj.commonFetchApiCall(postBodyData, endPoint); 
        return result;
    }
    initialiseResumableJs(){
      
      console.log('this.state.upload_size_in_mb',this.state.upload_size_in_mb)
        let ResumableField = new Resumablejs({
            target: this.props.service,
            query:{},
            fileType: this.props.filetypes?this.props.filetypes:[],
            maxFiles: this.props.maxFiles,
            maxFileSize:this.state.upload_size_in_mb*1024*1024,
            labelMaxFileSizeExceeded:'File is too large',
            fileTypeErrorCallback: (file, errorCount) => {
                console.log('fileTypeErrorCallback')
                if (typeof this.props.onFileAddedError === "function") {
                    this.props.onFileAddedError(file, errorCount);
                }
            },
            maxFileSizeErrorCallback: (file, errorCount) => {
                console.log('maxFileSizeErrorCallback')
                funcObj.custom_alert_message('Please select smaller file!');
                if (typeof  this.props.onMaxFileSizeErrorCallback === "function") {
                    this.props.onMaxFileSizeErrorCallback(file, errorCount);
                }
            },
            testMethod: this.props.testMethod || 'post',
            testChunks: this.props.testChunks || false,
            headers: this.props.headerObject || {},
            withCredentials: this.props.withCredentials || false,
            chunkSize: this.props.chunkSize,
            simultaneousUploads: this.props.simultaneousUploads,
            fileParameterName: this.props.fileParameterName,
            generateUniqueIdentifier: this.props.generateUniqueIdentifier,
            forceChunkSize: this.props.forceChunkSize,
            class:233
        });

        if (typeof this.props.maxFilesErrorCallback === "function") {
            ResumableField.opts.maxFilesErrorCallback = this.props.maxFilesErrorCallback;
        }

        ResumableField.assignBrowse(this.uploader);

        //Enable or Disable DragAnd Drop
        if (this.props.disableDragAndDrop === false) {
            ResumableField.assignDrop(this.dropZone);
        }

        ResumableField.on('fileAdded', (file, event) => {
            console.log('fileAdded running........',this.props.query_data)
            this.setState({
                messageStatus: this.props.fileAddedMessage || ' Starting upload! '
            });
            let flag = true;

            if(this.props.query_data.class_name==null || this.props.query_data.class_name==''){
                funcObj.custom_alert_message('Select Content Class');
                flag = false;
            }else{
            
              let file_name = file.relativePath
              const arr = funcObj.getFileTypesExtensionsArray(this.props.query_data.class_name);
              const checkFile = funcObj.checkStringContainsTextInArray(file_name,arr);
           
              console.log('this.props.query_data.class_name',this.props.query_data.class_name);
              console.log('checkFile',checkFile);
              console.log('arr',arr);
              console.log('file_name',file_name);
            if ((this.props.query_data.class_name == 'audio' || this.props.query_data.class_name == 'video') && !checkFile) {
                funcObj.custom_alert_message('Only allow extensions webm|mp4|avi|mpeg|ogv|mp3');
                flag = false;
            } else if (this.props.query_data.class_name == 'ebook' &&  !checkFile) {
                funcObj.custom_alert_message('Only allow extensions pdf|epub');
                flag = false;
            }
            else if (this.props.query_data.class_name == 'map' &&  !checkFile) {
                funcObj.custom_alert_message('Only allow extensions jpeg|png|jpg|pdf');
                flag = false;
            }
            else if (this.props.query_data.class_name == 'journal/periodical' &&  !checkFile) {
                funcObj.custom_alert_message('Only allow extension docx,pdf');
                flag = false;
            }
            else if ((this.props.query_data.class_name == 'music' || this.props.query_data.class_name == 'manuscripts') &&  !checkFile) {
                funcObj.custom_alert_message('Only allow extension pdf');
                flag = false;
            }
            else if (this.props.query_data.class_name == 'pictures' &&  !checkFile) {
                funcObj.custom_alert_message('Only allow extensions jpeg|png|jpg');
                flag = false;
            }else if (this.props.query_data.class_name == 'zip' &&  !checkFile) {
                funcObj.custom_alert_message('Only allow extensions zip');
                flag = false;
            }
            }
         
            console.log('flag validation',flag)
           if(!flag){
            file.abort();
              return false;
           }

        
            if (typeof this.props.onFileAdded === "function") {
              
                this.props.onFileAdded(file, this.resumable);
            } else {
                ResumableField.upload();
            }
        });


        ResumableField.on('fileSuccess', (file, fileServer) => {

            if (this.props.fileNameServer) {
                let objectServer = JSON.parse(fileServer);
                file.fileName = objectServer[this.props.fileNameServer];
            } else {
                file.fileName = fileServer;
            }

            if(file.fileName != ""){
                if(document.getElementById('chunk_file')){
                    const chunk_data = JSON.parse(file.fileName);
                    document.getElementById('chunk_file').value=chunk_data.filename;
                    document.getElementById('file_extension').value=chunk_data.file_extension;
                    this.props.fileUploaded();
                    this.setState({
                        file_uploaded:true
                    });
                }
            }
            let currentFiles = this.state.fileList.files;
            currentFiles.push(file);
            console.log('this.state.fileList.files',this.state.fileList.files)
            this.setState({
                fileList: {files: currentFiles},
                messageStatus: this.props.completedMessage + file.fileName || fileServer
            }, () => {
                if (typeof this.props.onFileSuccess === "function") {
                    this.props.onFileSuccess(file, fileServer);
                }
            });
        });

        ResumableField.on('progress', () => {

            console.log('progress....')
            

            this.setState({
                isUploading: ResumableField.isUploading()
            });

            if ((ResumableField.progress() * 100) < 100) {
                let progress_bar = Math.floor(ResumableField.progress() * 100);
                this.setState({
                    messageStatus: parseInt(ResumableField.progress() * 100, 10) + '%',
                    progressBar: progress_bar
                });
            } else {
                setTimeout(() => {
                    this.setState({
                        progressBar: 0
                    })
                }, 1000);
            }

        });

        ResumableField.on('fileError', (file, errorCount) => {
            console.log('fileError file',file)
            console.log('fileError errorCount',errorCount)
            this.props.onUploadErrorCallback(file, errorCount);
        });

        this.resumable = ResumableField;
    }

  

    removeFile = (event, file, index) => {

        event.preventDefault();

        let currentFileList = this.state.fileList.files;
        delete currentFileList[index];

        this.setState({
            fileList: {files: currentFileList},
            file_uploaded:false
        });
        console.log('file',file)
        this.props.onFileRemoved(file);
        this.resumable.removeFile(file);
        document.getElementById('chunk_file').value="";
        const chunk_data = JSON.parse(file.fileName);
        const postBodyData = {
            complete_file_path:chunk_data.path
        };
        console.log('postBodyData',postBodyData)
        funcObj.commonFetchApiCall(postBodyData, 'unlink-file', 'POST', true).then(data => {
            if (data.code == 200) {
                 funcObj.custom_alert_message('File removed successfully.','success');  
                    this.resumable.opts.fileType = this.props.filetypes;
            }
        });
    };

    createFileList = () => {

        let markup = this.state.fileList.files.map((file, index) => {

            let uniqID = this.props.uploaderID + '-' + index;
            let originFile = file.file;
            let media = '';

            if (file.file.type.indexOf('video') > -1) {
                media = <label className="video">{originFile.name}</label>;
                return <li className="thumbnail" key={uniqID}>
                    <label id={"media_" + uniqID}>{media}</label>
                    <a onClick={(event) => this.removeFile(event, file, index)} className="btn darkBtn" href="#">Remove</a>
                </li>;
            }
            else if (file.file.type.indexOf('image') > -1) if (this.props.tmpDir !== "") {
                let src = this.props.tmpDir + file.fileName;
                media = <img className="image" width="80" src={src} alt=""/>;
                return <li className="thumbnail" key={uniqID}>
                    <label id={"media_" + uniqID}>{media}</label>
                    <a onClick={(event) => this.removeFile(event, file, index)} className="btn darkBtn" href="#">Remove</a>
                </li>;

            } else {
                let fileReader = new FileReader();
                fileReader.readAsDataURL(originFile);
                fileReader.onload = (event) => {
                    media = '<img class="image" width="80" src="' + event.target.result + '"/>';
                    document.querySelector("#media_" + uniqID).innerHTML = media;
                };
                return <li className="thumbnail" key={uniqID}>
                    <label id={"media_" + uniqID}/>
                    <a onClick={(event) => this.removeFile(event, file, index)} className="btn darkBtn" href="#">Remove</a>
                </li>;
            } else {
                media = <label className="document">{originFile.name}</label>;
                return <li className="thumbnail" key={uniqID}>
                    <label id={"media_" + uniqID}>{media}</label>
                    <a onClick={(event) => this.removeFile(event, file, index)} className="btn darkBtn" href="#">Remove</a>
                </li>;
            }
        });

        return <ul id={"items-" + this.props.uploaderID}>{markup}</ul>;
    };

    cancelUpload = () => {
        this.resumable.cancel();

        this.setState({
            fileList: {files: []}
        });

        this.props.onCancelUpload();
    };

    pauseUpload = () => {
        if (!this.state.isPaused) {

            this.resumable.pause();
            this.setState({
                isPaused: true
            });
            this.props.onPauseUpload();
        } else {

            this.resumable.upload();
            this.setState({
                isPaused: false
            });
            this.props.onResumeUpload();
        }
    };

    startUpload = () => {
        console.log('startUpload')
        this.resumable.upload();
        this.setState({
            isPaused: false
        });
        this.props.onStartUpload();
    };


    render() {

           if(this.resumable !=null){               
            this.resumable.opts.query = this.props.query_data;
           }
           
    
        let fileList = null;
        if (this.props.showFileList) {
            fileList = <div className="resumable-list">{this.createFileList()}</div>;
        }

        let previousText = null;
        if (this.props.previousText) {
            if (typeof this.props.previousText ==="string") previousText = <p>{this.props.previousText}</p>
            else previousText = this.props.previousText
        }

        let textLabel = null;
        if (this.props.textLabel) {
            textLabel = this.props.textLabel;

        }

        let startButton = null;
        if (this.props.startButton) {
            if (typeof this.props.startButton ==="string" || typeof this.props.startButton ==="boolean" ) startButton = <label>
                <button disabled={this.state.isUploading} className="btn start" onClick={this.startUpload}>{this.props.startButton && "upload"}
                </button>
            </label>;
            else startButton =this.props.startButton
        }

        let cancelButton = null;
        if (this.props.cancelButton) {
            if (typeof this.props.cancelButton ===  "string" || typeof this.props.cancelButton ===  "boolean")cancelButton = <label>
                <button disabled={!this.state.isUploading} className="btn cancel" onClick={this.cancelUpload}>{this.props.cancelButton && "cancel"}
                </button>
            </label>;
            else cancelButton = this.props.cancelButton
        }

        let pauseButton = null;
        if (this.props.pauseButton) {
            if (typeof this.props.pauseButton ===  "string" || typeof this.props.pauseButton ===  "boolean") pauseButton = <label>
                <button disabled={!this.state.isUploading} className="btn pause" onClick={this.pauseUpload}>{this.props.pauseButton && "pause"}
                </button>
            </label>;
            else pauseButton = this.props.pauseButton
        }

        return (
            <div id={this.props.dropTargetID} ref={node => this.dropZone = node}>
            <input type="hidden" name="chunk_file" id="chunk_file" />
            <input type="hidden" name="file_extension" id="file_extension" />
                {previousText}
                <label className={this.props.disableInput ? 'btn file-upload disabled' : 'btn file-upload'}>{textLabel}
               
                    <input
                    disabled={this.state.file_uploaded}
                       ref={node=> this.uploader = node}
                        type="file"
                        id={this.props.uploaderID}
                        className='drop-zone__input1'
                        name={this.props.uploaderID + '-upload'}
                        accept={'*'}
                       onChange={this.handleChange}
                    />
               
                   
                </label>
                <div className="progress" style={{display: this.state.progressBar === 0 ? "none" : "block"}}>
                    <div className="progress-bar m-2" style={{width: this.state.progressBar + '%'}}>{this.state.progressBar + '%'}</div>
                </div>

                {fileList}
                {startButton}
                {pauseButton}
                {cancelButton}
            </div>
        );
    }
}

ReactResumableJs.defaultProps = {
    maxFiles: 1,
    uploaderID: 'default-resumable-uploader',
    dropTargetID: 'dropTarget',
    fileType:[],
    fileAccept: '*',
    maxFileSize: undefined,
    showFileList: true,
    onUploadErrorCallback: (file, errorCount) => {
        console.log('error', file, errorCount);
    },
    onFileRemoved: function (file) {
        return file;
    },
    onCancelUpload: function () {
        return true;
    },
    onPauseUpload: function () {
        return true;
    },
    onResumeUpload: function () {
        return true;
    },
    onStartUpload: function () {
        return true;
    },
    disableDragAndDrop: false,
    fileNameServer: "",
    tmpDir: "",
    chunkSize: 4096 * 4096 ,
    simultaneousUploads: 1,
    fileParameterName: 'file',
    generateUniqueIdentifier: null,
    maxFilesErrorCallback: null,
    cancelButton: false,
    pause: false,
    startButton: null,
    pauseButton: null,
    previousText: "",
    headerObject : {},
    withCredentials: false,
    forceChunkSize: false
};
