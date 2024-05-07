import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import Pagination from 'react-js-pagination';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
class PublicBookList extends React.Component {

    constructor(props) {
        super(props);
        let search_text = funcObj.get_query_string('search_text');
        this.state = {
            books: {},
            class: '',
            book_category: "",
            books_types: [],
            authors: '',
            publishers: '',
            categories: '',
            sub_categories: '',
            books_types: [],
            publishing_year: '',
            to_date: '',
            from_date: '',
            filter: [],
            search_content: search_text,
            sort_by: 'desc',
            classes: "",
            per_page_limit: funcObj.default_perpage,
            current_page: 1,
            total_records: 0,
        };
        this.onchangepublishing_year = this.onchangepublishing_year.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    componentDidMount() {
        let book_id = funcObj.get_query_string('q');

        this.setState({
            class: book_id
        });
        this.get_book_filter();
    }
    componentWillReceiveProps() {
        this.getContents();
    }
    onchangepublishing_year(e) {
        this.getContents();
    }
    search(e) {

        this.getContents();
    }
    handlePageChange(page_number) {
        this.getContents(page_number);
    }
    onChangeAnyCat(e){
        document.getElementById('custom_categories').value ="";
        document.getElementById('any_text').classList.add('normal_text_selected_bold');
        const type = 'categories';
        var checkboxes = document.getElementsByName(type + '_checkboxes[]');
        var field_values = "";

        for (var i = 0, n = checkboxes.length; i < n; i++) {
            const data_field_id = checkboxes[i].getAttribute("data-field-id");
            if (document.getElementById(type + data_field_id).classList.contains('normal_text_selected_bold')) {
                    document.getElementById(type + data_field_id).classList.remove('normal_text_selected_bold');
                }
        }
        document.getElementById('custom_' + type).value = "";
        this.getContents();
    }
    onchangecategory(e) {
        const field_id = e.target.id;
        const type = document.getElementById(field_id).getAttribute("data-type");
        var checkboxes = document.getElementsByName(type + '_checkboxes[]');
        var field_values = "";

        for (var i = 0, n = checkboxes.length; i < n; i++) {

            const data_field_id = checkboxes[i].getAttribute("data-field-id");
            if (checkboxes[i].checked) {
                field_values += "," + checkboxes[i].value;
                document.getElementById(type + data_field_id).classList.add('normal_text_selected_bold');
            } else {
                if (document.getElementById(type + data_field_id).classList.contains('normal_text_selected_bold')) {
                    document.getElementById(type + data_field_id).classList.remove('normal_text_selected_bold');
                }
            }
        }
        if(document.getElementById('any_text').classList.contains('normal_text_selected_bold')){
            document.getElementById('any_text').classList.remove('normal_text_selected_bold');
        }
        if (field_values) field_values = field_values.substring(1);
        document.getElementById('custom_' + type).value = field_values;

        this.getContents();
    }

    handleOnchangeSource(event) {
        this.getContents();
    }

    date(e) {
        const to_date = document.getElementById('to_date').value;
        const from_date = document.getElementById('from_date').value;
        if (to_date != '' && from_date != '') {
            this.setState({ to_date, from_date });
            this.getContents();
        }
        console.log(from_date, to_date);
    }

    onchangeType(event) {
        // let vl = e.target.value;
        // let vlchecked = e.target.id;
        // let books_types = [];

        // // alert(vl);
        // if (document.getElementById(vlchecked).checked) {
        //     books_types = this.state.books_types.concat(vl);
        // } else {
        //     books_types = [...this.state.books_types]; // make a separate copy of the array
        //     let index = books_types.indexOf(vl)
        //     if (index !== -1) {
        //         books_types.splice(index, 1);
        //     }
        // }

        var category_id = event.target.value;
        var books_types = { ...this.state.books_types }
        if (event.target.checked) {
            books_types[category_id] = 1;
        } else {
            // delete books_types.[category_id];
        }

        document.getElementById('custom_classes').value = books_types;

        this.getContents();
    }





    get_book_filter() {
        const endPoint = 'common/filter-web';
        let postBodyData = {
            'web':true
        };
        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            // console.log('Book filter List ',data.data);
            if (data) {
                this.setState({
                    filter: data.data.filter
                })

                if (this.state.filter && Object.keys(this.state.filter).length > 0) {
                    this.getContents();
                }

            }

        });
    }
  

    getContents(page_no = "") {
        console.log('getContents')
        const publishing_year = document.getElementById('publishing_year') ? document.getElementById('publishing_year').value : "";
        const search_content = document.getElementById('search_content') ? document.getElementById('search_content').value : "";
        const authors = document.getElementById('custom_authors') ? document.getElementById('custom_authors').value : "";
        const publishers = document.getElementById('custom_publishers') ? document.getElementById('custom_publishers').value : "";
        const categories = document.getElementById('custom_categories') ? document.getElementById('custom_categories').value : "";
        const sub_categories = document.getElementById('custom_sub_category') ? document.getElementById('custom_sub_category').value : "";
        const custom_classes = document.getElementById('custom_classes') ? document.getElementById('custom_classes').value : "";
        const sort_by = document.getElementById('sort_by') ? document.getElementById('sort_by').value : 'desc';
        const search_for = document.getElementById('search_for') ? document.getElementById('search_for').value : "";
        console.log('get content class', this.state.class);
        let postBodyData = {
            current_page: page_no != "" ? page_no : this.state.current_page,
            per_page_limit: this.state.per_page_limit,
            classes: (custom_classes != '') ? custom_classes : this.state.class,
            sort_by: sort_by,
            search_text: search_content,
            search_for: search_for,
            sub_categories: sub_categories,
            "categories": categories,
            "author": authors,
            "publisher": publishers,
            "publishing_year": publishing_year,
            "isbn": "",
            "content_type": ""
        };
        console.log('postBodyData', postBodyData)
        let endPoint = 'get-public-library';
        funcObj.commonFetchApiCall(postBodyData, endPoint).then(response => {
            // console.log('get-contents response',response)

            return new Promise((resolve, reject) => {
                if (Object.keys(response.data).length > 0) {
                    resolve(response);
                }

            }).then(response => {

                if (response.code == 200) {
                    this.setState({
                        contents: response.data.data,
                        total_records: response.data.total,
                        current_page: page_no != "" ? page_no : this.state.current_page,
                        per_page_limit: this.state.per_page_limit,
                        class_id: custom_classes,
                        sort_by: sort_by,
                        search_text: search_content,
                        search_for: search_for,
                        "categories": categories,
                        "author": authors,
                        "publisher": publishers,
                        "publishing_year": publishing_year,
                        "isbn": "",
                        "content_type": ""
                    });

                } else if (response.code == 201) {
                    Swal.fire({
                        title: '',
                        text: response.message,
                        icon: 'error',
                        showConfirmButton: false,
                    })
                }

            })

        });
    }


    render() {

        // console.log('books_types page', book_id);

        // if (AUTH_USER != null) {
        //     return this.searchMiddleContent();
        // }
        return (
            <React.Fragment>
                {this.searchMiddleContent()}
            </React.Fragment>
        );
    }

    searchMiddleContent() {
        let q = funcObj.get_query_string('q');
        let margin = '-50px';
        // let is_authenticated = 'not_authenticate';
        // if (AUTH_USER != null) {
        //     margin = '0';
        //     is_authenticated = 'authenticated';
        // }
        return (
            <React.Fragment>
                <input type="hidden" id="custom_classes" value={this.state.class} />
                <input type="hidden" id="custom_publishers" />
                <input type="hidden" id="custom_authors" />
                <input type="hidden" id="custom_categories" />
                <input type="hidden" id="custom_sub_category" />
                <div className="search_container">

                    {
                        AUTH_USER == null ?
                            <div className="banner text-center">
                                <div className="container">
                                    <span className="page_title"> Search</span>
                                </div>
                            </div>
                            :
                            null
                    }


                    <div className={`container `}>
                        <div className="search_wrap clearfix " style={{ 'marginTop': margin }}>
                            <div className="left__bar float-left py-4 pl-4 pr-4 pr-md-0" >
                                <form>
                                    <div className="menu-search-box">
                                        <input type="text" placeholder="Search content" className="search-box w-100 m-0" id="search_content" defaultValue={this.state.search_content} onBlur={(e) => this.search(e)} />
                                        <span className="search-icon">  <img src={funcObj.assets_path("/images/icons/search.png")} width="22" alt="search" /> </span>
                                    </div>

                                    {
                                        this.state.filter.map((list, index) => {

                                            if (list.field_key == 'date_of_publication') {
                                                return (
                                                    <React.Fragment key={index}>
                                                        <div className="search-elements mt-4">
                                                            <div className="form-group">
                                                                <div className="search-head">{list.field_name}
                                                                    {/* <small>View all</small>*/}
                                                                </div>

                                                                <div className="custom-date">
                                                                    <select className="search-box w-100 m-0" onBlur={(e) => this.onchangepublishing_year(e)} defaultValue={this.state.publishing_year} name="publishing_year" id="publishing_year" >
                                                                        <option value="">Year</option>
                                                                        {

                                                                            list.field_data.map((field, index) => {
                                                                                return (<option key={index} value={field.publishing_year}>{field.publishing_year}</option>);
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>

                                                            </div>
                                                        </div>
                                                        {/* <div className="search-elements mt-4">
                                                            <div className="form-group">
                                                                <div className="search-head">Date From</div>
                                                                <div className="custom-date">
                                                                    <input type="date" name="date_from"  onBlur={(e) => this.date(e)} defaultValue={this.state.from_date} id="from_date"/>
                                                                </div>
                                                                <div className="search-head">Date To</div>
                                                                <div className="custom-date">
                                                                    <input type="date" name="date_to"  onBlur={(e) => this.date(e)} defaultValue={this.state.to_date} id="to_date"/>
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                    </React.Fragment>
                                                );
                                            }
                                            else {

                                                return (
                                                    <React.Fragment key={index}>
                                                        <div className="search-elements mt-4">
                                                            <div className="form-group">
                                                                <div className="search-head">{list.field_name} </div>
                                                                <div className="custom-checkbox checkboxHide">
                                                                    {

                                                                        list.field_data.map((fields, index) => {
                                                                            let selected = '';
                                                                            if (list.field_key == 'classes') {
                                                                                console.log('normal text', q);
                                                                                selected = (q == fields.id) ? 'normal_text_selected_bold' : '';
                                                                            }
                                                                            let image = (fields.category_image) ? fields.category_image : funcObj.assets_path("/images/dummy-category.jpg");
                                                                            return (
                                                                                <React.Fragment key={index}>
                                                                                    <label className={"mr-2 " + selected} name={list.field_key + fields.id} id={list.field_key + fields.id} htmlFor={`chkbx_` + list.field_key + fields.id}>
                                                                                        {list.field_name == "Categories" ?
                                                                                            <img src={image} className="cate_icon" />
                                                                                            : null
                                                                                        }
                                                                                        {fields.name}</label>
                                                                                    <input type="checkbox" name={list.field_key + `_checkboxes[]`} id={`chkbx_` + list.field_key + fields.id} value={fields.id} data-field-id={fields.id} data-type={list.field_key} onClick={(e) => this.onchangecategory(e)} />
                                                                                    <br />
                                                                                </React.Fragment>
                                                                            );

                                                                        })
                                                                    }

                                                                    {
                                                                        list.field_key == 'categories'?
                                                                        <>
                                                                        <label className="mr-2" htmlFor={`chkbx_any`} class="checkbox_any" >
                                                                        <i class="fa fa-refresh" aria-hidden="true"></i> <span id="any_text">Any</span></label>

                                                                                    <input type="checkbox" name={`chkbx_any`} id={`chkbx_any`} value="" onClick={(e) => this.onChangeAnyCat(e)} />
                                                                                    <br />
                                                                        </>
                                                                        :null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
                                                );
                                            }

                                        })

                                    }
                                </form>
                            </div>

                            {this.rightSection()}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    rightSection() {

        const contents = this.state.contents;
        return (
            <React.Fragment>
                <div className="right_bar float-left p-4">
                    {
                        this.state.filter && Object.keys(this.state.filter).length > 0 && contents && Object.keys(contents).length > 0 ?

                            <div className="clearfix top-head  ">
                                <h6 className="mb-0 mt-3 float-left">Found {this.state.total_records} search results</h6>
                                <div className="float-right">
                                    <div className="d-flex align-items-center">
                                        <span>Sortby</span>
                                        <select defaultValue={this.state.sort_by} name="sort_by" id="sort_by" onChange={(e) => this.handleOnchangeSource(e)} className="mb-0 ml-3 form-control m-1 input_field">
                                            <option value="desc">Latest</option>
                                            <option value="asc" >Oldest</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            : <span>No results found. Try checking your spelling or use more general terms.</span>
                    }
                    <div className="books-cover row mt-5">

                        {

                            contents && Object.keys(contents).length > 0 ?
                                contents.map((content, index) => {
                                    let book_detail_link = `/bookdetail?book_id=` + content.encrypted_content_id + `&type=` + content.class_id+`&backlink=dbooks&q=`+ content.class_id ;
                                    if (AUTH_USER != null) {
                                        book_detail_link = `/private-bookdetail?book_id=` + content.encrypted_content_id + `&type=` + content.class_id + `&backlink=library-catalog`;
                                    }

                                    let classimage = funcObj.getClassTag(content.class_name);
                                    let theme = funcObj.getLocalStorage('themeconfig');
                                    let content_picture = '';
                                    if (content.main_content_image == null || content.main_content_image == '') {
                                        content_picture = funcObj.assets_path("/images/dummy-image.jpg");
                                    } else {
                                        content_picture = content.main_content_image;
                                    }
                                    


                                    return (
                                        <div key={index} className="col-xl-4 col-lg-4 col-md-6 mb-3 mb-lg-5">
                                            
                                            <div className="book-card-wrap">
                                                <div className="book-card ebook">
                                                    <div className="img-wrap float-left">

                                                        <Link to={book_detail_link} >
                                                            <img src={content_picture} alt="books" />
                                                        </Link>
                                                    </div>
                                                    <div className="book-details float-left">
                                                       <div className='top_tag'>{funcObj.getClassFaIcon(content.class_name)} {content.class_title_s}</div>
                                                        <div className="book-name">
                                                            {content.title}
                                                        </div>
                                                        <p>
                                                            {content.author}
                                                        </p>
                                                        <div className="book-rating">
                                                            {funcObj.generateStarRating(content.rating)}
                                                            <span>{content.rating}/5</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="description-text mt-3">
                                                {content.description}
                                                </div>
                                            </div>

                                        </div>
                                    )
                                    
                                })
                                : null

                        }


                    </div>

                    {
                        contents && Object.keys(contents).length > 0 ?

                            <div className="table-bottom-content">
                                <nav aria-label="Page navigation ">
                                    <Pagination
                                        activePage={this.state.current_page}
                                        itemsCountPerPage={this.state.per_page_limit}
                                        totalItemsCount={this.state.total_records}
                                        onChange={this.handlePageChange.bind(this)}
                                        itemClass="page-item"
                                        linkClass="page-link"
                                    />

                                </nav>
                                <div className="table__data float-right">
                                    Showing  {Object.keys(this.state.contents).length} of {this.state.total_records}
                                </div>
                            </div>
                            : null
                    }

                </div>
            </React.Fragment>
        );
    }
}
export default withRouter(PublicBookList);
