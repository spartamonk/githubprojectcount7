import React, { useState, useEffect } from 'react'

import useFetch from '../fetch/useFetch'
import axios from 'axios'

const rootUrl = 'https://api.github.com'

const GithubContext = React.createContext()

const GithubProvider = ({ children }) => {
  const {
    requestsRemaining,
    isError,
    errorMsg,
    isLoading,
    user,
    handleChange,
    handleSubmit,
    githubUser,
    followers,
    repos
  } = useFetch()
  

 

  //handlesubmit
 
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        followers,
        repos,
        user,
        requestsRemaining,
        isError,
        errorMsg,
        isLoading,
        handleSubmit,
        handleChange,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}

const useGlobalContext = () => {
  return React.useContext(GithubContext)
}

export { useGlobalContext, GithubProvider }
