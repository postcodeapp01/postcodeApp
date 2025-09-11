// src/components/ProductDetails/ProductImageCarousel.tsx
import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

const {width} = Dimensions.get('window');

interface Props {
  images: (string | number)[];
}

const THUMB_WIDTH = 70;
const THUMB_MARGIN_RIGHT = 12;
const THUMB_TOTAL = THUMB_WIDTH + THUMB_MARGIN_RIGHT;

const ProductImageCarousel: React.FC<Props> = ({images}) => {
  // remove falsy entries (null/undefined/empty) to avoid empty thumbnails/pages
  const validImages = (images || []).filter(
    img => img !== null && img !== undefined && img !== '',
  );
  // console.log(validImages.length);
  const [activeIndex, setActiveIndex] = useState(0);
  const mainRef = useRef<ScrollView | null>(null);
  const thumbRef = useRef<ScrollView | null>(null);

  // If images change and active index is out of range, clamp it
  useEffect(() => {
    if (activeIndex >= validImages.length) {
      setActiveIndex(Math.max(0, validImages.length - 1));
      // also move main/thumbnail refs if available
      const newIndex = Math.max(0, validImages.length - 1);
      mainRef.current?.scrollTo({x: newIndex * width, animated: false});
      const offset = Math.max(
        0,
        newIndex * THUMB_TOTAL - (width - THUMB_TOTAL) / 2,
      );
      thumbRef.current?.scrollTo({x: offset, animated: false});
    }
  }, [validImages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleThumbnailPress = (index: number) => {
    setActiveIndex(index);
    mainRef.current?.scrollTo({x: index * width, animated: true});

    // center thumbnail in thumbnail strip
    const offset = Math.max(0, index * THUMB_TOTAL - (width - THUMB_TOTAL) / 2);
    thumbRef.current?.scrollTo({x: offset, animated: true});
  };

  const onMainMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    if (index === activeIndex) return;
    setActiveIndex(index);

    const offset = Math.max(0, index * THUMB_TOTAL - (width - THUMB_TOTAL) / 2);
    thumbRef.current?.scrollTo({x: offset, animated: true});
  };

  // If no images, show a simple placeholder
  if (!validImages || validImages.length === 0) {
    return (
      <View style={[styles.placeholderWrapper, {width, height: 520}]}>
        <Image
          source={require('../../../sources/images/c1.png')} // optional: replace with your placeholder
          style={styles.placeholderImage}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View>
      {/* Main horizontal pager: each page is a full-width View so paging is exact */}
      <ScrollView
        ref={mainRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMainMomentumEnd}
        nestedScrollEnabled={true}
        contentContainerStyle={{}}>
        {validImages.map((item, index) => {
          const source = typeof item === 'string' ? {uri: item} : item;
          return (
            <View key={`main-${index}`} style={{width, height: 520}}>
              <Image
                source={source}
                style={styles.image}
                accessibilityLabel={`product-image-${index}`}
              />
            </View>
          );
        })}
      </ScrollView>

      {/* Thumbnail strip */}
      <ScrollView
        ref={thumbRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.thumbnailList}>
        {validImages.map((item, index) => {
          const source = typeof item === 'string' ? {uri: item} : item;
          const isActive = index === activeIndex;
          const last = index === validImages.length - 1;
          return (
            <TouchableOpacity
              key={`thumb-${index}`}
              activeOpacity={0.85}
              onPress={() => handleThumbnailPress(index)}>
              <View
                style={[
                  styles.thumbnailContainer,
                  isActive && styles.thumbnailActive,
                  {marginRight: last ? 0 : THUMB_MARGIN_RIGHT},
                ]}>
                <Image source={source} style={styles.thumbnail} />
                {isActive && (
                  <View style={styles.activeOverlay} pointerEvents="none" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ProductImageCarousel;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#f6f6f6',
  },
  thumbnailList: {
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 7,
    alignItems: 'center',
    // backgroundColor:'#a13030ff'
  },
  thumbnailContainer: {
    width: THUMB_WIDTH,
    height: THUMB_WIDTH,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    // borderWidth: 2,
    // borderColor: '#FF5964',
  },
  thumbnailActive: {
    // borderColor: '#FF5964',
  },
  placeholderWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
