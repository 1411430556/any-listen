import Action from '@any-listen/common/Action'
import * as appActions from '@/modules/app/actions'
import * as playerActions from '@/modules/player/actions'
import * as musicLibraryActions from '@/modules/musicLibrary/actions'
import * as dislikeListActions from '@/modules/dislikeList/actions'
import * as extensionActions from '@/modules/extension/actions'

const ACTIONS = {
  app: appActions,
  player: playerActions,
  musicLibrary: musicLibraryActions,
  dislikeList: dislikeListActions,
  extension: extensionActions,
} as const

type Actions = FlattenObject<typeof ACTIONS>

const actionsRaw = new Action() as ActionType

for (const [mod, modActions] of Object.entries(ACTIONS)) {
  for (const [action, handle] of Object.entries(modActions)) {
    actionsRaw.register(`${mod}.${action}`, handle)
  }
}

declare class ActionType extends Action {
  exec<K extends keyof Actions>(action: K, ...args: Parameters<Actions[K]>): ReturnType<Actions[K]>
}

export const actions = actionsRaw as Omit<ActionType, 'register'>
