
function concatenateFloat32Arrays(arrays: Float32Array[]): Float32Array {
  const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
  const result = new Float32Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

// This function would play audio in a real implementation
// For this demo, we're simulating audio playback
export const playAudio = (audioId: string): void => {
  console.log(`Playing audio: ${audioId}`);
  
  // In a real implementation, this would be something like:
  // const audio = new Audio(audioUrl);
  // audio.play();
  
  // For now, we'll just simulate audio feedback
  const audio = new Audio();
  
  // Use browser-provided notification sounds if available
  if (audioId === 'success') {
    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLXOw3PSvYBMOQpXP8tiJNwgZSpfO+N9/LQUdTpPH+ud6Jg0pUoD84YM3GRZMbu/wfioTKkt8/fd8GxFGdv7veCAVNFSH//F8JRFQePn0giwMSHn/9ntMHU2E//JpIQxNj//mZEMTTZ3uuY1LDEyY/cWZdTEhSK19LiRQo/zXfyN4rPLii1Li6/OsYjL88/23dzH7+vuyZyyh0NpeJPz/+8+fYzv7+P28dkCpv8JfRfj89e2jbEn78vnDfE2vrqlXU/j488OaZlL4+PfGfVaxtJxPaPr19sed7vn/3rKRbLKkk1x1/vLvrJv/9v7ssJHosqlxlv3u97Ov/fX77binzr6xk6L57/a0tf72/Ou5rMPHtpOq/e34tsD9+f3ru7DFybiVrv3v+bfE/vr97byx0Me8mbL88fu4yP/8/u61tMnMvpyz/fH8u8z//v7vt7bO0cCdtv3y/L3P//7/8Li50dLBn7j+8v2/0v7+//G6u9XUwqC6/vP+wdX+/v/yvb7X1sShvP71/sPY/v//9L/A2NjGo77/9v7E2v7///XAwdrbyKXA//j+xdz+/v/3wcPd3cmmwv/5/sbd/v7/+MLF39/Lp8T/+v7I3v7+//rDx+DgzKnG//v+yd/+/v/8xMnh4s2qyP/8/svh/v7//cbM5OPPq8r//P7L4v7+//7Hzubk0KzM//3+zOP+/v//yc/n5tGuzv/9/s3k/v///8rR6OjSr9D//v7P5f7/+//L0+rq07DS//7+0Of+/vv/zdXs69Sx0///9NDo/v77/87X7e3Vs9X//vTS6f79+//Q2e/u1rTV//711On+/fr/0dvy8ti11v//9tXq/v36/9Pd8/PZuNf///jV6/789//U3/X12bnY///51ez++/f/1uH399q72f//+tbt/vv3/9fj+fjcvNv///zW7v769//Y5fr63b3c///+1+/++fb/2uf8+96+3f///tjw/vn2/9zp/f3fv97////Z8f749//d6v7+4MDf///+2vL++Pb/3+z//+HB4f///tvz/vj2/+Du///jwuL////c9P739f/h7///5MPj////3vX+9/X/4/D//+XD5P///9/2/vb1/+Tx///nxOX////h9/715P/l8v//6MXm////4vj+9eT/5/P//+rG5////+P5/vTk/+j0///rx+j////l+v7z5P/q9f//7Mjp////5vv+8+T/6/b//+3J6v///+j8/vPk/+z3///uyuv////p/f7y5P/u+P//8Mvs////6/7+8eT/7/n///HM7f///+z//vHk//D6///yzO7////t//7w5P/x+////c3v/////v7w5P/y+////c7w/////v7v5P/z+////s/x///////v5P/0+////tDy///////u5f/1+////9Hz///////u5f/2+////9L0///////u5f/3+////9P0///////u5P/4+////9T1///////u5P/5+////9X2///////u5P/6+////9b3///////u5P/7+////9f3///////t5f/8+////9j4///////t5f/9+////9n5///////s5v/+/P///9v6///////s5v///P///9z7///////r5v///P///9z7///////r5v///P///937///////q5/////7//97+///////q5/////7//9/+///////p5/////////+A/////////+nn//////////+B/////////+jo//////////+C/////////+jo//////////+D/////////+jp//////////+E/////////+jp//////////+F/////////+jq//////////+G/////////+jq//////////+H/////////+jq//////////+I//////////g=';
  } else if (audioId === 'error') {
    audio.src = 'data:audio/wav;base64,UklGRvwFAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YdgFAACAgICAgICAgICAgICAgICAgICAgICAgIB4eHh4eHh4eH5+fn5+fn5+foCAgJmZmZmZmZmZfn5+fn5+fn5+eHh4eICAgICAeHh4eHhwcHBwcHBwcGBgYGCAgICAgICAgICAgICAgICAgGB4eHh4eHh4eHh4eHh4eHh4eHh4eHBwcHh4eHh4eHh4eHh4eHh4eHCIiIiIiIiIiIiIiIiIiIiIiIiIiHh4eHh4eHh4eHh4eHh4eHh4eIiIiIiIiIiIiIiAiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIgIiAiICAgICAgICAgICAgICAgICAgICAgICYmJiYmJiYmJiYmJiYmJiYiJiImIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiImIiYiJiImIiYiJiQkJCQkJCQmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkIiQiJCIkJCQkKioqKioqKioqKioqKioqKioqKioqKioqKioqKiomKiYqJiomKiYqJiYmJiYmJiYmJiYkJiQmJCYmJiYmKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiYqJiomKiYqJiomKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqLiorKisqKyorKisqKyorKisqKyorKisqKyorKisqKyorLCssKywrLCwsLCwsLCwsLCwsLCwsKyorKisqKyorKioqKioqKioqKioqKioqKioqKiwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsKywrLCssKywrLCwsLDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8LDwsPCw8LDwsPDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhISEhISEhISEhISEhISEhISEhISEhISEhISEhISDg4ODg4ODgw=';
  } else {
    // Default sound or utterance for phrase recognition
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = "Sample phrase for recognition";
    utterance.lang = 'en-US';
    utterance.volume = 1;
    utterance.rate = 0.8;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }
};

// Function to speak text aloud
export const speakText = (text: string, language: 'en' | 'hi'): void => {
  if (!window.speechSynthesis) {
    console.error('Speech synthesis not supported');
    return;
  }

  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  utterance.lang = language === 'en' ? 'en-US' : 'hi-IN';
  utterance.volume = 1;
  utterance.rate = 0.8;
  utterance.pitch = 1;
  
  window.speechSynthesis.speak(utterance);
};
