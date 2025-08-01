import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';


type Material = {
  titulo: string;
  link: string;
};

export default function MateriaisScreen() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [titulo, setTitulo] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    carregarMateriais();
  }, []);

  async function carregarMateriais() {
    const data = await AsyncStorage.getItem('materiais');
    if (data) {
      setMateriais(JSON.parse(data));
    }
  }

async function selecionarArquivo() {
  const resultado = await DocumentPicker.getDocumentAsync({
    type: ['application/pdf'],
  });

  if (resultado.assets && resultado.assets.length > 0) {
    const arquivo = resultado.assets[0];

    const novo: Material = {
      titulo: arquivo.name,
      link: arquivo.uri,
    };

    const novaLista = [novo, ...materiais];
    setMateriais(novaLista);
    salvarMateriais(novaLista);
  }
}

  async function salvarMateriais(novaLista: Material[]) {
    await AsyncStorage.setItem('materiais', JSON.stringify(novaLista));
  }

  function adicionarMaterial() {
    if (!titulo.trim() || !link.trim()) return;

    const novo: Material = { titulo, link };
    const novaLista = [novo, ...materiais];
    setMateriais(novaLista);
    salvarMateriais(novaLista);
    setTitulo('');
    setLink('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📚 Materiais de Estudo Bíblico</Text>

      <TextInput
        placeholder="Título do material"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
      />
      <TextInput
        placeholder="Link para o PDF ou site"
        value={link}
        onChangeText={setLink}
        style={styles.input}
      />
      <Button title="Adicionar PDF do Celular" onPress={selecionarArquivo} color="#000" />


      <FlatList
        data={materiais}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => Linking.openURL(item.link)}
          >
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.link}>{item.link}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#000' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f2f2f2'
  },
  item: {
    padding: 12,
    backgroundColor: '#000',
    marginBottom: 12,
    borderRadius: 8,
  },
  titulo: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { color: '#ccc', fontSize: 14 }
});
