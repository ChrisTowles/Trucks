export interface EquipmentImage {
  public_id: string;
  order: number;
  url: string;
  height: number;
  width: number;
  bytes: number;
}

export interface EquipmentImageId extends EquipmentImage {
  id: string;
}
