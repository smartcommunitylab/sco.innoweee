export class ItemClassification {
    playerId:string;
    itemId:string;
    itemType:any;
    itemValue:any;
    switchingOn:boolean;
    broken:boolean;
    age:number;
    
    setItemId(id){
        this.itemId=id;
    }
    getItemId(){
        return this.itemId;
    }
    setPlayerId(id){
        this.playerId=id;
    }
    getPlayerId(){
        return this.playerId;
    }
    setItemType(type){
        this.itemType=type;
    }
    getItemType(){
        return this.itemType;
    }
    setItemValue(value){
        this.itemValue=value;
    }
    getItemValue(){
        return this.itemValue;
    }
    setSwitchingOn(switchingOn){
        this.switchingOn=switchingOn;
    }
    getSwitchingOn(){
        return this.switchingOn;
    }
    setBroken(broken){
        this.broken=broken;
    }
    getBroken(){
        return this.broken;
    }
    setAge(age){
        this.age=age;
    }
    getAge(){
        return this.age;
    }

}
