import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, Button, GestureResponderEvent } from 'react-native';
import * as Notifications from 'expo-notifications';
import versiculos from '../../data/versiculos.json'; // Ajuste o caminho se necessário

// Configuração para exibir notificações mesmo com o app aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function HomeScreen({ navigation }: any) {
  const [versiculo, setVersiculo] = useState<string>('');

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const index = dayOfYear % versiculos.length;
    const versiculoDoDia = versiculos[index];

    setVersiculo(versiculoDoDia);

    registerForPushNotificationsAsync().then(() => {
      scheduleDailyNotification(versiculoDoDia);
    });
  }, []);

  async function registerForPushNotificationsAsync() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Precisamos de permissão para enviar notificações!');
    }
  }

  async function scheduleDailyNotification(message: string) {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Versículo do dia 📖',
        body: message,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: 'calendar',
        hour: 7,
        minute: 0,
        repeats: true,
      } as Notifications.CalendarTriggerInput,
    });
  }

    function enviarNotificacaoTeste(event: GestureResponderEvent): void {
        throw new Error('Function not implemented.');
    }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📖 BibliaNot</Text>
       <Button title="Testar Notificação" onPress={enviarNotificacaoTeste} />
        <Button
        title="Ver Histórico"
        onPress={() => navigation.navigate('Histórico')}
        color="#6a4c93"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#6a4c93',
  },
  versiculo: {
    fontSize: 22,
    textAlign: 'center',
    color: '#333',
  },
});
