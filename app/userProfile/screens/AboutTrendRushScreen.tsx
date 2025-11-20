import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AboutSection from '../components/About/AboutSection';
import FeatureItem from '../components/About/FeatureItem';
import {aboutData} from '../components/About/mockAboutData';
import HeaderWithNoIcons from '../components/Profile/HeaderWithNoIcons';

const AboutTrendRushScreen: React.FC<{navigation: any}> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
    <HeaderWithNoIcons title="About" onBack={() => navigation.goBack()} />
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <AboutSection
          title="About TrendRush"
          content={aboutData.aboutTrendRush}
        />
        <AboutSection
          title="Our Mission"
          content={aboutData.whoWeAre}
        />
        <View style={styles.featureSection}>
          <Text style={styles.featureSectionTitle}>What Makes Us Different</Text>
          {aboutData.features.map((feature, index) => (
            <FeatureItem
              key={index}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </View>
        <AboutSection
          title="Our Promise"
          content={aboutData.ourPromise}
        />
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 TrendRush. All Rights reserved.</Text>
          <Text style={styles.versionText}>Version 1.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  featureSection: {
    marginBottom: 24,
  },
  featureSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
    letterSpacing:-0.32,
  },
  versionText: {
    fontSize: 14,
    color: '#636363',
  },
});

export default AboutTrendRushScreen;
