import * as React from 'react';
import { Dimensions, Image, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

function Index() {
    const width = Dimensions.get('window').width;
    return (
        <View style={{ flex: 1 }}>
            <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={true}
                data={[...new Array(6).keys()]}
                scrollAnimationDuration={1000}
                renderItem={({ index }) => (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <Image style={{ flex: 1, width: width}} source={{ uri: 'https://assets.ajio.com/cms/AJIO/WEB/D-1.0-MHP-230125-Fashionation-Z1-P1-Fashionation72HRS-5090.jpg' }} />
                    </View>
                )}
            />
        </View>
    );
}

export default Index;