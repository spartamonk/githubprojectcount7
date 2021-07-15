import React, { useState, useEffect } from 'react'
import mockUser from '../context/mockData.js/mockUser'
import mockRepos from '../context/mockData.js/mockRepos'
import mockFollowers from '../context/mockData.js/mockFollowers'
import axios from 'axios'

const rootUrl = 'https://api.github.com'

const useFetch = () => {
  const [githubUser, setGithubUser] = useState(mockUser)
  const [followers, setFollowers] = useState(mockFollowers)
  const [repos, setRepos] = useState(mockRepos)
  const [requestsRemaining, setRequestsRemaining] = useState(0)
  const [error, setError] = useState({
    isError: false,
    errorMsg: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState('')
  //handleChange
  const handleChange = (e) => {
    setUser(e.target.value)
  }

  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then((response) => {
        let { remaining } = response.data.rate
        setRequestsRemaining(remaining)
        if (remaining === 0) {
          toggleError(true, 'you have used all your hourly requests rate')
        }
      })
      .catch((error) => console.log(error))
  }

  //toggle error

  const toggleError = (isError = false, errorMsg = '') => {
    setError({
      isError,
      errorMsg,
    })
  }
  useEffect(checkRequests, [])
  const fetchUser = async () => {
    setIsLoading(true)
    toggleError()
    const response = await axios(`${rootUrl}/users/${user}`).catch((error) =>
      console.log(error)
    )
    if (response) {
      const { data } = response
      setGithubUser(data)
      const { login, followers_url } = data
      // axios(`${followers_url}?per_page=100`)
      //   .then((response) => {
      //     const { data } = response
      //     setFollowers(data)
      //   })
      //   .catch((error) => console.log(error))
      // axios(`${rootUrl}/users/${login}/repos?per_page=100`)
      //   .then((response) => {
      //     const { data } = response
      //     setRepos(data)
      //   })
      //   .catch((error) => console.log(error))

      await Promise.allSettled([
        axios(`${followers_url}?per_page=100`),
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
      ]).then(([followers, repos])=> {
       const status = 'fulfilled'
       if(followers.status === status) {
        setFollowers(followers.value.data)
       }
       if(repos.status === status) {
        setRepos(repos.value.data)
       }
      }).catch(error=> console.log(error))
    } else {
      toggleError(true, 'There Is No User With That Username')
    }
    setIsLoading(false)
    checkRequests()
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (user) {
      fetchUser()
    }
  }
  return {
    requestsRemaining,
    setRequestsRemaining,
    ...error,
    isLoading,
    user,
    handleChange,
    handleSubmit,
    githubUser,
    followers,
    repos,
  }
}

export default useFetch
