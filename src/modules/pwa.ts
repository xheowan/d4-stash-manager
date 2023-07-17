import { type UserModule } from '~/types'

// https://github.com/antfu/vite-plugin-pwa#automatic-reload-when-new-content-available
export const install: UserModule = ({ isClient, router }) => {
    if (!isClient)
        return

    router.isReady()
        .then(async () => {
            const { useRegisterSW } = await import('virtual:pwa-register/vue')
            useRegisterSW({ immediate: true })
        })
        .catch(() => {})
}