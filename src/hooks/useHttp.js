import { useState, useEffect } from 'react'

/**
 *
 * @param {url to fetch data from} url
 * @param {* decide when to fetch data again} dependencies
 */
const useHttp = (url, dependencies) => {
  const [isLoading, setIsLoading] = useState(false)
  // the init state of fetchedData is null because we don't know in advance the data type of fetchedData
  // it can be array [] or object {}
  const [fetchedData, setFetchedData] = useState(null)

  console.log('Sending Http request to url ' + url)

  // start fetching data
  useEffect(() => {
    setIsLoading(true)
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Could not fetch person!')
        }
        return response.json()
      })
      .then(fetchedData => {
        setFetchedData(fetchedData)
        setIsLoading(false)
      })
      .catch(err => {
        setIsLoading(false)
        console.error(err)
      })
  }, dependencies)

  // let caller know the current state of loading  (true/false), and fetchedData
  return [isLoading, fetchedData]
}

export default useHttp
