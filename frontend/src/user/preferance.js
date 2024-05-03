import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
const funcObj = new Functions();
export default class ReaderProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            dob: "",
            in: "",
            address: "",
            city: "",
            mobile: "",
            email: "",
            affiliation: "",
            image: "",
            base64URL: "",
            intrest: [],
            setMaxDate: new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + parseInt(1)) + '-' + new Date().getDate(),
            imgSrc: '',
            default_categories: {},
            categories: [],
            area_of_interest:[],
            interest_categories: [],
            interest_sub_categories: [],
            interest:"",
            sub_categories:[]
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeSubcategories = this.onChangeSubcategories.bind(this);
        this.onChangeCategories = this.onChangeCategories.bind(this);

    }

    componentDidMount() {
        this.getMyProfile(); 
    }

    getMyProfile() {
        let postBodyData = "";
        let endPoint = 'user-myprofile';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(response => {
            console.log('get-contents response',response)
            
            if (response.code == 200) {
                this.getCategories();
                this.setState({
                    affiliation: (response.data.affiliation == "null") ? '' : response.data.affiliation,
                    interest_categories : !response.data.interest_categories ? [] : response.data.interest_categories.split(","),
                    interest_sub_categories:!response.data.interest_sub_categories ? [] : response.data.interest_sub_categories.split(","),
                })

            } else if (response.code == 201) {
                Swal.fire({
                    title: '',
                    showCloseButton: true,
                    text: response.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
       
        let postBodyData = {
            "affiliation": this.state.affiliation,
            "interest_sub_categories": JSON.stringify(this.state.interest_sub_categories),
            "interest_categories": JSON.stringify(this.state.interest_categories)
        };
        let endPoint = 'user-preferance';

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            // alert('data response',data)

            if (data.code == 200) {

                Swal.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success',
                    showConfirmButton: false,
                })
                
                const obj = funcObj.getLocalStorage("user");
                obj.user.interest_sub_categories = data.data.interest_sub_categories;
                obj.user.interest_categories = data.data.interest_categories;
                funcObj.setLocalStorage("user", JSON.stringify(obj));
                

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

   
    handleChange(event) {

        if (event.target.name == 'image') {
            if (event.target.files[0]) {
                const imageFile = event.target.files[0];
                if (event.target.name == 'image') {
                    if (!imageFile.name.match(/\.(jpg|jpeg|png)$/)) {
                        alert('Please select valid image.');
                        event.target.value = null;
                        this.setState({
                            base64URL: "",
                        });
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
                            base64URL: strImage,
                            imgSrc: result
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    });
                // this.setState({
                //     [event.target.name]: event.target.files[0]
                // })
            } else {
                this.setState({
                    base64URL: "",
                    imgSrc: ""
                })
            }

            // console.log(this.state.base64URL);

        } else {
            this.setState({
                // Computed property names
                // keys of the objects are computed dynamically
                [event.target.name]: event.target.value
            })
        }

    }

    
   
    getCategories = () => {
        let endPoint = 'get-categories';
        let postBodyData = {}
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(data => {


            if (data.code == 200) {
                console.log(data)
                this.setState({
                    default_categories: data.data
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
    findInArray(ar, val) {
        // console.log(val);
       
        for (var i = 0,len = ar.length; i < len; i++) {
            // console.log(ar[i]);
            if ( ar[i] == val ) { // strict equality test
                // console.log('inside',val);
                return i;
            }
        }
        return false;
    }
    onChangeSubcategories(event) {
        
        const target = event.target;
        var value = target.value;
        if (target.checked) {
            // this.state.interest_sub_categories[value] = value; 
            this.state.interest_sub_categories.push(value);
            
        } else {
            var index = this.state.interest_sub_categories.indexOf(event.target.value)
            if (index !== -1) {
                this.state.interest_sub_categories.splice(index, 1);
               
            }
        }

    }
    onChangeCategories(event) {

        const target = event.target;
        var value = target.value;
        console.log('onChangeCategories this.state.interest_categories',this.state.interest_categories)
        if (target.checked) {
            this.state.interest_categories.push(value);

        } else {
            var index = this.state.interest_categories.indexOf(event.target.value)
            if (index !== -1) {
                this.state.interest_categories.splice(index, 1);

            }
        }

    }
    render() {
       
        return (
            <React.Fragment>
                <form id="geniusform" onSubmit={this.handleSubmit}>
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">My Preferance</h3>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group">

                                        <label className="pl-3">Affiliation (business or university)</label>

                                        <input type="text" className="input-field form-control" value={this.state.affiliation} onChange={this.handleChange} placeholder="Enter Affiliation" name="affiliation" />

                                    </div>

                                    <div className="form-group preferences">
                                        <label className="pl-3">Area Of Interest</label>
                                        <div className="col-lg-12">
                                        <ul className='col-md-12 ul-li'>
                                                        {
                                                            this.state.default_categories && Object.keys(this.state.default_categories).length > 0 ?
                                                                this.state.default_categories.map((category, index) => {
                                                                    let found = "";

                                                                    if (this.state.interest_categories.length > 0) {
                                                                        found = (this.state.interest_categories).find(element => element == category.category_id);
                                                                    }

                                                                    let checked = (found == category.category_id) ? true : false;

                                                                    return (
                                                                        <React.Fragment key={index}>

                                                                            <li>

                                                                            <div className="custom-checkbox">
                                                                                    <input defaultChecked={checked} type="checkbox" id={`#category` + category.category_id} value={category.category_id} onChange={this.onChangeCategories} />
                                                                                    
                                                                                    <label data-toggle="collapse" value={category.category_id} id={`#category` + category.category_id} data-target={`#category` + category.category_id} htmlFor={`#category` + category.category_id} aria-expanded={checked} aria-controls="collapseOne">
                                                                                     {category.category_name}
                                                                                    </label>
                                                                                </div>
                                                                                <ul className={(checked == true) ? "collapse show" : "collapse"} id={`category` + category.category_id} data-parent="#accordion">
                                                                                    <li className='row'>
                                                                                        {
                                                                                            category.subcategories.map((subcategory, index) => {
                                                                                                let found = '';
                                                                                                if(this.state.interest_sub_categories.length>0){
                                                                                                    found = (this.state.interest_sub_categories).find(element => element == subcategory.sub_category_id);
                                                                                                }
                                                                                                let checked = (found == subcategory.sub_category_id) ? true : false;
                                                                                                return (
                                                                                                    <div key={index} className="col-lg-6 col-md-6 col-sm-6">
                                                                                                        <div className="form-group">
                                                                                                            <div className="custom-checkbox">
                                                                                                                <input defaultChecked={checked} type="checkbox" id={`subcategory_` + subcategory.sub_category_id} value={subcategory.sub_category_id} onChange={this.onChangeSubcategories} />
                                                                                                                <label htmlFor={`subcategory_` + subcategory.sub_category_id}>{subcategory.sub_category_name}</label>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>

                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </li>
                                                                                </ul>
                                                                            </li>

                                                                        </React.Fragment>
                                                                      
                                                                    )
                                                                })
                                                                : null}
                                                    </ul>
                                           
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">

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
