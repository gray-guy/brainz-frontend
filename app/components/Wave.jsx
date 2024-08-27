"use client"
import { useEffect, useRef } from "react"
import * as THREE from "three"

function WaveAnimation({ height = 320 }) {
  const mountRef = useRef(null)

  useEffect(() => {
    if (mountRef.current) {
      const SEPARATION = 60,
        AMOUNTX = 200,
        AMOUNTY = 200
      let count = 0

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        -20,
        window.innerWidth / height,
        1,
        10000
      )
      camera.position.z = 1000
      camera.position.y = -200 // Adjust for downward tilt
      camera.lookAt(0, 0, 0) // Center view

      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, height)
      renderer.setClearColor(new THREE.Color(0x011828)) // Adjust the background color
      mountRef.current.appendChild(renderer.domElement)

      const numParticles = AMOUNTX * AMOUNTY
      const positions = new Float32Array(numParticles * 3)
      const scales = new Float32Array(numParticles)

      let i = 0,
        j = 0
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2
          positions[i + 1] = 0
          positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
          scales[j] = 1
          i += 3
          j++
        }
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1))

      const numGlowPoints = 5 // Number of points to glow
      const glowIntensity = new Float32Array(numParticles) // Array to control glow intensity

      // Randomly select 5 points for glowing
      const glowIndices = []
      for (let i = 0; i < numGlowPoints; i++) {
        let index = Math.floor(Math.random() * numParticles)
        while (glowIndices.includes(index)) {
          index = Math.floor(Math.random() * numParticles)
        }
        glowIndices.push(index)
      }

      for (let k = 0; k < numParticles; k++) {
        glowIntensity[k] = glowIndices.includes(k) ? 1.0 : 0.0
      }

      geometry.setAttribute(
        "glowIntensity",
        new THREE.BufferAttribute(glowIntensity, 1)
      )
      const vertexShader = `
    attribute float scale;
    attribute float glow;
    attribute float glowIntensity;
    varying float vGlow;
    varying float vGlowIntensity;

    void main() {
        vGlow = glow;
        vGlowIntensity = glowIntensity;

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

        // Adjust dot size here (e.g., scale * 0.5 for smaller dots)
        gl_PointSize = scale * (140.0 / -mvPosition.z); // Adjust dot size
        gl_Position = projectionMatrix * mvPosition;
    }
    `

      const fragmentShader = `
    uniform vec3 color;
    varying float vGlowIntensity; // Receive glow intensity from vertex shader

    void main() {
        float distanceToCenter = length(gl_PointCoord - vec2(0.5, 0.5));
        float radius = 0.5;

        if (vGlowIntensity > 0.0) {
            // Smooth glow effect based on glow intensity
            float glowIntensity = smoothstep(radius, radius - 0.1, distanceToCenter) * vGlowIntensity;
            vec3 glowColor = mix(vec3(0.1, 0.5, 1.0), color, glowIntensity); // Adjust the glow color

            gl_FragColor = vec4(glowColor, 1.0 - glowIntensity);
        } else {
            if (distanceToCenter > radius) discard;
            gl_FragColor = vec4(color, 1.0);
        }
    }
`

      const material = new THREE.ShaderMaterial({
        uniforms: { color: { value: new THREE.Color(0x69b7cf) } }, // Adjust color to match pattern
        vertexShader,
        fragmentShader,
      })

      const particles = new THREE.Points(geometry, material)
      scene.add(particles)

      function animate() {
        requestAnimationFrame(animate)

        const positions = particles.geometry.attributes.position.array
        const scales = particles.geometry.attributes.scale.array
        let i = 0,
          j = 0

        for (let ix = 0; ix < AMOUNTX; ix++) {
          for (let iy = 0; iy < AMOUNTY; iy++) {
            positions[i + 1] =
              Math.sin((ix + count) * 0.3) * 50 +
              Math.sin((iy + count) * 0.5) * 50
            scales[j] =
              (Math.sin((ix + count) * 0.3) + 1) * 20 +
              (Math.sin((iy + count) * 0.5) + 1) * 20
            i += 3
            j++
          }
        }

        particles.geometry.attributes.position.needsUpdate = true
        particles.geometry.attributes.scale.needsUpdate = true

        renderer.render(scene, camera)

        count += 0.1
      }

      animate()

      // Resize listener
      function handleResize() {
        const aspect = window.innerWidth / height
        camera.aspect = aspect
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, height)
      }
      window.addEventListener("resize", handleResize)

      // Cleanup on unmount
      return () => {
        renderer.dispose()
        mountRef.current && mountRef.current.removeChild(renderer.domElement)
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  return (
    <div
      className="from-blue-900 via-blue-800 to-blue-700 bg-gradient-to-r"
      ref={mountRef}
      style={{ width: "100%", maxHeight: `${height}` }}
    />
  )
}

export default WaveAnimation
