import { appState } from '@/modules/app/store/state'
import type { Action } from 'svelte/action'

const transition1 = 'transform, opacity'
const transition2 = 'transform, opacity, top, left'
const getOffsetXY = (dom: HTMLElement, left: number, top: number) => {
  const listWidth = dom.clientWidth
  const listHeight = dom.clientHeight
  const domContainerParant = dom.offsetParent ?? document.body
  const containerWidth = domContainerParant.clientWidth
  const containerHeight = domContainerParant.clientHeight
  const offsetWidth = containerWidth - left - listWidth + appState.rootOffsetX
  const offsetHeight = containerHeight - top - listHeight + appState.rootOffsetY
  let x = 0
  let y = 0
  if (containerWidth > listWidth && offsetWidth < 12) {
    x = offsetWidth - 12
  }
  if (containerHeight > listHeight && offsetHeight < 5) {
    y = offsetHeight - 5
  }
  return `${x}px, ${y}px`
}
export interface Position {
  x: number
  y: number
}

export const menuLocaltion: Action<HTMLElement, { visible: boolean; location: Position; onHide: () => void }> = (
  dom: HTMLElement,
  { visible, location, onHide }
) => {
  let show = false
  let timeout: number | null = null

  const clearHideTimeout = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  const handleShow = (location: Position) => {
    // console.log('handleShow')
    show = true
    dom.style.opacity = '1'
    dom.style.transform = `scale(1) translate(${getOffsetXY(dom, location.x, location.y)})`
    dom.style.pointerEvents = 'auto'
  }
  const handleHide = () => {
    // console.log('handleHide')
    dom.style.opacity = '0'
    dom.style.transform = 'scale(.8, .7) translate(0, 0)'
    dom.style.pointerEvents = 'none'
    show = false
  }

  const handleBlur = async (event: FocusEvent) => {
    // console.log('handleBlur', show)
    if (timeout) clearTimeout(timeout)
    if (dom.contains(event.relatedTarget as HTMLElement)) return
    timeout = setTimeout(() => {
      timeout = null
      if (show) onHide()
    }, 200)
  }
  const handleTransitionEnd = () => {
    if (!show) return
    dom.focus()
  }

  const handleDocumentClick = (event: MouseEvent) => {
    if (!show) return

    if (event.target == dom || dom.contains(event.target as HTMLElement)) return

    if (dom.style.transitionProperty != transition1) dom.style.transitionProperty = transition1

    event.preventDefault()
    // event.stopPropagation()
    onHide()
  }

  document.addEventListener('click', handleDocumentClick, true)
  dom.addEventListener('blur', handleBlur)
  dom.addEventListener('transitionend', handleTransitionEnd)

  dom.style.left = `${location.x - appState.rootOffsetX + 2}px`
  dom.style.top = `${location.y - appState.rootOffsetY}px`
  if (visible) handleShow(location)

  return {
    async update({ visible, location }) {
      clearHideTimeout()
      // console.log(visible, show, location)
      if (visible != show) {
        if (visible) handleShow(location)
        else handleHide()
      } else {
        dom.style.left = `${location.x - appState.rootOffsetX + 2}px`
        dom.style.top = `${location.y - appState.rootOffsetY}px`
        if (show) {
          if (dom.style.transitionProperty != transition2) dom.style.transitionProperty = transition2
          dom.style.transform = `scale(1) translate(${getOffsetXY(dom, location.x, location.y)})`
          dom.focus()
        }
      }
    },
    destroy() {
      document.removeEventListener('click', handleDocumentClick)
      dom.removeEventListener('blur', handleBlur)
      dom.removeEventListener('transitionend', handleTransitionEnd)
    },
  }
}
