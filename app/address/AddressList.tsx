import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { View, Text, FlatList } from "react-native";
import { CommonStyles } from "../../sources/styles/common";
import AddressItem from "./AddressItem";
import Button from "../common/Button";
import { getAddressDetails , getPaginatedAddressList} from "./AddressServices";
import Loader from "../common/utils/Loader";

export interface addressProps {
    id: string,
    label: string,
    houseNumber: string,
    addressLine1: string,
    addressLine2: string,
    state: string,
    city: string,
    pincode: number
}

export interface addressListProps {
    address: addressProps[];
    status: number;
    count: number;
    next: string;
    prev: string;
}

interface AddressListCompProps {
    setSelectedAddress: React.Dispatch<React.SetStateAction<addressProps>>;
    setShowPopup?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddressList({ setSelectedAddress, setShowPopup }: AddressListCompProps) {
    const [addressList, setAddressList] = useState<addressListProps>({});
    const [isLoading, setIsLoading]= useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);

    useEffect(() => {
          getAddressData();
      }, []);

      const getAddressData = () => {
        setIsLoading(true);  
        getAddressDetails().then(async (res) => {
            if(res.status === 200) {
              setAddressList(res);
            }
        }).catch((err) => {
            console.log(`error will getting the address details`, err);
        }).finally(() => {
            setIsLoading(false);
        })
      }

      const loadMoreData = async () => {
        if (loadingMore) return;
        setLoadingMore(true);
      
        try {
          const newData = await getPaginatedAddressList(addressList?.next);
          const updatedAddressList = {...addressList};
          updatedAddressList.next = newData.next;
          updatedAddressList.prev = newData.prev;
          updatedAddressList.address = [...updatedAddressList.address, ...newData.address]
          setAddressList(updatedAddressList);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingMore(false);
        }
      };
      
    

    const renderAddressList = (): React.ReactElement => {
        return (
            <FlatList
                data={addressList?.address}
                contentContainerStyle={{ paddingBottom: 50 }}
                renderItem={({ item }) => (
                    <AddressItem address={item} setSelectedAddress={setSelectedAddress} setShowPopup={setShowPopup} />
                )}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled
                showsVerticalScrollIndicator
                ListFooterComponent={
                    <View style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="primary" text="Add Address" onClick={() => { }} />
                    </View>
                }
                ListHeaderComponent={
                    <Text style={CommonStyles.marginVerticalSm}>Saved Address</Text>
                }
                onEndReached={() => {
                    if(addressList?.next) loadMoreData()
                }}
            />
        )
    }

    if(isLoading) {
        return <Loader />
    }
    return  renderAddressList()
    
}