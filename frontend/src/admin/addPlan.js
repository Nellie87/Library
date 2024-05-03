import React from 'react';
import { Link } from 'react-router-dom';
import DRMSettings from '../drm/settings';
import Swal from "sweetalert2";
import Functions from '../helpers/functions';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class AddContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            category_name: '',
            category_title_s: '',
            category_title_p: '',
            plan_charges:'',
            plan_title:'',
            plan_id:'',
        };
        // console.log(this.state.setMaxDate)
        this.onChangeClassValue = this.onChangeClassValue.bind(this);
        this.onChangeCategoriesValue = this.onChangeCategoriesValue.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        let plan_id = funcObj.get_query_string('plan_id');
        this.setState({
            plan_id:plan_id
        })
        this.getplan();
          
    }

    componentDidUpdate(){
       
    }

    onChangeClassValue(event) {
        this.setState({ class_id: event.target.value });
    }
    onChangeCategoriesValue(event) {
        
        const target = event.target;
        var value = target.value;
        if (target.checked) {
            // this.state.categories[value] = value; 
            this.state.categories.push(value);
            
        } else {
            var index = this.state.categories.indexOf(event.target.value)
            if (index !== -1) {
                this.state.categories.splice(index, 1);
                
            }
        }

    }
 
    // Method causes to store all the values of the 
    // input field in react state single method handle 
    // input changes of all the input field using ES6 

    // javascript feature computed property names
    handleChange(event) {

        if (event.target.name == 'myFile' || event.target.name == 'coverImage'
            || event.target.name == 'indexImage' || event.target.name == 'otherImage') {
            // console.log(event.target.files[0])
            if (event.target.files[0]) {
                const imageFile = event.target.files[0];
                if (event.target.name == 'coverImage'
                    || event.target.name == 'indexImage' || event.target.name == 'otherImage') {
                    if (!imageFile.name.match(/\.(jpg|jpeg|png)$/)) {
                        funcObj.custom_alert_message('Please select valid image.');
                        event.target.value = null;
                        return false;
                    }
                }

                if(event.target.name == 'myFile'){
                    if (!imageFile.name.match(/\.(pdf|ppt|pptx|webm|mp4|mpeg|epub|ogv|mp3|jpg|png|docx)$/)) {
                        funcObj.custom_alert_message('Please select valid file.');
                        event.target.value = null;
                        return false;
                    }
                }

                if (event.target.name == 'coverImage') {
                    this.getBase64(imageFile)
                        .then(result => {
                            imageFile["base64"] = result;
                            this.setState({
                                coverimgSrc: result
                            });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else if (event.target.name == 'indexImage') {
                    this.getBase64(imageFile)
                        .then(result => {
                            imageFile["base64"] = result;
                            this.setState({
                                indeximgSrc: result
                            });
                        })
                        .catch(err => {
                            console.log(err);
                        });

                } else if (event.target.name == 'otherImage') {
                    this.getBase64(imageFile)
                        .then(result => {
                            imageFile["base64"] = result;
                            this.setState({
                                otherimgSrc: result
                            });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }

                this.setState({
                    [event.target.name]: event.target.files[0]
                })
            } else {
                if (event.target.name == 'coverImage') {
                    this.setState({ coverimgSrc: '' });
                } else if (event.target.name == 'indexImage') {
                    this.setState({ indeximgSrc: '' });
                } else if (event.target.name == 'otherImage') {
                    this.setState({ otherimgSrc: '' });
                }
                this.setState({
                    [event.target.name]: null
                })
            }

        } else if (event.target.name == 'unlimited_access') {
            console.log(event.target.value);
            (this.state.unlimited_access == 0) ? this.setState({ [event.target.name]: 1 }) : this.setState({ [event.target.name]: 0 });
            if (this.state.unlimited_access == 1) {
                this.setState({
                    displayUptoHtml: false,
                    days: 30
                })
            } else {
                this.setState({
                    displayUptoHtml: true,
                    days: ''
                })
            }
        } else if (event.target.name == 'unlimited_copies') {
            console.log(event.target.value);
            (this.state.unlimited_copies == 0) ? this.setState({ [event.target.name]: 1 }) : this.setState({ [event.target.name]: 0 });
            if (this.state.unlimited_copies == 1) {
                this.setState({
                    noOfCopiesHtml: false,
                    quantity: 1
                })
            } else {
                this.setState({
                    noOfCopiesHtml: true,
                    quantity: ''
                })
            }
        } else if (event.target.name == 'copy_paste') {
            (this.state.copy_paste == 1) ? this.setState({ [event.target.name]: 0 }) : this.setState({ [event.target.name]: 1 });
        } else if (event.target.name == 'printing') {
            (this.state.printing == 0) ? this.setState({ [event.target.name]: 1 }) : this.setState({ [event.target.name]: 0 });
        } else if (event.target.name == 'downloads') {
            (this.state.downloads == 0) ? this.setState({ [event.target.name]: 1 }) : this.setState({ [event.target.name]: 0 });
        } else if (event.target.name == 'content_type') {
            if (event.target.value != 'paid') {
                this.setState({
                    currencyHtml: 'hide',
                    discount_price: '',
                    actual_price: '',
                    [event.target.name]: event.target.value,
                });
            } else {
                this.setState({
                    currencyHtml: 'show',
                    [event.target.name]: event.target.value
                });
            }

        } else if (event.target.name == 'Description') {
            const charCount = event.target.value.length;
            const charLeft = 300 - charCount;
            this.setState({ des_chars_left: charCount });
            this.setState({
                [event.target.name]: event.target.value
            })
        } else if (event.target.name == 'Bibliography') {
            const charCount = event.target.value.length;
            const charLeft = 300 - charCount;
            this.setState({ bib_chars_left: charCount });
            this.setState({
                [event.target.name]: event.target.value
            })
        } else {
            this.setState({
                // Computed property names
                // keys of the objects are computed dynamically
                [event.target.name]: event.target.value
            })
        }

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

    handleOnchangeSource(e) {
        const opt_val = e.target.value;
        const source_childs = document.getElementsByClassName('source_childs');
        for (var i = 0; i < source_childs.length; i++) {
            source_childs[i].classList.add('d-none');

        }
        document.getElementById(opt_val).classList.remove('d-none');
    }

    handleSubmit(event) {
        event.preventDefault();
        if(this.state.plan_id){
            this.editPlan();
        }else{
            this.addPlan();
        }
       
    }
    getddplan = () => {
        let endPoint = 'get-classes';
        let postBodyData = {}
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(data => {


            if (data.code == 200) {
                console.log(data)
                this.setState({
                    classes: data.data
                });

            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }
    

    addPlan=()=>{
        let postBodyData = {
            "no_of_days": this.state.no_of_days,
            "plan_title": this.state.plan_title,
            "charges": this.state.plan_charges,
           
        };

        console.log("postBodyData", postBodyData);
        // return false;
        let endPoint = 'add-plan';

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            if (data.code == 200) {
                return funcObj.custom_alert_message(data.message,'success',"plan-list");
            } else if (data.code == 201) {
                return funcObj.custom_alert_message(data.message,'error');
            }
        });
    }

    editPlan=()=>{
        let plan_id = funcObj.get_query_string('plan_id');
        let postBodyData = {
            "plan_id" :plan_id,
            "plan_title": this.state.plan_title,
            "charges": this.state.plan_charges,
            "no_of_days": this.state.no_of_days,
        };

    
        let endPoint = 'edit-plan';

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            if (data.code == 200) {
                return funcObj.custom_alert_message(data.message,'success',"plan-list");
            } else if (data.code == 201) {
                return funcObj.custom_alert_message(data.message,'error');
            }
        });
    }

    getplan = () => {
        let plan_id = funcObj.get_query_string('plan_id');
        let postBodyData = {
            'plan_id': plan_id
        };
        let endPoint = 'get-plan';

        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            // console.log(endPoint + ' response', data)
            if (data.code == 200) {

                console.log("detail", data.data.category_title_s);
                this.setState({
                    plan_charges:data.data.charges,
                    plan_title: data.data.duration,
                    no_of_days: data.data.no_of_days,
                })
            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }

    render() {
        console.log('categories',this.state.categories)
        return (
            <React.Fragment>
                <form id="geniusform" onSubmit={this.handleSubmit}>
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                {/* <h3 className="dashboard-title title-margin my-2 float-left">Content</h3> */}
                            </div>
                            <div className="row">
                                <div className="col-lg-offset-3 col-lg-6">
                                    <div className="form-head mb-3"> <span className="bg-white d-inline-block px-3">Add Plan</span></div>
                                    <div className="form-group">
                                        <label className="pl-3"> Title</label>
                                        <input  type="text" className="input-field form-control" value={this.state.plan_title} onChange={this.handleChange} placeholder="Enter Plan title" name="plan_title" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3"> No of days</label>
                                        <input  type="text" className="input-field form-control" value={this.state.no_of_days} onChange={this.handleChange} placeholder="Enter number of days" name="no_of_days" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3"> Plan Charges </label>
                                        <input type="text" className="input-field form-control"  value={this.state.plan_charges} onChange={this.handleChange} placeholder="Enter Plan Charges" name="plan_charges" />
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <button type="submit" className="btn addCart py-1 px-3 mr-1">Save</button>
                            </div>
                        </div>
                    </div>

                </form>
                                    
            </React.Fragment>
        );
    }
}
