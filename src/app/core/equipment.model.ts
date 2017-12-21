export interface Equipment {
  stockNumber: string;
  name: string;
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
  img: string;
}

export interface EquipmentId extends Equipment {
  id: string;
}
