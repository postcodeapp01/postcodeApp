import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather"; // For arrow-left, share, shopping-bag
import AntIcon from "react-native-vector-icons/AntDesign"; // For hearto
import MaterialIcon from "react-native-vector-icons/MaterialIcons"; // Optional if needed

interface Props {
  title: string;
  wishlistCount?: number;
  onBack?: () => void;
  onShare?: () => void;
  onWishlist?: () => void;
  onCart?: () => void;
}

const ProductHeader: React.FC<Props> = ({
  title,
  wishlistCount = 0,
  onBack,
  onShare,
  onWishlist,
  onCart,
}) => {
  return (
    <View style={styles.header}>
      {/* Back Button + Title */}
      <View style={styles.left}>
        <TouchableOpacity onPress={onBack}>
          <Icon name="arrow-left" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>    {title}</Text>
      </View>

      {/* Action Icons */}
      <View style={styles.actions}>
        {/* Share */}
        <TouchableOpacity onPress={onShare} style={styles.iconButton}>
          <Icon name="share-2" size={20} color="#AAAAAA" />
        </TouchableOpacity>

        {/* Wishlist with badge */}
        <TouchableOpacity onPress={onWishlist} style={styles.iconButton}>
          <AntIcon name="hearto" size={20} color="#AAAAAA" />
          {wishlistCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{wishlistCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Cart */}
        <TouchableOpacity onPress={onCart} style={styles.iconButton}>
          <Icon name="shopping-bag" size={20} color="#AAAAAA" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 11,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    left:5,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginHorizontal: 6,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: "#ff4d4d",
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
});
