const randomCreateId = (length: number) => {
  return (Math.random() + new Date().getTime()).toString(32).slice(0, length)
}

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
  not: boolean
  // 是否在卡槽中 0否 1是
  status: CardStatus
  // 是否清除
  clear: boolean
  // 隐藏
  display: boolean
}

const IndexPage = () => {
  const cardSize = 40
  const row = 7
  const col = 7
  const defaultIcons = ['⚙️', '🦄', '😅', '📕', '🎁', '📺']
  const defaultRounds = ['3', '6', '9', '2', '8']
  const defaultOffsetValue = [7, -7, 20, -20, 25, -25, 33, -33, 40, -40]
  const defaultOffsetValueLength = defaultOffsetValue.length
  const icons = defaultIcons.slice(0, 2)
  const [cards, setCards] = useState<Card[]>([])

  const genCard = (icon: string): Card => {
    const offset = defaultOffsetValue[Math.floor(defaultOffsetValueLength * Math.random())]
    const r = Math.floor(Math.random() * row)
    const c = Math.floor(Math.random() * col)
    const x = c * cardSize + offset
    const y = r * cardSize + offset
    return {
      id: randomCreateId(6),
      icon,
      x,
      y,
      not: true,
      status: 0,
      clear: false,
      display: false,
    }
  }

  const init = () => {
    for (const icon of icons) {
      const round = +defaultRounds[Math.floor(Math.random() * defaultRounds.length)]
      for (let i = 0; i < round; i++)
        setCards(c => [...c, genCard(icon)])
    }
  }

  useMount(init)

  return (
    <div
      m='a' border='1'
      box='content'
      relative=''
      style={{ width: `${cardSize * row}px`, height: `${cardSize * col}px`, padding: `${cardSize}px` }}
    >
      {cards.map((card, i) => {
        return (
          <div
            box='border'
            border='1'
            style={{ width: `${cardSize}px`, height: `${cardSize}px`, transform: `translate(${card.x}px, ${card.y}px)` }}
            key={i}
            absolute=''
            flex='center ~'
          >
            {card.icon}
          </div>
        )
      })}
    </div>
  )
}

export default IndexPage
