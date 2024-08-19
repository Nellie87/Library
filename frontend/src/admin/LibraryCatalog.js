// import React from 'react';
// import { Link } from 'react-router-dom';
// import Functions from '../helpers/functions';
// import { withRouter } from 'react-router-dom';
// const funcObj = new Functions();
// const AUTH_USER = funcObj.getAuthUser();
// class LibraryCatalog extends React.Component {

//     constructor(props){
//         super(props);
//         this.state ={
//             books:{},
//             book_category:""       
//         };
//     }
  
//     componentDidMount(){
//         this.get_books_data();    
//     }
//     componentWillReceiveProps(){
//         console.log('componentDidMount book lists page');
//        this.get_books_data();     

//     }

//     get_books_data(){
//         let book_category = funcObj.get_query_string('q')?funcObj.get_query_string('q'):'';
//         console.log(book_category);
//         this.setState({
//             books:funcObj.get_category_books('',book_category),
//             book_category:book_category 
//         })

//         // console.log('book_category',book_category);
//         // const endPoint = '/volumes?q=kenya '+book_category;
//         // let postBodyData = {};        
//         // funcObj.commonFetchApiCall(postBodyData,endPoint).then(data => {

//         //     if(data){
//         //         this.setState({
//         //             books:data,
//         //             book_category:book_category 
//         //         })
//         //     }
            
//         // });
//     }

//     render() {
//         console.log('book lists page',this.state.books);
       
//         if(AUTH_USER != null){
//             return this.searchMiddleContent();
//         }
//         return (
//             <React.Fragment>
           
           

//                     {this.searchMiddleContent()}
                    
              
//             </React.Fragment>
//         );
//     }

//     searchMiddleContent(){
//         let margin = '-50px';
      
//         if(  AUTH_USER != null ){
//              margin = '0';
           
//         }
//         return(
//             <React.Fragment>
//                 <div className="search_container">

//                     {
//                         AUTH_USER == null ?
//                         <div className="banner text-center">
//                                             <div className="container">
//                                                 <span className="page_title"> Search</span>
//                                             </div>
//                                         </div>
//                         :
//                         null
//                     }
                   
                    
//                     <div className="container">
//                         <div className="search_wrap clearfix " style={{'marginTop':margin}}>
//                             <div className="left__bar float-left py-4 pl-4 pr-4 pr-md-0" >
//                                 <form>
//                                     <div className="menu-search-box">
//                                         <input type="text" placeholder="Search Books, Course" className="search-box w-100 m-0" />
//                                         <span className="search-icon">  <img src={funcObj.assets_path("/images/icons/search.png")} width="22" alt="search" /> </span>
//                                     </div>
//                                     <div className="search-elements mt-4">
//                                         <div className="form-group">
//                                             <div className="search-head">Types</div>
//                                             <div className="custom-checkbox">
//                                                 <input type="checkbox" name="checkbox1" id="books" />
//                                                 <label className="mr-2" htmlFor="books">E-Books</label>
//                                                 <input type="checkbox" name="checkbox1" id="audio" />
//                                                 <label className="mr-2" htmlFor="audio">Audio Books</label>
//                                                 <input type="checkbox" name="checkbox1" id="video" />
//                                                 <label className="mr-2" htmlFor="video">Video Books</label>
//                                                 <input type="checkbox" name="checkbox1" id="slides" />
//                                                 <label className="mr-2" htmlFor="slides">Slides</label>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="search-elements mt-4">
//                                         <div className="form-group">
//                                             <div className="search-head">Date Of Publication</div>
//                                             <div className="custom-date">
//                                                 <input type="date" name="date"/>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="search-elements mt-4">
//                                         <div className="form-group">
//                                             <div className="search-head">Date From</div>
//                                             <div className="custom-date">
//                                                 <input type="date" name="date_from"/>
//                                             </div>
//                                             <div className="search-head">Date To</div>
//                                             <div className="custom-date">
//                                                 <input type="date" name="date_to"/>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="search-elements mt-4">
//                                         <div className="form-group">
//                                             <div className="search-head">ISBN</div>
//                                             <div className="custom-date">
//                                                 <input type="text" name="isbn" placeholder="Search by ISBN"/>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="search-elements mt-4">
//                                         <div className="form-group">
//                                             <div className="search-head">Subject</div>
//                                             <div className="custom-date">
//                                                 <input type="text" name="subject" placeholder="Search by Subject"/>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="search-elements mt-4">
//                                         <div className="form-group">
//                                             <div className="search-head">Categories <small>View all</small> </div>
//                                             <div className="custom-checkbox checkboxHide">
//                                                 <input type="checkbox" name="checkbox1" id="fantasy" />
//                                                 <label className="mr-2" htmlFor="fantasy">Fantasy</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Adventure" />
//                                                 <label className="mr-2" htmlFor="Adventure">Adventure</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Romance" />
//                                                 <label className="mr-2" htmlFor="Romance">Romance</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Contemporary" />
//                                                 <label className="mr-2" htmlFor="Contemporary">Contemporary</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Dystopian" />
//                                                 <label className="mr-2" htmlFor="Dystopian">Dystopian</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Mystery" />
//                                                 <label className="mr-2" htmlFor="Mystery">Mystery</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Horror" />
//                                                 <label className="mr-2" htmlFor="Horror">Horror</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Thriller" />
//                                                 <label className="mr-2" htmlFor="Thriller">Thriller</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Paranormal" />
//                                                 <label className="mr-2" htmlFor="Paranormal">Paranormal</label>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="search-elements mt-4">
//                                         <div className="form-group">

//                                             <div className="search-head">Authors <small>View all</small> </div>
//                                             <div className="custom-checkbox checkboxHide">
//                                                 <input type="checkbox" name="checkbox1" id="Haddis" />
//                                                 <label className="mr-2" htmlFor="Haddis">Haddis Alemayehu</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Michael" />
//                                                 <label className="mr-2" htmlFor="Michael"> Michael Daniel Ambatchew</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Āfawarq" />
//                                                 <label className="mr-2" htmlFor="Āfawarq">Āfawarq Gabra Iyasus</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Tsegaye" />
//                                                 <label className="mr-2" htmlFor="Tsegaye">Tsegaye Gabre-Medhin</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Moges" />
//                                                 <label className="mr-2" htmlFor="Moges">Moges Kebede</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Tāddasa" />
//                                                 <label className="mr-2" htmlFor="Tāddasa">Tāddasa Lībān</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Tsehay" />
//                                                 <label className="mr-2" htmlFor="Tsehay">Tsehay Melaku</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Dinaw" />
//                                                 <label className="mr-2" htmlFor="Dinaw">Dinaw Mengestu</label>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* <div className="search-elements mt-4">
//                                         <div className="form-group">
//                                             <div className="search-head">Price Range</div>
//                                             <div class="slidecontainer">
//                                             <input type="range" min="1" max="100" value="50"/>

//                                             <input type="range" min="1" max="100" value="80" class="slider" id="myRange" />
//                                             </div>
                                            
//                                         </div>
//                                     </div> */}

//                                     <div className="search-elements mt-4">
//                                         <div className="form-group">
//                                             <div className="search-head">Publishers <small>View all</small> </div>

//                                             <div className="custom-checkbox checkboxHide">
//                                                 <input type="checkbox" name="checkbox1" id="Random" />
//                                                 <label className="mr-2" htmlFor="Random">Random House Struik</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Africa" />
//                                                 <label className="mr-2" htmlFor="Africa">Africa</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Arcane" />
//                                                 <label className="mr-2" htmlFor="Arcane">The Arcane Press</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Publishers" />
//                                                 <label className="mr-2" htmlFor="Publishers">LAPA Publishers</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Strive" />
//                                                 <label className="mr-2" htmlFor="Strive">Strive Business Magazine</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="Poets" />
//                                                 <label className="mr-2" htmlFor="Poets">Poets Printery</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="BlackLetter" />
//                                                 <label className="mr-2" htmlFor="BlackLetter">Black Letter Media (Pty) Ltd</label>
//                                                 <br></br>
//                                                 <input type="checkbox" name="checkbox1" id="University" />
//                                                 <label className="mr-2" htmlFor="University">Wits University Press</label>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
                          
//                           {this.rightSection()}
//                         </div>
//                     </div>
//                     </div>
//             </React.Fragment>
//         );
//     }

//     rightSection(){
//         let detail_page = 'e-bookdetail';
//         if(  AUTH_USER != null ){
//              detail_page = 'private-bookdetail';
//         }
//         const books = this.state.books;
//         return (
//             <React.Fragment>
//              <div className="right_bar float-left p-4">
//               {
//                   books && Object.keys(books).length > 0 ?
                 
//                                 <div className="clearfix top-head  ">
//                                     <h6 className="mb-0 mt-3 float-left">Found {Object.keys(books).length} search results</h6>
//                                     <div className="float-right">
//                                         <div className="d-flex align-items-center">
//                                             <span>Sortby</span>
//                                             <select defaultValue="week" name="  " className="mb-0 ml-3 form-control m-1 input_field">
//                                                 <option value="week">Latest</option>
//                                                 <option value="month" >Oldest</option>
//                                             </select>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 : <span>No results found. Try checking your spelling or use more general terms.</span>
//               }
//                                 <div className="books-cover row mt-5">

//                                 {
                                        
//                                         books && Object.keys(books).length > 0 ?
//                                         books.map((book, index) => {
                                        
//                                         return (
//                                         <div key={index} className="col-xl-3 col-lg-4 col-md-6 mb-3 mb-lg-5">
//                                             <div className="book-wrap-card">
//                                                 <div className="card-book">
//                                                     <Link to={`/bookdetail?book_id=`+book.id}>
//                                                         <div className="img-wrap">
//                                                             <img src={book.picture} alt="books" />
//                                                         </div>
//                                                     </Link>
//                                                     <div className="book-details">
//                                                         <p className="mb-0 mt-3">
//                                                             {book.subtitle ?
//                                                                 book.subtitle 
//                                                                 :'N/A'}
//                                                         </p>
//                                                         <div className="book-name mt-0">
//                                                         {book.title}
//                                                         </div>
//                                                         <div className="price">
//                                                             <span className="new-price">{book.price}&nbsp;{funcObj.getCurrency()}</span>
//                                                         </div>
                                                            
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         )
//                                     })
//                                     :null
//                                     }


//                                   </div>
//                             </div>
//             </React.Fragment>
//         );
//     }
// }
// export default withRouter(LibraryCatalog);


import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import { withRouter } from 'react-router-dom';

const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();

class LibraryCatalog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            book_category: '',
        };
    }

    componentDidMount() {
        this.getBooksData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.search !== prevProps.location.search) {
            this.getBooksData();
        }
    }

    getBooksData() {
        const book_category = funcObj.get_query_string('q') || '';
        this.setState({ book_category });

        // Example API endpoint, replace with your actual API URL
        const endPoint = `/api/books?q=${book_category}`;
        
        funcObj.commonFetchApiCall({}, endPoint).then(data => {
            if (data) {
                this.setState({ books: data });
            }
        }).catch(error => {
            console.error('Error fetching books data:', error);
        });
    }

    render() {
        if (AUTH_USER) {
            return this.renderContent();
        }
        return (
            <React.Fragment>
                {this.renderContent()}
            </React.Fragment>
        );
    }

    renderContent() {
        const { books } = this.state;
        let margin = AUTH_USER ? '0' : '-50px';
        let detailPage = AUTH_USER ? 'private-bookdetail' : 'e-bookdetail';

        return (
            <React.Fragment>
                <div className="search_container">
                    {!AUTH_USER && (
                        <div className="banner text-center">
                            <div className="container">
                                <span className="page_title">Search</span>
                            </div>
                        </div>
                    )}

                    <div className="container">
                        <div className="search_wrap clearfix" style={{ marginTop: margin }}>
                            <div className="left__bar float-left py-4 pl-4 pr-4 pr-md-0">
                                <form>
                                    <div className="menu-search-box">
                                        <input
                                            type="text"
                                            placeholder="Search Books, Course"
                                            className="search-box w-100 m-0"
                                        />
                                        <span className="search-icon">
                                            <img
                                                src={funcObj.assets_path("/images/icons/search.png")}
                                                width="22"
                                                alt="search"
                                            />
                                        </span>
                                    </div>
                                    {/* Filter by type */}
                                    <div className="search-elements mt-4">
                                        <div className="form-group">
                                            <div className="search-head">Types</div>
                                            <div className="custom-checkbox">
                                                <input type="checkbox" name="type" id="books" />
                                                <label className="mr-2" htmlFor="books">E-Books</label>
                                                <input type="checkbox" name="type" id="audio" />
                                                <label className="mr-2" htmlFor="audio">Audio Books</label>
                                                <input type="checkbox" name="type" id="video" />
                                                <label className="mr-2" htmlFor="video">Video Books</label>
                                                <input type="checkbox" name="type" id="slides" />
                                                <label className="mr-2" htmlFor="slides">Slides</label>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Filter by publication date */}
                                    <div className="search-elements mt-4">
                                        <div className="form-group">
                                            <div className="search-head">Date Of Publication</div>
                                            <div className="custom-date">
                                                <input type="date" name="date" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Filter by date range */}
                                    <div className="search-elements mt-4">
                                        <div className="form-group">
                                            <div className="search-head">Date From</div>
                                            <div className="custom-date">
                                                <input type="date" name="date_from" />
                                            </div>
                                            <div className="search-head">Date To</div>
                                            <div className="custom-date">
                                                <input type="date" name="date_to" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Filter by ISBN */}
                                    <div className="search-elements mt-4">
                                        <div className="form-group">
                                            <div className="search-head">ISBN</div>
                                            <div className="custom-date">
                                                <input type="text" name="isbn" placeholder="Search by ISBN" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Filter by subject */}
                                    <div className="search-elements mt-4">
                                        <div className="form-group">
                                            <div className="search-head">Subject</div>
                                            <div className="custom-date">
                                                <input type="text" name="subject" placeholder="Search by Subject" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Filter by categories */}
                                    <div className="search-elements mt-4">
                                        <div className="form-group">
                                            <div className="search-head">Categories <small>View all</small></div>
                                            <div className="custom-checkbox checkboxHide">
                                                <input type="checkbox" name="category" id="fantasy" />
                                                <label className="mr-2" htmlFor="fantasy">Fantasy</label>
                                                <br />
                                                <input type="checkbox" name="category" id="adventure" />
                                                <label className="mr-2" htmlFor="adventure">Adventure</label>
                                                <br />
                                                <input type="checkbox" name="category" id="romance" />
                                                <label className="mr-2" htmlFor="romance">Romance</label>
                                                <br />
                                                <input type="checkbox" name="category" id="contemporary" />
                                                <label className="mr-2" htmlFor="contemporary">Contemporary</label>
                                                <br />
                                                <input type="checkbox" name="category" id="dystopian" />
                                                <label className="mr-2" htmlFor="dystopian">Dystopian</label>
                                                <br />
                                                <input type="checkbox" name="category" id="mystery" />
                                                <label className="mr-2" htmlFor="mystery">Mystery</label>
                                                <br />
                                                <input type="checkbox" name="category" id="horror" />
                                                <label className="mr-2" htmlFor="horror">Horror</label>
                                                <br />
                                                <input type="checkbox" name="category" id="thriller" />
                                                <label className="mr-2" htmlFor="thriller">Thriller</label>
                                                <br />
                                                <input type="checkbox" name="category" id="paranormal" />
                                                <label className="mr-2" htmlFor="paranormal">Paranormal</label>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Filter by authors */}
                                    <div className="search-elements mt-4">
                                        <div className="form-group">
                                            <div className="search-head">Authors <small>View all</small></div>
                                            <div className="custom-checkbox checkboxHide">
                                                <input type="checkbox" name="author" id="haddis" />
                                                <label className="mr-2" htmlFor="haddis">Haddis Alemayehu</label>
                                                <br />
                                                <input type="checkbox" name="author" id="michael" />
                                                <label className="mr-2" htmlFor="michael">Michael Daniel Ambatchew</label>
                                                <br />
                                                <input type="checkbox" name="author" id="afawarq" />
                                                <label className="mr-2" htmlFor="afawarq">Āfawarq Gabra Iyasus</label>
                                                <br />
                                                <input type="checkbox" name="author" id="tsegaye" />
                                                <label className="mr-2" htmlFor="tsegaye">Tsegaye Gabre-Medhin</label>
                                                <br />
                                                <input type="checkbox" name="author" id="moges" />
                                                <label className="mr-2" htmlFor="moges">Moges Kebede</label>
                                                <br />
                                                <input type="checkbox" name="author" id="taddasa" />
                                                <label className="mr-2" htmlFor="taddasa">Tāddasa Lībān</label>
                                                <br />
                                                <input type="checkbox" name="author" id="tsehay" />
                                                <label className="mr-2" htmlFor="tsehay">Tsehay Melaku</label>
                                                <br />
                                                <input type="checkbox" name="author" id="dinaw" />
                                                <label className="mr-2" htmlFor="dinaw">Dinaw Mengestu</label>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Filter by publishers */}
                                    <div className="search-elements mt-4">
                                        <div className="form-group">
                                            <div className="search-head">Publishers</div>
                                            <div className="custom-checkbox checkboxHide">
                                                <input type="checkbox" name="publisher" id="publisher1" />
                                                <label className="mr-2" htmlFor="publisher1">Publisher 1</label>
                                                <br />
                                                <input type="checkbox" name="publisher" id="publisher2" />
                                                <label className="mr-2" htmlFor="publisher2">Publisher 2</label>
                                                <br />
                                                <input type="checkbox" name="publisher" id="publisher3" />
                                                <label className="mr-2" htmlFor="publisher3">Publisher 3</label>
                                                <br />
                                                <input type="checkbox" name="publisher" id="publisher4" />
                                                <label className="mr-2" htmlFor="publisher4">Publisher 4</label>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Filter by countries */}
                                    <div className="search-elements mt-4">
                                        <div className="form-group">
                                            <div className="search-head">Countries</div>
                                            <div className="custom-checkbox checkboxHide">
                                                <input type="checkbox" name="country" id="ethiopia" />
                                                <label className="mr-2" htmlFor="ethiopia">Ethiopia</label>
                                                <br />
                                                <input type="checkbox" name="country" id="kenya" />
                                                <label className="mr-2" htmlFor="kenya">Kenya</label>
                                                <br />
                                                <input type="checkbox" name="country" id="uganda" />
                                                <label className="mr-2" htmlFor="uganda">Uganda</label>
                                                <br />
                                                <input type="checkbox" name="country" id="tanzania" />
                                                <label className="mr-2" htmlFor="tanzania">Tanzania</label>
                                                <br />
                                                <input type="checkbox" name="country" id="rwanda" />
                                                <label className="mr-2" htmlFor="rwanda">Rwanda</label>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Filter by languages */}
                                    <div className="search-elements mt-4">
                                        <div className="form-group">
                                            <div className="search-head">Languages</div>
                                            <div className="custom-checkbox checkboxHide">
                                                <input type="checkbox" name="language" id="english" />
                                                <label className="mr-2" htmlFor="english">English</label>
                                                <br />
                                                <input type="checkbox" name="language" id="french" />
                                                <label className="mr-2" htmlFor="french">French</label>
                                                <br />
                                                <input type="checkbox" name="language" id="swahili" />
                                                <label className="mr-2" htmlFor="swahili">Swahili</label>
                                                <br />
                                                <input type="checkbox" name="language" id="amharic" />
                                                <label className="mr-2" htmlFor="amharic">Amharic</label>
                                                <br />
                                                <input type="checkbox" name="language" id="somali" />
                                                <label className="mr-2" htmlFor="somali">Somali</label>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="search-content float-right py-4 pl-4 pl-md-0">
                                <div className="row">
                                    {books.map((book, index) => (
                                        <div className="col-lg-4 col-md-6" key={index}>
                                            <div className="book-item">
                                                <div className="book-img">
                                                    <img
                                                        src={book.image || 'path/to/default/image.jpg'}
                                                        alt={book.title}
                                                        className="img-fluid"
                                                    />
                                                </div>
                                                <div className="book-details">
                                                    <h3>{book.title}</h3>
                                                    <p>{book.author}</p>
                                                    <p>{book.publishedDate}</p>
                                                    <Link to={`/${detailPage}/${book.id}`}>View Details</Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(LibraryCatalog);
