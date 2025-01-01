import { View, Text } from "react-native";
import { DividerStyles } from "../../sources/styles/common";

export default function Divider({ text }: { text: string }) {
    return (
        <View style={DividerStyles.dividerContainer}>
            <Text style={DividerStyles.dividerText}>{text}</Text>
        </View>
    )
}