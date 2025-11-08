function crc16(data: string): string {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
        crc ^= data.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
        }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

export function generatePromptPayQR(mobileNumber: string, amount?: number): string {
    const mobile = `66${mobileNumber.substring(1)}`;
    const hasValidAmount = typeof amount === 'number' && amount > 0;

    const f00 = '000201';
    const f01 = hasValidAmount ? '010212' : '010211';
    
    const f29_00 = '0016A000000677010111'; // PromptPay GUID
    const f29_01 = `01${mobile.length.toString().padStart(2, '0')}${mobile}`; // Mobile number
    const f29_content = `${f29_00}${f29_01}`;
    const f29 = `29${f29_content.length.toString().padStart(2, '0')}${f29_content}`;

    const f53 = '5303764'; // THB currency code
    
    let f54 = '';
    if (hasValidAmount) {
        const amountStr = amount.toFixed(2);
        f54 = `54${amountStr.length.toString().padStart(2, '0')}${amountStr}`;
    }
    
    const f58 = '5802TH'; // Thailand country code
    const f63 = '6304';

    const payloadWithoutChecksum = `${f00}${f01}${f29}${f53}${f54}${f58}${f63}`;
    
    const checksum = crc16(payloadWithoutChecksum);

    return `${payloadWithoutChecksum}${checksum}`;
}
