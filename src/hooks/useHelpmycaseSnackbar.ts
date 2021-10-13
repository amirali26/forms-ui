import { useSnackbar } from 'notistack';

const useHelpmycaseSnackbar = () => {
  const snackbar = useSnackbar();

  const trigger = (message: string, variant?: 'success' | 'info' | 'error') => snackbar.enqueueSnackbar(message, {
    variant: variant || 'error',
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center',
    },
  });

  return {
    trigger,
  };
};

export default useHelpmycaseSnackbar;
