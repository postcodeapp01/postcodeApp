import { StyleSheet } from "react-native";
import { appColors } from "../../app/common/utils/utils";

export const ButtonStyles = StyleSheet.create({
    primary: {
        backgroundColor: appColors.primaryButtonColor,
        padding: 15,
        borderRadius: 5,
        marginTop: 25,
    },
    primaryText: {
        color: 'white',
        textAlign: 'center',
    },
    secondary: {
        paddingVertical: 10,
        borderRadius: 25,
        marginTop: 25,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: appColors.inputBorderColor,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    secondaryText: {
        textAlign: 'center',
        marginLeft: 10,
    }
})

export type ButtonStyleKey = keyof typeof ButtonStyles;

export const DividerStyles = StyleSheet.create({
    dividerContainer: {
        width: '100%',
        borderBottomColor: '#B9BCC4',
        borderBottomWidth: 1,
        marginTop: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dividerText: {
        width: 30,
        textAlign: 'center',
        marginBottom: -10,
        backgroundColor: 'white'  
    }
})