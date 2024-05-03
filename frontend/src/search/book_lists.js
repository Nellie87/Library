import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import Pagination from 'react-js-pagination';
import CatalogCards from './catalogCards';
import { Context } from "../helpers/MyContext";
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
class BookLists extends React.Component {
    // static contextType = Context
    constructor(props) {
        super(props);
        let search_text = funcObj.get_query_string('search_text');
        this.state = {
            books: {},
            book_category: "",
            books_types: [],
            authors: '',
            publishers: '',
            categories: '',
            sub_categories: '',
            books_types: [],
            publishing_year: '',
            content_type: '',
            to_date: '',
            from_date: '',
            filter: [],
            search_content: search_text,
            sort_by: 'desc',
            classes: "",
            per_page_limit: funcObj.default_perpage,
            current_page: 1,
            total_records: 0,
            price_range: {},
            addtocartdisabled: true,
            price_range_min: 0,
            price_range_max: 0,
            number_of_records: 10,
            class:""
            
        };
        this.onchangepublishing_year = this.onchangepublishing_year.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    componentDidMount() {
        this.setState({
            class: funcObj.get_query_string('q')
        });
        this.get_book_filter();
        // const contextData = this.context
        // console.log('componentDidMount',contextData)
        if(document.getElementById('sidebar') && !document.getElementById('sidebar').classList.contains('active')){
            document.getElementById('sidebar').classList.add('active');
        }
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
    onChangeAnyCat(e) {
        document.getElementById('custom_categories').value = "";
        document.getElementById('any_text').classList.add('normal_text_selected_bold');
        const type = 'categories';
        var checkboxes = document.getElementsByName(type + '_checkboxes[]');

        for (var i = 0, n = checkboxes.length; i < n; i++) {
            const data_field_id = checkboxes[i].getAttribute("data-field-id");
            if (document.getElementById(type + data_field_id).classList.contains('normal_text_selected_bold')) {
                document.getElementById(type + data_field_id).classList.remove('normal_text_selected_bold');
            }
        }
        document.getElementById('custom_' + type).value = "";
        this.getContents();
    }
    onchangecategory(e,field,child) {
        console.log('field',field);
        console.log('child',child);
        const field_id = e.target.id;
        const type = document.getElementById(field_id).getAttribute("data-type");
        var checkboxes = document.getElementsByName(type + '_checkboxes[]');
        var field_values = "";

        // if(field.field_type == 'radio'){
            
        //     for (var i = 0, n = checkboxes.length; i < n; i++) {
        //         const data_field_id = checkboxes[i].getAttribute("data-field-id");
        //                 if (document.getElementById(type + data_field_id).classList.contains('normal_text_selected_bold')) {
        //                     document.getElementById(type + data_field_id).classList.remove('normal_text_selected_bold');
        //                 }
        //    }
        //         if (document.getElementById('chkbx_'+type+child.id).checked) {
                 
        //             field_values = '';
        //             document.getElementById(type+child.id).classList.remove('normal_text_selected_bold');
        //         }else{
                  
        //             field_values = document.getElementById('chkbx_'+type+child.id).value;
        //             document.getElementById(type+child.id).classList.add('normal_text_selected_bold');
        //         }
               
           
                
           
        // }else{
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
    // }

        if (document.getElementById('any_text').classList.contains('normal_text_selected_bold')) {
            document.getElementById('any_text').classList.remove('normal_text_selected_bold');
        }
        if (field_values) field_values = field_values.substring(1);
        document.getElementById('custom_' + type).value = field_values;
      
        this.getContents();
        window.scrollTo(0, 0)
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

    onChangeRadio(e,field,type){
        if(field == "any_text"){
            document.getElementById('custom_' + type).value = "";
        }else{
            document.getElementById('custom_' + type).value = field.id;
            if(document.getElementById('price_range_section')){
                if (type == 'content_type' && field.id == 'paid') {
                    document.getElementById('price_range_section').style.display = 'block';
                } else {
                    document.getElementById('price_range_section').style.display = 'none';
                }
            }
        }
        
        this.getContents();
    }




    get_book_filter() {
        const endPoint = 'common/filter-web';
        let postBodyData = {
            'web': true
        };
        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
           console.log('Book filter List ',data.data);
            if (data) {
                this.setState({
                    filter: data.data.filter,
                    price_range: data.data.price_range
                })

                if (this.state.filter && Object.keys(this.state.filter).length > 0) {
                    this.getContents();
                }

            }

        });
    }

    getContents(page_no = "") {
        console.log('getContents')
        const publishing_year = document.getElementById('publisher_date') ? document.getElementById('publisher_date').value : "";
        const content_type = document.getElementById('custom_content_type') ? document.getElementById('custom_content_type').value : "";
        const search_content = this.state.search_content;
        const authors = document.getElementById('custom_authors') ? document.getElementById('custom_authors').value : "";
        const publishers = document.getElementById('custom_publishers') ? document.getElementById('custom_publishers').value : "";
        const categories = document.getElementById('custom_categories') ? document.getElementById('custom_categories').value : "";
        const sub_categories = document.getElementById('custom_sub_category') ? document.getElementById('custom_sub_category').value : "";
        const custom_classes = document.getElementById('custom_classes') ? document.getElementById('custom_classes').value : "";
        const sort_by = document.getElementById('sort_by') ? document.getElementById('sort_by').value : 'desc';
        const price_range_min = document.getElementById('price_range_min') ? document.getElementById('price_range_min').value : 0;
        const price_range_max = document.getElementById('price_range_max') ? document.getElementById('price_range_max').value : 0;
        const number_of_records = document.getElementById('number_of_records').value ? document.getElementById('number_of_records').value : 10;
        const search_for = document.getElementById('search_for').value ? document.getElementById('search_for').value : '';
        let postBodyData = {
            current_page: page_no != "" ? page_no : this.state.current_page,
            per_page_limit: number_of_records,
            classes: (custom_classes != '') ? custom_classes : this.state.class,
            sort_by: sort_by,
            search_text: search_content,
            search_for:search_for,
            sub_categories: sub_categories,
            "categories": categories,
            "author": authors,
            "publisher": publishers,
            "publishing_year": publishing_year,
            "isbn": "",
            "content_type": content_type,
            price_range_min: price_range_min,
            price_range_max: price_range_max
        };
        console.log('postBodyData', postBodyData)
        let endPoint = 'get-library-contents';
        if(AUTH_USER == null){
            endPoint =  'get-public-library';
        }
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
                        per_page_limit: this.state.number_of_records,
                        class_id: custom_classes,
                        sort_by: sort_by,
                        search_text: search_content,
                        search_for:search_for,
                        "categories": categories,
                        "author": authors,
                        "publisher": publishers,
                        "publishing_year": publishing_year,
                        "isbn": "",
                        "content_type": content_type,
                        price_range_min: price_range_min,
                        price_range_max: price_range_max
                    });
                    window.scrollTo(0, 0)
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

    addToCart(e, content, qty) {
        let exist_qty = funcObj.get_cart_item(content.content_id);
        qty = qty + exist_qty;
        let res = "";
        console.log(exist_qty)
        if (exist_qty < 1) {
            res = funcObj.add_cart_item(content.content_id, qty);
        }

        if (res) {
            alert('Content is successfully added. Please check your cart')
            document.getElementById('cart_count').textContent = funcObj.get_cart_items_length();
            this.setState({ test: 1, addtocartdisabled: false });
            window.location = funcObj.getSitePath('my-cart');
        }
    }
    render() {
        console.log('books_types page', this.state.books_types);

        return (
            <React.Fragment>
                {this.searchMiddleContent()}
            </React.Fragment>
        );
    }

    searchMiddleContent() {
        let margin = '-50px';
        let is_authenticated = 'not_authenticate';
        if (AUTH_USER != null) {
            margin = '0';
            is_authenticated = 'authenticated';
        }
        return (
            <React.Fragment>
                <input type="hidden" id="custom_classes" />
                <input type="hidden" id="custom_publishers" />
                <input type="hidden" id="custom_authors" />
                <input type="hidden" id="custom_categories" />
                <input type="hidden" id="custom_sub_category" />
                <input type="hidden" id="custom_content_type" />
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


                    <div className={`container ` + is_authenticated}>
                        <div className="search_wrap clearfix " style={{ 'marginTop': margin }}>
                            <div className="left__bar float-left py-4 pl-4 pr-4 pr-md-0" >
                                <form>

                                        <input type="hidden"  className="search-box w-100 m-0" id="search_content" defaultValue={this.state.search_content} onBlur={(e) => this.search(e)} />

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
                                                                    <select className="search-box w-100 m-0" onBlur={(e) => this.onchangepublishing_year(e)} defaultValue={this.state.publisher_date} name="publisher_date" id="publisher_date" >
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
                                            }else if (list.field_key == 'classes' || list.field_key == 'categories' || list.field_key == 'content_type') {
                                                return (
                                                    <React.Fragment key={index}>

                                                   
                                                        <div className="search-elements mt-4">
                                                            <div className="form-group">
                                                                <div className="search-head">{list.field_name} </div>
                                                                <div>
                                                                    {

                                                                        list.field_data.map((fields, index) => {

                                                                            let image = (fields.category_image) ? fields.category_image : funcObj.assets_path("/images/dummy-category.jpg");
                                                                            return (
                                                                                <React.Fragment key={index}>
                                                                                <div className="custom-radio">
                                                                                <input type="radio" name={list.field_key} id={list.field_key + fields.id} value={fields.id} onChange={(e)=>this.onChangeRadio(e,fields,list.field_key)} />
                                                                                <label For={list.field_key + fields.id}>{fields.name}</label>
                                                                                </div>
                                                                                    <br />
                                                                                </React.Fragment>
                                                                            );

                                                                        })
                                                                    }
                                                                    
                                                                            <div className="custom-radio">
                                                                                <input type="radio" name={list.field_key} id={`any_text${index}`} value="any_text" onChange={(e)=>this.onChangeRadio(e,"any_text",list.field_key)} />
                                                                                <label For={`any_text${index}`}>Any {list.field_name}</label>
                                                                           </div>
                                                                    
                                                             
                                                                </div>
                                                            </div>
                                                            {
                                                                list.field_key == 'content_type' ?

                                                                    <div className='form-group' id="price_range_section" style={{ display: 'none' }}>
                                                                        <span>Minimum {funcObj.getCurrency()}&nbsp;<output id="price_range_min_output">{this.state.price_range.min_price}</output></span>
                                                                        <input type="range" onBlur={(e) => this.search(e)} id="price_range_min" name="price_range_min" defaultValue={this.state.price_range.min_price} min={this.state.price_range.min_price} max={this.state.price_range.max_price} onChange={(e) => this.updateTextInput(e, 'price_range_min_output')} />

                                                                        <br />

                                                                        <span>Maximum  {funcObj.getCurrency()}&nbsp;<output id="price_range_max_output">{this.state.price_range.max_price}</output></span>
                                                                        <input type="range" onBlur={(e) => this.search(e)} id="price_range_max" name="price_range_max" defaultValue={this.state.price_range.max_price} min={this.state.price_range.min_price} max={this.state.price_range.max_price} onChange={(e) => this.updateTextInput(e, 'price_range_max_output')} />


                                                                    </div>
                                                                    : null}
                                                        </div>

                                                      
                                                    </React.Fragment>
                                                );
                                            }else {


                                                return (
                                                    <React.Fragment key={index}>
                                                        <div className="search-elements mt-4">
                                                            <div className="form-group">
                                                                <div className="search-head">{list.field_name} </div>
                                                                <div className={(list.field_key == "classes") ? 'custom-checkbox' : "custom-checkbox checkboxHide"}>
                                                                    {

                                                                        list.field_data.map((fields, index) => {

                                                                            let image = (fields.category_image) ? fields.category_image : funcObj.assets_path("/images/dummy-category.jpg");
                                                                            return (
                                                                                <React.Fragment key={index}>
                                                                                    <label className="mr-2" name={list.field_key + fields.id} id={list.field_key + fields.id} htmlFor={`chkbx_` + list.field_key + fields.id}>
                                                                                        {list.field_name == "Categories" ?
                                                                                            <img src={image} className="cate_icon" />
                                                                                            : null
                                                                                        }
                                                                                        {fields.name}</label>

                                                                                    <input type="checkbox" name={list.field_key + `_checkboxes[]`} id={`chkbx_` + list.field_key + fields.id} value={fields.id} data-field-id={fields.id} data-type={list.field_key} onClick={(e) => this.onchangecategory(e,list,fields)} />
                                                                                    <br />
                                                                                </React.Fragment>
                                                                            );

                                                                        })
                                                                    }
                                                                  
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

    updateTextInput(e, input_id) {
        if (document.getElementById(input_id)) {
            document.getElementById(input_id).innerHTML = e.target.value;
        }

    }
    handleOnchangeSourceRecords(event) {

        this.setState({
            number_of_records: event.target.value
        });

        // document.getElementById('extra_sort_by').value = "";
        this.getContents();
       
    }
    rightSection() {
        let backto = funcObj.get_query_string('backto');
        const contents = this.state.contents;
        return (
            <React.Fragment>
                <div className="right_bar float-left p-4">
                {
                    AUTH_USER != null ?
                
                <Link to={`/${backto}`} className='btn darkBtn'>Back to Dashboard</Link>
                :null}
                    <div className="clearfix top-head  ">
                        <h6 className="mb-0 mt-3 float-left">Found {this.state.total_records} search results</h6>
                        <div className="float-right">
                            <div className="d-flex align-items-center">

                                <span>Sortby</span>
                                <select defaultValue={this.state.sort_by} name="sort_by" id="sort_by" onChange={(e) => this.handleOnchangeSource(e)} className="mb-0 ml-3 form-control m-1 input_field">
                                    <option value="desc">Latest</option>
                                    <option value="asc" >Oldest</option>
                                </select>
                                &nbsp;
                                <select className="mb-0 ml-3 form-control" defaultValue={this.state.number_of_records} name="number_of_records" id="number_of_records" onChange={(e) => this.handleOnchangeSourceRecords(e)} >
                                 
                                {
                                        Object.keys(funcObj.recordsPerPageOptions()).map(function (key){
                                            return <option key={key} value={key}>{funcObj.recordsPerPageOptions()[key]}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    {
                        this.state.filter && Object.keys(this.state.filter).length > 0 && contents && Object.keys(contents).length > 0 ?
                            <div className="clearfix top-head  ">

                            </div>

                            :null
                    }
                    <div className="books-cover row mt-5">

                        {

                            contents && Object.keys(contents).length > 0 ?
                                contents.map((content, index) => {
                                    let book_detail_link = `/bookdetail?book_id=` + content.encrypted_content_id + `&type=` + content.class_id;
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

                                        <CatalogCards index={index} content={content} />
                                       
                                    )
                                    // }
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
                                        itemsCountPerPage={this.state.number_of_records}
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
export default withRouter(BookLists);
