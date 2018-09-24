import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {WebI2cSensorElement} from './web-i2c-sensor-element.js';

/**
 * WebI2C
 * 
 * @example 
 * 
 * <web-i2c>
 *   <grove-touch></grove-touch>
 *   <div slot="no-web-i2c">
 *     このデバイスはCHIRIMENではありませんが、ピアノ演奏はお楽しみいただけます。
 *   </div>
 * </web-i2c>
 * 
 * @customElement
 * @polymer
 */
class WebI2C extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        .message {
          display: none;
        }
        :host([disable]) .message {
          display: block;
          font-size: 8px;
          margin: 2em 4em;
          color: orange;
        }
      </style>

      <div class="message">
        <slot name="no-web-i2c"></slot>
      </div>
      <slot id="sensors"></slot>
    `;
  }  
  static get properties() {
    return {
      /**
       * I2Cポート番号。CHIRIMEN for Raspberry Piで利用可能なものは1だけなので、その場合は省略可能
       */
      i2c: {
        type: Number,
        value: 1,
      },
      disable: {
        type: Boolean,
        reflectToAttribute: true,
      }
    };
  }
  ready() {
    super.ready();
    navigator.requestI2CAccess().then(function(i2cAccess) {
      const port = i2cAccess.ports.get(this.i2c);
      console.log('WebI2C init');
      this._bindPort(port);
    }.bind(this)).catch(e => {
      console.log('This will not CHIRIMEN.', e);
      this.disable = true;
      this._bindPort(null);
    });
  }
  _bindPort(port) {
    const slot = this.shadowRoot.querySelector('#sensors');
    slot.assignedNodes().forEach(node => {
      if(node instanceof HTMLElement) {
        console.log('WebI2C port assigned to ' + node.nodeName.toLowerCase());
        node.port = port;
      }
    });
  }
}

window.customElements.define('web-i2c', WebI2C);
