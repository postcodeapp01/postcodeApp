import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

const homeStyles = StyleSheet.create({
    homeContainer: {
        flex: 1,
        flexGrow: 1,
        backgroundColor: 'white'
    },
    homeHeaderContainer: {
        backgroundColor: 'white',
        elevation: 5,
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
    },
    homeHeaderSearchInputContainer: {
        width: width * 0.6,
        backgroundColor: '#f5f3ed',
        height: 45,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'   ,
        padding: 5 
    },
    homeSearchIcon: {
        width: 35, 
        height: 35,
        marginRight: 10,
        opacity: 0.5
    }
})

export default homeStyles;