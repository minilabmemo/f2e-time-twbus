import React from 'react';

interface IconProps {
  width: string;
  height: string;
  fill?: string;
}

const SaveSvg: React.FC<IconProps> = ({ width, height, fill }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 60 46" fill={fill} xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M59.9769 15.9997C59.3709 27.6968 50.6979 33.5739 39.9489 42.2825C34.2849 46.8711 25.8069 46.8711 20.1219 42.3082C9.44496 33.7368 0.471969 27.7425 0.0129697 15.6396C-0.563029 0.431077 18.1839 -5.79463 28.8339 6.61394C29.4159 7.29394 30.5799 7.27964 31.1589 6.59964C41.7729 -5.85178 60.7839 0.456811 59.9769 15.9997Z" />
    </svg>



  );
};

export default SaveSvg;