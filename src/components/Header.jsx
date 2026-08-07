import React from 'react'
import logo from '../assets/images/logo.png'

export function Header() {
  return (
    <header className="topbar">
      <a className="brand" href="/" aria-label="SportSee accueil">
        <img src={logo} alt="" />
        <span>SportSee</span>
      </a>
      <nav className="main-nav" aria-label="Navigation principale">
        <a href="/">Accueil</a>
        <a href="/">Profil</a>
        <a href="/">Réglage</a>
        <a href="/">Communauté</a>
      </nav>
    </header>
  )
}
