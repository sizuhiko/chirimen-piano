import {WebI2cSensorElement} from './web-i2c-sensor-element.js';

/**
 * GroveTouch
 * 
 * @example 
 * 
 * <web-i2c>
 *  <grove-touch slave-address="0x5a" value="{{_touches}}"></grove-touch>
 * </web-i2c>
 * 
 * @customElement
 * @polymer
 */
class GroveTouch extends WebI2cSensorElement {
  async init() {
    this._autoRead = true;
    await this._i2cSlave.write8(0x2b,0x01);
    await this._i2cSlave.write8(0x2c,0x01);
    await this._i2cSlave.write8(0x2d,0x01);
    await this._i2cSlave.write8(0x2e,0x01);
    await this._i2cSlave.write8(0x2f,0x01);
    await this._i2cSlave.write8(0x30,0x01);
    await this._i2cSlave.write8(0x31,0xff);
    await this._i2cSlave.write8(0x32,0x02);
    for(var i=0;i<12*2;i+=2){
      // console.log(i);
      var address = 0x41+i;
      // console.log(address);
      await this._i2cSlave.write8(address,0x0f);
      await this._i2cSlave.write8(address+1,0x0a);
    }
    await this._i2cSlave.write8(0x5d,0x04);
    await this._i2cSlave.write8(0x5e,0x0c);
  }
    
  async read() {
    const value = await this._i2cSlave.read16(0x00);
    // console.log(value);
    var array = [];
    for(var cnt = 0; cnt < 12; cnt ++){
      array.push(((value & (1 << cnt)) != 0)?true:false);
    }
    if (!this.value || (JSON.stringify(array) != JSON.stringify(this.value))) {
      this._setValue(array);
    }
  }
}

window.customElements.define('grove-touch', GroveTouch);
