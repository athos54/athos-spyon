'use babel';

import AthosSpyonView from './athos-spyon-view';
import { CompositeDisposable } from 'atom';

export default {

  athosSpyonView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.athosSpyonView = new AthosSpyonView(state.athosSpyonViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.athosSpyonView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'athos-spyon:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.athosSpyonView.destroy();
  },

  serialize() {
    return {
      athosSpyonViewState: this.athosSpyonView.serialize()
    };
  },

  toggle() {
    // comp.var.algo
    // -> spyon(comp.var,'algo')
    // -> expect(comp.var.algo).toHaveBeenCalled()

    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()

      let ultimoPunto = selection.lastIndexOf('.')
      let primeraParte = selection.substr(0,ultimoPunto)
      let ultimaParte = selection.substr(ultimoPunto+1)

      let lineaSpyon = "spyOn("+primeraParte+",'"+ultimaParte+"')"
      let lineaExpect = "expect("+selection+").toHaveBeenCalled()"
      // let lineaSpyon = "spyOn("+primeraParte
      editor.insertText(lineaSpyon+"hola", {autoIndent: true, autoIndentNewline: true})

      editor.insertText("\n")
      editor.insertText(lineaExpect, {autoIndent: true, autoIndentNewline: true})
      atom.commands.dispatch editor.element, "editor:indent"
    }
  }

};
