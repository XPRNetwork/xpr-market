import { ReactNode } from 'react';
import { StyledTableDataCell } from './TableDataCell.styled';

type Props = {
  children: ReactNode;
  onClick?: () => void;
};

const TableDataCell = ({ children, onClick }: Props): JSX.Element => {
  return (
    <StyledTableDataCell onClick={onClick}>{children}</StyledTableDataCell>
  );
};

export default TableDataCell;
