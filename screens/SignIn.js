import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { APP_URL } from "@env" 

const SignIn = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const response = await axios.post(
        `${APP_URL}/auth/login`,
        {
          email: email,
          password: password,
        }
      );

      if (response.status === 201) {
        await AsyncStorage.setItem(
          "accessToken",
          response.data.token.access_token
        );

        setEmail("");
        setPassword("");

        // Navigate to the Dashboard screen
        navigation.navigate("NewTransaction");
      } else {
        alert("User not found");
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Expense App</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.forgot}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signUp}
          onPress={() => navigation.navigate("RegistrationPage")}
        >
          <Text>Sign Up Now</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={handleSignIn}>
        <Text style={styles.loginText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#007BFF",
    marginBottom: 40,
  },
  inputView: {
    width: "80%",
    backgroundColor: "#f1f1f1",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
    color: "black",
  },
  forgot: {
    color: "#007BFF",
    fontSize: 12,
    alignSelf: "flex-end",
  },
  signUp: {
    color: "#007BFF",
    fontSize: 12,
    alignSelf: "flex-start",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 10,
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#007BFF",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: "white",
  },
});

export default SignIn;
