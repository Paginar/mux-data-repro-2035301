import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Player from "./player";

const HomeComponent = ({ navigation }) => (
  <View style={styles.container}>
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("Player")}>
        <Text style={styles.buttonText}>Press To Play</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function Index() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false, // Disable gestures for the whole app
        }}
      >
        <Stack.Screen name="Home" component={HomeComponent} />
        <Stack.Screen name="Player">
          {(props) => {
            return <Player {...props} />;
          }}
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
    backgroundColor: "#fff", // Neutral white background
  },
  buttonContainer: {
    backgroundColor: "#f2f2f2", // Neutral light gray background
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8, // Slightly rounded corners
    shadowColor: "#000", // Subtle shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android
  },
  buttonText: {
    fontSize: 16, // Neutral font size
    fontWeight: "500", // Neutral font weight
    color: "#333", // Neutral text color
  },
});
