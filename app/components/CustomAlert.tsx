import { View } from 'react-native';
import { Text } from 'react-native-paper';
import appStyles from '../../styles/styles';

export const CustomAlert = ({ type = 'info', text }) => {
  
  // Mapeo de tus estilos a los tipos de alerta
  const getStyleByType = () => {
    switch (type) {
      case 'success':
        return { 
          bg: appStyles.backgroundcolor_pastelgreen, 
          text: '#155724' 
        };
      case 'warning':
        return { 
          bg: appStyles.backgroundcolor_pastelwarning, 
          text: '#856404' 
        };
      case 'error':
        return { 
          bg: appStyles.backgroundcolor_pasteldanger, 
          text: '#721c24' 
        };
      case 'info':
      default:
        return { 
          bg: appStyles.backgroundcolor_pastelblue, 
          text: '#0c5460' 
        };
    }
  };

  const config = getStyleByType();

  return (
    <View style={[
      config.bg,
      { 
        padding: 15, 
        borderRadius: 8, 
        marginVertical: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)'
      }
    ]}>
      <Text style={{ color: config.text, textAlign: 'center', fontWeight: 'bold' }}>
        {text}
      </Text>
    </View>
  );
};