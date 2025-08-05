import React, { useMemo, useState, useCallback } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import Input from "../common/Input";
import CustomButton from "../common/Button";
import axiosInstance, { Api } from "../../config/Api";
import ButtonGroup from "../common/ButtonGroup";
import { AddressStyles } from "../../sources/styles/AddressStyles";
import {  addressProps } from "./AddressList";

interface AddAddressScreenProps {
    getAddressDetails: () => void;
    selectedAddress?: addressProps;
    setShowAddAddressScreen?: React.Dispatch<React.SetStateAction<boolean>>;
}

 const AddAddress = ({getAddressDetails, selectedAddress, setShowAddAddressScreen }: AddAddressScreenProps) => {
    const [addressLine1, setAddressLine1] = useState<string>(selectedAddress?.addressLine1 || "");
    const [addressLine2, setAddressLine2] = useState<string>(selectedAddress?.addressLine2 || "");
    const [landmark, setLandMark] = useState<string>(selectedAddress?.city || "");
    const [label, setLabel] = useState<string>(selectedAddress?.label || "home");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleAddAddress = useCallback(() => {
        if (isLoading) return; // Prevent multiple calls
        
        setIsLoading(true);
        axiosInstance.post(
            Api.address,
            {
                label,
                addressLine1,
                addressLine2,
                city: landmark,
                state: 'HYD',
                country: "India",
                pincode: "500053",
            }
        ).then(({ data }) => {
            if(data.status === 200) {
                getAddressDetails();
                
            }

        }).catch((err) => {
            console.log(err.response.data);
        }).finally(() => {
            setIsLoading(false);
        })
    }, [label, addressLine1, addressLine2, landmark, isLoading, getAddressDetails, setShowAddAddressScreen]);

    const renderInputField = useCallback((placeholder: string, setterFunction: (arg: any) => void, value: any) => {
        return (
            <Input 
                key={placeholder}
                label="" 
                value={value} 
                placeholder={placeholder} 
                onChangeInput={(text) => setterFunction(text)} 
                inputStyle={AddressStyles.inputStyle} 
            />
        )
    }, []);

    const renderLoader = useCallback(() => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        )
    }, []);

    const isButtonDisabled = useCallback(() => {
        return !addressLine1 || !addressLine2 || !label || isLoading
    }, [addressLine1, addressLine2, label, isLoading]);

    const buttonGroup = useMemo(() => [
        {title: 'Home', value: 'home' },
        {title: 'Office', value: 'office' },
        {title: 'Others', value: 'others' },
      ], []);
      
    
    return (
        <View style={{ backgroundColor: "#FAFAFA", flex: 1 }}>
            {isLoading ? renderLoader() : (
            <View style={AddressStyles.addAddressContainer}>
                <View>
                    {renderInputField("Enter house / flat / floor no", setAddressLine1, addressLine1)}
                    {renderInputField("Enter Complete Address", setAddressLine2, addressLine2)}
                    {renderInputField("Landmark ( Optional )", setLandMark, landmark)}
                    <View style={{ marginTop: 30 }}>
                        <Text style={{ marginBottom: 10 }}>Save as</Text>
                        <ButtonGroup 
                            buttonList={buttonGroup}
                            selectedValue={label}
                            setSelectedValue={setLabel}
                            isHorizontal
                        />
                    </View>
                </View>
                <View>
                    <CustomButton 
                        type="primary" 
                        text="Confirm Location" 
                        disabled={isButtonDisabled()} 
                        onClick={handleAddAddress} 
                    />
                </View>
            </View>
            )}
        </View>
    )
}

export default AddAddress;