import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen({ navigation }: any) {
  const [historico, setHistorico] = useState<any[]>([]);

  useEffect(() => {
    carregarHistorico();
  }, []);

  async function carregarHistorico() {
    const historicoString = await AsyncStorage.getItem('historico');
    const historico = historicoString ? JSON.parse(historicoString) : [];
    setHistorico(historico);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Histórico de Versículos</Text>
      <FlatList
        data={historico}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.data}>{item.data}</Text>
            <Text style={styles.texto}>{item.texto}</Text>
          </View>
          
        )}
      />
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6a4c93',
  },
  item: {
    backgroundColor: '#fdf6e3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  data: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  texto: {
    fontSize: 18,
    color: '#333',
  },
});
