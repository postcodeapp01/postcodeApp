import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

interface Props {
  activeTab: "offers" | "orders";
  setActiveTab: (tab: "offers" | "orders") => void;
}

const TabSwitcher: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ selected: activeTab === "offers" }}
          onPress={() => setActiveTab("offers")}
          activeOpacity={0.85}
          style={[
            styles.tab,
            styles.leftTab,
            activeTab === "offers" ? styles.activeTab : styles.inactiveTab,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "offers" && styles.activeTabText,
            ]}
          >
            Offers Updates
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ selected: activeTab === "orders" }}
          onPress={() => setActiveTab("orders")}
          activeOpacity={0.85}
          style={[
            styles.tab,
            styles.rightTab,
            activeTab === "orders" ? styles.activeTab : styles.inactiveTab,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "orders" && styles.activeTabText,
            ]}
          >
            Order Updates
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TabSwitcher;

const ACTIVE_COLOR = "#FF5964";

const styles = StyleSheet.create({
  wrapper: {
    display:'flex',
    // backgroundColor:'#9fefffff',
    height:50,
  },
  tabContainer: {
    padding:10,
    justifyContent:'center',
    flexDirection: "row",
    paddingVertical: 9, 
    // backgroundColor: "#4dc883ff",
    borderWidth: 1,
    borderColor: "#eee",
  },

  // common tab styles
  tab: {
    height:30,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  // ensure proper pill corners depending on position
  leftTab: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  rightTab: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },

  // active (filled) pill
  activeTab: {
    backgroundColor: ACTIVE_COLOR,
    // remove outline when active
    borderWidth: 0,
    // a little shadow for the active pill (optional)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },

  // inactive (outlined) pill
  inactiveTab: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: ACTIVE_COLOR,
  },

  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000", 
  },

  activeTabText: {
    color: "#fff",
  },
});
