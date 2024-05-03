import * as React from "react";
import Functions from "../helpers/functions";
import { Link } from 'react-router-dom';
// import image from "../../test_image.png";
const funcObj = new Functions();
export class PrintLoggedinhistory extends React.PureComponent {
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
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col"> User Agent</th>
                        <th scope="col"> IP Address</th>
                        <th scope="col"> Date</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        transactions.map((value, index) => {
                            return (
                                <tr key={index}>
                                    <td className="text-wrap" w>{value.user_agent}</td>
                                    <td>{value.ip_address}</td>
                                    <td>{value.created_at}</td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
        );
    }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
    // eslint-disable-line max-len
    return <PrintLoggedinhistory ref={ref} text={props.text} />;
});
