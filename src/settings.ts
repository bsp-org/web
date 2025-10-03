import { client } from 'src/client/client.gen'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

client.setConfig({
    baseUrl: API_BASE_URL,
    throwOnError: true,
    headers: {
        'User-TimeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
})
