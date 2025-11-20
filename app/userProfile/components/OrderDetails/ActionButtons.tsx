import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

interface ActionButtonsProps {
  order: any;
  onNeedHelp: () => void;
  onDownloadInvoice: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  order,
  onNeedHelp,
  onDownloadInvoice,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInvoiceOptions = () => {
    Alert.alert('Invoice Options', 'Choose an action', [
      {
        text: 'Download',
        onPress: onDownloadInvoice,
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.helpButton}
        onPress={onNeedHelp}
        activeOpacity={0.8}
        disabled={isGenerating}>
        <Text style={styles.helpButtonText}>Need Help?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.invoiceButton, isGenerating && styles.disabled]}
        onPress={handleInvoiceOptions}
        activeOpacity={0.8}
        disabled={isGenerating}>
        {isGenerating ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.invoiceButtonText}>Download Invoice</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#fff',
  },
  helpButton: {
    flex: 1,
    backgroundColor: '#FF6B7A',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  invoiceButton: {
    flex: 1,
    backgroundColor: '#999',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoiceButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default ActionButtons;
