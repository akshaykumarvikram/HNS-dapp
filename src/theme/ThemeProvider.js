import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material';
import { themeCreator } from './base';
// import { StylesProvider } from '@mui/styles';
import { StyledEngineProvider } from '@mui/material/styles';

export const ThemeContext = React.createContext((themeName) => { });

const ThemeProviderWrapper = function (props) {
  const curThemeName = localStorage.getItem('appTheme') || 'NebulaFighterTheme';
  const [themeName, _setThemeName] = useState(curThemeName);
  const theme = themeCreator(themeName);
  const setThemeName = (themeName) => {
    localStorage.setItem('appTheme', themeName);
    _setThemeName(themeName);
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeContext.Provider value={setThemeName}>
        <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
      </ThemeContext.Provider>
    </StyledEngineProvider>
  );
};

export default ThemeProviderWrapper;
