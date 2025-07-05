import { showFormattedDate } from '../utils'
import storyItemStyle from './story-item-style'

class StoryItem extends HTMLElement {
	constructor() {
		super()
		this._shadowRoot = this.attachShadow({ mode: 'open' })
		if ('adoptedStyleSheets' in Document.prototype) {
			this._shadowRoot.adoptedStyleSheets = [storyItemStyle]
		}
	}

	set data(value) {
		this._data = value
		this.render()
	}

	render() {
		const { id, photoUrl, name, description, createdAt, lat, lon } = this._data

		this.shadowRoot.innerHTML = `
      <div class="card">
        <div class="image-container">
          <img src="${photoUrl}" alt="Image Story">
        </div>
        <div class="content">
          <div class="title">${name}</div>
          <div class="desc">${description}</div>
          <div class="meta-container">
            <div class="date">Create at: ${showFormattedDate(createdAt)}</div>
            <div class="reporter">Dibuat oleh: ${name}
          </div>
          <a class="button" href="#/story/${id}">Selengkapnya ➜</a>
        </div>
      </div>
    `
	}
}

customElements.define('story-item', StoryItem)
