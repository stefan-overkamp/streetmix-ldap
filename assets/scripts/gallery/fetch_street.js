import { ERRORS, showError } from '../app/errors'
import { SAVE_THUMBNAIL_EVENTS, saveStreetThumbnail } from '../streets/image'
import { hideBlockingShield, showBlockingShield } from '../app/blocking_shield'
import { setIgnoreStreetChanges, setLastStreet } from '../streets/data_model'

import { API_URL } from '../app/config'
import { hideError } from '../store/slices/errors'
import { resetMapState } from '../store/slices/map'
import { segmentsChanged } from '../segments/view'
import store from '../store'
import { unpackServerStreetData } from '../streets/xhr'

let lastRequestedStreetId = null

export function fetchGalleryStreet (streetId) {
  showBlockingShield()

  lastRequestedStreetId = streetId

  const url = API_URL + 'v1/streets/' + streetId

  window
    .fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw response
      }
      return response.json()
    })
    .then(function (data) {
      hideBlockingShield()
      return data
    })
    .then(receiveGalleryStreet)
    .catch(errorReceiveGalleryStreet)
}

function errorReceiveGalleryStreet (err) {
  console.log('errorReceiveGalleryStreet', err)
  showError(ERRORS.GALLERY_STREET_FAILURE, false)
  // updateGallerySelection()
}

// TODO similar to receiveLastStreet
function receiveGalleryStreet (transmission) {
  // Reject stale transmissions
  if (transmission.id !== lastRequestedStreetId) {
    return
  }

  setIgnoreStreetChanges(true)

  store.dispatch(hideError())
  unpackServerStreetData(transmission, null, null, true)

  // Some parts of the UI need to know this happened to respond to it
  window.dispatchEvent(new window.CustomEvent('stmx:receive_gallery_street'))

  segmentsChanged()

  setIgnoreStreetChanges(false)
  setLastStreet()

  // Save new street's thumbnail.
  saveStreetThumbnail(store.getState().street, SAVE_THUMBNAIL_EVENTS.INITIAL)

  store.dispatch(resetMapState())
}
