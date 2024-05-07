import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
import Pagination from "react-js-pagination";
const funcObj = new Functions();
export default class PublishedContents extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            contents: [],
            from_date: '',
            to_date: '',
            class_id: '',
            category_id: '',
            per_page_limit: funcObj.default_perpage,
            total_records: 0,
            current_page: 1,
            categories: {},
            classes: {},
            setMaxDate: new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + parseInt(1)) + '-' + new Date().getDate(),
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);

    }

    handlePageChange(pageNumber) {
        this.state.current_page = pageNumber;
        this.getPublishedContent(pageNumber);
    }

    componentDidMount() {
        this.getPublishedContent();
        this.getCategories();
        this.getClasses();
    }

    handleChange(event) {
        this.getPublishedContent();
    }

    checkDate = () => {
        if (this.state.to_date && this.state.from_date) {
            this.getPublishedContent();
        } else if (this.state.to_date == '' && this.state.from_date == '') {
            this.getPublishedContent();
        }
    }


    handleSubmit(event) {
        event.preventDefault();
        this.getPublishedContent();
    }

    getPublishedContent = () => {
        let endPoint = 'published-contents';
        const from_date = document.getElementById('from_date').value;
        const to_date = document.getElementById('to_date').value;
        const class_id = document.getElementById('class_id').value;
        const category_id = document.getElementById('category_id').value;
        let postBodyData = {
            "from_date": from_date,
            "to_date": to_date,
            "class_id": class_id,
            "category_id": category_id,
            "current_page": this.state.current_page,
            "per_page_limit": this.state.per_page_limit,
        }

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            // alert('data response',data)

            if (data.code == 200) {
                console.log(data)
                this.setState({
                    contents: data.data.data,
                    total_records: data.data.total,
                    from_date: this.state.from_date,
                    to_date: this.state.to_date,
                    class_id: this.state.class_id,
                    category_id: this.state.category_id,
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


    getCategories = () => {
        let endPoint = 'get-categories';
        let postBodyData = {}
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(data => {


            if (data.code == 200) {
                console.log(data)
                this.setState({
                    categories: data.data
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



    getClasses = () => {
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
                    showCloseButton: true,
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }

    render() {

        const contents = this.state.contents;
        return (
            <React.Fragment>
                <form id="geniusform" onSubmit={this.handleSubmit}>
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Published contents</h3>
                            </div>
                            <div className="row">
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <label className="pl-3">From-date  </label>
                                        <input type="date" max={this.state.setMaxDate} className="input-field form-control" defaultValue={this.state.from_date} onBlur={(e) => this.handleChange(e)} name="from_date" id="from_date" />
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <label className="pl-3">To-date  </label>
                                        <input type="date" max={this.state.setMaxDate} className="input-field form-control" defaultValue={this.state.to_date} onBlur={(e) => this.handleChange(e)} name="to_date" id="to_date" />
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <label className="pl-3">Content Category </label>
                                        <select className="input-field form-control" defaultValue={this.state.category_id} onChange={(e) => this.handleChange(e)} name="category_id" id="category_id">
                                            <option value="">-Select-</option>


                                            {
                                                this.state.categories && Object.keys(this.state.categories).length > 0 ?
                                                    this.state.categories.map((category, index) => {
                                                        return (
                                                            <option key={index} value={category.category_id}>{category.category_name}</option>
                                                        )
                                                    })
                                                    : null}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <label className="pl-3">Content Class </label>
                                        <select className="input-field form-control" defaultValue={this.state.class_id} onChange={(e) => this.handleChange(e)} name="class_id" id="class_id">
                                            <option value="">Select class</option>
                                            {
                                                this.state.classes && Object.keys(this.state.classes).length > 0 ?
                                                    this.state.classes.map((classd, index) => {
                                                        return (
                                                            <option key={index} value={classd.class_id}>{classd.class_title_s}</option>
                                                        )
                                                    })
                                                    : null}
                                        </select>
                                    </div>
                                </div>

                                {/* <div className="col-lg-2">
                                    <div className="form-group">
                                        <button type="submit" className="btn addCart py-1 px-3 mr-1 mt-30">Search</button>
                                    </div>
                                </div>   */}
                            </div>
                        </div>
                    </div>
                </form>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 className="dashboard-title title-margin my-2 float-left">Search Result</h3>
                        </div>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th scope="col" >Content Title<i style={{ display: 'none' }} className="sort-icon"></i></th>
                                        <th scope="col">Content Subtitle <i style={{ display: 'none' }} className="sort-icon"></i></th>
                                        <th scope="col">Author Name <i style={{ display: 'none' }} className="sort-icon"></i></th>
                                        <th scope="col">Publisher Name <i style={{ display: 'none' }} className="sort-icon"></i></th>
                                        <th scope="col">Licence <i style={{ display: 'none' }} className="sort-icon"></i></th>
                                        <th scope="col">Date Of Publish <i style={{ display: 'none' }} className="sort-icon"></i></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        contents && Object.keys(contents).length > 0 ?
                                            contents.map((content, index) => {
                                                /**
                                                    * set default image according to class like (Audio,Video,ebook,slides)
                                                    */
                                                let defaultImage = '';
                                                if (content.class_id == 1) {
                                                    defaultImage = funcObj.assets_path("/images/icons/audiobook_blue.svg");
                                                }
                                                else if (content.class_id == 2) {
                                                    defaultImage = funcObj.assets_path("/images/icons/videobook_blue.svg");
                                                }
                                                else if (content.class_id == 3) {
                                                    defaultImage = funcObj.assets_path("/images/icons/ebook_blue.svg");
                                                }
                                                else if (content.class_id == 4) {
                                                    defaultImage = funcObj.assets_path("/images/icons/slide_blue.svg");
                                                }
                                                return (

                                                    <tr key={index}>
                                                        <td>
                                                            {funcObj.displayClassIcon(content.class_name)}
                                                            <span className="img-wrap cat__img">
                                                                {(content.main_content_image) ? <img src={content.main_content_image} width="30" alt="books" /> :
                                                                    <img src={defaultImage} width="30" alt="books" />}
                                                            </span>
                                                        </td>
                                                        <td><Link to={`/private-bookdetail?book_id=` + content.encrypted_content_id + `&backlink=published-contents`}>{content.title}</Link></td>
                                                        <td>{content.subtitle}</td>
                                                        <td>{content.author_name}</td>
                                                        <td>{content.first_name} {content.last_name}</td>

                                                        <td>
                                                            {
                                                                content.content_type == 'free' ?
                                                                    <span>{funcObj.showContentTypeTitle(content.content_type)}</span>
                                                                    :
                                                                    <span> {content.content_price} {funcObj.getCurrency()}</span>
                                                            }


                                                        </td>
                                                        <td>{content.publishing_date}</td>
                                                    </tr>
                                                )
                                            }) : null}
                                </tbody>
                            </table>
                        </div>
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
                                Showing  {Object.keys(contents).length} of {this.state.total_records}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}