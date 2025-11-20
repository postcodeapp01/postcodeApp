// app/components/AddToCartModal.tsx
import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native';
import SizeChartModal, { SizeRow } from '../SizeChartModal';

interface AddToCartModalProps {
  visible: boolean;
  sizes: string[]; // e.g. ['XS','S','M','L']
  selectedSize: string | null;
  onSelectSize: (size: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  // new props:
  sizeChart?: SizeRow[]; // optional product-specific size chart (in cm)
  guideImage?: any; // require(...) or remote uri - measurement guide image
  fitNotes?: string;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  visible,
  sizes,
  selectedSize,
  onSelectSize,
  onConfirm,
  onClose,
  sizeChart,
  guideImage,
  fitNotes,
}) => {
  const [showSizeChart, setShowSizeChart] = useState(false);

  // fallback sample chart if none provided (replace with real product chart from backend)
  const fallbackChart: SizeRow[] = [
    { size: 'XS', bust: 80, waist: 62, hips: 86, length: 62 },
    { size: 'S', bust: 84, waist: 66, hips: 90, length: 63 },
    { size: 'M', bust: 88, waist: 70, hips: 94, length: 64 },
    { size: 'L', bust: 94, waist: 76, hips: 100, length: 65 },
    { size: 'XL', bust: 100, waist: 82, hips: 106, length: 66 },
  ];

  const chart = sizeChart && sizeChart.length ? sizeChart : fallbackChart;

  const handleOutsidePress = () => {
    onClose();
  };

  const handleModalPress = (e: any) => {
    // Prevent closing when touching inside the modal
    e.stopPropagation();
  };

  return (
    <>
      <Modal 
        animationType="slide" 
        transparent 
        visible={visible} 
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={handleModalPress}>
              <View style={styles.container}>
                {/* Header with Title and Size Chart */}
                <View style={styles.header}>
                  <Text style={styles.title}>Select Size</Text>
                  <TouchableOpacity
                    style={styles.sizeChartBtn}
                    onPress={() => setShowSizeChart(true)}
                  >
                    <Text style={styles.sizeChartBtnText}>Size Chart</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Size Options */}
                  <View style={styles.sizeOptions}>
                    {sizes.map((size) => (
                      <TouchableOpacity
                        key={size}
                        style={[
                          styles.sizeButton, 
                          selectedSize === size && styles.sizeButtonSelected
                        ]}
                        onPress={() => onSelectSize(size)}
                      >
                        <Text style={[
                          styles.sizeText, 
                          selectedSize === size && styles.sizeTextSelected
                        ]}>
                          {size}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Fit Notes */}
                  {fitNotes ? (
                    <View style={styles.fitNotesContainer}>
                      <Text style={styles.fitNotes}>{fitNotes}</Text>
                    </View>
                  ) : null}

                  {/* Size Guide Helper Text */}
                  <View style={styles.helperTextContainer}>
                    <Text style={styles.helperText}>
                      Not sure about size? Check our size chart for perfect fit.
                    </Text>
                  </View>
                </ScrollView>

                {/* Add to Cart Button */}
                <TouchableOpacity 
                  style={[
                    styles.confirmButton,
                    !selectedSize && styles.confirmButtonDisabled
                  ]} 
                  onPress={onConfirm}
                  disabled={!selectedSize}
                >
                  <Text style={[
                    styles.confirmButtonText,
                    !selectedSize && styles.confirmButtonTextDisabled
                  ]}>
                    {selectedSize ? `Add to Cart - ${selectedSize}` : 'Select Size'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <SizeChartModal
        visible={showSizeChart}
        onClose={() => setShowSizeChart(false)}
        chartData={chart}
        guideImage={guideImage ?? null}
        defaultUnit="cm"
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end' 
  },
  container: { 
    backgroundColor: '#fff', 
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    paddingBottom: 1,
  },
  title: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#000',
    lineHeight:20,
    letterSpacing:-0.32,
  },
  sizeChartBtn: { 
    paddingHorizontal: 12,
    paddingVertical: 8,
   
  },
  sizeChartBtnText: { 
    color: '#ff3f6c', 
    fontWeight: '500',
    fontSize: 12,
    letterSpacing:-0.32,
  },
  sizeOptions: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 8,
    gap: 12,
  },
  sizeButton: { 
    borderWidth: 1.5, 
    borderColor: '#ddd', 
    borderRadius: 9, 
    paddingVertical: 6, 
    paddingHorizontal: 8,
    minWidth: 30,
    height:30,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: '#fff',
  },
  sizeButtonSelected: { 
    backgroundColor: '#FF5964', 
    borderColor: '#FF5964',
    transform: [{ scale: 1.05 }],
  },
  sizeText: { 
    fontSize: 10, 
    color: '#000',
    fontWeight: '500',
  },
  sizeTextSelected: { 
    color: '#fff', 
    fontWeight: '600',
  },
  fitNotesContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  fitNotes: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  helperTextContainer: {
    marginBottom: 8,
  },
  helperText: {
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  confirmButton: { 
    backgroundColor: '#FF5964', 
    paddingVertical: 12, 
    borderRadius: 8, 
    alignItems: 'center',
    marginTop: 5,
    
  },
  confirmButtonDisabled: {
    backgroundColor: '#ddd',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmButtonText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 16,
  },
  confirmButtonTextDisabled: {
    color: '#999',
  },
});

export default AddToCartModal;
