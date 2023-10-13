import React from 'react';
import main_img_1 from '../../images/main_img_1.png';
import main_img_2 from '../../images/main_img_2.png';
import main_img_3 from '../../images/main_img_3.png';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material';

interface TypeButtonProps {
  isShown: boolean;

  items?: {
    name: string;
    description: string;
    image: string | undefined;
    imageNode: React.ReactNode | undefined;
  }[];
}

var items = [
  {
    name: 'Main Img #1',
    description: 'Main Img',
    image: undefined,
    imageNode: <img alt="img 1" style={{ width: "min(100%,1200px)", display: 'block', margin: 'auto' }} src={main_img_1}></img>,
  },
  {
    name: 'Main Img #2',
    description: 'A real-life scene depicts a dog waiting for adoption in an animal shelter, set against a backdrop of sunny skies and houses',
    image: '',
    imageNode: <img alt="img 2" style={{ width: "min(100%,1200px)", display: 'block', margin: 'auto' }} src={main_img_2}></img>,
  },
  {
    name: 'Main Img #3',
    description: 'Food!',
    image: undefined,
    imageNode: <img alt="img 3" style={{ width: "min(100%,1200px)", display: 'block', margin: 'auto' }} src={main_img_3}></img>,
  },
];
/**
 * `CarouselMUI` 是一個引用 MUI 輪播器, items 為輪播內容, isShown控制左右選項是否出現
 */

const CarouselMUI = ({ isShown, items }: TypeButtonProps) => {


  return (
    <Carousel
      indicators={true}
      navButtonsAlwaysVisible={isShown}
      className="carousel"

      navButtonsProps={{          // Change the colors and radius of the actual buttons. THIS STYLES BOTH BUTTONS
        style: {
          backgroundColor: 'cornflowerblue',
        }
      }}
      indicatorContainerProps={{
        style: {
          margin: 'auto',

        }

      }}
      indicatorIconButtonProps={{
        style: {
          color: 'cornflowerblue',
        }
      }}
      activeIndicatorIconButtonProps={{
        style: {
          color: 'LightSkyBlue',
        }
      }}
      sx={{
        margin: '0 auto',
        boxSizing: 'border-box',

      }
      }>
      {items !== undefined && items.map((item, i) => <Item key={i} item={item} />)}
    </Carousel >
  );
};

function Item(props: { item: { name: string; description: string; image: string | undefined; imageNode: React.ReactNode } }) {
  return (
    <Paper
      sx={{
        margin: '0 auto',
        width: '80%',
        boxShadow: '0 0px 0px #ccc' /*diabled default boxShadow */,
      }}>
      {props.item.image !== undefined && props.item.image !== '' ? (
        <img src={props.item.image} alt={props.item.name} style={{ display: 'block', margin: 'auto' }}></img>
      ) : (
        <>{props.item.imageNode}</>
      )}
    </Paper>
  );
}

CarouselMUI.defaultProps = {
  items: items,
};

export default CarouselMUI;
