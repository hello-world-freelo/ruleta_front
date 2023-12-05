<template>
  <div class="relative">
    <button :disabled="disabledButtonPress" class="spinBtn" @click="onButtonPress">Gira ruleta</button>
    <div class="wheelContainer">
      <svg
        class="wheelSVG"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        preserveAspectRatio="xMidYMid meet"
        text-rendering="optimizeSpeed"
      >
        <!-- <defs>
          <filter id="shadow" x="-100%" y="-100%" width="550%" height="550%">
            <feOffset
              in="SourceAlpha"
              dx="0"
              dy="0"
              result="offsetOut"
            ></feOffset>
            <feGaussianBlur stdDeviation="9" in="offsetOut" result="drop" />
            <feColorMatrix
              in="drop"
              result="color-out"
              type="matrix"
              values="0 0 0 0   0
                0 0 0 0   0
                0 0 0 0   0
                0 0 0 .3 0"
            />
            <feBlend in="SourceGraphic" in2="color-out" mode="normal" />
          </filter>
        </defs> -->
        <g class="mainContainer">
          <g class="wheel" />
        </g>
        <g class="centerCircle" />

        <g class="wheelOutline" />
        <g class="pegContainer">
          <path
            class="peg"
            fill="#EEEEEE"
            d="M22.139,0C5.623,0-1.523,15.572,0.269,27.037c3.392,21.707,21.87,42.232,21.87,42.232	s18.478-20.525,21.87-42.232C45.801,15.572,38.623,0,22.139,0z"
          />
        </g>
        <g class="valueContainer" />
        <image xlink:href="https://s3-us-west-2.amazonaws.com/s.cdpn.io/35984/chris_avatar_popup2.svg" width="100" height="100" x="462" y="334"></image>
      </svg>

      <!-- <div class="toast">
        <p />
      </div> -->
    </div>
  </div>
</template>
<script>

import WinWheel from "./WinWheel"

if (process.client) {
  require('./tweenMax')
  require('./ThrowPropsPlugin.min')
}

export default {
  name: 'WinWheel',
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    disabledButtonPress: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      winWheel: null
    }
  },
  computed: {
    winWheelInstance: {
      cache: false,
      set(winWheel) {
        this.winWheel = winWheel
      },
      get() {
        return this.winWheel || null
      },
    },
    winWheelOptions() {
      return Object.assign(this.options, {})
    },
  },
  methods: {
    initWinWheel() {

      const mySpinBtn = document.querySelector('.spinBtn')

      let winWheelInstance = new WinWheel()

      winWheelInstance.init({
        data: this.winWheelOptions,
        onResult: (data) => this.$emit('onResult', data),
        onGameEnd: (data) => this.$emit('onGameEnd', data),
        onError: (data) => this.$emit('onError', data),
        spinTrigger:mySpinBtn
      })

      this.winWheelInstance = winWheelInstance
    },
    onButtonPress() {
      this.$emit('onButtonPress')
    }
  },
  mounted() {
    if (!this.winWheelInstance) {
      this.initWinWheel()
    }
    const draggableScript = document.createElement("script")
    draggableScript.setAttribute(
      "src",
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.4/utils/Draggable.min.js"
    )
    document.head.appendChild(draggableScript)
  }
}
</script>
<style>

.spinBtn{
  position: absolute;
  background-color: #E81D62;
  transform: translate(-50%, 0);
  left: 50%;
  width: 100%;
  top: 10px;
  max-width: 200px;
  padding: 14px;
  font-size: 18px;
  color: #ededed;
  border-radius: 6px;
  border: none;
  box-shadow: 0 2px 0 #D71559;
  cursor: pointer;
  z-index: 1;
}

.wheelContainer{
  min-height: 500px;
  height: 100%;
}

.wheelSVG{
  position: absolute;
  overflow: visible;
  min-width: 100%;
  height: 100%;
}

.peg{
  visibility:hidden;
}

.wheelOutline, .valueContainer, .toast, .centerCircle{
  pointer-events:none;
}

.wheelText{
  pointer-events:none;
  text-anchor:middle;
  -webkit-user-select: none;
  user-select:none;
}

.toast {
  position:absolute;
  background-color:#E81D62;
  border-radius:12px;
  opacity:0;
  text-align:center;
}

.toast p{
  clear: both;
  margin:23px;
  font-size:30px;
  color:#ededed;
  letter-spacing:-0px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  line-height:32px;
  -webkit-transition: font-size .2s ease;
  transition: font-size .2s ease;
  -webkit-transition: line-height .2s ease;
  transition: line-height .2s ease;
}

/* Smartphones (portrait and landscape) ----------- */
@media only screen and (max-width : 480px) {
  .toast p, .toast span{
    font-size:18px;
    line-height:18px;
  }
}
@media only screen and (min-width : 481px) and (max-width : 800px) {
  .toast p, .toast span{
    font-size: 18px;
    line-height: 18px;
  }
}

@media only screen and (min-width : 801px)  {
  .toast p, .toast span{
    font-size: 28px;
    line-height: 30px;
  }
}


@media only screen and (max-height : 480px) {
  .toast p, .toast span{
    font-size: 14px;
    line-height: 16px;
  }
}

</style>
