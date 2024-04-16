/* const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
let localStream;
let remoteStream;
let localVideo = document.getElementById('localVideo');
let remoteVideo = document.getElementById('remoteVideo');

startButton.addEventListener('click', startChat);
stopButton.addEventListener('click', stopChat);

async function startChat() {
    try {
        const constraints = { video: { width: { exact: 640 }, height: { exact: 480 } }, audio: true }; // تحديد القيود للجودة
        localStream = await navigator.mediaDevices.getUserMedia(constraints); // الحصول على تصريح لاستخدام الكاميرا والميكروفون
        localVideo.srcObject = localStream; // تعيين تدفق الوسائط المحلي إلى عنصر الفيديو
        const configuration = { audio: true, video: true }; // تكوين PeerConnection

        const peerConnection = new RTCPeerConnection(configuration); // إنشاء اتصال بين الزميلين

        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream)); // إضافة تدفقات الوسائط المحلية إلى اتصال النداء
        peerConnection.ontrack = handleRemoteStreamAdded; // التعامل مع تدفق وسائط بعيدة عند الإضافة

        const offer = await peerConnection.createOffer(); // إنشاء عرض (offer)
        await peerConnection.setLocalDescription(offer); // تعيين العرض كوصف محلي

        // قم بإرسال العرض إلى الزميل الآخر عبر وسيط الإرسال (Signaling Server)، هنا يمكن استخدام سيرفر بسيط لهذه الغاية
    } catch (error) {
        console.error('Error starting chat:', error);
    }
}

function handleRemoteStreamAdded(event) {
    remoteStream = event.streams[0]; // تعيين تدفق الوسائط البعيدة
    remoteVideo.srcObject = remoteStream; // عرض تدفق الوسائط البعيدة على عنصر الفيديو
}

function stopChat() {
    // قم بإيقاف تشغيل الاتصال وإغلاق تدفقات الوسائط
    localStream.getTracks().forEach(track => track.stop());
    remoteStream.getTracks().forEach(track => track.stop());
}
 */
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
let localStream;
let remoteStream;
let localVideo = document.getElementById('localVideo');
let remoteVideo = document.getElementById('remoteVideo');

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

async function startChat() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); // الحصول على تصريح لاستخدام الكاميرا والميكروفون
        webrtc.startLocalVideo(); // بدء تشغيل الفيديو المحلي

        // الانضمام إلى غرفة الدردشة
        webrtc.joinRoom('your-room-id'); // استبدال 'your-room-id' بمعرف الغرفة الخاصة بك

    } catch (error) {
        console.error('Error starting chat:', error);
    }
}

function stopChat() {
    webrtc.leaveRoom(); // مغادرة الغرفة
    webrtc.stopLocalVideo(); // إيقاف تشغيل الفيديو المحلي
}
