import { StyleSheet, Dimensions } from "react-native";
import { appColors } from "../../app/common/utils/utils";

const { width, height } = Dimensions.get('window');
export const LoginStyles = StyleSheet.create({
    logoStyle: {
        width: width * 0.50,
        height: height * 0.034,
        resizeMode: 'contain'
    },
    LoginContainer: {
        height: height * 0.8,
        display: 'flex',
        justifyContent: 'center',
        marginVertical: 'auto',
        marginHorizontal: width * 0.05,
       
    },
    signInText: {
        color: appColors.textColor,
        marginTop: 40
    },
    logoContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputBorderContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: appColors.inputBorderColor,
        borderRadius: 5,
        color: 'white'
    },
    secondaryTextColor: {
        marginTop: height * 0.05,
        textAlign: 'center',
        
    }
})