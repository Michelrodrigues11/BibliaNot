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
          <Text style={styles.item}>
            
            📖 {item.versiculo}{"\n"}📅 {new Date(item.data).toLocaleDateString()}
             <Button title="Apagar"  color={'#000'} onPress={() => remover(index)} />
          </Text>
          
        )}
      />
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffffff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#000' },
  item: { marginBottom: 15, padding: 10, backgroundColor: '#000', borderRadius: 8 },
  versiculo: { fontSize: 16, marginBottom: 5, color: '#333' },
});
