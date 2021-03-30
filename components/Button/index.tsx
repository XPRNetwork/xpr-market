import { StyledButton } from './Button.styled';

type Props = {
  children: string;
  onClick: () => void;
  fullWidth?: boolean;
  cancel?: boolean;
  disabled?: boolean;
};

const Button = ({
  children,
  onClick,
  fullWidth,
  cancel,
  disabled,
}: Props): JSX.Element => (
  <StyledButton
    cancel={cancel}
    fullWidth={fullWidth}
    disabled={disabled}
    onClick={onClick}>
    {children}
  </StyledButton>
);

export default Button;
