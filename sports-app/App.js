import React, { useState } from "react";
import { SafeAreaView, View, Text, Button, StyleSheet } from "react-native";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>Counter: {count}</Text>
        <View style={styles.buttonRow}>
          <Button title="-" onPress={() => setCount(count - 1)} />
          <Button title="+" onPress={() => setCount(count + 1)} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  counterContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  counterText: {
    fontSize: 32,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 20,
  },
});
