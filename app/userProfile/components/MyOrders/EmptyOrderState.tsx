import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";

type Props = {
  onTakeHome: () => void;
};

const { width } = Dimensions.get("window");

const EmptyOrdersState: React.FC<Props> = ({ onTakeHome }) => {
  return (
    <View style={styles.container}>
      {/* Center Image */}
      <Image
        source={require("../../../../sources/images/myorders.png")} // 👈 replace with your image
        style={styles.image}
      />

      {/* Message */}
      <Text style={styles.messageText}>
        No saved items yet. Tap the ❤️ to keep styles you love.
      </Text>

      {/* Take Me Home Button */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={onTakeHome}
        activeOpacity={0.8}
      >
        <Text style={styles.homeButtonText}>Take Me Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyOrdersState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    // height:494,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    resizeMode: "contain",
    marginBottom: 50,
  },
  messageText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginBottom: 30,
    lineHeight:20,
    fontWeight:'500',
  },
  homeButton: {
    backgroundColor: "#FF5E5B",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    width:380,
    height:54,
  },
  homeButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
