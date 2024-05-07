import * as React from "react";
import Functions from "../helpers/functions";
import { Link } from 'react-router-dom';
// import image from "../../test_image.png";
const funcObj = new Functions();
export class ComponentToPrinttnx extends React.PureComponent {
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
    const { transactions } = this.props;

    return (
        <table className="table">
        <thead>
            <tr>

                <th></th>
                <th scope="col" ><div className='curptr' onClick={(e) => this.setExtraSort(e, 'title')}>Title <i class="fa fa-sort"></i></div></th>
                <th scope="col"><div className='curptr' onClick={(e) => this.setExtraSort(e, 'publishing_house')}>Publishing house <i class="fa fa-sort"></i></div></th>
                <th scope="col">Copy Paste </th>
                <th scope="col">Printing</th>
                <th scope="col">Number of devices</th>
                <th scope="col">Downloads</th>
            </tr>
        </thead>
        <tbody>
            {transactions && Object.keys(transactions).length > 0 ?
                transactions.map((book, index) => {

                    let content_picture = '';
                    if (book.main_content_image == null || book.main_content_image == "") {
                        content_picture = funcObj.getBookTypeListSmallIcon(book.class_name);
                    } else {
                        content_picture = book.main_content_image;
                    }

                    return (
                        <React.Fragment>
                            <tr>
                                <td>
                                    {funcObj.displayClassIcon(book.class_name)}
                                    <span className="img-wrap cat__img">
                                        <img src={content_picture} width="30" alt="books" />
                                    </span>

                                </td>
                                <td><Link to={`/private-bookdetail?book_id=` + book.encrypted_content_id + `&backlink=drm-report`}>{book.title}</Link></td>
                                <td>{book.publishing_house}</td>
                                <td>{book.copy_paste == 0 ? <span>No</span> : <span>Yes</span>}</td>
                                <td>{book.printing == 0 ? <span>No</span> : <span>Yes</span>}</td>
                                <td>{book.total_number_of_devices}</td>
                                <td>{book.downloads == 0 ? <span>No</span> : <span>Yes</span>}</td>
                            </tr>
                        </React.Fragment>)

                }) : null}
        </tbody>
    </table>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len
  return <ComponentToPrinttnx ref={ref} text={props.text} />;
});
