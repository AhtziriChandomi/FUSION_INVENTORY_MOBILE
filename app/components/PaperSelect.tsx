import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Divider, Menu, Text, TextInput } from 'react-native-paper';
import appStyles from '../../styles/styles';

export default function PaperSelect({ label, options = [], selectedValue, onSelect, placeholder }) {

    const [visible, setVisible] = useState(false);

    // Buscamos la etiqueta de la opción seleccionada
    const selectedLabel = options.find(opt => opt.value === selectedValue.value)?.label || "";

    return (
        <View>
            <Text style={appStyles.label}>{label}:</Text>
            <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={
                // Usamos Pressable para asegurar que el clic se detecte siempre
                <Pressable onPress={() => setVisible(true)}>
                    <View pointerEvents="none"> 
                    <TextInput
                        //label="Select"
                        mode="outlined"
                        value={selectedLabel}
                        editable={false}
                        right={<TextInput.Icon icon={visible ? "chevron-up" : "chevron-down"} />}
                        placeholder={placeholder || "Select an option"}
                        style={{ backgroundColor:"white" }}
                    />
                    </View>
                </Pressable>
                }
            >
                {options.length > 0 ? (
                    options.map((option, index) => (
                        <React.Fragment key={option.value}>
                        <Menu.Item
                            onPress={() => {
                                onSelect(option);
                                setVisible(false);
                            }}
                            title={option.label}
                            titleStyle={selectedValue.value === option.value ? { color: '#04a9f5', fontWeight: 'bold' } : {}}
                        />
                        {index < options.length - 1 && <Divider />}
                        </React.Fragment>
                    ))
                ) : (
                    <Menu.Item title="No hay opciones" disabled />
                )}
            </Menu>
        </View>
  );
}