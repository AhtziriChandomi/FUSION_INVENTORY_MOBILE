import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';
import appStyles from '../../styles/styles';

export default function ConfirmHandler(props) {
  const {colors} = useTheme();

  return (
    <Portal>
      <Dialog
        visible={props.showConfirm}
        onDismiss={props.onClose}
        style={appStyles.modalContainer}
      >
        <Dialog.Title style={appStyles.modalTitle}>
          {props.title}
        </Dialog.Title>
        <Dialog.Content>
          <Text style={styles.message}>{props.message}</Text>
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={props.onClose}
            buttonColor={colors.error}
            contentStyle={styles.buttonContent}
            style={styles.button}
          >
            {props.questionButton ? 'No' : 'Cancel'}
          </Button>
          <Button
            mode="contained"
            onPress={props.accept}
            buttonColor={colors.success}
            contentStyle={styles.buttonContent}
            style={styles.button}
          >
            {props.questionButton ? 'Yes' : 'Accept'}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = {
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBotton: 12,
    gap: 12
  },
  button: {
    flex: 1,
    borderRadious: 8
  },
  buttonContent: {
    height: 44,
    justifyContent: 'center'
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    marginTop: 4
  }
}