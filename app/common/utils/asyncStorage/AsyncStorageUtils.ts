import AsyncStorage from "@react-native-async-storage/async-storage";

export function setItemInAsyncStorage(key: string, value: string) {
    AsyncStorage.setItem(key, value);
}

export async function  getItemFromAsyncStorage(key: string) {
    return await AsyncStorage.getItem(key);
}
