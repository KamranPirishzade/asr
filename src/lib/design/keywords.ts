export type UIStyle = 'minimal' | 'classic' | 'modern';
export type UIDensity = 'compact' | 'normal' | 'spacious';
export type UIContrast = 'low' | 'normal' | 'high';
export type UIShape = 'rounded' | 'square';

export interface UIKeywords {
  style: UIStyle;
  density: UIDensity;
  contrast: UIContrast;
  shape: UIShape;
}

export const defaultKeywords: UIKeywords = {
  style: 'modern',
  density: 'normal',
  contrast: 'normal',
  shape: 'rounded',
};
