import { Tabs } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Icon, useTheme } from 'react-native-paper';
import { getPendingCount, subscribePendingChanges } from '../../services/inventoryService';

/**
 * Pestañas fijas: Inventory y Sync, disponibles en todo momento.
 * El contador de Sync se actualiza solo al guardar, sincronizar o descartar.
 * Si tienes otras pantallas dentro de app/main que no deben ser pestaña,
 * agrégalas con: <Tabs.Screen name="NombreArchivo" options={{ href: null }} />
 */
export default function MainLayout() {
  const { colors } = useTheme();
  const [pending, setPending] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const c = await getPendingCount();
      setPending(c.pending + c.errors);
    } catch (e) {
      console.log('Pending count error', e);
    }
  }, []);

  useEffect(() => {
    refresh();
    return subscribePendingChanges(refresh);
  }, [refresh]);

  return (
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
  );
}