import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { APP_URL } from "@env" 

const ForgotPassword = () => {
  const Navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handleSendEmail = async () => {
    try {
      await axios.post(`${APP_URL}/users/reset-password`, {
        email: email,
      });

      setIsEmailSent(true);
    } catch (error) {
      console.error("Error sending reset email:", error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Forgot Password</Text>
      {isEmailSent ? (
        <Text style={styles.message}>
          An email has been sent with instructions to reset your password.
        </Text>
      ) : (
        <View style={styles.inputContainer}>
          <Text style={styles.message}>
            Enter your email address to reset your password.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={handleEmailChange}
            value={email}
          />
          <TouchableOpacity style={styles.button} onPress={handleSendEmail}>
            <Text style={styles.buttonText}>Send Reset Email</Text>
          </TouchableOpacity>
        </View>
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:30
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    width: "80%", 
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ForgotPassword;
