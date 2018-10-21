import { AUTOSIGNIN } from '@/store/auth/action-types'

export default function (context) {
  context.store.dispatch(`auth/${AUTOSIGNIN}`, context)
}
