import { StyleSheet, Dimensions } from "react-native";
import { appColors } from "../../app/common/utils/utils";

const { width, height } = Dimensions.get('window');

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

export const CommonStyles = StyleSheet.create({
    flexRow: {
        display: 'flex',
        flexDirection: 'row'
    },
    fontWeight500: {
        fontWeight: 500
    },
    spaceBetween: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    marginVerticalSm: {
        marginVertical: 10
    },
    marginHorizonalSm: {
        marginHorizontal: 10
    },
    marginVerticalMd: {
        marginVertical: 20
    },
    fontWeight: {
        fontWeight: 500
    },
    popupContainer: {
        display: 'flex',
        width,
        position: 'absolute',
        top: 0,
        left: 0,
        height,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1000,
    },
    popupContentContainer: {
        backgroundColor: 'white',
        height: height * 0.6,
        width,
        opacity: 1,
        elevation: 10,
        borderRadius: 10,
    }
})