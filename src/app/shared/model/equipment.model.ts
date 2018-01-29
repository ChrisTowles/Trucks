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
  driveType: string;
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
}
