import { createContext, useContext, useState } from 'react';
import { Portal, Snackbar, Text } from 'react-native-paper';
import { appStyles } from '../../styles/styles';

const SnackbarContext = createContext();

const TYPE_STYLES = {
  success: 'backgroundcolor_pastelgreen',
  error: 'backgroundcolor_pasteldanger',
  warning: 'backgroundcolor_pastelwarning',
  info: 'backgroundcolor_pastelblue',
};

export function SnackbarProvider({ children }) {

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');

  const showSnackbar = (snackbarType = 'info', msg) => {
    setMessage(msg);
    setType(snackbarType);
    setVisible(true);
  };

  const hideSnackbar = () => setVisible(false);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <Portal>
        <Snackbar
          visible={visible}
          onDismiss={hideSnackbar}
          duration={3000}
          style={appStyles[TYPE_STYLES[type]]}
          action={{ label: 'x', onPress: hideSnackbar }}
        >
          <Text>{message}</Text>
        </Snackbar>
      </Portal>
    </SnackbarContext.Provider>
  );
}

export const useSnackbar = () => useContext(SnackbarContext);
