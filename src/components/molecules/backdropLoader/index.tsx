import {
  Backdrop, CircularProgress, createStyles, makeStyles, Theme,
} from 'helpmycase-storybook/dist/components/External';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => createStyles({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

interface IProps {
    open: boolean;
}

const BackdropLoader: React.FC<IProps> = ({ open }: IProps) => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default BackdropLoader;
