export interface Equipment {

  stockNumber: string;
  name: string;
  category: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  series: string;
  fuelType: string;
  engineManufacturer: string;
  engineModel: string;
  engineHP: number;
  engineCylinders: number;
  engineLiters: number;
  transmission: string;
  transmissionManufacturer: string;
  driveType: string;
  numberRearAxles: number;
  suspension: string;
  rearEndRatio: string;
  brakeType: string;
  gvwr: number;
  gvwrClass: number;
  bedDimensions: string;
  wheelBase: number;
  odometer: number;
  price: number;
  comments: string;
  frontTireSize: string;
  rearTireSize: string;
  img_public_id: string;
  video_url: string;

  // Internal
  order: number;
  status: EquipmentStatus;

  // Posting
  commercialTruckTrader: boolean;
}

export interface EquipmentId extends Equipment {
  id: string;
}


export enum EquipmentStatus {
  Hidden = 0,
  Visible = 1,
  Archived = 2
}
