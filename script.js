const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
let localStream;
let remoteStream;
let localVideo = document.getElementById('localVideo');
let remoteVideo = document.getElementById('remoteVideo');
let remotePeerId; // تعريف متغير لمعرف النظير البعيد

startButton.addEventListener('click', startChat);
stopButton.addEventListener('click', stopChat);

const peer = new Peer(); // إنشاء عميل Peer

peer.on('open', function (id) {
    console.log('My peer ID is: ' + id);
});

peer.on('call', function (incomingCall) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(function (stream) {
            localStream = stream;
            localVideo.srcObject = stream;
            incomingCall.answer(stream); // الرد على المكالمة الواردة
            incomingCall.on('stream', function (remoteStream) {
                // عرض فيديو الطرف البعيد
                remoteVideo.srcObject = remoteStream;
            });
        })
        .catch(function (err) {
            console.error('Failed to get local stream', err);
        });
});

function startChat() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(function (stream) {
            localStream = stream;
            localVideo.srcObject = stream;
            peer.call(remotePeerId, stream); // استدعاء الطرف البعيد باستخدام معرف النظير البعيد
            peer.on('call', function (call) {
                call.answer(localStream); // الرد على المكالمة الواردة
                call.on('stream', function (remoteStream) {
                    // عرض فيديو الطرف البعيد
                    remoteVideo.srcObject = remoteStream;
                });
            });
        })
        .catch(function (err) {
            console.error('Failed to get local stream', err);
        });
}

function stopChat() {
    localStream.getTracks().forEach(track => track.stop()); // إيقاف جميع المسارات في الفيديو المحلي
}
