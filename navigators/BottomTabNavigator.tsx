import React from "react";
import HomeStack from './stacks/HomeStack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserProfileStack from "./stacks/UserProfileStack";
import NotificationsStack from "./stacks/NotificationsStack";
import JobsStack from "./stacks/JobsStack";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Joblist" component={JobsStack} />
      <Tab.Screen name="Notifications" component={NotificationsStack} />
      <Tab.Screen name="Profile" component={UserProfileStack} />
    </Tab.Navigator>
  );
}