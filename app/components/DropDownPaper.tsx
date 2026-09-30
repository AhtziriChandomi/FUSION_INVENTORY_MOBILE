import { useCallback, useMemo, useRef } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import appStyles from "../../styles/styles";

export default function DropDownPaper({
  label,
  options = [],
  selectedValue,     // { value, label } o null
  onSelect,          // recibe objeto { value, label }
  placeholder,
}) {
  const dropdownRef = useRef(null)

  const safeOptions = useMemo(() => {
    return (Array.isArray(options) ? options : [])
      .filter(o => o && o.value !== undefined && o.value !== null)
      .map(o => ({
        label: String(o.label ?? ""),
        value: o.value, // mantenemos el tipo original
      }));
  }, [options]);

  // Para el dropdown: value primitivo
  const value = selectedValue?.value ?? null;

  const handleSelect = useCallback((newValue) => {
    //Keyboard.dismiss();

    // Normaliza para evitar problemas string vs number
    const key = newValue === null || newValue === undefined ? "" : String(newValue);

    const found = safeOptions.find(o => String(o.value) === key);

    const selected = found
      ? { value: found.value, label: found.label }
      : { value: newValue, label: "" };

    onSelect?.(selected);

    requestAnimationFrame(() => {
      dropdownRef.current?.blur?.();
    });
  }, [safeOptions, onSelect]);

  return (
    <View>
      <Text style={appStyles.label}>{label}</Text>
      <Dropdown
        label={label}
        placeholder={placeholder || "Select an option"}
        options={safeOptions}
        value={value}
        onSelect={handleSelect}
      />
    </View>
  );
}
