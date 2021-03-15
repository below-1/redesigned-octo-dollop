import { writable } from 'svelte/store'

function create_delete_confirm () {
  const default_data = {
    entity: 'pelanggan',
    id: 0,
    value: false,
    on_yes: null
  }
  const { subscribe, update } = writable(default_data)
  return {
    subscribe,
    show: ({ entity, id, on_yes: _yes }) => {
      const _on_yes = () => {
        _yes()
        update(data => {
          return {
            ...data,
            value: false
          }
        })
      }
      update(data => {
        return {
          ...data,
          value: true,
          entity,
          id,
          on_yes: _on_yes
        }
      })
    },
    hide: () => {
      update(data => {
        return {
          ...data,
          value: false
        }
      })
    }
  }
}

export const del_confirm = create_delete_confirm()