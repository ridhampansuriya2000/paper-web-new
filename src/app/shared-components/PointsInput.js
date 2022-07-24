import React, {useEffect, useRef} from 'react'
import {Box} from "@mui/material";

const PointsInput = ({points, setPoints, disabled=false}) => {
  const pointsRef = useRef([]);

  const onKeyDown = (index, e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      let s =  [...points]
      s.splice(index+1, 0, '')
      setPoints(s) // Adding a blank input
      setTimeout(()=>pointsRef.current[index+1]?.focus(),150)

    } else if (e.key === "Backspace" && points[index] === "") {
      e.preventDefault()
      setPoints(points.filter((item, i) => i !== index))
      pointsRef.current[index-1]?.focus()
    }
  }

  const onChange = (index, e) => {
    setPoints(points?.map((item, i) => {
      if(index === i) {
        return e.target.value
      } return item
    }))
  }

  useEffect(() => {
    if(points?.length===0){
      setPoints([''])
      setTimeout(()=>pointsRef.current[0]?.focus(),150)
    }
  }, [points]);

  return (
    <Box className="flex flex-col">
      {points?.map((point, index) => (
        <input className="border p-8 text-16" key={index} value={point}
               ref={el => pointsRef.current[index] = el}
               onChange={e=>onChange(index, e)}
               style={{outline:'none'}}
               placeholder='Start writing answer, Press ENTER to add point.'
               onKeyDown={e => onKeyDown(index, e)}
               disabled={disabled}/>
      ))}
    </Box>
  )
}


export default PointsInput;