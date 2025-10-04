import { defaultPlugins, defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
    input: '../bsp-backend/src/openapi.json',
    output: {
        path: 'src/client',
        clean: true,
        indexFile: false,
        format: 'prettier',
    },
    plugins: [
        ...defaultPlugins,
        {
            name: '@hey-api/sdk',
            operationId: true,
        },
        {
            name: '@tanstack/react-query',
        },
        { name: '@hey-api/typescript', enums: 'javascript' },
        { name: '@hey-api/client-axios' },
    ],
})
