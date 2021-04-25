export const base_url = 'http://localhost:5000'

function fetch_opts (def) {
  let headers = {
    'Content-Type': 'application/json',
  }
  const token = localStorage.getItem('waka.token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return {
    ...def,
    mode: 'cors',
    headers
  }
}

export async function post(opts) {
  let url = new URL(`${base_url}${opts.url}`)
  if (opts.params) {
    Object.keys(opts.params).forEach(key => {
      url.searchParams.append(key, opts.params[key])
    })
  }

  const options = fetch_opts({
    method: 'POST',
    body: JSON.stringify(opts.payload)
  })
  const response = await fetch(url, options)
  return response.json()
}

export async function get(opts) {
  let url = new URL(`${base_url}${opts.url}`)
  if (opts.params) {
    Object.keys(opts.params).forEach(key => {
      url.searchParams.append(key, opts.params[key])
    })
  }
  const options = fetch_opts({
    method: 'GET'
  })
  const response = await fetch(url, options)
  return response.json()
}

export async function del (opts) {
  let url = new URL(`${base_url}${opts.url}`)
  if (opts.params) {
    Object.keys(opts.params).forEach(key => {
      url.searchParams.append(key, opts.params[key])
    })
  }
  const options = fetch_opts({
    method: 'DELETE'
  })
  const response = await fetch(url, options)
  return response.json()
}

export async function put(opts) {
  let url = new URL(`${base_url}${opts.url}`)
  if (opts.params) {
    Object.keys(opts.params).forEach(key => {
      url.searchParams.append(key, opts.params[key])
    })
  }

  const options = fetch_opts({
    method: 'PUT',
    body: JSON.stringify(opts.payload)
  })

  const response = await fetch(url, options)
  return response.json()
}