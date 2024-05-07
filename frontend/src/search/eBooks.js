import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class Search extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            books:{}       
        };
    }
  
    componentDidMount(){
        let politics_books = funcObj.politics_books();
      
        
        const endPoint = '/volumes?q=kenya ebooks';
        let postBodyData = {
            
        };
        
        funcObj.commonFetchApiCall(postBodyData,endPoint).then(data => {
            this.setState({
                books:data,
            })
        });

    }

    render() {
        if(AUTH_USER != null){
            return this.searchMiddleContent();
        }
        return (
            <React.Fragment>
           
           

                    {this.searchMiddleContent()}
                    
              
            </React.Fragment>
        );
    }

    searchMiddleContent(){
        let margin = '-50px';
      
        if(  AUTH_USER != null ){
             margin = '0';
           
        }
        return(
            <React.Fragment>
                <div className="search_container">

                    {
                        AUTH_USER == null ?
                        <div className="banner text-center">
                                            <div className="container">
                                                <span className="page_title"> E-Books</span>
                                            </div>
                                        </div>
                        :
                        null
                    }
                   
                    
                    <div className="container">
                        <div className="search_wrap clearfix " style={{'marginTop':margin}}>
                            <div className="left__bar float-left py-4 pl-4 pr-4 pr-md-0" >
                                <form>
                                    <div className="menu-search-box">
                                        <input type="text" placeholder="Search Books, Course" className="search-box w-100 m-0" />
                                        <span className="search-icon">  <img src={funcObj.assets_path("/images/icons/search.png")} width="22" alt="search" /> </span>
                                    </div>
                                    <div className="search-elements mt-4">
                                        <div className="form-group">
                                            <div className="search-head">Date Of Publication</div>
                                            <div className="custom-date">
                                                <input type="date" name="date"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="search-elements mt-4">
                                        <div className="form-group">
                                            <div className="search-head">Date From</div>
                                            <div className="custom-date">
                                                <input type="date" name="date_from"/>
                                            </div>
                                            <div className="search-head">Date To</div>
                                            <div className="custom-date">
                                                <input type="date" name="date_to"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="search-elements mt-4">
                                        <div className="form-group">
                                            <div className="search-head">ISBN</div>
                                            <div className="custom-date">
                                                <input type="text" name="isbn" placeholder="Search by ISBN"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="search-elements mt-4">
                                        <div className="form-group">
                                            <div className="search-head">Subject</div>
                                            <div className="custom-date">
                                                <input type="text" name="subject" placeholder="Search by Subject"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="search-elements mt-4">
                                        <div className="form-group">
                                            <div className="search-head">Classes</div>
                                            <div className="custom-checkbox">
                                                <input type="checkbox" name="checkbox1" id="books" />
                                                <label className="mr-2" htmlFor="books">E-Books</label>
                                                <input type="checkbox" name="checkbox1" id="audio" />
                                                <label className="mr-2" htmlFor="audio">Audio Books</label>
                                                <input type="checkbox" name="checkbox1" id="video" />
                                                <label className="mr-2" htmlFor="video">Video Books</label>
                                                <input type="checkbox" name="checkbox1" id="slides" />
                                                <label className="mr-2" htmlFor="slides">Slides</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="search-elements mt-4">
                                        <div className="form-group">
                                            <div className="search-head">Categories <small>View all</small> </div>
                                            <div className="custom-checkbox checkboxHide">
                                                <input type="checkbox" name="checkbox1" id="fantasy" />
                                                <label className="mr-2" htmlFor="fantasy">Fantasy</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Adventure" />
                                                <label className="mr-2" htmlFor="Adventure">Adventure</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Romance" />
                                                <label className="mr-2" htmlFor="Romance">Romance</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Contemporary" />
                                                <label className="mr-2" htmlFor="Contemporary">Contemporary</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Dystopian" />
                                                <label className="mr-2" htmlFor="Dystopian">Dystopian</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Mystery" />
                                                <label className="mr-2" htmlFor="Mystery">Mystery</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Horror" />
                                                <label className="mr-2" htmlFor="Horror">Horror</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Thriller" />
                                                <label className="mr-2" htmlFor="Thriller">Thriller</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Paranormal" />
                                                <label className="mr-2" htmlFor="Paranormal">Paranormal</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="search-elements mt-4">
                                        <div className="form-group">

                                            <div className="search-head">Authors <small>View all</small> </div>
                                            <div className="custom-checkbox checkboxHide">
                                                <input type="checkbox" name="checkbox1" id="Haddis" />
                                                <label className="mr-2" htmlFor="Haddis">Haddis Alemayehu</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Michael" />
                                                <label className="mr-2" htmlFor="Michael"> Michael Daniel Ambatchew</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Āfawarq" />
                                                <label className="mr-2" htmlFor="Āfawarq">Āfawarq Gabra Iyasus</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Tsegaye" />
                                                <label className="mr-2" htmlFor="Tsegaye">Tsegaye Gabre-Medhin</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Moges" />
                                                <label className="mr-2" htmlFor="Moges">Moges Kebede</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Tāddasa" />
                                                <label className="mr-2" htmlFor="Tāddasa">Tāddasa Lībān</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Tsehay" />
                                                <label className="mr-2" htmlFor="Tsehay">Tsehay Melaku</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Dinaw" />
                                                <label className="mr-2" htmlFor="Dinaw">Dinaw Mengestu</label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="search-elements mt-4">
                                        <div className="form-group">
                                            <div className="search-head">Price Range</div>
                                            <div class="slidecontainer">
                                            <input type="range" min="1" max="100" value="50"/>

                                            <input type="range" min="1" max="100" value="80" class="slider" id="myRange" />
                                            </div>
                                            
                                        </div>
                                    </div> */}

                                    <div className="search-elements mt-4">
                                        <div className="form-group">
                                            <div className="search-head">Publishers <small>View all</small> </div>

                                            <div className="custom-checkbox checkboxHide">
                                                <input type="checkbox" name="checkbox1" id="Random" />
                                                <label className="mr-2" htmlFor="Random">Random House Struik</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Africa" />
                                                <label className="mr-2" htmlFor="Africa">Africa</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Arcane" />
                                                <label className="mr-2" htmlFor="Arcane">The Arcane Press</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Publishers" />
                                                <label className="mr-2" htmlFor="Publishers">LAPA Publishers</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Strive" />
                                                <label className="mr-2" htmlFor="Strive">Strive Business Magazine</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="Poets" />
                                                <label className="mr-2" htmlFor="Poets">Poets Printery</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="BlackLetter" />
                                                <label className="mr-2" htmlFor="BlackLetter">Black Letter Media (Pty) Ltd</label>
                                                <br></br>
                                                <input type="checkbox" name="checkbox1" id="University" />
                                                <label className="mr-2" htmlFor="University">Wits University Press</label>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                          
                          {this.rightSection()}
                        </div>
                    </div>
                    </div>
            </React.Fragment>
        );
    }

    rightSection(){
        let detail_page = 'e-bookdetail';
        if(  AUTH_USER != null ){
             detail_page = 'private-bookdetail';
        }
        const books = this.state.books;
        return (
            <React.Fragment>
                  <div className="right_bar float-left p-4">
                                <div className="clearfix top-head  ">
                                    <h6 className="mb-0 mt-3 float-left">Found 9 search results</h6>
                                    <div className="float-right">
                                        <div className="d-flex align-items-center">
                                            <span>Sortby</span>
                                            <select defaultValue="week" name="  " className="mb-0 ml-3 form-control m-1 input_field">
                                                <option value="week">Latest</option>
                                                <option value="month" >Oldest</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="books-cover row mt-5">

                                {
                                        
                                        books && books.items && Object.keys(books.items).length > 0 ?
                                        books.items.map((book, index) => {
                                        
                                        return (
                                        <div key={index} className="col-xl-3 col-lg-4 col-md-6 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <Link to={`bookdetail/`+book.id}>
                                                        <div className="img-wrap">
                                                            <img src={book.volumeInfo.imageLinks.thumbnail} alt="books" />
                                                        </div>
                                                    </Link>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            {book.volumeInfo.publisher ?
                                                                book.volumeInfo.publisher 
                                                                :'N/A'}
                                                        </p>
                                                        <div className="book-name mt-0">
                                                        {book.volumeInfo.title}
                                                        </div>
                                                        {
                                                            book.saleInfo && book.saleInfo.saleability && book.saleInfo.saleability == "FOR_SALE" ?
                                                            <div className="price">
                                                            <span className="new-price">{book.saleInfo.retailPrice.amount}&nbsp;{funcObj.getCurrency()}</span>
                                                        </div>
                                                            :
                                                           <span>Not for sale</span>

                                                        }
                                                       
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        )
                                    })
                                    :null
                                    }


                                    <Link to={detail_page} className="col-xl-3 col-lg-4 col-md-6 mb-3 mb-lg-5">
                                        <div className="book-wrap-card">
                                            <div className="card-book">
                                                <div className="img-wrap">
                                                    <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                                    <div className="favorite-cart">
                                                        <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30"  alt="favorite" />
                                                        <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30"  alt="cart" />
                                                    </div>
                                                </div>
                                                <div className="book-details">
                                                    <div className="book-name">
                                                        The House of Hunger
                                                        </div>
                                                    <p>
                                                        Dambudzo Marechera
                                                        </p>
                                                    <div className="book-rating">
                                                        <i className="fa fa-star" aria-hidden="true"></i>
                                                        <i className="fa fa-star" aria-hidden="true"></i>
                                                        <i className="fa fa-star" aria-hidden="true"></i>
                                                        <i className="fa fa-star" aria-hidden="true"></i>
                                                        <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                        <span>4.5</span>
                                                    </div>
                                                    <div className="price">
                                                        <span className="old-price">250</span>
                                                        <span className="new-price">149 {funcObj.getCurrency()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                  </div>
                            </div>
            </React.Fragment>
        );
    }
}
