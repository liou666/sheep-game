import cs from 'classnames'
import { uuid } from '@/utils'

enum CardStatus{
  selected = 0,
  notSelected = 1
}
interface Card{
  id: string
  icon: string
  x: number
  y: number
  // 控制遮罩层
  isOcclusion: boolean
  // 是否在卡槽中 0否 1是
  status: CardStatus
  // 是否清除
  clear: boolean
  // 隐藏
  display: boolean
}

let selectedNo = 0

const IndexPage = () => {
  const cardSize = 40
  const row = 7
  const col = 7
  const defaultIcons = ['⚙️', '🦄', '😅', '📕', '🎁', '📺']
  const defaultRounds = ['3', '6', '9', '2', '8']
  const defaultOffsetValue = [7, -7, 20, -20, 25, -25, 33, -33, 40, -40]
  const defaultOffsetValueLength = defaultOffsetValue.length
  const icons = defaultIcons.slice(0, 2)
  const maxCardsNo = 7
  const slotPadding = 20

  const [cards, setCards] = useState<Card[]>([])
  const [, forceRerender] = useReducer(x => x + 1, 0)

  // let selectedNo = useRef(0).current
  const cardEl = useRef<HTMLDivElement | null>(null)
  const slotEl = useRef<HTMLDivElement | null>(null)

  const genCard = (icon: string): Card => {
    const offset = defaultOffsetValue[Math.floor(defaultOffsetValueLength * Math.random())]
    const r = Math.floor(Math.random() * row)
    const c = Math.floor(Math.random() * col)
    const x = c * cardSize + offset
    const y = r * cardSize + offset
    return {
      id: uuid(6),
      icon,
      x,
      y,
      isOcclusion: false,
      status: 0,
      clear: false,
      display: false,
    }
  }
  const refreshSlot = (card: Card) => {
    const a = cardEl.current
    const b = slotEl.current
    const { x: x1, y: y1 } = b!.getClientRects()[0]
    const { y: y2, top } = a!.getClientRects()[0]
    console.log('y1,y2', y1, y2, top)
    const newY = y1 - y2 + slotPadding
    const newX = x1 + selectedNo * cardSize
    console.log(newX, newY)
    card.status = 1
    card.x = newX
    card.y = newY

    selectedNo++
  }

  const checkShading = () => {
    for (let i = 0; i < cards.length; i++) {
      const cur = cards[i]
      cur.isOcclusion = false
      if (cur.status !== 0 || cur.display) continue
      const { x: x1, y: y1 } = cur
      const x2 = x1 + cardSize
      const y2 = y1 + cardSize
      for (let j = i + 1; j < cards.length; j++) {
        const compare = cards[j]
        if (compare.status !== 0 || compare.display) continue
        const { x, y } = compare
        if (!(y + cardSize <= y1 || y >= y2 || x + cardSize <= x1 || x >= x2)) {
          cur.isOcclusion = true
          break
        }
      }
    }
    forceRerender()
  }

  const clickCards = (card: Card) => {
    if (card.status === 1 || card.isOcclusion) return
    if (selectedNo < maxCardsNo)
      refreshSlot(card)
    checkShading()
  }

  const init = () => {
    for (const icon of icons) {
      const round = +defaultRounds[Math.floor(Math.random() * defaultRounds.length)]
      for (let i = 0; i < round; i++)
        setCards(c => [...c, genCard(icon)])
    }
  }

  useEffect(() => {
    checkShading()
  }, [cards])

  useMount(init)

  return (
    <div>
      <div
        ref={cardEl}
        m='a' border='1'
        box='content'
        relative=''
        style={{ width: `${cardSize * row}px`, height: `${cardSize * col}px`, padding: `${cardSize}px` }}
      >
        {cards.map((card, i) => {
          return (
            <div
              box='border'
              border='1 black'
              transition='all'
              duration='300'
              style={{
                width: `${cardSize}px`,
                height: `${cardSize}px`,
                transform: `translate(${card.x}px, ${card.y}px)`,
                background: '',
              }}
              onClick={() => {
                clickCards(card)
              }}
              className={cs(card.isOcclusion ? 'bg-gray-500' : 'bg-orange')}
              key={i}
              cursor='pointer'
              absolute=''
              flex='center ~'
            >
              {card.icon}
            </div>
          )
        })}
      </div>
      <footer
        ref={slotEl}
        style={{
          width: `${maxCardsNo * cardSize}px`,
          padding: `${slotPadding}px`,
        }}
        text='left'
        m='t-10 x-a'
        border='~ rounded'
      >
        2
      </footer>
    </div>
  )
}

export default IndexPage
