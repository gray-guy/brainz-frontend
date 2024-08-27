import { confetti } from "@tsparticles/confetti"
import { useEffect } from "react"

// export const ConfettiBackground = () => {
//   useEffect(() => {
//     const startConfetti = () => {
//       const end = Date.now() + 5 * 1000;

//       const frame = () => {
//         if (Date.now() < end) {
//           requestAnimationFrame(frame);
//         }

//       };

//       frame();

//       confetti({
//         particleCount: 1500,
//         angle: 110,
//         spread: 15,
//         origin: { x: 1 },
//       });
//       confetti({
//         particleCount: 800,
//         angle: 120,
//         spread: 45,
//         origin: { x: 0 },
//       });
//     };

//     const timeoutId = setTimeout(startConfetti, 400);

//     return () => clearTimeout(timeoutId);
//   }, []);

//   return <div></div>;
// };

export const ConfettiBackground = () => {
  useEffect(() => {
    const startConfetti = () => {
      const confettiSettingsLeft = {
        particleCount: 450,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.5 },
        scalar: 1.2,
        // decay: 0.9,
      }

      const confettiSettingsRight = {
        particleCount: 450,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.5 },
        scalar: 1.2,
        // decay: 0.9,
      }
      confetti(confettiSettingsLeft)
      confetti(confettiSettingsRight)
    }

    const timeoutId = setTimeout(startConfetti, 70)

    return () => clearTimeout(timeoutId)
  }, [])

  return <div></div>
}
