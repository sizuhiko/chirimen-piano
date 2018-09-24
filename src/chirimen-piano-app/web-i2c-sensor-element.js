import {PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * WebI2cSensorElement
 * 
 * @customElement
 * @polymer
 * @see [Web I2C API Specification](https://rawgit.com/browserobo/WebI2C/master/index.html)
 */
export class WebI2cSensorElement extends PolymerElement {
  static get properties() {
    return {
      /**
       * I2C Port Object
       */
      port: Object,
      /**
       * I2C Slave Address
       */
      slaveAddress: Number,
      /**
       * Value Object
       */
      value: {
        type: Object,
        notify: true,
      },
      /**
       * Interval for reading value (milliseconds)
       */
      interval: {
        type: Number,
        value: 100
      },
      /**
       * Read flag.
       * If extends sensor class is readable, should be set true in `init` function.
       */
      _autoRead: {
        type: Boolean,
        value: false
      },
      /**
       * I2C Slave Object.
       * It will set after opening I2C port
       */
      _i2cSlave: Object
    };
  }
  static get observers() {
    return [
      '_init(port, slaveAddress)'
    ];
  }
  /**
   * Initialize I2C port
   *
   * The function will be call if value of port and slaveAddress changed.
   * Call `init` function when open i2c port successfully
   */
  _init() {
    if (!this.port || !this.slaveAddress) return;

    this.port.open(this.slaveAddress).then(async (i2cSlave) => {
      this._i2cSlave = i2cSlave;
      await this.init();
      if (this._autoRead) {
        this._read();
      }
    });
  }

  /**
   * Controller for reading I2C value
   *
   * Starting when open i2c port successfully
   * Call a `read` function to read a value at specified intervals
   */
  _read() {
    setInterval(async () => {
      if(this._i2cSlave == null){
        console.error("i2cSlave Address does'nt yet open!");
      }else{
        await this.read();
      }
    }, this.interval);
  }
  
  /**
   * Set sensor value
   *
   * This method change value and notify changes as `value-changed` event.
   */
  _setValue(value) {
    this.set('value', value);
  }

  /**
   * Initialize I2C Slave device.
   *
   * @abstract
   * @async
   */
  async init() {
    throw new Error('Not Implemented');
  }
  
  /**
   * Read value from I2C Slave device.
   *
   * @async
   */
  async read() {
    if (this._autoRead) {
      throw new Error('Not Implemented');
    }
  }

}
