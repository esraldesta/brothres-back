export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export interface Founders {
  id: number;
  country: string;
  firstName: string;
  createdAt: Date;
}

export interface Refered extends Founders {}
