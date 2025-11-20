import axiosInstance from "../../../../config/Api";
import { updateOrderStatus } from "../../../../reduxSlices/orderSlice"; // adjust path if needed

export type OrderSimulationStage =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'NEAR_DELIVERY'
  | 'DELIVERED';

export interface SimulationConfig {
  orderId: string;
  routeCoordinates?: Array<{ latitude: number; longitude: number }>;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  storeLocations: Array<{
    lat: number;
    lng: number;
    name: string;
    storeGroupId: string | number;
  }>;
  dispatch?: any; 
  onStageChange?: (stage: OrderSimulationStage) => void;
  onPathAnimationStart?: () => void; 
  onPathAnimationStop?: () => void;  
  onEtaUpdate?: (minutes: number) => void;
}

const STAGE_DURATIONS = {
  PENDING: 2000,
  CONFIRMED: 3000,
  PACKED: 3000,
  PICKED_UP: 2000,
  IN_TRANSIT: 1000, 
  NEAR_DELIVERY: 1000,
  DELIVERED: 1000,
};

const STAGE_BACKEND_MAP: Record<OrderSimulationStage, string> = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PACKED: 'PACKED',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'SHIPPED',
  NEAR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
};

export class OrderSimulationService {
  private currentStage: OrderSimulationStage = 'PENDING';
  private simulationActive = false;
  private stageTimers: NodeJS.Timeout[] = [];

  constructor(private config: SimulationConfig) {}

  async startSimulation(): Promise<void> {
    if (this.simulationActive) {
      console.log('[SIM] Already running');
      return;
    }

    this.simulationActive = true;
    console.log('[SIM] Starting simulation for order:', this.config.orderId);

    const stages: OrderSimulationStage[] = [
      'PENDING',
      'CONFIRMED',
      'PACKED',
      'PICKED_UP',
      'IN_TRANSIT',
      'NEAR_DELIVERY',
      'DELIVERED',
    ];

    let cumulativeDelay = 0;

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      const duration = STAGE_DURATIONS[stage];

      const timer = setTimeout(async () => {
        if (!this.simulationActive) {
          console.log('[SIM] Cancelled at stage:', stage);
          return;
        }

        console.log(`[SIM] Stage ${i + 1}/${stages.length}: ${stage}`);
        await this.updateStage(stage);

        if (i === stages.length - 1) {
          console.log('[SIM] Complete!');
        }
      }, cumulativeDelay);

      this.stageTimers.push(timer);
      cumulativeDelay += duration;
    }
  }

  private async updateStage(stage: OrderSimulationStage): Promise<void> {
    this.currentStage = stage;

    if (stage === 'IN_TRANSIT') {
      console.log('[SIM] Triggering path animation');
      this.config.onPathAnimationStart?.();
    } else if (stage === 'NEAR_DELIVERY' || stage === 'DELIVERED') {
      console.log('[SIM] Stopping path animation');
      this.config.onPathAnimationStop?.();
    }

    this.config.onStageChange?.(stage);

    const etaMap: Record<OrderSimulationStage, number> = {
      PENDING: 15,
      CONFIRMED: 12,
      PACKED: 10,
      PICKED_UP: 8,
      IN_TRANSIT: 5,
      NEAR_DELIVERY: 1,
      DELIVERED: 0,
    };
    this.config.onEtaUpdate?.(etaMap[stage]);

    try {
      const backendStatus = STAGE_BACKEND_MAP[stage];

      if (this.config.dispatch) {
        await this.config.dispatch(
          updateOrderStatus({
            orderId: this.config.orderId,
            orderStatus: backendStatus,
            updatedAt: new Date().toISOString(),
          })
        );
        console.log('[SIM] Dispatched updateOrderStatus via redux:', backendStatus);
      } else {
        await axiosInstance.patch(`/orders/${this.config.orderId}`, {
          orderStatus: backendStatus,
          updatedAt: new Date().toISOString(),
        });
        console.log('[SIM] Direct patch success:', backendStatus);
      }
    } catch (err: any) {
      console.warn('[SIM] Backend sync failed:', err?.message ?? err);
    }
  }

  stopSimulation(): void {
    console.log('[SIM] Stopping');
    this.simulationActive = false;
    this.stageTimers.forEach((timer) => clearTimeout(timer));
    this.stageTimers = [];
    this.config.onPathAnimationStop?.();
  }

  getCurrentStage(): OrderSimulationStage {
    return this.currentStage;
  }

  isRunning(): boolean {
    return this.simulationActive;
  }
}
