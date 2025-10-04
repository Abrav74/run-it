import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function AccountEdit({
  username: initialUsername,
  onSave,
  onCancel,
}) {
  const [username, setUsername] = useState(initialUsername || "");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!username) {
      setError("Username cannot be empty.");
      return;
    }
    setError("");
    onSave(username);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.buttonRow}>
        <Button title="Save" onPress={handleSave} />
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
    width: 300,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
});
