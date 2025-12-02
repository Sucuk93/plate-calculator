import { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';

const CHANNEL_NAME = 'iwf-plate-calculator-sync';

type SyncMessage = {
  type: 'UPDATE';
  weight: number;
  barType: 'MEN' | 'WOMEN';
};

export function usePlateSync(
  initialWeight: number, 
  initialBarType: 'MEN' | 'WOMEN',
  isReceiver: boolean = false
) {
  const [weight, setWeight] = useState(initialWeight);
  const [barType, setBarType] = useState(initialBarType);

  // Broadcast changes (Sender)
  const broadcastUpdate = useCallback((newWeight: number, newBarType: 'MEN' | 'WOMEN') => {
    if (Platform.OS === 'web' && !isReceiver && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage({ type: 'UPDATE', weight: newWeight, barType: newBarType });
      channel.close();
    }
  }, [isReceiver]);

  // Listen for changes (Receiver)
  useEffect(() => {
    if (Platform.OS === 'web' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      
      channel.onmessage = (event) => {
        const data = event.data as SyncMessage;
        if (data.type === 'UPDATE') {
          setWeight(data.weight);
          setBarType(data.barType);
        }
      };

      return () => {
        channel.close();
      };
    }
  }, []);

  // Wrapper for local state updates that also broadcasts
  const updateState = (newWeight: number, newBarType: 'MEN' | 'WOMEN') => {
    setWeight(newWeight);
    setBarType(newBarType);
    broadcastUpdate(newWeight, newBarType);
  };

  return {
    weight,
    barType,
    setWeight: (w: number) => updateState(w, barType),
    setBarType: (t: 'MEN' | 'WOMEN') => updateState(weight, t),
    updateState
  };
}
