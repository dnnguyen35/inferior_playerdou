const form = document.getElementById('donation-form');

const senderInput = document.getElementById('sender');
const amountInput = document.getElementById('amount');
const messageInput = document.getElementById('message');

const messageCount = document.getElementById('message-count');

const submitButton =
    document.getElementById('submit-button');

const buttonText =
    document.getElementById('button-text');

const errorElement =
    document.getElementById('error');

const API_URL = 'http://localhost:3000';

const MIN_AMOUNT = 5000;
const MAX_MESSAGE_LENGTH = 500;

document
    .querySelectorAll('.quick-amounts button')
    .forEach((button) => {

        button.addEventListener('click', () => {

            const amount =
                Number(button.dataset.amount);

            amountInput.value = amount;
        });
    });

messageInput.addEventListener('input', () => {

    const length =
        messageInput.value.length;

    messageCount.innerText =
        `${length}/${MAX_MESSAGE_LENGTH}`;
});

form.addEventListener('submit', async (event) => {

    event.preventDefault();

    errorElement.innerText = '';

    const sender =
        senderInput.value.trim();

    const amount =
        Number(amountInput.value);

    const message =
        messageInput.value.trim();


    if (!sender) {

        errorElement.innerText =
            'Vui lòng nhập tên của bạn.';

        senderInput.focus();

        return;
    }

    if (
        !Number.isInteger(amount) ||
        amount < MIN_AMOUNT
    ) {

        errorElement.innerText =
            'Số tiền tối thiểu là 5.000 VNĐ.';

        amountInput.focus();

        return;
    }

    if (
        message.length > MAX_MESSAGE_LENGTH
    ) {

        errorElement.innerText =
            'Lời nhắn không được vượt quá 500 ký tự.';

        messageInput.focus();

        return;
    }

    const paymentWindow =
        window.open('', '_blank');

    if (!paymentWindow) {

        errorElement.innerText =
            'Vui lòng cho phép popup để tiếp tục thanh toán.';

        return;
    }

    submitButton.disabled = true;

    buttonText.innerText =
        'Đang tạo thanh toán...';

    try {

        const response =
            await fetch(
                `${API_URL}/api/donations`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        sender,
                        amount,
                        message
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                'Không thể tạo thanh toán.'
            );
        }

        console.log(
            'Payment created:',
            data
        );



        paymentWindow.location.href = data.checkoutUrl;

        messageInput.value = '';

        messageCount.innerText =
            '0/500';

        setTimeout(() => {

            submitButton.disabled = false;

            buttonText.innerText =
                'Tiếp tục thanh toán';

        }, 2000);

    } catch (error) {

        console.error(
            'Create donation error:',
            error
        );

        paymentWindow.close();

        errorElement.innerText =
            error.message ||
            'Có lỗi xảy ra. Vui lòng thử lại.';

        submitButton.disabled = false;

        buttonText.innerText =
            'Tiếp tục thanh toán';
    }
});
