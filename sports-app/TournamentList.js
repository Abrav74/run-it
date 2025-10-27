import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function TournamentList({ tournaments }) {
  if (!tournaments || tournaments.length === 0) {
    return (
      <View style={styles.empty}>
        <Text>No tournaments yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tournaments}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.name}>{item.name}</Text>
          {item.date ? <Text style={styles.date}>{item.date}</Text> : null}
          {item.description ? (
            <Text style={styles.desc}>{item.description}</Text>
          ) : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  empty: { padding: 10 },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  name: { fontWeight: "bold" },
  date: { color: "#666" },
  desc: { marginTop: 4 },
});
