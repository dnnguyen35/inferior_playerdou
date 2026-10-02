const introAudio = document.getElementById('intro-sound');
const alertBox = document.getElementById('alert-box');
const donorInfo = document.getElementById('donor-info');
const donorMessage = document.getElementById('donor-message');

let currentAlertId = 0;

let hideTimeout = null;
let introTimeout = null;
let ttsAudio = null;

function processAlert(data) {

    currentAlertId++;

    const alertId = currentAlertId;

    if (hideTimeout) {

        clearTimeout(hideTimeout);

        hideTimeout = null;
    }

    if (introTimeout) {

        clearTimeout(introTimeout);

        introTimeout = null;
    }

    if (ttsAudio) {

        ttsAudio.pause();

        ttsAudio.currentTime = 0;

        ttsAudio = null;
    }

    introAudio.pause();

    introAudio.currentTime = 0;

    donorInfo.innerText =
        `${data.sender} vừa donate ${data.amount.toLocaleString('vi-VN')}đ!`;

    donorMessage.innerText =
        `"${data.message}"`;

    alertBox.style.display = 'block';

    function startTts() {

        if (alertId !== currentAlertId) {
            return;
        }


        if (!data.ttsUrl) {

            console.error(
                'Không có ttsUrl trong donation:',
                data
            );

            return;
        }


        console.log(
            'Bắt đầu phát TTS:',
            data.ttsUrl
        );


        ttsAudio = new Audio(data.ttsUrl);

        ttsAudio.volume = 1.0;

        ttsAudio.onplay = () => {

            console.log(
                'TTS bắt đầu đọc'
            );

        };

        ttsAudio.onended = () => {

            console.log(
                'TTS đọc xong'
            );


            if (alertId !== currentAlertId) {
                return;
            }


            ttsAudio = null;

            hideTimeout = setTimeout(() => {

                if (alertId !== currentAlertId) {
                    return;
                }


                alertBox.style.display = 'none';

                hideTimeout = null;


            }, 2000);
        };

        ttsAudio.onerror = (error) => {

            console.error(
                'TTS audio error:',
                error
            );

        };

        ttsAudio.play().catch(error => {

            console.error(
                'Không thể phát TTS:',
                error
            );

        });
    }

    introAudio.volume = 0.6;

    introAudio.currentTime = 0;


    introAudio.play().catch(error => {

        console.error(
            'Không thể tự động phát intro sound:',
            error
        );

    });

    introTimeout = setTimeout(() => {

        // Donate này đã bị donate mới thay thế
        if (alertId !== currentAlertId) {
            return;
        }


        console.log(
            'Intro đã chạy 7 giây → chuyển sang TTS'
        );


        // Dừng intro
        introAudio.pause();

        introAudio.currentTime = 0;

        introTimeout = null;

        startTts();


    }, 7000);
}

const socket =
    io('http://localhost:3000');


socket.on('connect', () => {

    console.log(
        'Hệ thống Alert đã kết nối thông suốt với Server Realtime! ID:',
        socket.id
    );

});


socket.on('disconnect', () => {

    console.log(
        'Cảnh báo: Mất kết nối mạng tới Server!'
    );

});

socket.on('new-donation', (data) => {

    console.log(
        'Nhận được dữ liệu tiền về thật từ Webhook:',
        data
    );


    processAlert(data);

});

const longTest = document.getElementById('long-test');

const shortTest = document.getElementById('short-test');

if (longTest) {

    longTest.addEventListener('click', () => {

        processAlert({

            sender:
                'adasdasdasdasdadadasdadadasdasdadadasda',

            amount:
                50000,

            message:
                `Chúc streamer luôn vui vẻ, hạnh phúc và thành công trong mọi việc!
                Đây là một tin nhắn dài để kiểm tra xem hệ thống có thể xử lý tốt không.
                Chúc streamer luôn vui vẻ, hạnh phúc và thành công trong mọi việc!
                Đây là một tin nhắn dài để kiểm tra xem hệ thống có thể xử lý tốt không.
                Chúc streamer luôn vui vẻ, hạnh phúc và thành công trong mọi việc!
                Đây là một tin nhắn dài để kiểm tra xem hệ thống có thể xử lý tốt không.
                Chúc streamer luôn vui vẻ, hạnh phúc và thành công trong mọi việc!
                Đây là một tin nhắn dài để kiểm tra xem hệ thống có thể xử lý tốt không.
                Chúc streamer luôn vui vẻ, hạnh phúc và thành công trong mọi việc!`,
            ttsUrl:
                'YOUR_CLOUDINARY_TTS_URL'

        });

    });

}

if (shortTest) {

    shortTest.addEventListener('click', () => {

        processAlert({
            sender:
                'abcxyz',
            amount:
                10000,
            message:
                'Chúc streamer vui vẻ!',
            ttsUrl:
                'YOUR_CLOUDINARY_TTS_URL'
        });

    });

}
