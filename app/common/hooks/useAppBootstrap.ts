import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { getStateFromPath } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../Store';
import { getItemFromAsyncStorage } from '../utils/asyncStorage/AsyncStorageUtils';
import { getUserDetails } from '../../auth/authServices/AuthServices';
import { updateUserDetails } from '../../../reduxSlices/UserSlice';


export default function useAppBootstrap(linkingConfig: any) {
  const dispatch = useDispatch<AppDispatch>();
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [initialNavState, setInitialNavState] = useState<any | undefined>(undefined);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const url = await Linking.getInitialURL();
      const accessToken = (await getItemFromAsyncStorage('accessToken')) || '';
      if (accessToken) {
        try {
          const resp = await getUserDetails(accessToken);
          if (mounted) {
            dispatch(updateUserDetails({ isLoggedIn: true, accessToken, userDetails: resp.data }));
          }
        } catch {}
      }
      if (url) {
        const path = url.replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//, '').replace(/^[^/]*\//, '/');
        let state;
        try {
          state = getStateFromPath(path, linkingConfig.config);
        } catch {
          state = undefined;
        }
        if (state && accessToken) {
          setInitialNavState(state);
        } else {
          setPendingUrl(url);
        }
      }
      if (mounted) setIsBootstrapping(false);
    })();
    return () => { mounted = false; };
  }, [dispatch, linkingConfig]);

  return { isBootstrapping, initialNavState, pendingUrl, setPendingUrl };
}
