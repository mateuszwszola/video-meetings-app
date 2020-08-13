const mediaConstraints = {
  audio: true,
  video: true,
};

export function openUserMedia() {
  return navigator.mediaDevices.getUserMedia(mediaConstraints);
}
