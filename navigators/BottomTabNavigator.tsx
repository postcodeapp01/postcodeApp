import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  getFocusedRouteNameFromRoute,
  RouteProp,
} from '@react-navigation/native';

import HomeStack from './stacks/HomeStack';
import StoreStack from './stacks/StoresStack';
import CategoriesStack from './stacks/CategoriesStack';
import UserProfileStack from './stacks/ProfileStack';

type BottomTabParamList = {
  HomeTab: undefined;
  StoresTab: undefined;
  CategoriesTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();
const SHOW_TABS_WHITELIST: Record<keyof BottomTabParamList, string[]> = {
  HomeTab: ['HomeScreen'],
  StoresTab: ['Stores'],
  CategoriesTab: ['Categories'],
  ProfileTab: ['UserProfile'],
};

function shouldHideTabBar(
  route: RouteProp<Record<string, object | undefined>, string> | undefined,
  whitelist: string[],
) {
  const focused = getFocusedRouteNameFromRoute(route ?? ({} as any));
  const current = focused ?? whitelist[0];
  return !whitelist.includes(current);
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#2F80ED',
        tabBarInactiveTintColor: '#B1B1B1',
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={({route}) => ({
          tabBarStyle: shouldHideTabBar(route, SHOW_TABS_WHITELIST.HomeTab)
            ? {display: 'none'}
            : undefined,
          title: 'Home',
          tabBarIcon: ({color}) => (
            <Ionicons name="home-outline" size={18} color={color} />
          ),
        })}
      />

      <Tab.Screen
        name="StoresTab"
        component={StoreStack}
        options={({route}) => ({
          tabBarStyle: shouldHideTabBar(route, SHOW_TABS_WHITELIST.StoresTab)
            ? {display: 'none'}
            : undefined,
          title: 'Try On',
          tabBarIcon: ({color}) => (
            <Ionicons name="business-outline" size={18} color={color} />
          ),
        })}
      />

      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesStack}
        options={({route}) => ({
          tabBarStyle: shouldHideTabBar(
            route,
            SHOW_TABS_WHITELIST.CategoriesTab,
          )
            ? {display: 'none'}
            : undefined,
          title: 'Offers',
          tabBarIcon: ({color}) => (
            <Ionicons name="grid-outline" size={18} color={color} />
          ),
        })}
      />

      <Tab.Screen
        name="ProfileTab"
        component={UserProfileStack}
        options={({route}) => ({
          tabBarStyle: shouldHideTabBar(route, SHOW_TABS_WHITELIST.ProfileTab)
            ? {display: 'none'}
            : undefined,
          title: 'Profile',
          tabBarIcon: ({color}) => (
            <Ionicons name="person-outline" size={18} color={color} />
          ),
        })}
      />
    </Tab.Navigator>
  );
}
