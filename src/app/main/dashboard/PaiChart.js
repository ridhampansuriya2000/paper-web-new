import React, { PureComponent, Component } from 'react';
import {
    Grid,
} from '@mui/material';
import './styles.css'

// import CanvasJSReact from './canvasjs.react1';
import CanvasJSReact from './canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class PaiChart extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const options = {
            // theme: "theme2",
            exportEnabled: false,
            animationEnabled: true,
            // title: {
            //     text: "Website Traffic Sources"
            // },
            data: [{
                type: "pie",
                startAngle: 75,
                toolTipContent: "<b>{label}</b>: {y}",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} : {y}",
                dataPoints: this.props.pieChart || []
            }]
        }
        return (
            <div>
                <CanvasJSChart options = {JSON.parse(JSON.stringify(options))}
                     onRef={ref => this.chart = ref}
                />
                {/*<div id='chartContainer' className='chartContainer'></div>*/}
                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            </div>
        );
    }
}
export default PaiChart;
