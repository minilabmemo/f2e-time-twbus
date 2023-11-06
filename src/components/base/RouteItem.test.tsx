import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RouteItem } from './RouteItem';
import { BusRoute } from '../../apis/useBusCityApi';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import { IconColors } from '../../utils/color';


const mockBusRoute: BusRoute = {
  RouteUID: '123',
  RouteName: {
    En: 'RouteNameEn',
    Zh_tw: 'RouteNameZh',
  },
  DepartureStopNameEn: 'DepartureStopNameEn',
  DepartureStopNameZh: 'DepartureStopNameZh',
  DestinationStopNameEn: 'DestinationStopNameEn',
  DestinationStopNameZh: 'DestinationStopNameZh',
  City: 'Taipei',
  RouteID: ''
};

describe('RouteItem', () => {

  it('renders the component with provided route data', () => {
    render(
      <Router> {/* Wrap RouteItem with BrowserRouter 因為 RouteItem裡面有NavLink 所以要修正 */}
        <RouteItem item={mockBusRoute} lang="en" />
      </Router>
    );

    expect(screen.getByText('RouteNameEn')).toBeInTheDocument();
    expect(screen.getByText('DepartureStopNameEn - DestinationStopNameEn')).toBeInTheDocument();
    expect(screen.getByText('Taipei')).toBeInTheDocument();
  });

  it('toggles the like status when the like button is clicked', () => {
    render(
      <Router>
        <RouteItem item={mockBusRoute} lang="en" />
      </Router>
    );
    //FIXME 提示不應該用querySelector 但是修正後很難抓到會失敗 待處理
    const svgIcon = screen.getByTestId('save-icon').querySelector('svg');
    expect(svgIcon).toHaveAttribute('fill', 'gray');

    fireEvent.click(screen.getByTestId('save-icon'));

    expect(svgIcon).toHaveAttribute('fill', IconColors.pinkFont);
  });

});
