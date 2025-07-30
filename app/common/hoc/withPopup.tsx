import React, { useEffect, useState } from "react";
import { TouchableOpacity, View , TouchableWithoutFeedback, Pressable} from "react-native";
import { CommonStyles } from "../../../sources/styles/common";

type withPopupArgumentsProps = {
    popUpPosition?: string;
    togglePopup: (bool: boolean) => void;
    style?: any;
}


const withPopup = <P extends {}>(Component: React.ComponentType<P>, { popUpPosition = 'bottom', togglePopup, style= {} }: withPopupArgumentsProps): React.FC<P>=> {
    const getPosition = () => {
        switch(popUpPosition) {
            case 'center': 
                return 'center';
            case 'bottom':
                return 'flex-end';
            case 'top':
                return 'flex-start'
        }
    }
    return (props: P) => (
        <Pressable style={[CommonStyles.popupContainer, { justifyContent: getPosition()}, {...style}]} onPress={() => togglePopup(false)} pointerEvents="box-none">
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={[CommonStyles.popupContentContainer]}>
                <Component {...props} />
            </View>
            </TouchableWithoutFeedback>
        </Pressable>
    )
}

export default withPopup;