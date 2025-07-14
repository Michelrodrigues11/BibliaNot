import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
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
async function remover(index: number) {
    await excluirVersiculoDoHistorico(index);
    carregarHistorico(); // Atualiza lista após remoção
  }

  async function excluirVersiculoDoHistorico(index: number) {
    const historicoAtual = await AsyncStorage.getItem('historico');
    const historico = historicoAtual ? JSON.parse(historicoAtual) : [];

    historico.splice(index, 1);
    await AsyncStorage.setItem('historico', JSON.stringify(historico));
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Histórico de Versículos</Text>
      <FlatList
        data={historico}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
           <View style={styles.card}>
          <Text style={styles.versiculo}>📖 {item.versiculo}{"\n"} {new Date(item.data).toLocaleDateString()}</Text>
            <TouchableOpacity onPress={() => remover(item.key)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 , backgroundColor: '#f0f0f0'},
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 , color: '#000'},
  card: {
    backgroundColor: '#000',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    
    
  },
  versiculo: { fontSize: 16, flex: 1 , color: '#ffff' },
  deleteButton: { marginLeft: 10 },
  deleteText: { fontSize: 18, color: '#b00020' },
});
