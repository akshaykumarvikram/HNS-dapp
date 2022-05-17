import { Container } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'

function Subscriptions() {
  return (
    <Container maxWidth="lg">
        <Outlet />
    </Container>
  )
}

export default Subscriptions