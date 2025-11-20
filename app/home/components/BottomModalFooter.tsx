import React from 'react';
import {SafeAreaView, View, Text, TouchableOpacity, StyleSheet} from 'react-native';

type BottomModalFooterProps = {
  onCancel: () => void;
  onApply: () => void;
  applyDisabled?: boolean;
  cancelLabel?: string;
  applyLabel?: string;
  // optional style overrides (not required)
  style?: {
    container?: object;
    inner?: object;
    cancelButton?: object;
    applyButton?: object;
    cancelText?: object;
    applyText?: object;
  };
};

const BottomModalFooter: React.FC<BottomModalFooterProps> = ({
  onCancel,
  onApply,
  applyDisabled = false,
  cancelLabel = 'Cancel',
  applyLabel = 'Apply',
  style = {},
}) => {
  return (
    <SafeAreaView edges={['bottom']} style={[styles.footerSafe, style.container]}>
      <View style={[styles.footerInner, style.inner]}>
        <TouchableOpacity
          style={[styles.cancelButton, style.cancelButton]}
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel="Cancel">
          <Text style={[styles.cancelText, style.cancelText]}>{cancelLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.applyButton,
            applyDisabled ? styles.applyButtonDisabled : {},
            style.applyButton,
          ]}
          onPress={onApply}
          disabled={applyDisabled}
          accessibilityRole="button"
          accessibilityLabel="Apply">
          <Text style={[styles.applyText, style.applyText]}>{applyLabel}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BottomModalFooter;

const styles = StyleSheet.create({
  footerSafe: {
    backgroundColor: '#fff',
  },
  footerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 70,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#FF4C5E',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  cancelText: {color: '#FF4C5E', fontWeight: '600'},
  applyButton: {
    backgroundColor: '#FF4C5E',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  applyButtonDisabled: {
    backgroundColor: '#FFB7C0', // lighter when disabled
  },
  applyText: {color: '#fff', fontWeight: '600'},
});
