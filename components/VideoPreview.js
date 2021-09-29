import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Video } from 'expo-av'

const VideoPreview = ({ uri }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  const onPlaybackStatusUpdate = (playbackObject) => {
    if (playbackObject.isLoaded && !isLoaded) {
      setIsLoaded(true)
    }
  }

  return (
    <Video
      source={{ uri }}
      isLooping
      isMuted
      shouldPlay={isLoaded}
      onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      style={styles.video}
    />
  )
}

const styles = StyleSheet.create({
  video: {
    width: 120,
    height: 120,
  },
})

VideoPreview.propTypes = {
  uri: PropTypes.string,
}

export default VideoPreview
