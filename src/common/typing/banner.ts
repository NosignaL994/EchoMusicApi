import { DataType } from "./common";

export interface Banner {
  type: DataType;
  id: string;
  picUrl: string;
}

export type Banners = Array<Banner>;
