import * as React from "react";
import Functions from "../../helpers/functions";
import { Link } from 'react-router-dom';
// import image from "../../test_image.png";
const funcObj = new Functions();
export class PrintSearchReport extends React.PureComponent {
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
                        <th scope="col">Name</th>
                        <th scope="col">Total</th>
                    </tr>
                </thead>
                <tbody>




                    {
                        transactions.map((transaction, index) => {
                            return (
                                <tr>
                                    <td>{transaction.content_name}</td>
                                    <td>{transaction.total_sum_count}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>

            </table>
        );
    }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
    // eslint-disable-line max-len
    return <PrintSearchReport ref={ref} text={props.text} />;
});
