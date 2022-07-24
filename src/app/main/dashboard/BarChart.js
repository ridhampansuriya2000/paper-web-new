import React, {useEffect} from 'react';
import {BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {
    Grid,
} from '@mui/material';


export default function Example(props) {
    const [labels, setLabels] = React.useState([]);

    let tempArray = [0];
    let genrateYaxis = () => {
        let tempValue = tempArray[tempArray.length - 1] + 5;
        if (tempValue <= props?.bar_min_max?.amount__max) {
            tempArray.push(tempValue);
            genrateYaxis();
        } else {
            setLabels(() => (tempArray))
        }
    }

    useEffect(() => {
        genrateYaxis();
    }, [props?.bar_min_max]);


    return (
        <Grid sx={{margin: '10px'}}>
            {/*<ResponsiveContainer width="600px" height="600px">*/}
            <BarChart width={850} height={500} data={props.bar_chart || []}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="created_at__month"/>
                <YAxis
                    domain={[0, props?.amount__max]}
                    tickCount={labels.length}
                    tick={labels}
                />
                <Tooltip/>
                <Legend/>
                {/*<Bar dataKey="amount" fill="#639ef7" />*/}
                <Bar dataKey="Total Revenue" fill="#639ef7"/>
                {/* <Bar dataKey="Total Revenue" fill="#99e6ffd9"/> */}
                {/*<Bar dataKey="uv" fill="#82ca9d" />*/}
            </BarChart>
            {/*</ResponsiveContainer>*/}
        </Grid>
    );
}
