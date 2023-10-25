import React from 'react';

interface IconProps {
  width: string;
  height: string;
  fill?: string;
}

const SaveSvg: React.FC<IconProps> = ({ width, height, fill }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 60 61" fill={fill} xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_437_343)">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M59.9769 23.6427C59.3709 35.3399 50.6979 41.217 39.9489 49.9256C34.2849 54.5141 25.8069 54.5141 20.1219 49.9513C9.44496 41.3799 0.471969 35.3856 0.0129697 23.2827C-0.563029 8.07414 18.1839 1.84844 28.8339 14.257C29.4159 14.937 30.5799 14.9227 31.1589 14.2427C41.7729 1.79128 60.7839 8.09988 59.9769 23.6427Z" />
      </g>
      <defs>
        <clipPath id="clip0_437_343">
          <rect width="60" height="60" transform="translate(0 0.5)" />
        </clipPath>
      </defs>
    </svg>


  );
};

export default SaveSvg;