import { useEffect, useRef, useState } from "react"
import { useWindowSize } from "react-use"
import Confetti from "react-confetti"

export const PointConfetti = (props) => {
  const { width, height } = useWindowSize()
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const ref = useRef()

  useEffect(() => {
    const rect = ref.current.parentNode.getBoundingClientRect()
    setPos({
      x: rect.width / 2 + 30,
      y: rect.height / 2 + 100,
    })
  }, [])

  return (
    <Confetti
      ref={ref}
      width={width}
      height={height}
      confettiSource={{
        w: 10,
        h: 10,
        ...pos,
      }}
      {...props}
    />
  )
}
