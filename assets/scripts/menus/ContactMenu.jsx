import ExternalLink from '../ui/ExternalLink'
import { FormattedMessage } from 'react-intl'
import Icon from '../ui/Icon'
import Menu from './Menu'
import React from 'react'
import { showDialog } from '../store/slices/dialogs'
import { useDispatch } from 'react-redux'

function ContactMenu (props) {
  const dispatch = useDispatch()

  return (
    <Menu {...props}>
      <ExternalLink href="https://github.com/stefan-overkamp/streetmix-ldap/">
        <Icon icon="github" />
        <FormattedMessage
          id="menu.contact.github"
          defaultMessage="View source code on GitHub"
        />
      </ExternalLink>

    </Menu>
  )
}

export default React.memo(ContactMenu)
