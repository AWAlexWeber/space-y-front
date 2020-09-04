import React from 'react';
import ReactDOM from 'react-dom';

import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';

// Important modules
import App from './App.js';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1f1f1f',
    },
    indicator: {
      backgroundColor: "white"
    }
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
