import { StyledButton } from './Button.styled';

type Props = {
  children: string;
  onClick: () => void;
  fullWidth?: boolean;
  cancel?: boolean;
  margin?: boolean;
  smallSize?: boolean;
  disabled?: boolean;
};

const Button = ({
  children,
  onClick,
  fullWidth,
  cancel,
  margin,
  smallSize,
  disabled,
}: Props): JSX.Element => (
  <StyledButton
    cancel={cancel}
    fullWidth={fullWidth}
    disabled={disabled}
    margin={margin}
    smallSize={smallSize}
    onClick={onClick}>
    {children}
  </StyledButton>
);

Button.defaultProps = {
  margin: true,
};

export default Button;
