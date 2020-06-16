import { createParamDecorator } from '@nestjs/common';

export const GetUserId = createParamDecorator((data, req): number => {
  return req.userId;
});
