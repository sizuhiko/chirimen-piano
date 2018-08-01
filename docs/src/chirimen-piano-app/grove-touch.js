import { PolymerElement } from "../../node_modules/@polymer/polymer/polymer-element.js";
/**
 * GroveTouch
 * 
 * @example 
 * 
 * <web-i2c port="{{i2cPort}}">
 *  <grove-touch port="[[_i2cPort]]" slave-address="0x5a" channel="{{_touches}}"></grove-touch>
 * </web-i2c>
 * 
 * @customElement
 * @polymer
 */

class GroveTouch extends PolymerElement {
  static get properties() {
    return {
      /**
       * I2Cポートオブジェクト
       */
      port: Object,

      /**
       * I2Cスレーブアドレス
       */
      slaveAddress: Number,

      /**
       * タッチセンサーの状態
       * 8個のboolean値が入った配列
       */
      channel: {
        type: Array,
        notify: true
      },

      /**
       * タッチセンサーの値を読み取る間隔（ミリ秒）
       */
      interval: {
        type: Number,
        value: 100
      }
    };
  }

  static get observers() {
    return ['init(port, slaveAddress)'];
  }

  init() {
    if (!this.port || !this.slaveAddress) return;
    this.port.open(this.slaveAddress).then(async i2cSlave => {
      await i2cSlave.write8(0x2b, 0x01);
      await i2cSlave.write8(0x2c, 0x01);
      await i2cSlave.write8(0x2d, 0x01);
      await i2cSlave.write8(0x2e, 0x01);
      await i2cSlave.write8(0x2f, 0x01);
      await i2cSlave.write8(0x30, 0x01);
      await i2cSlave.write8(0x31, 0xff);
      await i2cSlave.write8(0x32, 0x02);

      for (var i = 0; i < 12 * 2; i += 2) {
        // console.log(i);
        var address = 0x41 + i; // console.log(address);

        await i2cSlave.write8(address, 0x0f);
        await i2cSlave.write8(address + 1, 0x0a);
      }

      await i2cSlave.write8(0x5d, 0x04);
      await i2cSlave.write8(0x5e, 0x0c);
      this.waitAndRead(i2cSlave);
    });
  }

  waitAndRead(i2cSlave) {
    setInterval(() => {
      if (i2cSlave == null) {
        console.error("i2cSlave Address does'nt yet open!");
      } else {
        i2cSlave.read16(0x00).then(v => {
          // console.log(v);
          var array = [];

          for (var cnt = 0; cnt < 12; cnt++) {
            array.push((v & 1 << cnt) != 0 ? true : false);
          }

          if (!this.channel || JSON.stringify(array) != JSON.stringify(this.channel)) {
            this.set('channel', array);
          }
        }).catch(function (e) {
          console.error(e);
        });
      }
    }, this.interval);
  }

}

window.customElements.define('grove-touch', GroveTouch);