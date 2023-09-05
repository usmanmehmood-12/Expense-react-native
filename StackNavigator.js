import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegistrationPage from "./screens/RegistrationPage";
import SignIn from "./screens/SignIn";
import ForgotPassword from "./screens/ForgotPassword";
import NewTransaction from "./screens/NewTransaction";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="RegistrationPage" component={RegistrationPage} />
        <Stack.Screen name="NewTransaction" component={NewTransaction} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default StackNavigator;
