import styled from '@emotion/styled';

const defaultHeight = '500px';
const LoadingSpinner = styled.div`
  width: 200px;
  height: 300px;
  display: inline-block;
  overflow: hidden;
  position: absolute;
  top: 0;
`;

const LoadingWrapper = styled.div<{ LoadHeight: string }>`
  width: 100%;
  height: ${(props) => (props.LoadHeight !== '' ? props.LoadHeight : defaultHeight)};
  position: absolute;
  top: 0;
  background-color: #ffffff;
  z-index: 3;
  opacity: 60%;
  display: flex;
  flex-direction: column;

  align-items: center;
`;
const Loading = ({ LoadHeight }: { LoadHeight: string }) => {
  return (
    <LoadingWrapper LoadHeight={LoadHeight}>
      <LoadingSpinner>
        <div className="ball">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </LoadingSpinner>
    </LoadingWrapper>
  );
};

export default Loading;