import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { APP_URL } from "@env" 
import Transactions from "./Transactions";

const NewTransaction = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dataFetched, setDataFetched] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState("");
  const [total, setTotal] = useState(0);

  const Navigation = useNavigation();

  const handleDescriptionChange = (text) => {
    setDescription(text);
  };

  const handleAmountChange = (text) => {
    setAmount(text);
  };

  const handleAddExpense = async () => {
    if (description.trim() === "" || isNaN(amount)) {
      alert("Please enter a valid description and amount.");
      if (description.trim() === "" || amount.trim() === "") {
        setErrorMessage("Please fill in both description and amount.");
        return; // Exit the function if either field is empty
      }
    }
    const transactionData = {
      description: description,
      amount: amount,
    };

    try {
      const bearerToken = await AsyncStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${bearerToken}`,
      };

      const response = await axios.post(
        `${APP_URL}/expenses/`,
        transactionData,
        {
          headers,
        }
      );
      if (response.status === 201) {
        const newExpense = {
          id: response.data.id,
          description: description,
          amount: parseFloat(amount),
          updatedAt: response.data.updatedAt,
        };

        // Update the list of expenses with the new expense
        setExpenses([...expenses, newExpense]);
        const newTotal = total + parseFloat(amount);
        setTotal(newTotal);
      } else {
        // Handle errors
      }
    } catch (error) {
      // Handle error
    }

    setDescription("");
    setAmount("");
  };

  async function fetchTransactions() {
    try {
      const bearerToken = await AsyncStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${bearerToken}`,
      };

      const response = await axios.get(`${APP_URL}/expenses/`, {
        headers,
      });

      setExpenses(response.data);
      setDataFetched(true);

      const totalExpenses = response.data.reduce((total, transaction) => {
        return total + Math.abs(transaction.amount);
      }, 0);

      setTotal(totalExpenses);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleEditIconClick = (item) => {
    setIsEditing(true);
    setDescription(item.description);
    setAmount(item.amount);
    setId(item.id);
  };

  const handleDeleteTransaction = async (transactionId) => {
    const bearerToken = await AsyncStorage.getItem("accessToken");
    const headers = {
      Authorization: `Bearer ${bearerToken}`,
    };

    const response = await axios.delete(
      `${APP_URL}/expenses/${transactionId}`,
      { headers }
    );
    const deletedTransaction = expenses.find(
      (transaction) => transaction.id === transactionId
    );

    // Calculate the reduction in the total expense
    const reductionAmount = deletedTransaction
      ? Math.abs(deletedTransaction.amount)
      : 0;

    const updatedTransactions = expenses.filter(
      (transaction) => transaction.id !== transactionId
    );

    const newTotal = total - reductionAmount;
    setTotal(newTotal);

    setExpenses(updatedTransactions);
    alert(response.data.message);
  };

  const handleEditSubmit = async () => {
    if (description.trim() === "" || amount.trim() === "") {
      setErrorMessage("Please fill in both description and amount.");
      return;
    }

    const updatedTransaction = {
      description: description,
      amount: amount,
    };
    try {
      const bearerToken = await AsyncStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${bearerToken}`,
      };

      const response = await axios.put(
        `${APP_URL}/expenses/${id}`,
        updatedTransaction,
        { headers }
      );

      if (response.status === 200) {
        const updatedAmount = parseFloat(amount);
        const previousAmount = expenses.find(
          (expense) => expense.id === id
        ).amount;
        const amountDifference = updatedAmount - previousAmount;

        // Update the transaction in the state
        // Reset form fields and exit edit mode
        const editedTransactionData = {
          id: response.data.id,
          description: description,
          amount: updatedAmount,
          updatedAt: response.data.updatedAt,
        };
        const updatedExpenses = expenses.map((expense) => {
          // Check if the expense's id matches the id of editedTransactionData
          if (expense.id === editedTransactionData.id) {
            // If there's a match, update the expense with editedTransactionData
            return editedTransactionData;
          } else {
            // If there's no match, keep the expense as it is
            return expense;
          }
        });

        const newTotal = total + amountDifference;
        setTotal(newTotal);

        setIsEditing(false);
        setExpenses(updatedExpenses);
        setAmount("");
        setDescription("");
        alert("Expense successfully edited!");
      } else {
        // Handle errors
      }
    } catch (error) {
      // Handle error
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");

      Navigation.navigate("SignIn");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f0f0f0",
        paddingTop: 40,
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={true}>
        <View>
          <Text style={styles.totalExpenses}>Total Expenses: ${total}</Text>

          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.signUp} onPress={handleLogout}>
              <Text>Logout</Text>
            </TouchableOpacity>
            <Text style={styles.transactionsHeader}>Add an Expense</Text>
            <View style={{ backgroundColor: "#f1f1f1" }}>
              <TextInput
                style={styles.input}
                placeholder="Description"
                placeholderTextColor="#003f5c"
                onChangeText={handleDescriptionChange}
                value={description}
              />
            </View>
            <View style={{ backgroundColor: "#f1f1f1" }}>
              <TextInput
                style={styles.input}
                placeholder="Amount"
                placeholderTextColor="#003f5c"
                onChangeText={handleAmountChange}
                value={amount}
                keyboardType="numeric"
              />
            </View>
            <Button
              title={isEditing ? "Edit Expense" : "Add Expense"}
              onPress={isEditing ? handleEditSubmit : handleAddExpense}
            />
          </View>
          {dataFetched ? (
            <Transactions
              expenses={expenses}
              onDelete={handleDeleteTransaction}
              onEdit={handleEditIconClick}
            />
          ) : (
            <Text>Loading data...</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionsHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 30,
    alignSelf: "flex-start",
    color: "#008080",
  },
  logoutButton: {
    alignSelf: "flex-end",
    marginVertical: 10,
    padding: 50,
  },
  content: {
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  totalExpenses: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
    elevation: 2,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    color: "#008080",
  },
  signUp: {
    color: "#007BFF",
    fontSize: 12,
    alignSelf: "flex-end",
  },
  inputContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  expensesContainer: {
    width: "100%",
    alignItems: "center",
  },
  expenseItem: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  expenseText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default NewTransaction;
