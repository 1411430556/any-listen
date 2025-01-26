import { SPLIT_CHAR } from '@any-listen/common/constants'
import { dislikeListState } from './state'

export const hasDislike = (info: AnyListen.Music.MusicInfo) => {
  // if ('progress' in info) info = info.metadata.musicInfo
  const name = info.name?.replaceAll(SPLIT_CHAR.DISLIKE_NAME, SPLIT_CHAR.DISLIKE_NAME_ALIAS).toLocaleLowerCase().trim() ?? ''
  const singer = info.singer?.replaceAll(SPLIT_CHAR.DISLIKE_NAME, SPLIT_CHAR.DISLIKE_NAME_ALIAS).toLocaleLowerCase().trim() ?? ''

  return (
    dislikeListState.musicNames.has(name) ||
    dislikeListState.singerNames.has(singer) ||
    dislikeListState.names.has(`${name}${SPLIT_CHAR.DISLIKE_NAME}${singer}`)
  )
}

export { initInfo } from './commit'

export { overwirteInfo, addInfo, clearInfo, registerRemoteActions, getInfo } from './listRemoteActions'
