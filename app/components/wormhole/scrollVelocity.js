/**
 * Shared scroll-velocity tracker for the wormhole journey.
 *
 * Written every frame by JourneyCameraRig, read every frame by SmokeVeil.
 * 0 = camera still, ~1 = fast scroll. Kept as a mutable module-level ref so
 * neither component re-renders — both just read/write `.current` in useFrame.
 */
export const scrollVelocity = { current: 0 };
