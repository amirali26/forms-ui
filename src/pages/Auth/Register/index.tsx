import { PersonAddOutlined } from '@material-ui/icons';
import { useFormik } from 'formik';
import {
  Button, Checkbox, CircularProgress, FormControlLabel, InputLabel, TextField, Typography,
} from 'helpmycase-storybook/dist/components/External';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import * as Yup from 'yup';
import FormTitle from '../../../components/molecules/auth/FormTitle';
import useAuth from '../useAuth';

const initialValues = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPasword: '',
};

const formValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is a required field'),
  lastName: Yup.string()
    .required('Last name is a required field'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is a required field'),
  phoneNumber: Yup.string()
    .min(5, 'Phone number should be atleast 5 characters in length')
    .required('Phone number is a required field'),
  password: Yup.string().min(8, 'Password must be 8 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const Register: React.FC = () => {
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);

  const { loading, signUp } = useAuth();
  const formik = useFormik({
    initialValues,
    validationSchema: formValidationSchema,
    onSubmit: (values) => signUp(values.email, values.password, values.email, values.phoneNumber),
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <FormTitle
        title="Create account"
        subtitle={'Manage your clients effectively. Let\'s get you all set up so you can start in no time!'}
      />
      <div className="flex row spaceBetween fullWidth">
        <div className="fullWidth marginTop marginRightMedium">
          <InputLabel htmlFor="input-with-icon-adornment" className="marginBottomSmall">
            First Name
            {' '}
            <span className="red">*</span>
          </InputLabel>
          <TextField
            required
            name="firstName"
            id="input-with-icon-adornment"
            color="primary"
            fullWidth
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </div>
        <div className="fullWidth marginTop">
          <InputLabel htmlFor="input-with-icon-adornment" className="marginBottomSmall">
            Last Name
            {' '}
            <span className="red">*</span>
          </InputLabel>
          <TextField
            id="input-with-icon-adornment"
            name="lastName"
            color="primary"
            fullWidth
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            required
          />
        </div>
      </div>
      <div className="flex row spaceBetween fullWidth">
        <div className="fullWidth marginTop marginRightMedium">
          <InputLabel htmlFor="input-with-icon-adornment" className="marginBottomSmall">
            Phone Number
            {' '}
            <span className="red">*</span>
          </InputLabel>
          <TextField
            name="phoneNumber"
            id="input-with-icon-adornment"
            required
            fullWidth
            color="primary"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            InputProps={{
              startAdornment: (
                <Typography className="marginRightSmall grey">+44</Typography>
              ),
            }}
          />
        </div>
        <div className="fullWidth marginTop">
          <InputLabel htmlFor="input-with-icon-adornment" className="marginBottomSmall">
            Email
            {' '}
            <span className="red">*</span>
          </InputLabel>
          <TextField
            name="email"
            id="input-with-icon-adornment"
            fullWidth
            color="primary"
            type="text"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            required
          />
        </div>
      </div>
      <div className="flex row spaceBetween fullWidth">
        <div className="fullWidth marginTop marginRightMedium">
          <InputLabel htmlFor="input-with-icon-adornment" className="marginBottomSmall">
            Password
            {' '}
            <span className="red">*</span>
          </InputLabel>
          <TextField
            name="password"
            required
            id="input-with-icon-adornment"
            type="password"
            fullWidth
            color="primary"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </div>
        <div className="fullWidth marginTop">
          <InputLabel htmlFor="input-with-icon-adornment" className="marginBottomSmall">
            Confirm Password
            {' '}
            <span className="red">*</span>
          </InputLabel>
          <TextField
            name="confirmPassword"
            id="input-with-icon-adornment"
            fullWidth
            color="primary"
            type="password"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </div>
      </div>
      <FormControlLabel
        checked={agreeToTerms}
        onChange={() => setAgreeToTerms(!agreeToTerms)}
        className="marginTopMedium"
        control={<Checkbox checked={agreeToTerms} />}
        label="I agree to all the Terms and Privacy Policy"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className="marginTopMedium fullWidth"
        disabled={Boolean(
          !agreeToTerms
          || !formik.isValid
          || loading
          || !formik.touched.firstName
          || !formik.touched.lastName
          || !formik.touched.phoneNumber
          || !formik.touched.email
          || !formik.touched.password,
        )}
        startIcon={loading ? <CircularProgress color="secondary" size="12px" />
          : <PersonAddOutlined />}
      >
        Register
      </Button>
      <div className="marginTopMedium fullWidth textAlignLeft">
        <Typography variant="subtitle1">
          Already have an account?
          {' '}
          <NavLink className="underline red" to="/auth/login">Go to login</NavLink>
        </Typography>
      </div>
    </form>
  );
};

export default Register;
