export const ProgressBar = ({ progress, step, rounded }) => {
  const headPosition = `${progress}%`
  const borderRounded = rounded && `rounded-tl-lg rounded-bl-lg`

  return (
    <div className="relative h-[5px] w-full">
      <div
        className={`relative left-0 top-0 h-full bg-gradient-to-r from-secondary to-secondary-100 shadow-progressBar ${borderRounded}`}
        style={{ width: `${progress}%` }}
      ></div>
      <div
        className="absolute flex h-[15px] w-[18px] justify-center rounded-[40px] bg-secondary-100 font-inter text-xs font-extrabold"
        // style={{ left: headPosition }}
        style={{
          left: `calc(${headPosition} - 7.5px)`,
          top: "-4.5px",
        }}
      >
        {step}
      </div>
    </div>
  )
}
