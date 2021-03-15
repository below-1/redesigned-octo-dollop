import format from 'date-fns/format'

export default function (d) {
	return format(d, " HH:mm dd MMMM',' yyyy")
}