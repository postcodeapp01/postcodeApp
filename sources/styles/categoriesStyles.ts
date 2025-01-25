import  { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const categories = StyleSheet.create({
    categoryContainer: {
        width: width * 0.45,
        padding: 10,
        backgroundColor: '#efefef',
        borderRadius: 5,
        marginVertical: 10,
        display: 'flex',
        alignItems: 'center'
    },
    mainContainer: {
        backgroundColor: 'white',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly'
    },
    imageContainer: {
        width: 100,
        height: 50,

    }
})

export default categories;