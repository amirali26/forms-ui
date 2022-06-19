import { ButtonProps, Styles, Typography } from 'helpmycase-storybook/dist/components/External';
import theme from 'helpmycase-storybook/dist/theme/theme';
import React from 'react';

interface IProps {
  icon: JSX.Element,
  title: string,
  subtitle: string,
  buttonProps: ButtonProps,
}

const useStyles = Styles.makeStyles({
  iconHolder: {
    '& > svg': {
      width: '100%',
      height: '100%',
      color: theme.palette.primary.main,
    },
  },
});

const BigMessage: React.FC<IProps> = ({
  icon, title, subtitle, buttonProps,
}: IProps) => {
  const classes = useStyles();
  return (
    <div className="absolute alignCenter flex column center" style={{ width: '80%', maxWidth: '700px' }}>
      <div style={{ width: '60px', height: '60px' }} className={classes.iconHolder}>
        {icon}
      </div>
      <Typography variant="h3" className="marginBottomSmall textAlignCenter">{title}</Typography>
      <Typography variant="subtitle1" className="marginBottomMedium textAlignCenter">{subtitle}</Typography>
      {/* <Button variant="contained" color="primary" {...buttonProps}>
        {buttonProps.children}
      </Button> */}
    </div>
  );
};

export default BigMessage;
