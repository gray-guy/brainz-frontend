export const PriceAdjuster = ({ value, onChange, currency = "ETH" }) => {
  const updatePrice = (operation) => {
    const increment = 1
    let priceNumber = value
    if (operation === "increment") {
      priceNumber = priceNumber + increment
    } else if (operation === "decrement") {
      priceNumber = Math.max(0, priceNumber - increment)
    }
    onChange(priceNumber)
  }

  return (
    <div className="flex w-full items-center justify-between gap-4 rounded-3xl border border-primary-250 bg-primary px-[10px] py-3.5 md:w-64 lg:px-6">
      <div className="flex-2.5 flex">
        <button
          type="button"
          onClick={() => updatePrice("decrement")}
          className="font-basement text-base font-bold text-white hover:text-secondary lg:text-lg"
        >
          -
        </button>
        <input
          className="mx-4 w-full appearance-none overflow-hidden border-secondary bg-[transparent] font-basement text-base font-bold text-grey-650 text-white outline-none focus:outline-none lg:text-lg"
          type="number"
          placeholder="121"
          value={value}
          onChange={(e) => {
            const newPrice =
              e.target.value === "" ? 0 : parseFloat(e.target.value)
            if (!isNaN(newPrice)) onChange(newPrice)
          }}
        />
      </div>
      <div className="relative flex flex-1 items-center justify-end gap-3">
        {/* <input
          className="hidden lg:block appearance-none font-basement font-bold text-base lg:text-lg  text-grey-650 bg-[transparent] outline-none focus:outline-none text-white"
          type="number"
          placeholder="121"
          value={price}
          onChange={(e) => {
            const newPrice =
              e.target.value === "" ? 0 : parseFloat(e.target.value);
            if (!isNaN(newPrice)) setPrice(newPrice);
          }}
          style={{
            minWidth: "50px",
            width: `${(price.toString().length + 1) * 10}px`,
          }}
        /> */}
        <h1 className="font-basement text-base font-bold text-secondary lg:text-lg">
          {currency}
        </h1>
        <button
          type="button"
          onClick={() => updatePrice("increment")}
          className="font-basement text-base font-bold text-white hover:text-secondary lg:text-lg"
        >
          +
        </button>
      </div>
    </div>
  )
}
