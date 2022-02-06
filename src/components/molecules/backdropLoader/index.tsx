import {
  Backdrop, CircularProgress,
} from 'helpmycase-storybook/dist/components/External';
import theme from 'helpmycase-storybook/dist/theme/theme';
import React from 'react';

interface IProps {
  open: boolean;
}

const BackdropLoader: React.FC<IProps> = ({ open }: IProps) => (
  <Backdrop
    sx={{
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    }}
    open={open}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
);

export default BackdropLoader;
