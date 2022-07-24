import React, {useEffect} from "react";

const CanvasJSReact = ({options,onRef}) =>{
    useEffect(()=>{
        window.onload = async function () {
            var chart = await new CanvasJS.Chart("chartContainer",
                options);
            chart.render();
        }
    },[options])
    return (
        <div id='chartContainer' className='chartContainer' ref={onRef} style={{height: '300px', width: '50%'}}></div>
    )
}
export default CanvasJSReact;