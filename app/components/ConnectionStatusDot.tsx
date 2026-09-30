// components/ConnectionStatusDot.tsx
import { View } from 'react-native';
import { Switch, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setForceOffline } from '../../store/slices/appSlice';

export default function ConnectionStatusDot() {
  const dispatch = useDispatch();
  const { isConnected, forceOffline } = useSelector((state: any) => state.app);

  const isOfflineMode = !isConnected || forceOffline;

  return (
    <>      
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: 10}}>
        <Text style={{fontSize: 12, color: isOfflineMode ? '#dc3545' : '#28a745'}}>{isOfflineMode ? "OFFLINE" : "ONLINE"}</Text>
        <Switch 
          value={forceOffline}
          onValueChange={(val) => dispatch(setForceOffline(val))}
        />
      </View>
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: isOfflineMode ? '#dc3545' : '#28a745', // rojo / verde
          marginRight: 10,
          borderWidth: 1,
          borderColor: 'white',
        }}
      />
    </>
  );
}
