export const VISUALIZER_CONFIG = {
  // Global Scale
  baseScale: 1.9,

  // Plate Dimensions
  maxPlateHeight: 280, // Reference height for largest plates (450mm)

  // Spacing (in pixels)
  plateGap: 4, // Horizontal space between plates
  innerSpacer: 3, // Space between shoulder and first plate

  // Bar Dimensions (in pixels)
  bar: {
    shaftWidth: 160, // Length of the visible handle part
    shaftHeight: 22, // Thickness of the handle
    shoulderWidth: 32, // Width of the inner stop
    shoulderHeight: 90, // Height of the inner stop
    sleeveHeight: 22, // Thickness of the sleeve (where plates go)
    collarWidth: 44, // Width of the collar
    collarHeight: 112, // Height of the collar body
  },

  // Thickness (Width in pixels) for each weight
  thickness: {
    25: 84,
    20: 70,
    15: 58,
    10: 48,
    5: 40,
    2.5: 34,
    2: 28,
    1.5: 25,
    1: 21,
    0.5: 17,
  } as Record<number, number>,

  // Diameter Scale (Relative to maxPlateHeight 1.0)
  diameter: {
    // Standard Large
    '25': 1.0,
    '20': 1.0,
    '15': 1.0,
    '10': 1.0,
    // Training Large
    '5-training': 1.0,
    '2.5-training': 1.0,
    // Small / Change
    '5': 0.6,
    '2.5': 0.5,
    '2': 0.45,
    '1.5': 0.4,
    '1': 0.35,
    '0.5': 0.3,
  } as Record<string, number>,
};
