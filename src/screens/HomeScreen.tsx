import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, Button, GestureResponderEvent, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MotiView } from 'moti';
import * as Notifications from 'expo-notifications';
import versiculos from '../../data/versiculos.json'; // Ajuste o caminho se necessário
import AsyncStorage from '@react-native-async-storage/async-storage';
// Configuração para exibir notificações mesmo com o app aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,  // Mostra o banner enquanto o app está aberto
    shouldShowList: true,    // Adiciona à central de notificações
    shouldPlaySound: true,
    shouldSetBadge: false,
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
    salvarVersiculoNoHistorico(versiculoDoDia);

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
        seconds: 60 * 60 * 24, // a cada 24h
        repeats: true,
      } as Notifications.CalendarTriggerInput,
    });
  }

  function enviarNotificacaoTeste(event: GestureResponderEvent): void {
    throw new Error('Function not implemented.');
  }


  async function salvarVersiculoNoHistorico(versiculo: string) {
    try {
      const hoje = new Date().toISOString().split('T')[0]; // formato: 'YYYY-MM-DD'
      const historicoAtual = await AsyncStorage.getItem('historico');
      const historico = historicoAtual ? JSON.parse(historicoAtual) : [];

      // Verifica se já existe um versículo salvo para hoje
      const jaSalvoHoje = historico.some((item: { data: string }) =>
        item.data.startsWith(hoje)
      );

      if (!jaSalvoHoje) {
        historico.push({ versiculo, data: new Date().toISOString() });
        await AsyncStorage.setItem('historico', JSON.stringify(historico));
      }
    } catch (error) {
      console.error('Erro ao salvar no histórico:', error);
    }
  }
  async function excluirVersiculoDoHistorico(index: number) {
    try {
      const historicoAtual = await AsyncStorage.getItem('historico');
      const historico = historicoAtual ? JSON.parse(historicoAtual) : [];

      historico.splice(index, 1); // Remove o item na posição `index`

      await AsyncStorage.setItem('historico', JSON.stringify(historico));
    } catch (error) {
      console.error('Erro ao excluir versículo do histórico:', error);
    }
  }

  return (

    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>📖 Versículo do Dia</Text>
      <Text style={styles.versiculo}>{versiculo}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Devocionais')}
        style={{
          backgroundColor: '#000',
          padding: 12,
          borderRadius: 10,
          marginTop: 30,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
          Devocionais
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Histórico')}
        style={{
          backgroundColor: '#000',
          padding: 12,
          borderRadius: 10,
          marginTop: 30,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
          Histórico
        </Text>
      </TouchableOpacity>
<TouchableOpacity
        onPress={() => navigation.navigate('Materiais')}
        style={{
          backgroundColor: '#000',
          padding: 12,
          borderRadius: 10,
          marginTop: 30,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
          Materiais de Estudo
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#000' },
  versiculo: { fontSize: 18, textAlign: 'center', marginBottom: 20, color: '#000' },
});
