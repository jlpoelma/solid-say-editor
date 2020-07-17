import SemanticModel, { property, string, integer, term, solid, rdfType } from 'solid-addon/models/semantic-model';



export default class RdfaSemanticModel extends SemanticModel {


    getPredObj(attr) {
        let attrDef = this.attributeDefinitions[attr];

        let property = undefined;
        let type = undefined;
        if (attrDef.predicate) {
            property = attrDef.predicate.value;
            type = attrDef.type;
        } else {

            property = attrDef.ns(attr).value;
            type = attrDef.type;
        }

        return { property, type, value: this[attr].value ? this[attr].value : this[attr] };
    }

    generateRDFaTag({ property, type, value }) {
        let content = type === "term" ? `href="${value}"` : `content="${value}"`;


        return `<span property="${property}" ${content}/>`;
    }
    
    isRelevantContext(rdfa){
        return rdfa.find(ctxt => {
            return ctxt.object === this.rdfType.value && ctxt.subject === this.uri.value && ctxt.predicate === "a";
        });
    }

    getRelevantProperty(rdfa, subject, predicate){
        return rdfa.find(ctxt => {
            return ctxt.subject === subject && ctxt.predicate == predicate;
        });
    }

    toRDFa() {
        let start = `<span about="${this.uri}" typeof="${this.rdfType.value}">`;
        let stack = [start];
        for (let attr of this.attributes) {

            let rdfaTag = this.generateRDFaTag(this.getPredObj(attr));
            stack.push(rdfaTag);
        }

        stack.push("</span>");
        return stack.join("\n");
    }

    fromRDFa(rdfa){
        if(this.isRelevantContext(rdfa)){
            for(let attributeDef in this.attributeDefinitions){
                let predicate;
                if(this.attributeDefinitions[attributeDef].ns){
                    predicate = this.attributeDefinitions[attributeDef].ns(attributeDef).value;
                } else if (this.attributeDefinitions[attributeDef].predicate){
                    predicate = this.attributeDefinitions[attributeDef].predicate.value;
                }
                const prop = this.getRelevantProperty(rdfa, this.uri.value, predicate);
                if(prop){
                    this[attributeDef] = prop.object;
                }
            }
        }
    }
}