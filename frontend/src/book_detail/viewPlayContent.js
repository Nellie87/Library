import React from "react";
import Swal from "sweetalert2";
import Functions from "../helpers/functions";

const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class ViewPlayContent extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            book_detail:{},
            is_preview:false,
        };
       
    }
    componentDidMount(){
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
          });
        this.getBookDetail();
        this.addview();
    }
    getBookDetail() {
        console.log('getBookDetail......')
        let book_id = funcObj.get_query_string('book_id');
        let is_preview = funcObj.get_query_string('is_preview');
        console.log("is_preview",is_preview)
       
        let postBodyData = {
            'content_id': book_id
        };
        let endPoint = 'content-detail';

        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            console.log(endPoint + ' response', data)
            if (data.code == 200) {
                this.setState({
                    book_detail: data.data,
                    is_preview:is_preview =='1'?true:false
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
        });
    }
    addview() {
        if(AUTH_USER != null){
            let book_id = funcObj.get_query_string('book_id');
            let user = funcObj.getLocalStorage('user');
            let postBodyData = {
                'content_id': book_id,
                "reader_id": user.user.id
            };
            let endPoint = 'views';
            funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            });
        }
    }
    render(){
        const content = this.state.book_detail;
        return (
            <div className="each_player" >

                {
                content.upload_content && funcObj.is_contents_view_permitted(content) == 'can_access' 
                && Object.keys(content).length > 0 ?
                funcObj.playerAll(content, this.state.is_preview)
                :null}
            
        </div>
        );
    }

}