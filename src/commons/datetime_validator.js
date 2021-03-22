export default function (value) {
  const ts = Date.parse(value)
  return {
    valid: !isNaN(ts),
    name: 'datetime'
  }
}