import * as React from "react";
import Functions from "../helpers/functions";
import { Link } from 'react-router-dom';
// import image from "../../test_image.png";
const funcObj = new Functions();
export class ComponentToPrint extends React.PureComponent {
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
                <th scope="col" colSpan={2}>Content</th>
                <th scope="col" >Publishing house</th>
                <th scope="col">Total Sale</th>
                <th scope="col">Total Amount  </th>
            </tr>
        </thead>
        <tbody>

            {

                transactions && Object.keys(transactions).length > 0 ?
                    transactions.map((item, index) => {
                        let content_picture = '';
                        if (item.main_content_image == null || item.main_content_image == "") {
                            content_picture = funcObj.getBookTypeListSmallIcon(item.class_name);
                        } else {
                            content_picture = item.main_content_image;
                        }


                        return (
                            <React.Fragment key={index}>
                                <tr>
                                    <td>
                                        {funcObj.displayClassIcon(item.class_name)}
                                        <span className="img-wrap cat__img ">
                                            <Link to={`/private-bookdetail?book_id=` + item.enc_content_id + `&backlink=content-sales`}>
                                                <img src={content_picture} width="30" alt="books" />
                                            </Link>

                                        </span>
                                    </td>
                                    <td>{item.title} ({item.class_title_s})</td>
                                    <td>{item.publishing_house}</td>
                                    <td>{item.count}</td>
                                    <td><sub>{funcObj.getCurrency()} &nbsp;</sub>{item.total_amount}</td>
                                </tr>
                            </React.Fragment>
                        )

                    })
                    : null
            }



        </tbody>
    </table>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len
  return <ComponentToPrint ref={ref} text={props.text} />;
});
