import { View, Text, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { icons } from '../../constants';
import { StatusBar } from 'expo-status-bar';

interface TabIconProps {
  name: string,
  icon: any;
  color: string,
  focused: boolean;
}

const TabIcon = (
  { name, icon, color, focused }: TabIconProps
) => {
  return (
    <View className='items-center justify-center gap-2 w-16 mt-6'>
      <Image
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className='w-6 max-h-6'
      />
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs text-center`} style={{ color }}>
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 64
          }
        }}
      >
        <Tabs.Screen
          name='home'
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                icon={icons.home}
                name='Home'
                color={color}
                focused={focused}
              />
            )
          }}
        />

        <Tabs.Screen
          name='bookmark'
          options={{
            title: 'Bookmark',
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                icon={icons.bookmark}
                name='Bookmark'
                color={color}
                focused={focused}
              />
            )
          }}
        />

        <Tabs.Screen
          name='create'
          options={{
            title: 'Create',
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                icon={icons.plus}
                name='Create'
                color={color}
                focused={focused}
              />
            )
          }}
        />

        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                icon={icons.profile}
                name='Profile'
                color={color}
                focused={focused}
              />
            )
          }}
        />
      </Tabs>

      <StatusBar backgroundColor='#161622' style='light' />
    </>
  );
};

export default TabsLayout;