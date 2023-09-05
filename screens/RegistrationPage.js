import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Input, Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { APP_URL } from "@env" 


const RegistrationPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const Navigation = useNavigation();

  const handleRegistration = async () => {
    try {
      const response = await axios.post(
        `${APP_URL}/auth/register`,
        {
          email,
          password,
          name,
        }
      );

      if (response.data.access_token) {
        // Store the access token in AsyncStorage
        await AsyncStorage.setItem("accessToken", response.data.access_token);

        Navigation.navigate("NewTransaction");
      }
    } catch (error) {
      // Error handling code
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerSignUp}>
        <Text style={styles.logo}>Sign up</Text>
      </View>
      <Input
        placeholder="Name"
        onChangeText={(text) => setName(text)}
        value={name}
        leftIcon={{ type: "font-awesome", name: "user" }}
      />
      <Input
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        leftIcon={{ type: "font-awesome", name: "envelope" }}
        keyboardType="email-address"
      />
      <Input
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        leftIcon={{ type: "font-awesome", name: "lock" }}
        secureTextEntry
      />
      <Button
        title="Register"
        onPress={handleRegistration}
        containerStyle={styles.buttonContainer}
      />
      <TouchableOpacity
        onPress={() => {
          Navigation.navigate("SignIn");
        }}
      >
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 20,
    width: "80%",
    backgroundColor: "#007BFF",
  },
  loginLink: {
    marginTop: 10,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  containerSignUp: {
    justifyContent: "center",
  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#007BFF",
    marginBottom: 40,
  },
});

export default RegistrationPage;
