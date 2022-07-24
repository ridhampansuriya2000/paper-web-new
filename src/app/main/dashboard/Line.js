import React, {PureComponent, useEffect} from 'react';
import { AreaChart, LineChart,  Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    Grid,
} from '@mui/material';

const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        // amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        // amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        // amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        // amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        // amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        // amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        // amt: 2100,
    },
];

export default function Line(props){
  const [labels,setLabels] = React.useState([]);

    let tempArray = [0];
   let genrateYaxis =()=>{
        let tempValue = tempArray[tempArray.length - 1] + 5;
        if(tempValue <= props.line_min_max?.attempt__max){
            tempArray.push(tempValue);
            genrateYaxis();
        }else {
            setLabels(()=>(tempArray))
        }
    }

    useEffect(()=>{
        genrateYaxis();
    },[props.line_min_max]);


        return (
            <Grid sx={{margin: '10px'}}>
                {/*<ResponsiveContainer width="600px" height="600px">*/}
                <AreaChart
                    width={400}
                    height={400}
                    data={props?.line_chart}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="updated_at__month" />
                    <YAxis
                        domain={[0, props?.line_min_max?.attempt__max]}
                        tickCount={labels.length} tick={labels}/>
                    <Tooltip />
                    {/*<Line type="monotone" dataKey="pv" stroke="#8884d8" />*/}
                    <Area type="monotone" dataKey="Total Attempt" stroke="#8884d8" fill="#8884d8" />
                </AreaChart >
                {/*</ResponsiveContainer>*/}
            </Grid>
        );
}