// app/components/SizeChartModal.tsx
import React, {useMemo, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Alert,
  ImageSourcePropType,
} from 'react-native';

export type SizeRow = {
  size: string;
  bust?: number; // cm
  waist?: number; // cm
  hips?: number; // cm
  length?: number; // cm
  inseam?: number; // cm
};

type Props = {
  visible: boolean;
  onClose: () => void;
  chartData: SizeRow[];
  guideImage?: ImageSourcePropType | null;
  defaultUnit?: 'cm' | 'in';
};

const cmToIn = (cm: number) => +(cm / 2.54).toFixed(1);
const inToCm = (inch: number) => +(inch * 2.54).toFixed(1);

export default function SizeChartModal({
  visible,
  onClose,
  chartData,
  guideImage = require('../../sources/images/measure.png'), // dummy require
  defaultUnit = 'cm',
}: Props) {
  const [unit, setUnit] = useState<'cm' | 'in'>(defaultUnit);
  const [bustInput, setBustInput] = useState('');
  const [waistInput, setWaistInput] = useState('');
  const [hipsInput, setHipsInput] = useState('');
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'guide' | 'chart'>('chart');

  // compute table columns
  const columns = useMemo(() => {
    const keys = new Set<string>(['size']);
    chartData.forEach(r => {
      if (typeof r.bust === 'number') keys.add('bust');
      if (typeof r.waist === 'number') keys.add('waist');
      if (typeof r.hips === 'number') keys.add('hips');
      if (typeof r.length === 'number') keys.add('length');
      if (typeof r.inseam === 'number') keys.add('inseam');
    });
    return Array.from(keys);
  }, [chartData]);

  const displayVal = (v?: number) => {
    if (typeof v !== 'number') return '-';
    return unit === 'cm' ? `${v}` : `${cmToIn(v)}`;
  };

  const toggleUnit = () => setUnit(u => (u === 'cm' ? 'in' : 'cm'));

  const recommendSize = () => {
    const bust = parseFloat(bustInput || '');
    const waist = parseFloat(waistInput || '');
    const hips = parseFloat(hipsInput || '');

    if (!bust && !waist && !hips) {
      Alert.alert(
        'Enter at least one measurement',
        'Please enter one of bust/waist/hips to get a recommendation.',
      );
      return;
    }

    const target = {
      bust: unit === 'in' && bust ? inToCm(bust) : bust || undefined,
      waist: unit === 'in' && waist ? inToCm(waist) : waist || undefined,
      hips: unit === 'in' && hips ? inToCm(hips) : hips || undefined,
    };

    let best: {size: string; score: number} | null = null;

    chartData.forEach(row => {
      let sumAbs = 0;
      let count = 0;
      if (row.bust && target.bust) {
        sumAbs += Math.abs(row.bust - target.bust);
        count++;
      }
      if (row.waist && target.waist) {
        sumAbs += Math.abs(row.waist - target.waist);
        count++;
      }
      if (row.hips && target.hips) {
        sumAbs += Math.abs(row.hips - target.hips);
        count++;
      }
      if (count === 0) return;
      const avg = sumAbs / count;
      if (!best || avg < best.score) best = {size: row.size, score: avg};
    });

    setRecommendedSize(best ? best.size : null);
  };

  const clearInput = () => {
    setBustInput('');
    setWaistInput('');
    setHipsInput('');
    setRecommendedSize(null);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Size Guide</Text>
            <View style={styles.headerRight}>
              {activeTab === 'chart' && (
                <TouchableOpacity onPress={toggleUnit} style={styles.unitBtn}>
                  <Text style={styles.unitText}>
                    {unit === 'cm' ? 'cm' : 'in'}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onClose} style={{marginLeft: 10}}>
                <Text style={{fontSize: 16}}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tab switcher */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'guide' && styles.tabBtnActive,
              ]}
              onPress={() => setActiveTab('guide')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'guide' && styles.tabTextActive,
                ]}>
                Guide
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'chart' && styles.tabBtnActive,
              ]}
              onPress={() => setActiveTab('chart')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'chart' && styles.tabTextActive,
                ]}>
                Size Chart
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {activeTab === 'guide' ? (
            <ScrollView contentContainerStyle={{alignItems: 'center'}}>
              <Image
                source={guideImage}
                style={styles.guideImage}
                resizeMode="contain"
              />
            </ScrollView>
          ) : (
            <ScrollView style={styles.content} contentContainerStyle={{paddingBottom: 24}}>
              {/* Find my size */}
              <View style={styles.findSizeBox}>
                <Text style={styles.sectionTitle}>Find your size</Text>
                <View style={styles.inputsRow}>
                  <TextInput
                    value={bustInput}
                    onChangeText={setBustInput}
                    keyboardType="numeric"
                    placeholder={`Bust (${unit})`}
                    style={styles.input}
                  />
                  <TextInput
                    value={waistInput}
                    onChangeText={setWaistInput}
                    keyboardType="numeric"
                    placeholder={`Waist (${unit})`}
                    style={styles.input}
                  />
                  <TextInput
                    value={hipsInput}
                    onChangeText={setHipsInput}
                    keyboardType="numeric"
                    placeholder={`Hips (${unit})`}
                    style={styles.input}
                  />
                </View>

                <View style={{flexDirection: 'row', marginTop: 8}}>
                  <TouchableOpacity
                    onPress={recommendSize}
                    style={styles.recommendBtn}>
                    <Text style={{color: '#fff', fontWeight: '700'}}>
                      Recommend Size
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={clearInput} style={styles.clearBtn}>
                    <Text style={{color: '#333'}}>Clear</Text>
                  </TouchableOpacity>
                </View>

                {recommendedSize ? (
                  <View style={styles.recommendedRow}>
                    <Text style={{fontWeight: '700'}}>Recommended size: </Text>
                    <Text style={{fontSize: 16}}>{recommendedSize}</Text>
                  </View>
                ) : null}
              </View>

              {/* Table */}
              <Text style={[styles.sectionTitle, {marginTop: 12}]}>
                Size table
              </Text>
              <ScrollView horizontal contentContainerStyle={{paddingBottom: 10}}>
                <View style={styles.table}>
                  {/* header row */}
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    {columns.map(col => (
                      <View key={col} style={styles.tableCellHeader}>
                        <Text style={styles.tableHeaderText}>
                          {col.toUpperCase()}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* data rows */}
                  {chartData.map(r => {
                    const isRecommended =
                      recommendedSize && recommendedSize === r.size;
                    return (
                      <View
                        key={r.size}
                        style={[
                          styles.tableRow,
                          isRecommended && {backgroundColor: '#fff4f6'},
                        ]}>
                        {columns.map(col => {
                          let value: string | number | undefined;
                          if (col === 'size') value = r.size;
                          else if (col === 'bust') value = displayVal(r.bust);
                          else if (col === 'waist') value = displayVal(r.waist);
                          else if (col === 'hips') value = displayVal(r.hips);
                          else if (col === 'length') value = displayVal(r.length);
                          else if (col === 'inseam') value = displayVal(r.inseam);
                          return (
                            <View
                              key={`${r.size}-${col}`}
                              style={styles.tableCell}>
                              <Text style={styles.tableText}>{value ?? '-'}</Text>
                            </View>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
              </ScrollView>

              <Text style={styles.note}>
                Note: Product measurements are approximate. For best fit,
                measure a garment that fits you well and compare.
              </Text>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    height: '85%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  title: {fontSize: 18, fontWeight: '700'},
  headerRight: {flexDirection: 'row', alignItems: 'center'},
  unitBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  unitText: {fontWeight: '700'},
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabBtnActive: {
    borderBottomWidth: 2,
    borderColor: '#ff3f6c',
  },
  tabText: {fontSize: 14, color: '#666'},
  tabTextActive: {fontWeight: '700', color: '#ff3f6c'},
  content: {paddingHorizontal: 12},
  guideImage: {
    width: '92%',
    height: 300,
    borderRadius: 8,
    marginVertical: 16,
    backgroundColor: '#fafafa',
  },
  findSizeBox: {
    marginTop: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: '#f1f1f1',
    borderRadius: 8,
  },
  sectionTitle: {fontWeight: '700', fontSize: 14, marginBottom: 8},
  inputsRow: {flexDirection: 'row', justifyContent: 'space-between'},
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  recommendBtn: {
    backgroundColor: '#ff3f6c',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  clearBtn: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
  },
  recommendedRow: {marginTop: 10, flexDirection: 'row', alignItems: 'center'},
  table: {flexDirection: 'column', minWidth: 420},
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#f3f3f3',
  },
  tableHeader: {backgroundColor: '#fafafa'},
  tableCellHeader: {
    minWidth: 80,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableHeaderText: {fontWeight: '700', fontSize: 12},
  tableCell: {
    minWidth: 80,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableText: {fontSize: 13},
  note: {marginTop: 12, color: '#666', fontSize: 12},
});
