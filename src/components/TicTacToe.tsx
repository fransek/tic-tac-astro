import { For, Show, createSignal } from 'solid-js'
import { getAIMove } from '../utils/ai'
import {
  cn,
  getEmptyBoard,
  getWinner,
  type Board,
  type Tile,
  type Winner,
} from '../utils/utils'

export default function Home() {
  const [board, setBoard] = createSignal<Board>(getEmptyBoard())
  const [isPlayersTurn, setIsPlayersTurn] = createSignal(true)
  const [winner, setWinner] = createSignal<Winner>(null)

  const makeMove = async (tile: Tile, index: number) => {
    if (tile === null && isPlayersTurn()) {
      setIsPlayersTurn(false)
      const newBoard = [...board()]
      newBoard[index] = 'X'
      setBoard(newBoard)
      if (checkWinner(newBoard)) {
        return
      }
      const newerBoard = await getAIMove(newBoard)
      setBoard(newerBoard)
      if (checkWinner(newerBoard)) {
        return
      }
      setIsPlayersTurn(true)
    }
  }

  const checkWinner = (board: Board) => {
    const winner = getWinner(board)
    console.log(winner)
    if (winner) {
      setWinner(winner)
      return true
    }
    return false
  }

  const restart = () => {
    setBoard(getEmptyBoard())
    setWinner(null)
    setIsPlayersTurn(true)
  }

  return (
    <main class='flex items-center flex-col gap-4 pt-40'>
      <div class='grid grid-cols-3 gap-2 w-fit'>
        <For each={board()}>
          {(tile, index) => (
            <div
              class={cn(
                'bg-gray-200 w-20 h-20 flex justify-center items-center text-5xl font-bold rounded',
                tile === null && isPlayersTurn()
                  ? 'cursor-pointer'
                  : 'cursor-default',
                {
                  'text-red-600': tile === 'X',
                  'text-blue-600': tile === 'O',
                }
              )}
              onClick={() => makeMove(tile, index())}
            >
              {tile}
            </div>
          )}
        </For>
      </div>
      <Show when={winner()}>
        <p class='text-2xl font-bold'>
          {winner() === 'draw' ? 'Draw!' : `${winner()} wins!`}
        </p>
        <button
          onClick={restart}
          class='text-xl rounded-lg bg-blue-600 py-2 px-4'
        >
          Play again
        </button>
      </Show>
    </main>
  )
}
