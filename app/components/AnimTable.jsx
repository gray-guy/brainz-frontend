import React, { useEffect, useState } from "react"

function AnimTable() {
  const [users, setUsers] = useState([
    { id: 1, name: "User 1" },
    { id: 2, name: "User 2" },
    { id: 3, name: "User 3" },
    { id: 4, name: "User 4" },
    { id: 5, name: "User 5" },
    { id: 6, name: "User 6" },
    { id: 7, name: "User 7" },
    { id: 8, name: "User 8" },
    { id: 9, name: "User 9" },
    { id: 10, name: "User 10" },
  ])
  const [currentUserIndex, setCurrentUserIndex] = useState(9) // Initial index is 9 (User 10)

  // Function to move the current user up or down the list
  const moveUser = (direction) => {
    setCurrentUserIndex((prevIndex) => {
      let newIndex = prevIndex + direction
      // Ensure newIndex stays within the bounds of the user list
      newIndex = Math.max(0, Math.min(newIndex, users.length - 1))
      return newIndex
    })
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      moveUser(-1) // Move the user up automatically
    }, 1000) // Interval of 4 seconds

    return () => {
      clearInterval(intervalId) // Cleanup function to clear the interval
    }
  }, [moveUser])

  return (
    <div className="App">
      <h1>User Table</h1>
      <button onClick={() => moveUser(-1)}>Move Up</button>
      <button onClick={() => moveUser(1)}>Move Down</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              className={index === currentUserIndex ? "current-user" : ""}
            >
              <td>{user.id}</td>
              <td>{user.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AnimTable
