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



// import { Text, Pressable, StyleSheet, ViewStyle, TextStyle, ImageBackground } from "react-native";
// import { icons, IconName } from "./utils/utils";

// interface IButtonInterface {
//     text: string;
//     onClick: () => void;
//     iconName?: IconName;
//     disabled?: boolean;
// }

// export default function Button({ text, onClick = () => {}, iconName, disabled }: IButtonInterface) {
//     return (
//         <Pressable
//             onPress={() => { if (!disabled) onClick(); }}
//             style={[
//                 styles.button,
//                 { opacity: disabled ? 0.6 : 1 }
//             ]}
//         >
//             {iconName && (
//                 <ImageBackground
//                     style={{ aspectRatio: 1, width: 24, marginRight: 8 }}
//                     source={icons[iconName]}
//                 />
//             )}
//             <Text style={styles.buttonText}>{text}</Text>
//         </Pressable>
//     );
// }

// const styles = StyleSheet.create({
//     button: {
//         backgroundColor: "#FF5E5B", // same red as screenshot
//         borderRadius: 10,           // rounded corners like image
//         paddingVertical: 14,        // height spacing
//         paddingHorizontal: 20,
//         justifyContent: "center",
//         alignItems: "center",
//         flexDirection: "row",
//         width: "100%",               // full width
//     } as ViewStyle,
//     buttonText: {
//         color: "#fff",
//         fontWeight: "600",           // bold text
//         fontSize: 16,                // matches screenshot
//     } as TextStyle
// });
