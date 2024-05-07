import React from "react";
import Functions from "./functions";

export default function AudioPlayer(props){
    const content = props.content;
    let file_name = '';
    const funcObj = new Functions();
    if (props.is_preview == true) {
      file_name = content.preview_file;
    }
    else {
      file_name = content.upload_content;
    }
    let content_picture = '';
    if (content.main_content_image == null || content.main_content_image == '') {
        content_picture = funcObj.assets_path("/images/dummy-image.jpg");
    } else {
        content_picture = content.main_content_image;
    }

    return (
        <React.Fragment>
          <div className="search_container">
                            <div className="banner text-center">
                                <div className="container">
                                    <span className="page_title">{content.title}</span>
                                </div>
                            </div>
                            <div className="container">
                      <div className="search_wrap clearfix ">
        <div className="audio_player_section">
            <div className="">
            
            <div className="text-center">
           
            <div className="cover-img">
            <img src={content_picture}  alt="cart" />
            </div>
            </div>
            </div>
            <div className="audio_player">
            
            <div className="text-center">
              <audio style={{ width: "100%" }}  controls controlsList="nodownload">
              <source src={file_name} type="audio/ogg" />
              <source src={file_name} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
        </React.Fragment>
    )

}