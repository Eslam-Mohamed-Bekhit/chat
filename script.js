const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
let localStream;
let remoteStream;
let localVideo = document.getElementById('localVideo');
let remoteVideo = document.getElementById('remoteVideo');
let peer;

startButton.addEventListener('click', startChat);
stopButton.addEventListener('click', stopChat);

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localStream = stream;
        localVideo.srcObject = localStream;
    })
    .catch(error => {
        console.error('Error accessing media devices:', error);
    });

startButton.disabled = false;

function startChat() {
    peer = new Peer(); // إنشاء كائن Peer

    // عند استلام معرف النداء الصادر من الخادم
    peer.on('call', call => {
        // قبول النداء وإرسال الفيديو المحلي
        call.answer(localStream);
        call.on('stream', remoteStream => {
            // عندما يصل فيديو من الطرف الآخر، عرضه في عنصر الفيديو البعيد
            remoteVideo.srcObject = remoteStream;
        });
    });

    // الاتصال بالخادم
    peer.on('open', id => {
        console.log('My peer ID is: ' + id);
    });
}

function stopChat() {
    // إغلاق الاتصال مع الخادم
    if (peer) {
        peer.destroy();
    }

    // إيقاف تشغيل الفيديو المحلي وإزالة تدفق الفيديو من عنصر الفيديو المحلي
    localStream.getTracks().forEach(track => track.stop());
    localVideo.srcObject = null;
}
