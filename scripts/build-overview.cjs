const fs = require('fs')
const path = require('path')

const inputPath = path.join(process.cwd(), 'public', 'data', 'receipts.json')
const outputPath = path.join(process.cwd(), 'public', 'data', 'overview.json')

const dataset = JSON.parse(fs.readFileSync(inputPath, 'utf8'))

if (!Array.isArray(dataset.receipts)) {
  throw new Error('receipts.json does not contain a receipts array')
}

const receipts = dataset.receipts

const days = new Map()
const categories = new Map()
const artists = new Map()

let musicCount = 0
let activityCount = 0

for (const receipt of receipts) {
  if (receipt.kind === 'music') {
    musicCount++
  } else {
    activityCount++
  }

  if (receipt.category) {
    categories.set(
      receipt.category,
      (categories.get(receipt.category) || 0) + 1,
    )
  }

  for (const artist of receipt.meta?.topArtists || []) {
    artists.set(artist, (artists.get(artist) || 0) + 1)
  }

  if (receipt.timestamp) {
    const day = receipt.timestamp.slice(0, 10)

    if (!days.has(day)) {
      days.set(day, {
        receiptCount: 0,
        kinds: new Set(),
      })
    }

    const info = days.get(day)
    info.receiptCount++
    info.kinds.add(receipt.kind)
  }
}

const connectedDays = [...days.entries()]
  .map(([day, info]) => ({
    day,
    receiptCount: info.receiptCount,
    kinds: info.kinds.size,
  }))
  .filter((item) => item.kinds >= 2)
  .sort(
    (a, b) =>
      b.receiptCount - a.receiptCount ||
      b.kinds - a.kinds,
  )
  .slice(0, 100)

const connectedDayCount = [...days.values()].filter((info) => info.kinds.size >= 2).length

const topEntry = (map) =>
  [...map.entries()].sort((a, b) => b[1] - a[1])[0] || null

const previewReceipts = [...receipts]
  .sort((a, b) => {
    const left = a.timestamp ? new Date(a.timestamp).getTime() : 0
    const right = b.timestamp ? new Date(b.timestamp).getTime() : 0
    return right - left
  })
  .slice(0, 30)

const overview = {
  version: dataset.version || '1.0',
  totalReceipts: receipts.length,
  musicCount,
  activityCount,
  activeDays: days.size,
  connectedDays,
  connectedDayCount,
  topCategory: topEntry(categories),
  topArtist: topEntry(artists),
  previewReceipts,
}

fs.writeFileSync(
  outputPath,
  JSON.stringify(overview),
  'utf8',
)

console.log('Overview generated successfully.')
console.log(`Receipts: ${overview.totalReceipts}`)
console.log(`Connected days: ${overview.connectedDays.length}`)
console.log(
  `Overview size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`,
)
