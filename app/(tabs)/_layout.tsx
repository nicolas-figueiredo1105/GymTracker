import { View, Text } from 'react-native'
import React from 'react'
import {Ionicons} from "@expo/vector-icons"
import { Tabs } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
            backgroundColor: "black",
            borderTopWidth: 1,
            borderTopColor: "darkblue",
            height: 90,
            paddingBottom: 30,
            paddingTop: 15,
        },
        headerShown: false,
    }}
    >
        <Tabs.Screen
            name='home'
            options={{
                title: "Home",
                tabBarIcon: ({color, size}) => <Ionicons name='home' size = {size} color = {color}/>,
            }}
        />
        <Tabs.Screen
            name='workout'
            options={{
                title: "Workout",
                tabBarIcon: ({color, size}) => <FontAwesome5 name="dumbbell" size={24} color={color}/>,
            }}
        />
        <Tabs.Screen
            name='settings'
            options={{
                title: "Settings",
                tabBarIcon: ({color, size}) => <Ionicons name='settings-outline' size = {size} color = {color}/>,
            }}
        />
        
    </Tabs>
  );
};

export default TabsLayout