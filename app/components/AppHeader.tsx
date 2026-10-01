import { useRouter } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '../../store/slices/userSlice';

type Props = {
  title: string;
  logoutMessage?: string;     // aviso extra al cerrar sesión (ej. "Scanned assets will be lost")
  disabled?: boolean;         // bloquea botones (ej. mientras sincroniza)
};

/**
 * Encabezado común: título, estado Online/Offline, nombre del usuario y logout.
 * Úsalo en todas las pantallas para que se vean iguales.
 */
export default function AppHeader({ title, logoutMessage, disabled }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const { userInfo } = useSelector((state: any) => state.user);
  const { forceOffline, isConnected } = useSelector((state: any) => state.app);
  const isOfflineMode = !isConnected || forceOffline;

  const userName = userInfo?.name ?? userInfo?.fullName ?? userInfo?.noemployee ?? '';

  const handleLogout = () =>
    Alert.alert(
      'Sign out',
      [logoutMessage, 'Pending changes stay saved on this device.'].filter(Boolean).join('\n'),
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: () => {
            dispatch(setUserInfo(null));
            router.replace('/');
          },
        },
      ]
    );

  return (
    <Appbar.Header mode="small" style={[styles.appbar, { backgroundColor: colors.surface }]}>
      <Appbar.Content
        title={
          <View>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <View style={styles.subRow}>
              <View style={[styles.dot, { backgroundColor: isOfflineMode ? colors.error : '#16A34A' }]} />
              <Text style={[styles.sub, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                {isOfflineMode ? 'Offline' : 'Online'}
                {userName ? ` · ${userName}` : ''}
              </Text>
            </View>
          </View>
        }
      />

      <Appbar.Action icon="logout" onPress={handleLogout} disabled={disabled} />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  appbar: { height: 52 },
  title: { fontSize: 17, fontWeight: '700' },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  sub: { fontSize: 11, flexShrink: 1 },
});