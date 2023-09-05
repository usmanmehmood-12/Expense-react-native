import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Transactions = ({ expenses, onDelete, onEdit }) => {
  //   const [sortCriteria, setSortCriteria] = useState('updatedAt');
  //   const [sortOrder, setSortOrder] = useState('desc');

  //   const handleSort = (criteria) => {
  //     if (sortCriteria === criteria) {
  //       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  //     } else {
  //       setSortCriteria(criteria);
  //       setSortOrder('asc');
  //     }
  //   };

  //   const sortedTransactions = [...transactions].sort((a, b) => {
  //     if (sortOrder === 'asc') {
  //       return a[sortCriteria] > b[sortCriteria] ? 1 : -1;
  //     } else {
  //       return a[sortCriteria] < b[sortCriteria] ? 1 : -1;
  //     }
  //   });

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <Text style={styles.transactionDescription}>{item.description}</Text>
      <Text style={styles.transactionAmount}>
        {item.amount < 0 ? `-$${Math.abs(item.amount)}` : `$${item.amount}`}
      </Text>
      <Text style={styles.transactionUpdatedAt}>
        {item.updatedAt?.split("T")[0]}
      </Text>
      <TouchableOpacity onPress={() => onDelete(item.id)}>
        <MaterialIcons name="delete" size={24} color="#ff6f61" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onEdit(item)}>
        <MaterialIcons name="edit" size={24} color="#bfe6ff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.transactionsContainer}>
        <Text style={styles.transactionsHeader}>Expenses History</Text>
        <View style={styles.tableHeader}>
          <TouchableOpacity
            onPress={() => handleSort("description")}
            style={styles.headerCell}
          >
            <Text style={styles.headerText}>Description</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSort("amount")}
            style={styles.headerCell}
          >
            <Text style={styles.headerText}>Amount</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSort("updatedAt")}
            style={styles.headerCell}
          >
            <Text style={styles.headerText}>Updated At</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          scrollEnabled={false}
          data={expenses}
          keyExtractor={(item) => (item ? item.id.toString() : "defaultKey")}
          renderItem={renderTransactionItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  transactionsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  transactionsHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#008080",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  headerCell: {
    flex: 1,
    paddingVertical: 5,
  },
  headerText: {
    fontWeight: "bold",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: "#f2f2f2",
    borderBottomWidth: 1,
  },
  transactionDescription: {
    flex: 3,
  },
  transactionAmount: {
    flex: 2,
    fontWeight: "bold",
    color: "#0eaf52",
    textAlign: "right",
  },
  transactionUpdatedAt: {
    flex: 2,
    textAlign: "right",
  },
});

export default Transactions;
