import SessionImage from "@/public/images/football-kick.png"
export const cryptoCardData = [
  {
    id: 1,
    title: "Title of the Game",
    subTitle: ["Session 1", "Session 2", "Session 3"],
    bgColor: "bg-primary-100",
    shadow: "shadow-cryptoCardOne",
    timePeriod: [
      {
        month: "June",
        date: 5,
        time: "7pm UTC",
      },
    ],
  },
  {
    id: 2,
    title: "Title of the Game",
    subTitle: ["Session 1", "Session 2", "Session 3"],
    bgColor: "bg-danger-200",
    shadow: "shadow-cryptoCardTwo",
    timePeriod: [
      {
        month: "July",
        date: 10,
        time: "7pm UTC",
      },
    ],
  },
  {
    id: 3,
    title: "Title of the Game",
    subTitle: ["Session 1", "Session 2", "Session 3"],
    bgColor: "bg-info",
    shadow: "shadow-cryptoCardThree",
    timePeriod: [
      {
        month: "August",
        date: 20,
        time: "7pm UTC",
      },
    ],
  },
]
export const sessionCardData = {
  title: "Game Title",
  gamesCategories: ["Crypto", "Sports", "Science"],
  gameImage: SessionImage,
}
