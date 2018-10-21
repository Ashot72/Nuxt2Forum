import { AUTOSIGNIN } from '@/store/auth/action-types'

export default function (context) {
  if (process.static) {
    const { app, store } = context
    app.router.onReady(() => {
      if (process.static) {
        store.dispatch(`auth/${AUTOSIGNIN}`, context)
      }
    })
  }
}
