import React, { useState } from "react";
import { SafeAreaView, View, Text, Button, StyleSheet } from "react-native";
import AccountCreation from "./AccountCreation";
import AccountEdit from "./AccountEdit";
import TournamentCreation from "./TournamentCreation";
import TournamentList from "./TournamentList";

export default function App() {
  const [accountCreated, setAccountCreated] = useState(false);
  const [username, setUsername] = useState("");
  const [count, setCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [showTournamentCreator, setShowTournamentCreator] = useState(false);
  const [tournaments, setTournaments] = useState([]);

  return (
    <SafeAreaView style={styles.container}>
      {!accountCreated ? (
        <AccountCreation
          onAccountCreated={(uname) => {
            setAccountCreated(true);
            setUsername(uname);
          }}
        />
      ) : (
        <View style={styles.counterContainer}>
          {editing ? (
            <AccountEdit
              username={username}
              onSave={(newName) => {
                setUsername(newName);
                setEditing(false);
              }}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <>
              <Text style={styles.counterText}>Welcome, {username}!</Text>
              <Text style={styles.counterText}>Counter: {count}</Text>
              <View style={styles.buttonRow}>
                <Button title="-" onPress={() => setCount(count - 1)} />
                <Button title="+" onPress={() => setCount(count + 1)} />
              </View>
              <View style={{ height: 10 }} />
              <Button title="Edit Account" onPress={() => setEditing(true)} />
              <View style={{ height: 10 }} />
              {showTournamentCreator ? (
                <TournamentCreation
                  onCreate={(t) => {
                    setTournaments((prev) => [t, ...prev]);
                    setShowTournamentCreator(false);
                  }}
                  onCancel={() => setShowTournamentCreator(false)}
                />
              ) : (
                <Button
                  title="Create Tournament"
                  onPress={() => setShowTournamentCreator(true)}
                />
              )}

              <View style={{ height: 12 }} />
              <TournamentList tournaments={tournaments} />
            </>
          )}
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
