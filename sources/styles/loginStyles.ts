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
        color:'#060606ff'
    },
    secondaryTextColor: {
        marginTop: height * 0.05,
        textAlign: 'center',   
    },
    MainHeaderContainer: {
        backgroundColor: appColors.backgroundColor,
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 15,
        elevation: 2,
    },
    otpContainer: {
        display: 'flex',
        flex: 1,
        backgroundColor: appColors.backgroundColor,
        paddingVertical: width * 0.3,
        paddingHorizontal: 20,
    },
    otpTextStyle: {
        textAlign: 'center',
        fontSize: 16,
        color:'#000',
        marginVertical: 5,
    },
    resendOtpContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    flashscreenContainer: {
        backgroundColor: appColors.backgroundColor,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: "center"
    }
})