import React, {useEffect, useState} from 'react';
import styled from "styled-components";

const StyledBaseInput = styled.input`
  background: #FFFFFF;
  border: 1px solid #E8E8E8;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 8px 12px;
  outline: none;
  font-size: 14px;
  font-weight: 500;
  margin:${({margin}) => margin || '0px'};
  color: #1C1C1C;
  display: inline-block;
  min-width: 250px;
  min-height: 36px;
  &::placeholder{
    color: #979797;
  }
`;
const BaseInput = ({clear='',placeholder='Search',disabled=false,handleInput=()=>{
    console.log('input')
},...props}) => {
    const [val,setVal] = useState(clear);

    const handleChange = (e) => {
        setVal(e.target.value);
        handleInput(e.target.value);
    }

    useEffect(() => {
        if(clear.length == 0){
          setVal(clear)
        }
    },[clear])
    return (
       <StyledBaseInput value={val} placeholder={placeholder} disabled={disabled} onChange = {handleChange} {...props} />
    );
};

export default BaseInput;
