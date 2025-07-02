import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

const homeStyles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: 'white'
  },
  homeHeaderContainer: {
    padding: 10,
    borderBottomColor: '#f5f3ed',
    borderBottomWidth: 2,
  },
  homeHeaderSearchInputContainer: {
    width: width * 0.6,
    backgroundColor: '#D9D9D9',
    height: 35,
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    padding: 5 
  },
  homeSearchIcon: {
    width: 35, 
    height: 35,
    marginRight: 10,
    opacity: 0.5
  },
  addressLabelText: {
    fontWeight: '500',
    fontSize: 14,
    marginHorizontal: 10
  },
  addressLabelContainer: {
    width: width * 0.85,
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  categoryBlock: {
    flexGrow: 1,
    height: 48,
    backgroundColor: '#D9D9D9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  categoryBlockContainer: {
    display: 'flex',
    width: width * 0.2,
    maxWidth: 200
  },

  // ✅ Added for global search input
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 20,
    color: '#888',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default homeStyles;
