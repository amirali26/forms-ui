import { CheckCircle } from '@mui/icons-material';
import Axios, { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import {
  Autocomplete,
  Box,
  Button, Checkbox, Fade,
  FormControlLabel, ListSubheader, MenuItem, Select, Slide, TextField, Typography,
  LinearProgress,
} from 'helpmycase-storybook/dist/components/External';
import theme from 'helpmycase-storybook/dist/theme/theme';
import React from 'react';
import * as Yup from 'yup';
import useHelpmycaseSnackbar from '../../../../hooks/useHelpmycaseSnackbar';
import { CASES } from '../../../../models/cases';
import { Request } from '../../../../models/request';
import environmentVars from '../../../../utils/env.variables';
import BackdropLoader from '../../../molecules/backdropLoader';
import BigMessage from '../../../molecules/bigMessage';

type AreasOfPractice = { id: string, name: string }[];

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  topic: CASES.ACCIDENTANDINJURY,
  enquiry: '',
  postcode: '',
  region: '',
  areaInRegion: '',
};

const formValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .max(30, '')
    .required('This field is required'),
  lastName: Yup.string()
    .max(30, '')
    .required('This field is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('This field is required'),
  phoneNumber: Yup.string()
    .matches(new RegExp('^[0-9]*$'), 'Phone number should be only numbers')
    .min(10, 'Phone number should be 10 digits')
    .max(10, 'Phone number should be 10 digits')
    .required('Phone number is a required field'),
  topic: Yup.string().required('Invalid topic selected from dropdown'),
  enquiry: Yup.string().required('This field is required'),
  postcode: Yup.string().required('Please provide a postcode'),
  region: Yup.string().required(),
  areaInRegion: Yup.string().required(),
});

async function getAreasOfPractice(): Promise<AreasOfPractice> {
  try {
    const response = await Axios({
      url: `${window.location.href.includes('loca2lhost') ? 'https://localhost:8082' : environmentVars.REACT_APP_API_URL}/graphql`,
      method: 'post',
      data: {
        query: `
        query AreasOfPractices {
          areasOfPractices {
            id,
            name
          }
        }`,
      },
    });

    return response.data.data.areasOfPractices;
  } catch (e) {
    throw Error('Error obtaining areas of practice');
  }
}

async function submitRequest(request: Request): Promise<void> {
  try {
    const response = await Axios({
      url: `${window.location.href.includes('loca2lhost') ? 'https://localhost:8082' : environmentVars.REACT_APP_API_URL}/graphql`,
      method: 'post',
      data: {
        query: `
          mutation AddRequest($ar: RequestInput!) {
            addRequest(requestInput: $ar) {
              id,
            }
          }`,
        variables: { ar: { ...request } },
      },
    });

    if (response.data.errors?.length) {
      throw Error(response.data.errors[0].message || 'Something went wrong submitting your enquiry');
    }
    return response.data.data.areasOfPractices;
  } catch (e: unknown) {
    throw Error((e as Error).message || 'Something went wrong submitting your request, please try again later');
  }
}

function calculateHeading(stage: 0 | 1 | 2 | 3 | 4 | 5, prevStage: number) {
  const calcStage = stage === 0 ? prevStage : stage;
  switch (calcStage) {
    case 0:
    case 1:
      return '1. Some information about you';
    case 2:
      return '2. Contact details';
    case 3:
      return '3. Case details';
    case 4:
      return '4. Submit application';
    default:
      return '1. Some information about you';
  }
}

const EnquiryForm: React.FC = () => {
  const [stage, setStage] = React.useState<0 | 1 | 2 | 3 | 4 | 5>(1);
  const [showPhoneNumber, setShowPhoneNumber] = React.useState<boolean>(false);
  const [agreeToTerms, setAgreeToTerms] = React.useState<boolean>(false);
  const [areasOfPractice, setAreasOfPractice] = React.useState<AreasOfPractice>([]);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [options, setOptions] = React.useState<string[]>([]);

  const formContainerRef = React.useRef(null);
  const previousValue = React.useRef(1);
  const snackbar = useHelpmycaseSnackbar();
  const formik = useFormik({
    initialValues,
    initialErrors: initialValues,
    validationSchema: formValidationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setStage(5);
        const request: Request = {
          name: `${values.firstName} ${values.lastName}`,
          phoneNumber: values.phoneNumber,
          description: values.enquiry,
          email: values.email,
          topic: values.topic,
          areaInRegion: values.areaInRegion,
          postCode: values.postcode,
          region: values.region,
          showPhoneNumber,
        };

        await submitRequest(request);
        setSuccess(true);
      } catch (e) {
        snackbar.trigger((e as Error).message);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleAutoComplete = async (postcode: string) => {
    const response: AxiosResponse<{ status: string, result: string[] }> = await Axios.get(`https://api.postcodes.io/postcodes/${postcode}/autocomplete`);
    setOptions(response.data.result || []);
  };

  const handlePostcodeSelect = async (postcode: string) => {
    const response: any = await Axios.get(`https://api.postcodes.io/postcodes/${postcode}`);
    if (!response.error) {
      formik.setFieldValue('postcode', postcode);
      formik.setFieldValue('areaInRegion', response.data.result.primary_care_trust);
      formik.setFieldValue('region', response.data.result.region);
    }
  };

  const handleChange = (event: any) => {
    formik.setFieldValue('topic', event.target.value);
  };

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await getAreasOfPractice();
        setAreasOfPractice(response);
        if (response.length > 0) {
          formik.setFieldValue('topic', response[0].id);
        }
      } catch (e: any) {
        snackbar.trigger(e?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    })();
    handleAutoComplete('N');
  }, []);

  const handlePrevious = () => {
    if (stage === 1) return;
    const currentStage = stage;

    setStage(0);
    setTimeout(() => {
      previousValue.current = currentStage - 1;
      setStage(currentStage - 1 as any);
    }, 300);
  };

  const handleNext = () => {
    if (stage === 4) return;
    const currentStage = stage;

    setStage(0);
    setTimeout(() => {
      previousValue.current = currentStage + 1;
      setStage(currentStage + 1 as any);
    }, 300);
  };

  return (
    <Box
      className="paddingLeft paddingRight paddingTop paddingBottom relative"
      ref={formContainerRef}
      sx={{
        height: '100%',
        '& form': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
        '& form > div: first-of-type': {
          height: '174px',
          '& > div': {
            transform: 'translateY(-100%)',
          },
        },
      }}
    >
      <Fade in={!success && stage !== 5}>
        <div>
          <LinearProgress value={(((stage === 0 ? previousValue.current : stage) / 10) * 100) * 2} sx={{ marginBottom: '16px' }} variant="determinate" />
          <Typography variant="h5" sx={{ marginBottom: '8px' }}>{calculateHeading(stage, previousValue.current)}</Typography>
        </div>
      </Fade>
      <BackdropLoader open={loading} />
      <form className="flex column" onSubmit={formik.handleSubmit} autoComplete="new-password">
        <div>
          <Slide
            direction="right"
            in={stage === 1}
            container={formContainerRef.current}
            unmountOnExit
            mountOnEnter
          >
            <div>
              <TextField
                id="firstName"
                label="First Name"
                variant="standard"
                required
                fullWidth
                onChange={formik.handleChange}
                className="marginBottomMedium"
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
                helperText={formik.touched.firstName && formik.errors.firstName}
                error={Boolean(formik.touched.firstName && formik.errors.firstName)}
              />
              <TextField
                id="lastName"
                label="Last Name"
                variant="standard"
                required
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.lastName}
                helperText={formik.touched.lastName && formik.errors.lastName}
                error={Boolean(formik.touched.lastName && formik.errors.lastName)}
              />
            </div>
          </Slide>
          <Slide direction="right" in={stage === 2} container={formContainerRef.current} unmountOnExit mountOnEnter>
            <div>
              <TextField
                id="phoneNumber"
                label="Phone Number"
                variant="standard"
                required
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.phoneNumber}
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                error={Boolean(formik.touched.phoneNumber && formik.errors.phoneNumber)}
                InputProps={{
                  startAdornment: (
                    <Typography className="marginRightSmall grey">+44</Typography>
                  ),
                }}
              />
              <TextField
                id="email"
                label="Email Address"
                className="marginBottomMedium marginTopMedium"
                variant="standard"
                required
                fullWidth
                value={formik.values.email}
                helperText={formik.touched.email && formik.errors.email}
                error={Boolean(formik.touched.email && formik.errors.email)}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <Autocomplete
                sx={{ marginBottom: '16px' }}
                disablePortal
                id="combo-box-demo"
                options={options}
                fullWidth
                onChange={(e, newValue) => {
                  if (newValue) {
                    handlePostcodeSelect(newValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Postcode"
                    value={formik.values.postcode}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password',
                    }}
                  />
                )}
                onInputChange={(event) => handleAutoComplete((event.target as any).value as string)}
              />
            </div>
          </Slide>
          <Slide direction="right" in={stage === 3} container={formContainerRef.current} unmountOnExit mountOnEnter>
            <div>
              <Select
                labelId="demo-simple-select-standard-label"
                className="marginBottomMedium"
                id="case"
                onChange={handleChange}
                value={formik.values.topic}
                label="Age"
                sx={{ width: '100%' }}
              >
                <ListSubheader>Business Enquiries</ListSubheader>
                {
                  areasOfPractice?.map((aop) => (
                    <MenuItem value={aop.id} key={aop.id}>
                      {aop.name}
                    </MenuItem>
                  ))
                }
              </Select>
              <TextField
                id="enquiry"
                label="Case Description"
                variant="outlined"
                multiline
                required
                fullWidth
                rows={3}
                helperText={formik.touched.enquiry && formik.errors.enquiry}
                error={Boolean(formik.touched.enquiry && formik.errors.enquiry)}
                value={formik.values.enquiry}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </div>
          </Slide>
          <Slide direction="right" in={stage === 4} container={formContainerRef.current} unmountOnExit mountOnEnter>
            <div>
              <FormControlLabel
                checked={agreeToTerms}
                onChange={() => setAgreeToTerms(!agreeToTerms)}
                style={{ marginRight: 0 }}
                control={<Checkbox checked={agreeToTerms} />}
                label={(
                  <span>
                    I agree to the
                    <a href="https://helpmycase.co.uk/terms-of-service/" target="_blank" style={{ color: theme.palette.primary.main, fontWeight: 600, paddingLeft: '4px' }} rel="noreferrer">Terms and Conditions</a>
                  </span>
                )}
              />
              <FormControlLabel
                checked={showPhoneNumber}
                onChange={() => setShowPhoneNumber(!showPhoneNumber)}
                className="marginBottomMedium"
                style={{ marginRight: 0 }}
                control={<Checkbox checked={showPhoneNumber} />}
                label="Show my phone number publicy to solicitors (this would allow them to be able to contact you via phone)"
              />
            </div>
          </Slide>
          <div />
        </div>
        <Fade in={!success && stage !== 5}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }} className="marginTop">
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePrevious}
              disabled={stage === 1}
            >
              Previous
            </Button>
            <Button
              type={stage === 4 ? 'submit' : 'button'}
              variant="contained"
              color="primary"
              onClick={stage !== 4 ? handleNext : undefined}
              disabled={stage === 4 ? Boolean(
                !agreeToTerms
                || !formik.isValid
                || loading,
              ) : false}
            >
              {stage === 4 ? 'Submit Application' : 'Next'}
            </Button>
          </div>
        </Fade>
      </form>
      <Fade in={success && stage === 5}>
        <div>
          <BigMessage
            icon={<CheckCircle />}
            title="Request Submitted"
            subtitle="Great news we have successfully received your request. Now sit back and wait for solicitors to contact you regarding your legal case. You should expect to receive your first response within 24 hours!"
            buttonProps={{
              children: 'Create an account',
            }}
          />
        </div>
      </Fade>
    </Box>
  );
};

export default EnquiryForm;
