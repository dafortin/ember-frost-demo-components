import Ember from 'ember'
import path from 'npm:path'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import computed, {readOnly} from 'ember-computed-decorators'
import layout from './template'

export default Ember.Component.extend(PropTypeMixin, {
  tagName: 'div',
  classNameBindings: ['isFolder:folder:file', 'isCollapsed:collapsed'],
  layout,
  propTypes: {
    fileNode: PropTypes.object.isRequired,
    indentLevel: PropTypes.number,
    indentSize: PropTypes.number,
    isCollapsed: PropTypes.bool
  },

  getDefaultProps () {
    return {
      indentLevel: 0,
      indentSize: 15,
      isCollapsed: false
    }
  },

  @readOnly
  @computed('fileNode')
  isFolder (fileNode) {
    return fileNode.type === 'directory'
  },

  @readOnly
  @computed('indentLevel')
  nextIndentLevel (indentLevel) {
    return indentLevel + 1
  },

  @readOnly
  @computed('indentSize', 'indentLevel')
  indentStyle (indentSize, indentLevel) {
    return Ember.String.htmlSafe(`width: ${indentSize * indentLevel}px`)
  },

  didInsertElement () {
    this._clickHandler = () => {
      Ember.run.schedule('actions', () => {
        this.set('isCollapsed', !this.get('isCollapsed'))
      })
    }

    this.$('.file-entry').on('click', this._clickHandler)
  },

  willDestroyElement () {
    this.$('.file-entry').off('click', this._clickHandler)
  },

  actions: {
    onFileClick () {
      const entry = this.get('fileNode')
      if (entry.type !== 'directory') {
        this.sendAction('onFileClick', entry.name)
      }
    },
    onChildNodeClick (file) {
      const entryName = this.get('fileNode.name')
      this.sendAction('onFileClick', path.join(entryName, file))
    }
  }
})
