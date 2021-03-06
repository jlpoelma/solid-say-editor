import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { FOAF, VCARD } from "solid-addon/utils/namespaces";

/**
 * Component responsible for rendering the name and profile picture of the logged-in user.
 *
 * @module editor-say-solid-plugin
 * @class ProfileHeaderComponent
 * @extends Ember.Component
 */
export default class ProfileHeaderComponent extends Component {
    @service rdfaCommunicator;
    @service profile;
  
    /**
     * Retrieves the profile-picture from the logged-in user from the local store
     *
     * @method profilePicture
     *
     * @returns {string} profile-picture-link
     * @public
    */
    get profilePicture(){
        const picture =  this.rdfaCommunicator.store.any(this.profile.me, VCARD("hasPhoto"), undefined);
        if(picture){
            return picture.value;
        }
    }

    /**
     * Retrieves the name from the logged-in user from the local store
     *
     * @method profilePicture
     *
     * @returns {string} name
     * @public
    */
    get name(){
        const name =  this.rdfaCommunicator.store.any(this.profile.me, FOAF("name"), undefined);
        if(name) return name.value;
    }
  }