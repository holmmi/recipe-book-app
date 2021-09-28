const getFileSuffix = (fileUri) => {
  const regex = /(\..+)$/
  if (regex.test(fileUri)) {
    return regex.exec(fileUri)[0]
  }
  return null
}

const getFileMimeType = (fileUri) => {
  const suffix = getFileSuffix(fileUri)
  if (suffix.endsWith('jpg') || suffix.endsWith('jpeg')) {
    return 'image/jpeg'
  } else if (suffix.endsWith('png')) {
    return 'image/png'
  } else if (suffix.endsWith('gif')) {
    return 'image/gif'
  }
  return null
}

export { getFileSuffix, getFileMimeType }
