import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function TournamentCreation({ onCreate, onCancel }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 3) {
      setError("Tournament name must be at least 3 characters");
      return;
    }
    setError("");
    const tournament = {
      id: Date.now().toString(),
      name: trimmed,
      date: date.trim(),
      description: description.trim(),
    };
    onCreate(tournament);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Tournament</Text>
      <TextInput
        style={styles.input}
        placeholder="Tournament name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Date (e.g. 2025-10-31)"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.buttonRow}>
        <Button title="Create" onPress={handleCreate} />
        <Button title="Cancel" onPress={onCancel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    alignItems: "center",
    width: 320,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  error: { color: "red", marginBottom: 8 },
});
