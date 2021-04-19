import { StyledSpinner } from './Spinner.styled';

type Props = {
  radius: string;
  hasBackground: boolean;
};

const Spinner = ({ radius, hasBackground }: Props): JSX.Element => (
  <StyledSpinner viewBox="0 0 50 50" hasBackground={hasBackground}>
    <circle
      className="path"
      cx="25"
      cy="25"
      r={radius}
      fill="none"
      strokeWidth="4"
    />
  </StyledSpinner>
);

Spinner.defaultProps = {
  radius: '20',
  hasBackground: false,
};

export default Spinner;
