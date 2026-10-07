import { Tabs } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useSessionTimeout } from '../../hooks/useSessionTimeout';
import { getPendingCount, subscribePendingChanges } from '../../services/inventoryService';
import { markActivity } from '../../services/sessionService';

/**
 * Pestañas fijas: Inventory y Sync, disponibles en todo momento.
 * El contador de Sync se actualiza solo al guardar, sincronizar o descartar.
 * Si tienes otras pantallas dentro de app/main que no deben ser pestaña,
 * agrégalas con: <Tabs.Screen name="NombreArchivo" options={{ href: null }} />
 */
export default function MainLayout() {
  const { colors } = useTheme();
  const [pending, setPending] = useState(0);
  const { userInfo } = useSelector((state: any) => state.user);
  const idPersonnal = Number(userInfo?.idPersonnal) || 0;

  // Cierra la sesión tras 30 minutos sin actividad (online u offline)
  useSessionTimeout();

  // Contador solo de los pendientes del usuario en sesión
  const refresh = useCallback(async () => {
    try {
      if (!idPersonnal) { setPending(0); return; }
      const c = await getPendingCount(idPersonnal);
      setPending(c.pending + c.errors);
    } catch (e) {
      console.log('Pending count error', e);
    }
  }, [idPersonnal]);

  useEffect(() => {
    refresh();
    return subscribePendingChanges(refresh);
  }, [refresh]);

  return (
    // Cualquier toque en la app cuenta como actividad (no bloquea el toque)
    <View
      style={{ flex: 1 }}
      onStartShouldSetResponderCapture={() => { markActivity(); return false; }}
    >
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.outlineVariant },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color, size }) => <Icon source="barcode-scan" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="Sync"
        options={{
          title: 'Sync',
          tabBarBadge: pending > 0 ? (pending > 99 ? '99+' : pending) : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.error, fontSize: 10 },
          tabBarIcon: ({ color, size }) => <Icon source="cloud-upload-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
    </View>
  );
}