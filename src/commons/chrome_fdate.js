import format from 'date-fns/format'

export default function (d) {
  return format(d, "yyyy-MM-dd'T'hh:mm")
}