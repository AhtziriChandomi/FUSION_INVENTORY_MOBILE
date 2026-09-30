import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { HelperText } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { getLocationsByCenter } from '../../services/inventoryService';
import { Option } from './types';
import PaperSelect from './PaperSelect';

type Props = {
  label?: string;
  idCenter: number;              // centro del que dependen las locations (0 = ninguno)
  selectedValue: Option;
  onSelect: (o: Option) => void;
  firstOption?: Option;          // "No change" / "Keep current"
  required?: boolean;            // muestra error si no se eligió
};

/**
 * Misma lógica que DropdownRelationalItems de web:
 * cada vez que cambia el centro, limpia opciones y vuelve a consultar
 * Select_CatInv_Items (option 7) con searchValue = idCenter.
 */
export default function LocationSelect({
  label = 'Location', idCenter, selectedValue, onSelect, firstOption, required,
}: Props) {
  const { token } = useSelector((state: any) => state.user);
  const { forceOffline, isConnected } = useSelector((state: any) => state.app);
  const isOfflineMode = !isConnected || forceOffline;

  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true; // evita setState si el centro cambia antes de que responda la API
    setOptions([]);

    if (idCenter > 0) {
      setLoading(true);
      getLocationsByCenter(idCenter, token, isOfflineMode)
        .then((res) => active && setOptions(res))
        .catch((e) => console.log('Locations error', e))
        .finally(() => active && setLoading(false));
    }
    return () => { active = false; };
  }, [idCenter, token, isOfflineMode]);

  const disabled = idCenter === 0;
  const list = firstOption && !required ? [firstOption, ...options] : options;

  const placeholder = disabled
    ? 'Select'
    : loading
      ? 'Loading...'
      : 'Select';

  // Si se requiere location y está en 0, mostramos el placeholder (vacío) en vez de "No change"
  const shown = required && selectedValue.value === 0 ? { value: -1, label: '' } : selectedValue;

  return (
    <View>
      <View pointerEvents={disabled || loading ? 'none' : 'auto'} style={disabled ? styles.disabled : undefined}>
        <PaperSelect
          label={label}
          options={list}
          selectedValue={shown}
          onSelect={onSelect}
          placeholder={placeholder}
        />
      </View>
      {required && selectedValue.value === 0 && !disabled && (
        <HelperText type="error" style={styles.helper}>
          Location is required when the center changes
        </HelperText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  disabled: { opacity: 0.5 },
  helper: { paddingHorizontal: 4 },
});