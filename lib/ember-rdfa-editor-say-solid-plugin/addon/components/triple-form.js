import Component from '@glimmer/component';
import {action} from '@ember/object'; 
import {tracked} from '@glimmer/tracking'; 

export default class TripleFormComponent extends Component {
    @tracked predicateValue;
    @tracked objectValue; 
    objectTypes = ["Literal", "Resource"]; 
    chosenType = this.objectTypes[0]; 
    
    constructor(){
        super(...arguments); 
        this.uuid = this.args.uuid; 
        this.model = this.args.model; 

        let model = this.model; 
        let uuid = this.uuid; 
        console.log(this.uuid);
        console.log(this.model);
        if(model[uuid]){
            this.predicateValue =  model[uuid].predicate; 
            this.objectValue = model[uuid].object; 
            this.chosenType = model[uuid].objType; 
        }else{
            model[uuid] = {}; 
            model[uuid]["predicate"] = this.predicateValue; 
            model[uuid]["object"] = this.objectValue; 
            model[uuid]["objType"] = this.chosenType; 
        }
    }

    @action
    updateModel(){
        let predObj = this.model[this.uuid];
        console.log(this.predicateValue);
        console.log(this.objectValue);
        predObj["predicate"] = this.predicateValue; 
        predObj["object"] = this.objectValue; 
        predObj["objType"] =  this.chosenType; 
        console.log(this.args.model);
        console.log(this.model);
    }

    @action
    chooseType(){
        this.chosenType = event.target.value; 
    }
}
