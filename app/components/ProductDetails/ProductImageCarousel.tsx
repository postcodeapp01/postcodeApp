import React, {useRef, useState} from 'react';
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const {width} = Dimensions.get('window');

interface Props {
  images: (string | number)[]; // string for URL, number for require()
}

const ProductImageCarousel: React.FC<Props> = ({images}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainFlatListRef = useRef<FlatList<any>>(null);

  const handleThumbnailPress = (index: number) => {
    setActiveIndex(index);
    mainFlatListRef.current?.scrollToIndex({index, animated: true});
  };

  const renderMainImage = ({item}: {item: string | number}) => {
    const source = typeof item === 'string' ? {uri: item} : item;
    return <Image source={source} style={styles.image} />;
  };

  const renderThumbnail = ({
    item,
    index,
  }: {
    item: string | number;
    index: number;
  }) => {
    const source = typeof item === 'string' ? {uri: item} : item;
    const isActive = index === activeIndex;

    return (
      <TouchableOpacity onPress={() => handleThumbnailPress(index)}>
        <View style={styles.thumbnailContainer}>
          <Image source={source} style={styles.thumbnail} />
          {isActive && <View style={styles.activeOverlay} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {/* Main Carousel */}
      <FlatList
        ref={mainFlatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={images}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderMainImage}
        onMomentumScrollEnd={event => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
      />

      {/* Thumbnail Navigation */}

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={images}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderThumbnail}
        contentContainerStyle={styles.thumbnailList}
      />
    </View>
  );
};

export default ProductImageCarousel;

const styles = StyleSheet.create({
  image: {
    width: width,
    height: 520,
    resizeMode: 'cover',
  },
  thumbnailList: {
    marginTop: 5,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  thumbnailContainer: {
    position: 'relative',
    width: 70,
    height: 70,
    marginRight: 12,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  activeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)', // black with 50% opacity
  },
});
