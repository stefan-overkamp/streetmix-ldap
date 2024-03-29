import './MenuBar.scss'

import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AvatarMenu from './AvatarMenu'
import EnvironmentBadge from './EnvironmentBadge'
import MenuBarItem from './MenuBarItem'
import PropTypes from 'prop-types'
import SignInButton from './SignInButton'
import { doSignIn } from '../users/authentication'
import logo from '../../images/logo_horizontal.svg'
import { showDialog } from '../store/slices/dialogs'

MenuBar.propTypes = {
  onMenuDropdownClick: PropTypes.func.isRequired
}

function MenuBar (props) {
  const user = useSelector((state) => state.user.signInData?.details || null)
  const offline = useSelector((state) => state.system.offline)
  const upgradeFunnel = useSelector(
    (state) => state.flags.BUSINESS_PLAN.value || false
  )
  const dispatch = useDispatch()
  const menuBarRightEl = useRef(null)

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)

    // StreetNameplateContainer needs to know the left position of the right
    // menu bar when it's mounted
    window.addEventListener('stmx:streetnameplate_mounted', handleWindowResize)

    // Clean up event listeners
    return () => {
      window.removeEventListener('resize', handleWindowResize)
      window.removeEventListener(
        'stmx:streetnameplate_mounted',
        handleWindowResize
      )
    }
  })

  /**
   * Handles clicks on <button> elements which result in a dropdown menu.
   * Pass in the name of this menu, and it returns (curries) a function
   * that handles the event.
   */
  function handleClickMenuButton (menu) {
    return (event) => {
      const el = event.target.closest('button')
      props.onMenuDropdownClick(menu, el)
    }
  }

  function handleClickUpgrade (event) {
    event.preventDefault()
    dispatch(showDialog('UPGRADE'))
  }

  function handleWindowResize () {
    // Throw this event so that the StreetName can figure out if it needs
    // to push itself lower than the menubar
    window.dispatchEvent(
      new CustomEvent('stmx:menu_bar_resized', {
        detail: {
          rightMenuBarLeftPos: menuBarRightEl.current.getBoundingClientRect()
            .left
        }
      })
    )
  }

  function renderUserAvatar (user) {
    return user ? (
      <li>
        <AvatarMenu user={user} onClick={handleClickMenuButton('identity')} />
      </li>
    ) : (
      <li>
        <SignInButton onClick={doSignIn} />
      </li>
    )
  }

  return (
    <nav className="menu-bar">
      <ul className="menu-bar-left">
        <li className="menu-bar-title">
          <img src={logo} alt="Streemix" className="menu-bar-logo" />
          <h1>Streetmix</h1>
        </li>
        <MenuBarItem
          label="Help"
          translation="menu.item.help"
          onClick={handleClickMenuButton('help')}
        />
        {!offline && (
          <>
            <MenuBarItem
              label="Contact"
              translation="menu.item.contact"
              onClick={handleClickMenuButton('contact')}
            />
            {upgradeFunnel ? (
              <MenuBarItem
                url="#"
                label="Upgrade"
                translation="menu.upgrade"
                onClick={handleClickUpgrade}
              />
            ) : (
              <MenuBarItem
                label="Donate"
                translation="menu.contribute.donate"
                url="https://opencollective.com/streetmix/"
              />
            )}
          </>
        )}
      </ul>
      <ul className="menu-bar-right" ref={menuBarRightEl}>
        <MenuBarItem
          label="New street"
          translation="menu.item.new-street"
          url="/new"
          target="_blank"
        />
        <MenuBarItem
          label="Settings"
          translation="menu.item.settings"
          onClick={handleClickMenuButton('settings')}
        />
        <MenuBarItem
          label="Share"
          translation="menu.item.share"
          onClick={handleClickMenuButton('share')}
        />
        {!offline && renderUserAvatar(user)}
      </ul>
      <EnvironmentBadge />
    </nav>
  )
}

export default MenuBar
