import {
  Button, Checkbox, FormControlLabel, ListSubheader, MenuItem, Select, TextField,
} from 'helpmycase-storybook/dist/components/External';
import { useFormik } from 'formik';
import theme from 'helpmycase-storybook/dist/theme/theme';
import React from 'react';
import * as Yup from 'yup';
import useHelpmycaseSnackbar from '../../../../hooks/useHelpmycaseSnackbar';

const initialValues = {
  name: '',
};

const formValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('Account name is required'),
  lastName: Yup.string()
    .required('Account name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is a required field'),
  phoneNumber: Yup.string()
    .matches(new RegExp('^[0-9]*$'), 'Phone number should be only numbers')
    .min(10, 'Phone number should be 10 digits')
    .max(10, 'Phone number should be 10 digits')
    .required('Phone number is a required field'),
});

const EnquiryForm: React.FC = () => {
  const [agreeToTerms, setAgreeToTerms] = React.useState<boolean>(false);
  const [topic, setTopic] = React.useState(10);

  const snackbar = useHelpmycaseSnackbar();
  const formik = useFormik({
    initialValues,
    initialErrors: initialValues,
    validationSchema: formValidationSchema,
    onSubmit: async (values) => {
      try {
        console.log('hi');
      } catch (e) {
        snackbar.trigger(`Something went wrong submitting your request error: ${e.message}`);
      }
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    setTopic(event.target.value);
  };

  return (
    <div style={{ backgroundColor: '#F7F7F7' }} className="paddingLeft paddingRight paddingTop paddingBottom">
      <form className="flex column">
        <div className="flex row spaceBetween marginBottom">
          <TextField id="firstName" label="First Name" variant="standard" required fullWidth className="marginRightMedium" />
          <TextField id="lastName" label="Last Name" variant="standard" required fullWidth className="marginLeftMedium" />
        </div>
        <div className="flex row spaceBetween marginBottom">
          <TextField id="phoneNumber" label="Phone Number" variant="standard" required fullWidth className="marginRightMedium" />
          <TextField id="emailAddress" label="Email Address" variant="standard" required fullWidth className="marginLeftMedium" />
        </div>
        <Select
          labelId="demo-simple-select-standard-label"
          id="case"
          value={topic}
          onChange={handleChange}
          label="Age"
          className="marginBottom"
        >
          <ListSubheader>Business Enquiries</ListSubheader>
          <MenuItem value="Business Premises">Business Premises</MenuItem>
          <MenuItem value="Company and Commercial">Company and Commercial</MenuItem>
          <MenuItem value="Dispute Resolution">Dispute Resolution</MenuItem>
          <MenuItem value="Energy, Utilities and Transport">Energy, Utilities and Transport</MenuItem>
          <MenuItem value="Media IT and Intellectual Property">Media IT and Intellectual Property</MenuItem>
          <MenuItem value="Regulation and Compliance">Regulation and Compliance</MenuItem>
          <ListSubheader>Consumer Enquiries</ListSubheader>
          <MenuItem value="Accident and Injury">Accident and Injury</MenuItem>
          <MenuItem value="Consumer and Civil Rights">Consumer and Civil Rights</MenuItem>
          <MenuItem value="Employment">Employment</MenuItem>
          <MenuItem value="Family and Relationships">Family and Relationships</MenuItem>
          <MenuItem value="Houses, Property and Neighbors">Houses, Property and Neighbors</MenuItem>
          <MenuItem value="Immigration and Changing Countries">Immigration and Changing Countries</MenuItem>
          <MenuItem value="Mental Capacity">Mental Capacity</MenuItem>
          <MenuItem value="Money and Debit">Money and Debit</MenuItem>
          <MenuItem value="Social Welfare, health and Benefits">Social Welfare, health and Benefits</MenuItem>
          <MenuItem value="Wills, Trusts and Probate">Wills, Trusts and Probate</MenuItem>
        </Select>

        <TextField id="standard-basic" label="Case Description" variant="outlined" multiline required fullWidth className="marginBottom" rows={10} />
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
        <Button type="submit" variant="contained" color="primary">Submit application</Button>
      </form>
    </div>
  );
};

export default EnquiryForm;
