import {useCallback, useEffect, useState} from 'react';

import {Address as TAddress} from '../components/Address/address';
import axiosInstance from '../../../config/Api';

type UseAddressesReturn = {
  addresses: TAddress[];
  defaultAddress?: TAddress;
  nonDefaultAddresses: TAddress[];
  loading: boolean;
  refreshing: boolean;
  fetchAddresses: () => Promise<void>;
  markDefault: (id: string) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  upsertAddress: (addr: TAddress) => void; // local update after Add/Edit success
};

export default function useAddresses(): UseAddressesReturn {
  const [addresses, setAddresses] = useState<TAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const mapServer = (addr: any): TAddress => ({
    id: String(addr.id),
    name: addr.name,
    label: addr.label,
    addressLine1: addr.addressLine1,
    addressLine2: addr.addressLine2 || '',
    city: addr.city,
    state: addr.state,
    country: addr.country,
    pincode: addr.pincode,
    phone: addr.phone,
    lat: addr.lat ? parseFloat(addr.lat) : undefined,
    lng: addr.lng ? parseFloat(addr.lng) : undefined,
    isDefault: Boolean(addr.isDefault),
  });

  const fetchAddresses = useCallback(async () => {
    try {
      if (!loading) setRefreshing(true);
      setLoading(true);
      const res = await axiosInstance.get('/address?page=1&limit=20');
      const mapped: TAddress[] = (res.data.address || []).map(mapServer);
      setAddresses(mapped);
    } catch (e) {
      console.error('fetchAddresses failed', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const markDefault = useCallback(async (id: string) => {
    // optimistic update: set selected to default, others false
    const prev = addresses;
    setAddresses(prev.map(a => ({...a, isDefault: a.id === id})));
    try {
      await axiosInstance.patch(`/address/${id}`, {isDefault: 1});
      // optionally refetch to reconcile server state:
      // await fetchAddresses();
    } catch (err) {
      console.error('markDefault failed', err);
      // revert
      setAddresses(prev);
      throw err;
    }
  }, [addresses]);

  const deleteAddress = useCallback(async (id: string) => {
    const prev = addresses;
    setAddresses(prev.filter(a => a.id !== id)); // optimistic removal
    try {
      await axiosInstance.delete(`/address/${id}`);
    } catch (err) {
      console.error('deleteAddress failed', err);
      setAddresses(prev); // revert on failure
      throw err;
    }
  }, [addresses]);

  const upsertAddress = useCallback((addr: TAddress) => {
    setAddresses(prev => {
      const exists = prev.find(p => p.id === addr.id);
      if (exists) {
        return prev.map(p => (p.id === addr.id ? addr : p));
      }
      return [...prev, addr];
    });
  }, []);

  const defaultAddress = addresses.find(a => a.isDefault);
  const nonDefaultAddresses = addresses.filter(a => !a.isDefault);

  return {
    addresses,
    defaultAddress,
    nonDefaultAddresses,
    loading,
    refreshing,
    fetchAddresses,
    markDefault,
    deleteAddress,
    upsertAddress,
  };
}
