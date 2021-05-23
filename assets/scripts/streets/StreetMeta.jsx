import './StreetMeta.scss'

import React from 'react'
import StreetMetaAnalytics from './StreetMetaAnalytics'
import StreetMetaAuthor from './StreetMetaAuthor'
import StreetMetaDate from './StreetMetaDate'
import StreetMetaGeotag from './StreetMetaGeotag'
import StreetMetaWidthContainer from './StreetMetaWidthContainer'
import { useSelector } from 'react-redux'

function StreetMeta (props) {
  const enableAnalytics = useSelector(
    (state) => (state.flags.ANALYTICS && state.flags.ANALYTICS.value) || false
  )

  return (
    <div className="street-metadata">
      <StreetMetaWidthContainer />
      {enableAnalytics && <StreetMetaAnalytics />}
      {/* <StreetMetaGeotag /> */}
      <StreetMetaAuthor />
      <StreetMetaDate />
    </div>
  )
}

export default StreetMeta
