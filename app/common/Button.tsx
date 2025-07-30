import { Text, ImageBackground, Pressable } from "react-native";
import { ButtonStyles, ButtonStyleKey } from "../../sources/styles/common";
import { icons, IconName } from "./utils/utils";

interface IButtonInterface {
    type: ButtonStyleKey,
    text: string,
    onClick: () => void,
    iconName?: IconName,
    iconType?: string,
    disabled?: boolean
}

export default function Button({ type, text, onClick = () => {}, iconName, iconType = 'png', disabled}: IButtonInterface) {
    return (
            <Pressable onPress={() => {if(!disabled) onClick()}} style={[ButtonStyles[type], { opacity: disabled ? 0.5 : 1 }]}>
               {iconName ? <ImageBackground style={{ aspectRatio: 1, width: 24 }} source={icons[iconName]} /> : null}
                <Text style={ButtonStyles[`${type}Text`]}>{text}</Text>
            </Pressable>
    )
}