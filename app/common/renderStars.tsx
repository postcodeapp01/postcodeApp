// import { View } from "react-native-reanimated/lib/typescript/Animated";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(
          <Icon key={i} name="star" size={16} color="#FFD700" />
        );
      } else if (rating >= i - 0.5) {
        stars.push(
          <Icon key={i} name="star-half" size={16} color="#FFD700" />
        );
      } else {
        stars.push(
          <Icon key={i} name="star-border" size={16} color="#FFD700" />
        );
      }
    }
    return <View style={{ flexDirection: "row", marginVertical: 4}}>{stars}</View>;
  };