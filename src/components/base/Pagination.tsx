import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onPageClick: (pageNumber: number) => void;
  clickFocusRef: any;
}

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .8em;
  margin-top: 20px;
  align-self: center;
`;

const PageNumber = styled.span<{ $active: boolean }>`
  user-select: none;
  cursor: pointer;
  margin: 0 8px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${({ $active }) => ($active ? '#1565c0' : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : '#000')};
  transition: background-color 0.3s, color 0.3s;
  transform-origin: bottom center;
  &:hover {
    background-color: #1565c0;
    color: #fff;
    transform: scale(1.2);
  }
`;

const NavigationButton = styled.span<{ disabled: boolean }>`
  user-select: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  margin: 0 8px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${({ disabled }) => (disabled ? '#ccc' : '#f0f0f0')};
  color: ${({ disabled }) => (disabled ? '#666' : '#000')};
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? '#ccc' : '#f0f0f0')};
  }
`;

const Ellipsis = styled.span`
  margin: 0 8px;
`;

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onNextPage, onPreviousPage, onPageClick, clickFocusRef }) => {
  const [activePage, setActivePage] = useState(currentPage);
  useEffect(() => {
    setActivePage(currentPage);
  }, [currentPage]);

  const handleClick = (pageNumber: number) => {
    setActivePage(pageNumber);
    onPageClick(pageNumber);
    clickFocusRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  const handleNextPage = () => {
    if (currentPage !== totalPages) {
      setActivePage((prevPage) => prevPage + 1);
      onNextPage();
    }
  };

  const handlePreviousPage = () => {
    if (currentPage !== 1) {
      setActivePage((prevPage) => prevPage - 1);
      onPreviousPage();
    }
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <PageNumber key={i} $active={activePage === i} onClick={() => handleClick(i)}>
            {i}
          </PageNumber>
        );
      }
    } else {
      const visiblePages = [1, activePage - 2, activePage - 1, activePage, activePage + 1, activePage + 2, totalPages];
      const filteredPages = visiblePages.filter((pageNumber, index, arr) => {
        return pageNumber > 0 && pageNumber <= totalPages && arr.indexOf(pageNumber) === index;
      });

      for (let i = 0; i < filteredPages.length; i++) {
        const pageNumber = filteredPages[i];
        pageNumbers.push(
          <PageNumber key={i} $active={activePage === pageNumber} onClick={() => handleClick(pageNumber)}>
            {pageNumber}
          </PageNumber>
        );
        if (i < filteredPages.length - 1 && filteredPages[i + 1] - pageNumber > 1) {
          pageNumbers.push(<Ellipsis key={`ellipsis-${i}`}>&hellip;</Ellipsis>);
        }
      }
    }

    return pageNumbers;
  };

  return (
    <PaginationContainer>
      <NavigationButton disabled={currentPage === 1} onClick={handlePreviousPage}>
        <FontAwesomeIcon icon={faAngleLeft} />
      </NavigationButton>
      {generatePageNumbers()}
      <NavigationButton disabled={currentPage === totalPages} onClick={handleNextPage}>
        <FontAwesomeIcon icon={faAngleRight} />
      </NavigationButton>
    </PaginationContainer>
  );
};

export default Pagination;
