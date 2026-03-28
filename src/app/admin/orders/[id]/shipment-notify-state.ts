export type ShipmentNotifyState = {
  message: string | null;
  variant: "success" | "error" | null;
};

export const initialShipmentNotifyState: ShipmentNotifyState = {
  message: null,
  variant: null,
};
