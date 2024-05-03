import React  from "react";
import Axios from 'axios';
import * as Constants from "./machine_specific";
import { Link, Redirect } from 'react-router-dom'
import Swal from "sweetalert2";
import PlayEpub from "./PlayEpub";

import { ProgressBar } from "react-bootstrap";
import ImageView from 'react-single-image-viewer';
import 'react-single-image-viewer/dist/index.css'
import { EncryptStorage } from 'encrypt-storage';
import Moment from "react-moment";
import ReadMoreReact from 'read-more-react';
import AudioPlayer from "./audioPlayer";
const encryptStorage = new EncryptStorage(process.env.REACT_APP_API_KEY, { storageType: 'localStorage', encAlgorithm: 'AES' });
class Functions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isReadMore:true
    };
  }
  default_perpage = 10;

  setEncStorage(key, value) {
    encryptStorage.setItem(key, value);
  }

  getEncStorage(key) {
    const result = encryptStorage.getItem(key);
    return result;
  }

  removeEncStorage(key) {
    const result = encryptStorage.removeItem(key);
    return result;
  }

  setLocalStorage(key, value) {
    this.setEncStorage(key, value);
  }

  getLocalStorage(key) {
    const result = this.getEncStorage(key);
    return result;
  }

  removeLocalStorage(key) {
    const result = this.removeEncStorage(key);
    return result;
  }


  hostname() {
    var hostname = window.location.protocol + "//" + window.location.host + '/';
    return hostname;
  }




  api_request_url() {
    return this.server_url()+"/backend/public/";
  }
  chunk_upload_url() {
    return this.server_url()+"/chunk_upload/public/api/";
  }

  server_url(){

    if (window.location.host.includes('localhost')) {
      return Constants.LOCAL_BACKEND_SERVER;
    }
    else {
      let ip_url = window.location.hostname;
      return window.location.protocol + '//' + ip_url ;
    }

  }
  assets_path(path) {

    return this.getSitePath('assets' + path);
  }

  get_logo() {
    return this.assets_path("/images/vtabu_logo.png");
    // return this.assets_path("/images/logo-footer.png");
  }

  files_path(path) {
    return '/assets/' + path;
  }

  getSitePath(path = '') {

    let site_prefix = this.getBasename();
    if (site_prefix != "") {
      site_prefix = site_prefix + "/";
    }
    return this.hostname() + site_prefix + path;

  }

  getBasename() {
    let base_name = "";
    if (this.checkProcessEnvVar('production')) {
      if (window.location.host == 'localhost') {
        base_name = "knlsbuild";
      } {
        base_name = "";
      }

    }
    return base_name;
  }

  callDashboard(){
    return this.redirectAuthenticatedUser();
  }


  redirectAuthenticatedUser() {


    window.location = this.getSitePath();
    const AUTH_USER = this.getAuthUser();
    let user_type = AUTH_USER.token_info.original.data.user_type;
    let state_to_push = '/';
    if (user_type == 'admin') {
      state_to_push = '/admin-dashboard';
    } else if (user_type == 'reader' || user_type == 'junior_reader') {
      state_to_push = '/reader-dashboard';
    } else if (user_type == 'attendant') {
      state_to_push = '/staff-dashboard';
    } else if (user_type == 'publisher') {
      state_to_push = '/publisher-dashboard';
    } else if (user_type == 'librarian') {
      state_to_push = '/dashboard';
    } else if (user_type == 'senior_librarian') {
      state_to_push = '/dashboard';
    } else if (user_type == 'finance') {
      state_to_push = '/common-profile';
    } else if (user_type == 'analytic_user') {
      state_to_push = '/common-profile';
    }
   
    return <Redirect to={state_to_push} />

 
  }

  getAuthUser() {
    const AUTH_USER = this.getLocalStorage('user');
    return AUTH_USER;
  }

  loaderView(action = "") {
    if (document.getElementById("customeloader") != null) {
      if (action == "show") {
        document.getElementById("customeloader").style.visibility = "visible";
      }

      if (action == "hide") {
        document.getElementById("customeloader").style.visibility = "hidden";
      }
    }

  }

  redirectPage(redirect_to) {
    window.location = this.getSitePath(redirect_to);
  }

  checkIfRedirect() {
    let redirect_to = this.getLocalStorage('redirect_to');
    this.removeLocalStorage('redirect_to');
    return redirect_to;
  }

  getCurrency() {
    return (
      <span className="currency_symbol">{this.getCurrencyText()}</span>
    );
  }
  getCurrencyText(){
    return "KSH";
  }

  getUserTypesDropdown(defaultVal = "") {
    return (
      <React.Fragment>

        <option value="">Select user type</option>
        {/* <option value="admin">Admin</option> */}
        <option value="reader">Reader</option>
        <option value="publisher">Publisher</option>
      </React.Fragment>
    );
  }
  getModuleDropdown(defaultVal = "") {
    return (
      <React.Fragment>
        <option value="">Select Module</option>
        <option value="User">User</option>
        <option value="Content">Content</option>
        <option value="DRM settings">DRM Settings</option>
        <option value="Transaction">Transactions</option>
      </React.Fragment>
    );
  }

  getActivityDropdown(defaultVal = "") {
    return (
      <React.Fragment>
        <option value="">Select Activty</option>
        {/* <option value="add">Add</option> */}
        <option value="create">Create</option>
        <option value="update">Update</option>
        <option value="delete">Delete</option>
        <option value="search">Search</option>
      </React.Fragment>
    );
  }

  getContentSourcesDropdown() {
    return (
      <React.Fragment>
        <option value="">Select Content source</option>
        <option value="publishing_houses">Publishing houses</option>
        <option value="content_aggregators">Content aggregators</option>
        <option value="independant_authors">Independent Authors & producers</option>

      </React.Fragment>
    );
  }


  playerAll(content, is_preview = false) {
    if(document.getElementsByClassName("content-area")){
      document.getElementsByClassName("content-area")[0].style.padding = '1px 0px 0px';
    }
    console.log("playerAll is_preview",is_preview)

    let file_name = '';

    if (is_preview == true) {
      file_name = content.preview_file;
    }
    else {
      file_name = content.upload_content;
    }
    const file_extension = content.file_extension;
    this.updateQuickRead(1, content);
    let user_id='';
    const AUTH_USER = this.getAuthUser();
    if( AUTH_USER !=null && AUTH_USER.user.id){
      user_id=AUTH_USER.user.id;
    }
    return (


      <React.Fragment>

        {
          (file_extension == 'jpeg' || file_extension == 'jpg' || file_extension == 'png' || file_extension == 'JPEG' || file_extension == 'JPG' || file_extension == 'PNG') ?
            <ImageView src={file_name} height="100" width="200" />
            : null
        }

        {
          file_extension == 'pdf' || file_extension == 'PDF' ?
            <iframe id="iframeId" src={this.api_request_url() + `/webviewerpdf?content=` + content.encrypted_content_id + `&preview=` + is_preview+'&user_id='+user_id} width="100%" height="1024px" frameBorder="0" />
            : null
        }

        {
          content.class_name == 'audio' ?
           <AudioPlayer content={content} is_preview={is_preview} />
            : null
        }
        {
          content.class_name == 'video' ?
            <video width="100%"   controls controlsList="nodownload">
              <source src={file_name} type="video/mp4" />
              <source src={file_name} type="video/ogg" />
              Your browser does not support the video tag.
            </video>

            : null
        }
        {
          file_extension == 'epub' || file_extension == 'EPUB' ?
            <PlayEpub content={content} file_name={file_name} />
            : null
        }

      </React.Fragment>
    );
  }




  get_query_string(my_var) {
    const urlParams = new URLSearchParams(window.location.search);
    // console.log('urlParams',urlParams)
    const myParam = urlParams.get(my_var);
    return myParam;
  }

  get_bookdetail_from_listdd() {
    var arrInfo = [
      { book_id: "A1", title: "AAA1 tst" },
      { book_id: "A2", title: "AAA2 tst" },

    ];
    let item = arrInfo.find(item => item.book_id === "A1");
    if (item) {
      return item;
    }
  }




  add_cart_item(book_id, qty) {

    let cart_items = this.get_cart_items();

    if (cart_items) {
      cart_items[book_id] = qty;
    } else {
      cart_items = {};
      cart_items[book_id] = qty;
    }

    cart_items = JSON.stringify(cart_items);

    this.setLocalStorage('cart_items', cart_items);
    return true;
  }
  get_cart_items_length() {
    let cart_items = this.get_cart_items();

    if (cart_items && Object.keys(cart_items).length) {
      cart_items = Object.keys(cart_items).length;
    } else {
      cart_items = 0;
    }
    return cart_items;
  }
  get_cart_items() {
    let cart_items = this.getLocalStorage('cart_items');
    if (cart_items != null) {
      return cart_items;
    }
  }

  is_cart_item_exist(book_id) {
    let cart_items = this.getLocalStorage('cart_items');
    if (cart_items != null) {
      if (book_id in cart_items) {
        return true;
      }
    }
    return false;
  }


  get_cart_item(book_id) {
    let cart_items = this.getLocalStorage('cart_items');
    if (cart_items != null) {
      if (book_id in cart_items) {
        return cart_items[book_id];
      }
    }
    return false;
  }

  remove_cart_item(book_id) {

    let cart_items = this.getLocalStorage('cart_items');
    // console.log("hel;l;ld",cart_items)
    if (cart_items != null) {
      delete cart_items[book_id];
    }
    cart_items = JSON.stringify(cart_items);

    this.setLocalStorage('cart_items', cart_items);
    return true;
  }


  get_category_books(category = "", type = "") {

  }
  get_type_books(type = "") {
    let item = this.allBooks().filter(item => item.type === type);
    return item;
  }
  get_book_details(id = "") {
    let item = this.allBooks().find(item => item.id === id);
    return item;
  }

  filter_books(book_types) {
    if (book_types.length > 0) {
      let item = this.allBooks().filter(item => book_types.indexOf(item.type) !== -1);
      return item;
    } else {
      return this.allBooks();
    }

  }

  loadUrl(url, target_blank = "") {
    if (target_blank != "") {
      window.open(this.getSitePath(url), "_blank")
    } else {
      window.location.href = this.getSitePath(url);
    }


  }

  loadAnotherUrl(e, url, target_blank = "") {
    if (target_blank != "") {
      window.open(url, "_blank")
    } else {
      window.location = url;
    }

  }





  /* get user data */
  getUserData() {

    let userd = this.getLocalStorage('user');
    if (userd == null || userd == "") {
      console.log('No user data exists')
    }

    if (userd) {
      return userd;
    }

  }






  /*
* @ return api prefix for post authenticate
* @params
* @returns object
* */
  apiPostUrl() {
    return this.api_request_url() + 'wapi/';
  }


  loginUrl(endpoint) {
    return this.api_request_url();
}

  /*
* @ prepare headers for rest api call. 
* @params
* @returns object
* */
  preparHeaders(multipart = false) {
    // console.log('preparHeaders', multipart)
    let requestOptions = {}
    const AUTH_USER = this.getAuthUser();
    if (AUTH_USER != null) {

      let token = AUTH_USER.token;
      // console.log("token", token)
      requestOptions = {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        // 'Content-Type':(multipart)?'multipart/form-data' : 'application/json', 
      };
      if (multipart == false) {
        requestOptions['Content-Type'] = 'application/json';
      }
    } else {
      requestOptions = {
        // 'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
      };
      if (multipart == false) {
        requestOptions['Content-Type'] = 'application/json';
        //  requestOptions['Content-Type'] = "multipart/form-data";
      }
    }



    return requestOptions;
  }

  
  preAuthApiCall2(postData, endPoint) {
    console.log('preAuthApiCall endPoint:' + endPoint);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify(postData);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    return new Promise((resolve, reject) => {

      fetch(this.apiPostUrl() + endPoint, requestOptions)
        .then(response => response.json())
        .then((data) => {
          if (data.code == 404) {
            console.log('internal server error');
          } else if (data.code == 401) {
            console.log('Unauthorised:' + endPoint);

          } else {
            // console.log("success resolve ");
            return resolve(data);
          }
        },
          error => {
            console.log("error part ");
            this.loaderView("hide");
            reject(this.handleError(error));
          }
        )
    });
  }

  preAuthApiCall(postData, endPoint) {
    console.log('preAuthApiCall endPoint:' + endPoint);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify(postData);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
    
      redirect: 'follow'
    };

    return new Promise((resolve, reject) => {

      fetch(this.loginUrl() + endPoint, requestOptions)
        .then(response => response.json())
        .then((data) => {
          if (data.code == 404) {
            console.log('internal server error');
          } else if (data.code == 401) {
            console.log('Unauthorised:' + endPoint);

          } else {
            // console.log("success resolve ");
            return resolve(data);
          }
        },
          error => {
            console.log("error part ");
            this.loaderView("hide");
            reject(this.handleError(error));
          }
        )
    });
  }



  /*
* @ prepare headers for rest api call. 
* @params
* @returns object
* */
  preparApiParams(postBody, endPoint, methodType = 'POST', multipart = false) {
    const api_url = this.apiPostUrl() + endPoint;
    var requestOptions = {};
    if (methodType === 'GET') {
      requestOptions = {
        method: methodType,
        headers: this.preparHeaders()
      };
    } else if (methodType === 'PUT') {
      requestOptions = {
        method: methodType,
        headers: this.preparHeaders(),
        body: JSON.stringify(postBody)
      };
    } else {

      if (multipart) {
        const formData = new FormData();
        for (let key in postBody) {
          formData.append(key, postBody[key]);
        }
        // formData.append('file', file, file.name);
        // formData.append('customerOwner', customerOwner);
        requestOptions = {
          method: methodType,
          headers: this.preparHeaders(multipart),
          body: formData
        }
      } else {
        requestOptions = {
          method: methodType,
          headers: this.preparHeaders(),
          body: JSON.stringify(postBody)
        };
      }

    }

    return { api_url: api_url, requestOptions: requestOptions };
  }

  commonFetchApiCall(postBodyData, endPoint, methodType = 'POST', multipart = false, show_loader = true) {

    //   // console.log("commonFetchApiCall");
    //   // console.log(postBodyData);
    //  // console.log(endPoint);
    //  // console.log(methodType);
    if (show_loader) {
      this.loaderView("show");
    }

    // console.log('commonFetchApiCall')
    const { api_url, requestOptions } = this.preparApiParams(postBodyData, endPoint, methodType, multipart);


    return new Promise((resolve, reject) => {
      fetch(api_url, requestOptions)
        // Axios.post(api_url, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log('data', data)
          if (show_loader) {
            this.loaderView("hide");
          }
          if (data) {
            if (data.code == 404) {
              console.log('internal server error');
            } else if (data.code == 401) {
              console.log('commonFetchApiCall endPoint:' + endPoint);
              console.log('Unauthorised');
              if (endPoint != 'login') {
                this.removeLocalStorage('user');
                Swal.fire({
                  title: 'Session out, Please login again',
                  text: 'Session out, Please login again',
                  icon: 'error',
                  showConfirmButton: false,
                })
                window.location.href = this.getSitePath("");
              }

            } else {

              return resolve(data);
            }

          } else {
            return reject(
              function () {
                console.log("Request data error");
              }
            );
            //
          }
        },
          error => {
            // alert(error)
            // console.log("error part ");
            this.loaderView("hide");

            reject(this.handleError(error));
          })
    });
  }

  custom_alert_message(msg, icon = 'error',redirect_link='') {
    if(redirect_link == ''){
      Swal.fire({
        title: '',
        html: msg,
        icon: icon,
        showConfirmButton: true,
        confirmButtonText: 'Ok',
        
      })

    }else{
      Swal.fire({
        title: '',
        html: msg,
        icon: icon,
        showConfirmButton: true,
        confirmButtonText: 'Ok',
        
      }).then((result) => {
        if (result.isConfirmed) {
           return this.redirectPage(redirect_link);
       } 
     })

    }
  

  }

  handleError(error) {
    console.log('handleError error', error)
    // console.log("Request server response error");
    // console.log("api error",error)
    // Swal.fire({
    //   title: 'Server Error',
    //   text: 'Server is not responding',
    //   icon: 'error',
    //   showConfirmButton: false,
    // })
    // return error;
  }


  loaderView(action = "") {

    if (action == "show") {
      document.getElementById("customeloader").style.visibility = "visible";
      // document.getElementById("page-top").disabled = true;

      if (document.getElementById("page-top")) {
        document.getElementById("page-top").disabled = true;
      }
    }

    if (action == "hide") {
      document.getElementById("customeloader").style.visibility = "hidden";
      // document.getElementById("page-top").disabled = false;
      if (document.getElementById("page-top")) {
        document.getElementById("page-top").disabled = false;
      }

    }

  }

  generateStarRating(stars) {
    let htmlbody = '<div class="book-rating my-2">';
    for (let i = 0; i < stars; i++) {
      htmlbody += '<i class="fa fa-star" aria-hidden="true"></i>';
    }
    let blank_stars = 5 - stars;
    for (let i = blank_stars; i > 0; i--) {
      htmlbody += '<i class="fa fa-star-o" aria-hidden="true"></i>';
    }
    htmlbody += '</div>';
    return (
      <React.Fragment>
        {<div dangerouslySetInnerHTML={{ __html: htmlbody }} ></div>}
      </React.Fragment>
    );
  }

  getTitleByKey(title) {

    if (title == 'ebook') {
      return 'Ebook';
    }
    if (title == 'audio') {
      return 'Audio';
    }
    if (title == 'video') {
      return 'Video';
    }
    if (title == 'slide') {
      return 'Slide';
    }

  }

  getBookTypeListSmallIcon(class_name) {
    let defaultImage = '';
    if (class_name == 'audio') {
      defaultImage = this.assets_path("/images/icons/audiobook_blue.svg");
    }
    else if (class_name == 'video') {
      defaultImage = this.assets_path("/images/icons/videobook_blue.svg");
    }
    else if (class_name == 'ebook') {
      defaultImage = this.assets_path("/images/icons/ebook_blue.svg");
    }
    else if (class_name == 'slide') {
      defaultImage = this.assets_path("/images/icons/slide_blue.svg");
    }
    else if (class_name == 'manuscripts') {
      defaultImage = this.assets_path("/images/icons/manuscripts.png");
    }
    return defaultImage;
  }

  displayClassIcon(class_name) {
    let class_tag = this.getClassTag(class_name);
    return (
      <div className="simple_tag">
        {this.getClassFaIcon(class_name)} {class_name}
      </div>
    );
  }

  getClassTag(class_name) {

    if (class_name == 'audio') {
      return this.assets_path("/images/icons/audio-tag.svg");
    } else if (class_name == 'video') {
      return this.assets_path("/images/icons/video-tag.svg");
    } else if (class_name == 'ebook') {
      return this.assets_path("/images/icons/book-tag.svg");
    } else if (class_name == 'slide') {
      return this.assets_path("/images/icons/slides-tag.svg");
    }


  }
  getClassFaIcon(class_name) {

    if (class_name == 'audio') {
      return <i class="fas fa-headphones"></i>;
    } else if (class_name == 'video') {
      return <i class="fa fa-video-camera"></i>;
    } else if (class_name == 'ebook') {
      return <i class="fas fa-book-open"></i>;
    } else if (class_name == 'map') {
      return <i class="fa fa-map-marker"></i>;
    } else if (class_name == 'pictures') {
      return <i class="fa fa-picture-o"></i>;
    } else if (class_name == 'music') {
      return <i class="fa fa-sticky-note-o"></i>;
    } else if (class_name == 'manuscripts') {
      return <i class="	far fa-newspaper"></i>;
    } else if (class_name == 'journal/periodical') {
      return <i class="fa fa-book" aria-hidden="true"></i>;
    }


  }

  getClassTypeIcons(class_name) {

    if (class_name == 'ebook') {
      return this.assets_path("/images/dashboard_icons/ebook.svg");
    } else if (class_name == 'audio') {
      return this.assets_path("/images/dashboard_icons/audio.svg");
    } else if (class_name == 'video') {
      return this.assets_path("/images/dashboard_icons/video.svg");
    } else if (class_name == 'pictures') {
      return this.assets_path("/images/dashboard_icons/pictures.svg");
    } else if (class_name == 'manuscripts') {
      return this.assets_path("/images/dashboard_icons/manuscript.svg");

    } else if (class_name == 'music') {
      return this.assets_path("/images/dashboard_icons/music.svg");

    } else if (class_name == 'map') {
      return this.assets_path("/images/dashboard_icons/map.svg");

    } else if (class_name == 'journal/periodical') {
      return this.assets_path("/images/dashboard_icons/journal.svg");

    } else {
      return this.assets_path("/images/dashboard_icons/audio.svg");
    }

  }


  getClassTypeColouredIcons(class_name) {

    if (class_name == 'ebook') {
      return this.assets_path("/images/icons/ebook.png");
    } else if (class_name == 'audio') {
      return this.assets_path("/images/icons/audiobook.png");
    } else if (class_name == 'video') {
      return this.assets_path("/images/icons/videobook.png");
    }else if (class_name == 'Journals & Periodicals') {
  return this.assets_path("/images/icons/journal.svg");
}

  }


  showContentTypeIcon(content) {
    const title_text = this.showContentTypeTitle(content.content_type);
    if (content.content_type == 'free') {
      return <span className="label-success"><i className="fa fa-bell"></i> {title_text} </span>
    } else if (content.content_type == 'paid') {
      return <span className="label-success"><i className="fa fa-shopping-cart"></i> {title_text} </span>
    } else if (content.content_type == 'membership') {
      return <span className="label-success"><i className="fa fa-bell"></i> {title_text} </span>
    }


  }
  showContentTypeTitle(content_type){
    if (content_type == 'free') {
      return  "Free";
    } else if (content_type == 'paid') {
      return "For sale"
    } else if (content_type == 'membership') {
      return "Membership"
    }
  }

  updateAuthUser(user_key, user_value) {
    // console.log('updateAuthUser user_key',user_key)
    // console.log('updateAuthUser user_value',user_value)
    const jsonString = this.getLocalStorage("user");
     const userobj = JSON.parse(JSON.stringify(jsonString)) ;
    // console.log('updateAuthUser userobj',userobj)
    const user_obj = userobj.user;
    user_obj[user_key]= user_value;
    const new_obj = { ...userobj, user:user_obj }
    this.setLocalStorage("user", new_obj);
  }

  is_route_allowed(browser_route) {
    // console.log('is_route_allowed browser_route:'+browser_route)

    const AUTH_USER = this.getAuthUser();
    if (browser_route != "" && AUTH_USER.account_type != 'admin') {
      console.log('AUTH_USER.user.all_persmission', AUTH_USER.user.all_persmission)
      console.log('AUTH_USER.user.persmission', AUTH_USER.user.persmission)
      if (AUTH_USER.user.all_persmission.includes(browser_route)) {
        if (!(AUTH_USER.user.persmission.includes(browser_route))) {
          return 1;
        }
      }
    }

  }

  get_pathname() {
    let pathname = (window.location.pathname).split("/");
    if (window.location.host.includes('localhost')) {
      return pathname[1];
    } else {
      return pathname[2];
    }
  }

  js_array_by_range(lowEnd, highEnd) {
    var list = [];
    for (var i = lowEnd; i <= highEnd; i++) {
      list.push(i);
    }
    return list;
  }

  showProgressbar(content) {
    const AUTH_USER = this.getAuthUser();
    console.log(AUTH_USER.account_type + 'showProgressbar', content)
    if (AUTH_USER.account_type != null  && AUTH_USER.user.id != content.publisher_id && content.is_subscribed == 1) {
      if (content.total_length != 0 && content.read_duration != 0) {
        const percent = Math.floor((content.read_duration / content.total_length) * 100);
        return <ProgressBar now={percent} label={`${percent}%`} />
      } else {
        return <ProgressBar now={0} label={`${0}%`} />
      }
    }

  }

  updateQuickRead(read_duration, content) {
    const AUTH_USER = this.getAuthUser();
    if(AUTH_USER != null){
    if ((AUTH_USER.account_type == 'reader' || AUTH_USER.account_type == 'junior_reader')) {
      let endPoint = 'quick-read';
      let postBodyData = {
        is_reading: 1,
        read_duration: read_duration,
        content_id: content.content_id
      };
      this.commonFetchApiCall(postBodyData, endPoint).then(data => {

      });

    }
  }

  }

  is_contents_view_permitted(content) {
    const AUTH_USER = this.getAuthUser();

if(content.upload_content != "" && content.upload_content != null){

      if(content.no_of_copies == -1 && content.content_type == 'free'){
        return 'can_access';
     }
    if (AUTH_USER != null) {
      if (AUTH_USER.account_type == 'senior_librarian' || AUTH_USER.account_type == 'librarian' || AUTH_USER.account_type == 'admin') {
        return 'can_access';
      }

      if (content.no_of_copies_available.read_content != false || AUTH_USER.user.id == content.publisher_id ) {
        return 'can_access';
      }

      if(AUTH_USER.user.is_membership_user == 1 && content.content_type == 'membership'){
        return 'can_access';
      }


    }

  }



  }

  showAccountType(user) {
    return this.getUserTitleByAccountType(user.account_type);
  }

  getUserTitleByAccountType(account_type){
    let user_type_title = account_type;
    switch (account_type) {
      case "reader":
        user_type_title = 'Reader';
        break;
      case "finance":
        user_type_title = 'Finance';
        break;
      case "analytic_user":
        user_type_title = 'Analytic user';
        break;
      case "attendant":
        user_type_title = 'Attendant';
        break;
      case "junior_reader":
        user_type_title = 'Junior Reader';
        break;
      case "senior_librarian":
        user_type_title = 'Senior Librarian';
        break;
      case "librarian":
        user_type_title = 'Librarian';
        break;
      case "publisher":
        user_type_title = 'Publisher';
        break;
      case "admin":
        user_type_title = 'Admin';
        break;
    }
    return user_type_title;

  }

  userTypeOptions() {
    const AUTH_USER = this.getAuthUser();
    return (
      <React.Fragment>
        <option value="reader">Reader</option>
        {
          AUTH_USER.account_type == 'admin' ?
            <React.Fragment>
            <option value="admin">{this.getUserTitleByAccountType('admin')}</option>
              <option value="publisher">{this.getUserTitleByAccountType('publisher')}</option>
              <option value="finance">{this.getUserTitleByAccountType('finance')}</option>
              <option value="analytic_user">{this.getUserTitleByAccountType('analytic_user')}</option>
              <option value="librarian">{this.getUserTitleByAccountType('librarian')}</option>
              <option value="senior_librarian">{this.getUserTitleByAccountType('senior_librarian')}</option>
              <option value="attendant">{this.getUserTitleByAccountType('attendant')}</option>
            </React.Fragment>
            : null}

      </React.Fragment>
    );
  }
  year(start_year='',end_year='') {
    const arr = [];
    let startYear = 1900;
    if(start_year != ''){
      startYear = start_year;
    }
    let endYear = new Date().getFullYear();
    if(end_year != ''){
      endYear = end_year;
    }
    for (let i = endYear; i >= startYear; i--) {
      arr.push(<option value={i}>{i}</option>);
    }
    return arr;
  }
  get_junior_dob_start_year(){
    let year = new Date().getFullYear();
    year = year-18;
    return year;
  }

  get_adult_dob_end_year(){
    let year = new Date().getFullYear();
    year = year-18;
    return year;
  }
  month() {
    const arr = [];
    const monthname = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const startMonth = 1;
    const endMonth = 12;
    for (let i = endMonth; i >= startMonth; i--) {
      let list = i - 1;
      arr.push(<option value={i}>{monthname[list]}</option>);
    }
    return arr;
  }
  date() {
    const arr = [];
    const startMonth = 1;
    const endMonth = 31;
    for (let i = endMonth; i >= startMonth; i--) {
      arr.push(<option value={i}>{i}</option>);
    }
    return arr;
  }
  custom_styles(content) {
    
    let custom_css = ``;
    const AUTH_USER = this.getAuthUser();
 
  
    
      if (AUTH_USER!= null && (AUTH_USER.account_type == 'senior_librarian' || AUTH_USER.account_type == 'librarian' || AUTH_USER.account_type == 'admin'|| AUTH_USER.user.id == content.publisher_id )) {
        
      }else{
        
        if (content.printing == 0) {
          custom_css += `
          @media print {
                      
            html,
            body {
                /* Private Hide the whole page */
                display: none;
            }
        }
        `;
        }

        if (content.copy_paste == 0) {
        custom_css += `
        html,
        body {
          /* Private disable selection */
          user-select: none;
      }
        `;
      }

      }

      

    

    return (
      <React.Fragment>
        <style>{custom_css}</style>
      </React.Fragment>
    );
  }

  public_page_custom_styles(content) {
    let custom_css = ``;
 
      custom_css += `
      @media print {
                  
        html,
        body {
            /* Public Hide the whole page */
            display: none;
        }
    }
    `;
 
        custom_css += `
        html,
        body {
          /* Public Prevent selection */
          user-select: none;
      }
        `;

    return (
      <React.Fragment>
        <style>{custom_css}</style>
      </React.Fragment>
    );
  }



  checkProcessEnvVar(env_var) {
    if (this.isProcess() && process.env.NODE_ENV == env_var) {
      return true;
    }
  }
  isProcess(){
    if(process.env.NODE_ENV){
      return true;
    }
  }
  budget(start_year='',end_year='') {
    const arr = [];
    let startYear = 2015;
    if(start_year != ''){
      startYear = start_year;
    }
    let endYear = new Date().getFullYear();
   
    if(end_year != ''){
      endYear = end_year;
    }
    for (let i = endYear; i >= startYear; i--) {
      let yr= parseInt(i)+1;
      arr.push(<option value={i +'-'+ yr}>{i +'-'+ yr}</option>);
    }
    return arr;
  }
  callSearch(classes = "", search_text = "") {
    window.location = this.getSitePath('dbooks?q=' + classes + '&search_text=' + search_text);
  }


  checkDobValidation(year, month, date) {

    if (year != "" && month != "" && date != "") {


      let birthdate = new Date(year + ',' + month + ',' + date);
      var age = new Date() - birthdate;

      let today = new Date();
      today.setHours(0, 0, 0);
      if (birthdate >= today) {
        this.custom_alert_message('Your date of birth cannot be a future date. Please correct and try again.');
      }
    }
  }


  hideMobileNumber(mobile) {
    const hmobile = mobile.replace(mobile.substring(2, 7), "*******");
    return hmobile;
  }

  getIdentificationType(type = '') {

    const types = { 1: 'Identification Number', 2: 'Passport', 3: 'Other' };
    if (type == '') {
      return types;
    } else {
      return types[type];
    }

  }

  catalogCardBox(content) {
    const AUTH_USER = this.getAuthUser();
    let book_detail_link = `/bookdetail?book_id=` + content.encrypted_content_id + `&type=` + content.class_id;
    if (AUTH_USER != null) {
      book_detail_link = `/private-bookdetail?book_id=` + content.encrypted_content_id + `&type=` + content.class_id + `&backlink=library-catalog`;
    }
    let content_picture = '';
    if (content.main_content_image == null || content.main_content_image == '') {
      content_picture = this.assets_path("/images/dummy-image.jpg");
    } else {
      content_picture = content.main_content_image;
    }
    return (
      <React.Fragment>
        <div className="book-card-wrap">
          <div className="book-card ebook">
            <div className="img-wrap float-left">

              <Link to={book_detail_link} >
                <img src={content_picture} alt="books" />
              </Link>
            </div>
            <div className="book-details float-left">
              <div className='top_tag'>{this.getClassFaIcon(content.class_name)} {content.class_title_s}</div>
              <div className="book-name">
                {content.title}
              </div>
              <p>
                {content.author}
              </p>

              <div className="book-rating">
                {this.showContentTypeIcon(content)}
                &nbsp;
                {(AUTH_USER != null && AUTH_USER.user.id != content.publisher_id && content.is_subscribed == 1) ?
                  (<span className="label-success"><i className="fa fa-bell"></i> Subscribed </span>)
                  : null

                }
                {this.generateStarRating(content.rating)}
                <span>{content.rating}/5</span>
              </div>
            </div>
          </div>
          <div className="description-text mt-3">
            {content.description}
          </div>
        </div>
      </React.Fragment>
    );
  }


  catalogCardBoxLeftRightList(content, backlink) {
    const AUTH_USER = this.getAuthUser();
    let book_detail_link = `/bookdetail?book_id=` + content.encrypted_content_id + `&type=` + content.class_id + `&backlink=` + backlink;
    if (AUTH_USER != null) {
      book_detail_link = `/private-bookdetail?book_id=` + content.encrypted_content_id + `&type=` + content.class_id + `&backlink=` + backlink;
    }
    let content_picture = '';
    if (content.main_content_image == null || content.main_content_image == '') {
      content_picture = this.assets_path("/images/dummy-image.jpg");
    } else {
      content_picture = content.main_content_image;
    }

    return (
      <React.Fragment>
        <div className="book-card-wrap">
          <div className="book-card ebook">
            <div className="img-wrap float-left">

              <Link to={book_detail_link} >
                <img src={content_picture} alt="books" />
              </Link>
            </div>
            <div className="book-details float-left">
              <div className='top_tag'>{this.getClassFaIcon(content.class_name)} {content.class_title_s}</div>
              <div className="book-name">
                {content.title}
              </div>

              <div className="book-rating">
                {this.showContentTypeIcon(content)}
                &nbsp;

                {this.generateStarRating(content.rating)}
                <span>{content.rating}/5</span>
              </div>
            </div>
          </div>
          <div className="description-text mt-3">
            {content.description}
          </div>
        </div>
      </React.Fragment>
    );
  }

  quickSearch(e, id) {
    let search_text = document.getElementById(id).value;
    window.location = this.getSitePath('library-catalog?search_text=' + search_text);
  }
  
  showContentDetailPageData(content,isReadMore) {
    const AUTH_USER = this.getAuthUser();
    let description =content.description;
   
   console.log('read more ',isReadMore);
    return (
     
      <React.Fragment>
        <div className="book-decription row">
          <div className="col-md-12"  >
            <h6 className="mb-0">
              Content Description
            </h6>
          </div>
          <div className="text-black col-md-12"  >
            {/* { isReadMore ? description.slice(0,150):description} */}
            <ReadMoreReact text={description}  min={300}
            ideal={300}
            max={300}
            readMoreText={'Read More'} />
          </div>
        </div><br />
        <div className="row">
          <div className="col-md-6">
            <p className="black-light">
              <strong>Date Created: </strong> {content.created_date} <br></br>
              <strong>Published Year: </strong> {content.publishing_date_format} <br></br>
              <strong>Edition: </strong>  {content.edition} <br></br>

              {
                AUTH_USER != null && AUTH_USER.account_type != 'reader' && AUTH_USER.account_type != 'junior_reader' ?
                  <React.Fragment>
                    <strong>Original Uploader: </strong>
                    {content.publisher}
                    <br></br>
                    <strong>Last updated by: </strong>
                    {content.last_uploader} <p>
                      on <Moment format={this.getFullDateTime()}>{content.created_at}</Moment>
                    </p>
                    <br></br>
                  </React.Fragment>
                  : null}
            </p>
          </div>
          <div className="col-md-6">
            <p className="black-light">
              <strong>Language of Resource:</strong> {content.language}<br></br>
              <strong>Licence Type:</strong> {content.content_type}<br></br>
              <strong>Categories: </strong>
              {
                content.category && Object.keys(content.category).length > 0 ?
                  content.category.map((category, index) => {
                    return (
                      <React.Fragment key={index}>
                        <>{category.category_name}</>
                        {
                          Object.keys(content.category).length > 1 && Object.keys(content.category).length > index ?
                            <>, </>
                            :
                            null
                        }
                      </React.Fragment>
                    )
                  })
                  : null}
              <br></br>
              {
                this.customIsPropertyNotEmpty(content.other_sources_link)?
                  <>
                    <strong>Other source Link: </strong>
                    <Link to="" onClick={(e) => this.openOtherLink(e, content.other_sources_link)}>click here</Link>
                  </>
                  : null}
              <br></br>
            </p>
          </div>
        </div>

      </React.Fragment>
    );
  }
  toggleReadMore(content,isReadMore){
    alert();
    // const { isReadMore } = this.state;
    isReadMore = (isReadMore==true)? false :true;
    // this.setState({ isReadMore: false });

    this.showContentDetailPageData(content,isReadMore);
  }
  openOtherLink(e, url) {
    e.preventDefault();
    // window.location = url;
    if (!url.includes('http')) {
      url = 'http://' + url;
    }
    window.open(url, "_blank")
  }
  openUrl(e, url) {
    window.location = this.getSitePath(url);
  }
  showContentDetailModalData(content) {
    console.log('content.sub_category',content.sub_category);
    const AUTH_USER = this.getAuthUser();
    return (
      <React.Fragment>
        <div className="modal-content">
          <div className="modal-header" style={{ 'border-bottom': 'unset !important' }}>
            <div className="col-md-6">
              <p className="black-light">
                <strong>Date Created:</strong> {content.created_date} <br></br>
                <strong>Date Published:</strong> {content.publishing_date} <br></br>
                <strong>Editor:</strong> {content.editor} <br></br>
                <strong>Edition:</strong> {content.edition} <br></br>
                <strong>ISBN:</strong> {content.isbn_content} <br></br>
                <strong>ISSN:</strong> {content.issn} <br></br>
                <strong>Subject:</strong> {content.content_subject} <br></br>
                <strong>Genre:</strong> {content.genre} <br></br>
                {
                  AUTH_USER != null && AUTH_USER.account_type != 'reader' && AUTH_USER.account_type != 'junior_reader' ?
                    <React.Fragment>
                      <strong>Uploader:</strong> <Link to="/home">
                        {content.publisher}
                      </Link> <br></br>
                    </React.Fragment>
                    : null}
                <strong>Publishing house:</strong> {content.publishing_house} <br></br>
                <strong>Publication details:</strong> {content.publication_details} <br></br>
                <strong>Authors:</strong> {(content.author_name != null && content.author_name != 'null') ? content.author_name : ""}<br></br>

              </p>
            </div>
            <div className="col-md-6">
              <p className="black-light">
                <strong>Language of Resource:</strong> {content.language}<br></br>

                <strong>Licence Type:</strong> {content.content_type}<br></br>
                <strong>Type of Resource:</strong> {content.type_of_resource}<br></br>
                <strong>Location of Resource:</strong> {content.location_of_resource} <br></br>


                <strong>Categories: </strong>

                {
                  content.category && Object.keys(content.category).length > 0 ?
                    content.category.map((category, index) => {
                      return (
                        <React.Fragment key={index}>
                          <>{category.category_name}</>
                          {
                            Object.keys(content.category).length > 1 && Object.keys(content.category).length > index ?
                              <>, </>
                              :
                              null
                          }
                        </React.Fragment>
                      )
                    })
                    : null}
                <br></br>
                <strong>Sub Categories: </strong>

                {/*{*/}
                {/*  content.sub_category && Object.keys(content.sub_category).length > 0 ?*/}
                {/*    content.sub_category.map((category, index) => {*/}
                {/*      return (*/}
                {/*        <React.Fragment key={index}>*/}
                {/*          <span>{category.sub_category_name}</span>*/}
                {/*          {*/}
                {/*            Object.keys(content.sub_category).length > 1 && Object.keys(content.sub_category).length > index ?*/}
                {/*              <span>, </span>*/}
                {/*              :*/}
                {/*              null*/}
                {/*          }*/}
                {/*        </React.Fragment>*/}
                {/*      )*/}
                {/*    })*/}
                {/*    : null}*/}
                {
                  Array.isArray(content.sub_category) && content.sub_category.length > 0 ?
                      content.sub_category.map((category, index) => (
                          <React.Fragment key={index}>
                            <span>{category.sub_category_name}</span>
                            {
                              content.sub_category.length > 1 && index < content.sub_category.length - 1 ?
                                  <span>, </span>
                                  :
                                  null
                            }
                          </React.Fragment>
                      ))
                      : null
                }
                <br></br>
                {
                  AUTH_USER != null && (AUTH_USER.account_type == 'librarian' || AUTH_USER.account_type == 'senior_librarian' || AUTH_USER.account_type == 'admin') ?
                    <>
                      <strong>Series Statement:</strong> {content.series_statement} <br></br>
                      <strong>Tags:</strong> {content.tags}<br></br>
                      <strong>Class number:</strong> {content.class_number}<br></br>
                      <strong>Note:</strong> {content.note}<br></br>
                    </>
                    : null
                }
                <br></br>


              </p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
  /**Chunk file upload  */
 
    
  getDateFormat() {
    return "DD-MM-YYYY";
  }
  getTimeFormat() {
    return "hh:mm a ";
  }
  getFullDateTime() {
    return "DD-MM-YYYY hh:mm a";
  }

  previewTitle(content) {
    switch (content.class_name) {
      case "ebook":
        return 'Preview';
        break;
      case "audio":
        return 'Preview';
        break;
      case "video":
        return 'Preview';
        break;
      default:
        return 'Preview';
        break;
    }
  }

  viewTitle(content) {
    switch (content.class_name) {
      case "ebook":
        return 'Read';
        break;

      case "audio":
        return 'Listen';
        break;
      case "video":
        return 'Watch';
        break;
      default:
        return 'View';
        break;
    }
  }

  loadExternalJavascript(file_path) {
    console.log(file_path);
    const script = document.createElement("script");
    script.src = file_path;
    script.async = true;
    script.onload = () => this.scriptLoaded();
    document.body.appendChild(script);
  }
  scriptLoaded() {

  }

  getFileTypesExtensionsArray(class_name){
    switch(class_name){
      case "audio":
      case "video":
        return ["webm","mp4","mpeg","ogv","mp3","WEBM","MP4","MPEG","OGV","MP3"];
      break;
      
      case "ebook":
        return ["pdf","epub","PDF","EPUB"];
      break;
      
      case "map":
        return ["jpeg","png","jpg","pdf"];
      break;

      case "journal/periodical":
        return ["docx","pdf","PDF"];
      break;
      
      case "pictures":
        return ["jpeg","png","jpg"];
      break;
      
      case "manuscripts":
      case "music":
        return ["pdf","PDF"];
      break;

      case "zip":
        return ["zip"];
      break;

      default:
        return ["zip"];
        break;
    }
    
  }

  checkStringContainsTextInArray(str,arr){
    const contains = arr.some(element => {
      if (str.includes(element)) {
        return true;
      }
    
      return false;
    });
    return contains;
  }


  recordsPerPageOptions(){
    return {
      10:"10 Records",
      20:"20 Records",
      50:"50 Records",
      100:"100 Records",
      1000:"1000 Records",
    }
  }

  headerSearchOptions(){
    return {
      "all":"All",
      "title":"Title",
      "author":"Author",
      "publishing_house":"Publisher",
      "advanced":"Advanced",

    }
  }

  setClasses(){        

    let public_classes = this.getLocalStorage('public_classes');
    if (public_classes == null) {
      const endPoint = 'get-contents-classes-public';
      let postBodyData = {};
      this.commonFetchApiCall(postBodyData, endPoint).then(data => {
          if (data && data.code == 200 && data.data) {
            this.setLocalStorage('public_classes',data.data);
          }

      });
  }
}

  requestSubjectOptions(){

    let options = {
      "Content access":"Content access",
       "Membership":"Membership",
       "Password reset":"Password reset"
    };
    let public_classes = this.getLocalStorage('public_classes');
    if (public_classes != null) {
      public_classes.forEach(function(public_class){
        options[public_class.class_name_key] = public_class.class_name;  
    });
    
    }
    return options;
  }


  errorWarning(error_message){
    return (
        <>
     <i class="fa fa-warning"></i> {error_message}
     </>
    );
}

validateIntaSendCardResponse(){
  let tracking_id = this.get_query_string('tracking_id');
  let signature = this.get_query_string('signature');
  let checkout_id = this.get_query_string('checkout_id');
  console.log('tracking_id',tracking_id)
  if(tracking_id != '' && tracking_id != null){
    const endPoint = 'validate-intasend-response';
    const postBodyData = {
      tracking_id:tracking_id,
      signature:signature,
      checkout_id:checkout_id
    };
    this.commonFetchApiCall(postBodyData, endPoint).then(data => {
      if(data.code == 200){
        if(data.data.payment_for == 'cart'){
          this.removeLocalStorage("cart_items");
          document.getElementById('cart_count').textContent = this.get_cart_items_length();
        }else if(data.data.payment_for == 'membership'){
          this.updateAuthUser('plan', data.data.plan);
          this.updateAuthUser('is_membership_user', data.data.is_membership_user);
          this.updateAuthUser('is_member', 1);
        }
      }
      
      this.custom_alert_message(data.message)
    });
      
  }
}

customIsPropertyNotEmpty(inp){
  if(inp != 'null' && inp != null && inp != "" && inp != 0 && inp != false && inp != undefined && inp != 'undefined'){
    return true;
  }
}

isValidUrl(urlString){
  var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
return !!urlPattern.test(urlString);
}

}




export default Functions;




