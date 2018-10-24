import { AUTOSIGNIN } from '@/store/auth/action-types'

export default function (context) {
  if (process.static) {
    const { app, store } = context
    app.router.onReady(() => {
      store.dispatch(`auth/${AUTOSIGNIN}`, context)
    })
  }
}
