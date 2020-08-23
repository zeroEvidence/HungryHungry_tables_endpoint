// contains strings which are particular to this software instance.
export class Instance {
  public hungryhungryJBBRUri: string;
  public hungryhungryQRTableUri: string;

  constructor() {
    // the URL for the HungryHungry's tables data.
    this.hungryhungryJBBRUri =
      "https://hungryhungry.com/helping-hospo/hh_test_tabledata.json";
    // the URL to be encoded into the QR code images.
    this.hungryhungryQRTableUri =
      "https://dev.hungryhungry.com/oceana2/menu?locationID=1995257&tableID=:tableID:";
  }
}
