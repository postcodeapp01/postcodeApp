import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
const {width} = Dimensions.get('window');
interface Props {
  images: (string | number)[];
}

const THUMB_WIDTH = 70;
const THUMB_MARGIN_RIGHT = 12;
const THUMB_TOTAL = THUMB_WIDTH + THUMB_MARGIN_RIGHT;
const DOT_SIZE = 10;
const DOT_SPACING = 8;
const ACTIVE_DOT_SCALE = 1.2;
const ProductImageCarousel: React.FC<Props> = ({images}) => {
  const validImages = (images || []).filter(
    img => img !== null && img !== undefined && img !== '',
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const mainRef = useRef<ScrollView | null>(null);
  const thumbRef = useRef<ScrollView | null>(null);
  useEffect(() => {
    if (activeIndex >= validImages.length) {
      setActiveIndex(Math.max(0, validImages.length - 1));
      const newIndex = Math.max(0, validImages.length - 1);
      mainRef.current?.scrollTo({x: newIndex * width, animated: false});
      const offset = Math.max(
        0,
        newIndex * THUMB_TOTAL - (width - THUMB_TOTAL) / 2,
      );
      thumbRef.current?.scrollTo({x: offset, animated: false});
    }
  }, [validImages.length]); 

  
  const onMainMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    if (index === activeIndex) return;
    setActiveIndex(index);

    const offset = Math.max(0, index * THUMB_TOTAL - (width - THUMB_TOTAL) / 2);
    thumbRef.current?.scrollTo({x: offset, animated: true});
  };
  const onDotPress = useCallback((index: number) => {
    setActiveIndex(index);
    mainRef.current?.scrollTo({x: index * width, animated: true});
    const offset = Math.max(0, index * THUMB_TOTAL - (width - THUMB_TOTAL) / 2);
    thumbRef.current?.scrollTo({x: offset, animated: true});
  }, []);

  if (!validImages || validImages.length === 0) {
    return (
      <View style={[styles.placeholderWrapper, {width, height: 520}]}>
        <Image
          source={require('../../../../sources/images/c1.png')} 
          style={styles.placeholderImage}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View>
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
      <View pointerEvents="box-none" style={[styles.dotsWrapper, {width}]}>
        <View style={styles.dotsContainer}>
          {validImages.map((_, i) => {
            const isActive = i === activeIndex;
            return (
              <TouchableOpacity
                key={`dot-${i}`}
                activeOpacity={0.8}
                onPress={() => onDotPress(i)}
                accessibilityRole="button"
                accessibilityLabel={`Go to image ${i + 1}`}
                accessibilityState={{selected: isActive}}
                style={[
                  styles.dotTouchable,
                  i < validImages.length - 1 ? {marginRight: DOT_SPACING} : null,
                ]}>
                <View
                  style={[
                    styles.dot,
                    isActive ? styles.dotActive : styles.dotInactive,
                    isActive
                      ? {
                          transform: [{scale: ACTIVE_DOT_SCALE}],
                        }
                      : undefined,
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
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
   dotsWrapper: {
    position: 'absolute',
    left: 0,
    bottom: Platform.OS === 'ios' ? 20 : 12, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  dotTouchable: {
    padding: 4,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  dotActive: {
    backgroundColor: '#FF5964',
  },
  dotInactive: {
    backgroundColor: '#fff',
    opacity: 0.9,
  },
});
