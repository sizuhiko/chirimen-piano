import { html, PolymerElement } from "../../node_modules/@polymer/polymer/polymer-element.js";
import "../../node_modules/@polymer/polymer/lib/elements/dom-repeat.js";
import { GestureEventListeners } from "../../node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js";
import "../../node_modules/@polymer/paper-ripple/paper-ripple.js";
import "../../node_modules/@polymer/paper-slider/paper-slider.js";
import "../../node_modules/@polymer/iron-icons/av-icons.js";
import "../../node_modules/@polymer/iron-icon/iron-icon.js";
import './cp-player.js';
/**
 * @customElement
 * @polymer
 */

class ChirimenPianoApp extends GestureEventListeners(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        .key {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          transition: box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          transition-delay: 0.2s;
          box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
          margin: 10px;
        }
        .center {
          margin-top: 15px;
          text-align: center;
        }
        .control {
          background-color: #4285f4;
        }
        .key.pad {
          color: white;
          background-color: tomato;
        }
        .key.pad + .key.pad {
          color: black;
          background-color: white;
        }
        .key.pad + .key.pad + .key.pad {
          color: black;
          background-color: yellow;
        }
        .key.pad + .key.pad + .key.pad + .key.pad {
          color: white;
          background-color: limegreen;
        }

        .control > iron-icon {
          margin: 16px;
        }
        .control > iron-icon {
          --iron-icon-fill-color: #fff;
        }
        paper-slider {
          width: 500px;
        }
      </style>

      <div class="control key raised" on-tap="prev">
        <iron-icon icon="av:fast-rewind"></iron-icon>
        <paper-ripple class="prev circle" recenters></paper-ripple>
      </div>

      <template is="dom-repeat" items="[[_fromPage(page)]]">
        <div class="key pad raised" on-tap="play">
          <div class="center">[[item.name]]</div>
          <paper-ripple class="keyboard circle" recenters></paper-ripple>
        </div>
      </template>

      <div class="control key raised" on-tap="next">
        <iron-icon icon="av:fast-forward"></iron-icon>
        <paper-ripple class="next circle" recenters></paper-ripple>
      </div>

      <div>
        <paper-slider value="{{volume}}"></paper-slider>
      </div>
      <cp-player id="player" hz="[[hz]]" volume="[[volume]]"></cp-player>

    `;
  }

  static get properties() {
    return {
      hz: Number,
      volume: Number,
      page: Number
    };
  } // page の範囲は -2 < page < 3 で、3オクターブまで


  _fromPage(page) {
    // key 0 は標準のド
    var hz = function (key) {
      return 442 * Math.pow(2, 1 / 12 * (key - 9));
    };

    var keys = [[{
      name: 'ド',
      hz: hz(-12)
    }, {
      name: 'レ',
      hz: hz(-10)
    }, {
      name: 'ミ',
      hz: hz(-8)
    }, {
      name: 'ファ',
      hz: hz(-7)
    }], [{
      name: 'ソ',
      hz: hz(-5)
    }, {
      name: 'ラ',
      hz: hz(-3)
    }, {
      name: 'シ',
      hz: hz(-1)
    }, {
      name: 'ド',
      hz: hz(0)
    }], [{
      name: 'ド',
      hz: hz(0)
    }, {
      name: 'レ',
      hz: hz(2)
    }, {
      name: 'ミ',
      hz: hz(4)
    }, {
      name: 'ファ',
      hz: hz(5)
    }], [{
      name: 'ソ',
      hz: hz(7)
    }, {
      name: 'ラ',
      hz: hz(9)
    }, {
      name: 'シ',
      hz: hz(11)
    }, {
      name: 'ド',
      hz: hz(12)
    }], [{
      name: 'ド',
      hz: hz(12)
    }, {
      name: 'レ',
      hz: hz(14)
    }, {
      name: 'ミ',
      hz: hz(16)
    }, {
      name: 'ファ',
      hz: hz(17)
    }], [{
      name: 'ソ',
      hz: hz(19)
    }, {
      name: 'ラ',
      hz: hz(21)
    }, {
      name: 'シ',
      hz: hz(23)
    }, {
      name: 'ド',
      hz: hz(24)
    }]];
    return keys[page + 2];
  }

  play(event) {
    this.hz = event.model.item.hz;
    this.$.player.play();
  }

  prev() {
    if (this.page > -2) this.page--;
  }

  next() {
    if (this.page < 3) this.page++;
  }

  ready() {
    super.ready();
    this.page = 0;
    this.volume = 50;
  }

  touchChanged(touches) {
    console.log("タッチ", JSON.stringify(touches));
    const keyboard = this.shadowRoot.querySelectorAll('paper-ripple.keyboard');
    touches.forEach((value, index) => {
      if (value) {
        keyboard[index].simulatedRipple();
        this.hz = this._fromPage(this.page)[index].hz;
        this.$.player.play();
      }
    });
  }

  gestureChanged(gesture) {
    console.log("ジェスチャー", gesture);

    switch (gesture) {
      case 'up':
        this.shadowRoot.querySelector('paper-ripple.next').simulatedRipple();
        this.next();
        break;

      case 'down':
        this.shadowRoot.querySelector('paper-ripple.prev').simulatedRipple();
        this.prev();
        break;

      case 'forward':
        this.volume -= 10;
        break;

      case 'back':
        this.volume += 10;
        break;
    }
  }

}

window.customElements.define('chirimen-piano-app', ChirimenPianoApp);