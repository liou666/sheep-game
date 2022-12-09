import cs from 'classnames'
import { sleep, uuid } from '@/utils'

enum CardStatus{
  selected = 0,
  notSelected = 1
}
interface Card{
  id: string
  icon: string
  x: number
  y: number
  isOcclusion: boolean
  status: CardStatus
  // 隐藏
  hide: boolean
}

let selectedNo = 0

const IndexPage = () => {
  const cardSize = 40
  const row = 7
  const col = 7
  const defaultIcons = ['🦄', '😅', '📕', '🎁', '📺']
  const defaultRounds = ['3', '6', '9', '12']
  const defaultOffsetValue = [7, -7, 20, -20, 25, -25, 33, -33, 40, -40]
  const defaultOffsetValueLength = defaultOffsetValue.length
  const icons = defaultIcons.slice(0)
  const maxCardsNo = 7
  const maxCardsClear = 3
  const slotPadding = 20
  const animationDuration = 300
  const [cards, setCards] = useState<Card[]>([])
  const [, forceRerender] = useReducer(x => x + 1, 0)

  const selectedCards = useRef<Map<string, Card[]>>(new Map()).current
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
      hide: false,
    }
  }
  const handleSlotQueue = async (c: Card[]) => {
    if (c.length === maxCardsClear) {
      await sleep(animationDuration)
      selectedCards.delete(c[0].icon)
      c.forEach(x => x.hide = true)
      selectedNo -= maxCardsClear
      forceRerender()
      refreshSlot()
    }
  }
  function reset() {
    selectedNo = 0
    selectedCards.clear()
    setCards([])
    init()
  }
  function refreshSlot(item?: Card) {
    const { x: x1, y: y1 } = slotEl.current!.getClientRects()[0]
    const { x: x2, y: y2 } = cardEl.current!.getClientRects()[0]

    if (item) {
      const c = selectedCards.get(item.icon)
      if (c) {
        c.push(item)
        handleSlotQueue(c)
      }
      else {
        selectedCards.set(item.icon, [item])
      }
    }
    let index = 0
    selectedCards.forEach((v) => {
      v.forEach((c) => {
        const newY = y1 - y2 - cardSize + slotPadding / 2
        const newX = x1 - x2 + index * cardSize - cardSize + slotPadding / 2
        c.x = newX
        c.y = newY
        index++
        c.status = 1
      })
    })

    // Game Over
    setTimeout(() => {
      if (selectedNo === maxCardsNo) {
        alert('Game Over')

        reset()
      }
    }, animationDuration)
  }

  const checkShading = () => {
    for (let i = 0; i < cards.length; i++) {
      const cur = cards[i]
      cur.isOcclusion = false
      if (cur.status !== 0 || cur.hide) continue
      const { x: x1, y: y1 } = cur
      const x2 = x1 + cardSize
      const y2 = y1 + cardSize
      for (let j = i + 1; j < cards.length; j++) {
        const compare = cards[j]
        if (compare.status !== 0 || compare.hide) continue
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
    if (selectedNo < maxCardsNo) {
      selectedNo++
      refreshSlot(card)
    }
    checkShading()
  }

  function init() {
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
        m='a' border='1 coolGray'
        box='content'
        relative
        style={{ width: `${cardSize * row}px`, height: `${cardSize * col}px`, padding: `${cardSize}px` }}
      >
        {cards.map((card, i) => {
          return (
            <div
              box='border'
              border='1 dark:black/50'
              transition='all'
              duration='300'
              rounded=''
              style={{
                width: `${cardSize}px`,
                height: `${cardSize}px`,
                transform: `translate(${card.x}px, ${card.y}px)`,
                display: `${card.hide ? 'none' : ''}`,
                userSelect: 'none',
                transitionDuration: `${animationDuration}ms`,
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
          width: `${maxCardsNo * cardSize + slotPadding}px`,
          height: `${cardSize + slotPadding}px`,
        }}
        text='left'
        m='t-10 x-a'
        border='~ rounded coolGray'
      />
    </div>
  )
}

export default IndexPage
