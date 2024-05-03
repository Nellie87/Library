import React from 'react';
import { Link } from 'react-router-dom';
import DRMSettings from '../drm/settings';
import Swal from "sweetalert2";
import Functions from '../helpers/functions';
import ReactResumableJs from '../ReactResumableJs';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class AddContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            class_id: '',
            class_name:'',
            chunk_data:"",
            categories: [],
            subcategories: [],
            Title: '',
            Subtitle: '',
            author_name: '',
            Genre: '',
            publishing_year: '',
            Language: '',
            // licence_type:'',
            Description: '',
            other_sources_link: "",
            // Bibliography: '',
            isbn: '',
            class_number: '',
            subject: '',
            e_shelve_code: '',
            tags: '',
            discount_price: '',
            content_type: 'free',
            actual_price: '',
            quantity: '1',
            // currency: '',
            days: '30',
            unlimited_access: 0,
            subscriptional_type: '',
            myFile: null,
            coverImage: null,
            indexImage: null,
            otherImage: null,
            copy_paste: 0,
            printing: 0,
            drm_no_of_devices: '1',
            downloads: 0,
            // currencyHtml: 'show',
            publishing_house: '',
            setMaxDate: new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + parseInt(1)) + '-' + new Date().getDate(),
            displayUptoHtml: false,
            des_chars_left: 0,
            bib_chars_left: 0,
            coverimgSrc: '',
            indeximgSrc: '',
            otherimgSrc: '',
            noOfCopiesHtml: false,
            unlimited_copies: 0,
            classes: {},
            default_categories: {},
            copy_past_permission: false,
            printing_permission: false,
            download_permission: false,
            no_of_copie_permission: false,
            display_upto_permission: false,
            content_id: "",
            title_disable: false,
            subtitle_disable: false,
            urlParam: "",
            publisher_id: "",
            edition: "",
            content_reader: "",
            editor: "",
            // for_junior_reader: 1
            url :funcObj.chunk_upload_url()+"files-upload",
            fileurl:{},
            is_file_uploaded:false,
       
       

        };
        // console.log(this.state.setMaxDate)
        this.onChangeClassValue = this.onChangeClassValue.bind(this);
        this.onChangeCategoriesValue = this.onChangeCategoriesValue.bind(this);
        this.onChangeSubCategoriesValue = this.onChangeSubCategoriesValue.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileUploaded = this.fileUploaded.bind(this);
   
     
    }

    fileUploaded(){
        this.setState(
            {is_file_uploaded:true}
        );
    }
    onUploadErrorCallback(){
        funcObj.custom_alert_message('Something wrong in file uploading!');  
    }

    componentDidMount() {
        let book_id = funcObj.get_query_string('book_id');
        if (book_id) {
            this.setState({ urlParam: book_id })
            this.getContent();
        } else {
            this.getClasses();
            this.getCategories();
        }
      

    }
 

    componentDidUpdate() {
        let book_id = funcObj.get_query_string('book_id');
        if (this.state.urlParam != book_id) {
            this.setState({
                class_id: '',
                categories: {},
                Title: '',
                Subtitle: '',
                author_name: '',
                Genre: '',
                publishing_year: '',
                Language: '',
                // licence_type:'',
                Description: '',
                other_sources_link: '',
                // Bibliography: '',
                isbn: '',
                class_number: '',
                subject: '',
                e_shelve_code: '',
                tags: '',
                discount_price: '',
                content_type: 'paid',
                actual_price: '',
                quantity: '1',
                // currency: '',
                days: '30',
                unlimited_access: 0,
                subscriptional_type: '',
                myFile: null,
                coverImage: null,
                indexImage: null,
                otherImage: null,
                copy_paste: 0,
                printing: 0,
                drm_no_of_devices: '1',
                downloads: 0,
                // currencyHtml: 'show',
                publishing_house: '',
                setMaxDate: new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + parseInt(1)) + '-' + new Date().getDate(),
                displayUptoHtml: false,
                des_chars_left: 0,
                bib_chars_left: 0,
                coverimgSrc: '',
                indeximgSrc: '',
                otherimgSrc: '',
                noOfCopiesHtml: false,
                unlimited_copies: 0,
                classes: {},
                default_categories: {},
                copy_past_permission: false,
                printing_permission: false,
                download_permission: false,
                no_of_copie_permission: false,
                display_upto_permission: false,
                content_id: "",
                title_disable: false,
                subtitle_disable: false,
                urlParam: book_id,
                temp_record: '',
                edition: '',
                publication_details: '',
                editor: '',
                // for_junior_reader: 1,
            })
            this.getClasses();
            this.getCategories();
        }
    }

    onChangeClassValue(event,class_detail) {
        console.log('class_detail',class_detail)
        const filetypes = funcObj.getFileTypesExtensionsArray(class_detail.class_name);
        this.setState({ 
            class_id: event.target.value,
            class_name:class_detail.class_name,
            filetypes:filetypes
         });
    }
    onChangeCategoriesValue(event) {

        const target = event.target;
        var value = target.value;
        if (target.checked) {
            // this.state.categories[value] = value; 
            this.state.categories.push(value);

        } else {
            var index = this.state.categories.indexOf(event.target.value)
            if (index !== -1) {
                this.state.categories.splice(index, 1);

            }
        }

    }
    onChangeSubCategoriesValue(event) {
        const target = event.target;
        var value = target.value;
        if (target.checked) {
            // this.state.categories[value] = value; 
            this.state.subcategories.push(value);
        } else {
            var index = this.state.subcategories.indexOf(event.target.value)
            if (index !== -1) {
                this.state.subcategories.splice(index, 1);
            }
        }
        console.log('sub category', this.state.subcategories);
    }
    removeContent() {
        let book_id = funcObj.get_query_string('book_id');
        let postBodyData = {
            'content_id': book_id
        };
        let endPoint = 'remove-content';

        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            // console.log(endPoint + ' response', data)
            if (data.code == 200) {
                return funcObj.redirectPage("my-publications");
            }
        });
    }
    // Method causes to store all the values of the 
    // input field in react state single method handle 
    // input changes of all the input field using ES6 

    // javascript feature computed property names
    handleChange(event) {

        if (event.target.name == 'myFile' || event.target.name == 'coverImage'
            || event.target.name == 'indexImage' || event.target.name == 'otherImage') {
            // console.log(event.target.files[0])
            if (event.target.files[0]) {
                const imageFile = event.target.files[0];
                if (event.target.name == 'coverImage'
                    || event.target.name == 'indexImage' || event.target.name == 'otherImage') {
                    if (!imageFile.name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
                        funcObj.custom_alert_message('Please select valid image.');
                        event.target.value = null;
                        return false;
                    }
                }

                if (event.target.name == 'myFile') {
                    if (!imageFile.name.match(/\.(pdf|webm|mp4|mpeg|epub|ogv|mp3|jpg|png|docx|PDF|WEBM|MP4|MPEG|EPUB|OGV|MP3|JPG|PNG|DOCX)$/)) {
                        funcObj.custom_alert_message('Please select valid file.');
                        event.target.value = null;
                        return false;
                    }
                }
                if (event.target.name == 'coverImage') {
                    this.getBase64(imageFile)
                        .then(result => {
                            imageFile["base64"] = result;
                            this.setState({
                                coverimgSrc: result
                            });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }

                this.setState({
                    [event.target.name]: event.target.files[0]
                })
            } else {
                if (event.target.name == 'coverImage') {
                    this.setState({ coverimgSrc: '' });
                } else if (event.target.name == 'indexImage') {
                    this.setState({ indeximgSrc: '' });
                } else if (event.target.name == 'otherImage') {
                    this.setState({ otherimgSrc: '' });
                }
                this.setState({
                    [event.target.name]: null
                })
            }

        } else if (event.target.name == 'unlimited_access') {
            console.log(event.target.value);
            (this.state.unlimited_access == 0) ? this.setState({ [event.target.name]: 1 }) : this.setState({ [event.target.name]: 0 });
            if (this.state.unlimited_access == 1) {
                this.setState({
                    displayUptoHtml: false,
                    days: 30
                })
            } else {
                this.setState({
                    displayUptoHtml: true,
                    days: ''
                })
            }
        } else if (event.target.name == 'unlimited_copies') {
            console.log(event.target.value);
            (this.state.unlimited_copies == 0) ? this.setState({ [event.target.name]: 1 }) : this.setState({ [event.target.name]: 0 });
            if (this.state.unlimited_copies == 1) {
                this.setState({
                    noOfCopiesHtml: false,
                    quantity: 1
                })
            } else {
                this.setState({
                    noOfCopiesHtml: true,
                    quantity: ''
                })
            }
        } else if (event.target.name == 'copy_paste') {
            (this.state.copy_paste == 1) ? this.setState({ [event.target.name]: 0 }) : this.setState({ [event.target.name]: 1 });
        } else if (event.target.name == 'printing') {
            (this.state.printing == 0) ? this.setState({ [event.target.name]: 1 }) : this.setState({ [event.target.name]: 0 });
        } else if (event.target.name == 'downloads') {
            (this.state.downloads == 0) ? this.setState({ [event.target.name]: 1 }) : this.setState({ [event.target.name]: 0 });
        } else if (event.target.name == 'content_type') {
            if (event.target.value != 'paid') {
                this.setState({
                    // currencyHtml: 'hide',
                    discount_price: '',
                    actual_price: '',
                    [event.target.name]: event.target.value,
                });
            } else {
                this.setState({
                    // currencyHtml: 'show',
                    [event.target.name]: event.target.value
                });
            }

        }
        else if (event.target.name == 'Description') {
            const charCount = event.target.value.length;
            const charLeft = 1000 - charCount;
            this.setState({ des_chars_left: charCount });
            this.setState({
                [event.target.name]: event.target.value
            })
        }
        // else if (event.target.name == 'Bibliography') {
        //     const charCount = event.target.value.length;
        //     const charLeft = 500 - charCount;
        //     this.setState({ bib_chars_left: charCount });
        //     this.setState({
        //         [event.target.name]: event.target.value
        //     })
        // }
        else {
            this.setState({
                // Computed property names
                // keys of the objects are computed dynamically
                [event.target.name]: event.target.value
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

    handleOnchangeSource(e) {
        const opt_val = e.target.value;
        const source_childs = document.getElementsByClassName('source_childs');
        for (var i = 0; i < source_childs.length; i++) {
            source_childs[i].classList.add('d-none');

        }
        document.getElementById(opt_val).classList.remove('d-none');
    }

    handleSubmit(event) {
        event.preventDefault();

        let endPoint = 'add-content';
        if (this.state.content_id != "") {
            endPoint = 'edit-content';
        }else{
            if(this.state.is_file_uploaded == false){
                funcObj.custom_alert_message('Content file is not uploaded!');    
            }
        }

        if (this.state.days > 365) {
            funcObj.custom_alert_message('Display upto days should not be more than 365 days');
            return false;
        }
        if (this.state.Title == '') {
            funcObj.custom_alert_message('Please specify content title');
            document.getElementById('title').focus();
            return false;
        }
        if (this.state.Title.length < 3) {
            funcObj.custom_alert_message('Title should be minimum 3 characters');
            document.getElementById('title').focus();
            return false;
        }
        if (!this.state.noOfCopiesHtml && this.state.quantity < 1) {
            funcObj.custom_alert_message('Please select atleast 1 copy');
            return false;
        }

        if (parseInt(this.state.actual_price) < parseInt(this.state.discount_price)) {
            funcObj.custom_alert_message('Discounted price must be less than actual price');
            return false;
        }
        if (this.state.class_id == '') {
            funcObj.custom_alert_message('Please select content type(Audio, Video, Ebook etc.)');
            return false;
        }
        if (this.state.isbn && this.state.isbn.length > 30) {
            funcObj.custom_alert_message('ISBN must not be more than 30 characters');
            return false;
        }
        if (this.state.class_number && this.state.class_number.length > 30) {
            funcObj.custom_alert_message('Class number must not be more than 30 characters');
            return false;
        }
        if (this.state.issn && this.state.issn.length > 30) {
            funcObj.custom_alert_message('ISSN must not be more than 30 characters');
            return false;
        }
        if (this.state.subject && this.state.subject.length > 150) {
            funcObj.custom_alert_message('Subject must not be more than 150 Characters');
            return false;
        }

        if (this.state.Language && this.state.Language.length > 30) {
            funcObj.custom_alert_message('Language must not be more than 30 Characters');
            return false;
        }

        if (this.state.editor && this.state.editor.length > 150) {
            funcObj.custom_alert_message('Editor must not be more than 150 Characters');
            return false;
        }

        if (this.state.series_statement && this.state.series_statement.length > 100) {
            funcObj.custom_alert_message('Series Statement must not be more than 100 Characters');
            return false;
        }
        if (this.state.author_name && this.state.author_name.length > 150) {
            funcObj.custom_alert_message('Name of Author must not be more than 150 Characters');
            return false;
        }
        if (this.state.Genre && this.state.Genre.length > 100) {
            funcObj.custom_alert_message('Genre must not be more than 100 Characters');
            return false;
        }
        if (this.state.note && this.state.note.length > 300) {
            funcObj.custom_alert_message('Notes must not be more than 300 Characters');
            return false;
        }

        if (this.state.content_reader == '' || this.state.content_reader == null) {
            funcObj.custom_alert_message('Please specify type of reader for this content');
            document.getElementById('content_reader').focus();
            return false;
        }
        if (this.state.publication_details && this.state.publication_details.length > 300) {
            funcObj.custom_alert_message('Publication details must not be more than 300 Characters');
            return false;
        }
        if (this.state.publishing_house && this.state.publishing_house.length > 50) {
            funcObj.custom_alert_message('Publication house must not be more than 50 Characters');
            return false;
        }

        if (this.state.Title && this.state.Title.length > 500) {
            funcObj.custom_alert_message('Title must not be more than 500 Characters');
            document.getElementById('title').focus();
            return false;
        }
        if (this.state.Subtitle && this.state.Subtitle.length > 500) {
            funcObj.custom_alert_message('Sub-title must not be more than 500 Characters');
            return false;
        }
        if (this.state.Subtitle && this.state.Subtitle.length < 3) {
            funcObj.custom_alert_message('Sub title should be minimum 3 characters');
            return false;
        }
        if (this.state.categories.length < 1) {
            funcObj.custom_alert_message('Please specify content category');
            return false;
        }
        
        if (this.state.edition && this.state.edition.length > 100) {
            funcObj.custom_alert_message('Edition must not be more than 100 Characters');
            document.getElementById('edition').focus();
            return false;
        }
       
        if (this.state.content_type == 'paid') {
            if (this.state.actual_price == '' || this.state.actual_price == null) {
                funcObj.custom_alert_message('Please specify the content price');
                return false;
            }
           
        }
        if (this.state.drm_no_of_devices > 10) {
            funcObj.custom_alert_message('Maximum limit of number of devices is 10');
            return false;
        }
        if (this.state.Description == null) {
            funcObj.custom_alert_message('Please provide a description of the content');
            return false;
        }
        if (this.state.Description && this.state.Description.length < 3) {
            funcObj.custom_alert_message('Description should be minimum 3 Characters');
            return false;
        }
        // if (this.state.Bibliography == null) {
        //     funcObj.custom_alert_message('Please fill the Bibliography');
        //     return false;
        // }
        if (this.state.publishing_year == null || this.state.publishing_year == '') {
            funcObj.custom_alert_message('Please specify the year of publication');
            document.getElementById('publishing_year').focus();
            return false;
        }
        if (this.state.publishing_year.length < 4) {
            funcObj.custom_alert_message('Please Check the year of publication');
            document.getElementById('publishing_year').focus();
            return false;
        }
      
        if (this.state.coverImage == null) {
            funcObj.custom_alert_message('Please upload content cover image');
            return false;
        }

        let chunk_file="";
        let file_extension="";
        if(document.getElementById('chunk_file')){
            chunk_file = document.getElementById('chunk_file').value;
            file_extension = document.getElementById('file_extension').value;
        }
        if(this.state.content_id == "" && chunk_file == ""){
            funcObj.custom_alert_message('Please upload content file');
            return false;
        }

        if(funcObj.customIsPropertyNotEmpty(this.state.other_sources_link)){
            if(!funcObj.isValidUrl(this.state.other_sources_link)){
                funcObj.custom_alert_message('Please correct the other source link!');
                return false;
            }
        }
      
        let postBodyData = {
            "title": this.state.Title,
            "description": this.state.Description.toString(),
            "other_sources_link": this.state.other_sources_link,
            "class_id": this.state.class_id,
            chunk_file:chunk_file,
            file_extension:file_extension,
            "category_id": JSON.stringify(this.state.categories),
            "sub_category_id": JSON.stringify(this.state.subcategories),
            "content_price": this.state.actual_price,
            "discounted_price": this.state.discount_price,
            "content_reader": this.state.content_reader,
            // "currency": this.state.currency,
            "content_type": this.state.content_type,
            "is_subscriptional_type": this.state.subscriptional_type,
            "class_number": this.state.class_number,
            "content_subject": this.state.subject,
            "eshelve_code": this.state.e_shelve_code,
            "subtitle": this.state.Subtitle,
            "upload_content": this.state.myFile,
            "image_cover": this.state.coverImage,
            "tags": this.state.tags,
            "genre": this.state.Genre,
            "publishing_year": this.state.publishing_year,
            "author_name": this.state.author_name,
            "language": this.state.Language,
            // "licence_type":this.state.licence_type,
            // "bibliography": this.state.Bibliography.toString(),
            "isbn_content": this.state.isbn,
            "no_of_copies": (!this.state.noOfCopiesHtml) ? this.state.quantity : "-1",
            "display_upto": (!this.state.displayUptoHtml) ? this.state.days : "-1",
            "unlimited_access": this.state.unlimited_access,
            "copy_paste": this.state.copy_paste,
            "printing": this.state.printing,
            "downloads": this.state.downloads,
            "number_of_devices": this.state.drm_no_of_devices,
            "publishing_house": this.state.publishing_house,
            "content_id": this.state.content_id,
            "publisher_id": this.state.publisher_id,
            "edition": this.state.edition,
            "editor": this.state.editor,
            "publication_details": (this.state.publication_details != undefined) ? this.state.publication_details : "",
            "note": (this.state.note != undefined) ? this.state.note : "",
            "issn": (this.state.issn != undefined) ? this.state.issn : "",
            "series_statement": (this.state.series_statement != undefined) ? this.state.series_statement : "",
            "fileurl":this.state.fileurl
            // "for_junior_reader": this.state.for_junior_reader
        };


        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            if (data.code == 200) {
                console.log(data)
                let current_page = 0;
                if(funcObj.get_query_string('current_page')){
                    current_page = funcObj.get_query_string('current_page');
                }
                let number_of_records=10;
                if(funcObj.get_query_string('number_of_records')){
                    number_of_records = funcObj.get_query_string('number_of_records');
                }
                let class_id;
                if(funcObj.get_query_string('class_id')){
                    class_id = funcObj.get_query_string('class_id');
                }
                let category_id;
                if(funcObj.get_query_string('category_id')){
                    category_id = funcObj.get_query_string('category_id');
                }
                let sub_category_id;
                if(funcObj.get_query_string('sub_category_id')){
                    sub_category_id = funcObj.get_query_string('sub_category_id');
                }
                let content_status;
                if(funcObj.get_query_string('content_status')){
                    content_status = funcObj.get_query_string('content_status');
                }
                let extra_sort_by_order;
                if(funcObj.get_query_string('extra_sort_by_order')){
                    extra_sort_by_order = funcObj.get_query_string('extra_sort_by_order');
                }
              funcObj.custom_alert_message(data.message,'success',"my-publications?current_page="+current_page+'&number_of_records='+number_of_records+'&class_id='+class_id+'&category_id='+category_id+'&sub_category_id='+sub_category_id+'&content_status='+content_status+'&extra_sort_by_order='+extra_sort_by_order)
              
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
    getCategories = () => {
        let endPoint = 'get-categories';
        let postBodyData = {}
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(data => {


            if (data.code == 200) {
                console.log(data)
                this.setState({
                    default_categories: data.data
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




    getContent = () => {
        let book_id = funcObj.get_query_string('book_id');
        let postBodyData = {
            'content_id': book_id
        };
        let endPoint = 'content-detail';

        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            // console.log(endPoint + ' response', data)
            if (data.code == 200) {

                console.log("detail", data)
                this.setState({
                    content_id: data.data.content_id,
                    publisher_id: data.data.publisher_id,
                    class_id: data.data.class_id,
                    class_name:data.data.class_name,
                    categories: data.data.category_array,
                    subcategories: data.data.sub_category_array,
                    Title: data.data.title,
                    Subtitle: data.data.subtitle,
                    author_name: data.data.author_name,
                    Genre: data.data.genre,
                    publishing_year: data.data.publishing_year,
                    Language: data.data.language,
                    Description: data.data.description,
                    other_sources_link: data.data.other_sources_link,
                    // Bibliography: data.data.bibliography,
                    isbn: data.data.isbn_content,
                    class_number: data.data.class_number,
                    subject: data.data.content_subject,
                    e_shelve_code: data.data.eshelve_code,
                    tags: data.data.tags,
                    discount_price: data.data.discounted_price,
                    content_type: data.data.content_type,
                    actual_price: data.data.content_price,
                    publishing_house: data.data.publishing_house,
                    temp_record: data.data.temp_record,
                    coverImage: data.data.main_content_image,
                    content_reader: data.data.content_reader,
                    editor: data.data.editor,
                    // coverimgSrc:data.data.main_content_image,
                    upload_content: data.data.upload_content,
                    // coverimgSrc:
                    // indeximgSrc:
                    // otherimgSrc:
                    // currency: data.data.currency,
                    quantity: (data.data.no_of_copies == -1) ? "" : (data.data.no_of_copies == null) ? 1 : data.data.no_of_copies,
                    days: (data.data.display_upto == -1) ? "" : (data.data.display_upto == null) ? 30 : data.data.display_upto,
                    drm_no_of_devices: data.data.number_of_devices,

                    copy_paste: data.data.copy_paste,
                    printing: data.data.printing,
                    downloads: data.data.downloads,

                    copy_past_permission: (data.data.copy_paste == 1) ? true : false,
                    printing_permission: (data.data.printing == 1) ? true : false,
                    download_permission: (data.data.downloads == 1) ? true : false,

                    no_of_copie_permission: (data.data.no_of_copies == -1) ? true : false,
                    display_upto_permission: (data.data.display_upto == -1) ? true : false,

                    title_disable: true,
                    subtitle_disable: true,
                    edition: data.data.edition,
                    publication_details: data.data.publication_details,
                    note: data.data.note,
                    issn: data.data.issn,

                    // for_junior_reader: data.data.for_junior_reader
                })
                if (data.data.no_of_copies == -1) {
                    this.setState({
                        noOfCopiesHtml: true,
                        quantity: ''
                    })
                }
                if (data.data.display_upto == -1) {
                    this.setState({
                        displayUptoHtml: true,
                        days: ''
                    })
                }
                if (data.data.content_type != 'paid') {
                    this.setState({
                        // currencyHtml: 'hide',
                        discount_price: '',
                        actual_price: '',
                    });
                }
                this.getClasses();
                this.getCategories();

            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    showCloseButton: true,
                    text: data.message,
                    icon: 'error',
                    focusConfirm: false,
                    showConfirmButton: false,
                })
            }
        });
    }

    render() {
     
        return (
            <React.Fragment>

                {
                    this.state.classes && Object.keys(this.state.classes).length > 0 && this.state.default_categories && Object.keys(this.state.default_categories).length > 0 ?


                        <form id="geniusform"  className='single_upload_frm' onSubmit={this.handleSubmit}>
                            <div className="card mt-4">
                                <div className="dashboard-box">
                                    <div className="clearfix top-head mb-2">
                                        <h3 className="dashboard-title title-margin my-2 float-left">Content</h3>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6 after_line_h100">
                                            <div className="form-group">
                                                <div className="form-head mb-3  clearfix">
                                                    <span className="bg-white d-inline-block px-3">Content Preferences</span>
                                                </div>
                                                <label htmlFor="classes" className="pl-3">Select Content Classes <small>(You can Select only one class)</small> </label>
                                                <div className="custom-radio pl-3 row">


                                                    {
                                                        this.state.classes && Object.keys(this.state.classes).length > 0 ?
                                                            this.state.classes.map((classd, index) => {
                                                                let checked = (this.state.class_id == classd.class_id) ? true : false;
                                                                return (
                                                                    <div key={index} className="col-lg-6 col-md-6 col-sm-6">
                                                                        <input defaultChecked={checked} type="radio" onChange={(e) =>this.onChangeClassValue(e,classd)} name="radio1"  id={`class_` + classd.class_id} value={classd.class_id} />
                                                                        <label htmlFor={`class_` + classd.class_id}>{classd.class_title_s}</label>
                                                                    </div>

                                                                )
                                                            })
                                                            : null}


                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="pl-3">Select Content Categories & Sub Categories <small>(You can Select multiple categories)</small> </label>
                                                <div className="pl-3 row">
                                                    <ul className='col-md-12 ul-li'>
                                                        {
                                                            this.state.default_categories && Object.keys(this.state.default_categories).length > 0 ?
                                                                this.state.default_categories.map((category, index) => {
                                                                    let found = "";

                                                                    if (this.state.categories.length > 0) {
                                                                        found = (this.state.categories).find(element => element == category.category_id);
                                                                    }

                                                                    let checked = (found == category.category_id) ? true : false;

                                                                    return (
                                                                        <React.Fragment key={index}>

                                                                            <li>

                                                                                <div className="custom-checkbox">
                                                                                    <input defaultChecked={checked} type="checkbox" id={`#category` + category.category_id} value={category.category_id} onChange={this.onChangeCategoriesValue} />
                                                                                    <label data-toggle="collapse" data-target={`#category` + category.category_id} htmlFor={`#category` + category.category_id} aria-expanded={checked} aria-controls="collapseOne">
                                                                                        {category.category_name}
                                                                                    </label>
                                                                                </div>
                                                                                <ul className={(checked == true) ? "collapse show" : "collapse"} id={`category` + category.category_id} data-parent="#accordion">
                                                                                    <li className='row'>
                                                                                        {
                                                                                            category.subcategories.map((subcategory, index) => {
                                                                                                let found = '';
                                                                                                if (this.state.subcategories.length > 0) {
                                                                                                    found = (this.state.subcategories).find(element => element == subcategory.sub_category_id);
                                                                                                }

                                                                                                let checked = (found == subcategory.sub_category_id) ? true : false;

                                                                                                return (
                                                                                                    <div key={index} className="col-lg-6 col-md-6 col-sm-6">
                                                                                                        <div className="form-group">
                                                                                                            <div className="custom-checkbox">
                                                                                                                <input defaultChecked={checked} type="checkbox" id={`subcategory_` + subcategory.sub_category_id} value={subcategory.sub_category_id} onChange={this.onChangeSubCategoriesValue} />
                                                                                                                <label htmlFor={`subcategory_` + subcategory.sub_category_id}>{subcategory.sub_category_name}</label>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>

                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </li>
                                                                                </ul>
                                                                            </li>

                                                                        </React.Fragment>
                                                                        // <div key={index} className="col-lg-6 col-md-6 col-sm-6">
                                                                        //     <div className="form-group">
                                                                        //         <div className="custom-checkbox">
                                                                        //             <input defaultChecked={checked} type="checkbox" id={`category_` + category.category_id} value={category.category_id} onChange={this.onChangeCategoriesValue} />
                                                                        //             <label htmlFor={`category_` + category.category_id}>{category.category_name}</label>
                                                                        //         </div>
                                                                        //     </div>
                                                                        // </div>
                                                                    )
                                                                })
                                                                : null}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="form-head mb-3"> <span className="bg-white d-inline-block px-3">Content Details</span></div>
                                            <div className="form-group">
                                                <label className="pl-3"> Title  </label>
                                                <input type="text" className="input-field form-control" value={this.state.Title} onChange={this.handleChange} placeholder="Enter Content Title" name="Title" id="title" />
                                            </div>
                                            <div className="form-group">
                                                <label className="pl-3"> Subtitle </label>
                                                <input type="text" className="input-field form-control" value={this.state.Subtitle} onChange={this.handleChange} placeholder="Enter Content Subtitle" name="Subtitle" />
                                            </div>
                                            <div className="form-group">
                                                <label className="pl-3"> Edition </label>
                                                <input type="text" className="input-field form-control" value={this.state.edition} onChange={this.handleChange} placeholder="Enter Content Edition" name="edition" id="edition" />
                                            </div>
                                            <div className="form-group">
                                                <label className="pl-3"> Editor </label>
                                                <input type="text" className="input-field form-control" value={this.state.editor} onChange={this.handleChange} placeholder="Enter Content Editor" name="editor" />
                                            </div>
                                            {
                                                AUTH_USER != null && AUTH_USER.account_type == 'admin' ?
                                                    <React.Fragment>
                                                        <div className="form-group">
                                                            <label className="pl-3"> Content sources </label>
                                                            <select className="input-field form-control" onChange={(e) => this.handleOnchangeSource(e)}>
                                                                {funcObj.getContentSourcesDropdown()}
                                                            </select>
                                                        </div>
                                                        <div className="form-group source_childs d-none" id="publishing_houses">
                                                            <label className="pl-3"> Publishing houses </label>
                                                            <select className="input-field form-control" defaultValue="">
                                                                <option defaultValue="">Select Publishing houses</option>
                                                                <option>Booktalk Africa</option>
                                                                <option>TellingTales Press</option>
                                                                <option>Evangel Publishing House</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group source_childs d-none" id="content_aggregators">
                                                            <label className="pl-3"> Content aggregators </label>
                                                            <select className="input-field form-control" defaultValue="">
                                                                <option defaultValue="">Select Content aggregators</option>
                                                                <option>Flipboard</option>
                                                                <option>Pocket</option>
                                                                <option>Panda</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group source_childs d-none" id="independant_authors">
                                                            <label className="pl-3"> Independent authors </label>
                                                            <select className="input-field form-control" defaultValue="">
                                                                <option defaultValue="">Select Independent authors</option>
                                                                <option>Binyavanga Wainaina</option>
                                                                <option>Yvonne Adhiambo Owuor</option>
                                                                <option>Liaquat Ahamed</option>
                                                            </select>
                                                        </div>
                                                    </React.Fragment>
                                                    : null
                                            }
                                            <div className="form-group">
                                                <label className="pl-3"> Publishing house </label>
                                                <input type="text" className="input-field form-control" value={this.state.publishing_house} onChange={this.handleChange} placeholder="Enter Publishing house" name="publishing_house" />
                                            </div>

                                            <div className="form-group">
                                                <label className="pl-3">Author</label>
                                                <input type="text" className="input-field form-control" value={this.state.author_name} onChange={this.handleChange} placeholder="Enter Author name" name="author_name" />
                                            </div>
                                            <div className="form-group">
                                                <label className="pl-3"> Genre </label>
                                                <input type="text" className="input-field form-control" value={this.state.Genre} onChange={this.handleChange} placeholder="Enter Genre" name="Genre" />
                                            </div>
                                            <div className="form-group">
                                                <label className="pl-3"> Publishing Year </label>
                                                {/* <input type="date" max={this.state.setMaxDate} className="input-field form-control" value={this.state.date} onChange={this.handleChange} placeholder="Publishing date" name="publishing_year" /> */}
                                                {/* <select className="input-field form-control" value={this.state.publishing_year} onChange={this.handleChange} placeholder="Publishing date" name="publishing_year">
                                                    <option>Year</option>
                                                    {funcObj.year()}
                                                </select> */}
                                                <input type="number" className="input-field form-control" value={this.state.publishing_year} onChange={this.handleChange} placeholder="Enter publishing year eg. 1980" name="publishing_year" id="publishing_year" />
                                            </div>
                                            <div className="form-group">
                                                <label className="pl-3"> Publication  Details </label>
                                                <textarea type="text" maxLength='300' value={this.state.publication_details} onChange={this.handleChange} className="input-field form-control mb-0" placeholder="Enter content Publication Details" name="publication_details" style={{ minHeight: '120px' }}></textarea>

                                            </div>
                                            <div className="form-group">
                                                <label className="pl-3"> Language </label>
                                                <input type="text" className="input-field form-control" value={this.state.Language} onChange={this.handleChange} placeholder="Enter Language" name="Language" />
                                            </div>
                                            <div className="form-group">
                                                <label className="pl-3"> Licence Type </label>
                                                <select defaultValue={this.state.content_type} onChange={this.handleChange} name="content_type" data-style="rounded-pill" className=" form-control icon-arrow">
                                                    <option defaultValue="" >Select Licence Type</option>
                                                    <option value="free">Free</option>
                                                    <option value="membership">For Members</option>
                                                    <option value="paid">For sale</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="pl-3">Description</label>
                                                <textarea type="text" maxLength='1500' value={this.state.Description} onChange={this.handleChange} className="input-field form-control mb-0" placeholder="Enter content Description" name="Description" ></textarea>
                                                <small className="text-right d-block">{this.state.des_chars_left} out of 1500 words</small>
                                            </div>
                                            <div className="form-group">
                                                <label className="pl-3">Other sources link</label>
                                                <input type="text" value={this.state.other_sources_link} onChange={this.handleChange} className="input-field form-control mb-0" placeholder="Enter Other sources Link" name="other_sources_link" />
                                            </div>

                                            {/* <div className="form-group">
                                                <label className="pl-3">Bibliography</label>
                                                <textarea type="text" maxLength='500' value={this.state.Bibliography} onChange={this.handleChange} className="input-field form-control mb-0" placeholder="Enter content Bibliography" name="Bibliography" ></textarea>
                                                <small className="text-right d-block">{this.state.bib_chars_left} out of 500 words</small>
                                            </div> */}




                                        </div>
                                        <div className="col-lg-6 ">
                                            <div className="form-head mb-3  clearfix">
                                                <span className="bg-white d-inline-block px-3">Upload Content</span>
                                            </div>
                                            <div className="form-group">
                                                {/* <div className="drop-zone-wrap p-2">
                                                    <div className="drop-zone"> */}
                                                        {/* <span className="drop-zone__prompt mt-3">
                                                    <img src={funcObj.assets_path("/images/icons/photo-icon.svg")} width="50" className="mr-1" alt="Home" /><br></br>
                                                    Drag and Drop
                                                    <div>or</div>
                                                    <div className="color_blue">
                                                        Browse files
                                                    </div>
                                                    <small>Single file Only</small>
                                                </span> */}
                                                        {/* <input type="file" onChange={this.handleChange} name="myFile" className="drop-zone__input1" />
                                                    </div>
                                                </div> */}
                                                {/* <div className="form-group clearfix">
                                                    <small className="d-block float-left">Accepted Type : pdf,  webm, mp4, mpeg, epub, jpeg, docx </small>
                                                    <small className="d-block float-right">Single File Only</small> */}
                                                    {/* <small className="d-block float-right"><Link to={{ pathname:funcObj.files_path('files/sample_files/content.csv')}} target="_blank">Download Sample file</Link></small> */}
                                                {/* </div> */}
                                                <fieldset>
                                                <div className="drop-zone-wrap p-2">
                                                    <div className="drop-zone chunk_upload_input">
                                                    <ReactResumableJs
                                                        fileUploaded={this.fileUploaded}
                                                        uploaderID="image-upload"
                                                        dropTargetID="myDropTarget"
                                                        filetypes={this.state.filetypes}
                                                        fileAccept="image/*"
                                                        fileAddedMessage="Started!"
                                                        completedMessage="Complete!"
                                                        service={funcObj.chunk_upload_url()+"single-upload"}
                                                        textLabel="Choose Content File"
                                                        previousText=""
                                                        disableDragAndDrop={true}
                                                        onFileSuccess={(file, message) => {
                                                           console.log('onFileSuccess file',file)
                                                         
                                                        }}
                                                        onFileAdded={(file, resumable) => {
                                                            resumable.upload();
                                                        }}
                                                        
                                                        maxFiles={1}
                                                        query_data={{
                                                             class_name:this.state.class_name
                                                         }}
                                                        myFile ={this.state.myFile}
                                                      
                                                        startButton={true}
                                                        pauseButton={false}
                                                        cancelButton={false}
                                                        onStartUpload={() => {
                                                            console.log("Start upload");
                                                        }}
                                                        onCancelUpload={() => {
                                                            this.inputDisable = false;
                                                        }}
                                                        onPauseUpload={() => {
                                                            this.inputDisable = false;
                                                        }}
                                                        onResumeUpload={() => {
                                                            this.inputDisable = true;
                                                        }}
                                                    />
                                                    </div>
                                                    </div>
                                                </fieldset>
                                            </div>




                                            <div className="form-head mb-3  clearfix">
                                                <span className="bg-white d-inline-block px-3">Cover Image</span>
                                            </div>
                                            <div className="form-group">
                                                <div className="drop-zone-wrap p-2">
                                                    <div className="drop-zone">
                                                        {/* <span className="drop-zone__prompt mt-3">
                                                    <img src={funcObj.assets_path("/images/icons/photo-icon.svg")} width="50" className="mr-1" alt="Home" /><br></br>
                                                    Drag and Drop
                                                    <div>or</div>
                                                    <div className="color_blue">
                                                        Browse files
                                                    </div>this.state.coverImage
                                                    <small>Single Images Only</small>
                                                </span> */}
                                                        <img style={{ marginRight: 20, width: 100, height: 100 }} src={this.state.coverImage} />
                                                        {(this.state.coverimgSrc) ? <img style={{ marginRight: 20, width: 100, height: 100 }} src={this.state.coverimgSrc} />
                                                            : null}
                                                        <input type="file" onChange={this.handleChange} name="coverImage" className="drop-zone__input1" />
                                                    </div>
                                                </div>
                                                <div className="form-group clearfix">
                                                    <small className="d-block float-left">Accepted Type : .jpg, .jpeg, .png</small>
                                                    <small className="d-block float-right">Single Images Only</small>
                                                </div>
                                                {/* <button type="button" className="btn darkBtn roundedBtn w-100">Upload</button> */}
                                            </div>

                                            {/* <div className="form-head mb-3  clearfix">
                                        <span className="bg-white d-inline-block px-3">Index Image</span>
                                    </div>
                                    <div className="form-group">
                                        <div className="drop-zone-wrap p-2">
                                            <div className="drop-zone">
                                                <span className="drop-zone__prompt mt-3">
                                                    <img src={funcObj.assets_path("/images/icons/photo-icon.svg")} width="50" className="mr-1" alt="Home" /><br></br>
                                                    Drag and Drop
                                                    <div>or</div>
                                                    <div className="color_blue">
                                                        Browse files
                                                    </div>
                                                    <small>Single Images Only</small>
                                                </span>
                                                {(this.state.indeximgSrc) ? <img style={{ marginRight: 20, width: 100, height: 100 }} src={this.state.indeximgSrc} /> : null}
                                                <input type="file" onChange={this.handleChange} name="indexImage" className="drop-zone__input1" />
                                            </div>
                                        </div>
                                        <div className="form-group clearfix">
                                            <small className="d-block float-left">Accepted Type : .jpg, .jpeg, .png</small>
                                            <small className="d-block float-right">Single Images Only</small>
                                        </div>
                                        <button type="button" className="btn darkBtn roundedBtn w-100">Upload</button>
                                    </div> */}
                                            {/* <div className="form-head mb-3  clearfix">
                                        <span className="bg-white d-inline-block px-3">Other Image</span>
                                    </div>
                                    <div className="form-group">
                                        <div className="drop-zone-wrap p-2">
                                            <div className="drop-zone">
                                                <span className="drop-zone__prompt mt-3">
                                                    <img src={funcObj.assets_path("/images/icons/photo-icon.svg")} width="50" className="mr-1" alt="Home" /><br></br>
                                                    Drag and Drop
                                                    <div>or</div>
                                                    <div className="color_blue">
                                                        Browse files
                                                    </div>
                                                    <small>Single Images Only</small>
                                                </span>
                                                {(this.state.otherimgSrc) ? <img style={{ marginRight: 20, width: 100, height: 100 }} src={this.state.otherimgSrc} /> : null}
                                                <input type="file" onChange={this.handleChange} name="otherImage" className="drop-zone__input1" />
                                            </div>
                                        </div>
                                        <div className="form-group clearfix">
                                            <small className="d-block float-left">Accepted Type : .jpg, .jpeg, .png</small>
                                            <small className="d-block float-right">Single Images Only</small>
                                        </div>
                                        <button type="button" className="btn darkBtn roundedBtn w-100">Upload</button>
                                    </div> */}

                                            {/* <div className="form-head mb-3 clearfix">
                                        <span className="bg-white d-inline-block px-3">Allow to Sale <small>(If not enabled, Content will be Marked Free)</small> </span>
                                        <span className="bg-white d-inline-block pl-3 float-right">
                                            <label className="switch">
                                                <input type="checkbox" id="price"  onChange={this.handleChange} name='content_type' />
                                                <span className="slider round"></span>
                                            </label>
                                        </span>
                                    </div> */}
                                            {(this.state.content_type == 'paid') ?
                                                <div>

                                                    <div className="form-head mb-3  clearfix">
                                                        <span className="bg-white d-inline-block px-3">Price details</span>
                                                    </div>
                                                    <div className="price-container  w-100">
                                                        <div className="w-100">
                                                            <label className="pl-3">Actual Price</label>
                                                            <div className="form-group">
                                                                <input type="number" className="input-field form-control" value={this.state.actual_price} onChange={this.handleChange} placeholder="Enter Actual Price" name="actual_price" />

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="price-container  w-100">
                                                        <div className="w-100">
                                                            <label className="pl-3">Discounted Price</label>
                                                            <div className="form-group">
                                                                <input type="number" className="input-field form-control" value={this.state.discount_price} onChange={this.handleChange} placeholder="Enter Discounted Price" name="discount_price" />

                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div className="currency form-group">
                                                        <label className="pl-3">Currency</label>
                                                        <select data-style="rounded-pill" value={this.state.currency} onChange={this.handleChange} className=" form-control" name='currency'>
                                                            <option value='KSH'>KSH</option>
                                                            <option value='USD'>USD</option>
                                                            <option value='INR'>INR</option>
                                                            <option value='EUR'>EUR</option>
                                                            <option value='AFN'>AFN</option>
                                                            <option value='AUD'>AUD</option>
                                                        </select>
                                                    </div> */}
                                                </div> : null}





                                            <div className="form-head mb-3  clearfix">
                                                <span className="bg-white d-inline-block px-3">DRM Settings</span>
                                            </div>


                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                        <label className="pl-3">No. of copies</label>
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                        <div className="custom-checkbox">
                                                            <input defaultChecked={this.state.no_of_copie_permission} type="checkbox" onChange={this.handleChange} name='unlimited_copies' id="unlimited_copies" />
                                                            <label htmlFor="unlimited_copies">Unlimited Copies</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <input type="number" value={this.state.quantity} onChange={this.handleChange} name="quantity" className="form-control" disabled={this.state.unlimited_copies} />
                                            </div>

                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                        <label className="pl-3">Display upto(in days)</label>
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                        <div className="custom-checkbox">
                                                            <input defaultChecked={this.state.display_upto_permission} type="checkbox" onChange={this.handleChange} name='unlimited_access' id="unlimited_access" limit={10} />
                                                            <label htmlFor="unlimited_access">Unlimited Access</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <input type="number" value={this.state.days} onChange={this.handleChange} name="days" className="form-control" disabled={this.state.displayUptoHtml} />
                                            </div>
                                            {/* <div className="form-group">
                                        <div className="custom-checkbox">
                                            <input type="checkbox" onChange={this.handleChange} name='unlimited_access' id="unlimited_access" />
                                            <label htmlFor="unlimited_access">Unlimited Access</label>
                                        </div>
                                    </div> */}
                                            {/* <div className="form-group">
                                        <label className="pl-3">Subscriptional/Non Subscriptional </label>
                                        <div className="custom-radio text-center">
                                            <input type="radio" name="subscriptional_type" value='Subscriptional' onChange={this.handleChange} id="subscriptional" />
                                            <label htmlFor="subscriptional">Subscriptional</label>
                                            <input type="radio" name="subscriptional_type" value='non_subscriptional' onChange={this.handleChange} id="non_subscriptional" />
                                            <label htmlFor="non_subscriptional">Non Subscriptional</label>
                                         
                                        </div>
                                    </div> */}




                                            <div className="form-group">
                                                {/* <span>Copying and Paste</span> */}
                                                <div className="custom-checkbox">
                                                    <input value={this.state.copy_paste} defaultChecked={this.state.copy_past_permission} type="checkbox" name="copy_paste" onChange={this.handleChange} id="drm_cp" />
                                                    <label htmlFor="drm_cp" className=""> Copying and Paste </label>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                {/* <span>Printing</span> */}
                                                <div className="custom-checkbox">
                                                    <input defaultChecked={this.state.printing_permission} type="checkbox" name="printing" onChange={this.handleChange} id="drm_printing" />
                                                    <label htmlFor="drm_printing">Printing</label>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <span>Number of devices</span>
                                                <input type="number" name="drm_no_of_devices" value={this.state.drm_no_of_devices} onChange={this.handleChange} className="form-control" />
                                            </div>


                                            <div className="form-group">
                                                <div className="custom-checkbox">
                                                    <input defaultChecked={this.state.download_permission} type="checkbox" name="downloads" onChange={this.handleChange} id="drm_downloads" />
                                                    <label htmlFor="drm_downloads">Downloads</label>
                                                </div>
                                            </div>




                                            <div className="form-head mb-3  clearfix">
                                                <span className="bg-white d-inline-block px-3">Other details</span>
                                            </div>
                                            <div className="form-group">
                                                <label className="pl-3">Content Reader </label>
                                                <select className="input-field form-control" value={this.state.content_reader} onChange={this.handleChange} name="content_reader" id="content_reader">
                                                    <option value="">Select content reader</option>
                                                    <option value="adult">Adult</option>
                                                    <option value="junior">Junior</option>
                                                    <option value="both">Both</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="pl-3">ISBN </label>
                                                <input type="text" className="input-field form-control" value={this.state.isbn} onChange={this.handleChange} placeholder="Enter ISBN" name="isbn" />
                                            </div>
                                            <div className="form-group">
                                                <label className="pl-3">ISSN </label>
                                                <input type="text" className="input-field form-control" value={this.state.issn} onChange={this.handleChange} placeholder="Enter ISSN" name="issn" />
                                            </div>


                                            {
                                                AUTH_USER != null && (AUTH_USER.account_type == 'librarian' || AUTH_USER.account_type == 'senior_librarian' || AUTH_USER.account_type == 'admin') ?
                                                    <>
                                                        <div className="form-group">
                                                            <label className="pl-3">Series Statement </label>
                                                            <input type="text" className="input-field form-control" value={this.state.series_statement} onChange={this.handleChange} placeholder="Enter Series statement" name="series_statement" />
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="pl-3">Class number </label>
                                                            <input type="text" className="input-field form-control" value={this.state.class_number} onChange={this.handleChange} placeholder="Enter Class number" name="class_number" />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="pl-3">Tags</label>
                                                            <input type="text" className="input-field form-control" value={this.state.tags} onChange={this.handleChange} placeholder="Enter Tags" name="tags" />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="pl-3">Note</label>
                                                            <textarea type="text" maxLength='300' value={this.state.note} onChange={this.handleChange} className="input-field form-control mb-0" placeholder="Enter content Note" name="note" ></textarea>

                                                        </div>

                                                    </>


                                                    : null}
                                            <div className="form-group">
                                                <label className="pl-3">Subject </label>
                                                <input type="text" className="input-field form-control" value={this.state.subject} onChange={this.handleChange} placeholder="Enter subject" name="subject" />
                                            </div>




                                            {/* <div className="form-group">
                                                <div className="custom-checkbox">
                                                    <input defaultChecked={this.state.for_junior_reader} type="checkbox" name="for_junior_reader" onChange={this.handleChange} id="for_junior_reader" />
                                                    <label htmlFor="for_junior_reader">For Junior readers</label>
                                                </div>
                                            </div> */}

                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Link to="/my-publications" type="button" className="btn go_back_btn  lightBtn roundedBtn py-1 px-3 mr-1 mr-3 w120">Go Back</Link>
                                        {
                                            (this.state.temp_record) ? <button type="button" className="btn addCart py-1 px-3 mr-1" onClick={this.removeContent}>remove</button> : null
                                        }
                                        <button type="submit" className="btn addCart py-1 px-3 mr-1">Save</button>
                                    </div>
                                </div>
                            </div>

                        </form>
                        : null
                }
            </React.Fragment>
        );
    }
}
