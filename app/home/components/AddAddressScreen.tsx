import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axiosInstance from "../../../config/Api";

const AddAddressScreen = ({ navigation, route }: any) => {
  const [house, setHouse] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [landmark, setLandmark] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [label, setLabel] = useState<string>("Home");

  const editingData = route?.params?.addressData || null;

  useEffect(() => {
    if (editingData) {
      setHouse(editingData.addressLine1 || "");
      setAddress(editingData.addressLine2 || "");
      setLandmark(editingData.landmark || "");
      setCity(editingData.city || "");
      setState(editingData.state || "Telangana");
      setPincode(editingData.pincode || "");
      setLabel(editingData.label || "Home");
    }
  }, [editingData]);

  const handleConfirm = async () => {
    try {
      const payload = {
        label,
        addressLine1: house,
        addressLine2: address,
        landmark,
        city,
        state,
        country: "India",
        pincode,
      };

      if (editingData) {
        await axiosInstance.put(`/address/${editingData.id}`, payload);
        Alert.alert("Success", "Address updated successfully");
      } else {
        await axiosInstance.post("/address", payload);
        Alert.alert("Success", "Address added successfully");
      }

      route.params?.onRefresh?.();
      navigation.goBack();
    } catch (err: any) {
      console.error("Save Address Error:", err.response?.data || err.message);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to save address"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {editingData ? "Edit Address" : "Add New Address"}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter house / flat / floor no"
            placeholderTextColor="#b5acacff"
            value={house}
            onChangeText={setHouse}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter complete address"
            placeholderTextColor="#b5acacff"
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            style={styles.input}
            placeholder="Landmark"
            placeholderTextColor="#b5acacff"
            value={landmark}
            onChangeText={setLandmark}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#b5acacff"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={styles.input}
            placeholder="State"
            placeholderTextColor="#b5acacff"
            value={state}
            onChangeText={setState}
          />
          <TextInput
            style={styles.input}
            placeholder="Pincode"
            placeholderTextColor="#b5acacff"
            keyboardType="numeric"
            value={pincode}
            onChangeText={setPincode}
          />
        </View>

        {/* Save As */}
        <Text style={styles.saveAsLabel}>Save As</Text>
        <View style={styles.saveAsRow}>
          {["Home", "Office", "Others"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.saveAsBtn,
                label === item && styles.saveAsBtnActive,
              ]}
              onPress={() => setLabel(item)}
            >
              <Text
                style={[
                  styles.saveAsText,
                  label === item && styles.saveAsTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
        <Text style={styles.confirmText}>
          {editingData ? "Update Address" : "Save Address"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default AddAddressScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
    color: "#000",
  },
  selectedBox: {
    margin: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  selectedTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  changeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#007AFF",
  },
  locationDesc: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
  },
  form: {
    marginHorizontal: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color:'#060101ff'
  },
  saveAsLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    color: "#000",
  },
  saveAsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 20,
  },
  saveAsBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  saveAsBtnActive: {
    borderColor: "#FF6B6B",
    backgroundColor: "#FF6B6B20",
  },
  saveAsText: {
    fontSize: 14,
    color: "#666",
  },
  saveAsTextActive: {
    color: "#FF6B6B",
    fontWeight: "600",
  },
  confirmBtn: {
    backgroundColor: "#FF6B6B",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
