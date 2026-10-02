import cloudinary from '../config/cloudinary.js';
import elevenlabs from '../config/elevenlabs.js';

const generateDonationTts = async ({
    sender,
    amount,
    message
}) => {

    const formattedAmount = amount.toLocaleString('vi-VN');

    const textToSpeak =
        `Cảm ơn ${sender} đã donate ${formattedAmount} đồng. ` +
        `Lời nhắn: ${message || ''}`;

    console.log('Generating TTS:', textToSpeak);

    const audioStream =
        await elevenlabs.textToSpeech.convert(
            process.env.ELEVENLABS_VOICE_ID,
            {
                text: textToSpeak,
                modelId: 'eleven_flash_v2_5',
                outputFormat: 'mp3_22050_32'
            }
        );

    const chunks = [];

    for await (const chunk of audioStream) {
        chunks.push(chunk);
    }

    const audioBuffer = Buffer.concat(chunks);

    console.log(
        'TTS generated:',
        audioBuffer.length,
        'bytes'
    );

    const uploadResult = await new Promise(
        (resolve, reject) => {

            const uploadStream =
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'video',
                        folder: 'donation-tts',
                        format: 'mp3'
                    },
                    (error, result) => {

                        if (error) {
                            reject(error);
                            return;
                        }

                        resolve(result);
                    }
                );

            uploadStream.end(audioBuffer);
        }
    );

    console.log(
        'TTS uploaded to Cloudinary:',
        uploadResult.secure_url
    );

    return uploadResult.secure_url;
};

export {
    generateDonationTts
};