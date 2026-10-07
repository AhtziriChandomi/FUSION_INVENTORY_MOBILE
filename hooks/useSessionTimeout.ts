import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { Alert, AppState } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { flushActivity, getSessionStatus, sqlite_ClearSession, sqlite_StartSession } from '../services/sessionService';
import { setUserInfo } from '../store/slices/userSlice';

const CHECK_EVERY_MS = 30 * 1000; // revisa cada 30 segundos

/**
 * Cierra la sesión tras 30 minutos SIN ACTIVIDAD (online u offline).
 * La actividad se registra con markActivity() al tocar la pantalla o escanear.
 * Los cambios ya guardados (pendientes de sincronizar) NO se pierden.
 */
export function useSessionTimeout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: any) => state.user);
  const expiring = useRef(false);

  const expire = useCallback(async () => {
    if (expiring.current) return;
    expiring.current = true;
    console.log('[session] EXPIRED → cerrando sesión');

    await sqlite_ClearSession();
    dispatch(setUserInfo(null));
    router.replace('/');

    Alert.alert('Session expired', 'Your session closed due to inactivity. Your saved changes are still on this device.');
    expiring.current = false;
  }, [dispatch, router]);

  const check = useCallback(async () => {
    if (!userInfo) return;

    const status = await getSessionStatus();
    console.log('[session] check', { status, user: userInfo?.idPersonnal, at: new Date().toISOString() });

    if (status === 'none') {
      // Hay usuario pero no se registró el inicio: empieza a contar desde ahora
      await sqlite_StartSession();
    } else if (status === 'expired') {
      expire();
    }
  }, [userInfo, expire]);

  useEffect(() => {
    if (!userInfo) return;

    check();
    const timer = setInterval(check, CHECK_EVERY_MS);

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') check();              // al volver a la app
      else flushActivity();                         // al irse a segundo plano
    });

    return () => {
      clearInterval(timer);
      sub.remove();
    };
  }, [userInfo, check]);
}