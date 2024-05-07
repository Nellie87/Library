import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Slider from "react-slick";
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();

export default class SuggesstionSlider extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
        };
    }
    reloadDetailPage(e,selling,content){
        e.preventDefault();
        if(AUTH_USER == null){
            window.location = funcObj.getSitePath(`bookdetail?book_id=`+selling.encrypted_content_id+`&type=`+selling.class_id)
        }else{
            window.location = funcObj.getSitePath(`private-bookdetail?book_id=`+selling.encrypted_content_id+`&type=`+selling.class_id+`&backlink=`+this.props.backlink)
        }
        
    }
    render() {
        
        let topsellingSettings = {};
        let content = this.props.content;
        if (content.suggestion_list && content.suggestion_list.length > 0) {
            topsellingSettings = {
                slidesToShow: 4,
                slidesToScroll: 1,
                autoplay: false,
                autoplaySpeed: 3000,
                dots: false,
                pauseOnHover: false,
                centerPadding: '100px',
                responsive: [
                    {
                        breakpoint: 1400,
                        settings: {
                            slidesToShow: content.suggestion_list.length == 1? 1:2,
                        }
                    },
                    {
                        breakpoint: 1199,
                        settings: {
                            slidesToShow: 2,
                        }
                    },

                    {
                        breakpoint: 900,
                        settings: {
                            slidesToShow: 1,
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2,
                        }
                    },
                    {
                        breakpoint: 650,
                        settings: {
                            slidesToShow: 1,
                        }
                    }
                ]
            };
        }
        return (
            <React.Fragment>
               
                {content.suggestion_list && Object.keys(content.suggestion_list).length > 0 && Object.keys(topsellingSettings).length > 0 ?
                    <React.Fragment>
                    <div className="p-3 p-lg-4">
                        <h3 className="dashboard-title title-margin">You may also like</h3>
                    </div>
                    <Slider id="top_selling" className="stop-books" {...topsellingSettings}>
                        {

                            content.suggestion_list.map(
                                (selling, index) => {
                                    let defaultImage = '';
                                    if (selling.class_id == 1) {
                                        defaultImage = funcObj.assets_path("/images/icons/audiobook_blue.svg");
                                    }
                                    else if (selling.class_id == 2) {
                                        defaultImage = funcObj.assets_path("/images/icons/videobook_blue.svg");
                                    }
                                    else if (selling.class_id == 3) {
                                        defaultImage = funcObj.assets_path("/images/icons/ebook_blue.svg");
                                    }
                                    else if (selling.class_id == 4) {
                                        defaultImage = funcObj.assets_path("/images/icons/slide_blue.svg");
                                    }
                                    let content_picture = '';
                                    if (selling.main_content_image == null || selling.main_content_image == "") {
                                        content_picture = defaultImage;
                                    } else {
                                        content_picture = selling.main_content_image;
                                    }
                                    let classimage = '';
                                    if (selling.class_id == 1) {
                                        classimage = funcObj.assets_path("/images/icons/audio-tag.svg");
                                    }
                                    else if (selling.class_id == 2) {
                                        classimage = funcObj.assets_path("/images/icons/video-tag.svg");
                                    }
                                    else if (selling.class_id == 3) {
                                        classimage = funcObj.assets_path("/images/icons/book-tag.svg");
                                    }
                                    else if (selling.class_id == 4) {
                                        classimage = funcObj.assets_path("/images/icons/slides-tag.svg");
                                    }
                                    return (
                                        <div key={index} className="book-card-wrap">
                                            <div className="book-card ebook">
                                                <div className="img-wrap float-left">

                                                    <Link to='' onClick={(e) => this.reloadDetailPage(e,selling,selling)} >
                                                        <img src={content_picture} alt="books" />
                                                    </Link>
                                                </div>
                                                <div className="book-details float-left">
                                                <div className='top_tag'>{funcObj.getClassFaIcon(selling.class_name)} {selling.class_title_s}</div>
                                                    <div className="book-name">
                                                        {selling.title}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="description-text mt-3">
                                                {selling.description}
                                            </div>
                                        </div>
                                    )
                                }
                            )

                        }


                    </Slider>
                    </React.Fragment>
                    : null}
            </React.Fragment>
        );
    }
}