import { SnackbarProvider } from 'notistack';
import React from 'react';
import './App.css';
import EnquiryForm from './components/organisms/Enquiry/Form';

const App: React.FC = () => (
  <SnackbarProvider maxSnack={3}>
    <EnquiryForm />
  </SnackbarProvider>
);

export default App;
