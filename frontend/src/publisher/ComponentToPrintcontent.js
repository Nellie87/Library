import * as React from "react";
import Functions from "../helpers/functions";
import { Link } from 'react-router-dom';
// import image from "../../test_image.png";
const funcObj = new Functions();
export class ComponentToPrintcontent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { checked: false };
  }

  canvasEl;

  componentDidMount() {
    // const ctx = this.canvasEl.getContext("2d");
    // if (ctx) {
    //   ctx.beginPath();
    //   ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    //   ctx.stroke();
    //   ctx.fillStyle = "rgb(200, 0, 0)";
    //   ctx.fillRect(85, 40, 20, 20);
    //   ctx.save();
    // }
  }

  handleCheckboxOnChange = () =>
    this.setState({ checked: !this.state.checked });

  setRef = (ref) => (this.canvasEl = ref);

  render() {
    const { contents } = this.props;
    console.log('view contents ', contents);
    return (
        // <div></div>
        <table className="table" id="viewTb">
             <thead>
                 <tr>
                     <th></th>
                     <th scope="col" >Book Title<i style={{ display: 'none' }} className="sort-icon"></i></th>
                     <th scope="col">Book Subtitle <i style={{ display: 'none' }} className="sort-icon"></i></th>
                     <th scope="col">Author Name <i style={{ display: 'none' }} className="sort-icon"></i></th>
                     {/* <th scope="col">Buyer Name <i style={{display:'none'}} className="sort-icon"></i></th>
         <th scope="col">Buyer Mobile <i style={{display:'none'}} className="sort-icon"></i></th> */}
                     <th scope="col">Licence <i style={{ display: 'none' }} className="sort-icon"></i></th>
                     <th scope="col">Total Views <i style={{ display: 'none' }} className="sort-icon"></i></th>
                     <th scope="col">Views <i style={{ display: 'none' }} className="sort-icon"></i></th>
                 </tr>
             </thead>
             <tbody>
                 {
                     contents && Object.keys(contents).length > 0 ?
                         contents.map((content, index) => {
                             return (
                                 <React.Fragment>
                                     <tr key={index}>
                                         <td>

                                             <span className="img-wrap cat__img">
                                                 {(content.main_content_image) ? <img src={content.main_content_image} width="30" alt="books" /> :
                                                     <img src={funcObj.assets_path("/images/books/Image3.png")} width="30" alt="books" />
                                                 }
                                             </span>
                                         </td>
                                         <td ><Link to={`/private-bookdetail?book_id=` + content.encrypted_content_id + `&backlink=views-on-publisher-content`}>{content.title} <p>({content.class_title_s})</p></Link></td>
                                         <td>{content.subtitle}</td>
                                         <td>{content.author_name}</td>
                                         {/* <td>{content.first_name} {content.last_name}</td>
             <td>{content.mobile}</td> */}
                                         <td> {
                                             content.content_type == 'free' ?
                                                 <span>{funcObj.showContentTypeTitle(content.content_type)}</span>
                                                 :
                                                 <span> {content.content_price} {funcObj.getCurrency()}</span>
                                         }
                                         </td>
                                         <td>{content.content_views}</td>
                                         {(content.content_views > 0) ? <td><Link to={`/view-on-single-content?content_id=` + content.content_id + `&backlink=views-on-publisher-content`}><button className="btn addCart py-1 px-3 mr-1" >View</button></Link></td>
                                             : <td><button className="btn addCart py-1 px-3 mr-1" disabled >View</button></td>}
                                         {/* <td><Link to={`/view-on-single-content?content_id=`+content.content_id+`&backlink=views-on-publisher-content`}><button className="btn darkBtn" >View</button></Link></td> */}
                                    </tr>
                                </React.Fragment>
                            )
                        }) : null}
            </tbody>
        </table>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len
  return <ComponentToPrintcontent ref={ref} text={props.text} />;
});
