import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import NotificationToggleCard from '../components/Notifications/NotificationToggleCard';
import HeaderWithNoIcons from '../components/Profile/HeaderWithNoIcons';

const NotificationsScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [whatsapp, setWhatsapp] = useState(true);
  const [push, setPush] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <HeaderWithNoIcons
        title="Notifications"
        onBack={() => navigation.goBack()}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <NotificationToggleCard
          title="WhatsApp Messages"
          description="Get messages from us on WhatsApp"
          value={whatsapp}
          onValueChange={setWhatsapp}
        />
        <NotificationToggleCard
          title="Push Notifications"
          description="Stay updated with live orders and discounts"
          value={push}
          onValueChange={setPush}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F9F9F9'},
  content: {paddingTop: 10},
});

export default NotificationsScreen;
