import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Portal, Modal, ActivityIndicator, Text } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function LoadingModal({ showConfirm, title, message }) {
  return (
    <Portal>
      <Modal
        visible={showConfirm}
        contentContainerStyle={styles.modalContainer}
        dismissable={false}
      >
        <View style={styles.card}>
          <ActivityIndicator 
            animating={true} 
            size={40} 
            color="#04a9f5" 
            style={styles.spinner}
          />
          
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    width: width * 0.75, // Ocupa el 75% del ancho de pantalla
    borderRadius: 24,    // Bordes muy redondeados para look moderno
    padding: 30,
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  messageText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 20,
  },
});