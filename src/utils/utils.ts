export type Player = 'X' | 'O'
export type Tile = Player | null
export type Winner = Player | null | 'draw'
export type Board = Tile[]

export const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export const getWinner = (board: Board): Winner => {
  for (const [a, b, c] of winningCombos) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  if (board.every((tile) => tile !== null)) {
    return 'draw'
  }
  return null
}

export const getEmptyBoard = (): Board => Array(9).fill(null)

export const cn = (
  ...classes: (string | undefined | Record<string, boolean>)[]
): string =>
  classes
    .map((cls) => {
      if (typeof cls === 'string') return cls
      if (cls)
        return Object.entries(cls)
          .filter(([, value]) => value)
          .map(([key]) => key)
      return undefined
    })
    .flat(2)
    .filter(Boolean)
    .join(' ')
