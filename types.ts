import { Video } from '@google/genai';

export enum ServerStatus {
  ONLINE = 'ONLINE',
  HACKING = 'HACKING',
  COMPROMISED = 'COMPROMISED',
  LOCKED = 'LOCKED'
}

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'NIGHTMARE';

export type ServerDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'PRO';

export interface ServerNode {
  id: string;
  name: string;
  ip: string;
  location: string;
  difficulty: ServerDifficulty;
  status: ServerStatus;
  x: number; // Keep for internal logic if needed, though map is removed
  y: number;
  isSuppressed: boolean;
}

export interface GameState {
  difficulty: DifficultyLevel | null;
  detectionLevel: number;
  hackedCount: number;
  totalServers: number;
  isGameOver: boolean;
  isWarningAccepted: boolean;
  isTutorialCompleted: boolean;
}

// Added for Veo Video Generation Support
export enum AspectRatio {
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
}

export enum Resolution {
  P720 = '720p',
  P1080 = '1080p',
}

export enum VeoModel {
  VEO = 'veo-3.1-generate-preview',
  VEO_FAST = 'veo-3.1-fast-generate-preview',
}

export enum GenerationMode {
  TEXT_TO_VIDEO = 'Text to Video',
  FRAMES_TO_VIDEO = 'Frames to Video',
  REFERENCES_TO_VIDEO = 'References to Video',
  EXTEND_VIDEO = 'Extend Video',
}

export interface ImageFile {
  file: File;
  base64: string;
}

export interface VideoFile {
  file: File;
  base64: string;
}

export interface GenerateVideoParams {
  prompt: string;
  model: VeoModel;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  mode: GenerationMode;
  startFrame: ImageFile | null;
  endFrame: ImageFile | null;
  referenceImages: ImageFile[];
  styleImage: ImageFile | null;
  inputVideo: VideoFile | null;
  inputVideoObject: Video | null;
  isLooping: boolean;
}
