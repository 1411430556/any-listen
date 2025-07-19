<script lang="ts">
  import { useSettingValue } from '@/modules/setting/reactive.svelte'
  import { useLyric } from './useLyric.svelte'
  import Btn from '@/components/base/Btn.svelte'
  import { fade } from 'svelte/transition'
  import { onMount } from 'svelte'
  import { onDomSizeChanged } from '@any-listen/web'

  let domLyric = $state<HTMLElement>()
  let domLyricText = $state<HTMLElement>()
  let domSkipLine = $state<HTMLElement>()
  let isMsDown = $state(false)
  let isStopScroll = $state(false)
  let timeStr = $state('--/--')
  let winRadio = $state(document.getElementById('root')!.clientWidth / 1020)
  const textAlign = useSettingValue('playDetail.style.align')
  const isZoomActiveLrc = useSettingValue('playDetail.isZoomActiveLrc')
  // const isShowLyricProgressSetting = useSettingValue('playDetail.isShowLyricProgressSetting')
  const fontSize = useSettingValue('playDetail.style.fontSize')
  const fontWeight = useSettingValue('playDetail.style.fontWeight')
  const styles = $derived(`--playDetail-lrc-font-size:${(fontSize.val / 100 + 0.8) * winRadio}rem; text-align:${textAlign.val};`)

  const {
    handleLyricMouseDown,
    handleLyricTouchStart,
    handleWheel,
    handleSkipPlay,
    handleSkipMouseEnter,
    handleSkipMouseLeave,
    // handleScrollLrc,
  } = useLyric({
    get domLyric() {
      return domLyric
    },
    get domLyricText() {
      return domLyricText
    },
    get domSkipLine() {
      return domSkipLine
    },
    onSetMsDown(_isMsDown) {
      isMsDown = _isMsDown
    },
    onSetStopScroll(_isStop) {
      isStopScroll = _isStop
    },
    onSetTimeStr(_timeStr) {
      timeStr = _timeStr
    },
  })

  onMount(() => {
    const unsub = onDomSizeChanged(document.getElementById('root')!, (width) => {
      winRadio = width / 1020
    })
    return () => {
      unsub()
    }
  })
</script>

<div
  bind:this={domLyric}
  class:draging={isMsDown}
  class:lrcActiveZoom={isZoomActiveLrc.val}
  class:font-weight={fontWeight.val}
  class:text-left={textAlign.val === 'left'}
  class:text-center={textAlign.val === 'center'}
  class:text-right={textAlign.val === 'right'}
  class="lyric"
  role="presentation"
  style={styles}
  onwheel={handleWheel}
  onmousedown={handleLyricMouseDown}
  ontouchstart={handleLyricTouchStart}
  oncontextmenu={(event) => {
    event.stopPropagation()
    // handleShowLyricMenu(event)
  }}
>
  <div class="pre lyricSpace"></div>
  <div bind:this={domLyricText}></div>
  <div class="lyricSpace"></div>
</div>
{#if isStopScroll}
  <div transition:fade={{ duration: 150, delay: 5 }} class="skip">
    <div bind:this={domSkipLine} class="line"></div>
    <span class="label">{timeStr}</span>
    <Btn onmouseenter={handleSkipMouseEnter} onmouseleave={handleSkipMouseLeave} onclick={handleSkipPlay}>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="50%" viewBox="0 0 1024 1024">
        <use xlink:href="#icon-play" />
      </svg>
    </Btn>
  </div>
{/if}

<style lang="less">
  @unplay-color: var(--color-200);
  @unplay-font-color: var(--color-150);
  @played-color: var(--color-primary-dark-100);

  .lyric {
    // text-align: center;
    position: relative;
    height: 100%;
    overflow: hidden;
    font-size: var(--playDetail-lrc-font-size, 16px);
    mask-image: linear-gradient(transparent 0%, #fff 20%, #fff 80%, transparent 100%);
    cursor: grab;
    &.draging {
      cursor: grabbing;
    }
    :global {
      .font-lrc {
        color: @unplay-color;
      }
      .line-content {
        line-height: 1.2;
        padding-left: 1px;
        padding-right: 8%;
        padding-top: calc(var(--playDetail-lrc-font-size, 16px) / 1.8);
        padding-bottom: calc(var(--playDetail-lrc-font-size, 16px) / 1.8);
        overflow-wrap: break-word;
        color: @unplay-color;
        transition: @transition-slow !important;
        transition-property: padding, transform !important;
        text-shadow:
          0 0 2px var(--color-primary-light-100-alpha-900),
          0 0 3px var(--color-primary-light-100-alpha-900),
          0 0 4px var(--color-primary-dark-700-alpha-900);

        &.active {
          // padding: var(--playDetail-lrc-font-size, 16px) 1px;
          padding-top: calc(var(--playDetail-lrc-font-size, 16px) * 1.2);
          padding-bottom: calc(var(--playDetail-lrc-font-size, 16px) * 1.2);
        }

        .extended {
          font-size: 0.8em;
          margin-top: 5px;
        }
        &.line-mode {
          .font-lrc {
            transition: @transition-normal;
            transition-property: color;
          }
        }
        &.font-mode {
          color: @unplay-font-color;
        }
        &.line-mode.active .font-lrc,
        &.font-mode.played .font-lrc {
          color: @played-color;
        }
        &.font-mode .extended .font-lrc {
          transition: @transition-slow;
          transition-property: color;
        }

        &.font-mode > .line > .font-lrc {
          > span {
            transition: @transition-normal;
            transition-property: font-size;
            font-size: 1em;
            background-repeat: no-repeat;
            background-color: @unplay-font-color;
            background-image: -webkit-linear-gradient(top, @played-color, @played-color);
            -webkit-text-fill-color: transparent;
            background-clip: text;
            background-size: 0 100%;
          }
        }
      }
    }
    // p {
    //   padding: 8px 0;
    //   line-height: 1.2;
    //   overflow-wrap: break-word;
    //   transition: @transition-normal !important;
    //   transition-property: color, font-size;
    // }
    // .lrc-active {
    //   color: var(--color-primary);
    //   font-size: 1.2em;
    // }
  }
  .font-weight {
    :global {
      .line-content {
        font-weight: bold;
      }
    }
  }
  .lrcActiveZoom {
    :global {
      .line-content {
        &.active {
          transform: scale(1.1);
          // .extended {
          //   // font-size: 1em;
          // }
          // .line {
          //   // font-size: 1.2em;
          // }
        }
      }
    }
    &.text-left {
      :global {
        .line-content {
          padding-right: 12%;
          transform-origin: 0%;
        }
      }
    }
    &.text-center {
      :global {
        .line-content {
          padding-left: 6%;
          padding-right: 6%;
          // transform: scale(1.1);
        }
      }
    }
    &.text-right {
      :global {
        .line-content {
          padding-left: 12%;
          transform-origin: 100%;
        }
      }
    }
  }

  .skip {
    position: absolute;
    top: calc(38% + var(--playDetail-lrc-font-size, 16px) + 4px);
    left: 0;
    // height: 6px;
    width: 100%;
    pointer-events: none;
    // opacity: .5;
    .line {
      border-top: 2px dotted var(--color-primary-dark-100);
      opacity: 0.15;
      margin-right: 8%;
      mask-image: linear-gradient(90deg, transparent 0%, transparent 15%, #fff 100%);
    }
    .label {
      position: absolute;
      right: 8%;
      top: -16px;
      line-height: 1.2;
      font-size: 13px;
      color: var(--color-primary-dark-100);
      opacity: 0.7;
    }
    :global(button) {
      position: absolute;
      right: -2%;
      top: 0;
      transform: translateY(-50%);
      width: 12%;
      aspect-ratio: 1 / 1;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none !important;
      pointer-events: initial;
      transition: @transition-normal;
      transition-property: opacity;
      opacity: 0.8;
      &:hover {
        opacity: 0.6;
      }
    }
  }
  // .lyricSelectContent {
  //   position: absolute;
  //   left: 0;
  //   top: 0;
  //   // text-align: center;
  //   height: 100%;
  //   width: 100%;
  //   font-size: var(--playDetail-lrc-font-size, 16px);
  //   z-index: 10;
  //   color: var(--color-400);

  //   .lyricSelectline {
  //     padding: calc(var(--playDetail-lrc-font-size, 16px) / 2) 1px;
  //     overflow-wrap: break-word;
  //     transition: @transition-normal !important;
  //     transition-property: color, font-size;
  //     line-height: 1.3;
  //   }
  //   .lyricSelectlineExtended {
  //     font-size: 14px;
  //   }
  //   .lrcActive {
  //     color: var(--color-primary);
  //   }
  // }

  .lyricSpace {
    height: 60%;
  }
</style>
