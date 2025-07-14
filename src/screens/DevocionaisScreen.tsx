import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Devocional = {
  titulo: string;
  texto: string;
  data: string;
};

export default function DevocionaisScreen() {
  const [devocionais, setDevocionais] = useState<Devocional[]>([]);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [explicacoes, setExplicacoes] = useState<{ [index: number]: string }>({});
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarDevocionais();
  }, []);

  async function carregarDevocionais() {
    try {
      const data = await AsyncStorage.getItem('devocionais');
      if (data) {
        setDevocionais(JSON.parse(data));
      }
    } catch (error) {
      console.error('Erro ao carregar devocionais:', error);
    }
  }

  async function salvarDevocionais(novaLista: Devocional[]) {
    try {
      await AsyncStorage.setItem('devocionais', JSON.stringify(novaLista));
    } catch (error) {
      console.error('Erro ao salvar devocionais:', error);
    }
  }

  function adicionarDevocional() {
    if (!titulo.trim() || !texto.trim()) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha título e texto.');
      return;
    }

    const nova: Devocional = {
      titulo,
      texto,
      data: new Date().toLocaleDateString(),
    };

    const novaLista = [nova, ...devocionais];
    setDevocionais(novaLista);
    salvarDevocionais(novaLista);
    setTitulo('');
    setTexto('');
  }

  async function explicarDevocional(texto: string, index: number) {
    try {
      setCarregando(true);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 🔐 Substitua aqui!
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'Você é um teólogo cristão que explica devocionais de forma simples, bíblica e edificante.',
            },
            {
              role: 'user',
              content: `Explique esse devocional:\n${texto}`,
            },
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const explicacao = data.choices?.[0]?.message?.content || 'Não foi possível gerar a explicação.';
      setExplicacoes((prev) => ({ ...prev, [index]: explicacao }));
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar explicação da IA.');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>          Minhas Devocionais</Text>

      {/* Formulário */}
      <TextInput
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Texto"
        value={texto}
        onChangeText={setTexto}
        style={[styles.input, { height: 100 }]}
        multiline
        placeholderTextColor="#aaa"
      />
      <Button color={'#000'} title="Salvar Devocional" onPress={adicionarDevocional} />

      {/* Lista */}
      {devocionais.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.date}>{item.data}</Text>
          <Text style={styles.title}>{item.titulo}</Text>
          <Text style={styles.text}>{item.texto}</Text>

          <Button
            title={carregando ? 'Carregando...' : 'Explicar com IA'}
            onPress={() => explicarDevocional(item.texto, index)}
            disabled={carregando}
          />

          {explicacoes[index] && (
            <Text style={styles.explicacao}>{explicacoes[index]}</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#000',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#fff',
  },
  card: {
    marginTop: 10,
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  date: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  explicacao: {
    marginTop: 8,
    fontSize: 14,
    color: '#ccc',
    fontStyle: 'italic',
  },
});
