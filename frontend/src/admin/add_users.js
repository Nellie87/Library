import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class UsersList extends React.Component {

    constructor(props) {
        super(props);
       
        this.state = {
            user_type:"reader",
            first_name:"",
            last_name:"",
            dob:"",
            id_no:"",
            sex:"Male",
            address:"",
            city:"",
            mobile:"",
            email:"",
            myFile: "",
            intrest:{},
            setMaxDate: new Date().getFullYear()+'-'+(parseInt(new Date().getMonth()) + parseInt(1))+'-'+new Date().getDate(),
            imgSrc:'',
            state:'',
            country:'',
            city_list:[],
            country_list:[],
            state_list:[],
            countryId:"",
            stateId:"",
            heading:"Add User",
            update_user:false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
            
    }

    componentDidMount(){
        let user_id = funcObj.get_query_string('user_id');
        if(user_id){
            this.setState({heading:"Edit User"})
            this.getUserDetail(user_id);
        }else{
            this.getCountry();
        }  
    }

    getUserDetail(user_id){
        let postBodyData = {
            'user_id': user_id
        };
        let endPoint = 'get-user-detail';
        
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            console.log(endPoint + ' response', data)
            if (data.code == 200) {
                console.log(data)
                this.getCountry();
                this.setState({
                    first_name:data.data.first_name,
                    last_name:data.data.last_name,
                    dob:(data.data.dob=="null")?'':data.data.dob,
                    id_no:(data.data.identification_number=="null")?'':data.data.identification_number,
                    address:(data.data.address=="null")?'':data.data.address,
                    city:(data.data.city=="null")?'':data.data.city,
                    mobile:(data.data.mobile=="null")?'':data.data.mobile,
                    email:data.data.email,
                    affiliation:(data.data.affiliation=="null")?'':data.data.affiliation,
                    state:(data.data.state=="null")?'':data.data.state,
                    country:(data.data.country=="null")?'':data.data.country,
                    sex:(data.data.gender=="null")?'':data.data.gender,
                    user_type:(data.data.user_type=="null")?'':data.data.user_type,
                    imgSrc:(data.data.profile_image=="null")?'':data.data.profile_image,
                    update_user:true
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
                    base64URL: "",
                    imgSrc:""
                })
            }  
            
            // console.log(this.state.base64URL);
            
        }else if(event.target.name == "country"){
            console.log("event.target.value", event.target.value)
            if(event.target.value){
                this.getCity(event.target.value);
                this.getState(event.target.value);
                let countryname = this.state.country_list.find(data=>data.id==event.target.value);
                // console.log("countryname", countryname)
                this.setState({country:countryname.name, countryId:event.target.value})
            }else{
                this.setState({country:"", countryId:"", city_list:"", state_list:"", city:"", state:""})
            }
          
        }else if(event.target.name == "state"){
            if(event.target.value){
                this.getCity(event.target.value);
                let statename = this.state.state_list.find(data=>data.id==event.target.value);
                // console.log("countryname", countryname)
                this.setState({state:statename.name, stateId:event.target.value})
            }else{
                this.setState({state:"", stateId:"", city_list:"", state_list:"", city:""})
            }
        }else{
            this.setState({
                // Computed property names
                // keys of the objects are computed dynamically
                [event.target.name] : event.target.value
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


    getCity(cityId){
        let postBodyData="";
        let endPoint = 'common/city-new?state_id='+cityId;
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(response => {
            // console.log('get-contents response',response)

            if (response.code == 200) {
               console.log(response.data);
               this.setState({
                  city_list:(response.data)?response.data:[]
               })

            } else if (response.code == 201) {
                Swal.fire({
                    title: '',
                    text: response.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }

    getCountry(){
        let postBodyData="";
        let endPoint = 'common/country';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(response => {
            // console.log('get-contents response',response)

            if (response.code == 200) {
               let countryId;
               if(this.state.country){
                console.log(this.state.country)
                    countryId = response.data.find(data=>data.name==this.state.country);
                    if(countryId != undefined && countryId.id != undefined){
                    countryId = countryId.id;
                    // this.getCity(countryId);
                    this.getState(countryId);
                    }
               }else{
                    countryId = "" 
               } 
               
               this.setState({
                    country_list:(response.data)?response.data:[],
                    countryId:countryId
               })

            } else if (response.code == 201) {
                Swal.fire({
                    title: '',
                    text: response.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }

    getState(stateId){
        let postBodyData="";
        let endPoint = 'common/state?country_id='+stateId;
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(response => {
            // console.log('get-contents response',response)

            if (response.code == 200) {
               console.log(response.data);
               let stateId;
               if(this.state.state){
                    stateId = response.data.find(data=>data.name==this.state.state);
                    // console.log(stateId);
                    stateId = stateId.id;
                    this.getCity(stateId);
               }else{
                    stateId = "" 
               } 
               this.setState({
                  state_list:(response.data)?response.data:[],
                  stateId:stateId
               })

            } else if (response.code == 201) {
                Swal.fire({
                    title: '',
                    text: response.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }

    handleSubmit(event){
        event.preventDefault();
        let user_id = funcObj.get_query_string('user_id');
        if(user_id){
            this.updateUser(user_id);
        }else{
            this.addUser();
        }
        
    }

    addUser(){
        let phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
        let emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        if(this.state.user_type == ""){
            funcObj.custom_alert_message("Please select user type!");
            return false;  
        }
        if(this.state.first_name == ""){
            funcObj.custom_alert_message("Please enter first name!");
            return false;  
        }
        if(this.state.last_name == ""){
            funcObj.custom_alert_message("Please enter last name!");
            return false;  
        }
        if(this.state.mobile == ""){
            funcObj.custom_alert_message("Please enter phone number!");
            return false;  
        }
        if(this.state.identification_number == ""){
            funcObj.custom_alert_message("Please enter identification number!");
            return false;  
        }
        if(this.state.email == ""){
            funcObj.custom_alert_message("Please enter email!");
            return false;  
        }
        if(this.state.mobile){
            if (phoneReg.test(this.state.mobile) === false) {
                funcObj.custom_alert_message("Please enter a valid phone number!")
                return false;
            }
        }else if(this.state.email){
            if (emailReg.test(this.state.email) === false) {
                console.log("Email is Not Correct");
                funcObj.custom_alert_message("Please enter a valid email!")
                return false;
            }
        }
        if(this.state.dob == '' || this.state.dob == null || this.state.dob == 'null'){
            funcObj.custom_alert_message("Please select date of birth!");
            return false;
        }
        if(new Date(this.state.dob).getTime() >= new Date().getTime() ){
            funcObj.custom_alert_message("Please correct date of birth");
            return false;  
        }

        let postBodyData ={
            "user_type": this.state.user_type,
            "first_name": this.state.first_name,
            "last_name": this.state.last_name,
            "email": this.state.email,
            "mobile": this.state.mobile,
            "password": "123456",
            "identification_number": this.state.id_no,
            "address": this.state.address,
            "country": this.state.country,
            "state": this.state.state,
            "city": this.state.city,
            "gender": this.state.sex,
            "dob": this.state.dob,
            "user_image":this.state.myFile
        }
        
        // console.log("postBodyData", postBodyData);
        // return false;
        let endPoint = 'add-user';
        
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            // funcObj.custom_alert_message('data response',data)

            if (data.code == 200) {
                funcObj.custom_alert_message(data.message,'success',"users-list")
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

    updateUser(user_id){
        let phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
        let emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        if(this.state.user_type == ""){
            funcObj.custom_alert_message("Please select user type!");
            return false;  
        }
        if(this.state.first_name == ""){
            funcObj.custom_alert_message("Please enter first name!");
            return false;  
        }
        if(this.state.last_name == ""){
            funcObj.custom_alert_message("Please enter last name!");
            return false;  
        }
      
        if(this.state.dob == '' || this.state.dob == null || this.state.dob == 'null'){
            funcObj.custom_alert_message("Please select date of birth");
            return false;
        }
        if(new Date(this.state.dob).getTime() >= new Date().getTime() ){
            funcObj.custom_alert_message("Please correct date of birth");
            return false;  
        }

        let postBodyData ={
            "user_type": this.state.user_type,
            "first_name": this.state.first_name,
            "last_name": this.state.last_name,
            "identification_number": this.state.id_no,
            "address": this.state.address,
            "country": this.state.country,
            "state": this.state.state,
            "city": this.state.city,
            "gender": this.state.sex,
            "dob": this.state.dob,
            "user_image":this.state.myFile,
            "user_id":user_id
        }
        
        // console.log("postBodyData", postBodyData);
        // return false;
        let endPoint = 'update-user-detail-admin';
        
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            // funcObj.custom_alert_message('data response',data)

            if (data.code == 200) {
                funcObj.custom_alert_message(data.message,'success',"users-list")
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
        return (
            <React.Fragment>
                <form id="geniusform" onSubmit={this.handleSubmit}>
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                            <h3 className="dashboard-title title-margin my-2 float-left">{this.state.heading}</h3>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-head mb-3"> <span className="bg-white d-inline-block px-3"> User Details</span></div>
                                    
                                    <div className="form-group">
                                        <label className="pl-3">User Role <span>*</span></label>
                                        <select value={this.state.user_type} className="input-field form-control" onChange={this.handleChange} name="user_type">
                                          {funcObj.userTypeOptions()}
                                        </select>
                                    </div>
                                 
                                    <div className="form-group">
                                        <label className="pl-3">First Name <span>*</span> </label>
                                        <input type="text" value={this.state.first_name} onChange={this.handleChange} className="input-field form-control" placeholder="Enter First Name" name="first_name" />
                                    </div>
                          
                                    <div className="form-group">
                                        <label className="pl-3">Last Name <span>*</span> </label>
                                        <input type="text" value={this.state.last_name} onChange={this.handleChange} className="input-field form-control" placeholder="Enter Last Name" name="last_name" />
                                    </div>
                     

                                    <div className="form-group">
                                        <label className="pl-3">Identification Number</label>
                                        <input type="text" value={this.state.id_no} onChange={this.handleChange} className="input-field form-control" placeholder="Identification Number /Passport Number for users above the age of 18" name="id_no" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Address<span>*</span></label>
                                        <input type="text" value={this.state.address} onChange={this.handleChange} className="input-field form-control" placeholder="Enter Complete Address" name="address" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Country</label>
                                        
                                        <select title="Country" value={this.state.countryId}  onChange={this.handleChange} className="input-field form-control" name="country">
                                            <option value="" >Select Country</option>
                                            {this.state.country_list.length > 0
                                                && this.state.country_list.map((item, i) => {
                                            return (
                                                    
                                                    (item.id == 113)?<option key={i} value={item.id}>{item.name}</option>:null
                                                )
                                            }, this)
}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">State</label>
                                    
                                        <select title="State" value={this.state.stateId} onChange={this.handleChange} className="input-field form-control" name="state">
                                            <option value="" >Select State</option>
                                            {this.state.state_list.length > 0
                                                && this.state.state_list.map((item, i) => {
                                            return (
                                                    <option key={i} value={item.id}>{item.name}</option>
                                                )
                                            }, this)
}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">City/Town</label>
                                    
                                        <select title="City/Town" value={this.state.city} onChange={this.handleChange} className="input-field form-control" name="city">
                                            <option value="" >Select City</option>
                                            {this.state.city_list.length > 0
                                                && this.state.city_list.map((item, i) => {
                                            return (
                                                    <option key={i} value={item.name}>{item.name}</option>
                                                )
                                            }, this)
}
                                        </select>
                                    </div>

                                    {
                                        this.state.update_user == false ?
                                    <React.Fragment>
                                    <div className="form-group">
                                        <label className="pl-3">Mobile<span>*</span> </label>
                                        <input type="text" value={this.state.mobile} onChange={this.handleChange} className="input-field form-control" placeholder="Enter Mobile Number" name="mobile" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Email<span>*</span></label>
                                        <input type="email" value={this.state.email} onChange={this.handleChange} className="input-field form-control" placeholder="Enter Email Address" name="email" />
                                    </div>
                        </React.Fragment>   
                                :
                                <div className="form-group">
                                <label className="pl-3">Mobile</label>
                                <p>{this.state.mobile}</p>
                                <label className="pl-3">Email</label>
                                <p>{this.state.email}</p>
                                </div>
                                }
                                    <div className="form-group">
                                        <label className="pl-3">Sex</label>
                                        <select value={this.state.sex} className="input-field form-control" onChange={this.handleChange} name="sex">
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                 
                                    <div className="form-group">
                                        <label className="pl-3">Date of Birth<span>*</span></label>
                                        <input type="date" value={this.state.dob}  max={this.state.setMaxDate} onChange={this.handleChange} className="input-field form-control" name="dob" />
                                    </div>
                                  
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-head mb-3  clearfix">
                                        <span className="bg-white d-inline-block px-3">Profile Image</span>
                                    </div>
                                    <div className="form-group">
                                        <div className="drop-zone-wrap p-2">
                                            <div className="drop-zone">
                                             
                                                {(this.state.imgSrc)?<img style={{marginRight:20, width:100, height:100}} src={this.state.imgSrc} />: null}
                                                <input type="file" onChange={this.handleChange} name="myFile" className="drop-zone__input1" />
                                            </div>
                                        </div>
                                        <div className="form-group clearfix">
                                            <small className="d-block float-left">Accepted Type : .jpg, .jpeg, .png</small>
                                            <small className="d-block float-right">Single Images Only</small>
                                        </div>
                                      
                                    </div>





                                  


                                 

                                </div>
                            </div>
                            <div className="text-right">
                                <Link to="/users-list" type="button" className="btn go_back_btn  lightBtn roundedBtn py-1 px-3 mr-1 mr-3 w120">Go Back</Link>
                                <button type="submit" className="btn addCart py-1 px-3 mr-1">Save</button>
                            </div>
                        </div>
                    </div>

                </form>

            </React.Fragment>
        );
    }
    
}
