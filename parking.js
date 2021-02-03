const queue = require("./priorityQueue");
const fs = require("fs");

function createParkingLot(capacity) {
  if (!capacity) throw "please specify the capacity";
  const parkingQueue = new queue(capacity);
  while (parkingQueue.size < parkingQueue.capacity) {
    parkingQueue.insert(parkingQueue.size + 1);
  }
  const colorToCarNoMapping = {}; // objects of objects { white :{   }}
  const carNoToSlotMaping = {}; // {carno : slotno}
  const slotToCarNo = {};

  return {
    park: function (carNo, color) {
      if (!(carNo && color)) throw "provide car no. and color to park";
      // console.log("park", arguments);
      const slot = parkingQueue.extractMin();
      if (slot == -1) {
        return "Sorry, parking lot is full";
      }
      carNoToSlotMaping[carNo] = slot;
      if (!colorToCarNoMapping[color]) {
        colorToCarNoMapping[color] = {};
      }
      colorToCarNoMapping[color][carNo] = true;
      slotToCarNo[slot] = {
        no: carNo,
        color: color,
      };
      // console.log(slotToCarNo);
      return `Allocated slot number: ${slot}`;
    },
    leave: function (slotNo) {
      if (!slotNo) {
        throw "please provide praking slot";
      }
      if (slotNo > parkingQueue.capacity) throw "invalid car slot";
      const car = slotToCarNo[slotNo];
      if (!car) {
        throw "car slot empty";
      }
      delete slotToCarNo[slotNo];
      delete colorToCarNoMapping[car.color][car.no];
      delete carNoToSlotMaping[car.no];
      parkingQueue.insert(parseInt(slotNo));
      return `slot number: ${slotNo} free`;
    },
    registration_numbers_for_cars_with_colour: function (color) {
      if (!color) throw "provide color to get all registration number";

      return Object.keys(colorToCarNoMapping[color]).join(", ");
    },
    slot_numbers_for_cars_with_colour: function (color) {
      if (!color) throw "provide color to get all slots";
      const slotArr = [];
      for (const car in colorToCarNoMapping[color]) {
        // const no = colorToCarNoMapping[color][car];
        slotArr.push(carNoToSlotMaping[car]);
      }
      return slotArr.join(", ");
    },
    slot_number_for_registration_number: function (carNo) {
      if (!carNo) throw "provide carNo to get all slots";

      return (
        (carNoToSlotMaping[carNo] && carNoToSlotMaping[carNo]) || "Not found"
      );
    },
    status: function () {
      // console.log(status);
      let str = "";
      for (let obj in slotToCarNo) {
        str += `${obj} ${slotToCarNo[obj].no} ${slotToCarNo[obj].color}`;
      }
      return str;
    },
  };
}

module.exports = createParkingLot;
