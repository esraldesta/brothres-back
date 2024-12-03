import { SetMetadata } from '@nestjs/common';

export const TRACK_KEY_METADATA = 'trackKey';

export interface TrackKey {
  base: string;
  param?: string;
}

export function TrackKey(value: string, param?: string) {
  return SetMetadata(TRACK_KEY_METADATA, { base: value, param }); // Set the 'track_key' metadata
}
