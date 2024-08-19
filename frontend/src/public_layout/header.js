import React from 'react';
import { Link } from "react-router-dom";
import Functions from "../helpers/functions";
import SsologinButton from '../public_pages/ssoLogin';
import Swal from "sweetalert2";

const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();

export default class PublicHeader extends React.Component {
    constructor(props) {
        super(props);
        let search_text = funcObj.get_query_string('search_text');
        this.state = {
            classes: {},
            suggesion_list: ["sample"],
            search_text: search_text      
        };
        this.setClasses = this.setClasses.bind(this);
    }

    quickSearch(e) {
        let search_text = document.getElementById('searchInp').value;
        window.location = funcObj.getSitePath('dbooks?search_text=' + search_text);
    }

    componentDidMount(){
        this.setClasses();
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

    callSearch(e, classes) {
        e.preventDefault();
        funcObj.callSearch(classes);
    }

    setClasses(){        
        const endPoint = 'get-contents-classes-public';
        let postBodyData = {};

        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            if (data && data.code == 200 && data.data) {
                this.setState({ classes: data.data });
            }
        });
    }

    onchangeSearchFor(event) {
        if (event.target.value == 'advanced') {
            openSearchPage("", 'advanced');
        }
    }
       
    onChangeSearchInput(event, suggestion_list) {
        if(event.key === "Enter"){
            openSearchPage(event.target.value)
        }
        
        const listPromise = this.setSuggestionList();
        listPromise.then(response => {
            if (response.code == 200) {
                const suggesion_list = response.data;
                if (document.getElementById("searchInp")) {
                    autocomplete(document.getElementById("searchInp"), suggesion_list);
                }
            } else {
                autocomplete(document.getElementById("searchInp"), []);
            }
        });
    }

    logout() {
        let user = funcObj.getLocalStorage('user');
        let postBodyData = {
            "email": user.email
        };
        let endPoint = 'logout';
        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            if (data.code == 200) {
                this.setState({});
                funcObj.removeLocalStorage('user');
                window.location.href = funcObj.getSitePath("home");
            }
        });
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
    };

    quickSearchBtn(e, searchInp) {
        let searchVal = '';
        if (document.getElementById(searchInp)) {
            searchVal = document.getElementById(searchInp).value;
        }
        let search_for = 'all';
        if (document.getElementById('search_for')) {
            search_for = document.getElementById('search_for').value;
        }
        openSearchPage(searchVal, search_for);
    }
    handleLoginClick(e) {
        e.preventDefault();
        this.loaderView("show"); // Show the loader
        
        // Simulate an async operation (e.g., API call)
        setTimeout(() => {
            // You can replace this with actual login logic if necessary
            window.location.href = funcObj.getSitePath("login");
            this.loaderView("hide"); // Hide the loader
        }, 1000); // Simulate delay for demonstration
    }

    render() {
        let search_for = funcObj.get_query_string('search_for');
        let cart_items_length = funcObj.get_cart_items_length();
        let login_dash = 'login';
    
        if (AUTH_USER != null) {
            switch (AUTH_USER.account_type) {
                case 'reader':
                case 'junior_reader':
                    login_dash = 'reader-dashboard';
                    break;
                case 'publisher':
                    login_dash = 'publisher-dashboard';
                    break;
                case 'admin':
                    login_dash = 'admin-dashboard';
                    break;
                case 'staff':
                    login_dash = 'staff-dashboard';
                    break;
                default:
                    login_dash = 'login';
            }
        }
    
        return (
            <React.Fragment>
    <nav className="navbar navbar-expand-lg my-header py-3 bg-white position-relative">
        <div className="container">
            <Link className="admin-logo" to="/home">
                <img className="main_logo" src={funcObj.get_logo()} alt="knls logo" />
            </Link>
            
            <button 
                className="navbar-toggler" 
                type="button" 
                data-toggle="collapse" 
                data-target="#navbarSupportedContent" 
                aria-controls="navbarSupportedContent" 
                aria-expanded="false" 
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
                <span className="navbar-toggler-icon"></span>
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto public_page">
                    <li className="nav-item dropdown">
                        <div className="right_wrap pl-0 pl-md-4">
                            <div className='row header_search_bar public_search'>
                                <div className="customs_wrapper d-flex">
                                    <div className="search_box d-flex">
                                        <div className="dropdown">
                                            <select 
                                                name='search_for' 
                                                defaultValue={search_for} 
                                                id='search_for' 
                                                aria-label="Search by" 
                                                onChange={(e) => this.onchangeSearchFor(e)}
                                            >
                                                {Object.keys(funcObj.headerSearchOptions()).map((key) => (
                                                    <option key={key} value={key}>
                                                        {funcObj.headerSearchOptions()[key]}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="search_field">
                                            <input 
                                                type="text"
                                                name="searchInp"
                                                id="searchInp"
                                                placeholder="Search content"
                                                className="input"
                                                autoComplete="off"
                                                onPaste={(e) => this.onChangeSearchInput(e, this.state.suggesion_list)}
                                                onKeyPress={(e) => this.onChangeSearchInput(e, this.state.suggesion_list)}
                                                onKeyUp={(e) => this.onChangeSearchInput(e, this.state.suggesion_list)}
                                                defaultValue={this.state.search_text}
                                            />
                                            <i onClick={(e) => this.quickSearchBtn(e, "searchInp")} className="fas fa-search"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li className="nav-item dropdown library-dropdown">
                        <Link 
                            className="nav-link dropdown-toggle" 
                            to="#" 
                            id="navbarDropdown" 
                            role="button" 
                            data-toggle="dropdown" 
                            aria-haspopup="true" 
                            aria-expanded="false"
                        >
                            Library
                        </Link>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            {this.state.classes && Object.keys(this.state.classes).length > 0 ? (
                                this.state.classes.map((classd, index) => (
                                    <React.Fragment key={index}>
                                        <Link 
                                            className="dropdown-item" 
                                            to="" 
                                            onClick={(e) => this.callSearch(e, classd.class_id)}
                                        >
                                            {classd.class_name}
                                        </Link>
                                    </React.Fragment>
                                ))
                            ) : null}
                        </div>
                    </li>

                    <li className="nav-item px-0 mx-0 d-none d-lg-block">
                        <Link className="nav-link disabled" to="#">|</Link>
                    </li>

                    {AUTH_USER == null || (AUTH_USER.account_type === 'reader' || AUTH_USER.account_type === 'junior_reader') ? (
                        <li className="nav-item d-lg-block shopping-cart">
                            <Link className="nav-link" to="/shopping-cart">
                                <img src={funcObj.assets_path("/images/icons/shopping-cart.png")} alt="shopping-cart" />
                                <span className="count" id="cart_count">{cart_items_length}</span>
                            </Link>
                        </li>
                    ) : null}

                    {AUTH_USER == null ? (
                       
                        <li className="nav-item">
                        <Link className="nav-link to_login bordered-link px-4 btn-signup" to={login_dash}>
                            {AUTH_USER != null ? "Dashboard" : "Login"}
                        </Link>
                    </li>
                    ) : (
                        <React.Fragment>
                            <li className="nav-item mg-w login-profile-area">
                                <span>
                                    <i className="fas fa-user-circle">
                                        <p>{AUTH_USER.user.username}</p>
                                    </i>
                                </span>
                            </li>
                            <li className="nav-item mg-w">
                                <Link className="nav-link" to="" onClick={(e) => this.custom_confirm_box(e)}>Logout</Link>
                            </li>
                            <li className="nav-item mg-w">
                                <Link className="nav-link" to={login_dash}>My Account</Link>
                            </li>
                        </React.Fragment>
                    )}
                    {
                                      AUTH_USER == null ?
                                      <li>
                                      <Link className="nav-link bordered-link px-4 btn-signup to_register" to="registration">
                                          Register
                                      </Link>
                                  </li>
                                         : null
                                  }
                </ul>
            </div>
        </div>
    </nav>
            </React.Fragment>

        );
    }
}



function autocomplete(inp, arr) {
    // console.log(inp,'called autocomplete',arr)
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
     
        //   if (arr[i].toUpperCase().includes(val.toUpperCase())) {
            b = document.createElement("DIV");
            b.innerHTML += arr[i];
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            b.addEventListener("click", function(e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                openSearchPage(inp.value);
                closeAllLists();
            });
            a.appendChild(b);
        //   }
       
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
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

  function openSearchPage(search_text='',search_for='') {
    // window.location = funcObj.getSitePath('dbooks?search_text=' + search_text);
    window.location = funcObj.getSitePath('dbooks?search_text=' + search_text + '&search_for=' + search_for);
  }