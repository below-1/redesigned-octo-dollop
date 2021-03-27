import { writable, derived, get } from 'svelte/store'
import { get as getAPI } from '../commons/api'

export const useParams = () => writable({
  page: null,
  per_page: null,
  keyword: null,
  stock: false
})

export const useProductList = () => {
  const params = writable({
    page: null,
    per_page: null,
    keyword: null,
    stock: false
  })
  const result = writable({
    total_page: 0,
    items: []
  })

  function cb ([$params, $result], set) {
    let _params = {}
    if ($params.page) {
      _params.page = $params.page
      _params.per_page = $params.per_page
      _params.keyword = $params.keyword
      _params.stock = true
    } else {
      _params.stock = true
    }

    set({
      params,
      result
    })
    getAPI({
      url: '/api/v1/product',
      params
    })
      .then(resp => {
        result.set(resp)
      })
      .catch(err => {
        console.log(err)
      })
  }

  function updateParams (payload) {
    params.update(current => ({
       ...current,
       ...payload
    }))
  }

  return derived(
    [ params, result ], 
    cb,
    default_state
  )
}