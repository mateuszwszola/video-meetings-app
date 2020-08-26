const mediaConstraints = {
  audio: true,
  video: true,
};

export function openUserMedia() {
  return window.navigator.mediaDevices.getUserMedia(mediaConstraints);
}
