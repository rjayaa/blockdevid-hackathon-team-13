import React from 'react'

const Layout = ({children}: React.PropsWithChildren) => {
  return (
    <div className='pt-24'>
      {children}
    </div>
  )
}

export default Layout
