import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Props {
  activeIndex?: number; 
  totalSteps?: number;
}

const steps = [
  {label: 'My Cart'},
  {label: 'Checkout'},
  {label: 'Review'},
  {label: 'Payment'},
];

const TopSteps: React.FC<Props> = ({activeIndex = 0, totalSteps = 4}) => {
  return (
    <View style={styles.container}>
      <View style={styles.stepsRow}>
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isCompleted = index < activeIndex;

          return (
            <React.Fragment key={step.label}>
              <View style={styles.stepContainer}>
                {/* Step Circle with Checkmark */}
                <View
                  style={[
                    styles.circle,
                    (isActive || isCompleted) && styles.activeCircle,
                  ]}>
                  <MaterialIcons
                    name="check"
                    size={12} 
                    color={isActive || isCompleted ? '#fff' : '#D0D0D0'}
                    style={{transform: [{scaleX: 1.8}, {scaleY: 1.8}]}}
                  />
                </View>

                {/* Step Label */}
                <Text
                  style={[
                    styles.label,
                    (isActive || isCompleted) && styles.activeLabel,
                  ]}>
                  {step.label}
                </Text>
              </View>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.connector,
                    isCompleted && styles.activeConnector,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

export default TopSteps;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F1F1',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    height: 67,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  activeCircle: {
    backgroundColor: '#222222',
  },
  label: {
    fontSize: 9,
    color: '#BDBDBD',
    textAlign: 'center',
    fontWeight: '400',
  },
  activeLabel: {
    color: '#2C2C2C',
    fontWeight: '600',
  },
  connector: {
    height: 1,
    flex: 0.8,
    backgroundColor: '#B1B1B1',
    marginBottom: 20,
    width: '100%',
  },
  activeConnector: {
    backgroundColor: '#000',
  },
});
