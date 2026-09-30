import { MD3LightTheme } from 'react-native-paper';
import * as constant from '../constants/Constants';

export const theme = {
  ...MD3LightTheme,
  roundness: 8, 
  colors: {
    ...MD3LightTheme.colors,
    
    "primary": "#2862e8",                
    "onPrimary": "#ffffff",
    "primaryContainer": constant.primaryContainer,        
    "onPrimaryContainer": "#001a4d",

    "secondary": "#748892",            
    "onSecondary": "#ffffff",
    "secondaryContainer": constant.secondaryContainer,
    "onSecondaryContainer": "#1d262b",

    "error": "#f44236",            
    "onError": "#ffffff",
    "errorContainer": constant.errorContainer,
    "onErrorContainer": "#600e0a",

    "background": "#efeff1",           
    "surface": "#ffffff",
    "onSurface": "#37474f",           
    "onSurfaceVariant": "#748892",       
    "outline": "#d6d6d6",                 

    "success": "#4caf50",                 
    "onSuccess": "#ffffff",
    "successContainer": constant.successContainer,
    "onSuccessContainer": "#1b5e20",

    "warning": "#f1c40f",          
    "onWarning": "#000000",
    "warningContainer": constant.warningContainer,
    "onWarningContainer": "#7d6608",

    "info": "#03a9f4",                
    "onInfo": "#ffffff",
    "infoContainer": "#e1f5fe",
    "onInfoContainer": "#01579b",

    "purple": "#895dc1",       
    "onPurple": "#ffffff",

    "dark": "#37474f",        
    "default": "#d6d6d6",             
    "light": "#efeff1",                   

    "cian": "#006874",
    "cianContainer": "#dbe4e6",

    "elevation": {
      "level0": "transparent",
      "level1": "#f5f5f6",
      "level2": "#f0f1f3",
      "level3": "#ebedef",
      "level4": "#e6e8eb",
      "level5": "#e1e4e8"
    },
  },
};