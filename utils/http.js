import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:3000/api',
})

// export default (resource) => ({
// 	const all(query = {}) {
// 		return await http.get(`${resource}?${new URLSearchParams(query)}`)
// 	},
// })

export default http
