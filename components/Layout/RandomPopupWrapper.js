"use client"
import React, { useEffect, useState } from 'react'
import RandomMatchesPopup from '../PopUp/RandomMatchesPopup'

function RandomPopupWrapper({ children }) {
    return (
        <>
            <RandomMatchesPopup />
            {children}
        </>
    )
}

export default RandomPopupWrapper
