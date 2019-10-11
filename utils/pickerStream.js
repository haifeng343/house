import * as rxjs from "./rx.js";

let PickerStream = null;

const getPickerStream = () => {
  if (!PickerStream) {
    PickerStream = {
      dateStream: new rxjs.BehaviorSubject([]),

      selectStream: new rxjs.BehaviorSubject(),

      scrollStream: new rxjs.BehaviorSubject(0),

      itemHeightStream: new rxjs.BehaviorSubject(0),

      pickerStream: new rxjs.BehaviorSubject([]),
    }
  }

  return PickerStream

}

const destoryPickerStream = () => {
  if (!PickerStream) {
    return;
  }
  const {
    scrollStream,
    itemHeightStream,
    dateStream,
    selectStream,
    pickerStream
  } = PickerStream;
  scrollStream.complete();
  itemHeightStream.complete();
  dateStream.complete();
  selectStream.complete();
  pickerStream.complete();
  PickerStream = null;
}

export {
  getPickerStream,
  destoryPickerStream
}