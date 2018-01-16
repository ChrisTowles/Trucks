export interface Equipment {

  stockNumber: string;
  name: string;
  year: string;
  engineMake: string;
  engineModel: string;
  engineHP: number;
  transmission: string;
  suspension: string;
  rearEndRatio: string;
  gvwr: number;
  bedDimensions: string;
  wheelBase: number;
  odometer: number;
  price: number;
  comments: string;
  img_public_id: string;

  // Internal
  order: number;
  status: EquipmentStatus;
}

export interface EquipmentId extends Equipment {
  id: string;
}

export enum EquipmentStatus {
  Hidden = 0,
  Visible = 1,
  Sale = 2,
}
