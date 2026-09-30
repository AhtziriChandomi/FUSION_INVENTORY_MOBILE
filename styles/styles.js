import { StyleSheet } from 'react-native';

export const appStyles = StyleSheet.create({

  backgroundcolor_pastelblue: {
    backgroundColor: '#d5eaff',
  },

  backgroundcolor_pasteldanger: {
    backgroundColor: '#ffcccb',
  },

  backgroundcolor_pastelwarning: {
    backgroundColor: '#ffffe4',
  },

  backgroundcolor_pastelgreen: {
    backgroundColor: '#d7ffd9',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  col: {
    flexDirection: 'column',
    padding: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menuSelect: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 4,
    minHeight: 40,
    justifyContent: 'center'
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    marginTop: 8
  },
  scrollArea: {
    paddingHorizontal: 0, // Quita el padding para que el scroll llegue al borde
  },
  scrollContent: {
    paddingHorizontal: 24, // Agrega el espacio aquí para que el texto no esté pegado
    paddingVertical: 10,
  },
  stripedTableContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden'
  },
  headerText: {
    fontWeight: 'bold',
    color: '#222',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  modalContainer: {
    borderRadius: 12,
    paddingVertical: 10,
    backgroundColor: 'white'
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    zIndex: 10, // Asegura que esté por encima de todo
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeText: {
    fontSize: 30,
    fontWeight: '300',
    color: '#666',
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: "#1D2B8F",
    fontWeight: "900",
  },
  textCenter: {
    textAlign: 'center',
  },
  richEditorContainer: {
    minHeight: 60,
    borderWidth: 0.6,
    borderRadius: 4,
    marginBottom: 10,
    marginTop: 4,
    overflow: 'hidden',
  },
  calendarContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },
  blueTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1D2B8F",
    letterSpacing: 0.2,
  },
  tableRow: {
    height: 'auto',      // Permite que la fila crezca si hay mucho texto
    minHeight: 60,       // Altura mínima para que no se vea apretado
    paddingVertical: 8,
  },
  tableCenterAlignment: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, // Esto hace que se distribuyan equitativamente si el contenedor es ancho
    paddingHorizontal: 5,
  },
  tableContainer : {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  }
});

export default appStyles;