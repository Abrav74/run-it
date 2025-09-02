import React, { useState } from "react";
import { SafeAreaView, View, Text, Button, StyleSheet } from "react-native";
import AccountCreation from "./AccountCreation";

export default function App() {
  const [accountCreated, setAccountCreated] = useState(false);
  const [username, setUsername] = useState("");
  const [count, setCount] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      {!accountCreated ? (
        <AccountCreation onAccountCreated={(uname) => { setAccountCreated(true); setUsername(uname); }} />
      ) : (
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>Welcome, {username}!</Text>
          <Text style={styles.counterText}>Counter: {count}</Text>
          <View style={styles.buttonRow}>
            <Button title="-" onPress={() => setCount(count - 1)} />
            <Button title="+" onPress={() => setCount(count + 1)} />
          </View>
        </View>
      )}
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
