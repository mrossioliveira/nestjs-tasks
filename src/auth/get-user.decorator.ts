import { createParamDecorator } from '@nestjs/common';

export const GetUserId = createParamDecorator((_, req): number => {
  const authHeader = req.headers['authorization'];

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    console.log(token);
    const decodedToken = parseJwt(token);
    return decodedToken['user_id'];
  }

  return 0;
});

const parseJwt = token => {
  try {
    const base64Payload = token.split('.')[1];
    let payload = new Uint8Array();

    try {
      payload = Buffer.from(base64Payload, 'base64');
    } catch (err) {
      throw new Error(`parseJwt# Malformed token: ${err}`);
    }

    return JSON.parse(payload.toString());
  } catch (err) {
    return {
      error: 'Unable to decode token.',
    };
  }
};
