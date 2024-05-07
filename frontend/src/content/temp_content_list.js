import React from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import DRMSettings from '../drm/settings';
import Swal from "sweetalert2";
import Functions from '../helpers/functions';
import Pagination from "react-js-pagination";
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
class ContentList extends React.Component {

    handlePageChange(pageNumber) {
        this.state.current_page = pageNumber;
        this.getContents();
    }

    constructor(props) {
        super(props);
        let search_text = funcObj.get_query_string('search_text');
        let class_id = funcObj.get_query_string('class_id');
        console.log('class_id', class_id)
        this.state = {
            contents: {},
            content_id: [],
            deleteButtonColor: '#999999',
            btnDisable: true,
            per_page_limit: funcObj.default_perpage,
            total_records: 0,
            current_page: 1,
            class_id: class_id,
            search_text: search_text,
            allCheck: false,
            classes: {},
            addContentPermission: true,
            deletePermission: true,
            editPermission:true 
        }
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onChangeallValue = this.onChangeallValue.bind(this);
        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
        this.close = this.close.bind(this);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
        this.handleApproveSubmit = this.handleApproveSubmit.bind(this);
        this.getClasses = this.getClasses.bind(this);
        this.getContents = this.getContents.bind(this);
    }
    componentDidMount() {
        console.log('componentDidMount')
        this.getClasses();
        this.getContents();
        this.getPermission();
        // this.setState({search_text:search_text,class_id:class_id});
    }
    handleSearchSubmit(event) {
        console.log('handleSearchSubmit')
        event.preventDefault();
        this.getContents();
    }


    handleApproveSubmit(event, content_id) {
        event.preventDefault();
        let endPoint = 'update-contents-status';
        let postBodyData = {
            "content_id": content_id,
            "status": "published"

        }

        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            if (data.code == 200) {
                Swal.fire({
                    title: 'Success',
                    showCloseButton: true,
                    text: data.message,
                    icon: 'success',
                    showConfirmButton: false,
                })

            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    showCloseButton: true,
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
            this.getContents();
        });
    }

    onChangeallValue(event) {
        console.log('onChangeallValue')
        const target = event.target;
        var value = target.value;
        if (target.checked) {
            this.setState({ deleteButtonColor: '#302f91', btnDisable: false })
            let contents = this.state.contents;
            this.setState({ allCheck: true });
            contents.forEach(el => {
                this.state.content_id.push((el.content_id).toString());
                el.checked = true;
            })
            // console.log(this.state.content_id)
        } else {
            let contents = this.state.contents;
            this.setState({ deleteButtonColor: '#999999', btnDisable: true })
            contents.forEach(el => {
                el.checked = false;
            })
            this.setState({
                contents: contents,
                content_id: [],
                allCheck: false
            })

            //  console.log(this.state.content_id)
        }
    }
    onChangeValue(event) {
        console.log('onChangeValue')
        const target = event.target;
        var value = target.value;
        if (target.checked) {
            // this.state.categories[value] = value; 
            this.state.content_id.push(value);
            this.setState({ deleteButtonColor: '#302f91', btnDisable: false })
            let contents = this.state.contents;
            contents.forEach(el => {
                if (el.content_id == value) {
                    el.checked = true;
                }
            })
            this.setState({
                contents: contents
            })
        } else {
            var index = this.state.content_id.indexOf(event.target.value)
            if (index !== -1) {
                this.state.content_id.splice(index, 1);
                if (this.state.content_id.length < 1) {
                    this.setState({ deleteButtonColor: '#999999', btnDisable: true })
                }
            }
            let contents = this.state.contents;
            contents.forEach(el => {
                if (el.content_id == value) {
                    el.checked = false;
                }
            })
            this.setState({
                contents: contents
            })
        }

        console.log(this.state.content_id)
    }


    getClasses = () => {
        console.log('getClasses')
        let endPoint = 'get-classes';
        let postBodyData = {}
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(response => {

            if (response.code == 200) {

                this.setState({
                    classes: response.data
                });

            } else if (response.code == 201) {
                Swal.fire({
                    title: '',
                    showCloseButton: true,
                    text: response.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }

        })

        
    }


    getContents() {
        console.log('getContents')
        let class_id = document.getElementById('class_id').value;
        let sort_by = document.getElementById('sort_by').value;
        let search_text = document.getElementById('search_text').value;


        console.log('search_text', search_text);
        let postBodyData = {
            current_page: this.state.current_page,
            per_page_limit: this.state.per_page_limit,
            class_id: class_id,
            sort_by: sort_by,
            search_text: search_text
        };
        let endPoint = 'get-temp-contents';
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
                        class_id: class_id,
                        sort_by: sort_by,
                        search_text: search_text
                    });

                } else if (response.code == 201) {
                    Swal.fire({
                        title: '',
                        showCloseButton: true,
                        text: response.message,
                        icon: 'error',
                        showConfirmButton: false,
                    })
                }

            })

        });
    }

    close = (event) => {
        let contents = this.state.contents;
        this.setState({ deleteButtonColor: '#999999', btnDisable: true })
        contents.forEach(el => {
            el.checked = false;
        })
        this.setState({
            contents: contents,
            content_id: [],
            allCheck: false
        })
    }

    handleDeleteSubmit(event) {
        event.preventDefault();
        // console.log("hello")
        this.deleteContents();
    }
    deleteContents = () => {
        let endPoint = 'content-multiple-delete';
        let postBodyData = {
            "content_id": this.state.content_id
        }

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            // alert('data response',data)

            if (data.code == 200) {
                // console.log(data)
                this.getContents();
                this.setState({ deleteButtonColor: '#999999', btnDisable: true, content_id: [], allCheck: false })
                Swal.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success',
                    showConfirmButton: false,
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

    handleOnchangeSource(event) {
        this.getContents();
    }

    getPermission() {

        let postBodyData = {
        };
        let endPoint = 'get-permission';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(response => {
            // console.log('get-contents response',response)

            return new Promise((resolve, reject) => {
                if (Object.keys(response.data).length > 0) {
                    resolve(response);
                }

            }).then(response => {

                if (response.code == 200) {
                    for(let i=0; i< response.data.length; i++){
                        if(response.data[i].permission=="create" && response.data[i].is_permission==0){
                            this.setState({
                                addContentPermission: false,
                            });
                        }else if(response.data[i].permission=="delete" && response.data[i].is_permission==0){
                            this.setState({
                                deletePermission: false,
                            });
                        }else if(response.data[i].permission=="update" && response.data[i].is_permission==0){
                            this.setState({
                                editPermission: false,
                            });
                        }
                    }

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

    handleDeleteSubmit(event, content_id){
        this.state.content_id.push(content_id);
        setTimeout(
            function() {
                this.deleteContents();
            }
            .bind(this),
            100
        );
        
    }

    render() {
        let books = funcObj.get_category_books('', 'ebooks');
        console.log('this state', this.state)
        return (
            <React.Fragment>

                <div className="card mt-4 content_lists">
                    <div className="dashboard-box two_btns">
                        <div className="clearfix top-head mb-4">
                            <h3 className="dashboard-title title-margin my-2 float-left">Marc file Content</h3>
                            
                            <div className="float-right">
                             {(this.state.addContentPermission)?
                                <div className="add-btn-wrap">
                                    <span className="add-icon">+</span>
                                    <Link to="/add-publication?book_id=" type="button" className="btn darkBtn">Add New</Link>
                                </div>:null}
                            </div>
                            <div className="float-right">
                            {(this.state.addContentPermission)?
                                <div className="add-btn-wrap">
                                    <span className="add-icon">+</span>
                                    <Link to="/bulk-upload" type="button" className="btn darkBtn">Bulk Upload</Link>
                                </div>:null}
                            </div>
                        </div>

                        <div className="row">

                            <div className="col-md-2">
                                <div className="form-group">
                                    <input type="text" defaultValue={this.state.search_text} name="search_text" id="search_text" onBlur={(e) => this.handleOnchangeSource(e)} placeholder="Search content" className="input-field form-control" />
                                </div>
                            </div>


                            <div className="col-md-3">
                                <div className="form-group">

                                    <select title="Content Class" className="input-field form-control" value={this.state.class_id} onChange={(e) => this.handleOnchangeSource(e)} name="class_id" id="class_id">
                                        <option value="">Select Class</option>
                                        {
                                            this.state.classes && Object.keys(this.state.classes).length > 0 ?
                                                this.state.classes.map((classd, index) => {
                                                    return (
                                                        <option key={index} value={classd.class_id} >{classd.class_title_s}</option>
                                                    )
                                                })
                                                : null}
                                    </select>
                                </div>
                            </div>


                            <div className="col-md-3">
                                <div className="form-group">
                                    <select className="input-field form-control" defaultValue="desc" name="sort_by" id="sort_by" onChange={(e) => this.handleOnchangeSource(e)} >
                                        <option value="desc">Sort by</option>
                                        <option value="desc">Latest</option>
                                        <option value="asc" >Oldest</option>
                                    </select>
                                </div>
                            </div>

                        </div>

                        <div className="table-responsive ">
                            <table className="table">
                                <thead>
                                    <tr>
                                        {(this.state.deletePermission)? 
                                        <th scope="col" width="80">
                                            <div className="custom-checkbox">
                                                <input  type="checkbox" onChange={this.onChangeallValue} id="checkbox2" checked={(this.state.allCheck) ? true : false} />
                                                <label htmlFor="checkbox2"></label>
                                            </div>
                                        </th>:null}
                                        <th></th>
                                        <th scope="col" >Title</th>
                                        <th scope="col">Publishing house</th>
                                        {AUTH_USER.account_type != 'admin' ?
                                            <th scope="col">Genre</th>:null}

                                        <th scope="col">Author</th>
                                        <th scope="col">Publishing date</th>
                                        {AUTH_USER.account_type != 'admin' ?
                                            <th scope="col">Language</th>:null}

                                        <th scope="col">Licence Type</th>
                                        {
                                            (AUTH_USER.account_type == 'admin' || AUTH_USER.account_type == 'librarian'|| AUTH_USER.account_type == 'senior_librarian') ?
                                                <th scope="col">Actions</th>
                                                :
                                                <th scope="col">Status</th>
                                        }
                                        <th scope="col">DRM Settings</th>
                                        {(this.state.editPermission)?
                                            <th scope="col">Edit</th>:null}
                                    </tr>
                                </thead>
                                <tbody>

                                    {

                                        this.state.contents && Object.keys(this.state.contents).length > 0 ?
                                            this.state.contents.map((content, index) => {
                                                let content_picture = '';
                                                if (content.main_content_image == null || content.main_content_image == "") {
                                                    content_picture = funcObj.getBookTypeListSmallIcon(content.class_name);
                                                } else {
                                                    content_picture = content.main_content_image;
                                                }
                                                let table_row_background = 'table_row_background_success';
                                                if(content.status == 'rejected'){
                                                    table_row_background = 'table_row_background_danger';
                                                }else if(content.status == 'pending'){
                                                    table_row_background = 'table_row_background_warning';
                                                }
                                                return (
                                                    <React.Fragment key={index}>
                                                        <tr className={table_row_background} title={content.status}>
                                                            {(this.state.deletePermission)? 
                                                            <td scope="col">
                                                                <div className="custom-checkbox">
                                                                    <input  type="checkbox" value={content.content_id} id={"checkbox_" + content.content_id} onChange={this.onChangeValue} checked={(content?.checked) ? true : false} />
                                                                    <label htmlFor={"checkbox_" + content.content_id}></label>

                                                                </div>
                                                            </td>:null}
                                                            <td>
                                                                {funcObj.displayClassIcon(content.class_name)}
                                                                <span className="img-wrap cat__img ">
                                                                    <img src={content_picture} width="30" alt="books" />
                                                                </span>

                                                            </td>
                                                            <td><Link to={`/private-bookdetail?book_id=` + content.encrypted_content_id + `&backlink=my-publications`}>{content.title}</Link></td>
                                                            <td>{content.publishing_house}</td>
                                                            {AUTH_USER.account_type != 'admin' ?
                                                                <td>{content.genre}</td>:null}
                                                            <td>{content.author_name}</td>
                                                            <td>{content.publishing_date}</td>
                                                            {AUTH_USER.account_type != 'admin' ?
                                                                <td>{content.language}</td>:null}
                                                            <td>{funcObj.showContentTypeTitle(content.content_type)}</td>
                                                            {
                                                                (AUTH_USER.account_type == 'admin'|| AUTH_USER.account_type == 'librarian'|| AUTH_USER.account_type == 'senior_librarian') && AUTH_USER.user.id != content.publisher_id ?
                                                                    <td className="actions">
                                                                        <div className="row">
                                                                            {
                                                                                content.status == 'published' ?
                                                                                    <div></div>
                                                                                    :
                                                                                    <div onClick={(e) => this.handleApproveSubmit(e, content.encrypted_content_id)} className="btn curspoint action-btn" title="Approve" ><i class="fa fa-check action-btn-size" aria-hidden="true"></i></div>
                                                                            }

                                                                            {
                                                                               content.status == 'published' ?null:
                                                                                content.status == 'rejected' ?
                                                                                    <div alt={content.reject_reason}></div>
                                                                                    :
                                                                                    <div><Link to={`/reject-reason?content_id=` + content.encrypted_content_id + `&backlink=my-publications`} className="btn action-btn" title="Reject"  ><i class="fa fa-ban action-btn-size" aria-hidden="true"></i></Link></div>
                                                                            }
                                                                            <div onClick={(e) => this.handleDeleteSubmit(e, content.content_id)} className="btn curspoint action-btn" title="Delete" ><i class="fa fa-trash action-btn-size" aria-hidden="true"></i></div>
                                                                        </div>
                                                                        

                                                                    </td>
                                                                    :
                                                                    <td>
                                                                        {
                                                                            content.status == 'rejected' ?
                                                                                <React.Fragment>
                                                                                    <div  ></div>
                                                                                    <div className="text-info" data-toggle="collapse" href={`#reject_reason_` + index} role="button" aria-expanded="false" aria-controls={`reject_reason_` + index} >(Reason)</div>
                                                                                </React.Fragment>
                                                                                :
                                                                                <React.Fragment>
                                                                                    {
                                                                                        content.status == 'published' ?
                                                                                            <div ></div>
                                                                                            :
                                                                                            <div></div>
                                                                                    }

                                                                                </React.Fragment>
                                                                        }
                                                                    </td>
                                                            }
                                                            <td><button className="btn drmBtn" data-toggle="collapse" href={`#drm_` + index} role="button" aria-expanded="false" aria-controls={`drm_` + index} title="DRM Settings" ><i className="fa fa-eye drm-btn-size" aria-hidden="true"></i></button></td>
                                                            {(this.state.editPermission)?
                                                                <td ><Link to={`/edit-publication?book_id=` + content.encrypted_content_id} ><i className="fas fa-edit"></i></Link></td>:null}
                                                        </tr>
                                                        <tr id={`reject_reason_` + index} className="collapse">
                                                            <td colSpan="11">
                                                                <p><b>Rejected Reason: </b>{content.reject_reason}</p>
                                                            </td>
                                                        </tr>
                                                        <tr id={`drm_` + index} className="collapse">
                                                            <td colSpan="11">
                                                                <DRMSettings content={content} />
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>)
                                            }) : null}
                                </tbody>
                            </table>
                            <div className="table-bottom-content d-block mb-3">
                               {(this.state.deletePermission)? 
                                <button type="button" data-toggle="modal" data-target="#deleteModal" disabled={this.state.btnDisable} style={{ backgroundColor: this.state.deleteButtonColor }} className="btn lightBtn mr-2">Delete Selected</button>:null}
                                {
                                    AUTH_USER.account_type == 'admin' ?
                                        <React.Fragment>
                                            {/* <button type="button" className="btn lightBtn mr-2">Approve Selected</button>
                                            <button type="button" className="btn lightBtn mr-2">Reject Selected</button> */}
                                        </React.Fragment>
                                        : null
                                }

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
                                    Showing  {Object.keys(this.state.contents).length} of {this.state.total_records}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* <!-- Modal --> */}
                <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog delete-modal" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Delete Content</h5>
                                <button type="button" onClick={this.close} className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Are you sure want to delete books content!
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={this.close} className="btn closedelete" data-dismiss="modal">Close</button>
                                <button type="button" onClick={this.handleDeleteSubmit} data-dismiss="modal" className="btn delete mr-2">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
export default ContentList;
