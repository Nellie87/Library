import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class AddFeedback extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            feedbackContentList:[],
            per_page_limit:10,
            total_records:0,
            current_page:1,
            imgSrc:'',
            myFile:'',
            name:AUTH_USER.user.username,
            mobile:AUTH_USER.user.mobile,
            subject:"",
            feedback_desc:"",
            publisher_id:"",
            feedback_for:"Content",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        this.getFeedbackContentList();
    }

    getBase64 = (file) => {
        return new Promise(resolve => {
          let fileInfo;
          let baseURL = "";
          // Make new FileReader
          let reader = new FileReader();
    
          // Convert the file to base64 text
          reader.readAsDataURL(file);
    
          // on reader load somthing...
          reader.onload = () => {
            // Make a fileInfo Object
            // console.log("Called", reader);
            baseURL = reader.result;
            // console.log(baseURL);
            resolve(baseURL);
          };
        //   console.log(fileInfo);
        });
    };

    handleChange(event){
       
        if(event.target.name == 'myFile'){
            if(event.target.files[0]){
                const imageFile = event.target.files[0];
                if(event.target.name == 'myFile'){
                    if (!imageFile.name.match(/\.(jpg|jpeg|png)$/)) {
                        funcObj.custom_alert_message('Please select valid image.');
                        event.target.value = null;
                        return false;
                    }
                }
                let file = event.target.files[0];
                this.getBase64(file)
                    .then(result => {
                    file["base64"] = result;
                    // console.log("File Is", file);
                    const strImage = result.replace(/^data:image\/[a-z]+;base64,/, "");
                    this.setState({
                        imgSrc:result
                    });
                })
                .catch(err => {
                  console.log(err);
                });
                this.setState({
                    [event.target.name]: event.target.files[0]
                })
            }else{
                this.setState({
                    imgSrc:""
                })
            }  
              
        }else if(event.target.name == "publisher_id"){
            console.log(event.target.name, event.target.value);
            if(event.target.value){
                this.setState({
                    [event.target.name] : event.target.value
                })
            }else{
                this.setState({
                    publisher_id:""
                }) 
            }
        }else{
           
            this.setState({
                // Computed property names
                // keys of the objects are computed dynamically
                [event.target.name] : event.target.value
            })
        }
       
    }

    getFeedbackContentList = () =>{
        let endPoint = 'get-feedback-content_list';
        let postBodyData = {
        }
        
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            // funcObj.custom_alert_message('data response',data)

            if (data.code == 200) {
                console.log(data.data)
                this.setState({
                    feedbackContentList:(data.data)?data.data:[]
                });

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
    }

    handleSubmit(event) {
        event.preventDefault();
        let phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if(this.state.mobile){
            if (phoneReg.test(this.state.mobile) === false) {
                funcObj.custom_alert_message("Please enter a valid phone number!")
                return false;
            }
        }
        
        if (this.state.publisher_id == '') {
            funcObj.custom_alert_message('Please select content');
            return false;
        }
        if (this.state.name == '') {
            funcObj.custom_alert_message('Please fill the name');
            return false;
        }
        if (this.state.mobile == '') {
            funcObj.custom_alert_message('Please fill the mobile');
            return false;
        }
        if (this.state.subject == '') {
            funcObj.custom_alert_message('Please fill the subject');
            return false;
        }
      
        if (this.state.feedback_for == '') {
            funcObj.custom_alert_message('Please select feedback for');
            return false;
        }


        let postBodyData = {
            "feedback_for":this.state.feedback_for,
            "feedback":this.state.feedback_desc,
            "feedback_for_id":this.state.publisher_id,
            "stars":5,
            "name":this.state.name,
            "mobile":this.state.mobile,
            "subject":this.state.subject,
            "attachment_file":this.state.myFile
        };
        // console.log(postBodyData);
        // return false;
        let endPoint = 'add-feedback';

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            // funcObj.custom_alert_message('data response',data)

            if (data.code == 200) {
                console.log(data)
                Swal.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success',
                    showConfirmButton: false,
                });
                this.setState({
                    imgSrc:'',
                    myFile:'',
                    name:"",
                    mobile:"",
                    subject:"",
                    feedback_desc:"",
                    publisher_id:"",
                    feedback_for:"",
                });
                return funcObj.redirectPage("feedback-list");
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
    }

    render() {

        const { feedbackContentList } = this.state;

        return (
            <React.Fragment>
                <form id="geniusform" onSubmit={this.handleSubmit}>
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Feedback</h3>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-head mb-3"> <span className="bg-white d-inline-block px-3">Fill Details</span></div>

                                    {/* <div className="form-group">
                                        <label className="pl-3">Feedback for</label>
                                        <select title="Select feedback for" onChange={this.handleChange} className="input-field form-control"  name="feedback_for">
                                            <option value="" >Select Feedback for</option>
                                            <option value="Content">Content</option>
                                            <option>Publisher</option>
                                            <option>Author</option>
                                        </select>
                                    </div> */}

                                    <div className="form-group">
                                        <label className="pl-3">Select content for feedback</label>
                                        <select title="select content for feedback" onChange={this.handleChange} className="input-field form-control" name="publisher_id">
                                            <option value="" >Select content</option>
                                            {feedbackContentList.length > 0
                                                && feedbackContentList.map((item, i) => {
                                            return (
                                                    <option key={i} value={item.content_id}>{item.title}</option>
                                                )
                                            }, this)
}
                                        </select>
                                    </div>


                                    <div className="form-group">
                                        <label className="pl-3">Name <span>*</span> </label>
                                        <input type="text" value={this.state.name} className="input-field form-control" onChange={this.handleChange} placeholder="Enter Full Name" name="name" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Mobile<span>*</span> </label>
                                        <input type="text" value={this.state.mobile} className="input-field form-control" onChange={this.handleChange} placeholder="Enter Mobile Number" name="mobile" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Subject<span>*</span></label>
                                        <input type="text" className="input-field form-control" onChange={this.handleChange} placeholder="Enter Subject" name="subject" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Description</label>
                                        <textarea  className="input-field form-control" onChange={this.handleChange} name="feedback_desc" placeholder="Enter description"></textarea>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                <div className="form-head mb-3  clearfix">
                                        <span className="bg-white d-inline-block px-3">Attachment file ?</span>
                                    </div>
                                    <div className="form-group">
                                        <div className="drop-zone-wrap p-2">
                                            <div className="drop-zone">
                                                {/* <span class="drop-zone__prompt mt-3">
                                                    <img src={funcObj.assets_path("/images/icons/photo-icon.svg")} width="50" class="mr-1" alt="Home" /><br></br>
                                                    Drag and Drop
                                                    <div>or</div>
                                                    <div className="color_blue">
                                                        Browse files
                                                    </div>
                                                    <small>Single Images Only</small>
                                                </span> */}
                                                {(this.state.imgSrc)?<img style={{marginRight:20, width:100, height:100}} src={this.state.imgSrc} />: null}
                                                <input type="file" onChange={this.handleChange} name="myFile" className="drop-zone__input1" />
                                            </div>
                                        </div>
                                        <div className="form-group clearfix">
                                            <small className="d-block float-left">Accepted Type : .jpg, .jpeg, .png</small>
                                            <small className="d-block float-right">Single Images Only</small>
                                        </div>
                                        {/* <button type="button" class="btn darkBtn roundedBtn w-100">Upload</button> */}
                                    </div>
                                   
                                </div>
                            </div>
                            <div className="text-right">
                            <Link to="/feedback-list" type="button" className="btn go_back_btn  lightBtn roundedBtn py-1 px-3 mr-1 mr-3 w120">Go Back</Link>
                            <button type="submit" className="btn addCart py-1 px-3 mr-1">Save</button>
                            </div>
                        </div>
                    </div>

                </form>

            </React.Fragment>
        );
    }
}
