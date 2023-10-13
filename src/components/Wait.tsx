
import styled from '@emotion/styled';
import { ConstructPhoto } from './const';



const Box = styled.div`
  position:relative;
  padding: 30px;
  border: 2px solid #144480;
  background-color:#FEFEFE ;
  border-radius: 10px;
  width: 100%;
  height: auto;
  display: flex;
  box-sizing: border-box;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 50px;
`;


export const Wait = () => {


  return (
    <>
      <Box>

        {ConstructPhoto}
      </Box>

    </ >
  );
};


