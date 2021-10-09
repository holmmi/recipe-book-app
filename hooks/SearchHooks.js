import { useState } from 'react'

const useSearchForm = (callback) => {
  const [inputs, setInputs] = useState({
    recipe_name: '',
    diets: '',
    ingredients: [],
    time: '',
  })

  const handleInputChange = (name, text) => {
    // console.log(name, text);
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      }
    })
  }
  return {
    handleInputChange,
    inputs,
    setInputs,
  }
}

export default useSearchForm
