import { actions } from 'astro:actions'
import { For, Show, createSignal } from 'solid-js'
import {
  cn,
  getEmptyBoard,
  getWinner,
  type Board,
  type Tile,
  type Winner,
} from '../utils/common'

export default function Home() {
  const [board, setBoard] = createSignal<Board>(getEmptyBoard())
  const [isPlayersTurn, setIsPlayersTurn] = createSignal(true)
  const [winner, setWinner] = createSignal<Winner>('')

  const makeMove = async (tile: Tile, index: number) => {
    if (tile !== '' || !isPlayersTurn()) {
      return
    }
    setIsPlayersTurn(false)
    const newBoard = [...board()]
    newBoard[index] = 'X'
    setBoard(newBoard)
    if (checkWinner(newBoard)) {
      return
    }
    const newerBoard = await makeAIMove(newBoard)
    if (checkWinner(newerBoard)) {
      return
    }
    setIsPlayersTurn(true)
  }

  const makeAIMove = async (board: Board): Promise<Board> => {
    const res = await actions.ai({ board })
    const newBoard = [...board]
    newBoard[res.index] = 'O'
    setBoard(newBoard)
    return newBoard
  }

  const checkWinner = (board: Board) => {
    const winner = getWinner(board)
    if (winner) {
      setWinner(winner)
      return true
    }
    return false
  }

  const restart = () => {
    setBoard(getEmptyBoard())
    setWinner('')
    setIsPlayersTurn(true)
  }

  return (
    <div>
      <div class='grid grid-cols-3 gap-2 w-fit'>
        <For each={board()}>
          {(tile, index) => (
            <div
              class={cn(
                'bg-gray-200 w-20 h-20 flex justify-center items-center text-5xl font-bold rounded',
                tile === '' && isPlayersTurn()
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
    </div>
  )
}
