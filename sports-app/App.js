import React, { useState } from "react";
import { SafeAreaView, View, Text, Button, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountCreation from "./AccountCreation";
import AccountEdit from "./AccountEdit";
import TournamentCreation from "./TournamentCreation";
import TournamentList from "./TournamentList";
import TournamentBrowse from "./TournamentBrowse";

const Stack = createNativeStackNavigator();

export default function App() {
  const [username, setUsername] = useState("");
  const [count, setCount] = useState(0);
  const [tournaments, setTournaments] = useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUp">
        <Stack.Screen name="SignUp" options={{ title: "Sign Up" }}>
          {(props) => (
            <SafeAreaView style={styles.container}>
              <AccountCreation
                onAccountCreated={(uname) => {
                  setUsername(uname);
                  props.navigation.replace("Home", { username: uname });
                }}
              />
            </SafeAreaView>
          )}
        </Stack.Screen>

        <Stack.Screen name="Home" options={{ title: "Home" }}>
          {(props) => (
            <SafeAreaView style={styles.container}>
              <View style={styles.counterContainer}>
                <Text style={styles.counterText}>
                  Welcome, {username || props.route.params?.username}!
                </Text>
                <Text style={styles.counterText}>Counter: {count}</Text>
                <View style={styles.buttonRow}>
                  <Button title="-" onPress={() => setCount((c) => c - 1)} />
                  <Button title="+" onPress={() => setCount((c) => c + 1)} />
                </View>
                <View style={{ height: 10 }} />
                <Button
                  title="Edit Account"
                  onPress={() => props.navigation.navigate("EditAccount")}
                />
                <View style={{ height: 10 }} />
                <Button
                  title="Create Tournament"
                  onPress={() => props.navigation.navigate("CreateTournament")}
                />
                <View style={{ height: 10 }} />
                <Button
                  title="Browse Tournaments"
                  onPress={() => props.navigation.navigate("Browse")}
                />
                <View style={{ height: 12 }} />
                <TournamentList tournaments={tournaments} />
              </View>
            </SafeAreaView>
          )}
        </Stack.Screen>

        <Stack.Screen name="EditAccount" options={{ title: "Edit Account" }}>
          {(props) => (
            <AccountEdit
              username={username}
              onSave={(newName) => {
                setUsername(newName);
                props.navigation.goBack();
              }}
              onCancel={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="CreateTournament"
          options={{ title: "Create Tournament" }}
        >
          {(props) => (
            <TournamentCreation
              onCreate={(t) => {
                setTournaments((prev) => [t, ...prev]);
                props.navigation.goBack();
              }}
              onCancel={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Browse" options={{ title: "Browse" }}>
          {(props) => (
            <TournamentBrowse
              tournaments={tournaments}
              onClose={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
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
