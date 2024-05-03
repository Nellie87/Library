import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Functions from '../helpers/functions';
import { LibraryCatalogStyle,classes } from '../search/libraryCatalogStyle';
import ToggleIcon from './toggleIcon';


const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
class Header extends React.Component {

    constructor(props) {
        super(props);
        let search_text = funcObj.get_query_string('search_text');
        this.state = {
            advance_search: false,
            username: AUTH_USER.user.username,
            imageUrl: AUTH_USER.user.profile_image,
            style_class:classes.col_4,
            collapseSidebar:this.collapseSidebar,
            search_text:search_text
        };
        
        this.collapseSidebar = () => {
            console.log('collapseSidebar',this.state.style_class)
            this.setState(state => ({
                style_class:
                state.style_class === classes.col_4
                  ?  classes.col_6
                  :  classes.col_4,
            }));
          };
    }

  
    
    async setSuggestionList() {
        let search_for = 'all';
        if (document.getElementById('search_for')) {
            search_for = document.getElementById('search_for').value;
        }

       

        let postBodyData = {
            search_for: search_for
        };
        if (document.getElementById("searchInp")) {
            postBodyData['search_text'] = document.getElementById("searchInp").value;
        }
        let endPoint = 'get-content-title-suggestions-list';
        const result = await funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', false, false);
        return result;
    }

    quickSearchBtn(e,searchInp){
        let searchVal = '';
        if (document.getElementById(searchInp)) {
            searchVal = document.getElementById(searchInp).value;
        }
        let search_for = 'all';
        if (document.getElementById('search_for')) {
            search_for = document.getElementById('search_for').value;
        }
        openSearchPage(searchVal,search_for);
    }

    logout() {
        let user = funcObj.getLocalStorage('user');


        let postBodyData = {
            "email": user.email
        };
        let endPoint = 'logout';
        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            console.log('logout response', data)

            if (data.code == 200) {

                this.setState({
                    // authentication:true,
                    // login_success:true,
                    // user:data.data
                });
                funcObj.removeLocalStorage('user');
                window.location.href = funcObj.getSitePath("home");

            } else if (data.code == 201) {

            }
        });
        // funcObj.removeLocalStorage('user');
        // window.location.href = funcObj.getSitePath("");
    }

    onchangeSearchFor(event) {
        if (event.target.value == 'advanced') {
            openSearchPage("", 'advanced');
        }
    }
    onChangeSearchInput(event) {
        if(event.key === "Enter"){
            openSearchPage(event.target.value)
        }
     
        const listPromise = this.setSuggestionList();
     
        listPromise.then(response => {
            console.log('setSuggestionList called')
            if (response.code == 200) {
                const suggesion_list = response.data;
                console.log('suggesion_list',suggesion_list)
                if (document.getElementById("searchInp")) {
                    console.log('calling autocomplete')
                    autocomplete(document.getElementById("searchInp"),suggesion_list);
                }
            }else{
                autocomplete(document.getElementById("searchInp"),[]);
            }
        });
       
       
    }

    render() {
        let cart_items = funcObj.get_cart_items();
        let search_for = funcObj.get_query_string('search_for');
        if (cart_items && Object.keys(cart_items).length) {
            cart_items = Object.keys(cart_items).length;
        } else {
            cart_items = 0;
        }

        let profileimage = (this.state.imageUrl) ? this.state.imageUrl : funcObj.assets_path('/images/icons/dummy-user.png');

        return (
            <React.Fragment >
                <div className="container-fluid">
                    <div className="d-flex justify-content-between">
                        <div className="d-flex justify-content-between align-items-center logo_wrap">
                    
                
                            <div className="menu-toggle-button hidon-mob">
                            <ToggleIcon  />
                        
                            </div>
                     
                            
                            <Link className="admin-logo" to="/home">
                                <img className="main_logo" src={funcObj.get_logo()} alt="knls logo" />
                            </Link>
                        </div>

                        <div className="right_wrap pl-0 pl-md-4">
                            <div className='row header_search_bar private_search'>


                                <div className="customs_wrapper">
                                    <div className="search_box">
                                        <div className="dropdown">
                                            <select name='search_for' defaultValue={search_for} id='search_for' aria-label="Search by" onChange={(e) => this.onchangeSearchFor(e)}>
                                                      
                                     {
                                        Object.keys(funcObj.headerSearchOptions()).map(function (key){
                                            return <option key={key} value={key}>{funcObj.headerSearchOptions()[key]}</option>
                                        })
                                    }
                                            </select>
                                        </div>
                                        <div className="search_field">
                                            <input type="text"
                                                name="searchInp"
                                                id="searchInp"
                                                placeholder="Search content"
                                                className="input"
                                                autoComplete="off"
                                                onPaste={(e) =>this.onChangeSearchInput(e)}
                                                onKeyPress={(e) =>this.onChangeSearchInput(e)}
                                                onKeyUp={(e) =>this.onChangeSearchInput(e)}
                                                defaultValue={this.state.search_text}
                                            />

                                            <i onClick={(e) => this.quickSearchBtn(e, "searchInp")} className="fas fa-search"></i>
                                        </div>
                                    </div>
                                </div>






                            </div>
                            <div className="right-eliment">
                                <ul className="list">

                                    {/* <li className="bell-area">
                                    <a id="notf_conv" className="dropdown-toggle-1" >
                                        <i className="far fa-envelope"></i>
                                        <span data-href="#" id="conv-notf-count">0</span>
                                    </a>
                                    <div className="dropdown-menu">
                                        <div className="dropdownmenu-wrapper" data-href="#" id="conv-notf-show">
                                        </div>
                                    </div>
                                </li>  */}

                                    {
                                        (AUTH_USER.account_type == 'reader' || AUTH_USER.account_type == 'junior_reader') ?
                                            <li className="shopping-cart">
                                                <Link className="nav-link" to="/my-cart"><img src={funcObj.assets_path("/images/icons/shopping-cart.png")} alt="shopping-cart" /> <span className="count" id="cart_count">{cart_items}</span></Link>
                                            </li>
                                            : null
                                    }
                                    <li className="login-profile-area ">
                                        {/* <strong id="user_name">{this.state.username}</strong> */}

                                        <span>{this.state.username}</span>

                                        <a className="dropdown-toggle-1" >
                                            <div className="user-img curptr">
                                                <img id="user_img" src={profileimage} alt="" />
                                            </div>
                                        </a>
                                        <div className="dropdown-menu">
                                            <div className="dropdownmenu-wrapper">
                                                <ul>
                                                    <h5>Welcome <span style={{ fontSize: '12px' }} >({funcObj.showAccountType(AUTH_USER)})</span></h5>
                                                    {
                                                        (AUTH_USER.account_type == 'reader' || AUTH_USER.account_type == 'junior_reader') ?
                                                            <li>
                                                                <Link className="curptr" to="/reader-profile"><i className="fas fa-user"></i>My Profile</Link>
                                                            </li>
                                                            :
                                                            <li>
                                                                <Link className="curptr" to="/common-profile"><i className="fas fa-user"></i>My Profile</Link>
                                                            </li>
                                                    }

                                                    {/*<li>*/}
                                                    {/*    <Link className="curptr" to="/change-password"><i className="fas fa-cog"></i>Change Password</Link>*/}
                                                    {/*</li>*/}
                                                    {/* <li className="curptr" >
                                                    <a className="curptr" onClick={(e)=>this.logout()}><i className="fas fa-power-off"></i>Logout</a>
                                                </li> */}
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="shopping-cart"><a className="curptr" onClick={(e) => this.custom_confirm_box(e)} title="logout"><i className="fas fa-power-off"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        );
    }

    custom_confirm_box(e) {
        Swal.fire({
            title: 'Are you sure you want to exit?',
            showCancelButton: true,
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                this.logout()
            }
        })
    }



}
export default Header;

function autocomplete(inp, arr) {
    // console.log(inp,'called autocomplete',arr)
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV elementss as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        // if(arr.length == 0){
        //     b = document.createElement("DIV");
        // }
        for (i = 0; i < arr.length; i++) {

            // if (arr[i].toUpperCase().includes(val.toUpperCase())) {
                b = document.createElement("DIV");
                b.innerHTML += arr[i];
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    openSearchPage(inp.value);
                    closeAllLists();
                });
                a.appendChild(b);
            // }

        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function openSearchPage(search_text, search_for) {
    window.location = funcObj.getSitePath('library-catalog?search_text=' + search_text + '&search_for=' + search_for);
}
