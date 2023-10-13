
import styled from '@emotion/styled';

import { useState } from 'react';
const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: scale-down;
  filter: drop-shadow(3px 3px 3px rgba(0, 0, 0, 0.25));
`;
const EmptyPhoto = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WarnPhotoText = styled.p`
  color: #f53939;
  font-size: .8em;
`;
const EmptyPhotoText = styled.p`
  color: #fff;
  font-size: .8em;
 
`;
interface AnimalImageProps {
  imageUrl: string;
}

const ImageLoad: React.FC<AnimalImageProps> = ({ imageUrl }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.log('ImageError:' + imageUrl);
    setImageError(true);
  };

  return (
    <>

      {imageError ? (
        <EmptyPhoto>
          <WarnPhotoText>圖片讀取失敗</WarnPhotoText>
        </EmptyPhoto>
      ) : (
        <Img src={imageUrl} alt="AnimalImage" onError={handleImageError} />
      )}
    </>
  );
};
const AnimalImage = ({ album_file }: { album_file: string }) => {
  return (
    <>
      {album_file ? (
        <ImageLoad imageUrl={album_file}></ImageLoad>
      ) : (
        <EmptyPhoto>
          <EmptyPhotoText>無提供圖片</EmptyPhotoText>
        </EmptyPhoto>
      )}
    </>
  );
};


export default AnimalImage;