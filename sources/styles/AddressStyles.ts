import { StyleSheet } from "react-native";
import { appColors } from "../../app/common/utils/utils";

export const AddressStyles = StyleSheet.create({
    addressListContainer: {
        flex: 1,
        padding: 10
    },
    addressHeader: {
        fontSize: 18,
        fontWeight: 500
    },
    addressListHeaderContainer: { 
        borderBottomColor: appColors.borderColor, 
        borderBottomWidth: 1,
        paddingTop: 5,
        paddingBottom: 15
    },
    addressItemContainer: {
        borderBottomColor: appColors.borderColor,
        borderBottomWidth: 1,
        paddingVertical: 10
    }
});
