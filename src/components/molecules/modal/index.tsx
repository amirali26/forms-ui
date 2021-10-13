import {
  makeStyles, Theme, createStyles, Backdrop, Modal as MuiModal, Fade,
} from 'helpmycase-storybook/dist/components/External';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => createStyles({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4, 4, 4, 4),
  },
}));

interface IProps {
    open: boolean,
    children: JSX.Element | JSX.Element[]
    handleClose: () => void,
}
const Modal: React.FC<IProps> = ({ open, children, handleClose }: IProps) => {
  const classes = useStyles();
  return (
    <MuiModal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          { children }
        </div>
      </Fade>
    </MuiModal>
  );
};

export default Modal;
