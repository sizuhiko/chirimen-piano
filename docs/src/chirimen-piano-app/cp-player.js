import { PolymerElement } from "../../node_modules/@polymer/polymer/polymer-element.js";
/**
 * @customElement
 * @polymer
 */

class CpPlayer extends PolymerElement {
  static get properties() {
    return {
      hz: Number,
      volume: Number
    };
  }

  play() {
    var osciillator = this._audioCtx.createOscillator();

    osciillator.frequency.value = this.hz;

    var gainNode = this._audioCtx.createGain();

    osciillator.connect(gainNode);
    var audioDestination = this._audioCtx.destination;
    gainNode.connect(audioDestination);
    gainNode.gain.value = this.volume / 100;
    osciillator.start = osciillator.start || osciillator.noteOn;
    osciillator.start();
    setTimeout(function () {
      osciillator.stop();
    }, 500);
  }

  ready() {
    super.ready();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this._audioCtx = new AudioContext();
  }

}

window.customElements.define('cp-player', CpPlayer);