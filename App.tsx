import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Stack = createNativeStackNavigator();

export default function App() {

  async function enviarNotificacaoTeste() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔔 Notificação de Teste',
      body: 'Funcionou! Sua notificação está ativa.',
      sound: true,
    },
    trigger: { seconds: 5} as Notifications.CalendarTriggerInput, // Notifica em 5 segundos
  });
}
  return (
    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="BibliaNot" component={HomeScreen} />
        <Stack.Screen name="Histórico" component={HistoryScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
