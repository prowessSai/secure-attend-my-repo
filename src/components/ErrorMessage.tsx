import { red } from '../assets/css/constants';

interface IProps {
  message: string;
}

const ErrorMessage = (props: IProps) => {
  const { message } = props;
  return <span style={{ fontSize: "12px", color: red }}>{message}</span>;
};

export default ErrorMessage;
