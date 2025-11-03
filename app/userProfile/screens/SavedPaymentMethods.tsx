// screens/SavedPaymentMethodsScreen.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PaymentMethodCard, {PaymentMethod} from '../components/SavedPaymentMethods/PaymentMethodCard';
import AddPaymentMethodButton from '../components/SavedPaymentMethods/AddPaymentMethodButton';
import EmptyPaymentState from '../components/SavedPaymentMethods/EmptyPaymentState';
import {mockPaymentMethods} from '../components/SavedPaymentMethods/mockPaymentMethods';
import HeaderWithNoIcons from '../components/Profile/HeaderWithNoIcons';

const SavedPaymentMethodsScreen: React.FC<{navigation: any}> = ({
  navigation,
}) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMethods(mockPaymentMethods);
      setLoading(false);
    }, 800);
  };

  const handleAddPayment = () => {
    navigation.navigate('AddPaymentMethod');
  };

  const handleEditPayment = (method: PaymentMethod) => {
    navigation.navigate('EditPaymentMethod', {method});
  };

  const handleSetDefault = (methodId: string) => {
    Alert.alert('Success', 'Payment method set as default', [
      {
        text: 'OK',
        onPress: () => {
          setMethods(
            methods.map(m => ({
              ...m,
              isDefault: m.id === methodId,
            })),
          );
        },
      },
    ]);
  };

  const handleDeletePayment = (methodId: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMethods(methods.filter(m => m.id !== methodId));
            Alert.alert('Success', 'Payment method deleted');
          },
        },
      ],
    );
  };

  const renderMethod = ({item}: {item: PaymentMethod}) => (
    <View style={styles.methodContainer}>
      <PaymentMethodCard
        method={item}
        onEdit={() => handleEditPayment(item)}
        onSetDefault={() => handleSetDefault(item.id)}
        onDelete={() => handleDeletePayment(item.id)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <HeaderWithNoIcons title="Payment Methods" onBack={() => navigation.goBack()} />
      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : methods.length === 0 ? (
        <EmptyPaymentState onAddPayment={handleAddPayment} />
      ) : (
        <>
          <FlatList
            data={methods}
            renderItem={renderMethod}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <AddPaymentMethodButton onPress={handleAddPayment} />
            }
          />
        </>
      )}

      {/* Add Button (for empty state fallback) */}
      {!loading && methods.length === 0 && (
        <View style={styles.buttonContainer}>
          <AddPaymentMethodButton onPress={handleAddPayment} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
 
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  methodContainer: {
    paddingHorizontal: 16,
  },
  buttonContainer: {
    padding: 16,
  },
});

export default SavedPaymentMethodsScreen;
