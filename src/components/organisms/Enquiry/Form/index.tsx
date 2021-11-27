import { CheckCircle } from '@material-ui/icons';
import Axios from 'axios';
import { useFormik } from 'formik';
import {
  Button, Checkbox, Fade, FormControlLabel, ListSubheader, MenuItem, Select, TextField, Typography,
} from 'helpmycase-storybook/dist/components/External';
import theme from 'helpmycase-storybook/dist/theme/theme';
import React from 'react';
import * as Yup from 'yup';
import useHelpmycaseSnackbar from '../../../../hooks/useHelpmycaseSnackbar';
import { CASES } from '../../../../models/cases';
import { Request } from '../../../../models/request';
import environmentVars from '../../../../utils/env.variables';
import BigMessage from '../../../molecules/bigMessage';

type AreasOfPractice = { id: string, name: string }[];

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  topic: CASES.ACCIDENTANDINJURY,
  case: '',
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
  topic: Yup.mixed<CASES>().oneOf(Object.values(CASES), 'Invalid topic selected from dropdown'),
  case: Yup.string().required('This field is required'),
});

async function getAreasOfPractice(): Promise<AreasOfPractice> {
  try {
    const response = await Axios({
      url: environmentVars.REACT_APP_API_URL,
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

const EnquiryForm: React.FC = () => {
  const [agreeToTerms, setAgreeToTerms] = React.useState<boolean>(false);
  const [areasOfPractice, setAreasOfPractice] = React.useState<AreasOfPractice>([]);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);

  const snackbar = useHelpmycaseSnackbar();
  const formik = useFormik({
    initialValues,
    initialErrors: initialValues,
    validationSchema: formValidationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const request: Request = {
          name: `${values.firstName} ${values.lastName}`,
          case: values.case,
          email: values.email,
          phoneNumber: values.phoneNumber,
          topic: values.topic as unknown as CASES,
        };

        await Axios.post('https://forms-api.helpmycase.co.uk/submit', request);
        setSuccess(true);
      } catch (e: any) {
        snackbar.trigger(`Something went wrong submitting your request error: ${e.message}`);
      } finally {
        setLoading(false);
      }
    },
  });

  React.useEffect(() => {
    (async () => {
      try {
        const response = await getAreasOfPractice();
        setAreasOfPractice(response);
      } catch (e) {
        snackbar.trigger(`Something went wrong submitting your request error: ${e.message}`);
      }
    })();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    formik.setFieldValue('topic', event.target.value);
  };

  return (
    <div style={{ backgroundColor: '#F7F7F7' }} className="paddingLeft paddingRight paddingTop paddingBottom relative">
      <Fade in={!success}>
        <form className="flex column" onSubmit={formik.handleSubmit}>
          <div className="flex row spaceBetween marginBottom">
            <TextField
              id="firstName"
              label="First Name"
              variant="standard"
              required
              fullWidth
              className="marginRightMedium"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={formik.touched.firstName && formik.errors.firstName}
              error={Boolean(formik.touched.firstName && formik.errors.firstName)}
            />
            <TextField
              id="lastName"
              label="Last Name"
              variant="standard"
              required
              fullWidth
              className="marginLeftMedium"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              helperText={formik.touched.lastName && formik.errors.lastName}
              error={Boolean(formik.touched.lastName && formik.errors.lastName)}
            />
          </div>
          <div className="flex row spaceBetween marginBottom">
            <TextField
              id="phoneNumber"
              label="Phone Number"
              variant="standard"
              required
              fullWidth
              className="marginRightMedium"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
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
              variant="standard"
              required
              fullWidth
              className="marginLeftMedium"
              helperText={formik.touched.email && formik.errors.email}
              error={Boolean(formik.touched.email && formik.errors.email)}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
          </div>
          <Select
            labelId="demo-simple-select-standard-label"
            id="case"
            onChange={handleChange}
            value={formik.values.topic}
            label="Age"
            className="marginBottom"
          >
            <ListSubheader>Business Enquiries</ListSubheader>
            {
              areasOfPractice.map((aop) => (
                <MenuItem value={aop.id} key={aop.id}>
                  { aop.name }
                </MenuItem>
              ))
            }
          </Select>

          <TextField
            id="case"
            label="Case Description"
            variant="outlined"
            multiline
            required
            fullWidth
            className="marginBottom"
            rows={10}
            helperText={formik.touched.case && formik.errors.case}
            error={Boolean(formik.touched.case && formik.errors.case)}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <FormControlLabel
            checked={agreeToTerms}
            onChange={() => setAgreeToTerms(!agreeToTerms)}
            className="marginBottomMedium"
            style={{ marginRight: 0 }}
            control={<Checkbox checked={agreeToTerms} />}
            label={(
              <span>
                I agree to the
                <a href="https://wwww.helpmycase.co.uk/terms" style={{ color: theme.palette.primary.main, fontWeight: 600, paddingLeft: '4px' }}>Terms and Conditions</a>
              </span>
            )}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={Boolean(
              !agreeToTerms
          || !formik.isValid
          || loading,
            )}
          >
            Submit application

          </Button>
        </form>
      </Fade>
      <Fade in={success}>
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
    </div>
  );
};

export default EnquiryForm;
