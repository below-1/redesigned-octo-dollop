import { writable }  from 'svelte/store'

export const items = writable([])
export const tax = writable(0)
export const shipping = writable(0)
export const discount = writable(0)
