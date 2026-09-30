import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider, Portal } from 'react-native-paper';
import { Provider, useDispatch } from "react-redux";
import { GetTokenApi } from '../api/Login/Loginapi';
import { Insert_Session } from '../api/SessionAPI/Sessionapi';
import store from '../store';
import { setToken } from '../store/slices/userSlice';
import { theme } from '../styles/theme';
import { SnackbarProvider } from './components/SnackbarProvider';
import NetworkListener from './NetworkListener';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    getToken();
  }, []);

  async function getToken() {
    let token = await GetTokenApi({
      option: 3,
      idPersonnal: 0,
      noemployee: '', 
      idLocation: 0,
      idCenter: 0,
      password: ""
    });

    if (token) {
      let jsVar = {    
        "Token": token,
        "idRelation": 0,    
      }

      await Insert_Session(jsVar, token);
      dispatch(setToken(token));
    }
  }

  return (
    <>
      <NetworkListener />
      <PaperProvider theme={theme}>
        <Portal.Host>
          <SnackbarProvider>
            <View style={{ flex: 1 }}>
              <Stack 
                screenOptions={{
                  headerTitle: "",
                  headerShown: false,
                  gestureEnabled: false, 
                }}
              />
            </View>
          </SnackbarProvider>
        </Portal.Host>
      </PaperProvider>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </GestureHandlerRootView>
  );
}