import { PolymerElement } from "../../node_modules/@polymer/polymer/polymer-element.js";
/**
 * WebI2C
 * 
 * @example 
 * 
 * <web-i2c port="{{i2cPort}}">
 *  <grove-touch port="[[i2cPort]]"></grove-touch>
 * </web-i2c>
 * 
 * @customElement
 * @polymer
 */

class WebI2C extends PolymerElement {
  static get properties() {
    return {
      /**
       * ポートオブジェクト。I2C制御機器へ渡す値
       */
      port: {
        type: Object,
        notify: true
      },

      /**
       * I2Cポート番号。CHIRIMEN for Raspberry Piで利用可能なものは1だけなので、その場合は省略可能
       */
      i2c: {
        type: Number,
        value: 1
      }
    };
  }

  ready() {
    super.ready();
    navigator.requestI2CAccess().then(function (i2cAccess) {
      this.port = i2cAccess.ports.get(1);
      console.log('WebI2C init');
    }.bind(this)).catch(e => console.error('error', e));
  }

}

window.customElements.define('web-i2c', WebI2C);