const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
let localStream;
let remoteStream;
let localVideo = document.getElementById('localVideo');
let remoteVideo = document.getElementById('remoteVideo');
let myPeerId; // تعريف المعرف الخاص بك
const peer = new Peer();

startButton.addEventListener('click', startChat);
stopButton.addEventListener('click', stopChat);

const webrtc = new SimpleWebRTC({
    localVideoEl: 'localVideo',
    remoteVideoEl: 'remoteVideo',
    autoRequestMedia: true, // طلب تصريح الوصول إلى الوسائط تلقائيًا
});

webrtc.on('readyToCall', function () {
    startButton.disabled = false; // تمكين زر البدء عندما يكون النظام جاهزًا
});

peer.on('open', function (id) {
    myPeerId = id;
    console.log('My peer ID is: ' + myPeerId);
});

async function startChat() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); // الحصول على تصريح لاستخدام الكاميرا والميكروفون
        webrtc.startLocalVideo(); // بدء تشغيل الفيديو المحلي

        // الانضمام إلى غرفة الدردشة
        webrtc.joinRoom(myPeerId); // استخدام المعرف الذي تم تعيينه بشكل برمجي

    } catch (error) {
        console.error('Error starting chat:', error);
    }
}

function stopChat() {
    webrtc.leaveRoom(); // مغادرة الغرفة
    webrtc.stopLocalVideo(); // إيقاف تشغيل الفيديو المحلي
}
