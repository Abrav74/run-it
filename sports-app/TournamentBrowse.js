import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import TournamentList from "./TournamentList";

export default function TournamentBrowse({ tournaments = [], onClose }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return tournaments;
    return tournaments.filter((t) => {
      const name = (t.name || "").toLowerCase();
      const date = (t.date || "").toLowerCase();
      const desc = (t.description || "").toLowerCase();
      return name.includes(q) || date.includes(q) || desc.includes(q);
    });
  }, [query, tournaments]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browse Tournaments</Text>
      <TextInput
        style={styles.search}
        placeholder="Search by name, date or description"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
      />

      <View style={{ height: 8 }} />
      <Button title="Close" onPress={onClose} />

      <View style={{ height: 12 }} />
      <TournamentList tournaments={filtered} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, width: "100%", alignItems: "center" },
  title: { fontSize: 20, marginBottom: 8 },
  search: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
  },
});
