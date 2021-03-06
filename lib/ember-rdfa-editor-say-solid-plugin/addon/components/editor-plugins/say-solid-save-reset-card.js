import { action } from '@ember/object';
import Component from '@glimmer/component';
import { getOwner } from "@ember/application";
import { inject as service } from '@ember/service';
import { SAVE_RESET_KEY } from '../../utils/block-handlers/save-reset-block-handler';

/**
 * Card providing the option to save data to your solid-account, and overwriting data in the editor with data from solid.
 * This card both renders a save- and reset-button
 * @module editor-say-solid-plugin
 * @class SaySolidSaveResetCard
 * @extends Ember.Component
 */
export default class SaySolidSaveResetCard extends Component {
  @service profile;
  @service rdfaCommunicator;
  owner = getOwner(this);


  /**
   * Saves data to Solid using the persist-method, and then closes the card
   *
   * @method save
   *
   * @public
   */
  @action
  async save() {
    await this.rdfaCommunicator.persist();
    this.owner.lookup(SAVE_RESET_KEY).handleClose(this.args.info, null);
  }

  /**
   * Returns a list of triples, coming from solid, that were edited in the editor.
   *
   * @method changes
   *
   * @returns {Array} array of triples that were edited
   * @public
   */
  get changes() {
    return this.rdfaCommunicator.insertCache;
  }

   /**
   * Method responsible for resetting the changed rdfa-contexts to their original values, coming from solid.
   *
   * @method reset
   *
   * @public
   */
  @action
  async reset() {
    const info = this.args.info;
    // reset the data in the local rdflib-store
    const cache = await this.rdfaCommunicator.reset();
    const editor = info.editor;

    // Iterates over every triple that was changed
    for (let triple of cache) {
      // selection contains the rdfa-contexts that need to be reset
      const selection = editor.selectContext(info.location, { resource: triple.subject.value, property: triple.predicate.value });
      // fetch the triples that contain the original data of the edited triples
      let attributeObj = {}; 
      attributeObj[triple.predicate.value] = triple.predicate
      
      const reloadedTriple = await this.rdfaCommunicator.fetchTriples(triple.subject, attributeObj);
      if (reloadedTriple) {
        // update the corresponding rdfa-context with the original value of the triple
        editor.update(selection, {
          set: {
            property: triple.predicate.value,
            innerHTML: reloadedTriple[0].object.value
          },

        })
      }
    }
    // when finished, close the reset-save card
    this.owner.lookup(SAVE_RESET_KEY).handleClose(this.args.info);

  }
}
