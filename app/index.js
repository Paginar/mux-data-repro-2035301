import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Player from "./player";

function HomeComponent({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Player", { useDRM: true, useMuxWrapper: true })
          }
        >
          <Text style={styles.buttonText}>Play (With DRM and Mux wrapper)</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Player", {
              useDRM: false,
              useMuxWrapper: true,
            })
          }
        >
          <Text style={styles.buttonText}>
            Play (Without DRM and Mux wrapper)
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Player", {
              useDRM: true,
              useMuxWrapper: false,
            })
          }
        >
          <Text style={styles.buttonText}>
            Play (With DRM without Mux wrapper)
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Player", {
              useDRM: false,
              useMuxWrapper: false,
            })
          }
        >
          <Text style={styles.buttonText}>
            Play (Without DRM without Mux wrapper)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    backgroundColor: "#f2f2f2",
    margin: 2, // Neutral light gray background
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
