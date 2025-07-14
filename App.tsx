import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import DevocionaisScreen from './src/screens/DevocionaisScreen';


const Stack = createNativeStackNavigator();

export default function App() {

  
  return (
    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="BibliaNot" component={HomeScreen} />
        <Stack.Screen name="Histórico" component={HistoryScreen} />
        <Stack.Screen name="Devocionais" component={DevocionaisScreen} />

        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
