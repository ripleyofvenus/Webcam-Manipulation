'use strict'

const video = document.querySelector('.player')
const canvas = document.querySelector('.photo')
const ctx = canvas.getContext('2d')
const strip = document.querySelector('.strip')
const snap = document.querySelector('.snap')

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      // console.log(localMediaStream)
      video.src = window.URL.createObjectURL(localMediaStream)
      video.play()
    })
    .catch(err => {
      // console.error(`OH NOSIES`, err)
    })
}

function paintToCanvas() {
  const width = video.videoWidth
  const height = video.videoHeight
  console.log(width, height)
  canvas.width = width
  canvas.height = height

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height)
    // remove pixels
    let pixels = ctx.getImageData(0, 0, width, height)
    // alter pixels

    // red screen effect on image
    // pixels = redEffect(pixels)

    // rgb split of pixels
    // pixels = rgbSplit(pixels)

    // green screen pixels
    // pixels = greenScreen(pixels)
    
    // put pixels back
    ctx.putImageData(pixels, 0, 0)
  }, 16)
}

function takePhoto() {
  snap.currentTime = 0
  snap.play()

  const data = canvas.toDataURL('image/jpeg')
  const link = document.createElement('a')
  link.href = data
  link.setAttribute('download', 'WorkTheCamera')
  link.innerHTML = `<img src="${data}" alt="Pose"/>`
  strip.insertBefore(link, strip.firstChild)
}

function redEffect(pixels) {
  for (let i=0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100 // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50 // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5 // BLUE
  }
  return pixels
}

function rgbSplit(pixels) {
  for (let i=0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0] // RED
    pixels.data[i + 100] = pixels.data[i + 1] // GREEN
    pixels.data[i - 150] = pixels.data[i + 2] // BLUE
  }
  return pixels
}

function greenScreen(pixels) {
  const levels = {}
  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value
  })

    for (let i=0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0]
      green = pixels.data[i + 1]
      blue = pixels.data[i + 2]
      alpha = pixels.data[i + 3]

    if (red >= levels.rmin && green >= levels.gmin && blue >= levels.bmin && red <= levels.rmax && green <= levels.gmax && blue <= levels.bmax) {
      pixels.data[i + 3] = 0
    }
}

getVideo()

video.addEventListener('canplay', paintToCanvas)
